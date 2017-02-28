<h2>Spicejet check availability and fares test</h2>
<pre>
    <?php
    $airSourceId = \application\components\Spicejet\Utils::PRODUCTION_AIRSOURCE_ID;
//    $airSourceId = \application\components\Indigo\Utils::PRODUCTION_AIRSOURCE_ID;
//    $airSourceId = \application\components\Goair\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID;
    $data = [
        'segments' => [
            1 => [
                    [
                        'origin' => 'DEL',
                        'destination' => 'BOM',
                        'depart' => '2015-06-30',
                        'flightNumber' => '161',
                        'marketingCompany' => 'SG',
                        'bookingClass' => 'C',
                        'departTs' => '2015-06-30 05:50',
                        'arriveTs' => '2015-06-30 08:05',
                    ]
            ]
        ],
        'pax' => [
                1 => [
                    'totalFare' => 3066 + 123,
                    'type' => 'ADT',
                    'arrTaxes' => [],
                    'fareBasis' => [
                        1 => ['CSAVER']
                    ]
                ]
        ],
        'cabinTypeId' => 1,
    ];

    $traveler = [
        [
            'traveler_type_id' => 1,
            'id' => 3,
            'user_info_id' => 585,
            'birthdate' => '1969-04-05',
        ]
    ];

    $res = \ApiInterface::checkAvailabilityAndFares($airSourceId, $data, $traveler);
    print_r($res);
    ?>
</pre>
