<?php

namespace application\components\client_sources\DeepLink;

/**
 * DeepLink Flight
 *
 * @author Boxx
 */
class Flight {

    public $totaljourneyduration = 0;
    public $flightdeeplinkurl = null;

    /**
     * @var FlightFare
     */
    public $flightfare = null;

    /**
     *
     * @var FlightLeg[]
     */
    public $flightlegs = [];

    public function __construct() {
        $this->flightfare = new FlightFare;
    }

}
