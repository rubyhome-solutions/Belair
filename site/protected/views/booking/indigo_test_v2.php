<h3>Indigo test results v2</h3>
<?php
/* @var $model \BookingSearchForm */
set_time_limit(90);     // This crappy APi need much more attention
$start_timer = microtime(true);
$start_marker = microtime(true);

function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . round(microtime(true) - $start_timer, 2) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    Yii::app()->end();
}

//$test = true;
$test = false;
// Pure testing
if (YII_DEBUG && $test) {
    $model->adults = 1;
    $model->children = 0;
    $model->infants = 0;
//    $model->return = '2015-10-30';
//    $model->source = \Airport::AIRPORT_DELHI;
//    $model->destination = \Airport::AIRPORT_BANKOK;
}

$origin = \Airport::model()->findByPk($model->source);
$destination = \Airport::model()->findByPk($model->destination);

Yii::import('application.components.Indigo.BookingManager', true);
$airSourceId = application\components\Indigo\Utils::TEST_AIRSOURCE_ID;
if (!$test) {
    $apiSesMan = new \application\components\Indigo\SessionManager([], 'test');
    $signature = $apiSesMan->Logon($airSourceId);
    if ($signature === false) {   // Error
        Utils::finalMessage('Error with Indigo. Please check the logs for details!');
    }
    $bookingApi = new \application\components\Indigo\BookingManager($signature, [], 'test');
    $start_marker = microtime(true);
} else {
    $model->adults = 1;
    $model->children = 0;
    $model->infants = 0;
//    $model->depart = '2015-10-30';
//    $origin->airport_code = 'DEL';
//    $destination->airport_code = 'BKK';
//    $model->return = '2014-12-26';
}

$activeCompanyId = Utils::getActiveCompanyId();
$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
    'id' => 'booking-form',
    'enableAjaxValidation' => false,
    'layout' => TbHtml::FORM_LAYOUT_INLINE,
    'enableClientValidation' => true,
        ]);
echo TbHtml::hiddenField('airSourceId', $airSourceId);
echo TbHtml::hiddenField('fop', 1);
echo TbHtml::hiddenField('Cc', 1);
if ($activeCompanyId) {
    // Prepare the travelers structure
    for ($i = 0; $i < $model->adults; $i++) {
        $traveler = new Traveler;
        $traveler->user_info_id = $activeCompanyId;
        $traveler->traveler_type_id = TravelerType::TRAVELER_ADULT;
        $travelers[] = $traveler;
    }
    for ($i = 0; $i < $model->children; $i++) {
        $traveler = new Traveler;
        $traveler->user_info_id = $activeCompanyId;
        $traveler->traveler_type_id = TravelerType::TRAVELER_CHILD;
        $travelers[] = $traveler;
    }
    for ($i = 0; $i < $model->infants; $i++) {
        $traveler = new Traveler;
        $traveler->user_info_id = $activeCompanyId;
        $traveler->traveler_type_id = TravelerType::TRAVELER_INFANT;
        $travelers[] = $traveler;
    }
    $this->renderPartial('/airCart/_form_travelers', ['travelers' => $travelers]);
    echo "<p><b>NOTE: </b>Travelers validation is not done yet - mind your inputs!</p>";
}

for ($i = 0; $i < $model->adults; $i++) {
    $priceTypes[] = new \application\components\Indigo\PaxPriceType("ADT");
}
for ($i = 0; $i < $model->children; $i++) {
    $priceTypes[] = new \application\components\Indigo\PaxPriceType("CHD");
}

$passengersCount = $model->adults + $model->children;
$availabilityRequest = new \application\components\Indigo\AvailabilityRequest(
        $model->depart, $model->depart, \application\components\Indigo\FlightType::All, $passengersCount, \application\components\Indigo\DOW::Daily, \application\components\Indigo\AvailabilityType::aDefault, 3, \application\components\Indigo\AvailabilityFilter::ExcludeUnavailable, \application\components\Indigo\FareClassControl::LowestFareClass, null, null, \application\components\Indigo\SSRCollectionsMode::None, \application\components\Indigo\InboundOutbound::None, null, false, false, \application\components\Indigo\FareRuleFilter::aDefault, \application\components\Indigo\LoyaltyFilter::MonetaryOnly);
