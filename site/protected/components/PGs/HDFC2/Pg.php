<?php

namespace application\components\PGs\HDFC2;

/**
 * HDFC2 Payment Gateway Services
 * MIGS is the MasterCard Internet Gateway Service
 *
 * @author Tony
 */
class Pg {

    /**
     * Where to send the response from bank 3D authentication
     * @var string
     */
    private $termURL;

    /**
     * The transaction that is the base for the payment
     * @var \PayGateLog
     */
    private $pgl;

    /**
     * The transaction that is the base for the payment
     * @var \PaymentGateway
     */
    private $pg;

    /**
     * The CC used for the payment
     * @var \Cc
     */
    private $cc = null;

    /**
     * The CC CVV code, since we are not saving those
     * @var string
     */
    private $cvv;
    private static $cardMapping = [
        \CcType::TYPE_MASTERCARD => "Mastercard",
        \CcType::TYPE_VISA => "Visa",
        \CcType::TYPE_AMEX => "Amex",
        \CcType::TYPE_DINERS_CLUB => "Dinersclub",
        \CcType::TYPE_DISCOVER => 'Discover',
        \CcType::TYPE_RUPAY => 'RuPay',
    ];

    /**
     * Create payment via ATOM PG
     * @param \PayGateLog $pgl
     * @param string $cvv The CC CVV code
     */
    public function __construct(\PayGateLog $pgl, $cvv = null) {
        $this->cvv = $cvv;
        $this->pgl = $pgl;
        $this->cc = empty($pgl->cc_id) ? null : $pgl->cc;
        $this->termURL = \Yii::app()->request->hostInfo . '/payGate/hdfc2/' . $pgl->id;
        $this->pg = \PaymentGateway::model()->cache(3600)->findByPk($pgl->pg_id);
        return true;
    }

    /**
     * Authorize a transaction and update the PayGateLog object
     * @return boolean TRUE on success or string with the error
     */
    function startNewTransaction() {
        if (!$this->cc) {
            return ['error' => 'The CC or the PGL are not defined'];
        }
        set_time_limit(65);
        $content = [
            'vpc_Version' => 1, // Static HDFC2 parameter
            'vpc_Command' => 'pay', // Static parameter
            'vpc_MerchTxnRef' => $this->pgl->id,
            'vpc_AccessCode' => $this->pg->enc_key, // Static HDFC2 parameter
            'vpc_Merchant' => $this->pg->merchant_id,
//            'vpc_OrderInfo' => 'payment', // Static parameter - like notes for us
            'vpc_OrderInfo' => "Cart:" . ($this->pgl->air_cart_id ? : 'None') . ",Transaction:{$this->pgl->id}",
            'vpc_Amount' => ($this->pgl->amount + $this->pgl->convince_fee) * 100, // Need 00 at the end
            'vpc_Locale' => 'en', // Static parameter
            'vpc_ReturnURL' => \Yii::app()->createAbsoluteUrl("payGate/hdfc2/{$this->pgl->id}"),
            'vpc_Card' => self::$cardMapping[$this->cc->type_id],
            'vpc_Gateway' => 'ssl', // threeDSecure
            'vpc_CardNum' => $this->cc->decode($this->cc->number),
            'vpc_CardExp' => substr($this->cc->exp_date, 2, 2) . substr($this->cc->exp_date, 5, 2),
            'vpc_CardSecurityCode' => $this->cvv,
        ];
        // Calculate the hash
        $this->pg->hdfc256HashCalculation($content);
        $this->pgl->hash_our = $content['vpc_SecureHash'];

        // All is OK - mark the transaction as pending
        $this->pgl->action_id = \TrAction::ACTION_SENT;
        $this->pgl->status_id = \TrStatus::STATUS_PENDING;
        $this->pgl->update(['status_id', 'action_id', 'hash_our']);

        // Return the info, so the client browser can be redirected
        return [
            'url' => $this->pg->base_url,
            'outParams' => $content
        ];
    }

