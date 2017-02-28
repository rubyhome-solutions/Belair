<?php

class ChangePassForm extends CFormModel {

    public $oldPassword;
    public $newPassword;
    public $newPassword2;

    /**
     * Declares the validation rules.
     */
    public function rules() {
        return array(
            array('oldPassword, newPassword, newPassword2', 'required'),
            // password needs to be more than 6 chars and equal
            array('newPassword, newPassword2', 'length', 'min' => 6),
            array('newPassword', 'compare', 'compareAttribute' => 'newPassword2'),
        );
    }

    /**
     * Declares attribute labels.
     */
    public function attributeLabels() {
        return array(
            'oldPassword' => 'Old Password',
            'newPassword' => 'New Password',
            'newPassword2' => 'New Password again',
        );
    }

}
