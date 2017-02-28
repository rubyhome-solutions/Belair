<?php

/**
 * This is the model class for table "service_type".
 *
 * The followings are the available columns in table 'service_type':
 * @property integer $id
 * @property string $name
 *
 * The followings are the available model relations:
 * @property RoutesCache[] $routesCaches
 * @property AirBooking[] $airBookings
 */
class ServiceType extends CActiveRecord {

    const DOMESTIC_AIR = 1;
    const INTERNATIONAL_AIR = 2;
    
    static $airTypes = [
        self::DOMESTIC_AIR => 'Domestic',
        self::INTERNATIONAL_AIR => 'International',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'service_type';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'routesCaches' => array(self::HAS_MANY, 'RoutesCache', 'service_type_id'),
            'airBookings' => array(self::HAS_MANY, 'AirBooking', 'service_type_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Name',
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

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return ServiceType the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Decide the air service type based on the origin and destination airports
     * @param int $originId
     * @param int $destinationId
     * @return int Domestic or International service type id
     */
    static function getServiceType($originId, $destinationId) {
        $origin = Airport::model()->findByPk($originId);
        $destination = Airport::model()->findByPk($destinationId);
        if (!$origin || !$destination) {
            return false;
        }
        if ($origin->country_code == Utils::DOMESTIC_COUNTRY_CODE &&
                $destination->country_code == Utils::DOMESTIC_COUNTRY_CODE) {
            return self::DOMESTIC_AIR;
        } else {
            return self::INTERNATIONAL_AIR;
        }
    }

}
