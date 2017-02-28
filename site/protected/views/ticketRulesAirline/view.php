<?php
/* @var $this TicketRulesAirlineController */
/* @var $model TicketRulesAirline */

$this->breadcrumbs=array(
	'Ticket Rules Airlines'=>array('admin'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List TicketRulesAirline', 'url'=>array('index')),
	array('label'=>'Create TicketRulesAirline', 'url'=>array('create')),
	array('label'=>'Update TicketRulesAirline', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete TicketRulesAirline', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage TicketRulesAirline', 'url'=>array('admin')),
);
?>

<h1>View TicketRulesAirline #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'airline_code',
		'iata_on_basic',
		'airline_name',
		//'source_a_agent_id',
          
              ['name' => 'source_a_agent_id', 'value' => !empty($model->source_a_agent_id) ? $model->sourceAAgent->agent_name : ''],
		'source_a_rbd',
		'source_a_remark',
           ['name'=>'notes_a','value'=>!empty($notesString['notes_a']) ? $notesString['notes_a']: ''],
		//'source_b_agent_id',
            ['name' => 'source_b_agent_id', 'value' => !empty($model->source_b_agent_id) ? $model->sourceBAgent->agent_name : ''],
		'source_b_rbd',
		'source_b_remark',
            ['name'=>'notes_b','value'=>!empty($notesString['notes_b']) ? $notesString['notes_b']:''],
		//'source_c_agent_id',
            ['name' => 'source_c_agent_id', 'value' => !empty($model->source_c_agent_id) ? $model->sourceCAgent->agent_name : '' ],
		'source_c_rbd',
		'source_c_remark',
                ['name'=>'notes_c','value'=>!empty($notesString['notes_c']) ? $notesString['notes_c']:''],
		'created',
	),
)); ?>
