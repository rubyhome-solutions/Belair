<?php

namespace application\components\Amadeus\production;

class Book {

    private $airSourceId;
    private $inputs = [];
    private $passengers = [];
    private $itineraryInfos = [];
    private $cabinType;
    private $api;
    private $fop;
    private $totalAmount = 0;
    private $pnrObject = null;
    private $paxMobile = \Utils::BELAIR_PHONE;
    private $paxEmail = '';
    private $tourCode = '';
    private $privateFare = '';
    private $marketingCarrier = null;

    /**
     * AirSource for the booking
     * @var \AirSource
     */
    private $airSource = null;

    /**
     * Booking parameters
     * @param int $airSourceId The Air Source ID
     * @param array $inputs Data about the Segments and the Paxes
     * @param array $travelers Travelers array
     * @param string $fop Form of payment
     * @param array $cc Credit card details
     */
    public function __construct($airSourceId, array $inputs, array $travelers, $fop, array $cc = null, $marketingCarrierId = null) {
        $this->api = new AmadeusWebServices2;
        $this->airSourceId = $airSourceId;
        $this->cabinType = $inputs['cabinTypeId'];
        if ($marketingCarrierId) {
            $this->marketingCarrier = \Carrier::getCodeFromId($marketingCarrierId);
        }

        $adults = 0;
        $children = 0;
        $infants = 0;
        foreach ($travelers as $passager) {
            switch ($passager['traveler_type_id']) {
                case 1:
                    $adults++;
                    $paxType = 'ADT';
                    break;
                case 2:
                    $children++;
                    $paxType = 'CHD';
                    break;
                case 3:
                    $infants++;
                    $paxType = 'INF';
                    break;
            }
            $model = \Traveler::model()->findByPk($passager['id']);
            if ($model === null) {
                \Utils::dbgYiiLog("Amadeus booking attempt with non existing traveller ID: {$passager['id']}");
                continue;
            }
            /* @var $model \Traveler */
            $model->namesBeautify();
            $this->passengers[] = [
                'firstName' => $model->first_name,
                'lastName' => $model->last_name,
                'title' => $model->travelerTitle->name,
                'type' => $paxType,
                'birthDate' => $model->birthdate,
                'amount' => $inputs['pax'][$passager['traveler_type_id']]['totalFare'],
                'id' => $model->id,
                'arrTaxes' => $inputs['pax'][$passager['traveler_type_id']]['arrTaxes'],
                'fareBasis' => $inputs['pax'][$passager['traveler_type_id']]['fareBasis'],
            ];
            $this->totalAmount += (float) $inputs['pax'][$passager['traveler_type_id']]['totalFare'];

            if (!empty($model->phone)) {
                $this->paxMobile = $model->phone;
            } elseif (!empty($model->mobile)) {
                $this->paxMobile = $model->mobile;
            }
            if (empty($this->paxEmail)) {
                $this->paxEmail = $model->email;
            }
        }

        // Fall back to company email if all the paxes have no email
        if (empty($this->paxEmail)) {
            $this->paxEmail = $model->userInfo->email;
        }

        $this->inputs['passengers'] = [
            \TravelerType::TRAVELER_ADULT => $adults,
            \TravelerType::TRAVELER_CHILD => $children,
            \TravelerType::TRAVELER_INFANT => $infants,
        ];

        $this->inputs['segments'] = $inputs['segments'];
        $this->airSource = \AirSource::model()->with('backend')->findByPk((int) $airSourceId);
        /* @var $this->airSource \AirSource */
        $this->tourCode = $this->airSource->getTourCode(\ApiInterface::extractCarrier($inputs['segments']));
        $this->privateFare = $this->airSource->getPrivateFare(\ApiInterface::extractCarrier($inputs['segments']));

        if ($fop) {
            // Adding default form of payment
            if ($fop === \AirSource::CC_PASS_THROUGH) {    // Credit card payment
                $this->fop = new fop($fop);
//                $this->fop->amount = $this->totalAmount;
                $this->fop->creditCardCode = $cc['code'];
//                $this->fop->creditCardCode = 'CA';
                $this->fop->accountNumber = $cc['number'];
                $this->fop->expiryDate = $cc['exp_date'];
                $this->fop->currencyCode = 'INR';
            } else {
                $this->fop = new fop('CA');
            }
        } else {
            // Do not issue the ticket
            $this->fop = null;
        }
    }

