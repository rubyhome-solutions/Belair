<?php
/* @var $this AirCartController */
/* @var $data AirCart */
?>

<div class="view">

    <b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('user_id')); ?>:</b>
    <?php echo CHtml::encode($data->user_id); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('booking_status_id')); ?>:</b>
    <?php echo CHtml::encode($data->booking_status_id); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('loged_user_id')); ?>:</b>
    <?php echo CHtml::encode($data->loged_user_id); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('payment_status_id')); ?>:</b>
    <?php echo CHtml::encode($data->payment_status_id); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('created')); ?>:</b>
    <?php echo CHtml::encode($data->created); ?>
    <br />

    <?php /*
      <b><?php echo CHtml::encode($data->getAttributeLabel('note')); ?>:</b>
      <?php echo CHtml::encode($data->note); ?>
      <br />

     */ ?>

</div>