<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;

\Yii::setPathOfAlias('libphonenumber',\Yii::getPathOfAlias('application.vendor.libphonenumber'));

class BookingStep3NetbankingForm extends B2cFormModel {
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
    public $net_banking;

    public function rules() {
        return [
            ['net_banking', 'required'],
            ['category, net_banking, id', 'safe']
        ];
    }

    public function process(Booking $booking, $controller) {
        if (!FlightsBooking::checkAvailabilityAndFares($booking)) {
            foreach ($booking->flights as $flight) {
                $flight->search->queueSearchProcesses();
            }

            throw new B2cException(4003, 'Sorry! The booking you have chosen is no longer available with the airline. Please select another flight');
        }

        $pgl = new \PayGateLog();
        //\Utils::dbgYiiLog($this->net_banking);
        if(is_numeric($this->net_banking)){
            $pgl->pg_id = YII_DEBUG ? \PaymentGateway::ATOM_TEST : \PaymentGateway::ATOM_PRODUCTION;
        }else{
            $pgl->pg_id = YII_DEBUG ? \PaymentGateway::PAYU_TEST_ID : \PaymentGateway::PAYU_PRODUCTION_ID;
        }
        $pgl->air_cart_id = $booking->fakecart_id;
        $pgl->user_info_id = $booking->user->user_info_id;
        $promovalue=0;
        if(isset($booking->promo_value)){
            $promovalue=(double)$booking->promo_value;
        }
        $pgl->amount = (double)$booking->price + (double)($booking->priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL ? $booking->priceDiff : 0)-(double)$promovalue;
        $pgl->convince_fee = (double)$booking->payment_convenience_fee;
        $pgl->callback = json_encode(["\\b2c\\models\\Booking::paymentCallback", [$booking->id]]);
        $pgl->setBasics();
        
        $booking->addNote(null, 'Payment: initiated');

        if (!\Fraud::fraudClearance($this->id || null, $pgl->user_ip, $booking->user->mobile, $booking->user->email)) {
            $booking->addNote(null, 'Payment blocked as fraud');
            throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
        }

        $pgl->save();

        $booking->pgl_id = $pgl->id;
        $booking->persist();
        
        \BookingLog::push_log($booking->id, '', 'redirected for payment by NB');
        
        //Save screeneshot of <body>
        $booking->saveScreenShot(3);
        \Utils::setActiveUserAndCompany($booking->user->id);

        // Now need to fill post for params for PayGateController
        // not cool, but will do for now
        // following params are expected in the number of places in the PayGateController and PayGateLog model
        $_POST = array_merge($_POST, [
            'category' => $this->category,
            'net_banking' => $this->net_banking,
            'atomBank'=>$this->net_banking
        ]);

        $controller->forward('/payGate/doPay/id/'.$pgl->id);

    }

    public function stripSpaces($str) {
        return str_replace(' ', '', $str);
    }
}
