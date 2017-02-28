<?php

namespace b2c\components;

use b2c\models\Flight;
use b2c\models\FlightsManagerForm;

class FlightsSearchManager {
    static public function parse($url, $force = false, $cs = \ClientSource::SOURCE_DIRECT) {
        $form = new FlightsManagerForm();
        $form->force = $force;
        $form->cs = (int)$cs;

        $query = explode(';', strtolower($url));

        if (isset($query[0][0]) && false === strpos($query[0], '-')) {
            $data = explode('/', $query[0]);
            foreach ($data as $i) {
                if (in_array($i, ['d', 'i'])) {
                    $form->domestic = 'd' == $i ? 1 : 0;
                }

//                if (in_array($i, ['e','y','b','c','f','w'])) {
//                    $form->cabinType = \CabinType::$cabinClassCodeToId[strtoupper($i)];
//                }

                if (in_array($i, ['1','2','3','4'])) {
                    $form->cabinType = $i;
                }

                if (strpos($i, ',')) {
                    $form->passengers = explode(',', $i);
                }
            }

            array_shift($query);
        }

        $form->tripType = count($query) > 1 ? 3 : null;
        foreach ($query as $idx => $segment) {
            $data = explode('/', strtoupper($segment));

            if (!$form->tripType) {
                $form->tripType = 3 == count($data) ? 2 : 1;
            }

            if ( (count($data) != 2 && $form->tripType != 2) || (count($data) != 3 && $form->tripType == 2) ) {
                throw new B2cException(4000, 'Incorrect search segment ' . ($idx+1));
            }


            $ap = explode('-', $data[0]);
            $airports = [];
            foreach (\Airport::model()->findAllByAttributes(['airport_code' => $ap]) as $i) {
                $airports[$i->airport_code] = $i;
            }


            if (2 != count($airports)) {
                throw new B2cException(4000, 'Incorrect airports at segment ' . ($idx+1));
            }
            if (empty($airports[$ap[0]]->id)) {
                throw new B2cException(4000, 'Incorrect airports at segment ' . ($idx+1));
            }
            if (empty($airports[$ap[1]]->id)) {
                throw new B2cException(4000, 'Incorrect airports at segment ' . ($idx+1));
            }


            $flight = [
                'from' => $airports[$ap[0]]->id,
                'to' => $airports[$ap[1]]->id,
                'depart_at' => $data[1],
                'return_at' => 2 == $form->tripType ? $data[2] : null
            ];

            $form->flights[] = $flight;
        }

        if ($form->validate()) {
            return static::create($form->attributes, $cs);
        } else {
            throw new B2cException(4000, 'Incorrect search params', $form->getErrors());
        }
    }

    static public function create(array $data, $cs = \ClientSource::SOURCE_DIRECT) {
        $form = new FlightsManagerForm();
        $form->attributes = $data;
        settype($form->cabinType, 'integer') or $form->cabinType = \CabinType::ECONOMY;
        if (!$form->validate()) {
            throw new B2cException(4001, 'Validation Exception', $form->getErrors());
        }

        $manager = new static;
        $manager->initial = true;
        $manager->form = $form;

        if (!isset($data['flights']))
            throw new B2cException(4000, 'Flights are missing');

        $flights = $data['flights'];
        unset($data['flights']);
        $manager->data = $data;
        if (2 == $data['tripType'] && $data['domestic']) {
            $flight = $flights[0];

            $manager->searches = [
                // roundtrip search
                FlightsSearch::create(array_merge($manager->data, $flight), $cs),
                // onward search
                FlightsSearch::create(
                    array_merge($manager->data,
                        [ 'from' => $flight['from'], 'to' => $flight['to'], 'depart_at' => $flight['depart_at'], 'return_at' => null ]
                ),
                    $cs
                ),
                // backward flight
                FlightsSearch::create(
                    array_merge($manager->data,
                        [ 'from' => $flight['to'], 'to' => $flight['from'], 'depart_at' => $flight['return_at'], 'return_at' => null ]
                ),
                    $cs
                ),

            ];
        } else {
            foreach ($flights as $flight) {
                $manager->searches[] = FlightsSearch::create(array_merge($manager->data, $flight), $cs);
            }
        }


        return $manager;
    }

