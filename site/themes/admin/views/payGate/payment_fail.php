<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */

$this->breadcrumbs = array(
    'Payment has failed',
);

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
echo TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, "This payment was not successful!<br>Bank code: $model->pg_type , Bank reference: $model->bank_ref <br>Reason: $model->reason");
echo TbHtml::link('Click to try the same payment again', '/payGate/payAgain/' . $model->id, ['class' => 'btn btn-primary btn-large']);
?>
