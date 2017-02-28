<?php

/**
 * This is the model class for table "booking_log".
 *
 * The followings are the available columns in table 'booking_log':
 * @property integer $id
 * @property integer $booking_id
 * @property string $browser
 * @property string $browser_version
 * @property string $platform
 * @property integer $is_mobile
 * @property string $logs
 * @property string $booking_data
 * @property integer $enabled
 * @property string $created
 * @property integer $client_source_id
 * @property integer $air_cart_id
 * @property string $source
 * @property string $destination
 * @property integer $type_id
 * @property integer $is_domestic
 * @property integer $carrier_id
 * @property integer $is_one_click
 * @property string $user_ip
 * @property string $ref_id
 * @property string $callback_url
 * 
 * The followings are the available model relations:
 * @property AirCart $airCart
 * @property ClientSource $clientSource
 * @property Carrier $carrier
 */
class BookingLog extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'booking_log';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('booking_id', 'required'),
            array('booking_id, is_mobile, enabled, client_source_id, air_cart_id,type_id,is_domestic,search_id, rcs_id,carrier_id, is_one_click', 'numerical', 'integerOnly' => true),
            array('ref_id', 'length', 'max' => 200),
            array('browser, browser_version, platform, logs, booking_data, created, client_source_id,air_cart_id,source,destination, is_one_click, user_ip, callback_url', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id, booking_id, browser, browser_version, platform, is_mobile, logs, booking_data, enabled, created, client_source_id, air_cart_id,source,destination,type_id,is_domestic,search_id, rcs_id,carrier_id, is_one_click, user_ip, ref_id, callback_url', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airCart' => array(self::BELONGS_TO, 'AirCart', 'air_cart_id'),
            'clientSource' => [self::BELONGS_TO, 'ClientSource', 'client_source_id'],
            'carrier' => array(self::BELONGS_TO, 'Carrier', 'carrier_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'booking_id' => 'Booking',
            'browser' => 'Browser',
            'browser_version' => 'Browser Version',
            'platform' => 'Platform',
            'is_mobile' => 'Is Mobile',
            'logs' => 'Logs',
            'booking_data' => 'Booking Data',
            'enabled' => 'Enabled',
            'created' => 'Created',
            'client_source_id' => 'Client Source',
            'air_cart_id' => 'Air Cart Id',
            'source' => 'Source',
            'destination' => 'Destination',
            'type_id' => 'Type',
            'is_domestic' => 'Is Domestic',
            'carrier_id' => 'Carrier Id',
            'is_one_click' => 'One Click',
            'user_ip' => 'User Ip',
            'ref_id' => 'Reference ID',
            'callback_url' => 'Callback Url',
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
        $criteria->compare('booking_id', $this->booking_id);
        $criteria->compare('browser', $this->browser, true);
        $criteria->compare('browser_version', $this->browser_version, true);
        $criteria->compare('platform', $this->platform, true);
        $criteria->compare('is_mobile', $this->is_mobile);
        $criteria->compare('logs', $this->logs, true);
        $criteria->compare('client_source_id', $this->client_source_id);
        $criteria->compare('air_cart_id', $this->air_cart_id);
        $criteria->compare('enabled', $this->enabled);
        $criteria->compare('source', $this->source);
        $criteria->compare('destination', $this->destination);
        $criteria->compare('type_id', $this->type_id);
        $criteria->compare('is_domestic', $this->is_domestic);
        $criteria->compare('carrier_id', $this->carrier_id);
        $criteria->compare('created', $this->created, true);
        $criteria->compare('is_one_click', $this->is_one_click);
        $criteria->compare('user_ip', $this->user_ip, true);
        $criteria->compare('ref_id', $this->ref_id, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
            'pagination' => ['pageSize' => 20]
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return BookingLog the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public static function push_log($bookingId, $bookingjson, $log = null, $browser = null, $browserversion = null, $platform = null, $is_mobile = null, $booking = null, $is_one_click = 0) {

        $bookinglog = self::findLogByBookingId((int) $bookingId);
        if (!empty($bookinglog)) {
            $bookinglog->booking_data = (string) json_encode($bookingjson);
            $logs = json_decode($bookinglog->logs, true);
            if ($log != null) {
                $logs["created " . date(DATETIME_FORMAT)] = htmlentities($log);
                $bookinglog->logs = (string) json_encode($logs);
            }
            $bookinglog->update(['logs', 'booking_data']);
        } else {
            //\Utils::dbgYiiLog($booking);
            $bookinglognew = new \BookingLog();
            $bookinglognew->booking_data = (string) json_encode($bookingjson);
            $bookinglognew->booking_id = $bookingId;
            $bookinglognew->browser = (string) $browser;
            $bookinglognew->browser_version = (string) $browserversion;
            $bookinglognew->platform = (string) $platform;
            $bookinglognew->is_mobile = (int) $is_mobile;
            $logs["created " . date(DATETIME_FORMAT)] = htmlentities($log);
            $bookinglognew->logs = (string) json_encode($logs);
            if (!empty($booking->clientSourceId))
                $bookinglognew->client_source_id = (int) $booking->clientSourceId;


            if (!empty($booking->flights[0]->search->id)) {
                $searchmodel = \Searches::model()->findByPk((int) $booking->flights[0]->search->id);
                if ($searchmodel !== null) {
                    $bookinglognew->source = $searchmodel->origin;
                    $bookinglognew->destination = $searchmodel->destination;
                    $bookinglognew->type_id = $searchmodel->type_id;
                    $bookinglognew->is_domestic = $searchmodel->is_domestic;
                }
            }
            if (!empty($booking->flights[0]->routes[0][0]->id)) {
                $rmodel = \RoutesCache::model()->findByPk((int) $booking->flights[0]->routes[0][0]->id);
                if($rmodel !== null) {
                    $bookinglognew->carrier_id = $rmodel->carrier_id;
                }
            }
            $bookinglognew->is_one_click = $is_one_click;
            $bookinglognew->user_ip = \Yii::app()->request->userHostAddress;
            $bookinglognew->insert();
        }
    }

    public static function pushCartIdInlog($bookingId, $bookingjson, $aircartId = null) {
        $bookinglog = self::findLogByBookingId($bookingId);
        if (!empty($bookinglog) && $aircartId != null) {
            $bookinglog->air_cart_id = (int) $aircartId;
            $logs = json_decode($bookinglog->logs, true);
            $logs["created " . date(DATETIME_FORMAT)] = htmlentities('Air cart id: ' . $aircartId);
            $bookinglog->logs = (string) json_encode($logs);
            $bookinglog->update(['logs', 'air_cart_id']);
        }
    }

    public static function findLogByBookingId($bookingId) {
        return self::model()->findByAttributes(array('booking_id' => (int) $bookingId), array(
                'condition' => 'created>=:past',
                'params' => array(':past' => date('Y-m-d', strtotime('-1 days')))
        ));
    }

    public function searchForReport() {

        $condition = 'client_source_id=:cID and t.type_id=:tID and source=:sID and destination=:dID and t.is_domestic=:isdID and created >=:past';
        $params = array(':cID' => $this->client_source_id, ':tID' => $this->type_id, ':sID' => $this->source, ':dID' => $this->destination, ':isdID' => $this->is_domestic, ':past' => date('Y-m-d', strtotime('-7 days')));
        $query = Yii::app()->db->createCommand()
            ->select('client_source_id,c.name as cname,cr.name as crname,source,destination,t.type_id , t.is_domestic , carrier_id , count(t.id) as total,(select count(srch.id) from searches_arch srch where srch.origin=t.source and srch.client_source_id=t.client_source_id and srch.destination=t.destination and t.type_id=srch.type_id and t.is_domestic=srch.is_domestic and created >= NOW() - INTERVAL \'7 days\') as searches , (select count(bl.id) from booking_log bl  where bl.source=t.source and bl.client_source_id=t.client_source_id and bl.destination=t.destination and t.type_id=bl.type_id and t.is_domestic=bl.is_domestic and bl.created >= NOW() - INTERVAL \'7 days\' and bl.air_cart_id is not null) as bookings')
            ->from('booking_log t')
            ->join('client_source c', 'c.id=t.client_source_id')
            ->join('carrier cr', 't.carrier_id=cr.id')
            ->where($condition, $params)
            ->group('client_source_id,c.name,cr.name,source,destination,t.type_id,t.is_domestic,carrier_id')
            ->order('total desc')
            ->queryAll();


        $data = new CArrayDataProvider($query, array(
            'keyField' => 'carrier_id',
//            'sort' => array(//optional and sortring
//                'attributes' => array(
//                    'client_source_id','cname','crname',  'source', 'destination', 'type_id','is_domestic', 'carrier_id','total'),
//            ),
            'pagination' => array('pageSize' => 10))
        );
        //  \Utils::dbgYiiLog(['$data'=>$data]);
        return $data;
    }

    public static function reportClientSource($fromdate, $todate) {
        $reportdata = null;
        $data = self::runQuery('searches_arch', $fromdate, $todate);
        foreach ($data as $row) {
            $reportdata['searches'][$row['csid']] = $row['total'];
        }
        $data = self::runQuery('searches_arch', $fromdate, $todate, 'domestic');
        foreach ($data as $row) {
            $reportdata['searchesdom'][$row['csid']] = $row['total'];
        }
        $data = self::runQuery('booking_log', $fromdate, $todate);
        foreach ($data as $row) {
            $reportdata['redirect'][$row['csid']] = $row['total'];
        }
        $data = self::runQuery('booking_log', $fromdate, $todate, 'domestic');
        foreach ($data as $row) {
            $reportdata['redirectdom'][$row['csid']] = $row['total'];
        }
        $data = self::runQuery('booking_log', $fromdate, $todate, null, 'booked');
        foreach ($data as $row) {
            $reportdata['bookings'][$row['csid']] = $row['total'];
        }
        $data = self::runQuery('booking_log', $fromdate, $todate, 'domestic', 'booked');
        foreach ($data as $row) {
            $reportdata['bookingsdom'][$row['csid']] = $row['total'];
        }
        //    \Utils::dbgYiiLog($reportdata);
        return $reportdata;
    }

    public static function reportClientSourceReport($fromdate, $todate, $cs) {


        $data = \BookingLog::runClientSourceQuery('searches_arch', $fromdate, $todate, $cs); //searches_arch
        $reportdata['searches'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('searches_arch', $fromdate, $todate, $cs, 'domestic');
        $reportdata['searchesdom'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs);
        $reportdata['redirect'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs, 'domestic');
        $reportdata['redirectdom'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs, null, null, 'mobile');
        $reportdata['redirectmobile'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs, 'domestic', null, 'mobile');
        $reportdata['redirectmobiledom'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs, null, 'booked');
        $reportdata['bookings'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs, 'domestic', 'booked');
        $reportdata['bookingsdom'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs, null, 'booked', 'mobile');
        $reportdata['bookingsmobile'] = $data[0]['total'];

        $data = \BookingLog::runClientSourceQuery('booking_log', $fromdate, $todate, $cs, 'domestic', 'booked', 'mobile');
        $reportdata['bookingsmobiledom'] = $data[0]['total'];


        $data = \BookingLog::runTopSectorQuery('searches_arch', $fromdate, $todate, $cs); //searches_arch
        $reportdata['searchessector'] = $data;

        $data = \BookingLog::runTopSectorQuery('booking_log', $fromdate, $todate, $cs);
        $reportdata['redirectsector'] = $data;

        $data = \BookingLog::runTopSectorQuery('booking_log', $fromdate, $todate, $cs, null, 'booked');
        $reportdata['bookingssector'] = $data;

        $data = \BookingLog::runTopAirlineQuery('booking_log', $fromdate, $todate, $cs);
        $reportdata['redirectairline'] = $data;

        $data = \BookingLog::runTopAirlineQuery('booking_log', $fromdate, $todate, $cs, null, 'booked');
        $reportdata['bookingsairline'] = $data;

        //\Utils::dbgYiiLog($data);
        //    \Utils::dbgYiiLog($reportdata);
        return $reportdata;
    }

    public static function runQuery($tablename, $fromdate, $todate, $isdomestic = null, $isbooked = null) {
        $condition = 't.created>=:from and t.created<=:to ';
        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($isbooked)) {
            $condition.=' and t.air_cart_id is not null and a.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
        }
        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        if ($tablename === 'searches_arch') {
            $select = 't.client_source_id as csid,sum(t.hits) as total';
        } else {
            $select = 't.client_source_id as csid,count(t.id) as total';
        }

        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('client_source c', 'c.id=t.client_source_id')
            ->where($condition, $params)
            ->group('t.client_source_id');
        //     \Utils::dbgYiiLog($query);
        if (!empty($isbooked)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }
        return $query->queryAll();
    }

    public static function runClientSourceQuery($tablename, $fromdate, $todate, $cs, $isdomestic = null, $isbooked = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to ';
        if (!empty($cs)) {
            $condition.=' and t.client_source_id=:cs ';
        }
        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($isbooked)) {
            $condition.=' and t.air_cart_id is not null and a.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
        }
        if (!empty($ismobile)) {
            $condition.=' and t.is_mobile=1 ';
        }
        if (!empty($cs)) {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59', ':cs' => $cs);
        } else {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        }
        if ($tablename === 'searches_arch') { //searches_arch
            $select = 'sum(t.hits) as total';
        } else {
            $select = 'count(t.id) as total';
        }

        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('client_source c', 'c.id=t.client_source_id')
            ->where($condition, $params);
        //    ->group('t.client_source_id');
        //  \Utils::dbgYiiLog($query);
        if (!empty($isbooked)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }
        return $query->queryAll();
    }

    public static function runTopSectorQuery($tablename, $fromdate, $todate, $cs, $isdomestic = null, $isbooked = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to ';
        if (!empty($cs)) {
            $condition.=' and t.client_source_id=:cs ';
        }
        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($isbooked)) {
            $condition.=' and t.air_cart_id is not null and a.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
        }
        if (!empty($ismobile)) {
            $condition.=' and t.is_mobile=1 ';
        }
        if (!empty($cs)) {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59', ':cs' => $cs);
        } else {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        }
        if ($tablename === 'searches_arch') { //searches_arch
            $select = 't.origin as source,t.destination,sum(t.hits) as total';
            $group = 't.origin,t.destination';
        } else {
            $select = 't.source as source,t.destination,count(t.id) as total';
            $group = 't.source,t.destination';
        }

        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('client_source c', 'c.id=t.client_source_id')
            ->where($condition, $params)
            ->group($group)
            ->order('total desc')
            ->limit(5);
        //  \Utils::dbgYiiLog($query);
        if (!empty($isbooked)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }
        return $query->queryAll();
    }

    public static function runTopAirlineQuery($tablename, $fromdate, $todate, $cs, $isdomestic = null, $isbooked = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to ';
        if (!empty($cs)) {
            $condition.=' and t.client_source_id=:cs ';
        }
        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($isbooked)) {
            $condition.=' and t.air_cart_id is not null and a.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
        }
        if (!empty($ismobile)) {
            $condition.=' and t.is_mobile=1 ';
        }
        if (!empty($cs)) {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59', ':cs' => $cs);
        } else {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        }
        if ($tablename === 'searches_arch') { //searches_arch
            $select = 't.carrier_id as carrier,cr.code as code,cr.name as name, sum(t.hits) as total';
            $group = 't.carrier_id';
        } else {
            $select = 't.carrier_id as carrier,cr.code as code,cr.name as name,count(t.id) as total';
            $group = 't.carrier_id,cr.code,cr.name';
        }

        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('client_source c', 'c.id=t.client_source_id')
            ->join('carrier cr', 'cr.id=t.carrier_id')
            ->where($condition, $params)
            ->group($group)
            ->order('total desc')
            ->limit(5);
        //  \Utils::dbgYiiLog($query);
        if (!empty($isbooked)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }
        return $query->queryAll();
    }

    public static function reportClientDetailReport($fromdate, $todate, $cs) {

        $reportdata = [];
        $data = \BookingLog::runClientDetailQuery('searches_arch', $fromdate, $todate, $cs); //searches_arch

        foreach ($data as $row) {
            $reportdata['searches'][$row['date']] = $row['total'];
        }

        $data = \BookingLog::runClientDetailQuery('searches_arch', $fromdate, $todate, $cs, 'domestic');

        foreach ($data as $row) {
            $reportdata['searchesdom'][$row['date']] = $row['total'];
        }
        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs);

        foreach ($data as $row) {
            $reportdata['redirect'][$row['date']] = $row['total'];
        }
        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs, 'domestic');

        foreach ($data as $row) {
            $reportdata['redirectdom'][$row['date']] = $row['total'];
        }

        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs, null, null, 'mobile');

        foreach ($data as $row) {
            $reportdata['redirectmobile'][$row['date']] = $row['total'];
        }

        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs, 'domestic', null, 'mobile');

        foreach ($data as $row) {
            $reportdata['redirectmobiledom'][$row['date']] = $row['total'];
        }

        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs, null, 'booked');

        foreach ($data as $row) {
            $reportdata['bookings'][$row['date']] = $row['total'];
        }

        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs, 'domestic', 'booked');

        foreach ($data as $row) {
            $reportdata['bookingsdom'][$row['date']] = $row['total'];
        }

        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs, null, 'booked', 'mobile');

        foreach ($data as $row) {
            $reportdata['bookingsmobile'][$row['date']] = $row['total'];
        }

        $data = \BookingLog::runClientDetailQuery('booking_log', $fromdate, $todate, $cs, 'domestic', 'booked', 'mobile');

        foreach ($data as $row) {
            $reportdata['bookingsmobiledom'][$row['date']] = $row['total'];
        }




        //\Utils::dbgYiiLog($data);
        //    \Utils::dbgYiiLog($reportdata);
        return $reportdata;
    }

    public static function reportSalesReport($fromdate, $todate, $cs) {


        $data = \BookingLog::runSalesQuery('air_booking', $fromdate, $todate, $cs);
        $reportdata['sales'] = null;
        if (isset($data[0]['total']))
            $reportdata['sales'] = $data[0]['total'];

        $data = \BookingLog::runSalesQuery('air_booking', $fromdate, $todate, $cs, 'domestic');
        $reportdata['salesdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['salesdom'] = $data[0]['total'];

        $data = \BookingLog::runSalesQuery('air_booking', $fromdate, $todate, $cs, null, 'mobile');
        $reportdata['salesmobile'] = null;
        if (isset($data[0]['total']))
            $reportdata['salesmobile'] = $data[0]['total'];

        $data = \BookingLog::runSalesQuery('air_booking', $fromdate, $todate, $cs, 'domestic', 'mobile');
        $reportdata['salesdommobile'] = null;
        if (isset($data[0]['total']))
            $reportdata['salesdommobile'] = $data[0]['total'];

        $data = \BookingLog::runCartsQuery('air_cart', $fromdate, $todate, $cs);
        $reportdata['carts'] = null;
        if (isset($data[0]['total']))
            $reportdata['carts'] = $data[0]['total'];

        $data = \BookingLog::runCartsQuery('air_cart', $fromdate, $todate, $cs, 'domestic');
        $reportdata['cartsdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['cartsdom'] = $data[0]['total'];

        $data = \BookingLog::runCartsQuery('air_cart', $fromdate, $todate, $cs, null, 'mobile');
        $reportdata['cartsmobile'] = null;
        if (isset($data[0]['total']))
            $reportdata['cartsmobile'] = $data[0]['total'];

        $data = \BookingLog::runCartsQuery('air_cart', $fromdate, $todate, $cs, 'domestic', 'mobile');
        $reportdata['cartsdommobile'] = null;
        if (isset($data[0]['total']))
            $reportdata['cartsdommobile'] = $data[0]['total'];


        $data = \BookingLog::runSegmentsQuery('air_routes', $fromdate, $todate, $cs);
        $reportdata['segments'] = null;
        if (isset($data[0]['total']))
            $reportdata['segments'] = $data[0]['total'];

        $data = \BookingLog::runSegmentsQuery('air_routes', $fromdate, $todate, $cs, 'domestic');
        $reportdata['segmentsdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['segmentsdom'] = $data[0]['total'];

        $data = \BookingLog::runSegmentsQuery('air_routes', $fromdate, $todate, $cs, null, 'lcc');
        $reportdata['segmentslcc'] = null;
        if (isset($data[0]['total']))
            $reportdata['segmentslcc'] = $data[0]['total'];

        $data = \BookingLog::runSegmentsQuery('air_routes', $fromdate, $todate, $cs, 'domestic', 'lcc');
        $reportdata['segmentsdomlcc'] = null;
        if (isset($data[0]['total']))
            $reportdata['segmentsdomlcc'] = $data[0]['total'];


        $data = \BookingLog::runPassengersQuery('air_booking', $fromdate, $todate, $cs);
        $reportdata['passengers'] = null;
        if (isset($data[0]['total']))
            $reportdata['passengers'] = $data[0]['total'];

        $data = \BookingLog::runPassengersQuery('air_booking', $fromdate, $todate, $cs, 'domestic');
        $reportdata['passengersdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['passengersdom'] = $data[0]['total'];


        $data = \BookingLog::runPassengersQuery('air_booking', $fromdate, $todate, $cs, null, 'mobile');
        $reportdata['passengersmobile'] = null;
        if (isset($data[0]['total']))
            $reportdata['passengersmobile'] = $data[0]['total'];


        $data = \BookingLog::runPassengersQuery('air_booking', $fromdate, $todate, $cs, 'domestic', 'mobile');
        $reportdata['passengersdommobile'] = null;
        if (isset($data[0]['total']))
            $reportdata['passengersdommobile'] = $data[0]['total'];


        $data = \BookingLog::runCancellationQuery('amendment', $fromdate, $todate, $cs);
        $reportdata['cancel'] = null;
        if (isset($data[0]['total']))
            $reportdata['cancel'] = $data[0]['total'];

        $data = \BookingLog::runCancellationQuery('amendment', $fromdate, $todate, $cs, 'domestic');
        $reportdata['canceldom'] = null;
        if (isset($data[0]['total']))
            $reportdata['canceldom'] = $data[0]['total'];

        $data = \BookingLog::runRescheduleQuery('amendment', $fromdate, $todate, $cs);
        $reportdata['res'] = null;
        if (isset($data[0]['total']))
            $reportdata['res'] = $data[0]['total'];

        $data = \BookingLog::runRescheduleQuery('amendment', $fromdate, $todate, $cs, 'domestic');
        $reportdata['resdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['resdom'] = $data[0]['total'];


        //\Utils::dbgYiiLog($data);
        //    \Utils::dbgYiiLog($reportdata);
        return $reportdata;
    }

    public static function runClientDetailQuery($tablename, $fromdate, $todate, $cs, $isdomestic = null, $isbooked = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to ';
        if (!empty($cs)) {
            $condition.=' and t.client_source_id=:cs ';
        }
        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($isbooked)) {
            $condition.=' and t.air_cart_id is not null and a.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
        }
        if (!empty($ismobile)) {
            $condition.=' and t.is_mobile=1 ';
        }
        if (!empty($cs)) {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59', ':cs' => $cs);
        } else {
            $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        }
        if ($tablename === 'searches_arch') { //searches_arch
            $select = 'to_char(t.created,\'YYYY-MM-DD\')as date ,sum(t.hits) as total';
        } else {
            $select = 'to_char(t.created,\'YYYY-MM-DD\')as date , count(t.id) as total';
        }

        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('client_source c', 'c.id=t.client_source_id')
            ->where($condition, $params)
            ->group('to_char(t.created,\'YYYY-MM-DD\')');
        // \Utils::dbgYiiLog($query);
        if (!empty($isbooked)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }
        return $query->queryAll();
    }

    public static function runSalesQuery($tablename, $fromdate, $todate, $cs = null, $isdomestic = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to and t.ab_status_id =' . \AbStatus::STATUS_OK . ' ';

        if (!empty($isdomestic)) {
            $condition.=' and t.service_type_id=1 ';
        }
        if (!empty($ismobile)) {
            $condition.=' and b.is_mobile=1 ';
        }

        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'SUM(t.fuel_surcharge+t.udf_charge+t.jn_tax+t.other_tax+t.basic_fare+t.booking_fee-t.commission_or_discount_gross+t.meal_charge+t.seat_charge)::float8 as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('booking_log b', 'b.air_cart_id=t.air_cart_id')
            ->where($condition, $params);
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runCartsQuery($tablename, $fromdate, $todate, $cs = null, $isdomestic = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to ';
        $condition.=' and t.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';

        if (!empty($isdomestic)) {
            $condition.=' and ab.service_type_id=1 ';
        }
        if (!empty($ismobile)) {
            $condition.=' and b.is_mobile=1 ';
        }

        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'count(distinct  t.id)  as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('booking_log b', 'b.air_cart_id=t.id')
            ->join('air_booking ab', 'ab.air_cart_id=t.id')
            ->where($condition, $params);
        //    ->group('t.id');
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runSegmentsQuery($tablename, $fromdate, $todate, $cs = null, $isdomestic = null, $islcc = null) {
        $condition = 'ab.created>=:from and ab.created<=:to and ab.ab_status_id =' . \AbStatus::STATUS_OK . ' ';

        if (!empty($isdomestic)) {
            $condition.=' and ab.service_type_id=1 ';
        }


        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'count(distinct  t.id)  as total';
        if (!empty($islcc)) {
            $select = 'sum(CASE WHEN a.backend_id IN (9,10,1,2,3,4) THEN 1 ELSE 0 END)  as total';
        }

        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('air_booking ab', 't.air_booking_id=ab.id')
            ->join('air_source a', 'ab.air_source_id=a.id')
            ->where($condition, $params);
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runPassengersQuery($tablename, $fromdate, $todate, $cs = null, $isdomestic = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to and t.ab_status_id =' . \AbStatus::STATUS_OK . ' ';

        if (!empty($isdomestic)) {
            $condition.=' and t.service_type_id=1 ';
        }
        if (!empty($ismobile)) {
            $condition.=' and b.is_mobile=1 ';
        }

        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'count(distinct  t.id)  as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('booking_log b', 'b.air_cart_id=t.air_cart_id')
            ->where($condition, $params);
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runCancellationQuery($tablename, $fromdate, $todate, $cs = null, $isdomestic = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to and t.amendment_status_id=' . \AmendmentStatus::STATUS_SUCCESS . ' and t.amendment_type_id =' . \AmendmentType::AMENDMENT_CANCEL . ' ';

        if (!empty($isdomestic)) {
            $condition.=' and ab.service_type_id=1 ';
        }
        if (!empty($ismobile)) {
            $condition.=' and b.is_mobile=1 ';
        }

        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'count(distinct  t.id)  as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('air_booking ab', 't.air_booking_id=ab.id')
            ->join('booking_log b', 'b.air_cart_id=ab.air_cart_id')
            ->where($condition, $params);
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runRescheduleQuery($tablename, $fromdate, $todate, $cs = null, $isdomestic = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to and t.amendment_status_id=' . \AmendmentStatus::STATUS_SUCCESS . ' and t.amendment_type_id =' . \AmendmentType::AMENDMENT_RESCHEDULE . ' ';

        if (!empty($isdomestic)) {
            $condition.=' and ab.service_type_id=1 ';
        }
        if (!empty($ismobile)) {
            $condition.=' and b.is_mobile=1 ';
        }

        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'count(distinct  t.id)  as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('air_booking ab', 't.air_booking_id=ab.id')
            ->join('booking_log b', 'b.air_cart_id=ab.air_cart_id')
            ->where($condition, $params);
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function reportDeviceReport($fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype = null) {
        $reportdata = null;

        $data = \BookingLog::reportDeviceQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, $bs = null, $isdomestic = null);
        foreach ($data as $row) {
            $reportdata['redirect'][$row['platform']] = $row['total'];
        }
        $data = \BookingLog::reportDeviceQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, $bs = null, 'domestic');
        foreach ($data as $row) {
            $reportdata['redirectdom'][$row['platform']] = $row['total'];
        }
        $data = \BookingLog::reportDeviceQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, '1', $isdomestic = null);
        foreach ($data as $row) {
            $reportdata['bookings'][$row['platform']] = $row['total'];
        }
        $data = \BookingLog::reportDeviceQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, '1', 'domestic');
        foreach ($data as $row) {
            $reportdata['bookingsdom'][$row['platform']] = $row['total'];
        }
        $data = \BookingLog::reportDeviceDetailQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, null, null);
        foreach ($data as $row) {
            $reportdata['browser'][$row['browser'] . '_' . $row['browser_version']]['redirect'] = $row['total'];
        }
        $data = \BookingLog::reportDeviceDetailQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, null, 'domestic');
        foreach ($data as $row) {
            $reportdata['browser'][$row['browser'] . '_' . $row['browser_version']]['redirectdom'] = $row['total'];
        }
        $data = \BookingLog::reportDeviceDetailQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, '1', null);
        foreach ($data as $row) {
            $reportdata['browser'][$row['browser'] . '_' . $row['browser_version']]['bookings'] = $row['total'];
        }
        $data = \BookingLog::reportDeviceDetailQuery('booking_log', $fromdate, $todate, $cs, $platform, $browser, $ismobile, $waytype, '1', 'domestic');
        foreach ($data as $row) {
            $reportdata['browser'][$row['browser'] . '_' . $row['browser_version']]['bookingsdom'] = $row['total'];
        }
        //    \Utils::dbgYiiLog($reportdata);
        return $reportdata;
    }

    public static function reportDeviceQuery($tablename, $fromdate, $todate, $cs = null, $platform = null, $browser = null, $ismobile = null, $waytype = null, $bs = null, $isdomestic = null) {

        $condition = 't.created>=:from and t.created<=:to';

        if (!empty($cs)) {
            $condition.=' and t.client_source_id=' . $cs;
        }
        if (!empty($platform)) {
            $condition.=' and t.platform=\'' . $platform . '\'';
        }
        if (!empty($browser)) {
            $condition.=' and t.browser=\'' . $browser . '\'';
        }
        if (!empty($bs)) {
            if ($bs == '1') {
                $condition.=' and a.booking_status_id in (' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_COMPLETE . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ')';
            } else {
                $condition.=' and a.booking_status_id not in (' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_COMPLETE . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ')';
            }
        }
        if (!empty($ismobile)) {
            $condition.=' and t.is_mobile=1 ';
        }
        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($waytype)) {
            $condition.=' and t.type_id=' . $waytype;
        }


        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 't.platform as platform,count(t.id) as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t');
        if (!empty($bs)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }

        $query->where($condition, $params);
        $query->group('t.platform');
        $query->order('t.platform asc');
        //  \Utils::dbgYiiLog($condition);

        $data = $query->queryAll();
        // \Utils::dbgYiiLog($data);
        //$reportdata['resdom'] =$data[0]['total'];
        //\Utils::dbgYiiLog($data);
        //    \Utils::dbgYiiLog($reportdata);

        return $data;
    }

    public static function reportDeviceDetailQuery($tablename, $fromdate, $todate, $cs = null, $platform = null, $browser = null, $ismobile = null, $waytype = null, $bs = null, $isdomestic = null) {

        $condition = 't.created>=:from and t.created<=:to';

        if (!empty($cs)) {
            $condition.=' and t.client_source_id=' . $cs;
        }
        if (!empty($platform)) {
            $condition.=' and t.platform=\'' . $platform . '\'';
        }
        if (!empty($browser)) {
            $condition.=' and t.browser=\'' . $browser . '\'';
        }
        if (!empty($bs)) {
            if ($bs == '1') {
                $condition.=' and a.booking_status_id in (' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_COMPLETE . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ')';
            } else {
                $condition.=' and a.booking_status_id not in (' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_COMPLETE . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ')';
            }
        }
        if (!empty($ismobile)) {
            $condition.=' and t.is_mobile=' . $ismobile;
        }
        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($waytype)) {
            $condition.=' and t.type_id=' . $waytype;
        }


        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 't.browser as browser,t.browser_version as browser_version,count(t.id) as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t');
        if (!empty($bs)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }

        $query->where($condition, $params);
        $query->group('t.browser,t.browser_version');
        $query->order('t.browser asc');
        //  \Utils::dbgYiiLog($condition);

        $data = $query->queryAll();
        // \Utils::dbgYiiLog($data);
        //$reportdata['resdom'] =$data[0]['total'];
        //\Utils::dbgYiiLog($data);
        //    \Utils::dbgYiiLog($reportdata);

        return $data;
    }

    public static function reportAirLineReport($fromdate, $todate) {

        $data = \BookingLog::runSalesRQuery('air_booking', $fromdate, $todate);
        $reportdata['sales'] = null;
        if (isset($data[0]['total'])) {
            $reportdata['sales'] = $data[0]['total'];
            $reportdata['yq'] = $data[0]['yq'];
            $reportdata['basic_fare'] = $data[0]['basic_fare'];
            $reportdata['other_tax'] = $data[0]['other_tax'];
        }
        $data = \BookingLog::runSalesQuery('air_booking', $fromdate, $todate, 'domestic');
        $reportdata['salesdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['salesdom'] = $data[0]['total'];


        $data = \BookingLog::runSegmentsQuery('air_routes', $fromdate, $todate);
        $reportdata['segments'] = null;
        if (isset($data[0]['total']))
            $reportdata['segments'] = $data[0]['total'];

        $data = \BookingLog::runSegmentsQuery('air_routes', $fromdate, $todate, 'domestic');
        $reportdata['segmentsdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['segmentsdom'] = $data[0]['total'];

        $data = \BookingLog::runCartsQuery('air_cart', $fromdate, $todate);
        $reportdata['carts'] = null;
        if (isset($data[0]['total']))
            $reportdata['carts'] = $data[0]['total'];

        $data = \BookingLog::runCartsQuery('air_cart', $fromdate, $todate, 'domestic');
        $reportdata['cartsdom'] = null;
        if (isset($data[0]['total']))
            $reportdata['cartsdom'] = $data[0]['total'];



        $data = \BookingLog::runTopSectorQuery('booking_log', $fromdate, $todate, null, 'booked');
        $reportdata['bookingssector'] = $data;



        $data = \BookingLog::runClientSource1Query('searches_arch', $fromdate, $todate); //searches_arch
        $reportdata['searches'] = $data[0]['total'];



        $data = \BookingLog::runClientSource1Query('booking_log', $fromdate, $todate);
        $reportdata['redirect'] = $data[0]['total'];



        $data = \BookingLog::runClientSource1Query('booking_log', $fromdate, $todate, null, 'booked');
        $reportdata['bookings'] = $data[0]['total'];

        //\Utils::dbgYiiLog($reportdata);
        return $reportdata;
    }

    public static function runSalesRQuery($tablename, $fromdate, $todate, $cs = null, $isdomestic = null, $ismobile = null) {
        $condition = 't.created>=:from and t.created<=:to and t.ab_status_id =' . \AbStatus::STATUS_OK . ' ';

        if (!empty($isdomestic)) {
            $condition.=' and t.service_type_id=1 ';
        }
        if (!empty($ismobile)) {
            $condition.=' and b.is_mobile=1 ';
        }

        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'SUM(t.fuel_surcharge+t.udf_charge+t.jn_tax+t.other_tax+t.basic_fare+t.booking_fee-t.commission_or_discount_gross+t.meal_charge+t.seat_charge+t.other_tax)::float8 as total, SUM(t.airport_tax+t.fuel_surcharge) as yq,SUM(t.basic_fare) as basic_fare,SUM(t.other_tax) as other_tax';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('booking_log b', 'b.air_cart_id=t.air_cart_id')
            ->where($condition, $params);
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runClientSource1Query($tablename, $fromdate, $todate, $isdomestic = null, $isbooked = null) {
        $condition = 't.created>=:from and t.created<=:to ';


        if (!empty($isdomestic)) {
            $condition.=' and t.is_domestic=1 ';
        }
        if (!empty($isbooked)) {
            $condition.=' and t.air_cart_id is not null and a.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
        }

        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        if ($tablename === 'searches_arch') { //searches_arch
            $select = 'sum(t.hits) as total';
        } else {
            $select = 'count(t.id) as total';
        }

        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('client_source c', 'c.id=t.client_source_id')
            ->where($condition, $params);
        //    ->group('t.client_source_id');
        //  \Utils::dbgYiiLog($query);
        if (!empty($isbooked)) {
            $query->join('air_cart a', 'a.id=t.air_cart_id');
        }
        return $query->queryAll();
    }

    public static function reportAirLineOverviewReport($fromdate, $todate) {
        $reportdata = null;
        $data = self::runAirlineCartsQuery('air_cart', $fromdate, $todate);
        foreach ($data as $row) {
            $reportdata[$row['airline']]['carts'] = $row['total'];
        }
        $data = self::runPassengersAirlineQuery('air_booking', $fromdate, $todate);
        foreach ($data as $row) {
            $reportdata[$row['airline']]['passengers'] = $row['total'];
        }
        $data = self::runSegmentsAirlineQuery('air_routes', $fromdate, $todate);
        foreach ($data as $row) {
            $reportdata[$row['airline']]['segments'] = $row['total'];
        }
        $data = self::runAirlineSalesQuery('air_booking', $fromdate, $todate);
        foreach ($data as $row) {
            $reportdata[$row['airline']]['sales'] = $row['total'];
        }
        //\Utils::dbgYiiLog($reportdata);
        return $reportdata;
    }

    public static function runPassengersAirlineQuery($tablename, $fromdate, $todate) {
        $condition = 't.created>=:from and t.created<=:to ';
        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 't.carrier_id as airline,count(distinct(t.id)) as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('booking_log b', 'b.air_cart_id=t.air_cart_id')
            ->where($condition, $params)
            ->group('t.carrier_id');
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runSegmentsAirlineQuery($tablename, $fromdate, $todate) {
        $condition = 'ab.created>=:from and ab.created<=:to and ab.ab_status_id =' . \AbStatus::STATUS_OK . ' ';
        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 't.carrier_id as airline,count(distinct(t.id)) as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('air_booking ab', 't.air_booking_id=ab.id')
            ->join('air_source a', 'ab.air_source_id=a.id')
            ->where($condition, $params)
            ->group('t.carrier_id');
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runAirlineSalesQuery($tablename, $fromdate, $todate) {
        $condition = 't.created>=:from and t.created<=:to and t.ab_status_id =' . \AbStatus::STATUS_OK . ' ';
        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 't.carrier_id as airline,SUM(t.fuel_surcharge+t.udf_charge+t.jn_tax+t.other_tax+t.basic_fare+t.booking_fee-t.commission_or_discount_gross+t.meal_charge+t.seat_charge+t.other_tax)::float8 as total, SUM(t.airport_tax+t.fuel_surcharge) as yq,SUM(t.basic_fare) as basic_fare,SUM(t.other_tax) as other_tax';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('booking_log b', 'b.air_cart_id=t.air_cart_id')
            ->where($condition, $params)
            ->group('t.carrier_id');
        // \Utils::dbgYiiLog($query);

        return $query->queryAll();
    }

    public static function runAirlineCartsQuery($tablename, $fromdate, $todate) {
        $condition = 't.created>=:from and t.created<=:to ';
        $condition.=' and t.booking_status_id in(' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')';
        $params = array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59');
        $select = 'ab.carrier_id as airline,count(distinct(t.id))  as total';
        $query = Yii::app()->db->createCommand()
            ->select($select)
            ->from($tablename . ' t')
            ->join('booking_log b', 'b.air_cart_id=t.id')
            ->join('air_booking ab', 'ab.air_cart_id=t.id')
            ->where($condition, $params)
            ->group('ab.carrier_id');

        return $query->queryAll();
    }

}
