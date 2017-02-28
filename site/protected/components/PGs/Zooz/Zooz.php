<?php

namespace application\components\PGs\Zooz;

//Our demo credit card numbers, as listed in the SDKs, are as follows:
//MasterCard: 5555-5555-5555-4444 or 5105-1051-0510-5100
//Visa: 4580-4580-4580-4580 or 4111-1111-1111-1111

class Zooz {

    const PAYMENT_APPROVED = 1001;
    const PAYMENT_AUTHORIZED = 1002;
    const THREE_D_SECURE_SUCCESS = 0;
    const THREE_D_SECURE_FAILURE = 1;
    const INVOICE_NUMBER = "+91-120-4887777";

    public $isSandbox = true;
    public $headers = [];
    public $zoozAppID = null;
    public $zoozAppKey = null;
    public $zoozURL = null;
    public $zoozClientURL = null;
    protected $zoozUdid = null;
    public $merchantServerApiKey = null;
    protected $curl = null;
    public $currencyCode = 'USD';
    public $amount = 0;
    protected $paymentToken = null;
    protected $paymentMethodToken = null;
    protected $paymentId = null;
    protected $customerToken = null;
    protected $email;
    public $lastResponse;
    protected $redirectUrl;
    protected $cardHolderName;
    protected $air_cart_id = null; //this is id in openPayment request
    protected $reconciliationId = null; //this is pay_gate_log_id in authorizePayment request
    protected $ipAddress = null; //ip address of user

    /**
     * The transaction
     * @var \PayGateLog
     */
    protected $pgl;

    /**
     * CC used in the transaction
     * @var \Cc
     */
    protected $cc = null;
    protected $cvv = null;

    /**
     * Codes for transaction passed with approval or authorization
     * @var array
     */
    static private $OK_CODES = [
        self::PAYMENT_APPROVED,
        self::PAYMENT_AUTHORIZED,
    ];
    static private $threeDSecureStatus = [
        self::THREE_D_SECURE_SUCCESS,
        self::THREE_D_SECURE_FAILURE,
    ];

    /**
     * Create Zooz PG class
     * @param \PayGateLog $pgl
     * @param string $cvv The CC cvv code
     */
    public function __construct(\PayGateLog $pgl, $cvv = null) {
        $this->curl = curl_init();
        $this->cvv = $cvv;
        $this->pgl = $pgl;
        $this->currencyCode = $pgl->currency->code;
        $this->amount = floatval($pgl->amount + $pgl->convince_fee);
        $this->zoozAppID = $pgl->pg->merchant_id;
        $this->zoozAppKey = $pgl->pg->salt;
        $this->zoozURL = $pgl->pg->base_url;
        $this->zoozClientURL = $pgl->pg->api_url;
        $this->zoozUdid = 'zooz_' . strtoupper(\Utils::generateUuid());
        $this->merchantServerApiKey = $pgl->pg->enc_key;
        $this->email = $pgl->userInfo->email;
        $this->isSandbox = ($pgl->pg_id === \PaymentGateway::ZOOZ_TEST);
        $this->redirectUrl = \Yii::app()->request->hostInfo . '/payGate/zooz/' . $this->pgl->id;
        if ($pgl->cc_id) {  // We have valid CC object
            $this->cc = $pgl->cc;
        }
        //$this->cardHolderName = $this->pgl->cc->name;
        $this->air_cart_id = $this->pgl->air_cart_id;   //for open payment request
        $this->ipAddress = $this->pgl->user_ip;
        $this->reconciliationId = $this->pgl->id;       //for authorizePayment request
    }

    public function setupCurl() {
        // User agent
//        curl_setopt($this->curl, CURLOPT_USERAGENT, self::USER_AGENT);
        //Header fields: ZooZ-Unique-ID, ZooZ-App-Key, ZooZ-Response-Type
        $headers = $this->headers;
        curl_setopt($this->curl, CURLOPT_HTTPHEADER, $headers);
        //If it is a post request
        curl_setopt($this->curl, CURLOPT_POST, 1);
        // Timeout in seconds
        curl_setopt($this->curl, CURLOPT_TIMEOUT, 20);
        // Clean the output
        curl_setopt($this->curl, CURLOPT_HEADER, 0);
        curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1);

