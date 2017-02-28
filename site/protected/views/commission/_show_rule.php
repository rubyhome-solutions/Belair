<?php
/* @var $this CommissionController */
/* @var $rule CommissionRule */

echo TbHtml::form("/commission/saveRule");
echo TbHtml::activeHiddenField($rule, 'id');
$filter = new \CommercialFilter($rule->filter);
?>
<table id="Rule<?php echo $rule->id; ?>" class="table table-bordered table-condensed" style="max-width: 90%;">
    <tr class="heading">
        <th>Rule: <b><?php echo $rule->id; ?></b><br>Carrier / AirSource</th>
        <th>Actions</th>
        <th>TravelType / Priority</th>
        <th>Type</th>
        <th>Base</th>
        <th>YQ</th>
        <th>Per Airline Per Pax</th>
    </tr>
    <?php
    if ($rule->id == $ruleId && $errMsg) {
        ?>
        <tr>
            <td colspan="7">
                <?php echo TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, $errStr); ?>
            </td>
        </tr>
        <?php
    }
    ?>
    <tr>
        <td rowspan="3" style="vertical-align: top;" class="sinkavo">
            <?php
            echo TbHtml::activeDropDownList($rule, 'carrier_id', $airlineList, ['prompt' => 'DEFAULT', 'class' => 'input-medium']);
            echo "<br>";
            echo TbHtml::activeDropDownList($rule, 'air_source_id', $airSourceList, ['prompt' => 'DEFAULT', 'class' => 'input-medium']);
            ?>
        </td>
        <td rowspan="3" class="center sinkavo" style="vertical-align: top;">
            <?php
            echo TbHtml::submitButton('<i class="fa fa-cloud-upload fa-lg"></i>&nbsp&nbspSave', ['color' => TbHtml::BUTTON_COLOR_SUCCESS]) . "<br>";
            echo TbHtml::submitButton('<i class="fa fa-cogs fa-lg"></i>&nbsp&nbspTest', [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'name' => 'testRule',
                'value' => 1,
                'style' => 'margin-top: 5px;',
            ]) . "<br>";
            echo TbHtml::submitButton('<i class="fa fa-copy fa-lg"></i>&nbsp&nbspCopy', [
                'color' => TbHtml::BUTTON_COLOR_INFO,
                'name' => 'copyRule',
                'value' => 1,
                'style' => 'margin-top: 5px;',
            ]) . "<br>";
            echo TbHtml::ajaxButton('<i class="fa fa-trash-o fa-lg"></i>&nbsp&nbspDelete', '/commission/delete/' . $rule->id, [
                'type' => 'POST',
                'success' => 'js:function(){ $("#Rule' . $rule->id . '").remove(); }',                
                    ], [
                'confirm' => "This will delete the rule.\nAre you sure?",
                'style' => 'margin-top: 5px;',
                'color' => TbHtml::BUTTON_COLOR_DANGER
                    ]
            );
            ?>
        </td>
        <td rowspan="3" style="vertical-align: top;" class="sinkavo">
            <?php
            echo TbHtml::activeDropDownList($rule, 'service_type_id', \ServiceType::$airTypes, ['prompt' => 'DEFAULT', 'size' => TbHtml::INPUT_SIZE_MEDIUM]);
            echo "<br>";
            echo TbHtml::activeDropDownList($rule, 'order_', [1 => 1, 2 => 2, 3 => 3, 4 => 4, 5 => 5, 6 => 6, 7 => 7, 8 => 8, 9 => 9], ['size' => TbHtml::INPUT_SIZE_MINI]);
            ?>
        </td>
        <td class="sinkavo">IATA</td>
        <td><?php echo TbHtml::activeTextField($rule, 'iata_rate_base', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'iata_rate_yq', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td rowspan="2"></td>
    </tr>
    <tr>
        <td class="sinkavo">PLB</td>
        <td><?php echo TbHtml::activeTextField($rule, 'plb_rate_base', ['append' => '%', 'class' => 'input-mini']); ?></td>
        <td><?php echo TbHtml::activeTextField($rule, 'plb_rate_yq', ['append' => '%', 'class' => 'input-mini']); ?></td>
    </tr>
    <tr>
        <td class="sinkavo">Fixed</td>
        <td colspan="2" style="text-align: center"><?php echo TbHtml::activeTextField($rule, 'fix', ['prepend' => 'Rs. &#8377;', 'class' => 'input-mini']); ?></td>
        <td class="center"><?php echo TbHtml::activeCheckBox($rule, 'fix_per_journey'); ?></td>
    </tr>
    <tr>
        <th rowspan="2" class="heading" style="vertical-align: top;">
            <button class="btn btn-warning" onclick="$(this.parentElement.parentElement.nextElementSibling).toggle();
                    this.blur();
                    return false;">
                <i class="icon-eye-open icon-white"></i>&nbsp;&nbsp;Filter
            </button>
        </th>
        <td colspan="6"><?php echo $filter->getSummary(); ?></td>
    </tr>
    <tr style="display: none;">
        <td colspan="6"><?php $this->renderPartial('/commercial/_filter_table', ['filter' => $filter, 'rule_id'=>$rule->id]); ?></td>
    </tr>
</table>
<?php echo TbHtml::endForm(); ?>