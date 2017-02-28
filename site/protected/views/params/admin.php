<?php

/* @var $this ParamsController */
/* @var $model Params */


$this->breadcrumbs = [
    'Params' => ['admin'],
    'Manage',
];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}

echo \TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Create new parameter', "/params/create", ['class' => 'btn btn-primary']);

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'params-grid',
    'dataProvider' => $model->search(),
    'columns' => [
        [
            'name' => 'id',
            'headerHtmlOptions' => ['style' => 'width: 190px;'],
        ],
        'info',
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'header' => 'Action',
            'template' => '{update}',
            'buttons' => [
                'update' => [
                    'url' => '"/params/update?id=".$data->id',
                ],
            ],
        ],
    ],
]);
