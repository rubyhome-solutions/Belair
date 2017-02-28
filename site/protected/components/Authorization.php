<?php

/**
 * Authorization class
 * @author Boxx
 */
class Authorization {

    const EMULATE = 'emulate';
    const CHANGE_STATUS = 'change_status';
    const SET_USER_PROFILE = 'set_user_profile';
    const CONFIG_COMPANY = 'config_company';
    const SET_USER_PERMISSIONS = 'set_user_permissions';
    const MANAGE_STAFF = 'manage_staff';
    const DOWNLOAD_COMPANY_DOCUMENT = 1;
    const DOWNLOAD_TRAVELLER_DOCUMENT = 2;
    const MANAGE_TRAVELER = 3;
    const UNDO_LOG_ACTION = 4;

    /**
     * The list of the atomic operations that require permissions
     * @var array $operations
     */
    static $operations = array(
        self::EMULATE,
        self::CHANGE_STATUS,
        self::SET_USER_PROFILE,
        self::CONFIG_COMPANY,
        self::SET_USER_PERMISSIONS,
        self::MANAGE_STAFF,
        self::DOWNLOAD_COMPANY_DOCUMENT,
//        self::DOWNLOAD_TRAVELLER_DOCUMENT,
        self::MANAGE_TRAVELER,
        self::UNDO_LOG_ACTION,
    );
    static $staffRoles = [
        UserType::superAdmin,
        UserType::supervisorStaff,
        UserType::frontlineStaff,
        UserType::acountantStaff,
    ];
    static $staffTop2Roles = [
        UserType::superAdmin,
        UserType::supervisorStaff
    ];
    static $staffTop3Roles = [
        UserType::superAdmin,
        UserType::supervisorStaff,
        UserType::acountantStaff,
    ];

//    static $tasks = array(
//        'Emulate' => array(
//            'emulate'
//        ),
//        'Edit Users' => array(
//            'change_status',
//            'set_user_profile'
//        ),
//    );

    /**
     * Can the current user perform the operation
     * @param string $operation The operation to be performed
     * @param array $params Params
     * @return string Error
     * @return bool True if operation is permited
     */
    static function can($operation, $params = null) {
        /* @var $user Users */
        if (!in_array($operation, self::$operations))
            return "Error: Unknown operation";
        if (empty(Yii::app()->user->id))
            return "Error: You have to be logged in";

        /* @var $user Users The currently logged user */
        $user = Users::model()->findByPk(Yii::app()->user->id);

        switch ($operation) {
            case self::EMULATE:
                return self::canEmulate($user, $params);
                break;

            case self::SET_USER_PROFILE:
                return self::canSetProfile($user, $params);
                break;

            case self::CHANGE_STATUS:
                return self::canChangeStatus($user, $params);
                break;

            case self::SET_USER_PERMISSIONS:
                return self::canSetPermissions($user, $params);
                break;

            case self::CONFIG_COMPANY:
                return self::canConfigCompany($user, $params);
                break;

            case self::MANAGE_STAFF:
                return self::canConfigStaff($user, $params);
                break;

            case self::DOWNLOAD_COMPANY_DOCUMENT:
                return self::canDownloadCompanyDocument($user, $params);
                break;

            case self::MANAGE_TRAVELER:
                return self::canManageTraveler($user, $params);
                break;

            case self::UNDO_LOG_ACTION:
                return self::canUndoLogAction($user);
                break;

            default :
                return 'Error: This atomic operation is not yet configured';
                break;
        }
    }

