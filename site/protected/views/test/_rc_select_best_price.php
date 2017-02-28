<pre style="width: 200%">
    <?php

    use \application\components\client_sources\DeepLink\FlightSearchRequest;

//$log = \Yii::app()->getComponent('log', false);
//echo \Utils::dbg($log);
//Yii::app()->end();
//$log->setRoutes([
//    [
//        'class' => 'ext.yii-debug-toolbar.YiiDebugToolbarRoute',
//        // Access is restricted by default to the localhost
//        'ipFilters' => array('127.0.0.1', '192.168.1.*'),
//    ]
//        ]
//);
//echo \Utils::dbg(\Yii::app()->getComponent('log', false));
//Yii::app()->end();
//$rc = \RoutesCache::model()->findByPk(58611);
//$rc->registerInAppCache($rc->total_fare, $rc->airSource->priority);
//echo \Utils::dbg($rc->getFromAppCache());


    $searches = \Searches::model()->findAllBySql('select * from searches order by id desc limit 100');
//echo \Utils::dbg($rc->getFromAppCache());
    foreach ($searches as $search) {
//        $search->removeDuplicates();
        /* @var $search \Searches */
        echo "<legend style='font-size:1.4em'>Search:$search->id/$search->created {$search->origin}-{$search->destination}" . ($search->date_return ? "-{$search->origin}" : '') .
        " {$search->adults}/{$search->children}/{$search->infants} </legend>";
//        $arrRcs = $search->getBestPricedMatchesOneWayV2(FlightSearchRequest::MAX_NUMRESULTS);
//        printRcs($arrRcs);
//        if (!empty($search->date_return)) {
//            $arrRcs2 = $search->getBestPricedMatchesTwoWaysV2(FlightSearchRequest::MAX_NUMRESULTS);
//            printRcs($arrRcs2);
//        }
        $dups = $search->findDuplicateRCs();
        $out = [];
        foreach ($dups as $dup) {
            $out[] = [
                'a.id' => $dup['a']->id,
                'b.id' => $dup['b']->id,
                'a.tf' => $dup['a']->total_fare,
                'b.tf' => $dup['b']->total_fare,
                'a.prio' => $dup['a']->airSource->priority,
                'b.prio' => $dup['b']->airSource->priority,
                'a.hash' => $dup['a']->hash_str,
                'b.hash' => $dup['b']->hash_str,
//                'a.key' => strstr($dup['a']->appCacheKey, \RoutesCache::HASH_SEPARATOR),
//                'b.key' => strstr($dup['b']->appCacheKey, \RoutesCache::HASH_SEPARATOR),
            ];
        }
        if (!empty($out)) {
            echo \Utils::arr2table($out);
            echo \Utils::dbg($search->findDuplicateRcIdsToBeRemoved());
        }
    }

//    echo \Utils::dbg(\AirSource::$cachedAirSources);

    function printRcs($arr) {
        $out = [];
        foreach ($arr as $journeys) {
            $directions = [];
            foreach ($journeys as $journey) {
                $paxes = [];
                foreach ($journey as $rc) {
                    $paxes[] = $rc->hash_str;
                }
                $directions[] = implode(' + ', $paxes);
            }
            $out[] = $directions;
        }
        echo \Utils::arr2table($out);
    }
    ?>
</pre>
