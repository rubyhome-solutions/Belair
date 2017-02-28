<?php

/**
 * This is the model class for table "backend".
 *
 * The followings are the available columns in table 'backend':
 * @property integer $id
 * @property string $name
 * @property string $search
 * @property string $book
 * @property string $hold
 * @property string $pnr_acquisition
 * @property string $api_source
 * @property string $pnr_resync
 * @property string $pnr_cancel
 * @property string $pnr_list
 * @property string $pnr_book
 * @property string $wsdl_file
 * @property string $pnr_load
 * @property string $balance
 * @property boolean $isGds
 * @property boolean $isAmadeus Is this Amadeus backend
 * @property boolean $isGoair Is this Goair backend
 * @property string $city_pairs
 * @property integer $carrier_id
 *
 * The followings are the available model relations:
 * @property AirSource[] $airSources
 * @property Carrier $carrier
 */
class Backend extends CActiveRecord {

    const INDIGO_PRODUCTION = 1;
    const INDIGO_TEST = 2;
    const SPICEJET_PRODUCTION = 3;
    const SPICEJET_TEST = 4;
    const GALILEO_PRODUCTION = 5;
    const GALILEO_TEST = 6;
    const AMADEUS_PRODUCTION = 7;
    const AMADEUS_TEST = 8;
    const GOAIR_PRODUCTION = 9;
    const GOAIR_TEST = 10;
    const INDIGO_SCRAPPER = 11;
    const SPICEJET_SCRAPPER = 12;
    const FLYDUBAI_TEST = 16;
    const FLYDUBAI_PRODUCTION = 17;
    const AMADEUS_TEST_V2 = 18;
    const AMADEUS_PRODUCTION_V2 = 19;
    
    static $gdsIds = [
        self::AMADEUS_TEST,
        self::AMADEUS_PRODUCTION,
        self::GALILEO_TEST,
        self::GALILEO_PRODUCTION,
        self::AMADEUS_TEST_V2,
        self::AMADEUS_PRODUCTION_V2,
    ];
    static $amadeusIds = [
        self::AMADEUS_TEST,
        self::AMADEUS_PRODUCTION,
        self::AMADEUS_TEST_V2,
        self::AMADEUS_PRODUCTION_V2,
    ];
    static $economyClassOnly = [
        self::INDIGO_PRODUCTION,
        self::INDIGO_TEST,
        self::INDIGO_SCRAPPER,
        self::SPICEJET_PRODUCTION,
        self::SPICEJET_TEST,
        self::SPICEJET_SCRAPPER,
    ];

    static $premiumEconomyClassCapable = [
        self::AMADEUS_PRODUCTION,
        self::AMADEUS_PRODUCTION_V2,
        self::AMADEUS_TEST,
        self::AMADEUS_TEST_V2,
        self::GALILEO_TEST,
        self::GALILEO_PRODUCTION,
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'backend';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            array('search, book, hold', 'safe'),
                // The following rule is used by search().
                // @todo Please remove those attributes that should not be searched.
//            array('id, name, search, book, hold', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return [
            'airSources' => [self::HAS_MANY, 'AirSource', 'backend_id'],
            'carrier' => [self::BELONGS_TO, 'Carrier', 'carrier_id'],
        ];
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Name',
            'search' => 'Search',
            'book' => 'Book',
            'hold' => 'Hold',
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
        $criteria->compare('name', $this->name, true);
        $criteria->compare('search', $this->search, true);
        $criteria->compare('book', $this->book, true);
        $criteria->compare('hold', $this->hold, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Backend the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    function getIsScrapper() {
        return strstr($this->name, 'scrapper') !== false;
    }

    /**
     * return true is the backend is servicing any of the GDSes
     * @return boolean
     */
    function getIsGds() {
        return in_array($this->id, self::$gdsIds);
    }

    /**
     * return true is the backend is servicing Amadeus GDS
     * @return boolean
     */
    function getIsAmadeus() {
        return in_array($this->id, self::$amadeusIds);
    }

    /**
     * return true is the backend is servicing Goair LLC
     * @return boolean
     */
    function getIsGoair() {
        return in_array($this->id, [self::GOAIR_PRODUCTION, self::GOAIR_TEST]);
    }

    /**
     * return true is the backend is servicing Flydubai LLC
     * @return boolean
     */
    function getIsFlydubai() {
        return in_array($this->id, [self::FLYDUBAI_PRODUCTION, self::FLYDUBAI_TEST]);
    }

    /**
     * Can this backend service this sector. Is there flights between the source and the destination
     * @param string $source 3 letter origin airport code
     * @param string $destination 3 letter destination airport code
     * @return boolean True if sourece and destination pair has flights
     */
    function isSectorServicable($source, $destination) {
        if ($this->isGds || empty($this->carrier_id)) {
            return true;    // GDSes can service all sectors
        }
        $sourceId = \Airport::getIdFromCode($source);
        $destinationId = \Airport::getIdFromCode($destination);
        if ($sourceId && $destinationId) {
            $pair = \CityPairs::model()->cache(3600)->findByAttributes([
                'carrier_id' => $this->carrier_id,
                'source_id' => $sourceId,
                'destination_id' => $destinationId,
            ]);
            return $pair !== null;
        }

        return false;
    }

    /**
     * Can this backend service specifc cabin class
     * @param int $cabinCategory
     * @return boolean
     */
    function isCategoryServicable($cabinCategory) {
        if ($cabinCategory == \CabinType::PREMIUM_ECONOMY && in_array($this->id, self::$premiumEconomyClassCapable)) {
            return true;
        }
        if ($cabinCategory != \CabinType::ECONOMY && in_array($this->id, self::$economyClassOnly)) {
            return false;
        }
        return true;
    }

}
