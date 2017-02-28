<?php

/**
 * This is the model class for table "promo_codes".
 *
 * The followings are the available columns in table 'promo_codes':
 * @property integer $id
 * @property string $code
 * @property integer $promo_type_id
 * @property string $date_valid_from
 * @property string $date_valid_to
 * @property integer $promo_date_type_id
 * @property integer $ref_user_info_id
 * @property integer $max_count
 * @property double $value
 * @property integer $promo_discount_type_id
 * @property string $created
 * @property integer $enabled
 * @property double $min_amount
 * @property double $max_value
 * @property double $ref_value
 * @property double $ref_value_type_id
 * @property double $ref_max_value
 * @property string $filter
 * @property integer $way_type
 * @property integer $per_user
 * @property string $tnc_url
 *
 *
 * The followings are the available model relations:
 * @property PromoType $promoType
 * @property PromoDiscountType $promoDiscountType
 * @property PromoDateType $promoDateType
 * @property UserInfo $refUserInfo
 * @property AirCart[] $airCarts
 * @property PromoDiscountType $refType
 * @property PromoRange[] $promoRanges
 *
 */
class PromoCodes extends CActiveRecord {

    const WAYTYPE_BOTH = 1;
    const WAYTYPE_DOMESTIC = 2;
    const WAYTYPE_INTERNATIONAL = 3;

    const DEFAULT_TNC_URL = 'https://cheapticket.in/b2c/cms/promotnc/40';
    
    static $waytypeMap = [
        self::WAYTYPE_BOTH => 'BOTH',
        self::WAYTYPE_DOMESTIC => 'DOMESTIC',
        self::WAYTYPE_INTERNATIONAL => 'INTERNATIONAL',
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'promo_codes';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('code, promo_type_id,value, promo_discount_type_id', 'required'),
            ['code', 'ext.ECompositeUniqueValidator', 'message' => 'Promocode Already exists'],
            array('promo_type_id, promo_discount_type_id, promo_date_type_id, promo_discount_type_id, ref_value_type_id,enabled,ref_user_info_id,way_type, per_user', 'numerical', 'integerOnly' => true),
            array('value,ref_value,ref_max_value, min_amount,max_count,max_value', 'numerical', 'min' => 0),
            array('date_valid_from, date_valid_to', 'CDateValidator', 'format' => 'yyyy-MM-dd', 'message' => 'Use YYYY-MM-DD date format'),
            array('code, date_valid_from, date_valid_to,filter, per_user, tnc_url', 'safe'),
            array('date_valid_from,max_value, date_valid_to, min_amount, max_count', 'default', 'setOnEmpty' => true, 'value' => null),
            array('ref_value, ref_value_type_id, ref_user_info_id', 'validateReferral'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
//            array('', 'safe', 'on' => 'search'),
        );
    }