$availabilityRequest->PaxPriceTypes = $priceTypes;
$availabilityRequest->DepartureStation = $origin->airport_code;
$availabilityRequest->ArrivalStation = $destination->airport_code;
$availabilityRequest->CurrencyCode = "INR";
//if (!empty($model->return)) {
//    $availabilityRequest->ProductClassCode = "XA";
//}
//$availabilityRequest->FareClasses[] = application\components\Indigo\Utils::$cabinClass[$model->category];
// Which Cabin type we are interested in
//$availabilityRequest->FareClasses[] = CabinType::$iataCabinClass[CabinType::FIRST];
// If we have return trip, then configure new AvailabilityRequest for the return trip

$tripAvailabilityRequest = new \application\components\Indigo\TripAvailabilityRequest(\application\components\Indigo\LoyaltyFilter::MonetaryOnly);
$tripAvailabilityRequest->AvailabilityRequests[] = $availabilityRequest;

// Check for return trip
if (!empty($model->return)) {
    $ar2 = new \application\components\Indigo\AvailabilityRequest(
            $model->return, $model->return, \application\components\Indigo\FlightType::All, $passengersCount, \application\components\Indigo\DOW::Daily, \application\components\Indigo\AvailabilityType::aDefault, 3, \application\components\Indigo\AvailabilityFilter::ExcludeUnavailable, \application\components\Indigo\FareClassControl::LowestFareClass, null, null, \application\components\Indigo\SSRCollectionsMode::None, \application\components\Indigo\InboundOutbound::None, null, false, false, \application\components\Indigo\FareRuleFilter::aDefault, \application\components\Indigo\LoyaltyFilter::MonetaryOnly);
    foreach ($priceTypes as $value) {
        $priceTypes2[] = clone $value;
    }
//    $ar2->ProductClassCode = "XA";
    $ar2->PaxPriceTypes = $priceTypes2;
    $ar2->DepartureStation = $destination->airport_code;
    $ar2->ArrivalStation = $origin->airport_code;
    $ar2->CurrencyCode = "INR";
//    $ar2->FareClasses[] = application\components\Indigo\Utils::$cabinClass[$model->category];

    $tripAvailabilityRequest->AvailabilityRequests[] = $ar2;
}
$debugFilename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'indigo_GetAvailability_response_v2.json';
if (!$test) {
    $request = new \application\components\Indigo\GetAvailabilityRequest($tripAvailabilityRequest);
    $response = $bookingApi->GetAvailability($request);
//    \Utils::SoapLogDebug($bookingApi);
    if (YII_DEBUG) {
        file_put_contents($debugFilename, json_encode($response));
    }
} else {
    $response = json_decode(file_get_contents($debugFilename));
}
//\Utils::dbgYiiLog("indigo_GetAvailability_response marker " . round(microtime(true) - $start_marker, 2) . " sec.");
//$start_marker = microtime(true);
////echo Utils::dbg($response);
//Utils::soapDebug($bookingApi); exit;

$arr = json_decode(json_encode($response), true);
//file_put_contents('indigo_GetAvailability_array.txt', print_r($arr, true));
//echo Utils::dbg($arr);

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
    $taxException = \application\components\Indigo\Utils::isTaxException($destination->airport_code);
} elseif (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'])) {     // One result
    $journeys = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'];
    $taxException = false;
} else {        // No results
    echo "<h3>No flights available</h3>";
    Yii::app()->end();
}
// Single journey case
if (!isset($journeys[0])) {
    $journeys = [$journeys];
}

