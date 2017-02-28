<?php

namespace b2c\controllers;

use b2c\components\ControllerExceptionable;
use b2c\components\ControllerOverridable;
use b2c\components\FlightTransformer;
use b2c\models\Booking;
use application\components\Amadeus\Utils;

\Yii::import('application.controllers.AirCartController');

class AirCartController extends \AirCartController {

    use ControllerOverridable,
        ControllerExceptionable;

    protected $_inheritRules = false;

    static public function authorize() {
        $id = \Yii::app()->request->getParam('id', false);

        //    if ($id && $journey = \AirJourney::load($id)) {
        //        return $journey->isBooked();
        //    }
        return true;

        //return false;
    }

    public function accessRules() {
        return [
            ['allow', 'actions' => ['print', 'view'], 'expression' => [$this, 'authorize']],
            ['allow', 'users' => ['*']],
        ];
    }

    /**
     * Get the Meta Data required
     */
    public function actionMeta() {
        $meta = new \stdClass;

        $meta->titles = [];
        // titles id array
        $titles_id = \TravelerTitle::$titlesId;
        foreach (\TravelerTitle::model()->cache(3600)->findAllByAttributes(['id' => $titles_id], ['order' => 'id']) as $i) {
            $meta->titles[] = $i->attributes;
        }

        $meta->travelerTypes = \TravelerType::$typeToStr;
        $meta->amendmentTypes = \AmendmentType::$strToType;

        $meta->bookingStatus = [];
        foreach (\BookingStatus::model()->findAll() as $i) {
            $meta->bookingStatus[] = $i->attributes;
        }
        if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);

