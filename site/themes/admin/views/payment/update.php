<?php
/* @var $this PaymentController */
/* @var $model Payment */
?>

<?php
$this->breadcrumbs=array(
	'Payments'=>array('index'),
	$model->id=>array('view','id'=>$model->id),
	'Update',
);

$this->menu=array(
array('label'=>'List Payment', 'url'=>array('index')),
array('label'=>'Create Payment', 'url'=>array('create')),
array('label'=>'View Payment', 'url'=>array('view', 'id'=>$model->id)),
array('label'=>'Manage Payment', 'url'=>array('admin')),
);
?>

<h1>Update Payment <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>