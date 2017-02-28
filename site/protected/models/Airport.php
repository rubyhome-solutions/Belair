<?php

/**
 * This is the model class for table "airport".
 *
 * The followings are the available columns in table 'airport':
 * @property integer $id
 * @property string $city_code
 * @property string $city_name
 * @property integer $airport_type
 * @property string $airport_name
 * @property string $airport_code
 * @property string $country_code
 * @property string $nameCode Return combination of city name and airport IATA code
 * @property string $is_top If the airport should pop on the top in searches
 * @property string $timezone The airport timezone
 *
 * The followings are the available model relations:
 * @property AirCart[] $airCarts
 * @property AirCart[] $airCarts1
 * @property AirRoutes[] $airRoutes
 * @property AirRoutes[] $airRoutes1
 */
class Airport extends CActiveRecord {

    const AIRPORT_DELHI = 1236;
    const AIRPORT_MUMBAI = 946;
    const AIRPORT_BANKOK = 4877;
    const AIRPORT_SIN = 897;

    static $carrierIDs = [];
    static $airportCityAndCodesFromCode = [];
    static $airportCityAndCodesFromId = [];
    static $airportCodesFromId = [];
    static $airportNameAndCityFromId = [];
    static $airportTimezone = [];

//    public $timezone;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'airport';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('city_code, airport_code, country_code', 'required'),
            array('airport_type, is_top', 'numerical', 'integerOnly' => true),
            array('city_code, airport_code', 'length', 'max' => 3),
            array('country_code', 'length', 'max' => 2),
            array('city_name, airport_name, timezone', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, city_code, city_name, airport_type, airport_name, airport_code, country_code, is_top, timezone', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airCarts' => array(self::HAS_MANY, 'AirCart', 'air_source_id'),
            'airCarts1' => array(self::HAS_MANY, 'AirCart', 'destination_id'),
            'airRoutes' => array(self::HAS_MANY, 'AirRoutes', 'air_source_id'),
            'airRoutes1' => array(self::HAS_MANY, 'AirRoutes', 'destination_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'city_code' => 'City Code',
            'city_name' => 'City Name',
            'airport_type' => 'Airport Type',
            'airport_name' => 'Airport Name',
            'airport_code' => 'Airport Code',
            'country_code' => 'Country Code',
            'is_top' => 'Popularity',
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

        $criteria->compare('city_code', strtoupper($this->city_code));
        $criteria->compare('city_name', $this->city_name);
        $criteria->compare('airport_type', $this->airport_type);
        $criteria->compare('is_top', $this->is_top);
        $criteria->compare('airport_name', $this->airport_name, true);
        $criteria->compare('airport_code', strtoupper($this->airport_code));
        $criteria->compare('country_code', strtoupper($this->country_code));
        $criteria->compare('timezone', $this->timezone);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Airport the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getNameCode() {
        return $this->city_name . " ($this->airport_code)";
    }

    /**
     * return the airport ID from 3 letters city code or airport code
     * @param string $code The search airport code or city code. 3 letters (BOM)
     * @param bool $insertOnMissing Shell we insert new Airport in case it is missing?
     * @return int ID of the airport or the city or null if not found
     */
    static function getIdFromCode($code, $insertOnMissing = true) {
        $code = strtoupper(trim($code));
        if (isset(self::$carrierIDs[$code])) {
            return self::$carrierIDs[$code];
        }
        $model = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $code]);
        if (!$model) {
            $model = \Airport::model()->cache(3600)->findByAttributes(['city_code' => $code]);
        }
        if (!$model) {
            if ($insertOnMissing) {
                \LogModel::logAction(\LogOperation::MISSING_AIRPORT, null, $code);
                $model = self::insertFakeAirport($code);
            } else {
                return null;
            }
        }
        self::$carrierIDs[$code] = $model->id;
        return $model->id;
    }

    static function getAirportCodeAndCityNameFromId($id) {
        if (isset(self::$airportCityAndCodesFromId[$id])) {
            return self::$airportCityAndCodesFromId[$id];
        }
        $model = Airport::model()->cache(3600)->findByPk($id);
        if ($model) {
            self::$airportCityAndCodesFromId[$id] = "{$model->city_name} ({$model->airport_code})";
            return "{$model->city_name} ({$model->airport_code})";
        } else {
            return null;
        }
    }

    static function getAirportCodeAndCityNameFromCode($code) {
        $code = strtoupper(trim($code));
        if (isset(self::$airportCityAndCodesFromCode[$code])) {
            return self::$airportCityAndCodesFromCode[$code];
        }
        $model = Airport::model()->cache(3600)->cache(3600)->findByAttributes(['airport_code' => $code]);
        if (!$model) {
            $model = Airport::model()->cache(3600)->findByAttributes(['city_code' => $code]);
        }
        if ($model) {
            self::$airportCityAndCodesFromCode[$code] = "{$model->city_name} ({$model->airport_code})";
            return "{$model->city_name} ({$model->airport_code})";
        } else {
            \LogModel::logAction(\LogOperation::MISSING_AIRPORT, null, $code);
            return null;
        }
    }

