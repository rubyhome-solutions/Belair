<?php

/* @var $this CommissionController */
/* @var $model \CommissionRule */

$this->breadcrumbs = [
    'Commission' => ['update'],
    'Manage',
];

$airSourceList = CHtml::listData(\AirSource::model()->findAll(['order' => 'name']), 'id', 'name');
$airlineList = CHtml::listData(\Carrier::model()->findAll(['order' => 'code']), 'id', 'codeAndName');

$this->renderPartial('_header_add_rule', [
    'airSourceList' => $airSourceList,
    'airlineList' => $airlineList,
    ]);

$this->renderPartial('_rules', [
    'ruleId' => $ruleId,
    'airSourceList' => $airSourceList,
    'airlineList' => $airlineList,
]);
?>