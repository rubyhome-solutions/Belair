<?php

namespace application\components\Galileo;

/**
 * Galileo XML definitions
 */
class PnrManagement implements \application\components\api_interfaces\IpnrManagement {

    private $fop = false;   // Book or hold indicator. Default hold, turn to true when FoP is added
    private $faresTotal = 0;
    private $psgrNum = 0;
    private $totalSeats = 0;
    private $psgrAryContent = '';
    private $airSegSellList = '';
    private $paxNameItems = '';
    private $secondaryBldChgModsItems = '';
    private $paxTypesAndCount = [];
    private $ffData = [];
    private $notes = [];
    private $queueToPcc = null;
    private $queueToAirSourceId = null;
    private $queueNum = 1;
    private $strPnr = null;
    private $mobile = null;
    private $privateFare = null;
    private $tourCode = null;

    /**
     * Galileo API handler
     * @var Galileo $api
     */
    private $api = null;

    /**
     *  @var \SimpleXMLElement $pnrResponseObj
     */
    public $pnrResponseObj = null;

    /**
     * The content of the prepared XML request
     * @var string
     */
    public $content = '';
    static $okStatuses = [
        'AK',
        'GK',
        'HS',
        'HK',
        'KK',
        'TK',
    ];
    static $templateTicketPrinterDisplay = '
<TicketPrinterLinkage_1_0>
    <LinkageDisplayMods></LinkageDisplayMods>
</TicketPrinterLinkage_1_0>';
    static $templateTicketPrinterDeLink = '
<TicketPrinterLinkage_1_0>
    <LinkageUpdateMods>
        <DelinkModifier/>
    </LinkageUpdateMods>
</TicketPrinterLinkage_1_0>';
    static $templateTicketPrinterLinkage = '
<TicketPrinterLinkage_1_0>
    <LinkageUpdateMods>
        <PrinterParameters>
            <LNIATA>{ticketPrinter}</LNIATA>
            <Type>T</Type>
        </PrinterParameters>
    </LinkageUpdateMods>
</TicketPrinterLinkage_1_0>';
    static $templateDocProdFareManipulation = '
<DocProdFareManipulation_14>
   <TicketingMods>
      <ElectronicTicketFailed>
         <CancelInd>Y</CancelInd>
         <IssuePaperTkInd></IssuePaperTkInd>
         <IssuePaperTkToSTP></IssuePaperTkToSTP>
         <STPlocation></STPlocation>
      </ElectronicTicketFailed>
      <FareNumInfo>
         <FareNumAry>
            <FareNum>1</FareNum>
         </FareNumAry>
      </FareNumInfo>
      <TicketingControl>
         <TransType>TK</TransType>
      </TicketingControl>
   </TicketingMods>
</DocProdFareManipulation_14>';
    static $templatePNRBFPrimaryBldChgMods = '
<PNRBFPrimaryBldChgMods>
<ItemAry>{items}
</ItemAry>
</PNRBFPrimaryBldChgMods>';
    static $templatePNRBFSecondaryBldChgMods = '
<PNRBFSecondaryBldChgMods>
    <ItemAry>{items}
    </ItemAry>
</PNRBFSecondaryBldChgMods>';
    static $templateAirSegSellMods = '
<AirSegSellMods>{content}
</AirSegSellMods>';
    static $templatePsgr = '
<Psgr>
    <LNameNum>{PsgrNum}</LNameNum>
    <PsgrNum>{PsgrNum}</PsgrNum>
    <AbsNameNum>{PsgrNum}</AbsNameNum>
    <PIC>{PsgrType}</PIC>
    <TIC />
</Psgr>';
    static $templatePNRBFManagement_32 = '
<PNRBFManagement_32>{content}
</PNRBFManagement_32>';
    static $templateStorePriceMods = '
<StorePriceMods>
    <PsgrMods>
        <PsgrAry>{psgrAryContent}
        </PsgrAry>
    </PsgrMods>
    {tourCode}
    {privateFare}
</StorePriceMods>';
    static $templateAirSegSell = '
<AirSegSell>
    <Vnd>{airlineCode} </Vnd>
    <FltNum>{flightNumber-4alphas}</FltNum>
    <OpSuf/>
    <Class>{bookingClass}</Class>
    <StartDt>{departureDateYYYYMMDD}</StartDt>
    <StartAirp>{origin}  </StartAirp>
    <EndAirp>{destination}  </EndAirp>
    <Status>NN</Status>
    <NumPsgrs>0{totalSeats}</NumPsgrs>
    <StartTm>0600</StartTm>
    <EndTm>0815</EndTm>
    <DtChg>0{daysOfTravel}</DtChg>
    <StopoverIgnoreInd/>
    <AvailDispType>G</AvailDispType>
    <VSpec/>
    <AvailJrnyNum>{segmentNumber}</AvailJrnyNum>
    <SponsoredFltLineNum/>
    <NeutralFltLineNum>00</NeutralFltLineNum>
    <SponsoredFltDBID/>
</AirSegSell>';
//    static $addressItem = '
//<Item>
//    <DataBlkInd>W</DataBlkInd>
//    <AddrQual>
//        <EditTypeInd>A</EditTypeInd>
//        <AddChgAddr>
//            <Addr>{address}</Addr>
//        </AddChgAddr>
//    </AddrQual>
//</Item>';
    static $templatePhoneItem = "
<Item>
    <DataBlkInd>P</DataBlkInd>
    <PhoneQual>
        <EditTypeInd>A</EditTypeInd>
        <AddPhoneQual>
            <City>DEL</City>
            <Type>A</Type>
            <PhoneNumber>{mobile}</PhoneNumber>
        </AddPhoneQual>
    </PhoneQual>
</Item>";
    static $fopCashItem = '
<Item>
    <DataBlkInd>F </DataBlkInd>
    <FOPQual>
        <EditTypeInd>A</EditTypeInd>
        <AddChgQual>
            <TypeInd>1</TypeInd>
            <VarLenQual>
                <FOP>S</FOP>
            </VarLenQual>
        </AddChgQual>
    </FOPQual>
</Item>';
    static $fopCcItem = '
<Item>
    <DataBlkInd>F </DataBlkInd>
    <FOPQual>
        <EditTypeInd>A</EditTypeInd>
        <AddChgQual>
            <TypeInd>2</TypeInd>
            <CCQual>
                <CC>{ccTypeCode}</CC>
                <ExpDt>{expiryDateMMYY}</ExpDt>
                <ExtTxt />
                <Acct>{ccNumber}</Acct>
            </CCQual>
        </AddChgQual>
    </FOPQual>
</Item>';
    static $endTransactionMods = '
<EndTransactionMods>
    <EndTransactRequest>
        <ETInd>R</ETInd>
        <RcvdFrom>BELAIR</RcvdFrom>
    </EndTransactRequest>
</EndTransactionMods>';
    static $endTransactionModsWithQueue = '
<EndTransactionMods>
    <EndTransactRequest>
        <ETInd>Q</ETInd>
        <RcvdFrom>BELAIR</RcvdFrom>
    </EndTransactRequest>
    <GlobalAccessInfo>
        <GlobAccessCRSAry>
            <GlobAccessCRS>
                <CRS>1G</CRS>
                <PCC>{PCC}</PCC>
                <QNum>{QNum}</QNum>
                <QCat/>
                <DtRange/>
            </GlobAccessCRS>
        </GlobAccessCRSAry>
    </GlobalAccessInfo>
</EndTransactionMods>';
    static $ticketItem = "
<Item>
    <DataBlkInd>T</DataBlkInd>
    <TkQual>
        <Tk>T/</Tk>
    </TkQual>
</Item>";
    static $endItem = "
<Item>
    <DataBlkInd>E</DataBlkInd>
    <EndMarkQual>
        <EndMark>E</EndMark>
    </EndMarkQual>
</Item>";
    static $secondaryModsEndItem = "
<Item>
    <DataBlkInd>E</DataBlkInd>
    <EndQual>
        <EndMark>E</EndMark>
    </EndQual>
</Item>";
    static $frequentFlyerItem = '
<Item>
    <DataBlkInd>M</DataBlkInd>
    <FreqCustQual>
        <EditTypeInd>A</EditTypeInd>
        <AddQual>
            <LNameID>{PsgrNum}</LNameID>
            <PsgrNum>{PsgrNum}</PsgrNum>
            <AbsNameNum>{PsgrNum}</AbsNameNum>
            <FreqCustNum>{ffCode}</FreqCustNum>
        </AddQual>
    </FreqCustQual>
</Item>';
    static $nameItem = "
<Item>
    <DataBlkInd>N</DataBlkInd>
    <NameQual>
        <EditTypeInd>A</EditTypeInd>
        <EditTypeIndAppliesTo/>
        <AddChgNameRmkQual>
            <NameType>{NameType}</NameType>
            <LNameID>{PsgrNum}</LNameID>
            <LName>{last_name}</LName>
            <LNameRmk/>
            <NameTypeQual>
                <FNameAry>
                    <FNameItem>
                        <PsgrNum>{PsgrNum}</PsgrNum>
                        <AbsNameNum>{PsgrNum}</AbsNameNum>
                        <FName>{first_name}</FName>
                        <FNameRmk>{FNameRmk}</FNameRmk>
                    </FNameItem>
                </FNameAry>
            </NameTypeQual>
        </AddChgNameRmkQual>
    </NameQual>
</Item>";
    static $templateSsrItem = '
<Item>
    <DataBlkInd>S</DataBlkInd>
    <SSRQual>
        <EditTypeInd>A</EditTypeInd>
        <AddQual>
            <SSRCode>{SSRCode}</SSRCode>
            <LNameNum>{PsgrNum}</LNameNum>
            <PsgrNum>{PsgrNum}</PsgrNum>
            <AbsNameNum>{PsgrNum}</AbsNameNum>
            <Text/>
        </AddQual>
    </SSRQual>
</Item>';

