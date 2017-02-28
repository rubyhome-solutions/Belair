<?php
/* @var $model PaymentConvenienceFee */
/* @var $form CActiveForm */
?>

<div class="form">

<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'payment-convenience-fee-form',
)); 
$clientSources = CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name');
$payment_sub_type = [\PaymentConfiguration::ALL => 'All'];
if(!empty($model->payment_type) && $model->payment_type != \PaymentConfiguration::ALL) {
    $payment_sub_type = \PaymentConfiguration::$paymentSubTypeMap[$model->payment_type];
}

?>
	<?php //echo $form->errorSummary($model); 
        if($model->commercial_rule_id === \PaymentConvenienceFee::DEFAULT_RULE_ID) {
    ?>
	<div class="row">
		<?php echo $form->labelEx($model,'client_source_id'); ?>
		<?php echo $form->dropDownList($model,'client_source_id', $clientSources); ?>
		<?php echo $form->error($model,'client_source_id'); ?>
	</div>
    <div class="row">
		<?php echo $form->labelEx($model,'journey_type'); ?>
		<?php echo $form->dropDownList($model,'journey_type', \PaymentConvenienceFee::$waytypeMap); ?>
		<?php echo $form->error($model,'journey_type'); ?>
	</div>
    <?php } else {
        echo $form->hiddenField($model, 'client_source_id');
        echo $form->hiddenField($model, 'journey_type');
        echo $form->hiddenField($model, 'commercial_rule_id');
    } ?>
    <div class="row">
		<?php echo $form->labelEx($model,'payment_type'); ?>
		<?php echo $form->dropDownList($model,'payment_type', \PaymentConfiguration::$paymentTypeMap, ['onchange' => 'js:getPaymentSubType(this.value)']); ?>
		<?php echo $form->error($model,'payment_type'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'payment_sub_type'); ?>
		<?php echo $form->dropDownList($model,'payment_sub_type', $payment_sub_type); ?>
		<?php echo $form->error($model,'payment_sub_type'); ?>
	</div>
    
	<div class="row">
		<?php echo $form->labelEx($model,'fixed'); ?>
		<?php echo $form->textField($model,'fixed'); ?>
		<?php echo $form->error($model,'fixed'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'perc'); ?>
		<?php echo $form->textField($model,'perc'); ?>
		<?php echo $form->error($model,'perc'); ?>
	</div>
    
    <div class="row">
		<?php echo $form->labelEx($model,'per_passenger'); ?>
		<?php echo $form->checkBox($model,'per_passenger'); ?>
		<?php echo $form->error($model,'per_passenger'); ?>
	</div>

	<div class="row buttons">
		<?php 
        echo TbHtml::submitButton('Save', array(
                    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                    'size' => TbHtml::BUTTON_SIZE_LARGE,
                ));
        ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->

<script type="text/javascript">
        function getPaymentSubType(value)
        {
            if(value == -1) {
                $("#PaymentConvenienceFee_payment_sub_type").html("<option value='-1'>All</option>");
                return true;
            }
            $.ajax ({
                type:'POST',
                url:'/commission/getPaymentSubType/'+value,
                dataType:'JSON',
                success:function(data) {
                     var opt="";
                     $.each(data,function(i,obj) {
                         opt+="<option value='"+obj.id+"'>"+obj.name+"</option>";
                     });
                     $("#PaymentConvenienceFee_payment_sub_type").html(opt);
                }
            });
        }
</script>
<style>
    div.form label {
        width: 20%;
        float: left;
    }
    div.form select,input{
        float: left;
    }
    div.form .errorMessage {
        display: block;
        margin-left: 2%;
        float: left;
    }
    div.form .errorSummary {
        width:50%;
    }
</style>