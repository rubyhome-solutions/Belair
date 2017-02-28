<?php

namespace application\components\Amadeus\production_v2;

include_once __DIR__ . '/HelperClasses.php';

class AmadeusWebServices extends \SoapClient {

    public static $queueListErrCodes = [
        '360' => 'Invalid PNR file address',
        '723' => 'Invalid category',
        '727' => 'Invalid amount',
        '79A' => 'Invalid office identification',
        '79B' => 'Already working another queue',
        '79C' => 'Not allowed to access queues for specified office identification',
        '79D' => 'Queue identifier has not been assigned for specified office identification',
        '79E' => 'Attempting to perform a queue function when not associated with a queue',
        '79F' => 'Queue placement or add new queue item is not allowed for the specified office identification and queue identifier',
        '911' => 'Unable to process - system error',
        '912' => 'Incomplete message - data missing in query',
        '913' => 'Item/data not found or data not existing in processing host',
        '914' => 'Invalid format/data - data does not match EDIFACT rules',
        '915' => 'No action - processing host cannot support function',
        '916' => 'EDIFACT version not supported',
        '917' => 'EDIFACT message size exceeded',
        '918' => 'enter message in remarks',
        '919' => 'no PNR in AAA',
        '91A' => 'inactive queue bank',
        '91B' => 'nickname not found',
        '91C' => 'invalid record locator',
        '91D' => 'invalid format',
        '91F' => 'invalid queue number',
        '920' => 'queue/date range empty',
        '921' => 'target not specified',
        '922' => 'targetted queue has wrong queue type',
        '923' => 'invalid time',
        '924' => 'invalid date range',
        '925' => 'queue number not specified',
        '926' => 'queue category empty',
        '927' => 'no items exist',
        '928' => 'queue category not assigned',
        '929' => 'No more items',
        '92A' => 'queue category full',
    ];
    private $headers = null;
    private $soapHeader = null;

    const AMADEUS_HEADER_NAMESPACE = 'http://xml.amadeus.com/ws/2009/01/WBS_Session-2.0.xsd';

    /**
     * @param array $options A array of config values
     * @param string $wsdl The wsdl file to use
     * @access public
     */
    public function __construct(array $options = [], $wsdl = '1ASIWBELBEL_PRD_20160210_062218.wsdl') {
        // Local options
        $options['soap_version'] = SOAP_1_1;
        $options['compression'] = SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP;
        $options['trace'] = true;
        $options['exceptions'] = 1;
        $options['connection_timeout'] = 60;

        parent::__construct(__DIR__ . DIRECTORY_SEPARATOR . $wsdl, $options);
    }

    /**
     * @param Air_RetrieveSeatMap $Air_RetrieveSeatMap_97_1
     * @access public
     * @return Air_RetrieveSeatMapReply
     */
//    public function Air_RetrieveSeatMap(Air_RetrieveSeatMap $Air_RetrieveSeatMap_97_1) {
//        return $this->__soapCall('Air_RetrieveSeatMap', array($Air_RetrieveSeatMap_97_1));
//    }

    /**
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
        }
    }

    /**
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
            return false;
        }
    }

    /**
     * @param Fare_CheckRules $Fare_CheckRules_7_1
     * @access public
     * @return Fare_CheckRulesReply
     */
    public function Fare_CheckRules(Fare_CheckRules $Fare_CheckRules_7_1) {
        $this->prepareHeader();
        return $this->__soapCall('Fare_CheckRules', array($Fare_CheckRules_7_1), null, $this->soapHeader, $this->headers);
    }

    /**
     * @param Fare_InformativePricingWithoutPNR $Fare_InformativePricingWithoutPNR_8_1
     * @access public
     * @return Fare_InformativePricingWithoutPNRReply
     */
    public function Fare_InformativePricingWithoutPNR(Fare_InformativePricingWithoutPNR $Fare_InformativePricingWithoutPNR_8_1) {
        $this->prepareHeader();
        return $this->__soapCall('Fare_InformativePricingWithoutPNR', array($Fare_InformativePricingWithoutPNR_8_1), null, $this->soapHeader, $this->headers);
    }

    /**
     * @param Fare_MasterPricerTravelBoardSearch $Fare_MasterPricerTravelBoardSearch_14_2
     * @access public
     * @return Fare_MasterPricerTravelBoardSearchReply
     */
    public function Fare_MasterPricerTravelBoardSearch(Fare_MasterPricerTravelBoardSearch $Fare_MasterPricerTravelBoardSearch_14_2) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('Fare_MasterPricerTravelBoardSearch', array($Fare_MasterPricerTravelBoardSearch_14_2), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
            \Yii::log($e->getMessage());
            return false;
        }
    }

    /**
     * @param Fare_PricePNRWithBookingClass $Fare_PricePNRWithBookingClass_7_3
     * @access public
     * @return Fare_PricePNRWithBookingClassReply
     */
    public function Fare_PricePNRWithBookingClass(Fare_PricePNRWithBookingClass $Fare_PricePNRWithBookingClass_7_3) {
        $this->prepareHeader();
        return $this->__soapCall('Fare_PricePNRWithBookingClass', array($Fare_PricePNRWithBookingClass_7_3), null, $this->soapHeader, $this->headers);
    }

    /**
     * @param MiniRule_GetFromPricing $MiniRule_GetFromPricing_11_1
     * @access public
     * @return MiniRule_GetFromPricingReply
     */
