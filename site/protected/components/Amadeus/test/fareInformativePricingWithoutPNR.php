<?php

namespace application\components\Amadeus\test;

$defaultAirSourceId = 25;

$inputs = [
    'passengers' => [
        \TravelerType::TRAVELER_ADULT => 1,
        \TravelerType::TRAVELER_CHILD => 1,
        \TravelerType::TRAVELER_INFANT => 1,
    ],
    'origin' => 'DEL',
    'destination' => 'BOM',
    'segments' => [
        [
            [
                'depart' => '2014-08-20',
                'origin' => 'DEL',
                'destination' => 'IDR',
                'flightNumber' => 3459,
                'marketingCompany' => 'S2',
                'bookingClass' => 'G'
            ],
            [
                'depart' => '2014-08-20',
                'origin' => 'IDR',
                'destination' => 'BOM',
                'flightNumber' => 4384,
                'marketingCompany' => 'S2',
                'bookingClass' => 'Z'
            ],
        ]
    ]
];

//$inputs = [
//    'passengers' => [
//        \TravelerType::TRAVELER_ADULT => 0,
//        \TravelerType::TRAVELER_CHILD => 0,
//        \TravelerType::TRAVELER_INFANT => 1,
//    ],
//    'origin' => 'BLR',
//    'destination' => 'BLR',
//    'segments' => [
//        [
//            [
//                'depart' => '2014-08-18',
//                'origin' => 'BLR',
//                'destination' => 'DEL',
//                'flightNumber' => 8479,
//                'marketingCompany' => 'TK',
//                'bookingClass' => 'Q'
//            ],
//            [
//                'depart' => '2014-08-19',
//                'origin' => 'DEL',
//                'destination' => 'IST',
//                'flightNumber' => 717,
//                'marketingCompany' => 'TK',
//                'bookingClass' => 'Q'
//            ],
//            [
//                'depart' => '2014-08-19',
//                'origin' => 'IST',
//                'destination' => 'SOF',
//                'flightNumber' => 1029,
//                'marketingCompany' => 'TK',
//                'bookingClass' => 'Q'
//            ],
//        ],
//        [
//            [
//                'depart' => '2014-08-25',
//                'origin' => 'SOF',
//                'destination' => 'IST',
//                'flightNumber' => 1028,
//                'marketingCompany' => 'TK',
//                'bookingClass' => 'Q'
//            ],
//            [
//                'depart' => '2014-08-25',
//                'origin' => 'IST',
//                'destination' => 'BOM',
//                'flightNumber' => 720,
//                'marketingCompany' => 'TK',
//                'bookingClass' => 'Q'
//            ],
//            [
//                'depart' => '2014-08-26',
//                'origin' => 'BOM',
//                'destination' => 'BLR',
//                'flightNumber' => 8492,
//                'marketingCompany' => 'TK',
//                'bookingClass' => 'Q'
//            ],
//        ],
//    ],
//];

$api = new AmadeusWebServices2();
$res = $api->Security_Authenticate($defaultAirSourceId);

$fipwPNR = new Fare_InformativePricingWithoutPNR;
$fipwPNR->messageDetails = new messageDetails;
$fipwPNR->messageDetails->messageFunctionDetails = new messageFunctionDetails;
$fipwPNR->messageDetails->messageFunctionDetails->businessFunction = 1;
$fipwPNR->messageDetails->messageFunctionDetails->messageFunction = 741;
$fipwPNR->messageDetails->messageFunctionDetails->responsibleAgency = '1A';

