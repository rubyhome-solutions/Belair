<?php
/* @var $this TicketRulesNotesController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Ticket Rules Notes'=>array('admin'),
);

$this->menu=array(
	array('label'=>'Create TicketRulesNotes', 'url'=>array('create')),
	array('label'=>'Manage TicketRulesNotes', 'url'=>array('admin')),
);
?>

<h1>Ticket Rules Notes</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
