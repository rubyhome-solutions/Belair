<?php

namespace application\components\Spicejet;

/**
 * Spicejet XML definitions
 */
class PnrManagement implements \application\components\api_interfaces\IpnrManagement {

    private $faresTotal = 0;
    private $totalSeats = 0;
    private $paxCount = null;
    private $notes = [];
    private $originalSegments = null;
    private $testMe = false;
//    private $testMe = true;
    private $sellKeys = [];
    private $response = null;
    private $recordLocator = null;
    private $paxMobile = null;
    private $companyTypeId = null;
    private $airSourceId = null;
    private $autoIssueInternational = true;
    private $autoIssueDomestic = true;
    private $autoIssue = true;
    public $manualIssue = false;

    /**
     * Our Availability requests array
     * @var AvailabilityRequest[]
     */
    private $availabilityRequests = [];

    /**
     * Infant SSR definitions
     * @var PaxSSR[]
     */
    private $infantSsrs = [];

    /**
     * Segments SSR requests - in case of infants only
     * @var SegmentSSRRequest[]
     */
    private $segmentSSRRequests = [];

    /**
     * Our passengers
     * @var Passenger[]
     */
    private $passengers = [];

    /**
     * Pax types
     * @var PaxPriceType[]
     */
    private $paxPriceTypes = [];

    /**
     * Spicejet Session manager
     * @var SessionManager
     */
    public $apiSessionManager = null;

    /**
     * Spicejet Booking manager
     * @var BookingManager $api
     */
    private $api = null;
    public $pnrResponseObj = null;
    static $okStatuses = [
        'AK',
        'GK',
        'HS',
        'HK',
        'KK',
        'TK',
    ];

    function addPassengers(array $passengers) {
        $this->paxCount = count($passengers);
        foreach ($passengers as $key => $passenger) {
            if (!empty($passenger['mobile'])) {
                $this->paxMobile = $passenger['mobile'];
            }
            // Calculate the total fares amount
            $this->faresTotal += (float) $passenger['amount'];
            if ($passenger['type'] !== \TravelerType::TRAVELER_INFANT) {
                $this->totalSeats++;
                $this->paxPriceTypes[] = new PaxPriceType(Utils::$passengerTypes[$passenger['type']]);
                $this->passengers[] = $this->addPax($passenger);
            } else {
                $this->infantSsrs[] = $this->addSsrItem($this->totalSeats - 1, Utils::TRAVELER_INFANT);
                $this->addPax($passenger);
            }
        }
    }

    function addPax($passenger) {
        $currentPaxKey = count($this->passengers);
        if ($passenger['type'] != \TravelerType::TRAVELER_INFANT) {

            // Decide DOB based on pax type if missing DOB param
            if ($passenger['type'] == \TravelerType::TRAVELER_CHILD) {
                // 10 years for child
                $dob = empty($passenger['birthDate']) ? date(DATE_FORMAT, time() - 10 * 365 * 24 * 60 * 60) : $passenger['birthDate'];
            } else {
                // 30 years for adult
                $dob = empty($passenger['birthDate']) ? date(DATE_FORMAT, time() - 30 * 365 * 24 * 60 * 60) : $passenger['birthDate'];
            }

            $pax = new Passenger;
            $pax->State = MessageState::Modified;
            $pax->PassengerNumber = $currentPaxKey;
            $pax->Names[0] = new BookingName;
            $pax->Names[0]->FirstName = $passenger['firstName'];
            $pax->Names[0]->LastName = $passenger['lastName'];
            $pax->Names[0]->Title = $passenger['title'] ?: 'Mr.';
            $pax->Names[0]->State = MessageState::aNew;
            $pax->PassengerTypeInfos[0] = new PassengerTypeInfo;
            $pax->PassengerTypeInfos[0]->State = MessageState::aNew;
            $pax->PassengerTypeInfos[0]->DOB = $dob;
            $pax->PassengerTypeInfos[0]->PaxType = Utils::$passengerTypes[$passenger['type']];
            return $pax;
        } else {
//            $pax->Infant = new PassengerInfant;
            $pi = new PassengerInfant;
            $pi->DOB = empty($passenger['birthDate']) ? date(DATE_FORMAT, time() - 365 * 24 * 3600) : $passenger['birthDate'];   // Fill in 1 year for infant
            $pi->State = MessageState::aNew;
            $pi->Gender = (strstr($passenger['type'], 'Ms')) ? Gender::Female : Gender::Male;
            $pi->Names[0] = new BookingName;
            $pi->Names[0]->FirstName = $passenger['firstName'];
            $pi->Names[0]->LastName = $passenger['lastName'];
            $pi->Names[0]->Title = $passenger['title'] ?: 'Mr.';
            $this->passengers[count($this->infantSsrs) - 1]->PassengerInfants[] = $pi;
        }
    }