    /**
     * Can the user do emulation
     * @param Users $user The current user
     * @param array $params Parameters
     * @return bool True If operation is permited
     * @return string Error if operation is not permited
     */
    static function canEmulate($user, $params) {
        $originalUser = Yii::app()->user->getState('emulation');
        if ($originalUser !== null)
            return "Multiple level of emulations are not wise!";
        if (empty($params['user_id']))
            return "Missing parameter: user_id";

        $emulatedUser = Users::model()->findByPk((int) $params['user_id']);

        // Same level emulation is excluded from the emulation
        if ($user->userInfo->user_type_id == $emulatedUser->userInfo->user_type_id)
            return "Error: You can not emulate users on the same hierarchy level as yours";

        // Disabled users are excluded from the emulation
        if ($emulatedUser->enabled != 1)
            return "Error: Emulating disabled users is pointless!\nDisabled user has no any way to interact with the platform.";

        switch ($user->userInfo->user_type_id) {
            case UserType::superAdmin :
                return true;
                break;

            case UserType::supervisorStaff :
                if ($emulatedUser->userInfo->user_type_id == UserType::superAdmin)
                    return "Error: You can not emulate the Super Admin";
                else
                    return true;
                break;

            case UserType::frontlineStaff :
                if (in_array($emulatedUser->userInfo->user_type_id, array(UserType::superAdmin, UserType::supervisorStaff)))
                    return "Error: You can not emulate other Staff members";
                else
                    return true;
                break;

//                    case UserType::distributor :
//                        if ($emulatedUser->userInfo->distributor == $user->userInfo->id)
//                            return true;
//                        else
//                            return "Error: you do not have rights to emulate this user";
//                        break;

            default:
                return "Error: you do not have rights to emulate this user";
                break;
        }
    }

    /**
     * Can the user set the profile
     * @param Users $user The current user
     * @param array $params Parameters
     * @return bool True If operation is permited
     * @return string Error if operation is not permited
     */
    static function canSetProfile($user, $params) {
        if (empty($params['user_id']))
            return "Missing parameter: user_id";
        $subjectUser = Users::model()->findByPk((int) $params['user_id']);

        // User can modify his own profile
        if ($user->id == $subjectUser->id)
            return true;

        // Same level Staff can not manage between
        if ($user->isStaff && $user->staffLevel === $subjectUser->staffLevel)
            return "You can not manage Staff on same level as yours";

        // Staff member can update any user
        if ($user->isStaff && !$subjectUser->isStaff)
            return true;

        // Staff member can update other staff members with the right permission, but not supervisors
        if ($user->isStaff && $subjectUser->isStaff &&
                $subjectUser->userInfo->user_type_id != UserType::superAdmin &&
                $user->hasPermission(Permission::MANAGE_COLLEAGUES))
            return true;

        // User can update other user if in same company and has the permisson: MANAGE_COLLEAGUES
        if ($user->user_info_id == $subjectUser->user_info_id &&
                $user->hasPermission(Permission::MANAGE_COLLEAGUES))
            return true;

        return "Error: You do not have the permission to manage the profile for this user";
    }

    /**
     * Can the user enable or disable the other user
     * @param Users $user The current user
     * @param array $params Parameters
     * @return bool True If operation is permited
     * @return string Error if operation is not permited
     */
    static function canChangeStatus($user, $params) {
        if (empty($params['user_id']))
            return "Missing parameter: user_id";
        $subjectUser = Users::model()->findByPk((int) $params['user_id']);

        // User can not change his own status
        if ($user->id == $subjectUser->id)
            return "Error: You can not disable yourself! What an idea!";

        // Staff member can change status for any user
        if ($user->isStaff && !$subjectUser->isStaff)
            return true;

        // Staff member can change status for other staff members if above him
        if ($user->isStaff && $subjectUser->isStaff) {
            if ($user->staffLevel == $subjectUser->staffLevel)
                return "You can not change the status of the Staff user on the same level as yours. Ask the Super Admin or the Supervisor to do that.";
            if ($user->hasPermission(Permission::MANAGE_COLLEAGUES))
                return true;
        }

        // User can change status for other user if in same company and has the permisson: MANAGE_COLLEAGUES
        if ($user->user_info_id == $subjectUser->user_info_id &&
                $user->hasPermission(Permission::MANAGE_COLLEAGUES))
            return true;


        return "Error: You do not have the permission to change the status for this user";
    }

    /**
     * Can the user set the permissions
     * @param Users $user The current user
     * @param array $params Parameters
     * @return bool True If operation is permited
     * @return string Error if operation is not permited
     */
    static function canSetPermissions($user, $params) {
        if (empty($params['user_id']))
            return "Missing parameter: user_id";
        $subjectUser = Users::model()->findByPk((int) $params['user_id']);

        // User can not change his own permissions set
        if ($user->id == $subjectUser->id)
            return "Error: You can not modify your own permissions";

        // Super admin have all the rights
        if ($user->userInfo->user_type_id === \UserType::superAdmin) {
            return true;
        }

        // Staff members permissions can not be set by others
        if ($subjectUser->isStaff)
            return 'You can not assign individual permisions for the staff members';

        // Staff member can manage any user
        if ($user->isStaff && !$subjectUser->isStaff)
            return true;

        // User can set permissions for other user if in same company and has the permisson: MANAGE_COLLEAGUES
        if ($user->user_info_id == $subjectUser->user_info_id &&
                $user->hasPermission(Permission::MANAGE_COLLEAGUES))
            return true;

        return "Error: You do not have the permission to set the permissions for this user";
    }

