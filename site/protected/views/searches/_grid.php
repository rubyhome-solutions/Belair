<?php

/* @var $this SearchesController */
/* @var $model Searches */

\Yii::import('application.controllers.AirsourceRuleController');
$ruleId = \Yii::app()->session->get(\AirsourceRuleController::AIR_SOURCE_RULE_ID);

$this->widget('bootstrap.widgets.TbGridView', ['id' => 'searches-grid',
    'dataProvider' => $model->search(),
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER],
    'filter' => $model,
    'columns' => [
        [
            'name' => 'id',
            'headerHtmlOptions' => ['style' => 'width: 70px;'],
        ],
        [
            'name' => 'hits',
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
        ],
        [
            'name' => 'client_source_id',
            'value' => '$data->clientSource->name',
            'filter' => CHtml::listData(\ClientSource::model()->findAll(['order' => 'id']), 'id', 'name'),
        ],
        [
            'name' => 'user_id',
            'value' => '$data->user_id ? $data->user->name : "Guest"',
            'filter' => false
        ],
        [
            'name' => 'created',
            'value' => '\Utils::cutSecondsAndMilliseconds($data->created)',
            'filter' => false
        ],
        [
            'header' => 'R.№' . $ruleId,
            'value' => '$data->formatAirSourceRule(' . $ruleId . ')',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'width: 70px'],
            'filter' => false,
            'visible' => !empty($ruleId)
        ],
        [
            'name' => 'originCountryCode',
            'header' => 'C.Code',
            'value' => '$data->originAirport->country_code',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
        ],
        ['name' => 'origin', 'headerHtmlOptions' => ['style' => 'width: 70px;']],
        ['name' => 'destination', 'headerHtmlOptions' => ['style' => 'width: 70px;']],
        ['name' => 'date_depart', 'filter' => false],
        [
            'name' => 'type_id',
            'value' => '\Searches::$types[$data->type_id]',
            'headerHtmlOptions' => ['style' => 'width: 100px;'],
            'filter' => \Searches::$types
        ],
        [
            'name' => 'is_domestic',
            'value' => '\Searches::$isDomestic[$data->is_domestic]',
            'headerHtmlOptions' => ['style' => 'width: 120px;'],
            'filter' => \Searches::$isDomestic
        ],
        ['name' => 'date_return', 'filter' => false],
        ['name' => 'adults', 'filter' => false],
        ['name' => 'children', 'filter' => false],
        ['name' => 'infants', 'filter' => false],
//        array(
//            'class' => 'bootstrap.widgets.TbButtonColumn',
//        ),
    ],
]);
?>