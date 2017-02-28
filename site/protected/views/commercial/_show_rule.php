<?php
/* @var $this CommercialController */
/* @var $rule CommercialRule */

echo TbHtml::form("/commercial/saveRule/$planId");
echo TbHtml::activeHiddenField($rule, 'id');
$filter = new \CommercialFilter($rule->filter);
?>
<table id="Rule<?php echo $rule->id; ?>" class="table table-bordered table-condensed">
    <tr class="heading">
        <th>Rule: <b><?php echo $rule->id; ?></b><br>Carrier / AirSource</th>
        <th>Priority</th>
        <th>TravelType<br>ClientSource</th>
        <th>Commercial Category</th>
        <th>Total</th>
        <th>Base</th>
        <th>YQ</th>
        <th>Per Airline Per Pax</th>
    </tr>
    <?php
    if ($rule->id == $ruleId && $errMsg) {
        ?>
        <tr>
            <td colspan="8">
                <?php echo TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, $errStr); ?>
            </td>
        </tr>
        <?php
    }
    ?>
    <tr>
        <td rowspan="9" style="vertical-align: top;" class="sinkavo">
            <?php
            echo TbHtml::activeDropDownList($rule, 'carrier_id', $airlineList, ['prompt' => 'DEFAULT', 'class' => 'input-medium']);
            echo "<br><br>";
            echo TbHtml::activeDropDownList($rule, 'air_source_id', $airSourceList, ['prompt' => 'DEFAULT', 'class' => 'input-medium']);
            ?>
        </td>
        <td rowspan="9" class="center sinkavo" style="vertical-align: top;">
            <?php
            echo TbHtml::activeDropDownList($rule, 'order_', [1 => 1, 2 => 2, 3 => 3, 4 => 4, 5 => 5, 6 => 6, 7 => 7, 8 => 8, 9 => 9], ['size' => TbHtml::INPUT_SIZE_MINI]) . "<br><br>";
            echo TbHtml::submitButton('<i class="fa fa-cloud-upload fa-lg"></i>&nbsp&nbspSave', ['color' => TbHtml::BUTTON_COLOR_SUCCESS]) . "<br><br>";
            echo TbHtml::submitButton('<i class="fa fa-cogs fa-lg"></i>&nbsp&nbspTest', [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'name' => 'testRule',
                'value' => 1,
            ]) . "<br><br>";
            echo TbHtml::submitButton('<i class="fa fa-copy fa-lg"></i>&nbsp&nbspCopy', [
                'color' => TbHtml::BUTTON_COLOR_INFO,
                'name' => 'copyRule',
                'value' => 1,
            ]) . "<br><br>";
            echo TbHtml::ajaxButton('<i class="fa fa-trash-o fa-lg"></i>&nbsp&nbspDelete', '/commercial/deleteRule', [
                'type' => 'POST',
                'success' => 'js:function(){ $("#Rule' . $rule->id . '").remove(); }',
                'data' => ['id' => $planId, 'ruleId' => $rule->id]
                    ], [
                'confirm' => "This will delete the rule.\nAre you sure?",
                'color' => TbHtml::BUTTON_COLOR_DANGER
                    ]
            );
            ?>
        </td>
        <td rowspan="9" style="vertical-align: top;" class="sinkavo">
            <?php
            echo TbHtml::activeDropDownList($rule, 'service_type_id', \ServiceType::$airTypes, ['size' => TbHtml::INPUT_SIZE_MEDIUM]);
            echo "<br><br>";
            echo TbHtml::activeDropDownList($rule, 'client_source_id', $clientSourceList, ['class' => 'input-medium']);
            ?>
        </td>
        <td class="sinkavo">IATA</td>
        <td><?php echo TbHtml::activeTextField($rule, 'iata_rate_total', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'iata_rate_base', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'iata_rate_yq', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td rowspan="3"></td>
    </tr>
    <tr>
        <td class="sinkavo">PLB</td>
        <td><?php echo TbHtml::activeTextField($rule, 'plb_rate_total', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'plb_rate_base', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'plb_rate_yq', ['append' => '%', 'class' => 'input-mini']); ?></td>
    </tr>
    <tr>
        <td class="sinkavo">Booking fee rate</td>
        <td><?php echo TbHtml::activeTextField($rule, 'book_rate_total', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'book_rate_base', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'book_rate_yq', ['append' => '%', 'class' => 'input-mini']); ?></td>
    </tr>
    <tr>
        <td class="sinkavo">Fixed booking fee</td>
        <td><?php echo TbHtml::activeTextField($rule, 'book_fix_adult', ['prepend' => 'Adult &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'book_fix_child', ['prepend' => 'Child &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'book_fix_infant', ['prepend' => 'Infant &#8377;', 'class' => 'input-mini']); ?></td>
        <td class="center"><?php echo TbHtml::activeCheckBox($rule, 'book_fix_per_journey'); ?></td>
    </tr>
    <tr>
        <td class="sinkavo">Cancellation Fee</td>
        <td><?php echo TbHtml::activeTextField($rule, 'cancel_fix_adult', ['prepend' => 'Adult &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'cancel_fix_child', ['prepend' => 'Child &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'cancel_fix_infant', ['prepend' => 'Infant &#8377;', 'class' => 'input-mini']); ?></td>
        <td class="center"><?php echo TbHtml::activeCheckBox($rule, 'cancel_fix_per_journey'); ?></td>
    </tr>
    <tr>
        <td class="sinkavo">Reschedule fee</td>
        <td><?php echo TbHtml::activeTextField($rule, 'reschedule_fix_adult', ['prepend' => 'Adult &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'reschedule_fix_child', ['prepend' => 'Child &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'reschedule_fix_infant', ['prepend' => 'Infant &#8377;', 'class' => 'input-mini']); ?></td>
        <td class="center"><?php echo TbHtml::activeCheckBox($rule, 'reschedule_fix_per_journey'); ?></td>
    </tr>
    <tr>
        <td class="sinkavo">Markup rate</td>
        <td><?php echo TbHtml::activeTextField($rule, 'markup_rate_total', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'markup_rate_base', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td colspan="2">
            <?php 
            echo TbHtml::activeTextField($rule, 'markup_rate_yq', ['append' => '%', 'class' => 'input-mini']); 
            echo '<span class="label label-info" style="margin-left:15px">Added to: </span>';
            echo TbHtml::activeDropDownList($rule, 'markup_added_to', \CommercialRule::$markupAddedTo, ['size' => TbHtml::INPUT_SIZE_SMALL, 'style'=>'margin-bottom:0']);
            ?>
        </td>
        
    </tr>
    <tr>
        <td class="sinkavo">Fixed markup fee</td>
        <td><?php echo TbHtml::activeTextField($rule, 'markup_fix_adult', ['prepend' => 'Adult &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'markup_fix_child', ['prepend' => 'Child &#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'markup_fix_infant', ['prepend' => 'Infant &#8377;', 'class' => 'input-mini']); ?></td>
        <td class="center"><?php echo TbHtml::activeCheckBox($rule, 'markup_fix_per_journey'); ?></td>
    </tr> 
    <tr>
        <td class="sinkavo">Booking Fee</td>
        <td><?php echo TbHtml::activeTextField($rule, 'booking_fee_fix', ['prepend' => '&#8377;', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'booking_fee_perc', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td class="center"><?php echo ''; ?></td>
        <td class="center"><?php echo TbHtml::activeCheckBox($rule, 'booking_fee_per_passenger'); ?></td>
    </tr>
    <tr>
        <th rowspan="2" class="heading" style="vertical-align: top;">
            <button class="btn btn-warning" onclick="$(this.parentElement.parentElement.nextElementSibling).toggle();
                    $(this.parentElement.parentElement.nextElementSibling.nextElementSibling).toggle();
                    this.blur();
                    return false;">
                <i class="icon-eye-open icon-white"></i>&nbsp;&nbsp;Filter
            </button>
        </th>
        <td colspan="7"><?php echo $filter->getSummary(); ?></td>
    </tr>
    <tr style="display: none;">
        <td colspan="7"><?php $this->renderPartial('/commercial/_filter_table', ['filter' => $filter, 'rule_id'=>$rule->id]); ?></td>
    </tr>
    <tr>
    </tr>
    <tr>
        <th rowspan="2" class="heading" style="vertical-align: top;">
            <button class="btn btn-warning" onclick="$(this.parentElement.parentElement.nextElementSibling).toggle();
                    $(this.parentElement.parentElement.nextElementSibling.nextElementSibling).toggle();
                    this.blur();
                    return false;">
                <i class="icon-eye-open icon-white"></i>&nbsp;&nbsp;C-Fee
            </button>
        </th>
        <td colspan="7"></td>
    </tr>
    
    <tr style="display: none;">
        <td colspan="7"><?php $this->renderPartial('/commercial/_pymt_conv_fee_grid', ['rule' => $rule]); ?></td>
    </tr>
    <tr>
    </tr>
</table>
<?php echo TbHtml::endForm(); ?>