    /**
     * Can the user config the company info
     * @param Users $user The current user
     * @param array $params Parameters
     * @return bool True If operation is permited
     * @return string Error if operation is not permited
     */
    static function canConfigCompany($user, $params) {
        if (empty($params['user_id']))
            return "Missing parameter: user_id";
        $subjectUser = Users::model()->findByPk((int) $params['user_id']);

        // Staff members do not have companies
        if ($subjectUser->isStaff)
            return 'You can not setup a company info for the staff members';

        // Staff member can manage any company if s/he has the permission
        if ($user->isStaff && $user->hasPermission(Permission::MANAGE_COMPANY_INFO))
            return true;

        // Users from same company can view the company info
        if ($user->user_info_id === $subjectUser->user_info_id)
            return true;

        return "Error: You do not have the permission to view the info for this company. You do not belong to this company.";
    }

    /**
     * Can the user manage the staff members
     * @param Users $user The current user
     * @param array $params Parameters
     * @return bool True If operation is permited
     * @return string Error if operation is not permited
     */
    static function canConfigStaff($user, $params) {
        if (empty($params['user_id']))
            return "Missing parameter: user_id";
        $subjectUser = Users::model()->findByPk((int) $params['user_id']);

        // Staff member can manage any company if s/he has the permission
        if ($user->isStaff && $subjectUser->isStaff &&
                $user->hasPermission(Permission::MANAGE_STAFF))
            return true;

        return "Error: You do not have the permission to manage staff members";
    }

    /**
     * Check if the active user is a staff member
     * @return boolean TRUE if the user is from the staff
     */
    static function getIsStaffLogged() {
        // No logged user
        if (!\Yii::app()->hasProperty('user') || !isset(Yii::app()->user->id))
            return false;
        $user = Users::model()->findByPk(Yii::app()->user->id);
        return $user->isStaff;
    }

    /**
     * Check if the active user is a staff member from top 2 levels
     * @return boolean TRUE if the user is from the top 2 levels staff (superAdmin or supervisor)
     */
    static function getIsTopStaffLogged() {
        // No logged user
        if (!isset(Yii::app()->user->id))
            return false;
        $user = Users::model()->findByPk(Yii::app()->user->id);
        return in_array($user->userInfo->user_type_id, self::$staffTop2Roles);
    }

    /**
     * Check if the active user is a frontline staff member
     * @return boolean TRUE if the user is frontline staff member
     */
    static function getIsFrontlineStaffLogged() {
        // No logged user
        if (!isset(Yii::app()->user->id)) {
            return false;
        }
        $user = Users::model()->findByPk(Yii::app()->user->id);
        return $user->userInfo->user_type_id === \UserType::frontlineStaff;
    }

    /**
     * Check if the active user is a staff member from top 3 levels
     * @return boolean TRUE if the user is from the top 3 levels staff (superAdmin or supervisor or accountant)
     */
    static function getIsTopStaffOrAccountantLogged() {
        // No logged user
        if (!isset(Yii::app()->user->id)) {
            return false;
        }
        $user = \Users::model()->findByPk(Yii::app()->user->id);
        return in_array($user->userInfo->user_type_id, self::$staffTop3Roles);
    }

    /**
     * Check if the active user is a staff member is accountant
     * @return boolean TRUE if the user is accountant
     */
    static function getIsAccountantLogged() {
        // No logged user
        if (!isset(Yii::app()->user->id)) {
            return false;
        }
        $user = \Users::model()->findByPk(Yii::app()->user->id);
        return $user->userInfo->user_type_id === \UserType::acountantStaff;
    }

    /**
     * Check if the active user is a accounting xmls view capable
     * @return boolean TRUE if the user is accounting xmls view capable
     */
    static function getIsAccountingXMLUser() {
        // No logged user
        if (!isset(Yii::app()->user->id))
            return false;
        $user = Users::model()->findByPk(Yii::app()->user->id);
        return $user->userInfo->user_type_id == \UserType::busyaccounting;
    }

