<?php

use b2c\extWallet\paytmMethods;

/**
 * This is the model class for table "pay_gate_log".
 *
 * The followings are the available columns in table 'pay_gate_log':
 * @property integer $id
 * @property integer $status_id
 * @property integer $user_info_id
 * @property integer $action_id
 * @property integer $pg_id
 * @property integer $cc_id
 * @property string $hash_our
 * @property string $hash_response
 * @property string $pg_type
 * @property string $payment_mode
 * @property string $token
 * @property double $amount
 * @property double $convince_fee
 * @property double $discount
 * @property string $error
 * @property string $bank_ref
 * @property string $unmapped_status
 * @property string $raw_response
 * @property string $request_id
 * @property string $updated
 * @property string $note
 * @property string $user_ip
 * @property string $user_proxy
 * @property string $user_browser
 * @property string $reason
 * @property string $geoip
 * @property integer $air_cart_id
 * @property integer $status_3d
 * @property string $callback
 * @property integer $currency_id
 * @property integer $original_currency_id
 * @property double $original_amount
 * @property double $original_convince_fee
 * @property double $xchangeRate
 *
 * The followings are the available model relations:
 * @property Cc $cc
 * @property PaymentGateway $pg
 * @property TrAction $trAction
 * @property UserInfo $userInfo
 * @property TrStatus $trStatus
 * @property Payment $payment
 * @property AirCart $airCart
 * @property Fraud $fraud
 * @property Currency $currency
 * @property Currency $originalCurrency
 */
class PayGateLog extends CActiveRecord {

    const DEFAULT_CONVENIENCE_FEE = 0.025;
    const B2C_CONVENIENCE_FEE = 0;
    const DEFAULT_CONVENIENCE_FEE_TP = 20;
    const STOP_THE_AUTO_TICKET = 'STOP_THE_AUTO_TICKET';
    const NO3DS = '3DS = N';
    const FRAUD = 'FRAUD';
    const RELATED_BOOKINGS = 'RELATED FRAUD BOOKINGS';
    const TOO_MANY_CC_USED = 'TOO MANY INTERNATIONAL TRANSACTIONS';
    const DIRECT_BOOKING = 'DIRECT BOOKING';
    const MAX_PENDING_TIME = 1;

    /**
     * Flag set when the search should return only uncaptured transactions
     * @var bool
     */
    public $capturable = null;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'pay_gate_log';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('pg_id, user_info_id, amount', 'required'),
            array('status_id, user_info_id, action_id, pg_id, cc_id, air_cart_id, status_3d, currency_id, original_currency_id', 'numerical', 'integerOnly' => true),
            array('amount, convince_fee, discount, original_amount', 'numerical'),
            array('hash_our, hash_response, pg_type, payment_mode, error, bank_ref, unmapped_status, raw_response, updated, note, user_ip, user_proxy, user_browser, reason', 'safe'),
            array('note, reason, air_cart_id', 'default', 'setOnEmpty' => true, 'value' => null),
            array('convince_fee', 'default', 'setOnEmpty' => true, 'value' => 0),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, air_cart_id, status_id, user_info_id, action_id, pg_id, cc_id, hash_our, hash_response, pg_type, payment_mode, token, amount, convince_fee, discount, error, bank_ref, unmapped_status, raw_response, request_id, updated, note, user_ip, user_proxy, user_browser, fraud, capturable', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'cc' => array(self::BELONGS_TO, 'Cc', 'cc_id'),
            'pg' => array(self::BELONGS_TO, 'PaymentGateway', 'pg_id'),
            'trAction' => array(self::BELONGS_TO, 'TrAction', 'action_id'),
            'userInfo' => array(self::BELONGS_TO, 'UserInfo', 'user_info_id'),
            'trStatus' => array(self::BELONGS_TO, 'TrStatus', 'status_id'),
            'payment' => array(self::HAS_ONE, 'Payment', 'pay_gate_log_id'),
            'airCart' => [self::BELONGS_TO, 'AirCart', 'air_cart_id'],
            'fraud' => [self::HAS_ONE, 'Fraud', 'pay_gate_log_id'],
            'currency' => [self::BELONGS_TO, 'Currency', 'currency_id'],
            'originalCurrency' => [self::BELONGS_TO, 'Currency', 'original_currency_id'],
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'status_id' => 'Status',
            'user_info_id' => 'Client Info',
            'action_id' => 'Action',
            'pg_id' => 'Payment gateway',
            'cc_id' => 'Cc',
            'hash_our' => 'Hash Our',
            'hash_response' => 'Hash Response',
            'pg_type' => 'Pg Type',
            'payment_mode' => 'Payment Mode',
            'token' => 'Token',
            'amount' => 'Amount',
            'original_amount' => 'Original Amount',
            'convince_fee' => 'Convenince Fee',
            'original_convince_fee' => 'Original Convenince',
            'discount' => 'Discount',
            'error' => 'Error',
            'bank_ref' => 'Bank Ref',
            'unmapped_status' => 'Unmapped Status',
            'raw_response' => 'Raw Response',
            'request_id' => 'Request',
            'updated' => 'Updated',
            'note' => 'Staff Notes',
            'user_ip' => 'User Ip',
            'user_proxy' => 'User Proxy',
            'user_browser' => 'User Browser',
            'reason' => 'Reason',
            'geoip' => 'GeoIP',
            'air_cart_id' => 'AirCart',
            'status_3d' => '3DS',
            'currency_id' => 'Curency',
            'original_currency_id' => 'Original Curency',
            'user_info_id' => 'Client',
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
        $criteria = new CDbCriteria;
        $criteria->with = ['fraud', 'currency'];

