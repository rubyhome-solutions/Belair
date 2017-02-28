<?php

/* @var $this CcPasstruController */
/* @var $model CcPasstru */


$this->breadcrumbs = ['Client Pass-through ' => ['admin'],
    'Manage',
];

echo TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Add credit card', "/cc/create", ['class' => 'btn btn-primary', 'style' => 'margin-bottom:15px;']);
$this->renderPartial('_admin_grid_client', [
    'model' => $model,
    'activeClients' => $activeClients,
    'clientCards' => $clientCards,
]);
