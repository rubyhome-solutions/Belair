<?php
/* @var $this TicketRulesSourcesController */
/* @var $model TicketRulesSources */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'ticket-rules-sources-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'agent_name'); ?>
		<?php echo $form->textArea($model,'agent_name',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'agent_name'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'amadeus_pcc'); ?>
		<?php echo $form->textField($model,'amadeus_pcc',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'amadeus_pcc'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'gal_pcc'); ?>
		<?php echo $form->textField($model,'gal_pcc',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'gal_pcc'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'contact'); ?>
		<?php echo $form->textArea($model,'contact',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'contact'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'email'); ?>
		<?php echo $form->textArea($model,'email',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'email'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'office'); ?>
		<?php echo $form->textArea($model,'office',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'office'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'night_ctc'); ?>
		<?php echo $form->textArea($model,'night_ctc',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'night_ctc'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'mobile_no'); ?>
		<?php echo $form->textArea($model,'mobile_no',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'mobile_no'); ?>
	</div>

	

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->