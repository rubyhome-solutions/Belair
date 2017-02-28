<?php

namespace application\components\Galileo;

/**
 * Galileo API
 *
 * @author Boxx
 *
 */
class Galileo {

    private $hap;
    public $pcc;
    public $username;

    /**
     * @var GalileoClient
     */
    public $client;

    /**
     *
     * @var string Galileo need this parameter so the tickets can be issued
     */
    public $ticketPrinter = null;

    /**
     * Galileo api
     * @param int $id The air source ID
     */
    function __construct($id) {
        $model = \AirSource::model()->with('backend')->cache(600)->findByPk($id);
        /* @var $model \AirSource */
        if (!$model) {
            \Utils::finalMessage("AirSource DB record not found. Wrong ID: {$id}\n");
        }
        eval('$wsdlFile = ' . $model->backend->wsdl_file);
        if (!file_exists($wsdlFile)) {
            \Utils::finalMessage("Wrong Galileo enviroment. File not found: $wsdlFile \n");
        }
        $this->hap = $model->profile_pcc;
        if (empty($this->hap)) {
            \Utils::finalMessage("Credentials not found. Wrong ID: {$id}\n");
        }
        $this->ticketPrinter = $model->spare1;
        $this->pcc = $model->spare2;
        $this->username = $model->username;
        $params = [
            'compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP | 9,
            'login' => $model->username,
            'password' => $model->password,
            'Profile' => $model->profile_pcc,
            'trace' => true,
            'exceptions' => 1,
            'connection_timeout' => 15
//            'features' => SOAP_SINGLE_ELEMENT_ARRAYS,
//            'cache_wsdl' => WSDL_CACHE_NONE
        ];
        // Set total socket timeout
        ini_set('default_socket_timeout', 120);
        $this->client = new GalileoClient($params, $wsdlFile);
    }

    function beginSession() {
        return $this->client->BeginSession($this->hap);
    }

    function endSession() {
        return $this->client->EndSession();
    }

