<?php
/* @var $this OldSiteDataController */
/* @var $model OldSiteData */

$this->breadcrumbs=array(
	'Old Site Datas'=>array('index'),
	'Create',
);

$this->menu=array(
	array('label'=>'List OldSiteData', 'url'=>array('index')),
	array('label'=>'Manage OldSiteData', 'url'=>array('admin')),
);
?>

<h1>Create OldSiteData</h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>