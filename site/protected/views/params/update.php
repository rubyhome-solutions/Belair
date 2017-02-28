<?php

/* @var $this ParamsController */
/* @var $model Params */

$this->breadcrumbs = [
    $model->id => ['admin'],
    'Update',
];
$this->renderPartial('_form', array('model' => $model));
