<?php

set_time_limit(36000); //10 hours

/**
 * Support commands
 */
class TestCommand extends CConsoleCommand {

    private $start_timer;
    private $txtHelp = array(
        "\nTest utility usage:",
        "getAmadeusPnr <pnr> - Get info about the existing Amadeus pnr",
        "aquireAmadeusPnr <pnr> - Get info about the existing Amadeus pnr and insert it into our DB",
        "cancelAmadeusPnr <pnr> - Get info about the existing Amadeus pnr",
        "fixAirRoutesOrder <airCartId> - Fix the order of all the AirRoutes attached to AirBookings members of the AirCart",
        "cancelAirCart <airCartId> - Cancel specific AirCart with the air supplier",
        "testGalileoPnr Test Galileo PNR creation in test enviroment with fixed parameters",
        "GalileoPnrRetrieve Galileo PNR retrieve in test enviroment",
        "GalileoPnrAcquisitionTest Galileo PNR acquisition test",
        "PnrListImport Import PNRs and save them in specific dir for latter tests",
        "GalileoTicketPrinterDisplay Ticket printer display",
        "ccAndBinListUpdates Reformat the CC numbers encryption and obtain relevant BinList data",
        "checkAirlineImages check Airline images",
        "filterDateTest Test the dates filter matching",
        "filterFlightNumberTest Test the flight numbers filter matching",
        "deepLink100Searches Send 100 DeepLink requests",
    );

    static function pnrCreate() {
        $test = new \application\components\Spicejet\PnrManagement;
        $test->test();
    }

    static function filterDateTest() {
        Yii::import('application.models.CommercialFilter', true);
        $dates = [
            '2014/12/02',
            '2014/12/01, 2014/12/02, 2014/12/03',
            '2014/09/01 - 2014/11/02, 2014/11/03 - 2014/12/30',
            '2014/12/02 - 2014/12/22',
            '2014/12/01 - 2014/12/02',
            '2014/12/2',
            '2014/09/01 - 2014/10/02, 2014/12/03',
            '2014/09/01-2014/11/02, 2014/11/03-2014/11/30',
        ];
        $tests = [
            '2014-12-02 12:12:14',
            '2014-12-02',
            '2014-12-03',
            '2014-12-20',
        ];
        foreach ($tests as $test) {
            echo "---=== Testing with: $test ===---\n";
            foreach ($dates as $value) {
                echo "$value => " . (int) \CommercialFilterElements::dateMatch($value, $test) . "\n";
            }
        }
    }

    static function filterFlightNumberTest() {
        Yii::import('application.models.CommercialFilter', true);
        $filters = [
            '1234',
            '1234, 1235, 1236',
            '123 - 1235, 2236-3000',
            '123 - 1235',
            '3211',
            '3211-4000',
            '3211-4000,5000-6000',
        ];
        $tests = [
            ['6E-1234'],
            ['6E-1234', '6E-1235', '6E-1236'],
            ['GG-123', '6E-7235', '6E-7236'],
            ['6E-7236'],
        ];
        foreach ($tests as $test) {
            echo "---=== Testing with: " . implode('|', $test) . " ===---\n";
            foreach ($filters as $value) {
                echo "$value => " . (int) \CommercialFilterElements::flightMatch($value, $test) . "\n";
            }
        }
    }

    static function checkAirlineImages() {
        $carriers = \Carrier::model()->findAll(['order' => 'id']);
        $i = 1;
        /* @var $carriers \Carrier[] */
        foreach ($carriers as $carrier) {
            $img = dirname(Yii::app()->basePath) . "/img/air_logos/{$carrier->code}.png";
            if (!file_exists($img)) {
                $imgUrl = "http://www.kayak.com/images/air/{$carrier->code}.png";
//                echo "$i.\tNot found: $img => $imgUrl\n";
                echo "$i.\tMissing: {$carrier->code} ";
                $content = file_get_contents($imgUrl);
                if ($content === FALSE) {
                    echo "Not found in Kayak\n";
                } else {
                    $img = str_replace('*', '_', $img);
                    file_put_contents($img, $content);
                    echo "GOT IT!\n";
//                    echo "Kayak has it!\n";                    
                }

                $i++;
            }
        }
    }

