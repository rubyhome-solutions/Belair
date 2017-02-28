<?php
/* @var $this TicketRulesAirlineController */
/* @var $model TicketRulesAirline */

$this->breadcrumbs=array(
	'Ticket Rules Airlines'=>array('admin'),
	'Manage',
);

$this->menu=array(
	array('label'=>'Create TicketRulesAirline', 'url'=>array('create')),
);

Yii::app()->clientScript->registerScript('search', "
$('.search-button').click(function(){
	$('.search-form').toggle();
	return false;
});
$('.search-form form').submit(function(){
	$('#ticket-rules-airline-grid').yiiGridView('update', {
		data: $(this).serialize()
	});
	return false;
});
");
?>

<h1>Manage Ticket Rules Airlines</h1>

<p>
You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>&lt;&gt;</b>
or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>

<?php echo CHtml::link('Advanced Search','#',array('class'=>'search-button')); ?>
<a href='/ticketRulesAirline/create' class='btn primary blue' style='float:right'>Create</a>
<div class="search-form" style="display:none">
<?php $this->renderPartial('_search',array(
	'model'=>$model,
)); ?>
</div><!-- search-form -->

<?php $this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'ticket-rules-airline-grid',
	'dataProvider'=>$model->search(),
	'filter'=>$model,
	'columns'=>array(
		//'id',
		'airline_code',
		'iata_on_basic',
		'airline_name',
		//'source_a_agent_id',
                [
                    'name'=>'source_a_agent_id',
                    'header' => '1st Source',
                    'filter' => CHtml::listData(\TicketRulesSources::model()->findAll(['order' => 'agent_name']), 'id', 'agent_name'),
                    'value' => '!empty($data->source_a_agent_id) ? $data->sourceAAgent->agent_name : ""',
                    'htmlOptions' => array('style' => 'text-align:center;'),
                ],
		'source_a_rbd',
                //'notes_a',
                [
                    'name'=>'notes_a',
                    'header' => '1st Note',
                    'value' => '!empty($data->notes_a) ? $data->getNotesSource(1) : ""',
                    'htmlOptions' => array('style' => 'text-align:center;'),
                ],
		//'source_a_remark',
                [
                    'name'=>'source_b_agent_id',
                    'header' => '2nd Source',
                    'filter' => CHtml::listData(\TicketRulesSources::model()->findAll(['order' => 'agent_name']), 'id', 'agent_name'),
                    'value' => '!empty($data->source_b_agent_id) ? $data->sourceBAgent->agent_name : ""',
                    'htmlOptions' => array('style' => 'text-align:center;'),
                ],
		//'source_b_agent_id',
		'source_b_rbd',
               // 'notes_b',
                [
                    'name'=>'notes_b',
                    'header' => '2nd Note',
                    'value' => '!empty($data->notes_a) ? $data->getNotesSource(2) : ""',
                    'htmlOptions' => array('style' => 'text-align:center;'),
                ],
		//'source_b_remark',
                [
                    'name'=>'source_c_agent_id',
                    'header' => '3rd Source',
                    'filter' => CHtml::listData(\TicketRulesSources::model()->findAll(['order' => 'agent_name']), 'id', 'agent_name'),
                    'value' => '!empty($data->source_c_agent_id) ? $data->sourceCAgent->agent_name : ""',
                    'htmlOptions' => array('style' => 'text-align:center;'),
                ],
		//'source_c_agent_id',
		'source_c_rbd',
               // 'notes_c',
               [
                    'name'=>'notes_c',
                    'header' => '3rd Note',
                    'value' => '!empty($data->notes_c) ? $data->getNotesSource(3) : ""',
                    'htmlOptions' => array('style' => 'text-align:center;'),
                ],
		//'source_c_remark',
		
		
		array(
			'class'=>'CButtonColumn',
		),
	),
)); ?>
