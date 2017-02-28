<?php

namespace application\components\client_sources\DeepLink;

/**
 * DeepLink FlightFare
 *
 * @author Boxx
 */
class FlightFare {

//    public $totalbasefare = 0;
    public $currency = 'INR';
//    public $totaltax = 0;
//    public $totalyq = 0;
    public $totalnet = 0;
//    public $discount = 0;
//    public $servicefee = 0;
    public $adultbasefare = 0;
    public $adulttax = 0;
//    public $adultyq = 0;
    public $childbasefare = 0;
    public $childtax = 0;
//    public $childyq = 0;
    public $infantbasefare = 0;
    public $infanttax = 0;
//    public $infantyq = 0;
    public $refundableinfo = "Refundable";

    /**
     * Add numbers from RC object to the fare
     * @param \RoutesCache $rc
     */
    function addRouteCacheFees(\RoutesCache $rc, \Searches $search) {

//        $this->discount += $rc->discount;
//        $this->servicefee += $rc->bookingFee;
//        $this->totalbasefare += $rc->base_fare;
//        $this->totaltax += $rc->total_taxes;
//        $this->totalyq += $rc->tax_yq;
        $paxTypesCount = [
            \TravelerType::TRAVELER_ADULT => $search->adults,
            \TravelerType::TRAVELER_CHILD => $search->children,
            \TravelerType::TRAVELER_INFANT => $search->infants,
        ];
        
        $this->totalnet += ($rc->base_fare + $rc->total_taxes - $rc->discount + $rc->bookingFee) * $paxTypesCount[$rc->traveler_type_id];

        switch ($rc->traveler_type_id) {
            case \TravelerType::TRAVELER_ADULT :
                $this->adultbasefare += $rc->base_fare;
                $this->adulttax += $rc->total_taxes - $rc->discount + $rc->bookingFee;
//                $this->adultyq += $rc->tax_yq;
                break;

            case \TravelerType::TRAVELER_CHILD :
                $this->childbasefare += $rc->base_fare;
                $this->childtax += $rc->total_taxes - $rc->discount + $rc->bookingFee;
//                $this->childyq += $rc->tax_yq;
                break;

            case \TravelerType::TRAVELER_INFANT :
                $this->infantbasefare += $rc->base_fare;
                $this->infanttax += $rc->total_taxes - $rc->discount + $rc->bookingFee;
//                $this->infantyq += $rc->tax_yq;
                break;
        }
    }

}