    function addCashFop() {
        if (!$this->api) {
            return "The SG PNR Management is not connected";
        }
        if ($this->faresTotal === 0) {
            return "The fares are not set yet";
        }

        $ap = new AddPaymentToBookingRequest;
        $ap->addPaymentToBookingReqData = new AddPaymentToBookingRequestData;
        $ap->addPaymentToBookingReqData->MessageState = MessageState::aNew;
        $ap->addPaymentToBookingReqData->WaiveFee = false;
        $ap->addPaymentToBookingReqData->ReferenceType = PaymentReferenceType::aDefault;
        $ap->addPaymentToBookingReqData->PaymentMethodType = PaymentMethodType::AgencyAccount;
        $ap->addPaymentToBookingReqData->PaymentMethodCode = 'AG';
        $ap->addPaymentToBookingReqData->QuotedCurrencyCode = 'INR';
        $ap->addPaymentToBookingReqData->Status = BookingPaymentStatus::aNew;
        $ap->addPaymentToBookingReqData->Deposit = false;
        $ap->addPaymentToBookingReqData->Expiration = '0001-01-01T00:00:00';
        $ap->addPaymentToBookingReqData->QuotedAmount = (float) $this->faresTotal;
        $ap->addPaymentToBookingReqData->AccountNumber = $this->apiSessionManager->accountNumber;
        $this->api->AddPaymentToBooking($ap);
        $res = $this->api->toSimpleXmlElement();
        if (YII_DEBUG) {
            $res->asXML('SG_AddPaymentToBooking_response.xml');
        }
//        print_r($res);
        if (!empty($res->Body->AddPaymentToBookingResponse->BookingPaymentResponse->ValidationPayment->PaymentValidationErrors->PaymentValidationError->ErrorDescription)) {
            \Yii::log($res->asXML());
            return (string) $res->Body->AddPaymentToBookingResponse->BookingPaymentResponse->ValidationPayment->PaymentValidationErrors->PaymentValidationError->ErrorDescription;
        }
        return true;
    }

    function addCcFop($ccTypeCode, $expiryDate, $ccNumber) {
        
    }

    function addSsrItem($psgrNum, $ssrCode) {
        return new PaxSSR(MessageState::aNew, $psgrNum, count($this->infantSsrs), $ssrCode);
    }

    /**
     * Prepare the aire segments list for the booking
     * @param array $segments 3 dimiensional Array with the info about the itinerary [journey][leg] = array (fllight data)
     */
    function addAirSegments(array $segments) {
        if (empty($this->totalSeats) || empty($this->paxPriceTypes)) {
            return "Segments can not be added before the passengers are added";
        }

        $this->originalSegments = $segments;
        foreach ($segments as $segment) {
            $first = reset($segment);
            $last = end($segment);
            $date = $first['depart'];
            $ar = new AvailabilityRequest($date, $date, FlightType::All, $this->totalSeats, DOW::Daily, AvailabilityType::aDefault, 3, AvailabilityFilter::ExcludeUnavailable, FareClassControl::LowestFareClass, null, null, SSRCollectionsMode::None, InboundOutbound::None, null, false, false, FareRuleFilter::aDefault, LoyaltyFilter::MonetaryOnly);
            $ar->PaxPriceTypes = $this->paxPriceTypes;
            $ar->DepartureStation = $first['origin'];
            $ar->ArrivalStation = $last['destination'];
            if (\Airport::getServiceTypeIdFromCode($first['origin'], $last['destination']) === \ServiceType::DOMESTIC_AIR) {
                $this->autoIssue = $this->autoIssueDomestic;
            } else {
                $this->autoIssue = $this->autoIssueInternational;
            }
            $ar->CurrencyCode = "INR";
            //check for only lite Fare class
            if ($first['productClass'] == Utils::LITE_FARE) {
                $ar->FareTypes[] = Utils::FARE_TYPES;
                $ar->ProductClasses[] = Utils::PRODUCT_CALSSES;
            }
            //$ar->IncludeTaxesAndFees = 'true';
            $this->availabilityRequests[] = $ar;
            // If there are infants
            if (!empty($this->infantSsrs) || $first['productClass'] === Utils::LITE_FARE) {
                if (count($segment) > 1) {
                    foreach ($segment as $csegment) {
                        $this->segmentSSRRequests[] = $this->createSegmentSsrRequest($csegment['departTs'], $csegment['origin'], $csegment['destination'], $csegment['marketingCompany'], $csegment['flightNumber'], $first['productClass']);
                    }
                } else {
                    $this->segmentSSRRequests[] = $this->createSegmentSsrRequest($first['departTs'], $first['origin'], $last['destination'], $first['marketingCompany'], $first['flightNumber'], $first['productClass']);
                }
//              foreach ($segment as $leg) {
//                   $this->segmentSSRRequests[] = $this->createSegmentSsrRequest($leg['departTs'], $leg['origin'], $leg['destination'], $leg['marketingCompany'], $leg['flightNumber']);
//              }
            }
        }

        return true;
    }