        if ($this->capturable) {
            $criteria->compare('t.status_id', \TrStatus::STATUS_SUCCESS);
            $criteria->compare('t.action_id', \TrAction::ACTION_SENT);
            $criteria->addInCondition('t.pg_id', \PaymentGateway::$canCapture);
            $criteria->addCondition('t.request_id not in (select token from pay_gate_log where status_id=' .
                \TrStatus::STATUS_SUCCESS . ' AND action_id=' . \TrAction::ACTION_CAPTURE . ')');
        } else {
            $criteria->compare('t.id', $this->id);
            $criteria->compare('LOWER(note)', strtolower($this->note), true);
            $criteria->compare('LOWER(reason)', strtolower($this->reason), true);
            $criteria->compare('status_id', $this->status_id);
            $criteria->compare('action_id', $this->action_id);
            $criteria->compare('pg_id', $this->pg_id);
            $criteria->compare('t.cc_id', $this->cc_id);
            $criteria->compare('t.air_cart_id', $this->air_cart_id ? (int) $this->air_cart_id : null);
            $criteria->compare('t.status_3d', $this->status_3d);
            $criteria->compare('t.currency_id', $this->currency_id);
            if ($this->fraud === '0') {
                $criteria->addCondition('fraud.id IS NULL');
            } elseif ($this->fraud === '1') {
                $criteria->addCondition('fraud.id IS NOT NULL');
            }
        }

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC']
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return PayGateLog the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    function getPayuCategories($str) {
        if (isset($str)) {
            switch ($str) {
                case 'cashcard': return 'CASH';
                case 'creditcard': return 'CC';
                case 'debitcard': return 'DC';
                case 'netbanking': return 'NB';
                case 'emi': return 'EMI';
            }
        }
    }

    function checkPayuResponseHash() {
        $post = $_POST;
        if (empty($post['hash'])) {
            return false;
        }
        $hashSequence = 'status|||||||||||email|firstname|productinfo|amount|txnid|key';
        $hashVarsSeq = explode('|', $hashSequence);
        $hash_string = $this->pg->salt;
        foreach ($hashVarsSeq as $hash_var) {
            $hash_string .= '|' . (empty($post[$hash_var]) ? '' : $post[$hash_var]);
        }

        return $post['hash'] == strtolower(hash('sha512', $hash_string));
    }

    /**
     * Check if AXIS or AMEX response hash is correct.
     * @return boolean True if the hash matches
     */
    function checkSha256ResponseHash() {
        $post = $_GET;
        unset($post['id']);     // Our model ID
        if (empty($post['vpc_SecureHash'])) {
            return false;
        }
        $receivedHash = $post["vpc_SecureHash"];
        unset($post["vpc_SecureHash"]);
        ksort($post);
        $hashVarsSeq = $this->pg->salt . implode('', $post);

        return strtolower($receivedHash) == hash("sha256", $hashVarsSeq, false);
    }

    /**
     * Check if HDFC2 response using SHA256 hash is correct.
     * @return boolean True if the hash matches
     */
    function checkHDFC2Sha256ResponseHash() {
        $post = $_GET;
        unset($post['id']);     // Our model ID
        if (empty($post['vpc_SecureHash'])) {
            return false;
        }
        $receivedHash = $post["vpc_SecureHash"];
        unset($post["vpc_SecureHash"]);
        unset($post["vpc_SecureHashType"]);
        ksort($post);
        $hashVarsSeq = hash_hmac('SHA256', urldecode(http_build_query($post)), pack('H*', $this->pg->salt), false);

        return strtolower($receivedHash) == $hashVarsSeq;
    }

    /**
     * Check if AXIS or AMEX response hash is correct.
     * @return boolean True if the hash matches
     */
    function checkMd5ResponseHash() {
        $post = $_GET;
        unset($post['id']);     // Our model ID
        if (empty($post['vpc_SecureHash'])) {
            return false;
        }
        $receivedHash = $post["vpc_SecureHash"];
        unset($post["vpc_SecureHash"]);
        ksort($post);
        $hashVarsSeq = $this->pg->salt . implode('', $post);

        return strtolower($receivedHash) == md5($hashVarsSeq);
    }

