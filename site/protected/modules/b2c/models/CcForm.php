<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;

\Yii::setPathOfAlias('libphonenumber',\Yii::getPathOfAlias('application.vendor.libphonenumber'));

class CcForm extends B2cFormModel {
    static public function submit($attributes, $scenario = null, \PayGateLog $pgl, $controller) {
        $form = static::factory($attributes, $scenario);


        if ($form->id) {
            // need to set correct card number for validator

            $cc = \Cc::model()->findByPk($form->id);
//            if ($cc->user_info_id !== $pgl->user_info_id) {
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
    public $type;
    public $name;
    public $number;
    public $exp_month;
    public $exp_year;
    public $cvv;
    public $store;

    function __construct($scenario = null) {
        $this->ecc = new \ECCValidator2();
        parent::__construct($scenario);
    }

    public function rules() {
        $cvv_length = 'amex' == $this->type ? 4 : 3;
        $importString = '';
        //added for set format dynamically for bypass luhn check in case of rupay card
        if (!empty($_POST['cc']) && !empty($_POST['cc']['type']) && $_POST['cc']['type'] == 'rupay') {
            $format = \ECCRupayValidator::RUPAY;
            $importString = 'ext.ECCRupayValidator';
        } else {
            $format = [\ECCValidator2::AMERICAN_EXPRESS, \ECCValidator2::MASTERCARD, \ECCValidator2::VISA];
            $importString = 'ext.validators.ECCValidator2';
        }       
        return [
            ['name, number, exp_month, exp_year, cvv', 'required'],
            ['number', 'filter', 'filter' => [$this, 'stripSpaces']],
            ['number', $importString, 'format' => $format],
            ['cvv', 'numerical'],
            ['cvv', 'length', 'is' => $cvv_length],
            ['exp_year', 'numerical', 'min' => date('Y')],
            ['exp_month', 'numerical']
        ];
    }

    public function attributeLabels() {
        return array(
            'name' => 'Holder\'s name',
            'number' => 'Card Number',
            'exp_month' => 'Expiry Month',
            'exp_year' => 'Expiry year',
            'cvv' => 'CVV No'
        );
    }

    public function process(\PayGateLog $pgl, $controller) {
        if (!\Fraud::fraudClearance($this->id || null, $pgl->user_ip, $pgl->userInfo->mobile, $pgl->userInfo->email)) {
            throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
        }
        if ($_POST['cc']['type'] == \ECCRupayValidator::RUPAY) {
            $pgl->pg_id = YII_DEBUG ? \PaymentGateway::HDFC_TEST : \PaymentGateway::HDFC_PRODUCTION;
            $pgl->update();
        }        
        // Now need to fill post for params for PayGateController
        // not cool, but will do for now
        // following params are expected in the number of places in the PayGateController and PayGateLog model
        $_POST = array_merge($_POST, [
            'card_number' => $this->number,
            'name_on_card' => $this->name,
            'expiry_month' => sprintf("%02d", $this->exp_month),
            'expiry_year' => sprintf("%02d", $this->exp_year),
            'cvv' => $this->cvv,
            'store_card' => $this->store,
            'storedCardId' => $this->id ? $this->id : false
        ]);

        $controller->forward('/payGate/doPay/id/'.$pgl->id);

    }

    public function stripSpaces($str) {
        return str_replace(' ', '', $str);
    }
}