    /**
     * Generate name item for passenger for use with PNRBFManagement_32 transaction
     * @param string $firstName First name
     * @param string $lastName Last name
     * @param int $psgrType Passenger type (1=ADT|2=CNN|3=INF)
     * @param string $birthDate The Infant's DOB Leave empty when passenger is not infant
     * @return string The <Item> XML element
     */
    function getNameItem($firstName, $lastName, $psgrType = \TravelerType::TRAVELER_ADULT, $title = '', $birthDate = '') {
        $this->psgrNum++;

        // Strip title of symbols
        $title = str_replace([',', '.'], '', $title);
        // The number has to have leading zero
        if ($this->psgrNum < 10) {
            $strPsgrNum = '0' . $this->psgrNum;
        } else {
            $strPsgrNum = (string) $this->psgrNum;
        }

        // Set I for infants or blank for general usage
        if (!empty($birthDate) && $psgrType === \TravelerType::TRAVELER_INFANT) {
            $nameType = 'I';
            // Date format must be DDMMMYY
            $birthDate = date('dMy', strtotime($birthDate));
        } else {
            $nameType = '';
            $this->totalSeats++;    // Increase the seats needed
            $birthDate = '';
        }

        // Special FNameRmk for children $birthDate become age indicator
        if ($psgrType === \TravelerType::TRAVELER_CHILD) {
            if (empty($birthDate)) {    // Set 10 years old in case we don't know the kid age
                $birthDate = 'P-C10';
                $psgrType = 'C10';
            } else {
                $age = date_diff(date_create($birthDate), date_create('now'))->y;
                $birthDate = 'P-C' . str_pad($age, 2, '0', STR_PAD_LEFT);
                $psgrType = 'C' . str_pad($age, 2, '0', STR_PAD_LEFT);
            }
        } else {    // Conver the int $psgrType to string that Galileo understands
            $psgrType = Utils::$paxIdToTypeMap[$psgrType];
        }

        // Prepare local psgrAryContent used in StorePriceMods
        $this->psgrAryContent .= str_replace([
            '{PsgrNum}',
            '{PsgrType}',
                ], [
            $strPsgrNum,
            $psgrType . "   "     // Fill with blanks to fill 6 chars field
                ], self::$templatePsgr);

        $this->paxNameItems .= str_replace([
            '{first_name}',
            '{last_name}',
            '{PsgrNum}',
            '{NameType}',
            '{FNameRmk}',
                ], [
            strtoupper($firstName . $title),
            strtoupper($lastName),
            $strPsgrNum,
            $nameType,
            strtoupper($birthDate),
                ], self::$nameItem);
    }

