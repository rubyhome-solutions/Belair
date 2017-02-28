<?php
/* @var $this TicketRulesAirlineController */
/* @var $data TicketRulesAirline */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('airline_code')); ?>:</b>
	<?php echo CHtml::encode($data->airline_code); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('iata_on_basic')); ?>:</b>
	<?php echo CHtml::encode($data->iata_on_basic); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('airline_name')); ?>:</b>
	<?php echo CHtml::encode($data->airline_name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_a_agent_id')); ?>:</b>
	<?php echo CHtml::encode($data->source_a_agent_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_a_rbd')); ?>:</b>
	<?php echo CHtml::encode($data->source_a_rbd); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_a_remark')); ?>:</b>
	<?php echo CHtml::encode($data->source_a_remark); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('source_b_agent_id')); ?>:</b>
	<?php echo CHtml::encode($data->source_b_agent_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_b_rbd')); ?>:</b>
	<?php echo CHtml::encode($data->source_b_rbd); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_b_remark')); ?>:</b>
	<?php echo CHtml::encode($data->source_b_remark); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_c_agent_id')); ?>:</b>
	<?php echo CHtml::encode($data->source_c_agent_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_c_rbd')); ?>:</b>
	<?php echo CHtml::encode($data->source_c_rbd); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('source_c_remark')); ?>:</b>
	<?php echo CHtml::encode($data->source_c_remark); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('created')); ?>:</b>
	<?php echo CHtml::encode($data->created); ?>
	<br />

	*/ ?>

</div>