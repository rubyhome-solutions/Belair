<div class="ibox-content m_top1">
<?php
/* @var $this XRateController */
/* @var $model \XRate */
/* @var $currency \Currency[] */

$this->breadcrumbs = ['Currencies exchange rates'];

echo TbHtml::ajaxButton('<i class="fa fa-refresh fa-lg"></i>&nbsp;&nbsp;&nbsp;Update the rates', '/xRate/update', [
    'type' => 'POST',
    'update' => '#currency-div'
        ], ['class' => 'btn btn-primary']);

if ($model === null) {
    echo "<h3>No data available - please update the rates!</h3>";
} else {
    $this->renderPartial('_admin_grid', ['model' => $model]);
}
?>
</div>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
</style>