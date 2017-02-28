<?php
/* @var $this PromoCodesController */
/* @var $model PromoCodes */


$this->breadcrumbs = array(
    'Promo Codes' => array('index'),
    'Manage',
);


//Yii::app()->clientScript->registerScript('search', "
//    $('.search-button').click(function(){
//        $('div.search-form').toggle();
//        return false;
//    });
//    $('.search-form form').submit(function(){
//        $('#promo-codes-grid').yiiGridView('update', {
//            data: $(this).serialize()
//        });
//        return false;
//    });
//");
//
//$this->renderPartial('_search', array('model' => $model));
//$airSourcesFilter = CHtml::listData(\AirSource::model()->findAll(), 'id', 'name');
$promoTypeFilter = CHtml::listData(\PromoType::model()->findAll(), 'id', 'name');
$promoDiscountTypeFilter = CHtml::listData(\PromoDiscountType::model()->findAll(), 'id', 'name');
//$promoPaymentTypeFilter = CHtml::listData(\PromoPaymentType::model()->findAll(), 'id', 'name');
//$carriers = CHtml::listData(\Carrier::model()->findAll(['order' => 'name']), 'id', 'name');
//$usertype = CHtml::listData(\UserType::model()->findAll(['order' => 'name']), 'id', 'name');
?>
<a class="btn btn-primary" style="margin-left: 2%;" href="/promoCodes/create"><i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Create Promo Code</a>
<?php
$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'promo-codes-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::INPUT_TYPE_CHECKBOX], // , TbHtml::GRID_TYPE_BORDERED
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => array(
        [
            'header' => 'Code',
            'name' => 'code',
            'value' => '$data->code',
        ],
        [
            'header' => 'Promo type',
            'name' => 'promo_type_id',
            'value' => '$data->promoType->name',
            'filter' => $promoTypeFilter,
        ],
        [
            'header' => 'Discount Type',
            'name' => 'promo_discount_type_id',
            'value' => '$data->promoDiscountType->name',
            'filter' => $promoDiscountTypeFilter,
        ],
        [
            'header' => 'Value',
            'name' => 'value',
            'value' => '$data->value',
        ],
        [
            'header' => 'Referral',
            'name' => 'ref_user_info_id',
            'value' => '!empty($data->ref_user_info_id) ? $data->refUserInfo->name: "None"',
            'type' => 'raw',
            'htmlOptions' => array('style' => 'text-align:center;'),
        ],
        [
            'header' => 'Per User',
            'name' => 'per_user',
            'value' => '$data->per_user==1 ? "Yes": "No"',
            'htmlOptions' => array('style' => 'text-align:center;'),
            'filter' => false
        ],
        [
            'header' => 'Enabled',
            'name' => 'enabled',
            'value' => '$data->enabled==1 ? "Yes": "No"',
            'htmlOptions' => array('style' => 'text-align:center;'),
            'filter' => false
        ],
//        [
//            'name' => 'created',
//            'name'=>'created',
//            'value' => 'Utils::cutMilliseconds($data->created)',
//            'headerHtmlOptions' => array('style' => 'text-align:center;'),
//            'filter'=>false
//        ],
        array(
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => ' {update} &nbsp;  &nbsp; &nbsp;{copy}',
            'buttons' => [
                'copy' => array
                    (
                    'label' => 'Copy',
                    'icon' => 'icon-file',
                    'url' => 'Yii::app()->createUrl("promoCodes/copy", array("id"=>$data->id))',
                ),
            ],
        ),
    ),
));
?>

<style>
    .table th, td.center, tr.center td {
        text-align: center;
        vertical-align: middle;
    }
    td input[type="text"], td select {
        margin-bottom: 0;
        max-width: 160px;
        text-align: center;
    }
    table td input.big {
        font-weight: bold;
        font-size: 1.1em;
        text-align: right;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
        vertical-align: middle;        
    }
    .center {
        text-align: center !important;
    }
    table.table tr td input.error {
        border-color: red;
        background-color: #FBC2C4;
    }
    td.diff {
        text-align: right;
    }
    .shadow {
        box-shadow: 10px 10px 5px #888888; 
        background-color: aliceblue;
    }
    .ui-widget {
        font-family: "Open Sans";
        font-size: .9em;
    }

</style>

<script>
    $(document).on('click', 'button.positive', function(evt) {
            var $button = $(evt.currentTarget);
            $input = $button.closest('form').find('input[name="' + $button.attr('name') + '"]');
            $select = $button.closest('form').find('select[name="' + $button.attr('name') + '"]');
            if (!$input.length && !$select.length) {
                $input = $('<input>', {
                    type: 'hidden',
                    name: $button.attr('name')
                });
                $input.insertAfter($button);
            }
            if ($select.length) {
                $select.val($button.val());
            } else {
                $input.val($button.val());
            }
            $button.closest('form').submit();
        });
</script>