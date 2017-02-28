<?php
/* @var $this AirCartController */
/* @var $model AirCart */
/* @var $airRoutes AirRoutes[] */
?>

<div style="clear: both;">

    <?php
    $processedAirBookings = array();
    $cartFare = 0;
    $cartTaxes = 0;
    $cartFee = 0;
    $cartTds = 0;
    $cartMarkup = 0;
    $cartServiceFee = 0;
    $cartDiscount = 0;
    $airRoutes = AirRoutes::model()->with(['airBooking' => [
                    'together' => true,
                    'condition' => "air_cart_id = $model->id",
        ]])->findAll(['order' => 't.departure_ts, "airBooking".traveler_id']);

    $previousRoute = array();
    foreach ($airRoutes as $airRoute) {
        // Skip the routes that are already written
        $airBooking = $airRoute->airBooking;
        if (!in_array($airBooking->id, $processedAirBookings)) { // First time processing this booking
            $processedAirBookings[] = $airBooking->id;
            $firstAirRoute = true;
        } else {    // We already processed this booking. Clear the numbers and make it new record
            $airBooking->isNewRecord = true;
            $airBooking->id = null;
            $airBooking->clearFareAndTaxes();
            $firstAirRoute = false;
        }
        $newRoute = $airRoute->getAirRoutesEssentials();
        if (empty($previousRoute) || $previousRoute != $newRoute) {
//            \Utils::dbgYiiLog($previousRoute);
//            \Utils::dbgYiiLog($newRoute);
            $previousRoute = $newRoute;
            //echo "<p class='well well-small alert-info'>&nbsp;<i class='fa fa-plane fa-lg'></i> &nbsp;{$airBooking->serviceType->name}:&nbsp; {$airRoute->source->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airRoute->departure_ts)) . " <i class='fa fa-long-arrow-right fa-lg'></i> {$airRoute->destination->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airRoute->arrival_ts)) . "</p>";
           // $this->renderPartial('_viewairroutes', ['airRoutes' => [$airRoute]]);
            $this->renderPartial('_viewairbookings_summary', [
                'airBookings' => AirBooking::model()->findAllBySql('
                    SELECT DISTINCT air_booking.* FROM air_booking
                    JOIN air_routes ON (air_booking.id=air_routes.air_booking_id)
                    WHERE
                        air_routes.departure_ts = :departureTs AND
                        air_routes.arrival_ts = :arrivalTs AND
                        air_routes.source_id = :sourceId AND
                        air_routes.destination_id = :destinationId AND
                        air_routes.flight_number = :flight_number AND
                        air_routes.order_ = 1 AND
                        air_booking.air_cart_id = :airCartId
                    ', [
                    'departureTs' => $airRoute->departure_ts,
                    'arrivalTs' => $airRoute->arrival_ts,
                    'sourceId' => $airRoute->source_id,
                    'destinationId' => $airRoute->destination_id,
                    'flight_number' => $airRoute->flight_number,
                    'airCartId' => $airRoute->airBooking->air_cart_id,
                ])
            ]);
        }
        if (isset($errors[$airRoute->id])) {
            echo $errors[$airRoute->id];
        }
        ?>
    <div class="ibox-content highlightArea">   
    <table class="table table-bordered table-condensed" >
            <tr  class="heading">
                <!--<th>Leading airline</th>-->
                <th>Passenger</th>
                <th>Status</th>
                <th>Air PNR</th>
                <th>CRS PNR</th>
                <th>E-ticket</th>
                <th>B.Class</th>
                <th>F.Basis</th>
                <th>C.Fee</th>
                <th></th>
                <th>Select</th>
            </tr>
            <?php
            $this->renderPartial('_modify_airbookingrow', [
                'airBooking' => $airBooking,
                'airRoute' => $airRoute,
                'firstAirRoute' => $firstAirRoute
            ]);
            $cartFare += $airBooking->basic_fare;
            $cartTaxes += $airBooking->taxesOnly;
            $cartFee += $airBooking->booking_fee;
            $cartTds += $airBooking->tds;
            $cartMarkup += $airBooking->getMarkup();
            $cartServiceFee += $airBooking->service_tax + $airBooking->jn_tax;
            $cartDiscount += $airBooking->commission_or_discount_gross;

//        foreach ($allAirRoutes as $value) {
//            if ($value->id === $airBooking->id)     // Skip the printed one
//                continue;
//            $this->renderPartial('_modify_airbookingrow', ['airBooking' => $value]);
//            $processedAirBookings[] = $value->id;
//            $cartFare += $value->basic_fare;
//            $cartTaxes += $value->taxesOnly;
//        }
            ?>
        </table>
    </div>
    <?php } ?>
    <div class="ibox-content highlightDark">
        <table class="table table-condensed table-bordered table-hover">
            <tr>
                <th class="heading">Amend Selected Air Items</th>
                <td class="center">
                    <div class="control-group pull-left" style="margin-left: 25px;">
                        <?php echo TbHtml::dropDownList('amendment_type', '', CHtml::listData(AmendmentType::model()->findAll(['order' => 'id']), 'id', 'name'), ['empty' => 'Amendment type ...', 'class'=> 'form-control']); ?>
                    </div>
                    &nbsp;
                    <button onclick="amendItems();
                            $(this).blur();
                            return false;" type="button" class="btn btn-warning">Amend Selected</button>
                </td>
            </tr>
        </table>
    </div>

    <div id="myModal" class="modal fade">
        <div class="modal-dialog modal-sm">
        <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$('#amendReasonBtn').val(0);">&times;</button>
            <h3>Why you need this amendment</h3>
        </div>
        <div class="modal-body">
            <textarea id="amendReason" min="10" class="span4 form-control" required placeholder="Enter your amendment reason ..."></textarea>
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true" onclick="$('#amendReasonBtn').val(0);">Close</button>
            <button type="button" id="amendReasonBtn" value="0" class="btn btn-primary" onclick="this.value = 1;
                    $('#myModal').modal('hide');">Submit</button>
        </div>
        </div>
            </div>
    </div>

    
    
    

</div>
