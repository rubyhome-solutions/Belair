<?php
/* @var $this TicketRulesNotesController */
/* @var $model TicketRulesNotes */
/* @var $form CActiveForm */
?>

<div class="form">
<?php
$airlinesParams = array('order' => 'code');
$listAirlines = CHtml::listData(Carrier::model()->findAll($airlinesParams), 'code', 'code');
?>
<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'ticket-rules-notes-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>
        
        <div class="row">
		<?php echo $form->labelEx($model,'note_id'); ?>
		<?php echo $form->textField($model,'note_id',array('size'=>10,'maxlength'=>200)); ?>
		<?php echo $form->error($model,'note_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'airline_code'); ?>
		<?php echo $form->dropDownList($model,'airline_code', 
                                    $listAirlines,array()); ?>
		<?php echo $form->error($model,'airline_code'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'iata_on_basic'); ?>
		<?php echo $form->textField($model,'iata_on_basic',array('size'=>20,'maxlength'=>20)); ?>
		<?php echo $form->error($model,'iata_on_basic'); ?>
	</div>

        <div class="row">
		<?php echo $form->labelEx($model,'airline_with_remarks'); ?>
		<?php echo $form->textArea($model,'airline_with_remarks',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'airline_with_remarks'); ?>
	</div>
        
	<div class="row">
		<?php echo $form->labelEx($model,'instructions'); ?>
		<?php echo $form->textArea($model,'instructions',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'instructions'); ?>
	</div>


	

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->