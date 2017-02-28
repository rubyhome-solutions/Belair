<?php
/* @var $this TicketRulesSourcesController */
/* @var $model TicketRulesSources */

$this->breadcrumbs=array(
	'Ticket Rules Sources'=>array('admin'),
	'Manage',
);

$this->menu=array(
	array('label'=>'Create TicketRulesSources', 'url'=>array('create')),
);

Yii::app()->clientScript->registerScript('search', "
$('.search-button').click(function(){
	$('.search-form').toggle();
	return false;
});
$('.search-form form').submit(function(){
	$('#ticket-rules-sources-grid').yiiGridView('update', {
		data: $(this).serialize()
	});
	return false;
});
");
?>

<h1>Manage Ticket Rules Sources</h1>

<p>
You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>&lt;&gt;</b>
or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>

<?php echo CHtml::link('Advanced Search','#',array('class'=>'search-button')); ?>
<a href='/ticketRulesSources/create' class='btn primary blue' style='float:right'>Create</a>
<div class="search-form" style="display:none">
<?php $this->renderPartial('_search',array(
	'model'=>$model,
)); ?>
</div><!-- search-form -->

<?php $this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'ticket-rules-sources-grid',
	'dataProvider'=>$model->search(),
	'filter'=>$model,
	'columns'=>array(
		//'id',
		'agent_name',
		'amadeus_pcc',
		'gal_pcc',
		'contact',
		'email',
		/*
		'office',
		'night_ctc',
		'mobile_no',
		'created',
		*/
		array(
			'class'=>'CButtonColumn',
		),
	),
)); ?>
