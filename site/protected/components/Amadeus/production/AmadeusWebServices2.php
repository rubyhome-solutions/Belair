<?php

namespace application\components\Amadeus\production;

/**
 *
 */
class AmadeusWebServices2 extends \SoapClient {

    private $headers = null;
    private $soapHeader = null;

    const AMADEUS_HEADER_NAMESPACE = 'http://xml.amadeus.com/ws/2009/01/WBS_Session-2.0.xsd';

    /**
     *
     * @param array $options Array of config values
     * @param string $wsdl The wsdl file to use
     * @access public
     */
    public function __construct(array $options = array(), $wsdl = '1ASIWBELBEL_PRD_20140403_062519.wsdl') {
//        foreach (self::$classmap as $key => $value) {
//            if (!isset($options['classmap'][$key])) {
//                $options['classmap'][$key] = $value;
//            }
//        }
        // Local options
        $options['soap_version'] = SOAP_1_1;
        $options['compression'] = SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP;
        $options['trace'] = true;
        $options['exceptions'] = 1;
        $options['connection_timeout'] = 60;

        parent::__construct(__DIR__ . DIRECTORY_SEPARATOR . $wsdl, $options);
    }

    /**
     *
     * @param Air_RetrieveSeatMap $Air_RetrieveSeatMap_97_1
     * @access public
     * @return Air_RetrieveSeatMapReply
     */
    public function Air_RetrieveSeatMap(Air_RetrieveSeatMap $Air_RetrieveSeatMap_97_1) {
        return $this->__soapCall('Air_RetrieveSeatMap', array($Air_RetrieveSeatMap_97_1), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param Air_SellFromRecommendation $Air_SellFromRecommendation_5_2
     * @access public
     * @return Air_SellFromRecommendationReply
     */
    public function Air_SellFromRecommendation(Air_SellFromRecommendation $Air_SellFromRecommendation_5_2) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('Air_SellFromRecommendation', array($Air_SellFromRecommendation_5_2), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
//            \Utils::dbgYiiLog($Air_SellFromRecommendation_5_2);
        }
    }

    /**
     *
     * @param Command_Cryptic $Command_Cryptic_7_3
     * @access public
     * @return Command_CrypticReply
     */
    public function Command_Cryptic(Command_Cryptic $Command_Cryptic_7_3) {
        $this->prepareHeader();
        return $this->__soapCall('Command_Cryptic', array($Command_Cryptic_7_3), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param DocIssuance_IssueTicket $DocIssuance_IssueTicket_9_1
     * @access public
     * @return DocIssuance_IssueTicketReply
     */
    public function DocIssuance_IssueTicket(DocIssuance_IssueTicket $DocIssuance_IssueTicket_9_1) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('DocIssuance_IssueTicket', array($DocIssuance_IssueTicket_9_1), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
//            echo $e->getMessage();
            return false;
        }
    }

    /**
     *
     * @param Fare_CheckRules $Fare_CheckRules_7_1
     * @access public
     * @return Fare_CheckRulesReply
     */
    public function Fare_CheckRules(Fare_CheckRules $Fare_CheckRules_7_1) {
        $this->prepareHeader();
        return $this->__soapCall('Fare_CheckRules', array($Fare_CheckRules_7_1), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param Fare_InformativePricingWithoutPNR $Fare_InformativePricingWithoutPNR_8_1
     * @access public
     * @return Fare_InformativePricingWithoutPNRReply
     */
    public function Fare_InformativePricingWithoutPNR(Fare_InformativePricingWithoutPNR $Fare_InformativePricingWithoutPNR_8_1) {
        $this->prepareHeader();
        return $this->__soapCall('Fare_InformativePricingWithoutPNR', array($Fare_InformativePricingWithoutPNR_8_1), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param Fare_MasterPricerTravelBoardSearch $Fare_MasterPricerTravelBoardSearch_10_3
     * @access public
     * @return Fare_MasterPricerTravelBoardSearchReply
     */
    public function Fare_MasterPricerTravelBoardSearch(Fare_MasterPricerTravelBoardSearch $Fare_MasterPricerTravelBoardSearch_10_3) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('Fare_MasterPricerTravelBoardSearch', array($Fare_MasterPricerTravelBoardSearch_10_3), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
            \Yii::log($e->getMessage());
            return false;
        }
    }

    /**
     *
     * @param Fare_PricePNRWithBookingClass $Fare_PricePNRWithBookingClass_7_3
     * @access public
     * @return Fare_PricePNRWithBookingClassReply
     */
    public function Fare_PricePNRWithBookingClass(Fare_PricePNRWithBookingClass $Fare_PricePNRWithBookingClass_7_3) {
        $this->prepareHeader();
        return $this->__soapCall('Fare_PricePNRWithBookingClass', array($Fare_PricePNRWithBookingClass_7_3), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param PNR_AddMultiElements $PNR_AddMultiElements_8_3
     * @access public
     * @return PNR_Reply
     */
    public function PNR_AddMultiElements(PNR_AddMultiElements $PNR_AddMultiElements_8_3) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('PNR_AddMultiElements', array($PNR_AddMultiElements_8_3), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
            $this->Security_SignOut();
            throw new \SoapFault('Receiver', $e->getMessage());
        }
    }

    /**
     *
     * @param PNR_Cancel $PNR_Cancel_8_3
     * @access public
     * @return PNR_Reply
     */
    public function PNR_Cancel(PNR_Cancel $PNR_Cancel_8_3) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('PNR_Cancel', array($PNR_Cancel_8_3), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
//            \Utils::soapLogDebug($this);
            return $e->getMessage();
        }
    }

    /**
     *
     * @param PNR_Retrieve $PNR_Retrieve_8_3
     * @access public
     * @return PNR_Reply
     */
    public function PNR_Retrieve(PNR_Retrieve $PNR_Retrieve_8_3) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('PNR_Retrieve', array($PNR_Retrieve_8_3), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
//            \Utils::soapLogDebug($this);
//            $this->Security_SignOut();
            return $e->getMessage();
        }
    }

    /**
     * Retrieve data about the given PNR
     * @param string $pnr The PNR to be cancelled
     * @param int $id The default Amadeus id
     * @return object
     */
    public function getPnr($pnr, $id = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID) {
        if ($this->headers === null) {
            $this->Security_Authenticate($id);
        }
        $pnrRetrieve = new PNR_Retrieve;
        $pnrRetrieve->retrievalFacts = new retrievalFacts;
        $pnrRetrieve->retrievalFacts->retrieve = new retrieve;
        $pnrRetrieve->retrievalFacts->retrieve->type = 2;   // 2 - retrieve by record locator
        $pnrRetrieve->retrievalFacts->reservationOrProfileIdentifier = new reservationOrProfileIdentifier;
        $pnrRetrieve->retrievalFacts->reservationOrProfileIdentifier->reservation = new reservation;
        $pnrRetrieve->retrievalFacts->reservationOrProfileIdentifier->reservation->controlNumber = $pnr;

        return $this->PNR_Retrieve($pnrRetrieve);
    }

    /**
     * Cancel the given PNR
     * @param string $pnr The PNR to be cancelled
     * @param int $id The default Amadeus id
     * @return object
     */
    public function cancelPnr($pnr, $id = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID) {
        if ($this->headers === null) {
            $this->Security_Authenticate($id);
            $endSession = true;
        } else {
            $endSession = false;
        }
        $this->getPnr($pnr);
        $pnrCancel = new PNR_Cancel;
        $pnrCancel->pnrActions = new pnrActions;
        $pnrCancel->pnrActions->optionCode = 10;    // 10   End Transaction
        $pnrCancel->cancelElements = new cancelElements;
        $pnrCancel->cancelElements->entryType = 'I';    // I	Cancel itinerary type.
        $res = $this->PNR_Cancel($pnrCancel);
        if ($endSession) {
            $this->Security_SignOut();
        }
        return $res;
    }

    /**
     * Cancel the current PNR
     * @return object
     */
    public function cancelCurrentPnr() {
        if (empty($this->headers)) {
            return false;   // We need active session to do this call
        }
        $pnrCancel = new PNR_Cancel;
        $pnrCancel->pnrActions = new pnrActions;
        $pnrCancel->pnrActions->optionCode = 10;    // 10   End Transaction
        $pnrCancel->cancelElements = new cancelElements;
        $pnrCancel->cancelElements->entryType = 'I';    // I	Cancel itinerary type.
        return $this->PNR_Cancel($pnrCancel);
    }

    /**
     * Add the pricing element to the current PNR, so the TST can be called
     * @return Fare_PricePNRWithBookingClassReply
     */
    public function addPrices($privateFare = '') {
        if ($this->headers === null) {
            // This works only in existing session
            return false;
        }
        $farePricePNRWithBookingClass = new Fare_PricePNRWithBookingClass;
        $farePricePNRWithBookingClass->overrideInformation = new overrideInformation;
        $farePricePNRWithBookingClass->overrideInformation->attributeDetails = new attributeDetails;
        if (empty($privateFare)) {
            $farePricePNRWithBookingClass->overrideInformation->attributeDetails->attributeType = 'NOP';
        } else {
            $farePricePNRWithBookingClass->overrideInformation->attributeDetails->attributeType = 'RW'; // RP – Published Fare , RU – Unifare Fare , RW – Corporate Unifare
            $farePricePNRWithBookingClass->overrideInformation->attributeDetails->attributeDescription = $privateFare;
        }

        return $this->Fare_PricePNRWithBookingClass($farePricePNRWithBookingClass);
    }

    /**
     * Add the pricing element to the current PNR, so the TST can be called
     * @param int $passagersCount How many passagers we have
     * @return object
     */
    public function addTickets($passagersCount) {
        if ($this->headers === null) {
            // This works only in existing session
            return false;
        }
        $ticketCreateTSTFromPricing = new Ticket_CreateTSTFromPricing;
        for ($i = 1; $i <= $passagersCount; $i++) {
            $psaList = new psaList;
            $psaList->itemReference = new itemReference;
            $psaList->itemReference->referenceType = 'TST';
            $psaList->itemReference->uniqueReference = $i;
            $ticketCreateTSTFromPricing->psaList[] = $psaList;
        }
        return $this->Ticket_CreateTSTFromPricing($ticketCreateTSTFromPricing);
    }

    /**
     * Add form of payment to the current PNR
     * @param fop $params Payment details for CC payments, identificationt CA=cash , CC=credit card
     * @return PNR_Reply
     */
    public function addFormOfPayment(fop $fop) {
        if ($this->headers === null) {
            // This works only in existing session with active PNR
            return false;
        }
        $pnr_AddMultiElements = new PNR_AddMultiElements;
        $pnr_AddMultiElements->pnrActions = new pnrActions;
        $pnr_AddMultiElements->pnrActions->optionCode = 0;  // No special process, 11 End transact with retrieve (ER), 10 End transact (ET)
        $pnr_AddMultiElements->dataElementsMaster = new dataElementsMaster;
        $pnr_AddMultiElements->dataElementsMaster->marker1 = new marker1;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv = new dataElementsIndiv;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->elementManagementData = new elementManagementData;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->elementManagementData->segmentName = 'FP';    // Form of Payment
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->formOfPayment = new formOfPayment;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->formOfPayment->fop = $fop;

        return $this->PNR_AddMultiElements($pnr_AddMultiElements);
    }

    public function getTicket() {
        if ($this->headers === null) {
            // This works only in existing session
            return false;
        }
        $ticketDisplay = new Ticket_DisplayTST;
        $ticketDisplay->displayMode = new displayMode;
        $ticketDisplay->displayMode->attributeDetails = new attributeDetails;
        $ticketDisplay->displayMode->attributeDetails->attributeType = 'ALL';
        return $this->Ticket_DisplayTST($ticketDisplay);
    }

    public function issueTicket() {
        if ($this->headers === null) {
            // This works only in existing session
            return false;
        }
        $issueTicket = new DocIssuance_IssueTicket;
        $issueTicket->optionGroup = new optionGroup;
        $issueTicket->optionGroup->switches = new StatusTypeI;
        $issueTicket->optionGroup->switches->statusDetails = new statusDetails;
        $issueTicket->optionGroup->switches->statusDetails->indicator = 'ET';
        return $this->DocIssuance_IssueTicket($issueTicket);
    }

    /**
     *
     * @param PNR_Retrieve $PNR_Retrieve_8_3
     * @access public
     * @return PNR_List
     */
//    public function PNR_Retrieve2(PNR_Retrieve $PNR_Retrieve_8_3) {
//        $this->prepareHeader();
//        return $this->__soapCall('PNR_Retrieve2', array($PNR_Retrieve_8_3), null, $this->soapHeader, $this->headers);
//    }

    /**
     *
     * @param int $id The ID from the providers table.
     * @access public
     * @return Security_AuthenticateReply
     */
    public function Security_Authenticate($id = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID) {
        $model = \AirSource::model()->findByPk($id);
        /* @var $model \AirSource */

        $userIdentifier = new userIdentifier;
        $userIdentifier->originIdentification = new originIdentification($model->profile_pcc);
        $userIdentifier->originator = $model->username;
        $userIdentifier->originatorTypeCode = 'U';

        $dutyCode = new dutyCode;
        $dutyCode->dutyCodeDetails = new dutyCodeDetails;
        $dutyCode->dutyCodeDetails->referenceQualifier = 'DUT';
        $dutyCode->dutyCodeDetails->referenceIdentifier = 'SU';

        $systemDetails = new systemDetails;
        $systemDetails->organizationDetails = new organizationDetails;
        $systemDetails->organizationDetails->organizationId = $model->tran_username;

        $passwordInfo = new passwordInfo;
        $passwordInfo->dataLength = strlen($model->password);
        $passwordInfo->dataType = 'E';
        $passwordInfo->binaryData = base64_encode($model->password);

        $Security_Authenticate_6_1 = new Security_Authenticate;
        $Security_Authenticate_6_1->userIdentifier = $userIdentifier;
        $Security_Authenticate_6_1->dutyCode = $dutyCode;
        $Security_Authenticate_6_1->systemDetails = $systemDetails;
        $Security_Authenticate_6_1->passwordInfo = $passwordInfo;

        try {
            $res = $this->__soapCall('Security_Authenticate', array($Security_Authenticate_6_1), null, null, $this->headers);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
//            echo $e->getMessage();
            return false;
        }

//        echo \Utils::dbg($this->headers);
//        echo \Utils::dbg((array)$this->headers['Session']);
        return $res;
    }

    function prepareHeader() {
        if (!isset($this->headers['Session'])) {
            \Utils::soapLogDebug($this);
            throw new \Exception('Session headers are not defined. Can\'t establish the session.');  //.print_r($this->headers, true));
        }
        $header = new Session;
        $header->SequenceNumber = (int) ($this->headers['Session']->SequenceNumber + 1);
        $header->SecurityToken = $this->headers['Session']->SecurityToken;
        $header->SessionId = $this->headers['Session']->SessionId;
        $this->soapHeader = new \SoapHeader(self::AMADEUS_HEADER_NAMESPACE, 'Session', $header);
    }

    /**
     *
     * @access public
     * @return Security_SignOutReply
     */
    public function Security_SignOut() {
        if (!isset($this->headers['Session'])) {
            return false;       // Do nothing if there is no active session to work with.
        }
        $Security_SignOut_4_1 = new Security_SignOut;
//        $Security_SignOut_4_1->SessionId = $this->headers['Session']->SessionId;
        $this->prepareHeader();
        return $this->__soapCall('Security_SignOut', array($Security_SignOut_4_1), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param Ticket_CreateTSTFromPricing $Ticket_CreateTSTFromPricing_4_1
     * @access public
     * @return Ticket_CreateTSTFromPricingReply
     */
    public function Ticket_CreateTSTFromPricing(Ticket_CreateTSTFromPricing $Ticket_CreateTSTFromPricing_4_1) {
        $this->prepareHeader();
        return $this->__soapCall('Ticket_CreateTSTFromPricing', array($Ticket_CreateTSTFromPricing_4_1), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param Ticket_DisplayTST $Ticket_DisplayTST_7_1
     * @access public
     * @return Ticket_DisplayTSTReply
     */
    public function Ticket_DisplayTST(Ticket_DisplayTST $Ticket_DisplayTST_7_1) {
        $this->prepareHeader();
        return $this->__soapCall('Ticket_DisplayTST', array($Ticket_DisplayTST_7_1), null, $this->soapHeader, $this->headers);
    }

}

class Session {

    /**
     *
     * @var string $SessionId
     * @access public
     */
    public $SessionId = null;

    /**
     *
     * @var string $SequenceNumber
     * @access public
     */
    public $SequenceNumber = null;

    /**
     *
     * @var string $SecurityToken
     * @access public
     */
    public $SecurityToken = null;

}

class Fare_CheckRules {

    /**
     *
     * @var msgType $msgType
     * @access public
     */
    public $msgType = null;

    /**
     *
     * @var availcabinStatus $availcabinStatus
     * @access public
     */
    public $availcabinStatus = null;

    /**
     *
     * @var conversionRate $conversionRate
     * @access public
     */
    public $conversionRate = null;

    /**
     *
     * @var pricingTickInfo $pricingTickInfo
     * @access public
     */
    public $pricingTickInfo = null;

    /**
     *
     * @var multiCorporate $multiCorporate
     * @access public
     */
    public $multiCorporate = null;

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var dateOfFlight $dateOfFlight
     * @access public
     */
    public $dateOfFlight = null;

    /**
     *
     * @var flightQualification $flightQualification
     * @access public
     */
    public $flightQualification = null;

    /**
     *
     * @var transportInformation $transportInformation
     * @access public
     */
    public $transportInformation = null;

    /**
     *
     * @var tripDescription $tripDescription
     * @access public
     */
    public $tripDescription = null;

    /**
     *
     * @var pricingInfo $pricingInfo
     * @access public
     */
    public $pricingInfo = null;

    /**
     *
     * @var fareRule $fareRule
     * @access public
     */
    public $fareRule = null;

}

class msgType {

    /**
     *
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

}

class messageFunctionDetails {

    /**
     *
     * @var businessFunction $businessFunction
     * @access public
     */
    public $businessFunction = null;

    /**
     *
     * @var messageFunction $messageFunction
     * @access public
     */
    public $messageFunction = null;

    /**
     *
     * @var responsibleAgency $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

    /**
     *
     * @var additionalMessageFunction $additionalMessageFunction
     * @access public
     */
    public $additionalMessageFunction = null;

}

class availcabinStatus {

    /**
     *
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class bookingClassDetails {

    /**
     *
     * @var designator $designator
     * @access public
     */
    public $designator = null;

    /**
     *
     * @var option $option
     * @access public
     */
    public $option = null;

}

class conversionRate {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConvRateDetails $otherConvRateDetails
     * @access public
     */
    public $otherConvRateDetails = null;

}

class conversionRateDetails {

    /**
     *
     * @var conversionType $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var rateType $rateType
     * @access public
     */
    public $rateType = null;

    /**
     *
     * @var pricingAmount $pricingAmount
     * @access public
     */
    public $pricingAmount = null;

    /**
     *
     * @var convertedValueAmount $convertedValueAmount
     * @access public
     */
    public $convertedValueAmount = null;

    /**
     *
     * @var dutyTaxFeeType $dutyTaxFeeType
     * @access public
     */
    public $dutyTaxFeeType = null;

    /**
     *
     * @var measurementValue $measurementValue
     * @access public
     */
    public $measurementValue = null;

    /**
     *
     * @var measurementSignificance $measurementSignificance
     * @access public
     */
    public $measurementSignificance = null;

}

class otherConvRateDetails {

    /**
     *
     * @var conversionType $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var rateType $rateType
     * @access public
     */
    public $rateType = null;

    /**
     *
     * @var pricingAmount $pricingAmount
     * @access public
     */
    public $pricingAmount = null;

    /**
     *
     * @var convertedValueAmount $convertedValueAmount
     * @access public
     */
    public $convertedValueAmount = null;

    /**
     *
     * @var dutyTaxFeeType $dutyTaxFeeType
     * @access public
     */
    public $dutyTaxFeeType = null;

    /**
     *
     * @var measurementValue $measurementValue
     * @access public
     */
    public $measurementValue = null;

    /**
     *
     * @var measurementSignificance $measurementSignificance
     * @access public
     */
    public $measurementSignificance = null;

}

class pricingTickInfo {

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class productDateTimeDetails {

    /**
     *
     * @var departureDate $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     *
     * @var arrivalDate $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

}

class locationDetails {

    /**
     *
     * @var city $city
     * @access public
     */
    public $city = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

}

class otherLocationDetails {

    /**
     *
     * @var city $city
     * @access public
     */
    public $city = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

}

class multiCorporate {

    /**
     *
     * @var corporateId $corporateId
     * @access public
     */
    public $corporateId = null;

}

class corporateId {

    /**
     *
     * @var corporateQualifier $corporateQualifier
     * @access public
     */
    public $corporateQualifier = null;

    /**
     *
     * @var identity $identity
     * @access public
     */
    public $identity = null;

}

class itemNumber {

    /**
     *
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class itemNumberDetails {

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

}

class dateOfFlight {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class dateAndTimeDetails {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var date $date
     * @access public
     */
    public $date = null;

}

class flightQualification {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class fareCategories {

    /**
     *
     * @var fareType $fareType
     * @access public
     */
    public $fareType = null;

    /**
     *
     * @var otherFareType $otherFareType
     * @access public
     */
    public $otherFareType = null;

}

class fareDetails {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

    /**
     *
     * @var fareCategory $fareCategory
     * @access public
     */
    public $fareCategory = null;

}

class additionalFareDetails {

    /**
     *
     * @var rateClass $rateClass
     * @access public
     */
    public $rateClass = null;

    /**
     *
     * @var commodityCategory $commodityCategory
     * @access public
     */
    public $commodityCategory = null;

    /**
     *
     * @var pricingGroup $pricingGroup
     * @access public
     */
    public $pricingGroup = null;

    /**
     *
     * @var secondRateClass $secondRateClass
     * @access public
     */
    public $secondRateClass = null;

}

class discountDetails {

    /**
     *
     * @var fareQualifier $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     *
     * @var rateCategory $rateCategory
     * @access public
     */
    public $rateCategory = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var percentage $percentage
     * @access public
     */
    public $percentage = null;

}

class transportInformation {

    /**
     *
     * @var transportService $transportService
     * @access public
     */
    public $transportService = null;

    /**
     *
     * @var availCabinConf $availCabinConf
     * @access public
     */
    public $availCabinConf = null;

    /**
     *
     * @var routingInfo $routingInfo
     * @access public
     */
    public $routingInfo = null;

    /**
     *
     * @var selectionDetail $selectionDetail
     * @access public
     */
    public $selectionDetail = null;

}

class transportService {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class companyIdentification {

    /**
     *
     * @var marketingCompany $marketingCompany
     * @access public
     */
    public $marketingCompany = null;

    /**
     *
     * @var operatingcompany $operatingcompany
     * @access public
     */
    public $operatingcompany = null;

    /**
     *
     * @var otherCompany $otherCompany
     * @access public
     */
    public $otherCompany = null;

}

class productIdentificationDetails {

    /**
     *
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     *
     * @var operationalSuffix $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

}

class availCabinConf {

    /**
     *
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class routingInfo {

    /**
     *
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class routingDetails {

    /**
     *
     * @var station $station
     * @access public
     */
    public $station = null;

    /**
     *
     * @var otherStation $otherStation
     * @access public
     */
    public $otherStation = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

}

class selectionDetail {

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     *
     * @var selectionDetailsTwo $selectionDetailsTwo
     * @access public
     */
    public $selectionDetailsTwo = null;

}

class selectionDetails {

    /**
     *
     * @var option $option
     * @access public
     */
    public $option = null;

    /**
     *
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class selectionDetailsTwo {

    /**
     *
     * @var option $option
     * @access public
     */
    public $option = null;

    /**
     *
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class tripDescription {

    /**
     *
     * @var origDest $origDest
     * @access public
     */
    public $origDest = null;

    /**
     *
     * @var dateFlightMovement $dateFlightMovement
     * @access public
     */
    public $dateFlightMovement = null;

    /**
     *
     * @var routing $routing
     * @access public
     */
    public $routing = null;

}

class origDest {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class dateFlightMovement {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class routing {

    /**
     *
     * @var routingInfo $routingInfo
     * @access public
     */
    public $routingInfo = null;

    /**
     *
     * @var transportService $transportService
     * @access public
     */
    public $transportService = null;

    /**
     *
     * @var segFareDetails $segFareDetails
     * @access public
     */
    public $segFareDetails = null;

    /**
     *
     * @var pertinentQuantity $pertinentQuantity
     * @access public
     */
    public $pertinentQuantity = null;

    /**
     *
     * @var selectionMakingDetails $selectionMakingDetails
     * @access public
     */
    public $selectionMakingDetails = null;

}

class segFareDetails {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class pertinentQuantity {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     *
     * @var otherQuantityDetails $otherQuantityDetails
     * @access public
     */
    public $otherQuantityDetails = null;

}

class quantityDetails {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     *
     * @var unit $unit
     * @access public
     */
    public $unit = null;

}

class otherQuantityDetails {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     *
     * @var unit $unit
     * @access public
     */
    public $unit = null;

}

class selectionMakingDetails {

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     *
     * @var selectionDetailsTwo $selectionDetailsTwo
     * @access public
     */
    public $selectionDetailsTwo = null;

}

class pricingInfo {

    /**
     *
     * @var numberOfUnits $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     *
     * @var ticketPricingDate $ticketPricingDate
     * @access public
     */
    public $ticketPricingDate = null;

    /**
     *
     * @var fare $fare
     * @access public
     */
    public $fare = null;

}

class numberOfUnits {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     *
     * @var otherQuantityDetails $otherQuantityDetails
     * @access public
     */
    public $otherQuantityDetails = null;

}

class ticketPricingDate {

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class fare {

    /**
     *
     * @var detailsOfFare $detailsOfFare
     * @access public
     */
    public $detailsOfFare = null;

    /**
     *
     * @var fareQualificationDetails $fareQualificationDetails
     * @access public
     */
    public $fareQualificationDetails = null;

}

class detailsOfFare {

    /**
     *
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

}

class fareTypeGrouping {

    /**
     *
     * @var pricingGroup $pricingGroup
     * @access public
     */
    public $pricingGroup = null;

}

class fareQualificationDetails {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class fareRule {

    /**
     *
     * @var tarifFareRule $tarifFareRule
     * @access public
     */
    public $tarifFareRule = null;

    /**
     *
     * @var travellerIdentification $travellerIdentification
     * @access public
     */
    public $travellerIdentification = null;

    /**
     *
     * @var travellerDate $travellerDate
     * @access public
     */
    public $travellerDate = null;

}

class tarifFareRule {

    /**
     *
     * @var tariffClassId $tariffClassId
     * @access public
     */
    public $tariffClassId = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var ruleSectionId $ruleSectionId
     * @access public
     */
    public $ruleSectionId = null;

}

class companyDetails {

    /**
     *
     * @var string $marketingCompany
     * @access public
     */
    public $marketingCompany = null;

    /**
     *
     * @var operatingcompany $operatingcompany
     * @access public
     */
    public $operatingcompany = null;

    /**
     *
     * @var otherCompany $otherCompany
     * @access public
     */
    public $otherCompany = null;

}

class travellerIdentification {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class referenceDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

}

class travellerDate {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class Fare_CheckRulesReply {

    /**
     *
     * @var transactionType $transactionType
     * @access public
     */
    public $transactionType = null;

    /**
     *
     * @var statusInfo $statusInfo
     * @access public
     */
    public $statusInfo = null;

    /**
     *
     * @var fareRouteInfo $fareRouteInfo
     * @access public
     */
    public $fareRouteInfo = null;

    /**
     *
     * @var infoText $infoText
     * @access public
     */
    public $infoText = null;

    /**
     *
     * @var errorInfo $errorInfo
     * @access public
     */
    public $errorInfo = null;

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var flightDetails $flightDetails
     * @access public
     */
    public $flightDetails = null;

}

class transactionType {

    /**
     *
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

}

class statusInfo {

    /**
     *
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

    /**
     *
     * @var otherDetails $otherDetails
     * @access public
     */
    public $otherDetails = null;

}

class statusDetails {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

}

class otherDetails {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

}

class fareRouteInfo {

    /**
     *
     * @var dayOfWeek $dayOfWeek
     * @access public
     */
    public $dayOfWeek = null;

    /**
     *
     * @var fareQualifierDetails $fareQualifierDetails
     * @access public
     */
    public $fareQualifierDetails = null;

    /**
     *
     * @var identificationNumber $identificationNumber
     * @access public
     */
    public $identificationNumber = null;

    /**
     *
     * @var validityPeriod $validityPeriod
     * @access public
     */
    public $validityPeriod = null;

}

class fareQualifierDetails {

    /**
     *
     * @var fareQualifier $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

}

class validityPeriod {

    /**
     *
     * @var firstDate $firstDate
     * @access public
     */
    public $firstDate = null;

    /**
     *
     * @var secondDate $secondDate
     * @access public
     */
    public $secondDate = null;

}

class infoText {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class freeTextQualification {

    /**
     *
     * @var textSubjectQualifier $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     *
     * @var informationType $informationType
     * @access public
     */
    public $informationType = null;

}

class errorInfo {

    /**
     *
     * @var rejectErrorCode $rejectErrorCode
     * @access public
     */
    public $rejectErrorCode = null;

    /**
     *
     * @var errorFreeText $errorFreeText
     * @access public
     */
    public $errorFreeText = null;

}

class rejectErrorCode {

    /**
     *
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class errorDetails {

    /**
     *
     * @var errorCode $errorCode
     * @access public
     */
    public $errorCode = null;

}

class errorFreeText {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class tariffInfo {

    /**
     *
     * @var fareRuleInfo $fareRuleInfo
     * @access public
     */
    public $fareRuleInfo = null;

    /**
     *
     * @var fareRuleText $fareRuleText
     * @access public
     */
    public $fareRuleText = null;

}

class fareRuleInfo {

    /**
     *
     * @var ruleSectionLocalId $ruleSectionLocalId
     * @access public
     */
    public $ruleSectionLocalId = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var ruleCategoryCode $ruleCategoryCode
     * @access public
     */
    public $ruleCategoryCode = null;

}

class fareRuleText {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class flightDetails {

    /**
     *
     * @var nbOfSegments $nbOfSegments
     * @access public
     */
    public $nbOfSegments = null;

    /**
     *
     * @var amountConversion $amountConversion
     * @access public
     */
    public $amountConversion = null;

    /**
     *
     * @var quantityValue $quantityValue
     * @access public
     */
    public $quantityValue = null;

    /**
     *
     * @var pricingAndDateInfo $pricingAndDateInfo
     * @access public
     */
    public $pricingAndDateInfo = null;

    /**
     *
     * @var qualificationFareDetails $qualificationFareDetails
     * @access public
     */
    public $qualificationFareDetails = null;

    /**
     *
     * @var transportService $transportService
     * @access public
     */
    public $transportService = null;

    /**
     *
     * @var flightErrorCode $flightErrorCode
     * @access public
     */
    public $flightErrorCode = null;

    /**
     *
     * @var productInfo $productInfo
     * @access public
     */
    public $productInfo = null;

    /**
     *
     * @var priceInfo $priceInfo
     * @access public
     */
    public $priceInfo = null;

    /**
     *
     * @var fareDetailInfo $fareDetailInfo
     * @access public
     */
    public $fareDetailInfo = null;

    /**
     *
     * @var odiGrp $odiGrp
     * @access public
     */
    public $odiGrp = null;

    /**
     *
     * @var travellerGrp $travellerGrp
     * @access public
     */
    public $travellerGrp = null;

    /**
     *
     * @var fareRouteGrp $fareRouteGrp
     * @access public
     */
    public $fareRouteGrp = null;

    /**
     *
     * @var itemGrp $itemGrp
     * @access public
     */
    public $itemGrp = null;

}

class nbOfSegments {

    /**
     *
     * @var segmentControlDetails $segmentControlDetails
     * @access public
     */
    public $segmentControlDetails = null;

}

class segmentControlDetails {

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var numberOfUnits $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     *
     * @var totalNumberOfItems $totalNumberOfItems
     * @access public
     */
    public $totalNumberOfItems = null;

}

class amountConversion {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class otherConversionRateDetails {

    /**
     *
     * @var conversionType $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var rateType $rateType
     * @access public
     */
    public $rateType = null;

    /**
     *
     * @var pricingAmount $pricingAmount
     * @access public
     */
    public $pricingAmount = null;

    /**
     *
     * @var measurementValue $measurementValue
     * @access public
     */
    public $measurementValue = null;

    /**
     *
     * @var measurementSignificance $measurementSignificance
     * @access public
     */
    public $measurementSignificance = null;

}

class quantityValue {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class pricingAndDateInfo {

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class qualificationFareDetails {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class flightErrorCode {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class productInfo {

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     *
     * @var productErrorCode $productErrorCode
     * @access public
     */
    public $productErrorCode = null;

}

class productDetails {

    /**
     *
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;
    public $identification = null;
    public $classOfService = null;

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class productErrorCode {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class priceInfo {

    /**
     *
     * @var monetaryRates $monetaryRates
     * @access public
     */
    public $monetaryRates = null;

    /**
     *
     * @var taxAmount $taxAmount
     * @access public
     */
    public $taxAmount = null;

    /**
     *
     * @var fareTypeInfo $fareTypeInfo
     * @access public
     */
    public $fareTypeInfo = null;

}

class monetaryRates {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var amountTwo $amountTwo
     * @access public
     */
    public $amountTwo = null;

}

class monetaryDetails {

    /**
     *
     * @var typeQualifier $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class amountTwo {

    /**
     *
     * @var typeQualifier $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class taxAmount {

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class taxDetails {

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     *
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

}

class fareTypeInfo {

    /**
     *
     * @var fareDetailQualif $fareDetailQualif
     * @access public
     */
    public $fareDetailQualif = null;

    /**
     *
     * @var flightMovementDate $flightMovementDate
     * @access public
     */
    public $flightMovementDate = null;

    /**
     *
     * @var faraRulesInfo $faraRulesInfo
     * @access public
     */
    public $faraRulesInfo = null;

    /**
     *
     * @var selectionMakingDetails $selectionMakingDetails
     * @access public
     */
    public $selectionMakingDetails = null;

    /**
     *
     * @var amountConvDetails $amountConvDetails
     * @access public
     */
    public $amountConvDetails = null;

}

class fareDetailQualif {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class flightMovementDate {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class faraRulesInfo {

    /**
     *
     * @var ruleSectionLocalId $ruleSectionLocalId
     * @access public
     */
    public $ruleSectionLocalId = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var ruleCategoryCode $ruleCategoryCode
     * @access public
     */
    public $ruleCategoryCode = null;

}

class amountConvDetails {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class fareDetailInfo {

    /**
     *
     * @var nbOfUnits $nbOfUnits
     * @access public
     */
    public $nbOfUnits = null;

    /**
     *
     * @var pricingPlusDateInfo $pricingPlusDateInfo
     * @access public
     */
    public $pricingPlusDateInfo = null;

    /**
     *
     * @var fareDeatilInfo $fareDeatilInfo
     * @access public
     */
    public $fareDeatilInfo = null;

}

class nbOfUnits {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class pricingPlusDateInfo {

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class fareDeatilInfo {

    /**
     *
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

}

class odiGrp {

    /**
     *
     * @var originDestination $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     *
     * @var flightDateAndTime $flightDateAndTime
     * @access public
     */
    public $flightDateAndTime = null;

    /**
     *
     * @var flightErrorText $flightErrorText
     * @access public
     */
    public $flightErrorText = null;

    /**
     *
     * @var monGrp $monGrp
     * @access public
     */
    public $monGrp = null;

    /**
     *
     * @var routingGrp $routingGrp
     * @access public
     */
    public $routingGrp = null;

    /**
     *
     * @var travelProductGrp $travelProductGrp
     * @access public
     */
    public $travelProductGrp = null;

}

class originDestination {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class flightDateAndTime {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class flightErrorText {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class monGrp {

    /**
     *
     * @var monetaryValues $monetaryValues
     * @access public
     */
    public $monetaryValues = null;

    /**
     *
     * @var fareDetailGrp $fareDetailGrp
     * @access public
     */
    public $fareDetailGrp = null;

}

class monetaryValues {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var amountTwo $amountTwo
     * @access public
     */
    public $amountTwo = null;

}

class fareDetailGrp {

    /**
     *
     * @var fareQualif $fareQualif
     * @access public
     */
    public $fareQualif = null;

    /**
     *
     * @var amountCvtRate $amountCvtRate
     * @access public
     */
    public $amountCvtRate = null;

}

class fareQualif {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class amountCvtRate {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class routingGrp {

    /**
     *
     * @var routingInfo $routingInfo
     * @access public
     */
    public $routingInfo = null;

    /**
     *
     * @var serviceTransport $serviceTransport
     * @access public
     */
    public $serviceTransport = null;

    /**
     *
     * @var qualificationOfFare $qualificationOfFare
     * @access public
     */
    public $qualificationOfFare = null;

    /**
     *
     * @var pertinentQuantity $pertinentQuantity
     * @access public
     */
    public $pertinentQuantity = null;

}

class serviceTransport {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class qualificationOfFare {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class travelProductGrp {

    /**
     *
     * @var travelProductInfo $travelProductInfo
     * @access public
     */
    public $travelProductInfo = null;

    /**
     *
     * @var routingGrp $routingGrp
     * @access public
     */
    public $routingGrp = null;

}

class travelProductInfo {

    /**
     *
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     *
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     *
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     *
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     *
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class flightDate {

    /**
     *
     * @var departureDate $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     *
     * @var arrivalDate $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

}

class boardPointDetails {

    /**
     *
     * @var trueLocationId $trueLocationId
     * @access public
     */
    public $trueLocationId = null;

    /**
     *
     * @var trueLocation $trueLocation
     * @access public
     */
    public $trueLocation = null;

}

class offpointDetails {

    /**
     *
     * @var trueLocationId $trueLocationId
     * @access public
     */
    public $trueLocationId = null;

    /**
     *
     * @var trueLocation $trueLocation
     * @access public
     */
    public $trueLocation = null;

}

class flightIdentification {

    /**
     *
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;
    public $bookingClass = null;

    /**
     *
     * @var operationalSuffix $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

}

class flightTypeDetails {

    /**
     *
     * @var flightIndicator $flightIndicator
     * @access public
     */
    public $flightIndicator = null;

    /**
     *
     * @var secondSequenceNb $secondSequenceNb
     * @access public
     */
    public $secondSequenceNb = null;

}

class marriageDetails {

    /**
     *
     * @var relation $relation
     * @access public
     */
    public $relation = null;

    /**
     *
     * @var marriageIdentifier $marriageIdentifier
     * @access public
     */
    public $marriageIdentifier = null;

    /**
     *
     * @var lineNumber $lineNumber
     * @access public
     */
    public $lineNumber = null;

    /**
     *
     * @var otherRelation $otherRelation
     * @access public
     */
    public $otherRelation = null;

    /**
     *
     * @var carrierCode $carrierCode
     * @access public
     */
    public $carrierCode = null;

}

class transportServiceChange {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class travellerGrp {

    /**
     *
     * @var travellerIdentRef $travellerIdentRef
     * @access public
     */
    public $travellerIdentRef = null;

    /**
     *
     * @var fareRulesDetails $fareRulesDetails
     * @access public
     */
    public $fareRulesDetails = null;

    /**
     *
     * @var flightMovementDateInfo $flightMovementDateInfo
     * @access public
     */
    public $flightMovementDateInfo = null;

}

class travellerIdentRef {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class fareRulesDetails {

    /**
     *
     * @var tariffClassId $tariffClassId
     * @access public
     */
    public $tariffClassId = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var ruleSectionId $ruleSectionId
     * @access public
     */
    public $ruleSectionId = null;

}

class flightMovementDateInfo {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class fareRouteGrp {

    /**
     *
     * @var fareRouteInfo $fareRouteInfo
     * @access public
     */
    public $fareRouteInfo = null;

    /**
     *
     * @var journeyGrp $journeyGrp
     * @access public
     */
    public $journeyGrp = null;

}

class journeyGrp {

    /**
     *
     * @var journeyOriginAndDestination $journeyOriginAndDestination
     * @access public
     */
    public $journeyOriginAndDestination = null;

    /**
     *
     * @var journeyProductGrp $journeyProductGrp
     * @access public
     */
    public $journeyProductGrp = null;

}

class journeyOriginAndDestination {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class journeyProductGrp {

    /**
     *
     * @var journeyProductInfo $journeyProductInfo
     * @access public
     */
    public $journeyProductInfo = null;

    /**
     *
     * @var journeyRoutingGrp $journeyRoutingGrp
     * @access public
     */
    public $journeyRoutingGrp = null;

}

class journeyProductInfo {

    /**
     *
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     *
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     *
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     *
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     *
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class journeyRoutingGrp {

    /**
     *
     * @var journeyRoutingInfo $journeyRoutingInfo
     * @access public
     */
    public $journeyRoutingInfo = null;

    /**
     *
     * @var journeyTransportService $journeyTransportService
     * @access public
     */
    public $journeyTransportService = null;

}

class journeyRoutingInfo {

    /**
     *
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class journeyTransportService {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class itemGrp {

    /**
     *
     * @var itemNb $itemNb
     * @access public
     */
    public $itemNb = null;

    /**
     *
     * @var productAvailabilityStatus $productAvailabilityStatus
     * @access public
     */
    public $productAvailabilityStatus = null;

    /**
     *
     * @var quantityItem $quantityItem
     * @access public
     */
    public $quantityItem = null;

    /**
     *
     * @var transportServiceItem $transportServiceItem
     * @access public
     */
    public $transportServiceItem = null;

    /**
     *
     * @var freeTextItem $freeTextItem
     * @access public
     */
    public $freeTextItem = null;

    /**
     *
     * @var fareQualifItem $fareQualifItem
     * @access public
     */
    public $fareQualifItem = null;

    /**
     *
     * @var originDestinationGrp $originDestinationGrp
     * @access public
     */
    public $originDestinationGrp = null;

    /**
     *
     * @var unitGrp $unitGrp
     * @access public
     */
    public $unitGrp = null;

    /**
     *
     * @var monetaryGrp $monetaryGrp
     * @access public
     */
    public $monetaryGrp = null;

    /**
     *
     * @var farerouteGrp $farerouteGrp
     * @access public
     */
    public $farerouteGrp = null;

}

class itemNb {

    /**
     *
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class productAvailabilityStatus {

    /**
     *
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class quantityItem {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class transportServiceItem {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class freeTextItem {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class fareQualifItem {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class originDestinationGrp {

    /**
     *
     * @var originDestOfJourney $originDestOfJourney
     * @access public
     */
    public $originDestOfJourney = null;

    /**
     *
     * @var dateForMovements $dateForMovements
     * @access public
     */
    public $dateForMovements = null;

    /**
     *
     * @var routingForJourney $routingForJourney
     * @access public
     */
    public $routingForJourney = null;

}

class originDestOfJourney {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class dateForMovements {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class routingForJourney {

    /**
     *
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class unitGrp {

    /**
     *
     * @var nbOfUnits $nbOfUnits
     * @access public
     */
    public $nbOfUnits = null;

    /**
     *
     * @var unitPricingAndDateInfo $unitPricingAndDateInfo
     * @access public
     */
    public $unitPricingAndDateInfo = null;

    /**
     *
     * @var unitFareDetails $unitFareDetails
     * @access public
     */
    public $unitFareDetails = null;

}

class unitPricingAndDateInfo {

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class unitFareDetails {

    /**
     *
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

}

class monetaryGrp {

    /**
     *
     * @var monetaryValues $monetaryValues
     * @access public
     */
    public $monetaryValues = null;

    /**
     *
     * @var monetFareRuleValues $monetFareRuleValues
     * @access public
     */
    public $monetFareRuleValues = null;

    /**
     *
     * @var monetTravellerRef $monetTravellerRef
     * @access public
     */
    public $monetTravellerRef = null;

    /**
     *
     * @var monetTicketPriceAndDate $monetTicketPriceAndDate
     * @access public
     */
    public $monetTicketPriceAndDate = null;

    /**
     *
     * @var monetTaxValues $monetTaxValues
     * @access public
     */
    public $monetTaxValues = null;

    /**
     *
     * @var qualifGrp $qualifGrp
     * @access public
     */
    public $qualifGrp = null;

}

class monetFareRuleValues {

    /**
     *
     * @var ruleSectionLocalId $ruleSectionLocalId
     * @access public
     */
    public $ruleSectionLocalId = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var ruleCategoryCode $ruleCategoryCode
     * @access public
     */
    public $ruleCategoryCode = null;

}

class monetTravellerRef {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class monetTicketPriceAndDate {

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class monetTaxValues {

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class qualifGrp {

    /**
     *
     * @var qualificationFare $qualificationFare
     * @access public
     */
    public $qualificationFare = null;

    /**
     *
     * @var qualifSelection $qualifSelection
     * @access public
     */
    public $qualifSelection = null;

    /**
     *
     * @var qualifDateFlightMovement $qualifDateFlightMovement
     * @access public
     */
    public $qualifDateFlightMovement = null;

    /**
     *
     * @var qualifConversionRate $qualifConversionRate
     * @access public
     */
    public $qualifConversionRate = null;

}

class qualificationFare {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class qualifSelection {

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     *
     * @var selectionDetailsTwo $selectionDetailsTwo
     * @access public
     */
    public $selectionDetailsTwo = null;

}

class qualifDateFlightMovement {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class qualifConversionRate {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class farerouteGrp2 {

    /**
     *
     * @var infoForFareRoute $infoForFareRoute
     * @access public
     */
    public $infoForFareRoute = null;

    /**
     *
     * @var farerouteTransportService $farerouteTransportService
     * @access public
     */
    public $farerouteTransportService = null;

    /**
     *
     * @var finalOdiGrp $finalOdiGrp
     * @access public
     */
    public $finalOdiGrp = null;

}

class infoForFareRoute {

    /**
     *
     * @var dayOfWeek $dayOfWeek
     * @access public
     */
    public $dayOfWeek = null;

    /**
     *
     * @var fareQualifierDetails $fareQualifierDetails
     * @access public
     */
    public $fareQualifierDetails = null;

    /**
     *
     * @var identificationNumber $identificationNumber
     * @access public
     */
    public $identificationNumber = null;

    /**
     *
     * @var validityPeriod $validityPeriod
     * @access public
     */
    public $validityPeriod = null;

}

class farerouteTransportService {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class finalOdiGrp {

    /**
     *
     * @var finalOriginDestination $finalOriginDestination
     * @access public
     */
    public $finalOriginDestination = null;

    /**
     *
     * @var lastOdiRoutingInfo $lastOdiRoutingInfo
     * @access public
     */
    public $lastOdiRoutingInfo = null;

    /**
     *
     * @var lastOdiDateFlightMovement $lastOdiDateFlightMovement
     * @access public
     */
    public $lastOdiDateFlightMovement = null;

}

class finalOriginDestination {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class lastOdiRoutingInfo {

    /**
     *
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class lastOdiDateFlightMovement {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class Fare_MasterPricerTravelBoardSearch {

    /**
     *
     * @var numberOfUnit $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     *
     * @var globalOptions $globalOptions
     * @access public
     */
    public $globalOptions = null;

    /**
     *
     * @var paxReference $paxReference
     * @access public
     */
    public $paxReference = null;

    /**
     *
     * @var customerRef $customerRef
     * @access public
     */
    public $customerRef = null;

    /**
     *
     * @var formOfPaymentByPassenger $formOfPaymentByPassenger
     * @access public
     */
    public $formOfPaymentByPassenger = null;

    /**
     *
     * @var fareFamilies $fareFamilies
     * @access public
     */
    public $fareFamilies = null;

    /**
     *
     * @var fareOptions $fareOptions
     * @access public
     */
    public $fareOptions = null;

    /**
     *
     * @var priceToBeat $priceToBeat
     * @access public
     */
    public $priceToBeat = null;

    /**
     *
     * @var taxInfo $taxInfo
     * @access public
     */
    public $taxInfo = null;

    /**
     *
     * @var travelFlightInfo $travelFlightInfo
     * @access public
     */
    public $travelFlightInfo = null;

    /**
     *
     * @var itinerary $itinerary
     * @access public
     */
    public $itinerary = null;

    /**
     *
     * @var ticketChangeInfo $ticketChangeInfo
     * @access public
     */
    public $ticketChangeInfo = null;

    /**
     *
     * @var combinationFareFamilies $combinationFareFamilies
     * @access public
     */
    public $combinationFareFamilies = null;

    /**
     *
     * @var feeOption $feeOption
     * @access public
     */
    public $feeOption = null;

    /**
     *
     * @var officeIdDetails $officeIdDetails
     * @access public
     */
    public $officeIdDetails = null;

}

class numberOfUnit {

    /**
     *
     * @var unitNumberDetail $unitNumberDetail
     * @access public
     */
    public $unitNumberDetail = null;

}

class unitNumberDetail {

    /**
     *
     * @var numberOfUnits $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     *
     * @var typeOfUnit $typeOfUnit
     * @access public
     */
    public $typeOfUnit = null;

}

class globalOptions {

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

}

class paxReference {

    /**
     *
     * @var ptc $ptc
     * @access public
     */
    public $ptc = null;

    /**
     *
     * @var traveller $traveller
     * @access public
     */
    public $traveller = null;

}

class traveller {

    /**
     *
     * @var ref $ref
     * @access public
     */
    public $ref = null;
    public $surname = null;
    public $quantity = null;

    /**
     *
     * @var infantIndicator $infantIndicator
     * @access public
     */
    public $infantIndicator = null;

}

class customerRef {

    /**
     *
     * @var customerReferences $customerReferences
     * @access public
     */
    public $customerReferences = null;

}

class customerReferences {

    /**
     *
     * @var referenceQualifier $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     *
     * @var referenceNumber $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

    /**
     *
     * @var referencePartyName $referencePartyName
     * @access public
     */
    public $referencePartyName = null;

    /**
     *
     * @var travellerReferenceNbr $travellerReferenceNbr
     * @access public
     */
    public $travellerReferenceNbr = null;

}

class formOfPaymentByPassenger {

    /**
     *
     * @var formOfPaymentDetails $formOfPaymentDetails
     * @access public
     */
    public $formOfPaymentDetails = null;

    /**
     *
     * @var passengerFeeReference $passengerFeeReference
     * @access public
     */
    public $passengerFeeReference = null;

}

class formOfPaymentDetails {

    /**
     *
     * @var formOfPaymentDetails $formOfPaymentDetails
     * @access public
     */
    public $formOfPaymentDetails = null;

}

class passengerFeeReference {

    /**
     *
     * @var passengerFeeRefType $passengerFeeRefType
     * @access public
     */
    public $passengerFeeRefType = null;

    /**
     *
     * @var passengerFeeRefNumber $passengerFeeRefNumber
     * @access public
     */
    public $passengerFeeRefNumber = null;

    /**
     *
     * @var otherCharacteristics $otherCharacteristics
     * @access public
     */
    public $otherCharacteristics = null;

}

class otherCharacteristics {

    /**
     *
     * @var passengerFeeRefQualif $passengerFeeRefQualif
     * @access public
     */
    public $passengerFeeRefQualif = null;

}

class fareFamilies {

    /**
     *
     * @var familyInformation $familyInformation
     * @access public
     */
    public $familyInformation = null;

    /**
     *
     * @var familyCriteria $familyCriteria
     * @access public
     */
    public $familyCriteria = null;

    /**
     *
     * @var fareFamilySegment $fareFamilySegment
     * @access public
     */
    public $fareFamilySegment = null;

    /**
     *
     * @var otherPossibleCriteria $otherPossibleCriteria
     * @access public
     */
    public $otherPossibleCriteria = null;

}

class familyInformation {

    /**
     *
     * @var refNumber $refNumber
     * @access public
     */
    public $refNumber = null;

    /**
     *
     * @var fareFamilyname $fareFamilyname
     * @access public
     */
    public $fareFamilyname = null;

    /**
     *
     * @var hierarchy $hierarchy
     * @access public
     */
    public $hierarchy = null;

    /**
     *
     * @var commercialFamilyDetails $commercialFamilyDetails
     * @access public
     */
    public $commercialFamilyDetails = null;

}

class commercialFamilyDetails {

    /**
     *
     * @var commercialFamily $commercialFamily
     * @access public
     */
    public $commercialFamily = null;

}

class familyCriteria {

    /**
     *
     * @var carrierId $carrierId
     * @access public
     */
    public $carrierId = null;

    /**
     *
     * @var rdb $rdb
     * @access public
     */
    public $rdb = null;

    /**
     *
     * @var fareFamilyInfo $fareFamilyInfo
     * @access public
     */
    public $fareFamilyInfo = null;

    /**
     *
     * @var fareProductDetail $fareProductDetail
     * @access public
     */
    public $fareProductDetail = null;

    /**
     *
     * @var corporateInfo $corporateInfo
     * @access public
     */
    public $corporateInfo = null;

    /**
     *
     * @var cabinProduct $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     *
     * @var cabinProcessingIdentifier $cabinProcessingIdentifier
     * @access public
     */
    public $cabinProcessingIdentifier = null;

    /**
     *
     * @var dateTimeDetails $dateTimeDetails
     * @access public
     */
    public $dateTimeDetails = null;

    /**
     *
     * @var otherCriteria $otherCriteria
     * @access public
     */
    public $otherCriteria = null;

}

class fareFamilyInfo {

    /**
     *
     * @var fareFamilyQual $fareFamilyQual
     * @access public
     */
    public $fareFamilyQual = null;

}

class fareProductDetail {

    /**
     *
     * @var fareBasis $fareBasis
     * @access public
     */
    public $fareBasis = null;

    /**
     *
     * @var fareType $fareType
     * @access public
     */
    public $fareType = null;

}

class corporateInfo {

    /**
     *
     * @var corporateNumberIdentifier $corporateNumberIdentifier
     * @access public
     */
    public $corporateNumberIdentifier = null;

    /**
     *
     * @var corporateName $corporateName
     * @access public
     */
    public $corporateName = null;

}

class cabinProduct {

    /**
     *
     * @var cabinDesignator $cabinDesignator
     * @access public
     */
    public $cabinDesignator = null;

}

class dateTimeDetails {

    /**
     *
     * @var date $date
     * @access public
     */
    public $date = null;

    /**
     *
     * @var otherDate $otherDate
     * @access public
     */
    public $otherDate = null;

}

class otherCriteria {

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

}

class fareFamilySegment {

    /**
     *
     * @var referenceInfo $referenceInfo
     * @access public
     */
    public $referenceInfo = null;

    /**
     *
     * @var familyCriteria $familyCriteria
     * @access public
     */
    public $familyCriteria = null;

}

class referenceInfo {

    /**
     *
     * @var referencingDetail $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class referencingDetail {

    /**
     *
     * @var refQualifier $refQualifier
     * @access public
     */
    public $refQualifier = null;

    /**
     *
     * @var refNumber $refNumber
     * @access public
     */
    public $refNumber = null;

}

class otherPossibleCriteria {

    /**
     *
     * @var logicalLink $logicalLink
     * @access public
     */
    public $logicalLink = null;

    /**
     *
     * @var familyCriteria $familyCriteria
     * @access public
     */
    public $familyCriteria = null;

    /**
     *
     * @var fareFamilySegment $fareFamilySegment
     * @access public
     */
    public $fareFamilySegment = null;

}

class logicalLink {

    /**
     *
     * @var booleanExpression $booleanExpression
     * @access public
     */
    public $booleanExpression = null;

}

class booleanExpression {

    /**
     *
     * @var codeOperator $codeOperator
     * @access public
     */
    public $codeOperator = null;

}

class fareOptions {

    /**
     *
     * @var pricingTickInfo $pricingTickInfo
     * @access public
     */
    public $pricingTickInfo = null;

    /**
     *
     * @var corporate $corporate
     * @access public
     */
    public $corporate = null;

    /**
     *
     * @var ticketingPriceScheme $ticketingPriceScheme
     * @access public
     */
    public $ticketingPriceScheme = null;

    /**
     *
     * @var feeIdDescription $feeIdDescription
     * @access public
     */
    public $feeIdDescription = null;

    /**
     *
     * @var conversionRate $conversionRate
     * @access public
     */
    public $conversionRate = null;

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     *
     * @var frequentTravellerInfo $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     *
     * @var monetaryCabinInfo $monetaryCabinInfo
     * @access public
     */
    public $monetaryCabinInfo = null;

}

class pricingTicketing {

    /**
     *
     * @var priceType $priceType
     * @access public
     */
    public $priceType = null;

}

class ticketingDate {

    /**
     *
     * @var date $date
     * @access public
     */
    public $date = null;

    /**
     *
     * @var rtcDate $rtcDate
     * @access public
     */
    public $rtcDate = null;

}

class companyId {

}

class sellingPoint {

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

}

class ticketingPoint {

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

}

class journeyOriginPoint {

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

}

class corporate {

    /**
     *
     * @var corporateId $corporateId
     * @access public
     */
    public $corporateId = null;

}

class ticketingPriceScheme {

    /**
     *
     * @var referenceNumber $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class feeIdDescription {

    /**
     *
     * @var feeId $feeId
     * @access public
     */
    public $feeId = null;

}

class feeId {

    /**
     *
     * @var feeType $feeType
     * @access public
     */
    public $feeType = null;

    /**
     *
     * @var feeIdNumber $feeIdNumber
     * @access public
     */
    public $feeIdNumber = null;

}

class conversionRateDetail {

    /**
     *
     * @var conversionType $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class formOfPayment {

    /**
     *
     * @var formOfPaymentDetails $formOfPaymentDetails
     * @access public
     */
    public $formOfPaymentDetails = null;
    public $fop = null;

}

class frequentTravellerInfo {

    /**
     *
     * @var frequentTravellerDetails $frequentTravellerDetails
     * @access public
     */
    public $frequentTravellerDetails = null;

}

class frequentTravellerDetails {

    /**
     *
     * @var carrier $carrier
     * @access public
     */
    public $carrier = null;

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var customerReference $customerReference
     * @access public
     */
    public $customerReference = null;

    /**
     *
     * @var tierLevel $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     *
     * @var tierDescription $tierDescription
     * @access public
     */
    public $tierDescription = null;

}

class monetaryCabinInfo {

    /**
     *
     * @var moneyAndCabinInfo $moneyAndCabinInfo
     * @access public
     */
    public $moneyAndCabinInfo = null;

}

class moneyAndCabinInfo {

    /**
     *
     * @var amountType $amountType
     * @access public
     */
    public $amountType = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var cabinClassDesignator $cabinClassDesignator
     * @access public
     */
    public $cabinClassDesignator = null;

}

class priceToBeat {

    /**
     *
     * @var moneyInfo $moneyInfo
     * @access public
     */
    public $moneyInfo = null;

    /**
     *
     * @var additionalMoneyInfo $additionalMoneyInfo
     * @access public
     */
    public $additionalMoneyInfo = null;

}

class moneyInfo {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class additionalMoneyInfo {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

}

class taxInfo {

    /**
     *
     * @var withholdTaxSurcharge $withholdTaxSurcharge
     * @access public
     */
    public $withholdTaxSurcharge = null;

    /**
     *
     * @var taxDetail $taxDetail
     * @access public
     */
    public $taxDetail = null;

}

class taxDetail {

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var amountQualifier $amountQualifier
     * @access public
     */
    public $amountQualifier = null;

}

class travelFlightInfo {

    /**
     *
     * @var cabinId $cabinId
     * @access public
     */
    public $cabinId = null;

    /**
     *
     * @var companyIdentity $companyIdentity
     * @access public
     */
    public $companyIdentity = null;

    /**
     *
     * @var flightDetail $flightDetail
     * @access public
     */
    public $flightDetail = null;

    /**
     *
     * @var inclusionDetail $inclusionDetail
     * @access public
     */
    public $inclusionDetail = null;

    /**
     *
     * @var exclusionDetail $exclusionDetail
     * @access public
     */
    public $exclusionDetail = null;

    /**
     *
     * @var unitNumberDetail $unitNumberDetail
     * @access public
     */
    public $unitNumberDetail = null;

}

class cabinId {

    /**
     *
     * @var cabinQualifier $cabinQualifier
     * @access public
     */
    public $cabinQualifier = null;

    /**
     *
     * @var cabin $cabin
     * @access public
     */
    public $cabin = null;

}

class companyIdentity {

    /**
     *
     * @var carrierQualifier $carrierQualifier
     * @access public
     */
    public $carrierQualifier = null;

    /**
     *
     * @var carrierId $carrierId
     * @access public
     */
    public $carrierId = null;

}

class flightDetail {

    /**
     *
     * @var flightType $flightType
     * @access public
     */
    public $flightType = null;

}

class inclusionDetail {

    /**
     *
     * @var inclusionIdentifier $inclusionIdentifier
     * @access public
     */
    public $inclusionIdentifier = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

}

class exclusionDetail {

    /**
     *
     * @var exclusionIdentifier $exclusionIdentifier
     * @access public
     */
    public $exclusionIdentifier = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

}

class itinerary {

    /**
     *
     * @var requestedSegmentRef $requestedSegmentRef
     * @access public
     */
    public $requestedSegmentRef = null;

    /**
     *
     * @var departureLocalization $departureLocalization
     * @access public
     */
    public $departureLocalization = null;

    /**
     *
     * @var arrivalLocalization $arrivalLocalization
     * @access public
     */
    public $arrivalLocalization = null;

    /**
     *
     * @var timeDetails $timeDetails
     * @access public
     */
    public $timeDetails = null;

    /**
     *
     * @var flightInfo $flightInfo
     * @access public
     */
    public $flightInfo = null;

    /**
     *
     * @var flightInfoPNR $flightInfoPNR
     * @access public
     */
    public $flightInfoPNR = null;

    /**
     *
     * @var requestedSegmentAction $requestedSegmentAction
     * @access public
     */
    public $requestedSegmentAction = null;

    /**
     *
     * @var attributes $attributes
     * @access public
     */
    public $attributes = null;

}

class requestedSegmentRef {

    /**
     *
     * @var segRef $segRef
     * @access public
     */
    public $segRef = null;

    /**
     *
     * @var locationForcing $locationForcing
     * @access public
     */
    public $locationForcing = null;

}

class locationForcing {

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     *
     * @var segmentNumber $segmentNumber
     * @access public
     */
    public $segmentNumber = null;

}

class departureLocalization {

    /**
     *
     * @var departurePoint $departurePoint
     * @access public
     */
    public $departurePoint = null;

    /**
     *
     * @var depMultiCity $depMultiCity
     * @access public
     */
    public $depMultiCity = null;

    /**
     *
     * @var firstPnrSegmentRef $firstPnrSegmentRef
     * @access public
     */
    public $firstPnrSegmentRef = null;

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class departurePoint {

    /**
     *
     * @var distance $distance
     * @access public
     */
    public $distance = null;

    /**
     *
     * @var distanceUnit $distanceUnit
     * @access public
     */
    public $distanceUnit = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     *
     * @var latitude $latitude
     * @access public
     */
    public $latitude = null;

    /**
     *
     * @var longitude $longitude
     * @access public
     */
    public $longitude = null;

}

class depMultiCity {

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

}

class firstPnrSegmentRef {

    /**
     *
     * @var pnrSegmentTattoo $pnrSegmentTattoo
     * @access public
     */
    public $pnrSegmentTattoo = null;

    /**
     *
     * @var pnrSegmentQualifier $pnrSegmentQualifier
     * @access public
     */
    public $pnrSegmentQualifier = null;

}

class attributeDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;
    public $attributeType = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

}

class arrivalLocalization {

    /**
     *
     * @var arrivalPointDetails $arrivalPointDetails
     * @access public
     */
    public $arrivalPointDetails = null;

    /**
     *
     * @var arrivalMultiCity $arrivalMultiCity
     * @access public
     */
    public $arrivalMultiCity = null;

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class arrivalPointDetails {

    /**
     *
     * @var distance $distance
     * @access public
     */
    public $distance = null;

    /**
     *
     * @var distanceUnit $distanceUnit
     * @access public
     */
    public $distanceUnit = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     *
     * @var latitude $latitude
     * @access public
     */
    public $latitude = null;

    /**
     *
     * @var longitude $longitude
     * @access public
     */
    public $longitude = null;

}

class arrivalMultiCity {

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

}

class timeDetails {

    /**
     *
     * @var firstDateTimeDetail $firstDateTimeDetail
     * @access public
     */
    public $firstDateTimeDetail = null;

    /**
     *
     * @var rangeOfDate $rangeOfDate
     * @access public
     */
    public $rangeOfDate = null;

    /**
     *
     * @var tripDetails $tripDetails
     * @access public
     */
    public $tripDetails = null;

}

class firstDateTimeDetail {

    /**
     *
     * @var timeQualifier $timeQualifier
     * @access public
     */
    public $timeQualifier = null;

    /**
     *
     * @var date $date
     * @access public
     */
    public $date = null;

    /**
     *
     * @var time $time
     * @access public
     */
    public $time = null;

    /**
     *
     * @var timeWindow $timeWindow
     * @access public
     */
    public $timeWindow = null;

}

class rangeOfDate {

    /**
     *
     * @var rangeQualifier $rangeQualifier
     * @access public
     */
    public $rangeQualifier = null;

    /**
     *
     * @var dayInterval $dayInterval
     * @access public
     */
    public $dayInterval = null;

    /**
     *
     * @var timeAtdestination $timeAtdestination
     * @access public
     */
    public $timeAtdestination = null;

}

class tripDetails {

    /**
     *
     * @var flexibilityQualifier $flexibilityQualifier
     * @access public
     */
    public $flexibilityQualifier = null;

    /**
     *
     * @var tripInterval $tripInterval
     * @access public
     */
    public $tripInterval = null;

    /**
     *
     * @var tripDuration $tripDuration
     * @access public
     */
    public $tripDuration = null;

}

class flightInfo {

    /**
     *
     * @var cabinId $cabinId
     * @access public
     */
    public $cabinId = null;

    /**
     *
     * @var companyIdentity $companyIdentity
     * @access public
     */
    public $companyIdentity = null;

    /**
     *
     * @var flightDetail $flightDetail
     * @access public
     */
    public $flightDetail = null;

    /**
     *
     * @var inclusionDetail $inclusionDetail
     * @access public
     */
    public $inclusionDetail = null;

    /**
     *
     * @var exclusionDetail $exclusionDetail
     * @access public
     */
    public $exclusionDetail = null;

    /**
     *
     * @var unitNumberDetail $unitNumberDetail
     * @access public
     */
    public $unitNumberDetail = null;

}

class flightInfoPNR {

    /**
     *
     * @var travelResponseDetails $travelResponseDetails
     * @access public
     */
    public $travelResponseDetails = null;

    /**
     *
     * @var timeTableDate $timeTableDate
     * @access public
     */
    public $timeTableDate = null;

    /**
     *
     * @var terminalEquipmentDetails $terminalEquipmentDetails
     * @access public
     */
    public $terminalEquipmentDetails = null;

    /**
     *
     * @var codeshareData $codeshareData
     * @access public
     */
    public $codeshareData = null;

    /**
     *
     * @var disclosure $disclosure
     * @access public
     */
    public $disclosure = null;

    /**
     *
     * @var stopDetails $stopDetails
     * @access public
     */
    public $stopDetails = null;

    /**
     *
     * @var trafficRestrictionData $trafficRestrictionData
     * @access public
     */
    public $trafficRestrictionData = null;

    /**
     *
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     *
     * @var incidentalStopInfo $incidentalStopInfo
     * @access public
     */
    public $incidentalStopInfo = null;

}

class travelResponseDetails {

    /**
     *
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     *
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     *
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     *
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

}

class timeTableDate {

    /**
     *
     * @var beginDateTime $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     *
     * @var endDateTime $endDateTime
     * @access public
     */
    public $endDateTime = null;

    /**
     *
     * @var frequency $frequency
     * @access public
     */
    public $frequency = null;

}

class beginDateTime {

    /**
     *
     * @var year $year
     * @access public
     */
    public $year = null;

    /**
     *
     * @var month $month
     * @access public
     */
    public $month = null;

    /**
     *
     * @var day $day
     * @access public
     */
    public $day = null;

}

class endDateTime {

    /**
     *
     * @var year $year
     * @access public
     */
    public $year = null;

    /**
     *
     * @var month $month
     * @access public
     */
    public $month = null;

    /**
     *
     * @var day $day
     * @access public
     */
    public $day = null;

}

class frequency {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

}

class terminalEquipmentDetails {

    /**
     *
     * @var legDetails $legDetails
     * @access public
     */
    public $legDetails = null;

    /**
     *
     * @var departureStationInfo $departureStationInfo
     * @access public
     */
    public $departureStationInfo = null;

    /**
     *
     * @var arrivalStationInfo $arrivalStationInfo
     * @access public
     */
    public $arrivalStationInfo = null;

    /**
     *
     * @var mileageTimeDetails $mileageTimeDetails
     * @access public
     */
    public $mileageTimeDetails = null;

}

class legDetails {

    /**
     *
     * @var equipment $equipment
     * @access public
     */
    public $equipment = null;

    /**
     *
     * @var duration $duration
     * @access public
     */
    public $duration = null;

    /**
     *
     * @var complexingFlightIndicator $complexingFlightIndicator
     * @access public
     */
    public $complexingFlightIndicator = null;

}

class departureStationInfo {

    /**
     *
     * @var terminal $terminal
     * @access public
     */
    public $terminal = null;

}

class arrivalStationInfo {

    /**
     *
     * @var terminal $terminal
     * @access public
     */
    public $terminal = null;

}

class mileageTimeDetails {

    /**
     *
     * @var elapsedGroundTime $elapsedGroundTime
     * @access public
     */
    public $elapsedGroundTime = null;

}

class codeshareData {

    /**
     *
     * @var codeshareDetails $codeshareDetails
     * @access public
     */
    public $codeshareDetails = null;

    /**
     *
     * @var otherCodeshareDetails $otherCodeshareDetails
     * @access public
     */
    public $otherCodeshareDetails = null;

}

class codeshareDetails {

    /**
     *
     * @var transportStageQualifier $transportStageQualifier
     * @access public
     */
    public $transportStageQualifier = null;

    /**
     *
     * @var airlineDesignator $airlineDesignator
     * @access public
     */
    public $airlineDesignator = null;

    /**
     *
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     *
     * @var operationalSuffix $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

}

class otherCodeshareDetails {

    /**
     *
     * @var transportStageQualifier $transportStageQualifier
     * @access public
     */
    public $transportStageQualifier = null;

    /**
     *
     * @var airlineDesignator $airlineDesignator
     * @access public
     */
    public $airlineDesignator = null;

    /**
     *
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     *
     * @var operationalSuffix $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

}

class disclosure {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class freeTextDetails {

    /**
     *
     * @var textSubjectQualifier $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     *
     * @var informationType $informationType
     * @access public
     */
    public $informationType = null;

    /**
     *
     * @var source $source
     * @access public
     */
    public $source = null;

    /**
     *
     * @var encoding $encoding
     * @access public
     */
    public $encoding = null;

}

class stopDetails {

    /**
     *
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class trafficRestrictionData {

    /**
     *
     * @var trafficRestrictionDetails $trafficRestrictionDetails
     * @access public
     */
    public $trafficRestrictionDetails = null;

}

class trafficRestrictionDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

}

class reservationInfo {

    /**
     *
     * @var booking $booking
     * @access public
     */
    public $booking = null;

    /**
     *
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var dateTimeDetails $dateTimeDetails
     * @access public
     */
    public $dateTimeDetails = null;

    /**
     *
     * @var designator $designator
     * @access public
     */
    public $designator = null;

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var productTypeDetails $productTypeDetails
     * @access public
     */
    public $productTypeDetails = null;

}

class productTypeDetails {

    /**
     *
     * @var sequenceNumber $sequenceNumber
     * @access public
     */
    public $sequenceNumber = null;

    /**
     *
     * @var availabilityContext $availabilityContext
     * @access public
     */
    public $availabilityContext = null;

}

class incidentalStopInfo {

    /**
     *
     * @var dateTimeInfo $dateTimeInfo
     * @access public
     */
    public $dateTimeInfo = null;

}

class dateTimeInfo {

    /**
     *
     * @var dateTimeDetails $dateTimeDetails
     * @access public
     */
    public $dateTimeDetails = null;

}

class requestedSegmentAction {

    /**
     *
     * @var actionRequestCode $actionRequestCode
     * @access public
     */
    public $actionRequestCode = null;

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

}

class attributes {

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class ticketChangeInfo {

    /**
     *
     * @var ticketNumberDetails $ticketNumberDetails
     * @access public
     */
    public $ticketNumberDetails = null;

    /**
     *
     * @var ticketRequestedSegments $ticketRequestedSegments
     * @access public
     */
    public $ticketRequestedSegments = null;

}

class ticketNumberDetails {

    /**
     *
     * @var documentDetails $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class documentDetails {

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

}

class ticketRequestedSegments {

    /**
     *
     * @var actionIdentification $actionIdentification
     * @access public
     */
    public $actionIdentification = null;

    /**
     *
     * @var connectPointDetails $connectPointDetails
     * @access public
     */
    public $connectPointDetails = null;

}

class actionIdentification {

    /**
     *
     * @var actionRequestCode $actionRequestCode
     * @access public
     */
    public $actionRequestCode = null;

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

}

class connectPointDetails {

    /**
     *
     * @var connectionDetails $connectionDetails
     * @access public
     */
    public $connectionDetails = null;

}

class connectionDetails {

    /**
     *
     * @var location $location
     * @access public
     */
    public $location = null;

}

class combinationFareFamilies {

    /**
     *
     * @var itemFFCNumber $itemFFCNumber
     * @access public
     */
    public $itemFFCNumber = null;

    /**
     *
     * @var nbOfUnits $nbOfUnits
     * @access public
     */
    public $nbOfUnits = null;

    /**
     *
     * @var referenceInfo $referenceInfo
     * @access public
     */
    public $referenceInfo = null;

}

class itemFFCNumber {

    /**
     *
     * @var itemNumberId $itemNumberId
     * @access public
     */
    public $itemNumberId = null;

}

class itemNumberId {

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var responsibleAgency $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

}

class feeOption {

    /**
     *
     * @var feeTypeInfo $feeTypeInfo
     * @access public
     */
    public $feeTypeInfo = null;

    /**
     *
     * @var rateTax $rateTax
     * @access public
     */
    public $rateTax = null;

    /**
     *
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class feeTypeInfo {

    /**
     *
     * @var carrierFeeDetails $carrierFeeDetails
     * @access public
     */
    public $carrierFeeDetails = null;

    /**
     *
     * @var otherSelectionDetails $otherSelectionDetails
     * @access public
     */
    public $otherSelectionDetails = null;

}

class carrierFeeDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class otherSelectionDetails {

    /**
     *
     * @var option $option
     * @access public
     */
    public $option = null;

    /**
     *
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class rateTax {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class feeDetails {

    /**
     *
     * @var feeInfo $feeInfo
     * @access public
     */
    public $feeInfo = null;

    /**
     *
     * @var associatedAmounts $associatedAmounts
     * @access public
     */
    public $associatedAmounts = null;

    /**
     *
     * @var feeDescriptionGrp $feeDescriptionGrp
     * @access public
     */
    public $feeDescriptionGrp = null;

}

class feeInfo {

    /**
     *
     * @var dataTypeInformation $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     *
     * @var dataInformation $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class dataTypeInformation {

    /**
     *
     * @var subType $subType
     * @access public
     */
    public $subType = null;

    /**
     *
     * @var option $option
     * @access public
     */
    public $option = null;

}

class dataInformation {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

}

class associatedAmounts {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class feeDescriptionGrp {

    /**
     *
     * @var itemNumberInfo $itemNumberInfo
     * @access public
     */
    public $itemNumberInfo = null;

    /**
     *
     * @var serviceAttributesInfo $serviceAttributesInfo
     * @access public
     */
    public $serviceAttributesInfo = null;

    /**
     *
     * @var serviceDescriptionInfo $serviceDescriptionInfo
     * @access public
     */
    public $serviceDescriptionInfo = null;

}

class itemNumberInfo {

    /**
     *
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class serviceAttributesInfo {

    /**
     *
     * @var attributeQualifier $attributeQualifier
     * @access public
     */
    public $attributeQualifier = null;

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class serviceDescriptionInfo {

    /**
     *
     * @var serviceRequirementsInfo $serviceRequirementsInfo
     * @access public
     */
    public $serviceRequirementsInfo = null;

    /**
     *
     * @var seatDetails $seatDetails
     * @access public
     */
    public $seatDetails = null;

}

class serviceRequirementsInfo {

    /**
     *
     * @var serviceClassification $serviceClassification
     * @access public
     */
    public $serviceClassification = null;

    /**
     *
     * @var serviceStatus $serviceStatus
     * @access public
     */
    public $serviceStatus = null;

    /**
     *
     * @var serviceNumberOfInstances $serviceNumberOfInstances
     * @access public
     */
    public $serviceNumberOfInstances = null;

    /**
     *
     * @var serviceMarketingCarrier $serviceMarketingCarrier
     * @access public
     */
    public $serviceMarketingCarrier = null;

    /**
     *
     * @var serviceGroup $serviceGroup
     * @access public
     */
    public $serviceGroup = null;

    /**
     *
     * @var serviceSubGroup $serviceSubGroup
     * @access public
     */
    public $serviceSubGroup = null;

    /**
     *
     * @var serviceFreeText $serviceFreeText
     * @access public
     */
    public $serviceFreeText = null;

}

class seatDetails {

    /**
     *
     * @var seatCharacteristics $seatCharacteristics
     * @access public
     */
    public $seatCharacteristics = null;

}

class officeIdDetails {

    /**
     *
     * @var officeIdInformation $officeIdInformation
     * @access public
     */
    public $officeIdInformation = null;

    /**
     *
     * @var nbOfUnits $nbOfUnits
     * @access public
     */
    public $nbOfUnits = null;

    /**
     *
     * @var uidOption $uidOption
     * @access public
     */
    public $uidOption = null;

    /**
     *
     * @var pricingTickInfo $pricingTickInfo
     * @access public
     */
    public $pricingTickInfo = null;

    /**
     *
     * @var corporateFareInfo $corporateFareInfo
     * @access public
     */
    public $corporateFareInfo = null;

    /**
     *
     * @var travelFlightInfo $travelFlightInfo
     * @access public
     */
    public $travelFlightInfo = null;

    /**
     *
     * @var airlineDistributionDetails $airlineDistributionDetails
     * @access public
     */
    public $airlineDistributionDetails = null;

}

class officeIdInformation {

    /**
     *
     * @var officeIdentification $officeIdentification
     * @access public
     */
    public $officeIdentification = null;

    /**
     *
     * @var officeType $officeType
     * @access public
     */
    public $officeType = null;

    /**
     *
     * @var officeCode $officeCode
     * @access public
     */
    public $officeCode = null;

}

class officeIdentification {

    /**
     *
     * @var officeName $officeName
     * @access public
     */
    public $officeName = null;

    /**
     *
     * @var agentSignin $agentSignin
     * @access public
     */
    public $agentSignin = null;

    /**
     *
     * @var confidentialOffice $confidentialOffice
     * @access public
     */
    public $confidentialOffice = null;

    /**
     *
     * @var otherOffice $otherOffice
     * @access public
     */
    public $otherOffice = null;

}

class uidOption {

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class corporateFareInfo {

    /**
     *
     * @var corporateFareIdentifiers $corporateFareIdentifiers
     * @access public
     */
    public $corporateFareIdentifiers = null;

}

class corporateFareIdentifiers {

    /**
     *
     * @var fareQualifier $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     *
     * @var identifyNumber $identifyNumber
     * @access public
     */
    public $identifyNumber = null;

}

class airlineDistributionDetails {

    /**
     *
     * @var requestedSegmentRef $requestedSegmentRef
     * @access public
     */
    public $requestedSegmentRef = null;

    /**
     *
     * @var flightInfo $flightInfo
     * @access public
     */
    public $flightInfo = null;

}

class Fare_MasterPricerTravelBoardSearchReply {

    /**
     *
     * @var replyStatus $replyStatus
     * @access public
     */
    public $replyStatus = null;

    /**
     *
     * @var errorMessage $errorMessage
     * @access public
     */
    public $errorMessage = null;

    /**
     *
     * @var conversionRate $conversionRate
     * @access public
     */
    public $conversionRate = null;

    /**
     *
     * @var familyInformation $familyInformation
     * @access public
     */
    public $familyInformation = null;

    /**
     *
     * @var amountInfoForAllPax $amountInfoForAllPax
     * @access public
     */
    public $amountInfoForAllPax = null;

    /**
     *
     * @var amountInfoPerPax $amountInfoPerPax
     * @access public
     */
    public $amountInfoPerPax = null;

    /**
     *
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

    /**
     *
     * @var companyIdText $companyIdText
     * @access public
     */
    public $companyIdText = null;

    /**
     *
     * @var officeIdDetails $officeIdDetails
     * @access public
     */
    public $officeIdDetails = null;

    /**
     *
     * @var flightIndex $flightIndex
     * @access public
     */
    public $flightIndex = null;

    /**
     *
     * @var recommendation $recommendation
     * @access public
     */
    public $recommendation = null;

    /**
     *
     * @var warningInfo $warningInfo
     * @access public
     */
    public $warningInfo = null;

    /**
     *
     * @var globalInformation $globalInformation
     * @access public
     */
    public $globalInformation = null;

    /**
     *
     * @var serviceFeesGrp $serviceFeesGrp
     * @access public
     */
    public $serviceFeesGrp = null;

}

class replyStatus {

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

}

class status {

    /**
     *
     * @var advisoryTypeInfo $advisoryTypeInfo
     * @access public
     */
    public $advisoryTypeInfo = null;

    /**
     *
     * @var notification $notification
     * @access public
     */
    public $notification = null;

    /**
     *
     * @var notification2 $notification2
     * @access public
     */
    public $notification2 = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class errorMessage {

    /**
     *
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     *
     * @var errorMessageText $errorMessageText
     * @access public
     */
    public $errorMessageText = null;

}

class applicationError {

    /**
     *
     * @var applicationErrorDetail $applicationErrorDetail
     * @access public
     */
    public $applicationErrorDetail = null;

}

class applicationErrorDetail {

    /**
     *
     * @var error $error
     * @access public
     */
    public $error = null;

}

class errorMessageText {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class amountInfoForAllPax {

    /**
     *
     * @var itineraryAmounts $itineraryAmounts
     * @access public
     */
    public $itineraryAmounts = null;

    /**
     *
     * @var amountsPerSgt $amountsPerSgt
     * @access public
     */
    public $amountsPerSgt = null;

}

class itineraryAmounts {

    /**
     *
     * @var monetaryDetail $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class monetaryDetail {

    /**
     *
     * @var amountType $amountType
     * @access public
     */
    public $amountType = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class amountsPerSgt {

    /**
     *
     * @var sgtRef $sgtRef
     * @access public
     */
    public $sgtRef = null;

    /**
     *
     * @var amounts $amounts
     * @access public
     */
    public $amounts = null;

}

class sgtRef {

    /**
     *
     * @var referencingDetail $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class amounts {

    /**
     *
     * @var monetaryDetail $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class amountInfoPerPax {

    /**
     *
     * @var paxRef $paxRef
     * @access public
     */
    public $paxRef = null;

    /**
     *
     * @var paxAttributes $paxAttributes
     * @access public
     */
    public $paxAttributes = null;

    /**
     *
     * @var itineraryAmounts $itineraryAmounts
     * @access public
     */
    public $itineraryAmounts = null;

    /**
     *
     * @var amountsPerSgt $amountsPerSgt
     * @access public
     */
    public $amountsPerSgt = null;

}

class paxRef {

    /**
     *
     * @var travellerDetails $travellerDetails
     * @access public
     */
    public $travellerDetails = null;

}

class travellerDetails {

    /**
     *
     * @var referenceNumber $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

}

class paxAttributes {

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

}

class feeReference {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var feeRefNumber $feeRefNumber
     * @access public
     */
    public $feeRefNumber = null;

}

class feeInformation {

    /**
     *
     * @var feeIdentification $feeIdentification
     * @access public
     */
    public $feeIdentification = null;

    /**
     *
     * @var feeInformation $feeInformation
     * @access public
     */
    public $feeInformation = null;

}

class feeParameters {

    /**
     *
     * @var feeParameter $feeParameter
     * @access public
     */
    public $feeParameter = null;

}

class feeParameter {

    /**
     *
     * @var feeParameterType $feeParameterType
     * @access public
     */
    public $feeParameterType = null;

    /**
     *
     * @var feeParameterDescription $feeParameterDescription
     * @access public
     */
    public $feeParameterDescription = null;

}

class convertedOrOriginalInfo {

    /**
     *
     * @var conversionRateDetail $conversionRateDetail
     * @access public
     */
    public $conversionRateDetail = null;

}

class companyIdText {

    /**
     *
     * @var textRefNumber $textRefNumber
     * @access public
     */
    public $textRefNumber = null;

    /**
     *
     * @var companyText $companyText
     * @access public
     */
    public $companyText = null;

}

class officeIdReference {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var refNumber $refNumber
     * @access public
     */
    public $refNumber = null;

}

class flightIndex {

    /**
     *
     * @var requestedSegmentRef $requestedSegmentRef
     * @access public
     */
    public $requestedSegmentRef = null;

    /**
     *
     * @var groupOfFlights $groupOfFlights
     * @access public
     */
    public $groupOfFlights = null;

}

class groupOfFlights {

    /**
     *
     * @var propFlightGrDetail $propFlightGrDetail
     * @access public
     */
    public $propFlightGrDetail = null;

    /**
     *
     * @var flightDetails $flightDetails
     * @access public
     */
    public $flightDetails = null;

}

class propFlightGrDetail {

    /**
     *
     * @var flightProposal $flightProposal
     * @access public
     */
    public $flightProposal = null;

    /**
     *
     * @var flightCharacteristic $flightCharacteristic
     * @access public
     */
    public $flightCharacteristic = null;

}

class flightProposal {

    /**
     *
     * @var ref $ref
     * @access public
     */
    public $ref = null;

    /**
     *
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class flightInformation {

    /**
     *
     * @var productDateTime $productDateTime
     * @access public
     */
    public $productDateTime = null;

    /**
     *
     * @var location $location
     * @access public
     */
    public $location = null;

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     *
     * @var productDetail $productDetail
     * @access public
     */
    public $productDetail = null;

    /**
     *
     * @var addProductDetail $addProductDetail
     * @access public
     */
    public $addProductDetail = null;

}

class productDateTime {

    /**
     *
     * @var dateOfDeparture $dateOfDeparture
     * @access public
     */
    public $dateOfDeparture = null;

    /**
     *
     * @var timeOfDeparture $timeOfDeparture
     * @access public
     */
    public $timeOfDeparture = null;

    /**
     *
     * @var dateOfArrival $dateOfArrival
     * @access public
     */
    public $dateOfArrival = null;

    /**
     *
     * @var timeOfArrival $timeOfArrival
     * @access public
     */
    public $timeOfArrival = null;

    /**
     *
     * @var dateVariation $dateVariation
     * @access public
     */
    public $dateVariation = null;

}

class location {

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

    /**
     *
     * @var airportCityQualifier $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     *
     * @var terminal $terminal
     * @access public
     */
    public $terminal = null;

}

class productDetail {

    /**
     *
     * @var equipmentType $equipmentType
     * @access public
     */
    public $equipmentType = null;

    /**
     *
     * @var operatingDay $operatingDay
     * @access public
     */
    public $operatingDay = null;

    /**
     *
     * @var techStopNumber $techStopNumber
     * @access public
     */
    public $techStopNumber = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

}

class addProductDetail {

    /**
     *
     * @var lastSeatAvailable $lastSeatAvailable
     * @access public
     */
    public $lastSeatAvailable = null;

    /**
     *
     * @var levelOfAccess $levelOfAccess
     * @access public
     */
    public $levelOfAccess = null;

    /**
     *
     * @var electronicTicketing $electronicTicketing
     * @access public
     */
    public $electronicTicketing = null;

    /**
     *
     * @var operationalSuffix $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

    /**
     *
     * @var productDetailQualifier $productDetailQualifier
     * @access public
     */
    public $productDetailQualifier = null;

    /**
     *
     * @var flightCharacteristic $flightCharacteristic
     * @access public
     */
    public $flightCharacteristic = null;

}

class technicalStop {

    /**
     *
     * @var stopDetails $stopDetails
     * @access public
     */
    public $stopDetails = null;

}

class commercialAgreement {

    /**
     *
     * @var codeshareDetails $codeshareDetails
     * @access public
     */
    public $codeshareDetails = null;

    /**
     *
     * @var otherCodeshareDetails $otherCodeshareDetails
     * @access public
     */
    public $otherCodeshareDetails = null;

}

class recommendation {

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var warningMessage $warningMessage
     * @access public
     */
    public $warningMessage = null;

    /**
     *
     * @var fareFamilyRef $fareFamilyRef
     * @access public
     */
    public $fareFamilyRef = null;

    /**
     *
     * @var recPriceInfo $recPriceInfo
     * @access public
     */
    public $recPriceInfo = null;

    /**
     *
     * @var miniRule $miniRule
     * @access public
     */
    public $miniRule = null;

    /**
     *
     * @var segmentFlightRef $segmentFlightRef
     * @access public
     */
    public $segmentFlightRef = null;

    /**
     *
     * @var recommandationSegmentsFareDetails $recommandationSegmentsFareDetails
     * @access public
     */
    public $recommandationSegmentsFareDetails = null;

    /**
     *
     * @var paxFareProduct $paxFareProduct
     * @access public
     */
    public $paxFareProduct = null;

    /**
     *
     * @var specificRecDetails $specificRecDetails
     * @access public
     */
    public $specificRecDetails = null;

}

class codeShareDetails2 {

    /**
     *
     * @var transportStageQualifier $transportStageQualifier
     * @access public
     */
    public $transportStageQualifier = null;

    /**
     *
     * @var company $company
     * @access public
     */
    public $company = null;

}

class priceTicketing {

    /**
     *
     * @var priceType $priceType
     * @access public
     */
    public $priceType = null;

}

class warningMessage {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class fareFamilyRef {

    /**
     *
     * @var referencingDetail $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class recPriceInfo {

    /**
     *
     * @var monetaryDetail $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class miniRule {

    /**
     *
     * @var restrictionType $restrictionType
     * @access public
     */
    public $restrictionType = null;

    /**
     *
     * @var category $category
     * @access public
     */
    public $category = null;

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var miniRules $miniRules
     * @access public
     */
    public $miniRules = null;

}

class indicator {

    /**
     *
     * @var ruleIndicator $ruleIndicator
     * @access public
     */
    public $ruleIndicator = null;

}

class miniRules {

    /**
     *
     * @var interpretation $interpretation
     * @access public
     */
    public $interpretation = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

}

class segmentFlightRef {

    /**
     *
     * @var referencingDetail $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class recommandationSegmentsFareDetails {

    /**
     *
     * @var recommendationSegRef $recommendationSegRef
     * @access public
     */
    public $recommendationSegRef = null;

    /**
     *
     * @var segmentMonetaryInformation $segmentMonetaryInformation
     * @access public
     */
    public $segmentMonetaryInformation = null;

}

class recommendationSegRef {

    /**
     *
     * @var segRef $segRef
     * @access public
     */
    public $segRef = null;

    /**
     *
     * @var locationForcing $locationForcing
     * @access public
     */
    public $locationForcing = null;

}

class segmentMonetaryInformation {

    /**
     *
     * @var monetaryDetail $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class paxFareProduct {

    /**
     *
     * @var paxFareDetail $paxFareDetail
     * @access public
     */
    public $paxFareDetail = null;

    /**
     *
     * @var feeRef $feeRef
     * @access public
     */
    public $feeRef = null;

    /**
     *
     * @var paxReference $paxReference
     * @access public
     */
    public $paxReference = null;

    /**
     *
     * @var passengerTaxDetails $passengerTaxDetails
     * @access public
     */
    public $passengerTaxDetails = null;

    /**
     *
     * @var fare $fare
     * @access public
     */
    public $fare = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

}

class paxFareDetail {

    /**
     *
     * @var paxFareNum $paxFareNum
     * @access public
     */
    public $paxFareNum = null;

    /**
     *
     * @var totalFareAmount $totalFareAmount
     * @access public
     */
    public $totalFareAmount = null;

    /**
     *
     * @var totalTaxAmount $totalTaxAmount
     * @access public
     */
    public $totalTaxAmount = null;

    /**
     *
     * @var codeShareDetails $codeShareDetails
     * @access public
     */
    public $codeShareDetails = null;

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var pricingTicketing $pricingTicketing
     * @access public
     */
    public $pricingTicketing = null;

}

class feeRef {

    /**
     *
     * @var referencingDetail $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class passengerTaxDetails {

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class pricingMessage {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class monetaryInformation {

    /**
     *
     * @var monetaryDetail $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class segmentRef {

    /**
     *
     * @var segRef $segRef
     * @access public
     */
    public $segRef = null;

    /**
     *
     * @var locationForcing $locationForcing
     * @access public
     */
    public $locationForcing = null;

}

class groupOfFares {

    /**
     *
     * @var productInformation $productInformation
     * @access public
     */
    public $productInformation = null;

    /**
     *
     * @var fareCalculationCodeDetails $fareCalculationCodeDetails
     * @access public
     */
    public $fareCalculationCodeDetails = null;

    /**
     *
     * @var ticketInfos $ticketInfos
     * @access public
     */
    public $ticketInfos = null;

    /**
     *
     * @var fareFamiliesRef $fareFamiliesRef
     * @access public
     */
    public $fareFamiliesRef = null;

}

class productInformation {

    /**
     *
     * @var cabinProduct $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     *
     * @var fareProductDetail $fareProductDetail
     * @access public
     */
    public $fareProductDetail = null;

    /**
     *
     * @var corporateId $corporateId
     * @access public
     */
    public $corporateId = null;

    /**
     *
     * @var breakPoint $breakPoint
     * @access public
     */
    public $breakPoint = null;

    /**
     *
     * @var contextDetails $contextDetails
     * @access public
     */
    public $contextDetails = null;

}

class contextDetails {

    /**
     *
     * @var availabilityCnxType $availabilityCnxType
     * @access public
     */
    public $availabilityCnxType = null;

}

class fareCalculationCodeDetails {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var locationCode $locationCode
     * @access public
     */
    public $locationCode = null;

    /**
     *
     * @var otherLocationCode $otherLocationCode
     * @access public
     */
    public $otherLocationCode = null;

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

}

class ticketInfos {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class fareFamiliesRef {

    /**
     *
     * @var referencingDetail $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class psgSegMonetaryInformation {

    /**
     *
     * @var monetaryDetail $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class specificRecDetails {

    /**
     *
     * @var specificRecItem $specificRecItem
     * @access public
     */
    public $specificRecItem = null;

    /**
     *
     * @var specificProductDetails $specificProductDetails
     * @access public
     */
    public $specificProductDetails = null;

}

class specificRecItem {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var refNumber $refNumber
     * @access public
     */
    public $refNumber = null;

}

class specificProductDetails {

    /**
     *
     * @var productReferences $productReferences
     * @access public
     */
    public $productReferences = null;

    /**
     *
     * @var fareContextDetails $fareContextDetails
     * @access public
     */
    public $fareContextDetails = null;

}

class productReferences {

    /**
     *
     * @var paxFareNum $paxFareNum
     * @access public
     */
    public $paxFareNum = null;

}

class fareContextDetails {

    /**
     *
     * @var requestedSegmentInfo $requestedSegmentInfo
     * @access public
     */
    public $requestedSegmentInfo = null;

    /**
     *
     * @var cnxContextDetails $cnxContextDetails
     * @access public
     */
    public $cnxContextDetails = null;

}

class requestedSegmentInfo {

    /**
     *
     * @var segRef $segRef
     * @access public
     */
    public $segRef = null;

}

class cnxContextDetails {

    /**
     *
     * @var fareCnxInfo $fareCnxInfo
     * @access public
     */
    public $fareCnxInfo = null;

}

class fareCnxInfo {

    /**
     *
     * @var cabinProduct $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     *
     * @var contextDetails $contextDetails
     * @access public
     */
    public $contextDetails = null;

}

class warningInfo {

    /**
     *
     * @var globalMessageMarker $globalMessageMarker
     * @access public
     */
    public $globalMessageMarker = null;

    /**
     *
     * @var globalMessage $globalMessage
     * @access public
     */
    public $globalMessage = null;

}

class globalMessageMarker {

}

class globalMessage {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class globalInformation {

    /**
     *
     * @var attributes $attributes
     * @access public
     */
    public $attributes = null;

}

class serviceFeesGrp {

    /**
     *
     * @var serviceTypeInfo $serviceTypeInfo
     * @access public
     */
    public $serviceTypeInfo = null;

    /**
     *
     * @var serviceFeeRefGrp $serviceFeeRefGrp
     * @access public
     */
    public $serviceFeeRefGrp = null;

    /**
     *
     * @var serviceCoverageInfoGrp $serviceCoverageInfoGrp
     * @access public
     */
    public $serviceCoverageInfoGrp = null;

    /**
     *
     * @var globalMessageMarker $globalMessageMarker
     * @access public
     */
    public $globalMessageMarker = null;

    /**
     *
     * @var serviceFeeInfoGrp $serviceFeeInfoGrp
     * @access public
     */
    public $serviceFeeInfoGrp = null;

    /**
     *
     * @var serviceDetailsGrp $serviceDetailsGrp
     * @access public
     */
    public $serviceDetailsGrp = null;

}

class serviceTypeInfo {

    /**
     *
     * @var carrierFeeDetails $carrierFeeDetails
     * @access public
     */
    public $carrierFeeDetails = null;

}

class serviceFeeRefGrp {

    /**
     *
     * @var refInfo $refInfo
     * @access public
     */
    public $refInfo = null;

}

class refInfo {

    /**
     *
     * @var referencingDetail $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class serviceCoverageInfoGrp {

    /**
     *
     * @var itemNumberInfo $itemNumberInfo
     * @access public
     */
    public $itemNumberInfo = null;

    /**
     *
     * @var serviceCovInfoGrp $serviceCovInfoGrp
     * @access public
     */
    public $serviceCovInfoGrp = null;

}

class serviceCovInfoGrp {

    /**
     *
     * @var paxRefInfo $paxRefInfo
     * @access public
     */
    public $paxRefInfo = null;

    /**
     *
     * @var coveragePerFlightsInfo $coveragePerFlightsInfo
     * @access public
     */
    public $coveragePerFlightsInfo = null;

    /**
     *
     * @var refInfo $refInfo
     * @access public
     */
    public $refInfo = null;

}

class paxRefInfo {

    /**
     *
     * @var travellerDetails $travellerDetails
     * @access public
     */
    public $travellerDetails = null;

}

class coveragePerFlightsInfo {

    /**
     *
     * @var numberOfItemsDetails $numberOfItemsDetails
     * @access public
     */
    public $numberOfItemsDetails = null;

    /**
     *
     * @var lastItemsDetails $lastItemsDetails
     * @access public
     */
    public $lastItemsDetails = null;

}

class numberOfItemsDetails {

    /**
     *
     * @var actionQualifier $actionQualifier
     * @access public
     */
    public $actionQualifier = null;

    /**
     *
     * @var referenceQualifier $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     *
     * @var refNum $refNum
     * @access public
     */
    public $refNum = null;

}

class lastItemsDetails {

    /**
     *
     * @var refOfLeg $refOfLeg
     * @access public
     */
    public $refOfLeg = null;

    /**
     *
     * @var firstItemIdentifier $firstItemIdentifier
     * @access public
     */
    public $firstItemIdentifier = null;

    /**
     *
     * @var lastItemIdentifier $lastItemIdentifier
     * @access public
     */
    public $lastItemIdentifier = null;

}

class serviceFeeInfoGrp {

    /**
     *
     * @var itemNumberInfo $itemNumberInfo
     * @access public
     */
    public $itemNumberInfo = null;

    /**
     *
     * @var serviceDetailsGrp $serviceDetailsGrp
     * @access public
     */
    public $serviceDetailsGrp = null;

}

class serviceDetailsGrp {

    /**
     *
     * @var refInfo $refInfo
     * @access public
     */
    public $refInfo = null;

    /**
     *
     * @var serviceMatchedInfoGroup $serviceMatchedInfoGroup
     * @access public
     */
    public $serviceMatchedInfoGroup = null;

}

class serviceMatchedInfoGroup {

    /**
     *
     * @var paxRefInfo $paxRefInfo
     * @access public
     */
    public $paxRefInfo = null;

    /**
     *
     * @var pricingInfo $pricingInfo
     * @access public
     */
    public $pricingInfo = null;

    /**
     *
     * @var amountInfo $amountInfo
     * @access public
     */
    public $amountInfo = null;

}

class amountInfo {

    /**
     *
     * @var monetaryDetail $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class serviceOptionInfo {

    /**
     *
     * @var dataTypeInformation $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     *
     * @var dataInformation $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class Command_Cryptic {

    /**
     *
     * @var messageAction $messageAction
     * @access public
     */
    public $messageAction = null;

    /**
     *
     * @var numberOfUnits $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     *
     * @var intelligentWorkstationInfo $intelligentWorkstationInfo
     * @access public
     */
    public $intelligentWorkstationInfo = null;

    /**
     *
     * @var longTextString $longTextString
     * @access public
     */
    public $longTextString = null;

}

class messageAction {

    /**
     *
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;
    public $business = null;

    /**
     *
     * @var responseType $responseType
     * @access public
     */
    public $responseType = null;

}

class numberOfUnitsDetails1 {

    /**
     *
     * @var units $units
     * @access public
     */
    public $units = null;

    /**
     *
     * @var unitsQualifier $unitsQualifier
     * @access public
     */
    public $unitsQualifier = null;

}

class numberOfUnitsDetails2 {

    /**
     *
     * @var units $units
     * @access public
     */
    public $units = null;

    /**
     *
     * @var unitsQualifier $unitsQualifier
     * @access public
     */
    public $unitsQualifier = null;

}

class intelligentWorkstationInfo {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

}

class longTextString {

    /**
     *
     * @var textStringDetails $textStringDetails
     * @access public
     */
    public $textStringDetails = null;

}

class Command_CrypticReply {

    /**
     *
     * @var messageActionDetails $messageActionDetails
     * @access public
     */
    public $messageActionDetails = null;

    /**
     *
     * @var longTextString $longTextString
     * @access public
     */
    public $longTextString = null;

}

class messageActionDetails {

    /**
     *
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

    /**
     *
     * @var responseType $responseType
     * @access public
     */
    public $responseType = null;

}

class Air_SellFromRecommendation {

    /**
     *
     * @var messageActionDetails $messageActionDetails
     * @access public
     */
    public $messageActionDetails = null;

    /**
     *
     * @var recordLocator $recordLocator
     * @access public
     */
    public $recordLocator = null;

    /**
     *
     * @var itineraryDetails $itineraryDetails
     * @access public
     */
    public $itineraryDetails = null;

}

class recordLocator {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class reservation {

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var controlNumber $controlNumber
     * @access public
     */
    public $controlNumber = null;

    /**
     *
     * @var controlType $controlType
     * @access public
     */
    public $controlType = null;

    /**
     *
     * @var date $date
     * @access public
     */
    public $date = null;

    /**
     *
     * @var time $time
     * @access public
     */
    public $time = null;

}

class itineraryDetails {

    /**
     *
     * @var originDestinationDetails $originDestinationDetails
     * @access public
     */
    public $originDestinationDetails = null;

    /**
     *
     * @var message $message
     * @access public
     */
    public $message = null;

    /**
     *
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

}

class originDestinationDetails {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;
    public $originDestination = null;
    public $itineraryInfo = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class message {

    /**
     *
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

}

class segmentInformation2 {

    /**
     *
     * @var travelProductInformation $travelProductInformation
     * @access public
     */
    public $travelProductInformation = null;

    /**
     *
     * @var relatedproductInformation $relatedproductInformation
     * @access public
     */
    public $relatedproductInformation = null;

}

class segmentInformation {

    /**
     *
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     *
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     *
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     *
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     *
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     *
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class travelProductInformation {

    /**
     *
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     *
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     *
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     *
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     *
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     *
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class relatedproductInformation {

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class Air_SellFromRecommendationReply {

    /**
     *
     * @var message $message
     * @access public
     */
    public $message = null;

    /**
     *
     * @var errorAtMessageLevel $errorAtMessageLevel
     * @access public
     */
    public $errorAtMessageLevel = null;

    /**
     *
     * @var itineraryDetails $itineraryDetails
     * @access public
     */
    public $itineraryDetails = null;

}

class errorAtMessageLevel {

    /**
     *
     * @var errorSegment $errorSegment
     * @access public
     */
    public $errorSegment = null;

    /**
     *
     * @var informationText $informationText
     * @access public
     */
    public $informationText = null;

}

class errorSegment {

    /**
     *
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class informationText {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class errorItinerarylevel {

    /**
     *
     * @var errorSegment $errorSegment
     * @access public
     */
    public $errorSegment = null;

    /**
     *
     * @var informationText $informationText
     * @access public
     */
    public $informationText = null;

}

class apdSegment {

    /**
     *
     * @var legDetails $legDetails
     * @access public
     */
    public $legDetails = null;

    /**
     *
     * @var departureStationInfo $departureStationInfo
     * @access public
     */
    public $departureStationInfo = null;

    /**
     *
     * @var arrivalStationInfo $arrivalStationInfo
     * @access public
     */
    public $arrivalStationInfo = null;

    /**
     *
     * @var facilitiesInformation $facilitiesInformation
     * @access public
     */
    public $facilitiesInformation = null;

}

class facilitiesInformation {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var extensionCode $extensionCode
     * @access public
     */
    public $extensionCode = null;

}

class actionDetails {

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class errorAtSegmentLevel {

    /**
     *
     * @var errorSegment $errorSegment
     * @access public
     */
    public $errorSegment = null;

    /**
     *
     * @var informationText $informationText
     * @access public
     */
    public $informationText = null;

}

class PNR_Reply {

    /**
     *
     * @var pnrHeader $pnrHeader
     * @access public
     */
    public $pnrHeader = null;

    /**
     *
     * @var securityInformation $securityInformation
     * @access public
     */
    public $securityInformation = null;

    /**
     *
     * @var queueInformations $queueInformations
     * @access public
     */
    public $queueInformations = null;

    /**
     *
     * @var numberOfUnits $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     *
     * @var generalErrorInfo $generalErrorInfo
     * @access public
     */
    public $generalErrorInfo = null;

    /**
     *
     * @var freetextData $freetextData
     * @access public
     */
    public $freetextData = null;

    /**
     *
     * @var freeFormText $freeFormText
     * @access public
     */
    public $freeFormText = null;

    /**
     *
     * @var historyData $historyData
     * @access public
     */
    public $historyData = null;

    /**
     *
     * @var sbrPOSDetails $sbrPOSDetails
     * @access public
     */
    public $sbrPOSDetails = null;

    /**
     *
     * @var sbrCreationPosDetails $sbrCreationPosDetails
     * @access public
     */
    public $sbrCreationPosDetails = null;

    /**
     *
     * @var sbrUpdatorPosDetails $sbrUpdatorPosDetails
     * @access public
     */
    public $sbrUpdatorPosDetails = null;

    /**
     *
     * @var technicalData $technicalData
     * @access public
     */
    public $technicalData = null;

    /**
     *
     * @var travellerInfo $travellerInfo
     * @access public
     */
    public $travellerInfo = null;

    /**
     *
     * @var originDestinationDetails $originDestinationDetails
     * @access public
     */
    public $originDestinationDetails = null;

    /**
     *
     * @var segmentGroupingInfo $segmentGroupingInfo
     * @access public
     */
    public $segmentGroupingInfo = null;

    /**
     *
     * @var dataElementsMaster $dataElementsMaster
     * @access public
     */
    public $dataElementsMaster = null;

    /**
     *
     * @var tstData $tstData
     * @access public
     */
    public $tstData = null;

}

class pnrHeader {

    /**
     *
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     *
     * @var referenceForRecordLocator $referenceForRecordLocator
     * @access public
     */
    public $referenceForRecordLocator = null;

}

class referenceForRecordLocator {

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

}

class reference {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

}

class securityInformation {

    /**
     *
     * @var responsibilityInformation $responsibilityInformation
     * @access public
     */
    public $responsibilityInformation = null;

    /**
     *
     * @var queueingInformation $queueingInformation
     * @access public
     */
    public $queueingInformation = null;

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     *
     * @var secondRpInformation $secondRpInformation
     * @access public
     */
    public $secondRpInformation = null;

}

class responsibilityInformation {

    /**
     *
     * @var typeOfPnrElement $typeOfPnrElement
     * @access public
     */
    public $typeOfPnrElement = null;

    /**
     *
     * @var agentId $agentId
     * @access public
     */
    public $agentId = null;

    /**
     *
     * @var officeId $officeId
     * @access public
     */
    public $officeId = null;

    /**
     *
     * @var iataCode $iataCode
     * @access public
     */
    public $iataCode = null;

}

class queueingInformation {

    /**
     *
     * @var queueingOfficeId $queueingOfficeId
     * @access public
     */
    public $queueingOfficeId = null;

    /**
     *
     * @var location $location
     * @access public
     */
    public $location = null;

}

class secondRpInformation {

    /**
     *
     * @var creationOfficeId $creationOfficeId
     * @access public
     */
    public $creationOfficeId = null;

    /**
     *
     * @var agentSignature $agentSignature
     * @access public
     */
    public $agentSignature = null;

    /**
     *
     * @var creationDate $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     *
     * @var creatorIataCode $creatorIataCode
     * @access public
     */
    public $creatorIataCode = null;

    /**
     *
     * @var creationTime $creationTime
     * @access public
     */
    public $creationTime = null;

}

class queueInformations {

    /**
     *
     * @var queueDetail $queueDetail
     * @access public
     */
    public $queueDetail = null;

    /**
     *
     * @var categoryDetail $categoryDetail
     * @access public
     */
    public $categoryDetail = null;

    /**
     *
     * @var dateRange $dateRange
     * @access public
     */
    public $dateRange = null;

    /**
     *
     * @var informations $informations
     * @access public
     */
    public $informations = null;

}

class queueDetail {

    /**
     *
     * @var queueNum1 $queueNum1
     * @access public
     */
    public $queueNum1 = null;

    /**
     *
     * @var queueName $queueName
     * @access public
     */
    public $queueName = null;

}

class categoryDetail {

    /**
     *
     * @var categoryNum1 $categoryNum1
     * @access public
     */
    public $categoryNum1 = null;

    /**
     *
     * @var categoryName $categoryName
     * @access public
     */
    public $categoryName = null;

}

class dateRange {

    /**
     *
     * @var dateRangeNum $dateRangeNum
     * @access public
     */
    public $dateRangeNum = null;

}

class informations {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var queueType $queueType
     * @access public
     */
    public $queueType = null;

}

class numberDetail {

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

}

class generalErrorInfo {

    /**
     *
     * @var messageErrorInformation $messageErrorInformation
     * @access public
     */
    public $messageErrorInformation = null;

    /**
     *
     * @var messageErrorText $messageErrorText
     * @access public
     */
    public $messageErrorText = null;

}

class messageErrorInformation {

    /**
     *
     * @var errorDetail $errorDetail
     * @access public
     */
    public $errorDetail = null;

}

class errorDetail {

    /**
     *
     * @var errorCode $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var responsibleAgency $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

}

class messageErrorText {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var text $text
     * @access public
     */
    public $text = null;

}

class freetextDetail {

    /**
     *
     * @var subjectQualifier $subjectQualifier
     * @access public
     */
    public $subjectQualifier = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var language $language
     * @access public
     */
    public $language = null;

}

class freetextData {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var longFreetext $longFreetext
     * @access public
     */
    public $longFreetext = null;

}

class freeFormText {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var text $text
     * @access public
     */
    public $text = null;

}

class historyData {

    /**
     *
     * @var previousRecord $previousRecord
     * @access public
     */
    public $previousRecord = null;

    /**
     *
     * @var currentRecord $currentRecord
     * @access public
     */
    public $currentRecord = null;

    /**
     *
     * @var elementType $elementType
     * @access public
     */
    public $elementType = null;

    /**
     *
     * @var elementData $elementData
     * @access public
     */
    public $elementData = null;

}

class sbrPOSDetails {

    /**
     *
     * @var sbrUserIdentificationOwn $sbrUserIdentificationOwn
     * @access public
     */
    public $sbrUserIdentificationOwn = null;

    /**
     *
     * @var sbrSystemDetails $sbrSystemDetails
     * @access public
     */
    public $sbrSystemDetails = null;

    /**
     *
     * @var sbrPreferences $sbrPreferences
     * @access public
     */
    public $sbrPreferences = null;

}

class sbrUserIdentificationOwn {

    /**
     *
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     *
     * @var originatorTypeCode $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

}

class originIdentification {

    /**
     *
     * @var originatorId $originatorId
     * @access public
     */
    public $originatorId = null;

    /**
     *
     * @var inHouseIdentification1 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

    /**
     *
     * @var inHouseIdentification2 $inHouseIdentification2
     * @access public
     */
    public $inHouseIdentification2 = null;
    public $sourceOffice = null;

    function __construct($sourceOffice = null) {
        $this->sourceOffice = $sourceOffice;
    }

}

class sbrSystemDetails {

    /**
     *
     * @var deliveringSystem $deliveringSystem
     * @access public
     */
    public $deliveringSystem = null;

}

class deliveringSystem {

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var locationId $locationId
     * @access public
     */
    public $locationId = null;

}

class sbrPreferences {

    /**
     *
     * @var userPreferences $userPreferences
     * @access public
     */
    public $userPreferences = null;

}

class userPreferences {

    /**
     *
     * @var codedCountry $codedCountry
     * @access public
     */
    public $codedCountry = null;

    /**
     *
     * @var codedCurrency $codedCurrency
     * @access public
     */
    public $codedCurrency = null;

    /**
     *
     * @var codedLanguage $codedLanguage
     * @access public
     */
    public $codedLanguage = null;

}

class sbrCreationPosDetails {

    /**
     *
     * @var sbrUserIdentificationOwn $sbrUserIdentificationOwn
     * @access public
     */
    public $sbrUserIdentificationOwn = null;

    /**
     *
     * @var sbrSystemDetails $sbrSystemDetails
     * @access public
     */
    public $sbrSystemDetails = null;

    /**
     *
     * @var sbrPreferences $sbrPreferences
     * @access public
     */
    public $sbrPreferences = null;

}

class sbrUpdatorPosDetails {

    /**
     *
     * @var sbrUserIdentificationOwn $sbrUserIdentificationOwn
     * @access public
     */
    public $sbrUserIdentificationOwn = null;

    /**
     *
     * @var sbrSystemDetails $sbrSystemDetails
     * @access public
     */
    public $sbrSystemDetails = null;

    /**
     *
     * @var sbrPreferences $sbrPreferences
     * @access public
     */
    public $sbrPreferences = null;

}

class technicalData {

    /**
     *
     * @var enveloppeNumberData $enveloppeNumberData
     * @access public
     */
    public $enveloppeNumberData = null;

    /**
     *
     * @var lastTransmittedEnvelopeNumber $lastTransmittedEnvelopeNumber
     * @access public
     */
    public $lastTransmittedEnvelopeNumber = null;

    /**
     *
     * @var purgeDateData $purgeDateData
     * @access public
     */
    public $purgeDateData = null;

    /**
     *
     * @var generalPNRInformation $generalPNRInformation
     * @access public
     */
    public $generalPNRInformation = null;

}

class enveloppeNumberData {

    /**
     *
     * @var actionRequest $actionRequest
     * @access public
     */
    public $actionRequest = null;

    /**
     *
     * @var sequenceDetails $sequenceDetails
     * @access public
     */
    public $sequenceDetails = null;

}

class sequenceDetails {

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

}

class lastTransmittedEnvelopeNumber {

    /**
     *
     * @var currentRecord $currentRecord
     * @access public
     */
    public $currentRecord = null;

}

class purgeDateData {

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class dateTimeCustom {

    /**
     *
     * @var year $year
     * @access public
     */
    public $year = null;

    /**
     *
     * @var month $month
     * @access public
     */
    public $month = null;

    /**
     *
     * @var day $day
     * @access public
     */
    public $day = null;

}

class generalPNRInformation {

    /**
     *
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class travellerInfo {

    /**
     *
     * @var elementManagementPassenger $elementManagementPassenger
     * @access public
     */
    public $elementManagementPassenger = null;

    /**
     *
     * @var passengerData $passengerData
     * @access public
     */
    public $passengerData = null;

    /**
     *
     * @var nameError $nameError
     * @access public
     */
    public $nameError = null;

}

class elementManagementPassenger {

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

    /**
     *
     * @var segmentName $segmentName
     * @access public
     */
    public $segmentName = null;

    /**
     *
     * @var lineNumber $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class passengerData {

    /**
     *
     * @var travellerInformation $travellerInformation
     * @access public
     */
    public $travellerInformation = null;

    /**
     *
     * @var dateOfBirth $dateOfBirth
     * @access public
     */
    public $dateOfBirth = null;

}

class travellerInformation {

    /**
     *
     * @var traveller $traveller
     * @access public
     */
    public $traveller = null;

    /**
     *
     * @var passenger $passenger
     * @access public
     */
    public $passenger = null;

}

class passenger {

    /**
     *
     * @var firstName $firstName
     * @access public
     */
    public $firstName = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var infantIndicator $infantIndicator
     * @access public
     */
    public $infantIndicator = null;

    /**
     *
     * @var identificationCode $identificationCode
     * @access public
     */
    public $identificationCode = null;

}

class dateOfBirth {

    /**
     *
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class nameError {

    /**
     *
     * @var nameErrorInformation $nameErrorInformation
     * @access public
     */
    public $nameErrorInformation = null;

    /**
     *
     * @var nameErrorFreeText $nameErrorFreeText
     * @access public
     */
    public $nameErrorFreeText = null;

}

class nameErrorInformation {

    /**
     *
     * @var errorDetail $errorDetail
     * @access public
     */
    public $errorDetail = null;

}

class nameErrorFreeText {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var text $text
     * @access public
     */
    public $text = null;

}

class itineraryInfo {

    /**
     *
     * @var elementManagementItinerary $elementManagementItinerary
     * @access public
     */
    public $elementManagementItinerary = null;
    public $airAuxItinerary = null;

    /**
     *
     * @var travelProduct $travelProduct
     * @access public
     */
    public $travelProduct = null;

    /**
     *
     * @var itineraryMessageAction $itineraryMessageAction
     * @access public
     */
    public $itineraryMessageAction = null;

    /**
     *
     * @var itineraryReservationInfo $itineraryReservationInfo
     * @access public
     */
    public $itineraryReservationInfo = null;

    /**
     *
     * @var relatedProduct $relatedProduct
     * @access public
     */
    public $relatedProduct = null;

    /**
     *
     * @var flightDetail $flightDetail
     * @access public
     */
    public $flightDetail = null;

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     *
     * @var itineraryfreeFormText $itineraryfreeFormText
     * @access public
     */
    public $itineraryfreeFormText = null;

    /**
     *
     * @var itineraryFreetext $itineraryFreetext
     * @access public
     */
    public $itineraryFreetext = null;

    /**
     *
     * @var hotelProduct $hotelProduct
     * @access public
     */
    public $hotelProduct = null;

    /**
     *
     * @var rateInformations $rateInformations
     * @access public
     */
    public $rateInformations = null;

    /**
     *
     * @var generalOption $generalOption
     * @access public
     */
    public $generalOption = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

    /**
     *
     * @var itineraryMonetaryInformations $itineraryMonetaryInformations
     * @access public
     */
    public $itineraryMonetaryInformations = null;

    /**
     *
     * @var taxInformation $taxInformation
     * @access public
     */
    public $taxInformation = null;

    /**
     *
     * @var customerTransactionData $customerTransactionData
     * @access public
     */
    public $customerTransactionData = null;

    /**
     *
     * @var yieldData $yieldData
     * @access public
     */
    public $yieldData = null;

    /**
     *
     * @var dateTimeDetails $dateTimeDetails
     * @access public
     */
    public $dateTimeDetails = null;

    /**
     *
     * @var lccTypicalData $lccTypicalData
     * @access public
     */
    public $lccTypicalData = null;

    /**
     *
     * @var insuranceInformation $insuranceInformation
     * @access public
     */
    public $insuranceInformation = null;

    /**
     *
     * @var insuranceDetails $insuranceDetails
     * @access public
     */
    public $insuranceDetails = null;

    /**
     *
     * @var hotelReservationInfo $hotelReservationInfo
     * @access public
     */
    public $hotelReservationInfo = null;

    /**
     *
     * @var typicalCarData $typicalCarData
     * @access public
     */
    public $typicalCarData = null;

    /**
     *
     * @var typicalCruiseData $typicalCruiseData
     * @access public
     */
    public $typicalCruiseData = null;

    /**
     *
     * @var railInfo $railInfo
     * @access public
     */
    public $railInfo = null;

    /**
     *
     * @var markerRailTour $markerRailTour
     * @access public
     */
    public $markerRailTour = null;

    /**
     *
     * @var tourInfo $tourInfo
     * @access public
     */
    public $tourInfo = null;

    /**
     *
     * @var ferryLegInformation $ferryLegInformation
     * @access public
     */
    public $ferryLegInformation = null;

    /**
     *
     * @var errorInfo $errorInfo
     * @access public
     */
    public $errorInfo = null;

    /**
     *
     * @var referenceForSegment $referenceForSegment
     * @access public
     */
    public $referenceForSegment = null;

}

class elementManagementItinerary {

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

    /**
     *
     * @var segmentName $segmentName
     * @access public
     */
    public $segmentName = null;

    /**
     *
     * @var lineNumber $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class travelProduct {

    /**
     *
     * @var product $product
     * @access public
     */
    public $product = null;
    public $company = null;

    /**
     *
     * @var boardpointDetail $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     *
     * @var offpointDetail $offpointDetail
     * @access public
     */
    public $offpointDetail = null;

    /**
     *
     * @var companyDetail $companyDetail
     * @access public
     */
    public $companyDetail = null;

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     *
     * @var typeDetail $typeDetail
     * @access public
     */
    public $typeDetail = null;

    /**
     *
     * @var processingIndicator $processingIndicator
     * @access public
     */
    public $processingIndicator = null;

}

class product {

    /**
     *
     * @var depDate $depDate
     * @access public
     */
    public $depDate = null;

    /**
     *
     * @var depTime $depTime
     * @access public
     */
    public $depTime = null;

    /**
     *
     * @var arrDate $arrDate
     * @access public
     */
    public $arrDate = null;

    /**
     *
     * @var arrTime $arrTime
     * @access public
     */
    public $arrTime = null;

    /**
     *
     * @var dayChangeIndicator $dayChangeIndicator
     * @access public
     */
    public $dayChangeIndicator = null;

}

class boardpointDetail {

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     *
     * @var cityName $cityName
     * @access public
     */
    public $cityName = null;

}

class offpointDetail {

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     *
     * @var cityName $cityName
     * @access public
     */
    public $cityName = null;

}

class companyDetail {

    /**
     *
     * @var identification $identification
     * @access public
     */
    public $identification = null;

    /**
     *
     * @var secondIdentification $secondIdentification
     * @access public
     */
    public $secondIdentification = null;

    /**
     *
     * @var sourceCode $sourceCode
     * @access public
     */
    public $sourceCode = null;

}

class typeDetail {

    /**
     *
     * @var detail $detail
     * @access public
     */
    public $detail = null;

}

class itineraryMessageAction {

    /**
     *
     * @var business $business
     * @access public
     */
    public $business = null;

}

class business {

    /**
     *
     * @var functionCustom $function
     * @access public
     */
    public $function = null;

}

class itineraryReservationInfo {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class relatedProduct {

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

}

class departureInformation {

    /**
     *
     * @var departTerminal $departTerminal
     * @access public
     */
    public $departTerminal = null;

}

class timeDetail {

    /**
     *
     * @var checkinTime $checkinTime
     * @access public
     */
    public $checkinTime = null;

}

class facilities {

    /**
     *
     * @var entertainement $entertainement
     * @access public
     */
    public $entertainement = null;

    /**
     *
     * @var entertainementDescription $entertainementDescription
     * @access public
     */
    public $entertainementDescription = null;

    /**
     *
     * @var productQualifier $productQualifier
     * @access public
     */
    public $productQualifier = null;

    /**
     *
     * @var productExtensionCode $productExtensionCode
     * @access public
     */
    public $productExtensionCode = null;

}

class selection {

    /**
     *
     * @var option $option
     * @access public
     */
    public $option = null;

    /**
     *
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class itineraryfreeFormText {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var text $text
     * @access public
     */
    public $text = null;

}

class itineraryFreetext {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var longFreetext $longFreetext
     * @access public
     */
    public $longFreetext = null;

}

class hotelProduct {

    /**
     *
     * @var property $property
     * @access public
     */
    public $property = null;

    /**
     *
     * @var hotelRoom $hotelRoom
     * @access public
     */
    public $hotelRoom = null;

    /**
     *
     * @var negotiated $negotiated
     * @access public
     */
    public $negotiated = null;

    /**
     *
     * @var otherHotelInfo $otherHotelInfo
     * @access public
     */
    public $otherHotelInfo = null;

}

class property {

    /**
     *
     * @var providerName $providerName
     * @access public
     */
    public $providerName = null;

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

}

class hotelRoom {

    /**
     *
     * @var occupancy $occupancy
     * @access public
     */
    public $occupancy = null;

    /**
     *
     * @var typeCode $typeCode
     * @access public
     */
    public $typeCode = null;

}

class negotiated {

    /**
     *
     * @var rateCode $rateCode
     * @access public
     */
    public $rateCode = null;

}

class otherHotelInfo {

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

}

class rateInformations {

    /**
     *
     * @var ratePrice $ratePrice
     * @access public
     */
    public $ratePrice = null;

    /**
     *
     * @var rateInfo $rateInfo
     * @access public
     */
    public $rateInfo = null;

    /**
     *
     * @var rateIndicator $rateIndicator
     * @access public
     */
    public $rateIndicator = null;

}

class ratePrice {

    /**
     *
     * @var rateAmount $rateAmount
     * @access public
     */
    public $rateAmount = null;

}

class rateInfo {

    /**
     *
     * @var ratePlan $ratePlan
     * @access public
     */
    public $ratePlan = null;

}

class rateIndicator {

    /**
     *
     * @var rateChangeIndicator $rateChangeIndicator
     * @access public
     */
    public $rateChangeIndicator = null;

}

class generalOption {

    /**
     *
     * @var optionDetail $optionDetail
     * @access public
     */
    public $optionDetail = null;

}

class optionDetail {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var updateIndicator $updateIndicator
     * @access public
     */
    public $updateIndicator = null;

    /**
     *
     * @var freetext $freetext
     * @access public
     */
    public $freetext = null;

}

class country {

    /**
     *
     * @var destinationCountryCode $destinationCountryCode
     * @access public
     */
    public $destinationCountryCode = null;

}

class itineraryMonetaryInformations {

    /**
     *
     * @var information $information
     * @access public
     */
    public $information = null;

}

class information {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

}

class taxInformation {

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class customerTransactionData {

    /**
     *
     * @var pos $pos
     * @access public
     */
    public $pos = null;

    /**
     *
     * @var flight $flight
     * @access public
     */
    public $flight = null;

    /**
     *
     * @var connection $connection
     * @access public
     */
    public $connection = null;

    /**
     *
     * @var codeShare $codeShare
     * @access public
     */
    public $codeShare = null;

}

class pos {

    /**
     *
     * @var classification $classification
     * @access public
     */
    public $classification = null;

    /**
     *
     * @var crs $crs
     * @access public
     */
    public $crs = null;

    /**
     *
     * @var pointOfSaleCountry $pointOfSaleCountry
     * @access public
     */
    public $pointOfSaleCountry = null;

}

class flight {

    /**
     *
     * @var cabin $cabin
     * @access public
     */
    public $cabin = null;

    /**
     *
     * @var subclass $subclass
     * @access public
     */
    public $subclass = null;

    /**
     *
     * @var flightType $flightType
     * @access public
     */
    public $flightType = null;

    /**
     *
     * @var overbooking $overbooking
     * @access public
     */
    public $overbooking = null;

}

class codeShare {

    /**
     *
     * @var airline $airline
     * @access public
     */
    public $airline = null;

    /**
     *
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     *
     * @var inventory $inventory
     * @access public
     */
    public $inventory = null;

    /**
     *
     * @var sellingClass $sellingClass
     * @access public
     */
    public $sellingClass = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var suffix $suffix
     * @access public
     */
    public $suffix = null;

}

class yieldData {

    /**
     *
     * @var scheduleChange $scheduleChange
     * @access public
     */
    public $scheduleChange = null;

    /**
     *
     * @var oversale $oversale
     * @access public
     */
    public $oversale = null;

    /**
     *
     * @var profitLossDetail $profitLossDetail
     * @access public
     */
    public $profitLossDetail = null;

}

class oversale {

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var oversaleNumber $oversaleNumber
     * @access public
     */
    public $oversaleNumber = null;

    /**
     *
     * @var oversaleIndicator $oversaleIndicator
     * @access public
     */
    public $oversaleIndicator = null;

}

class profitLossDetail {

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

}

class dateAndTime {

    /**
     *
     * @var firstDate $firstDate
     * @access public
     */
    public $firstDate = null;

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var locationIdentification $locationIdentification
     * @access public
     */
    public $locationIdentification = null;

}

class lccTypicalData {

    /**
     *
     * @var lccFareData $lccFareData
     * @access public
     */
    public $lccFareData = null;

    /**
     *
     * @var lccConnectionData $lccConnectionData
     * @access public
     */
    public $lccConnectionData = null;

}

class lccFareData {

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var rateInformation $rateInformation
     * @access public
     */
    public $rateInformation = null;

}

class rateInformation {

    /**
     *
     * @var fareGroup $fareGroup
     * @access public
     */
    public $fareGroup = null;

}

class lccConnectionData {

    /**
     *
     * @var iDSection $iDSection
     * @access public
     */
    public $iDSection = null;

}

class iDSection {

    /**
     *
     * @var iDSequenceNumber $iDSequenceNumber
     * @access public
     */
    public $iDSequenceNumber = null;

    /**
     *
     * @var iDQualifier $iDQualifier
     * @access public
     */
    public $iDQualifier = null;

}

class insuranceInformation {

    /**
     *
     * @var insuranceName $insuranceName
     * @access public
     */
    public $insuranceName = null;

    /**
     *
     * @var insuranceMonetaryInformation $insuranceMonetaryInformation
     * @access public
     */
    public $insuranceMonetaryInformation = null;

    /**
     *
     * @var insurancePremiumInfo $insurancePremiumInfo
     * @access public
     */
    public $insurancePremiumInfo = null;

    /**
     *
     * @var insuranceDocInfo $insuranceDocInfo
     * @access public
     */
    public $insuranceDocInfo = null;

}

class insuranceName {

    /**
     *
     * @var insuranceTravelerDetails $insuranceTravelerDetails
     * @access public
     */
    public $insuranceTravelerDetails = null;

    /**
     *
     * @var travelerPerpaxDetails $travelerPerpaxDetails
     * @access public
     */
    public $travelerPerpaxDetails = null;

}

class insuranceTravelerDetails {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var travellerSurname $travellerSurname
     * @access public
     */
    public $travellerSurname = null;

    /**
     *
     * @var travellerGivenName $travellerGivenName
     * @access public
     */
    public $travellerGivenName = null;

    /**
     *
     * @var travellerReferenceNumber $travellerReferenceNumber
     * @access public
     */
    public $travellerReferenceNumber = null;

    /**
     *
     * @var passengerBirthdate $passengerBirthdate
     * @access public
     */
    public $passengerBirthdate = null;

}

class travelerPerpaxDetails {

    /**
     *
     * @var perpaxMask $perpaxMask
     * @access public
     */
    public $perpaxMask = null;

    /**
     *
     * @var perpaxMaskIndicator $perpaxMaskIndicator
     * @access public
     */
    public $perpaxMaskIndicator = null;

}

class insuranceMonetaryInformation {

    /**
     *
     * @var information $information
     * @access public
     */
    public $information = null;

}

class insurancePremiumInfo {

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var supplementaryInformation $supplementaryInformation
     * @access public
     */
    public $supplementaryInformation = null;

    /**
     *
     * @var sexCode $sexCode
     * @access public
     */
    public $sexCode = null;

    /**
     *
     * @var creditCardDetails $creditCardDetails
     * @access public
     */
    public $creditCardDetails = null;

    /**
     *
     * @var totalPremiumCurrency $totalPremiumCurrency
     * @access public
     */
    public $totalPremiumCurrency = null;

    /**
     *
     * @var totalPremium $totalPremium
     * @access public
     */
    public $totalPremium = null;

    /**
     *
     * @var futureCurrency $futureCurrency
     * @access public
     */
    public $futureCurrency = null;

    /**
     *
     * @var futureAmount $futureAmount
     * @access public
     */
    public $futureAmount = null;

    /**
     *
     * @var fareType $fareType
     * @access public
     */
    public $fareType = null;

    /**
     *
     * @var travelerName $travelerName
     * @access public
     */
    public $travelerName = null;

}

class creditCardDetails {

    /**
     *
     * @var creditCardCompany $creditCardCompany
     * @access public
     */
    public $creditCardCompany = null;

    /**
     *
     * @var creditCardNumber $creditCardNumber
     * @access public
     */
    public $creditCardNumber = null;

    /**
     *
     * @var expirationDate $expirationDate
     * @access public
     */
    public $expirationDate = null;

}

class insuranceDocInfo {

    /**
     *
     * @var documentInformation $documentInformation
     * @access public
     */
    public $documentInformation = null;

    /**
     *
     * @var datesOfValidity $datesOfValidity
     * @access public
     */
    public $datesOfValidity = null;

}

class documentInformation {

    /**
     *
     * @var typeOfDocument $typeOfDocument
     * @access public
     */
    public $typeOfDocument = null;

    /**
     *
     * @var documentNumber $documentNumber
     * @access public
     */
    public $documentNumber = null;

    /**
     *
     * @var countryOfIssue $countryOfIssue
     * @access public
     */
    public $countryOfIssue = null;

}

class datesOfValidity {

    /**
     *
     * @var issueDate $issueDate
     * @access public
     */
    public $issueDate = null;

    /**
     *
     * @var expirationDate $expirationDate
     * @access public
     */
    public $expirationDate = null;

}

class insuranceDetails {

    /**
     *
     * @var providerProductDetails $providerProductDetails
     * @access public
     */
    public $providerProductDetails = null;

    /**
     *
     * @var substiteName $substiteName
     * @access public
     */
    public $substiteName = null;

    /**
     *
     * @var extraPremium $extraPremium
     * @access public
     */
    public $extraPremium = null;

    /**
     *
     * @var productSection $productSection
     * @access public
     */
    public $productSection = null;

    /**
     *
     * @var planCostInfo $planCostInfo
     * @access public
     */
    public $planCostInfo = null;

    /**
     *
     * @var planTypeDetails $planTypeDetails
     * @access public
     */
    public $planTypeDetails = null;

    /**
     *
     * @var contactDetails $contactDetails
     * @access public
     */
    public $contactDetails = null;

    /**
     *
     * @var subscriberAddressSection $subscriberAddressSection
     * @access public
     */
    public $subscriberAddressSection = null;

    /**
     *
     * @var coverageDetails $coverageDetails
     * @access public
     */
    public $coverageDetails = null;

    /**
     *
     * @var comissionAmount $comissionAmount
     * @access public
     */
    public $comissionAmount = null;

    /**
     *
     * @var insuranceFopSection $insuranceFopSection
     * @access public
     */
    public $insuranceFopSection = null;

    /**
     *
     * @var confirmationNumber $confirmationNumber
     * @access public
     */
    public $confirmationNumber = null;

    /**
     *
     * @var productKnowledge $productKnowledge
     * @access public
     */
    public $productKnowledge = null;

    /**
     *
     * @var passengerDetails $passengerDetails
     * @access public
     */
    public $passengerDetails = null;

    /**
     *
     * @var printInformation $printInformation
     * @access public
     */
    public $printInformation = null;

}

class providerProductDetails {

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     *
     * @var extraReference $extraReference
     * @access public
     */
    public $extraReference = null;

}

class substiteName {

    /**
     *
     * @var paxDetails $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     *
     * @var otherPaxDetails $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class paxDetails {

    /**
     *
     * @var surname $surname
     * @access public
     */
    public $surname = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

}

class otherPaxDetails {

    /**
     *
     * @var givenName $givenName
     * @access public
     */
    public $givenName = null;

}

class extraPremium {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class otherMonetaryDetails {

    /**
     *
     * @var typeQualifier $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class productSection {

    /**
     *
     * @var productCode $productCode
     * @access public
     */
    public $productCode = null;

    /**
     *
     * @var informationLines $informationLines
     * @access public
     */
    public $informationLines = null;

}

class productCode {

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     *
     * @var extensionIdentification $extensionIdentification
     * @access public
     */
    public $extensionIdentification = null;

    /**
     *
     * @var tariffCodeDetails $tariffCodeDetails
     * @access public
     */
    public $tariffCodeDetails = null;

}

class extensionIdentification {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var productFamilyCode $productFamilyCode
     * @access public
     */
    public $productFamilyCode = null;

}

class tariffCodeDetails {

    /**
     *
     * @var tariffCode $tariffCode
     * @access public
     */
    public $tariffCode = null;

    /**
     *
     * @var tariffCodeType $tariffCodeType
     * @access public
     */
    public $tariffCodeType = null;

}

class informationLines {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class planCostInfo {

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var chargeDetails $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class chargeDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class planTypeDetails {

    /**
     *
     * @var planType $planType
     * @access public
     */
    public $planType = null;

    /**
     *
     * @var travelValue $travelValue
     * @access public
     */
    public $travelValue = null;

}

class planType {

    /**
     *
     * @var tripType $tripType
     * @access public
     */
    public $tripType = null;

    /**
     *
     * @var tourOperator $tourOperator
     * @access public
     */
    public $tourOperator = null;

    /**
     *
     * @var countryInfo $countryInfo
     * @access public
     */
    public $countryInfo = null;

}

class countryInfo {

    /**
     *
     * @var geographicalZone $geographicalZone
     * @access public
     */
    public $geographicalZone = null;

    /**
     *
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

}

class travelValue {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class contactDetails {

    /**
     *
     * @var miscelaneous $miscelaneous
     * @access public
     */
    public $miscelaneous = null;

    /**
     *
     * @var phoneNumber $phoneNumber
     * @access public
     */
    public $phoneNumber = null;

    /**
     *
     * @var contactName $contactName
     * @access public
     */
    public $contactName = null;

}

class miscelaneous {

    /**
     *
     * @var remarkDetails $remarkDetails
     * @access public
     */
    public $remarkDetails = null;

}

class remarkDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var freetext $freetext
     * @access public
     */
    public $freetext = null;

}

class phoneNumber {

    /**
     *
     * @var phoneOrEmailType $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     *
     * @var telephoneNumber $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

    /**
     *
     * @var emailAddress $emailAddress
     * @access public
     */
    public $emailAddress = null;

}

class telephoneNumber {

    /**
     *
     * @var internationalDialCode $internationalDialCode
     * @access public
     */
    public $internationalDialCode = null;

    /**
     *
     * @var localPrefixCode $localPrefixCode
     * @access public
     */
    public $localPrefixCode = null;

    /**
     *
     * @var areaCode $areaCode
     * @access public
     */
    public $areaCode = null;

    /**
     *
     * @var telephoneNumber $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

}

class contactName {

    /**
     *
     * @var paxDetails $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     *
     * @var otherPaxDetails $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class subscriberAddressSection {

    /**
     *
     * @var nameDetails $nameDetails
     * @access public
     */
    public $nameDetails = null;

    /**
     *
     * @var addressInfo $addressInfo
     * @access public
     */
    public $addressInfo = null;

    /**
     *
     * @var phoneNumber $phoneNumber
     * @access public
     */
    public $phoneNumber = null;

}

class nameDetails {

    /**
     *
     * @var nameInformation $nameInformation
     * @access public
     */
    public $nameInformation = null;

}

class nameInformation {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

}

class addressInfo {

    /**
     *
     * @var addressDetails $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     *
     * @var city $city
     * @access public
     */
    public $city = null;

    /**
     *
     * @var zipCode $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     *
     * @var regionDetails $regionDetails
     * @access public
     */
    public $regionDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

}

class addressDetails {

    /**
     *
     * @var format $format
     * @access public
     */
    public $format = null;

    /**
     *
     * @var line1 $line1
     * @access public
     */
    public $line1 = null;

    /**
     *
     * @var line2 $line2
     * @access public
     */
    public $line2 = null;

    /**
     *
     * @var line4 $line4
     * @access public
     */
    public $line4 = null;

}

class regionDetails {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

}

class coverageDetails {

    /**
     *
     * @var policyDetails $policyDetails
     * @access public
     */
    public $policyDetails = null;

    /**
     *
     * @var coverageInfo $coverageInfo
     * @access public
     */
    public $coverageInfo = null;

    /**
     *
     * @var coveredPassenger $coveredPassenger
     * @access public
     */
    public $coveredPassenger = null;

    /**
     *
     * @var coverageDates $coverageDates
     * @access public
     */
    public $coverageDates = null;

    /**
     *
     * @var subscriptionDetails $subscriptionDetails
     * @access public
     */
    public $subscriptionDetails = null;

    /**
     *
     * @var agentReferenceDetails $agentReferenceDetails
     * @access public
     */
    public $agentReferenceDetails = null;

}

class policyDetails {

    /**
     *
     * @var fareDiscount $fareDiscount
     * @access public
     */
    public $fareDiscount = null;

}

class coverageInfo {

    /**
     *
     * @var coverage $coverage
     * @access public
     */
    public $coverage = null;

    /**
     *
     * @var coverageValues $coverageValues
     * @access public
     */
    public $coverageValues = null;

}

class coverage {

    /**
     *
     * @var coverageIndicator $coverageIndicator
     * @access public
     */
    public $coverageIndicator = null;

}

class coverageValues {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class coveredPassenger {

    /**
     *
     * @var paxDetails $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     *
     * @var otherPaxDetails $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class coverageDates {

    /**
     *
     * @var beginDateTime $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     *
     * @var endDateTime $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class subscriptionDetails {

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class agentReferenceDetails {

    /**
     *
     * @var originator $originator
     * @access public
     */
    public $originator = null;

}

class comissionAmount {

    /**
     *
     * @var commissionDetails $commissionDetails
     * @access public
     */
    public $commissionDetails = null;

}

class commissionDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     *
     * @var dealNumber $dealNumber
     * @access public
     */
    public $dealNumber = null;

}

class insuranceFopSection {

    /**
     *
     * @var formOfPaymentSection $formOfPaymentSection
     * @access public
     */
    public $formOfPaymentSection = null;

    /**
     *
     * @var fopExtendedData $fopExtendedData
     * @access public
     */
    public $fopExtendedData = null;

}

class formOfPaymentSection {

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     *
     * @var otherFormOfPayment $otherFormOfPayment
     * @access public
     */
    public $otherFormOfPayment = null;

}

class otherFormOfPayment {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var vendorCode $vendorCode
     * @access public
     */
    public $vendorCode = null;

    /**
     *
     * @var creditCardNumber $creditCardNumber
     * @access public
     */
    public $creditCardNumber = null;

    /**
     *
     * @var expiryDate $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     *
     * @var approvalCode $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     *
     * @var sourceOfApproval $sourceOfApproval
     * @access public
     */
    public $sourceOfApproval = null;

    /**
     *
     * @var authorisedAmount $authorisedAmount
     * @access public
     */
    public $authorisedAmount = null;

    /**
     *
     * @var addressVerification $addressVerification
     * @access public
     */
    public $addressVerification = null;

    /**
     *
     * @var customerAccount $customerAccount
     * @access public
     */
    public $customerAccount = null;

    /**
     *
     * @var extendedPayment $extendedPayment
     * @access public
     */
    public $extendedPayment = null;

    /**
     *
     * @var fopFreeText $fopFreeText
     * @access public
     */
    public $fopFreeText = null;

    /**
     *
     * @var membershipStatus $membershipStatus
     * @access public
     */
    public $membershipStatus = null;

    /**
     *
     * @var transactionInfo $transactionInfo
     * @access public
     */
    public $transactionInfo = null;

}

class fopExtendedData {

    /**
     *
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

    /**
     *
     * @var otherStatusDetails $otherStatusDetails
     * @access public
     */
    public $otherStatusDetails = null;

}

class otherStatusDetails {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class confirmationNumber {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class productKnowledge {

    /**
     *
     * @var numberOfItemsDetails $numberOfItemsDetails
     * @access public
     */
    public $numberOfItemsDetails = null;

}

class passengerDetails {

    /**
     *
     * @var passengerAssociation $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     *
     * @var perPaxProdKnowledge $perPaxProdKnowledge
     * @access public
     */
    public $perPaxProdKnowledge = null;

    /**
     *
     * @var dateOfBirthInfo $dateOfBirthInfo
     * @access public
     */
    public $dateOfBirthInfo = null;

    /**
     *
     * @var passengerFeatures $passengerFeatures
     * @access public
     */
    public $passengerFeatures = null;

    /**
     *
     * @var insureeRemark $insureeRemark
     * @access public
     */
    public $insureeRemark = null;

    /**
     *
     * @var travelerDocInfo $travelerDocInfo
     * @access public
     */
    public $travelerDocInfo = null;

    /**
     *
     * @var policyDetails $policyDetails
     * @access public
     */
    public $policyDetails = null;

    /**
     *
     * @var travelerValueDetails $travelerValueDetails
     * @access public
     */
    public $travelerValueDetails = null;

    /**
     *
     * @var premiumPerTariffPerPax $premiumPerTariffPerPax
     * @access public
     */
    public $premiumPerTariffPerPax = null;

    /**
     *
     * @var premiumPerpaxInfo $premiumPerpaxInfo
     * @access public
     */
    public $premiumPerpaxInfo = null;

    /**
     *
     * @var voucherNumber $voucherNumber
     * @access public
     */
    public $voucherNumber = null;

}

class passengerAssociation {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class perPaxProdKnowledge {

    /**
     *
     * @var numberOfItemsDetails $numberOfItemsDetails
     * @access public
     */
    public $numberOfItemsDetails = null;

}

class dateOfBirthInfo {

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class passengerFeatures {

    /**
     *
     * @var paxDetails $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     *
     * @var otherPaxDetails $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class insureeRemark {

    /**
     *
     * @var remarkDetails $remarkDetails
     * @access public
     */
    public $remarkDetails = null;

}

class travelerDocInfo {

    /**
     *
     * @var birthDate $birthDate
     * @access public
     */
    public $birthDate = null;

    /**
     *
     * @var documentDetails $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class travelerValueDetails {

    /**
     *
     * @var travelCost $travelCost
     * @access public
     */
    public $travelCost = null;

    /**
     *
     * @var travelAmount $travelAmount
     * @access public
     */
    public $travelAmount = null;

}

class travelCost {

    /**
     *
     * @var coverageIndicator $coverageIndicator
     * @access public
     */
    public $coverageIndicator = null;

}

class travelAmount {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class premiumPerTariffPerPax {

    /**
     *
     * @var tariffCodeInfo $tariffCodeInfo
     * @access public
     */
    public $tariffCodeInfo = null;

    /**
     *
     * @var tariffCodePerPaxAmount $tariffCodePerPaxAmount
     * @access public
     */
    public $tariffCodePerPaxAmount = null;

}

class tariffCodeInfo {

    /**
     *
     * @var tariffCodeDetails $tariffCodeDetails
     * @access public
     */
    public $tariffCodeDetails = null;

}

class tariffCodePerPaxAmount {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class premiumPerpaxInfo {

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var chargeDetails $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class voucherNumber {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class printInformation {

    /**
     *
     * @var documentDetails $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class hotelReservationInfo {

    /**
     *
     * @var hotelPropertyInfo $hotelPropertyInfo
     * @access public
     */
    public $hotelPropertyInfo = null;

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var requestedDates $requestedDates
     * @access public
     */
    public $requestedDates = null;

    /**
     *
     * @var roomRateDetails $roomRateDetails
     * @access public
     */
    public $roomRateDetails = null;

    /**
     *
     * @var cancelOrConfirmNbr $cancelOrConfirmNbr
     * @access public
     */
    public $cancelOrConfirmNbr = null;

    /**
     *
     * @var roomstayIndex $roomstayIndex
     * @access public
     */
    public $roomstayIndex = null;

    /**
     *
     * @var bookingSource $bookingSource
     * @access public
     */
    public $bookingSource = null;

    /**
     *
     * @var billableInfo $billableInfo
     * @access public
     */
    public $billableInfo = null;

    /**
     *
     * @var customerInfo $customerInfo
     * @access public
     */
    public $customerInfo = null;

    /**
     *
     * @var frequentTravellerInfo $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     *
     * @var guaranteeOrDeposit $guaranteeOrDeposit
     * @access public
     */
    public $guaranteeOrDeposit = null;

    /**
     *
     * @var textOptions $textOptions
     * @access public
     */
    public $textOptions = null;

    /**
     *
     * @var savingAmountInfo $savingAmountInfo
     * @access public
     */
    public $savingAmountInfo = null;

    /**
     *
     * @var writtenConfirmationContact $writtenConfirmationContact
     * @access public
     */
    public $writtenConfirmationContact = null;

    /**
     *
     * @var writtenConfirmationInfo $writtenConfirmationInfo
     * @access public
     */
    public $writtenConfirmationInfo = null;

    /**
     *
     * @var documentInformationDetails $documentInformationDetails
     * @access public
     */
    public $documentInformationDetails = null;

    /**
     *
     * @var arrivalFlightDetails $arrivalFlightDetails
     * @access public
     */
    public $arrivalFlightDetails = null;

}

class hotelPropertyInfo {

    /**
     *
     * @var hotelReference $hotelReference
     * @access public
     */
    public $hotelReference = null;

    /**
     *
     * @var hotelName $hotelName
     * @access public
     */
    public $hotelName = null;

    /**
     *
     * @var fireSafetyIndicator $fireSafetyIndicator
     * @access public
     */
    public $fireSafetyIndicator = null;

}

class hotelReference {

    /**
     *
     * @var chainCode $chainCode
     * @access public
     */
    public $chainCode = null;

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     *
     * @var hotelCode $hotelCode
     * @access public
     */
    public $hotelCode = null;

}

class requestedDates {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var timeMode $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     *
     * @var beginDateTime $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     *
     * @var endDateTime $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class roomRateDetails {

    /**
     *
     * @var roomInformation $roomInformation
     * @access public
     */
    public $roomInformation = null;

    /**
     *
     * @var children $children
     * @access public
     */
    public $children = null;

    /**
     *
     * @var tariffDetails $tariffDetails
     * @access public
     */
    public $tariffDetails = null;

    /**
     *
     * @var rateCodeIndicator $rateCodeIndicator
     * @access public
     */
    public $rateCodeIndicator = null;

}

class roomInformation {

    /**
     *
     * @var roomRateIdentifier $roomRateIdentifier
     * @access public
     */
    public $roomRateIdentifier = null;

    /**
     *
     * @var bookingCode $bookingCode
     * @access public
     */
    public $bookingCode = null;

    /**
     *
     * @var guestCountDetails $guestCountDetails
     * @access public
     */
    public $guestCountDetails = null;

    /**
     *
     * @var roomTypeOverride $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class roomRateIdentifier {

    /**
     *
     * @var roomType $roomType
     * @access public
     */
    public $roomType = null;

    /**
     *
     * @var ratePlanCode $ratePlanCode
     * @access public
     */
    public $ratePlanCode = null;

    /**
     *
     * @var rateCategoryCode $rateCategoryCode
     * @access public
     */
    public $rateCategoryCode = null;

    /**
     *
     * @var rateQualifiedIndic $rateQualifiedIndic
     * @access public
     */
    public $rateQualifiedIndic = null;

}

class guestCountDetails {

    /**
     *
     * @var numberOfUnit $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     *
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class children {

    /**
     *
     * @var age $age
     * @access public
     */
    public $age = null;

    /**
     *
     * @var referenceForPassenger $referenceForPassenger
     * @access public
     */
    public $referenceForPassenger = null;

}

class age {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class referenceForPassenger {

    /**
     *
     * @var passengerReference $passengerReference
     * @access public
     */
    public $passengerReference = null;

}

class passengerReference {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

}

class tariffDetails {

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var rateInformation $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     *
     * @var chargeDetails $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class rateCodeIndicator {

    /**
     *
     * @var ruleDetails $ruleDetails
     * @access public
     */
    public $ruleDetails = null;

    /**
     *
     * @var ruleStatusDetails $ruleStatusDetails
     * @access public
     */
    public $ruleStatusDetails = null;

}

class ruleDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var quantityUnit $quantityUnit
     * @access public
     */
    public $quantityUnit = null;

}

class ruleStatusDetails {

    /**
     *
     * @var statusType $statusType
     * @access public
     */
    public $statusType = null;

    /**
     *
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class cancelOrConfirmNbr {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class roomstayIndex {

    /**
     *
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class bookingSource {

    /**
     *
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

}

class billableInfo {

    /**
     *
     * @var billingInfo $billingInfo
     * @access public
     */
    public $billingInfo = null;

}

class billingInfo {

    /**
     *
     * @var billingDetails $billingDetails
     * @access public
     */
    public $billingDetails = null;

    /**
     *
     * @var billingQualifier $billingQualifier
     * @access public
     */
    public $billingQualifier = null;

}

class customerInfo {

    /**
     *
     * @var customerReferences $customerReferences
     * @access public
     */
    public $customerReferences = null;

}

class airlineFrequentTraveler {

    /**
     *
     * @var company $company
     * @access public
     */
    public $company = null;

    /**
     *
     * @var membershipNumber $membershipNumber
     * @access public
     */
    public $membershipNumber = null;

    /**
     *
     * @var tierLevel $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     *
     * @var priorityCode $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     *
     * @var tierDescription $tierDescription
     * @access public
     */
    public $tierDescription = null;

}

class allianceFrequentTraveler {

    /**
     *
     * @var tierLevel $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     *
     * @var priorityCode $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     *
     * @var tierDescription $tierDescription
     * @access public
     */
    public $tierDescription = null;

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

}

class guaranteeOrDeposit {

    /**
     *
     * @var paymentInfo $paymentInfo
     * @access public
     */
    public $paymentInfo = null;

    /**
     *
     * @var creditCardInfo $creditCardInfo
     * @access public
     */
    public $creditCardInfo = null;

}

class paymentInfo {

    /**
     *
     * @var paymentDetails $paymentDetails
     * @access public
     */
    public $paymentDetails = null;

}

class paymentDetails {

    /**
     *
     * @var formOfPaymentCode $formOfPaymentCode
     * @access public
     */
    public $formOfPaymentCode = null;

    /**
     *
     * @var paymentType $paymentType
     * @access public
     */
    public $paymentType = null;

    /**
     *
     * @var serviceToPay $serviceToPay
     * @access public
     */
    public $serviceToPay = null;

    /**
     *
     * @var referenceNumber $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

}

class creditCardInfo {

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class textOptions {

    /**
     *
     * @var remarkDetails $remarkDetails
     * @access public
     */
    public $remarkDetails = null;

}

class savingAmountInfo {

    /**
     *
     * @var information $information
     * @access public
     */
    public $information = null;

}

class writtenConfirmationContact {

    /**
     *
     * @var contactInformation $contactInformation
     * @access public
     */
    public $contactInformation = null;

}

class contactInformation {

    /**
     *
     * @var partyQualifier $partyQualifier
     * @access public
     */
    public $partyQualifier = null;

    /**
     *
     * @var comAddress $comAddress
     * @access public
     */
    public $comAddress = null;

    /**
     *
     * @var comChannelQualifier $comChannelQualifier
     * @access public
     */
    public $comChannelQualifier = null;

}

class writtenConfirmationInfo {

    /**
     *
     * @var partyQualifier $partyQualifier
     * @access public
     */
    public $partyQualifier = null;

    /**
     *
     * @var addressDetails $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     *
     * @var partyNameDetails $partyNameDetails
     * @access public
     */
    public $partyNameDetails = null;

}

class partyNameDetails {

    /**
     *
     * @var name1 $name1
     * @access public
     */
    public $name1 = null;

}

class documentInformationDetails {

    /**
     *
     * @var documentDetails $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class arrivalFlightDetails {

    /**
     *
     * @var travelProductInformation $travelProductInformation
     * @access public
     */
    public $travelProductInformation = null;

    /**
     *
     * @var additionalTransportDetails $additionalTransportDetails
     * @access public
     */
    public $additionalTransportDetails = null;

}

class additionalTransportDetails {

    /**
     *
     * @var terminalInformation $terminalInformation
     * @access public
     */
    public $terminalInformation = null;

}

class terminalInformation {

    /**
     *
     * @var arrivalTerminal $arrivalTerminal
     * @access public
     */
    public $arrivalTerminal = null;

}

class typicalCarData {

    /**
     *
     * @var vehicleInformation $vehicleInformation
     * @access public
     */
    public $vehicleInformation = null;

    /**
     *
     * @var additionalInfo $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

    /**
     *
     * @var voucherPrintAck $voucherPrintAck
     * @access public
     */
    public $voucherPrintAck = null;

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var locationInfo $locationInfo
     * @access public
     */
    public $locationInfo = null;

    /**
     *
     * @var deliveryAndCollection $deliveryAndCollection
     * @access public
     */
    public $deliveryAndCollection = null;

    /**
     *
     * @var pickupDropoffTimes $pickupDropoffTimes
     * @access public
     */
    public $pickupDropoffTimes = null;

    /**
     *
     * @var cancelOrConfirmNbr $cancelOrConfirmNbr
     * @access public
     */
    public $cancelOrConfirmNbr = null;

    /**
     *
     * @var rateCodeGroup $rateCodeGroup
     * @access public
     */
    public $rateCodeGroup = null;

    /**
     *
     * @var fFlyerNbr $fFlyerNbr
     * @access public
     */
    public $fFlyerNbr = null;

    /**
     *
     * @var customerInfo $customerInfo
     * @access public
     */
    public $customerInfo = null;

    /**
     *
     * @var rateInfo $rateInfo
     * @access public
     */
    public $rateInfo = null;

    /**
     *
     * @var errorWarning $errorWarning
     * @access public
     */
    public $errorWarning = null;

    /**
     *
     * @var rulesPoliciesGroup $rulesPoliciesGroup
     * @access public
     */
    public $rulesPoliciesGroup = null;

    /**
     *
     * @var payment $payment
     * @access public
     */
    public $payment = null;

    /**
     *
     * @var billingData $billingData
     * @access public
     */
    public $billingData = null;

    /**
     *
     * @var bookingSource $bookingSource
     * @access public
     */
    public $bookingSource = null;

    /**
     *
     * @var inclusiveTour $inclusiveTour
     * @access public
     */
    public $inclusiveTour = null;

    /**
     *
     * @var marketingInfo $marketingInfo
     * @access public
     */
    public $marketingInfo = null;

    /**
     *
     * @var supleInfo $supleInfo
     * @access public
     */
    public $supleInfo = null;

    /**
     *
     * @var estimatedDistance $estimatedDistance
     * @access public
     */
    public $estimatedDistance = null;

    /**
     *
     * @var agentInformation $agentInformation
     * @access public
     */
    public $agentInformation = null;

    /**
     *
     * @var trackingOpt $trackingOpt
     * @access public
     */
    public $trackingOpt = null;

    /**
     *
     * @var electronicVoucherNumber $electronicVoucherNumber
     * @access public
     */
    public $electronicVoucherNumber = null;

    /**
     *
     * @var customerEmail $customerEmail
     * @access public
     */
    public $customerEmail = null;

    /**
     *
     * @var attribute $attribute
     * @access public
     */
    public $attribute = null;

}

class vehicleInformation {

    /**
     *
     * @var vehicleCharacteristic $vehicleCharacteristic
     * @access public
     */
    public $vehicleCharacteristic = null;

    /**
     *
     * @var vehSpecialEquipment $vehSpecialEquipment
     * @access public
     */
    public $vehSpecialEquipment = null;

    /**
     *
     * @var vehicleInfo $vehicleInfo
     * @access public
     */
    public $vehicleInfo = null;

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var carModel $carModel
     * @access public
     */
    public $carModel = null;

}

class vehicleCharacteristic {

    /**
     *
     * @var vehicleTypeOwner $vehicleTypeOwner
     * @access public
     */
    public $vehicleTypeOwner = null;

    /**
     *
     * @var vehicleRentalPrefType $vehicleRentalPrefType
     * @access public
     */
    public $vehicleRentalPrefType = null;

}

class vehicleInfo {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     *
     * @var unit $unit
     * @access public
     */
    public $unit = null;

}

class additionalInfo {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class voucherPrintAck {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class locationInfo {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class locationDescription {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

}

class firstLocationDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var agency $agency
     * @access public
     */
    public $agency = null;

}

class deliveryAndCollection {

    /**
     *
     * @var addressDeliveryCollection $addressDeliveryCollection
     * @access public
     */
    public $addressDeliveryCollection = null;

    /**
     *
     * @var phoneNumber $phoneNumber
     * @access public
     */
    public $phoneNumber = null;

}

class addressDeliveryCollection {

    /**
     *
     * @var addressUsageDetails $addressUsageDetails
     * @access public
     */
    public $addressUsageDetails = null;

    /**
     *
     * @var addressDetails $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     *
     * @var city $city
     * @access public
     */
    public $city = null;

    /**
     *
     * @var zipCode $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     *
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     *
     * @var regionDetails $regionDetails
     * @access public
     */
    public $regionDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

}

class addressUsageDetails {

    /**
     *
     * @var purpose $purpose
     * @access public
     */
    public $purpose = null;

}

class telephoneNumberDetails {

    /**
     *
     * @var telephoneNumber $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

}

class pickupDropoffTimes {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var timeMode $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     *
     * @var beginDateTime $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     *
     * @var endDateTime $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class rateCodeGroup {

    /**
     *
     * @var rateCodeInfo $rateCodeInfo
     * @access public
     */
    public $rateCodeInfo = null;

    /**
     *
     * @var additionalInfo $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

}

class rateCodeInfo {

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

}

class fFlyerNbr {

    /**
     *
     * @var airlineFrequentTraveler $airlineFrequentTraveler
     * @access public
     */
    public $airlineFrequentTraveler = null;

}

class errorWarning {

    /**
     *
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     *
     * @var errorFreeText $errorFreeText
     * @access public
     */
    public $errorFreeText = null;

}

class rulesPoliciesGroup {

    /**
     *
     * @var dummy1 $dummy1
     * @access public
     */
    public $dummy1 = null;

    /**
     *
     * @var sourceLevel $sourceLevel
     * @access public
     */
    public $sourceLevel = null;

    /**
     *
     * @var remarks $remarks
     * @access public
     */
    public $remarks = null;

    /**
     *
     * @var taxCovSurchargeGroup $taxCovSurchargeGroup
     * @access public
     */
    public $taxCovSurchargeGroup = null;

    /**
     *
     * @var otherRulesGroup $otherRulesGroup
     * @access public
     */
    public $otherRulesGroup = null;

    /**
     *
     * @var pickupDropoffLocation $pickupDropoffLocation
     * @access public
     */
    public $pickupDropoffLocation = null;

    /**
     *
     * @var specialEquipmentDetails $specialEquipmentDetails
     * @access public
     */
    public $specialEquipmentDetails = null;

}

class dummy1 {

}

class sourceLevel {

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

}

class remarks {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class taxCovSurchargeGroup {

    /**
     *
     * @var taxSurchargeCoverageInfo $taxSurchargeCoverageInfo
     * @access public
     */
    public $taxSurchargeCoverageInfo = null;

    /**
     *
     * @var additionalInfo $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

    /**
     *
     * @var surchargePeriods $surchargePeriods
     * @access public
     */
    public $surchargePeriods = null;

}

class taxSurchargeCoverageInfo {

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var chargeDetails $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class surchargePeriods {

    /**
     *
     * @var period $period
     * @access public
     */
    public $period = null;

    /**
     *
     * @var surchargePeriodTariff $surchargePeriodTariff
     * @access public
     */
    public $surchargePeriodTariff = null;

    /**
     *
     * @var maximumUnitQualifier $maximumUnitQualifier
     * @access public
     */
    public $maximumUnitQualifier = null;

}

class period {

    /**
     *
     * @var rangeQualifier $rangeQualifier
     * @access public
     */
    public $rangeQualifier = null;

    /**
     *
     * @var rangeDetails $rangeDetails
     * @access public
     */
    public $rangeDetails = null;

}

class rangeDetails {

    /**
     *
     * @var dataType $dataType
     * @access public
     */
    public $dataType = null;

    /**
     *
     * @var min $min
     * @access public
     */
    public $min = null;

    /**
     *
     * @var max $max
     * @access public
     */
    public $max = null;

}

class surchargePeriodTariff {

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var chargeDetails $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class maximumUnitQualifier {

    /**
     *
     * @var measurementQualifier $measurementQualifier
     * @access public
     */
    public $measurementQualifier = null;

    /**
     *
     * @var valueRange $valueRange
     * @access public
     */
    public $valueRange = null;

}

class valueRange {

    /**
     *
     * @var measureUnitQualifier $measureUnitQualifier
     * @access public
     */
    public $measureUnitQualifier = null;

}

class otherRulesGroup {

    /**
     *
     * @var otherRules $otherRules
     * @access public
     */
    public $otherRules = null;

    /**
     *
     * @var dateTimeInfo $dateTimeInfo
     * @access public
     */
    public $dateTimeInfo = null;

}

class otherRules {

    /**
     *
     * @var ruleDetails $ruleDetails
     * @access public
     */
    public $ruleDetails = null;

    /**
     *
     * @var ruleText $ruleText
     * @access public
     */
    public $ruleText = null;

}

class ruleText {

    /**
     *
     * @var textType $textType
     * @access public
     */
    public $textType = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class pickupDropoffLocation {

    /**
     *
     * @var locationInfo $locationInfo
     * @access public
     */
    public $locationInfo = null;

    /**
     *
     * @var address $address
     * @access public
     */
    public $address = null;

    /**
     *
     * @var openingHours $openingHours
     * @access public
     */
    public $openingHours = null;

    /**
     *
     * @var phone $phone
     * @access public
     */
    public $phone = null;

}

class address {

    /**
     *
     * @var addressDetails $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     *
     * @var city $city
     * @access public
     */
    public $city = null;

    /**
     *
     * @var zipCode $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     *
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     *
     * @var regionDetails $regionDetails
     * @access public
     */
    public $regionDetails = null;

}

class openingHours {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var timeMode $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     *
     * @var beginDateTime $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     *
     * @var endDateTime $endDateTime
     * @access public
     */
    public $endDateTime = null;

    /**
     *
     * @var frequency $frequency
     * @access public
     */
    public $frequency = null;

}

class phone {

    /**
     *
     * @var phoneOrEmailType $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     *
     * @var emailAddress $emailAddress
     * @access public
     */
    public $emailAddress = null;

}

class specialEquipmentDetails {

    /**
     *
     * @var dummy2 $dummy2
     * @access public
     */
    public $dummy2 = null;

    /**
     *
     * @var rangePeriod $rangePeriod
     * @access public
     */
    public $rangePeriod = null;

    /**
     *
     * @var additionalInfo $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

    /**
     *
     * @var specialEquipmentTariff $specialEquipmentTariff
     * @access public
     */
    public $specialEquipmentTariff = null;

}

class dummy2 {

}

class rangePeriod {

    /**
     *
     * @var agePeriod $agePeriod
     * @access public
     */
    public $agePeriod = null;

    /**
     *
     * @var maximumUnitQualifier $maximumUnitQualifier
     * @access public
     */
    public $maximumUnitQualifier = null;

}

class agePeriod {

    /**
     *
     * @var rangeQualifier $rangeQualifier
     * @access public
     */
    public $rangeQualifier = null;

    /**
     *
     * @var rangeDetails $rangeDetails
     * @access public
     */
    public $rangeDetails = null;

}

class specialEquipmentTariff {

    /**
     *
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     *
     * @var chargeDetails $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class payment {

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class billingData {

    /**
     *
     * @var billingInfo $billingInfo
     * @access public
     */
    public $billingInfo = null;

}

class originatorDetails {

    /**
     *
     * @var originatorId $originatorId
     * @access public
     */
    public $originatorId = null;

}

class inclusiveTour {

    /**
     *
     * @var tourInformationDetails $tourInformationDetails
     * @access public
     */
    public $tourInformationDetails = null;

}

class tourInformationDetails {

    /**
     *
     * @var tourCode $tourCode
     * @access public
     */
    public $tourCode = null;

}

class marketingInfo {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var text $text
     * @access public
     */
    public $text = null;

}

class supleInfo {

    /**
     *
     * @var remarkDetails $remarkDetails
     * @access public
     */
    public $remarkDetails = null;

}

class estimatedDistance {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class agentInformation {

    /**
     *
     * @var nameInformation $nameInformation
     * @access public
     */
    public $nameInformation = null;

}

class trackingOpt {

    /**
     *
     * @var agreementDetails $agreementDetails
     * @access public
     */
    public $agreementDetails = null;

}

class agreementDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class electronicVoucherNumber {

    /**
     *
     * @var documentDetails $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class customerEmail {

    /**
     *
     * @var contact $contact
     * @access public
     */
    public $contact = null;

}

class contact {

    /**
     *
     * @var email $email
     * @access public
     */
    public $email = null;

    /**
     *
     * @var contactQualifier $contactQualifier
     * @access public
     */
    public $contactQualifier = null;

}

class attribute {

    /**
     *
     * @var criteriaSetType $criteriaSetType
     * @access public
     */
    public $criteriaSetType = null;

    /**
     *
     * @var criteriaDetails $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class criteriaDetails {

    /**
     *
     * @var attributeType $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     *
     * @var attributeDescription $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class typicalCruiseData {

    /**
     *
     * @var sailingShipInformation $sailingShipInformation
     * @access public
     */
    public $sailingShipInformation = null;

    /**
     *
     * @var sailingProviderInformation $sailingProviderInformation
     * @access public
     */
    public $sailingProviderInformation = null;

    /**
     *
     * @var sailingPortsInformation $sailingPortsInformation
     * @access public
     */
    public $sailingPortsInformation = null;

    /**
     *
     * @var sailingDateInformation $sailingDateInformation
     * @access public
     */
    public $sailingDateInformation = null;

    /**
     *
     * @var passengerInfo $passengerInfo
     * @access public
     */
    public $passengerInfo = null;

    /**
     *
     * @var bookingDetails $bookingDetails
     * @access public
     */
    public $bookingDetails = null;

    /**
     *
     * @var bookingDate $bookingDate
     * @access public
     */
    public $bookingDate = null;

    /**
     *
     * @var sailingGroupInformation $sailingGroupInformation
     * @access public
     */
    public $sailingGroupInformation = null;

}

class sailingShipInformation {

    /**
     *
     * @var shipDetails $shipDetails
     * @access public
     */
    public $shipDetails = null;

}

class shipDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var cruiseLineCode $cruiseLineCode
     * @access public
     */
    public $cruiseLineCode = null;

}

class sailingProviderInformation {

    /**
     *
     * @var travelSector $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     *
     * @var companyCodeContext $companyCodeContext
     * @access public
     */
    public $companyCodeContext = null;

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var companyName $companyName
     * @access public
     */
    public $companyName = null;

}

class sailingPortsInformation {

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

    /**
     *
     * @var secondLocationDetails $secondLocationDetails
     * @access public
     */
    public $secondLocationDetails = null;

}

class secondLocationDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

}

class sailingDateInformation {

    /**
     *
     * @var beginDateTime $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     *
     * @var endDateTime $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class passengerInfo {

    /**
     *
     * @var paxDetails $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     *
     * @var otherPaxDetails $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class bookingDetails {

    /**
     *
     * @var cruiseBookingReferenceInfo $cruiseBookingReferenceInfo
     * @access public
     */
    public $cruiseBookingReferenceInfo = null;

    /**
     *
     * @var bookingCompany $bookingCompany
     * @access public
     */
    public $bookingCompany = null;

}

class cruiseBookingReferenceInfo {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class bookingCompany {

    /**
     *
     * @var travelSector $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     *
     * @var companyCodeContext $companyCodeContext
     * @access public
     */
    public $companyCodeContext = null;

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var companyName $companyName
     * @access public
     */
    public $companyName = null;

}

class bookingDate {

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class sailingGroupInformation {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class railInfo {

    /**
     *
     * @var companyInfo $companyInfo
     * @access public
     */
    public $companyInfo = null;

    /**
     *
     * @var updatePermission $updatePermission
     * @access public
     */
    public $updatePermission = null;

    /**
     *
     * @var tripDetails $tripDetails
     * @access public
     */
    public $tripDetails = null;

    /**
     *
     * @var openSegment $openSegment
     * @access public
     */
    public $openSegment = null;

    /**
     *
     * @var journeyDirection $journeyDirection
     * @access public
     */
    public $journeyDirection = null;

    /**
     *
     * @var providerTattoo $providerTattoo
     * @access public
     */
    public $providerTattoo = null;

    /**
     *
     * @var serviceInfo $serviceInfo
     * @access public
     */
    public $serviceInfo = null;

    /**
     *
     * @var classInfo $classInfo
     * @access public
     */
    public $classInfo = null;

    /**
     *
     * @var accommodationInfo $accommodationInfo
     * @access public
     */
    public $accommodationInfo = null;

    /**
     *
     * @var coachInfo $coachInfo
     * @access public
     */
    public $coachInfo = null;

    /**
     *
     * @var reservableStatus $reservableStatus
     * @access public
     */
    public $reservableStatus = null;

}

class companyInfo {

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var companyNumericCode $companyNumericCode
     * @access public
     */
    public $companyNumericCode = null;

}

class updatePermission {

    /**
     *
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class trainProductInfo {

    /**
     *
     * @var trainDetails $trainDetails
     * @access public
     */
    public $trainDetails = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

}

class trainDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

}

class tripDateTime {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class depLocation {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class arrLocation {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class railLeg {

    /**
     *
     * @var trainProductInfo $trainProductInfo
     * @access public
     */
    public $trainProductInfo = null;

    /**
     *
     * @var reservableStatus $reservableStatus
     * @access public
     */
    public $reservableStatus = null;

    /**
     *
     * @var legDateTime $legDateTime
     * @access public
     */
    public $legDateTime = null;

    /**
     *
     * @var depLocation $depLocation
     * @access public
     */
    public $depLocation = null;

    /**
     *
     * @var arrLocation $arrLocation
     * @access public
     */
    public $arrLocation = null;

    /**
     *
     * @var legReference $legReference
     * @access public
     */
    public $legReference = null;

}

class reservableStatus {

    /**
     *
     * @var accoStatus $accoStatus
     * @access public
     */
    public $accoStatus = null;

}

class accoStatus {

    /**
     *
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class legDateTime {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class legReference {

    /**
     *
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class openSegment {

    /**
     *
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class journeyDirection {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

}

class providerTattoo {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class serviceInfo {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class classInfo {

    /**
     *
     * @var classDetails $classDetails
     * @access public
     */
    public $classDetails = null;

}

class classDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var bookingClass $bookingClass
     * @access public
     */
    public $bookingClass = null;

    /**
     *
     * @var numberOfSeats $numberOfSeats
     * @access public
     */
    public $numberOfSeats = null;

}

class accommodationInfo {

    /**
     *
     * @var accommAllocation $accommAllocation
     * @access public
     */
    public $accommAllocation = null;

}

class accommAllocation {

    /**
     *
     * @var referenceId $referenceId
     * @access public
     */
    public $referenceId = null;

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

}

class coachInfo {

    /**
     *
     * @var coachDetails $coachDetails
     * @access public
     */
    public $coachDetails = null;

    /**
     *
     * @var equipmentCode $equipmentCode
     * @access public
     */
    public $equipmentCode = null;

}

class coachDetails {

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

}

class markerRailTour {

}

class tourInfo {

    /**
     *
     * @var bookingSummaryInfo $bookingSummaryInfo
     * @access public
     */
    public $bookingSummaryInfo = null;

    /**
     *
     * @var bookingDurationInfo $bookingDurationInfo
     * @access public
     */
    public $bookingDurationInfo = null;

    /**
     *
     * @var stayingInfo $stayingInfo
     * @access public
     */
    public $stayingInfo = null;

    /**
     *
     * @var tourDescriptionInfo $tourDescriptionInfo
     * @access public
     */
    public $tourDescriptionInfo = null;

    /**
     *
     * @var bookingReferenceInfo $bookingReferenceInfo
     * @access public
     */
    public $bookingReferenceInfo = null;

    /**
     *
     * @var statusInfo $statusInfo
     * @access public
     */
    public $statusInfo = null;

    /**
     *
     * @var insuranceIndication $insuranceIndication
     * @access public
     */
    public $insuranceIndication = null;

    /**
     *
     * @var passengerInfo $passengerInfo
     * @access public
     */
    public $passengerInfo = null;

    /**
     *
     * @var expireInfo $expireInfo
     * @access public
     */
    public $expireInfo = null;

    /**
     *
     * @var bookingDescriptionInfo $bookingDescriptionInfo
     * @access public
     */
    public $bookingDescriptionInfo = null;

    /**
     *
     * @var systemProviderInfo $systemProviderInfo
     * @access public
     */
    public $systemProviderInfo = null;

    /**
     *
     * @var tourOperatorInfo $tourOperatorInfo
     * @access public
     */
    public $tourOperatorInfo = null;

    /**
     *
     * @var bookingSource $bookingSource
     * @access public
     */
    public $bookingSource = null;

    /**
     *
     * @var passengerAssocation $passengerAssocation
     * @access public
     */
    public $passengerAssocation = null;

    /**
     *
     * @var tourAccountDetails $tourAccountDetails
     * @access public
     */
    public $tourAccountDetails = null;

    /**
     *
     * @var tourProductDetails $tourProductDetails
     * @access public
     */
    public $tourProductDetails = null;

}

class bookingSummaryInfo {

    /**
     *
     * @var dateTimeInformation $dateTimeInformation
     * @access public
     */
    public $dateTimeInformation = null;

    /**
     *
     * @var locationInformation $locationInformation
     * @access public
     */
    public $locationInformation = null;

    /**
     *
     * @var companyInformation $companyInformation
     * @access public
     */
    public $companyInformation = null;

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

}

class dateTimeInformation {

    /**
     *
     * @var departureDate $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     *
     * @var departureTime $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     *
     * @var arrivalDate $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     *
     * @var arrivalTime $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

}

class locationInformation {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var country $country
     * @access public
     */
    public $country = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

}

class companyInformation {

    /**
     *
     * @var providerName $providerName
     * @access public
     */
    public $providerName = null;

}

class bookingDurationInfo {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class stayingInfo {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class tourDescriptionInfo {

    /**
     *
     * @var productArea $productArea
     * @access public
     */
    public $productArea = null;

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

}

class bookingReferenceInfo {

    /**
     *
     * @var reservationControlId $reservationControlId
     * @access public
     */
    public $reservationControlId = null;

}

class reservationControlId {

    /**
     *
     * @var tourOperatorCode $tourOperatorCode
     * @access public
     */
    public $tourOperatorCode = null;

    /**
     *
     * @var reservationControlNumberQual $reservationControlNumberQual
     * @access public
     */
    public $reservationControlNumberQual = null;

    /**
     *
     * @var reservationControlNumber $reservationControlNumber
     * @access public
     */
    public $reservationControlNumber = null;

}

class quantityActionDetails {

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class insuranceIndication {

    /**
     *
     * @var coverageIndicator $coverageIndicator
     * @access public
     */
    public $coverageIndicator = null;

}

class expireInfo {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class bookingDescriptionInfo {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class systemProviderInfo {

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

}

class tourOperatorInfo {

    /**
     *
     * @var travelSector $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var companyName $companyName
     * @access public
     */
    public $companyName = null;

}

class passengerAssocation {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class tourAccountDetails {

    /**
     *
     * @var tourTotalPrices $tourTotalPrices
     * @access public
     */
    public $tourTotalPrices = null;

    /**
     *
     * @var remainingAmountsDetails $remainingAmountsDetails
     * @access public
     */
    public $remainingAmountsDetails = null;

    /**
     *
     * @var tourDetailedPriceInfo $tourDetailedPriceInfo
     * @access public
     */
    public $tourDetailedPriceInfo = null;

    /**
     *
     * @var paymentInformation $paymentInformation
     * @access public
     */
    public $paymentInformation = null;

}

class tourTotalPrices {

    /**
     *
     * @var tariffInformation $tariffInformation
     * @access public
     */
    public $tariffInformation = null;

    /**
     *
     * @var associatedChargesInformation $associatedChargesInformation
     * @access public
     */
    public $associatedChargesInformation = null;

}

class tariffInformation {

    /**
     *
     * @var rateIdentifier $rateIdentifier
     * @access public
     */
    public $rateIdentifier = null;

    /**
     *
     * @var unitaryAmount $unitaryAmount
     * @access public
     */
    public $unitaryAmount = null;

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     *
     * @var tariffQualifier $tariffQualifier
     * @access public
     */
    public $tariffQualifier = null;

    /**
     *
     * @var totalAmount $totalAmount
     * @access public
     */
    public $totalAmount = null;

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var tariffStatus $tariffStatus
     * @access public
     */
    public $tariffStatus = null;

}

class associatedChargesInformation {

    /**
     *
     * @var chargeUnitCode $chargeUnitCode
     * @access public
     */
    public $chargeUnitCode = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var percentage $percentage
     * @access public
     */
    public $percentage = null;

}

class remainingAmountsDetails {

    /**
     *
     * @var providerCode $providerCode
     * @access public
     */
    public $providerCode = null;

    /**
     *
     * @var remainingAmount $remainingAmount
     * @access public
     */
    public $remainingAmount = null;

}

class providerCode {

    /**
     *
     * @var travelSector $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var companyName $companyName
     * @access public
     */
    public $companyName = null;

}

class remainingAmount {

    /**
     *
     * @var tariffInformation $tariffInformation
     * @access public
     */
    public $tariffInformation = null;

    /**
     *
     * @var associatedChargesInformation $associatedChargesInformation
     * @access public
     */
    public $associatedChargesInformation = null;

}

class tourDetailedPriceInfo {

    /**
     *
     * @var markerSpecificRead $markerSpecificRead
     * @access public
     */
    public $markerSpecificRead = null;

    /**
     *
     * @var productId $productId
     * @access public
     */
    public $productId = null;

    /**
     *
     * @var productPrice $productPrice
     * @access public
     */
    public $productPrice = null;

}

class markerSpecificRead {

}

class productId {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class productPrice {

    /**
     *
     * @var tariffInformation $tariffInformation
     * @access public
     */
    public $tariffInformation = null;

    /**
     *
     * @var associatedChargesInformation $associatedChargesInformation
     * @access public
     */
    public $associatedChargesInformation = null;

}

class paymentInformation {

    /**
     *
     * @var payment $payment
     * @access public
     */
    public $payment = null;

    /**
     *
     * @var operatorCode $operatorCode
     * @access public
     */
    public $operatorCode = null;

}

class creditCardInformation {

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var cardNumber $cardNumber
     * @access public
     */
    public $cardNumber = null;

    /**
     *
     * @var expireDate $expireDate
     * @access public
     */
    public $expireDate = null;

}

class operatorCode {

    /**
     *
     * @var travelSector $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var companyName $companyName
     * @access public
     */
    public $companyName = null;

}

class tourProductDetails {

    /**
     *
     * @var sequenceNumberInfo $sequenceNumberInfo
     * @access public
     */
    public $sequenceNumberInfo = null;

    /**
     *
     * @var statusQuantityInfo $statusQuantityInfo
     * @access public
     */
    public $statusQuantityInfo = null;

    /**
     *
     * @var productInfo $productInfo
     * @access public
     */
    public $productInfo = null;

    /**
     *
     * @var confirmationInfo $confirmationInfo
     * @access public
     */
    public $confirmationInfo = null;

    /**
     *
     * @var passengerAssociation $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     *
     * @var serviceDetails $serviceDetails
     * @access public
     */
    public $serviceDetails = null;

}

class sequenceNumberInfo {

    /**
     *
     * @var itemIdentification $itemIdentification
     * @access public
     */
    public $itemIdentification = null;

}

class itemIdentification {

    /**
     *
     * @var itemID $itemID
     * @access public
     */
    public $itemID = null;

    /**
     *
     * @var itemIDQualifier $itemIDQualifier
     * @access public
     */
    public $itemIDQualifier = null;

}

class statusQuantityInfo {

    /**
     *
     * @var quantityActionDetails $quantityActionDetails
     * @access public
     */
    public $quantityActionDetails = null;

}

class confirmationInfo {

    /**
     *
     * @var reservationControlId $reservationControlId
     * @access public
     */
    public $reservationControlId = null;

}

class serviceDetails {

    /**
     *
     * @var serviceInfo $serviceInfo
     * @access public
     */
    public $serviceInfo = null;

    /**
     *
     * @var serviceDurationInfo $serviceDurationInfo
     * @access public
     */
    public $serviceDurationInfo = null;

    /**
     *
     * @var accomodationDetails $accomodationDetails
     * @access public
     */
    public $accomodationDetails = null;

    /**
     *
     * @var vehiculeDetails $vehiculeDetails
     * @access public
     */
    public $vehiculeDetails = null;

    /**
     *
     * @var transportationDetails $transportationDetails
     * @access public
     */
    public $transportationDetails = null;

    /**
     *
     * @var productBCSDetails $productBCSDetails
     * @access public
     */
    public $productBCSDetails = null;

}

class serviceDurationInfo {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class accomodationDetails {

    /**
     *
     * @var roomInfo $roomInfo
     * @access public
     */
    public $roomInfo = null;

    /**
     *
     * @var passengerAssociation $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     *
     * @var roomMealPlanInfo $roomMealPlanInfo
     * @access public
     */
    public $roomMealPlanInfo = null;

    /**
     *
     * @var occupancynInfo $occupancynInfo
     * @access public
     */
    public $occupancynInfo = null;

}

class roomInfo {

    /**
     *
     * @var roomRateIdentifier $roomRateIdentifier
     * @access public
     */
    public $roomRateIdentifier = null;

    /**
     *
     * @var bookingCode $bookingCode
     * @access public
     */
    public $bookingCode = null;

    /**
     *
     * @var guestCountDetails $guestCountDetails
     * @access public
     */
    public $guestCountDetails = null;

    /**
     *
     * @var roomTypeOverride $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class roomMealPlanInfo {

    /**
     *
     * @var diningIdentification $diningIdentification
     * @access public
     */
    public $diningIdentification = null;

}

class diningIdentification {

    /**
     *
     * @var diningDescription $diningDescription
     * @access public
     */
    public $diningDescription = null;

}

class occupancynInfo {

    /**
     *
     * @var rangeQualifier $rangeQualifier
     * @access public
     */
    public $rangeQualifier = null;

    /**
     *
     * @var rangeDetails $rangeDetails
     * @access public
     */
    public $rangeDetails = null;

}

class vehiculeDetails {

    /**
     *
     * @var vehiculeInfo $vehiculeInfo
     * @access public
     */
    public $vehiculeInfo = null;

}

class vehiculeInfo {

    /**
     *
     * @var vehiculeDescription $vehiculeDescription
     * @access public
     */
    public $vehiculeDescription = null;

}

class vehiculeDescription {

    /**
     *
     * @var occupancy $occupancy
     * @access public
     */
    public $occupancy = null;

}

class transportationDetails {

    /**
     *
     * @var departureInfo $departureInfo
     * @access public
     */
    public $departureInfo = null;

    /**
     *
     * @var arrivalInfo $arrivalInfo
     * @access public
     */
    public $arrivalInfo = null;

    /**
     *
     * @var transportationInfo $transportationInfo
     * @access public
     */
    public $transportationInfo = null;

    /**
     *
     * @var transportationDuration $transportationDuration
     * @access public
     */
    public $transportationDuration = null;

    /**
     *
     * @var equipmentInfo $equipmentInfo
     * @access public
     */
    public $equipmentInfo = null;

    /**
     *
     * @var transportationMealPlanInfo $transportationMealPlanInfo
     * @access public
     */
    public $transportationMealPlanInfo = null;

}

class departureInfo {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class arrivalInfo {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class transportationInfo {

    /**
     *
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     *
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

}

class transportationDuration {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class equipmentInfo {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var sizeTypeDetails $sizeTypeDetails
     * @access public
     */
    public $sizeTypeDetails = null;

}

class sizeTypeDetails {

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class transportationMealPlanInfo {

    /**
     *
     * @var diningIdentification $diningIdentification
     * @access public
     */
    public $diningIdentification = null;

}

class productBCSDetails {

    /**
     *
     * @var agentIdentification $agentIdentification
     * @access public
     */
    public $agentIdentification = null;

    /**
     *
     * @var distributionChannelData $distributionChannelData
     * @access public
     */
    public $distributionChannelData = null;

}

class agentIdentification {

    /**
     *
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     *
     * @var originator $originator
     * @access public
     */
    public $originator = null;

}

class distributionChannelData {

    /**
     *
     * @var cascadingSystem $cascadingSystem
     * @access public
     */
    public $cascadingSystem = null;

}

class cascadingSystem {

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

}

class ferryLegInformation {

    /**
     *
     * @var ferryProviderInformation $ferryProviderInformation
     * @access public
     */
    public $ferryProviderInformation = null;

    /**
     *
     * @var itineraryInfoGroup $itineraryInfoGroup
     * @access public
     */
    public $itineraryInfoGroup = null;

    /**
     *
     * @var accomodationPackageInfoGroup $accomodationPackageInfoGroup
     * @access public
     */
    public $accomodationPackageInfoGroup = null;

    /**
     *
     * @var bookingNumberInformation $bookingNumberInformation
     * @access public
     */
    public $bookingNumberInformation = null;

}

class ferryProviderInformation {

    /**
     *
     * @var travelSector $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     *
     * @var companyCode $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     *
     * @var companyName $companyName
     * @access public
     */
    public $companyName = null;

}

class itineraryInfoGroup {

    /**
     *
     * @var sailingDetails $sailingDetails
     * @access public
     */
    public $sailingDetails = null;

    /**
     *
     * @var shipDescription $shipDescription
     * @access public
     */
    public $shipDescription = null;

    /**
     *
     * @var sailingLegCheckInInformation $sailingLegCheckInInformation
     * @access public
     */
    public $sailingLegCheckInInformation = null;

    /**
     *
     * @var passengerAssociation $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     *
     * @var priceInfoGroup $priceInfoGroup
     * @access public
     */
    public $priceInfoGroup = null;

    /**
     *
     * @var vehicleInfoGroup $vehicleInfoGroup
     * @access public
     */
    public $vehicleInfoGroup = null;

    /**
     *
     * @var serviceInfoGroup $serviceInfoGroup
     * @access public
     */
    public $serviceInfoGroup = null;

    /**
     *
     * @var animalInfoGroup $animalInfoGroup
     * @access public
     */
    public $animalInfoGroup = null;

}

class sailingDetails {

    /**
     *
     * @var itineraryDateTimeInfo $itineraryDateTimeInfo
     * @access public
     */
    public $itineraryDateTimeInfo = null;

    /**
     *
     * @var boardPortDetails $boardPortDetails
     * @access public
     */
    public $boardPortDetails = null;

    /**
     *
     * @var lineNumber $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class itineraryDateTimeInfo {

    /**
     *
     * @var departureDate $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     *
     * @var departureTime $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     *
     * @var arrivalDate $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     *
     * @var arrivalTime $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

}

class boardPortDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

}

class shipDescription {

    /**
     *
     * @var shipDetails $shipDetails
     * @access public
     */
    public $shipDetails = null;

}

class sailingLegCheckInInformation {

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class priceInfoGroup {

    /**
     *
     * @var routePriceInformation $routePriceInformation
     * @access public
     */
    public $routePriceInformation = null;

    /**
     *
     * @var passengerCategoryType $passengerCategoryType
     * @access public
     */
    public $passengerCategoryType = null;

    /**
     *
     * @var numberOfPassengers $numberOfPassengers
     * @access public
     */
    public $numberOfPassengers = null;

}

class routePriceInformation {

    /**
     *
     * @var priceDetails $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class priceDetails {

    /**
     *
     * @var priceAmount $priceAmount
     * @access public
     */
    public $priceAmount = null;

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     *
     * @var priceQualifier $priceQualifier
     * @access public
     */
    public $priceQualifier = null;

}

class passengerCategoryType {

    /**
     *
     * @var attributeFunction $attributeFunction
     * @access public
     */
    public $attributeFunction = null;

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class numberOfPassengers {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class vehicleInfoGroup {

    /**
     *
     * @var vehicleInformation $vehicleInformation
     * @access public
     */
    public $vehicleInformation = null;

    /**
     *
     * @var numberOfBicycles $numberOfBicycles
     * @access public
     */
    public $numberOfBicycles = null;

    /**
     *
     * @var vehicleRoutePrice $vehicleRoutePrice
     * @access public
     */
    public $vehicleRoutePrice = null;

}

class vehicleDetails {

    /**
     *
     * @var makeAndModel $makeAndModel
     * @access public
     */
    public $makeAndModel = null;

}

class numberOfBicycles {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class vehicleRoutePrice {

    /**
     *
     * @var priceDetails $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class serviceInfoGroup {

    /**
     *
     * @var serviceInformation $serviceInformation
     * @access public
     */
    public $serviceInformation = null;

    /**
     *
     * @var numberOfServices $numberOfServices
     * @access public
     */
    public $numberOfServices = null;

    /**
     *
     * @var serviceRoutePrice $serviceRoutePrice
     * @access public
     */
    public $serviceRoutePrice = null;

}

class serviceInformation {

    /**
     *
     * @var attributeFunction $attributeFunction
     * @access public
     */
    public $attributeFunction = null;

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class numberOfServices {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class serviceRoutePrice {

    /**
     *
     * @var priceDetails $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class animalInfoGroup {

    /**
     *
     * @var animalInformation $animalInformation
     * @access public
     */
    public $animalInformation = null;

    /**
     *
     * @var animalRoutePrice $animalRoutePrice
     * @access public
     */
    public $animalRoutePrice = null;

}

class animalInformation {

    /**
     *
     * @var dataTypeInformation $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     *
     * @var dataInformation $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class animalRoutePrice {

    /**
     *
     * @var priceDetails $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class accomodationPackageInfoGroup {

    /**
     *
     * @var packageCode $packageCode
     * @access public
     */
    public $packageCode = null;

    /**
     *
     * @var hotelInformation $hotelInformation
     * @access public
     */
    public $hotelInformation = null;

    /**
     *
     * @var hotelCheckInInformation $hotelCheckInInformation
     * @access public
     */
    public $hotelCheckInInformation = null;

    /**
     *
     * @var areaCodeInfo $areaCodeInfo
     * @access public
     */
    public $areaCodeInfo = null;

    /**
     *
     * @var numberOfNights $numberOfNights
     * @access public
     */
    public $numberOfNights = null;

    /**
     *
     * @var hotelItemPrice $hotelItemPrice
     * @access public
     */
    public $hotelItemPrice = null;

    /**
     *
     * @var roomInfoGroup $roomInfoGroup
     * @access public
     */
    public $roomInfoGroup = null;

}

class packageCode {

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class hotelInformation {

    /**
     *
     * @var hotelReference $hotelReference
     * @access public
     */
    public $hotelReference = null;

}

class hotelCheckInInformation {

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class areaCodeInfo {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class numberOfNights {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class hotelItemPrice {

    /**
     *
     * @var priceDetails $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class roomInfoGroup {

    /**
     *
     * @var roomDetailsInformation $roomDetailsInformation
     * @access public
     */
    public $roomDetailsInformation = null;

    /**
     *
     * @var numberOfRooms $numberOfRooms
     * @access public
     */
    public $numberOfRooms = null;

}

class roomDetailsInformation {

    /**
     *
     * @var roomTypeOverride $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class numberOfRooms {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class bookingNumberInformation {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class errorInformation {

    /**
     *
     * @var errorDetail $errorDetail
     * @access public
     */
    public $errorDetail = null;

}

class errorfreeFormText {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var text $text
     * @access public
     */
    public $text = null;

}

class referenceForSegment {

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

}

class segmentGroupingInfo {

    /**
     *
     * @var groupingCode $groupingCode
     * @access public
     */
    public $groupingCode = null;

    /**
     *
     * @var marriageDetail $marriageDetail
     * @access public
     */
    public $marriageDetail = null;

}

class marriageDetail {

    /**
     *
     * @var marriageQualifier $marriageQualifier
     * @access public
     */
    public $marriageQualifier = null;

    /**
     *
     * @var tatooNum $tatooNum
     * @access public
     */
    public $tatooNum = null;

}

class dataElementsMaster {

    /**
     *
     * @var marker2 $marker2
     * @access public
     */
    public $marker2 = null;
    public $marker1 = null;

    /**
     *
     * @var dataElementsIndiv $dataElementsIndiv
     * @access public
     */
    public $dataElementsIndiv = null;

}

class marker2 {

}

class dataElementsIndiv {

    /**
     *
     * @var elementManagementData $elementManagementData
     * @access public
     */
    public $elementManagementData = null;
    public $freetextData = null;
    public $formOfPayment = null;
    public $tourCode = null;

    /**
     *
     * @var pnrSecurity $pnrSecurity
     * @access public
     */
    public $pnrSecurity = null;

    /**
     *
     * @var accounting $accounting
     * @access public
     */
    public $accounting = null;

    /**
     *
     * @var miscellaneousRemarks $miscellaneousRemarks
     * @access public
     */
    public $miscellaneousRemarks = null;

    /**
     *
     * @var serviceRequest $serviceRequest
     * @access public
     */
    public $serviceRequest = null;

    /**
     *
     * @var seatPaxInfo $seatPaxInfo
     * @access public
     */
    public $seatPaxInfo = null;

    /**
     *
     * @var railSeatPreferences $railSeatPreferences
     * @access public
     */
    public $railSeatPreferences = null;

    /**
     *
     * @var cityPair $cityPair
     * @access public
     */
    public $cityPair = null;

    /**
     *
     * @var railSeatDetails $railSeatDetails
     * @access public
     */
    public $railSeatDetails = null;

    /**
     *
     * @var dateAndTimeInformation $dateAndTimeInformation
     * @access public
     */
    public $dateAndTimeInformation = null;

    /**
     *
     * @var frequentTravellerInfo $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     *
     * @var ticketElement $ticketElement
     * @access public
     */
    public $ticketElement = null;

    /**
     *
     * @var referencedRecord $referencedRecord
     * @access public
     */
    public $referencedRecord = null;

    /**
     *
     * @var optionElement $optionElement
     * @access public
     */
    public $optionElement = null;

    /**
     *
     * @var otherDataFreetext $otherDataFreetext
     * @access public
     */
    public $otherDataFreetext = null;

    /**
     *
     * @var structuredAddress $structuredAddress
     * @access public
     */
    public $structuredAddress = null;

    /**
     *
     * @var monetaryInformation $monetaryInformation
     * @access public
     */
    public $monetaryInformation = null;

    /**
     *
     * @var elementErrorInformation $elementErrorInformation
     * @access public
     */
    public $elementErrorInformation = null;

    /**
     *
     * @var mcoRecord $mcoRecord
     * @access public
     */
    public $mcoRecord = null;

    /**
     *
     * @var newFop $newFop
     * @access public
     */
    public $newFop = null;

    /**
     *
     * @var totalPrice $totalPrice
     * @access public
     */
    public $totalPrice = null;

    /**
     *
     * @var elementsIndicators $elementsIndicators
     * @access public
     */
    public $elementsIndicators = null;

    /**
     *
     * @var referenceForDataElement $referenceForDataElement
     * @access public
     */
    public $referenceForDataElement = null;

}

class elementManagementData {

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

    /**
     *
     * @var segmentName $segmentName
     * @access public
     */
    public $segmentName = null;

    /**
     *
     * @var lineNumber $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class pnrSecurity {

    /**
     *
     * @var security $security
     * @access public
     */
    public $security = null;

    /**
     *
     * @var securityInfo $securityInfo
     * @access public
     */
    public $securityInfo = null;

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

}

class security {

    /**
     *
     * @var identification $identification
     * @access public
     */
    public $identification = null;

    /**
     *
     * @var accessMode $accessMode
     * @access public
     */
    public $accessMode = null;

}

class securityInfo {

    /**
     *
     * @var creationDate $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     *
     * @var agentCode $agentCode
     * @access public
     */
    public $agentCode = null;

    /**
     *
     * @var officeId $officeId
     * @access public
     */
    public $officeId = null;

}

class accounting {

    /**
     *
     * @var account $account
     * @access public
     */
    public $account = null;

    /**
     *
     * @var accountNumberOfUnits $accountNumberOfUnits
     * @access public
     */
    public $accountNumberOfUnits = null;

}

class account {

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var costNumber $costNumber
     * @access public
     */
    public $costNumber = null;

    /**
     *
     * @var companyNumber $companyNumber
     * @access public
     */
    public $companyNumber = null;

    /**
     *
     * @var clientReference $clientReference
     * @access public
     */
    public $clientReference = null;

}

class miscellaneousRemarks {

    /**
     *
     * @var remarks $remarks
     * @access public
     */
    public $remarks = null;

    /**
     *
     * @var individualSecurity $individualSecurity
     * @access public
     */
    public $individualSecurity = null;

}

class individualSecurity {

    /**
     *
     * @var office $office
     * @access public
     */
    public $office = null;

    /**
     *
     * @var accessMode $accessMode
     * @access public
     */
    public $accessMode = null;

    /**
     *
     * @var officeIdentifier $officeIdentifier
     * @access public
     */
    public $officeIdentifier = null;

}

class serviceRequest {

    /**
     *
     * @var ssr $ssr
     * @access public
     */
    public $ssr = null;

    /**
     *
     * @var ssrb $ssrb
     * @access public
     */
    public $ssrb = null;

}

class ssr {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

    /**
     *
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var processingIndicator $processingIndicator
     * @access public
     */
    public $processingIndicator = null;

    /**
     *
     * @var boardpoint $boardpoint
     * @access public
     */
    public $boardpoint = null;

    /**
     *
     * @var offpoint $offpoint
     * @access public
     */
    public $offpoint = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class ssrb {

    /**
     *
     * @var data $data
     * @access public
     */
    public $data = null;

    /**
     *
     * @var crossRef $crossRef
     * @access public
     */
    public $crossRef = null;

    /**
     *
     * @var seatType $seatType
     * @access public
     */
    public $seatType = null;

}

class seatPaxInfo {

    /**
     *
     * @var seatPaxDetails $seatPaxDetails
     * @access public
     */
    public $seatPaxDetails = null;

    /**
     *
     * @var seatPaxIndicator $seatPaxIndicator
     * @access public
     */
    public $seatPaxIndicator = null;

    /**
     *
     * @var crossRef $crossRef
     * @access public
     */
    public $crossRef = null;

}

class seatPaxDetails {

    /**
     *
     * @var genericDetails $genericDetails
     * @access public
     */
    public $genericDetails = null;

}

class genericDetails {

    /**
     *
     * @var seatCharacteristic $seatCharacteristic
     * @access public
     */
    public $seatCharacteristic = null;

}

class seatPaxIndicator {

    /**
     *
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class crossRef {

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

}

class railSeatPreferences {

    /**
     *
     * @var seatRequestFunction $seatRequestFunction
     * @access public
     */
    public $seatRequestFunction = null;

    /**
     *
     * @var smokingIndicator $smokingIndicator
     * @access public
     */
    public $smokingIndicator = null;

    /**
     *
     * @var classDetails $classDetails
     * @access public
     */
    public $classDetails = null;

    /**
     *
     * @var seatConfiguration $seatConfiguration
     * @access public
     */
    public $seatConfiguration = null;

    /**
     *
     * @var sleeperDescription $sleeperDescription
     * @access public
     */
    public $sleeperDescription = null;

}

class seatConfiguration {

    /**
     *
     * @var seatSpace $seatSpace
     * @access public
     */
    public $seatSpace = null;

    /**
     *
     * @var coachType $coachType
     * @access public
     */
    public $coachType = null;

    /**
     *
     * @var seatEquipment $seatEquipment
     * @access public
     */
    public $seatEquipment = null;

    /**
     *
     * @var seatPosition $seatPosition
     * @access public
     */
    public $seatPosition = null;

    /**
     *
     * @var seatDirection $seatDirection
     * @access public
     */
    public $seatDirection = null;

    /**
     *
     * @var seatDeck $seatDeck
     * @access public
     */
    public $seatDeck = null;

    /**
     *
     * @var specialPassengerType $specialPassengerType
     * @access public
     */
    public $specialPassengerType = null;

}

class sleeperDescription {

    /**
     *
     * @var berthDeck $berthDeck
     * @access public
     */
    public $berthDeck = null;

    /**
     *
     * @var cabinPosition $cabinPosition
     * @access public
     */
    public $cabinPosition = null;

    /**
     *
     * @var cabinShareType $cabinShareType
     * @access public
     */
    public $cabinShareType = null;

    /**
     *
     * @var cabinOccupancy $cabinOccupancy
     * @access public
     */
    public $cabinOccupancy = null;

}

class cityPair {

    /**
     *
     * @var depLocation $depLocation
     * @access public
     */
    public $depLocation = null;

    /**
     *
     * @var arrLocation $arrLocation
     * @access public
     */
    public $arrLocation = null;

}

class railSeatDetails {

    /**
     *
     * @var railSeatReferenceInformation $railSeatReferenceInformation
     * @access public
     */
    public $railSeatReferenceInformation = null;

    /**
     *
     * @var railSeatDenomination $railSeatDenomination
     * @access public
     */
    public $railSeatDenomination = null;

}

class railSeatReferenceInformation {

    /**
     *
     * @var railSeatReferenceDetails $railSeatReferenceDetails
     * @access public
     */
    public $railSeatReferenceDetails = null;

}

class railSeatReferenceDetails {

    /**
     *
     * @var coachNumber $coachNumber
     * @access public
     */
    public $coachNumber = null;

    /**
     *
     * @var deckNumber $deckNumber
     * @access public
     */
    public $deckNumber = null;

    /**
     *
     * @var seatNumber $seatNumber
     * @access public
     */
    public $seatNumber = null;

}

class railSeatDenomination {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class dateAndTimeInformation {

    /**
     *
     * @var dateAndTime $dateAndTime
     * @access public
     */
    public $dateAndTime = null;

}

class frequentTraveler {

    /**
     *
     * @var company $company
     * @access public
     */
    public $company = null;

    /**
     *
     * @var membershipNumber $membershipNumber
     * @access public
     */
    public $membershipNumber = null;

    /**
     *
     * @var customerValue $customerValue
     * @access public
     */
    public $customerValue = null;

}

class priorityDetails {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var priorityCode $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     *
     * @var tierLevel $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     *
     * @var tierDescription $tierDescription
     * @access public
     */
    public $tierDescription = null;

}

class redemptionInformation {

    /**
     *
     * @var category $category
     * @access public
     */
    public $category = null;

    /**
     *
     * @var sequenceNumber $sequenceNumber
     * @access public
     */
    public $sequenceNumber = null;

    /**
     *
     * @var versionNumber $versionNumber
     * @access public
     */
    public $versionNumber = null;

    /**
     *
     * @var rateClass $rateClass
     * @access public
     */
    public $rateClass = null;

    /**
     *
     * @var approvalCode $approvalCode
     * @access public
     */
    public $approvalCode = null;

}

class ticketElement {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var ticket $ticket
     * @access public
     */
    public $ticket = null;

    /**
     *
     * @var printOptions $printOptions
     * @access public
     */
    public $printOptions = null;

}

class ticket {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var date $date
     * @access public
     */
    public $date = null;

    /**
     *
     * @var time $time
     * @access public
     */
    public $time = null;

    /**
     *
     * @var officeId $officeId
     * @access public
     */
    public $officeId = null;

    /**
     *
     * @var freetext $freetext
     * @access public
     */
    public $freetext = null;

    /**
     *
     * @var transactionFlag $transactionFlag
     * @access public
     */
    public $transactionFlag = null;

    /**
     *
     * @var electronicTicketFlag $electronicTicketFlag
     * @access public
     */
    public $electronicTicketFlag = null;

    /**
     *
     * @var airlineCode $airlineCode
     * @access public
     */
    public $airlineCode = null;

    /**
     *
     * @var queueNumber $queueNumber
     * @access public
     */
    public $queueNumber = null;

    /**
     *
     * @var queueCategory $queueCategory
     * @access public
     */
    public $queueCategory = null;

    /**
     *
     * @var sitaAddress $sitaAddress
     * @access public
     */
    public $sitaAddress = null;

}

class referencedRecord {

    /**
     *
     * @var referencedReservationInfo $referencedReservationInfo
     * @access public
     */
    public $referencedReservationInfo = null;

    /**
     *
     * @var securityInformation $securityInformation
     * @access public
     */
    public $securityInformation = null;

}

class referencedReservationInfo {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class optionElement {

    /**
     *
     * @var optionElementInfo $optionElementInfo
     * @access public
     */
    public $optionElementInfo = null;

    /**
     *
     * @var individualSecurity $individualSecurity
     * @access public
     */
    public $individualSecurity = null;

}

class optionElementInfo {

    /**
     *
     * @var mainOffice $mainOffice
     * @access public
     */
    public $mainOffice = null;

    /**
     *
     * @var date $date
     * @access public
     */
    public $date = null;

    /**
     *
     * @var queue $queue
     * @access public
     */
    public $queue = null;

    /**
     *
     * @var category $category
     * @access public
     */
    public $category = null;

    /**
     *
     * @var freetext $freetext
     * @access public
     */
    public $freetext = null;

    /**
     *
     * @var time $time
     * @access public
     */
    public $time = null;

}

class otherDataFreetext {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var longFreetext $longFreetext
     * @access public
     */
    public $longFreetext = null;

}

class structuredAddress {

    /**
     *
     * @var informationType $informationType
     * @access public
     */
    public $informationType = null;

    /**
     *
     * @var address $address
     * @access public
     */
    public $address = null;

}

class elementErrorInformation {

    /**
     *
     * @var errorInformation $errorInformation
     * @access public
     */
    public $errorInformation = null;

    /**
     *
     * @var elementErrorText $elementErrorText
     * @access public
     */
    public $elementErrorText = null;

}

class elementErrorText {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var text $text
     * @access public
     */
    public $text = null;

}

class mcoRecord {

    /**
     *
     * @var mcoType $mcoType
     * @access public
     */
    public $mcoType = null;

    /**
     *
     * @var mcoInformation $mcoInformation
     * @access public
     */
    public $mcoInformation = null;

    /**
     *
     * @var groupOfFareElements $groupOfFareElements
     * @access public
     */
    public $groupOfFareElements = null;

}

class mcoType {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

}

class mcoInformation {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class groupOfFareElements {

    /**
     *
     * @var sequenceNumber $sequenceNumber
     * @access public
     */
    public $sequenceNumber = null;

    /**
     *
     * @var fareElementData $fareElementData
     * @access public
     */
    public $fareElementData = null;

}

class sequenceNumber {

    /**
     *
     * @var actionRequest $actionRequest
     * @access public
     */
    public $actionRequest = null;

    /**
     *
     * @var sequenceDetails $sequenceDetails
     * @access public
     */
    public $sequenceDetails = null;

}

class fareElementData {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class newFop {

    /**
     *
     * @var fopDescription $fopDescription
     * @access public
     */
    public $fopDescription = null;

    /**
     *
     * @var freeFlowFops $freeFlowFops
     * @access public
     */
    public $freeFlowFops = null;

    /**
     *
     * @var fopOtherDetails $fopOtherDetails
     * @access public
     */
    public $fopOtherDetails = null;

    /**
     *
     * @var fopAttributeData $fopAttributeData
     * @access public
     */
    public $fopAttributeData = null;

    /**
     *
     * @var fopIndicators $fopIndicators
     * @access public
     */
    public $fopIndicators = null;

    /**
     *
     * @var monetaryInfo $monetaryInfo
     * @access public
     */
    public $monetaryInfo = null;

}

class fopDescription {

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class freeFlowFops {

    /**
     *
     * @var freeTextDetails $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class fopOtherDetails {

    /**
     *
     * @var fopDetails $fopDetails
     * @access public
     */
    public $fopDetails = null;

}

class fopDetails {

    /**
     *
     * @var fopCode $fopCode
     * @access public
     */
    public $fopCode = null;

    /**
     *
     * @var fopFacSimileCode $fopFacSimileCode
     * @access public
     */
    public $fopFacSimileCode = null;

    /**
     *
     * @var fopBillingCode $fopBillingCode
     * @access public
     */
    public $fopBillingCode = null;

    /**
     *
     * @var saleIndicator $saleIndicator
     * @access public
     */
    public $saleIndicator = null;

    /**
     *
     * @var dealNumber $dealNumber
     * @access public
     */
    public $dealNumber = null;

    /**
     *
     * @var collectingAgencyIataNum $collectingAgencyIataNum
     * @access public
     */
    public $collectingAgencyIataNum = null;

}

class fopAttributeData {

    /**
     *
     * @var onoData $onoData
     * @access public
     */
    public $onoData = null;

    /**
     *
     * @var gwtData $gwtData
     * @access public
     */
    public $gwtData = null;

    /**
     *
     * @var ccHolderName $ccHolderName
     * @access public
     */
    public $ccHolderName = null;

}

class fopIndicators {

    /**
     *
     * @var fopCanBeReplaced $fopCanBeReplaced
     * @access public
     */
    public $fopCanBeReplaced = null;

    /**
     *
     * @var fopCanReplace $fopCanReplace
     * @access public
     */
    public $fopCanReplace = null;

    /**
     *
     * @var nonRefundableFop $nonRefundableFop
     * @access public
     */
    public $nonRefundableFop = null;

    /**
     *
     * @var nonRefundableFopAmount $nonRefundableFopAmount
     * @access public
     */
    public $nonRefundableFopAmount = null;

    /**
     *
     * @var roundingFop $roundingFop
     * @access public
     */
    public $roundingFop = null;

    /**
     *
     * @var roundingFop2 $roundingFop2
     * @access public
     */
    public $roundingFop2 = null;

    /**
     *
     * @var fopHasAgt $fopHasAgt
     * @access public
     */
    public $fopHasAgt = null;

    /**
     *
     * @var fopForTodAtCounter $fopForTodAtCounter
     * @access public
     */
    public $fopForTodAtCounter = null;

    /**
     *
     * @var fopForTodAtQuickMachine $fopForTodAtQuickMachine
     * @access public
     */
    public $fopForTodAtQuickMachine = null;

    /**
     *
     * @var autoApprovalCode $autoApprovalCode
     * @access public
     */
    public $autoApprovalCode = null;

    /**
     *
     * @var manualApprovalCode $manualApprovalCode
     * @access public
     */
    public $manualApprovalCode = null;

    /**
     *
     * @var bypassCreditCardAproval $bypassCreditCardAproval
     * @access public
     */
    public $bypassCreditCardAproval = null;

    /**
     *
     * @var extendedPayment $extendedPayment
     * @access public
     */
    public $extendedPayment = null;

    /**
     *
     * @var nonCombinableFop $nonCombinableFop
     * @access public
     */
    public $nonCombinableFop = null;

    /**
     *
     * @var foCheck $foCheck
     * @access public
     */
    public $foCheck = null;

    /**
     *
     * @var netRemitValidation1 $netRemitValidation1
     * @access public
     */
    public $netRemitValidation1 = null;

    /**
     *
     * @var mandatoryAmount $mandatoryAmount
     * @access public
     */
    public $mandatoryAmount = null;

    /**
     *
     * @var airplusDescriptiveBilling $airplusDescriptiveBilling
     * @access public
     */
    public $airplusDescriptiveBilling = null;

    /**
     *
     * @var netRemitValidation2 $netRemitValidation2
     * @access public
     */
    public $netRemitValidation2 = null;

    /**
     *
     * @var netRemitValidation3 $netRemitValidation3
     * @access public
     */
    public $netRemitValidation3 = null;

    /**
     *
     * @var fopAllowedForNego $fopAllowedForNego
     * @access public
     */
    public $fopAllowedForNego = null;

    /**
     *
     * @var psaCoveredByFd $psaCoveredByFd
     * @access public
     */
    public $psaCoveredByFd = null;

    /**
     *
     * @var customerApplicationFop1 $customerApplicationFop1
     * @access public
     */
    public $customerApplicationFop1 = null;

    /**
     *
     * @var mandatoryFt $mandatoryFt
     * @access public
     */
    public $mandatoryFt = null;

    /**
     *
     * @var customerApplicationFop $customerApplicationFop
     * @access public
     */
    public $customerApplicationFop = null;

    /**
     *
     * @var tstIndicator $tstIndicator
     * @access public
     */
    public $tstIndicator = null;

    /**
     *
     * @var orderNumber $orderNumber
     * @access public
     */
    public $orderNumber = null;

    /**
     *
     * @var freeflowTextInFop $freeflowTextInFop
     * @access public
     */
    public $freeflowTextInFop = null;

    /**
     *
     * @var bypassCreditCardValidation $bypassCreditCardValidation
     * @access public
     */
    public $bypassCreditCardValidation = null;

    /**
     *
     * @var customerFileRefDataForBsp $customerFileRefDataForBsp
     * @access public
     */
    public $customerFileRefDataForBsp = null;

    /**
     *
     * @var freeFlowCardHolderText $freeFlowCardHolderText
     * @access public
     */
    public $freeFlowCardHolderText = null;

    /**
     *
     * @var printAndReportCreditCardPrefix $printAndReportCreditCardPrefix
     * @access public
     */
    public $printAndReportCreditCardPrefix = null;

    /**
     *
     * @var printAmountInAllCases $printAmountInAllCases
     * @access public
     */
    public $printAmountInAllCases = null;

    /**
     *
     * @var customerFileRefDataForPrinting $customerFileRefDataForPrinting
     * @access public
     */
    public $customerFileRefDataForPrinting = null;

    /**
     *
     * @var restrictAgtAndMsFop $restrictAgtAndMsFop
     * @access public
     */
    public $restrictAgtAndMsFop = null;

    /**
     *
     * @var ccSecurityVerificationCode1 $ccSecurityVerificationCode1
     * @access public
     */
    public $ccSecurityVerificationCode1 = null;

    /**
     *
     * @var ccSecurityVerificationCode2 $ccSecurityVerificationCode2
     * @access public
     */
    public $ccSecurityVerificationCode2 = null;

    /**
     *
     * @var telephoneSaleOrSwipe $telephoneSaleOrSwipe
     * @access public
     */
    public $telephoneSaleOrSwipe = null;

    /**
     *
     * @var checkTstNfElementAmount $checkTstNfElementAmount
     * @access public
     */
    public $checkTstNfElementAmount = null;

    /**
     *
     * @var reportFreeflowInhibitPrint $reportFreeflowInhibitPrint
     * @access public
     */
    public $reportFreeflowInhibitPrint = null;

    /**
     *
     * @var baCreditAcountValidation $baCreditAcountValidation
     * @access public
     */
    public $baCreditAcountValidation = null;

    /**
     *
     * @var baBacchusDealValidation $baBacchusDealValidation
     * @access public
     */
    public $baBacchusDealValidation = null;

    /**
     *
     * @var baBudgetAcountValidation1 $baBudgetAcountValidation1
     * @access public
     */
    public $baBudgetAcountValidation1 = null;

    /**
     *
     * @var baBudgetAcountValidation2 $baBudgetAcountValidation2
     * @access public
     */
    public $baBudgetAcountValidation2 = null;

    /**
     *
     * @var abBillingElementPresenceCheck $abBillingElementPresenceCheck
     * @access public
     */
    public $abBillingElementPresenceCheck = null;

    /**
     *
     * @var iataNumberWithCheckDigit $iataNumberWithCheckDigit
     * @access public
     */
    public $iataNumberWithCheckDigit = null;

    /**
     *
     * @var baTempCreditAccount $baTempCreditAccount
     * @access public
     */
    public $baTempCreditAccount = null;

    /**
     *
     * @var baReporAndPrinttFreeflowFop $baReporAndPrinttFreeflowFop
     * @access public
     */
    public $baReporAndPrinttFreeflowFop = null;

    /**
     *
     * @var baReportFreeflowFop $baReportFreeflowFop
     * @access public
     */
    public $baReportFreeflowFop = null;

    /**
     *
     * @var baIataNumBlacklistValidation $baIataNumBlacklistValidation
     * @access public
     */
    public $baIataNumBlacklistValidation = null;

    /**
     *
     * @var varigFopRnVn $varigFopRnVn
     * @access public
     */
    public $varigFopRnVn = null;

    /**
     *
     * @var varigFopRaRc $varigFopRaRc
     * @access public
     */
    public $varigFopRaRc = null;

    /**
     *
     * @var varigFopCreditCardPrefixCheck1 $varigFopCreditCardPrefixCheck1
     * @access public
     */
    public $varigFopCreditCardPrefixCheck1 = null;

    /**
     *
     * @var varigFopCreditCardPrefixCheck2 $varigFopCreditCardPrefixCheck2
     * @access public
     */
    public $varigFopCreditCardPrefixCheck2 = null;

    /**
     *
     * @var directLinkCrediCard $directLinkCrediCard
     * @access public
     */
    public $directLinkCrediCard = null;

    /**
     *
     * @var qfNonAuthorisedFop $qfNonAuthorisedFop
     * @access public
     */
    public $qfNonAuthorisedFop = null;

    /**
     *
     * @var qfMcoFop1 $qfMcoFop1
     * @access public
     */
    public $qfMcoFop1 = null;

    /**
     *
     * @var qfMcoFop2 $qfMcoFop2
     * @access public
     */
    public $qfMcoFop2 = null;

    /**
     *
     * @var qfMcoFop3 $qfMcoFop3
     * @access public
     */
    public $qfMcoFop3 = null;

    /**
     *
     * @var qfMcoFop4 $qfMcoFop4
     * @access public
     */
    public $qfMcoFop4 = null;

    /**
     *
     * @var qfMcoFop5 $qfMcoFop5
     * @access public
     */
    public $qfMcoFop5 = null;

    /**
     *
     * @var supressCCAuthForPtaEot $supressCCAuthForPtaEot
     * @access public
     */
    public $supressCCAuthForPtaEot = null;

    /**
     *
     * @var internetCreditCard $internetCreditCard
     * @access public
     */
    public $internetCreditCard = null;

    /**
     *
     * @var creditCardVerificationCode1 $creditCardVerificationCode1
     * @access public
     */
    public $creditCardVerificationCode1 = null;

    /**
     *
     * @var creditCardVerificationCode2 $creditCardVerificationCode2
     * @access public
     */
    public $creditCardVerificationCode2 = null;

    /**
     *
     * @var creditCardVerificationCode3 $creditCardVerificationCode3
     * @access public
     */
    public $creditCardVerificationCode3 = null;

    /**
     *
     * @var attributeRecordFop $attributeRecordFop
     * @access public
     */
    public $attributeRecordFop = null;

    /**
     *
     * @var ctsAtoCtoFopForReportPrint1 $ctsAtoCtoFopForReportPrint1
     * @access public
     */
    public $ctsAtoCtoFopForReportPrint1 = null;

    /**
     *
     * @var ctsAtoCtoFopForReportPrint2 $ctsAtoCtoFopForReportPrint2
     * @access public
     */
    public $ctsAtoCtoFopForReportPrint2 = null;

    /**
     *
     * @var ctsAtoCtoFopForReportPrint3 $ctsAtoCtoFopForReportPrint3
     * @access public
     */
    public $ctsAtoCtoFopForReportPrint3 = null;

    /**
     *
     * @var ctsAtoCtoFopForReportPrint4 $ctsAtoCtoFopForReportPrint4
     * @access public
     */
    public $ctsAtoCtoFopForReportPrint4 = null;

    /**
     *
     * @var ctsAtoCtoFopForReportPrint5 $ctsAtoCtoFopForReportPrint5
     * @access public
     */
    public $ctsAtoCtoFopForReportPrint5 = null;

    /**
     *
     * @var sataFop $sataFop
     * @access public
     */
    public $sataFop = null;

    /**
     *
     * @var activateAuditCouponPrint $activateAuditCouponPrint
     * @access public
     */
    public $activateAuditCouponPrint = null;

    /**
     *
     * @var illegibleCCV2 $illegibleCCV2
     * @access public
     */
    public $illegibleCCV2 = null;

    /**
     *
     * @var missingCCV2 $missingCCV2
     * @access public
     */
    public $missingCCV2 = null;

    /**
     *
     * @var reportFpac $reportFpac
     * @access public
     */
    public $reportFpac = null;

    /**
     *
     * @var ctsCCApprovalVerification $ctsCCApprovalVerification
     * @access public
     */
    public $ctsCCApprovalVerification = null;

    /**
     *
     * @var ccSecurityIdResultCodes $ccSecurityIdResultCodes
     * @access public
     */
    public $ccSecurityIdResultCodes = null;

    /**
     *
     * @var debitCardPresent $debitCardPresent
     * @access public
     */
    public $debitCardPresent = null;

    /**
     *
     * @var autoGenOrReplicationOfCCData $autoGenOrReplicationOfCCData
     * @access public
     */
    public $autoGenOrReplicationOfCCData = null;

    /**
     *
     * @var ccAutoAprovalCode $ccAutoAprovalCode
     * @access public
     */
    public $ccAutoAprovalCode = null;

    /**
     *
     * @var ccManualAprovalCode $ccManualAprovalCode
     * @access public
     */
    public $ccManualAprovalCode = null;

    /**
     *
     * @var insBankAccountNumber $insBankAccountNumber
     * @access public
     */
    public $insBankAccountNumber = null;

    /**
     *
     * @var insBankCode $insBankCode
     * @access public
     */
    public $insBankCode = null;

    /**
     *
     * @var insBankAccountHolderName $insBankAccountHolderName
     * @access public
     */
    public $insBankAccountHolderName = null;

    /**
     *
     * @var standardCreditCard $standardCreditCard
     * @access public
     */
    public $standardCreditCard = null;

    /**
     *
     * @var explicitCurrency $explicitCurrency
     * @access public
     */
    public $explicitCurrency = null;

    /**
     *
     * @var nilAmount $nilAmount
     * @access public
     */
    public $nilAmount = null;

}

class monetaryInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class totalPrice {

    /**
     *
     * @var providerCode $providerCode
     * @access public
     */
    public $providerCode = null;

    /**
     *
     * @var externalRef $externalRef
     * @access public
     */
    public $externalRef = null;

    /**
     *
     * @var methodOfDelivery $methodOfDelivery
     * @access public
     */
    public $methodOfDelivery = null;

    /**
     *
     * @var mainPrice $mainPrice
     * @access public
     */
    public $mainPrice = null;

    /**
     *
     * @var otherPrices $otherPrices
     * @access public
     */
    public $otherPrices = null;

    /**
     *
     * @var productDescription $productDescription
     * @access public
     */
    public $productDescription = null;

    /**
     *
     * @var additionnalChargeInformation $additionnalChargeInformation
     * @access public
     */
    public $additionnalChargeInformation = null;

    /**
     *
     * @var rateCodeInformation $rateCodeInformation
     * @access public
     */
    public $rateCodeInformation = null;

    /**
     *
     * @var optionalBooking $optionalBooking
     * @access public
     */
    public $optionalBooking = null;

}

class externalRef {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class methodOfDelivery {

    /**
     *
     * @var elementManagement $elementManagement
     * @access public
     */
    public $elementManagement = null;

    /**
     *
     * @var deliveryDetails $deliveryDetails
     * @access public
     */
    public $deliveryDetails = null;

}

class elementManagement {

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

}

class deliveryDetails {

    /**
     *
     * @var packageType $packageType
     * @access public
     */
    public $packageType = null;

    /**
     *
     * @var packageDetails $packageDetails
     * @access public
     */
    public $packageDetails = null;

}

class packageDetails {

    /**
     *
     * @var packageDesc $packageDesc
     * @access public
     */
    public $packageDesc = null;

}

class mainPrice {

    /**
     *
     * @var priceDetails $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class otherPrices {

    /**
     *
     * @var priceDetails $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class productDescription {

    /**
     *
     * @var product $product
     * @access public
     */
    public $product = null;

    /**
     *
     * @var productRestriction $productRestriction
     * @access public
     */
    public $productRestriction = null;

}

class productData {

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

}

class productRestriction {

    /**
     *
     * @var restrictionDetails $restrictionDetails
     * @access public
     */
    public $restrictionDetails = null;

}

class restrictionDetails {

    /**
     *
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class additionnalChargeInformation {

    /**
     *
     * @var additionnalCharge $additionnalCharge
     * @access public
     */
    public $additionnalCharge = null;

}

class additionnalCharge {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

}

class rateCodeInformation {

    /**
     *
     * @var rateCode $rateCode
     * @access public
     */
    public $rateCode = null;

}

class optionalBooking {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class elementsIndicators {

    /**
     *
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class referenceForDataElement {

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

}

class tstData {

    /**
     *
     * @var tstGeneralInformation $tstGeneralInformation
     * @access public
     */
    public $tstGeneralInformation = null;

    /**
     *
     * @var tstFreetext $tstFreetext
     * @access public
     */
    public $tstFreetext = null;

    /**
     *
     * @var fareBasisInfo $fareBasisInfo
     * @access public
     */
    public $fareBasisInfo = null;

    /**
     *
     * @var fareData $fareData
     * @access public
     */
    public $fareData = null;

    /**
     *
     * @var segmentAssociation $segmentAssociation
     * @access public
     */
    public $segmentAssociation = null;

    /**
     *
     * @var referenceForTstData $referenceForTstData
     * @access public
     */
    public $referenceForTstData = null;

}

class tstGeneralInformation {

    /**
     *
     * @var generalInformation $generalInformation
     * @access public
     */
    public $generalInformation = null;

}

class generalInformation {

    /**
     *
     * @var tstReferenceNumber $tstReferenceNumber
     * @access public
     */
    public $tstReferenceNumber = null;

    /**
     *
     * @var tstCreationDate $tstCreationDate
     * @access public
     */
    public $tstCreationDate = null;

    /**
     *
     * @var salesIndicator $salesIndicator
     * @access public
     */
    public $salesIndicator = null;

}

class tstFreetext {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var longFreetext $longFreetext
     * @access public
     */
    public $longFreetext = null;

}

class fareBasisInfo {

    /**
     *
     * @var fareElement $fareElement
     * @access public
     */
    public $fareElement = null;

}

class fareElement {

    /**
     *
     * @var primaryCode $primaryCode
     * @access public
     */
    public $primaryCode = null;

    /**
     *
     * @var connection $connection
     * @access public
     */
    public $connection = null;

    /**
     *
     * @var notValidBefore $notValidBefore
     * @access public
     */
    public $notValidBefore = null;

    /**
     *
     * @var notValidAfter $notValidAfter
     * @access public
     */
    public $notValidAfter = null;

    /**
     *
     * @var baggageAllowance $baggageAllowance
     * @access public
     */
    public $baggageAllowance = null;

    /**
     *
     * @var fareBasis $fareBasis
     * @access public
     */
    public $fareBasis = null;

    /**
     *
     * @var ticketDesignator $ticketDesignator
     * @access public
     */
    public $ticketDesignator = null;

}

class fareData {

    /**
     *
     * @var issueIdentifier $issueIdentifier
     * @access public
     */
    public $issueIdentifier = null;

    /**
     *
     * @var monetaryInfo $monetaryInfo
     * @access public
     */
    public $monetaryInfo = null;

    /**
     *
     * @var taxFields $taxFields
     * @access public
     */
    public $taxFields = null;

}

class taxFields {

    /**
     *
     * @var taxIndicator $taxIndicator
     * @access public
     */
    public $taxIndicator = null;

    /**
     *
     * @var taxCurrency $taxCurrency
     * @access public
     */
    public $taxCurrency = null;

    /**
     *
     * @var taxAmount $taxAmount
     * @access public
     */
    public $taxAmount = null;

    /**
     *
     * @var taxCountryCode $taxCountryCode
     * @access public
     */
    public $taxCountryCode = null;

    /**
     *
     * @var taxNatureCode $taxNatureCode
     * @access public
     */
    public $taxNatureCode = null;

}

class segmentAssociation {

    /**
     *
     * @var selection $selection
     * @access public
     */
    public $selection = null;

}

class referenceForTstData {

    /**
     *
     * @var reference $reference
     * @access public
     */
    public $reference = null;

}

class groupCounters {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class yieldGroup {

    /**
     *
     * @var yieldData $yieldData
     * @access public
     */
    public $yieldData = null;

    /**
     *
     * @var yieldDataGroup $yieldDataGroup
     * @access public
     */
    public $yieldDataGroup = null;

}

class yieldDataGroup {

    /**
     *
     * @var yieldInformations $yieldInformations
     * @access public
     */
    public $yieldInformations = null;

    /**
     *
     * @var classCombinaison $classCombinaison
     * @access public
     */
    public $classCombinaison = null;

    /**
     *
     * @var ondyield $ondyield
     * @access public
     */
    public $ondyield = null;

    /**
     *
     * @var tripOnD $tripOnD
     * @access public
     */
    public $tripOnD = null;

}

class yieldInformations {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class classCombinaison {

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class ondyield {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class tripOnD {

    /**
     *
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     *
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class frequentFlyerInformationGroup {

    /**
     *
     * @var frequentTravellerInfo $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     *
     * @var discountInformation $discountInformation
     * @access public
     */
    public $discountInformation = null;

    /**
     *
     * @var bookingClassInformation $bookingClassInformation
     * @access public
     */
    public $bookingClassInformation = null;

}

class discountInformation {

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class bookingClassInformation {

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class PNR_AddMultiElements {

    /**
     *
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     *
     * @var pnrActions $pnrActions
     * @access public
     */
    public $pnrActions = null;

    /**
     *
     * @var travellerInfo $travellerInfo
     * @access public
     */
    public $travellerInfo = null;

    /**
     *
     * @var originDestinationDetails $originDestinationDetails
     * @access public
     */
    public $originDestinationDetails = null;

    /**
     *
     * @var dataElementsMaster $dataElementsMaster
     * @access public
     */
    public $dataElementsMaster = null;

}

class pnrActions {

    /**
     *
     * @var optionCode $optionCode
     * @access public
     */
    public $optionCode = null;

}

class airAuxItinerary {

    /**
     *
     * @var travelProduct $travelProduct
     * @access public
     */
    public $travelProduct = null;

    /**
     *
     * @var messageAction $messageAction
     * @access public
     */
    public $messageAction = null;

    /**
     *
     * @var relatedProduct $relatedProduct
     * @access public
     */
    public $relatedProduct = null;

    /**
     *
     * @var selectionDetailsAir $selectionDetailsAir
     * @access public
     */
    public $selectionDetailsAir = null;

    /**
     *
     * @var reservationInfoSell $reservationInfoSell
     * @access public
     */
    public $reservationInfoSell = null;

    /**
     *
     * @var freetextItinerary $freetextItinerary
     * @access public
     */
    public $freetextItinerary = null;

}

class company {

    /**
     *
     * @var identification $identification
     * @access public
     */
    public $identification = null;

}

class selectionDetailsAir {

    /**
     *
     * @var selection $selection
     * @access public
     */
    public $selection = null;

}

class reservationInfoSell {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class freetextItinerary {

    /**
     *
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     *
     * @var longFreetext $longFreetext
     * @access public
     */
    public $longFreetext = null;

}

class marker1 {

}

class miscellaneousRemark {

    /**
     *
     * @var remarks $remarks
     * @access public
     */
    public $remarks = null;

}

class tourCode {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var formatedTour $formatedTour
     * @access public
     */
    public $formatedTour = null;

    /**
     *
     * @var netRemit $netRemit
     * @access public
     */
    public $netRemit = null;

    /**
     *
     * @var freeFormatTour $freeFormatTour
     * @access public
     */
    public $freeFormatTour = null;

}

class formatedTour {

    /**
     *
     * @var productId $productId
     * @access public
     */
    public $productId = null;

    /**
     *
     * @var year $year
     * @access public
     */
    public $year = null;

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var approvalCode $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     *
     * @var partyId $partyId
     * @access public
     */
    public $partyId = null;

}

class netRemit {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var freetext $freetext
     * @access public
     */
    public $freetext = null;

}

class freeFormatTour {

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var freetext $freetext
     * @access public
     */
    public $freetext = null;

}

class optionalData {

    /**
     *
     * @var option $option
     * @access public
     */
    public $option = null;

    /**
     *
     * @var optionText $optionText
     * @access public
     */
    public $optionText = null;

}

class printer {

    /**
     *
     * @var identifierDetail $identifierDetail
     * @access public
     */
    public $identifierDetail = null;

    /**
     *
     * @var office $office
     * @access public
     */
    public $office = null;

    /**
     *
     * @var teletypeAddress $teletypeAddress
     * @access public
     */
    public $teletypeAddress = null;

}

class identifierDetail {

    /**
     *
     * @var name $name
     * @access public
     */
    public $name = null;

    /**
     *
     * @var network $network
     * @access public
     */
    public $network = null;

}

class seatGroup {

    /**
     *
     * @var seatRequest $seatRequest
     * @access public
     */
    public $seatRequest = null;

    /**
     *
     * @var railSeatReferenceInformation $railSeatReferenceInformation
     * @access public
     */
    public $railSeatReferenceInformation = null;

    /**
     *
     * @var railSeatPreferences $railSeatPreferences
     * @access public
     */
    public $railSeatPreferences = null;

}

class seatRequest {

    /**
     *
     * @var seat $seat
     * @access public
     */
    public $seat = null;

    /**
     *
     * @var special $special
     * @access public
     */
    public $special = null;

}

class seat {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var boardpoint $boardpoint
     * @access public
     */
    public $boardpoint = null;

    /**
     *
     * @var offpoint $offpoint
     * @access public
     */
    public $offpoint = null;

}

class special {

    /**
     *
     * @var data $data
     * @access public
     */
    public $data = null;

    /**
     *
     * @var seatType $seatType
     * @access public
     */
    public $seatType = null;

}

class fareDiscount {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var discount $discount
     * @access public
     */
    public $discount = null;

    /**
     *
     * @var birthDate $birthDate
     * @access public
     */
    public $birthDate = null;

    /**
     *
     * @var numberDetail $numberDetail
     * @access public
     */
    public $numberDetail = null;

    /**
     *
     * @var rpInformation $rpInformation
     * @access public
     */
    public $rpInformation = null;

    /**
     *
     * @var customer $customer
     * @access public
     */
    public $customer = null;

    /**
     *
     * @var residentDisc $residentDisc
     * @access public
     */
    public $residentDisc = null;

}

class discount {

    /**
     *
     * @var adjustmentReason $adjustmentReason
     * @access public
     */
    public $adjustmentReason = null;

    /**
     *
     * @var percentage $percentage
     * @access public
     */
    public $percentage = null;

    /**
     *
     * @var status $status
     * @access public
     */
    public $status = null;

    /**
     *
     * @var staffNumber $staffNumber
     * @access public
     */
    public $staffNumber = null;

    /**
     *
     * @var staffName $staffName
     * @access public
     */
    public $staffName = null;

}

class rpInformation {

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var referenceNumber $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

}

class customer {

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var cardType $cardType
     * @access public
     */
    public $cardType = null;

    /**
     *
     * @var cardNumber $cardNumber
     * @access public
     */
    public $cardNumber = null;

    /**
     *
     * @var cardCheck $cardCheck
     * @access public
     */
    public $cardCheck = null;

    /**
     *
     * @var owner $owner
     * @access public
     */
    public $owner = null;

    /**
     *
     * @var version $version
     * @access public
     */
    public $version = null;

}

class residentDisc {

    /**
     *
     * @var idCardCode $idCardCode
     * @access public
     */
    public $idCardCode = null;

    /**
     *
     * @var idCardType $idCardType
     * @access public
     */
    public $idCardType = null;

    /**
     *
     * @var cardNumber $cardNumber
     * @access public
     */
    public $cardNumber = null;

    /**
     *
     * @var alphaCheck $alphaCheck
     * @access public
     */
    public $alphaCheck = null;

    /**
     *
     * @var zipCode $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     *
     * @var certificateNumber $certificateNumber
     * @access public
     */
    public $certificateNumber = null;

}

class manualFareDocument {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var document $document
     * @access public
     */
    public $document = null;

    /**
     *
     * @var freeflow $freeflow
     * @access public
     */
    public $freeflow = null;

}

class document {

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var ticketNumber $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

    /**
     *
     * @var ticketNumberCd $ticketNumberCd
     * @access public
     */
    public $ticketNumberCd = null;

    /**
     *
     * @var lastConjuction $lastConjuction
     * @access public
     */
    public $lastConjuction = null;

    /**
     *
     * @var lastConjuctionCD $lastConjuctionCD
     * @access public
     */
    public $lastConjuctionCD = null;

}

class commission {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var commissionInfo $commissionInfo
     * @access public
     */
    public $commissionInfo = null;

    /**
     *
     * @var oldCommission $oldCommission
     * @access public
     */
    public $oldCommission = null;

    /**
     *
     * @var manualCapping $manualCapping
     * @access public
     */
    public $manualCapping = null;

}

class commissionInfo {

    /**
     *
     * @var percentage $percentage
     * @access public
     */
    public $percentage = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var vatIndicator $vatIndicator
     * @access public
     */
    public $vatIndicator = null;

    /**
     *
     * @var remitIndicator $remitIndicator
     * @access public
     */
    public $remitIndicator = null;

}

class oldCommission {

    /**
     *
     * @var percentage $percentage
     * @access public
     */
    public $percentage = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var vatIndicator $vatIndicator
     * @access public
     */
    public $vatIndicator = null;

    /**
     *
     * @var remitIndicator $remitIndicator
     * @access public
     */
    public $remitIndicator = null;

}

class originalIssue {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var voucherIndicator $voucherIndicator
     * @access public
     */
    public $voucherIndicator = null;

    /**
     *
     * @var issue $issue
     * @access public
     */
    public $issue = null;

    /**
     *
     * @var baseFare $baseFare
     * @access public
     */
    public $baseFare = null;

    /**
     *
     * @var totalTax $totalTax
     * @access public
     */
    public $totalTax = null;

    /**
     *
     * @var penalty $penalty
     * @access public
     */
    public $penalty = null;

    /**
     *
     * @var freeflow $freeflow
     * @access public
     */
    public $freeflow = null;

}

class issue {

    /**
     *
     * @var airlineCode $airlineCode
     * @access public
     */
    public $airlineCode = null;

    /**
     *
     * @var documentNumber $documentNumber
     * @access public
     */
    public $documentNumber = null;

    /**
     *
     * @var documentCD $documentCD
     * @access public
     */
    public $documentCD = null;

    /**
     *
     * @var coupon1 $coupon1
     * @access public
     */
    public $coupon1 = null;

    /**
     *
     * @var coupon2 $coupon2
     * @access public
     */
    public $coupon2 = null;

    /**
     *
     * @var coupon3 $coupon3
     * @access public
     */
    public $coupon3 = null;

    /**
     *
     * @var coupon4 $coupon4
     * @access public
     */
    public $coupon4 = null;

    /**
     *
     * @var lastConjunction $lastConjunction
     * @access public
     */
    public $lastConjunction = null;

    /**
     *
     * @var exchangeDocumentCD $exchangeDocumentCD
     * @access public
     */
    public $exchangeDocumentCD = null;

    /**
     *
     * @var lastConjunction1 $lastConjunction1
     * @access public
     */
    public $lastConjunction1 = null;

    /**
     *
     * @var lastConjunction2 $lastConjunction2
     * @access public
     */
    public $lastConjunction2 = null;

    /**
     *
     * @var lastConjunction3 $lastConjunction3
     * @access public
     */
    public $lastConjunction3 = null;

    /**
     *
     * @var lastConjunction4 $lastConjunction4
     * @access public
     */
    public $lastConjunction4 = null;

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     *
     * @var dateOfIssue $dateOfIssue
     * @access public
     */
    public $dateOfIssue = null;

    /**
     *
     * @var iataNumber $iataNumber
     * @access public
     */
    public $iataNumber = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

}

class fop {

    /**
     *
     * @var identification $identification
     * @access public
     */
    public $identification = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var creditCardCode $creditCardCode
     * @access public
     */
    public $creditCardCode = null;

    /**
     *
     * @var accountNumber $accountNumber
     * @access public
     */
    public $accountNumber = null;

    /**
     *
     * @var expiryDate $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     *
     * @var approvalCode $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     *
     * @var customerAccountNumber $customerAccountNumber
     * @access public
     */
    public $customerAccountNumber = null;

    /**
     *
     * @var paymentTimeReference $paymentTimeReference
     * @access public
     */
    public $paymentTimeReference = null;

    /**
     *
     * @var freetext $freetext
     * @access public
     */
    public $freetext = null;

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * How to inicialize the fop
     * @param string $identification
     */
    public function __construct($identification = 'CA') {
        $this->identification = $identification;
    }

}

class fopExtension {

    /**
     *
     * @var fopSequenceNumber $fopSequenceNumber
     * @access public
     */
    public $fopSequenceNumber = null;

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var newFopsDetails $newFopsDetails
     * @access public
     */
    public $newFopsDetails = null;

    /**
     *
     * @var extFOP $extFOP
     * @access public
     */
    public $extFOP = null;

}

class newFopsDetails {

    /**
     *
     * @var cvData $cvData
     * @access public
     */
    public $cvData = null;

    /**
     *
     * @var printedFreeflow $printedFreeflow
     * @access public
     */
    public $printedFreeflow = null;

    /**
     *
     * @var reportedFreeflow $reportedFreeflow
     * @access public
     */
    public $reportedFreeflow = null;

    /**
     *
     * @var onoData $onoData
     * @access public
     */
    public $onoData = null;

    /**
     *
     * @var gwtData $gwtData
     * @access public
     */
    public $gwtData = null;

    /**
     *
     * @var chdData $chdData
     * @access public
     */
    public $chdData = null;

    /**
     *
     * @var delegationCode $delegationCode
     * @access public
     */
    public $delegationCode = null;

    /**
     *
     * @var mcoDocNumber $mcoDocNumber
     * @access public
     */
    public $mcoDocNumber = null;

    /**
     *
     * @var mcoCouponNumber $mcoCouponNumber
     * @access public
     */
    public $mcoCouponNumber = null;

    /**
     *
     * @var mcoIataNumber $mcoIataNumber
     * @access public
     */
    public $mcoIataNumber = null;

    /**
     *
     * @var mcoPlaceOfIssue $mcoPlaceOfIssue
     * @access public
     */
    public $mcoPlaceOfIssue = null;

    /**
     *
     * @var mcoDateOfIssue $mcoDateOfIssue
     * @access public
     */
    public $mcoDateOfIssue = null;

    /**
     *
     * @var iataNumber $iataNumber
     * @access public
     */
    public $iataNumber = null;

}

class extFOP {

    /**
     *
     * @var referenceQualifier $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     *
     * @var dataValue $dataValue
     * @access public
     */
    public $dataValue = null;

}

class frequentTravellerVerification {

    /**
     *
     * @var actionRequest $actionRequest
     * @access public
     */
    public $actionRequest = null;

    /**
     *
     * @var company $company
     * @access public
     */
    public $company = null;

    /**
     *
     * @var account $account
     * @access public
     */
    public $account = null;

}

class ticketingCarrier {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var carrier $carrier
     * @access public
     */
    public $carrier = null;

}

class carrier {

    /**
     *
     * @var airlineCode $airlineCode
     * @access public
     */
    public $airlineCode = null;

    /**
     *
     * @var optionInfo $optionInfo
     * @access public
     */
    public $optionInfo = null;

    /**
     *
     * @var printerNumber $printerNumber
     * @access public
     */
    public $printerNumber = null;

    /**
     *
     * @var language $language
     * @access public
     */
    public $language = null;

}

class farePrintOverride {

    /**
     *
     * @var passengerType $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     *
     * @var override $override
     * @access public
     */
    public $override = null;

}

class override {

    /**
     *
     * @var baseFare $baseFare
     * @access public
     */
    public $baseFare = null;

    /**
     *
     * @var totalFare $totalFare
     * @access public
     */
    public $totalFare = null;

    /**
     *
     * @var equivalentFare $equivalentFare
     * @access public
     */
    public $equivalentFare = null;

    /**
     *
     * @var taxAmount $taxAmount
     * @access public
     */
    public $taxAmount = null;

}

class frequentTravellerData {

    /**
     *
     * @var frequentTraveller $frequentTraveller
     * @access public
     */
    public $frequentTraveller = null;

}

class frequentTraveller {

    /**
     *
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     *
     * @var membershipNumber $membershipNumber
     * @access public
     */
    public $membershipNumber = null;

}

class accessLevel {

    /**
     *
     * @var securityDetails $securityDetails
     * @access public
     */
    public $securityDetails = null;

}

class securityDetails {

    /**
     *
     * @var typeOfEntity $typeOfEntity
     * @access public
     */
    public $typeOfEntity = null;

    /**
     *
     * @var accessMode $accessMode
     * @access public
     */
    public $accessMode = null;

    /**
     *
     * @var inhouseIdentification $inhouseIdentification
     * @access public
     */
    public $inhouseIdentification = null;

}

class PNR_Retrieve {

    /**
     *
     * @var settings $settings
     * @access public
     */
    public $settings = null;

    /**
     *
     * @var retrievalFacts $retrievalFacts
     * @access public
     */
    public $retrievalFacts = null;

}

class settings {

    /**
     *
     * @var options $options
     * @access public
     */
    public $options = null;

    /**
     *
     * @var printer $printer
     * @access public
     */
    public $printer = null;

}

class options {

    /**
     *
     * @var optionCode $optionCode
     * @access public
     */
    public $optionCode = null;

}

class retrievalFacts {

    /**
     *
     * @var retrieve $retrieve
     * @access public
     */
    public $retrieve = null;

    /**
     *
     * @var reservationOrProfileIdentifier $reservationOrProfileIdentifier
     * @access public
     */
    public $reservationOrProfileIdentifier = null;

    /**
     *
     * @var personalFacts $personalFacts
     * @access public
     */
    public $personalFacts = null;

    /**
     *
     * @var frequentFlyer $frequentFlyer
     * @access public
     */
    public $frequentFlyer = null;

    /**
     *
     * @var accounting $accounting
     * @access public
     */
    public $accounting = null;

}

class retrieve {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var service $service
     * @access public
     */
    public $service = null;

    /**
     *
     * @var tattoo $tattoo
     * @access public
     */
    public $tattoo = null;

    /**
     *
     * @var office $office
     * @access public
     */
    public $office = null;

    /**
     *
     * @var targetSystem $targetSystem
     * @access public
     */
    public $targetSystem = null;

    /**
     *
     * @var option1 $option1
     * @access public
     */
    public $option1 = null;

    /**
     *
     * @var option2 $option2
     * @access public
     */
    public $option2 = null;

}

class reservationOrProfileIdentifier {

    /**
     *
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class personalFacts {

    /**
     *
     * @var travellerInformation $travellerInformation
     * @access public
     */
    public $travellerInformation = null;

    /**
     *
     * @var productInformation $productInformation
     * @access public
     */
    public $productInformation = null;

    /**
     *
     * @var ticket $ticket
     * @access public
     */
    public $ticket = null;

}

class frequentFlyer {

    /**
     *
     * @var frequentTraveller $frequentTraveller
     * @access public
     */
    public $frequentTraveller = null;

}

class PNR_Cancel {

    /**
     *
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     *
     * @var pnrActions $pnrActions
     * @access public
     */
    public $pnrActions = null;

    /**
     *
     * @var cancelElements $cancelElements
     * @access public
     */
    public $cancelElements = null;

}

class cancelElements {

    /**
     *
     * @var entryType $entryType
     * @access public
     */
    public $entryType = null;

    /**
     *
     * @var element $element
     * @access public
     */
    public $element = null;

}

class element {

    /**
     *
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var subElement $subElement
     * @access public
     */
    public $subElement = null;

}

class Air_RetrieveSeatMap {

    /**
     *
     * @var travelProductIdent $travelProductIdent
     * @access public
     */
    public $travelProductIdent = null;

    /**
     *
     * @var seatRequestParameters $seatRequestParameters
     * @access public
     */
    public $seatRequestParameters = null;

    /**
     *
     * @var seatsInformations $seatsInformations
     * @access public
     */
    public $seatsInformations = null;

    /**
     *
     * @var frequentTravelerSpecif $frequentTravelerSpecif
     * @access public
     */
    public $frequentTravelerSpecif = null;

    /**
     *
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     *
     * @var travelers $travelers
     * @access public
     */
    public $travelers = null;

}

class travelProductIdent {

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     *
     * @var boardpointDetail $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     *
     * @var offPointDetail $offPointDetail
     * @access public
     */
    public $offPointDetail = null;

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

}

class offPointDetail2 {

    /**
     *
     * @var arrivalCityCode $arrivalCityCode
     * @access public
     */
    public $arrivalCityCode = null;

}

class seatRequestParameters {

    /**
     *
     * @var genericDetails $genericDetails
     * @access public
     */
    public $genericDetails = null;

    /**
     *
     * @var rangeOfRowsDetails $rangeOfRowsDetails
     * @access public
     */
    public $rangeOfRowsDetails = null;

    /**
     *
     * @var actionRequired $actionRequired
     * @access public
     */
    public $actionRequired = null;

    /**
     *
     * @var freeSeatingReference $freeSeatingReference
     * @access public
     */
    public $freeSeatingReference = null;

    /**
     *
     * @var infoRelatedToCabinClass $infoRelatedToCabinClass
     * @access public
     */
    public $infoRelatedToCabinClass = null;

}

class rangeOfRowsDetails {

    /**
     *
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

    /**
     *
     * @var numberOfRows $numberOfRows
     * @access public
     */
    public $numberOfRows = null;

    /**
     *
     * @var seatColumn $seatColumn
     * @access public
     */
    public $seatColumn = null;

}

class seatsInformations {

    /**
     *
     * @var numberOfSeats $numberOfSeats
     * @access public
     */
    public $numberOfSeats = null;

    /**
     *
     * @var statusCodeRequested $statusCodeRequested
     * @access public
     */
    public $statusCodeRequested = null;

}

class frequentTravelerSpecif {

    /**
     *
     * @var frequentTravelerInfo $frequentTravelerInfo
     * @access public
     */
    public $frequentTravelerInfo = null;

    /**
     *
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class frequentTravelerInfo {

    /**
     *
     * @var frequentTravelerCompany $frequentTravelerCompany
     * @access public
     */
    public $frequentTravelerCompany = null;

    /**
     *
     * @var frequentTravelerIdentCode $frequentTravelerIdentCode
     * @access public
     */
    public $frequentTravelerIdentCode = null;

    /**
     *
     * @var frequentTravelerRefNumber $frequentTravelerRefNumber
     * @access public
     */
    public $frequentTravelerRefNumber = null;

    /**
     *
     * @var membershipLevel $membershipLevel
     * @access public
     */
    public $membershipLevel = null;

}

class travelers {

    /**
     *
     * @var travelerInformation $travelerInformation
     * @access public
     */
    public $travelerInformation = null;

    /**
     *
     * @var frequentTraveler $frequentTraveler
     * @access public
     */
    public $frequentTraveler = null;

}

class travelerInformation {

    /**
     *
     * @var paxSurnameDetails $paxSurnameDetails
     * @access public
     */
    public $paxSurnameDetails = null;

    /**
     *
     * @var individualPaxDetails $individualPaxDetails
     * @access public
     */
    public $individualPaxDetails = null;

}

class paxSurnameDetails {

    /**
     *
     * @var paxSurname $paxSurname
     * @access public
     */
    public $paxSurname = null;

    /**
     *
     * @var paxType $paxType
     * @access public
     */
    public $paxType = null;

    /**
     *
     * @var paxNumber $paxNumber
     * @access public
     */
    public $paxNumber = null;

    /**
     *
     * @var paxStatus $paxStatus
     * @access public
     */
    public $paxStatus = null;

}

class individualPaxDetails {

    /**
     *
     * @var individualPaxGivenName $individualPaxGivenName
     * @access public
     */
    public $individualPaxGivenName = null;

    /**
     *
     * @var individualPaxType $individualPaxType
     * @access public
     */
    public $individualPaxType = null;

    /**
     *
     * @var paxReferenceNumber $paxReferenceNumber
     * @access public
     */
    public $paxReferenceNumber = null;

    /**
     *
     * @var paxInfantIndicator $paxInfantIndicator
     * @access public
     */
    public $paxInfantIndicator = null;

    /**
     *
     * @var identificationCode $identificationCode
     * @access public
     */
    public $identificationCode = null;

}

class Air_RetrieveSeatMapReply {

    /**
     *
     * @var responseAnalysisDetails $responseAnalysisDetails
     * @access public
     */
    public $responseAnalysisDetails = null;

    /**
     *
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

    /**
     *
     * @var warningInformation $warningInformation
     * @access public
     */
    public $warningInformation = null;

    /**
     *
     * @var seatRequestParameters $seatRequestParameters
     * @access public
     */
    public $seatRequestParameters = null;

    /**
     *
     * @var segment $segment
     * @access public
     */
    public $segment = null;

}

class responseAnalysisDetails {

    /**
     *
     * @var responseType $responseType
     * @access public
     */
    public $responseType = null;

    /**
     *
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class warningInformation {

    /**
     *
     * @var warningDetails $warningDetails
     * @access public
     */
    public $warningDetails = null;

}

class warningDetails {

    /**
     *
     * @var processingLevel $processingLevel
     * @access public
     */
    public $processingLevel = null;

    /**
     *
     * @var warningNumber $warningNumber
     * @access public
     */
    public $warningNumber = null;

    /**
     *
     * @var warningText $warningText
     * @access public
     */
    public $warningText = null;

}

class segment {

    /**
     *
     * @var flightDateInformation $flightDateInformation
     * @access public
     */
    public $flightDateInformation = null;

    /**
     *
     * @var segmentErrorDetails $segmentErrorDetails
     * @access public
     */
    public $segmentErrorDetails = null;

    /**
     *
     * @var segmentWarningInformation $segmentWarningInformation
     * @access public
     */
    public $segmentWarningInformation = null;

    /**
     *
     * @var additionalProductInfo $additionalProductInfo
     * @access public
     */
    public $additionalProductInfo = null;

    /**
     *
     * @var aircraftEquipementDetails $aircraftEquipementDetails
     * @access public
     */
    public $aircraftEquipementDetails = null;

    /**
     *
     * @var cabin $cabin
     * @access public
     */
    public $cabin = null;

    /**
     *
     * @var row $row
     * @access public
     */
    public $row = null;

}

class flightDateInformation {

    /**
     *
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     *
     * @var boardpointDetail $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     *
     * @var offPointDetail $offPointDetail
     * @access public
     */
    public $offPointDetail = null;

    /**
     *
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

}

class segmentErrorDetails {

    /**
     *
     * @var errorInformation $errorInformation
     * @access public
     */
    public $errorInformation = null;

}

class segmentWarningInformation {

    /**
     *
     * @var warningDetails $warningDetails
     * @access public
     */
    public $warningDetails = null;

}

class additionalProductInfo {

    /**
     *
     * @var additionalProductDetails $additionalProductDetails
     * @access public
     */
    public $additionalProductDetails = null;

    /**
     *
     * @var departureInformation $departureInformation
     * @access public
     */
    public $departureInformation = null;

    /**
     *
     * @var arrivalInformation $arrivalInformation
     * @access public
     */
    public $arrivalInformation = null;

    /**
     *
     * @var travelerTimeDetails $travelerTimeDetails
     * @access public
     */
    public $travelerTimeDetails = null;

    /**
     *
     * @var productFacilities $productFacilities
     * @access public
     */
    public $productFacilities = null;

}

class additionalProductDetails {

    /**
     *
     * @var meansOfTransportType $meansOfTransportType
     * @access public
     */
    public $meansOfTransportType = null;

    /**
     *
     * @var numberOfStops $numberOfStops
     * @access public
     */
    public $numberOfStops = null;

    /**
     *
     * @var legDuration $legDuration
     * @access public
     */
    public $legDuration = null;

    /**
     *
     * @var daysOfOperation $daysOfOperation
     * @access public
     */
    public $daysOfOperation = null;

}

class arrivalInformation {

    /**
     *
     * @var arrivalGate $arrivalGate
     * @access public
     */
    public $arrivalGate = null;

    /**
     *
     * @var arrivalTerminal $arrivalTerminal
     * @access public
     */
    public $arrivalTerminal = null;

    /**
     *
     * @var arrivalConcourse $arrivalConcourse
     * @access public
     */
    public $arrivalConcourse = null;

}

class travelerTimeDetails {

    /**
     *
     * @var checkInDetails $checkInDetails
     * @access public
     */
    public $checkInDetails = null;

}

class productFacilities {

    /**
     *
     * @var facilityTypeCode $facilityTypeCode
     * @access public
     */
    public $facilityTypeCode = null;

    /**
     *
     * @var facilityDescriptionText $facilityDescriptionText
     * @access public
     */
    public $facilityDescriptionText = null;

}

class aircraftEquipementDetails {

    /**
     *
     * @var fittedConfiguration $fittedConfiguration
     * @access public
     */
    public $fittedConfiguration = null;

    /**
     *
     * @var meansOfTransport $meansOfTransport
     * @access public
     */
    public $meansOfTransport = null;

    /**
     *
     * @var additionalEquipmentInfo $additionalEquipmentInfo
     * @access public
     */
    public $additionalEquipmentInfo = null;

    /**
     *
     * @var equipmentFreeText $equipmentFreeText
     * @access public
     */
    public $equipmentFreeText = null;

}

class fittedConfiguration {

    /**
     *
     * @var cabinClass $cabinClass
     * @access public
     */
    public $cabinClass = null;

    /**
     *
     * @var cabinCapacity $cabinCapacity
     * @access public
     */
    public $cabinCapacity = null;

}

class additionalEquipmentInfo {

    /**
     *
     * @var aircraftVersion $aircraftVersion
     * @access public
     */
    public $aircraftVersion = null;

    /**
     *
     * @var airlineDetails $airlineDetails
     * @access public
     */
    public $airlineDetails = null;

}

class cabin {

    /**
     *
     * @var cabinDetails $cabinDetails
     * @access public
     */
    public $cabinDetails = null;

    /**
     *
     * @var cabinFacilitiesDetail $cabinFacilitiesDetail
     * @access public
     */
    public $cabinFacilitiesDetail = null;

}

class cabinDetails {

    /**
     *
     * @var cabinClassDesignation $cabinClassDesignation
     * @access public
     */
    public $cabinClassDesignation = null;

    /**
     *
     * @var cabinRangeOfRowsDetail $cabinRangeOfRowsDetail
     * @access public
     */
    public $cabinRangeOfRowsDetail = null;

    /**
     *
     * @var cabinLocation $cabinLocation
     * @access public
     */
    public $cabinLocation = null;

    /**
     *
     * @var smokingRowRange $smokingRowRange
     * @access public
     */
    public $smokingRowRange = null;

    /**
     *
     * @var seatOccupationDefault $seatOccupationDefault
     * @access public
     */
    public $seatOccupationDefault = null;

    /**
     *
     * @var overwingRowRange $overwingRowRange
     * @access public
     */
    public $overwingRowRange = null;

    /**
     *
     * @var cabinColumnDetails $cabinColumnDetails
     * @access public
     */
    public $cabinColumnDetails = null;

}

class cabinClassDesignation {

    /**
     *
     * @var cabinClassDesignator $cabinClassDesignator
     * @access public
     */
    public $cabinClassDesignator = null;

    /**
     *
     * @var resBookingDesignator $resBookingDesignator
     * @access public
     */
    public $resBookingDesignator = null;

    /**
     *
     * @var cabinClassOfServiceCode $cabinClassOfServiceCode
     * @access public
     */
    public $cabinClassOfServiceCode = null;

    /**
     *
     * @var compartmentDesignator $compartmentDesignator
     * @access public
     */
    public $compartmentDesignator = null;

}

class cabinRangeOfRowsDetail {

    /**
     *
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

}

class smokingRowRange {

    /**
     *
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

}

class overwingRowRange {

    /**
     *
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

}

class cabinColumnDetails {

    /**
     *
     * @var seatColumn $seatColumn
     * @access public
     */
    public $seatColumn = null;

    /**
     *
     * @var columnCharacteristic $columnCharacteristic
     * @access public
     */
    public $columnCharacteristic = null;

}

class cabinFacilitiesDetail {

    /**
     *
     * @var rowLocation $rowLocation
     * @access public
     */
    public $rowLocation = null;

    /**
     *
     * @var cabinFacilities $cabinFacilities
     * @access public
     */
    public $cabinFacilities = null;

}

class cabinFacilities {

    /**
     *
     * @var typeOfFacilities $typeOfFacilities
     * @access public
     */
    public $typeOfFacilities = null;

    /**
     *
     * @var locationOfTheFacility $locationOfTheFacility
     * @access public
     */
    public $locationOfTheFacility = null;

}

class row {

    /**
     *
     * @var rowDetails $rowDetails
     * @access public
     */
    public $rowDetails = null;

    /**
     *
     * @var rowFacilitiesDetail $rowFacilitiesDetail
     * @access public
     */
    public $rowFacilitiesDetail = null;

}

class rowDetails {

    /**
     *
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

    /**
     *
     * @var rowCharacteristicsDetails $rowCharacteristicsDetails
     * @access public
     */
    public $rowCharacteristicsDetails = null;

    /**
     *
     * @var seatOccupationDetails $seatOccupationDetails
     * @access public
     */
    public $seatOccupationDetails = null;

}

class rowCharacteristicsDetails {

    /**
     *
     * @var rowCharacteristic $rowCharacteristic
     * @access public
     */
    public $rowCharacteristic = null;

}

class seatOccupationDetails {

    /**
     *
     * @var seatColumn $seatColumn
     * @access public
     */
    public $seatColumn = null;

    /**
     *
     * @var seatOccupation $seatOccupation
     * @access public
     */
    public $seatOccupation = null;

    /**
     *
     * @var seatCharacteristic $seatCharacteristic
     * @access public
     */
    public $seatCharacteristic = null;

}

class rowFacilitiesDetail {

    /**
     *
     * @var rowLocation $rowLocation
     * @access public
     */
    public $rowLocation = null;

    /**
     *
     * @var cabinFacilities $cabinFacilities
     * @access public
     */
    public $cabinFacilities = null;

}

class Ticket_CreateTSTFromPricing {

    /**
     *
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     *
     * @var psaList $psaList
     * @access public
     */
    public $psaList = null;

}

class pnrLocatorData {

    /**
     *
     * @var reservationInformation $reservationInformation
     * @access public
     */
    public $reservationInformation = null;

}

class reservationInformation {

    /**
     *
     * @var controlNumber $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class psaList {

    /**
     *
     * @var itemReference $itemReference
     * @access public
     */
    public $itemReference = null;

    /**
     *
     * @var paxReference $paxReference
     * @access public
     */
    public $paxReference = null;

}

class itemReference {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class refDetails {

    /**
     *
     * @var refQualifier $refQualifier
     * @access public
     */
    public $refQualifier = null;

    /**
     *
     * @var refNumber $refNumber
     * @access public
     */
    public $refNumber = null;

}

class Ticket_CreateTSTFromPricingReply {

    /**
     *
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     *
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     *
     * @var tstList $tstList
     * @access public
     */
    public $tstList = null;

}

class applicationErrorInfo {

    /**
     *
     * @var applicationErrorDetail $applicationErrorDetail
     * @access public
     */
    public $applicationErrorDetail = null;

}

class errorText {

    /**
     *
     * @var errorFreeText $errorFreeText
     * @access public
     */
    public $errorFreeText = null;

}

class tstList {

    /**
     *
     * @var tstReference $tstReference
     * @access public
     */
    public $tstReference = null;

    /**
     *
     * @var paxInformation $paxInformation
     * @access public
     */
    public $paxInformation = null;

}

class tstReference {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

    /**
     *
     * @var iDDescription $iDDescription
     * @access public
     */
    public $iDDescription = null;

}

class iDDescription {

    /**
     *
     * @var iDSequenceNumber $iDSequenceNumber
     * @access public
     */
    public $iDSequenceNumber = null;

}

class paxInformation {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class Fare_InformativePricingWithoutPNR {

    /**
     *
     * @var messageDetails $messageDetails
     * @access public
     */
    public $messageDetails = null;

    /**
     *
     * @var originatorGroup $originatorGroup
     * @access public
     */
    public $originatorGroup = null;

    /**
     *
     * @var currencyOverride $currencyOverride
     * @access public
     */
    public $currencyOverride = null;

    /**
     *
     * @var carrierFees $carrierFees
     * @access public
     */
    public $carrierFees = null;

    /**
     *
     * @var corporateFares $corporateFares
     * @access public
     */
    public $corporateFares = null;

    /**
     *
     * @var taxExemptGroup $taxExemptGroup
     * @access public
     */
    public $taxExemptGroup = null;

    /**
     *
     * @var generalFormOfPayment $generalFormOfPayment
     * @access public
     */
    public $generalFormOfPayment = null;

    /**
     *
     * @var passengersGroup $passengersGroup
     * @access public
     */
    public $passengersGroup = null;

    /**
     *
     * @var pricingOptionsGroup $pricingOptionsGroup
     * @access public
     */
    public $pricingOptionsGroup = null;

    /**
     *
     * @var tripsGroup $tripsGroup
     * @access public
     */
    public $tripsGroup = null;

    /**
     *
     * @var obFeeRequestGroup $obFeeRequestGroup
     * @access public
     */
    public $obFeeRequestGroup = null;

}

class messageDetails {

    /**
     *
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

    /**
     *
     * @var responseType $responseType
     * @access public
     */
    public $responseType = null;

}

class originatorGroup {

    /**
     *
     * @var additionalBusinessInformation $additionalBusinessInformation
     * @access public
     */
    public $additionalBusinessInformation = null;

}

class additionalBusinessInformation {

    /**
     *
     * @var sourceType $sourceType
     * @access public
     */
    public $sourceType = null;

    /**
     *
     * @var originatorDetails $originatorDetails
     * @access public
     */
    public $originatorDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     *
     * @var systemCode $systemCode
     * @access public
     */
    public $systemCode = null;

}

class sourceType {

    /**
     *
     * @var sourceQualifier1 $sourceQualifier1
     * @access public
     */
    public $sourceQualifier1 = null;

    /**
     *
     * @var sourceQualifier2 $sourceQualifier2
     * @access public
     */
    public $sourceQualifier2 = null;

}

class currencyOverride {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConvRateDetails $otherConvRateDetails
     * @access public
     */
    public $otherConvRateDetails = null;

}

class carrierFees {

    /**
     *
     * @var infoQualifier $infoQualifier
     * @access public
     */
    public $infoQualifier = null;

    /**
     *
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class corporateFares {

    /**
     *
     * @var corporateFareIdentifiers $corporateFareIdentifiers
     * @access public
     */
    public $corporateFareIdentifiers = null;

}

class taxExemptGroup {

    /**
     *
     * @var taxExempt $taxExempt
     * @access public
     */
    public $taxExempt = null;

}

class taxExempt {

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class generalFormOfPayment {

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     *
     * @var otherFormOfPayment $otherFormOfPayment
     * @access public
     */
    public $otherFormOfPayment = null;

}

class passengersGroup {

    /**
     *
     * @var segmentRepetitionControl $segmentRepetitionControl
     * @access public
     */
    public $segmentRepetitionControl = null;

    /**
     *
     * @var travellersID $travellersID
     * @access public
     */
    public $travellersID = null;

    /**
     *
     * @var ptcGroup $ptcGroup
     * @access public
     */
    public $ptcGroup = null;

}

class segmentRepetitionControl {

    /**
     *
     * @var segmentControlDetails $segmentControlDetails
     * @access public
     */
    public $segmentControlDetails = null;

}

class travellersID {

    /**
     *
     * @var travellerDetails $travellerDetails
     * @access public
     */
    public $travellerDetails = null;

}

class ptcGroup {

    /**
     *
     * @var discountPtc $discountPtc
     * @access public
     */
    public $discountPtc = null;

    /**
     *
     * @var passengerFormOfPayment $passengerFormOfPayment
     * @access public
     */
    public $passengerFormOfPayment = null;

}

class discountPtc {

    /**
     *
     * @var valueQualifier $valueQualifier
     * @access public
     */
    public $valueQualifier = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var identityNumber $identityNumber
     * @access public
     */
    public $identityNumber = null;

    /**
     *
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

    /**
     *
     * @var rateCategory $rateCategory
     * @access public
     */
    public $rateCategory = null;

}

class passengerFormOfPayment {

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     *
     * @var otherFormOfPayment $otherFormOfPayment
     * @access public
     */
    public $otherFormOfPayment = null;

}

class pricingOptionsGroup {

    /**
     *
     * @var pricingDetails $pricingDetails
     * @access public
     */
    public $pricingDetails = null;

    /**
     *
     * @var extPricingDetails $extPricingDetails
     * @access public
     */
    public $extPricingDetails = null;

}

class pricingDetails {

    /**
     *
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     *
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     *
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class priceTicketDetails {

    /**
     *
     * @var indicators $indicators
     * @access public
     */
    public $indicators = null;

}

class companyNumberDetails {

    /**
     *
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

    /**
     *
     * @var otherIdentifier $otherIdentifier
     * @access public
     */
    public $otherIdentifier = null;

}

class extPricingDetails {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class tripsGroup {

    /**
     *
     * @var originDestination $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     *
     * @var segmentGroup $segmentGroup
     * @access public
     */
    public $segmentGroup = null;

}

class segmentGroup {

    /**
     *
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

    /**
     *
     * @var additionnalSegmentDetails $additionnalSegmentDetails
     * @access public
     */
    public $additionnalSegmentDetails = null;

    /**
     *
     * @var segmentPricingOptions $segmentPricingOptions
     * @access public
     */
    public $segmentPricingOptions = null;

    /**
     *
     * @var zapOffDetails $zapOffDetails
     * @access public
     */
    public $zapOffDetails = null;

    /**
     *
     * @var inventoryGroup $inventoryGroup
     * @access public
     */
    public $inventoryGroup = null;

}

class additionnalSegmentDetails {

    /**
     *
     * @var legDetails $legDetails
     * @access public
     */
    public $legDetails = null;

    /**
     *
     * @var departureStationInfo $departureStationInfo
     * @access public
     */
    public $departureStationInfo = null;

    /**
     *
     * @var arrivalStationInfo $arrivalStationInfo
     * @access public
     */
    public $arrivalStationInfo = null;

    /**
     *
     * @var mileageTimeDetails $mileageTimeDetails
     * @access public
     */
    public $mileageTimeDetails = null;

    /**
     *
     * @var travellerTimeDetails $travellerTimeDetails
     * @access public
     */
    public $travellerTimeDetails = null;

    /**
     *
     * @var facilitiesInformation $facilitiesInformation
     * @access public
     */
    public $facilitiesInformation = null;

}

class travellerTimeDetails {

    /**
     *
     * @var departureTime $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     *
     * @var arrivalTime $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

    /**
     *
     * @var checkInDateTime $checkInDateTime
     * @access public
     */
    public $checkInDateTime = null;

}

class segmentPricingOptions {

    /**
     *
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     *
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     *
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class zapOffDetails {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class inventoryGroup {

    /**
     *
     * @var inventory $inventory
     * @access public
     */
    public $inventory = null;

}

class inventory {

    /**
     *
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class obFeeRequestGroup {

    /**
     *
     * @var markerFeeOptions $markerFeeOptions
     * @access public
     */
    public $markerFeeOptions = null;

    /**
     *
     * @var feeOptionInfoGroup $feeOptionInfoGroup
     * @access public
     */
    public $feeOptionInfoGroup = null;

}

class markerFeeOptions {

}

class feeOptionInfoGroup {

    /**
     *
     * @var feeTypeInfo $feeTypeInfo
     * @access public
     */
    public $feeTypeInfo = null;

    /**
     *
     * @var rateTaxInfo $rateTaxInfo
     * @access public
     */
    public $rateTaxInfo = null;

    /**
     *
     * @var feeDetailsInfoGroup $feeDetailsInfoGroup
     * @access public
     */
    public $feeDetailsInfoGroup = null;

}

class rateTaxInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class feeDetailsInfoGroup {

    /**
     *
     * @var feeInfo $feeInfo
     * @access public
     */
    public $feeInfo = null;

    /**
     *
     * @var feeProcessingInfo $feeProcessingInfo
     * @access public
     */
    public $feeProcessingInfo = null;

    /**
     *
     * @var associatedAmountsInfo $associatedAmountsInfo
     * @access public
     */
    public $associatedAmountsInfo = null;

}

class feeProcessingInfo {

    /**
     *
     * @var carrierFeeDetails $carrierFeeDetails
     * @access public
     */
    public $carrierFeeDetails = null;

}

class associatedAmountsInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class Fare_InformativePricingWithoutPNRReply {

    /**
     *
     * @var messageDetails $messageDetails
     * @access public
     */
    public $messageDetails = null;

    /**
     *
     * @var errorGroup $errorGroup
     * @access public
     */
    public $errorGroup = null;

    /**
     *
     * @var mainGroup $mainGroup
     * @access public
     */
    public $mainGroup = null;

}

class errorGroup {

    /**
     *
     * @var errorCode $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     *
     * @var errorMessage $errorMessage
     * @access public
     */
    public $errorMessage = null;

}

class errorCode {

    /**
     *
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class mainGroup {

    /**
     *
     * @var dummySegment $dummySegment
     * @access public
     */
    public $dummySegment = null;

    /**
     *
     * @var convertionRate $convertionRate
     * @access public
     */
    public $convertionRate = null;

    /**
     *
     * @var generalIndicatorsGroup $generalIndicatorsGroup
     * @access public
     */
    public $generalIndicatorsGroup = null;

    /**
     *
     * @var pricingGroupLevelGroup $pricingGroupLevelGroup
     * @access public
     */
    public $pricingGroupLevelGroup = null;

}

class dummySegment {

}

class convertionRate {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConvRateDetails $otherConvRateDetails
     * @access public
     */
    public $otherConvRateDetails = null;

}

class generalIndicatorsGroup {

    /**
     *
     * @var generalIndicators $generalIndicators
     * @access public
     */
    public $generalIndicators = null;

}

class generalIndicators {

    /**
     *
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     *
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     *
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class pricingGroupLevelGroup {

    /**
     *
     * @var numberOfPax $numberOfPax
     * @access public
     */
    public $numberOfPax = null;

    /**
     *
     * @var passengersID $passengersID
     * @access public
     */
    public $passengersID = null;

    /**
     *
     * @var fareInfoGroup $fareInfoGroup
     * @access public
     */
    public $fareInfoGroup = null;

}

class numberOfPax {

    /**
     *
     * @var segmentControlDetails $segmentControlDetails
     * @access public
     */
    public $segmentControlDetails = null;

}

class passengersID {

    /**
     *
     * @var travellerDetails $travellerDetails
     * @access public
     */
    public $travellerDetails = null;

}

class fareInfoGroup {

    /**
     *
     * @var emptySegment $emptySegment
     * @access public
     */
    public $emptySegment = null;

    /**
     *
     * @var pricingIndicators $pricingIndicators
     * @access public
     */
    public $pricingIndicators = null;

    /**
     *
     * @var fareAmount $fareAmount
     * @access public
     */
    public $fareAmount = null;

    /**
     *
     * @var textData $textData
     * @access public
     */
    public $textData = null;

    /**
     *
     * @var surchargesGroup $surchargesGroup
     * @access public
     */
    public $surchargesGroup = null;

    /**
     *
     * @var corporateGroup $corporateGroup
     * @access public
     */
    public $corporateGroup = null;

    /**
     *
     * @var negoFareGroup $negoFareGroup
     * @access public
     */
    public $negoFareGroup = null;

    /**
     *
     * @var segmentLevelGroup $segmentLevelGroup
     * @access public
     */
    public $segmentLevelGroup = null;

    /**
     *
     * @var structuredFareCalcGroup $structuredFareCalcGroup
     * @access public
     */
    public $structuredFareCalcGroup = null;

    /**
     *
     * @var carrierFeeGroup $carrierFeeGroup
     * @access public
     */
    public $carrierFeeGroup = null;

}

class emptySegment {

    /**
     *
     * @var valueQualifier $valueQualifier
     * @access public
     */
    public $valueQualifier = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var identityNumber $identityNumber
     * @access public
     */
    public $identityNumber = null;

    /**
     *
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

    /**
     *
     * @var rateCategory $rateCategory
     * @access public
     */
    public $rateCategory = null;

}

class pricingIndicators {

    /**
     *
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     *
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     *
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class fareAmount {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class textData {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class surchargesGroup {

    /**
     *
     * @var taxesAmount $taxesAmount
     * @access public
     */
    public $taxesAmount = null;

    /**
     *
     * @var penaltiesAmount $penaltiesAmount
     * @access public
     */
    public $penaltiesAmount = null;

    /**
     *
     * @var pfcAmount $pfcAmount
     * @access public
     */
    public $pfcAmount = null;

}

class taxesAmount {

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class penaltiesAmount {

    /**
     *
     * @var discountPenaltyQualifier $discountPenaltyQualifier
     * @access public
     */
    public $discountPenaltyQualifier = null;

    /**
     *
     * @var discountPenaltyDetails $discountPenaltyDetails
     * @access public
     */
    public $discountPenaltyDetails = null;

}

class discountPenaltyDetails {

    /**
     *
     * @var functionCustom $function
     * @access public
     */
    public $function = null;

    /**
     *
     * @var amountType $amountType
     * @access public
     */
    public $amountType = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class pfcAmount {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class corporateGroup {

    /**
     *
     * @var corporateData $corporateData
     * @access public
     */
    public $corporateData = null;

}

class corporateData {

    /**
     *
     * @var chargeCategory $chargeCategory
     * @access public
     */
    public $chargeCategory = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var locationCode $locationCode
     * @access public
     */
    public $locationCode = null;

    /**
     *
     * @var otherLocationCode $otherLocationCode
     * @access public
     */
    public $otherLocationCode = null;

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

}

class negoFareGroup {

    /**
     *
     * @var negoFareIndicators $negoFareIndicators
     * @access public
     */
    public $negoFareIndicators = null;

    /**
     *
     * @var extNegoFareIndicators $extNegoFareIndicators
     * @access public
     */
    public $extNegoFareIndicators = null;

    /**
     *
     * @var negoFareAmount $negoFareAmount
     * @access public
     */
    public $negoFareAmount = null;

    /**
     *
     * @var negoFareText $negoFareText
     * @access public
     */
    public $negoFareText = null;

}

class negoFareIndicators {

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

    /**
     *
     * @var fareValue $fareValue
     * @access public
     */
    public $fareValue = null;

    /**
     *
     * @var priceType $priceType
     * @access public
     */
    public $priceType = null;

    /**
     *
     * @var specialCondition $specialCondition
     * @access public
     */
    public $specialCondition = null;

    /**
     *
     * @var otherSpecialCondition $otherSpecialCondition
     * @access public
     */
    public $otherSpecialCondition = null;

    /**
     *
     * @var additionalSpecialCondition $additionalSpecialCondition
     * @access public
     */
    public $additionalSpecialCondition = null;

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

}

class fareBasisDetails {

    /**
     *
     * @var rateTariffClass $rateTariffClass
     * @access public
     */
    public $rateTariffClass = null;

    /**
     *
     * @var rateTariffIndicator $rateTariffIndicator
     * @access public
     */
    public $rateTariffIndicator = null;

    /**
     *
     * @var otherRateTariffClass $otherRateTariffClass
     * @access public
     */
    public $otherRateTariffClass = null;

    /**
     *
     * @var otherRateTariffIndicator $otherRateTariffIndicator
     * @access public
     */
    public $otherRateTariffIndicator = null;

}

class extNegoFareIndicators {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class negoFareAmount {

    /**
     *
     * @var discountPenaltyQualifier $discountPenaltyQualifier
     * @access public
     */
    public $discountPenaltyQualifier = null;

    /**
     *
     * @var discountPenaltyDetails $discountPenaltyDetails
     * @access public
     */
    public $discountPenaltyDetails = null;

}

class negoFareText {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class segmentLevelGroup {

    /**
     *
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

    /**
     *
     * @var additionalInformation $additionalInformation
     * @access public
     */
    public $additionalInformation = null;

    /**
     *
     * @var fareBasis $fareBasis
     * @access public
     */
    public $fareBasis = null;

    /**
     *
     * @var cabinGroup $cabinGroup
     * @access public
     */
    public $cabinGroup = null;

    /**
     *
     * @var baggageAllowance $baggageAllowance
     * @access public
     */
    public $baggageAllowance = null;

    /**
     *
     * @var ptcSegment $ptcSegment
     * @access public
     */
    public $ptcSegment = null;

    /**
     *
     * @var couponInformation $couponInformation
     * @access public
     */
    public $couponInformation = null;

}

class additionalInformation {

    /**
     *
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     *
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     *
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class fareBasis {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     *
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     *
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     *
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class cabinGroup {

    /**
     *
     * @var cabinSegment $cabinSegment
     * @access public
     */
    public $cabinSegment = null;

}

class cabinSegment {

    /**
     *
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class baggageAllowance {

    /**
     *
     * @var excessBaggageDetails $excessBaggageDetails
     * @access public
     */
    public $excessBaggageDetails = null;

    /**
     *
     * @var baggageDetails $baggageDetails
     * @access public
     */
    public $baggageDetails = null;

    /**
     *
     * @var otherBaggageDetails $otherBaggageDetails
     * @access public
     */
    public $otherBaggageDetails = null;

    /**
     *
     * @var extraBaggageDetails $extraBaggageDetails
     * @access public
     */
    public $extraBaggageDetails = null;

    /**
     *
     * @var bagTagDetails $bagTagDetails
     * @access public
     */
    public $bagTagDetails = null;

}

class excessBaggageDetails {

    /**
     *
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class baggageDetails {

    /**
     *
     * @var freeAllowance $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     *
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     *
     * @var quantityCode $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     *
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     *
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class otherBaggageDetails {

    /**
     *
     * @var freeAllowance $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     *
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     *
     * @var quantityCode $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     *
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     *
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class extraBaggageDetails {

    /**
     *
     * @var freeAllowance $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     *
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     *
     * @var quantityCode $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     *
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     *
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class bagTagDetails {

    /**
     *
     * @var company $company
     * @access public
     */
    public $company = null;

    /**
     *
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

    /**
     *
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     *
     * @var location $location
     * @access public
     */
    public $location = null;

    /**
     *
     * @var companyNumber $companyNumber
     * @access public
     */
    public $companyNumber = null;

    /**
     *
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     *
     * @var characteristic $characteristic
     * @access public
     */
    public $characteristic = null;

    /**
     *
     * @var specialRequirement $specialRequirement
     * @access public
     */
    public $specialRequirement = null;

    /**
     *
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     *
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     *
     * @var description $description
     * @access public
     */
    public $description = null;

}

class ptcSegment {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     *
     * @var otherQuantityDetails $otherQuantityDetails
     * @access public
     */
    public $otherQuantityDetails = null;

}

class couponInformation {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     *
     * @var otherquantityDetails $otherquantityDetails
     * @access public
     */
    public $otherquantityDetails = null;

}

class otherquantityDetails2citypair {

    /**
     *
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     *
     * @var unit $unit
     * @access public
     */
    public $unit = null;

}

class structuredFareCalcGroup {

    /**
     *
     * @var structureFareCalcRoot $structureFareCalcRoot
     * @access public
     */
    public $structureFareCalcRoot = null;

    /**
     *
     * @var group27 $group27
     * @access public
     */
    public $group27 = null;

}

class structureFareCalcRoot {

    /**
     *
     * @var fareComponentDetails $fareComponentDetails
     * @access public
     */
    public $fareComponentDetails = null;

    /**
     *
     * @var ticketNumber $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

}

class fareComponentDetails {

    /**
     *
     * @var dataType $dataType
     * @access public
     */
    public $dataType = null;

    /**
     *
     * @var count $count
     * @access public
     */
    public $count = null;

    /**
     *
     * @var pricingDate $pricingDate
     * @access public
     */
    public $pricingDate = null;

    /**
     *
     * @var accountCode $accountCode
     * @access public
     */
    public $accountCode = null;

    /**
     *
     * @var inputDesignator $inputDesignator
     * @access public
     */
    public $inputDesignator = null;

}

class group27 {

    /**
     *
     * @var structuredFareCalcG27EQN $structuredFareCalcG27EQN
     * @access public
     */
    public $structuredFareCalcG27EQN = null;

    /**
     *
     * @var group28 $group28
     * @access public
     */
    public $group28 = null;

    /**
     *
     * @var dummySegmentGroup27 $dummySegmentGroup27
     * @access public
     */
    public $dummySegmentGroup27 = null;

    /**
     *
     * @var structuredFareCalcG27MON $structuredFareCalcG27MON
     * @access public
     */
    public $structuredFareCalcG27MON = null;

    /**
     *
     * @var structuredFareCalcG27TXD $structuredFareCalcG27TXD
     * @access public
     */
    public $structuredFareCalcG27TXD = null;

    /**
     *
     * @var structuredFareCalcG27CVR $structuredFareCalcG27CVR
     * @access public
     */
    public $structuredFareCalcG27CVR = null;

}

class structuredFareCalcG27EQN {

    /**
     *
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     *
     * @var otherQuantityDetails $otherQuantityDetails
     * @access public
     */
    public $otherQuantityDetails = null;

}

class group28 {

    /**
     *
     * @var structuredFareCalcG28ITM $structuredFareCalcG28ITM
     * @access public
     */
    public $structuredFareCalcG28ITM = null;

    /**
     *
     * @var group29 $group29
     * @access public
     */
    public $group29 = null;

    /**
     *
     * @var structuredFareCalcG28MON $structuredFareCalcG28MON
     * @access public
     */
    public $structuredFareCalcG28MON = null;

    /**
     *
     * @var structuredFareCalcG28PTS $structuredFareCalcG28PTS
     * @access public
     */
    public $structuredFareCalcG28PTS = null;

    /**
     *
     * @var structuredFareCalcG28FCC $structuredFareCalcG28FCC
     * @access public
     */
    public $structuredFareCalcG28FCC = null;

    /**
     *
     * @var structuredFareCalcG28PTK $structuredFareCalcG28PTK
     * @access public
     */
    public $structuredFareCalcG28PTK = null;

    /**
     *
     * @var structuredFareCalcG28FRU $structuredFareCalcG28FRU
     * @access public
     */
    public $structuredFareCalcG28FRU = null;

}

class structuredFareCalcG28ITM {

    /**
     *
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class group29 {

    /**
     *
     * @var structuredFareCalcG28ADT $structuredFareCalcG28ADT
     * @access public
     */
    public $structuredFareCalcG28ADT = null;

    /**
     *
     * @var structuredFareCalcG28TVL $structuredFareCalcG28TVL
     * @access public
     */
    public $structuredFareCalcG28TVL = null;

}

class structuredFareCalcG28ADT {

    /**
     *
     * @var numberOfItemsDetails $numberOfItemsDetails
     * @access public
     */
    public $numberOfItemsDetails = null;

    /**
     *
     * @var lastItemsDetails $lastItemsDetails
     * @access public
     */
    public $lastItemsDetails = null;

}

class structuredFareCalcG28TVL {

    /**
     *
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     *
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     *
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     *
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     *
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class structuredFareCalcG28MON {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class structuredFareCalcG28PTS {

    /**
     *
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     *
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

    /**
     *
     * @var fareValue $fareValue
     * @access public
     */
    public $fareValue = null;

    /**
     *
     * @var priceType $priceType
     * @access public
     */
    public $priceType = null;

    /**
     *
     * @var specialCondition $specialCondition
     * @access public
     */
    public $specialCondition = null;

    /**
     *
     * @var otherSpecialCondition $otherSpecialCondition
     * @access public
     */
    public $otherSpecialCondition = null;

    /**
     *
     * @var additionalSpecialCondition $additionalSpecialCondition
     * @access public
     */
    public $additionalSpecialCondition = null;

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

}

class structuredFareCalcG28FCC {

    /**
     *
     * @var chargeCategory $chargeCategory
     * @access public
     */
    public $chargeCategory = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     *
     * @var locationCode $locationCode
     * @access public
     */
    public $locationCode = null;

    /**
     *
     * @var otherLocationCode $otherLocationCode
     * @access public
     */
    public $otherLocationCode = null;

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

}

class structuredFareCalcG28PTK {

    /**
     *
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     *
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     *
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     *
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     *
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     *
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     *
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class structuredFareCalcG28FRU {

    /**
     *
     * @var tariffClassId $tariffClassId
     * @access public
     */
    public $tariffClassId = null;

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     *
     * @var ruleSectionId $ruleSectionId
     * @access public
     */
    public $ruleSectionId = null;

}

class dummySegmentGroup27 {

}

class structuredFareCalcG27MON {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class structuredFareCalcG27TXD {

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class structuredFareCalcG27CVR {

    /**
     *
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     *
     * @var otherConvRateDetails $otherConvRateDetails
     * @access public
     */
    public $otherConvRateDetails = null;

}

class carrierFeeGroup {

    /**
     *
     * @var feeType $feeType
     * @access public
     */
    public $feeType = null;

    /**
     *
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class feeType {

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     *
     * @var otherSelectionDetails $otherSelectionDetails
     * @access public
     */
    public $otherSelectionDetails = null;

}

class feeAmounts {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class feeTaxes {

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class feeDescription {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class PNR_List {

    /**
     *
     * @var freeFormText $freeFormText
     * @access public
     */
    public $freeFormText = null;

    /**
     *
     * @var citypair $citypair
     * @access public
     */
    public $citypair = null;

    /**
     *
     * @var errorInformation $errorInformation
     * @access public
     */
    public $errorInformation = null;

}

class citypair2 {

    /**
     *
     * @var originDestinationMarker $originDestinationMarker
     * @access public
     */
    public $originDestinationMarker = null;

    /**
     *
     * @var travellerInformationSection $travellerInformationSection
     * @access public
     */
    public $travellerInformationSection = null;

}

class originDestinationMarker {

}

class travellerInformationSection {

    /**
     *
     * @var travellerInformation $travellerInformation
     * @access public
     */
    public $travellerInformation = null;

    /**
     *
     * @var relatedProduct $relatedProduct
     * @access public
     */
    public $relatedProduct = null;

    /**
     *
     * @var travelProduct $travelProduct
     * @access public
     */
    public $travelProduct = null;

    /**
     *
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     *
     * @var productInfo $productInfo
     * @access public
     */
    public $productInfo = null;

    /**
     *
     * @var messageAction $messageAction
     * @access public
     */
    public $messageAction = null;

}

class Fare_PricePNRWithBookingClass {

    /**
     *
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     *
     * @var paxSegReference $paxSegReference
     * @access public
     */
    public $paxSegReference = null;

    /**
     *
     * @var overrideInformation $overrideInformation
     * @access public
     */
    public $overrideInformation = null;

    /**
     *
     * @var dateOverride $dateOverride
     * @access public
     */
    public $dateOverride = null;

    /**
     *
     * @var validatingCarrier $validatingCarrier
     * @access public
     */
    public $validatingCarrier = null;

    /**
     *
     * @var cityOverride $cityOverride
     * @access public
     */
    public $cityOverride = null;

    /**
     *
     * @var currencyOverride $currencyOverride
     * @access public
     */
    public $currencyOverride = null;

    /**
     *
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

    /**
     *
     * @var discountInformation $discountInformation
     * @access public
     */
    public $discountInformation = null;

    /**
     *
     * @var pricingFareBase $pricingFareBase
     * @access public
     */
    public $pricingFareBase = null;

    /**
     *
     * @var flightInformation $flightInformation
     * @access public
     */
    public $flightInformation = null;

    /**
     *
     * @var openSegmentsInformation $openSegmentsInformation
     * @access public
     */
    public $openSegmentsInformation = null;

    /**
     *
     * @var bookingClassSelection $bookingClassSelection
     * @access public
     */
    public $bookingClassSelection = null;

    /**
     *
     * @var fopInformation $fopInformation
     * @access public
     */
    public $fopInformation = null;

    /**
     *
     * @var carrierAgreements $carrierAgreements
     * @access public
     */
    public $carrierAgreements = null;

}

class paxSegReference {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class overrideInformation {

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class dateOverride {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class validatingCarrier {

    /**
     *
     * @var carrierInformation $carrierInformation
     * @access public
     */
    public $carrierInformation = null;

}

class carrierInformation {

    /**
     *
     * @var carrierCode $carrierCode
     * @access public
     */
    public $carrierCode = null;

}

class cityOverride {

    /**
     *
     * @var cityDetail $cityDetail
     * @access public
     */
    public $cityDetail = null;

}

class cityDetail {

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     *
     * @var cityQualifier $cityQualifier
     * @access public
     */
    public $cityQualifier = null;

}

class firstRateDetail {

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

}

class secondRateDetail {

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     *
     * @var amount $amount
     * @access public
     */
    public $amount = null;

}

class taxIdentification {

    /**
     *
     * @var taxIdentifier $taxIdentifier
     * @access public
     */
    public $taxIdentifier = null;

}

class taxType {

    /**
     *
     * @var isoCountry $isoCountry
     * @access public
     */
    public $isoCountry = null;

}

class taxData {

    /**
     *
     * @var taxRate $taxRate
     * @access public
     */
    public $taxRate = null;

    /**
     *
     * @var taxValueQualifier $taxValueQualifier
     * @access public
     */
    public $taxValueQualifier = null;

}

class penDisInformation {

    /**
     *
     * @var infoQualifier $infoQualifier
     * @access public
     */
    public $infoQualifier = null;

    /**
     *
     * @var penDisData $penDisData
     * @access public
     */
    public $penDisData = null;

}

class penDisData {

    /**
     *
     * @var penaltyType $penaltyType
     * @access public
     */
    public $penaltyType = null;

    /**
     *
     * @var penaltyQualifier $penaltyQualifier
     * @access public
     */
    public $penaltyQualifier = null;

    /**
     *
     * @var penaltyAmount $penaltyAmount
     * @access public
     */
    public $penaltyAmount = null;

    /**
     *
     * @var discountCode $discountCode
     * @access public
     */
    public $discountCode = null;

    /**
     *
     * @var penaltyCurrency $penaltyCurrency
     * @access public
     */
    public $penaltyCurrency = null;

}

class referenceQualifier {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class pricingFareBase {

    /**
     *
     * @var fareBasisOptions $fareBasisOptions
     * @access public
     */
    public $fareBasisOptions = null;

    /**
     *
     * @var fareBasisSegReference $fareBasisSegReference
     * @access public
     */
    public $fareBasisSegReference = null;

    /**
     *
     * @var fareBasisDates $fareBasisDates
     * @access public
     */
    public $fareBasisDates = null;

}

class fareBasisOptions {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

}

class fareBasisSegReference {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class fareBasisDates {

    /**
     *
     * @var fareBasisDateQualifier $fareBasisDateQualifier
     * @access public
     */
    public $fareBasisDateQualifier = null;

    /**
     *
     * @var fareBasisDate $fareBasisDate
     * @access public
     */
    public $fareBasisDate = null;

}

class fareBasisDate {

    /**
     *
     * @var year $year
     * @access public
     */
    public $year = null;

    /**
     *
     * @var month $month
     * @access public
     */
    public $month = null;

    /**
     *
     * @var day $day
     * @access public
     */
    public $day = null;

}

class itineraryOptions {

    /**
     *
     * @var globalRoute $globalRoute
     * @access public
     */
    public $globalRoute = null;

    /**
     *
     * @var bookingClass $bookingClass
     * @access public
     */
    public $bookingClass = null;

    /**
     *
     * @var flightDetails $flightDetails
     * @access public
     */
    public $flightDetails = null;

}

class itinerarySegReference {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class openSegmentsInformation {

    /**
     *
     * @var extendedItinerary $extendedItinerary
     * @access public
     */
    public $extendedItinerary = null;

    /**
     *
     * @var extendedItinerarySegReference $extendedItinerarySegReference
     * @access public
     */
    public $extendedItinerarySegReference = null;

}

class extendedItinerary {

    /**
     *
     * @var departureCity $departureCity
     * @access public
     */
    public $departureCity = null;

    /**
     *
     * @var arrivalCity $arrivalCity
     * @access public
     */
    public $arrivalCity = null;

    /**
     *
     * @var airlineDetail $airlineDetail
     * @access public
     */
    public $airlineDetail = null;

    /**
     *
     * @var segmentDetail $segmentDetail
     * @access public
     */
    public $segmentDetail = null;

    /**
     *
     * @var ticketingStatus $ticketingStatus
     * @access public
     */
    public $ticketingStatus = null;

}

class departureCity {

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

}

class arrivalCity {

    /**
     *
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

}

class airlineDetail {

    /**
     *
     * @var carrierCode $carrierCode
     * @access public
     */
    public $carrierCode = null;

}

class segmentDetail {

    /**
     *
     * @var identification $identification
     * @access public
     */
    public $identification = null;

    /**
     *
     * @var classOfService $classOfService
     * @access public
     */
    public $classOfService = null;

}

class extendedItinerarySegReference {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class bookingClassSelection {

    /**
     *
     * @var bookingClassList $bookingClassList
     * @access public
     */
    public $bookingClassList = null;

    /**
     *
     * @var bookCodeSegAsso $bookCodeSegAsso
     * @access public
     */
    public $bookCodeSegAsso = null;

}

class bookingClassList {

    /**
     *
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class bookCodeSegAsso {

    /**
     *
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class fopInformation {

    /**
     *
     * @var fop $fop
     * @access public
     */
    public $fop = null;

}

class carrierAgreements {

    /**
     *
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

}

class Fare_PricePNRWithBookingClassReply {

    /**
     *
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     *
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     *
     * @var fareList $fareList
     * @access public
     */
    public $fareList = null;

}

class fareList {

    /**
     *
     * @var pricingInformation $pricingInformation
     * @access public
     */
    public $pricingInformation = null;

    /**
     *
     * @var fareReference $fareReference
     * @access public
     */
    public $fareReference = null;

    /**
     *
     * @var lastTktDate $lastTktDate
     * @access public
     */
    public $lastTktDate = null;

    /**
     *
     * @var validatingCarrier $validatingCarrier
     * @access public
     */
    public $validatingCarrier = null;

    /**
     *
     * @var paxSegReference $paxSegReference
     * @access public
     */
    public $paxSegReference = null;

    /**
     *
     * @var fareDataInformation $fareDataInformation
     * @access public
     */
    public $fareDataInformation = null;

    /**
     *
     * @var taxInformation $taxInformation
     * @access public
     */
    public $taxInformation = null;

    /**
     *
     * @var bankerRates $bankerRates
     * @access public
     */
    public $bankerRates = null;

    /**
     *
     * @var passengerInformation $passengerInformation
     * @access public
     */
    public $passengerInformation = null;

    /**
     *
     * @var originDestination $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     *
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

    /**
     *
     * @var otherPricingInfo $otherPricingInfo
     * @access public
     */
    public $otherPricingInfo = null;

    /**
     *
     * @var warningInformation $warningInformation
     * @access public
     */
    public $warningInformation = null;

    /**
     *
     * @var automaticReissueInfo $automaticReissueInfo
     * @access public
     */
    public $automaticReissueInfo = null;

    /**
     *
     * @var corporateInfo $corporateInfo
     * @access public
     */
    public $corporateInfo = null;

    /**
     *
     * @var feeBreakdown $feeBreakdown
     * @access public
     */
    public $feeBreakdown = null;

    /**
     *
     * @var mileage $mileage
     * @access public
     */
    public $mileage = null;

}

class pricingInformation {

    /**
     *
     * @var tstInformation $tstInformation
     * @access public
     */
    public $tstInformation = null;

    /**
     *
     * @var salesIndicator $salesIndicator
     * @access public
     */
    public $salesIndicator = null;

    /**
     *
     * @var fcmi $fcmi
     * @access public
     */
    public $fcmi = null;

    /**
     *
     * @var bestFareType $bestFareType
     * @access public
     */
    public $bestFareType = null;

}

class tstInformation {

    /**
     *
     * @var tstIndicator $tstIndicator
     * @access public
     */
    public $tstIndicator = null;

}

class fareReference {

    /**
     *
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     *
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class lastTktDate {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class fareDataInformation {

    /**
     *
     * @var fareDataMainInformation $fareDataMainInformation
     * @access public
     */
    public $fareDataMainInformation = null;

    /**
     *
     * @var fareDataSupInformation $fareDataSupInformation
     * @access public
     */
    public $fareDataSupInformation = null;

}

class fareDataMainInformation {

    /**
     *
     * @var fareDataQualifier $fareDataQualifier
     * @access public
     */
    public $fareDataQualifier = null;

    /**
     *
     * @var fareAmount $fareAmount
     * @access public
     */
    public $fareAmount = null;

    /**
     *
     * @var fareCurrency $fareCurrency
     * @access public
     */
    public $fareCurrency = null;

    /**
     *
     * @var fareLocation $fareLocation
     * @access public
     */
    public $fareLocation = null;

}

class fareDataSupInformation {

    /**
     *
     * @var fareDataQualifier $fareDataQualifier
     * @access public
     */
    public $fareDataQualifier = null;

    /**
     *
     * @var fareAmount $fareAmount
     * @access public
     */
    public $fareAmount = null;

    /**
     *
     * @var fareCurrency $fareCurrency
     * @access public
     */
    public $fareCurrency = null;

    /**
     *
     * @var fareLocation $fareLocation
     * @access public
     */
    public $fareLocation = null;

}

class amountDetails {

    /**
     *
     * @var fareDataMainInformation $fareDataMainInformation
     * @access public
     */
    public $fareDataMainInformation = null;

    /**
     *
     * @var fareDataSupInformation $fareDataSupInformation
     * @access public
     */
    public $fareDataSupInformation = null;

}

class bankerRates {

    /**
     *
     * @var firstRateDetail $firstRateDetail
     * @access public
     */
    public $firstRateDetail = null;

    /**
     *
     * @var secondRateDetail $secondRateDetail
     * @access public
     */
    public $secondRateDetail = null;

}

class passengerInformation {

    /**
     *
     * @var penDisInformation $penDisInformation
     * @access public
     */
    public $penDisInformation = null;

    /**
     *
     * @var passengerReference $passengerReference
     * @access public
     */
    public $passengerReference = null;

}

class connexInformation {

    /**
     *
     * @var connecDetails $connecDetails
     * @access public
     */
    public $connecDetails = null;

}

class connecDetails {

    /**
     *
     * @var routingInformation $routingInformation
     * @access public
     */
    public $routingInformation = null;

    /**
     *
     * @var connexType $connexType
     * @access public
     */
    public $connexType = null;

}

class segDetails {

    /**
     *
     * @var departureCity $departureCity
     * @access public
     */
    public $departureCity = null;

    /**
     *
     * @var arrivalCity $arrivalCity
     * @access public
     */
    public $arrivalCity = null;

    /**
     *
     * @var airlineDetail $airlineDetail
     * @access public
     */
    public $airlineDetail = null;

    /**
     *
     * @var segmentDetail $segmentDetail
     * @access public
     */
    public $segmentDetail = null;

    /**
     *
     * @var ticketingStatus $ticketingStatus
     * @access public
     */
    public $ticketingStatus = null;

}

class fareQualifier {

    /**
     *
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     *
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

    /**
     *
     * @var zapOffDetails $zapOffDetails
     * @access public
     */
    public $zapOffDetails = null;

}

class validityInformation {

    /**
     *
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class bagAllowanceInformation {

    /**
     *
     * @var bagAllowanceDetails $bagAllowanceDetails
     * @access public
     */
    public $bagAllowanceDetails = null;

}

class bagAllowanceDetails {

    /**
     *
     * @var baggageQuantity $baggageQuantity
     * @access public
     */
    public $baggageQuantity = null;

    /**
     *
     * @var baggageWeight $baggageWeight
     * @access public
     */
    public $baggageWeight = null;

    /**
     *
     * @var baggageType $baggageType
     * @access public
     */
    public $baggageType = null;

    /**
     *
     * @var measureUnit $measureUnit
     * @access public
     */
    public $measureUnit = null;

}

class segmentReference {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class sequenceInformation {

    /**
     *
     * @var sequenceSection $sequenceSection
     * @access public
     */
    public $sequenceSection = null;

}

class sequenceSection {

    /**
     *
     * @var sequenceNumber $sequenceNumber
     * @access public
     */
    public $sequenceNumber = null;

}

class otherPricingInfo {

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class warningCode {

    /**
     *
     * @var applicationErrorDetail $applicationErrorDetail
     * @access public
     */
    public $applicationErrorDetail = null;

}

class warningText {

    /**
     *
     * @var errorFreeText $errorFreeText
     * @access public
     */
    public $errorFreeText = null;

}

class automaticReissueInfo {

    /**
     *
     * @var ticketInfo $ticketInfo
     * @access public
     */
    public $ticketInfo = null;

    /**
     *
     * @var couponInfo $couponInfo
     * @access public
     */
    public $couponInfo = null;

    /**
     *
     * @var paperCouponRange $paperCouponRange
     * @access public
     */
    public $paperCouponRange = null;

    /**
     *
     * @var baseFareInfo $baseFareInfo
     * @access public
     */
    public $baseFareInfo = null;

    /**
     *
     * @var firstDpiGroup $firstDpiGroup
     * @access public
     */
    public $firstDpiGroup = null;

    /**
     *
     * @var secondDpiGroup $secondDpiGroup
     * @access public
     */
    public $secondDpiGroup = null;

    /**
     *
     * @var reissueAttributes $reissueAttributes
     * @access public
     */
    public $reissueAttributes = null;

}

class ticketInfo {

    /**
     *
     * @var documentDetails $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class couponInfo {

    /**
     *
     * @var couponDetails $couponDetails
     * @access public
     */
    public $couponDetails = null;

    /**
     *
     * @var otherCouponDetails $otherCouponDetails
     * @access public
     */
    public $otherCouponDetails = null;

}

class couponDetails {

    /**
     *
     * @var cpnNumber $cpnNumber
     * @access public
     */
    public $cpnNumber = null;

}

class otherCouponDetails {

    /**
     *
     * @var cpnNumber $cpnNumber
     * @access public
     */
    public $cpnNumber = null;

}

class paperCouponRange {

    /**
     *
     * @var ticketInfo $ticketInfo
     * @access public
     */
    public $ticketInfo = null;

    /**
     *
     * @var couponInfo $couponInfo
     * @access public
     */
    public $couponInfo = null;

}

class baseFareInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class firstDpiGroup {

    /**
     *
     * @var reIssuePenalty $reIssuePenalty
     * @access public
     */
    public $reIssuePenalty = null;

    /**
     *
     * @var reissueInfo $reissueInfo
     * @access public
     */
    public $reissueInfo = null;

    /**
     *
     * @var oldTaxInfo $oldTaxInfo
     * @access public
     */
    public $oldTaxInfo = null;

    /**
     *
     * @var reissueBalanceInfo $reissueBalanceInfo
     * @access public
     */
    public $reissueBalanceInfo = null;

}

class reIssuePenalty {

    /**
     *
     * @var penDisData $penDisData
     * @access public
     */
    public $penDisData = null;

}

class reissueInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class oldTaxInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class reissueBalanceInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class secondDpiGroup {

    /**
     *
     * @var penalty $penalty
     * @access public
     */
    public $penalty = null;

    /**
     *
     * @var residualValueInfo $residualValueInfo
     * @access public
     */
    public $residualValueInfo = null;

    /**
     *
     * @var oldTaxInfo $oldTaxInfo
     * @access public
     */
    public $oldTaxInfo = null;

    /**
     *
     * @var issueBalanceInfo $issueBalanceInfo
     * @access public
     */
    public $issueBalanceInfo = null;

}

class penalty {

    /**
     *
     * @var penDisData $penDisData
     * @access public
     */
    public $penDisData = null;

}

class residualValueInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class issueBalanceInfo {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     *
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class reissueAttributes {

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class feeBreakdown {

    /**
     *
     * @var feeType $feeType
     * @access public
     */
    public $feeType = null;

    /**
     *
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class mileage {

    /**
     *
     * @var mileageTimeDetails $mileageTimeDetails
     * @access public
     */
    public $mileageTimeDetails = null;

}

class DocIssuance_IssueTicket {

    /**
     *
     * @var TicketAgentInfoTypeI $agentInfo
     * @access public
     */
    public $agentInfo = null;

    /**
     *
     * @var StructuredDateTimeInformationType $overrideDate
     * @access public
     */
    public $overrideDate = null;

    /**
     *
     * @var ReferenceInfoType $selection
     * @access public
     */
    public $selection = null;

    /**
     *
     * @var ReferenceInformationType $paxSelection
     * @access public
     */
    public $paxSelection = null;

    /**
     *
     * @var StockInformationType $stock
     * @access public
     */
    public $stock = null;

    /**
     *
     * @var optionGroup $optionGroup
     * @access public
     */
    public $optionGroup = null;

    /**
     *
     * @var TravellerInformationType $infantOrAdultAssociation
     * @access public
     */
    public $infantOrAdultAssociation = null;

    /**
     *
     * @var CodedAttributeType $otherCompoundOptions
     * @access public
     */
    public $otherCompoundOptions = null;

}

class optionGroup {

    /**
     *
     * @var StatusTypeI $switches
     * @access public
     */
    public $switches = null;

    /**
     *
     * @var AttributeType $subCompoundOptions
     * @access public
     */
    public $subCompoundOptions = null;

    /**
     *
     * @var StructuredDateTimeInformationType $overrideAlternativeDate
     * @access public
     */
    public $overrideAlternativeDate = null;

}

class AttributeInformationTypeU {

    /**
     *
     * @var AlphaNumericString_Length1To25 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     *
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class AttributeType {

    /**
     *
     * @var AttributeInformationTypeU $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class CodedAttributeInformationType {

    /**
     *
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     *
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CodedAttributeType {

    /**
     *
     * @var CodedAttributeInformationType $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class InternalIDDetailsTypeI {

    /**
     *
     * @var AlphaNumericString_Length1To9 $inhouseId
     * @access public
     */
    public $inhouseId = null;

    /**
     *
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class ReferenceInfoType {

    /**
     *
     * @var ReferencingDetailsType $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

    /**
     *
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class ReferenceInformationType {

    /**
     *
     * @var ReferencingDetailsType_108978C $passengerReference
     * @access public
     */
    public $passengerReference = null;

}

class ReferencingDetailsType {

    /**
     *
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsType_108978C {

    /**
     *
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class StatusDetailsTypeI {

    /**
     *
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class StatusTypeI {

    /**
     *
     * @var StatusDetailsTypeI $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StockInformationType {

    /**
     *
     * @var StockTicketNumberDetailsType $stockTicketNumberDetails
     * @access public
     */
    public $stockTicketNumberDetails = null;

}

class StockTicketNumberDetailsType {

    /**
     *
     * @var AlphaNumericString_Length1To1 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     *
     * @var AlphaNumericString_Length1To35 $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class StructuredDateTimeInformationType {

    /**
     *
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     *
     * @var StructuredDateTimeType $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeType {

    /**
     *
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     *
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     *
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

}

class TicketAgentInfoTypeI {

    /**
     *
     * @var InternalIDDetailsTypeI $internalIdDetails
     * @access public
     */
    public $internalIdDetails = null;

}

class TravellerInformationType {

    /**
     *
     * @var TravellerSurnameInformationType $paxDetails
     * @access public
     */
    public $paxDetails = null;

}

class TravellerSurnameInformationType {

    /**
     *
     * @var AlphaNumericString_Length1To2 $type
     * @access public
     */
    public $type = null;

}

class DocIssuance_IssueTicketReply {

    /**
     *
     * @var ResponseAnalysisDetailsType $processingStatus
     * @access public
     */
    public $processingStatus = null;

    /**
     *
     * @var ErrorGroupType $errorGroup
     * @access public
     */
    public $errorGroup = null;

}

class ApplicationErrorDetailType {

    /**
     *
     * @var AlphaNumericString_Length1To5 $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     *
     * @var AlphaNumericString_Length1To3 $errorCategory
     * @access public
     */
    public $errorCategory = null;

    /**
     *
     * @var AlphaNumericString_Length1To3 $errorCodeOwner
     * @access public
     */
    public $errorCodeOwner = null;

}

class ApplicationErrorInformationType {

    /**
     *
     * @var ApplicationErrorDetailType $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class ErrorGroupType {

    /**
     *
     * @var ApplicationErrorInformationType $errorOrWarningCodeDetails
     * @access public
     */
    public $errorOrWarningCodeDetails = null;

    /**
     *
     * @var FreeTextInformationType $errorWarningDescription
     * @access public
     */
    public $errorWarningDescription = null;

}

class FreeTextDetailsType {

    /**
     *
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     *
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     *
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextInformationType {

    /**
     *
     * @var FreeTextDetailsType $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     *
     * @var AlphaNumericString_Length1To199 $freeText
     * @access public
     */
    public $freeText = null;

}

class ResponseAnalysisDetailsType {

    /**
     *
     * @var AlphaString_Length1To6 $statusCode
     * @access public
     */
    public $statusCode = null;

}

class Ticket_DisplayTST {

    /**
     *
     * @var displayMode $displayMode
     * @access public
     */
    public $displayMode = null;

    /**
     *
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     *
     * @var scrollingInformation $scrollingInformation
     * @access public
     */
    public $scrollingInformation = null;

    /**
     *
     * @var tstReference $tstReference
     * @access public
     */
    public $tstReference = null;

    /**
     *
     * @var psaInformation $psaInformation
     * @access public
     */
    public $psaInformation = null;

}

class displayMode {

    /**
     *
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class scrollingInformation {

    /**
     *
     * @var nextListInformation $nextListInformation
     * @access public
     */
    public $nextListInformation = null;

}

class nextListInformation {

    /**
     *
     * @var remainingInformation $remainingInformation
     * @access public
     */
    public $remainingInformation = null;

    /**
     *
     * @var remainingReference $remainingReference
     * @access public
     */
    public $remainingReference = null;

}

class psaInformation {

    /**
     *
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class Ticket_DisplayTSTReply {

    /**
     *
     * @var scrollingInformation $scrollingInformation
     * @access public
     */
    public $scrollingInformation = null;

    /**
     *
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     *
     * @var fareList $fareList
     * @access public
     */
    public $fareList = null;

}

class statusInformation {

    /**
     *
     * @var firstStatusDetails $firstStatusDetails
     * @access public
     */
    public $firstStatusDetails = null;

    /**
     *
     * @var otherStatusDetails $otherStatusDetails
     * @access public
     */
    public $otherStatusDetails = null;

}

class firstStatusDetails {

    /**
     *
     * @var tstFlag $tstFlag
     * @access public
     */
    public $tstFlag = null;

}

class officeDetails {

    /**
     *
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

}

class carrierFeesGroup {

    /**
     *
     * @var carrierFeeType $carrierFeeType
     * @access public
     */
    public $carrierFeeType = null;

    /**
     *
     * @var carrierFeeInfo $carrierFeeInfo
     * @access public
     */
    public $carrierFeeInfo = null;

}

class carrierFeeType {

    /**
     *
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

}

class carrierFeeInfo {

    /**
     *
     * @var carrierFeeSubcode $carrierFeeSubcode
     * @access public
     */
    public $carrierFeeSubcode = null;

    /**
     *
     * @var commercialName $commercialName
     * @access public
     */
    public $commercialName = null;

    /**
     *
     * @var feeAmount $feeAmount
     * @access public
     */
    public $feeAmount = null;

    /**
     *
     * @var feeTax $feeTax
     * @access public
     */
    public $feeTax = null;

}

class carrierFeeSubcode {

    /**
     *
     * @var dataTypeInformation $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     *
     * @var dataInformation $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class commercialName {

    /**
     *
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class feeAmount {

    /**
     *
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class feeTax {

    /**
     *
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     *
     * @var feeTaxDetails $feeTaxDetails
     * @access public
     */
    public $feeTaxDetails = null;

}

class feeTaxDetails {

    /**
     *
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     *
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

}

class contextualFop {

    /**
     *
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class contextualPointofSale {

    /**
     *
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

}

class Security_Authenticate {

    /**
     *
     * @var conversationClt $conversationClt
     * @access public
     */
    public $conversationClt = null;

    /**
     *
     * @var userIdentifier $userIdentifier
     * @access public
     */
    public $userIdentifier = null;

    /**
     *
     * @var dutyCode $dutyCode
     * @access public
     */
    public $dutyCode = null;

    /**
     *
     * @var systemDetails $systemDetails
     * @access public
     */
    public $systemDetails = null;

    /**
     *
     * @var passwordInfo $passwordInfo
     * @access public
     */
    public $passwordInfo = null;

    /**
     *
     * @var fullLocation $fullLocation
     * @access public
     */
    public $fullLocation = null;

    /**
     *
     * @var applicationId $applicationId
     * @access public
     */
    public $applicationId = null;

}

class conversationClt {

    /**
     *
     * @var senderIdentification $senderIdentification
     * @access public
     */
    public $senderIdentification = null;

    /**
     *
     * @var recipientIdentification $recipientIdentification
     * @access public
     */
    public $recipientIdentification = null;

    /**
     *
     * @var senderInterchangeControlReference $senderInterchangeControlReference
     * @access public
     */
    public $senderInterchangeControlReference = null;

    /**
     *
     * @var recipientInterchangeControlReference $recipientInterchangeControlReference
     * @access public
     */
    public $recipientInterchangeControlReference = null;

}

class userIdentifier {

    /**
     *
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     *
     * @var originatorTypeCode $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

    /**
     *
     * @var originator $originator
     * @access public
     */
    public $originator = null;

}

class dutyCode {

    /**
     *
     * @var dutyCodeDetails $dutyCodeDetails
     * @access public
     */
    public $dutyCodeDetails = null;

}

class dutyCodeDetails {

    /**
     *
     * @var referenceQualifier $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     *
     * @var referenceIdentifier $referenceIdentifier
     * @access public
     */
    public $referenceIdentifier = null;

}

class systemDetails {

    /**
     *
     * @var workstationId $workstationId
     * @access public
     */
    public $workstationId = null;

    /**
     *
     * @var organizationDetails $organizationDetails
     * @access public
     */
    public $organizationDetails = null;

    /**
     *
     * @var idQualifier $idQualifier
     * @access public
     */
    public $idQualifier = null;

}

class organizationDetails {

    /**
     *
     * @var organizationId $organizationId
     * @access public
     */
    public $organizationId = null;

}

class passwordInfo {

    /**
     *
     * @var dataLength $dataLength
     * @access public
     */
    public $dataLength = null;

    /**
     *
     * @var dataType $dataType
     * @access public
     */
    public $dataType = null;

    /**
     *
     * @var binaryData $binaryData
     * @access public
     */
    public $binaryData = null;

}

class fullLocation {

    /**
     *
     * @var workstationPos $workstationPos
     * @access public
     */
    public $workstationPos = null;

    /**
     *
     * @var locationInfo $locationInfo
     * @access public
     */
    public $locationInfo = null;

}

class workstationPos {

    /**
     *
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     *
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     *
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class facilityDetails {

    /**
     *
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     *
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

}

class applicationId {

    /**
     *
     * @var applicationDetails $applicationDetails
     * @access public
     */
    public $applicationDetails = null;

}

class applicationDetails {

    /**
     *
     * @var internalId $internalId
     * @access public
     */
    public $internalId = null;

    /**
     *
     * @var seqNumber $seqNumber
     * @access public
     */
    public $seqNumber = null;

}

class Security_AuthenticateReply {

    /**
     *
     * @var errorSection $errorSection
     * @access public
     */
    public $errorSection = null;

    /**
     *
     * @var processStatus $processStatus
     * @access public
     */
    public $processStatus = null;

    /**
     *
     * @var organizationInfo $organizationInfo
     * @access public
     */
    public $organizationInfo = null;

    /**
     *
     * @var conversationGrp $conversationGrp
     * @access public
     */
    public $conversationGrp = null;

}

class errorSection {

    /**
     *
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     *
     * @var interactiveFreeText $interactiveFreeText
     * @access public
     */
    public $interactiveFreeText = null;

}

class interactiveFreeText {

    /**
     *
     * @var freeTextQualif $freeTextQualif
     * @access public
     */
    public $freeTextQualif = null;

    /**
     *
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class freeTextQualif {

    /**
     *
     * @var subject $subject
     * @access public
     */
    public $subject = null;

    /**
     *
     * @var infoType $infoType
     * @access public
     */
    public $infoType = null;

    /**
     *
     * @var language $language
     * @access public
     */
    public $language = null;

}

class processStatus {

    /**
     *
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class organizationInfo {

    /**
     *
     * @var organizationDetails $organizationDetails
     * @access public
     */
    public $organizationDetails = null;

}

class conversationGrp {

    /**
     *
     * @var processIdentifier $processIdentifier
     * @access public
     */
    public $processIdentifier = null;

}

class Security_SignOut {

    /**
     *
     * @var conversationClt $conversationClt
     * @access public
     */
    public $conversationClt = null;
    public $SessionId = null;

}

class Security_SignOutReply {

    /**
     *
     * @var errorSection $errorSection
     * @access public
     */
    public $errorSection = null;

    /**
     *
     * @var processStatus $processStatus
     * @access public
     */
    public $processStatus = null;

}