//    public function MiniRule_GetFromPricing(MiniRule_GetFromPricing $MiniRule_GetFromPricing_11_1) {
//        $this->prepareHeader();
//        return $this->__soapCall('MiniRule_GetFromPricing', array($MiniRule_GetFromPricing_11_1), null, $this->soapHeader, $this->headers);
//    }

    /**
     * @param MiniRule_GetFromPricingRec $MiniRule_GetFromPricingRec_11_1
     * @access public
     * @return MiniRule_GetFromPricingRecReply
     */
    public function MiniRule_GetFromPricingRec(MiniRule_GetFromPricingRec $MiniRule_GetFromPricingRec_11_1) {
        if (!isset($this->headers['Session'])) {
            return false;       // Do nothing if there is no active session to work with.
        }
        $this->prepareHeader();
        return $this->__soapCall('MiniRule_GetFromPricingRec', array($MiniRule_GetFromPricingRec_11_1), null, $this->soapHeader, $this->headers);
    }

    /**
     * @param PNR_AddMultiElements $PNR_AddMultiElements_14_1
     * @access public
     * @return PNR_Reply
     */
    public function PNR_AddMultiElements(PNR_AddMultiElements $PNR_AddMultiElements_14_1) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('PNR_AddMultiElements', array($PNR_AddMultiElements_14_1), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
            $this->Security_SignOut();
            throw new \SoapFault('Receiver', $e->getMessage());
        }
    }

    /**
     * @param PNR_Cancel $PNR_Cancel_14_1
     * @access public
     * @return PNR_Reply
     */
    public function PNR_Cancel(PNR_Cancel $PNR_Cancel_14_1) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('PNR_Cancel', array($PNR_Cancel_14_1), null, $this->soapHeader, $this->headers);
        } catch (\SoapFault $e) {
//            \Utils::soapLogDebug($this);
            return $e->getMessage();
        }
    }

    /**
     * @param PNR_Retrieve $PNR_Retrieve_14_1
     * @access public
     * @return PNR_Reply
     */
    public function PNR_Retrieve(PNR_Retrieve $PNR_Retrieve_14_1) {
        $this->prepareHeader();
        try {
            return $this->__soapCall('PNR_Retrieve', array($PNR_Retrieve_14_1), null, $this->soapHeader, $this->headers);
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
    public function getPnr($pnr, $id = \application\components\Amadeus\Utils::TEST_V2_ID) {
        if ($this->headers === null) {
            $this->Security_Authenticate($id);
        }
        $pnrRetrieve = new PNR_Retrieve;
        $pnrRetrieve->retrievalFacts = new retrievalFacts;
        $pnrRetrieve->retrievalFacts->retrieve = new RetrievePNRType();
        $pnrRetrieve->retrievalFacts->retrieve->type = 2;   // 2 - retrieve by record locator
        $pnrRetrieve->retrievalFacts->reservationOrProfileIdentifier = new ReservationControlInformationDetailsType;
        $pnrRetrieve->retrievalFacts->reservationOrProfileIdentifier->reservation = new reservation;
        $pnrRetrieve->retrievalFacts->reservationOrProfileIdentifier->reservation->controlNumber = $pnr;

        return $this->PNR_Retrieve($pnrRetrieve);
    }

    /**
     * @param PNR_Retrieve $PNR_Retrieve_14_1
     * @access public
     * @return PNR_List
     */
    public function PNR_Retrieve2(PNR_Retrieve $PNR_Retrieve_14_1) {
        $this->prepareHeader();
        return $this->__soapCall('PNR_Retrieve2', array($PNR_Retrieve_14_1), null, $this->soapHeader, $this->headers);
    }

    /**
     * @param Queue_PlacePNR $Queue_PlacePNR_3_1
     * @access public
     * @return Queue_PlacePNRReply
     */
    public function Queue_PlacePNR(Queue_PlacePNR $Queue_PlacePNR_3_1) {
        if (!isset($this->headers['Session'])) {
            return false;       // Do nothing if there is no active session to work with.
        }
        $this->prepareHeader();
        return $this->__soapCall('Queue_PlacePNR', array($Queue_PlacePNR_3_1), null, $this->soapHeader, $this->headers);
    }

    /**
     *
     * @param int $id The ID from the providers table. 25 is the test ID
     * @access public
     * @return Security_AuthenticateReply
     */
    public function Security_Authenticate($id = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID) {
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
     * @param Security_SignOut $Security_SignOut_4_1
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
     * @param Ticket_CreateTSTFromPricing $Ticket_CreateTSTFromPricing_4_1
     * @access public
     * @return Ticket_CreateTSTFromPricingReply
     */
    public function Ticket_CreateTSTFromPricing(Ticket_CreateTSTFromPricing $Ticket_CreateTSTFromPricing_4_1) {
        if (!isset($this->headers['Session'])) {
            return false;       // Do nothing if there is no active session to work with.
        }
        $this->prepareHeader();
        return $this->__soapCall('Ticket_CreateTSTFromPricing', array($Ticket_CreateTSTFromPricing_4_1), null, $this->soapHeader, $this->headers);
    }

    /**
     * @param Ticket_DisplayTST $Ticket_DisplayTST_7_1
     * @access public
     * @return Ticket_DisplayTSTReply
     */
    public function Ticket_DisplayTST(Ticket_DisplayTST $Ticket_DisplayTST_7_1) {
        if (!isset($this->headers['Session'])) {
            return false;       // Do nothing if there is no active session to work with.
        }
        $this->prepareHeader();
        return $this->__soapCall('Ticket_DisplayTST', array($Ticket_DisplayTST_7_1), null, $this->soapHeader, $this->headers);
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
     * Add form of payment to the current PNR
     * @param FormOfPaymentDetailsTypeI $fop Payment details for CC payments, identificationt CA=cash , CC=credit card
     * @return PNR_Reply
     */
    public function addFormOfPayment(FormOfPaymentDetailsTypeI $fop) {
        if ($this->headers === null) {
            // This works only in existing session with active PNR
            return false;
        }
        $pnr_AddMultiElements = new PNR_AddMultiElements;
        $pnr_AddMultiElements->pnrActions = new OptionalPNRActionsType;
        $pnr_AddMultiElements->pnrActions->optionCode = 0;  // No special process, 11 End transact with retrieve (ER), 10 End transact (ET)
        $pnr_AddMultiElements->dataElementsMaster = new dataElementsMaster;
        $pnr_AddMultiElements->dataElementsMaster->marker1 = new DummySegmentTypeI;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv = new dataElementsIndiv;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->elementManagementData = new ElementManagementSegmentType;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->elementManagementData->segmentName = 'FP';    // Form of Payment
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->formOfPayment = new FormOfPaymentTypeI;
        $pnr_AddMultiElements->dataElementsMaster->dataElementsIndiv->formOfPayment->fop = $fop;

        return $this->PNR_AddMultiElements($pnr_AddMultiElements);
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
     * Cancel the given PNR
     * @param string $pnr The PNR to be cancelled
     * @param int $id The default Amadeus id
     * @return object
     */
    public function cancelPnr($pnr, $id = \application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_TEST_ID) {
        if ($this->headers === null) {
            $this->Security_Authenticate($id);
            $endSession = true;
        } else {
            $endSession = false;
        }
        $this->getPnr($pnr);
        $pnrCancel = new PNR_Cancel;
        $pnrCancel->pnrActions = new OptionalPNRActionsType;
        $pnrCancel->pnrActions->optionCode = 10;    // 10   End Transaction
        $pnrCancel->cancelElements = new CancelPNRElementType;
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
        $pnrCancel->pnrActions = new OptionalPNRActionsType;
        $pnrCancel->pnrActions->optionCode = 10;    // 10   End Transaction
        $pnrCancel->cancelElements = new CancelPNRElementType;
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
        if (empty($privateFare)) {
            $farePricePNRWithBookingClass->overrideInformation->attributeDetails = new attributeDetails;
            $farePricePNRWithBookingClass->overrideInformation->attributeDetails->attributeType = 'NOP';
        } else {
            $ads = [];
            $ads[0] = new attributeDetails;
            $ads[0]->attributeType = 'RP'; // RP – Published Fare , RU – Unifare Fare , RW – Corporate Unifare
            $ads[1] = new attributeDetails;
            $ads[1]->attributeType = 'RU';
            if ($privateFare != '000000') {                
                $ads[2] = new attributeDetails;
                $ads[2]->attributeType = 'RW';
                $ads[2]->attributeDescription = $privateFare;
        }
            $ad = new attributeDetails;
            $ad->attributeType = 'FBA';
            $ads[] = $ad;
            $ad = new attributeDetails;
            $ad->attributeType = 'PTC';
            $ads[] = $ad;
            $farePricePNRWithBookingClass->overrideInformation->attributeDetails = $ads;

        }
        
        return $this->Fare_PricePNRWithBookingClass($farePricePNRWithBookingClass);
    }

    /**
     * @param Queue_List $Queue_List_11_1
     * @access public
     * @return Queue_ListReply
     */
    public function Queue_List($Queue_List_11_1) {
        $this->prepareHeader();
        return $this->__soapCall('Queue_List', array($Queue_List_11_1), null, $this->soapHeader, $this->headers);
//        try {
//            $res = $this->__soapCall('Queue_List', array($Queue_List_11_1), null, $this->soapHeader, $this->headers);
//        } catch (\SoapFault $e) {
//            \Utils::soapLogDebug($this);
//            return $e->getMessage();
//        }
//        return $res;
    }

}
