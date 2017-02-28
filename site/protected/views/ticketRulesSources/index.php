<?php
/* @var $this TicketRulesSourcesController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Ticket Rules Sources',
);

$this->menu=array(
	array('label'=>'Create TicketRulesSources', 'url'=>array('create')),
	array('label'=>'Manage TicketRulesSources', 'url'=>array('admin')),
);
?>

<h1>Ticket Rules Sources</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
