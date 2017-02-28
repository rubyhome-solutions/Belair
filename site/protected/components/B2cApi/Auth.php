<?php

namespace application\components\B2cApi;

/**
 * B2cApi Auth
 *
 * @author Boxx
 */
\Yii::setPathOfAlias('libphonenumber',\Yii::getPathOfAlias('application.vendor.libphonenumber'));
class Auth {

    public $email;
    public $password;
    public $password2;
    public $name = null;
    public $mobile = null;
    public $country = '+91';

    /**
     * The logged user
     * @var \Users
     */
    public $user = null;

    function authenticate() {
        $user = \Users::model()->findByAttributes([
            'email' => $this->email,
//            'enabled' => 1,
//            'b2b_api' => 1,
        ]);
        
        if (!$user) {
            throw new B2cApiException(B2cApiException::WRONG_EMAIL_OR_API_ACCESS, null, 403);
        }
        if ($user->password !== crypt($this->password, $user->password)) {
            throw new B2cApiException(B2cApiException::WRONG_PASSWORD, null, 403);
        }
        $this->user = $user;
        return true;
    }

    /**
     * Return info about the customer balance
     * @return array
     * @throws B2cApiException
     */
    function getBalance() {
        if ($this->user) {
            return [
                'currency' => $this->user->userInfo->currency->code,
                'balance' => (float)$this->user->userInfo->balance,
                'credit' => (float)$this->user->userInfo->credit_limit,
                'total' => (float)($this->user->userInfo->credit_limit + $this->user->userInfo->balance),
            ];
        }
        throw new B2cApiException(B2cApiException::WRONG_EMAIL_OR_API_ACCESS, null, 404);
    }
    
    /**
     * Return info about the customer balance
     * @return array
     * @throws B2cApiException
     */
    
    function emailAuthentication() {
      $user = \Users::model()->findByAttributes([
            'email' => $this->email,
//            'enabled' => 1,
//            'b2b_api' => 1,
        ]);
        
        if (!$user) {
            throw new B2cApiException(B2cApiException::WRONG_EMAIL_OR_API_ACCESS, null, 403);
        }
        
        $this->user = $user;
        return true;
    }
    function forgetPassword() {
        if ($this->user) {
            $this->user->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
            if ($this->user->update(['pass_reset_code'])) {
                $this->user->passResetEmail();
                \Utils::jsonResponse(null, 201);
            }
        }
        throw new B2cApiException(B2cApiException::WRONG_EMAIL_OR_API_ACCESS, null, 404);
    }
    
    function newUserAuthentication() {
        
      $user = \Users::model()->findByAttributes([
            'email' => $this->email
        ]);
        
        if ($user) {
            throw new B2cApiException(B2cApiException::EMAIL_ALREADY_EXISTS, null, 403);
        }
        if(strlen($this->password)<4){
            throw new B2cApiException(B2cApiException::WEAK_PASSWORD, null, 403);
        }
        
        if ($this->mobile) {
            $mobile = $this->country . $this->mobile;

            $ok = true;
            try {
                $util = \libphonenumber\PhoneNumberUtil::getInstance();

                $ok = $util->isValidNumber($util->parse($mobile, 'IN'));
            } catch (\Exception $e) {
                $ok = false;
            }

            if (!$ok) {
                throw new B2cApiException(B2cApiException::INCORRECT_MOBILE_NUMBER, null, 403);
            }
        }
        return true;
    }
    /*
     * Create New User
     */
    function registerNewUser(){
        $user = new \Users('b2cReg');
        
            $user->email = $this->email;
            $user->name = $this->name;
            $user->mobile = $this->mobile;
            $user->password=  $this->password;
            $user->password2 = $this->password;
            $user->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
            if ($user->validate()) {
                $userInfoModel = new \UserInfo('B2C');
                $userInfoModel->email = $user->email;
                $userInfoModel->name = $user->name;
                $userInfoModel->mobile = $user->mobile;
                $userInfoModel->city_id = \City::NEW_DELHI_ID;
                $userInfoModel->commercial_plan_id = \CommercialPlan::findB2cPlan()->id;
                $userInfoModel->user_type_id = \UserType::clientB2C;
                if ($userInfoModel->validate() && $userInfoModel->save()) {
                    $user->user_info_id = $userInfoModel->id;
                    $user->city_id = $userInfoModel->city_id;
                    $user->password=  \Utils::passCrypt($user->password);
//                    $model->enabled=1;
                    $user->save(false);
                    $user->welcomeEmail();
                    $this->user=$user;
                    \Utils::jsonResponse(['message' => 'Your registration was success.']);
                }else{
                    throw new B2cApiException(B2cApiException::DATA_VALIDATION_ERROR, null, 403,$userInfoModel->getErrors());
                }
            } else {
                   throw new B2cApiException(B2cApiException::DATA_VALIDATION_ERROR, null, 403,$user->getErrors());
            }
            
       
    }

}
