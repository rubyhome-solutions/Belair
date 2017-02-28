<?php

namespace application\components\Galileo;

class PnrAcquisition implements \application\components\api_interfaces\IpnrAcquisition {

    /**
     * The PNR content
     * @var \SimpleXMLElement
     */
    public $pnrObject = null;
    public $airSourceId = null;
    public $pnrStr = null;

    function __construct(\SimpleXMLElement $obj, $airSourceId) {
        $this->setPnr($obj, $airSourceId);
    }

    function setPnr($obj, $airSourceId) {
        $this->pnrObject = $obj;
        $this->airSourceId = $airSourceId;
        $this->pnrStr = $this->pnrObject->PNRBFRetrieve->GenPNRInfo->RecLoc;
    }

    /**
     * Extract the passengers
     * @return array The array keys should match the Pax number from the PNR<br>
     * Data should have (firstName, lastName, type, title=null, birthDate=null)<br>
     * Possible type values:
     * 1 - adult (ADT)
     * 2 - child (CHD)
     * 3 - infant (INF)
     */
    function getPassengers() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
//        print_r($this->pnrObject);
        $out = [];
        foreach ($this->pnrObject->PNRBFRetrieve->LNameInfo as $element) {
            $row[] = [
                'lastName' => (string) $element->LName,
//                    'nameType' => (string) $element->NameType,
                'type' => (string) $element->NameType === 'I' ? \TravelerType::TRAVELER_INFANT : null,
            ];
        }
        foreach ($this->pnrObject->PNRBFRetrieve->FNameInfo as $element) {
//            $row[] = ['firstName' => (string) $element->FName, 'absNum' => (int) $element->AbsNameNum];
            list($firstName, $title) = self::splitNameAndTitle((string) $element->FName);
            $out[(int) $element->AbsNameNum] = array_merge($row[(int) $element->AbsNameNum - 1], [
                'title' => $title,
                'origFirstName' => (string) $element->FName,
                'firstName' => $firstName
            ]);
        }

        // Process birthdates
        foreach ($this->pnrObject->PNRBFRetrieve->NameRmkInfo as $element) {
//            echo substr($element->NameRmk, 0, 2)."\n";
            if (strlen($element->NameRmk) === 7 &&
                    is_numeric(substr($element->NameRmk, 0, 2)) && // first 2 symbols are the day
                    is_numeric(substr($element->NameRmk, 5, 2)) && // last 2 symbols are the year
                    !is_numeric(substr($element->NameRmk, 2, 3))    // middle 3 symbols are the month
            ) {
                $out[(int) $element->AbsNameNum]['birthDate'] = date(DATE_FORMAT, strtotime($element->NameRmk));
            }
        }

        // Assign childs
        foreach ($this->pnrObject->PNRBFRetrieve->NonProgramaticSSR as $element) {
            if ((string) $element->SSRCode === 'CHLD') {
                $search = substr(strrchr($element->SSRText, '/'), 1);
                foreach ($out as $key => &$passager) {
                    if ($passager['origFirstName'] == $search) {
                        $passager['type'] = \TravelerType::TRAVELER_CHILD;
                    }
                }
            }
        }

        // Assign adults
        foreach ($out as &$passager) {
            if (empty($passager['type'])) {
                $passager['type'] = \TravelerType::TRAVELER_ADULT;
            }
        }


