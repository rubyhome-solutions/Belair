<?php

/**
 * This is the model class for table "air_cart".
 * The followings are the available columns in table 'air_cart':
 * @property integer $user_id
 * @property integer $payment_id
 * @property integer $booking_status_id
 * @property integer $loged_user_id
 * @property integer $payment_status_id
 * @property string $created
 * @property integer $id
 * @property string $note
 * @property string $summary The short summary of the flights in the cart
 * @property integer $approval_status_id
 * @property integer $client_source_id
 * @property string $invoice_no
 * @property integer $promo_codes_id
 * @property integer $claim_user_id
 * @property string $claimed_ts
 * @property integer $process_flag
 * @property integer $cart_status_id
 * @property string $rules
 * @property integer $website_id
 *
 * The followings are the available model relations:
 * @property BookingStatus $bookingStatus
 * @property Users $logedUser
 * @property Users $user
 * @property PaymentStatus $paymentStatus
 * @property AirBooking[] $airBookings
 * @property ApprovalStatus $approvalStatus
 * @property AircartFile[] $files
 * @property PayGateLog[] $payGateLogs
 * @property Payment[] $payments
 * @property ClientSource $clientSource
 * @property PromoCodes $promoCode
 * @property CartStatusLog $cartLogs
 */
class AirCart extends CActiveRecord {

    // Search filters
    public $booking_type_id;
    public $from_filter;
    public $to_filter;
    public $air_pnr_crs_pnr_ticket;
    public $traveler_id;
    public $queue_type;

    const WEBSITE_BELAIR = 2;
    const WEBSITE_CHEAPTICKET = 1;
    const WEBSITE_CHEAPTICKET_LOCAL = 4;
    const WEBSITE_CHEAPTICKET_DEV = 5;
    const WEBSITE_CHEAPTICKETS24_LOCAL = 6;
    const WEBSITE_CHEAPTICKETS24_DEV = 7;
    const WEBSITE_CHEAPTICKETS24_LIVE = 8;
    const WEBSITE_AIRTICKETSINDIA = 3;
    const WEBSITE_AIRTICKETS_LOCAL = 9;
    const WEBSITE_AIRTICKETS_DEV = 10;
    
    const EMAIL_NOT_SENT_BEYOND_DATE = '2017-01-10'; // after this date records will be considered

    static $websiteMap = [
        self::WEBSITE_BELAIR => 'AIR.BELAIR.IN',
        self::WEBSITE_AIRTICKETSINDIA => 'AIRTICKETSINDIA.COM',
        self::WEBSITE_CHEAPTICKET => 'CHEAPTICKET.IN',
        self::WEBSITE_CHEAPTICKET_LOCAL => 'LOCAL.CHEAPTICKET',
        self::WEBSITE_CHEAPTICKET_DEV => 'DEV.CHEAPTICKETS.CO.IN',
        self::WEBSITE_CHEAPTICKETS24_LOCAL => 'LOCAL.CHEAPTICKETS24',
        self::WEBSITE_CHEAPTICKETS24_DEV => 'DEV.CHEAPTICKETS24.COM',
        self::WEBSITE_CHEAPTICKETS24_LIVE => 'CHEAPTICKETS24.COM',
        self::WEBSITE_AIRTICKETS_LOCAL => 'LOCAL.AIRTICKETSINDIA',
        self::WEBSITE_AIRTICKETS_DEV => 'DEV.AIRTICKETSINDIA.COM',
    ];
    static $websiteURLMap = [
        self::WEBSITE_CHEAPTICKET => \Controller::B2C_BASE_URL,
        self::WEBSITE_CHEAPTICKET_LOCAL => \Controller::LOCAL_B2C_BASE_URL,
        self::WEBSITE_CHEAPTICKET_DEV => \Controller::DEV_B2C_BASE_URL,
        self::WEBSITE_CHEAPTICKETS24_LOCAL => \Controller::LOCAL_F2G_BASE_URL,
        self::WEBSITE_CHEAPTICKETS24_DEV => \Controller::DEV_F2G_BASE_URL,
        self::WEBSITE_CHEAPTICKETS24_LIVE => \Controller::F2G_BASE_URL,
        self::WEBSITE_AIRTICKETSINDIA => \Controller::ATI_B2C_BASE_URL,
        self::WEBSITE_AIRTICKETS_LOCAL => \Controller::LOCAL_ATI_B2C_BASE_URL,
        self::WEBSITE_AIRTICKETS_DEV => \Controller::DEV_ATI_B2C_BASE_URL,
    ];

    static function getWebsiteId() {
        $id = self::WEBSITE_BELAIR;
        $user_host_info = str_replace('www.', '', \Yii::app()->request->serverName);

        if ($user_host_info == B2C_CHEAPTICKET_SITE_LOCAL) {
            $id = self::WEBSITE_CHEAPTICKET_LOCAL;
        } else if ($user_host_info == B2C_CHEAPTICKET_SITE_DEV) {
            $id = self::WEBSITE_CHEAPTICKET_DEV;
        } else if ($user_host_info == B2C_CHEAPTICKET_SITE_LIVE) {
            $id = self::WEBSITE_CHEAPTICKET;
        } else if ($user_host_info == F2G_CHEAPTICKETS24_SITE_LOCAL) {
            $id = self::WEBSITE_CHEAPTICKETS24_LOCAL;
        } else if ($user_host_info == F2G_CHEAPTICKETS24_SITE_DEV) {
            $id = self::WEBSITE_CHEAPTICKETS24_DEV;
        } else if ($user_host_info == F2G_CHEAPTICKETS24_SITE_LIVE) {
            $id = self::WEBSITE_CHEAPTICKETS24_LIVE;
        } else if ($user_host_info == ATI_AIRTICKETSINDIA_SITE_LOCAL) {
            $id = self::WEBSITE_AIRTICKETS_LOCAL;
        } else if ($user_host_info == ATI_AIRTICKETSINDIA_SITE_DEV) {
            $id = self::WEBSITE_AIRTICKETS_DEV;
        } else if ($user_host_info == ATI_AIRTICKETSINDIA_SITE_LIVE) {
            $id = self::WEBSITE_AIRTICKETSINDIA;
        }
        return $id;
    }

    private $conv_fee = 0;
    
    /**
     * Purpose : WebsiteId was not getting set after deletion of fake cart
     * @return type
     */
    protected function beforeSave() {
        if (isset(\Yii::app()->request->serverName)) { //For safety on command prompt
            $website_id = self::getWebsiteId();
            if ($website_id !== self::WEBSITE_BELAIR) {
                $this->website_id = $website_id;
            }
        }
        return parent::beforeSave();
    }

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'air_cart';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('user_id, loged_user_id', 'required'),
            array('user_id, booking_status_id, loged_user_id, payment_status_id, promo_codes_id,website_id', 'numerical', 'integerOnly' => true),
            array('note, rules', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('user_id, booking_status_id, loged_user_id, payment_status_id, created, id, booking_type_id, approval_status_id, to_filter, from_filter, air_pnr_crs_pnr_ticket, traveler_id,queue_type, website_id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'bookingStatus' => array(self::BELONGS_TO, 'BookingStatus', 'booking_status_id'),
            'logedUser' => array(self::BELONGS_TO, 'Users', 'loged_user_id'),
            'user' => array(self::BELONGS_TO, 'Users', 'user_id'),
            'paymentStatus' => array(self::BELONGS_TO, 'PaymentStatus', 'payment_status_id'),
            'airBookings' => array(self::HAS_MANY, 'AirBooking', 'air_cart_id'),
            'approvalStatus' => array(self::BELONGS_TO, 'ApprovalStatus', 'approval_status_id'),
            'files' => array(self::HAS_MANY, 'AircartFile', 'aircart_id'),
            'payGateLogs' => [self::HAS_MANY, 'PayGateLog', 'air_cart_id'],
            'payments' => [self::HAS_MANY, 'Payment', 'air_cart_id'],
            'clientSource' => [self::BELONGS_TO, 'ClientSource', 'client_source_id'],
            'promoCode' => [self::BELONGS_TO, 'PromoCodes', 'promo_codes_id'],
            'cartLogs' => [self::HAS_MANY, 'CartStatusLog', 'air_cart_id'],
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'user_id' => 'User',
            'booking_status_id' => 'Booking Status',
            'loged_user_id' => 'Loged User',
            'payment_status_id' => 'Payment Status',
            'created' => 'Created',
            'note' => 'Cart notes, visible by staff members only',
            'rules' => 'Fare rules, visible by staff members only',
        );
    }

    /**
     * Get related files to the cart - Tony
     * @return array
     */
    function getRelatedFiles() {
        return \AircartFile::model()->with('aircart')->findAll('aircart.user_id = :user_id AND aircart.id <> :id AND t.aircart_id = aircart.id', [
                ':user_id' => $this->user_id,
                ':id' => $this->id
        ]);
    }

