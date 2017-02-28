<?php
/* @var $this AirSourceController */
/* @var $dataProvider CActiveDataProvider */
?>

<?php
$this->breadcrumbs=array(
	'Air Sources',
);

$this->menu=array(
array('label'=>'Create AirSource','url'=>array('create')),
array('label'=>'Manage AirSource','url'=>array('admin')),
);
?>

<h1>Air Sources</h1>

<?php $this->widget('bootstrap.widgets.TbListView',array(
'dataProvider'=>$dataProvider,
'itemView'=>'_view',
)); ?>