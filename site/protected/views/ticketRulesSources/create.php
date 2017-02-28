<?php
/* @var $this TicketRulesSourcesController */
/* @var $model TicketRulesSources */

$this->breadcrumbs=array(
	'Ticket Rules Sources'=>array('admin'),
	'Create',
);

$this->menu=array(
	array('label'=>'List TicketRulesSources', 'url'=>array('index')),
	array('label'=>'Manage TicketRulesSources', 'url'=>array('admin')),
);
?>

<h1>Create TicketRulesSources</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>