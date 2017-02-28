<?php

/**
 * This is the model class for table "searches".
 *
 * The followings are the available columns in table 'searches':
 * @property integer $id
 * @property integer $user_id
 * @property string $created
 * @property string $origin
 * @property string $destination
 * @property integer $type_id
 * @property integer $is_domestic
 * @property string $date_depart
 * @property string $date_return
 * @property integer $adults
 * @property integer $children
 * @property integer $infants
 * @property integer $category
 * @property integer $client_source_id
 * @property integer $hits
 *
 * The followings are the available model relations:
 * @property Users $user
 * @property Process[] $processes
 * @property ClientSource $clientSource
 * @property RoutesCache[] $rcs
 */
class Searches extends CActiveRecord {

    public $originCountryCode;
    static $types = [
        1 => 'One way',
        2 => 'Round trip',
        3 => 'Multicity'
    ];
    static $isDomestic = ['International', 'Domestic'];
    static $cachingTimes = [
        [
            'low' => 0, // days to departure
            'high' => 1, // days to departure
            'old' => 15, // in minutes 1/4h
        ],
        [
            'low' => 1, // days to departure
            'high' => 2, // days to departure
            'old' => 30, // in minutes 1/2h
        ],
        [
            'low' => 2, // days to departure
            'high' => 3, // days to departure
            'old' => 60, // in minutes - 1h
        ],
        [
            'low' => 3, // days to departure
            'high' => 7, // days to departure
            'old' => 150, // in minutes - 2.5h
        ],
        [
            'low' => 7, // days to departure
            'high' => 15, // days to departure
            'old' => 300, // in minutes - 5h
        ],
        [
            'low' => 15, // days to departure
            'high' => 30, // days to departure
            'old' => 600, // in minutes - 10h
        ],
        [
            'low' => 30, // days to departure
            'high' => 3650, // days to departure
            'old' => 960, // in minutes - 16h , NB: Never increase this to more than 24h since the daily DB sweep value is 24h
        ],
    ];
    static $scrappingMandatoryKeys = [
        'arrive',
        'depart',
        'destination',
        'flightNumber',
        'source'
    ];
    static $loggedErrors = [];

