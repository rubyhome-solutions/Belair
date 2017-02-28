    <?php
/* @var $this CcPasstruController */
/* @var $model CcPasstru */

$carriers = CHtml::listData(\Carrier::model()->findAll(['order' => 'name']), 'id', 'name');
$validScopes = \CcPasstru::$scopeIdToName;
unset($validScopes[\CcPasstru::SCOPE_SINGLE_CLIENT]);

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'ccRootPasstru-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_BORDERED],
    'htmlOptions' => [
        'class' => 'span9',
        'style' => 'margin-left:0px;'
    ],
    'dataProvider' => $model->search(),
//    'filter' => $model,
    'ajaxUrl'=>$this->createUrl('ccPasstru/root'),
    'columns' => [
        [
            'name' => 'carrier_id',
            'value' => '"&nbsp;&nbsp;&nbsp;" . $data->carrier->getGenerateImgTag() . "&nbsp;&nbsp;&nbsp;" . $data->carrier->code . "&nbsp;&nbsp;&nbsp;" . $data->carrier->name',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'text-align:left;'],
//            'filter' => $carriers,
            'footer' => TbHtml::activeDropDownList($model, 'carrier_id', $carriers, ['id' => 'ccPt_carrier_id', 'prompt' => '--- Select airline ---']),
        ],
        [
            'name' => 'cc_id',
            'value' => '$data->cc->getImageTag() . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" . $data->cc->mask',
            'type' => 'raw',
            'footer' => TbHtml::activeDropDownList($model, 'cc_id', $clientCards, [
                'id' => 'ccPt_cc_id',
                'prompt' => '--- Select card ---'
                ]),
            'filter' => false,
        ],
        [
            'name' => 'scope',
            'value' => function ($data) {
                if (isset(\CcPasstru::$scopeIdToName[$data->scope])) {                    
                    return \CcPasstru::$scopeIdToName[$data->scope];
                }
                return '-';
            },
            'footer' => TbHtml::activeDropDownList($model, 'scope', $validScopes, ['id' => 'ccPt_scope', 'prompt'=>'--- Choose Scope ---']),
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/ccPasstru/delete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Save', $this->createUrl("ccPasstru/create"), [
                'success' => 'function(error){ '
                        . '  if (!error) { '
                        . '    $.fn.yiiGridView.update("ccRootPasstru-grid"); '
                        . '  } else {'
                        . '    alert(error); $("#newCcPtBtn").blur();'
                        . '  } '
                        . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'ccPt[user_info_id]' => $model->user_info_id,
                    'ccPt[carrier_id]' => 'js:$("#ccPt_carrier_id").val()',
                    'ccPt[scope]' => 'js:$("#ccPt_scope").val()',
                    'ccPt[cc_id]' => 'js:$("#ccPt_cc_id").val()',
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'white-space:nowrap; margin-top:15px;margin-bottom:20px;',
                'encode' => false,
                'id' => 'newCcPtBtn'
            ])
        ],
    ],
]);
?>
<div class="clearfix"></div>
<style>
    .table th {text-align:center}
    #ccRootPasstru-grid select, #ccRootPasstru-grid input{
        margin-bottom: auto;
        width: 180px;
    }
    #ccRootPasstru-grid table td, #ccRootPasstru-grid table th {
        text-align: center;
        vertical-align: middle;
    }
</style>