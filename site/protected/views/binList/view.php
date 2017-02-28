<?php

/* @var $this BinListController */
/* @var $model BinList */

$this->breadcrumbs = array(
    'Bin Lists' => array('admin'),
    $model->bin
);

$this->widget('zii.widgets.CDetailView', array(
    'htmlOptions' => array(
        'class' => 'table table-striped table-condensed table-hover table-bordered span4',
    ),
    'data' => $model,
    'attributes' => array(
        'bin',
        [
            'name' => 'type_id',
            'value' => (!empty($model->ccs) ? $model->ccs[0]->getImageTag() : "" ) . "&nbsp;&nbsp;&nbsp;&nbsp;" . $model->type->name ,
            'type' => 'raw'
        ],
        'sub_brand',
        'country_code',
        'country_name',
        'bank',
        'card_type',
        'card_category',
        'latitude',
        'longitude',
        [
            'name' => 'domestic',
            'value' => $model->domestic ? 'Yes' : 'Nope'
        ],
    ),
));
?>