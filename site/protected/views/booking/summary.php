<?php
/* @var \BookingController $this */
/* @var \Searches $model */

$start_timer = microtime(true);
function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    Yii::app()->end();
}

echo \Utils::dbg($model->attributes);
foreach ($model->processes as $process) {
    echo \Utils::dbg($process->attributes);    
}
//$origin = Airport::model()->findByPk($model->source);
//$destination = Airport::model()->findByPk($model->destination);
//
//$scrapper = AirSource::model()->with('backend')->findByPk($scrapperId);
//$script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $scrapper->backend->search;
//$params = array(
//    'credentials' => array(
//        'username' => $scrapper->username,
//        'password' => $scrapper->password,
//        'timeout' => 85
//    ),
//    'source' => $origin->airport_code,
//    'destination' => $destination->airport_code,
//    'depart' => $model->depart,
//    'return' => $model->return,
//    'adults' => $model->adults,
//    'children' => $model->children,
//    'infants' => $model->infants
//);
//$params = str_replace('"', '\"', json_encode($params));


footer($start_timer);
?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>