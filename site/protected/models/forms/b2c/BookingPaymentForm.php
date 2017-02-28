<?php

class BookingPaymentForm extends CFormModel
{
    public $accept;
    public $journey_id;
    public $user_id;
    public $user_info_id;

    public function rules()
    {
        return array(
            array('journey_id, user_id, user_info_id', 'required'),
            array('accept', 'required', 'requiredValue' => 1, 'message' => 'You should accept term to use our service'),
            array('user_id, user_info_id, journey_id', 'safe')
        );
    }

    public function attributeLabels() {
        return array(
            'user_id' => 'User',
            'travelers' => 'Travelers'
        );
    }
}