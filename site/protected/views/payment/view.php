<?php
/* @var $this PaymentController */
/* @var $model Payment */

$this->breadcrumbs = [
    'Payments' => ['admin'],
    $model->id,
];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
?>

<h3>Full details for payment № <?php echo $model->id; ?></h3>

<?php
$originalCurrency = $model->currency->code;
$originalAmount = number_format($model->amount / $model->xchange_rate, 2);
$accountingCurrency = $model->user->userInfo->currency->code;
if ($model->xchange_rate > 1) {
    $xchange = number_format($model->xchange_rate, 4) . " ($accountingCurrency/$originalCurrency)";
} else {
    $xchange = number_format(1/$model->xchange_rate, 4) . " ($originalCurrency/$accountingCurrency)";
}
$this->widget('zii.widgets.CDetailView', array(
    'htmlOptions' => array(
        'class' => 'table table-striped table-condensed table-hover span7',
    ),
    'data' => $model,
    'attributes' => array(
        [
            'label' => 'Type',
            'value' => $model->transferType->name
        ],
        [
            'label' => 'Original Currency',
            'value' => "<b>$originalCurrency</b> ($originalAmount)",
            'type' => 'raw'
        ],
        [
            'label' => 'xChange Rate',
            'value' => $xchange
        ],
        [
            'label' => 'Accounting Currency',
            'value' => "<b>{$accountingCurrency}</b> ($model->amount)",
            'type' => 'raw'
        ],
        [
            'name' => 'old_balance',
            'value' => number_format($model->old_balance)
        ],
        [
            'name' => 'amount',
            'value' => number_format($model->amount, 2)
        ],
        [
            'name' => 'new_balance',
            'value' => number_format($model->new_balance)
//            'value' => $model->new_balance
        ],
        [
            'label' => 'Logged user',
            'value' => $model->logedUser->name
        ],
        [
            'label' => 'AirCart',
            'value' => $model->air_cart_id ? CHtml::link("<b>$model->air_cart_id</b>", "/airCart/$model->air_cart_id") : 'Not set',
            'type' => 'raw'
        ],
        [
            'label' => 'Transaction',
            'value' => $model->pay_gate_log_id ? CHtml::link("<b>$model->pay_gate_log_id</b>", "/payGate/$model->pay_gate_log_id") : 'Not set',
            'type' => 'raw'
        ],
        [
            'label' => 'Client',
            'value' => $model->user->userInfo->name
        ],
        'created',
        [
            'label' => 'TDS',
            'value' => number_format($model->tds, 2)
        ],
        [
            'label' => 'Service tax',
            'value' => number_format($model->service_tax, 2)
        ],
        [
            'label' => 'Commission',
            'value' => number_format($model->commision, 2)
        ],
//        [
//            'label' => 'Service tax',
//            'value' => number_format($model->markup, 2)
//        ],
        [
            'name' => 'note',
            'type' => 'raw'
        ],
        'approved',
        [
            'label' => 'Distributor',
            'value' => $model->distributor_id ? $model->distributor->name : "Not Set"
        ],
    ),
));
//echo \Utils::dbg($model->attributes);
//$cpg = new CPgsqlSchema(\Yii::app()->db);
//echo \Utils::dbg($cpg);
?>