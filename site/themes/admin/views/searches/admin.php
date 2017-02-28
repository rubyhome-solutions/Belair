<div class="ibox-content">
<?php
/* @var $this SearchesController */
/* @var $model Searches */


$this->breadcrumbs = [
    'Searches' => ['admin'],
    'Manage',
   ];

$this->renderPartial('_graphs');
$this->renderPartial('_grid', ['model' => $model]);
?>
</div>