    function checkAvailability() {
        if (!$this->api && !$this->testMe) {
            return "The SG PNR Management is not connected";
        }
        if (empty($this->availabilityRequests)) {
            return "The segments are not set";
        }
        $tripAvailabilityRequest = new TripAvailabilityRequest(LoyaltyFilter::MonetaryOnly);
        foreach ($this->availabilityRequests as $ar) {
            $tripAvailabilityRequest->AvailabilityRequests[] = $ar;
        }
        $request = new GetAvailabilityRequest($tripAvailabilityRequest);
        if ($this->testMe) {
//            $response = $this->api->GetAvailability($request);
            $xmlResponse = \simplexml_load_file('sg_response.xml');
        } else {
            $this->api->GetAvailability($request);
            $xmlResponse = $this->api->toSimpleXmlElement();
            if ($xmlResponse === false) {
                return "Can not get the availability response";
            }
            if (YII_DEBUG) {
                $xmlResponse->asXML('sg_response.xml');
            }
        }

        foreach ($this->originalSegments as $segment) {
            $match = $this->segmentMatch($segment, $xmlResponse);
            if ($match === false) {
                $this->sellKeys = [];
                return "The flight is not available! " . print_r($segment, true);
            } else {
                $this->sellKeys[] = $match;
//                echo "Found: " . print_r($match, true);
            }
        }

        return true;
    }

    function segmentMatch(array $segment, \SimpleXMLElement $strXml) {
//        print_r($strXml);
        foreach ($strXml->Body->GetAvailabilityByTripResponse->GetTripAvailabilityResponse->Schedules->ArrayOfJourneyDateMarket as $ajdm) {
            $first = reset($segment);
            $last = end($segment);
            if ($first['origin'] != $ajdm->JourneyDateMarket->DepartureStation || $last['destination'] != $ajdm->JourneyDateMarket->ArrivalStation) {
                continue;   // This is not our journey
            }
            foreach ($ajdm->JourneyDateMarket->Journeys->Journey as $journey) {
                unset($allLegs);
                if (count($journey->Segments->Segment) >= 2) {
                    $faresellkey = '';
                    $seg_counter = 1;
                    foreach ($journey->Segments->Segment as $seg) {
                        // Prepare leg for technical stops flights
                        if (isset($seg->Legs->Leg[1])) {
                            $leg = $seg->Legs->Leg[0];
                            $leg->ArrivalStation = $seg->Legs->Leg[1]->ArrivalStation;
                            $allLegs[0][] = $leg;
                        } else {
                            $allLegs[0][] = $seg->Legs->Leg;
                        }
                        $faresellkey .= $seg->Fares->Fare->FareSellKey;
                        if (count($journey->Segments->Segment) > $seg_counter) {
                            $faresellkey .= "^";
                        }
                        $seg_counter++;
                    }
                } else {
                    foreach ($journey->Segments->Segment->Legs->Leg as $leg) {
                        $allLegs[0][] = $leg;
                    }
                    $faresellkey = $journey->Segments->Segment->Fares->Fare->FareSellKey;
                }
                //\Utils::dbgYiiLog($allLegs);

                foreach ($allLegs as $legs) {
                    if (count($segment) !== count($legs)) {
                        continue;   // No need to continue if the number of the legs do not match
                    }
                    $currentSegment = reset($segment);
                    foreach ($legs as $leg) {
                        if (
                                (string) $currentSegment['origin'] !== (string) $leg->DepartureStation ||
                                (string) $currentSegment['destination'] !== (string) $leg->ArrivalStation ||
                                (string) $currentSegment['departTs'] !== (string) Utils::shortenDateAndTime($leg->STD) ||
                                (string) $currentSegment['marketingCompany'] !== (string) $leg->FlightDesignator->CarrierCode ||
                                (string) $currentSegment['flightNumber'] !== trim((string) $leg->FlightDesignator->FlightNumber)
                        ) {
                            continue 2;
                        }
                        $currentSegment = next($segment);
                    }
                    return [
                        'JourneySellKey' => (string) $journey->JourneySellKey,
                        'FareSellKey' => (string) $faresellkey
                    ];
                }
            }
        }

        return false;   // No matching journeys found
    }

