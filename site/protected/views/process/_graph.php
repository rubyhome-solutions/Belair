<?php
/* @var $this ProcessController */
/* @var $model Process */

$serverId = \application\components\Cluster::getServerId();
$perAirSource = Yii::app()->db->createCommand('SELECT air_source.name, AVG(time_needed) AS avg_time  FROM process '
                . 'JOIN air_source on air_source.id = process.air_source_id '
                . "WHERE air_source.is_active=1 AND server_id={$serverId} "
                . 'GROUP BY 1 HAVING AVG(time_needed)>0')
        ->queryAll(false);
foreach ($perAirSource as &$value) {
    $value[1] = round($value[1]);
}
$data = array_merge([['API', 'Time']], $perAirSource);
//echo \Utils::dbg($data);
?>
<div style="float: left">  
    <?php
    $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
        'data' => $data,
        'options' => ['title' => 'Average API response time', 'is3D' => true]]);
    ?>

</div>  