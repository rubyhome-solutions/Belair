<?php
/* @var $this TicketRulesAirlineController */
/* @var $model TicketRulesAirline */
/* @var $form CActiveForm */
$cs = Yii::app()->getClientScript();
$baseUrl = Yii::app()->baseUrl;
$cs->registerCssFile($baseUrl . '/css/token-input.css');
$cs->registerCssFile($baseUrl . '/css/token-input-facebook.css');
$cs->registerScriptFile($baseUrl . '/js/jquery.tokeninput.js');
//\Utils::dbgYiiLog($notesString);
?>
<style>
    
     .table th, .table td {vertical-align: middle;}        
    .table th, td.center {
        text-align: center;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
    }
    .table.filter-table td input {width: 95%; margin-bottom: auto;}
    .table.filter-table {margin-bottom: auto;}
    .shadow {
        box-shadow: 10px 10px 5px #888888; 
        background-color: aliceblue;
    }
    .sinkavo {background-color: #f5f5ff;}
    .label {font-size: inherit;} 
</style>
<div class="form">
<?php
$airlinesParams = array('order' => 'code');
$listAirlines = CHtml::listData(Carrier::model()->findAll($airlinesParams), 'code', 'code');
$listSources = CHtml::listData(TicketRulesSources::model()->findAll(array('order' => 'agent_name')), 'id', 'agent_name');

?>
<?php $form=$this->beginWidget('CActiveForm', array(
	'id'=>'ticket-rules-airline-form',
	// Please note: When you enable ajax validation, make sure the corresponding
	// controller action is handling ajax validation correctly.
	// There is a call to performAjaxValidation() commented in generated controller code.
	// See class documentation of CActiveForm for details on this.
	'enableAjaxValidation'=>false,
)); ?>

	<p class="note">Fields with <span class="required">*</span> are required.</p>

	<?php echo $form->errorSummary($model); ?>

	<div class="row">
		<?php echo $form->labelEx($model,'airline_code'); ?>
		<?php echo $form->dropDownList($model,'airline_code', 
                                    $listAirlines,array()); ?>
		<?php echo $form->error($model,'airline_code'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'iata_on_basic'); ?>
		<?php echo $form->textField($model,'iata_on_basic',array('size'=>10,'maxlength'=>10)); ?>
		<?php echo $form->error($model,'iata_on_basic'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'airline_name'); ?>
		<?php echo $form->textArea($model,'airline_name',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'airline_name'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'source_a_agent_id'); ?>
                <?php echo $form->dropDownList($model,'source_a_agent_id', 
                                    $listSources,array('prompt'=>'Select Agent')); ?>
		<?php echo $form->error($model,'source_a_agent_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'source_a_rbd'); ?>
		<?php echo $form->textArea($model,'source_a_rbd',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'source_a_rbd'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'source_a_remark'); ?>
		<?php echo $form->textArea($model,'source_a_remark',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'source_a_remark'); ?>
	</div>

         <div class="row">
            <label >Notes A</label>
            <input id="notes_a" placeholder="Notes" type="text" value="" name="TicketRulesAirline[notes_a]" >
        </div>
        <div class="row"></div>
	<div class="row">
		<?php echo $form->labelEx($model,'source_b_agent_id'); ?>
                <?php echo $form->dropDownList($model,'source_b_agent_id', 
                                    $listSources,array('prompt'=>'Select Agent')); ?>
		<?php echo $form->error($model,'source_b_agent_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'source_b_rbd'); ?>
		<?php echo $form->textArea($model,'source_b_rbd',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'source_b_rbd'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'source_b_remark'); ?>
		<?php echo $form->textArea($model,'source_b_remark',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'source_b_remark'); ?>
	</div>
        
        <div class="row">
            <label >Notes B</label>
            <input id="notes_b" placeholder="Notes" type="text" value="" name="TicketRulesAirline[notes_b]" >
        </div>
        <div class="row"></div>
	<div class="row">
		<?php echo $form->labelEx($model,'source_c_agent_id'); ?>
                <?php echo $form->dropDownList($model,'source_c_agent_id', 
                                    $listSources,array('prompt'=>'Select Agent')); ?>
		<?php echo $form->error($model,'source_c_agent_id'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'source_c_rbd'); ?>
		<?php echo $form->textArea($model,'source_c_rbd',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'source_c_rbd'); ?>
	</div>

	<div class="row">
		<?php echo $form->labelEx($model,'source_c_remark'); ?>
		<?php echo $form->textArea($model,'source_c_remark',array('rows'=>6, 'cols'=>50)); ?>
		<?php echo $form->error($model,'source_c_remark'); ?>
	</div>
        
       <div class="row">
            <label >Notes C</label>
            <input id="notes_c" placeholder="Notes" type="text" value="" name="TicketRulesAirline[notes_c]" >
        </div>
         

	<div class="row buttons">
		<?php echo CHtml::submitButton($model->isNewRecord ? 'Create' : 'Save'); ?>
	</div>

<?php $this->endWidget(); ?>

</div><!-- form -->

<script type="text/javascript">
    $(document).ready(function () {
        
        $("#notes_a").tokenInput("/ticketRulesAirline/searchNotes",
        {searchDelay: 200, minChars: 1, preventDuplicates: true, theme: "facebook",
            <?php if(isset($notesString['notes_a'])) echo 'prePopulate:'.$notesString['notes_a'] ;  ?>});
                        
         $("#notes_b").tokenInput("/ticketRulesAirline/searchNotes",
        {searchDelay: 200, minChars: 1, preventDuplicates: true, theme: "facebook",
            <?php if(isset($notesString['notes_b'])) echo 'prePopulate:'.$notesString['notes_b'] ;  ?>});
        
         $("#notes_c").tokenInput("/ticketRulesAirline/searchNotes",
        {searchDelay: 200, minChars: 1, preventDuplicates: true, theme: "facebook",
            <?php if(isset($notesString['notes_c'])) echo 'prePopulate:'.$notesString['notes_c'] ;  ?>});
       
    });
</script>