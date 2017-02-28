<?php
$airlineId = $model->id;
$model = new \TicketCardsRulesInfo;
$model->unsetAttributes();

$model->ticket_rules_cards_id = $airlineId;
if (isset($_GET['TicketCardsRulesInfo']['ticket_cards_info_id'])) {
    $model->ticket_cards_info_id = $_GET['TicketCardsRulesInfo']['ticket_cards_info_id'];
}

$listCards = \TicketCardsInfo::model()->findAll(array('condition' => 'status=:status', 'params' => array('status' => \TicketCardsInfo::CARD_ACTIVE)));
$selectedArr = array();
$selected = $model->rule_days;
$daysArr = \TicketCardsRulesInfo::$daysArr;
foreach ($daysArr as $key => $val) {
    if ($key & $selected) {
        $selectedArr[] = $key;
    }
}
$listCardArr = array();
foreach ($listCards as $key => $value) {
    $listCardArr[$value->id] = $value->card_no . " (" . $value->card_type . ")";
}

Yii::import('ext.ajax-input-column.AjaxInputColumn');
Yii::import('ext.ajax-select-column.AjaxSelectColumn');
Yii::import('ext.ajax-checkboxlist-column.AjaxCheckboxList');

$htmlOptions = array('template' => '{input}{label}', 'separator' => '', 'baseID' => 'rule_days', 'class' => 'in-checkbox', 'onchange' => 'js:selectDays(this)', 'multiple' => true, 'checked' => 'checked');
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'commission-cs-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    //'selectableRows' => 1,
    'htmlOptions' => [
        'style' => 'margin-left:0; width: 1075px;'
    ],
    'columns' => [
        [
            'name' => 'ticket_cards_info_id',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameCSType"),
            'value' => '$data->ticketCardsInfo->card_no." (".$data->ticketCardsInfo->card_type.")"',
            'headerHtmlOptions' => ['style' => 'width: 100px;'],
            'filter' => $listCardArr,
            'footer' => TbHtml::activeDropDownList($model, 'ticket_cards_info_id', $listCardArr, ['id' => 'PF_ticket_cards_info_id']),
            'selectOptions' => $listCardArr,
        ],
        [
            'name' => 'priority',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameCSType"),
            'headerHtmlOptions' => ['style' => 'width: 100px;'],
            'filter' => false,
            'footer' => TbHtml::activeTextField($model, 'priority', ['id' => 'PF_priority']),
        ],
        [
            'name' => 'rule_days',
            'class' => 'AjaxCheckboxList',
            'id' => 'rule_days1',
            'url' => $this->createUrl("renameCSType"),
            'footer' => TbHtml::checkBoxList('rule_days', $selectedArr, $daysArr, $htmlOptions),
            'filter' => false,
            'headerHtmlOptions' => ['style' => 'width: 300px;'],
            'selectOptions' => $daysArr,
        ],
        [
            'name' => 'remarks',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameCSType"),
            'headerHtmlOptions' => ['style' => 'width: 200px;'],
            'filter' => false,
            'footer' => TbHtml::activeTextField($model, 'remarks', ['id' => 'PF_remarks']),
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/ticketRulesCards/ruleDelete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add New', $this->createUrl("ticketRulesCards/ruleCreate"), [
                'success' => 'function(error){ '
                . '  if (!error) { '
                . '    $.fn.yiiGridView.update("commission-cs-grid"); '
                . '  } else {'
                . '    alert(error);'
                . '  } '
                . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'PF[ticket_rules_cards_id]' => $airlineId,
                    'PF[ticket_cards_info_id]' => 'js:$("#PF_ticket_cards_info_id").val()',
                    'PF[priority]' => 'js:$("#PF_priority").val()',
                    'PF[remarks]' => 'js:$("#PF_remarks").val()',
                    'PF[rule_days]' => 'js:getSelectedDays()',
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'white-space:nowrap; margin-top:15px;margin-bottom:20px;',
                'encode' => false,
                'id' => 'newRecordBtn'
            ])
        ],
    ],
]);
?>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    select.ajax-select-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important; width: 80%}
    input {width: inherit;}
    /* select {width: 97%;} */
</style>
<style>
    .in-checkbox {   
        float:right; 
    }
    label { width: 78px; float:left; display: inline;}
    .chk-chk{
        width:100px; float:left;
    }
    .chk-chk input{
        float:left;
        margin-right: 8px;
    }

    .chk-chk label{
        float:left;
    }

</style>
<script type="text/javascript">
    function selectDays(Obj)
    {


        if ($(Obj).prop('checked') == true && $(Obj).val() == 256) {
            //unchecked all checkbox
            $("#rule_days").find(".in-checkbox").each(function () {
                $(this).prop('checked', "");
            });
            //checked all type chekbox
            $(Obj).prop('checked', "checked");
        } else {
            $("#rule_days").find(".in-checkbox").each(function () {
                if ($(this).val() == 256) {
                    $(this).prop('checked', "");
                }

            });

        }

    }

    function getSelectedDays()
    {
        var selectedDays = new Array();
        //unchecked all checkbox
        $("#rule_days").find('.in-checkbox').each(function () {
            if ($(this).prop('checked') == true) {
                selectedDays.push($(this).val());
            }
        });

        return selectedDays;
    }
</script>
