<?php
/* @var $this ProcessController */
/* @var $model Process */

$info = \Yii::app()->db->createCommand('SELECT COUNT(*) AS count_all , AVG(memory) AS avg_mem,  AVG(time_needed) AS avg_time, AVG(started-queued) AS avg_delay, '
                . '(SELECT COUNT(*) FROM process WHERE result IS NULL AND started IS NOT NULL) AS count_run, '
                . '(SELECT COUNT(*) FROM process WHERE result IS NULL AND started IS NULL) AS count_queued, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_ABANDON . ') AS count_abandoned, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_STOPPED . ') AS count_stopped, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_FAIL . ') AS count_failed, '
                . '(SELECT COUNT(*) FROM process WHERE result=' . \Process::RESULT_OK . ') AS count_ok, '
                . '(SELECT COUNT(*) FROM process WHERE result IS NULL AND started + interval \'15 minute\' < \'now\') AS count_hanged FROM process;')
        ->queryRow();
$time5m = \Yii::app()->db->createCommand("SELECT COUNT(*) AS count_all FROM process WHERE queued + interval '5 minute' > 'now';")->queryRow(false);
$time1h = \Yii::app()->db->createCommand("SELECT COUNT(*) AS count_all FROM process WHERE queued + interval '1 hour' > 'now';")->queryRow(false);
$time24h = \Yii::app()->db->createCommand("SELECT COUNT(*) AS count_all FROM process WHERE queued + interval '24 hour' > 'now';")->queryRow(false);
//\Utils::dbgYiiLog($info);
?>
<div class="col-md-7">

<div class="ibox-content  table-full">
    <table class="table table-condensed table-bordered" style="width: auto;margin-top: 20px;">
    <tr>
        <th>Running processes</th><td><span class="badge badge-<?php echo ($info['count_run'] > 0 ? 'important' : 'success') . '">' . $info['count_run'] . ' / ' . \Process::MAX_RUNNING_PROCESSES; ?></span></td>
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
        <th>Memory usage</th><td><?php echo \Utils::getServerMemoryUsage(); ?>%</td>
        <th>Failed processes</th><td><span class="badge badge-important"><?php echo $info['count_failed']; ?></span></td>
    </tr>
    <tr>
        <th>Last 5 min.</th><td><span class="badge badge-info"><?php echo $time5m[0]; ?></span></td>
        <th>Last 1 hour</th><td><span class="badge badge-info"><?php echo $time1h[0]; ?></span></td>
        <th>Last 24 hours</th><td><span class="badge badge-info"><?php echo $time24h[0]; ?></span></td>
    </tr>
</table>
</div></div>
    
<style>
    .badge, .label {font-family: sans-serif}
</style>