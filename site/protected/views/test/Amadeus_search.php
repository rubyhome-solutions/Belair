<?php
$airSourceId = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID;
//$airSourceId = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID;
$params = (object) [
            'source' => 'TRV',
            'destination' => 'ICN',
            'depart' => '2016-04-05',
            'return' => '2016-05-05',
            'category' => \CabinType::ECONOMY,
            'adults' => 1,
            'children' => 0,
            'infants' => 0,
];
$res = \application\components\Amadeus\Utils::search($airSourceId, $params);
echo \Utils::arr2table(json_decode($res, true));
?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>