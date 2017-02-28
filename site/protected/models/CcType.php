<?php

/**
 * This is the model class for table "cc_type".
 *
 * The followings are the available columns in table 'cc_type':
 * @property integer $id
 * @property string $name
 * @property string $code
 * @property string $validator
 *
 * The followings are the available model relations:
 * @property Cc[] $ccs
 */
class CcType extends CActiveRecord {

    const TYPE_MASTERCARD = 1;
    const TYPE_AMEX = 2;
    const TYPE_VISA = 3;
    const TYPE_DINERS_CLUB = 4;
    const TYPE_DISCOVER = 5;
    const TYPE_SWITCH = 6;
    const TYPE_RUPAY = 7;

    static $ccTypeIdToPauyName = [
        self::TYPE_MASTERCARD => 'MASTERCARD',
        self::TYPE_AMEX => 'AMEX',
        self::TYPE_VISA => 'VISA',
        self::TYPE_DINERS_CLUB => 'DINERS',
        self::TYPE_DISCOVER => 'DISCOVER',
        self::TYPE_RUPAY => 'RUPAY',
    ];

    static $ccTypeIdToAxisName = [
        self::TYPE_MASTERCARD => 'Mastercard',
        self::TYPE_AMEX => 'Amex',
        self::TYPE_VISA => 'Visa',
        self::TYPE_DINERS_CLUB => 'Dinersclub',
        self::TYPE_DISCOVER => 'Discover',
        self::TYPE_RUPAY => 'Rupay',
    ];

    static $ccTypeIdToGdsCode = [
        self::TYPE_MASTERCARD => 'CA',
        self::TYPE_AMEX => 'AX',
        self::TYPE_VISA => 'VI',
        self::TYPE_DINERS_CLUB => 'DC',
        self::TYPE_DISCOVER => 'DS',
        self::TYPE_RUPAY => 'RU',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'cc_type';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name, code', 'required'),
            array('validator', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name, code, validator', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'ccs' => array(self::HAS_MANY, 'Cc', 'type_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Name',
            'code' => 'Code',
            'validator' => 'Validator',
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
        $criteria->compare('code', $this->code, true);
        $criteria->compare('validator', $this->validator, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CcType the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
