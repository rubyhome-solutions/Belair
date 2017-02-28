<h3>Spicejet v.2 production results</h3>
<?php
/* @var $model \BookingSearchForm */
/* @var $this \BookingController */

set_time_limit(90);     // This crappy APi need much more attention
$start_timer = microtime(true);

function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . round(microtime(true) - $start_timer, 2) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    Yii::app()->end();
}

$origin = Airport::model()->findByPk($model->source);
$destination = Airport::model()->findByPk($model->destination);

Yii::import('application.components.Spicejet.BookingManager', true);
//$test = true;
$test = false;
if (!$test) {
    $apiSesMan = new \application\components\Spicejet\SessionManager([], 'production');
    $signature = $apiSesMan->Logon(application\components\Spicejet\Utils::PRODUCTION_AIRSOURCE_ID);
    if ($signature === false) {   // Error
        Utils::finalMessage('Error with Spicejet. Please check the logs for details!');
    }
    $bookingApi = new \application\components\Spicejet\BookingManager($signature, [], 'production');
} else {
//    $model->adults = 1;
//    $model->infants = 0;
//    $model->children = 0;
//    $model->return = '2014-12-26';
//    $origin->airport_code = 'BLR';
}

$activeCompanyId = Utils::getActiveCompanyId();
$airSourceId = application\components\Spicejet\Utils::PRODUCTION_AIRSOURCE_ID;
$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
    'id' => 'amadeus-booking-form',
    'enableAjaxValidation' => false,
    'layout' => TbHtml::FORM_LAYOUT_INLINE,
    'enableClientValidation' => true,
        ));
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
    $priceTypes[] = new \application\components\Spicejet\PaxPriceType("ADT");
}
for ($i = 0; $i < $model->children; $i++) {
    $priceTypes[] = new \application\components\Spicejet\PaxPriceType("CHD");
}

$passengersCount = $model->adults + $model->children;
$availabilityRequest = new \application\components\Spicejet\AvailabilityRequest(
//        $model->depart, $model->depart, \application\components\Spicejet\FlightType::All, $passengersCount, \application\components\Spicejet\DOW::Daily, \application\components\Spicejet\AvailabilityType::aDefault, 3, \application\components\Spicejet\AvailabilityFilter::ExcludeUnavailable, \application\components\Spicejet\FareClassControl::LowestFareClass, null, null, \application\components\Spicejet\SSRCollectionsMode::None, \application\components\Spicejet\InboundOutbound::None, null, false, false, \application\components\Spicejet\FareRuleFilter::aDefault, \application\components\Spicejet\LoyaltyFilter::MonetaryOnly);
        $model->depart, $model->depart, \application\components\Spicejet\FlightType::All, $passengersCount, \application\components\Spicejet\DOW::Daily, \application\components\Spicejet\AvailabilityType::aDefault, 3, \application\components\Spicejet\AvailabilityFilter::ExcludeUnavailable, \application\components\Spicejet\FareClassControl::aDefault, null, null, \application\components\Spicejet\SSRCollectionsMode::None, \application\components\Spicejet\InboundOutbound::None, null, false, false, \application\components\Spicejet\FareRuleFilter::aDefault, \application\components\Spicejet\LoyaltyFilter::MonetaryOnly);
$availabilityRequest->PaxPriceTypes = $priceTypes;
$availabilityRequest->DepartureStation = $origin->airport_code;
$availabilityRequest->ArrivalStation = $destination->airport_code;
$availabilityRequest->CurrencyCode = "INR";
//$availabilityRequest->FareTypes[] = "R";
//if (!empty($model->return)) {
//    $availabilityRequest->ProductClassCode = "XA";
//}
//$availabilityRequest->FareClasses[] = application\components\Spicejet\Utils::$cabinClass[$model->category];
// Which Cabin type we are interested in
//$availabilityRequest->FareClasses[] = CabinType::$iataCabinClass[CabinType::FIRST];
// If we have return trip, then configure new AvailabilityRequest for the return trip

$tripAvailabilityRequest = new \application\components\Spicejet\TripAvailabilityRequest(\application\components\Spicejet\LoyaltyFilter::MonetaryOnly);
$tripAvailabilityRequest->AvailabilityRequests[] = $availabilityRequest;

