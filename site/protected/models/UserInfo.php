<?php

/**
 * This is the model class for table "user_info".
 *
 * The followings are the available columns in table 'user_info':
 * @property integer $id
 * @property integer $currency_id
 * @property integer $user_type_id
 * @property integer $city_id
 * @property string $pan_name
 * @property string $pan_number
 * @property string $stn_number
 * @property string $name
 * @property string $email
 * @property string $mobile
 * @property double $balance
 * @property double $credit_limit
 * @property string $pincode
 * @property string $address
 * @property integer $rating
 * @property string $note
 * @property string $cc_email_list
 * @property string $from_to_email
 * @property integer $one_time_limit
 * @property string $customerCareInfo Return the combined info about the company with html tags
 * @property string $availability The sum of the balance and the credit limit (how much client can spend)
 * @property integer $commercial_plan_id
 * @property double $tds
 * @property double $xrate_commission
 *
 * The followings are the available model relations:
 * @property Users[] $users
 * @property Payment[] $distributorPayments
 * @property UserFile[] $userFiles
 * @property SubUsers[] $resellers
 * @property SubUsers $distributor
 * @property Cc[] $ccs
 * @property Traveler[] $travelers
 * @property City $city
 * @property UserType $userType
 * @property Currency $currency
 * @property CommercialPlan $commercialPlan
 * @property TourCode[] $tourCodes
 * @property PfCode[] $pfCodes
 * @property Cms[] $cms
 */
class UserInfo extends CActiveRecord {

