<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\FlightTransformer;

class Flight extends \CFormModel {
    const MSG_MALFORMED_ROUTES = 'Malformed routes';
    const MSG_PAX_NOT_MATCH = 'Pax count does not match';
    const MSG_RC_MISSING = 'RoutesCache object is not found';
    const MSG_MALFORMED_PARAMS = 'Malformed params';

    /**
     * will create Flight object based on \Searches and \RouteCaches
     *
     * @param \Searches $s
     * @param \RoutesCache $rcs[][]
     * @param int $cs
     * @return static
     * @throws B2cException
     */
    static public function create($s, $rcs, $cs = \ClientSource::SOURCE_DIRECT) {
        $form = new static;

        $form->search = $s;

        if (!$form->search) {
            throw new B2cException(4000, static::MSG_MALFORMED_PARAMS);
        }

        if (\Searches::TYPE_MULTICITY == $form->search->type_id) {
            throw new B2cException(4000, 'Multicity is not supported yet');
        }

        $form->routes = $rcs;
        $form->_clientSource = $cs;

        if (count($form->routes[0])) {
            $form->_airSource = $form->routes[0][0]->airSource;
            $form->_carrier = $form->routes[0][0]->carrier;
            $form->_bookingClass = $form->routes[0][0]->extractJsonLegElement('bookingClass')[0];
        }

        $form->_calcCommercialPriceAndTaxes();

        return $form;
    }

    static public function merge($flights) {
        $s = $flights[0]->search;
        $cs = $flights[0]->clientSource;

        $rcs = [];
        foreach ($flights as $flight) {
            $rcs = array_merge($rcs, $flight->routes);
        }

        return static::create($s, $rcs, $cs);
    }

    /**
     * @var \Searches
     */
    protected $_search;

    /**
     * @var \RoutesCache[][]
     */
    protected $_routes;

    /**
     * @var int
     */
    protected $_clientSource;

    /**
     * @var int
     */
    protected $_bookingClass;

    /**
     * @var \AirSource
     */
    protected $_airSource;

    /**
     * @var \Carrier
     */
    protected $_carrier;

    protected $_commercialPrice;
    protected $_taxes;
    protected $_pax_taxes;

    public $priceDiff = null;

    /**
     * @return array
     */
    public function rules() {
        return [
            ['id, search, routes, clientSource', 'required'],
            //['routes', 'validateRoutes']
        ];
    }

    /**
     * @return array
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'search' => 'Search',
            'routes' => 'Routes',
            'clientSource' => 'Client Source',
            'timestamp' => 'Timestamp'
        ];
    }


    /**
     * @return mixed
     */
    public function getSearch() { return $this->_search; }

    /**
     * @param \Searches $search
     */
    public function setSearch($search) { $this->_search = $search instanceof \Searches ? $search : \Searches::model()->findByPk($search); }

    /**
     * @return \RoutesCache[][]
     */
    public function getRoutes() { return $this->_routes; }

    /**
     * @param \RoutesCache[][] $routes
     */
    public function setRoutes(array $routes)
    {
        $this->_routes = [];

        foreach ($routes as $j => $jroutes) { // journey level
            if (is_array($jroutes)) {
                $this->_routes[$j] = [];

                foreach ($jroutes as $k => $route) { // flight routes
                    $this->_routes[$j][$k] = $route instanceof \RoutesCache ? $route : \RoutesCache::model()->findByPk($route);
                }
            }
        }
    }
    
    /**
     * Force Update
     * @param \RoutesCache[][] $routes
     */
    public function setRoutesByForce(array $routes)
    {
        $this->_routes = [];

        foreach ($routes as $j => $jroutes) { // journey level
            if (is_array($jroutes)) {
                $this->_routes[$j] = [];

                foreach ($jroutes as $k => $route) { // flight routes
                    $this->_routes[$j][$k] =  \RoutesCache::model()->findByPk($route->id);
                }
            }
        }
    }

    /**
     * @return \AirSource
     */
    public function getAirSource() { return $this->_airSource; }

    /**
     * @return \Carrier
     */
    public function getCarrier() { return $this->_carrier; }

    /**
     * @return int
     */
    public function getClientSource() { return $this->_clientSource; }

    /**
     * @return int
     */
    public function getBookingClass() { return $this->_bookingClass; }

    /**
     * @return int
     */
    public function getRefundable()
    {
        return \FareType::getFareType($this->getAirSource()->id, $this->getBookingClass(), $this->routes[0][0]->service_type_id === \FareType::FARE_REFUNDABLE);
    }

