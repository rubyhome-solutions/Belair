<?php

/**
 * This is the model class for table "routes_cache".
 *
 * The followings are the available columns in table 'routes_cache':
 * @property integer $id
 * @property integer $destination_id
 * @property integer $origin_id
 * @property integer $air_source_id
 * @property integer $traveler_type_id
 * @property integer $service_type_id
 * @property integer $carrier_id
 * @property string $last_check
 * @property string $updated
 * @property string $departure_date
 * @property string $departure_time
 * @property string $arrival_date
 * @property string $arrival_time
 * @property string $return_date
 * @property string $return_time
 * @property integer $round_trip
 * @property double $tax_yq
 * @property double $tax_jn
 * @property double $tax_udf
 * @property double $tax_psf
 * @property double $tax_other
 * @property double $total_tax_correction
 * @property integer $stops
 * @property string $legs_json
 * @property string $fare_basis
 * @property double $base_fare
 * @property double $total_taxes
 * @property double $total_fare
 * @property integer $hits
 * @property string $flight_number
 * @property integer $order_
 * @property integer $grouping
 * @property string $hash_str
 * @property integer $hash_id
 * @property integer $cabin_type_id
 * @property integer $search_id
 * @property text $luggage
 * @property integer $refundable
 *
 * The followings are the available model relations:
 * @property Carrier $carrier
 * @property AirSource $airSource
 * @property ServiceType $serviceType
 * @property TravelerType $travelerType
 * @property Airport $origin
 * @property Airport $destination
 * @property Searches $search
 * @property RcLink $linkFrom
 * @property RcLink $linkTo
 */
class RoutesCache extends CActiveRecord {

    const SCRAPPER_BOOKING_CLASS = 'Z';
    const ORDER_SINGLE_JOURNEY = 11;
    const ORDER_FIRST_JOURNEY_FROM_TWO = 12;
    const ORDER_SECOND_JOURNEY_FROM_TWO = 22;
    const ORDER_ALL_JOURNEYS = 9999;
    const HASH_SEPARATOR = '~';
    const RFUNDABLE_NONE = 0;
    const RFUNDABLE_YES = 1;
    const RFUNDABLE_CHECK_RULES = 2;

    static $orderName = [
        self::ORDER_SINGLE_JOURNEY => 'Single',
        self::ORDER_FIRST_JOURNEY_FROM_TWO => 'First',
        self::ORDER_SECOND_JOURNEY_FROM_TWO => 'Second',
        self::ORDER_ALL_JOURNEYS => 'All(GDS)',
    ];

    /**
     * The booking fee calculated after applying a CommercialRule
     * @var int
     */
    public $bookingFee = 0;

    /**
     * The discount calculated after applying a CommercialRule
     * @var int
     */
    public $discount = 0;

