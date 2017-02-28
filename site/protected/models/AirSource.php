<?php

/**
 * This is the model class for table "air_source".
 *
 * The followings are the available columns in table 'air_source':
 * @property integer $id
 * @property string $name
 * @property string $username
 * @property string $password
 * @property string $tran_username
 * @property string $tran_password
 * @property string $iata_number
 * @property string $profile_pcc
 * @property string $spare1
 * @property string $spare2
 * @property string $spare3
 * @property string $exclude_carriers
 * @property string $include_pass_carriers
 * @property double $balance
 * @property integer $backend_id
 * @property integer $is_active
 * @property integer $type_id
 * @property integer $international_auto_ticket
 * @property integer $domestic_auto_ticket
 * @property integer $display_in_search
 * @property integer $balance_link
 * @property integer $currency_id
 * @property integer $priority Priority used to distinguish the prferable result to be cached when prices are equal
 *
 * The followings are the available model relations:
 * @property AirBooking[] $airBookings
 * @property RoutesCache[] $routesCaches
 * @property Backend $backend
 * @property AirSource $balanceLink
 * @property Currency $currency
 * @property TourCode[] $tourCodes
 * @property PfCode[] $pfCodes
 */
class AirSource extends CActiveRecord {

    const SOURCE_GALILEO_TEST = 21;
    const SOURCE_GALILEO_PRODUCTION = 21;
    const TYPE_DOMESTIC = 1;
    const TYPE_INTERNATIONAL = 2;
    const TYPE_BOTH = 3;
    const CC_PASS_THROUGH = "CC";

    static $type = [
        self::TYPE_DOMESTIC => 'Domestic',
        self::TYPE_INTERNATIONAL => 'International',
        self::TYPE_BOTH => 'Both'
    ];
    static $cachedAirSources = [];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'air_source';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('name', 'required'),
            array('backend_id, is_active, type_id, international_auto_ticket, domestic_auto_ticket, display_in_search, balance_link, currency_id, priority', 'numerical', 'integerOnly' => true),
            array('username, password, tran_username, tran_password, iata_number, profile_pcc, spare1, spare2, spare3, exclude_carriers, include_pass_carriers', 'safe'),
            // The following rule is used by search().
            array('name, username, tran_username, profile_pcc, balance, is_active, backend_id', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'airBookings' => array(self::HAS_MANY, 'AirBooking', 'air_source_id'),
            'routesCaches' => array(self::HAS_MANY, 'RoutesCache', 'air_source_id'),
            'backend' => array(self::BELONGS_TO, 'Backend', 'backend_id'),
            'balanceLink' => array(self::BELONGS_TO, 'AirSource', 'balance_link'),
            'currency' => [self::BELONGS_TO, 'Currency', 'currency_id'],
            'tourCodes' => [self::HAS_MANY, 'TourCode', 'air_source_id'],
            'pfCodes' => [self::HAS_MANY, 'PfCode', 'air_source_id'],
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return [
            'id' => 'ID',
            'name' => 'Name',
            'username' => 'Username',
            'password' => 'Password',
            'tran_username' => 'Tran Username',
            'tran_password' => 'Tran Password',
            'iata_number' => 'Iata Number',
            'profile_pcc' => 'Profile Pcc',
            'spare1' => 'Spare1',
            'spare2' => 'Spare2',
            'spare3' => 'Spare3',
            'exclude_carriers' => 'Exclude Carriers',
            'include_pass_carriers' => 'Include Pass Carriers',
            'type_id' => 'Type',
            'currency_id' => 'Currency',
            'display_in_search' => 'Default'
        ];
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
        $criteria->compare('backend_id', $this->backend_id);
        $criteria->compare('currency_id', $this->currency_id);
        $criteria->compare('type_id', $this->type_id);
        $criteria->compare('display_in_search', $this->display_in_search);
        $criteria->compare('is_active', $this->is_active);
        $criteria->compare('priority', $this->priority);
        $criteria->compare('LOWER(name)', strtolower($this->name), true);
        $criteria->compare('LOWER(username)', strtolower($this->username), true);
        $criteria->compare('LOWER(tran_username)', strtolower($this->tran_username), true);
        $criteria->compare('LOWER(profile_pcc)', strtolower($this->profile_pcc), true);

        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.name'],
        ]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return AirSource the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    function getQueuingParams($journeys) {
        $firstJourney = reset($journeys);
        $firstSegment = reset($firstJourney);
        $lastSegment = end($firstJourney);
        return \AirsourceQueue::findQueue($firstSegment['origin'], $lastSegment['destination'], $firstSegment['marketingCompany'], $this->id);
    }

