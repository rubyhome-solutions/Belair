<?php

/* @var $this ProcessController */
/* @var $model Process */


$this->breadcrumbs = ['Processes' => ['admin'],
    'Manage',
];

$this->renderPartial('_airSource_APIs_health');
$this->renderPartial('_graph');
$this->renderPartial('_summary', ['model' => $model]);
$this->renderPartial('_grid', ['model' => $model]);
?>