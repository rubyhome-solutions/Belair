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
        $processedBookings[] = $value->id;
        $cartFare += $value->basic_fare + $value->reseller_markup_base;
        $cartTaxes += $value->taxesOnly;
        $cartServiceFee += $value->service_tax + $value->jn_tax + $value->reseller_markup_tax;
        $cartFee += $value->booking_fee + $value->reseller_markup_fee;
        $cartDiscount += $value->commission_or_discount_gross;
    }
}

$airSourceCurrency = $airBooking->airSource->currency->code;
$accountingCurrency = $airBooking->airCart->user->userInfo->currency->code;
$cartTotal = $cartFare + $cartTaxes + $cartServiceFee + $cartFee - $cartDiscount;
$flag = false;
if (Authorization::getIsTopStaffOrAccountantLogged() && isset($airBookings[0])) {
    $flag = true;
    $c1 = $airBooking->airCart->getTotalCommercialNetEffect();
    $c2 = $airBooking->airCart->getTotalCommission();
    $total = $cartFare + $cartTaxes + $cartServiceFee + $cartFee - $cartDiscount;
    if ($total === 0) {
        $total = 1;     // Fix case when fares are not attached.
    }
}
?>
<div class="ibox float-e-margins">
    <div class="ibox-title text-success">
        <h5><i class="fa fa-user"></i> Cart Price Calculation</h5>

    </div>
    <div class="ibox-content">

        <table class="table table-striped table-bordered table-hover dataTables-example" >
            <tr>
                <th>Base Price</th>
                <td><?php echo $cartFare; ?></td>
                <th>Accounting Price Today (INR)</th>
                <td><?php
                    echo $accountingCurrency;
                    $cartTotalAccountingCurrency = $airBooking->airSource->currency->xChange($cartTotal, $airBooking->airCart->user->userInfo->currency_id);
                    echo ' '.number_format($cartTotalAccountingCurrency);
                    ?></td>

            </tr>
            <tr>
                <th>Airline Taxes and Fare</th>
                <td><?php echo $cartTaxes; ?></td>
                <th>xChange Rate Today (INR)</th>
                <td><?php echo $airSourceCurrency . '/' . $accountingCurrency ?></td>

            </tr>
            <tr>
                <th>Service Tax</th>
                <td><?php echo $cartServiceFee; ?></td>
                <th><?php if ($flag) { ?>Commercial Total<?php } ?></th>
                <td><?php if ($flag) {
                        echo $c1;
                    } ?></td>

            </tr>
            <tr>
                <th>Fee</th>
                <td><?php echo $cartFee; ?></td>
                <th><?php if ($flag) { ?>Commission Total<?php } ?></th>
                <td><?php if ($flag) {
                        echo $c2;
                    } ?></td>

            </tr>
            <tr>
                <th>Discount</th>
                <td><?php echo $cartDiscount; ?></td>
                <th><?php if ($flag) { ?>Total Effect<?php } ?></th>
                <td><?php if ($flag) {
                        echo $c1 + $c2;
                    } ?></td>

            </tr>
            <tr>
                <th>Total Price</th>
                <td><?php
                    echo $airSourceCurrency.' '.number_format($cartTotal);
                    ?></td>
                <th><?php if ($flag) { ?>T.E as Percentage<?php } ?></th>
                <td><?php if ($flag) {
                        echo round(100 * ($c1 + $c2) / $total, 2) . "%";
                    } ?></td>

            </tr>
            <tbody>
        </table>

    </div>
</div>