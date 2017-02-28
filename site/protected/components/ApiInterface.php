<?php

/**
 * Description of ApiInterface
 *
 * @author Boxx
 * @package API Interface
 */
class ApiInterface {

    const FLIGHT_UNAVAILABLE = 1;
    const FARE_INCREASED = 2;
    const FARE_DECREASED = 3;
    const INVALID_AIRSOURCE = 4;
    const INVALID_TRAVELER = 5;
    const OTHER_ERROR = 6;
    const SEARCH_AGAIN = 7;
    const FAKE_PNR = 'PENDING';

    static $errorMessages = [
        self::FLIGHT_UNAVAILABLE => 'There are no available seats for the flight',
        self::FARE_INCREASED => 'The fare has increased',
        self::FARE_DECREASED => 'The fare has decreased',
        self::INVALID_AIRSOURCE => 'This provider do not have the capability to check the seat availability and the fares',
        self::INVALID_TRAVELER => 'Traveler not found',
        self::OTHER_ERROR => 'Availability and fare check error',
        self::SEARCH_AGAIN => 'Fare basis change. Please repeat the search!',
    ];

    /**
     * Check if the fare is the same and
     * @param int $airSourceId AirSource ID
     * @param array $data The booking data (segments, pax, cabinTypeId)
     * @param array $travelers The travelers
     * @return boolean TRUE if we have a match or array with [errorCode, priceDiff] elements
     */
    static function checkAvailabilityAndFares($airSourceId, array $data, array $travelers) {
        set_time_limit(60);
        $airSource = AirSource::model()->with('backend')->findByPk((int) $airSourceId);
        /* @var $airSource \AirSource */
        if ($airSource->backend->isAmadeus) {
            return \application\components\Amadeus\Utils::checkAvailabilityAndFares($airSourceId, $data, $travelers, $airSource->fop);
        }
        if ($airSource->backend->getIsScrapper()) {
            $scraperBook = new scrapperBooking();
            $scraperBook->airSourceId = $airSourceId;
            $scraperBook->segments = $data['segments'];
            $scraperBook->pax = $data['pax'];
            $scraperBook->data = $data;
            $scraperBook->travellers = $travelers;
            return $scraperBook->checkAvailabilityAndFares();
        }
        $pnrManagement = new $airSource->backend->pnr_book;
        /* @var $pnrManagement \application\components\api_interfaces\IpnrManagement  */
 
        $passengers = self::buildPassengers($travelers, $data['pax']);
        if ($passengers === null) {
            return [
                'errorCode' => self::INVALID_TRAVELER,
                'priceDiff' => 0,
                'message' => self::$errorMessages[self::INVALID_TRAVELER]
            ];
        }
        $pnrManagement->addPassengers($passengers['passengers']);
        $pnrManagement->addAirSegments($data['segments']);
        $pnrManagement->addCashFop();
        
        // Prepare the Goair credentials
        $credentials = [];
        if ($airSource->backend->isGoair) {
            $credentials = \application\components\api_interfaces\Goair\Utils::getCredentials($airSourceId);
        }
        // Prepare the Flydubai credentials
        if ($airSource->backend->isFlydubai) {
            $credentials = \application\components\api_interfaces\Flydubai\Utils::getCredentials($airSourceId);
            $pnrManagement->cabinTypeId= $data['cabinTypeId'];
        }

        // Can this air source do the check
        if (!method_exists($pnrManagement, 'checkAvailabilityAndFares')) {
            return [
                'errorCode' => self::INVALID_AIRSOURCE,
                'priceDiff' => 0,
                'message' => self::$errorMessages[self::INVALID_AIRSOURCE]
            ];
        }

        // Connect to the API
        $pnrManagement->connect($airSource->backend->wsdl_file, $credentials, $airSourceId);

        // Do the checking
        $check = $pnrManagement->checkAvailabilityAndFares();
        if (is_string($check)) {    // String means error
            return [
                'errorCode' => self::OTHER_ERROR,
                'priceDiff' => 100,
                'message' => $check
            ];
        }
        if (isset($check['details'])) {
            $check['message'] = $check['details'];
        }

        return $check;

        // Possible return formats
        // We have price increasse +100
//        $out = [
//            'errorCode' => self::FARE_INCREASED,
//            'priceDiff' => 100,
//        ];
//
//        // We have price decrease -100
//        $out = [
//            'errorCode' => self::FARE_DECREASED,
//            'priceDiff' => -100,
//        ];
//
//        // All the seats are sold out
//        $out = [
//            'errorCode' => self::FLIGHT_UNAVAILABLE,
//            'priceDiff' => 0,
//        ];
//
//        // True means we have full match
//        $out = true;
    }

