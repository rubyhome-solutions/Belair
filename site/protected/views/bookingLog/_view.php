<?php
/* @var $this BookingLogController */
/* @var $data BookingLog */
?>

<div class="view">

	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('booking_id')); ?>:</b>
	<?php echo CHtml::encode($data->booking_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('browser')); ?>:</b>
	<?php echo CHtml::encode($data->browser); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('browser_version')); ?>:</b>
	<?php echo CHtml::encode($data->browser_version); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('platform')); ?>:</b>
	<?php echo CHtml::encode($data->platform); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('is_mobile')); ?>:</b>
	<?php echo CHtml::encode($data->is_mobile); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('logs')); ?>:</b>
	<?php echo CHtml::encode($data->logs); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('booking_data')); ?>:</b>
	<?php echo CHtml::encode($data->booking_data); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('enabled')); ?>:</b>
	<?php echo CHtml::encode($data->enabled); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('created')); ?>:</b>
	<?php echo CHtml::encode($data->created); ?>
	<br />

	*/ ?>

</div>