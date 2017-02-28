<?php

use application\components\PGs\Wallet\PayTM\PayTM;
use application\components\PGs\Wallet\CCAvenue\CCAvenue;
use application\components\PGs\UPI\HDFC\UPI;

/**
 * This is the model class for table "payment_gateway".
 *
 * The followings are the available columns in table 'payment_gateway':
 * @property integer $id
 * @property string $name
 * @property string $note
 * @property string $merchant_id
 * @property string $salt
 * @property string $base_url
 * @property integer $is_active
 * @property string $api_url
 * @property string $enc_key
 * @property string $username
 * @property string $password
 * @property string $access_code
 *
 * The followings are the available model relations:
 * @property PayGateLog[] $payGateLogs
 */
class PaymentGateway extends CActiveRecord {

    const PAYU_TEST_ID = 1;
    const PAYU_PRODUCTION_ID = 2;
    const TECH_PROCESS_TEST = 3;
    const TECH_PROCESS_TEST2 = 13;
    const TECH_PROCESS_PRODUCTION = 4;
    const AXIS_TEST = 5;
    const AXIS_PRODUCTION = 6;
    const AMEX_TEST = 7;
    const AMEX_PRODUCTION = 8;
    const HDFC_TEST = 9;
    const HDFC_PRODUCTION = 10;
    const ZOOZ_TEST = 11;
    const ZOOZ_PRODUCTION = 12;
    const ATOM_TEST = 14;
    const ATOM_PRODUCTION = 15;
    const HDFC2_TEST = 16;
    const HDFC2_PRODUCTION = 17;
    const AXIS2_PRODUCTION = 18;
    const MOBIKWIK_TEST = 19; // Not in Use for now
    const MOBIKWIK_PRODUCTION = 20; // Not in Use for now
    const PAYTM_TEST = 21;
    const PAYTM_PRODUCTION = 22;
    const CCAVENUE_TEST = 23;
    const CCAVENUE_PRODUCTION = 24;
    const HDFC_UPI_TEST = 25;
    const HDFC_UPI_PRODUCTION = 26;
    const AXIS2_TEST = 27;

    static $payuIdList = [
        self::PAYU_TEST_ID,
        self::PAYU_PRODUCTION_ID,
    ];
    static $techProcIdList = [
        self::TECH_PROCESS_TEST,
        self::TECH_PROCESS_TEST2,
        self::TECH_PROCESS_PRODUCTION,
    ];
    static $axisIdList = [
        self::AXIS_TEST,
        self::AXIS_PRODUCTION,
    ];
    static $axis2IdList = [
        self::AXIS2_TEST,
        self::AXIS2_PRODUCTION,
    ];
    static $amexIdList = [
        self::AMEX_TEST,
        self::AMEX_PRODUCTION,
    ];
    static $hdfcIdList = [
        self::HDFC_TEST,
        self::HDFC_PRODUCTION,
    ];
    static $hdfc2IdList = [
        self::HDFC2_TEST,
        self::HDFC2_PRODUCTION,
    ];
    static $zoozIdList = [
        self::ZOOZ_TEST,
        self::ZOOZ_PRODUCTION,
    ];
    static $atomIdList = [
        self::ATOM_TEST,
        self::ATOM_PRODUCTION,
    ];
    static $canCapture = [
        self::AXIS_TEST,
        self::AXIS_PRODUCTION,
        self::AXIS2_PRODUCTION,
        self::AMEX_TEST,
        self::AMEX_PRODUCTION,
        self::HDFC_TEST,
        self::HDFC_PRODUCTION,
        self::ZOOZ_TEST,
        self::ZOOZ_PRODUCTION,
        self::HDFC2_TEST,
        self::HDFC2_PRODUCTION,
    ];
    static $extensiveFaudCheck = [
        self::AXIS_TEST,
        self::AXIS_PRODUCTION,
        self::AXIS2_PRODUCTION,
        self::AMEX_TEST,
        self::AMEX_PRODUCTION,
        self::HDFC2_PRODUCTION,
    ];
    static $paytmIdList = [
        self::PAYTM_TEST,
        self::PAYTM_PRODUCTION
    ];
    static $ccavenueIdList = [
        self::CCAVENUE_TEST,
        self::CCAVENUE_PRODUCTION
    ];
    static $hdfcupiIdList = [
        self::HDFC_UPI_TEST,
        self::HDFC_UPI_PRODUCTION
    ];
    static $axisResponseCode = [
        "0" => "Transaction Successful",
        "?" => "Transaction status is unknown",
        "1" => "Unknown Error",
        "2" => "Bank Declined Transaction",
        "3" => "No Reply from Bank",
        "4" => "Expired Card",
        "5" => "Insufficient funds",
        "6" => "Error Communicating with Bank",
        "7" => "Payment Server System Error",
        "8" => "Transaction Type Not Supported",
        "9" => "Bank declined transaction (Do not contact Bank)",
        "A" => "Transaction Aborted",
        "C" => "Transaction Cancelled",
        "D" => "Deferred transaction has been received and is awaiting processing",
        "F" => "3D Secure Authentication failed",
        "I" => "Card Security Code verification failed",
        "L" => "Shopping Transaction Locked (Please try the transaction again later)",
        "N" => "Cardholder is not enrolled in Authentication scheme",
        "P" => "Transaction has been received by the Payment Adaptor and is being processed",
        "R" => "Transaction was not processed - Reached limit of retry attempts allowed",
        "S" => "Duplicate SessionID (OrderInfo)",
        "T" => "Address Verification Failed",
        "U" => "Card Security Code Failed",
        "V" => "Address Verification and Card Security Code Failed",
    ];
    static $paytmResponseCode = [
        '01' => 'Transaction Successful',
        '10' => 'Transaction Successful',
        '141' => 'Transaction cancelled by customer after landing on Payment Gateway Page',
        '227' => 'Payment Failed due to a Bank Failure',
        '330' => 'Checksum Error',
        '810' => 'Page closed by customer after landing on Payment Gateway Page',
        '8102' => 'Transaction cancelled by customer post login,customer had sufficient Wallet balance for completing transaction',
        '8103' => 'Transaction cancelled by customer post login,customer had in-sufficient Wallet balance for completing transaction',
    ];

