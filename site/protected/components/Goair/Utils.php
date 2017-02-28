<?php

namespace application\components\Goair;

/**
 * Goair Utils
 *
 * @author Tony
 */
class Utils {

    const DEFAULT_AIRSOURCES_PRODUCTION_ID = 8;
    const DEFAULT_AIRSOURCES_TEST_ID = 35;
    const GOAIR_CARRIER_ID = 59;
    const GOAIR_IATA_CODE = 'G8';
    const TRAVELER_ADULT = 1;
    const TRAVELER_INFANT = 5;
    const TRAVELER_CHILD = 6;

    static $passengerTypesMap = [
        self::TRAVELER_ADULT => \TravelerType::TRAVELER_ADULT,
        self::TRAVELER_CHILD => \TravelerType::TRAVELER_CHILD,
        self::TRAVELER_INFANT => \TravelerType::TRAVELER_INFANT,
    ];
    static $passengerTypes = [
        self::TRAVELER_ADULT => 'Adult',
        self::TRAVELER_INFANT => 'Infant',
        self::TRAVELER_CHILD => 'Child',
    ];
    static $passengerG8TypeIdToId = [
        self::TRAVELER_ADULT => \TravelerType::TRAVELER_ADULT,
        self::TRAVELER_INFANT => \TravelerType::TRAVELER_INFANT,
        self::TRAVELER_CHILD => \TravelerType::TRAVELER_CHILD,
    ];

    /**
     * PNR acquisition
     * @param string $pnrStr The PNR
     * @param int $airSourceId ID of the air source from where the pnr is to be extracted
     * @return int ID of the newly created airCart object
     */
    static function aquirePnr($pnrStr, $airSourceId) {
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        $api = new $airSource->backend->api_source;
        /* @var $airSource \AirSource */
        $credentials = [
            'login' => $airSource->username,
            'password' => $airSource->password,
            'TANumber' => $airSource->profile_pcc,
            'tranUsername' => $airSource->tran_username,
            'tranPassword' => $airSource->tran_password
        ];
//        \Utils::dbgYiiLog($credentials);
        $api->connect($airSource->backend->wsdl_file, $credentials, $airSourceId);
        $pnr = $api->retrievePnr($pnrStr);
        // If string is returned , than this is a error
        if (is_string($pnr)) {
            return ['message' => $pnr];
        }
        if (isset($pnr['error'])) {
            return ['message' => $pnr['error']];
        }
        if (YII_DEBUG) {
//            \Utils::dbgYiiLog($pnr);
            $pnr->saveXML('goair_pnr_structure.xml');
        }
        $acquisition = new \application\components\api_interfaces\Goair\PnrAcquisition;
        $acquisition->setPnr($pnr, $airSourceId, $pnrStr);
        return \ApiInterface::acquirePnr($acquisition);
    }

