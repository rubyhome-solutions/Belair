<?php

/**
 * This is the model class for table "users".
 *
 * The followings are the available columns in table 'users':
 * @property integer $id
 * @property integer $user_info_id
 * @property integer $city_id
 * @property string $email
 * @property string $password
 * @property integer $enabled
 * @property string $created
 * @property string $name
 * @property string $activated
 * @property string $mobile
 * @property string $last_login
 * @property string $last_transaction
 * @property string $deactivated
 * @property string $pincode
 * @property string $address
 * @property string $note
 * @property string $pass_reset_code
 * @property string $emp_code
 * @property string $department
 * @property string $location
 * @property string $supervisor
 * @property string $sales_rep
 * @property integer $b2b_api
 *
 * @property bool $isStaff
 * @property integer $staffLevel
 *
 * The followings are the available model relations:
 * @property AirCart[] $airCarts
 * @property AirCart[] $airCartsLogedUser
 * @property City $city
 * @property UserInfo $userInfo
 * @property Payment[] $payments
 * @property Payment[] $paymentsLogedUser
 * @property Amendment[] $amendments
 * @property AirMarkup[] $airMarkups
 * @property Permission[] $permissions
 */
class Users extends CActiveRecord {

    const B2C_USERID = 6321;
    const B2E_USERID = 6328;
    const B2C_SENDER_EMAIL = 'cs@cheapticket.in';
    const B2C_SENDER_NAME = 'CheapTicket.in';
    const B2C_SMS_SENDER_NAME = 'CheapTicket.in';
    const F2G_SENDER_EMAIL = 'cs@cheaptickets24.com';
    const F2G_SENDER_NAME = 'cheaptickets24.com';
    const F2G_SMS_SENDER_NAME = 'cheaptickets24.com';
    const ATI_B2C_SENDER_EMAIL = 'cs@airticketsindia.com';
    const ATI_B2C_SENDER_NAME = 'airticketsindia.com';
    const ATI_B2C_SMS_SENDER_NAME = 'airticketsindia.com';
    const ATI_B2C_RECEPIENT_EMAIL = 'cs@cheapticket.in';
    const B2B_SENDER_EMAIL = 'support2@air.belair.in';
    const B2B_RECEPIENT_EMAIL = 'sales@belair.in';
    const B2C_RECEPIENT_EMAIL = 'cs@cheapticket.in';
    const F2G_RECEPIENT_EMAIL = 'cs@cheaptickets24.com';
    const B2B_SENDER_NAME = 'Travel';
    const PROFIT_REPORT_ALLOWED_USER = 'PROFIT_REPORT_ALLOWED_USER';
    const ALLOWED_IPS = 'ALLOWED_IPS';

    public $password2;
    public $terms;
    public $verifyCode;
    public $userTypeId = null; // Temp usage in newReg scenario

    /**
     * @return string the associated database table name
     */

