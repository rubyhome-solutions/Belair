<?php

/**
 * This is the model class for table "ticket_rules_airline".
 *
 * The followings are the available columns in table 'ticket_rules_airline':
 * @property integer $id
 * @property string $airline_code
 * @property string $iata_on_basic
 * @property string $airline_name
 * @property integer $source_a_agent_id
 * @property string $source_a_rbd
 * @property string $source_a_remark
 * @property integer $source_b_agent_id
 * @property string $source_b_rbd
 * @property string $source_b_remark
 * @property integer $source_c_agent_id
 * @property string $source_c_rbd
 * @property string $source_c_remark
 * @property string $created
 * @property string $notes_a
 * @property string $notes_b
 * @property string $notes_c
 *
 * The followings are the available model relations:
 * @property TicketRulesSources $sourceAAgent
 * @property TicketRulesSources $sourceBAgent
 * @property TicketRulesSources $sourceCAgent
 */
class TicketRulesAirline extends CActiveRecord
{
    public $notesString;
	/**
	 * @return string the associated database table name
	 */
	public function tableName()
	{
		return 'ticket_rules_airline';
	}

	/**
	 * @return array validation rules for model attributes.
	 */
	public function rules()
	{
		// NOTE: you should only define rules for those attributes that
		// will receive user inputs.
		return array(
			array('source_a_agent_id, source_b_agent_id, source_c_agent_id', 'numerical', 'integerOnly'=>true),
			array('iata_on_basic', 'length', 'max'=>10),
			array('airline_code, airline_name, source_a_rbd, source_a_remark, source_b_rbd, source_b_remark, source_c_rbd, source_c_remark,created,notes_a,notes_b,notes_c', 'safe'),
			// The following rule is used by search().
			// @todo Please remove those attributes that should not be searched.
			array('id, airline_code, iata_on_basic, airline_name, source_a_agent_id, source_a_rbd, source_a_remark, source_b_agent_id, source_b_rbd, source_b_remark, source_c_agent_id, source_c_rbd, source_c_remark, created,notes_a,notes_b,notes_c', 'safe', 'on'=>'search'),
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
			'sourceAAgent' => array(self::BELONGS_TO, 'TicketRulesSources', 'source_a_agent_id'),
			'sourceBAgent' => array(self::BELONGS_TO, 'TicketRulesSources', 'source_b_agent_id'),
			'sourceCAgent' => array(self::BELONGS_TO, 'TicketRulesSources', 'source_c_agent_id'),
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
			'airline_name' => 'Airline Name',
			'source_a_agent_id' => 'Source A Agent',
			'source_a_rbd' => 'Source A Rbd',
			'source_a_remark' => 'Source A Remark',
			'source_b_agent_id' => 'Source B Agent',
			'source_b_rbd' => 'Source B Rbd',
			'source_b_remark' => 'Source B Remark',
			'source_c_agent_id' => 'Source C Agent',
			'source_c_rbd' => 'Source C Rbd',
			'source_c_remark' => 'Source C Remark',
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
		$criteria->compare('airline_code',$this->airline_code,true);
		$criteria->compare('iata_on_basic',$this->iata_on_basic,true);
		$criteria->compare('airline_name',$this->airline_name,true);
		$criteria->compare('source_a_agent_id',$this->source_a_agent_id);
		$criteria->compare('source_a_rbd',$this->source_a_rbd,true);
		$criteria->compare('source_a_remark',$this->source_a_remark,true);
		$criteria->compare('source_b_agent_id',$this->source_b_agent_id);
		$criteria->compare('source_b_rbd',$this->source_b_rbd,true);
		$criteria->compare('source_b_remark',$this->source_b_remark,true);
		$criteria->compare('source_c_agent_id',$this->source_c_agent_id);
		$criteria->compare('source_c_rbd',$this->source_c_rbd,true);
		$criteria->compare('source_c_remark',$this->source_c_remark,true);
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
	 * @return TicketRulesAirline the static model class
	 */
	public static function model($className=__CLASS__)
	{
		return parent::model($className);
	}
        
        public function getNotesSource($source){
            if($source==1){
                     $str='';
                if(!empty($this->notes_a)){
                    
                    $arr=explode(',',$this->notes_a);
                    foreach ($arr as $value) {
                      $notesmodel=  \TicketRulesNotes::model()->findByPk((int)$value);
                    if($notesmodel!=null)
                      $str.=$notesmodel->note_id.", ";
                        //$str.=" Note ".$value.", ";
                     }
                      if(!empty($str)){
                       $str=substr($str, 0, -2);
                     }
                    return $str;
                }
            }
            else if($source==2){
                      $str='';
                if(!empty($this->notes_b)){
                    
                    $arr=explode(',',$this->notes_b);
                    foreach ($arr as $value) {
                         $notesmodel=  \TicketRulesNotes::model()->findByPk((int)$value);
                    if($notesmodel!=null)
                      $str.=$notesmodel->note_id.", ";
                        //$str.=" Note ".$value.", ";
                     }
                      if(!empty($str)){
                       $str=substr($str, 0, -2);
                     }
                    return $str;
                }
            }
            else if($source==3){
                     $str='';
                if(!empty($this->notes_c)){
                    
                    $arr=explode(',',$this->notes_c);
                    foreach ($arr as $value) {
                         $notesmodel=  \TicketRulesNotes::model()->findByPk((int)$value);
                    if($notesmodel!=null)
                      $str.=$notesmodel->note_id.", ";
                        //$str.=" Note ".$value.", ";
                     }
                     if(!empty($str)){
                       $str=substr($str, 0, -2);
                     }
                    return $str;
                }
            }
        }
        
        public function getNotesDetail() {
        $notes = [];

        if (!empty($this->notes_a)) {

            $arr = explode(',', $this->notes_a);
            foreach ($arr as $value) {
                if (!isset($notes[$value])) {
                    $notes[$value] = $value;
                }
            }
        }

        if (!empty($this->notes_b)) {

            $arr = explode(',', $this->notes_b);
            foreach ($arr as $value) {
                if (!isset($notes[$value])) {
                    $notes[$value] = $value;
                }
            }
        }

        if (!empty($this->notes_c)) {

            $arr = explode(',', $this->notes_c);
            foreach ($arr as $value) {
                if (!isset($notes[$value])) {
                    $notes[$value] = $value;
                }
            }
        }
        
        $notesarray=[];
        foreach($notes as $note){
            $notesModel=  \TicketRulesNotes::model()->findByPk((int)$note);
            if($notesModel){
                $notesarray[]=$notesModel;
            }
        }
        return $notesarray;
    }

}
