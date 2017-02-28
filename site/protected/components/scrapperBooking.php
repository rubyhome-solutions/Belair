<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class scrapperBooking {

    public $passengers = [];
    public $segments = [];
    public $pnr = null;
    public $inputs = [];
    public $airSourceId = null;
    public $error = null;
    public $balance = null;
    public $travellers = [];
    public $status = 0;
    public $pax = null;
    public $fares = [];
    public $data = [];

    /**
     * 
     * @param type $airSourceId
     * @param array $inputs
     * @param type $append
     * @return type
     */
    static function search($airSourceId, array $inputs, $append = null) {

        if ($airSourceId != null) {
            $scrapper = AirSource::model()->with('backend')->findByPk($airSourceId);
            if (!isset($inputs['credentials'])) {
                $inputs = array_merge($inputs, array(
                    'credentials' => array(
                        'username' => $scrapper->username,
                        'password' => $scrapper->password,
                        'timeout' => 85
                    )
                ));
            }
//            \Utils::dbgYiiLog($inputs);
            $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $scrapper->backend->search;
            $params = str_replace('"', '\"', json_encode($inputs));
//            \Utils::dbgYiiLog("php \"".$script."\" ".$params . $append);
            exec("php \"$script\" " . $params . $append, $output, $status);
//            \Utils::dbgYiiLog($output[0]);

            return $output;
        }
    }

    static function isCorrectFormat($response) {
    $flag = true;
    $returnData = json_decode($response, true);
    if (isset($returnData['onward'])) {
        $flag = is_array(\scrapperBooking::isCorrectFormat(json_encode($returnData['onward'])));
    }
    if (isset($returnData['return'])) {
        $flag = is_array(\scrapperBooking::isCorrectFormat(json_encode($returnData['return'])));
    }
    if (!isset($returnData['onward']) && !isset($returnData['return'])) {
        if ($returnData != null && !empty($returnData)) {
            foreach ($returnData as $key => $value) {
                if (isset($value['legs']) && !empty($value['legs']) && isset($value['fares']) && !empty($value['fares'])) {

                    foreach ($value['legs'] as $legid => $legdata) {
                        if(     isset($legid)
                                && isset($legdata['flightNumber'])
                                && isset($legdata['depart'])
                                && isset($legdata['source'])
                                && isset($legdata['destination'])
                                && isset($legdata['arrive'])
                           ){
                            
                        }else{
                            return ['error' => 'Legs Data is not in proper format'];
                        }
                       
                    }
                    
                    if(isset($value['fares']['adult']['amount']) && isset($value['fares']['adult']['baseFare'])){
                        return true;
                    }else{
                         return ['error' => 'Fares are Null'];
                    }
                    
                    
                } else{
                    return ['error' => 'Fares or Legs are Null'];
                }
            }
        } else {
            return ['error' => 'Null Data'];
        }
    }
}
    
    
    /**
     * Check if the fare is the same in scrappers 
     * @return boolean TRUE if we have a match or array with [errorCode, priceDiff] elements
     */
    function checkAvailabilityAndFares() {
        $airSourceId = $this->airSourceId;
        $data = $this->data;
        $travelers = $this->travellers;
        $segments = $data['segments'];
        $onwardlegsCount = count($segments[1]);

        $inputs['source'] = $segments[1][0]['origin'];
        $inputs['destination'] = $segments[1][$onwardlegsCount - 1]['destination'];
        $tmp = explode(' ', $segments[1][0]['departTs']);
        $inputs['depart'] = $tmp[0];
        $returnFlag = false;
        if (count($segments) > 1 && isset($segments[2])) {
            $tmp1 = explode(' ', $segments[2][0]['departTs']);
            $inputs['return'] = $tmp1[0];
            $returnFlag = true;
            $returnlegsCount = count($segments[2]);
        }
        $adultsCount = 0;
        $childCount = 0;
        $infantCount = 0;
        $totalFare = 0;

        if ($travelers == null) {
            return [
                'errorCode' => \ApiInterface::INVALID_TRAVELER,
                'priceDiff' => 0,
                'message' => \ApiInterface::$errorMessages[\ApiInterface::INVALID_TRAVELER]
            ];
        }
        foreach ($travelers as $traveler) {
            $model = Traveler::model()->with('travelerTitle')->findByPk($traveler['id']);
            if ($model === null) {
                return [
                    'errorCode' => \ApiInterface::INVALID_TRAVELER,
                    'priceDiff' => 0,
                    'message' => \ApiInterface::$errorMessages[\ApiInterface::INVALID_TRAVELER]
                ];
            }
            if ($traveler['traveler_type_id'] == \TravelerType::TRAVELER_ADULT)
                $adultsCount++;
            if ($traveler['traveler_type_id'] == \TravelerType::TRAVELER_CHILD)
                $childCount++;
            if ($traveler['traveler_type_id'] == \TravelerType::TRAVELER_INFANT)
                $infantCount++;

            $totalFare += (float) $data['pax'][$traveler['traveler_type_id']]['totalFare'];
        }

        if ($adultsCount > 0) {
            $inputs['adults'] = $adultsCount;
            $inputs['children'] = $childCount;
            $inputs['infants'] = $infantCount;


            $output = scrapperBooking::search($airSourceId, $inputs);

            if (!isset($output[0])) {
                return [
                    'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                    'priceDiff' => 0,
                    'message' => 'Flight Unavailable'
                ];
            } else {
                $res = json_decode($output[0], true);

                if ($returnFlag) {

                    if (isset($res['onward']) && isset($res['return'])) {

                        $onward = $res['onward'];
                        $return = $res['return'];

                        foreach ($onward as $oid => $odata) {
                            foreach ($return as $rid => $rdata) {
                                $onwardlegs = $odata['legs'];
                                $onwardfares = $odata['fares'];
                                $returnlegs = $rdata['legs'];
                                $returnfares = $rdata['fares'];
                                $oflag = true;
                                $rflag = true;
                                $oarrival = null;
                                $rdeparture = null;
                                foreach ($onwardlegs as $olegid => $olegdata) {

                                    $tmp = explode('-', $olegdata['flightNumber']);
                                    $tmp2 = explode(' ', $olegdata['depart']);
                                    if (
                                            !( $segments[1][$olegid]['origin'] == $olegdata['source'] &&
                                            $segments[1][$olegid]['destination'] == $olegdata['destination'] &&
                                            $segments[1][$olegid]['flightNumber'] == trim($tmp[1]) &&
                                            $segments[1][$olegid]['marketingCompany'] == $tmp[0] &&
                                            $segments[1][$olegid]['departTs'] == $olegdata['depart'])
                                    ) {
                                        $oflag = false;
                                    }
                                    $oarrival = $olegdata['arrive'];
                                }

                                $firsttime = true;
                                foreach ($returnlegs as $legid => $legdata) {
                                    $tmp = explode('-', $legdata['flightNumber']);
                                    $tmp2 = explode(' ', $legdata['depart']);
                                    if (
                                            !( $segments[2][$legid]['origin'] == $legdata['source'] &&
                                            $segments[2][$legid]['destination'] == $legdata['destination'] &&
                                            $segments[2][$legid]['flightNumber'] == trim($tmp[1]) &&
                                            $segments[2][$legid]['marketingCompany'] == $tmp[0] &&
                                            $segments[2][$legid]['departTs'] == $legdata['depart'])
                                    ) {
                                        $rflag = false;
                                    }
                                    if ($firsttime == true) {
                                        $rdeparture = $legdata['depart'];
                                    }
                                    $firsttime = false;
                                }

                                if ($oflag && $rflag && (strtotime($oarrival) < strtotime($rdeparture))) {

                                    unset($passengers);
                                    unset($passengersforprint);
                                    for ($j = 0; $j < $adultsCount; $j++) {
                                        $passengersforprint[] = array_merge(scrapperBooking::merge_fares($onwardfares['adult'], $returnfares['adult']), ['type' => \TravelerType::TRAVELER_ADULT]);
                                    }
                                    for ($j = 0; $j < $childCount; $j++) {
                                        $passengersforprint[] = array_merge(scrapperBooking::merge_fares($onwardfares['child'], $returnfares['child']), ['type' => \TravelerType::TRAVELER_CHILD]);
                                    }
                                    for ($j = 0; $j < $infantCount; $j++) {
                                        $passengersforprint[] = array_merge(scrapperBooking::merge_fares($onwardfares['infant'], $returnfares['infant']), ['type' => \TravelerType::TRAVELER_INFANT]);
                                    }

                                    unset($out);
                                    foreach ($passengersforprint as $passager) {

                                        $out['pax'][$passager['type']] = [
                                            'totalFare' => $passager['amount'],
                                            'type' => \Utils::$paxTypes[$passager['type']],
                                            'arrTaxes' => \Taxes::reformatScrapperTaxes($passager['taxesDetails']),
                                            'fareBasis' => \Taxes::SCRAPPER_FARE_BASE . $airSourceId,
                                            'taxesTotal' => $passager['taxesTotal'],
                                            'baseFare' => $passager['baseFare'],
                                        ];
                                    }
                                    $totalFareCheck = 0;
                                    foreach ($out['pax'] as $paxTypeId => $value) {
                                        if (!isset($out['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                                            $out['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
                                        }
                                        $out['pax'][$paxTypeId]['totalFare'] = $out['pax'][$paxTypeId]['totalFare'] + $out['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
                                        $totalFareCheck+=(float) $out['pax'][$paxTypeId]['totalFare'];
                                    }

                                    if ($totalFare == $totalFareCheck) {
                                        $this->fares[1] = $this->getPax($onwardfares, $adultsCount, $childCount, $infantCount);
                                        $this->fares[2] = $this->getPax($returnfares, $adultsCount, $childCount, $infantCount);
                                        return true;
                                    } else {
                                        if ($totalFare < $totalFareCheck) {
                                            return [
                                                'errorCode' => \ApiInterface::FARE_INCREASED,
                                                'priceDiff' => $totalFareCheck - $totalFare,
                                                'message' => 'Fare incresed by ' . $totalFareCheck - $totalFare
                                            ];
                                        } else {
                                            return [
                                                'errorCode' => \ApiInterface::FARE_DECREASED,
                                                'priceDiff' => $totalFareCheck - $totalFare,
                                                'message' => 'Fare decreased by ' . $totalFare - $totalFareCheck
                                            ];
                                        }
                                    }
                                } else {
                                    return [
                                        'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                                        'priceDiff' => 0,
                                        'message' => 'Flight Unavailable'
                                    ];
                                }
                            }
                        }
                    } else {
                        return [
                            'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                            'priceDiff' => 0,
                            'message' => 'Flight Unavailable'
                        ];
                    }
                } else {
                    if ($res === null) {
                        return [
                            'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                            'priceDiff' => 0,
                            'message' => 'Flight Unavailable'
                        ];
                    }
                    foreach ($res as $oid => $odata) {
                        $legs = $odata['legs'];
                        $fares = $odata['fares'];

                        if (count($legs) < 1) {
                            return [
                                'errorCode' => \ApiInterface::OTHER_ERROR,
                                'priceDiff' => 0,
                                'message' => 'No Legs Found'
                            ];
                        }
                        foreach ($legs as $legid => $legdata) {
                            $tmp = explode('-', $legdata['flightNumber']);
                            $tmp2 = explode(' ', $legdata['depart']);
                            if (
                                    !( $segments[1][$legid]['origin'] == $legdata['source'] &&
                                    $segments[1][$legid]['destination'] == $legdata['destination'] &&
                                    $segments[1][$legid]['flightNumber'] == trim($tmp[1]) &&
                                    $segments[1][$legid]['marketingCompany'] == $tmp[0] &&
                                    $segments[1][$legid]['departTs'] == $legdata['depart'])
                            ) {
                                $rflag = false;
                            }
                        }

                        $passengers = $fares;
                        unset($passengers);
                        unset($passengersforprint);
                        for ($j = 0; $j < $adultsCount; $j++) {
                            $passengers[] = array_merge($fares['adult'], ['type' => \TravelerType::TRAVELER_ADULT]);
                        }
                        for ($j = 0; $j < $childCount; $j++) {
                            $passengers[] = array_merge($fares['child'], ['type' => \TravelerType::TRAVELER_CHILD]);
                        }
                        for ($j = 0; $j < $infantCount; $j++) {
                            $passengers[] = array_merge($fares['infant'], ['type' => \TravelerType::TRAVELER_INFANT]);
                        }
                        unset($out);
                        foreach ($passengers as $passager) {

                            $out['pax'][$passager['type']] = [
                                'totalFare' => $passager['amount'],
                                'type' => \Utils::$paxTypes[$passager['type']],
                                'arrTaxes' => \Taxes::reformatScrapperTaxes($passager['taxesDetails']),
                                'fareBasis' => \Taxes::SCRAPPER_FARE_BASE . $airSourceId,
                                'taxesTotal' => $passager['taxesTotal'],
                                'baseFare' => $passager['baseFare'],
                            ];
                        }
                        $totalFareCheck = 0;
                        foreach ($out['pax'] as $paxTypeId => $value) {
                            if (!isset($out['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                                $out['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
                            }
                            $out['pax'][$paxTypeId]['totalFare'] = $out['pax'][$paxTypeId]['totalFare'] + $out['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
                            $totalFareCheck+=(float) $out['pax'][$paxTypeId]['totalFare'];
                        }

                        if ($totalFare == $totalFareCheck) {
                            $this->fares[1] = $out;
                            $this->fares[2] = null;
                            return true;
                        } else {
                            if ($totalFare < $totalFareCheck) {
                                return [
                                    'errorCode' => \ApiInterface::FARE_INCREASED,
                                    'priceDiff' => $totalFareCheck - $totalFare,
                                    'message' => 'Fare increased by ' . $totalFareCheck - $totalFare
                                ];
                            } else {
                                return [
                                    'errorCode' => \ApiInterface::FARE_DECREASED,
                                    'priceDiff' => $totalFareCheck - $totalFare,
                                    'message' => 'Fare decreased by ' . $totalFare - $totalFareCheck
                                ];
                            }
                        }
                    }
                }
            }
        }
        return [
            'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
            'priceDiff' => 0,
            'message' => 'Flight Unavailable'
        ];
    }

    /**
     * Based on segment type input array
     * @param type $airSourceId
     * @param type $data
     * @param type $travelers
     * @param type $fop
     * @param type $Cc
     * @return type
     */
    static function book($airSourceId, $data, $travelers, $fop, $Cc) {
        set_time_limit(60);
//        \Utils::dbgYiiLog($airSourceId);
//        \Utils::dbgYiiLog($data);
//        \Utils::dbgYiiLog($travelers);
//        \Utils::dbgYiiLog($fop);
//        \Utils::dbgYiiLog($Cc);
        //Assume segment one is for onward journey and second is for return

        $journey = $data['segments'][1];
        $inputs['source'] = $journey[0]['origin'];
        $legsCount = count($journey);
        $inputs['destination'] = $journey[$legsCount - 1]['destination'];
        $inputs['depart'] = $journey[0]['depart'];
        $inputs['departFlight'] = $journey[0]['flightNumber'];
        if (isset($data['segments'][2])) {
            $returnJourney = $data['segments'][2];
            $inputs['return'] = $returnJourney[0]['depart'];
            $inputs['returnFlight'] = $returnJourney[0]['flightNumber'];
        }
        // build the passengers array
        $airSource = AirSource::model()->with('backend')->findByPk((int) $airSourceId);

        /* @var $airSource \AirSource */
        if (empty($airSource->backend->book)) {
            return ['error' => 'This provider do not have book capability'];
        }

        // Build the passengers array
        $i = 1;
        $totalFare = 0;

        $paxMobile = null;
        foreach ($travelers as $traveler) {
            $model = Traveler::model()->with('travelerTitle')->findByPk($traveler['id']);
            if ($model === null) {
                return ['error' => 'Traveler is not set'];
            }
            $totalAmount = 0;
            $totalAmount = (float) $data['pax'][$traveler['traveler_type_id']]['totalFare'];
            /*       if(isset($data['pax'][2][$traveler['traveler_type_id']]['totalFare'])){
              $totalAmount+=(float) $data['pax'][2][$traveler['traveler_type_id']]['totalFare'];
              } */
            /* @var $model Traveler */
            $passengers[$i] = [
                'id' => $model->id,
                'firstName' => $model->first_name,
                'lastName' => $model->last_name,
                'title' => $model->travelerTitle->name,
                'type' => (int) $traveler['traveler_type_id'],
                'birthDate' => $model->birthdate,
                'amount' => $totalAmount,
                'ff' => [], /* @todo Frequent flyers */
                'SSRs' => [], /* @todo Special service requests */
                'mobile' => $model->mobile,
            ];
            if ($passengers[$i]['type'] == \TravelerType::TRAVELER_ADULT) {
                $inputs['adults'][] = $passengers[$i];
            } else if ($passengers[$i]['type'] == \TravelerType::TRAVELER_CHILD) {
                $inputs['children'][] = $passengers[$i];
            } else if ($passengers[$i]['type'] == \TravelerType::TRAVELER_INFANT) {
                $inputs['infants'][] = $passengers[$i];
            }
            if (!empty($model->mobile)) {
                $paxMobile = $model->mobile;
            }
            $i++;
            $totalFare += (float) $totalAmount;
        }
        $inputs['price'] = $totalFare;
        $inputs['credentials'] = array(
            'username' => $airSource->username,
            'password' => $airSource->password,
            'timeout' => 85,
            'agentName' => $airSource->spare1,
            'agencyEmail' => $airSource->spare2
                //    ,
                //'passengerMobile'
        );

        //    exit;

        $scraperBook = new scrapperBooking();
        $scraperBook->airSourceId = $airSourceId;
        $scraperBook->segments = $data['segments'];
        $scraperBook->pax = $data['pax'];
        $scraperBook->data = $data;
        $scraperBook->passengers = $passengers;
        $scraperBook->inputs = $inputs;
        $scraperBook->travellers = $travelers;
        //check availability and fares
        $response = $scraperBook->checkAvailabilityAndFares();
        if (!is_array($response)) { //if array is returned then there is error
            $pnrResponse = $scraperBook->createPnr(); //create PNR
            if (is_array($pnrResponse)) { //if error
                return $pnrResponse;
            } else {
               //AcquirePNR
                if ($scraperBook->pnr != null && $scraperBook->error == null) {
                    $acquirePnrResponse = $scraperBook->acquirePnr();
                    if (isset($acquirePnrResponse['message'])) {
                        return ['error' => $response['message']];
                    } else {
                        return $acquirePnrResponse;
                    }
                } else {
                    return ['error' => 'Booking not successful'];
                }
            }
        } else {
            return ['error' => $response['message']];
        }
    }

    /**
     * Based on scrapper booking input array
     * @param type $airSourceId
     * @param type $data
     * @param type $travelers
     * @param type $fop
     * @param type $Cc
     * @return type
     */
    function createPnr() {
        set_time_limit(60);
        $airSource = AirSource::model()->with('backend')->findByPk((int) $this->airSourceId);

        /* @var $airSource \AirSource */
        if (empty($airSource->backend->book)) {
            return ['error' => 'This provider do not have book capability'];
        }
        // Passengers check
        if ($scraperBook->passengers === null) {
            return ["error" => 'The passengers are not added yet'];
        }
        // Segments check
        if ($scraperBook->segments === null) {
            return ["error" => 'The segments are not added yet'];
        }

        $this->error = null;
        $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $airSource->backend->book;
        $params = str_replace('"', '\"', json_encode($this->inputs));
        exec("php \"$script\" " . $params, $output, $status);
        //For Testing 
//        $output = array(
//            'errorMessage' => null,
//            'result' => array(
//                'PNR' => 'K43BXF',
//                'balance' => 12345
//            )
//        );
//
//        $status = 1;
        //End Testing

        $this->status = $status;
        if (!empty($output['errorMessage'])) {
//            return ['error' => $output['errorMessage']];
            $this->error = $output['errorMessage'];
            return ["error" => $this->error];
        }
        if (isset($output['result'])) {
            $result = $output['result'];
            $this->pnr = $result['PNR'];
            $this->balance = $result['balance'];
            return $this->pnr;
        } else {
            return ["error" => 'PNR not created'];
        }

//        \Utils::dbgYiiLog($inputs);
//        \Utils::dbgYiiLog($output);
    }

    /**
     * PNR Acquisition For scrappers
     * @return type
     */
    function acquirePnr() {
        set_time_limit(60);

        $airSource = AirSource::model()->with('backend')->findByPk((int) $this->airSourceId);
        $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $airSource->backend->pnr_acquisition;
        $params['credentials'] = array(
            'username' => $airSource->username,
            'password' => $airSource->password,
            'timeout' => 85,
        );
        $params['pnr'] = $this->pnr;
        $params = str_replace('"', '\"', json_encode($params));
        exec("php \"$script\" " . $params, $output, $status);
        $pnrStr = (string) $this->pnr;
        $pnddata = json_decode($output[0], true);
//       \Utils::dbgYiiLog($pnddata);
        $data = $pnddata[$pnrStr];
        $segments = $this->segments; //$data['flights'];
        if (empty($segments)) {     // This PNR is cancelled
            return ['message' => 'This PNR is cancelled. Can not be imported'];
        }
        if (is_string($segments)) {     // This PNR is cancelled
            return ['message' => $segments];
        }
//        \Utils::dbgYiiLog($segments);
        $passengers = $data['passengers_name'];
        if (empty($passengers)) {
            return ['message' => 'Something is wrong there are no passengers'];
        }

//        \Utils::dbgYiiLog($passengers);
        // Session parameters
        $activeUserId = \Utils::getActiveUserId();
        $activeUserInfoId = \Utils::getActiveCompanyId();
        $loggedUserId = \Utils::getLoggedUserId();

        // Create the AirCart
        $airCart = new \AirCart;
        $airCart->user_id = $activeUserId;        // \Utils::getActiveUserId();
        $airCart->loged_user_id = $loggedUserId;          // \Utils::getLoggedUserId();
        $airCart->payment_status_id = \PaymentStatus::STATUS_NOT_CHARGED;
        $airCart->booking_status_id = \BookingStatus::STATUS_NEW;
        $airCart->approval_status_id = \ApprovalStatus::STATUS_NOT_REQUIRED;
        $airCart->note = 'PNR by scrapper';
        $airCart->insert();

        foreach ($this->passengers as $paxKey => $passenger) {
            // Create travellers if missing
            $traveler = new \Traveler;
            $traveler->user_info_id = $activeUserInfoId;
            $traveler->first_name = $passenger['firstName'];
            $traveler->last_name = $passenger['lastName'];
            $traveler->traveler_title_id = empty($passenger['title']) ? \TravelerTitle::DEFAULT_TITLE : \TravelerTitle::extractTitleFromNameEnd($passenger['title']);
            $traveler->birthdate = empty($passenger['birthDate']) ? null : $passenger['birthDate'];
            $traveler->id = $traveler->insertIfMissing();
            // Add FFs
            if (isset($ffs[$paxKey])) {
                foreach ($ffs[$paxKey] as $ff) {
                    FfSettings::insertIfMissing($traveler->id, $ff['airline'], $ff['code']);
                }
            }
            $addFare = true;  // Flag to add the fare once per pax
            foreach ($segments as $segid => $segment) {
                // Add this AirBooking
                $airBooking = new \AirBooking;
                $airBooking->airline_pnr = isset($this->pnr) ? $this->pnr : null;    // AirPnr of the first segment in the journey
                $airBooking->crs_pnr = isset($this->pnr) ? $this->pnr : null;
                $airBooking->booking_type_id = \BookingType::AUTOMATED_BOOKING;
                $airBooking->air_source_id = $this->airSourceId;
                $airBooking->traveler_type_id = $passenger['type'];
                $airBooking->traveler_id = $traveler->id;
                $airBooking->source_id = \Airport::getIdFromCode($segment[0]['origin']);    // Origin of the first segment in the journey
                $legsCount = count($segment);
                $airBooking->destination_id = \Airport::getIdFromCode($segment[$legsCount - 1]['destination']);    // Destination of the last segment in the journey
                $airBooking->carrier_id = \Carrier::getIdFromCode($segment[0]['marketingCompany']);
                $airBooking->departure_ts = $segment[0]['departTs'];
                $airBooking->arrival_ts = $segment[$legsCount - 1]['arriveTs'];
                $airBooking->service_type_id = \ServiceType::getServiceType($airBooking->source_id, $airBooking->destination_id);
                $airBooking->fare_basis = !empty($passenger['fareBasis']) ? $passenger['fareBasis'] : null;
                $airBooking->booking_class = "S"; //$segments[$journey[0]]['bookingClass'];
                $airBooking->fare_type_id = \FareType::getFareType($airBooking->carrier_id, $airBooking->booking_class);
                $airBooking->frequent_flyer = null;
                $airBooking->tour_code = null;
                $airBooking->endorsment = null;
                $airBooking->air_cart_id = $airCart->id;
                if (!empty($this->fares[$segid]['pax'])) {
                    $addFare = true;
                    $fares = $this->fares;
                }
                $airBooking->private_fare = $fares[$segid]['pax'][$passenger['type']]['totalFare'];
                // Fill up the fares data for the first segment
                if ($addFare) {
                    $airBooking = \Taxes::fillTaxesInAirBooking($airBooking, $fares[$segid]['pax'][$passenger['type']]['arrTaxes']);
                    $airBooking->basic_fare = $fares[$segid]['pax'][$passenger['type']]['baseFare'];
                    $addFare = false;
                }
                if (isset($this->pnr)) {
                    $airBooking->ticket_number = 'N/A';
                }

//                \Utils::dbgYiiLog($airBooking->attributes);
                $airBooking->insert();

                foreach ($segment as $leg) {
                    if (is_array($leg)) {
                        continue;       // Skip the fares element
                    }
                    // Add this AirRoute
                    $airRoute = new \AirRoutes;
                    $airRoute->air_booking_id = $airBooking->id;
                    $airRoute->airPnr = isset($this->pnr) ? $this->pnr : null;
                    $airRoute->aircraft = null; // $segments[$segmentKey]['aircraft'];
                    $airRoute->arrival_ts = $leg['arriveTs'];
                    $airRoute->booking_class = null; //$leg['bookingClass'];
                    $airRoute->carrier_id = \Carrier::getIdFromCode($leg['marketingCompany']);
                    $airRoute->departure_ts = $leg['departTs'];
                    $airRoute->destination_id = \Airport::getIdFromCode($leg['destination']);
                    $airRoute->destination_terminal = getDepartureTerminal($data, $leg); // $segments[$segmentKey]['arrivalTerminal'];
                    $airRoute->fare_basis = empty($passenger['fareBasis']) ? null : $passenger['fareBasis'];
                    $airRoute->flight_number = $leg['flightNumber'];
                    $airRoute->source_id = \Airport::getIdFromCode($leg['origin']);
                    $airRoute->source_terminal = getArrivalTerminal($data, $leg); // $segments[$segmentKey]['departureTerminal'];
                    $airRoute->seat = null; //empty($seats[$paxKey][$segmentKey]) ? null : $seats[$paxKey][$segmentKey];
                    $airRoute->meal = null; //empty($meals[$paxKey][$segmentKey]) ? null : $meals[$paxKey][$segmentKey];
                    $airRoute->insert();
                }
                $airBooking->setAirRoutesOrder();
            }
        }
        $airCart->applyBothRules();
        $airCart->setBookingStatus();
        return ['airCartId' => $airCart->id];
    }

    function getArrivalTerminal($data, $leg) {
        $flights = $data['flights'];
        foreach ($flights as $flight) {
            $flightNumber = $leg['marketingCompany'] . '-' . $leg['flightNumber'];
            if (($flight['flight_number'] === $flightNumber) && ($flight['destination'] === $leg['destination']) && ($flight['arrive'] === $leg['arriveTs'])) {
                return $flight['destination_terminal'];
            }
        }
        return null;
    }

    function getDepartureTerminal($data, $leg) {
        $flights = $data['flights'];
        foreach ($flights as $flight) {
            $flightNumber = $leg['marketingCompany'] . '-' . $leg['flightNumber'];
            if (($flight['flight_number'] === $flightNumber) && ($flight['origin'] === $leg['origin']) && ($flight['depart'] === $leg['departTs'])) {
                return $flight['origin_terminal'];
            }
        }
        return null;
    }

    static function merge_fares(array $onwardfares, array $returnfares) {

        $omatches = array();
        $rmatches = array();
        preg_match_all('/(.*?): ([\d]+[\.]?[\d]*)/', str_replace('<br>', '', $onwardfares['taxesDetails']), $omatches);
        preg_match_all('/(.*?): ([\d]+[\.]?[\d]*)/', str_replace('<br>', '', $returnfares['taxesDetails']), $rmatches);

        $amount = (float) $onwardfares['amount'] + (float) $returnfares['amount'];
        $baseFare = (float) $onwardfares['baseFare'] + (float) $returnfares['baseFare'];
        $taxesTotal = (float) $onwardfares['taxesTotal'] + (float) $returnfares['taxesTotal'];
        $str = "";
        $first = true;
        foreach ($omatches[2] as $id => $data) {
            $taxtotal = (float) $data + (float) $data;
            if (!$first) {
                $str = $str . "<br>";
            }
            $first = false;
            $str = $str . $omatches[1][$id] . ": " . $taxtotal;
        }

        $out = array(
            "amount" => $amount,
            "baseFare" => $baseFare,
            "taxesTotal" => $taxesTotal,
            "taxesDetails" => $str
        );
//    \Utils::dbgYiiLog($out);


        return $out;
    }

    function getPax($fares, $adultsCount, $childCount, $infantCount) {
        unset($psngrs);

        for ($j = 0; $j < $adultsCount; $j++) {
            $psngrs[] = array_merge($fares['adult'], ['type' => \TravelerType::TRAVELER_ADULT]);
        }
        for ($j = 0; $j < $childCount; $j++) {
            $psngrs[] = array_merge($fares['child'], ['type' => \TravelerType::TRAVELER_CHILD]);
        }
        for ($j = 0; $j < $infantCount; $j++) {
            $psngrs[] = array_merge($fares['infant'], ['type' => \TravelerType::TRAVELER_INFANT]);
        }
        unset($returnPax);
        foreach ($psngrs as $passager) {

            $returnPax['pax'][$passager['type']] = [
                'totalFare' => $passager['amount'],
                'type' => \Utils::$paxTypes[$passager['type']],
                'arrTaxes' => \Taxes::reformatScrapperTaxes($passager['taxesDetails']),
                'fareBasis' => \Taxes::SCRAPPER_FARE_BASE . $this->airSourceId,
                'taxesTotal' => $passager['taxesTotal'],
                'baseFare' => $passager['baseFare'],
            ];
        }

        foreach ($returnPax['pax'] as $paxTypeId => $value) {
            if (!isset($returnPax['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                $returnPax['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
            }
            $returnPax['pax'][$paxTypeId]['totalFare'] = $returnPax['pax'][$paxTypeId]['totalFare'] + $returnPax['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
        }

        return $returnPax;
    }

}
