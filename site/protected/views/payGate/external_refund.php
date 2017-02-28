<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */

$this->breadcrumbs = [
    'Transactions' => ['admin'],
    ' External Refund',
];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
?>

<div class="form">
    <fieldset class="span6">

        <?php
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'pay-gate-external-refund-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'enableAjaxValidation' => false,
        ));

        echo $form->errorSummary($model);
        echo $form->textFieldControlGroup($model, 'amount', ['label' => 'External Refund', 'prepend' => $model->currency->code]);
        echo $form->textAreaControlGroup($model, 'reason', [
            'placeholder' => 'The refund reason for client\'s reference',
            'style' => 'width: 90%',
            'rows' => "3"
        ]);
        echo $form->textAreaControlGroup($model, 'note', [
            'placeholder' => 'Notes visible to the staff only',
            'style' => 'width: 90%',
            'rows' => "3",
        ]);
        ?>
        <div class="form-actions">
            <?php
            echo TbHtml::submitButton('Start the refund', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
            ));
            ?>
        </div>
        <?php $this->endWidget(); ?>
    </fieldset>
</div>
