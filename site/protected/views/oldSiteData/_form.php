<?php
/* @var $this OldSiteDataController */
/* @var $model OldSiteData */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'old-site-data-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'txdate'); ?>
		<?php echo $form->textField($model,'txdate'); ?>
		<?php echo $form->error($model,'txdate'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'txid'); ?>
		<?php echo $form->textField($model,'txid',array('size'=>50,'maxlength'=>50)); ?>
		<?php echo $form->error($model,'txid'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'booking_status'); ?>
		<?php echo $form->textField($model,'booking_status',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'booking_status'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'payment_status'); ?>
		<?php echo $form->textField($model,'payment_status',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'payment_status'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'sector'); ?>
		<?php echo $form->textField($model,'sector',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'sector'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'dom_int'); ?>
		<?php echo $form->textField($model,'dom_int',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'dom_int'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'pax_name'); ?>
		<?php echo $form->textArea($model,'pax_name',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'pax_name'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'amount'); ?>
		<?php echo $form->textField($model,'amount'); ?>
		<?php echo $form->error($model,'amount'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'pax_details'); ?>
		<?php echo $form->textArea($model,'pax_details',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'pax_details'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'apnr'); ?>
		<?php echo $form->textField($model,'apnr',array('size'=>50,'maxlength'=>50)); ?>
		<?php echo $form->error($model,'apnr'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'carrier'); ?>
		<?php echo $form->textField($model,'carrier',array('size'=>5,'maxlength'=>5)); ?>
		<?php echo $form->error($model,'carrier'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'travel_date'); ?>
		<?php echo $form->textField($model,'travel_date'); ?>
		<?php echo $form->error($model,'travel_date'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'booking_type'); ?>
		<?php echo $form->textField($model,'booking_type',array('size'=>50,'maxlength'=>50)); ?>
		<?php echo $form->error($model,'booking_type'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'supplier'); ?>
		<?php echo $form->textField($model,'supplier',array('size'=>15,'maxlength'=>15)); ?>
		<?php echo $form->error($model,'supplier'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'channel'); ?>
		<?php echo $form->textField($model,'channel',array('size'=>60,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'channel'); ?>
	</div>

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->