<?php
/* @var $this CcController */
/* @var $model Cc */
/* @var $form TbActiveForm */
?>

<div class="form span9">
    <fieldset class="span3">
        <legend style="text-align: center;">Form of payment:</legend>
        <label><input type="radio" name="fop" value="0" checked="checked" onclick="$('#cc-details').hide()">&nbsp;Hold only</label>
        <label><input type="radio" name="fop" value="CA" onclick="$('#cc-details').hide()">&nbsp;Cash (CA)</label>
        <label><input type="radio" name="fop" value="CC" onclick="$('#cc-details').show()">&nbsp;Card (CC)</label>
    </fieldset>
    <fieldset id="cc-details" class="span5" style="margin-left: 15px; display: none;">
        <?php
        echo TbHtml::errorSummary($model, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
        echo $form->inlineRadioButtonListControlGroup($model, 'code', [
            'CA' => 'MasterCard',
            'VI' => 'Visa',
            'AX' => 'American Express',
            'DC' => 'Diners Club',
                ], [
            'style' => 'float:left; margin-right:10px;',
            'label' => false,
        ]);
        echo $form->textFieldControlGroup($model, 'name', ['label' => false, 'placeholder' => 'Name on the card', 'style' => 'width:300px;']);
        echo $form->textFieldControlGroup($model, 'number', ['label' => false, 'placeholder' => 'Card number', 'maxlength' => 16]);
        ?>
        <label style="float: left;margin-top: 6px;">Expiry date (MMYY)&nbsp;&nbsp;</label>
        <?php
        echo $form->textFieldControlGroup($model, 'exp_date', ['label' => false, 'maxlength' => 4, 'class' => 'input-mini']);
//    echo $form->textFieldControlGroup($model, 'note', ['visible'=> Authorization::getIsStaffLogged()]);
        ?>
        <p>CC validation is not done yet, mind your inputs!</p>
    </fieldset>
</div>
<div class="clearfix"></div>