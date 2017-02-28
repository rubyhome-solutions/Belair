<?php
/* @var $this UserInfoController */
/* @var $model UserInfo */
/* @var $user Users */
/* @var $form TbActiveForm */
$this->breadcrumbs = array(
    'Users' => array('users/manage?selectedvalue=' . $user->id),
    'Company info',
);
$isStaffLogged = Authorization::getIsStaffLogged();
//Yii::log(print_r($user->userInfo->user_type_id, true));
?>
<div class="form span4" style="margin-left: 0px;">
    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'companyInfo-form',
        'enableAjaxValidation' => false,
        'enableClientValidation' => true,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    ));
    echo $form->errorSummary($model, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
    ?>
    <fieldset class="span3" style="margin-left: 1%">
        <legend>Staff information:</legend>
        <?php
        echo $form->textFieldControlGroup($user, 'name');
        echo $form->textFieldControlGroup($user, 'email');
        echo $form->textFieldControlGroup($user, 'mobile');
        echo $form->dropDownListControlGroup($model, 'user_type_id', CHtml::listData(UserType::model()->findAll(array('order' => 'leading_char')), 'id', 'name'), array('disabled' => !$isStaffLogged, 'span' => 2, 'label'=>'Staff type'));
//        echo $form->textFieldControlGroup($model, 'balance', array('disabled' => true, 'span' => 2));
//        echo $form->textFieldControlGroup($model, 'credit_limit', array('disabled' => !$isStaffLogged, 'span' => 2));
        ?>
        <div class="control-group">
            <label style="padding-top: 0;" class="control-label" for="UserInfo_rating">Staff Rating</label>
            <div class="controls" style="padding-left: 5px;margin-top: 2px;">
                <?php
                $this->widget('CStarRating', array(
                    'name' => 'UserInfo[rating]',
                    'id' => 'UserInfo_rating',
                    'readOnly' => !$isStaffLogged,
                    'resetText' => 'Zero rating',
                    'value' => $model->rating
                ));
                ?>
            </div>
        </div>

    </fieldset>

    <div class="clearfix"></div>
    <div class="form-actions text-center" style="padding-left: 0;">
        <?php
        echo TbHtml::submitButton('Update staff member', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
        ));
        ?>
    </div>

    <?php $this->endWidget(); ?>
</div>

<style>
    legend {
        margin-bottom: 0;
        width: initial;
        border-bottom: 0;            
    }
    legend + .control-group {
        margin-top: 0;
    }
    .form-horizontal .control-label {
        width: 116px;
    }
    .form-horizontal .controls {
        margin-left: 120px;
    }
</style>