    function createOurPayuHashAndParams() {
        if (!empty($_POST['net_banking'])) {
            $bankcode = $_POST['net_banking'];
        } elseif (!empty($_POST['emi_bank'])) {
            $bankcode = $_POST['emi_bank'];
        } elseif (!empty($_POST['cash_card'])) {
            $bankcode = $_POST['cash_card'];
        } else {
            $bankcode = empty($_POST['ibibo_code']) ? '' : $_POST['ibibo_code'];
        }
        $out = [
            'key' => $this->pg->merchant_id,
            'txnid' => $this->id + ($this->pg->id === PaymentGateway::PAYU_TEST_ID ? 33333 : 0),
            /* 'amount' => (float) ($this->amount + $this->convince_fee), */
        	'amount' => sprintf('%.2f', $this->amount + $this->convince_fee),
            'productinfo' => 'Airplane ticket',
            'firstname' => $this->userInfo->name,
            'email' => Utils::SUPPORT_EMAIL,
            'phone' => Utils::BELAIR_PHONE,
            'surl' => Yii::app()->createAbsoluteUrl('payGate/payU', ['id' => $this->id]),
            'furl' => Yii::app()->createAbsoluteUrl('payGate/payU', ['id' => $this->id]),
            'pg' => $this->payment_mode,
            'bankcode' => $bankcode,
        ];

        if ($this->cc_id) {
            $out += [
                'ccnum' => $this->cc->decode($this->cc->number),
                'ccname' => $this->cc->name,
                'ccvv' => \Yii::app()->request->getPost('cvv'), // We are not storing the CCV
                'ccexpmon' => substr($this->cc->exp_date, 5, 2),
                'ccexpyr' => substr($this->cc->exp_date, 0, 4),
            ];
        }

        // Calculate the hash
        // Hash Sequence
        $hashSequence = "key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10";
        $hashVarsSeq = explode('|', $hashSequence);
        $hash_string = '';
        foreach ($hashVarsSeq as $hash_var) {
            $hash_string .= (empty($out[$hash_var]) ? '' : $out[$hash_var]) . '|';
        }
//        Yii::log($hash_string);
        $hash_string .= $this->pg->salt;
//        Yii::log($hash_string);
        $this->hash_our = strtolower(hash('sha512', $hash_string));
        $this->payment_mode .= ":" . $bankcode;
        $out['hash'] = $this->hash_our;
        return $out;
    }

    function createOurAxisHashAndParams() {
        $out = [
//            'vpc_URL' => $this->pg->base_url,
            'vpc_Version' => 1, // Static AXIS parameter
            'vpc_MerchTxnRef' => $this->id,
            'vpc_MerchantId' => $this->pg->merchant_id,
            'vpc_Amount' => ($this->amount + $this->convince_fee) * 100, // Axis need 00 at the end
            'vpc_AccessCode' => $this->pg->enc_key, // Static AXIS parameter
            'vpc_ReturnURL' => Yii::app()->createAbsoluteUrl('payGate/axis', ['id' => $this->id]),
            'vpc_Command' => 'pay', // Static AXIS parameter
            'vpc_CardNum' => $this->cc->decode($this->cc->number),
            'vpc_CardExp' => substr($this->cc->exp_date, 2, 2) . substr($this->cc->exp_date, 5, 2),
            'vpc_CardSecurityCode' => \Yii::app()->request->getPost('cvv'), // We are not storing the CCV
        ];
        ksort($out);
//        \Utils::dbgYiiLog($out);
        // Calculate the hash
        $out['vpc_SecureHash'] = strtoupper(hash('sha256', $this->pg->salt . implode('', $out), false));
//        \Utils::dbgYiiLog($out);
        $this->hash_our = $out['vpc_SecureHash'];
        return $out;
    }

     function createOurAxis2HashAndParams() {
        $out = [
            'vpc_Version' => 1, // Static parameter
            'vpc_MerchTxnRef' => $this->id,
            'vpc_Merchant' => $this->pg->merchant_id,
            'vpc_Amount' => ($this->amount + $this->convince_fee) * 100, // Axis need 00 at the end
            'vpc_AccessCode' => $this->pg->enc_key, // Static AXIS parameter
            'vpc_ReturnURL' => Yii::app()->createAbsoluteUrl('payGate/axis', ['id' => $this->id]),
            'vpc_Command' => 'pay', // Static parameter
            'vpc_CardNum' => $this->cc->decode($this->cc->number),
            'vpc_CardExp' => substr($this->cc->exp_date, 2, 2) . substr($this->cc->exp_date, 5, 2),
            'vpc_CardSecurityCode' => \Yii::app()->request->getPost('cvv'), // We are not storing the CCV
            'vpc_Gateway' => 'ssl',
            'vpc_Card' => \CcType::$ccTypeIdToAxisName[$this->cc->type_id],
        ];
        $this->pg->axis2HashCalculation($out);
        $this->hash_our = $out['vpc_SecureHash'];
        return $out;
    }   
    
