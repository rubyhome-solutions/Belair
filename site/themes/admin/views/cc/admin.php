<div class="ibox-content payment-Cards">
<?php
/* @var $this CcController */
/* @var $model Cc */
/* @var $isStaffLogged bool */


$this->breadcrumbs = ['Cards' => ['admin'],
    'Manage',
];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}

echo TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;New credit card', "create", ['class' => 'btn btn-primary m-b']);

$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'cc-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED],
    'columns' => [
        [
            'name' => 'type_id',
            'value' => '$data->imageTag . "&nbsp;&nbsp;&nbsp;" . $data->type->name',
            'type' => 'raw',
            'filter' => CHtml::listData(CcType::model()->findAll(), 'id', 'name')
        ],
        'mask',
        [
            'value' => '$data->userInfo->name',
            'name' => 'user_info_id',
            'visible' => $isStaffLogged,
            'filter' => false
        ],
        [
            'header' => 'Transactions',
            'value' => '"<a href=\"/payGate/admin?PayGateLog[cc_id]=$data->id\">link</a>"',
            'visible' => $isStaffLogged,
            'type' => 'raw',
            'filter' => false
        ],
        [
            'name' => 'exp_date',
            'value' => 'date("M/y", strtotime($data->exp_date))',
            'filter' => false
        ],
        [
            'name' => 'deleted',
            'value' => '$data->deleted ? "Deleted" : "Active"',
            'visible' => $isStaffLogged,
            'filter' => ["Active", "Deleted"]
        ],
        [
            'name' => 'bin_id',
            'type' => 'raw',
            'value' => 'TbHtml::tooltip("Bin info", "/binList/" . $data->bin_id, $data->bin->printHtml(), ["data-html" => "true", "encode"=>false, "data-placement" => "left"])'
        ],
        [
            'name' => 'frauds',
            'value' => 'empty($data->frauds) ? "None" : "<a href=\"/fraud/admin?Fraud[cc_id]=$data->id\">link</a>"',
            'visible' => $isStaffLogged,
            'type' => 'raw',
            'filter' => false
        ],
        [
            'name' => 'status_3d',
            'value' => '$data->format3dStatus()',
            'type' => 'raw',
            'filter' => \Cc::$status3D
        ],
        [
            'name' => 'verification_status',
            'value' => 'empty($data->verification_status) ? "No" : "Yes"',
            'visible' => $isStaffLogged,
            'filter' => ["No", "Yes"]
        ],
        /*
          'code',
          'number',
          'note',
          'status_3d',
          'hash',
         */
        array(
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{reload}',
            'buttons' => [
                'reload' => [
                    'label' => '<i class="fa fa-refresh fa-lg"></i>',
                    'url' => '$data->id',
                    'visible' => 'true == ' . $isStaffLogged,
                    'click' => 'function(){ doSync("/cc/binRefresh" , $(this).attr("href")); return false; }',
                    'options' => [
                        'title' => 'Refresh the data from the BinList provider',
                        'style' => "color: green; margin-left:5px;margin-right:5px;",
                    ],
                ],
//                'view' => ['visible' => 'true == ' . $isStaffLogged]
            ]
        ),
    ],
));
$this->renderPartial('/site/infoModal', ['modalHeader' => 'BinList feedback:']);
?>
</div>
    <style> .badge {font-size: inherit} </style>
