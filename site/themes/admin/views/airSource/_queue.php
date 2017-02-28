<p style="max-width: 95%;" class='well well-small alert-info'>&nbsp;&nbsp;<i class='fa fa-cog fa-2x fa-spin'></i><span style='vertical-align:super;'>&nbsp;&nbsp;&nbsp;Air Source Queues</span></p>

<?php
/* @var $this AirSourceController */
/* @var $airQueue \AirsourceQueue */
/* @var $queueProvidersList [] */

//echo \Utils::dbg($balanceProvidersList);

Yii::import('ext.ajax-input-column.AjaxInputColumn');
Yii::import('ext.ajax-select-column.AjaxSelectColumn');

$arrNoYes = ['No', 'Yes'];

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'airSourceQueue-grid',
    'type' => [TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED],
    'dataProvider' => $airQueue->search(),
    'htmlOptions' => ['style' => 'max-width: 95%'],
//    'filter' => false,
    'columns' => [
        [
            'name' => 'queue_to',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("updateQueue"),
            'selectOptions' => $queueProvidersList,
            'footer' => TbHtml::activeDropDownList($airQueue, 'queue_to', $queueProvidersList, [
                'style' => 'width:200px;',
                'id' => 'AirsourceQueue_queue_to'
            ]),
        ],
        [
            'name' => 'queue_number',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateQueue"),
            'htmlOptions' => ['style' => 'width:60px'],
            'footer' => TbHtml::activeTextField($airQueue, 'queue_number', [
                'style' => 'width:60px;',
                'id' => 'AirsourceQueue_queue_number'
            ]),
        ],
        [
            'name' => 'type_id',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("updateQueue"),
            'selectOptions' => \AirSource::$type,
            'footer' => TbHtml::activeDropDownList($airQueue, 'type_id', \AirSource::$type, [
                'style' => 'width:120px;',
                'id' => 'AirsourceQueue_type_id'
            ]),
        ],
        [
            'name' => 'auto_ticket',
            'class' => 'AjaxSelectColumn',
            'url' => $this->createUrl("updateQueue"),
            'selectOptions' => $arrNoYes,
            'footer' => TbHtml::activeDropDownList($airQueue, 'auto_ticket', $arrNoYes, [
                'style' => 'width:80px;',
                'id' => 'AirsourceQueue_auto_ticket'
            ]),
        ],
        [
            'name' => 'carriers',
            'header' => 'Airlines<br><small>(comma separated list. Use ** to match all)</small>',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateQueue"),
            'htmlOptions' => ['style' => 'width:400px'],
            'footer' => TbHtml::activeTextField($airQueue, 'carriers', [
                'placeholder' => 'Comma separated list. Use ** to match all',
                'style' => 'width:400px;',
                'id' => 'AirsourceQueue_carriers'
            ]),
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'header' => 'Action',
            'template' => '{delete}',
            'buttons' => [
                'delete' => ['url' => '"/airSource/delQueue/".$data->id',]
            ],
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;New queue', $this->createUrl("createQueue"), [
                'success' => 'function(html){  $.fn.yiiGridView.update("airSourceQueue-grid"); }',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'AirsourceQueue[queue_to]' => 'js:$("#AirsourceQueue_queue_to").val()',
                    'AirsourceQueue[queue_number]' => 'js:$("#AirsourceQueue_queue_number").val()',
                    'AirsourceQueue[type_id]' => 'js:$("#AirsourceQueue_type_id").val()',
                    'AirsourceQueue[auto_ticket]' => 'js:$("#AirsourceQueue_auto_ticket").val()',
                    'AirsourceQueue[carriers]' => 'js:$("#AirsourceQueue_carriers").val()',
                    'AirsourceQueue[air_source_id]' => $airQueue->air_source_id,
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'white-space:nowrap; margin-top: 20px;margin-bottom: 20px;',
                'encode' => false,
                'id' => 'newQueueBtn'
            ])
        ],
    ],
]);
?>
<style>
    #airSourceQueue-grid select {
        width: inherit;
        margin-bottom: auto;
    }
    #airSourceQueue-grid input {
        width: inherit;
        margin-bottom: auto;
    }
    #airSourceQueue-grid table td, #airSourceQueue-grid table th {
        text-align: center;
        vertical-align: middle;
    }
</style>