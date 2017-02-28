<?php
/* @var $this TicketRulesAirlineController */
/* @var $model TicketRulesAirline */

$this->breadcrumbs=array(
	'Ticket Rules Airlines'=>array('admin'),
	'Create',
);

$this->menu=array(
	array('label'=>'List TicketRulesAirline', 'url'=>array('index')),
	array('label'=>'Manage TicketRulesAirline', 'url'=>array('admin')),
);
?>

<h1>Create TicketRulesAirline</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>