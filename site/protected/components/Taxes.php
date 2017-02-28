<?php

/**
 * Description of Taxes
 */
class Taxes {

    const TAX_YQ = 'YQ';
    const TAX_JN = 'JN';
    const TAX_UDF = 'UDF';
    const TAX_PSF = 'PSF';
    const TAX_OTHER = 'Other';
    const TAX_TOTAL_CORRECTION = 'totalTaxCorrection';
    const SCRAPPER_FARE_BASE = 'SCP';

    /**
     * The coefficient used for multiplication adjustment of the service tax.
     */
    const MULTIPLIER_FOR_ADJUSTING = 0.0495;

    /**
     * This tax should not be taken into account when scrapping
     */
    const SPICEJET_SCRAPPER_TAX_TO_SUBSTRACT = 'Agency Commission - defunct';

    /**
     * This tax should be adjusted with 4.95% of the TAX_TO_SUBSTRACT
     */
    const SPICEJET_SCRAPPER_TAX_TO_ADJUST = 'Government Service Tax';

    static $taxesToSubstractAndAdjust = [
        self::SPICEJET_SCRAPPER_TAX_TO_SUBSTRACT => self::SPICEJET_SCRAPPER_TAX_TO_ADJUST,
    ];
    static $taxDescriptions = [
        self::TAX_YQ => 'Fuel charge',
        self::TAX_JN => 'Service tax',
        self::TAX_UDF => 'User Development Fees',
        self::TAX_PSF => 'Passenger Service Fees',
        self::TAX_OTHER => 'Other',
        self::TAX_TOTAL_CORRECTION => 'Total tax correction',
    ];
    public $arrTaxes = [
        self::TAX_YQ => 0,
        self::TAX_UDF => 0,
        self::TAX_PSF => 0,
        self::TAX_JN => 0,
        self::TAX_OTHER => 0,
        self::TAX_TOTAL_CORRECTION => 0,
    ];
    static $taxesScrapperReformat = [
        'Taxes and surcharges' => \Taxes::TAX_YQ,
        'CUTE Fee' => \Taxes::TAX_YQ,
        'CUTE Charge' => \Taxes::TAX_YQ,
        'Fuel Charge' => \Taxes::TAX_YQ,
        'Agency Commission' => \Taxes::TAX_OTHER,
        'Agency Transaction Fee' => \Taxes::TAX_OTHER,
        'Development Fee' => \Taxes::TAX_UDF,
        'Passenger Service Fee' => \Taxes::TAX_PSF,
        'User Development fee' => \Taxes::TAX_UDF,
        'User Development Fee Departure (UDF)' => \Taxes::TAX_UDF,
        'Arrival User Development Fee' => \Taxes::TAX_UDF,
        'Airport Arrival Tax Arrival (AAT)' => \Taxes::TAX_UDF,
        'Airport charges and fees' => \Taxes::TAX_UDF,
        'Government Service Tax' => \Taxes::TAX_JN,       
    ];

    function prepareCacheRowTaxes(\RoutesCache $cacheRow) {
        $this->arrTaxes[self::TAX_YQ] = $cacheRow->tax_yq;
        $this->arrTaxes[self::TAX_UDF] = $cacheRow->tax_udf;
        $this->arrTaxes[self::TAX_PSF] = $cacheRow->tax_psf;
        $this->arrTaxes[self::TAX_JN] = $cacheRow->tax_jn;
        $this->arrTaxes[self::TAX_OTHER] = $cacheRow->tax_other;
        $this->arrTaxes['total_fare'] = $cacheRow->total_fare;
        $this->arrTaxes['total_taxes'] = $cacheRow->total_taxes;
        unset($this->arrTaxes[self::TAX_TOTAL_CORRECTION]);
        return $this->arrTaxes;
    }
    
    /**
     * Fill the taxes in AirBooking structure with the data from arrTaxes array
     * @param AirBooking $airBooking The AirBooking structure
     * @param array $arrTaxes The Taxes::$arrTaxes array with the data
     * @return \AirBooking
     */
    static function fillTaxesInAirBooking(AirBooking $airBooking, $arrTaxes) {
        $airBooking->fuel_surcharge = isset($arrTaxes[self::TAX_YQ]) ? $arrTaxes[self::TAX_YQ] : 0;
        $airBooking->jn_tax = isset($arrTaxes[self::TAX_JN]) ? $arrTaxes[self::TAX_JN] : 0;
        $airBooking->udf_charge = (isset($arrTaxes[self::TAX_UDF]) ? $arrTaxes[self::TAX_UDF] : 0) + (isset($arrTaxes[self::TAX_PSF]) ? $arrTaxes[self::TAX_PSF] : 0);
        $airBooking->other_tax = isset($arrTaxes[self::TAX_OTHER]) ? $arrTaxes[self::TAX_OTHER] : 0;
//        $airBooking->commission_or_discount_gross = isset($arrTaxes[self::TAX_TOTAL_CORRECTION]) ? $arrTaxes[self::TAX_TOTAL_CORRECTION] : 0;
        $airBooking->commission_or_discount_gross = 0;

        return $airBooking;
    }

    static function reformatScrapperTaxes($str) {
        $matches = [];
        preg_match_all('/(.*?): ([\d]+[\.]?[\d]*)/', str_replace('<br>', '', $str), $matches);
//        print_r($matches);
        $tax = new \Taxes;
//        $difference = 0;
//        print_r($str);
//        echo \Utils::dbgYiiLog($matches[1]);
        foreach ($matches[1] as $key => $taxName) {
            if (in_array($taxName, array_keys(self::$taxesToSubstractAndAdjust))) {
                $tax->arrTaxes[\Taxes::TAX_TOTAL_CORRECTION] = round((1 + self::MULTIPLIER_FOR_ADJUSTING) * (float) $matches[2][$key]);
                $tax->arrTaxes[self::$taxesScrapperReformat[self::$taxesToSubstractAndAdjust[$taxName]]] -= round(self::MULTIPLIER_FOR_ADJUSTING * (float) $matches[2][$key]);
            } else {
                $tax->arrTaxes[self::$taxesScrapperReformat[$taxName]] += (float) $matches[2][$key];
            }
        }
        return $tax->arrTaxes;
    }

}
