<?php

namespace b2c\models;

use b2c\components\FlightTransformer;
use b2c\components\BookingTransformer;

/**
 * Class Booking
 * @package b2c\models
 */
class Booking extends \CFormModel {

    const PRICEDIFF_IGNORE_LEVEL = 100;
    const SESSION_KEY = 'booking_';

    /**
     * @param Flight[] $flights
     * @return static
     */
    static public function create(array $flights, $url = null, $cur = 'INR') {
        usleep(mt_rand(100, 1000));
        $booking = new static;
        $booking->_id = null;
        $booking->currency = $cur;
        foreach ($flights as $i) {
            $rcs = [];
            foreach($i->routes as $routes) {
                foreach($routes as $rc) {
                    $rcs [] = $rc->attributes;
                }
            }
            $booking->search_ids[$i->search->id]['rcs'] = json_encode($rcs);
        }
        $microtime = str_replace('.', '', microtime(true));
        $booking->_id = abs(crc32($booking->_id . $microtime));
        $booking->searchurl = $url ? $url : static::createUrl($flights);
        $booking->clientSourceId = $flights[0]->clientSource;

        $booking->flights = $flights;
        $booking->passengerTypes = [$flights[0]->search->adults, $flights[0]->search->children, $flights[0]->search->infants];
        $booking->ref_id = self::_getRefID();
        foreach ($booking->search_ids as $search_id=>$rcs) {
            try {
                $booking_log_searches = new \BookingLogSearches;
                $booking_log_searches->isNewRecord = true;
                $booking_log_searches->booking_id = $booking->_id;
                $booking_log_searches->search_id = $search_id;
                $booking_log_searches->routes_cache = $rcs['rcs'];
                $booking_log_searches->insert();
            } catch (\Exception $e) {
                \Utils::dbgYiiLog($e->getMessage());
            }
        }
        return $booking;
    }

    /**
     * will load AirBooking from session if one does exists
     *
     * @param $id
     * @return static|null
     */
    static public function load($id) {
        return isset($_SESSION[static::SESSION_KEY . $id]) ? $_SESSION[static::SESSION_KEY . $id] : null;
    }

    static public function paymentCallback($id, $payment = null) {
        if ($booking = static::load($id)) {
            if (!$payment) {
                $pgl = $booking->getPayGateLog();

                $booking->paymentError = 'Your payment failed, please try again!';

                if ($pgl->reason) {
                    $booking->paymentError .= '<br><br> <b>Reason:</b>  ' . $pgl->reason;
                }

                $booking->addNote(null, 'Payment: failed. ' . $pgl->reason);
            } else {
                $booking->addNote(null, 'Payment: successful');

                $booking->payment_id = $payment->id;
            }

            \Yii::app()->request->redirect('/b2c/booking/' . $id);
        }
    }

    static public function createUrl(array $flights) {
        $url = [];
        $url2 = [];
        $search = $flights[0]->search;

        $url[] = $search->is_domestic ? 'd' : 'i';
        $url[] = $search->category;
        $url[] = sprintf('%s,%s,%s', $search->adults, $search->children, $search->infants);

        foreach ($flights as $i) {
            $s = $i->search;

            $url2[] = $s->origin . '-' . $s->destination . '/' . $s->date_depart . ($s->date_return ? '/' . $s->date_return : '');

            if (2 == $s->date_return) {
                break;
            }
        }

        return '/search/' . implode('/', $url) . ';' . implode(';', $url2);
    }

    protected $_id;

    /**
     * @var \Users
     */
    public $user;

    /**
     * @var Flight[]
     */
    public $flights = [];
    public $passengerTypes = [];

    /**
     * @var \Traveler[]
     */
    public $passengers = [];
    public $payment_id;
    public $pgl_id;
    public $paymentError = null;
    public $aircart_id;
    public $fakecart_id;
    public $searchurl;
    public $clientSourceId;
    public $priceDiff = 0;
    public $promo_id = null;
    public $promo_code = null;
    public $promo_value = null;
    public $payment_convenience_fee = 0;
    public $pcf_per_passenger = 0; // used for display only purpose on UI
    public $currency = 'INR';
    public $journey_type = '';
    public $promo_tnc_url = '';
    public $booking_fee = 0;
    public $step1_logged = false; // used for tracking either refreshed or step1 started
    public $callback_url = null; // used in one click to redirect user back to origin site
    public $ref_id = null; // used to store ref_id from the redirect url
    public $search_ids = []; // all the search ids to which current booking belongs

    public function rules() {
        return [
            ['flights, passengers, payment, fakecart', 'required'],
            //  ['flights', 'validateFlights'],
            //  ['passengers', 'validatePassengers'],
            //  ['payment', 'validatePayment']
        ];
    }