    static function ccAndBinListUpdates() {
        $ccs = Cc::model()->findAll();
        /* @var $ccs Cc[] */
        foreach ($ccs as $cc) {
            $oldNumber = \Utils::decrypt($cc->number);
            if (ctype_digit($oldNumber)) {  // Old encryption type
                $cc->mask = Cc::ccMask($oldNumber);
                $cc->bin_id = substr($oldNumber, 0, 6);
                BinList::insertIfMissing($cc->bin_id);
                $cc->number = Cc::encode($oldNumber);
                $cc->save(false);
                echo "Converted card: $cc->id with bin: $cc->bin_id \n";
            }
        }
    }

    static function getAmadeusPnr($pnr) {
        echo "\nStarting " . __METHOD__ . " , parameter: $pnr\n";
        $api = new \application\components\Amadeus\test\AmadeusWebServices2;
        $api->Security_Authenticate(\application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID);
        print_r($api->getPnr($pnr));
        print_r($api->getTicket());
//        Utils::soapDebug($api);
        $api->Security_SignOut();
    }

    static function cancelAirCart($airCartId) {
        $airCart = \AirCart::model()->findByPk($airCartId);
        /* @var $airCart AirCart */
        if (!$airCart || empty($airCart->airBookings)) {
            echo "This cart do not have bookings or can't be found";
            Yii::app()->end();
        }
        $airCart->cancelAtTheAirSource();
    }

    static function fixAirRoutesOrder($airCartId) {
        $airCart = \AirCart::model()->with([
                    'airBookings' => ['order' => '"airBookings".departure_ts'],
                    'airBookings.airRoutes' => ['order' => '"airRoutes".departure_ts']
                ])->findByPk($airCartId);

        if (!$airCart || empty($airCart->airBookings)) {
            echo "This cart do not have bookings or can't be found";
            Yii::app()->end();
        }
        foreach ($airCart->airBookings as $airBooking) {
            echo "Processing airBooking: {$airBooking->id}\n";
            $airBooking->setAirRoutesOrder();
        }
        echo "Done\n";
    }