    function checkPNRBFPrimaryBldChgMods() {
        if (empty($this->pnrResponseObj->PNRBFPrimaryBldChg)) {
            return true;        // Empty here means it's OK
        } elseif (!empty($this->pnrResponseObj->PNRBFPrimaryBldChg->Text)) {
            return (string) $this->pnrResponseObj->PNRBFPrimaryBldChg->Text;     // Return the error
        } else {
            \Utils::dbgYiiLog($this->pnrResponseObj);
            return "Wrong PNRBFPrimaryBldChgMods response - check the logs";   // Something is wrong, but there is no error text to show
        }
    }

    function checkPNRBFSecondaryBldChgMods() {
        if (empty($this->pnrResponseObj->PNRBFSecondaryBldChg)) {
            return true;        // Empty here means it's OK
        } elseif (!empty($this->pnrResponseObj->PNRBFSecondaryBldChg->Text)) {
            \Utils::dbgYiiLog($this->pnrResponseObj);
            return (string) $this->pnrResponseObj->PNRBFSecondaryBldChg->Text;     // Return the error
        } else {
            \Utils::dbgYiiLog($this->pnrResponseObj);
            return "Wrong PNRBFSecondaryBldChgMods response - check the logs";   // Something is wrong, but there is no error text to show
        }
    }

    function checkEndTransaction() {
        if (is_string($this->pnrResponseObj)) {
            return $this->pnrResponseObj;   // String means error here
        }
        if (empty($this->pnrResponseObj->EndTransaction->ErrorCode)) {
            return true;    // No errors
        }
        if ((string) $this->pnrResponseObj->EndTransaction->EndTransactResponse->ErrSeverityInd == 'W') {   // Means warrning
            return 'W';        // It's just a warrning - ignore and continue
        } elseif (!empty($this->pnrResponseObj->EndTransaction->EndTransactMessage->Text)) {
            return (string) $this->pnrResponseObj->EndTransaction->EndTransactMessage->Text;     // Return the error
        } else {
            \Utils::dbgYiiLog($this->pnrResponseObj->EndTransaction);
            return "Wrong EndTransaction response - check the logs";   // Something is wrong, but there is no error text to show
        }
    }

