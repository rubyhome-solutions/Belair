<?php

namespace application\components\Indigo;

class Utils {

    const PRODUCTION_AIRSOURCE_ID = 31;
    const TEST_AIRSOURCE_ID = 28;
    const TRAVELER_INFANT = 'INFT';
    const LITE_FARE = 'LITE';
    const REGULAR_FARE = 'REGULAR';
    const FLEXI_FARE = 'FLEXI';
    static $grouping = null;
    static $passengerTypes = [
        \TravelerType::TRAVELER_ADULT => 'ADT',
        \TravelerType::TRAVELER_CHILD => 'CHD',
        \TravelerType::TRAVELER_INFANT => self::TRAVELER_INFANT,
    ];
    static $passengerTypeToId = [
        'ADT' => \TravelerType::TRAVELER_ADULT,
        'CHD' => \TravelerType::TRAVELER_CHILD,
        self::TRAVELER_INFANT => \TravelerType::TRAVELER_INFANT,
    ];
    static $cabinClass = [
        \CabinType::ECONOMY => 'E',
        \CabinType::PREMIUM_ECONOMY => 'Y',
        \CabinType::BUSINESS => 'C',
        \CabinType::FIRST => 'F',
    ];
    
    static $productClass = [
        'R'=>self::REGULAR_FARE,
        'J'=>self::FLEXI_FARE,
        'B'=>self::LITE_FARE
    ];
    
    /**
     * List of originatimg Airports that have tax exceptions
     * @var array
     */
    static $taxExceptions = [
        'SXR',
        'IXJ',
        'BKK',
        'DXB',
        'MCT',
        'SIN',
        'KTM'
    ];

    /**
     * This tax should not be taken into account
     */
    const TAX_TO_SUBSTRACT = 'TTF-defunct';
    const SCRAPPER_TAX_TO_SUBSTRACT = 'Agency Commission - defunct';

    /**
     * This tax should be adjusted with 4.95% of the TAX_TO_SUBSTRACT
     */
    const TAX_TO_ADJUST = 'SVCT-defunct';
    const SCRAPPER_TAX_TO_ADJUST = 'Government Service Tax';

    /**
     * The coefficient used for multiplication adjustment of the service tax.
     */
    const MULTIPLIER_FOR_ADJUSTING = 0.0495;

    static $taxesReformat = [
        'YQ' => \Taxes::TAX_YQ,
        'TRF' => \Taxes::TAX_YQ,
        'PHF' => \Taxes::TAX_YQ,
        'PSF' => \Taxes::TAX_PSF,
        'UDF' => \Taxes::TAX_UDF,
        'DF' => \Taxes::TAX_UDF,
        'UDFA' => \Taxes::TAX_UDF,
        'AAT' => \Taxes::TAX_UDF,
        'JN' => \Taxes::TAX_JN,
        'SVCF' => \Taxes::TAX_JN,
        'SVCT' => \Taxes::TAX_JN,
        '25PRCT' => \Taxes::TAX_OTHER,
        'TTF' => \Taxes::TAX_OTHER,
        'ZR' => \Taxes::TAX_OTHER,
        'AE' => \Taxes::TAX_OTHER,
    ];
    static $taxesScrapperReformat = [
        'CUTE Charge' => \Taxes::TAX_YQ,
        'Fuel Charge' => \Taxes::TAX_YQ,
        'Agency Commission' => \Taxes::TAX_OTHER,
        'Development Fee' => \Taxes::TAX_UDF,
        'Passenger Service Fee' => \Taxes::TAX_PSF,
        'User Development fee' => \Taxes::TAX_UDF,
        'Arrival User Development Fee' => \Taxes::TAX_UDF,
        'Government Service Tax' => \Taxes::TAX_JN,
    ];

    /**
     * Cancel PNR
     * @param int $airCartId
     * @return boolean True or array with error component
     */
    static function cancelPnr($airCartId) {
        $airCart = \AirCart::model()->with('airBookings')->findByPk($airCartId);
        /* @var $airCart \AirCart */
        if (!$airCart || empty($airCart->airBookings)) {
            return ['error' => "This cart do not have bookings or can't be found"];
        }
        $api = new PnrManagement($airCart->airBookings[0]->air_source_id);
        $res = $api->cancelPnr($airCart->airBookings[0]->crs_pnr);
        // If string is returned , than this is a error
        if (is_string($res)) {
            return ['error' => $res];
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('pnr_structure.json', $res);
        }
        return true;
    }

    static function reformatScrapperTaxes($str) {
        preg_match_all('/(.*?):?\s(\d+)/', str_replace('<br>', '', $str), $matches);
//        echo \Utils::dbg($matches);
        $tax = new \Taxes;
//        $difference = 0;
        foreach ($matches[1] as $key => $taxName) {
            if ($taxName === self::SCRAPPER_TAX_TO_SUBSTRACT) {
                $tax->arrTaxes[\Taxes::TAX_TOTAL_CORRECTION] = round((1 + self::MULTIPLIER_FOR_ADJUSTING) * (float) $matches[2][$key]);
                $tax->arrTaxes[self::$taxesScrapperReformat[self::SCRAPPER_TAX_TO_ADJUST]] -= round(self::MULTIPLIER_FOR_ADJUSTING * (float) $matches[2][$key]);
            } else {
                $tax->arrTaxes[self::$taxesScrapperReformat[$taxName]] += (float) $matches[2][$key];
            }
        }
        return $tax->arrTaxes;
    }

    static function reformatTaxes($param) {
        $tax = new \Taxes;
        foreach ($param as $key => $value) {
            if ($key === self::TAX_TO_SUBSTRACT) {
                $tax->arrTaxes[\Taxes::TAX_TOTAL_CORRECTION] = round((1 + self::MULTIPLIER_FOR_ADJUSTING) * (float) $value);
                $tax->arrTaxes[self::$taxesReformat[self::TAX_TO_ADJUST]] -= round(self::MULTIPLIER_FOR_ADJUSTING * (float) $value);
            } else {
                $tax->arrTaxes[isset(self::$taxesReformat[$key]) ? self::$taxesReformat[$key] : \Taxes::TAX_OTHER] += (float) $value;
            }
        }
        // Fix the negative JN
        if ($tax->arrTaxes[\Taxes::TAX_JN] < 0) {
            $tax->arrTaxes[\Taxes::TAX_JN] = 0;
        }
        return $tax->arrTaxes;
    }

