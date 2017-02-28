
<div class="ibox-content m_top1">
<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */

$this->breadcrumbs = [
    'Transaction' => ['admin'],
    $model->id,
];

$payment = \Payment::model()->findByAttributes(['pay_gate_log_id' => $model->id]);
$isStaffLogged = \Authorization::getIsStaffLogged();

$this->widget('zii.widgets.CDetailView', array(
    'htmlOptions' => array(
        'class' => 'table table-striped table-condensed table-hover',
    ),
    'data' => $model,
    'attributes' => array(
        'id',
        'reason',
        [
            'label' => 'AirCart',
            'value' => CHtml::link("<b>$model->air_cart_id</b>", "/airCart/$model->air_cart_id"),
            'type' => 'raw'
        ],
        [
            'label' => 'Payment',
            'value' => empty($payment) ? 'Not Set' : CHtml::link("<b>$payment->id</b>", "/payment/$payment->id"),
            'type' => 'raw'
        ],
        ['label' => 'Status', 'value' => $model->trStatus->name],
        ['label' => 'Company or user', 'value' => $model->userInfo->name],
        ['label' => 'Action', 'value' => $model->action_id ? $model->trAction->name : 'Not Set'],
        ['label' => 'Payment gateway', 'value' => $model->pg->name],
        [
            'label' => 'CC/DC',
            'value' => $model->cc_id ? $model->cc->mask : 'Not Set'
        ],
        'hash_our',
        'hash_response',
        'pg_type',
        'payment_mode',
        'token',
        ['label' => 'Currency', 'value' => "({$model->currency->code}) {$model->currency->name}"],
        'amount',
        'convince_fee',
        ['label' => 'Total', 'value' => $model->amount + $model->convince_fee],
        ['label' => 'Original Currency', 'value' => empty($model->original_currency_id) ? "Not Set" : "({$model->originalCurrency->code}) {$model->originalCurrency->name}"],
        'original_amount',
        'original_convince_fee',
        [
            'label' => 'xCange rate',
            'value' => $model->xchangeRate,
            'visible' => $model->action_id !== \TrAction::ACTION_REFUND,
        ],
//        'discount',
        'error',
        'bank_ref',
        'unmapped_status',
        'request_id',
        'updated',
        [
            'name' => 'note',
            'visible' => $isStaffLogged
        ],
        'user_ip',
        'user_proxy',
        'user_browser',
        [
            'name' => 'geoip',
            'value' => empty($model->geoip) ? 'Not Set' : "<pre>" . print_r(json_decode($model->geoip), true) . "</pre>",
            'type' => 'raw'
        ],
        [
            'label' => 'Raw response',
            'value' => empty($model->raw_response) ? 'Not Set' : "<pre>" . print_r(json_decode($model->raw_response), true) . "</pre>",
            'type' => 'raw',
            'visible' => $isStaffLogged
        ],
    ),
));
?>
</div>
<style>
    .table th {min-width: 120px;}
    .table td {vertical-align: middle;}
</style>