    /**
     * Do the booking or the booking and the payment
     * @return int $cartId New cartId created based ont he new PNR
     */
    public function doBooking($manualIssue = false) {
        $this->api->Security_Authenticate($this->airSourceId);

        $asfr = new Air_SellFromRecommendation;
        $asfr->messageActionDetails = new messageActionDetails;
        $asfr->messageActionDetails->messageFunctionDetails = new messageFunctionDetails;
        $asfr->messageActionDetails->messageFunctionDetails->messageFunction = 183;
        $asfr->messageActionDetails->messageFunctionDetails->additionalMessageFunction = 'M1';
        $asfr->itineraryDetails = self::prepareItineraryDetails();
        $resAsfr = $this->api->Air_SellFromRecommendation($asfr);

        $ok = true;
        $statusCode = '';
        if (isset($resAsfr->errorAtMessageLevel->errorSegment->errorDetails->errorCode)) {
            $ok = false;
            $error = 'Amadeus error code: ' . (string) $resAsfr->errorAtMessageLevel->errorSegment->errorDetails->errorCode;
            $statusCode = "    ";
        } else {
            foreach (\Utils::toArray($resAsfr->itineraryDetails) as $id) {
                foreach (\Utils::toArray($id->segmentInformation) as $si) {
                    if ($si->actionDetails->statusCode != "OK") {
                        $ok = false;
                        $error = \application\components\Amadeus\Utils::$airSellStatusCode[$si->actionDetails->statusCode];
                        $statusCode .= $si->actionDetails->statusCode . " , ";
                    }
                }
            }
        }

        if (!$ok) {
            \Utils::soapLogDebugFile($this->api);
//            \Utils::dbgYiiLog($resAsfr);
//            \Utils::soapLogDebug($this->api);
            $this->api->cancelCurrentPnr();
            $this->api->Security_SignOut();
            return ['error' => "We can not service this request: $error , statusCodes: " . substr($statusCode, 0, -3)];
//            \Utils::dbgYiiLog($resAsfr);
        }
//        echo "Air_SellFromRecommendation is Confirmed!<br><br>";
        $pnrAddMultiElements = new PNR_AddMultiElements;
        $pnrAddMultiElements->pnrActions = new pnrActions;
        $pnrAddMultiElements->pnrActions->optionCode = 0;  // No special process
//    $pnrAddMultiElements->pnrActions->optionCode = 11;  // 11 End transact with retrieve (ER)
//    $pnrAddMultiElements->pnrActions->optionCode = 10;  // 10 End transact (ET)
        $pnrAddMultiElements->dataElementsMaster = new dataElementsMaster;
        $pnrAddMultiElements->dataElementsMaster->marker1 = new marker1;

        // Add mandatory Agecy phone contact element
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = $this->elementCompanyContact();
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = $this->elementPaxEmail();
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = $this->elementPaxMobile();

        // Add ticketing elements. Using first departure time as point for the ticket TL
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = self::elementTicket($this->inputs['segments'][1][0]['depart']);

        // Add mandatory received from element
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = self::elementReceiveFrom();

        // Initialize the tour codes array
        $tourCodes = [];
        if (!empty($this->tourCode)) {
            $tourCodes[0] = $this->elementTourCode('PAX');
        }

        // Prepare the infants array
        $infants = array();
        foreach ($this->passengers as $passenger) {
            if ($passenger['type'] == \application\components\Amadeus\Utils::$paxTypes[\TravelerType::TRAVELER_INFANT]) {
                $infants[] = $passenger;
                if (!empty($this->tourCode)) {
                    $tourCodes[1] = $this->elementTourCode('INF');
                }
            }
        }

// Adding the travellers with all the parameters
        $infantKey = 0;
        $i = 1;
//    $infantIndicator = $this->inputs['passengers'][\TravelerType::TRAVELER_ADULT] + $this->inputs['passengers'][\TravelerType::TRAVELER_CHILD] + 1;
        foreach ($this->passengers as $passenger) {
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

            $passengerData = self::passengerData($passenger);
// Add the infant if needed
            if ($infantKey < count($infants)) {
                $passengerData->travellerInformation->traveller->quantity = 2;
                $passengerData->travellerInformation->passenger->infantIndicator = 3;
                $travellerInfo->passengerData[] = $passengerData;
                $travellerInfo->passengerData[] = self::passengerData($infants[$infantKey]);
                $infantKey++;
            } else {
                $travellerInfo->passengerData[] = $passengerData;
            }

            $pnrAddMultiElements->travellerInfo[] = $travellerInfo;
        }

        // Add the tour codes data elements
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv = array_merge($pnrAddMultiElements->dataElementsMaster->dataElementsIndiv, $tourCodes);

        $this->pnrObject = $this->api->PNR_AddMultiElements($pnrAddMultiElements);
//        if (YII_DEBUG) {
//            \Utils::soapLogDebug($this->api);
//        }
        foreach ($this->pnrObject->dataElementsMaster->dataElementsIndiv as $dei) {
            if (!empty($dei->elementErrorInformation->elementErrorText->text)) {
                \Utils::soapLogDebugFile($this->api);
                $this->api->cancelCurrentPnr();
                $this->api->Security_SignOut();
                return ['error' => (string) $dei->elementErrorInformation->elementErrorText->text];
            }
        }
//    echo \Utils::dbg($resPnr) . '<br>';
// Add the prices to the PNR
        $resPrices = $this->api->addPrices($this->privateFare);
//        if (YII_DEBUG) {
//            \Utils::soapLogDebug($this->api);
//        }
        if (!empty($resPrices->applicationError->errorText->errorFreeText)) {
            return ['error' => "Pricing error: " . $resPrices->applicationError->errorText->errorFreeText];
        }

        $tmp = $this->getTotalAmount($resPrices);
        if ($tmp != $this->totalAmount) {
            $this->api->cancelCurrentPnr();
            $this->api->Security_SignOut();
            return ['error' => "Difference between offered and asked amounts! Offered:{$this->totalAmount} , Asked:{$tmp} , Difference:" . ($tmp - $this->totalAmount)];
        }

        // Add payment only if we have to pay
        if ($this->fop) {
            $resFop = $this->api->addFormOfPayment($this->fop);
            $error = \application\components\Amadeus\Utils::findFpError($resFop->dataElementsMaster->dataElementsIndiv);
            if ($error) {
                \Utils::soapLogDebug($this->api);
                \Utils::dbgYiiLog($resFop);
                return ['error' => $error];
            }
            // Add the tickets to the PNR
            $resTicket = $this->api->addTickets(count(array_filter($this->inputs['passengers'])));
            if (isset($resTicket->applicationError->errorText->errorFreeText)) {
                $this->api->cancelCurrentPnr();
                $this->api->Security_SignOut();
                return ['error' => "Tickets creation error: {$resTicket->applicationError->errorText->errorFreeText}"];
            }
        }


//        $this->api->cancelCurrentPnr(); \Yii::app()->end();
// Finish the transaction and retrieve the PNR
        $pnrAddMultiElements = new PNR_AddMultiElements;
        $pnrAddMultiElements->pnrActions = new pnrActions;
        $pnrAddMultiElements->pnrActions->optionCode = 11;  // 11 End transact with retrieve (ER)
        $this->pnrObject = $this->api->PNR_AddMultiElements($pnrAddMultiElements);
//    \Utils::soapDebug($this->api);
//    echo \Utils::dbg($resPnr) . '<br>';

        if (isset($this->pnrObject->pnrHeader->reservationInfo->reservation->controlNumber)) {
            $pnr = (string) $this->pnrObject->pnrHeader->reservationInfo->reservation->controlNumber;
//            echo "Your PNR is: {$this->pnrObject->pnrHeader->reservationInfo->reservation->controlNumber}<br>The reservation is valid until: " .
//            \application\components\Amadeus\Utils::formatDate($this->pnrObject->pnrHeader->reservationInfo->reservation->date) . " " . \application\components\Amadeus\Utils::formatTime($this->pnrObject->pnrHeader->reservationInfo->reservation->time) . "<br>";
        } else {
//            \Utils::dbgYiiLog($this->pnrObject);
            \Utils::soapLogDebug($this->api);
            $this->api->cancelCurrentPnr();
            $this->api->Security_SignOut();
            return ['error' => "The PNR is not received, check the logs for errors!"];
        }
        $this->api->Security_SignOut();
        sleep(\application\components\Amadeus\Utils::AMADEUS_SLEEP_TIME);   // The Amadeus backend need some time to react for the new PNR to get to the Airlines
        $this->api->Security_Authenticate($this->airSourceId);
        $this->pnrObject = $this->api->getPnr($pnr);

        if (($this->fop && $this->airSource->isAutoTicket($this->inputs['segments']) && \PayGateLog::autoIssueFlag() === true) ||
                $manualIssue
        ) {   // Issue ticket if we have fop info and autoTicket airSource setting and issue flag from the PG
            // New session
            $issueTicketTrys = 0;
            do {
                $resIssueTicket = $this->api->issueTicket();
                if ($resIssueTicket->processingStatus->statusCode != 0) {   // Wait for Amadeus to wake up
                    sleep(\application\components\Amadeus\Utils::AMADEUS_SLEEP_TIME);   // The Amadeus backend need some time to react for the new PNR to get to the Airlines
                }
                $issueTicketTrys++;
            } while ($issueTicketTrys <= \application\components\Amadeus\Utils::AMADEUS_REPEAT_ISSUE_TICKET_OPERATION &&
            $resIssueTicket->processingStatus->statusCode != 0);

//            \Utils::dbgYiiLog($resIssueTicket);
//            \Utils::soapLogDebug($this->api);
            if ($resIssueTicket->processingStatus->statusCode != 0) {
                $this->api->Security_SignOut();
                return ['error' => "Error with issuing the ticket: " . $resIssueTicket->errorGroup->errorWarningDescription->freeText];
            }
//            $resTicket = $this->api->getTicket();
//            \Utils::dbgYiiLog($resTicket);
            $this->pnrObject = $this->api->getPnr($pnr);
        }

        /**
         * @todo Schedule PNR resync for after 2 min.
         */
        $airCartId = $this->createAirCart($manualIssue);
        if (is_int($airCartId)) {
            $this->addCartId($airCartId);
        }
        $this->api->Security_SignOut();

        if (YII_DEBUG) {
            \Utils::objectToFile(\Yii::app()->runtimePath . '/pnrObject.json', $this->pnrObject);
            file_put_contents(\Yii::app()->runtimePath . '/inputs.ser', serialize($this->inputs));
            file_put_contents(\Yii::app()->runtimePath . '/passengers.ser', serialize($this->passengers));
        }

        return ['airCartId' => $airCartId];
    }

