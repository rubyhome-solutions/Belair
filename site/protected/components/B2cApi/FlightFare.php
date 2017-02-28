<?php

namespace application\components\B2cApi;

/**
 * DeepLink FlightFare
 *
 * @author Boxx
 */
class FlightFare {

    public $currency = 'INR';
    public $totalBaseFare = 0;
    public $totalTax = 0;
    public $discount = 0;
    public $serviceFee = 0;
    public $totalNet = 0;
    public $totalYQ = 0;
    public $totalJN = 0;
    public $totalOther = 0;
    public $totalPSF = 0;
    public $totalUDF = 0;
    public $adultBaseFare = 0;
    public $adultTax = 0;
    public $adultYQ = 0;
    public $adultJN = 0;
    public $adultOther = 0;
    public $adultPSF = 0;
    public $adultUDF = 0;
    public $childBaseFare = 0;
    public $childTax = 0;
    public $childYQ = 0;
    public $childJN = 0;
    public $childOther = 0;
    public $childPSF = 0;
    public $childUDF = 0;
    public $infantBaseFare = 0;
    public $infantTax = 0;
    public $infantYQ = 0;
    public $infantJN = 0;
    public $infantOther = 0;
    public $infantPSF = 0;
    public $infantUDF = 0;
//    public $refundableInfo = "Refundable";

    /**
     * Add numbers from RC object to the fare
     * @param \RoutesCache $rc
     */
    function addRouteCacheFees(\RoutesCache $rc) {

        $this->discount += $rc->discount;
        $this->serviceFee += $rc->bookingFee;
        $this->totalBaseFare += $rc->base_fare;
        $this->totalTax += $rc->total_taxes;
        $this->totalYQ += $rc->tax_yq;
        $this->totalJN += $rc->tax_jn;
        $this->totalOther += $rc->tax_other;
        $this->totalPSF += $rc->tax_psf;
        $this->totalUDF += $rc->tax_udf;
        $this->totalNet += ($rc->base_fare + $rc->total_taxes - $rc->discount + $rc->bookingFee);

        switch ($rc->traveler_type_id) {
            case \TravelerType::TRAVELER_ADULT :
                $this->adultBaseFare += $rc->base_fare;
                $this->adultTax += $rc->total_taxes;
                $this->adultYQ += $rc->tax_yq;
                $this->adultJN += $rc->tax_jn;
                $this->adultOther += $rc->tax_other;
                $this->adultPSF += $rc->tax_psf;
                $this->adultUDF += $rc->tax_udf;
                break;

            case \TravelerType::TRAVELER_CHILD :
                $this->childBaseFare += $rc->base_fare;
                $this->childTax += $rc->total_taxes;
                $this->childYQ += $rc->tax_yq;
                $this->childJN += $rc->tax_jn;
                $this->childOther += $rc->tax_other;
                $this->childPSF += $rc->tax_psf;
                $this->childUDF += $rc->tax_udf;
                break;

            case \TravelerType::TRAVELER_INFANT :
                $this->infantBaseFare += $rc->base_fare;
                $this->infantTax += $rc->total_taxes;
                $this->infantYQ += $rc->tax_yq;
                $this->infantJN += $rc->tax_jn;
                $this->infantOther += $rc->tax_other;
                $this->infantPSF += $rc->tax_psf;
                $this->infantUDF += $rc->tax_udf;
                break;
        }
    }

}
