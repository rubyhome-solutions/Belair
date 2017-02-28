<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $form CActiveForm */
?>

<div class="wide form">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'action' => Yii::app()->createUrl($this->route),
        'method' => 'get',
    ));
    ?>

    <?php echo $form->textFieldControlGroup($model, 'id', array('span' => 5)); ?>

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
        <?php echo TbHtml::submitButton('Search', array('color' => TbHtml::BUTTON_COLOR_PRIMARY,)); ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->