    static function test() {
        $inputs = unserialize(file_get_contents(\Yii::app()->runtimePath . '/inputs.ser'));
        $travelers = unserialize(file_get_contents(\Yii::app()->runtimePath . '/passengers.ser'));
        $book = new Book(\application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID, $inputs, $travelers, 'CA');
        $book->pnrObject = \Utils::fileToObject(\Yii::app()->runtimePath . '/pnrObject.json');
        $issuedTickets = \application\components\Amadeus\Utils::findTicketNumbers($book->pnrObject->dataElementsMaster->dataElementsIndiv);
        echo \Utils::dbg($issuedTickets);
        $book->extractPassagersFromPnr();
        echo \Utils::dbg($book->passengers);
        $book->extractIteneraries();
        echo \Utils::dbg($book->inputs);
        echo \Utils::dbg($book->itineraryInfos);
        $FEs = \application\components\Amadeus\Utils::findFEs($book->pnrObject->dataElementsMaster->dataElementsIndiv);
        echo \Utils::dbg($FEs);
        $SSRs = \application\components\Amadeus\Utils::findSSRs($book->pnrObject->dataElementsMaster->dataElementsIndiv);
        echo \Utils::dbg($SSRs);

//        return $this->createAirCart();
    }

    function extractIteneraries() {
        foreach (\Utils::toArray($this->pnrObject->originDestinationDetails->itineraryInfo) as $itineraryInfo) {
            // We work only with AIR products and only with exsisting destinations
            if ($itineraryInfo->elementManagementItinerary->segmentName != 'AIR' ||
                    !isset($itineraryInfo->travelProduct->boardpointDetail->cityCode) ||
                    !isset($itineraryInfo->travelProduct->offpointDetail->cityCode)) {
                continue;
            }
            $airRoute = new \AirRoutes;
//            $airRoute->air_booking_id = $airBooking->id;
            $airRoute->source_id = \Airport::getIdFromCode($itineraryInfo->travelProduct->boardpointDetail->cityCode);
            $airRoute->destination_id = \Airport::getIdFromCode($itineraryInfo->travelProduct->offpointDetail->cityCode);
            $airRoute->departure_ts = \application\components\Amadeus\Utils::formatDate($itineraryInfo->travelProduct->product->depDate) . " " . \application\components\Amadeus\Utils::formatTime($itineraryInfo->travelProduct->product->depTime);
            $airRoute->arrival_ts = \application\components\Amadeus\Utils::formatDate($itineraryInfo->travelProduct->product->arrDate) . " " . \application\components\Amadeus\Utils::formatTime($itineraryInfo->travelProduct->product->arrTime);
            $airRoute->order_ = null;
            if (isset($itineraryInfo->flightDetail->departureInformation->departTerminal)) {
                $airRoute->source_terminal = $itineraryInfo->flightDetail->departureInformation->departTerminal;
            }
            if (isset($itineraryInfo->flightDetail->productDetails->equipment)) {
                $airRoute->aircraft = $itineraryInfo->flightDetail->productDetails->equipment;
            }
            $airRoute->carrier_id = \Carrier::getIdFromCode($itineraryInfo->travelProduct->companyDetail->identification);
            if (isset($itineraryInfo->itineraryReservationInfo)) {
                $airRoute->airPnr = $itineraryInfo->itineraryReservationInfo->reservation->controlNumber;
            }
            $airRoute->flight_number = $itineraryInfo->travelProduct->productDetails->identification;
            $airRoute->booking_class = $itineraryInfo->travelProduct->productDetails->classOfService;
            // Deal with the unsafe attribute error
            unset($airRoute->id);

            // Technical stops parsing
            if (isset($itineraryInfo->legInfo)) {
                $airRoute->ts = \application\components\Amadeus\Utils::parseTechnicalStops($itineraryInfo->legInfo);                
            }

            $this->itineraryInfos[$itineraryInfo->elementManagementItinerary->reference->number] = $airRoute;
        }
        foreach ($this->inputs['segments'] as $segmentKey => $segment) {
            foreach ($segment as $legKey => $leg) {
                foreach ($this->itineraryInfos as $itineraryKey => $itineraryInfo) {
                    if ($itineraryInfo->flight_number == $leg['flightNumber'] &&
                            $itineraryInfo->source_id == \Airport::getIdFromCode($leg['origin']) &&
                            $itineraryInfo->destination_id == \Airport::getIdFromCode($leg['destination'])
                    ) {
                        // Assign corresponding segment tatoo to the input segment
                        $this->inputs['segments'][$segmentKey][$legKey]['ST'] = $itineraryKey;
                        // Create array of ST keys for the segment
                        $this->inputs['segments'][$segmentKey]['STs'][] = $itineraryKey;
                    }
                }
            }
        }
    }

