<?php

set_time_limit(300);    // 5min here
$daysInAdvance = 5;
$depart = date(DATE_FORMAT, time() + $daysInAdvance * 24 * 3600);
$depart2 = date(DATE_FORMAT, time() + ($daysInAdvance + 2) * 24 * 3600);
$return = date(DATE_FORMAT, time() + ($daysInAdvance + 10) * 24 * 3600);
$return2 = date(DATE_FORMAT, time() + ($daysInAdvance + 7) * 24 * 3600);
$searches = [
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('BOM'),
        'depart' => $depart,
        'return' => null,
        'adults' => 1,
        'children' => 1,
        'infants' => 1,
        'category' => \CabinType::ECONOMY
    ],
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('BOM'),
        'depart' => $depart,
        'return' => null,
        'adults' => 1,
        'children' => 0,
        'infants' => 1,
        'category' => \CabinType::ECONOMY
    ],
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('BOM'),
        'depart' => $depart,
        'return' => $return,
        'adults' => 1,
        'children' => 0,
        'infants' => 0,
        'category' => \CabinType::ECONOMY
    ],
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('BOM'),
        'depart' => $depart,
        'return' => $return,
        'adults' => 1,
        'children' => 0,
        'infants' => 1,
        'category' => \CabinType::ECONOMY
    ],
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('SIN'),
        'depart' => $depart2,
        'return' => null,
        'adults' => 1,
        'children' => 0,
        'infants' => 0,
        'category' => \CabinType::ECONOMY
    ],
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('BLR'),
        'depart' => $depart2,
        'return' => null,
        'adults' => 1,
        'children' => 0,
        'infants' => 1,
        'category' => \CabinType::ECONOMY
    ],
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('SIN'),
        'depart' => $depart2,
        'return' => $return2,
        'adults' => 1,
        'children' => 0,
        'infants' => 0,
        'category' => \CabinType::ECONOMY
    ],
    [
        'source' => \Airport::getIdFromCode('DEL'),
        'destination' => \Airport::getIdFromCode('SIN'),
        'depart' => $depart2,
        'return' => $return2,
        'adults' => 1,
        'children' => 0,
        'infants' => 1,
        'category' => \CabinType::ECONOMY
    ],
];

\Yii::import('application.models.forms.BookingSearchForm');
foreach ($searches as $search) {
    $model = new BookingSearchForm;
    $model->attributes = $search;
    $this->renderPartial('//booking/deeplink', [
        'model' => $model,
        'clientSourceId' => \ClientSource::SOURCE_SKYSCANNER
    ]);
}