    /**
     * Create Segment SSR request for the infants
     * @param string $departureTs
     * @param string $origin
     * @param string $destination
     * @param string $carrier
     * @param string $flightNumber
     * @return \application\components\Spicejet\SegmentSSRRequest
     */
    private function createSegmentSsrRequest($departureTs, $origin, $destination, $carrier, $flightNumber, $productClass = null) {
        $sssr = new SegmentSSRRequest(Utils::prepareDateAndTime($departureTs));
        $sssr->ArrivalStation = $destination;
        $sssr->DepartureStation = $origin;
        $sssr->FlightDesignator = new FlightDesignator;
        $sssr->FlightDesignator->CarrierCode = $carrier;
        $sssr->FlightDesignator->FlightNumber = str_pad(trim($flightNumber), 4, ' ', STR_PAD_LEFT);
        $sssr->PaxSSRs = array();
        // SSRCode:-HBAG is mandatory to pass for the lite fare
        if ($productClass == Utils::LITE_FARE) {
            for ($i = 0; $i < count($this->passengers); $i++) {
                $paxSSR = new PaxSSR(MessageState::aNew, $i, $i);
                $paxSSR->ActionStatusCode = 'NN';
                $paxSSR->ArrivalStation = $sssr->ArrivalStation;
                $paxSSR->DepartureStation = $sssr->DepartureStation;
                $paxSSR->SSRCode = Utils::SSRCode;
                array_push($sssr->PaxSSRs, $paxSSR);
                if (count($this->passengers[$i]->PassengerInfants) > 0) {
                    for ($j = 0; $j < count($this->passengers[$i]->PassengerInfants); $j++) {
                        $paxSSR = new PaxSSR(MessageState::aNew, $i, $j + 1);
                        $paxSSR->ActionStatusCode = 'NN';
                        $paxSSR->ArrivalStation = $sssr->ArrivalStation;
                        $paxSSR->DepartureStation = $sssr->DepartureStation;
                        $paxSSR->SSRCode = Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                        array_push($sssr->PaxSSRs, $paxSSR);
                    }
                }
            }
        } else {
            for ($i = 0; $i < count($this->infantSsrs); $i++) {
                $paxSSR = new PaxSSR(MessageState::aNew, $i, $i);
                $paxSSR->ActionStatusCode = 'NN';
                $paxSSR->ArrivalStation = $sssr->ArrivalStation;
                $paxSSR->DepartureStation = $sssr->DepartureStation;
                $paxSSR->SSRCode = Utils::$passengerTypes[\TravelerType::TRAVELER_INFANT];
                //$sssr->PaxSSRs[] = $paxSSR;
                array_push($sssr->PaxSSRs, $paxSSR);
            }
        }

        return $sssr;
    }

    /**
     * Check the fares
     * @param int $faresTotal
     * @return boolean | error string
     */
    function checkFares($faresTotal) {
        if (empty($this->sellKeys)) {
            return "The air availability is not confirmed yet!";
        }

        // Always confirm the fares if test enviroment is used
        if ($this->airSourceId === Utils::TEST_AIRSOURCE_ID) {
            return true;
        }

        $ipr = new ItineraryPriceRequest(PriceItineraryBy::JourneyBySellKey);
        $ipr->SellByKeyRequest = new SellJourneyByKeyRequestData;
        $ipr->SellByKeyRequest->CurrencyCode = 'INR';
        $ipr->SellByKeyRequest->ActionStatusCode = 'NN';
        $ipr->SellByKeyRequest->IsAllotmentMarketFare = false;
        $ipr->SellByKeyRequest->PaxCount = $this->totalSeats;
        $ipr->SellByKeyRequest->PaxPriceType = $this->paxPriceTypes;
        $ipr->SellByKeyRequest->LoyaltyFilter = LoyaltyFilter::MonetaryOnly;
        $ipr->SellByKeyRequest->JourneySellKeys = $this->getSellKeysList();
        $ipr->SSRRequest = new SSRRequest;
        $ipr->SSRRequest->SegmentSSRRequests = $this->segmentSSRRequests;

//        print_r($ipr);

        if (!$this->testMe) {
            $pir = new PriceItineraryRequest($ipr);
            $this->api->GetItineraryPrice($pir);
            $res = $this->api->toSimpleXmlElement();
            if (YII_DEBUG) {
                $res->asXML('spicejet_GetItineraryPrice_response.xml');
            }
        } else {
            $res = simplexml_load_file('spicejet_GetItineraryPrice_response.xml');
        }
//        print_r($res);
        $sum = (float) $res->Body->PriceItineraryResponse->Booking->BookingSum->TotalCost;
//        if ($sum <> $this->faresTotal) {
//            return $sum - $this->faresTotal;
//        } else {
//            return true;
//        }
        //issued ticket on lower fare when reduces
        if ($sum <= $this->faresTotal) {
            $this->faresTotal = $sum;
            return true;
        } else {
            return $sum - $this->faresTotal;
        }
    }

    private function getSellKeysList() {
        $out = [];
        foreach ($this->sellKeys as $jorney) {
            $sk = new SellKeyList;
            $sk->JourneySellKey = $jorney['JourneySellKey'];
            $sk->FareSellKey = $jorney['FareSellKey'];
            $out[] = $sk;
        }
        return $out;
    }

