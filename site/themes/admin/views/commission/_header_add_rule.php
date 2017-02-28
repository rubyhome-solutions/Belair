<?php
/* @var $this CommissionController */
/* @var $form TbActiveForm */
?>

<table class="table table-bordered table-condensed sinkavo " >

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
        'id' => 'add-commission',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'action' => $this->createUrl('addRule'),
        'htmlOptions' => ['style' => 'margin:0px;']
    ]);
    ?>
    <tr>
        <th>Airline</th>
        <th>AirSource</th>
        <th>TravelType</th>
        <th>Actions</th>
    </tr>
    <tr>
        <td>
<?php
echo TbHtml::dropDownList('carrier_id', \Yii::app()->session->get('commission_filter_carrier_id'), $airlineList, [
    'prompt' => 'DEFAULT',
//            'class' => 'input-small',
    'style' => 'margin-bottom:0;'
]);
?>
        </td>
        <td>
<?php
echo TbHtml::dropDownList('air_source_id', \Yii::app()->session->get('commission_filter_air_source_id'), $airSourceList, [
    'prompt' => 'DEFAULT',
//            'class' => 'input-medium',
    'style' => 'margin-bottom:0;',
]);
?>
        </td>
        <td>
<?php
echo TbHtml::dropDownList('service_type_id', \Yii::app()->session->get('commission_filter_service_type_id'), \ServiceType::$airTypes, [
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
    'style' => 'margin-left: 8%;',
    'name' => 'ruleFilter',
    'value' => 1
]);
echo TbHtml::submitButton('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp&nbspAdd rule', [
    'color' => TbHtml::BUTTON_COLOR_WARNING,
    'style' => 'margin-left: 8%;'
]);
$this->endWidget();
?>
        </td>
    </tr>

</table><!-- form -->
<style>
</style>