    const TEST_MODEL_ID = 51;
    const MAX_WAITING_TIME_API3D = 23;
    const MAX_WAITING_TIME_B2BAPI = 40;
    const TYPE_ONE_WAY = 1;
    const TYPE_ROUND_TRIP = 2;
    const TYPE_MULTICITY = 3;
    const SEARCH_DONE = 'SearchDone:';
    const QUEUED_PROCESSES_LIST = 'QUEUED_PROCESSES_LIST::';

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'searches';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        return array(
            ['user_id, created, origin, destination, is_domestic, date_depart', 'required'],
            ['user_id, type_id, is_domestic, adults, children, infants, category', 'numerical', 'integerOnly' => true],
            ['date_return', 'safe'],
            ['id, user_id, origin, destination, type_id, is_domestic, date_depart, date_return, client_source_id, hits, originCountryCode', 'safe', 'on' => 'search'],
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'user' => array(self::BELONGS_TO, 'Users', 'user_id'),
            'processes' => array(self::HAS_MANY, 'Process', 'search_id'),
            'rcs' => [self::HAS_MANY, 'RoutesCache', 'search_id'],
            'clientSource' => array(self::BELONGS_TO, 'ClientSource', 'client_source_id'),
            'originAirport' => [self::BELONGS_TO, 'Airport', ['origin' => 'airport_code']],
//            'destinationAirport' => [self::BELONGS_TO, 'Airport', ['destination' => 'airport_code']],
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'user_id' => 'User',
            'created' => 'Created',
            'origin' => 'Origin',
            'destination' => 'Destination',
            'type_id' => 'Type',
            'is_domestic' => 'Is Domestic',
            'date_depart' => 'Date Depart',
            'date_return' => 'Date Return',
            'adults' => 'Adults',
            'children' => 'Children',
            'infants' => 'Infants',
            'client_source_id' => 'Source',
            'hits' => 'Hits',
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
        $criteria->with = [
            'clientSource' => [
                'together' => true,
                'joinType' => 'INNER JOIN'
            ],
            'originAirport' => [
                'together' => true,
                'joinType' => 'INNER JOIN'
            ],
        ];

        $criteria->compare('t.id', $this->id);
//        $criteria->compare('destination', strtoupper($this->destination));
        $criteria->compare('t.type_id', $this->type_id);
        $criteria->compare('t.is_domestic', $this->is_domestic);
        $criteria->compare('t.client_source_id', $this->client_source_id);
        $criteria->compare('t.hits', $this->hits);
        if (!empty($this->origin)) {
            $criteria->addInCondition('t.origin', explode(',', strtoupper($this->origin)));
        }
        if (!empty($this->originCountryCode)) {
            $criteria->addInCondition('"originAirport".country_code', explode(',', strtoupper($this->originCountryCode)));
        }

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC']
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Searches the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Populate the Searches object and queue the search processes
     * @param \BookingSearchForm $param
     * @param boolean $force Defaul to FALSE. Set to true if the search should be made even if same old search is available and is valid
     * @param array $airSourceIds Array of the air sources IDs that should be used. Defatult this is empty - means to use all applicable to the search
     * @return \Searches
     */
    static function populate(\BookingSearchForm $param, $force = false, array $airSourceIds = []) {
        $oldModel = self::findSame($param);
        if ($oldModel && !$force) {   // Return existing search if it is created soon enough
            $oldModel->hits++;
            $oldModel->update(['hits']);
            return $oldModel;
        }
        $originId = \Airport::getAirportCodeFromId($param->source);
        $destinationId = \Airport::getAirportCodeFromId($param->destination);
        if ($originId === null || $destinationId === null) {
            return null;
        }
        $model = new \Searches;
        $model->user_id = \Yii::app()->hasComponent('user') && Yii::app()->user->id ? Yii::app()->user->id : null;
        $model->type_id = $param->return ? 2 : 1;
        $model->origin = $originId;
        $model->destination = $destinationId;
        $model->date_depart = $param->depart;
        $model->date_return = $param->return ? : null;
        $model->is_domestic = \Airport::isDomesticPair($param->source, $param->destination);
        $model->adults = $param->adults;
        $model->children = $param->children;
        $model->infants = $param->infants;
        $model->category = $param->category;
        $model->created = date(DATETIME_FORMAT);
        $model->insert();
        $model->queueSearchProcesses($airSourceIds);
        $model->deleteOld();
        return $model;
    }

    /**
     * Create new Search and assign the BookingSearchForm parameters
     * @param \BookingSearchForm $param
     * @return \Searches or null
     */
    static function assignParams(\BookingSearchForm $param) {
        $originId = \Airport::getAirportCodeFromId($param->source);
        $destinationId = \Airport::getAirportCodeFromId($param->destination);
        if ($originId === null || $destinationId === null) {
            return null;
        }
        $model = new \Searches;
        $model->user_id = \Yii::app()->hasComponent('user') && Yii::app()->user->id ? Yii::app()->user->id : null;
        $model->type_id = $param->return ? 2 : 1;
        $model->origin = $originId;
        $model->destination = $destinationId;
        $model->date_depart = $param->depart;
        $model->date_return = $param->return ? : null;
        $model->is_domestic = \Airport::isDomesticPair($param->source, $param->destination);
        $model->adults = $param->adults;
        $model->children = $param->children;
        $model->infants = $param->infants;
        $model->category = $param->category;
        $model->created = date(DATETIME_FORMAT);
        return $model;
    }

    /**
     * Look for same search if it is created soon enough
     * @param \BookingSearchForm $param
     * @return Searches|null
     */
    static function findSame(\BookingSearchForm $param) {
        // Dynamic time frame for validation
        $minutes = self::notOlderThan(strtotime($param->depart));
//        $minutes = 60;
        return \Searches::model()->findByAttributes([
                    'origin' => \Airport::getAirportCodeFromId($param->source),
                    'destination' => \Airport::getAirportCodeFromId($param->destination),
                    'date_depart' => $param->depart,
                    'date_return' => $param->return ? : null,
                    'adults' => $param->adults,
                    'children' => $param->children,
                    'infants' => $param->infants,
                    'category' => $param->category,
                        ], [
//                    'condition' => "created > (now() - interval '$minutes minutes')",
                    'condition' => "created > '" . date(DATETIME_FORMAT, time() - $minutes * 60) . "'",
                    'order' => "id DESC"
        ]);
    }

    /**
     * Delete old searches that has same parameters.<br>
     * Moving the searches to search_arch table first
     * @return int The number of the deleted records
     */
    function deleteOld() {
        // Move to arch
//        \Yii::app()->db
//                ->createCommand("INSERT INTO searches_arch (SELECT * FROM searches WHERE "
//                . "origin='$this->origin' AND "
//                . "destination='$this->destination' AND "
//                . "date_depart='$this->date_depart' AND "
//                . ( $this->date_return ? "date_return='$this->date_return' AND " : "date_return IS NULL AND ")
//                . "adults=$this->adults AND "
//                . "children=$this->children AND "
//                . "infants=$this->infants AND "
//                . "category=$this->category AND "
//                . "id<>$this->id )")
//                ->execute();
        // Delete
        return $this->deleteAllByAttributes([
                    'origin' => $this->origin,
                    'destination' => $this->destination,
                    'date_depart' => $this->date_depart,
                    'date_return' => $this->date_return ? : null,
                    'adults' => $this->adults,
                    'children' => $this->children,
                    'infants' => $this->infants,
                    'category' => $this->category,
                        ], "created + interval '10 minute' < 'now'");
    }

    /**
     * When the RC object is considered invalid.
     * @param int $timestampDeparture The Unix timestamp of the flight departure
     * @return int The number of the max minutes after which the cache should be refreshed.
     */
    static function notOlderThan($timestampDeparture) {
        foreach (self::$cachingTimes as $value) {
            $low = time() + $value['low'] * 24 * 3600;
            $high = time() + $value['high'] * 24 * 3600;
            if ($low <= $timestampDeparture && $timestampDeparture < $high) {
                return $value['old'];
            }
        }
        return self::$cachingTimes[0]['old'];   // Return the minimum in case the flight is for the same day
    }

    
    /**
     * Air sources that should be used for the search
     * @return \AirSource[] array of air sources
     */
    function getMatchingAirSources() {
        $rule = $this->findMatchingAirSourceRule();
        if ($rule) {
            $airSources = $rule->getActiveAirSources();
            if (!empty($airSources)) {
                return $airSources;
            }
        }
        
        // Use the default ASes
        return $this->getDefaultAirSources();
    }
    
    /**
     * Air sources that are active and marked with display in search
     * @return \AirSource[] array of default air sources
     */
    function getDefaultAirSources() {
        return \AirSource::model()->cache(600)->with('backend')->findAll('is_active=1 AND type_id IN (:typeBoth , :type) AND '
                . 'display_in_search=1 AND "backend".search is not null AND "backend".search<>\'\'', [
            ':type' => $this->is_domestic ? \AirSource::TYPE_DOMESTIC : \AirSource::TYPE_INTERNATIONAL,
            ':typeBoth' => \AirSource::TYPE_BOTH,
        ]);
    }

    /**
     * Queue the search processes for this search
     * @param array $airSourceIds if not empty the selection of the AirSources is used.
     * @return boolean
     */
    function queueSearchProcesses(array $airSourceIds = []) {
        if ($this->id === null) {
            return false;
        }
        if (empty($airSourceIds)) {
            $airSources = $this->getMatchingAirSources();
        } else {
            $criteria = new CDbCriteria;
            $criteria->addInCondition('t.id', $airSourceIds);
            $criteria->addCondition('is_active = 1');
            $criteria->addCondition('"backend".search IS NOT NULL');
            $criteria->addCondition('"backend".search <> \'\' ');
            $airSources = \AirSource::model()->cache(300)->with('backend')->findAll($criteria);
        }
        /* @var $airSources \AirSource[] */
        $queuedProcesses = [];
        $serverId = \application\components\Cluster::getServerId();
        foreach ($airSources as $airSource) {
            if (!$airSource->cache(3600)->backend->isSectorServicable($this->origin, $this->destination)) {
                continue;   // Skip the airsources that can not service the sector
            }

            if (!$airSource->cache(3600)->backend->isCategoryServicable($this->category)) {
                continue;   // Skip the airsources that can not service the cabin class
            }

            if ($airSource->cache(3600)->checkAPIforFlyDubai($this->origin)) {
                continue;
            }

            $process = new \Process;
            $process->search_id = $this->id;
            $process->air_source_id = $airSource->id;
            $process->server_id = $serverId;
            $process->command = $airSource->cache(3600)->backend->search;
            $process->parameters = json_encode([
                "type_id" => $this->type_id, //         1 => 'One way', 2 => 'Round trip', 3 => 'Multicity'
                "source" => $this->origin,
                "destination" => $this->destination,
                "depart" => $this->date_depart,
                "return" => $this->date_return,
                "adults" => $this->adults,
                "children" => $this->children,
                "infants" => $this->infants,
                "category" => $this->category,
                    ], JSON_NUMERIC_CHECK);
            $process->insert();
            $queuedProcesses[] = $process->id;
        }
        \Yii::app()->cache->set(self::QUEUED_PROCESSES_LIST . $this->id, $queuedProcesses, self::MAX_WAITING_TIME_API3D);
        
        \Yii::import('application.commands.QueueCommand');
        if ( YII_DEBUG && count($queuedProcesses) > 0 && !file_exists(\QueueCommand::queueBrokerLockFile()) ) { // Start the queue broker if not on live server
            $cmd = 'php "' . Yii::app()->getBasePath() . DIRECTORY_SEPARATOR . 'yiic.php" queue broker';
            \Process::backgroundRun($cmd);
        }
    }

    function addResults($res, $airSourceId) {
        $airSource = \AirSource::model()->cache(60)->findByPk($airSourceId);
        if ($airSource->cache(3600)->backend->isScrapper) {  // Extra formatting step for the scrappers
            $rows = $this->scrapperFormatRows($res, $airSourceId);
        } else {
            $rows = $res;
        }
        // Delete old RCs for the same search and same AirSource
        \Yii::app()->db->createCommand()
                ->delete('routes_cache', 'air_source_id=:air_source_id AND search_id=:search_id', [
                    ':air_source_id' => (int) $airSourceId,
                    ':search_id' => $this->id
                        ]
        );

//        \Utils::dbgYiiLog($res);

        $searchDone = \Yii::app()->cache->get(self::SEARCH_DONE . $this->id);
        $leadingPaxType = $this->adults != 0 ? \TravelerType::TRAVELER_ADULT : \TravelerType::TRAVELER_CHILD;
        $skiped = [];   // skipped recommendations
        $relinked = []; // relinked recommendations

        foreach ($rows as $row) {
            if (empty($row['carrier_id'])) {
                continue;
            }
            $rc = new \RoutesCache;
            $rc->attributes = $row;
            $rc->search_id = $this->id;
            $rc->hash_id = new CDbExpression($row['hash_id']);

            // Calculate the total fare minus the commission
            $effectiveTotal = $rc->total_fare - $rc->calcCommission();

            $hashWithoutPaxAndFareBasis = strstr($rc->getAppCacheKey(), \RoutesCache::HASH_SEPARATOR);

            $saved = $rc->getFromAppCache();
            if ($leadingPaxType == $rc->traveler_type_id) {
                // Check for already saved
                if ($saved) {
                    // Do not save the RC if same with better price is already saved
                    if ($saved['total'] < $effectiveTotal) {
                        $skiped[] = $hashWithoutPaxAndFareBasis;
                        continue;
                    }

                    // Do not save the RC if same with same price and higher AS priority is already saved
                    if ($saved['total'] === $effectiveTotal && $airSource->priority > $saved['asp']) {
                        $skiped[] = $hashWithoutPaxAndFareBasis;
                        continue;
                    }

                    // Delete or relink the saved RC since the new one is better recommendation
                    if ($searchDone) {
                        // Create link from the old RC to the new one
                        $link = new \RcLink;
                        $link->from = $saved['id'];
                        $relinked[] = $hashWithoutPaxAndFareBasis;
                    } else {
                        // Delete the duplicate RCs that are not the best option
                        \RoutesCache::model()->deleteAllByAttributes([
                            'search_id' => $this->id,
                                ], "air_source_id <> :asId AND hash_str like :hashWithoutPaxAndFareBasis", [
                            ':asId' => $airSourceId,
                            ':hashWithoutPaxAndFareBasis' => "%{$hashWithoutPaxAndFareBasis}%"
                        ]);
                    }
                }
            } else {    // Secondary pax case
                // Skip the secondary paxes if the leading pax is skipped
                if (in_array($hashWithoutPaxAndFareBasis, $skiped)) {
                    continue;
                }

                // Relink the secondary paxes if the leading pax is relinked
                if (in_array($hashWithoutPaxAndFareBasis, $relinked)) {
                    // Create link from the old RC to the new one
                    $from = \RoutesCache::model()->findByAttributes([
                        'search_id' => $this->id,
                        'traveler_type_id' => $rc->traveler_type_id,
                            ], "air_source_id <> :asId AND hash_str like :hashWithoutPaxAndFareBasis", [
                        ':asId' => $airSourceId,
                        ':hashWithoutPaxAndFareBasis' => "%{$hashWithoutPaxAndFareBasis}%"
                    ]);
                    if ($from !== null) {
                        $link = new \RcLink;
                        $link->from = $from->id;
                    }
                }
            }

            $rc->insert();

            // Register the result in the app cache
            if ($leadingPaxType == $rc->traveler_type_id) {
                $rc->registerInAppCache($effectiveTotal, $airSource->priority);
            }

            // Finish the link
            if (isset($link)) {
                $link->to = $rc->id;
                $link->insert();
                unset($link);
            }
        }
    }

    
    function scrapperFormatRows($res, $scrapperId) {
        if (isset($res['onward']) && isset($res['return'])) {
            $res = array_merge($res['onward'], $res['return']);
        }
        if (count($res) < 1) {
            return []; // No Flights met the search criteria
        } else {    // We are good to go
//            print_r($res);  // debug print
            $i = 0;
            $grouping = \RoutesCache::getNextGroupId();
            $rows = [];
            foreach ($res as $jorney) {
                if (empty($jorney['legs'])) {
                    continue;   // Some wired errors are observed with the scrappers
                }
                $firstLeg = reset($jorney['legs']);
                $lastLeg = end($jorney['legs']);
                if (!self::scrappersInputCheck($firstLeg) || !self::scrappersInputCheck($lastLeg)) {
                    continue;   // Stupid scrappers output data format bugs
                }
                if (empty($this->date_return)) {
                    $order = \RoutesCache::ORDER_SINGLE_JOURNEY;    // Single journey
                } elseif ($this->origin == $firstLeg['source']) {
                    $order = \RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO;    // First journey from 2
                } else {
                    $order = \RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO;    // Second journey from 2
                }
                $passengers = [];
                if (!empty($jorney['fares']['adult'])) {
                    $passengers[] = array_merge($jorney['fares']['adult'], ['Type' => \TravelerType::TRAVELER_ADULT]);
                }
                if (!empty($jorney['fares']['child'])) {
                    $passengers[] = array_merge($jorney['fares']['child'], ['Type' => \TravelerType::TRAVELER_CHILD]);
                }
                if (!empty($jorney['fares']['infant'])) {
                    $passengers[] = array_merge($jorney['fares']['infant'], ['Type' => \TravelerType::TRAVELER_INFANT]);
                }
                $tmpRow = new \stdClass;
                $tmpRow->legs_json = json_encode(self::prepareScrapperLegsJson($jorney['legs']));
                $tmpRow->hash_str = self::prepareScrapperHashStr($scrapperId, $jorney['legs']);
                $tmpRow->service_type_id = $this->is_domestic === 1 ? \ServiceType::DOMESTIC_AIR : \ServiceType::INTERNATIONAL_AIR;
                list ($tmpRow->departure_date, $tmpRow->departure_time) = explode(' ', $firstLeg['depart']);
                list($tmpRow->arrival_date, $tmpRow->arrival_time) = explode(' ', $lastLeg['arrive']);
                $tmpRow->origin_id = \Airport::getIdFromCode($firstLeg['source']);
                $tmpRow->destination_id = \Airport::getIdFromCode($firstLeg['destination']);
                list ($tmpRow->carrier_id, $tmpRow->flight_number) = explode('-', $firstLeg['flightNumber']);
                $tmpRow->carrier_id = \Carrier::getIdFromCode($tmpRow->carrier_id);
                $tmpRow->stops = count($jorney['legs']) - 1;
                foreach ($passengers as $passenger) {
                    $passenger['amount'] = str_replace(",", '', $passenger['amount']);
                    if ($passenger['baseFare'] == 0) {
                        $passenger['baseFare'] = $passenger['amount'];
                    }
                    $row = new \RoutesCache;
                    list ($row->departure_date, $row->departure_time) = [$tmpRow->departure_date, $tmpRow->departure_time];
                    list($row->arrival_date, $row->arrival_time) = [$tmpRow->arrival_date, $tmpRow->arrival_time];
                    $row->origin_id = $tmpRow->origin_id;
                    $row->destination_id = $tmpRow->destination_id;
                    list ($row->carrier_id, $row->flight_number) = [$tmpRow->carrier_id, $tmpRow->flight_number];
                    $row->carrier_id = $tmpRow->carrier_id;
                    $row->stops = $tmpRow->stops;
                    if (isset($passenger['taxesDetails'])) {
                        $taxes = \Taxes::reformatScrapperTaxes($passenger['taxesDetails']);
                    } else {
                        $tax = new \Taxes;
                        $taxes = $tax->arrTaxes;
                    }
                    $row->fare_basis = \Taxes::SCRAPPER_FARE_BASE . $scrapperId;
                    $row->base_fare = (float) $passenger['baseFare'];
                    $row->total_fare = (float) $passenger['amount'];
                    $row->tax_jn = $taxes[\Taxes::TAX_JN];
                    $row->tax_other = $taxes[\Taxes::TAX_OTHER];
                    $row->tax_psf = $taxes[\Taxes::TAX_PSF];
                    $row->tax_udf = $taxes[\Taxes::TAX_UDF];
                    $row->tax_yq = $taxes[\Taxes::TAX_YQ];
//                    $row->total_taxes = (float)($passenger['taxesTotal'] - $taxes[\Taxes::TAX_TOTAL_CORRECTION]);
                    $row->total_taxes = (float) $passenger['taxesTotal'];
//                    $row->booking_class = \RoutesCache::SCRAPPER_BOOKING_CLASS;
                    $row->last_check = date(DATETIME_FORMAT);
                    $row->updated = date(DATETIME_FORMAT);
                    $row->air_source_id = $scrapperId;
                    $row->traveler_type_id = $passenger['Type'];
                    $row->hash_str = $tmpRow->hash_str . $row->traveler_type_id;
                    $row->hash_id = "x'" . str_pad(hash('fnv164', $row->hash_str), 16, '0', STR_PAD_LEFT) . "'::int8";
                    $row->service_type_id = $tmpRow->service_type_id;
                    $row->order_ = $order;
                    $row->grouping = $grouping;     // Assign same group to all search results, since scrappers can do full
                    $row->legs_json = $tmpRow->legs_json;
                    if (empty($this->date_return)) {
                        $row->round_trip = 0;
                    } else {
                        $row->round_trip = 1;
                        if ($row->departure_date == $this->date_return) {
                            $row->return_date = $row->departure_date;
                            $row->return_time = $row->departure_time;
                        }
                    }


                    $rows[$i] = $row->attributes;
                    unset($rows[$i]['id']);
                    $i++;
                }
            }
            return $rows;
        }
    }

    /**
     * Check if all the needed segment elements are present in the scrapper output
     * @param array $leg The collection to be checked
     * @return boolean True if all the needed elements are present
     */
    static function scrappersInputCheck(array $leg) {
        // Stupid scrappers return data validation
        foreach (self::$scrappingMandatoryKeys as $needle) {
            if (!array_key_exists($needle, $leg)) {
                if (empty(self::$loggedErrors[$needle])) {  // Log the errors but once per missing index
                    \Utils::dbgYiiLog(['Missing index' => $needle, 'leg' => $leg]);
                    self::$loggedErrors[$needle] = true;
                }
                return false;
            }
        }
        return true;
    }

    static function prepareScrapperLegsJson($legs) {
        $out = [];
        foreach ($legs as $leg) {
            if (!self::scrappersInputCheck($leg)) {
                continue;
            }
            $legsJson = new \LegsJson;
            $legsJson->arrive = $leg['arrive'];
            $legsJson->depart = $leg['depart'];
            $legsJson->destination = \Airport::getAirportCodeAndCityNameFromCode($leg['destination']);
            $legsJson->destinationTerminal = empty($leg['destination_terminal']) ? null : $leg['destination_terminal'];
            $legsJson->flighNumber = $leg['flightNumber'];
            $legsJson->origin = \Airport::getAirportCodeAndCityNameFromCode($leg['source']);
            $legsJson->originTerminal = empty($leg['origin_terminal']) ? null : $leg['origin_terminal'];
            $legsJson->time = \Utils::convertSecToHoursMins(strtotime($leg['arrive']) - strtotime($leg['depart']));
            $legsJson->bookingClass = \RoutesCache::SCRAPPER_BOOKING_CLASS;
            $out[] = $legsJson;
        }
        return $out;
    }

    static function prepareScrapperHashStr($airSourceId, $legs) {
        $out = $airSourceId . \RoutesCache::HASH_SEPARATOR;
        foreach ($legs as $leg) {
            if (!self::scrappersInputCheck($leg)) {
                continue;
            }
            $out .= $leg['source'] . \RoutesCache::HASH_SEPARATOR;
            $out .= $leg['depart'] . \RoutesCache::HASH_SEPARATOR;
            $out .= $leg['flightNumber'] . \RoutesCache::HASH_SEPARATOR;
            $out .= $leg['destination'] . \RoutesCache::HASH_SEPARATOR;
        }
        return $out;
    }

    /**
     * Delte the old cache results
     */
    function deleteOldCacheResults(array $cacheResults) {
//        sort($cacheResults, SORT_NUMERIC);
        if (empty($cacheResults)) {
            $resultsStr = '';
        } else {
            $resultsStr = ' AND id NOT IN (' . implode(',', $cacheResults) . ')';
        }
//        \Yii::log("All: $resultsStr");
        $travelerStr = $this->buildTravelersInString();
        $oldResults = \RoutesCache::model()->findAllBySql("SELECT id FROM routes_cache"
                . " WHERE origin_id= :origin_id AND"
                . " destination_id = :destination_id AND"
                . " departure_date = :departure_date AND"
                . ($this->date_return ? " return_date = '$this->date_return' AND" : " return_date is NULL AND")
                . " cabin_type_id = :category AND"
                . " traveler_type_id IN $travelerStr"
                . $resultsStr, [
            ':origin_id' => \Airport::getIdFromCode($this->origin),
            ':destination_id' => \Airport::getIdFromCode($this->destination),
            ':departure_date' => $this->date_depart,
            ':category' => $this->category,
        ]);
        $obsolete = [];
        foreach ($oldResults as $row) {
            $obsolete[] = $row['id'];
        }
        // Delete the obsolete cache results
        if (!empty($obsolete)) {
            \RoutesCache::model()->deleteAll("id IN (" . implode(',', $obsolete) . ")");
        }
//        sort($out, SORT_NUMERIC);
//        \Yii::log("Obsolete: " . implode(',', $obsolete));
    }

    function buildTravelersInString() {
        $travelerStr = '(';
        $travelerStr .= $this->adults ? \TravelerType::TRAVELER_ADULT . ',' : '';
        $travelerStr .= $this->children ? \TravelerType::TRAVELER_CHILD . ',' : '';
        $travelerStr .= $this->infants ? \TravelerType::TRAVELER_INFANT . ',' : '';
        return rtrim($travelerStr, ',') . ')';
    }

    /**
     * Wait until the visible air sources spawned by the search process are done or until the $maxWaitTime is reached.
     * @param int $maxWaitTime The maximum time to wait in seconds
     */
    function waitVisibleAirSourcesToDeliver($maxWaitTime) {
        // Do not wait for searches in the past
        if (time() - strtotime($this->created) > $maxWaitTime) {
            return;
        }
        
        // Do not wait if there are no processes queued
        $queuedProcesses = \Yii::app()->cache->get(self::QUEUED_PROCESSES_LIST . $this->id);
        if ($queuedProcesses === false) {
            return;
        }

        $startTime = microtime(true);
        $execTime = ini_get('max_execution_time');
        if ($execTime <= $maxWaitTime) {    // Increase the execution time limit to cover the wait time.
            set_time_limit($maxWaitTime + 5);
        }
        $finishedPocesses = $this->getFinishedProcesses($maxWaitTime);
        $visibleAirSources = array_diff($queuedProcesses, $finishedPocesses);
        while (!empty($visibleAirSources) && (microtime(true) - $startTime < $maxWaitTime)) {
            sleep(1);
            $finishedPocesses = $this->getFinishedProcesses($maxWaitTime);
            $visibleAirSources = array_diff($visibleAirSources, $finishedPocesses);
        }
        
        // Delete duplicate RCs
        $this->removeDuplicates();

        // Mark the waiting for the AS to deliver as done in the App cache
        \Yii::app()->cache->set(self::SEARCH_DONE . $this->id, true, 120);
    }

    /**
     * Return array of AirSource IDs of the finished proceses for the search
     * @param int $maxWaitTime Time in seconds after wich we should consider the process as non responsive and return as finished
     * @return array Air sources IDs
     */
    function getFinishedProcesses($maxWaitTime = self::MAX_WAITING_TIME_B2BAPI) {
        $out = [];
        $ended = \Process::model()->findAll("search_id = :search_id AND (ended IS NOT NULL OR started + interval '$maxWaitTime second' < CURRENT_TIMESTAMP)", [
            ':search_id' => $this->id,
        ]);
        if (!empty($ended)) {
            foreach ($ended as $process) {
                $out[] = $process->id;
            }
        }

        return $out;
    }

    /**
     * Find the best priced RouteCache elements. OneWay for all airSources or twoWay for GDSes only
     * @param int $maxCount How many elements to return
     * @return \RoutesCache[] Array of arrays of RouteCache objects. This is array of<br>
     * journeys and in each journey we have specific RC elements for each pax type.<br>
     * Example of journey with 2 PAXes and 2 logical flights(destinations): [[paxTypeARc, paxTypeBRc],[paxTypeARc, paxTypeBRc]]
     */
    function getBestPricedMatchesOneWay($maxCount = 25) {
        if ($this->adults == 0 && ($this->children == 0 || $this->infants > 0)) {
            return [[]];  // Return empty set if the paxes are not correct
        }
        $out = [[]];
        if ($this->adults > 0) {
            $travellerTypeId = \TravelerType::TRAVELER_ADULT;
        } else {
            $travellerTypeId = \TravelerType::TRAVELER_CHILD;
        }
        $mainResults = \RoutesCache::model()->findAllBySql(
                'SELECT routes_cache.* from routes_cache ' .
                'JOIN air_source ON (air_source.id = routes_cache.air_source_id) ' .
                'WHERE routes_cache.search_id = :search_id AND routes_cache.traveler_type_id=:travellerTypeId ' .
                'AND routes_cache.order_ IN (:oneWay, :gds) ' .
                "ORDER BY total_fare LIMIT $maxCount;"
                , [
            ':search_id' => $this->id,
            ':travellerTypeId' => $travellerTypeId,
            ':oneWay' => \RoutesCache::ORDER_SINGLE_JOURNEY,
            ':gds' => \RoutesCache::ORDER_ALL_JOURNEYS,
        ]);
        /* @var $mainResults \RoutesCache[] */
        // Assign the main results to the output array
        foreach ($mainResults as $key => $rc) {
            $out[$key][0][] = $rc;
        }
        if ($this->adults > 0) {
            if ($this->children > 0) {
                foreach ($mainResults as $key => $rc) {
                    $tmp = $rc->findSame(\TravelerType::TRAVELER_CHILD, $this->id);
                    if ($tmp === null) {  // No matching RC for the kid is found
                        unset($out[$key]);
                        unset($mainResults[$key]);
                    } else {
                        $out[$key][0][] = $tmp;
                    }
                }
            }
            if ($this->infants > 0) {
                foreach ($mainResults as $key => $rc) {
                    $tmp = $rc->findSame(\TravelerType::TRAVELER_INFANT, $this->id);
                    if ($tmp === null) {  // No matching RC for the infant is found
                        unset($out[$key]);
                        unset($mainResults[$key]);
                    } else {
                        $out[$key][0][] = $tmp;
                    }
                }
            }
        }

        return $out;
    }

    /**
     * Find the best priced RouteCache elements. OneWay for all airSources or twoWay for GDSes only
     * @param int $maxCount How many elements to return
     * @return \RoutesCache[] Array of arrays of RouteCache objects. This is array of<br>
     * journeys and in each journey we have specific RC elements for each pax type.<br>
     * Example of journey with 2 PAXes and 2 logical flights(destinations): [[paxTypeARc, paxTypeBRc],[paxTypeARc, paxTypeBRc]]
     */
    function getBestPricedMatchesOneWayV2($maxCount = 25) {
        if ($this->adults == 0 && ($this->children == 0 || $this->infants > 0)) {
            return [[]];  // Return empty set if the paxes are not correct
        }
        $out = null;
        if ($this->adults > 0) {
            $travellerTypeId = \TravelerType::TRAVELER_ADULT;
        } else {
            $travellerTypeId = \TravelerType::TRAVELER_CHILD;
        }
        $allResults = \RoutesCache::model()->findAllBySql(
                'SELECT routes_cache.* from routes_cache ' .
//                'JOIN air_source ON (air_source.id = routes_cache.air_source_id) ' .
                'WHERE routes_cache.search_id = :search_id ' .
                'AND routes_cache.order_ IN (:oneWay, :gds) ' .
                "ORDER BY routes_cache.traveler_type_id, total_fare;"
                , [
            ':search_id' => $this->id,
            ':oneWay' => \RoutesCache::ORDER_SINGLE_JOURNEY,
            ':gds' => \RoutesCache::ORDER_ALL_JOURNEYS,
        ]);
        /* @var $allResults \RoutesCache[] */
        // Assign the main results to the output array
        foreach ($allResults as $rc) {
            if ($rc->traveler_type_id === $travellerTypeId) {   // Primary pax type - ADT or CHD
                // There are ADT
                if ($this->adults > 0) {
                    // There are CHD
                    $chd = null;
                    if ($this->children > 0) {
                        $chd = $rc->findSameV2(\TravelerType::TRAVELER_CHILD, $allResults);
                        if ($chd === null) {
                            // No matching RC for the kid is found
                            continue;
                        }
                    }

                    $inf = null;
                    // There are INF
                    if ($this->infants > 0) {
                        $inf = $rc->findSameV2(\TravelerType::TRAVELER_INFANT, $allResults);
                        if ($inf === null) {
                            // No matching RC for the infant is found
                            continue;
                        }
                    }
                    $journey = array_filter([$rc, $chd, $inf]);
                    $out[] = [$journey];
                } else {    // Kid without adult - very rare combo, but still possible
                    $out[] = [[$rc]];
                }
            }
        }

        return $out === null ? [[]] : $out;
    }

    /**
     * Find all RouteCache elements crated by LLCs and having onward and backward flights.
     * @param int $direction The direction of the flights
     * @return \RoutesCache[] Array of arrays of RouteCache objects. This is array of<br>
     * journeys and in each journey we have specific RC elements for each pax type.<br>
     * Example of journey with 2 PAXes and 2 logical flights(destinations): [[paxTypeARc, paxTypeBRc],[paxTypeARc, paxTypeBRc]]
     */
    function getMatchesByDirection($direction) {
        if ($this->adults == 0 && ($this->children == 0 || $this->infants > 0)) {
            return [[]];  // Return empty set if the paxes are not correct
        }
        $out = [[]];
        if ($this->adults > 0) {
            $travellerTypeId = \TravelerType::TRAVELER_ADULT;
        } else {
            $travellerTypeId = \TravelerType::TRAVELER_CHILD;
        }
        $mainResults = \RoutesCache::model()->findAllBySql(
                'SELECT routes_cache.* from routes_cache ' .
                'JOIN air_source ON (air_source.id = routes_cache.air_source_id) ' .
                'WHERE routes_cache.search_id = :search_id AND routes_cache.traveler_type_id = :travellerTypeId ' .
                'AND routes_cache.order_ = :direction ' .
                "ORDER BY total_fare;"
                , [
            ':search_id' => $this->id,
            ':travellerTypeId' => $travellerTypeId,
            ':direction' => $direction,
        ]);
        // Assign the main results to the output array
        foreach ($mainResults as $key => $rc) {
            $out[$key][0][] = $rc;
        }
        /* @var $mainResults \RoutesCache[] */
        if ($this->adults > 0) {
            if ($this->children > 0) {
                foreach ($mainResults as $key => $rc) {
                    $tmp = $rc->findSame(\TravelerType::TRAVELER_CHILD, $this->id);
                    if ($tmp === null) {  // No matching RC for the kid is found
                        unset($out[$key]);
                        unset($mainResults[$key]);
                    } else {
                        $out[$key][0][] = $tmp;
                    }
                }
            }
            if ($this->infants > 0) {
                foreach ($mainResults as $key => $rc) {
                    $tmp = $rc->findSame(\TravelerType::TRAVELER_INFANT, $this->id);
                    if ($tmp === null) {  // No matching RC for the infant is found
                        unset($out[$key]);
                        unset($mainResults[$key]);
                    } else {
                        $out[$key][0][] = $tmp;
                    }
                }
            }
        }

        return $out;
    }

    /**
     * Reconstruct TwoWay journey from 2 x OneWay RC elements
     * @param int $maxCount How many elements to return
     * @return \RoutesCache[] Array of arrays of RouteCache objects. This is array of<br>
     * journeys and in each journey we have specific RC elements for each pax type.<br>
     * Example of journey with 2 PAXes and 2 logical flights(destinations): [[paxTypeARc, paxTypeBRc],[paxTypeARc, paxTypeBRc]]
     */
    function getBestPricedMatchesTwoWays($maxCount = 25) {
        if ($this->adults == 0 && ($this->children == 0 || $this->infants > 0)) {
            return [[]];  // Return empty set if the paxes are not correct
        }
        $forward = [];
        $backward = [];
        $fare1 = [];
        $fare2 = [];
        if ($this->adults > 0) {
            $travellerTypeId = \TravelerType::TRAVELER_ADULT;
        } else {
            $travellerTypeId = \TravelerType::TRAVELER_CHILD;
        }
        $firstJourneyResults = \RoutesCache::model()->findAllBySql(
                'SELECT routes_cache.* from routes_cache ' .
                'JOIN air_source ON (air_source.id = routes_cache.air_source_id) ' .
                'WHERE routes_cache.search_id = :search_id AND routes_cache.traveler_type_id=:travellerTypeId ' .
                'AND routes_cache.order_=:firstJourney;'
                , [
            ':search_id' => $this->id,
            ':travellerTypeId' => $travellerTypeId,
            ':firstJourney' => \RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO,
//            ':secondJourney' => \RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO,
        ]);
        // Exit if no results
        if (empty($firstJourneyResults)) {
            return [];
        }
//        \Utils::dbgYiiLog($firstJourneyResults);
        // Assign the main results to the output array
        foreach ($firstJourneyResults as $key => $rc) {
            $forward[$key][] = $rc;
            $fare1[$key] = $rc->total_fare;     // Init the fares calculation
            $forwardToGrouping[$key] = $rc->grouping;   // Map the key from first journey RC to his grouping
            if (!isset($firstBackwardResults[$rc->grouping])) {
                // Get the return group
                $firstBackwardResults[$rc->grouping] = $rc->findReturnTripSet($this->id);
                // Assign the return group to backward structure
                foreach ($firstBackwardResults[$rc->grouping] as $keyBack => $backRc) {
                    $backward[$rc->grouping][$keyBack][] = $backRc;
                    $fare2[$rc->grouping][$keyBack] = $backRc->total_fare;  // Init back fare calculation
                }
            }
        }
        /* @var $firstJourneyResults \RoutesCache[] */
        if ($this->adults > 0) {
            if ($this->children > 0) {
                foreach ($firstJourneyResults as $key => $rc) {
                    $child = $rc->findSame(\TravelerType::TRAVELER_CHILD, $this->id);
                    if ($child === null) {  // No matching RC for the kid is found
                        unset($forward[$key]);
                        unset($firstJourneyResults[$key]);
                        unset($fare1[$key]);
                    } else {
                        $forward[$key][] = $child;
                        $fare1[$key] += $child->total_fare;    // Add the child fare
                    }
                }
                foreach ($backward as $grouping => &$backGroup) {
                    foreach ($backGroup as $key => &$value) {
                        $child = $value[0]->findSame(\TravelerType::TRAVELER_CHILD, $this->id);
                        if ($child === null) {  // No matching RC for the kid is found
                            unset($backward[$grouping][$key]);
                            unset($fare2[$grouping][$key]);
                        } else {
                            $value[] = $child;
                            $fare2[$grouping][$key] += $child->total_fare;    // Add the child fare
                        }
                    }
                }
            }
            if ($this->infants > 0) {
                foreach ($firstJourneyResults as $key => $rc) {
                    $infant = $rc->findSame(\TravelerType::TRAVELER_INFANT, $this->id);
                    if ($infant === null) {  // No matching RC for the infant is found
                        unset($forward[$key]);
                        unset($firstJourneyResults[$key]);
                        unset($fare1[$key]);
                    } else {
                        $forward[$key][] = $infant;
                        $fare1[$key] += $infant->total_fare;    // Add the infant fare
                    }
                }
                foreach ($backward as $grouping => &$backGroup) {
                    foreach ($backGroup as $key => &$value) {
                        $infant = $value[0]->findSame(\TravelerType::TRAVELER_INFANT, $this->id);
                        if ($infant === null) {  // No matching RC for the infant is found
                            unset($backward[$grouping][$key]);
                            unset($fare2[$grouping][$key]);
                        } else {
                            $value[] = $infant;
                            $fare2[$grouping][$key] += $infant->total_fare;    // Add the child fare
                        }
                    }
                }
            }
        }
//        echo \Utils::dbgYiiLog($fare1);
//        echo \Utils::dbgYiiLog($fare2);
//        exit;
        $fares = [];
        // Fare Permutations
        foreach ($fare1 as $key1 => $value1) {
            if (isset($fare2[$forwardToGrouping[$key1]])) {
                foreach ($fare2[$forwardToGrouping[$key1]] as $key2 => $value2) {
                    $fares[] = [
                        'amount' => $value1 + $value2,
                        'key1' => $key1,
                        'grouping' => $forwardToGrouping[$key1],
                        'key2' => $key2,
                    ];
                }
            }
        }

        // Fares sorting
        $cmp = function($a, $b) {
            return $a['amount'] > $b['amount'];
        };
        usort($fares, $cmp);

        // Output structure preparation
        foreach ($fares as $fare) {
            $out[] = [
                $forward[$fare['key1']],
                $backward[$fare['grouping']][$fare['key2']],
            ];
            if (count($out) >= $maxCount) {
                break;  // Don't return more than maxCount results
            }
        }

//        echo \Utils::dbg($backward);
//        echo \Utils::dbg($out);
//        echo \Utils::dbg(array_slice($fares, 0, $maxCount));
//        exit;
        return isset($out) ? $out : [[]];
    }

    /**
     * Reconstruct TwoWay journey from 2 x OneWay RC elements
     * @param int $maxCount How many elements to return
     * @return \RoutesCache[] Array of arrays of RouteCache objects. This is array of<br>
     * journeys and in each journey we have specific RC elements for each pax type.<br>
     * Example of journey with 2 PAXes and 2 logical flights(destinations): [[paxTypeARc, paxTypeBRc],[paxTypeARc, paxTypeBRc]]
     */
    function getBestPricedMatchesTwoWaysV2($maxCount = 25) {
        if ($this->adults == 0 && ($this->children == 0 || $this->infants > 0)) {
            return [[]];  // Return empty set if the paxes are not correct
        }
        if ($this->adults > 0) {
            $travellerTypeId = \TravelerType::TRAVELER_ADULT;
        } else {
            $travellerTypeId = \TravelerType::TRAVELER_CHILD;
        }
        $firstJourneyResults = \RoutesCache::model()->findAllBySql(
                'SELECT routes_cache.* from routes_cache ' .
//                'JOIN air_source ON (air_source.id = routes_cache.air_source_id) ' .
                'WHERE routes_cache.search_id = :search_id ' .
                'AND routes_cache.order_=:firstJourney ' .
                'ORDER BY routes_cache.traveler_type_id, routes_cache.total_fare;'
                , [
            ':search_id' => $this->id,
            ':firstJourney' => \RoutesCache::ORDER_FIRST_JOURNEY_FROM_TWO,
        ]);
        // Exit if no results
        if (empty($firstJourneyResults)) {
            return [];
        }
        $out = null;
        $secondJourneyResults = \RoutesCache::model()->findAllBySql(
                'SELECT routes_cache.* from routes_cache ' .
//                'JOIN air_source ON (air_source.id = routes_cache.air_source_id) ' .
                'WHERE routes_cache.search_id = :search_id ' .
                'AND routes_cache.order_=:firstJourney ' .
                'ORDER BY routes_cache.traveler_type_id, routes_cache.total_fare;'
                , [
            ':search_id' => $this->id,
            ':firstJourney' => \RoutesCache::ORDER_SECOND_JOURNEY_FROM_TWO,
        ]);

        /* @var $firstJourneyResults \RoutesCache[] */
        /* @var $secondJourneyResults \RoutesCache[] */
        // Assign the main results to the output array
        foreach ($firstJourneyResults as $rc1) {
            if ($rc1->traveler_type_id === $travellerTypeId) {   // Primary pax type - ADT or CHD
                foreach ($secondJourneyResults as $rc2) {
                    if ($rc2->traveler_type_id === $travellerTypeId     // Same primary pax type from the return journeys
                            && strtotime($rc1->arrival_date . ' ' . $rc1->arrival_time) + 1800 < strtotime($rc2->departure_date . ' ' . $rc2->departure_time)       // at least 30 min betweent the flights
                            && (
                                $rc2->grouping === $rc1->grouping || // Same grouping - remove this in otder to have full permutations
                                (!$rc1->specialRoundTripDiscountFare() && !$rc2->specialRoundTripDiscountFare() )  // Not special (same airline) type of fare
                            )
                    ) {
                        // There are ADT
                        if ($this->adults > 0) {
                            // There are CHD
                            $chd1 = null;
                            $chd2 = null;
                            if ($this->children > 0) {
                                $chd1 = $rc1->findSameV2(\TravelerType::TRAVELER_CHILD, $firstJourneyResults);
                                $chd2 = $rc2->findSameV2(\TravelerType::TRAVELER_CHILD, $secondJourneyResults);
                                if ($chd1 === null || $chd2 === null) {
                                    // No matching RC for the kid is found
                                    continue;
                                }
                            }

                            $inf1 = null;
                            $inf2 = null;
                            // There are INF
                            if ($this->infants > 0) {
                                $inf1 = $rc1->findSameV2(\TravelerType::TRAVELER_INFANT, $firstJourneyResults);
                                $inf2 = $rc2->findSameV2(\TravelerType::TRAVELER_INFANT, $secondJourneyResults);
                                if ($inf1 === null || $inf2 === null) {
                                    // No matching RC for the infant is found
                                    continue;
                                }
                            }
                            $journey1 = array_filter([$rc1, $chd1, $inf1]);
                            $journey2 = array_filter([$rc2, $chd2, $inf2]);
                            $out[] = [$journey1, $journey2];
                        } else {    // Kid without adult - very rare combo, but still possible
                            $out[] = [[$rc1], [$rc2]];
                        }
                    }
                }
            }
        }

        if ($out === null) {
            return [];
        }
//        echo \Utils::dbgYiiLog($fare1);
//        echo \Utils::dbgYiiLog($fare2);
//        exit;
        // Fare Permutations
        $fares = [];
        foreach ($out as $key => $journeys) {
            $amount = 0;
            foreach ($journeys as $journey) {
                foreach ($journey as $pax) {
                    $amount += $pax->total_fare;
                }
            }
            $fares[] = [
                'key' => $key,
                'amount' => $amount,
            ];
        }
        // Fares sorting
        $cmp = function($a, $b) {
            return $a['amount'] > $b['amount'];
        };
        usort($fares, $cmp);
        $result = [];
        // Output structure preparation
        foreach ($fares as $fare) {
            $result[] = $out[$fare['key']];
            if (count($result) >= $maxCount) {
                break;  // Don't return more than maxCount results
            }
        }

        return $result;
    }

    /**
     * Will return number of passengers of given type
     *
     * @param $type
     * @return mixed|null
     */
    public function countPnr($type) {
        if (\TravelerType::TRAVELER_ADULT == $type) {
            return $this->adults;
        }

        if (\TravelerType::TRAVELER_CHILD == $type) {
            return $this->children;
        }

        if (\TravelerType::TRAVELER_INFANT == $type) {
            return $this->infants;
        }


        return null;
    }

    /**
     * Format the ASrule as html to be used in search admin UI
     * @param int $ruleId the rule ID
     * @param bool $tableOnly 
     * @return string HTML formated table or popover
     */
    public function formatAirSourceRule($ruleId, $tableOnly = false) {
        $rule = \AirsourceRule::model()->findByPk($ruleId);
        /* @var $rule \AirsourceRule */
        if ($rule->matchSearch($this)) {
            $countMatchedAirSources = 0;
            $table = "<table><tr><th>Name</th><th>Status</th></tr>";

            // Find the AirSources associated with the rule
            $criteria = new \CDbCriteria;
            $criteria->addInCondition('id', \AirsourceRule::unGroupIds($rule->air_source_ids));
            $criteria->select = 'name, is_active';
            $airSources = \AirSource::model()->findAll($criteria);

            foreach ($airSources as $airSource) {
                if ($airSource->is_active) {
                    $countMatchedAirSources++;
                    $table .= "<tr><td>$airSource->name</td><td><span class='label label-success'>enabled</span></td></tr>";
                } else {
                    $table .= "<tr><td>$airSource->name</td><td><span class='label label-important'>disabled</span></td></tr>";
                }
            }
            $table .= "</table>";

            if ($countMatchedAirSources > 0) {
                $class = "btn-success";
            } else {
                $class = "btn-danger";
            }

            if ($tableOnly) {
                return $table;
            } else {
                return TbHtml::popover('AS: ' . $countMatchedAirSources, 'Matched Air Sources', $table, ["data-html" => "true", 'class' => "btn btn-small $class"]);
            }
        }
        return '';
    }

    /**
     * Find suitable air source rule for the search
     * @return \AirsourceRule or null if no match
     */
    function findMatchingAirSourceRule() {
        $rules = \AirsourceRule::model()->cache(300)->findAll(['order' => 'order_']);
        foreach ($rules as $rule) {
            /* @var $rule \AirsourceRule */
            if ($rule->matchSearch($this)) {
                return $rule;
            }
        }

        return null;
    }

    function findDuplicateRCs() {
        $dups = [];
        $passed = [];
        $rcs = \RoutesCache::model()->findAll([
            'condition' => 'search_id = :sId',
            'order' => 'air_source_id, t.id',
//            'order' => 't.id',
            'params' => [':sId' => $this->id]
        ]);
        foreach ($rcs as $key => $rc) {
//            $hash = $rc->getAppCacheKey() . \RoutesCache::HASH_SEPARATOR . $rc->traveler_type_id;
            $hash = strstr($rc->hash_str, \RoutesCache::HASH_SEPARATOR);
            if (isset($passed[$hash])) {
                $dups[] = [
                    'a' => $rcs[$passed[$hash]],
                    'b' => $rc,
                ];
            } else {
                $passed[$hash] = $key;
            }
        }
        return $dups;
    }

    /**
     * Find duplicate RC id that has to be removed for the search
     * @return array
     */
    function findDuplicateRcIdsToBeRemoved() {
        \AirSource::cacheAllWithIdsKeys();
        $toBeRemoved = [];
        $passed = [];
//        $rcs = \RoutesCache::model()->findAllBySql("SELECT rc.* FROM routes_cache rc "
//                . 'LEFT JOIN rc_link rl ON rc.id=rl."from" '
//                . "WHERE rc.search_id = $this->id AND rl.\"from\" IS NULL");

        $rcs = \RoutesCache::model()->findAllBySql("SELECT * FROM routes_cache WHERE search_id = $this->id");

        foreach ($rcs as $key => $rc) {
            /* @var $rcs \RoutesCache[] */
            $hash = strstr($rc->hash_str, \RoutesCache::HASH_SEPARATOR);
            if (isset($passed[$hash])) {
                $rc1Price = $rcs[$passed[$hash]]->total_fare - $rcs[$passed[$hash]]->calcCommission();
                $rc2Price = $rc->total_fare - $rc->calcCommission();

                // First to stay
                if ($rc1Price < $rc2Price) {
                    $toBeRemoved[] = $rc->id;
                    continue;
                }

                // Second to stay
                if ($rc1Price > $rc2Price) {
                    $toBeRemoved[] = $rcs[$passed[$hash]]->id;
                    $passed[$hash] = $key;
                    continue;
                }

                // Equal prices - remove the lowest Air source priority
                if (\AirSource::$cachedAirSources[$rc->air_source_id]['priority'] > \AirSource::$cachedAirSources[$rcs[$passed[$hash]]->air_source_id]['priority']) {
                    $toBeRemoved[] = $rc->id;
                } else {
                    $toBeRemoved[] = $rcs[$passed[$hash]]->id;
                    $passed[$hash] = $key;
                }
            } else {
                $passed[$hash] = $key;
            }
        }
        return $toBeRemoved;
    }

    /**
     * Remove duplicate RCs for the search
     */
    function removeDuplicates() {
        $dups = $this->findDuplicateRcIdsToBeRemoved();
        if (!empty($dups)) {
            \Yii::app()->db->createCommand()
                    ->delete('routes_cache', "search_id=$this->id AND id IN (" . implode(',', $dups) . ');');
        }
    }

}
