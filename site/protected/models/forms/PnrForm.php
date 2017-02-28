<?php

class PnrForm extends CFormModel {

    public $pnr;
    public $airSourceId;
    public $website_id;

    public function rules() {
        return array(
            array('pnr, airSourceId','required', 'message' => 'Please provide a valid {attribute} !'),
            array('pnr', 'CStringValidator', 'max' => 6, 'min'=>6),
            array('airSourceId', 'numerical', 'integerOnly' => true, 'message' => 'Please provide a valid {attribute} !'),
            array('website_id','required'),
        );
    }
 
    public function attributeLabels() {
        return array(
            'pnr' => 'PNR',
            'airSourceId' => 'Air Source',
            'website_id'=>'Website Id'
        );
    }

}
