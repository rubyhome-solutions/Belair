<?php
/* @var $this TicketRulesNotesController */
/* @var $model TicketRulesNotes */

$this->breadcrumbs=array(
	'Ticket Rules Notes'=>array('admin'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List TicketRulesNotes', 'url'=>array('index')),
	array('label'=>'Create TicketRulesNotes', 'url'=>array('create')),
	array('label'=>'Update TicketRulesNotes', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete TicketRulesNotes', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage TicketRulesNotes', 'url'=>array('admin')),
);
?>

<h1>View TicketRulesNotes #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'airline_code',
		'iata_on_basic',
		'instructions',
		'created',
		'airline_with_remarks',
	),
)); ?>
