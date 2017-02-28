<?php

namespace application\components\Amadeus;

/**
 * Amadeus Utils
 *
 * @author Tony
 */
class Utils {

    const TAX_TO_SKIP = 'Q';
    const DEFAULT_AIRSOURCES_TEST_ID = 25;
    const TEST_V2_ID = 46;
    const PROD_V2_ID = 48;
    const DEFAULT_AIRSOURCES_PRODUCTION_ID = 27;
    const CONNECTED_SEGMENTS_MARRIAGE_INDICATOR = 'CNX';
    const FREQUENT_FLYER_INDICATOR = 'FQTV';
    const PRIVATE_FARE_INDICATOR = '*F*';
    const AMADEUS_SLEEP_TIME = 3;
    const AMADEUS_REPEAT_ISSUE_TICKET_OPERATION = 3;
    const AMADEUS_MAX_SEARCH_RESULTS = 50;

    /**
     *
     * 70 TICKETS ARE NON-REFUNDABLE<br>
     * 71 TKTS ARE NON-REFUNDABLE AFTER DEPARTURE<br>
     * 72 TKTS ARE NON-REFUNDABLE BEFORE DEPARTURE<br>
     * 73 PENALTY APPLIES<br>
     * 74 PERCENT PENALTY APPLIES<br>
     * 75 PENALTY APPLIES - CHECK RULES<br>
     * @var array
     */
    static $nonRefundableIds = [70, 72];
    static $rescheduleIds = [73, 74];

    const CHECK_PENALTY_RULES = 75;

    /**
     * Format the time string
     * @param string $str Formated like 1230
     * @return string
     */
    static function formatTime($str) {
        return substr($str, 0, 2) . ":" . substr($str, 2, 2);
    }

    /**
     * Format the date string
     * @param string $str Formated like 250714
     * @return string
     */
    static function formatDate($str) {
        return "20" . substr($str, 4, 2) . "-" . substr($str, 2, 2) . "-" . substr($str, 0, 2);
    }

    /**
     * Format the date string from infants
     * @param string $str Formated like 25072014
     * @return string
     */
    static function formatInfantDate($str) {
        return substr($str, 4, 4) . "-" . substr($str, 2, 2) . "-" . substr($str, 0, 2);
    }

    static function formatInfantDateFromCode($str) {
        return date(DATE_FORMAT, strtotime("20" . substr($str, 10, 2) . "-" . substr($str, 7, 3) . "-" . substr($str, 5, 2)));
    }

    /**
     * Format the date string for use by Amadeus
     * @param string $str Formated like 2014-07-25
     * @return string
     */
    static function toAmadeusDate($str) {
        return date("dmy", strtotime($str));
    }

    /**
     * Format the time string for use by Amadeus (1435 in this case)
     * @param string $str Formated like 2014-07-25 14:35:22
     * @return string
     */
    static function toAmadeusTime($str) {
        return date("Hi", strtotime($str));
    }

    static $taxesReformat = [
        'YQ' => \Taxes::TAX_YQ,
        'Q' => \Taxes::TAX_YQ,
        'YR' => \Taxes::TAX_YQ,
        'IN' => \Taxes::TAX_UDF,
        'YM' => \Taxes::TAX_UDF,
        'JN' => \Taxes::TAX_JN,
        'WO' => \Taxes::TAX_PSF,
    ];
    static $paxTypes = [
        \TravelerType::TRAVELER_ADULT => 'ADT',
//        \TravelerType::TRAVELER_CHILD => 'CH',
        \TravelerType::TRAVELER_CHILD => 'CHD',
        \TravelerType::TRAVELER_INFANT => 'INF',
    ];
    static $paxTypeIds = [
        'ADT' => \TravelerType::TRAVELER_ADULT,
        'CHD' => \TravelerType::TRAVELER_CHILD,
        'CH' => \TravelerType::TRAVELER_CHILD,
        'INF' => \TravelerType::TRAVELER_INFANT
    ];
    static $airSellStatusCode = [
        '700' => 'no active itinerary',
        '701' => 'Coupon notification',
        '702' => 'Active* (*To indicate the queue is designated for use whether it currently has any items. When not present, the default status is non-active)',
        '703' => 'Queue placement is inhibited',
        '704' => 'Queue level notificationAir_SellFromRecommendation 05',
        '705' => 'Queue being printed',
        '706' => 'Sub-queue present',
        '707' => 'On hold',
        'A' => 'Add',
        'AC' => 'Accrual',
        'AL' => 'Aiport control',
        'ALL' => 'Allocated',
        'AVA' => 'Available',
        'B' => 'Flown/used',
        'BD' => 'Boarded',
        'C' => 'Change',
        'CK' => 'Checked in',
        'CLO' => 'Closed',
        'D' => 'Reprint',
        'DB' => 'Deboarded',
        'DN' => 'Denied boarding',
        'E' => 'Exchanged/reissued',
        'F' => 'Critical free text',
        'G' => 'Non air segment',
        'I' => 'Original Issue (Open for Use)',
        'IF' => 'Information only',
        'INU' => 'In use',
        'IO' => 'Irregular operations',
        'K' => 'Confirmed, effective, working, firm, etc',
        'LIM' => 'Limitations on use',
        'NAV' => 'Not available',
        'NC' => 'Not checked in',
        'NS' => 'Infant, no seat',
        'OF' => 'Offloaded',
        'OK' => 'Confirmed',
        'OLD' => 'Replaced item',
        'OPE' => 'Open',
        'P' => 'Provisional, draft proposed subject to change, etc',
        'PAV' => 'Partial Availability - Specified sub-elements only',
        'PE' => 'Print Exchange',
        'PR' => 'Printed',
        'PRF' => 'PreferredAmadeus Programming Interface',
        'PRP' => 'Proposed/Intended Allocation',
        'R' => 'Request',
        'RD' => 'Redemption',
        'REP' => 'Replacement',
        'REV' => 'Revised',
        'RF' => 'Refunded',
        'RQ' => 'Requested',
        'S' => 'Suspended',
        'SA' => 'Space Available',
        'SB' => 'Standby',
        'SRV' => 'Serviceable',
        'T' => 'Ticketed',
        'UNS' => 'Unserviceable',
        'V' => 'Void',
        'WL' => 'Waitlisted',
        'X' => 'Cancel',
    ];
    static $mealTypes = array(
        'AVML' => 'VEGETARIAN HINDU MEAL',
        'BBML' => 'BABY MEAL',
        'BLML' => 'BLAND MEAL',
        'CHML' => 'CHILD MEAL',
        'CNML' => 'CHICKEN MEAL (LY SPECIFIC)',
        'DBML' => 'DIABETIC MEAL',
        'FPML' => 'FRUIT PLATTER MEAL',
        'GFML' => 'GLUTEN INTOLERANT MEAL',
        'HNML' => 'HINDU (NON VEGETARIAN) MEAL SPECIFIC',
        'IVML' => 'INDIAN VEGETARIAN MEAL (UA SPECIFIC)',
        'JPML' => 'JAPANESE MEAL (LH SPECIFIC)',
        'KSML' => 'KOSHER MEAL',
        'LCML' => 'LOW CALORIE MEAL',
        'LFML' => 'LOW FAT MEAL',
        'LSML' => 'LOW SALT MEAL',
        'MOML' => 'MOSLEM MEAL',
        'NFML' => 'NO FISH MEAL (LH SPECIFIC)',
        'NLML' => 'LOW LACTOSE MEAL',
        'OBML' => 'JAPANESE OBENTO MEAL (UA SPECIFIC)',
        'RVML' => 'VEGETARIAN RAW MEAL',
        'SFML' => 'SEA FOOD MEAL',
        'SPML' => 'SPECIAL MEAL, SPECIFY FOOD',
        'VGML' => 'VEGETARIAN VEGAN MEAL',
        'VJML' => 'VEGETARIAN JAIN MEAL',
        'VOML' => 'VEGETARIAN ORIENTAL MEAL',
        'VLML' => 'VEGETARIAN LACTO-OVO MEAL'
    );
    static $specialRequests = [
        'BSCT',
        'WCHR',
        'DOCS',
    ];
    static $seatlRequests = [
        'RQST',
        'NSST',
        'SMST',
        'NSSB',
        'SMSB',
        'NSSA',
        'NSSW',
        'SMSA',
        'SMSW',
    ];

    static function splitNameAndTitle($firstName) {
        if (strstr($firstName, ' ')) {
            $names = explode(' ', $firstName);
            $title = array_pop($names);
            $first_name = implode(' ', $names);
        } else {
            $first_name = $firstName;
            $title = '';
        }
        return [$first_name, $title];
    }

    /**
     * PNR resync. Attributes to be resynced are:
     * <li> - Cancelled / Active
     * <li> - Air PNRs - not applicable to the LLCs
     * <li> - Tickets
     * <li> - Meals
     * <li> - Seats
     * <li> - Endorsments
     * @param int $airCartId ID of the air cart that holds the airBookings
     * @param int $airSourceId ID of the air source used to book the pnr
     * @param string $pnrCode The pnr to be synced
     */
    static function resyncPnr($airCartId, $airSourceId, $pnrCode) {
        $airCart = \AirCart::model()->with([
                    'airBookings' => ['order' => '"airBookings".departure_ts'],
                    'airBookings.airRoutes' => ['order' => '"airRoutes".departure_ts'],
                    'airBookings.traveler',
                ])->findByPk($airCartId);
        /* @var $airCart \AirCart */
        if (!$airCart || empty($airCart->airBookings)) {
            return ['error' => "This cart do not have bookings or can't be found"];
        }
//        echo print_r($airCart,true);
        // Testing parameters
        $test = false;   // 112 - Y9RTQF - HXCCMW - 589-5454232033/4/6/7/8
        if ($test) {
            $pnr = \Utils::fileToObject('pnr_structure.json');
        } else {
            $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
            $api = new $airSource->backend->api_source;
            $api->Security_Authenticate($airSourceId);
//            $pnr = $api->getPnr($airCart->airBookings[0]->crs_pnr);
            $pnr = $api->getPnr($pnrCode);
            // If string is returned , than this is a error
            if (is_string($pnr)) {
                $api->Security_SignOut();
                return ['error' => $pnr];
            }
            if (YII_DEBUG) {
                \Utils::objectToFile('pnr_structure.json', $pnr);
            }
            $rulesApi = new MiniRules($airSourceId, $api, $pnr);
            $rulesRaw = $rulesApi->getInfo();
            $api->Security_SignOut();
        }
        if (!isset($pnr->originDestinationDetails)) {  // This PNR is cancelled
//            $airCart->cancel();   // For now we do not carry the automatic cancellation.
            if ($airCart->booking_status_id === \BookingStatus::STATUS_CANCELLED) {
                return ['message' => "Nothing new in PNR: $pnrCode"];
            } else {
                return ['error' => "PNR: $pnrCode is cancelled. Please use amendment feature to reflect the change!"];
            }
        }
        $issuedTickets = self::findTicketNumbers($pnr->dataElementsMaster->dataElementsIndiv);
        $SSRs = self::findSSRs($pnr->dataElementsMaster->dataElementsIndiv);
        $FTs = self::findFTs($pnr->dataElementsMaster->dataElementsIndiv);
        $FEs = self::findFEs($pnr->dataElementsMaster->dataElementsIndiv);
        $PTs = self::findPTs($pnr);
        $STs = self::findSTs($pnr);
//        echo print_r($SSRs, true);
        $newTickets = false;
        $newAirPnrs = false;
        $newSeats = false;
        $newMeals = false;
        $newEndorse = false;
        $message = '';

        // Check for new fare rules
        if ($rulesRaw != $airCart->rules) {
            $airCart->rules = $rulesRaw;
            $airCart->update(['rules']);
            $message = "New fare rules for PNR: $pnrCode <br>";
        }
        // Map our airRoutes to PTs and STs - pnr passenger and segment tatoos
        // $map[PT][ST] = ['airBooking'=>airBooking#, 'airRoute' => airRoute#]
        foreach ($airCart->airBookings as $airBooking) {

            // Skip the bookings that has different pnrs
            if ($airBooking->crs_pnr != $pnrCode) {
                continue;
            }

            foreach ($airBooking->airRoutes as $airRoute) {
                $airBooking->traveler->traveler_type_id = $airBooking->traveler_type_id;
                $pt = self::findPT($PTs, $airBooking->traveler);
                $st = self::findST($STs, $airRoute);

                // Check for new air PNRs
                if (isset($STs[$st]) && $airBooking->airline_pnr != $STs[$st]->airPnr) {
                    $airBooking->airline_pnr = $STs[$st]->airPnr;
                    $newAirPnrs = true;
                    $airBooking->update(['airline_pnr']);
                }

                // Check for new tickets
                if (isset($issuedTickets[$pt][$st]) && $airBooking->ticket_number != $issuedTickets[$pt][$st]) {
                    $airBooking->ticket_number = $issuedTickets[$pt][$st];
                    $newTickets = true;
                    $airBooking->update(['ticket_number']);
                }

                // Check for new endorsments
                if ($airBooking->endorsment != self::getEndorsment($pt, [$st], $FEs)) {
                    $airBooking->endorsment = self::getEndorsment($pt, [$st], $FEs);
                    $newEndorse = true;
                    $airBooking->update(['endorsment']);
                }

                // Check for new seats
                if ($airRoute->seat != self::getSeat($pt, $st, $SSRs)) {
                    $airRoute->seat = self::getSeat($pt, $st, $SSRs);
                    $newSeats = true;
                    $airRoute->update(['seat']);
                }

                // Check for new meals
                if ($airRoute->meal != self::getMeal($pt, $st, $SSRs)) {
                    $airRoute->meal = self::getMeal($pt, $st, $SSRs);
                    $newMeals = true;
                    $airRoute->update(['meal']);
                }
            }
        }

        if ($newTickets) {
            $message .= "New tickets numbers synced for $pnrCode <br>";
            $airCart->setBookingStatus();
        }
        if ($newAirPnrs) {
            $message .= "New air PNR codes synced for $pnrCode <br>";
        }
        if ($newSeats) {
            $message .= "New seats synced for $pnrCode <br>";
        }
        if ($newMeals) {
            $message .= "New meals synced for $pnrCode <br>";
        }
        if ($newEndorse) {
            $message .= "New endorsments synced for $pnrCode <br>";
        }

        return ["message" => $message ? $message : "Nothing new in PNR: $pnrCode"];
    }

