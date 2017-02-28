<?php

namespace application\components\Goair\production;

/**
 * GoAir API
 *
 * @author Boxx
 *
 */
class GoAir {

    const TRAVELER_ADULT = 1;
    const TRAVELER_INFANT = 5;
    const TRAVELER_CHILD = 6;

    static $passengerTypes = [
        self::TRAVELER_ADULT => 'Adult',
        self::TRAVELER_INFANT => 'Infant',
        self::TRAVELER_CHILD => 'Child',
    ];
    static $taxesReformat = [
        362 => 'YQ',
        1353 => 'YQ',
        323 => 'YQ',
        326 => 'YQ',
        327 => 'YQ',
        3724 => 'YQ',
        2542 => 'YQ',
        1922 => 'JN',
        2061 => 'JN',
        2002 => 'JN',
        2042 => 'JN',
        2801 => 'UDF',
        2803 => 'UDF',
        841 => 'UDF',
        2806 => 'UDF',
        1482 => 'UDF',
        2363 => 'PSF',
        741 => 'PSF',
        2821 => 'PSF',
        1481 => 'PSF',
        2822 => 'Other',
        2823 => 'Other',
        1221 => 'Other',
    ];
    static $taxCodes = [
        'FUEL' => 'YQ',
        'PHF' => 'Other',
        'ADF' => 'Other',
        'ST' => 'JN',
        'PSF' => 'PSF',
        'UDF' => 'UDF',
        'ST1' => 'JN',
        'ST2' => 'JN',
    ];
    static $cabinTypes = [
        \CabinType::ECONOMY => 'ECONOMY',
        \CabinType::PREMIUM_ECONOMY => 'ECONOMY',
        \CabinType::BUSINESS => 'BUSINESS',
        \CabinType::FIRST => 'BUSINESS',
    ];
    private $credentials;
    private $_token;
    private $tokenTimestamp;

    function __construct($id) {
        $this->_token = false;
        $this->tokenTimestamp = false;
        $model = \AirSource::model()->findByPk($id);
        /* @var $model AirSource */
        if (!$model) {
            \Utils::finalMessage("AirSource DB record not found. Wrong ID: {$id}\n");
        }
        $this->credentials['login'] = $model->username;
        $this->credentials['password'] = $model->password;
        if (empty($this->credentials['login']) || empty($this->credentials['password'])) {
            \Utils::finalMessage("API Credentials not found. Check Air Source with ID: {$id}\n");
        }
        $this->credentials['TANumber'] = $model->profile_pcc;
        $this->credentials['tranPassword'] = $model->tran_password;
        $this->credentials['tranUsername'] = $model->tran_username;
        if (empty($this->credentials['TANumber']) ||
                empty($this->credentials['tranPassword']) ||
                empty($this->credentials['tranUsername'])
        ) {
            \Utils::finalMessage("Transactions Credentials not found. Check Air Source with ID: {$id}\n");
        }
    }

    public function getToken() {
//        if ($this->_token !== false && $this->tokenTimestamp > (time() - 28 * 60)) {
//            return $this->_token;    // Do not aquire new token if old one is present
//        }
        $res = \Utils::curl('http://g8.service.radixx.com/RadixxSecurity.asmx/GetSecurityGUID', http_build_query([
                    'LogonID' => $this->credentials['login'],
                    'Password' => $this->credentials['password'],
                        ])
        );
        if ($res['result'] === false || !empty($res['error'])) {
            \Yii::log(['Goair getToken error' => $res['error']]);    // Log the error
            return false;
        } else {
            libxml_use_internal_errors(true);
            $out = simplexml_load_string($res['result']);
            if ($out === false) {
                \Utils::dbgYiiLog([
                    'errors' => libxml_get_errors(),
                    'content raw' => $res['result'],
//                    'content cleared' => self::clearXml($res),
                ]);
            }
            $this->_token = (string) $out;
            $this->tokenTimestamp = time();
            return $this->_token;
        }
    }

    public function getOriginAirports() {
        $this->getToken();
        $res = \Utils::curl('http://g8.service.radixx.com/RadixxAirports.asmx/GetOriginAirportsXML', http_build_query([
                    'SecurityGUID' => $this->_token,
                    'CarrierCode' => 'G8',
                        ])
        );
        if ($res['result'] === false) {
            \Yii::log($res['error']);    // Log the error
            return false;
        } else {
//            file_put_contents('g8_origin_airports.xml', html_entity_decode($res['result']));
            preg_match_all('#<AirportCode>(...)#', html_entity_decode($res['result']), $matches);
            return array_unique($matches[1]);
        }
    }

