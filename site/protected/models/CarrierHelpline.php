<?php

/**
 * This is the model class for table "carrier_helpline".
 *
 * The followings are the available columns in table 'carrier_helpline':
 * @property string $text
 * @property integer $carrier_id
 * @property string $code
 *
 * The followings are the available model relations:
 * @property Carrier $carrier
 */
class CarrierHelpline extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'carrier_helpline';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('text, carrier_id', 'required'),
            array('carrier_id', 'numerical', 'integerOnly' => true),
            array('code', 'length', 'max' => 2),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('text, carrier_id, code', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'text' => 'Text',
            'carrier_id' => 'Carrier',
            'code' => 'Code',
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

        $criteria->compare('text', $this->text, true);
        $criteria->compare('carrier_id', $this->carrier_id);
        $criteria->compare('code', $this->code, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CarrierHelpline the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