    /**
     * Get Email/Sms logs for the cart
     * @return array
     */
    function getEmailSmsLogs() {
        return \EmailSmsLog::model()->findAll('t.air_cart_id = :cart_id ', [
                ':cart_id' => $this->id
        ]);
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

        // Search only among the company data if the logged user is not Staff member
        if (!Authorization::getIsStaffLogged()) {
            $loggedUser = Users::model()->findByPk(Yii::app()->user->id);
            $criteria->with = array(
                'user' => ['joinType' => 'INNER JOIN'],
//                'airBookings' => ['joinType' => 'INNER JOIN'],
            );
            $criteria->compare('"user".user_info_id', $loggedUser->user_info_id);
        }

//        else {
//            $criteria->with = array('airBookings' => [
//                    'joinType' => 'INNER JOIN',
//                    'select' => false,
//                    'together' => true]);
//        }
        if (empty($this->queue_type)) {
            if (!empty($this->id)) {
                $criteria->compare('t.id', (int) $this->id);
            }
            if ($this->booking_status_id === null) {    // Hide New and Aborted carts by default
                $criteria->addNotInCondition('t.booking_status_id', [\BookingStatus::STATUS_NEW, \BookingStatus::STATUS_ABORTED]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'OR');
            } else {
                $criteria->compare('t.booking_status_id', $this->booking_status_id);
            }
            $criteria->compare('t.approval_status_id', $this->approval_status_id);
            $criteria->compare('t.payment_status_id', $this->payment_status_id);
            $criteria->compare('t.user_id', $this->user_id);
//          $criteria->addCondition('"airBookings".id is not null');
            $criteria->addCondition("t.id IN (SELECT air_cart_id from air_booking)");

            if (!empty($this->traveler_id)) {
                $criteria->addCondition("t.id IN (SELECT air_cart_id from air_booking
                    WHERE traveler_id = $this->traveler_id)");
            }

            if (!empty($this->booking_type_id)) {
                $criteria->addCondition("t.id IN (SELECT air_cart_id from air_booking
                    WHERE booking_type_id = $this->booking_type_id)");
            }

            if (!empty($this->to_filter)) {
                $criteria->addCondition("t.created - interval '1 day'< :toDate");
                $criteria->params += array('toDate' => date('Y-m-d 00:00:00', strtotime($this->to_filter)));
            }

            if (!empty($this->from_filter)) {
                $criteria->addCondition("t.created >= :fromDate");
                $criteria->params += array('fromDate' => date('Y-m-d 00:00:00', strtotime($this->from_filter)));
            }
        } else {
            if ($this->queue_type === 'pending') {
                $criteria->addInCondition('t.booking_status_id', [\BookingStatus::STATUS_NEW, \BookingStatus::STATUS_IN_PROCESS, \BookingStatus::STATUS_PARTIALLY_BOOKED, \BookingStatus::STATUS_TO_CANCEL, \BookingStatus::STATUS_HOLD]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
            } else if ($this->queue_type === 'booked') {
                $criteria->addInCondition('t.booking_status_id', [\BookingStatus::STATUS_BOOKED]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
                $criteria->addCondition("t.invoice_no IS NULL");
            } else if ($this->queue_type === 'billed') {
                $criteria->addInCondition('t.booking_status_id', [\BookingStatus::STATUS_BOOKED]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
                $criteria->addCondition("t.invoice_no IS NOT NULL");
            } else if ($this->queue_type === 'docsent') {
                $criteria->addInCondition('t.cart_status_id', [\CartStatus::CART_STATUS_ASK_DOCS]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
            } else if ($this->queue_type === 'docrecvd') {
                $criteria->addInCondition('t.cart_status_id', [\CartStatus::CART_STATUS_DOCS_RECEIVED]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
            } else if ($this->queue_type === 'farediffsent') {
                $criteria->addInCondition('t.cart_status_id', [\CartStatus::CART_STATUS_FARE_DIFF_SENT]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
            } else if ($this->queue_type === 'farediffrecvd') {
                $criteria->addInCondition('t.cart_status_id', [\CartStatus::CART_STATUS_FARE_DIFF_RECEIVED]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
            } else if ($this->queue_type === 'toamend') {
                $criteria->addInCondition('t.cart_status_id', [\CartStatus::CART_STATUS_TO_AMEND]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
            } else if ($this->queue_type === 'tocancel') {
                $criteria->addInCondition('t.cart_status_id', [\CartStatus::CART_STATUS_TO_CANCEL]);
                $criteria->addCondition("t.id IN (SELECT air_cart_id from payment)", 'AND');
            } else if ($this->queue_type === 'emailnotsent') {
                // Added by Satender
                // DO NOT Change
                $sql = "SELECT cart.id
                        FROM
                        (SELECT t.id,
                        e.id email_sms_log_id
                        FROM air_cart t
                        LEFT JOIN email_sms_log e ON e.air_cart_id=t.id
                        AND e.contact_type='" . \EmailSmsLog::CONTACT_TYPE_EMAIL . "'
                        AND e.content_type=" . \EmailSmsLog::CATEGORY_CONFIRMATION . "
                        WHERE t.booking_status_id=" . \BookingStatus::STATUS_BOOKED . " AND
                        t.created > '".self::EMAIL_NOT_SENT_BEYOND_DATE."') AS cart
                        WHERE cart.email_sms_log_id IS NULL
                        ORDER BY cart.id DESC";
                $command = \Yii::app()->db->createCommand($sql);
                $rows = $command->query();
                $carts = [];
                while (($row = $rows->read()) !== false) {
                    $carts[$row['id']] = $row['id'];
                }
                $criteria->addInCondition('t.id', $carts);
            }
        }
        $adp = new CActiveDataProvider($this, array(
            'criteria' => $criteria,
//            'sort' => ['defaultOrder' => ['created' => CSort::SORT_DESC]],
            'sort' => ['defaultOrder' => 't.id DESC'],
            'pagination' => ['pageSize' => 20]
        ));
//        Utils::dbgYiiLog($adp->criteria->condition);
        return $adp;
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return AirCart the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /**
     * Get the list of the phones used in booking of the air cart
     * @return string
     */
    function getBookingMobiles() {
        $phones = \Yii::app()->db->createCommand()->select("string_agg(DISTINCT traveler.phone, ', ')")->from('traveler')
            ->join('air_booking', 'air_booking.traveler_id=traveler.id')
            ->where('air_booking.air_cart_id=:air_cart_id AND traveler.phone IS NOT NULL', [':air_cart_id' => $this->id])
            ->queryRow(false);
        return $phones === null ? '' : $phones[0];
    }

    /**
     * Return the summary for the cart
     * @return string Summary
     */
    public function getSummary() {
        $airBookings = \AirBooking::model()->with('airRoutes')->findAll([
            'condition' => 'air_cart_id=:airCartId',
            'order' => '"airRoutes".departure_ts',
            'params' => [':airCartId' => $this->id]
        ]);
        $out = [];
        foreach ($airBookings as $airBooking) {
            if (empty($airBooking->airRoutes)) {
                continue;
            }
            $key = $airBooking->airRoutes[0]->carrier->code . "-" . $airBooking->airRoutes[0]->flight_number . " " .
                date('d-M', strtotime($airBooking->departure_ts));
            if (isset($out[$key])) {
                $out[$key] ++;
            } else {
                $out[$key] = 1;
            }
        }
        return str_replace(['=', '&', '+'], [' x', '<br>', ' '], http_build_query($out));
    }

    /**
     * Return the summary with details for the cart
     * @return string Summary
     */
    public function getSummaryWithDetails() {
        $out = '';
        foreach ($this->airBookings as $airBooking) {
            if (empty($airBooking->airRoutes)) {
                continue;
            }
            $out .= "<p style='margin-top:10px;'><strong>" . $airBooking->source->nameCode . "</strong><span style='color:#999999; font-size:12px;'> " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . "</span> <i class='fa fa-long-arrow-right fa-lg'></i><strong>  {$airBooking->destination->nameCode} </strong><span style='color:#999999; font-size:12px;'>" . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . PHP_EOL . "</span></p>";
        }
        return $out;
    }

    public function getSummaryWithDetailsNew() {
        $out = '';
        foreach ($this->airBookings as $airBooking) {
            if (empty($airBooking->airRoutes)) {
                continue;
            }
            $out .= "<tr>
            <td style='padding:10px; border-bottom:1px solid #dedede;'>
            <span style='color: #39f; font-weight:bold; font-size:14px; '>" .
                $airBooking->source->nameCode . "</span><span style='color: #8f8f8f; font-size: 13px;'>" . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . "</span>  <span style='color: #39f; font-weight:bold; font-size:14px; '> → </span><span style='color: #39f; font-weight:bold; font-size:14px; '> {$airBooking->destination->nameCode}</span><span style='color: #8f8f8f; font-size: 13px;'> " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . PHP_EOL . "</span></td></tr>";
        }
        return $out;
    }

    /**
     * Return the summary for SMS with details for the cart
     * @return string Summary
     */
    public function getSummaryWithDetailsForSms() {
        $out = '';
        foreach ($this->airBookings as $airBooking) {
            if (empty($airBooking->airRoutes)) {
                continue;
            }
            $out .= "PNR: {$airBooking->airline_pnr}. " . $airBooking->source->airport_code . " " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " - {$airBooking->destination->airport_code} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . ". ";
        }
        return $out;
    }

    /**
     * Return Logo Path as per website URL
     */
    public function getSiteCreds() {

        $siteCreds = [];
        if (isset($this->website_id)) {
            if ($this->website_id == self::WEBSITE_CHEAPTICKETS24_LIVE || $this->website_id == self:: WEBSITE_CHEAPTICKETS24_LOCAL || $this->website_id == self::WEBSITE_CHEAPTICKETS24_DEV) {
                $siteCreds['sitelogo'] = '<img src="' . \Yii::app()->request->hostInfo . '/themes/F2G/dev/img/logo.png" width="183" height="38">';
                $siteCreds['siteName'] = "cheaptickets24.com";
                $siteCreds['CompanyName'] = "CheapTickets24";
                $siteCreds['senderEmail'] = \Users::F2G_SENDER_EMAIL;
                $siteCreds['senderName'] = \Users::F2G_SENDER_NAME;
                $siteCreds['RecipentEmail'] = \Users::F2G_RECEPIENT_EMAIL;
                $siteCreds['Baseurl'] = \Controller::F2G_BASE_URL;
                $siteCreds['displaySiteName'] = "CheapTickets24.com";
                $siteCreds['footerPromotionalImage'] = '<img src="' . \Yii::app()->request->hostInfo . '/themes/B2C/dev/img/image_attached_with_email.png" margin-top:20px>';
            } else if ($this->website_id == self::WEBSITE_CHEAPTICKET || $this->website_id == self::WEBSITE_CHEAPTICKET_LOCAL || $this->website_id == self::WEBSITE_CHEAPTICKET_DEV) {
                $siteCreds['sitelogo'] = '<img src="' . \Yii::app()->request->hostInfo . '/themes/B2C/dev/img/logo.png" width="183" height="38">';
                $siteCreds['siteName'] = "CheapTicket.in";
                $siteCreds['CompanyName'] = "CheapTicket";
                $siteCreds['senderEmail'] = \Users::B2C_SENDER_EMAIL;
                $siteCreds['senderName'] = \Users::B2C_SENDER_NAME;
                $siteCreds['RecipentEmail'] = \Users::B2C_RECEPIENT_EMAIL;
                $siteCreds['Baseurl'] = \Controller::B2C_BASE_URL;
                $siteCreds['displaySiteName'] = "CheapTicket.in";
                $siteCreds['footerPromotionalImage'] = '<img src="' . \Yii::app()->request->hostInfo . '/themes/B2C/dev/img/image_attached_with_email.png"  margin-top:20px>';
            } else if ($this->website_id == self::WEBSITE_AIRTICKETSINDIA || $this->website_id == self::WEBSITE_AIRTICKETS_DEV || $this->website_id == self::WEBSITE_AIRTICKETS_LOCAL) {
                $siteCreds['sitelogo'] = '<img src="' . \Yii::app()->request->hostInfo . '/themes/ATI/dev/img/logo.png" width="183" height="38">';
                $siteCreds['siteName'] = "Airtcketindia.com";
                $siteCreds['CompanyName'] = "Airticketsindia";
                $siteCreds['senderEmail'] = \Users::ATI_B2C_SENDER_EMAIL;
                $siteCreds['senderName'] = \Users::ATI_B2C_SENDER_NAME;
                $siteCreds['RecipentEmail'] = \Users::ATI_B2C_RECEPIENT_EMAIL;
                $siteCreds['Baseurl'] = \Controller::ATI_B2C_BASE_URL;
                $siteCreds['displaySiteName'] = "AirtcketsIndia.com";
                $siteCreds['footerPromotionalImage'] = '<img src="' . \Yii::app()->request->hostInfo . '/themes/B2C/dev/img/image_attached_with_email.png"  margin-top:20px>';
            }
        }
        $usersSiteCreds = \Users::siteCreds();
        $siteCreds['sitecreds'] = $usersSiteCreds;

        //\Utils::dbgYiiLog($siteCreds);
        return $siteCreds;
    }

    /**
     * Return the summary for email with details for the cart
     * @return string Summary
     */
    public function getSummaryWithDetailsforEmail() {
        $getSite = $this->getSiteCreds();
        $i = $this;


        $id = $i->attributes['id'];
        $details['id'] = $id;
        $details['created'] = $i->attributes['created'];
        $details['totalAmount'] = $i->totalAmount();
        /* $details['booking_status'] = $i->attributes['booking_status_id']; */
        $details['booking_status'] = 'PENDING';
        $first = true;
        $lastDeparture = null;
        $pnr = 'airline_pnr';
        $upcomingflag = 'false';
        $conv_fee = 0;
        foreach ($i->airBookings as $value) {
            if ($first) {
                $details['returndate'] = $value->getReturnDate();
                $details['isMultiCity'] = $value->isMultiCity();
                $details['curency'] = $value->airSource->currency->code;
                $lastDeparture = $value->attributes['departure_ts'];
                if (empty($value->attributes[$pnr]))
                    $pnr = 'crs_pnr';
                $first = false;
            } else {
                $conv_fee = $this->convenienceFee;
            }
            //deatils[source_destination]
            $segmentkey = $value->attributes['source_id'] . '_' . $value->attributes['destination_id'];
            $details['bookings'][$segmentkey]['id'] = $value->attributes['id'];
            $details['bookings'][$segmentkey]['source_id'] = $value->attributes['source_id'];
            $details['bookings'][$segmentkey]['destination_id'] = $value->attributes['destination_id'];
            $details['bookings'][$segmentkey]['source'] = $value->source->nameCode;
            $details['bookings'][$segmentkey]['carriername'] = $value->carrier->name;
            $details['bookings'][$segmentkey]['carriercode'] = $value->carrier->code;
            $details['bookings'][$segmentkey]['destination'] = $value->destination->nameCode;
            $details['bookings'][$segmentkey]['departure'] = $value->attributes['departure_ts'];
            $details['bookings'][$segmentkey]['arrival'] = $value->attributes['arrival_ts'];
            $details['bookings'][$segmentkey]['fareType'] = $value->fareType->name;
            if (isset($value->cabinType->attributes['name']))
                $details['bookings'][$segmentkey]['cabinType'] = $value->cabinType->attributes['name'];
            else
                $details['bookings'][$segmentkey]['cabinType'] = 'Economy';

            $dep = new \DateTime($value->attributes['departure_ts']);
            $today = new \DateTime('today');

            if ($dep > $today) {
                $details['bookings'][$segmentkey]['upcoming'] = 'true';
                $upcomingflag = 'true';
            } else {
                $details['bookings'][$segmentkey]['upcoming'] = 'false';
            }
            $diff = date_diff(new \DateTime($value->attributes['arrival_ts']), new \DateTime($value->attributes['departure_ts']));
            $duration = $diff->h . 'h ' . $diff->i . 'm';
            $details['bookings'][$segmentkey]['flighttime'] = $duration;
            $travelerId = $value->attributes['traveler_id'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['id'] = $value->traveler->id;
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['bookingid'] = $value->attributes['id'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['type'] = $value->travelerType->attributes['name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['title'] = $value->traveler->travelerTitle->attributes['name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['first_name'] = $value->traveler->attributes['first_name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['last_name'] = $value->traveler->attributes['last_name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['airline_pnr'] = $value->attributes['airline_pnr'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['crs_pnr'] = $value->attributes['crs_pnr'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['ticket'] = $value->attributes['ticket_number'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['booking_class'] = $value->attributes['booking_class'];

            if (!empty($value->attributes['cabin_type_id']))
                $details['bookings'][$segmentkey]['traveller'][$travelerId]['cabin'] = $value->cabinType->attributes['name'];

            $details['bookings'][$segmentkey]['traveller'][$travelerId]['faretype'] = $value->fareType->attributes['name'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['basicfare'] = $value->attributes['basic_fare'];
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['taxes'] = $value->getTaxesOnly();
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['total'] = (double) $value->getTotalAmount() - (double) $conv_fee;
            $details['bookings'][$segmentkey]['traveller'][$travelerId]['status'] = $value->abStatus->attributes['id'];

            foreach ($value->airRoutes as $airroute) {
                $details['bookings'][$segmentkey]['traveller'][$travelerId]['routes'][] = $airroute->getDetails();
            }

            if (!isset($details['bookings'][$segmentkey]['routes'])) {
                foreach ($value->airRoutes as $airroute) {
                    $details['bookings'][$segmentkey]['routes'][] = $airroute->getDetails();
                }
            }
            $bookingid = $value->attributes['id'];
        }
        $details['upcoming'] = $upcomingflag;

        $content = '';
        usort($details['bookings'], 'self::sortByOrder');
        foreach ($details['bookings'] as $airBooking) {
            if (!isset($airBooking['routes'])) {
                continue;
            }
            // $out .= $airBooking->source->nameCode . " " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " --> {$airBooking->destination->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . PHP_EOL;
            $stop = 'Non-Stop';
            if (sizeof($airBooking['routes']) > 1)
                $stop = (sizeof($airBooking['routes']) - 1) . ' Stop';

            $content .= '     <tr>
            <td colspan="2">
            <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #2a6ebb">
            <tbody>
            <tr>
            <td height="10"></td>
            </tr>
            <tr>
            <td> </td>
            </tr>
            <tr>
            <td style="border-bottom:1px solid #2a6ebb">
            <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tbody>
            <tr>
            <td width="16.43%" align="center" style="border-right:1px solid #2a6ebb">
            <img src=""
            class="CToWUd" />
            <br />
            <span style="font-family:arial;font-size:11px;color:#000000;font-weight:normal">' . $airBooking['carriername'] . '</span>
            <br />
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:bold">' . $airBooking['carriercode'] . '-' . $airBooking['routes'][0]['flightNumber'] . '</span>
            <br />
            <span style="font-family:arial;font-size:10px;font-weight:normal;color:#252c86;font-style:oblique"></span>
            </td>
            <td style="padding-left:12px">
            <table width="100%" cellspacing="0" cellpadding="0" border="0">
            <tbody>
            <tr>
            <td>
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal;font-style:italic">
            Departure</span>
            <br />
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:bold">' . $airBooking['source'] . '
            </span>
            <br />
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">' . date(TICKET_DATETIME_FORMAT, strtotime($airBooking['departure'])) . '</span>
            </td>
            <td>
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal;font-style:italic">
            Arrival</span>
            <br />
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:bold">' . $airBooking['destination'] . '
            <span style="font-weight:normal">' . $airBooking['routes'][0]['originTerminal'] . '</span></span> 
            <br />
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">' . date(TICKET_DATETIME_FORMAT, strtotime($airBooking['arrival'])) . '</span>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            <td width="25.57%" style="border-left:1px solid #2a6ebb;padding-left:15px">
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">' . $stop . ' Flight</span>
            <br />
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">Duration: ' . $airBooking['flighttime'] . '</span>
            <br />
            <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">Cabin:' . $airBooking['cabinType'] . '</span>
            </td>
            </tr>
            <tr>
            <td height="10" colspan="3"></td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            <tr>
            <td>
            <table width="92.86%" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
            <tr>
            <td width="20%" height="33"
            style="font-family:arial;font-size:12px;color:#000000;font-weight:bold;border-bottom:1px solid #2a6ebb">
            Passenger Name</td>
            <td width="20%"
            style="font-family:arial;font-size:12px;color:#000000;font-weight:bold;border-bottom:1px solid #2a6ebb">
            Type</td>
            <td width="20%"
            style="font-family:arial;font-size:12px;color:#000000;font-weight:bold;border-bottom:1px solid #2a6ebb">
            CRS PNR</td>
            <td width="20%"
            style="font-family:arial;font-size:12px;color:#000000;font-weight:bold;border-bottom:1px solid #2a6ebb">
            Airline PNR</td>
            <td width="20%"
            style="font-family:arial;font-size:12px;color:#000000;font-weight:bold;border-bottom:1px solid #2a6ebb">
            E-Ticket Number</td>
            </tr>';
            foreach ($airBooking['traveller'] as $traveler) {
                $content .= '<tr>
                <td height="24"
                style="font-family:arial;font-size:12px;color:#000000;font-weight:normal;text-transform:capitalize">
                ' . $traveler['first_name'] . ' ' . $traveler['last_name'] . '</td>
                <td height="24" style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">' . $traveler['type'] . '</td>
                <td height="24" style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">' . $traveler['crs_pnr'] . '</td>
                <td height="24" style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">' . $traveler['airline_pnr'] . '</td>
                <td height="24" style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">
                ' . $traveler['ticket'] . '</td>
                </tr>';
            }
            $content .= '<tr>
            <td height="5" colspan="4"></td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>';
        }
        return $content;
    }

    static public function sortByOrder($a, $b) {
        //\Utils::dbgYiiLog($a);
        $depa = new \DateTime($a['departure']);
        $depb = new \DateTime($b['departure']);
        if ($depa > $depb)
            return 1;
        else
            return -1;
    }

    /**
     * Return the sector for the cart, like DEL-BOM
     * @return string The sector
     */
    public function getSector() {
        $airBookings = \AirBooking::model()->findAll([
            'condition' => 'air_cart_id=:airCartId',
            'order' => 'departure_ts',
            'params' => [':airCartId' => $this->id]
        ]);
        foreach ($airBookings as $airBooking) {
            if (empty($airBooking->airRoutes)) {
                continue;
            }
            if ($airBooking->getReturnDate()) { // 2 way trip
                return "{$airBooking->source->airport_code}-{$airBooking->destination->airport_code}-{$airBooking->source->airport_code}";
            } else {    // One way trip
                return "{$airBooking->source->airport_code}-{$airBooking->destination->airport_code}";
            }
        }
    }

    /**
     * Decide and change the booking status of the cart based on the ABstatuses of the AirBooking inside the cart
     * In Progress, Booked and Aborted statuses are decided automatically
     */
    public function decideBookingStatus() {
        $stat = array();
        foreach ($this->airBookings as $airBooking) {
            if (isset($stat[$airBooking->ab_status_id])) {
                $stat[$airBooking->ab_status_id] ++;
            } else {
                $stat[$airBooking->ab_status_id] = 1;
            }
        }

        if (isset($stat[AbStatus::STATUS_IN_PROCESS]) || isset($stat[AbStatus::STATUS_TO_AMEND])) {
            $this->booking_status_id = BookingStatus::STATUS_IN_PROCESS;
            if (isset($stat[AbStatus::STATUS_TO_AMEND])) {
                $this->cart_status_id = \CartStatus::CART_STATUS_TO_AMEND;
                \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_IN_PROCESS, \CartStatus::CART_STATUS_TO_AMEND);
            } else {
                $this->cart_status_id = \CartStatus::CART_STATUS_IN_PROCESS;
                \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_IN_PROCESS, \CartStatus::CART_STATUS_IN_PROCESS);
            }
        }
        // Both statuses are present - partial case
        elseif (isset($stat[AbStatus::STATUS_OK]) && isset($stat[AbStatus::STATUS_CANCELLED])) {
            $this->booking_status_id = BookingStatus::STATUS_PARTIALLY_BOOKED;
            $this->cart_status_id = \CartStatus::CART_STATUS_BOOKED;
            \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_PARTIALLY_BOOKED, \CartStatus::CART_STATUS_BOOKED);
        }
        // All is OK - this is the only status
        elseif (isset($stat[AbStatus::STATUS_OK])) {
            $this->booking_status_id = BookingStatus::STATUS_BOOKED;
            $this->cart_status_id = \CartStatus::CART_STATUS_BOOKED;
            \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_BOOKED, \CartStatus::CART_STATUS_BOOKED);
        }
        // All is Cancelled - this is the only status - Abort this cart
        elseif (isset($stat[AbStatus::STATUS_CANCELLED])) {
            $this->booking_status_id = BookingStatus::STATUS_CANCELLED;
            $this->cart_status_id = \CartStatus::CART_STATUS_CANCELLED;
            \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_CANCELLED, \CartStatus::CART_STATUS_CANCELLED);
        }

        $this->save(false);
    }

    /**
     * Sets the booking status of the cart according to the rules:<br>
     * status 8-Booked if all the ticket numbers for all segments for all passengers are in the PNR<br>
     * status 7-Partially booked if only some ticket numbers are present<br>
     * status 2-In Process if no ticket number is present<br>
     * @param bool $quiet Should we keep quiet and not send emails and SMSes
     */
    public function setBookingStatus($quiet = false) {
        $this->refresh();
        // Do not process carts that are marked as fraud
        if ($this->booking_status_id === BookingStatus::STATUS_FRAUD) {
            return;
        }
        $allTicketsArePresent = true;
        $someTicketsArePresent = false;
        $somePnrsArePresent = false;
        $initialAirCartBookingStatus = $this->booking_status_id;
        $isAmendPresent = false;
        foreach ($this->airBookings as $airBooking) {
//            if (empty($airBooking->ticket_number) || $airBooking->ticket_number == 'N/A') {
            if (empty($airBooking->ticket_number)) {
                $allTicketsArePresent = false;  // We have air booking without ticket
                $airBooking->ab_status_id = AbStatus::STATUS_IN_PROCESS;
            } else {
                $someTicketsArePresent = true;  // We have air booking with ticket
                $airBooking->ab_status_id = AbStatus::STATUS_OK;
            }
            $airBooking->update(['ab_status_id']);
            if ($airBooking->crs_pnr !== \ApiInterface::FAKE_PNR || $airBooking->airline_pnr !== \ApiInterface::FAKE_PNR) {
                $somePnrsArePresent = true;
            }
            //check if amend is pending
            if ($airBooking->ab_status_id === \AbStatus::STATUS_TO_AMEND) {
                $isAmendPresent = true;
            }
        }

        if ($allTicketsArePresent) {
            $this->booking_status_id = BookingStatus::STATUS_BOOKED;
            $this->cart_status_id = \CartStatus::CART_STATUS_BOOKED;
            \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_BOOKED, \CartStatus::CART_STATUS_BOOKED);
        } elseif ($someTicketsArePresent) {
            $this->booking_status_id = BookingStatus::STATUS_PARTIALLY_BOOKED;
            $this->cart_status_id = \CartStatus::CART_STATUS_IN_PROCESS;
            \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_PARTIALLY_BOOKED, \CartStatus::CART_STATUS_IN_PROCESS);
        } elseif ($somePnrsArePresent || !empty($this->payments)) {
            $this->booking_status_id = BookingStatus::STATUS_IN_PROCESS;
            if ($isAmendPresent) {
                $this->cart_status_id = \CartStatus::CART_STATUS_TO_AMEND;
                \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_IN_PROCESS, \CartStatus::CART_STATUS_TO_AMEND);
            } else {
                $this->cart_status_id = \CartStatus::CART_STATUS_IN_PROCESS;
                \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_IN_PROCESS, \CartStatus::CART_STATUS_IN_PROCESS);
            }
        }
        if ($this->areAllAirBookingsToBeCancelled()) {
            $this->booking_status_id = BookingStatus::STATUS_TO_CANCEL;
            $this->cart_status_id = \CartStatus::CART_STATUS_TO_CANCEL;
            \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_TO_CANCEL, \CartStatus::CART_STATUS_TO_CANCEL);
        }
        $this->update(['booking_status_id', 'cart_status_id']);

        //Apply PromoCode
        $this->applyPromoCode();

        // Send email & charge when booking status transition to Booked
        if ($initialAirCartBookingStatus !== \BookingStatus::STATUS_BOOKED &&
            $this->booking_status_id === \BookingStatus::STATUS_BOOKED) {

            // Charge the cart
            $this->registerPayment();

            // Auto capture all uncaptured transactions for the cart
            $this->autoCapture();
            $this->refresh();

            //if promo code is referral type then give money to referral person
            $this->payReferredPromoAmount();

            // Shell we send emails
            if (!$quiet) {
                // $this->sendBookedEmail();
                if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
                    $this->sendBookedEmailforB2C();
                } else {
                    $this->sendBookedEmailforOther();
                }
                $this->sendConfirmationSMS();
            }
            if ($this->checkClaim() !== false) {
                $this->unClaim();
            }
        }
    }

    function cancel() {
        $this->booking_status_id = BookingStatus::STATUS_CANCELLED;
        $this->save(false, ['booking_status_id']);

        foreach ($this->airBookings as $airBooking) {
            $airBooking->ab_status_id = AbStatus::STATUS_CANCELLED;
            $airBooking->save(false, ['ab_status_id']);
        }
        \CartStatusLog::push_cart_status_log($this->id, BookingStatus::STATUS_CANCELLED, \CartStatus::CART_STATUS_CANCELLED);
    }

    /**
     * Cancell the PNR at the air Source
     * @return stdClass the reply from the cancellation request from air source API
     */
    function cancelAtTheAirSource() {
        if (empty($this->airBookings) || empty($this->airBookings[0]->airSource->backend->pnr_cancel)) {
            return ['error' => 'This provider do not have automatic cancel capability'];
        } else {
            $result = call_user_func($this->airBookings[0]->airSource->backend->pnr_cancel, $this->id);

            return $result;
        }
    }

    function areAllAirBookingsToBeCancelled() {
        foreach ($this->airBookings as $airBooking) {
            if ($airBooking->ab_status_id != AbStatus::STATUS_TO_CANCELL) {
                return false;
            }
        }
        return true;
    }

    /**
     * Set the order of the air routes and assign the origin and destination for the airBooking
     */
    function setAirBookingsAndAirRoutesOrder() {
        foreach ($this->airBookings as $airBooking) {
            $airBooking->setAirRoutesOrder();
        }
    }

    /**
     * Summarize all the AirBooking total amounts for the cart
     * @return float
     */
    function totalAmount() {
        $sum = 0;
        $first = true;
        foreach ($this->airBookings as $airBooking) {
            $sum += $airBooking->getTotalAmountToPay();
            if (!$first) {
                $sum -= $this->convenienceFee;
            }
            $first = false;
        }
        return $sum - $this->getPromoDiscount();
    }

    function getTotalCommercialNetEffect() {
        $sum = 0;
        foreach ($this->airBookings as $airBooking) {
            $sum += $airBooking->commercial_total_efect;
        }
        return $sum;
    }

    function getTotalCommission() {
        $sum = 0;
        foreach ($this->airBookings as $airBooking) {
            $sum += $airBooking->profit;
        }
        return $sum;
    }

    /**
     * Apply the commerscial rule to each AirBooking element
     * Use individual plan if existing
     * Use B2C plan for B2C clients
     */
    function applyCommercialRule() {
        $commercialPlan = false;
        if ($this->user->userInfo->commercial_plan_id !== null) {
            $commercialPlan = $this->user->userInfo->commercialPlan;
        } elseif ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
            $commercialPlan = \CommercialPlan::findB2cPlan();
        }
        if ($commercialPlan) {
            foreach ($this->airBookings as $airBooking) {
                $commercialPlan->applyPlan($airBooking, $this->client_source_id);
            }
        }
    }

    /**
     * Application of both rules in the correct order.
     */
    function applyBothRules() {
        $this->applyCommissionRule();
        $this->applyCommercialRule();
    }

    /**
     * Calculate the commission for each AirBooking element
     */
    function applyCommissionRule() {
        foreach ($this->airBookings as $airBooking) {
            $airBooking->calcCommission();
        }
    }

    /**
     * Register new payment for the cart and deduct the balance
     * @return bool|string True if payment is registered or error message
     */
    function registerPayment() {
        if (empty($this->airBookings)) {
            return "This cart has no bookings and can not be charged";
        }
        if ($this->payment_status_id == \PaymentStatus::STATUS_CHARGED) {
            return "This cart is already charged";
        }
        $userInfo = $this->user->userInfo;
        $cartTotalAmountInAccountingCurrency = $this->airBookings[0]->airSource->currency->xChange($this->totalAmount(), $userInfo->currency_id);
        // Enough money check
        $moneyNeeded = $cartTotalAmountInAccountingCurrency - $userInfo->availability;
        if ($moneyNeeded > 0) {
            return "The available balance plus the available credit limit is not enough. You need {$userInfo->currency->code} <b>$moneyNeeded</b> more.";
        }

        $payment = new \Payment;
        $payment->amount = $cartTotalAmountInAccountingCurrency;
        $payment->xchange_rate = $cartTotalAmountInAccountingCurrency / ($this->totalAmount() != 0 ? $this->totalAmount() : 1 );

        $payment->tds = round($payment->amount * $userInfo->tds / 100, 2);   // 10% tds
        $payment->service_tax = round($payment->amount * \Utils::SERVICE_TAX, 2); // 4.95% service tax
        $payment->old_balance = $userInfo->balance;
        $payment->new_balance = $payment->old_balance - $payment->amount;
        $userInfo->balance = $payment->new_balance;
        if ($userInfo->one_time_limit == 1 && $userInfo->balance < 0 && $payment->amount > 0) { // Fix the credit limit in case of one time
            $userInfo->credit_limit = $userInfo->credit_limit + $userInfo->balance;
            if ($userInfo->credit_limit < 0) {
                $userInfo->credit_limit = 0;
            }
        }
        $userInfo->update();
        $loggedUser = \Utils::getLoggedUserId();
        $activeUser = \Utils::getActiveUserId();
        if (Authorization::getIsStaffLogged()) {
            $payment->user_id = $userInfo->users[0]->id;
        } else {
            $payment->user_id = $activeUser ? : $userInfo->users[0]->id;
        }
        $payment->loged_user_id = $loggedUser;
        $payment->transfer_type_id = TransferType::BOOKING;
        $payment->note = "Booking of Air cart № $this->id";
        $payment->air_cart_id = $this->id;

        $payment->insert();
        $this->payment_status_id = \PaymentStatus::STATUS_CHARGED;
        $this->update(['payment_status_id']);

        return true;
    }

    /**
     * Make Payment to person who referred Promo code
     */
    function payReferredPromoAmount() {

        if (isset($this->promoCode->promo_type_id) && $this->promoCode->promo_type_id === \PromoType::REFERAL_TYPE) {
            $promolog = $this->getPromoLog();
            if (isset($promolog->is_referred_paid) && $promolog->is_referred_paid === 0) {
                // Create new payment
                $payment = new Payment;
                $userInfo = $this->promoCode->refUserInfo;
                $value = isset($this->promoCode->ref_value) ? $this->promoCode->ref_value : 0;

                if ($this->promoCode->ref_value_type_id === \PromoDiscountType::FIXED) {
                    $payment->amount = round($value);
                } else if ($this->promoCode->ref_value_type_id === \PromoDiscountType::PERCENTAGE) {
                    $payment->amount = isset($this->promoCode->ref_value) ? $this->totalAmount() * ((double) $this->promoCode->ref_value) / 100 : 0;

                    if (isset($this->promoCode->ref_max_value) && $payment->amount > $this->promoCode->ref_max_value)
                        $payment->amount = $this->promoCode->ref_max_value;
                }

                //$payment->currency_id = $userInfo->currency_id;
                $payment->old_balance = $userInfo->balance;
                // Add the amount
                $payment->new_balance = $payment->old_balance + $payment->amount;
                // Send payment confirmation email
                // $this->sendPaymentReceivedEmail();
                $userInfo->balance = $payment->new_balance;
                $userInfo->update(['balance']);
                $loggedUser = \Utils::getLoggedUserId();
                $activeUser = \Utils::getActiveUserId();
                $payment->user_id = $userInfo->users[0]->id;
                $payment->loged_user_id = $loggedUser ? : $userInfo->users[0]->id;
                $payment->transfer_type_id = \TransferType::PROMO_REFERRED;
                $payment->note = 'Promo referral amount ' . $payment->amount . 'added in userinfo id=' . $userInfo->id;
                $payment->insert();
                $promolog->is_referred_paid = 1;
                $promolog->update(['is_referred_paid']);
            }
        }
    }

    function addNote($note) {
        $notes = $this->getNotes();
        $user = \Users::model()->findByPk(Utils::getLoggedUserId());
        $userName = empty($user) ? 'Admin' : $user->name;
        $notes[$userName . " " . date(DATETIME_FORMAT)] = htmlentities($note);
        $this->note = json_encode($notes);
        $this->update(['note']);
    }

    function getNotes() {
        $out = json_decode($this->note, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            if (YII_DEBUG) {
                \Utils::dbgYiiLog([
                    'Json decode error' => json_last_error_msg(),
                    'Content' => $this->note,
                ]);
            }
            $out = [$this->logedUser->name . " " . \Utils::cutSecondsAndMilliseconds($this->created) => $this->note];
            $this->note = json_encode($out);
            $this->update(['note']);
        }
        return is_array($out) ? $out : [];
    }

    /**
     * Mark the transactions as fraud or not depending on the $flag <br>
     * In case of fraud also mark the related bookings as fraud
     * @param bool $flag When true the transactions are marked as fraud, when false the fraud mark is removed
     */
    function fraud($flag = true) {
        foreach ($this->payGateLogs as $pgl) {
            $pgl->fraudSet($flag);
        }
        if ($flag) {
            $this->booking_status_id = \BookingStatus::STATUS_FRAUD;
            $this->update(['booking_status_id']);

            // Mark the related carts as fraud
            foreach ($this->getRelatedBookings() as $airCart) {
                $airCart->booking_status_id = \BookingStatus::STATUS_FRAUD;
                $airCart->update(['booking_status_id']);
                foreach ($airCart->payGateLogs as $pgl) {
                    $pgl->fraudSet($flag);
                }
            }
            $this->addNote("Cart Added to Fraud");
        } elseif ($this->booking_status_id === \BookingStatus::STATUS_FRAUD) {
            $this->booking_status_id = \BookingStatus::STATUS_IN_PROCESS;
            $this->update(['booking_status_id']);
            $this->setBookingStatus(true);
            $this->addNote("Cart removed from Fraud");
        }
    }

    /**
     * Get array with related bookings
     * @return AirCart[] Array of the related bookings
     */
    function getRelatedBookings() {
        $IPs = $this->getUserIPs();
        $CCs = $this->getUserCCs();
        $out = self::model()->findAllBySql("SELECT air_cart.* FROM air_cart "
            . "JOIN users on (users.id=air_cart.user_id) AND air_cart.id <> $this->id "
            . "JOIN user_info on (users.user_info_id=user_info.id) AND (user_info.email = :email OR user_info.mobile = :mobile) "
            . "WHERE  air_cart.id IN
            (
                SELECT ac.id FROM pay_gate_log
                JOIN air_cart ac ON (pay_gate_log.air_cart_id=ac.id) AND pay_gate_log.cc_id IS NOT NULL
                WHERE pay_gate_log.user_ip IN ('" . implode("', '", empty($IPs) ? [0] : $IPs) . "') OR pay_gate_log.cc_id IN (" . implode(", ", empty($CCs) ? [0] : $CCs) . ")
                )
        "
            . "OR user_info.id is not null "
            . "ORDER BY air_cart.id DESC LIMIT 50;", [
            ':email' => $this->user->userInfo->email,
            ':mobile' => $this->user->userInfo->mobile,
        ]);

        return $out;
    }

    /**
     * Return array of user IPs used in CC transactions for this card
     * @return array
     */
    function getUserIPs() {
        $out = [];
        foreach ($this->payGateLogs as $transaction) {
            if (empty($transaction->cc_id)) {
                continue;
            }
            $out[$transaction->user_ip] = 1;
        }
        return array_keys($out);
    }

    /**
     * Return array of user CCs used in transactions for this card
     * @return array
     */
    function getUserCCs() {
        $out = [];
        foreach ($this->payGateLogs as $transaction) {
            if (empty($transaction->cc_id)) {
                continue;
            }
            $out[$transaction->cc_id] = 1;
        }
        return array_keys($out);
    }

    /**
     * Get the Travelers names - comma delimited
     * @return string Pax names
     */
    function getPaxNames() {
        $out = [];
        foreach ($this->airBookings as $airBooking) {
            $tmp = strtoupper($airBooking->traveler->first_name . ' ' . $airBooking->traveler->last_name);
            $out[$tmp] = $tmp;
        }
        return implode(', ', $out);
    }

    /*
      Cancellation Email Structure
     */

    function cancellationMailInfo() {
        $airBookings = AirBooking::model()->with([
                'airRoutes' => ['order' => '"airRoutes".departure_ts']
            ])->findAll([
            'order' => 't.departure_ts, traveler_id', 'condition' => 'air_cart_id=' . $this->id]);

        $sectors = [];
        $first = true;
        $mailconTentHead = '';
        foreach ($airBookings as $booking) {

            if (!isset($sectors[$booking->source->airport_code][$booking->destination->airport_code])) {
                $sectors[$booking->source->airport_code][$booking->destination->airport_code] = 'set';


                $mailconTentHead = $mailconTentHead . "<tr style='margin-left:20px;' id='" . $booking->id . "' value='' >
                    <td colspan='5' class='heading' style='padding:10px; background:#fef8b8;'>" . $booking->source->airport_code . ' - ' . $booking->destination->airport_code . " - <span style='color: #8f8f8f; font-size: 13px;'> " . date(TICKET_DATETIME_FORMAT, strtotime($booking->departure_ts)) . "</span></td>
                    </tr>
                    <tr>
                    <td style='font-weight:600; padding:10px;'>NAME</td>
                    <td style='font-weight:600; padding:10px;'>CRS PNR</td>
                    <td style='font-weight:600; padding:10px;'> AIRLINE PNR</td>
                    <td style='font-weight:600; padding:10px;'>TICKET NO</td>
                    <td style='font-weight:600; padding:10px;'>STATUS</td>
                    </tr>
                    <tr>
                    <td colspan='5' height='1' style='border-bottom:3px solid #ddd'></td>
                    </tr>";
            }

            $mailconTentHead .= "<tr>
                <td style='padding:10px;'>" . $booking->traveler->first_name . ' ' . $booking->traveler->last_name . "</td>
                <td style='padding:10px;'>" . $booking->crs_pnr . "</td>
                <td style='padding:10px;'>" . $booking->airline_pnr . "</td>
                <td style='padding:10px;'>" . $booking->ticket_number . "</td>
                <td style='padding:10px;'>" . $booking->abStatus->name . "</td>
                </tr>";
            $mailconTentHead .= "<tr>
                <td colspan='5' height='1' style='border-bottom:1px solid #ddd'></td>
                </tr>";
        }
        return $mailconTentHead;
    }

    /**
     * Pretty formatting of the parameters
     * @return array
     */
    function pretty() {
        return [
            'id' => $this->id,
            'cartUrl' => \Yii::app()->request->hostInfo . '/airCart/' . $this->id,
            'created' => $this->created,
            'bookingStatus' => $this->bookingStatus->name,
            'paymentStatus' => $this->paymentStatus->name,
//            'summary' => $this->getSummaryWithDetails(),
            'note' => $this->note,
        ];
    }

    /**
     * Merge the given array of air carts into the air cart object<br>
     * Note that after the merge all the given air carts are deleted from the database
     * @param AirCart[] $airCarts
     */
    function mergeCarts(array $airCarts) {
        $currentUserId = $this->user->user_info_id;

        foreach ($airCarts as $airCart) {

            // Skip the elements that are not instances of the AirCart class OR is the same airCart as the current one OR do not belong to the same company (client)
            if (!($airCart instanceof AirCart) ||
                $airCart->id == $this->id ||
                $airCart->user->user_info_id != $currentUserId) {
                continue;
            }

            // Move the airBookings to this cart
            \AirBooking::model()->updateAll(['air_cart_id' => $this->id], 'air_cart_id=:airCartId', [':airCartId' => $airCart->id]);
            // Move the payments to this cart
            \Payment::model()->updateAll(['air_cart_id' => $this->id], 'air_cart_id=:airCartId', [':airCartId' => $airCart->id]);
            // Move the transactions to this cart
            \PayGateLog::model()->updateAll(['air_cart_id' => $this->id], 'air_cart_id=:airCartId', [':airCartId' => $airCart->id]);
            // Move the files to this cart
            \AircartFile::model()->updateAll(['aircart_id' => $this->id], 'aircart_id=:airCartId', [':airCartId' => $airCart->id]);

            // Merge the notes as well
            $oldNotes = $airCart->getNotes();
            if (is_array($oldNotes)) {
                $oldNotes = implode('<br>', $oldNotes);
            }
            $this->addNote('Merged cart №' . $airCart->id . " Msgs:\n$oldNotes");

            // Delete the cart
            $airCart->delete();
        }
        $this->refresh();
        // Set the AB & AR order for the cart
        $this->setAirBookingsAndAirRoutesOrder();
//        $this->applyBothRules();
        // Set the booking status, but be quiet
//        $this->setBookingStatus(true);
    }

    /**
     * Delete fake air cart.
     * @param AirCart $realCart The real air cart. If the fake cart has payments or transactions or files those are moved to the real cart
     */
    function removeFake(AirCart $realCart) {
        // Move the payments to this cart
        \Payment::model()->updateAll(['air_cart_id' => $realCart->id], 'air_cart_id=:airCartId', [':airCartId' => $this->id]);
        // Move the transactions to this cart
        \PayGateLog::model()->updateAll(['air_cart_id' => $realCart->id], 'air_cart_id=:airCartId', [':airCartId' => $this->id]);
        // Move the files to this cart
        \AircartFile::model()->updateAll(['aircart_id' => $realCart->id], 'aircart_id=:airCartId', [':airCartId' => $this->id]);
        
        //when old cart price is greater than keep old price
        
        $fake_cart_fares = $this->totalAmount() - $this->getTotalCommercialNetEffect();
        if ($fake_cart_fares > $realCart->totalAmount()) {
            $realPrice = $realCart->totalAmount();
            $this->updateRealCartPrice($realCart);
            sleep(1);
            $realCart->addNote('Issued on lower fare Price is Rs.' . $realPrice);
        }
        
        foreach ($realCart->airBookings as $airBooking) {
            // Delete the airBookings for this cart that exists in the realCart
//            \AirBooking::model()->deleteAll('air_cart_id=:airCartId AND source_id=:source_id AND destination_id=:destination_id AND carrier_id=:carrier_id AND traveler_id=:traveler_id AND air_source_id=:air_source_id', [
            \AirBooking::model()->deleteAll('air_cart_id=:airCartId AND source_id=:source_id AND destination_id=:destination_id AND traveler_id=:traveler_id AND air_source_id=:air_source_id', [
                ':airCartId' => $this->id,
                ':source_id' => $airBooking->source_id,
                ':destination_id' => $airBooking->destination_id,
//                ':carrier_id' => $airBooking->carrier_id,
                ':traveler_id' => $airBooking->traveler_id,
                ':air_source_id' => $airBooking->air_source_id,
            ]);
        }
        // Move the remaining bookings to the real cart
        \AirBooking::model()->updateAll(['air_cart_id' => $realCart->id], 'air_cart_id=:airCartId', [':airCartId' => $this->id]);

        // Inherit the booking status - helps when the cart is marked as fraud

        $realCart->booking_status_id = $this->booking_status_id;
        $realCart->website_id = $this->website_id;

        $realNotes = $realCart->getNotes();
        $fakeNotes = $this->getNotes();

        $realCart->note = json_encode(array_merge($realNotes, $fakeNotes));
        $realCart->update(['booking_status_id', 'website_id', 'note']);

        // Map the Screenshots to Actual From Fake
        Screenshot::renameFakeToRealCart($this->id, $realCart->id);
        // Delete the cart
        $this->delete();

        // Set the AB & AR order for the real cart
        $realCart->setAirBookingsAndAirRoutesOrder();
//        $realCart->applyBothRules();
        // Set the status of the real cart
//        $realCart->setBookingStatus(true);
    }

    /**
     * Copy and remove air cart.
     * @param $prevcartId The previous air cart. This cart has to copied with cart id =prevcartId
     */
    function copyCart($prevCartId, $notes) {

        $airCart = new \AirCart;
        $airCart->id = (int) $prevCartId;
        $airCart->user_id = $this->user_id;
        $airCart->loged_user_id = $this->loged_user_id;
        $airCart->payment_status_id = $this->payment_status_id;
        $airCart->booking_status_id = $this->booking_status_id;
        $airCart->approval_status_id = $this->approval_status_id;
        $airCart->client_source_id = $this->client_source_id;
        $airCart->claim_user_id = $this->claim_user_id;
        $airCart->claimed_ts = $this->claimed_ts;
        $airCart->process_flag = $this->process_flag;
        $airCart->note = json_encode($notes);
        $airCart->website_id = $this->website_id;
        $airCart->insert();
        $airCart->addNote('Copy previous cart.' . $prevCartId);
        // Move the payments to $airCart
        \Payment::model()->updateAll(['air_cart_id' => $airCart->id], 'air_cart_id=:airCartId', [':airCartId' => $this->id]);
        // Move the transactions to $airCart
        \PayGateLog::model()->updateAll(['air_cart_id' => $airCart->id], 'air_cart_id=:airCartId', [':airCartId' => $this->id]);
        // Move the files to $airCart
        \AircartFile::model()->updateAll(['aircart_id' => $airCart->id], 'aircart_id=:airCartId', [':airCartId' => $this->id]);

        // Move the  bookings to the $airCart
        \AirBooking::model()->updateAll(['air_cart_id' => $airCart->id], 'air_cart_id=:airCartId', [':airCartId' => $this->id]);

        // Delete the cart
        $this->delete();

        // Set the AB & AR order for the real cart
        $airCart->setAirBookingsAndAirRoutesOrder();
//        $realCart->applyBothRules();
        // Set the status of the real cart
//        $realCart->setBookingStatus(true);
    }

    /**
     * Send confirmation SMS to the client
     */
    function sendConfirmationSMS() {
        if ($this->isFraud()) {
            return;
        }
        $notificationPhone = $this->getNotificationPhone();
        $mobilecountryobj = \Utils::getCountryUsingNumber($notificationPhone);
        if ($mobilecountryobj->code == 'IN') {
            $getSite = $this->getSiteCreds();
            if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
                $companyName = $getSite['senderName'];
            } else {
                $companyName = $this->user->userInfo->name;
            }
            $content = "{$companyName}: Booking ID: {$this->id}. ";
            $content .= $this->getSummaryWithDetailsForSms() . " Pax: " . $this->getPaxNames() . ". Status: Confirmed. ";
            \Yii::app()->sms->send($notificationPhone, $content);
            \EmailSmsLog::push_email_sms_log($getSite['CompanyName'], $notificationPhone, $content, '', \EmailSmsLog::CONTACT_TYPE_SMS, \EmailSmsLog::CATEGORY_CONFIRMATION, $this->id, $this->user_id);
            $this->addNote('Confirmation SMS sent to ' . $notificationPhone);
        } else {
            echo 'Sms Not Sent because of International Contact No.';
        }
    }

    /**
     * Send Current Status SMS to the client
     */
    function sendCurrentStatusSMS($phone) {
        if ($this->isFraud()) {
            return;
        }
        $mobilecountryobj = \Utils::getCountryUsingNumber($phone);
        if (!empty($mobilecountryobj->code) && $mobilecountryobj->code == 'IN') {
            $getSite = $this->getSiteCreds();
            if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
                $companyName = $getSite['senderName'];
            } else {
                $companyName = $this->user->userInfo->name;
            }
            $content = "{$companyName}: Booking ID: {$this->id}. ";
            if (strcasecmp($this->bookingStatus->name, 'fraud') == 0) {
                $booking_status = 'Pending';
            } else {
                $booking_status = $this->bookingStatus->name;
            }
            $content .= $this->getSummaryWithDetailsForSms() . " Pax: " . $this->getPaxNames() . ". Status: " . $booking_status;
            \Yii::app()->sms->send($phone, $content);
            \EmailSmsLog::push_email_sms_log($getSite['CompanyName'], $phone, $content, '', \EmailSmsLog::CONTACT_TYPE_SMS, \EmailSmsLog::CATEGORY_CONFIRMATION, $this->id, $this->user_id);
            //\Utils::dbgYiiLog($siteCreds);
            echo 'Sms Sent';
        } else {
            echo 'Sms Not Sent because of International Contact No.';
        }
    }

    function sendCancellationSMS() {
        if ($this->isFraud()) {
            return;
        }
        $notificationPhone = $this->getNotificationPhone();
        $mobilecountryobj = \Utils::getCountryUsingNumber($notificationPhone);
        if ($mobilecountryobj->code == 'IN') {
            $getSite = $this->getSiteCreds();
            if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
                $companyName = $getSite['senderName'];
            } else {
                $companyName = $this->user->userInfo->name;
            }
            $content = "{$companyName}: Booking ID: {$this->id}. ";
            $content .= $this->getSummaryWithDetailsForSms() . " Pax: " . $this->getPaxNames() . ". Status: Cancelled. ";
            \Yii::app()->sms->send($notificationPhone, $content);
            \EmailSmsLog::push_email_sms_log($getSite['CompanyName'], $notificationPhone, $content, '', \EmailSmsLog::CONTACT_TYPE_SMS, \EmailSmsLog::CATEGORY_AMENDMENT_CANCELLATION, $this->id, $this->user_id);
        } else {
            echo 'Sms Not Sent because of International Contact No.';
        }
    }

    function sendRescheduleSMS() {
        if ($this->isFraud()) {
            return;
        }
        $notificationPhone = $this->getNotificationPhone();
        $mobilecountryobj = \Utils::getCountryUsingNumber($notificationPhone);
        if ($mobilecountryobj->code == 'IN') {
            $getSite = $this->getSiteCreds();
            $amendments = \Amendment::model()->findAllBySql('
                Select amendment.id, amendment.group_id, air_booking_id, amendment_type_id, amendment_status_id, air_route_id
                From amendment
                JOIN air_booking on (air_booking.id = amendment.air_booking_id)
                WHERE air_booking.air_cart_id=:cartId AND amendment_type_id=:amendmentTypeId AND amendment_status_id=:amendmentStatusId
                ORDER BY id
                ', [
                ':cartId' => $this->id,
                ':amendmentTypeId' => \AmendmentType::AMENDMENT_RESCHEDULE,
                ':amendmentStatusId' => \AmendmentStatus::STATUS_SUCCESS,
            ]);
            if (empty($amendments)) {
                return; // Do nothing if there are no rescheduled amendments
            }

            if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
                $companyName = $getSite['senderName'];
            } else {
                $companyName = $this->user->userInfo->name;
            }
            $content = "{$companyName}: Booking ID: {$this->id}. ";
            $content .= $this->getSummaryWithDetailsForSms() . " Pax: " . $this->getPaxNames() . ". Status: Rescheduled. ";
            \Yii::app()->sms->send($notificationPhone, $content);
            \EmailSmsLog::push_email_sms_log($getSite['CompanyName'], $notificationPhone, $content, '', \EmailSmsLog::CONTACT_TYPE_SMS, \EmailSmsLog::CATEGORY_AMENDMENT_RESCHEDULE, $this->id, $this->user_id);
        } else {
            echo 'Sms Not Sent because of International Contact No.';
        }
    }

