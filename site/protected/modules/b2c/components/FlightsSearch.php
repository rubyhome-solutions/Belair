<?php

namespace b2c\components;

use b2c\models\Flight;
use b2c\models\FlightsSearchForm;

class FlightsSearch {
    const MAX_RESULTS = 100;
    const MAX_DOMESTIC_DURATION = 480; // min

    static public function prepareSearchForm($data) {
        $form = new FlightsSearchForm();
        $form->adults = $data['passengers'][0];
        $form->children = $data['passengers'][1];
        $form->infants = $data['passengers'][2];
        $form->source = $data['from'];
        $form->destination = $data['to'];
        $form->depart = $data['depart_at'];
        $form->return = $data['return_at'];
        $form->category = $data['cabinType'];
        $form->is_domestic = $data['domestic'];

        return $form;
    }

    static public function create($data, $cs = \ClientSource::SOURCE_DIRECT) {
        $form = static::prepareSearchForm($data);
        if (!$form->validate()) {
            throw new B2cException(4000, 'Insufficient flight data');
        }
        return new static(\Searches::populate($form, isset($data['force']) && $data['force']), $cs);
    }

    static public function factory(\Searches $s, $cs = \ClientSource::SOURCE_DIRECT) {
        return new static($s, $cs);
    }


    public $search;
    public $cs;


    public function __construct(\Searches $search, $cs = \ClientSource::SOURCE_DIRECT) {
        $this->cs = $cs;
        $this->search = $search;
    }

    public function isPending() {
        $pending = false;
        foreach ($this->search->processes as $process) {
            if (!$process->ended) {
                $pending = true;
            }
        }

        return $pending;
    }

    public function flightsOneWay($updated = null) {
        $flights = [];
        foreach ($this->search->getBestPricedMatchesOneWay(static::MAX_RESULTS) as $rcs) {
            if (empty($rcs))
                continue;

            $flight = Flight::create($this->search, $rcs, $this->cs);
            if ($this->search->is_domestic && $flight->time > static::MAX_DOMESTIC_DURATION) {
                continue;
            }

            if (null == $updated || $flight->updatedSince($updated)) {
                $flights[] = $flight;
            }
        }

        return $flights;
    }

    public function flightsByDirection($direction, $updated = null) {
        $flights = [];
        foreach ($this->search->getMatchesByDirection($direction, static::MAX_RESULTS) as $rcs) {
            if (empty($rcs))
                continue;

            $flight = Flight::create($this->search, $rcs, $this->cs);

            if ($this->search->is_domestic && $flight->time > static::MAX_DOMESTIC_DURATION) {
                continue;
            }

            if (null == $updated || $flight->updatedSince($updated)) {
                $flights[] = $flight;
            }
        }

        return $flights;
    }


    public function toJson($updated = null) {
        $flights = $this->flightsOneWay($updated);

        return !empty($flights) ?  array_map(function($i) { $flight = $i->toJson();if($flight !== null) {return $flight;} }, $flights) : [];
    }


    
}