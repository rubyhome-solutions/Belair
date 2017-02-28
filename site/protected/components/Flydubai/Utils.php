<?php

namespace application\components\Flydubai;

/**
 * Flydubai Utils
 *
 * 
 */
class Utils {

    const DEFAULT_AIRSOURCES_PRODUCTION_ID = 42;
    const DEFAULT_AIRSOURCES_TEST_ID = 41;
    const INTERNATIONAL_AIRSOURCES_PRODUCTION_ID = 44;
    const INTERNATIONAL_AIRSOURCES_TEST_ID = 43;
    const FLYDUBAI_CARRIER_ID = 56;
    const FLYDUBAI_IATA_CODE = 'FZ';
    const TRAVELER_ADULT = 1;
    const TRAVELER_INFANT = 5;
    const TRAVELER_CHILD = 6;
    const ORIGIN_COUNTRY='IN';
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
    
    static $passengerG8TypeIdToId= [
        self::TRAVELER_ADULT => \TravelerType::TRAVELER_ADULT,
        self::TRAVELER_INFANT => \TravelerType::TRAVELER_INFANT,
        self::TRAVELER_CHILD => \TravelerType::TRAVELER_CHILD,
    ];
    
    static function curl($url, $extra = '') {
        // Assigning cURL options to an array
        $options = Array(
            CURLOPT_RETURNTRANSFER => TRUE, // Setting cURL's option to return the webpage data
            CURLOPT_FOLLOWLOCATION => TRUE, // Setting cURL to follow 'location' HTTP headers
            CURLOPT_MAXREDIRS => 10, // stop after 10 redirects 
            CURLOPT_COOKIEFILE => '.cookie.txt',
            CURLOPT_COOKIEJAR => '.cookie.txt',
            CURLOPT_AUTOREFERER => TRUE, // Automatically set the referer where following 'location' HTTP headers
            CURLOPT_CONNECTTIMEOUT => 55, // Setting the amount of time (in seconds) before the request times out
            CURLOPT_TIMEOUT => 55, // Setting the maximum amount of time for cURL to execute queries
            CURLOPT_MAXREDIRS => 10, // Setting the maximum number of redirections to follow
            CURLOPT_USERAGENT => "Googlebot/2.1 (http://www.googlebot.com/bot.html)", // Setting the useragent
            CURLOPT_ENCODING => "gzip", // To hadle zipped streams
            CURLOPT_URL => $url, // Setting cURL's URL option with the $url variable passed into the function
            CURLOPT_SSL_VERIFYPEER => false, // Do not check for SSL certificate
        );
        if ($extra != '') {
            $options[CURLOPT_POSTFIELDS] = $extra;
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_HTTPHEADER] = array('Content-type: text/xml;charset=utf-8');
        }
        $ch = curl_init();   // Initialising cURL 
        curl_setopt_array($ch, $options);   // Setting cURL's options using the previously assigned array data in $options
        $data = curl_exec($ch); // Executing the cURL request and assigning the returned data to the $data variable
        $err = curl_error($ch);
        curl_close($ch);     // Closing cURL 
        return ['result' => $data, 'error' => $err];     // Returning the data from the function 
    }
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
            //\Utils::dbgYiiLog($pnr);
            //file_put_contents(\Yii::app()->runtimePath . '/flydubai_pnr_acquisition.log', json_encode($pnr)); 
            
        }
        $acquisition = new \application\components\api_interfaces\Flydubai\PnrAcquisition;
        $acquisition->setPnr($pnr, $airSourceId, $pnrStr);
        return \ApiInterface::acquirePnr($acquisition);
    }

    /**
     * Flydubai search
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
                    'carrier_id' => self::FLYDUBAI_CARRIER_ID
                ])) {
            return "Flydubai do not serve this pair of origin and destination cities";
        }

        $travelers = [
            self::TRAVELER_ADULT => $params->adults,
            self::TRAVELER_CHILD => $params->children,
            self::TRAVELER_INFANT => $params->infants,
        ];
        $airSrc=  \AirSource::model()->findByPk((int)$airSourceId);
        if(!isset($airSrc))
            return 'AIrSource Not Valid';
        
        if($airSrc->backend_id===\Backend::FLYDUBAI_PRODUCTION){
            $api = new production\Flydubai($airSourceId); //production\Flydubai($airSourceId);
        }else{
            $api = new test\Flydubai($airSourceId); //production\Flydubai($airSourceId);
        }
        $res = $api->search($params->source, $params->destination, $params->depart, $travelers, $params->category, empty($params->return) ? null : $params->return);
//        $res = simplexml_load_file('g8_tmp.xml');
//        $res->saveXML('g8_tmp.xml');
        if ($res === false) {   // Error
            return 'Error with Flydubai. Please check the logs for details!';
        }

//      \Utils::dbgYiiLog($res);
        $legs = $res[1];//application\components\Flydubai\production\Flydubai::parseLegs($arr);
//echo Utils::dbgYiiLog($legs);
        $segments = $res[0];//application\components\Flydubai\production\Flydubai::parseSegments($arr);
        $grouping = \RoutesCache::getNextGroupId();
        $round_trip = empty($params->return) ? 0 : 1;
        $rows = [];
        foreach ($segments as $segment) {
             
            // Skip the record if it is not full
            if (!isset($segment['passengers']) || !isset($legs[$segment['legs'][0]])) {
                continue;
            }
            $firstLeg = $legs[$segment['legs'][0]];
            $lastLeg = $legs[$segment['legs'][count($segment['legs'])-1]];
             $tmp = new \stdClass;
            if ($round_trip === 0) {
                $order = \RoutesCache::ORDER_SINGLE_JOURNEY;    // Single journey
            } elseif (trim($params->source) == trim($firstLeg['Origin'])) {
                $order = \RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO;    // First journey from 2
            } else {
                $order = \RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO;    // Second journey from 2
            }
            // Prepare passenger independent parameters
           
            list($tmp->return_date, $tmp->return_time) = [$params->return, null];
            list($tmp->departure_date, $tmp->departure_time) = explode(' ', $firstLeg['DepartureDate']);
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
                $row->service_type_id = \ServiceType::INTERNATIONAL_AIR;
                $row->order_ = $order;
                $row->grouping = $grouping;
                $row->round_trip = $round_trip;
                $row->legs_json = json_encode(self::prepareLegsJson($legs, $segment['legs'], trim($passenger['taxSummary']['FCCode'])));
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
        //\Utils::dbgYiiLog($rows);
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
            $legsJson->flighNumber = self::FLYDUBAI_IATA_CODE . '-' . $legs[$legId]['FlightNum'];
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
            $out .= self::FLYDUBAI_IATA_CODE . '-' . $legs[$legId]['FlightNum'] . \RoutesCache::HASH_SEPARATOR;
            $out .= $legs[$legId]['Destination'] . \RoutesCache::HASH_SEPARATOR;
        }
        return $out;
    }

}