    static function book($airSourceId, $data, $travelers, $fop, $cc = null, $marketingCarrierId = null, $manualIssue = false) {
        set_time_limit(60);
//        \Utils::dbgYiiLog($airSourceId);
//        \Utils::dbgYiiLog($data);
//        \Utils::dbgYiiLog($travelers);
//        \Utils::dbgYiiLog($fop);
//        \Utils::dbgYiiLog($cc);
//        exit;
        // build the passengers array
        $airSource = AirSource::model()->with('backend')->findByPk((int) $airSourceId);
        /* @var $airSource \AirSource */
        if ($airSource->backend->getIsScrapper()) {
            return \scrapperBooking::book((int) $airSourceId, $data, $travelers, $fop, $cc);
        }
        if (empty($airSource->backend->pnr_book)) {
            return ['error' => 'This provider do not have book capability'];
        }

        $pnrManagement = new $airSource->backend->pnr_book;
        /* @var $pnrManagement \application\components\api_interfaces\IpnrManagement  */

        // Build the passengers array
        $i = 1;
        $totalFare = 0;
        $paxMobile = null;
//        $existingPaxes = [];
        foreach ($travelers as $traveler) {
            $model = Traveler::model()->with('travelerTitle')->findByPk($traveler['id']);
            if ($model === null) {
                return ['error' => 'Traveler is not set'];
            }

//            if (in_array($model->id, $existingPaxes)) {
//                continue;   // Do not create duplicate paxes
//            }
//            $existingPaxes[] = (int) $model->id;

            $dob = null;
            if (!empty($traveler['birthdate'])) {
                $dob = $traveler['birthdate'];
            } elseif (!empty($model->birthdate)) {
                $dob = $model->birthdate;
            }
//            else if ((int) $traveler['traveler_type_id'] == \TravelerType::TRAVELER_ADULT)
//                $dob = date('Y-m-d', strtotime(date("Y-m-d", mktime()) . " - 20 year"));
//            else if ((int) $traveler['traveler_type_id'] == \TravelerType::TRAVELER_CHILD)
//                $dob = date('Y-m-d', strtotime(date("Y-m-d", mktime()) . " - 8 year"));
//            else if ((int) $traveler['traveler_type_id'] == \TravelerType::TRAVELER_INFANT)
//                $dob = date('Y-m-d', strtotime(date("Y-m-d", mktime()) . " - 1 year"));

            /* @var $model Traveler */
            $passengers[$i] = [
                'id' => $model->id,
                'firstName' => $model->first_name,
                'lastName' => $model->last_name,
                'title' => $model->travelerTitle->name,
                'type' => (int) $traveler['traveler_type_id'],
                'birthDate' => (string) $dob,
                'user_info_id' => $model->user_info_id,
                'amount' => (float) $data['pax'][$traveler['traveler_type_id']]['totalFare'],
                'ff' => [], /* @todo Frequent flyers */
                'SSRs' => [], /* @todo Special service requests */
                'mobile' => $model->mobile ? : $model->phone,
                'email' => (string) $model->email,
            ];
            if (!empty($passengers[$i]['mobile'])) {
                $paxMobile = $passengers[$i]['mobile'];
            }
            $i++;
            $totalFare += (float) $data['pax'][$traveler['traveler_type_id']]['totalFare'];
        }
//        \Utils::dbgYiiLog($passengers); exit;
//        echo Utils::dbg($passengers);
//        echo "Total fare: $totalFare\n";
        $pnrManagement->addPassengers($passengers);
//        \Utils::dbgYiiLog($pnrManagement); exit;
        if ($manualIssue) {
            $pnrManagement->manualIssue = true;
        }

        if ((!empty($fop) && $airSource->isAutoTicket($data['segments'])) || $manualIssue) {
            // \Utils::dbgYiiLog('manual issue');
            if ($fop == 'CC') { // CC payment
                $pnrManagement->addCcFop($cc['code'], $cc['exp_date'], $cc['number']);
            } else {    // Cash payment
                $pnrManagement->addCashFop();
            }
        }
//        echo Utils::dbg($pnrManagement);

        $credentials = [];
        // Prepare Goair credentials
        if ($airSource->backend->isGoair) {
            $credentials = \application\components\api_interfaces\Goair\Utils::getCredentials($airSourceId, $paxMobile);
        }
        // Prepare FlyDubai credentials
        if ($airSource->backend->isFlydubai) {
            $credentials = \application\components\api_interfaces\Flydubai\Utils::getCredentials($airSourceId, $paxMobile);
            $pnrManagement->cabinTypeId= $data['cabinTypeId'];
        }
//        \Utils::dbgYiiLog($credentials);
        $pnrManagement->connect($airSource->backend->wsdl_file, $credentials, $airSourceId);
        // Extra booking parameters
        if (isset($data['params'])) {
            $extraParams = $data['params'];
        } else {
            $extraParams = [];
        }
        // Queueing params
        if ($airSource->backend->isGds) {
            // Booking Queues
            $airSourceQueueing = $airSource->getQueuingParams($data['segments']);
            $extraParams = array_merge($extraParams, $airSourceQueueing);
            // Tour codes
            $pnrManagement->setTourCode($airSource->getTourCode(self::extractCarrier($data['segments'])));
            // Private fate
            $pnrManagement->setPrivateFare($airSource->getPrivateFare(self::extractCarrier($data['segments'])));
        }
        $pnrManagement->addAirSegments($data['segments']);
        $createResponse = $pnrManagement->createPnr($extraParams);
        if (!empty($createResponse['error'])) {
            \Utils::dbgYiiLog($createResponse);
            return $createResponse;
        }
//        Utils::dbgYiiLog($createResponse);
        sleep(3);   // Give some time to the API to assign airPnrs and ticket numbers
        try {
            // Acquire the new AirCart
            $acquisitionResponse = call_user_func($airSource->backend->pnr_acquisition, $createResponse['pnr'], $airSourceId);
        } catch (\Exception $e) {
            \Utils::dbgYiiLog($e);
            return ['error' => "Aquisition exception for PNR: {$createResponse['pnr']}  Please call the customer service!"];
        }
        if (!empty($acquisitionResponse['message'])) {
            return ['error' => $acquisitionResponse['message']];
        }
        // Add the cabin type
        $airCart = AirCart::model()->with('airBookings')->findByPk($acquisitionResponse['airCartId']);
        /* @var $airCart \AirCart */
        foreach ($airCart->airBookings as $airBooking) {
            $airBooking->cabin_type_id = (int) $data['cabinTypeId'];
            $airBooking->update(['cabin_type_id']);
        }
//        $airCart->setBookingStatus();     // This is not needed here it is done in the acquirePnr function
//        $airCart->applyBothRules();
        $airCart->addNote('PNR via ' . $airSource->name);
        if (!empty($createResponse['notes'])) {
            $airCart->addNote($createResponse['notes']);
        }
        // Return the newly created cartID
        return ['airCartId' => $airCart->id];
    }