    static function aquireAmadeusPnr($pnrStr) {
        echo "\nStarting " . __METHOD__ . " , parameter: $pnrStr\n";

        // Testing parameters
        $test = false;
        $pnrStr = '6HP4IV';
        $pnrStr = '6HAJRU';
        $testUserInfoId = 585;
        $tonyId = 2;

        if ($test) {
            $pnr = Utils::fileToObject('pnr_structure.json');
            $tickets = Utils::fileToObject('tickets_structure.json');
        } else {
            $api = new \application\components\Amadeus\test\AmadeusWebServices2;
            $api->Security_Authenticate(\application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID);
            $pnr = $api->getPnr($pnrStr);
            Utils::objectToFile('pnr_structure.json', $pnr);
            $tickets = $api->getTicket();
            Utils::objectToFile('tickets_structure.json', $tickets);
//        Utils::soapDebug($api);
            $api->Security_SignOut();
        }
//        print_r($pnr);
//        print_r($tickets);
        $passengers = array();
        $infants = array();
        foreach (Utils::toArray($pnr->travellerInfo) as $ti) {
            unset($infant);
            $passenger = new Traveler;
            $passenger->user_info_id = $testUserInfoId;
            $refNumber = $ti->elementManagementPassenger->reference->number;
//            if($ti->passengerData->travellerInformation->traveller->quantity == 2) {
            // We have infants attached
//            }
            foreach (Utils::toArray($ti->passengerData) as $key => $tiPd) {
                if ($key === 0) {   // The first passenger
                    $passenger->last_name = $tiPd->travellerInformation->traveller->surname;
                    // Do we have infant with same traveler and 2 passenger structures?
                    if (is_array($tiPd->travellerInformation->passenger)) {
                        // Add the adult
                        list($passenger->first_name, $title) = \application\components\Amadeus\Utils::splitNameAndTitle($tiPd->travellerInformation->passenger[0]->firstName);
                        $type_id = \application\components\Amadeus\Utils::$paxTypeIds[$tiPd->travellerInformation->passenger[0]->type];
                        $passenger->traveler_title_id = TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = ['id' => $passenger->insertIfMissing(), 'type' => $type_id, 'refNumber' => $refNumber];
                        // Add the infant - second array element
                        $infant = new Traveler;
                        $infant->user_info_id = $testUserInfoId;
                        $infant->last_name = $passenger->last_name;
                        list($infant->first_name, $title) = \application\components\Amadeus\Utils::splitNameAndTitle($tiPd->travellerInformation->passenger[1]->firstName);
                        $passenger->traveler_title_id = TravelerTitle::TITILE_INFANT;
                        $infant->birthdate = \application\components\Amadeus\Utils::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                        $infants[$refNumber] = ['id' => $infant->insertIfMissing(), 'type' => TravelerType::TRAVELER_INFANT, 'refNumber' => $refNumber];
                    } else {    // The passenger structure is not array
                        list($passenger->first_name, $title) = \application\components\Amadeus\Utils::splitNameAndTitle($tiPd->travellerInformation->passenger->firstName);
                        $type_id = \application\components\Amadeus\Utils::$paxTypeIds[$tiPd->travellerInformation->passenger->type];
                        $passenger->traveler_title_id = TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = ['id' => $passenger->insertIfMissing(), 'type' => $type_id, 'refNumber' => $refNumber];
                    }
//                    print_r($passenger->attributes);
                } else {    // The second passenger - infant
                    $infant = new Traveler;
                    $infant->user_info_id = $testUserInfoId;
                    $infant->last_name = $tiPd->travellerInformation->traveller->surname;
                    list($infant->first_name, $title) = explode(' ', $tiPd->travellerInformation->passenger->firstName);
                    $passenger->traveler_title_id = TravelerTitle::TITILE_INFANT;
                    $infant->birthdate = \application\components\Amadeus\Utils::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                    $infants[$refNumber] = ['id' => $infant->insertIfMissing(), 'type' => TravelerType::TRAVELER_INFANT, 'refNumber' => $refNumber];
//                    print_r($infant->attributes);
                }
            }
        }
        print "\nTravelers: " . print_r($passengers, true);
        print "\nInfants: " . print_r($infants, true);

        // Itinerary aquisition
        if (!isset($pnr->originDestinationDetails)) {
            echo "This PNR is cancelled - there is no Itinerary\n";
            return;
        }
        $itineraryInfos = array();
        foreach (Utils::toArray($pnr->originDestinationDetails->itineraryInfo) as $itineraryInfo) {
            $airRoute = new AirRoutes;
//            $airRoute->air_booking_id = $airBooking->id;
            $airRoute->source_id = Airport::getIdFromCode($itineraryInfo->travelProduct->boardpointDetail->cityCode);
            $airRoute->destination_id = Airport::getIdFromCode($itineraryInfo->travelProduct->offpointDetail->cityCode);
            $airRoute->departure_ts = \application\components\Amadeus\Utils::formatDate($itineraryInfo->travelProduct->product->depDate) . " " . \application\components\Amadeus\Utils::formatTime($itineraryInfo->travelProduct->product->depTime);
            $airRoute->arrival_ts = \application\components\Amadeus\Utils::formatDate($itineraryInfo->travelProduct->product->arrDate) . " " . \application\components\Amadeus\Utils::formatTime($itineraryInfo->travelProduct->product->arrTime);
            $airRoute->order_ = null;
            if (isset($itineraryInfo->flightDetail->departureInformation->departTerminal)) {
                $airRoute->source_terminal = $itineraryInfo->flightDetail->departureInformation->departTerminal;
            }
            $airRoute->carrier_id = Carrier::getIdFromCode($itineraryInfo->travelProduct->companyDetail->identification);
            $airRoute->flight_number = $itineraryInfo->travelProduct->productDetails->identification;
            $airRoute->booking_class = $itineraryInfo->travelProduct->productDetails->classOfService;

            $itineraryInfos[$itineraryInfo->elementManagementItinerary->reference->number] = $airRoute;
        }

        foreach ($itineraryInfos as $key => $value) {
//            echo "Key=>$key\t".print_r($value->attributes, true);
        }

        // Connected segments
        foreach (Utils::toArray($pnr->segmentGroupingInfo) as $segmentGroupingInfo) {
            if ($segmentGroupingInfo->groupingCode != \application\components\Amadeus\Utils::CONNECTED_SEGMENTS_MARRIAGE_INDICATOR) {
                continue;   // Scik marrigaes that do not show connected segments
            }
            unset($segment);
            foreach (Utils::toArray($segmentGroupingInfo->marriageDetail) as $md) {
                $segment['legs'][] = $md->tatooNum;
                // Set the order of the airRoutes in the airBooking object
                $itineraryInfos[$md->tatooNum]->order_ = count($segment['legs']);
//                $itineraryInfos[$md->tatooNum]->air_booking_id = count($segment);
            }
            $legsLastKey = count($segment['legs']) - 1;
            $segment['airBooking']['source_id'] = $itineraryInfos[$segment['legs'][0]]->source_id;
            $segment['airBooking']['destination_id'] = $itineraryInfos[$segment['legs'][$legsLastKey]]->destination_id;
            $segment['airBooking']['departure_ts'] = $itineraryInfos[$segment['legs'][0]]->departure_ts;
            $segment['airBooking']['arrival_ts'] = $itineraryInfos[$segment['legs'][$legsLastKey]]->arrival_ts;
            $segments[] = $segment;
        }
        print_r($segments);

        foreach ($itineraryInfos as $key => $value) {
//            echo "Key=>$key\t".print_r($value->attributes, true);
        }

        if (isset($tickets->applicationError->errorText->errorFreeText)) {
            echo "\nTickets error: {$tickets->applicationError->errorText->errorFreeText}\n";
            return false;
        }

        // Process the fares data from the ticket
        foreach (Utils::toArray($tickets->fareList) as $fareList) {
            unset($fare);
            // Totals
            foreach ($fareList->fareDataInformation->fareDataSupInformation as $fdsi) {
                switch ($fdsi->fareDataQualifier) {
                    case 'B':   // Base fare
                        $fare['baseFare'] = $fdsi->fareAmount;
                        break;
                    case '712':   // Base fare
                        $fare['totalFare'] = $fdsi->fareAmount;
                        break;
                }
            }
            // Taxes splitting
            $tax = new Taxes;
            foreach (Utils::toArray($fareList->taxInformation) as $ti) {
                $fare['fares'][$ti->taxDetails->taxType->isoCountry] = $ti->amountDetails->fareDataMainInformation->fareAmount;
                if (array_key_exists($ti->taxDetails->taxType->isoCountry, \application\components\Amadeus\Utils::$taxesReformat)) {
                    $tax->arrTaxes[\application\components\Amadeus\Utils::$taxesReformat[$ti->taxDetails->taxType->isoCountry]] += (float) $ti->amountDetails->fareDataMainInformation->fareAmount;
                } else {
                    $tax->arrTaxes[Taxes::TAX_OTHER] += (float) $ti->amountDetails->fareDataMainInformation->fareAmount;
                }
            }
            $fare['faresReformated'] = $tax->arrTaxes;
            // Segments association
            foreach (Utils::toArray($fareList->segmentInformation) as $si) {
                $fare['segments'][$si->segmentReference->refDetails->refNumber] = $si->fareQualifier->fareBasisDetails->primaryCode . $si->fareQualifier->fareBasisDetails->fareBasisCode;
                $itineraryInfos[$si->segmentReference->refDetails->refNumber]->fare_basis = $si->fareQualifier->fareBasisDetails->primaryCode . $si->fareQualifier->fareBasisDetails->fareBasisCode;
            }
            $fare['note'] = $fareList->otherPricingInfo->attributeDetails->attributeDescription;
            $fare['tstFlag'] = $fareList->statusInformation->firstStatusDetails->tstFlag;

            // Assign the fares to the travelers
            foreach (Utils::toArray($fareList->paxSegReference->refDetails) as $psr) {
                unset($fare['pax']);
                if ($psr->refQualifier == "PI") {   // Infant
                    $infants[$psr->refNumber]['fare'] = $fare;
                } else {    // Adult
                    $passengers[$psr->refNumber]['fare'] = $fare;
                }
                $fare['pax'][] = ['paxRef' => $psr->refNumber, 'paxType' => $psr->refQualifier];
            }

            $fares[] = $fare;
        }
        foreach ($itineraryInfos as $key => $value) {
            echo "Key=>$key\t" . print_r($value->attributes, true);
        }

        print_r($fares);
        print "\nTravelers: " . print_r($passengers, true);
        print "\nInfants: " . print_r($infants, true);

//        exit;
        // Fill up and create the AirCart, AirBooking(s) and all the AirRoutes objects
        $airCart = new AirCart;
        $airCart->user_id = $testUserInfoId;        // Utils::getActiveUserId();
        $airCart->loged_user_id = $tonyId;          // Utils::getLoggedUserId();
        $airCart->payment_status_id = PaymentStatus::STATUS_NOT_CHARGED;
        $airCart->booking_status_id = BookingStatus::STATUS_NEW;
        $airCart->approval_status_id = ApprovalStatus::STATUS_NOT_REQUIRED;
        $airCart->note = 'Test of pnr acquisition from Amadeus';
        $airCart->insert();
        echo "Created new airCart => {$airCart->id}\n";

        foreach (array_merge($passengers, $infants) as $passenger) {
            // Skip this passenger if there are no fares defined
            if (empty($passenger['fare'])) {
                continue;
            }
            foreach ($segments as $segNum => $segment) {
                $airBooking = new AirBooking;
                $airBooking->airline_pnr = $pnrStr;
                $airBooking->crs_pnr = $pnrStr;
                $airBooking->booking_type_id = BookingType::MANUAL_BY_PNR;
                $airBooking->air_source_id = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID;
                $airBooking->traveler_type_id = $passenger['type'];
                $airBooking->traveler_id = $passenger['id'];
//                $itineraryInfos = Utils::toArray($odd->itineraryInfo);
                $airBooking->source_id = $segment['airBooking']['source_id'];
                $legsCount = count($itineraryInfos) - 1;
                $airBooking->destination_id = $segment['airBooking']['destination_id'];
                $airBooking->carrier_id = $itineraryInfos[$segment['legs'][0]]->carrier_id;
                $airBooking->departure_ts = $segment['airBooking']['departure_ts'];
                $airBooking->arrival_ts = $segment['airBooking']['arrival_ts'];
                $airBooking->service_type_id = ServiceType::getServiceType($airBooking->source_id, $airBooking->destination_id);
                $airBooking->fare_basis = $itineraryInfos[$segment['legs'][0]]->fare_basis;
                $airBooking->booking_class = $itineraryInfos[$segment['legs'][0]]->booking_class;
                $airBooking->fare_type_id = FareType::getFareType($airBooking->carrier_id, $airBooking->booking_class);
                $airBooking->air_cart_id = $airCart->id;
                // Fill up the fares data for the first segment
                if ($segNum === 0) {
                    $airBooking = Taxes::fillTaxesInAirBooking($airBooking, $passenger['fare']['faresReformated']);
                    $airBooking->basic_fare = $passenger['fare']['baseFare'];
                }

                $airBooking->insert();
                echo "Created new airBooking => {$airBooking->id}\n";
//                print_r($airBooking->attributes);
//                exit;

                foreach ($segment['legs'] as $legId) {
                    $airRoute = new AirRoutes;
                    $airRoute->attributes = $itineraryInfos[$legId]->attributes;
                    $airRoute->air_booking_id = $airBooking->id;
                    $airRoute->insert();
                    echo "Created new airRoute => {$airRoute->id}\n";
//                    print_r($airRoute->attributes);
                }
            }
        }
    }

