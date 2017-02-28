<?php

/**
 * This is the model class for table "payment_convenience_fee".
 *
 * The followings are the available columns in table 'payment_convenience_fee':
 * @property integer $id
 * @property integer $client_source_id
 * @property double $fixed
 * @property double $perc
 * @property integer $payment_type
 * @property string $payment_sub_type
 * @property string $created
 * @property integer $journey_type
 * @property integer $per_passenger
 * @property integer $commercial_rule_id
 *
 * The followings are the available model relations:
 * @property ClientSource $clientSource
 */
class PaymentConvenienceFee extends CActiveRecord {
    
    const WAYTYPE_ALL=0;
    const WAYTYPE_DOMESTIC=1;
    const WAYTYPE_INTERNATIONAL=2;
    
    const ACTIVE=1;
    const INACTIVE=0;
    
    const DEFAULT_RULE_ID = -1;
    
    static $waytypeMap = [
        self::WAYTYPE_ALL => 'All',
        self::WAYTYPE_DOMESTIC => 'Domestic',
        self::WAYTYPE_INTERNATIONAL => 'International'
    ];
    
    static $perPassengerMap = [
        self::ACTIVE => 'Yes',
        self::INACTIVE => 'No',
    ];
    
    
    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'payment_convenience_fee';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('client_source_id, payment_type, journey_type, per_passenger, commercial_rule_id', 'numerical', 'integerOnly' => true),
            ['fixed', 'numerical', 'min' => 0],
            ['perc', 'numerical', 'min' => 0, 'max' => 100],
            ['payment_sub_type', 'length', 'max'=>10],
            ['payment_type, journey_type, client_source_id, payment_sub_type, commercial_rule_id', 'ext.ECompositeUniqueValidator', 'message' => 'Convenience Fee exists for this (Client Source, Journey, Payment Category & Payment type) combination.'],
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, client_source_id, fixed, perc, payment_type, payment_sub_type, created, journey_type, per_passenger, commercial_rule_id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'clientSource' => array(self::BELONGS_TO, 'ClientSource', 'client_source_id'),
            'commercialRule' => array(self::BELONGS_TO, 'CommercialRule', 'commercial_rule_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'client_source_id' => 'Client Source',
            'fixed' => 'Fixed',
            'perc' => 'Percentage',
            'payment_type' => 'Payment Category',
            'payment_sub_type' => 'Payment Type',
            'created' => 'Created',
            'journey_type' => 'Journey',
            'per_passenger' => 'Per Passenger',
            'commercial_rule_id' => 'Commercial Rule',
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
        $criteria->compare('client_source_id', $this->client_source_id);
        $criteria->compare('fixed', $this->fixed);
        $criteria->compare('perc', $this->perc);
        $criteria->compare('payment_type', $this->payment_type);
        $criteria->compare('payment_sub_type',$this->payment_sub_type,true);
        $criteria->compare('created', $this->created, true);
        $criteria->compare('journey_type',$this->journey_type);
        $criteria->compare('per_passenger',$this->per_passenger);
        if(empty($this->commercial_rule_id)) {
            $this->commercial_rule_id = self::DEFAULT_RULE_ID;
        } 
        $criteria->compare('commercial_rule_id',$this->commercial_rule_id);
        
        $criteria->order='client_source_id, journey_type, payment_type ASC';
        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return PaymentConvenienceFee the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