    /**
     * The ID of the CommercialRule that is already applied
     * @var int
     */
    public $commercial_rule_id = null;

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'routes_cache';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id, destination_id, origin_id, air_source_id, traveler_type_id, service_type_id, carrier_id, departure_date, departure_time, arrival_date, arrival_time, booking_class, flight_number', 'required'),
            array('id, destination_id, origin_id, air_source_id, traveler_type_id, service_type_id, carrier_id, round_trip, stops, hits, order_, grouping, cabin_type_id, search_id, refundable', 'numerical', 'integerOnly' => true),
            array('tax_yq, tax_jn, tax_udf, tax_psf, tax_other, total_tax_correction, base_fare, total_taxes, total_fare', 'numerical'),
            array('last_check, updated, return_date, return_time, legs_json, fare_basis, hash_str, hash_id, luggage', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('destination_id, origin_id, air_source_id, service_type_id, carrier_id, departure_date, departure_time, arrival_date, arrival_time, return_date, return_time, round_trip, tax_yq, tax_jn, tax_udf, tax_psf, tax_other, total_tax_correction, stops, fare_basis, base_fare, total_fare, hits, booking_class, flight_number, search_id', 'safe', 'on' => 'search'),
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
            'airSource' => array(self::BELONGS_TO, 'AirSource', 'air_source_id'),
            'serviceType' => array(self::BELONGS_TO, 'ServiceType', 'service_type_id'),
            'travelerType' => array(self::BELONGS_TO, 'TravelerType', 'traveler_type_id'),
            'origin' => array(self::BELONGS_TO, 'Airport', 'origin_id'),
            'destination' => array(self::BELONGS_TO, 'Airport', 'destination_id'),
            'cabinType' => array(self::BELONGS_TO, 'CabinType', 'cabin_type_id'),
            'search' => [self::BELONGS_TO, 'Searches', 'search_id'],
            'linkFrom' => array(self::HAS_ONE, 'RcLink', 'from'),
            'linkTo' => array(self::HAS_ONE, 'RcLink', 'to'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'destination_id' => 'Destination',
            'origin_id' => 'Origin',
            'air_source_id' => 'Air Source',
            'traveler_type_id' => 'Traveler Type',
            'service_type_id' => 'Service Type',
            'carrier_id' => 'Carrier',
            'last_check' => 'Last Check',
            'updated' => 'Updated',
            'departure_date' => 'Departure Date',
            'departure_time' => 'Departure Time',
            'arrival_date' => 'Arrival Date',
            'arrival_time' => 'Arrival Time',
            'return_date' => 'Return Date',
            'return_time' => 'Return Time',
            'round_trip' => 'Round Trip',
            'tax_yq' => 'Tax Yq',
            'tax_jn' => 'Tax Jn',
            'tax_udf' => 'Tax Udf',
            'tax_psf' => 'Tax Psf',
            'tax_other' => 'Tax Other',
            'total_tax_correction' => 'Total Tax Correction',
            'stops' => 'Stops',
            'legs_json' => 'Legs Json',
            'fare_basis' => 'Fare Basis',
            'base_fare' => 'Base Fare',
            'total_taxes' => 'Total Taxes',
            'total_fare' => 'Total Fare',
            'hits' => 'Hits',
            'booking_class' => 'Booking Class',
            'flight_number' => 'Flight Number',
            'order_' => 'Journey order X/Y format',
            'grouping' => 'Cache results grouping',
            'hash_str' => 'Hash',
            'hash_id' => 'Hash',
            'luggage' => 'Luggage',
            'refundable' => 'Refundable',
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

        if (!empty($this->destination_id)) {
            $destination_id = \Airport::getIdFromCode($this->destination_id);
        } else {
            $destination_id = null;
        }
        if (!empty($this->origin_id)) {
            $origin_id = \Airport::getIdFromCode($this->origin_id);
        } else {
            $origin_id = null;
        }
        if (!empty($this->carrier_id)) {
            $carrier_id = \Carrier::getIdFromCode($this->carrier_id);
        } else {
            $carrier_id = null;
        }

        $criteria = new CDbCriteria;
        $criteria->compare('destination_id', $destination_id);
        $criteria->compare('origin_id', $origin_id);
        $criteria->compare('carrier_id', $carrier_id);
        $criteria->compare('id', $this->id);
        $criteria->compare('search_id', $this->search_id);
        $criteria->compare('air_source_id', $this->air_source_id);
        $criteria->compare('flight_number', $this->flight_number);
        $criteria->compare('round_trip', $this->round_trip);
        $criteria->compare('grouping', $this->grouping);
        $criteria->compare('total_fare', $this->total_fare);
        $criteria->compare('order_', $this->order_);
        $criteria->compare('fare_basis', strtoupper($this->fare_basis));
        $criteria->compare('traveler_type_id', $this->traveler_type_id);
        $criteria->compare('departure_date', $this->departure_date);

        $dp = new CActiveDataProvider($this, [
            'pagination' => ['pageSize' => 20],
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
        ]);
        if (empty($criteria->condition)) {
            $dp->setTotalItemCount(\Utils::fastCountAll($this->tableName()));
        }
        return $dp;
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return RoutesCache the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Get unique grouping to be used by the cache to group results with multiple journeys
     * @return integer The next grouping ID
     */
    public static function getNextGroupId() {
        $query = Yii::app()->db->createCommand("SELECT nextval('cache_group_seq');")
                ->queryRow();
        return (int) $query['nextval'];
    }

    /**
     * Format the pricing info as HTML table
     * @return string
     */
    function printPriceTable() {
        return "<table><tr><th>Base</th><td>{$this->base_fare}</td></tr>"
                . '<tr><th>' . \Taxes::TAX_YQ . "</th><td>{$this->tax_yq}</td></tr>"
                . '<tr><th>' . \Taxes::TAX_JN . "</th><td>{$this->tax_jn}</td></tr>"
                . '<tr><th>' . \Taxes::TAX_UDF . "</th><td>{$this->tax_udf}</td></tr>"
                . '<tr><th>' . \Taxes::TAX_PSF . "</th><td>{$this->tax_psf}</td></tr>"
                . '<tr><th>' . \Taxes::TAX_OTHER . "</th><td>{$this->tax_other}</td></tr>"
                . "<tr><th>Total</th><td>{$this->total_fare}</td></tr></table>";
    }

    /**
     * Produce array with the specific elements
     * @param string $element The element to be extracted
     * @return array Collection of the extracted elements
     */
    function extractJsonLegElement($element) {
        $data = json_decode($this->legs_json);
        if (!is_array($data[0])) {
            $data = [$data];
        }
        $out = [];
        foreach ($data as $journey) {
            foreach ($journey as $segment) {
                if (isset($segment->$element)) {
                    $out[] = $segment->$element;
                }
            }
        }
        return $out;
    }

    /**
     * Concatenate all booking classes for all segments in the journeys
     * @param string $legs_json JSON encoded LegsJson class
     * @return string
     */
    static function extractBookingClasses($legs_json) {
        $data = json_decode($legs_json);
        if (!is_array($data[0])) {
            $data = [$data];
        }
        $out = '';
        foreach ($data as $journey) {
            foreach ($journey as $segment) {
                if (isset($segment->bookingClass)) {
                    $out .= $segment->bookingClass;
                }
            }
        }
        return $out;
    }

    /**
     * Extract the legs_json string into array of LegsJson[]. This extraction is equivalent as preparing the segments for the booking
     * @return array of arrays filled with LegsJson elements, like [[L1, L2], [L3, L4]]
     */
    function extractSegments() {
        $data = json_decode($this->legs_json);
//        echo \Utils::dbgYiiLog($data);
        if (!is_array($data[0])) {
            $data = [$data];
        }
        $out = [];
        $i = 1;
        foreach ($data as $journey) {
            foreach ($journey as $segment) {
                /* @var $segment LegsJson */
                $tmp[] = [
                    'origin' => substr($segment->origin, -4, 3),
                    'destination' => substr($segment->destination, -4, 3),
                    'depart' => strstr($segment->depart, ' ', true),
                    'flightNumber' => ltrim(strrchr($segment->flighNumber, '-'), '-'),
                    'marketingCompany' => \Carrier::getCodeFromId($this->carrier_id),
                    'bookingClass' => $segment->bookingClass,
                    'departTs' => $segment->depart,
                    'arriveTs' => $segment->arrive,
                    'aircraft' => $segment->aircraft,
                    'destinationTerminal' => $segment->destinationTerminal,
                    'originTerminal' => $segment->originTerminal,
                    'carrier' => strstr($segment->flighNumber, '-', true),
                    'ts' => empty($segment->ts) ? null : $segment->ts,
                ];
            }
            $out[$i] = $tmp;
            $i++;
            unset($tmp);
        }
        return $out;
    }

    /**
     * Nicely format the legs_json as a html table
     * @return string
     */
    function printJsonHtml() {
        $out = '<table><tr><th>№</th><th>Origin</th><th>Destination</th><th>Depart</th><th> Arrive</th><th>Fligh</th><th> T1 </th><th> T2 </th><th>Time</th><th>Aircraft</th></tr>';
        $data = json_decode($this->legs_json);
//        \Utils::dbgYiiLog($data);
        if (!is_array($data[0])) {
            $data = [$data];
        }
        /* @var $data LegsJson[] */
        foreach ($data as $journey) {
            $i = 1;
            foreach ($journey as $value) {
                $bookingClass = empty($value->bookingClass) ? '' : " ($value->bookingClass)";
                $out .= "<tr><td>{$i}.</td>";
                $i++;
                if (!empty($value->ts)) {
                    $ts = "<br>(via $value->ts)";
                } else {
                    $ts = null;
                }
                $out .= "<td>{$value->origin}$ts</td>";
                $out .= "<td>$value->destination</td>";
                $out .= "<td>$value->depart</td>";
                $out .= "<td>$value->arrive</td>";
                $out .= "<td>{$value->flighNumber}{$bookingClass}</td>";
//                $out .= "<td>{$value->flighNumber}</td>";
                if (!empty($value->originTerminal)) {
                    $out .= "<td>$value->originTerminal</td>";
                } else {
                    $out .= "<td></td>";
                }
                if (!empty($value->destinationTerminal)) {
                    $out .= "<td>$value->destinationTerminal</td>";
                } else {
                    $out .= "<td></td>";
                }
                $out .= "<td>$value->time</td>";
                if (!empty($value->aircraft)) {
                    $out .= "<td>$value->aircraft</td></tr>";
                } else {
                    $out .= "<td></td></tr>";
                }
            }
            $out .= "<tr><td colspan='10'></td></tr>";
        }
        return $out . '</table>';
    }

    /**
     * Get html formated RC elements that are not present in the $oldResults. Same are shown on the Search test dynamic page
     * @param int $searchId
     * @param array $oldResults
     * @return array
     */
    static function getCacheResults($searchId, $oldResults) {
        $out = [];
        $cacheRows = \RoutesCache::model()->findAllByAttributes(['search_id' => $searchId]);
        /* @var $cacheRows \RoutesCache[] */
        foreach ($cacheRows as $cacheRow) {
            if (!isset($oldResults[$cacheRow->id])) {
                $out[$cacheRow->id]['airSource'] = $cacheRow->cache(3600)->airSource->name;
                $out[$cacheRow->id]['airline'] = "{$cacheRow->cache(3600)->carrier->generateImgTag}&nbsp;{$cacheRow->cache(3600)->carrier->name}";
                $out[$cacheRow->id]['ports'] = $cacheRow->cache(3600)->origin->airport_code . "→" . $cacheRow->cache(3600)->destination->airport_code;
                $out[$cacheRow->id]['dates'] = "D: $cacheRow->departure_date " . \Utils::cutSeconds($cacheRow->departure_time) . "<br>A: {$cacheRow->arrival_date} " . \Utils::cutSeconds($cacheRow->arrival_time);
                $out[$cacheRow->id]['legs'] = $cacheRow->printJsonHtml();
                $out[$cacheRow->id]['taxDetails'] = $cacheRow->printPriceTable();
                $out[$cacheRow->id]['total'] = $cacheRow->total_fare;
                $out[$cacheRow->id]['stops'] = $cacheRow->stops;
                $out[$cacheRow->id]['pax'] = \TravelerType::$typeToStr[$cacheRow->traveler_type_id];
                $tses = $cacheRow->extractJsonLegElement('ts');
                if (!empty($tses)) {
                    $out[$cacheRow->id]['ports'] .= "<br>(via " . implode(' ', $tses) . ")";
                }
            }
        }
        return $out;
    }

    /**
     * Check if the given commercial rule matches the RoutesCache ($this)
     * @param int $ruleId The Commercial rule ID
     * @return boolean True if the rule should be applied
     */
    function matchRule($ruleId) {
        $rule = \CommercialRule::model()->cache(300)->findByPk($ruleId);
        /* @var $rule \CommercialRule */
        return $rule->matchRouteCache($this, 0);
    }

    /**
     * Calculate the effect of specific CommercialRule. Same is used in RC management for double checking the Commercial Rules effect.
     * @param int $ruleId CommercialRule ID
     * @return string HTML formated as a table in popover
     */
    function calcAndFormatRule($ruleId) {
        $rule = \CommercialRule::model()->findByPk($ruleId);
        /* @var $rule \CommercialRule */
        if ($rule->matchRouteCache($this, 0)) {
            $data = $rule->applyRule($this, 0);
            $outTotal = round($data->total - $this->total_fare + $data->bookingFee - $data->discount, 2);
            if ($outTotal > 0) {
                $outTotal = "+$outTotal";
                $class = "btn-success";
            } elseif ($outTotal < 0) {
                $class = "btn-danger";
            } else {
                $class = "";
            }
            $table = "<table>
<tr><th>Base fare</th><td>$data->base</td></tr>
<tr><th>YQ</th><td>$data->yq</td></tr>
<tr><th>Total</th><td>$data->total</td></tr>
<tr><th>Discount</th><td>$data->discount</td></tr>
<tr><th>Booking fee</th><td>$data->bookingFee</td></tr>
<tr><th>Calculated</th><td>" . ($data->total + $data->bookingFee - $data->discount) . "</td></tr>
</table>";
            return TbHtml::popover($outTotal, 'Rule calculations', $table, ["data-html" => "true", 'class' => "btn btn-small $class"]);
        }
        return '';
    }

    /**
     * Calculate the commercial rule effect and apply to the RouteCache object<br>
     * This function can change the attributes $tax_yq, $total_fare, $base_fare<br>
     * The bookingFee and the discount are included in the base_fare
     * @param int $ruleId The CommercialRula ID to be applyed
     * @param int $clientSourceId From where the client is coming. If NULL the client source is nto checked
     */
    function applyCommercialRule($ruleId, $clientSourceId = 0) {

        $rule = \CommercialRule::model()->cache(60)->findByPk($ruleId);
        /* @var $rule \CommercialRule */
        if ($this->commercial_rule_id === null && $rule->matchRouteCache($this, $clientSourceId)) {
            $data = $rule->applyRule($this, $clientSourceId);
            $this->total_fare = round($data->total);
            $this->bookingFee = round($data->bookingFee);
            $this->discount = round($data->discount);
            $this->tax_yq = round($data->yq);
            $this->base_fare = round($data->base);
            $this->commercial_rule_id = $ruleId;
        }
    }

    /**
     * Calculate the effect of specific CommissionRule. Same is used in RC management for double checking the Commission Rules calculations.
     * @param int $ruleId CommissionRule ID
     * @param int $commercialRuleId CommercialRule ID
     * @return string HTML formated as a button with the total amount as title
     */
    function calcAndFormatCommissionRule($ruleId, $commercialRuleId) {
        $rule = \CommissionRule::model()->findByPk($ruleId);
        /* @var $rule \CommissionRule */
        $commercialRule = \CommercialRule::model()->findByPk($commercialRuleId);
        /* @var $commercialRule \CommercialRule */
        if ($rule->matchRouteCache($this)) {
            $outTotal = $rule->applyRule($this);
            if ($outTotal > 0) {
                $class1 = "btn-success";
            } elseif ($outTotal < 0) {
                $class1 = "btn-danger";
            } else {
                $class1 = "";
            }
            if ($commercialRule && $commercialRule->matchRouteCache($this, 0)) {
                $outTotal2 = $outTotal + $commercialRule->calcTotalEfect($this);
            } else {
                $outTotal2 = $outTotal;
            }
            if ($outTotal2 > 0) {
                $class2 = "btn-success";
            } elseif ($outTotal2 < 0) {
                $class2 = "btn-danger";
            } else {
                $class2 = "";
            }
            return TbHtml::badge($outTotal, ['class' => "$class1"]) . '<br>' .
                    TbHtml::badge('<i class="fa fa-calculator"></i>&nbsp;' . $outTotal2, ['class' => "$class2"]);
        }
        return '';
    }

    /**
     * Apply the predefined B2C commercial plan to set of RouteCache objects
     * @param array $arrRcs Array of journeys of array of RCs, where every pax type has different RC
     * @param int $clientSource The source of the client
     */
    static function applyB2cCommercialPlan(array &$arrRcs, $clientSource) {
        $commercialPlan = \CommercialPlan::findB2cPlan();
        if ($commercialPlan !== null) {
            foreach ($arrRcs as &$journeys) {
                foreach ($journeys as &$journey) {
                    foreach ($journey as &$rc) {
                        $commercialPlan->applyPlanToRouteCache($rc, $clientSource);
                    }
                }
            }
        }
    }

    /**
     * Find same RouteCache object, but for another traveller type
     * @param int $travelerTypeId Traveler type ID
     * @return RoutesCache The corresponding RC object or NULL
     */
    function findSame($travelerTypeId, $searchId) {
        $hash_str = substr($this->hash_str, 0, -1) . $travelerTypeId;
        $hash_id = "x'" . str_pad(hash('fnv164', $hash_str), 16, '0', STR_PAD_LEFT) . "'::int8";
        $out = $this->findBySql("SELECT routes_cache.* from routes_cache "
                . "WHERE order_={$this->order_} and hash_id=$hash_id AND search_id=$searchId;");

//        $out = $this->findByAttributes([
//            'origin_id' => $this->origin_id,
//            'destination_id' => $this->destination_id,
//            'air_source_id' => $this->air_source_id,
//            'traveler_type_id' => $travelerTypeId,
//            'cabin_type_id' => $this->cabin_type_id,
//            'carrier_id' => $this->carrier_id,
//            'order_' => $this->order_,
//            'departure_date' => $this->departure_date,
//            'arrival_date' => $this->arrival_date,
//            'flight_number' => $this->flight_number,
//            'hash_str' => substr($this->hash_str, 0, -1) . $travelerTypeId,
//        ]);
//        if (!$out) {
//            \Utils::dbgYiiLog($this->attributes);
//            throw new CHttpException(500, "The system can not find the corresponding RC element for travelerTypeId: $travelerTypeId. Please inform the administrators to check the logs!");
//        }
        return $out;
    }

    /**
     * Find same RouteCache object in the given array, but for another traveller type
     * @param int $travelerTypeId Traveler type ID
     * @param \RoutesCache[]  $allResults
     * @return RoutesCache The corresponding RC object or NULL
     */
    function findSameV2($travelerTypeId, array $allResults) {
        $hash_str = substr($this->hash_str, 0, -1) . $travelerTypeId;
        foreach ($allResults as $rc) {
            if ($rc->hash_str === $hash_str) {
                return $rc;
            }
        }
        return null;
    }

    /**
     * Find all RouteCache objects with same pax type, but for the return journey
     * @return RoutesCache[] Array of RC objects
     */
    function findReturnTripSet($searchID) {
//        return $this->findAllByAttributes([
//                    'grouping' => $this->grouping,
//                    'traveler_type_id' => $this->traveler_type_id,
//                    'order_' => self::ORDER_SECOND_JOURNEY_FROM_TWO,
//        ]);

        return \RoutesCache::model()->findAllBySql(
                        'SELECT routes_cache.* from routes_cache ' .
                        'JOIN air_source ON (air_source.id = routes_cache.air_source_id) ' .
                        'WHERE routes_cache.search_id = :search_id AND routes_cache.traveler_type_id=:travellerTypeId ' .
                        'AND routes_cache.order_=:order_ AND air_source.display_in_search = 1 AND routes_cache.air_source_id = :air_source_id;'
                        , [
                    ':air_source_id' => $this->air_source_id,
                    ':search_id' => $searchID,
                    ':travellerTypeId' => $this->traveler_type_id,
                    ':order_' => self::ORDER_SECOND_JOURNEY_FROM_TWO,
        ]);
    }

    /**
     * Check if the fare is secial and is not valid for a one way trip
     * @return boolean TRUE if the fare is valid for the same grouping, FALSE if the fare is always valid
     */
    function specialRoundTripDiscountFare() {
        switch ($this->airSource->backend_id) {
            case \Backend::INDIGO_PRODUCTION:
            case \Backend::INDIGO_TEST:
            case \Backend::INDIGO_SCRAPPER:
            case \Backend::GOAIR_PRODUCTION:
            case \Backend::GOAIR_TEST:
                if (strtoupper(substr(trim($this->fare_basis), -2, 2)) === 'RT') {
                    return true;
                }
                break;
            case \Backend::SPICEJET_PRODUCTION:
            case \Backend::SPICEJET_TEST:
            case \Backend::SPICEJET_SCRAPPER:
                if (strtoupper(substr(trim($this->fare_basis), 1, 2)) === 'RT') {
                    return true;
                }
                break;
        }

        return false;
    }

    /**
     * Update specific RCs
     * @param array $rows The rows that has to be updated
     */
    static function updateResults(array $rows) {
        foreach ($rows as $row) {
            if (empty($row['hash_id'])) {
                continue;
            }
            $rcs = self::model()->findAll("hash_id={$row['hash_id']} AND order_={$row['order_']}");
            if (empty($rcs)) {
                continue;
            }
            foreach ($rcs as &$rc) {
                $searchId = $rc->search_id; // Preserve the searchId
                $rc->attributes = $row;
                $rc->search_id = $searchId; // Keep the original searchId
                $rc->hash_id = new CDbExpression($row['hash_id']);
                $rc->save(false);
            }
        }
    }

    /**
     * Produce key for the app cache, based on the search number and the hash_str attribute, but without the air source id
     * @return string 
     */
    function getAppCacheKey() {
        $hashStr = substr(strstr($this->hash_str, self::HASH_SEPARATOR), 0, -2);
        return 'Search:' . $this->search_id . $hashStr;
    }

    /**
     * Set the app cache with data about the current route cache
     * @param float $effectiveTotal The total minus the commission
     * @param int $asPriority The air source priority
     * @param int $timeout Default 2 min
     */
    function registerInAppCache($effectiveTotal, $asPriority, $timeout = 120) {
        \Yii::app()->cache->set($this->getAppCacheKey(), [
            'id' => $this->id,
            'asp' => $asPriority,
            'total' => $effectiveTotal
                ], $timeout);

//        \Utils::dbgYiiLog([$this->getAppCacheKey() => [
//                'id' => $this->id,
//                'asp' => $asPriority,
//                'total' => $effectiveTotal
//        ]]);
    }

    /**
     * Retrive stored RC from the App cache
     * @return boolean|array 
     */
    function getFromAppCache() {
        return \Yii::app()->cache->get($this->getAppCacheKey());
    }

    /**
     * Calculate the commission for the RC object
     * @return float
     */
    function calcCommission() {
        $rules = \CommissionRule::model()->cache(300)->findAllBySql('SELECT * FROM commission_rule '
                . 'WHERE carrier_id =:carrier_id AND '
                . '(air_source_id =:air_source_id OR air_source_id IS NULL) AND '
                . '(service_type_id =:service_type_id OR service_type_id IS NULL)', [
            'carrier_id' => $this->carrier_id,
            'air_source_id' => $this->air_source_id,
            'service_type_id' => $this->service_type_id,
                ], ['order' => 'service_type_id, air_source_id, order_']);

        /* @var $rules \CommissionRule[] */
        foreach ($rules as $rule) {
            if ($rule->matchRouteCache($this)) {
                // Calculate the commission
                return $rule->applyRule($this);
            }
        }
        return 0;
    }

}

class LegsJson {

    public $origin,
            $destination,
            $depart,
            $arrive,
            $flighNumber,
            $originTerminal,
            $destinationTerminal,
            $time,
            $aircraft,
            $bookingClass,
            $ts;

}

?>
