<?php
/* @var $this SiteController */
/* @var $model Users */
/* @var $form CActiveForm  */

$this->pageTitle = \Yii::app()->name . ' - Revive pass';
?>

<h2>Choose your password</h2>
<div class="form span6">
    <?php
    $model->password = null;
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'revivepass-form',
        'htmlOptions' => ['autocomplete' => 'off'],
        'enableClientValidation' => true,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
        'clientOptions' => array(
            'validateOnSubmit' => true,
            'errorCssClass' => 'error-check',
            'successCssClass' => 'success-check'
        ),
    ));
    ?>

    <fieldset>
        <input type="password" style="display:none"/>
        <?php
        echo $form->passwordFieldControlGroup($model, 'password', ['label' => 'New password', 'autocomplete' => "off"]);
        echo $form->passwordFieldControlGroup($model, 'password2', ['label' => 'New password again', 'autocomplete' => "off"]);
        echo TbHtml::formActions(array(
            TbHtml::submitButton('Set password', array('color' => TbHtml::BUTTON_COLOR_PRIMARY)),
        ));
        $this->endWidget();
        ?>
    </fieldset>
</div><!-- form -->
