<?php

namespace b2c\components;

use b2c\models\Booking;
use b2c\models\Flight;

class FlightsBooking {

    static protected $TRAVELER_TYPE_MAP = [null, 'ADT', 'CNN', 'INF'];
    static protected $_RETRY = 0;

    /**
     * @param Booking $booking
     * @return bool
     */
    static public function book($booking) {
        if (!$booking->validate()) {
            throw new B2cException(4099, 'Booking validation failed', $booking->getErrors());
        }


        \Utils::setActiveUserAndCompany($booking->user->id);
        $booking->addNote(null, 'Booking: start');

        $all = true;
        $aircarts = [];
        unset(\Yii::app()->session['promo']);
        if (!empty($booking->promo_id) && !empty($booking->promo_code)) {
            \Yii::app()->session['promo'] = [
                'promo_id' => $booking->promo_id,
                'promo_code' => $booking->promo_code,
                'promo_value' => $booking->promo_value
            ];
        }
        if (!self::checkAvailabilityAndFares($booking)) {
        	throw new B2cException(4003, 'Sorry! The booking you have chosen is no longer available with the airline. Please select another flight');
        }
        foreach ($booking->flights as $flight) {
             $flightSegments=static::segmentsJson($flight);
            if ($flight->airSource->backend->isAmadeus) {               
                $book = new $flight->airSource->backend->book(
                        (int) $flight->airSource->id, [
                            'segments' => static::segmentsJson($flight),
                            'pax' => static::paxJson($flight,$flightSegments),
                            'cabinTypeId' => $flight->routes[0][0]->cabin_type_id
                        ],
                        static::travelersJson($booking->passengers),
                        $flight->airSource->getFop($booking->user->id,$flight->routes[0][0]),
                        $flight->airSource->getCc($booking->user->id, $flight->routes[0][0]),
                        $flight->routes[0][0]->carrier_id
                );

                $result = $book->doBooking();
            } else {
                $result = \ApiInterface::book(
                                (int) $flight->airSource->id, [
                            'segments' => static::segmentsJson($flight),
                            'pax' => static::paxJson($flight,$flightSegments),
                            'cabinTypeId' => $flight->routes[0][0]->cabin_type_id
                        ],
                        static::travelersJson($booking->passengers),
                        $flight->airSource->getFop($booking->user->id, $flight->routes[0][0]),
                        $flight->airSource->getCc($booking->user->id, $flight->routes[0][0]),
                        $flight->routes[0][0]->carrier_id
                );
            }

            if (isset($result['error'])) {
                $booking->addNote($flight, $result['error']);
                $all = false;

                break;
            }

            $aircarts[] = \AirCart::model()->findByPk($result['airCartId']);
        }

        /* @var $ac \AirCart */
        if (count($aircarts)) {
            if ($all) {
                $booking->addNote(null, 'Booking: success');
            }

            $ac = array_shift($aircarts);
            if (count($aircarts)) {
                $ac->mergeCarts($aircarts);
            }

            $ac->client_source_id = $booking->flights[0]->clientSource;
            $ac->update(['client_source_id']);

            // Remove the fake cart
            if ($booking->fakecart_id) {
                $booking->fakecart->removeFake($ac);
            }

            $ac->refresh();
            $ac->setAirBookingsAndAirRoutesOrder();
            $ac->applyBothRules();

            if ($all) {
                $ac->setBookingStatus();
            } else {
                $ac->setBookingStatus(true);
            }

            $booking->aircart_id = $ac->id;
            $booking->persist();
        } else {
            //$booking->addNote(null, 'Booking: failed');
            $booking->aircart_id = $booking->fakecart_id;
            $booking->persist();
            $aircrt = \AirCart::model()->findByPk((int) $booking->aircart_id);
            if (!empty($booking->promo_id) && !empty($booking->promo_code)) {
                
                if (empty($aircrt->promo_codes_id)) {
                    $aircrt->applyPromoCode($booking->promo_id, $booking->promo_code, $booking->promo_value);
                }
            }
            if ($aircrt->user->userInfo->user_type_id === \UserType::clientB2C) {
                    $aircrt->sendBookedEmailforB2C();
            } else {
                    $aircrt->sendBookedEmailforOther();
             }
            throw new B2cException(4099, 'Booking Failed');
        }
    }