    public function getDestinationAirports($srcAirportCode) {
        $this->getToken();
        $res = \Utils::curl('http://g8.service.radixx.com/RadixxAirports.asmx/GetDestinationAirportsXML', http_build_query([
                    'SecurityGUID' => $this->_token,
                    'AirportCode' => $srcAirportCode,
                    'CarrierCode' => 'G8',
                        ])
        );
        if ($res['result'] === false) {
            \Yii::log($res['error']);    // Log the error
            return false;
        } else {
            preg_match_all('#<AirportCode>(...)#', html_entity_decode($res['result']), $matches);
            return array_unique($matches[1]);
        }
    }

    public function loginTravelAgencyUser() {
        if ($this->getToken() === false) {
            return false;
        }

        $res = \Utils::curl('http://g8.service.radixx.com/RadixxTravelAgents.asmx/LoginTravelAgencyUser', http_build_query([
                    'SecurityGUID' => $this->_token,
                    'TANumber' => $this->credentials['TANumber'],
                    'Username' => $this->credentials['tranUsername'],
                    'Password' => $this->credentials['tranPassword'],
                        ])
        );

        if ($res['result'] === false || strstr($res['result'], 'SoapException')) {
            //  \Utils::dbgYiiLog($res);    // Log the error
            return false;
        } else {
            if ((string) simplexml_load_string($res['result']) == 'true') {
                return true;
            } else {
                // \Utils::dbgYiiLog(__METHOD__ . " Error: " . $res['result']);    // Log the result as error
                return false;
            }
        }
    }

    /**
     * Get the availability and best fair quotes
     * @param string $source Origination Airport
     * @param string $destination Destination Airport
     * @param string $departure_date Date of departure
     * @param array $travelers Array with traveler type as key and number of the seats as value
     * @param int $cabin Cabin type ID according to CabinType class
     * @param string $back_date Return date
     * @return mixed false or SimpleXmlObject
     */
    public function search($source, $destination, $departure_date, $travelers = [self::TRAVELER_ADULT => 1], $cabin = CabinType::ECONOMY, $back_date = null) {
        if ($this->loginTravelAgencyUser() === false) {
            return false;
        }
        $cabin = self::$cabinTypes[$cabin];
//        $departure_date = str_replace('-', '', $departure_date);
        $fqri = '';
        // Travelers preparation
        foreach ($travelers as $travelerType => $seats) {
            if (!empty($seats)) {
                $fqri .= "
                <FareQuoteRequestInfo>
                    <PassengerTypeID>{$travelerType}</PassengerTypeID>
                    <TotalSeatsRequired>{$seats}</TotalSeatsRequired>
                </FareQuoteRequestInfo>";
            }
        }
        $returnTrip = '';
        // Round trip case
        if ($back_date !== null) {
            $returnTrip = "
                <FareQuoteDetail>
                    <Origin>{$destination}</Origin>
                    <Destination>{$source}</Destination>
                    <DateOfDeparture>{$back_date}</DateOfDeparture>
                    <FareTypeCategory>1</FareTypeCategory>
                    <Cabin>$cabin</Cabin>
                    <NumberOfDaysBefore>0</NumberOfDaysBefore>
                    <NumberOfDaysAfter>0</NumberOfDaysAfter>
                    <LanguageCode/>
                    <FareFilterMethod>102</FareFilterMethod>
                    <FareQuoteRequestInfos>$fqri
                    </FareQuoteRequestInfos>
                </FareQuoteDetail>";
        }
        $strXml = "
<RadixxFareQuoteRequest xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">
    <CurrencyOfFareQuote>INR</CurrencyOfFareQuote>
    <PromotionalCode/>
    <IataNumberOfRequestor>{$this->credentials['TANumber']}</IataNumberOfRequestor>
    <FareQuoteDetails>
        <FareQuoteDetail>
            <Origin>{$source}</Origin>
            <Destination>{$destination}</Destination>
            <DateOfDeparture>{$departure_date}</DateOfDeparture>
            <FareTypeCategory>1</FareTypeCategory>
            <Cabin>$cabin</Cabin>
            <NumberOfDaysBefore>0</NumberOfDaysBefore>
            <NumberOfDaysAfter>0</NumberOfDaysAfter>
            <LanguageCode/>
            <FareFilterMethod>102</FareFilterMethod>
            <FareQuoteRequestInfos>$fqri
            </FareQuoteRequestInfos>
        </FareQuoteDetail>$returnTrip
    </FareQuoteDetails>
</RadixxFareQuoteRequest>
";
//        file_put_contents('G8_request.xml', $strXml);
        $res = \Utils::curl('http://g8.service.radixx.com/RadixxFlights.asmx/GetFareQuote', http_build_query([
                    'SecurityGUID' => $this->_token,
                    'RadixxFareQuoteRequest' => $strXml,
                    'p_ClientIP' => ''
                        ])
        );

        if ($res['result'] === false ||
                substr($res['result'], 0, 20) === 'System.Web.Services.') {
//            \Utils::dbgYiiLog($res['error']);    // Log the error
//            \Utils::dbgYiiLog([     // Log the input params
//                'SecurityGUID' => $this->_token,
//                'RadixxFareQuoteRequest' => $strXml,
//                'p_ClientIP' => '128.199.218.209'
//            ]);
//            \Utils::dbgYiiLog(html_entity_decode($res['result']));    // Log the result
            return false;
        } else {
            return simplexml_load_string(html_entity_decode((string) simplexml_load_string($res['result'])));
        }
    }

