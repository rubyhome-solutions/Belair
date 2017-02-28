<?php
/* @var $this OldSiteDataController */
/* @var $model OldSiteData */

$this->breadcrumbs=array(
	'Old Site Datas'=>array('admin'),
	'Manage',
);


Yii::app()->clientScript->registerScript('search', "
$('.search-button').click(function(){
	$('.search-form').toggle();
	return false;
});
$('.search-form form').submit(function(){
	$('#old-site-data-grid').yiiGridView('update', {
		data: $(this).serialize()
	});
	return false;
});
");
?>

<h1>Manage Old Site Datas</h1>

<p>
You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>&lt;&gt;</b>
or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>


<?php $this->widget('zii.widgets.grid.CGridView', array(
	'id'=>'old-site-data-grid',
	'dataProvider'=>$model->search(),
	'filter'=>$model,
	'columns'=>array(
		//'id',
		//'txdate',
            ['name'=>'txdate',
                'filter'=>false
                
            ],
		'txid',
		'booking_status',
		'payment_status',
		'sector',
		
		'dom_int',
		'pax_name',
		//'amount',
		'pax_details',
		'apnr',
		//'carrier',
	    //	'travel_date',
            ['name'=>'travel_date',
                'filter'=>false
                
            ],
		/*'booking_type',
		'supplier',
		'channel',
		*/
		array(
			'class'=>'CButtonColumn',
		),
	),
)); ?>
