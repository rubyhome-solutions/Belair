<?php

/**
 * This is the model class for table "cc" - holder of the credit cards info.
 *
 * The followings are the available columns in table 'cc':
 *
 * @property integer $id
 * @property integer $user_info_id
 * @property string $name
 * @property string $number
 * @property string $exp_date
 * @property string $note
 * @property integer $verification_status
 * @property string $mask
 * @property string $hash
 * @property integer $type_id
 * @property integer $bin_id
 * @property integer $deleted
 * @property integer $status_3d
 *
 * The followings are the available model relations:
 * @property UserInfo $userInfo
 * @property CcType $type
 * @property PayGateLog[] $payGateLogs
 * @property BinList $bin
 * @property Fraud[] $frauds
 */
class Cc extends CActiveRecord {

    /**
     * Temporary store the CVV code 
     * @var string
     */
    public $code;
    
    static $ccTypes = [
        ECCValidator2::MASTERCARD => CcType::TYPE_MASTERCARD,
        ECCValidator2::AMERICAN_EXPRESS => CcType::TYPE_AMEX,
        ECCValidator2::VISA => CcType::TYPE_VISA,
        ECCValidator2::DINERS_CLUB => CcType::TYPE_DINERS_CLUB,
        ECCValidator2::DISCOVER => CcType::TYPE_DISCOVER,
        //ECCValidator2::SWITCH_CARD => CcType::TYPE_SWITCH,
        ECCRupayValidator::RUPAY => CcType::TYPE_RUPAY,
    ];
    static $ccTypeIdToEcc = [
        CcType::TYPE_MASTERCARD => ECCValidator2::MASTERCARD,
        CcType::TYPE_AMEX => ECCValidator2::AMERICAN_EXPRESS,
        CcType::TYPE_VISA => ECCValidator2::VISA,
        CcType::TYPE_DINERS_CLUB => ECCValidator2::DINERS_CLUB,
        CcType::TYPE_DISCOVER => ECCValidator2::DISCOVER,
       // CcType::TYPE_SWITCH => ECCValidator2::SWITCH_CARD,
        CcType::TYPE_RUPAY => ECCRupayValidator::RUPAY,
    ];

// 3DS status can have 4 values: Y/N/U/A
    const STATUS3D_Y = 'Y';     // Authentication Successful
    const STATUS3D_N = 'N';     // Authentication Failed
    const STATUS3D_U = 'U';     // Authentication Not Available
    const STATUS3D_X = 'X';     // Authentication Not Available
    const STATUS3D_P = 'P';     // Error Parsing Authentication Response
    const STATUS3D_S = 'S';     // Invalid Signature on Authentication Response
    const STATUS3D_I = 'I';     // MPI Processing Error
    const STATUS3D_M = 'M';     // Authentication Attempted (No CAVV)
    const STATUS3D_A = 'A';
    const STATUS3D_E = 'E';
    const STATUS3D_D = 'D';

    static $status3D = [
        1 => self::STATUS3D_Y,
        2 => self::STATUS3D_N,
        3 => self::STATUS3D_U,
        4 => self::STATUS3D_A,
        5 => self::STATUS3D_X,
        6 => self::STATUS3D_P,
        7 => self::STATUS3D_S,
        8 => self::STATUS3D_I,
        9 => self::STATUS3D_M,
        10 => self::STATUS3D_E,
        11 => self::STATUS3D_D,
    ];
    static $status3DmapToId = [
        self::STATUS3D_Y => 1,
        self::STATUS3D_N => 2,
        self::STATUS3D_U => 3,
        self::STATUS3D_A => 4,
        self::STATUS3D_X => 5,
        self::STATUS3D_P => 6,
        self::STATUS3D_S => 7,
        self::STATUS3D_I => 8,
        self::STATUS3D_M => 9,
        self::STATUS3D_E => 10,
        self::STATUS3D_D => 11,
    ];

    /**
     * Validator helper class
     * @var ECCValidator2
     */
    public $ecc;

