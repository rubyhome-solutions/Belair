<?php

/**
 * This is the model class for table "cart_status".
 *
 * The followings are the available columns in table 'cart_status':
 * @property integer $air_cart_id
 * @property integer $cart_status_id
 */
class CartStatus extends CActiveRecord
{
    const CART_STATUS_NEW = 1;
    const CART_STATUS_IN_PROCESS = 2;
    const CART_STATUS_ASK_DOCS = 3;
    const CART_STATUS_DOCS_RECEIVED = 4;
    const CART_STATUS_FARE_DIFF_SENT = 5;
    const CART_STATUS_FARE_DIFF_RECEIVED = 6;
    const CART_STATUS_TO_AMEND = 7;
    const CART_STATUS_TO_CANCEL = 8;
    const CART_STATUS_BOOKED = 9;
    const CART_STATUS_CANCELLED=10;
    
    
    static $cartStatusMap = [
        self::CART_STATUS_NEW => 'NEW',
        self::CART_STATUS_IN_PROCESS => 'IN PROCESS',
        self::CART_STATUS_ASK_DOCS => 'ASK DOCS SENT',
        self::CART_STATUS_DOCS_RECEIVED => 'DOCS RECVD',
        self::CART_STATUS_FARE_DIFF_SENT => 'FARE DIFF SENT',
        self::CART_STATUS_FARE_DIFF_RECEIVED => 'FARE DIFF RECVD',
        self::CART_STATUS_TO_AMEND => 'TO AMEND',
        self::CART_STATUS_TO_CANCEL => 'TO CANCEL',
        self::CART_STATUS_BOOKED => 'BOOKED',
        self::CART_STATUS_CANCELLED => 'CANCELLED',
        
    ];  
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'cart_status';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('air_cart_id', 'required'),
			array('air_cart_id, cart_status_id', 'numerical', 'integerOnly'=>true),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('air_cart_id, cart_status_id', 'safe', 'on'=>'search'),
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
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'air_cart_id' => 'Air Cart',
			'cart_status_id' => 'Cart Status',
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

		$criteria->compare('air_cart_id',$this->air_cart_id);
		$criteria->compare('cart_status_id',$this->cart_status_id);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return CartStatus the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