    const ACTIVE_COMPANY_LOGO = 'activeLogo';
    const ACTIVE_COMPANY_PHONE = 'activePhone';
    const ACTIVE_COMPANY_FOOTER = 'activeFooter';
    const BELAIR_PHONE_HTML = 'B2B <i class="fa fa-phone fa-lg"></i> +91-120-4887700 &nbsp;<br>Corporate <i class="fa fa-phone fa-lg"></i> +91-011-42521000';
    const BELAIR_FOOTER_HTML = '<p>© Belair Travels &amp; Cargo P. Ltd - All Rights Reserved</p>';
    const B2C_USER_INFO_ID = 6398;
    const ATI_B2C_USER_INFO_ID = 164217;
    const F2G_B2C_USER_INFO_ID = 164216;
    const B2B_USER_INFO_ID = 6402;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'user_info';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('city_id, name, email, mobile', 'safe', 'on' => 'B2C, Staff, AutoReg'),
            array('city_id, name, email, mobile', 'required', 'except' => 'B2C, Staff, AutoReg'),
            array('email', 'unique', 'except' => 'B2C, Staff'),
            array('name', 'unique', 'except' => 'B2C'),
            array('email', 'email'),
            array('from_to_email', 'email'),
            array('mobile', 'CRegularExpressionValidator', 'pattern' => '/^[+]?[\d]+$/', 'message' => "Incorrect tel. number format."),
            array('name', 'CRegularExpressionValidator', 'pattern' => '/^[a-zA-Z0-9&\.\-\s\(\)]+$/', 'message' => "Incorrect symbol"),
            array('currency_id, user_type_id, city_id, rating, one_time_limit, commercial_plan_id', 'numerical', 'integerOnly' => true),
            array('user_type_id, tds', 'default', 'setOnEmpty' => true, 'value' => 10),
            array('currency_id', 'default', 'setOnEmpty' => true, 'value' => 1),
            array('credit_limit', 'default', 'setOnEmpty' => true, 'value' => 0),
            array('one_time_limit, xrate_commission', 'default', 'setOnEmpty' => true, 'value' => 1),
            ['tds, xrate_commission', 'numerical', 'min' => 0],
            array('credit_limit', 'numerical'),
            array('pan_name, pan_number, stn_number, name, pincode, address, note, cc_email_list, one_time_limit', 'safe'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return [
            'users' => array(self::HAS_MANY, 'Users', 'user_info_id'),
            'distributorPayments' => array(self::HAS_MANY, 'Payment', 'distributor_id'),
            'userFiles' => array(self::HAS_MANY, 'UserFile', 'user_info_id'),
            'resellers' => array(self::HAS_MANY, 'SubUsers', 'distributor_id'),
            'distributor' => array(self::HAS_ONE, 'SubUsers', 'reseller_id'),
            'ccs' => array(self::HAS_MANY, 'Cc', 'user_info_id'),
            'travelers' => array(self::HAS_MANY, 'Traveler', 'user_info_id'),
            'city' => array(self::BELONGS_TO, 'City', 'city_id'),
            'userType' => array(self::BELONGS_TO, 'UserType', 'user_type_id'),
            'currency' => array(self::BELONGS_TO, 'Currency', 'currency_id'),
            'commercialPlan' => array(self::BELONGS_TO, 'CommercialPlan', 'commercial_plan_id'),
            'tourCodes' => [self::HAS_MANY, 'TourCode', 'user_info_id'],
            'pfCodes' => [self::HAS_MANY, 'PfCode', 'user_info_id'],
            'cms' => [self::HAS_MANY, 'Cms', 'user_info_id'],
        ];
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'currency_id' => 'Currency',
            'user_type_id' => 'Partnership Type',
            'city_id' => 'City',
            'pan_name' => 'PAN Card Name',
            'pan_number' => 'PAN Number',
            'stn_number' => 'STN Number',
            'name' => 'Company Name',
            'email' => 'Company Email',
            'mobile' => 'Company Phone',
            'balance' => 'Balance',
            'credit_limit' => 'Limit',
            'pincode' => 'Pincode',
            'address' => 'Address',
            'note' => 'Comments',
            'from_to_email' => 'From & To email',
            'cc_email_list' => 'CC emails list (with commas)',
            'one_time_limit' => 'One time limit',
            'commercial_plan_id' => 'Commercial plan',
            'tds' => 'TDS',
            'xrate_commission' => 'xChange commission',
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

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return UserInfo the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Is there a UserFile with logo uploaded
     * @return integer The id of the logo
     * @return bool False if no logo is available
     */
    public function getLogo() {
        $file = UserFile::model()->findByAttributes(array(
            'doc_type_id' => DocType::LOGO_FILE_TYPE,
            'user_info_id' => $this->id,
        ));
        if ($file)
            return "<img src='/userInfo/downloadLogo/{$file->id}'>";
        else
            return '';
    }

    public function getEmailFooter($website_id = null) {
        //  \Utils::dbgYiiLog($website_id);

        if ($this->user_type_id === \UserType::clientB2C) {
            if (($website_id == \AirCart::WEBSITE_CHEAPTICKETS24_LOCAL ||
                $website_id == \AirCart::WEBSITE_CHEAPTICKETS24_DEV ||
                $website_id == \AirCart::WEBSITE_CHEAPTICKETS24_LIVE) ||
                strstr(\Yii::app()->request->serverName, 'cheaptickets24')) {
                $userInfoId = \UserInfo::F2G_B2C_USER_INFO_ID;
            } elseif (($website_id == \AirCart::WEBSITE_CHEAPTICKET_LOCAL ||
                $website_id == \AirCart::WEBSITE_CHEAPTICKET_DEV ||
                $website_id == \AirCart::WEBSITE_CHEAPTICKET) ||
                strstr(\Yii::app()->request->serverName, 'cheapticket')) {
                $userInfoId = \UserInfo::B2C_USER_INFO_ID;
            } elseif (($website_id == \AirCart::WEBSITE_AIRTICKETS_LOCAL ||
                $website_id == \AirCart::WEBSITE_AIRTICKETS_DEV ||
                $website_id == \AirCart::WEBSITE_AIRTICKETSINDIA) ||
                strstr(\Yii::app()->request->serverName, 'airticketsindia')) {
                $userInfoId = \UserInfo::ATI_B2C_USER_INFO_ID;
            } else {
                $userInfoId = \UserInfo::B2C_USER_INFO_ID;
            }
        } else {
            $userInfoId = $this->id;
        }
        $cms = \Cms::model()->findByPk(['type_id' => \Cms::CMS_EMAIL_FOOTER, 'user_info_id' => $userInfoId]);
        if ($cms) {
            return '<br>' . $cms->content;
        }
        return '';
    }

    public function getPageFooter() {
        if ($this->user_type_id === \UserType::clientB2C) {
            $userInfoId = \UserInfo::B2C_USER_INFO_ID;
        } else {
            $userInfoId = $this->id;
        }
        $cms = \Cms::model()->findByPk(['type_id' => \Cms::CMS_PAGE_FOOTER, 'user_info_id' => $userInfoId]);
        if ($cms) {
            return $cms->content;
        }
        return null;
    }

    /**
     * Is there a company logo uploaded
     * @return string|bool False if no logo is available
     */
    public function getLogoUrl() {
        $file = UserFile::model()->findByAttributes(array(
            'doc_type_id' => DocType::LOGO_FILE_TYPE,
            'user_info_id' => $this->id,
        ));
        if ($file) {
            return "/userInfo/downloadLogo/{$file->id}";
        }
        return null;
    }

    /**
     * Set the logo for this company
     */
    function setSessionLogo() {
        \Yii::app()->session->add(self::ACTIVE_COMPANY_LOGO, $this->getLogoUrl());
    }

    /**
     * Set the phone for this company
     */
    function setSessionPhone() {
        if ($this->user_type_id === \UserType::clientB2C) {
            \Yii::app()->session->remove(self::ACTIVE_COMPANY_PHONE);
        } else {
            \Yii::app()->session->add(self::ACTIVE_COMPANY_PHONE, "<div style='margin-top:7px;'>PHONE <i class='fa fa-phone fa-lg'></i> +91 $this->mobile</div>");
        }
    }

    /**
     * Set the footer for this company
     */
    function setSessionFooter() {
        if ($this->user_type_id === \UserType::clientB2C) {
            \Yii::app()->session->remove(self::ACTIVE_COMPANY_FOOTER);
        } else {
            \Yii::app()->session->add(self::ACTIVE_COMPANY_FOOTER, $this->getPageFooter());
        }
    }

    public function getCustomerCareInfo() {
        return "<b>$this->name</b><br><br>
            <b>Email:</b> $this->email<br>
            <b>Phone:</b> $this->mobile<br><br>
            <b>Address:</b>
            $this->address<br>
            {$this->city->name} - $this->pincode<br>
            {$this->city->state->name}, {$this->city->state->country->name}<br>
            ";
    }

    public function getAvailability() {
        $sum = $this->balance + $this->credit_limit;
        return $sum > 0 ? $sum : 0;
    }

    /**
     * Check if the client has payments or transactions
     * @return boolean True if the company has payments or transactions
     */
    function hasTransactionsOrPayments() {
        $payment = $this->findBySql('SELECT payment.id FROM payment '
            . 'JOIN users ON users.id = payment.user_id '
            . 'WHERE users.user_info_id = :user_info_id', [
            ':user_info_id' => $this->id
        ]);

        $transaction = $this->findBySql('SELECT pay_gate_log.id FROM pay_gate_log '
            . 'WHERE user_info_id = :user_info_id', [
            ':user_info_id' => $this->id
        ]);

        if ($payment === null && $transaction === null) {
            return false;
        }
        return true;
    }

    /**
     * Clear old outstanding balance. Register new payment if the balance is higher than 50
     * @param int $airCartId ID of the air cart where to register the payment or to add the equalizing note
     */
    function clearBalance($airCartId = null) {
        if ($this->balance > 50) {
            $payment = new \Payment;
            $payment->user_id = $this->users[0]->id;
            $payment->loged_user_id = $this->users[0]->id;
            $payment->air_cart_id = $airCartId;
            $payment->created = date(DATETIME_FORMAT);
            $payment->currency_id = $this->currency_id;
            $payment->old_balance = $this->balance;
            $payment->amount = $this->balance;
            $payment->new_balance = 0;
            $payment->transfer_type_id = \TransferType::FUND_RECALL;
            $payment->note = "Old outstanding balance clearance";
            $payment->insert();
        } else {
            $airCart = \AirCart::model()->findByPk($airCartId);
            if ($airCart) {
                $airCart->addNote("Outstanding client balance $this->balance equalized!");
            }
        }

        $this->balance = 0;
        $this->update(['balance']);
    }

}