    /**
     * Convert as 2014-11-17T07:45:00 --> 2014-11-17 07:45
     * @param string $strDateTime
     * @return string
     */
    static function shortenDateAndTime($strDateTime) {
        return substr($strDateTime, 0, 10) . " " . substr($strDateTime, 11, 5);
    }

    /**
     * Convert as 2014-11-17 07:45 --> 2014-11-17T07:45:00
     * @param string $strDateTime
     * @return string
     */
    static function prepareDateAndTime($strDateTime) {
        return str_replace(' ', 'T', $strDateTime) . ':00';
    }

    /**
     * Spicejet search
     * @param int $airSourceId The AirSource ID
     * @param \stdClass $params
     * @return string JSON encoded search result
     */
    static function search($airSourceId, \stdClass $params) {
//        \Utils::dbgYiiLog(__METHOD__ . ' is called');
        // Departure date test
        if (strtotime($params->depart) < strtotime(date(DATE_FORMAT))) {
            return "Departure in the past";
        }
        if ($params->category != \CabinType::ECONOMY) {
            return "6E can serve only economy class";
        }
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        \Yii::import('application.components.Indigo.BookingManager', true);
        
        if ($airSource->spare2 === self::LITE_FARE && strtotime($params->depart) < strtotime(date(DATE_FORMAT,strtotime('+15 days')))) {
            return "Lite Fare is applicable only 15 days before only";
        }
        $test = false;
//        $test = YII_DEBUG;
        if (!$test) {
            $apiSesMan = new SessionManager([], $airSource->backend->wsdl_file);
            $signature = $apiSesMan->Logon($airSourceId);
            if ($signature === false) {
                return "Invalid credentials";
            }
            $bookingApi = new BookingManager($signature, [], $airSource->backend->wsdl_file);
        }
        for ($i = 0; $i < $params->adults; $i++) {
            $priceTypes[] = new PaxPriceType("ADT");
        }
        for ($i = 0; $i < $params->children; $i++) {
            $priceTypes[] = new PaxPriceType("CHD");
        }

        $passengersCount = $params->adults + $params->children;
        $availabilityRequest = new AvailabilityRequest(
                $params->depart, $params->depart, FlightType::All, $passengersCount, DOW::Daily, AvailabilityType::aDefault, 3, AvailabilityFilter::ExcludeUnavailable, FareClassControl::LowestFareClass, null, null, SSRCollectionsMode::None, InboundOutbound::None, null, false, false, FareRuleFilter::aDefault, LoyaltyFilter::MonetaryOnly);
        $availabilityRequest->PaxPriceTypes = $priceTypes;
        $availabilityRequest->DepartureStation = $params->source;
        $availabilityRequest->ArrivalStation = $params->destination;
        $availabilityRequest->CurrencyCode = "INR";
        
        //check for only lite Fare
        if ($airSource->spare2 === self::LITE_FARE) {
            $availabilityRequest->FareTypes[] = 'Z';
            $availabilityRequest->ProductClasses[] = 'B';
        }
        //$availabilityRequest->ProductClasses[] = 'N';
//        $availabilityRequest->FareClasses[] = self::$cabinClass[$params->category];
        // Which Cabin type we are interested in
//        $availabilityRequest->FareClasses[] = \CabinType::$iataCabinClass[CabinType::FIRST];
        $tripAvailabilityRequest = new TripAvailabilityRequest(LoyaltyFilter::MonetaryOnly);
        $tripAvailabilityRequest->AvailabilityRequests[] = $availabilityRequest;

        // If we have return trip, then configure new AvailabilityRequest for the return trip
        if (!empty($params->return)) {
            $ar2 = new AvailabilityRequest(
                    $params->return, $params->return, FlightType::All, $passengersCount, DOW::Daily, AvailabilityType::aDefault, 3, AvailabilityFilter::ExcludeUnavailable, FareClassControl::LowestFareClass, null, null, SSRCollectionsMode::None, InboundOutbound::None, null, false, false, FareRuleFilter::aDefault, LoyaltyFilter::MonetaryOnly);
            foreach ($priceTypes as $value) {
                $priceTypes2[] = clone $value;
            }
            $ar2->PaxPriceTypes = $priceTypes2;
            $ar2->DepartureStation = $params->destination;
            $ar2->ArrivalStation = $params->source;
            $ar2->CurrencyCode = "INR";
            //search only for lite fare
            if ($airSource->spare2 === self::LITE_FARE) {
                $ar2->FareTypes[] = 'Z';
                $ar2->ProductClasses[] = 'B';
            }
//            $ar2->FareClasses[] = self::$cabinClass[$params->category];

            $tripAvailabilityRequest->AvailabilityRequests[] = $ar2;
        }
        $debugFilename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'indigo_GetAvailability_response.json';
        if (!$test) {
            $request = new GetAvailabilityRequest($tripAvailabilityRequest);
            $response = $bookingApi->GetAvailability($request);
            if (YII_DEBUG) {
                file_put_contents($debugFilename, json_encode($response));
            }
        } else {
            $response = json_decode(file_get_contents($debugFilename));
        }

        $arr = json_decode(json_encode($response), true);
        if (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey']) &&
                isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'])) {   // More then one result
            // Fix single onward Journey case
            if (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey'][0])) {
                $a1 = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey'];
            } else {
                $a1[0] = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey'];
            }
            // Fix single return Journey case
            if (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'][0])) {
                $a2 = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'];
            } else {
                $a2[0] = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'];
            }
            $journeys = array_merge($a1, $a2);
            $taxException = self::isTaxException($params->destination);
        } elseif (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'])) {     // One result
            $journeys = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'];
            $taxException = false;
        } else {        // No results
            return "No flights available";
        }
        // Single journey case
        if (!isset($journeys[0])) {
            $journeys = [$journeys];
        }

//        \Utils::dbgYiiLog($journeys); //    exit;
        // Price info
        if ($taxException) {
            $itineraryPriceResponse = self::taxExceptionPriceInfo($a1, $a2, $params->infants, $passengersCount, $priceTypes, $test ? false : $bookingApi);
            if (!$test) {
                $apiSesMan->Logout();
            }
        } else {
            //for Indigo api new  changes
            $itineraryPriceResponse = [];
            $i = 0;
            $segments_flights = [];
            $repeated_journey = [];
            $repeated_segment_journey = [];
            $filtered_journey = [];

            foreach ($journeys as $key => $jorney) {
                if (isset($jorney['Segments']['Segment'][0])) {
                    //Lite fare is not applicable for connecting flights
                    if($airSource->spare2 === self::LITE_FARE){
                        continue;
                    }
                    $segments = $jorney['Segments']['Segment'];
                    $repeated_segment_journey[] = $jorney;
                } else {
                    $segments[0] = $jorney['Segments']['Segment'];
                    $filtered_journey [] = $jorney;
                }
            }


            if (count($filtered_journey) > 0) {
                self::parseGetItineryResponse($params, $filtered_journey, $test, $bookingApi, $itineraryPriceResponse, $passengersCount, $priceTypes);
            }

            if (count($repeated_segment_journey) > 0) {
                self::parseGetItineryResponse($params, $repeated_segment_journey, $test, $bookingApi, $itineraryPriceResponse, $passengersCount, $priceTypes, false);
            }
            //\Utils::dbgYiiLog($itineraryPriceResponse);
            //\Yii::app()->end();
            $debugFilename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'indigo_GetItineraryPrice_response.json';
            if (!$test) {
                $apiSesMan->Logout();
                if (YII_DEBUG) {
                    \Utils::objectToFile($debugFilename, $itineraryPriceResponse);
                }
            } else {
                $itineraryPriceResponse = \Utils::fileToObject($debugFilename);
            }
        }
        //\Utils::dbgYiiLog($itineraryPriceResponse);
        // Return empty array in case of mising Journeys elements
        if (!isset($itineraryPriceResponse->Booking->Journeys->Journey)) {
            return json_encode([]);
        }

        // Make as array even single journey
        if (!is_array($itineraryPriceResponse->Booking->Journeys->Journey)) {
            $itineraryPriceResponse->Booking->Journeys->Journey = [$itineraryPriceResponse->Booking->Journeys->Journey];
        }
        // Attach infants to the Itinerary response as passengers PaxFare objects
        if (isset($itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees)) {
            $passenger0 = $itineraryPriceResponse->Booking->Passengers->Passenger;   // Single passenger
        } else {
            $passenger0 = $itineraryPriceResponse->Booking->Passengers->Passenger[0];   // Multiple passengers
        }
        if ((isset($passenger0->PassengerFees->PassengerFee->FeeCode) &&
                $passenger0->PassengerFees->PassengerFee->FeeCode == self::$passengerTypes[\TravelerType::TRAVELER_INFANT]) ||
                (isset($passenger0->PassengerFees->PassengerFee[0]->FeeCode) &&
                $passenger0->PassengerFees->PassengerFee[0]->FeeCode == self::$passengerTypes[\TravelerType::TRAVELER_INFANT])) {
            foreach (\Utils::toArray($passenger0->PassengerFees->PassengerFee) as $paxFee) {
                $infants[$paxFee->FlightReference] = $paxFee->ServiceCharges; //->BookingServiceCharge;
            }
//            echo \Utils::dbgYiiLog($infants);
            foreach ($itineraryPriceResponse->Booking->Journeys->Journey as $jKey => $journey) {
                if (is_array($journey->Segments->Segment)) {
                    $firstSegment = $journey->Segments->Segment[0];
                    $arrivalStation = $journey->Segments->Segment[0]->ArrivalStation;
                    $mSegments = true;
                } else {
                    $firstSegment = $journey->Segments->Segment;
                    $arrivalStation = $firstSegment->ArrivalStation;
                    $mSegments = false;
                }
                $std = substr(str_replace('-', '', $firstSegment->STD), 0, 8);
                $key = $std . " " . $firstSegment->FlightDesignator->CarrierCode . $firstSegment->FlightDesignator->FlightNumber . " " .
                        $firstSegment->DepartureStation . $firstSegment->ArrivalStation;
                if (!empty($infants[$key])) {
                    for ($i = 0; $i < $params->infants; $i++) {
                        $newPF = new PaxFare(MessageState::aNew);
                        $newPF->PaxType = self::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                        $newPF->ServiceCharges = $infants[$key];
                        if (is_array($firstSegment->Fares->Fare->PaxFares->PaxFare)) {
                            if ($mSegments) {
                                $itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment[0]->Fares->Fare->PaxFares->PaxFare[] = $newPF;
                            } else {
                                $itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment->Fares->Fare->PaxFares->PaxFare[] = $newPF;
                            }
                        } else {
                            if ($mSegments) {
                                $itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment[0]->Fares->Fare->PaxFares->PaxFare = [$journey->Segments->Segment[0]->Fares->Fare->PaxFares->PaxFare, $newPF];
                            } else {
                                $itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment->Fares->Fare->PaxFares->PaxFare = [$journey->Segments->Segment->Fares->Fare->PaxFares->PaxFare, $newPF];
                            }
                        }
                    }
                }
            }
//            \Utils::dbgYiiLog($itineraryPriceResponse->Booking->Journeys->Journey);
            // Add Infants to passengers in the journeys array
            foreach ($journeys as $jKey => $journey) {
                // Indigo int via flight
                if (isset($journey['Segments']['Segment'][0]['STD'])) {
                    $firstSegment = $journey['Segments']['Segment'][0];
                    $arrivalStation = $journey['Segments']['Segment'][1]['ArrivalStation'];
                    $mSegments = true;
                } else {
                    $firstSegment = $journey['Segments']['Segment'];
                    $arrivalStation = $firstSegment['ArrivalStation'];
                    $mSegments = false;
                }
                $std = substr(str_replace('-', '', $firstSegment['STD']), 0, 8);
                $key = $std . " " . $firstSegment['FlightDesignator']['CarrierCode'] . $firstSegment['FlightDesignator']['FlightNumber'] . " " .
                        $firstSegment['DepartureStation'] . $firstSegment['ArrivalStation'];
                if (isset($infants[$key])) {
                    for ($i = 0; $i < $params->infants; $i++) {
                        $newPF = new PaxFare(MessageState::aNew);
                        $newPF->PaxType = self::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                        $newPF->ServiceCharges = $infants[$key];
                        $newPF = json_decode(json_encode($newPF), true);
                        if (isset($firstSegment['Fares']['Fare']['PaxFares']['PaxFare'][0])) {
                            if ($mSegments) {
                                $journeys[$jKey]['Segments']['Segment'][0]['Fares']['Fare']['PaxFares']['PaxFare'][] = $newPF;
                            } else {
                                $journeys[$jKey]['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'][] = $newPF;
                            }
                        } else {
                            if ($mSegments) {
                                $journeys[$jKey]['Segments']['Segment'][0]['Fares']['Fare']['PaxFares']['PaxFare'] = [$firstSegment['Fares']['Fare']['PaxFares']['PaxFare'], $newPF];
                            } else {
                                $journeys[$jKey]['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'] = [$firstSegment['Fares']['Fare']['PaxFares']['PaxFare'], $newPF];
                            }
                        }
                    }
                }
            }
        }
        
        

        // Prepare the fares details
        foreach (\Utils::toArray($itineraryPriceResponse->Booking->Journeys->Journey) as $journey) {
            unset($segments);
            $seg_count=0;
            if (is_array($journey->Segments->Segment)) {
                $segments = $journey->Segments->Segment;
            } else {
                $segments[0] = $journey->Segments->Segment;
            }
            foreach ($segments as $segment) {
                if (!isset($segment->Fares->Fare->PaxFares->PaxFare)) {
                    continue;
                }
                foreach (\Utils::toArray($segment->Fares->Fare->PaxFares->PaxFare) as $fare) {
                    $fareKey = $segment->Fares->Fare->FareSellKey . '~' . reset($segments)->DepartureStation . end($segments)->ArrivalStation;
                    if($seg_count >0 ){
                        $fareKey .= 'segment2';
                    }
                    if ($fare->PaxType == self::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                        $fareKey .= "~" . self::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                    }

                    $fares[$fareKey]['fareBasis'] = $segment->Fares->Fare->FareBasisCode;
                    $fares[$fareKey]['bookingClass'] = $segment->Fares->Fare->FareClassOfService;
                    $fares[$fareKey]['productClass'] = isset(self::$productClass[$segment->Fares->Fare->ProductClass])?self::$productClass[$segment->Fares->Fare->ProductClass]:self::REGULAR_FARE;
                    $fares[$fareKey]['text'] = '';
                    $fares[$fareKey]['amount'] = 0;
                    $taxAdjust = 0;
                    $taxes = [
                        \Taxes::TAX_YQ => 0,
                        \Taxes::TAX_UDF => 0,
                        \Taxes::TAX_PSF => 0,
                        \Taxes::TAX_JN => 0,
                        \Taxes::TAX_OTHER => 0,
                        \Taxes::TAX_TOTAL_CORRECTION => 0,
                    ];
                    
                    foreach (\Utils::toArray($fare->ServiceCharges->BookingServiceCharge) as $charge) {
                        if (!empty($charge->ChargeCode) &&
                                $charge->ChargeCode != self::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                            // Drop out certain tax, that is not applicable, but is still sent
//                            if ($charge->ChargeCode === self::TAX_TO_SUBSTRACT) {
////                    $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . (float) $charge->Amount . "<br>";
//                                $taxAdjust = (int) $charge->Amount;
//                                $taxes[\Taxes::TAX_TOTAL_CORRECTION] = $taxAdjust;
//                            } else {
//                                if ($taxAdjust <> 0 && $charge->ChargeCode === self::TAX_TO_ADJUST) {
//                                    $deduct = round($taxAdjust * self::MULTIPLIER_FOR_ADJUSTING);
//                                    $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . ((int) ($charge->Amount) - $deduct) . "<br>";
//                                    $fares[$fareKey]['amount'] += ((int) ($charge->Amount) - $deduct);
//                                    $taxes[self::$taxesReformat[$charge->ChargeCode]] += ((int) ($charge->Amount) - $deduct);
//                                    $taxes[\Taxes::TAX_TOTAL_CORRECTION] += $deduct;
                              //  } else {
                                    $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . (float) $charge->Amount . "<br>";
                                    $fares[$fareKey]['amount'] += (float) $charge->Amount;
                                    $taxes[isset(self::$taxesReformat[$charge->ChargeCode]) ? self::$taxesReformat[$charge->ChargeCode] : \Taxes::TAX_OTHER] += (int) ($charge->Amount);
                                    // Infant baseAmount correction
                                    if ($fare->PaxType == self::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                                        $fares[$fareKey]['baseAmount'] -= (float) $charge->Amount;
                                    }
                               // }
                           // }
                        } else {
                            $fares[$fareKey]['baseAmount'] = (float) $charge->Amount;
                        }
                    }
                    $fares[$fareKey]['taxes'] = $taxes;
                }
                $seg_count++;
            }
//            \Utils::dbgYiiLog($fares);
        }

        $serviceTypeId = \Airport::getServiceTypeIdFromCode($params->source, $params->destination);
        $rows = [];
        $resultCount = 0;
        self::$grouping = \RoutesCache::getNextGroupId();
        foreach ($journeys as $jorney) {
            // Indigo international via
            if (isset($jorney['Segments']['Segment'][0])) {
                $firstSegment = $jorney['Segments']['Segment'][0];
                $secondSegment = $jorney['Segments']['Segment'][1];
                $arrivingStation = $jorney['Segments']['Segment'][1]['ArrivalStation'];
                unset($leg1);
                unset($leg2);
                if (isset($firstSegment['Legs']['Leg'][0])) {
                    $leg1 = $firstSegment['Legs']['Leg'];
                } else {
                    $leg1[0] = $firstSegment['Legs']['Leg'];
                }
                if (isset($jorney['Segments']['Segment'][1]['Legs']['Leg'][0])) {
                    $leg2 = $jorney['Segments']['Segment'][1]['Legs']['Leg'];
                } else {
                    $leg2[0] = $jorney['Segments']['Segment'][1]['Legs']['Leg'];
                }
                $firstSegment['Legs']['Leg'] = array_merge($leg1, $leg2);
            } else {
                $firstSegment = $jorney['Segments']['Segment'];
                $arrivingStation = $firstSegment['ArrivalStation'];
            }
            $departureStation = $firstSegment['DepartureStation'];
            if (isset($firstSegment['Fares']['Fare']['PaxFares']['PaxFare'][0])) {
                $passengers = $firstSegment['Fares']['Fare']['PaxFares']['PaxFare'];
            } else {
                unset($passengers);
                $passengers[0] = $firstSegment['Fares']['Fare']['PaxFares']['PaxFare'];
            }
            unset($legs);
            if (isset($firstSegment['Legs']['Leg'][0])) {
                $legs = $firstSegment['Legs']['Leg'];  // Multiple legs
            } else {
                $legs[0] = $firstSegment['Legs']['Leg'];   // Single leg
            }

            $fsk = $firstSegment['Fares']['Fare']['FareSellKey'] . '~' . $departureStation . $arrivingStation;
            if(isset($secondSegment)){
                $fsk2 = $secondSegment['Fares']['Fare']['FareSellKey'] . '~' . $departureStation . $arrivingStation.'segment2';
            }else{
                $fsk2='';
            }
            
            
            $rows = array_merge($rows, self::prepareCacheRow($legs, $passengers, $fares, $airSourceId, $serviceTypeId, $fsk,$fsk2, $params));
            $resultCount++;
            if ($resultCount > 99) {
                break;  // Do not consider more than 100 results.
            }
//            echo \Utils::dbg($legs);
        }
        // \Utils::dbgYiiLog($rows);
        return json_encode($rows);
    }

