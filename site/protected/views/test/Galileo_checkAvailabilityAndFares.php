<h2>Galileo check availability and fares test</h2>
<pre>
    <?php
    set_time_limit(90);     // This crappy APi need much more attention
    $start_timer = microtime(true);

    $airSourceId = \application\components\Galileo\Utils::DEFAULT_GALILEO_PRODUCTION_ID;
    $data = [
        'segments' => [
            1 => [
                    [
                        'origin' => 'DEL',
                        'destination' => 'BOM',
                        'depart' => '2015-06-30',
                        'flightNumber' => '863',
                        'marketingCompany' => 'AI',
                        'bookingClass' => 'S',
                        'departTs' => '2015-06-30 13:00',
                        'arriveTs' => '2015-06-30 15:00',
                    ]
            ]
        ],
        'pax' => [
                1 => [
                    'totalFare' => 3005,
                    'type' => 'ADT',
                    'arrTaxes' => [],
                    'fareBasis' => [
                        1 => ['S90SS']
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