    static function cancelAmadeusPnr($pnr) {
        echo "\nStarting " . __METHOD__ . " , parameter: $pnr\n";
        $api = new \application\components\Amadeus\test\AmadeusWebServices2;
        print_r($api->cancelPnr($pnr, \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID));
//        Utils::soapDebug($api);
    }

    static function testGalileoPnr() {
        $test = new \application\components\Galileo\PnrManagement;
        echo $test->test();
    }

    static function GalileoPnrRetrieve() {
        application\components\Galileo\PnrManagement::testRetrieve('BRW01G');
    }

    static function GalileoPnrCancel() {
        application\components\Galileo\PnrManagement::testCancel('BRW01G');
    }

    static function GalileoTicketPrinterDisplay() {
        $api = new \application\components\Galileo\PnrManagement();
        $api->connect(NULL, [], application\components\Galileo\Utils::DEFAULT_GALILEO_PRODUCTION_ID);
        print_r($api->displayPrinters());
        print_r($api->linkPrinter());
        print_r($api->displayPrinters());
    }

    static function PnrListImport() {
        $list = [
            'HB5VWA',
            'N3BMUY',
            'G9G22Q',
        ];

        $pnrManage = new application\components\Indigo\PnrManagement();
        $pnrManage->connect('production', [], \application\components\Indigo\Utils::PRODUCTION_AIRSOURCE_ID);

        $i = 1;
        foreach ($list as $strPnr) {
            echo "$i.\tGetting $strPnr\n";
            $i++;
            $pnrManage->retrievePnr($strPnr);
            \Utils::objectToFile(__DIR__ . '/../tmp/indigoPnrs/' . $strPnr . '.json', $pnrManage->pnrResponseObj);
        }
    }

