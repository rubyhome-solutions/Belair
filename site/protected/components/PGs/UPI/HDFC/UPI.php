<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace application\components\PGs\UPI\HDFC;

class UPI {

    const NEW_TRANSACTION_ACTION = '/meTransCollectSvc';
    const REFRESH_TRANSACTION_ACTION = '/transactionStatusQuery';
    const REFUND_TRANSACTION_ACTION = '/refundReqSvc';
    const SUCCESS_STATUS = 'SUCCESS';
    const FAILED_STATUS = 'FAILED';
    const PENDING_STATUS = 'PENDING';
    const TRANS_REMARKS = 'Flight booking.';
    const TRANS_TYPE_P2P = 'P2P';
    const TRANS_TYPE_P2M = 'P2M';
    const PAY_PAYMENT_TYPE = 'PAY';
    const COLLECT_PAYMENT_TYPE = 'COLLECT';
    const REFUND_REMARKS = 'Order Refund';
    const REFUND_SUCCESS = 'S';
    const REFUND_FAILED = 'F';
    const NOTIFICATION_EXPIRY_TIME = 10; // time in minutes

    static $UPIStatusArray = [
        'PENDING' => \TrStatus::STATUS_PENDING,
        'SUCCESS' => \TrStatus::STATUS_SUCCESS,
        'FAILED' => \TrStatus::STATUS_FAILURE,
        'ABORTED' => \TrStatus::STATUS_ABORTED
    ];

    public static function setUpiParameters(&$pgl) {
        $pgl->pg_id = YII_DEBUG ? \PaymentGateway::HDFC_UPI_TEST : \PaymentGateway::HDFC_UPI_PRODUCTION;
    }

    public static function newTransaction($data, $pgl) {
        /*
          transaction calls paramenters
         * transaction request format
         * PGMerchantId|OrderNo|PayerVA|Amount|Remarks|expValue|MCC Code|1|2|3|4|5|6|7|8|NA|NA = 17 Nos.
          eg:  UPI000000000001|12345|pankaj@bank|510|TEST|10|12|||||||||NA|NA
         * pg->access_code //merchant category code
         * transaction response format
         * OrderNo|UPI Txn Id|amount|status|status desc|payer VA|payee VA|1|2|3|4|5|6|7|8|NA|NA = 17 Nos
         * pgl->raw_response //transaction response
         * pgl->request_id= UPI Txn Id
         */
        $baseUrl = $pgl->pg->base_url . self::NEW_TRANSACTION_ACTION;
        $transactionString = '';
        $orderId = $pgl->id;
        $transactionString = $pgl->pg->merchant_id . '|' . $orderId . '|' . $data['UPI']['virtual_address'] . '|' . $data['amount'] . '|' . self::TRANS_REMARKS . '|' . self::NOTIFICATION_EXPIRY_TIME . '|' . $pgl->pg->access_code . '|||||||||null|null';
        $encryptData = Utils::encryptValue($transactionString, $pgl->pg->enc_key);
        $json_array = array(
            'requestMsg' => $encryptData,
            'pgMerchantId' => $pgl->pg->merchant_id
        );
        $reqData = json_encode($json_array);
        $response = \Utils::curl($baseUrl, $reqData);
        if (!empty($response['error'])) {
             $raw_response['UPI_COLLECT_REQUEST_ERROR'] = $response['error'];
             $pgl->setRawResponse($raw_response);
             $pgl->save();
            return ['message' => $response['error'], 'payment' => 'upi'];
        }
        if (!empty($response['result'])) {
            $decryptData = Utils::decryptValue($response['result'], $pgl->pg->enc_key);
            $resultArr = explode('|', $decryptData);
            $pgl->reason = isset($resultArr[3])?$resultArr[3]:self::FAILED_STATUS;
            if (isset($resultArr[3]) && $resultArr[3] == self::SUCCESS_STATUS) {
                $pgl->payment_mode = 'UPI';
                $pgl->pg_type = 'HDFC';
                $pgl->request_id = $resultArr[1];
                $pgl->hash_our = $encryptData;
                $raw_response['HASHSTR'] = $response['result'];
                $raw_response['OUR_COLLECT_HASHSTR'] = $encryptData;
                $raw_response['COLLECT_NOTIFICATION_RESPONSE'] = $resultArr;
                $pgl->setRawResponse($raw_response);
                $pgl->hash_response = $response['result'];
                $pgl->save();
                return ['status' => $resultArr[3], 'orderId' => $orderId, 'message' => $resultArr[4]];
            } else {
                return ['status' => isset($resultArr[3])?$resultArr[3]:self::FAILED_STATUS, 'orderId' => $orderId, 'message' => isset($resultArr[4])?$resultArr[4]:self::FAILED_STATUS];
            }
        }
    }

