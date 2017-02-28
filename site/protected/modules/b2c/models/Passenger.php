<?php

namespace b2c\models;

class Passenger extends \CFormModel {

    const VALIDATION_INTERNATIONAL = 'international';
    const VALIDATION_FULL = 'full';
    const VALIDATION_DOMESTIC = 'full';

    public $id;
    public $type_id;
    public $title_id;
    public $firstname;
    public $lastname;
    public $passport_number;
    public $passport_country_id;
    public $passport_expiry;
    public $birth;
    public $booking; // get the traveler booking data to fetch the traveler last arrival date.
    public $traveler_type_id; // display the pick traveler list based on the adult, child or infant type.

    public function beforeValidate() {
        if (empty($this->birth) || ['', '', ''] == $this->birth) {
            $this->birth = null;
        }

        if (empty($this->passport_expiry) || ['', '', ''] == $this->passport_expiry) {
            $this->passport_expiry = null;
        }

        return parent::beforeValidate();
    }

    public function attributeLabels() {
        return array(
            'firstname' => 'First & Middle Name',
            'birth' => 'Birthdate'
        );
    }

    public function rules() {
        return [
            ['title_id, firstname, lastname', 'required'],
            //['passport_number, passport_country_id, passport_expiry, birth', 'required', 'on' => 'full'],
            ['birth', 'required', 'on' => 'international, full, infant, child'],
            ['passport_expiry, birth', 'validateDate'],
            ['passport_expiry', 'validatePassportExpiry'],
            ['birth', 'validateDob'],
            ['firstname', 'CRegularExpressionValidator', 'pattern' => '/^[a-zA-z\s]{2,}$/', 'message' => "{attribute} should contain only English letters and should have at least 2 of them."],
            ['lastname', 'CRegularExpressionValidator', 'pattern' => '/^[a-zA-z\s]{2,}$/', 'message' => "{attribute} should contain only English letters and should have at least 2 of them."],
            ['type_id, title_id, id, passport_number, passport_country_id, passport_expiry, birth, firstname, lastname, traveler_type_id', 'safe']
        ];
    }

    public function findOrCreate(\UserInfo $ui = null) {
        $traveler = null;
        if ($this->id) {
            $traveler = \Traveler::model()->findByPk($this->id);

            if ($traveler && $traveler->user_info_id != $ui->id) {
                $traveler = null;
                $this->id = null;
            }
        }

        if (!$traveler) {
            $traveler = new \Traveler();
            $traveler->user_info_id = $ui->id;
        }


        //$traveler->traveler_type_id = $this->type_id;
        $traveler->traveler_title_id = $this->title_id;
        $traveler->first_name = $this->firstname;
        $traveler->last_name = $this->lastname;

        if ($this->passport_number) {
            $traveler->passport_number = $this->passport_number;
        }
        if ($this->passport_country_id) {
            $traveler->passport_country_id = $this->passport_country_id;
        }
        if ($this->_isValidDate($this->birth)) {
            $traveler->birthdate = vsprintf('%04d-%02d-%02d', $this->birth);
        }
        if ($this->_isValidDate($this->passport_expiry)) {
            $traveler->passport_expiry = vsprintf('%04d-%02d-%02d', $this->passport_expiry);
        }

        if (!$traveler->id) {
            $id = (int) $traveler->insertIfMissing();
            $traveler = \Traveler::model()->findByPk($id);
        } else {
            $traveler->update();
        }

//        if ($traveler->birthdate != null && !empty($traveler->birthdate)) {
//            ;
//        } else {
//            $dob = null;
//            if((int) $this->type_id==\TravelerType::TRAVELER_ADULT)
//                $dob= date('Y-m-d',strtotime(date("Y-m-d", mktime()) . " - 20 year"));
//            else if((int) $this->type_id==\TravelerType::TRAVELER_CHILD)
//                $dob= date('Y-m-d',strtotime(date("Y-m-d", mktime()) . " - 8 year"));
//            else if((int) $this->type_id==\TravelerType::TRAVELER_INFANT)
//                $dob= date('Y-m-d',strtotime(date("Y-m-d", mktime()) . " - 1 year"));
//
//            $traveler->birthdate = $dob;
//            $traveler->update('birthdate');
//        }

        return $traveler;
    }

    public function validateDate($attribute, $params) {
        if (!empty($this->$attribute) && ['', '', ''] != $this->$attribute) {
            if (!$this->_isValidDate($this->$attribute)) {
                $this->addError($attribute, sprintf('%s is not a valid date', $this->getAttributeLabel($attribute)));
            }
        }
    }

    public function validatePassportExpiry($attribute, $params) {
        
    }

    /*
     * Checking child and infant date of birth validation based on the arrival date
     */

    public function validateDob($attribute, $params) {
        $flag = false;
        if (!empty($this->$attribute) && ['', '', ''] != $this->$attribute) {
            if ($this->type_id == \TravelerType::TRAVELER_CHILD || $this->type_id == \TravelerType::TRAVELER_INFANT) {
                $dateOfBirth = implode('-', $this->$attribute);
                $arrivalDate = $this->booking->getLastFlightArrivalDate();
                if(!empty($dateOfBirth) && !empty($arrivalDate)){
                    $diff = date_diff(date_create($dateOfBirth), date_create($arrivalDate));
                    $diffyr = $diff->format('%y');
                    $diffdy = $diff->format('%d');
                    if ($this->type_id == \TravelerType::TRAVELER_CHILD) {
                        if ($diffyr >= 2 && $diffyr < 12) {
                            $flag = true;
                        } else if ($diffyr == 12 && $diffdy == 0) {
                            $flag = true;
                        }
                        if (!$flag) {
                            $this->addError($attribute, sprintf('Child age should be between 2 - 12 years', $this->getAttributeLabel($attribute)));
                        }
                    } else if ($this->type_id == \TravelerType::TRAVELER_INFANT) {
                        if ($diffyr < 2) {
                            $flag = true;
                        } else if ($diffyr == 2 && $diffdy == 0) {
                            $flag = true;
                        }
                        if (!$flag) {
                            $this->addError($attribute, sprintf('Infant age should be between 0 - 2 years', $this->getAttributeLabel($attribute)));
                        }
                    }
                }                
            }
        }
    }

    protected function _isValidDate($date) {
        return 3 == count($date) && checkdate((int) $date[1], (int) $date[2], (int) $date[0]);
    }

}