    private function sellRequest() {
        if ($this->api === null && !$this->testMe) {
            return 'The API connection is not created yet';
        }
        if (empty($this->sellKeys)) {
            return "The air availability is not confirmed yet!";
        }
        $sr = new SellRequest;
        $sr->SellRequestData = new SellRequestData;
        $sr->SellRequestData->SellBy = SellBy::JourneyBySellKey;
        $sr->SellRequestData->SellJourneyByKeyRequest = new SellJourneyByKeyRequest;
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData = new SellJourneyByKeyRequestData;
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData->ActionStatusCode = 'NN';
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData->JourneySellKeys = $this->getSellKeysList();
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData->PaxPriceType = $this->paxPriceTypes;
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData->CurrencyCode = 'INR';
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData->PaxCount = $this->totalSeats;
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData->LoyaltyFilter = LoyaltyFilter::MonetaryOnly;
        $sr->SellRequestData->SellJourneyByKeyRequest->SellJourneyByKeyRequestData->IsAllotmentMarketFare = false;
        if (!$this->testMe) {
            $this->api->Sell($sr);
            $res = $this->api->toSimpleXmlElement();
            if (YII_DEBUG) {
                $res->asXML('spicejet_SellRequest1_response.xml');
            }
        } else {
            $res = simplexml_load_file('spicejet_SellRequest1_response.xml');
        }
//        print_r($res);
        if (!empty($res->Body->SellResponse->BookingUpdateResponseData->Error)) {
            return (string) $res->Body->SellResponse->BookingUpdateResponseData->Error;
        }
        if (!empty($res->Body->SellResponse->BookingUpdateResponseData->Warning)) {
            $this->notes[] = (string) $res->Body->SellResponse->BookingUpdateResponseData->Warning;
        }
        $sum = (float) $res->Body->SellResponse->BookingUpdateResponseData->Success->PNRAmount->TotalCost;

        if (!empty($this->segmentSSRRequests)) {
            $sr = new SellRequest;
            $sr->SellRequestData = new SellRequestData;
            $sr->SellRequestData->SellBy = SellBy::SSR;
            $sr->SellRequestData->SellSSR = new SellSSR;
            $sr->SellRequestData->SellSSR->SSRRequest = new SSRRequest;
            $sr->SellRequestData->SellSSR->SSRRequest->SegmentSSRRequests = $this->segmentSSRRequests;
            $sr->SellRequestData->SellSSR->SSRRequest->CurrencyCode = 'INR';
            $sr->SellRequestData->SellSSR->SSRRequest->CancelFirstSSR = false;
            $sr->SellRequestData->SellSSR->SSRRequest->SSRFeeForceWaiveOnSell = false;
            if (!$this->testMe) {
                $this->api->Sell($sr);
                $res = $this->api->toSimpleXmlElement();
                if (YII_DEBUG) {
                    $res->asXML('spicejet_SellRequest2_response.xml');
                }
            } else {
                $res = simplexml_load_file('spicejet_SellRequest2_response.xml');
            }
//            print_r($res);
            if (!empty($res->Body->SellResponse->BookingUpdateResponseData->Error)) {
                return (string) $res->Body->SellResponse->BookingUpdateResponseData->Error;
            }
            if (!empty($res->Body->SellResponse->BookingUpdateResponseData->Warning)) {
                $this->notes[] = (string) $res->Body->SellResponse->BookingUpdateResponseData->Warning;
            }
            $sum = (float) $res->Body->SellResponse->BookingUpdateResponseData->Success->PNRAmount->TotalCost;
        }

//        if ($sum <> $this->faresTotal) {
//            return "Fares amount is $sum, but offer is for {$this->faresTotal}, difference is: " . ($this->faresTotal - $sum);
//        }
//
//        return true;
//        
        //issued ticket on lower fare when reduces
        if ($sum <= $this->faresTotal) {
            $this->faresTotal = $sum;
            return true;
        } else {
            return "Fares amount is $sum, but offer is for {$this->faresTotal}, difference is: " . ($this->faresTotal - $sum);
        }
    }

    private function bookingContact() {
        $details = new \ActiveUserDetails($this->companyTypeId, $this->paxMobile);
        $bc = new BookingContact;
        $bc->TypeCode = "p";
        $bc->EmailAddress = "ticket@cheapticket.in";
        $bc->HomePhone = $details->phone;
        $bc->AddressLine1 = $details->address1;
        $bc->AddressLine2 = $details->address2;
        $bc->City = $details->city;
        $bc->ProvinceState = $details->stateCode;
        $bc->PostalCode = $details->pincode;
        $bc->CountryCode = $details->countryCode;
        $bc->DistributionOption = DistributionOption::None;
        $bc->NotificationPreference = NotificationPreference::None;
        $bc->Names[0] = new BookingName;
        $bc->Names[0]->State = MessageState::aNew;
        $bc->Names[0]->Title = "Mr.";
        $bc->Names[0]->FirstName = $details->firstName;
        $bc->Names[0]->LastName = $details->lastName;

        return $bc;
    }

