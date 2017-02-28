<?php
/* @var $this CommercialController */
/* @var $model CommercialPlan */
?>

<?php
$this->breadcrumbs = array(
    'Commercial Plans' => array('index'),
    'Create',
);

$this->menu = array(
    array('label' => 'List CommercialPlan', 'url' => array('index')),
    array('label' => 'Manage CommercialPlan', 'url' => array('admin')),
);
?>

<h1>Create CommercialPlan</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>