    static function prepareLegsJson($legs, $bookingClass,$productClass=null) {
        $out = [];
        foreach ($legs as $leg) {
            $legsJson = new \LegsJson;
            $legsJson->arrive = self::shortenDateAndTime($leg['STA']);
            $legsJson->depart = self::shortenDateAndTime($leg['STD']);
            $legsJson->destination = \Airport::getAirportCodeAndCityNameFromCode($leg['ArrivalStation']);
            $legsJson->destinationTerminal = $leg['LegInfo']['ArrivalTerminal'];
            $legsJson->flighNumber = $leg['FlightDesignator']['CarrierCode'] . '-' . trim($leg['FlightDesignator']['FlightNumber']);
            $legsJson->origin = \Airport::getAirportCodeAndCityNameFromCode($leg['DepartureStation']);
            $legsJson->originTerminal = $leg['LegInfo']['DepartureTerminal'];
            $legsJson->time = \Utils::convertSecToHoursMins(strtotime($leg['STA']) - strtotime($leg['STD']));
            $legsJson->bookingClass = $bookingClass;
            $legsJson->aircraft = $leg['LegInfo']['EquipmentType'];
            $legsJson->product_class = $productClass;
            $out[] = $legsJson;
        }
        return $out;
    }

    static function prepareHashStr($airSourceId, $legs, $cabinTypeId,$productClass=null) {
        $out = $airSourceId . \RoutesCache::HASH_SEPARATOR . $cabinTypeId . \RoutesCache::HASH_SEPARATOR;
        foreach ($legs as $leg) {
            $out .= $leg['DepartureStation'] . \RoutesCache::HASH_SEPARATOR;
            $out .= self::shortenDateAndTime($leg['STD']) . \RoutesCache::HASH_SEPARATOR;
            $out .= $leg['FlightDesignator']['CarrierCode'] . '-' . trim($leg['FlightDesignator']['FlightNumber']) . \RoutesCache::HASH_SEPARATOR;
            $out .= $leg['ArrivalStation'] . \RoutesCache::HASH_SEPARATOR;
            $out .= $productClass.\RoutesCache::HASH_SEPARATOR;
        }
        return $out;
    }

