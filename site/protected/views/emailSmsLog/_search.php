<?php
/* @var $this EmailSmsLogController */
/* @var $model EmailSmsLog */
/* @var $form CActiveForm */
?>

<div class="wide form">

    <?php $form=$this->beginWidget('bootstrap.widgets.TbActiveForm', array(
	'action'=>Yii::app()->createUrl($this->route),
	'method'=>'get',
)); ?>

                    <?php echo $form->textFieldControlGroup($model,'id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'contact_type',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'sender',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'receiver',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'content',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'created',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'air_cart_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'content_type',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'user_id',array('span'=>5)); ?>

                    <?php echo $form->textFieldControlGroup($model,'subject',array('span'=>5)); ?>

        <div class="form-actions">
        <?php echo TbHtml::submitButton('Search',  array('color' => TbHtml::BUTTON_COLOR_PRIMARY,));?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- search-form -->