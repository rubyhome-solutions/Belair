<?php

/**
 * This is the model class for table "commission_rule".
 *
 * The followings are the available columns in table 'commission_rule':
 * @property integer $id
 * @property integer $air_source_id
 * @property integer $service_type_id
 * @property integer $carrier_id
 * @property string $filter
 * @property double $iata_rate_base
 * @property double $iata_rate_yq
 * @property double $plb_rate_base
 * @property double $plb_rate_yq
 * @property integer $fix
 * @property integer $fix_per_journey
 * @property integer $order_
 *
 * The followings are the available model relations:
 * @property Carrier $carrier
 * @property ServiceType $serviceType
 * @property AirSource $airSource
 */
class CommissionRule extends CActiveRecord {

    const MAX_ELEMENTS_ON_PAGE = 10;
    const PROFIT = 'Profit';
    const LOSS = 'Loss';

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'commission_rule';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('air_source_id, service_type_id, carrier_id, fix, fix_per_journey, order_, id', 'numerical', 'integerOnly' => true),
            array('iata_rate_base, iata_rate_yq, plb_rate_base, plb_rate_yq', 'numerical'),
            array('iata_rate_base, iata_rate_yq, plb_rate_base, plb_rate_yq, fix', 'default', 'setOnEmpty' => true, 'value' => 0),
            array('filter', 'safe'),
                // The following rule is used by search().
                // @todo Please remove those attributes that should not be searched.
//            array('id, air_source_id, service_type_id, carrier_id, filter, iata_rate_base, iata_rate_yq, plb_rate_base, plb_rate_yq, fix, fix_per_journey, order_', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
            'serviceType' => array(self::BELONGS_TO, 'ServiceType', 'service_type_id'),
            'airSource' => array(self::BELONGS_TO, 'AirSource', 'air_source_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'air_source_id' => 'Air Source',
            'service_type_id' => 'Service Type',
            'carrier_id' => 'Carrier',
            'filter' => 'Filter',
            'iata_rate_base' => 'Iata Rate Base',
            'iata_rate_yq' => 'Iata Rate Yq',
            'plb_rate_base' => 'Plb Rate Base',
            'plb_rate_yq' => 'Plb Rate Yq',
            'fix' => 'Fix',
            'fix_per_journey' => 'Fix Per Journey',
            'order_' => 'Order',
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
        $criteria->compare('air_source_id', $this->air_source_id);
        $criteria->compare('service_type_id', $this->service_type_id);
        $criteria->compare('carrier_id', $this->carrier_id);
        $criteria->compare('filter', $this->filter, true);
        $criteria->compare('iata_rate_base', $this->iata_rate_base);
        $criteria->compare('iata_rate_yq', $this->iata_rate_yq);
        $criteria->compare('plb_rate_base', $this->plb_rate_base);
        $criteria->compare('plb_rate_yq', $this->plb_rate_yq);
        $criteria->compare('fix', $this->fix);
        $criteria->compare('fix_per_journey', $this->fix_per_journey);
        $criteria->compare('order_', $this->order_);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CommissionRule the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Match the rule agains given RouteCache object
     * @param \RoutesCache $rc RouteCache object
     * @return boolean TRUE if the rule should be applyed to this RouteCache object
     */
    function matchRouteCache(\RoutesCache $rc) {
        // AirSource check
        if ($this->air_source_id !== null && $this->air_source_id !== $rc->air_source_id) {
            return false;
        }
        // Airline check
        if ($this->carrier_id !== null && $this->carrier_id !== $rc->carrier_id) {
            return false;
        }
        // TravelType check
        if ($this->service_type_id !== null && $rc->service_type_id !== $this->service_type_id) {
            return false;
        }
        // Filter check
        $filter = new \CommercialFilter($this->filter);
        if ($filter->exclude->matchRouteCacheExclude($rc)) {
            return false;
        }
        if (!$filter->include->matchRouteCacheInclude($rc)) {
            return false;
        }

        return true;
    }

    /**
     * Apply commercial rule against specific RouteCache object
     * @param \RoutesCache $rc The RouteCache object
     * @return integer The total discount
     */
    function applyRule(\RoutesCache $rc) {
        $out = 0;
        if ($this->matchRouteCache($rc)) {
            $out = round($this->calcDiscount($rc->base_fare, $rc->tax_yq, $rc->stops + 1, $rc->return_date ? 2 : 1, $rc->traveler_type_id), 2);
        }

        return $out;
    }

    /**
     * Calculate the reseller discount
     * @param integer $base base
     * @param integer $yq YQ part
     * @param integer $legCount Number of legs
     * @param integer $journeyCount Number of journeys
     * @return stdClass With elements: discount, bookingFee
     */
    private function calcDiscount($base, $yq, $legCount, $journeyCount) {
        $discount = 0;

        if ($this->fix_per_journey == 1) {
            $fixedMultiplier = $journeyCount;
        } else {
            $fixedMultiplier = $legCount;
        }

        // Fixed bookFee
        $discount += $this->fix * $fixedMultiplier;

        // IATA Discount as percentage
        $discount += $base * $this->iata_rate_base / 100;
        $discount += $yq * $this->iata_rate_yq / 100;

        // PLB Discount as percentage
        $discount += $base * (1 - $this->iata_rate_base / 100) * $this->plb_rate_base / 100;
        $discount += $yq * (1 - $this->iata_rate_yq / 100) * $this->plb_rate_yq / 100;

        return $discount;
    }

    /**
     * Calculate the commission against AirBooking and save it
     * @param \AirBooking $ab The AirBooking object
     */
    function applyRuleToAirBooking(\AirBooking $ab) {
        $ab->profit = round($this->calcDiscount($ab->basic_fare, $ab->fuel_surcharge, count($ab->airRoutes), $ab->returnDate ? 2 : 1), 2);
        $ab->update(['profit']);
    }

}
