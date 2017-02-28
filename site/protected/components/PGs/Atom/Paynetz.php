<?php

namespace application\components\PGs\Atom;

/**
 * Payment Gateway Services
 * TranPortal 3D Secure (VbV Merchant Hosted)
 *
 * @author Boxx
 */
class Paynetz {

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
     * Create payment via ATOM PG
     * @param \PayGateLog $pgl
     */
    public function __construct(\PayGateLog $pgl) {
        $this->pgl = $pgl;
        $this->termURL = \Yii::app()->request->hostInfo . '/payGate/atom/' . $pgl->id;
        $this->pg = \PaymentGateway::model()->findByPk($pgl->pg_id);
    }

    /**
     * Authorize a transaction and update the PayGateLog object
     * @return boolean TRUE on success or string with the error
     */
    function startNewTransaction() {
        set_time_limit(65);
        $content = [
            'login' => $this->pg->merchant_id,
            'pass' => $this->pg->salt,
            'ttype' => 'NBFundTransfer',
            'prodid' => $this->pg->enc_key,
            'amt' => sprintf('%.2f', $this->pgl->amount + $this->pgl->convince_fee),
            'txncurr' => 'INR',
            'txnscamt' => 0,
            'clientcode' => base64_encode($this->pgl->user_info_id),
            'txnid' => $this->pgl->id,
            'custacc' => '1234567890',
            'date' => date('d/m/Y H:i:s'),
            'ru' => $this->termURL,
            'bankid' => $this->pgl->bank_ref,
        ];

        if ($this->pgl->pg_id == \PaymentGateway::ATOM_TEST) {
            $content['mdd'] = 'NB';
            $content ['bankid'] = 2001;     // 2001 is the standard bank ID for test
        }

        if ($content['amt'] < 50) {
            $res['error'] = 'The amount should be more than rs.50';
        } else {
            $res = \Utils::curl($this->pg->base_url, $content);
        }
//        \Utils::dbgYiiLog($content);
//        \Utils::dbgYiiLog($res);
        $response = null;
        if (!empty($res['error'])) {
            $error = $res['error'];
        } elseif (strstr(strtoupper($res['result']), 'SERVICE UNAVAILABLE')) {
            $error = "The Payment Gateway {$this->pg->name} is not available at the moment. Please, try to pay again after 5min!";
        } else {
            $response = self::parseXmlResponse($res['result']);
            $this->pgl->addRawResponse(__FUNCTION__, \Utils::formatXmlString($res['result']));
        }

        // Auth problems - no token
        if (!isset($error) &&
                (empty($response->MERCHANT->RESPONSE->param) || empty($response->MERCHANT->RESPONSE->url))
        ) {
            $error = "PG: {$this->pg->name} authentication issue";
        }

        // Is there a transaction error
        if (!empty($response->error_text)) {
            $error = (string) $response->error_text;
        }

        // We have errors
        if (isset($error)) {
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->action_id = \TrAction::ACTION_SENT;
            $this->pgl->error = $error;
            $this->pgl->reason = $error;
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->update();
            return ['error' => $error];
        }

        // All is OK - mark the transaction as pending
        $this->pgl->action_id = \TrAction::ACTION_SENT;
        $this->pgl->status_id = \TrStatus::STATUS_PENDING;
        $this->pgl->update(['status_id', 'action_id']);

        // Return the info, so the client browser can be redirected
        return [
            'url' => (string) $response->MERCHANT->RESPONSE->url,
            'outParams' => self::xmlAttributes2array($response->MERCHANT->RESPONSE->param)
        ];
    }

