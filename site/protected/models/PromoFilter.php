<?php

/**
 * Description of PromoFilter
 *
 */
class PromoFilter {

    /**
     * @var PromoFilterElements $include
     */
    public $include;

    /**
     * @var PromoFilterElements $exclude
     */
    public $exclude;

    function __construct($data = null) {
        $this->include = new PromoFilterElements;
        $this->exclude = new PromoFilterElements;
        if ($data !== null) {
            $this->include->air_sources = $data->include->air_sources;
            $this->include->user_types = $data->include->user_types;
            $this->include->user_infos = $data->include->user_infos;
            $this->include->airlines = $data->include->airlines;
            $this->include->users = $data->include->users;
           // $this->include->payment_types = $data->include->payment_types;
          //  $this->include->card_types = $data->include->card_types;
          //  $this->include->payment_gateways = $data->include->payment_gateways;

            $this->exclude->air_sources = $data->exclude->air_sources;
            $this->exclude->user_types = $data->exclude->user_types;
            $this->exclude->user_infos = $data->exclude->user_infos;
            $this->exclude->airlines = $data->exclude->airlines;
            $this->exclude->users = $data->exclude->users;
          //  $this->exclude->payment_types = $data->exclude->payment_types;
          //  $this->exclude->card_types = $data->exclude->card_types;
          //  $this->exclude->payment_gateways = $data->exclude->payment_gateways;
        }
    }

    function getAsString() {
        return json_encode([
            'include' => $this->include,
            'exclude' => $this->exclude,
        ]);
    }

    function setAttributes($post) {
        
        $this->include->air_sources = $post['include']['air_sources'];
        $this->include->user_types = $post['include']['user_types'];
        $this->include->user_infos = $post['include']['user_infos'];
        $this->include->airlines = $post['include']['airlines'];
        $this->include->users = $post['include']['users'];
      //  $this->include->payment_types = $post['include']['payment_types'];
      // $this->include->card_types = $post['include']['card_types'];
      //  $this->include->payment_gateways = $post['include']['payment_gateways'];

        $this->exclude->air_sources = $post['exclude']['air_sources'];
        $this->exclude->user_types = $post['exclude']['user_types'];
        $this->exclude->user_infos = $post['exclude']['user_infos'];
        $this->exclude->airlines = $post['exclude']['airlines'];
        $this->exclude->users = $post['exclude']['users'];
       // $this->exclude->payment_types = $post['exclude']['payment_types'];
       // $this->exclude->card_types = $post['exclude']['card_types'];
       // $this->exclude->payment_gateways = $post['exclude']['payment_gateways'];
    }

    function getSummary() {
        $strInclude = '';
        $strExclude = '';
        foreach (PromoFilterElements::$description as $key => $value) {
            if (!empty($this->include->$key)) {
                $strInclude .= "$key: {$this->include->$key}, ";
            }
            if (!empty($this->exclude->$key)) {
                $strExclude .= "$key: {$this->exclude->$key}, ";
            }
        }
        if (strlen($strInclude)) {
            $strInclude = "<b>Include:</b> " . rtrim($strInclude, ', ');
        }
        if (strlen($strExclude)) {
            $strExclude = " <b>Exclude:</b> " . rtrim($strExclude, ', ');
        }
        return $strInclude . $strExclude;
    }

    function matchAirCart(\AirCart $ac) {
        if ($this->exclude->matchAirCartExclude($ac)) {
            return false;
        }
        return $this->include->matchAirCartInclude($ac);
    }
    
    function matchB2CBooking($booking) {
        
        if ($this->exclude->matchBookingExclude($booking)) {
         //   \Utils::dbgYiiLog('matchBookingExclude true');
            return false;
        }
      //  \Utils::dbgYiiLog('matchBookingExclude false');
        return $this->include->matchBookingInclude($booking);
    }
    
