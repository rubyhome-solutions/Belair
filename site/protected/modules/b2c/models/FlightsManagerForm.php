<?php

namespace b2c\models;
use b2c\components\ControllerExceptionable;

class FlightsManagerForm extends \CFormModel {
    use ControllerExceptionable;
    const MAX_PASSENGERS = 9;

    public $force = false;
    public $tripType = 1;
    public $cabinType = 1;
    public $domestic = 1;
    public $flights;
    public $passengers = [1,0,0];
    public $cs = \ClientSource::SOURCE_DIRECT;

    protected $_flightsErrors = [];

    public function rules() {
        return [
            ['tripType, cabinType, flights, passengers', 'required', 'on' => 'search'],
            ['cabinType', 'numerical', 'integerOnly' => true],
            ['cabinType', 'exist', 'allowEmpty' => true, 'attributeName' => 'id', 'className' => '\CabinType'],
            ['tripType', 'in', 'allowEmpty' => true, 'range' => [1,2,3], 'message' => 'Incorrect TripType'],

            ['passengers', 'validatePassengers'],
            ['flights', 'validateFlights'],

            ['tripType, cabinType, domestic, flights, passengers, force, cs', 'safe']
        ];
    }

    public function getSearchUrl() {
        $cs = '';
        $get_query_string_url = parse_url(\YII::app()->request->urlReferrer);
        if (!empty($get_query_string_url['query'])) {
            parse_str($get_query_string_url['query'], $query);
            if (!empty($query['cs'])) {
                $cs = '?cs=' . $query['cs'];
            }
        }
        /* $url = ['/b2c/flights/search', $this->domestic ? 'd' : 'i', $this->cabinType, implode(',', $this->passengers)]; */
        /* FOR MOBILE VIEW */
        $airport_codes = ['DAE','BEK','AMD','AKD','IXU','BOM','PAB','BHJ','IXG','BDQ','BHO','BHU','NMB','GOI','IDR','JLR','JGA','IXY','HJR','KLH','IXK','NAG','ISK','PNQ','PBD','RAJ','RPR','SSE','STV','UDR','IXA','AJL','IXB','BBI','CCU','COH','GAY','IMF','IXW','JRH','IXH','IXS','IXI','PAT','IXR','RRK','VTZ','AGR','IXD','ATQ','VNS','KUU','IXC','DED','DEL','GWL','JDH','JAI','IXJ','KNU','KTU','LUH','IXL','LKO','IXP','PGH','SXR','TNI','AGX','BLR','BEP','VGA','CJB','COK','CCJ','CDP','HYD','IXM','IXE','MAA','IXZ','PNY','RJA','TIR','TRZ','TRV','DIU','HBX','SHL','GAU','DMU','TEZ','DIB','SLV','NDC','DHM','GOP','BPM','LTU','MYQ','BUP','CBD','IXN','IXQ','IXT','IXV','JGB','LDA','MZU','RGH','RTC','RUP','SXV','TCR','TEI','TJV','WGC','ZER'];
    	$domestic_airports = \Utils::getAirportIDs($airport_codes);
        /* FOR MOBILE VIEW */
    	$airport_codes = ['KWI','XMB','XNB','DXB','MCT','CMB','RML','KTM','SIN','QPG','XSP','BKK','DMK','ZVJ','DHF','AUH','AZI'];
    	$roundDomestic = \Utils::getAirportIDs($airport_codes);
    	//array(3419,1328,5117,1327,4877,1287,5134,391,4172,897,3858,4564,2636);

    	//\Utils::dbgYiiLog($roundDomestic);
    	$flights = [];
        foreach ($this->flights as $flight) {
        	/* MOBILE VIEW */
        	if(in_array($flight['from'], $domestic_airports) && in_array($flight['to'], $domestic_airports)){$domestic=true;}
        	/* MOBILE VIEW */
            $flights[] = \Airport::getAirportCodeFromId($flight['from'])  . '-' . \Airport::getAirportCodeFromId($flight['to']) . '/' . $flight['depart_at'] . (!empty($flight['return_at']) ? '/'.$flight['return_at'] : '');
            /*CHECK IF ROUND TRIP*/
            if(!empty($flight['return_at'])){
            	if((in_array($flight['from'],$domestic_airports) && in_array($flight['to'], $roundDomestic)) || (in_array($flight['to'],$domestic_airports) && in_array($flight['from'], $roundDomestic))){
            		$roundDom = true;
            	}
            }
        }
        if (isset($roundDom) || isset($domestic)) {
            $url = ['/b2c/flights/search', 'd', $this->cabinType, implode(',', $this->passengers)];
        } else {
            if ($this->isMobile()) {
                $url = ['/b2c/flights/search', 'i', $this->cabinType, implode(',', $this->passengers)];
            } else {
                $url = ['/b2c/flights/search', $this->domestic ? 'd' : 'i', $this->cabinType, implode(',', $this->passengers)];
            }
        }
        //$url = ['/b2c/flights/search', isset($domestic)?'d':'i', $this->cabinType, implode(',', $this->passengers)];
        return implode('/', $url) . ';' . implode(';', $flights).$cs;
    }
    
    public function attributeLabels() {
        return [
            'cabinType' => 'Class'
        ];
    }

    public function validateFlights() {
        $errors = [];

        if (count($this->flights) > 0) {
            foreach ($this->flights as $i => $flight) {
                $form = new FlightForm(2 == $this->tripType ? 'roundtrip' : null);
                $form->attributes = $flight;
                // SQL injection prevention
                settype($form->to, 'integer');
                settype($form->from, 'integer');

                if (!$form->validate()) {
                    $this->_flightsErrors[$i] = $form->getErrors();
                }
            }
        }
    }

    public function validatePassengers() {
        if (!empty($this->passengers)) {
            if (3 === count($this->passengers)) {
                if ($this->passengers[0] + $this->passengers[1] > static::MAX_PASSENGERS) {
                    $this->addError('passengers', 'Maximum number of 9 passengers allowed');
                }

                if ($this->passengers[0] + $this->passengers[1] <= 0) {
                    $this->addError('passengers', 'At least one passenger is required');
                }

                if ($this->passengers[0] < $this->passengers[2]) {
                    $this->addError('passengers', 'Number of infants should be less than number of adults');
                }
            } else {
                $this->addError('passengers', 'Incorrect passengers format');
            }
        }
    }

    public function validate($attributes = NULL, $clearErrors = true) {
        $this->_flightsErrors = [];
        $ok = parent::validate($attributes, $clearErrors);

        return $ok && 0 == count($this->_flightsErrors);
    }

    public function getErrors($attribute = NULL) {
        return array_merge(parent::getErrors($attribute), ['flight' => $this->_flightsErrors]);
    }

    public function toJson() {
        $out = [];
        foreach ($this->attributes as $k => $v) {
            if (null !== $v) {
                $out[$k] = $v;
            }
        }

        return $out;
    }
}