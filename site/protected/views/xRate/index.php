<?php
/* @var $this XRateController */
/* @var $xrate \XRate */
/* @var $currency \Currency[] */

$this->breadcrumbs = ['Currencies exchange rates'];

echo TbHtml::ajaxButton('<i class="fa fa-refresh fa-lg"></i>&nbsp;&nbsp;&nbsp;Update the rates', '/xRate/update', [
    'type' => 'POST',
    'update' => '#currency-div'
        ], ['class' => 'btn btn-primary']);

if ($xrate === null) {
    echo "<h3>No data available - please update the rates!</h3>";
} else {
    $this->renderPartial('_admin_grid', ['xrate' => $xrate]);
}
?>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
</style>