    /**
     * Search Galileo API using FareQuoteSuperBB
     * @param string $source
     * @param string $destination
     * @param string $departure_date
     * @param int $adults
     * @param int $children
     * @param int $infants
     * @param string $back_date
     * @param int $class
     * @return \SimpleXMLElement Simple XML element
     */
    public function search($source, $destination, $departure_date, $adults = 1, $children = 0, $infants = 0, $back_date = null, $class = \CabinType::ECONOMY) {
//        $strXml = '<LocalDateTimeCT_6_0><LocalDateTimeMods><ReqCity>ORD</ReqCity></LocalDateTimeMods></LocalDateTimeCT_6_0>';
        $departure_date = str_replace('-', '', $departure_date);
        $back_date = str_replace('-', '', $back_date);
        $seats = $adults + $children + $infants;
        $class = \CabinType::$iataCabinClass[$class];
        if (!empty($back_date)) {
            $roundTrip = "
                <AirAvailMods>
                    <GenAvail>
                        <NumSeats>{$seats}</NumSeats>
                        <Class>{$class}</Class>
                        <StartDt>{$back_date}</StartDt>
                        <StartPt>{$destination}</StartPt>
                        <EndPt>{$source}</EndPt>
                        <FltTypeInd>E</FltTypeInd>
                        <FltTypePref/>
                        <StartPtInd>N</StartPtInd>
                        <EndPtInd>N</EndPtInd>
                        <IgnoreTSPref>N</IgnoreTSPref>
                        <MaxNumFlts>" . Utils::GALILEO_MAX_SEARCH_RESULTS . "</MaxNumFlts>
                    </GenAvail>
                </AirAvailMods>";
        } else {
            $roundTrip = '';
        }

        $passagersXml = '';
        $passagerNum = 1;
        for ($i = 0; $i < $adults; $i++) {
            $passagersXml .= "
            <Psgr>
                <LNameNum>$passagerNum</LNameNum>
                <PsgrNum>$passagerNum</PsgrNum>
                <AbsNameNum>$passagerNum</AbsNameNum>
                <PTC>" . \application\components\Galileo\Utils::PASSENGER_ADULT_STRING . "</PTC>
                <TIC/>
            </Psgr>";
            $passagerNum++;
        }
        for ($i = 0; $i < $children; $i++) {
            $passagersXml .= "
            <Psgr>
                <LNameNum>$passagerNum</LNameNum>
                <PsgrNum>$passagerNum</PsgrNum>
                <AbsNameNum>$passagerNum</AbsNameNum>
                <PTC>" . \application\components\Galileo\Utils::PASSENGER_CHILD_STRING . "</PTC>
                <TIC/>
            </Psgr>";
            $passagerNum++;
        }

        for ($i = 0; $i < $infants; $i++) {
            $passagersXml .= "
            <Psgr>
                <LNameNum>$passagerNum</LNameNum>
                <PsgrNum>$passagerNum</PsgrNum>
                <AbsNameNum>$passagerNum</AbsNameNum>
                <PTC>" . \application\components\Galileo\Utils::PASSENGER_INFANT_STRING . "</PTC>
                <TIC/>
            </Psgr>";
            $passagerNum++;
        }

        $strXml = "
        <FareQuoteSuperBB_29>
            <AirAvailMods>
                <GenAvail>
                    <NumSeats>{$seats}</NumSeats>
                    <Class>{$class}</Class>
                    <StartDt>{$departure_date}</StartDt>
                    <StartPt>{$source}</StartPt>
                    <EndPt>{$destination}</EndPt>
                    <FltTypeInd>E</FltTypeInd>
                    <FltTypePref/>
                    <StartPtInd>N</StartPtInd>
                    <EndPtInd>N</EndPtInd>
                    <IgnoreTSPref>N</IgnoreTSPref>
                    <MaxNumFlts>" . Utils::GALILEO_MAX_SEARCH_RESULTS . "</MaxNumFlts>
                </GenAvail>
            </AirAvailMods>
            {$roundTrip}
            <SuperBBMods>
                <PassengerType>
                    <PsgrAry>
                        $passagersXml
                    </PsgrAry>
                </PassengerType>
                <Optimize>
                    <RecType>1001</RecType>
                    <KlrIDAry>
                        <KlrID>AAFI</KlrID>
                    </KlrIDAry>
                </Optimize>
                <Optimize>
                    <RecType>1425</RecType>
                    <KlrIDAry>
                        <KlrID>EROR</KlrID>
                        <KlrID>GFGQ</KlrID>
                        <KlrID>GFXI</KlrID>
                        <KlrID>GFPI</KlrID>
                        <KlrID>GFRI</KlrID>
                        <KlrID>GFPX</KlrID>
                        <KlrID>GFFB</KlrID>
                        <KlrID>GRFB</KlrID>
                    </KlrIDAry>
                </Optimize>
            </SuperBBMods>
        </FareQuoteSuperBB_29>";

        //<KlrID>AAB1</KlrID>
        //<KlrID>GROM</KlrID>
        //<KlrID>GFFC</KlrID>
        //<KlrID>GFMM</KlrID>
        //<KlrID>GFRH</KlrID>
        //<KlrID>GFRR</KlrID>
        //<KlrID>GFSR</KlrID>
        //<KlrID>GFSU</KlrID>
        //<KlrID>GFTS</KlrID>
        //<TmWndInd>D</TmWndInd>
        //<StartTmWnd>0000</StartTmWnd>
        //<EndTmWnd>2359</EndTmWnd>
        //<StartTm>1315</StartTm>
        //<JrnyTm>99</JrnyTm>
//        return $this->submitXml($strXml);
        if (YII_DEBUG) {
            file_put_contents(\Yii::app()->runtimePath . '/galileo_search_request.xml', $strXml);
        }

        $res = $this->submitXml($strXml);
        // Error checking
        if (isset($res->FareInfo->RespHeader->ErrMsg) &&
                (string) $res->FareInfo->RespHeader->ErrMsg == 'Y' &&
                isset($res->FareInfo->InfoMsg->Text)) {
            return (string) $res->FareInfo->InfoMsg->Text;
        }
        return $res;
    }

    /**
     * Sessionless submit XML element
     * @param string $request The body of the request
     * @return SimpleXmlElement
     */
    function submitXml($request) {
        $xml = new SubmitXml($this->hap, $request);
        return $this->client->SubmitXml($xml);
    }

    /**
     * Retrive a given PNR
     * @param string $pnrStr The PNR identificator
     * @return \SimpleXMLElement The response
     */
    function pnrRetrieve($pnrStr) {
        $template = '
<PNRBFManagement_32>
    <PNRBFRetrieveMods>
        <PNRAddr>
            <FileAddr />
            <CodeCheck />
            <RecLoc>{strPnr}</RecLoc>
        </PNRAddr>
    </PNRBFRetrieveMods>
    <FareRedisplayMods>
        <DisplayAction>
            <Action>D</Action>
        </DisplayAction>
    </FareRedisplayMods>
</PNRBFManagement_32>
';
        $request = str_replace('{strPnr}', $pnrStr, $template);
        $res = $this->submitXml($request);
        if (isset($res->PNRBFRetrieve->ErrText->Err)) {
            return (string) $res->PNRBFRetrieve->ErrText->Err;
        } else {
            return $res;
        }
    }