    static function prepareCacheRow($legs, $passagers, $fares, $airSourceId, $serviceTypeId, $fsk,$fsk2, $params) {
        $processedPaxTypes = [];
        $rows = [];
        // strHash format: <Origin>~<departTs>~<FlightNumber>~<Destination1>~<departTs>~<FlightNumber>~<Destination2>~...
        $strHash = self::prepareHashStr($airSourceId, $legs, $params->category,$fares[$fsk]['productClass']);
        $tmpRow = new \stdClass;
        $tmpRow->stops = count($legs) - 1;
        $round_trip = empty($params->return) ? 0 : 1;
        $firstLeg = reset($legs);
        $lastLeg = end($legs);
        if ($round_trip === 0) {
            $order = \RoutesCache::ORDER_SINGLE_JOURNEY;    // Single journey
        } elseif ($params->source == $firstLeg['DepartureStation']) {
            $order = \RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO;    // First journey from 2
        } else {
            $order = \RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO;    // Second journey from 2
        }
        // default values
        list($tmpRow->return_date, $tmpRow->return_time) = [$params->return, null];

        list($tmpRow->departure_date, $tmpRow->departure_time) = explode('T', $firstLeg['STD']);
        list($tmpRow->arrival_date, $tmpRow->arrival_time) = explode('T', $lastLeg['STA']);
        $tmpRow->origin_id = \Airport::getIdFromCode($firstLeg['DepartureStation']);
        $tmpRow->destination_id = \Airport::getIdFromCode($lastLeg['ArrivalStation']);
        $tmpRow->flight_number = trim($firstLeg['FlightDesignator']['FlightNumber']);
        $tmpRow->carrier_id = \Carrier::getIdFromCode($firstLeg['FlightDesignator']['CarrierCode']);
        $tmpRow->legsJson = json_encode(self::prepareLegsJson($legs, $fares[$fsk]['bookingClass'],$fares[$fsk]['productClass']));
        foreach ($passagers as $passager) {
            if (in_array($passager['PaxType'], $processedPaxTypes)) {
                continue;
            }
            $processedPaxTypes[] = $passager['PaxType'];
            $tmpFsk = $fsk;
            if ($passager['PaxType'] === self::TRAVELER_INFANT) {
                $tmpFsk .= "~" . self::TRAVELER_INFANT;
            }
            if($fsk2!='' && isset($fares[$fsk2]['amount']) && self::$passengerTypeToId[$passager['PaxType']] !=3){
               $amount=$fares[$tmpFsk]['amount']+$fares[$fsk2]['amount'];
               $baseAmount=$fares[$tmpFsk]['baseAmount']+$fares[$fsk2]['baseAmount'];
            }else{
                $amount=$fares[$tmpFsk]['amount'];
               $baseAmount=$fares[$tmpFsk]['baseAmount'];
            }

            if (!isset($fares[$tmpFsk])) {
                \Utils::objectToFile(\Yii::app()->runtimePath . '/indigo_missing_fare_key.json', [
                    'key' => $tmpFsk,
                    'fares' => $fares
                ]);
                continue;
            }

            $row = new \RoutesCache;
            $row->cabin_type_id = $params->category;
            $row->departure_date = $tmpRow->departure_date;
            $row->departure_time = \Utils::cutSeconds($tmpRow->departure_time);
            $row->arrival_date = $tmpRow->arrival_date;
            $row->arrival_time = \Utils::cutSeconds($tmpRow->arrival_time);
            $row->return_date = $tmpRow->return_date;
            $row->return_time = $tmpRow->return_time;
            $row->origin_id = $tmpRow->origin_id;
            $row->destination_id = $tmpRow->destination_id;
            $row->carrier_id = $tmpRow->carrier_id;
            $row->stops = $tmpRow->stops;
            $row->flight_number = $tmpRow->flight_number;
            $row->legs_json = $tmpRow->legsJson;
            $row->grouping = self::$grouping;
            $row->order_ = $order;
            $row->round_trip = $round_trip;
            $row->traveler_type_id = self::$passengerTypeToId[$passager['PaxType']];
            $row->fare_basis = $fares[$tmpFsk]['fareBasis'];
//            $row->hash_str = $strHash . $row->fare_basis . \RoutesCache::HASH_SEPARATOR . $row->traveler_type_id;
            $row->hash_str = $strHash . $row->traveler_type_id;
            $row->hash_id = "x'" . str_pad(hash('fnv164', $row->hash_str), 16, '0', STR_PAD_LEFT) . "'::int8";
            $row->last_check = date(DATETIME_FORMAT);
            $row->updated = date(DATETIME_FORMAT);
            $row->air_source_id = $airSourceId;
            $row->service_type_id = $serviceTypeId;
            // Taxes
            $row->total_taxes = $amount;
            $row->base_fare = $baseAmount;
            $row->total_fare = $row->base_fare + $row->total_taxes;
            $row->tax_jn = $fares[$tmpFsk]['taxes'][\Taxes::TAX_JN];
            $row->tax_other = $fares[$tmpFsk]['taxes'][\Taxes::TAX_OTHER];
            $row->tax_psf = $fares[$tmpFsk]['taxes'][\Taxes::TAX_PSF];
            $row->tax_udf = $fares[$tmpFsk]['taxes'][\Taxes::TAX_UDF];
            $row->tax_yq = $fares[$tmpFsk]['taxes'][\Taxes::TAX_YQ];
            $row->total_tax_correction = $fares[$tmpFsk]['taxes'][\Taxes::TAX_TOTAL_CORRECTION];

            $rows[] = $row->attributes;
            end($rows);
            unset($rows[key($rows)]['id']);     // Unset the id array element
        }
        return $rows;
    }