    /**
     * Final step of PNR creation
     * @return string Error string or 6 char PNR
     */
    private function bookCommit() {
        if ($this->api === null) {
            return 'The API connection is not created yet';
        }
//        if (empty($this->passengers)) {
//            return 'The passengers are not added';
//        }
        $bcr = new BookingCommitRequest;
        $bcr->BookingCommitRequestData = new BookingCommitRequestData;
        $bcr->BookingCommitRequestData->State = MessageState::aNew;
        $bcr->BookingCommitRequestData->RecordLocator = $this->recordLocator;
        $bcr->BookingCommitRequestData->CurrencyCode = 'INR';
        $bcr->BookingCommitRequestData->PaxCount = $this->totalSeats;
        $bcr->BookingCommitRequestData->Passengers = $this->passengers;
        $bcr->BookingCommitRequestData->RestrictionOverride = false;
        $bcr->BookingCommitRequestData->ChangeHoldDateTime = false;
        $bcr->BookingCommitRequestData->WaiveNameChangeFee = false;
        $bcr->BookingCommitRequestData->WaivePenaltyFee = false;
        $bcr->BookingCommitRequestData->WaiveSpoilageFee = false;
        $bcr->BookingCommitRequestData->DistributeToContacts = false;
        $bcr->BookingCommitRequestData->BookingContacts[0] = $this->bookingContact();

        $res = $this->api->BookingCommit($bcr);
        if (is_string($res)) {
            return $res;
        }
        $res = $this->api->toSimpleXmlElement();
//        print_r($res);
        if (YII_DEBUG) {
            $res->asXML('spicejet_BookingCommit_response.xml');
        }
        if (!empty($res->Body->BookingCommitResponse->BookingUpdateResponseData->Error)) {
            return (string) $res->Body->BookingCommitResponse->BookingUpdateResponseData->Error;
        }
        if (!empty($res->Body->BookingCommitResponse->BookingUpdateResponseData->Warning)) {
            $this->notes[] = (string) $res->Body->BookingCommitResponse->BookingUpdateResponseData->Warning;
        }
        return (string) $res->Body->BookingCommitResponse->BookingUpdateResponseData->Success->RecordLocator;
    }