    public function persist() {
        $_SESSION[static::SESSION_KEY . $this->id] = $this;
        return $this;
    }

    public function setJourneyType() {
        $airports = [];
        foreach ($this->flights as $flight) {
            $airports [$flight->getSearch()->origin] = $flight->getSearch()->origin;
            $airports [$flight->getSearch()->destination] = $flight->getSearch()->destination;
        }
        $this->journey_type = \Utils::getJourneyType($airports);
    }

    public function getId() {
        return $this->_id;
    }

    public function getPrice() {
        $price = 0;
        foreach ($this->flights as $i) {
            $price += $i->getCommercialPrice();
        }

        return $price;
    }

    public function getTaxes() {
        $taxes = ['basic_fare' => 0, 'yq' => 0, 'jn' => 0, 'other' => 0];

        foreach ($this->flights as $i) {
            $taxes['basic_fare'] += $i->taxes['basic_fare'];
            $taxes['yq'] += $i->taxes['yq'];
            $taxes['jn'] += $i->taxes['jn'];
            $taxes['other'] += $i->taxes['other'];
        }

        return $taxes;
    }

    public function getPaxTaxes() {
        $taxes = $this->flights[0]->getPaxTaxes();

        foreach ($this->flights as $c => $i) {
            if (0 == $c)
                continue;

            foreach ($i->paxTaxes as $pax => $t) {
                foreach ($t as $kk => $vv) {
                    $taxes[$pax][$kk] += $vv;
                }
            }
        }

        return $taxes;
    }

    public function getAircart() {
        return $this->aircart_id ? \AirCart::model()->findByPk($this->aircart_id) : null;
    }

    public function getFakecart() {
        return $this->fakecart_id ? \AirCart::model()->findByPk($this->fakecart_id) : null;
    }

    public function getPayment() {
        return $this->payment_id ? \Payment::model()->findByPk($this->payment_id) : null;
    }

    public function getPayGateLog() {
        return $this->pgl_id ? \PayGateLog::model()->findByPk($this->pgl_id) : null;
    }

    public function getPassengerValidation() {
        $map = ['domestic', 'international', 'full'];
        $level = 0;

//        foreach ($this->flights as $i) {
//            foreach ($i->routes as $routes) {
//                foreach ($routes as $i) {
//                    if (
//                            in_array($i->destination->country_code, ['US', 'CA']) ||
//                            in_array($i->origin->country_code, ['US', 'CA'])
//                    ) {
//                        $level = max($level, 2);
//                    }
//
//                    if (in_array($i->carrier->code, ['EK', 'GF', 'KU', 'EY'])) {
//                        $level = max($level, 2);
//                    }
//
//                    if ('IN' !== $i->destination->country_code || 'IN' !== $i->origin->country_code) {
//                        $level = max($level, 1);
//                    }
//                }
//            }
//        }
        //DOB is made non compulsory for all types of flights
        return $map[$level];
    }

    public function toJson() {
        return BookingTransformer::json($this);
    }

    public function addNote($flight, $note) {
        $this->fakecart->addNote(
            $flight ? sprintf('%s-%s: %s', $flight->search->origin, $flight->search->destination, $note) : $note
        );
    }

    /**
     * Added By Satender
     * Purpose : To save screenshot while user is booking ticket for 
      1st and 2nd Step Only
     * @param type $step => numeric
     * @param type $$previous_cart_id => numeric or null
     */
    public function saveScreenShot($step, $previous_cart_id = null) {
        if (isset($_POST['imgData'])) {
            \Screenshot::save($_POST['imgData'], $step, self::SESSION_KEY . $this->id, $this->fakecart_id, $previous_cart_id);
        }
    }

    /*
     * Get the Last Arrival Date from traveller flights to check the age validaton
     * for the child and infant
     */

    public function getLastFlightArrivalDate() {
        $arrdate = '';
        $countflight = count($this->flights) - 1;
        if (!empty($this->flights[$countflight])) {
            $Allflights = $this->flights[$countflight];
            $flightarr = $Allflights->routes;
            foreach ($flightarr as $routes) {
                $arrlenth = count($routes) - 1;
                $arrdate = $routes[$arrlenth]->arrival_date;
            }
        }
        return $arrdate;
    }

    private static function _getRefID() {
        $ref_id = null;
        $request = \Yii::app()->request;
        if ($request->getQuery('skyscanner_redirectid') !== null) {
            $ref_id = $request->getQuery('skyscanner_redirectid');
        }

        return $ref_id;
    }

}
