<?php

/**
 * This is the model class for table "commision_cs_cost".
 *
 * The followings are the available columns in table 'commision_cs_cost':
 * @property integer $cs_id
 * @property string $cost_date
 * @property double $avg_cost
 * @property integer $way_type
 *
 * The followings are the available model relations:
 * @property ClientSource $cs
 */
class CommisionCsCost extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'commision_cs_cost';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('cs_id, cost_date, way_type', 'required'),
			array('cs_id, way_type', 'numerical', 'integerOnly'=>true),
			array('avg_cost', 'numerical'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('cs_id, cost_date, avg_cost, way_type', 'safe', 'on'=>'search'),
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
			'cs' => array(self::BELONGS_TO, 'ClientSource', 'cs_id'),
		);
	}

        public function primaryKey(){
            return ['cs_id', 'cost_date','way_type'];
        }
    
	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'cs_id' => 'Cs',
			'cost_date' => 'Cost Date',
			'avg_cost' => 'Avg Cost',
			'way_type' => 'Way Type',
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

		$criteria->compare('cs_id',$this->cs_id);
		$criteria->compare('cost_date',$this->cost_date,true);
		$criteria->compare('avg_cost',$this->avg_cost);
		$criteria->compare('way_type',$this->way_type);

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return CommisionCsCost the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