    public function getCommercialPrice() { return $this->_commercialPrice; }
    public function getTaxes() { return $this->_taxes; }
    public function getPaxTaxes() { return $this->_pax_taxes; }

    public function getOrigin() {
        return $this->routes[0][0]->origin;
    }

    public function getDestination() {
        return $this->routes[0][0]->destination;
    }


    /**
     * @return bool
     */
    public function isRoundTrip()
    {
        return null !== $this->search->date_return;
    }

    /**
     * @return bool
     */
    public function isGDS()
    {
        if(!isset($this->airSource->backend->isGds)) {
            return false;
        }
        return $this->airSource->backend->isGds;
    }

    public function updatedSince($updated) {
        if (!is_numeric($updated))
            $updated = strtotime($updated);


        $ok = true;
        array_walk_recursive($this->_routes, function($rc) use ($updated, &$ok) {
            if ($rc instanceof \RoutesCache) {
                if (strtotime($rc->updated) - $updated <= 0) {
                    $ok = false;
                }
            }
        });

        return $ok;
    }

    /**
     * @return array
     */
    public function toJson() { return FlightTransformer::json($this); }

    public function getTime() {
        $legs = $this->isGDS() ? json_decode($this->routes[0][0]->legs_json)[0] : json_decode($this->routes[0][0]->legs_json);

        $arrive = null;
        $time = null;
        foreach ($legs as $i) {
            $time += \Utils::convertHoursMinsToMins($i->time);

//            if (null !== $arrive) {
//                $time += (strtotime($i->depart) - $arrive) / 60;
//            }

            $arrive = strtotime($i->arrive);
        }

        return $time;
    }


    protected function _calcCommercialPriceAndTaxes() {
        $cp = \CommercialPlan::findB2cPlan();
        $cs = $this->clientSource;
        $s = $this->search;

        $c = [null, $s->adults, $s->children, $s->infants];


        $price = 0;
        $taxes = ['basic_fare' => 0, 'yq' => 0, 'jn' => 0, 'other' => 0];
        $pax_taxes = [];

        array_walk_recursive($this->_routes, function($i) use ($cp, $cs, $s, $c, &$price, &$taxes, &$pax_taxes) {
            if ($i instanceof \RoutesCache) {
                $rc = clone $i;
                $cp->applyPlanToRouteCache($rc, $cs);

                $price += $c[$rc->traveler_type_id] * ($rc->total_fare + $rc->total_tax_correction + $rc->bookingFee - $rc->discount);
                $taxes['basic_fare'] += $c[$rc->traveler_type_id] * $rc->base_fare;
                $taxes['yq'] += $c[$rc->traveler_type_id] * $rc->tax_yq;
                $taxes['jn'] += $c[$rc->traveler_type_id] * $rc->tax_jn;
                $taxes['other'] += $c[$rc->traveler_type_id] * ( $rc->tax_other + $rc->tax_psf + $rc->tax_udf  + $rc->bookingFee - $rc->discount);


                if (!isset($pax_taxes[$rc->traveler_type_id])) {
                    $pax_taxes[$rc->traveler_type_id] = ['c' => $c[$rc->traveler_type_id], 'basic_fare' => 0, 'yq' => 0, 'jn' => 0, 'other' => 0];
                }

                $pax_taxes[$rc->traveler_type_id]['basic_fare'] += $c[$rc->traveler_type_id] * $rc->base_fare;
                $pax_taxes[$rc->traveler_type_id]['yq'] += $c[$rc->traveler_type_id] * $rc->tax_yq;
                $pax_taxes[$rc->traveler_type_id]['jn'] += $c[$rc->traveler_type_id] * $rc->tax_jn;
                $pax_taxes[$rc->traveler_type_id]['other'] += $c[$rc->traveler_type_id] * ( $rc->tax_other + $rc->tax_psf + $rc->tax_udf  + $rc->bookingFee - $rc->discount);
                /* $pax_taxes[$rc->traveler_type_id]['total'] = $price; */
                $pax_taxes[$rc->traveler_type_id]['total'] = $pax_taxes[$rc->traveler_type_id]['basic_fare'] + $pax_taxes[$rc->traveler_type_id]['yq'] + $pax_taxes[$rc->traveler_type_id]['jn'] + $pax_taxes[$rc->traveler_type_id]['other'];
            }
        });

        $this->_commercialPrice = $price;
        $this->_taxes = $taxes;
        $this->_pax_taxes = $pax_taxes;

        return $price;
    }
}