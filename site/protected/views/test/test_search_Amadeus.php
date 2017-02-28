<?php
set_time_limit(2000);     // This crappy APi need much more attention
//    print_r(\Taxes::reformatScrapperTaxes('Agency Transaction Fee: 114.5<br>CUTE Fee: 50<br>Passenger Service Fee: 146<br>User Development Fee Departure (UDF): 664<br>Government Service Tax: 392'));
//    $params = json_decode('{"type_id":2,"source":"BLR","destination":"SOF","depart":"2014-11-18","return":"2014-11-25","adults":1,"children":1,"infants":0,"category":1}');
//$params[] = json_decode('{"type_id":2,"source":"DEL","destination":"DXB","depart":"2016-08-27","return":"2016-09-27","adults":1,"children":0,"infants":1,"category":1}');
//$params2 = json_decode('{"type_id":2,"source":"DEL","destination":"DXB","depart":"2016-08-27","return":"","adults":1,"children":0,"infants":1,"category":1}');
//    $res = \application\components\Galileo\Utils::search(\application\components\Galileo\Utils::DEFAULT_GALILEO_PRODUCTION_ID, $params);
//    $res = \application\components\Amadeus\Utils::search(\application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID, $params);
//    $res = \application\components\Goair\Utils::search(\application\components\Goair\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID, $params);
//$res = \application\components\Indigo\Utils::search(\application\components\Indigo\Utils::PRODUCTION_AIRSOURCE_ID, $params);
//    $res = \application\components\Spicejet\Utils::search(\application\components\Spicejet\Utils::PRODUCTION_AIRSOURCE_ID, $params);

$params = getFromCsv(\Yii::app()->runtimePath . '/100_searches_for_testing.csv');
foreach ($params as $param) {
    echo \Utils::dbg($param);
    $param2 = clone $param;

//    Test V2 search
//    $res = \application\components\Amadeus\Utils::searchV2(\application\components\Amadeus\Utils::TEST_V2_ID, $param);
//    printIt($res);
    // Production search
//    $res = \application\components\Amadeus\Utils::search(\application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID, $param2);
    // Production search V2
    $res = \application\components\Amadeus\Utils::searchV2(\application\components\Amadeus\Utils::PROD_V2_ID, $param2);
    printIt($res);

//    break;
}

//$res = \application\components\Amadeus\Utils::searchV2(\application\components\Amadeus\Utils::TEST_V2_ID, $params2);
//printIt($res);

function printIt($res) {
    $decoded = json_decode($res);
    if (json_last_error() !== JSON_ERROR_NONE) {
//        echo json_last_error_msg();
        echo \utils::dbg("Error: $res");
    } else {
        echo \Utils::dbg($decoded);
    }
}

function getFromCsv($file, $delimiter = ',') {
    $out = [];
    if (($handle = fopen($file, "r")) !== FALSE) {
        $keys = fgetcsv($handle, 0, $delimiter);
        while (($lineArray = fgetcsv($handle, 0, $delimiter)) !== FALSE) {
            $data = new stdClass();
            for ($j = 0; $j < count($lineArray); $j++) {
                $data->$keys[$j] = $lineArray[$j] == '\N' ? null : $lineArray[$j];
            }
            $data->depart = date(DATE_FORMAT, time() + 24 * 3600 * $data->depart_after);
            $data->return = $data->return_after ? date(DATE_FORMAT, time() + 24 * 3600 * $data->return_after) : null;
            $data->source = $data->origin;
            $out[] = $data;
        }
        fclose($handle);
    }
    return $out;
}

// Scrappers test
//    $search = \Searches::model()->findByPk(1);
/* @var $search \Searches */
//    $res = json_decode(file_get_contents('indigo_scrapper_output.json'), true);
//    print_r($search->addResults($res, 33));
?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>