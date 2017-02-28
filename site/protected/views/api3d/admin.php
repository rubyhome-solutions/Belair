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
//        'url',
        [
            'name' => 'is_active',
            'value' => 'empty($data->is_active) ? "<span class=\"badge badge-important\">No</span>" : "<span class=\"badge badge-success\">Yes</span>"',
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'type' => 'raw',
            'filter' => ['No', 'Yes']
        ],
        [
            'name' => 'name',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateClientSource"),
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'footer' => TbHtml::activeTextField($model, 'name', ['id' => 'NEW_name']),
        ],
        [
            'name' => 'username',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateClientSource"),
            'footer' => TbHtml::activeTextField($model, 'username', ['id' => 'NEW_username']),
        ],
        [
            'name' => 'password',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateClientSource"),
            'footer' => TbHtml::activeTextField($model, 'password', ['id' => 'NEW_password']),
//            'htmlOptions' => ['style' => 'width:120px'],
        ],
        [
            'name' => 'officeid',
            'class' => 'AjaxInputColumn',
            'url' => $this->createUrl("updateClientSource"),
            'footer' => TbHtml::activeTextField($model, 'officeid', ['id' => 'NEW_officeid']),
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
            'footer' => TbHtml::ajaxButton(
                    '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Save', $this->createUrl("api3d/create"), [
                'success' => 'function(error){ '
                . '  if (!error) { '
                . '    $.fn.yiiGridView.update("client-source-grid"); '
                . '  } else {'
                . '    alert(error);'
                . '  } '
                . '}',
                'type' => 'POST',
                'data' => [
                    'ajax' => true,
                    'NEW[name]' => 'js:$("#NEW_name").val()',
                    'NEW[username]' => 'js:$("#NEW_username").val()',
                    'NEW[password]' => 'js:$("#NEW_password").val()',
                    'NEW[officeid]' => 'js:$("#NEW_officeid").val()',
                ],
                    ], [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'white-space:nowrap; margin-top:15px;margin-bottom:20px;',
                'encode' => false,
                'id' => 'newRecordBtn'
            ])
        ]
    ],
]);
?>
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