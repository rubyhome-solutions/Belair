<?php

$this->breadcrumbs=array(
	'Promo Codes'=>array('index'),
	 "Promo Code № $model->id",
);?>
<?php
$this->widget('zii.widgets.CDetailView', array(
    'htmlOptions' => array(
        'class' => 'table table-striped table-condensed table-hover span6',
    ),
    'data' => $model,
    'attributes' => array(
        'id',
        'code',
        ['label' => 'Promo Type', 'value' => $model->promoType->name],
        ['label' => 'Promo Discount Type', 'value' => $model->promoDiscountType->name],       
        'value',
        ['name' => 'max_value', 'value' => $model->max_value ? $model->max_value : ''],
        ['name' => 'date_valid_from', 'value' => $model->date_valid_from ? $model->date_valid_from : ''],
        ['name' => 'date_valid_to', 'value' => $model->date_valid_to ? $model->date_valid_to : ''],   
        ['name' => 'promo_date_type_id', 'value' => $model->promo_date_type_id ? $model->promoDateType->name : ''],
        ['name' => 'ref_user_info_id', 'value' => $model->ref_user_info_id ? $model->refUserInfo->name : ''],
        ['name' => 'max_count', 'value' => $model->max_count ? $model->max_count : ''],
       
//        ['label' => 'Promo Date Type', 'value' => $model->promoDateType->name],
//        ['label' => 'Promo Date Type', 'value' => $model->promoDateType->name],
//        'spare1',
//        'spare2',
//        'spare3',
//        'exclude_carriers',
//        'include_pass_carriers',
//        ['name' => 'enabled', 'value' => $model->is_active ? 'Yes' : 'No'],
////        ['name' => 'air_way_id', 'value' => $model->air_way_id ? 'Yes' : 'No'],
//        ['name' => 'display_in_search', 'value' => $model->display_in_search ? 'Yes' : 'No'],
//        ['name' => 'international_auto_ticket', 'value' => $model->international_auto_ticket ? 'Yes' : 'No'],
//        ['name' => 'domestic_auto_ticket', 'value' => $model->domestic_auto_ticket ? 'Yes' : 'No'],
    ),
));
?>