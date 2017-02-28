<div class="ibox-content m_top1">
<?php
/* @var $this Api3dController */
/* @var $model ClientSource */

$this->breadcrumbs = ['Client Sources' => ['admin'],
    'Manage',
];
\Yii::import('ext.ajax-input-column.AjaxInputColumn');

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'client-source-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED, TbHtml::GRID_TYPE_HOVER],
    'htmlOptions' => ['class' => 'span9', 'style' => 'margin-left:0'],
    'dataProvider' => $model->search(),
    'columns' => [
        'id',
        'name',
//        'url',
        [
            'name' => 'is_active',
            'value' => 'empty($data->is_active) ? "<span class=\"badge badge-important\">No</span>" : "<span class=\"badge badge-success\">Yes</span>"',
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'type' => 'raw',
            'filter' => ['No', 'Yes']
        ],
        [
            'name' => 'username',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateClientSource"),
        ],
        [
            'name' => 'password',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateClientSource"),
//            'htmlOptions' => ['style' => 'width:120px'],
        ],
        [
            'name' => 'officeid',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateClientSource"),
        ],
//        'component',
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'header' => 'Action',
            'template' => '{enable}{disable}',
            'buttons' => [
                'enable' => [
                    'url' => '"start/".$data->id',
                    'visible' => '$data->is_active == 0',
                    'label' => '<i class="fa fa-play fa-lg"></i>',
                    'options' => [
                        'title' => 'Start this source',
                        'style' => "color: red;",
                    ]
                ],
                'disable' => [
                    'url' => '"stop/".$data->id',
                    'label' => '<i class="fa fa-pause fa-lg"></i>',
                    'visible' => '$data->is_active != 0 && $data->id != 1',
                    'options' => [
                        'title' => 'Pause this source',
                        'style' => "color: green;",
                    ]
                ],
            ],
        ]
    ],
]);
?>
</div>
<style>
    #client-source-grid select {
        width: inherit;
        margin-bottom: auto;
    }
    #client-source-grid input {
        width: inherit;
        margin-bottom: auto;
    }
    #client-source-grid table td, #client-source-grid table th {
        text-align: center;
        vertical-align: middle;
    }
    .badge {font-size: inherit}
</style>