    /**
     * PNR acquisition
     * @param string $pnrStr The PNR
     * @param int $airSourceId ID of the air source from where the pnr is to be extracted
     * @return int ID of the newly created airCart object
     */
    static function aquirePnr($pnrStr, $airSourceId) {
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        $api = new PnrManagement;
        /* @var $airSource \AirSource */
        $api->connect($airSource->backend->wsdl_file, [], $airSourceId);
        $api->retrievePnr($pnrStr);
        // If string is returned , than this is a error
        if (is_string($api->pnrResponseObj)) {
            return ['message' => $api->pnrResponseObj];
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('indigo_pnr_structure.json', $api->pnrResponseObj);
        }
        $acquisition = new PnrAcquisition($api->pnrResponseObj, $airSourceId);
        return \ApiInterface::acquirePnr($acquisition);
    }

    /**
     * Check if the sector is subject to Indigo tax exception
     * @param string $origin 3 letter airport code
     * @param string $destination 3 letter airport code
     * @return bool
     */
    static function isTaxException($origin, $destination = null) {
//        return false;   // Temporary measure 
        return in_array($origin, self::$taxExceptions);
    }

    static function newItineraryPriceRequest($passengersCount, $priceTypes) {
        // Price info
        $itineraryPriceRequest = new ItineraryPriceRequest(PriceItineraryBy::JourneyBySellKey);
        $itineraryPriceRequest->SellByKeyRequest = new SellJourneyByKeyRequestData;
        $itineraryPriceRequest->SellByKeyRequest->CurrencyCode = 'INR';
        $itineraryPriceRequest->SellByKeyRequest->ActionStatusCode = 'NN';
        $itineraryPriceRequest->SellByKeyRequest->IsAllotmentMarketFare = false;
        $itineraryPriceRequest->SellByKeyRequest->PaxCount = $passengersCount;
        $itineraryPriceRequest->SellByKeyRequest->PaxPriceType = $priceTypes;
        $itineraryPriceRequest->SellByKeyRequest->LoyaltyFilter = LoyaltyFilter::MonetaryOnly;
        return $itineraryPriceRequest;
    }

