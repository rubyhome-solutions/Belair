<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;
use application\components\PGs\UPI\HDFC;

class BookingStep3Upi extends B2cFormModel {

    const UPI_TRANS_LIMIT_AMT = 100000;

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

    public $category;
    public $virtual_address;
    public $id;

    public function rules() {
        return [
            ['virtual_address', 'required'],
            ['virtual_address, id', 'safe'],
            ['virtual_address', 'CRegularExpressionValidator', 'pattern' => '/^([a-z]+[0-9]*)@[a-z]+$/i', 'message' => "Please enter valid VPA"],
        ];
    }

    public function process(Booking $booking, $controller) {
        if (!FlightsBooking::checkAvailabilityAndFares($booking)) {
            throw new B2cException(4003, 'Sorry! The booking you have chosen is no longer available with the airline. Please select another flight');
        }

        $pgl = new \PayGateLog();

        $pgl->air_cart_id = $booking->fakecart_id;
        $pgl->user_info_id = $booking->user->user_info_id;
        $promovalue = 0;
        if (isset($booking->promo_value)) {
            $promovalue = (double) $booking->promo_value;
        }
        $pgl->amount = (double) $booking->price + (double) ($booking->priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL ? $booking->priceDiff : 0) - (double) $promovalue;
        $pgl->convince_fee = (double) $booking->payment_convenience_fee;
        $pgl->callback = json_encode(["\\b2c\\models\\Booking::paymentCallback", [$booking->id]]);

        HDFC\UPI::setUpiParameters($pgl);
        $pgl->setBasics();

        $booking->addNote(null, 'Payment: initiated');

        if (!\Fraud::fraudClearance($this->id || null, $pgl->user_ip, $booking->user->mobile, $booking->user->email)) {
            $booking->addNote(null, 'Payment blocked as fraud');
            throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
        }

        if (($pgl->amount + $pgl->convince_fee) > self::UPI_TRANS_LIMIT_AMT) {
            $booking->addNote(null, 'Exceed upi perday limit.');
            throw new B2cException(4003, 'Transaction limit for UPI is INR 1 lac per day.');
        }

        $pgl->save();
        $booking->pgl_id = $pgl->id;

        $booking->persist();

        \BookingLog::push_log($booking->id, '', 'requested for payment by Upi');
        //Save screeneshot of <body>
        $booking->saveScreenShot(3);
        \Utils::setActiveUserAndCompany($booking->user->id);



        $_POST = array_merge($_POST, [
            'category' => 'UPI',
            'email' => $booking->user->email,
            'amount' => $pgl->amount + $pgl->convince_fee,
            'orderid' => $pgl->air_cart_id,
            'customer_id' => $booking->user->user_info_id,
            'name' => $booking->user->name
        ]);

        $controller->forward('/payGate/doPay/id/' . $pgl->id);
    }

}
