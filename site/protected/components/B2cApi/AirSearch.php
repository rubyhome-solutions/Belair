<?php

namespace application\components\B2cApi;

/**
 * AirSearch
 *
 * @author Boxx
 * @package B2cApi
 */
class AirSearch {

    public $credentials = null;
    public $origin = null;
    public $destination = null;
    public $onwardDate = null; //YYYY-MM-DD
    public $returnDate = null;
    public $adults = 1;
    public $children = 0;
    public $infants = 0;
    public $validationErrors = '';
    public $numResults = 100;
    public $prefClass = 'E';
    static $categoryMap = [
        'E' => \CabinType::ECONOMY,
        'F' => \CabinType::FIRST,
        'C' => \CabinType::BUSINESS,
    ];

    public function __construct() {
        $this->credentials = new Auth;
    }

    function validate() {
       
       // $this->credentials->authenticate();
        // Validate major fields
        if (strlen($this->origin) !== 3 || strlen($this->destination) !== 3 || empty($this->onwardDate)) {
            throw new B2cApiException(B2cApiException::SEARCH_FIELDS_MALFORMED, null, 400);
        }
        // Validate dates
        $onward = strtotime($this->onwardDate);
        if ($onward < strtotime(date(DATE_FORMAT))) {
            throw new B2cApiException(B2cApiException::ONWARD_DATE_IN_PAST, null, 400);
        }
        if (!empty($this->returnDate)) {
            $back = strtotime($this->returnDate);
            if ($back < $onward) {
                throw new B2cApiException(B2cApiException::WRONG_RETURN_DATE, null, 400);
            }
        }
        // Validate Paxes
        if ($this->adults == 0 && ($this->children == 0 || $this->infants > 0)) {
            throw new B2cApiException(B2cApiException::INFANT_WITHOUT_ADULT, null, 400);
        }

        return true;
    }

    function fillBookingSearchForm() {
        \Yii::import('application.models.forms.BookingSearchForm');
        $out = new \BookingSearchForm;
        $out->adults = $this->adults;
        $out->children = $this->children;
        $out->infants = $this->infants;
        $out->source = \Airport::getIdFromCode($this->origin);
        $out->destination = \Airport::getIdFromCode($this->destination);
        $out->depart = $this->onwardDate;
        $out->return = $this->returnDate;
        $out->category = isset(self::$categoryMap[$this->prefClass]) ? self::$categoryMap[$this->prefClass] : \CabinType::ECONOMY;

        return $out;
    }

    function results() {
        
        set_time_limit(\Searches::MAX_WAITING_TIME_B2BAPI+5);
        // Find the search or do new one
        $search = \Searches::populate($this->fillBookingSearchForm());
        // Attach the user to the search
        if(isset($this->credentials->user->id)){
            $search->user_id = $this->credentials->user->id;
            $search->update(['user_id']);
        }
        // Wait for the results to arrive
        $search->waitVisibleAirSourcesToDeliver(\Searches::MAX_WAITING_TIME_B2BAPI);
        // Get the oneWay or GDS best offers
        $arrRcsFull = $search->getBestPricedMatchesOneWay($this->numResults);
        if (!empty($this->returnDate)) {
            $arrRcsOnward = $search->getMatchesByDirection(\RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO);
            $arrRcsBackward = $search->getMatchesByDirection(\RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO);
//            \Utils::dbgYiiLog($arrRcsOnward);
//            \Utils::dbgYiiLog($arrRcsBackward);
        } else {
            $arrRcsOnward = [];
            $arrRcsBackward = [];
        }
//        print_r($arrRcs);
        // Apply commercial rule to the RouteCache results
        if (!empty($this->credentials->user->userInfo->commercial_plan_id)) {
            $this->credentials->user->userInfo->commercialPlan->applyPlanToRcJourneys($arrRcsFull, \ClientSource::SOURCE_DIRECT);
            if (!empty($arrRcsOnward) && !empty($arrRcsBackward)) {
                $this->credentials->user->userInfo->commercialPlan->applyPlanToRcJourneys($arrRcsOnward, \ClientSource::SOURCE_DIRECT);
                $this->credentials->user->userInfo->commercialPlan->applyPlanToRcJourneys($arrRcsBackward, \ClientSource::SOURCE_DIRECT);
            }
        }

        $response = new FlightSearchResponse($search->id);
        $response->journeysCount = empty($arrRcsFull[0]) ? 0 : count($arrRcsFull);
        $response->onwardCount = empty($arrRcsOnward[0]) ? 0 : count($arrRcsOnward);
        $response->backwardCount = empty($arrRcsBackward[0]) ? 0 : count($arrRcsBackward);
//        $response->link = \Yii::app()->request->hostInfo . \Yii::app()->request->requestUri . "/" . $search->id;
        // Add new recomendation for the full journeys
        foreach ($arrRcsFull as $journeys) {
            if (!empty($journeys)) {
                $response->addRecomendation($journeys, 'journeys');
            }
        }
        // Add new recomendation for the onward flights
        foreach ($arrRcsOnward as $journeys) {
            if (!empty($journeys)) {
                $response->addRecomendation($journeys, 'onward');
            }
        }
        // Add new recomendation for the backward flights
        foreach ($arrRcsBackward as $journeys) {
            if (!empty($journeys)) {
                $response->addRecomendation($journeys, 'backward');
            }
        }

        // Sort the end results. Truncate the excess
        $response->sortByPrice($this->numResults);

        return json_encode($response);
    }

}
