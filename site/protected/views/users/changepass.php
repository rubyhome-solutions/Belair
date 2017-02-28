<?php
/* @var $this SiteController */
/* @var $model ChangePassForm */
/* @var $form CActiveForm  */

$this->pageTitle = Yii::app()->name . ' - Change password';
//$this->breadcrumbs=array('Login',);
//Yii::import('ext.bootstrap.helpers.TbHtml');
?>

<h2>Password change</h2>
<?php
foreach (Yii::app()->user->getFlashes() as $key => $value) {
    echo TbHtml::alert($key, $value, array('style' => 'max-width: 520px;'));
}
?>

<p>Please fill out the following form:</p>

<div class="form span6">
    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'login-form',
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
        <p class="note">Fields with <span class="required">*</span> are required.</p>
        <?php
        echo $form->passwordFieldControlGroup($model, 'oldPassword');
        echo $form->passwordFieldControlGroup($model, 'newPassword');
        echo $form->passwordFieldControlGroup($model, 'newPassword2');

        echo TbHtml::formActions(array(
            TbHtml::submitButton('Change password', array('color' => TbHtml::BUTTON_COLOR_PRIMARY)),
            TbHtml::resetButton('Reset'),
        ));
        $this->endWidget();
        ?>
    </fieldset>
</div><!-- form -->