    /*
     * Voucher Code Map for Accounting Reports
     */
    static $vccodeMap = array(
        \PaymentGateway::AMEX_PRODUCTION => '170034',
        \PaymentGateway::AMEX_TEST => '170034',
        \PaymentGateway::AXIS_PRODUCTION => '171033',
        \PaymentGateway::AXIS2_PRODUCTION => '171033',
        \PaymentGateway::AXIS_TEST => '171033',
        \PaymentGateway::HDFC_PRODUCTION => '170025',
        \PaymentGateway::HDFC_TEST => '170025',
        \PaymentGateway::HDFC2_PRODUCTION => '170025',
        \PaymentGateway::HDFC2_TEST => '170025',
        self::HDFC_UPI_PRODUCTION => '170025',
        self::HDFC_UPI_TEST => '170025',
        \PaymentGateway::PAYU_PRODUCTION_ID => '170058',
        \PaymentGateway::PAYU_TEST_ID => '170058',
        \PaymentGateway::ATOM_PRODUCTION => '170060',
        \PaymentGateway::ATOM_TEST => '170060',
        self::PAYTM_PRODUCTION => '170061',
        self::PAYTM_TEST => '170061',
        self::CCAVENUE_PRODUCTION => '170064',
        self::CCAVENUE_TEST => '170064',
    );

    /*
     * Voucher No Map for Accounting Reports
     */
    static $vcnodeMap = array(
        \PaymentGateway::AMEX_PRODUCTION => 'AM',
        \PaymentGateway::AMEX_TEST => 'AM',
        \PaymentGateway::AXIS_PRODUCTION => 'AX',
        \PaymentGateway::AXIS2_PRODUCTION => 'AX',
        \PaymentGateway::AXIS_TEST => 'AX',
        \PaymentGateway::HDFC_PRODUCTION => 'RU',
        \PaymentGateway::HDFC_TEST => 'RU',
        \PaymentGateway::HDFC2_PRODUCTION => 'HD',
        \PaymentGateway::HDFC2_TEST => 'HD',
        \PaymentGateway::PAYU_PRODUCTION_ID => 'PU',
        \PaymentGateway::PAYU_TEST_ID => 'PU',
        \PaymentGateway::ATOM_PRODUCTION => 'AT',
        \PaymentGateway::ATOM_TEST => 'AT',
        self::PAYTM_PRODUCTION => 'PT',
        self::PAYTM_TEST => 'PT',
        self::CCAVENUE_PRODUCTION => 'CC',
        self::CCAVENUE_TEST => 'CC',
        self::HDFC_UPI_PRODUCTION => 'HU',
        self::HDFC_UPI_TEST => 'HU',
    );
    /*
     * MAnual Capture payment gateways
     */
    static $manualCapturePG = [
        \PaymentGateway::AMEX_PRODUCTION,
        \PaymentGateway::AXIS_PRODUCTION,
//        \PaymentGateway::HDFC_PRODUCTION,
        \PaymentGateway::HDFC2_PRODUCTION
    ];