    /**
     * Goair search
     * @param int $airSourceId The AirSource ID
     * @param \stdClass $params
     * @return string JSON encoded search result
     */
    static function search($airSourceId, \stdClass $params) {
        // Departure date test
        if (strtotime($params->depart) < strtotime(date(DATE_FORMAT))) {
            return "Departure in the past";
        }
        $originId = \Airport::getIdFromCode($params->source);
        $destinationId = \Airport::getIdFromCode($params->destination);
        if (!\CityPairs::model()->cache(3600)->findByAttributes([
                    'source_id' => $originId,
                    'destination_id' => $destinationId,
                    'carrier_id' => self::GOAIR_CARRIER_ID
                ])) {
            return "GoAir do not serve this pair of origin and destination cities";
        }

        $travelers = [
            self::TRAVELER_ADULT => $params->adults,
            self::TRAVELER_CHILD => $params->children,
            self::TRAVELER_INFANT => $params->infants,
        ];
        
        if($airSourceId==\application\components\Goair\Utils::DEFAULT_AIRSOURCES_TEST_ID){
            $api = new test\GoAir($airSourceId); //new test\GoAir($airSourceId);
        }else{
            $api = new production\GoAir($airSourceId); //new test\GoAir($airSourceId);  
        }
        $res = $api->search($params->source, $params->destination, $params->depart, $travelers, $params->category, empty($params->return) ? null : $params->return);
//        $res = simplexml_load_file('g8_tmp.xml');
//        $res->saveXML('g8_tmp.xml');
        if ($res === false) {   // Error
            return 'Error with GoAir. Please check the logs for details!';
        }
        //echo Utils::dbgYiiLog($res);
        //echo \Utils::dbg($res);
        $arr = json_decode(json_encode($res), true);
        //echo \Utils::dbgYiiLog($arr);
//        echo \Utils::dbg($arr);
        $legs = production\GoAir::parseLegs($arr);
//        \Utils::dbgYiiLog($legs);
        $segments = production\GoAir::parseSegments($arr);
//        \Utils::dbgYiiLog($segments);
        $grouping = \RoutesCache::getNextGroupId();
        $round_trip = empty($params->return) ? 0 : 1;
        $rows = [];
        foreach ($segments as $segment) {
            // Skip the record if it is not full
            if (!isset($segment['passengers']) || !isset($legs[reset($segment['legs'])])) {
                continue;
            }
            $firstLeg = $legs[reset($segment['legs'])];
            $lastLeg = $legs[end($segment['legs'])];
//            \Utils::dbgYiiLog([
//                'Legs' => $legs,
//                'Segments' => $segments,
//                'Segment' => $segment,
//                'FirstLeg' => $firstLeg,
//                'LastLeg' => $lastLeg,
//                'params' => $params
//            ]);
//            exit;
            if ($round_trip === 0) {
                $order = \RoutesCache::ORDER_SINGLE_JOURNEY;    // Single journey
            } elseif ($params->source == trim($firstLeg['Origin'])) {
                $order = \RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO;    // First journey from 2
            } else {
                $order = \RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO;    // Second journey from 2
            }
            // Prepare passenger independent parameters
            $tmp = new \stdClass;
            list($tmp->return_date, $tmp->return_time) = [$params->return, null];
            list ($tmp->departure_date, $tmp->departure_time) = explode(' ', $firstLeg['DepartureDate']);
            list($tmp->arrival_date, $tmp->arrival_time) = explode(' ', $lastLeg['ArrivalDate']);
            $tmp->origin_id = \Airport::getIdFromCode($firstLeg['Origin']);
            $tmp->destination_id = \Airport::getIdFromCode($lastLeg['Destination']);
            $tmp->carrier_id = \Carrier::getIdFromCode($firstLeg['OperatingCarrier']);
            $tmp->stops = count($segment['legs']) - 1;
            $tmp->hash_str = self::prepareHashStr($airSourceId, $legs, $segment['legs'], $params->category);

            foreach ($segment['passengers'] as $pType => $passenger) {
                $row = new \RoutesCache;
                $row->cabin_type_id = $params->category;
                $row->departure_date = $tmp->departure_date;
                $row->departure_time = $tmp->departure_time;
                $row->arrival_date = $tmp->arrival_date;
                $row->arrival_time = $tmp->arrival_time;
                $row->return_date = $tmp->return_date;
                $row->return_time = $tmp->return_time;
                $row->origin_id = $tmp->origin_id;
                $row->destination_id = $tmp->destination_id;
                $row->carrier_id = $tmp->carrier_id;
                $row->stops = $tmp->stops;
                $row->flight_number = $firstLeg['FlightNum'];
                $row->traveler_type_id = self::$passengerTypesMap[$pType];
                $row->fare_basis = $passenger['taxSummary']['FBCode'];
//                $row->booking_class = trim($passenger['taxSummary']['FCCode']);
                $row->total_fare = (float) $passenger['taxSummary']['BaseFareAmtInclTax'];
                $row->base_fare = (float) $passenger['taxSummary']['BaseFareAmtNoTaxes'];
                $row->total_taxes = $row->total_fare - $row->base_fare;
                $row->tax_jn = isset($passenger['taxes'][\Taxes::TAX_JN]) ? $passenger['taxes'][\Taxes::TAX_JN] : 0;
                $row->tax_other = isset($passenger['taxes'][\Taxes::TAX_OTHER]) ? $passenger['taxes'][\Taxes::TAX_OTHER] : 0;
                $row->tax_psf = isset($passenger['taxes'][\Taxes::TAX_PSF]) ? $passenger['taxes'][\Taxes::TAX_PSF] : 0;
                $row->tax_udf = isset($passenger['taxes'][\Taxes::TAX_UDF]) ? $passenger['taxes'][\Taxes::TAX_UDF] : 0;
                $row->tax_yq = isset($passenger['taxes'][\Taxes::TAX_YQ]) ? $passenger['taxes'][\Taxes::TAX_YQ] : 0;
                $row->last_check = date(DATETIME_FORMAT);
                $row->updated = date(DATETIME_FORMAT);
                $row->air_source_id = $airSourceId;
                $row->service_type_id = \ServiceType::DOMESTIC_AIR;
                $row->order_ = $order;
                $row->grouping = $grouping;
                $row->round_trip = $round_trip;
                $row->legs_json = json_encode(self::prepareLegsJson($legs, $segment['legs'], trim($passenger['taxSummary']['FCCode'])));
//                $row->hash_str = $tmp->hash_str . $row->fare_basis . \RoutesCache::HASH_SEPARATOR . $row->traveler_type_id;
                $row->hash_str = $tmp->hash_str . $row->traveler_type_id;
                $row->hash_id = "x'" . str_pad(hash('fnv164', $row->hash_str), 16, '0', STR_PAD_LEFT) . "'::int8";

                $rows[] = $row->attributes;
                end($rows);
                unset($rows[key($rows)]['id']);     // Unset the id array element
            }
        }
        if (empty($rows)) {
            return "No flights";
        }
        return json_encode($rows);
    }

