<?php

namespace application\components\Scoot;

class Utils {

    const TRAVELER_INFANT = 'INFT';
    const TRAVELER_CHILD = 'CHD';

    static $grouping = null;

    const PRODUCTION_AIRSOURCE_ID = 52; //46
    const TEST_AIRSOURCE_ID = 51; //46

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
    static $scootTitleAdult = [
        'Mr.' => 'MR',
        'Mrs.' => 'MRS',
        'Ms.' => 'MISS',
        'Dr.' => 'MR',
        'Prof.' => 'MR'
    ];
    static $mapScootTitle = [
         'MISS' => 'Ms',
         'MR'   => 'Mr',
         'MRS'  => 'Mrs',
         'MSTR' => 'Mstr',
    ];
    static $scootTitleChild = [
        'Mstr.' => 'MSTR',
        'Inf.' => 'MSTR',
        'Ms.' => 'MISS',
    ];

    /**
     * This tax should not be taken into account
     */
    const TAX_TO_SUBSTRACT = 'CMF-defunct';
    const SCRAPPER_TAX_TO_SUBSTRACT = 'Agency Commission - defunct';

    /**
     * This tax should be adjusted with 4.95% of the TAX_TO_SUBSTRACT
     */
    const TAX_TO_ADJUST = 'GST';
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
        'GST' => \Taxes::TAX_JN,
        '25PRCT' => \Taxes::TAX_OTHER,
        'CMF' => \Taxes::TAX_OTHER,
        'ZR' => \Taxes::TAX_OTHER,
        'AE' => \Taxes::TAX_OTHER,
    ];
    static $taxesScrapperReformat = [
        'CUTE Fee' => \Taxes::TAX_YQ,
        'Fuel Charge' => \Taxes::TAX_YQ,
        'Agency Commission' => \Taxes::TAX_OTHER,
        'Agency Transaction Fee' => \Taxes::TAX_OTHER,
        'Development Fee' => \Taxes::TAX_UDF,
        'Passenger Service Fee' => \Taxes::TAX_PSF,
        'User Development fee' => \Taxes::TAX_UDF,
        'User Development Fee Departure (UDF)' => \Taxes::TAX_UDF,
        'Arrival User Development Fee' => \Taxes::TAX_UDF,
        'Airport Arrival Tax Arrival (AAT)' => \Taxes::TAX_UDF,
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

    static function reformatTaxes($param, $origin_aiport_code) {
        $tax = new \Taxes;
        foreach ($param as $key => $value) {
            $value = Utils::currencyConvertorToINR($origin_aiport_code, (float) $value);
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
     * Scoot search
     * @param int $airSourceId The AirSource ID
     * @param \stdClass $params
     * @return string JSON encoded search result
     */
    static function search($airSourceId, \stdClass $params) {
        // Departure date test
        if (strtotime($params->depart) < strtotime(date(DATE_FORMAT))) {
            return "Departure in the past";
        }
        if ($params->category != \CabinType::ECONOMY) {
            return "TZ can serve only economy class";
        }
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);

        \Yii::import('application.components.Scoot.BookingManager', true);
        $test = false;
        if (!$test) {
            $apiSesMan = new SessionManager([], $airSource->backend->wsdl_file);
            $signature = $apiSesMan->Logon($airSourceId);
            //\Utils::dbgYiiLog($signature);
            if ($signature === false) {
                \Utils::dbgYiiLog("Invalid credentials");
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
        $params->depart, $params->depart, FlightType::All, $passengersCount, DOW::Daily, AvailabilityType::aDefault, 3, AvailabilityFilter::ExcludeUnavailable, FareClassControl::LowestFareClass, null, null, SSRCollectionsMode::None, InboundOutbound::None, null, false, true, FareRuleFilter::aDefault, LoyaltyFilter::MonetaryOnly);
        $availabilityRequest->PaxPriceTypes = $priceTypes;
        $availabilityRequest->DepartureStation = $params->source;
        $availabilityRequest->ArrivalStation = $params->destination;
        $availabilityRequest->CurrencyCode = self::currencyFinderScoot($params->source);
        if ($airSource->spare3 !== null) {
            $availabilityRequest->PaxResidentCountry = 'IN';
            $availabilityRequest->PromotionCode = $airSource->spare3;
        }
        //$availabilityRequest->ProductClasses[] = 'J';
        //$availabilityRequest->FareClasses[] = 'C';
        // Which Cabin type we are interested in
        //$availabilityRequest->FareClasses[] = CabinType::$iataCabinClass[CabinType::FIRST];
        $tripAvailabilityRequest = new TripAvailabilityRequest(LoyaltyFilter::MonetaryOnly);
        $tripAvailabilityRequest->AvailabilityRequests[] = $availabilityRequest;

        // If we have return trip, then configure new AvailabilityRequest for the return trip
        if (!empty($params->return)) {
            $ar2 = new AvailabilityRequest(
                    $params->return, $params->return, FlightType::All, $passengersCount, DOW::Daily, AvailabilityType::aDefault, 3, AvailabilityFilter::ExcludeUnavailable, FareClassControl::LowestFareClass, null, null, SSRCollectionsMode::None, InboundOutbound::None, null, false, false, FareRuleFilter::aDefault, LoyaltyFilter::MonetaryOnly);
            foreach ($priceTypes as $value) {
                $priceTypes2[] = clone $value;
            }
            if ($airSource->spare3 !== null) {
                $ar2->PaxResidentCountry = 'IN';
                $ar2->PromotionCode = $airSource->spare3;
            }
            $ar2->PaxPriceTypes = $priceTypes2;
            $ar2->DepartureStation = $params->destination;
            $ar2->ArrivalStation = $params->source;
            $ar2->CurrencyCode = self::currencyFinderScoot($params->source);
            //$ar2->FareClasses[] = 'B2';
            // $ar2->ProductClasses[] = 'J';

            $tripAvailabilityRequest->AvailabilityRequests[] = $ar2;
        }
        //\Utils::dbgYiiLog($tripAvailabilityRequest);

        $debugFilename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'scoot_GetAvailability_response.json';
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
        // Small debug
//        \Utils::dbgYiiLog($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']);
        if (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey']) &&
                isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'])) {   // More then one result
            // Fix single onward Journey case
            if (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey'][0])) {
                $a1 = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey'];
            } else {
                $a1 = [$arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey']];
            }
            // Fix single return Journey case
            if (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'][0])) {
                $a2 = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'];
            } else {
                $a2 = [$arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey']];
            }
            $journeys = array_merge($a1, $a2);
        } elseif (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'])) {     // One result
            $journeys = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'];
        } else {        // No results
            return "No flights available";
        }
        // Fix single Journey case
        if (!isset($journeys[0])) {
            $journeys = [$journeys];
        }
        //\Utils::dbgYiiLog($journeys);
        // Price info

        $multiflag = false;
        foreach ($journeys as $jorney) {
            $count = 1;
            $check_sell_key = true;
            $itineraryPriceRequest = new ItineraryPriceRequest(PriceItineraryBy::JourneyBySellKey);
            $itineraryPriceRequest->SellByKeyRequest = new SellJourneyByKeyRequestData;
            //($passengersCount, LoyaltyFilter::MonetaryOnly);
            $itineraryPriceRequest->SellByKeyRequest->CurrencyCode = self::currencyFinderScoot($params->source);
            $itineraryPriceRequest->SellByKeyRequest->ActionStatusCode = 'NN';
            $itineraryPriceRequest->SellByKeyRequest->IsAllotmentMarketFare = false;
            $itineraryPriceRequest->SellByKeyRequest->PaxCount = $passengersCount;
            $itineraryPriceRequest->SellByKeyRequest->PaxPriceType = $priceTypes;
            $itineraryPriceRequest->SellByKeyRequest->LoyaltyFilter = LoyaltyFilter::MonetaryOnly;
            // Scoot buggy API correction
//            if (isset($jorney['Segments']['Segment'][0]['Fares']['Fare'])) {
//                continue;
//            }
            unset($segments);

            if (isset($jorney['Segments']['Segment'][0])) {
                $segments = $jorney['Segments']['Segment'];

                $fare_sell_keys_array = array_map(function ($ar) {
                    return $ar['Fares']['Fare']['FareSellKey'];
                }, $segments);
                $fare_sell_key = implode("^", $fare_sell_keys_array);
                $check_sell_key = false;
            } else {
                $segments[0] = $jorney['Segments']['Segment'];
            }
            foreach ($segments as $segment) {
                if ($count == 2) {
                    break;
                }
                if ($check_sell_key != false) {
                    $fare_sell_key = $segment['Fares']['Fare']['FareSellKey'];
                }
                $sk = new SellKeyList();
                $sk->JourneySellKey = $jorney['JourneySellKey'];
                $sk->FareSellKey = $fare_sell_key;
                $itineraryPriceRequest->SellByKeyRequest->JourneySellKeys[] = $sk;
                //$ts=new TypeOfSale;
                //$ts->PaxResidentCountry='IN';
                //$ts->PromotionCode='CHEAPTIC';
                //$itineraryPriceRequest->TypeOfSale=$ts;
                // If there are infants
                if (!empty($params->infants)) {
                    $sssr = new SegmentSSRRequest($segment['STD']);
                    $sssr->ArrivalStation = $segment['ArrivalStation'];
                    $sssr->DepartureStation = $segment['DepartureStation'];
                    $sssr->FlightDesignator = new FlightDesignator;
                    $sssr->FlightDesignator->CarrierCode = $segment['FlightDesignator']['CarrierCode'];
                    $sssr->FlightDesignator->FlightNumber = trim($segment['FlightDesignator']['FlightNumber']);
                    for ($i = 0; $i < $params->infants; $i++) {
                        $paxSSR = new PaxSSR(MessageState::aNew, $i, $i);
                        $paxSSR->ActionStatusCode = 'NN';
                        $paxSSR->ArrivalStation = $sssr->ArrivalStation;
                        $paxSSR->DepartureStation = $sssr->DepartureStation;
                        $paxSSR->SSRCode = self::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                        $sssr->PaxSSRs[] = $paxSSR;
                    }
                    $itineraryPriceRequest->SSRRequest->SegmentSSRRequests[] = $sssr;
                }
                $count++;
            }
            $pir = new PriceItineraryRequest($itineraryPriceRequest);
            $response = $bookingApi->GetItineraryPrice($pir);

            if (!empty($itineraryPriceResponse)) {

                if (isset($response->Booking->Journeys->Journey) && is_object($response->Booking->Journeys->Journey)) {
                    // $itineraryPriceResponse->Booking->Journeys->Journey [] = $response->Booking->Journeys->Journey;
                    array_push($itineraryPriceResponse->Booking->Journeys->Journey, $response->Booking->Journeys->Journey);
                }

                if (isset($response->Booking->Passengers->Passenger->PassengerFees->PassengerFee) && is_object($response->Booking->Passengers->Passenger->PassengerFees->PassengerFee)) {
                    $itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee [] = $response->Booking->Passengers->Passenger->PassengerFees->PassengerFee;
                }
            }

            if (empty($itineraryPriceResponse)) {

                $itineraryPriceResponse = $response;
                //\Utils::dbgYiiLog($response);
            }

            if (isset($itineraryPriceResponse->Booking->Journeys->Journey) && is_object($itineraryPriceResponse->Booking->Journeys->Journey)) {

                //$journey = $itineraryPriceResponse->Booking->Journeys->Journey;
                $itineraryPriceResponse->Booking->Journeys->Journey = [$itineraryPriceResponse->Booking->Journeys->Journey];
            }

            if (isset($itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee) && is_object($itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee)) {
                //$journey = $itineraryPriceResponse->Booking->Journeys->Journey;
                $itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee = [$itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees->PassengerFee];
            }
        }

        $debugFilename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'scoot_GetItineraryPrice_response.json';
        if (!$test) {
            //\Utils::dbgYiiLog($itineraryPriceRequest);
            //   $pir = new PriceItineraryRequest($itineraryPriceRequest);
            //  $itineraryPriceResponse = $bookingApi->GetItineraryPrice($pir);
            if (YII_DEBUG) {
                file_put_contents($debugFilename, json_encode($itineraryPriceResponse));
            }
        } else {
            $itineraryPriceResponse = json_decode(file_get_contents($debugFilename));
        }
       // \Utils::dbgYiiLog($itineraryPriceResponse);
        //\Yii::app()->end();
        //
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
        if (isset($passenger0->PassengerFees->PassengerFee) && !is_array($passenger0->PassengerFees->PassengerFee)) {
            $tmp = $passenger0->PassengerFees->PassengerFee;
            unset($passenger0->PassengerFees->PassengerFee);
            $passenger0->PassengerFees->PassengerFee[0] = $tmp;
        }
        if ((isset($passenger0->PassengerFees->PassengerFee[0]->FeeCode) &&
                $passenger0->PassengerFees->PassengerFee[0]->FeeCode == self::$passengerTypes[\TravelerType::TRAVELER_INFANT])) {
            foreach (\Utils::toArray($passenger0->PassengerFees->PassengerFee) as $paxFee) {
                $infants[$paxFee->FlightReference] = $paxFee->ServiceCharges; //->BookingServiceCharge;
            }

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

            // Add Infants to passengers in the journeys array
            foreach ($journeys as $jKey => $journey) {
                // Scoot int Connecting flights
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
            $seg_count = 0;
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
                    if ($seg_count > 0) {
                        $fareKey .= 'segment2';
                    }

                    if ($fare->PaxType == self::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                        $fareKey .= "~" . self::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                    } else if ($fare->PaxType == self::$passengerTypes[\TravelerType::TRAVELER_CHILD]) {
                        $fareKey .= "~" . self::$passengerTypes[\TravelerType::TRAVELER_CHILD];
                    }

                    $fares[$fareKey]['fareBasis'] = $segment->Fares->Fare->FareBasisCode;
                    $fares[$fareKey]['bookingClass'] = $segment->Fares->Fare->FareClassOfService;
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
                        if(isset($charge->CurrencyCode)){
                           $fares[$fareKey]['currencyCode'] = $charge->CurrencyCode; 
                        }  
                    }
                    $fares[$fareKey]['taxes'] = $taxes;
                }
                $seg_count++;
            }
            //\Utils::dbgYiiLog($fares);
        }
        //\Utils::dbgYiiLog($fares);
        //\Yii::app()->end();

        $serviceTypeId = \Airport::getServiceTypeIdFromCode($params->source, $params->destination);
        $rows = [];
        $resultCount = 0;
        self::$grouping = \RoutesCache::getNextGroupId();
        foreach ($journeys as $jorney) {
            // Scoot international via
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
            if (isset($secondSegment)) {
                $fsk2 = $secondSegment['Fares']['Fare']['FareSellKey'] . '~' . $departureStation . $arrivingStation . 'segment2';
            } else {
                $fsk2 = '';
            }
            if (!isset($fares[$fsk])) {
                continue;
            }
            //\Utils::dbgYiiLog($fares[$fsk]);
            $rows = array_merge($rows, self::prepareCacheRow($legs, $passengers, $fares, $airSourceId, $serviceTypeId, $fsk, $fsk2, $params));
            //\Utils::dbgYiiLog($rows);
            $resultCount++;
            if ($resultCount > 99) {
                break;  // Do not consider more than 100 results.
            }
//            echo \Utils::dbg($legs);
        }
//        echo \Utils::dbg($fares);
       //  \Utils::dbgYiiLog($rows);
        return json_encode($rows);
    }

    static function prepareLegsJson($legs, $bookingClass) {
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
            $out[] = $legsJson;
        }
//        if(isset($out[0])&& !is_array(($out[0]))){
//            $out=[$out];
//        }
        return $out;
    }

    static function prepareHashStr($airSourceId, $legs, $cabinTypeId) {
        $out = $airSourceId . \RoutesCache::HASH_SEPARATOR . $cabinTypeId . \RoutesCache::HASH_SEPARATOR;
        foreach ($legs as $leg) {
            $out .= $leg['DepartureStation'] . \RoutesCache::HASH_SEPARATOR;
            $out .= self::shortenDateAndTime($leg['STD']) . \RoutesCache::HASH_SEPARATOR;
            $out .= $leg['FlightDesignator']['CarrierCode'] . '-' . trim($leg['FlightDesignator']['FlightNumber']) . \RoutesCache::HASH_SEPARATOR;
            $out .= $leg['ArrivalStation'] . \RoutesCache::HASH_SEPARATOR;
        }
        return $out;
    }

    static function prepareCacheRow($legs, $passagers, $fares, $airSourceId, $serviceTypeId, $fsk, $fsk2, $params) {
        $processedPaxTypes = [];
        $rows = [];
        // strHash format: <Origin>~<departTs>~<FlightNumber>~<Destination1>~<departTs>~<FlightNumber>~<Destination2>~...
        $strHash = self::prepareHashStr($airSourceId, $legs, $params->category);
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
        $tmpRow->legsJson = json_encode(self::prepareLegsJson($legs, $fares[$fsk]['bookingClass']));
        foreach ($passagers as $passager) {
            if (in_array($passager['PaxType'], $processedPaxTypes)) {
                continue;
            }
            $processedPaxTypes[] = $passager['PaxType'];
            $tmpFsk = $fsk;
            if ($passager['PaxType'] === self::TRAVELER_INFANT) {
                $tmpFsk .= "~" . self::TRAVELER_INFANT;
            } else if ($passager['PaxType'] === self::TRAVELER_CHILD) {
                $fsk2 .= "~" . self::TRAVELER_CHILD;
            }
            if ($fsk2 != '' && isset($fares[$fsk2]['amount'])) {
                $amount = $fares[$tmpFsk]['amount'] + $fares[$fsk2]['amount'];
                $baseAmount = $fares[$tmpFsk]['baseAmount'] + $fares[$fsk2]['baseAmount'];
                
            } else {
                $amount = $fares[$tmpFsk]['amount'];
                $baseAmount = $fares[$tmpFsk]['baseAmount'];
            }
            
            if(isset($fares[$tmpFsk]['currencyCode'])){
            $currency_code = $fares[$tmpFsk]['currencyCode'];
            }else{
                $currency_code='USD';
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
            
            $row->total_taxes = self::currencyConvertorToINR($airportCode=null,$amount,$currency_code);
            $row->base_fare = self::currencyConvertorToINR($airportCode=null,$baseAmount,$currency_code);
            $row->total_fare = $row->base_fare + $row->total_taxes;
            $row->tax_jn = self::currencyConvertorToINR($airportCode=null,$fares[$tmpFsk]['taxes'][\Taxes::TAX_JN],$currency_code);
            $row->tax_other = self::currencyConvertorToINR($airportCode=null,$fares[$tmpFsk]['taxes'][\Taxes::TAX_OTHER],$currency_code);
            $row->tax_psf = self::currencyConvertorToINR($airportCode=null,$fares[$tmpFsk]['taxes'][\Taxes::TAX_PSF],$currency_code);
            $row->tax_udf = self::currencyConvertorToINR($airportCode=null,$fares[$tmpFsk]['taxes'][\Taxes::TAX_UDF],$currency_code);
            $row->tax_yq = self::currencyConvertorToINR($airportCode=null,$fares[$tmpFsk]['taxes'][\Taxes::TAX_YQ],$currency_code);
            $row->total_tax_correction = self::currencyConvertorToINR($airportCode=null,$fares[$tmpFsk]['taxes'][\Taxes::TAX_TOTAL_CORRECTION],$currency_code);

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
        $api = new \application\components\Scoot\PnrManagement;
        /* @var $airSource \AirSource */
        $api->connect($airSource->backend->wsdl_file, [], $airSourceId);
        $api->retrievePnr($pnrStr);
        // If string is returned , than this is a error
        if (is_string($api->pnrResponseObj)) {
            return ['message' => $api->pnrResponseObj];
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('scoot_pnr_structure.xml', $api->pnrResponseObj);
        }
        $acquisition = new \application\components\Scoot\PnrAcquisition($api->pnrResponseObj, $airSourceId);
        //\Utils::dbgYiiLog($acquisition);
        return \ApiInterface::acquirePnr($acquisition);
    }

    static function currencyFinderScoot($a_code) {
        $airport = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $a_code]);
        $currency_code = "USD";
        //\Utils::dbgYiiLog($airport);
        if ($airport) {
            if ($airport->country_code == 'IN') {
                $currency_code = "USD";
            } else if ($airport->country_code == 'AU') {//Australia
                $currency_code = "AUD";
            } else if ($airport->country_code == 'SG') {//Singapore
                $currency_code = "SGD";
            } else if ($airport->country_code == 'TH') {//Thailand
                $currency_code = "THB";
            } else if ($airport->country_code == 'HK') {//Hongkong
                $currency_code = "HKD";
            } else if ($airport->country_code == 'TW') {//Taiwan
                $currency_code = "TWD";
            } else if ($airport->country_code == 'JP') {//Jaipan
                $currency_code = "JPY";
            } else if ($airport->country_code == 'KR') {//Korea
                $currency_code = "KRW";
            } else if ($airport->country_code == 'SA') {//Saudi
                $currency_code = "USD";
            } else if ($airport->country_code == 'CN') {//China
                $currency_code = "CNY";
            }
        }

        return $currency_code;
    }

    static function currencyConvertorToINR($aiport_code, $amount,$currency_code=null) {
        if ($currency_code === null) {
            $currency_code = self::currencyFinderScoot($aiport_code);
        }
        $currency_to = \Currency::model()->cache(3600)->findByAttributes(['code' => "INR"]);
        $currency_from = \Currency::model()->cache(3600)->findByAttributes(['code' => $currency_code]);
        return $currency_from->xChangeWithoutCommision((float) $amount, $currency_to->id);
    }
    
    

    static function currencyConvertorFromINR($aiport_code, $amount) {
        $currency_code = self::currencyFinderScoot($aiport_code);
        $currency_from = \Currency::model()->cache(3600)->findByAttributes(['code' => "INR"]);
        $currency_to = \Currency::model()->cache(3600)->findByAttributes(['code' => $currency_code]);
        return $currency_from->xChangeWithoutCommision((float) $amount, $currency_to->id);
    }

    static function createScootTitle($titleStr, $passengerType) {
        if ($passengerType == 2 || $passengerType == 3) {
            if (isset(self::$scootTitleChild[$titleStr])) {
                return self::$scootTitleChild[$titleStr];
            } else {
                return "MSTR";
            }
        } else {
            if (isset(self::$scootTitleAdult[$titleStr])) {
                return self::$scootTitleAdult[$titleStr];
            } else {
                return "MR";
            }
        }
    }

    static function setWeightCategory($titleStr, $passengerType) {
        if ($passengerType == 2) {
            return "Child";
        } else if ($passengerType == 1 && ($titleStr == 'Mrs.' || $titleStr == 'Ms.')) {
            return "Female";
        } else {
            return "Male";
        }
    }

}
