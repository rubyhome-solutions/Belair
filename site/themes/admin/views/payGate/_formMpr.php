<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */
/* @var $form TbActiveForm */
/* @var $isStaffLogged */

//$userTypeId = \Utils::getActiveUserTypeId();
if ($isStaffLogged) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, 'The default payment gateway is choosen based on the client type. Note that you still can <b>override</b> the default setting if needed!', ['style' => 'max-width:100%;']);
}
//\Utils::dbgYiiLog($model->attributes);
?>

<div class="ibox-content manualPayment">
<div class="form">
    <fieldset class="span6">

        <?php
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'pay-gate-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'enableAjaxValidation' => false,
        ));

        echo $form->errorSummary($model);
        echo $form->hiddenField($model, 'user_info_id');
        echo $form->hiddenField($model, 'original_currency_id');
        echo $form->hiddenField($model, 'currency_id');
        echo $form->textFieldControlGroup($model, 'amount', ['prepend' => $model->currency->code, 'class' => 'input-small']);
        echo $form->textFieldControlGroup($model, 'air_cart_id', ['span'=>1]);
        echo $form->textAreaControlGroup($model, 'reason', [
            'placeholder' => 'The payment reason for client\'s reference',
            'style' => 'width: 90%',
            'rows' => "3"
        ]);
        if ($isStaffLogged) {
            echo $form->dropDownListControlGroup($model, 'pg_id', CHtml::listData(PaymentGateway::model()->findAll([
                                'order' => 'id DESC',
                                'condition' => 'is_active = 1',
                            ]), 'id', 'name'));
            echo $form->textAreaControlGroup($model, 'note', [
                'placeholder' => 'Notes visible to the staff only',
                'style' => 'width: 90%',
                'rows' => "3",
            ]);
            
            echo $form->textFieldControlGroup($model, 'convince_fee', ['style' => 'display: none;']);
            echo TbHtml::checkBoxControlGroup('autoConvinceFee', true, [
                'label' => 'Default convenince fee',
                'onclick' => '$("#PayGateLog_convince_fee").toggle()'
            ]);
        }
        ?>

        <div class="form-actions">
            <?php
            echo TbHtml::submitButton($model->isNewRecord ? 'Create payment request' : 'Save the request', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
            ));
            ?>
        </div>

        <?php $this->endWidget(); ?>
    </fieldset>
</div><!-- form -->
</div>