        return $out;
//            echo $row['lastName'] . " ";
    }

    /**
     * Extract the segments
     * @return array $segments The array keys should match the Segment number from the PNR<br>
     * The segments data is described in details in a wiki article
     */
    function getSegments() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        foreach ($this->pnrObject->PNRBFRetrieve->AirSeg as $element) {
            $departDate = Utils::formatDate((string) $element->Dt);
            $arriveDate = date(DATE_FORMAT, strtotime($departDate) + 24 * 3600 * (int) $element->DayChg);
            // Get flight service data
            $request = str_replace(
                    [
                '{airlineCode}',
                '{flightNumber-4alphas}',
                '{departureDateYYYYMMDD}',
                '{origin}',
                '{destination}',
                    ], [
                (string) $element->AirV,
                str_pad((string) $element->FltNum, 4, '0', STR_PAD_LEFT),
                date('Ymd', strtotime($departDate)),
                (string) $element->StartAirp,
                (string) $element->EndAirp,
                    ], self::$templateFlightService);

            $api = new Galileo($this->airSourceId);
            $fsInfo = $api->submitXml($request);
            if (is_string($fsInfo)) {
                return $fsInfo;
            }
//            \Utils::dbgYiiLog($fsInfo);
//            $fsData = is_array($fsInfo->InFltService->InFltLegData)? $fsInfo->InFltService->InFltLegData[0] : $fsInfo->InFltService->InFltLegData;
            $fsData = $fsInfo->InFltService->InFltLegData;
//            print_r($fsData);
            $out[(int) $element->SegNum] = [
                'origin' => (string) $element->StartAirp,
                'destination' => (string) $element->EndAirp,
                'depart' => $departDate,
                'flightNumber' => (string) $element->FltNum,
                'marketingCompany' => (string) $this->pnrObject->DocProdDisplayStoredQuote->PlatingAirVMod->AirV,
                'operatingCompany' => (string) $element->AirV,
                'bookingClass' => (string) $element->BIC,
                'departTs' => $departDate . " " . Utils::formatTime((string) $element->StartTm),
                'arriveTs' => $arriveDate . " " . Utils::formatTime((string) $element->EndTm),
                'departureTerminal' => empty($fsData->StTerm) ? null : (string) $fsData->StTerm,
                'arrivalTerminal' => empty($fsData->EndTerm) ? null : (string) $fsData->EndTerm,
                'aircraft' => empty($fsData->Equip) ? null : (string) $fsData->Equip,
            ];
        }

        return $out;
    }

    /**
     * Combine the segments into journeys. Every 2 or more connected flights create a journey<br>
     * The segment IDs should match the Segment number from the getSegments call<br>
     * Example with 2 journeys with 2 connected flights in the first and 3 in the second journey:<br>
     * $journeys = [<br>
     *    [0] => [1,2],<br>
     *    [1] => [3, 4, 5]<br>
     * ]
     * @return array $journeys 2 dimensional array with structure [journeyID][segmentID]
     */
    function getJourneys() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        $j = 1;
        $landing = '';
        foreach ($this->pnrObject->PNRBFRetrieve->AirSeg as $element) {
            if (!in_array((string) $element->Status, PnrManagement::$okStatuses)) {
                if (YII_DEBUG) {
                    \Yii::log("Wrong status for the AirSegment #" . (int) $element->SegNum . " (" . (string) $element->Status . ")");
                }
                continue;
            }
            $departDate = Utils::formatDate((string) $element->Dt) . " " . Utils::formatTime((string) $element->StartTm);
            if (!empty($landing) && (strtotime($departDate) - strtotime($landing) - 23.5 * 3600 > 0)) {
                $j++;
            }
            $out[$j][] = (int) $element->SegNum;
            $landing = date(DATE_FORMAT, strtotime($departDate) + 24 * 3600 * (int) $element->DayChg) . " " . Utils::formatTime((string) $element->EndTm);
        }
        return $out;
    }

    /**
     * Extract the taxes. Taxes should be grouped in 2 dimensional array with first index passengerID, as received from getPassengers call<br>
     * second index should contain array $arrTaxes with structure defined in Taxes class. We should have one arrTaxes array for each passenger<br>
     * Usually the API will return more type of taxes and you will have to reformat the taxes so they fit arrTaxes structure.<br>
     * Specific reformatting instructions will be provided.<br>
     * @return array [passengerID]=arrTaxes
     */
    function getFares() {
        if ($this->pnrObject === null || !isset($this->pnrObject->DocProdDisplayStoredQuote->GenQuoteDetails)) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        // Prepare amounts
        foreach ($this->pnrObject->DocProdDisplayStoredQuote->GenQuoteDetails as $element) {
            $amounts[] = [
                'baseFare' => (float) $element->EquivAmt == 0 ? (float) $element->BaseFareAmt : (float) $element->EquivAmt,
                'total' => (float) $element->TotAmt,
                'arrTaxes' => self::taxReformat($element->TaxDataAry),
                'privateFare' => (string) $element->QuoteType == 'G' ? false : true
            ];
        }

        // Assign amounts
        $key = 0;
        foreach ($this->pnrObject->DocProdDisplayStoredQuote->AgntEnteredPsgrDescInfo as $element) {
            foreach ($element->ApplesToAry->AppliesTo as $pax) {
                $out[(int) $pax->AbsNameNum] = $amounts[$key];
            }
            $key++;
        }

        return $out;
    }

    /**
     * Get information about the form of payment for the PNR
     * @return string CASH or CC abbreviation
     */
    function getFop() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        // Cash check
        if (isset($this->pnrObject->DocProdDisplayStoredQuote->OtherFOP->Type) &&
                (int) $this->pnrObject->DocProdDisplayStoredQuote->OtherFOP->Type == 2
        ) {
            return "Cash";
        }
        // CC check
        if (isset($this->pnrObject->DocProdDisplayStoredQuote->CreditCardFOP)
        ) {
            return $this->pnrObject->DocProdDisplayStoredQuote->CreditCardFOP->Vnd . "-" .
                    str_replace('00000000000', '***********', (string) $this->pnrObject->DocProdDisplayStoredQuote->CreditCardFOP->Acct) . "-" .
                    $this->pnrObject->DocProdDisplayStoredQuote->CreditCardFOP->ExpDt;
        }
        // No Fop
        return null;
    }

    /**
     * Extract the information about the frequent flyers on per passenger basis
     * @return array [passengerID][ffInfo]
     */
    function getFFs() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        // Prepare amounts
        foreach ($this->pnrObject->PNRBFRetrieve->FreqCustInfo as $element) {
            $out[(string) $element->AbsNameNum][] = [
                'airline' => (string) $element->FreqCustV,
                'code' => (string) $element->FreqCustNum,
            ];
        }
        return $out;
    }

    /**
     * Extract the information about the SSRs on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][ssrCode]=true
     */
    function getSSRs() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        foreach ($this->pnrObject->PNRBFRetrieve->ProgramaticSSR as $element) {
            if ((string) $element->SSRCode != 'INFT' && !in_array((string) $element->SSRCode, self::$arrMeals)
            ) {
                $out[(int) $element->AppliesToAry->AppliesTo->AbsNameNum][(int) $element->SegNum][] = (string) $element->SSRCode;
            }
        }
        return $out;
    }

    /**
     * Extract the information about the endorsments on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][strEndorsment]
     */
    function getEndorsments() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
    }

    /**
     * Extract the information about the seats on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][strSeat]
     */
    function getSeats() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        // Prepare seat numbers
        foreach ($this->pnrObject->PNRBFRetrieve->SeatAssignment as $element) {
            $seats[] = [
                'pax' => (int) $element->AbsNameNum,
                'seat' => ltrim((string) $element->Locn, '0')
            ];
        }

        // Assign seats
        $key = 0;
        foreach ($this->pnrObject->PNRBFRetrieve->SeatSeg as $element) {
            for ($i = 1; $i <= $element->NumPsgrs; $i++) {
                $out[$seats[$key]['pax']][(int) $element->FltSegNum] = $seats[$key]['seat'];
                $key++;
            }
        }

        return $out;
    }

    /**
     * Extract the information about the meals on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][strMeal]
     */
    function getMeals() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        foreach ($this->pnrObject->PNRBFRetrieve->ProgramaticSSR as $element) {
            if (in_array((string) $element->SSRCode, self::$arrMeals)) {
                $out[(int) $element->AppliesToAry->AppliesTo->AbsNameNum][(int) $element->SegNum] = (string) $element->SSRCode;
            }
        }
        return $out;
    }

    /**
     * Extract the information about the airPnrs on per segment basis
     * @return array 3 dimensions [segmentID][strAirPnr]
     */
    function getAirPnrs() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        if (empty($this->pnrObject->PNRBFRetrieve->VndRecLocs)) {
            return [];  // AirPnrs are not assigned yet
        }
        // Prepare all airPnrs
        foreach ($this->pnrObject->PNRBFRetrieve->VndRecLocs->RecLocInfoAry->RecLocInfo as $element) {
            $airPnrs[(string) $element->Vnd] = (string) $element->RecLoc;
        }
        $out = [];
        $segments = $this->getSegments();
        if (is_array($segments)) {
            foreach ($segments as $st => $segment) {
                if (isset($airPnrs[$segment['marketingCompany']])) {
                    $out[$st] = $airPnrs[$segment['marketingCompany']];
                } elseif (isset (self::$vendorLocatorCodes[$segment['marketingCompany']]) && isset($airPnrs[self::$vendorLocatorCodes[$segment['marketingCompany']]])) {
                    $out[$st] = $airPnrs[self::$vendorLocatorCodes[$segment['marketingCompany']]];
                } else {
                    $out[$st] = null;
                }
            }
        }
        return $out;
    }

    /**
     * Extract the information about the tickets on per passenger and per segment basis
     * @return array 3 dimensions [passengerID][segmentID][strTicket]
     */
    function getTickets() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        foreach ($this->pnrObject->PNRBFRetrieve->ProgramaticSSRText as $element) {
            $tickets[] = substr((string) $element->Text, 0, 13);
        }
        $j = 0;
        foreach ($this->pnrObject->PNRBFRetrieve->ProgramaticSSR as $element) {
            if ((string) $element->SSRCode == 'TKNE') { // Ticket indicator
                $out[(int) $element->AppliesToAry->AppliesTo->AbsNameNum][(int) $element->SegNum] = $tickets[$j];
                $j++;
            }
        }
        return $out;
    }

    /**
     * Get the tour code. This is unique string for the PNR
     * @return string|null Tour Code or null
     */
    function getTourCode() {
        if (empty($this->pnrObject->DocProdDisplayStoredQuote->TourCode->Rules)) {
            return null;   // No tour code
        }
        return (string) $this->pnrObject->DocProdDisplayStoredQuote->TourCode->Rules;
    }

    /**
     * Get the private fare. This is unique string for the PNR
     * @return string|null Private Fare or null
     */
    function getPrivateFare() {
        if (empty($this->pnrObject->DocProdDisplayStoredQuote->PFMod->Contract)) {
            return null;   // No private fare
        }
        return (string) $this->pnrObject->DocProdDisplayStoredQuote->PFMod->Contract;
    }

    function getFareBasis() {
        if ($this->pnrObject === null) {
            return false;   // There is no PNR object to work with
        }
        $out = [];
        // Prepare fares
        foreach ($this->pnrObject->DocProdDisplayStoredQuote->SegRelatedInfo as $element) {
            $out[(int) $element->UniqueKey][(int) $element->RelSegNum] = (string) $element->FIC;
        }
        return $out;
    }

    static function test($filename) {
        $test = new PnrAcquisition((simplexml_load_file($filename)), Utils::DEFAULT_GALILEO_PRODUCTION_ID);
        echo "---=== " . substr($filename, -10) . " ====----\n";
        echo "Passengers: " . print_r($test->getPassengers(), true) . "\n";
        echo "Segments: " . print_r($test->getSegments(), true) . "\n";
        $res = $test->getFares();
//        var_dump($res);
        echo "Fares: " . print_r($res, true) . "\n";
        if ($res === false) {
            echo "No fares\n";
        } elseif (self::faresCrossCheck($res)) {
            echo "Fares are OK\n";
        } else {
            echo "Fares Error: " . print_r($res, true) . "\n";
        }
        echo "airPNRs: " . print_r($test->getAirPnrs(), true) . "\n";
        echo "Endorsments: " . print_r($test->getEndorsments(), true) . "\n";
        echo "Ffs: " . print_r($test->getFFs(), true) . "\n";
        echo "Fop: " . print_r($test->getFop(), true) . "\n";
        echo "Journeys " . print_r($test->getJourneys(), true) . "\n";
        echo "Meals: " . print_r($test->getMeals(), true) . "\n";
        echo "Seats: " . print_r($test->getSeats(), true) . "\n";
//        echo "privateFare: " . print_r($test->getPf(), true) . "\n";
        echo "SSRs " . print_r($test->getSSRs(), true) . "\n";
        echo "Tickets: " . print_r($test->getTickets(), true) . "\n";
        echo "tourCode: " . print_r($test->getTourCode(), true) . "\n";
        echo "privateFare: " . print_r($test->getPrivateFare(), true) . "\n";
        echo "fareBasis: " . print_r($test->getFareBasis(), true) . "\n";
        echo "--------------------------------------------------------\n\n";
    }

    static function faresCrossCheck($fares) {
        foreach ($fares as $fare) {
            if ($fare['total'] != ($fare['baseFare'] + array_sum($fare['arrTaxes']))) {
                return false;
            }
        }
        return true;
    }

    static function splitNameAndTitle($firstName) {
        $arrTitles = [
            'MR',
            'MRS',
            'MS',
            'MSS',
            'MISS',
            'MSTR',
            'PROF',
            'DR',
        ];
        foreach ($arrTitles as $title) {
            $tLen = strlen($title);
            if (substr($firstName, -$tLen) === $title) {
                return [substr($firstName, 0, -$tLen), $title];
            }
        }
        return [$firstName, null];
    }

    static $vendorLocatorCodes = [
        'UK' => '1A',
        'FB' => '1A',
        'SB' => '1A',
        '2B' => 'TP',
        '9B' => 'CR',
        'JP' => '1A',
        'OT' => 'QF',
        'VV' => '1A',
        'KC' => '1A',
        'UU' => '1A',
        'BT' => 'SK',
        'AB' => '1A',
        '3E' => '1A',
        'TX' => '1A',
        'CV' => 'NZ',
        'TI' => 'XH',
        'EN' => '1A',
        'UX' => '1A',
        'AF' => '1A',
        '5I' => '51',
        'VU' => '1A',
        'P2' => 'G9',
        'NX' => 'CA',
        'MK' => '1A',
        'TL' => 'QF',
        'FJ' => '1A',
        'V7' => '1A',
        'NF' => '1A',
        'ZW' => 'UA',
        'A5' => '1A',
        'J5' => 'AS',
        'XM' => 'AZ',
        'OR' => '1A',
        'U8' => 'S7',
        'IQ' => '1A',
        'AU' => '1A',
        'OS' => '1A',
        'JA' => '1A',
        'KJ' => 'BA',
        '4T' => '1A',
        'O3' => 'B3',
        'NT' => '1A',
        'KF' => 'SK',
        'E9' => 'PN',
        'FQ' => '1A',
        'DB' => '1A',
        'BA' => '1A',
        'XK' => '1A',
        'MO' => 'XH',
        'CX' => 'CY',
        'M6' => '1A',
        'MU' => 'CA',
        'CZ' => 'CA',
        'QI' => '1A',
        'C9' => '1A',
        'CF' => '1A',
        'WX' => '1A',
        'OH' => 'DL',
        'DE' => '1A',
        'CS' => 'CO',
        'SS' => '1A',
        'OU' => '1A',
        'QE' => 'LX',
        'OK' => '1A',
        'DX' => 'SK',
        '0D' => '1A',
        'B5' => 'J0',
        'DK' => 'QF',
        'WK' => '1A',
        'OV' => '1A',
        'EY' => '1A',
        'GJ' => 'AZ',
        '2D' => 'AZ',
        'AY' => '1A',
        'FC' => 'AY',
        'LF' => 'SK',
        'GT' => '1A',
        'ST' => '1A',
        'DC' => '1A',
        'HR' => '1A',
        'HF' => '1A',
        'YO' => '1A',
        '2L' => '1A',
        'UD' => '1A',
        'HX' => 'CA',
        'UO' => 'CA',
        'C3' => '1A',
        'IB' => '1A',
        'FI' => '1A',
        'IC' => '1C',
        'WP' => 'AQ',
        'IF' => '1A',
        'JC' => 'JL',
        'JO' => 'JL',
        'NU' => 'JL',
        'JU' => '1A',
        '3K' => 'JQ',
        'BL' => 'JQ',
        '3B' => '1A',
        'LO' => '1A',
        'LT' => '1A',
        'N7' => '1A',
        'LA' => '1A',
        '4M' => '1A',
        'XL' => '1A',
        'LP' => '1A',
        'NG' => '1A',
        'LH' => '1A',
        'L7' => 'LE',
        'LG' => '1A',
        'JE' => 'SA',
        'IG' => 'AZ',
        'ME' => '1A',
        'YM' => '1A',
        'I2' => '1A',
        'HG' => '1A',
        'NC' => 'QF',
        'JX' => 'CR',
        'NP' => '1A',
        'DY' => 'SK',
        'OL' => '1A',
        '8P' => 'XH',
        '7V' => 'XH',
        'PH' => '1A',
        'P0' => 'XH',
        'QF' => '1A',
        'QR' => '1A',
        'FN' => '1A',
        'YS' => '1A',
        'FV' => '1A',
        'AT' => '1A',
        'SP' => '1A',
        'S4' => '1A',
        'SC' => 'CA',
        'FM' => 'CA',
        'ZH' => 'CA',
        '3U' => 'CA',
        'MI' => 'SQ',
        'JW' => 'AN',
        'OO' => 'DL',
        'NP' => 'PX',
        'JZ' => 'SK',
        'QS' => '1A',
        'IE' => '1A',
        'JK' => 'SK',
        'EZ' => '1A',
        'XQ' => '1A',
        'CQ' => 'QF',
        'Q4' => 'XH',
        'Q8' => '1A',
        'AX' => 'TW',
        'T9' => 'SK',
        'TU' => '1A',
        'T7' => '1A',
        'VO' => '1A',
        'US' => 'HP',
        '1U' => '7X',
        'VF' => 'JQ',
        'VE' => 'AZ',
        '2W' => '1A',
        'WF' => 'SK',
        'SE' => '1A',
        'MF' => 'CA',
        'YC' => 'XH',
        '3J' => 'AC',
        'BD' => '1A',
        'TE' => '1A',
        'EO' => 'SK',
    ];
    static $arrMeals = [
        'AVML',
        'BBML',
        'BLML',
        'CHML',
        'CKML',
        'DBML',
        'FPML',
        'GFML',
        'HFML',
        'HNML',
        'KSML',
        'LCML',
        'LFML',
        'LPML',
        'LSML',
        'MOML',
        'NLML',
        'OBML',
        'ORML',
        'RFML',
        'RVML',
        'SAML',
        'SFML',
        'SPML',
        'TDML',
        'TFML',
        'VGML',
        'VLML',
    ];
    static $templateFlightService = '
<FlightService_6_0>
  <InFltServiceMods>
    <InFltServiceReq>
      <AirV>{airlineCode} </AirV>
      <FltNum>{flightNumber-4alphas}</FltNum>
      <StartDt>{departureDateYYYYMMDD}</StartDt>
      <StartCity>{origin}  </StartCity>
      <EndCity>{destination}  </EndCity>
      <BIC />
      <CodeShareInd />
    </InFltServiceReq>
  </InFltServiceMods>
</FlightService_6_0>';

    static function taxReformat(\SimpleXMLElement $fares) {
        $tax = new \Taxes;
        foreach ($fares->TaxData as $fare) {
            $taxIndex = in_array((string) $fare->Country, array_keys(Utils::$taxesReformat)) ? Utils::$taxesReformat[(string) $fare->Country] : \Taxes::TAX_OTHER;
            $tax->arrTaxes[$taxIndex] += (float) $fare->Amt;
        }
        return $tax->arrTaxes;
    }

}