    function test() {
        //echo preg_replace('/\s*(<[^>]*>)\s*/','$1',$nameItem);
        $passengers = [
            [
                'firstName' => 'TonyA',
                'lastName' => 'BoyA',
                'title' => 'Mr.',
                'type' => 1, // 'ADT',
                'birthDate' => '',
                'amount' => 6483 + 5291,
                'arrTaxes' => [],
                'fareBasis' => 'FB001',
//                'ff' => ['LH 222016292227053', 'BA 14014697'],
                'ff' => ['9W 1111NT1', 'AA 9999999'],
                'SSRs' => ['AVML', 'BIKE']
            ],
            [
                'firstName' => 'DollyA',
                'lastName' => 'GirlA',
                'title' => 'Ms.',
                'type' => 2, // 'CNN',
                'birthDate' => '2009-03-19',
                'amount' => 6483 + 5291,
                'arrTaxes' => [],
                'fareBasis' => 'FB002',
                'SSRs' => ['CHML']
            ],
            [
                'firstName' => 'DimiA',
                'lastName' => 'BabyA',
                'title' => 'Mstr.',
                'type' => 3, // 'INF',
                'birthDate' => '2014-02-20',
                'amount' => 1000 + 1000,
                'arrTaxes' => [],
                'fareBasis' => 'FB003',
                'SSRs' => ['BSCT']
            ],
//            [
//                'firstName' => 'Suzy',
//                'lastName' => 'BabyB',
//                'title' => 'Mss.',
//                'type' => 3, // 'INF',
//                'birthDate' => '2013-02-20',
//                'amount' => 1000+1000,
//                'arrTaxes' => [],
//                'fareBasis' => 'FB003',
//                'SSRs' => ['BSCT']
//            ],
        ];
        $this->addPassengers($passengers);

        $segments = [
            1 => [
                0 => [
                    'origin' => 'DEL',
                    'destination' => 'JLR',
                    'depart' => '2014-12-29',
                    'flightNumber' => 2441,
                    'marketingCompany' => 'SG',
                    'bookingClass' => 'J',
                    'departTs' => '2014-12-29 07:50',
                    'arriveTs' => '2014-12-29 09:45'
                ],
                1 => [
                    'origin' => 'JLR',
                    'destination' => 'BOM',
                    'depart' => '2014-12-29',
                    'flightNumber' => 2441,
                    'marketingCompany' => 'SG',
                    'bookingClass' => 'J',
                    'departTs' => '2014-12-29 10:05',
                    'arriveTs' => '2014-12-29 12:10'
                ]
            ],
            2 => [
                0 => [
                    'origin' => 'BOM',
                    'destination' => 'JLR',
                    'depart' => '2015-01-09',
                    'flightNumber' => 2452,
                    'marketingCompany' => 'SG',
                    'bookingClass' => 'H',
                    'departTs' => '2015-01-09 16:20',
                    'arriveTs' => '2015-01-09 18:15'
                ],
                1 => [
                    'origin' => 'JLR',
                    'destination' => 'DEL',
                    'depart' => '2015-01-09',
                    'flightNumber' => 2452,
                    'marketingCompany' => 'SG',
                    'bookingClass' => 'H',
                    'departTs' => '2015-01-09 18:35',
                    'arriveTs' => '2015-01-09 20:35'
                ],
            ]
        ];
        //[FareSellKey] => 0~H~~H~0132~~30~X
        //[JourneySellKey] => SG~2441~ ~~DEL~12/29/2014 07:50~BOM~12/29/2014 12:10~JLR

        $this->addAirSegments($segments);
        if (!$this->testMe) {
            $this->connect('test', [], Utils::TEST_AIRSOURCE_ID);
        }

        $check = $this->checkAvailability();
//        print_r($this->sellKeys);
        if ($check !== true) {
            print_r($check);
            return ["error" => $check];
        }
//        print_r($this->segmentSSRRequests);
        $check = $this->checkFares(null);
        if ($check !== true) {
            print_r($check);
            return ["error" => $check];
        }

        $check = $this->sellRequest();
        if ($check !== true) {
            print_r($check);
            return ["error" => $check];
        }

        $check = $this->addCashFop();
        if ($check !== true) {
            print_r($check);
            return ["error" => $check];
        }

        $check = $this->bookCommit();
        if (strlen($check) !== 6) {
            return ["error" => $check];
        }
        echo $check . PHP_EOL;


//        $this->connect('test', [], Utils::TEST_AIRSOURCE_ID);
//        return $this->createPnr();
        if ($this->apiSessionManager !== null) {
            $this->apiSessionManager->Logout();
        }
    }

    /**
     * Check the Availability and the fare
     * @return string|boolean|array TRUE if it is OK or Error string or Array
     */
    function checkAvailabilityAndFares() {
        // Passengers check
        if ($this->totalSeats === 0) {
            return 'The passengers are not added yet';
        }
        // Segments check
        if (empty($this->availabilityRequests)) {
            return 'The segments are not added yet';
        }
        // Api check
        if ($this->api === null) {
            return 'The API connection is not created yet';
        }

        // Seats availability
        $check = $this->checkAvailability();
        if ($check !== true) {
            $this->apiSessionManager->Logout();
            return [
                'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                'priceDiff' => 0,
                "details" => $check
            ];
        }

        // Check fare
        $check = $this->checkFares(null);
        if ($check !== true) {
            $this->apiSessionManager->Logout();
            return [
                'errorCode' => $check > 0 ? \ApiInterface::FARE_INCREASED : \ApiInterface::FARE_DECREASED,
                'priceDiff' => $check,
                "details" => 'Fare difference: ' . $check
            ];
        }

        // All is OK
        $this->abortCurrentPnr();
        return true;
    }

    function createPnr($params = []) {
        // Passengers check
        if ($this->totalSeats === 0) {
            return ["error" => 'The passengers are not added yet'];
        }
        // Segments check
        if (empty($this->availabilityRequests)) {
            return ["error" => 'The segments are not added yet'];
        }
        // Api check
        if ($this->api === null) {
            return ["error" => 'The API connection is not created yet'];
        }

        // Auto issue check
        if (!$this->manualIssue) {
            if (empty($this->autoIssue)) {
                return ["error" => 'autoTicketIssue disabled'];
            }
            if (\PayGateLog::autoIssueFlag() !== true) {
                return ["error" => '[' . \PayGateLog::autoIssueFlag() . '] autoTicketIssue disabled'];
            }
        }

        $check = $this->checkAvailability();
        if ($check !== true) {
//            print_r($this->pnrResponseObj);
            $this->apiSessionManager->Logout();
            return ["error" => $check];
        }
        $check = $this->checkFares(null);
        if ($check !== true) {
            $this->apiSessionManager->Logout();
            return ["error" => $check];
        }
        $check = $this->sellRequest();
        if ($check !== true) {
            $this->apiSessionManager->Logout();
            return ["error" => $check];
        }
        $check = $this->addCashFop();
        if ($check !== true) {
            $this->apiSessionManager->Logout();
            return ["error" => $check];
        }

        $check = $this->bookCommit();
        if (strlen($check) !== 6) {
            $this->apiSessionManager->Logout();
            return ["error" => $check];
        }

        $this->apiSessionManager->Logout();
        // Return the new PNR code
        return [
            'pnr' => $check,
            'notes' => implode('<br>', $this->notes),
            'error' => null
        ];
    }

