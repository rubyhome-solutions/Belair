<?php

namespace application\components\client_sources\DeepLink;

/**
 * DeepLink FlightSearchRequest
 *
 * @author Boxx
 */
class FlightSearchRequest {

    /**
     * @var Auth
     */
    public $credentials = null;
    public $origin = null;
    public $destination = null;
    public $onwarddate = null; //YYYY-MM-DD
    public $returndate = null;
    public $numadults = 1;
    public $numchildren = 0;
    public $numinfants = 0;
    public $prefclass = 'E'; // E/F/C	E=economy	F=First Class	C=Business
    public $prefcarrier = 'All'; // All/2 Letter airline code
    public $numresults = 50;
    public $validationErrors = '';
    private $clientSourceId = 1;
    public $hostInfo;
    static $categoryMap = [
        'E' => \CabinType::ECONOMY,
        'F' => \CabinType::FIRST,
        'C' => \CabinType::BUSINESS,
    ];
    static $categoryIdToCode = [
        \CabinType::ECONOMY => 'E',
        \CabinType::FIRST => 'F',
        \CabinType::BUSINESS => 'C',
    ];

    const MAX_NUMRESULTS = 100;

    public function __construct() {
        $this->credentials = new Auth;
    }

    function validate() {
        if (!$this->authenticate()) {
            $this->validationErrors = 'Wrong username or password or officeid or the API is disabled';
            return false;
        }
        // Validate major fields
        if (strlen($this->origin) !== 3 || strlen($this->destination) !== 3 || empty($this->onwarddate)) {
            $this->validationErrors = 'Wrong input. Major data fields are malformed';
            return false;
        }
        // Validate if origin & destination are different
        if ($this->origin == $this->destination) {
            $this->validationErrors = 'Wrong input. Origin and destination should not be equal';
            return false;
        }
        // No numbers allowed origin & destination
        if (preg_match('#\d#', $this->origin) || preg_match('#\d#', $this->destination)) {
            $this->validationErrors = 'Wrong input. Numbers are not allowed in origin or destination';
            return false;
        }
        // Validate dates
        $onward = strtotime($this->onwarddate);
        if ($onward < strtotime(date(DATE_FORMAT))) {
            $this->validationErrors = 'Onward date is in the past';
            return false;
        }
        if (!empty($this->returndate)) {
            $back = strtotime($this->returndate);
            if ($back < $onward) {
                $this->validationErrors = 'Return date is before the onward date';
                return false;
            }
        }
        // Validate Paxes
        if ($this->numadults == 0 && ($this->numchildren == 0 || $this->numinfants > 0)) {
            $this->validationErrors = 'Infant can not travel without adult';
            return false;
        }

        // Validate Pax count
        if (($this->numadults + $this->numchildren + $this->numinfants) > 9) {
            $this->validationErrors = 'The maximum number of travelers is 9';
            return false;
        }

        return true;
    }

    function authenticate() {
        $clientSource = \ClientSource::model()->cache(60)->findByAttributes([
            'username' => $this->credentials->username,
            'password' => $this->credentials->password,
            'officeid' => $this->credentials->officeid,
            'is_active' => 1,
        ]);
        if ($clientSource === null) {
            return false;
        }
        $this->clientSourceId = $clientSource->id;

        // HostInfo
        if (empty($this->hostInfo)) {
            $this->hostInfo = \Yii::app()->request->hostInfo;
        }
        
        return true;
    }

    function fillBookingSearchForm() {
        \Yii::import('application.models.forms.BookingSearchForm');
        $out = new \BookingSearchForm;
        $out->adults = $this->numadults;
        $out->children = $this->numchildren;
        $out->infants = $this->numinfants;
        $out->source = \Airport::getIdFromCode($this->origin);
        $out->destination = \Airport::getIdFromCode($this->destination);
        $out->depart = $this->onwarddate;
        $out->return = $this->returndate;
        $out->category = isset(self::$categoryMap[$this->prefclass]) ? self::$categoryMap[$this->prefclass] : \CabinType::ECONOMY;

        return $out;
    }

    function results() {
        // Find the search or do new one
        $search = \Searches::populate($this->fillBookingSearchForm());
        if ($search === null) {
            return json_encode(['error' => 'Invalid search request']);
        }

        // Limit the returned results
        if ($this->numresults > self::MAX_NUMRESULTS) {
            $this->numresults = self::MAX_NUMRESULTS;
        }

//        \Utils::dbgYiiLog($search);
        $search->client_source_id = $this->clientSourceId;
        $search->update(['client_source_id']);
        // Wait for the results to arrive
        $search->waitVisibleAirSourcesToDeliver(\Searches::MAX_WAITING_TIME_API3D - \Yii::getLogger()->getExecutionTime());
        // Get the oneWay or GDS best offers
        $arrRcs = $search->getBestPricedMatchesOneWayV2($this->numresults);
        if (!empty($this->returndate)) {
            $arrRcs2 = $search->getBestPricedMatchesTwoWaysV2($this->numresults);
            // Merge both results
            if (!empty($arrRcs2[0])) {
                $arrRcs = array_merge($arrRcs, $arrRcs2);
            }
        }
        // Apply commercial rule to the RouteCache results
        \RoutesCache::applyB2cCommercialPlan($arrRcs, $this->clientSourceId);

        $response = new FlightSearchResponse($this, $search->id, $this->clientSourceId);
        $response->deeplinkurl = $this->hostInfo . \Yii::app()->request->requestUri . "/" . $search->id . "?cs=$this->clientSourceId";
        // Add new recomendation
        foreach ($arrRcs as $journeys) {
            if (!empty($journeys)) {
                $response->addRecomendation($journeys, $search);
                $response->totalresults++;
            }
        }

        // Sort the end results. Truncate the excess
        $response->sortByPrice($this->numresults);

        // Register the response
        \application\components\Reporting\Statistics::addDeeplinkResponse($this->clientSourceId, $search->id);

        return json_encode($response);
    }

}
