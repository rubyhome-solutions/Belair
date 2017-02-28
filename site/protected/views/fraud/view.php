<?php

/* @var $this FraudController */
/* @var $model Fraud */

$this->breadcrumbs = [
    'Frauds' => ['admin'],
    $model->id,
];


$this->widget('zii.widgets.CDetailView', [
    'htmlOptions' => ['class' => 'table table-striped table-condensed table-hover span7'],
    'data' => $model,
    'attributes' => [
        'id',
        [
            'name' => 'pay_gate_log_id',
            'value' => CHtml::link("link", "/payGate/view/$model->pay_gate_log_id"),
            'type' => 'raw',
            'filter' => false,
        ],
        [
            'name' => 'cc_id',
            'value' => $model->cc_id ? $model->cc->mask : "Not set",
            'filter' => false,
        ],
        'ip',
        'email',
        'phone',
        'created',
    ],
]);
?>