    function pnrRetrieveOnSession($pnrStr) {
        $template = '
<PNRBFManagement_32>
    <PNRBFRetrieveMods>
        <PNRAddr>
            <FileAddr />
            <CodeCheck />
            <RecLoc>{strPnr}</RecLoc>
        </PNRAddr>
    </PNRBFRetrieveMods>
    <FareRedisplayMods>
        <DisplayAction>
            <Action>D</Action>
        </DisplayAction>
    </FareRedisplayMods>
</PNRBFManagement_32>
';
        $request = str_replace('{strPnr}', $pnrStr, $template);
        $res = $this->client->SubmitXmlOnSession($request);
        if (isset($res->PNRBFRetrieve->ErrText->Err)) {
            return (string) $res->PNRBFRetrieve->ErrText->Err;
        } else {
            return $res;
        }
    }

    /**
     * Cancel the given PNR
     * @param string $pnrStr The PNR identificator
     * @return \SimpleXMLElement The response
     */
    function pnrCancel($pnrStr) {
        $template1 = '
<PNRBFManagement_32>
    <PNRBFRetrieveMods>
        <PNRAddr>
            <FileAddr/>
            <CodeCheck/>
            <RecLoc>{strPnr}</RecLoc>
        </PNRAddr>
    </PNRBFRetrieveMods>
</PNRBFManagement_32>';
        $template2 = '
<PNRBFManagement_32>
    <SegCancelMods>
        <CancelSegAry>
            <CancelSeg>
                <Tok>01</Tok>
                <SegNum>FF</SegNum>
            </CancelSeg>
        </CancelSegAry>
    </SegCancelMods>
</PNRBFManagement_32>';
        $template3 = '
<PNRBFManagement_32>
    <EndTransactionMods>
        <EndTransactRequest>
            <ETInd>E</ETInd>
            <RcvdFrom>BELAIR</RcvdFrom>
        </EndTransactRequest>
    </EndTransactionMods>
</PNRBFManagement_32>';
        $request1 = str_replace('{strPnr}', $pnrStr, $template1);
        $this->beginSession();
        $this->client->SubmitXmlOnSession($request1);   // Retrieve the PNR
        $this->client->SubmitXmlOnSession($template2);  // Issue cancel command
        $this->client->SubmitXmlOnSession($template3);  // Issue End transaction command - we expect warning
        $res = $this->client->SubmitXmlOnSession($template3);  // Issue End transaction command again to ignore the warning
        $this->endSession();
        return $res;
    }

    /**
     * Parse the Galileo FareInfo object
     * @param array $fares Unparsed FareInfo array
     * @return array parsed fares
     */
    static function parseFares($fares) {
        $out = array();
        foreach ($fares as $fareInfo) {
            $fareData = array();
            if (isset($fareInfo['RulesInfo']['FIC'])) {
                $fareData['F.Basis'] = $fareInfo['RulesInfo']['FIC'];
            } else {
                $fareData['F.Basis'] = $fareInfo['RulesInfo'][0]['FIC'];
            }
            $fareData['Curr.'] = $fareInfo['GenQuoteDetails']['TotCurrency'];
            $fareData['Total'] = $fareInfo['GenQuoteDetails']['TotAmt'];
            $fareData['baseFare'] = $fareInfo['GenQuoteDetails']['BaseFareAmt'];

            // Prepare the taxes
            $fareData['totalTaxes'] = 0;
            $fareData['Taxes'] = '';
            foreach ($fareInfo['GenQuoteDetails']['TaxDataAry']['TaxData'] as $value) {
//        $fareData['taxes'][$value['Country']] = floatval($value['Amt']);
                $fareData['Taxes'] .= $value['Country'] . ":" . floatval($value['Amt']) . " ";
                $fareData['totalTaxes'] += floatval($value['Amt']);
            }
            $fareData['Taxes'] = substr($fareData['Taxes'], 0, -1);

            // Match with the main array indexes
            if (isset($fareInfo['FlightItemCrossRef']['FltItemAry']['FltItem']['IndexNum'])) { // single element
                $out[$fareInfo['FlightItemCrossRef']['FltItemAry']['FltItem']['IndexNum'] - 1] = $fareData;
            } else {
                foreach ($fareInfo['FlightItemCrossRef']['FltItemAry']['FltItem'] as $value) {
                    $out[$value['IndexNum'] - 1] = $fareData;
                }
            }
        }

        return $out;
    }

}

?>