    function __construct($scenario = 'insert') {
        $this->ecc = new ECCValidator2();
        parent::__construct($scenario);
    }

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'cc';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
// NOTE: you should only define rules for those attributes that
// will receive user inputs.
        return array(
            array('user_info_id, name, number, exp_date', 'required'),
            array('user_info_id, status_3d, verification_status', 'numerical', 'integerOnly' => true),
            array('note', 'safe'),
            // The following rule is used by search().
            array('user_info_id, mask, type_id, bin_id, deleted, id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
// NOTE: you may need to adjust the relation name and the related
// class name for the relations automatically generated below.
        return array(
            'userInfo' => array(self::BELONGS_TO, 'UserInfo', 'user_info_id'),
            'type' => array(self::BELONGS_TO, 'CcType', 'type_id'),
            'payGateLogs' => array(self::HAS_MANY, 'PayGateLog', 'cc_id'),
            'bin' => array(self::BELONGS_TO, 'BinList', 'bin_id'),
            'frauds' => [self::HAS_MANY, 'Fraud', 'cc_id'],
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'user_info_id' => 'Client',
            'name' => 'Cardholder name',
            'number' => 'Cart Number',
            'code' => 'Code',
            'exp_date' => 'Exp. Date',
            'note' => 'Note',
            'status_3d' => '3DS',
            'mask' => 'Mask',
            'type_id' => 'Type',
            'frauds' => 'Fraud(s)',
            'verification_status' => 'Verified'
        ];
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

        $isStaffLogged = Authorization::getIsStaffLogged();
        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        if (is_integer($this->user_info_id)) {
            $criteria->compare('user_info_id', $this->user_info_id);
        }
        $criteria->compare('type_id', $this->type_id);
        if ($isStaffLogged) {
            $criteria->compare('deleted', $this->deleted);
        } else {
            $criteria->compare('deleted', 0);   // Don't show deleted cards to the users
        }
        $criteria->compare('mask', $this->mask, true);
        $criteria->compare('status_3d', $this->status_3d);
        $criteria->compare('verification_status', $this->verification_status);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC']
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Cc the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Custom insert function. Encode the number 
     * @param array $attributes
     */
    function insert($attributes = null) {
        if ($this->isNewRecord) {
            if (ctype_digit($this->number)) {
                // prepare the mask like 12**********3456
                $this->mask = self::ccMask($this->number);
                $this->hash = md5($this->number);
                $this->bin_id = (int) substr($this->number, 0, 6);
                // Create new bin
                BinList::insertIfMissing($this->bin_id);
                // Encrypt the number
                $this->number = self::encode($this->number);
            }
            parent::insert($attributes);
        }
    }

    /**
     * Mask the CC number usinf first 6 digits, like 123456**********
     * @param string $number
     * @return string
     */
    static function ccMask($number) {
        if (strlen($number) < 10)
            return '******';
        return substr($number, 0, 6) . str_repeat('*', strlen($number) - 6);
    }

    /**
     * Encode the card number
     * @param string $param Card number
     * @return string
     */
    static function encode($param) {
        $str = self::random_string(5, 5) . ':' . $param . ':' . self::random_string(5, 5);
        $td = mcrypt_module_open(MCRYPT_RIJNDAEL_256, '', MCRYPT_MODE_CBC, '');
        $ivSize = mcrypt_enc_get_iv_size($td);
        $site_encryption_key = hash('sha256', self::secretKey(), true);
        mcrypt_generic_init($td, $site_encryption_key, $site_encryption_key);
        $encrypted_data = mcrypt_generic($td, $str);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        return base64_encode($encrypted_data);
    }

    /**
     * Decode previously encoded card numbers
     * @param string $param
     * @return string|null
     */
    static function decode($param) {
        if (empty($param)) {
            return null;
        }
        $td = mcrypt_module_open(MCRYPT_RIJNDAEL_256, '', MCRYPT_MODE_CBC, '');
        $site_encryption_key = hash('sha256', self::secretKey(), true);
        mcrypt_generic_init($td, $site_encryption_key, $site_encryption_key);
        $decrypted_data = mdecrypt_generic($td, base64_decode($param));
//        mcrypt_generic_init($td, $site_encryption_key, $site_encryption_key);
        mcrypt_generic_deinit($td);
        mcrypt_module_close($td);
        $tmp = explode(':', rtrim($decrypted_data, "\0"));
        return !empty($tmp[1]) ? $tmp[1] : null;
    }

    static function secretKey() {
        if (PHP_OS == 'Linux') {
            return exec('/sbin/blkid');
        } else {
            return file_get_contents('e:\tmp\belair\blkid');/*c:\blkid*/
        }
    }

    static function random_string($num_characters = 5, $num_digits = 3) {
        // via http://salman-w.blogspot.com/2009/06/generate-random-strings-using-php.html
        $character_set_array = [];
        $character_set_array[] = array('count' => $num_characters, 'characters' => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
        $character_set_array[] = array('count' => $num_digits, 'characters' => '0123456789');
        $temp_array = [];
        foreach ($character_set_array as $character_set) {
            for ($i = 0; $i < $character_set['count']; $i++) {
                $temp_array[] = $character_set['characters'][rand(0, strlen($character_set['characters']) - 1)];
            }
        }
        shuffle($temp_array);
        return implode('', $temp_array);
    }

    function getImageTag() {
        if(self::$ccTypeIdToEcc[$this->type_id] == ECCRupayValidator::RUPAY){
          $this->ecc = new ECCRupayValidator(); 
          return $this->ecc->getSmallImageTagFromType(self::$ccTypeIdToEcc[$this->type_id]);
        } else {
           return $this->ecc->getSmallImageTagFromType(self::$ccTypeIdToEcc[$this->type_id]);
        }
        
    }

    /**
     * Format the 3DS status for admin view
     * @return string HTML formated status
     */
    function format3dStatus() {
        switch ($this->status_3d) {
            case self::$status3DmapToId[self::STATUS3D_Y]:
                $out = "<span class='badge badge-success'>Y</span>";
                break;
            case null:
                $out = '';
                break;
            default:
                $out = "<span class='badge badge-important'>" . self::$status3D[$this->status_3d] . "</span>";
                break;
        }
        return $out;
    }

    /**
     * Get the CC code used in the GDSes, like CA=MasterCard
     * @return string Code
     */
    function getGdsCode() {
        return \CcType::$ccTypeIdToGdsCode[$this->type_id];
    }
    
    /**
     * Clear the fraud mark from all transactions with this CC
     */
    function fraudClear() {
        \Fraud::model()->deleteAllByAttributes(['cc_id' => $this->id]);
    }
    
}
