<?php

namespace b2c\controllers;

use b2c\components\B2cException;
use b2c\components\ControllerExceptionable;
use b2c\components\ControllerOverridable;
use b2c\components\FlightsBooking;
use b2c\models\Booking;
use b2c\models\BookingStep1Form;
use b2c\models\BookingStep2Form;
use b2c\models\BookingStep3CcForm;
use b2c\models\BookingStep3NetbankingForm;
use b2c\models\CcForm;
use b2c\models\NetbankingForm;
use b2c\models\Flight;
use b2c\models\BookingStep3Wallet;
use b2c\models\WalletForm;
use b2c\models\BookingStep3Emi;
use application\components\PGs\EMIs\CCAvenueEMI;
use b2c\models\EMIForm;
use b2c\models\BookingStep3Upi;
use b2c\models\UPIForm;
use application\components\PGs\UPI;

\Yii::import('application.controllers.BookingController');

class BookingController extends \BookingController {

    use ControllerExceptionable;

    protected $_inheritRules = false;

    public function accessRules() {
        return [
                ['allow', 'actions' => ['airportSearch', 'index', 'hdfcUPI'], 'users' => ['*']],
        ];
    }

    public function actionIndex($id = null) {
        if ($id) {
            if ($booking = Booking::load($id)) {
                $flag = false;
                if (!$booking->step1_logged) {
                    $log_msg = 'step 1 started';
                    $booking->step1_logged = true;
                    $booking->persist();
                    $flag = true;
                } else {
                    $log_msg = 'refresh';
                }
                $browser = new \BrowserDetection();

                if ($browser->isMobile()) {
                    //$booking->toJson()
                    \BookingLog::push_log($booking->id, '', $log_msg, $browser->getBrowser(), $browser->getVersion(), $browser->getPlatform(), 1, $booking, 0);
                } else {
                    \BookingLog::push_log($booking->id, '', $log_msg, $browser->getBrowser(), $browser->getVersion(), $browser->getPlatform(), 0, $booking, 0);
                }
                if ($flag && $booking->ref_id !== null) {
                    $booking_log = \BookingLog::model()->findByAttributes(['booking_id' => $booking->id]);
                    if ($booking_log !== null) {
                        $booking_log->ref_id = $booking->ref_id;
                        $booking_log->update(['ref_id']);
                    }
                }
            } else if ($booking = \Yii::app()->cache->get($id)) {
                if ($booking === false) {
                    \Utils::finalMessage('!!! Booking no longer valid !!!');
                }
                $booking->persist();
            } else {
                $this->redirect('/');
            }
        }
        if (!empty($_POST)) { // create a booking model
            $cs = isset($_POST['cs']) ? (int) $_POST['cs'] : \ClientSource::SOURCE_DIRECT;
            $cur = isset($_POST['cur']) ? (string) $_POST['cur'] : 'INR';

            if (!isset($_POST['flights']) || 0 == count($_POST['flights'])) {
                throw new B2cException(4000, 'Flights are required');
            }

            $invalid_result = false;
            $flights = [];
            foreach ($_POST['flights'] as $flight) {
                $rcs = [];
                foreach ($flight['rcs'] as $routes) {
                    $rcs[] = \RoutesCache::model()->findAllByPk($routes);
                }
                if (!isset($rcs[0]) || count($rcs[0]) === 0) {
                    $invalid_result = true;
                    break;
                }
                $flights[] = Flight::create(\Searches::model()->findByPk($flight['search_id']), $rcs, $cs);
            }

            if ($invalid_result) {
                throw new B2cException(4007, "This result is no longer valid. Please search again.");
            }
            \Utils::jsonResponse(Booking::create($flights, isset($_POST['url']) ? str_replace('/b2c/flights', '', $_POST['url']) : null, $cur)->persist()->toJson());
        }

        if ($id) {
            if (\Yii::app()->request->isAjaxRequest) {
                if ($booking = Booking::load($id)) {
                    \Utils::jsonResponse($booking->toJson());
                }

                throw new B2cException(4040, 'Booking not found');
            }

            if ($this->isMobile()) {
                $this->layout = '//layouts/mobile';
                $this->render('//common/mobilejs', ['bundle' => 'flights']);
            } else {
                $this->render('//common/js', ['bundle' => 'flights']);
            }
        }
    }