//echo Utils::dbg($journeys);   exit;
// Price info
// Prepare series of PriceItineraryRequest
if ($taxException) {
//    \Utils::dbgYiiLog('taxd');
//    Yii::app()->end();
    $itineraryPriceResponse = \application\components\Indigo\Utils::taxExceptionPriceInfo($a1, $a2, $model->infants, $passengersCount, $priceTypes, $test ? false : $bookingApi);
    if (!$test) {
        $apiSesMan->Logout();
    }
//    exit;
    
} else {
    $itineraryPriceResponse = [];
    $i = 0;
    $segments_flights = [];
    $repeated_journey = [];
    $repeated_segment_journey = [];
    $filtered_journey = [];
//    \Utils::dbgYiiLog($journeys);
//    \Yii::app()->end();
    foreach ($journeys as $key=>$jorney) {
        if (isset($jorney['Segments']['Segment'][0])) {
            $segments = $jorney['Segments']['Segment'];
            $repeated_segment_journey[] = $jorney;
        } else {
          $segments[0] = $jorney['Segments']['Segment'];
          $filtered_journey [] = $jorney; 
        }
        /*
        foreach ($segments as $segment) {
            $cc = $segment['FlightDesignator']['CarrierCode'];
            $fn = $segment['FlightDesignator']['FlightNumber'];
            if(isset($segments_flights[$cc.$fn]) && $segments_flights[$cc.$fn]->journey == $key){
                $jorney['segments_flights_repeated'] = true;
            } else if(isset($segments_flights[$cc.$fn]) && $segments_flights[$cc.$fn]->journey != $key){
                \Utils::dbgYiiLog($jorney);
                $jorney['journey_flights_repeated'] = true;
            }
            $obj = new stdClass();
            $obj->journey = $key;
            $obj->flight = $cc.$fn;
            $segments_flights[$cc.$fn] = $obj;
        }
        
        if(!isset($jorney->segments_flights_repeated) && !isset($jorney->journey_flights_repeated)) {
            $filtered_journey [] = $jorney; 
        } else if(isset($jorney->segments_flights_repeated) && $jorney->segments_flights_repeated === true){
            $repeated_segment_journey[] = $jorney;
        } else if(isset($jorney->journey_flights_repeated) && $jorney->journey_flights_repeated === true){
            $repeated_journey [] = $jorney; 
        }
        */
    }
    
//    \Utils::dbgYiiLog($filtered_journey);
//    \Utils::dbgYiiLog('----re[eated----');
//    \Utils::dbgYiiLog($repeated_segment_journey);
//    \Yii::app()->end();
    if(count($filtered_journey) > 0){
        \application\components\Indigo\Utils::parseGetItineryResponse($model, $filtered_journey, $test, $bookingApi, $itineraryPriceResponse, $passengersCount, $priceTypes);
    }
    
    if(count($repeated_segment_journey) > 0){
        \application\components\Indigo\Utils::parseGetItineryResponse($model, $repeated_segment_journey, $test, $bookingApi, $itineraryPriceResponse, $passengersCount, $priceTypes, false);
    }
    //\Utils::dbgYiiLog($itineraryPriceResponse);
    //\Yii::app()->end();
    $debugFilename = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'indigo_GetItineraryPrice_response_v2.json';
    if (!$test) {
        $apiSesMan->Logout();
        if (YII_DEBUG) {
            \Utils::objectToFile($debugFilename, $itineraryPriceResponse);
        }
    } else {
            $itineraryPriceResponse = Utils::fileToObject($debugFilename);
    }
}
if (is_string($itineraryPriceResponse)) {
    throw new \CHttpException(500, $itineraryPriceResponse . " - Check the logs for details");
}
//\Utils::dbgYiiLog("indigo_GetItineraryPrice_response marker " . round(microtime(true) - $start_marker, 2) . " sec.");
//$start_marker = microtime(true);
//\Utils::dbgYiiLog("LOGOUT marker " . round(microtime(true) - $start_marker, 2) . " sec.");
//$start_marker = microtime(true);
//echo \Utils::dbg($itineraryPriceResponse);
// Make as array even single journey
if (!is_array($itineraryPriceResponse->Booking->Journeys->Journey)) {
    $itineraryPriceResponse->Booking->Journeys->Journey = [$itineraryPriceResponse->Booking->Journeys->Journey];
}

//echo Utils::dbg($itineraryPriceResponse->Booking->Journeys->Journey);
// Attach infants to the Itinerary response as passengers PaxFare objects
if (isset($itineraryPriceResponse->Booking->Passengers->Passenger->PassengerFees)) {
    $passenger0 = $itineraryPriceResponse->Booking->Passengers->Passenger;   // Single passenger
} else {
    $passenger0 = $itineraryPriceResponse->Booking->Passengers->Passenger[0];   // Multiple passengers
}
if ((isset($passenger0->PassengerFees->PassengerFee->FeeCode) &&
        $passenger0->PassengerFees->PassengerFee->FeeCode == \application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT]) ||
        (isset($passenger0->PassengerFees->PassengerFee[0]->FeeCode) &&
        $passenger0->PassengerFees->PassengerFee[0]->FeeCode == \application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT])) {
    foreach (\Utils::toArray($passenger0->PassengerFees->PassengerFee) as $paxFee) {
        $infants[$paxFee->FlightReference] = $paxFee->ServiceCharges; //->BookingServiceCharge;
    }
//    echo \Utils::dbg($infants);
//    file_put_contents('infants.txt', print_r($infants, true));
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
                $firstSegment->DepartureStation . $arrivalStation;
        if (!empty($infants[$key])) {
//            echo \Utils::dbg($key);
            for ($i = 0; $i < $model->infants; $i++) {
                $newPF = new \application\components\Indigo\PaxFare(\application\components\Indigo\MessageState::aNew);
                $newPF->PaxType = application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
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
//                echo \Utils::dbg($newPF);
            }
//            echo \Utils::dbg($itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment->Fares->Fare->PaxFares->PaxFare);
        }
    }