    static function cancelPnr($airCartId) {
        $airCart = \AirCart::model()->with('airBookings')->findByPk($airCartId);
        /* @var $airCart \AirCart */
        if (!$airCart || empty($airCart->airBookings)) {
            return ['error' => "This cart do not have bookings or can't be found"];
        }
        $airSourceId = $airCart->airBookings[0]->air_source_id;
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        $api = new $airSource->backend->api_source;
        /* @var $api \application\components\Amadeus\production\AmadeusWebServices2 */
        $api->Security_Authenticate($airSourceId);
        $pnr = $api->getPnr($airCart->airBookings[0]->crs_pnr);
        // If string is returned , than this is a error
        if (is_string($pnr)) {
            return ['error' => $pnr];
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('pnr_structure.json', $pnr);
        }
        $resPnr = $api->cancelCurrentPnr();
        if (YII_DEBUG) {
            \Utils::soapLogDebugFile($api, 'A1_PNR_Cancel.xml');
        }
        $api->Security_SignOut();
        return true;
    }

    static function findPT($PTs, \Traveler $matchingPassenger) {
        // Match and update the passengers with PT (passanger tatoo)
        foreach ($PTs as $keyFromPnr => $pnrPassenger) {
            if ($pnrPassenger->first_name == strtoupper($matchingPassenger->first_name) &&
                    $pnrPassenger->last_name == strtoupper($matchingPassenger->last_name) &&
                    $pnrPassenger->traveler_type_id == $matchingPassenger->traveler_type_id) {
                return $keyFromPnr;
            }
        }
        return null;
    }

    static function findST(array $STs, \AirRoutes $matchingAirRoute) {
        // Match and update the passengers with PT (passanger tatoo)
        foreach ($STs as $keyFromPnr => $pnrAirRoute) {
            if ($pnrAirRoute->source_id == $matchingAirRoute->source_id &&
                    $pnrAirRoute->destination_id == $matchingAirRoute->destination_id &&
                    $pnrAirRoute->flight_number == $matchingAirRoute->flight_number) {
                return $keyFromPnr;
            }
        }
        return null;
    }

    static function findSTs($pnr) {
        $itineraryInfos = array();
        foreach (\Utils::toArray($pnr->originDestinationDetails->itineraryInfo) as $itineraryInfo) {
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
            $airRoute->airPnr = !empty($itineraryInfo->itineraryReservationInfo->reservation->controlNumber) ? $itineraryInfo->itineraryReservationInfo->reservation->controlNumber : null;
            $airRoute->flight_number = $itineraryInfo->travelProduct->productDetails->identification;

            $itineraryInfos[$itineraryInfo->elementManagementItinerary->reference->number] = $airRoute;
        }
        return $itineraryInfos;
    }

    static function findPTs($obj) {
        $passengers = array();
        foreach (\Utils::toArray($obj->travellerInfo) as $ti) {
            $passenger = new \Traveler;
            $refNumber = $ti->elementManagementPassenger->reference->number;
            foreach (\Utils::toArray($ti->passengerData) as $key => $tiPd) {
                if ($key === 0) {   // The first passenger
                    $passenger->last_name = $tiPd->travellerInformation->traveller->surname;
                    // Do we have infant with same traveler and 2 passenger structures?
                    if (is_array($tiPd->travellerInformation->passenger)) {
                        // Add the adult
                        list($passenger->first_name, $title) = self::splitNameAndTitle($tiPd->travellerInformation->passenger[0]->firstName);
                        if (isset($tiPd->travellerInformation->passenger[0]->type)) {
                            $passenger->traveler_type_id = self::$paxTypeIds[$tiPd->travellerInformation->passenger[0]->type];
                        } else {
                            $passenger->traveler_type_id = \TravelerType::TRAVELER_ADULT;
                        }
                        $passenger->traveler_title_id = \TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = $passenger;
                        // Add the infant - second array element
                        $infant = new \Traveler;
                        $infant->last_name = $passenger->last_name;
                        list($infant->first_name, $title) = self::splitNameAndTitle($tiPd->travellerInformation->passenger[1]->firstName);
                        $passenger->traveler_title_id = \TravelerTitle::TITILE_INFANT;
                        if (isset($tiPd->dateOfBirth->dateAndTimeDetails->date)) {
                            $infant->birthdate = self::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                        } elseif (isset($tiPd->travellerInformation->passenger[0]->identificationCode)) {
                            $infant->birthdate = self::formatInfantDateFromCode($tiPd->travellerInformation->passenger[0]->identificationCode);
//                            \Utils::dbgYiiLog($infant->birthdate);
                        }
                        $infant->traveler_type_id = \TravelerType::TRAVELER_INFANT;
                        $passengers[$refNumber . 'i'] = $infant;
                    } else {    // The passenger structure is not array
                        list($passenger->first_name, $title) = self::splitNameAndTitle($tiPd->travellerInformation->passenger->firstName);
                        if (isset($tiPd->travellerInformation->passenger->type)) {
                            $passenger->traveler_type_id = self::$paxTypeIds[$tiPd->travellerInformation->passenger->type];
                        } else {
                            $passenger->traveler_type_id = \TravelerType::TRAVELER_ADULT;
                        }
                        $passenger->traveler_title_id = \TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = $passenger;
                    }
                } else {    // The second passenger - infant
                    $infant = new \Traveler;
                    $infant->last_name = $tiPd->travellerInformation->traveller->surname;
                    list($infant->first_name, $title) = explode(' ', $tiPd->travellerInformation->passenger->firstName);
                    $passenger->traveler_title_id = \TravelerTitle::TITILE_INFANT;
                    if (isset($tiPd->dateOfBirth->dateAndTimeDetails->date)) {
                        $infant->birthdate = self::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                    } elseif (isset($tiPd->travellerInformation->passenger->identificationCode)) {
                        $infant->birthdate = self::formatInfantDateFromCode($tiPd->travellerInformation->passenger->identificationCode);
                    }
                    $infant->traveler_type_id = \TravelerType::TRAVELER_INFANT;
                    $passengers[$refNumber . 'i'] = $infant;
                }
            }
        }
        return $passengers;
    }

