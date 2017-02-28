<div class="form">
    <?php
    /* @var $model BookingSearchForm */
    /* @var $this BookingController */
    set_time_limit(90);
    $start_timer = microtime(true);
    $as = \AirSource::model()->findBySql('select * from air_source where backend_id=' . \Backend::AMADEUS_PRODUCTION_V2 . ' order by id');
    $airSourceId = $as->id;

    function footer($start_timer) {
        print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . " , Time used: " . round((microtime(true) - $start_timer), 2) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
    }

    $this->breadcrumbs = ['Search' => ['index'],
        'Amadeus production V2',
    ];
    if (!$model->validate()) {
        echo \TbHtml::errorSummary($model);
        \Yii::app()->end();
    }
    $api = new application\components\Amadeus\test_v2\AmadeusWebServices;
    $activeCompanyId = Utils::getActiveCompanyId();
//    $localTest = true;
    $localTest = false;
    // Trun off the local test if not used locally
    if (\Yii::app()->request->userHostAddress != '127.0.0.1') {
        $localTest = false;
    }

    if (!$localTest) {
        $res = $api->Security_Authenticate($airSourceId);
        if (YII_DEBUG) {
//            \Utils::soapLogDebugFile($api, 'amadeus_Security_Authenticate.xml');
        }
    } else {   // manually set the BookingForm model
        $model->adults = 2;
        $model->children = 1;
        $model->infants = 1;
        $model->category = CabinType::ECONOMY;
    }
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'amadeus-booking-form',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'enableClientValidation' => true,
    ));
    echo TbHtml::hiddenField('airSourceId', $airSourceId);

    if ($activeCompanyId) {
        // Prepare the travelers structure
        for ($i = 0; $i < $model->adults; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_ADULT;
            $travelers[] = $traveler;
        }
        for ($i = 0; $i < $model->children; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_CHILD;
            $travelers[] = $traveler;
        }
        for ($i = 0; $i < $model->infants; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_INFANT;
            $travelers[] = $traveler;
        }
        ?>
        <p class="well well-small alert-info">&nbsp;<i class="fa fa-credit-card fa-lg"></i>&nbsp;&nbsp;Payment details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(initially this and next forms are hidden)</p>
        <?php
        // Render the CC form
        $cc = new Cc;
        $cc->user_info_id = $activeCompanyId;
        $cc->number = '5499830000000015';
        $cc->code = 'CA';
        $cc->name = 'Orson Scott';
        $cc->exp_date = '1218';
        if ($localTest) {   // fill the treavelers and cc fake test data
            $travelers[0] = \Traveler::model()->findByPk(3);
            $travelers[1] = \Traveler::model()->findByPk(5);
            $travelers[2] = \Traveler::model()->findByPk(194);
            $travelers[2]->birthdate = date(DATE_FORMAT, strtotime('-10 year'));
            $travelers[2]->traveler_type_id = TravelerType::TRAVELER_CHILD;
            $travelers[3] = \Traveler::model()->findByPk(97);
            $travelers[3]->birthdate = date(DATE_FORMAT, strtotime('-1 year'));
            $travelers[3]->traveler_type_id = TravelerType::TRAVELER_INFANT;
        }
        $this->renderPartial('/cc/_form', ['model' => $cc, 'form' => $form]);
        // Render the travelers
        $this->renderPartial('/airCart/_form_travelers', ['travelers' => $travelers]);
        echo "<p><b>NOTE: </b>Travelers validation is not done yet - mind your inputs!</p>";
    }
