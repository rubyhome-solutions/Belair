<?php
/* @var $this AirSourceController */
/* @var $model AirSource */

$this->breadcrumbs = array(
    'Air Sources' => array('admin'),
    'Manage',
);
echo Utils::helpMessage('<br>Air Sources marked as <i>"Default"</i> are used as default sources if no specific rule is matching the search<br>The disabled Air Sources are never used, even if present in the air source rules');
echo TbHtml::link('<i class="fa fa-cogs fa-lg"></i>&nbsp;&nbsp;&nbsp;Add Air Source', '/airSource/create', ['class' => 'btn btn-primary']);
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'air-source-grid',
    'type' => [TbHtml::GRID_TYPE_HOVER],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => [
        'name',
        [
            'name' => 'backend_id',
            'value' => '$data->backend->name',
            'header' => 'Backend',
            'filter' => CHtml::listData(\Backend::model()->findAll(['order' => 'name']), 'id', 'name'),
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
        [
            'name' => 'is_active',
            'value' => '$data->is_active ? "<span class=\"badge badge-success\">Yes</span>" : "<span class=\"badge badge-important\">No</span>"',
            'filter' => ['No', 'Yes'],
            'headerHtmlOptions' => ['style' => 'width: 80px;'],
            'type' => 'raw'
        ],
        [
            'name' => 'display_in_search',
            'value' => '$data->display_in_search ? "<span class=\"badge badge-success\">Yes</span>" : "<span class=\"badge badge-important\">No</span>"',
            'filter' => ['No', 'Yes'],
            'headerHtmlOptions' => ['style' => 'width: 80px;'],
            'type' => 'raw'
        ],
        [
            'name' => 'type_id',
            'value' => '"<span class=\"label label-info\">" . \AirSource::$type[$data->type_id?:1] . "</span>"',
            'filter' => \AirSource::$type,
            'headerHtmlOptions' => ['style' => 'min-width: 100px;'],
            'type' => 'raw'
        ],
        [
            'name' => 'priority',
            'value' => '"<span class=\"label\">$data->priority</span>"',
            'filter' => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'type' => 'raw'
        ],
        [
            'name' => 'currency_id',
            'value' => '$data->currency->code',
            'filter' => CHtml::listData(\Currency::model()->findall(['order' => 'id']), 'id', 'code'),
            'headerHtmlOptions' => ['style' => 'min-width: 85px;'],
        ],
        'username',
        'tran_username',
//        'office_id',
        'profile_pcc',
        ['name' => 'balance', 'value' => 'number_format($data->balance)', 'header' => 'Balance'],
        ['class' => 'bootstrap.widgets.TbButtonColumn'],
    ],
]);
?>
<style>
    .badge, .label {font-family: sans-serif; font-size: inherit;}
</style>