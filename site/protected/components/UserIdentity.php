<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity {

    public $id = null;

    const ERROR_USER_DISABLED = 3;
    const ERROR_IP_OUT_OF_OFFICE = 4;
	const ERROR_B2B_LOGIN_TO_B2C = 5;
    static $errors = [
        self::ERROR_IP_OUT_OF_OFFICE => 'Login not allowed out of the office',
        self::ERROR_USER_DISABLED => 'User is disabled',
        self::ERROR_PASSWORD_INVALID => 'Invalid password',
        self::ERROR_USERNAME_INVALID => 'Username not found',
        self::ERROR_UNKNOWN_IDENTITY => 'Unknown identity',
		self::ERROR_B2B_LOGIN_TO_B2C => 'You are already our B2B user.',
    ];

    public function __construct($username, $password) {
        // Fix possible encodings gimmics
        $this->username = strtolower(iconv(mb_detect_encoding($username, mb_detect_order(), true), "UTF-8//TRANSLIT", $username));
        $this->password = iconv(mb_detect_encoding($password, mb_detect_order(), true), "UTF-8//TRANSLIT", $password);
    }

    /**
     * Authenticates a user.
     * The example implementation makes sure if the username and password
     * are both 'demo'.
     * In practical applications, this should be changed to authenticate
     * against some persistent user identity storage (e.g. database).
     * @return boolean whether authentication succeeds.
     */
    public function authenticate() {
        $user = \Users::model()->find('LOWER(email)=:username', [':username' => strtolower($this->username)]);
        if (!isset($user)) {
            $this->errorCode = self::ERROR_USERNAME_INVALID;
        } elseif (!$user->enabled && \Yii::app()->theme === null) {
            $this->errorCode = self::ERROR_USER_DISABLED;
        } elseif ($user->password !== crypt($this->password, $user->password)) {
            $this->errorCode = self::ERROR_PASSWORD_INVALID;
        } elseif (!$user->canLogin()) {
            $this->errorCode = self::ERROR_IP_OUT_OF_OFFICE;
        }elseif ($user->isSiteAuthForB2B) {
			$this->errorCode = self::ERROR_B2B_LOGIN_TO_B2C;
		} else {
            $this->errorCode = self::ERROR_NONE;
//            Yii::app()->session['role'] = $user->role_id;
            $this->setState('user_type', $user->userInfo->user_type_id);
            $this->id = $user->id;
        }
        return $this->errorCode;
    }

    /**
     * Returns the unique identifier for the identity.
     * The default implementation simply returns {@link username}.
     * This method is required by {@link IUserIdentity}.
     * @return string the unique identifier for the identity.
     */
    public function getId() {
        return $this->id;
    }

}
