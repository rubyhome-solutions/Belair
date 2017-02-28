<?php
/* @var $this AirCartController */
/* @var $airBookings AirBooking[] */
$isTopStaffOrAccountantLogged = Authorization::getIsTopStaffOrAccountantLogged();
$isSuperAdminLoggedIn = Authorization::getIsSuperAdminLogged();
?>

<div style="clear: both;">

    <?php
    $amendments = [];
    $all_travlers = [];
    if (isset($airBookings[0])) {
        $amendments = Yii::app()->db->createCommand('
        Select sum(amount_to_charge) as amount_to_charge , sum(amendment.reseller_amendment_fee) as reseller_amendment_fee
        From amendment
        JOIN air_booking on (air_booking.id = amendment.air_booking_id)
        WHERE air_booking.air_cart_id = ' . $airBookings[0]->air_cart_id . ' and 
        payment_status_id=' . \PaymentStatus::STATUS_CHARGED . ' AND amendment_status_id=' . \AmendmentStatus::STATUS_SUCCESS
                )->queryAll();

        //\Utils::dbgYiiLog($amendments);

        if ($isSuperAdminLoggedIn) {
            $all_travlers = Yii::app()->db->createCommand("
        SELECT traveler.id,traveler.first_name,traveler.last_name,traveler_title.name as title
        FROM traveler 
        inner join traveler_title ON (traveler.traveler_title_id = traveler_title.id)  
        WHERE user_info_id={$airBookings[0]->traveler->user_info_id}"
                    )->queryAll();
        }
    }

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

        echo "<p class='well well-small alert-info'>&nbsp;<i class='fa fa-plane fa-lg'></i> &nbsp;{$airBooking->serviceType->name}:&nbsp; {$airBooking->source->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " <i class='fa fa-long-arrow-right fa-lg'></i> {$airBooking->destination->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . "</p>";
        $this->renderPartial('_viewairroutes', ['airRoutes' => $airBooking->airRoutes]);
        ?>
        <table class="table table-bordered table-condensed" style="max-width: 95%;">
            <tr style="text-align: center;" >
                <!--<th>Leading airline</th>-->
                <th>Passenger</th>
                <th>CRS PNR</th>
                <th>Air PNR</th>
                <th>E-ticket</th>
                <th>Class</th>
                <th>Cabin</th>
                <th>Fare</th>
                <th>B.Fare</th>
                <th>Taxes</th>
                <th>Total</th>
                <th>Status</th>
                <th>Air Source</th>
                <?php if ($isTopStaffOrAccountantLogged) { ?>
                    <th>Commercial Rule</th>
                <?php } ?>
                <?php if($isSuperAdminLoggedIn){ ?> 
                    <th>Action</th>
                <?php } ?>    
            </tr>
            <?php
            $this->renderPartial('_airbookingrow', ['airBooking' => $airBooking , 'allTravelers' => $all_travlers]);
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
                $this->renderPartial('_airbookingrow', ['airBooking' => $value,'allTravelers' => $all_travlers]);
                $processedBookings[] = $value->id;
                $cartFare += $value->basic_fare + $value->reseller_markup_base;
                $cartTaxes += $value->taxesOnly;
                $cartServiceFee += $value->service_tax + $value->jn_tax + $value->reseller_markup_tax;
                $cartFee += $value->booking_fee + $value->reseller_markup_fee;
                $cartDiscount += $value->commission_or_discount_gross;
            }
            ?>
        </table>
        <?php
    }
    if (!empty($airBookings)) {     // Skip that if there is no bookings
        ?>
        <hr>
        <p class='well-small alert-info'>&nbsp;&nbsp;<i class='fa fa-money fa-lg'></i>&nbsp;&nbsp; Cart Price Calculation</p>
        <table class="table table-bordered table-condensed" style="max-width: 300px; float: left;">
            <tr><td class="heading">Base Price</td><td class="right"><?php echo $cartFare; ?></td></tr>
            <tr><td class="heading">Airline Taxes and Fees</td><td class="right"><?php echo $cartTaxes; ?></td></tr>
            <tr><td class="heading">Service Tax</td><td class="right"><?php echo $cartServiceFee; ?></td></tr>
            <tr><td class="heading">Fee</td><td class="right"><?php echo $cartFee; ?></td></tr>
            <tr><td class="heading">Other</td><td class="right"><?php echo $model->convenienceFee; ?></td></tr>
            <tr><td class="heading">Discount</td><td class="right"><?php echo $cartDiscount; ?></td></tr>
            <tr><td class="heading">Promo Code Discount</td><td class="right"><?php echo $airBooking->airCart->getPromoDiscount(); ?></td></tr>
            <tr><td class="heading">Total Price (<?php
                    $airSourceCurrency = $airBooking->airSource->currency->code;
                    $accountingCurrency = $airBooking->airCart->user->userInfo->currency->code;
                    echo $airSourceCurrency;
                    ?>)</td><td class="right">
                    <?php
                    $cartTotal = $cartFare + $cartTaxes + $cartServiceFee + $cartFee + $model->convenienceFee - $cartDiscount - $airBooking->airCart->getPromoDiscount();
                    echo number_format($cartTotal);
                    ?>
                </td></tr>
            <tr><td class="heading">Accounting Price today (<?php echo $accountingCurrency; ?>)</td><td class="right">
                    <?php
                    $cartTotalAccountingCurrency = $airBooking->airSource->currency->xChange($cartTotal, $airBooking->airCart->user->userInfo->currency_id);
                    echo number_format($cartTotalAccountingCurrency);
                    ?>
                </td></tr>
            <tr><td class="heading">Total Amendment</td><td class="right"><?php
                    if (count($amendments) > 0) {
                        echo $amendments[0]['amount_to_charge'];
                    } else {
                        echo '0';
                    }
                    ?></td></tr>

            <tr><td class="heading">xChange rate today (<?php echo $airSourceCurrency . '/' . $accountingCurrency ?>)</td><td class="right"><?php echo round($cartTotal / ($cartTotalAccountingCurrency != 0 ? $cartTotalAccountingCurrency : 1), 4); ?></td></tr>
        </table>
        <?php
        if (Authorization::getIsTopStaffOrAccountantLogged() && isset($airBookings[0])) {
            $this->renderPartial('_commercial_summary', [
                'airCart' => $airBooking->airCart,
                'total' => $cartFare + $cartTaxes + $cartServiceFee + $cartFee + $model->convenienceFee - $cartDiscount - $airBooking->airCart->getPromoDiscount(),
                'amendments' => $amendments
            ]);
        }
    }
    ?>

</div>
<div class="clearfix"></div>