    /**
     * Synonim fo the function retrievePnr
     * @param string $pnrStr
     */
    function pnrRetrieve($pnrStr) {
        return $this->retrievePnr($pnrStr);
    }

    function retrievePnr($pnrStr) {
        if ($this->api !== null) {
            $gbr = new GetBookingRequest($pnrStr);
            $this->pnrResponseObj = $this->api->GetBooking($gbr);
            // SOAP Fault
            if (is_string($this->pnrResponseObj)) {
                return $this->pnrResponseObj;
            }
            // Empty PNR
            if (empty($this->pnrResponseObj->Booking)) {
                $this->pnrResponseObj = "PNR not found";
                return "PNR not found";
            }
            $test = (array) $this->pnrResponseObj->Booking->Journeys;
            if (empty($test)) {
                $this->pnrResponseObj = "This PNR is cancelled";
                return "This PNR is cancelled";
            }
            return $this->pnrResponseObj;
        }
        return "SG PNR management is not initialized";
    }

    function cancelPnr($pnrStr) {
        if ($this->api === null) {
            return "PNR management is not initialized";
        }
        $res = $this->retrievePnr($pnrStr);
        if (is_string($res)) {
            return $res;
        }
        $res = $this->api->toSimpleXmlElement();
        $this->totalSeats = (int) $res->Body->GetBookingResponse->Booking->PaxCount;

        $cr = new CancelRequest;
        $cr->CancelRequestData = new CancelRequestData;
        $cr->CancelRequestData->CancelBy = CancelBy::All;
        $this->api->Cancel($cr);
        $res = $this->api->toSimpleXmlElement();
//        print_r($res);
        if (!empty($res->Body->CancelResponse->BookingUpdateResponseData->Error)) {
            return (string) $res->Body->CancelResponse->BookingUpdateResponseData->Error->ErrorDescription;
        }
        $this->faresTotal = (float) $res->Body->CancelResponse->BookingUpdateResponseData->Success->PNRAmount->BalanceDue;
        $check = $this->addCashFop();
        if ($check !== true) {
            return $check;
        }
        $this->recordLocator = $pnrStr;
        $this->bookCommit();
        $res = $this->api->toSimpleXmlElement();
//        print_r($res);

        return true;
    }

    function addPrivateFare($clientId, $pfCode) {
        /**
         * @todo Finish this function
         */
    }

    function addFfItem($psgrNum, $airline, $ffCode) {
        return true;
    }

    /**
     * Parameters needed for the connection. Used to instantize the SOAP client for future calls
     * @param string $wsdlFilesDirectory Relative folder name (usualy test or production) to the WSDL file used for the SOAP actions
     * @param array $credentials Data like (username, password, PCC, someSpecificParameter)
     * @param int $airSourceId The air source ID
     */
    function connect($wsdlFilesDirectory, array $credentials, $airSourceId = null) {
        $airSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        $wsdlFilesDirectory = $airSource->backend->wsdl_file;
        $this->apiSessionManager = new SessionManager([], $wsdlFilesDirectory);
        $signature = $this->apiSessionManager->Logon($airSourceId);
        $this->api = new BookingManager($signature, [], $wsdlFilesDirectory);
        $this->airSourceId = $airSourceId;
        $this->autoIssueInternational = $airSource->international_auto_ticket;
        $this->autoIssueDomestic = $airSource->domestic_auto_ticket;
//        $model = \AirSource::model()->findByPk($id);
//        /* @var $model AirSource */
//        $this->sourcePOS = new Commo;
    }

    public function __construct($airSourceId = null) {
        \Yii::import('application.components.Spicejet.BookingManager', true);
        if (is_int($airSourceId)) {
            $this->connect(null, [], $airSourceId);
        }
    }

    function abortCurrentPnr() {
        // Reset the vars
        $this->faresTotal = 0;
        $this->totalSeats = 0;
        $this->notes = [];
        $this->response = null;
        $this->availabilityRequests = [];
        $this->infantSsrs = [];
        $this->passengers = [];
        $this->paxPriceTypes = [];
        $this->segmentSSRRequests = [];
        $this->sellKeys = [];
        $this->pnrResponseObj = null;

        // Abort the booking
        if ($this->apiSessionManager !== null) {
            $this->apiSessionManager->Logout();
        }
        $this->apiSessionManager = null;
        $this->api = null;
    }

}
