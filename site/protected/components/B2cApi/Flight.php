<?php

namespace application\components\B2cApi;

/**
 * DeepLink Flight
 *
 * @author Boxx
 */
class Flight {

    public $bookingKey = null;
    public $journeyDuration = 0;
    public $grouping = 0;
    public $closeGroupFare = 0;

    /**
     * @var FlightFare
     */
    public $fare = null;

    /**
     *
     * @var FlightLeg[]
     */
    public $flightLegs = [];

    public function __construct() {
        $this->fare = new FlightFare;
    }

}
