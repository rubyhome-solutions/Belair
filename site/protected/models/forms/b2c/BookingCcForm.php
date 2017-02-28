<?php

class BookingCcForm extends CFormModel {
    public $ecc;

    public $name;
    public $number;
    public $exp_month;
    public $exp_year;
    public $cvv;

    function __construct($scenario = null) {
        $this->ecc = new ECCValidator2();
        parent::__construct($scenario);
    }

    public function rules() {
        return [
            ['name, number, exp_month, exp_year, cvv', 'required'],
            ['number', 'filter', 'filter' => [$this, 'stripSpaces']],
            ['number', 'ext.validators.ECCValidator2', 'format' => [ECCValidator2::MASTERCARD, ECCValidator2::VISA]]
        ];
    }

    public function attributeLabels() {
        return array(
            'name' => 'Holder\'s name',
            'number' => 'Card Number',
            'exp_month' => 'Expiry Month',
            'exp_year' => 'Expiry year',
            'cvv' => 'CVV No'
        );
    }

    public function stripSpaces($str) {
        return str_replace(' ', '', $str);
    }
}
