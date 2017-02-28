<?php
/* @var $this CityPairsController */
/* @var $model CityPairs */
/* @var $carriers Carrier[] */

$activeCarriers = CHtml::listData($carriers, 'id', 'name');

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'city-pairs-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_BORDERED],
    'htmlOptions' => [
        'class' => 'span9',
        'style' => 'margin-left:0px;'
    ],
    'dataProvider' => $model->search(),
    'filter' => $model,
//    'ajaxUrl' => $this->createUrl('cityPairs/admin'),
    'columns' => [
        [
            'name' => 'carrier_id',
            'value' => '"&nbsp;&nbsp;&nbsp;" . $data->carrier->getGenerateImgTag() . "&nbsp;&nbsp;&nbsp;" . $data->carrier->code . "&nbsp;&nbsp;&nbsp;" . $data->carrier->name',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'text-align:left;'],
            'filter' => $activeCarriers,
            'footer' => TbHtml::activeDropDownList($model, 'carrier_id', $activeCarriers, ['id' => 'CP_carrier_id', 'prompt' => '--- Select Airline ---']),
        ],
        [
            'name' => 'source_id',
            'value' => '$data->source->getNameCode()',
            'type' => 'raw',
            'footer' => TbHtml::activeTextField($model, 'source_id', ['id' => 'CP_source_id']),
        ],
        [
            'name' => 'destination_id',
            'value' => '$data->destination->getNameCode()',
            'type' => 'raw',
            'footer' => TbHtml::activeTextField($model, 'destination_id', ['id' => 'CP_destination_id']),
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/cityPairs/delete?source_id=".$data->source_id."&destination_id=".$data->destination_id."&carrier_id=".$data->carrier_id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Save', $this->createUrl("cityPairs/create"), [
                'success' => 'function(error){ '
                . '  if (!error) { '
                . '    $.fn.yiiGridView.update("city-pairs-grid"); '
                . '  } else {'
                . '    alert(error);'
                . '  } '
                . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'CP[carrier_id]' => 'js:$("#CP_carrier_id").val()',
                    'CP[source_id]' => 'js:$("#CP_source_id").val()',
                    'CP[destination_id]' => 'js:$("#CP_destination_id").val()',
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
    #city-pairs-grid select, #city-pairs-grid input{
        margin-bottom: auto;
        width: 180px;
    }
    #city-pairs-grid table td, #city-pairs-grid table th {
        text-align: center;
        vertical-align: middle;
    }
</style>