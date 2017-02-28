<h3>Amadeus test results</h3>
<?php
/* @var $model BookingSearchForm */

$start_timer = microtime(true);

function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . round((microtime(true) - $start_timer), 2) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
}

$api = new application\components\Amadeus\test\AmadeusWebServices();
$res = $api->Security_Authenticate(25);
Utils::soapDebug($api);
//if ($res->processStatus->statusCode !== 'P') {
//    echo Utils::dbg($res);
//}

$model->depart = date("dmy", strtotime($model->depart));
$origin = Airport::model()->findByPk($model->source);
$destination = Airport::model()->findByPk($model->destination);

$f_mptbs = new application\components\Amadeus\test\Fare_MasterPricerTravelBoardSearch;

$und = new application\components\Amadeus\test\unitNumberDetail;
$und->numberOfUnits = $model->adults + $model->children;
$und->typeOfUnit = 'PX';
$f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

$und = new application\components\Amadeus\test\unitNumberDetail;
$und->numberOfUnits = 100;
$und->typeOfUnit = 'RC';
$f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

$ref = 1;
for ($i = 0; $i < $model->adults; $i++) {
    $pr = new \application\components\Amadeus\test\paxReference;
    $pr->ptc = 'ADT';
    $pr->traveller = new application\components\Amadeus\test\traveller;
    $pr->traveller->ref = $ref;
    $ref++;
    $f_mptbs->paxReference[] = $pr;
}
for ($i = 0; $i < $model->children; $i++) {
    $pr = new \application\components\Amadeus\test\paxReference;
    $pr->ptc = 'CH';
    $pr->traveller = new application\components\Amadeus\test\traveller;
    $pr->traveller->ref = $ref;
    $ref++;
    $f_mptbs->paxReference[] = $pr;
}

for ($i = 0; $i < $model->infants; $i++) {
    $pr = new \application\components\Amadeus\test\paxReference;
    $pr->ptc = 'INF';
    $pr->traveller = new application\components\Amadeus\test\traveller;
    $pr->traveller->ref = $i + 1;
    $ref++;
    $pr->traveller->infantIndicator = 1;
    $f_mptbs->paxReference[] = $pr;
}

$pt = new application\components\Amadeus\test\pricingTicketing;
$pt->priceType[] = 'TAC';
$pt->priceType[] = 'RU';
$pt->priceType[] = 'RP';
//$pt->priceType[] = 'PTC';
$pt->priceType[] = 'ET';
$f_mptbs->fareOptions = new \application\components\Amadeus\test\fareOptions;
$f_mptbs->fareOptions->pricingTickInfo = new \application\components\Amadeus\test\pricingTickInfo;
$f_mptbs->fareOptions->pricingTickInfo->pricingTicketing = $pt;

$f_mptbs->travelFlightInfo = new \application\components\Amadeus\test\travelFlightInfo;
$f_mptbs->travelFlightInfo->cabinId = new \application\components\Amadeus\test\cabinId;
if ($model->category == CabinType::PREMIUM_ECONOMY) {
    $model->category = CabinType::ECONOMY;
}
$f_mptbs->travelFlightInfo->cabinId->cabin = CabinType::$iataCabinClass[$model->category];

$f_mptbs->itinerary[0] = new \application\components\Amadeus\test\itinerary;
$f_mptbs->itinerary[0]->requestedSegmentRef = new \application\components\Amadeus\test\requestedSegmentRef;
$f_mptbs->itinerary[0]->requestedSegmentRef->segRef = 1;
$f_mptbs->itinerary[0]->departureLocalization = new application\components\Amadeus\test\departureLocalization;
$f_mptbs->itinerary[0]->departureLocalization->depMultiCity = new application\components\Amadeus\test\depMultiCity;
$f_mptbs->itinerary[0]->departureLocalization->depMultiCity->locationId = $origin->airport_code;

$f_mptbs->itinerary[0]->arrivalLocalization = new \application\components\Amadeus\test\arrivalLocalization;
$f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity = new \application\components\Amadeus\test\arrivalMultiCity;
$f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity->locationId = $destination->airport_code;

$f_mptbs->itinerary[0]->timeDetails = new application\components\Amadeus\test\timeDetails;
$f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail = new \application\components\Amadeus\test\firstDateTimeDetail;
$f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail->date = $model->depart;

// Round trip
if (!empty($model->return)) {
    $model->return = date("dmy", strtotime($model->return));
    $f_mptbs->itinerary[1] = new \application\components\Amadeus\test\itinerary;
    $f_mptbs->itinerary[1]->requestedSegmentRef = new \application\components\Amadeus\test\requestedSegmentRef;
    $f_mptbs->itinerary[1]->requestedSegmentRef->segRef = 2;
    $f_mptbs->itinerary[1]->departureLocalization = new application\components\Amadeus\test\departureLocalization;
    $f_mptbs->itinerary[1]->departureLocalization->depMultiCity = new application\components\Amadeus\test\depMultiCity;
    $f_mptbs->itinerary[1]->departureLocalization->depMultiCity->locationId = $destination->airport_code;

    $f_mptbs->itinerary[1]->arrivalLocalization = new \application\components\Amadeus\test\arrivalLocalization;
    $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity = new \application\components\Amadeus\test\arrivalMultiCity;
    $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity->locationId = $origin->airport_code;

    $f_mptbs->itinerary[1]->timeDetails = new application\components\Amadeus\test\timeDetails;
    $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail = new \application\components\Amadeus\test\firstDateTimeDetail;
    $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail->date = $model->return;
}

