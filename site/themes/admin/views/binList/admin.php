<div class="ibox-content banlist">
<?php

/* @var $this BinListController */
/* @var $model BinList */


$this->breadcrumbs = array(
    'Bin Lists' => array('admin'),
    'Manage',
);

echo TbHtml::link('<i class="fa fa-cloud-upload fa-lg"></i>&nbsp;&nbsp;&nbsp;Add bins', 'create', ['class' => 'btn btn-primary m-b']);
$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'bin-list-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'selectionChanged' => 'function(id){ location.href = "' . $this->createUrl('update') . '/"+$.fn.yiiGridView.getSelection(id);}',
    'columns' => array(
        [
            'name' => 'bin',
            'headerHtmlOptions' => ['style' => 'width: 70px;'],
        ],
        [
            'name' => 'type_id',
            'value' => '(!empty($data->ccs) ? $data->ccs[0]->imageTag : "") . "&nbsp;&nbsp;&nbsp;" . $data->type->name',
            'type' => 'raw',
            'filter' => CHtml::listData(CcType::model()->findAll(), 'id', 'name'),
            'headerHtmlOptions' => ['style' => 'min-width: 150px;'],
        ],
        'bank',
        'card_type',
//        'sub_brand',
        [
            'name' => 'domestic',
            'value' => '$data->domestic ? "Yes" : "No"',
            'type' => 'raw',
            'filter' => ['International', 'Domestic'],
            'headerHtmlOptions' => ['style' => 'min-width: 120px;'],
        ],
        [
            'name' => 'country_code',
            'header' => 'C.code',
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
        ],
        'country_name',
        /*
          'card_category',
          'latitude',
          'longitude',
         */
//        array(
//            'class' => 'bootstrap.widgets.TbButtonColumn',
//            'template' => '{update}'
//        ),
    ),
));
?>
</div>
<style>
    .grid-view table.items tr td {cursor: pointer}
</style>