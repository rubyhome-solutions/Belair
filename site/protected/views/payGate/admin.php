<?php

/* @var $this PayGateController */
/* @var $model PayGateLog */

$this->breadcrumbs = [
    'Transactions' => ['admin'],
    'Manage',
];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}

$this->renderPartial("_stats");
echo "<hr>" . TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Create new payment request', "manualPaymentRequest", ['class' => 'btn btn-primary']);
echo \TbHtml::link('<i class="fa fa-magnet fa-lg"></i>&nbsp;&nbsp;Show Uncaptured', "/payGate/admin?PayGateLog[capturable]=1", ['class' => 'btn btn-primary', 'style' => 'margin-left:10px']);

$this->renderPartial("_admin_grid", ['model' => $model]);
$this->renderPartial('/site/infoModal', ['modalHeader' => 'Transaction feedback:']);
