<?php

/**
 * This is the model class for table "email_sms_log".
 *
 * The followings are the available columns in table 'email_sms_log':
 * @property integer $id
 * @property string $contact_type
 * @property string $sender
 * @property string $receiver
 * @property string $content
 * @property string $created
 * @property integer $air_cart_id
 * @property integer $content_type
 * @property integer $user_id
 * @property string $subject
 * @property integer $is_opened
 * @property string $opened_at
 * @property string $opened_ip
 *
 * The followings are the available model relations:
 * @property AirCart $airCart
 * @property Users $user
 */
class EmailSmsLog extends CActiveRecord {

    const CATEGORY_NEW_USER = 1;
    const CATEGORY_CONFIRMATION = 2;
    const CATEGORY_AMENDMENT_RESCHEDULE = 3;
    const CATEGORY_AMENDMENT_CANCELLATION = 4;
    const CATEGORY_AMENDMENT_MISC = 5;
    const CATEGORY_FORGOT_PASSWORD = 6;
    const CATEGORY_FARE_DIFF = 7;
    const CATEGORY_DOC = 8;
    const CATEGORY_MISC = 9;
    const CATEGORY_REFUND = 10;
    const CATEGORY_PAY_REQUEST = 11;
    const CATEGORY_PAY_RECEIVED = 12;
    const CATEGORY_FORGOT_PASS = 13;
    const CONTACT_TYPE_EMAIL = 1;
    const CONTACT_TYPE_SMS = 2;
    const SENDER_B2C = 1;
    const RECEIVER_B2C = 1;
    const EMAIL_OPENED = 1;
    const EMAIL_NOT_OPENED = 0;

    static $categoryMap = [
        self::CATEGORY_NEW_USER => 'NEW USER',
        self::CATEGORY_CONFIRMATION => 'CONFIRMATION',
        self::CATEGORY_AMENDMENT_RESCHEDULE => 'RESCHEDULE',
        self::CATEGORY_AMENDMENT_CANCELLATION => 'CANCELLATION',
        self::CATEGORY_AMENDMENT_MISC => 'AMENDMENT MISC',
        self::CATEGORY_AMENDMENT_RESCHEDULE => 'RESCHEDULE',
        self::CATEGORY_FORGOT_PASSWORD => 'FORGOT PASSWORD',
        self::CATEGORY_FARE_DIFF => 'FARE DIFF',
        self::CATEGORY_DOC => 'DOCUMENT',
        self::CATEGORY_MISC => 'OTHER',
        self::CATEGORY_REFUND => 'REFUND',
        self::CATEGORY_PAY_REQUEST => 'PAY REQUEST',
        self::CATEGORY_PAY_RECEIVED => 'PAY RECEIVED',
        self::CATEGORY_FORGOT_PASS => 'FORGOT PASSWORD',
    ];
    static $typeMap = [
        self::CONTACT_TYPE_EMAIL => 'EMAIL',
        self::CONTACT_TYPE_SMS => 'SMS',
    ];
    static $contactMap = [
        self::SENDER_B2C => 'CHEAPTICKET',
        self::RECEIVER_B2C => 'CHEAPTICKET',
    ];
    
    static $emailOpenedMap = [
        self::EMAIL_OPENED => 'Yes',
        self::EMAIL_NOT_OPENED => 'No',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'email_sms_log';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('contact_type', 'required'),
            array('air_cart_id, content_type, user_id, is_opened', 'numerical', 'integerOnly' => true),
            array('sender, receiver, content, created, opened_at, opened_ip', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, contact_type, sender, receiver, content, created, air_cart_id, content_type, user_id,subject, is_opened, opened_at, opened_ip', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airCart' => array(self::BELONGS_TO, 'AirCart', 'air_cart_id'),
            'user' => array(self::BELONGS_TO, 'Users', 'user_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'contact_type' => 'Contact Type',
            'sender' => 'Sender',
            'receiver' => 'Receiver',
            'content' => 'Content',
            'created' => 'Created',
            'air_cart_id' => 'Air Cart',
            'content_type' => 'Content Type',
            'user_id' => 'User',
            'is_opened' => 'Email Opened?',
            'opened_at' => 'Email Opened Time',
            'opened_ip' => 'Email Opened IP',
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
        $criteria->compare('contact_type', $this->contact_type, true);
        $criteria->compare('sender', $this->sender, true);
        $criteria->compare('receiver', $this->receiver, true);
        $criteria->compare('content', $this->content, true);
        $criteria->compare('created', $this->created, true);
        $criteria->compare('air_cart_id', $this->air_cart_id);
        $criteria->compare('content_type', $this->content_type);
        $criteria->compare('user_id', $this->user_id);
        if ($this->contact_type == self::CONTACT_TYPE_EMAIL) {
            $criteria->compare('is_opened', $this->is_opened);
            $criteria->compare('opened_at', $this->opened_at, true);
            $criteria->compare('opened_ip', $this->opened_ip, true);
        }
        $criteria->order = 'created DESC';
        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return EmailSmsLog the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public static function push_email_sms_log($sender, $receiver, $content, $subject = null, $contact_type = self::CONTACT_TYPE_EMAIL, $category = self::CATEGORY_MISC, $aircartid = null, $userid = null) {
        //  \Utils::dbgYiiLog('inside emaillog');
        $log = new \EmailSmsLog();
        $log->sender = $sender;
        $log->receiver = $receiver;
        $log->content = $content;
        $log->subject = $subject;
        $log->contact_type = $contact_type;
        $log->content_type = $category;
        $log->air_cart_id = $aircartid;
        $log->user_id = $userid;
        $log->insert();
        return $log->id;
    }

}
