<?php
/* @var $this PayGateController */
/* @var $data PayGateLog */
?>

<div class="view">

    	<b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
	<?php echo CHtml::link(CHtml::encode($data->id),array('view','id'=>$data->id)); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('status_id')); ?>:</b>
	<?php echo CHtml::encode($data->status_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('user_info_id')); ?>:</b>
	<?php echo CHtml::encode($data->user_info_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('action_id')); ?>:</b>
	<?php echo CHtml::encode($data->action_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('pg_id')); ?>:</b>
	<?php echo CHtml::encode($data->pg_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('cc_id')); ?>:</b>
	<?php echo CHtml::encode($data->cc_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('hash_our')); ?>:</b>
	<?php echo CHtml::encode($data->hash_our); ?>
	<br />

	<?php /*
	<b><?php echo CHtml::encode($data->getAttributeLabel('hash_response')); ?>:</b>
	<?php echo CHtml::encode($data->hash_response); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('pg_type')); ?>:</b>
	<?php echo CHtml::encode($data->pg_type); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('payment_mode')); ?>:</b>
	<?php echo CHtml::encode($data->payment_mode); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('token')); ?>:</b>
	<?php echo CHtml::encode($data->token); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('amount')); ?>:</b>
	<?php echo CHtml::encode($data->amount); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('convince_fee')); ?>:</b>
	<?php echo CHtml::encode($data->convince_fee); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('discount')); ?>:</b>
	<?php echo CHtml::encode($data->discount); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('error')); ?>:</b>
	<?php echo CHtml::encode($data->error); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('bank_ref')); ?>:</b>
	<?php echo CHtml::encode($data->bank_ref); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('unmapped_status')); ?>:</b>
	<?php echo CHtml::encode($data->unmapped_status); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('raw_response')); ?>:</b>
	<?php echo CHtml::encode($data->raw_response); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('request_id')); ?>:</b>
	<?php echo CHtml::encode($data->request_id); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('updated')); ?>:</b>
	<?php echo CHtml::encode($data->updated); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('note')); ?>:</b>
	<?php echo CHtml::encode($data->note); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('user_ip')); ?>:</b>
	<?php echo CHtml::encode($data->user_ip); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('user_proxy')); ?>:</b>
	<?php echo CHtml::encode($data->user_proxy); ?>
	<br />

	<b><?php echo CHtml::encode($data->getAttributeLabel('user_browser')); ?>:</b>
	<?php echo CHtml::encode($data->user_browser); ?>
	<br />

	*/ ?>

</div>