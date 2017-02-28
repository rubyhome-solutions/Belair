<?php

namespace application\components\B2bApi;

/**
 * AirBook
 *
 * @author Boxx
 * @package B2bApi
 */
class AirBook {

    public $credentials = null;
    public $journeyKey = null;
    public $onwardKey = null;
    public $backwardKey = null;
    public $validationErrors = null;
    public $ts = 0;
    public $segments = [];
//    public $totalFareByPaxType = [];
    private $rcs = [];
    public $passengers = [];
    public $travelers = [];
    public $pax = [];

    /**
     * We are making fake booking for those emails
     * @var array
     */
    static $TEST_USER_EMAILS = [
        'test@belair.in',
    ];

    const FAKE_PNR = 'TEST01';
    const FAKE_TICKET = '123456789012';

    public function __construct() {
        $this->credentials = new Auth;
    }

    function validatePax($passengers) {
        if (empty($passengers) || !is_array($passengers)) {
            throw new B2bApiException(B2bApiException::INVALID_PASSENGERS_ELEMENTS, null, 400);
        }
        foreach ($passengers as $passenger) {
            $traveller = new \Traveler;
            $traveller->attributes = $passenger;
            $traveller->user_info_id = $this->credentials->user->user_info_id;
            if (empty($traveller->traveler_title_id)) {
                $traveller->traveler_title_id = \TravelerTitle::DEFAULT_TITLE;
            }
            if (!$traveller->validate()) {
                $errors = $traveller->errors;
                $this->validationErrors = 'Traveler format error: ' . implode(' | ', reset($errors));
                throw new B2bApiException(B2bApiException::TRAVELER_FORMAT_ERROR, $this->validationErrors, 400);
            }
            $traveller->id = $traveller->insertIfMissing();
            $traveller->isNewRecord = false;
            // Set the traveler_type_id
            $traveller->setTravelerTypeId();
            $this->travelers[] = [
                'traveler_type_id' => $traveller->traveler_type_id,
                'id' => $traveller->id,
                'user_info_id' => $traveller->user_info_id,
                'birthdate' => $traveller->birthdate,
            ];
        }
        return true;
    }

    /**
     * Validate the credentials and the journeys key elements
     * @return boolean
     */
    function validate() {
        $this->credentials->authenticate();
        // Validate major fields
        if (empty($this->journeyKey) && (empty($this->onwardKey) || empty($this->backwardKey))) {
            throw new B2bApiException(B2bApiException::MISSING_BOOKING_KEY, null, 400);
        }
        return true;
    }