    function isAutoTicket($journeys) {
        $firstJourney = reset($journeys);
        $firstSegment = reset($firstJourney);
        $lastSegment = end($firstJourney);
        $servicType = \Airport::getServiceTypeIdFromCode($firstSegment['origin'], $lastSegment['destination']);
        if ($servicType === \ServiceType::INTERNATIONAL_AIR && $this->international_auto_ticket !== 0) {
            return true;
        }
        if ($servicType === \ServiceType::DOMESTIC_AIR && $this->domestic_auto_ticket !== 0) {
            return true;
        }
        return false;
    }

    /**
     * Get the form of the payment for the specific user and specific RouteCache
     * @param int $userId User ID
     * @param \RoutesCache $rc RouteCache object
     * @return string
     */
    function getFop($userId = null, \RoutesCache $rc = null) {
        if ($this->getCc($userId, $rc) !== null) {
            return self::CC_PASS_THROUGH;
        }
        return "Cash";
    }

    /**
     * Get the card for the payment for the specific user and specific RouteCache
     * @param int $userId User ID
     * @param \RoutesCache $rc RouteCache object
     * @return array CC attributes
     */
    function getCc($userId = null, \RoutesCache $rc = null) {
        if ($this->backend->isGds && $rc !== null) {
            $cc = $rc->carrier->getCcPasstru($userId);
            if ($cc !== null) {
//                $out = $cc->attributes;
                $out['code'] = $cc->getGdsCode();
                $out['exp_date'] = date('my', strtotime($cc->exp_date));
                $out['number'] = $cc->decode($cc->number);
                return $out;
            }
        }

        return null;
    }

    /**
     * Return collection of the AirSource IDs that are to be displayed in the search results and that service the sector
     * @param int $journeyType self::TYPE_DOMESTIC or self::TYPE_INTERNATIONAL
     * @param string $source 3 letter origin airport code
     * @param string $destination 3 letter destination airport code
     * @return array With IDs of the visible AirSources
     */
    static function getVisible($journeyType, $source, $destination) {
        $out = [];
        $airSources = self::model()->cache(300)->findAllByAttributes([
            'is_active' => 1
                ], [
            'condition' => 'type_id IN (:both, :type)',
            'params' => [
                ':both' => self::TYPE_BOTH,
                ':type' => $journeyType,
            ]
        ]);
        foreach ($airSources as $airSource) {
            /* @var $airSource \AirSource  */
            if ($airSource->cache(3600)->backend->isSectorServicable($source, $destination)) {
                $out[] = $airSource->id;
            }
        }
        return $out;
    }

    /**
     * Return the tour code to be used with bookings via this air source with the active company/client
     * @param string $carrier Airline 2 letter code
     * @return string The Tour Code. Empty string if there is no tour code
     */
    function getTourCode($carrier) {
        $carrierId = \Carrier::getIdFromCode($carrier);
        $userInfoId = \Utils::getActiveCompanyId();
        if ($userInfoId) {
            $userInfo = \UserInfo::model()->findByPk($userInfoId);
            $userTypeId = $userInfo->user_type_id;
        } else {
            $userInfoId = null;
            $userTypeId = null;
        }

        // Single client TC check
        if ($userInfoId !== null) {
            $modelTc = TourCode::model()->cache(60)->findByAttributes([
                'air_source_id' => $this->id,
                'user_info_id' => $userInfoId,
                'scope' => \TourCode::SCOPE_SINGLE_CLIENT,
                'carrier_id' => $carrierId,
            ]);
            if ($modelTc !== null) {
                return $modelTc->code;
            }
        }

        // Specific client type client TC check
        if ($userTypeId !== null && !empty(\TourCode::$userTypeToScopeId[$userTypeId])) {
            $modelTc = TourCode::model()->cache(60)->findByAttributes([
                'air_source_id' => $this->id,
                'scope' => \TourCode::$userTypeToScopeId[$userTypeId],
                'carrier_id' => $carrierId,
            ]);
            if ($modelTc !== null) {
                return $modelTc->code;
            }
        }

        // All clients TC check
        $modelTc = TourCode::model()->cache(60)->findByAttributes([
            'air_source_id' => $this->id,
            'scope' => \TourCode::SCOPE_ALL,
            'carrier_id' => $carrierId,
        ]);
        if ($modelTc !== null) {
            return $modelTc->code;
        }

        // No Tour Code has been found
        return '';
    }

