<style>

tfoot tr {background-color: beige;}
</style>
        <?php


$carriers = CHtml::listData(\Carrier::model()->findAll(['order' => 'name']), 'id', 'code');
Yii::import('ext.ajax-input-column.AjaxInputColumn');
Yii::import('ext.ajax-select-column.AjaxSelectColumn');

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'airport-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'htmlOptions' => [
//        'class' => 'span7',
        'style' => 'margin-left:0; width: 790px;'
    ],
    'columns' => [
        [
            'name' => 'carrier_id',
            'value'=>'$data->carrier->code',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
            'filter' => $carriers,
            'footer' => TbHtml::activeDropDownList($model, 'carrier_id', $carriers, ['id' => 'PG_carrier_id']),
        ],
        [
            'name' => 'type',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameGDSType"),
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => \CommisionGdsLcc::$typeMap,
            'footer' => TbHtml::activeDropDownList($model, 'type', \CommisionGdsLcc::$typeMap, ['id' => 'PG_type']),
            'selectOptions' => \CommisionGdsLcc::$typeMap,
        ],
        [
            'name' => 'way_type',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameGDSType"),
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => \CommisionGdsLcc::$waytypeMap,
            'footer' => TbHtml::activeDropDownList($model, 'way_type', \CommisionGdsLcc::$waytypeMap, ['id' => 'PG_way_type']),
            'selectOptions' => \CommisionGdsLcc::$waytypeMap,
        ],
        [
            'name' => 'amount',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameGDSType"),
            'footer' => TbHtml::activeTextField($model, 'amount', ['id' => 'PG_amount']),
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/commission/gdsCostDelete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add New', $this->createUrl("commission/gdsCostCreate"), [
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
                    'PG[carrier_id]' => 'js:$("#PG_carrier_id").val()',
                    'PG[type]' => 'js:$("#PG_type").val()',
                    'PG[way_type]' => 'js:$("#PG_way_type").val()',
                    'PG[amount]' => 'js:$("#PG_amount").val()',
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'white-space:nowrap; margin-top:15px;margin-bottom:20px;',
                'encode' => false,
                'id' => 'newRecordBtnn'
            ])
        ],
        
    ],
]);

?>


<div id="params-grid" class="grid-view">
    <table class="items table">
        <thead>
            <tr>
                <th style="width: 100px;text-align:left" id="params-grid_c0">Parameter</th><th style="width: 100px;text-align:left" id="params-grid_c1">Content</th><th style="width: 30px;text-align:right" class="button-column" id="params-grid_c2">Action</th></tr>
        </thead>
        <tbody>
            <tr class="odd">
                <td>GDS_DEFAULT</td><td><?php echo CommisionGdsLcc::getGDSDefault();?></td><td class="button-column"><a class="update" title="Update" rel="tooltip" href="/params/update?id=GDS_DEFAULT"><i class="icon-pencil"></i></a></td></tr>
            <tr class="even">
                <td>LCC_DEFAULT</td><td><?php echo CommisionGdsLcc::getLCCDefault();?></td><td class="button-column"><a class="update" title="Update" rel="tooltip" href="/params/update?id=LCC_DEFAULT"><i class="icon-pencil"></i></a></td></tr>
        </tbody>
    </table>
    </div>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    select.ajax-select-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important; width: 80%}
    input {width: inherit;}
    select {width: 97%;}
</style>