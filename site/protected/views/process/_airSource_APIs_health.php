<?php
/* @var $this ProcessController */

$servers = ['Master', 'Slave1', 'Slave2', 'Slave3', 'Slave4', 'Slave5', 'Slave6', 'Slave7', 'Slave8'];
$perNode = Yii::app()->db->createCommand('SELECT server_id, AVG(time_needed) AS avg_time FROM process '
                . 'GROUP BY 1 HAVING AVG(time_needed)>0')
        ->queryAll(false);
foreach ($perNode as &$value) {
    $value[0] = $servers[$value[0]];
    $value[1] = round($value[1]);
}
$data = array_merge([['Node', 'Time']], $perNode);
?>
<div class="pull-left text-center" style="margin-right: 10px; font-size: .9em;">
    <?php
    $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
        'data' => $data,
        'options' => ['title' => 'Cluster times', 'is3D' => true]]);
    ?>
</div>

<?php
$perNode = Yii::app()->db->createCommand('SELECT server_id, count(*) FROM process GROUP BY 1;')->queryAll(false);
foreach ($perNode as &$value) {
    $value[0] = $servers[$value[0]];
}
$data = array_merge([['Node', 'Processes']], $perNode);
?>
<div class="pull-left text-center" style="margin-right: 10px; font-size: .9em;">
    <?php
    $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
        'data' => $data,
        'options' => ['title' => 'Cluster load', 'is3D' => true]]);
    ?>
</div>

<div class="pull-left text-center" style="margin-right: 10px; font-size: .9em;">
    <?php
    $countPerTime = Yii::app()->db->createCommand('SELECT left(air_source."name",11) AS "API", CASE process."result" WHEN 0 THEN \'OK\' ELSE \'Empty\' END AS "Result", COUNT(process.id) AS "Count" FROM process '
                    . "JOIN air_source ON air_source.id=process.air_source_id "
                    . "WHERE process.queued + interval '1 hour' > 'now' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
    echo "<span class='label'>APIs health in the last 1 hour</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['API' => '---', 'Result' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>

<div class="clearfix"></div>
<style>
    span.label {font-size: inherit}
    div.pull-left>table {margin: auto}
</style>