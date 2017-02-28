<?php
/* @var $this TicketRulesAirlineController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Ticket Rules Airlines',
);

$this->menu=array(
	array('label'=>'Create TicketRulesAirline', 'url'=>array('create')),
	array('label'=>'Manage TicketRulesAirline', 'url'=>array('admin')),
);
?>

<h1>Ticket Rules Airlines</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
