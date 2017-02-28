<?php

/* @var $this CommercialController */
/* @var $model CommercialPlan */

$this->breadcrumbs = [
    'Commercials' => ['admin'],
    $model->name,
];

$airSourceList = CHtml::listData(\AirSource::model()->findAll(['order' => 'name']), 'id', 'name');
$airlineList = CHtml::listData(\Carrier::model()->findAll(['order' => 'code']), 'id', 'codeAndName');
$clientSourceList = CHtml::listData(\ClientSource::model()->findAll(['order' => 'id']), 'id', 'name');

$this->renderPartial('_header_add_rule', [
    'plan' => $model,
    'airSourceList' => $airSourceList,
    'airlineList' => $airlineList,
    'clientSourceList' => $clientSourceList,
    ]);

$this->renderPartial('_rules', [
    'plan' => $model,
    'ruleId' => $ruleId,
    'airSourceList' => $airSourceList,
    'airlineList' => $airlineList,
    'clientSourceList' => $clientSourceList,
]);
?>