<?php
/* @var $this TicketRulesNotesController */
/* @var $data TicketRulesNotes */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

        <b><?php echo CHtml::encode($data->getAttributeLabel('note_id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->note_id), array('view', 'id'=>$data->note_id)); ?>
	<br />
	<b><?php echo CHtml::encode($data->getAttributeLabel('airline_code')); ?>:</b>
	<?php echo CHtml::encode($data->airline_code); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('iata_on_basic')); ?>:</b>
	<?php echo CHtml::encode($data->iata_on_basic); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('instructions')); ?>:</b>
	<?php echo CHtml::encode($data->instructions); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('created')); ?>:</b>
	<?php echo CHtml::encode($data->created); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('airline_with_remarks')); ?>:</b>
	<?php echo CHtml::encode($data->airline_with_remarks); ?>
	<br />


</div>