//Utils::soapDebug($api);
//if ($res->processStatus->statusCode !== 'P') {
//    echo Utils::dbg($res);
//}

    $model->depart = date("dmy", strtotime($model->depart));
    $origin = Airport::model()->findByPk($model->source);
    $destination = Airport::model()->findByPk($model->destination);

    $f_mptbs = new application\components\Amadeus\test_v2\Fare_MasterPricerTravelBoardSearch;

    $und = new application\components\Amadeus\test_v2\NumberOfUnitDetailsType_191580C;
    $und->numberOfUnits = $model->adults + $model->children;
    $und->typeOfUnit = 'PX';
    $f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

    $und = new application\components\Amadeus\test_v2\NumberOfUnitDetailsType_191580C;
    $und->numberOfUnits = application\components\Amadeus\Utils::AMADEUS_MAX_SEARCH_RESULTS;
    $und->typeOfUnit = 'RC';
    $f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

    $ref = 1;
    if ($model->adults > 0) {
        $pr = new \application\components\Amadeus\test_v2\paxReference;
        $pr->ptc = 'ADT';
        for ($i = 0; $i < $model->adults; $i++) {
            $traveller = new application\components\Amadeus\test_v2\traveller;
            $traveller->ref = $ref;
            $ref++;
            $pr->traveller[] = $traveller;
        }
        $f_mptbs->paxReference[] = $pr;
    }
    if ($model->children > 0) {
        $pr = new \application\components\Amadeus\test_v2\paxReference;
        $pr->ptc = 'CH';
        for ($i = 0; $i < $model->children; $i++) {
            $traveller = new application\components\Amadeus\test_v2\traveller;
            $traveller->ref = $ref;
            $ref++;
            $pr->traveller[] = $traveller;
        }
        $f_mptbs->paxReference[] = $pr;
    }

    if ($model->infants > 0) {
        $pr = new \application\components\Amadeus\test_v2\paxReference;
        $pr->ptc = 'INF';
        for ($i = 0; $i < $model->infants; $i++) {
            $traveller = new application\components\Amadeus\test_v2\traveller;
            $traveller->ref = (int) ($i + 1);
            $traveller->infantIndicator = 1;
            $pr->traveller[] = $traveller;
        }
        $f_mptbs->paxReference[] = $pr;
    }

//    echo Utils::dbg($f_mptbs->paxReference); exit;

    $pt = new application\components\Amadeus\test_v2\PricingTicketingInformationType;
    $pt->priceType[] = 'TAC';
    $pt->priceType[] = 'RU';
    $pt->priceType[] = 'RP';
//$pt->priceType[] = 'PTC';
    $pt->priceType[] = 'ET';
    $f_mptbs->fareOptions = new \application\components\Amadeus\test_v2\fareOptions;
    $f_mptbs->fareOptions->pricingTickInfo = new \application\components\Amadeus\test_v2\pricingTickInfo;
    $f_mptbs->fareOptions->pricingTickInfo->pricingTicketing = $pt;

    $f_mptbs->travelFlightInfo = new \application\components\Amadeus\test_v2\TravelFlightInformationType_165052S;
    $f_mptbs->travelFlightInfo->cabinId = new \application\components\Amadeus\test_v2\CabinIdentificationType_233500C;
//    if ($model->category == CabinType::PREMIUM_ECONOMY) {
//        $model->category = CabinType::ECONOMY;
//    }
    $f_mptbs->travelFlightInfo->cabinId->cabin = CabinType::$iataCabinClass[$model->category];

    $f_mptbs->itinerary[0] = new \application\components\Amadeus\test_v2\itinerary;
    $f_mptbs->itinerary[0]->requestedSegmentRef = new \application\components\Amadeus\test_v2\OriginAndDestinationRequestType;
    $f_mptbs->itinerary[0]->requestedSegmentRef->segRef = 1;
    $f_mptbs->itinerary[0]->departureLocalization = new application\components\Amadeus\test_v2\DepartureLocationType;
    $f_mptbs->itinerary[0]->departureLocalization->depMultiCity = new application\components\Amadeus\test_v2\MultiCityOptionType;
    $f_mptbs->itinerary[0]->departureLocalization->depMultiCity->locationId = $origin->airport_code;

    $f_mptbs->itinerary[0]->arrivalLocalization = new \application\components\Amadeus\test_v2\ArrivalLocalizationType;
    $f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity = new \application\components\Amadeus\test_v2\MultiCityOptionType;
    $f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity->locationId = $destination->airport_code;

    $f_mptbs->itinerary[0]->timeDetails = new application\components\Amadeus\test_v2\DateAndTimeInformationType_181295S;
    $f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail = new \application\components\Amadeus\test_v2\DateAndTimeDetailsTypeI;
    $f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail->date = $model->depart;

