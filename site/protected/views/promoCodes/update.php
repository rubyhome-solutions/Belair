<?php

$this->breadcrumbs=array(
	'Promo Codes'=>array('index'),
	 "Prom Code № $model->id",
);?>
<div class="form span5" style="margin-left: 0;">
    <?php $this->renderPartial('_form', array('model' => $model,'promoFilterString' => $promoFilterString,)); ?>
</div>