    /**
     * PNR acquisition
     * @param string $pnrStr The PNR
     * @param int $airSourceId ID of the air source from where the pnr is to be extracted
     * @return int ID of the newly created airCart object
     */
    static function aquirePnr($pnrStr, $airSourceId) {
        // Testing parameters
        $test = false;
//        $pnrStr = '6HP4IV';
//        $pnrStr = 'Z29LM2';
        $userInfoId = \Utils::getActiveUserId();
        $loggedUserId = \Utils::getLoggedUserId();

        if ($test) {
            $pnr = \Utils::fileToObject('pnr_structure.json');
            $tickets = \Utils::fileToObject('tickets_structure.json');
        } else {
            $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
            $api = new $airSource->backend->api_source;
            $api->Security_Authenticate($airSourceId);
            $pnr = $api->getPnr($pnrStr);
            // If string is returned , than this is a error
            if (is_string($pnr)) {
                return ['message' => $pnr];
            }
            $tickets = $api->getTicket();
            if (YII_DEBUG) {
                \Utils::objectToFile('pnr_structure.json', $pnr);
                \Utils::objectToFile('tickets_structure.json', $tickets);
                \Utils::soapLogDebugFile($api, 'A1_Ticket_DisplayTST.xml');
            }
//        \Utils::soapDebug($api);
            $api->Security_SignOut();
        }
//        print_r($pnr);
//        print_r($tickets);
        $issuedTickets = self::findTicketNumbers($pnr->dataElementsMaster->dataElementsIndiv);
        $frequentFlyers = self::findFrequenFlyers($pnr->dataElementsMaster->dataElementsIndiv);
        $SSRs = self::findSSRs($pnr->dataElementsMaster->dataElementsIndiv);
        $FTs = self::findFTs($pnr->dataElementsMaster->dataElementsIndiv);
        $FEs = self::findFEs($pnr->dataElementsMaster->dataElementsIndiv);
//        \Utils::dbgYiiLog($frequentFlyers);
//        \Utils::dbgYiiLog($FTs);
//        \Utils::dbgYiiLog($FEs);
//        \Utils::dbgYiiLog($SSRs);
//        exit;
        $passengers = array();
        $infants = array();
        foreach (\Utils::toArray($pnr->travellerInfo) as $ti) {
            unset($infant);
            $passenger = new \Traveler;
            $passenger->user_info_id = $userInfoId;
            $refNumber = $ti->elementManagementPassenger->reference->number;
//            if($ti->passengerData->travellerInformation->traveller->quantity == 2) {
            // We have infants attached
//            }
            foreach (\Utils::toArray($ti->passengerData) as $key => $tiPd) {
                if ($key === 0) {   // The first passenger
                    $passenger->last_name = $tiPd->travellerInformation->traveller->surname;
                    // Do we have infant with same traveler and 2 passenger structures?
                    if (is_array($tiPd->travellerInformation->passenger)) {
                        // Add the adult
                        list($passenger->first_name, $title) = self::splitNameAndTitle($tiPd->travellerInformation->passenger[0]->firstName);
                        if (isset($tiPd->travellerInformation->passenger[0]->type)) {
                            $type_id = self::$paxTypeIds[$tiPd->travellerInformation->passenger[0]->type];
                        } else {
                            $type_id = \TravelerType::TRAVELER_ADULT;
                        }
                        $passenger->traveler_title_id = \TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = ['id' => $passenger->insertIfMissing(), 'type' => $type_id, 'refNumber' => $refNumber];
                        // Add the infant - second array element
                        $infant = new \Traveler;
                        $infant->user_info_id = $userInfoId;
                        $infant->last_name = $passenger->last_name;
                        list($infant->first_name, $title) = self::splitNameAndTitle($tiPd->travellerInformation->passenger[1]->firstName);
                        $passenger->traveler_title_id = \TravelerTitle::TITILE_INFANT;
                        if (isset($tiPd->dateOfBirth->dateAndTimeDetails->date)) {
                            $infant->birthdate = self::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                        } elseif (isset($tiPd->travellerInformation->passenger[0]->identificationCode)) {
                            $infant->birthdate = self::formatInfantDateFromCode($tiPd->travellerInformation->passenger[0]->identificationCode);
//                            \Utils::dbgYiiLog($infant->birthdate);
                        }
                        $infants[$refNumber . 'i'] = ['id' => $infant->insertIfMissing(), 'type' => \TravelerType::TRAVELER_INFANT, 'refNumber' => $refNumber . 'i'];
                    } else {    // The passenger structure is not array
                        list($passenger->first_name, $title) = self::splitNameAndTitle($tiPd->travellerInformation->passenger->firstName);
                        if (isset($tiPd->travellerInformation->passenger->type)) {
                            $type_id = self::$paxTypeIds[$tiPd->travellerInformation->passenger->type];
                        } else {
                            $type_id = \TravelerType::TRAVELER_ADULT;
                        }
                        $passenger->traveler_title_id = \TravelerTitle::extractTitle($title);
                        $passengers[$refNumber] = ['id' => $passenger->insertIfMissing(), 'type' => $type_id, 'refNumber' => $refNumber];
                    }
//                    print_r($passenger->attributes);
                } else {    // The second passenger - infant
                    $infant = new \Traveler;
                    $infant->user_info_id = $userInfoId;
                    $infant->last_name = $tiPd->travellerInformation->traveller->surname;
                    list($infant->first_name, $title) = explode(' ', $tiPd->travellerInformation->passenger->firstName);
                    $passenger->traveler_title_id = \TravelerTitle::TITILE_INFANT;
                    if (isset($tiPd->dateOfBirth->dateAndTimeDetails->date)) {
                        $infant->birthdate = self::formatInfantDate($tiPd->dateOfBirth->dateAndTimeDetails->date);
                    } elseif (isset($tiPd->travellerInformation->passenger->identificationCode)) {
                        $infant->birthdate = self::formatInfantDateFromCode($tiPd->travellerInformation->passenger->identificationCode);
//                        \Utils::dbgYiiLog($infant->birthdate);
                    }
                    $infants[$refNumber . 'i'] = ['id' => $infant->insertIfMissing(), 'type' => \TravelerType::TRAVELER_INFANT, 'refNumber' => $refNumber . 'i'];
//                    print_r($infant->attributes);
                }
            }
        }

//        \Utils::dbgYiiLog("Travelers: " . print_r($passengers, true));
//        \Utils::dbgYiiLog("Infants: " . print_r($infants, true));
//        \Utils::dbgYiiLog("FFs: " . print_r($frequentFlyers, true));
//        exit;
        // Insert the FrequentFlyers
        foreach ($frequentFlyers as $pt => $frequentFlyer) {
            foreach ($frequentFlyer as $company => $code) {
                if (is_numeric($pt)) { // PAX passengers
                    \FfSettings::insertIfMissing($passengers[$pt]['id'], $company, $code);
                } else {    //INF passengers
//                    $key = substr($pt, 0, -1);  // Cut the trailing "i"
                    \FfSettings::insertIfMissing($infants[$pt]['id'], $company, $code);
                }
            }
        }
//        \Utils::dbgYiiLog("\nTravelers: " . print_r($passengers, true));
//        \Utils::dbgYiiLog("\nInfants: " . print_r($infants, true));
//        exit;
        // Itinerary aquisition
        if (!isset($pnr->originDestinationDetails)) {
            return ['message' => "This PNR is cancelled - there is no Itinerary"];
        }
        $itineraryInfos = array();
        foreach (\Utils::toArray($pnr->originDestinationDetails->itineraryInfo) as $itineraryInfo) {
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
            $airRoute->departure_ts = self::formatDate($itineraryInfo->travelProduct->product->depDate) . " " . self::formatTime($itineraryInfo->travelProduct->product->depTime);
            $airRoute->arrival_ts = self::formatDate($itineraryInfo->travelProduct->product->arrDate) . " " . self::formatTime($itineraryInfo->travelProduct->product->arrTime);
            $airRoute->order_ = null;
            if (isset($itineraryInfo->flightDetail->departureInformation->departTerminal)) {
                $airRoute->source_terminal = $itineraryInfo->flightDetail->departureInformation->departTerminal;
            }
            $airRoute->carrier_id = \Carrier::getIdFromCode($itineraryInfo->travelProduct->companyDetail->identification);
            $airRoute->airPnr = isset($itineraryInfo->itineraryReservationInfo->reservation->controlNumber) ? $itineraryInfo->itineraryReservationInfo->reservation->controlNumber : null;
            $airRoute->flight_number = $itineraryInfo->travelProduct->productDetails->identification;
            $airRoute->booking_class = $itineraryInfo->travelProduct->productDetails->classOfService;
            // Deal with the unsafe attribute error
            unset($airRoute->id);

            // Technical stops parsing
            if (isset($itineraryInfo->legInfo)) {
                $airRoute->ts = self::parseTechnicalStops($itineraryInfo->legInfo);
            }

            $itineraryInfos[$itineraryInfo->elementManagementItinerary->reference->number] = $airRoute;
        }

//        foreach ($itineraryInfos as $key => $value) {
//            echo "Key=>$key\t".print_r($value->attributes, true);
//        }
        // Connected segments
        $segments = self::connectSegments($pnr, $itineraryInfos);
//        \Utils::dbgYiiLog('Segments: ' . print_r($segments, true));
//        exit;
//        foreach ($itineraryInfos as $key => $value) {
//            \Utils::dbgYiiLog("Key=>$key\t".print_r($value->attributes, true));
//        }

        if (isset($tickets->applicationError->errorText->errorFreeText)) {
            return ['message' => "Tickets error: {$tickets->applicationError->errorText->errorFreeText}"];
        }

        // Process the fares data from the ticket
        foreach (\Utils::toArray($tickets->fareList) as $fareList) {

            // PNR marketing company
            $marketingCompany = $fareList->validatingCarrier->carrierInformation->carrierCode;
            $marketingCompanyId = \Carrier::getIdFromCode($marketingCompany);

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
            $tax = new \Taxes;
            foreach (\Utils::toArray($fareList->taxInformation) as $ti) {
                $fare['fares'][$ti->taxDetails->taxType->isoCountry] = $ti->amountDetails->fareDataMainInformation->fareAmount;
                if (array_key_exists($ti->taxDetails->taxType->isoCountry, self::$taxesReformat)) {
                    $tax->arrTaxes[self::$taxesReformat[$ti->taxDetails->taxType->isoCountry]] += (float) $ti->amountDetails->fareDataMainInformation->fareAmount;
                } else {
                    $tax->arrTaxes[\Taxes::TAX_OTHER] += (float) $ti->amountDetails->fareDataMainInformation->fareAmount;
                }
            }
            $fare['faresReformated'] = $tax->arrTaxes;
            // Segments association
            foreach (\Utils::toArray($fareList->segmentInformation) as $si) {
                if (!isset($si->segmentReference)) {
                    continue;   // Skip the infos without segments
                }
                $fbc = isset($si->fareQualifier->fareBasisDetails->fareBasisCode) ? $si->fareQualifier->fareBasisDetails->fareBasisCode : '';
                $fare['legs'][$si->segmentReference->refDetails->refNumber] = $si->fareQualifier->fareBasisDetails->primaryCode . $fbc;
                $fare['segment'] = self::findSegementByLegReference($si->segmentReference->refDetails->refNumber, $segments);
                $itineraryInfos[$si->segmentReference->refDetails->refNumber]->fare_basis = $si->fareQualifier->fareBasisDetails->primaryCode . $fbc;
            }
            if (is_array($fareList->otherPricingInfo->attributeDetails)) {
                $fare['note'] = '';
                foreach ($fareList->otherPricingInfo->attributeDetails as $ad) {
                    $fare['note'] .= $ad->attributeDescription . " ";
                }
            } else {
                $fare['note'] = $fareList->otherPricingInfo->attributeDetails->attributeDescription;
            }
            $fare['tstFlag'] = $fareList->statusInformation->firstStatusDetails->tstFlag;

            // Assign the fares to the travelers
            foreach (\Utils::toArray($fareList->paxSegReference->refDetails) as $psr) {
                unset($fare['pax']);
                if ($fare['tstFlag'] == "INF") {   // Infant
                    $infants[$psr->refNumber . 'i']['fare'][$fare['segment']] = $fare;
                } else {    // Adult
                    $passengers[$psr->refNumber]['fare'][$fare['segment']] = $fare;
                }
                $fare['pax'][] = ['paxRef' => $psr->refNumber, 'paxType' => $fare['tstFlag']];
            }

            $fares[] = $fare;
        }
//        foreach ($itineraryInfos as $key => $value) {
//            \Utils::dbgYiiLog("Key=>$key\t" . print_r($value->attributes, true));
//        }
//        print \Utils::dbgYiiLog("\nFares: " . print_r($fares, true));
//        print \Utils::dbgYiiLog("\nTravelers: " . print_r($passengers, true));
//        print \Utils::dbgYiiLog("\nInfants: " . print_r($infants, true));
//        exit;
        // Fill up and create the AirCart, AirBooking(s) and all the AirRoutes objects
        $airCart = new \AirCart;
        $airCart->user_id = $userInfoId;        // \Utils::getActiveUserId();
        $airCart->loged_user_id = $loggedUserId;          // \Utils::getLoggedUserId();
        $airCart->payment_status_id = \PaymentStatus::STATUS_NOT_CHARGED;
        $airCart->booking_status_id = \BookingStatus::STATUS_NEW;
        $airCart->approval_status_id = \ApprovalStatus::STATUS_NOT_REQUIRED;
        $airCart->note = 'PNR from Amadeus';
        $airCart->website_id = \AirCart::getWebsiteId();
        $airCart->insert();
//        echo "Created new airCart => {$airCart->id}\n";

        foreach (array_merge($passengers, $infants) as $passenger) {
            // Skip this passenger if there are no fares defined
            if (empty($passenger['fare'])) {
                continue;
            }
            foreach ($segments as $segNum => $segment) {
                $airBooking = new \AirBooking;
                $airBooking->airline_pnr = $segment['airBooking']['airline_pnr'];
                $airBooking->crs_pnr = $pnrStr;
                $airBooking->booking_type_id = \BookingType::MANUAL_BY_PNR;
                $airBooking->air_source_id = $airSourceId;
                $airBooking->traveler_type_id = $passenger['type'];
                $airBooking->traveler_id = $passenger['id'];
//                $itineraryInfos = \Utils::toArray($odd->itineraryInfo);
                $airBooking->source_id = $segment['airBooking']['source_id'];
                $legsCount = count($itineraryInfos) - 1;
                $airBooking->destination_id = $segment['airBooking']['destination_id'];
                $airBooking->carrier_id = $marketingCompanyId;
                $airBooking->departure_ts = $segment['airBooking']['departure_ts'];
                $airBooking->arrival_ts = $segment['airBooking']['arrival_ts'];
                $airBooking->service_type_id = \ServiceType::getServiceType($airBooking->source_id, $airBooking->destination_id);
                $airBooking->fare_basis = $itineraryInfos[$segment['legs'][0]]->fare_basis;
                $airBooking->booking_class = $itineraryInfos[$segment['legs'][0]]->booking_class;
                $airBooking->fare_type_id = \FareType::getFareType($airBooking->carrier_id, $airBooking->booking_class);
                $airBooking->frequent_flyer = self::getFrequentFlyer($passenger['refNumber'], $segment['legs'], $SSRs);
                $airBooking->tour_code = self::getTourCode($passenger['refNumber'], $segment['legs'], $FTs);
                $airBooking->private_fare = self::getPrivateFare($passenger['refNumber'], $segment['legs'], $FTs);
                $airBooking->endorsment = self::getEndorsment($passenger['refNumber'], $segment['legs'], $FEs);
                $airBooking->air_cart_id = $airCart->id;
                // Fill up the fares data for the first segment
//                if ($segNum === 0) {
                if (isset($passenger['fare'][$segNum])) {
                    $airBooking = \Taxes::fillTaxesInAirBooking($airBooking, $passenger['fare'][$segNum]['faresReformated']);
                    $airBooking->basic_fare = $passenger['fare'][$segNum]['baseFare'];
                }
                if (isset($issuedTickets[$passenger['refNumber']])) {
                    $airBooking->ticket_number = $issuedTickets[$passenger['refNumber']][$segment['legs'][0]];
                }

                $airBooking->insert();
//                \Utils::dbg("Created new airBooking => {$airBooking->id}\n" . print_r($airBooking->attributes, true));
//                exit;

                foreach ($segment['legs'] as $legId) {
                    $airRoute = new \AirRoutes('pnrAcquisition');
                    $airRoute->attributes = $itineraryInfos[$legId]->attributes;
                    $airRoute->air_booking_id = $airBooking->id;
                    // Seat check
                    $airRoute->seat = self::getSeat($passenger['refNumber'], $legId, $SSRs);
                    // Meal check
                    $airRoute->meal = self::getMeal($passenger['refNumber'], $legId, $SSRs);
                    $airRoute->insert();
//                    echo "Created new airRoute => {$airRoute->id}\n";
//                    print_r($airRoute->attributes);
                }
                $airBooking->setAirRoutesOrder();
            }
        }
//        $airCart->refresh();
//        $airCart->applyBothRules();
//        $airCart->setBookingStatus(true);
        return ['airCartId' => $airCart->id];
    }

