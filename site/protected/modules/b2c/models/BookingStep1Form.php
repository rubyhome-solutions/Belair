<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;

\Yii::setPathOfAlias('libphonenumber', \Yii::getPathOfAlias('application.vendor.libphonenumber'));

class BookingStep1Form extends B2cFormModel {

    public $id;
    public $email;
    public $mobile;
    public $country = '+91';
    public $logged_in;
    private $promo_remove = 0;

    public function rules() {
        return [
            ['email, mobile', 'required'],
            ['email', 'email'],
            ['mobile', 'validatePhonenumber']
        ];
    }

    public function validatePhonenumber($attribute, $params) {
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
                $this->addError($attribute, 'Phone number is not correct');
            }
        }
    }

    public function process(Booking $booking) {
        $user = \Users::model()->findByAttributes(['email' => $this->email]);
        if ($user) {
            if ($user->isStaff) {
                throw new B2cException(4010, 'Staff users are not allowed to book');
            }

            $user->email = $this->email;
            $user->mobile = $this->country . $this->mobile;
        } else {
            $user = new \Users('fastReg');
            $user->email = $this->email;
            $user->mobile = $this->country . $this->mobile;

            if ($user->validate()) {
                $user_info = new \UserInfo('AutoReg');
                $user_info->commercial_plan_id = \CommercialPlan::findB2cPlan()->id;
                $user_info->email = $user->email;
                $user_info->mobile = $user->mobile;
                $user_info->user_type_id = \UserType::clientB2C;
                $user_info->city_id = \City::NEW_DELHI_ID;

                if ($user_info->save()) {
                    $user->user_info_id = $user_info->id;
                    $user->pass_reset_code = sha1(microtime(true) . "Just a random string ...");
                    $user->save(false);
                    $user->welcomeEmail();
                }
            }

            if (!$user || !$user->id) {
                throw new B2cException(4001, 'Unable to create user. Please try again later', $user->getErrors());
            }
        }

        if (!\Yii::app()->user->isGuest && !empty(\Yii::app()->user->id)) {
            $loggeduser = \Users::model()->findByPk((int) \Yii::app()->user->id);
            if (isset($loggeduser->id) && $loggeduser->id !== $user->id) {
                \Yii::app()->user->logout(false);
            }
        }
        if (strlen($user->userInfo->mobile) === 10) {
            $user->userInfo->mobile = $this->country . $user->userInfo->mobile;
        }
        $booking->user = $user;
        $booking->setJourneyType();
        //remove promo if user have reached maximum limit
        if(!empty($booking->promo_code)) {
            $this->removePromo($booking);
        }
        $booking->persist();
        \BookingLog::push_log($booking->id, '', 'step 1 done');
        $booking->saveScreenShot(1);
        \Utils::setActiveUserAndCompany($booking->user->id);


        $pgl = new \PayGateLog();
        $pgl->user_info_id = $booking->user->user_info_id;
        $pgl->amount = (double) $booking->price;
        
        sleep(1);
        \BookingLog::push_log($booking->id, '', 'step 2 started');
        return [
            'id' => $user->id,
            'logged_in' => \Yii::app()->user->isGuest,
            'convenienceFee' => $pgl->convenienceFee(),
            'promo_remove' => $this->promo_remove
        ];
    }

    private function removePromo(&$booking) {
        $result = \PromoCodes::checkPromoCode($booking->promo_code, $booking);
        if(!empty($result['error'])) {
            $booking->promo_code = null;
            $booking->promo_id = null;
            $booking->promo_value = null;
            $this->promo_remove = 1;
        }
    }

}
