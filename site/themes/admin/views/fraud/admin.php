<div class="ibox-content m_top1">
<?php

/* @var $this FraudController */
/* @var $model Fraud */

$this->breadcrumbs = [
    'Frauds' => ['admin'],
    'Manage',
];

$superStaff = \Authorization::getIsTopStaffLogged();
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'fraud-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED, TbHtml::GRID_TYPE_STRIPED],
    'dataProvider' => $model->search(),
    'htmlOptions' => ['class' => 'span10'],
    'filter' => $model,
    'selectableRows' => 1,
    'selectionChanged' => 'function(id){ location.href = "' . $this->createUrl('view') . '/"+$.fn.yiiGridView.getSelection(id);}',
    'columns' => [
//        'id',
        [
            'name' => 'pay_gate_log_id',
            'value' => 'CHtml::link("link", "/payGate/view/$data->pay_gate_log_id")',
            'type' => 'raw',
            'filter' => false,
        ],
        [
            'name' => 'cc_id',
            'value' => '$data->cc_id ? $data->cc->mask : "Not set"',
            'filter' => false,
        ],
        'ip',
        'email',
        'phone',
        [
            'name' => 'created',
            'value' => '\Utils::cutMilliseconds($data->created)',
            'filter' => false,
            'htmlOptions' => ['style' => 'white-space:nowrap;']
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'header' => 'Action',
            'template' => '{delete}',
            'buttons' => [
                'delete' => [
                    'visible' => $superStaff . ' == true'
                ]
            ]
        ],
    ],
]);
?>
</div>
<style>
    #fraud-grid table.items tr td {cursor: pointer}
</style>