    /**
     * Issue the ticket for ready PNR
     * @param string $pnrStr The PNR
     * @param int $airSourceId ID of the air source from where the pnr is to be extracted
     * @return boolean true or error string
     */
    static function issueTicket($pnrStr, $airSourceId) {
        $fileNamePnr = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'pnr_structure.json';
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        $api = new $airSource->backend->api_source;
        $api->Security_Authenticate($airSourceId);
        $pnr = $api->getPnr($pnrStr);
        // If string is returned , than this is a error
        if (is_string($pnr)) {
            return $pnr;
        }
        if (YII_DEBUG) {
            \Utils::objectToFile($fileNamePnr, $pnr);
        }
        // New session
        $issueTicketTrys = 0;
        do {
            $resIssueTicket = $api->issueTicket();
            if ($resIssueTicket->processingStatus->statusCode != 0) {   // Wait for Amadeus to wake up
                sleep(self::AMADEUS_SLEEP_TIME);   // The Amadeus backend need some time to react for the new PNR to get to the Airlines
            }
            $issueTicketTrys++;
        } while ($issueTicketTrys <= self::AMADEUS_REPEAT_ISSUE_TICKET_OPERATION && $resIssueTicket->processingStatus->statusCode != 0);
//            \Utils::dbgYiiLog($resIssueTicket);
//            \Utils::soapLogDebug($this->api);
        if ($resIssueTicket->processingStatus->statusCode != 0) {
            $api->Security_SignOut();
            return "Error with issuing the ticket: " . $resIssueTicket->errorGroup->errorWarningDescription->freeText;
        }
        $api->Security_SignOut();

        return true;
    }

    /**
     * Get the passager seat
     * @param int $pt   Passager tatoo
     * @param int $st   Segment tatoo
     * @param array $SSRs   array of all SSRs
     */
    static function getSeat($pt, $st, $SSRs) {
        foreach ($SSRs as $ssr) {
            if (in_array($ssr['ssr'], self::$seatlRequests) &&
                    ( empty($ssr['legs']) || in_array($st, $ssr['legs']) ) &&
                    ( empty($ssr['passagers']) || in_array($pt, $ssr['passagers']) )
            ) {
                return $ssr['data'][$pt];
            }
        }
        return null;
    }

    public static function getTourCode($pt, $legs, $FTs) {
        foreach ($FTs as $ft) {
            if (strstr($ft['data'], self::PRIVATE_FARE_INDICATOR) === false &&
                    ( empty($ft['passagers']) || in_array($pt, $ft['passagers']) )
            ) {
                if (empty($ft['legs'])) {
                    return $ft['data'];
                }
                foreach ($legs as $leg) {
                    if (in_array($leg, $ft['legs'])) {
                        return $ft['data'];
                    }
                }
            }
        }
        return null;
    }

    public static function getPrivateFare($pt, $legs, $FTs) {
        foreach ($FTs as $ft) {
            if (strstr($ft['data'], self::PRIVATE_FARE_INDICATOR) !== false &&
                    ( empty($ft['passagers']) || in_array($pt, $ft['passagers']) )
            ) {
                if (empty($ft['legs'])) {
                    return substr($ft['data'], 7);
                }
                foreach ($legs as $leg) {
                    if (in_array($leg, $ft['legs'])) {
                        return substr($ft['data'], 7);
                    }
                }
            }
        }
        return null;
    }

    public static function getEndorsment($pt, $legs, $FEs) {
        foreach ($FEs as $fe) {
            if (empty($fe['passagers']) || in_array($pt, $fe['passagers'])
            ) {
                if (empty($fe['legs'])) {
                    return $fe['data'];
                }
                foreach ($legs as $leg) {
                    if (in_array($leg, $fe['legs'])) {
                        return $fe['data'];
                    }
                }
            }
        }
        return null;
    }

    public static function getFrequentFlyer($pt, $legs, $SSRs) {
        foreach ($SSRs as $ssr) {
            if ($ssr['ssr'] == self::FREQUENT_FLYER_INDICATOR &&
                    ( empty($ssr['passagers']) || in_array($pt, $ssr['passagers']) )
            ) {
                if (empty($ssr['legs'])) {
                    return "{$ssr['data']['company']}-{$ssr['data']['membershipNumber']}";
                }
                foreach ($legs as $leg) {
                    if (in_array($leg, $ssr['legs'])) {
                        return "{$ssr['data']['company']}-{$ssr['data']['membershipNumber']}";
                    }
                }
            }
        }
        return null;
    }

    static function getMeal($pt, $st, $SSRs) {
        foreach ($SSRs as $ssr) {
            if (in_array($ssr['ssr'], array_keys(self::$mealTypes)) &&
                    ( empty($ssr['legs']) || in_array($st, $ssr['legs']) ) &&
                    ( empty($ssr['passagers']) || in_array($pt, $ssr['passagers']) )
            ) {
                return $ssr['ssr'];
            }
        }
        return null;
    }

    public static function findTicketNumbers($obj) {
        $out = array();
        foreach (\Utils::toArray($obj) as $value) {
            if (!isset($value->elementManagementData->reference)) {
                continue;   // Skip this element if there is no reference
            }
            if ($value->elementManagementData->reference->qualifier == "OT" &&
                    $value->elementManagementData->segmentName == "FA" &&
                    isset($value->otherDataFreetext->longFreetext)) {
                if (preg_match('#.*?\s([\d]{2,3}-[\d]{10}.*?)/#', $value->otherDataFreetext->longFreetext, $matches)) {
//                    \Utils::dbgYiiLog($matches);
                    unset($segments);
                    unset($passengers);
                    $infantIndicator = substr($value->otherDataFreetext->longFreetext, 0, 3) == 'INF' ? 'i' : '';
                    foreach ($value->referenceForDataElement->reference as $reference) {
                        switch ($reference->qualifier) {
                            case 'ST':
                                $segments[] = $reference->number;
                                break;
                            case 'PT':
                                $passengers[] = $reference->number . $infantIndicator;
                                break;
                        }
                    }
                    foreach ($passengers as $passenger) {
                        foreach ($segments as $segment) {
                            $out[$passenger][$segment] = $matches[1];
                        }
                    }
                }
            }
        }
        return $out;
    }

    private static function findFrequenFlyers($obj) {
        $out = array();
        foreach (\Utils::toArray($obj) as $value) {
            if (isset($value->frequentTravellerInfo->frequentTraveler->company) &&
                    isset($value->frequentTravellerInfo->frequentTraveler->membershipNumber)) {
//                    \Utils::dbgYiiLog($matches);
                unset($passengers);
                foreach (\Utils::toArray($value->referenceForDataElement->reference) as $reference) {
                    switch ($reference->qualifier) {
                        case 'PT':
                            $passengers[] = $reference->number;
                            break;
                        case 'PI':
                            $passengers[] = $reference->number . "i";
                            break;
                    }
                }
                foreach ($passengers as $passenger) {
                    if (isset($out[$passenger][$value->frequentTravellerInfo->frequentTraveler->company])) {
                        if ($out[$passenger][$value->frequentTravellerInfo->frequentTraveler->company] != $value->frequentTravellerInfo->frequentTraveler->membershipNumber) {
                            // Second membershipNumber is for the infant
                            $out[$passenger . 'i'][$value->frequentTravellerInfo->frequentTraveler->company] = $value->frequentTravellerInfo->frequentTraveler->membershipNumber;
                        }
                    } else {    // First time settings
                        $out[$passenger][$value->frequentTravellerInfo->frequentTraveler->company] = $value->frequentTravellerInfo->frequentTraveler->membershipNumber;
                    }
                }
            }
        }
        return $out;
    }

    static function findSSRs($obj) {
        $out = array();
        foreach (\Utils::toArray($obj) as $value) {
            if (isset($value->serviceRequest->ssr->type) &&
                    isset($value->referenceForDataElement)) {
                $passengers = array();
                $segments = array();
                foreach (\Utils::toArray($value->referenceForDataElement->reference) as $reference) {
                    switch ($reference->qualifier) {
                        case 'PT':
                            $passengers[] = $reference->number;
                            break;
                        case 'ST':
                            $segments[] = $reference->number;
                            break;
                    }
                }
                $data = [];
                if (isset($value->serviceRequest->ssrb)) {
                    foreach (\Utils::toArray($value->serviceRequest->ssrb) as $ssrb) {
                        if (isset($ssrb->data)) {
                            $data[$ssrb->crossRef] = $ssrb->data;
                        }
                    }
                } elseif (isset($value->frequentTravellerInfo->frequentTraveler->company) &&
                        isset($value->frequentTravellerInfo->frequentTraveler->membershipNumber)) {
                    $data = ['company' => $value->frequentTravellerInfo->frequentTraveler->company, 'membershipNumber' => $value->frequentTravellerInfo->frequentTraveler->membershipNumber];
                } else {
                    $data[] = $value->serviceRequest->ssr->type;
                }
                if (!empty($data)) {
                    $out[] = ['ssr' => $value->serviceRequest->ssr->type, 'data' => $data, 'legs' => $segments, 'passagers' => $passengers];
                }
            }
        }
        return $out;
    }

    public static function findFTs($obj) {
        $out = array();
        foreach (\Utils::toArray($obj) as $value) {
            if (isset($value->elementManagementData->segmentName) &&
                    $value->elementManagementData->segmentName == "FT") {
                $passengers = array();
                $segments = array();
                if (isset($value->referenceForDataElement->reference)) {
                    foreach (\Utils::toArray($value->referenceForDataElement->reference) as $reference) {
                        switch ($reference->qualifier) {
                            case 'PT':
                                $passengers[] = $reference->number;
                                break;
                            case 'ST':
                                $segments[] = $reference->number;
                                break;
                        }
                    }
                }
                $data = $value->otherDataFreetext->longFreetext;
                $out[] = ['data' => $data, 'legs' => $segments, 'passagers' => $passengers];
            }
        }
        return $out;
    }

    public static function findFEs($obj) {
        $out = array();
        foreach (\Utils::toArray($obj) as $value) {
            if (isset($value->elementManagementData->segmentName) &&
                    $value->elementManagementData->segmentName == "FE") {
                $passengers = array();
                $segments = array();
                if (isset($value->referenceForDataElement->reference)) {
                    foreach (\Utils::toArray($value->referenceForDataElement->reference) as $reference) {
                        switch ($reference->qualifier) {
                            case 'PT':
                                $passengers[] = $reference->number;
                                break;
                            case 'ST':
                                $segments[] = $reference->number;
                                break;
                        }
                    }
                }
                $data = $value->otherDataFreetext->longFreetext;
                $out[] = ['data' => $data, 'legs' => $segments, 'passagers' => $passengers];
            }
        }
        return $out;
    }

