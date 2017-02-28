<?php
/* @var $this TravelerController */
/* @var $model Traveler */
?>

<?php
$this->breadcrumbs=array(
	'Travelers'=>array('index'),
	$model->title,
);

$this->menu=array(
array('label'=>'List Traveler', 'url'=>array('index')),
array('label'=>'Create Traveler', 'url'=>array('create')),
array('label'=>'Update Traveler', 'url'=>array('update', 'id'=>$model->id)),
array('label'=>'Delete Traveler', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
array('label'=>'Manage Traveler', 'url'=>array('admin')),
);
?>

<h1>View Traveler #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView',array(
'htmlOptions' => array(
'class' => 'table table-striped table-condensed table-hover',
),
'data'=>$model,
'attributes'=>array(
		'id',
		'user_info_id',
		'gender_id',
		'passport_country_id',
		'city_id',
		'title',
		'first_name',
		'last_name',
		'birthdate',
		'email',
		'mobile',
		'passport_number',
		'passport_issue',
		'passport_expiry',
		'passport_place',
		'pincode',
		'address',
		'phone',
		'email2',
		'frequent_flier',
),
)); ?>