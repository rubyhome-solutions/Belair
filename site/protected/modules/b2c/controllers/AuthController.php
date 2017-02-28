<?php

namespace b2c\controllers;

use b2c\components\B2cException;
use b2c\components\ControllerExceptionable;
\Yii::setPathOfAlias('libphonenumber', \Yii::getPathOfAlias('application.vendor.libphonenumber'));
class AuthController extends \Controller {
    use ControllerExceptionable;

    public function actionLogin() {
        if (\Yii::app()->request->isAjaxRequest) {
            $model = new \LoginForm;
            $model->attributes = $_POST;

            if (!$model->validate()) {
                throw new B2cException(4001, 'Validation failed', $model->getErrors());
            }
            
            $model->login();

            if (!\Yii::app()->user->isGuest) {   // See this page if you are not guest
                $user = \Users::model()->findByPk(\Yii::app()->user->id);
                $countrycode='';
                $countrycode=self::getCountryCodeUsingNumber($user->mobile);
                $mobile=$user->mobile;
                if(!empty($countrycode)){
                    $mobile=str_replace($countrycode, "", $mobile);
                }
                \Utils::jsonResponse([
                    'id' => $user->id,
                    'user_info_id' => $user->user_info_id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'mobile' =>$mobile,
                    'country' => $countrycode,
                ], 201);
            }

            throw new B2cException(4001, 'Username/Password combination not found', $model->getErrors());
        }
    }

    public function actionForgottenpass() {
        if (\Yii::app()->request->isAjaxRequest) {
            if (isset($_POST['email'])) {
                $model = \Users::model()->findByAttributes(array('email' => $_POST['email']));
                if (!$model) { // No such user
                    throw new B2cException(4000, 'No such email');
                } else {
                    $model->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
                    if ($model->update(['pass_reset_code'])) {
                        $model->passResetEmail();
                        \Utils::jsonResponse(null, 201);
                    }
                }
            }
        }
    }

    public function actionSignup() {
        $model = new \Users('b2cReg');
        if (!empty($_POST)) {
            $model->attributes = $_POST;
            $model->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
            if ($model->validate()) {
                $userInfoModel = new \UserInfo('B2C');
                $userInfoModel->email = $model->email;
                $userInfoModel->name = $model->name;
                $userInfoModel->mobile = $model->mobile;
                $userInfoModel->city_id = \City::NEW_DELHI_ID;
                $userInfoModel->commercial_plan_id = \CommercialPlan::findB2cPlan()->id;
                $userInfoModel->user_type_id = \UserType::clientB2C;
                if ($userInfoModel->validate() && $userInfoModel->save()) {
                    $model->user_info_id = $userInfoModel->id;
                    $model->city_id = $userInfoModel->city_id;
                    $model->password = \Utils::passCrypt($model->password);
                    $model->password2 = $model->password;
//                    $model->enabled=1;
                    $model->save();
                    $model->welcomeEmail();

                    \Utils::jsonResponse(['message' => 'Your registration was success.<br>You will receive email with further instructions from us how to proceed.<br>Please check your inbox and if no email from us is found, check also your SPAM folder.']);
                }
            } else {
                throw new B2cException(4001, 'Validation error', $model->getErrors());
            }
        }
    }

    public static function getCountryCodeUsingNumber($number) {
    if (isset($number) && !empty($number)) {
        try {
            $util = \libphonenumber\PhoneNumberUtil::getInstance();
            $phone = $util->parse($number, 'IN');
            $rc = $util->getRegionCodeForNumber($phone);
            $country= \Country::model()->findByAttributes(array('code' => $rc));
            if(empty($country->phonecode)){
                return '';
            }else{
                return $country->phonecode;
            }
        } catch (Exception $e) {
            \Utils::dbgYiiLog('Caught phone exception: ' . $e->getMessage());
        }
    }
}
}