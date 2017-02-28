<?php

namespace application\components\B2cApi;

/**
 * GetAirCart
 *
 * @author Boxx
 * @package B2cApi
 */
class GetAirCart {

    /**
     *
     * @var Auth
     */
    public $credentials = null;
    public $cartID = null;
    public $pgl_id = null;

    /**
     *
     * @var \AirCart
     */
    public $airCart = null;

    public function __construct() {
        $this->credentials = new Auth;
    }

    /**
     * Validate the credentials and the journeys key elements
     * @return boolean
     */
    function validate() {
        $this->credentials->authenticate();
        // Validate major fields
        if (empty($this->cartID)) {
            throw new B2cApiException(B2cApiException::MISSING_CART_ID, null, 400);
        }
        return true;
    }

    function setCart() {
        settype($this->cartID, 'int');
        $this->airCart = \AirCart::model()->with([
                    'airBookings.airRoutes' => [
                        'joinType' => 'INNER JOIN',
                        'order' => '"airBookings".departure_ts, "airRoutes".order_'
                    ]
                ])->findByPk($this->cartID);

        if ($this->airCart === null) {
            throw new B2cApiException(B2cApiException::CART_NOT_FOUND, null, 404);
        }
        if ($this->airCart->user->user_info_id !== $this->credentials->user->user_info_id) {
            throw new B2cApiException(B2cApiException::CART_NOT_OWNED, null, 403);
        }
    }

    /**
     * Return the results
     * @return string JSON encoded results
     */
    function results() {
        $this->setCart();
        $out['airCart'] = $this->airCart->pretty();
        foreach ($this->airCart->airBookings as $abKey => $airBooking) {
            $out['airBooking'][$abKey] = $airBooking->pretty();
            $out['airBooking'][$abKey]['traveler'] = $airBooking->traveler->pretty();
            foreach ($airBooking->airRoutes as $airRoute) {
                $out['airBooking'][$abKey]['segments'][] = $airRoute->pretty();
            }
        }
        $out['pgl_id']=$this->pgl_id;
        return json_encode($out);
    }

}