    private function createAirCart($manualIssue) {
        $userInfoId = \Utils::getActiveUserId();
        $loggedUserId = \Utils::getLoggedUserId();
        $airCart = new \AirCart;
        $airCart->user_id = $userInfoId;        // \Utils::getActiveUserId();
        $airCart->loged_user_id = $loggedUserId;          // \Utils::getLoggedUserId();
        $airCart->payment_status_id = \PaymentStatus::STATUS_NOT_CHARGED;
        $airCart->booking_status_id = \BookingStatus::STATUS_NEW;
        $airCart->approval_status_id = \ApprovalStatus::STATUS_NOT_REQUIRED;
        $airCart->note = 'PNR via Amadeus';
        $airCart->insert();

        $issuedTickets = \application\components\Amadeus\Utils::findTicketNumbers($this->pnrObject->dataElementsMaster->dataElementsIndiv);
        $this->extractPassagersFromPnr();
        $this->extractIteneraries();
        $FEs = \application\components\Amadeus\Utils::findFEs($this->pnrObject->dataElementsMaster->dataElementsIndiv);
        $FTs = \application\components\Amadeus\Utils::findFTs($this->pnrObject->dataElementsMaster->dataElementsIndiv);
        $SSRs = \application\components\Amadeus\Utils::findSSRs($this->pnrObject->dataElementsMaster->dataElementsIndiv);
//        \Utils::dbgYiiLog($this->passengers);
        foreach ($this->passengers as $passenger) {
            foreach ($this->inputs['segments'] as $segmentKey => $segment) {
                $airBooking = new \AirBooking;
                $airBooking->source_id = \Airport::getIdFromCode($segment[0]['origin']);
                $legsCount = count($segment) - 2;   // Decresead by 2 so it is ready to be used as last numeric array key avoiding STs element confusion
                $airBooking->destination_id = \Airport::getIdFromCode($segment[$legsCount]['destination']);
                $airBooking->crs_pnr = $this->pnrObject->pnrHeader->reservationInfo->reservation->controlNumber;
                $airBooking->air_source_id = $this->airSourceId;
                $airBooking->booking_type_id = \BookingType::AUTOMATED_BOOKING;
                $airBooking->service_type_id = \ServiceType::getServiceType($airBooking->source_id, $airBooking->destination_id);
                $airBooking->traveler_id = $passenger['id'];
                $airBooking->traveler_type_id = \application\components\Amadeus\Utils::$paxTypeIds[$passenger['type']];
                $airBooking->cabin_type_id = $this->cabinType;
                $airBooking->carrier_id = \Carrier::getIdFromCode($this->marketingCarrier ? : $segment[0]['marketingCompany']);
                $airBooking->departure_ts = $segment[0]['departTs'];
                $airBooking->arrival_ts = $segment[$legsCount]['arriveTs'];
                $airBooking->booking_class = $segment[0]['bookingClass'];
                if (is_array($passenger['fareBasis'])) {
                    $airBooking->fare_basis = $passenger['fareBasis'][$segmentKey][0];
                } else {
                    $airBooking->fare_basis = $passenger['fareBasis'];
                }
                $airBooking->fare_type_id = \FareType::getFareType($airBooking->carrier_id, $airBooking->booking_class);
                $airBooking->frequent_flyer = \application\components\Amadeus\Utils::getFrequentFlyer($passenger['PT'], [$segment[0]['ST']], $SSRs);
                $airBooking->tour_code = \application\components\Amadeus\Utils::getTourCode($passenger['PT'], [$segment[0]['ST']], $FTs);
                $airBooking->private_fare = \application\components\Amadeus\Utils::getPrivateFare($passenger['PT'], [$segment[0]['ST']], $FTs);
                $airBooking->endorsment = \application\components\Amadeus\Utils::getEndorsment($passenger['PT'], [$segment[0]['ST']], $FEs);
                $airBooking->air_cart_id = $airCart->id;
                // Fill up the fares data for the last segment
                if ($segmentKey == count($this->inputs['segments'])) {
                    $airBooking = \Taxes::fillTaxesInAirBooking($airBooking, $passenger['arrTaxes']);
                    $airBooking->basic_fare = (float) $passenger['amount'] - (float) array_sum($passenger['arrTaxes']);
                }
                $airBooking->ticket_number = empty($issuedTickets[$passenger['PT']][$segmentKey]) ? null : $issuedTickets[$passenger['PT']][$segmentKey];
                $airBooking->airline_pnr = $this->itineraryInfos[$segment[0]['ST']]->airPnr;
                $airBooking->endorsment = \application\components\Amadeus\Utils::getEndorsment($passenger['PT'], $segment['STs'], $FEs);

                $airBooking->insert();

                foreach ($segment as $legKey => $leg) {
                    // Skip the STs
                    if ($legKey === 'STs') {
                        continue;
                    }
                    $airRoute = new \AirRoutes('pnrAcquisition');
                    $airRoute->attributes = $this->itineraryInfos[$leg['ST']]->attributes;
                    $airRoute->air_booking_id = $airBooking->id;
                    // Seat check
                    $airRoute->seat = \application\components\Amadeus\Utils::getSeat($passenger['PT'], $leg['ST'], $SSRs);
                    // Meal check
                    $airRoute->meal = \application\components\Amadeus\Utils::getMeal($passenger['PT'], $leg['ST'], $SSRs);
                    $airRoute->insert();
                }
                $airBooking->setAirRoutesOrder();
            }
        }
        
        // Set correct Note when auto issue is disabled
        if (!$manualIssue && \PayGateLog::autoIssueFlag() !== true) {
            $airCart->addNote('[' . \PayGateLog::autoIssueFlag() . '] autoTicketIssue disabled');
        }

        return $airCart->id;
    }

