<style>

tfoot tr {background-color: beige;}
</style>
        <?php


$pgs = CHtml::listData(\PaymentGateway::model()->findAll(['order' => 'name']), 'id', 'name');
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
            'name' => 'pg_id',
            'value'=>'$data->pg->name',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
            'filter' => $pgs,
            'footer' => TbHtml::activeDropDownList($model, 'pg_id', $pgs, ['id' => 'PG_pg_id']),
        ],
        [
            'name' => 'type',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renamePGType"),
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => \CommisionPg::$typeMap,
            'footer' => TbHtml::activeDropDownList($model, 'type', \CommisionPg::$typeMap, ['id' => 'PG_type']),
            'selectOptions' => \CommisionPg::$typeMap,
        ],
        
        
        [
            'name' => 'amount',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renamePGType"),
            'footer' => TbHtml::activeTextField($model, 'amount', ['id' => 'PG_amount']),
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
         [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/commission/pgCostDelete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add New', $this->createUrl("commission/pgCostCreate"), [
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
                    'PG[pg_id]' => 'js:$("#PG_pg_id").val()',
                    'PG[type]' => 'js:$("#PG_type").val()',
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
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    select.ajax-select-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important; width: 80%}
    input {width: inherit;}
    select {width: 97%;}
</style>