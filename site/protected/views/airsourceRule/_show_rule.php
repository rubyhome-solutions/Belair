<?php
/* @var $this AirsourceRuleController */
/* @var $rule AirsourceRule */

echo TbHtml::form("/airsourceRule/saveRule");
echo TbHtml::activeHiddenField($rule, 'id');
$filter = new \AirSourceFilter($rule->filter);
?>
<table id="Rule<?php echo $rule->id; ?>" class="table table-bordered table-condensed" style="max-width: 90%;">
    <tr class="heading">
        <th style="width:160px;">Rule: <b><?php echo $rule->id; ?></b></th>
        <th style="width:160px;">Actions</th>
        <th>Select list of the Air Sources</th>
    </tr>
    <?php
    if ($rule->id == $ruleId && $errMsg) {
        ?>
        <tr>
            <td colspan="3">
                <?php echo TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, $errStr); ?>
            </td>
        </tr>
        <?php
    }
    ?>
    <tr>
        <td style="vertical-align: top;" class="sinkavo">
            <p style="margin-top: 20%;"><b>Priority</b></p>
            <?php
            echo TbHtml::activeDropDownList($rule, 'order_', [1 => 1, 2 => 2, 3 => 3, 4 => 4, 5 => 5, 6 => 6, 7 => 7, 8 => 8, 9 => 9], [
                'size' => TbHtml::INPUT_SIZE_MINI,
            ]);
            ?>
        </td>
        <td class="center sinkavo" style="vertical-align: top;">
            <?php
            echo TbHtml::submitButton('<i class="fa fa-cloud-upload fa-lg"></i>&nbsp&nbspSave', [
                'color' => TbHtml::BUTTON_COLOR_SUCCESS,
                'style' => 'margin-top:25%;',
            ]) . "<br>";
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
            echo TbHtml::ajaxButton('<i class="fa fa-trash-o fa-lg"></i>&nbsp&nbspDelete', '/airsourceRule/delete/' . $rule->id, [
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
        <td style="text-align: left;" class="sinkavo">
            <div style="max-height:350px;overflow-y:scroll;margin-left:20%;display:inline-flex;">
                <?php
                echo TbHtml::checkBoxList('AirsourceRule[air_source_ids]', \AirsourceRule::unGroupIds($rule->air_source_ids), $airSourceList);
                ?>
            </div>
        </td>
    </tr>
    <tr>
        <th rowspan="2" class="heading" style="vertical-align: top;">
            <button class="btn btn-warning" onclick="$(this.parentElement.parentElement.nextElementSibling).toggle();
                    this.blur();
                    return false;">
                <i class="icon-eye-open icon-white"></i>&nbsp;&nbsp;Filter
            </button>
        </th>
        <td colspan="2"><?php echo $filter->getSummary(); ?></td>
    </tr>
    <tr style="display: none;">
        <td colspan="2"><?php $this->renderPartial('/airsourceRule/_filter_table', ['filter' => $filter, 'rule_id'=>$rule->id]); ?></td>
    </tr>
</table>
<?php
echo TbHtml::endForm();