    /**
     * Prepare the passenger data structure
     * @param array $passenger
     * @return \application\components\Amadeus\production\passengerData
     */
    private static function passengerData(array $passenger) {
        $passengerData = new passengerData;
        $passengerData->travellerInformation = new travellerInformation;
        $passengerData->travellerInformation->traveller = new traveller;
        $passengerData->travellerInformation->passenger = new passenger;
        $passengerData->travellerInformation->traveller->surname = $passenger['lastName'];
        // No dots in the titles
        $passengerData->travellerInformation->passenger->firstName = $passenger['firstName'] . " " . str_replace('.', '', $passenger['title']);
        $passengerData->travellerInformation->passenger->type = $passenger['type'];
        $passengerData->travellerInformation->traveller->quantity = 1;
        if (!empty($passenger['birthDate'])) {
            $passengerData->dateOfBirth = new dateOfBirth;
            $passengerData->dateOfBirth->dateAndTimeDetails = new dateAndTimeDetails;
            $passengerData->dateOfBirth->dateAndTimeDetails->date = strtoupper(date("dMy", strtotime($passenger['birthDate'])));
        }

        return $passengerData;
    }

    private function extractPassagersFromPnr() {
        $passengers = array();
        $infants = array();
        foreach (\Utils::toArray($this->pnrObject->travellerInfo) as $ti) {
            $passenger = new \Traveler;
            $refNumber = $ti->elementManagementPassenger->reference->number;
            foreach (\Utils::toArray($ti->passengerData) as $key => $tiPd) {
                if ($key === 0) {   // The first passenger
                    $passenger->last_name = $tiPd->travellerInformation->traveller->surname;
                    // Do we have infant with same traveler and 2 passenger structures?
                    if (is_array($tiPd->travellerInformation->passenger)) {
                        // Add the adult
                        list($passenger->first_name, $title) = \application\components\Amadeus\Utils::splitNameAndTitle($tiPd->travellerInformation->passenger[0]->firstName);
                        if (isset($tiPd->travellerInformation->passenger[0]->type)) {
                            $passenger->traveler_type_id = \application\components\Amadeus\Utils::$paxTypeIds[$tiPd->travellerInformation->passenger[0]->type];
                        } else {
                            $passenger->traveler_type_id = \TravelerType::TRAVELER_ADULT;
                        }
                        $passenger->traveler_title_id = \TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = $passenger;
                        // Add the infant - second array element
                        $infant = new \Traveler;
                        $infant->last_name = $passenger->last_name;
                        list($infant->first_name, $title) = \application\components\Amadeus\Utils::splitNameAndTitle($tiPd->travellerInformation->passenger[1]->firstName);
                        $passenger->traveler_title_id = \TravelerTitle::TITILE_INFANT;
                        if (isset($tiPd->dateOfBirth->dateAndTimeDetails->date)) {
                            $infant->birthdate = \application\components\Amadeus\Utils::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                        } elseif (isset($tiPd->travellerInformation->passenger[0]->identificationCode)) {
                            $infant->birthdate = \application\components\Amadeus\Utils::formatInfantDateFromCode($tiPd->travellerInformation->passenger[0]->identificationCode);
//                            \Utils::dbgYiiLog($infant->birthdate);
                        }
                        $infant->traveler_type_id = \TravelerType::TRAVELER_INFANT;
                        $passengers[$refNumber . 'i'] = $infant;
                    } else {    // The passenger structure is not array
                        list($passenger->first_name, $title) = \application\components\Amadeus\Utils::splitNameAndTitle($tiPd->travellerInformation->passenger->firstName);
                        if (isset($tiPd->travellerInformation->passenger->type)) {
                            $passenger->traveler_type_id = \application\components\Amadeus\Utils::$paxTypeIds[$tiPd->travellerInformation->passenger->type];
                        } else {
                            $passenger->traveler_type_id = \TravelerType::TRAVELER_ADULT;
                        }
                        $passenger->traveler_title_id = \TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = $passenger;
                    }
                } else {    // The second passenger - infant
                    $infant = new \Traveler;
                    $infant->last_name = $tiPd->travellerInformation->traveller->surname;
                    list($infant->first_name, $title) = \application\components\Amadeus\Utils::splitNameAndTitle($tiPd->travellerInformation->passenger->firstName);
                    $passenger->traveler_title_id = \TravelerTitle::TITILE_INFANT;
                    if (isset($tiPd->dateOfBirth->dateAndTimeDetails->date)) {
                        $infant->birthdate = \application\components\Amadeus\Utils::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                    } elseif (isset($tiPd->travellerInformation->passenger->identificationCode)) {
                        $infant->birthdate = \application\components\Amadeus\Utils::formatInfantDateFromCode($tiPd->travellerInformation->passenger->identificationCode);
                    }
                    $infant->traveler_type_id = \TravelerType::TRAVELER_INFANT;
                    $passengers[$refNumber . 'i'] = $infant;
                }
            }
        }

        // Match and update the passengers with PT (passanger tatoo)
        foreach ($this->passengers as $key => $passenger) {
            foreach ($passengers as $keyFromPnr => $pnrPassenger) {
                if ($pnrPassenger->first_name == strtoupper($passenger['firstName']) &&
                        $pnrPassenger->last_name == strtoupper($passenger['lastName']) &&
                        \application\components\Amadeus\Utils::$paxTypes[$pnrPassenger->traveler_type_id] == strtoupper($passenger['type'])) {
                    $this->passengers[$key]['PT'] = $keyFromPnr;
                }
            }
            // Debug logging when PT can't be found
            if (!isset($this->passengers[$key]['PT'])) {
                \Utils::dbgYiiLog([
                    'Issue' => 'Cant find PAX PT in Amadeus PNR ' . $this->pnrObject->pnrHeader->reservationInfo->reservation->controlNumber,
                    'Our PAX object' => $passenger,
                    'Amadeus PAX extracted' => $passengers,
                    'Amadeus travellerInfo' => $this->pnrObject->travellerInfo,
                ]);
            }
        }
    }

