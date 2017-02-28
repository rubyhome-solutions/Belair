<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */
/* @var $form CActiveForm */
?>

<div class="wide form">

    <?php $form=$this->beginWidget('bootstrap.widgets.TbActiveForm', array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

                    <?php echo $form->textFieldControlGroup($model,'id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'status_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'user_info_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'action_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'pg_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'cc_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'hash_our',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'hash_response',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'pg_type',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'payment_mode',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'token',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'amount',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'convince_fee',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'discount',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'error',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'bank_ref',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'unmapped_status',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'raw_response',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'request_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'updated',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'note',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'user_ip',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'user_proxy',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'user_browser',array('span'=>5)); ?>

        <div class="form-actions">
        <?php echo TbHtml::submitButton('Search',  array('color' => TbHtml::BUTTON_COLOR_PRIMARY,));?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->