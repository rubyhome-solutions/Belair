<?php

/**
 * This is the model class for table "ticket_rules_cards".
 *
 * The followings are the available columns in table 'ticket_rules_cards':
 * @property integer $id
 * @property integer $airline_id
 * @property integer $amex_pax_card
 * @property integer $amex_belair_card
 * @property integer $amex_slip
 * @property integer $master_pax_card
 * @property integer $master_belair_card
 * @property integer $master_slip
 * @property integer $journey_type
 * 
 * The followings are the available model relations:
 * @property Carrier $airline
 * @property TicketCardsRulesInfo[] $ticketCardsRulesInfos
 */
class TicketRulesCards extends CActiveRecord {

    const CARD_YES = 1;
    const CARD_NO = 2;

    static $yesNoMap = [
        self::CARD_NO => 'No',
        self::CARD_YES => 'Yes',
    ];
    
    static $journey = [
        \PaymentConvenienceFee::WAYTYPE_DOMESTIC => 'Domestic',
        \PaymentConvenienceFee::WAYTYPE_INTERNATIONAL => 'International'
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'ticket_rules_cards';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('airline_id, journey_type', 'required'),
            ['airline_id, journey_type', 'ext.ECompositeUniqueValidator', 'message' => 'Rules exists for this (Airline, Journey) combination.'],
            array('airline_id,  journey_type', 'numerical', 'integerOnly' => true),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, airline_id, journey_type', 'safe', 'on' => 'search'),
            array('id, airline_id, journey_type', 'safe'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airline' => array(self::BELONGS_TO, 'Carrier', 'airline_id'),
            'ticketCardsRulesInfos' => array(self::HAS_MANY, 'TicketCardsRulesInfo', 'ticket_rules_cards_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'airline_id' => 'Airline',
            'journey_type' => 'Journey Type',
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
        $criteria->compare('airline_id', $this->airline_id);
        $criteria->compare('journey_type', $this->journey_type);
        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TicketRulesCards the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }
}
