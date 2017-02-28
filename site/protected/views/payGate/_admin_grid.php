<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'pay-gate-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'selectableRows' => 1,
    'selectionChanged' => 'function(id){ location.href = "' . $this->createUrl('view') . '/"+$.fn.yiiGridView.getSelection(id);}',
    'columns' => [
        [
            'name' => 'id',
            'headerHtmlOptions' => ['style' => 'width: 60px;'],
        ],
        [
            'name' => 'fraud',
            'value' => 'empty($data->fraud) ? "<span class=\"badge badge-success\">No</span>" : "<a href=\"/fraud/view/{$data->fraud->id}\"><span class=\"badge badge-important\">Yes</span></a>"',
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'type' => 'raw',
            'filter' => ['No', 'Yes']
        ],
        [
            'name' => 'updated',
            'header' => 'Date',
            'value' => '\Utils::cutMilliseconds($data->updated)',
            'headerHtmlOptions' => ['style' => 'min-width: 70px;'],
            'filter' => false,
        ],
        [
            'name' => 'air_cart_id',
            'value' => 'CHtml::link("<b>$data->air_cart_id</b>", "/airCart/$data->air_cart_id")',
            'type' => 'raw',
            'headerHtmlOptions' => array('style' => 'width: 60px;'),
        ],
        [
            'name' => 'amount',
            'value' => '$data->amount+$data->convince_fee', 
            'filter' => false,
        ],
        [
            'name' => 'status_id',
            'value' => '$data->trStatus->name',
            'filter' => CHtml::listData(TrStatus::model()->findAll(), 'id', 'name'),
            'headerHtmlOptions' => ['style' => 'min-width: 85px;'],
        ],
        [
            'name' => 'currency_id',
            'value' => '$data->currency->code',
            'filter' => CHtml::listData(\Currency::model()->findAll(['order' => 'id']), 'id', 'code'),
            'headerHtmlOptions' => ['style' => 'max-width: 100px;'],
        ],
        [
            'name' => 'user_info_id',
            'value' => '$data->userInfo->name',
            'filter' => false,
        ],
        [
            'name' => 'action_id',
            'value' => '($data->action_id?$data->trAction->name:"Not Set")',
            'filter' => CHtml::listData(TrAction::model()->findAll(), 'id', 'name'),
            'headerHtmlOptions' => ['style' => 'min-width: 80px;'],
        ],
        [
            'name' => 'pg_id',
            'value' => '$data->pg->name',
            'filter' => CHtml::listData(PaymentGateway::model()->findAll('is_active>0'), 'id', 'name'),
            'headerHtmlOptions' => ['style' => 'min-width: 105px;'],
        ],
        [
            'name' => 'cc_id',
            'value' => '$data->formatCc()',
            'filter' => false,
            'type' => 'raw'
        ],
//        'payment_mode',
        [
            'name' => 'reason',
//            'value' => 'nl2br($data->reason)',
            'value' => 'in_array($data->status_id, [\TrStatus::STATUS_NEW, \TrStatus::STATUS_PENDING ]) ? "" : nl2br($data->reason)',
            'filter' => false,
            'type' => 'raw'
        ],
        [
            'name' => 'status_3d',
            'value' => '$data->format3dStatus()',
            'type' => 'raw',
            'filter' => \Cc::$status3D
        ],
//        [
//            'name' => 'note',
//            'filter' => false,
//        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'header' => 'Action',
            'template' => '{reload}{same}{pay}{refund}{external-refund}{capture}',
            'headerHtmlOptions' => ['style' => 'min-width: 85px;'],
            'buttons' => [
                'reload' => [
                    'label' => '<i class="fa fa-refresh fa-lg"></i>',
                    'url' => '$data->id',
                    'visible' => '$data->status_id === ' . TrStatus::STATUS_PENDING . ' && $data->action_id === ' . \TrAction::ACTION_SENT,
                    'click' => 'function(){ doSync("refresh" , $(this).attr("href")); return false; }',
                    'options' => [
                        'title' => 'Refresh the data from the payment provider',
                        'style' => "color: green; margin-left:5px;",
                    ],
                ],
                'same' => [
                    'label' => '<i class="fa fa-pencil-square-o fa-lg"></i>',
                    'url' => '"payAgain/".$data->id',
                    'visible' => '$data->status_id === ' . TrStatus::STATUS_FAILURE . ' && $data->action_id === ' . \TrAction::ACTION_SENT,
                    'options' => [
                        'title' => 'Create new payment request, using this as template',
                        'style' => "color: blue; margin-left:5px;",
                    ],
                ],
                'pay' => [
                    'label' => '<i class="fa fa-money fa-lg"></i>',
                    'url' => '"doPay/".$data->id',
                    'visible' => '$data->status_id === ' . TrStatus::STATUS_NEW,
                    'options' => [
                        'title' => 'Pay',
                        'style' => "color: black; margin-left:5px;",
                    ],
                ],
                'refund' => [
                    'label' => '<i class="fa fa-undo fa-lg"></i>',
                    'url' => '"refund/".$data->id',
                    'visible' => '$data->isRefundable() && !\Authorization::getIsFrontlineStaffLogged()',
                    'options' => [
                        'title' => 'Refund this transaction',
                        'style' => "color: red; margin-left:5px;",
                    ],
                ],
                'external-refund' => [
                    'label' => '<i class="fa fa-exchange fa-lg"></i>',
                    'url' => '"externalRefund/".$data->id',
                    'visible' => '$data->isRefundable() && !\Authorization::getIsFrontlineStaffLogged()',
                    'options' => [
                        'title' => 'External Refund',
                        'style' => "color: red; margin-left:5px;",
                    ],
                ],
                'capture' => [
                    'label' => '<i class="fa fa-magnet fa-lg"></i>',
                    'url' => '$data->id',
                    'click' => 'function(){ doSync("capture" , $(this).attr("href")); return false; }',
                    'visible' => '$data->isCapturable()',
                    'options' => [
                        'title' => 'Capture this transaction',
                        'style' => "color: green; margin-left:5px;",
                    ]
                ],
            ]
        ],
    ],
]);
?>
<style>
    .badge {font-size: inherit}
    .grid-view table.items tr td {cursor: pointer}
</style>