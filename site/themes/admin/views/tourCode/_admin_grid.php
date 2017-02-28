<div class="ibox-title m-top1">
<i class='fa fa-cog fa-spin'></i> Tour Codes
</div>
<div class="ibox-content">
    <?php
/* @var $this TourCodeController */
/* @var $model TourCode */

$isStaffLogged = \Authorization::getIsStaffLogged();
$criteria = new CDbCriteria();
$criteria->addInCondition("backend_id", \Backend::$gdsIds);
//$criteria->addCondition('is_active=1');
$airSourcesFilter = CHtml::listData(\AirSource::model()->findAll($criteria), 'id', 'name');
$carriers = CHtml::listData(\Carrier::model()->findAll(['order' => 'name']), 'id', 'name');
$activeCarriers = CHtml::listData(\Carrier::model()->with([
    'tourCodes' => ['joinType' => 'INNER JOIN']
])->findAll(['order' => 'name']), 'id', 'name');
$activeCompany = \UserInfo::model()->findByPk(\Utils::getActiveCompanyId());
if ($activeCompany) {
    $activeCompanyList = [$activeCompany->id => $activeCompany->name];
} else {
    $activeCompanyList = [];
}

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'tour-code-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_BORDERED],
    'htmlOptions' => [
        'class' => 'span9',
        'style' => 'margin-left:0px;'
    ],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'ajaxUrl' => $this->createUrl('tourCode/admin'),
    'columns' => [
        [
            'name' => 'air_source_id',
            'value' => '$data->airSource->name',
            'filter' => $airSourcesFilter,
            'footer' => TbHtml::activeDropDownList($model, 'air_source_id', $airSourcesFilter, ['id' => 'TC_air_source_id']),
        ],
        [
            'name' => 'user_info_id',
            'value' => '$data->user_info_id ? $data->userInfo->name : "---"',
            'filter' => $activeClients,
            'footer' => TbHtml::activeDropDownList($model, 'user_info_id', $activeCompanyList, [
                'id' => 'TC_user_info_id',
                'prompt' => '--- Any client ---'
            ]),
            'visible' => $isStaffLogged,
        ],
        [
            'name' => 'carrier_id',
            'value' => '"&nbsp;&nbsp;&nbsp;" . $data->carrier->getGenerateImgTag() . "&nbsp;&nbsp;&nbsp;" . $data->carrier->code . "&nbsp;&nbsp;&nbsp;" . $data->carrier->name',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'text-align:left;'],
            'filter' => $activeCarriers,
            'footer' => TbHtml::activeDropDownList($model, 'carrier_id', $carriers, ['id' => 'TC_carrier_id']),
        ],
        [
            'name' => 'code',
            'footer' => TbHtml::activeTextField($model, 'code', ['id' => 'TC_code']),
        ],
        [
            'name' => 'scope',
            'value' => function ($data) {
                return \TourCode::$scopeIdToName[$data->scope];
            },
            'filter' => \TourCode::$scopeIdToName,
            'footer' => TbHtml::activeDropDownList($model, 'scope', \TourCode::$scopeIdToName, ['id' => 'TC_scope']),
            'visible' => $isStaffLogged,
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/tourCode/delete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Save', $this->createUrl("tourCode/create"), [
                'success' => 'function(error){ '
                . '  if (!error) { '
                . '    $.fn.yiiGridView.update("tour-code-grid"); '
                . '  } else {'
                . '    alert(error);'
                . '  } '
                . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'TC[air_source_id]' => 'js:$("#TC_air_source_id").val()',
                    'TC[user_info_id]' => 'js:$("#TC_user_info_id").val()',
                    'TC[carrier_id]' => 'js:$("#TC_carrier_id").val()',
                    'TC[code]' => 'js:$("#TC_code").val()',
                    'TC[scope]' => 'js:$("#TC_scope").val()',
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'white-space:nowrap; margin-top:15px;margin-bottom:20px;',
                'encode' => false,
                'id' => 'newRecordBtn'
            ])
        ],
    ],
]);
?>
</div>
    <div class="clearfix"></div>
<style>
    .table th {text-align:center}
    #tour-code-grid select, #tour-code-grid input{
        margin-bottom: auto;
        width: 180px;
    }
    #tour-code-grid table td, #tour-code-grid table th {
        text-align: center;
        vertical-align: middle;
    }
</style>