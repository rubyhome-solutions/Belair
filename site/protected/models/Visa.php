<?php

/**
 * This is the model class for table "visa".
 *
 * The followings are the available columns in table 'visa':
 * @property integer $id
 * @property integer $traveler_id
 * @property integer $issuing_country_id
 * @property string $number
 * @property string $issue_date
 * @property string $expire_date
 * @property string $type
 *
 * The followings are the available model relations:
 * @property Country $issuingCountry
 * @property Traveler $traveler
 */
class Visa extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'visa';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('traveler_id, issuing_country_id, type, number', 'required'),
            array('traveler_id, issuing_country_id', 'numerical', 'integerOnly' => true),
            array('issue_date, expire_date', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, traveler_id, issuing_country_id, number, issue_date, expire_date, type', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'issuingCountry' => array(self::BELONGS_TO, 'Country', 'issuing_country_id'),
            'traveler' => array(self::BELONGS_TO, 'Traveler', 'traveler_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'traveler_id' => 'Traveler',
            'issuing_country_id' => 'Issuing Country',
            'number' => 'Number',
            'issue_date' => 'Issue Date',
            'expire_date' => 'Expire Date',
            'type' => 'Type',
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
        $criteria->compare('traveler_id', $this->traveler_id);
        $criteria->compare('issuing_country_id', $this->issuing_country_id);
        $criteria->compare('number', $this->number, true);
        $criteria->compare('issue_date', $this->issue_date, true);
        $criteria->compare('expire_date', $this->expire_date, true);
        $criteria->compare('type', $this->type, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Visa the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
