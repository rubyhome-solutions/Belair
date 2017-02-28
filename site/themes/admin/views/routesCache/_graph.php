<?php
/* @var $this RoutesCacheController */
/* @var $model RoutesCache */

$perAirSource = \Yii::app()->db->createCommand('SELECT air_source.name, AVG(time_needed) AS avg_time  FROM RoutesCache '
                . 'JOIN air_source on air_source.id = RoutesCache.air_source_id '
                . 'WHERE air_source.is_active=1 '
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
    $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'PieChart',
        'data' => $data,
        'options' => array('title' => 'Average API response time')));
    ?>

</div>  