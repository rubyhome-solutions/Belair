<?php
$this->breadcrumbs=array(
	'Promo Codes'=>array('index'),
	 "Create",
);

?>
<div class="form span5" style="margin-left: 0;">
    <?php $this->renderPartial('_form', array('model' => $model,'promoFilterString' => $promoFilterString)); ?>
</div>