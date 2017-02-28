<div class="ibox-content">
<?php

/* @var $this CcPasstruController */
/* @var $model CcPasstru */


$this->breadcrumbs = ['Root Pass-through ' => ['admin'],
    'Manage',
];

echo TbHtml::link('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Add root credit card', "/cc/create", ['class' => 'btn btn-primary', 'style' => 'margin-bottom:15px;']);
?>

    <p><i class='fa fa-cog fa-spin'></i><span> Root Pass–through. This function change the active company to: <b><?php echo $model->userInfo->name;?></b></span></p>
<?php
$this->renderPartial('_admin_grid_root', [
    'model' => $model,
    'activeClients' => $activeClients,
    'clientCards' => $clientCards,
]);
