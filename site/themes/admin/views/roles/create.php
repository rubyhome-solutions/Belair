<?php
/* @var $this RolesController */
/* @var $model UserType */
/* @var $form TbActiveForm */

$this->breadcrumbs = array(
    'Roles' =>'/roles/index',
    'Add new role',
);

?>

<div class="form span5">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'user-type-form',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    ));
    echo $form->errorSummary($model);
    ?>
    <fieldset>
        <p class="help-block">Fields with <span class="required">*</span> are required.</p><br>
        <?php echo $form->textFieldControlGroup($model, 'name', array('maxlength' => 50, 'label'=>'Role name')); ?>
        <?php echo $form->textFieldControlGroup($model, 'leading_char', array('span' => 1, 'maxlength' => 1)); ?>

        <div class="form-actions">
            <?php
            echo TbHtml::submitButton($model->isNewRecord ? 'Create new role' : 'Save role', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
            ));
            ?>
        </div>
    </fieldset>
    <?php $this->endWidget(); ?>

</div><!-- form -->