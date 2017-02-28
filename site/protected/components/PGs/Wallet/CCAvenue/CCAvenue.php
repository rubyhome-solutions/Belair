<?php

namespace application\components\PGs\Wallet\CCAvenue;

class CCAvenue {

    const WALLET_PAYMENT_OPTION = 'OPTWLT';
    const WALLET_CARD_TYPE = 'WLT';
    const NEW_TRANSACTION_URL = 'transaction/transaction.do?command=initiateTransaction';
    const SUCCESS_STATUS = 'Success';
    const FAILURE_STATUS = 'Failure';
    const ABORT_STATUS = 'Aborted';
    const STATUS_CHECK_COMMAND = 'orderStatusTracker';
    const REFUND_COMMAND = 'refundOrder';
    const CHECKSTATUS_ORDER_SUCCESS = 'Successful';
    //Billing Info
    const BILLING_NAME = 'Airtickets India Pvt. Ltd.';
    const BILLING_ADDRESS = 'C-101, Sector-2';
    const BILLING_CITY = 'Noida';
    const BILLING_STATE = 'U.P';
    const BILLING_ZIP = '201301';
    const BILLING_COUNTRY = 'India';
    const BILLING_TEL = '+91-120-4887777';
    const BILLING_EMAIL = 'cs@cheapticket.in';
    const TXN_CONFIRM_STATUS = 'Shipped'; //this will be order_status in case of status api call for successfull transaction
    //const ORDER_CONFIRM_COMMAND = 'confirmOrder';
    const EMI_PAYMENT_OPTION = 'OPTEMI';
    const EMI_PAYMENT_MODE = 'EMI';
    const WALLET_PAYMENT_MODE = 'WALLET';
    
    const STATUS_UNSUCCESSFUL = 'Unsuccessful';
    const STATUS_CANCELLED = 'Cancelled';
    const API_VERSION = 1.1;
    const INVALID_PAYMENT = 'Invalid';
    
    static private $FAILED_STATUS = [
        self::STATUS_UNSUCCESSFUL,
        self::STATUS_CANCELLED,
    ];
    
    public static function setWalletParameters(&$pgl) {
        $pgl->pg_id = YII_DEBUG ? \PaymentGateway::CCAVENUE_TEST : \PaymentGateway::CCAVENUE_PRODUCTION;
    }

    public static function newTransaction($data, $pgl) {
        $param['merchant_id'] = $pgl->pg->merchant_id;
        $param['order_id'] = $pgl->id;
        $param['currency'] = \PaymentConfiguration::INDIANRUPEE;
        $param['amount'] = $data['amount'];
        $param['redirect_url'] = $data['url'];
        $param['cancel_url'] = $data['url'];
        $param['payment_option'] = self::WALLET_PAYMENT_OPTION;
        $param['card_type'] = self::WALLET_CARD_TYPE;
        $param['card_name'] = \PaymentConfiguration::$ccavenueWalletList[$data['wallet']['wallet_type']];
        $param['data_accept'] = 'N'; //For Directly go to wallet payment without showing ccavenue.
        $param['billing_name'] = self::BILLING_NAME;
        $param['billing_address'] = self::BILLING_ADDRESS;
        $param['billing_city'] = self::BILLING_CITY;
        $param['billing_state'] = self::BILLING_STATE;
        $param['billing_zip'] = self::BILLING_ZIP;
        $param['billing_country'] = self::BILLING_COUNTRY;
        $param['billing_tel'] = self::BILLING_TEL;
        $param['billing_email'] = self::BILLING_EMAIL;

        return self::_returnOutput($data, $pgl, $param);
    }

    private static function _returnOutput($data, $pgl, $param) {
        $params['encRequest'] = Utils::encryptRequest($pgl->pg->enc_key, $param);
        $params['access_code'] = $pgl->pg->access_code;

        return $params;
    }

    public static function decodeResponse($encResponse, $encKey) {
        return Utils::decrypt(trim($encResponse), $encKey);
    }