    function sendCancellationEmail($amount = null) {
        if ($this->isFraud()) {
            return;
        }
        $getSite = $this->getSiteCreds();
        if ($amount !== null) {
            $amountText = "Your account is credited with INR: <b>$amount</b><br>";
        } else {
            $amountText = "";
        }
        if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {

            $email_content = "<html>
            " . $getSite['sitelogo'] . "                  
            <h2>Cancellation Confirmation!</h2>
            <b>Dear {$this->user->userInfo->name},</b><br>
            Your Booking ID: <b>{$this->id}</b> has been successfully cancelled!<br>
            $amountText
            <br>Flight details:<br>" . nl2br($this->getSummaryWithDetails()) . "
            <br>Passenger names:<br>" . $this->getPaxNames() . "<br><br>
            Thank You!<br>
         <a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a>"
                . $this->user->userInfo->getEmailFooter($this->website_id) . "</html>";


            $senderEmail = $getSite['senderEmail'];
            $senderName = $getSite['senderName'];
        } else {
            $email_content = "<html><h2>Cancellation Confirmation!</h2>
            Your Booking ID: <b>{$this->id}</b> has been successfully cancelled!<br>
            $amountText
            <br>Flight details:<br>" . nl2br($this->getSummaryWithDetails()) . "
            <br>Passenger names:<br>" . $this->getPaxNames() . "<br><br>
            Thank You!<br>" . $this->user->userInfo->getEmailFooter($this->website_id) . "<a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a></html>";
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }

        $subject = "Cancellation Confirmation for Booking ID: $this->id";


        \Utils::sendMail($this->user->userInfo->email, $email_content, $subject, $senderEmail, $senderName);
        \EmailSmsLog::push_email_sms_log($senderEmail, $this->user->userInfo->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_AMENDMENT_CANCELLATION, $this->id, $this->user_id);
    }

//done2
    function sendCancellationEmailNew($amount = null) {
        if ($this->isFraud()) {
            return;
        }
        $getSite = $this->getSiteCreds();
        if ($amount !== null) {
            $amountText = "Your account is credited with INR: <b>$amount</b><br>";
        } else {
            $amountText = "";
        }
        //if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
        $email_content = "<html>
        " . $getSite['sitelogo'] . " 
        <table width='100%' cellpadding='10' style='border-left:4px solid #f4ba4a'>
        <tr>
        <td colspan='5'>
        <table width='100%'>
        <tr>
        <td colspan='3'>
        <h1>Cancellation Confirmation</h1>
        </td>
        </tr>

        <tr>
        <td colspan='3'>
        <p><b>Dear {$this->user->userInfo->name}, </b>
        Your Booking ID: <b>{$this->id}</b> has been successfully cancelled!</p>
        </td>
        </tr>

        <table width='100%'>
        </td>
        </tr>


        <tr>
        <td height='20'>&nbsp;</td>
        </tr>
        <tr>
        <td align='left' colspan='5' style=' font-weight:bold; background-color:#dedede; padding: 5px 10px;'>
        Passenger Names:
        </td>
        </tr>"
            . $this->cancellationMailInfo() .
            "<tr>
        <td height='20'>&nbsp;</td>
        </tr>
        <tr>
        <td style='padding:5px 10px;'>
        <span style='color: #000; font-size: 13px'>Thank You!<br><br>"
            . $this->user->userInfo->getEmailFooter($this->website_id) . "
        </td>
        </tr>
         <tr>
        <td>
         <a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a>
        </td></tr>
        </table>
        </td>
        </tr>
        </table>
        </html>";


        $senderEmail = $getSite['senderEmail'];
        $senderName = $getSite['senderName'];


        /* }
          "<pre>". print_r($email_content)."</pre>";
          else {
          $email_content = "<html><h2>Cancellation Confirmation!</h2>
          Your Booking ID: <b>{$this->id}</b> has been successfully cancelled!<br>
          $amountText
          <br>Flight details:<br>" . nl2br($this->getSummaryWithDetails()) . "
          <br>Passenger names:<br>" . $this->getPaxNames() . "<br><br>
          Thank You!<br>" . $this->user->userInfo->getEmailFooter() . "</html>";
          $senderEmail = \Users::B2B_SENDER_EMAIL;
          $senderName = \Users::B2B_SENDER_NAME;
          } */

        $subject = "Cancellation Confirmation for Booking ID: $this->id";
        \Utils::sendMail($this->user->userInfo->email, $email_content, $subject, $senderEmail, $senderName);
        \EmailSmsLog::push_email_sms_log($senderEmail, $this->user->userInfo->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_AMENDMENT_CANCELLATION, $this->id, $this->user_id);
    }

//done
    function sendCancellationRequestEmail() {
        if ($this->isFraud()) {
            return;
        }
        $getSite = $this->getSiteCreds();
        if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
            $email_content = "<html>
        " . $getSite['sitelogo'] . "                
        <h2><b>Cancellation Request!</b></h2><br>
        <b>Dear {$this->user->userInfo->name},</b><br>
        Your cancellation request for Booking ID: <b>{$this->id}</b> has been received!<br>
        You will receive a separate email with the confirmation.<br>
        <br>Flight details:<br>" . nl2br($this->getSummaryWithDetails()) . "
        <br>Passenger names:<br>" . $this->getPaxNames() . "<br><br>
        Thank You!<br>" . $this->user->userInfo->getEmailFooter($this->website_id) . "</html>";

            $senderEmail = $getSite['senderEmail'];
            $senderName = $getSite['senderName'];
        } else {
            $email_content = "<html>
        " . $getSite['sitelogo'] . "                 
        <h2><b>Cancellation Request!</b></h2><br>
        Your cancellation request for Booking ID: <b>{$this->id}</b> has been received!<br>
        You will receive a separate email with the confirmation.<br>
        <br>Flight details:<br>" . nl2br($this->getSummaryWithDetails()) . "
        <br>Passenger names:<br>" . $this->getPaxNames() . "<br><br>
        Thank You!<br>" . $this->user->userInfo->getEmailFooter($this->website_id) . "<a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a></html>";
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }

