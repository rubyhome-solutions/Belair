<?php
/* @var $this TicketRulesAirlineController */
/* @var $model TicketRulesAirline */

$this->breadcrumbs=array(
	'Ticket Rules Airlines'=>array('admin'),
);

$this->menu=array(
	array('label'=>'List TicketRulesAirline', 'url'=>array('index')),
	array('label'=>'Create TicketRulesAirline', 'url'=>array('create')),
	array('label'=>'View TicketRulesAirline', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage TicketRulesAirline', 'url'=>array('admin')),
);
?>

<h1>Update TicketRulesAirline <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model,
                    'notesString'=>$notesString)); ?>