            $meta->user = ['email' => $user->email, 'mobile' => $user->mobile, 'name' => $user->name];
        }
        $meta->abbookingStatus = [];
        foreach (\AbStatus::model()->findAll() as $i) {
            $meta->abbookingStatus[] = $i->attributes;
        }
        \Utils::jsonResponse($meta);
    }

    /**
     * Send the AirCart as pdf file
     * @param integer $id AirCart ID
     */
    public function actionAsPdf($id) {
    	//\Utils::dbgYiiLog(\Yii::app()->request->hostInfo . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
        \Yii::app()->pdf->send(\Yii::app()->request->hostInfo . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
    }

    /**
     * Send the AirCart as pdf file attached in email
     * @param integer $id AirCart ID
     */
    public function actionSendEmail($id) {
        $model = $this->loadModel($id);
        $usermail = \Yii::app()->request->getPost('email'); //$model->user->email;
        if ($usermail === null) {
            $usermail = $model->user->userInfo->email;
        }
        $model->sendBookedEmailforB2C($usermail);
    }

    public function actionMybookings() {
        $this->pageTitle = 'CheapTicket.in';
        $pieces = explode("/mybookings/", \Yii::app()->request->url);
        if (isset(\Yii::app()->user->id)) {
            if ($this->isMobile()) {
                $this->layout = '//layouts/mobile';
                $this->render('//common/mobilejs', ['bundle' => 'mybookings']);
            } else {
                $this->render('//common/js', ['bundle' => 'mybookings']);
            }
        } else if (isset($pieces[1]) && strlen($pieces[1]) > 0) {
            if ($this->isMobile()) {
                $this->layout = '//layouts/mobile';
                $this->render('//common/mobilejs', ['bundle' => 'mybookings']);
            } else {
                $this->render('//common/js', ['bundle' => 'mybookings']);
            }
        } else {
            if ($this->isMobile()) {
                $this->layout = '//layouts/mobile';
                $this->render('//common/mobilejs', ['bundle' => 'guestfilter']);
            } else {
                $this->render('//common/js', ['bundle' => 'guestfilter']);
            }
        }
    }

    public function actionGuestbooking() {

        if (isset(\Yii::app()->user->id)) {
            if ($this->isMobile()) {
                $this->layout = '//layouts/mobile';
                $this->render('//common/mobilejs', ['bundle' => 'mybookings']);
            } else {
                $this->render('//common/js', ['bundle' => 'mybookings']);
            }
        } else {
            if ($this->isMobile()) {
                $this->layout = '//layouts/mobile';
                $this->render('//common/mobilejs', ['bundle' => 'guestfilter']);
            } else {
                $this->render('//common/js', ['bundle' => 'guestfilter']);
            }
        }
    }

    public function actionGetguestbooking() {
        if (empty($_POST['pnr']) && empty($_POST['pnr2'])) {
            $error['error'] = 'Please Enter PNR / Booking No.';
            return \Utils::jsonResponse($error);
        }
        if (!empty($_POST['pnr']) && isset($_POST['mobile']) && empty($_POST['mobile'])) {
            $error['error'] = 'Please Enter Mobile No / Email';
            return \Utils::jsonResponse($error);
        }

        if (!empty($_POST['pnr2']) && isset($_POST['lastname']) && empty($_POST['lastname'])) {
            $error['error'] = 'Please Enter Last Name';
            return \Utils::jsonResponse($error);
        }

        $cart = [];
        if (isset($_POST['pnr']) && isset($_POST['mobile'])) {
            $id = null;
            $pnr = $_POST['pnr'];
            $mobile = $_POST['mobile'];
            $email = $mobile;
            if (empty($mobile) || strlen($mobile) < 10 || !is_numeric($mobile)) {
                $error['error'] = 'Invalid mobile number.';
                return \Utils::jsonResponse($error);
            }
            $mobile = substr($mobile, -10);
            if (is_numeric($pnr)) {
                if ($pnr > abs(2147483647)) {
                    $error['error'] = 'Invalid PNR/Booking Id number.';
                    return \Utils::jsonResponse($error);
                }

                $airbookings = \AirBooking::model()->with('traveler')->findAll('air_cart_id=:pnr AND '
                        . '( substr(traveler.phone,length(traveler.phone)-9,10)=:mobile '
                        . 'OR substr(traveler.mobile,length(traveler.mobile)-9,10)=:mobile '
                        . 'OR traveler.email=:email )', [
                    ':pnr' => $pnr,
                    ':mobile' => $mobile,
                    ':email' => strtolower($email)
                ]);
            } else {
                $airbookings = \AirBooking::model()->with('traveler')->findAll('(airline_pnr=:pnr OR crs_pnr=:pnr) AND '
                        . '( substr(traveler.phone,length(traveler.phone)-9,10)=:mobile '
                        . 'OR substr(traveler.mobile,length(traveler.mobile)-9,10)=:mobile '
                        . 'OR traveler.email=:email )', [
                    ':pnr' => strtoupper($pnr),
                    ':mobile' => $mobile,
                    ':email' => strtolower($email)
                ]);
            }
            if (!$airbookings == null && !empty($airbookings))
                foreach ($airbookings as $i) {

                    $cart[$i->attributes['air_cart_id']] = $i->attributes['air_cart_id'];
                    $id = $i->attributes['air_cart_id'];
                }


            if ($id && $id != null) {
                return self::cartDetailsById($id);
            } else {
                $error['error'] = 'Not found any booking with specified information';
                return \Utils::jsonResponse($error);
            }
        } else if (isset($_POST['pnr2']) && isset($_POST['lastname'])) {
            $id = null;
            $pnr = $_POST['pnr2'];
            $lastname = $_POST['lastname'];
            if (is_numeric($pnr)) {
                if ($pnr > abs(2147483647)) {
                    $error['error'] = 'Invalid PNR/Booking Id number.';
                    return \Utils::jsonResponse($error);
                }
                $airbookings = \AirBooking::model()->with('traveler')->findAll('air_cart_id=:pnr AND LOWER(traveler.last_name)=LOWER(:lastname)', [
                    ':pnr' => $pnr,
                    ':lastname' => $lastname,
                ]);
            } else {
                $airbookings = \AirBooking::model()->with('traveler')->findAll('(airline_pnr=:pnr or crs_pnr=:pnr) AND LOWER(traveler.last_name)=LOWER(:lastname)', [
                    ':pnr' => strtoupper($pnr),
                    ':lastname' => $lastname,
                ]);
            }
            if (!$airbookings == null && !empty($airbookings))
                foreach ($airbookings as $i) {

                    $cart[$i->attributes['air_cart_id']] = $i->attributes['air_cart_id'];
                    $id = $i->attributes['air_cart_id'];
                }


            if ($id && $id != null) {
                return self::cartDetailsById($id);
            } else {
                $error['error'] = 'Not found any booking with specified information';
                return \Utils::jsonResponse($error);
            }
        } else {
            $error['error'] = 'Not found any booking with specified information';
            return \Utils::jsonResponse($error);
        }
    }

    public function actionGetMyBookings() {

        $userId = \Utils::getActiveUserId();
        $carts = [];
        if (!empty($userId) && $userId != null)
            foreach (\AirCart::model()->findAll(array('order' => 'id DESC', 'condition' => 'user_id=' . $userId . 'and website_id='.\AirCart::getWebsiteId().' and booking_status_id<>' . \BookingStatus::STATUS_NEW)) as $i) {
                $id = $i->attributes['id'];
                $flag = false;
                foreach ($i->airBookings as $value) {
                    $flag = true;
                    break;
                }
                if (!$flag)
                    continue;

                $carts[$id]['id'] = $id;
                $carts[$id]['email'] = $i->user->email;
                $carts[$id]['created'] = $i->attributes['created'];
                $carts[$id]['totalAmount'] = $i->totalAmount();
                $carts[$id]['booking_status'] = $i->attributes['booking_status_id'];
                $first = true;
                $lastDeparture = null;
                $airBookings = \AirBooking::model()->findAll(['condition' => 'air_cart_id=:airCartId', 'order' => 'departure_ts', 'params' => [':airCartId' => $id]]);
                foreach ($airBookings as $value) {
                    if ($first) {
                        $carts[$id]['returndate'] = $value->getReturnDate();
                        $carts[$id]['isMultiCity'] = $value->isMultiCity();
                        if ($carts[$id]['isMultiCity'] == 'false' && $carts[$id]['returndate'] != null) {
                            if (count($airBookings) == 2 && $airBookings[0]->source_id != $airBookings[1]->destination_id) {
                                $carts[$id]['isMultiCity'] = 'true';
                            }
                        }
                        $carts[$id]['curency'] = $value->airSource->currency->code;
                        $lastDeparture = $value->attributes['departure_ts'];
                        $first = false;
                    }
                    $bookingid = $value->attributes['id'];
                    $carts[$id]['bookings'][$bookingid]['id'] = $bookingid;
                    $carts[$id]['bookings'][$bookingid]['source'] = $value->source->attributes['city_name'];
                    $carts[$id]['bookings'][$bookingid]['destination'] = $value->destination->attributes['city_name'];
                    $carts[$id]['bookings'][$bookingid]['source_id'] = $value->attributes['source_id'];
                    $carts[$id]['bookings'][$bookingid]['destination_id'] = $value->attributes['destination_id'];
                    $carts[$id]['bookings'][$bookingid]['departure'] = $value->attributes['departure_ts'];
                    $d = new \DateTime($value->attributes['departure_ts']);
                    $t = new \DateTime($lastDeparture);
                    if ($d > $t) {
                        $lastDeparture = $value->attributes['departure_ts'];
                    }
                    $carts[$id]['bookings'][$bookingid]['arrival'] = $value->attributes['arrival_ts'];
                    $carts[$id]['bookings'][$bookingid]['traveller'][$value->attributes['traveler_id']]['id'] = $value->traveler->id;
                    $carts[$id]['bookings'][$bookingid]['traveller'][$value->attributes['traveler_id']]['name'] = $value->traveler->attributes['first_name'];

                    $carts[$id]['travellerdtl'][$value->attributes['traveler_id']]['id'] = $value->traveler->id;
                    $carts[$id]['travellerdtl'][$value->attributes['traveler_id']]['name'] = $value->traveler->attributes['first_name'];


                    if (!isset($carts[$id]['travellerdtl'][$value->attributes['traveler_id']]['src'][$value->attributes['destination_id']])) {
                        $carts[$id]['travellerdtl'][$value->attributes['traveler_id']]['src'][$value->attributes['source_id']] = $value->source->attributes['city_name'];
                        $carts[$id]['travellerdtl'][$value->attributes['traveler_id']]['dest'][$value->attributes['destination_id']] = $value->destination->attributes['city_name'];
                    }
                }
                $t = new \DateTime($lastDeparture);
                $d = new \DateTime('today');
                if ($t > $d) {
                    $carts[$id]['upcoming'] = 'true';
                } else {
                    $carts[$id]['upcoming'] = 'false';
                }
            }
        //    \Utils::dbgYiiLog($carts);

        return \Utils::jsonResponse($carts);
    }

    public function actionGetCartDetails($id) {
        //      $userId = \Utils::getActiveUserId();
        //       if(!empty($userId)&&$userId!=null)
        return self::cartDetailsById($id);
//        else {
//            \Utils::jsonHeader();
//            echo json_encode([
//                'result' => 'error',
//                'msg' => 'Cart Does Not exist'
//            ]);
//            \Yii::app()->end();
//        }
    }

    public static function cartDetailsById($id) {
        $carts = [];
        $srcdest = [];
        $i = \AirCart::model()->findByPk($id);
        if ($i == null || empty($i)) {
            \Utils::jsonHeader();
            echo json_encode([
                'result' => 'error',
                'msg' => 'Cart Does Not exist'
            ]);
            \Yii::app()->end();
        }
        $cartFare = 0;
        $cartTaxes = 0;
        $cartFees = 0;
        $airBookings = \AirBooking::model()->findAll(['condition' => 'air_cart_id=:airCartId', 'order' => 'departure_ts', 'params' => [':airCartId' => $id]]);

        foreach ($airBookings as $value) {
            $cartFare += $value->attributes['basic_fare'];
            $cartTaxes += $value->taxesOnly + $value->service_tax + $value->jn_tax - $value->commission_or_discount_gross;
            $cartFees += $value->booking_fee;
        }
        $id = $i->attributes['id'];
        $details['id'] = $id;
        $details['clientSourceId'] = $i->attributes['client_source_id'];
        $details['email'] = $i->user->email;
        $details['created'] = $i->attributes['created'];
        $details['fop'] = $i->paymentStatus->name;
        $details['baseprice'] = \number_format($cartFare);
        $details['taxes'] = \number_format($cartTaxes);
        $details['fee'] = \number_format($cartFees);
        $details['convfee'] = \number_format($i->convenienceFee);
        $details['promo_discount'] = \number_format($i->promoDiscount);
        $details['totalAmount'] = $i->totalAmount();
        $amount = $i->totalAmount();
        $details['totalAmountinwords'] = \ucwords(\Utils::numberToWords(\round($amount)));
        $details['customercare'] = \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['customercare'];
        $details['curency'] = $i->user->userInfo->currency->code;
        $details['booking_status'] = $i->attributes['booking_status_id'];
        if ($i->attributes['booking_status_id'] == \BookingStatus::STATUS_BOOKED || $i->attributes['booking_status_id'] == \BookingStatus::STATUS_BOOKED_TO_BILL || $i->attributes['booking_status_id'] == \BookingStatus::STATUS_BOOKED_TO_CAPTURE || $i->attributes['booking_status_id'] == \BookingStatus::STATUS_COMPLETE)
            $details['booking_statusmsg'] = 'CONFIRMED';
        else if ($i->attributes['booking_status_id'] == \BookingStatus::STATUS_NEW)
            $details['booking_statusmsg'] = 'PENDING';
          else if ($i->attributes['booking_status_id'] == \BookingStatus::STATUS_FRAUD)
            $details['booking_statusmsg'] = 'PENDING';
        else
            $details['booking_statusmsg'] = $i->bookingStatus->attributes['name'];

        $details['ticketstatusmsg'] = $i->bookingStatus->attributes['message'];
        if ($i->bookingStatus->id == \BookingStatus::STATUS_IN_PROCESS)
            $details['ticketstatusmsg'] = \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_IN_PROCESS'];
        else if ($i->bookingStatus->id == \BookingStatus::STATUS_NEW)
            $details['ticketstatusmsg'] = \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_NEW'];
        else if ($i->bookingStatus->id == \BookingStatus::STATUS_HOLD)
            $details['ticketstatusmsg'] = str_replace("#BOOKINGID#",$id,\Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_HOLD']);
        else if ($i->bookingStatus->id == \BookingStatus::STATUS_ABORTED)
            $details['ticketstatusmsg'] = str_replace("#BOOKINGID#",$id,\Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_ABORTED']);
        else if ($i->bookingStatus->id == \BookingStatus::STATUS_TO_CANCEL)
            $details['ticketstatusmsg'] = \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_TO_CANCEL'];
        else if ($i->bookingStatus->id == \BookingStatus::STATUS_CANCELLED)
            $details['ticketstatusmsg'] = \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_CANCELLED'];
        else if ($i->bookingStatus->id == \BookingStatus::STATUS_PARTIALLY_BOOKED)
            $details['ticketstatusmsg'] = str_replace("#BOOKINGID#",$id,\Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_PARTIALLY_BOOKED']);
        else if ($i->bookingStatus->id == \BookingStatus::STATUS_BOOKED)
            $details['ticketstatusmsg'] = "";


        foreach ($i->airBookings as $booking) {
            if ($booking->carrier_id == \Carrier::CARRIER_GOAIR && $i->booking_status_id !== \BookingStatus::STATUS_BOOKED && $i->booking_status_id !== \BookingStatus::STATUS_CANCELLED) {
                $details['ticketstatusmsg'] = \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['CARRIER_GOAIR'];
                break;
            }
        }
        $segNights = 0;
        $first = true;
        $lastDeparture = null;
        $pnr = 'airline_pnr';
        $upcomingflag = 'false';
        $conv_fee = 0;
        foreach ($airBookings as $value) {
            if ($first) {
                $details['returndate'] = $value->getReturnDate();
                $details['isMultiCity'] = $value->isMultiCity();
                if ($details['isMultiCity'] == 'false' && $details['returndate'] != null) {
                    if (count($airBookings) == 2 && $airBookings[0]->source_id != $airBookings[1]->destination_id) {
                        $details['isMultiCity'] = 'true';
                    }
                }
                $lastDeparture = $value->attributes['departure_ts'];
                if (empty($value->attributes[$pnr]))
                    $pnr = 'crs_pnr';
                $first = false;
            } else {
                $conv_fee = $value->airCart->convenienceFee;
            }
            //deatils[source_destination]
            $segmentkey = $value->attributes['source_id'] . '_' . $value->attributes['destination_id'];
            $details['bookings'][$segmentkey]['id'] = $value->attributes['id'];
            $details['bookings'][$segmentkey]['source_id'] = $value->attributes['source_id'];
            $details['bookings'][$segmentkey]['destination_id'] = $value->attributes['destination_id'];
            $details['bookings'][$segmentkey]['source'] = $value->source->attributes['city_name'];
            $details['bookings'][$segmentkey]['destination'] = $value->destination->attributes['city_name'];
            $details['bookings'][$segmentkey]['departure'] = $value->attributes['departure_ts'];
            $details['bookings'][$segmentkey]['arrival'] = $value->attributes['arrival_ts'];
            $dep = new \DateTime($value->attributes['departure_ts']);
            $today = new \DateTime('today');

            if ($dep > $today) {
                $details['bookings'][$segmentkey]['upcoming'] = 'true';
                $upcomingflag = 'true';
            } else {
                $details['bookings'][$segmentkey]['upcoming'] = 'false';
            }

            //$diff = date_diff(new \DateTime($value->attributes['arrival_ts']), new \DateTime($value->attributes['departure_ts']));
            //$duration = $diff->h . 'h ' . $diff->i . 'm';

            $d_tz = \Airport::getTimezoneByCode(\Airport::getAirportCodeFromId($value->attributes['destination_id']));
            $o_tz = \Airport::getTimezoneByCode(\Airport::getAirportCodeFromId($value->attributes['source_id']));

            if (isset($d_tz) && isset($o_tz)) {
                $duration1 = (new \DateTime($value->attributes['arrival_ts'], new \DateTimeZone($d_tz)))
                        ->diff(new \DateTime($value->attributes['departure_ts'], new \DateTimeZone($o_tz)));
                //    ->format('%Hh:%Im');
                $hours = (int) $duration1->d * 24 + $duration1->h;
                $duration = $hours . 'h ' . $duration1->i . 'm';
            } else {
                $duration = \Utils::convertSecToHoursMins(strtotime($value->attributes['arrival_ts']) - strtotime($value->attributes['departure_ts']));
            }

            $details['bookings'][$segmentkey]['flighttime'] = $duration;
            $travelerId = $value->attributes['traveler_id'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['id'] = $value->traveler->id;
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['bookingid'] = $value->attributes['id'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['type'] = $value->travelerType->attributes['name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['title'] = $value->traveler->travelerTitle->attributes['name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['first_name'] = $value->traveler->attributes['first_name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['last_name'] = $value->traveler->attributes['last_name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['airline_pnr'] = $value->attributes['airline_pnr'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['crs_pnr'] = $value->attributes['crs_pnr'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['ticket'] = $value->attributes['ticket_number'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['booking_class'] = $value->attributes['booking_class'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['product_class'] = $value->attributes['product_class'];
            if (!empty($value->attributes['cabin_type_id']))
                $details['bookings'][$segmentkey]['traveller'][$travelerId]['cabin'] = $value->cabinType->attributes['name'];

            $details['bookings'][$segmentkey]['traveller'][$travelerId]['faretype'] = $value->fareType->attributes['name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['basicfare'] = $value->attributes['basic_fare'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['taxes'] = $value->getTaxesOnly();
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['total'] = (double)$value->getTotalAmount() - (double)$conv_fee;
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['status'] = $value->abStatus->attributes['id'];
            if ($value->abStatus->attributes['id'] == \AbStatus::STATUS_OK)
                $details['bookings'][$segmentkey]['traveller'][$travelerId]['statusmsg'] = 'confirmed';
            else
                $details['bookings'][$segmentkey]['traveller'][$travelerId]['statusmsg'] = $value->abStatus->attributes['name'];

            $airRoutes = \AirRoutes::model()->findAll(['condition' => 'air_booking_id=:airBookingId', 'order' => 'departure_ts', 'params' => [':airBookingId' => $value->id]]);
            $segNights++;

            foreach ($airRoutes as $airroute) {
                $details['bookings'][$segmentkey]['traveller'][$travelerId]['routes'][] = $airroute->getDetails();
            }

            if (!isset($details['bookings'][$segmentkey]['routes'])) {
                foreach ($airRoutes as $airroute) {
                    $details['bookings'][$segmentkey]['routes'][] = $airroute->getDetails();
                }
            }
            $bookingid = $value->attributes['id'];
        }
        $details['segNights'] = $segNights;
        $details['upcoming'] = $upcomingflag;
        
        /* START TRANSIT VISA MESSAGE */
        
        $x=$details['bookings'][$segmentkey]['routes']; /* ROUTES DETAILS */
        foreach($x as $data)
        {
        	$origins[] = $data['origin']; /* ALL ORIGINS */
        	$destinations[] = $data['destination']; /* ALL DESTINATIONS */
        }
        
        /* GET MESSAGE */
        $message = FlightTransformer::Message($origins, $destinations);
        if(!empty($message)){$details['transit']=$message;}
        /* GET MESSAGE */
        
        /* END TRANSIT VISA MESSAGE */
        
       
        //  \usort($details['bookings'], 'self::sortByOrder');
        //      \Utils::dbgYiiLog($carts);
        
        //\Utils::dbgYiiLog($details['bookings'][$segmentkey]['routes']);
        //      exit;
        return \Utils::jsonResponse($details);
    }

    static public function sortByOrder($a, $b) {
        //\Utils::dbgYiiLog($a);
        $depa = new \DateTime($a['departure']);
        $depb = new \DateTime($b['departure']);
        if ($depa > $depb)
            return 1;
        else
            return -1;
    }
}
