<?php

//$airSourceId = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID;
$airSourceId = \application\components\Amadeus\Utils::TEST_V2_ID;
//echo \Utils::dbg($res); exit;
//$res = \application\components\Amadeus\Utils::aquirePnr('242F3S', $airSourceId);
$api = new \application\components\Amadeus\MiniRules($airSourceId);
$res = $api->getInfo('25I2EC');
//$res = $api->getInfo('25JQZ4');
$api->securitySignOut();
echo \Utils::dbg($res);
echo \application\components\Amadeus\MiniRules::formatRules($res);
echo \Utils::dbg($api->pnrObject);



$data = [
    'segments' => [
//        1 => [
//            [
//                'origin' => 'DEL',
//                'destination' => 'BOM',
//                'depart' => '2015-10-30',
//                'flightNumber' => '863',
//                'marketingCompany' => 'AI',
//                'bookingClass' => 'S',
//                'departTs' => '2015-06-30 13:00',
//                'arriveTs' => '2015-06-30 15:00',
//            ]
//        ],
//        1 => [
//            [
//                'origin' => 'BLR',
//                'destination' => 'DEL',
//                'depart' => '2015-10-05',
//                'flightNumber' => '505',
//                'marketingCompany' => 'AI',
//                'bookingClass' => 'S',
//                'departTs' => '2015-10-05 10:30',
//                'arriveTs' => '2015-10-05 12:55',
//            ]
//        ],
//        2 => [
//            [
//                'origin' => 'DEL',
//                'destination' => 'BLR',
//                'depart' => '2015-10-18',
//                'flightNumber' => '803',
//                'marketingCompany' => 'AI',
//                'bookingClass' => 'S',
//                'departTs' => '2015-10-18 06:35',
//                'arriveTs' => '2015-10-18 09:20',
//            ]
//        ],

        1 => [
            [
                'origin' => 'BLR',
                'destination' => 'DEL',
                'depart' => '2016-06-16',
                'flightNumber' => '8479',
                'marketingCompany' => 'TK',
                'bookingClass' => 'Q',
                'departTs' => '2016-06-16 20:30',
                'arriveTs' => '2016-06-16 23:15',
            ],
            ['origin' => 'DEL',
                'destination' => 'IST',
                'depart' => '2016-06-17',
                'flightNumber' => '717',
                'marketingCompany' => 'TK',
                'bookingClass' => 'Q',
                'departTs' => '2016-06-17 06:05',
                'arriveTs' => '2016-06-17 10:25',
            ],
            ['origin' => 'IST',
                'destination' => 'SOF',
                'depart' => '2016-06-17',
                'flightNumber' => '1029',
                'marketingCompany' => 'TK',
                'bookingClass' => 'Q',
                'departTs' => '2016-06-17 19:35',
                'arriveTs' => '2016-06-17 20:55',
            ]
        ],
        2 => [
            [
                'origin' => 'SOF',
                'destination' => 'IST',
                'depart' => '2016-07-22',
                'flightNumber' => '1028',
                'marketingCompany' => 'TK',
                'bookingClass' => 'Q',
                'departTs' => '2016-07-22 09:35',
                'arriveTs' => '2016-07-22 11:00',
            ],
            ['origin' => 'IST',
                'destination' => 'DEL',
                'depart' => '2016-07-22',
                'flightNumber' => '716',
                'marketingCompany' => 'TK',
                'bookingClass' => 'Q',
                'departTs' => '2016-07-22 19:55',
                'arriveTs' => '2016-07-23 04:20',
            ],
            ['origin' => 'DEL',
                'destination' => 'BLR',
                'depart' => '2016-07-23',
                'flightNumber' => '8478',
                'marketingCompany' => 'TK',
                'bookingClass' => 'T',
                'departTs' => '2016-07-23 09:45',
                'arriveTs' => '2016-07-23 12:40',
            ],
        ]
    ],
    'pax' => [
        \TravelerType::TRAVELER_ADULT => ['totalFare' => 52478],
        \TravelerType::TRAVELER_CHILD => ['totalFare' => 64932],
        \TravelerType::TRAVELER_INFANT => ['totalFare' => 6664],
    ],
    'cabinTypeId' => 1,
];

$travelers = [
    [
        'traveler_type_id' => \TravelerType::TRAVELER_ADULT,
        'id' => 182,
        'user_info_id' => 585,
        'birthdate' => '1969-04-05',
    ],
//    [
//        'traveler_type_id' => \TravelerType::TRAVELER_ADULT,
//        'id' => 1,
//        'user_info_id' => 585,
//        'birthdate' => '1969-04-05',
//    ],
//    [
//        'traveler_type_id' => \TravelerType::TRAVELER_CHILD,
//        'id' => 2,
//        'user_info_id' => 585,
//        'birthdate' => '1969-04-05',
//    ],
//    [
//        'traveler_type_id' => \TravelerType::TRAVELER_INFANT,
//        'id' => 3,
//        'user_info_id' => 585,
//        'birthdate' => '1969-04-05',
//    ],
];

//$res = \ApiInterface::checkAvailabilityAndFares($airSourceId, $data, $travelers);
//echo \Utils::dbg($res);
