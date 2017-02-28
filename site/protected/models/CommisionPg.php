<?php

/**
 * This is the model class for table "commision_pg".
 *
 * The followings are the available columns in table 'commision_pg':
 * @property integer $id
 * @property integer $pg_id
 * @property double $amount
 * @property integer $type
 * @property string $created
 *
 * The followings are the available model relations:
 * @property PaymentGateway $pg
 */
class CommisionPg extends CActiveRecord
{
    const COMMISION_TYPE_FIXED=1;
    const COMMISION_TYPE_VAR=2;
    
    static $typeMap = [
        self::COMMISION_TYPE_FIXED => 'FIXED',
        self::COMMISION_TYPE_VAR => 'VARIABLE',
    ]; 
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'commision_pg';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('pg_id, type', 'numerical', 'integerOnly'=>true),
			array('amount', 'numerical'),
			array('created', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, pg_id, amount, type, created', 'safe', 'on'=>'search'),
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
			'pg' => array(self::BELONGS_TO, 'PaymentGateway', 'pg_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'pg_id' => 'Pg',
			'amount' => 'Amount',
			'type' => 'Type',
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
		$criteria->compare('pg_id',$this->pg_id);
		$criteria->compare('amount',$this->amount);
		$criteria->compare('type',$this->type);
		$criteria->compare('created',$this->created,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return CommisionPg the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
        
        
}
