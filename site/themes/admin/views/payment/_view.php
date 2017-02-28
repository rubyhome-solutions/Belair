<?php
/* @var $this PaymentController */
/* @var $data Payment */
?>

<div class="view">

    	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id),array('view','id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('distributor_id')); ?>:</b>
	<?php echo CHtml::encode($data->distributor_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('loged_user_id')); ?>:</b>
	<?php echo CHtml::encode($data->loged_user_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('transfer_type_id')); ?>:</b>
	<?php echo CHtml::encode($data->transfer_type_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('user_id')); ?>:</b>
	<?php echo CHtml::encode($data->user_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('currency_id')); ?>:</b>
	<?php echo CHtml::encode($data->currency_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('created')); ?>:</b>
	<?php echo CHtml::encode($data->created); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('old_balance')); ?>:</b>
	<?php echo CHtml::encode($data->old_balance); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('amount')); ?>:</b>
	<?php echo CHtml::encode($data->amount); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('new_balance')); ?>:</b>
	<?php echo CHtml::encode($data->new_balance); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('tds')); ?>:</b>
	<?php echo CHtml::encode($data->tds); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('approved')); ?>:</b>
	<?php echo CHtml::encode($data->approved); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('markup')); ?>:</b>
	<?php echo CHtml::encode($data->markup); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('service_tax')); ?>:</b>
	<?php echo CHtml::encode($data->service_tax); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('commision')); ?>:</b>
	<?php echo CHtml::encode($data->commision); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('note')); ?>:</b>
	<?php echo CHtml::encode($data->note); ?>
	<br />

	*/ ?>

</div>