    function getStringForElements(){
        $promoFilterString=null;
        if(!empty($this->include->air_sources)){
            $str='[';
            $arr=explode(',',$this->include->air_sources);
            foreach ($arr as $value) {
              $mod= \AirSource::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['airsource_include']=$str;
        }
        if(!empty($this->exclude->air_sources)){
            $str='[';
            $arr=explode(',',$this->exclude->air_sources);
            foreach ($arr as $value) {
              $mod= \AirSource::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['airsource_exclude']=$str;
        }
        if(!empty($this->include->user_types)){
            $str='[';
            $arr=explode(',',$this->include->user_types);
            foreach ($arr as $value) {
              $mod= \UserType::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['user_types_include']=$str;
        }
        if(!empty($this->exclude->user_types)){
            $str='[';
            $arr=explode(',',$this->exclude->user_types);
            foreach ($arr as $value) {
              $mod= \UserType::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['user_types_exclude']=$str;
        }
        if(!empty($this->include->user_infos)){
            $str='[';
            $arr=explode(',',$this->include->user_infos);
            foreach ($arr as $value) {
              $mod= \UserInfo::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['user_infos_include']=$str;
        }
        if(!empty($this->exclude->user_infos)){
            $str='[';
            $arr=explode(',',$this->exclude->user_infos);
            foreach ($arr as $value) {
              $mod= \UserInfo::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['user_infos_exclude']=$str;
        }
        if(!empty($this->include->airlines)){
            $str='[';
            $arr=explode(',',$this->include->airlines);
            foreach ($arr as $value) {
              $mod= \Carrier::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['airlines_include']=$str;
        }
        if(!empty($this->exclude->airlines)){
            $str='[';
            $arr=explode(',',$this->exclude->airlines);
            foreach ($arr as $value) {
              $mod= \Carrier::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['airlines_exclude']=$str;
        }
        if(!empty($this->include->users)){
            $str='[';
            $arr=explode(',',$this->include->users);
            foreach ($arr as $value) {
              $mod= \Users::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['users_include']=$str;
        }
        if(!empty($this->exclude->users)){
            $str='[';
            $arr=explode(',',$this->exclude->users);
            foreach ($arr as $value) {
              $mod= \Users::model()->findByPk((int)$value);
              if($mod!=null){
                  $str.="{'id':'$mod->id','name':'$mod->name'},";
              }
                
            }
            $str.=']';
            $promoFilterString['users_exclude']=$str;
        }
       // \Utils::dbgYiiLog($promoFilterString);
        return $promoFilterString;
    }
    
}

class PromoFilterElements {

    public
            $air_sources = '',
            $user_types = '',
            $user_infos = '',
            $airlines = '',
            $users = '',
            $payment_types = '',
            $card_types = '',
            $payment_gateways = '';
    static $description = [
        'air_sources' => 'air_sources',
        'user_types' => 'user_types',
        'user_infos' => 'user_infos',
        'airlines' => 'airlines',
        'users' => 'users',
        'payment_types' => 'payment_types',
        'card_types' => 'card_types',
        'payment_gateways' => 'payment_gateways',
    ];

    /**
     * Exclude logic filter checks. Check all rules or until first exclude match
     * @param \AirCart $ac AirCart object
     * @return boolean False if no matching rule is found or the filter is empty
     */
    
    function matchAirCartExclude(\AirCart $ac) {
        if (!empty($this->air_sources) &&
                self::airSourceMatch($this->air_sources, $ac) === true) {
            return true;
        }
        if (!empty($this->user_types) &&
                self::userTypeMatch($this->user_types, $ac->user->userInfo->user_type_id) === true) {
            return true;
        }
        if (!empty($this->user_infos) &&
                self::userInfoMatch($this->user_infos, $ac->user->user_info_id) === true) {
            return true;
        }
        if (!empty($this->airlines) &&
                self::airlineMatch($this->airlines, $ac) === true) {
            return true;
        }
        if (!empty($this->users) &&
                self::userMatch($this->users, $ac->user_id) === true) {
            return true;
        }
//        if (!empty($this->payment_types) &&
//                self::paymentTypeMatch($this->payment_types, $ac) === true) {
//            return true;
//        }
//        if (!empty($this->card_types) &&
//                self::cardTypeMatch($this->card_types, $ac) === true) {
//            return true;
//        }
//        if (!empty($this->payment_gateways) &&
//                self::paymentGatewayMatch($this->origin_airport, $ac) === true) {
//            return true;
//        }
        

        return false;   // No exclude rules found
    }

    /**
     * Include logic filter checks. If include all then return true otherwise false
     * @param \AirCart $ac AirCart object
     * @return boolean True if matching rule is found or the filter is empty
     */
     
    function matchAirCartInclude(\AirCart $ac) {
        if (!empty($this->air_sources)) {
            if (self::airSourceMatch($this->air_sources, $ac) !== true) {
                return false;
            }
        }
        if (!empty($this->user_types)) {
            if (self::userTypeMatch($this->user_types, $ac->user->userInfo->user_type_id) !== true) {
                return false;
            }
        }
        if (!empty($this->user_infos)) {
            if (self::userInfoMatch($this->user_infos, $ac->user->user_info_id) !== true) {
                return false;
            }
        }
        if (!empty($this->airlines)) {
            if (self::airlineMatch($this->airlines, $ac) !== true) {
                return false;
            }
        }
        if (!empty($this->users)) {
            if (self::userMatch($this->users, $ac->user_id) !== true) {
                return false;
            }
        }
//        if (!empty($this->payment_types)) {
//            $noAnyFilterRules = false;
//            if (self::paymentTypeMatch($this->payment_types, $ac) === true) {
//                return true;
//            }
//        }
//        if (!empty($this->card_types)) {
//            $noAnyFilterRules = false;
//            if (self::cardTypeMatch($this->card_types, $ac) === true) {
//                return true;
//            }
//        }
//        if (!empty($this->payment_gateways)) {
//            $noAnyFilterRules = false;
//            if (self::paymentGatewayMatch($this->payment_gateways, $ac) === true) {
//                return true;
//            }
//        }
        

        return true;    // No any include rules found
    }

    /**
     * Exclude logic filter checks. Check all rules or until first exclude match
     * @param \AirCart $ac AirCart object
     * @return boolean False if no matching rule is found or the filter is empty
     */
    
    function matchBookingExclude($booking) {
        //Check for booking user
        if((!empty($this->user_types)||!empty($this->user_infos)||!empty($this->users))&& empty($booking->user)){
            return true;
        }
        if (!empty($this->air_sources) &&
                self::airSourceBookingMatch($this->air_sources, $booking) === true) {
            return true;
        }
        if (!empty($this->user_types) &&
                self::userTypeMatch($this->user_types, $booking->user->userInfo->userType->id) === true) {
            return true;
        }
        if (!empty($this->user_infos) &&
                self::userInfoMatch($this->user_infos, $booking->user->userInfo->id) === true) {
            return true;
        }
        if (!empty($this->airlines) &&
                self::airlineBookingMatch($this->airlines, $booking) === true) {
            return true;
        }
        if (!empty($this->users) &&
                self::userMatch($this->users, $booking->user->id) === true) {
            return true;
        }
//        if (!empty($this->payment_types) &&
//                self::paymentTypeMatch($this->payment_types, $ac) === true) {
//            return true;
//        }
//        if (!empty($this->card_types) &&
//                self::cardTypeMatch($this->card_types, $ac) === true) {
//            return true;
//        }
//        if (!empty($this->payment_gateways) &&
//                self::paymentGatewayMatch($this->origin_airport, $ac) === true) {
//            return true;
//        }
        

        return false;   // No exclude rules found
    }
    
    /**
     * Include logic filter checks. If include all then return true otherwise false
     * @param $ac AirCart object
     * @return boolean True if matching rule is found or the filter is empty
     */
     
    function matchBookingInclude($booking) {
      //  \Utils::dbgYiiLog('Include air_sources ');
        //Check for booking user
        if((!empty($this->user_types)||!empty($this->user_infos)||!empty($this->users))&& empty($booking->user)){
            return false;
        }
        if (!empty($this->air_sources)) {
            if (self::airSourceBookingMatch($this->air_sources, $booking) !== true) {
                return false;
            }
        }
     //   \Utils::dbgYiiLog('Include user_types ');
        if (!empty($this->user_types)) {
            if ( self::userTypeMatch($this->user_types, $booking->user->userInfo->userType->id) !== true) {
                return false;
            }
        }
    //    \Utils::dbgYiiLog('Include user_infos ');
        if (!empty($this->user_infos)) {
            if (self::userInfoMatch($this->user_infos, $booking->user->userInfo->id) !== true) {
                return false;
            }
        }
    //    \Utils::dbgYiiLog('Include airlines ');
        if (!empty($this->airlines)) {
            if (self::airlineBookingMatch($this->airlines, $booking) !== true) {
                return false;
            }
        }
    //    \Utils::dbgYiiLog('Include users ');
        if (!empty($this->users)) {
            if (self::userMatch($this->users, $booking->user->id) !== true) {
                return false;
            }
        }
//        if (!empty($this->payment_types)) {
//            $noAnyFilterRules = false;
//            if (self::paymentTypeMatch($this->payment_types, $ac) === true) {
//                return true;
//            }
//        }
//        if (!empty($this->card_types)) {
//            $noAnyFilterRules = false;
//            if (self::cardTypeMatch($this->card_types, $ac) === true) {
//                return true;
//            }
//        }
//        if (!empty($this->payment_gateways)) {
//            $noAnyFilterRules = false;
//            if (self::paymentGatewayMatch($this->payment_gateways, $ac) === true) {
//                return true;
//            }
//        }
        

        return true;    // No any include rules found
    }
    
    static function airSourceMatch($filterSource, $aircart) {
        if (empty($filterSource)) {
            return true;
        }
        $arrSources = array_map('trim', explode(',', $filterSource));
        foreach ($arrSources as $fsrc) {
            foreach($aircart->airBookings as $booking) {                
                if ((int)$fsrc == (int)$booking->air_source_id) {
                    return true;
                }
            }
        }
        return false;
    }
    
    static function airSourceBookingMatch($filterSource, $booking) {
        if (empty($filterSource)) {
            return true;
        }
        $arrSources = array_map('trim', explode(',', $filterSource));
        foreach ($arrSources as $fsrc) {
            foreach($booking->flights as $flight) {                
                if ((int)$fsrc == (int)$flight->airSource->id) {
                    return true;
                }
            }
        }
        return false;
    }
    
    static function userTypeMatch($filterType, $usertype) {
        if (empty($filterType)) {
            return true;
        }
        $arrTypes = array_map('trim', explode(',', $filterType));
        foreach ($arrTypes as $ftype) {
            if ((int)$ftype == (int)$usertype) {
                return true;
            }
        }
        return false;
    }
    
    static function userInfoMatch($filterInfo, $userinfo) {
        if (empty($filterInfo)) {
            return true;
        }
        $arr = array_map('trim', explode(',', $filterInfo));
        foreach ($arr as $v) {
            if ((int)$v == (int)$userinfo) {
                return true;
            }
        }
        
        return false;
    }    
    
    static function airlineMatch($filter, $aircart) {
        if (empty($filter)) {
            return true;
        }
        $arr = array_map('trim', explode(',', $filter));
        foreach ($arr as $v) {
            foreach($aircart->airBookings as $booking) {
                if ((int)$v == (int)$booking->carrier_id) {
                    return true;
                }
            }
        }
        return false;
    }
    
    static function airlineBookingMatch($filter, $booking) {
        if (empty($filter)) {
            return true;
        }
        $arr = array_map('trim', explode(',', $filter));
        foreach ($arr as $v) {
            foreach($booking->flights as $flight) {
                if ((int)$v == (int)$flight->carrier->id) {
                    return true;
                }
            }
        }
        return false;
    }
    
    static function userMatch($filter, $user) {
        if (empty($filter)) {
            return true;
        }
        $arr = array_map('trim', explode(',', $filter));
        foreach ($arr as $v) {
            if ((int)$v == (int)$user) {
                return true;
            }
        }
        return false;
    }
    
    static function paymentTypeMatch($filter, $aircart) {
        if (empty($filter)) {
            return true;
        }
        $arr = array_map('trim', explode(',', $filter));
        foreach ($arr as $v) {
            foreach($aircart->airBookings as $booking) {
                if ((int)$v == (int)$booking->carrier_id) {
                    return true;
                }
            }
        }
        return false;
    }
    
}