    public static function refresh($pgl) {
        $model = \PayGateLog::model()->findByPk($pgl->id);
        //\Utils::dbgYiiLog($model);
        //making param enc_request
        $json_array = array('reference_no' => $pgl->request_id, 'order_no' => $pgl->id);
        $enc_request = Utils::encrypt(json_encode($json_array), $pgl->pg->enc_key);

        //required params
        $param['enc_request'] = $enc_request;
        $param['access_code'] = $pgl->pg->access_code;
        $param['request_type'] = 'JSON';
        $param['command'] = self::STATUS_CHECK_COMMAND;
        $param['reference_no'] = $pgl->request_id;
        //$param['version'] = self::API_VERSION;
        
        $response = \Utils::curl($pgl->pg->api_url, $param);
        
        if (!empty($response['error'])) {
            return ['message' => $response['error']];
        }
        if (!empty($response['result'])) {
            $encryptedValues = explode('&', $response['result']);
            $arr = [];
            foreach ($encryptedValues as $values) {
                $breakValue = explode('=', $values);
                $arr = array_merge($arr, [$breakValue[0] => $breakValue[1]]);
            }
            if ($arr['status'] == 0) {
                $decodedResponse = self::decodeResponse(trim($arr['enc_response']), $pgl->pg->enc_key);
                $trimmed = trim($decodedResponse);
                $jsonData = json_decode($trimmed); 
                $responseObject = $jsonData->Order_Status_Result; 
                $raw_response['STATUS_API'] = $responseObject;
                $raw_response['STATUS_API_HASH'] = $arr['enc_response'];
                if ($responseObject->status == 0) {  //check status success
                    $model->updated = date(DATETIME_FORMAT);
                    $model->reason = $responseObject->order_status;
                    //$model->payment_mode = $responseObject->order_card_name;
                    $model->payment_mode = $responseObject->order_option_type;
                    $model->action_id = \TrAction::ACTION_SENT;
                    $model->request_id = $responseObject->reference_no;
                    //$pgl->raw_response = $pgl->setRawResponse($decodedResponse);//$decodedResponse;
                    $model->setRawResponse($raw_response);
                    if ($responseObject->order_status == self::TXN_CONFIRM_STATUS) {
                        $model->unmapped_status = $responseObject->order_bank_response;
                        $model->bank_ref = $responseObject->order_bank_ref_no;
                        $old_status = $model->status_id;
                        $model->status_id = \TrStatus::STATUS_SUCCESS;
                        if ($old_status === \TrStatus::STATUS_PENDING) {
                            if ($responseObject->order_option_type == self::EMI_PAYMENT_OPTION) {
                                $transferType = \TransferType::CC_DEPOSIT;
                            } else {
                                $transferType = \TransferType::AC_DEPOSIT;
                            }

                            $typeName = "Payment through ccavenue";
                            $payment = $model->registerNewPayment($transferType, $typeName);
                        }
                    } elseif (in_array($responseObject->order_status, self::$FAILED_STATUS)) {
                        $model->status_id = \TrStatus::STATUS_FAILURE;
                    } elseif ($responseObject->order_status == self::ABORT_STATUS) {
                        $model->status_id = \TrStatus::STATUS_ABORTED;
                    }
                    $model->request_id = $responseObject->reference_no;
                    //$model->hash_response = $arr['enc_response'];
                    $model->update();
                    return ['message' => 'Refresh succesful'];
                } elseif ($responseObject->status == 1) { //check status failure
                    $model->error = $responseObject->error_desc;
                    //$model->status_id = \TrStatus::STATUS_FAILURE;
                    $model->update();
                    return ['message' => $model->error];
                }
            } else {
                return ['message' => $arr['enc_response']];
            }
        }
    }

    /*
     * $pgl is original pay_gate_log	
     * $pgl_refund is new pay_gate_log
     */

    public static function refund($pgl, $pgl_refund) {
        //making param 
        $json_array = array('reference_no' => $pgl->request_id, 'refund_amount' => $pgl_refund->amount, 'refund_ref_no' => $pgl_refund->id);

        $enc_request = Utils::encrypt(json_encode($json_array), $pgl->pg->enc_key);

        $param['enc_request'] = $enc_request;
        $param['access_code'] = $pgl->pg->access_code;
        $param['request_type'] = 'JSON';
        $param['command'] = self::REFUND_COMMAND;
        $param['reference_no'] = $pgl->request_id;
        $param['refund_amount'] = $pgl_refund->amount;
        $param['refund_ref_no'] = $pgl_refund->id;
        //$param['version'] = self::API_VERSION;

        $response = \Utils::curl($pgl->pg->api_url, $param);

        if (!empty($response['result'])) {
            $encryptedValues = explode('&', $response['result']);
            $arr = [];
            foreach ($encryptedValues as $values) {
                $breakValue = explode('=', $values);
                $arr = array_merge($arr, [$breakValue[0] => $breakValue[1]]);
            }
            if ($arr['status'] == 0) {
                $decodedResponse = self::decodeResponse(trim($arr['enc_response']), $pgl->pg->enc_key);
                $json1 = json_decode($decodedResponse);
                $json = $json1->Refund_Order_Result;

                $pgl_refund->raw_response = $decodedResponse;
                $pgl_refund->updated = date(DATETIME_FORMAT);
                $pgl_refund->hash_our = $enc_request;
                $pgl_refund->pg_type = 'CCAvenue';

                if ($json->refund_status == 1) { //refund failure
                    $reason = $json->reason;
                    $pgl_refund->reason = $reason;
                    $pgl_refund->status_id = \TrStatus::STATUS_FAILURE;
                    $pgl_refund->update();
                    return $reason;
                } elseif ($json->refund_status == 0) {  //refund success
                    $pgl_refund->action_id = \TrAction::ACTION_REFUND;
                    $pgl_refund->status_id = \TrStatus::STATUS_SUCCESS;
                    $pgl_refund->registerNewPayment(\TransferType::FUND_RECALL, "Refund with CCAvenue");
                    $pgl_refund->update();
                    return 'Refund succesful';
                }
            } else {
                $pgl_refund->reason = $arr['enc_response'];
                $pgl_refund->status_id = \TrStatus::STATUS_FAILURE;
                $pgl_refund->update();
                return $arr['enc_response'];
            }
        } else {
            $pgl_refund->reason = html_entity_decode($response['error']);
            $pgl_refund->status_id = \TrStatus::STATUS_FAILURE;
            $pgl_refund->update();
            return $response['error'];
        }
    }