    public function validateReferral($attribute, $params) {
        if ($this->promo_type_id == \PromoType::REFERAL_TYPE) {
            $labels = $this->attributeLabels();
            if ($this->$attribute == '') {
                $this->addError($attribute, $labels[$attribute] . ' cannot be blank');
            }
        }
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'promoType' => array(self::BELONGS_TO, 'PromoType', 'promo_type_id'),
            'promoDiscountType' => array(self::BELONGS_TO, 'PromoDiscountType', 'promo_discount_type_id'),
            'promoDateType' => array(self::BELONGS_TO, 'PromoDateType', 'promo_date_type_id'),
            'refUserInfo' => array(self::BELONGS_TO, 'UserInfo', 'ref_user_info_id'),
            'airCarts' => array(self::HAS_MANY, 'AirCart', 'promo_codes_id'),
            'refType' => array(self::BELONGS_TO, 'PromoDiscountType', 'ref_value_type_id'),
            'promoRanges' => array(self::HAS_MANY, 'PromoRange', 'promo_code_id'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id' => 'ID',
            'code' => 'Promo Code',
            'date_valid_from' => 'Valid From',
            'date_valid_to' => 'Valid To',
            'promo_date_type_id' => 'Date Type',
            'ref_user_info_id' => 'Referred By',
            'max_count' => 'Max Times usage allowed',
            'value' => 'Value',
            'min_amount' => 'Minimum Invoice Amount',
            'max_count' => 'Maximum Count',
            'promo_discount_type_id' => 'Discount Type',
            'enabled' => 'Enable',
            'max_value' => 'Maximum Value of Promo',
            'ref_value' => 'Value Given to Referral',
            'ref_value_type_id' => 'Referral Value Type',
            'ref_max_value' => 'Maximum Possible Value of Referral',
            'filter' => 'Filter',
            'per_user' => 'Per User',
            'tnc_url' => 'Terms & conditions URL',
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

        $criteria->compare('promo_type_id', $this->promo_type_id);
        $criteria->compare('value', $this->value);
        $criteria->addSearchCondition('code', $this->code);
        $criteria->compare('promo_discount_type_id', $this->promo_discount_type_id);
        $criteria->compare('promo_date_type_id', $this->promo_date_type_id);
        $criteria->compare('per_user',$this->per_user);


        return new CActiveDataProvider($this, [
            'criteria' => $criteria,
            'sort' => ['defaultOrder' => 't.id DESC'],
        ]);
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

    public static function checkPromoCode($promocode, $booking) {
        //load Promo Code
        //   \Utils::dbgYiiLog('load Promo Code');
        $promo = \PromoCodes::model()->findByAttributes(
            array('code' => $promocode), array(
            'condition' => 'enabled=:enabled',
            'params' => array(':enabled' => 1)
        ));
        //If Promo code does not exists
        if (!$promo) {
            return array('error' => 'This Promo Code does not exist');
        }
        //If there are no flights
        if (!isset($booking->flights)) {
            return ['error' => 'This booking has no flights'];
        }
        /*
         * Added to assign logged-in user to booking to overcome
         * referal PromoCode not applied after login
         */
        if (!\Yii::app()->user->isGuest){
            $user = \Users::model()->findByPk(\Yii::app()->user->id);
            $booking->user = $user;
        }
        
        //Promo Code Enabled
        if (isset($promo->enabled) && $promo->enabled != 1) {
            return array('error' => 'This Promo Code is invalid.');
        }
        $price = $booking->price;
        /* foreach ($booking->flights as $flight) {
            $price += $flight->getCommercialPrice();
        } */
        
        //Minimum amount validity
        if (isset($promo->min_amount) && !empty($promo->min_amount)) {
            if ($price < $promo->min_amount) {
                return array('error' => 'Minimum cart value for this promo code is ' . $promo->min_amount);
            }
        }
        $dom = true;
        //Domestic International Matching
        if ($promo->way_type !== \PromoCodes::WAYTYPE_BOTH) {
            foreach ($booking->flights as $flight) {
                if ($flight->search->is_domestic != 1) {
                    $dom = false;
                }
            }
            if ($promo->way_type === \PromoCodes::WAYTYPE_DOMESTIC && $dom == false) {
                return array('error' => 'Promo Code valid only for Domestic Flights');
            }
            if ($promo->way_type === \PromoCodes::WAYTYPE_INTERNATIONAL && $dom == true) {
                return array('error' => 'Promo Code valid only for International Flights');
            }
        }

        //    \Utils::dbgYiiLog('Minimum amount validity');
        //Date validity
        if (isset($promo->promo_date_type_id) && !empty($promo->promo_date_type_id)) {
            if ($promo->promo_date_type_id === \PromoDateType::BOOKING_DATE) {
                if (isset($promo->date_valid_from)) {
                    $from_date = strtotime($promo->date_valid_from);
                    $todays_date = date("Y-m-d");
                    $today = strtotime($todays_date);

                    if ($from_date > $today) {
                        return array('error' => 'This Promo code is valid from ' . $promo->date_valid_from);
                    }
                }
                if (isset($promo->date_valid_to)) {
                    $to_date = strtotime($promo->date_valid_to);
                    $todays_date = date("Y-m-d");
                    $today = strtotime($todays_date);

                    if ($to_date < $today) {
                        return array('error' => 'This Promo Code is expired');
                    }
                }
            } else if ($promo->promo_date_type_id === \PromoDateType::TRAVEL_DATE) {
                $flag = false;
                foreach ($booking->flights as $flight) {
                    $legs = $flight->isGDS() ? json_decode($flight->routes[0][0]->legs_json)[0] : json_decode($flight->routes[0][0]->legs_json);
                    foreach ($legs as $i) {
                        $depart_date = strtotime($i->depart);
                        if (isset($promo->date_valid_from)) {
                            $valid_from = strtotime($promo->date_valid_from);
                            if ($depart_date > $valid_from) {
                                if (isset($promo->date_valid_to)) {
                                    $valid_to = strtotime($promo->date_valid_to);
                                    if ($depart_date < $valid_to) {
                                        $flag = true;
                                    }
                                } else {
                                    $flag = true;
                                }
                            }
                        } else if (isset($promo->date_valid_to)) {
                            $valid_to = strtotime($promo->date_valid_to);
                            if ($depart_date < $valid_to) {
                                $flag = true;
                            }
                        } else {
                            $flag = true;
                        }
                    }
                }

                if (!$flag) {
                    return array('error' => 'Promo Code is not valid for this cart');
                }
            }
        }
        if (!empty($promo->ref_user_info_id) && empty($booking->user)) {
            return array('error' => 'Please Login before applying this Promo Code');
        }
        if (!empty($promo->ref_user_info_id) && !empty($booking->user) && (int) $booking->user->userInfo->id === (int) $promo->ref_user_info_id) {
            return array('error' => 'Promo Code is not valid for this user');
        }
        //    \Utils::dbgYiiLog('Date validity');
        if (!$promo->checkPromoFilterByBooking($booking)) {
            return array('error' => 'Promo Code is not valid for this cart');
        }
        /*
        if (isset($promo->max_count) && !empty($promo->max_count) && isset($promo->per_user) && !empty($promo->per_user) && empty($booking->user)) {
            return array('error' => 'You can apply Promo Code is not valid for this cart');
        }
        */
        //per user max count check
        if (isset($promo->per_user) && !empty($promo->per_user)) {
            if (isset($promo->max_count) && !empty($promo->max_count) && !empty($booking->user)) {
                $count = \Yii::app()->db->createCommand()
                    ->select('count(a.*)')
                    ->from('air_cart a')
                    ->join('users u', 'u.id=a.user_id')
                    ->where('promo_codes_id=:pid and u.user_info_id=:uid', array(':pid' => $promo->id, ':uid' => $booking->user->userInfo->id))
                    ->queryRow();

                // \Utils::dbgYiiLog($count);
                if (isset($promo->max_count) && (int) $promo->max_count <= (int) $count['count']) {
                    return array('error' => 'You have reached maximum use limit.');
                }
            }
        } else if (isset($promo->max_count) && !empty($promo->max_count)) { //Max Count check
            $count = \Yii::app()->db->createCommand()
                ->select('count(*)')
                ->from('air_cart a')
                ->where('promo_codes_id=:pid', array(':pid' => $promo->id))
                ->queryRow();

            //  \Utils::dbgYiiLog($count);
            if (isset($promo->max_count) && (int) $promo->max_count <= (int) $count['count']) {
                return array('error' => 'Promo Code reached maximum use limit');
            }
        }

        $promo_range = self::_getPromoRangeValue($booking, $promo);
        if (count($promo_range) > 0) {
            return $promo_range;
        }

        return self::_getPromoResult($promo->value, $promo->promoDiscountType->id, $promo->max_value, $price, $promo, $booking);
    }

    private static function _getPromoResult($value, $discount_type, $max_dicsount, $price, $promo, $booking) {
        if ($discount_type === \PromoDiscountType::FIXED) {
            return array('original' => $price, 'value' => round($value), 'id' => $promo->id, 'code' => $promo->code, 'promo_tnc_url'=>$promo->tnc_url);
        } else if ($discount_type === \PromoDiscountType::PERCENTAGE) {
            $value = $price * ((double) $value) / 100;

            if (isset($max_dicsount) && $value > $max_dicsount)
                $value = $max_dicsount;

            return array('original' => $price, 'value' => round($value), 'id' => $promo->id, 'code' => $promo->code, 'promo_tnc_url'=>$promo->tnc_url);
        } else if ($discount_type === \PromoDiscountType::PERCENTAGEBASE) {
        	$value = $booking->taxes['basic_fare'] * ((double) $value) / 100;
        	
        	if (isset($max_dicsount) && $value > $max_dicsount)
        		$value = $max_dicsount;
        	
        		return array('original' => $price, 'value' => round($value), 'id' => $promo->id, 'code' => $promo->code, 'promo_tnc_url'=>$promo->tnc_url);
        }
    }

    private static function _getPromoRangeValue($booking, $promo) {
    	$price = $booking->price;

        $promoRange = \Yii::app()->db->createCommand()
            ->select('*')
            ->from('promo_range')
            ->where('promo_code_id=:pid AND (transaction_amt_from <= :amt AND transaction_amt_to >= :amt)', array(':pid' => $promo->id, ':amt' => $price))
            ->queryRow();
        if (count($promoRange) > 0 && !empty($promoRange['discount_value'])) {
            unset($promoRange['id']);
            $promoRangeObj = new PromoRange();
            $promoRangeObj->setAttributes($promoRange);
            return self::_getPromoResult($promoRangeObj->discount_value, $promoRangeObj->discount_type, $promoRangeObj->max_discount_value, $price, $promo, $booking);
        }
        return [];
    }

    public static function checkPromoCodeByAircart($promocode, $aircartid) {
        //load Promo Code
        //   \Utils::dbgYiiLog('load Promo Code');
        $promo = \PromoCodes::model()->findByAttributes(
            array('code' => $promocode), array(
            'condition' => 'enabled=:enabled',
            'params' => array(':enabled' => 1)
        ));
        //If Promo code does not exists
        if (!$promo) {
            return array('error' => 'This Promo Code does not exist');
        }
        // $booking = self::load($bookingid);
        if (!$booking->user) {
            return array('error' => 'Booking does not exist');
        } else {
            //Promo Code Enabled
            if (isset($promo->enabled) && $promo->enabled != 1) {
                return array('error' => 'This Promo Code is invalid.');
            }
            //Minimum amount validity
            if (isset($promo->min_amount) && !empty($promo->min_amount)) {
                $price = 0;
                foreach ($booking->flights as $flight) {
                    $price += $flight->getCommercialPrice();
                }

                if ($price < $promo->min_amount) {
                    return array('error' => 'Minimum cart value for this promo code is ' . $promo->min_amount);
                }
            }
            //    \Utils::dbgYiiLog('Minimum amount validity');
            //Date validity
            if (isset($promo->promo_date_type_id) && !empty($promo->promo_date_type_id)) {
                if ($promo->promo_date_type_id === \PromoDateType::BOOKING_DATE) {
                    if (isset($promo->date_valid_from)) {
                        $from_date = strtotime($promo->date_valid_from);
                        $todays_date = date("Y-m-d");
                        $today = strtotime($todays_date);

                        if ($from_date > $today) {
                            return array('error' => 'This Promo code is valid from ' . $promo->date_valid_from);
                        }
                    }
                    if (isset($promo->date_valid_to)) {
                        $to_date = strtotime($promo->date_valid_to);
                        $todays_date = date("Y-m-d");
                        $today = strtotime($todays_date);

                        if ($to_date < $today) {
                            return array('error' => 'This Promo Code is expired');
                        }
                    }
                } else if ($promo->promo_date_type_id === \PromoDateType::TRAVEL_DATE) {
                    $flag = false;
                    foreach ($booking->flights as $flight) {
                        $legs = $flight->isGDS() ? json_decode($flight->routes[0][0]->legs_json)[0] : json_decode($flight->routes[0][0]->legs_json);
                        foreach ($legs as $i) {
                            if (isset($promo->date_valid_from)) {
                                $from_date = strtotime($i->depart);
                                $todays_date = date("Y-m-d");
                                $today = strtotime($todays_date);
                                if ($from_date > $today) {
                                    if (isset($promo->date_valid_to)) {
                                        $to_date = strtotime($i->depart);
                                        $todays_date = date("Y-m-d");
                                        $today = strtotime($todays_date);
                                        if ($to_date < $today) {
                                            $flag = true;
                                        }
                                    } else {
                                        $flag = true;
                                    }
                                }
                            } else if (isset($promo->date_valid_to)) {
                                $to_date = strtotime($i->depart);
                                $todays_date = date("Y-m-d");
                                $today = strtotime($todays_date);
                                if ($to_date < $today) {
                                    $flag = true;
                                }
                            } else {
                                $flag = true;
                            }
                        }
                    }

                    if (!$flag) {
                        return array('error' => 'Promo Code is not valid for this cart');
                    }
                }
            }
            //    \Utils::dbgYiiLog('Date validity');
            if (!$promo->checkPromoFilterByBooking($booking)) {
                return array('error' => 'Promo Code is not valid for this cart');
            }

            /*    if(!empty($booking->aircart_id)){
              \Utils::dbgYiiLog('$booking->aircart_id');
              $ac=  \AirCart::model()->findByPk((int)$booking->aircart_id);
              if(!$promo->checkPromoFilter($ac)){
              return array('error' => 'Promo Code is not valid for this cart');
              }
              }else if(!empty($booking->fakecart_id)){
              \Utils::dbgYiiLog('$booking->fakecart_id');
              $ac=  \AirCart::model()->findByPk((int)$booking->fakecart_id);
              if(!$promo->checkPromoFilter($ac)){
              return array('error' => 'Promo Code is not valid for this cart');
              }
              } */


            //Max Count check
            if (isset($promo->max_count) && !empty($promo->max_count)) {

                $count = \Yii::app()->db->createCommand()
                    ->select('count(*)')
                    ->from('air_cart a')
                    ->join('users u', 'u.id=a.user_id')
                    ->where('promo_codes_id=:pid and u.user_info_id=:uid', array(':pid' => $promo->id, ':uid' => $booking->user->userInfo->id))
                    ->queryRow();

                //  \Utils::dbgYiiLog($count);
                if (isset($promo->max_count) && (int) $promo->max_count <= (int) $count['count']) {
                    return array('error' => 'Promo Code reached maximum use limit');
                }
            }

            //calculate promo code discount
            $price = 0;
            foreach ($booking->flights as $flight) {
                $price += $flight->getCommercialPrice();
            }
            $value = $promo->value;
            if ($promo->promoDiscountType->id === \PromoDiscountType::FIXED) {
                //  \Utils::dbgYiiLog(array('original' => $price, 'value' => $value));
                return array('original' => $price, 'value' => $value);
            } else if ($promo->promoDiscountType->id === \PromoDiscountType::PERCENTAGE) {
                $value = $price * ((double) $promo->value) / 100;

                if (isset($promo->max_value) && $value > $promo->max_value)
                    $value = $promo->max_value;


                //  \Utils::dbgYiiLog(array('original' => $price, 'value' => $value));
                return array('original' => $price, 'value' => $value);
            }
        }
    }

    public function checkPromoFilter(\AirCart $ac) {
        $promoFilter = new \PromoFilter(json_decode($this->filter));
        return $promoFilter->matchAirCart($ac);
    }

    public function checkPromoFilterByBooking($booking) {
        $promoFilter = new \PromoFilter(json_decode($this->filter));
        return $promoFilter->matchB2CBooking($booking);
    }

}
