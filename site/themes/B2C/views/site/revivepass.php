<?php
/* @var $this SiteController */
/* @var $model Users */
/* @var $form CActiveForm  */

$this->pageTitle = \Yii::app()->name . ' - Revive pass';

Yii::app()->clientScript
    ->registerScriptFile("https://www.google.com/recaptcha/api.js", \CClientScript::POS_HEAD);

?>


<div class="ui segment" style="max-width: 800px; margin: 20px auto;">
    <div class="ui dividing header">Choose your password</div>

    <?php
    $form = $this->beginWidget('CActiveForm', array(
        'id'=>'reset-form',
        'enableAjaxValidation'=>false,
        'enableClientValidation'=>true,
        'focus'=>array($model,'password'),
        'htmlOptions' => [ 'class' => 'ui form' ],
        'clientOptions' => array(
            'validateOnSubmit' => true,
            'errorCssClass' => 'error',
            'successCssClass' => 'success'
        ),
    ));
    ?>

    <div class="two fields">
        <div class="required field">
            <label>New Password</label>
            <?php echo $form->passwordField($model, 'password', ['label' => 'New password', 'autocomplete' => "off", 'value' => '']); ?>
        </div>
        <div class="required field">
            <label>New password again</label>
            <?php echo $form->passwordField($model, 'password2', ['label' => 'New password again', 'autocomplete' => "off"]); ?>
        </div>
    </div>

    <div class="field">
       
        
        <?php if (strstr(\Yii::app()->request->serverName, 'cheapticket.in')) { ?>
        <div class="g-recaptcha" data-sitekey="6LdvPBETAAAAAN8cACI0kDDfcja-YmG4F2APfYXq" data-callback="zzz"></div>    
        <?php } else { ?>
            
        <div class="g-recaptcha" data-sitekey="6LdigAkTAAAAACJUh-8kH8T4ITzE9PDrLw1M6U55" data-callback="zzz"></div>
        <?php } ?>
    </div>

    <div class="ui errors">
        <?php echo $form->error($model, 'password', ['errorCssClass' => 'error']); ?>
        <?php echo $form->error($model, 'password2', ['errorCssClass' => 'error']); ?>
        <br>
    </div>

    <?php echo CHtml::submitButton('Change Password', [ 'class' => 'ui button disabled', 'id' => 'submit' ]); ?>


    <?php $this->endWidget(); ?>
</div>

<script>
    function zzz() {
        $('#submit').removeClass('disabled');
    }
</script>