    private function addPaxTypeCount($type) {
        if (isset($this->paxTypesAndCount[$type])) {
            $this->paxTypesAndCount[$type] ++;
        } else {
            $this->paxTypesAndCount[$type] = 1;
        }
    }

    function addPassengers(array $passengers) {
        // Paxes
        foreach ($passengers as $passenger) {
            $infantDob = empty($passenger['birthDate']) ? '' : $passenger['birthDate'];
            $this->getNameItem($passenger['firstName'], $passenger['lastName'], $passenger['type'], $passenger['title'], $infantDob);

            // Store the pax types and count in the order of appearance - this way we can check the fares
            $this->addPaxTypeCount($passenger['type']);

            // Calculate the total fares amount
            $this->faresTotal += $passenger['amount'];

            /**
             * List of Frequent Flyer Numbers (delimited by '*' )
             * Maximum of 10 freq flyer numbers can be supplied in this field.
             * A freq flyer number is always formatted with vendor code appearing first, followed by the freq flyer account number.
             * The maximum length of each freq flyer number (vendor code plus account number) is 25.
             * Examples: Single FF# = UA123456 , Multi FF # = UA123456*AA7654NT6*BA9999999
             */
            // Store the FF items if any
            if (!empty($passenger['ff']) && is_array($passenger['ff'])) {
                $this->paxNameItems .= str_replace(
                        [
                    '{PsgrNum}',
                    '{ffCode}',
                        ], [
                    str_pad($this->psgrNum, 2, '0', STR_PAD_LEFT),
                    implode('*', $passenger['ff'])
                        ], self::$frequentFlyerItem);
            }

            // Store the SSR items if any
            if (!empty($passenger['SSRs']) && is_array($passenger['SSRs'])) {
                foreach ($passenger['SSRs'] as $ssr) {
                    $this->addSsrItem($this->psgrNum, $ssr);
                }
            }

            // Set the mobile if any pax have it
            if (!empty($passenger['mobile'])) {
                $this->mobile = $passenger['mobile'];
            } else {
                $details = new \ActiveUserDetails;
                if (!empty($details->phone)) {
                    $this->mobile = $details->phone;
                } else {
                    $this->mobile = \Utils::BELAIR_PHONE;
                }
            }
        }
        // Phone
        $content = $this->paxNameItems . str_replace('{mobile}', $this->mobile, self::$templatePhoneItem);
        // Ticket
        $content .= self::$ticketItem;
        // End
        $content .= self::$endItem;
        // Store the content
        $this->content .= str_replace('{items}', $content, self::$templatePNRBFPrimaryBldChgMods);
    }

    function finalTransactionWrap() {
        $this->content = str_replace('{content}', $this->content, self::$templatePNRBFManagement_32);
    }

    function addCashFop() {
        $this->secondaryBldChgModsItems .= self::$fopCashItem;
        $this->fop = true;
    }

    function addCcFop($ccTypeCode, $expiryDate, $ccNumber) {
        $this->secondaryBldChgModsItems .= str_replace(
                [
            '{ccTypeCode}',
            '{expiryDateMMYY}',
            '{ccNumber}',
                ], [
            $ccTypeCode,
            $expiryDate,
            $ccNumber
                ], self::$fopCcItem);

        $this->fop = true;
    }

    function addSsrItem($psgrNum, $ssrCode) {
        $this->secondaryBldChgModsItems .= str_replace(
                [
            '{SSRCode}',
            '{PsgrNum}',
                ], [
            $ssrCode,
            str_pad($psgrNum, 2, '0', STR_PAD_LEFT),
                ], self::$templateSsrItem);
    }

    function addPNRBFSecondaryBldChgMods() {
        $this->secondaryBldChgModsItems .= self::$secondaryModsEndItem;
        $this->content .= str_replace('{items}', $this->secondaryBldChgModsItems, self::$templatePNRBFSecondaryBldChgMods);
    }

    function addStorePriceMods() {
        // Tour code
        if ($this->tourCode) {
            $tourCode = "<TourCode><Rules>$this->tourCode</Rules></TourCode>";
        } else {
            $tourCode = '';
        }
        
        // Private fare
        if ($this->privateFare) {
            $privateFare = "
<PFMod>
    <Acct>{$this->api->username}</Acct>
    <PCC>{$this->api->pcc}</PCC>
    <Contract>$this->privateFare</Contract>
    <PFType></PFType>
</PFMod>";
            
        } else {
            $privateFare = "";            
        }
        
        $this->content .= str_replace([
                    '{psgrAryContent}',
                    '{tourCode}',
                    '{privateFare}',
                ], [
                    $this->psgrAryContent,
                    $tourCode,
                    $privateFare,
                ], self::$templateStorePriceMods);
    }

    function addEndTransaction() {
        if ($this->queueToPcc === null) {
            $this->content .= self::$endTransactionMods;
        } else {
            $this->content .= str_replace([
                '{PCC}',
                '{QNum}'
                    ], [
                $this->queueToPcc,
                $this->queueNum
                    ], self::$endTransactionModsWithQueue);
        }
    }