    private function elementPaxEmail() {
        $dataElementsIndiv = new dataElementsIndiv;
        $dataElementsIndiv->elementManagementData = new elementManagementData;
        $dataElementsIndiv->elementManagementData->reference = new reference;
        $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
        $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
        $dataElementsIndiv->elementManagementData->segmentName = 'AP';     // AP === Contact element
        $dataElementsIndiv->freetextData = new freetextData;
        $dataElementsIndiv->freetextData->freetextDetail = new freetextDetail;
        $dataElementsIndiv->freetextData->freetextDetail->subjectQualifier = 3;    // 3 Literal text
        $dataElementsIndiv->freetextData->freetextDetail->type = 3;    // 3 Business phone
        $dataElementsIndiv->freetextData->longFreetext = "Email: $this->paxEmail";
        return $dataElementsIndiv;
    }

    private function elementPaxMobile() {
        $dataElementsIndiv = new dataElementsIndiv;
        $dataElementsIndiv->elementManagementData = new elementManagementData;
        $dataElementsIndiv->elementManagementData->reference = new reference;
        $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
        $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
        $dataElementsIndiv->elementManagementData->segmentName = 'OS';     // 
        $dataElementsIndiv->freetextData = new freetextData;
        $dataElementsIndiv->freetextData->freetextDetail = new freetextDetail;
        $dataElementsIndiv->freetextData->freetextDetail->subjectQualifier = 3;    // 3 Literal text
        $dataElementsIndiv->freetextData->freetextDetail->type = 3;    // 3 Business phone
        $dataElementsIndiv->freetextData->freetextDetail->companyId = $this->marketingCarrier;
        $dataElementsIndiv->freetextData->longFreetext = "$this->marketingCarrier PAX CTC " . preg_replace('/\D/', '', $this->paxMobile);
        return $dataElementsIndiv;
    }

