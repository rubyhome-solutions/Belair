<?php
/* @var $this PayGateController */
/* @var $dataProvider CActiveDataProvider */
?>

<?php
$this->breadcrumbs=array(
	'Pay Gate',
);

$this->menu=array(
array('label'=>'Create PayGateLog','url'=>array('create')),
array('label'=>'Manage PayGateLog','url'=>array('admin')),
);
?>

<h1>Pay Gate</h1>

<?php $this->widget('bootstrap.widgets.TbListView',array(
'dataProvider'=>$dataProvider,
'itemView'=>'_view',
)); ?>