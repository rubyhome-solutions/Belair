<?php

/**
 * This is the model class for table "commision_gds_lcc".
 *
 * The followings are the available columns in table 'commision_gds_lcc':
 * @property integer $id
 * @property integer $carrier_id
 * @property double $amount
 * @property integer $type
 * @property integer $way_type
 * @property string $created
 *
 * The followings are the available model relations:
 * @property Carrier $carrier
 */
class CommisionGdsLcc extends CActiveRecord
{
    const COMMISION_TYPE_GDS=1;
    const COMMISION_TYPE_LCC=2;
    const WAYTYPE_DOMESTIC=1;
    const WAYTYPE_INTERNATIONAL=2;
    const GDS_DEFAULT='GDS_DEFAULT';
    const LCC_DEFAULT='LCC_DEFAULT';
    
    static $typeMap = [
        self::COMMISION_TYPE_GDS => 'GDS' ,
        self::COMMISION_TYPE_LCC => 'LCC' ,
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
		return 'commision_gds_lcc';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('carrier_id, type, way_type', 'numerical', 'integerOnly'=>true),
			array('amount', 'numerical'),
			array('created', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, carrier_id, amount, type, way_type, created', 'safe', 'on'=>'search'),
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
			'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'carrier_id' => 'Carrier',
			'amount' => 'Amount',
			'type' => 'Type',
			'way_type' => 'Way Type',
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
		$criteria->compare('carrier_id',$this->carrier_id);
		$criteria->compare('amount',$this->amount);
		$criteria->compare('type',$this->type);
		$criteria->compare('way_type',$this->way_type);
		$criteria->compare('created',$this->created,true);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return CommisionGdsLcc the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
        
        public static function getGDSDefault(){
            $param=\Params::model()->findByPk(self::GDS_DEFAULT);
            if($param!=null){
                return $param->info;
            }
            else{
                //\Utils::dbgYiiLog('Not found');
                return 0;
            }
        }
        
        public static function getLCCDefault(){
            //return \Params::findByPk(self::LCC_DEFAULT)->info;
            $param=\Params::model()->findByPk(self::LCC_DEFAULT);
            if($param!=null){
                return $param->info;
            }
            else{
                
                return 0;
            }
        }
}