    static function pnrAcquisitionTest() {
        $test = new application\components\Indigo\PnrAcquisition(\Utils::fileToObject(Yii::app()->basePath . '/../indigo_pnr_structure.json'), application\components\Indigo\Utils::PRODUCTION_AIRSOURCE_ID);
        $test->test();
        echo "--------\n" . \TravelerTitle::extractTitleFromNameEnd('Ms.');
        return;

        $list = [
            'JERVMR',
            'N4CSKF',
            'RY5J8Q',
            'UCV69X',
        ];

        $list = [
//            'HB5VWA',
//            'N3BMUY',
//            'G9G22Q',
            'H7B7MW'
        ];

//        foreach ($list as $strPnr) {
//            $filename = __DIR__ . '/../tmp/spicejetPnrs/' . $strPnr . '.json';
//            $test = new application\components\Spicejet\PnrAcquisition(\Utils::fileToObject($filename), application\components\Spicejet\Utils::TEST_AIRSOURCE_ID);
//            $test->test();
//        }
    }

    function run($args) {
        $this->start_timer = microtime(true);

        if (empty($args) || !method_exists(__CLASS__, $args[0])) {
            echo implode("\n\t", $this->txtHelp);
            $this->footer();
            Yii::app()->end();
        }

        if (isset($args[1])) {
            call_user_func('static::' . $args[0], $args[1]);
        } else {
            call_user_func('static::' . $args[0]);
        }
        $this->footer();
    }

