<?php

namespace application\components\client_sources\DeepLink;

/**
 * DeepLink FlightSearchResponse
 *
 * @author Boxx
 */
class FlightSearchResponse {

    public $totalresults = 0;
    public $statuscode = 200;
    public $statusmessage = 'Success';
    private $nextrasearchkey = null;
    public $deeplinkurl = null;
    public $flightsearchrequest = null;
    private $clientSourceId;


    /**
     * Array of flights (journeys)
     * @var Flight[]
     */
    public $flightjourneys = [];

    /**
     * Array with the added RouteCache object to the response
     * @var \RoutesCache[]
     */
    private $routeCaches = [];
    static private $domintMap = [
        \ServiceType::DOMESTIC_AIR => 'domestic',
        \ServiceType::INTERNATIONAL_AIR => 'international',
    ];

    /**
     * Construct the response class
     * @param \application\components\client_sources\DeepLink\FlightSearchRequest $flightsearchrequest
     * @param int $domint \ServiceType::DOMESTIC_AIR or \ServiceType::INTERNATIONAL_AIR
     */
    public function __construct(FlightSearchRequest $flightsearchrequest = null, $searchId=null, $clientSourceId =  \ClientSource::SOURCE_DIRECT) {
        $this->flightsearchrequest = $flightsearchrequest;
        $this->nextrasearchkey = $searchId;
        $this->clientSourceId = $clientSourceId;
    }

    /**
     * Add recomendation to the response<br>
     * When 2 RouteCache objects are given The flight is 2way and second object is the return journey
     * @param array $arrRcs Array of array of RouteCache elements.<br>
     * This is array of journeys and in each journey we have specific RC element for each pax type.<br>
     * For 2 journeys: [[paxTypeARc, paxTypeBRc],[paxTypeARc, paxTypeBRc]]
     */
    function addRecomendation(array $arrRcs, \Searches $search) {
        $fare = new FlightFare;
        $flight = new Flight;
        $arrRcIds = [];
        $legs = [];
        foreach ($arrRcs as $journey) {
            $rcIds = [];
            foreach ($journey as $rcKey => $rc) {
                $fare->addRouteCacheFees($rc, $search);
                if ($rcKey === 0) {     // Add the legs - this is the same for all the paxes
                    $tmp = FlightLeg::addRouteCacheLegs($rc);
                    $flight->totaljourneyduration += $tmp['totalDuration'];
                    unset($tmp['totalDuration']);
                    if (count($tmp) > 1) {
                        $legs = $tmp;   // GDS 2-way case
                    } else {
                        $legs[] = $tmp[0];  // 1-way case for both GDS & LLC
                    }
                }
                $rcIds[] = $rc->id;
            }
            $arrRcIds[] = $rcIds;
        }
//        $flight->nextraflightkey = $this->nextrasearchkey . "+" . json_encode($arrRcIds);
        $flight->flightdeeplinkurl = $this->flightsearchrequest->hostInfo . \Yii::app()->request->requestUri . "link?s=$this->nextrasearchkey&rc=" . urlencode(json_encode($arrRcIds)) . "&ts=" . time() . "&cs=$this->clientSourceId";
        $flight->flightlegs = $legs;
        $flight->flightfare = $fare;

        $this->flightjourneys[] = $flight;
    }

    /**
     * Reorder the flight recomendations by total price and cut the excess results
     * @param int $maxResults The max results limit
     */
    function sortByPrice($maxResults = 25) {
        if (empty($this->flightjourneys)) {
            return; // Exit if there are no recommendations to sort
        }
        $original = $this->flightjourneys;
        foreach ($original as $key => $value) {
            $sorted[$key] = (int) $value->flightfare->totalnet;    //basefare + $value->flightfare->totaltax;
        }
        asort($sorted, SORT_NUMERIC);
        foreach ($sorted as $key => $value) {
            $out[] = $original[$key];
            if (count($out) >= $maxResults) {
                break;  // Do not attach more results
            }
        }
        $this->flightjourneys = $out;
    }

}
