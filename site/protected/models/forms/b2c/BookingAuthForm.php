<?php

class BookingAuthForm extends CFormModel
{
    public $user_id;
    public $user_info_id;
    public $email;
    public $mobile;

    public function rules()
    {
        return [
            ['email', 'filter', 'filter' => [$this, 'stripSpaces']],
            ['email, mobile', 'required'],
            ['email', 'email'],
            ['mobile', 'CRegularExpressionValidator', 'pattern' => '/^[+]?[\d ]+$/', 'message' => "Incorrect tel. number format."],
        ];
    }

    public function attributeLabels()
    {
        return [
            'email' => 'Email',
            'mobile' =>'Mobile',
        ];
    }

    public function stripSpaces($str) {
        return str_replace(' ', '', $str);
    }
}