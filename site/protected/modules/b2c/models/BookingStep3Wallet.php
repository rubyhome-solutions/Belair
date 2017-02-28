<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;
use application\components\PGs\Wallet\PayTM;
use application\components\PGs\Wallet\MobiKwik;
use application\components\PGs\Wallet\CCAvenue;

class BookingStep3Wallet extends B2cFormModel {

    static public function submit($attributes, $scenario = null, Booking $booking, $controller) {
        $form = static::factory($attributes, $scenario);
        if (!$booking->user) {
            throw new B2cException(4009, 'Complete first step first!');
        }

        if (!$booking->passengers) {
            throw new B2cException(4009, 'Complete second step first!');
        }

        if (!$form->validate()) {
            throw new B2cException(4001, 'Validation Error', $form->getErrors());
        }

        return call_user_func_array([$form, 'process'], array_slice(func_get_args(), 2));
    }

    public $id;
    public $category;
    public $wallet_type;

    public function rules() {
        return [
            ['wallet_type', 'required'],
            ['category, wallet_type, id', 'safe']
        ];
    }

    public function process(Booking $booking, $controller) {
        if (!FlightsBooking::checkAvailabilityAndFares($booking)) {
            throw new B2cException(4003, 'Sorry! The booking you have chosen is no longer available with the airline. Please select another flight');
        }

        $mobile = $booking->user->mobile;
        if (isset($mobile)) {
            $mobile = substr($mobile, -10);
            if (strlen($mobile) == 10) {
                $pgl = new \PayGateLog();
                
                // To set wallet properties accordingly
                $this->setWalletInfo($pgl);
                
                $pgl->air_cart_id = $booking->fakecart_id;
                $pgl->user_info_id = $booking->user->user_info_id;
                $promovalue = 0;
                if (isset($booking->promo_value)) {
                    $promovalue = (double) $booking->promo_value;
                }
                $pgl->amount = (double) $booking->price + (double) ($booking->priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL ? $booking->priceDiff : 0) - (double) $promovalue;
                $pgl->convince_fee = (double)$booking->payment_convenience_fee;
                $pgl->callback = json_encode(["\\b2c\\models\\Booking::paymentCallback", [$booking->id]]);
                $pgl->setBasics();

                $booking->addNote(null, 'Payment: initiated');

                if (!\Fraud::fraudClearance($this->id || null, $pgl->user_ip, $booking->user->mobile, $booking->user->email)) {
                    $booking->addNote(null, 'Payment blocked as fraud');
                    throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
                }
                
                $pgl->payment_mode = CCAvenue\CCAvenue::WALLET_PAYMENT_MODE;
                $pgl->save();

                $booking->pgl_id = $pgl->id;

                $booking->persist();
                
                \BookingLog::push_log($booking->id, '', 'redirected for payment by Wallet');
                //Save screeneshot of <body>
                $booking->saveScreenShot(3);
                \Utils::setActiveUserAndCompany($booking->user->id);


                $_POST = array_merge($_POST, [
                    'category' => 'wallet',
                    'email' => $booking->user->email,
                    'amount' => $pgl->amount + $pgl->convince_fee,
                    'mobile' => $mobile,
                    'orderid' => $pgl->air_cart_id,
                    'customer_id' => $booking->user->user_info_id,
                	'name' => $booking->user->name
                ]);
				
                $controller->forward('/payGate/doPay/id/' . $pgl->id);
            }
        }
    }

    function setWalletInfo(&$pgl) {
        if ($this->wallet_type == \PaymentConfiguration::PAYTM) {
            //PayTM\Utils::
            PayTM\PayTM::setWalletParameters($pgl);
            $_POST['type'] = \PaymentConfiguration::PAYTM;
        } else if (array_key_exists($this->wallet_type, \PaymentConfiguration::$ccavenueWalletList)) {
        	CCAvenue\CCAvenue::setWalletParameters($pgl);
        	$_POST['type'] = \PaymentConfiguration::CCAVENUE_WALLET;
        } else {
            throw new B2cException(4009, 'Wallet Selection Error!');
        }
    }

}
