<h2>Goair check availability and fares test</h2>
<pre>
    <?php
    $airSourceId = \application\components\Goair\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID;
    $data = [
        'segments' => [
            1 => [
                    [
                        'origin' => 'DEL',
                        'destination' => 'BOM',
                        'depart' => '2015-06-30',
                        'flightNumber' => '1711',
                        'marketingCompany' => '6E',
                        'bookingClass' => ')',
                        'departTs' => '2015-06-30 05:30',
                        'arriveTs' => '2015-06-30 07:45',
                    ]
            ]
        ],
        'pax' => [
                1 => [
                    'totalFare' => 2953 + 63,
                    'type' => 'ADT',
                    'arrTaxes' => [],
                    'fareBasis' => [
                        1 => ['O090AP']
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
    footer($start_timer);
    ?>
</pre>
