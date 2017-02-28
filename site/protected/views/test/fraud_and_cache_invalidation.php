<pre>
    <?php
    set_time_limit(90);     // This crappy APi need much more attention
    $start_timer = microtime(true);

    function footer($start_timer) {
        print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
    }

    
    var_dump(\Fraud::fraudClearance(10,'127.0.0.2','1204887701','support@belair.in1'));
    
    
    // Cahce invalidation timing testing
//    for($i=0; $i<100; $i++) {
//        $depart = rand(3600, 3600*24*40);
//        $departTs = time() + $depart;
//        $minutes = \Searches::notOlderThan($departTs);
//        $distance = \Utils::convertSecToDaysHours($depart);
//        echo "Depart: " . date(DATETIME_FORMAT, $departTs) . "\t$distance\tmin: " . $minutes . PHP_EOL;
//    }
    
    footer($start_timer);
    ?>
</pre>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>