        $subject = "Cancellation Request for Booking ID: $this->id";


        \Utils::sendMail($this->user->userInfo->email, $email_content, $subject, $senderEmail, $senderName);
        \EmailSmsLog::push_email_sms_log($senderEmail, $this->user->userInfo->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_AMENDMENT_CANCELLATION, $this->id, $this->user_id);
    }

//done
    function sendAmendmentEmailToCustomerCare($amendmentGroup) {
        $getSite = $this->getSiteCreds();
        $email_content = "<html>
    " . $getSite['sitelogo'] . "              
    <h2>New Amendment request</h2>
    For Booking ID: <b>{$this->id}</b> has been received!<br>
    <a href='" . \Yii::app()->request->hostInfo . "/airCart/update/{$this->id}'>Check the amendment</a><br><br>
    Flight details:<br>" . nl2br($this->getSummaryWithDetails()) . "
    <br>Passenger names:<br>" . $this->getPaxNames() . "<br><br>
    Please process the amendment!<br>
      <a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a></html>";
        if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
            $senderEmail = $getSite['senderEmail'];
            $toEmail = $getSite['RecipentEmail'];
            ;
            $senderName = $getSite['senderName'];
        } else {
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $toEmail = \Users::B2B_RECEPIENT_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }
        $subject = 'New Amendment Request';


        \Utils::sendMail($toEmail, $email_content, $subject, $senderEmail, $senderName);
        \EmailSmsLog::push_email_sms_log($senderEmail, $toEmail, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_AMENDMENT_MISC, $this->id);
    }