    static function prepareLegsJson($legs, $journey, $bookingClass) {
        $out = [];
        foreach ($journey as $legId) {
            $legsJson = new \LegsJson;
            $legsJson->arrive = $legs[$legId]['ArrivalDate'];
            $legsJson->depart = $legs[$legId]['DepartureDate'];
            $legsJson->destination = \Airport::getAirportCodeAndCityNameFromCode($legs[$legId]['Destination']);
            $legsJson->destinationTerminal = str_replace('Terminal ', '', $legs[$legId]['ToTerminal']);
            $legsJson->flighNumber = self::GOAIR_IATA_CODE . '-' . $legs[$legId]['FlightNum'];
            $legsJson->origin = \Airport::getAirportCodeAndCityNameFromCode($legs[$legId]['Origin']);
            $legsJson->originTerminal = str_replace('Terminal ', '', $legs[$legId]['FromTerminal']);
            $legsJson->time = \Utils::convertToHoursMins($legs[$legId]['FlightTime']);
            $legsJson->bookingClass = $bookingClass;
            $out[] = $legsJson;
        }
        return $out;
    }

    static function prepareHashStr($airSourceId, $legs, $journey, $cabinTypeId) {
        $out = $airSourceId . \RoutesCache::HASH_SEPARATOR . $cabinTypeId . \RoutesCache::HASH_SEPARATOR;
//        foreach ($legs as $leg) {
        foreach ($journey as $legId) {
            $out .= $legs[$legId]['Origin'] . \RoutesCache::HASH_SEPARATOR;
            $out .= $legs[$legId]['DepartureDate'] . \RoutesCache::HASH_SEPARATOR;
            $out .= self::GOAIR_IATA_CODE . '-' . $legs[$legId]['FlightNum'] . \RoutesCache::HASH_SEPARATOR;
            $out .= $legs[$legId]['Destination'] . \RoutesCache::HASH_SEPARATOR;
        }
        return $out;
    }

}