    public static function findFpError($obj) {
        foreach (\Utils::toArray($obj) as $value) {
            if (isset($value->elementManagementData->segmentName) &&
                    $value->elementManagementData->segmentName == "FP") {
                if (isset($value->elementErrorInformation->elementErrorText->text)) {
                    return $value->elementErrorInformation->elementErrorText->text;
                }
            }
        }
        return false;
    }

    private static function connectSegments(\stdClass $pnr, array &$itineraryInfos) {
        $segments = array();
        if (isset($pnr->segmentGroupingInfo)) { // We have segments marriages
            foreach (\Utils::toArray($pnr->segmentGroupingInfo) as $segmentGroupingInfo) {
                if ($segmentGroupingInfo->groupingCode != self::CONNECTED_SEGMENTS_MARRIAGE_INDICATOR) {
                    continue;   // Skip marrigaes that do not show connected segments
                }
                unset($segment);
                foreach (\Utils::toArray($segmentGroupingInfo->marriageDetail) as $md) {
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
                $segment['airBooking']['airline_pnr'] = $itineraryInfos[$segment['legs'][0]]->airPnr;
                $segments[] = $segment;
            }
        } else {    // No segment marriages - put each $itineraryInfos in his own segment
            foreach ($itineraryInfos as $key => $itineraryInfo) {
                $itineraryInfos[$key]->order_ = 1;      // Single leg in segment
                unset($segment);
                $segment['legs'][0] = $key;
                $segment['airBooking']['source_id'] = $itineraryInfo->source_id;
                $segment['airBooking']['destination_id'] = $itineraryInfo->destination_id;
                $segment['airBooking']['departure_ts'] = $itineraryInfo->departure_ts;
                $segment['airBooking']['arrival_ts'] = $itineraryInfo->arrival_ts;
                $segment['airBooking']['airline_pnr'] = $itineraryInfo->airPnr;
                $segments[] = $segment;
            }
        }

        return $segments;
    }

    private static function findSegementByLegReference($legKey, array $segments) {
        foreach ($segments as $key => $segment) {
            foreach ($segment['legs'] as $leg) {
                if ($leg == $legKey) {
                    return $key;
                }
            }
        }
        return null;
    }

    /**
     * Amadeus search
     * @param int $airSourceId The AirSource ID
     * @param \stdClass $params
     * @return string JSON encoded search result
     */
    static function search($airSourceId, \stdClass $params) {
        // old search check
        if (strtotime($params->depart) < strtotime(date(DATE_FORMAT))) {
            return "Departure in the past: $params->depart";
        }
        if (strtotime($params->depart) > strtotime(date(DATE_FORMAT, time() + 360 * 24 * 3600))) {
            return "Departure too far in the future";
        }
        $airSource = \AirSource::model()->cache(120)->with('backend')->findByPk($airSourceId);
        $api = new $airSource->backend->api_source;
        // Namespace construction patch
        $nspace = "application\\components\\Amadeus\\{$airSource->backend->wsdl_file}\\";
//        $localTest = true;
        $localTest = false;
        if ($localTest) {   // manually set the BookingForm model
            $res = \Utils::fileToObject('amadeus_f_mptbs.json');
        } else {
            $res = $api->Security_Authenticate($airSourceId);
        }
        $params->depart = date("dmy", strtotime($params->depart));

        $class = $nspace . 'Fare_MasterPricerTravelBoardSearch';
        $f_mptbs = new $class;

        $class = $nspace . 'unitNumberDetail';
        $und = new $class;
        $und->numberOfUnits = $params->adults + $params->children;
        $und->typeOfUnit = 'PX';
        $f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

        $und = new $class;
        $und->numberOfUnits = self::AMADEUS_MAX_SEARCH_RESULTS;
        $und->typeOfUnit = 'RC';
        $f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

        $ref = 1;
        if ($params->adults > 0) {
            $class = $nspace . 'paxReference';
            $pr = new $class;
            $pr->ptc = 'ADT';
            for ($i = 0; $i < $params->adults; $i++) {
                $class = $nspace . 'traveller';
                $traveller = new $class;
                $traveller->ref = $ref;
                $ref++;
                $pr->traveller[] = $traveller;
            }
            $f_mptbs->paxReference[] = $pr;
        }
        if ($params->children > 0) {
            $class = $nspace . 'paxReference';
            $pr = new $class;
            $pr->ptc = 'CH';
            for ($i = 0; $i < $params->children; $i++) {
                $class = $nspace . 'traveller';
                $traveller = new $class;
                $traveller->ref = $ref;
                $ref++;
                $pr->traveller[] = $traveller;
            }
            $f_mptbs->paxReference[] = $pr;
        }

        if ($params->infants > 0) {
            $class = $nspace . 'paxReference';
            $pr = new $class;
            $pr->ptc = 'INF';
            for ($i = 0; $i < $params->infants; $i++) {
                $class = $nspace . 'traveller';
                $traveller = new $class;
                $traveller->ref = (int) ($i + 1);
                $traveller->infantIndicator = 1;
                $pr->traveller[] = $traveller;
            }
            $f_mptbs->paxReference[] = $pr;
        }

        $class = $nspace . 'pricingTicketing';
        $pt = new $class;
        $pt->priceType[] = 'TAC';
        $pt->priceType[] = 'RU';
        $pt->priceType[] = 'RP';
//$pt->priceType[] = 'PTC';
        $pt->priceType[] = 'ET';
        $class = $nspace . 'fareOptions';
        $f_mptbs->fareOptions = new $class;
        $class = $nspace . 'pricingTickInfo';
        $f_mptbs->fareOptions->pricingTickInfo = new $class;
        $f_mptbs->fareOptions->pricingTickInfo->pricingTicketing = $pt;

        $class = $nspace . 'travelFlightInfo';
        $f_mptbs->travelFlightInfo = new $class;
        $class = $nspace . 'cabinId';
        $f_mptbs->travelFlightInfo->cabinId = new $class;
        if ($params->category == \CabinType::PREMIUM_ECONOMY) {
            $params->category = \CabinType::ECONOMY;
        }
        $f_mptbs->travelFlightInfo->cabinId->cabin = \CabinType::$iataCabinClass[$params->category];

        $class = $nspace . 'itinerary';
        $f_mptbs->itinerary[0] = new $class;
        $class = $nspace . 'requestedSegmentRef';
        $f_mptbs->itinerary[0]->requestedSegmentRef = new $class;
        $f_mptbs->itinerary[0]->requestedSegmentRef->segRef = 1;
        $class = $nspace . 'departureLocalization';
        $f_mptbs->itinerary[0]->departureLocalization = new $class;
        $class = $nspace . 'depMultiCity';
        $f_mptbs->itinerary[0]->departureLocalization->depMultiCity = new $class;
        $f_mptbs->itinerary[0]->departureLocalization->depMultiCity->locationId = $params->source;

        $class = $nspace . 'arrivalLocalization';
        $f_mptbs->itinerary[0]->arrivalLocalization = new $class;
        $class = $nspace . 'arrivalMultiCity';
        $f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity = new $class;
        $f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity->locationId = $params->destination;

        $class = $nspace . 'timeDetails';
        $f_mptbs->itinerary[0]->timeDetails = new $class;
        $class = $nspace . 'firstDateTimeDetail';
        $f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail = new $class;
        $f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail->date = $params->depart;

// Round trip
        if (!empty($params->return)) {
            $params->return = date("dmy", strtotime($params->return));
            $class = $nspace . 'itinerary';
            $f_mptbs->itinerary[1] = new $class;
            $class = $nspace . 'requestedSegmentRef';
            $f_mptbs->itinerary[1]->requestedSegmentRef = new $class;
            $f_mptbs->itinerary[1]->requestedSegmentRef->segRef = 2;
            $class = $nspace . 'departureLocalization';
            $f_mptbs->itinerary[1]->departureLocalization = new $class;
            $class = $nspace . 'depMultiCity';
            $f_mptbs->itinerary[1]->departureLocalization->depMultiCity = new $class;
            $f_mptbs->itinerary[1]->departureLocalization->depMultiCity->locationId = $params->destination;

            $class = $nspace . 'arrivalLocalization';
            $f_mptbs->itinerary[1]->arrivalLocalization = new $class;
            $class = $nspace . 'arrivalMultiCity';
            $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity = new $class;
            $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity->locationId = $params->source;

            $class = $nspace . 'timeDetails';
            $f_mptbs->itinerary[1]->timeDetails = new $class;
            $class = $nspace . 'firstDateTimeDetail';
            $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail = new $class;
            $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail->date = $params->return;
        }

        if (!$localTest) {
            $res = $api->Fare_MasterPricerTravelBoardSearch($f_mptbs);
            $api->Security_SignOut();
        }
        /* @var $res \application\components\Amadeus\production\Fare_MasterPricerTravelBoardSearchReply  */
        if ($res === false) {
            return "SoapFault - check the logs for details";
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('amadeus_f_mptbs.json', $res);
        }
        if (isset($res->errorMessage->errorMessageText->description)) {
            return (string) $res->errorMessage->errorMessageText->description;
        }

        // Parse the flights
        foreach (\Utils::toArray($res->flightIndex) as $fi) {
            $segmentRef = $fi->requestedSegmentRef->segRef;
            foreach (\Utils::toArray($fi->groupOfFlights) as $gof) {
                if (empty($gof->flightDetails)) {
                    file_put_contents(\Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'amadeus_flightIndex_groupOfFlights_flightDetails.err', print_r($fi, true));
                    continue;
                }
                unset($legs);
                foreach (\Utils::toArray($gof->flightDetails) as $fd) {
                    $depart = self::formatDate($fd->flightInformation->productDateTime->dateOfDeparture) . " " . self::formatTime($fd->flightInformation->productDateTime->timeOfDeparture);
                    $arrive = self::formatDate($fd->flightInformation->productDateTime->dateOfArrival) . " " . self::formatTime($fd->flightInformation->productDateTime->timeOfArrival);
                    $carrier = $fd->flightInformation->companyId->marketingCarrier;
                    $ts = null;
                    if (isset($fd->technicalStop)) {
                        unset($tses);
                        foreach (\Utils::toArray($fd->technicalStop) as $technicalStop) {
                            $tses[] = $technicalStop->stopDetails[0]->locationId . ' ' .
                                    self::formatTime($technicalStop->stopDetails[0]->firstTime) . '-' .
                                    self::formatTime($technicalStop->stopDetails[1]->firstTime);
                        }
                        $ts = implode(', ', $tses);
                    }
                    $legs[] = [
                        'depart' => $depart,
                        'arrive' => $arrive,
                        'origin' => $fd->flightInformation->location[0]->locationId,
                        'destination' => $fd->flightInformation->location[1]->locationId,
                        'flight' => $carrier . '-' . $fd->flightInformation->flightNumber,
                        'traveTime' => \Utils::convertSecToHoursMins(strtotime($arrive) - strtotime($depart)),
                        'aircraft' => $fd->flightInformation->productDetail->equipmentType,
                        'originTerminal' => isset($fd->flightInformation->location[0]->terminal) ? $fd->flightInformation->location[0]->terminal : null,
                        'destinationTerminal' => isset($fd->flightInformation->location[1]->terminal) ? $fd->flightInformation->location[1]->terminal : null,
                        'technicalStop' => $ts
                    ];
                }
                $flights[$segmentRef][$gof->propFlightGrDetail->flightProposal[0]->ref] = $legs;
            }
        }
//        echo \Utils::dbg($flights);
//exit;
// Prepare taxes
        foreach (\Utils::toArray($res->recommendation) as $recommend) {
            if (empty($recommend->paxFareProduct)) {
                file_put_contents(\Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'amadeus_recommend_paxFareProduct.err', print_r($recommend, true));
                continue;
            }
            unset($passengers);
            foreach (\Utils::toArray($recommend->paxFareProduct) as $pfp) {
                foreach (\Utils::toArray($pfp->paxReference->traveller) as $traveler) {
                    $key = $traveler->ref;
                    if (isset($traveler->infantIndicator)) {
                        $key = count($passengers) + 1;
                    }
                    $passengers[$key]['type'] = $pfp->paxReference->ptc;
                    $passengers[$key]['fare'] = $pfp->paxFareDetail->totalFareAmount;
                    $passengers[$key]['taxes'] = $pfp->paxFareDetail->totalTaxAmount;
                    $csd = \Utils::toArray($pfp->paxFareDetail->codeShareDetails);
                    $passengers[$key]['marketingCompany'] = $csd[0]->company;
                    $passengers[$key]['text'] = '';
                    $tax = new \Taxes;
                    $checkSum = 0;
                    foreach (\Utils::toArray($pfp->paxFareDetail->monetaryDetails) as $md) {
                        if ($md->amountType != self::TAX_TO_SKIP && $passengers[$key]['type'] != self::$paxTypes[\TravelerType::TRAVELER_INFANT]) {
                            $passengers[$key]['text'] .= "{$md->amountType}: {$md->amount}<br>";
                            $tax->arrTaxes[self::$taxesReformat[$md->amountType]] += $md->amount;
                            $checkSum += $md->amount;
                        }
                    }
                    foreach (\Utils::toArray($pfp->passengerTaxDetails->taxDetails) as $td) {
                        $passengers[$key]['text'] .= "{$td->type}: {$td->rate}<br>";
                        $tax->arrTaxes[self::$taxesReformat[$td->type]] += $td->rate;
                        $checkSum += $td->rate;
                    }
                    if ($checkSum != $passengers[$key]['taxes']) {  // We have tax difference - adjust with Other type tax
                        $tax->arrTaxes[\Taxes::TAX_OTHER] = $passengers[$key]['taxes'] - $checkSum;
                    }
                    $passengers[$key]['arrTaxes'] = $tax->arrTaxes;
                    foreach (\Utils::toArray($pfp->fareDetails) as $fds) {
                        $segmentRef = $fds->segmentRef->segRef;
                        foreach (\Utils::toArray($fds->groupOfFares) as $tmp) {
                            $passengers[$key]['fareBasis'][$segmentRef][] = $tmp->productInformation->fareProductDetail->fareBasis;
                            $passengers[$key]['bookingClass'][$segmentRef][] = $tmp->productInformation->cabinProduct->rbd;
                        }
                    }
                }
            }

            unset($legs);
            foreach (\Utils::toArray($recommend->segmentFlightRef) as $key => $ref) {
                $legs[$key]['total'] = 0;
                foreach (\Utils::toArray($ref->referencingDetail) as $k => $refDetail) {
//                Skip the referencing elements that are not Segments
                    if ($refDetail->refQualifier !== 'S') {
                        continue;
                    }
                    $legs[$key][$k + 1] = $refDetail->refNumber;
                    $legs[$key]['total'] += count($flights[$k + 1][$refDetail->refNumber]);
//            $segments[$k + 1][$refDetail->refNumber] = $passengers[$segmentRef];
//            $segments[] = ['legs'=>[$k + 1][$refDetail->refNumber] = $passengers[$segmentRef]];
                }
            }
            $segments[] = ['legs' => $legs, 'passengers' => $passengers];
        }
//        echo \Utils::dbg($segments);
//        exit;
        $serviceTypeId = \Airport::getServiceTypeIdFromCode($params->source, $params->destination);
        $rows = [];
        $resultCount = 0;
        foreach ($segments as $segment) {
            foreach ($segment['legs'] as $legs) {
//            $cacheData = self::prepareCacheRow($segment['flight'], $segment['fares'], $segment['bics'], $flights, $airSourceId, $serviceTypeId);
                $rows = array_merge($rows, self::prepareCacheRow($legs, $segment['passengers'], $flights, $airSourceId, $serviceTypeId, $params->category));
                $resultCount++;
                if ($resultCount >= self::AMADEUS_MAX_SEARCH_RESULTS) {
                    break 2;  // Do not consider more than MAX_SEARCH results.
                }
            }
        }
//        echo \Utils::dbg($rows);
        return json_encode($rows);
    }

    /**
     * Amadeus V2 search
     * @param int $airSourceId The AirSource ID
     * @param \stdClass $params
     * @return string JSON encoded search result
     */
    static function searchV2($airSourceId, \stdClass $params) {
        // old search check
        if (strtotime($params->depart) < strtotime(date(DATE_FORMAT))) {
            return "Departure in the past";
        }
        if (strtotime($params->depart) > strtotime(date(DATE_FORMAT, time() + 360 * 24 * 3600))) {
            return "Departure too far in the future";
        }
        $airSource = \AirSource::model()->cache(300)->with('backend')->findByPk($airSourceId);
        $disabledCarriers = array_map('trim', explode(',', strtoupper($airSource->exclude_carriers)));
        $api = new $airSource->backend->api_source;
        // Namespace construction patch
        $nspace = "application\\components\\Amadeus\\{$airSource->backend->wsdl_file}\\";
//        $localTest = true;
        $localTest = false;
        if ($localTest) {   // manually set the BookingForm model
            $res = \Utils::fileToObject('amadeus_f_mptbs.json');
        } else {
            $res = $api->Security_Authenticate($airSourceId);
        }
        $params->depart = date("dmy", strtotime($params->depart));

        $class = $nspace . 'Fare_MasterPricerTravelBoardSearch';
        $f_mptbs = new $class;

        $class = $nspace . 'NumberOfUnitDetailsType_191580C';
        $und = new $class;
        $und->numberOfUnits = $params->adults + $params->children;
        $und->typeOfUnit = 'PX';
        $f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

        $und = new $class;
        $und->numberOfUnits = self::AMADEUS_MAX_SEARCH_RESULTS;
        $und->typeOfUnit = 'RC';
        $f_mptbs->numberOfUnit->unitNumberDetail[] = $und;

        $ref = 1;
        if ($params->adults > 0) {
            $class = $nspace . 'paxReference';
            $pr = new $class;
            $pr->ptc = 'ADT';
            for ($i = 0; $i < $params->adults; $i++) {
                $class = $nspace . 'traveller';
                $traveller = new $class;
                $traveller->ref = $ref;
                $ref++;
                $pr->traveller[] = $traveller;
            }
            $f_mptbs->paxReference[] = $pr;
        }
        if ($params->children > 0) {
            $class = $nspace . 'paxReference';
            $pr = new $class;
            $pr->ptc = 'CH';
            for ($i = 0; $i < $params->children; $i++) {
                $class = $nspace . 'traveller';
                $traveller = new $class;
                $traveller->ref = $ref;
                $ref++;
                $pr->traveller[] = $traveller;
            }
            $f_mptbs->paxReference[] = $pr;
        }

        if ($params->infants > 0) {
            $class = $nspace . 'paxReference';
            $pr = new $class;
            $pr->ptc = 'INF';
            for ($i = 0; $i < $params->infants; $i++) {
                $class = $nspace . 'traveller';
                $traveller = new $class;
                $traveller->ref = (int) ($i + 1);
                $traveller->infantIndicator = 1;
                $pr->traveller[] = $traveller;
            }
            $f_mptbs->paxReference[] = $pr;
        }

        $class = $nspace . 'PricingTicketingInformationType';
        $pt = new $class;
        $pt->priceType[] = 'TAC';
        $pt->priceType[] = 'RU';
        $pt->priceType[] = 'RP';
//$pt->priceType[] = 'PTC';
        $pt->priceType[] = 'ET';
        $class = $nspace . 'fareOptions';
        $f_mptbs->fareOptions = new $class;
        $class = $nspace . 'pricingTickInfo';
        $f_mptbs->fareOptions->pricingTickInfo = new $class;
        $f_mptbs->fareOptions->pricingTickInfo->pricingTicketing = $pt;

        $class = $nspace . 'TravelFlightInformationType_165052S';
        $f_mptbs->travelFlightInfo = new $class;
        $class = $nspace . 'CompanyIdentificationType_233548C';
        $f_mptbs->travelFlightInfo->companyIdentity = new $class;
        $f_mptbs->travelFlightInfo->companyIdentity->carrierQualifier = 'X';
        $f_mptbs->travelFlightInfo->companyIdentity->carrierId = $disabledCarriers;
        $class = $nspace . 'CabinIdentificationType_233500C';
        $f_mptbs->travelFlightInfo->cabinId = new $class;
//        if ($params->category == \CabinType::PREMIUM_ECONOMY) {
//            $params->category = \CabinType::ECONOMY;
//        }
        $f_mptbs->travelFlightInfo->cabinId->cabin = \CabinType::$iataCabinClass[$params->category];

        $class = $nspace . 'itinerary';
        $f_mptbs->itinerary[0] = new $class;
        $class = $nspace . 'OriginAndDestinationRequestType';
        $f_mptbs->itinerary[0]->requestedSegmentRef = new $class;
        $f_mptbs->itinerary[0]->requestedSegmentRef->segRef = 1;
        $class = $nspace . 'DepartureLocationType';
        $f_mptbs->itinerary[0]->departureLocalization = new $class;
        $class = $nspace . 'MultiCityOptionType';
        $f_mptbs->itinerary[0]->departureLocalization->depMultiCity = new $class;
        $f_mptbs->itinerary[0]->departureLocalization->depMultiCity->locationId = $params->source;

        $class = $nspace . 'ArrivalLocalizationType';
        $f_mptbs->itinerary[0]->arrivalLocalization = new $class;
        $class = $nspace . 'MultiCityOptionType';
        $f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity = new $class;
        $f_mptbs->itinerary[0]->arrivalLocalization->arrivalMultiCity->locationId = $params->destination;

        $class = $nspace . 'DateAndTimeInformationType_181295S';
        $f_mptbs->itinerary[0]->timeDetails = new $class;
        $class = $nspace . 'DateAndTimeDetailsTypeI';
        $f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail = new $class;
        $f_mptbs->itinerary[0]->timeDetails->firstDateTimeDetail->date = $params->depart;

// Round trip
        if (!empty($params->return)) {
            $params->return = date("dmy", strtotime($params->return));
            $class = $nspace . 'itinerary';
            $f_mptbs->itinerary[1] = new $class;
            $class = $nspace . 'OriginAndDestinationRequestType';
            $f_mptbs->itinerary[1]->requestedSegmentRef = new $class;
            $f_mptbs->itinerary[1]->requestedSegmentRef->segRef = 2;
            $class = $nspace . 'DepartureLocationType';
            $f_mptbs->itinerary[1]->departureLocalization = new $class;
            $class = $nspace . 'MultiCityOptionType';
            $f_mptbs->itinerary[1]->departureLocalization->depMultiCity = new $class;
            $f_mptbs->itinerary[1]->departureLocalization->depMultiCity->locationId = $params->destination;

            $class = $nspace . 'ArrivalLocalizationType';
            $f_mptbs->itinerary[1]->arrivalLocalization = new $class;
            $class = $nspace . 'MultiCityOptionType';
            $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity = new $class;
            $f_mptbs->itinerary[1]->arrivalLocalization->arrivalMultiCity->locationId = $params->source;

            $class = $nspace . 'DateAndTimeInformationType_181295S';
            $f_mptbs->itinerary[1]->timeDetails = new $class;
            $class = $nspace . 'DateAndTimeDetailsTypeI';
            $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail = new $class;
            $f_mptbs->itinerary[1]->timeDetails->firstDateTimeDetail->date = $params->return;
        }

        if (!$localTest) {
            $res = $api->Fare_MasterPricerTravelBoardSearch($f_mptbs);
            if (YII_DEBUG) {
                \Utils::objectToFile(\Yii::app()->runtimePath . '/amadeus_f_mptbs.json', $res);
                \Utils::soapLogDebugFile($api, '1A_Fare_MasterPricerTravelBoardSearch.xml');
            }
            $api->Security_SignOut();
        }
        /* @var $res \application\components\Amadeus\production\Fare_MasterPricerTravelBoardSearchReply  */
        if ($res === false) {
            return "SoapFault - check the logs for details";
        }
        if (isset($res->errorMessage->errorMessageText->description)) {
            return (string) $res->errorMessage->errorMessageText->description;
        }

        // Parse the flights
        foreach (\Utils::toArray($res->flightIndex) as $fi) {
            $segmentRef = $fi->requestedSegmentRef->segRef;
            foreach (\Utils::toArray($fi->groupOfFlights) as $gof) {
                if (empty($gof->flightDetails)) {
                    file_put_contents(\Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'amadeus_flightIndex_groupOfFlights_flightDetails.err', print_r($fi, true));
                    continue;
                }
                unset($legs);
                foreach (\Utils::toArray($gof->flightDetails) as $fd) {
                    $depart = self::formatDate($fd->flightInformation->productDateTime->dateOfDeparture) . " " . self::formatTime($fd->flightInformation->productDateTime->timeOfDeparture);
                    $arrive = self::formatDate($fd->flightInformation->productDateTime->dateOfArrival) . " " . self::formatTime($fd->flightInformation->productDateTime->timeOfArrival);
                    $carrier = $fd->flightInformation->companyId->marketingCarrier;
                    $ts = null;
                    if (isset($fd->technicalStop)) {
                        unset($tses);
                        foreach (\Utils::toArray($fd->technicalStop) as $technicalStop) {
                            $tses[] = $technicalStop->stopDetails[0]->locationId . ' ' .
                                    self::formatTime($technicalStop->stopDetails[0]->firstTime) . '-' .
                                    self::formatTime($technicalStop->stopDetails[1]->firstTime);
                        }
                        $ts = implode(', ', $tses);
                    }

                    $legs[] = [
                        'depart' => $depart,
                        'arrive' => $arrive,
                        'origin' => $fd->flightInformation->location[0]->locationId,
                        'destination' => $fd->flightInformation->location[1]->locationId,
                        'flight' => $carrier . '-' . $fd->flightInformation->flightOrtrainNumber,
                        'traveTime' => \Utils::convertSecToHoursMins(strtotime($arrive) - strtotime($depart)),
                        'aircraft' => $fd->flightInformation->productDetail->equipmentType,
                        'originTerminal' => isset($fd->flightInformation->location[0]->terminal) ? $fd->flightInformation->location[0]->terminal : null,
                        'destinationTerminal' => isset($fd->flightInformation->location[1]->terminal) ? $fd->flightInformation->location[1]->terminal : null,
                        'technicalStop' => $ts,
                    ];
                }
                $flights[$segmentRef][$gof->propFlightGrDetail->flightProposal[0]->ref] = $legs;
            }
        }
//        echo \Utils::dbg($flights);
//exit;
// Prepare taxes
        $segments = [];
        foreach (\Utils::toArray($res->recommendation) as $recommend) {
            if (empty($recommend->paxFareProduct)) {
                file_put_contents(\Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'amadeus_recommend_paxFareProduct.err', print_r($recommend, true));
                continue;
            }
            unset($passengers);
            $csd = \Utils::toArray(\Utils::toArray($recommend->paxFareProduct)[0]->paxFareDetail->codeShareDetails);
            // Skip the disabled carriers
            if (in_array($csd[0]->company, $disabledCarriers)) {
//                \Utils::dbgYiiLog('Skipping: ' . $csd[0]->company);
                continue;
            }
            foreach (\Utils::toArray($recommend->paxFareProduct) as $pfp) {
                foreach (\Utils::toArray($pfp->paxReference->traveller) as $traveler) {
                    $key = $traveler->ref;
                    if (isset($traveler->infantIndicator)) {
                        $key = count($passengers) + 1;
                    }
                    $passengers[$key]['type'] = $pfp->paxReference->ptc;
                    $passengers[$key]['fare'] = $pfp->paxFareDetail->totalFareAmount;
                    $passengers[$key]['taxes'] = $pfp->paxFareDetail->totalTaxAmount;
                    $passengers[$key]['marketingCompany'] = $csd[0]->company;
                    $passengers[$key]['text'] = '';
                    $passengers[$key]['remark'] = \RoutesCache::RFUNDABLE_YES;
                    $tax = new \Taxes;
                    $checkSum = 0;
                    foreach (\Utils::toArray($pfp->paxFareDetail->monetaryDetails) as $md) {
                        if ($md->amountType != self::TAX_TO_SKIP && $passengers[$key]['type'] != self::$paxTypes[\TravelerType::TRAVELER_INFANT]) {
                            $passengers[$key]['text'] .= "{$md->amountType}: {$md->amount}<br>";
                            $tax->arrTaxes[self::$taxesReformat[$md->amountType]] += $md->amount;
                            $checkSum += $md->amount;
                        }
                    }
                    foreach (\Utils::toArray($pfp->passengerTaxDetails->taxDetails) as $td) {
                        $passengers[$key]['text'] .= "{$td->type}: {$td->rate}<br>";
                        $tax->arrTaxes[self::$taxesReformat[$td->type]] += $td->rate;
                        $checkSum += $td->rate;
                    }
                    // Remarks parsing
                    foreach (\Utils::toArray($pfp->fare) as $fr) {
                        if ($fr->pricingMessage->freeTextQualification->textSubjectQualifier === 'PEN') {   // Only Penalties
                            if (in_array($fr->pricingMessage->freeTextQualification->informationType, self::$rescheduleIds)) {   // Reschedule fee
                                $passengers[$key]['remark'] = $fr->monetaryInformation->monetaryDetail->amount;
                            } elseif (in_array($fr->pricingMessage->freeTextQualification->informationType, self::$nonRefundableIds)) { // Non refundable
                                $passengers[$key]['remark'] = \RoutesCache::RFUNDABLE_NONE;
                            } elseif ($fr->pricingMessage->freeTextQualification->informationType == self::CHECK_PENALTY_RULES) { // Refundable with penalties
                                $passengers[$key]['remark'] = \RoutesCache::RFUNDABLE_CHECK_RULES; // "Refundable Check rules";
                            }
                        }
                    }

                    if ($checkSum != $passengers[$key]['taxes']) {  // We have tax difference - adjust with Other type tax
                        $tax->arrTaxes[\Taxes::TAX_OTHER] = $passengers[$key]['taxes'] - $checkSum;
                    }

                    $passengers[$key]['arrTaxes'] = $tax->arrTaxes;
                    foreach (\Utils::toArray($pfp->fareDetails) as $fds) {
                        $segmentRef = $fds->segmentRef->segRef;
                        foreach (\Utils::toArray($fds->groupOfFares) as $tmp) {
                            $passengers[$key]['fareBasis'][$segmentRef][] = $tmp->productInformation->fareProductDetail->fareBasis;
                            $passengers[$key]['bookingClass'][$segmentRef][] = $tmp->productInformation->cabinProduct->rbd;
                        }
                    }
                }
            }

            unset($legs);
            foreach (\Utils::toArray($recommend->segmentFlightRef) as $key => $ref) {
                $legs[$key]['total'] = 0;
                foreach (\Utils::toArray($ref->referencingDetail) as $k => $refDetail) {
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

        // Prepare the bags
        if (isset($res->serviceFeesGrp->freeBagAllowanceGrp)) {
            $bags = self::parseBags($res->serviceFeesGrp->freeBagAllowanceGrp);
        } else {
            \Utils::objectToFile(\Yii::app()->runtimePath . '/amadeus_f_mptbs_missing_freeBagAllowanceGrp.json', $res);
            $bags = [];
        }

        // Prepare the serviceCoverageInfoGrp
        if (isset($res->serviceFeesGrp->serviceCoverageInfoGrp)) {
            $luggageGroups = self::parseLuggageGroups($res->serviceFeesGrp->serviceCoverageInfoGrp);
        } else {
            \Utils::objectToFile(\Yii::app()->runtimePath . '/amadeus_f_mptbs_missing_serviceCoverageInfoGrp.json', $res);
            $luggageGroups = [];
        }

//        echo \Utils::dbg($segments);
//        exit;
        $serviceTypeId = \Airport::getServiceTypeIdFromCode($params->source, $params->destination);
        $rows = [];
        $resultCount = 0;
        foreach ($segments as $segment) {
            foreach ($segment['legs'] as $legs) {
                $rows = array_merge($rows, self::prepareCacheRow($legs, $segment['passengers'], $flights, $airSourceId, $serviceTypeId, $params->category, $bags, $luggageGroups));
                $resultCount++;
                if ($resultCount >= self::AMADEUS_MAX_SEARCH_RESULTS) {
                    break 2;  // Do not consider more than MAX_SEARCH results.
                }
            }
        }
//        echo \Utils::dbg($rows);
        return json_encode($rows);
    }

    static function prepareLegsJson($flights, $journeys, $bcData) {
        $out = [];
        foreach ($journeys as $segRef => $legsId) {
            $legOut = [];
            foreach ($flights[$segRef][$legsId] as $legId => $flight) {
                $legsJson = new \LegsJson;
                $legsJson->arrive = $flight['arrive'];
                $legsJson->depart = $flight['depart'];
                $legsJson->destination = \Airport::getAirportCodeAndCityNameFromCode($flight['destination']);
                $legsJson->destinationTerminal = $flight['destinationTerminal'];
                $legsJson->flighNumber = $flight['flight'];
                $legsJson->origin = \Airport::getAirportCodeAndCityNameFromCode($flight['origin']);
                $legsJson->originTerminal = $flight['originTerminal'];
                $legsJson->ts = $flight['technicalStop'];

                //$legsJson->time = $flight['traveTime'];
                $d_tz = \Airport::getTimezoneByCode($flight['destination']);
                $o_tz = \Airport::getTimezoneByCode($flight['origin']);

                if (isset($d_tz) && isset($o_tz)) {
                    $legsJson->time = (new \DateTime($flight['arrive'], new \DateTimeZone($d_tz)))
                            ->diff(new \DateTime($flight['depart'], new \DateTimeZone($o_tz)))
                            ->format('%H:%I');
                } else {
                    $legsJson->time = \Utils::convertSecToHoursMins(strtotime($flight['arrive']) - strtotime($flight['depart']));
                }

                $legsJson->aircraft = $flight['aircraft'];
                $legsJson->bookingClass = $bcData[$segRef][$legId];
                $legOut[] = $legsJson;
            }
            $out[] = $legOut;
        }
        return json_encode($out);   // Do not use JSON_NUMERIC_CHECK cause confilicts with Airlines with E in the code
    }

    static function prepareCacheRow($legs, $passagers, $flights, $airSourceId, $serviceTypeId, $cabinTypeId, array $bags = [], array $luggageGroups = []) {
        $rows = [];
        // strHash format: <Origin>~<departTs>~<FlightNumber>~<Destination1>~<departTs>~<FlightNumber>~<Destination2>~...
        $strHash = $airSourceId . \RoutesCache::HASH_SEPARATOR . $cabinTypeId . \RoutesCache::HASH_SEPARATOR;
        $tmpRow = new \stdClass;
        $tmpRow->stops = $legs['total'] - 1;
        unset($legs['total']);
        $tmpRow->luggage = null;
        if (isset($legs['luggageGroup'])) {
            $tmpRow->luggage = $bags[$luggageGroups[$legs['luggageGroup']][1]];
            if (isset($luggageGroups[$legs['luggageGroup']][2])) {
                $tmpRow->luggage .= ', ' . $bags[$luggageGroups[$legs['luggageGroup']][2]];
            }
            unset($legs['luggageGroup']);
        }
        $round_trip = (count($legs) === 1) ? 0 : 1;
        $firstLeg = null;
        foreach ($legs as $segRef => $flightGroup) {    // strHash preparation
            foreach ($flights[$segRef][$flightGroup] as $flight) {
                if ($firstLeg === null) {
                    $firstLeg = $flight;
                }
                $strHash .= $flight['origin'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flight['depart'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flight['flight'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flight['destination'] . \RoutesCache::HASH_SEPARATOR;
            }
        }
        $tmpJourney = reset($legs);
        $lastLeg = end($flights[key($legs)][$tmpJourney]);
        $tmp = explode('-', $firstLeg['flight']);
        $tmpDepart = explode(' ', $firstLeg['depart']);
        $tmpArrive = explode(' ', $lastLeg['arrive']);
        // default values
        if ($round_trip === 0) {
            $order = \RoutesCache::ORDER_SINGLE_JOURNEY;    // Single journey
            list($tmpRow->return_date, $tmpRow->return_time) = [null, null];
        } else {
            $order = \RoutesCache::ORDER_ALL_JOURNEYS;    // Second journey from 2
            $tmpJourney = end($legs);
            list($tmpRow->return_date, $tmpRow->return_time) = explode(' ', $flights[key($legs)][$tmpJourney][0]['depart']);
        }

        $tmpRow->origin_id = \Airport::getIdFromCode($firstLeg['origin']);
        $tmpRow->destination_id = \Airport::getIdFromCode($lastLeg['destination']);
        $tmpRow->flight_number = $tmp[1];
        $tmpRow->carrier_id = \Carrier::getIdFromCode($passagers[1]['marketingCompany']);
        // Do not include disabled airlines in the results
        if (\Carrier::getIsDisabled($tmpRow->carrier_id)) {
            return [];
        }
//        $tmpRow->booking_class = $bics[$segRef][$firstLedId];
        $tmpRow->departure_date = $tmpDepart[0];
        $tmpRow->departure_time = $tmpDepart[1];
        $tmpRow->arrival_date = $tmpArrive[0];
        $tmpRow->arrival_time = $tmpArrive[1];
        $tmpRow->legsJson = self::prepareLegsJson($flights, $legs, $passagers[1]['bookingClass']);
        $processedPaxTypes = [];
        foreach ($passagers as $passager) {
            // Skip processed pax types
            if (isset($processedPaxTypes[$passager['type']])) {
                continue;
            }
            $processedPaxTypes[$passager['type']] = true;
            $row = new \RoutesCache;
            $row->cabin_type_id = $cabinTypeId;
            $row->departure_date = $tmpRow->departure_date;
            $row->departure_time = $tmpRow->departure_time;
            $row->arrival_date = $tmpRow->arrival_date;
            $row->arrival_time = $tmpRow->arrival_time;
            $row->return_date = $tmpRow->return_date;
            $row->return_time = $tmpRow->return_time;
            $row->origin_id = $tmpRow->origin_id;
            $row->destination_id = $tmpRow->destination_id;
            $row->carrier_id = $tmpRow->carrier_id;
            $row->stops = $tmpRow->stops;
            $row->flight_number = $tmpRow->flight_number;
//            $row->booking_class = $tmpRow->booking_class;
            $row->legs_json = $tmpRow->legsJson;
            $row->grouping = \RoutesCache::getNextGroupId();
            $row->order_ = $order;
            $row->round_trip = $round_trip;
            $row->traveler_type_id = self::$paxTypeIds[$passager['type']];
            $row->hash_str = $strHash . $row->traveler_type_id;
            $row->hash_id = "x'" . str_pad(hash('fnv164', $row->hash_str), 16, '0', STR_PAD_LEFT) . "'::int8";
            $row->fare_basis = $passager['fareBasis'][1][0];
            $row->last_check = date(DATETIME_FORMAT);
            $row->updated = date(DATETIME_FORMAT);
            $row->air_source_id = $airSourceId;
            $row->service_type_id = $serviceTypeId;
            // Taxes
            $row->total_fare = (float) $passager['fare'];
            $row->total_taxes = $passager['taxes'];
            $row->base_fare = $row->total_fare - $row->total_taxes;
            $row->tax_jn = $passager['arrTaxes'][\Taxes::TAX_JN];
            $row->tax_other = $passager['arrTaxes'][\Taxes::TAX_OTHER];
            $row->tax_psf = $passager['arrTaxes'][\Taxes::TAX_PSF];
            $row->tax_udf = $passager['arrTaxes'][\Taxes::TAX_UDF];
            $row->tax_yq = $passager['arrTaxes'][\Taxes::TAX_YQ];
            $row->luggage = $row->traveler_type_id === \TravelerType::TRAVELER_INFANT ? null : $tmpRow->luggage;
            $row->refundable = isset($passager['remark']) ? $passager['remark'] : null;

            $rows[] = $row->attributes;
            end($rows);
            unset($rows[key($rows)]['id']);     // Unset the id array element
        }
        return $rows;
    }

    /**
     * @param int $airSourceId Description
     * @param array $inputs
     * @param array $travelers
     * @param string $fop
     * @param array $cc Credit card details
     */
    static function checkAvailabilityAndFares($airSourceId, array $inputs, array $travelers, $fop = null) {
//        !YII_DEBUG || \Utils::dbgYiiLog($inputs);
        // Skip this check if test air source is used
//        if ($airSourceId == Utils::DEFAULT_AIRSOURCES_TEST_ID) {
//            return true;
//        }

        $params = new \stdClass;
        $params->category = (int) $inputs['cabinTypeId'];
        $firstJourney = reset($inputs['segments']);
        $lastJourney = end($inputs['segments']);
        $params->source = reset($firstJourney)['origin'];
        $params->destination = end($firstJourney)['destination'];
        $params->depart = reset($firstJourney)['depart'];
        $params->return = count($inputs['segments']) > 1 ? reset($lastJourney)['depart'] : null;
        $params->type_id = count($inputs['segments']) > 1 ? \Searches::TYPE_ROUND_TRIP : \Searches::TYPE_ONE_WAY;
        $params->adults = 0;
        $params->children = 0;
        $params->infants = 0;
        $paxCountByTypes = [
            \TravelerType::TRAVELER_ADULT => 0,
            \TravelerType::TRAVELER_CHILD => 0,
            \TravelerType::TRAVELER_INFANT => 0,
        ];
        $expectedPrice = 0;
        foreach ($travelers as $traveler) {
            switch ($traveler['traveler_type_id']) {
                case \TravelerType::TRAVELER_ADULT:
                    $params->adults++;
                    $paxCountByTypes[\TravelerType::TRAVELER_ADULT] ++;
                    break;
                case \TravelerType::TRAVELER_CHILD:
                    $params->children++;
                    $paxCountByTypes[\TravelerType::TRAVELER_CHILD] ++;
                    break;
                case \TravelerType::TRAVELER_INFANT:
                    $params->infants++;
                    $paxCountByTypes[\TravelerType::TRAVELER_INFANT] ++;
                    break;
            }
            if (!isset($inputs['pax'][$traveler['traveler_type_id']])) {
                return [
                    'errorCode' => \ApiInterface::OTHER_ERROR,
                    'priceDiff' => 0,
                    'message' => 'Undefined traveller in the pax collection'
                ];
            }
            $expectedPrice += $inputs['pax'][$traveler['traveler_type_id']]['totalFare'];
        }

        $paxToFind = array_filter($paxCountByTypes);
//        echo \Utils::dbg($paxToFind);
//        echo \Utils::dbg($params);
//        echo \Utils::dbg("Expected price: $expectedPrice");
        $strHash = $airSourceId . \RoutesCache::HASH_SEPARATOR . $params->category . \RoutesCache::HASH_SEPARATOR . self::hashFromSegments($inputs['segments']);
//        echo \Utils::dbg("Hash string: $strHash");
        $expectedBookingClasses = self::bookingClassFromSegments($inputs['segments']);
//        echo \Utils::dbg("Expected Booking classes: $expectedBookingClasses");
        $bookingClassesFound = false;

        $airSource = \AirSource::model()->with('backend')->cache(120)->findByPk($airSourceId);
        $res = json_decode(call_user_func($airSource->backend->search, $airSourceId, $params), true);

        if (!is_array($res)) {  // Not array means some error
            return [
                'errorCode' => \ApiInterface::OTHER_ERROR,
                'priceDiff' => 0,
                'message' => $res
            ];
        }
		
		\application\components\Reporting\Statistics::addAvailabilityAndFareCheck();
        $receivedPrice = 0;
        $matchedRows = [];
        foreach ($res as $row) {
//            $rowHash = preg_replace('/\~..-/', '~**-',substr($row['hash_str'], 0, -1));
            $rowHash = substr($row['hash_str'], 0, -1);
//            echo \Utils::dbg($rowHash);
            if ($rowHash === $strHash) {
                $matchedRows[] = $row;
                // calculate the fare
                $receivedPrice += $row['total_fare'] * $paxCountByTypes[$row['traveler_type_id']];
                // check for the booking clases
                if (!$bookingClassesFound && $expectedBookingClasses == \RoutesCache::extractBookingClasses($row['legs_json'])) {
                    $bookingClassesFound = true;
                }
                unset($paxToFind[$row['traveler_type_id']]);
                if (empty($paxToFind)) {
                    break;  // We found them all
                }
            }
        }
//        echo \Utils::dbg(array_splice($res, 0, 6));
//        echo \Utils::dbg('matchedRows');
//        echo \Utils::dbg($matchedRows);
        // Some of the paxes are not offered in the results - no seats available
        if (count($paxToFind)) {
            \application\components\Reporting\Statistics::addAvailabilityAndFareCheckUnavailable();
            return [
                'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                'priceDiff' => 0,
                'message' => \ApiInterface::$errorMessages[\ApiInterface::FLIGHT_UNAVAILABLE]
            ];
        }

        // Do we have a price mismatch
        if (round($receivedPrice) !== round($expectedPrice)) {
            \application\components\Reporting\Statistics::addAvailabilityAndFareCheckFareChanged();
            \RoutesCache::updateResults($matchedRows);
            $fareError = $receivedPrice > $expectedPrice ? \ApiInterface::FARE_INCREASED : \ApiInterface::FARE_DECREASED;
            return [
                'errorCode' => $fareError,
                'priceDiff' => $receivedPrice - $expectedPrice,
                'message' => \ApiInterface::$errorMessages[$fareError]
            ];
        }

        // Do we have a booking class mismatch
        if (!$bookingClassesFound) {
            \RoutesCache::updateResults($matchedRows);
//            if (YII_DEBUG) {
            return [
                'errorCode' => \ApiInterface::SEARCH_AGAIN,
                'priceDiff' => 0,
                'message' => \ApiInterface::$errorMessages[\ApiInterface::SEARCH_AGAIN]
            ];
//            }
        }

        // All is OK seats are available and the fare is the same
        return true;
    }

    static function hashFromSegments(array $journeys) {
        $strHash = '';
        foreach ($journeys as $journey) {    // strHash preparation
            foreach ($journey as $flight) {
                $strHash .= $flight['origin'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flight['departTs'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flight['marketingCompany'] . '-' . $flight['flightNumber'] . \RoutesCache::HASH_SEPARATOR;
//                $strHash .= '**-' . $flight['flightNumber'] . \RoutesCache::HASH_SEPARATOR;
                $strHash .= $flight['destination'] . \RoutesCache::HASH_SEPARATOR;
            }
        }
        return $strHash;
    }

    /**
     * Concatenate all booking classes for all segments in the journeys
     * @param array $journeys
     * @return string
     */
    static function bookingClassFromSegments(array $journeys) {
        $out = '';
        foreach ($journeys as $journey) {
            foreach ($journey as $flight) {
                $out .= $flight['bookingClass'];
            }
        }
        return $out;
    }

    /**
     * Parse the technical stops
     * @param \stdClass $legInfo
     * @return string|bool The combined technical stops and time like (BLR 13:00-13:30) or null
     */
    static function parseTechnicalStops($legInfo) {
        // Single leg
        if (!is_array($legInfo)) {
            return null;
        }
        $legs = [];
        $out = '';
        foreach ($legInfo as $leg) {
            $legs[] = [
                'origin' => $leg->legTravelProduct->boardPointDetails->trueLocationId,
                'destination' => $leg->legTravelProduct->offpointDetails->trueLocationId,
                'depart' => $leg->legTravelProduct->flightDate->departureTime,
                'arrive' => $leg->legTravelProduct->flightDate->arrivalTime
            ];
        }
        for ($i = 0; $i < count($legs) - 1; $i++) {
            $out .= $legs[$i]['destination'] . ' ' .
                    self::formatTime($legs[$i]['arrive']) . '-' .
                    self::formatTime($legs[$i + 1]['depart']) . ', ';
        }

        return rtrim($out, ', ');
    }

    static function parseBags($freeBagAllowanceGrp) {
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

    static function parseLuggageGroups($serviceCoverageInfoGrp) {
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

}
