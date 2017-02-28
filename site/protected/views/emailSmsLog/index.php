<?php
/* @var $this EmailSmsLogController */
/* @var $dataProvider CActiveDataProvider */
?>

<?php
$this->breadcrumbs=array(
	'Email Sms Logs',
);

$this->menu=array(

array('label'=>'Manage EmailSmsLog','url'=>array('admin')),
);
?>

<h1>Email Sms Logs</h1>

<?php $this->widget('bootstrap.widgets.TbListView',array(
'dataProvider'=>$dataProvider,
'itemView'=>'_view',
)); ?>