    static public function factory(array $options, array $ids) {
        $manager = new static;
        $cs = isset($options['cs']) ? $options['cs'] : \ClientSource::SOURCE_DIRECT;

        $manager->data = $options;
        foreach ($ids as $id) {
            $search = \Searches::model()->findByPk($id);
            if (!$search) {
                throw new B2cException(4000, 'Searches not found');
            }

            $manager->searches[] = FlightsSearch::factory($search, $cs);
        }

        return $manager;
    }

    public $initial = false;
    public $searches = [];
    public $data = [];
    public $form = null;


    public function searchJson($updated = null) {
        $out = $this->form ? $this->form->attributes : [];

        if ($this->form) {
            $out['url'] = $this->form->getSearchUrl();
        }

        $out['ids'] = array_map(function ($i) { return $i->search->id; }, $this->searches);
        return $out;
    }


    public function progressJson($updated = null) {
        $pending = false;
        foreach ($this->searches as $search) {
            if ($search->isPending()) {
                $pending = true;
            }
        }


        if (2 == $this->data['tripType']) {
            if ($this->data['domestic']) {
                return [
                    'pending' => $pending,
                    'updated' => time(),
                    'ids' => array_map(function($i) { return $i->search->id; }, $this->searches),
                    'flights' => $pending ? [$this->searches[1]->toJson(), $this->searches[2]->toJson()]
                        : $this->_combineRoundtripSearches($this->searches),
                    'prices' => $this->_calcRoundtripPrices($this->searches)
                ];
            } else {
                return [
                    'pending' => $pending,
                    'updated' => time(),
                    'ids' => array_map(function($i) { return $i->search->id; }, $this->searches),
                    'flights' => $pending ? array_map(function($i) use ($updated) { $flight = $i->toJson($updated);if($flight !== null) {return $flight;}}, $this->searches)
                        : $this->_combineGDSnLLCResults($this->searches[0]),

                ];
            }


        } else {
            return [
                'pending' => $pending,
                'updated' => time(),
                'ids' => array_map(function($i) { return $i->search->id; }, $this->searches),
                'flights' => array_map(function($i) use ($updated) { $flight = $i->toJson($updated);if($flight !== null) {return $flight;}}, $this->searches)
            ];
        }
    }

    protected function _combineGDSnLLCResults($search) {
        $out = [];

        foreach ($search->flightsOneWay() as $i) {
            $flight = $i->toJson();
            if($flight === null) {
                continue;
            }
            $out[] = $flight;
        }

        $groupings = [];
        foreach ($search->flightsByDirection(\RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO) as $i) {
            $grp = $i->routes[0][0]->grouping;
            if (!$grp)
                continue;

            if (!isset($groupings[$grp]))
                $groupings[$grp] = [[],[]];

            $groupings[$grp][0][] = $i;
        }

        foreach ($search->flightsByDirection(\RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO) as $i) {
            $grp = $i->routes[0][0]->grouping;
            if (!$grp)
                continue;

            if (!isset($groupings[$grp]))
                $groupings[$grp] = [[],[]];

            $groupings[$grp][1][] = $i;
        }

        foreach ($groupings as $flights) {
            foreach ($flights[0] as $i) {
                foreach ($flights[1] as $j) {
                    $out[] = Flight::merge([$i, $j])->toJson();
                }
            }

        }

        return [$out];
    }

