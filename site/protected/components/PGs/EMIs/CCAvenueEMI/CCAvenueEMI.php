<?php

namespace application\components\PGs\EMIs\CCAvenueEMI;

use application\components\PGs\Wallet\CCAvenue;

class CCAvenueEMI {
    const EMI_CARD_TYPE = 'CRDC';
    const EMI_PAYMENT_OPTION = 'OPTEMI';
    
    public static function newTransaction($data, $pgl) {
        $param['card_number'] = $data['card_number'];
        $param['issuing_bank'] = $data['issuing_bank'];
        $param['cvv_number'] = $data['cvv'];
        $param['card_type'] = self::EMI_CARD_TYPE;
        $param['expiry_month'] = $data['expiry_month'];
        $param['expiry_year'] = $data['expiry_year'];
        $param['card_name'] = $data['card_type'];
        $param['order_id'] = $pgl->id;
        $param['merchant_id'] = $pgl->pg->merchant_id;
        $param['emi_tenure_id'] = $data['emi_tenure_id'];
        $param['emi_plan_id'] = $data['emi_plan_id'];
        //$param['payment_option'] = $data['payment_option'];
        $param['payment_option'] = self::EMI_PAYMENT_OPTION;
        $param['currency'] = $data['currency'];
        $param['amount'] = $data['amount'];
        $param['data_accept'] = 'N';	//For Directly go to wallet payment without showing ccavenue.
    	$param['billing_name'] = CCAvenue\CCAvenue::BILLING_NAME;
    	$param['billing_address'] = CCAvenue\CCAvenue::BILLING_ADDRESS;
    	$param['billing_city'] = CCAvenue\CCAvenue::BILLING_CITY;
    	$param['billing_state'] = CCAvenue\CCAvenue::BILLING_STATE;
    	$param['billing_zip'] = CCAvenue\CCAvenue::BILLING_ZIP;
    	$param['billing_country'] = CCAvenue\CCAvenue::BILLING_COUNTRY;
    	$param['billing_tel'] = CCAvenue\CCAvenue::BILLING_TEL;
    	$param['billing_email'] = CCAvenue\CCAvenue::BILLING_EMAIL; 
        $param['redirect_url'] = $data['url'];
    	$param['cancel_url'] = $data['url'];
        
    	return self::_returnOutput($pgl, $param);
    }
    
    private static function _returnOutput($pgl, $param) {
        //\Utils::dbgYiiLog('hello123');
        $params['encRequest'] = CCAvenue\Utils::encryptRequest($pgl->pg->enc_key, $param);
    	$params['access_code'] = $pgl->pg->access_code;
    	
    	return $params;
    }
    
    public static function getCCAvenueEmiData($amount) {
        $flag = 'CCAvFlag';
        $pg = YII_DEBUG ? \PaymentGateway::CCAVENUE_TEST : \PaymentGateway::CCAVENUE_PRODUCTION;
        $model = \PaymentGateway::model()->findByPk($pg);
        $url = $model->base_url . "transaction/transaction.do?command=getJsonData&access_code=" . $model->access_code . "&currency=INR&amount=" . $amount;
        //\Utils::dbgYiiLog($url);
        return \Utils::curl($url, $flag);
    }
}



