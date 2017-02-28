<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use application\components\PGs\UPI\HDFC;

class UPIForm extends B2cFormModel {

    static public function submit($attributes, $scenario = null, \PayGateLog $pgl, $controller) {
        $form = static::factory($attributes, $scenario);

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

    public function process(\PayGateLog $pgl, $controller) {
        if (!\Fraud::fraudClearance($this->id || null, $pgl->user_ip, $pgl->userInfo->mobile, $pgl->userInfo->email)) {
            throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
        }


        HDFC\UPI::setUpiParameters($pgl);
        $pgl->save();

        $mobile = $pgl->userInfo->mobile;
        if (isset($mobile)) {
            $mobile = substr($mobile, -10);
            if (strlen($mobile) == 10) {

                $_POST = array_merge($_POST, [
                    'category' => 'UPI',
                    'email' => $pgl->userInfo->email,
                    'amount' => $pgl->amount + $pgl->convince_fee,
                    'mobile' => $mobile,
                    'orderid' => $pgl->air_cart_id,
                    'customer_id' => $pgl->user_info_id
                ]);
            }
        }

        $controller->forward('/payGate/doPay/id/' . $pgl->id);
    }

}
