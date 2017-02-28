<?php

/* @var $this PayGateController */
/* @var $model PayGateLog */

$msg = "Client:&nbsp&nbsp&nbsp&nbsp<b>{$model->userInfo->name}</b><br>Reason: <b><br>" .
        ($model->reason ? nl2br($model->reason) . "</b>" : 'Not set</b>');
echo TbHtml::well($msg, ['class' => 'alert-info', 'style' => 'max-width:800px;']);

// PayU case
if (in_array($model->pg_id, \PaymentGateway::$payuIdList)) {
    $this->renderPartial('_form_payU', [
        'model' => $model,
        // Hide the cards, since CC payments are not served by PayU
        'hide' => [
            'creditcard' => true,
            'debitcard' => true,
        ]
    ]);
}

// AXIS case - render same form as PayU
if (in_array($model->pg_id, \PaymentGateway::$axisIdList)) {
    $this->renderPartial('_form_payU', [
        'model' => $model,
        'hide' => [
            'emi' => true,
            'netbanking' => true,
            'cashcard' => true,
        ]
    ]);
}

// AMEX case - render same form as PayU
if (in_array($model->pg_id, \PaymentGateway::$amexIdList)) {
    $this->renderPartial('_form_payU', [
        'model' => $model,
        'hide' => [
            'emi' => true,
            'netbanking' => true,
            'cashcard' => true,
        ]
    ]);
}

// HDFC case - render same form as PayU
if (in_array($model->pg_id, \PaymentGateway::$hdfcIdList)) {
    $this->renderPartial('_form_payU', [
        'model' => $model,
        'hide' => [
            'emi' => true,
            'netbanking' => true,
            'cashcard' => true,
        ]
    ]);
}

// TechProc case
if (in_array($model->pg_id, \PaymentGateway::$techProcIdList)) {
    $this->renderPartial('_form_tp', ['model' => $model]);
}

// ZooZ case
if (in_array($model->pg_id, \PaymentGateway::$zoozIdList)) {
    $this->renderPartial('_form_payU', [
        'model' => $model,
        'hide' => [
            'debitcard' => true,
            'emi' => true,
            'netbanking' => true,
            'cashcard' => true,
        ]
    ]);
}
?>