    /**
     * Combine and receive price infor for tax exception airports
     * @param array $j1
     * @param array $j2
     * @param int $infants
     */
    static function taxExceptionPriceInfo($j1, $j2, $infants, $passengersCount, $priceTypes, $bookingApi) {
        $jorney1 = reset($j1);
        $jorney2 = reset($j2);
        $journeys = [];
        $infantFares = [];
        for ($k = 0; $k < (count($j1) < count($j2) ? count($j2) : count($j1)); $k++) {
            $itineraryPriceRequest = self::newItineraryPriceRequest($passengersCount, $priceTypes);
            unset($segment1);
            unset($segment2);

            // First segment
            if (isset($jorney1['Segments']['Segment'][0])) {
                $segment1 = $jorney1['Segments']['Segment'][0];
                $segments1=$jorney1['Segments']['Segment'];
                $fare_sell_keys_array1 = array_map(function ($ar) {
                    return $ar['Fares']['Fare']['FareSellKey'];
                }, $segments1);
                $faresellkey1=implode("^",$fare_sell_keys_array1);
            } else {
                $segment1 = $jorney1['Segments']['Segment'];
                $faresellkey1 = $segment1['Fares']['Fare']['FareSellKey'];
            }


            // Second segment
            if (isset($jorney2['Segments']['Segment'][0])) {
                $segment2 = $jorney2['Segments']['Segment'][0];
                $segments2=$jorney2['Segments']['Segment'];
                $fare_sell_keys_array2=array_map(function ($ar) {
                    return $ar['Fares']['Fare']['FareSellKey'];
                }, $segments2);
                $faresellkey2=implode("^",$fare_sell_keys_array2);
            } else {
                $segment2 = $jorney2['Segments']['Segment'];
                 $faresellkey2=$segment2['Fares']['Fare']['FareSellKey'];
            }
//            \Utils::dbgYiiLog($jorney1); 
//            \Utils::dbgYiiLog($jorney2);
//            \Yii::app()->end();

            // First Journey
            $sk = new SellKeyList();
            $sk->JourneySellKey = $jorney1['JourneySellKey'];
            $sk->FareSellKey = $faresellkey1;
            $itineraryPriceRequest->SellByKeyRequest->JourneySellKeys[] = $sk;

            // Second Journey
            $sk = new SellKeyList();
            $sk->JourneySellKey = $jorney2['JourneySellKey'];
            $sk->FareSellKey = $faresellkey2;
            $itineraryPriceRequest->SellByKeyRequest->JourneySellKeys[] = $sk;

            // If there are infants
            if (!empty($infants)) {
                // Journey1
                $sssr = new SegmentSSRRequest($segment1['STD']);
                $sssr->ArrivalStation = $segment1['ArrivalStation'];
                $sssr->DepartureStation = $segment1['DepartureStation'];
                $sssr->FlightDesignator = new FlightDesignator;
                $sssr->FlightDesignator->CarrierCode = $segment1['FlightDesignator']['CarrierCode'];
                $sssr->FlightDesignator->FlightNumber = trim($segment1['FlightDesignator']['FlightNumber']);
                for ($i = 0; $i < $infants; $i++) {
                    $paxSSR = new PaxSSR(MessageState::aNew, $i, $i);
                    $paxSSR->ActionStatusCode = 'NN';
                    $paxSSR->ArrivalStation = $sssr->ArrivalStation;
                    $paxSSR->DepartureStation = $sssr->DepartureStation;
                    $paxSSR->SSRCode = self::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                    $sssr->PaxSSRs[] = $paxSSR;
                }
                $itineraryPriceRequest->SSRRequest->SegmentSSRRequests[] = $sssr;

                // Journey2
                $sssr = new SegmentSSRRequest($segment2['STD']);
                $sssr->ArrivalStation = $segment2['ArrivalStation'];
                $sssr->DepartureStation = $segment2['DepartureStation'];
                $sssr->FlightDesignator = new FlightDesignator;
                $sssr->FlightDesignator->CarrierCode = $segment2['FlightDesignator']['CarrierCode'];
                $sssr->FlightDesignator->FlightNumber = trim($segment2['FlightDesignator']['FlightNumber']);
                for ($i = 0; $i < $infants; $i++) {
                    $paxSSR = new PaxSSR(MessageState::aNew, $i, $i);
                    $paxSSR->ActionStatusCode = 'NN';
                    $paxSSR->ArrivalStation = $sssr->ArrivalStation;
                    $paxSSR->DepartureStation = $sssr->DepartureStation;
                    $paxSSR->SSRCode = self::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                    $sssr->PaxSSRs[] = $paxSSR;
                }
                $itineraryPriceRequest->SSRRequest->SegmentSSRRequests[] = $sssr;
            }
//            echo \Utils::dbg($itineraryPriceRequest);
            $pir = new PriceItineraryRequest($itineraryPriceRequest);
            if ($bookingApi) {
                //\Utils::dbgYiiLog($pir);
                //\Yii::app()->end();
                $ipr = $bookingApi->GetItineraryPrice($pir);
//                if (is_string($ipr)) {
//                    throw new \Exception($ipr);
//                }
                $iprs[] = $ipr;
                $journeys = array_merge($journeys, $ipr->Booking->Journeys->Journey);
                if (isset($ipr->Booking->Passengers->Passenger->PassengerFees)) {
                    $passenger0 = $ipr->Booking->Passengers->Passenger;   // Single passenger
                } else {
                    $passenger0 = $ipr->Booking->Passengers->Passenger[0];   // Multiple passengers
                }
                if ((isset($passenger0->PassengerFees->PassengerFee[0]->FeeCode) &&
                        $passenger0->PassengerFees->PassengerFee[0]->FeeCode == self::$passengerTypes[\TravelerType::TRAVELER_INFANT]) ||
                        (isset($passenger0->PassengerFees->PassengerFee->FeeCode) &&
                        $passenger0->PassengerFees->PassengerFee->FeeCode == self::$passengerTypes[\TravelerType::TRAVELER_INFANT])) {

                    $infantFares = array_merge($infantFares, $passenger0->PassengerFees->PassengerFee);
                }
//                if (key($iprs) > 0) {
//                    $iprs[0]->Booking->Journeys->Journey = array_merge($iprs[0]->Booking->Journeys->Journey, $ipr->Booking->Journeys->Journey);
//                }
            }

            $jorney1 = next($j1) ? : end($j1);
            $jorney2 = next($j2) ? : end($j2);
        }
        $debugFilename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'indigo_ipr.json';
        if ($bookingApi) {
            $ipr->Booking->Journeys->Journey = $journeys;
            if (isset($ipr->Booking->Passengers->Passenger->PassengerFees)) {
                $ipr->Booking->Passengers->Passenger->PassengerFees->PassengerFee = $infantFares;
            } else {
                $ipr->Booking->Passengers->Passenger[0]->PassengerFees->PassengerFee = $infantFares;
            }
            if (YII_DEBUG) {
                \Utils::objectToFile($debugFilename, $ipr);
            }
        } else {
            $ipr = \Utils::fileToObject($debugFilename);
        }

        return $ipr;
    }
    
