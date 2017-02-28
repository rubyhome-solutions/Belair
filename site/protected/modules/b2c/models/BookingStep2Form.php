<?php

namespace b2c\models;

use b2c\components\B2cException;
use b2c\components\B2cFormModel;
use b2c\components\FlightsBooking;

class BookingStep2Form extends B2cFormModel {

    public $check;
    public $noop;

    /**
     * @var Passenger[]
     */
    public $passengers;
    public $scenario;

    static public function submit($attributes, $scenario = null, $booking) {
        $browser = new \BrowserDetection();
        $form = static::factory([], $scenario);
        $form->check = isset($attributes['check']) ? $attributes['check'] : false;

        if (!$form->noop && !$booking->user) {
            throw new B2cException(4009, 'Complete first step first!');
        }

        $errors = [];
        $form->passengers = [];
        foreach ($attributes['passengers'] as $k => $v) {
            /* in case of unused variable set for mobile which we use in javascript  */
            if ($browser->isMobile()) {
                if (isset($v['traveler']['birthd'])) {
                    unset($v['traveler']['birthd']);
                }
                if (isset($v['traveler']['pd'])) {
                    unset($v['traveler']['pd']);
                }
            }
            $traveler = new Passenger($scenario);
            /* sending the booking object to the passenger module checking dob validation based on arrival date */
            $traveler->booking = $booking;

            $traveler->attributes = $v['traveler'];

            if ($v['type_id'] == 3) {
                $traveler->setscenario('infant');
            } else if ($v['type_id'] == 2) {
                $traveler->setscenario('child');
            }

            $traveler->type_id = $v['type_id'];

            $form->passengers[] = $traveler;

            if (!$traveler->validate()) {
                $errors[$k] = $traveler->getErrors();
            }
        }

        if (count($errors)) {
            throw new B2cException(4000, 'Validation Error', $errors);
        }

        return call_user_func_array([$form, 'process'], array_slice(func_get_args(), 2));
    }

    public function process(Booking $booking) {
        $out = [];
        $passengers = [];

        foreach ($this->passengers as $i) {
            $passengers[] = $p = $i->findOrCreate($booking->user->userInfo);
            $p->traveler_type_id = $i->type_id;
            $out[] = $p->id;
        }

        $booking->passengers = $passengers;

        $passengers[0]->email = $booking->user->email;
        $passengers[0]->phone = $booking->user->mobile;
        $passengers[0]->update(['email','phone']);

        if (empty($booking->user->name)) {
            $booking->user->userInfo->name = $booking->user->name = $passengers[0]->first_name . ' ' . $passengers[0]->last_name;

            $booking->user->userInfo->update(['name']);
            $booking->user->update(['name']);
        }

        $booking->persist();
        \Utils::setActiveUserAndCompany($booking->user->id);
        $previous_cart_id = $booking->fakecart_id;
        //if (!$booking->fakecart_id) {
        FlightsBooking::fakeBook($booking);
        //}
        \BookingLog::push_log($booking->id, '', 'step 2 done');
        $booking->saveScreenShot(2, $previous_cart_id);

        if ($this->check) {
            try {
                if (FlightsBooking::checkAvailabilityAndFares($booking, true)) {
                    \Utils::jsonResponse(['Everything is A-OK']);
                }

                \Utils::jsonResponse(['Booking is no longer available']);
            } catch (B2cException $e) {
                \Utils::jsonResponse([$e->getMessage(), $e->getErrors()]);
            }
        } else {


            if (!FlightsBooking::checkAvailabilityAndFares($booking)) {
                throw new B2cException(4003, 'Sorry! The booking you have chosen is no longer available with the airline. Please select another flight');
            }
        }

        sleep(1);
        \BookingLog::push_log($booking->id, '', 'step 3 started');
        return $out;
    }

}
