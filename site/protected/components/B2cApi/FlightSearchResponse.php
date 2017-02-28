<?php

namespace application\components\B2cApi;

/**
 * DeepLink FlightSearchResponse
 *
 * @author Boxx
 */
class FlightSearchResponse {

    public $journeysCount = 0;
    public $onwardCount = 0;
    public $backwardCount = 0;
    private $searchKey = null;
//    public $link = null;

    /**
     * Array of flights (journeys)
     * @var Flight[]
     */
    public $journeys = [];

    /**
     * Array of the onward flights (journeys). This is used only in 2-way trips and only by LLCs
     * @var Flight[]
     */
    public $onward = [];

    /**
     * Array of the return flights (journeys). This is used only in 2-way trips and only by LLCs
     * @var Flight[]
     */
    public $backward = [];

    /**
     * Array with the added RouteCache object to the response
     * @var \RoutesCache[]
     */
    private $routeCaches = [];
    static private $domintMap = [
        \ServiceType::DOMESTIC_AIR => 'domestic',
        \ServiceType::INTERNATIONAL_AIR => 'international',
    ];

    public function __construct($searchId) {
        $this->searchKey = $searchId;
    }

    /**
     * Add recomendation to the response<br>
     * When 2 RouteCache objects are given The flight is 2way and second object is the return journey
     * @param array $arrRcs Array of array of RouteCache elements.<br>
     * This is array of journeys and in each journey we have specific RC element for each pax type.<br>
     * For 2 journeys: [[paxTypeARc, paxTypeBRc],[paxTypeARc, paxTypeBRc]]
     */
    function addRecomendation(array $arrRcs, $element = 'journeys') {
        $fare = new FlightFare;
        $flight = new Flight;
        $arrRcIds = [];
        $legs = [];
        foreach ($arrRcs as $journey) {
            $rcIds = [];
            foreach ($journey as $key => $rc) {
                /* @var $rc \RoutesCache */
                $fare->addRouteCacheFees($rc);
                if ($key === 0) {     // Add the legs - this is the same for all the paxes
                    $tmp = FlightLeg::addRouteCacheLegs($rc);
                    $flight->journeyDuration += $tmp['totalDuration'];
                    unset($tmp['totalDuration']);
                    $legs[] = $tmp;
                }
                $rcIds[] = $rc->id;
            }
            $arrRcIds[] = $rcIds;
        }
//        $flight-> = $this->searchKey . "+" . json_encode($arrRcIds);
        $flight->bookingKey = "s=$this->searchKey&rc=" . json_encode($arrRcIds) . "&ts=" . time();
        $flight->flightLegs = $legs;
        $flight->fare = $fare;
        $flight->grouping = $element === 'journeys' ? 0 : (int) $rc->grouping;
        $flight->closeGroupFare = $rc->specialRoundTripDiscountFare() ? 1 : 0;

        array_push($this->$element, $flight);
    }

    /**
     * Reorder the flight recomendations by total price and cut the excess results
     * @param int $maxResults The max results limit
     */
    function sortByPrice($maxResults = 25) {
        if (empty($this->journeys)) {
            return; // Exit if there are no recommendations to sort
        }
        $original = $this->journeys;
        foreach ($original as $key => $value) {
            $sorted[$key] = $value->fare->totalBaseFare + $value->fare->totalTax;
        }
        asort($sorted, SORT_NUMERIC);
        foreach ($sorted as $key => $value) {
            // Remove the grouping parameters since those are not used in GDS responses
            unset($original[$key]->grouping, $original[$key]->closeGroupFare);
            $out[] = $original[$key];
            if (count($out) >= $maxResults) {
                break;  // Do not attach more results
            }
        }
        $this->journeys = $out;
    }

}
