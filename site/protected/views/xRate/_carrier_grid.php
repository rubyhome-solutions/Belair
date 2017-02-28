<?php
/* @var $this \XRateController */
/* @var $model \Carrier */

$this->breadcrumbs = [
    'Airlines' => ['airline'],
    'Manage'
];

Yii::import('ext.ajax-input-column.AjaxInputColumn');
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'carrier-grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'htmlOptions' => [
//        'class' => 'span7',
        'style' => 'margin-left:0; width: 700px;'
    ],
    'columns' => [
        [
            'header' => 'Logo',
//            'headerHtmlOptions' => ['style' => 'width: 80px;'],
            'htmlOptions' => ['style' => 'text-align: center'],
            'value' => '$data->generateImgTag',
            'type' => 'raw',
            'filter' => false,
        ],
        [
            'name' => 'disabled',
            'value' => 'empty($data->disabled) ? "<span class=\"badge badge-success\">Active</span>" : "<span class=\"badge badge-important\">Excluded</span>"',
            'type' => 'raw',
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'htmlOptions' => ['style' => 'text-align: center'],
            'filter' => ['No', 'Yes'],
        ],
        [
            'name' => 'code',
            'headerHtmlOptions' => ['style' => 'width: 80px;'],
            'htmlOptions' => ['style' => 'text-align: center'],
        ],
        [
            'name' => 'name',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("renameAirline"),
            'placeholder' => '-- Please set the name --',
            'value' => 'empty($data->name) ? "" : $data->name',
//            'headerHtmlOptions' => ['style' => 'width: 300px;'],
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'header' => 'Action',
            'headerHtmlOptions' => ['style' => 'width: 60px; text-align:center;'],
            'htmlOptions' => ['style' => 'width: 60px; text-align:center;'],
            'template' => '{enable}{disable}',
            'buttons' => [
                'enable' => [
                    'url' => '"airlineFlip/".$data->id',
                    'click' => "function(){
                        $.fn.yiiGridView.update('carrier-grid', {
                            type:'POST',
                            url:$(this).attr('href'),
                            success:function(data) {
                                $.fn.yiiGridView.update('carrier-grid');
                                }
                        });
                        return false;
                    }",
                    'visible' => '$data->disabled != 0',
                    'label' => '<i class="fa fa-plane fa-2x"></i>',
                    'options' => [
                        'title' => 'Start this airline',
                        'style' => "color: green;",
                        'data-placement' => 'left'
                    ]
                ],
                'disable' => [
                    'url' => '"airlineFlip/".$data->id',
                    'click' => "function(){
                        $.fn.yiiGridView.update('carrier-grid', {
                            type:'POST',
                            url:$(this).attr('href'),
                            success:function(data) {
                                $.fn.yiiGridView.update('carrier-grid');
                                }
                        });
                        return false;
                    }",
                    'label' => '<i class="fa fa-power-off fa-2x"></i>',
                    'visible' => '$data->disabled == 0',
                    'options' => [
                        'title' => 'Exclude this airline',
                        'style' => "color: red;",
                        'data-placement' => 'left'
                    ]
                ],
            ],
        ]
    ],
]);
?>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important;}
    input {width: 97%}
    .badge {font-size: inherit}
</style>