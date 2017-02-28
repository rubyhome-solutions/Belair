<p style="max-width: 95%;" class='well well-small alert-info'>&nbsp;&nbsp;<i class='fa fa-cog fa-2x fa-spin'></i><span style='vertical-align:super;'>&nbsp;&nbsp;&nbsp;Private Fares</span></p>
    
    <?php
/* @var $this PfCodeController */
/* @var $model PfCode */

$isStaffLogged = \Authorization::getIsStaffLogged();
$criteria = new CDbCriteria();
$criteria->addInCondition("backend_id", \Backend::$gdsIds);
//$criteria->addCondition('is_active=1');
$airSourcesFilter = CHtml::listData(\AirSource::model()->findAll($criteria), 'id', 'name');
$carriers = CHtml::listData(\Carrier::model()->findAll(['order' => 'name']), 'id', 'name');
$activeCompany = \UserInfo::model()->findByPk(\Utils::getActiveCompanyId());
if ($activeCompany) {
    $activeCompanyList = [$activeCompany->id => $activeCompany->name];
} else {
    $activeCompanyList = [];
}

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'privateFare-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_BORDERED],
    'htmlOptions' => [
        'class' => 'span9',
        'style' => 'margin-left:0px;'
    ],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'ajaxUrl'=>$this->createUrl('pfCode/admin'),
    'columns' => [
        [
            'name' => 'air_source_id',
            'value' => '$data->airSource->name',
            'filter' => $airSourcesFilter,
            'footer' => TbHtml::activeDropDownList($model, 'air_source_id', $airSourcesFilter, ['id' => 'PF_air_source_id']),
        ],
        [
            'name' => 'user_info_id',
            'value' => '$data->user_info_id ? $data->userInfo->name : "---"',
            'filter' => $activeClients,
            'footer' => TbHtml::activeDropDownList($model, 'user_info_id', $activeCompanyList, [
                'id' => 'PF_user_info_id',
                'prompt' => '--- Any client ---'
            ]),
            'visible' => $isStaffLogged,
        ],
        [
            'name' => 'carrier_id',
            'value' => '$data->carrier->name',
            'filter' => $carriers,
            'footer' => TbHtml::activeDropDownList($model, 'carrier_id', $carriers, ['id' => 'PF_carrier_id']),
        ],
        [
            'name' => 'code',
            'footer' => TbHtml::activeTextField($model, 'code', ['id' => 'PF_code']),
        ],
        [
            'name' => 'scope',
            'value' => function ($data) {
                return \TourCode::$scopeIdToName[$data->scope];
            },
            'filter' => \TourCode::$scopeIdToName,
            'footer' => TbHtml::activeDropDownList($model, 'scope', \TourCode::$scopeIdToName, ['id' => 'PF_scope']),
            'visible' => $isStaffLogged,
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/pfCode/delete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add New', $this->createUrl("pfCode/create"), [
                'success' => 'function(error){ '
                        . '  if (!error) { '
                        . '    $.fn.yiiGridView.update("privateFare-grid"); '
                        . '  } else {'
                        . '    alert(error);'
                        . '  } '
                        . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'PF[air_source_id]' => 'js:$("#PF_air_source_id").val()',
                    'PF[user_info_id]' => 'js:$("#PF_user_info_id").val()',
                    'PF[carrier_id]' => 'js:$("#PF_carrier_id").val()',
                    'PF[code]' => 'js:$("#PF_code").val()',
                    'PF[scope]' => 'js:$("#PF_scope").val()',
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
<div class="clearfix"></div>
<style>
    .table th {text-align:center}
    #privateFare-grid select, #privateFare-grid input{
        margin-bottom: auto;
        width: 180px;
    }
    #privateFare-grid table td, #privateFare-grid table th {
        text-align: center;
        vertical-align: middle;
    }
</style>