<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;
use application\components\PGs\Wallet\CCAvenue;

class BookingStep3Emi extends B2cFormModel {
    
    static public function submit($attributes, $scenario = null, Booking $booking, $controller) {
        $form = static::factory($attributes, $scenario);
        
        if (!$booking->user) {
            throw new B2cException(4009, 'Complete first step first!');
        }

        if (!$booking->passengers) {
            throw new B2cException(4009, 'Complete second step first!');
        }

        if ($form->id) {
            // need to set correct card number for validator

            $cc = \Cc::model()->findByPk($form->id);
//            if ($cc->user_info_id !== $booking->user->user_info_id) {
//                throw new B2cException(4009, 'Can not use this card. This card does not belong to you');
//            }

            $form->number = $cc->decode($cc->number);
            if (!$form->number) {
                throw new B2cException(4001, 'Could not decode card number. (Probably saved on different server)');
            }

        }

        if (!$form->validate()) {
            throw new B2cException(4001, 'Validation Error', $form->getErrors());
        }

        return call_user_func_array([$form, 'process'], array_slice(func_get_args(), 2));
    }
    
    public $ecc;
    
    public $id;
    public $payment_option;
    public $planId;
    public $card_number;
    public $exp_month;
    public $exp_year;
    public $cvv;
    public $issuing_bank;
    public $emi_tenure_id;
    public $card_type;
    public $category;
    public $store;
    public $currency;
    public $name;
    public $type;
    
    function __construct($scenario = null) {
        $this->ecc = new \ECCValidator2();
        parent::__construct($scenario);
    }

    public function rules() {
        $cvv_length = 'amex' == $this->card_type ? 4 : 3;

        return [
            ['card_number, exp_month, exp_year, cvv, issuing_bank, name', 'required'],
            ['card_number', 'filter', 'filter' => [$this, 'stripSpaces']],
            ['card_number', 'ext.validators.ECCValidator2', 'format' => [\ECCValidator2::AMERICAN_EXPRESS, \ECCValidator2::MASTERCARD, \ECCValidator2::VISA]],
            ['cvv', 'numerical'],
            ['cvv', 'length', 'is' => $cvv_length],
            ['exp_year', 'numerical', 'min' => date('Y')],
            ['exp_month', 'numerical', 'max' => 12]
        ];
    }

    public function attributeLabels() {
        return array(
            'card_number' => 'Card Number',
            'exp_month' => 'Expiry Month',
            'exp_year' => 'Expiry year',
            'cvv' => 'CVV No',
            'issuing_bank' => 'Issuing Bank',
            'name' => 'Card holder name'
        );
    }
    
    public function process(Booking $booking, $controller) {
        if (!FlightsBooking::checkAvailabilityAndFares($booking)) {
            throw new B2cException(4003, 'Sorry! The booking you have chosen is no longer available with the airline. Please select another flight');
        }
        
        $pgl = new \PayGateLog();
        CCAvenue\CCAvenue::setWalletParameters($pgl);
        //$pgl->pg_id = YII_DEBUG ? \PaymentGateway::CCAVENUE_TEST : \PaymentGateway::CCAVENUE_PRODUCTION;
        $pgl->air_cart_id = $booking->fakecart_id;
        $pgl->user_info_id = $booking->user->user_info_id;
        $promovalue=0;
        if(isset($booking->promo_value)){
            $promovalue=(double)$booking->promo_value;
        }
        $pgl->amount = (double)$booking->price + (double)($booking->priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL ? $booking->priceDiff : 0)-(double)$promovalue ;
        $pgl->convince_fee = (double)$booking->payment_convenience_fee;//$pgl->convenienceFee();
        $pgl->callback = json_encode(["\\b2c\\models\\Booking::paymentCallback", [$booking->id]]);
        $pgl->setBasics();
       
        $booking->addNote(null, 'Payment: initiated');


        if (!\Fraud::fraudClearance($this->id || null, $pgl->user_ip, $booking->user->mobile, $booking->user->email)) {
            $booking->addNote(null, 'Payment blocked as fraud');
            throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
        }

        $pgl->payment_mode = CCAvenue\CCAvenue::EMI_PAYMENT_MODE;
        $pgl->save();

        $booking->pgl_id = $pgl->id;
        $booking->persist();

        //Save screeneshot of Amount Only
        $booking->saveScreenShot(3);
        \Utils::setActiveUserAndCompany($booking->user->id);
        
        $_POST = array_merge( $_POST , [
            'payment_option' => $this->payment_option,
            'emi_plan_id' => $this->planId,
            'card_number' => $this->card_number,
            'expiry_month' => sprintf("%02d", $this->exp_month),
            'expiry_year' => sprintf("%02d", $this->exp_year),
            'cvv' => $this->cvv,
            'issuing_bank' => $this->issuing_bank,
            'emi_tenure_id' => $this->emi_tenure_id,
            'card_type' => $this->card_type,
            'store_card' => $this->store,
            'storedCardId' => $this->id ? $this->id : false,
            'currency' => $this->currency,
            'category' => $this->category,
            'amount' => $pgl->amount + $pgl->convince_fee,
            'name_on_card' => $this->name,
        ]);
        
        $controller->forward('/payGate/doPay/id/'.$pgl->id);
    }
    
    public function stripSpaces($str) {
        return str_replace(' ', '', $str);
    }
}

