<?php

/**
 * This is the model class for table "amendment".
 *
 * The followings are the available columns in table 'amendment':
 * @property integer $id
 * @property integer $air_booking_id
 * @property integer $payment_id
 * @property integer $payment_status_id
 * @property integer $invoice_status_id
 * @property integer $amendment_status_id
 * @property integer $amendment_type_id
 * @property integer $loged_user_id
 * @property string $created
 * @property string $flight_number
 * @property string $departure_ts
 * @property string $arrival_ts
 * @property string $airline_pnr
 * @property string $crs_pnr
 * @property string $ticket_number
 * @property double $basic_fare
 * @property double $fuel_surcharge
 * @property double $congestion_charge
 * @property double $airport_tax
 * @property double $udf_charge
 * @property double $jn_tax
 * @property double $meal_charge
 * @property double $seat_charge
 * @property double $passtrough_fee
 * @property double $supplier_amendment_fee
 * @property double $booking_fee
 * @property double $service_tax
 * @property double $reseller_amendment_fee
 * @property double $commission_or_discount_gross
 * @property double $tds
 * @property double $other_tax
 * @property boolean $refund_tds
 * @property double $amount_to_charge
 * @property double $oc_charge
 * @property integer $air_route_id
 * @property string $note
 * @property integer $group_id  Value used to group amendments   
 * @property integer $nextGroupId  Function to get the next unique group_id value
 * @property string $changes
 * @property integer $prev_ab_status_id The original value of the AB status
 * @property string $credit_debit_note_no
 *
 * The followings are the available model relations:
 * @property AirBooking $airBooking
 * @property AirRoutes $airRoute
 * @property Payment $payment
 * @property PaymentStatus $paymentStatus
 * @property InvoiceStatus $invoiceStatus
 * @property AmendmentType $amendmentType
 * @property AmendmentStatus $amendmentStatus
 * @property Users $logedUser
 */
