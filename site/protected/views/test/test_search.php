<?php
set_time_limit(2000);     // This test need much more time
\Yii::import('application.models.forms.BookingSearchForm');
session_write_close();

$params = getFromCsv(\Yii::app()->runtimePath . '/100_searches_for_testing.csv');
$i=1;
foreach ($params as $param) {
    echo \Utils::dbg(['count' => $i, 'params' => $param]);
    $form = fillBookingSearchForm($param);
    $search = \Searches::populate($form);
//    echo \Utils::dbg($form);
    sleep(1);
    $i++;
}

function getFromCsv($file, $delimiter = ',') {
    $out = [];
    if (($handle = fopen($file, "r")) !== FALSE) {
        $keys = fgetcsv($handle, 0, $delimiter);
        while (($lineArray = fgetcsv($handle, 0, $delimiter)) !== FALSE) {
            $data = [];
            for ($j = 0; $j < count($lineArray); $j++) {
                $data[$keys[$j]] = $lineArray[$j] == '\N' ? null : $lineArray[$j];
            }
            $data['depart'] = date(DATE_FORMAT, time() + 24 * 3600 * $data['depart_after']);
            $data['return'] = $data['return_after'] ? date(DATE_FORMAT, time() + 24 * 3600 * $data['return_after']) : null;
            $out[] = $data;
        }
        fclose($handle);
    }
    return $out;
}

function fillBookingSearchForm($param) {
    $out = new \BookingSearchForm;
    $out->setAttributes($param, false);
    $out->source = \Airport::getIdFromCode($param['origin']);
    $out->destination = \Airport::getIdFromCode($param['destination']);

    return $out;
}

?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>