    private function elementCompanyContact() {
        $dataElementsIndiv = new dataElementsIndiv;
        $dataElementsIndiv->elementManagementData = new elementManagementData;
        $dataElementsIndiv->elementManagementData->reference = new reference;
        $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
        $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
        $dataElementsIndiv->elementManagementData->segmentName = 'AP';     // AP === Contact element
        $dataElementsIndiv->freetextData = new freetextData;
        $dataElementsIndiv->freetextData->freetextDetail = new freetextDetail;
        $dataElementsIndiv->freetextData->freetextDetail->subjectQualifier = 3;    // 3 Literal text
        $dataElementsIndiv->freetextData->freetextDetail->type = 6;    // 6 Company phone
        $dataElementsIndiv->freetextData->longFreetext = \Utils::PNR_AP_ELEMENT;
        return $dataElementsIndiv;
    }

    private function elementAirCartId($airCartId) {
        $dataElementsIndiv = new dataElementsIndiv;
        $dataElementsIndiv->elementManagementData = new elementManagementData;
        $dataElementsIndiv->elementManagementData->reference = new reference;
        $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
        $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
        $dataElementsIndiv->elementManagementData->segmentName = 'AP';     // AP === Contact element
        $dataElementsIndiv->freetextData = new freetextData;
        $dataElementsIndiv->freetextData->freetextDetail = new freetextDetail;
        $dataElementsIndiv->freetextData->freetextDetail->subjectQualifier = 3;    // 3 Literal text
        $dataElementsIndiv->freetextData->freetextDetail->type = 'P19';    // P19 Miscellaneous information
        $dataElementsIndiv->freetextData->longFreetext = "Booking No: $airCartId";
        return $dataElementsIndiv;
    }

    /**
     *
     * @param string $passengerType PAX by default, the other option is INF
     * @return \application\components\Amadeus\test\dataElementsIndiv
     */
    private function elementTourCode($passengerType = 'PAX') {
        $dataElementsIndiv = new dataElementsIndiv;
        $dataElementsIndiv->elementManagementData = new elementManagementData;
        $dataElementsIndiv->elementManagementData->reference = new reference;
        $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
        $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
        $dataElementsIndiv->elementManagementData->segmentName = 'FT';     // FT === Tour Code
        $dataElementsIndiv->tourCode = new tourCode;
        $dataElementsIndiv->tourCode->passengerType = $passengerType;
        $dataElementsIndiv->tourCode->netRemit = new netRemit;
        $dataElementsIndiv->tourCode->netRemit->indicator = 'NR';   // NR === Non Refundable
        $dataElementsIndiv->tourCode->netRemit->freetext = $this->tourCode;
        return $dataElementsIndiv;
    }