    protected function _combineRoundtripSearches($searches, $updated = null) {
        $c = 1;

        $onward = [];
        foreach ($searches[1]->flightsOneWay() as $i) {
            $flight = $i->toJson();
            if($flight === null) {
                continue;
            }
            $flight['groupings'] = [];

            $onward[$this->_segmentsId($flight['segments'][0])] = $flight;
        }

        $backward = [];
        foreach ($searches[2]->flightsOneWay() as $i) {
            $flight = $i->toJson();
            if($flight === null) {
                continue;
            }
            $flight['groupings'] = [];
            $backward[$this->_segmentsId($flight['segments'][0])] = $flight;
        }

        foreach ($searches[0]->flightsOneWay() as $i) {
            $flight = $i->toJson();
            if($flight === null) {
                continue;
            }
            if (count($flight['segments']) != 2) {
                continue;
            }

            list($ow, $bw) = $flight['segments'];

            $ow_id = $this->_segmentsId($ow);
            $bw_id = $this->_segmentsId($bw);

            if (isset($onward[$ow_id]) && isset($backward[$bw_id])) {
                $discount = $onward[$ow_id]['price'] + $backward[$bw_id]['price'] - $flight['price'];

                //var_dump($ow_id,$flight['price'], $onward[$ow_id]['price'], $backward[$bw_id]['price'], null);

                //if ($discount > 10) {
                $onward[$ow_id]['groupings'][] = (string)$c;

                $backward[$bw_id]['groupings'][$c] = [
                    'system' => $flight['system'],
                    'price' => $flight['price'],
                    'discount' => $discount
                ];

                $c++;
                //}
            }
        }

        foreach ($searches[0]->flightsByDirection(\RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO) as $i) {
            $flight = $i->toJson();
            if($flight === null) {
                continue;
            }
            $id = $this->_segmentsId($flight['segments'][0]);

            if (isset($onward[$id])) {
                $onward[$id]['groupings'][$i->routes[0][0]->grouping] = [
                    'system' => $flight['system'],
                    'price' => $flight['price']
                ];
            }
        }

        foreach ($searches[0]->flightsByDirection(\RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO) as $i) {
            $flight = $i->toJson();
            if($flight === null) {
                continue;
            }
            $id = $this->_segmentsId($flight['segments'][0]);

            if (isset($backward[$id])) {
                $backward[$id]['groupings'][$i->routes[0][0]->grouping] = [
                    'system' => $flight['system'],
                    'price' => $flight['price']
                ];
            }
        }

        return [array_slice($onward, 0, 100), array_slice($backward, 0, 100)];
    }

    protected function _calcRoundtripPrices($searches) {
        $prices = [];

        foreach ($searches[0]->flightsOneWay() as $i) {
            $prices[$i->carrier->code] = !isset($prices[$i->carrier->code]) ? $i->commercialPrice : min($prices[$i->carrier->code], $i->commercialPrice);
        }

        $groupings = [];
        foreach ($searches[0]->flightsByDirection(\RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO) as $i) {
            $groupings[$i->carrier->code][$i->routes[0][0]->grouping][0] = !isset($groupings[$i->carrier->code][$i->routes[0][0]->grouping][0])
                ? $i->commercialPrice
                : min($groupings[$i->carrier->code][$i->routes[0][0]->grouping][0], $i->commercialPrice);
        }

        foreach ($searches[0]->flightsByDirection(\RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO) as $i) {
            $groupings[$i->carrier->code][$i->routes[0][0]->grouping][1] = !isset($groupings[$i->carrier->code][$i->routes[0][0]->grouping][1])
                ? $i->commercialPrice
                : min($groupings[$i->carrier->code][$i->routes[0][0]->grouping][1], $i->commercialPrice);
        }

        foreach ($searches[1]->flightsOneWay() as $i) {
            $groupings[$i->carrier->code][1][0] = !isset($groupings[$i->carrier->code][1][0])
                ? $i->commercialPrice
                : min($groupings[$i->carrier->code][1][0], $i->commercialPrice);
        }

        foreach ($searches[2]->flightsOneWay() as $i) {
            $groupings[$i->carrier->code][1][1] = !isset($groupings[$i->carrier->code][1][1])
                ? $i->commercialPrice
                : min($groupings[$i->carrier->code][1][1], $i->commercialPrice);
        }


        foreach ($groupings as $code => $g) {
            $price = NULL;
            foreach ($g as $i) {
                $price = array_sum($i);
                $size = count($i);
                if ($size != 2) {
                    $prices[$code] = NULL;
                } else {
                    if (!isset($prices[$code]) || $price < $prices[$code]) {
                        $prices[$code] = $price;
                    }
                }
            }
        }

        return $prices;
    }

    protected function _segmentsId($segments) {
        $ids = [];
        foreach ($segments as $j) {
            $ids[] = $j['id'];
        }

        return implode('-', $ids);
    }

}
