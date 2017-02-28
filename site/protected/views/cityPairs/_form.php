<?php
/* @var $this CityPairsController */
/* @var $model CityPairs */
/* @var $form CActiveForm */
?>

<div class="form">

    <?php
    $form = $this->beginWidget('CActiveForm', array(
        'id' => 'city-pairs-_form-form',
        // Please note: When you enable ajax validation, make sure the corresponding
        // controller action is handling ajax validation correctly.
        // See class documentation of CActiveForm for details on this,
        // you need to use the performAjaxValidation()-method described there.
        'enableAjaxValidation' => false,
    ));
    ?>

    <p class="note">Fields with <span class="required">*</span> are required.</p>

    <?php echo $form->errorSummary($model); ?>

    <div class="row">
        <?php echo $form->labelEx($model, 'source_id'); ?>
        <?php echo $form->textField($model, 'source_id'); ?>
        <?php echo $form->error($model, 'source_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'destination_id'); ?>
        <?php echo $form->textField($model, 'destination_id'); ?>
        <?php echo $form->error($model, 'destination_id'); ?>
    </div>

    <div class="row">
        <?php echo $form->labelEx($model, 'carrier_id'); ?>
        <?php echo $form->textField($model, 'carrier_id'); ?>
        <?php echo $form->error($model, 'carrier_id'); ?>
    </div>


    <div class="row buttons">
        <?php echo CHtml::submitButton('Submit'); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->