    /**
     * Return the results
     * @return string JSON encoded results
     */
    function results() {
        if (empty($this->journeyKey)) {
            parse_str($this->onwardKey, $onwardKeys);
            parse_str($this->backwardKey, $backwardKeys);
            // RC assigments
            if (empty($onwardKeys['rc']) || empty($backwardKeys['rc'])) {
                throw new B2bApiException(B2bApiException::MISSING_RC, null, 400);
            }
            $this->rcs = array_merge(json_decode($onwardKeys['rc'], true), json_decode($backwardKeys['rc'], true));
            // TS assigment
            if (empty($onwardKeys['ts']) || empty($backwardKeys['ts'])) {
                throw new B2bApiException(B2bApiException::MISSING_TS, null, 400);
            }
            $this->ts = (int) $onwardKeys['ts'];
        } else {
            parse_str($this->journeyKey, $keys);
            // RC assigments
            if (empty($keys['rc'])) {
                throw new B2bApiException(B2bApiException::MISSING_RC, null, 400);
            }
            $this->rcs = json_decode($keys['rc'], true);
            // TS assigment
            if (empty($keys['ts'])) {
                throw new B2bApiException(B2bApiException::MISSING_TS, null, 400);
            }
            $this->ts = (int) $keys['ts'];
        }
        // Keep the original arrRcses
        $arrRcsOrig = AirConfirm::fetchTheRcs($this->rcs, $this->ts);
        // Set the PAXes
        $this->pax = AirConfirm::preparePaxes($arrRcsOrig);
        // Pax data validation
        $this->validatePax(empty($this->passengers) ? null : $this->passengers);
        $this->segments = AirConfirm::prepareSegments($arrRcsOrig);

        $this->rcs = [AirConfirm::fetchTheRcs($this->rcs, $this->ts)];
        // Apply commercial rule to the RouteCache results
        if (!empty($this->credentials->user->userInfo->commercial_plan_id)) {
            $this->credentials->user->userInfo->commercialPlan->applyPlanToRcJourneys($this->rcs, \ClientSource::SOURCE_DIRECT);
        }

        // Check if the customer balance is enough
        $this->balanceCheck();

        if (in_array($this->credentials->user->email, self::$TEST_USER_EMAILS)) {
//                return json_encode($this->travelers);
            // Fake booking
//            $checkAF = true;
            $checkAF = \ApiInterface::checkAvailabilityAndFares($this->rcs[0][0][0]->air_source_id, [
                        'segments' => $this->segments,
                        'pax' => $this->pax,
                        'cabinTypeId' => $this->rcs[0][0][0]->cabin_type_id,
                            ], $this->travelers);
            if ($checkAF === true) {
                $check['airCartId'] = $this->fakeBooking($arrRcsOrig);
            } else {
//                \Utils::dbgYiiLog($checkAF);
                throw new B2bApiException($checkAF['errorCode'], isset($checkAF['message']) ? $checkAF['message'] : null, 400, $checkAF['priceDiff']);
            }
        } else {
            // Do the booking
            $check = \ApiInterface::book($this->rcs[0][0]->air_source_id, [
                        'segments' => $this->segments,
                        'pax' => $this->pax,
                        'cabinTypeId' => $this->rcs[0][0]->cabin_type_id,
                            ], $this->travelers,
                    $this->rcs[0][0]->airSource->getFop($this->credentials->user->id, $this->rcs[0][0]),
                    $this->rcs[0][0]->airSource->getCc($this->credentials->user->id, $this->rcs[0][0]));
        }
        if (!empty($check['error'])) {
            throw new B2bApiException(B2bApiException::OTHER_BOOKING_ERROR, null, 500, $check['error']);
        }

        // Register new payment for this cart
        $airCart = \AirCart::model()->findByPk($check['airCartId']);
        \Utils::setActiveUserAndCompany($this->credentials->user->id);
        $airCart->registerPayment();

        // Prepare the airCart for output
        $getAirCart = new GetAirCart;
        $getAirCart->cartID = (int) $check['airCartId'];
        $getAirCart->credentials = $this->credentials;
        return $getAirCart->results();
    }

