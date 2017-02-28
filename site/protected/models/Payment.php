<?php

/**
 * This is the model class for table "payment".
 *
 * The followings are the available columns in table 'payment':
 * @property integer $id
 * @property integer $distributor_id
 * @property integer $loged_user_id
 * @property integer $transfer_type_id
 * @property integer $user_id
 * @property integer $currency_id
 * @property string $created
 * @property double $old_balance
 * @property double $amount
 * @property double $new_balance
 * @property double $tds
 * @property string $approved
 * @property double $markup
 * @property double $service_tax
 * @property double $commision
 * @property string $note
 * @property integer $pay_gate_log_id
 * @property integer $air_cart_id
 * @property double $xchange_rate The xchange rate is the relation accounting currency / payment or airCart currency
 * @property string $receipt_no
 *
 * The followings are the available model relations:
 * @property Amendment[] $amendments
 * @property UserInfo $distributor
 * @property Users $logedUser
 * @property TransferType $transferType
 * @property Users $user
 * @property Currency $currency
 * @property PayGateLog $payGateLog
 * @property DepositSearch $depositSearch
 * @property AirCart $airCart
 */
class Payment extends CActiveRecord {

   /**
     * Used for searching based on the company ID
     * @var int
     */
    public $activeCompanyId;

    /**
     * Used for searching based on the customer open balance
     * @var int
     */
    public $openBalance = 0;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'payment';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('loged_user_id, transfer_type_id, user_id', 'required'),
            array('distributor_id, loged_user_id, transfer_type_id, user_id, currency_id, air_cart_id', 'numerical', 'integerOnly' => true),
            array('old_balance, amount, new_balance, tds, markup, service_tax, commision', 'numerical'),
            array('approved, note', 'safe'),
            ['air_cart_id', 'default', 'setOnEmpty' => true, 'value' => null],
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, air_cart_id, distributor_id, transfer_type_id, user_id, old_balance, amount, new_balance, approved, note, activeCompanyId, openBalance', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
//            'airCarts' => array(self::HAS_MANY, 'AirCart', 'payment_id'),
            'amendments' => array(self::HAS_MANY, 'Amendment', 'payment_id'),
            'distributor' => array(self::BELONGS_TO, 'UserInfo', 'distributor_id'),
            'logedUser' => array(self::BELONGS_TO, 'Users', 'loged_user_id'),
            'transferType' => array(self::BELONGS_TO, 'TransferType', 'transfer_type_id'),
            'user' => array(self::BELONGS_TO, 'Users', 'user_id'),
            'currency' => array(self::BELONGS_TO, 'Currency', 'currency_id'),
            'payGateLog' => array(self::BELONGS_TO, 'PayGateLog', 'pay_gate_log_id'),
            'depositSearch' => array(self::HAS_ONE, 'DepositSearch', 'payment_id'),
            'airCart' => [self::BELONGS_TO, 'AirCart', 'air_cart_id'],
            'currency' => [self::BELONGS_TO, 'Currency', 'currency_id'],
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'distributor_id' => 'Distributor',
            'loged_user_id' => 'Loged User',
            'transfer_type_id' => 'Transfer Type',
            'user_id' => 'User',
            'currency_id' => 'Currency',
            'created' => 'Created',
            'old_balance' => 'Old Balance',
            'amount' => 'Amount',
            'new_balance' => 'New Balance',
            'tds' => 'Tds',
            'approved' => 'Approved',
            'markup' => 'Markup',
            'service_tax' => 'Service Tax',
            'commision' => 'Commision',
            'note' => 'Note',
            'air_cart_id' => 'AirCart',
            'xchange_rate' => 'xChange Rate',
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

