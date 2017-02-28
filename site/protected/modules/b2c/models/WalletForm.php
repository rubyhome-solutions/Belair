<?php
namespace b2c\models;
use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;
use application\components\PGs\Wallet\PayTM;
use application\components\PGs\Wallet\MobiKwik;
use application\components\PGs\Wallet\CCAvenue;

\Yii::setPathOfAlias('libphonenumber',\Yii::getPathOfAlias('application.vendor.libphonenumber'));

class WalletForm extends B2cFormModel {
    static public function submit($attributes, $scenario = null, \PayGateLog $pgl, $controller) {
        $form = static::factory($attributes, $scenario);


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
    
    public function attributeLabels() {
    	return array(
    			'wallet_type' => 'Wallet'
    	);
    }

    public function process(\PayGateLog $pgl, $controller) {
		if (!\Fraud::fraudClearance(null, $pgl->user_ip, $pgl->userInfo->mobile, $pgl->userInfo->email)) {
            throw new B2cException(4003, 'You have been blocked by the Admin to make this transaction! Please contact our customer support.');
        }
        
        $mobile = $pgl->userInfo->mobile;
        if(isset($mobile)) {
        	$mobile = substr($mobile, -10);
        	if( strlen($mobile) == 10) {
        		$this->setWalletInfo($pgl);	//Set wallet according to chosen at time of payment
        		
        		$_POST = array_merge($_POST, [
        				'category' => 'wallet',
        				'email' => $pgl->userInfo->email,
        				'amount' => $pgl->amount + $pgl->convince_fee,
        				'mobile' => $mobile,
        				'orderid' => $pgl->air_cart_id,
        				'customer_id' => $pgl->user_info_id
        		]);
        	}
        }
        
        $controller->forward('/payGate/doPay/id/'.$pgl->id);

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
    	$pgl->update();
    }
}
