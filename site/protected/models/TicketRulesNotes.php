<?php

/**
 * This is the model class for table "ticket_rules_notes".
 *
 * The followings are the available columns in table 'ticket_rules_notes':
 * @property integer $id
 * @property string $airline_code
 * @property string $iata_on_basic
 * @property string $instructions
 * @property string $created
 * @property string $airline_with_remarks
 * @property string $note_id
 * The followings are the available model relations:
 */
class TicketRulesNotes extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'ticket_rules_notes';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('iata_on_basic', 'length', 'max'=>20),
			array('airline_code, instructions, airline_with_remarks,created,note_id', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, airline_code, iata_on_basic, instructions, created, airline_with_remarks,note_id', 'safe', 'on'=>'search'),
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
			'id' => 'ID',
			'airline_code' => 'Airline Code',
			'iata_on_basic' => 'Iata On Basic',
			'instructions' => 'Instructions',
			'created' => 'Created',
			'airline_with_remarks' => 'Airline With Remarks',
                        'note_id'=>'Note Id'
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
		$criteria->compare('airline_code',$this->airline_code,true);
		$criteria->compare('iata_on_basic',$this->iata_on_basic,true);
		$criteria->compare('instructions',$this->instructions,true);
		$criteria->compare('created',$this->created,true);
		$criteria->compare('airline_with_remarks',$this->airline_with_remarks,true);
                $criteria->compare('note_id',$this->note_id,true);
                $criteria->order = 'id  ASC';

		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return TicketRulesNotes the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
        
        
}