    function createOurAmexHashAndParams() {
        $out = [
            'vpc_Version' => 1, // Static AMEX parameter
            'vpc_MerchTxnRef' => $this->id,
            'vpc_OrderInfo' => $this->id,
            'vpc_Locale' => 'en',
            'vpc_Card' => 'Amex',
            'vpc_Gateway' => 'ssl',
            'vpc_Merchant' => $this->pg->merchant_id,
            'vpc_Amount' => ($this->amount + $this->convince_fee) * 100, // Axis need 00 at the end
            'vpc_AccessCode' => $this->pg->enc_key,
            'vpc_ReturnURL' => Yii::app()->createAbsoluteUrl('payGate/amex', ['id' => $this->id]),
            'vpc_Command' => 'pay', // Static AMEX parameter
            'vpc_CardNum' => $this->cc->decode($this->cc->number),
            'vpc_CardExp' => substr($this->cc->exp_date, 2, 2) . substr($this->cc->exp_date, 5, 2),
            'vpc_CardSecurityCode' => \Yii::app()->request->getPost('cvv'), // We are not storing the CCV
        ];
        ksort($out);
        // Calculate the hash
        $out['vpc_SecureHash'] = $this->pg->salt . implode('', $out);
        $out['vpc_SecureHash'] = strtoupper(md5($out['vpc_SecureHash']));
        $this->hash_our = $out['vpc_SecureHash'];
        return $out;
    }

    /**
     * Calculate the convenience fees
     * @param int $amount The amount of the transaction
     */
    static function convenienceFeeB2C($conv_amount) {
        return (double)$conv_amount;
        /*
         * Below code no longer needed as convenience fee logic has been changed
         */
        /*
        $out = round($conv_amount * self::B2C_CONVENIENCE_FEE);
        if ($out > 200) {
            $out = 200;
        }
//        elseif ($out < 150) {
//            $out = 150;
//        }
        return $out;
         * 
         */
    }

    static function convenienceFeeTP() {
        return self::DEFAULT_CONVENIENCE_FEE_TP;
    }

    function convenienceFee() {
        if (empty($this->user_info_id)) {
            return 0;
        }
        switch ($this->userInfo->user_type_id) {
            case UserType::clientB2C :
                return self::convenienceFeeB2C($this->convince_fee);
                break;
            case UserType::corporateB2E :
            case UserType::agentDirect :
            case UserType::agentUnderDistributor :
            case UserType::distributor :
                if (in_array($this->pg_id, \PaymentGateway::$techProcIdList)) {
                    return self::convenienceFeeTP();
                } else {
                    return self::convenienceFeeB2C($this->amount);
                }
                break;

            default:
                return 0;
        }
    }

    /**
     * Register new payment
     * @param int $paymentType The type of the payment
     * @param string $note Note for the new payment
     * @return \Payment The newly created payment object
     */
    function registerNewPayment($paymentType, $note = '') {
        // Create new payment
        $payment = new Payment;
        $payment->pay_gate_log_id = $this->id;
        $userInfo = $this->userInfo;
        // Currency conversion to user accounting currency
        if ($userInfo->currency_id === $this->currency_id) {
            $payment->amount = $this->amount + $this->convince_fee;
            $payment->xchange_rate = 1;
        } else {
            $payment->amount = $this->currency->xChange($this->amount, $userInfo->currency_id);
            $payment->xchange_rate = $payment->amount / $this->amount;
        }
        $payment->currency_id = $this->currency_id;
//        $payment->tds = round($payment->amount * Utils::TDS_DEFAULT, 2);   // 10% tds
//        $payment->service_tax = round($payment->amount * Utils::SERVICE_TAX, 2); // 4.95% service tax
        $payment->old_balance = $userInfo->balance;
        if ($paymentType === \TransferType::FUND_RECALL) {  // Substract the amount
            $payment->new_balance = $payment->old_balance - $payment->amount;
        } else {    // Add the amount
            $payment->new_balance = $payment->old_balance + $payment->amount;
            // Send payment confirmation email
            // $this->sendPaymentReceivedEmail();
        }
        $userInfo->balance = $payment->new_balance;
//            if ($userInfo->one_time_limit == 1 && $userInfo->balance < 0 && $payment->amount > 0) { // Fix the credit limit in case of one time
//                $userInfo->credit_limit = $userInfo->credit_limit + $userInfo->balance;
//                if ($userInfo->credit_limit < 0) {
//                    $userInfo->credit_limit = 0;
//                }
//            }
        $userInfo->update(['balance']);
        $loggedUser = \Utils::getLoggedUserId();
        $activeUser = \Utils::getActiveUserId();
        if (Authorization::getIsStaffLogged()) {
            $payment->user_id = $userInfo->users[0]->id;
        } else {
            $payment->user_id = $activeUser ? : $userInfo->users[0]->id;
        }
        $payment->loged_user_id = $loggedUser ? : $userInfo->users[0]->id;
        $payment->transfer_type_id = $paymentType;
        $payment->note = $note;
        $payment->air_cart_id = $this->air_cart_id;
        $payment->insert();
        if (strpos($this->note, 'price Difference') !== false) {
            $payment->sendPaymentReceivedEmail();
            if ($payment->air_cart_id) {
                \CartStatusLog::push_cart_status_log($payment->air_cart_id, $payment->airCart->booking_status_id, \CartStatus::CART_STATUS_FARE_DIFF_RECEIVED);
            }
        }
        return $payment;
    }