    private function addAirSegSellMods() {
        $this->content .= str_replace('{content}', $this->airSegSellList, self::$templateAirSegSellMods);
    }

    /**
     * Prepare the aire segments list for the booking
     * @param array $segments 3 dimiensional Array with the info about the itinerary [journey][leg] = array (fllight data)
     */
    function addAirSegments(array $segments) {
        if ($this->totalSeats === 0) {
            return "Segments can not be added befor the passengers are added";
        }
        foreach ($segments as $segRef => $segment) {
            foreach ($segment as $flight) {
                $daysOfTravel = floor((strtotime($flight['arriveTs']) - strtotime($flight['departTs']) ) / (24 * 3600));
                $this->airSegSellList .= str_replace(
                        [
                    '{airlineCode}',
                    '{flightNumber-4alphas}',
                    '{bookingClass}',
                    '{departureDateYYYYMMDD}',
                    '{origin}',
                    '{destination}',
                    '{totalSeats}',
                    '{daysOfTravel}',
                    '{segmentNumber}'
                        ], [
                    $flight['marketingCompany'],
                    str_pad($flight['flightNumber'], 4, '0', STR_PAD_LEFT),
                    str_pad($flight['bookingClass'], 2, ' ', STR_PAD_RIGHT),
                    date('Ymd', strtotime($flight['depart'])),
                    $flight['origin'],
                    $flight['destination'],
                    $this->totalSeats,
                    $daysOfTravel,
                    str_pad($segRef, 2, '0', STR_PAD_LEFT),
                        ], self::$templateAirSegSell);
            }
        }
        $this->addAirSegSellMods();
        $this->addStorePriceMods();
        return true;
    }

    function checkAvailability() {
        foreach ($this->pnrResponseObj->AirSegSell->AirSell as $legKey => $leg) {
            if ($leg->SuccessInd != 'Y') {
                return "Air sell segment is not succesful " . (string) $this->pnrResponseObj->AirSegSell->ErrText->Text;
            }
            if (!in_array($leg->Status, self::$okStatuses)) {
                return "Air segment #{$legKey} has status: {$leg->Status}";
            }
        }
        return true;
    }

    function checkFaresAvailability() {
        if ($this->pnrResponseObj->FareInfo->FilingStatus->FareFiledOKInd != 'Y') {
            return $this->pnrResponseObj->FareInfo->OutputMsg->Text;
        }
        return true;
    }

    function checkFares($faresTotal) {
        $sum = 0;
        reset($this->paxTypesAndCount);
        foreach ($this->pnrResponseObj->FareInfo->GenQuoteDetails as $gqd) {
            $sum += (float) $gqd->TotAmt * current($this->paxTypesAndCount);
            next($this->paxTypesAndCount);
        }
        if ($sum == $faresTotal) {
            return true;
        } else {
//            return "Fares amount is $sum, but offer is for $faresTotal, difference is: " . ($sum - $faresTotal);
            return $sum - $faresTotal;
        }
    }

    function resetContent() {
        $this->content = '';
    }

    function test() {
        //echo preg_replace('/\s*(<[^>]*>)\s*/','$1',$nameItem);
        $passengers = [
            [
                'firstName' => 'TonyA',
                'lastName' => 'BoyA',
                'title' => 'Mr.',
                'type' => 1, // 'ADT',
                'birthDate' => '',
                'amount' => (8202 - 1964),
                'id' => 1,
                'arrTaxes' => [],
                'fareBasis' => 'FB001',
//                'ff' => ['LH 222016292227053', 'BA 14014697'],
                'ff' => ['9W 1111NT1', 'AA 9999999'],
                'SSRs' => ['AVML', 'BIKE']
            ],
            [
                'firstName' => 'DollyA',
                'lastName' => 'GirlA',
                'title' => 'Ms.',
                'type' => 2, // 'CNN',
                'birthDate' => '2009-03-19',
                'amount' => 8202,
                'id' => 2,
                'arrTaxes' => [],
                'fareBasis' => 'FB002',
//                'SSRs' => ['CHML']
            ],
            [
                'firstName' => 'DimiA',
                'lastName' => 'BabyA',
                'title' => 'Mstr.',
                'type' => 3, // 'INF',
                'birthDate' => '2014-02-20',
                'amount' => 3399,
                'id' => 3,
                'arrTaxes' => [],
                'fareBasis' => 'FB003',
                'SSRs' => ['BSCT']
            ],
        ];
//        $this->addFfItem(1, '9W', '1111NT1');
//        $this->addFfItem(1, 'AA', '9999999');
        $this->addPassengers($passengers);

        $segments = [
            1 => array(
                0 => array(
                    'origin' => 'MAA',
                    'destination' => 'BLR',
                    'depart' => '2014-12-08',
                    'flightNumber' => 7008,
                    'marketingCompany' => '9W',
                    'bookingClass' => 'B',
                    'departTs' => '2014-12-08 08:15',
                    'arriveTs' => '2014-12-08 09:10'
                ),
                1 => array(
                    'origin' => 'BLR',
                    'destination' => 'HYD',
                    'depart' => '2014-12-08',
                    'flightNumber' => 2744,
                    'marketingCompany' => '9W',
                    'bookingClass' => 'B',
                    'departTs' => '2014-12-08 18:05',
                    'arriveTs' => '2014-12-08 19:15'
                )
            ),
            2 => array(
                0 => array(
                    'origin' => 'HYD',
                    'destination' => 'MAA',
                    'depart' => '2014-12-15',
                    'flightNumber' => 2410,
                    'marketingCompany' => '9W',
                    'bookingClass' => 'B',
                    'departTs' => '2014-12-05 09:10',
                    'arriveTs' => '2014-12-05 10:15'
                )
            )
        ];

        $this->addAirSegments($segments);

//        $this->addCashFop();
//        $this->addCcFop('CA', '0815', '5499830000000015');

        $this->connect('', [], Utils::DEFAULT_GALILEO_TEST_ID);
//        $this->connect('',[],  Utils::DEFAULT_GALILEO_PRODUCTION_ID);

        return $this->createPnr();
    }