$res = $api->Fare_MasterPricerTravelBoardSearch($f_mptbs);
//$res = json_decode(file_get_contents('amadeus_f_mptbs.json'));
//file_put_contents('amadeus_f_mptbs.json', json_encode($res));
//Utils::soapDebug($api);
//echo Utils::dbg($res);
if (isset($res->errorMessage->errorMessageText->description)) {
    Utils::soapDebug($api);
    Utils::finalMessage($res->errorMessage->errorMessageText->description);
}
// Prepare taxes
foreach ($res->recommendation as $recommend) {
    unset($passengers);
    foreach (Utils::toArray($recommend->paxFareProduct) as $pfp) {
        foreach (Utils::toArray($pfp->paxReference->traveller) as $traveler) {
            $key = $traveler->ref;
            if (isset($traveler->infantIndicator)) {
                $key = count($passengers[$segmentRef]) + 1;
            }
            foreach (Utils::toArray($pfp->fareDetails) as $fds) {
                $segmentRef = $fds->segmentRef->segRef;
                $passengers[$segmentRef][$key]['type'] = $pfp->paxReference->ptc;
                $passengers[$segmentRef][$key]['fare'] = $pfp->paxFareDetail->totalFareAmount;
                $passengers[$segmentRef][$key]['taxes'] = $pfp->paxFareDetail->totalTaxAmount;
                $tmp = Utils::toArray($fds->groupOfFares);
                $passengers[$segmentRef][$key]['fareBasis'] = $tmp[0]->productInformation->fareProductDetail->fareBasis;
            }
        }
    }

    foreach (Utils::toArray($recommend->segmentFlightRef) as $ref) {
        foreach (Utils::toArray($ref->referencingDetail) as $k => $refDetail) {
            $segments[$k + 1][$refDetail->refNumber] = $passengers[$segmentRef];
        }
    }
}
//echo Utils::dbg($segments);
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
    $travelerCount = count($segments[1][1]);
    $i = 1;
    foreach (Utils::toArray($res->flightIndex) as $fi) {
        $bigSegmentRef = $fi->requestedSegmentRef->segRef;
        foreach ($fi->groupOfFlights as $gof) {
            $segmentRef = $gof->propFlightGrDetail->flightProposal[0]->ref;
            $legs = Utils::toArray($gof->flightDetails);
            $legsCount = count($legs);
            ?>
            <tr>
                <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo $i; ?></td>
                <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo ($legsCount - 1); ?></td>
                <?php
                $firstLeg = true;
                foreach ($legs as $leg) {
                    $depart = \application\components\Amadeus\Utils::formatDate($leg->flightInformation->productDateTime->dateOfDeparture) . " " . \application\components\Amadeus\Utils::formatTime($leg->flightInformation->productDateTime->timeOfDeparture);
                    $arrive = \application\components\Amadeus\Utils::formatDate($leg->flightInformation->productDateTime->dateOfArrival) . " " . \application\components\Amadeus\Utils::formatTime($leg->flightInformation->productDateTime->timeOfArrival);
                    ?>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $depart; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg->flightInformation->location[0]->locationId; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $arrive; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg->flightInformation->location[1]->locationId; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg->flightInformation->companyId->operatingCarrier . '-' . $leg->flightInformation->flightNumber; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo Utils::convertSecToHoursMins(strtotime($arrive) - strtotime($depart)); ?></td>
                    <?php
                    $firstPassenger = true;
                    foreach ($segments[$bigSegmentRef][$segmentRef] as $passenger) {
                        if (!$firstPassenger) {
                            echo "<tr>";
                        }
                        if ($firstLeg) {
                            ?>  
                            <td><?php echo $passenger['type']; ?></td>
                            <td><?php echo $passenger['fareBasis']; ?></td>
                            <td><?php echo $passenger['fare']; ?></td>
                            <td><?php echo ($passenger['fare'] - $passenger['taxes']); ?></td>
                            <td><?php echo $passenger['taxes']; ?></td>
                            <?php
                        } else {
                            echo "<td colspan='5'></td>";
                        }
                        ?>
                    </tr>
                    <?php
                    $firstPassenger = false;
                }
                ?>
                <?php
                $firstLeg = false;
            }
            $i++;
            ?>
        </tr>
        <tr><td colspan='13'></td></tr>
    <?php
    }
}
?>
</table>
<?php
//echo Utils::dbg($res);
//$api->Security_SignOut();

footer($start_timer);
?>
<style>
    .table td, .table th {
        text-align: center;
        vertical-align: middle;
    }
</style>