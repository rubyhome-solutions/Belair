<?php
/* @var $this TicketRulesCardsController */
/* @var $model TicketRulesCards */
/* @var $form CActiveForm */
?>

<style>

tfoot tr {background-color: beige;}
</style>
<div class="form">

    <?php
    $airlinesParams = array('order' => 'code');
    $listAirlines = CHtml::listData(Carrier::model()->findAll($airlinesParams), 'id', 'code');
        
    $form = $this->beginWidget('CActiveForm', array(
        'id' => 'ticket-rules-cards-form',
        // Please note: When you enable ajax validation, make sure the corresponding
        // controller action is handling ajax validation correctly.
        // There is a call to performAjaxValidation() commented in generated controller code.
        // See class documentation of CActiveForm for details on this.
        'enableAjaxValidation' => false,
    ));
    ?>

    <p class="note">Fields with <span class="required">*</span> are required.</p>

<?php echo $form->errorSummary($model); ?>

    <div class="row">
        <?php echo $form->labelEx($model, 'airline_id'); ?>
        <?php echo $form->dropDownList($model, 'airline_id', $listAirlines, array());
        ?>
        <?php echo $form->error($model, 'airline_id'); ?>
    </div>

	<div class="row">
		<?php echo $form->labelEx($model,'journey_type'); ?>
		<?php echo $form->dropDownList($model,'journey_type', \TicketRulesCards::$journey); ?>
		<?php echo $form->error($model,'journey_type'); ?>
	</div>
   

    <div class="row buttons">
<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
    </div>

<?php $this->endWidget(); ?>

</div><!-- form -->

<?php 
if($model->id){
$this->renderPartial('ticket_rules_grid', array('model'=>$model)); 
}
?>
