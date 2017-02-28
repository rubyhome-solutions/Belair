<?php
/* @var $this UserInfoController */
/* @var $model UserInfo */
?>

<?php
$this->breadcrumbs=array(
	'User Infos'=>array('index'),
	$model->name,
);

$this->menu=array(
array('label'=>'List UserInfo', 'url'=>array('index')),
array('label'=>'Create UserInfo', 'url'=>array('create')),
array('label'=>'Update UserInfo', 'url'=>array('update', 'id'=>$model->id)),
array('label'=>'Delete UserInfo', 'url'=>'#', 'linkOptions'=>array('submit'=>array('delete','id'=>$model->id),'confirm'=>'Are you sure you want to delete this item?')),
array('label'=>'Manage UserInfo', 'url'=>array('admin')),
);
?>

<h1>View UserInfo #<?php echo $model->id; ?></h1>

<?php $this->widget('zii.widgets.CDetailView',array(
'htmlOptions' => array(
'class' => 'table table-striped table-condensed table-hover',
),
'data'=>$model,
'attributes'=>array(
		'id',
		'currency_id',
		'user_type_id',
		'city_id',
		'pan_name',
		'pan_number',
		'stn_number',
		'name',
		'email',
		'mobile',
		'balance',
		'credit_limit',
		'pincode',
		'address',
		'rating',
),
)); ?>