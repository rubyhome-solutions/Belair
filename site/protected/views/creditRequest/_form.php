<?php
/* @var $this CreditRequestController */
/* @var $model CreditRequest */
/* @var $form TbActiveForm */
?>

<div class="form span6">
    <fieldset>
        <?php
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'credit-request-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'enableAjaxValidation' => false,
            'enableClientValidation' => true,
        ));

        echo $form->errorSummary($model);
        echo $form->textFieldControlGroup($model, 'amount', ['placeholder' => 'Amount']);
        echo $form->textFieldControlGroup($model, 'use_date', ['placeholder' => 'YYYY-MM-DD']);
        $this->widget('zii.widgets.jui.CJuiDatePicker', [
            'name' => 'dummy',
            'id' => 'CreditRequest_use_date',
            // additional javascript options for the date picker plugin
            'options' => array(
                'dateFormat' => 'yy-mm-dd',
                'defaultDate' => 'now',
                'maxDate' => "+7D",
                'minDate' => "now",
            ),
            'htmlOptions' => ['style' => 'display: none'],
        ]);

        echo $form->textFieldControlGroup($model, 'payback_date', ['placeholder' => 'YYYY-MM-DD']);
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name' => 'dummy2',
            'id' => 'CreditRequest_payback_date',
            // additional javascript options for the date picker plugin
            'options' => array(
                'dateFormat' => 'yy-mm-dd',
                'defaultDate' => '+7D',
                'maxDate' => "+14D",
                'minDate' => "now",
            ),
            'htmlOptions' => ['style' => 'display: none'],
        ));

        echo $form->textAreaControlGroup($model, 'reason', [
            'placeholder' => 'Reason for the credit request',
            'rows' => 5,
            'style' => 'width: 80%',
        ]);
        ?>

        <div class="form-actions">
            <?php
            echo TbHtml::submitButton('Please approve the request', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
            ));
            ?>
        </div>
    </fieldset>
    <?php $this->endWidget(); ?>

</div><!-- form -->