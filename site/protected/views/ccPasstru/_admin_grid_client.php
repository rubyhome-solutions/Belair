<p style="max-width: 700px;" class='well well-small alert-info'>&nbsp;&nbsp;<i class='fa fa-cog fa-2x fa-spin'></i><span style='vertical-align:super;'>&nbsp;&nbsp;&nbsp;<?php echo $model->userInfo->name; ?> Pass–through</span></p>

<?php
/* @var $this CcPasstruController */
/* @var $model CcPasstru */
/* @var $clientCards array */

$carriers = CHtml::listData(\Carrier::model()->findAll(['order' => 'name']), 'id', 'name');

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'ccClientPasstru-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_BORDERED],
    'htmlOptions' => [
        'class' => 'span7',
        'style' => 'margin-left:0px;'
    ],
    'dataProvider' => $model->search(),
//    'filter' => $model,
    'ajaxUrl' => $this->createUrl('ccPasstru/client'),
    'columns' => [
        [
            'name' => 'carrier_id',
            'value' => '"&nbsp;&nbsp;&nbsp;" . $data->carrier->getGenerateImgTag() . "&nbsp;&nbsp;&nbsp;" . $data->carrier->code . "&nbsp;&nbsp;&nbsp;" . $data->carrier->name',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'text-align:left;'],
//            'filter' => $carriers,
            'footer' => TbHtml::activeDropDownList($model, 'carrier_id', $carriers, ['id' => 'ccPt_carrier_id']),
        ],
        [
            'name' => 'cc_id',
            'value' => '$data->cc->getImageTag() . "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" . $data->cc->mask',
            'type' => 'raw',
//            'filter' => \CcPasstru::$scopeIdToName,
            'footer' => TbHtml::activeDropDownList($model, 'cc_id', $clientCards, [
                'id' => 'ccPt_cc_id',
                'prompt' => '--- Select card ---'
                ]),
            'filter' => false,
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
                . '    $.fn.yiiGridView.update("ccClientPasstru-grid"); '
                . '  } else {'
                . '    alert(error); $("#newClientCcPtBtn").blur();'
                . '  } '
                . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'ccPt[user_info_id]' => $model->user_info_id,
                    'ccPt[carrier_id]' => 'js:$("#ccPt_carrier_id").val()',
                    'ccPt[scope]' => \CcPasstru::SCOPE_SINGLE_CLIENT,
                    'ccPt[cc_id]' => 'js:$("#ccPt_cc_id").val()',
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'white-space:nowrap; margin-top:15px;margin-bottom:20px;',
                'encode' => false,
                'id' => 'newClientCcPtBtn'
            ])
        ],
    ],
]);
?>
<div class="clearfix"></div>
<style>
    .table th {text-align:center}
    #ccClientPasstru-grid select, #ccClientPasstru-grid input{
        margin-bottom: auto;
        width: 180px;
    }
    #ccClientPasstru-grid table td, #ccClientPasstru-grid table th {
        text-align: center;
        vertical-align: middle;
    }
</style>