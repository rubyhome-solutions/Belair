<style>

tfoot tr {background-color: beige;}
</style>
        <?php


$clientSources = CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name');
Yii::import('ext.ajax-input-column.AjaxInputColumn');
Yii::import('ext.ajax-select-column.AjaxSelectColumn');

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'commission-cs-grid',
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
            'name' => 'client_source_id',
            'value'=>'$data->clientSource->name',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
            'filter' => $clientSources,
            'footer' => TbHtml::activeDropDownList($model, 'client_source_id', $clientSources, ['id' => 'PF_client_source_id']),
        ],
        [
            'name' => 'type',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameCSType"),
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => \CommisionClientSource::$typeMap,
            'footer' => TbHtml::activeDropDownList($model, 'type', \CommisionClientSource::$typeMap, ['id' => 'PF_type']),
            'selectOptions' => \CommisionClientSource::$typeMap,
        ],
        [
            'name' => 'way_type',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("renameCSType"),
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => \CommisionClientSource::$waytypeMap,
            'footer' => TbHtml::activeDropDownList($model, 'way_type', \CommisionClientSource::$waytypeMap, ['id' => 'PF_way_type']),
            'selectOptions' => \CommisionClientSource::$waytypeMap,
        ],
        
        [
            'name' => 'amount',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameCSType"),
            'footer' => TbHtml::activeTextField($model, 'amount', ['id' => 'PF_amount']),
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
         [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/commission/clientCostDelete/".$data->id',]
            ],
            'header' => 'Actions',
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add New', $this->createUrl("commission/clientCostCreate"), [
                'success' => 'function(error){ '
                        . '  if (!error) { '
                        . '    $.fn.yiiGridView.update("commission-cs-grid"); '
                        . '  } else {'
                        . '    alert(error);'
                        . '  } '
                        . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'PF[client_source_id]' => 'js:$("#PF_client_source_id").val()',
                    'PF[type]' => 'js:$("#PF_type").val()',
                    'PF[way_type]' => 'js:$("#PF_way_type").val()',
                    'PF[amount]' => 'js:$("#PF_amount").val()',
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
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    select.ajax-select-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important; width: 80%}
    input {width: inherit;}
    select {width: 97%;}
</style>