    /**
     * @param Booking $booking
     * @return bool
     */
    static public function checkAvailabilityAndFares($booking, $throw = false) {
        $ok = true;
        $priceDiff = null;
        \Utils::setActiveUserAndCompany($booking->user->id);
        ErrorHandler::start();
        try {
            foreach ($booking->flights as $flight) {
                $segments=static::segmentsJson($flight);
                $result = \ApiInterface::checkAvailabilityAndFares(
                                (int) $flight->airSource->id, ['segments' => static::segmentsJson($flight), 'pax' => static::paxJson($flight,$segments), 'cabinTypeId' => $flight->routes[0][0]->cabin_type_id], static::travelersJson($booking->passengers)
                );
                //$result = ['errorCode' => \ApiInterface::FARE_INCREASED, 'priceDiff' => 200];
                
                if (true !== $result) {
                    if($result['errorCode']!==\ApiInterface::FARE_DECREASED){
                        if (in_array($result['errorCode'], [ \ApiInterface::FARE_INCREASED])) { //removed fare decrease \ApiInterface::FARE_DECREASED,
                            $priceDiff += $result['priceDiff'];
                            $flight->priceDiff = $result['priceDiff'];

                            $booking->addNote($flight, 'Price difference of ' . $result['priceDiff']);
                        } else if($result['errorCode']===\ApiInterface::SEARCH_AGAIN){                        
                            $flight->setRoutesByForce($flight->routes);
                            $booking->persist();
                        }
                        else {
                            $booking->addNote($flight, \ApiInterface::$errorMessages[$result['errorCode']]);

                            if ($throw) {
                                throw new B2cException(4001, \ApiInterface::$errorMessages[$result['errorCode']]);
                            }


                            return false;
                        }
                    }
                }
            }
        } catch (\ErrorException $e) {
            if (static::$_RETRY++ >= 2) {
                throw new B2cException(4001, "Service provider error, please try again.");
            }

            sleep(1);

            ErrorHandler::stop();
            return static::checkAvailabilityAndFares($booking);
        }

        ErrorHandler::stop();

        //$priceDiff = -1000;
        if ($priceDiff) {
            $booking->priceDiff = $priceDiff;
            if ($priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL) {
                $booking->fakecart->priceAdjustment($priceDiff);

                $price = $booking->price + $priceDiff;

                $booking->persist();
                throw new B2cException(4005, "Price is no longer valid", ['price' => $price, 'priceDiff' => $priceDiff]);
            }
        }

        return $ok;
    }

    static public function fakeBook($booking) {
        \Utils::setActiveUserAndCompany($booking->user->id);
        $fakes = [];
        foreach ($booking->flights as $flight) {
            $segments=static::segmentsJson($flight);
            $id = (int) \ApiInterface::fakeBook(
                            $flight->airSource->id, ['segments' => static::segmentsJson($flight), 'pax' => static::paxJson($flight,$segments), 'cabinTypeId' => $flight->routes[0][0]->cabin_type_id], static::travelersJson($booking->passengers), $booking->flights[0]->clientSource, $flight->routes[0][0]->carrier_id
                    )['airCartId'];

            $fakes[] = \AirCart::model()->findByPk($id);
        }

        $cart = array_shift($fakes);
        if (count($fakes) > 0) {
            $cart->mergeCarts($fakes);
        }

        $booking->fakecart_id = $cart->id;

        $booking->persist();
    }

    static public function segmentsJson($flight) {
        $out = [];
        foreach ($flight->routes as $routes) {
            $legs_json = json_decode($routes[0]->legs_json);

            if ($flight->isGDS()) {
                $out[] = static::segmentJson($legs_json[0]);

                if ($flight->isRoundTrip()) {
                    $out[] = static::segmentJson($legs_json[1]);
                }
            } else {
                $out[] = static::segmentJson($legs_json);
            }
        }

        usort($out, function($a, $b) {
            return strtotime($a[0]['depart']) > strtotime($b[0]['depart']) ? 1 : -1;
        });


        array_unshift($out, null);
        unset($out[0]);

        return $out;
    }

