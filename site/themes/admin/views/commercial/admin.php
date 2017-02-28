<?php
/* @var $this CommercialController */
/* @var $model CommercialPlan */


$this->breadcrumbs = [
    'Commercials' => ['admin'],
    'Manage',
];

$this->renderPartial('_admin_grid', ['model' => $model]);
$this->renderPartial('_choose_companies');
?>