// Check for return trip
if (!empty($model->return)) {
    $ar2 = new \application\components\Spicejet\AvailabilityRequest(
//            $model->return, $model->return, \application\components\Spicejet\FlightType::All, $passengersCount, \application\components\Spicejet\DOW::Daily, \application\components\Spicejet\AvailabilityType::aDefault, 3, \application\components\Spicejet\AvailabilityFilter::ExcludeUnavailable, \application\components\Spicejet\FareClassControl::LowestFareClass, null, null, \application\components\Spicejet\SSRCollectionsMode::None, \application\components\Spicejet\InboundOutbound::None, null, false, false, \application\components\Spicejet\FareRuleFilter::aDefault, \application\components\Spicejet\LoyaltyFilter::MonetaryOnly);
            $model->return, $model->return, \application\components\Spicejet\FlightType::All, $passengersCount, \application\components\Spicejet\DOW::Daily, \application\components\Spicejet\AvailabilityType::aDefault, 3, \application\components\Spicejet\AvailabilityFilter::ExcludeUnavailable, \application\components\Spicejet\FareClassControl::aDefault, null, null, \application\components\Spicejet\SSRCollectionsMode::None, \application\components\Spicejet\InboundOutbound::None, null, false, false, \application\components\Spicejet\FareRuleFilter::aDefault, \application\components\Spicejet\LoyaltyFilter::MonetaryOnly);
    foreach ($priceTypes as $value) {
        $priceTypes2[] = clone $value;
    }
//    $ar2->ProductClassCode = "XA";
    $ar2->PaxPriceTypes = $priceTypes2;
    $ar2->DepartureStation = $destination->airport_code;
    $ar2->ArrivalStation = $origin->airport_code;
    $ar2->CurrencyCode = "INR";
//    $ar2->FareTypes[] = "R";
//    $ar2->FareClasses[] = application\components\Spicejet\Utils::$cabinClass[$model->category];

    $tripAvailabilityRequest->AvailabilityRequests[] = $ar2;
}

$storeFileName = \Yii::app()->runtimePath . '/Spicejet_v2_GetAvailability_response.json';
if (!$test) {
    $request = new \application\components\Spicejet\GetAvailabilityRequest($tripAvailabilityRequest);
    $response = $bookingApi->GetAvailability($request);
//    echo Utils::dbg($response); exit;
    if (YII_DEBUG) {
//        \Utils::soapLogDebug($bookingApi);
        file_put_contents($storeFileName, json_encode($response));
    }
} else {
    $response = json_decode(file_get_contents($storeFileName));
}
//Utils::soapDebug($bookingApi); exit;

$arr = json_decode(json_encode($response), true);
//file_put_contents('spicejet_GetAvailability_array.txt', print_r($arr, true));
//echo Utils::dbg($arr);

