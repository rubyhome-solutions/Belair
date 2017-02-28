<?php

namespace application\components\B2cApi;

/**
 * AirConfirm
 *
 * @author Boxx
 * @package B2cApi
 */
class AirConfirm {

    public $credentials = null;
    public $journeyKey = null;
    public $onwardKey = null;
    public $backwardKey = null;
    public $validationErrors = null;
    public $ts = 0;
    public $segments = [];
//    public $totalFareByPaxType = [];
    private $rcs = [];
    public $passengers = [];
    public $travelers = [];
    public $pax = [];

    public function __construct() {
        $this->credentials = new Auth;
    }

    function validatePax($passengers) {
        if (empty($passengers) || !is_array($passengers)) {
            throw new B2cApiException(B2cApiException::INVALID_PASSENGERS_ELEMENTS, null, 400);
        }
        foreach ($passengers as $passenger) {
            $traveller = new \Traveler;
            $traveller->attributes = $passenger;
            $traveller->user_info_id = $this->credentials->user->user_info_id;
            if (empty($traveller->traveler_title_id)) {
                $traveller->traveler_title_id = \TravelerTitle::DEFAULT_TITLE;
            }
            if (!$traveller->validate()) {
                $errors = $traveller->errors;
                $this->validationErrors = 'Traveler format error: ' . implode(' | ', reset($errors));
                throw new B2cApiException(B2cApiException::TRAVELER_FORMAT_ERROR, $this->validationErrors, 400);
            }
            $traveller->id = $traveller->insertIfMissing();
            $traveller->isNewRecord = false;
            // Set the traveler_type_id
            $traveller->setTravelerTypeId();
            $this->travelers[] = [
                'traveler_type_id' => $traveller->traveler_type_id,
                'id' => $traveller->id,
                'user_info_id' => $traveller->user_info_id,
                'birthdate' => $traveller->birthdate,
            ];
        }
        return true;
    }

    /**
     * Validate the credentials and the journeys key elements
     * @return boolean
     */
    function validate() {
        $this->credentials->authenticate();
        // Validate major fields
        if (empty($this->journeyKey) && (empty($this->onwardKey) || empty($this->backwardKey))) {
            throw new B2cApiException(B2cApiException::MISSING_BOOKING_KEY, null, 400);
        }
        return true;
    }

    /**
     * Return the results
     * @return string JSON encoded results
     */
    function results() {
        if (empty($this->journeyKey)) {
            parse_str($this->onwardKey, $onwardKeys);
            parse_str($this->backwardKey, $backwardKeys);
            // RC assigments
            if (empty($onwardKeys['rc']) || empty($backwardKeys['rc'])) {
                throw new B2cApiException(B2cApiException::MISSING_RC, null, 400);
            }
            $this->rcs = array_merge(json_decode($onwardKeys['rc'], true), json_decode($backwardKeys['rc'], true));
            // TS assigment
            if (empty($onwardKeys['ts']) || empty($backwardKeys['ts'])) {
                throw new B2cApiException(B2cApiException::MISSING_TS, null, 400);
            }
            $this->ts = (int) $onwardKeys['ts'];
        } else {
            parse_str($this->journeyKey, $keys);
            // RC assigments
            if (empty($keys['rc'])) {
                throw new B2cApiException(B2cApiException::MISSING_RC, null, 400);
            }
            $this->rcs = json_decode($keys['rc'], true);
            // TS assigment
            if (empty($keys['ts'])) {
                throw new B2cApiException(B2cApiException::MISSING_TS, null, 400);
            }
            $this->ts = (int) $keys['ts'];
        }
        $this->rcs = self::fetchTheRcs($this->rcs, $this->ts);
        // Set the PAXes
        $this->pax = self::preparePaxes($this->rcs);
        // Pax data validation
        $this->validatePax(empty($this->passengers) ? null : $this->passengers);

        $this->segments = self::prepareSegments($this->rcs);
//        print_r($this->segments);
        $check = \ApiInterface::checkAvailabilityAndFares($this->rcs[0][0]->air_source_id, [
                    'segments' => $this->segments,
                    'pax' => $this->pax,
                    'cabinTypeId' => $this->rcs[0][0]->cabin_type_id,
                        ], $this->travelers);

//        $check = true;
        if ($check === true) {
            return json_encode(['status' => 'confirmed']);
        }

        throw new B2cApiException($check['errorCode'], $check['message'], 400, $check['priceDiff']);
    }

