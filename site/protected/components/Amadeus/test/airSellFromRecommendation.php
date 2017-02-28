<?php

// Amadeus give difference in taxes of: -1,179

namespace application\components\Amadeus\test;

$defaultAirSourceId = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID;

//$inputs = [
//    'passengers' => [
//        \TravelerType::TRAVELER_ADULT => 1,
//        \TravelerType::TRAVELER_CHILD => 1,
//        \TravelerType::TRAVELER_INFANT => 1,
//    ],
//    'origin' => 'DEL',
//    'destination' => 'BOM',
//    'segments' => [
//        [
//            [
//                'depart' => '2014-10-20',
//                'origin' => 'DEL',
//                'destination' => 'IDR',
//                'flightNumber' => 3459,
//                'marketingCompany' => 'S2',
//                'bookingClass' => 'M'
//            ],
//            [
//                'depart' => '2014-10-20',
//                'origin' => 'IDR',
//                'destination' => 'BOM',
//                'flightNumber' => 4384,
//                'marketingCompany' => 'S2',
//                'bookingClass' => 'G'
//            ],
//        ],
//    ],
//];
//$inputs = [
//    'passengers' => [
//        \TravelerType::TRAVELER_ADULT => 1,
//        \TravelerType::TRAVELER_CHILD => 0,
//        \TravelerType::TRAVELER_INFANT => 1,
//    ],
//    'origin' => 'DEL',
//    'destination' => 'BOM',
//    'segments' => [
//        [
//            [
//                'depart' => '2014-08-20',
//                'origin' => 'DEL',
//                'destination' => 'BOM',
//                'flightNumber' => 7,
//                'marketingCompany' => 'AI',
//                'bookingClass' => 'S'
//            ],
//        ],
//    ],
//];
$inputs = [
    'passengers' => [
        \TravelerType::TRAVELER_ADULT => 2,
        \TravelerType::TRAVELER_CHILD => 1,
        \TravelerType::TRAVELER_INFANT => 1,
    ],
    'origin' => 'DEL',
    'destination' => 'DEL',
    'segments' => [
        [
            [
                'depart' => '2014-08-31',
                'origin' => 'DEL',
                'destination' => 'HYD',
                'flightNumber' => 839,
                'marketingCompany' => 'AI',
                'bookingClass' => 'U'
            ],
            [
                'depart' => '2014-08-31',
                'origin' => 'HYD',
                'destination' => 'DXB',
                'flightNumber' => 951,
                'marketingCompany' => 'AI',
                'bookingClass' => 'L'
            ],
        ],
        [
            [
                'depart' => '2014-09-08',
                'origin' => 'DXB',
                'destination' => 'DEL',
                'flightNumber' => 996,
                'marketingCompany' => 'AI',
                'bookingClass' => 'T'
            ],
//            [
//                'depart' => '2014-09-15',
//                'origin' => 'MUC',
//                'destination' => 'FRA',
//                'flightNumber' => 97,
//                'marketingCompany' => 'LH',
//                'bookingClass' => 'L'
//            ],
//            [
//                'depart' => '2014-09-16',
//                'origin' => 'FRA',
//                'destination' => 'BLR',
//                'flightNumber' => 754,
//                'marketingCompany' => 'LH',
//                'bookingClass' => 'L'
//            ],
        ],
    ],
];

$passengers = [
    [
        'firstName' => "Jily",
        'lastName' => "Doll",
        'title' => "Ms",
        'type' => \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_ADULT],
        'amount' => 64311
    ],
    [
        'firstName' => "John",
        'lastName' => "Smith",
        'title' => "Mr",
        'type' => \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_ADULT],
        'amount' => 64311
    ],
    [
        'firstName' => "Joana",
        'lastName' => "SmithKid",
        'title' => "Mss",
        'type' => \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_CHILD],
        'amount' => 56795
    ],
    [
        'firstName' => "Small",
        'lastName' => "Bebe",
        'title' => "Inf",
        'type' => \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_INFANT],
        'birthDate' => "20JAN14",
        'amount' => 3813
    ],
];

$api = new AmadeusWebServices2();
$res = $api->Security_Authenticate($defaultAirSourceId);