//done2
    function sendRescheduleEmail() {
        if ($this->isFraud()) {
            return;
        }
        $getSite = $this->getSiteCreds();
        $amendments = \Amendment::model()->findAllBySql('
        Select amendment.id, amendment.group_id, air_booking_id, amendment_type_id, amendment_status_id, air_route_id
        From amendment
        JOIN air_booking on (air_booking.id = amendment.air_booking_id)
        WHERE air_booking.air_cart_id=:cartId AND amendment_type_id=:amendmentTypeId AND amendment_status_id=:amendmentStatusId
        ORDER BY id
        ', [
            ':cartId' => $this->id,
            ':amendmentTypeId' => \AmendmentType::AMENDMENT_RESCHEDULE,
            ':amendmentStatusId' => \AmendmentStatus::STATUS_SUCCESS,
        ]);
        if (empty($amendments)) {
            return; // Do nothing if there are no rescheduled amendments
        }
        $details = '';


        $email_content = "<html>" . $getSite['sitelogo'] . "  <h2><b>Reschedule Confirmation!</b></h2>
        <b>Dear {$this->user->userInfo->name},</b><br>
        Your Booking ID: <b>{$this->id}</b> has been successfully Rescheduled!<br>
        <br>New Flight details:<br><br><table style='width:100%'>" . $this->getSummaryWithDetailsforEmail() . "</table><br>Thank You!<br>" . $this->user->userInfo->getEmailFooter($this->website_id) . " <a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a></html>";

        $file = null;
        if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
            $file = \Yii::app()->pdf->save(\Controller::B2C_BASE_URL . "/b2c/airCart/mybookings/" . $this->id . "#print", "E-ticket_$this->id.pdf");
            $senderEmail = $getSite['senderEmail'];
            $senderName = $getSite['senderName'];
        } else {
            $file = Yii::app()->pdf->save(\Yii::app()->request->hostInfo . "/airCart/view/$this->id", "E-ticket_$this->id.pdf");
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }
        $from = $senderName . '<' . $senderEmail . '>';
        $subject = "Reschedule Confirmation for Booking ID: $this->id";


        //\Utils::sendMail($this->user->userInfo->email, $email_content, $subject, $senderEmail, $senderName);
        \Utils::sendMailWithAttachment($file, "E-ticket_$this->id.pdf", $this->user->userInfo->email, $from, $email_content, $subject, $senderEmail);
        \EmailSmsLog::push_email_sms_log($senderEmail, $this->user->userInfo->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_AMENDMENT_RESCHEDULE, $this->id, $this->user_id);
    }

//done2
    function sendBookedEmail() {
        if ($this->isFraud()) {
            return;
        }
        $getSite = $this->getSiteCreds();
        $details = '';
        $ccc = new CController('email');
        foreach ($this->airBookings as $airBooking) {
            $details .= $airBooking->traveler->combinedInfo . " , PNR: <b>$airBooking->airline_pnr</b><br>";
            $details .= $ccc->renderInternal(\Yii::app()->basePath . '/views/airCart/_viewairroutes.php', ['airRoutes' => $airBooking->airRoutes], true) . '<br><br>';
        }
        $details = str_replace("img src='", "img src='" . \Yii::app()->request->hostInfo, $details);

        $email_content = "<html>" . $getSite['sitelogo'] . "  <h2><b>Booking Confirmation!</b></h2>
        Dear {$this->user->userInfo->name},<br><br>
        Your Booking ID: <b>{$this->id}</b> has been confirmed!<br>
        <br>Flight details:<br><br>$details<br>Thank You!<br>" . $this->user->userInfo->getEmailFooter($this->website_id) . "<a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a></html>";

        if ($this->user->userInfo->user_type_id === \UserType::clientB2C) {
            $senderEmail = $getSite['senderEmail'];
            $senderName = $getSite['senderName'];
        } else {
            $senderEmail = \Users::B2B_SENDER_EMAIL;
            $senderName = \Users::B2B_SENDER_NAME;
        }

        $subject = "Confirmation for Booking ID: $this->id";


        \Utils::sendMail($this->user->userInfo->email, $email_content, $subject, $senderEmail, $senderName);
        \EmailSmsLog::push_email_sms_log($senderEmail, $this->user->userInfo->email, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_CONFIRMATION, $this->id, $this->user_id);
    }

