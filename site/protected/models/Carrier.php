<?php

/**
 * This is the model class for table "carrier".
 *
 * The followings are the available columns in table 'carrier':
 * @property integer $id
 * @property string $code
 * @property string $name
 * @property integer $is_domestic
 * @property string $generateImgTag Generate <img> tag
 * @property string $helpLine The helpline for this airline
 * @property bool $isLlc If the carrier is Low Cost Carrier
 * @property string $codeAndName Generate string like [G8] Indigo
 * @property itn $disabled If the airline should be excluded from the search results
 *
 * The followings are the available model relations:
 * @property AirCart[] $airCarts
 * @property RoutesCache[] $routesCaches
 * @property AirRoutes[] $airRoutes
 * @property AirMarkup[] $airMarkups
 * @property AirlineList[] $airlineLists
 * @property CarrierHelpline $carrierHelpline
 * @property TourCode[] $tourCodes
 */
class Carrier extends CActiveRecord {

    static $carrierIdsByCode = [];
    static $carrierCodesById = [];
    static $carrierNamesById = [];
    static $lowCost = array(
        719, // Indigo
        598, // SpiceJet
        59, // GoAir
    );

    const CARRIER_GOAIR = 59;
    const CARRIER_SPICEJET = 598;
    const CARRIER_INDIGO = 719;
    const UNIVERSAL_IMAGE_CODE = 'universal';

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'carrier';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('code, name', 'required'),
            array('code', 'length', 'max' => 2),
            array('is_domestic, disabled', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, code, name, disabled', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airCarts' => array(self::HAS_MANY, 'AirCart', 'carrier_id'),
            'routesCaches' => array(self::HAS_MANY, 'RoutesCache', 'carrier_id'),
            'airRoutes' => array(self::HAS_MANY, 'AirRoutes', 'carrier_id'),
            'airMarkups' => array(self::HAS_MANY, 'AirMarkup', 'carrier_id'),
            'airlineLists' => array(self::HAS_MANY, 'AirlineList', 'carrier_id'),
            'carrierHelpline' => array(self::HAS_ONE, 'CarrierHelpline', 'carrier_id'),
            'tourCodes' => array(self::HAS_MANY, 'TourCode', 'carrier_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'code' => 'Code',
            'name' => 'Name',
            'disabled' => 'Excluded',
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
        $criteria->compare('disabled', $this->disabled);
        $criteria->compare('code', strtoupper($this->code));
        $criteria->compare('LOWER(name)', strtolower($this->name), true);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Carrier the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getImageUrl() {
        $fileName = \Yii::app()->basePath . "/../img/air_logos/{$this->code}.png";
        if (is_file($fileName)) {
            return "/img/air_logos/{$this->code}.png";
        }
        return "/img/air_logos/" . self::UNIVERSAL_IMAGE_CODE . ".png";
    }

    public function getGenerateImgTag() {
        return "<img src='{$this->imageUrl}' >";
    }

    public function getCodeAndName() {
        return "$this->code - $this->name";
    }

    public function getHelpLine() {
        if (isset($this->carrierHelpline))
            return $this->carrierHelpline->text;
        return null;
    }

    public function getIsLlc() {
        if (in_array($this->id, self::$lowCost)) {
            return true;
        }
        return false;
    }

    /**
     * Get the carrier ID from the Airline code. Using array to remember the codes that are already obtained from the DB
     * @param string $code 2 letter Airline code
     * @return int or null if not found
     */
    static function getIdFromCode($code) {
        $code = strtoupper(trim($code));
        if (isset(self::$carrierIdsByCode[$code])) {
            return self::$carrierIdsByCode[$code];
        }
        $model = Carrier::model()->cache(3600)->findByAttributes(['code' => $code]);
        if ($model) {
            self::$carrierIdsByCode[$code] = $model->id;
            return $model->id;
        } else {

            \LogModel::logAction(\LogOperation::MISSING_AIRLINE, null, $code);
            return null;
        }
    }

    /**
     * Get the Airline code from the ID. Using array to remember the IDs that are already obtained from the DB
     * @param int $carrier_id Airline ID
     * @return string or null if not found
     */
    static function getCodeFromId($carrier_id) {
        settype($carrier_id, "int");
        if (isset(self::$carrierCodesById[$carrier_id])) {
            return self::$carrierCodesById[$carrier_id];
        }
        $model = Carrier::model()->cache(3600)->findByPk($carrier_id);
        if ($model) {
            self::$carrierCodesById[$carrier_id] = $model->code;
            return $model->code;
        } else {

            \LogModel::logAction(\LogOperation::MISSING_AIRLINE, null, 'ID:' . $carrier_id);
            return null;
        }
    }

    /**
     * Check if the Airline is disabled
     * @param int $carrier_id Airline ID
     * @return bool
     */
    static function getIsDisabled($carrier_id) {
        settype($carrier_id, "int");
        $model = self::model()->cache(3600)->findByPk($carrier_id);
        if ($model !== null && $model->disabled > 0) {
            return true;
        }
        // Not disabled by default
        return false;
    }

    /**
     * Get the Airline name from the ID. Using array to remember the IDs that are already obtained from the DB
     * @param int $carrier_id Airline ID
     * @return string or null if not found
     */
    static function getNameFromId($carrier_id) {
        settype($carrier_id, "int");
        if (isset(self::$carrierNamesById[$carrier_id])) {
            return self::$carrierNamesById[$carrier_id];
        }
        $model = Carrier::model()->cache(3600)->findByPk($carrier_id);
        if ($model) {
            self::$carrierNamesById[$carrier_id] = $model->name;
            self::$carrierCodesById[$carrier_id] = $model->code;
            return $model->name;
        } else {

            \LogModel::logAction(\LogOperation::MISSING_AIRLINE, null, 'ID:' . $carrier_id);
            return null;
        }
    }

    /**
     * Return the CC pass-through to be used with bookings via this Airline with the active company/client
     * @param int $userId User ID
     * @return Cc The CC object or null if no pass through is configured
     */
    function getCcPasstru($userId = null) {
        $userInfoId = null;
        $userTypeId = null;
        if ($userId) {
            $user = \Users::model()->findByPk($userId);
            if ($user !== null) {
                /* @var $user \Users */
                $userInfoId = $user->user_info_id;
                $userInfo = $user->userInfo;
                $userTypeId = $userInfo->user_type_id;
            }
        }

        // Single client pass-through check
        if ($userInfoId !== null) {
            $modelPt = CcPasstru::model()->findByAttributes([
                'user_info_id' => $userInfoId,
                'scope' => \CcPasstru::SCOPE_SINGLE_CLIENT,
                'carrier_id' => $this->id,
            ]);
            if ($modelPt !== null) {
//                echo \Utils::dbg($modelPt->attributes);
                return $modelPt->cc;
            }
        }

        // Specific client type client PT check
        if ($userTypeId !== null && !empty(\CcPasstru::$userTypeToScopeId[$userTypeId])) {
            $modelPt = CcPasstru::model()->findByAttributes([
                'scope' => \CcPasstru::$userTypeToScopeId[$userTypeId],
                'carrier_id' => $this->id,
            ]);
            if ($modelPt !== null) {
//                echo \Utils::dbg($modelPt->attributes);
                return $modelPt->cc;
            }
        }

        // All clients PT check
        $modelPt = CcPasstru::model()->findByAttributes([
            'scope' => \CcPasstru::SCOPE_ALL,
            'carrier_id' => $this->id,
        ]);
        if ($modelPt !== null) {
//            echo \Utils::dbg($modelPt->attributes);
            return $modelPt->cc;
        }

        // No PT has been found
        return null;
    }

}