if (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey']) &&
        isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey'])) {   // More then one result
    $journeys = array_merge(
            $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][0]['JourneyDateMarket']['Journeys']['Journey'], $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket'][1]['JourneyDateMarket']['Journeys']['Journey']);
} elseif (isset($arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'])) {     // One result
    $journeys = $arr['GetTripAvailabilityResponse']['Schedules']['ArrayOfJourneyDateMarket']['JourneyDateMarket']['Journeys']['Journey'];
} else {        // No results
    echo "<h3>No flights available</h3>";
    Yii::app()->end();
}
// Fix single Journey case
if (!isset($journeys[0])) {
    $journeys = [$journeys];
}
//echo Utils::dbg($journeys);
// Price info
$itineraryPriceRequest = new \application\components\Spicejet\ItineraryPriceRequest(\application\components\Spicejet\PriceItineraryBy::JourneyBySellKey);
$itineraryPriceRequest->SellByKeyRequest = new \application\components\Spicejet\SellJourneyByKeyRequestData;
//($passengersCount, \application\components\Spicejet\LoyaltyFilter::MonetaryOnly);
$itineraryPriceRequest->SellByKeyRequest->CurrencyCode = 'INR';
$itineraryPriceRequest->SellByKeyRequest->ActionStatusCode = 'NN';
$itineraryPriceRequest->SellByKeyRequest->IsAllotmentMarketFare = false;
$itineraryPriceRequest->SellByKeyRequest->PaxCount = $passengersCount;
$itineraryPriceRequest->SellByKeyRequest->PaxPriceType = $priceTypes;
$itineraryPriceRequest->SellByKeyRequest->TypeOfSale->FareTypes[] = "R";
$itineraryPriceRequest->SellByKeyRequest->LoyaltyFilter = \application\components\Spicejet\LoyaltyFilter::MonetaryOnly;
foreach ($journeys as $jorney) {
    // Spicejet fault - skip it
    if (isset($jorney['Segments']['Segment'][0]['Fares']['Fare'])) {
        continue;
    }
//    \Utils::dbgYiiLog($jorney);
    $sk = new \application\components\Spicejet\SellKeyList();
    $sk->JourneySellKey = $jorney['JourneySellKey'];
    $sk->FareSellKey = $jorney['Segments']['Segment']['Fares']['Fare']['FareSellKey'];
    $itineraryPriceRequest->SellByKeyRequest->JourneySellKeys[] = $sk;

    // If there are infants
    if (!empty($model->infants)) {
        $sssr = new \application\components\Spicejet\SegmentSSRRequest($jorney['Segments']['Segment']['STD']);
        $sssr->ArrivalStation = $jorney['Segments']['Segment']['ArrivalStation'];
        $sssr->DepartureStation = $jorney['Segments']['Segment']['DepartureStation'];
        $sssr->FlightDesignator = new \application\components\Spicejet\FlightDesignator;
        $sssr->FlightDesignator->CarrierCode = $jorney['Segments']['Segment']['FlightDesignator']['CarrierCode'];
        $sssr->FlightDesignator->FlightNumber = trim($jorney['Segments']['Segment']['FlightDesignator']['FlightNumber']);
        for ($i = 0; $i < $model->infants; $i++) {
            $paxSSR = new \application\components\Spicejet\PaxSSR(\application\components\Spicejet\MessageState::aNew, $i, $i);
            $paxSSR->ActionStatusCode = 'NN';
            $paxSSR->ArrivalStation = $sssr->ArrivalStation;
            $paxSSR->DepartureStation = $sssr->DepartureStation;
            $paxSSR->SSRCode = \application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
            $sssr->PaxSSRs[] = $paxSSR;
        }
        $itineraryPriceRequest->SSRRequest->SegmentSSRRequests[] = $sssr;
    }
}
//echo \Utils::dbg($itineraryPriceRequest);
$storeFileName = \Yii::app()->runtimePath . '/Spicejet_v2_GetItineraryPrice_response.json';
if (!$test) {
    $pir = new \application\components\Spicejet\PriceItineraryRequest($itineraryPriceRequest);
    $itineraryPriceResponse = $bookingApi->GetItineraryPrice($pir);
    if (YII_DEBUG) {
        file_put_contents($storeFileName, json_encode($itineraryPriceResponse));
    }
} else {
    $itineraryPriceResponse = json_decode(file_get_contents($storeFileName));
}
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
        $passenger0->PassengerFees->PassengerFee->FeeCode == \application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT]) ||
        (isset($passenger0->PassengerFees->PassengerFee[0]->FeeCode) &&
        $passenger0->PassengerFees->PassengerFee[0]->FeeCode == \application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT])) {
    foreach (\Utils::toArray($passenger0->PassengerFees->PassengerFee) as $paxFee) {
        $infants[$paxFee->FlightReference] = $paxFee->ServiceCharges; //->BookingServiceCharge;
    }
//    echo \Utils::dbg($infants);
//    file_put_contents('infants.txt', print_r($infants, true));
    foreach ($itineraryPriceResponse->Booking->Journeys->Journey as $jKey => $journey) {
        $std = substr(str_replace('-', '', $journey->Segments->Segment->STD), 0, 8);
        $key = $std . " " . $journey->Segments->Segment->FlightDesignator->CarrierCode . $journey->Segments->Segment->FlightDesignator->FlightNumber . " " .
                $journey->Segments->Segment->DepartureStation . $journey->Segments->Segment->ArrivalStation;
        if (!empty($infants[$key])) {
//            echo \Utils::dbg($key);
            for ($i = 0; $i < $model->infants; $i++) {
                $newPF = new \application\components\Spicejet\PaxFare(\application\components\Spicejet\MessageState::aNew);
                $newPF->PaxType = application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                $newPF->ServiceCharges = $infants[$key];
                if (is_array($journey->Segments->Segment->Fares->Fare->PaxFares->PaxFare)) {
                    $itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment->Fares->Fare->PaxFares->PaxFare[] = $newPF;
                } else {
                    $itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment->Fares->Fare->PaxFares->PaxFare = [$journey->Segments->Segment->Fares->Fare->PaxFares->PaxFare, $newPF];
                }
//                echo \Utils::dbg($newPF);
            }
//            echo \Utils::dbg($itineraryPriceResponse->Booking->Journeys->Journey[$jKey]->Segments->Segment->Fares->Fare->PaxFares->PaxFare);
        }
    }
//    echo Utils::dbg($journeys);
    // Add Infants to passengers in the journeys array
    foreach ($journeys as $jKey => $journey) {
        // Spicejet buggy API correction
        if (isset($journey['Segments']['Segment'][0]['STD'])) {
            continue;
        }
        $std = substr(str_replace('-', '', $journey['Segments']['Segment']['STD']), 0, 8);
        $key = $std . " " . $journey['Segments']['Segment']['FlightDesignator']['CarrierCode'] . $journey['Segments']['Segment']['FlightDesignator']['FlightNumber'] . " " .
                $journey['Segments']['Segment']['DepartureStation'] . $journey['Segments']['Segment']['ArrivalStation'];
        if (isset($infants[$key])) {
            for ($i = 0; $i < $model->infants; $i++) {
                $newPF = new \application\components\Spicejet\PaxFare(\application\components\Spicejet\MessageState::aNew);
                $newPF->PaxType = application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                $newPF->ServiceCharges = $infants[$key];
                $newPF = json_decode(json_encode($newPF), true);
                if (isset($journey['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'][0])) {
                    $journeys[$jKey]['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'][] = $newPF;
                } else {
                    $journeys[$jKey]['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'] = [$journey['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'], $newPF];
                }
            }
        }
    }
}

