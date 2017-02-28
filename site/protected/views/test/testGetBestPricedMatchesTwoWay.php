<?php

$searches = \Searches::model()->findAllBySql("SELECT * FROM searches WHERE date_return IS NOT NULL AND created + interval '10 minute' < CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 500");
echo \Utils::dbg("Existing searches in RC: " . count($searches));
$totalTime = 0;
$totalTime2 = 0;
$totalCount = 0;
$data = [];
$maxResults = 100;
foreach ($searches as $search) {
    /* @var $search \Searches */
    $startTime = microtime(true);
    $result1 = $search->getBestPricedMatchesTwoWays($maxResults);
    $elapsed = microtime(true) - $startTime;
    $startTime2 = microtime(true);
    $result2 = $search->getBestPricedMatchesTwoWaysV2($maxResults);
    $elapsed2 = microtime(true) - $startTime2;
//    $result2 = $search->getBestPricedMatchesTwoWays(1000);
    $totalTime += $elapsed;
    $totalTime2 += $elapsed2;
    $totalCount++;
    $diff = array_diff(formatResults($result1), formatResults($result2));
    $data [] = [
        'id' => $search->id,
        'ADT' => $search->adults,
        'CHD' => $search->children,
        'INF' => $search->infants,
        'date2' => $search->date_return,
        "R1" => count($result1),
        "R2" => count($result2),
        "EqualCount" => count($result2) === count($result1) ? 'true' : 'false',
        "Equal" => count($diff) ? 'false' : 'true',
        'time' => round($elapsed, 4),
        'timeV2' => round($elapsed2, 4),
    ];
    if (count($diff)) {
//        echo \Utils::dbg($diff);
//        echo \Utils::dbg(formatResults($result1));
//        echo \Utils::dbg(formatResults($result2));
//        echo \Utils::dbg($result1);
//        echo \Utils::dbg($result2);
    }
}
echo \Utils::arr2table($data);
echo "<pre>Average time needed original: " . round($totalTime / $totalCount, 4) . "\n";
echo "Average time needed V2: " . round($totalTime2 / $totalCount, 4) . "</pre>";

function formatResults($results) {
    $out = [];
    foreach ($results as $row) {
        $set = '';
        foreach ($row as $journeys) {
            $set .=  '(';
            foreach ($journeys as $rc) {
                $set .= $rc->id . ", ";
            }
            $set = rtrim($set, ', ') . '), ';
        }
        $out[] = rtrim($set, ', ');
    }
    return $out;
}