    public static function refresh($pgl, $flag = true) {
        /* request format
         * PGMerchantId|OrderNo|UPI Txn ID|Reference Id|1|2|3|4|5|6|7|8|NA|NA = 14 Nos 
         * 
         * response format
         * UPI Txn ID|OrderNo|Amount|Txn Auth Date|status|status desc|1|2|3|Cust Ref No.|1|2|3|4|5|6|7|8|9|NA|NA = 21 Nos  
         * pgl->hash_response //for successfull transacton response
         * $pgl->token // Cust Ref no.       
         */

        $baseUrl = $pgl->pg->base_url . self::REFRESH_TRANSACTION_ACTION;
        $transactionString = '';

        $transactionString = $pgl->pg->merchant_id . '|' . $pgl->id . '|' . $pgl->request_id . '||||||||||null|null';
        $encryptData = Utils::encryptValue($transactionString, $pgl->pg->enc_key);
        $json_array = array(
            'requestMsg' => $encryptData,
            'pgMerchantId' => $pgl->pg->merchant_id
        );
        $reqData = json_encode($json_array);
        $response = \Utils::curl($baseUrl, $reqData);
         
        
        if (!empty($response['error'])) {
             $raw_response['UPI_REFRESH_REQUEST_ERROR'] = $response['error'];
             $pgl->setRawResponse($raw_response);
             $pgl->update();            
            return ['message' => $response['error']];
        }

        if (!empty($response['result'])) {
            $decryptData = Utils::decryptValue($response['result'], $pgl->pg->enc_key);
            $resultArr = explode('|', $decryptData);
            $raw_response['OUR_REFRESH_HASHSTR'] = $encryptData;
            $raw_response['HASHSTR'] = $response['result'];
            $raw_response['HDFC_CHECK_REFRESH_RESPONSE'] = $resultArr;   
            $pgl->setRawResponse($raw_response);
            
            if ($pgl->status_id !== \TrStatus::STATUS_PENDING) {
                $pgl->update();
                return ['message' => 'The payment is already processed', 'status' => $resultArr[4], 'orderId' => $pgl->id, 'response' => $response['result']];
            }
            
            if (isset($resultArr[4]) && $resultArr[4] != self::PENDING_STATUS) {
                $pgl->reason = $resultArr[4];
                $pgl->unmapped_status = isset($resultArr[6]) ? $resultArr[6] : 'Not set';
                $oldStatus = $pgl->status_id;
                if ($resultArr[4] == self::SUCCESS_STATUS) {
                    $pgl->updated = date(DATETIME_FORMAT);
                    $pgl->bank_ref = $resultArr[7];
                    $pgl->hash_response = $response['result'];
                    $pgl->request_id = $resultArr[0];
                    $pgl->token = $resultArr[9];
                    //if ($flag) {
                        $pgl->status_id = \TrStatus::STATUS_SUCCESS;
                    //}
                    $pgl->update();
                    if ($flag && $oldStatus === \TrStatus::STATUS_PENDING && $pgl->status_id === \TrStatus::STATUS_SUCCESS) {
                        // Register new payment
                        $payment = $pgl->registerNewPayment(\TransferType::HDFCUPI, "Bank code: {$pgl->pg_type} , Bank reference: {$pgl->bank_ref}");
                        \Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
                        return [
                            'message' => "Congratulations the payment was successful!",
                            'url' => "/payment/view/{$payment->id}"
                        ];
                    }                    
                    return ['message' => (!$flag) ? 'Congratulations the payment was successful!' : 'Refresh succesful', 'status' => $resultArr[4], 'orderId' => $pgl->id, 'response' => $response['result']];
                } else {
                    $pgl->error = $resultArr[5];
                    $pgl->status_id = \TrStatus::STATUS_FAILURE;
                    $pgl->update();
                    return ['message' => $pgl->error, 'status' => $resultArr[4], 'orderId' => $pgl->id, 'response' => $response['result']];
                }
            } else {
                return ['message' => isset($resultArr[5])?$resultArr[5]:'Failed ! Incorrect content', 'status' => isset($resultArr[4])?$resultArr[4]:self::FAILED_STATUS, 'orderId' => $pgl->id, 'response' => $response['result']];
            }
        }
    }

