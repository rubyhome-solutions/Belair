<?php
/* @var $this TicketCardsInfoController */
/* @var $model TicketCardsInfo */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'ticket-cards-info-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>
    <div class="row">
		<?php echo $form->labelEx($model,'card_type'); ?>
		<?php echo $form->textField($model,'card_type',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'card_type'); ?>
	</div>
	<div class="row">
		<?php echo $form->labelEx($model,'card_no'); ?>
		<?php echo $form->textField($model,'card_no',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'card_no'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'exp_month'); ?>
        <?php echo $form->dropDownList($model,'exp_month', \Utils::getMonthArray(),array()); ?>
		<?php echo $form->error($model,'exp_month'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'exp_year'); ?>
        <?php echo $form->dropDownList($model,'exp_year',\Utils::getCardYearArray(),array() ); ?>
		<?php echo $form->error($model,'exp_year'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'status'); ?>
        <?php echo $form->dropDownList($model,'status',\TicketCardsInfo::$InActMap,array() ); ?>
		<?php echo $form->error($model,'status'); ?>
	</div>
	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Save' : 'Update'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->