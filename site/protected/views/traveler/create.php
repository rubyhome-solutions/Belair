<?php
/* @var $this TravelerController */
/* @var $model Traveler */

$this->breadcrumbs = array(
    'Travelers' => array('admin'),
    'Create',
);
?>
<div class="form span5" style="margin-left: 0;">
    <?php $this->renderPartial('_form', array('model' => $model)); ?>
</div>
