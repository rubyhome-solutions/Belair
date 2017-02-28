<?php
/* @var $this AirCartController */
/* @var $airBooking AirBooking */
/* @var $airRoute AirRoutes */

$isStaffLogged = Authorization::getIsStaffLogged();
$isTopStaffLogged = Authorization::getIsTopStaffLogged();
$isTopStaffOrAccountantLogged = Authorization::getIsTopStaffOrAccountantLogged();
?>

<tbody <?php echo "ab='$airBooking->id' ar='$airRoute->id'"; ?>>
<form method="POST" onsubmit="document.body.style.cursor = 'wait';">
    <?php
    echo TbHtml::activeHiddenField($airBooking, 'id');
    echo TbHtml::activeHiddenField($airRoute, 'id');
    ?>
    <tr>
        <td rowspan="4" style="white-space: nowrap;">
            <?php
            echo $airBooking->traveler->shortCombinedInfo . "<br>" . $airBooking->travelerType->name;
            echo "<br><br>Cost Centre:<br>" . TbHtml::activeTextField($airBooking, 'cost_center', ['class' => 'inline center form-control', 'style' => 'max-width: 100px;', 'disabled' => !$firstAirRoute]);
            ?>
        </td>
        <td rowspan="4" class="center"><?php echo $airBooking->abStatus->name; ?></td>
        <td class="center" style="font-weight: bold; font-size: 1.2em;color: darkblue;"><?php echo TbHtml::activeTextField($airBooking, 'airline_pnr', ['class' => 'inline form-control capitalize center', 'style' => 'max-width: 180px;', 'disabled' => !$isStaffLogged || !$firstAirRoute, 'maxlength' => '6']); ?></td>
        <td class="center"><?php echo TbHtml::activeTextField($airBooking, 'crs_pnr', ['class' => 'inline capitalize center form-control', 'style' => 'max-width: 90px;', 'disabled' => !$isStaffLogged || !$firstAirRoute, 'maxlength' => '6']); ?></td>
        <td class="center"><?php echo TbHtml::activeTextField($airBooking, 'ticket_number', ['class' => 'inline center form-control', 'style' => 'max-width: 100px;', 'disabled' => !$isStaffLogged || !$firstAirRoute, 'maxlength' => '18']); ?></td>
        <td class="center"><?php echo TbHtml::activeTextField($airBooking, 'booking_class', ['class' => 'inline capitalize center form-control', 'style' => 'max-width: 50px;',  'disabled' => !$isStaffLogged || !$firstAirRoute, 'maxlength' => '1']); ?></td>
        <td class="center"><?php echo TbHtml::activeTextField($airBooking, 'fare_basis', ['class' => 'inline capitalize center form-control', 'style' => 'max-width: 160px;', 'disabled' => !$isStaffLogged || !$firstAirRoute, 'maxlength' => '9']); ?></td>
        <td class="center"><?php echo TbHtml::activeTextField($airBooking, 'cancellation_fee', ['class' => 'inline center form-control', 'style' => 'max-width: 50px;', 'disabled' => !$isStaffLogged || !$firstAirRoute]); ?></td>
        <?php if ($firstAirRoute) { ?>
            <td rowspan="3" class="center"><button type="submit" style="margin-top:5px;" class="btn btn-mini btn-warning">Update</button></td>
        <?php } else {?>
            <td rowspan="3" class="center">Secondary<br>leg</td>
        <?php } ?>
        <td rowspan="3" class="center"><input class="checkbox" type="checkbox"></td>
    </tr>
    <tr>
        <td colspan="2"><span>Source: </span><?php echo TbHtml::activeDropDownList($airBooking, 'air_source_id', CHtml::listData(AirSource::model()->findAll(['order' => 'id']), 'id', 'name'), ['class' => 'inline form-control', 'empty' => 'Select ...', 'disabled' => !$isStaffLogged || !$firstAirRoute]) ?></td>
        <td colspan="1"><span>Cabin: </span><?php echo TbHtml::activeDropDownList($airBooking, 'cabin_type_id', CHtml::listData(CabinType::model()->findAll(['order' => 'id']), 'id', 'name'), ['class' => 'inline form-control', 'empty' => 'Select ...', 'size' => TbHtml::INPUT_SIZE_SMALL, 'disabled' => !$isStaffLogged || !$firstAirRoute || !$firstAirRoute]) ?></td>
        <?php if ($isTopStaffOrAccountantLogged) { ?>
            <td colspan="3" class="center" style="vertical-align: middle"><span>Commission: </span><?php echo TbHtml::activeTextField($airBooking, 'profit', ['class' => 'inline center form-control', 'disabled' => !$firstAirRoute]) ?></td>
        <?php } else { ?>
            <td colspan="3"></td>
        <?php } ?>
    </tr>
    <tr>
        <td>Total MarkUp: <b style="vertical-align: inherit;"><?php echo number_format($airBooking->reseller_markup_base + $airBooking->reseller_markup_fee + $airBooking->reseller_markup_tax, 2); ?></b></td>
          <td>  Basic: <?php echo TbHtml::activeTextField($airBooking, 'reseller_markup_base', ['class' => 'inline center form-control',  'disabled' => !$firstAirRoute]); ?></td>
          <td>  Tax: <?php echo TbHtml::activeTextField($airBooking, 'reseller_markup_tax', ['class' => 'inline center form-control',   'disabled' => !$firstAirRoute]); ?></td>
         <td>   Fee: <?php echo TbHtml::activeTextField($airBooking, 'reseller_markup_fee', ['class' => 'inline center form-control',   'disabled' => !$firstAirRoute]); ?>
        </td>
        <td colspan="2" class="center"><?php
            if ($airBooking->commercial_rule_id && $isTopStaffOrAccountantLogged) {
                $plan = \Yii::app()->db->createCommand("SELECT plan_id FROM commercial_x_rule WHERE rule_id={$airBooking->commercial_rule_id}")->queryRow();
                echo "<a class='btn btn-small btn-info' href='/commercial/update/{$plan['plan_id']}#Rule{$airBooking->commercial_rule_id}' target='_blank'><i class='fa fa-cog'></i>&nbsp;&nbsp;C.N.E. &#8377 $airBooking->commercial_total_efect</a>";
            }
            ?></td>
    </tr>
    <tr>
        <td colspan="8" style="font-size: 0.8em; font-weight: lighter;">
            <?php
            //            \Yii::log($airBooking->reseller_markup_fee);
            echo "Basic: $airBooking->basic_fare, YQ: $airBooking->fuel_surcharge, YR: $airBooking->congestion_charge, UDF: $airBooking->udf_charge, JN: $airBooking->jn_tax, Other: $airBooking->other_tax, OB: $airBooking->passtrough_fee, OC:$airBooking->oc_charge, A.Fee: $airBooking->airport_tax, S.Tax: $airBooking->service_tax, Fee: $airBooking->booking_fee, Gross Discount: $airBooking->commission_or_discount_gross , Tds: $airBooking->tds, Extra Chrg: $airBooking->extraCharges Total: $airBooking->totalAmount, Payment process: " . ($airBooking->payment_process_id ? $airBooking->paymentProcess->name : "Not Set");
            echo "<br>Total Markup: " . ($airBooking->reseller_markup_base + $airBooking->reseller_markup_fee + $airBooking->reseller_markup_tax) . " [Basic: {$airBooking->reseller_markup_base}, Tax: {$airBooking->reseller_markup_tax}, Fee: {$airBooking->reseller_markup_fee}]";
            echo "<br>Meal Pref: " . (empty($airRoute->meal) ? 'Unset' : '<b>' . $airRoute->meal . '</b>') .
            ",  Seat Pref: " . (empty($airRoute->seat) ? 'Unset' : '<b>' . $airRoute->seat . '</b>') .
            ",  Special Req: " . ($airBooking->special_request_id ? $airBooking->specialRequest->name : "Unset");
            echo "<br>Frequent Flier: " . (empty($airBooking->frequent_flyer) ? 'Unset' : '<b>' . $airBooking->frequent_flyer . '</b>') .
            ",  PF Acct: " . (empty($airBooking->private_fare) ? 'Unset' : '<b>' . $airBooking->private_fare . '</b>') .
            ", Tour Code: " . (empty($airBooking->tour_code) ? 'Unset' : '<b>' . $airBooking->tour_code . '</b>') .
            ", Endorsement: " . ($airBooking->endorsment ? '<b>' . $airBooking->endorsment . '</b>' : "Unset");
            ?>
    </tr>
    <tr>
        <td colspan="10"></td>
    </tr>
</form>
</tbody>