// Round trip
    if (!empty($model->return)) {
        $model->return = date("dmy", strtotime($model->return));
        $f_mptbs->itinerary[1] = new \application\components\Amadeus\test_v2\itinerary;
        $f_mptbs->itinerary[1]->requestedSegmentRef = new \application\components\Amadeus\test_v2\OriginAndDestinationRequestType;
        $f_mptbs->itinerary[1]->requestedSegmentRef->segRef = 2;
        $f_mptbs->itinerary[1]->departureLocalization = new application\components\Amadeus\test_v2\DepartureLocationType;
        $f_mptbs->itinerary[1]->departureLocalization->depMultiCity = new application\components\Amadeus\test_v2\MultiCityOptionType;
        $f_mptbs->itinerary[1]->departureLocalization->depMultiCity->locationId = $destination->airport_code;

        $f_mptbs->itinerary[1]->arrivalLocalization = new \application\components\Amadeus\test_v2\ArrivalLocalizationType;
        $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity = new \application\components\Amadeus\test_v2\MultiCityOptionType;
        $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity->locationId = $origin->airport_code;

        $f_mptbs->itinerary[1]->timeDetails = new application\components\Amadeus\test_v2\DateAndTimeInformationType_181295S;
        $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail = new \application\components\Amadeus\test_v2\DateAndTimeDetailsTypeI;
        $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail->date = $model->return;
    }

    if ($localTest) {
        $res = \Utils::fileToObject('amadeus_f_mptbs.json');
    } else {
// Release the seesion file
        session_write_close();
        $res = $api->Fare_MasterPricerTravelBoardSearch($f_mptbs);
        Yii::app()->session->open();
        if ($res === false) {
//            Utils::objectToFile('amadeus_f_mptbs.json', $res);
//    Utils::finalMessage("SoapFault - check the logs for details");
            echo "SoapFault - check the logs for details";
            Utils::soapLogDebug($api);
            Yii::app()->end();
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('amadeus_f_mptbs.json', $res);
            \Utils::soapLogDebugFile($api, 'amadeus_f_mptbs.xml');
        }
    }
//echo Utils::dbg($res);
    if (isset($res->errorMessage->errorMessageText->description)) {
//    Utils::soapDebug($api);
        Utils::finalMessage($res->errorMessage->errorMessageText->description);
    }
// Parse the flights
    foreach (Utils::toArray($res->flightIndex) as $fi) {
        $segmentRef = $fi->requestedSegmentRef->segRef;
        foreach ($fi->groupOfFlights as $gof) {
            unset($legs);
            foreach (Utils::toArray($gof->flightDetails) as $fd) {
                $depart = \application\components\Amadeus\Utils::formatDate($fd->flightInformation->productDateTime->dateOfDeparture) . " " . \application\components\Amadeus\Utils::formatTime($fd->flightInformation->productDateTime->timeOfDeparture);
                $arrive = \application\components\Amadeus\Utils::formatDate($fd->flightInformation->productDateTime->dateOfArrival) . " " . \application\components\Amadeus\Utils::formatTime($fd->flightInformation->productDateTime->timeOfArrival);
                $ts = null;
                if (isset($fd->technicalStop)) {
                    unset($tses);
                    foreach (\Utils::toArray($fd->technicalStop) as $technicalStop) {
                        $tses[] = $technicalStop->stopDetails[0]->locationId . ' ' .
                                \application\components\Amadeus\Utils::formatTime($technicalStop->stopDetails[0]->firstTime) . '-' .
                                \application\components\Amadeus\Utils::formatTime($technicalStop->stopDetails[1]->firstTime);
                    }
                    $ts = implode(', ', $tses);
                }
                $legs[] = [
                    'depart' => $depart,
                    'arrive' => $arrive,
                    'origin' => $fd->flightInformation->location[0]->locationId,
                    'destination' => $fd->flightInformation->location[1]->locationId,
                    'flight' => $fd->flightInformation->companyId->marketingCarrier . '-' . $fd->flightInformation->flightOrtrainNumber,
                    'traveTime' => Utils::convertSecToHoursMins(strtotime($arrive) - strtotime($depart)),
                    'aircraft' => $fd->flightInformation->productDetail->equipmentType,
                    'technicalStop' => $ts
                ];
            }
            $flights[$segmentRef][$gof->propFlightGrDetail->flightProposal[0]->ref] = $legs;
        }
    }
