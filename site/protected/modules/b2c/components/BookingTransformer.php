<?php

namespace b2c\components;

use b2c\models\Booking;

\Yii::setPathOfAlias('libphonenumber',\Yii::getPathOfAlias('application.vendor.libphonenumber'));

class BookingTransformer {
    static public function json(Booking $booking) {
        $cf = null;
        if ($booking->user) {
            $pgl = new \PayGateLog();
            $pgl->user_info_id = $booking->user->user_info_id;
            $pgl->amount = (double)$booking->price;
            if ($booking->paymentError === null) {
                $pgl->convince_fee = (double)$booking->payment_convenience_fee;
            }

            $cf = $pgl->convenienceFee();
        }

        return [
            'id' => $booking->id,
            'searchurl' => $booking->searchurl,
            'flights' => static::flightsJson($booking),
            'price' => $booking->price + ($booking->priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL ? $booking->priceDiff : 0),
            'priceDiff' => $booking->priceDiff && $booking->priceDiff > Booking::PRICEDIFF_IGNORE_LEVEL ? $booking->priceDiff : 0,
            'taxes' => $booking->taxes,
            'paxTaxes' => $booking->paxTaxes,
            'convenienceFee' => $cf,
            'pcf_per_passenger' => $booking->pcf_per_passenger,

            'user' => static::userJson($booking),

            'passengers' => static::passengersJson($booking),
            'passengerValidaton' => $booking->passengerValidation,

            'payment' => static::paymentJson($booking),
            'aircart_id' => $booking->aircart_id ? $booking->aircart_id : null,
            'aircart_status' => $booking->aircart_id ? $booking->aircart->booking_status_id : null,

            'steps' => static::stepsJson($booking),
            
            'clientSourceId'=> $booking->clientSourceId,
            'promo_id' =>$booking->promo_id ,
            'promo_code' =>$booking->promo_code,
            'promo_value' => $booking->promo_value,
            'promotncurl' => $booking->promo_tnc_url,
            'currency' => $booking->currency,
        ];
    }

    static public function flightsJson(Booking $booking) {
        $flights = [];
        foreach ($booking->flights as $i) {
            $flights[] = FlightTransformer::json($i);
        }

        return $flights;
    }

    static public function userJson(Booking $booking) {
        $util = \libphonenumber\PhoneNumberUtil::getInstance();




        if ($booking->user) {
            $number = $util->parse($booking->user->mobile, 'IN');

            return [
                'id' => $booking->user->id,
                'email' => $booking->user->email,
                'mobile' => $number->getNationalNumber(),
                'country' => '+'.$number->getCountryCode(),
                'logged_in' => !\Yii::app()->user->isGuest
            ];
        }

        if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);
            $number = $util->parse($user->mobile, 'IN');

            return [
                'email' => $user->email,
                'mobile' => $number->getNationalNumber(),
                'country' => '+'.$number->getCountryCode()
            ];
        }

        return [
            'email' => null,
            'mobile' => null,
            'country' => '+91'
        ];
    }

    static public function passengersJson(Booking $booking) {
        $out = [];

        $c = 0;
        foreach (range(1, $booking->passengerTypes[0]) as $i) {
            $out[] = [ 'no' => $i, 'type_id' => \TravelerType::TRAVELER_ADULT, 'traveler' => static::passengerJson($booking, $c++)];
        }

        if ($booking->passengerTypes[1]) {
            foreach (range(1, $booking->passengerTypes[1]) as $i) {
                $out[] = [ 'no' => $i, 'type_id' => \TravelerType::TRAVELER_CHILD, 'traveler' => static::passengerJson($booking, $c++)];
            }
        }

        if ($booking->passengerTypes[2]) {
            foreach (range(1, $booking->passengerTypes[2]) as $i) {
                $out[] = [ 'no' => $i, 'type_id' => \TravelerType::TRAVELER_INFANT, 'traveler' => static::passengerJson($booking, $c++)];
            }
        }



        return $out;
    }

    static public function passengerJson(Booking $booking, $n) {
        if (isset($booking->passengers[$n])) {
            $passenger = $booking->passengers[$n];

            return [
                'id' => $passenger->id,
                'title_id' => (int)$passenger->traveler_title_id,
                'firstname' => $passenger->first_name,
                'lastname' => $passenger->last_name,

                'passport_number' => $passenger->passport_number,
                'passport_country_id' => $passenger->passport_country_id,
                'passport_expiry' => $passenger->passport_expiry ? explode('-', $passenger->passport_expiry) : null,

                'birth' => $passenger->birthdate ? explode('-', $passenger->birthdate) : null
            ];
        }

        return ['id' => null];
    }

    static public function paymentJson($booking) {
        $out =  [
            'payment_id' => $booking->payment_id ? $booking->payment_id : null,
            'active' => 1,
            'cc' => ['number' => null, 'store' => true],
            'netbanking' => ['category' => 'netbanking']
        ];

        if ($booking->paymentError) {
            $out['error'] = $booking->paymentError;
            $booking->paymentError = null;
        }


        return $out;
    }

    static public function stepsJson($booking) {
        $out = [
            1 => ['active' => true],
            2 => [],
            3 => [],
            4 => []
        ];

//        if ($booking->paymentError) {
//            $out[3]['errors'] = ['payment' => ];
//            $booking->paymentError = null;
//        }

        return $out;
    }


}