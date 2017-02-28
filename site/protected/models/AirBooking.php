<?php

/**
 * This is the model class for table "air_booking".
 *
 * The followings are the available columns in table 'air_booking':
 * @property integer $id
 * @property integer $booking_type_id
 * @property integer $cabin_type_id
 * @property integer $traveler_type_id
 * @property integer $traveler_id
 * @property string $ticket_number
 * @property double $basic_fare
 * @property double $fuel_surcharge
 * @property double $congestion_charge
 * @property double $airport_tax
 * @property double $udf_charge
 * @property double $jn_tax
 * @property double $meal_charge
 * @property double $seat_charge
 * @property double $passtrough_fee OB tax
 * @property double $supplier_amendment_fee
 * @property double $booking_fee
 * @property double $service_tax
 * @property double $reseller_amendment_fee
 * @property double $commission_or_discount_gross
 * @property double $tds
 * @property double $baggage_charge
 * @property integer $air_cart_id
 * @property integer $source_id
 * @property integer $destination_id
 * @property integer $service_type_id
 * @property integer $fare_type_id
 * @property integer $carrier_id
 * @property string $booking_class
 * @property double $oc_charge
 * @property string $airline_pnr
 * @property string $crs_pnr
 * @property double $fareAndTaxes The sum of basic fare plus all taxes
 * @property double $taxesOnly The sum of all taxes
 * @property string $departure_ts
 * @property string $arrival_ts
 * @property double $reseller_markup_base
 * @property double $reseller_markup_fee
 * @property double $reseller_markup_tax
 * @property double $cancellation_fee
 * @property double $extraCharges The sum of baggage, meal and seat charges
 * @property double $totalAmount The sum of all taxes + fees + basic fare, including TDS, S.tax ... everything
 * @property integer $special_request_id
 * @property integer $payment_process_id
 * @property string $endorsment Endorsment is received from the GDS
 * @property string $fare_basis Fare basis - received from the GDS
 * @property integer $air_source_id
 * @property string $created
 * @property integer $ab_status_id
 * @property string $tour_code
 * @property string $private_fare
 * @property string $frequent_flyer
 * @property string $other_tax
 * @property double $profit
 * @property integer $commercial_rule_id
 * @property double $commercial_total_efect
 * @property string $cost_center
 * @property string $product_class
 *
 *
 * The followings are the available model relations:
 * @property Amendment[] $amendments
 * @property SpecialRequest $specialRequest
 * @property PaymentProcess $paymentProcess
 * @property Carrier $carrier
 * @property FareType $fareType
 * @property ServiceType $serviceType
 * @property Airport $destination
 * @property Airport $source
 * @property AirCart $airCart
 * @property CabinType $cabinType
 * @property BookingType $bookingType
 * @property TravelerType $travelerType
 * @property Traveler $traveler
 * @property AirRoutes[] $airRoutes
 * @property AirSource $airSource
 * @property AbStatus $abStatus
 */
class AirBooking extends CActiveRecord {
    /*
     * Names of the taxes
      YQ Tax = Fuel Surcharge
      YR Tax = Congestion Charge
      IN Tax = Airport Tax
      WO Tax = UDF Charge
      OC Tax = OC Charge
     */

