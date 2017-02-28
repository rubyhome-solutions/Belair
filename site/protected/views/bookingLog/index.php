<?php
/* @var $this BookingLogController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Booking Logs',
);

$this->menu=array(
	array('label'=>'Create BookingLog', 'url'=>array('create')),
	array('label'=>'Manage BookingLog', 'url'=>array('admin')),
);
?>

<h1>Booking Logs</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
