<?php

namespace b2c\models;

class FlightForm extends \CFormModel {
    public $from;
    public $to;
    public $depart_at;
    public $return_at;

    public function rules() {
        return [
            ['from, to, depart_at', 'required'],
            ['return_at', 'required' , 'on' => 'roundtrip'],
            ['depart_at, return_at', 'date', 'format' => 'yyyy-M-d'],
            ['depart_at, return_at', 'validateDates'],
            ['from, to', 'numerical', 'integerOnly' => true],
            ['from, to', 'exist', 'attributeName' => 'id', 'className' => '\Airport'],
            ['from', 'validateItinerary']
        ];
    }

    public function attributeLabels() {
        return [
            'depart_at' => 'Departure',
            'return_at' => 'Return'
        ];
    }

    public function validateItinerary() {
        if (!$this->from || !$this->to)
            return;

        if ($this->from == $this->to) {
            $this->addError('to', 'Flight require to have destination different than the origin');
        }
    }

    public function validateDates() {
        if ($this->depart_at) {
            $depart = \DateTime::createFromFormat('Y-m-d', $this->depart_at);
            
            $valid = \DateTime::getLastErrors(); 
            if($valid['warning_count']!==0 and $valid['error_count']!==0){
                 $this->addError('depart_at', 'Departure is not a valid date');
            }
            if (!$depart)
                $this->addError('depart_at', 'Departure is not a valid date');

            if ($depart->getTimestamp() < time())
                $this->addError('depart_at', 'Departure is in the past');
        }

        if ($this->return_at) {
            $return = \DateTime::createFromFormat('Y-m-d', $this->return_at);
            $valid = \DateTime::getLastErrors(); 
            if($valid['warning_count']!==0 and $valid['error_count']!==0){
                 $this->addError('return_at', 'Return is not a valid date');
            }
            
            if (!$return)
                $this->addError('return_at', 'Return is not a valid date');

            if ($return->getTimestamp() < time())
                $this->addError('return_at', 'Return is in the past');

            if ($depart && $depart->getTimestamp() > $return->getTimestamp())
                $this->addError('depart_at', 'Return is before departure');
        }


    }
}