//    echo Utils::dbg($journeys);
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
            for ($i = 0; $i < $model->infants; $i++) {
                $newPF = new \application\components\Indigo\PaxFare(\application\components\Indigo\MessageState::aNew);
                $newPF->PaxType = application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
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

//echo Utils::dbg(['journeys' => $journeys]);
//file_put_contents('indigo_journeys.txt', print_r($journeys, true));
//file_put_contents('indigo_itineraryPriceResponse.txt', print_r($itineraryPriceResponse, true));
// Prepare the fares details
foreach (Utils::toArray($itineraryPriceResponse->Booking->Journeys->Journey) as $journey) {
    $check_segment=false;
    $seg_count=0;
    unset($segments);
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
            $repeat = false;
            $fareKey = $segment->Fares->Fare->FareSellKey . '~' . reset($segments)->DepartureStation . end($segments)->ArrivalStation;
           
            if($seg_count >0){
               $fareKey .='segment2'; 
            }
            
            if ($fare->PaxType == application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                // Add infant sufix
                $fareKey .= "~" . application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
            }
           
            // Do not replace any of the existing fares
//            if (isset($fares[$fareKey])) {
//                continue;
//            }
//        echo Utils::dbg($fare);
//        file_put_contents('fare.txt', print_r($fare, true));
//        $fares[$segmentKey . $fare->PaxType] = $fare->PaxType . "<br>";
            $fares[$fareKey]['text'] = '';
            $fares[$fareKey]['amount'] = 0;
            $taxAdjust = 0;
            $taxes = [
                Taxes::TAX_YQ => 0,
                Taxes::TAX_UDF => 0,
                Taxes::TAX_PSF => 0,
                Taxes::TAX_JN => 0,
                Taxes::TAX_OTHER => 0,
                Taxes::TAX_TOTAL_CORRECTION => 0,
            ];
           
            foreach (\Utils::toArray($fare->ServiceCharges->BookingServiceCharge) as $charge) {
                
                if (!empty($charge->ChargeCode) &&
                        $charge->ChargeCode != application\components\Indigo\Utils::$passengerTypes[TravelerType::TRAVELER_INFANT]) {
                    // Drop out certain tax, that is not applicable, but is still sent
                    if ($charge->ChargeCode === \application\components\Indigo\Utils::TAX_TO_SUBSTRACT) {
                        $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . (float) $charge->Amount . "<br>";
                        $taxAdjust = (int) $charge->Amount;
                        $taxes[Taxes::TAX_TOTAL_CORRECTION] = $taxAdjust;
                       // echo Utils::dbg($taxes);
                    } else {
                        if ($taxAdjust <> 0 && $charge->ChargeCode === \application\components\Indigo\Utils::TAX_TO_ADJUST) {
                            $deduct = round($taxAdjust * \application\components\Indigo\Utils::MULTIPLIER_FOR_ADJUSTING);
                            $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . ((int) ($charge->Amount) - $deduct) . "<br>";
                            $fares[$fareKey]['amount'] += ((int) ($charge->Amount) - $deduct);
                            $taxes[\application\components\Indigo\Utils::$taxesReformat[$charge->ChargeCode]] += ((int) ($charge->Amount) - $deduct);
                            $taxes[Taxes::TAX_TOTAL_CORRECTION] += $deduct;
                            //echo Utils::dbg($taxes);
                        } else {
                            $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . (float) $charge->Amount . "<br>";
                            $fares[$fareKey]['amount'] += (float) $charge->Amount;
                            $taxes[isset(\application\components\Indigo\Utils::$taxesReformat[$charge->ChargeCode]) ? \application\components\Indigo\Utils::$taxesReformat[$charge->ChargeCode] : \Taxes::TAX_OTHER] += (int) ($charge->Amount);
                            // Infant baseAmount correction
                            if ($fare->PaxType == application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                                $fares[$fareKey]['baseAmount'] -= (float) $charge->Amount;
                            }
                        }
                    }
                } else {
                    $fares[$fareKey]['baseAmount'] = (float) $charge->Amount;
                }
            }
            $fares[$fareKey]['taxes'] = $taxes;
        }
        $seg_count++;
    }
}

