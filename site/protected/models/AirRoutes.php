<?php

/**
 * This is the model class for table "air_routes".
 *
 * The followings are the available columns in table 'air_routes':
 * @property integer $id
 * @property integer $destination_id
 * @property integer $source_id
 * @property integer $carrier_id
 * @property string $flight_number
 * @property string $departure_ts
 * @property string $arrival_ts
 * @property integer $order_
 * @property integer $air_booking_id
 * @property string $source_terminal
 * @property string $destination_terminal
 * @property string $fare_basis
 * @property string $booking_class
 * @property string $carrierCodeAndFlightNumber Clued together
 * @property string $meal
 * @property string $seat
 * @property string $airPnr
 * @property string $aircraft
 * @property string $ts Technical stops
 * @property Airport $source
 * @property Airport $destination
 * @property Carrier $carrier

 *
 * The followings are the available model relations:
 * @property AirBooking $airBooking
 * @property Amendment[] $amendments
 */
class AirRoutes extends CActiveRecord {

    public $airPnr;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'air_routes';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('destination_id, source_id, carrier_id, flight_number, departure_ts, arrival_ts', 'required', 'on' => 'preInsert'),
            array('flight_number', 'numerical', 'integerOnly' => true, 'on' => 'preInsert'),
            array('destination_id, source_id, carrier_id, flight_number, departure_ts, arrival_ts, air_booking_id', 'required', 'except' => 'preInsert'),
            array('destination_id, source_id, carrier_id, order_', 'numerical', 'integerOnly' => true),
            array('fare_basis, booking_class, seat, meal, airPnr, aircraft, ts', 'safe'),
            array('id', 'safe', 'on' => 'pnrAcquisition'),
            // Terminals are up to 2 chars
            array('source_terminal, destination_terminal', 'CStringValidator', 'max' => 2),
            array('departure_ts, arrival_ts', 'date', 'format' => 'yyyy-MM-dd hh:mm:ss', 'message' => '{attribute} have wrong format'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airBooking' => array(self::BELONGS_TO, 'AirBooking', 'air_booking_id'),
            'source' => array(self::BELONGS_TO, 'Airport', 'source_id'),
            'destination' => array(self::BELONGS_TO, 'Airport', 'destination_id'),
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
            'amendments' => array(self::HAS_MANY, 'Amendment', 'air_route_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'destination_id' => 'Destination',
            'source_id' => 'Source',
            'carrier_id' => 'Carrier',
            'flight_number' => 'Flight Number',
            'departure_ts' => 'Departure Time',
            'arrival_ts' => 'Arrival Time',
            'order_' => 'Order',
            'air_booking_id' => 'Air Booking',
            'source_terminal' => "Departure terminal",
            'destination_terminal' => "Arrival terminal",
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
        $criteria->compare('destination_id', $this->destination_id);
        $criteria->compare('source_id', $this->source_id);
        $criteria->compare('carrier_id', $this->carrier_id);
        $criteria->compare('flight_number', $this->flight_number, true);
        $criteria->compare('departure_ts', $this->departure_ts, true);
        $criteria->compare('arrival_ts', $this->arrival_ts, true);
        $criteria->compare('order_', $this->order_);
        $criteria->compare('air_booking_id', $this->air_booking_id);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return AirRoutes the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getAirRoutesEssentials() {
        $out = $this->attributes;
        unset($out['air_booking_id']);
        unset($out['id']);
        unset($out['source_terminal']);
        unset($out['destination_terminal']);
        unset($out['order_']);
        unset($out['meal']);
        unset($out['seat']);
        unset($out['aircraft']);
        unset($out['airPnr']);
        unset($out['fare_basis']);
        unset($out['booking_class']);
        return $out;
    }

    public function getCarrierCodeAndFlightNumber() {
        return "{$this->carrier->code}-{$this->flight_number}";
    }

    /**
     * Add the seconds part (the string ":00") of the timestamp when needed.
     */
    public function addSeconds() {
        if (preg_match_all('/:/', $this->departure_ts) == 1)
            $this->departure_ts .= ":00";
        if (preg_match_all('/:/', $this->arrival_ts) == 1)
            $this->arrival_ts .= ":00";
    }

    /**
     * Cut the seconds part (last 3 chars) of the timestamp when needed.
     */
    public function cutSeconds() {
        if (preg_match_all('/:/', $this->departure_ts) == 2)
            $this->departure_ts = substr($this->departure_ts, 0, -3);
        if (preg_match_all('/:/', $this->arrival_ts) == 2)
            $this->arrival_ts = substr($this->arrival_ts, 0, -3);
    }

    /**
     * Pretty formatting of the parameters
     * @return array
     */
    function pretty() {
        return [
            'origin' => \Airport::getAirportCodeFromId($this->source_id),
            'destination' => \Airport::getAirportCodeFromId($this->destination_id),
            'departure' => $this->departure_ts,
            'arrival' => $this->arrival_ts,
            'carrier' => \Carrier::getCodeFromId($this->carrier_id),
            'flightNumber' => $this->flight_number,
            'originTerminal' => $this->source_terminal,
            'destinationTerminal' => $this->destination_terminal,
//            'fareBasis' => $this->fare_basis,
//            'bookingClass' => $this->booking_class,
            'meal' => $this->meal,
            'seat' => $this->seat,
            'aircraft' => $this->aircraft,
        ];
    }
    
    /**
     * get  details of the parameters
     * @return array
     */
    function getDetails() {
        //$diff=date_diff(new DateTime($this->arrival_ts), new DateTime($this->departure_ts));
        
        //$duration=$diff->h.'h '.$diff->i.'m';
        
        $d_tz = \Airport::getTimezoneByCode(\Airport::getAirportCodeFromId($this->destination_id));
        $o_tz = \Airport::getTimezoneByCode(\Airport::getAirportCodeFromId($this->source_id));
        
        
        if (isset($d_tz) && isset($o_tz)) {
            $duration1 = (new \DateTime($this->arrival_ts, new \DateTimeZone($d_tz)))
                    ->diff(new \DateTime($this->departure_ts, new \DateTimeZone($o_tz)));
            //        ->format('%Hh:%Im');
            $hours=(int)$duration1->d*24+$duration1->h;
            $duration = $hours . 'h ' . $duration1->i . 'm';
        } else {
            $duration = \Utils::convertSecToHoursMins(strtotime($this->arrival_ts) - strtotime($this->departure_ts));
        }
       
        $originDetails=\Airport::getAirportNameAndCityNameFromId($this->source_id);
        $destinationDetails=\Airport::getAirportNameAndCityNameFromId($this->destination_id);
        if(!empty($this->source_terminal)){
            $originDetails.=' Terminal: '.$this->source_terminal;
        }
        if(!empty($this->destination_terminal)){
            $destinationDetails.=' Terminal: '.$this->destination_terminal;
        }
        return [
            'id'=>$this->id,
            'origin' => \Airport::getAirportCodeFromId($this->source_id),
            'originDetails' => $originDetails,
            'destination' => \Airport::getAirportCodeFromId($this->destination_id),
            'destinationDetails' => $destinationDetails,
            'departure' => $this->departure_ts,
            'flighttime'=>$duration,
            'arrival' => $this->arrival_ts,
            'logo' => $this->carrier->getImageUrl(),
            'carrier' => \Carrier::getCodeFromId($this->carrier_id),
            'carrierName' => \Carrier::getNameFromId($this->carrier_id),
            'flightNumber' => $this->flight_number,
            'originTerminal' => $this->source_terminal,
            'destinationTerminal' => $this->destination_terminal,
//            'fareBasis' => $this->fare_basis,
//            'bookingClass' => $this->booking_class,
            'techStop'=>isset($this->ts) ? $this->ts : null,//'BLR 12:30 13:00'
            'meal' => $this->meal,
            'seat' => $this->seat,
            'aircraft' => $this->aircraft,
        ];
    }

    /**
     * Pretty formatting of the parameters for Manual booking
     * @return array
     */
    function prettyForManualBook() {
        $dptts=explode(' ', $this->departure_ts);
        return [
            'origin' => \Airport::getAirportCodeFromId($this->source_id),
            'destination' => \Airport::getAirportCodeFromId($this->destination_id),
            'depart' => $dptts[0],
            'marketingCompany' => trim(\Carrier::getCodeFromId($this->carrier_id)),
            'bookingClass' => $this->booking_class,
            'flightNumber' => trim($this->flight_number),
            'departTs' => \Utils::shortenDateAndTimeManualBook($this->departure_ts),
            'arriveTs' => $this->arrival_ts,
            'techStop'=>isset($this->ts) ? $this->ts : null,
//            'originTerminal' => $this->source_terminal,
//            'destinationTerminal' => $this->destination_terminal,
//            'fareBasis' => $this->fare_basis,
//            'bookingClass' => $this->booking_class,
//            'meal' => $this->meal,
//            'seat' => $this->seat,
//            'aircraft' => $this->aircraft,
        ];
    }
    
    /*
     * return true if any airport in route bookings is outside India
     */

    public function isInternational() {

        if ($this->source->country_code != 'IN' || $this->destination->country_code != 'IN') {
            return true;
        }
           
        return false;
    }
}
