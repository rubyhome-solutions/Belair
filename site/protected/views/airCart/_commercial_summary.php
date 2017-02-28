<?php
/* @var $this AirCartController */
/* @var $airCart AirCart */
$c1 = $airCart->getTotalCommercialNetEffect() - $airCart->promoDiscount;
$c2 = $airCart->getTotalCommission();
$c3 = -1 * (double) $airCart->getCostOnCS();
$c4 = -1 * (double) $airCart->getCostOnPG() + $airCart->convenienceFee;
$c5 = (double) $airCart->getProfitOnGDSLCC();
if ($total === 0) {
    $total = 1;     // Fix case when fares are not attached.
}
$amendment_fee = 0;
foreach ($airCart->airBookings as $booking) {
    foreach ($booking->amendments as $amendment) {
        if ($amendment->amendment_status_id !== AmendmentStatus::STATUS_CANCELLED) {
            $amendment_fee+=$amendment->reseller_amendment_fee;
        }
        if ($booking->ab_status_id !== \AbStatus::STATUS_CANCELLED) {
            $c1 -= $amendment->reseller_amendment_fee;
        }
    }
}

if ($airCart->booking_status_id == \BookingStatus::STATUS_CANCELLED) {
    $c1 = 0;
    $c2 = 0;
    $c5 = 0;
}
?>

<table class="table table-bordered table-condensed noprint" style="max-width: 300px; float: left; margin-left: 15px;">
    <tr><td class="heading">Commercial total</td><td style="text-align: right"><?php echo $c1; ?></td></tr>
    <tr><td class="heading">Commission total</td><td style="text-align: right"><?php echo $c2; ?></td></tr>
    <?php if (\Authorization::getIsSuperAdminLogged()) { ?>
        <tr><td class="heading">Cost on Client Source</td><td style="text-align: right"><?php echo $c3; ?></td></tr>
        <tr><td class="heading">Cost on Payment Gateway</td><td style="text-align: right"><?php echo $c4; ?></td></tr>
        <tr><td class="heading">Profit on GDS/LCC</td><td style="text-align: right"><?php echo $c5; ?></td></tr>
        <?php if ($amendment_fee > 0) { ?>
            <tr><td class="heading">Amendment Service Fee</td><td style="text-align: right"><?php echo $amendment_fee; ?></td></tr>
        <?php } ?>
        <tr><td class="heading">Total effect</td><td style="text-align: right"><?php echo $c1 + $c2 + $c3 + $c4 + $c5 + $amendment_fee; ?></td></tr>
        <tr><td class="heading">T.E. as percentage</td><td style="text-align: right"><?php echo round(100 * ($c1 + $c2 + $c3 + $c4 + $c5 + $amendment_fee) / $total, 2) . "%"; ?></td></tr>

    <?php } ?>
</table>
