<?php

/**
 * This is the model class for table "promo_log".
 *
 * The followings are the available columns in table 'promo_log':
 * @property integer $id
 * @property integer $promo_codes_id
 * @property integer $air_cart_id
 * @property double $value
 * @property string $promo_code
 * @property string $data
 * @property string $created
 * @property integer $is_referred_paid
 *
 * The followings are the available model relations:
 * @property PromoCodes $promoCodes
 * @property AirCart $airCart
 */
class PromoLog extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'promo_log';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('promo_codes_id, air_cart_id, created', 'required'),
			array('promo_codes_id, air_cart_id,is_referred_paid', 'numerical', 'integerOnly'=>true),
			array('value', 'numerical'),
			array('promo_code', 'length', 'max'=>15),
			array('data', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, promo_codes_id, air_cart_id, value, promo_code, data, created', 'safe', 'on'=>'search'),
		);
	}

	/**
	 * @return array relational rules.
	 */
	public function relations()
	{
		// NOTE: you may need to adjust the relation name and the related
		// class name for the relations automatically generated below.
		return array(
			'promoCodes' => array(self::BELONGS_TO, 'PromoCodes', 'promo_codes_id'),
			'airCart' => array(self::BELONGS_TO, 'AirCart', 'air_cart_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'promo_codes_id' => 'Promo Codes',
			'air_cart_id' => 'Air Cart',
			'value' => 'Value',
			'promo_code' => 'Promo Code',
			'data' => 'Data',
			'created' => 'Created',
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
	public function search()
	{
		// @todo Please modify the following code to remove attributes that should not be searched.

		$criteria=new CDbCriteria;

		$criteria->compare('id',$this->id);
		$criteria->compare('promo_codes_id',$this->promo_codes_id);
		$criteria->compare('air_cart_id',$this->air_cart_id);
		$criteria->compare('value',$this->value);
		$criteria->compare('promo_code',$this->promo_code,true);
		$criteria->compare('data',$this->data,true);
		$criteria->compare('created',$this->created,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return PromoLog the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
