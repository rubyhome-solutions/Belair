<?php

/* @var $model Traveler */

$rels = new CArrayDataProvider($model->visas);

$data = TbHtml::listData(Country::model()->findAll(['order' => 'name']), 'id', 'name');
$selectCountry = TbHtml::dropDownList('issuing_country_id', '100100', $data, array('style' => 'max-width:100px;'));

$issuedDateContent = $this->widget('zii.widgets.jui.CJuiDatePicker', array(
    'name' => 'Visa[issue_date]',
    'id' => 'Visa_issue_date',
    'options' => array(
        'dateFormat' => 'yy-mm-dd',
        'changeMonth' => 'true',
        'changeYear' => 'true',
        'yearRange' => 'c-10:c',
        'defaultDate' => 'today',
        'maxDate' => "0D",
        ),
    'htmlOptions' => array(
        'style' => 'max-width: 100px;',
        'size' => 10,
        'maxlength' => 10,
        'placeholder' => 'YYYY-MM-DD'
        ),
    ), true);
$expireDateContent = $this->widget('zii.widgets.jui.CJuiDatePicker', array(
    'name' => 'Visa[expire_date]',
    'id' => 'Visa_expire_date',
    'options' => array(
        'dateFormat' => 'yy-mm-dd',
        'changeMonth' => 'true',
        'changeYear' => 'true',
        'yearRange' => 'c:c+10',
        'defaultDate' => 'today',
        'minDate' => "today",
        ),
    'htmlOptions' => array(
        'style' => 'max-width: 100px;',
        'size' => 10,
        'maxlength' => 10,
        'placeholder' => 'YYYY-MM-DD'
        ),
    ), true);


$buttonPlus = TbHtml::ajaxButton('<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add', $this->createUrl('addVisa'), 
        array(
            'type' => 'POST',
            'success' => 'function(html){  $.fn.yiiGridView.update("grid-visas"); }',
            'data' => array(
                'ajax' => true,
                'id' => $model->id,
                'Visa[issuing_country_id]' => 'js:$("#issuing_country_id").val()',
                'Visa[number]' => 'js:$("#Visa_number").val()',
                'Visa[type]' => 'js:$("#Visa_type").val()',
                'Visa[issue_date]' => 'js:$("#Visa_issue_date").val()',
                'Visa[expire_date]' => 'js:$("#Visa_expire_date").val()',
                ),
            ), 
        array(
            'class' => 'btn-warning',
            'style' => 'margin-top: -12px;white-space:nowrap;',
            'encode' => false,
            )
);


$this->widget('bootstrap.widgets.TbGridView', array(
    'dataProvider' => $rels,
    'id' => 'grid-visas',
    'type' => array(TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_CONDENSED),
    'columns' => array(
        array(
            'value' => '$data->issuingCountry->name',
            'header' => 'Country',
            'footer' => $selectCountry,
        ),
        array(
            'header' => 'Issue date',
            'name' => 'issue_date',
            'footer' => $issuedDateContent,
        ),
        array(
            'header' => 'Expire date',
            'name' => 'expire_date',
            'footer' => $expireDateContent,
        ),
        array(
            'header' => 'Visa number',
            'name' => 'number',
            'footer' => TbHtml::textField('Visa[number]', '', array('id' => 'Visa_number', 'style' => 'max-width:100px;')),
        ),
        array(
            'header' => 'Visa type',
            'name' => 'type',
            'footer' => TbHtml::textField('Visa[type]', '', array('id' => 'Visa_type', 'style' => 'max-width:100px;')),
        ),
        array(
            'class' => 'ext.bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => array('delete' => array('url' => '$this->grid->Controller->createUrl("delVisa",array("Visa[id]"=>$data->id, "Traveler[id]"=>$data->traveler_id))')),
            'footer' => $buttonPlus,
        ),
    ),
));
?>