    /**
     * Refresh the transaction and register new payment if status is changed to success
     * @return array
     */
    function refresh() {
        $content = [
            'merchantid' => $this->pg->merchant_id,
            'merchanttxnid' => $this->pgl->id,
            'amt' => $this->pgl->amount + $this->pgl->convince_fee,
            'tdate' => substr($this->pgl->updated, 0, 10)
        ];
        $res = \Utils::curl($this->pg->access_code, $content);
        unset($error);
        if (!empty($res['error'])) {
            $error = $res['error'];
        } elseif (strstr(strtoupper($res['result']), 'SERVICE UNAVAILABLE')) {
            $error = "The Payment Gateway {$this->pg->name} is not available at the moment. Please, try to pay again after 5min!";
        } else {
            $this->pgl->addRawResponse(__FUNCTION__, \Utils::formatXmlString($res['result']));
            $response = self::parseXmlResponse($res['result']);
            // Is there a parsing error
            if (!empty($response->error_text)) {
                $error = (string) $response->error_text;
            }
        }

        if (!isset($error)) {
            if (!empty($response->VerifyOutput)) {
                $response = self::xmlAttributes2array($response->VerifyOutput);
            }

            if (isset($response['VERIFIED']) && $response['VERIFIED'] != 'SUCCESS') {
                $error = $response['VERIFIED'] . " Check the transaction details for more info";
//                \Utils::dbgYiiLog($response);
            }
        }

        if (isset($error)) {    // error
            return ['error' => $error];
        }

        $this->pgl->updated = date(DATETIME_FORMAT);
        $oldStatus = $this->pgl->status_id;
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->update(['status_id']);
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
        $response = $_POST;
        $this->pgl->addRawResponse(__FUNCTION__, $response);

        // Error case
        if (!isset($response['f_code']) || $response['f_code'] != 'Ok') {
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->pg_type = 'ATOM';
            $this->pgl->reason = isset($response['desc']) ? $response['desc'] : 'DECLINED';
            $this->pgl->error = $this->pgl->reason;
            $this->pgl->update();
            return ['error' => 'DECLINED'];
        }

        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->pg_type = $response['bank_name'];
        $this->pgl->bank_ref = $response['bank_txn'];
        $this->pgl->request_id = $response['mmp_txn'];
        $this->pgl->reason = isset($response['desc']) ? $response['desc'] : 'APPROVED';
        $this->pgl->unmapped_status = isset($response['prod']) ? $response['prod'] : null;
        $this->pgl->error = null;
        $this->pgl->update();
        return ['message' => 'Success'];
    }

    /**
     * Refund transaction
     * @return string
     */
    function refund() {
        $originalPgl = \PayGateLog::model()->findByPk($this->pgl->hash_our);
        $content = [
            'merchantid' => $this->pg->merchant_id,
            'pwd' => urlencode(base64_encode($this->pg->salt)),
            'atomtxnid' => $this->pgl->token,
            'refundamt' => $this->pgl->amount,
//            'txndate' => date(DATE_FORMAT),
            'txndate' => substr($originalPgl->updated, 0, 10),
        ];

        $res = \Utils::curl($this->pg->api_url, $content);
        unset($error);
        if (!empty($res['error'])) {
            $error = $res['error'];
        } else {
            $response = self::parseXmlResponse($res['result']);
//            \Utils::dbgYiiLog($response);
            $this->pgl->addRawResponse(__FUNCTION__, \Utils::formatXmlString($res['result']));
        }

        if (empty($error) && $response->STATUSCODE != '00') {
            $error = (string) $response->STATUSMESSAGE;
        }

        if (isset($error)) {    // error
            \Utils::dbgYiiLog("ATOM refund query: " . http_build_query($content));
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->request_id = isset($response) ? $response->TXNID : null;
            $this->pgl->pg_type = 'ATOM';
            $this->pgl->reason = $error;
            $this->pgl->error = $error;
            $this->pgl->update();
            return $error;
        }

        // Refund successful
        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->pg_type = 'ATOM';
        $this->pgl->reason = (string) $response->STATUSMESSAGE;
        $this->pgl->unmapped_status = (string) $response->STATUSCODE;
        $this->pgl->request_id = (string) $response->TXNID;
        $this->pgl->error = null;
        $this->pgl->update();
        $this->pgl->registerNewPayment(\TransferType::FUND_RECALL, "Refund with ATOM, Bank reference: {$this->pgl->request_id}");
        return 'Refund was executed successfully';
    }

    /**
     * Very simple and stupid single dimension array to XML serialization
     * @param array $arr
     * @return string
     */
    static function array2xml($arr) {
        $out = '';
        foreach ($arr as $key => $value) {
            $out .= "<$key>$value</$key>";
        }
        return $out;
    }

    static function clearXml($str) {
        return str_replace([
            '<?xml version="1.0" encoding="UTF-8"?>',
            '&',
                ], [
            '',
            '&amp;'
                ], $str);
    }

    /**
     * Parse XML string. In case of error return error_text element
     * @param string $res The input string
     * @return \SimpleXMLElement Return stdClass element in case of error
     */
    static function parseXmlResponse($res) {
        libxml_use_internal_errors(true);
        $out = simplexml_load_string($res);
        if ($out === false) {
            \Utils::dbgYiiLog([
                'errors' => libxml_get_errors(),
                'content raw' => $res,
                'content cleared' => self::clearXml($res),
            ]);
            $out = new \stdClass;
            $out->error_text = 'XML parsing error - check the logs.';
        }
        return $out;
    }

    static function xmlAttributes2array(\SimpleXMLElement $xmlObject) {
        $out = [];
        foreach ($xmlObject as $node) {
            foreach ($node->attributes() as $index) {
                $out[(string) $index] = urldecode((string) $node);
            }
        }
        return $out;
    }

}
