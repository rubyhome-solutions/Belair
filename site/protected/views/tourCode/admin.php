<?php

/* @var $this TourCodeController */
/* @var $model TourCode */


$this->breadcrumbs = ['Tour Codes' => ['admin'],
    'Manage',
];

$this->renderPartial('_admin_grid', [
    'model' => $model,
    'activeClients' => $activeClients,
]);
