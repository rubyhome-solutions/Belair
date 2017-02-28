<?php

/* @var $this DepositSearchController */
/* @var $model DepositSearch */

$isStaffLogged = Authorization::getIsStaffLogged();

$this->breadcrumbs = array(
    'Deposit Search' => array('admin'),
    'Manage',
);

echo TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;New deposit search', "create", ['class' => 'btn btn-primary']);

$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'deposit-search-grid',
    'dataProvider' => $model->search(),
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER],
    'columns' => array(
        'id',
        'amount',
        [
            'name' => 'status_id',
            'value' => '$data->statusBadge()',
            'type' => 'raw'
        ],
        [
            'name' => 'approver_id',
            'value' => '$data->approver_id ? $data->approver->name : "Not set"',
        ],
        [
            'name' => 'creator_id',
            'value' => '$data->creator->name',
        ],
        [
            'name' => 'bank_id',
            'value' => '\DepositSearch::$bankDetails[$data->bank_id]',
        ],
        'date_made',
        'reason',
        [
            'name' => 'payment_id',
            'type' => 'raw',
            'value' => '$data->payment_id ? CHtml::link("Payment", "/payment/" . $data->payment_id) : "---"'
        ],
        [
            'name' => 'html',
            'type' => 'raw',
        ],
        array(
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{approve}{reject}{change}',
            'buttons' => [
                'approve' => [
                    'url' => '$data->id',
                    'label' => '<i class="fa fa-check-square-o fa-2x"></i>',
                    'visible' => $isStaffLogged . ' == true && $data->status_id === ' . \DepositSearch::STATUS_NEW,
                    'click'=>'function(){ $("#modalHeader").text("Enter the approval reason"); doAjax("approve/" + $(this).attr("href")); return false; }',
                    'options' => [
                        'title' => 'Approve and confirm this deposit.<br><b>Note:</b> This action will register new payment in the system and will increase the client balance!',
                        'style' => "color:green; margin-left:5px;",
                        "data-html" => "true",
                    ],
                ],
                'reject' => [
                    'url' => '$data->id',
                    'label' => '<i class="fa fa-times-circle fa-2x"></i>',
                    'visible' => $isStaffLogged . ' == true && $data->status_id === ' . \DepositSearch::STATUS_NEW,
                    'click'=>'function(){ $("#modalHeader").text("Enter the reject reason"); doAjax("reject/" + $(this).attr("href")); return false; }',
                    'options' => [
                        'title' => 'Reject this deposit',
                        'style' => "color:red; margin-left:5px;",
                    ],
                ],
                'change' => [
                    'url' => '$data->id',
                    'label' => '<i class="fa fa-pencil-square-o fa-2x"></i>',
                    'visible' => $isStaffLogged . ' == true && $data->status_id === ' . \CreditRequest::STATUS_NEW,
                    'click'=>'function(){ $("#modalHeader").text("Enter the new amount"); doAjax("update/" + $(this).attr("href")); return false; }',
                    'options' => [
                        'title' => 'Change the amount for this request',
                        'style' => "color:blue; margin-left:5px;",
                    ],
                ],
            ],
        ),
    ),
));

if ($isStaffLogged) {
    $this->renderPartial('/site/promptModal', [
        'modalHeader' => 'State your reason',
        'gridName' => 'deposit-search-grid',
        ]);
}
?>