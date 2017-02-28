<?php

/**
 * LoginForm class.
 * LoginForm is the data structure for keeping
 * user login form data. It is used by the 'login' action of 'SiteController'.
 */
class LoginForm extends CFormModel {

    public $username;
    public $password;
//    public $rememberMe;
    private $_identity = null;

    /**
     * Declares the validation rules.
     * The rules state that username and password are required,
     * and password needs to be authenticated.
     */
    public function rules() {
        return array(
            // username and password are required
            array('username', 'required', 'on' => 'fogottenpass'),
            array('username', 'email'),
            array('username, password', 'required'),
        );
    }

    /**
     * Declares attribute labels.
     */
    public function attributeLabels() {
        return array(
//            'rememberMe' => 'Remember me',
            'username' => 'Email',
        );
    }

    /**
     * Logs in the user using the given username and password in the model.
     * @return boolean whether login is successful
     */
    public function login() {
        if ($this->_identity === null) {
            $this->_identity = new UserIdentity($this->username, $this->password);
            $this->_identity->authenticate();
        }
        if ($this->_identity->errorCode === \UserIdentity::ERROR_NONE) {
//            $duration = $this->rememberMe ? 3600 * 24 * 30 : 0; // 30 days
//            Yii::app()->user->login($this->_identity, $duration);
            \Yii::app()->user->login($this->_identity, 0);
            \Users::model()->updateByPk(\Yii::app()->user->id, ['last_login' => 'now()']);
            \Utils::setActiveUserAndCompany(\Yii::app()->user->id);
            return true;
        } else {
            $this->addError('username', \UserIdentity::$errors[$this->_identity->errorCode]);
            return false;
        }
    }

}
