<?php
/* @var $this TicketRulesSourcesController */
/* @var $model TicketRulesSources */

$this->breadcrumbs=array(
	'Ticket Rules Sources'=>array('admin'),
);

$this->menu=array(
	array('label'=>'List TicketRulesSources', 'url'=>array('index')),
	array('label'=>'Create TicketRulesSources', 'url'=>array('create')),
	array('label'=>'View TicketRulesSources', 'url'=>array('view', 'id'=>$model->id)),
	array('label'=>'Manage TicketRulesSources', 'url'=>array('admin')),
);
?>

<h3>Update TicketRulesSources <?php echo $model->id; ?></h3>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>