    /**
     * Construc array with taxID as key and tax description as value
     * @param array $arr The returned data as array from GetFareQuote API call
     * @return array Parsed taxes
     */
    static function parseTaxes($arr) {
        $out = array();
        if (isset($arr['TaxDetails']['Tax'])) {
            foreach ($arr['TaxDetails']['Tax'] as $fare) {
                if (isset($fare['@attributes']))
                    $out[$fare['@attributes']['TaxID']] = $fare['@attributes'];
            }
        }
        return $out;
    }

    static function parseLegs($arr) {
        $out = array();
        if (isset($arr['LegDetails']['Leg'])) {
            foreach ($arr['LegDetails']['Leg'] as $leg) {
                if (!isset($leg['@attributes'])) {
                    // \Utils::dbgYiiLog($arr);
                    continue;
                }
                $out[$leg['@attributes']['PFID']] = $leg['@attributes'];
                // Remove the duplicating PFID info
                unset($out[$leg['@attributes']['PFID']]['PFID']);
                // Reformat the timestamps
                $out[$leg['@attributes']['PFID']]['DepartureDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['DepartureDate']));
                $out[$leg['@attributes']['PFID']]['ArrivalDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['ArrivalDate']));
            }
        } else if (isset($arr['LegDetails'][0])) {

            $leg = $arr['LegDetails'][0];
            $out[$leg['@attributes']['PFID']] = $leg['@attributes'];
            // Remove the duplicating PFID info
            unset($out[$leg['@attributes']['PFID']]['PFID']);
            // Reformat the timestamps
            $out[$leg['@attributes']['PFID']]['DepartureDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['DepartureDate']));
            $out[$leg['@attributes']['PFID']]['ArrivalDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['ArrivalDate']));
        }

        return $out;
    }

    static function parseSegments($arr) {
        $taxInfo = self::parseTaxes($arr);
        $out = array();
        // Stop the parsing and return empty array if there are no segments
        if (!isset($arr['SegmentDetails'])) {
            return $out;
        }
        if (isset($arr['SegmentDetails']['Segment'])) {
            $segments = $arr['SegmentDetails']['Segment'];
        } else {
            $segments = $arr['SegmentDetails'];
        }
        foreach ($segments as $segment) {
            if (!isset($segment['@attributes'])) {
                //  \Utils::dbgYiiLog($arr);
                continue;
            }
            $out[$segment['@attributes']['LFID']] = $segment['@attributes'];
            // Remove the duplicating LFID info
            unset($out[$segment['@attributes']['LFID']]['LFID']);
            // Reformat the timestamps
            $out[$segment['@attributes']['LFID']]['DepartureDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$segment['@attributes']['LFID']]['DepartureDate']));
            $out[$segment['@attributes']['LFID']]['ArrivalDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$segment['@attributes']['LFID']]['ArrivalDate']));
        }

        if (isset($arr['FlightSegmentDetails']['FlightSegment'][0])) {
            $segments = $arr['FlightSegmentDetails']['FlightSegment'];
        } else {
            $segments = $arr['FlightSegmentDetails'];
        }

        // Assign Legs to segments
        foreach ($segments as $segment) {
            if (!isset($segment['@attributes'])) {
                continue;
            }
            $lfid = $segment['@attributes']['LFID'];
            // Pare Legs
            foreach ($segment['FlightLegDetails'] as $fligth) {
                if (isset($fligth['@attributes'])) {
                    $out[$lfid]['legs'][] = $fligth['@attributes']['PFID'];
                } else {
                    foreach ($fligth as $fligthLeg) {
                        $out[$lfid]['legs'][] = $fligthLeg['@attributes']['PFID'];
                    }
                }
            }
            // Parse fare taxes
//\Utils::dbgYiiLog($segment);

            if (isset($segment['FareTypes']['FareType'][0]['FareInfos'])) { //if more than one fare type (select the cheapest one)
                $tempout = null;
                $firstRound = true;
                unset($tempout);
                foreach ($segment['FareTypes']['FareType'] as $faretypes) {
                    $fareinfos = $faretypes['FareInfos']['FareInfo'];

                    if (isset($fareinfos[0])) { //more than one fare info
                        foreach ($fareinfos as $fares) {
//                            \Utils::dbgYiiLog($fares);
                            $ptcid = $fares['@attributes']['PTCID'];
                            if (!$firstRound) {
                                if ($out[$lfid]['passengers'][$ptcid]['taxSummary']['BaseFareAmtInclTax'] <= $fares['@attributes']['BaseFareAmtInclTax']) {
                                    break;
                                }
                            }
                            unset($out[$lfid]['passengers'][$ptcid]['taxes']);
                            $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                            if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                                foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                                    if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                        $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                                    } else {

                                        if (isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                            $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                        else
                                            $reformat = 'Other';
                                    }
                                    if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                        $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                                    } else {
                                        $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                                    }
                                }
                            } else if (isset($fares['ApplicableTaxDetails']['ApplicableTax']['@attributes'])) {//only one tax
                                if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                                    $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                                } else {
                                    if (isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                        $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                                    else
                                        $reformat = 'Other';
                                }
                                if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                                } else {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                                }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            }
                        }
                        $firstRound = false;
                    } else if (isset($fareinfos['@attributes'])) { //only one fare info
                        $fares = $fareinfos;
//                    \Utils::dbgYiiLog($fares);
                        $ptcid = $fares['@attributes']['PTCID'];
                        if (!$firstRound) {
                            if ((float) $out[$lfid]['passengers'][$ptcid]['taxSummary']['BaseFareAmtInclTax'] <= (float) $fares['@attributes']['BaseFareAmtInclTax']) {
                                break;
                            }
                        }
                        unset($out[$lfid]['passengers'][$ptcid]['taxes']);
                        $firstRound = false;
                        $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                        if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                            foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                                if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                    $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                                } else {
                                    if (isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                        $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                    else
                                        $reformat = 'Other';
                                }
                                if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                                } else {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                                }
                            }
                        } else {//only one tax
                            if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                                $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                            } else if (isset($fares['ApplicableTaxDetails']['ApplicableTax']['@attributes'])) {
                                if (isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                    $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                                else
                                    $reformat = 'Other';
                            }
                            if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            } else if (isset($fares['ApplicableTaxDetails']['ApplicableTax']['@attributes'])) {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        }
                    }
                }
            } else { //only one fare type
                $fareinfos = $segment['FareTypes']['FareType']['FareInfos']['FareInfo'];

                if (isset($fareinfos[0])) { //more than one fare info
                    foreach ($fareinfos as $fares) {
//                    \Utils::dbgYiiLog($fares);
                        if (!isset($fares['@attributes'])) {
                            continue;
                        }
                        $ptcid = $fares['@attributes']['PTCID'];
                        $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                        if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                            foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                                if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                    $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                                } else if (isset($tax['@attributes'])) {
                                    if (isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                        $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                    else
                                        $reformat = 'Other';
                                }
                                if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                                } else if (isset($tax['@attributes'])) {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                                }
                            }
                        } else if (isset($fares['ApplicableTaxDetails']['ApplicableTax']['@attributes'])) {//only one tax
                            if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                                $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                            } else {
                                if (isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                    $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                                else
                                    $reformat = 'Other';
                            }
                            if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            } else {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        }
                    }
                } else if (isset($fareinfos['@attributes'])) { //only one fare info
                    $fares = $fareinfos;
//                    \Utils::dbgYiiLog($fares);
                    $ptcid = $fares['@attributes']['PTCID'];
                    $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                    if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                        foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                            if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                            } else {
                                if (isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                    $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                else
                                    $reformat = 'Other';
                            }
                            if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                            } else {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                            }
                        }
                    } else if (isset($fares['ApplicableTaxDetails']['ApplicableTax']['@attributes'])) {//only one tax
                        if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                            $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                        } else {
                            if (isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                            else
                                $reformat = 'Other';
                        }
                        if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                            $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        } else {
                            $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                    }
                }
            }
        }
        return $out;
    }

}

?>