<?php
/* @var $this TicketRulesNotesController */
/* @var $model TicketRulesNotes */

$this->breadcrumbs=array(
	'Ticket Rules Notes'=>array('admin'),
);

$this->menu=array(
	array('label'=>'List TicketRulesNotes', 'url'=>array('index')),
	array('label'=>'Create TicketRulesNotes', 'url'=>array('create')),
	array('label'=>'View TicketRulesNotes', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage TicketRulesNotes', 'url'=>array('admin')),
);
?>

<h3>Update TicketRulesNotes <?php echo $model->id; ?></h3>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>