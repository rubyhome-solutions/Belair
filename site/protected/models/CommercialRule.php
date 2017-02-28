<?php

/**
 * This is the model class for table "commercial_rule".
 *
 * The followings are the available columns in table 'commercial_rule':
 * @property integer $id
 * @property integer $client_source_id
 * @property integer $air_source_id
 * @property integer $service_type_id
 * @property integer $carrier_id
 * @property string $filter
 * @property double $iata_rate_total
 * @property double $iata_rate_base
 * @property double $iata_rate_yq
 * @property double $plb_rate_total
 * @property double $plb_rate_base
 * @property double $plb_rate_yq
 * @property double $book_rate_total
 * @property double $book_rate_base
 * @property double $book_rate_yq
 * @property integer $book_fix_adult
 * @property integer $book_fix_child
 * @property integer $book_fix_infant
 * @property integer $book_fix_per_journey
 * @property integer $cancel_fix_adult
 * @property integer $cancel_fix_child
 * @property integer $cancel_fix_infant
 * @property integer $cancel_fix_per_journey
 * @property integer $reschedule_fix_adult
 * @property integer $reschedule_fix_child
 * @property integer $reschedule_fix_infant
 * @property integer $reschedule_fix_per_journey
 * @property double $markup_rate_total
 * @property double $markup_rate_base
 * @property double $markup_rate_yq
 * @property integer $markup_fix_adult
 * @property integer $markup_fix_child
 * @property integer $markup_fix_infant
 * @property integer $markup_fix_per_journey
 * @property integer $order_
 * @property integer $markup_added_to
 * @property integer $booking_fee_fix
 * @property integer $booking_fee_perc
 * @property integer $booking_fee_per_passenger
 *
 * The followings are the available model relations:
 * @property CommercialPlan[] $commercialPlans
 * @property Carrier $carrier
 * @property ServiceType $serviceType
 * @property ClientSource $clientSource
 * @property AirSource $airSource
 * @property PaymentConvenienceFee[] $paymentConvenienceFees
 */
class CommercialRule extends CActiveRecord {

    const MARKUP_TO_BASE = 1;
    const MARKUP_TO_YQ = 2;

