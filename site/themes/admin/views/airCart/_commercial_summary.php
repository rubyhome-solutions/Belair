<?php
/* @var $this AirCartController */
/* @var $airCart AirCart */
$c1 = $airCart->getTotalCommercialNetEffect();
$c2 = $airCart->getTotalCommission();
if ($total === 0) {
    $total = 1;     // Fix case when fares are not attached.
}
?>

<table class="table table-bordered table-condensed noprint" style="max-width: 300px; float: left; margin-left: 15px;">
    <tr><td class="heading">Commercial total</td><td style="text-align: right"><?php echo $c1; ?></td></tr>
    <tr><td class="heading">Commission total</td><td style="text-align: right"><?php echo $c2; ?></td></tr>
    <tr><td class="heading">Total effect</td><td style="text-align: right"><?php echo $c1 + $c2; ?></td></tr>
    <tr><td class="heading">T.E. as percentage</td><td style="text-align: right"><?php echo round(100*($c1+$c2)/$total, 2) . "%"; ?></td></tr>
</table>