    public static function refund($pgl, $pgl_refund) {
        /* request format
         * PGMerchantId|NewOrderNo|Original Order No|Original Trn Ref No| Original Cust Ref No |Remarks|Refund AMT|Currency|Transaction Type|Payment Type|add1|add2|add3|add4|add5|add6|add7|add8|add9|add10 
         * 
         * response format
         * UPI Txn Id|MertxnRef|amount|TxnAuthdate|status|status desc|ResCode|AppNo|PayerVA|CustRefNo|RefID|add1|add2|add3|add4|add5|add6|add7|add8|add9|add10  
         *        
         */

        $baseUrl = $pgl->pg->base_url . self::REFUND_TRANSACTION_ACTION;
        $transactionString = '';
        $transactionString = $pgl->pg->merchant_id . '|' . $pgl_refund->id . '|' . $pgl->id . '|' . $pgl->request_id . '|' . $pgl->token . '|' . self::REFUND_REMARKS . '|' . $pgl_refund->amount . '|' . $pgl->currency->code . '|' . self::TRANS_TYPE_P2P . '|' . self::PAY_PAYMENT_TYPE . '|||||||||null|null';
        $encryptData = Utils::encryptValue($transactionString, $pgl->pg->enc_key);
        $json_array = array(
            'requestMsg' => $encryptData,
            'pgMerchantId' => $pgl->pg->merchant_id
        );
        $response = \Utils::curl($baseUrl, json_encode($json_array));
        if (!empty($response['error'])) {
             $raw_response['UPI_REFUND_REQUEST_ERROR'] = $response['error'];
             $pgl->setRawResponse($raw_response);
             $pgl->update();             
            return ['message' => $response['error']];
        }

        if (!empty($response['result'])) {
            $decryptData = Utils::decryptValue($response['result'], $pgl->pg->enc_key);
            $resultArr = explode('|', $decryptData);
            $raw_response['HASHSTR'] = $response['result'];
            $raw_response['HDFC_REFUND_TRNS_STR'] = $transactionString;
            $raw_response['HDFC_REFUND_RESPONSE'] = $resultArr;
            $raw_response['OUR_REFUND_HASHSTR'] = $encryptData;
            $pgl_refund->setRawResponse($raw_response);
            $pgl_refund->updated = date(DATETIME_FORMAT);
            $pgl_refund->hash_our = $encryptData;
            $pgl_refund->hash_response = $decryptData;
            $pgl_refund->pg_type = 'HDFC';
            if (isset($resultArr[4]) && $resultArr[4] == self::REFUND_SUCCESS) {
                $pgl_refund->action_id = \TrAction::ACTION_REFUND;
                $pgl_refund->reason = $resultArr[5];
                $pgl_refund->status_id = \TrStatus::STATUS_SUCCESS;
                $pgl_refund->bank_ref = $resultArr[7];
                $pgl_refund->update();
                $pgl_refund->registerNewPayment(\TransferType::FUND_RECALL, "Refund with HDFC UPI, Bank reference: {$pgl_refund->bank_ref}");
                return 'Refund succesful';
            } else {
                $pgl_refund->reason = isset($resultArr[5])?$resultArr[5]:'Failed';
                $pgl_refund->status_id = \TrStatus::STATUS_FAILURE;
                $pgl_refund->update();
                return $pgl_refund->reason;
            }
        } else {
            $pgl_refund->reason = html_entity_decode($response['error']);
            $pgl_refund->status_id = \TrStatus::STATUS_FAILURE;
            $pgl_refund->update();
            return $response['error'];
        }
    }