    function processTpRequestT($bank) {
        $techProc = new \application\components\TechProcess\TechProcess('T', ($this->amount + $this->convince_fee), $this->id, $this->pg_id, $bank);
        $techProc->createPayload();
        $res = $techProc->sendRequest();
        return $res->getTransactionTokenReturn;
    }

    /**
     * Set the basic model parameters like:<ul>
     * <li>User agent
     * <li>Proxy
     * <li>User IP
     * <li>GeoIP info
     * <li>Updated timestamp
     */
    function setBasics() {
        $this->user_browser = Yii::app()->request->getUserAgent();
        $realIp = Utils::getProxyIp();
        if ($realIp !== null) {
            $this->user_proxy = Yii::app()->request->getUserHostAddress();
            $this->user_ip = $realIp;
        } else {
            $this->user_ip = Yii::app()->request->getUserHostAddress();
        }
        // GeoIp info
        $this->geoip = \Utils::getGeoIpJsonString($this->user_ip);
        $this->updated = date(DATETIME_FORMAT);
    }

    function refundsSum() {
        $res = Yii::app()->db->createCommand()
            ->select('SUM(amount)')
            ->from('pay_gate_log')
            ->where('pg_id=:pg_id AND token=:token AND '
                . '(status_id=:status_id1 OR status_id=:status_id2) AND action_id=:action_id', [
                ':pg_id' => $this->pg_id,
                ':token' => $this->request_id,
                ':status_id1' => TrStatus::STATUS_SUCCESS,
                ':status_id2' => TrStatus::STATUS_PENDING,
                ':action_id' => TrAction::ACTION_REFUND
            ])
            ->queryScalar();

        return empty($res) ? 0 : $res;
    }

    function isRefundable() {
        if ($this->status_id === \TrStatus::STATUS_SUCCESS &&
            $this->action_id == \TrAction::ACTION_SENT) {
            return true;
        }
        return false;
    }

    function isCapturable() {
        $captured = $this->findByAttributes([
            'token' => $this->request_id,
            'action_id' => \TrAction::ACTION_CAPTURE,
            'status_id' => \TrStatus::STATUS_SUCCESS
        ]);
        if ($this->status_id === \TrStatus::STATUS_SUCCESS && !empty($this->cc_id) &&
            $this->action_id == \TrAction::ACTION_SENT && $this->pg->canCapture() &&
            empty($captured)) {
            return true;
        }
        return false;
    }

    /**
     * Create new record to capture transaction that is authenticated
     * @param int $id The ID of the transaction that need to be captured
     * @return int The ID of the new record
     */
    static function createCaptureRecord($id) {
        $model = \PayGateLog::model()->findByPk($id);
        if ($model === null) {
            return "The transaction #$id not found";
        }

        $model2 = new PayGateLog;
        $model2->amount = $model->amount + $model->convince_fee;
        $model2->currency_id = $model->currency_id;
        $model2->original_currency_id = $model->original_currency_id;
        $model2->original_amount = $model->original_amount;
        $model2->original_convince_fee = $model->original_convince_fee;
        $model2->air_cart_id = $model->air_cart_id;
        $model2->action_id = TrAction::ACTION_CAPTURE;
        $model2->status_id = TrStatus::STATUS_PENDING;
        $model2->pg_id = $model->pg_id;
        $model2->user_info_id = $model->user_info_id;
        $model2->token = $model->request_id;
        $model2->hash_our = $model->id;
        $model2->setBasics();
        $model2->insert();
        return $model2->id;
    }

