<?php
/* @var $this CcController */
/* @var $data Cc */
?>

<div class="view">

    <b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
    <?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('user_info_id')); ?>:</b>
    <?php echo CHtml::encode($data->user_info_id); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('name')); ?>:</b>
    <?php echo CHtml::encode($data->name); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('number')); ?>:</b>
    <?php echo CHtml::encode($data->number); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('code')); ?>:</b>
    <?php echo CHtml::encode($data->code); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('exp_date')); ?>:</b>
    <?php echo CHtml::encode($data->exp_date); ?>
    <br />

    <b><?php echo CHtml::encode($data->getAttributeLabel('note')); ?>:</b>
    <?php echo CHtml::encode($data->note); ?>
    <br />

    <?php 
    /*
      <b><?php echo CHtml::encode($data->getAttributeLabel('mask')); ?>:</b>
      <?php echo CHtml::encode($data->mask); ?>
      <br />

      <b><?php echo CHtml::encode($data->getAttributeLabel('hash')); ?>:</b>
      <?php echo CHtml::encode($data->hash); ?>
      <br />

      <b><?php echo CHtml::encode($data->getAttributeLabel('type_id')); ?>:</b>
      <?php echo CHtml::encode($data->type_id); ?>
      <br />

      <b><?php echo CHtml::encode($data->getAttributeLabel('bin_id')); ?>:</b>
      <?php echo CHtml::encode($data->bin_id); ?>
      <br />

     */ ?>

</div>