//echo Utils::dbg($journeys);
//file_put_contents('spicejet_journeys.txt', print_r($journeys, true));
//file_put_contents('spicejet_itineraryPriceResponse.txt', print_r($itineraryPriceResponse, true));
// Prepare the fares details
foreach (Utils::toArray($itineraryPriceResponse->Booking->Journeys->Journey) as $journey) {
//    file_put_contents('journey_obj.txt', print_r($journey, true));
//    $journeyKey = $journey->JourneySellKey;
//    $segmentKey = $journey->Segments->Segment->SegmentSellKey;
//    echo "$journeyKey ==> $segmentKey ==> $fareKey <br>";
    if (is_array($journey->Segments->Segment->Fares->Fare->PaxFares->PaxFare)) {
        $paxFares = $journey->Segments->Segment->Fares->Fare->PaxFares->PaxFare;    // Many passagers
    } else {
        $paxFares[0] = $journey->Segments->Segment->Fares->Fare->PaxFares->PaxFare; // Single passager
    }
    foreach ($paxFares as $fare) {
        $fareKey = $journey->Segments->Segment->Fares->Fare->FareSellKey . '~' . $journey->Segments->Segment->DepartureStation . $journey->Segments->Segment->ArrivalStation;
        if ($fare->PaxType == application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
            // Add infant sufix
            $fareKey .= "~" . application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
        }
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
        foreach ($fare->ServiceCharges->BookingServiceCharge as $charge) {
            if (!empty($charge->ChargeCode) &&
                    $charge->ChargeCode != application\components\Spicejet\Utils::$passengerTypes[TravelerType::TRAVELER_INFANT]) {
                // Drop out certain tax, that is not applicable, but is still sent
                if ($charge->ChargeCode === \application\components\Spicejet\Utils::TAX_TO_SUBSTRACT) {
                    $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . (float) $charge->Amount . "<br>";
                    $taxAdjust = (int) $charge->Amount;
                    $taxes[Taxes::TAX_TOTAL_CORRECTION] = $taxAdjust;
                } else {
                    if ($taxAdjust <> 0 && $charge->ChargeCode === \application\components\Spicejet\Utils::TAX_TO_ADJUST) {
                        $deduct = round($taxAdjust * \application\components\Spicejet\Utils::MULTIPLIER_FOR_ADJUSTING);
                        $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . ((int) ($charge->Amount) - $deduct) . "<br>";
                        $fares[$fareKey]['amount'] += ((int) ($charge->Amount) - $deduct);
                        $taxes[\application\components\Spicejet\Utils::$taxesReformat[$charge->ChargeCode]] += ((int) ($charge->Amount) - $deduct);
                        $taxes[Taxes::TAX_TOTAL_CORRECTION] += $deduct;
                    } else {
                        $fares[$fareKey]['text'] .= $charge->ChargeCode . ": " . (float) $charge->Amount . "<br>";
                        $fares[$fareKey]['amount'] += (float) $charge->Amount;
                        $taxes[\application\components\Spicejet\Utils::$taxesReformat[$charge->ChargeCode]] += (int) ($charge->Amount);
                    }
                }
            } else {
                $fares[$fareKey]['baseAmount'] = (float) $charge->Amount;
            }
        }
        $fares[$fareKey]['taxes'] = $taxes;
    }
}

