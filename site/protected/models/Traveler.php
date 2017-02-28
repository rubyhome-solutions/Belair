<?php

/**
 * This is the model class for table "traveler".
 *
 * The followings are the available columns in table 'traveler':
 * @property integer $id
 * @property integer $user_info_id
 * @property integer $gender_id
 * @property integer $passport_country_id
 * @property integer $city_id
 * @property integer $traveler_title_id
 * @property string $first_name
 * @property string $last_name
 * @property string $birthdate
 * @property string $email
 * @property string $mobile
 * @property string $passport_number
 * @property string $passport_issue
 * @property string $passport_expiry
 * @property string $passport_place
 * @property string $pincode
 * @property string $address
 * @property string $phone
 * @property string $email2
 * @property string $combinedInfo Ttile, first name, last name, email and mobile
 * @property string $shortCombinedInfo Ttile first name and last name
 * @property integer $traveler_type_id Used to set the type for manual cart creation
 * @property string $note
 * @property integer $status
 *
 * The followings are the available model relations:
 * @property TravelerFile[] $travelerFiles
 * @property Visa[] $visas
 * @property Preferences $preferences
 * @property UserInfo $userInfo
 * @property Gender $gender
 * @property Country $passportCountry
 * @property City $city
 * @property AirBooking[] $airBookings
 * @property TravelerTitle $travelerTitle
 * @property FfCarriers[] $ffCarriers
 * @property FfSettings[] $ffSettings
 * @property TravelerTitle $travelerTitle
 */
\Yii::setPathOfAlias('libphonenumber', \Yii::getPathOfAlias('application.vendor.libphonenumber'));

class Traveler extends CActiveRecord {

