<?php

namespace application\components\OneClickBooking;

use b2c\models\BookingStep1Form;
use b2c\models\BookingStep2Form;
use b2c\components\B2cException;

class Ixigo {

    private static $_passenger_type_map = [
        'ADULT' => \TravelerType::TRAVELER_ADULT,
        'CHILD' => \TravelerType::TRAVELER_CHILD,
        'INFANT' => \TravelerType::TRAVELER_INFANT,
    ];
    private static $_passenger_fields_map = [
        'pax_no' => 'no',
        'pax_type' => 'type_id',
        'pax_title' => 'title_id',
        'pax_firstname' => 'firstname',
        'pax_lastname' => 'lastname',
        'pax_passport_number' => 'passport_number',
        'pax_passport_country' => 'passport_country_id',
        'pax_passport_expiry' => 'passport_expiry',
        'pax_dob' => 'birth'
    ];
    private static $_passenger_title_map = [
        'MR' => '1',
        'MS' => '2',
        'MRS' => '3',
        'MISS' => '2',
        'MSTR' => '4',
    ];
    private static $_hook_url = '';

    private function _response($e) {
        $errors = $e->toArray();
        $errors['code'] = $e->statusCode;
        \Utils::jsonResponse($errors);
    }

    public function completeStep1AndStep2($json, $booking) {
        $user_pax = json_decode($json, true);
        $json_error = json_last_error();
        if ($json_error === JSON_ERROR_NONE && !empty($user_pax['user'])) {
            if (!$booking->step1_logged) {
                $log_msg = 'step 1 started';
                $booking->step1_logged = true;
            } else {
                $log_msg = 'refresh';
            }
            $booking->persist();
            $browser = new \BrowserDetection();
            if ($browser->isMobile()) {
                //$booking->toJson()
                \BookingLog::push_log($booking->id, '', $log_msg, $browser->getBrowser(), $browser->getVersion(), $browser->getPlatform(), 1, $booking, 1);
            } else {
                \BookingLog::push_log($booking->id, '', $log_msg, $browser->getBrowser(), $browser->getVersion(), $browser->getPlatform(), 0, $booking, 1);
            }
            sleep(1);
            //\Utils::dbgYiiLog($user_pax);
            try {
                $response = BookingStep1Form::submit($user_pax['user'], null, $booking);
                if (!empty($response['id'])) {
                    BookingStep2Form::submit(['passengers' => $this->_processPassengers($user_pax['passengers']), 'check' => false], 'domestic', $booking);
                    //$url = \Yii::app()->request->hostInfo.\Yii::app()->createUrl('/b2c/booking', array('id' => $booking->id));
                    //\Utils::jsonResponse(['code' => 200, 'message' => 'Success', 'payment_url' => $url]);
                    \Yii::app()->cache->set($booking->id, $booking, 1800);
                    \Utils::jsonResponse(['code' => 200, 'message' => 'Success', 'book_id' => $booking->id]);
                }
            } catch (B2cException $e) {
                \Utils::dbgYiiLog($e);
                $this->_response($e);
            }
        } else {
            $error_msg = json_last_error_msg();
            \Utils::dbgYiiLog(['Wrong Json Provided', 'json' => $json, $error_msg]);
            \Utils::jsonResponse(['code' => $json_error, 'message' => '!!! Invalid or Empty JSON !!!', 'errors' => [$error_msg]]);
        }
    }

    private function _processPassengers($passengers) {
        $valid = true;
        $errors = [];
        $travellers = [];
        foreach ($passengers as $paxkey => $passenger) {
            foreach ($passenger as $key => $val) {
                unset($passenger[$key]);
                if (!$valid) {
                    break 2;
                }
                if ($key === 'pax_type') {
                    if (!isset(self::$_passenger_type_map[$val])) {
                        $valid = false;
                        $errors [$paxkey][$key] = '!!! Invalid PAX Type !!!';
                    } else {
                        $val = self::$_passenger_type_map[$val];
                    }
                } else if ($key === 'pax_title') {
                    if (!isset(self::$_passenger_title_map[$val])) {
                        $valid = false;
                        $errors [$paxkey][$key] = '!!! Invalid PAX Title !!!';
                    } else {
                        $val = self::$_passenger_title_map[$val];
                    }
                } else if ($key === 'pax_passport_country' && !empty($val)) {
                    $country = \Country::model()->findByAttributes(array('code' => $val));
                    if ($country === null) {
                        $valid = false;
                        $errors [$paxkey][$key] = '!!! Invalid PAX Passport Country !!!';
                    } else {
                        $val = $country->id;
                    }
                } else if (($key === 'pax_dob' || $key === 'pax_passport_expiry')) {
                    if (!empty($val)) {
                        $val = explode('-', $val);
                        if (strlen($val[0]) != 4 || strlen($val[1]) != 2 || strlen($val[2]) != 2) {
                            $valid = false;
                            if ($key === 'pax_dob') {
                                $errors [$paxkey][$key] = '!!! Invalid PAX Date Of Birth !!!';
                            } else {
                                $errors [$paxkey][$key] = '!!! Invalid PAX Passport Country !!!';
                            }
                        }
                    } else {
                        $val[] = '';
                        $val[] = '';
                        $val[] = '';
                    }
                }
                if (!isset(self::$_passenger_fields_map[$key])) {
                    $valid = false;
                    $errors [$paxkey][$key] = '!!!Invalid DATA!!!';
                }
                if ($key === 'pax_type' || $key === 'pax_no') {
                    $travellers[$paxkey][self::$_passenger_fields_map[$key]] = $val;
                } else {
                    $travellers[$paxkey]['traveler'][self::$_passenger_fields_map[$key]] = $val;
                }
            }
        }
        if (!$valid) {
            throw new B2cException(4000, 'Validation Error', $errors);
        }
        unset($passenger);
        unset($passengers);
        return $travellers;
    }

    public function callHook() {
        //write code for Calling Hook to update them for the Payment and Booking Status
    }

}
