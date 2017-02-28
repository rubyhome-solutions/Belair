<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;

\Yii::setPathOfAlias('libphonenumber',\Yii::getPathOfAlias('application.vendor.libphonenumber'));

class NetbankingForm extends B2cFormModel {
    static public function submit($attributes, $scenario = null, \PayGateLog $pgl, $controller) {
        $form = static::factory($attributes, $scenario);


        if (!$form->validate()) {
            throw new B2cException(4001, 'Validation Error', $form->getErrors());
        }

        return call_user_func_array([$form, 'process'], array_slice(func_get_args(), 2));
    }

    public $id;
    public $category = 'netbanking';
    public $net_banking;

    public function rules() {
        return [
            ['net_banking', 'required'],
            ['category, net_banking, id', 'safe']
        ];
    }

    public function process(\PayGateLog $pgl, $controller) {


        if (!\Fraud::fraudClearance(null, $pgl->user_ip, $pgl->userInfo->mobile, $pgl->userInfo->email)) {
            throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
        }
        
        if(is_numeric($this->net_banking)){
        	$pgl->pg_id = YII_DEBUG ? \PaymentGateway::ATOM_TEST : \PaymentGateway::ATOM_PRODUCTION;
        }else{
        	$pgl->pg_id = YII_DEBUG ? \PaymentGateway::PAYU_TEST_ID : \PaymentGateway::PAYU_PRODUCTION_ID;
        }
        
        $pgl->save();

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
