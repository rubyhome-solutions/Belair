<h2>Indigo search</h2>
<?php
$airSourceId = \application\components\Indigo\Utils::TEST_AIRSOURCE_ID;
$params = json_decode('
        {
            "type_id": 1,
            "source": "DEL",
            "destination": "BOM",
            "depart": "2016-02-21",
            "return": null,
            "adults": 3,
            "children": 2,
            "infants": 2,
            "category": 1
        }    
    ');

$res = application\components\Indigo\Utils::search($airSourceId, $params);
echo \Utils::arr2table(json_decode($res, true));
