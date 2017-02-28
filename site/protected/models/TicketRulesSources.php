<?php

/**
 * This is the model class for table "ticket_rules_sources".
 *
 * The followings are the available columns in table 'ticket_rules_sources':
 * @property integer $id
 * @property string $agent_name
 * @property string $amadeus_pcc
 * @property string $gal_pcc
 * @property string $contact
 * @property string $email
 * @property string $office
 * @property string $night_ctc
 * @property string $mobile_no
 * @property string $created
 *
 * The followings are the available model relations:
 * @property TicketRulesAirline[] $ticketRulesAirlines
 * @property TicketRulesAirline[] $ticketRulesAirlines1
 * @property TicketRulesAirline[] $ticketRulesAirlines2
 */
class TicketRulesSources extends CActiveRecord
{
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'ticket_rules_sources';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('amadeus_pcc, gal_pcc', 'length', 'max'=>200),
			array('agent_name, contact, email, office, night_ctc, mobile_no,created', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, agent_name, amadeus_pcc, gal_pcc, contact, email, office, night_ctc, mobile_no, created', 'safe', 'on'=>'search'),
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
			'ticketRulesAirlines' => array(self::HAS_MANY, 'TicketRulesAirline', 'source_a_agent_id'),
			'ticketRulesAirlines1' => array(self::HAS_MANY, 'TicketRulesAirline', 'source_b_agent_id'),
			'ticketRulesAirlines2' => array(self::HAS_MANY, 'TicketRulesAirline', 'source_c_agent_id'),
		);
	}

	/**
	 * @return array customized attribute labels (name=>label)
	 */
	public function attributeLabels()
	{
		return array(
			'id' => 'ID',
			'agent_name' => 'Agent Name',
			'amadeus_pcc' => 'Amadeus Pcc',
			'gal_pcc' => 'Gal Pcc',
			'contact' => 'Contact',
			'email' => 'Email',
			'office' => 'Office',
			'night_ctc' => 'Night Ctc',
			'mobile_no' => 'Mobile No',
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
		$criteria->compare('agent_name',$this->agent_name,true);
		$criteria->compare('amadeus_pcc',$this->amadeus_pcc,true);
		$criteria->compare('gal_pcc',$this->gal_pcc,true);
		$criteria->compare('contact',$this->contact,true);
		$criteria->compare('email',$this->email,true);
		$criteria->compare('office',$this->office,true);
		$criteria->compare('night_ctc',$this->night_ctc,true);
		$criteria->compare('mobile_no',$this->mobile_no,true);
		$criteria->compare('created',$this->created,true);
                $criteria->order = 'id  ASC';
		return new CActiveDataProvider($this, array(
			'criteria'=>$criteria,
		));
	}

	/**
	 * Returns the static model of the specified AR class.
	 * Please note that you should have this exact method in all your CActiveRecord descendants!
	 * @param string $className active record class name.
	 * @return TicketRulesSources the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
}