    /**
     * Mark the transactions as fraud or not depending on the $flag
     * @param bool $flag When true the transactions are marked as fraud, when false the fraud mark is removed
     */
    function fraudSet($flag = true) {
        if ($flag === true && empty($this->fraud)) {   // Create the fraud if not existing
            // Abort if the CC is verified
            if (!empty($this->cc_id) && $this->cc->verification_status == 1) {
                return;
            }

            // Create new fraud record with this transaction
            $fraud = new \Fraud;
            $fraud->pay_gate_log_id = $this->id;
            $fraud->ip = $this->user_ip;
            $fraud->cc_id = $this->cc_id;
            $fraud->email = $this->userInfo->email;
            $fraud->phone = $this->userInfo->mobile;
            $fraud->insert();
        } elseif ($flag === false) {    // Delete all the frauds attached to this transaction
            \Fraud::model()->deleteAllByAttributes(['pay_gate_log_id' => $this->id]);
        }
    }

    /**
     * Format the 3DS status for admin view
     * @return string HTML formated status
     */
    function format3dStatus() {
        switch ($this->status_3d) {
            case \Cc::$status3DmapToId[\Cc::STATUS3D_Y]:
                $out = "<span class='badge badge-success'>Y</span>";
                break;
            case \Cc::$status3DmapToId[\Cc::STATUS3D_A]:
                $out = "<span class='badge badge-important'>A</span>";
                break;
            case null:
                $out = '';
                break;
            default:
                $out = "<span class='badge badge-important'>N</span>";  // Use N for all the rest
                break;
        }
        return $out;
    }

    /**
     * Format the Cc
     * @return string HTML formated
     */
    function formatCc() {
        if (empty($this->cc_id)) {
            return 'Not set';
        }
        return CHtml::link($this->cc->mask, "/cc/admin?Cc[id]=$this->cc_id", [
                'style' => $this->cc->verification_status ? 'color:green; font-weight:bold' : '',
                'target' => '_blank'
        ]);
    }

    /**
     * Format the GeoIP info
     * @return string HTML formated info
     */
    function formatGeoIpInfo() {
        $out = '';
        $geoip = json_decode($this->geoip);
        if (isset($geoip->countryName)) {
            $out .= $geoip->countryName;
        }
        if (isset($geoip->city)) {
            $out .= ", $geoip->city";
        }
        return $out;
    }

    /**
     * Add new response to the raw_response data collection
     * @param string $attributeName The new atribute name
     * @param array $data Data to be added to the raw_response collection
     */
    function addRawResponse($attributeName, $data) {
        $attributeName .= ' ' . date(DATETIME_FORMAT);
        $raw = json_decode($this->raw_response) ? : new \stdClass;
        $raw->$attributeName = $data;
        $this->raw_response = json_encode($raw);
        $this->update(['raw_response']);
    }

    /**
     * Add note to the cart that the transaction is captured
     */
    function addCaptureCartNote() {
        if (!empty($this->air_cart_id)) {
            $this->airCart->addNote("Transaction № {$this->id} Captured");
        }
    }

    function formatCurrencyBox() {
        $totalAmount = number_format($this->amount + $this->convince_fee, 2);
        return "Currency: <b>{$this->currency->name}</b><br>Amount: &nbsp;<b>$totalAmount</b>" .
            ($this->convince_fee ? "&nbsp<br>(<small>A convenience fee of $this->convince_fee is added</small>) " : '');
    }

    function getXchangeRate() {
        if (empty($this->original_amount)) {
            return 1;
        }
        return round($this->original_amount / $this->amount, 4) . " {$this->originalCurrency->code}/{$this->currency->code}";
    }

    function sendPaymentRequestSms() {
        if ($this->userInfo->user_type_id === \UserType::clientB2C) {
            $companyName = \Users::B2C_SMS_SENDER_NAME;
            $url = \Controller::B2C_BASE_URL . "/payGate/doPay/{$this->id}";
        } else {
            $companyName = $this->userInfo->name;
            $url = \Controller::B2B_BASE_URL . "/payGate/doPay/{$this->id}";
        }
        $content = "{$companyName}: Click the link to make payment of {$this->currency->code} " . ($this->amount + $this->convince_fee) . " $url";
        \Yii::app()->sms->send($this->userInfo->mobile, $content);
        \EmailSmsLog::push_email_sms_log('CheapTicket', $this->userInfo->mobile, $content, '', \EmailSmsLog::CONTACT_TYPE_SMS, \EmailSmsLog::CATEGORY_PAY_REQUEST, $this->air_cart_id);
    }