    /**
     * Where the markup is added to (Base fare or YQ tax)
     * @var array
     */
    static $markupAddedTo = [
        self::MARKUP_TO_BASE => 'Base',
        self::MARKUP_TO_YQ => 'YQ',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'commercial_rule';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
//            array('filter', 'required'),
            array('client_source_id, service_type_id, carrier_id, book_fix_adult, book_fix_child, book_fix_infant, book_fix_per_journey, cancel_fix_adult, cancel_fix_child, cancel_fix_infant, cancel_fix_per_journey, reschedule_fix_adult, reschedule_fix_child, reschedule_fix_infant, reschedule_fix_per_journey, markup_fix_adult, markup_fix_child, markup_fix_infant, markup_fix_per_journey, air_source_id, order_, id, markup_added_to, booking_fee_fix, booking_fee_perc, booking_fee_per_passenger', 'numerical', 'integerOnly' => true),
            array('iata_rate_total, iata_rate_base, iata_rate_yq, plb_rate_total, plb_rate_base, plb_rate_yq, book_rate_total, book_rate_base, book_rate_yq, markup_rate_total, markup_rate_base, markup_rate_yq', 'numerical'),
            array('iata_rate_total, iata_rate_base, iata_rate_yq, plb_rate_total, plb_rate_base, plb_rate_yq, book_rate_total, book_rate_base, book_rate_yq, markup_rate_total, markup_rate_base, markup_rate_yq', 'default', 'setOnEmpty' => true, 'value' => 0),
                // The following rule is used by search().
//            array('id, client_source_id, service_type_id, carrier_id, filter, iata_rate_total, iata_rate_base, iata_rate_yq, plb_rate_total, plb_rate_base, plb_rate_yq, book_rate_total, book_rate_base, book_rate_yq, book_fix_adult, book_fix_child, book_fix_infant, book_fix_per_journey, cancel_fix_adult, cancel_fix_child, cancel_fix_infant, cancel_fix_per_journey, reschedule_fix_adult, reschedule_fix_child, reschedule_fix_infant, reschedule_fix_per_journey, markup_rate_total, markup_rate_base, markup_rate_yq, markup_fix_adult, markup_fix_child, markup_fix_infant, markup_fix_per_journey', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'commercialPlans' => array(self::MANY_MANY, 'CommercialPlan', 'commercial_x_rule(rule_id, plan_id)'),
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
            'airSource' => array(self::BELONGS_TO, 'AirSource', 'air_source_id'),
            'serviceType' => array(self::BELONGS_TO, 'ServiceType', 'service_type_id'),
            'clientSource' => array(self::BELONGS_TO, 'ClientSource', 'client_source_id'),
            'paymentConvenienceFees' => array(self::HAS_MANY, 'PaymentConvenienceFee', 'commercial_rule_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'client_source_id' => 'Client Source',
            'service_type_id' => 'Service Type',
            'carrier_id' => 'Carrier',
            'filter' => 'Filter',
            'iata_rate_total' => 'Iata Rate Total',
            'iata_rate_base' => 'Iata Rate Base',
            'iata_rate_yq' => 'Iata Rate Yq',
            'plb_rate_total' => 'Plb Rate Total',
            'plb_rate_base' => 'Plb Rate Base',
            'plb_rate_yq' => 'Plb Rate Yq',
            'book_rate_total' => 'Book Rate Total',
            'book_rate_base' => 'Book Rate Base',
            'book_rate_yq' => 'Book Rate Yq',
            'book_fix_adult' => 'Book Fix Adult',
            'book_fix_child' => 'Book Fix Child',
            'book_fix_infant' => 'Book Fix Infant',
            'book_fix_per_journey' => 'Book Fix Per Journey',
            'cancel_fix_adult' => 'Cancel Fix Adult',
            'cancel_fix_child' => 'Cancel Fix Child',
            'cancel_fix_infant' => 'Cancel Fix Infant',
            'cancel_fix_per_journey' => 'Cancel Fix Per Journey',
            'reschedule_fix_adult' => 'Reschedule Fix Adult',
            'reschedule_fix_child' => 'Reschedule Fix Child',
            'reschedule_fix_infant' => 'Reschedule Fix Infant',
            'reschedule_fix_per_journey' => 'Reschedule Fix Per Journey',
            'markup_rate_total' => 'Markup Rate Total',
            'markup_rate_base' => 'Markup Rate Base',
            'markup_rate_yq' => 'Markup Rate Yq',
            'markup_fix_adult' => 'Markup Fix Adult',
            'markup_fix_child' => 'Markup Fix Child',
            'markup_fix_infant' => 'Markup Fix Infant',
            'markup_fix_per_journey' => 'Markup Fix Per Journey',
            'booking_fee_fix' => 'Booking Fee Fix',
			'booking_fee_perc' => 'Booking Fee Perc',
			'booking_fee_per_passenger' => 'Booking Fee Per Passenger',
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
        $criteria->compare('service_type_id', $this->service_type_id);
        $criteria->compare('carrier_id', $this->carrier_id);
        $criteria->compare('filter', $this->filter, true);
        $criteria->compare('iata_rate_total', $this->iata_rate_total);
        $criteria->compare('iata_rate_base', $this->iata_rate_base);
        $criteria->compare('iata_rate_yq', $this->iata_rate_yq);
        $criteria->compare('plb_rate_total', $this->plb_rate_total);
        $criteria->compare('plb_rate_base', $this->plb_rate_base);
        $criteria->compare('plb_rate_yq', $this->plb_rate_yq);
        $criteria->compare('di_rate_total', $this->di_rate_total);
        $criteria->compare('di_rate_base', $this->di_rate_base);
        $criteria->compare('di_rate_yq', $this->di_rate_yq);
        $criteria->compare('book_rate_total', $this->book_rate_total);
        $criteria->compare('book_rate_base', $this->book_rate_base);
        $criteria->compare('book_rate_yq', $this->book_rate_yq);
        $criteria->compare('book_fix_adult', $this->book_fix_adult);
        $criteria->compare('book_fix_child', $this->book_fix_child);
        $criteria->compare('book_fix_infant', $this->book_fix_infant);
        $criteria->compare('book_fix_per_journey', $this->book_fix_per_journey);
        $criteria->compare('cancel_fix_adult', $this->cancel_fix_adult);
        $criteria->compare('cancel_fix_child', $this->cancel_fix_child);
        $criteria->compare('cancel_fix_infant', $this->cancel_fix_infant);
        $criteria->compare('cancel_fix_per_journey', $this->cancel_fix_per_journey);
        $criteria->compare('reschedule_fix_adult', $this->reschedule_fix_adult);
        $criteria->compare('reschedule_fix_child', $this->reschedule_fix_child);
        $criteria->compare('reschedule_fix_infant', $this->reschedule_fix_infant);
        $criteria->compare('reschedule_fix_per_journey', $this->reschedule_fix_per_journey);
        $criteria->compare('markup_rate_total', $this->markup_rate_total);
        $criteria->compare('markup_rate_base', $this->markup_rate_base);
        $criteria->compare('markup_rate_yq', $this->markup_rate_yq);
        $criteria->compare('markup_fix_adult', $this->markup_fix_adult);
        $criteria->compare('markup_fix_child', $this->markup_fix_child);
        $criteria->compare('markup_fix_infant', $this->markup_fix_infant);
        $criteria->compare('markup_fix_per_journey', $this->markup_fix_per_journey);
        $criteria->compare('booking_fee_fix',$this->booking_fee_fix);
		$criteria->compare('booking_fee_perc',$this->booking_fee_perc);
		$criteria->compare('booking_fee_per_passenger',$this->booking_fee_per_passenger);
        
        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return CommercialRule the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Match the rule agains given RouteCache object
     * @param \RoutesCache $rc RouteCache object
     * @param integer|null $clientSource From where the client is coming. When null the clientSource is not checked.
     * @return boolean TRUE if the rule should be applyed to this RouteCache object
     */
    function matchRouteCache(\RoutesCache $rc, $clientSource = \ClientSource::SOURCE_DIRECT) {
        // AirSource check
        if ($this->air_source_id !== null && $this->air_source_id !== $rc->air_source_id) {
            return false;
        }
        // Airline check
        if ($this->carrier_id !== null && $this->carrier_id !== $rc->carrier_id) {
            return false;
        }
        // ClientSource check
        if ($clientSource !== 0 && $clientSource !== $this->client_source_id) {
            return false;
        }
        // TravelType check
        if ($rc->service_type_id !== $this->service_type_id) {
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
     * Calculate the markup
     * @param integer $total total
     * @param integer $base base
     * @param integer $yq YQ part
     * @param integer $legCount Number of legs
     * @param integer $journeyCount Number of journeys
     * @param integer $travelerTypeId The passenger typeId
     * @return stdClass With elements total, base, yq - increased where needed
     */
    private function calcMarkup($total, $base, $yq, $legCount = 1, $journeyCount = 1, $travelerTypeId = \TravelerType::TRAVELER_ADULT) {
        $markup = 0;
        if ($this->markup_fix_per_journey == 1) {
            $fixedMultiplier = $journeyCount;
        } else {
            $fixedMultiplier = $legCount;
        }
        // Fixed markups
        switch ($travelerTypeId) {
            case \TravelerType::TRAVELER_ADULT:
                if ($this->markup_fix_adult <> 0) {
                    $markup += $this->markup_fix_adult * $fixedMultiplier;
                }
                break;
            case \TravelerType::TRAVELER_CHILD:
                if ($this->markup_fix_child <> 0) {
                    $markup += $this->markup_fix_child * $fixedMultiplier;
                }
                break;
            case \TravelerType::TRAVELER_INFANT:
                if ($this->markup_fix_infant <> 0) {
                    $markup += $this->markup_fix_infant * $fixedMultiplier;
                }
                break;
        }

        // Markup as percentage
        if ($this->markup_rate_base <> 0) {
            $markup += $base * $this->markup_rate_base / 100;
        }
        if ($this->markup_rate_yq <> 0) {
            $markup += $yq * $this->markup_rate_yq / 100;
        }
        if ($this->markup_rate_total <> 0) {
            $markup += $total * $this->markup_rate_total / 100;
        }

        if ($markup <> 0) {
            if ($this->markup_added_to == self::MARKUP_TO_BASE) {
                $base += $markup;
            } else {
                $yq += $markup;
            }
            $total += $markup;
        }

        return (object) ['total' => $total, 'base' => $base, 'yq' => $yq];
    }

    /**
     * Calculate the reseller discount
     * @param integer $total total
     * @param integer $base base
     * @param integer $yq YQ part
     * @param integer $legCount Number of legs
     * @param integer $journeyCount Number of journeys
     * @param integer $travelerTypeId The passenger typeId
     * @return stdClass With elements: discount, bookingFee
     */
    private function calcDiscount($total, $base, $yq, $legCount, $journeyCount, $travelerTypeId) {
        $discount = 0;
        $bookingFee = 0;

        if ($this->book_fix_per_journey == 1) {
            $fixedMultiplier = $journeyCount;
        } else {
            $fixedMultiplier = $legCount;
        }

        // Fixed bookFee
        switch ($travelerTypeId) {
            case \TravelerType::TRAVELER_ADULT:
                if ($this->book_fix_adult <> 0) {
                    $bookingFee += $this->book_fix_adult * $fixedMultiplier;
                }
                break;
            case \TravelerType::TRAVELER_CHILD:
                if ($this->book_fix_child <> 0) {
                    $bookingFee += $this->book_fix_child * $fixedMultiplier;
                }
                break;
            case \TravelerType::TRAVELER_INFANT:
                if ($this->book_fix_infant <> 0) {
                    $bookingFee += $this->book_fix_infant * $fixedMultiplier;
                }
                break;
        }

        // bookFee as percentage
        $bookingFee += $base * $this->book_rate_base / 100;
        $bookingFee += $yq * $this->book_rate_yq / 100;
        $bookingFee += $total * $this->book_rate_total / 100;

        // IATA Discount as percentage
        $discount += $base * $this->iata_rate_base / 100;
        $discount += $yq * $this->iata_rate_yq / 100;
        $discount += $total * $this->iata_rate_total / 100;

        // PLB Discount as percentage
        $discount += $base * (1 - $this->iata_rate_base / 100) * $this->plb_rate_base / 100;
        $discount += $yq * (1 - $this->iata_rate_yq / 100) * $this->plb_rate_yq / 100;
        $discount += $total * (1 - $this->iata_rate_total / 100) * $this->plb_rate_total / 100;

        return (object) ['discount' => $discount, 'bookingFee' => $bookingFee];
    }

    /**
     * Apply commercial rule against specific RouteCache object
     * @param \RoutesCache $rc The RouteCache object
     * @param integer $clientSource From where the client is coming
     * @return object With members: total, base, yq, discount and bookingFee<br>
     * If the rule is not applicable the total, base and yq has same value as in the $rc. The discount and bookingFee are zero
     */
    function applyRule(\RoutesCache $rc, $clientSource = \ClientSource::SOURCE_DIRECT) {
        $out = (object) ['total' => $rc->total_fare, 'base' => $rc->base_fare, 'yq' => $rc->tax_yq, 'discount' => 0, 'bookingFee' => 0];
        if ($this->matchRouteCache($rc, $clientSource)) {
            $markup = $this->calcMarkup($rc->total_fare, $rc->base_fare, $rc->tax_yq, $rc->stops + 1, $rc->order_ == \RoutesCache::ORDER_ALL_JOURNEYS ? 2 : 1, $rc->traveler_type_id);
            $reseller = $this->calcDiscount($markup->total, $markup->base, $markup->yq, $rc->stops + 1, $rc->order_ == \RoutesCache::ORDER_ALL_JOURNEYS ? 2 : 1, $rc->traveler_type_id);
            $out->total = round($markup->total, 2);
            $out->base = round($markup->base, 2);
            $out->yq = round($markup->yq, 2);
            $out->discount = round($reseller->discount, 2);
            $out->bookingFee = round($reseller->bookingFee, 2);
        }

        return $out;
    }

    function calcTotalEfect(\RoutesCache $rc, $clientSource = \ClientSource::SOURCE_DIRECT) {
        $markup = $this->calcMarkup($rc->total_fare, $rc->base_fare, $rc->tax_yq, $rc->stops + 1, $rc->order_ == \RoutesCache::ORDER_ALL_JOURNEYS ? 2 : 1, $rc->traveler_type_id);
        $reseller = $this->calcDiscount($markup->total, $markup->base, $markup->yq, $rc->stops + 1, $rc->order_ == \RoutesCache::ORDER_ALL_JOURNEYS ? 2 : 1, $rc->traveler_type_id);
        return round($markup->base + $markup->yq - $reseller->discount + $reseller->bookingFee - $rc->base_fare - $rc->tax_yq, 2);
    }

    /**
     * Apply commercial rule against AirBooking and save it
     * @param \AirBooking $ab The AirBooking object
     */
    function applyRuleToAirBooking(\AirBooking &$ab) {
        if ($ab->commercial_rule_id !== null) {
            return false; // Do not do anything if CR is already applyed to this AB
        }
        $markup = $this->calcMarkup($ab->fareAndTaxes, $ab->basic_fare, $ab->fuel_surcharge, count($ab->airRoutes), 1, $ab->traveler_type_id);
        $reseller = $this->calcDiscount($markup->total, $markup->base, $markup->yq, count($ab->airRoutes), 1, $ab->traveler_type_id);
        $ab->commercial_total_efect = round($markup->base + $markup->yq - $reseller->discount + $reseller->bookingFee - $ab->basic_fare - $ab->fuel_surcharge);
        $ab->basic_fare = round($markup->base);
        $ab->fuel_surcharge = round($markup->yq);
        $ab->commission_or_discount_gross = round($reseller->discount);
        $ab->booking_fee = round($reseller->bookingFee);
        // Save the rule ID in the AirBooking as well
        $ab->commercial_rule_id = $this->id;
        $ab->update(['basic_fare', 'fuel_surcharge', 'commission_or_discount_gross', 'booking_fee', 'commercial_rule_id', 'commercial_total_efect']);
    }

}