//done2
    function sendBookedEmailforB2C($usermail = null) {
        $getSite = $this->getSiteCreds();
        $id = $this->id;

        /* PICK DYNAMICALLY PATH::FAISAL */
        $file = \Yii::app()->pdf->save(\Utils::getSiteUrl(\Yii::app()->request->hostInfo) . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
        //$file = \Yii::app()->pdf->save(\Controller::B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
        /* PICK DYNAMICALLY PATH */
        $model = $this;
        if ($usermail == null || empty($usermail))
            $usermail = $model->user->email;
        $bookingdate = date(TICKET_DATETIME_FORMAT, strtotime($model->created));
        $companyName = "";
        if (isset($this->website_id)) {
            if ($this->website_id == self::WEBSITE_CHEAPTICKETS24_LIVE || $this->website_id == self::WEBSITE_CHEAPTICKETS24_DEV || $this->website_id == self::WEBSITE_CHEAPTICKETS24_LOCAL) {
                if ($this->website_id == self::WEBSITE_CHEAPTICKETS24_LIVE) {
                    $file = \Yii::app()->pdf->save(\Controller::F2G_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                } else if ($this->website_id == self::WEBSITE_CHEAPTICKETS24_DEV) {
                    $file = \Yii::app()->pdf->save(\Controller::DEV_F2G_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                } else {
                    $file = \Yii::app()->pdf->save(\Controller::LOCAL_F2G_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                }
                $companyName = "Cheaptickets24.com";
                $from = \Utils::CHEAPTICKETS24_TICKET_EMAIL_WITH_NAME;
                $fromemail = \Utils::CHEAPTICKETS24_TICKET_EMAIL;
            } else if ($this->website_id == self::WEBSITE_CHEAPTICKET || $this->website_id == self::WEBSITE_CHEAPTICKET_DEV || $this->website_id == self::WEBSITE_CHEAPTICKET_LOCAL) {
                if ($this->website_id == self::WEBSITE_CHEAPTICKET) {
                    $file = \Yii::app()->pdf->save(\Controller::B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                } else if ($this->website_id == self::WEBSITE_CHEAPTICKET_DEV) {
                    $file = \Yii::app()->pdf->save(\Controller::DEV_B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                } else {
                    $file = \Yii::app()->pdf->save(\Controller::LOCAL_B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                }
                $companyName = "CheapTicket.in";
                $from = \Utils::CHEAPTICKET_TICKET_EMAIL_WITH_NAME;
                $fromemail = \Utils::CHEAPTICKET_TICKET_EMAIL;
            } else if ($this->website_id == self::WEBSITE_AIRTICKETSINDIA || $this->website_id == self::WEBSITE_AIRTICKETS_DEV || $this->website_id == self::WEBSITE_AIRTICKETS_LOCAL) {
                if ($this->website_id == self::WEBSITE_AIRTICKETSINDIA) {
                    $file = \Yii::app()->pdf->save(\Controller::ATI_B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                } else if ($this->website_id == self::WEBSITE_AIRTICKETS_DEV) {
                    $file = \Yii::app()->pdf->save(\Controller::DEV_ATI_B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                } else {
                    $file = \Yii::app()->pdf->save(\Controller::LOCAL_ATI_B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
                }
                $companyName = "Airticketsindia.com";
                $from = \Utils::AIRTICKETINDIA_EMAIL_WITH_NAME;
                $fromemail = \Utils::AIRTICKETINDIA_EMAIL;
            }
        }
        $bcc = null;
        if ($model->bookingStatus->id == \BookingStatus::STATUS_BOOKED || $model->bookingStatus->id == \BookingStatus::STATUS_BOOKED_TO_BILL || $model->bookingStatus->id == \BookingStatus::STATUS_BOOKED_TO_CAPTURE || $model->bookingStatus->id == \BookingStatus::STATUS_COMPLETE) {
            $stsmsg = 'E-Ticket-CONFIRMED';
            $subjectmsg = '';
            if ($this->website_id == self::WEBSITE_CHEAPTICKETS24_LIVE || $this->website_id == self::WEBSITE_CHEAPTICKETS24_DEV || $this->website_id == self::WEBSITE_CHEAPTICKETS24_LOCAL) {
                $bcc = \Utils::CHEAPTICKETS24_EMAIL_WITH_NAME;
            } else if ($this->website_id == self::WEBSITE_CHEAPTICKET || $this->website_id == self::WEBSITE_CHEAPTICKET_DEV || $this->website_id == self::WEBSITE_CHEAPTICKET_LOCAL) {
                $bcc = \Utils::CHEAPTICKET_EMAIL_WITH_NAME;
            } else if ($this->website_id == self::WEBSITE_AIRTICKETSINDIA || $this->website_id == self::WEBSITE_AIRTICKETS_DEV || $this->website_id == self::WEBSITE_AIRTICKETS_LOCAL) {
                $bcc = \Utils::AIRTICKETINDIA_EMAIL_WITH_NAME;
            }
            $statusmsg = "Your ticket has been booked successfully";
        } else if ($model->bookingStatus->id == \BookingStatus::STATUS_NEW) {
            $stsmsg = 'E-Ticket-<span style="color:red">PENDING</span>';
            $subjectmsg = 'Pending:';
            $statusmsg = "Your booking is in Progress.";
        } else if ($model->bookingStatus->id == \BookingStatus::STATUS_FRAUD) {
            $stsmsg = 'E-Ticket-<span style="color:red">PENDING</span>';
            $subjectmsg = 'Pending:';
            $statusmsg = "Your booking is in Progress.";
        } else {
            $stsmsg = 'E-Ticket-<span style="color:red">' . $model->bookingStatus->name . '</span>';
            $subjectmsg = 'Pending:';
            $statusmsg = "Your booking is in Progress.";
        }
        $email_content = $model->getSummaryWithDetailsforEmail();

        if ($model->bookingStatus->id == \BookingStatus::STATUS_IN_PROCESS)
            $statusmsg = str_replace(array('#BASEURL#', '#ID#'), array($getSite['Baseurl'], $id), \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_IN_PROCESS_FOR_EMAIL']);
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_NEW)
            $statusmsg = str_replace(array('#BASEURL#', '#ID#'), array($getSite['Baseurl'], $id), \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_NEW_FOR_EMAIL']);
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_HOLD)
            $statusmsg = str_replace(array('#MODELID#', '#BASEURL#', '#ID#'), array($model->id, $getSite['Baseurl'], $id), \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_HOLD_FOR_EMAIL']);
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_ABORTED)
            $statusmsg = str_replace(array('#MODELID#', '#BASEURL#', '#ID#'), array($model->id, $getSite['Baseurl'], $id), \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_ABORTED_FOR_EMAIL']);
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_TO_CANCEL)
            $statusmsg = str_replace(array('#BASEURL#', '#ID#'), array($getSite['Baseurl'], $id), \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_TO_CANCEL_FOR_EMAIL']);
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_CANCELLED)
            $statusmsg = str_replace(array('#BASEURL#', '#ID#'), array($getSite['Baseurl'], $id), \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_CANCELLED_FOR_EMAIL']);
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_PARTIALLY_BOOKED)
            $statusmsg = str_replace(array('#MODELID#', '#BASEURL#', '#ID#'), array($model->id, $getSite['Baseurl'], $id), \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['STATUS_PARTIALLY_BOOKED_FOR_EMAIL']);
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_BOOKED)
            $statusmsg = "<div style='font-size:16px'>Your ticket has been booked successfully</div>";

        foreach ($model->airBookings as $booking) {
            if ($booking->carrier_id == \Carrier::CARRIER_GOAIR && $model->booking_status_id !== \BookingStatus::STATUS_BOOKED && $model->booking_status_id !== \BookingStatus::STATUS_CANCELLED) {
                $statusmsg = \Yii::app()->params['payment_email_config'][\Yii::app()->request->serverName]['CARRIER_GOAIR_FOR_EMAIL'];
                break;
            }
        }
        $subject = $subjectmsg . ' ' . $getSite['CompanyName'] . ' E-Ticket Booking Id: ' . $model->id;

        $email_sms_log_id = \EmailSmsLog::push_email_sms_log($fromemail, $usermail, '', $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_CONFIRMATION, $this->id, $this->user_id);

        $email_content = '<html><body>' . $getSite['sitelogo'] . ' <div style="font-family:arial;font-size:12px;color:#000000;font-weight:normal;line-height: 1.4;">Dear ' . $model->user->name . ',<br><br>
    <img src="' . \Yii::app()->request->hostInfo . '/tracker/email/' . $email_sms_log_id . '" alt="" height="1" width="1" border="0"/>

    ' . $statusmsg . '<br><br></div>
    <table  width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
    <tr>
    <td colspan="2" style="border-bottom:1px solid #0061aa">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tbody>
    <tr>
    <td width="61.57%" align="left" valign="top">
    <span style="font-family:arial;font-size:26px;color:#000000;font-weight:bold">' . $stsmsg . '</span>
    <br />
    <span style="font-family:arial;font-size:15px;color:#000000;font-weight:normal">
    <span class="il">' . $companyName . '</span> Booking ID - ' . $model->id . '
    </span>
    <br />
    <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">Booking Date - ' . $bookingdate . '
    </span>
    </td>
    <td width="38.43%" align="right" valign="top">
    
    </td>
    </tr>
    <tr>
    <td colspan="2" height="5"></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    <tr>
    <td height="45" colspan="2" style="font-family:arial;font-size:18px;color:#000000;font-weight:bold">Itinerary and
    Reservation Details</td>
    </tr>' . $email_content . '
      
    </table><br><br>
        Thank You!<br>' . $this->user->userInfo->getEmailFooter($this->website_id) . '</html>
     <a href="http://lwcmovement.com/" target="_blank">' . $getSite['footerPromotionalImage'] . '</a><br></body>
    </html>';
        //\Utils::dbgYiiLog($email_content);
        \EmailSmsLog::model()->updateByPk($email_sms_log_id, ['content' => $email_content]);
        \Utils::sendMailWithAttachment($file, "E-ticket_$id.pdf", $usermail, $from, $email_content, $subject, $fromemail, $bcc);
        $this->addNote('Confirmation email sent to ' . $usermail);
    }

//done2
    function sendBookedEmailforOther($usermail = null) {
        $getSite = $this->getSiteCreds();
        $id = $this->id;

        $file = Yii::app()->pdf->save(\Yii::app()->request->hostInfo . "/airCart/view/$id", "E-ticket_$id.pdf");
        $model = $this;
        // $usermail=  $model->user->email;
        if ($usermail == null || empty($usermail))
            $usermail = $model->user->email;
        $bookingdate = date(TICKET_DATETIME_FORMAT, strtotime($model->created));
        $from = 'BelAir <support2@air.belair.in>';
        $fromemail = 'support2@air.belair.in';
        $email_content = $model->getSummaryWithDetailsforEmail();
        $statusmsg = "Your ticket has been booked successfully";
        if ($model->bookingStatus->id == \BookingStatus::STATUS_IN_PROCESS)
            $statusmsg = "Your Booking is Under Process. Our team is working on confirming your booking and will revert shortly. This process can take anywhere between 30 minutes to upto 2 hours. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_NEW)
            $statusmsg = "We have not received confirmation against this booking reference №. " . $model->id;
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_HOLD)
            $statusmsg = "Your booking reference № " . $model->id . " is On Hold. Airline has authority to cancel booking any time. Our team is working on confirming your booking and will revert shortly. This process can take anywhere between 30 minutes to upto 2 hours. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_ABORTED)
            $statusmsg = "Your booking reference № " . $model->id . " is aborted due to non availability. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_TO_CANCEL)
            $statusmsg = "Your cancellation request has been received and it is currently under process. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_CANCELLED)
            $statusmsg = "Your cancellation request has been complete. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_PARTIALLY_BOOKED)
            $statusmsg = "Your booking reference № " . $model->id . " is In Process, but one or more item/s is/are still not confirmed. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
        else if ($model->bookingStatus->id == \BookingStatus::STATUS_BOOKED)
            $statusmsg = "Your ticket has been booked successfully";

        foreach ($model->airBookings as $booking) {
            if ($booking->carrier_id == \Carrier::CARRIER_GOAIR && $model->booking_status_id !== \BookingStatus::STATUS_BOOKED && $model->booking_status_id !== \BookingStatus::STATUS_CANCELLED) {
                $statusmsg = "Your Booking is Under Process. Our team is working on confirming your booking and will revert shortly. This process can take upto 24 hours. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
                break;
            }
        }

        $email_content = '<html> ' . $getSite['sitelogo'] . '<br><br><strong>Dear ' . $model->user->name . ',</strong><br><br>

    ' . $statusmsg . '<br><br>
    <table  width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
    <tr>
    <td colspan="2" style="border-bottom:1px solid #0061aa">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tbody>
    <tr>
    <td width="61.57%" align="left" valign="top">
    <span style="font-family:arial;font-size:26px;color:#000000;font-weight:bold">E-Ticket-' . $model->bookingStatus->name . '</span>
    <br />
    <span style="font-family:arial;font-size:15px;color:#000000;font-weight:normal">
    <span class="il">BelAir</span> Booking ID - ' . $model->id . '
    </span>
    <br />
    <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">Booking Date - ' . $bookingdate . '
    </span>
    </td>
    <td width="38.43%" align="right" valign="top">
    <img src="' . Yii::app()->request->hostInfo . '/img/belair_logo_50px.jpg"
    width="172" height="68" class="CToWUd" />
    </td>
    </tr>
    <tr>
    <td colspan="2" height="5"></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    <tr>
    <td height="45" colspan="2" style="font-family:arial;font-size:18px;color:#000000;font-weight:bold">Itinerary and
    Reservation Details</td>
    </tr>' . $email_content . '
<tr><td>
  <a href="http://lwcmovement.com/" target="_blank">' . $getSite['footerPromotionalImage'] . '</a>
</td></tr>
    </table><br>
    </html>';
        $subject = 'BelAir E-Ticket Booking Id: ' . $model->id;


        //\Utils::dbgYiiLog($email_content);
        \Utils::sendMailWithAttachment($file, "E-ticket_$id.pdf", $usermail, $from, $email_content, $subject, $fromemail);

        \EmailSmsLog::push_email_sms_log($fromemail, $usermail, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_CONFIRMATION, $this->id, $this->user_id);
    }

    /*
     * Get Aircarts that are BOOKED and CHARGED and Doesnt have invoice
     */

    public static function getPendingAircartsForInvoices() {
        $carts = AirCart::model()->findAll(array(
            'condition' => 'invoice_no IS NULL AND payment_status_id=' . \PaymentStatus::STATUS_CHARGED . ' AND booking_status_id=' . \BookingStatus::STATUS_BOOKED,
            'order' => 'id',
            'limit' => '100'
        ));

//        \Utils::dbgYiiLog($payments);
        return $carts;
    }

    /**
     * Return the mobile number used for cart registration or the Client own mobile in case there is no specific one
     * @return string Mobile for SMS
     */
    function getNotificationPhone() {
        $traveler = \Traveler::model()->findBySql('SELECT traveler.phone FROM traveler JOIN air_booking on (air_booking.traveler_id=traveler.id) '
            . 'WHERE air_booking.air_cart_id=:airCartId AND traveler.phone IS NOT NULL ORDER BY traveler.id DESC LIMIT 1;', [':airCartId' => $this->id]);
        if ($traveler) {
            return $traveler->phone;
        } else {
            return $this->user->userInfo->mobile;
        }
    }

    /*
     * return true if any airport in aircart bookings is outside India
     */

    public function isInternational() {

        foreach ($this->airBookings as $value) {
            foreach ($value->airRoutes as $routes) {
                if ($routes->source->country_code != 'IN' || $routes->destination->country_code != 'IN') {
                    return true;
                }
            }
        }
        return false;
    }

    public static function getInvoiceXML() {

        $carts = self::getPendingAircartsForInvoices();
        $xml = '';
        $xml .= "<Carts>";
        foreach ($carts as $key => $cart) {
            if ($cart->paymentStatus->id == \PaymentStatus::STATUS_CHARGED) {
                $xml .= "<Cart>";
                if ($cart->user->userInfo->user_type_id === \UserType::clientB2C)
                    $xml .= "<ID>INVC" . $cart->id . "</ID>";
                else
                    $xml .= "<ID>INVB" . $cart->id . "</ID>";

                $xml .= "<CUSTOMER_NAME>" . $cart->user->name . "</CUSTOMER_NAME>";
                $xml .= "<CUSTOMER_ID>" . $cart->user->id . "</CUSTOMER_ID>";
                $xml .= "<CUSTOMER_EMAIL>" . $cart->user->email . "</CUSTOMER_EMAIL>";
                $xml .= "<CUSTOMER_MOBILE>" . $cart->user->mobile . "</CUSTOMER_MOBILE>";
                $xml .= "<USER_INFO_ID>" . $cart->user->user_info_id . "</USER_INFO_ID>";
                $xml .= "<USER_INFO_NAME>" . $cart->user->userInfo->name . "</USER_INFO_NAME>";
                $xml .= "<USER_INFO_EMAIL>" . $cart->user->userInfo->email . "</USER_INFO_EMAIL>";
                $xml .= "<USER_INFO_MOBILE>" . $cart->user->userInfo->mobile . "</USER_INFO_MOBILE>";
                $xml .= "<PAYMENT_STATUS>" . $cart->paymentStatus->name . "</PAYMENT_STATUS>";
                $xml .= "<BOOKING_STATUS>" . $cart->bookingStatus->name . "</BOOKING_STATUS>";
                $xml .= "<PROMO_DISCOUNT>" . $cart->getPromoDiscount() . "</PROMO_DISCOUNT>";
                $xml .= "<TOTAL_AMOUNT>" . $cart->totalAmount() . "</TOTAL_AMOUNT>";
                $xml .= "<PAYMENT_ID>";
                $first = true;
                foreach ($cart->payments as $pkey => $payment) {
                    if ($payment->transfer_type_id == \TransferType::AC_DEPOSIT ||
                        $payment->transfer_type_id == \TransferType::CC_DEPOSIT ||
                        $payment->transfer_type_id == \TransferType::NET_BANKING ||
                        $payment->transfer_type_id == \TransferType::CASH ||
                        $payment->transfer_type_id == \TransferType::FUND_ALLOCATE
                    ) {
                        if ($first) {
                            $first = false;
                            if ($cart->user->userInfo->user_type_id === \UserType::clientB2C)
                                $xml .= 'TXNC' . $payment->id;
                            else
                                $xml .= 'TXNB' . $payment->id;
                        }else {
                            if ($cart->user->userInfo->user_type_id === \UserType::clientB2C)
                                $xml .= ',TXNC' . $payment->id;
                            else
                                $xml .= 'TXNB' . $payment->id;
                        }
                    }
                }
                $xml .= "</PAYMENT_ID>";
                if ($cart->isInternational())
                    $xml .= "<INTERNATIONAL>TRUE</INTERNATIONAL>";
                else
                    $xml .= "<INTERNATIONAL>FALSE</INTERNATIONAL>";
                $xml .= "<BOOKED_BY>" . $cart->logedUser->name . "</BOOKED_BY>";
                $xml .= "<CREATED>" . $cart->created . "</CREATED>";
                $xml .= "<AIRBOOKINGS>";
                $amount = 0.0;
                $conv_fee = 0;
                $first = true;
                foreach ($cart->airBookings as $bkey => $airbooking) {
                    if (!$first) {
                        $conv_fee = $this->convenienceFee;
                    }
                    $first = false;
                    $xml .= "<AIRBOOKING>";
                    $xml .= "<BOOKING_ID>" . $airbooking->id . "</BOOKING_ID>";
                    $xml .= "<BOOKING_TYPE>" . $airbooking->bookingType->name . "</BOOKING_TYPE>";
                    $xml .= "<PURCHASED_FROM_ID>" . $airbooking->air_source_id . "</PURCHASED_FROM_ID>";
                    $xml .= "<PURCHASED_FROM>" . $airbooking->airSource->name . "</PURCHASED_FROM>";
                    $xml .= "<PURCHASE_PRICE>" . ((double) $airbooking->getTotalAmountToPay() - (double) $airbooking->commercial_total_efect - (double) $conv_fee) . "</PURCHASE_PRICE>";
                    $xml .= "<BASIC_FARE>" . $airbooking->basic_fare . "</BASIC_FARE>";
                    $xml .= "<FUEL_SURCHARGE>" . $airbooking->fuel_surcharge . "</FUEL_SURCHARGE>";
                    $xml .= "<CONGESTION_CHARGE>" . $airbooking->congestion_charge . "</CONGESTION_CHARGE>";
                    $xml .= "<AIRPORT_TAX>" . $airbooking->airport_tax . "</AIRPORT_TAX>";
                    $xml .= "<UDF_CHARGE>" . $airbooking->udf_charge . "</UDF_CHARGE>";
                    $xml .= "<JN_TAX>" . $airbooking->jn_tax . "</JN_TAX>";
                    $xml .= "<PASSTHROUGH_FEE>" . $airbooking->passtrough_fee . "</PASSTHROUGH_FEE>";
                    $xml .= "<OC_CHARGE>" . $airbooking->oc_charge . "</OC_CHARGE>";
                    $xml .= "<OTHER_TAX>" . $airbooking->other_tax . "</OTHER_TAX>";
                    $xml .= "<MEAL_CHARGES>" . $airbooking->meal_charge . "</MEAL_CHARGES>";
                    $xml .= "<SEAT_CHARGES>" . $airbooking->seat_charge . "</SEAT_CHARGES>";
                    $xml .= "<BAGGAGE_CHARGE>" . $airbooking->baggage_charge . "</BAGGAGE_CHARGE>";
                    $xml .= "<SERVICE_TAX>" . $airbooking->service_tax . "</SERVICE_TAX>";
                    $xml .= "<BOOKING_FEE>" . $airbooking->booking_fee . "</BOOKING_FEE>";
                    $xml .= "<TDS>" . $airbooking->tds . "</TDS>";
                    $xml .= "<DISCOUNT>" . $airbooking->commission_or_discount_gross . "</DISCOUNT>";
                    $xml .= "<NET_FARE>" . ($airbooking->getTotalAmountToPay() - $conv_fee) . "</NET_FARE>";
                    $xml .= "<CURRENCY>" . $airbooking->airSource->currency->code . "</CURRENCY>";
                    $xml .= "<AIRBOOKING_STATUS>" . $airbooking->abStatus->name . "</AIRBOOKING_STATUS>";
                    $xml .= "<AIRLINE>" . $airbooking->carrier->name . "</AIRLINE>";
                    $xml .= "<TRAVELER_TYPE>" . $airbooking->travelerType->name . "</TRAVELER_TYPE>";
                    $xml .= "<TRAVELER_ID>" . $airbooking->traveler->id . "</TRAVELER_ID>";
                    $xml .= "<TRAVELER_NAME>" . $airbooking->traveler->first_name . " " . $airbooking->traveler->last_name . "</TRAVELER_NAME>";

                    if ($airbooking->cabin_type_id != null && !empty($airbooking->cabin_type_id))
                        $xml .= "<CABIN_TYPE>" . $airbooking->cabinType->name . "</CABIN_TYPE>";
                    else
                        $xml .= "<CABIN_TYPE></CABIN_TYPE>";
                    $xml .= "<BOOKING_CLASS>" . $airbooking->booking_class . "</BOOKING_CLASS>";
                    $xml .= "<FLIGHT>" . $airbooking->carrier->code . "-" . $airbooking->airRoutes[0]->flight_number . "</FLIGHT>";
                    $xml .= "<SECTOR>" . $airbooking->source->city_code . "-" . $airbooking->destination->city_code . "</SECTOR>";
                    $xml .= "<DEPARTURE>" . $airbooking->departure_ts . "</DEPARTURE>";
                    $xml .= "<TICKET_NUMBER>" . $airbooking->ticket_number . "</TICKET_NUMBER>";
                    $xml .= "<AIRLINE_PNR>" . $airbooking->airline_pnr . "</AIRLINE_PNR>";
                    $xml .= "<CRS_PNR>" . $airbooking->crs_pnr . "</CRS_PNR>";
                    $xml .= "<AIRROUTES>";
                    foreach ($airbooking->airRoutes as $rkey => $airroute) {
                        $xml .= "<AIRROUTE>";
                        $xml .= "<ROUTE_ID>" . $airroute->id . "</ROUTE_ID>";
                        $xml .= "<AIRLINE>" . $airroute->carrier->name . "</AIRLINE>";
                        $xml .= "<FLIGHT_NUMBER>" . $airroute->flight_number . "</FLIGHT_NUMBER>";
                        $xml .= "<SOURCE>" . $airroute->source->city_code . "</SOURCE>";
                        $xml .= "<DESTINATION>" . $airroute->destination->city_code . "</DESTINATION>";
                        $xml .= "<DEPARTURE>" . $airroute->departure_ts . "</DEPARTURE>";
                        $xml .= "<ARRIVAL>" . $airroute->arrival_ts . "</ARRIVAL>";
                        $xml .= "</AIRROUTE>";
                    }
                    $xml .= "</AIRROUTES>";
                    $xml .= "</AIRBOOKING>";
                    $amount = $amount + $airbooking->getTotalAmountToPay() - $conv_fee;
                }
                $xml .= "</AIRBOOKINGS>";
                //   $xml.="<AMOUNT>" . $amount . "</AMOUNT>";

                $xml .= "</Cart>";
            }
        }
        $xml .= "</Carts>";
        return $xml;
    }

    /*
     * return true if aircart consist of any field that is part of fraud list else false
     */

    public function isFraud() {

        $criteria = new CDbCriteria;

        if ($this->booking_status_id === \BookingStatus::STATUS_FRAUD) {
            return true;
        }
        foreach ($this->payGateLogs as $transaction) {
            if (empty($transaction->cc_id)) {
                continue;
            }
            $criteria->compare('cc_id', $transaction->cc_id, false, 'OR');
        }

        if ($this->user->mobile !== null) {
            $criteria->compare('phone', $this->user->mobile, false, 'OR');
        }
        if ($this->user->email !== null) {
            $criteria->compare('email', $this->user->email, false, 'OR');
        }

        if (!empty($criteria->condition)) {
            return Fraud::model()->find($criteria) !== null;
        }
        return false;
    }

    /**
     * Adjust the aircart price in case of price change
     * @param float $amount The amount for adjustment. Positive increase the total price and negative decrease the total price
     * @return boolean
     */
    function priceAdjustment($amount) {
        if (count($this->airBookings)) {
            $ab = $this->airBookings[0];
            $ab->booking_fee += (float) $amount;
            $ab->update(['booking_fee']);
        }
    }

    public function applyPromoCode() {
        if (isset(\Yii::app()->session['promo'])) {
            $promo = \Yii::app()->session->get('promo');
            if (!empty($promo['promo_id']) && !empty($promo['promo_code'])) {
                if (empty($this->promo_codes_id)) {
                    $this->promo_codes_id = $promo['promo_id'];
                    $this->update(['promo_codes_id']);

                    $promolog = new \PromoLog;
                    $promolog->air_cart_id = $this->id;
                    $promolog->promo_codes_id = $promo['promo_id'];
                    $promolog->promo_code = $promo['promo_code'];
                    $promolog->value = $promo['promo_value'];
                    $pm = \PromoCodes::model()->findByPk((int) $promo['promo_id']);
                    $promolog->data = json_encode(json_encode($pm->attributes));
                    $promolog->insert();
                }
            }
        }
    }

    public function getPromoLog() {
        return \PromoLog::model()->findByAttributes(array('air_cart_id' => $this->id));
    }

    public function getPromoDiscount() {
        $promolog = \PromoLog::model()->findByAttributes(array('air_cart_id' => $this->id));
        if (isset($promolog->value)) {
            return (double) $promolog->value;
        } else {
            return 0;
        }
    }

    public function getClaim() {
        $userid = \Utils::getLoggedUserId();
        if ($userid === false) {
            return false;
        }
        $user = \Users::model()->findByPk((int) $userid);
        if (!$this->claim_user_id) {
            $this->addNote('Cliamed by ' . $user->name);
            $this->claim_user_id = $userid;
            $this->claimed_ts = date('Y-m-d H:i:s');
            $this->update(['claim_user_id', 'claimed_ts']);
            return true;
        } else if ($user->userInfo->user_type_id === \UserType::superAdmin) {
            $this->addNote('Cliamed by ' . $user->name);
            $this->claim_user_id = $userid;
            $this->claimed_ts = date('Y-m-d H:i:s');
            $this->update(['claim_user_id', 'claimed_ts']);
            return true;
        } else {
            $claimets = new DateTime($this->claimed_ts);
            if ($claimets->diff(new DateTime('NOW'))->i > 15 || $claimets->diff(new DateTime('NOW'))->h > 0 || $claimets->diff(new DateTime('NOW'))->d > 0) {
                $this->addNote('Cliamed by ' . $user->name);
                $this->claim_user_id = $userid;
                $this->claimed_ts = date('Y-m-d H:i:s');
                $this->update(['claim_user_id', 'claimed_ts']);
                return true;
            }
            return false;
        }
    }

    public function unClaim() {
        $userid = \Utils::getLoggedUserId();
        if ($userid === false) {
            return false;
        } else if ($userid === $this->claim_user_id) {
            $user = \Users::model()->findByPk((int) $userid);
            $this->addNote('Uncliamed by ' . $user->name);
            $this->claim_user_id = 0;
            $this->claimed_ts = date('Y-m-d H:i:s');
            $this->update(['claim_user_id', 'claimed_ts']);
            return true;
        } else {
            if (\Authorization::getIsTopStaffLogged()) {
                $user = \Users::model()->findByPk((int) $userid);
                $this->addNote('Uncliamed by ' . $user->name);
                $this->claim_user_id = 0;
                $this->claimed_ts = date('Y-m-d H:i:s');
                $this->update(['claim_user_id', 'claimed_ts']);
                return true;
            }
            return false;
        }
    }

    public function checkClaim() {
        if ($this->claim_user_id !== 0) {
            $claimets = null;
            $claimets = new DateTime($this->claimed_ts);
            if ($claimets->diff(new DateTime('NOW'))->i <= 15 && $claimets->diff(new DateTime('NOW'))->h == 0 && $claimets->diff(new DateTime('NOW'))->d == 0) {
                $user = \Users::model()->findByPk((int) $this->claim_user_id);
                return [$user->id, $user->name];
            }
        }
        return false;
    }

    public function checkClaimByUserId() {
        if ($this->claim_user_id !== 0) {
            $userid = \Utils::getLoggedUserId();
            $claimets = new DateTime($this->claimed_ts);
            if ($claimets->diff(new DateTime('NOW'))->i <= 15 && $claimets->diff(new DateTime('NOW'))->h == 0 && $claimets->diff(new DateTime('NOW'))->d == 0 && $userid === $this->claim_user_id) {
                return true;
            }
        }
        return false;
    }

    function checkStatusForAmendCancel() {
        foreach ($this->airBookings as $airBooking) {
            if ($airBooking->ab_status_id != AbStatus::STATUS_CANCELLED) {
                return false;
            }
        }
        return true;
    }

    /**
     * Auto capture all uncaptured transactions
     */
    function autoCapture() {
        foreach ($this->payGateLogs as $transaction) {
            if ($transaction->isCapturable()) {
                $transaction->pg->captureWithProvider($transaction->id);
            }
        }
    }

    /**
     * Send Mail for docs
     */
    public function senddocEmail($usermail) {
        if ($this->isFraud()) {
            return;
        }
        $getSite = $this->getSiteCreds();
        $senderEmail = $getSite['senderEmail'];
        $senderName = $getSite['senderName'];

        $email_content = '<html>
        <head>
        <title>' . $getSite['siteName'] . ': Verification Documents Required!</title>
        </head>
        <body>
        <table>
        <tr><td >' . $getSite['sitelogo'] . '</td></tr>
        <tr><td colspan=2>Dear ' . $this->user->name . ',</td></tr>
        <tr><td height=10 colspan=2>Greetings from <strong>' . $getSite['siteName'] . ' !&nbsp;</strong></td></tr>
        <tr><td colspan=2>We have received your booking request.</td></tr>
        <tr><td colspan=2>While the booking is under process, we would request you to kindly forward to us the following below
        mentioned documents, as the same is required by our bankers for credit card verification.</td></tr>
        <tr><td colspan=2> <strong>Front Copy of Credit/Debit card  </strong></td></tr>
        <tr><td colspan=2> <strong>Photo I.D of Card Holder ( passport / driving license ) </strong></td></tr>
        <tr><td colspan=2>For security purposes, you could also conceal a few numeric of your credit/debit card, if required, before
        forwarding  the same to us.</td></tr>
        <tr><td colspan=2>We await your early reply to complete our transactions.</td></tr>
        <tr><td colspan=2>Thank you for booking with CheapTicket.in !</td></tr>
        <tr><td clospan=2><strong>Customer Support</strong></td></tr>
        <tr><td clospan=2><strong>' . $getSite['siteName'] . '</strong></td></tr>
        <tr><td clospan=2><strong>(A unit of Airtickets India Pvt. Ltd)</strong></td></tr>

        <tr><td colspan="2" height="20">&nbsp;</td></tr>
        <tr><td ><strong>C-101, 2nd Floor</strong></td></tr>
        <tr><td ><strong>Sector-2, Noida</strong></td></tr>
        <tr><td ><strong>Uttar Pradesh - 201301.</strong></td></tr>
        <tr><td ><strong>Telephone: +91.120.4887777</strong></td></tr>
        <tr><td ><strong>E-Mail : ' . $senderEmail . '</strong></td></tr>
        <tr><td ><strong>URL : ' . $senderName . '</strong></td></tr>
        <tr><td ><a href="http://lwcmovement.com/" target="_blank">' . $getSite['footerPromotionalImage'] . '</a></td></tr>
        </table>
        </body>
        </html>
        ';
        $subject = $getSite['siteName'] . ': Verification Documents Required For Booking Id: ' . $this->id . ' !';

        \EmailSmsLog::push_email_sms_log($senderEmail, $usermail, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_DOC, $this->id, $this->user_id);

        \Utils::sendMail($usermail, $email_content, $subject, $senderEmail, $senderName);
    }

    /**
     * Send Pre-formatted Mail for Refund confirmation
     */
    public function sendRefundEmail($usermail, $refund_number, $reference_number) {
        if ($this->isFraud()) {
            return;
        }
        $getSite = $this->getSiteCreds();
        $senderEmail = $getSite['senderEmail'];
        $senderName = $getSite['senderName'];

        $subject = 'Refund Confirmation Booking Id ' . $this->id;
        $email_content = "<html>" . $getSite['sitelogo'] . "
        <head>
        <title>Email For Refund Amount</title>
        </head>
        <body>
        <table><h4>Dear {$this->user->name},</h4><br>
        We have successfully processed the refund for your Booking Id :  {$this->id}.<br><br>
        <table>
        <tr><td><strong>Refund Amount: INR {$refund_number}</strong></td></tr>
        
        <tr><td><strong>Reference Number: {$reference_number}</strong></td></tr>
        <tr><td>The refund should reflect in your account within 2-5 working days depending on the bank.</td></tr>
        <br><br>
        Thank You!<br>" . $this->user->userInfo->getEmailFooter($this->website_id) . " <a href='http://lwcmovement.com/' target='_blank'>" . $getSite['footerPromotionalImage'] . "</a></html>";


        \EmailSmsLog::push_email_sms_log($senderEmail, $usermail, $email_content, $subject, \EmailSmsLog::CONTACT_TYPE_EMAIL, \EmailSmsLog::CATEGORY_REFUND, $this->id, $this->user_id);

        \Utils::sendMail($usermail, $email_content, $subject, $senderEmail, $senderName);
    }

    public function getCartStatus() {
        return \CartStatus::$cartStatusMap[$this->cart_status_id];
//       $cs=\CartStatus::model()->findByPk($this->id);
//       if($cs){
//           return \CartStatus::$cartStatusMap[$cs->cart_status_id];
//       }else{
//           return 'N/A';
//       }
    }

    public function getCartStatusId() {
        return $this->cart_status_id;
//       $cs=\CartStatus::model()->findByPk($this->id);
//       if($cs){
//           return $cs->cart_status_id;
//       }else{
//           return 0;
//       }
    }

    public static function getCountDocSentQueue() {
        $count = \Yii::app()->db->createCommand()->select("count(id)")->from('air_cart')
            ->where('cart_status_id=:cart_status_id AND id IN (SELECT air_cart_id from payment)', [':cart_status_id' => \CartStatus::CART_STATUS_ASK_DOCS])
            ->queryRow(false);
        //\Utils::dbgYiiLog($count);
        return $count[0];
    }

    public static function getCountDocRecvdQueue() {
        $count = \Yii::app()->db->createCommand()->select("count(id)")->from('air_cart')
            ->where('cart_status_id=:cart_status_id AND id IN (SELECT air_cart_id from payment)', [':cart_status_id' => \CartStatus::CART_STATUS_DOCS_RECEIVED])
            ->queryRow(false);
        //\Utils::dbgYiiLog($count);
        return $count[0];
    }

    public static function getCountFareDiffSentQueue() {
        $count = \Yii::app()->db->createCommand()->select("count(id)")->from('air_cart')
            ->where('cart_status_id=:cart_status_id AND id IN (SELECT air_cart_id from payment)', [':cart_status_id' => \CartStatus::CART_STATUS_FARE_DIFF_SENT])
            ->queryRow(false);
        //\Utils::dbgYiiLog($count);
        return $count[0];
    }

    public static function getCountFareDiffRecvdQueue() {
        $count = \Yii::app()->db->createCommand()->select("count(id)")->from('air_cart')
            ->where('cart_status_id=:cart_status_id AND id IN (SELECT air_cart_id from payment)', [':cart_status_id' => \CartStatus::CART_STATUS_FARE_DIFF_RECEIVED])
            ->queryRow(false);
        //\Utils::dbgYiiLog($count);
        return $count[0];
    }

    public static function getCountToAmendQueue() {
        $count = \Yii::app()->db->createCommand()->select("count(id)")->from('air_cart')
            ->where('cart_status_id=:cart_status_id AND id IN (SELECT air_cart_id from payment)', [':cart_status_id' => \CartStatus::CART_STATUS_TO_AMEND])
            ->queryRow(false);
        //\Utils::dbgYiiLog($count);
        return $count[0];
    }

    public static function getCountToCancelQueue() {
        $count = \Yii::app()->db->createCommand()->select("count(id)")->from('air_cart')
            ->where('cart_status_id=:cart_status_id AND id IN (SELECT air_cart_id from payment)', [':cart_status_id' => \CartStatus::CART_STATUS_TO_CANCEL])
            ->queryRow(false);
        //\Utils::dbgYiiLog($count);
        return $count[0];
    }

    public static function getcountToEmailNotSentQueue() {
        $sql = "SELECT cart.id
                FROM
                (SELECT t.id,
                e.id email_sms_log_id
                FROM air_cart t
                LEFT JOIN email_sms_log e ON e.air_cart_id=t.id
                AND e.contact_type='" . \EmailSmsLog::CONTACT_TYPE_EMAIL . "'
                AND e.content_type=" . \EmailSmsLog::CATEGORY_CONFIRMATION . "
                WHERE t.booking_status_id=" . \BookingStatus::STATUS_BOOKED . " AND
                      t.created > '".self::EMAIL_NOT_SENT_BEYOND_DATE."') AS cart
                WHERE cart.email_sms_log_id IS NULL
                ORDER BY cart.id DESC";
        $command = \Yii::app()->db->createCommand($sql);
        $result = $command->queryAll();
        //\Utils::dbgYiiLog($result);
        return count($result);
    }

    public function isFlightIn48hrs() {

        $airBookings = AirBooking::model()->findAll([
            'order' => 't.departure_ts',
            'condition' => "air_cart_id=$this->id"]);
        $flag = false;
        foreach ($airBookings as $booking) {
            $dep_ts = new DateTime($booking->departure_ts);
            $curdate = new DateTime('NOW');
            if ((int) $curdate->diff($dep_ts)->format("%r%a") <= 2 && (int) $curdate->diff($dep_ts)->format("%r%a") >= 0) {
                $flag = true;
                break;
            }
        }
        return $flag;
    }

    public function getCostOnPG() {

        $cost = 0;
        if (count($this->payGateLogs) > 0) {
            foreach ($this->payGateLogs as $pg) {
                if ($pg->status_id === \TrStatus::STATUS_SUCCESS && $pg->action_id === \TrAction::ACTION_SENT) {
                    $cs = CommisionPg::model()->findByAttributes(['pg_id' => (int) $pg->pg_id]);
                    if ($cs != null) {
                        if ($cs->type == CommisionPg::COMMISION_TYPE_FIXED) {
                            $cost += $cs->amount;
                        } else {
                            $cost += (((double) $pg->amount + (double) $pg->convince_fee) * (double) $cs->amount) / 100;
                        }
                    }
                }
            }
        }

        return $cost;
    }

    public function getCostOnCS() {

        if ($this->isInternational()) {
            $waytype = CommisionClientSource::WAYTYPE_INTERNATIONAL;
        } else {
            $waytype = CommisionClientSource::WAYTYPE_DOMESTIC;
        }
//        if($this->client_source_id==\ClientSource::SOURCE_DIRECT){
//            return 0;
//        }

        $cs = CommisionClientSource::model()->findByAttributes(['client_source_id' => $this->client_source_id, 'way_type' => $waytype]);
        if ($cs == null) {
            return 0;
        }
        //How to store commision per day basis?
        if ($cs->type == CommisionClientSource::COMMISION_TYPE_VAR) {
            $cscost = \CommisionCsCost::model()->findByAttributes(['cs_id' => $this->client_source_id, 'way_type' => $waytype, 'cost_date' => substr($this->created, 0, 10)]);
            if (!empty($cscost->avg_cost)) {
                return $cscost->avg_cost;
            } else {
                return 0;
            }
        }
        return $cs->amount;
    }

    public function getProfitOnGDSLCC() {
        $profit = 0;
        $flight = [];
        foreach ($this->airBookings as $booking) {
            // \Utils::dbgYiiLog($booking->id);
            if ($booking->airSource->backend->isGds) {
                $type = CommisionGdsLcc::COMMISION_TYPE_GDS;
            } else {
                $type = CommisionGdsLcc::COMMISION_TYPE_LCC;
            }


            foreach ($booking->airRoutes as $route) {
                if (!isset($flight[$booking->id][$route->carrier_id][$route->flight_number])) {
                    $flight[$booking->id][$route->carrier_id][$route->flight_number] = 'set';
                } else {
                    continue;
                }
                if ($route->isInternational()) {
                    $waytype = CommisionGdsLcc::WAYTYPE_INTERNATIONAL;
                } else {
                    $waytype = CommisionGdsLcc::WAYTYPE_DOMESTIC;
                }
                $cs = CommisionGdsLcc::model()->findByAttributes(['carrier_id' => $route->carrier_id, 'type' => $type, 'way_type' => $waytype]);
                if ($cs == null) {
                    if ($type == CommisionGdsLcc::COMMISION_TYPE_GDS) {
                        $profit += CommisionGdsLcc::getGDSDefault();
                    } else {
                        $profit += CommisionGdsLcc::getLCCDefault();
                    }
                } else {
                    $profit += $cs->amount;
                }
            }
        }
        return $profit;
    }

    public function getScreenShots() {
        return Screenshot::getScreenShotsByCartID($this->id);
    }

    public function getConvenienceFee() {
        if ($this->conv_fee !== 0) {
            return $this->conv_fee;
        }
        foreach ($this->payGateLogs as $pgl) {
            /* || $pgl->status_id == TrStatus::STATUS_PENDING */
            if ($pgl->status_id == TrStatus::STATUS_SUCCESS) {
                $this->conv_fee += $pgl->convince_fee;
            }
        }
        return $this->conv_fee;
    }

    /**
     * Added By Satender
     * Purpose: To check whether the confirmation mail is sent or not
     * @return boolean
     */
    public function isConfirmationEMailSent() {
        if ($this->booking_status_id !== \BookingStatus::STATUS_BOOKED) {
            return true;
        }
        $email_sms_log = \EmailSmsLog::model()->with('airCart')->find('t.air_cart_id = :cart_id '
            . ' AND t.contact_type = :contact_type '
            . ' AND t.content_type = :content_type', [
            ':cart_id' => $this->id,
            ':contact_type' => \EmailSmsLog::CONTACT_TYPE_EMAIL,
            ':content_type' => \EmailSmsLog::CATEGORY_CONFIRMATION,
        ]);
        if ($email_sms_log === null) {
            return false;
        }
        return true;
    }
    
    /**
     * 
     * @param type $realCart
     * Purpose:Keep the price of fake cart if new real price is less
     */
    function updateRealCartPrice($realCart) {
        foreach ($this->airBookings as $fakeAirBookings) {
            \AirBooking::model()->updateAll([
                'basic_fare' => $fakeAirBookings->basic_fare,
                'fuel_surcharge' => $fakeAirBookings->fuel_surcharge,
                'congestion_charge' => $fakeAirBookings->congestion_charge,
                'airport_tax' => $fakeAirBookings->airport_tax,
                'udf_charge' => $fakeAirBookings->udf_charge,
                'jn_tax' => $fakeAirBookings->jn_tax,
                'meal_charge' => $fakeAirBookings->meal_charge,
                'seat_charge' => $fakeAirBookings->seat_charge,
                'passtrough_fee' => $fakeAirBookings->passtrough_fee,
                'supplier_amendment_fee' => $fakeAirBookings->supplier_amendment_fee,
                'booking_fee' => $fakeAirBookings->booking_fee,
                'service_tax' => $fakeAirBookings->service_tax,
                'reseller_amendment_fee' => $fakeAirBookings->reseller_amendment_fee,
                'commission_or_discount_gross' => $fakeAirBookings->commission_or_discount_gross,
                'tds' => $fakeAirBookings->tds,
                'baggage_charge' => $fakeAirBookings->baggage_charge,
                'oc_charge' => $fakeAirBookings->oc_charge,
                'other_tax' => $fakeAirBookings->other_tax,
                'reseller_markup_base' => $fakeAirBookings->reseller_markup_base,
                'reseller_markup_fee' => $fakeAirBookings->reseller_markup_fee,
                'reseller_markup_tax' => $fakeAirBookings->reseller_markup_tax,
                'private_fare' => $fakeAirBookings->private_fare,
                'other_tax' => $fakeAirBookings->other_tax,
                'commercial_rule_id' => $fakeAirBookings->commercial_rule_id,
                'commercial_total_efect' => $fakeAirBookings->commercial_total_efect,
                    ], 'air_cart_id=:airCartId AND source_id=:source_id AND destination_id=:destination_id AND traveler_id=:traveler_id AND air_source_id=:air_source_id', [
                ':airCartId' => $realCart->id,
                ':source_id' => $fakeAirBookings->source_id,
                ':destination_id' => $fakeAirBookings->destination_id,
                ':traveler_id' => $fakeAirBookings->traveler_id,
                ':air_source_id' => $fakeAirBookings->air_source_id,
            ]);
        }
    } 

}
