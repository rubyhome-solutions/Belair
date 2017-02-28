<?php
/* @var $this UsersController */
/* @var $data Users */
?>

<table class="view">
    <tr>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('id')); ?>:</b>
            <?php echo CHtml::link(CHtml::encode($data->id), array('view', 'id' => $data->id)); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('name')); ?>:</b>
            <?php echo CHtml::encode($data->name); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('email')); ?>:</b>
            <?php echo CHtml::link(CHtml::encode($data->email), "mailto:$data->email"); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('mobile')); ?>:</b>
            <?php echo CHtml::link(CHtml::encode($data->mobile), "tel:$data->mobile"); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode('User type'); ?>:</b>
            <?php echo CHtml::encode($data->userInfo->userType->name); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('enabled')); ?>:</b>
            <?php echo CHtml::encode($data->enabled ? 'Yes' : 'No'); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('created')); ?>:</b>
            <?php echo CHtml::encode($data->created); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('activated')); ?>:</b>
            <?php echo CHtml::encode($data->activated); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('last_login')); ?>:</b>
            <?php echo CHtml::encode($data->last_login); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('last_transaction')); ?>:</b>
            <?php echo CHtml::encode($data->last_transaction); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('deactivated')); ?>:</b>
            <?php echo CHtml::encode($data->deactivated); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('pincode')); ?>:</b>
            <?php echo CHtml::encode($data->pincode); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('address')); ?>:</b>
            <?php echo CHtml::encode($data->address); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode($data->getAttributeLabel('note')); ?>:</b>
            <?php echo CHtml::encode($data->note); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode('Company name'); ?>:</b>
            <?php echo CHtml::encode($data->userInfo->name); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode('Company phone'); ?>:</b>
            <?php echo CHtml::link(CHtml::encode($data->userInfo->mobile), "tel:{$data->userInfo->mobile}"); ?>
            <br /></td>

        <td><b><?php echo CHtml::encode('Company email'); ?>:</b>
            <?php echo CHtml::link(CHtml::encode($data->userInfo->email), "mailto:{$data->userInfo->email}"); ?>
            <br /></td>
    </tr>
</table>

