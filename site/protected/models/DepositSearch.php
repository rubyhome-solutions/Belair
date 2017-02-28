<?php

/**
 * This is the model class for table "deposit_search".
 *
 * The followings are the available columns in table 'deposit_search':
 * @property integer $id
 * @property integer $approver_id
 * @property integer $creator_id
 * @property integer $payment_id
 * @property integer $amount
 * @property string $date_made
 * @property string $reason
 * @property string $html
 * @property integer $status_id
 * @property integer $bank_id
 *
 * The followings are the available model relations:
 * @property Payment $payment
 * @property Users $creator
 * @property Users $approver
 */
class DepositSearch extends CActiveRecord {

    const STATUS_NEW = 1;
    const STATUS_APPROVED = 2;
    const STATUS_REJECTED = 3;

    static $bankDetails = [
        1 => 'CITI BANK',
        2 => 'AXIS BANK  CA',
        3 => 'HDFC BANK',
        4 => 'ICICI BANK',
        5 => 'STATE BANK OF INDIA',
        6 => 'YES BANK',
        7 => 'PUNJAB NATIONAL BANK',
        8 => 'KOTAK MAHINDRA BANK',
        10 => 'OTHER: Please describe'
    ];
    static $status = [
        self::STATUS_NEW => 'New',
        self::STATUS_APPROVED => 'Approved',
        self::STATUS_REJECTED => 'Rejected',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'deposit_search';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('creator_id, amount, date_made, bank_id', 'required'),
            array('approver_id, creator_id, payment_id, amount, status_id, bank_id', 'numerical', 'integerOnly' => true),
            array('html, reason', 'safe'),
            array('date_made', 'match', 'pattern' => '#^201[4-9]-\d{2}-\d{2}$#'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('approver_id, creator_id, amount, date_made, status_id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'payment' => array(self::BELONGS_TO, 'Payment', 'payment_id'),
            'creator' => array(self::BELONGS_TO, 'Users', 'creator_id'),
            'approver' => array(self::BELONGS_TO, 'Users', 'approver_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'approver_id' => 'Approver',
            'creator_id' => 'Creator',
            'payment_id' => 'Payment',
            'amount' => 'Amount',
            'date_made' => 'Payment was made',
            'reason' => 'Reason',
            'html' => 'Note',
            'status_id' => 'Status',
            'bank_id' => 'Bank',
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

//        $criteria->compare('approver_id', $this->approver_id);
        $criteria->compare('creator_id', $this->creator_id);
//        $criteria->compare('amount', $this->amount);
//        $criteria->compare('status_id', $this->status_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 'id DESC']
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return DepositSearch the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    function statusBadge() {
        switch ($this->status_id) {
            case self::STATUS_NEW :
                $class = 'info';
                break;
            case self::STATUS_APPROVED :
                $class = 'success';
                break;
            case self::STATUS_REJECTED :
                $class = 'important';
                break;
        }
        return "<span style=\"font-family: sans-serif;font-size:1.1em;\" class=\"badge badge-{$class}\">" . self::$status[$this->status_id] . "</span>";
    }

    function registerNewPayment() {
        // Create new payment
        $payment = new Payment;
        $payment->amount = $this->amount;
//        $payment->tds = round($this->amount * Utils::TDS_DEFAULT, 2);   // 10% tds
//        $payment->service_tax = round($this->amount * Utils::SERVICE_TAX, 2); // 4.95% service tax
        $userInfo = $this->creator->userInfo;
        $payment->old_balance = $userInfo->balance;
        $payment->new_balance = $payment->old_balance + $this->amount;
        $userInfo->balance = $payment->new_balance;
        $userInfo->update(['balance']);
        $payment->user_id = $this->creator_id;
        $payment->loged_user_id = $this->approver_id;
        $payment->transfer_type_id = \TransferType::CASH;
        $payment->note = "<a href='/depositSearch/admin'><b>Deposit №</b>{$this->id}</a><br>Found and approved by: <b>{$this->approver->name}</b><br>Bank reference: <b>" . self::$bankDetails[$this->bank_id] . "</b>";
        $payment->insert();
        $this->payment_id = $payment->id;
//        $this->update(['payment_id']);
    }

}