    static function parseGetItineryResponse($model, $journeys, $test, $bookingApi, &$itineraryPriceResponse, $passengersCount, $priceTypes, $flag = true){
        if($flag) {
             $itineraryPriceRequest = \application\components\Indigo\Utils::newItineraryPriceRequest($passengersCount, $priceTypes);
        }
        foreach ($journeys as $jorney) {
            $check_sell_key=true;
            unset($segments);
            if (isset($jorney['Segments']['Segment'][0])) {
                $segments = $jorney['Segments']['Segment'];
                //Code for multiple segment sell keys
                $fare_sell_keys_array = array_map(function ($ar) {
                    return $ar['Fares']['Fare']['FareSellKey'];
                }, $segments);
                $fare_sell_key=implode("^",$fare_sell_keys_array);
                $check_sell_key=false;
            } else {
                $segments[0] = $jorney['Segments']['Segment'];
            }


            foreach ($segments as $segment) {
                if(!$flag) {
                    $itineraryPriceRequest = \application\components\Indigo\Utils::newItineraryPriceRequest($passengersCount, $priceTypes);
                }
                if($check_sell_key != false){
                    $fare_sell_key=$segment['Fares']['Fare']['FareSellKey'];
                }
    //        echo \Utils::dbg($segment); exit;
                $sk = new \application\components\Indigo\SellKeyList();
                $sk->JourneySellKey = $jorney['JourneySellKey'];
                $sk->FareSellKey = $fare_sell_key;
                if (is_array($itineraryPriceRequest->SellByKeyRequest->JourneySellKeys) && end($itineraryPriceRequest->SellByKeyRequest->JourneySellKeys) == $sk) {
                    continue;
                }
                $itineraryPriceRequest->SellByKeyRequest->JourneySellKeys[] = $sk;
                // If there are infants
                if (!empty($model->infants)) {
                    $sssr = new \application\components\Indigo\SegmentSSRRequest($segment['STD']);
                    $sssr->ArrivalStation = $segment['ArrivalStation'];
                    $sssr->DepartureStation = $segment['DepartureStation'];
                    $sssr->FlightDesignator = new \application\components\Indigo\FlightDesignator;
                    $sssr->FlightDesignator->CarrierCode = $segment['FlightDesignator']['CarrierCode'];
                    $sssr->FlightDesignator->FlightNumber = trim($segment['FlightDesignator']['FlightNumber']);
                    for ($i = 0; $i < $model->infants; $i++) {
                        $paxSSR = new \application\components\Indigo\PaxSSR(\application\components\Indigo\MessageState::aNew, $i, $i);
                        $paxSSR->ActionStatusCode = 'NN';
                        $paxSSR->ArrivalStation = $sssr->ArrivalStation;
                        $paxSSR->DepartureStation = $sssr->DepartureStation;
                        $paxSSR->SSRCode = \application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                        $sssr->PaxSSRs[] = $paxSSR;
                    }
                    $itineraryPriceRequest->SSRRequest->SegmentSSRRequests[] = $sssr;
                }
                if(!$flag) {
                    self::inlineParseGetItineryResponse($bookingApi, $test, $itineraryPriceRequest, $itineraryPriceResponse);
                }
            }
            //echo \Utils::dbg($itineraryPriceRequest); exit;
        }
        if($flag) {
            self::inlineParseGetItineryResponse($bookingApi, $test, $itineraryPriceRequest, $itineraryPriceResponse);
        }
        
    }
    