//echo Utils::dbg($flights);
//exit;
// Prepare taxes
    foreach ($res->recommendation as $recommend) {
        unset($passengers);
        foreach (Utils::toArray($recommend->paxFareProduct) as $pfp) {
            foreach (Utils::toArray($pfp->paxReference->traveller) as $traveler) {
                $key = $traveler->ref;
                if (isset($traveler->infantIndicator)) {
                    $key = count($passengers) + 1;
                }
                $passengers[$key]['type'] = $pfp->paxReference->ptc;
                $passengers[$key]['fare'] = $pfp->paxFareDetail->totalFareAmount;
                $passengers[$key]['taxes'] = $pfp->paxFareDetail->totalTaxAmount;
                $csd = Utils::toArray($pfp->paxFareDetail->codeShareDetails);
                $passengers[$key]['marketingCompany'][1] = $csd[0]->company;
                $passengers[$key]['marketingCompany'][2] = isset($csd[1]) ? $csd[1]->company : $csd[0]->company;
                $passengers[$key]['text'] = '';
                $passengers[$key]['remark'] = 'Refundable';
                $tax = new \Taxes;
                $checkSum = 0;

                foreach (Utils::toArray($pfp->paxFareDetail->monetaryDetails) as $md) {
                    if ($md->amountType != \application\components\Amadeus\Utils::TAX_TO_SKIP && $passengers[$key]['type'] != application\components\Amadeus\Utils::$paxTypes[TravelerType::TRAVELER_INFANT]) {
                        $passengers[$key]['text'] .= "{$md->amountType}: {$md->amount}<br>";
                        $tax->arrTaxes[\application\components\Amadeus\Utils::$taxesReformat[$md->amountType]] += $md->amount;
                        $checkSum += $md->amount;
                    }
                }
                foreach (\Utils::toArray($pfp->passengerTaxDetails->taxDetails) as $td) {
                    $passengers[$key]['text'] .= "{$td->type}: {$td->rate}<br>";
                    $tax->arrTaxes[\application\components\Amadeus\Utils::$taxesReformat[$td->type]] += $td->rate;
                    $checkSum += $td->rate;
                }

                // Remarks parsing
                foreach (\Utils::toArray($pfp->fare) as $fr) {
                    if ($fr->pricingMessage->freeTextQualification->textSubjectQualifier === 'PEN') {   // Only Penalties
                        if (in_array($fr->pricingMessage->freeTextQualification->informationType, \application\components\Amadeus\Utils::$rescheduleIds)) {   // Reschedule fee
                            $passengers[$key]['remark'] = "Fee: " . $fr->monetaryInformation->monetaryDetail->amount . " " . $fr->monetaryInformation->monetaryDetail->currency;
                        } elseif (in_array($fr->pricingMessage->freeTextQualification->informationType, \application\components\Amadeus\Utils::$nonRefundableIds)) { // Non refundable
                            $passengers[$key]['remark'] = "Non refundable";
                        } elseif ($fr->pricingMessage->freeTextQualification->informationType == \application\components\Amadeus\Utils::CHECK_PENALTY_RULES) { // Refundable with penalties
                            $passengers[$key]['remark'] = "Refundable Check rules";
                        } else { // Refundable
//                            $passengers[$key]['remark'] .= "{$fr->pricingMessage->freeTextQualification->informationType} {$fr->pricingMessage->freeTextQualification->textSubjectQualifier} " .
//                                    implode(' ', \Utils::toArray($fr->pricingMessage->description)) . "<br>";
                        }
                    }
                }

                if ($checkSum != $passengers[$key]['taxes']) {  // We have tax difference - adjust with Other type tax
                    $tax->arrTaxes[\Taxes::TAX_OTHER] = $passengers[$key]['taxes'] - $checkSum;
                }
                $passengers[$key]['arrTaxes'] = $tax->arrTaxes;
                foreach (Utils::toArray($pfp->fareDetails) as $fds) {
                    $segmentRef = $fds->segmentRef->segRef;
                    foreach (Utils::toArray($fds->groupOfFares) as $tmp) {
                        $passengers[$key]['fareBasis'][$segmentRef][] = $tmp->productInformation->fareProductDetail->fareBasis;
                        $passengers[$key]['bookingClass'][$segmentRef][] = $tmp->productInformation->cabinProduct->rbd;
                    }
                }
            }
        }

        unset($legs);
        foreach (Utils::toArray($recommend->segmentFlightRef) as $key => $ref) {
            $legs[$key]['total'] = 0;
            foreach (Utils::toArray($ref->referencingDetail) as $k => $refDetail) {
                switch ($refDetail->refQualifier) {

                    // Luggage group processing
                    case 'B':
                        $legs[$key]['luggageGroup'] = $refDetail->refNumber;
                        break;

                    // Segments processing
                    case 'S':
                        $legs[$key][$k + 1] = $refDetail->refNumber;
                        $legs[$key]['total'] += count($flights[$k + 1][$refDetail->refNumber]);
                        break;
                }
            }
        }
        $segments[] = ['legs' => $legs, 'passengers' => $passengers];
    }
