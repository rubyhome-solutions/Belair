<?php

/**
 * This is the model class for table "sub_users".
 *
 * The followings are the available columns in table 'sub_users':
 * @property integer $reseller_id
 * @property integer $distributor_id
 *
 * The followings are the available model relations:
 * @property UserInfo $distributor
 * @property UserInfo $reseller
 */
class SubUsers extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'sub_users';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('reseller_id, distributor_id', 'required'),
            // reseller_id should not be equal to distributor_id This do not makes sense otherwise
            array('reseller_id', 'compare', 'compareAttribute' => 'distributor_id', 'operator' => '!='),
            array('reseller_id, distributor_id', 'numerical', 'integerOnly' => true),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'distributor' => array(self::BELONGS_TO, 'UserInfo', 'distributor_id'),
            'reseller' => array(self::BELONGS_TO, 'UserInfo', 'reseller_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'reseller_id' => 'Reseller',
            'distributor_id' => 'Distributor',
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

        $criteria->compare('reseller_id', $this->reseller_id);
        $criteria->compare('distributor_id', $this->distributor_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return SubUsers the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