    static function inlineParseGetItineryResponse($bookingApi, $test, $itineraryPriceRequest, &$itineraryPriceResponse){
        if (!$test) {
            $pir = new \application\components\Indigo\PriceItineraryRequest($itineraryPriceRequest);
            //\Utils::dbgYiiLog($itineraryPriceRequest); 
            $response = $bookingApi->GetItineraryPrice($pir);
            
            if(!empty($itineraryPriceResponse)) {
                if(isset($response->Booking->Journeys->Journey) && is_object($response->Booking->Journeys->Journey)) {
                    $itineraryPriceResponse->Booking->Journeys->Journey [] = $response->Booking->Journeys->Journey;
                }
                
                if(isset($response->Booking->Passengers->Passenger->PassengerFees->PassengerFee) && is_object($response->Booking->Passengers->Passenger->PassengerFees->PassengerFee)) {
                    $itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee [] = $response->Booking->Passengers->Passenger->PassengerFees->PassengerFee;
                }
            }
            
            if(empty($itineraryPriceResponse)) {
                $itineraryPriceResponse = $response;
                //\Utils::dbgYiiLog($response);
            }
            
            if(isset($itineraryPriceResponse->Booking->Journeys->Journey) && is_object($itineraryPriceResponse->Booking->Journeys->Journey)) {
                //$journey = $itineraryPriceResponse->Booking->Journeys->Journey;
                $itineraryPriceResponse->Booking->Journeys->Journey  = [$itineraryPriceResponse->Booking->Journeys->Journey];
            }
            if(isset($itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee) && is_object($itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee)) {
                //$journey = $itineraryPriceResponse->Booking->Journeys->Journey;
                $itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee  = [$itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee];
            }
//            \Utils::dbgYiiLog($response);
            //\Utils::dbgYiiLog($itineraryPriceResponse); 
            //\Yii::app()->end();
        }
    }

}
