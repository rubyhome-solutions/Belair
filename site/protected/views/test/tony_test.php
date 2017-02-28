<?php
set_time_limit(290);     // This crappy APi need much more attention
//$start_timer = microtime(true);
//include __DIR__ . '/Amadeus_checkAvailabilityAndFares.php';
//footer($start_timer);
//$start_timer = microtime(true);
//include __DIR__ . '/Galileo_checkAvailabilityAndFares.php';
//footer($start_timer);
//$start_timer = microtime(true);
//include __DIR__ . '/Goair_checkAvailabilityAndFares.php';
//footer($start_timer);
//$start_timer = microtime(true);
//include __DIR__ . '/Indigo_checkAvailabilityAndFares.php';
//footer($start_timer);
//$start_timer = microtime(true);
//include __DIR__ . '/Spicejet_checkAvailabilityAndFares.php';
//footer($start_timer);
//$start_timer = microtime(true);
//include __DIR__ . '/_reporting.php';
//footer($start_timer);
$start_timer = microtime(true);
//include __DIR__ . '/scrapper_test.php';
//include __DIR__ . '/specialRoundTripDiscountFare_test.php';
//$this->renderPartial('_hdfcPg');
//$this->renderPartial('_zoozPg');
//$this->renderPartial('_currency');
//$this->renderPartial('_airCartMerge');
//$this->renderPartial('_privateFare');
//$this->renderPartial('_pass_through');
if ($view) {
    $this->renderPartial($view);
}

footer($start_timer);

// The footer
function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    flush();
//    ob_flush();
}
?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>