    private static function elementTicket($depart) {
        $dataElementsIndiv = new dataElementsIndiv;
        $dataElementsIndiv->elementManagementData = new elementManagementData;
        $dataElementsIndiv->elementManagementData->reference = new reference;
        $dataElementsIndiv->elementManagementData->reference->qualifier = 'OT';    // OT Other element tatoo reference number
        $dataElementsIndiv->elementManagementData->reference->number = 1;    // refers to an existing PNR segment/element that has been previously transmitted in a previous Server response message
        $dataElementsIndiv->elementManagementData->segmentName = 'TK';     // TK Ticket element
        $dataElementsIndiv->ticketElement = new ticketElement;
        $dataElementsIndiv->ticketElement->ticket = new ticket;
//        $dataElementsIndiv->ticketElement->ticket->indicator = 'TL';    // Ticket Time Limit (TL)
        $dataElementsIndiv->ticketElement->ticket->indicator = 'XL';    // Ticket cancel (XL)
        $time = time() + 24 * 3600;     // 1 day cancellation time by default
        if (strtotime($depart) < $time) {
            $time = time() + 2 * 3600;  // 2 hours cancellation time for same day PNRs
        }
        $dataElementsIndiv->ticketElement->ticket->date = \application\components\Amadeus\Utils::toAmadeusDate(date(DATE_FORMAT, $time));
        $dataElementsIndiv->ticketElement->ticket->time = \application\components\Amadeus\Utils::toAmadeusTime(date(DATETIME_FORMAT, $time));
        return $dataElementsIndiv;
    }

    private static function elementReceiveFrom() {
        $dataElementsIndiv = new dataElementsIndiv;
        $dataElementsIndiv->elementManagementData = new elementManagementData;
        $dataElementsIndiv->elementManagementData->segmentName = 'RF';     // RF Receive From element
        $dataElementsIndiv->freetextData = new freetextData;
        $dataElementsIndiv->freetextData->freetextDetail = new freetextDetail;
        $dataElementsIndiv->freetextData->freetextDetail->subjectQualifier = 3;    // 3 Literal text
        $dataElementsIndiv->freetextData->freetextDetail->type = 'P22';    // P22 Receive from
        $dataElementsIndiv->freetextData->longFreetext = 'Belair travel';
        return $dataElementsIndiv;
    }

    /**
     * Prepare the Itinerary details
     * @param array $segments
     * @param int $paxCount The number of the passagers excluding INF
     * @return \application\components\Amadeus\production\itineraryDetails
     */
    private function prepareItineraryDetails() {
        $paxCount = ($this->inputs['passengers'][\TravelerType::TRAVELER_ADULT] + $this->inputs['passengers'][\TravelerType::TRAVELER_CHILD]);
        foreach ($this->inputs['segments'] as $segment) {
            $itineraryDetails = new itineraryDetails;
            $itineraryDetails->originDestinationDetails = new originDestinationDetails;
            $itineraryDetails->originDestinationDetails->origin = $segment[0]['origin'];
            $itineraryDetails->originDestinationDetails->destination = $segment[(count($segment) - 1)]['destination'];
            $itineraryDetails->message = new message;
            $itineraryDetails->message->messageFunctionDetails = new messageFunctionDetails;
            $itineraryDetails->message->messageFunctionDetails->messageFunction = 183;

            foreach ($segment as $leg) {
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
                $segmentInformation->relatedproductInformation->quantity = $paxCount;
                $segmentInformation->relatedproductInformation->statusCode = 'NN';

                $itineraryDetails->segmentInformation[] = $segmentInformation;
            }
            $out[] = $itineraryDetails;
        }
        return $out;
    }

    private function getTotalAmount($obj) {
        if (!isset($obj->fareList)) {
            return false;   // Return if no fareList is present
        }
        $sum = 0;
        foreach (\Utils::toArray($obj->fareList) as $fare) {
            $paxCount = count(\Utils::toArray($fare->paxSegReference->refDetails));
            foreach (\Utils::toArray($fare->fareDataInformation->fareDataSupInformation) as $fdsi) {
                if ($fdsi->fareDataQualifier == 712) {
                    $amount = (float) $fdsi->fareAmount;
                }
            }
            $sum += $paxCount * $amount;
        }

        return $sum;
    }

    private function addCartId($id) {
        $pnrAddMultiElements = new PNR_AddMultiElements;
        $pnrAddMultiElements->pnrActions = new pnrActions;
        //        $pnrAddMultiElements->pnrActions->optionCode = 0;  // No special process
        $pnrAddMultiElements->pnrActions->optionCode = 11;  // 11 End transact with retrieve (ER)
        //    $pnrAddMultiElements->pnrActions->optionCode = 10;  // 10 End transact (ET)
        $pnrAddMultiElements->dataElementsMaster = new dataElementsMaster;
        $pnrAddMultiElements->dataElementsMaster->marker1 = new marker1;

        // AirCartId element
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = $this->elementAirCartId($id);
        $pnrAddMultiElements->dataElementsMaster->dataElementsIndiv[] = self::elementReceiveFrom();
        $this->pnrObject = $this->api->PNR_AddMultiElements($pnrAddMultiElements);
    }

}

?>