    /**
     * Check if the active user is a member of the active comapany
     * @return boolean TRUE if the user is from the company
     */
    static function getIsUserFromActiveCompany() {
        // No logged user
        if (!isset(Yii::app()->user->id)) {
            return false;
        }
        $companyId = \Utils::getActiveCompanyId();
        if (!$companyId) {
            return false;
        }
        $user = Users::model()->findByPk(Yii::app()->user->id);
        return $user->user_info_id == $companyId;
    }

    /**
     * Check if the active user has specific permission
     * @return boolean TRUE if the user has the permission
     */
    static function getDoLoggedUserHasPermission($permission_id) {
        // No logged user
        if (!isset(Yii::app()->user->id))
            return false;
        $user = Users::model()->findByPk(Yii::app()->user->id);
        return $user->hasPermission($permission_id);
    }

    static function canDownloadCompanyDocument($user, $params) {
        if (empty($params['doc_id']))
            return "Missing parameter: doc_id";
        $file = UserFile::model()->findByPk((int) $params['doc_id']);
        if ($file === null)
            return "Document not found";

        // Staff members can download any document
        if ($user->isStaff)
            return true;

        // Same company users can view the user visible docs only
        if ($user->user_info_id == $file->user_info_id && $file->user_visible)
            return true;

        return "Error: You do not have the permission to download this document";
    }

    static function canManageTraveler($user, $params) {
        if (empty($params['traveler_id']))
            return "Missing parameter: traveler_id";
        $traveler = Traveler::model()->findByPk((int) $params['traveler_id']);
        if ($traveler === null)
            return "Traveler not found";

        // Staff members can manage any traveler
        if ($user->isStaff &&
                $user->hasPermission(Permission::MANAGE_TRAVELLERS))
            return true;
        // Same company users can manage travelers with the right permission
        if ($user->user_info_id == $traveler->user_info_id &&
                $user->hasPermission(Permission::MANAGE_TRAVELLERS))
            return true;

        return "Error: You do not have the permission to manage the traveler";
    }

    static function canUndoLogAction($user) {

        // Supervisor and Super admin can undo logs
        if ($user->isStaff &&
                in_array($user->userInfo->user_type_id, [UserType::superAdmin, UserType::supervisorStaff]))
            return true;

        return "Error: You do not have the permission to undo any log action. Ask the supervisor for assistance!";
    }

    /**
     * Check if the user is superadmin and logged
     * @return boolean TRUE if the user is from the superadmin and logged
     */
    public static function getIsSuperAdminLogged() {
        if (!isset(\Yii::app()->user->id))
            return false;
        $user = \Users::model()->findByPk(\Yii::app()->user->id);
        if ($user->userInfo->user_type_id === \UserType::superAdmin) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Check if the user permitted to see Prfitability report
     * @return boolean TRUE if the user is from the superadmin or authorized for report
     */
    public static function getIsProfitReportAuthorized() {
        if (!isset(\Yii::app()->user->id))
            return false;
        $user = \Users::model()->findByPk(\Yii::app()->user->id);
        $paramAllowedUser=  \Params::model()->findByPk(\Users::PROFIT_REPORT_ALLOWED_USER);
        $allowedUser=[];
        if(!empty($paramAllowedUser)){
            $allowedUser=explode(',',$paramAllowedUser->info);
        }
        if ($user->userInfo->user_type_id === \UserType::superAdmin || in_array($user->id,$allowedUser)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Check if the user is superadmin or clientSource and logged
     * @return boolean TRUE if the user is from the superadmin or clientSource and logged
     */
    public static function getIsSuperAdminorClientSourceLogged() {
        if (!isset(\Yii::app()->user->id))
            return false;
        $user = \Users::model()->findByPk(\Yii::app()->user->id);
        if ($user->userInfo->user_type_id === \UserType::superAdmin || $user->userInfo->user_type_id === \UserType::clientSource) {
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Check if the user is superadmin or TicketRule admin  logged
     * @return boolean TRUE if the user is from the superadmin or TicketRule  logged
     */
    public static function getIsSuperAdminorTicketRuleLogged() {
        if (!isset(\Yii::app()->user->id))
            return false;
        $user = \Users::model()->findByPk(\Yii::app()->user->id);
        if ($user->userInfo->user_type_id === \UserType::superAdmin || $user->userInfo->user_type_id === \UserType::ticketRule) {
            return true;
        } else {
            return false;
        }
    }

}

?>
