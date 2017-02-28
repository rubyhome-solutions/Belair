<div class="ibox-content m_top1">
<?php
/* @var $this \XRateController */
/* @var $model \Airport */

$this->breadcrumbs = [
    'Airports' => ['airport'],
    'Manage'
];

Yii::import('ext.ajax-input-column.AjaxInputColumn');
Yii::import('ext.ajax-select-column.AjaxSelectColumn');
$numArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'airport-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'htmlOptions' => [
//        'class' => 'span7',
        'style' => 'margin-left:0; '
    ],
    'columns' => [
        [
            'name' => 'airport_code',
            'headerHtmlOptions' => [],
        ],
        [
            'name' => 'airport_name',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameAirport"),
            'headerHtmlOptions' => [],
        ],
        [
            'name' => 'city_code',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameAirport"),
            'headerHtmlOptions' => ['style' => 'width: 80px;'],
            'htmlOptions' => [],
        ],
        [
            'name' => 'city_name',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameAirport"),
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
        ],
        [
            'name' => 'country_code',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameAirport"),
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'htmlOptions' => ['style' => 'width: 60px;'],
        ],
        [
            'name' => 'is_top',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameAirport"),
            'filter' => $numArray,
            'selectOptions' => $numArray,
        ],
    ],
]);
?>
</div>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    select.ajax-select-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important; width: 80%}
    input {width: inherit;}
    select {width: 80px;}
</style>