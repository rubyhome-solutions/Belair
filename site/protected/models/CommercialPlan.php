<?php

/**
 * This is the model class for table "commercial_plan".
 *
 * The followings are the available columns in table 'commercial_plan':
 * @property integer $id
 * @property string $name
 *
 * The followings are the available model relations:
 * @property CommercialRule[] $commercialRules
 * @property UserInfo[] $userInfos
 */
class CommercialPlan extends CActiveRecord {
    
    const PLAN_B2C = 'B2C';

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'commercial_plan';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, name', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'commercialRules' => array(self::MANY_MANY, 'CommercialRule', 'commercial_x_rule(plan_id, rule_id)'),
            'userInfos' => array(self::HAS_MANY, 'UserInfo', 'commercial_plan_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'name' => 'Plan name',
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

//        $criteria->compare('id', $this->id);
        $criteria->compare('LOWER(name)', strtolower($this->name), true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.name']
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CommercialPlan the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Test if we have applicable commercial rules and apply the first specific that match.
     * @param \AirBooking $airBooking The AirBooking object that the plan has to be applyed to
     * @param int $clientSourceId The source of the client, direct by default
     */
    function applyPlan(\AirBooking &$airBooking, $clientSourceId = \ClientSource::SOURCE_DIRECT) {
        // Check and exit if the AirBooking has CommercialRule already applyed to it
        if ($airBooking->commercial_rule_id !== null) {
            return false;
        }
        $rules = Yii::app()->db->createCommand()->select('id')->from('commercial_rule')
                        ->join('commercial_x_rule', 'commercial_x_rule.rule_id = commercial_rule.id')
                        ->where('commercial_x_rule.plan_id=:planID AND '
                                . '(commercial_rule.air_source_id=:airSourceID OR commercial_rule.air_source_id IS NULL) AND '
                                . '(commercial_rule.carrier_id=:carrierID OR commercial_rule.carrier_id IS NULL) AND '
                                . '(commercial_rule.service_type_id=:serviceTypeID OR commercial_rule.service_type_id IS NULL) AND '
                                . '(commercial_rule.client_source_id=:clientSourceID OR commercial_rule.client_source_id IS NULL)', [
                            ':planID' => $this->id,
                            ':airSourceID' => $airBooking->air_source_id,
                            ':carrierID' => $airBooking->carrier_id,
                            ':serviceTypeID' => $airBooking->service_type_id,
                            ':clientSourceID' => $clientSourceId,
                        ])->order('carrier_id, client_source_id, service_type_id, air_source_id, order_')->queryAll();

        foreach ($rules as $row) {
            $rule = \CommercialRule::model()->cache(60)->findByPk($row['id']);
            /* @var $rule \CommercialRule */
            $filter = new \CommercialFilter($rule->filter);
            if ($filter->matchAirBooking($airBooking)) {
                // Calculate and apply the rule
                $rule->applyRuleToAirBooking($airBooking);
                // Exit once the rule is applyed
                return;
            }
        }
    }

    /**
     * Apply the commercial plan to set of RouteCache objects
     * @param array $arrRcs Array of journeys of array of RCs, where every pax type has different RC
     * @param int $clientSource The source of the client
     */
    function applyPlanToRcJourneys(array &$arrRcs, $clientSource) {
        foreach ($arrRcs as $journeys) {
            foreach ($journeys as $journey) {
                foreach ($journey as $rc) {
                    $this->applyPlanToRouteCache($rc, $clientSource);
                }
            }
        }
    }

    /**
     * Test if we have applicable commercial rules and apply the first specific that match.
     * @param \RoutesCache &$routeCache The RouteCache object that the plan has to be applyed to
     * @param int $clientSourceId Client source ID
     */
    function applyPlanToRouteCache(\RoutesCache &$routeCache, $clientSourceId = \ClientSource::SOURCE_DIRECT) {
        // Check and exit if the RoutCache has CommercialRule already applyed to it
        if ($routeCache->commercial_rule_id !== null) {
            return false;
        }
        settype($clientSourceId, 'int');
        $rules = Yii::app()->db->cache(60)->createCommand()->select('id')->from('commercial_rule')
                        ->join('commercial_x_rule', 'commercial_x_rule.rule_id = commercial_rule.id')
                        ->where('commercial_x_rule.plan_id=:planID AND '
                                . '(commercial_rule.air_source_id=:airSourceID OR commercial_rule.air_source_id IS NULL) AND '
                                . '(commercial_rule.carrier_id=:carrierID OR commercial_rule.carrier_id IS NULL) AND '
                                . '(commercial_rule.service_type_id=:serviceTypeID OR commercial_rule.service_type_id IS NULL) AND '
                                . '(commercial_rule.client_source_id=:clientSourceID OR commercial_rule.client_source_id IS NULL)', [
                            ':planID' => $this->id,
                            ':airSourceID' => $routeCache->air_source_id,
                            ':carrierID' => $routeCache->carrier_id,
                            ':serviceTypeID' => $routeCache->service_type_id,
                            ':clientSourceID' => $clientSourceId,
                        ])->order('carrier_id, client_source_id, service_type_id, air_source_id, order_')->queryAll();

        foreach ($rules as $row) {
            $rule = \CommercialRule::model()->cache(60)->findByPk($row['id']);
            /* @var $rule \CommercialRule */
            if ($rule->matchRouteCache($routeCache, $clientSourceId)) {
                // Calculate and apply the rule
                $routeCache->applyCommercialRule($rule->id, $clientSourceId);
                // Exit once the rule is applyed
                return;
            }
        }
    }

    /**
     * Return the plan with name B2C. Same plan will be used for 3rd party API integration
     * @return \CommercialPlan or NULL
     */
    static function findB2cPlan() {
        return self::model()->cache(36000)->findByAttributes(['name' => self::PLAN_B2C]);
    }
    
    function countUsers() {
        return \Yii::app()->db->createCommand("select count(*) from user_info where commercial_plan_id=$this->id")->queryScalar();
    }
}