    public function tableName() {
        return 'users';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('email', 'required'),
            array('email', 'unique'),
            array('email', 'email'),
            array('name', 'CRegularExpressionValidator', 'pattern' => '/^[a-zA-z\s]{3,}$/', 'message' => "{attribute} should contain only letters and should have at least 3 of them."),
            array('mobile', 'CRegularExpressionValidator', 'pattern' => '/^[+]?[\d]+$/', 'message' => "Incorrect tel. number format."),
            array('name, mobile,', 'required', 'on' => 'newReg'),
            array('name', 'required', 'on' => 'b2cReg'),
            array('mobile', 'required', 'on' => 'fastReg, b2cReg'),
            array('password, password2', 'required', 'on' => 'passRevive, newReg, b2cReg'),
            array('terms', 'compare', 'compareValue' => 1, 'message' => 'You have to accept the terms & conditions!', 'on' => 'newReg'),
            array('password, password2', 'length', 'min' => 6, 'on' => 'passRevive, siteReg, b2cReg'),
            array('password2', 'compare', 'compareAttribute' => 'password', 'on' => 'passRevive, siteReg, b2cReg'),
            array('city_id, user_info_id, b2b_api', 'numerical', 'integerOnly' => true),
            array('enabled, name, activated, mobile, last_login, last_transaction, deactivated, pincode, address, note, corporate_info_id, password2, password, emp_code, department, location, supervisor, sales_rep, userTypeId', 'safe'),
            // The following rule is used by search().
            array('id', 'safe', 'on' => 'search'),
            // Captcha
            ['verifyCode', 'captcha', 'on' => 'fogottenpass'],
            ['verifyCode', 'captcha', 'allowEmpty' => true, 'except' => 'fogottenpass'],
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airCarts' => array(self::HAS_MANY, 'AirCart', 'user_id'),
            'airCartsLogedUser' => array(self::HAS_MANY, 'AirCart', 'loged_user_id'),
            'city' => array(self::BELONGS_TO, 'City', 'city_id'),
            'userInfo' => array(self::BELONGS_TO, 'UserInfo', 'user_info_id'),
            'payments' => array(self::HAS_MANY, 'Payment', 'user_id'),
            'paymentsLogedUser' => array(self::HAS_MANY, 'Payment', 'loged_user_id'),
            'amendments' => array(self::HAS_MANY, 'Amendment', 'loged_user_id'),
            'airMarkups' => array(self::HAS_MANY, 'AirMarkup', 'user_id'),
            'permissions' => array(self::MANY_MANY, 'Permission', 'permission_x_user(user_id, permission_id)'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'user_info_id' => 'User Info',
            'city_id' => 'City',
            'email' => 'Email',
            'password' => 'Password',
            'password2' => 'Password again',
            'enabled' => 'Enabled',
            'created' => 'Created',
            'name' => 'Name',
            'activated' => 'Activated',
            'mobile' => 'Mobile',
            'last_login' => 'Last Login',
            'last_transaction' => 'Last Transaction',
            'deactivated' => 'Deactivated',
            'pincode' => 'Pincode',
            'address' => 'Address',
            'note' => 'Note',
            'pass_reset_code' => 'Pass Reset Code',
            'emp_code' => 'Emp Code',
            'department' => 'Department',
            'location' => 'Location',
            'supervisor' => 'Supervisor',
            'sales_rep' => 'Sales Rep',
            'b2b_api' => 'Enable B2B API',
            'verifyCode' => 'Verification Code',
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
        $criteria->compare('id', $this->id);
        $criteria->compare('email', $this->email, true);
        $criteria->compare('enabled', $this->enabled);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('mobile', $this->mobile, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    public function search2($searchTerm) {

        $searchTerm = filter_var($searchTerm, FILTER_SANITIZE_STRING);
//        Yii::log($searchTerm);
//        $searchTerm = str_replace("'", "", $searchTerm);
        $criteria = new CDbCriteria;
        $criteria->select = new CDbExpression('id, user_info_id, city_id,  email, enabled,created::timestamp(0), name, activated::timestamp(0), mobile, last_login::timestamp(0), last_transaction::timestamp(0), deactivated::timestamp(0), note');
        $criteria->compare('id', $this->id);
        // Search only among the company data if the logged user is not Staff member
        if (!Authorization::getIsStaffLogged()) {
            $loggedUser = $this->findByPk(Yii::app()->user->id);
            $criteria->compare('user_info_id', $loggedUser->user_info_id);
        }
        $criteria->order = 'id';
        // Search for specific string
        if (!empty($searchTerm) && strlen($searchTerm) > 2) {
            $criteria->addCondition("id IN (SELECT v_search_info.id from v_search_info
                WHERE LOWER(search_info) like LOWER('%{$searchTerm}%') )");
        }

        return new CActiveDataProvider($this, ['criteria' => $criteria]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Users the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public static function siteCreds() {
        $b2cSite = [];
        if (strstr(\Yii::app()->request->serverName, 'cheaptickets24')) 
        { 
            // F2G cases
            $b2cSite['siteName'] = "CheapTickets24.com";
            $b2cSite['siteLogo'] = "<img src='" . \Yii::app()->request->hostInfo . "/themes/F2G/dev/img/logo.png' width='183' height='38'  />";
            $b2cSite['senderEmail'] = self::F2G_SENDER_EMAIL;
            $b2cSite['senderName'] = self::F2G_SENDER_NAME;
            $b2cSite['RecipentEmail'] = self::F2G_RECEPIENT_EMAIL;
        } 
        else if (strstr(\Yii::app()->request->serverName, 'cheapticket')) 
        { 
            // B2C cases
            $b2cSite['siteName'] = "CheapTicket.in";
            $b2cSite['siteLogo'] = "<img src='" . \Yii::app()->request->hostInfo . "/themes/B2C/dev/img/logo.png' width='183' height='38'  />";
            $b2cSite['senderEmail'] = self::B2C_SENDER_EMAIL;
            $b2cSite['senderName'] = self::B2C_SENDER_NAME;
            $b2cSite['RecipentEmail'] = self::B2C_RECEPIENT_EMAIL;
        } 
        else if (strstr(\Yii::app()->request->serverName, 'airticketsindia')) 
        { 
            // ATI cases
            $b2cSite['siteName'] = "AirTicketsIndia.com";
            $b2cSite['siteLogo'] = "<img src='" . \Yii::app()->request->hostInfo . "/themes/ATI/dev/img/logo.png' width='183' height='38'  />";
            $b2cSite['senderEmail'] = self::ATI_B2C_SENDER_EMAIL;
            $b2cSite['senderName'] = self::ATI_B2C_SENDER_NAME;
            $b2cSite['RecipentEmail'] = self::ATI_B2C_RECEPIENT_EMAIL;
        } 
        else
        { 
            // B2C cases
            $b2cSite['siteName'] = "CheapTicket.in";
            $b2cSite['siteLogo'] = "<img src='" . \Yii::app()->request->hostInfo . "/themes/B2C/dev/img/logo.png' width='183' height='38'  />";
            $b2cSite['senderEmail'] = self::B2C_SENDER_EMAIL;
            $b2cSite['senderName'] = self::B2C_SENDER_NAME;
            $b2cSite['RecipentEmail'] = self::B2C_RECEPIENT_EMAIL;
        } 
        
        return $b2cSite;
    }

    public function welcomeEmail() {
        if ($this->userInfo->user_type_id === \UserType::clientB2C) {
            $siteDetails = \Users::siteCreds();
            //Please follow <b><a href='" . Yii::app()->request->hostInfo . "/b2c/auth/reset?code={$this->pass_reset_code}'>the link</a></b> to set your password<br><br>
            $email_content = "<html>
" . $siteDetails['siteLogo'] . "                 
<h2>Thank You for Registering with " . $siteDetails['siteName'] . " !</h2>
" . $siteDetails['siteName'] . "  Account Benefits:
<li>Manage your Bookings</li>
<li>Mange your Payments</li>
<li>Mange your Travelers</li>
<li>OneClick Checkout</li><br><br>
Happy Traveling!<br>" . $this->userInfo->getEmailFooter() . "</html>";
            $subject = 'Welcome to ' . $siteDetails['siteName'] . '';
            $senderEmail = $siteDetails['senderEmail'];
            $senderName = $siteDetails['senderName'];
        } else {
            $email_content = "<html><h2><b>Dear $this->name,</b></h2><br>
Congratulations!<br><br>
You have been successfully registered. Following are your account details:<br><br>
<table>
    <tr><td>Account ID: </td><td>{$this->id}</td></tr>
    <tr><td>Name:</td><td>{$this->name}</td></tr>
    <tr><td>Email:</td><td>{$this->email}</td></tr>
    <tr><td>Phone:</td><td>{$this->mobile}</td></tr>
</table><br><br>
Please <b><a href='" . Yii::app()->request->hostInfo . "/site/revivepass/?code={$this->pass_reset_code}'><strong>click the link</strong></a></b> to set your password.<br><br>
If the link is not working you can copy the following URL and paste it in your browser:<br>
" . Yii::app()->request->hostInfo . "/site/revivepass/?code={$this->pass_reset_code} " . $this->userInfo->getEmailFooter() . "</html>";
            $subject = 'Welcome to Belair';
            $senderEmail = self::B2B_SENDER_EMAIL;
            $senderName = self::B2B_SENDER_NAME;
        }

        \EmailSmsLog::push_email_sms_log($senderEmail, $this->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_NEW_USER, null, $this->id);

        \Utils::sendMail($this->email, $email_content, $subject, $senderEmail, $senderName);
    }

    public function passResetEmail() {
//        \Utils::dbgYiiLog(\Yii::app()->theme);
        // Prepare and send the email:
        $siteDetails = \Users::siteCreds();
        if ($this->userInfo->user_type_id === \UserType::clientB2C) {
            $email_content = "<html>
" . $siteDetails['siteLogo'] . "                 
<h2>Forgot your " . $siteDetails['siteName'] . " Password?</h2>
<b>Dear {$this->userInfo->name},</b><br><br>
Click the link to reset the password!<br>
<b><a href='" . \Utils::getSiteUrl(Yii::app()->request->hostInfo) . "/site/revivepass?code={$this->pass_reset_code}'>Reset Password</a></b><br><br>
Happy Traveling!<br>" . $this->userInfo->getEmailFooter() . "</html>";
            $subject = '' . $siteDetails['siteName'] . ' Forgot Password';
            $senderEmail = $siteDetails['senderEmail'];
            $senderName = $siteDetails['senderName'];
        } else {
            $email_content = "<html><h2><b>Dear {$this->name},</b></h2><br>
Here is <a href='" . Yii::app()->request->hostInfo . "/site/revivepass/?code={$this->pass_reset_code}'><strong>the link</strong></a> to revive your password with the BelAir booking services.<br><br>
If the link is not working you can copy the following URL and paste it in your browser:<br>
" . Yii::app()->request->hostInfo . "/site/revivepass?code={$this->pass_reset_code} " . $this->userInfo->getEmailFooter() . "</html>";
            $subject = 'Forgot your password?';
            $senderEmail = self::B2B_SENDER_EMAIL;
            $senderName = self::B2B_SENDER_NAME;
        }

        \EmailSmsLog::push_email_sms_log($senderEmail, $this->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_FORGOT_PASSWORD, null, $this->id);

        \Utils::sendMail($this->email, $email_content, $subject, $senderEmail, $senderName);
    }

    /**
     * Check if the user is staff member
     * @return boolean TRUE if the user is from the staff
     */
    public function getIsStaff() {
        return in_array($this->userInfo->user_type_id, Authorization::$staffRoles);
    }
    /**
     * Check if the user is SUPER ADMIN
     * @return boolean true 
     */
    public function getIsSuperAdmin() {
        return ($this->userInfo->user_type_id === \UserType::superAdmin);
    }

    /**
     * Get the staff level of the user
     * @return integer if the staff level is present
     * @return bool FALSE if the user is not from the staff
     */
    public function getStaffLevel() {
        return array_search($this->userInfo->user_type_id, Authorization::$staffRoles);
    }

    /**
     * Check if the User has certain permission (individual or inherited). Note that individual permissions preceed the inherited
     * @param integer $permission_id The ID of the permission
     * @return boolean TRUE if the permission is present
     */
    public function hasPermission($permission_id) {
        if (count($this->permissions) > 0) {  // Has individual permissions set
            foreach ($this->permissions as $permission) {
                if ($permission->id == $permission_id)
                    return true;
            }
        } else {    // Has default UserType permissions set
            foreach ($this->userInfo->userType->permissions as $permission) {
                if ($permission->id == $permission_id)
                    return true;
            }
        }

        return false;
    }

    public function getProfileCompletenessPercent() {
        return 80;
    }

    public function getProfileImg() {
        return Yii::app()->theme->baseUrl . "/img/tmp/user.png";
    }

    /**
     * Set the UserInfo object to have the same email, name and mobile as the user.<br>
     * Use this method mainly for B2C clients.
     */
    function setSameUserInfoBasics() {
        $this->userInfo->email = $this->email;
        $this->userInfo->name = $this->name;
        $this->userInfo->mobile = $this->mobile;
        $this->userInfo->update(['email', 'name', 'mobile']);
    }

    /**
     * Check if the user can login.
     * If it is staff member, that is out of office, without permission out of office - return false
     */
    function canLogin() {
        //return true; // For now untill Michael will Final
        if ($this->isSuperAdmin || !$this->isStaff || \Yii::app()->request->userHostAddress == \Controller::ALLOWED_IP) {
            return true;
        }
        if ($this->hasPermission(Permission::CAN_LOGIN_OUT_OF_OFFICE)) {
            return true;
        } else {
            $allowedIPs=  \Params::model()->findByPk(self::ALLOWED_IPS)->info;
            $allowedIPArr = explode(',', $allowedIPs);
            
            if (!in_array(\Yii::app()->request->userHostAddress, $allowedIPArr)) {
                return false;
            } else {
                return true;
            }
        }
    }
	public function getIsB2bUser()
	{
		return in_array($this->userInfo->user_type_id, UserType::$B2B_USERS);
	}
	public function getIsSiteAuthForB2B()
	{
		$user_host_info= str_replace('https://www.','',\Yii::app()->request->serverName);
		if($user_host_info!=B2B_SITE_LIVE)
		{
			return $this->isB2bUser;
		}
		return false;
	}
}

?>
