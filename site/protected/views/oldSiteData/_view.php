<?php
/* @var $this OldSiteDataController */
/* @var $data OldSiteData */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('txdate')); ?>:</b>
	<?php echo CHtml::encode($data->txdate); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('txid')); ?>:</b>
	<?php echo CHtml::encode($data->txid); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('booking_status')); ?>:</b>
	<?php echo CHtml::encode($data->booking_status); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('payment_status')); ?>:</b>
	<?php echo CHtml::encode($data->payment_status); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('sector')); ?>:</b>
	<?php echo CHtml::encode($data->sector); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('dom_int')); ?>:</b>
	<?php echo CHtml::encode($data->dom_int); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('pax_name')); ?>:</b>
	<?php echo CHtml::encode($data->pax_name); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('amount')); ?>:</b>
	<?php echo CHtml::encode($data->amount); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('pax_details')); ?>:</b>
	<?php echo CHtml::encode($data->pax_details); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('apnr')); ?>:</b>
	<?php echo CHtml::encode($data->apnr); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('carrier')); ?>:</b>
	<?php echo CHtml::encode($data->carrier); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('travel_date')); ?>:</b>
	<?php echo CHtml::encode($data->travel_date); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('booking_type')); ?>:</b>
	<?php echo CHtml::encode($data->booking_type); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('supplier')); ?>:</b>
	<?php echo CHtml::encode($data->supplier); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('channel')); ?>:</b>
	<?php echo CHtml::encode($data->channel); ?>
	<br />

	*/ ?>

</div>