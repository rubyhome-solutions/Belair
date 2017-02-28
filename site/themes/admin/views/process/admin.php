<div class="ibox-content m_top1">
<?php

/* @var $this ProcessController */
/* @var $model Process */


$this->breadcrumbs = ['Processes' => ['admin'],
    'Manage',
];

$this->renderPartial('_airSource_APIs_health');
$this->renderPartial('_graph');
$this->renderPartial('_summary', ['model' => $model]);?>
    <div class="clearfix"></div>    
</div>
<div class="ibox-content m_top1">
    <?php $this->renderPartial('_grid', ['model' => $model]);?>
</div>