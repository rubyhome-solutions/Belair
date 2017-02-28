<?php
/* @var $this OldSiteDataController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs=array(
	'Old Site Datas',
);

$this->menu=array(
	array('label'=>'Create OldSiteData', 'url'=>array('create')),
	array('label'=>'Manage OldSiteData', 'url'=>array('admin')),
);
?>

<h1>Old Site Datas</h1>

<?php $this->widget('zii.widgets.CListView', array(
	'dataProvider'=>$dataProvider,
	'itemView'=>'_view',
)); ?>
