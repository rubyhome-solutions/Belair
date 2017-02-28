<?php
/* @var $this TicketRulesSourcesController */
/* @var $model TicketRulesSources */

$this->breadcrumbs=array(
	'Ticket Rules Sources'=>array('admin'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List TicketRulesSources', 'url'=>array('index')),
	array('label'=>'Create TicketRulesSources', 'url'=>array('create')),
	array('label'=>'Update TicketRulesSources', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete TicketRulesSources', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage TicketRulesSources', 'url'=>array('admin')),
);
?>

<h1>View TicketRulesSources #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'agent_name',
		'amadeus_pcc',
		'gal_pcc',
		'contact',
		'email',
		'office',
		'night_ctc',
		'mobile_no',
		'created',
	),
)); ?>