$asfr = new Air_SellFromRecommendation;
$asfr->messageActionDetails = new messageActionDetails;
$asfr->messageActionDetails->messageFunctionDetails = new messageFunctionDetails;
$asfr->messageActionDetails->messageFunctionDetails->messageFunction = 183;
$asfr->messageActionDetails->messageFunctionDetails->additionalMessageFunction = 'M1';

foreach ($inputs['segments'] as $segment) {
    $itineraryDetails = new itineraryDetails;
    $itineraryDetails->originDestinationDetails = new originDestinationDetails;
    $itineraryDetails->originDestinationDetails->origin = $segment[0]['origin'];
    $itineraryDetails->originDestinationDetails->destination = $segment[(count($segment) - 1)]['destination'];
    $itineraryDetails->message = new message;
    $itineraryDetails->message->messageFunctionDetails = new messageFunctionDetails;
    $itineraryDetails->message->messageFunctionDetails->messageFunction = 183;

    foreach ($segment as $leg) {
//        $segmentInformation = new \application\components\Amadeus\test\ooo\segmentInformation;
        $segmentInformation = new segmentInformation2;
        $segmentInformation->travelProductInformation = new travelProductInformation;
        $segmentInformation->travelProductInformation->flightDate = new flightDate;
        $segmentInformation->travelProductInformation->flightDate->departureDate = \application\components\Amadeus\Utils::toAmadeusDate($leg['depart']);
        $segmentInformation->travelProductInformation->boardPointDetails = new boardPointDetails;
        $segmentInformation->travelProductInformation->boardPointDetails->trueLocationId = $leg['origin'];
        $segmentInformation->travelProductInformation->offpointDetails = new offpointDetails;
        $segmentInformation->travelProductInformation->offpointDetails->trueLocationId = $leg['destination'];
        $segmentInformation->travelProductInformation->companyDetails = new companyDetails;
        $segmentInformation->travelProductInformation->companyDetails->marketingCompany = $leg['marketingCompany'];
        $segmentInformation->travelProductInformation->flightIdentification = new flightIdentification;
        $segmentInformation->travelProductInformation->flightIdentification->flightNumber = $leg['flightNumber'];
        $segmentInformation->travelProductInformation->flightIdentification->bookingClass = $leg['bookingClass'];
        $segmentInformation->relatedproductInformation = new relatedproductInformation;
//        $segmentInformation->relatedproductInformation->quantity = $inputs['passengers'][\TravelerType::TRAVELER_ADULT] + $inputs['passengers'][\TravelerType::TRAVELER_CHILD] + $inputs['passengers'][\TravelerType::TRAVELER_INFANT];
        $segmentInformation->relatedproductInformation->quantity = $inputs['passengers'][\TravelerType::TRAVELER_ADULT] + $inputs['passengers'][\TravelerType::TRAVELER_CHILD];
        $segmentInformation->relatedproductInformation->statusCode = 'NN';

        $itineraryDetails->segmentInformation[] = $segmentInformation;
    }


    $asfr->itineraryDetails[] = $itineraryDetails;
}
//echo \Utils::dbg($asfr); exit;

$resAsfr = $api->Air_SellFromRecommendation($asfr);
//\Utils::soapDebug($api);
//echo \Utils::dbg($resAsfr) . '<br>';

$ok = true;
foreach (\Utils::toArray($resAsfr->itineraryDetails) as $id) {
    foreach (\Utils::toArray($id->segmentInformation) as $si) {
        if ($si->actionDetails->statusCode != "OK") {
            $ok = false;
            $error = \application\components\Amadeus\Utils::$airSellStatusCode[$si->actionDetails->statusCode];
        }
    }
}

