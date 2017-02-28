<?php

/**
 * This is the model class for table "ticket_cards_rules_info".
 *
 * The followings are the available columns in table 'ticket_cards_rules_info':
 * @property integer $id
 * @property integer $ticket_rules_cards_id
 * @property integer $ticket_cards_info_id
 * @property integer $priority
 * @property integer $rule_days
 * @property string $remarks
 *
 * The followings are the available model relations:
 * @property TicketCardsInfo $ticketCardsInfo
 * @property TicketRulesCards $ticketRulesCards
 */
class TicketCardsRulesInfo extends CActiveRecord {

    //don't change the format of day name 
    static $daysArr = [
        "256" => "All",
        "2" => "Sun",
        "4" => "Mon",
        "8" => "Tue",
        "16" => "Wed",
        "32" => "Thu",
        "64" => "Fri",
        "128" => "Sat"
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'ticket_cards_rules_info';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('ticket_rules_cards_id, ticket_cards_info_id, priority, rule_days', 'numerical', 'integerOnly' => true),
            //['ticket_rules_cards_id, ticket_cards_info_id', 'ext.ECompositeUniqueValidator', 'message' => 'Record exists for this (Card, Rule) combination.'],
            array('remarks', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, ticket_rules_cards_id, ticket_cards_info_id, priority, rule_days, remarks', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'ticketCardsInfo' => array(self::BELONGS_TO, 'TicketCardsInfo', 'ticket_cards_info_id'),
            'ticketRulesCards' => array(self::BELONGS_TO, 'TicketRulesCards', 'ticket_rules_cards_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'ticket_rules_cards_id' => 'Ticket Rules Cards',
            'ticket_cards_info_id' => 'Ticket Cards Info',
            'priority' => 'Priority',
            'rule_days' => 'Rule Days',
            'remarks' => 'Remarks',
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
        $criteria->compare('ticket_rules_cards_id', $this->ticket_rules_cards_id);
        $criteria->compare('ticket_cards_info_id', $this->ticket_cards_info_id);
        $criteria->compare('priority', $this->priority);
        $criteria->compare('rule_days', $this->rule_days);
        $criteria->compare('remarks', $this->remarks, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => array('defaultOrder' => 'priority ASC,rule_days DESC'),
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TicketCardsRulesInfo the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    //for show selected days name list 
    public static function getSelectedDays($selected) {
        $days = self::$daysArr;
        //for get selected days
        $selectedArr = array();
        foreach ($days as $key => $val) {
            if ($key & $selected) {
                $selectedArr[] = $val;
            }
        }

        return implode(',', $selectedArr);
    }

}