    /*
     * Auto Capture payment gateways
     */
    static $autoCapturePG = [\PaymentGateway::PAYU_PRODUCTION_ID, \PaymentGateway::ATOM_PRODUCTION, self::HDFC_PRODUCTION, self::CCAVENUE_PRODUCTION];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'payment_gateway';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            array('is_active', 'numerical', 'integerOnly' => true),
            array('note, merchant_id, salt, base_url, api_url', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, note, merchant_id, salt, base_url, is_active, api_url', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'payGateLogs' => array(self::HAS_MANY, 'PayGateLog', 'pg_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Name',
            'note' => 'Note',
            'merchant_id' => 'Merchant',
            'salt' => 'Salt',
            'base_url' => 'Base Url',
            'is_active' => 'Is Active',
            'api_url' => 'Api Url',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search() {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('note', $this->note, true);
        $criteria->compare('merchant_id', $this->merchant_id, true);
        $criteria->compare('salt', $this->salt, true);
        $criteria->compare('base_url', $this->base_url, true);
        $criteria->compare('is_active', $this->is_active);
        $criteria->compare('api_url', $this->api_url, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return PaymentGateway the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Refresh the transaction data with the payment provider
     * @param int $id PayGateLog transaction id
     * @return array With <b>error</b> or <b>message</b> elements to be JSON encoded
     */
    function refreshWithProvider($id) {
        if (!$this->is_active || empty($this->api_url)) {
            return ['error' => 'This payment provider is not active or do not have refresh capability'];
        }

        if (in_array($this->id, self::$payuIdList)) {   // PayU provider
            return $this->refreshWithPayu($id);
        }

        if (in_array($this->id, self::$techProcIdList)) {   // TechProcess provider
            return $this->refreshWithTechProc($id);
        }
        
        if (in_array($this->id, self::$hdfcIdList)) {   // HDFC provider
            return $this->refreshWithHdfc($id);
        }

        if (in_array($this->id, self::$zoozIdList)) {   // ZooZ provider
            return $this->refreshWithZooz($id);
        }

        if (in_array($this->id, self::$atomIdList)) {   // ATOM
            return $this->refreshWithAtom($id);
        }

        if (in_array($this->id, self::$hdfc2IdList)) {   // HDFC2
            return $this->refreshWithHdfc2($id);
        }

        if (in_array($this->id, self::$paytmIdList)) {   // Paytm
            return $this->refreshWithPaytm($id);
        }

        if (in_array($this->id, self::$ccavenueIdList)) {   // CCAvenue
            return $this->refreshWithCCAvenue($id);
        }
        if (in_array($this->id, self::$hdfcupiIdList)) {   // HDFCUPI
            return $this->refreshWithHDFCUpi($id);
        }
        return ['error' => 'This payment provider is not active or do not have refresh capability'];
    }

    /**
     * Refund the transaction
     * @param int $id PayGateLog transaction id
     * @return string To be shown to the useras a result of the operation
     */
    function refundWithProvider($id) {
        if (!$this->is_active || empty($this->api_url)) {
            return 'This payment provider is not active or do not have refund capability';
        }

        if (in_array($this->id, self::$payuIdList)) {   // PayU provider
            return $this->refundWithPayu($id);
        }

        if (in_array($this->id, self::$techProcIdList)) {   // TechProcess provider
            return $this->refundWithTechProc($id);
        }

        if (in_array($this->id, self::$amexIdList)) {   // AMEX provider
            return $this->refundWithAmex($id);
        }

        if (in_array($this->id, self::$hdfcIdList)) {   // HDFC provider
            return $this->refundWithHdfc($id);
        }

        if (in_array($this->id, self::$zoozIdList)) {   // ZooZ provider
            return $this->refundWithZooz($id);
        }

        if (in_array($this->id, self::$axisIdList)) {   // AXIS
            return $this->refundWithAxis($id);
        }

        if (in_array($this->id, self::$axis2IdList)) {   // AXIS
            return $this->refundWithAxis2($id);
        }

        if (in_array($this->id, self::$atomIdList)) {   // ATOM
            return $this->refundWithAtom($id);
        }

        if (in_array($this->id, self::$hdfc2IdList)) {   // HDFC2
            return $this->refundWithHdfc2($id);
        }
        if (in_array($this->id, self::$paytmIdList)) {   // PayTM
            return $this->refundWithPayTM($id);
        }
        if (in_array($this->id, self::$ccavenueIdList)) {   // CCAvenue
            return $this->refundWithCCAvenue($id);
        }
        if (in_array($this->id, self::$hdfcupiIdList)) {   // HDFCUPI
            return $this->refundWithHDFCUpi($id);
        }
        return 'This payment provider is not active or do not have refund capability';
    }

    /**
     * Capture the transaction
     * @param int $id Original PayGateLog transaction id
     * @return string To be shown to the users as result of the operation
     */
    function captureWithProvider($id) {
        if (!$this->is_active || empty($this->api_url)) {
            return ['error' => 'This payment provider is not active or do not have capture capability'];
        }

        if (in_array($this->id, self::$axisIdList)) {   // AXIS
            return $this->captureAxis(\PayGateLog::createCaptureRecord($id));
        }

        if (in_array($this->id, self::$axis2IdList)) {   // AXIS2
            return $this->captureAxis2(\PayGateLog::createCaptureRecord($id));
        }

        if (in_array($this->id, self::$amexIdList)) {   // AMEX provider
            return $this->captureAmex(\PayGateLog::createCaptureRecord($id));
        }
        /*
        if (in_array($this->id, self::$hdfcIdList)) {   // HDFC provider
            return $this->captureHdfc(\PayGateLog::createCaptureRecord($id));
        }
        */
        if (in_array($this->id, self::$zoozIdList)) {   // ZooZ provider
            return $this->captureZooz(\PayGateLog::createCaptureRecord($id));
        }

        if (in_array($this->id, self::$hdfc2IdList)) {   // HDFC2
            return $this->captureHdfc2(\PayGateLog::createCaptureRecord($id));
        }

        return ['error' => 'This payment provider is not active or do not have capture capability'];
    }

    function refundWithPayu($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        // sha512(key|command|var1|var2|var3|salt)
        $params = [
            'key' => $this->merchant_id,
            'command' => 'cancel_refund_transaction',
            'var1' => $payGateLog->token,
        ];
        $hashInput = '';
        foreach ($params as $value) {
            $hashInput .= $value . '|';
        }
        $hashInput .= $this->salt;
        $params['hash'] = strtolower(hash('sha512', $hashInput));
        $params['var2'] = $id + ($this->id === self::PAYU_TEST_ID ? 33333 : 0);
        $params['var3'] = $payGateLog->amount;
//        \Utils::dbgYiiLog($params);
//        \Utils::dbgYiiLog($hashInput);
        $res = Utils::curl($this->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            return $res['error'];
        }
        $res = json_decode($res['result']);
//        \Utils::dbgYiiLog($res);
        if (empty($res->status)) {    // PayU error
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->update(['status_id']);
            return $res->msg;
        }
//        $res = $res->transaction_details->$params['var1'];
        $payGateLog->raw_response = json_encode($res);
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $res->bank_ref_num;
        $payGateLog->unmapped_status = $res->msg;
        $payGateLog->request_id = $res->request_id;
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();
        $payment = $payGateLog->registerNewPayment(TransferType::FUND_RECALL, "Refund with PayU, Bank reference: $payGateLog->bank_ref");
        return 'Refund succesful';
    }

    function amexHashCalculation(array $params) {
        ksort($params);
        $params['vpc_SecureHash'] = strtoupper(md5($this->salt . implode('', $params)));
        return $params;
    }

    /**
     * Encode the parameters using SHA256 HMAC. The code is added as <b>SecureHash</b> parameter
     * @param array $params Parameter to be encoded
     */
    function axisHashCalculation(array &$params) {
        ksort($params);
        $params['SecureHash'] = strtoupper(hash('sha256', $this->salt . implode('', $params), false));
    }

   /**
     * Encode the parameters using SHA256 HMAC. The code is added as <b>SecureHash</b> parameter
     * @param array $params Parameter to be encoded
     */
    function axis2HashCalculation(array &$params) {
        ksort($params);
        $params['vpc_SecureHash'] = strtoupper(hash_hmac('SHA256', urldecode(http_build_query($params)), pack('H*', $this->salt), false));
        $params['vpc_SecureHashType'] = 'SHA256';
    }    
    /**
     * Encode the parameters using SHA256 HMAC. The code is added as <b>vpc_SecureHash</b> attribute
     * New attribute <b>vpc_SecureHashType</b> is added
     * @param array $params Parameter to be encoded
     */
    function hdfc256HashCalculation(array &$params) {
        ksort($params);
//        if (YII_DEBUG) {
//            \Utils::dbgYiiLog($params);
//            \Utils::dbgYiiLog(['text' => http_build_query($params)]);
//        }
        $params['vpc_SecureHash'] = strtoupper(hash_hmac('SHA256', urldecode(http_build_query($params)), pack('H*', $this->salt), false));
        $params['vpc_SecureHashType'] = 'SHA256';
    }

    function captureAxis($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        $params = [
            'vpc_Command' => 'capture',
            'vpc_AccessCode' => $this->enc_key,
            'vpc_Merchant' => $this->merchant_id,
            'vpc_MerchTxnRef' => $payGateLog->hash_our, // Original transaction ID
            'vpc_ReceiptNo' => $payGateLog->token,
            'vpc_Amount' => ($payGateLog->amount + $payGateLog->convince_fee) * 100,
        ];
        // Calculate the hash
        $this->axisHashCalculation($params);
        $payGateLog->hash_our = $params['SecureHash'];
        $payGateLog->update(['hash_our']);

        $res = Utils::curl($this->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            return ['error' => $res['error']];
        }
        parse_str($res['result'], $result);
        $payGateLog->addRawResponse('Capture', $result);
        $payGateLog->reason = html_entity_decode($result['vpc_Message']);
        if (!isset($result['vpc_TxnResponseCode']) || $result['vpc_TxnResponseCode'] != "0") {    // Error
//            \Utils::dbgYiiLog($params);
//            \Utils::dbgYiiLog($result);
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->unmapped_status = $result['vpc_Message'];
            $payGateLog->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return ['error' => $payGateLog->reason];
        }
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $result['vpc_ReceiptNo'];
        $payGateLog->request_id = $result['vpc_TransactionNo'];
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();
        $payGateLog->addCaptureCartNote();
        return ['message' => 'The transaction is captured successfully'];
    }

    
   function captureAxis2($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        $params = [
            'vpc_Version' => 1,
            'vpc_Command' => 'capture',
            'vpc_User' => $this->username,
            'vpc_Password' => $this->password,
            'vpc_AccessCode' => $this->enc_key,
            'vpc_Merchant' => $this->merchant_id,
            'vpc_MerchTxnRef' => $payGateLog->hash_our, // Original transaction ID
            'vpc_TransNo' => $payGateLog->token,
            'vpc_Amount' => ($payGateLog->amount + $payGateLog->convince_fee) * 100,
        ];
        // Calculate the hash
        $this->axis2HashCalculation($params);
        $payGateLog->hash_our = $params['vpc_SecureHash'];
        $payGateLog->update(['hash_our']);

        $res = Utils::curl($this->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            return ['error' => $res['error']];
        }
        parse_str($res['result'], $result);
        $payGateLog->addRawResponse('Capture', $result);
        $payGateLog->reason = html_entity_decode($result['vpc_Message']);
        if (!isset($result['vpc_TxnResponseCode']) || $result['vpc_TxnResponseCode'] != "0") {    // Error
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->unmapped_status = $result['vpc_Message'];
            $payGateLog->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return ['error' => $payGateLog->reason];
        }
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $result['vpc_ReceiptNo'];
        $payGateLog->request_id = $result['vpc_TransactionNo'];
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();
        $payGateLog->addCaptureCartNote();
        return ['message' => 'The transaction is captured successfully'];
    }

    function captureHdfc($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $hdfc = new application\components\PGs\HDFC\FssPg($payGateLog, new \Cc);
        return $hdfc->capture();
    }

    function captureHdfc2($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $pgClass = new application\components\PGs\HDFC2\Pg($payGateLog);
        return $pgClass->capture();
    }

    function captureZooz($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $zooz = new application\components\PGs\Zooz\Zooz($payGateLog);
        return $zooz->capture();
    }

    function captureAmex($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        $params = [
            'vpc_Version' => 1,
            'vpc_AccessCode' => $this->enc_key,
            'vpc_MerchTxnRef' => $payGateLog->hash_our, // We temporary store the ID of the refunded transaction here
            'vpc_Merchant' => $this->merchant_id,
            'vpc_TransNo' => $payGateLog->token,
            'vpc_User' => $this->username,
            'vpc_Password' => $this->password,
            'vpc_Command' => 'capture',
            'vpc_Amount' => ($payGateLog->amount + $payGateLog->convince_fee) * 100,
            'vpc_Currency' => 'INR'
        ];
        // Calculate the hash
        $params = $this->amexHashCalculation($params);
        $payGateLog->hash_our = $params['vpc_SecureHash'];
        $payGateLog->update(['hash_our']);

        $res = Utils::curl($this->api_url, $params);
//        \Utils::dbgYiiLog($res);
        if (!empty($res['error'])) {    // Curl error
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->reason = html_entity_decode($res['error']);
            $payGateLog->update(['status_id', 'reason']);
            return ['error' => $res['error']];
        }
        parse_str($res['result'], $result);
        $payGateLog->addRawResponse('Capture', $result);
        $payGateLog->reason = html_entity_decode($result['vpc_Message']);
        if (!isset($result['vpc_TxnResponseCode']) || $result['vpc_TxnResponseCode'] != "0") {    // Error
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->unmapped_status = $result['vpc_Message'];
            $payGateLog->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return ['error' => $payGateLog->reason];
        }
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $result['vpc_ReceiptNo'];
        $payGateLog->request_id = $result['vpc_TransactionNo'];
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();
        $payGateLog->addCaptureCartNote();
        return ['message' => 'The transaction is captured successfully'];
    }

    function refundWithHdfc($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $hdfc = new application\components\PGs\HDFC\FssPg($payGateLog, new \Cc);
        return $hdfc->refund();
    }

    function refundWithAtom($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $pgComponent = new application\components\PGs\Atom\Paynetz($payGateLog);
        return $pgComponent->refund();
    }

    function refundWithHdfc2($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $pgComponent = new application\components\PGs\HDFC2\Pg($payGateLog);
        return $pgComponent->refund();
    }

    function refundWithZooz($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $zooz = new application\components\PGs\Zooz\Zooz($payGateLog);
        return $zooz->refund();
    }

    function refundWithAmex($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        $params = [
            'vpc_Version' => 1,
            'vpc_AccessCode' => $this->enc_key,
            'vpc_MerchTxnRef' => $payGateLog->hash_our, // We temporary store the ID of the refunded transaction here
            'vpc_Merchant' => $this->merchant_id,
            'vpc_TransNo' => $payGateLog->token,
            'vpc_User' => $this->username,
            'vpc_Password' => $this->password,
            'vpc_Command' => 'refund',
            'vpc_Amount' => $payGateLog->amount * 100,
            'vpc_Currency' => 'INR'
        ];
        // Calculate the hash
        $params = $this->amexHashCalculation($params);
        $payGateLog->hash_our = $params['vpc_SecureHash'];
        $payGateLog->update(['hash_our']);

        $res = Utils::curl($this->api_url, $params);
//        \Utils::dbgYiiLog($res);
        if (!empty($res['error'])) {    // Curl error
            $payGateLog->reason = html_entity_decode($res['error']);
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->update(['reason', 'status_id']);
            return $res['error'];
        }
        parse_str($res['result'], $result);
        $payGateLog->addRawResponse('Refund', $result);
        $payGateLog->reason = html_entity_decode($result['vpc_Message']);
        if ($result['vpc_TxnResponseCode'] != "0") {    // Error
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->unmapped_status = $result['vpc_Message'];
            $payGateLog->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return $payGateLog->reason;
        }
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $result['vpc_ReceiptNo'];
        $payGateLog->request_id = $result['vpc_TransactionNo'];
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();
        $payment = $payGateLog->registerNewPayment(TransferType::FUND_RECALL, "Refund with AMEX, Bank reference: $payGateLog->bank_ref");
        return 'Refund succesful';
    }

    function refundWithAxis($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        $params = [
            'vpc_Command' => 'refund',
            'vpc_AccessCode' => $this->enc_key,
            'vpc_Merchant' => $this->merchant_id,
            'vpc_MerchTxnRef' => $payGateLog->hash_our, // Original transaction ID
            'vpc_ReceiptNo' => $payGateLog->token,
            'vpc_Amount' => $payGateLog->amount * 100,
        ];
        // Calculate the hash
        $this->axisHashCalculation($params);
        $payGateLog->hash_our = $params['SecureHash'];
        $payGateLog->update(['hash_our']);

        $res = Utils::curl($this->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            $payGateLog->reason = html_entity_decode($res['error']);
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->update(['reason', 'status_id']);
            return $res['error'];
        }
        parse_str($res['result'], $result);
        $payGateLog->addRawResponse('Refund', $result);
        $payGateLog->reason = html_entity_decode($result['vpc_Message']);
        if ($result['vpc_TxnResponseCode'] != "0") {    // Error
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->unmapped_status = $result['vpc_Message'];
            $payGateLog->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return $payGateLog->reason;
        }
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $result['vpc_ReceiptNo'];
        $payGateLog->request_id = $result['vpc_TransactionNo'];
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();
        $payGateLog->registerNewPayment(TransferType::FUND_RECALL, "Refund with AXIS, Bank reference: $payGateLog->bank_ref");
        return 'Refund succesful';
    }

    function refundWithAxis2($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        $params = [
            'vpc_Version' => 1,
            'vpc_Command' => 'refund',
            'vpc_AccessCode' => $this->enc_key,
            'vpc_Merchant' => $this->merchant_id,
            'vpc_MerchTxnRef' => $payGateLog->hash_our, // Original transaction ID
            'vpc_Amount' => $payGateLog->amount * 100,
            'vpc_User' => $this->username,
            'vpc_Password' => $this->password,
            'vpc_TransNo' => $payGateLog->token,
        ];
        // Calculate the hash
        $this->axis2HashCalculation($params);
        $payGateLog->hash_our = $params['vpc_SecureHash'];
        $payGateLog->update(['hash_our']);

        $res = Utils::curl($this->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            $payGateLog->reason = html_entity_decode($res['error']);
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->update(['reason', 'status_id']);
            return $res['error'];
        }
        parse_str($res['result'], $result);
        $payGateLog->addRawResponse('Refund', $result);
        $payGateLog->reason = html_entity_decode($result['vpc_Message']);
        if ($result['vpc_TxnResponseCode'] != "0") {    // Error
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->unmapped_status = $result['vpc_Message'];
            $payGateLog->update(['status_id', 'reason', 'unmapped_status', 'raw_response']);
            return $payGateLog->reason;
        }
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $result['vpc_ReceiptNo'];
        $payGateLog->request_id = $result['vpc_TransactionNo'];
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();
        $payGateLog->registerNewPayment(TransferType::FUND_RECALL, "Refund with AXIS2, Bank reference: $payGateLog->bank_ref");
        return 'Refund succesful';
    }    
    
    function refundWithTechProc($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */

        $techProc = new \application\components\TechProcess\TechProcess('R', $payGateLog->amount, $id, $this->id);
        $techProc->createPayload();
//        \Utils::dbgYiiLog($techProc->request);
        $res = $techProc->sendRequest();
//        \Utils::dbgYiiLog($res);
        if (substr($res, 0, 10) !== 'txn_status') {
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->update(['status_id']);
            return $res;
        }
        $res = \application\components\TechProcess\TechProcess::strToArr($res);
        if (empty($res['txn_status']) || $res['txn_status'] != '0400') {
            $payGateLog->status_id = \TrStatus::STATUS_FAILURE;
            $payGateLog->update(['status_id']);
            return $res['txn_err_msg'] ?: $res;
        }
        $payGateLog->raw_response = json_encode($res);
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = \application\components\TechProcess\TechProcess::$bankRefs[$res['tpsl_bank_cd']] ?: $res['tpsl_bank_cd'];
        $payGateLog->error = $res['txn_err_msg'];
        $payGateLog->unmapped_status = $res['txn_msg'];
//        $payGateLog->request_id = $res['tpsl_txn_id'];
        $payGateLog->request_id = $res['tpsl_rfnd_id'];
        $payGateLog->status_id = TrStatus::STATUS_SUCCESS;
        $payGateLog->update();

        // Register new payment
        $payGateLog->registerNewPayment(\TransferType::FUND_RECALL, "Refund TP Netbanking, Bank reference: $payGateLog->bank_ref");
        return 'The refund was successful!';
    }

    /**
     * Refresh PayU transaction
     * @param int $id The transaction ID
     * @return string
     */
    function refreshWithPayu($id) {
        // sha512(key|command|var1|salt)
        $params = [
            'key' => $this->merchant_id,
            'command' => 'verify_payment',
            'var1' => $id + ($this->id === self::PAYU_TEST_ID ? 33333 : 0),
        ];
        $hashInput = '';
        foreach ($params as $value) {
            $hashInput .= $value . '|';
        }
        $hashInput .= $this->salt;
        $params['hash'] = strtolower(hash('sha512', $hashInput));
        $res = Utils::curl($this->api_url, $params);
        if (!empty($res['error'])) {    // Curl error
            return ['error' => $res['error']];
        }
        $res = json_decode($res['result']);
        if ($res->status != 1) {    // PayU error
            return ['error' => $res->msg];
        }
//        \Utils::dbgYiiLog($res);
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        // Refreshing the PayGateLog data with the new info
        $res = $res->transaction_details->$params['var1'];
        $res->card_no = \Cc::ccMask($res->card_no);     // Create better mask than the PayU one
        $raw = json_decode($payGateLog->raw_response) ?: new \stdClass;
        $dateAtom = date('Y-m-d\TH:i:s');
        isset($raw->refresh) or $raw->refresh = new \stdClass;
        $raw->refresh->$dateAtom = $res;
        $payGateLog->raw_response = json_encode($raw);
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = $res->bank_ref_num;
        $payGateLog->hash_response = isset($res->hash) ? $res->hash : null;
        $payGateLog->unmapped_status = $res->unmappedstatus;
        $payGateLog->request_id = $res->mihpayid;
        $payGateLog->pg_type = $res->mode . ':' . $res->PG_TYPE;
        $oldStatus = $payGateLog->status_id;
        $payGateLog->status_id = $res->status == "success" ? TrStatus::STATUS_SUCCESS : TrStatus::STATUS_FAILURE;
        $payGateLog->update();
        if ($oldStatus === TrStatus::STATUS_PENDING && $payGateLog->status_id === TrStatus::STATUS_SUCCESS) {
            // Register new payment
            $payment = $payGateLog->registerNewPayment(TransferType::CC_DEPOSIT, "Bank code: $payGateLog->pg_type , Bank reference: $payGateLog->bank_ref");
            Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            return [
                'message' => "Congratulations the payment was successful!",
                'url' => "/payment/view/{$payment->id}"
            ];
        }
        return ['message' => 'Refresh succesful'];
    }

    /**
     * Refresh HDFC transaction
     * @param int $id The transaction ID
     * @return string
     */
    function refreshWithHdfc($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $hdfc = new application\components\PGs\HDFC\FssPg($payGateLog, new \Cc);
        return $hdfc->refresh();
    }

    /**
     * Refresh ATOM transaction
     * @param int $id The transaction ID
     * @return string
     */
    function refreshWithAtom($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $pgComponent = new application\components\PGs\Atom\Paynetz($payGateLog);
        return $pgComponent->refresh();
    }

    /**
     * Refresh HDFC2 transaction
     * @param int $id The transaction ID
     * @return string
     */
    function refreshWithHdfc2($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $pgComponent = new application\components\PGs\HDFC2\Pg($payGateLog);
        return $pgComponent->refresh();
    }

    function refreshWithZooz($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        $zooz = new application\components\PGs\Zooz\Zooz($payGateLog);
        return $zooz->refresh();
    }

    /**
     * Refresh TechProcess transaction
     * @param int $id The transaction ID
     * @return string
     */
    function refreshWithTechProc($id) {
        $techProc = new \application\components\TechProcess\TechProcess('S', null, $id, $this->id);
        $techProc->createPayload();
//        \Utils::dbgYiiLog($techProc->request);
        $res = $techProc->sendRequest();
//        \Utils::dbgYiiLog($res);
        if (substr($res, 0, 10) !== 'txn_status') {
            return ['error' => $res];
        }
        $res = \application\components\TechProcess\TechProcess::strToArr($res);
        if (empty($res['txn_status']) || $res['txn_status'] != '0300') {
            return ['error' => $res['txn_err_msg'] ?: $res];
        }
        $payGateLog = \PayGateLog::model()->findByPk($id);
        /* @var $payGateLog \PayGateLog */
        // Refreshing the PayGateLog data with the new info
        $raw = json_decode($payGateLog->raw_response) ?: new \stdClass;
        $dateAtom = date('Y-m-d\TH:i:s');
        isset($raw->refresh) or $raw->refresh = new \stdClass;
        $raw->refresh->$dateAtom = $res;
        $payGateLog->raw_response = json_encode($raw);
        $payGateLog->updated = date(DATETIME_FORMAT);
        $payGateLog->bank_ref = \application\components\TechProcess\TechProcess::$bankRefs[$res['tpsl_bank_cd']] ?: $res['tpsl_bank_cd'];
        $payGateLog->error = $res['txn_err_msg'];
        $payGateLog->hash_response = isset($res['hash']) ? $res['hash'] : null;
        $payGateLog->unmapped_status = $res['txn_msg'];
        $payGateLog->request_id = $res['tpsl_txn_id'];

        $oldStatus = $payGateLog->status_id;
        $payGateLog->status_id = $res['txn_status'] == "0300" ? TrStatus::STATUS_SUCCESS : TrStatus::STATUS_FAILURE;
        $payGateLog->update();

        if ($oldStatus === TrStatus::STATUS_PENDING && $payGateLog->status_id === TrStatus::STATUS_SUCCESS) {
            // Register new payment
            $payment = $payGateLog->registerNewPayment(TransferType::NET_BANKING, "TP Netbanking, Bank reference: $payGateLog->bank_ref");
            Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            return [
                'message' => "Congratulations the payment was successful!",
                'url' => "/payment/view/{$payment->id}"
            ];
        }
        return ['message' => 'Refresh succesful'];
    }

    /**
     * Choose the default payment gateway
     * @param int $userTypeId The user type ID
     * @return int The Payment Gateway ID
     */
    static function chooseDefaultPg($userTypeId = null) {
        if ($userTypeId === null) {
            $userTypeId = \Utils::getActiveUserTypeId();
        }
        switch ($userTypeId) {
            case \UserType::clientB2C :
                return YII_DEBUG ? \PaymentGateway::HDFC_TEST : \PaymentGateway::HDFC_PRODUCTION;
            default:
                return YII_DEBUG ? \PaymentGateway::TECH_PROCESS_TEST : \PaymentGateway::TECH_PROCESS_PRODUCTION;
        }
    }

    /**
     * Can the payment gateway do a capture requests
     * @return boolean
     */
    function canCapture() {
        return in_array($this->id, self::$canCapture);
    }

    private function refundWithPayTM($id) {
        $payGateRefund = \PayGateLog::model()->findByPk($id);
        if ($payGateRefund !== null) {
            $payGateOrig = \PayGateLog::model()->findByPk($payGateRefund->hash_our);
        }
        if ($payGateOrig !== null) {
            return PayTM::refund($payGateOrig, $payGateRefund);
        }
        return 'This transaction can\'t be refunded';
    }

    private function refreshWithPaytm($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        return PayTM::refresh($payGateLog);
    }

    private function refreshWithCCAvenue($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        return CCAvenue::refresh($payGateLog);
    }

    private function refundWithCCAvenue($id) {
        $payGateRefund = \PayGateLog::model()->findByPk($id);
        if ($payGateRefund !== NULL) {
            $originalPgl = \PayGateLog::model()->findByPk($payGateRefund->hash_our);
        }
        if ($originalPgl !== NULL) {
            return CCAvenue::refund($originalPgl, $payGateRefund);
        }
        return 'This transaction can\'t be refunded';
    }

    private function refreshWithHDFCUpi($id) {
        $payGateLog = \PayGateLog::model()->findByPk($id);
        return UPI::refresh($payGateLog);
    }

    private function refundWithHDFCUpi($id) {
        $payGateRefund = \PayGateLog::model()->findByPk($id);
        if ($payGateRefund !== NULL) {
            $originalPgl = \PayGateLog::model()->findByPk($payGateRefund->hash_our);
        }
        if ($originalPgl !== NULL) {
            return UPI::refund($originalPgl, $payGateRefund);
        }
        return 'This transaction can\'t be refunded';
    }

}