if (!$ok) {
    echo "We can not service this request: $error <br>";
    \Utils::dbgYiiLog($resAsfr);
    \Utils::soapDebug($api);
    // Cancel the current PNR
} else {
    echo "Air_SellFromRecommendation is Confirmed!<br><br>";

    // Add the passengers
    $pnrAddMultiElements = new PNR_AddMultiElements;
    $pnrAddMultiElements->pnrActions = new pnrActions;
    $pnrAddMultiElements->pnrActions->optionCode = 0;  // No special process
//    $pnrAddMultiElements->pnrActions->optionCode = 11;  // 11 End transact with retrieve (ER)
//    $pnrAddMultiElements->pnrActions->optionCode = 10;  // 10 End transact (ET)

    $pnrAddMultiElements->dataElementsMaster = new dataElementsMaster;
    $pnrAddMultiElements->dataElementsMaster->marker1 = new marker1;
    // Add mandatory Agecy phone contact element
    $dataElementsIndiv = new dataElementsIndiv;
    $dataElementsIndiv->elementManagementData = new elementManagementData;
    $dataElementsIndiv->elementManagementData->reference = new reference;
    $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
    $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
    $dataElementsIndiv->elementManagementData->segmentName = 'AP';     // AP === Contact element
    $dataElementsIndiv->freetextData = new freetextData;
    $dataElementsIndiv->freetextData->freetextDetail = new freetextDetail;
    $dataElementsIndiv->freetextData->freetextDetail->subjectQualifier = 3;    // 3 Literal text
    $dataElementsIndiv->freetextData->freetextDetail->type = 6;    // 6 Travel agent telephone number
    $dataElementsIndiv->freetextData->longFreetext = '9876543210';
    $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = $dataElementsIndiv;

    // Add ticketing elements
    $dataElementsIndiv = new dataElementsIndiv;
    $dataElementsIndiv->elementManagementData = new elementManagementData;
    $dataElementsIndiv->elementManagementData->reference = new reference;
    $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
    $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
    $dataElementsIndiv->elementManagementData->segmentName = 'TK';     // TK Ticket element
    $dataElementsIndiv->ticketElement = new ticketElement;
//    $dataElementsIndiv->ticketElement->passengerType = 'PAX';   // Passenger type PAX for Passenger INF for Infant not occupying a seat
    $dataElementsIndiv->ticketElement->ticket = new ticket;
    $dataElementsIndiv->ticketElement->ticket->indicator = 'TL';    // Ticket Time Limit (TL)
    $dataElementsIndiv->ticketElement->ticket->date = \application\components\Amadeus\Utils::toAmadeusDate(date(DATE_FORMAT));
    $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = $dataElementsIndiv;

    // Add mandatory received from element
    $dataElementsIndiv = new dataElementsIndiv;
    $dataElementsIndiv->elementManagementData = new elementManagementData;
    $dataElementsIndiv->elementManagementData->segmentName = 'RF';     // RF Receive From element
    $dataElementsIndiv->freetextData = new freetextData;
    $dataElementsIndiv->freetextData->freetextDetail = new freetextDetail;
    $dataElementsIndiv->freetextData->freetextDetail->subjectQualifier = 3;    // 3 Literal text
    $dataElementsIndiv->freetextData->freetextDetail->type = 'P22';    // P22 Receive from
    $dataElementsIndiv->freetextData->longFreetext = 'Belair travel';
    $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = $dataElementsIndiv;

    // Prepare the infants array
    $infants = array();
    foreach ($passengers as $passenger) {
        if ($passenger['type'] == \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_INFANT]) {
            $infants[] = $passenger;
        }
    }
    // Adding the travellers with all the parameters
    $infantKey = 0;
    $i = 1;
//    $infantIndicator = $inputs['passengers'][\TravelerType::TRAVELER_ADULT] + $inputs['passengers'][\TravelerType::TRAVELER_CHILD] + 1;
    foreach ($passengers as $passenger) {
        if ($passenger['type'] == \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_INFANT]) {
            continue;   // Skip the infants
        }
        $travellerInfo = new travellerInfo;
        $travellerInfo->elementManagementPassenger = new elementManagementPassenger;
        $travellerInfo->elementManagementPassenger->reference = new reference;
        $travellerInfo->elementManagementPassenger->reference->qualifier = 'PR';
        $travellerInfo->elementManagementPassenger->reference->number = $i;
        $i++;
        $travellerInfo->elementManagementPassenger->segmentName = 'NM';

        $passengerData = passengerData($passenger);
        // Add the infant if needed
        if ($infantKey < count($infants)) {
            $passengerData->travellerInformation->traveller->quantity = 2;
            $passengerData->travellerInformation->passenger->infantIndicator = 3;
            $travellerInfo->passengerData[] = $passengerData;
            $travellerInfo->passengerData[] = passengerData($infants[$infantKey]);
            $infantKey++;
        } else {
            $travellerInfo->passengerData[] = $passengerData;
        }

        $pnrAddMultiElements->travellerInfo[] = $travellerInfo;
    }

    $resPnr = $api->PNR_AddMultiElements($pnrAddMultiElements);
