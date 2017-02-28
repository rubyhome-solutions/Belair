<?php

/**
 * This is the model class for table "ticket_cards_info".
 *
 * The followings are the available columns in table 'ticket_cards_info':
 * @property integer $id
 * @property string $card_type
 * @property string $card_no
 * @property integer $exp_month
 * @property integer $exp_year
 * @property integer $status
 * @property string $created
 * 
 * The followings are the available model relations:
 * @property TicketCardsRulesInfo[] $ticketCardsRulesInfos
 */
class TicketCardsInfo extends CActiveRecord {

    const CARD_ACTIVE = 1;
    const CARD_INACTIVE = 0;

    static $InActMap = [
        self::CARD_ACTIVE => 'Active',
        self::CARD_INACTIVE => 'InActive',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'ticket_cards_info';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('card_no, exp_month, exp_year, card_type', 'required'),
            array('exp_month, exp_year, status', 'numerical', 'integerOnly' => true),
            array('card_no', 'length', 'max' => 20),
            array('card_type', 'length', 'max' => 200),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, card_type, card_no, exp_month, exp_year, status, created', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'ticketCardsRulesInfos' => array(self::HAS_MANY, 'TicketCardsRulesInfo', 'ticket_cards_info_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'card_type' => 'Card Type',
            'card_no' => 'Card No',
            'exp_month' => 'Exp Month',
            'exp_year' => 'Exp Year',
            'status' => 'Status',
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
    public function search() {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id', $this->id);
        $criteria->compare('card_type', $this->card_type, true);
        $criteria->compare('card_no', $this->card_no, true);
        $criteria->compare('exp_month', $this->exp_month);
        $criteria->compare('exp_year', $this->exp_year);
        $criteria->compare('status', $this->status);
        $criteria->compare('created', $this->created, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TicketRulesCardsInfo the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getExpiry() {
        $mon = (strlen($this->exp_month) > 1) ? $this->exp_month:'0' . $this->exp_month ;
        return $mon . '/'. (substr($this->exp_year,-2));
    }


}
