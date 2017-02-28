<?php

$segments = [
    1 => [
        [
            'origin' => 'BLR',
            'destination' => 'DEL',
            'depart' => '2015-10-05',
            'flightNumber' => '505',
            'marketingCompany' => 'AI',
            'bookingClass' => 'S',
            'departTs' => '2015-10-05 10:30',
            'arriveTs' => '2015-10-05 12:55',
        ]
    ],
    2 => [
        [
            'origin' => 'DEL',
            'destination' => 'BLR',
            'depart' => '2015-10-18',
            'flightNumber' => '803',
            'marketingCompany' => 'AI',
            'bookingClass' => 'S',
            'departTs' => '2015-10-18 06:35',
            'arriveTs' => '2015-10-18 09:20',
        ]
    ],
];


$airSources = AirSource::model()->with('tourCodes')->together()->findAll();
foreach ($airSources as $airSource) {
    /* @var $airSource AirSource */
//    $tc = $airSource->getTourCode('CL');
    $tc = $airSource->getTourCode(\ApiInterface::extractCarrier($segments));
    if (!empty($tc)) {
        echo \Utils::dbg($airSource->name);
        echo \Utils::dbg($airSource->tourCodes[0]->attributes);
        echo \Utils::dbg($tc);
    }
}


