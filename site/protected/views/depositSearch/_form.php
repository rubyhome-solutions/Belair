<?php
/* @var $this DepositSearchController */
/* @var $model DepositSearch */
/* @var $form TbActiveForm */
?>

<div class="form span6">
    <fieldset>
        <?php
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'deposit-search-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            // Please note: When you enable ajax validation, make sure the corresponding
            // controller action is handling ajax validation correctly.
            // There is a call to performAjaxValidation() commented in generated controller code.
            // See class documentation of CActiveForm for details on this.
            'enableAjaxValidation' => false,
            'enableClientValidation' => true,
        ));

        echo $form->errorSummary($model);
        echo $form->textFieldControlGroup($model, 'amount', ['placeholder' => 'Deposited amount']);
        echo $form->textFieldControlGroup($model, 'date_made', ['placeholder' => 'YYYY-MM-DD']);
        $this->widget('zii.widgets.jui.CJuiDatePicker', array(
            'name' => 'dummy',
            'id' => 'DepositSearch_date_made',
            // additional javascript options for the date picker plugin
            'options' => array(
                //                'showAnim' => 'fold',
                'dateFormat' => 'yy-mm-dd',
                'changeMonth' => 'true',
                'changeYear' => 'true',
                'yearRange' => 'c-1:c+1',
                'defaultDate' => '-2D',
                'maxDate' => "+1D",
                'minDate' => "-2M",
            ),
            'htmlOptions' => array(
                'style' => 'display: none',
            ),
        ));

        echo $form->listBoxControlGroup($model, 'bank_id', DepositSearch::$bankDetails, ['displaySize'=>9]);
        echo $form->textAreaControlGroup($model, 'reason', [
            'placeholder' => 'Reason for the payment',
            'rows' => 5,
            'style' => 'width: 80%',
        ]);
        ?>

        <div class="form-actions">
            <?php
            echo TbHtml::submitButton('Please find the payment', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
            ));
            ?>
        </div>
    </fieldset>
    <?php $this->endWidget(); ?>

</div><!-- form -->