<?php

namespace application\components\client_sources\DeepLink;

/**
 * Test helper for the DeepLink API
 *
 * @author Tony
 */
class Test {

    public $endPoint;

    public function __construct($endPoint=null) {
        if (YII_DEBUG) {
            $this->endPoint = $endPoint ? : (defined('DEEPLINK_LOCAL_URL') ? DEEPLINK_LOCAL_URL : \Yii::app()->request->hostInfo);
        } else {
            $this->endPoint = DEEPLINK_API_URL;
        }
        $this->endPoint .= '/api3d/search';
    }

    static function curl($url, $extra, $timeout) {
        // Assigning cURL options to an array
        $options = [CURLOPT_RETURNTRANSFER => TRUE, // Setting cURL's option to return the webpage data
            CURLOPT_FOLLOWLOCATION => TRUE, // Setting cURL to follow 'location' HTTP headers
            CURLOPT_AUTOREFERER => TRUE, // Automatically set the referer where following 'location' HTTP headers
            CURLOPT_CONNECTTIMEOUT => 5, // Setting the amount of time (in seconds) before the request times out
            CURLOPT_TIMEOUT => $timeout, // Setting the maximum amount of time for cURL to execute queries
            CURLOPT_MAXREDIRS => 10, // Setting the maximum number of redirections to follow
            CURLOPT_ENCODING => "gzip", // To hadle zipped streams
            CURLOPT_URL => $url, // Setting cURL's URL option with the $url variable passed into the function
            CURLOPT_SSL_VERIFYPEER => false, // Do not check for SSL certificate
            CURLOPT_SSL_VERIFYHOST => false, // Do not check for SSL certificate
            CURLOPT_POSTFIELDS => $extra,
            CURLOPT_POST => true,
            CURLOPT_HTTPHEADER => ['Content-Type: application/x-www-form-urlencoded'],
        ];
        $ch = curl_init();   // Initialising cURL
        curl_setopt_array($ch, $options);   // Setting cURL's options using the previously assigned array data in $options
        $data = curl_exec($ch); // Executing the cURL request and assigning the returned data to the $data variable
        $err = curl_error($ch);
        curl_close($ch);     // Closing cURL
        return ['result' => $data, 'error' => $err];     // Returning the data from the function
    }

    function send100($timeout, $clientSourceId = \ClientSource::SOURCE_DIRECT) {
        echo "Endpoint: {$this->endPoint}\n";
        // Prepare the request
        $request = new FlightSearchRequest;
        $clientSource = \ClientSource::model()->cache(600)->findByPk($clientSourceId);
        $request->credentials->officeid = $clientSource->officeid;
        $request->credentials->username = $clientSource->username;
        $request->credentials->password = $clientSource->password;
        $request->prefclass = 'E';
        $request->prefcarrier = 'All';
        $request->numresults = 100;
        unset($request->validationErrors);
        $params = self::getFromCsv();

        $stats['success'] = [];
        $stats['errors'] = 0;
        foreach ($params as $param) {
            // Set the specifics
            $request->origin = $param['origin'];
            $request->destination = $param['destination'];
            $request->onwarddate = $param['depart'];
            $request->returndate = $param['return'];
            $request->numadults = (int) $param['adults'];
            $request->numchildren = (int) $param['children'];
            $request->numinfants = (int) $param['infants'];

            // Execute
            $timeStamp = microtime(true);
            $res = self::curl($this->endPoint, json_encode($request), $timeout);
            $timeNeeded = round(microtime(true) - $timeStamp, 2);
            echo "$timeNeeded {$param['origin']}-{$param['destination']}" . ($param['return'] ? "-{$param['origin']} " : ' ') .
            $param['depart'] . ($param['return'] ? "-{$param['return']}" : '') .
            " {$param['adults']}/{$param['children']}/{$param['infants']}\n";

            if (!empty($res['error']) || strstr($res['result'], '{"error":')) {
                print_r($res);
                $stats['errors']++;
            } else {
                $stats['success'][] = $timeNeeded;
            }
        }
        echo "Errors: {$stats['errors']} \t Mean response time: " . ( array_sum($stats['success']) / count($stats['success']) ) . PHP_EOL;
    }

    static function getFromCsv($file = null) {
        if (empty($file)) {
            $file = \Yii::app()->runtimePath . '/100_searches_for_testing.csv';
        }
        $out = [];
        if (($handle = fopen($file, "r")) !== FALSE) {
            $keys = fgetcsv($handle, 0, ',');
            while (($lineArray = fgetcsv($handle, 0, ',')) !== FALSE) {
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

}