$grpNum = 1;
if ($inputs['passengers'][\TravelerType::TRAVELER_ADULT] > 0) {
    $passengersGroup = new passengersGroup;
    $passengersGroup->segmentRepetitionControl = new segmentRepetitionControl;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails = new segmentControlDetails;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails->quantity = $grpNum;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails->numberOfUnits = $inputs['passengers'][\TravelerType::TRAVELER_ADULT];
    $passengersGroup->ptcGroup = new ptcGroup;
    $passengersGroup->ptcGroup->discountPtc = new discountPtc;
    $passengersGroup->ptcGroup->discountPtc->valueQualifier = \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_ADULT];
    $fipwPNR->passengersGroup[] = $passengersGroup;
    $grpNum++;
}
if ($inputs['passengers'][\TravelerType::TRAVELER_CHILD] > 0) {
    $passengersGroup = new passengersGroup;
    $passengersGroup->segmentRepetitionControl = new segmentRepetitionControl;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails = new segmentControlDetails;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails->quantity = $grpNum;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails->numberOfUnits = $inputs['passengers'][\TravelerType::TRAVELER_CHILD];
    $passengersGroup->ptcGroup = new ptcGroup;
    $passengersGroup->ptcGroup->discountPtc = new discountPtc;
    $passengersGroup->ptcGroup->discountPtc->valueQualifier = \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_CHILD];
    $fipwPNR->passengersGroup[] = $passengersGroup;
    $grpNum++;
}
if ($inputs['passengers'][\TravelerType::TRAVELER_INFANT] > 0) {
    $passengersGroup = new passengersGroup;
    $passengersGroup->segmentRepetitionControl = new segmentRepetitionControl;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails = new segmentControlDetails;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails->quantity = $grpNum;
    $passengersGroup->segmentRepetitionControl->segmentControlDetails->numberOfUnits = $inputs['passengers'][\TravelerType::TRAVELER_INFANT];
    $passengersGroup->ptcGroup = new ptcGroup;
    $passengersGroup->ptcGroup->discountPtc = new discountPtc;
    $passengersGroup->ptcGroup->discountPtc->valueQualifier = \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_INFANT];
    $fipwPNR->passengersGroup[] = $passengersGroup;
    $grpNum++;
}

$fipwPNR->tripsGroup = new tripsGroup;
$fipwPNR->tripsGroup->originDestination = new originDestination;
$fipwPNR->tripsGroup->originDestination->origin = $inputs['origin'];
$fipwPNR->tripsGroup->originDestination->destination = $inputs['destination'];
$trips = array();
foreach ($inputs['segments'] as $segment) {
    $trips = array_merge($trips, $segment);
}
foreach ($trips as $trip) {
    $sg = new segmentGroup;
    $sg->segmentInformation = new segmentInformation;
    $sg->segmentInformation->flightDate = new flightDate;
    $sg->segmentInformation->flightDate->departureDate = \application\components\Amadeus\Utils::toAmadeusDate($trip['depart']);
    $sg->segmentInformation->boardPointDetails = new boardPointDetails;
    $sg->segmentInformation->boardPointDetails->trueLocationId = $trip['origin'];
    $sg->segmentInformation->offpointDetails = new offpointDetails;
    $sg->segmentInformation->offpointDetails->trueLocationId = $trip['destination'];
    $sg->segmentInformation->companyDetails = new companyDetails;
    $sg->segmentInformation->companyDetails->marketingCompany = $trip['marketingCompany'];
    $sg->segmentInformation->flightIdentification = new flightIdentification;
    $sg->segmentInformation->flightIdentification->flightNumber = $trip['flightNumber'];
    $sg->segmentInformation->flightIdentification->bookingClass = $trip['bookingClass'];
    $fipwPNR->tripsGroup->segmentGroup[] = $sg;
}

$res = $api->Fare_InformativePricingWithoutPNR($fipwPNR);
//\Utils::soapDebug($api);
//echo \Utils::dbg($res) . '<br>';
//flush();

if (isset($res->errorGroup->errorMessage->freeText)) {
//    \Utils::finalMessage($res->errorGroup->errorMessage->freeText);
    echo $res->errorGroup->errorMessage->freeText;
    exit;
}
//exit;
foreach (\Utils::toArray($res->mainGroup->pricingGroupLevelGroup) as $pglg) {
    echo $pglg->fareInfoGroup->fareAmount->monetaryDetails->amount . '<br>';
    echo $pglg->fareInfoGroup->fareAmount->otherMonetaryDetails->amount . '<br>';
}
echo '<hr>';

$fcr = new Fare_CheckRules;
$fcr->msgType = new msgType;
$fcr->msgType->messageFunctionDetails = new messageFunctionDetails;
$fcr->msgType->messageFunctionDetails->messageFunction = 712;
$fcr->itemNumber = new itemNumber;
$fcr->itemNumber->itemNumberDetails[0] = new itemNumberDetails;
$fcr->itemNumber->itemNumberDetails[0]->number = 1;
$fcr->itemNumber->itemNumberDetails[1] = new itemNumberDetails;
$fcr->itemNumber->itemNumberDetails[1]->number = 1;
$fcr->itemNumber->itemNumberDetails[1]->type = 'FC';


$res = $api->Fare_CheckRules($fcr);
//\Utils::soapDebug($api);
//echo \Utils::dbg($res);

foreach ($res->tariffInfo as $ti) {
    foreach ($ti->fareRuleText as $frt) {
        echo $frt->freeText . "<br>";
    }
}
flush();



$api->Security_SignOut();
?>