    /**
     * Create fake booking for testing the B2BAPI
     * @return int AirCart ID
     */
    function fakeBooking(array $arrRcsOrig) {
        // Create the AirCart
        $airCart = new \AirCart;
        $airCart->user_id = $this->credentials->user->id;
        $airCart->loged_user_id = $this->credentials->user->id;
        $airCart->payment_status_id = \PaymentStatus::STATUS_NOT_CHARGED;
        $airCart->booking_status_id = \BookingStatus::STATUS_COMPLETE;
        $airCart->approval_status_id = \ApprovalStatus::STATUS_NOT_REQUIRED;
        $airCart->note = 'Booking via B2B API';
        $airCart->insert();

        foreach ($arrRcsOrig as $journey) {
            foreach ($journey as $rc) {
                /* @var $rc \RoutesCache */
                $trips = $rc->extractSegments();
                foreach ($this->travelers as $traveler) {
                    $addFare = true;  // Flag to add the fare once per pax
                    if ($traveler['traveler_type_id'] != $rc->traveler_type_id) {
                        continue;   // This is some other traveller type
                    }
                    foreach ($trips as $segments) {
//                            \Utils::dbgYiiLog($segments);
                        $firstSegment = reset($segments);
                        $lastSegment = end($segments);
                        // Add this AirBooking
                        $airBooking = new \AirBooking;
                        $airBooking->airline_pnr = self::FAKE_PNR;
                        $airBooking->crs_pnr = self::FAKE_PNR;
                        $airBooking->booking_type_id = \BookingType::AUTOMATED_BOOKING;
                        $airBooking->air_source_id = $rc->air_source_id;
                        $airBooking->traveler_type_id = $traveler['traveler_type_id'];
                        $airBooking->traveler_id = $traveler['id'];
                        $airBooking->source_id = \Airport::getIdFromCode($firstSegment['origin']);
                        $airBooking->destination_id = \Airport::getIdFromCode($firstSegment['destination']);
                        $airBooking->carrier_id = $rc->carrier_id;
                        $airBooking->departure_ts = $firstSegment['departTs'];
                        $airBooking->arrival_ts = $lastSegment['arriveTs'];
                        $airBooking->service_type_id = $rc->service_type_id;
                        $airBooking->fare_basis = $rc->fare_basis;
                        $airBooking->booking_class = $firstSegment['bookingClass'];
                        $airBooking->fare_type_id = \FareType::getFareType($rc->carrier_id, $airBooking->booking_class);
                        $airBooking->air_cart_id = $airCart->id;
                        $airBooking->ticket_number = self::FAKE_TICKET;
                        $airBooking->cabin_type_id = $rc->cabin_type_id;
                        // Fill the Fare once per journey
                        if ($addFare) {
                            $airBooking->basic_fare = $rc->base_fare;
                            $airBooking->fuel_surcharge = $rc->tax_yq;
                            $airBooking->jn_tax = $rc->tax_jn;
                            $airBooking->udf_charge = $rc->tax_psf + $rc->tax_udf;
                            $airBooking->other_tax = $rc->tax_other;
                            $airBooking->commission_or_discount_gross = $rc->discount;
                            $airBooking->booking_fee = $rc->bookingFee;
                            $addFare = false;
                        }
                        $airBooking->insert();

                        foreach ($segments as $segment) {
                            /* @var $segment \LegsJson */
                            $airRoute = new \AirRoutes;
                            $airRoute->air_booking_id = $airBooking->id;
                            $airRoute->airPnr = self::FAKE_PNR;
                            $airRoute->aircraft = $segment['aircraft'];
                            $airRoute->arrival_ts = $segment['arriveTs'];
                            $airRoute->departure_ts = $segment['departTs'];
                            $airRoute->booking_class = $segment['bookingClass'];
                            $airRoute->flight_number = $segment['flightNumber'];
                            $airRoute->carrier_id = \Carrier::getIdFromCode($segment['carrier']);
                            $airRoute->destination_terminal = $segment['destinationTerminal'];
                            $airRoute->source_terminal = $segment['originTerminal'];
                            $airRoute->destination_id = \Airport::getIdFromCode($segment['destination']);
                            $airRoute->source_id = \Airport::getIdFromCode($segment['origin']);
                            $airRoute->insert();
                        }
                        $airBooking->setAirRoutesOrder();
                    }
                }
            }
        }
        $airCart->applyBothRules();
        $airCart->setBookingStatus();
        return $airCart->id;
    }

    /**
     * Check if the balance is enough to make the booking
     * @throws B2bApiException When the balance is not sufficient
     */
    function balanceCheck() {
        $neededBalance = 0;
        foreach ($this->rcs as $journeys) {
            foreach ($journeys as $journey) {
                foreach ($journey as $rc) {
                    $neededBalance += $rc->total_fare;
                }
            }
        }
        $balance = $this->credentials->getBalance();
        $currency = $this->credentials->user->userInfo->currency->code;
        if ($balance['total'] < $neededBalance) {
            throw new B2bApiException(B2bApiException::INSUFFICIENT_BALANCE, null, 402, "Available: {$balance['total']} $currency, required: $neededBalance $currency");
        }
    }

}
