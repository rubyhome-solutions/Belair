<?php
/* @var $this ParamsController */
/* @var $model Params */

$this->breadcrumbs = [
    'Params' => ['index'],
    'Create',
];
?>

<h1>Create Parameter</h1>

<?php $this->renderPartial('_form', array('model' => $model)); ?>