<?php
$canEdit = Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_COMPANY_INFO);
$discount_type = CHtml::listData(\PromoDiscountType::model()->findAll(array('order' => 'name')), 'id', 'name');
?>

<fieldset class="span9" style="margin-left: 0">
            <legend >Promo Code Range</legend>
            <style>

    tfoot tr {background-color: beige;}
</style>
<?php

Yii::import('ext.ajax-input-column.AjaxInputColumn');
Yii::import('ext.ajax-select-column.AjaxSelectColumn');

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'promo-ranges-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'htmlOptions' => [
//        'class' => 'span7',
        'style' => 'margin-left:0; width: 600px;'
    ],
    'columns' => [
        [
            'name' => 'discount_type',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("promoRangeUpdate"),
            'headerHtmlOptions' => ['style' => 'width: 120px;'],
            'filter' => $discount_type,
            'footer' => TbHtml::activeDropDownList($model, 'discount_type', $discount_type, ['id' => 'PR_discount_type']),
            'selectOptions' => $discount_type,
        ],
        [
            'name' => 'discount_value',
            'class' => 'AjaxInputColumn',
            'filter' => false,
            'url' => $this->createUrl("promoRangeUpdate"),
            'footer' => TbHtml::activeTextField($model, 'discount_value', ['id' => 'PR_discount_value']),
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
        ],
        [
            'name' => 'transaction_amt_from',
            'class' => 'AjaxInputColumn',
            'filter' => false,
            'url' => $this->createUrl("promoRangeUpdate"),
            'footer' => TbHtml::activeTextField($model, 'transaction_amt_from', ['id' => 'PR_transaction_amt_from']),
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
        ],
        [
            'name' => 'transaction_amt_to',
            'class' => 'AjaxInputColumn',
            'filter' => false,
            'url' => $this->createUrl("promoRangeUpdate"),
            'footer' => TbHtml::activeTextField($model, 'transaction_amt_to', ['id' => 'PR_transaction_amt_to']),
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
        ],
        [
            'name' => 'max_discount_value',
            'class' => 'AjaxInputColumn',
            'filter' => false,
            'url' => $this->createUrl("promoRangeUpdate"),
            'footer' => TbHtml::activeTextField($model, 'max_discount_value', ['id' => 'PR_max_discount_value']),
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/promoCodes/promoRangeDelete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add New', $this->createUrl("promoCodes/promoRangeCreate"), [
                'success' => 'function(error){ '
                . '  if (!error) { '
                . '    $.fn.yiiGridView.update("promo-ranges-grid"); '
                . '  } else {'
                . '    alert(error);'
                . '  } '
                . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'PR[promo_code_id]' => "$promoCode->id",
                    'PR[discount_type]' => 'js:$("#PR_discount_type").val()',
                    'PR[discount_value]' => 'js:$("#PR_discount_value").val()',
                    'PR[transaction_amt_from]' => 'js:$("#PR_transaction_amt_from").val()',
                    'PR[transaction_amt_to]' => 'js:$("#PR_transaction_amt_to").val()',
                    'PR[max_discount_value]' => 'js:$("#PR_max_discount_value").val()',
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

</fieldset>
<style>
    #promo-ranges-grid .filters input {margin-bottom: 10px !important; width: 80%}
    #promo-ranges-grid .table th {text-align: left}
    #promo-ranges-grid input.ajax-input-column {margin-bottom: auto;}
    #promo-ranges-grid select.ajax-select-column {margin-bottom: auto;}
    #promo-ranges-grid input {width: inherit;}
    #promo-ranges-grid .filters select {width: 120px !important;}
    #promo-ranges-grid select {width: 130px !important;}
    #promo-ranges-grid input {width: 120px !important;}
    .form-actions {background-color: #ffffff !important;}
</style>