    function checkAvailabilityAndFares() {
        // Passengers check
        if ($this->totalSeats === 0) {
            return 'The passengers are not added yet';
        }
        // Segments check
        if ($this->airSegSellList === '') {
            return 'The segments are not added yet';
        }
        // Api check
        if ($this->api === null) {
            return 'The API connection is not created yet';
        }
        $this->finalTransactionWrap();
        if ($this->api->beginSession() !== true) {
            return "Galileo session can't start";
        }
        $this->pnrResponseObj = $this->api->client->SubmitXmlOnSession($this->content);
        if (is_object($this->pnrResponseObj) && YII_DEBUG) {
            $this->pnrResponseObj->saveXML(\Yii::app()->runtimePath . '/galileo_PNRBF_response.xml');
        }

        $check = $this->checkPNRBFPrimaryBldChgMods();
        if ($check !== true) {
            $this->api->endSession();
            return $check;
        }
        $check = $this->checkAvailability();
        if ($check !== true) {
            $this->api->endSession();
            return [
                'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                'priceDiff' => 0,
                "details" => $check
            ];
        }
        $check = $this->checkFaresAvailability();
        if ($check !== true) {
            $this->api->endSession();
            return [
                'errorCode' => \ApiInterface::FLIGHT_UNAVAILABLE,
                'priceDiff' => 0,
                "details" => $check
            ];
        }
        $check = $this->checkFares($this->faresTotal);
        if ($check !== true) {
            $this->api->endSession();
            return [
                'errorCode' => $check > 0 ? \ApiInterface::FARE_INCREASED : \ApiInterface::FARE_DECREASED,
                'priceDiff' => $check,
                "details" => 'Fare difference: ' . $check
            ];
        }
        $this->api->endSession();
        return true;
    }

