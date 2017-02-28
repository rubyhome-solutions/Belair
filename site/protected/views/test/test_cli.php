<?php

error_reporting(E_ALL);
$start_timer = microtime(true);

function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
}

include_once __DIR__ . '/../../models/RoutesCache.php';




footer($start_timer);

/**
 * To monitor SOAP calls in and out of a unix server: 
 * sudo tcpdump -nn -vv -A -s 0 -i eth0 dst or src host xxx.xxx.xxx.xxx and port 80
 */
?>