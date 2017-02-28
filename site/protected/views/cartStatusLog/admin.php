<?php
/* @var $this CartStatusLogController */
/* @var $model CartStatusLog */



Yii::app()->clientScript->registerScript('search', "
$('.search-button').click(function(){
	$('.search-form').toggle();
	return false;
});
$('.search-form form').submit(function(){
	$('#cart-status-log-grid').yiiGridView('update', {
		data: $(this).serialize()
	});
	return false;
});
");
?>

<h1>Manage Cart Status Logs</h1>

<p>
You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>&lt;&gt;</b>
or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>

<?php echo CHtml::link('Advanced Search','#',array('class'=>'search-button')); ?>
<div class="search-form" style="display:none">
<?php $this->renderPartial('_search',array(
	'model'=>$model,
)); ?>
</div><!-- search-form -->

<?php $this->widget('bootstrap.widgets.TbGridView', array(
	'id'=>'cart-status-log-grid',
	'dataProvider'=>$model->search(),
        'type' => [TbHtml::GRID_TYPE_HOVER],
	'filter'=>$model,
	'columns'=>array(
		//'id',
		'air_cart_id',
		//'booking_status_id',
		//'cart_status_id',
//            [
//                'name' => 'cart_status_id',
//                'value' => '\CartStatus::$cartStatusMap[$data->cart_status_id]',
//                'headerHtmlOptions' => array('style' => 'text-align:center;'),
//            ],
             [
            'name' => 'cart_status_id',
            'value' => '"<span class=\"label label-info\">" . \CartStatus::$cartStatusMap[$data->cart_status_id] . "</span>"',
            'filter' => \CartStatus::$cartStatusMap,
            'headerHtmlOptions' => ['style' => 'min-width: 100px;'],
            'type' => 'raw'
            ],
		//'user_id',
           //     'time_taken_in_min',
             [
            'name' => 'time_taken_in_min',
            'header'=>'Time Taken',     
            'value' => '!empty($data->time_taken_in_min) ? $data->toStringTimeTaken() : "Current Status"',
            'htmlOptions' => array('style' => 'text-align:left;'),
            'type' => 'raw'
        ],
		//'created',
            [
            'name' => 'created',
            'value'=>'Yii::app()->dateFormatter->format("d MMM y hh:mm",strtotime($data->created))',
            'htmlOptions' => array('style' => 'text-align:left;'),
            'type' => 'raw'
        ],
//		array(
//			'class'=>'CButtonColumn',
//		),
	),
)); ?>

<style>
    .badge, .label {font-family: sans-serif; font-size: inherit;}
</style>