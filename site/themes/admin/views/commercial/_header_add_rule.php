<?php
/* @var $this CommercialController */
/* @var $plan CommercialPlan */
/* @var $form TbActiveForm */
?>

<table class="table table-bordered table-condensed sinkavo " >

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
        'id' => 'add-rule',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'action' => $this->createUrl('addRule', ['id' => $plan->id]),
        'htmlOptions' => ['style' => 'margin:0px;']
    ]);
    ?>
    <tr>
        <th>Airline</th>
        <th>AirSource</th>
        <th>TravelType</th>
        <th>ClientSource</th>
        <th>Actions</th>
    </tr>
    <tr>
        <td>
<?php
echo TbHtml::dropDownList('carrier_id', \Yii::app()->session->get('rule_filter_carrier_id'), $airlineList, [
    'prompt' => 'DEFAULT',
//            'class' => 'input-small',
    'style' => 'margin-bottom:0;'
]);
?>
        </td>
        <td>
<?php
echo TbHtml::dropDownList('air_source_id', \Yii::app()->session->get('rule_filter_air_source_id'), $airSourceList, [
    'prompt' => 'DEFAULT',
//            'class' => 'input-medium',
    'style' => 'margin-bottom:0;',
]);
?>
        </td>
        <td>
<?php
echo TbHtml::dropDownList('service_type_id', \Yii::app()->session->get('rule_filter_service_type_id'), \ServiceType::$airTypes, [
    'prompt' => 'Any',
    'class' => 'input-medium',
    'style' => 'margin-bottom:0;',
]);
?>
        </td>
        <td>
<?php
echo TbHtml::dropDownList('client_source_id', \Yii::app()->session->get('rule_filter_client_source_id'), $clientSourceList, [
    'prompt' => 'Any',
    'class' => 'input-medium',
    'style' => 'margin-bottom:0;',
]);
?>
        </td>
        <td>
<?php
echo TbHtml::submitButton('<i class="fa fa-filter fa-lg"></i>&nbsp&nbspFilter', [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'style' => 'margin-left: 10px;',
    'name' => 'ruleFilter',
    'value' => 1
]);
echo TbHtml::submitButton('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp&nbspAdd rule', [
    'color' => TbHtml::BUTTON_COLOR_WARNING,
    'style' => 'margin-left: 10px;'
]);
$this->endWidget();
?>
        </td>
    </tr>

</table><!-- form -->
<style>
</style>
