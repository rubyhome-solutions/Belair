<?php

/* @var $this PaymentController */
/* @var $model Payment */


$this->breadcrumbs = [
    'Payments' => ['admin'],
    'Manage',
];

$this->renderPartial("_admin_grid", ['model' => $model]);

//$this->renderPartial("/site/infoModal", [
//    'modalHeader' => 'Refund feedback',
//]);
