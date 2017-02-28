<?php

/**
 * Class that returns the details for the active user.
 * If there is no logged user we are using B2C details
 *
 * @author tonyboy0777@gmail.com
 */
class ActiveUserDetails {

    public $phone = null;
    public $email = null;
    public $address = null;
    public $address1 = null;
    public $address2 = null;
    public $country = null;
    public $countryCode = null;
    public $city = null;
    public $state = null;
    public $stateCode = null;
    public $pincode = null;
    public $firstName = null;
    public $lastName = null;
    public $companyName = null;

    /**
     * Produce contact details to be used in PNR creation
     * @param int $userTypeId The user type ID to be used. If null we use the active user type ID
     * @param string $paxMobile Passenger mobile - override the company mobile if present
     */
    public function __construct($userTypeId = null, $paxMobile = null) {
        if (empty($userTypeId)) {
            $userTypeId = \Utils::getActiveUserTypeId();
        }
        if (empty($paxMobile)) {
            $user = \Users::model()->with('userInfo')->findByPk(\Utils::getActiveUserId());
            if ($user) {
                $paxMobile = $user->userInfo->mobile;
            }
        }
        switch ($userTypeId) {
            case \UserType::clientB2C :
                $userId = \Users::B2C_USERID;
                break;
            case \UserType::corporateB2E :
                $userId = \Users::B2E_USERID;
                break;
            default:
                $userId = \Utils::getActiveUserId();
                break;
        }
        $user = \Users::model()->with('userInfo')->findByPk($userId);
        /* @var $user \Users */
        if ($user) {
            $this->phone = $paxMobile;
            $this->email = $user->userInfo->email;
            $this->address = "{$user->userInfo->address}, {$user->userInfo->city->name}-{$user->userInfo->pincode}";
            $this->address1 = $user->userInfo->address;
            $this->address2 = "{$user->userInfo->city->name}-{$user->userInfo->pincode}";
            $this->city = $user->userInfo->city->name;
            $this->pincode = $user->userInfo->pincode;
            $this->state = $user->userInfo->city->state->name;
            $this->stateCode = strtoupper(substr($this->state, 0, 2));
            $this->country = $user->userInfo->city->state->country->name;
            $this->countryCode = strtoupper($user->userInfo->city->state->country->code);
            $tmp = explode(' ', $user->name);
            $this->firstName = $tmp[0];
            $this->lastName = empty($tmp[1]) ? $tmp[0] : $tmp[1];
            $this->companyName = $user->userInfo->name;
        }
    }

}