//echo Utils::dbg($fares);
//exit;
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
        // Spicejet fault - skip it
        if (isset($jorney['Segments']['Segment'][0]['Fares']['Fare'])) {
            continue;
        }
        if (isset($jorney['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'][0])) {
            $passengers = $jorney['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'];
            $travelerCount = count($jorney['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare']);
        } else {
            unset($passengers);
            $passengers[0] = $jorney['Segments']['Segment']['Fares']['Fare']['PaxFares']['PaxFare'];
            $travelerCount = 1;
        }
        if (isset($jorney['Segments']['Segment']['Legs']['Leg'][0])) {
            $legsCount = count($jorney['Segments']['Segment']['Legs']['Leg']);  // Multiple legs
            $legs = $jorney['Segments']['Segment']['Legs']['Leg'];  // Multiple legs
        } else {
            $legsCount = 1;
            unset($legs);
            $legs[0] = $jorney['Segments']['Segment']['Legs']['Leg'];   // Single leg
        }
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
                            'params' => ['data' => $bookData]
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
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['FlightDesignator']['CarrierCode'] . '-' . $leg['FlightDesignator']['FlightNumber']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo Utils::convertSecToHoursMins(strtotime($leg['STA']) - strtotime($leg['STD'])); ?></td>
                <?php
                $first = true;
                foreach ($passengers as $passenger) {
                    $fsk = $jorney['Segments']['Segment']['Fares']['Fare']['FareSellKey'] . '~' . $jorney['Segments']['Segment']['DepartureStation'] . $jorney['Segments']['Segment']['ArrivalStation'];
                    if ($passenger['PaxType'] === application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT]) {
                        $fsk .= "~" . application\components\Spicejet\Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                    }
                    if (!$first) {
                        echo "<tr>";
                    }
                    $first = false;
                    if ($firstLeg) {
                        ?>
                        <td><?php echo $passenger['PaxType']; ?></td>
                        <td><?php echo $jorney['Segments']['Segment']['Fares']['Fare']['FareBasisCode']; ?></td>
                        <td><?php echo ($fares[$fsk]['baseAmount'] + $fares[$fsk]['amount']); ?></td>
                        <td><?php echo $fares[$fsk]['baseAmount']; ?></td>
                        <td><?php
//                        echo $fares[$fsk]['text'] . "<hr>";
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
        $segments['Segments']['Segment'] = [$segments['Segments']['Segment']];
    }
    $segRef = 1;
    foreach ($segments['Segments']['Segment'] as $segment) {
        if (!isset($segment['Legs']['Leg'][0])) {
            $segment['Legs']['Leg'] = [$segment['Legs']['Leg']];
        }
        $fsk = $segment['Fares']['Fare']['FareSellKey'] . '~' . $segment['DepartureStation'] . $segment['ArrivalStation'];
        $fareBasis = $segment['Fares']['Fare']['FareBasisCode'];
        foreach ($segment['Legs']['Leg'] as $leg) {
            $out['segments'][$segRef][] = [
                'origin' => $leg['DepartureStation'],
                'destination' => $leg['ArrivalStation'],
                'depart' => strstr($leg['STD'], 'T', true),
                'flightNumber' => trim($leg['FlightDesignator']['FlightNumber']),
                'marketingCompany' => $leg['FlightDesignator']['CarrierCode'],
                'bookingClass' => $segment['Fares']['Fare']['ClassOfService'],
                'departTs' => \application\components\Spicejet\Utils::shortenDateAndTime($leg['STD']),
                'arriveTs' => \application\components\Spicejet\Utils::shortenDateAndTime($leg['STA']),
            ];
        }
        $segRef++;
    }
    foreach ($passagers as $passager) {
        if ($passager['PaxType'] === application\components\Spicejet\Utils::TRAVELER_INFANT) {
            $fskTmp = $fsk . "~" . application\components\Spicejet\Utils::TRAVELER_INFANT;
        } else {
            $fskTmp = $fsk;
        }
        $out['pax'][application\components\Spicejet\Utils::$passengerTypeToId[$passager['PaxType']]] = [
            'totalFare' => $fares[$fskTmp]['amount'] + $fares[$fskTmp]['baseAmount'],
            'type' => application\components\Spicejet\Utils::$passengerTypeToId[$passager['PaxType']],
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