<div class="ui segment" style="margin: 20px auto; max-width: 800px;">
<?php
/* @var $this PaymentController */
/* @var $model Payment */

$this->breadcrumbs = [
    'Payments' => ['admin'],
    $model->id,
];


if (Yii::app()->user->hasFlash('msg')): ?>
    <div class="ui message">
        <p><?php \Yii::app()->user->getFlash('msg'); ?></p>
    </div>
<?php endif; ?>

    <h3 class="ui header">Your payment is successful</h3>