//echo Utils::dbg(['fares' => $fares]);  //exit;
//footer($start_timer);
?>





<table class="table table-condensed table-bordered table-hover">
    <tr>
        <th>#</th>
        <th>Stops</th>
        <th>Departure</th>
        <th>Origin</th>
        <th>Arrival</th>
        <th>Destination</th>
        <th>Flight</th>
        <th>Time</th>
        <th>Passenger</th>
        <th>F.Basis</th>
        <th>Fare</th>
        <th>Base fare</th>
        <th>Taxes</th>
    </tr>
    <?php
    $i = 0;
    foreach ($journeys as $jorney) {
        // Indigo international via
        if (isset($jorney['Segments']['Segment'][0])) {
            $firstSegment = $jorney['Segments']['Segment'][0];
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
            $travelerCount = count($passengers);
        } else {
            unset($passengers);
            $passengers[0] = $firstSegment['Fares']['Fare']['PaxFares']['PaxFare'];
            $travelerCount = 1;
        }
        unset($legs);
        if (isset($firstSegment['Legs']['Leg'][0])) {
            $legs = $firstSegment['Legs']['Leg'];  // Multiple legs
            $legsCount = count($legs);  // Multiple legs
        } else {
            $legsCount = 1;
            $legs[0] = $firstSegment['Legs']['Leg'];   // Single leg
        }
//        echo \Utils::dbg($legs); exit;
        $i++;
        $bookData = json_encode(getBookData($jorney, $passengers, $fares, $model->category), JSON_NUMERIC_CHECK);
        ?>
        <tr>
            <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php
                echo $i;
                if ($activeCompanyId) {
                    echo "<br>";
                    if (empty($model->return) || $origin->airport_code != $legs[0]['DepartureStation']) {
                        echo TbHtml::button('Book', [
                            'submit' => '/booking/book',
                            'class' => 'btn-warning',
                            "target" => "_blank",
                            'style' => 'margin-bottom: 10px;',
                            'params' => ['data' => $bookData]
                        ]) . '<br>';
                        echo TbHtml::ajaxButton('Check', '/booking/priceAndAvailabilityCheck', [
                            'type' => 'POST',
                            'data' => [
                                'data' => $bookData,
                                'airSourceId' => $airSourceId,
                                'Traveler' => 'js:function(){return $(\'[name^="Traveler["]\').serialize();}',
                                'onward' => 'js:function(){return $(\'input[type="radio"]:checked\').val();}'
                            ],
                            'success' => 'js:function(data){
                                        var alert = \'<div class="alert" style="max-width:600px"><button type="button" class="close" data-dismiss="alert">&times;</button>\';
                                        $("#content").prepend(alert + data + "</div>");
                                    }'
                                ], [
                            'class' => 'btn-warning',
                        ]);
                    } else {
                        echo TbHtml::radioButton('onward', ($i === 1), [
                            'id' => "onward_$i",
                            'label' => 'Onward',
                            'value' => $bookData,
                        ]);
                    }
                }
                ?>
            </td>
            <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo ($legsCount - 1); ?></td>
            <?php
            $firstLeg = true;
            foreach ($legs as $leg) {
                ?>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo Utils::cutSeconds($leg['STD']); ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['DepartureStation']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo Utils::cutSeconds($leg['STA']); ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['ArrivalStation']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['FlightDesignator']['CarrierCode'] . '-' . trim($leg['FlightDesignator']['FlightNumber']); ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo Utils::convertSecToHoursMins(strtotime($leg['STA']) - strtotime($leg['STD'])); ?></td>
                <?php
                $first = true;
                foreach ($passengers as $passenger) {
                    $fsk = $firstSegment['Fares']['Fare']['FareSellKey'] . '~' . $departureStation . $arrivingStation;
                    if ($passenger['PaxType'] === application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                        $fsk .= "~" . application\components\Indigo\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                    }
                    if (!$first) {
                        echo "<tr>";
                    }
                    $first = false;
                    if ($firstLeg) {
                        ?>
                        <td><?php echo $passenger['PaxType']; ?></td>
                        <td><?php echo $firstSegment['Fares']['Fare']['FareBasisCode']; ?></td>
                        <td><?php echo ($fares[$fsk]['baseAmount'] + $fares[$fsk]['amount']); ?></td>
                        <td><?php echo $fares[$fsk]['baseAmount']; ?></td>
                        <td><?php
                            echo $fares[$fsk]['text'] . "<hr>";
                            foreach ($fares[$fsk]['taxes'] as $taxKey => $taxValue) {
                                if ($taxKey !== Taxes::TAX_TOTAL_CORRECTION && $taxValue > 0) {
                                    echo "$taxKey: $taxValue<br>";
                                }
                            }
                            echo "Total: " . $fares[$fsk]['amount'];
                            ?></td>
                        <?php
                    } else {
                        echo "<td colspan='5'></td>";
                    }
                    ?>
                </tr>
                <?php
            }
            $firstLeg = false;
        }
        echo "<tr><td colspan='13'></td></tr>";
    }
    ?>
