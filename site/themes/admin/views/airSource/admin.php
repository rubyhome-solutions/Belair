<div class="ibox-content">
<?php
/* @var $this AirSourceController */
/* @var $model AirSource */

$this->breadcrumbs = array(
    'Air Sources' => array('admin'),
    'Manage',
);
echo TbHtml::link('<i class="fa fa-cogs fa-lg"></i>&nbsp;&nbsp;&nbsp;Add Air Source', '/airSource/create', ['class' => 'btn btn-primary m-b']);
$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'air-source-grid',
    'type' => [TbHtml::GRID_TYPE_BORDERED],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => array(
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
    ),
));
?>
</div>
<style>
    .badge, .label {font-family: sans-serif; font-size: inherit;}
</style>