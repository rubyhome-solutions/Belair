<?php
/* @var $this TicketRulesNotesController */
/* @var $model TicketRulesNotes */

$this->breadcrumbs=array(
	'Ticket Rules Notes'=>array('admin'),
);

$this->menu=array(
	array('label'=>'List TicketRulesNotes', 'url'=>array('index')),
	array('label'=>'Manage TicketRulesNotes', 'url'=>array('admin')),
);
?>

<h1>Create TicketRulesNotes</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>