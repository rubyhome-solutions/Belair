<?php

namespace application\components\Amadeus\test_v2;

/**
 * A1 Certification
 *
 * @author Tony
 */
class Certification {

    static function miniRule($strPnr, $airSourceId = \application\components\Amadeus\Utils::TEST_V2_ID) {
        $api = new AmadeusWebServices;
        $api->Security_Authenticate($airSourceId);
        $pnr = $api->getPnr($strPnr);
        // If string is returned , than this is a error
        if (is_string($pnr)) {
            $api->Security_SignOut();
            return self::formatError($pnr);
        }
        $request = new MiniRule_GetFromPricingRec;
        $request->recordId = new ItemReferencesAndVersionsType;
        $request->recordId->referenceType = 'TST';
        $request->recordId->uniqueReference = 'ALL';
        $out = 'Start Timestamp: ' . date(DATE_COOKIE) . '<br>';
        $api->MiniRule_GetFromPricingRec($request);
        $out .= self::formatXmlOutput($api);
        $api->Security_SignOut();
        return $out . 'End Timestamp: ' . date(DATE_COOKIE) . '<br>';
    }

    /**
     * Queue PNR from source to destination using specific Q number
     * @param string $strPnr
     * @param int $sourceAirSourceId
     * @param int $destinationAirSourceId
     * @param string $queueNum
     * @return string
     */
    static function queuePnr($strPnr, $sourceAirSourceId, $destinationAirSourceId, $queueNum = 0) {
        $sourceAirSource = \AirSource::model()->with('backend')->findByPk($sourceAirSourceId);
        $destinationAirSource = \AirSource::model()->with('backend')->findByPk($destinationAirSourceId);
        if (!$sourceAirSource) {
            return self::formatError('Source air source not found');
        }
        if (!$destinationAirSource) {
            return self::formatError('Destination air source not found');
        }
        if ($sourceAirSource->backend_id !== \Backend::AMADEUS_TEST_V2 || $destinationAirSource->backend_id !== \Backend::AMADEUS_TEST_V2) {
            return self::formatError('The air source(s) has wrong backend');
        }
        $api = new AmadeusWebServices;
        $api->Security_Authenticate($sourceAirSourceId);
        $pnr = $api->getPnr($strPnr);
        // If string is returned , than this is a error
        if (is_string($pnr)) {
            $api->Security_SignOut();
            return self::formatError($pnr);
        }
        $request = new Queue_PlacePNR;
        $request->targetDetails = new targetDetails;
        $request->targetDetails->targetOffice = new AdditionalBusinessSourceInformationType;
        $request->targetDetails->targetOffice->originatorDetails = new OriginatorIdentificationDetailsTypeI;
        $request->targetDetails->targetOffice->originatorDetails->inHouseIdentification1 = $destinationAirSource->profile_pcc;
        $request->targetDetails->targetOffice->sourceType = new SourceTypeDetailsTypeI;
        $request->targetDetails->targetOffice->sourceType->sourceQualifier1 = $sourceAirSource->username == $destinationAirSource->username ? 3 : 4; // 3: Place the PNR within the same office. • 4: Place the PNR in a different office.
        $request->targetDetails->queueNumber = new QueueInformationTypeI;
        $request->targetDetails->queueNumber->queueDetails = new QueueInformationDetailsTypeI;
        $request->targetDetails->queueNumber->queueDetails->number = $queueNum;
        $request->recordLocator = new ReservationControlInformationTypeI;
        $request->recordLocator->reservation = new ReservationControlInformationDetailsTypeI;
        $request->recordLocator->reservation->controlNumber = $strPnr;
        $request->placementOption = new SelectionDetailsTypeI;
        $request->placementOption->selectionDetails = new SelectionDetailsInformationTypeI;
        $request->placementOption->selectionDetails->option = 'QEQ';    // Place on queue, QED-place on delay queue
        $out = 'Start Timestamp: ' . date(DATE_COOKIE) . '<br>';
        $api->Queue_PlacePNR($request);
        $out .= self::formatXmlOutput($api);
        $api->Security_SignOut();
        return $out . 'End Timestamp: ' . date(DATE_COOKIE) . '<br>';
    }

