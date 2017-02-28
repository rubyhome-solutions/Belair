<?php

namespace application\components\B2cApi;

class CardForm extends \CFormModel {
    

    public $ecc;

    public $id;
    public $type;
    public $name;
    public $number;
    public $exp_month;
    public $exp_year;
    public $cvv;
    public $store;

    function __construct($scenario = null) {
        $this->ecc = new \ECCValidator2();
        parent::__construct($scenario);
    }

    public function rules() {
        $cvv_length = 'amex' == $this->type ? 4 : 3;

        return [
            ['name, number, exp_month, exp_year, cvv', 'required'],
            ['number', 'filter', 'filter' => [$this, 'stripSpaces']],
            ['number', 'ext.validators.ECCValidator2', 'format' => [\ECCValidator2::AMERICAN_EXPRESS, \ECCValidator2::MASTERCARD, \ECCValidator2::VISA]],
            ['cvv', 'numerical'],
            ['cvv', 'length', 'is' => $cvv_length],
            ['exp_year', 'numerical', 'min' => date('Y')],
            ['exp_month', 'numerical']
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
