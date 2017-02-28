<?php
/* @var $this ProcessController */
/* @var $model Process */
use \application\components\Cluster;

$serverId = Cluster::getServerId();
$info = Yii::app()->db->createCommand('SELECT COUNT(*) AS count_all , AVG(memory) AS avg_mem,  AVG(time_needed) AS avg_time, AVG(started-queued) AS avg_delay, '
                . '(SELECT COUNT(*) FROM process WHERE result IS NULL AND started IS NOT NULL AND server_id=' . $serverId . ') AS count_run, '
                . '(SELECT COUNT(*) FROM process WHERE result IS NULL AND started IS NULL AND server_id=' . $serverId . ') AS count_queued, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_ABANDON . ' AND server_id=' . $serverId . ') AS count_abandoned, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_STOPPED . ' AND server_id=' . $serverId . ') AS count_stopped, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_FAIL . ' AND server_id=' . $serverId . ') AS count_failed, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_OK . ' AND server_id=' . $serverId . ') AS count_ok, '
                . "(SELECT COUNT(*) FROM process WHERE result IS NULL AND started < '" . date(DATETIME_FORMAT, time() - 900) . "' AND server_id=" . $serverId . ") AS count_hanged "
                . "FROM process WHERE server_id={$serverId};")
        ->queryRow();
$time1m = \Yii::app()->db->createCommand("SELECT COUNT(*) AS count_all FROM process WHERE queued > '" . date(DATETIME_FORMAT, time() - 60) . "' AND server_id={$serverId};")->queryScalar();
$time5m = \Yii::app()->db->createCommand("SELECT COUNT(*) AS count_all FROM process WHERE queued > '" . date(DATETIME_FORMAT, time() - 300) . "' AND server_id={$serverId};")->queryScalar();
$time1h = \Yii::app()->db->createCommand("SELECT COUNT(*) AS count_all FROM process WHERE queued > '" . date(DATETIME_FORMAT, time() - 3600) . "' AND server_id={$serverId};")->queryScalar();
//$time24h = \Yii::app()->db->createCommand("SELECT COUNT(*) AS count_all FROM process WHERE queued > '" . date(DATETIME_FORMAT, time() - 86400) . "';")->queryScalar();
$maxRunningProcesses = YII_DEBUG ? \Process::MAX_DEBUG_RUNNING_PROCESSES : Cluster::getMaxRunningProcesses();
?>
<table class="table table-condensed table-bordered" style="width: auto;margin-top: 20px;">
    <tr>
        <th>Running processes</th><td><span class="badge badge-<?php echo ($info['count_run'] > 0 ? 'important' : 'success') . '">' . $info['count_run'] . ' / ' . $maxRunningProcesses; ?></span></td>
            <th>Average memory</th><td><?php echo round($info['avg_mem'] / 1024 / 1024, 2) . " MB"; ?></td>
                                                <th>Hanged processes</th><td><span class="badge badge-important"><?php echo $info['count_hanged']; ?></span></td>
    </tr>
    <tr>
        <th>Queued processes</th><td><span class="badge badge-warning"><?php echo $info['count_queued']; ?></span></td>
        <th>Average wait time</th><td><?php echo \Utils::cutMilliseconds($info['avg_delay']); ?></td>
        <th>Abandoned processes</th><td><span class="badge badge-important"><?php echo $info['count_abandoned']; ?></span></td>
    </tr>
    <tr>
        <th>Finished processes</th><td><span class="badge badge-success"><?php echo $info['count_ok']; ?></span></td>
        <th>Average run time</th><td><?php echo \Utils::convertSecToMinsSecs($info['avg_time']); ?></td>
        <th>Stopped processes</th><td><span class="badge badge-important"><?php echo $info['count_stopped']; ?></span></td>
    </tr>
    <tr>
        <th>All processes</th><td><span class="badge badge-info"><?php echo $info['count_all']; ?></span></td>
        <th>Last 60 sec.</th><td><span class="badge badge-info"><?php echo $time1m; ?></span></td>
        <th>Empty results</th><td><span class="badge"><?php echo $info['count_failed']; ?></span></td>
    </tr>
    <tr>
        <th>Last 5 min.</th><td><span class="badge badge-info"><?php echo $time5m; ?></span></td>
        <th>Last 1 hour</th><td><span class="badge badge-info"><?php echo $time1h; ?></span></td>
    </tr>
</table>
<style>
    .badge, .label {font-family: sans-serif}
</style>