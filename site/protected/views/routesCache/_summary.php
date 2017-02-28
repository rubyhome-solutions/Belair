<?php

/* @var $this RoutesCacheController */
/* @var $model RoutesCache */

$info = Yii::app()->db->createCommand('SELECT COUNT(*) AS count_all , AVG(memory) AS avg_mem,  AVG(time_needed) AS avg_time, AVG(started-queued) AS avg_delay, '
        . '(SELECT COUNT(*) FROM RoutesCache WHERE ended IS NULL AND started IS NOT NULL) AS count_run, '
        . '(SELECT COUNT(*) FROM RoutesCache WHERE ended IS NOT NULL) AS count_finished FROM RoutesCache')
        ->queryRow();
//\Utils::dbgYiiLog($info);
?>
<table class="table table-condensed table-bordered" style="width: auto;margin-top: 20px;">
    <tr>
        <th>Running RoutesCachees</th><td><span class="badge badge-<?php echo ($info['count_run'] > 0 ? 'important' : 'success') . '">' . $info['count_run'] . ' / ' . \RoutesCache::MAX_RUNNING_RoutesCacheES; ?></span></td>
        <th>Average memory</th><td><?php echo round($info['avg_mem'] / 1024 / 1024, 2) . " MB"; ?></td>
    </tr>
    <tr>
        <th>Queued RoutesCachees</th><td><span class="badge badge-warning"><?php echo ($info['count_all'] - $info['count_run'] - $info['count_finished']); ?></span></td>
        <th>Average wait time</th><td><?php echo \Utils::cutMilliseconds($info['avg_delay']); ?></td>
    </tr>
    <tr>
        <th>Finished RoutesCachees</th><td><span class="badge badge-success"><?php echo $info['count_finished']; ?></span></td>
        <th>Average run time</th><td><?php echo \Utils::convertSecToMinsSecs($info['avg_time']); ?></td>
    </tr>
    <tr>
        <th>All RoutesCachees</th><td><span class="badge badge-info"><?php echo $info['count_all']; ?></span></td>
        <th>Memory usage</th><td><?php echo \Utils::getServerMemoryUsage(); ?>%</td>
    </tr>
</table>
<style>
    .badge, .label {font-family: sans-serif}
</style>