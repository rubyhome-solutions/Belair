<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */
/* @var $form TbActiveForm */

$totalAmount = $model->amount + $model->convince_fee;
?>

<div class="form span5 center">
    <fieldset>
        <h3>Netbanking: <small>Select your bank</small></h3>

        <?php
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'tp-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'enableAjaxValidation' => false,
        ));

        echo $form->errorSummary($model);
        echo TbHtml::dropDownList('tpBank', 470, [
            470 => 'TechProcess test bank',
                ], [
            'style' => 'width: 90%',
            'id' => 'tpBank',
        ]);
        if (empty($model->convince_fee)) {
            $convFee = '';
        } else {
            $convFee = "<small>(convenience fee of {$model->convince_fee} is added)</small>";
        }
        ?>
        <p style="text-align: left; margin-top: 15px; padding-left: 20px;">Total amount: <b><?php echo number_format($totalAmount) . "</b> $convFee"; ?></p>
        <div class="form-actions" style="padding-left: 12%;">
            <?php
            echo TbHtml::button('Submit', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
                'onclick' => "ajaxSubmit(); return false;"
            ));
            ?>
        </div>
        <?php $this->endWidget(); ?>
    </fieldset>
</div>
<style>
    .center {text-align: center}
</style>
<script>
    function ajaxSubmit() {
        bank = $('#tpBank').val();
        $.post('', {tpBank: bank}, function (data) {
            if (typeof data.url !== 'undefined') {
                window.location.href = data.url;
            } else {
                alert('Error');
            }
        }, 'json');
    }
</script>