//    echo Utils::dbg($segments);
//    exit;
//
    // Prepare the bags
    $bags = parseBags($res->serviceFeesGrp->freeBagAllowanceGrp);

    // Prepare the serviceCoverageInfoGrp
    $luggageGroups = parseLuggageGroups($res->serviceFeesGrp->serviceCoverageInfoGrp);
//    echo Utils::dbg($luggageGroups); exit;
    ?>
    <p class="well well-small alert-info">&nbsp;<i class="fa fa-search fa-lg"></i>&nbsp;&nbsp;Amadeus test V2 search results</p>
    <table class="table table-condensed table-bordered">
        <tr>
            <th>#</th>
            <th>Stops</th>
            <th class="alert-success">Luggage</th>
            <th>Departure</th>
            <th>Org</th>
            <th>Arrival</th>
            <th>Dst</th>
            <th>Flight</th>
            <th>Time</th>
            <th>Pax</th>
            <th>F.Basis</th>
            <th>Fare</th>
            <th>B. fare</th>
            <th>Taxes</th>
            <th class="alert-success">Remark</th>
        </tr>
        <?php
        $travelerCount = count($segments[0]['passengers']);
        $i = 1;
        foreach ($segments as $segment) {
            foreach ($segment['legs'] as $legs) {
                $firstRound = true;
                $luggage = $legs['luggageGroup'];
                foreach ($legs as $segRef => $leg) {
                    if ($segRef === 'total') {
                        $totalFlights = $leg;
                        continue;   // Skip the element with the total
                    }

                    // Luggage processing
                    if ($segRef === 'luggageGroup') {
                        continue;
                    }

                    $legsCount = count($flights[$segRef][$leg]);
                    $bookData = json_encode(getBookData($legs, $segment['passengers'], $flights, $model->category, reset($segment['passengers'])['marketingCompany'][1]), JSON_NUMERIC_CHECK);
//                exit;
                    if ($firstRound) {
                        ?>
                        <tr>
                            <td rowspan="<?php echo ($travelerCount * $totalFlights); ?>">
                                <?php
                                echo $i;
                                if ($activeCompanyId) {
                                    echo TbHtml::ajaxButton('Check', '/booking/amadeusCheck', [
                                        'type' => 'POST',
                                        'data' => [
                                            'data' => $bookData,
                                            'airSourceId' => $airSourceId,
                                            'Traveler' => 'js:function(){return $(\'[name^="Traveler["]\').serialize();}',
                                        ],
                                        'success' => 'js:function(data){
                                                var alert = \'<div class="alert" style="max-width:600px"><button type="button" class="close" data-dismiss="alert">&times;</button>\';
                                                $("#content").prepend(alert + data + "</div>");
                                            }'
                                            ], [
                                        'class' => 'btn-info btn-small',
                                        'style' => 'margin-bottom: 5px;margin-right: 5px;margin-left: 10px;',
                                    ]);

                                    echo TbHtml::button('Book', [
                                        'submit' => '/booking/amadeusBook',
                                        'class' => 'btn-warning btn-small',
                                        'style' => 'margin-bottom: 5px;margin-right: 5px;',
                                        "target" => "_blank",
                                        'params' => ['data' => $bookData, 'action' => 'book']]);
//                                    echo "<br>";
                                    echo TbHtml::button('Book&pay', [
                                        'submit' => '/booking/amadeusBook',
                                        'class' => 'btn-warning btn-small',
                                        'style' => 'margin-bottom: 5px;margin-right: 5px;',
                                        "target" => "_blank",
                                        'params' => ['data' => $bookData, 'action' => 'bookAndPay']]);
//                                    echo "<br>";
                                    echo TbHtml::button('fakeBook', [
                                        'submit' => '/booking/fakeBook',
                                        'class' => 'btn-warning btn-small',
                                        "target" => "_blank",
                                        'params' => ['data' => $bookData]]);
                                }
                                ?>
                            </td>
                            <?php
                        }
                        ?>
                        <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo ($legsCount - 1); ?></td>
                        <td rowspan="<?php echo ($travelerCount * $legsCount); ?>" class="alert-success"><?php echo $bags[$luggageGroups[$luggage][$segRef]]; ?></td>
                        <?php
                        $firstLeg = true;
                        foreach ($flights[$segRef][$leg] as $k => $flight) {
                            ?>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['depart']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php
                                echo $flight['origin'];
                                if (!empty($flight['technicalStop'])) {
                                    echo "<br>Via: {$flight['technicalStop']}";
                                }
                                ?>
                            </td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['arrive']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['destination']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['flight'] . "<br>Aircraft: {$flight['aircraft']}"; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['traveTime']; ?></td>
                            <?php
                            $firstPassenger = true;
                            foreach ($segment['passengers'] as $passenger) {
                                if (!$firstPassenger) {
                                    echo "<tr>";
                                }
                                if ($firstLeg && $firstRound) {
                                    ?>
                                    <td><?php echo $passenger['type']; ?></td>
                                    <td><?php echo $passenger['fareBasis'][$segRef][0] . " | " . $passenger['bookingClass'][$segRef][0] . " | " . $passenger['marketingCompany'][$segRef]; ?></td>
                                    <td><?php echo $passenger['fare']; ?></td>
                                    <td><?php echo ($passenger['fare'] - $passenger['taxes']); ?></td>
                                    <td>
                                        <?php
                                        $checkSum = 0;
                                        $cell = '';
                                        foreach ($passenger['arrTaxes'] as $key => $value) {
                                            if ($key !== Taxes::TAX_TOTAL_CORRECTION && $value != 0) {
                                                $cell .= "<tr><td>$key</td><td>$value<td></tr>";
                                                $checkSum += $value;
                                            }
                                        }
                                        $cell .= "<tr><td><b>Total</b></td><td><b>{$passenger['taxes']}</b></td></tr>";
                                        if ($checkSum != $passenger['taxes']) {
                                            $cell .= "<tr><td><b>Diff</b></td><td><b>" . ($passenger['taxes'] - $checkSum) . "</b></td></tr>";
                                        }
                                        echo \TbHtml::popover($passenger['taxes'], 'Taxes details', $cell);
                                        ?>
                                    </td>
                                    <td class="alert-success"><?php echo $passenger['remark']; ?></td>
                                    <?php
                                }
//                            elseif ($firstLeg) {
//                            }
                                else {
                                    echo "<td>{$passenger['type']}</td><td>{$passenger['fareBasis'][$segRef][$k]} | {$passenger['bookingClass'][$segRef][$k]} | {$passenger['marketingCompany'][$segRef]}</td><td colspan='4'></td>";
//                                echo "<td>{$passenger['type']}</td><td>{$passenger['fareBasis'][$segRef][$k]}</td><td colspan='3'></td>";
                                }
                                ?>
                            </tr>
                            <?php
                            $firstPassenger = false;
                        }
                        $firstLeg = false;
                    }
                    ?>
                    <?php
                    $firstRound = false;
                }
                $i++;
                ?>
                </tr>
                <tr><td colspan='15'></td></tr>
                <?php
            }
        }
        ?>
    </table>

    <?php
    $this->endWidget();