    /**
     * Return the private fare to be used with bookings via this air source with the active company/client
     * @param string $carrier Airline 2 letter code
     * @return string The Tour Code. Empty string if there is no private fare
     */
    function getPrivateFare($carrier) {
        $carrierId = \Carrier::getIdFromCode($carrier);
        $userInfoId = \Utils::getActiveCompanyId();
        if ($userInfoId) {
            $userInfo = UserInfo::model()->findByPk($userInfoId);
            $userTypeId = $userInfo->user_type_id;
        } else {
            $userInfoId = null;
            $userTypeId = null;
        }

        // Single client PF check
        if ($userInfoId !== null) {
            $modelTc = \PfCode::model()->cache(60)->findByAttributes([
                'air_source_id' => $this->id,
                'user_info_id' => $userInfoId,
                'scope' => \TourCode::SCOPE_SINGLE_CLIENT,
                'carrier_id' => $carrierId,
            ]);
            if ($modelTc !== null) {
                return $modelTc->code;
            }
        }

        // Specific client type client PF check
        if ($userTypeId !== null && !empty(\TourCode::$userTypeToScopeId[$userTypeId])) {
            $modelTc = \PfCode::model()->cache(60)->findByAttributes([
                'air_source_id' => $this->id,
                'scope' => \TourCode::$userTypeToScopeId[$userTypeId],
                'carrier_id' => $carrierId,
            ]);
            if ($modelTc !== null) {
                return $modelTc->code;
            }
        }

        // All clients PF check
        $modelTc = \PfCode::model()->cache(60)->findByAttributes([
            'air_source_id' => $this->id,
            'scope' => \TourCode::SCOPE_ALL,
            'carrier_id' => $carrierId,
        ]);
        if ($modelTc !== null) {
            return $modelTc->code;
        }

        // No private fare has been found
        return '';
    }

    /*
     * Return false if FLy Dubai API is chosen correctly based on origin (inside/outside India)
     * @param string $origin origin of journey
     * @return boolean false if API chosen correctly
     */

    function checkAPIforFlyDubai($origin) {
        if ($this->backend_id === \Backend::FLYDUBAI_TEST) {
            if ($this->id == \application\components\Flydubai\Utils::DEFAULT_AIRSOURCES_TEST_ID) {
                $src = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $origin]);
                if ($src->country_code != \application\components\Flydubai\Utils::ORIGIN_COUNTRY)
                    return true;
            }
            if ($this->id == \application\components\Flydubai\Utils::INTERNATIONAL_AIRSOURCES_TEST_ID) {
                $src = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $origin]);
                if ($src->country_code == \application\components\Flydubai\Utils::ORIGIN_COUNTRY)
                    return true;
            }
        }else {
            if ($this->id == \application\components\Flydubai\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID) {
                $src = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $origin]);
                if ($src->country_code != \application\components\Flydubai\Utils::ORIGIN_COUNTRY)
                    return true;
            }
            if ($this->id == \application\components\Flydubai\Utils::INTERNATIONAL_AIRSOURCES_PRODUCTION_ID) {
                $src = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $origin]);
                if ($src->country_code == \application\components\Flydubai\Utils::ORIGIN_COUNTRY)
                    return true;
            }
        }
        return false;
    }

    static function cacheAllWithIdsKeys() {
        if (empty(self::$cachedAirSources)) {
            $airSources = \AirSource::model()->cache(300)->findAll();
            foreach ($airSources as $as) {
                self::$cachedAirSources[$as->id] = $as->attributes;
            }
        }
    }

}
