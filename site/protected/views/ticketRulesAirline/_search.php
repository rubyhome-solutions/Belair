<?php
/* @var $this TicketRulesAirlineController */
/* @var $model TicketRulesAirline */
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
		<?php echo $form->label($model,'airline_code'); ?>
		<?php echo $form->textArea($model,'airline_code',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'iata_on_basic'); ?>
		<?php echo $form->textField($model,'iata_on_basic',array('size'=>10,'maxlength'=>10)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'airline_name'); ?>
		<?php echo $form->textArea($model,'airline_name',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_a_agent_id'); ?>
		<?php echo $form->textField($model,'source_a_agent_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_a_rbd'); ?>
		<?php echo $form->textArea($model,'source_a_rbd',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_a_remark'); ?>
		<?php echo $form->textArea($model,'source_a_remark',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_b_agent_id'); ?>
		<?php echo $form->textField($model,'source_b_agent_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_b_rbd'); ?>
		<?php echo $form->textArea($model,'source_b_rbd',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_b_remark'); ?>
		<?php echo $form->textArea($model,'source_b_remark',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_c_agent_id'); ?>
		<?php echo $form->textField($model,'source_c_agent_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_c_rbd'); ?>
		<?php echo $form->textArea($model,'source_c_rbd',array('rows'=>6, 'cols'=>50)); ?>
	</div>

	<div class="row">
		<?php echo $form->label($model,'source_c_remark'); ?>
		<?php echo $form->textArea($model,'source_c_remark',array('rows'=>6, 'cols'=>50)); ?>
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