    public function actionCards() {
        if (isset($_GET['booking_id']) && ($booking = Booking::load($_GET['booking_id'])) && $booking->user) {
            $user = $booking->user;
        } else if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);
        }

        if (isset($user)) {
            $out = [];
            $ui = $user->userInfo;

            if ($user->email == $ui->email && $user->mobile == $ui->mobile) {
                foreach ($user->userInfo->ccs as $cc) {
                    if ($cc->deleted)
                        continue;

                    $exp = explode('-', $cc->exp_date);
                    $out[] = [
                        'id' => $cc->id,
                        'number' => $cc->mask,
                        'exp_year' => $exp[0],
                        'exp_month' => (int) $exp[1],
                        'name' => $cc->name,
                        'type' => strtolower(\Cc::$ccTypeIdToEcc[$cc->type_id]),
                        'store' => true
                    ];
                }
            }


            \Utils::jsonResponse($out);
        }

        \Utils::jsonResponse([]);
    }

    public function actionTravelers() {
        if (isset($_POST['booking_id']) && ($booking = Booking::load($_POST['booking_id'])) && $booking->user) {
            $out = [];
            $user = $booking->user;
            $ui = $user->userInfo;
            // titles id array
            $traveller_titles = \TravelerTitle::$titlesId;
            if ($user->email == $ui->email && $user->mobile == $ui->mobile) {
                foreach ($booking->user->userInfo->travelers as $i) {
                    if ($i->status == '0') {
                        continue;
                    }
                    $birth = $i->birthdate ? explode('-', $i->birthdate) : null;
                    $exp = $i->passport_expiry ? explode('-', $i->passport_expiry) : null;

                    $dateOfBirth = $i->birthdate;
                    $arrivalDate = $booking->getLastFlightArrivalDate();
                    $diff = date_diff(date_create($dateOfBirth), date_create($arrivalDate));
                    $diffyr = $diff->format('%y');
                    $diffagedate = $diff->format('%y-%m-%d');

                    if ($diffyr > 12 || $dateOfBirth == '') {
                        $type_id = 1;
                    } else if ($diffyr > 2 && $diffyr <= 12) {
                        $type_id = 2;
                    } else if ($diffyr >= 0 && $diffyr <= 2) {
                        $type_id = 3;
                    } else {
                        $type_id = 1;
                    }
                    // checking titles array
                    if (in_array($i->traveler_title_id, $traveller_titles)) {
                        $traveller_title_id = $i->traveler_title_id;
                    } else {
                        $traveller_title_id = '';
                    }

                    $out[] = [
                        'id' => $i->id,
                        'title_id' => $traveller_title_id,
                        'firstname' => $i->first_name,
                        'lastname' => $i->last_name,
                        'passport_number' => $i->passport_number,
                        'passport_country_id' => $i->passport_country_id,
                        'passport_expiry' => 3 == count($exp) ? $exp : null,
                        'birth' => 3 == count($birth) ? $birth : null,
                        'traveler_type_id' => $type_id
                    ];
                }
            }
            \Utils::jsonResponse($out);
        }

        \Utils::jsonResponse(null, 422);
    }

    public function actionStep1() {
        if (isset($_POST['id'])) {
            $booking = Booking::load($_POST['id']);
            if ($booking && isset($_POST['user'])) {
                \Utils::jsonResponse(BookingStep1Form::submit($_POST['user'], null, $booking));
            }
        }
    }

    public function actionStep2() {

        if (isset($_POST['id'])) {
            $booking = Booking::load($_POST['id']);
            if ($booking && isset($_POST['passengers'])) {
                \Utils::jsonResponse(
                        BookingStep2Form::submit(['passengers' => $_POST['passengers'], 'check' => isset($_POST['check']) ? $_POST['check'] : false], $_POST['scenario'], $booking));
            }
        }
    }

    public function actionStep3() {
        if (isset($_POST['id'])) {
            $booking = Booking::load($_POST['id']);
            if (!empty($booking->fakecart_id)) {
                \BookingLog::pushCartIdInlog($_POST['id'], '', $booking->fakecart_id);
            }

            if ($booking && isset($_POST['cc'])) {
                \Utils::jsonResponse(
                        BookingStep3CcForm::submit($_POST['cc'], null, $booking, $this));
            }

            if ($booking && isset($_POST['netbanking'])) {
                \Utils::jsonResponse(
                        BookingStep3NetbankingForm::submit($_POST['netbanking'], null, $booking, $this));
            }
            if ($booking && isset($_POST['wallet'])) {
                \Utils::jsonResponse(BookingStep3Wallet::submit($_POST['wallet'], null, $booking, $this));
            }
            if ($booking && isset($_POST['CCAvenueEmi'])) {
                \Utils::jsonResponse(BookingStep3Emi::submit($_POST['CCAvenueEmi'], null, $booking, $this));
            }
            if ($booking && isset($_POST['UPI'])) {
                \Utils::jsonResponse(BookingStep3Upi::submit($_POST['UPI'], null, $booking, $this));
            }
        }
    }

    public function actionPayment() {
        if (isset($_POST['id'])) {
            $pgl = \PayGateLog::model()->findByPk($_POST['id']);
            if ($pgl && isset($_POST['cc'])) {
                \Utils::jsonResponse(
                        CcForm::submit($_POST['cc'], null, $pgl, $this));
            }

            if ($pgl && isset($_POST['netbanking'])) {
                \Utils::jsonResponse(
                        NetbankingForm::submit($_POST['netbanking'], null, $pgl, $this));
            }

            if ($pgl && isset($_POST['wallet'])) {
                \Utils::jsonResponse(
                        WalletForm::submit($_POST['wallet'], null, $pgl, $this));
            }

            if ($pgl && isset($_POST['CCAvenueEmi'])) {
                \Utils::jsonResponse(
                        EMIForm::submit($_POST['CCAvenueEmi'], null, $pgl, $this));
            }
            if ($pgl && isset($_POST['UPI'])) {
                \Utils::jsonResponse(
                        UPIForm::submit($_POST['UPI'], null, $pgl, $this));
            }
        }
    }

    public function actionStep4() {
        if (isset($_POST['id'])) {
            $booking = Booking::load($_POST['id']);
            \BookingLog::push_log($booking->id, '', 'step 3 done');

            if (!$booking->user) {
                throw new B2cException(4009, 'Complete first step first!');
            }

            if (!$booking->passengers) {
                throw new B2cException(4009, 'Complete second step first!');
            }

            if (!$booking->payment) {
                throw new B2cException(4009, 'Complete third step first!');
            }


            if (!$booking->aircart_id) {
                sleep(1);
                \BookingLog::push_log($booking->id, '', 'step 4 started');
                try {
                    FlightsBooking::book($booking);
                    \BookingLog::pushCartIdInlog($_POST['id'], '', $booking->aircart_id);
                } catch (\Exception $e) {
                    if (isset($booking->fakecart_id))
                        $ac_id = $booking->fakecart_id;

                    if (isset($booking->fakecart->booking_status_id))
                        $ac_status = $booking->fakecart->booking_status_id;
                    else
                        $ac_status = \BookingStatus::STATUS_IN_PROCESS;

                    \BookingLog::push_log($booking->id, '', 'step 4 done');

                    \Utils::jsonResponse(['aircart_id' => $ac_id, 'aircart_status' => $ac_status, 'callback_url' => $this->getCallbackURL($booking)]);
                }
            }

            \Utils::jsonResponse(['aircart_id' => $booking->aircart_id, 'aircart_status' => $booking->aircart->booking_status_id, 'callback_url' => $this->getCallbackURL($booking)]);
        }
    }

    private function getCallbackURL($booking) {
        if (\Yii::app()->cache->get($booking->id) !== false) {
            \Yii::app()->cache->delete($booking->id);
            $booking_log = \BookingLog::model()->findByAttributes(['booking_id' => $booking->id]);
            if ($booking_log !== null) {
                $p_status = !empty($booking->aircart->payments) ? 'Success' : 'Failed';
                $booking->callback_url .= '&status=' . $p_status;
                $booking_log->callback_url = $booking->callback_url;
                $booking_log->ref_id = $booking->ref_id;
                $booking_log->update(['callback_url', 'ref_id']);
            }
        }
        if ($booking->callback_url === null) {
            return '';
        }
        return $booking->callback_url;
    }

    public function actionDummy() {
        echo "OK";
    }

    public function actionCheckPromoCode() {
        if (isset($_POST['id']) && isset($_POST['promo'])) {
            $booking = Booking::load($_POST['id']);
            $promocode = $_POST['promo'];
            $result = \PromoCodes::checkPromoCode($promocode, $booking);
            if (isset($result['id'])) {
                $booking->promo_code = $result['code'];
                $booking->promo_id = $result['id'];
                $booking->promo_value = $result['value'];

                if (empty($result['promo_tnc_url'])) {
                    $booking->promo_tnc_url = \PromoCodes::DEFAULT_TNC_URL;
                    $result['promo_tnc_url'] = $booking->promo_tnc_url;
                } else {
                    $booking->promo_tnc_url = $result['promo_tnc_url'];
                }
                $booking->persist();
            }
            \Utils::jsonResponse($result);
        }
    }

    public function actionRemovePromoCode() {
        if (isset($_POST['id'])) {
            $booking = Booking::load($_POST['id']);
            $booking->promo_code = null;
            $booking->promo_id = null;
            $booking->promo_value = null;
            $booking->persist();

            \Utils::jsonResponse(array('result' => 'success'));
        }
    }

    /**
     * Added By Satender
     * Date : 29-Sep-2016
     * Purpose : To fetch the Convenience Fee according to the Payment Type on Step 3
     */
    public function actionPymtConvFee() {
        $result = ['pymtConvFee' => 0, 'per_passenger' => 0];
        $booking = null;

        $booking_id = \Yii::app()->request->getPost('id');
        if ($booking_id !== null) {
            $booking = Booking::load($booking_id);
        }
        if ($booking === null) {
            \Utils::jsonResponse($result);
        }
        /*
         * First check with if Commercial Rule is applied
         */
        $commercial_rule_id = $this->_getCommercialRuleID($booking);
        if ($commercial_rule_id === null) {
            $commercial_rule_id = \PaymentConvenienceFee::DEFAULT_RULE_ID;
        }
        $payment_convenience_fee = $this->_getConvFee($booking, $commercial_rule_id);
        if ($payment_convenience_fee === null && $commercial_rule_id !== \PaymentConvenienceFee::DEFAULT_RULE_ID) {
            $payment_convenience_fee = $this->_getConvFee($booking, \PaymentConvenienceFee::DEFAULT_RULE_ID);
        }
        if ($payment_convenience_fee !== null) {
            if ($booking_id !== null) {
                $price = 0;
                foreach ($booking->flights as $flight) {
                    $price += $flight->getCommercialPrice();
                }
                $no_of_passenger = 1;
                $booking->pcf_per_passenger = 0;
                if ($payment_convenience_fee->per_passenger === \PaymentConvenienceFee::ACTIVE) {
                    $no_of_passenger = count($booking->passengers);
                    if ($no_of_passenger <= 0) {
                        $no_of_passenger = 1;
                    }
                }
                $booking->payment_convenience_fee = ceil(abs($payment_convenience_fee->fixed * $no_of_passenger + ($price * $payment_convenience_fee->perc) / 100));
                if ($payment_convenience_fee->per_passenger === \PaymentConvenienceFee::ACTIVE) {
                    $booking->pcf_per_passenger = ceil(abs($booking->payment_convenience_fee / $no_of_passenger));
                    if ($booking->payment_convenience_fee !== $booking->pcf_per_passenger * $no_of_passenger) {
                        $booking->payment_convenience_fee = $booking->pcf_per_passenger * $no_of_passenger;
                    }
                }
                $result = ['pymtConvFee' => $booking->payment_convenience_fee, 'per_passenger' => $booking->pcf_per_passenger];
                $booking->persist();
            }
        }
        \Utils::jsonResponse($result);
    }

    private function _getCommercialRuleID($booking) {
        $aircart_id = null;
        if (!empty($booking->fakecart_id)) {
            $aircart_id = $booking->fakecart_id;
        } else if (!empty($booking->aircart_id)) {
            $aircart_id = $booking->aircart_id;
        }

        if ($aircart_id !== null) {
            $result = \Yii::app()->db->createCommand()->select("commercial_rule_id")->from('air_booking')
                    ->where('air_cart_id=:air_cart_id ', [':air_cart_id' => $aircart_id])
                    ->order('id ASC')
                    ->limit(1)
                    ->queryRow(false);

            if (!empty($result[0])) {
                return $result[0];
            }
        }
        return null;
    }

    private function _getConvFee($booking, $commercial_rule_id) {
        $cs = \Yii::app()->request->getPost('cs');
        $pymt_cat = \Yii::app()->request->getPost('pymt_cat');
        $pymt_sub_cat = \Yii::app()->request->getPost('pymt_sub_cat');
        $bin_digits = \Yii::app()->request->getPost('bin_info');
        if ($cs !== null && $booking !== null && $pymt_cat !== null) {
            $attributes = [
                'client_source_id' => $cs,
                'journey_type' => $booking->journey_type,
                'payment_type' => $pymt_cat,
                'payment_sub_type' => $pymt_sub_cat,
                'commercial_rule_id' => $commercial_rule_id
            ];
            if (($pymt_cat == \PaymentConfiguration::DEBIT_CARD || $pymt_cat == \PaymentConfiguration::CREDIT_CARD) && strlen($bin_digits) === 6) {
                $binInfo = \BinList::model()->findByPk($bin_digits);
                if ($binInfo !== null) {
                    if ($binInfo->card_type === 'CREDIT') {
                        $pymt_cat = \PaymentConfiguration::CREDIT_CARD;
                    } else if ($binInfo->card_type === 'DEBIT') {
                        $pymt_cat = \PaymentConfiguration::DEBIT_CARD;
                    }
                    $attributes ['payment_type'] = $pymt_cat;
                }
                if ($pymt_sub_cat !== null && isset(\PaymentConfiguration::$paymentTypeMapUI[$pymt_sub_cat])) {
                    $attributes ['payment_sub_type'] = \PaymentConfiguration::$paymentTypeMapUI[$pymt_sub_cat];
                }
            }
            $payment_convenience_fee = \PaymentConvenienceFee::model()->findByAttributes($attributes);

            if ($payment_convenience_fee === null) {
                // Consider ALL if Defined
                $attributes ['payment_sub_type'] = \PaymentConfiguration::ALL;
                $payment_convenience_fee = \PaymentConvenienceFee::model()->findByAttributes($attributes);
            }

            if ($payment_convenience_fee === null) {
                // Consider ALL if Defined
                $attributes ['payment_type'] = \PaymentConfiguration::ALL;
                $payment_convenience_fee = \PaymentConvenienceFee::model()->findByAttributes($attributes);
            }

            if ($payment_convenience_fee === null) {
                // Consider ALL if Defined
                $attributes ['journey_type'] = \PaymentConvenienceFee::WAYTYPE_ALL;
                $payment_convenience_fee = \PaymentConvenienceFee::model()->findByAttributes($attributes);
            }
            return $payment_convenience_fee;
        }
        return null;
    }

    public function actionCCAvenueEMI() {
        $amount = 0;
        if (\Yii::app()->request->getPost('emi_flag') == 'payment_emi') {
            if (\Yii::app()->request->getPost('id') !== NULL) {
                $booking = Booking::load(\Yii::app()->request->getPost('id'));
                $promovalue = 0;
                if (isset($booking->promo_value)) {
                    $promovalue = (double) $booking->promo_value;
                }
                $amount = (double) $booking->price + (double) ($booking->priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL ? $booking->priceDiff : 0) - (double) $promovalue;
            }
        }
        if (\Yii::app()->request->getPost('emi_flag') == 'fare_difference') {
            if (\Yii::app()->request->getPost('total_amount') !== NULL) {
                $amount = \Yii::app()->request->getPost('total_amount');
            }
        }
        if ($amount > 0) {
            $data = CCAvenueEMI\CCAvenueEMI::getCCAvenueEmiData($amount);
            if (empty($data['error'])) {
                $result = $data['result'];
                /*
                 * response is in the form processData(xxxxx)
                 * we are removing processData and parentheses
                 */
                $strarr = array('p', 'r', 'o', 'c', 'e', 's', 'D', 'a', 't');
                $resToArr = str_split($result);
                for ($i = 0; $i <= 10; $i++) {
                    if (!in_array($resToArr[$i], $strarr)) {
                        \Utils::dbgYiiLog(['Unexpected EMI json data' => $result]);
                        throw new B2cException(4009, 'Server returned error, please try another payment option');
                    }
                }
                if (empty($resToArr[11]) || $resToArr[11] != "(") {
                    \Utils::dbgYiiLog(['Unexpected EMI json data' => $result]);
                    throw new B2cException(4009, 'Server returned error, please try another payment option');
                }
                $decoded = preg_replace('/processData/', '', $result);
                $decoded = substr($decoded, 1);
                $decoded = substr($decoded, 0, -1);
                return \Utils::jsonResponse($decoded);
            }
        }
    }

    public function actionHdfcUPI() {
        $orderId = \Yii::app()->request->getPost('orderId');
        if ($orderId !== NULL) {
            $model = \PayGateLog::model()->findByPk($orderId);
            $outParams = UPI\HDFC\UPI::refresh($model, false);

            echo json_encode([
                'data' => $outParams
            ]);
            \Yii::app()->end();
        }
    }

}