    /**
     * Fetch the coresponding RC objects from the given IDs
     * @param array $arrRcIds The input RC IDs, Example with 3 pax and single journey [[1,2,3]]
     * @return array
     */
    static function fetchTheRcs(array $arrRcIds, $ts) {
        $out = [];
        foreach ($arrRcIds as $journey) {
            if (empty($journey)) {  // Empty journey structure
                throw new B2cApiException(B2cApiException::MISSING_RC, null, 400);
            }
            foreach ($journey as $rcId) {
                $rc = \RoutesCache::model()->with('airSource')->findByPk((int) $rcId);
                /* @var $rc \RoutesCache */
                if ($rc === null) { // RC not found
                    throw new B2cApiException(B2cApiException::RC_NOT_FOUND, null, 404, "RC element# $rcId not found");
                }
                if (strtotime($rc->updated) > $ts) {   // RC element is updated after the TS from the search key
                    throw new B2cApiException(B2cApiException::REQUEST_OUT_OF_DATE, null, 400, "RC# $rc->id, $rc->updated, $ts, " . time($rc->updated));
                }
                if (strtotime($rc->departure_date . ' ' . $rc->departure_time) < time()) {   // RC element is for flight in the past
                    throw new B2cApiException(B2cApiException::REQUEST_OUT_OF_DATE, null, 400, "RC# $rc->id, $rc->departure_date $rc->departure_time You can not book flight in the past");
                }
                $tmp[] = $rc;
            }
            $out[] = $tmp;
            unset($tmp);
        }
        return $out;
    }

    /**
     * Prepare pax data structure
     * @param array $arrRcs The RCs objects like [[Rc1,Rc2,Rc3], [Rc4,Rc5,Rc6]]
     * @return array The key are the traveller type ID
     */
    static function preparePaxes(array $arrRcs) {
        $out = [
            \TravelerType::TRAVELER_ADULT => ['totalFare' => 0, 'arrTaxes' => [], 'type' => \TravelerType::TRAVELER_ADULT],
            \TravelerType::TRAVELER_CHILD => ['totalFare' => 0, 'arrTaxes' => [], 'type' => \TravelerType::TRAVELER_CHILD],
            \TravelerType::TRAVELER_INFANT => ['totalFare' => 0, 'arrTaxes' => [], 'type' => \TravelerType::TRAVELER_INFANT],
        ];
        foreach ($arrRcs as $jkey => $journey) {
            foreach ($journey as $rc) {
                /* @var $rc \RoutesCache */
                $out[$rc->traveler_type_id]['totalFare'] += $rc->total_fare + $rc->total_tax_correction;
                $out[$rc->traveler_type_id]['fareBasis'][$jkey + 1] = $rc->fare_basis;
            }
        }
        foreach ($out as $key => $value) {
            if ($value['totalFare'] == 0) {
                unset ($out[$key]);
            }
        }
        return $out;
    }

    static function prepareSegments(array $arrRcs) {
        $out = [];
        $i = 1;
        foreach ($arrRcs as $journey) {
            /* @var $journey \RoutesCache[] */
            if (!empty($journey[0])) {
                $segment = $journey[0]->extractSegments();
                if (count($segment) > 1) { // GDS case
                    return $segment;
                }
                $out[$i] = $segment[1];
                $i++;
                unset($segment);
            }
        }
        return $out;
    }

}