class Amendment extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'amendment';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('air_booking_id, amendment_type_id, loged_user_id, air_route_id, group_id', 'required'),
            array('air_booking_id, payment_id, payment_status_id, invoice_status_id, amendment_status_id, amendment_type_id, loged_user_id, group_id', 'numerical', 'integerOnly' => true),
            array('basic_fare, fuel_surcharge, congestion_charge, airport_tax, udf_charge, jn_tax, meal_charge, seat_charge, passtrough_fee, supplier_amendment_fee, booking_fee, service_tax, reseller_amendment_fee, commission_or_discount_gross, other_tax, tds, amount_to_charge', 'numerical'),
            array('flight_number, departure_ts, arrival_ts, airline_pnr, crs_pnr, ticket_number, refund_tds', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, air_booking_id, payment_id, payment_status_id, invoice_status_id, amendment_status_id, amendment_type_id, loged_user_id, created, flight_number, departure_ts, arrival_ts, airline_pnr, crs_pnr, ticket_number, basic_fare, fuel_surcharge, congestion_charge, airport_tax, udf_charge, jn_tax, meal_charge, seat_charge, passtrough_fee, supplier_amendment_fee, booking_fee, service_tax, reseller_amendment_fee, commission_or_discount_gross, tds, refund_tds, amount_to_charge', 'safe', 'on' => 'search'),
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
            'airRoute' => array(self::BELONGS_TO, 'AirRoutes', 'air_route_id'),
            'payment' => array(self::BELONGS_TO, 'Payment', 'payment_id'),
            'paymentStatus' => array(self::BELONGS_TO, 'PaymentStatus', 'payment_status_id'),
            'invoiceStatus' => array(self::BELONGS_TO, 'InvoiceStatus', 'invoice_status_id'),
            'amendmentType' => array(self::BELONGS_TO, 'AmendmentType', 'amendment_type_id'),
            'amendmentStatus' => array(self::BELONGS_TO, 'AmendmentStatus', 'amendment_status_id'),
            'logedUser' => array(self::BELONGS_TO, 'Users', 'loged_user_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'air_booking_id' => 'Air Booking',
            'payment_id' => 'Payment',
            'payment_status_id' => 'Payment Status',
            'invoice_status_id' => 'Invoice Status',
            'amendment_status_id' => 'Amendment Status',
            'amendment_type_id' => 'Amendment Type',
            'loged_user_id' => 'Loged User',
            'created' => 'Created',
            'flight_number' => 'Flight Number',
            'departure_ts' => 'Departure',
            'arrival_ts' => 'Arrival',
            'airline_pnr' => 'Airline Pnr',
            'crs_pnr' => 'CRS Pnr',
            'ticket_number' => 'Ticket Number',
            'basic_fare' => 'Basic Fare',
            'fuel_surcharge' => 'Fuel Surcharge',
            'congestion_charge' => 'Congestion Charge',
            'airport_tax' => 'Airport Tax',
            'udf_charge' => 'Udf Charge',
            'jn_tax' => 'JN Tax',
            'meal_charge' => 'Meal Charge',
            'seat_charge' => 'Seat Charge',
            'passtrough_fee' => 'Passtrough Fee',
            'supplier_amendment_fee' => 'Supplier Amendment Fee',
            'booking_fee' => 'Booking Fee',
            'service_tax' => 'Service Tax',
            'other_tax' => 'Other Tax',
            'reseller_amendment_fee' => 'Reseller Amendment Fee',
            'commission_or_discount_gross' => 'Commission Or Discount Gross',
            'tds' => 'Tds',
            'refund_tds' => 'Refund Tds',
            'amount_to_charge' => 'Amount To Charge',
            'oc_charge' => 'OC chatge',
            'carrier_id' => 'Airline',
            'source_id' => 'Source',
            'destination_id' => 'Destination',
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

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Amendment the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Get unique group_id to be used by the amendment
     * @return integer The next group_id
     */
    public static function getNextGroupId() {
        // select nextval('amendment_group_seq');
        $query = Yii::app()->db->createCommand("SELECT nextval('amendment_group_seq');")
                ->queryRow();
        return (int)$query['nextval'];
    }
    
    /**
     * Fill up the changes with table structure of the amended fields {field} {old value} {new value}
     * @param array $changes Changed info
     * @param array $old Old data
     */
    public function getAmendedInfo($changes, $old) {
        $labels = $this->attributeLabels();
        if (!$this->changes) {
            $this->changes = '';
        }
        foreach ($changes as $key => $value) {
            if ($key === 'source_id' || $key === 'destination_id') {
                $oldValue = \Airport::getAirportCodeAndCityNameFromId($old[$key]);
                $newValue = \Airport::getAirportCodeAndCityNameFromId($value);
            } else {
                $oldValue = $old[$key];
                $newValue = $value;
            }
            $this->changes .= "
                <tr>
                    <td>{$labels[$key]}</td>
                    <td>{$oldValue}</td>
                    <td>{$newValue}</td>
                </tr>";
        }
    }

    /*
     * Get Amendments that are SUCCESSFUL and CHARGED and Doesnt have credit/debit note
     */
    public static function getPendingAmendmentsForNote(){
        $amendments = Amendment::model()->findAll(array(
            'condition' => 'credit_debit_note_no IS NULL AND payment_status_id='.  \PaymentStatus::STATUS_CHARGED .' AND amendment_status_id='.\AmendmentStatus::STATUS_SUCCESS,
            'order' =>'id'
        ));

//        \Utils::dbgYiiLog($payments);
        return $amendments;
    }
    
    /*
     * Get Amendments xml for accounting
     */
    public static function getAmendmentXML() {
        $amendments = self::getPendingAmendmentsForNote();
        $xml = '';
        $xml.="<Amendments>";
        $first = true;
        $conv_fee = 0;
        foreach ($amendments as $key => $amendment) {
            if ($amendment->airBooking->airCart->invoice_no != null && !empty($amendment->airBooking->airCart->invoice_no)) {
                if(!$first) {
                    $conv_fee = $booking->airCart->convenienceFee;
                }
                $first = false;
                $xml.="<Amendment>";
                
                if($amendment->airBooking->airCart->user->userInfo->user_type_id===\UserType::clientB2C)
                { 
                    $xml.="<ID>AMDC".$amendment->id."</ID>";
                    $xml.="<CART_ID>INVC" . $amendment->airBooking->airCart->id . "</CART_ID>";
                }
                else
                {  
                    $xml.="<ID>AMDB".$amendment->id."</ID>"; 
                    $xml.="<CART_ID>INVB" . $amendment->airBooking->airCart->id . "</CART_ID>";                                 
                }
                
                $xml.="<AIRBOOKING_ID>" . $amendment->airBooking->id . "</AIRBOOKING_ID>";
                $xml.="<AIRROUTE_ID>" . $amendment->airRoute->id . "</AIRROUTE_ID>";
                $xml.="<INVOICE_NO>" . $amendment->airBooking->airCart->invoice_no . "</INVOICE_NO>";
                $xml.="<CUSTOMER_NAME>" . $amendment->airBooking->airCart->user->name . "</CUSTOMER_NAME>";
                $xml.="<CUSTOMER_ID>" . $amendment->airBooking->airCart->user->id . "</CUSTOMER_ID>";
                $xml.="<CUSTOMER_EMAIL>" . $amendment->airBooking->airCart->user->email . "</CUSTOMER_EMAIL>";
                $xml.="<CUSTOMER_MOBILE>" . $amendment->airBooking->airCart->user->mobile . "</CUSTOMER_MOBILE>";
                $xml.="<USER_INFO_ID>" . $amendment->airBooking->airCart->user->user_info_id . "</USER_INFO_ID>";
                $xml.="<USER_INFO_NAME>" . $amendment->airBooking->airCart->user->userInfo->name . "</USER_INFO_NAME>";
                $xml.="<USER_INFO_EMAIL>" . $amendment->airBooking->airCart->user->userInfo->email . "</USER_INFO_EMAIL>";
                $xml.="<USER_INFO_MOBILE>" . $amendment->airBooking->airCart->user->userInfo->mobile . "</USER_INFO_MOBILE>";
                $xml.="<PAYMENT_STATUS>" . $amendment->paymentStatus->name . "</PAYMENT_STATUS>";
                $xml.="<PURCHASER_AMOUNT>" . ((double)$amendment->amount_to_charge-(double)$amendment->supplier_amendment_fee ). "</PURCHASER_AMOUNT>";
                $xml.="<RESELLER_FEE>" . $amendment->supplier_amendment_fee . "</RESELLER_FEE>";
                $xml.="<CHARGE_AMOUNT>" . $amendment->amount_to_charge . "</CHARGE_AMOUNT>";
                $xml.="<AMENDMENT_STATUS>" . $amendment->amendmentStatus->name . "</AMENDMENT_STATUS>";
                $xml.="<AMENDMENT_TYPE>" . $amendment->amendmentType->name . "</AMENDMENT_TYPE>";
                $xml.="<AMENDMENT_BY>" . $amendment->logedUser->name . "</AMENDMENT_BY>";
                $xml.="<CREATED>" . $amendment->created . "</CREATED>";
                $xml.="<AIRBOOKING>";
                $xml.="<BOOKING_ID>" . $amendment->airBooking->id . "</BOOKING_ID>";
                $xml.="<BOOKING_TYPE>" . $amendment->airBooking->bookingType->name . "</BOOKING_TYPE>";
                $xml.="<PURCHASED_FROM>" . $amendment->airBooking->airSource->name . "</PURCHASED_FROM>";
                $xml.="<TRAVELER_TYPE>" . $amendment->airBooking->travelerType->name . "</TRAVELER_TYPE>";
                $xml.="<TRAVELER_ID>" . $amendment->airBooking->traveler->id . "</TRAVELER_ID>";
                $xml.="<TRAVELER_NAME>" . $amendment->airBooking->traveler->first_name . " " . $amendment->airBooking->traveler->last_name . "</TRAVELER_NAME>";
                $xml.="<BASIC_FARE>" . $amendment->airBooking->basic_fare . "</BASIC_FARE>";
                $xml.="<TOTAL_TAXES>" . $amendment->airBooking->getTaxesOnly() . "</TOTAL_TAXES>";
                $xml.="<SERVICE_TAX>" . $amendment->airBooking->service_tax . "</SERVICE_TAX>";
                $xml.="<DISCOUNT>" . $amendment->airBooking->commission_or_discount_gross . "</DISCOUNT>";
                $xml.="<BOOKING_FEE>" . $amendment->airBooking->booking_fee . "</BOOKING_FEE>";
                $xml.="<NET_FARE>" . ($amendment->airBooking->getTotalAmountToPay() - $conv_fee) . "</NET_FARE>";
                if ($amendment->airBooking->airSource != null && !empty($amendment->airBooking->airSource->currency_id))
                    $xml.="<CURRENCY>" . $amendment->airBooking->airSource->currency->code . "</CURRENCY>";
                else
                    $xml.="<CURRENCY></CURRENCY>";
                $xml.="<MEAL_CHARGES>" . $amendment->airBooking->meal_charge . "</MEAL_CHARGES>";
                $xml.="<SEAT_CHARGES>" . $amendment->airBooking->seat_charge . "</SEAT_CHARGES>";
                $xml.="<AIRBOOKING_STATUS>" . $amendment->airBooking->abStatus->name . "</AIRBOOKING_STATUS>";
                $xml.="<AIRLINE>" . $amendment->airBooking->carrier->name . "</AIRLINE>";
                if ($amendment->airBooking->cabin_type_id != null && !empty($amendment->airBooking->cabin_type_id))
                    $xml.="<CABIN_TYPE>" . $amendment->airBooking->cabinType->name . "</CABIN_TYPE>";
                else
                    $xml.="<CABIN_TYPE></CABIN_TYPE>";
                $xml.="<BOOKING_CLASS>" . $amendment->airBooking->booking_class . "</BOOKING_CLASS>";
                $xml.="<FLIGHT>" . $amendment->airBooking->carrier->code . "-" . $amendment->airBooking->airRoutes[0]->flight_number . "</FLIGHT>";
                $xml.="<SECTOR>" . $amendment->airBooking->source->city_code . "-" . $amendment->airBooking->destination->city_code . "</SECTOR>";
                $xml.="<DEPARTURE>" . $amendment->airBooking->departure_ts . "</DEPARTURE>";
                $xml.="<TICKET_NUMBER>" . $amendment->airBooking->ticket_number . "</TICKET_NUMBER>";
                $xml.="<AIRLINE_PNR>" . $amendment->airBooking->airline_pnr . "</AIRLINE_PNR>";
                $xml.="<CRS_PNR>" . $amendment->airBooking->crs_pnr . "</CRS_PNR>";

                $xml.="<AIRROUTE>";
                $xml.="<ROUTE_ID>" . $amendment->airRoute->id . "</ROUTE_ID>";
                $xml.="<AIRLINE>" . $amendment->airRoute->carrier->name . "</AIRLINE>";
                $xml.="<FLIGHT_NUMBER>" . $amendment->airRoute->flight_number . "</FLIGHT_NUMBER>";
                $xml.="<SOURCE>" . $amendment->airRoute->source->city_code . "</SOURCE>";
                $xml.="<DESTINATION>" . $amendment->airRoute->destination->city_code . "</DESTINATION>";
                $xml.="<DEPARTURE>" . $amendment->airRoute->departure_ts . "</DEPARTURE>";
                $xml.="<ARRIVAL>" . $amendment->airRoute->arrival_ts . "</ARRIVAL>";
                $xml.="</AIRROUTE>";

                $xml.="</AIRBOOKING>";

                $xml.="</Amendment>";
            }
        }
        $xml.="</Amendments>";
        return $xml;
    }
}