    static function memoryUsage() {
        $mem_usage = memory_get_peak_usage(true);
        if ($mem_usage < 1024)
            return $mem_usage . " bytes";
        elseif ($mem_usage < 1048576)
            return round($mem_usage / 1024, 2) . "k";
        else
            return round($mem_usage / 1048576, 2) . "MB";
    }

    function footer() {
        print "\n\nTimestamp: " . date(DATETIME_FORMAT) . ", Class: " . __CLASS__ . ", Time used: " . round((microtime(true) - $this->start_timer), 2) . " sec. , Memory used: " . self::memoryUsage() . "\n";
    }

    static function testAirQueue() {
        $data = [
            ['DEL', 'BOM', 'AI', 20],
            ['DEL', 'BOM', 'AI', 21],
            ['DEL', 'BOM', 'LH', 21],
            ['SOF', 'BLR', 'LH', 21],
        ];

        foreach ($data as $values) {
            echo "Testing: " . implode(' | ', $values) . "\n";
            $res = \AirsourceQueue::findQueue($values[0], $values[1], $values[2], $values[3]);
            echo "Result: " . implode(' | ', $res);
//            print_r($res);
            echo "\n===============================\n";
        }
    }

    static function deepLink100Searches($timeout = 25) {
        $test = new application\components\client_sources\DeepLink\Test('https://slave1.belair.in');
        $test->send100($timeout);
    }

}

?>