//    echo Utils::dbg($bags);
//    echo Utils::dbg($luggageGroups);
    flush();
    $localTest or $api->Security_SignOut();

    footer($start_timer);

    /**
     * Compose the data needed for the booking
     * @param array $legs
     * @param array $passagers
     * @param array $flights
     * @param int $cabinTypeId
     * @return array
     */
    function getBookData($legs, $passagers, $flights, $cabinTypeId, $marketingCompany) {

//        echo Utils::dbg($legs);
//        echo Utils::dbg($passagers);
//        echo Utils::dbg($flights);
//        exit;
        $out = array();
        foreach ($legs as $segRef => $leg) {
            if (in_array($segRef, ['total', 'luggageGroup'])) {
                continue;   // Skip the element with the total
            }
            foreach ($flights[$segRef][$leg] as $k => $flight) {
                $tmp = explode('-', $flight['flight']);
                $tmp2 = explode(' ', $flight['depart']);
                $out['segments'][$segRef][$k] = [
                    'origin' => $flight['origin'],
                    'destination' => $flight['destination'],
                    'depart' => $tmp2[0],
                    'flightNumber' => $tmp[1],
                    'marketingCompany' => $tmp[0],
                    'bookingClass' => $passagers[1]['bookingClass'][$segRef][$k],
                    'departTs' => $flight['depart'],
                    'arriveTs' => $flight['arrive'],
                ];
            }
        }
        foreach ($passagers as $passager) {
            $out['pax'][application\components\Amadeus\Utils::$paxTypeIds[$passager['type']]] = [
                'totalFare' => $passager['fare'],
                'type' => $passager['type'],
                'arrTaxes' => $passager['arrTaxes'],
                'fareBasis' => $passager['fareBasis'],
            ];
        }
        $out['cabinTypeId'] = $cabinTypeId;
        $out['marketingCompany'] = \Carrier::getIdFromCode($marketingCompany);

//    echo Utils::dbg($out);
//    echo Utils::dbg($flights);
        return $out;
    }

    function parseBags($freeBagAllowanceGrp) {
        $out = [];
        foreach (\Utils::toArray($freeBagAllowanceGrp) as $element) {
            if ($element->freeBagAllownceInfo->baggageDetails->quantityCode == 'N') {
                $suffix = ' bags';
            } else {
                if ($element->freeBagAllownceInfo->baggageDetails->unitQualifier == 'K') {
                    $suffix = ' kg.';
                } else {
                    $suffix = ' lb.';
                }
            }
            $out[$element->itemNumberInfo->itemNumberDetails->number] = $element->freeBagAllownceInfo->baggageDetails->freeAllowance . $suffix;
        }
        array_walk($out, function (&$value) {
            if ($value[0] == '1') {
                $value = rtrim($value, 's');
            }
        });
        return $out;
    }

    function parseLuggageGroups($serviceCoverageInfoGrp) {
        $out = [];
        foreach (\Utils::toArray($serviceCoverageInfoGrp) as $element) {
            foreach (\Utils::toArray($element->serviceCovInfoGrp) as $scig) {
                foreach (\Utils::toArray($scig->coveragePerFlightsInfo) as $cpfi) {
                    $out[$element->itemNumberInfo->itemNumber->number][$cpfi->numberOfItemsDetails->refNum] = $scig->refInfo->referencingDetail->refNumber;
                }
            }
        }
        return $out;
    }
    ?>
</div>
<style>
    .table td, .table th {
        text-align: center;
        vertical-align: middle;
    }
</style>