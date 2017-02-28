<div class="ibox-content">
<?php

/* @var $this CreditRequestController */
/* @var $model CreditRequest */

$isStaffLogged = Authorization::getIsStaffLogged();

$this->breadcrumbs = array(
    'Credit Request' => array('admin'),
    'Manage',
);

echo TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;New credit request', "create", ['class' => 'btn btn-primary m-b']);

$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'credit-request-grid',
    'dataProvider' => $model->search(),
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED],
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
            'value' => '$data->approver_id ? $data->approver->name : "---"',
        ],
        [
            'name' => 'creator_id',
            'value' => '$data->creator->name',
        ],
        'use_date',
        'payback_date',
        'reason',
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
                    'visible' => $isStaffLogged . ' == true && $data->status_id === ' . \CreditRequest::STATUS_NEW,
                    'click'=>'function(){ $("#modalHeader").text("Enter the approval reason"); doAjax("approve/" + $(this).attr("href")); return false; }',
                    'options' => [
                        'title' => 'Approve and confirm this request.<br><b>Note:</b> This action will increase the client credit limit with the amount in the request!',
                        'style' => "color:green; margin-left:5px;",
                        "data-html" => "true",
                    ],
                ],
                'reject' => [
                    'url' => '$data->id',
                    'label' => '<i class="fa fa-times-circle fa-2x"></i>',
                    'visible' => $isStaffLogged . ' == true && $data->status_id === ' . \CreditRequest::STATUS_NEW,
                    'click'=>'function(){ $("#modalHeader").text("Enter the rejection reason"); doAjax("reject/" + $(this).attr("href")); return false; }',
                    'options' => [
                        'title' => 'Reject this credit request',
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
        'gridName' => 'credit-request-grid',
        ]);
}
?>
</div>