    /**
     * Refresh the transaction and register new payment if status is changed to success
     * @return array
     */
    function refresh() {
        $params = [
            'vpc_Version' => 1,
            'vpc_Command' => 'queryDR',
            'vpc_AccessCode' => $this->pg->enc_key,
            'vpc_Merchant' => $this->pg->merchant_id,
            'vpc_MerchTxnRef' => $this->pgl->id,
            'vpc_User' => $this->pg->username,
            'vpc_Password' => $this->pg->password,
        ];
        // Calculate the hash
        $this->pg->hdfc256HashCalculation($params);

        $res = \Utils::curl($this->pg->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            return ['error' => $res['error']];
        }
        parse_str($res['result'], $result);
        //$this->pgl->addRawResponse('Refresh', $result);
        $refreshResp ['HDFC2_REFRESH_RESPONSE']= $result;
        $this->pgl->setRawResponse($refreshResp);
        $responseCode = isset($result["vpc_TxnResponseCode"]) ? $result["vpc_TxnResponseCode"] : null;
        $this->pgl->reason = html_entity_decode(isset($result['vpc_Message']) ? $result['vpc_Message'] : 'Not set');
        $this->pgl->unmapped_status = isset(\PaymentGateway::$axisResponseCode[$responseCode]) ? \PaymentGateway::$axisResponseCode[$responseCode] : "Not Set";
        if ($responseCode != "0") {    // Error
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return ['error' => $this->pgl->reason];
        }

        $this->pgl->updated = date(DATETIME_FORMAT);
        $oldStatus = $this->pgl->status_id;
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->bank_ref = $result['vpc_ReceiptNo'];
        $this->pgl->pg_type = 'HDFC2';
        $this->pgl->request_id = $result['vpc_TransactionNo'];
        $this->pgl->reason = $this->pgl->unmapped_status;
        $this->pgl->update();
        if ($oldStatus === \TrStatus::STATUS_PENDING) {
            // Register new payment
            $payment = $this->pgl->registerNewPayment(\TransferType::CC_DEPOSIT, "Bank code: {$this->pgl->pg_type} , Bank reference: {$this->pgl->bank_ref}");
            \Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            return [
                'message' => "Congratulations the payment was successful!",
                'url' => "/payment/view/{$payment->id}"
            ];
        }
        return ['message' => 'Refresh succesful. There are no changes'];
    }

    /**
     * Receive the result of the transaction and register new payment if successful
     * @return array
     */
    function finalResult() {
        unset($_GET['id']);
        //$this->pgl->raw_response = json_encode($_GET);
        $hdfcResp ['HDFC2_FIND_RESULT_GET_RESPONSE']= json_encode($_GET);
        $this->pgl->setRawResponse($hdfcResp);        
        $this->pgl->updated = date(DATETIME_FORMAT);
        $responseCode = (string) \Yii::app()->request->getQuery("vpc_TxnResponseCode");
        if ($responseCode !== "0") {
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->error = \Yii::app()->request->getQuery('vpc_Message');
            $this->pgl->reason = $this->pgl->error;
            $this->pgl->unmapped_status = isset(\PaymentGateway::$axisResponseCode[$responseCode]) ? \PaymentGateway::$axisResponseCode[$responseCode] : "Not Set";
        } else {
            $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
            $this->pgl->unmapped_status = \Yii::app()->request->getQuery('vpc_Message');
            $this->pgl->reason = $this->pgl->unmapped_status;
            $this->pgl->error = null;
        }
        $this->pgl->hash_response = \Yii::app()->request->getQuery('vpc_SecureHash');
        $this->pgl->bank_ref = \Yii::app()->request->getQuery('vpc_ReceiptNo');
        $this->pgl->pg_type = 'HDFC2';
//        $model->request_id = \Yii::app()->request->getQuery('vpc_TransactionNo');
        $this->pgl->request_id = \Yii::app()->request->getQuery('vpc_TransactionNo');
        $this->pgl->update();

        // Decide the 3DS status for the used card
        \Yii::import('application.commands.SupportCommand');
        \SupportCommand::set3dStatus($this->pgl);
    }