        $criteria->with = 'user.userInfo';
        if (!empty($this->id)) {
            $criteria->compare('t.id', (int) $this->id);
        }
        if ($this->openBalance != 0) {
            $criteria->addCondition('"userInfo".balance>0');
        } 
        $criteria->compare('"userInfo".id', $this->activeCompanyId);
        $criteria->compare('t.transfer_type_id', $this->transfer_type_id);
        $criteria->compare('t.old_balance', $this->old_balance);
        $criteria->compare('t.amount', $this->amount);
        $criteria->compare('t.new_balance', $this->new_balance);
        $criteria->compare('t.air_cart_id', $this->air_cart_id);
        $criteria->compare('t.currency_id', $this->currency_id);
        $criteria->compare('t.note', $this->note, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
            'pagination' => ['pageSize' => 20]
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Payment the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public static function getPendingPaymentsForReceipts() {
        $payments = Payment::model()->findAll(array(
            'condition' => 'receipt_no IS NULL AND ( transfer_type_id=' . \TransferType::AC_DEPOSIT . ' OR '
            . 'transfer_type_id=' . \TransferType::CC_DEPOSIT . ' OR transfer_type_id=' . \TransferType::NET_BANKING . ' OR'
            . ' transfer_type_id=' . \TransferType::CASH . ' OR transfer_type_id=' . \TransferType::FUND_ALLOCATE . ' OR transfer_type_id=' . \TransferType::PROMO_REFERRED .')',
            'order' => 'id',            
            'limit' => '200'
        ));

//        \Utils::dbgYiiLog($payments);
        return $payments;
    }

    /*
     * Payment xml for accounting
     */

    public static function getPaymentXML() {
        $payments = Payment::getPendingPaymentsForReceipts();
        $xml = '';
        $xml.="<Payments>";
        foreach ($payments as $key => $payment) {
            $xml.="<Payment>";
            if ($payment->user->userInfo->user_type_id === \UserType::clientB2C) {
                $xml.="<ID>TXNC" . $payment->id . "</ID>";

                if (!empty($payment->air_cart_id)) {
                    $xml.="<CART_ID>INVC" . $payment->air_cart_id . "</CART_ID>";
                } else {
                    $xml.="<CART_ID></CART_ID>";
                }
            } else {
                $xml.="<ID>TXNB" . $payment->id . "</ID>";
                if (!empty($payment->air_cart_id)) {
                    $xml.="<CART_ID>INVB" . $payment->air_cart_id . "</CART_ID>";
                } else {
                    $xml.="<CART_ID></CART_ID>";
                }
            }
            $xml.="<CUSTOMER_NAME>" . $payment->user->name . "</CUSTOMER_NAME>";
            $xml.="<CUSTOMER_ID>" . $payment->user->id . "</CUSTOMER_ID>";
            $xml.="<CUSTOMER_EMAIL>" . $payment->user->email . "</CUSTOMER_EMAIL>";
            $xml.="<CUSTOMER_MOBILE>" . $payment->user->mobile . "</CUSTOMER_MOBILE>";
            $xml.="<USER_INFO_ID>" . $payment->user->user_info_id . "</USER_INFO_ID>";
            $xml.="<USER_INFO_NAME>" . $payment->user->userInfo->name . "</USER_INFO_NAME>";
            $xml.="<USER_INFO_EMAIL>" . $payment->user->userInfo->email . "</USER_INFO_EMAIL>";
            $xml.="<USER_INFO_MOBILE>" . $payment->user->userInfo->mobile . "</USER_INFO_MOBILE>";
            $xml.="<TRANSFER_TYPE>" . $payment->transferType->name . "</TRANSFER_TYPE>";
            $xml.="<AMOUNT>" . $payment->amount . "</AMOUNT>";
            $xml.="<CURRENCY>" . $payment->currency->code . "</CURRENCY>";
            $xml.="<CREATED>" . $payment->created . "</CREATED>";
            $xml.="<PG_ID>" . $payment->pay_gate_log_id . "</PG_ID>";
            if ($payment->pay_gate_log_id != null)
                $xml.="<PG_DETAILS>" . $payment->payGateLog->pg->name . "</PG_DETAILS>";
            else
                $xml.="<PG_DETAILS></PG_DETAILS>";

            $xml.="</Payment>";
        }
        $xml.="</Payments>";
        return $xml;
    }
    
    public function sendPaymentReceivedEmail() {
        if ($this->air_cart_id) {
            $bookingId = " for BookingId: {$this->air_cart_id}<br>";
        } else {
            $bookingId = "<br>";
        }
        if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
            $email_content = "<html><img src='". \Yii::app()->request->hostInfo. "/themes/B2C/dev/img/logo.png' width='183' height='38'  /><h2><b>Amendment Payment Confirmation!</b></h2><br>
<b>Received payment from {$this->user->userInfo->name},</b><br>
 {$this->currency->code} " . ($this->amount ) . $bookingId .
                    "Thank You!<br>" . $this->user->userInfo->getEmailFooter($this->airCart->website_id) . "</html>";
            $senderEmail = \Users::B2C_SENDER_EMAIL;
            $senderName = \Users::B2C_SENDER_NAME;
        } else {
            $email_content = "<html><img src='". \Yii::app()->request->hostInfo. "/themes/B2C/dev/img/logo.png' width='183' height='38'  /><h2><b>Amendment Payment Confirmation!</b></h2><br>
<b>Received payment from {$this->user->userInfo->name},</b><br>
 {$this->currency->code} " . ($this->amount ) . $bookingId .
                    "Thank You!<br><br>" . $this->user->userInfo->getEmailFooter() . "</html>";
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }

        $subject = 'Payment Confirmation';
        
       
        \Utils::sendMail($senderEmail, $email_content, $subject, $senderEmail, $senderName);
         \EmailSmsLog::push_email_sms_log($senderEmail, $senderEmail, $email_content,$subject, \EmailSmsLog::CONTACT_TYPE_EMAIL,\EmailSmsLog::CATEGORY_PAY_RECEIVED , $this->air_cart_id, $this->user_id);
       
    }

}
