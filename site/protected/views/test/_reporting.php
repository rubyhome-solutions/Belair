<h2>Reporting test</h2>
<!--<pre>-->
    <?php
    $report = new application\components\Reporting\Report;
//    $report->dateFrom = '2015-01-27';
//    $report->dateTo = '2015-02-06';
//    $report->user_info_id = 585;
    $res = $report->getData('Detail air');
    echo \Utils::arr2table($res);
//    print_r($res);
    $res = $report->getData('Air summary1');
    echo \Utils::arr2table($res);
    echo \Utils::arr2tableVertical($res);
//    print_r($res);
    $res = $report->getData('Air summary2');
    echo \Utils::arr2tableVertical($res);
//    print_r($res);
            
    ?>
<!--</pre>-->
