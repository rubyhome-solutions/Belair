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
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED],
    'dataProvider' => $model->search(),
    'htmlOptions' => ['class' => 'span10'],
    'filter' => $model,
    'selectableRows' => 1,
    'selectionChanged' => 'function(id){ location.href = "' . $this->createUrl('view') . '/"+$.fn.yiiGridView.getSelection(id);}',
    'columns' => [
//        'id',
        [
            'name' => 'pay_gate_log_id',
            'value' => 'CHtml::link("<b>$data->pay_gate_log_id<b>", "/payGate/view/$data->pay_gate_log_id")',
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
            'htmlOptions' => ['style' => 'white-space:nowrap;'],
            'template' => '{delete}{freeIP}{freeEmail}{freePhone}',
            'buttons' => [
                'delete' => [
                    'visible' => $superStaff . ' == true',
                ],
                'freeIP' => [
                    'label' => '<b>IP</b>',
                    'url' => '"freeIP/".$data->id',
                    'visible' => $superStaff . ' == true && !empty($data->ip)',
                    'options' => [
                        'title' => 'Free the IP',
                        'style' => "color: blue; margin-left:5px;",
                    ],                    
                ],
                'freeEmail' => [
                    'label' => '<i class="fa fa-envelope-o"></i>',
                    'url' => '"freeEmail/".$data->id',
                    'visible' => $superStaff . ' == true && !empty($data->email)',
                    'options' => [
                        'title' => 'Free the Email',
                        'style' => "color: blue; margin-left:5px;",
                    ],                    
                ],
                'freePhone' => [
                    'label' => '<i class="fa fa-phone"></i>',
                    'url' => '"freePhone/".$data->id',
                    'visible' => $superStaff . ' == true && !empty($data->phone)',
                    'options' => [
                        'title' => 'Free the Phone',
                        'style' => "color: blue; margin-left:5px;",
                    ],                    
                ],
            ]
        ],
    ],
]);
?>
<style>
    #fraud-grid table.items tr td {cursor: pointer}
</style>