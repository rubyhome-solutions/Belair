<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $form TbActiveForm */
?>

<div class="form">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'users-form',
        // Please note: When you enable ajax validation, make sure the corresponding
        // controller action is handling ajax validation correctly.
        // There is a call to performAjaxValidation() commented in generated controller code.
        // See class documentation of CActiveForm for details on this.
        'enableAjaxValidation' => false,
    ));
    ?>

    <p class="help-block">Fields with <span class="required">*</span> are required.</p>

    <?php echo $form->errorSummary($model); ?>

    <?php echo $form->textFieldControlGroup($model, 'city_id', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'email', array('span' => 5)); ?>

    <?php echo $form->checkBoxControlGroup($model, 'enabled'); ?>

    <?php echo $form->textFieldControlGroup($model, 'created', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'name', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'activated', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'mobile', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'last_login', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'last_transaction', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'deactivated', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'pincode', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'address', array('span' => 5)); ?>

    <?php echo $form->textFieldControlGroup($model, 'note', array('span' => 5)); ?>

    <div class="form-actions">
        <?php
        echo TbHtml::submitButton($model->isNewRecord ? 'Create' : 'Save', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
        ));
        ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->