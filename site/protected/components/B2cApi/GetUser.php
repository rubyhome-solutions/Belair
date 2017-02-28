<?php

namespace application\components\B2cApi;

/**
 * GetUser
 *
 * @author Boxx
 * @package B2cApi
 */
class GetUser {

    /**
     *
     * @var Auth
     */
    public $credentials = null;
    public $userID = null;
    public $country = '+91';
    public $mobile = null;

    /**
     *
     * @var \User
     */
    public $user = null;

    public function __construct() {
        $this->credentials = new Auth;
    }

    /**
     * Validate the credentials and the journeys key elements
     * @return boolean
     */
    function validate() {
        $this->credentials->authenticate();
        $this->user = \Users::model()->findByAttributes(['email' => $this->credentials->email]); 
        if ($this->user) {
            if ($this->user->isStaff) {
                 throw new B2cApiException(B2cApiException::USER_IS_STAFF, null, 403);
            }
            
            $this->user->email = $this->credentials->email;
            $this->user->mobile = $this->country . $this->mobile;
        } else {
            $this->user = new \Users('fastReg');
            $this->user->email = $this->credentials->email;
            $this->user->mobile = $this->country . $this->mobile;
            
            if ($this->user->validate()) {
                $user_info = new \UserInfo('AutoReg');
                $user_info->commercial_plan_id = \CommercialPlan::findB2cPlan()->id;
                $user_info->email = $this->user->email;
                $user_info->mobile = $this->user->mobile;
                $user_info->user_type_id = \UserType::clientB2C;
                $user_info->city_id = \City::NEW_DELHI_ID;

                if ($user_info->save()) {
                    $this->user->user_info_id = $user_info->id;
                    $this->user->pass_reset_code = sha1(microtime(true) . "Just a random string ...");
                    $this->user->save(false);
                    $this->user->welcomeEmail();
                }
            }

            if (!$this->user || !$this->user->id) {
                throw new B2cApiException(B2cApiException::UNABLE_TO_CREATE_USER, null, 403);
            }
        }
        settype($this->userID, 'int');
        $this->userID=$this->user->id;
        \Utils::setActiveUserAndCompany($this->user->id);
        return true;
    }

    

    /**
     * Return the results
     * @return string JSON encoded results
     */
    function results() {
        //$out['userId'] = $this->user->id;
        $out['user'] = $this->user->attributes;
        $out['userInfo'] = $this->user->userInfo->attributes;
        //My travelers
        foreach ($this->user->userInfo->travelers as $member) {
            $out['travelers'][]=$member->attributes;
        }
        //My Bookings
        foreach ($this->user->airCarts as $cart) {
            $out['carts'][]=$cart->attributes;
        }
        if(isset($out['user']['password'])){
            $out['user']['password']='';
        }
        return json_encode($out);
    }

    
}