    public $isReturnBooking = false;
    public $firstLegCarrierId = null;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'air_booking';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('booking_type_id, traveler_type_id, traveler_id, air_cart_id, source_id, destination_id, service_type_id, carrier_id, airline_pnr, departure_ts, arrival_ts', 'required', 'except' => 'preInsert'),
            array('booking_type_id, traveler_type_id, traveler_id, source_id, destination_id, service_type_id, carrier_id, airline_pnr, departure_ts, arrival_ts', 'required', 'on' => 'preInsert'),
            array('booking_type_id, cabin_type_id, traveler_type_id, traveler_id, air_cart_id, source_id, destination_id, service_type_id, fare_type_id, carrier_id, air_source_id', 'numerical', 'integerOnly' => true),
            array('congestion_charge, airport_tax, udf_charge, jn_tax, meal_charge, seat_charge, passtrough_fee, supplier_amendment_fee, booking_fee, service_tax, reseller_amendment_fee, commission_or_discount_gross, tds, baggage_charge, oc_charge, reseller_markup_base, reseller_markup_fee, reseller_markup_tax, cancellation_fee, other_tax', 'numerical'), // , 'min' => 0
            array('basic_fare, fuel_surcharge, profit', 'numerical'),
            array('basic_fare, fuel_surcharge, congestion_charge, airport_tax, udf_charge, jn_tax, meal_charge, seat_charge, passtrough_fee, supplier_amendment_fee, booking_fee, service_tax, reseller_amendment_fee, commission_or_discount_gross, tds, baggage_charge, oc_charge, air_source_id', 'required', 'on' => 'preInsert'),
            ['basic_fare', 'numerical', 'min' => 1, 'on' => 'preInsert'],
            array('booking_class, AirRoutes, fare_basis, cost_center, product_class', 'safe'),
            array('crs_pnr', 'length', 'min' => 6, 'max' => 7),
            array('airline_pnr', 'length', 'min' => 5, 'max' => 7),
            array('ticket_number', 'length', 'min' => 3, 'max' => 17),
                // The following rule is used by search().
                // @todo Please remove those attributes that should not be searched.
//            array('', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'amendments' => array(self::HAS_MANY, 'Amendment', 'air_booking_id'),
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
            'fareType' => array(self::BELONGS_TO, 'FareType', 'fare_type_id'),
            'serviceType' => array(self::BELONGS_TO, 'ServiceType', 'service_type_id'),
            'destination' => array(self::BELONGS_TO, 'Airport', 'destination_id'),
            'source' => array(self::BELONGS_TO, 'Airport', 'source_id'),
            'airCart' => array(self::BELONGS_TO, 'AirCart', 'air_cart_id'),
            'cabinType' => array(self::BELONGS_TO, 'CabinType', 'cabin_type_id'),
            'bookingType' => array(self::BELONGS_TO, 'BookingType', 'booking_type_id'),
            'travelerType' => array(self::BELONGS_TO, 'TravelerType', 'traveler_type_id'),
            'traveler' => array(self::BELONGS_TO, 'Traveler', 'traveler_id'),
            'airRoutes' => array(self::HAS_MANY, 'AirRoutes', 'air_booking_id'),
            'specialRequest' => array(self::BELONGS_TO, 'SpecialRequest', 'special_request_id'),
            'paymentProcess' => array(self::BELONGS_TO, 'PaymentProcess', 'payment_process_id'),
            'airSource' => array(self::BELONGS_TO, 'AirSource', 'air_source_id'),
            'abStatus' => array(self::BELONGS_TO, 'AbStatus', 'ab_status_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'booking_type_id' => 'Booking Type',
            'cabin_type_id' => 'Cabin Type',
            'traveler_type_id' => 'Traveler Type',
            'traveler_id' => 'Traveler',
            'ticket_number' => 'Ticket Number',
            'basic_fare' => 'Basic Fare',
            'fuel_surcharge' => 'Fuel Surcharge',
            'congestion_charge' => 'Congestion Charge',
            'airport_tax' => 'Airport Tax',
            'udf_charge' => 'Udf Charge',
            'jn_tax' => 'Jn Tax',
            'meal_charge' => 'Meal Charge',
            'seat_charge' => 'Seat Charge',
            'passtrough_fee' => 'Passtrough Fee',
            'supplier_amendment_fee' => 'Supplier Amendment Fee',
            'booking_fee' => 'Booking Fee',
            'service_tax' => 'Service Tax',
            'reseller_amendment_fee' => 'Reseller Amendment Fee',
            'commission_or_discount_gross' => 'Commission Or Discount Gross',
            'tds' => 'Tds',
            'baggage_charge' => 'Baggage Charge',
            'air_cart_id' => 'Air Cart',
            'source_id' => 'Source',
            'destination_id' => 'Destination',
            'service_type_id' => 'Service Type',
            'fare_type_id' => 'Fare Type',
            'carrier_id' => 'Leading Airline',
            'airline_pnr' => 'Airline PNR',
            'crs_pnr' => 'CRS PNR',
            'departure_ts' => 'Departure',
            'arrival_ts' => 'Arrival',
            'reseller_markup_base' => 'Markup Base',
            'reseller_markup_fee' => 'Markup Fee',
            'reseller_markup_tax' => 'Markup Tax',
            'cancellation_fee' => 'Cancellation Fee',
            'fare_basis' => 'Fare Basis',
            'profit' => 'Profit',
            'cost_center' => 'Cost Center',
            'product_class' => 'Product Class',
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

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return AirBooking the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getFareAndTaxes() {
        return $this->basic_fare + $this->fuel_surcharge + $this->congestion_charge +
                $this->airport_tax + $this->udf_charge + $this->jn_tax +
                $this->passtrough_fee + $this->oc_charge + $this->other_tax +
                $this->seat_charge + $this->meal_charge + $this->baggage_charge + $this->service_tax;
    }

    public function getMarkup() {
        return $this->reseller_markup_base + $this->reseller_markup_fee + $this->reseller_markup_tax;
    }

    public function getTotalAmount() {
        return $this->fareAndTaxes + $this->booking_fee + $this->getMarkup() -
                $this->commission_or_discount_gross + $this->tds + $this->airCart->convenienceFee;
    }

    /**
     * Total amount without the markup
     * @return float
     */
    public function getTotalAmountToPay() {
        $this->refresh();
        return $this->getTotalAmount() - $this->getMarkup();
    }

    public function getTaxesOnly() {
        return $this->fuel_surcharge + $this->congestion_charge +
                $this->airport_tax + $this->udf_charge + $this->other_tax +
                $this->passtrough_fee + $this->oc_charge +
                $this->seat_charge + $this->meal_charge + $this->baggage_charge;
    }

    public function getExtraCharges() {
        return $this->baggage_charge + $this->seat_charge + $this->meal_charge;
    }

    public function clearFareAndTaxes() {
        $this->basic_fare = 0;
        $this->fuel_surcharge = 0;
        $this->congestion_charge = 0;
        $this->airport_tax = 0;
        $this->udf_charge = 0;
        $this->jn_tax = 0;
        $this->passtrough_fee = 0;
        $this->oc_charge = 0;
        $this->seat_charge = 0;
        $this->meal_charge = 0;
        $this->baggage_charge = 0;
        $this->booking_fee = 0;
        $this->cancellation_fee = 0;
        $this->commission_or_discount_gross = 0;
        $this->reseller_amendment_fee = 0;
        $this->reseller_markup_base = 0;
        $this->reseller_markup_fee = 0;
        $this->reseller_markup_tax = 0;
        $this->supplier_amendment_fee = 0;
        $this->tds = 0;
        $this->service_tax = 0;
        $this->other_tax = 0;
        $this->profit = 0;
        $this->commercial_rule_id = null;
        $this->commercial_total_efect = 0;
    }

    /**
     * Obtain the common info from the given AirRoutes object
     * @param AirRoutes $airRoute The source of the info
     */
    public function obtainRouteInfo($airRoute) {
        $this->departure_ts = $airRoute->departure_ts;
        $this->arrival_ts = $airRoute->arrival_ts;
        $this->source_id = $airRoute->source_id;
        $this->destination_id = $airRoute->destination_id;
        $this->carrier_id = $airRoute->carrier_id;
    }

    /**
     * Set the order_ field for the attached AirRoutes in chronological order by departure_ts field
     */
    function setAirRoutesOrder() {
//        $airBooking = $this->with([
//                    'airRoutes' => ['order' => '"airRoutes".departure_ts']
//                ])->findByPk($this->id);
        $airRoutes = \AirRoutes::model()->findAll([
            'condition' => 'air_booking_id=:airBookingId',
            'order' => 'departure_ts',
            'params' => [':airBookingId' => $this->id]
        ]);
        $i = 1;
        foreach ($airRoutes as $airRoute) {
            $airRoute->order_ = $i;
            $airRoute->update(['order_']);
            if ($i === 1) {
                $this->source_id = $airRoute->source_id;
                $this->departure_ts = $airRoute->departure_ts;
                $this->update(['source_id', 'departure_ts']);
            }
            $i++;
        }
        if (count($airRoutes)) {
            $airRoute = end($airRoutes);
            $this->destination_id = $airRoute->destination_id;
            $this->arrival_ts = $airRoute->arrival_ts;
            $this->update(['destination_id', 'arrival_ts']);
        }
    }

    function getFlighNumberArr() {
        $out = [];
        foreach ($this->airRoutes as $airRoute) {
            $out[] = $airRoute->flight_number;
        }
        return $out;
    }

    function getBookingClassArr() {
        $out = [];
        foreach ($this->airRoutes as $airRoute) {
            $out[] = trim($airRoute->booking_class);
        }
        return $out;
    }

    /**
     * Set the Booking depart & arrive times based on the attached AirRoutes departure_ts and arrive_ts
     */
    function setDepartAndArriveTimes() {
        $routesCount = count($this->airRoutes);
        if ($routesCount === 0) {
            return false;
        }
        $airBooking = $this->with([
                    'airRoutes' => ['order' => '"airRoutes".departure_ts']
                ])->findByPk($this->id);
        /* @var $airBooking AirBooking */
        $airBooking->departure_ts = $airBooking->airRoutes[0]->departure_ts;
        $airBooking->arrival_ts = $airBooking->airRoutes[($routesCount - 1)]->arrival_ts;
        return $airBooking->save(false, ['departure_ts', 'arrival_ts']);
    }

    /**
     * Get the return date
     * @return string The return date
     */
    function getReturnDate() {
        $abs = $this->findAllByAttributes([
            'air_cart_id' => $this->air_cart_id,
            'traveler_id' => $this->traveler_id,
                ], ['order' => 'departure_ts']);
        $abCount = count($abs);
        if ($abCount < 2) {
            return null;    // One way trip if there is only one AB
        } else {
            return $abs[$abCount - 1]->departure_ts;
        }
    }

    /**
     * Get if different flights for returning
     * @return boolean The return date
     */
    function getReturnDiffFlight() {
        $abs = $this->findAllByAttributes([
            'air_cart_id' => $this->air_cart_id,
            'traveler_id' => $this->traveler_id,
                ], ['order' => 'departure_ts']);
        $abCount = count($abs);
        if ($abCount == 2) {
            if ($abs[0]->carrier_id != $abs[1]->carrier_id) {
                return true;
            }
        }

        return false;
    }

    /**
     * Set the first leg plating carrier and set the isReturnBooking boolean flag
     */
    function setIsReturnAndFirstLegCarrier() {
        $airBookings = \AirBooking::model()->with('airRoutes')->findAll([
            'condition' => 'air_cart_id=:airCartId',
            'order' => '"airRoutes".departure_ts',
            'params' => [':airCartId' => $this->air_cart_id]
        ]);
        /* @var $airBookings \AirBooking[] */
        if (count($airBookings)) {
            $origin = $airBookings[0]->source_id;
            $destination = $airBookings[0]->destination_id;
            $this->isReturnBooking = ($this->source_id === $destination && $this->destination_id === $origin);
            $this->firstLegCarrierId = $airBookings[0]->carrier_id;
        }
    }

    /**
     * Is Air Cart is MultiCity
     * @return string true or false
     */
    function isMultiCity() {
        $abs = $this->findAllByAttributes([
            'air_cart_id' => $this->air_cart_id,
            'traveler_id' => $this->traveler_id,
                ], ['order' => 'departure_ts']);
        return count($abs) > 2 ? 'true' : 'false';
    }

    /**
     * Calculate the commission
     * @param bool $force Should we force the calculation
     * @return boolean
     */
    function calcCommission($force = false) {
        // Calc the commission only if commerssials are not applyed or force is used
        if (empty($this->commercial_total_efect) || $force) {
            $rules = \CommissionRule::model()->findAllBySql('SELECT * FROM commission_rule '
                    . 'WHERE carrier_id = :carrier_id AND '
                    . '(air_source_id = :air_source_id OR air_source_id IS NULL) AND '
                    . '(service_type_id = :service_type_id OR service_type_id IS NULL)', [
                ':carrier_id' => $this->carrier_id,
                ':air_source_id' => $this->air_source_id,
                ':service_type_id' => $this->service_type_id,
                    ], ['order' => 'service_type_id, air_source_id, order_']);

//            echo \Utils::dbg($rule);
            /* @var $rules \CommissionRule[] */
            foreach ($rules as $rule) {
                $filter = new \CommercialFilter($rule->filter);
                if ($filter->matchAirBooking($this)) {
                    // Calculate and apply the rule
                    $rule->applyRuleToAirBooking($this);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Pretty formatting of the parameters
     * @return array
     */
    function pretty() {
        return [
//            'airSource' => $this->airSource->name,
            'booking' => $this->bookingType->name,
            'cabin' => $this->cabin_type_id ? $this->cabinType->name : null,
            'travelerType' => $this->travelerType->name,
            'baseFare' => (float) $this->basic_fare,
            'totalTaxes' => $this->getTaxesOnly(),
            'totalAmount' => (float) $this->getTotalAmountToPay(),
            'YQ' => $this->fuel_surcharge + $this->airport_tax,
            'UDF+PSF' => (float) $this->udf_charge,
            'JN' => (float) $this->jn_tax,
            'otherTax' => (float) $this->other_tax,
            'bookingFee' => (float) $this->booking_fee,
            'discount' => (float) $this->commission_or_discount_gross,
            'resellerMarkupBase' => (float) $this->reseller_markup_base,
            'resellerMarkupFee' => (float) $this->reseller_markup_fee,
            'resellerMarkupTax' => (float) $this->reseller_markup_tax,
            'origin' => \Airport::getAirportCodeFromId($this->source_id),
            'destination' => \Airport::getAirportCodeFromId($this->destination_id),
            'marketingCarrier' => \Carrier::getCodeFromId($this->carrier_id),
            'bookingClass' => trim($this->booking_class),
            'crsPnr' => $this->crs_pnr,
            'airlinePnr' => $this->airline_pnr,
            'ticketNumber' => $this->ticket_number,
            'departure' => $this->departure_ts,
            'arrival' => $this->arrival_ts,
            'fareBasis' => $this->fare_basis,
            'created' => $this->created,
            'endorsment' => $this->endorsment,
            'tourCode' => $this->tour_code,
            'privateFare' => $this->private_fare,
        ];
    }

}