    public $term;
    public $traveler_type_id;
    public $passport_expiry_day;
    public $passport_expiry_month;
    public $passport_expiry_year;
    public $birth_day;
    public $birth_month;
    public $birth_year;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'traveler';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('user_info_id, first_name, last_name, traveler_title_id', 'required'),
            array('user_info_id','validateTravelerUnique'),
            array('birthdate', 'required', 'on' => 'infant', 'message' => 'Birthdate is required for the infant passenger'),
            array('birthdate', 'CDateValidator', 'format' => 'yyyy-MM-dd', 'message' => 'Use YYYY-MM-DD date format'),
            array('email', 'email'),
            ['mobile', 'validatePhonenumber'],
            array('first_name', 'CRegularExpressionValidator', 'pattern' => '/^[a-zA-z\s]{3,}$/', 'message' => "{attribute} should contain only English letters and should have at least 3 of them."),
            array('last_name', 'CRegularExpressionValidator', 'pattern' => '/^[a-zA-z\s]{3,}$/', 'message' => "{attribute} should contain only English letters and should have at least 3 of them."),
            array('mobile', 'CRegularExpressionValidator', 'pattern' => '/^[+]?[\d]+$/', 'message' => "Incorrect tel. number format."),
            array('mobile', 'length', 'min' => 10, 'tooShort' => "Incorrect Mobile Number."),
            array('id, user_info_id, gender_id, passport_country_id, city_id, traveler_type_id, status', 'numerical', 'integerOnly' => true),
            array('email, mobile, passport_number, passport_issue, passport_expiry, passport_place, pincode, address, phone, email2, note, status', 'safe'),
            array('passport_issue, passport_expiry, birthdate', 'default', 'setOnEmpty' => true, 'value' => null),
            ['traveler_title_id', 'numerical', 'integerOnly' => true, 'min' => 1, 'max' => 8],
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('searchTerm', 'safe', 'on' => 'search'),
        );
    }

    public function validatePhonenumber($attribute, $params) {
        if ($this->mobile) {
            $ok = true;
            try {
                $util = \libphonenumber\PhoneNumberUtil::getInstance();

                $ok = $util->isValidNumber($util->parse($this->mobile, 'IN'));
            } catch (\Exception $e) {
                $ok = false;
            }

            if (!$ok) {
                $this->addError($attribute, 'Mobile number is not correct');
            }
        }
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'travelerFiles' => array(self::HAS_MANY, 'TravelerFile', 'traveler_id'),
            'visas' => array(self::HAS_MANY, 'Visa', 'traveler_id'),
            'preferences' => array(self::HAS_ONE, 'Preferences', 'traveler_id'),
            'userInfo' => array(self::BELONGS_TO, 'UserInfo', 'user_info_id'),
            'gender' => array(self::BELONGS_TO, 'Gender', 'gender_id'),
            'passportCountry' => array(self::BELONGS_TO, 'Country', 'passport_country_id'),
            'city' => array(self::BELONGS_TO, 'City', 'city_id'),
            'airBookings' => array(self::HAS_MANY, 'AirBooking', 'traveler_id'),
            'travelerTitle' => array(self::BELONGS_TO, 'TravelerTitle', 'traveler_title_id'),
            'ffCarriers' => array(self::MANY_MANY, 'FfCarriers', 'ff_settings(traveler_id, ff_carriers_id)'),
            'ffSettings' => array(self::HAS_MANY, 'FfSettings', 'traveler_id'),
            'travelerTitle' => array(self::BELONGS_TO, 'TravelerTitle', 'traveler_title_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'user_info_id' => 'User Info',
            'gender_id' => 'Gender',
            'passport_country_id' => 'Passport Country',
            'city_id' => 'City',
            'traveler_title_id' => 'Title',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'birthdate' => 'Birthdate',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'passport_number' => 'Passport Number',
            'passport_issue' => 'Passport Issue',
            'passport_expiry' => 'Passport Expiry',
            'passport_place' => 'Passport place of issue',
            'pincode' => 'Pincode',
            'address' => 'Address',
            'phone' => 'Phone2',
            'email2' => 'Email2',
            'traveler_title_id' => 'Title',
            'note' => 'Note',
            'status' => 'Status',
        );
    }
    
   
    //Check if Traveler is duplicate for same user_info_id and also it is active
    public function validateTravelerUnique($attribute, $params) {
        $criteria = new CDbCriteria;
        $criteria->compare("UPPER(replace(first_name, ' ', ''))", strtoupper(str_replace(' ', '', $this->first_name)));
        $criteria->compare("UPPER(replace(last_name, ' ', ''))", strtoupper(str_replace(' ', '', $this->last_name)));
        $criteria->compare('user_info_id', $this->user_info_id);
        $criteria->compare('traveler_title_id', $this->traveler_title_id);
        $criteria->compare('status', 1);
        $criteria->addCondition('id != :traveler_id');
        $criteria->params[ ':traveler_id' ] = $this->id;    
        $model = self::model()->find($criteria);
        if ($model !== null) {
            $this->addError($attribute, 'Traveler Already Exists');
        }
    }

    public function addNote($note) {
        $notes = $this->getNotes();
        $user = \Users::model()->findByPk(Utils::getLoggedUserId());
        $userName = empty($user) ? 'Admin' : $user->name;
        $notes[$userName . " " . date(DATETIME_FORMAT)] = htmlentities($note);
        $this->note = json_encode($notes);
        $this->update(['note']);
    }

    public function getNotes() {
        $out = json_decode(html_entity_decode($this->note), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            if (YII_DEBUG) {
                \Utils::dbgYiiLog([
                    'Json decode error' => json_last_error_msg(),
                    'Content' => $this->note,
                ]);
            }
            $out = [$this->logedUser->name . " " . \Utils::cutSecondsAndMilliseconds($this->created) => $this->note];
            $this->note = json_encode($out);
            $this->update(['note']);
        }
        return is_array($out) ? $out : [];
    }

    /**
     * Added By Satender
     * Purpose : To add note to the future travel date carts of the current traveler  
     */
    public function addNoteTravelerCart() {
        Yii::trace('addNoteTravelerCart()', 'application.model.Traveler');

        $carts = Yii::app()->db->createCommand()
                ->select('ac.id')
                ->from('air_cart ac')
                ->join('air_booking ab', 'ac.id=ab.air_cart_id')
                ->where('ab.traveler_id=:id', array(':id' => $this->id))
                ->andWhere('ab.departure_ts >= now()')
                ->queryAll();

        $note = $this->first_name . ' ' . $this->last_name . ' details changed, refer change logs';
        foreach ($carts as $cart) {
            $air_cart = AirCart::model()->findByPk($cart['id']);
            $air_cart->addNote($note);
        }
    }

    /**
     * Added By Satender
     * Purpose : For configuration which will be used by TraceChange Behaviour
     * @return type list of the relational columns and their respective model
     */
    public function getRelationalColumns() {
        return [
            'traveler_title_id' => [
                'model' => 'TravelerTitle', 'field_name' => 'name'
            ],
            'passport_country_id' => [
                'model' => 'Country', 'field_name' => 'name'
            ],
        ];
    }

    /**
     * Added By Satender
     * Purpose: To handle changes in model by attaching behaviour to model
     * @return type : list of behaviours want to attach with model 
     */
    public function behaviors() {
        return array('TraceChange');
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

        $searchTerm = filter_var($this->term, FILTER_SANITIZE_STRING);

        $criteria = new CDbCriteria;
        $criteria->with = array('userInfo', 'passportCountry');
        //$criteria->compare('status',$this->status);
//        $criteria->order = 't.id';
        $criteria->compare('t.id', $this->id);

        // Search only among the company data if the logged user is not Staff member
        if (!Authorization::getIsStaffLogged()) {
            $loggedUser = Users::model()->findByPk(Yii::app()->user->id);
            $criteria->compare('user_info_id', $loggedUser->user_info_id);
        }

        // Search for specific string
        if (!empty($searchTerm) && strlen($searchTerm) > 2)
            $criteria->addCondition("t.id IN (SELECT v_traveler_search_info.id from v_traveler_search_info
                WHERE LOWER(search_info) like LOWER('%{$searchTerm}%') )");

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC']
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Traveler the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getCombinedInfo() {
        return "{$this->travelerTitle->name} $this->first_name $this->last_name, $this->email, $this->mobile";
    }

    public function getShortCombinedInfo() {
        return "{$this->travelerTitle->name} $this->first_name $this->last_name";
    }

    /**
     * Insert new traveller if missing or use the existing one. Comparison is done based on first and last names and user_type_id
     * @return int The ID of the traveller
     */
    public function insertIfMissing() {
        $criteria = new CDbCriteria;
        $criteria->compare("UPPER(replace(first_name, ' ', ''))", strtoupper(str_replace(' ', '', $this->first_name)));
        $criteria->compare("UPPER(replace(last_name, ' ', ''))", strtoupper(str_replace(' ', '', $this->last_name)));
        //        $criteria->compare("UPPER(trim(both ' ' from last_name))", strtoupper(trim($this->last_name)));
        $criteria->compare('user_info_id', $this->user_info_id);
        //  $criteria->compare('birthdate', $this->birthdate);        // Disabled since Goair return the paxes with some year
        $criteria->compare('traveler_title_id', $this->traveler_title_id);
        $criteria->compare('status',1);
        $criteria->order = 'id';
        $model = self::model()->find($criteria);
        if ($model === null) {
            $this->insert();
        } else {
            $this->id = $model->id;
            $this->isNewRecord = false;
            $this->refresh();
        }
        return $this->id;
    }

    /**
     * Set the traveler_type_id based on the birthdate
     */
    function setTravelerTypeId() {
        if (empty($this->birthdate)) {
            $this->traveler_type_id = \TravelerType::TRAVELER_ADULT;
        } else {
            $today = new DateTime();
            $diff = $today->diff(new DateTime($this->birthdate));
            if ($diff->y < 2) {
                $this->traveler_type_id = \TravelerType::TRAVELER_INFANT;
            } elseif ($diff->y < 12) {
                $this->traveler_type_id = \TravelerType::TRAVELER_CHILD;
            } else {
                $this->traveler_type_id = \TravelerType::TRAVELER_ADULT;
            }
        }
    }

    /**
     * Pretty formatting of the parameters
     * @return array
     */
    function pretty() {
        return [
            'id' => $this->id,
            'firstName' => $this->first_name,
            'lastName' => $this->last_name,
            'title' => $this->travelerTitle->name,
            'birthday' => $this->birth_day,
            'gender' => $this->gender->name,
            'email' => $this->email,
            'mobile' => $this->mobile,
        ];
    }

    function namesBeautify() {
        $this->first_name = preg_replace('!\s+!', ' ', trim($this->first_name));
        $this->last_name = preg_replace('!\s+!', ' ', trim($this->last_name));
        $fullName = trim($this->first_name . ' ' . $this->last_name);
        $names = explode(' ', $fullName);
        switch (count($names)) {
            case 0: return; // Do not do anything if no names are provided
            case 1:
                $this->first_name = null;
                $this->last_name = $fullName;
                break;
            case 2:
                $this->first_name = $names[0];
                $this->last_name = $names[1];
                break;
//            case 3:
//                $this->first_name = $names[0] . ' ' . $names[1];
//                $this->last_name = $names[2];
//                break;

            default:
                if (empty($this->first_name) || empty($this->last_name)) {
                    $this->last_name = array_pop($names);
                    $this->first_name = implode(' ', $names);
                }
                break;
        }
    }

    /*
     * Booking rules to be implemented:
     * 
     * Date of birth - From, to and within Australia, US, Canada
     * Date of birth - for child and infant 
     * Date of birth – for all tickets on Kuwait Airlines , Saudi Airlines
     * Biman Bangladesh – Passport Number
     * passport number, expiry, issue country, date of birth, gender – for all tickets on Uzbekistan Airlines, Egypt Air
     * Visa type, date of issue, place of issue ,valid till, visa number - for all tickets on Oman airlines
     * 
     */
    
    /**
     * purpose: To deactivate traveler
     * @param type $status
     */
    public function setStatus($status = 0){
        $this->status = $status;
        $this->update(['status']);
    }
}
