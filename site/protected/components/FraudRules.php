<?php

class FraudRules {

    const SCORE_COUNTRY_IP_CARD = 10;
    const SCORE_COUNTRY_IP_MOBILE = 10;
    const SCORE_COUNTRY_MOBILE_CARD = 10;
    const SCORE_3DS_Y=25;
    const SCORE_3DS_N=0;
    const SCORE_3DS_A=10;
    const SCORE_AIRSOURCE_DIRECT = 0;
    const SCORE_AIRSOURCE_INDIRECT = 10;
    const SCORE_NAME_MATCH=10;
    const SCORE_NAME_NOT_MATCH=0;
    const SCORE_PREVIOUS_TRANSACTION_YES = 10;
    const SCORE_PREVIOUS_TRANSACTION_NO = 0;
    const SCORE_CART_FILE_YES=10;
    const SCORE_CART_FILE_NO=0;
    static $freeEmailProviders = ['@gmail','@yahoo','@hotmail','@live','@msn','@rediff','@aol'];
    const SCORE_FREE_MAIL_YES=0;
    const SCORE_FREE_MAIL_NO=10;
    const SCORE_FRAUD_THRESHOLD = 70;
    
    public $aircart;

    function applyFraudRules() {
        $score=0;
        $score+=$this->countryRule();        
        $score+=$this->trans3DSRule();
        $score+=$this->airSourceRule();
        $score+=$this->nameRule();
        $score+=$this->emailRule();
        $score+=$this->previousTransactionRule();
        $score+=$this->cartFileRule();
      /*  \Utils::dbgYiiLog(['countryRule',$this->countryRule()]);
        \Utils::dbgYiiLog(['trans3DSRule',$this->trans3DSRule()]);
        \Utils::dbgYiiLog(['airSourceRule',$this->airSourceRule()]);
        \Utils::dbgYiiLog(['nameRule',$this->nameRule()]);
        \Utils::dbgYiiLog(['emailRule',$this->emailRule()]);
        \Utils::dbgYiiLog(['previousTransactionRule',$this->previousTransactionRule()]);
        \Utils::dbgYiiLog(['cartFileRule',$this->cartFileRule()]);  */      
        return $score;
    }

    function countryRule() {
        $model = $this->aircart;
        $score=0;
        $bookingmobiles = $model->getBookingMobiles();
        $mobilecountry=null;
        if (!empty($bookingmobiles)) {
            $number = $bookingmobiles;
            $mobilecountryobj = $this->getCountryUsingNumber($number);
            if(isset($mobilecountryobj->name))
            $mobilecountry=$mobilecountryobj->name;
        }
        $ipcountry=null;
        $cardcountry=null;
        $pg= \PayGateLog::model()->findAllByAttributes(['air_cart_id' => $model->id,'status_id'=>\TrStatus::STATUS_SUCCESS,'action_id'=>\TrAction::ACTION_SENT], ['order' => 'id']);
        if(isset($pg[0])){
            $ipcountry=$pg[0]->formatGeoIpInfo();
            if(isset($pg[0]->cc->bin->country_name))
            $cardcountry=$pg[0]->cc->bin->country_name;
        }
      //  \Utils::dbgYiiLog([$ipcountry,$cardcountry,$mobilecountry]);
        if(($ipcountry===$cardcountry)&& $ipcountry!=null && $cardcountry!=null){
            $score+=self::SCORE_COUNTRY_IP_CARD;
        }
        if($ipcountry===$mobilecountry && $ipcountry!=null && $mobilecountry!=null){
            $score+=self::SCORE_COUNTRY_IP_MOBILE;
        }
        if($cardcountry===$mobilecountry && $cardcountry!=null && $mobilecountry!=null){
            $score+=self::SCORE_COUNTRY_MOBILE_CARD;
        }
        return $score;
    }

    function trans3DSRule() {
        $model = $this->aircart;
        $score=0;
        $pg= \PayGateLog::model()->findAllByAttributes(['air_cart_id' => $model->id,'status_id'=>\TrStatus::STATUS_SUCCESS,'action_id'=>\TrAction::ACTION_SENT], ['order' => 'id']);
        if (isset($pg[0])) {
            switch ($pg[0]->status_3d) {
                case \Cc::$status3DmapToId[\Cc::STATUS3D_Y]:
                    $score = self::SCORE_3DS_Y;
                    break;
                case \Cc::$status3DmapToId[\Cc::STATUS3D_A]:
                    $score = self::SCORE_3DS_A;
                    break;
                default:
                    $score = self::SCORE_3DS_N;
                    break;
            }
        }
        return $score;
    }

    function airSourceRule() {
        $model = $this->aircart;
        if($model->client_source_id===\ClientSource::SOURCE_DIRECT){
            return self::SCORE_AIRSOURCE_DIRECT;
        }else{
            return self::SCORE_AIRSOURCE_INDIRECT;
        }
    }

    function nameRule() {
        $model = $this->aircart;
        $cardname=null;
        $pg= \PayGateLog::model()->findAllByAttributes(['air_cart_id' => $model->id,'status_id'=>\TrStatus::STATUS_SUCCESS,'action_id'=>\TrAction::ACTION_SENT], ['order' => 'id']);
        if(isset($pg[0]->cc->name)){
            $cardname=$pg[0]->cc->name;
        }
        if(!empty($cardname)){
            $namearray=explode(' ',$cardname);
            foreach($model->airBookings as $booking){
                $travelerFname=$booking->traveler->first_name;
                $travelerLname=$booking->traveler->last_name;
                if(count($namearray)>0){
                    if(trim($namearray[0])===trim($booking->traveler->first_name)){
                        return self::SCORE_NAME_MATCH;
                    }  
                }
            }
        }
        return self::SCORE_NAME_NOT_MATCH;
    }

    function emailRule() {
        $model = $this->aircart;
        $email=$model->user->userInfo->email;
        foreach(self::$freeEmailProviders as $domain){
            if (strpos($email,$domain) !== false) {
                return self::SCORE_FREE_MAIL_YES;
            }
        }
        return self::SCORE_FREE_MAIL_NO;
    }

    function previousTransactionRule() {
        $model = $this->aircart;
        foreach ($model->getRelatedBookings() as $acs) {
            foreach ($acs->payGateLogs as $pg) {
                if($pg->status_id===\TrStatus::STATUS_SUCCESS && $pg->action_id===\TrAction::ACTION_SENT){
                    return self::SCORE_PREVIOUS_TRANSACTION_YES;
                }               
            }
        }
        return self::SCORE_PREVIOUS_TRANSACTION_NO;
    }

    function cartFileRule() {
        $model = $this->aircart;
        if(count($model->files)>0){
            return self::SCORE_CART_FILE_YES;
        }else{
            return self::SCORE_CART_FILE_NO;
        }
    }
    
    function getCountryUsingNumber($number) {
        if (isset($number) && !empty($number)) {
            try {
                $util = \libphonenumber\PhoneNumberUtil::getInstance();
                $phone = $util->parse($number, 'IN');
                $rc = $util->getRegionCodeForNumber($phone);
                return \Country::model()->findByAttributes(array('code' => $rc));
            } catch (Exception $e) {
                \Utils::dbgYiiLog('Caught phone exception: ' . $e->getMessage());
            }
        }
    }

}