    /**
     * Universal PNR acquisition using interface IpnrAcquisition
     * @param application\components\api_interfaces\IpnrAcquisition $r
     */
    static function acquirePnr($r) {
       
        set_time_limit(60);
        $segments = $r->getSegments();
        if (empty($segments)) {     // This PNR is cancelled
            return ['message' => 'This PNR is cancelled. Can not be imported'];
        }
        if (is_string($segments)) {     // This PNR is cancelled
            return ['message' => $segments];
        }
//        \Utils::dbgYiiLog($segments);
        $passengers = $r->getPassengers();
        if (empty($passengers)) {
            return ['message' => 'Something is wrong there are no passengers'];
        }
        
        $journeys = $r->getJourneys();
        if (empty($journeys)) {
            return ['message' => 'Something is wrong journeys are not defined'];
        }
//        \Utils::dbgYiiLog($journeys);
        $fares = $r->getFares();
        $fareBasis = $r->getFareBasis();
        $ffs = $r->getFFs();
        $meals = $r->getMeals();
        $seats = $r->getSeats();
        $endorsment = $r->getEndorsments();
        $tourCode = $r->getTourCode();
        if (method_exists($r, 'getPrivateFare')) {
            $privateFare = $r->getPrivateFare();
        } else {
            $privateFare = null;
        }
        $airPnr = $r->getAirPnrs();
        $tickets = $r->getTickets();

        // Session parameters
        $activeUserId = \Utils::getActiveUserId();
        $activeUserInfoId = \Utils::getActiveCompanyId();
        $loggedUserId = \Utils::getLoggedUserId();

        // Create the AirCart
        $airCart = new \AirCart;
        $airCart->user_id = $activeUserId;        // \Utils::getActiveUserId();
        $airCart->loged_user_id = $loggedUserId;          // \Utils::getLoggedUserId();
        $airCart->payment_status_id = \PaymentStatus::STATUS_NOT_CHARGED;
        $airCart->booking_status_id = \BookingStatus::STATUS_NEW;
        $airCart->approval_status_id = \ApprovalStatus::STATUS_NOT_REQUIRED;
        $airCart->website_id=\AirCart::getWebsiteId();
//        $airCart->note = 'Manual PNR acquisition';
        $airCart->insert();
        
        foreach ($passengers as $paxKey => $passenger) {
            // Create travellers if missing
            $traveler = new \Traveler;
            $traveler->user_info_id = $activeUserInfoId;
            $traveler->first_name = $passenger['firstName'];
            $traveler->last_name = $passenger['lastName'];
            $traveler->traveler_title_id = empty($passenger['title']) ? \TravelerTitle::DEFAULT_TITLE : \TravelerTitle::extractTitleFromNameEnd($passenger['title']);
            $traveler->birthdate = empty($passenger['birthDate']) ? null : $passenger['birthDate'];
            $traveler->id = $traveler->insertIfMissing();
            // Add FFs
            if (isset($ffs[$paxKey])) {
                foreach ($ffs[$paxKey] as $ff) {
                    FfSettings::insertIfMissing($traveler->id, $ff['airline'], $ff['code']);
                }
            }
            $addFare = true;  // Flag to add the fare once per pax
            foreach ($journeys as $journey) {
               
                // Add this AirBooking
                $airBooking = new \AirBooking;
                $airBooking->airline_pnr = isset($airPnr[$journey[0]]) ? $airPnr[$journey[0]] : null;    // AirPnr of the first segment in the journey
                $airBooking->crs_pnr = isset($r->pnrStr) ? $r->pnrStr : null;
                $airBooking->booking_type_id = \BookingType::MANUAL_BY_PNR;
                $airBooking->air_source_id = $r->airSourceId;
                $airBooking->traveler_type_id = $passenger['type'];
                $airBooking->traveler_id = $traveler->id;
                $airBooking->source_id = \Airport::getIdFromCode($segments[$journey[0]]['origin']);    // Origin of the first segment in the journey
                $legsCount = count($journey) - (empty($journey['fares']) ? 1 : 2);
                $airBooking->destination_id = \Airport::getIdFromCode($segments[$journey[$legsCount]]['destination']);    // Destination of the last segment in the journey
                $airBooking->carrier_id = \Carrier::getIdFromCode($segments[$journey[0]]['marketingCompany']);
                $airBooking->departure_ts = $segments[$journey[0]]['departTs'];
                $airBooking->arrival_ts = $segments[$journey[$legsCount]]['arriveTs'];
                $airBooking->service_type_id = \ServiceType::getServiceType($airBooking->source_id, $airBooking->destination_id);
                $airBooking->fare_basis = !empty($fareBasis[$paxKey][$journey[0]]) ? $fareBasis[$paxKey][$journey[0]] : null;
                $airBooking->booking_class = $segments[$journey[0]]['bookingClass'];
                $airBooking->product_class = !empty($segments[$journey[0]]['productClass']) ? $segments[$journey[0]]['productClass'] : null;
                $airBooking->fare_type_id = \FareType::getFareType($airBooking->carrier_id, $airBooking->booking_class);
                $airBooking->frequent_flyer = empty($ffs[$paxKey]) ? null : self::mergeFfs($ffs[$paxKey]);
                $airBooking->tour_code = $tourCode;
                $airBooking->private_fare = $privateFare;
                $airBooking->endorsment = !empty($endorsment[$paxKey][$journey[0]]) ? $endorsment[$paxKey][$journey[0]] : null;
                $airBooking->air_cart_id = $airCart->id;
                if (!empty($journey['fares'])) {
                    $addFare = true;
                    $fares = $journey['fares'];
                }
                $airBooking->private_fare = $fares[$paxKey]['privateFare'];
                // Fill up the fares data for the first segment
                if ($addFare) {
                    $airBooking = \Taxes::fillTaxesInAirBooking($airBooking, $fares[$paxKey]['arrTaxes']);
                    $airBooking->basic_fare = $fares[$paxKey]['baseFare'];
                    $addFare = false;
                }
                if (isset($tickets[$paxKey][$journey[0]])) {
                    $airBooking->ticket_number = $tickets[$paxKey][$journey[0]];
                }
                //\Utils::dbgYiiLog($airBooking->attributes);
             
                $airBooking->insert();

                foreach ($journey as $segmentKey) {
                    if (is_array($segmentKey)) {
                        continue;       // Skip the fares element
                    }
                    // Add this AirRoute
                    $airRoute = new \AirRoutes;
                    $airRoute->air_booking_id = $airBooking->id;
                    $airRoute->airPnr = isset($airPnr[$segmentKey]) ? $airPnr[$segmentKey] : null;
                    $airRoute->aircraft = $segments[$segmentKey]['aircraft'];
                    $airRoute->arrival_ts = $segments[$segmentKey]['arriveTs'];
                    $airRoute->booking_class = $segments[$segmentKey]['bookingClass'];
                    $airRoute->carrier_id = \Carrier::getIdFromCode(isset($segments[$segmentKey]['operatingCompany']) ? $segments[$segmentKey]['operatingCompany'] : $segments[$segmentKey]['marketingCompany']);
                    $airRoute->departure_ts = $segments[$segmentKey]['departTs'];
                    $airRoute->destination_id = \Airport::getIdFromCode($segments[$segmentKey]['destination']);
                    $airRoute->destination_terminal = $segments[$segmentKey]['arrivalTerminal'];
                    $airRoute->fare_basis = empty($fareBasis[$paxKey][$segmentKey]) ? null : $fareBasis[$paxKey][$segmentKey];
                    $airRoute->flight_number = $segments[$segmentKey]['flightNumber'];
                    $airRoute->source_id = \Airport::getIdFromCode($segments[$segmentKey]['origin']);
                    $airRoute->source_terminal = $segments[$segmentKey]['departureTerminal'];
                    $airRoute->seat = empty($seats[$paxKey][$segmentKey]) ? null : $seats[$paxKey][$segmentKey];
                    $airRoute->meal = empty($meals[$paxKey][$segmentKey]) ? null : $meals[$paxKey][$segmentKey];
                    $airRoute->insert();
                }
                $airBooking->setAirRoutesOrder();
            }
        }
//        $airCart->refresh();
//        $airCart->applyBothRules();
//        $airCart->setBookingStatus(true);
        return ['airCartId' => $airCart->id];
    }

