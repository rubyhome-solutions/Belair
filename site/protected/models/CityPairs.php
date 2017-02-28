<?php

/**
 * This is the model class for table "city_pairs".
 *
 * The followings are the available columns in table 'city_pairs':
 * @property integer $source_id
 * @property integer $destination_id
 * @property integer $carrier_id
 * @property string $created
 *
 * The followings are the available model relations:
 * @property Airport $destination
 * @property Airport $source
 * @property Carrier $carrier
 */
class CityPairs extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'city_pairs';
    }

    public function primaryKey() {
        return ['source_id', 'destination_id', 'carrier_id'];
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        \Yii::import('ext.ECompositeUniqueValidator');
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('source_id, destination_id, carrier_id', 'required'),
            array('source_id, destination_id, carrier_id', 'numerical', 'integerOnly' => true),
            ['source_id, destination_id, carrier_id', 'ECompositeUniqueValidator', 'message' => 'This city pair already exists for this airline.'],
            ['source_id', 'compare', 'compareAttribute' => 'destination_id', 'operator' => '!=', 'message' => 'Origin and destination airports must be different!'],
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('source_id, destination_id, carrier_id, created', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'destination' => array(self::BELONGS_TO, 'Airport', 'destination_id'),
            'source' => array(self::BELONGS_TO, 'Airport', 'source_id'),
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'source_id' => 'Origin',
            'destination_id' => 'Destination',
            'carrier_id' => 'Carrier',
            'created' => 'Updated',
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
        $criteria->with = ['source', 'destination'];

        $criteria->compare('source.airport_code', strtoupper($this->source_id));
        $criteria->compare('destination.airport_code', strtoupper($this->destination_id));
        $criteria->compare('carrier_id', $this->carrier_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.carrier_id, t.source_id, t.destination_id'],
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CityPairs the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
