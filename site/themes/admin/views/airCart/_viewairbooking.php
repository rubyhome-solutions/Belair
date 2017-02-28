<?php 
$processedBookings = array();
    $cartFare = 0;
    $cartTaxes = 0;
    $cartServiceFee = 0;
    $cartFee = 0;
    $cartDiscount = 0;
    foreach ($airBookings as $airBooking) {
        // Skip the bookings that are already processed
        if (in_array($airBooking->id, $processedBookings))
            continue;
        $processedBookings[] = $airBooking->id;
       
   ?>     
      <div class="row">
        <div class="col-lg-12">
            <div class="float-e-margins">
                <div class="ibox-title text-success">
                 <h5><?php    echo "<i class='fa fa-plane fa-lg'></i> &nbsp;{$airBooking->serviceType->name}:&nbsp; {$airBooking->source->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " <i class='fa fa-long-arrow-right fa-lg'></i> {$airBooking->destination->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) ; ?>
                 </h5>

                </div>
           <?php  
           $this->renderPartial('_viewairroutes', ['airRoutes' => $airBooking->airRoutes]);?>

            </div>


        </div>
    </div>
<div class="row">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">

                <div class="ibox-content">
                    <table class="table table-striped table-bordered table-hover dataTables-example" >
                        <thead>
                            <tr>
                                <th>Passenger</th>
                                <th>CSR PNR</th>
                                <th>AIR PNR</th>
                                <th>E-Ticket</th>
                                <th>Class</th>
                                <th>Cabin</th>
                                <th>Fare</th>
                                <th>B.Fare</th>
                                <th>Taxes</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        
                        <?php
            $this->renderPartial('_airbookingrow', ['airBooking' => $airBooking]);
            $cartFare += $airBooking->basic_fare + $airBooking->reseller_markup_base;
            $cartTaxes += $airBooking->taxesOnly;
            $cartServiceFee += $airBooking->service_tax + $airBooking->jn_tax + $airBooking->reseller_markup_tax;
            $cartFee += $airBooking->booking_fee + + $airBooking->reseller_markup_fee;
            $cartDiscount += $airBooking->commission_or_discount_gross;

            $extraAirBookings = AirBooking::model()->findAllByAttributes([
                'air_cart_id' => $airBooking->air_cart_id,
                'carrier_id' => $airBooking->carrier_id,
                'source_id' => $airBooking->source_id,
                'destination_id' => $airBooking->destination_id,
                'departure_ts' => $airBooking->departure_ts,
                'arrival_ts' => $airBooking->arrival_ts,
                    ], ['condition' => "id<>$airBooking->id", 'order' => 'traveler_id']);
            foreach ($extraAirBookings as $value) {
                $this->renderPartial('_airbookingrow', ['airBooking' => $value]);
                $processedBookings[] = $value->id;
                $cartFare += $value->basic_fare + $value->reseller_markup_base;
                $cartTaxes += $value->taxesOnly;
                $cartServiceFee += $value->service_tax + $value->jn_tax + $value->reseller_markup_tax;
                $cartFee += $value->booking_fee + $value->reseller_markup_fee;
                $cartDiscount += $value->commission_or_discount_gross;
            }
            ?>
        </table>


                </div>

            </div>


        </div>
    </div>
    <?php } ?>