    static function mergeFfs(array $ffs) {
        $out = '';
        foreach ($ffs as $ff) {
            $out = $ff['airline'] . $ff['code'] . ", ";
        }
        return rtrim($out, ", ");
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
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        $api = new $airSource->backend->api_source($airSourceId);
        $pnr = $api->pnrRetrieve($pnrCode);
        // If string is returned , than this is a error
        if (is_string($pnr)) {
            return ['error' => $pnr];
        }
        if (YII_DEBUG) {
            \Utils::objectToFile('pnr_structure.json', $pnr);
        }
        $response = new $airSource->backend->pnr_load($pnr, $airSourceId);
        /* @var $response application\components\api_interfaces\IpnrAcquisition */
        $segments = $response->getSegments();
        if (empty($segments)) {  // This PNR is cancelled
//            $airCart->cancel();   // For now we do not carry the automatic cancellation.
            if ($airCart->booking_status_id === \BookingStatus::STATUS_CANCELLED) {
                return ['message' => "Nothing new in PNR: $pnrCode"];
            } else {
                return ['error' => "PNR: $pnrCode is cancelled. Please use amendment feature to reflect the change!"];
            }
        }
        // General error condition
        if (is_string($segments)) {
            return ['error' => "PNR: $pnrCode - $segments"];
        }
        $issuedTickets = $response->getTickets();
        $meals = $response->getMeals();
        $seats = $response->getSeats();
        $endorsment = $response->getEndorsments();
        $airPnr = $response->getAirPnrs();
        $passengers = $response->getPassengers();
        $newTickets = false;
        $newAirPnrs = false;
        $newSeats = false;
        $newMeals = false;
        $newEndorse = false;
        foreach ($airCart->airBookings as $airBooking) {

            // Skip the bookings that has different pnrs
            if ($airBooking->crs_pnr != $pnrCode) {
                continue;
            }
            
            foreach ($airBooking->airRoutes as $airRoute) {
                // Setting the traceler_type_id to be the same as the one in the air_booking so we can compare and match the pax not only via names, but also via type
                $airBooking->traveler->traveler_type_id = $airBooking->traveler_type_id;
                $pt = self::findPT($passengers, $airBooking->traveler);
                $st = self::findST($segments, $airRoute);

                // Check for new air PNRs
                if (!empty($airPnr[$st]) && $airBooking->airline_pnr != $airPnr[$st]) {
                    $airBooking->airline_pnr = $airPnr[$st];
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
                if ($airBooking->endorsment != $endorsment) {
                    $airBooking->endorsment = $endorsment;
                    $newEndorse = true;
                    $airBooking->update(['endorsment']);
                }

                // Check for new seats
                if (!empty($seats[$pt][$st]) && $airRoute->seat != $seats[$pt][$st]) {
                    $airRoute->seat = $seats[$pt][$st];
                    $newSeats = true;
                    $airRoute->update(['seat']);
                }

                // Check for new meals
                if (!empty($meals[$pt][$st]) && $airRoute->meal != $meals[$pt][$st]) {
                    $airRoute->meal = $meals[$pt][$st];
                    $newMeals = true;
                    $airRoute->update(['meal']);
                }
            }
        }

        $message = '';
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

    static function findPT($passengers, \Traveler $matchingPassenger) {
        // Match and update the passengers with PT (passanger tatoo)
        foreach ($passengers as $keyFromPnr => $pnrPassenger) {
            if ($pnrPassenger['firstName'] == strtoupper($matchingPassenger->first_name) &&
                    $pnrPassenger['lastName'] == strtoupper($matchingPassenger->last_name) &&
                    $pnrPassenger['type'] == $matchingPassenger->traveler_type_id) {
                return $keyFromPnr;
            }
        }
        return null;
    }

    static function findST(array $segments, \AirRoutes $matchingAirRoute) {
        // Match and update the passengers with PT (passanger tatoo)
        foreach ($segments as $keyFromPnr => $pnrAirRoute) {
            if (\Airport::getIdFromCode($pnrAirRoute['origin']) == $matchingAirRoute->source_id &&
                    \Airport::getIdFromCode($pnrAirRoute['destination']) == $matchingAirRoute->destination_id &&
                    $pnrAirRoute['flightNumber'] == $matchingAirRoute->flight_number) {
                return $keyFromPnr;
            }
        }
        return null;
    }

    static function buildPassengers(array $travelers, array $paxData) {
        // Build the passengers array
        $passengers = [];
        $totalFare = 0;
        $paxMobile = null;
        $i = 1;
        foreach ($travelers as $traveler) {
            $model = Traveler::model()->with('travelerTitle')->findByPk($traveler['id']);
            if ($model === null) {
                return null;
            }
            /* @var $model Traveler */
            $passengers[$i] = [
                'id' => $model->id,
                'firstName' => $model->first_name,
                'lastName' => $model->last_name,
                'title' => $model->travelerTitle->name,
                'type' => (int) $traveler['traveler_type_id'],
                'birthDate' => $model->birthdate,
                'amount' => $paxData[$traveler['traveler_type_id']]['totalFare'],
                'ff' => [], /* @todo Frequent flyers */
                'SSRs' => [], /* @todo Special service requests */
                'mobile' => $model->mobile,
            ];
            $i++;
            if (!empty($model->mobile) && empty($paxMobile)) {
                $paxMobile = $model->mobile;
            }
            $totalFare += (float) $paxData[$traveler['traveler_type_id']]['totalFare'];
        }
        return [
            'passengers' => $passengers,
            'totalFare' => $totalFare,
            'paxMobile' => $paxMobile,
        ];
    }

    /**
     * Extract the Airline from the segments data structure
     * @param array $segments The itinerary segments data structure
     * @return string 2 letter Airline code
     */
    static function extractCarrier($segments) {
        $firstSegment = reset($segments);
        return isset(reset($firstSegment)['marketingCompany']) ? reset($firstSegment)['marketingCompany'] : null;
    }

    /**
     * Create fake booking for statistical purposes.
     * Once the real cart is created this one has to be removed using the method removeFake from AirCart class
     *
     * @param int $airSourceId
     * @param array $data Booking information
     * @param array $travelers travelers data
     * @param int $clientSource The client source for the cart
     * @param int $marketingCarrierId  The marketing airline
     * @return int AirCart ID
     */
    static function fakeBook($airSourceId, array $data, array $travelers, $clientSource = \ClientSource::SOURCE_DIRECT, $marketingCarrierId = null) {
        $existingPaxes = [];
        foreach ($travelers as $traveler) {
            if (in_array((int) $traveler['id'], $existingPaxes)) {
                continue;   // Do not create duplicate paxes
            }
            $existingPaxes[] = (int) $traveler['id'];
            if (!isset($data['pax'][$traveler['traveler_type_id']]['totalFare'])) {
                \Utils::dbgYiiLog($traveler);
                \Utils::dbgYiiLog($data['pax']);
                throw new Exception("Wrong pax element provided for traveler_type_id:{$traveler['traveler_type_id']} . Check the logs above for the traveler and data['pax'] elements");
            }
            $passengers[] = [
                'id' => $traveler['id'],
                'type' => (int) $traveler['traveler_type_id'],
                'amount' => $data['pax'][$traveler['traveler_type_id']]['totalFare'],
                'arrTaxes' => $data['pax'][$traveler['traveler_type_id']]['arrTaxes'],
                'baseFare' => $data['pax'][$traveler['traveler_type_id']]['totalFare'] - array_sum($data['pax'][$traveler['traveler_type_id']]['arrTaxes']),
                'fareBasis' => $data['pax'][$traveler['traveler_type_id']]['fareBasis'],
                'addFare' => true,
            ];
        }
//        \Utils::dbgYiiLog(['data'=>$data,'travelers'=>$travelers]);
        // Create the AirCart
        $airCart = new \AirCart;
        $airCart->user_id = \Utils::getActiveUserId();
        $airCart->loged_user_id = $airCart->user_id;
        $airCart->payment_status_id = \PaymentStatus::STATUS_NOT_CHARGED;
        $airCart->booking_status_id = \BookingStatus::STATUS_NEW;
        $airCart->approval_status_id = \ApprovalStatus::STATUS_NOT_REQUIRED;
        $airCart->client_source_id = (int) $clientSource;
        $airCart->note = 'Pending cart.';
        $airCart->website_id=\AirCart::getWebsiteId();
        $airCart->insert();

        foreach ($data['segments'] as $journeyKey => $journey) {
            foreach ($passengers as &$traveler) {
                $firstSegment = reset($journey);
                $lastSegment = end($journey);
                // Add this AirBooking
                $airBooking = new \AirBooking;
                $airBooking->airline_pnr = self::FAKE_PNR;
                $airBooking->crs_pnr = self::FAKE_PNR;
                $airBooking->booking_type_id = \BookingType::AUTOMATED_BOOKING;
                $airBooking->ab_status_id = \BookingStatus::STATUS_NEW;
                $airBooking->air_source_id = $airSourceId;
                $airBooking->traveler_type_id = $traveler['type'];
                $airBooking->traveler_id = $traveler['id'];
                $airBooking->source_id = \Airport::getIdFromCode($firstSegment['origin']);
                $airBooking->destination_id = \Airport::getIdFromCode($lastSegment['destination']);
                $airBooking->carrier_id = $marketingCarrierId ? : \Carrier::getIdFromCode($firstSegment['marketingCompany']);
                $airBooking->departure_ts = $firstSegment['departTs'];
                $airBooking->arrival_ts = $lastSegment['arriveTs'];
                $airBooking->service_type_id = \ServiceType::getServiceType($airBooking->source_id, $airBooking->destination_id);
                if (is_array($traveler['fareBasis'])) {
                    $airBooking->fare_basis = !empty($traveler['fareBasis'][$journeyKey][0]) ? $traveler['fareBasis'][$journeyKey][0] : null;
                } else {
                    $airBooking->fare_basis = $traveler['fareBasis'];
                }

                $airBooking->booking_class = $firstSegment['bookingClass'];
                $airBooking->product_class = !empty($firstSegment['productClass'])?$firstSegment['productClass']:null;
                $airBooking->fare_type_id = \FareType::getFareType($airBooking->carrier_id, $airBooking->booking_class);
                $airBooking->air_cart_id = $airCart->id;
                $airBooking->ticket_number = null;
                $airBooking->cabin_type_id = (int) $data['cabinTypeId'];
                // Fill the Fare once per journey
                if ($traveler['addFare']) {
                    $airBooking->basic_fare = $traveler['baseFare'];
                    $airBooking->fuel_surcharge = $traveler['arrTaxes'][\Taxes::TAX_YQ];
                    $airBooking->jn_tax = $traveler['arrTaxes'][\Taxes::TAX_JN];
                    $airBooking->udf_charge = $traveler['arrTaxes'][\Taxes::TAX_PSF] + $traveler['arrTaxes'][\Taxes::TAX_UDF];
                    $airBooking->other_tax = $traveler['arrTaxes'][\Taxes::TAX_OTHER];
                    $airBooking->commission_or_discount_gross = 0;
                    $airBooking->booking_fee = 0;
                    $traveler['addFare'] = false;
                }
                $airBooking->insert();

                foreach ($journey as $segment) {
                    /* @var $segment \LegsJson */
                    $airRoute = new \AirRoutes;
                    $airRoute->air_booking_id = $airBooking->id;
                    $airRoute->airPnr = self::FAKE_PNR;
                    $airRoute->arrival_ts = $segment['arriveTs'];
                    $airRoute->departure_ts = $segment['departTs'];
                    $airRoute->booking_class = $segment['bookingClass'];
                    $airRoute->flight_number = $segment['flightNumber'];
                    $airRoute->carrier_id = \Carrier::getIdFromCode($segment['marketingCompany']);
                    $airRoute->destination_id = \Airport::getIdFromCode($segment['destination']);
                    $airRoute->source_id = \Airport::getIdFromCode($segment['origin']);
                    $airRoute->insert();
                }
                $airBooking->setAirRoutesOrder();
            }
        }
        $airCart->applyBothRules();
        return ['airCartId' => $airCart->id];
    }

    static function manualBook($airCartId) {
        set_time_limit(60);
//        \Utils::dbgYiiLog($airSourceId);
//        \Utils::dbgYiiLog($data);
//        \Utils::dbgYiiLog($travelers);
//        \Utils::dbgYiiLog($fop);
//        \Utils::dbgYiiLog($Cc);
//        exit;

        $aircart = \AirCart::model()->findByPk((int) $airCartId);
        if (empty($aircart)) {
            return ['error' => 'Cart not Found!!'];
        }
        if (count($aircart->airBookings) <= 0) {
            return ['error' => 'No booking found!!'];
        }
        if ($aircart->process_flag !== 0) {
            $aircart->addNote('Manual Booking already tried.');
            return ['error' => 'Manual Booking already tried.'];
        }
        $aircart->process_flag = 1;
        $aircart->update(['process_flag']);
        if ($aircart->checkClaim() === false) {
            $aircart->addNote('Claim check failed.');
            return ['error' => 'Claim check failed.'];
        }

        $travelers = null;
        $segments = null;
        $airBookings = \AirBooking::model()->findAll([
            'condition' => 'air_cart_id=:airCartId',
            'order' => 'departure_ts',
            'params' => [':airCartId' => (int) $airCartId]
        ]);
        //demerging
        $journeyType = null;
        $bookingsASwise = [];
        $cntSegmentASwise = null;
        foreach ($airBookings as $booking) {
            if ($booking->ab_status_id === \AbStatus::STATUS_IN_PROCESS) {
                $bookingsASwise[$booking->air_source_id][] = $booking;

                if (isset($segbookingsASwise[$booking->air_source_id][$booking->source_id][$booking->destination_id])) {
                    //$cntSegmentASwise[$booking->air_source_id]++;
                } else {
                    if (!isset($cntSegmentASwise[$booking->air_source_id])) {
                        $cntSegmentASwise[$booking->air_source_id] = 1;
                    } else {
                        $cntSegmentASwise[$booking->air_source_id] ++;
                    }

                    $segbookingsASwise[$booking->air_source_id][$booking->source_id][$booking->destination_id] = 'set';
                }

                if (isset($bookingsASwise[$booking->air_source_id][$booking->destination_id][$booking->source_id])) {
                    $journeyType[$booking->air_source_id] = 'Return';
                }
            }
        }
        //    \Utils::dbgYiiLog(['$bookingsASwise'=>$bookingsASwise,'$cntSegmentASwise'=>$cntSegmentASwise]);
        $all = true;
        $newaircarts = [];
        foreach ($bookingsASwise as $as => $value) {
            if ($cntSegmentASwise[$as] > 2) {//Multicity
                $result = \ApiInterface::manualASMultiCityBook($value, $aircart);
            } else if (isset($journeyType[$as])) {//return flight
                $result = \ApiInterface::manualASSingleRoundBook($value, $aircart);
            } else {
                $result = \ApiInterface::manualASSingleRoundBook($value, $aircart);
            }

            if (isset($result['error'])) {
                $aircart->addNote($result['error']);
                $all = false;
                break;
            }

            $newaircarts[] = \AirCart::model()->findByPk($result['airCartId']);
        }
        $prevcartid = $aircart->id;
        $prevcartnotes = $aircart->getNotes();
        /* @var $ac \AirCart */
        if (count($newaircarts)) {

            $ac = array_shift($newaircarts);
            if (count($newaircarts)) {
                $ac->mergeCarts($newaircarts);
            }

            $ac->client_source_id = $aircart->client_source_id;
            $ac->claim_user_id = $aircart->claim_user_id;
            $ac->claimed_ts = $aircart->claimed_ts;
            $ac->process_flag = $aircart->process_flag;
            $ac->update(['client_source_id', 'claim_user_id', 'claimed_ts', 'process_flag']);

            // Remove the previous cart
            $aircart->removeFake($ac);


            $ac->refresh();
            $ac->setAirBookingsAndAirRoutesOrder();
            $ac->applyBothRules();

            $ac->copyCart($prevcartid, $prevcartnotes);

            $newcart = \AirCart::model()->findByPk((int) $prevcartid);
            if ($all) {
                $newcart->setBookingStatus();
            } else {
                $newcart->setBookingStatus(true);
            }
        }
        return $prevcartid;
    }

    static function manualASSingleRoundBook($airBookings, $aircart) {
        $i = 1;
        $airSourceId = (int) $airBookings[0]->air_source_id;
        $airSource = AirSource::model()->with('backend')->findByPk($airSourceId);
        $travellerMap = null;
        $pax = null;
        $sg = null;
        $first = true;
        $conv_fee = 0;
        foreach ($airBookings as $booking) {
            if(!$first) {
                $conv_fee = $booking->airCart->convenienceFee;
            }
            $first = false;
            $tmpTraveler = $booking->traveler->pretty();
            $tmpTraveler['amount'] = $booking->getTotalAmountToPay() - $conv_fee - $booking->commercial_total_efect;
            $tmpTraveler['traveler_type_id'] = $booking->traveler_type_id;

            //Segments
            if (!isset($sg[$booking->source_id][$booking->destination_id])) {
                $legs = null;
                $sg[$booking->source_id][$booking->destination_id] = 'set';
                $airRoutes = \AirRoutes::model()->findAll([
                    'condition' => 'air_booking_id=:airBookingId',
                    'order' => 'departure_ts',
                    'params' => [':airBookingId' => (int) $booking->id]
                ]);
                $k=0;
                foreach ($airRoutes as $route) {
                    $legs[] = $route->prettyForManualBook($booking);
                    $legs[$k]['productClass'] = $booking->product_class;
                    $k++;
                }
                //\Utils::dbgYiiLog(['legs'=>$legs]);
                $segments[$i] = $legs;
               
                $i++;
            }


            if (!isset($travellerMap[$booking->traveler->id])) {
                $travellerMap[$booking->traveler->id] = 'set';
                $travelers[] = $tmpTraveler;
            }
            if ($booking->traveler_type_id === 1) {
                $type = 'ADT';
            } else if ($booking->traveler_type_id === 2) {
                $type = 'CNN';
            } else {
                $type = 'INF';
            }
            if (!isset($pax[$booking->traveler_type_id]) || (isset($pax[$booking->traveler_type_id]) && $pax[$booking->traveler_type_id]['totalFare'] < ($booking->getTotalAmountToPay() - $conv_fee + $booking->commission_or_discount_gross))) {

                $pax[$booking->traveler_type_id] = array(
                    'totalFare' => $booking->getTotalAmountToPay() - $conv_fee - $booking->commercial_total_efect,
                    'type' => $type,
                    'arrTaxes' => array(
                        'YQ' => (float) $booking->fuel_surcharge + (float) $booking->airport_tax,
                        'UDF' => (float) $booking->udf_charge,
                        'PSF' => 0,
                        'JN' => (float) $booking->jn_tax,
                        'Other' => (float) $booking->other_tax,
                        'totalTaxCorrection' => 0
                    ),
                    'fareBasis' => $booking->fare_basis
                );
            }
        }
        //\Utils::dbgYiiLog($segments);
        //\Utils::dbgYiiLog($travelers);
        //\Utils::dbgYiiLog($pax);
        $data['segments'] = $segments;
        $data['pax'] = $pax;
        $data['cabinTypeId'] = $airBookings[0]->cabin_type_id;
//        \Utils::dbgYiiLog($data);
        // Build the passengers array
        $i = 1;
        $totalFare = 0;
        $paxMobile = null;
        $dob = null;
//        $existingPaxes = [];
        foreach ($travelers as $traveler) {
            $model = Traveler::model()->with('travelerTitle')->findByPk($traveler['id']);
            if ($model === null) {
                return ['error' => 'Traveler is not set'];
            }
            $dob = $model->birthdate;
            /* if(empty($model->birthdate)){
              // Decide DOB based on pax type if missing DOB param
              if ((int)$traveler['traveler_type_id'] == \TravelerType::TRAVELER_CHILD) {
              // 10 years for child
              $dob = date(DATE_FORMAT, time() - 10 * 365 * 24 * 60 * 60);
              } else if((int)$traveler['traveler_type_id'] == \TravelerType::TRAVELER_ADULT){
              // 30 years for adult
              $dob =date(DATE_FORMAT, time() - 30 * 365 * 24 * 60 * 60);
              }else{
              // Fill in 1 year for infant
              $dob =date(DATE_FORMAT, time() - 365 * 24 * 3600);
              }
              } */
            /* @var $model Traveler */
            $passengers[] = [
                'id' => (int) $model->id,
                //    'firstName' => $model->first_name,
                //    'lastName' => $model->last_name,
                //      'title' => $model->travelerTitle->name,
                //      'type' => (int) $traveler['traveler_type_id'],
                'birthdate' => (string) $dob,
                //      'amount' => $traveler['amount'],
                'traveler_type_id' => (int) $traveler['traveler_type_id'],
                'user_info_id' => (int) $model->user_info_id,
                    //     'arrTaxes' => $data['pax'][$traveler['traveler_type_id']]['arrTaxes'],
                    //     'baseFare' => $data['pax'][$traveler['traveler_type_id']]['totalFare'] - array_sum($data['pax'][$traveler['traveler_type_id']]['arrTaxes']),
                    //     'fareBasis' => $data['pax'][$traveler['traveler_type_id']]['fareBasis'],
                    //     'ff' => [], /* @todo Frequent flyers */
                    //     'SSRs' => [], /* @todo Special service requests */
                    //     'mobile' => $model->mobile,
                    //     'email' => $model->email,
            ];
            if (!empty($model->mobile)) {
                $paxMobile = $model->mobile;
            }
            $i++;
            $totalFare += (float) $traveler['amount'];
        }
        if (empty($paxMobile)) {
            $paxMobile = $aircart->user->mobile;
        }

        usort($passengers, "self::sortByPaxType");
//           \Utils::dbgYiiLog($passengers);
//        echo Utils::dbg($passengers);
//        echo "Total fare: $totalFare\n";
//        \Utils::dbgYiiLog($data['segments']);
        $cc = null;
        foreach ($aircart->payGateLogs as $pg) {

            if ($pg->status_id == \TrStatus::STATUS_SUCCESS && $pg->action_id == \TrAction::ACTION_SENT) {
                if (isset($pg->cc_id)) {

                    if ($airSource->backend->isGds) {
                        $cc['code'] = $pg->cc->getGdsCode();
                    } else {
                        $cc['code'] = $pg->cc->type_id;
                    }
                    $cc['exp_date'] = date('my', strtotime($pg->cc->exp_date));
                    $cc['number'] = \Cc::decode($pg->cc->number);
//                    if (!$airSource->backend->isGds){
//                    $pnrManagement->addCcFop($cc['code'],  $cc['exp_date'], $cc['number']);}
                } else {
//                    if (!$airSource->backend->isAmadeus){
//                    $pnrManagement->addCashFop();}
                }
            }
        }
        $fop = null;
        if (isset($cc)) {
            $fop = \AirSource::CC_PASS_THROUGH;
        } else {
            $fop = 'Cash';
        }
        $fop = 'Cash';
        $cc = null;
        \Utils::setActiveUserAndCompany($aircart->user->id);
//        echo Utils::dbg($pnrManagement);
        if ($airSource->backend->isAmadeus) {
            /* $book = new $airSource->backend->book(
              (int) $airSource->id, $data,
              $passengers,
              $fop,
              $cc
              );

              $result = $book->doBooking(true); */
            //   \Utils::dbgYiiLog($result);
            return ['error' => 'Amadeus can not do manual book'];
        } else {
            $result = \ApiInterface::book(
                            (int) $airSource->id, $data, $passengers, $fop, $cc, null, true
            );
            //    \Utils::dbgYiiLog($result);
            return $result;
        }
    }

    static public function sortByPaxType($a, $b) {
        //\Utils::dbgYiiLog($a);

        if ($a['traveler_type_id'] > $b['traveler_type_id'])
            return 1;
        else
            return -1;
    }

}
