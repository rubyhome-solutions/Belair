<?php
/* @var $this OldSiteDataController */
/* @var $model OldSiteData */

$this->breadcrumbs=array(
	'Old Site Datas'=>array('admin'),
	'Update',
);

?>

<h1>Update OldSiteData <?php echo $model->id; ?></h1>

<?php $this->renderPartial('_form', array('model'=>$model)); ?>