</table>
<?php
$this->endWidget();
footer($start_timer);

function getBookData($segments, $passagers, $fares, $cabinTypeId) {

//    echo Utils::dbg($segments);
//    echo Utils::dbg($fares);
//    echo Utils::dbg($passagers);
//    exit;
    $out = [];
    if (!isset($segments['Segments']['Segment'][0])) {
        $firstSegment = $segments['Segments']['Segment'];
        $arrivalStation = $firstSegment['ArrivalStation'];
    } else {
        $firstSegment = $segments['Segments']['Segment'][0];
        $arrivalStation = $segments['Segments']['Segment'][1]['ArrivalStation'];
        unset($leg1);
        unset($leg2);
        if (isset($firstSegment['Legs']['Leg'][0])) {
            $leg1 = $firstSegment['Legs']['Leg'];
        } else {
            $leg1[0] = $firstSegment['Legs']['Leg'];
        }
        if (isset($segments['Segments']['Segment'][1]['Legs']['Leg'][0])) {
            $leg2 = $segments['Segments']['Segment'][1]['Legs']['Leg'];
        } else {
            $leg2[0] = $segments['Segments']['Segment'][1]['Legs']['Leg'];
        }
        $firstSegment['Legs']['Leg'] = array_merge($leg1, $leg2);
    }
    if (!isset($firstSegment['Legs']['Leg'][0])) {
        $firstSegment['Legs']['Leg'] = [$firstSegment['Legs']['Leg']];
    }
    $fsk = $firstSegment['Fares']['Fare']['FareSellKey'] . '~' . $firstSegment['DepartureStation'] . $arrivalStation;
    $fareBasis = $firstSegment['Fares']['Fare']['FareBasisCode'];
    foreach ($firstSegment['Legs']['Leg'] as $leg) {
        $out['segments'][1][] = [
            'origin' => $leg['DepartureStation'],
            'destination' => $leg['ArrivalStation'],
            'depart' => strstr($leg['STD'], 'T', true),
            'flightNumber' => trim($leg['FlightDesignator']['FlightNumber']),
            'marketingCompany' => $leg['FlightDesignator']['CarrierCode'],
            'bookingClass' => $firstSegment['Fares']['Fare']['ClassOfService'],
            'departTs' => \application\components\Indigo\Utils::shortenDateAndTime($leg['STD']),
            'arriveTs' => \application\components\Indigo\Utils::shortenDateAndTime($leg['STA']),
        ];
    }
    foreach ($passagers as $passager) {
        if ($passager['PaxType'] === application\components\Indigo\Utils::TRAVELER_INFANT) {
            $fskTmp = $fsk . "~" . application\components\Indigo\Utils::TRAVELER_INFANT;
        } else {
            $fskTmp = $fsk;
        }
        $out['pax'][application\components\Indigo\Utils::$passengerTypeToId[$passager['PaxType']]] = [
            'totalFare' => $fares[$fskTmp]['amount'] + $fares[$fskTmp]['baseAmount'],
            'type' => application\components\Indigo\Utils::$passengerTypeToId[$passager['PaxType']],
            'arrTaxes' => $fares[$fskTmp]['taxes'],
            'fareBasis' => $fareBasis,
        ];
    }
    $out['cabinTypeId'] = $cabinTypeId;
    $out['params'] = [
        'FareSellKey' => $fsk,
        'JourneySellKey' => $segments['JourneySellKey']
    ];

//    echo Utils::dbg($out); exit;
//    echo Utils::dbg($flights);
    return $out;
}

/**
 * To monitor SOAP calls in and out of a unix server:
 * sudo tcpdump -nn -vv -A -s 0 -i eth0 dst or src host xxx.xxx.xxx.xxx and port 80
 */
?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>