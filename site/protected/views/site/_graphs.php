<div style="float:left;" id="fareCheckStats">
    <?php $this->renderPartial('/report/_fareCheckStats'); ?>
</div>
<?php
echo TbHtml::ajaxButton('Clear the stats', '/report/clearStats/' . application\components\Reporting\Statistics::CLEAR_FARE_CHECK_STATS, [
    'success' => 'js:function() {
            $("#fareCheckStats").html("<span class=\'alert alert-info\' style=\'margin-right:20px;\'>Fare checks data is initialized...</span>");
            $("#btnClearFareCheckStats").blur();
        }',
    'type' => 'post',
        ], [
    'class' => 'btn btn-warning',
    'id' => 'btnClearFareCheckStats'
]) . '<br>';
echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, "Gathered since: <b>" . \Yii::app()->cache->get(application\components\Reporting\Statistics::AVAILABILITY_AND_FARE_RESET_TIME) . '</b>', [
    'style' => 'display:table',
]);
?>
<div class="clearfix"></div>
<div style="float:left; margin-right: 50px;" id="deeplinkChart">
    <?php
    $deeplinkData = application\components\Reporting\Statistics::getDeeplinkStats();
    foreach ($deeplinkData as $row) {
        $data[] = [$row['Source'], (int) $row['Count']];
    }
    $this->widget('ext.Hzl.google.HzlVisualizationChart', [
        'visualization' => 'PieChart',
        'data' => array_merge([['Source', 'Count']], $data),
        'options' => ['title' => 'Deeplink metas requests distribution', 'is3D' => true],
    ]);
    ?>
</div>
<div style="float:left; margin-right: 50px;" id="deeplinkStats">
    <?php echo \Utils::arr2table($deeplinkData); ?>
</div>
<?php
echo TbHtml::ajaxButton('Clear the stats', '/report/clearStats/' . application\components\Reporting\Statistics::CLEAR_DEEPLINK_RESPONSE_TIME_STATS, [
    'success' => 'js:function(data) {
            $("#deeplinkChart").html("");
            $("#deeplinkStats").html(data);
            $("#deeplinkGatheredSince").html("Gathered since: <b>Just reseted</b>");
            $("#btnClearDeeplinkStats").blur();
        }',
    'type' => 'post',
        ], [
    'class' => 'btn btn-warning',
    'id' => 'btnClearDeeplinkStats'
]) . '<br>';
echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, "Gathered since: <b>" . \Yii::app()->cache->get(application\components\Reporting\Statistics::DEEPLINK_RESET_TIME) . '</b>', [
    'style' => 'display:table;',
    'id' => 'deeplinkGatheredSince'
]);
?>
<div style="float:left;">
    <h5>Request details:</h5>
    <pre style="display: none"><?php echo print_r($_SERVER, true); ?></pre>
</div>