        // Turn off SSL checking
        if ($this->isSandbox === true) {
            curl_setopt($this->curl, CURLOPT_SSL_VERIFYHOST, 0);
            curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, 0);
        } else {
            curl_setopt($this->curl, CURLOPT_SSL_VERIFYHOST, 1);
            curl_setopt($this->curl, CURLOPT_SSL_VERIFYPEER, 1);
        }
    }

    /**
     * Send transaction to ZooZ
     * @param string $command
     * @param array $optional
     * @return array
     * @throws ZoozException
     */
    public function call($command, array $optional = []) {
        $this->headers = [
            "programId: {$this->zoozAppID}",
            "programKey: {$this->zoozAppKey}",
//        "ZooZUniqueID: {$this->zoozAppID}",
//        "ZooZAppKey: {$this->zoozAppKey}",
            "ZooZResponseType: JSon",
            "Content-Type: application/json",
        ];
        $this->setupCurl();
        // Set URL
        curl_setopt($this->curl, CURLOPT_URL, $this->zoozURL);


        //Mandatory POST fields: cmd, amount, currencyCode
        $post = [];
        $post["command"] = $command;

        //Optional POST fields
        foreach ($optional as $key => $value) {
            $post[$key] = $value;
        }

        curl_setopt($this->curl, CURLOPT_POSTFIELDS, json_encode($post, JSON_UNESCAPED_SLASHES));
        $response = curl_exec($this->curl);
        if ($response === false) {
            throw new ZoozException("Curl connection to Zooz failed: " . curl_error($this->curl));
        }
        $result = json_decode($response, true);
        $this->lastResponse = $result;  // For debugging purposes

        if (!isset($result['responseStatus'])) {
            throw new ZoozException("Zooz failed to return a status code: " . print_r($result, true));
        } elseif ($result['responseStatus'] != 0) {
//            $errcode = $result['responseObject']['responseErrorCode'];
            $err = isset($result['responseObject']['errorDescription']) ? $result['responseObject']['errorDescription'] : "Unknown ZooZ error";
            throw new ZoozException($err);
        }

        return $result['responseObject'];
    }

    /**
     * Send transaction to ZooZ
     * @param string $command
     * @param array $optional
     * @return array
     * @throws ZoozException
     */
    public function callClient($command, array $optional = []) {
        $this->setupCurl();
        // Set URL
        curl_setopt($this->curl, CURLOPT_URL, $this->zoozClientURL);
        $post = [];
        $post["cmd"] = $command;
        //Optional POST fields
        foreach ($optional as $key => $value) {
            $post[$key] = $value;
        }

        curl_setopt($this->curl, CURLOPT_POSTFIELDS, json_encode($post, JSON_UNESCAPED_SLASHES));
        $response = curl_exec($this->curl);
        if ($response === false) {
            throw new ZoozException("Curl connection to Zooz failed: " . curl_error($this->curl));
        }
        $result = json_decode($response, true);
        $this->lastResponse = $result;  // For debugging purposes

        if (!isset($result['responseStatus'])) {
            throw new ZoozException("Zooz failed to return a status code: " . print_r($result, true));
        } elseif ($result['responseStatus'] != 0) {
//            $errcode = $result['responseObject']['responseErrorCode'];
            $err = isset($result['responseObject']['errorDescription']) ? $result['responseObject']['errorDescription'] : "Unknown ZooZ error";
            throw new ZoozException($err);
        }

        return $result['responseObject'];
    }

    public function verifyTrx($trxId) {
        $this->setupCurl();

        //Mandatory POST fields: cmd, amount, currencyCode
        $post = [];
        $post["command"] = "verifyTrx";
        $post["trxId"] = trim($trxId);

        curl_setopt($this->curl, CURLOPT_POSTFIELDS, http_build_query($post));
        $response = curl_exec($this->curl);
        if ($response === false) {
            throw new ZoozException("Curl connection to Zooz failed: " . curl_error($this->curl));
        }
        $result = json_decode($response, true);

        if (!isset($result['responseStatus'])) {
            throw new ZoozException("Zooz failed to return a status code: " . print_r($result, true));
        } elseif ($result['responseStatus'] !== "0") {
            $errcode = $result['responseObject']['responseErrorCode'];
            $err = isset($result['responseObject']['errorDescription']) ? $result['responseObject']['errorDescription'] : "Unknown";
            throw new ZoozException("Zooz return a negative result: $errcode - $err");
        }

        return true;
    }

    private function openPayment() {
        $post['customerDetails']['customerLoginID'] = (string) $this->pgl->user_info_id;
        $post['paymentDetails'] = [
            "amount" => 14.5/* $this->amount */,
            "currencyCode" => 'GBP'/* $this->currencyCode */,
            "invoice" => [
                "number" => $this->air_cart_id,
                "additionalDetails" => "air_cart_id:" . $this->air_cart_id . ",pay_gate_log_id:" . $this->pgl->id,
            ],
        ];

        $res = $this->call(__FUNCTION__, $post);
        $this->paymentToken = $res['paymentToken'];
        $this->paymentId = $res['paymentId'];
        $this->pgl->request_id = $res['paymentToken'];
        $this->pgl->unmapped_status = $res['paymentId'];
    }

    private function getToken() {
        $post['customerDetails']['customerLoginID'] = $this->pgl->user_info_id;
        $post['tokenType'] = 'customerToken';
        $res = $this->call(__FUNCTION__, $post);
        $this->customerToken = $res['customerToken'];
    }

    private function addPaymentMethod() {
        if ($this->cc === null) {
            throw new ZoozException('CC object is not valid');
        }
        $this->headers = [
            "productType: Checkout API",
            "programId: {$this->zoozAppID}",
            "ZooZ-Token: {$this->paymentToken}",
            "ZooZ-UDID: {$this->zoozUdid}",
            "ZooZUniqueID: {$this->zoozAppID}",
            "ZooZAppKey: {$this->zoozAppKey}",
            "ZooZResponseType: JSon",
            "Content-Type: application/json",
        ];

        $post['paymentToken'] = $this->paymentToken;
        $post['ipAdderss'] = $this->ipAddress;
        $post['email'] = $this->email;
        $post['paymentMethod'] = [
            'paymentMethodType' => 'CreditCard',
            'configuration' => ['rememberPaymentMethod' => false],
            'paymentMethodDetails' => [
                'cardNumber' => \Cc::decode($this->cc->number),
//                'month' => substr($this->cc->exp_date, 5, 2),
//                'year' => substr($this->cc->exp_date, 0, 4),
                'expirationDate' => substr($this->cc->exp_date, 5, 2) . '/' . substr($this->cc->exp_date, 0, 4),
                'cvvNumber' => (string) $this->cvv,
                'cardHolderName' => $this->cardHolderName,
            ],
        ];
        \Utils::dbgYiiLog(['addPaymentMethod' => $post]);
        $res = $this->callClient(__FUNCTION__, $post);
        $this->paymentMethodToken = $res['paymentMethodToken'];
    }

    private function authorizePayment() {
        $post['paymentToken'] = $this->paymentToken;
        $post['ipAddress'] = $this->ipAddress;
        $post['reconciliationId'] = $this->reconciliationId;
        $post['paymentMethod'] = [
            'paymentMethodType' => 'CreditCard',
            'paymentMethodToken' => $this->paymentMethodToken,
            'paymentMethodDetails' => [
                'redirectUrl' => $this->redirectUrl,
                'cvvNumber' => $this->cvv,
                'authorize3DSecure' => TRUE,
            ],
        ];
        \Utils::dbgYiiLog(["authorizePaymentRequest" => $post]);
        return $this->call(__FUNCTION__, $post);
    }

    private function commitPayment() {
        $post['paymentToken'] = $this->pgl->token;
        $post['amount'] = $this->amount;
        $post['uniqueTransactionID'] = \Utils::generateUuid();
        return $this->call(__FUNCTION__, $post);
    }

    private function refundPayment() {
        $post['paymentToken'] = $this->pgl->token;
        $post['amount'] = $this->amount;
        $post['uniqueTransactionID'] = \Utils::generateUuid();
        return $this->call(__FUNCTION__, $post);
    }

    private function getPaymentDetails() {
        $post['paymentToken'] = $this->pgl->request_id;
        return $this->call(__FUNCTION__, $post);
    }

    function getPaymentMethods() {
        $post['customerLoginID'] = $this->pgl->user_info_id;
        return $this->call(__FUNCTION__, $post);
    }

    function refund() {
        try {
            $res = $this->refundPayment();
        } catch (ZoozException $e) {
            $error = $e->getMessage();
            $res = [];  // Initialize the variable to avoid errors
        }
        $this->pgl->addRawResponse('Refund', $res);
        if (!empty($res['responseErrorCode'])) {
            $error = $res['errorDescription'];
        }
        if (!empty($res['processorError'])) {
            $error = $res['processorError']['declineReason'];
        }
        // Stop if error
        if (isset($error)) {
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->reason = $error;
            $this->pgl->error = $error;
            $this->pgl->update(['status_id', 'reason', 'error']);
            return 'Refund was failure';
        } else {
            $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
            $this->pgl->reason = $res['refundStatus'];
            $this->pgl->bank_ref = isset($res['slipNumber']) ? $res['slipNumber'] : null;
            $this->pgl->unmapped_status = isset($res['refundCode']) ? $res['refundCode'] : null;
            $this->pgl->pg_type = 'ZooZ';
            $this->pgl->error = null;
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->update();
            $this->pgl->registerNewPayment(\TransferType::FUND_RECALL, "Refund with ZooZ, Transaction №{$this->pgl->id} Processor reference: {$this->pgl->bank_ref}");
            return 'Refund was executed successfully';
        }
    }

    function refresh() {
        if (empty($this->pgl->request_id)) {
            return ['error' => 'This transaction do not have refresh feature'];
        }
        try {
            $res = $this->getPaymentDetails();
        } catch (ZoozException $e) {
            return ['error' => $e->getMessage()];
        }
        $this->pgl->addRawResponse('Refresh', $res);
        // Pending transaction that is OK - update and create new payment
        if (in_array($res['paymentStatusCode'], self::$OK_CODES) && $this->pgl->status_id === \TrStatus::STATUS_PENDING) {
            $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
            $this->pgl->reason = $res['paymentStatus'];
            $this->pgl->bank_ref = isset($res['paymentId']) ? $res['paymentId'] : null;
            $this->pgl->unmapped_status = isset($res['riskScore']) ? 'riskScore: ' . $res['riskScore'] : $res['paymentStatusCode'];
            $this->pgl->pg_type = 'ZooZ';
            $this->pgl->error = null;
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->update();
            $this->pgl->registerNewPayment(\TransferType::CC_DEPOSIT, "Refresh with ZooZ, Transaction №{$this->pgl->id} Processor reference: {$this->pgl->bank_ref}");
        }
        return ['message' => 'Refresh succesful'];
    }

    function authorize() {
        try {
            $this->openPayment();
            $this->addPaymentMethod();
        } catch (ZoozException $e) {
            $error = $e->getMessage();
            $res = [];  // Initialize the variable to avoid errors
        }
        // Continue only if there is no error
        if (!isset($error)) {
            // Save the transaction parameters so far
            $this->pgl->request_id = $this->paymentToken;
            $this->pgl->bank_ref = $this->paymentId;    // We store the paymentID in the bank_ref attribute
            $this->pgl->status_id = \TrStatus::STATUS_PENDING;
            $this->pgl->action_id = \TrAction::ACTION_SENT;
            $this->pgl->update(['request_id', 'bank_ref', 'status_id', 'action_id']);
            try {
                $res = $this->authorizePayment();
            } catch (ZoozException $e) {
                $error = $e->getMessage();
                $res = [];  // Initialize the variable to avoid errors
            }
        }
        $this->pgl->addRawResponse('Authorization I', $res);
        if (!empty($res['responseErrorCode'])) {
            $error = $res['errorDescription'];
        }
        if (!empty($res['processorError'])) {
            $error = $res['processorError']['declineReason'];
        }
        // If Error - stop here
        if (isset($error)) {
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->error = $error;
            $this->pgl->reason = $error;
            $this->pgl->update(['status_id', 'error', 'reason']);
            return ['error' => $error];
        }
        // Continue and mark the transaction as success in case where 3DS is not needed
        if ($res['responseType'] === 'authorizeCompletion') {
            $this->pgl->reason = $res['responseType'];
            $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
            $this->pgl->unmapped_status = empty($res['merchantId']) ? '' : $res['merchantId'];
            $this->pgl->update(['reason', 'status_id', 'unmapped_status']);
            // Forward to payment successful
            return [
                'url' => $this->redirectUrl,
                'outParams' => null
            ];
        } else {
            // Forward to the final payment registration page
            $threeDSecureRedirectParams = ['PaReq' => $res['obj3DSecure']['paReq'], 'TermUrl' => $res['obj3DSecure']['termUrl'], 'MD' => $res['obj3DSecure']['md']];
            return [
                'url' => $res['obj3DSecure']['acsUrl'], //  Or use "obj3DSecure"
                //'outParams' => $res['obj3DSecure']
                'outParams' => $threeDSecureRedirectParams,
            ];
        }
    }

    function authorizeSecondPart($res) {
        if ($res['paymentToken'] == $this->pgl->request_id) {
            $getPaymentDetails = $this->getPaymentDetails();
            \Utils::dbgYiiLog(['getPaymentDetails' => $getPaymentDetails]);
            $rawResponse['GET_DATA'] = $res;
            $rawResponse['getPaymentDetails'] = $getPaymentDetails;
            /*
             * this is the case of siccess, we have to handle falure case also
             */
            if (in_array($getPaymentDetails['paymentStatusCode'], self::$OK_CODES)) { 
                $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
                $this->pgl->setRawResponse($rawResponse);
                if (isset($getPaymentDetails['threeDSecureStatus'])) {
                    if ($getPaymentDetails['threeDSecureStatus'] == self::THREE_D_SECURE_SUCCESS) {
                        $this->pgl->status_3d = \Cc::STATUS3D_Y;
                    } elseif ($getPaymentDetails['threeDSecureStatus'] == self::THREE_D_SECURE_FAILURE) {
                        $this->pgl->status_3d = \Cc::STATUS3D_N;
                    } else {
                        $this->pgl->status_3d = \Cc::STATUS3D_U;
                    }
                }
                $this->pgl->reason = $getPaymentDetails['paymentStatus'];
                $this->pgl->update();
            }
        }
    }

    /**
     * Capture transaction
     * @return array with error or normal message
     */
    function capture() {
        try {
            $res = $this->commitPayment();
        } catch (ZoozException $e) {
            $error = $e->getMessage();
            $res = [];  // Initialize the variable to avoid errors
        }
        $this->pgl->addRawResponse('Capture', $res);
        if (!empty($res['responseErrorCode'])) {
            $error = $res['errorDescription'];
        }
        if (!empty($res['processorError'])) {
            $error = $res['processorError']['declineReason'];
        }
        // Stop if error
        if (isset($error)) {
            return ['error' => $error];
        }
        // Capture successful
        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->pg_type = 'ZooZ';
        $this->pgl->reason = 'CAPTURED';
//        $this->pgl->bank_ref = ;
        $this->pgl->request_id = isset($res['captureCode']) ? $res['captureCode'] : null;
        $this->pgl->unmapped_status = isset($res['reconciliationId']) ? $res['reconciliationId'] : null;
        $this->pgl->error = null;
        $this->pgl->update();
        $this->pgl->addCaptureCartNote();

        return ['message' => 'The transaction is captured successfully'];
//        \Utils::dbgYiiLog($res['result']);
    }

}