    /**
     * Refund transaction
     * @return string
     */
    function refund() {
        $params = [
            'vpc_Version' => 1,
            'vpc_Command' => 'refund',
            'vpc_AccessCode' => $this->pg->enc_key,
            'vpc_Merchant' => $this->pg->merchant_id,
            'vpc_MerchTxnRef' => $this->pgl->hash_our, // Original transaction MerchantRef
            'vpc_TransNo' => $this->pgl->token, // Original transaction ID
            'vpc_Amount' => $this->pgl->amount * 100,
            'vpc_User' => $this->pg->username,
            'vpc_Password' => $this->pg->password,
        ];
        // Calculate the hash
        $this->pg->hdfc256HashCalculation($params);

        $res = \Utils::curl($this->pg->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            $this->pgl->reason = html_entity_decode($res['error']);
            $hdfcResp ['HDFC2_REFUND_ERROR']= $res;
            $this->pgl->setRawResponse($hdfcResp);
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->update(['reason', 'status_id','raw_response']);
            return $res['error'];
        }
        parse_str($res['result'], $result);
        //$this->pgl->addRawResponse('Refund', $result);
        $hdfcResp ['HDFC2_REFUND_RESPONSE']= $result;
        $this->pgl->setRawResponse($hdfcResp);        
        $this->pgl->reason = html_entity_decode($result['vpc_Message']);
        if ($result['vpc_TxnResponseCode'] != "0") {    // Error
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->unmapped_status = $result['vpc_Message'];
            $this->pgl->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return $this->pgl->reason;
        }
        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->bank_ref = $result['vpc_ReceiptNo'];
        $this->pgl->request_id = $result['vpc_TransactionNo'];
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->update();
        $this->pgl->registerNewPayment(\TransferType::FUND_RECALL, "Refund with HDFC2, Bank reference: {$this->pgl->bank_ref}");
        return 'Refund succesful';
    }

    function capture() {
        $params = [
            'vpc_Version' => 1,
            'vpc_Command' => 'capture',
            'vpc_MerchTxnRef' => $this->pgl->hash_our,
            'vpc_AccessCode' => $this->pg->enc_key,
            'vpc_Merchant' => $this->pg->merchant_id,
            'vpc_TransNo' => $this->pgl->token, // We temporary store the ID of the capturable transaction 
            'vpc_Amount' => ($this->pgl->amount + $this->pgl->convince_fee) * 100,
            'vpc_User' => $this->pg->username,
            'vpc_Password' => $this->pg->password,
        ];
        // Calculate the hash
        $this->pg->hdfc256HashCalculation($params);

        $res = \Utils::curl($this->pg->api_url, $params);
//        \Utils::dbgYiiLog($res);
        if (!empty($res['error'])) {    // Curl error
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->reason = html_entity_decode($res['error']);
            $hdfcResp ['HDFC2_CAPTURE_ERROR']= $res;
            $this->pgl->setRawResponse($hdfcResp);            
            $this->pgl->update(['status_id', 'reason','raw_response']);
            return ['error' => $res['error']];
        }
        parse_str($res['result'], $result);
        //$this->pgl->addRawResponse(__FUNCTION__, $result);
//        \Utils::dbgYiiLog($result);
        $hdfcResp ['HDFC2_CAPTURE_RESPONSE']= $result;
        $this->pgl->setRawResponse($hdfcResp);        
        $responseCode = isset($result['vpc_TxnResponseCode']) ? $result['vpc_TxnResponseCode'] : null;
        $this->pgl->reason = isset(\PaymentGateway::$axisResponseCode[$responseCode]) ? \PaymentGateway::$axisResponseCode[$responseCode] : "Not Set";
        if ($responseCode !== "0") {    // Error
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->unmapped_status = isset($result['vpc_Message']) ? $result['vpc_Message'] : null;
            $this->pgl->error = $this->pgl->reason;
            $this->pgl->update(['status_id', 'reason', 'unmapped_status', 'raw_response', 'error']);
            return ['error' => $this->pgl->reason];
        }
        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->bank_ref = $result['vpc_ReceiptNo'];
        $this->pgl->request_id = $result['vpc_TransactionNo'];
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->update();
        $this->pgl->addCaptureCartNote();
        return ['message' => 'The transaction is captured successfully'];
    }

}