    function sendPaymentRequestEmail($user_email = null) {
        $getSite = $this->airCart->getSiteCreds();
        if ($this->air_cart_id) {
            $bookingId = "BookingId: {$this->air_cart_id}<br>";
        } else {
            $bookingId = "";
        }
        if ($this->userInfo->user_type_id === \UserType::clientB2C) {
            $email_content = "<html>" . $getSite['sitelogo'] . "<br><br><strong> Dear {$this->userInfo->name},</strong><br>
Please click the link to pay for the payment request.<br>
Amount: {$this->currency->code} " . ($this->amount + $this->convince_fee) . "<br>
$bookingId
Reason: {$this->reason}<br>
<b><a href='" . $getSite['Baseurl'] . "/payGate/doPay/{$this->id}'>Payment Request Link</a></b><br><br>
Thank You!<br>" . $this->userInfo->getEmailFooter($this->airCart->website_id) . "</html>";
            $subject = 'Payment Request from ' . $getSite['displaySiteName'];
            $senderEmail = $getSite['senderEmail'];
            $senderName = $getSite['senderName'];
        } else {
            $email_content = "<html>Dear {$this->userInfo->name},<br>
Please click the link to pay for the payment request.<br>
Amount: {$this->currency->code} " . ($this->amount + $this->convince_fee) . "<br>
$bookingId
Reason: {$this->reason}<br>
Click the  <b><a href='" . \Controller::B2B_BASE_URL .
                "/payGate/doPay/{$this->id}'>Payment Request Link</a></b><br><br>" . $this->userInfo->getEmailFooter() . "</html>";
            $subject = 'Payment Request from Belair';
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }
        if ($user_email === null) {
            $user_email = $this->userInfo->email;
        }

        \Utils::sendMail($user_email, $email_content, $subject, $senderEmail, $senderName);
        \EmailSmsLog::push_email_sms_log($senderEmail, $user_email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_PAY_REQUEST, $this->air_cart_id);
    }

    function sendPaymentReceivedEmail() {
        if ($this->air_cart_id) {
            $bookingId = " for BookingId: {$this->air_cart_id}<br>";
        } else {
            $bookingId = "<br>";
        }
        if ($this->userInfo->user_type_id === \UserType::clientB2C) {
            $email_content = "<html><img src='" . \Yii::app()->request->hostInfo . "/themes/B2C/dev/img/logo.png' width='183' height='38'  /><br><h2><b>Payment Confirmation!</b></h2><br>
<b>Dear {$this->userInfo->name},</b><br>
We have received your payment of {$this->currency->code} " . ($this->amount + $this->convince_fee) . $bookingId .
                "Thank You!<br>" . $this->userInfo->getEmailFooter() . "</html>";
            $senderEmail = \Users::B2C_SENDER_EMAIL;
            $senderName = \Users::B2C_SENDER_NAME;
        } else {
            $email_content = "<html><h2><b>Payment Confirmation!</b></h2><br>
<b>Dear {$this->userInfo->name},</b><br>
We have received your payment of {$this->currency->code} " . ($this->amount + $this->convince_fee) . $bookingId .
                "Thank You!<br><br>" . $this->userInfo->getEmailFooter() . "</html>";
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }

        $subject = 'Payment Confirmation';


        \Utils::sendMail($this->userInfo->email, $email_content, $subject, $senderEmail, $senderName);
        \EmailSmsLog::push_email_sms_log($senderEmail, $this->userInfo->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_PAY_RECEIVED, $this->air_cart_id);
    }

    /**
     * Set the auto ticket issue flag. Currently if PG is AXIS or AMEX and 3DS is not Y
     */
    function setAutoTicketIssueFlag() {
        $key = self::STOP_THE_AUTO_TICKET . ':' . $this->user_info_id;

        // Allow by default
        \Yii::app()->cache->delete($key);

        // Do we have to do extensive checks
        if (empty($this->cc_id) || $this->cc->verification_status == 0) {
            if ($this->isFraudByRelatedBookings()) {
                \Yii::app()->cache->set($key, self::RELATED_BOOKINGS, 1800);   // Fraud by related bookings
                return;
            }
            
            // No more checks needed if this is transaction without CC
            if (empty($this->cc_id)) {
                return;
            }
            
            // Extensive checks
            if (in_array($this->pg_id, \PaymentGateway::$extensiveFaudCheck) && !$this->cc->bin->domestic) {
                if ($this->status_3d != \Cc::$status3DmapToId[\Cc::STATUS3D_Y]) {
                    \Yii::app()->cache->set($key, self::NO3DS, 1800);   // No 3DS confirmation
                } elseif (isset($this->air_cart_id) && $this->airCart->client_source_id == \ClientSource::SOURCE_DIRECT) {
                    \Yii::app()->cache->set($key, self::DIRECT_BOOKING, 1800);   // Direct booking
//                \Utils::dbgYiiLog(self::DIRECT_BOOKING);
                } elseif ($this->tooManyInternationalCardsUsed()) {
                    \Yii::app()->cache->set($key, self::TOO_MANY_CC_USED, 1800);   // Too many CC used
                }
            }
        }
    }

