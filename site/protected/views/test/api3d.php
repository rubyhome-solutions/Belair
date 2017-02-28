<pre>
    <?php
    set_time_limit(90);     // This crappy APi need much more attention
    $start_timer = microtime(true);

    function footer($start_timer) {
        print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
    }

//    $test = new ActiveUserDetails(\UserType::agentDirect);
//    print_r($test);
//    $test = new application\components\client_sources\DeepLink\FlightSearchResponse;
//    echo json_encode($test) . PHP_EOL;

    $model = \Searches::model()->findByPk(208);
    /* @var $model \Searches */
    print_r($model->attributes);
    $model->waitVisibleAirSourcesToDeliver(\Searches::MAX_WAITING_TIME_API3D);
    $arrRcs1 = $model->getBestPricedMatchesOneWay(20);
//    print_r($arrRcs); exit;
    $arrRcs2 = $model->getBestPricedMatchesTwoWays(20);
    $arrRcs = array_merge($arrRcs1, $arrRcs2);
//    echo \Utils::dbg($rcs); exit;
    $commercialPlan = \CommercialPlan::findB2cPlan();
    $i = 1;
    foreach ($arrRcs as &$journeys) {
        $fare = 0;
        foreach ($journeys as &$journey) {
            foreach ($journey as &$rc) {
                /* @var $rc \RoutesCache */
//            echo "$rc->total_fare\t$rc->base_fare\t$rc->tax_yq\t$rc->traveler_type_id\n";
                if ($commercialPlan !== null) {
                    $commercialPlan->applyPlanToRouteCache($rc, \ClientSource::SOURCE_SKYSCANNER);
//                echo "$rc->total_fare\t$rc->base_fare\t$rc->tax_yq\t$rc->traveler_type_id\n";
//                echo "$rc->total_fare\t$rc->base_fare\t$rc->tax_yq\t$rc->commercial_rule_id\t$rc->traveler_type_id\n";
//                print_r($rc->attributes);
                }
                $fare += $rc->total_fare;
                echo "$i.\t" . \Airport::getAirportCodeFromId($rc->origin_id) . "-->" . \Airport::getAirportCodeFromId($rc->destination_id) . " {$rc->air_source_id}\t$rc->grouping\t$rc->total_fare\t$rc->departure_date $rc->departure_time\t$rc->traveler_type_id\t$rc->hash_str\n"; //Source->backend->name}
            }
        }
        echo "$i.\t$fare\n";
        $i++;
    }

//    $res = $model->pg->captureWithProvider($model->id);
//    $test = new \application\components\Galileo\PnrManagement;
//    $res = $test->testIssueTicket('3CNDXY', 39);
//    echo \Utils::dbg($res);
//    $pnrManage = new \application\components\Spicejet\PnrManagement;
//    $pnrManage->connect('production', [], \application\components\Spicejet\Utils::PRODUCTION_AIRSOURCE_ID);
//    $pnrManage->retrievePnr('JERVMR');
//    print_r($pnrManage->pnrResponseObj);
//    \Utils::objectToFile('SG_pnr.json', $pnrManage->pnrResponseObj);
//    $pnrObject = \Utils::fileToObject('SG_pnr.json');
//    $pnrAcq = new application\components\Spicejet\PnrAcquisition($pnrObject, \application\components\Spicejet\Utils::PRODUCTION_AIRSOURCE_ID);
//    $pnrAcq->test();
//    $test = \AirCart::model()->findByPk(188);
    /* @var $test \AirCart */
//    $test->applyCommissionRule();
    footer($start_timer);
    ?>
</pre>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>