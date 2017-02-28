<?php
/* @var $this CartStatusLogController */
/* @var $model CartStatusLog */
/* @var $form CActiveForm */
?>

<div class="wide form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

	<div class="row">
		<?php echo $form->label($model,'id'); ?>
		<?php echo $form->textField($model,'id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'air_cart_id'); ?>
		<?php echo $form->textField($model,'air_cart_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'booking_status_id'); ?>
		<?php echo $form->textField($model,'booking_status_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'cart_status_id'); ?>
		<?php echo $form->textField($model,'cart_status_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'user_id'); ?>
		<?php echo $form->textField($model,'user_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'created'); ?>
		<?php echo $form->textField($model,'created'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton('Search'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- search-form -->