<?php

namespace application\components\B2cApi;

/**
 * AirBook
 *
 * @author Boxx
 * @package B2cApi
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
    public $cart_id = null;
    public $pgl_id = null;
    public $ecc;
    public $id;
    public $type;
    public $name;
    public $number;
    public $exp_month;
    public $exp_year;
    public $cvv;
    public $store;

    const key = 'B2CCARTID';

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

    /* public function serialize() {
      $airbook= new \AirBook();

      $airbook->journeyKey=$this->journeyKey;
      $airbook->onwardKey=$this->onwardKey;
      $airbook->backwardKey=$this->backwardKey;
      $airbook->passengers=$this->passengers;
      return $airbook;

      } */

    public function toJson() {
        $out = [
            'journeyKey' => $this->journeyKey,
            'onwardKey' => $this->onwardKey,
            'backwardKey' => $this->backwardKey,
            'passengers' => $this->passengers,
        ];
        //  \Utils::dbgYiiLog($out);
        //  \Utils::dbgYiiLog(json_encode($out));
        return json_encode($out);
    }

    public function decodeJson($data) {
        // \Utils::dbgYiiLog($data);
        // \Utils::dbgYiiLog(json_decode($data));
        $this->credentials = new Auth;
        $this->credentials = $data->credentials;
        $this->journeyKey = $data->journeyKey;
        $this->onwardKey = $data->onwardKey;
        $this->backwardKey = $data->backwardKey;
        $this->passengers = $data->passengers;
        $this->ts = $data->ts;
        //   $out = json_decode($data);
        /* $this->journeyKey=$out['journeyKey'];
          $this->onwardKey=$out['onwardKey'];
          $this->backwardKey=$out['backwardKey'];
          $this->passengers=$out['passengers']; */
    }

    function validatePax($passengers) {
        if (empty($passengers) || !is_array($passengers)) {
            throw new B2cApiException(B2cApiException::INVALID_PASSENGERS_ELEMENTS, null, 400);
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
                throw new B2cApiException(B2cApiException::TRAVELER_FORMAT_ERROR, $this->validationErrors, 400);
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
            throw new B2cApiException(B2cApiException::MISSING_BOOKING_KEY, null, 400);
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
                throw new B2cApiException(B2cApiException::MISSING_RC, null, 400);
            }
            $this->rcs = array_merge(json_decode($onwardKeys['rc'], true), json_decode($backwardKeys['rc'], true));
            // TS assigment
            if (empty($onwardKeys['ts']) || empty($backwardKeys['ts'])) {
                throw new B2cApiException(B2cApiException::MISSING_TS, null, 400);
            }
            $this->ts = (int) $onwardKeys['ts'];
        } else {
            parse_str($this->journeyKey, $keys);
            // RC assigments
            if (empty($keys['rc'])) {
                throw new B2cApiException(B2cApiException::MISSING_RC, null, 400);
            }
            $this->rcs = json_decode($keys['rc'], true);
            // TS assigment
            if (empty($keys['ts'])) {
                throw new B2cApiException(B2cApiException::MISSING_TS, null, 400);
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
        //    $this->balanceCheck();
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
            throw new B2cApiException($checkAF['errorCode'], isset($checkAF['message']) ? $checkAF['message'] : null, 400, $checkAF['priceDiff']);
        }

        if (!empty($check['error'])) {
            throw new B2cApiException(B2cApiException::OTHER_BOOKING_ERROR, null, 500, $check['error']);
        }

        // Register new payment for this cart
        $airCart = \AirCart::model()->findByPk($check['airCartId']);
        \Utils::setActiveUserAndCompany($this->credentials->user->id);
        $neededBalance = 0;
        foreach ($this->rcs as $journeys) {
            foreach ($journeys as $journey) {
                foreach ($journey as $rc) {
                    $neededBalance += $rc->total_fare;
                }
            }
        }
        //      $balance = $this->credentials->getBalance();
        $currency = $this->credentials->user->userInfo->currency->code;
//        if ($balance['total'] < $neededBalance) {
//            throw new B2cApiException(B2cApiException::INSUFFICIENT_BALANCE, null, 402, "Available: {$balance['total']} $currency, required: $neededBalance $currency");
//        }
        $cart = $airCart;
        $this->ecc = new \ECCValidator2();
        $pgl = new \PayGateLog();
        $pgl->pg_id = YII_DEBUG ? \PaymentGateway::AMEX_TEST : \PaymentGateway::AMEX_PRODUCTION;
        $pgl->air_cart_id = $cart->id;
        $pgl->user_info_id = $this->credentials->user->user_info_id;
        $pgl->amount = (double) $neededBalance;
        $pgl->convince_fee = $pgl->convenienceFee();
        $pgl->callback = json_encode(["\\application\\components\\B2cApi\\AirBook::paymentCallback", [$cart->id]]);
        $pgl->setBasics();
        $cart->addNote('Payment: initiated');
        $pgl->save();
        \Utils::setActiveUserAndCompany($this->credentials->user->id);
        // Prepare the airCart for output
        $getAirCart = new GetAirCart;
        $getAirCart->cartID = (int) $check['airCartId'];
        $getAirCart->credentials = $this->credentials;
        $getAirCart->pgl_id = $pgl->id;

        $this->pgl_id = $pgl->id;
        // $_SESSION[self::key.$cart->id]=$this->toJson();
        //   \Yii::app()->session->add(self::key.$cart->id,$this->toJson());
//        
//        $value = \Yii::app()->cache->get($varName) ? : 0;
//        $value += $increase;
        //  \Yii::app()->cache->set(self::key.$cart->id,$this->toJson(),1800);
        \Yii::app()->cache->set(self::key . $cart->id, $this, 1800);
        //  \Utils::dbgYiiLog( \Yii::app()->cache->get(self::key.$cart->id));
        //\Utils::dbgYiiLog($_SESSION);
        //self::paymentCallback($cart->id);
        //\Yii::app()->session['B2CAPI:airCartId:' . $cart->id]= $this->toJson();
        // \Utils::dbgYiiLog($_SESSION[self::key.$cart->id]);
        return $getAirCart->results();
    }

    /**
     * Return the results
     * @return string JSON encoded results
     */
    function resultsFinal($initialinput) {
        if (empty($this->journeyKey)) {
            parse_str($this->onwardKey, $onwardKeys);
            parse_str($this->backwardKey, $backwardKeys);
            // RC assigments
            if (empty($onwardKeys['rc']) || empty($backwardKeys['rc'])) {
                throw new B2cApiException(B2cApiException::MISSING_RC, null, 400);
            }
            $this->rcs = array_merge(json_decode($onwardKeys['rc'], true), json_decode($backwardKeys['rc'], true));
            // TS assigment
            if (empty($onwardKeys['ts']) || empty($backwardKeys['ts'])) {
                throw new B2cApiException(B2cApiException::MISSING_TS, null, 400);
            }
            $this->ts = (int) $onwardKeys['ts'];
        } else {
            parse_str($this->journeyKey, $keys);
            // RC assigments
            if (empty($keys['rc'])) {
                throw new B2cApiException(B2cApiException::MISSING_RC, null, 400);
            }
            $this->rcs = json_decode($keys['rc'], true);
            // TS assigment
            if (empty($keys['ts'])) {
                throw new B2cApiException(B2cApiException::MISSING_TS, null, 400);
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
        //$this->balanceCheck();

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
//        if ($balance['total'] < $neededBalance) {
//            throw new B2cApiException(B2cApiException::INSUFFICIENT_BALANCE, null, 402, "Available: {$balance['total']} $currency, required: $neededBalance $currency");
//        }
        $cart = \AirCart::model()->findByPk($this->cart_id);
        $this->ecc = new \ECCValidator2();
        $pgl = new \PayGateLog();
        $pgl->pg_id = YII_DEBUG ? \PaymentGateway::AMEX_TEST : \PaymentGateway::AMEX_PRODUCTION;
        $pgl->air_cart_id = $this->cart_id;
        $pgl->user_info_id = $this->credentials->user->user_info_id;
        $pgl->amount = (double) $neededBalance;
        $pgl->convince_fee = $pgl->convenienceFee();
        $pgl->callback = json_encode(["\application\components\B2cApi\MakePayment::paymentCallback", [$booking->id]]);
        $pgl->setBasics();
        $cart->addNote('Payment: initiated');
        $pgl->save();
        \Utils::setActiveUserAndCompany($this->credentials->user->id);

        // Now need to fill post for params for PayGateController
        // not cool, but will do for now
        // following params are expected in the number of places in the PayGateController and PayGateLog model
        $_POST = array_merge($initialinput, [
            'card_number' => $this->number,
            'name_on_card' => $this->name,
            'expiry_month' => sprintf("%02d", $this->exp_month),
            'expiry_year' => sprintf("%02d", $this->exp_year),
            'cvv' => $this->cvv,
                // 'store_card' => $this->store,
                //  'storedCardId' => $this->id ? $this->id : false
        ]);

        $controller->forward('/payGate/doPay/id/' . $pgl->id);
    }

    /**
     * Payment Callback     
     * @return string JSON encoded results
     */
    static function paymentCallback($id, $payment = null) {
        $airbook = new AirBook();
        $airbook = \Yii::app()->cache->get(self::key . $id);
        $act = \AirCart::model()->findByPk($id);
//        if (!$payment) {
//            
//            $act->addNote('Payment: successful');
//            $pgl = \PayGateLog::model()->findByPk($airbook->pgl_id);
//            $act->addNote('Payment: failed. ' . $pgl->reason);
//            throw new B2cApiException(B2cApiException::FAILED_PAYMENT, null, 500, 'Payment: failed. ' . $pgl->reason);
//        } else {}
            $airbook->credentials->authenticate();

            $act = \AirCart::model()->findByPk($id);
            $act->addNote('Payment: successful');

            //    \Utils::dbgYiiLog($airbook);
            \Utils::setActiveUserAndCompany($airbook->credentials->user->id);


//        \Utils::dbgYiiLog([$airbook->rcs[0][0][0]->air_source_id, [
//                'segments' => $airbook->segments,
//                'pax' => $airbook->pax,
//                'cabinTypeId' => $airbook->rcs[0][0][0]->cabin_type_id,
//            ], $airbook->travelers,
//            $airbook->rcs[0][0][0]->airSource->getFop($airbook->credentials->user->id, $airbook->rcs[0][0][0]),
//            $airbook->rcs[0][0][0]->airSource->getCc($airbook->credentials->user->id, $airbook->rcs[0][0][0])]);


            if ($airbook->rcs[0][0][0]->airSource->backend->isAmadeus) {
                $book = new $airbook->rcs[0][0][0]->airSource->backend->book(
                        (int) $airbook->rcs[0][0][0]->air_source_id, [
                    'segments' => $airbook->segments,
                    'pax' => $airbook->pax,
                    'cabinTypeId' => $airbook->rcs[0][0][0]->cabin_type_id
                        ], $airbook->travelers, $airbook->rcs[0][0][0]->airSource->getFop($airbook->credentials->user->id, $airbook->rcs[0][0][0]), $airbook->rcs[0][0][0]->airSource->getCc($airbook->credentials->user->id, $airbook->rcs[0][0][0]), $airbook->rcs[0][0][0]->carrier_id
                );

                $check = $book->doBooking();
            } else {
                // Do the booking
                $check = \ApiInterface::book((int) $airbook->rcs[0][0][0]->air_source_id, [
                            'segments' => $airbook->segments,
                            'pax' => $airbook->pax,
                            'cabinTypeId' => $airbook->rcs[0][0][0]->cabin_type_id,
                                ], $airbook->travelers, 
                        $airbook->rcs[0][0][0]->airSource->getFop($airbook->credentials->user->id,$airbook->rcs[0][0][0]), 
                        $airbook->rcs[0][0][0]->airSource->getCc($airbook->credentials->user->id, $airbook->rcs[0][0][0]),
                        null,
                        true
                        );
            }
            if (!empty($check['error'])) {
                 $act->addNote($check['error']);
                throw new B2cApiException(B2cApiException::OTHER_BOOKING_ERROR, null, 500, $check['error']);
            }

            // Register new payment for this cart
            $airCart = \AirCart::model()->findByPk($check['airCartId']);
            \Utils::setActiveUserAndCompany($airbook->credentials->user->id);
            $notes=$act->notes;
            $act->removeFake($airCart);
            $airCart->notes=$notes;
            $airCart->save(false);
            $airCart->refresh();
            $airCart->setAirBookingsAndAirRoutesOrder();
            $airCart->applyBothRules();
            $airCart->setBookingStatus();
            $airCart->registerPayment();


            // Prepare the airCart for output
            $getAirCart = new GetAirCart;
            $getAirCart->cartID = (int) $check['airCartId'];
            $getAirCart->credentials = $airbook->credentials;
            echo $getAirCart->results();
            \Yii::app()->end();
        
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
        $airCart->note = 'Booking via B2C API';
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
        // $airCart->applyBothRules();
        // $airCart->setBookingStatus();
        return $airCart->id;
    }

    /**
     * Check if the balance is enough to make the booking
     * @throws B2cApiException When the balance is not sufficient
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
            throw new B2cApiException(B2cApiException::INSUFFICIENT_BALANCE, null, 402, "Available: {$balance['total']} $currency, required: $neededBalance $currency");
        }
    }

}