//    echo \Utils::dbg($resPnr) . '<br>';
    // Add the prices to the PNR
    $resPrices = $api->addPrices();
//    \Utils::soapDebug($api);
//    echo \Utils::dbg($resPrices) . '<br>';
    // Create the tickets
    $resTicket = $api->addTickets(count(array_filter($inputs['passengers'])));
//    \Utils::soapDebug($api);
//    echo \Utils::dbg($resTicket) . '<br>';

    if (isset($resTicket->applicationError->errorText->errorFreeText)) {
        echo "<br>Tickets creation error: {$resTicket->applicationError->errorText->errorFreeText}<br>";
        return false;
    }

    // Adding default form of payment
    $fop = new fop('CA');
//    $fop->amount = $params->amount;
//    $fop->creditCardCode = $params->creditCardCode;
//    $fop->accountNumber = $params->accountNumber;
//    $fop->expiryDate = $params->expiryDate;
//    $fop->currencyCode = $params->currencyCode;

    $resFop = $api->addFormOfPayment($fop);
    \Utils::soapDebug($api);
    echo \Utils::dbg($resFop) . '<br>';

    // Finish the transaction and retrieve the PNR
    $pnrAddMultiElements = new PNR_AddMultiElements;
    $pnrAddMultiElements->pnrActions = new pnrActions;
    $pnrAddMultiElements->pnrActions->optionCode = 11;  // 11 End transact with retrieve (ER)
    $resPnr = $api->PNR_AddMultiElements($pnrAddMultiElements);
//    \Utils::soapDebug($api);
//    echo \Utils::dbg($resPnr) . '<br>';

    if (isset($resPnr->pnrHeader->reservationInfo->reservation->controlNumber)) {
        $pnr = (string) $resPnr->pnrHeader->reservationInfo->reservation->controlNumber;
        echo "Your PNR is: {$resPnr->pnrHeader->reservationInfo->reservation->controlNumber}<br>The reservation is valid until: " .
        \application\components\Amadeus\Utils::formatDate($resPnr->pnrHeader->reservationInfo->reservation->date) . " " . \application\components\Amadeus\Utils::formatTime($resPnr->pnrHeader->reservationInfo->reservation->time) . "<br>";
    } else {
        echo "The PNR is not received, check the logs for errors!";
        \Utils::dbgYiiLog($resPnr);
        $api->Security_SignOut();
        exit;
    }
    $api->Security_SignOut();

    // New session
    $api->Security_Authenticate($defaultAirSourceId);

    $resPnr = $api->getPnr($pnr);
//    echo \Utils::dbg($resPnr);

    $resIssueTicket = $api->issueTicket();
    echo \Utils::dbg($resIssueTicket);
    if (isset($resIssueTicket->errorGroup->errorWarningDescription->freeText)) {
        echo "Error with issuing the ticket: {$resIssueTicket->errorGroup->errorWarningDescription->freeText}";
    }

    $resTicket = $api->getTicket();
    echo \Utils::dbg($resTicket);
    // 
}
$api->Security_SignOut();

/**
 * Prepare the passenger data structure
 * @param array $passenger
 * @return \application\components\Amadeus\test\passengerData
 */
function passengerData(array $passenger) {
    $passengerData = new passengerData;
    $passengerData->travellerInformation = new travellerInformation;
    $passengerData->travellerInformation->traveller = new traveller;
    $passengerData->travellerInformation->passenger = new passenger;
    $passengerData->travellerInformation->traveller->surname = $passenger['lastName'];
//    $passengerData->travellerInformation->passenger->firstName = $passenger['title'] . " " . $passenger['firstName'];
    // No dots in the titles
    $passengerData->travellerInformation->passenger->firstName = $passenger['firstName'] . " " . str_replace('.', '', $passenger['title']);
    $passengerData->travellerInformation->passenger->type = $passenger['type'];
    $passengerData->travellerInformation->traveller->quantity = 1;
    if (isset($passenger['birthDate'])) {
        $passengerData->dateOfBirth = new dateOfBirth;
        $passengerData->dateOfBirth->dateAndTimeDetails = new dateAndTimeDetails;
        $passengerData->dateOfBirth->dateAndTimeDetails->date = strtoupper(date("dMy", strtotime($passenger['birthDate'])));
    }

    return $passengerData;
}

?>