    function createPnr($params = []) {
//        \Utils::dbgYiiLog(['pf' => $this->privateFare, 'tc' => $this->tourCode]);
        // Passengers check
        if ($this->totalSeats === 0) {
            return ["error" => 'The passengers are not added yet'];
        }
        // Segments check
        if ($this->airSegSellList === '') {
            return ["error" => 'The segments are not added yet'];
        }
        // Api check
        if ($this->api === null) {
            return ["error" => 'The API connection is not created yet'];
        }
        $this->finalTransactionWrap();
//        print_r($this->content); exit;
//        $localTest = true;
        $localTest = false;
        if ($localTest) {
            $this->pnrResponseObj = simplexml_load_file('galileo_PNRBF_response.xml');
        } else {
            if ($this->api->beginSession() !== true) {
                return ["error" => "Galileo session can't start"];
            }
            $this->pnrResponseObj = $this->api->client->SubmitXmlOnSession($this->content);
//            \Utils::soapLogDebug($api->client);
            if (is_object($this->pnrResponseObj) && YII_DEBUG) {
                $this->pnrResponseObj->saveXML(\Yii::app()->runtimePath . '/galileo_PNRBF_response.xml');
            }
        }
//        print_r($res);

        $check = $this->checkPNRBFPrimaryBldChgMods();
        if ($check !== true) {
            $this->api->endSession();
            return ["error" => $check];
        }
        $check = $this->checkAvailability();
        if ($check !== true) {
//            print_r($this->pnrResponseObj);
            $this->api->endSession();
            return ["error" => $check];
        }
        $check = $this->checkFaresAvailability();
        if ($check !== true) {
            $this->api->endSession();
            return ["error" => $check];
        }
        $check = $this->checkFares($this->faresTotal);
        if ($check !== true) {
            $this->api->endSession();
            return ["error" => 'Fare difference: ' . $check];
        }

        // Second part of the workflow, Here are the FOP and the SSRs
        if (!empty($this->secondaryBldChgModsItems)) {  // Do this only if we have secondary items
            $this->resetContent();
            $this->addPNRBFSecondaryBldChgMods();
            $this->finalTransactionWrap();
            if ($localTest) {
                $this->pnrResponseObj = simplexml_load_file('galileo_PNRBF_response2.xml');
            } else {
//                \Utils::dbgYiiLog($this->content);
                $this->pnrResponseObj = $this->api->client->SubmitXmlOnSession($this->content);
                if (YII_DEBUG) {
                    $this->pnrResponseObj->saveXML('galileo_PNRBF_response2.xml');
//                \Utils::soapLogDebug($this->api->client);
                }
                if (!is_object($this->pnrResponseObj)) {
                    $this->api->endSession();
                    \Utils::dbgYiiLog($this->pnrResponseObj);
                    return ["error" => (string) $this->pnrResponseObj];
                }
            }
            // Check secondary building blocks for corectness
            $check = $this->checkPNRBFSecondaryBldChgMods();
            if ($check !== true) {
                $this->api->endSession();
                return ["error" => $check];
            }
        }

        // Check for queing
        $this->queueCheck($params);
        // Add end transaction element
        $this->resetContent();
        $this->addEndTransaction();
        $this->finalTransactionWrap();
        if ($localTest) {
            $this->pnrResponseObj = simplexml_load_file('galileo_PNRBF_response3.xml');
        } else {
            $this->pnrResponseObj = $this->api->client->SubmitXmlOnSession($this->content);
//            \Utils::dbgYiiLog($this->pnrResponseObj);
            if (is_object($this->pnrResponseObj) && YII_DEBUG) {
                $this->pnrResponseObj->saveXML('galileo_PNRBF_response3.xml');
            }
        }

        // Check ET response
        $check = $this->checkEndTransaction();
//        echo $check;
        if ($check === 'W') {
            // It's just a warning do EndTransaction again
            if ($localTest) {
                $this->pnrResponseObj = simplexml_load_file('galileo_PNRBF_response4.xml');
            } else {
                $this->pnrResponseObj = $this->api->client->SubmitXmlOnSession($this->content);
//                print_r($this->pnrResponseObj);
                if (is_object($this->pnrResponseObj) && YII_DEBUG) {
                    $this->pnrResponseObj->saveXML('galileo_PNRBF_response4.xml');
                }
            }
        } elseif ($check !== true) {
            $this->api->endSession();
            return ["error" => $check];
        }

        if (isset($this->pnrResponseObj->PNRBFRetrieve->GenPNRInfo->RecLoc)) {
            $this->strPnr = (string) $this->pnrResponseObj->PNRBFRetrieve->GenPNRInfo->RecLoc;
        } else {
            $this->strPnr = (string) $this->pnrResponseObj->EndTransaction->EndTransactResponse->RecLoc;
        }
        // Issue the ticket
        $this->issueTicket();

        $this->api->endSession();
        // Return the new PNR code
        return [
            'pnr' => (string) $this->strPnr,
            'notes' => implode('<br>', $this->notes),
            'error' => null
        ];
    }

    function retrievePnr($pnrStr) {
        if ($this->api !== null) {
            $this->pnrResponseObj = $this->api->pnrRetrieve($pnrStr);
        }
    }

    function cancelPnr($pnrStr) {
        if ($this->api !== null) {
            $this->pnrResponseObj = $this->api->pnrCancel($pnrStr);
        }
    }

    function addPrivateFare($clientId, $pfCode) {
        
    }

    function addFfItem($psgrNum, $airline, $ffCode) {
        if ($this->totalSeats !== 0) {
            return "Please add the FFs before the passengers";
        }
        $this->ffData[$psgrNum][] = $airline . " " . $ffCode;
        return true;
    }

    /**
     * Parameters needed for the connection. Used to instantize the SOAP client for future calls
     * @param string $wsdlFilesDirectory Relative folder name (usualy test or production) to the WSDL file used for the SOAP actions
     * @param array $credentials Data like (username, password, PCC, someSpecificParameter)
     */
    function connect($wsdlFilesDirectory, array $credentials, $airSourceId = null) {
        if ($airSourceId) {
            $this->api = new Galileo($airSourceId);
        } else {
            // A little bit of reverse engineering
            $airSource = \AirSource::model()->findByAttributes([
                'username' => $credentials['username'],
                'password' => $credentials['password'],
                'profile_pcc' => $credentials['hap'],
            ]);
            if ($airSource !== null) {
                $this->api = new Galileo($airSource->id);
            }
        }
    }

