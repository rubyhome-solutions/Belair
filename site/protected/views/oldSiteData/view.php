<?php
/* @var $this OldSiteDataController */
/* @var $model OldSiteData */

$this->breadcrumbs=array(
	'Old Site Datas'=>array('index'),
	$model->id,
);

$this->menu=array(
	array('label'=>'List OldSiteData', 'url'=>array('index')),
	array('label'=>'Create OldSiteData', 'url'=>array('create')),
	array('label'=>'Update OldSiteData', 'url'=>array('update', 'id'=>$model->id)),
	array('label'=>'Delete OldSiteData', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
	array('label'=>'Manage OldSiteData', 'url'=>array('admin')),
);
?>

<h1>View OldSiteData #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView', array(
	'data'=>$model,
	'attributes'=>array(
		'id',
		'txdate',
		'txid',
		'booking_status',
		'payment_status',
		'sector',
		'dom_int',
		'pax_name',
		'amount',
		'pax_details',
		'apnr',
		'carrier',
		'travel_date',
		'booking_type',
		'supplier',
		'channel',
	),
)); ?>
