<?php
/* @var $this AirCartController */
/* @var $airBookings AirBooking[] */
/* @var $airRoute AirRoutes */
$basic = 0;
$aTax = 0;
$otherTax = 0;
$jnTax = 0;
$paxTax = 0;
$fee = 0;
$extrChrg = 0;
$discount = 0;
$markup = 0;

   foreach ($airBookings as $airBooking) {
//    Yii::log(print_r($airBooking->attributes, true));
    $basic += $airBooking->basic_fare;

    $aTax += $airBooking->airport_tax + $airBooking->fuel_surcharge;
    $otherTax += $airBooking->other_tax;
    $jnTax += $airBooking->jn_tax;
    $paxTax += $airBooking->udf_charge;
    $fee += $airBooking->booking_fee;
    $extrChrg += $airBooking->extraCharges;
    $markup += $airBooking->reseller_markup_base + $airBooking->reseller_markup_fee + $airBooking->reseller_markup_tax;
    $discount += $airBooking->commission_or_discount_gross;
}
$total = $basic + $aTax + $otherTax + $fee + $extrChrg - $discount + $markup + $jnTax + $paxTax;
?>
<table class="table table-bordered table-condensed table-hover" style="max-width: 95%; margin-top: -20px;">
    <tr>
        <th>Base</th>
        <th>YQ</th>
        <th>JN</th>
        <th>UDF+PSF</th>
        <th>Other</th>
        <th>Fee</th>
        <th>Extra Charges</th>
        <th>Total Markup</th>
        <th>Discount</th>
        <th>Total</th>
    </tr>
    <tr>
        <td class="center"><?php echo $basic; ?></td>
        <td class="center"><?php echo $aTax; ?></td>
        <td class="center"><?php echo $jnTax; ?></td>
        <td class="center"><?php echo $paxTax; ?></td>
        <td class="center"><?php echo $otherTax; ?></td>
        <td class="center"><?php echo $fee; ?></td>
        <td class="center"><?php echo $extrChrg; ?></td>
        <td class="center"><?php echo $markup; ?></td>
        <td class="center"><?php echo $discount; ?></td>
        <td class="center"><?php echo number_format($total); ?></td>
        </tr>
</table>