    static public function processResponse($meRes) {

        $pg_id = YII_DEBUG ? \PaymentGateway::HDFC_UPI_TEST : \PaymentGateway::HDFC_UPI_PRODUCTION;
        $pg = \PaymentGateway::model()->findByPk($pg_id);
        $decryptData = Utils::decryptValue($meRes, $pg->enc_key);
        $resultArr = explode('|', $decryptData);
        $message = "";
        if (!empty($resultArr[1])) {
            $model = \PayGateLog::model()->findByPk($resultArr[1]);

            $raw_response['HDFCUPI_POST_ENQ_RESPONSE'] = self::refresh($model, false);
            $enquiryRawResp = Utils::decryptValue($raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'], $pg->enc_key);
            $raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'] = explode('|', $enquiryRawResp);
            $raw_response['HDFCUPI_POST_HASHSTR'] = $meRes;
            $raw_response['HDFCUPI_POST_RESPONSE'] = $resultArr;
            $model->setRawResponse($raw_response);
            $hdfcTrans = true;
            if ($meRes === null ||
                    $resultArr[0] != $model->request_id ||
                    (double) $resultArr[2] != (double) ($model->amount + $model->convince_fee)) {
                $message = "Either Transaction reference id mismatched or amount mismatched";
                $hdfcTrans = false;
            }


            if ($raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'][1] != $model->id ||
                !isset($raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'][4]) || 
                !isset($raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'][2]) || 
                $raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'][4] != $resultArr[4] ||
                $raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'][4] != self::SUCCESS_STATUS  || 
                $raw_response['HDFCUPI_POST_ENQ_RESPONSE']['response'][2] != $resultArr[2]) {
                $hdfcTrans = false;
                $message = "Either OrderId mismatched or Post enquiry response status mismatched";
            }
            /*if ($model->status_id !== \TrStatus::STATUS_PENDING) {
                $hdfcTrans = false;
            }*/


            $model->updated = date(DATETIME_FORMAT);
            $model->unmapped_status = isset($resultArr[6]) ? $resultArr[6] : 'Not set';
            $model->payment_mode = 'Hdfc upi';
            $model->request_id = $resultArr[0];
            $model->hash_response = $decryptData;

            // if ($model->status_id == \TrStatus::STATUS_PENDING) {
            if ($resultArr[4] == self::SUCCESS_STATUS && $hdfcTrans) {
                $model->reason = $resultArr[4];
                $model->status_id = \TrStatus::STATUS_SUCCESS;
                $model->pg_type = 'HDFC';
                $model->error = $resultArr[5];
                $model->bank_ref = $resultArr[7];
                $message = $resultArr[4];
            } else {
                $model->status_id = \TrStatus::STATUS_FAILURE;
                $model->error = $resultArr[5];
                $message = "Failed";
            }
            //}
            $model->update();
            return ['model' => $model, 'message' => $message];
        } else {
            return ['model' => null, 'message' => 'Failed,response is invalid !'];
        }
    }

}
