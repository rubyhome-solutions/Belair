<?php

/**
 * This is the model class for table "bin_list".
 *
 * The followings are the available columns in table 'bin_list':
 * @property integer $bin
 * @property integer $type_id
 * @property string $sub_brand
 * @property string $country_code
 * @property string $country_name
 * @property string $bank
 * @property string $card_type
 * @property string $card_category
 * @property string $latitude
 * @property string $longitude
 * @property integer $domestic
 *
 * The followings are the available model relations:
 * @property CcType $type
 * @property Cc[] $ccs
 */
class BinList extends CActiveRecord {

    private $brand;

    const PROVIDER_URL = 'http://www.binlist.net/json/';

    static $brandToCcType = [
        'MASTERCARD' => CcType::TYPE_MASTERCARD,
        'AMERICAN EXPRESS' => CcType::TYPE_AMEX,
        'VISA' => CcType::TYPE_VISA,
        'DISCOVER' => CcType::TYPE_DINERS_CLUB,
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'bin_list';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('bin, type_id, country_code, country_name', 'required'),
            array('bin, type_id, domestic', 'numerical', 'integerOnly' => true),
            array('sub_brand, bank, card_type, card_category, latitude, longitude, brand', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('bin, type_id, country_code, country_name, bank, card_type, card_category, domestic', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'type' => array(self::BELONGS_TO, 'CcType', 'type_id'),
            'ccs' => array(self::HAS_MANY, 'Cc', 'bin_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'bin' => 'Bin',
            'type_id' => 'Type',
//            'sub_brand' => 'Sub Brand',
            'country_code' => 'Country Code',
            'country_name' => 'Country Name',
            'bank' => 'Bank',
            'card_type' => 'Card Type',
//            'card_category' => 'Card Category',
//            'latitude' => 'Latitude',
//            'longitude' => 'Longitude',
            'domestic' => 'Is Domestic',
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

        $criteria->compare('bin', $this->bin);
        $criteria->compare('type_id', $this->type_id);
//        $criteria->compare('LOWER(sub_brand)', strtolower($this->sub_brand), true);
        $criteria->compare('LOWER(country_code)', strtolower($this->country_code), true);
        $criteria->compare('LOWER(country_name)', strtolower($this->country_name), true);
        $criteria->compare('LOWER(bank)', strtolower($this->bank), true);
        $criteria->compare('LOWER(card_type)', strtolower($this->card_type), true);
        $criteria->compare('LOWER(card_category)', strtolower($this->card_category), true);
        $criteria->compare('domestic', $this->domestic);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return BinList the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function printHtml() {
        $out = '<table>';
        foreach ($this->attributeLabels() as $key => $value) {
            if ($key === 'type_id') {
                $data = $this->type->name;
            } elseif ($key === 'domestic') {
                $data = $this->domestic === 1 ? "Yes" : "No";
            } else {
                $data = $this->$key;
            }
            $out .= "<tr><td>$value</td><td>$data</td></tr>";
        }
        return $out . '</table>';
    }

    /**
     * Refresh the bin data from the provider and save it
     * @return string|boolean Error string or true on success
     */
    function refreshData() {
        $info = self::fetchData($this->bin);
        if ($info === false) {
            return "Can't access BinList API";
        }
        unset($info['query_time']);
//        Utils::dbgYiiLog($this->attributes);
        $this->attributes = $info;
        if (isset(self::$brandToCcType[$info['brand']])) {  // If the brand is recognized
            $this->type_id = self::$brandToCcType[$info['brand']];
//            Utils::dbgYiiLog($this->attributes);
            if ($this->country_code == Utils::DOMESTIC_COUNTRY_CODE) {
                $this->domestic = 1;
            }
            $this->save(false);
            return true;
        }
        return "Unknown card type: $this->brand";
    }

    static function insertIfMissing($bin) {
        $model = BinList::model()->findByPk($bin);
        if ($model === null) {
            $model = new BinList;
            $model->bin = (int) $bin;
            if ($model->refreshData() !== true) {
                // There is a problem witht he BinList API - use dummy data and refresh latter
                $model->country_code = Utils::DOMESTIC_COUNTRY_CODE;
                $model->country_name = 'India';
                $model->type_id = CcType::TYPE_MASTERCARD;
                $model->card_category = 'This is DUMMY data. Please refresh when BinList is available';
                $model->insert();
            }
            return true;    // New bin is added
        } else {
            return false;   // Nothing is added
        }
    }

    static function fetchData($bin) {
        $res = Utils::curl(self::PROVIDER_URL . $bin);
        if ($res['error']) {
            return false;
        }
        return json_decode($res['result'], true);
    }

}