    /**
     * return the airport Name , City Name and Airport Code from airport id
     * @param string $code The search airport id or city code.
     * @return string airport Name , City Name and Airport Code or the city or null if not found
     */
    static function getAirportNameAndCityNameFromId($code) {
        $code = strtoupper(trim($code));
        if (isset(self::$airportNameAndCityFromId[$code])) {
            return self::$airportNameAndCityFromId[$code];
        }
        $model = Airport::model()->cache(3600)->findByPk($code);
        if (!$model) {
            $model = Airport::model()->cache(3600)->findByAttributes(['city_code' => $code]);
        }
        if ($model) {
            self::$airportNameAndCityFromId[$code] = "{$model->airport_name}, {$model->city_name} ({$model->airport_code})";
            return "{$model->airport_name}, {$model->city_name} ({$model->airport_code})";
        } else {
            \LogModel::logAction(\LogOperation::MISSING_AIRPORT, null, $code);
            return null;
        }
    }

    static function getAirportCodeFromId($id) {
        if (isset(self::$airportCodesFromId[$id])) {
            return self::$airportCodesFromId[$id];
        }
        $model = Airport::model()->cache(3600)->findByPk($id);
        if ($model) {
            self::$airportCodesFromId[$id] = $model->airport_code;
            return $model->airport_code;
        }
        return null;
    }

    /**
     * Check if the 2 airports make domestic pair
     * @param int $origin_id Airport ID of origination
     * @param int $destination_id Airport ID of destination
     * @return int Domestic pair = 1, all the rest is 0
     */
    static function isDomesticPair($origin_id, $destination_id) {
        $model1 = Airport::model()->cache(3600)->findByPk($origin_id);
        $model2 = Airport::model()->cache(3600)->findByPk($destination_id);
        if ($model1 && $model2 &&
                $model1->country_code === \Utils::DOMESTIC_COUNTRY_CODE &&
                $model2->country_code === \Utils::DOMESTIC_COUNTRY_CODE
        ) {
            return 1;
        }
        return 0;
    }

    /**
     * Decide the type of the service between 2 airports (domestic or international)
     * @param string $origin Airport of origin 3 letters (BOM)
     * @param string $destination Airport of destination 3 letters (BOM)
     * @return int The type of the service \ServiceType::DOMESTIC_AIR or \ServiceType::INTERNATIONAL_AIR
     */
    static function getServiceTypeIdFromCode($origin, $destination) {
        $origin = strtoupper(trim($origin));
        $destination = strtoupper(trim($destination));
        $model1 = self::model()->cache(3600)->findByAttributes(['airport_code' => $origin]);
        if ($model1 === null) {
            $model1 = self::model()->cache(3600)->findByAttributes(['city_code' => $origin]);
        }
        $model2 = self::model()->cache(3600)->findByAttributes(['airport_code' => $destination]);
        if ($model2 === null) {
            $model2 = self::model()->cache(3600)->findByAttributes(['city_code' => $destination]);
        }
        if ($model1 && $model2 &&
                $model1->country_code === \Utils::DOMESTIC_COUNTRY_CODE &&
                $model2->country_code === \Utils::DOMESTIC_COUNTRY_CODE
        ) {
            return \ServiceType::DOMESTIC_AIR;
        }
        return \ServiceType::INTERNATIONAL_AIR;
    }

    /**
     * Insert fake airport for a given 3 letter code
     * @return \Airport
     */
    static function insertFakeAirport($code) {
        $code = substr(strtoupper(trim($code)), 0, 3);
        $model = \Airport::model()->findByAttributes(['airport_code' => $code]);
        if ($model === null) {
            $model = new \Airport;
            $model->country_code = 'XX';
            $model->city_code = $code;
            $model->city_name = 'City';
            $model->airport_code = $code;
            $model->airport_name = 'Airport';
            $model->insert();
        }
        return $model;
    }

    static function getTimezoneByCode($code) {
        $code = strtoupper(trim($code));
        if (isset(self::$airportTimezone[$code])) {
            return self::$airportTimezone[$code];
        }

        $model = Airport::model()->cache(3600)->findByAttributes(['airport_code' => $code]);
        if (!$model) {
            $model = Airport::model()->cache(3600)->findByAttributes(['city_code' => $code]);
        }

        if ($model) {
            return self::$airportTimezone[$code] = $model->timezone;
        } else {
            \LogModel::logAction(\LogOperation::MISSING_AIRPORT, null, $code);
            return null;
        }
    }
}

?>