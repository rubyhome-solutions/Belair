<?php

namespace application\components\PGs\Wallet\PayTM;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class PayTM {

    const REFUND_URI = 'oltp/HANDLER_INTERNAL/REFUND';
    const STATUS_QUERY_URL = 'oltp/HANDLER_INTERNAL/TXNSTATUS';

    private static function _getChecksum($param, $pgl) {
        return Utils::generateChecksum($param, $pgl->pg->enc_key);
    }

    private static function _returnOutput($param, $data, $pgl) {
        $param['CHECKSUMHASH'] = self::_getChecksum($param, $pgl);
        return $param;
    }

    public static function setWalletParameters(&$pgl) {
        $pgl->pg_id = YII_DEBUG ? \PaymentGateway::PAYTM_TEST : \PaymentGateway::PAYTM_PRODUCTION;
    }

    public static function newTransaction($data, $pgl) {
        //set pg_id for paytm if tech process
        //if (in_array($pgl->pg_id, \PaymentGateway::$techProcIdList)) {
        //	self::setWalletParameters($pgl);
        //}
        $param["MID"] = $pgl->pg->merchant_id;
        $param["ORDER_ID"] = $pgl->id;
        $param["CUST_ID"] = $data['customer_id'];
        $param["INDUSTRY_TYPE_ID"] = $pgl->pg->salt;
        $param["CHANNEL_ID"] = $pgl->pg->note;
        $param["TXN_AMOUNT"] = $data['amount'];
        $param["WEBSITE"] = $pgl->pg->access_code;
        $param['MOBILE_NO'] = $data['mobile'];
        $param["EMAIL"] = $data['email'];
        $param['CALLBACK_URL'] = $data['url'];
        
        return self::_returnOutput($param, $data, $pgl);
    }

    public static function refund($pgl, $pgl_refund) {
        $param["MID"] = $pgl->pg->merchant_id;
        $param["ORDER_ID"] = $pgl->id;
        $param["TXNID"] = $pgl->request_id;
        $param["REFUNDAMOUNT"] = $pgl_refund->amount;
        $param["TXNTYPE"] = 'REFUND';
        $chksum = self::_getChecksum($param, $pgl);

        $param['CHECKSUM'] = $chksum;
        $param['REFID'] = $pgl_refund->id;
        $res = \Utils::curl($pgl->pg->base_url . self::REFUND_URI . '?JsonData=' . json_encode($param));

        if (!empty($res['result'])) {
            $response_paytm = json_decode($res['result']); //json decode of response
            $response['REFUND_RESPONSE'] = $response_paytm;
            $pgl_refund->setRawResponse($response);
            if (isset($response_paytm->RESPCODE)) {
                $pgl_refund->updated = date(DATETIME_FORMAT);
                $pgl_refund->unmapped_status = isset(\PaymentGateway::$paytmResponseCode[$response_paytm->RESPCODE]) ? \PaymentGateway::$paytmResponseCode[$response_paytm->RESPCODE] : "Not Set";
                $pgl_refund->reason = $response_paytm->RESPMSG;
                $pgl_refund->request_id = $response_paytm->TXNID;
                $pgl_refund->pg_type = $response_paytm->GATEWAY;
                if ($response_paytm->RESPCODE == Utils::REFUND_SUCCESS_RESPONSECODE && $response_paytm->STATUS == Utils::SUCCESS_STATUS && !empty($response_paytm->BANKTXNID)) {
                    $pgl_refund->bank_ref = $response_paytm->BANKTXNID;
                    $pgl_refund->action_id = \TrAction::ACTION_REFUND;
                    $pgl_refund->status_id = \TrStatus::STATUS_SUCCESS;
                    $pgl_refund->registerNewPayment(\TransferType::FUND_RECALL, "Refund with PayTM, Bank reference: $pgl_refund->bank_ref");
                    $pgl_refund->update();
                    return 'Refund succesful';
                } else {
                    $pgl_refund->status_id = \TrStatus::STATUS_FAILURE;
                    $pgl_refund->update();
                    return $pgl_refund->reason;
                }
            } else {
                $pgl_refund->update();
            }
        } else {
            $pgl_refund->reason = html_entity_decode($res['error']);
            $pgl_refund->status_id = \TrStatus::STATUS_FAILURE;
            $pgl_refund->update();
            return $res['error'];
        }
    }

    public static function refresh($pgl) {
        $model = \PayGateLog::model()->findByPk($pgl->id);
        //requires params orderid, merchant_id
        $param['ORDERID'] = $model->id;
        $param["MID"] = $model->pg->merchant_id;
        //send request to api usins curl
        $response = \Utils::curl($model->pg->base_url . self::STATUS_QUERY_URL . '?JsonData=' . json_encode($param));

        if (!empty($response['error'])) {
            return ['message' => $response['error']];
        }
        if (!empty($response['result'])) {
            $result = json_decode($response['result']);
            $model->request_id = $result->TXNID;
            $raw_response ['STATUS_API'] = json_decode($response['result'], true);
            $model->setRawResponse($raw_response);
            $model->updated = date(DATETIME_FORMAT);
            $model->unmapped_status = isset(\PaymentGateway::$paytmResponseCode[$result->RESPCODE]) ? \PaymentGateway::$paytmResponseCode[$result->RESPCODE] : "Not Set";
            $model->action_id = \TrAction::ACTION_SENT;

            if (isset($result->STATUS) && $result->STATUS === Utils::SUCCESS_STATUS && $result->RESPCODE == Utils::SUCCESS_RESPCODE) {
                //$pgl->raw_response = $response['result'];
                $model->reason = $result->RESPMSG;
                $model->payment_mode = $result->PAYMENTMODE;
                $model->status_id = \TrStatus::STATUS_SUCCESS;
                $model->pg_type = $result->GATEWAYNAME;
                $model->bank_ref = $result->BANKTXNID;
                $old_status = $model->status_id;
                if ($old_status == \TrStatus::STATUS_PENDING) {
                    $transferType = \TransferType::CC_DEPOSIT;
                    $typeName = 'Paytm Wallet';
                    $model->registerNewPayment($transferType, $typeName);
                }
                $model->update();
                return ['message' => 'Refresh succesful'];
            } elseif (isset($result->STATUS) && $result->STATUS === Utils::FAILURE_STATUS) {
                $model->status_id = \TrStatus::STATUS_FAILURE;
                $model->error = $result->STATUS;
                $model->update();
                return ['message' => $result->RESPMSG];
            }
        }
        return ['message' => 'Server error, please try again'];
    }

    public static function getTxnStatus($model) {
        $param['ORDERID'] = $model->id;
        $param["MID"] = $model->pg->merchant_id;
        $result = [];
        //send request to api usins curl
        $response = \Utils::curl($model->pg->base_url . self::STATUS_QUERY_URL . '?JsonData=' . json_encode($param));
        //\Utils::dbgYiiLog($response);
        if (!empty($response['error'])) {
            return ['message' => $response['error']];
        }
        if (!empty($response['result'])) {
            $result = json_decode($response['result'], true);
        }
        return $result;
    }

}
