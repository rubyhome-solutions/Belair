<?php
/* @var $this PaymentController */
/* @var $model Payment */
/* @var $form CActiveForm */
?>

<div class="wide form">

    <?php $form=$this->beginWidget('bootstrap.widgets.TbActiveForm', array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

                    <?php echo $form->textFieldControlGroup($model,'id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'distributor_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'loged_user_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'transfer_type_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'user_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'currency_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'created',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'old_balance',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'amount',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'new_balance',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'tds',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'approved',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'markup',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'service_tax',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'commision',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'note',array('span'=>5)); ?>

        <div class="form-actions">
        <?php echo TbHtml::submitButton('Search',  array('color' => TbHtml::BUTTON_COLOR_PRIMARY,));?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->