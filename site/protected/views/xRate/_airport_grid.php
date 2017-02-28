<?php
/* @var $this \XRateController */
/* @var $model \Airport */

$this->breadcrumbs = [
    'Airports' => ['airport'],
    'Manage'
];

echo \Utils::helpMessage('<br>The prioritization it is designed to work in descenting order<br>
<li>15 higher than 14</li>
<li>14 higher than 13</li>
<li>13 higher than 12</li>
<li>...</li>
<li>0 the lowest popularity</li>
<li>OFF the airport is hidden</li>
The higher the popularity the higher the airport is shown in the search results.<br><br>
Choose <b>OFF</b> as popularity if you want the airport to be hidden.');
//For the city wide airports add <b>All airports</b> in the airport name, this way the same string will be shown in the search results instead of the country name.');
echo TbHtml::link('Add Airport', '/xRate/createAirport', ['class' => 'btn btn-primary']);
Yii::import('ext.ajax-input-column.AjaxInputColumn');
Yii::import('ext.ajax-select-column.AjaxSelectColumn');
$numArray = [-1 => 'OFF', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
$tzArray = CHtml::listData(\Airport::model()->findAllBySql('SELECT DISTINCT "timezone" FROM airport ORDER BY 1'), 'timezone', 'timezone');
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'airport-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'htmlOptions' => [
//        'class' => 'span7',
        'style' => 'margin-left:0; width: 790px;'
    ],
    'columns' => [
        [
            'name' => 'airport_code',
            'headerHtmlOptions' => ['style' => 'width: 80px;'],
        ],
        [
            'name' => 'airport_name',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameAirport"),
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
        ],
        [
            'name' => 'city_code',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameAirport"),
            'headerHtmlOptions' => ['style' => 'width: 80px;'],
            'htmlOptions' => ['style' => 'width: 80px;'],
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
            'name' => 'timezone',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameAirport"),
            'filter' => $tzArray,
            'selectOptions' => $tzArray,
            'headerHtmlOptions' => ['style' => 'min-width: 200px;'],
        ],
        [
            'name' => 'is_top',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameAirport"),
            'filter' => $numArray,
            'selectOptions' => $numArray,
            'headerHtmlOptions' => ['style' => 'width: 80px;'],
            'htmlOptions' => ['style' => 'width: 80px;'],
        ],
    ],
]);
?>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    select.ajax-select-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important; width: 80%}
    input {width: inherit;}
    select {width: 97%;}
</style>