    public static function getTxnStatus($model, $request_id) {
        //making param enc_request
        $json_array = array('reference_no' => $request_id, 'order_no' => $model->id);
        $enc_request = Utils::encrypt(json_encode($json_array), $model->pg->enc_key);

        //required params
        $param['enc_request'] = $enc_request;
        $param['access_code'] = $model->pg->access_code;
        $param['request_type'] = 'JSON';
        $param['command'] = self::STATUS_CHECK_COMMAND;
        $param['reference_no'] = $request_id;
        //$param['version'] = self::API_VERSION;
        
        return \Utils::curl($model->pg->api_url, $param);
    }

    /*
     * $encString is encoded string
     * return value is array
     */

    public static function formattingResponse($encString) {
        $decryptValues = explode('&', $encString);
        $arr = [];
        foreach ($decryptValues as $values) {
            $breakValue = explode('=', $values);
            $arr = array_merge($arr, [$breakValue[0] => $breakValue[1]]);
        }
        return $arr;
    }
    
    /*
     * this method not in use now,may be used in future
     */
    public static function confirm($id) {
        return;
        $newPgl = \PayGateLog::model()->findByPk($id);
        if (isset($newPgl->hash_our)) {
            $oldPgl = \PayGateLog::model()->findByPk($newPgl->hash_our);
        }
        $json_array = [
            'order_List' => [
                    [
                    'reference_no' => $oldPgl->request_id,
                    'amount' => $oldPgl->amount,
                ]
            ]
        ];

        $enc_request = Utils::encrypt(json_encode($json_array), $oldPgl->pg->enc_key);
        
        $param['enc_request'] = $enc_request;
        $param['access_code'] = $oldPgl->pg->access_code;
        $param['request_type'] = 'JSON';
        $param['response_type'] = 'JSON';
        $param['command'] = self::ORDER_CONFIRM_COMMAND;
        $param['reference_no'] = $oldPgl->request_id;
        $param['amount'] = $oldPgl->amount; 
        
        $response = \Utils::curl($oldPgl->pg->api_url, $param);
        //\Utils::dbgYiiLog($response);
        if (isset($error)) {    //error
            return ['message' => $error];
        } else {
            $result = self::formattingResponse($response['result']);
            $newPgl->hash_our = $enc_request;
            if ($result['status'] == 0) {   //successfull api call
                $decodedResponseData = self::decodeResponse($result['enc_response'], $oldPgl->pg->enc_key);
                $jsonDecodeData = json_decode($decodedResponseData);
                //\Utils::dbgYiiLog($jsonDecodeData);
                if(isset($jsonDecodeData->Order_Result->success_count) && $jsonDecodeData->Order_Result->success_count == 0){
                    //if captured
                    //\Utils::dbgYiiLog($jsonDecodeData->Order_Result->failed_List->failed_order->reason);
                    $newPgl->raw_response = $decodedResponseData;
                    $newPgl->reason = trim($jsonDecodeData->Order_Result->failed_List->failed_order->reason);
                    $newPgl->update();
                    $newPgl->addCaptureCartNote();
                    return ['message' => $newPgl->reason];
                } 
            } else {
                $newPgl->raw_response = json_encode($response);
                $newPgl->reason = $result['enc_response'];
                $newPgl->status_id = \TrStatus::STATUS_FAILURE;
                $newPgl->action_id = \TrAction::ACTION_CAPTURE;
                $newPgl->update();
                return ['message' => $result['enc_response']];
            }
        }
    }

}
