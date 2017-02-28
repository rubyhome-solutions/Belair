<?php

/**
 * This is the model class for table "promo_range".
 *
 * The followings are the available columns in table 'promo_range':
 * @property integer $id
 * @property integer $promo_code_id
 * @property integer $discount_type
 * @property double $transaction_amt_from
 * @property double $transaction_amt_to
 * @property double $discount_value
 * @property double $max_discount_value
 *
 * The followings are the available model relations:
 * @property PromoCodes $promoCode
 */
class PromoRange extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'promo_range';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        \Yii::import('ext.ECompositeUniqueValidator');
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('promo_code_id, discount_type', 'numerical', 'integerOnly' => true),
            array('transaction_amt_from, transaction_amt_to, discount_value, max_discount_value', 'numerical'),
            ['promo_code_id, discount_type, transaction_amt_from, transaction_amt_to, discount_value, max_discount_value', 'ECompositeUniqueValidator', 'message' => 'This promo range already exists.'],
            ['transaction_amt_from', 'compare', 'compareAttribute' => 'transaction_amt_to', 'operator' => '!=', 'message' => 'Amount from and Amount to must be different!'],
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, promo_code_id, discount_type, transaction_amt_from, transaction_amt_to, discount_value, max_discount_value', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'promoCode' => array(self::BELONGS_TO, 'PromoCodes', 'promo_code_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'promo_code_id' => 'Promo Code',
            'discount_type' => 'Discount Type',
            'transaction_amt_from' => 'Amount Range From',
            'transaction_amt_to' => 'Amount Range To',
            'discount_value' => 'Discount Value',
            'max_discount_value' => 'Max Discount Value',
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
        $criteria->compare('promo_code_id', $this->promo_code_id);
        $criteria->compare('discount_type', $this->discount_type);
        $criteria->compare('transaction_amt_from', $this->transaction_amt_from);
        $criteria->compare('transaction_amt_to', $this->transaction_amt_to);
        $criteria->compare('discount_value', $this->discount_value);
        $criteria->compare('max_discount_value', $this->max_discount_value);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return PromoRange the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
