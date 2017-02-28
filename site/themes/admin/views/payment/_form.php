<?php
/* @var $this PaymentController */
/* @var $model Payment */
/* @var $form TbActiveForm */
?>

<div class="form">

    <?php $form=$this->beginWidget('bootstrap.widgets.TbActiveForm', array(
	'id'=>'payment-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

    <p class="help-block">Fields with <span class="required">*</span> are required.</p>

    <?php echo $form->errorSummary($model); ?>

            <?php echo $form->textFieldControlGroup($model,'distributor_id',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'loged_user_id',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'transfer_type_id',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'user_id',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'currency_id',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'created',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'old_balance',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'amount',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'new_balance',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'tds',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'approved',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'markup',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'service_tax',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'commision',array('span'=>5)); ?>

                <?php echo $form->textFieldControlGroup($model,'note',array('span'=>5)); ?>

            <div class="form-actions">
        <?php echo TbHtml::submitButton($model->isNewRecord ? 'Create' : 'Save',array(
		    'color'=>TbHtml::BUTTON_COLOR_PRIMARY,
		    'size'=>TbHtml::BUTTON_SIZE_LARGE,
		)); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->