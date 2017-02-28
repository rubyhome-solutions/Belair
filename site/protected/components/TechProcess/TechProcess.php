<?php

namespace application\components\TechProcess;

/**
 * Description of TechProcess
 *
 * @author Boxx
 */
class TechProcess {

    static $bankRefs = [
        470 => 'TechProcess test bank',
    ];
    public $request = null;
    public $strToSend = null;

    /**
     * The PG used
     * @var \PaymentGateway
     */
    public $pg = null;
    static $requestT = [
        'rqst_type' => 'T',
        'rqst_kit_vrsn' => '1.0.1',
        'tpsl_clnt_cd' => 'T1532',
        'clnt_txn_ref' => '456',
        'clnt_rqst_meta' => '',
        'rqst_amnt' => '1.00',
        'rqst_crncy' => 'INR',
        'rtrn_url' => 'http://belair/payGate/techProc/456',
        's2s_url' => 'http://belair/payGate/techProc/456',
        'rqst_rqst_dtls' => 'Test_1.00_0.00',
        'clnt_dt_tm' => '16-10-2014',
        'tpsl_bank_cd' => '470'
    ];

    /**
     * 
     * @param string $requestType Type of the request (T|S|O|R) Comments:<br>
     * T for Transaction request<br>
     * S for Real Time Transaction verification<br>
     * O for Offline Transaction verification<br>
     * R for Refund
     * @param int $amount Amount for the transfer
     * @param int $payGateLogId PayGateLogID created for the transaction
     * @param int $pgId The pg ID to be used
     * @param int $bank Bank code 470 for the tests
     */
    function __construct($requestType, $amount, $payGateLogId, $pgId = \PaymentGateway::TECH_PROCESS_TEST, $bank = 470) {
        $this->pg = \PaymentGateway::model()->findByPk($pgId);
        if ($this->pg === null) {
            throw new \CHttpException(404, "Payment provider is not found");
        }
        switch ($requestType) {
            case 'T':   // New transaction
                $this->request = self::$requestT;
                $this->request['clnt_dt_tm'] = date('d-m-Y');
                $this->request['rtrn_url'] = \Yii::app()->createAbsoluteUrl('payGate/techProc/' . $payGateLogId);
                $this->request['s2s_url'] = \Yii::app()->createAbsoluteUrl('payGate/techProc/' . $payGateLogId);
                $this->request['rqst_amnt'] = intval($amount) . '.00';
                $this->request['tpsl_bank_cd'] = $bank;
                $this->request['rqst_rqst_dtls'] = 'Test_' . intval($amount) . '.00_0.00';
                $this->request['clnt_txn_ref'] = $payGateLogId;
                $this->request['tpsl_clnt_cd'] = $this->pg->merchant_id;
                break;
            case 'S':   // Refresh
                $payGateLog = \PayGateLog::model()->findByPk($payGateLogId);
                if ($payGateLog === null) {
                    throw new \CHttpException(404, "Payment transaction is not found");
                }
                $this->request = [
                    'rqst_type' => 'S',
                    'rqst_kit_vrsn' => '1.0.1',
                    'tpsl_clnt_cd' => $this->pg->merchant_id,
                    'clnt_txn_ref' => $payGateLogId,
                    'rqst_amnt' => $amount,
                    'tpsl_txn_id' => $payGateLog->request_id,
                    'clnt_dt_tm' => date('d-m-Y'),
                ];
                break;
            case 'R':   // Refund
                $payGateLog = \PayGateLog::model()->findByPk($payGateLogId);
                if ($payGateLog === null) {
                    throw new \CHttpException(404, "Payment transaction is not found");
                }
                $this->request = [
                    'rqst_type' => 'R',
                    'rqst_kit_vrsn' => '1.0.1',
                    'tpsl_clnt_cd' => $this->pg->merchant_id,
                    'rqst_amnt' => $payGateLog->amount,
                    'tpsl_txn_id' => $payGateLog->token,
                    'clnt_dt_tm' => date('d-m-Y'),
                ];
                break;
        }
    }

    function createPayload() {
        $payload = '';
        foreach ($this->request as $key => $value) {
            $payload .= "{$key}={$value}|";
        }
        $payload = rtrim($payload, '|');
        $sha = sha1($payload);
        $payAndSha = trim($payload . '|hash=' . $sha);
        $payloadWithSha1 = $this->encrypt($payAndSha);
        $this->strToSend = $payloadWithSha1 . "|{$this->request['tpsl_clnt_cd']}~";

//        return [
//            'payload' => $payload,
//            'sha' => $sha,
//            'payAndSha' => $payAndSha,
//            'payloadWithSha1' => $payloadWithSha1,
//            'dataToPostToPg' => $this->strToSend
//        ];
    }

    function encrypt($str) {
        $str = \Utils::pkcs5Pad($str, 16);    // 16 is the block size of of MCRYPT_RIJNDAEL_128 & MCRYPT_MODE_CBC
        return trim(base64_encode(mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $this->pg->enc_key, $str, MCRYPT_MODE_CBC, $this->pg->salt)));
    }

    function decrypt($str) {
        $str = trim(mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $this->pg->enc_key, base64_decode($str), MCRYPT_MODE_CBC, $this->pg->salt));
        $str = \Utils::pkcs5Unpad($str, 16);    // Remove the padding. 16 is the block size of of MCRYPT_RIJNDAEL_128 & MCRYPT_MODE_CBC
        $hash = substr($str, -40);  // last 40 sybols are hash
        if ($hash == sha1(substr($str, 0, -46))) {
            return self::strToArr($str);
        } else {
            return "Decryption error - Bad hash";
        }
    }

    function sendRequest() {
        $soap = new TransactionService($this->pg->api_url);
        $res = $soap->getTransactionToken(new getTransactionToken($this->strToSend));
//        \Utils::soapLogDebug($soap);
        return $res->getTransactionTokenReturn;
    }

    static function strToArr($str) {
        $out = [];
        $tmp = explode('|', $str);
        foreach ($tmp as $value) {
            list($k, $v) = explode('=', $value);
            $out[$k] = $v;
        }
        return $out;
    }

}