    static function queueList($airSourceId, $queueNum = 0) {
        
//        return 'Pending implementation';
        
        $sourceAirSource = \AirSource::model()->with('backend')->findByPk($airSourceId);
        if (!$sourceAirSource) {
            return self::formatError('Source air source not found');
        }
        if ($sourceAirSource->backend_id !== \Backend::AMADEUS_TEST_V2) {
            return self::formatError('The air source(s) has wrong backend');
        }
        $api = new AmadeusWebServices;
        $api->Security_Authenticate($airSourceId);

        $request = new Queue_List;
        $request->targetOffice = new AdditionalBusinessSourceInformationType;
        $request->targetOffice->originatorDetails = new OriginatorIdentificationDetailsTypeI_192816C;
        $request->targetOffice->originatorDetails->inHouseIdentification1 = $sourceAirSource->profile_pcc;
        $request->targetOffice->sourceType = new SourceTypeDetailsTypeI;
        $request->targetOffice->sourceType->sourceQualifier1 = 4;
        $request->queueNumber = new QueueInformationTypeI;
        $request->queueNumber->queueDetails = new QueueInformationDetailsTypeI;
        $request->queueNumber->queueDetails->number = $queueNum;
        
        $request->scanRange = new RangeDetailsTypeI;
        $request->scanRange->rangeQualifier = 701;
        $request->scanRange->rangeDetails = new RangeTypeI;
        $request->scanRange->rangeDetails->min = 0;
        $request->scanRange->rangeDetails->max = 100;
        
        $request->searchCriteria = new searchCriteria;
        $request->searchCriteria->searchOption = new SelectionDetailsTypeI;
        $request->searchCriteria->searchOption->selectionDetails = new SelectionDetailsInformationTypeI;
        $request->searchCriteria->searchOption->selectionDetails->option = 'CD'; // creation date
        $request->searchCriteria->dates = new StructuredPeriodInformationType;
        $request->searchCriteria->dates->beginDateTime = new StructuredDateTimeType_139827C;
        $request->searchCriteria->dates->endDateTime = new StructuredDateTimeType_139827C;
        $before10Days = new \DateTime(date(DATE_FORMAT, time()- 10*24*3600));
        $today = new \DateTime(date(DATE_FORMAT));
        $request->searchCriteria->dates->beginDateTime->year = $before10Days->format('Y');
        $request->searchCriteria->dates->beginDateTime->month = $before10Days->format('n');
        $request->searchCriteria->dates->beginDateTime->day = $before10Days->format('j');
        $request->searchCriteria->dates->endDateTime->year = $today->format('Y');
        $request->searchCriteria->dates->endDateTime->month = $today->format('n');
        $request->searchCriteria->dates->endDateTime->day = $today->format('j');
        $request->sortCriteria = new sortCriteria;
        $request->sortCriteria->dumbo = new DummySegmentTypeI;
        $request->sortCriteria->sortOption = new SelectionDetailsTypeI;
        $request->sortCriteria->sortOption->selectionDetails = new SelectionDetailsInformationTypeI;
        $request->sortCriteria->sortOption->selectionDetails->option = 'CD';

        $out = 'Start Timestamp: ' . date(DATE_COOKIE) . '<br>';
        $api->Queue_List($request);
        $out .= self::formatXmlOutput($api);
        $api->Security_SignOut();
        return $out . 'End Timestamp: ' . date(DATE_COOKIE) . '<br>';
    }

    static function formatError($str) {
        return \TbHtml::alert(\TbHtml::ALERT_COLOR_ERROR, $str);
    }

    static function formatXmlOutput($api) {
        return $api->__getLastRequestHeaders() . "<br>" .
                htmlspecialchars(\Utils::formatXmlString($api->__getLastRequest())) . "<br>" .
                $api->__getLastResponseHeaders() . "<br>" .
                htmlspecialchars(\Utils::formatXmlString($api->__getLastResponse())) . "<br>";
    }

}
