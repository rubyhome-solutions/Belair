<?php

/* @var $this TourCodeController */
/* @var $model TourCode */


$this->breadcrumbs = ['Private Fares' => ['admin'],
    'Manage',
];

$this->renderPartial('_admin_grid', [
    'model' => $model,
    'activeClients' => $activeClients,
]);
