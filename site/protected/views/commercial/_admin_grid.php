<?php
/* @var $this CommercialController */
/* @var $model CommercialPlan */

Yii::import('ext.ajax-input-column.AjaxInputColumn');
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'commercials-grid',
    'dataProvider' => $model->search(),
//    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER],
    'selectableRows' => 1,
//    'selectionChanged' => 'function(id){ location.href = "' . $this->createUrl('update') . '/"+$.fn.yiiGridView.getSelection(id);}',
    'htmlOptions' => ['class' => 'span8', 'style' => 'margin-left:0'],
    'columns' => [
        [
            'name' => 'name',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("rename"),
            'footer' => TbHtml::textField('Plan_name', '', [
                'placeholder' => 'New plan name...',
                'style' => 'width:400px;',
                'id' => 'Plan_name'
            ]),
        ],
        [
            'header' => 'User count',
            'value' => '$data->countUsers()',
            'footer' => TbHtml::dropDownList('copyPlan', '', CHtml::listData(\CommercialPlan::model()->findAll(['order' => 'name']), 'id', 'name'), [
                'size' => TbHtml::INPUT_SIZE_MEDIUM,
                'prompt' => 'Copy rules from ...',
                'id' => 'copyPlan'
            ]),
        ],
        [
            'header' => 'Rules count',
            'value' => 'count($data->commercialRules)',
            'footer' => TbHtml::ajaxSubmitButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Add plan', $this->createUrl("create"), [
                'success' => 'function(html){  $.fn.yiiGridView.update("commercials-grid"); }',
                'data' => [
                    'ajax' => true,
                    'CommercialPlan[name]' => 'js:$("#Plan_name").val()',
                    'copyPlan' => 'js:$("#copyPlan").val()',
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_WARNING,
                'style' => 'white-space:nowrap;',
                'encode' => false,
            ])
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'header' => 'Action',
            'template' => '{view}{disable}{delete}',
            'buttons' => [
                'view' => [
                    'url' => '"/commercial/update/".$data->id',
                    'label' => '<i class="fa fa-eye fa-lg"></i>',
                    'options' => [
                        'title' => 'View',
                        'style' => "color:black; margin-left:5px;",
                    ],
                ],
                'delete' => [
                    'url' => '"/commercial/delete/".$data->id',
                    'visible' => '$data->countUsers()==0 && $data->name!=\CommercialPlan::PLAN_B2C',
//                    'label' => '<i class="fa fa-eye fa-lg"></i>',
//                    'options' => [
//                        'title' => 'View',
//                        'style' => "color:black; margin-left:5px;",
//                    ],
                ],
                'disable' => [
                    'url' => '"/commercial/disable/".$data->id',
                    'label' => '<i class="fa fa-power-off"></i>',
                    'visible' => '$data->name != \CommercialPlan::PLAN_B2C',
//                    'icon' => TbHtml::ICON_THUMBS_DOWN,
//                    'visible' => '$data->countUsers()==0',
                    'options' => [
                        'title' => 'Disable plan',
                        'style' => "color:red; margin-left:5px;",
//                        'class' => 'delete',
                        'ajax' => [
                            'type' => 'POST',
                            'url' => 'js:$(this).attr("href")',
                            'success' => 'js:function(data) { window.location.reload(); }'
                        ]
                    ],
                ],
            ]
        ],
    ],
]);
?>
<style>
    /*table.items.table tr td {cursor: pointer}*/
    input.ajax-input-column {
        width: 400px;
        margin-bottom: auto;
    }
</style>