    static public function segmentJson($legs) {
        //$legs = json_decode($rc->legs_json)[$gds_back ? 1 : 0];
        if (!is_array($legs)) { // LLC legs
            $legs = [$legs];
        }

        $segment = [];
        foreach ($legs as $leg) {
            $fn = explode('-', $leg->flighNumber);

            $segment[strtotime($leg->depart)] = [
                'origin' => static::airportJson($leg->origin),
                'destination' => static::airportJson($leg->destination),
                'depart' => explode(' ', $leg->depart)[0],
                'flightNumber' => $fn[1],
                'marketingCompany' => $fn[0],
                'bookingClass' => $leg->bookingClass,
                'departTs' => $leg->depart,
                'arriveTs' => $leg->arrive,
                'productClass'=>isset($leg->product_class)?$leg->product_class:null,
            ];
        }

        ksort($segment);

        return array_values($segment);
    }

    static function airportJson($airport) {
        preg_match('/.*\((.*)\)$/', $airport, $m);
        return $m[1];
    }

    static public function paxJson(Flight $flight,$segments=null) {
        $pax = [];
        $c = 1;
        foreach ($flight->routes as $routes) {
            $p=0;
            foreach ($routes as $rc) {
                if (!isset($pax[$rc->traveler_type_id])) {
                    $price = $rc->total_fare + $rc->total_tax_correction;
                    if (1 == $c && $flight->priceDiff) {
                        $pnrs = null;
                        if (\TravelerType::TRAVELER_ADULT == $rc->traveler_type_id) {
                            $pnrs = $flight->search->adults;
                        } else if (\TravelerType::TRAVELER_CHILD == $rc->traveler_type_id) {
                            $pnrs = $flight->search->children;
                        } else if (\TravelerType::TRAVELER_INFANT == $rc->traveler_type_id) {
                            $pnrs = $flight->search->infants;
                        }

                        $price += round($flight->priceDiff / $pnrs);
                    }

                    $pax[$rc->traveler_type_id] = [
                        'totalFare' => $price,
                        'type' => static::$TRAVELER_TYPE_MAP[$rc->traveler_type_id],
                        'arrTaxes' => [
                            \Taxes::TAX_YQ => $rc->tax_yq,
                            \Taxes::TAX_UDF => $rc->tax_udf,
                            \Taxes::TAX_PSF => $rc->tax_psf,
                            \Taxes::TAX_JN => $rc->tax_jn,
                            \Taxes::TAX_OTHER => $rc->tax_other,
                            \Taxes::TAX_TOTAL_CORRECTION => $rc->total_tax_correction
                        ],
                       // 'fareBasis' => $rc->fare_basis
                    ];
                    $segKey=1;
                    $legKey=0;
                    if(!empty($segments)){
                    foreach($segments as $segment){
                        $legKey=0;
                        foreach($segment as $leg){
                            $pax[$rc->traveler_type_id]['fareBasis'][$segKey][$legKey]=$rc->fare_basis;
                            $legKey++;
                        }
                        $segKey++;
                    }}else{
                        if ($flight->isRoundTrip() && $flight->isGDS()) {
                        $pax[$rc->traveler_type_id]['fareBasis'][$c++] = $rc->fare_basis;
                    }
                    }
                    
                } else {
                    $p = &$pax[$rc->traveler_type_id];
                    $p['totalFare'] += $rc->total_fare + $rc->total_tax_correction;
                    //$p['fareBasis'] = $rc->fare_basis;
                    
                    $a = &$p['arrTaxes'];
                    $a[\Taxes::TAX_YQ] += $rc->tax_yq;
                    $a[\Taxes::TAX_UDF] += $rc->tax_udf;
                    $a[\Taxes::TAX_PSF] += $rc->tax_psf;
                    $a[\Taxes::TAX_JN] += $rc->tax_jn;
                    $a[\Taxes::TAX_OTHER] += $rc->tax_other;
                    $a[\Taxes::TAX_TOTAL_CORRECTION] += $rc->total_tax_correction;

                    $c++;
                }
            }
        }

        return $pax;
    }

    /**
     * @param \Traveler[] $passengers
     * @return array
     */
    static protected function travelersJson($passengers) {
        $travelers = [];
        foreach ($passengers as $i) {
            $travelers[] = [
                'traveler_type_id' => (int) $i->traveler_type_id,
                'id' => $i->id,
                'user_info_id' => $i->user_info_id,
                'birthdate' => $i->birthdate
            ];
        }

        return $travelers;
    }

    static function mesh($a, $b) {
        $out = [];
        foreach ($a as $k => $v) {
            if (array_key_exists($k, $b)) {
                $out[$k] = is_array($v) ? static::mesh($v, $b[$k]) : $v + $b[$k];
            } else {
                $out[$k] = $v;
            }
        }

        return $out;
    }

}