    /**
     * Return auto issue flag
     * @return bool True if the ticket can be auto issued
     */
    static function autoIssueFlag() {
        $key = self::STOP_THE_AUTO_TICKET . ':' . \Utils::getActiveCompanyId();
        return \Yii::app()->cache->get($key) ? : true;
    }

    /**
     * Is the transaction fraud by related Bookings<br>
     * If it is fraud, then mark the transaction as fraud and mark the attached cart as fraud
     * @return boolean
     */
    function isFraudByRelatedBookings() {
        // Check for related transactions
        $criteria = new CDbCriteria;
        $criteria->compare('cc_id', $this->cc_id, false, 'OR');
        $criteria->compare('ip', $this->user_ip, false, 'OR');
        $criteria->compare('phone', $this->userInfo->mobile, false, 'OR');
        $criteria->compare('email', $this->userInfo->email, false, 'OR');
        if (!empty($criteria->condition) && \Fraud::model()->find($criteria) !== null) {
            $this->fraudSet(true);
            if (!empty($this->air_cart_id)) {
                $this->airCart->booking_status_id = \BookingStatus::STATUS_FRAUD;
                $this->airCart->update(['booking_status_id']);
                $this->airCart->addNote("Cart Auto Added to Fraud:: Related Transaction");
            }
            return true;
        }

        // Check for related bookings (carts)
        if (!empty($this->air_cart_id)) {
            foreach ($this->airCart->getRelatedBookings() as $airCart) {
                if ($airCart->booking_status_id === \BookingStatus::STATUS_FRAUD) {
                    $this->fraudSet(true);
                    $this->airCart->booking_status_id = \BookingStatus::STATUS_FRAUD;
                    $this->airCart->update(['booking_status_id']);
                    $this->airCart->addNote("Cart Auto Added to Fraud::Related Bookings");
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Check if there are too many transactions with international cards for this airCart
     * @return boolean True if the auto issue has to be disabled
     */
    function tooManyInternationalCardsUsed() {
        if ($this->air_cart_id) {
            $criteria = new CDbCriteria;
            $criteria->compare('air_cart_id', $this->air_cart_id);
            $criteria->addInCondition('pg_id', \PaymentGateway::$extensiveFaudCheck);
            return self::model()->count($criteria) > 2;
        }
        return false;
    }

    /**
     * Register external refund without any checks. To be used by balance clearance algorithm only!
     */
    function externalRefund($note = 'Outstanding balance clearance') {
        $model2 = new PayGateLog;
        $model2->amount = $this->amount;
        $model2->currency_id = $this->currency_id;
        $model2->original_amount = $this->original_amount;
        $model2->original_currency_id = $this->original_currency_id;
        $model2->original_convince_fee = $this->original_convince_fee;
        $model2->air_cart_id = $this->air_cart_id;
        $model2->note = $note;
        $model2->reason = $note;
        $model2->action_id = TrAction::ACTION_REFUND;
        $model2->status_id = TrStatus::STATUS_SUCCESS;
        $model2->pg_id = $this->pg_id;
        $model2->user_info_id = $this->user_info_id;
        $model2->token = $this->request_id;
        $model2->hash_our = $this->id;
        $model2->updated = date(DATETIME_FORMAT);
        $model2->insert();
        $model2->registerNewPayment(TransferType::FUND_RECALL, $note);
    }

    /**
     * Added by Satender K.
     * Purpose : To extract AmendmentGroupID from Fare Difference note
     * @return type
     */
    public function getAmemdmentGroupID() {
        if (empty($this->note)) {
            return 0;
        }
        $group = [];
        preg_match('/\d+/', $this->note, $group);
        if (!empty($group[0])) {
            return $group[0];
        }
        return 0;
    }
    
    public function createMobikwikParameters($data) {
    	$all = "'" . $data['mobile'] . "''" . $data['amount'] . "''" . $data['orderid'] . "''" . $data['returnUrl'] . "''" . $this->pg->merchant_id . "'";
    	$checksum = \Wallet::calculateMobikwikChecksum($this->pg->access_code, $all);
    	$out = [
    			'amount' => $data['amount'],
    			'cell' => $data['mobile'],
    			'orderid' => $data['orderid'],
    			'merchantname' => $this->pg->name,
    			'mid' => $this->pg->merchant_id,
    			'redirecturl' => $data['returnUrl'],
    			'checksum' => $checksum,
    	];
    	return $out;
    }
    /**
     * Added By Satender
     * Purpose : To track each response sent by PGs and user who have requested with datetime
     * @param type $response
     */
    public function setRawResponse($response = []) {
        $raw_response = json_decode($this->raw_response, true);
        $user = \Users::model()->findByPk(Utils::getLoggedUserId());
        $userName = empty($user) ? 'Admin' : $user->name .'('.$user->id.')';
        $raw_response[$userName . " " . date(DATETIME_FORMAT)] = $response;
        $this->raw_response = json_encode($raw_response);
    }
}