    function linkPrinter() {
        if (!empty($this->api->ticketPrinter)) {
            // Link the ticket printer
            $ticketPrinterRequest = str_replace('{ticketPrinter}', $this->api->ticketPrinter, self::$templateTicketPrinterLinkage);
            $printerLinkResponse = $this->api->client->SubmitXmlOnSession($ticketPrinterRequest);
//            if (YII_DEBUG) {
//                \Utils::dbgYiiLog($printerLinkResponse);
//            }
            if (!empty($printerLinkResponse->LinkageUpdate->ErrText->Text)) {
                \Utils::dbgYiiLog($printerLinkResponse);
                return (string) $printerLinkResponse->LinkageUpdate->ErrText->Text;
            }
            return true;
        }
        return false;
    }

    function displayPrinters() {
        $ticketPrinter = str_replace('{ticketPrinter}', $this->api->ticketPrinter, self::$templateTicketPrinterDisplay);
        if ($this->api->client->token) {
            $response = $this->api->client->SubmitXmlOnSession($ticketPrinter);
        } else {    // Start new session
            $this->api->beginSession();
            $response = $this->api->client->SubmitXmlOnSession($ticketPrinter);
            $this->api->endSession();
        }
//        if (YII_DEBUG) {
//            \Utils::dbgYiiLog($response);
//        }
        if (!empty($response->LinkageUpdate->ErrText->Text)) {
            $this->notes[] = (string) $response->LinkageUpdate->ErrText->Text;
        }
        return $response;
    }

    function abortCurrentPnr() {
        // Inform the API that the booking is aborted
        if ($this->api !== null) {
            $this->api->endSession();
        }
        // Reset the vars
        $this->fop = false;
        $this->faresTotal = 0;
        $this->psgrNum = 0;
        $this->totalSeats = 0;
        $this->psgrAryContent = '';
        $this->airSegSellList = '';
        $this->paxNameItems = '';
        $this->secondaryBldChgModsItems = '';
        $this->paxTypesAndCount = [];
        $this->ffData = [];
        $this->notes = [];

        $this->api = null;
        $this->pnrResponseObj = null;
        $this->content = '';
    }

    private function queueCheck($params) {
        if (!empty($params['queueToPcc'])) {
            $this->queueToPcc = $params['queueToPcc'];
            if (!empty($params['queueNum'])) {
                $this->queueNum = $params['queueNum'];
            }
            $this->api->ticketPrinter = $params['spare1'];
            $this->queueToAirSourceId = $params['queueToAirSourceId'];
            $this->fop = ($params['autoTicket'] == 1);
        }
    }

    function issueTicket() {
        if ($this->fop) {   // Issue the ticket
            $this->api->endSession();
            if ($this->queueToPcc) {
                $this->connect('', [], (int) $this->queueToAirSourceId);
            }
            $this->api->beginSession();
            $this->api->pnrRetrieveOnSession($this->strPnr);
            if (YII_DEBUG) {
                $this->pnrResponseObj->saveXML('galileo_Retrieve_response5.xml');
            }
            if (!empty($this->api->ticketPrinter)) {
                // Link the ticket printer
                $linkResponse = $this->linkPrinter();
//                \Utils::dbgYiiLog($linkResponse);
                if (is_string($linkResponse)) {
                    $this->notes[] = $linkResponse;
                }
            } else {    // No ticket printer
                $this->notes[] = "The ticket printer GTID parameter is not configured for this Air Source.";
            }
            // Issue the ticket
            $ticketResponse = $this->api->client->SubmitXmlOnSession(self::$templateDocProdFareManipulation);
//            \Utils::dbgYiiLog($ticketResponse);
            // End the ticket session
            $this->api->endSession();
            if (YII_DEBUG) {
                \Utils::dbgYiiLog($ticketResponse);
            }
            if (!empty($ticketResponse->Ticketing->ErrText->Text)) {
                $this->notes[] = (string) $ticketResponse->Ticketing->ErrText->Text;
            }
            if (is_object($ticketResponse) && YII_DEBUG) {
                $ticketResponse->saveXML('galileo_DocProdFareManipulation.xml');
            }
            // Delink all the printers
//                    $ticket->api->client->SubmitXmlOnSession(self::$templateTicketPrinterDeLink);
        }
    }

    function testIssueTicket($strPnr, $airSourceId) {
        $this->connect('', [], $airSourceId);
        $this->api->beginSession();
        $this->pnrResponseObj = $this->api->pnrRetrieveOnSession($strPnr);
        \Utils::dbgYiiLog($this->pnrResponseObj);
        $ticketResponse = $this->api->client->SubmitXmlOnSession(self::$templateDocProdFareManipulation);
        \Utils::dbgYiiLog($ticketResponse);
//        \Utils::soapLogDebugFile($this->api->client);
        $this->api->endSession();
        return $ticketResponse;
    }

    /**
     * Set the private fare
     * @param string $code
     */
    function setPrivateFare($code) {
        if (!empty($code)) {
            $this->privateFare = strtoupper($code);
        }
    }

    /**
     * Set the tour code
     * @param string $code
     */
    function setTourCode($code) {
        if (!empty($code)) {
            $this->tourCode = strtoupper($code);
        }
    }

}
