<?php

/**
 * This is the model class for table "commision_client_source".
 *
 * The followings are the available columns in table 'commision_client_source':
 * @property integer $id
 * @property integer $client_source_id
 * @property integer $type
 * @property integer $way_type
 * @property string $created
 * @property double $amount
 *
 * The followings are the available model relations:
 * @property ClientSource $clientSource
 */
class CommisionClientSource extends CActiveRecord
{
    const COMMISION_TYPE_FIXED=1;
    const COMMISION_TYPE_VAR=2;
    const WAYTYPE_DOMESTIC=1;
    const WAYTYPE_INTERNATIONAL=2;
    
    static $typeMap = [
        self::COMMISION_TYPE_FIXED => 'FIXED',
        self::COMMISION_TYPE_VAR => 'VARIABLE',
    ]; 
    static $waytypeMap = [
        self::WAYTYPE_DOMESTIC => 'DOMESTIC',
        self::WAYTYPE_INTERNATIONAL => 'INTERNATIONAL',
    ]; 
    
    
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'commision_client_source';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('client_source_id, type, way_type', 'numerical', 'integerOnly'=>true),
			array('amount', 'numerical'),
			array('created', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, client_source_id, type, way_type, created, amount', 'safe', 'on'=>'search'),
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
			'clientSource' => array(self::BELONGS_TO, 'ClientSource', 'client_source_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'client_source_id' => 'Client Source',
			'type' => 'Type',
			'way_type' => 'Way Type',
			'created' => 'Created',
			'amount' => 'Amount',
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
		$criteria->compare('client_source_id',$this->client_source_id);
		$criteria->compare('type',$this->type);
		$criteria->compare('way_type',$this->way_type);
		$criteria->compare('created',$this->created,true);
		$criteria->compare('amount',$this->amount);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return CommisionClientSource the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
        
        
}
