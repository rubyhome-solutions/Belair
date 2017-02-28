<?php

namespace application\components\Scoot;

/**
 *
 */
class BookingManager extends \SoapClient {

    /**
     *
     * @var array $classmap The defined classes
     * @access private
     */
    private static $classmap = array(
        'FlightDesignator' => 'application\components\Scoot\FlightDesignator',
        'StateMessage' => 'application\components\Scoot\StateMessage',
        'OtherServiceInformation' => 'application\components\Scoot\OtherServiceInformation',
        'PointOfSale' => 'application\components\Scoot\PointOfSale',
        'RecordLocator' => 'application\components\Scoot\RecordLocator',
        'TCOrderItem' => 'application\components\Scoot\TCOrderItem',
        'TCResponse' => 'application\components\Scoot\TCResponse',
        'OrderPayment' => 'application\components\Scoot\OrderPayment',
        'TCWarning' => 'application\components\Scoot\TCWarning',
        'TermsConditions' => 'application\components\Scoot\TermsConditions',
        'Participant' => 'application\components\Scoot\Participant',
        'RequestedFieldOfstring' => 'application\components\Scoot\RequestedFieldOfstring',
        'RequestedFieldOfdateTime' => 'application\components\Scoot\RequestedFieldOfdateTime',
        'OrderCustomer' => 'application\components\Scoot\OrderCustomer',
        'OrderHandling' => 'application\components\Scoot\OrderHandling',
        'ChargeableItem' => 'application\components\Scoot\ChargeableItem',
        'OrderDiscount' => 'application\components\Scoot\OrderDiscount',
        'DiscountTarget' => 'application\components\Scoot\DiscountTarget',
        'OrderItemAddress' => 'application\components\Scoot\OrderItemAddress',
        'OrderItemPersonalization' => 'application\components\Scoot\OrderItemPersonalization',
        'OrderItemSkuDetail' => 'application\components\Scoot\OrderItemSkuDetail',
        'OrderItemNote' => 'application\components\Scoot\OrderItemNote',
        'OrderItemLocator' => 'application\components\Scoot\OrderItemLocator',
        'Fee' => 'application\components\Scoot\Fee',
        'OrderItemLocation' => 'application\components\Scoot\OrderItemLocation',
        'OrderItemParameter' => 'application\components\Scoot\OrderItemParameter',
        'OrderItemStatusHistory' => 'application\components\Scoot\OrderItemStatusHistory',
        'OrderItemElement' => 'application\components\Scoot\OrderItemElement',
        'KeyValuePairOfstringstring' => 'application\components\Scoot\KeyValuePairOfstringstring',
        'TicketRequest' => 'application\components\Scoot\TicketRequest',
        'SegmentTicketRequest' => 'application\components\Scoot\SegmentTicketRequest',
        'PaxTicketUpdate' => 'application\components\Scoot\PaxTicketUpdate',
        'BookingUpdateResponseData' => 'application\components\Scoot\BookingUpdateResponseData',
        'Success' => 'application\components\Scoot\Success',
        'BookingSum' => 'application\components\Scoot\BookingSum',
        'Warning' => 'application\components\Scoot\Warning',
        'Error' => 'application\components\Scoot\Error',
        'UpgradeRequestData' => 'application\components\Scoot\UpgradeRequestData',
        'UpgradeSegmentRequest' => 'application\components\Scoot\UpgradeSegmentRequest',
        'DowngradeRequestData' => 'application\components\Scoot\DowngradeRequestData',
        'DowngradeSegmentRequest' => 'application\components\Scoot\DowngradeSegmentRequest',
        'UpgradeAvailabilityRequest' => 'application\components\Scoot\UpgradeAvailabilityRequest',
        'UpgradeAvailabilityResponse' => 'application\components\Scoot\UpgradeAvailabilityResponse',
        'ServiceMessage' => 'application\components\Scoot\ServiceMessage',
        'UpgradeSegment' => 'application\components\Scoot\UpgradeSegment',
        'Upgrade' => 'application\components\Scoot\Upgrade',
        'PassengerFee' => 'application\components\Scoot\PassengerFee',
        'BookingServiceCharge' => 'application\components\Scoot\BookingServiceCharge',
        'UpdateSourcePointOfSaleRequest' => 'application\components\Scoot\UpdateSourcePointOfSaleRequest',
        'MoveJourneyBookingsRequestData' => 'application\components\Scoot\MoveJourneyBookingsRequestData',
        'Journey' => 'application\components\Scoot\Journey',
        'Segment' => 'application\components\Scoot\Segment',
        'Fare' => 'application\components\Scoot\Fare',
        'PaxFare' => 'application\components\Scoot\PaxFare',
        'AvailableFare' => 'application\components\Scoot\AvailableFare',
        'Leg' => 'application\components\Scoot\Leg',
        'LegInfo' => 'application\components\Scoot\LegInfo',
        'LegNest' => 'application\components\Scoot\LegNest',
        'LegClass' => 'application\components\Scoot\LegClass',
        'LegSSR' => 'application\components\Scoot\LegSSR',
        'OperationsInfo' => 'application\components\Scoot\OperationsInfo',
        'PaxBag' => 'application\components\Scoot\PaxBag',
        'PaxSeat' => 'application\components\Scoot\PaxSeat',
        'PaxSeatInfo' => 'application\components\Scoot\PaxSeatInfo',
        'PaxSSR' => 'application\components\Scoot\PaxSSR',
        'PaxSegment' => 'application\components\Scoot\PaxSegment',
        'PaxTicket' => 'application\components\Scoot\PaxTicket',
        'PaxSeatPreference' => 'application\components\Scoot\PaxSeatPreference',
        'PaxScore' => 'application\components\Scoot\PaxScore',
        'MoveJourneyBookingsResponseData' => 'application\components\Scoot\MoveJourneyBookingsResponseData',
        'MoveBookingResult' => 'application\components\Scoot\MoveBookingResult',
        'MoveJourneyByKeyRequestData' => 'application\components\Scoot\MoveJourneyByKeyRequestData',
        'SellKeyList' => 'application\components\Scoot\SellKeyList',
        'EquipmentListRequest' => 'application\components\Scoot\EquipmentListRequest',
        'EquipmentRequest' => 'application\components\Scoot\EquipmentRequest',
        'EquipmentListResponse' => 'application\components\Scoot\EquipmentListResponse',
        'EquipmentResponse' => 'application\components\Scoot\EquipmentResponse',
        'EquipmentInfo' => 'application\components\Scoot\EquipmentInfo',
        'CompartmentInfo' => 'application\components\Scoot\CompartmentInfo',
        'SeatInfo' => 'application\components\Scoot\SeatInfo',
        'EquipmentProperty' => 'application\components\Scoot\EquipmentProperty',
        'LegKey' => 'application\components\Scoot\LegKey',
        'EquipmentPropertyTypeCodesLookup' => 'application\components\Scoot\EquipmentPropertyTypeCodesLookup',
        'FeeRequest' => 'application\components\Scoot\FeeRequest',
        'Booking' => 'application\components\Scoot\Booking',
        'BookingInfo' => 'application\components\Scoot\BookingInfo',
        'TypeOfSale' => 'application\components\Scoot\TypeOfSale',
        'BookingHold' => 'application\components\Scoot\BookingHold',
        'ReceivedByInfo' => 'application\components\Scoot\ReceivedByInfo',
        'Passenger' => 'application\components\Scoot\Passenger',
        'PassengerProgram' => 'application\components\Scoot\PassengerProgram',
        'BookingName' => 'application\components\Scoot\BookingName',
        'PassengerInfant' => 'application\components\Scoot\PassengerInfant',
        'PassengerInfo' => 'application\components\Scoot\PassengerInfo',
        'PassengerAddress' => 'application\components\Scoot\PassengerAddress',
        'PassengerTravelDocument' => 'application\components\Scoot\PassengerTravelDocument',
        'PassengerBag' => 'application\components\Scoot\PassengerBag',
        'PassengerTypeInfo' => 'application\components\Scoot\PassengerTypeInfo',
        'BookingComment' => 'application\components\Scoot\BookingComment',
        'BookingQueueInfo' => 'application\components\Scoot\BookingQueueInfo',
        'BookingContact' => 'application\components\Scoot\BookingContact',
        'Payment' => 'application\components\Scoot\Payment',
        'DCC' => 'application\components\Scoot\DCC',
        'ThreeDSecure' => 'application\components\Scoot\ThreeDSecure',
        'PaymentField' => 'application\components\Scoot\PaymentField',
        'PaymentAddress' => 'application\components\Scoot\PaymentAddress',
        'BookingComponent' => 'application\components\Scoot\BookingComponent',
        'BookingComponentCharge' => 'application\components\Scoot\BookingComponentCharge',
        'OrderItem' => 'application\components\Scoot\OrderItem',
        'UpdatePassengersRequestData' => 'application\components\Scoot\UpdatePassengersRequestData',
        'SSRRequest' => 'application\components\Scoot\SSRRequest',
        'SegmentSSRRequest' => 'application\components\Scoot\SegmentSSRRequest',
        'PriceRequestData' => 'application\components\Scoot\PriceRequestData',
        'CaptureBaggageEventRequestData' => 'application\components\Scoot\CaptureBaggageEventRequestData',
        'CaptureBaggageEventResponseData' => 'application\components\Scoot\CaptureBaggageEventResponseData',
        'FindBaggageEventRequestData' => 'application\components\Scoot\FindBaggageEventRequestData',
        'FindBaggageEventResponseData' => 'application\components\Scoot\FindBaggageEventResponseData',
        'BaggageEvent' => 'application\components\Scoot\BaggageEvent',
        'GuestValuesRequest' => 'application\components\Scoot\GuestValuesRequest',
        'BookingByRecordLocator' => 'application\components\Scoot\BookingByRecordLocator',
        'BookingByBookingID' => 'application\components\Scoot\BookingByBookingID',
        'PassengerScoresRequest' => 'application\components\Scoot\PassengerScoresRequest',
        'PassengerScoresResponse' => 'application\components\Scoot\PassengerScoresResponse',
        'PassengerScore' => 'application\components\Scoot\PassengerScore',
        'BookingCommitRequestData' => 'application\components\Scoot\BookingCommitRequestData',
        'ResellSSR' => 'application\components\Scoot\ResellSSR',
        'UpdateContactsRequestData' => 'application\components\Scoot\UpdateContactsRequestData',
        'UpdateBookingComponentDataRequestData' => 'application\components\Scoot\UpdateBookingComponentDataRequestData',
        'UpdateType' => 'application\components\Scoot\UpdateType',
        'TravelCommerceSellRequestData' => 'application\components\Scoot\TravelCommerceSellRequestData',
        'TripAvailabilityRequest' => 'application\components\Scoot\TripAvailabilityRequest',
        'AvailabilityRequest' => 'application\components\Scoot\AvailabilityRequest',
        'Time' => 'application\components\Scoot\Time',
        'PaxPriceType' => 'application\components\Scoot\PaxPriceType',
        'TripAvailabilityResponse' => 'application\components\Scoot\TripAvailabilityResponse',
        'JourneyDateMarket' => 'application\components\Scoot\JourneyDateMarket',
        'AvailabilityResponse' => 'application\components\Scoot\AvailabilityResponse',
        'LowFareTripAvailabilityRequest' => 'application\components\Scoot\LowFareTripAvailabilityRequest',
        'LowFareAvailabilityRequest' => 'application\components\Scoot\LowFareAvailabilityRequest',
        'LowFareTripAvailabilityResponse' => 'application\components\Scoot\LowFareTripAvailabilityResponse',
        'LowFareAvailabilityResponse' => 'application\components\Scoot\LowFareAvailabilityResponse',
        'DateMarketLowFare' => 'application\components\Scoot\DateMarketLowFare',
        'MoveAvailabilityRequest' => 'application\components\Scoot\MoveAvailabilityRequest',
        'MoveAvailabilityResponse' => 'application\components\Scoot\MoveAvailabilityResponse',
        'MoveFeePriceRequest' => 'application\components\Scoot\MoveFeePriceRequest',
        'MoveFeePriceResponse' => 'application\components\Scoot\MoveFeePriceResponse',
        'MoveFeePriceItem' => 'application\components\Scoot\MoveFeePriceItem',
        'SeparateSegmentByEquipmentResponseData' => 'application\components\Scoot\SeparateSegmentByEquipmentResponseData',
        'SSRAvailabilityRequest' => 'application\components\Scoot\SSRAvailabilityRequest',
        'SSRAvailabilityResponse' => 'application\components\Scoot\SSRAvailabilityResponse',
        'InventorySegmentSSRNest' => 'application\components\Scoot\InventorySegmentSSRNest',
        'SSRAvailabilityForBookingRequest' => 'application\components\Scoot\SSRAvailabilityForBookingRequest',
        'SSRAvailabilityForBookingResponse' => 'application\components\Scoot\SSRAvailabilityForBookingResponse',
        'SSRSegment' => 'application\components\Scoot\SSRSegment',
        'AvailablePaxSSR' => 'application\components\Scoot\AvailablePaxSSR',
        'PaxSSRPrice' => 'application\components\Scoot\PaxSSRPrice',
        'SSRLeg' => 'application\components\Scoot\SSRLeg',
        'FindBookingRequestData' => 'application\components\Scoot\FindBookingRequestData',
        'FindByContact' => 'application\components\Scoot\FindByContact',
        'FindByRecordLocator' => 'application\components\Scoot\FindByRecordLocator',
        'FindByThirdPartyRecordLocator' => 'application\components\Scoot\FindByThirdPartyRecordLocator',
        'FindByName' => 'application\components\Scoot\FindByName',
        'Filter' => 'application\components\Scoot\Filter',
        'FindByAgentID' => 'application\components\Scoot\FindByAgentID',
        'FindByAgentName' => 'application\components\Scoot\FindByAgentName',
        'FindByAgencyNumber' => 'application\components\Scoot\FindByAgencyNumber',
        'FindByEmailAddress' => 'application\components\Scoot\FindByEmailAddress',
        'FindByPhoneNumber' => 'application\components\Scoot\FindByPhoneNumber',
        'FindByCreditCardNumber' => 'application\components\Scoot\FindByCreditCardNumber',
        'FindByCustomerNumber' => 'application\components\Scoot\FindByCustomerNumber',
        'FindByContactCustomerNumber' => 'application\components\Scoot\FindByContactCustomerNumber',
        'FindByCustomer' => 'application\components\Scoot\FindByCustomer',
        'FindByBagTag' => 'application\components\Scoot\FindByBagTag',
        'FindByTravelDocument' => 'application\components\Scoot\FindByTravelDocument',
        'FindByBookingDate' => 'application\components\Scoot\FindByBookingDate',
        'FindBookingResponseData' => 'application\components\Scoot\FindBookingResponseData',
        'FindBookingData' => 'application\components\Scoot\FindBookingData',
        'GetBookingRequestData' => 'application\components\Scoot\GetBookingRequestData',
        'GetByRecordLocator' => 'application\components\Scoot\GetByRecordLocator',
        'GetByThirdPartyRecordLocator' => 'application\components\Scoot\GetByThirdPartyRecordLocator',
        'GetByID' => 'application\components\Scoot\GetByID',
        'GetBookingHistoryRequestData' => 'application\components\Scoot\GetBookingHistoryRequestData',
        'GetBookingHistoryResponseData' => 'application\components\Scoot\GetBookingHistoryResponseData',
        'BookingHistory' => 'application\components\Scoot\BookingHistory',
        'GetBookingBaggageRequestData' => 'application\components\Scoot\GetBookingBaggageRequestData',
        'AcceptScheduleChangesRequestData' => 'application\components\Scoot\AcceptScheduleChangesRequestData',
        'AddBookingCommentsRequestData' => 'application\components\Scoot\AddBookingCommentsRequestData',
        'RecordLocatorListRequest' => 'application\components\Scoot\RecordLocatorListRequest',
        'CancelRequestData' => 'application\components\Scoot\CancelRequestData',
        'CancelJourney' => 'application\components\Scoot\CancelJourney',
        'CancelJourneyRequest' => 'application\components\Scoot\CancelJourneyRequest',
        'CancelFee' => 'application\components\Scoot\CancelFee',
        'CancelSSR' => 'application\components\Scoot\CancelSSR',
        'DivideRequestData' => 'application\components\Scoot\DivideRequestData',
        'BookingPaymentTransfer' => 'application\components\Scoot\BookingPaymentTransfer',
        'FareOverrideRequestData' => 'application\components\Scoot\FareOverrideRequestData',
        'GetBookingPaymentsRequestData' => 'application\components\Scoot\GetBookingPaymentsRequestData',
        'GetBookingPaymentResponseData' => 'application\components\Scoot\GetBookingPaymentResponseData',
        'AddPaymentToBookingRequestData' => 'application\components\Scoot\AddPaymentToBookingRequestData',
        'AgencyAccount' => 'application\components\Scoot\AgencyAccount',
        'CreditShell' => 'application\components\Scoot\CreditShell',
        'CreditFile' => 'application\components\Scoot\CreditFile',
        'PaymentVoucher' => 'application\components\Scoot\PaymentVoucher',
        'ThreeDSecureRequest' => 'application\components\Scoot\ThreeDSecureRequest',
        'MCCRequest' => 'application\components\Scoot\MCCRequest',
        'AddPaymentToBookingResponseData' => 'application\components\Scoot\AddPaymentToBookingResponseData',
        'ValidationPayment' => 'application\components\Scoot\ValidationPayment',
        'PaymentValidationError' => 'application\components\Scoot\PaymentValidationError',
        'ApplyPromotionRequestData' => 'application\components\Scoot\ApplyPromotionRequestData',
        'DCCQueryRequestData' => 'application\components\Scoot\DCCQueryRequestData',
        'PaymentFeePriceRequest' => 'application\components\Scoot\PaymentFeePriceRequest',
        'PaymentFeePriceResponse' => 'application\components\Scoot\PaymentFeePriceResponse',
        'SeatAvailabilityRequest' => 'application\components\Scoot\SeatAvailabilityRequest',
        'EquipmentDeviation' => 'application\components\Scoot\EquipmentDeviation',
        'SeatAvailabilityResponse' => 'application\components\Scoot\SeatAvailabilityResponse',
        'SeatGroupPassengerFee' => 'application\components\Scoot\SeatGroupPassengerFee',
        'SeatAvailabilityLeg' => 'application\components\Scoot\SeatAvailabilityLeg',
        'SeatSellRequest' => 'application\components\Scoot\SeatSellRequest',
        'SegmentSeatRequest' => 'application\components\Scoot\SegmentSeatRequest',
        'CommitRequestData' => 'application\components\Scoot\CommitRequestData',
        'ItineraryPriceRequest' => 'application\components\Scoot\ItineraryPriceRequest',
        'SellJourneyByKeyRequestData' => 'application\components\Scoot\SellJourneyByKeyRequestData',
        'PriceJourneyRequestData' => 'application\components\Scoot\PriceJourneyRequestData',
        'PriceJourney' => 'application\components\Scoot\PriceJourney',
        'PriceSegment' => 'application\components\Scoot\PriceSegment',
        'SellFare' => 'application\components\Scoot\SellFare',
        'PriceLeg' => 'application\components\Scoot\PriceLeg',
        'SellRequestData' => 'application\components\Scoot\SellRequestData',
        'SellJourneyByKeyRequest' => 'application\components\Scoot\SellJourneyByKeyRequest',
        'SellJourneyRequest' => 'application\components\Scoot\SellJourneyRequest',
        'SellJourneyRequestData' => 'application\components\Scoot\SellJourneyRequestData',
        'SellJourney' => 'application\components\Scoot\SellJourney',
        'SellSegment' => 'application\components\Scoot\SellSegment',
        'SellSSR' => 'application\components\Scoot\SellSSR',
        'SellFee' => 'application\components\Scoot\SellFee',
        'SellFeeRequestData' => 'application\components\Scoot\SellFeeRequestData',
        'UpdateFeeStatusRequestData' => 'application\components\Scoot\UpdateFeeStatusRequestData',
        'FeeStatusRequest' => 'application\components\Scoot\FeeStatusRequest',
        'ServiceCancelRequest' => 'application\components\Scoot\ServiceCancelRequest',
        'UpdateTicketsRequest' => 'application\components\Scoot\UpdateTicketsRequest',
        'UpdateTicketsResponse' => 'application\components\Scoot\UpdateTicketsResponse',
        'UpgradeRequest' => 'application\components\Scoot\UpgradeRequest',
        'UpgradeResponse' => 'application\components\Scoot\UpgradeResponse',
        'DowngradeRequest' => 'application\components\Scoot\DowngradeRequest',
        'DowngradeResponse' => 'application\components\Scoot\DowngradeResponse',
        'GetUpgradeAvailabilityRequest' => 'application\components\Scoot\GetUpgradeAvailabilityRequest',
        'GetUpgradeAvailabilityResponse' => 'application\components\Scoot\GetUpgradeAvailabilityResponse',
        'ChangeSourcePointOfSaleRequest' => 'application\components\Scoot\ChangeSourcePointOfSaleRequest',
        'ChangeSourcePointOfSaleResponse' => 'application\components\Scoot\ChangeSourcePointOfSaleResponse',
        'GetEquipmentPropertiesRequest' => 'application\components\Scoot\GetEquipmentPropertiesRequest',
        'GetEquipmentPropertiesResponse' => 'application\components\Scoot\GetEquipmentPropertiesResponse',
        'OverrideFeeRequest' => 'application\components\Scoot\OverrideFeeRequest',
        'OverrideFeeResponse' => 'application\components\Scoot\OverrideFeeResponse',
        'UpdatePassengersRequest' => 'application\components\Scoot\UpdatePassengersRequest',
        'UpdatePassengerResponse' => 'application\components\Scoot\UpdatePassengerResponse',
        'UpdateSSRRequest' => 'application\components\Scoot\UpdateSSRRequest',
        'UpdateSSRResponse' => 'application\components\Scoot\UpdateSSRResponse',
        'UpdatePriceRequest' => 'application\components\Scoot\UpdatePriceRequest',
        'UpdatePriceResponse' => 'application\components\Scoot\UpdatePriceResponse',
        'CaptureBaggageEventRequest' => 'application\components\Scoot\CaptureBaggageEventRequest',
        'CaptureBaggageEventResponse' => 'application\components\Scoot\CaptureBaggageEventResponse',
        'CalculateGuestValuesRequest' => 'application\components\Scoot\CalculateGuestValuesRequest',
        'CalculateGuestValuesResponse' => 'application\components\Scoot\CalculateGuestValuesResponse',
        'ScorePassengersRequest' => 'application\components\Scoot\ScorePassengersRequest',
        'ScorePassengersResponse' => 'application\components\Scoot\ScorePassengersResponse',
        'BookingCommitRequest' => 'application\components\Scoot\BookingCommitRequest',
        'BookingCommitResponse' => 'application\components\Scoot\BookingCommitResponse',
        'ResellSSRRequest' => 'application\components\Scoot\ResellSSRRequest',
        'ResellSSRResponse' => 'application\components\Scoot\ResellSSRResponse',
        'UpdateContactsRequest' => 'application\components\Scoot\UpdateContactsRequest',
        'UpdateContactsResponse' => 'application\components\Scoot\UpdateContactsResponse',
        'UpdateBookingComponentDataRequest' => 'application\components\Scoot\UpdateBookingComponentDataRequest',
        'UpdateBookingComponentDataResponse' => 'application\components\Scoot\UpdateBookingComponentDataResponse',
        'TravelCommerceSellRequest' => 'application\components\Scoot\TravelCommerceSellRequest',
        'TravelCommerceSellResponse' => 'application\components\Scoot\TravelCommerceSellResponse',
        'TravelCommerceCancelServiceRequest' => 'application\components\Scoot\TravelCommerceCancelServiceRequest',
        'TravelCommerceCancelServiceResponse' => 'application\components\Scoot\TravelCommerceCancelServiceResponse',
        'GetAvailabilityRequest' => 'application\components\Scoot\GetAvailabilityRequest',
        'GetAvailabilityByTripResponse' => 'application\components\Scoot\GetAvailabilityByTripResponse',
        'GetLowFareAvailabilityRequest' => 'application\components\Scoot\GetLowFareAvailabilityRequest',
        'GetLowFareAvailabilityResponse' => 'application\components\Scoot\GetLowFareAvailabilityResponse',
        'GetLowFareTripAvailabilityRequest' => 'application\components\Scoot\GetLowFareTripAvailabilityRequest',
        'GetLowFareTripAvailabilityResponse' => 'application\components\Scoot\GetLowFareTripAvailabilityResponse',
        'GetMoveAvailabilityRequest' => 'application\components\Scoot\GetMoveAvailabilityRequest',
        'GetMoveAvailabilityResponse' => 'application\components\Scoot\GetMoveAvailabilityResponse',
        'GetMoveFeePriceRequest' => 'application\components\Scoot\GetMoveFeePriceRequest',
        'GetMoveFeePriceResponse' => 'application\components\Scoot\GetMoveFeePriceResponse',
        'GetSSRAvailabilityRequest' => 'application\components\Scoot\GetSSRAvailabilityRequest',
        'GetSSRAvailabilityResponse' => 'application\components\Scoot\GetSSRAvailabilityResponse',
        'GetSSRAvailabilityForBookingRequest' => 'application\components\Scoot\GetSSRAvailabilityForBookingRequest',
        'GetSSRAvailabilityForBookingResponse' => 'application\components\Scoot\GetSSRAvailabilityForBookingResponse',
        'GetBookingRequest' => 'application\components\Scoot\GetBookingRequest',
        'GetBookingResponse' => 'application\components\Scoot\GetBookingResponse',
        'GetBookingFromStateResponse' => 'application\components\Scoot\GetBookingFromStateResponse',
        'GetBookingHistoryRequest' => 'application\components\Scoot\GetBookingHistoryRequest',
        'GetBookingHistoryResponse' => 'application\components\Scoot\GetBookingHistoryResponse',
        'GetBookingBaggageRequest' => 'application\components\Scoot\GetBookingBaggageRequest',
        'GetBookingBaggageResponse' => 'application\components\Scoot\GetBookingBaggageResponse',
        'AcceptScheduleChangesRequest' => 'application\components\Scoot\AcceptScheduleChangesRequest',
        'AddBookingCommentsRequest' => 'application\components\Scoot\AddBookingCommentsRequest',
        'AddBookingCommentsResponse' => 'application\components\Scoot\AddBookingCommentsResponse',
        'GetRecordLocatorListRequest' => 'application\components\Scoot\GetRecordLocatorListRequest',
        'GetRecordLocatorListResponse' => 'application\components\Scoot\GetRecordLocatorListResponse',
        'CancelRequest' => 'application\components\Scoot\CancelRequest',
        'CancelResponse' => 'application\components\Scoot\CancelResponse',
        'DivideRequest' => 'application\components\Scoot\DivideRequest',
        'DivideResponse' => 'application\components\Scoot\DivideResponse',
        'FareOverrideRequest' => 'application\components\Scoot\FareOverrideRequest',
        'FareOverrideResponse' => 'application\components\Scoot\FareOverrideResponse',
        'GetBookingPaymentsRequest' => 'application\components\Scoot\GetBookingPaymentsRequest',
        'GetBookingPaymentsResponse' => 'application\components\Scoot\GetBookingPaymentsResponse',
        'AddPaymentToBookingRequest' => 'application\components\Scoot\AddPaymentToBookingRequest',
        'AddPaymentToBookingResponse' => 'application\components\Scoot\AddPaymentToBookingResponse',
        'AddInProcessPaymentToBookingRequest' => 'application\components\Scoot\AddInProcessPaymentToBookingRequest',
        'AddInProcessPaymentToBookingResponse' => 'application\components\Scoot\AddInProcessPaymentToBookingResponse',
        'ApplyPromotionRequest' => 'application\components\Scoot\ApplyPromotionRequest',
        'ApplyPromotionResponse' => 'application\components\Scoot\ApplyPromotionResponse',
        'DCCQueryRequest' => 'application\components\Scoot\DCCQueryRequest',
        'DCCQueryResponse' => 'application\components\Scoot\DCCQueryResponse',
        'DCCPaymentResponse' => 'application\components\Scoot\DCCPaymentResponse',
        'GetPaymentFeePriceRequest' => 'application\components\Scoot\GetPaymentFeePriceRequest',
        'GetPaymentFeePriceResponse' => 'application\components\Scoot\GetPaymentFeePriceResponse',
        'GetSeatAvailabilityRequest' => 'application\components\Scoot\GetSeatAvailabilityRequest',
        'GetSeatAvailabilityResponse' => 'application\components\Scoot\GetSeatAvailabilityResponse',
        'AssignSeatsRequest' => 'application\components\Scoot\AssignSeatsRequest',
        'AssignSeatsResponse' => 'application\components\Scoot\AssignSeatsResponse',
        'UnassignSeatsRequest' => 'application\components\Scoot\UnassignSeatsRequest',
        'UnassignSeatsResponse' => 'application\components\Scoot\UnassignSeatsResponse',
        'CommitRequest' => 'application\components\Scoot\CommitRequest',
        'CommitResponse' => 'application\components\Scoot\CommitResponse',
        'PriceItineraryRequest' => 'application\components\Scoot\PriceItineraryRequest',
        'PriceItineraryResponse' => 'application\components\Scoot\PriceItineraryResponse',
        'SellRequest' => 'application\components\Scoot\SellRequest',
        'SellResponse' => 'application\components\Scoot\SellResponse',
        'UpdateFeeStatusRequest' => 'application\components\Scoot\UpdateFeeStatusRequest',
        'GetBookingFromStateRequest' => 'application\components\Scoot\GetBookingFromStateRequest');

    /**
     *
     * @param string $signature The token for this booking
     * @param array $options A array of config values
     * @param string $wsdl The wsdl file to use
     * @access public
     */
    public function __construct($signature, array $options = [], $wsdl = 'production') {
        set_time_limit(60);     // More time is needed
        $wsdl = __DIR__ . DIRECTORY_SEPARATOR . $wsdl . DIRECTORY_SEPARATOR . 'BookingManager.wsdl';
        foreach (self::$classmap as $key => $value) {
            if (!isset($options['classmap'][$key])) {
                $options['classmap'][$key] = $value;
            }
        }

        // Local options - valid for SJ SOAP
        $options['soap_version'] = SOAP_1_1;
        $options['compression'] = SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP;
        $options['trace'] = true;
        $options['exceptions'] = 1;
        $options['connection_timeout'] = 30;

        // Use proxy if not on the server
        if (YII_DEBUG) {
            $options['proxy_host'] = '128.199.218.209';     // air.belair.in
            $options['proxy_port'] = 3128;
            $options['stream_context'] = stream_context_create(
                    ['ssl' => [
                            'verify_peer' => false,
                            'verify_peer_name' => false,                        
                            'allow_self_signed' => true
                        ]
                    ]
            );
        }

        parent::__construct($wsdl, $options);
        $headers[] = new \SoapHeader('http://schemas.navitaire.com/WebServices', 'ContractVersion', 340);
        $headers[] = new \SoapHeader('http://schemas.navitaire.com/WebServices', 'Signature', $signature);
        $this->__setSoapHeaders($headers);
    }

    /**
     * Return the response as a \SimpleXMLElement
     * @return \SimpleXMLElement
     */
    function toSimpleXmlElement() {
//        print_r($this->__getLastResponse());
        return @\simplexml_load_string(preg_replace('#<([/]*).:#', '<$1', $this->__getLastResponse()), null, LIBXML_NOCDATA);
    }

    /**
     *
     * @param UpdateTicketsRequest $parameters
     * @access public
     * @return UpdateTicketsResponse
     */
    public function UpdateTickets(UpdateTicketsRequest $parameters) {
        return $this->__soapCall('UpdateTickets', array($parameters));
    }

    /**
     *
     * @param UpgradeRequest $parameters
     * @access public
     * @return UpgradeResponse
     */
    public function Upgrade(UpgradeRequest $parameters) {
        return $this->__soapCall('Upgrade', array($parameters));
    }

    /**
     *
     * @param DowngradeRequest $parameters
     * @access public
     * @return DowngradeResponse
     */
    public function Downgrade(DowngradeRequest $parameters) {
        return $this->__soapCall('Downgrade', array($parameters));
    }

    /**
     *
     * @param GetUpgradeAvailabilityRequest $parameters
     * @access public
     * @return GetUpgradeAvailabilityResponse
     */
    public function GetUpgradeAvailability(GetUpgradeAvailabilityRequest $parameters) {
        return $this->__soapCall('GetUpgradeAvailability', array($parameters));
    }

    /**
     *
     * @access public
     * @return void
     */
    public function Clear() {
        return $this->__soapCall('Clear', array());
    }

    /**
     *
     * @param ChangeSourcePointOfSaleRequest $parameters
     * @access public
     * @return ChangeSourcePointOfSaleResponse
     */
    public function ChangeSourcePointOfSale(ChangeSourcePointOfSaleRequest $parameters) {
        return $this->__soapCall('ChangeSourcePointOfSale', array($parameters));
    }

    /**
     *
     * @param MoveJourneyBookingsRequestData $MoveJourneyBookingsRequestData
     * @access public
     * @return MoveJourneyBookingsResponseData
     */
    public function MoveJourneyBookings(MoveJourneyBookingsRequestData $MoveJourneyBookingsRequestData) {
        return $this->__soapCall('MoveJourneyBookings', array($MoveJourneyBookingsRequestData));
    }

    /**
     *
     * @param MoveJourneyByKeyRequestData $MoveJourneyByKeyRequestData
     * @access public
     * @return BookingUpdateResponseData
     */
    public function MoveJourney(MoveJourneyByKeyRequestData $MoveJourneyByKeyRequestData) {
        return $this->__soapCall('MoveJourney', array($MoveJourneyByKeyRequestData));
    }

    /**
     *
     * @access public
     * @return boolean
     */
    public function GetPostCommitResults() {
        return $this->__soapCall('GetPostCommitResults', array());
    }

    /**
     *
     * @param string $RecordLocatorReqData
     * @access public
     * @return void
     */
    public function SendItinerary($RecordLocatorReqData) {
        return $this->__soapCall('SendItinerary', array($RecordLocatorReqData));
    }

    /**
     *
     * @param GetEquipmentPropertiesRequest $parameters
     * @access public
     * @return GetEquipmentPropertiesResponse
     */
    public function GetEquipmentProperties(GetEquipmentPropertiesRequest $parameters) {
        return $this->__soapCall('GetEquipmentProperties', array($parameters));
    }

    /**
     *
     * @param OverrideFeeRequest $parameters
     * @access public
     * @return OverrideFeeResponse
     */
    public function OverrideFee(OverrideFeeRequest $parameters) {
        return $this->__soapCall('OverrideFee', array($parameters));
    }

    /**
     *
     * @param UpdatePassengersRequest $parameters
     * @access public
     * @return UpdatePassengerResponse
     */
    public function UpdatePassengers(UpdatePassengersRequest $parameters) {
        return $this->__soapCall('UpdatePassengers', array($parameters));
    }

    /**
     *
     * @param UpdateSSRRequest $parameters
     * @access public
     * @return UpdateSSRResponse
     */
    public function UpdateSSR(UpdateSSRRequest $parameters) {
        return $this->__soapCall('UpdateSSR', array($parameters));
    }

    /**
     *
     * @param UpdatePriceRequest $parameters
     * @access public
     * @return UpdatePriceResponse
     */
    public function UpdatePrice(UpdatePriceRequest $parameters) {
        return $this->__soapCall('UpdatePrice', array($parameters));
    }

    /**
     *
     * @param CaptureBaggageEventRequest $parameters
     * @access public
     * @return CaptureBaggageEventResponse
     */
    public function CaptureBaggageEvent(CaptureBaggageEventRequest $parameters) {
        return $this->__soapCall('CaptureBaggageEvent', array($parameters));
    }

    /**
     *
     * @param FindBaggageEventRequestData $FindBaggageEventRequestData
     * @access public
     * @return FindBaggageEventResponseData
     */
    public function FindBaggageEvent(FindBaggageEventRequestData $FindBaggageEventRequestData) {
        return $this->__soapCall('FindBaggageEvent', array($FindBaggageEventRequestData));
    }

    /**
     *
     * @param CalculateGuestValuesRequest $parameters
     * @access public
     * @return CalculateGuestValuesResponse
     */
    public function CalculateGuestValues(CalculateGuestValuesRequest $parameters) {
        return $this->__soapCall('CalculateGuestValues', array($parameters));
    }

    /**
     *
     * @param ScorePassengersRequest $parameters
     * @access public
     * @return ScorePassengersResponse
     */
    public function ScorePassengers(ScorePassengersRequest $parameters) {
        return $this->__soapCall('ScorePassengers', array($parameters));
    }

    /**
     *
     * @param BookingCommitRequest $parameters
     * @access public
     * @return BookingCommitResponse
     */
    public function BookingCommit(BookingCommitRequest $parameters) {
        try {
            return $this->__soapCall('BookingCommit', array($parameters));
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
            return $e->getMessage();
        }
    }

    /**
     *
     * @param ResellSSRRequest $parameters
     * @access public
     * @return ResellSSRResponse
     */
    public function ResellSSR(ResellSSRRequest $parameters) {
        return $this->__soapCall('ResellSSR', array($parameters));
    }

    /**
     *
     * @param UpdateContactsRequest $parameters
     * @access public
     * @return UpdateContactsResponse
     */
    public function UpdateContacts(UpdateContactsRequest $parameters) {
        return $this->__soapCall('UpdateContacts', array($parameters));
    }

    /**
     *
     * @param UpdateBookingComponentDataRequest $parameters
     * @access public
     * @return UpdateBookingComponentDataResponse
     */
    public function UpdateBookingComponentData(UpdateBookingComponentDataRequest $parameters) {
        return $this->__soapCall('UpdateBookingComponentData', array($parameters));
    }

    /**
     *
     * @param TravelCommerceSellRequest $parameters
     * @access public
     * @return TravelCommerceSellResponse
     */
    public function TravelCommerceSell(TravelCommerceSellRequest $parameters) {
        return $this->__soapCall('TravelCommerceSell', array($parameters));
    }

    /**
     *
     * @param TravelCommerceCancelServiceRequest $parameters
     * @access public
     * @return TravelCommerceCancelServiceResponse
     */
    public function TravelCommerceCancelService(TravelCommerceCancelServiceRequest $parameters) {
        return $this->__soapCall('TravelCommerceCancelService', array($parameters));
    }

    /**
     *
     * @param GetAvailabilityRequest $parameters
     * @access public
     * @return GetAvailabilityByTripResponse
     */
    public function GetAvailability(GetAvailabilityRequest $parameters) {
        try {
            return $this->__soapCall('GetAvailability', array($parameters));
            
           // \Utils::soapLogDebug($this);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
            return [];
        }
    }

    /**
     *
     * @param GetLowFareAvailabilityRequest $parameters
     * @access public
     * @return GetLowFareAvailabilityResponse
     */
    public function GetLowFareAvailability(GetLowFareAvailabilityRequest $parameters) {
        return $this->__soapCall('GetLowFareAvailability', array($parameters));
    }

    /**
     *
     * @param GetLowFareTripAvailabilityRequest $parameters
     * @access public
     * @return GetLowFareTripAvailabilityResponse
     */
    public function GetLowFareTripAvailability(GetLowFareTripAvailabilityRequest $parameters) {
        return $this->__soapCall('GetLowFareTripAvailability', array($parameters));
    }

    /**
     *
     * @param GetMoveAvailabilityRequest $parameters
     * @access public
     * @return GetMoveAvailabilityResponse
     */
    public function GetMoveAvailability(GetMoveAvailabilityRequest $parameters) {
        return $this->__soapCall('GetMoveAvailability', array($parameters));
    }

    /**
     *
     * @param GetMoveFeePriceRequest $parameters
     * @access public
     * @return GetMoveFeePriceResponse
     */
    public function GetMoveFeePrice(GetMoveFeePriceRequest $parameters) {
        return $this->__soapCall('GetMoveFeePrice', array($parameters));
    }

    /**
     *
     * @param Segment $SegmentRequest
     * @access public
     * @return SeparateSegmentByEquipmentResponseData
     */
    public function SeparateSegmentByEquipment(Segment $SegmentRequest) {
        return $this->__soapCall('SeparateSegmentByEquipment', array($SegmentRequest));
    }

    /**
     *
     * @param GetSSRAvailabilityRequest $parameters
     * @access public
     * @return GetSSRAvailabilityResponse
     */
    public function GetSSRAvailability(GetSSRAvailabilityRequest $parameters) {
        return $this->__soapCall('GetSSRAvailability', array($parameters));
    }

    /**
     *
     * @param GetSSRAvailabilityForBookingRequest $parameters
     * @access public
     * @return GetSSRAvailabilityForBookingResponse
     */
    public function GetSSRAvailabilityForBooking(GetSSRAvailabilityForBookingRequest $parameters) {
        return $this->__soapCall('GetSSRAvailabilityForBooking', array($parameters));
    }

    /**
     *
     * @param FindBookingRequestData $FindBookingRequestData
     * @access public
     * @return FindBookingResponseData
     */
    public function FindBooking(FindBookingRequestData $FindBookingRequestData) {
        return $this->__soapCall('FindBooking', array($FindBookingRequestData));
    }

    /**
     *
     * @param GetBookingRequest $parameters
     * @access public
     * @return GetBookingResponse
     */
    public function GetBooking(GetBookingRequest $parameters) {
        try {
            return $this->__soapCall('GetBooking', array($parameters));
        } catch (\SoapFault $e) {
            return $e->getMessage();
//            \Utils::soapDebug($this);
        }
    }

    /**
     *
     * @param GetBookingFromStateRequest $parameters
     * @access public
     * @return GetBookingFromStateResponse
     */
    public function GetBookingFromState(GetBookingFromStateRequest $parameters) {
        return $this->__soapCall('GetBookingFromState', array($parameters));
    }

    /**
     *
     * @param GetBookingHistoryRequest $parameters
     * @access public
     * @return GetBookingHistoryResponse
     */
    public function GetBookingHistory(GetBookingHistoryRequest $parameters) {
        return $this->__soapCall('GetBookingHistory', array($parameters));
    }

    /**
     *
     * @param GetBookingBaggageRequest $parameters
     * @access public
     * @return GetBookingBaggageResponse
     */
    public function GetBookingBaggage(GetBookingBaggageRequest $parameters) {
        return $this->__soapCall('GetBookingBaggage', array($parameters));
    }

    /**
     *
     * @param AcceptScheduleChangesRequest $parameters
     * @access public
     * @return void
     */
    public function AcceptScheduleChanges(AcceptScheduleChangesRequest $parameters) {
        return $this->__soapCall('AcceptScheduleChanges', array($parameters));
    }

    /**
     *
     * @param AddBookingCommentsRequest $parameters
     * @access public
     * @return AddBookingCommentsResponse
     */
    public function AddBookingComments(AddBookingCommentsRequest $parameters) {
        return $this->__soapCall('AddBookingComments', array($parameters));
    }

    /**
     *
     * @param GetRecordLocatorListRequest $parameters
     * @access public
     * @return GetRecordLocatorListResponse
     */
    public function GetRecordLocatorList(GetRecordLocatorListRequest $parameters) {
        return $this->__soapCall('GetRecordLocatorList', array($parameters));
    }

    /**
     *
     * @param CancelRequest $parameters
     * @access public
     * @return CancelResponse
     */
    public function Cancel(CancelRequest $parameters) {
        return $this->__soapCall('Cancel', array($parameters));
    }

    /**
     *
     * @param DivideRequest $parameters
     * @access public
     * @return DivideResponse
     */
    public function Divide(DivideRequest $parameters) {
        return $this->__soapCall('Divide', array($parameters));
    }

    /**
     *
     * @param FareOverrideRequest $parameters
     * @access public
     * @return FareOverrideResponse
     */
    public function FareOverride(FareOverrideRequest $parameters) {
        return $this->__soapCall('FareOverride', array($parameters));
    }

    /**
     *
     * @param GetBookingPaymentsRequest $parameters
     * @access public
     * @return GetBookingPaymentsResponse
     */
    public function GetBookingPayments(GetBookingPaymentsRequest $parameters) {
        return $this->__soapCall('GetBookingPayments', array($parameters));
    }

    /**
     *
     * @param AddPaymentToBookingRequest $parameters
     * @access public
     * @return AddPaymentToBookingResponse
     */
    public function AddPaymentToBooking(AddPaymentToBookingRequest $parameters) {
        $res=$this->__soapCall('AddPaymentToBooking', array($parameters));
        //\Utils::soapLogDebug($this);
        return $res;
    }

    /**
     *
     * @param AddInProcessPaymentToBookingRequest $parameters
     * @access public
     * @return AddInProcessPaymentToBookingResponse
     */
    public function AddInProcessPaymentToBooking(AddInProcessPaymentToBookingRequest $parameters) {
        return $this->__soapCall('AddInProcessPaymentToBooking', array($parameters));
    }

    /**
     *
     * @param ApplyPromotionRequest $parameters
     * @access public
     * @return ApplyPromotionResponse
     */
    public function ApplyPromotion(ApplyPromotionRequest $parameters) {
        return $this->__soapCall('ApplyPromotion', array($parameters));
    }

    /**
     *
     * @access public
     * @return void
     */
    public function CancelInProcessPayment() {
        return $this->__soapCall('CancelInProcessPayment', array());
    }

    /**
     *
     * @param DCCQueryRequest $parameters
     * @access public
     * @return DCCQueryResponse
     */
    public function DCCQuery(DCCQueryRequest $parameters) {
        return $this->__soapCall('DCCQuery', array($parameters));
    }

    /**
     *
     * @access public
     * @return DCCPaymentResponse
     */
    public function AcceptDCCOffer() {
        return $this->__soapCall('AcceptDCCOffer', array());
    }

    /**
     *
     * @access public
     * @return DCCPaymentResponse
     */
    public function RejectDCCOffer() {
        return $this->__soapCall('RejectDCCOffer', array());
    }

    /**
     *
     * @access public
     * @return DCCPaymentResponse
     */
    public function DCCNotOffered() {
        return $this->__soapCall('DCCNotOffered', array());
    }

    /**
     *
     * @param GetPaymentFeePriceRequest $parameters
     * @access public
     * @return GetPaymentFeePriceResponse
     */
    public function GetPaymentFeePrice(GetPaymentFeePriceRequest $parameters) {
        return $this->__soapCall('GetPaymentFeePrice', array($parameters));
    }

    /**
     *
     * @param GetSeatAvailabilityRequest $parameters
     * @access public
     * @return GetSeatAvailabilityResponse
     */
    public function GetSeatAvailability(GetSeatAvailabilityRequest $parameters) {
        return $this->__soapCall('GetSeatAvailability', array($parameters));
    }

    /**
     *
     * @param AssignSeatsRequest $parameters
     * @access public
     * @return AssignSeatsResponse
     */
    public function AssignSeats(AssignSeatsRequest $parameters) {
        return $this->__soapCall('AssignSeats', array($parameters));
    }

    /**
     *
     * @param UnassignSeatsRequest $parameters
     * @access public
     * @return UnassignSeatsResponse
     */
    public function UnassignSeats(UnassignSeatsRequest $parameters) {
        return $this->__soapCall('UnassignSeats', array($parameters));
    }

    /**
     *
     * @param CommitRequest $parameters
     * @access public
     * @return CommitResponse
     */
    public function Commit(CommitRequest $parameters) {
        return $this->__soapCall('Commit', array($parameters));
    }

    /**
     *
     * @param PriceItineraryRequest $parameters
     * @access public
     * @return PriceItineraryResponse
     */
    public function GetItineraryPrice(PriceItineraryRequest $parameters) {
        try{
        return $this->__soapCall('GetItineraryPrice', array($parameters));
        }
        catch(\SoapFault $e){
            \Utils::soapLogDebug($this);
            return $e->getMessage();
        }
    }

    /**
     *
     * @param SellRequest $parameters
     * @access public
     * @return SellResponse
     */
    public function Sell(SellRequest $parameters) {
        return $this->__soapCall('Sell', array($parameters));
    }

    /**
     *
     * @param UpdateFeeStatusRequest $parameters
     * @access public
     * @return boolean
     */
    public function UpdateFeeStatus(UpdateFeeStatusRequest $parameters) {
        return $this->__soapCall('UpdateFeeStatus', array($parameters));
    }

}

class MessageState {

    const __default = 'aNew';
    const aNew = 'New';
    const Clean = 'Clean';
    const Modified = 'Modified';
    const Deleted = 'Deleted';
    const Confirmed = 'Confirmed';
    const Unmapped = 'Unmapped';

}

class OSISeverity {

    const __default = 'General';
    const General = 'General';
    const Warning = 'Warning';
    const Critical = 'Critical';
    const Unmapped = 'Unmapped';

}

class FeeType {

    const __default = 'All';
    const All = 'All';
    const Tax = 'Tax';
    const TravelFee = 'TravelFee';
    const ServiceFee = 'ServiceFee';
    const PaymentFee = 'PaymentFee';
    const PenaltyFee = 'PenaltyFee';
    const SSRFee = 'SSRFee';
    const NonFlightServiceFee = 'NonFlightServiceFee';
    const UpgradeFee = 'UpgradeFee';
    const SeatFee = 'SeatFee';
    const BaseFare = 'BaseFare';
    const SpoilageFee = 'SpoilageFee';
    const NameChangeFee = 'NameChangeFee';
    const ConvenienceFee = 'ConvenienceFee';
    const BaggageFee = 'BaggageFee';
    const FareSurcharge = 'FareSurcharge';
    const PromotionDiscount = 'PromotionDiscount';
    const Unmapped = 'Unmapped';

}

class ChargeType {

    const __default = 'FarePrice';
    const FarePrice = 'FarePrice';
    const Discount = 'Discount';
    const IncludedTravelFee = 'IncludedTravelFee';
    const IncludedTax = 'IncludedTax';
    const TravelFee = 'TravelFee';
    const Tax = 'Tax';
    const ServiceCharge = 'ServiceCharge';
    const PromotionDiscount = 'PromotionDiscount';
    const ConnectionAdjustmentAmount = 'ConnectionAdjustmentAmount';
    const AddOnServicePrice = 'AddOnServicePrice';
    const IncludedAddOnServiceFee = 'IncludedAddOnServiceFee';
    const AddOnServiceFee = 'AddOnServiceFee';
    const Calculated = 'Calculated';
    const Note = 'Note';
    const AddOnServiceMarkup = 'AddOnServiceMarkup';
    const FareSurcharge = 'FareSurcharge';
    const Loyalty = 'Loyalty';
    const FarePoints = 'FarePoints';
    const DiscountPoints = 'DiscountPoints';
    const AddOnServiceCancelFee = 'AddOnServiceCancelFee';
    const Unmapped = 'Unmapped';

}

class CollectType {

    const __default = 'SellerChargeable';
    const SellerChargeable = 'SellerChargeable';
    const ExternalChargeable = 'ExternalChargeable';
    const SellerNonChargeable = 'SellerNonChargeable';
    const ExternalNonChargeable = 'ExternalNonChargeable';
    const ExternalChargeableImmediate = 'ExternalChargeableImmediate';
    const Unmapped = 'Unmapped';

}

class FareStatus {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const SameDayStandBy = 'SameDayStandBy';
    const FareOverrideConfirming = 'FareOverrideConfirming';
    const FareOverrideConfirmed = 'FareOverrideConfirmed';
    const Unmapped = 'Unmapped';

}

class FareApplicationType {

    const __default = 'Route';
    const Route = 'Route';
    const Sector = 'Sector';
    const Governing = 'Governing';
    const Unmapped = 'Unmapped';

}

class InboundOutbound {

    const __default = 'None';
    const None = 'None';
    const Inbound = 'Inbound';
    const Outbound = 'Outbound';
    const Both = 'Both';
    const RoundFrom = 'RoundFrom';
    const RoundTo = 'RoundTo';
    const Unmapped = 'Unmapped';

}

class ClassStatus {

    const __default = 'Active';
    const Active = 'Active';
    const InActive = 'InActive';
    const AVSOpen = 'AVSOpen';
    const AVSOnRequest = 'AVSOnRequest';
    const AVSClosed = 'AVSClosed';
    const Unmapped = 'Unmapped';

}

class LegStatus {

    const __default = 'Normal';
    const Normal = 'Normal';
    const Closed = 'Closed';
    const Canceled = 'Canceled';
    const Suspended = 'Suspended';
    const ClosedPending = 'ClosedPending';
    const BlockAllActivities = 'BlockAllActivities';
    const Unmapped = 'Unmapped';

}

class NestType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Net = 'Net';
    const Serial = 'Serial';
    const OneBooking = 'OneBooking';
    const Unmapped = 'Unmapped';

}

class ArrivalStatus {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Cancelled = 'Cancelled';
    const Arrived = 'Arrived';
    const SeeAgent = 'SeeAgent';
    const Delayed = 'Delayed';
    const Unmapped = 'Unmapped';

}

class DepartureStatus {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Cancelled = 'Cancelled';
    const Boarding = 'Boarding';
    const SeeAgent = 'SeeAgent';
    const Delayed = 'Delayed';
    const Departed = 'Departed';
    const Unmapped = 'Unmapped';

}

class BaggageStatus {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Checked = 'Checked';
    const Removed = 'Removed';
    const Added = 'Added';
    const Unmapped = 'Unmapped';

}

class SeatPreference {

    const __default = 'None';
    const None = 'None';
    const Window = 'Window';
    const Aisle = 'Aisle';
    const NoPreference = 'NoPreference';
    const Front = 'Front';
    const Rear = 'Rear';
    const WindowFront = 'WindowFront';
    const WindowRear = 'WindowRear';
    const AisleFront = 'AisleFront';
    const AisleRear = 'AisleRear';
    const Unmapped = 'Unmapped';

}

class LiftStatus {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const CheckedIn = 'CheckedIn';
    const Boarded = 'Boarded';
    const NoShow = 'NoShow';
    const Unmapped = 'Unmapped';

}

class TripType {

    const __default = 'None';
    const None = 'None';
    const OneWay = 'OneWay';
    const RoundTrip = 'RoundTrip';
    const HalfRound = 'HalfRound';
    const OpenJaw = 'OpenJaw';
    const CircleTrip = 'CircleTrip';
    const All = 'All';
    const Unmapped = 'Unmapped';

}

class WeightType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Pounds = 'Pounds';
    const Kilograms = 'Kilograms';
    const Unmapped = 'Unmapped';

}

class ChannelType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Direct = 'Direct';
    const Web = 'Web';
    const GDS = 'GDS';
    const API = 'API';
    const Unmapped = 'Unmapped';

}

class MovePassengerJourneyType {

    const __default = 'None';
    const None = 'None';
    const IROP = 'IROP';
    const Diversion = 'Diversion';
    const FlightClose = 'FlightClose';
    const FlyAhead = 'FlyAhead';
    const Unmapped = 'Unmapped';

}

class IgnoreLiftStatus {

    const __default = 'IgnoreNotAllowed';
    const IgnoreNotAllowed = 'IgnoreNotAllowed';
    const IgnoreCheckin = 'IgnoreCheckin';
    const IgnoreBoarded = 'IgnoreBoarded';
    const Unmapped = 'Unmapped';

}

class SeatAvailability {

    const __default = 'Unknown';
    const Unknown = 'Unknown';
    const Reserved = 'Reserved';
    const Blocked = 'Blocked';
    const HeldForAnotherSession = 'HeldForAnotherSession';
    const HeldForThisSession = 'HeldForThisSession';
    const Open = 'Open';
    const Missing = 'Missing';
    const NotVisible = 'NotVisible';
    const CheckedIn = 'CheckedIn';
    const FleetBlocked = 'FleetBlocked';
    const Restricted = 'Restricted';
    const Broken = 'Broken';
    const ReservedForPNR = 'ReservedForPNR';
    const Unmapped = 'Unmapped';

}

class EquipmentCategory {

    const __default = 'None';
    const None = 'None';
    const JetAircraft = 'JetAircraft';
    const PistonAircraft = 'PistonAircraft';
    const TurbopropAircraft = 'TurbopropAircraft';
    const Helicopter = 'Helicopter';
    const Surface = 'Surface';
    const Train = 'Train';
    const Bus = 'Bus';
    const AllCategories = 'AllCategories';
    const Unmapped = 'Unmapped';

}

class BookingStatus {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Hold = 'Hold';
    const Confirmed = 'Confirmed';
    const Closed = 'Closed';
    const HoldCanceled = 'HoldCanceled';
    const PendingArchive = 'PendingArchive';
    const Archived = 'Archived';
    const Unmapped = 'Unmapped';

}

class PriceStatus {

    const __default = 'Invalid';
    const Invalid = 'Invalid';
    const Override = 'Override';
    const Valid = 'Valid';
    const Unmapped = 'Unmapped';

}

class BookingProfileStatus {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const KnownIndividual = 'KnownIndividual';
    const ResolutionGroup = 'ResolutionGroup';
    const SelecteeGroup = 'SelecteeGroup';
    const NotUsed = 'NotUsed';
    const FailureGroup = 'FailureGroup';
    const RandomSelectee = 'RandomSelectee';
    const Exempt = 'Exempt';
    const Unmapped = 'Unmapped';

}

class PaidStatus {

    const __default = 'UnderPaid';
    const UnderPaid = 'UnderPaid';
    const PaidInFull = 'PaidInFull';
    const OverPaid = 'OverPaid';
    const Unmapped = 'Unmapped';

}

class Gender {

    const __default = 'Male';
    const Male = 'Male';
    const Female = 'Female';
    const Unmapped = 'Unmapped';

}

class WeightCategory {

    const __default = 'Male';
    const Male = 'Male';
    const Female = 'Female';
    const Child = 'Child';
    const Unmapped = 'Unmapped';

}

class CommentType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Itinerary = 'Itinerary';
    const Manifest = 'Manifest';
    const Alert = 'Alert';
    const Archive = 'Archive';
    const Unmapped = 'Unmapped';

}

class QueueEventType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const BookingBalanceDue = 'BookingBalanceDue';
    const BookingNegativeBalance = 'BookingNegativeBalance';
    const BookingCustomerComment = 'BookingCustomerComment';
    const DeclinedPaymentInitial = 'DeclinedPaymentInitial';
    const DeclinedPaymentChange = 'DeclinedPaymentChange';
    const FareOverride = 'FareOverride';
    const ScheduleTimeChange = 'ScheduleTimeChange';
    const ScheduleTimeChangeMisconnect = 'ScheduleTimeChangeMisconnect';
    const ScheduleCancellation = 'ScheduleCancellation';
    const FlightDesignatorChange = 'FlightDesignatorChange';
    const ReaccommodationMove = 'ReaccommodationMove';
    const GDSCancelWithPendingPayment = 'GDSCancelWithPendingPayment';
    const InvalidPriceStatusOverride = 'InvalidPriceStatusOverride';
    const FareRestrictionOverride = 'FareRestrictionOverride';
    const HeldBookings = 'HeldBookings';
    const InvalidPriceStatus = 'InvalidPriceStatus';
    const Watchlist = 'Watchlist';
    const NonFlightServiceFee = 'NonFlightServiceFee';
    const NotAllTicketNumbersReceived = 'NotAllTicketNumbersReceived';
    const BookingSegmentOversold = 'BookingSegmentOversold';
    const ReaccommodationCancel = 'ReaccommodationCancel';
    const ExternalSSRAutoConfirmed = 'ExternalSSRAutoConfirmed';
    const OpCarrierSegUpdate = 'OpCarrierSegUpdate';
    const OpCarrierSSRUpdate = 'OpCarrierSSRUpdate';
    const OpCarrierOtherUpdate = 'OpCarrierOtherUpdate';
    const NameChangeNotAllowed = 'NameChangeNotAllowed';
    const InboundASCNotProcessed = 'InboundASCNotProcessed';
    const OpCarrierInformationChange = 'OpCarrierInformationChange';
    const BookingComponentUpdate = 'BookingComponentUpdate';
    const GroupBookings = 'GroupBookings';
    const BankDirectPNROutOfBalance = 'BankDirectPNROutOfBalance';
    const NoSeatAssigned = 'NoSeatAssigned';
    const SeatNumberChange = 'SeatNumberChange';
    const SSRNotSupportedOnNewSeat = 'SSRNotSupportedOnNewSeat';
    const FewerSeatPreferencesMetOnNewSeat = 'FewerSeatPreferencesMetOnNewSeat';
    const AOSUnableToConfirmCancel = 'AOSUnableToConfirmCancel';
    const ETicketIssue = 'ETicketIssue';
    const ETicketFollowup = 'ETicketFollowup';
    const InvoluntaryFlyAhead = 'InvoluntaryFlyAhead';
    const ManualClearanceOnOutage = 'ManualClearanceOnOutage';
    const UnbalancedPoints = 'UnbalancedPoints';
    const VoluntaryFlightChange = 'VoluntaryFlightChange';
    const InvoluntaryFlightChange = 'InvoluntaryFlightChange';
    const Unmapped = 'Unmapped';

}

class QueueAction {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Warning = 'Warning';
    const Lock = 'Lock';
    const Unmapped = 'Unmapped';

}

class QueueMode {

    const __default = 'EnQueued';
    const EnQueued = 'EnQueued';
    const DeQueued = 'DeQueued';
    const Unmapped = 'Unmapped';

}

class DistributionOption {

    const __default = 'None';
    const None = 'None';
    const Mail = 'Mail';
    const Email = 'Email';
    const Fax = 'Fax';
    const MailFax = 'MailFax';
    const Airport = 'Airport';
    const Hold = 'Hold';
    const aPrint = 'Print';
    const Unmapped = 'Unmapped';

}

class NotificationPreference {

    const __default = 'None';
    const None = 'None';
    const Promotional = 'Promotional';
    const Unmapped = 'Unmapped';

}

class PaymentReferenceType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Booking = 'Booking';
    const Session = 'Session';
    const Unmapped = 'Unmapped';

}

class PaymentMethodType {

    const __default = 'PrePaid';
    const PrePaid = 'PrePaid';
    const ExternalAccount = 'ExternalAccount';
    const AgencyAccount = 'AgencyAccount';
    const CustomerAccount = 'CustomerAccount';
    const Voucher = 'Voucher';
    const Loyalty = 'Loyalty';
    const Unmapped = 'Unmapped';

}

class BookingPaymentStatus {

    const __default = 'aNew';
    const aNew = 'New';
    const Received = 'Received';
    const Pending = 'Pending';
    const Approved = 'Approved';
    const Declined = 'Declined';
    const Unknown = 'Unknown';
    const PendingCustomerAction = 'PendingCustomerAction';
    const Unmapped = 'Unmapped';

}

class AuthorizationStatus {

    const __default = 'Unknown';
    const Unknown = 'Unknown';
    const Acknowledged = 'Acknowledged';
    const Pending = 'Pending';
    const InProcess = 'InProcess';
    const Approved = 'Approved';
    const Declined = 'Declined';
    const Referral = 'Referral';
    const PickUpCard = 'PickUpCard';
    const HotCard = 'HotCard';
    const Voided = 'Voided';
    const Retrieval = 'Retrieval';
    const ChargedBack = 'ChargedBack';
    const Error = 'Error';
    const ValidationFailed = 'ValidationFailed';
    const Address = 'Address';
    const VerificationCode = 'VerificationCode';
    const FraudPrevention = 'FraudPrevention';
    const Unmapped = 'Unmapped';

}

class DCCStatus {

    const __default = 'DCCNotOffered';
    const DCCNotOffered = 'DCCNotOffered';
    const DCCOfferRejected = 'DCCOfferRejected';
    const DCCOfferAccepted = 'DCCOfferAccepted';
    const DCCInitialValue = 'DCCInitialValue';
    const MCCInUse = 'MCCInUse';
    const Unmapped = 'Unmapped';

}

class ParticipantDataUseStatus {

    const __default = 'Prompt';
    const Prompt = 'Prompt';
    const DoNotPrompt = 'DoNotPrompt';
    const Required = 'Required';
    const Unmapped = 'Unmapped';

}

class AOSFeeType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Tax = 'Tax';
    const Markup = 'Markup';
    const Discount = 'Discount';
    const Unmapped = 'Unmapped';

}

class PaymentOptions {

    const __default = 'SellingSystemCollects';
    const SellingSystemCollects = 'SellingSystemCollects';
    const PassThroughHold = 'PassThroughHold';
    const NoPaymentRequired = 'NoPaymentRequired';
    const ReferToSupplierMessage = 'ReferToSupplierMessage';
    const PassThroughCharge = 'PassThroughCharge';
    const Unmapped = 'Unmapped';

}

class PricingType {

    const __default = 'Route';
    const Route = 'Route';
    const RouteAndSector = 'RouteAndSector';
    const UseSystemSetting = 'UseSystemSetting';
    const Unmapped = 'Unmapped';

}

class BookingBy {

    const __default = 'RecordLocator';
    const RecordLocator = 'RecordLocator';
    const ID = 'ID';

}

class FlightType {

    const __default = 'None';
    const None = 'None';
    const NonStop = 'NonStop';
    const Through = 'Through';
    const Direct = 'Direct';
    const Connect = 'Connect';
    const All = 'All';
    const Unmapped = 'Unmapped';

}

class DOW {

    const __default = 'None';
    const None = 'None';
    const Monday = 'Monday';
    const Tuesday = 'Tuesday';
    const Wednesday = 'Wednesday';
    const Thursday = 'Thursday';
    const Friday = 'Friday';
    const WeekDay = 'WeekDay';
    const Saturday = 'Saturday';
    const Sunday = 'Sunday';
    const WeekEnd = 'WeekEnd';
    const Daily = 'Daily';
    const Unmapped = 'Unmapped';

}

class AvailabilityType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Standby = 'Standby';
    const Overbook = 'Overbook';
    const NoPricing = 'NoPricing';
    const Unmapped = 'Unmapped';

}

class AvailabilityFilter {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const ExcludeDeparted = 'ExcludeDeparted';
    const ExcludeImminent = 'ExcludeImminent';
    const ExcludeUnavailable = 'ExcludeUnavailable';
    const Unmapped = 'Unmapped';

}

class FareClassControl {

    const __default = 'LowestFareClass';
    const LowestFareClass = 'LowestFareClass';
    const CompressByProductClass = 'CompressByProductClass';
    const aDefault = 'Default';
    const Unmapped = 'Unmapped';

}

class SSRCollectionsMode {

    const __default = 'None';
    const None = 'None';
    const Leg = 'Leg';
    const Segment = 'Segment';
    const All = 'All';
    const Unmapped = 'Unmapped';

}

class JourneySortKey {

    const __default = 'ServiceType';
    const ServiceType = 'ServiceType';
    const ShortestTravelTime = 'ShortestTravelTime';
    const LowestFare = 'LowestFare';
    const HighestFare = 'HighestFare';
    const EarliestDeparture = 'EarliestDeparture';
    const LatestDeparture = 'LatestDeparture';
    const EarliestArrival = 'EarliestArrival';
    const LatestArrival = 'LatestArrival';
    const NoSort = 'NoSort';
    const Unmapped = 'Unmapped';

}

class FareRuleFilter {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const TripPlanner = 'TripPlanner';
    const Unmapped = 'Unmapped';

}

class FlyAheadOfferStatus {

    const __default = 'None';
    const None = 'None';
    const Involuntary = 'Involuntary';
    const Voluntary = 'Voluntary';
    const DisabledIfFirstLeg = 'DisabledIfFirstLeg';
    const Unmapped = 'Unmapped';

}

class FindBookingBy {

    const __default = 'RecordLocator';
    const RecordLocator = 'RecordLocator';
    const Contact = 'Contact';
    const ThirdPartyRecordLocator = 'ThirdPartyRecordLocator';
    const Name = 'Name';
    const AgentID = 'AgentID';
    const AgentName = 'AgentName';
    const AgencyNumber = 'AgencyNumber';
    const EmailAddress = 'EmailAddress';
    const PhoneNumber = 'PhoneNumber';
    const CreditCardNumber = 'CreditCardNumber';
    const CustomerNumber = 'CustomerNumber';
    const ContactCustomerNumber = 'ContactCustomerNumber';
    const Customer = 'Customer';
    const OSTag = 'OSTag';
    const TravelDocument = 'TravelDocument';
    const BookingDate = 'BookingDate';

}

class GetBookingBy {

    const __default = 'RecordLocator';
    const RecordLocator = 'RecordLocator';
    const ThirdPartyRecordLocator = 'ThirdPartyRecordLocator';
    const ID = 'ID';

}

class CancelBy {

    const __default = 'Journey';
    const Journey = 'Journey';
    const Fee = 'Fee';
    const SSR = 'SSR';
    const All = 'All';

}

class DivideAction {

    const __default = 'Divide';
    const Divide = 'Divide';
    const DivideAndCancel = 'DivideAndCancel';

}

class RequestPaymentMethodType {

    const __default = 'PrePaid';
    const PrePaid = 'PrePaid';
    const ExternalAccount = 'ExternalAccount';
    const AgencyAccount = 'AgencyAccount';
    const CreditShell = 'CreditShell';
    const CreditFile = 'CreditFile';
    const Voucher = 'Voucher';
    const Loyalty = 'Loyalty';
    const Unmapped = 'Unmapped';

}

class PaymentValidationErrorType {

    const __default = 'Unknown';
    const Unknown = 'Unknown';
    const Other = 'Other';
    const AccountNumber = 'AccountNumber';
    const Amount = 'Amount';
    const ExpirationDate = 'ExpirationDate';
    const RestrictionHours = 'RestrictionHours';
    const MissingAccountNumber = 'MissingAccountNumber';
    const MissingExpirationDate = 'MissingExpirationDate';
    const PaymentSystemUnavailable = 'PaymentSystemUnavailable';
    const MissingParentPaymentID = 'MissingParentPaymentID';
    const InProcessPaymentChanged = 'InProcessPaymentChanged';
    const InvalidNumberOfInstallments = 'InvalidNumberOfInstallments';
    const CreditShellCommentRequired = 'CreditShellCommentRequired';
    const NoQuotedCurrencyProvided = 'NoQuotedCurrencyProvided';
    const NoBaseCurrencyForBooking = 'NoBaseCurrencyForBooking';
    const QuotedCurrencyDoesNotMatchBaseCurrency = 'QuotedCurrencyDoesNotMatchBaseCurrency';
    const QuotedRefundAmountNotLessThanZero = 'QuotedRefundAmountNotLessThanZero';
    const QuotedPaymentAmountIsLessThanZero = 'QuotedPaymentAmountIsLessThanZero';
    const RoleCodeNotFound = 'RoleCodeNotFound';
    const UnknownOrInactivePaymentMethod = 'UnknownOrInactivePaymentMethod';
    const DepositPaymentsNotAllowedForPaymentMethod = 'DepositPaymentsNotAllowedForPaymentMethod';
    const UnableToRetrieveRoleCodeSettings = 'UnableToRetrieveRoleCodeSettings';
    const DepositPaymentsNotAllowedForRole = 'DepositPaymentsNotAllowedForRole';
    const PaymentMethodNotAllowedForRole = 'PaymentMethodNotAllowedForRole';
    const InvalidAccountNumberLength = 'InvalidAccountNumberLength';
    const PaymentTextIsRequired = 'PaymentTextIsRequired';
    const InvalidPaymentTextLength = 'InvalidPaymentTextLength';
    const InvalidMiscPaymentFieldLength = 'InvalidMiscPaymentFieldLength';
    const MiscPaymentFieldRequired = 'MiscPaymentFieldRequired';
    const BookingCurrencyIsInvalidForSkyPay = 'BookingCurrencyIsInvalidForSkyPay';
    const SkyPayExceptionThrown = 'SkyPayExceptionThrown';
    const InvalidAccountNumberForPaymentMethod = 'InvalidAccountNumberForPaymentMethod';
    const InvalidELVTransaction = 'InvalidELVTransaction';
    const BlackListedCard = 'BlackListedCard';
    const InvalidPaymentAddress = 'InvalidPaymentAddress';
    const InvalidSecurityCode = 'InvalidSecurityCode';
    const InvalidCurrencyCode = 'InvalidCurrencyCode';
    const InvalidAmount = 'InvalidAmount';
    const PossibleFraud = 'PossibleFraud';
    const InvalidCustomerAccount = 'InvalidCustomerAccount';
    const AccountHolderIsNotAnAgency = 'AccountHolderIsNotAnAgency';
    const InvalidStartDate = 'InvalidStartDate';
    const InvalidInitialPaymentStatus = 'InvalidInitialPaymentStatus';
    const PaymentCurrencyMustMatchBookingCurrency = 'PaymentCurrencyMustMatchBookingCurrency';
    const CollectedAmountMustMatchPaymentAmount = 'CollectedAmountMustMatchPaymentAmount';
    const RefundsNotAllowedUsingThisPaymentMethod = 'RefundsNotAllowedUsingThisPaymentMethod';
    const CreditShellAmountGreaterThanOrEqualToZero = 'CreditShellAmountGreaterThanOrEqualToZero';
    const CreditFileAmountLessThanOrEqualToZero = 'CreditFileAmountLessThanOrEqualToZero';
    const InvalidPrepaidApprovalCodeLength = 'InvalidPrepaidApprovalCodeLength';
    const AccountNumberFailedModulousCheck = 'AccountNumberFailedModulousCheck';
    const NoExternalRatesAvailable = 'NoExternalRatesAvailable';
    const ExternalCurrencyConversion = 'ExternalCurrencyConversion';
    const StoredCardSecurityViolation = 'StoredCardSecurityViolation';
    const Unmapped = 'Unmapped';

}

class SeatAssignmentMode {

    const __default = 'AutoDetermine';
    const AutoDetermine = 'AutoDetermine';
    const PreSeatAssignment = 'PreSeatAssignment';
    const WebCheckIn = 'WebCheckIn';
    const Unmapped = 'Unmapped';

}

class UnitHoldType {

    const __default = 'Session';
    const Session = 'Session';
    const Blocked = 'Blocked';
    const Broken = 'Broken';
    const None = 'None';
    const Unmapped = 'Unmapped';

}

class PriceItineraryBy {

    const __default = 'JourneyBySellKey';
    const JourneyBySellKey = 'JourneyBySellKey';
    const JourneyWithLegs = 'JourneyWithLegs';

}

class SellBy {

    const __default = 'JourneyBySellKey';
    const JourneyBySellKey = 'JourneyBySellKey';
    const Journey = 'Journey';
    const SSR = 'SSR';
    const Fee = 'Fee';

}

class SellFeeType {

    const __default = 'ServiceFee';
    const ServiceFee = 'ServiceFee';
    const PenaltyFee = 'PenaltyFee';
    const Unmapped = 'Unmapped';

}

class FlightDesignator {

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $FlightNumber
     * @access public
     */
    public $FlightNumber = null;

    /**
     *
     * @var string $OpSuffix
     * @access public
     */
    public $OpSuffix = null;

}

class StateMessage {

    /**
     *
     * @var MessageState $State
     * @access public
     */
    public $State = null;

    public function __construct($State = MessageState::aNew) {
        $this->State = $State;
    }

}

class OtherServiceInformation {

    /**
     *
     * @var string $Text
     * @access public
     */
    public $Text = null;

    /**
     *
     * @var OSISeverity $OsiSeverity
     * @access public
     */
    public $OsiSeverity = null;

    /**
     *
     * @var string $OSITypeCode
     * @access public
     */
    public $OSITypeCode = null;

    /**
     *
     * @var string $SubType
     * @access public
     */
    public $SubType = null;

}

class PointOfSale extends StateMessage {

    /**
     *
     * @var string $AgentCode
     * @access public
     */
    public $AgentCode = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var string $DomainCode
     * @access public
     */
    public $DomainCode = null;

    /**
     *
     * @var string $LocationCode
     * @access public
     */
    public $LocationCode = null;

}

class RecordLocator extends StateMessage {

    /**
     *
     * @var string $SystemDomainCode
     * @access public
     */
    public $SystemDomainCode = null;

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @var string $RecordCode
     * @access public
     */
    public $RecordCode = null;

    /**
     *
     * @var string $InteractionPurpose
     * @access public
     */
    public $InteractionPurpose = null;

    /**
     *
     * @var string $HostedCarrierCode
     * @access public
     */
    public $HostedCarrierCode = null;

}

class TCOrderItem extends TCResponse {

    /**
     *
     * @var OrderPayment $Payment
     * @access public
     */
    public $Payment = null;

    /**
     *
     * @var string $CRL
     * @access public
     */
    public $CRL = null;

    /**
     *
     * @var string $SupplierCode
     * @access public
     */
    public $SupplierCode = null;

    /**
     *
     * @var string $CorpDiscountCode
     * @access public
     */
    public $CorpDiscountCode = null;

    /**
     *
     * @var int $RuleSetID
     * @access public
     */
    public $RuleSetID = null;

    /**
     *
     * @var string $RatingCode
     * @access public
     */
    public $RatingCode = null;

    /**
     *
     * @var string $DepartmentCode
     * @access public
     */
    public $DepartmentCode = null;

    /**
     *
     * @var boolean $AllowsSku
     * @access public
     */
    public $AllowsSku = null;

    /**
     *
     * @var boolean $AllowsGiftWrap
     * @access public
     */
    public $AllowsGiftWrap = null;

    /**
     *
     * @var float $BasePrice
     * @access public
     */
    public $BasePrice = null;

    /**
     *
     * @var float $PreTaxTotalNow
     * @access public
     */
    public $PreTaxTotalNow = null;

    /**
     *
     * @var float $PreTaxTotalLater
     * @access public
     */
    public $PreTaxTotalLater = null;

    /**
     *
     * @var float $TaxTotalLater
     * @access public
     */
    public $TaxTotalLater = null;

    /**
     *
     * @var float $TaxTotalNow
     * @access public
     */
    public $TaxTotalNow = null;

    /**
     *
     * @var float $TotalLater
     * @access public
     */
    public $TotalLater = null;

    /**
     *
     * @var float $TotalNow
     * @access public
     */
    public $TotalNow = null;

    /**
     *
     * @var float $BasePriceTotal
     * @access public
     */
    public $BasePriceTotal = null;

    /**
     *
     * @var string $DescriptionLong
     * @access public
     */
    public $DescriptionLong = null;

    /**
     *
     * @var float $DisplayPrice
     * @access public
     */
    public $DisplayPrice = null;

    /**
     *
     * @var float $DisplayPriceTotal
     * @access public
     */
    public $DisplayPriceTotal = null;

    /**
     *
     * @var string $ThumbFilename
     * @access public
     */
    public $ThumbFilename = null;

    /**
     *
     * @var float $MarkupAmount
     * @access public
     */
    public $MarkupAmount = null;

    /**
     *
     * @var float $MarkupAmountTotal
     * @access public
     */
    public $MarkupAmountTotal = null;

    /**
     *
     * @var boolean $NewFlag
     * @access public
     */
    public $NewFlag = null;

    /**
     *
     * @var boolean $ActiveStatus
     * @access public
     */
    public $ActiveStatus = null;

    /**
     *
     * @var float $FeesTotal
     * @access public
     */
    public $FeesTotal = null;

    /**
     *
     * @var string $Field1
     * @access public
     */
    public $Field1 = null;

    /**
     *
     * @var string $Field2
     * @access public
     */
    public $Field2 = null;

    /**
     *
     * @var string $Field3
     * @access public
     */
    public $Field3 = null;

    /**
     *
     * @var string $Field4
     * @access public
     */
    public $Field4 = null;

    /**
     *
     * @var string $Field5
     * @access public
     */
    public $Field5 = null;

    /**
     *
     * @var dateTime $SkuExpectedDate
     * @access public
     */
    public $SkuExpectedDate = null;

    /**
     *
     * @var string $OrderId
     * @access public
     */
    public $OrderId = null;

    /**
     *
     * @var int $ItemSequence
     * @access public
     */
    public $ItemSequence = null;

    /**
     *
     * @var string $CatalogCode
     * @access public
     */
    public $CatalogCode = null;

    /**
     *
     * @var string $VendorCode
     * @access public
     */
    public $VendorCode = null;

    /**
     *
     * @var string $CategoryCode
     * @access public
     */
    public $CategoryCode = null;

    /**
     *
     * @var string $ItemTypeCode
     * @access public
     */
    public $ItemTypeCode = null;

    /**
     *
     * @var string $ItemId
     * @access public
     */
    public $ItemId = null;

    /**
     *
     * @var int $SkuId
     * @access public
     */
    public $SkuId = null;

    /**
     *
     * @var boolean $IsDueNow
     * @access public
     */
    public $IsDueNow = null;

    /**
     *
     * @var string $ExternalSkuId
     * @access public
     */
    public $ExternalSkuId = null;

    /**
     *
     * @var string $ExternalSkuCatalogId
     * @access public
     */
    public $ExternalSkuCatalogId = null;

    /**
     *
     * @var dateTime $PurchaseDate
     * @access public
     */
    public $PurchaseDate = null;

    /**
     *
     * @var dateTime $UsageDate
     * @access public
     */
    public $UsageDate = null;

    /**
     *
     * @var string $ItemDescription
     * @access public
     */
    public $ItemDescription = null;

    /**
     *
     * @var string $SkuDescription
     * @access public
     */
    public $SkuDescription = null;

    /**
     *
     * @var boolean $GiftWrapped
     * @access public
     */
    public $GiftWrapped = null;

    /**
     *
     * @var string $GiftWrapMessage
     * @access public
     */
    public $GiftWrapMessage = null;

    /**
     *
     * @var string $RoleCodeSupplierPortal
     * @access public
     */
    public $RoleCodeSupplierPortal = null;

    /**
     *
     * @var TCWarning[] $WarningList
     * @access public
     */
    public $WarningList = null;

    /**
     *
     * @var TermsConditions[] $TermsConditionsList
     * @access public
     */
    public $TermsConditionsList = null;

    /**
     *
     * @var TermsConditions[] $CancellationPolicies
     * @access public
     */
    public $CancellationPolicies = null;

    /**
     *
     * @var Participant[] $ParticipantList
     * @access public
     */
    public $ParticipantList = null;

    /**
     *
     * @var OrderCustomer $OrderCustomer
     * @access public
     */
    public $OrderCustomer = null;

    /**
     *
     * @var boolean $TaxExempt
     * @access public
     */
    public $TaxExempt = null;

    /**
     *
     * @var string $OrderItemStatusCode
     * @access public
     */
    public $OrderItemStatusCode = null;

    /**
     *
     * @var boolean $TaxAtUnitPrice
     * @access public
     */
    public $TaxAtUnitPrice = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var string $PromoCode
     * @access public
     */
    public $PromoCode = null;

    /**
     *
     * @var string $SourceCode
     * @access public
     */
    public $SourceCode = null;

    /**
     *
     * @var string $ContentType
     * @access public
     */
    public $ContentType = null;

    /**
     *
     * @var int $Quantity
     * @access public
     */
    public $Quantity = null;

    /**
     *
     * @var float $ListPrice
     * @access public
     */
    public $ListPrice = null;

    /**
     *
     * @var float $ListPriceTotal
     * @access public
     */
    public $ListPriceTotal = null;

    /**
     *
     * @var float $DiscountAmount
     * @access public
     */
    public $DiscountAmount = null;

    /**
     *
     * @var float $DiscountAmountTotal
     * @access public
     */
    public $DiscountAmountTotal = null;

    /**
     *
     * @var float $PersonalizationPriceTotal
     * @access public
     */
    public $PersonalizationPriceTotal = null;

    /**
     *
     * @var float $HandlingCharge
     * @access public
     */
    public $HandlingCharge = null;

    /**
     *
     * @var float $HandlingChargeTotal
     * @access public
     */
    public $HandlingChargeTotal = null;

    /**
     *
     * @var float $HandlingDiscount
     * @access public
     */
    public $HandlingDiscount = null;

    /**
     *
     * @var float $HandlingDiscountTotal
     * @access public
     */
    public $HandlingDiscountTotal = null;

    /**
     *
     * @var float $DiscountedHandlingChargeTotal
     * @access public
     */
    public $DiscountedHandlingChargeTotal = null;

    /**
     *
     * @var float $DiscountedListPrice
     * @access public
     */
    public $DiscountedListPrice = null;

    /**
     *
     * @var float $DiscountedListPriceTotal
     * @access public
     */
    public $DiscountedListPriceTotal = null;

    /**
     *
     * @var float $TaxableTotal
     * @access public
     */
    public $TaxableTotal = null;

    /**
     *
     * @var int $TaxRate
     * @access public
     */
    public $TaxRate = null;

    /**
     *
     * @var float $ServicesTotal
     * @access public
     */
    public $ServicesTotal = null;

    /**
     *
     * @var float $Total
     * @access public
     */
    public $Total = null;

    /**
     *
     * @var OrderHandling $OrderHandling
     * @access public
     */
    public $OrderHandling = null;

    /**
     *
     * @var OrderItemAddress $OrderItemAddress
     * @access public
     */
    public $OrderItemAddress = null;

    /**
     *
     * @var OrderItemPersonalization[] $OrderItemPersonalizationList
     * @access public
     */
    public $OrderItemPersonalizationList = null;

    /**
     *
     * @var OrderItemSkuDetail[] $OrderItemSkuDetailValueList
     * @access public
     */
    public $OrderItemSkuDetailValueList = null;

    /**
     *
     * @var OrderItemNote[] $OrderItemNoteList
     * @access public
     */
    public $OrderItemNoteList = null;

    /**
     *
     * @var OrderItemLocator[] $OrderItemLocatorList
     * @access public
     */
    public $OrderItemLocatorList = null;

    /**
     *
     * @var Fee[] $OrderItemFeeList
     * @access public
     */
    public $OrderItemFeeList = null;

    /**
     *
     * @var OrderItemLocation[] $OrderItemLocationList
     * @access public
     */
    public $OrderItemLocationList = null;

    /**
     *
     * @var OrderItemParameter[] $OrderItemParameterList
     * @access public
     */
    public $OrderItemParameterList = null;

    /**
     *
     * @var OrderItemStatusHistory[] $OrderItemStatusHistoryList
     * @access public
     */
    public $OrderItemStatusHistoryList = null;

    /**
     *
     * @var PaymentOptions $PaymentOption
     * @access public
     */
    public $PaymentOption = null;

    /**
     *
     * @var int[] $OrderItemOrderPaymentList
     * @access public
     */
    public $OrderItemOrderPaymentList = null;

    /**
     *
     * @var OrderItemElement[] $OrderItemElementList
     * @access public
     */
    public $OrderItemElementList = null;

    /**
     *
     * @var string $CancellationNumber
     * @access public
     */
    public $CancellationNumber = null;

    /**
     *
     * @var dateTime $CancellationDate
     * @access public
     */
    public $CancellationDate = null;

    /**
     *
     * @var string $ComparisonKey
     * @access public
     */
    public $ComparisonKey = null;

}

class TCResponse {

    /**
     *
     * @var string $CompanyCode
     * @access public
     */
    public $CompanyCode = null;

    /**
     *
     * @var string $XML
     * @access public
     */
    public $XML = null;

}

class OrderPayment {

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var string $ForeignCurrencyCode
     * @access public
     */
    public $ForeignCurrencyCode = null;

    /**
     *
     * @var string $CultureCode
     * @access public
     */
    public $CultureCode = null;

    /**
     *
     * @var int $PaymentSequence
     * @access public
     */
    public $PaymentSequence = null;

    /**
     *
     * @var string $PaymentTypeCode
     * @access public
     */
    public $PaymentTypeCode = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var string $CCName
     * @access public
     */
    public $CCName = null;

    /**
     *
     * @var string $CCNumber
     * @access public
     */
    public $CCNumber = null;

    /**
     *
     * @var int $AccountNumberID
     * @access public
     */
    public $AccountNumberID = null;

    /**
     *
     * @var string $CCExpiration
     * @access public
     */
    public $CCExpiration = null;

    /**
     *
     * @var string $CCCvv
     * @access public
     */
    public $CCCvv = null;

    /**
     *
     * @var float $Amount
     * @access public
     */
    public $Amount = null;

    /**
     *
     * @var float $ForeignAmount
     * @access public
     */
    public $ForeignAmount = null;

    /**
     *
     * @var string $IssueNumber
     * @access public
     */
    public $IssueNumber = null;

}

class TCWarning {

    /**
     *
     * @var string $WarningCode
     * @access public
     */
    public $WarningCode = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var string $WarningText
     * @access public
     */
    public $WarningText = null;

}

class TermsConditions {

    /**
     *
     * @var string $TermsConditionsCode
     * @access public
     */
    public $TermsConditionsCode = null;

    /**
     *
     * @var string $CultureCode
     * @access public
     */
    public $CultureCode = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var string $Terms
     * @access public
     */
    public $Terms = null;

    /**
     *
     * @var int $DisplaySequence
     * @access public
     */
    public $DisplaySequence = null;

}

class Participant {

    /**
     *
     * @var string $ParticipantId
     * @access public
     */
    public $ParticipantId = null;

    /**
     *
     * @var int $ParticipantSequence
     * @access public
     */
    public $ParticipantSequence = null;

    /**
     *
     * @var boolean $PrimaryFlag
     * @access public
     */
    public $PrimaryFlag = null;

    /**
     *
     * @var RequestedFieldOfstring $DocNumber
     * @access public
     */
    public $DocNumber = null;

    /**
     *
     * @var RequestedFieldOfstring $DocIssuedBy
     * @access public
     */
    public $DocIssuedBy = null;

    /**
     *
     * @var RequestedFieldOfstring $DocTypeCode
     * @access public
     */
    public $DocTypeCode = null;

    /**
     *
     * @var RequestedFieldOfstring $Title
     * @access public
     */
    public $Title = null;

    /**
     *
     * @var RequestedFieldOfstring $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var RequestedFieldOfstring $MiddleName
     * @access public
     */
    public $MiddleName = null;

    /**
     *
     * @var RequestedFieldOfstring $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var RequestedFieldOfstring $Address1
     * @access public
     */
    public $Address1 = null;

    /**
     *
     * @var RequestedFieldOfstring $Address2
     * @access public
     */
    public $Address2 = null;

    /**
     *
     * @var RequestedFieldOfstring $City
     * @access public
     */
    public $City = null;

    /**
     *
     * @var RequestedFieldOfstring $StateCode
     * @access public
     */
    public $StateCode = null;

    /**
     *
     * @var RequestedFieldOfstring $ZipCode
     * @access public
     */
    public $ZipCode = null;

    /**
     *
     * @var RequestedFieldOfstring $County
     * @access public
     */
    public $County = null;

    /**
     *
     * @var RequestedFieldOfstring $CountryCode
     * @access public
     */
    public $CountryCode = null;

    /**
     *
     * @var RequestedFieldOfstring $PhoneHome
     * @access public
     */
    public $PhoneHome = null;

    /**
     *
     * @var RequestedFieldOfstring $BusOrRes
     * @access public
     */
    public $BusOrRes = null;

    /**
     *
     * @var RequestedFieldOfstring $PhoneFax
     * @access public
     */
    public $PhoneFax = null;

    /**
     *
     * @var RequestedFieldOfstring $PhoneWork
     * @access public
     */
    public $PhoneWork = null;

    /**
     *
     * @var RequestedFieldOfstring $EmailAddress
     * @access public
     */
    public $EmailAddress = null;

    /**
     *
     * @var RequestedFieldOfstring $CompanyName
     * @access public
     */
    public $CompanyName = null;

    /**
     *
     * @var RequestedFieldOfdateTime $BirthDate
     * @access public
     */
    public $BirthDate = null;

    /**
     *
     * @var RequestedFieldOfstring $ParticipantTypeCode
     * @access public
     */
    public $ParticipantTypeCode = null;

    /**
     *
     * @var string $ParticipantTypeDescription
     * @access public
     */
    public $ParticipantTypeDescription = null;

}

class RequestedFieldOfstring {

    /**
     *
     * @var string $Data
     * @access public
     */
    public $Data = null;

    /**
     *
     * @var ParticipantDataUseStatus $UseStatus
     * @access public
     */
    public $UseStatus = null;

}

class RequestedFieldOfdateTime {

    /**
     *
     * @var dateTime $Data
     * @access public
     */
    public $Data = null;

    /**
     *
     * @var ParticipantDataUseStatus $UseStatus
     * @access public
     */
    public $UseStatus = null;

}

class OrderCustomer {

    /**
     *
     * @var string $OrderId
     * @access public
     */
    public $OrderId = null;

    /**
     *
     * @var RequestedFieldOfstring $CustomerId
     * @access public
     */
    public $CustomerId = null;

    /**
     *
     * @var RequestedFieldOfstring $Title
     * @access public
     */
    public $Title = null;

    /**
     *
     * @var RequestedFieldOfstring $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var RequestedFieldOfstring $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var RequestedFieldOfstring $MiddleName
     * @access public
     */
    public $MiddleName = null;

    /**
     *
     * @var RequestedFieldOfstring $Address1
     * @access public
     */
    public $Address1 = null;

    /**
     *
     * @var RequestedFieldOfstring $Address2
     * @access public
     */
    public $Address2 = null;

    /**
     *
     * @var RequestedFieldOfstring $City
     * @access public
     */
    public $City = null;

    /**
     *
     * @var RequestedFieldOfstring $StateCode
     * @access public
     */
    public $StateCode = null;

    /**
     *
     * @var RequestedFieldOfstring $County
     * @access public
     */
    public $County = null;

    /**
     *
     * @var RequestedFieldOfstring $CountryCode
     * @access public
     */
    public $CountryCode = null;

    /**
     *
     * @var RequestedFieldOfstring $ZipCode
     * @access public
     */
    public $ZipCode = null;

    /**
     *
     * @var RequestedFieldOfstring $PhoneHome
     * @access public
     */
    public $PhoneHome = null;

    /**
     *
     * @var RequestedFieldOfstring $PhoneFax
     * @access public
     */
    public $PhoneFax = null;

    /**
     *
     * @var RequestedFieldOfstring $PhoneWork
     * @access public
     */
    public $PhoneWork = null;

    /**
     *
     * @var RequestedFieldOfstring $EmailAddress
     * @access public
     */
    public $EmailAddress = null;

    /**
     *
     * @var RequestedFieldOfstring $BusOrRes
     * @access public
     */
    public $BusOrRes = null;

    /**
     *
     * @var RequestedFieldOfstring $CompanyName
     * @access public
     */
    public $CompanyName = null;

    /**
     *
     * @var string $Field1
     * @access public
     */
    public $Field1 = null;

    /**
     *
     * @var string $Field2
     * @access public
     */
    public $Field2 = null;

    /**
     *
     * @var string $Field3
     * @access public
     */
    public $Field3 = null;

    /**
     *
     * @var string $Field4
     * @access public
     */
    public $Field4 = null;

    /**
     *
     * @var string $Field5
     * @access public
     */
    public $Field5 = null;

    /**
     *
     * @var RequestedFieldOfdateTime $BirthDate
     * @access public
     */
    public $BirthDate = null;

}

class OrderHandling {

    /**
     *
     * @var ChargeableItem $HandlingCharge
     * @access public
     */
    public $HandlingCharge = null;

    /**
     *
     * @var OrderDiscount $OrderDiscount
     * @access public
     */
    public $OrderDiscount = null;

}

class ChargeableItem {

    /**
     *
     * @var float $Amount
     * @access public
     */
    public $Amount = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var float $ForeignAmount
     * @access public
     */
    public $ForeignAmount = null;

    /**
     *
     * @var string $ForeignCurrencyCode
     * @access public
     */
    public $ForeignCurrencyCode = null;

    /**
     *
     * @var boolean $IsChargeable
     * @access public
     */
    public $IsChargeable = null;

    /**
     *
     * @var string $Code
     * @access public
     */
    public $Code = null;

    /**
     *
     * @var string $TypeCode
     * @access public
     */
    public $TypeCode = null;

}

class OrderDiscount {

    /**
     *
     * @var ChargeableItem $Discount
     * @access public
     */
    public $Discount = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var DiscountTarget $Target
     * @access public
     */
    public $Target = null;

}

class DiscountTarget {

    /**
     *
     * @var boolean $ListPrice
     * @access public
     */
    public $ListPrice = null;

    /**
     *
     * @var boolean $Fees
     * @access public
     */
    public $Fees = null;

    /**
     *
     * @var boolean $Taxes
     * @access public
     */
    public $Taxes = null;

    /**
     *
     * @var boolean $Personalizations
     * @access public
     */
    public $Personalizations = null;

}

class OrderItemAddress {

    /**
     *
     * @var string $ExternalCountryCode
     * @access public
     */
    public $ExternalCountryCode = null;

    /**
     *
     * @var string $ExternalStateCode
     * @access public
     */
    public $ExternalStateCode = null;

    /**
     *
     * @var float $Longitude
     * @access public
     */
    public $Longitude = null;

    /**
     *
     * @var float $Latitude
     * @access public
     */
    public $Latitude = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var string $CountryCode
     * @access public
     */
    public $CountryCode = null;

    /**
     *
     * @var string $Address1
     * @access public
     */
    public $Address1 = null;

    /**
     *
     * @var string $Address2
     * @access public
     */
    public $Address2 = null;

    /**
     *
     * @var string $City
     * @access public
     */
    public $City = null;

    /**
     *
     * @var string $StateCode
     * @access public
     */
    public $StateCode = null;

    /**
     *
     * @var string $ZipCode
     * @access public
     */
    public $ZipCode = null;

    /**
     *
     * @var string $PhoneHome
     * @access public
     */
    public $PhoneHome = null;

    /**
     *
     * @var string $PhoneFax
     * @access public
     */
    public $PhoneFax = null;

    /**
     *
     * @var string $PhoneWork
     * @access public
     */
    public $PhoneWork = null;

}

class OrderItemPersonalization {

    /**
     *
     * @var boolean $PriceIsValid
     * @access public
     */
    public $PriceIsValid = null;

    /**
     *
     * @var boolean $Required
     * @access public
     */
    public $Required = null;

    /**
     *
     * @var string $PersonalizationCode
     * @access public
     */
    public $PersonalizationCode = null;

    /**
     *
     * @var string $PersonalizationDescription
     * @access public
     */
    public $PersonalizationDescription = null;

    /**
     *
     * @var ChargeableItem $PersonalizationPrice
     * @access public
     */
    public $PersonalizationPrice = null;

    /**
     *
     * @var int $ParentSequence
     * @access public
     */
    public $ParentSequence = null;

    /**
     *
     * @var float $PersonalizationPriceTotal
     * @access public
     */
    public $PersonalizationPriceTotal = null;

    /**
     *
     * @var string $Value
     * @access public
     */
    public $Value = null;

    /**
     *
     * @var int $Quantity
     * @access public
     */
    public $Quantity = null;

}

class OrderItemSkuDetail {

    /**
     *
     * @var string $SkuStyleCode
     * @access public
     */
    public $SkuStyleCode = null;

    /**
     *
     * @var string $SkuDetailCode
     * @access public
     */
    public $SkuDetailCode = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

}

class OrderItemNote {

    /**
     *
     * @var int $NoteSequence
     * @access public
     */
    public $NoteSequence = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var string $NoteText
     * @access public
     */
    public $NoteText = null;

    /**
     *
     * @var dateTime $DateCreated
     * @access public
     */
    public $DateCreated = null;

    /**
     *
     * @var dateTime $DateChanged
     * @access public
     */
    public $DateChanged = null;

}

class OrderItemLocator extends TCResponse {

    /**
     *
     * @var string $OrderId
     * @access public
     */
    public $OrderId = null;

    /**
     *
     * @var int $ItemSequence
     * @access public
     */
    public $ItemSequence = null;

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @var string $Locator
     * @access public
     */
    public $Locator = null;

}

class Fee {

    /**
     *
     * @var int $ParentSequence
     * @access public
     */
    public $ParentSequence = null;

    /**
     *
     * @var int $Sequence
     * @access public
     */
    public $Sequence = null;

    /**
     *
     * @var float $AmountTotal
     * @access public
     */
    public $AmountTotal = null;

    /**
     *
     * @var float $ForeignAmountTotal
     * @access public
     */
    public $ForeignAmountTotal = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var int $RuleSetID
     * @access public
     */
    public $RuleSetID = null;

    /**
     *
     * @var boolean $IsWaivable
     * @access public
     */
    public $IsWaivable = null;

    /**
     *
     * @var AOSFeeType $FeeType
     * @access public
     */
    public $FeeType = null;

    /**
     *
     * @var boolean $FromSku
     * @access public
     */
    public $FromSku = null;

    /**
     *
     * @var float $Amount
     * @access public
     */
    public $Amount = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var float $ForeignAmount
     * @access public
     */
    public $ForeignAmount = null;

    /**
     *
     * @var string $ForeignCurrencyCode
     * @access public
     */
    public $ForeignCurrencyCode = null;

    /**
     *
     * @var boolean $IsChargeable
     * @access public
     */
    public $IsChargeable = null;

    /**
     *
     * @var string $Code
     * @access public
     */
    public $Code = null;

    /**
     *
     * @var string $TypeCode
     * @access public
     */
    public $TypeCode = null;

}

class OrderItemLocation {

    /**
     *
     * @var int $LocationSequence
     * @access public
     */
    public $LocationSequence = null;

    /**
     *
     * @var string $LocationCode
     * @access public
     */
    public $LocationCode = null;

    /**
     *
     * @var string $Description
     * @access public
     */
    public $Description = null;

    /**
     *
     * @var dateTime $UsageDate
     * @access public
     */
    public $UsageDate = null;

    /**
     *
     * @var float $UtcOffset
     * @access public
     */
    public $UtcOffset = null;

}

class OrderItemParameter {

    /**
     *
     * @var string $ParameterCode
     * @access public
     */
    public $ParameterCode = null;

    /**
     *
     * @var string $ParameterDescription
     * @access public
     */
    public $ParameterDescription = null;

    /**
     *
     * @var string $Value
     * @access public
     */
    public $Value = null;

}

class OrderItemStatusHistory {

    /**
     *
     * @var int $HistorySequence
     * @access public
     */
    public $HistorySequence = null;

    /**
     *
     * @var string $OrderStatusCode
     * @access public
     */
    public $OrderStatusCode = null;

    /**
     *
     * @var string $NoteText
     * @access public
     */
    public $NoteText = null;

    /**
     *
     * @var dateTime $DateCreated
     * @access public
     */
    public $DateCreated = null;

    /**
     *
     * @var boolean $HasError
     * @access public
     */
    public $HasError = null;

    /**
     *
     * @var string $PreviousOrderStatusCode
     * @access public
     */
    public $PreviousOrderStatusCode = null;

}

class OrderItemElement {

    /**
     *
     * @var ChargeableItem $BasePrice
     * @access public
     */
    public $BasePrice = null;

    /**
     *
     * @var string $ExternalInventoryId
     * @access public
     */
    public $ExternalInventoryId = null;

    /**
     *
     * @var int $InventoryId
     * @access public
     */
    public $InventoryId = null;

    /**
     *
     * @var int $InventoryQuantity
     * @access public
     */
    public $InventoryQuantity = null;

    /**
     *
     * @var int $ItemSkuCatalogSequence
     * @access public
     */
    public $ItemSkuCatalogSequence = null;

    /**
     *
     * @var OrderDiscount $Discount
     * @access public
     */
    public $Discount = null;

    /**
     *
     * @var ChargeableItem $Markup
     * @access public
     */
    public $Markup = null;

    /**
     *
     * @var ChargeableItem $ItemMarkup
     * @access public
     */
    public $ItemMarkup = null;

    /**
     *
     * @var ChargeableItem $VendorMarkup
     * @access public
     */
    public $VendorMarkup = null;

    /**
     *
     * @var ChargeableItem $RateMarkup
     * @access public
     */
    public $RateMarkup = null;

    /**
     *
     * @var int $SellQuantity
     * @access public
     */
    public $SellQuantity = null;

    /**
     *
     * @var dateTime $UsageDate
     * @access public
     */
    public $UsageDate = null;

}

class KeyValuePairOfstringstring {

    /**
     *
     * @var string $key
     * @access public
     */
    public $key = null;

    /**
     *
     * @var string $value
     * @access public
     */
    public $value = null;

}

class LoyaltyFilter {

    const __default = 'MonetaryOnly';
    const MonetaryOnly = 'MonetaryOnly';
    const PointsOnly = 'PointsOnly';
    const PointsAndMonetary = 'PointsAndMonetary';
    const PreserveCurrent = 'PreserveCurrent';
    const Unmapped = 'Unmapped';

}

class TicketRequest {

    /**
     *
     * @var SegmentTicketRequest[] $SegmentTicketRequests
     * @access public
     */
    public $SegmentTicketRequests = null;

}

class SegmentTicketRequest {

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var PaxTicketUpdate[] $PaxTickets
     * @access public
     */
    public $PaxTickets = null;

}

class PaxTicketUpdate extends StateMessage {

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $TicketIndicator
     * @access public
     */
    public $TicketIndicator = null;

    /**
     *
     * @var string $TicketNumber
     * @access public
     */
    public $TicketNumber = null;

    /**
     *
     * @var string $InfantTicketNumber
     * @access public
     */
    public $InfantTicketNumber = null;

}

class BookingUpdateResponseData {

    /**
     *
     * @var Success $Success
     * @access public
     */
    public $Success = null;

    /**
     *
     * @var Warning $Warning
     * @access public
     */
    public $Warning = null;

    /**
     *
     * @var Error $Error
     * @access public
     */
    public $Error = null;

    /**
     *
     * @var OtherServiceInformation[] $OtherServiceInformations
     * @access public
     */
    public $OtherServiceInformations = null;

}

class Success {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var BookingSum $PNRAmount
     * @access public
     */
    public $PNRAmount = null;

}

class BookingSum {

    /**
     *
     * @var float $BalanceDue
     * @access public
     */
    public $BalanceDue = null;

    /**
     *
     * @var float $AuthorizedBalanceDue
     * @access public
     */
    public $AuthorizedBalanceDue = null;

    /**
     *
     * @var int $SegmentCount
     * @access public
     */
    public $SegmentCount = null;

    /**
     *
     * @var int $PassiveSegmentCount
     * @access public
     */
    public $PassiveSegmentCount = null;

    /**
     *
     * @var float $TotalCost
     * @access public
     */
    public $TotalCost = null;

    /**
     *
     * @var float $PointsBalanceDue
     * @access public
     */
    public $PointsBalanceDue = null;

    /**
     *
     * @var float $TotalPointCost
     * @access public
     */
    public $TotalPointCost = null;

    /**
     *
     * @var string $AlternateCurrencyCode
     * @access public
     */
    public $AlternateCurrencyCode = null;

    /**
     *
     * @var float $AlternateCurrencyBalanceDue
     * @access public
     */
    public $AlternateCurrencyBalanceDue = null;

}

class Warning {

    /**
     *
     * @var string $WarningText
     * @access public
     */
    public $WarningText = null;

}

class Error {

    /**
     *
     * @var string $ErrorText
     * @access public
     */
    public $ErrorText = null;

}

class UpgradeRequestData {

    /**
     *
     * @var UpgradeSegmentRequest[] $UpgradeSegmentRequests
     * @access public
     */
    public $UpgradeSegmentRequests = null;

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

}

class UpgradeSegmentRequest {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $ClassOfService
     * @access public
     */
    public $ClassOfService = null;

    /**
     *
     * @var boolean $FeeOverride
     * @access public
     */
    public $FeeOverride = null;

}

class DowngradeRequestData {

    /**
     *
     * @var DowngradeSegmentRequest[] $DowngradeSegmentRequests
     * @access public
     */
    public $DowngradeSegmentRequests = null;

}

class DowngradeSegmentRequest {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

}

class UpgradeAvailabilityRequest {

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

}

class UpgradeAvailabilityResponse extends ServiceMessage {

    /**
     *
     * @var UpgradeSegment[] $UpgradeSegments
     * @access public
     */
    public $UpgradeSegments = null;

}

class ServiceMessage {

    /**
     *
     * @var OtherServiceInformation[] $OtherServiceInfoList
     * @access public
     */
    public $OtherServiceInfoList = null;

}

class UpgradeSegment {

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var Upgrade[] $Upgrades
     * @access public
     */
    public $Upgrades = null;

}

class Upgrade {

    /**
     *
     * @var string $OriginalClassOfService
     * @access public
     */
    public $OriginalClassOfService = null;

    /**
     *
     * @var string $UpgradeClassOfService
     * @access public
     */
    public $UpgradeClassOfService = null;

    /**
     *
     * @var int $Available
     * @access public
     */
    public $Available = null;

    /**
     *
     * @var PassengerFee $PassengerFee
     * @access public
     */
    public $PassengerFee = null;

}

class PassengerFee extends StateMessage {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var string $FeeCode
     * @access public
     */
    public $FeeCode = null;

    /**
     *
     * @var string $FeeDetail
     * @access public
     */
    public $FeeDetail = null;

    /**
     *
     * @var int $FeeNumber
     * @access public
     */
    public $FeeNumber = null;

    /**
     *
     * @var FeeType $FeeType
     * @access public
     */
    public $FeeType = null;

    /**
     *
     * @var boolean $FeeOverride
     * @access public
     */
    public $FeeOverride = null;

    /**
     *
     * @var string $FlightReference
     * @access public
     */
    public $FlightReference = null;

    /**
     *
     * @var string $Note
     * @access public
     */
    public $Note = null;

    /**
     *
     * @var string $SSRCode
     * @access public
     */
    public $SSRCode = null;

    /**
     *
     * @var int $SSRNumber
     * @access public
     */
    public $SSRNumber = null;

    /**
     *
     * @var int $PaymentNumber
     * @access public
     */
    public $PaymentNumber = null;

    /**
     *
     * @var BookingServiceCharge[] $ServiceCharges
     * @access public
     */
    public $ServiceCharges = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

    /**
     *
     * @var boolean $IsProtected
     * @access public
     */
    public $IsProtected = null;

}

class BookingServiceCharge extends StateMessage {

    /**
     *
     * @var ChargeType $ChargeType
     * @access public
     */
    public $ChargeType = null;

    /**
     *
     * @var CollectType $CollectType
     * @access public
     */
    public $CollectType = null;

    /**
     *
     * @var string $ChargeCode
     * @access public
     */
    public $ChargeCode = null;

    /**
     *
     * @var string $TicketCode
     * @access public
     */
    public $TicketCode = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var float $Amount
     * @access public
     */
    public $Amount = null;

    /**
     *
     * @var string $ChargeDetail
     * @access public
     */
    public $ChargeDetail = null;

    /**
     *
     * @var string $ForeignCurrencyCode
     * @access public
     */
    public $ForeignCurrencyCode = null;

    /**
     *
     * @var float $ForeignAmount
     * @access public
     */
    public $ForeignAmount = null;

}

class UpdateSourcePointOfSaleRequest {

    /**
     *
     * @var boolean $ForceChangeInState
     * @access public
     */
    public $ForceChangeInState = null;

    /**
     *
     * @var PointOfSale $SourcePointOfSale
     * @access public
     */
    public $SourcePointOfSale = null;

}

class MoveJourneyBookingsRequestData {

    /**
     *
     * @var Journey $FromJourney
     * @access public
     */
    public $FromJourney = null;

    /**
     *
     * @var Journey[] $ToJourneys
     * @access public
     */
    public $ToJourneys = null;

    /**
     *
     * @var string[] $RecordLocators
     * @access public
     */
    public $RecordLocators = null;

    /**
     *
     * @var string $ChangeReasonCode
     * @access public
     */
    public $ChangeReasonCode = null;

    /**
     *
     * @var boolean $KeepWaitListStatus
     * @access public
     */
    public $KeepWaitListStatus = null;

    /**
     *
     * @var Segment $EffectedSegment
     * @access public
     */
    public $EffectedSegment = null;

    /**
     *
     * @var int $ToleranceMinutes
     * @access public
     */
    public $ToleranceMinutes = null;

    /**
     *
     * @var boolean $AddAdHocConnection
     * @access public
     */
    public $AddAdHocConnection = null;

    /**
     *
     * @var boolean $AdHocIsForGeneralUse
     * @access public
     */
    public $AdHocIsForGeneralUse = null;

    /**
     *
     * @var string $BookingComment
     * @access public
     */
    public $BookingComment = null;

    /**
     *
     * @var MovePassengerJourneyType $MovePassengerJourneyType
     * @access public
     */
    public $MovePassengerJourneyType = null;

    /**
     *
     * @var int $BoardingSequenceOffset
     * @access public
     */
    public $BoardingSequenceOffset = null;

    /**
     *
     * @var boolean $IgnorePNRsWithInvalidFromJourney
     * @access public
     */
    public $IgnorePNRsWithInvalidFromJourney = null;

}

class Journey extends StateMessage {

    /**
     *
     * @var boolean $NotForGeneralUse
     * @access public
     */
    public $NotForGeneralUse = null;

    /**
     *
     * @var Segment[] $Segments
     * @access public
     */
    public $Segments = null;

    /**
     *
     * @var string $JourneySellKey
     * @access public
     */
    public $JourneySellKey = null;

}

class Segment extends StateMessage {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $CabinOfService
     * @access public
     */
    public $CabinOfService = null;

    /**
     *
     * @var string $ChangeReasonCode
     * @access public
     */
    public $ChangeReasonCode = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $PriorityCode
     * @access public
     */
    public $PriorityCode = null;

    /**
     *
     * @var string $SegmentType
     * @access public
     */
    public $SegmentType = null;

    /**
     *
     * @var dateTime $STA
     * @access public
     */
    public $STA = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var boolean $International
     * @access public
     */
    public $International = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var FlightDesignator $XrefFlightDesignator
     * @access public
     */
    public $XrefFlightDesignator = null;

    /**
     *
     * @var Fare[] $Fares
     * @access public
     */
    public $Fares = null;

    /**
     *
     * @var Leg[] $Legs
     * @access public
     */
    public $Legs = null;

    /**
     *
     * @var PaxBag[] $PaxBags
     * @access public
     */
    public $PaxBags = null;

    /**
     *
     * @var PaxSeat[] $PaxSeats
     * @access public
     */
    public $PaxSeats = null;

    /**
     *
     * @var PaxSSR[] $PaxSSRs
     * @access public
     */
    public $PaxSSRs = null;

    /**
     *
     * @var PaxSegment[] $PaxSegments
     * @access public
     */
    public $PaxSegments = null;

    /**
     *
     * @var PaxTicket[] $PaxTickets
     * @access public
     */
    public $PaxTickets = null;

    /**
     *
     * @var PaxSeatPreference[] $PaxSeatPreferences
     * @access public
     */
    public $PaxSeatPreferences = null;

    /**
     *
     * @var dateTime $SalesDate
     * @access public
     */
    public $SalesDate = null;

    /**
     *
     * @var string $SegmentSellKey
     * @access public
     */
    public $SegmentSellKey = null;

    /**
     *
     * @var PaxScore[] $PaxScores
     * @access public
     */
    public $PaxScores = null;

    /**
     *
     * @var ChannelType $ChannelType
     * @access public
     */
    public $ChannelType = null;

}

class Fare extends StateMessage {

    /**
     *
     * @var string $ClassOfService
     * @access public
     */
    public $ClassOfService = null;

    /**
     *
     * @var string $ClassType
     * @access public
     */
    public $ClassType = null;

    /**
     *
     * @var string $RuleTariff
     * @access public
     */
    public $RuleTariff = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $RuleNumber
     * @access public
     */
    public $RuleNumber = null;

    /**
     *
     * @var string $FareBasisCode
     * @access public
     */
    public $FareBasisCode = null;

    /**
     *
     * @var int $FareSequence
     * @access public
     */
    public $FareSequence = null;

    /**
     *
     * @var string $FareClassOfService
     * @access public
     */
    public $FareClassOfService = null;

    /**
     *
     * @var FareStatus $FareStatus
     * @access public
     */
    public $FareStatus = null;

    /**
     *
     * @var FareApplicationType $FareApplicationType
     * @access public
     */
    public $FareApplicationType = null;

    /**
     *
     * @var string $OriginalClassOfService
     * @access public
     */
    public $OriginalClassOfService = null;

    /**
     *
     * @var string $XrefClassOfService
     * @access public
     */
    public $XrefClassOfService = null;

    /**
     *
     * @var PaxFare[] $PaxFares
     * @access public
     */
    public $PaxFares = null;

    /**
     *
     * @var string $ProductClass
     * @access public
     */
    public $ProductClass = null;

    /**
     *
     * @var boolean $IsAllotmentMarketFare
     * @access public
     */
    public $IsAllotmentMarketFare = null;

    /**
     *
     * @var string $TravelClassCode
     * @access public
     */
    public $TravelClassCode = null;

    /**
     *
     * @var string $FareSellKey
     * @access public
     */
    public $FareSellKey = null;

    /**
     *
     * @var InboundOutbound $InboundOutbound
     * @access public
     */
    public $InboundOutbound = null;

}

class PaxFare extends StateMessage {

    /**
     *
     * @var string $PaxType
     * @access public
     */
    public $PaxType = null;

    /**
     *
     * @var string $PaxDiscountCode
     * @access public
     */
    public $PaxDiscountCode = null;

    /**
     *
     * @var string $FareDiscountCode
     * @access public
     */
    public $FareDiscountCode = null;

    /**
     *
     * @var BookingServiceCharge[] $ServiceCharges
     * @access public
     */
    public $ServiceCharges = null;

    /**
     *
     * @param MessageState $State
     * @access public
     */
    public function __construct($State) {
        parent::__construct($State);
    }

}

class AvailableFare extends Fare {

    /**
     *
     * @var int $AvailableCount
     * @access public
     */
    public $AvailableCount = null;

    /**
     *
     * @var ClassStatus $Status
     * @access public
     */
    public $Status = null;

}

class Leg extends StateMessage {

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var dateTime $STA
     * @access public
     */
    public $STA = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var LegInfo $LegInfo
     * @access public
     */
    public $LegInfo = null;

    /**
     *
     * @var OperationsInfo $OperationsInfo
     * @access public
     */
    public $OperationsInfo = null;

    /**
     *
     * @var int $InventoryLegID
     * @access public
     */
    public $InventoryLegID = null;

}

class LegInfo extends StateMessage {

    /**
     *
     * @var int $AdjustedCapacity
     * @access public
     */
    public $AdjustedCapacity = null;

    /**
     *
     * @var string $EquipmentType
     * @access public
     */
    public $EquipmentType = null;

    /**
     *
     * @var string $EquipmentTypeSuffix
     * @access public
     */
    public $EquipmentTypeSuffix = null;

    /**
     *
     * @var string $ArrivalTerminal
     * @access public
     */
    public $ArrivalTerminal = null;

    /**
     *
     * @var int $ArrvLTV
     * @access public
     */
    public $ArrvLTV = null;

    /**
     *
     * @var int $Capacity
     * @access public
     */
    public $Capacity = null;

    /**
     *
     * @var string $CodeShareIndicator
     * @access public
     */
    public $CodeShareIndicator = null;

    /**
     *
     * @var string $DepartureTerminal
     * @access public
     */
    public $DepartureTerminal = null;

    /**
     *
     * @var int $DeptLTV
     * @access public
     */
    public $DeptLTV = null;

    /**
     *
     * @var boolean $ETicket
     * @access public
     */
    public $ETicket = null;

    /**
     *
     * @var boolean $FlifoUpdated
     * @access public
     */
    public $FlifoUpdated = null;

    /**
     *
     * @var boolean $IROP
     * @access public
     */
    public $IROP = null;

    /**
     *
     * @var LegStatus $Status
     * @access public
     */
    public $Status = null;

    /**
     *
     * @var int $Lid
     * @access public
     */
    public $Lid = null;

    /**
     *
     * @var string $OnTime
     * @access public
     */
    public $OnTime = null;

    /**
     *
     * @var dateTime $PaxSTA
     * @access public
     */
    public $PaxSTA = null;

    /**
     *
     * @var dateTime $PaxSTD
     * @access public
     */
    public $PaxSTD = null;

    /**
     *
     * @var string $PRBCCode
     * @access public
     */
    public $PRBCCode = null;

    /**
     *
     * @var string $ScheduleServiceType
     * @access public
     */
    public $ScheduleServiceType = null;

    /**
     *
     * @var int $Sold
     * @access public
     */
    public $Sold = null;

    /**
     *
     * @var int $OutMoveDays
     * @access public
     */
    public $OutMoveDays = null;

    /**
     *
     * @var int $BackMoveDays
     * @access public
     */
    public $BackMoveDays = null;

    /**
     *
     * @var LegNest[] $LegNests
     * @access public
     */
    public $LegNests = null;

    /**
     *
     * @var LegSSR[] $LegSSRs
     * @access public
     */
    public $LegSSRs = null;

    /**
     *
     * @var string $OperatingFlightNumber
     * @access public
     */
    public $OperatingFlightNumber = null;

    /**
     *
     * @var string $OperatedByText
     * @access public
     */
    public $OperatedByText = null;

    /**
     *
     * @var string $OperatingCarrier
     * @access public
     */
    public $OperatingCarrier = null;

    /**
     *
     * @var string $OperatingOpSuffix
     * @access public
     */
    public $OperatingOpSuffix = null;

    /**
     *
     * @var boolean $SubjectToGovtApproval
     * @access public
     */
    public $SubjectToGovtApproval = null;

    /**
     *
     * @var string $MarketingCode
     * @access public
     */
    public $MarketingCode = null;

    /**
     *
     * @var boolean $ChangeOfDirection
     * @access public
     */
    public $ChangeOfDirection = null;

    /**
     *
     * @var boolean $MarketingOverride
     * @access public
     */
    public $MarketingOverride = null;

}

class LegNest extends StateMessage {

    /**
     *
     * @var int $ClassNest
     * @access public
     */
    public $ClassNest = null;

    /**
     *
     * @var int $Lid
     * @access public
     */
    public $Lid = null;

    /**
     *
     * @var int $AdjustedCapacity
     * @access public
     */
    public $AdjustedCapacity = null;

    /**
     *
     * @var string $TravelClassCode
     * @access public
     */
    public $TravelClassCode = null;

    /**
     *
     * @var NestType $NestType
     * @access public
     */
    public $NestType = null;

    /**
     *
     * @var LegClass[] $LegClasses
     * @access public
     */
    public $LegClasses = null;

}

class LegClass extends StateMessage {

    /**
     *
     * @var int $ClassNest
     * @access public
     */
    public $ClassNest = null;

    /**
     *
     * @var string $ClassOfService
     * @access public
     */
    public $ClassOfService = null;

    /**
     *
     * @var ClassStatus $Status
     * @access public
     */
    public $Status = null;

    /**
     *
     * @var string $ClassType
     * @access public
     */
    public $ClassType = null;

    /**
     *
     * @var int $ClassAllotted
     * @access public
     */
    public $ClassAllotted = null;

    /**
     *
     * @var int $ClassRank
     * @access public
     */
    public $ClassRank = null;

    /**
     *
     * @var int $ClassAU
     * @access public
     */
    public $ClassAU = null;

    /**
     *
     * @var int $ClassSold
     * @access public
     */
    public $ClassSold = null;

    /**
     *
     * @var int $NonStopSold
     * @access public
     */
    public $NonStopSold = null;

    /**
     *
     * @var int $ThruSold
     * @access public
     */
    public $ThruSold = null;

    /**
     *
     * @var int $CnxSold
     * @access public
     */
    public $CnxSold = null;

    /**
     *
     * @var int $LatestAdvRes
     * @access public
     */
    public $LatestAdvRes = null;

}

class LegSSR {

    /**
     *
     * @var string $SSRNestCode
     * @access public
     */
    public $SSRNestCode = null;

    /**
     *
     * @var int $SSRLid
     * @access public
     */
    public $SSRLid = null;

    /**
     *
     * @var int $SSRSold
     * @access public
     */
    public $SSRSold = null;

    /**
     *
     * @var int $SSRValueSold
     * @access public
     */
    public $SSRValueSold = null;

}

class OperationsInfo extends StateMessage {

    /**
     *
     * @var string $ActualArrivalGate
     * @access public
     */
    public $ActualArrivalGate = null;

    /**
     *
     * @var string $ActualDepartureGate
     * @access public
     */
    public $ActualDepartureGate = null;

    /**
     *
     * @var dateTime $ActualOffBlockTime
     * @access public
     */
    public $ActualOffBlockTime = null;

    /**
     *
     * @var dateTime $ActualOnBlockTime
     * @access public
     */
    public $ActualOnBlockTime = null;

    /**
     *
     * @var dateTime $ActualTouchDownTime
     * @access public
     */
    public $ActualTouchDownTime = null;

    /**
     *
     * @var dateTime $AirborneTime
     * @access public
     */
    public $AirborneTime = null;

    /**
     *
     * @var string $ArrivalGate
     * @access public
     */
    public $ArrivalGate = null;

    /**
     *
     * @var string $ArrivalNote
     * @access public
     */
    public $ArrivalNote = null;

    /**
     *
     * @var ArrivalStatus $ArrivalStatus
     * @access public
     */
    public $ArrivalStatus = null;

    /**
     *
     * @var string $BaggageClaim
     * @access public
     */
    public $BaggageClaim = null;

    /**
     *
     * @var string $DepartureGate
     * @access public
     */
    public $DepartureGate = null;

    /**
     *
     * @var string $DepartureNote
     * @access public
     */
    public $DepartureNote = null;

    /**
     *
     * @var DepartureStatus $DepartureStatus
     * @access public
     */
    public $DepartureStatus = null;

    /**
     *
     * @var dateTime $ETA
     * @access public
     */
    public $ETA = null;

    /**
     *
     * @var dateTime $ETD
     * @access public
     */
    public $ETD = null;

    /**
     *
     * @var dateTime $STA
     * @access public
     */
    public $STA = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $TailNumber
     * @access public
     */
    public $TailNumber = null;

}

class PaxBag extends StateMessage {

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var BaggageStatus $BaggageStatus
     * @access public
     */
    public $BaggageStatus = null;

    /**
     *
     * @var int $CompartmentID
     * @access public
     */
    public $CompartmentID = null;

    /**
     *
     * @var string $OSTag
     * @access public
     */
    public $OSTag = null;

    /**
     *
     * @var dateTime $OSTagDate
     * @access public
     */
    public $OSTagDate = null;

}

class PaxSeat extends StateMessage {

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $UnitDesignator
     * @access public
     */
    public $UnitDesignator = null;

    /**
     *
     * @var string $CompartmentDesignator
     * @access public
     */
    public $CompartmentDesignator = null;

    /**
     *
     * @var SeatPreference $SeatPreference
     * @access public
     */
    public $SeatPreference = null;

    /**
     *
     * @var int $Penalty
     * @access public
     */
    public $Penalty = null;

    /**
     *
     * @var boolean $SeatTogetherPreference
     * @access public
     */
    public $SeatTogetherPreference = null;

    /**
     *
     * @var PaxSeatInfo $PaxSeatInfo
     * @access public
     */
    public $PaxSeatInfo = null;

}

class PaxSeatInfo {

    /**
     *
     * @var int $SeatSet
     * @access public
     */
    public $SeatSet = null;

    /**
     *
     * @var int $Deck
     * @access public
     */
    public $Deck = null;

    /**
     *
     * @var KeyValuePairOfstringstring[] $Properties
     * @access public
     */
    public $Properties = null;

}

class PaxSSR extends StateMessage {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $SSRCode
     * @access public
     */
    public $SSRCode = null;

    /**
     *
     * @var int $SSRNumber
     * @access public
     */
    public $SSRNumber = null;

    /**
     *
     * @var string $SSRDetail
     * @access public
     */
    public $SSRDetail = null;

    /**
     *
     * @var string $FeeCode
     * @access public
     */
    public $FeeCode = null;

    /**
     *
     * @var string $Note
     * @access public
     */
    public $Note = null;

    /**
     *
     * @var int $SSRValue
     * @access public
     */
    public $SSRValue = null;

    /**
     *
     * @param MessageState $State
     * @param int $PassengerNumber
     * @param int $SSRNumber
     * @param int $SSRValue
     * @access public
     */
    public function __construct($State, $PassengerNumber, $SSRNumber, $SSRValue = 0) {
        parent::__construct($State);
        $this->PassengerNumber = $PassengerNumber;
        $this->SSRNumber = $SSRNumber;
        $this->SSRValue = $SSRValue;
    }

}

class PaxSegment extends StateMessage {

    /**
     *
     * @var string $BoardingSequence
     * @access public
     */
    public $BoardingSequence = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

    /**
     *
     * @var LiftStatus $LiftStatus
     * @access public
     */
    public $LiftStatus = null;

    /**
     *
     * @var string $OverBookIndicator
     * @access public
     */
    public $OverBookIndicator = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var dateTime $PriorityDate
     * @access public
     */
    public $PriorityDate = null;

    /**
     *
     * @var TripType $TripType
     * @access public
     */
    public $TripType = null;

    /**
     *
     * @var boolean $TimeChanged
     * @access public
     */
    public $TimeChanged = null;

    /**
     *
     * @var PointOfSale $POS
     * @access public
     */
    public $POS = null;

    /**
     *
     * @var PointOfSale $SourcePOS
     * @access public
     */
    public $SourcePOS = null;

    /**
     *
     * @var string $VerifiedTravelDocs
     * @access public
     */
    public $VerifiedTravelDocs = null;

    /**
     *
     * @var dateTime $ModifiedDate
     * @access public
     */
    public $ModifiedDate = null;

    /**
     *
     * @var dateTime $ActivityDate
     * @access public
     */
    public $ActivityDate = null;

    /**
     *
     * @var int $BaggageAllowanceWeight
     * @access public
     */
    public $BaggageAllowanceWeight = null;

    /**
     *
     * @var WeightType $BaggageAllowanceWeightType
     * @access public
     */
    public $BaggageAllowanceWeightType = null;

    /**
     *
     * @var boolean $BaggageAllowanceUsed
     * @access public
     */
    public $BaggageAllowanceUsed = null;

}

class PaxTicket extends StateMessage {

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $TicketIndicator
     * @access public
     */
    public $TicketIndicator = null;

    /**
     *
     * @var string $TicketNumber
     * @access public
     */
    public $TicketNumber = null;

    /**
     *
     * @var string $TicketStatus
     * @access public
     */
    public $TicketStatus = null;

    /**
     *
     * @var string $InfantTicketNumber
     * @access public
     */
    public $InfantTicketNumber = null;

}

class PaxSeatPreference {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $PropertyTypeCode
     * @access public
     */
    public $PropertyTypeCode = null;

    /**
     *
     * @var string $PropertyCode
     * @access public
     */
    public $PropertyCode = null;

    /**
     *
     * @var string $Met
     * @access public
     */
    public $Met = null;

}

class PaxScore {

    /**
     *
     * @var int $Score
     * @access public
     */
    public $Score = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var string $GuestValueCode
     * @access public
     */
    public $GuestValueCode = null;

}

class MoveJourneyBookingsResponseData {

    /**
     *
     * @var MoveBookingResult[] $MoveBookingResult
     * @access public
     */
    public $MoveBookingResult = null;

}

class MoveBookingResult {

    /**
     *
     * @var string $ClassOfService
     * @access public
     */
    public $ClassOfService = null;

    /**
     *
     * @var string $ClassType
     * @access public
     */
    public $ClassType = null;

    /**
     *
     * @var string $MoveStatusCode
     * @access public
     */
    public $MoveStatusCode = null;

    /**
     *
     * @var int $PaxCount
     * @access public
     */
    public $PaxCount = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var Journey $ToJourney
     * @access public
     */
    public $ToJourney = null;

}

class MoveJourneyByKeyRequestData {

    /**
     *
     * @var SellKeyList $FromJourneySellKeys
     * @access public
     */
    public $FromJourneySellKeys = null;

    /**
     *
     * @var SellKeyList $ToJourneySellKeys
     * @access public
     */
    public $ToJourneySellKeys = null;

    /**
     *
     * @var string $ToJourneyActionStatusCode
     * @access public
     */
    public $ToJourneyActionStatusCode = null;

    /**
     *
     * @var MovePassengerJourneyType $MoveType
     * @access public
     */
    public $MoveType = null;

    /**
     *
     * @var string $ChangeReasonCode
     * @access public
     */
    public $ChangeReasonCode = null;

    /**
     *
     * @var boolean $KeepWaitListStatus
     * @access public
     */
    public $KeepWaitListStatus = null;

    /**
     *
     * @var boolean $IgnoreClosedFlightStatus
     * @access public
     */
    public $IgnoreClosedFlightStatus = null;

    /**
     *
     * @var IgnoreLiftStatus $IgnoreLiftStatus
     * @access public
     */
    public $IgnoreLiftStatus = null;

    /**
     *
     * @var boolean $ChangeStatus
     * @access public
     */
    public $ChangeStatus = null;

    /**
     *
     * @var boolean $Oversell
     * @access public
     */
    public $Oversell = null;

    /**
     *
     * @var int $BoardingSequenceOffset
     * @access public
     */
    public $BoardingSequenceOffset = null;

    /**
     *
     * @var boolean $Commit
     * @access public
     */
    public $Commit = null;

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

}

class SellKeyList {

    /**
     *
     * @var string $JourneySellKey
     * @access public
     */
    public $JourneySellKey = null;

    /**
     *
     * @var string $FareSellKey
     * @access public
     */
    public $FareSellKey = null;

    /**
     *
     * @var string $StandbyPriorityCode
     * @access public
     */
    public $StandbyPriorityCode = null;

}

class EquipmentListRequest {

    /**
     *
     * @var EquipmentRequest[] $EquipmentRequests
     * @access public
     */
    public $EquipmentRequests = null;

    /**
     *
     * @var boolean $IncludePropertyLookup
     * @access public
     */
    public $IncludePropertyLookup = null;

    /**
     *
     * @var boolean $CompressProperties
     * @access public
     */
    public $CompressProperties = null;

}

class EquipmentRequest {

    /**
     *
     * @var string $EquipmentType
     * @access public
     */
    public $EquipmentType = null;

    /**
     *
     * @var string $EquipmentTypeSuffix
     * @access public
     */
    public $EquipmentTypeSuffix = null;

    /**
     *
     * @var dateTime $DepartureDate
     * @access public
     */
    public $DepartureDate = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $FlightNumber
     * @access public
     */
    public $FlightNumber = null;

    /**
     *
     * @var string $OpSuffix
     * @access public
     */
    public $OpSuffix = null;

    /**
     *
     * @var string $MarketingCode
     * @access public
     */
    public $MarketingCode = null;

    /**
     *
     * @var boolean $MarketingOverride
     * @access public
     */
    public $MarketingOverride = null;

    /**
     *
     * @var string $ProductClassCode
     * @access public
     */
    public $ProductClassCode = null;

}

class EquipmentListResponse extends ServiceMessage {

    /**
     *
     * @var EquipmentResponse[] $EquipmentResponses
     * @access public
     */
    public $EquipmentResponses = null;

    /**
     *
     * @var EquipmentPropertyTypeCodesLookup $PropertyTypeCodesLookup
     * @access public
     */
    public $PropertyTypeCodesLookup = null;

}

class EquipmentResponse extends ServiceMessage {

    /**
     *
     * @var EquipmentInfo $EquipmentInfo
     * @access public
     */
    public $EquipmentInfo = null;

    /**
     *
     * @var LegKey $FlightKey
     * @access public
     */
    public $FlightKey = null;

}

class EquipmentInfo {

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $EquipmentType
     * @access public
     */
    public $EquipmentType = null;

    /**
     *
     * @var string $EquipmentTypeSuffix
     * @access public
     */
    public $EquipmentTypeSuffix = null;

    /**
     *
     * @var int $AvailableUnits
     * @access public
     */
    public $AvailableUnits = null;

    /**
     *
     * @var CompartmentInfo[] $Compartments
     * @access public
     */
    public $Compartments = null;

    /**
     *
     * @var EquipmentCategory $EquipmentCategory
     * @access public
     */
    public $EquipmentCategory = null;

    /**
     *
     * @var EquipmentProperty[] $PropertyList
     * @access public
     */
    public $PropertyList = null;

    /**
     *
     * @var unsignedInt[] $PropertyBits
     * @access public
     */
    public $PropertyBits = null;

    /**
     *
     * @var int[] $PropertyInts
     * @access public
     */
    public $PropertyInts = null;

    /**
     *
     * @var unsignedInt[] $PropertyBitsInUse
     * @access public
     */
    public $PropertyBitsInUse = null;

    /**
     *
     * @var unsignedInt[] $PropertyIntsInUse
     * @access public
     */
    public $PropertyIntsInUse = null;

    /**
     *
     * @var unsignedInt[] $SSRBitsInUse
     * @access public
     */
    public $SSRBitsInUse = null;

    /**
     *
     * @var string $MarketingCode
     * @access public
     */
    public $MarketingCode = null;

    /**
     *
     * @var string $Name
     * @access public
     */
    public $Name = null;

    /**
     *
     * @var dateTime $PropertyTimestamp
     * @access public
     */
    public $PropertyTimestamp = null;

}

class CompartmentInfo {

    /**
     *
     * @var string $CompartmentDesignator
     * @access public
     */
    public $CompartmentDesignator = null;

    /**
     *
     * @var int $Deck
     * @access public
     */
    public $Deck = null;

    /**
     *
     * @var int $Length
     * @access public
     */
    public $Length = null;

    /**
     *
     * @var int $Width
     * @access public
     */
    public $Width = null;

    /**
     *
     * @var int $AvailableUnits
     * @access public
     */
    public $AvailableUnits = null;

    /**
     *
     * @var int $Orientation
     * @access public
     */
    public $Orientation = null;

    /**
     *
     * @var int $Sequence
     * @access public
     */
    public $Sequence = null;

    /**
     *
     * @var SeatInfo[] $Seats
     * @access public
     */
    public $Seats = null;

    /**
     *
     * @var EquipmentProperty[] $PropertyList
     * @access public
     */
    public $PropertyList = null;

    /**
     *
     * @var unsignedInt[] $PropertyBits
     * @access public
     */
    public $PropertyBits = null;

    /**
     *
     * @var int[] $PropertyInts
     * @access public
     */
    public $PropertyInts = null;

    /**
     *
     * @var dateTime $PropertyTimestamp
     * @access public
     */
    public $PropertyTimestamp = null;

}

class SeatInfo {

    /**
     *
     * @var boolean $Assignable
     * @access public
     */
    public $Assignable = null;

    /**
     *
     * @var int $CabotageLevel
     * @access public
     */
    public $CabotageLevel = null;

    /**
     *
     * @var int $CarAvailableUnits
     * @access public
     */
    public $CarAvailableUnits = null;

    /**
     *
     * @var string $CompartmentDesignator
     * @access public
     */
    public $CompartmentDesignator = null;

    /**
     *
     * @var int $SeatSet
     * @access public
     */
    public $SeatSet = null;

    /**
     *
     * @var int $CriterionWeight
     * @access public
     */
    public $CriterionWeight = null;

    /**
     *
     * @var int $SeatSetAvailableUnits
     * @access public
     */
    public $SeatSetAvailableUnits = null;

    /**
     *
     * @var string $SSRSeatMapCode
     * @access public
     */
    public $SSRSeatMapCode = null;

    /**
     *
     * @var int $SeatAngle
     * @access public
     */
    public $SeatAngle = null;

    /**
     *
     * @var SeatAvailability $SeatAvailability
     * @access public
     */
    public $SeatAvailability = null;

    /**
     *
     * @var string $SeatDesignator
     * @access public
     */
    public $SeatDesignator = null;

    /**
     *
     * @var string $SeatType
     * @access public
     */
    public $SeatType = null;

    /**
     *
     * @var int $X
     * @access public
     */
    public $X = null;

    /**
     *
     * @var int $Y
     * @access public
     */
    public $Y = null;

    /**
     *
     * @var EquipmentProperty[] $PropertyList
     * @access public
     */
    public $PropertyList = null;

    /**
     *
     * @var string[] $SSRPermissions
     * @access public
     */
    public $SSRPermissions = null;

    /**
     *
     * @var unsignedInt[] $SSRPermissionBits
     * @access public
     */
    public $SSRPermissionBits = null;

    /**
     *
     * @var unsignedInt[] $PropertyBits
     * @access public
     */
    public $PropertyBits = null;

    /**
     *
     * @var int[] $PropertyInts
     * @access public
     */
    public $PropertyInts = null;

    /**
     *
     * @var string $TravelClassCode
     * @access public
     */
    public $TravelClassCode = null;

    /**
     *
     * @var dateTime $PropertyTimestamp
     * @access public
     */
    public $PropertyTimestamp = null;

    /**
     *
     * @var int $SeatGroup
     * @access public
     */
    public $SeatGroup = null;

    /**
     *
     * @var int $Zone
     * @access public
     */
    public $Zone = null;

    /**
     *
     * @var int $Height
     * @access public
     */
    public $Height = null;

    /**
     *
     * @var int $Width
     * @access public
     */
    public $Width = null;

    /**
     *
     * @var int $Priority
     * @access public
     */
    public $Priority = null;

    /**
     *
     * @var string $Text
     * @access public
     */
    public $Text = null;

    /**
     *
     * @var int $ODPenalty
     * @access public
     */
    public $ODPenalty = null;

    /**
     *
     * @var string $TerminalDisplayCharacter
     * @access public
     */
    public $TerminalDisplayCharacter = null;

    /**
     *
     * @var boolean $PremiumSeatIndicator
     * @access public
     */
    public $PremiumSeatIndicator = null;

}

class EquipmentProperty {

    /**
     *
     * @var string $TypeCode
     * @access public
     */
    public $TypeCode = null;

    /**
     *
     * @var string $Value
     * @access public
     */
    public $Value = null;

}

class LegKey extends FlightDesignator {

    /**
     *
     * @var dateTime $DepartureDate
     * @access public
     */
    public $DepartureDate = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

}

class EquipmentPropertyTypeCodesLookup {

    /**
     *
     * @var EquipmentProperty[] $BooleanPropertyTypes
     * @access public
     */
    public $BooleanPropertyTypes = null;

    /**
     *
     * @var string[] $NumericPropertyTypeCodes
     * @access public
     */
    public $NumericPropertyTypeCodes = null;

    /**
     *
     * @var string[] $SSRCodes
     * @access public
     */
    public $SSRCodes = null;

    /**
     *
     * @var dateTime $Timestamp
     * @access public
     */
    public $Timestamp = null;

}

class FeeRequest {

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var int $FeeNumber
     * @access public
     */
    public $FeeNumber = null;

    /**
     *
     * @var float $NetAmount
     * @access public
     */
    public $NetAmount = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

}

class Booking extends ServiceMessage {

    /**
     *
     * @var MessageState $State
     * @access public
     */
    public $State = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var int $PaxCount
     * @access public
     */
    public $PaxCount = null;

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

    /**
     *
     * @var int $BookingParentID
     * @access public
     */
    public $BookingParentID = null;

    /**
     *
     * @var string $ParentRecordLocator
     * @access public
     */
    public $ParentRecordLocator = null;

    /**
     *
     * @var string $BookingChangeCode
     * @access public
     */
    public $BookingChangeCode = null;

    /**
     *
     * @var string $GroupName
     * @access public
     */
    public $GroupName = null;

    /**
     *
     * @var BookingInfo $BookingInfo
     * @access public
     */
    public $BookingInfo = null;

    /**
     *
     * @var PointOfSale $POS
     * @access public
     */
    public $POS = null;

    /**
     *
     * @var PointOfSale $SourcePOS
     * @access public
     */
    public $SourcePOS = null;

    /**
     *
     * @var TypeOfSale $TypeOfSale
     * @access public
     */
    public $TypeOfSale = null;

    /**
     *
     * @var BookingHold $BookingHold
     * @access public
     */
    public $BookingHold = null;

    /**
     *
     * @var BookingSum $BookingSum
     * @access public
     */
    public $BookingSum = null;

    /**
     *
     * @var ReceivedByInfo $ReceivedBy
     * @access public
     */
    public $ReceivedBy = null;

    /**
     *
     * @var RecordLocator[] $RecordLocators
     * @access public
     */
    public $RecordLocators = null;

    /**
     *
     * @var Passenger[] $Passengers
     * @access public
     */
    public $Passengers = null;

    /**
     *
     * @var Journey[] $Journeys
     * @access public
     */
    public $Journeys = null;

    /**
     *
     * @var BookingComment[] $BookingComments
     * @access public
     */
    public $BookingComments = null;

    /**
     *
     * @var BookingQueueInfo[] $BookingQueueInfos
     * @access public
     */
    public $BookingQueueInfos = null;

    /**
     *
     * @var BookingContact[] $BookingContacts
     * @access public
     */
    public $BookingContacts = null;

    /**
     *
     * @var Payment[] $Payments
     * @access public
     */
    public $Payments = null;

    /**
     *
     * @var BookingComponent[] $BookingComponents
     * @access public
     */
    public $BookingComponents = null;

    /**
     *
     * @var string $NumericRecordLocator
     * @access public
     */
    public $NumericRecordLocator = null;

}

class BookingInfo extends StateMessage {

    /**
     *
     * @var BookingStatus $BookingStatus
     * @access public
     */
    public $BookingStatus = null;

    /**
     *
     * @var string $BookingType
     * @access public
     */
    public $BookingType = null;

    /**
     *
     * @var ChannelType $ChannelType
     * @access public
     */
    public $ChannelType = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

    /**
     *
     * @var dateTime $ExpiredDate
     * @access public
     */
    public $ExpiredDate = null;

    /**
     *
     * @var dateTime $ModifiedDate
     * @access public
     */
    public $ModifiedDate = null;

    /**
     *
     * @var PriceStatus $PriceStatus
     * @access public
     */
    public $PriceStatus = null;

    /**
     *
     * @var BookingProfileStatus $ProfileStatus
     * @access public
     */
    public $ProfileStatus = null;

    /**
     *
     * @var boolean $ChangeAllowed
     * @access public
     */
    public $ChangeAllowed = null;

    /**
     *
     * @var int $CreatedAgentID
     * @access public
     */
    public $CreatedAgentID = null;

    /**
     *
     * @var int $ModifiedAgentID
     * @access public
     */
    public $ModifiedAgentID = null;

    /**
     *
     * @var dateTime $BookingDate
     * @access public
     */
    public $BookingDate = null;

    /**
     *
     * @var string $OwningCarrierCode
     * @access public
     */
    public $OwningCarrierCode = null;

    /**
     *
     * @var PaidStatus $PaidStatus
     * @access public
     */
    public $PaidStatus = null;

}

class TypeOfSale extends StateMessage {

    /**
     *
     * @var string $PaxResidentCountry
     * @access public
     */
    public $PaxResidentCountry = null;

    /**
     *
     * @var string $PromotionCode
     * @access public
     */
    public $PromotionCode = null;

    /**
     *
     * @var string[] $FareTypes
     * @access public
     */
    public $FareTypes = null;

}

class BookingHold extends StateMessage {

    /**
     *
     * @var dateTime $HoldDateTime
     * @access public
     */
    public $HoldDateTime = null;

}

class ReceivedByInfo extends StateMessage {

    /**
     *
     * @var string $ReceivedBy
     * @access public
     */
    public $ReceivedBy = null;

    /**
     *
     * @var string $ReceivedReference
     * @access public
     */
    public $ReceivedReference = null;

    /**
     *
     * @var string $ReferralCode
     * @access public
     */
    public $ReferralCode = null;

    /**
     *
     * @var string $LatestReceivedBy
     * @access public
     */
    public $LatestReceivedBy = null;

    /**
     *
     * @var string $LatestReceivedReference
     * @access public
     */
    public $LatestReceivedReference = null;

}

class Passenger extends StateMessage {

    /**
     *
     * @var PassengerProgram[] $PassengerPrograms
     * @access public
     */
    public $PassengerPrograms = null;

    /**
     *
     * @var string $CustomerNumber
     * @access public
     */
    public $CustomerNumber = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var int $FamilyNumber
     * @access public
     */
    public $FamilyNumber = null;

    /**
     *
     * @var string $PaxDiscountCode
     * @access public
     */
    public $PaxDiscountCode = null;

    /**
     *
     * @var BookingName[] $Names
     * @access public
     */
    public $Names = null;

    /**
     *
     * @var PassengerInfant $Infant
     * @access public
     */
    public $Infant = null;

    /**
     *
     * @var PassengerInfo $PassengerInfo
     * @access public
     */
    public $PassengerInfo = null;

    /**
     *
     * @var PassengerProgram $PassengerProgram
     * @access public
     */
    public $PassengerProgram = null;

    /**
     *
     * @var PassengerFee[] $PassengerFees
     * @access public
     */
    public $PassengerFees = null;

    /**
     *
     * @var PassengerAddress[] $PassengerAddresses
     * @access public
     */
    public $PassengerAddresses = null;

    /**
     *
     * @var PassengerTravelDocument[] $PassengerTravelDocuments
     * @access public
     */
    public $PassengerTravelDocuments = null;

    /**
     *
     * @var PassengerBag[] $PassengerBags
     * @access public
     */
    public $PassengerBags = null;

    /**
     *
     * @var int $PassengerID
     * @access public
     */
    public $PassengerID = null;

    /**
     *
     * @var PassengerTypeInfo[] $PassengerTypeInfos
     * @access public
     */
    public $PassengerTypeInfos = null;

    /**
     *
     * @var PassengerInfo[] $PassengerInfos
     * @access public
     */
    public $PassengerInfos = null;

    /**
     *
     * @var PassengerInfant[] $PassengerInfants
     * @access public
     */
    public $PassengerInfants = null;

    /**
     *
     * @var boolean $PseudoPassenger
     * @access public
     */
    public $PseudoPassenger = null;

}

class PassengerProgram extends StateMessage {

    /**
     *
     * @var string $ProgramCode
     * @access public
     */
    public $ProgramCode = null;

    /**
     *
     * @var string $ProgramLevelCode
     * @access public
     */
    public $ProgramLevelCode = null;

    /**
     *
     * @var string $ProgramNumber
     * @access public
     */
    public $ProgramNumber = null;

}

class BookingName extends StateMessage {

    /**
     *
     * @var string $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var string $MiddleName
     * @access public
     */
    public $MiddleName = null;

    /**
     *
     * @var string $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var string $Suffix
     * @access public
     */
    public $Suffix = null;

    /**
     *
     * @var string $Title
     * @access public
     */
    public $Title = null;

}

class PassengerInfant extends StateMessage {

    /**
     *
     * @var dateTime $DOB
     * @access public
     */
    public $DOB = null;

    /**
     *
     * @var Gender $Gender
     * @access public
     */
    public $Gender = null;

    /**
     *
     * @var string $Nationality
     * @access public
     */
    public $Nationality = null;

    /**
     *
     * @var string $ResidentCountry
     * @access public
     */
    public $ResidentCountry = null;

    /**
     *
     * @var BookingName[] $Names
     * @access public
     */
    public $Names = null;

}

class PassengerInfo extends StateMessage {

    /**
     *
     * @var float $BalanceDue
     * @access public
     */
    public $BalanceDue = null;

    /**
     *
     * @var Gender $Gender
     * @access public
     */
    public $Gender = null;

    /**
     *
     * @var string $Nationality
     * @access public
     */
    public $Nationality = null;

    /**
     *
     * @var string $ResidentCountry
     * @access public
     */
    public $ResidentCountry = null;

    /**
     *
     * @var float $TotalCost
     * @access public
     */
    public $TotalCost = null;

    /**
     *
     * @var WeightCategory $WeightCategory
     * @access public
     */
    public $WeightCategory = null;

}

class PassengerAddress extends StateMessage {

    /**
     *
     * @var string $TypeCode
     * @access public
     */
    public $TypeCode = null;

    /**
     *
     * @var string $StationCode
     * @access public
     */
    public $StationCode = null;

    /**
     *
     * @var string $CompanyName
     * @access public
     */
    public $CompanyName = null;

    /**
     *
     * @var string $AddressLine1
     * @access public
     */
    public $AddressLine1 = null;

    /**
     *
     * @var string $AddressLine2
     * @access public
     */
    public $AddressLine2 = null;

    /**
     *
     * @var string $AddressLine3
     * @access public
     */
    public $AddressLine3 = null;

    /**
     *
     * @var string $City
     * @access public
     */
    public $City = null;

    /**
     *
     * @var string $ProvinceState
     * @access public
     */
    public $ProvinceState = null;

    /**
     *
     * @var string $PostalCode
     * @access public
     */
    public $PostalCode = null;

    /**
     *
     * @var string $CountryCode
     * @access public
     */
    public $CountryCode = null;

    /**
     *
     * @var string $Phone
     * @access public
     */
    public $Phone = null;

}

class PassengerTravelDocument extends StateMessage {

    /**
     *
     * @var string $DocTypeCode
     * @access public
     */
    public $DocTypeCode = null;

    /**
     *
     * @var string $IssuedByCode
     * @access public
     */
    public $IssuedByCode = null;

    /**
     *
     * @var string $DocSuffix
     * @access public
     */
    public $DocSuffix = null;

    /**
     *
     * @var string $DocNumber
     * @access public
     */
    public $DocNumber = null;

    /**
     *
     * @var dateTime $DOB
     * @access public
     */
    public $DOB = null;

    /**
     *
     * @var Gender $Gender
     * @access public
     */
    public $Gender = null;

    /**
     *
     * @var string $Nationality
     * @access public
     */
    public $Nationality = null;

    /**
     *
     * @var dateTime $ExpirationDate
     * @access public
     */
    public $ExpirationDate = null;

    /**
     *
     * @var BookingName[] $Names
     * @access public
     */
    public $Names = null;

    /**
     *
     * @var string $BirthCountry
     * @access public
     */
    public $BirthCountry = null;

    /**
     *
     * @var dateTime $IssuedDate
     * @access public
     */
    public $IssuedDate = null;

}

class PassengerBag extends StateMessage {

    /**
     *
     * @var int $BaggageID
     * @access public
     */
    public $BaggageID = null;

    /**
     *
     * @var string $OSTag
     * @access public
     */
    public $OSTag = null;

    /**
     *
     * @var dateTime $OSTagDate
     * @access public
     */
    public $OSTagDate = null;

    /**
     *
     * @var string $StationCode
     * @access public
     */
    public $StationCode = null;

    /**
     *
     * @var int $Weight
     * @access public
     */
    public $Weight = null;

    /**
     *
     * @var WeightType $WeightType
     * @access public
     */
    public $WeightType = null;

    /**
     *
     * @var string $TaggedToStation
     * @access public
     */
    public $TaggedToStation = null;

    /**
     *
     * @var string $TaggedToFlightNumber
     * @access public
     */
    public $TaggedToFlightNumber = null;

    /**
     *
     * @var boolean $LRTIndicator
     * @access public
     */
    public $LRTIndicator = null;

    /**
     *
     * @var string $BaggageType
     * @access public
     */
    public $BaggageType = null;

    /**
     *
     * @var string $TaggedToCarrierCode
     * @access public
     */
    public $TaggedToCarrierCode = null;

}

class PassengerTypeInfo {

    /**
     *
     * @var MessageState $State
     * @access public
     */
    public $State = MessageState::aNew;

    /**
     *
     * @var dateTime $DOB
     * @access public
     */
    public $DOB = null;

    /**
     *
     * @var string $PaxType
     * @access public
     */
    public $PaxType = 'ADT';

}

class BookingComment extends StateMessage {

    /**
     *
     * @var CommentType $CommentType
     * @access public
     */
    public $CommentType = null;

    /**
     *
     * @var string $CommentText
     * @access public
     */
    public $CommentText = null;

    /**
     *
     * @var PointOfSale $PointOfSale
     * @access public
     */
    public $PointOfSale = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

}

class BookingQueueInfo extends StateMessage {

    /**
     *
     * @var int $PassengerID
     * @access public
     */
    public $PassengerID = null;

    /**
     *
     * @var int $WatchListID
     * @access public
     */
    public $WatchListID = null;

    /**
     *
     * @var string $QueueCode
     * @access public
     */
    public $QueueCode = null;

    /**
     *
     * @var string $Notes
     * @access public
     */
    public $Notes = null;

    /**
     *
     * @var QueueEventType $QueueEventType
     * @access public
     */
    public $QueueEventType = null;

    /**
     *
     * @var string $QueueName
     * @access public
     */
    public $QueueName = null;

    /**
     *
     * @var QueueAction $QueueAction
     * @access public
     */
    public $QueueAction = null;

    /**
     *
     * @var QueueMode $QueueMode
     * @access public
     */
    public $QueueMode = null;

    /**
     *
     * @var int $BookingQueueID
     * @access public
     */
    public $BookingQueueID = null;

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

    /**
     *
     * @var string $SegmentKey
     * @access public
     */
    public $SegmentKey = null;

    /**
     *
     * @var string $SubQueueCode
     * @access public
     */
    public $SubQueueCode = null;

}

class BookingContact extends StateMessage {

    /**
     *
     * @var string $TypeCode
     * @access public
     */
    public $TypeCode = null;

    /**
     *
     * @var BookingName[] $Names
     * @access public
     */
    public $Names = null;

    /**
     *
     * @var string $EmailAddress
     * @access public
     */
    public $EmailAddress = null;

    /**
     *
     * @var string $HomePhone
     * @access public
     */
    public $HomePhone = null;

    /**
     *
     * @var string $WorkPhone
     * @access public
     */
    public $WorkPhone = null;

    /**
     *
     * @var string $OtherPhone
     * @access public
     */
    public $OtherPhone = null;

    /**
     *
     * @var string $Fax
     * @access public
     */
    public $Fax = null;

    /**
     *
     * @var string $CompanyName
     * @access public
     */
    public $CompanyName = null;

    /**
     *
     * @var string $AddressLine1
     * @access public
     */
    public $AddressLine1 = null;

    /**
     *
     * @var string $AddressLine2
     * @access public
     */
    public $AddressLine2 = null;

    /**
     *
     * @var string $AddressLine3
     * @access public
     */
    public $AddressLine3 = null;

    /**
     *
     * @var string $City
     * @access public
     */
    public $City = null;

    /**
     *
     * @var string $ProvinceState
     * @access public
     */
    public $ProvinceState = null;

    /**
     *
     * @var string $PostalCode
     * @access public
     */
    public $PostalCode = null;

    /**
     *
     * @var string $CountryCode
     * @access public
     */
    public $CountryCode = null;

    /**
     *
     * @var string $CultureCode
     * @access public
     */
    public $CultureCode = null;

    /**
     *
     * @var DistributionOption $DistributionOption
     * @access public
     */
    public $DistributionOption = null;

    /**
     *
     * @var string $CustomerNumber
     * @access public
     */
    public $CustomerNumber = null;

    /**
     *
     * @var NotificationPreference $NotificationPreference
     * @access public
     */
    public $NotificationPreference = null;

    /**
     *
     * @var string $SourceOrganization
     * @access public
     */
    public $SourceOrganization = null;

}

class Payment extends StateMessage {

    /**
     *
     * @var PaymentReferenceType $ReferenceType
     * @access public
     */
    public $ReferenceType = null;

    /**
     *
     * @var int $ReferenceID
     * @access public
     */
    public $ReferenceID = null;

    /**
     *
     * @var PaymentMethodType $PaymentMethodType
     * @access public
     */
    public $PaymentMethodType = null;

    /**
     *
     * @var string $PaymentMethodCode
     * @access public
     */
    public $PaymentMethodCode = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var float $PaymentAmount
     * @access public
     */
    public $PaymentAmount = null;

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

    /**
     *
     * @var float $CollectedAmount
     * @access public
     */
    public $CollectedAmount = null;

    /**
     *
     * @var string $QuotedCurrencyCode
     * @access public
     */
    public $QuotedCurrencyCode = null;

    /**
     *
     * @var float $QuotedAmount
     * @access public
     */
    public $QuotedAmount = null;

    /**
     *
     * @var BookingPaymentStatus $Status
     * @access public
     */
    public $Status = null;

    /**
     *
     * @var string $AccountNumber
     * @access public
     */
    public $AccountNumber = null;

    /**
     *
     * @var int $AccountNumberID
     * @access public
     */
    public $AccountNumberID = null;

    /**
     *
     * @var dateTime $Expiration
     * @access public
     */
    public $Expiration = null;

    /**
     *
     * @var string $AuthorizationCode
     * @access public
     */
    public $AuthorizationCode = null;

    /**
     *
     * @var AuthorizationStatus $AuthorizationStatus
     * @access public
     */
    public $AuthorizationStatus = null;

    /**
     *
     * @var int $ParentPaymentID
     * @access public
     */
    public $ParentPaymentID = null;

    /**
     *
     * @var boolean $Transferred
     * @access public
     */
    public $Transferred = null;

    /**
     *
     * @var int $ReconcilliationID
     * @access public
     */
    public $ReconcilliationID = null;

    /**
     *
     * @var dateTime $FundedDate
     * @access public
     */
    public $FundedDate = null;

    /**
     *
     * @var int $Installments
     * @access public
     */
    public $Installments = null;

    /**
     *
     * @var string $PaymentText
     * @access public
     */
    public $PaymentText = null;

    /**
     *
     * @var ChannelType $ChannelType
     * @access public
     */
    public $ChannelType = null;

    /**
     *
     * @var int $PaymentNumber
     * @access public
     */
    public $PaymentNumber = null;

    /**
     *
     * @var string $AccountName
     * @access public
     */
    public $AccountName = null;

    /**
     *
     * @var PointOfSale $SourcePointOfSale
     * @access public
     */
    public $SourcePointOfSale = null;

    /**
     *
     * @var PointOfSale $PointOfSale
     * @access public
     */
    public $PointOfSale = null;

    /**
     *
     * @var int $PaymentID
     * @access public
     */
    public $PaymentID = null;

    /**
     *
     * @var boolean $Deposit
     * @access public
     */
    public $Deposit = null;

    /**
     *
     * @var int $AccountID
     * @access public
     */
    public $AccountID = null;

    /**
     *
     * @var string $Password
     * @access public
     */
    public $Password = null;

    /**
     *
     * @var string $AccountTransactionCode
     * @access public
     */
    public $AccountTransactionCode = null;

    /**
     *
     * @var int $VoucherID
     * @access public
     */
    public $VoucherID = null;

    /**
     *
     * @var int $VoucherTransactionID
     * @access public
     */
    public $VoucherTransactionID = null;

    /**
     *
     * @var boolean $OverrideVoucherRestrictions
     * @access public
     */
    public $OverrideVoucherRestrictions = null;

    /**
     *
     * @var boolean $OverrideAmount
     * @access public
     */
    public $OverrideAmount = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var boolean $PaymentAddedToState
     * @access public
     */
    public $PaymentAddedToState = null;

    /**
     *
     * @var DCC $DCC
     * @access public
     */
    public $DCC = null;

    /**
     *
     * @var ThreeDSecure $ThreeDSecure
     * @access public
     */
    public $ThreeDSecure = null;

    /**
     *
     * @var PaymentField[] $PaymentFields
     * @access public
     */
    public $PaymentFields = null;

    /**
     *
     * @var PaymentAddress[] $PaymentAddresses
     * @access public
     */
    public $PaymentAddresses = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

    /**
     *
     * @var int $CreatedAgentID
     * @access public
     */
    public $CreatedAgentID = null;

    /**
     *
     * @var dateTime $ModifiedDate
     * @access public
     */
    public $ModifiedDate = null;

    /**
     *
     * @var int $ModifiedAgentID
     * @access public
     */
    public $ModifiedAgentID = null;

    /**
     *
     * @var int $BinRange
     * @access public
     */
    public $BinRange = null;

    /**
     *
     * @var dateTime $ApprovalDate
     * @access public
     */
    public $ApprovalDate = null;

}

class DCC {

    /**
     *
     * @var string $DCCRateID
     * @access public
     */
    public $DCCRateID = null;

    /**
     *
     * @var DCCStatus $DCCStatus
     * @access public
     */
    public $DCCStatus = null;

    /**
     *
     * @var boolean $ValidationDCCApplicable
     * @access public
     */
    public $ValidationDCCApplicable = null;

    /**
     *
     * @var float $ValidationDCCRateValue
     * @access public
     */
    public $ValidationDCCRateValue = null;

    /**
     *
     * @var string $ValidationDCCCurrency
     * @access public
     */
    public $ValidationDCCCurrency = null;

    /**
     *
     * @var float $ValidationDCCAmount
     * @access public
     */
    public $ValidationDCCAmount = null;

    /**
     *
     * @var string $ValidationDCCPutInState
     * @access public
     */
    public $ValidationDCCPutInState = null;

}

class ThreeDSecure {

    /**
     *
     * @var string $BrowserUserAgent
     * @access public
     */
    public $BrowserUserAgent = null;

    /**
     *
     * @var string $BrowserAccept
     * @access public
     */
    public $BrowserAccept = null;

    /**
     *
     * @var string $RemoteIpAddress
     * @access public
     */
    public $RemoteIpAddress = null;

    /**
     *
     * @var string $TermUrl
     * @access public
     */
    public $TermUrl = null;

    /**
     *
     * @var string $ProxyVia
     * @access public
     */
    public $ProxyVia = null;

    /**
     *
     * @var boolean $ValidationTDSApplicable
     * @access public
     */
    public $ValidationTDSApplicable = null;

    /**
     *
     * @var string $ValidationTDSPaReq
     * @access public
     */
    public $ValidationTDSPaReq = null;

    /**
     *
     * @var string $ValidationTDSAcsUrl
     * @access public
     */
    public $ValidationTDSAcsUrl = null;

    /**
     *
     * @var string $ValidationTDSPaRes
     * @access public
     */
    public $ValidationTDSPaRes = null;

    /**
     *
     * @var boolean $ValidationTDSSuccessful
     * @access public
     */
    public $ValidationTDSSuccessful = null;

    /**
     *
     * @var string $ValidationTDSAuthResult
     * @access public
     */
    public $ValidationTDSAuthResult = null;

    /**
     *
     * @var string $ValidationTDSCavv
     * @access public
     */
    public $ValidationTDSCavv = null;

    /**
     *
     * @var string $ValidationTDSCavvAlgorithm
     * @access public
     */
    public $ValidationTDSCavvAlgorithm = null;

    /**
     *
     * @var string $ValidationTDSEci
     * @access public
     */
    public $ValidationTDSEci = null;

    /**
     *
     * @var string $ValidationTDSXid
     * @access public
     */
    public $ValidationTDSXid = null;

}

class PaymentField {

    /**
     *
     * @var string $FieldName
     * @access public
     */
    public $FieldName = null;

    /**
     *
     * @var string $FieldValue
     * @access public
     */
    public $FieldValue = null;

}

class PaymentAddress {

    /**
     *
     * @var int $PaymentID
     * @access public
     */
    public $PaymentID = null;

    /**
     *
     * @var string $CompanyName
     * @access public
     */
    public $CompanyName = null;

    /**
     *
     * @var string $AddressLine1
     * @access public
     */
    public $AddressLine1 = null;

    /**
     *
     * @var string $AddressLine2
     * @access public
     */
    public $AddressLine2 = null;

    /**
     *
     * @var string $AddressLine3
     * @access public
     */
    public $AddressLine3 = null;

    /**
     *
     * @var string $City
     * @access public
     */
    public $City = null;

    /**
     *
     * @var string $ProvinceState
     * @access public
     */
    public $ProvinceState = null;

    /**
     *
     * @var string $PostalCode
     * @access public
     */
    public $PostalCode = null;

    /**
     *
     * @var string $CountryCode
     * @access public
     */
    public $CountryCode = null;

}

class BookingComponent extends StateMessage {

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

    /**
     *
     * @var int $BookingComponentID
     * @access public
     */
    public $BookingComponentID = null;

    /**
     *
     * @var guid $OrderID
     * @access public
     */
    public $OrderID = null;

    /**
     *
     * @var int $ItemSequence
     * @access public
     */
    public $ItemSequence = null;

    /**
     *
     * @var string $SupplierCode
     * @access public
     */
    public $SupplierCode = null;

    /**
     *
     * @var string $SupplierRecordLocator
     * @access public
     */
    public $SupplierRecordLocator = null;

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @var string $SystemRecordLocator
     * @access public
     */
    public $SystemRecordLocator = null;

    /**
     *
     * @var string $RecordReference
     * @access public
     */
    public $RecordReference = null;

    /**
     *
     * @var string $Status
     * @access public
     */
    public $Status = null;

    /**
     *
     * @var string $ServiceTypeCode
     * @access public
     */
    public $ServiceTypeCode = null;

    /**
     *
     * @var string $ItemID
     * @access public
     */
    public $ItemID = null;

    /**
     *
     * @var string $ItemTypeCode
     * @access public
     */
    public $ItemTypeCode = null;

    /**
     *
     * @var string $ItemDescription
     * @access public
     */
    public $ItemDescription = null;

    /**
     *
     * @var dateTime $BeginDate
     * @access public
     */
    public $BeginDate = null;

    /**
     *
     * @var dateTime $EndDate
     * @access public
     */
    public $EndDate = null;

    /**
     *
     * @var string $BeginLocationCode
     * @access public
     */
    public $BeginLocationCode = null;

    /**
     *
     * @var string $EndLocationCode
     * @access public
     */
    public $EndLocationCode = null;

    /**
     *
     * @var int $PassengerID
     * @access public
     */
    public $PassengerID = null;

    /**
     *
     * @var string $CreatedAgentCode
     * @access public
     */
    public $CreatedAgentCode = null;

    /**
     *
     * @var string $CreatedOrganizationCode
     * @access public
     */
    public $CreatedOrganizationCode = null;

    /**
     *
     * @var string $CreatedDomainCode
     * @access public
     */
    public $CreatedDomainCode = null;

    /**
     *
     * @var string $CreatedLocationCode
     * @access public
     */
    public $CreatedLocationCode = null;

    /**
     *
     * @var string $SourceAgentCode
     * @access public
     */
    public $SourceAgentCode = null;

    /**
     *
     * @var string $SourceOrganizationCode
     * @access public
     */
    public $SourceOrganizationCode = null;

    /**
     *
     * @var string $SourceDomainCode
     * @access public
     */
    public $SourceDomainCode = null;

    /**
     *
     * @var string $SourceLocationCode
     * @access public
     */
    public $SourceLocationCode = null;

    /**
     *
     * @var int $CreatedAgentID
     * @access public
     */
    public $CreatedAgentID = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

    /**
     *
     * @var int $ModifiedAgentID
     * @access public
     */
    public $ModifiedAgentID = null;

    /**
     *
     * @var dateTime $ModifiedDate
     * @access public
     */
    public $ModifiedDate = null;

    /**
     *
     * @var BookingComponentCharge[] $BookingComponentCharges
     * @access public
     */
    public $BookingComponentCharges = null;

    /**
     *
     * @var boolean $Historical
     * @access public
     */
    public $Historical = null;

    /**
     *
     * @var OrderItem $OrderItem
     * @access public
     */
    public $OrderItem = null;

    /**
     *
     * @var string $DeclinedText
     * @access public
     */
    public $DeclinedText = null;

    /**
     *
     * @var string $CultureCode
     * @access public
     */
    public $CultureCode = null;

    /**
     *
     * @var OtherServiceInformation $OtherServiceInfo
     * @access public
     */
    public $OtherServiceInfo = null;

    /**
     *
     * @var TCOrderItem $TravelCommerceOrderItem
     * @access public
     */
    public $TravelCommerceOrderItem = null;

}

class BookingComponentCharge extends StateMessage {

    /**
     *
     * @var int $BookingComponentID
     * @access public
     */
    public $BookingComponentID = null;

    /**
     *
     * @var int $ChargeNumber
     * @access public
     */
    public $ChargeNumber = null;

    /**
     *
     * @var ChargeType $ChargeType
     * @access public
     */
    public $ChargeType = null;

    /**
     *
     * @var string $ChargeCode
     * @access public
     */
    public $ChargeCode = null;

    /**
     *
     * @var string $TicketCode
     * @access public
     */
    public $TicketCode = null;

    /**
     *
     * @var CollectType $CollectType
     * @access public
     */
    public $CollectType = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var float $ChargeAmount
     * @access public
     */
    public $ChargeAmount = null;

    /**
     *
     * @var string $ChargeDetail
     * @access public
     */
    public $ChargeDetail = null;

    /**
     *
     * @var string $ForeignCurrencyCode
     * @access public
     */
    public $ForeignCurrencyCode = null;

    /**
     *
     * @var float $ForeignAmount
     * @access public
     */
    public $ForeignAmount = null;

    /**
     *
     * @var dateTime $CreatedDateTime
     * @access public
     */
    public $CreatedDateTime = null;

    /**
     *
     * @var int $CreatedAgentID
     * @access public
     */
    public $CreatedAgentID = null;

}

class OrderItem {

    /**
     *
     * @var string $OrderItemData
     * @access public
     */
    public $OrderItemData = null;

}

class UpdatePassengersRequestData {

    /**
     *
     * @var Passenger[] $Passengers
     * @access public
     */
    public $Passengers = null;

    /**
     *
     * @var boolean $WaiveNameChangeFee
     * @access public
     */
    public $WaiveNameChangeFee = null;

}

class SSRRequest {

    /**
     *
     * @var SegmentSSRRequest[] $SegmentSSRRequests
     * @access public
     */
    public $SegmentSSRRequests = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var boolean $CancelFirstSSR
     * @access public
     */
    public $CancelFirstSSR = null;

    /**
     *
     * @var boolean $SSRFeeForceWaiveOnSell
     * @access public
     */
    public $SSRFeeForceWaiveOnSell = null;

}

class SegmentSSRRequest {

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var PaxSSR[] $PaxSSRs
     * @access public
     */
    public $PaxSSRs = null;

    /**
     *
     * @param dateTime $STD
     * @access public
     */
    public function __construct($STD) {
        $this->STD = $STD;
    }

}

class PriceRequestData {

    /**
     *
     * @var boolean $RefareItinerary
     * @access public
     */
    public $RefareItinerary = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var PointOfSale $SourcePOS
     * @access public
     */
    public $SourcePOS = null;

    /**
     *
     * @var TypeOfSale $TypeOfSale
     * @access public
     */
    public $TypeOfSale = null;

    /**
     *
     * @var string[] $FareTypes
     * @access public
     */
    public $FareTypes = null;

    /**
     *
     * @var Passenger[] $Passengers
     * @access public
     */
    public $Passengers = null;

    /**
     *
     * @var PricingType $PricingType
     * @access public
     */
    public $PricingType = null;

    /**
     *
     * @var boolean $AllowNoFare
     * @access public
     */
    public $AllowNoFare = null;

    /**
     *
     * @var LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public $LoyaltyFilter = null;

}

class CaptureBaggageEventRequestData {

    /**
     *
     * @var string $BaggageEventCode
     * @access public
     */
    public $BaggageEventCode = null;

    /**
     *
     * @var string $OSTag
     * @access public
     */
    public $OSTag = null;

    /**
     *
     * @var int $BaggageID
     * @access public
     */
    public $BaggageID = null;

    /**
     *
     * @var string $EventText
     * @access public
     */
    public $EventText = null;

    /**
     *
     * @var string $LocationCode
     * @access public
     */
    public $LocationCode = null;

    /**
     *
     * @var string $ToLocationCode
     * @access public
     */
    public $ToLocationCode = null;

}

class CaptureBaggageEventResponseData {

    /**
     *
     * @var boolean $Success
     * @access public
     */
    public $Success = null;

}

class FindBaggageEventRequestData {

    /**
     *
     * @var string $OSTag
     * @access public
     */
    public $OSTag = null;

    /**
     *
     * @var dateTime $OSTagStartDate
     * @access public
     */
    public $OSTagStartDate = null;

    /**
     *
     * @var dateTime $OSTagEndDate
     * @access public
     */
    public $OSTagEndDate = null;

}

class FindBaggageEventResponseData {

    /**
     *
     * @var BaggageEvent[] $FindBaggageEvents
     * @access public
     */
    public $FindBaggageEvents = null;

}

class BaggageEvent {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var int $BaggageEventID
     * @access public
     */
    public $BaggageEventID = null;

    /**
     *
     * @var string $BaggageEventCode
     * @access public
     */
    public $BaggageEventCode = null;

    /**
     *
     * @var string $OSTag
     * @access public
     */
    public $OSTag = null;

    /**
     *
     * @var int $BaggageID
     * @access public
     */
    public $BaggageID = null;

    /**
     *
     * @var string $EventText
     * @access public
     */
    public $EventText = null;

    /**
     *
     * @var string $LocationCode
     * @access public
     */
    public $LocationCode = null;

    /**
     *
     * @var string $ToLocationCode
     * @access public
     */
    public $ToLocationCode = null;

    /**
     *
     * @var string $AgentCode
     * @access public
     */
    public $AgentCode = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

}

class GuestValuesRequest {

    /**
     *
     * @var BookingBy $BookingBy
     * @access public
     */
    public $BookingBy = null;

    /**
     *
     * @var BookingByRecordLocator $BookingByRecordLocator
     * @access public
     */
    public $BookingByRecordLocator = null;

    /**
     *
     * @var BookingByBookingID $BookingByID
     * @access public
     */
    public $BookingByID = null;

    /**
     *
     * @var short[] $JourneyNumberList
     * @access public
     */
    public $JourneyNumberList = null;

}

class BookingByRecordLocator {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

}

class BookingByBookingID {

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

}

class PassengerScoresRequest {

    /**
     *
     * @var BookingBy $BookingBy
     * @access public
     */
    public $BookingBy = null;

    /**
     *
     * @var BookingByRecordLocator $BookingByRecordLocator
     * @access public
     */
    public $BookingByRecordLocator = null;

    /**
     *
     * @var BookingByBookingID $BookingByID
     * @access public
     */
    public $BookingByID = null;

    /**
     *
     * @var short[] $JourneyNumberList
     * @access public
     */
    public $JourneyNumberList = null;

    /**
     *
     * @var short[] $PassengerNumberList
     * @access public
     */
    public $PassengerNumberList = null;

    /**
     *
     * @var string $RuleSetName
     * @access public
     */
    public $RuleSetName = null;

}

class PassengerScoresResponse {

    /**
     *
     * @var PassengerScore[] $PaxScoreList
     * @access public
     */
    public $PaxScoreList = null;

    /**
     *
     * @var string $RuleSetName
     * @access public
     */
    public $RuleSetName = null;

}

class PassengerScore {

    /**
     *
     * @var int $JourneyNumber
     * @access public
     */
    public $JourneyNumber = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var int $Score
     * @access public
     */
    public $Score = null;

}

class BookingCommitRequestData {

    /**
     *
     * @var MessageState $State
     * @access public
     */
    public $State = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var int $PaxCount
     * @access public
     */
    public $PaxCount = null;

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

    /**
     *
     * @var int $BookingParentID
     * @access public
     */
    public $BookingParentID = null;

    /**
     *
     * @var string $ParentRecordLocator
     * @access public
     */
    public $ParentRecordLocator = null;

    /**
     *
     * @var string $BookingChangeCode
     * @access public
     */
    public $BookingChangeCode = null;

    /**
     *
     * @var string $GroupName
     * @access public
     */
    public $GroupName = null;

    /**
     *
     * @var PointOfSale $SourcePOS
     * @access public
     */
    public $SourcePOS = null;

    /**
     *
     * @var BookingHold $BookingHold
     * @access public
     */
    public $BookingHold = null;

    /**
     *
     * @var ReceivedByInfo $ReceivedBy
     * @access public
     */
    public $ReceivedBy = null;

    /**
     *
     * @var RecordLocator[] $RecordLocators
     * @access public
     */
    public $RecordLocators = null;

    /**
     *
     * @var Passenger[] $Passengers
     * @access public
     */
    public $Passengers = null;

    /**
     *
     * @var BookingComment[] $BookingComments
     * @access public
     */
    public $BookingComments = null;

    /**
     *
     * @var BookingContact[] $BookingContacts
     * @access public
     */
    public $BookingContacts = null;

    /**
     *
     * @var string $NumericRecordLocator
     * @access public
     */
    public $NumericRecordLocator = null;

    /**
     *
     * @var boolean $RestrictionOverride
     * @access public
     */
    public $RestrictionOverride = null;

    /**
     *
     * @var boolean $ChangeHoldDateTime
     * @access public
     */
    public $ChangeHoldDateTime = null;

    /**
     *
     * @var boolean $WaiveNameChangeFee
     * @access public
     */
    public $WaiveNameChangeFee = null;

    /**
     *
     * @var boolean $WaivePenaltyFee
     * @access public
     */
    public $WaivePenaltyFee = null;

    /**
     *
     * @var boolean $WaiveSpoilageFee
     * @access public
     */
    public $WaiveSpoilageFee = null;

    /**
     *
     * @var boolean $DistributeToContacts
     * @access public
     */
    public $DistributeToContacts = null;

}

class ResellSSR {

    /**
     *
     * @var int $JourneyNumber
     * @access public
     */
    public $JourneyNumber = null;

    /**
     *
     * @var boolean $ResellSSRs
     * @access public
     */
    public $ResellSSRs = null;

    /**
     *
     * @var boolean $ResellSeatSSRs
     * @access public
     */
    public $ResellSeatSSRs = null;

    /**
     *
     * @var boolean $WaiveSeatFee
     * @access public
     */
    public $WaiveSeatFee = null;

}

class UpdateContactsRequestData {

    /**
     *
     * @var BookingContact[] $BookingContactList
     * @access public
     */
    public $BookingContactList = null;

}

class UpdateBookingComponentDataRequestData {

    /**
     *
     * @var BookingComponent[] $BookingComponentList
     * @access public
     */
    public $BookingComponentList = null;

    /**
     *
     * @var UpdateType $UpdateType
     * @access public
     */
    public $UpdateType = null;

}

class UpdateType {

    /**
     *
     * @var boolean $None
     * @access public
     */
    public $None = null;

    /**
     *
     * @var boolean $Payments
     * @access public
     */
    public $Payments = null;

    /**
     *
     * @var boolean $Participants
     * @access public
     */
    public $Participants = null;

}

class TravelCommerceSellRequestData {

    /**
     *
     * @var TCOrderItem[] $OrderItemList
     * @access public
     */
    public $OrderItemList = null;

    /**
     *
     * @var string $CultureCode
     * @access public
     */
    public $CultureCode = null;

}

class TripAvailabilityRequest {

    /**
     *
     * @var AvailabilityRequest[] $AvailabilityRequests
     * @access public
     */
    public $AvailabilityRequests = null;

    /**
     *
     * @var LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public $LoyaltyFilter = null;

}

class AvailabilityRequest {

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var dateTime $BeginDate
     * @access public
     */
    public $BeginDate = null;

    /**
     *
     * @var dateTime $EndDate
     * @access public
     */
    public $EndDate = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $FlightNumber
     * @access public
     */
    public $FlightNumber = null;

    /**
     *
     * @var FlightType $FlightType
     * @access public
     */
    public $FlightType = null;

    /**
     *
     * @var int $PaxCount
     * @access public
     */
    public $PaxCount = null;

    /**
     *
     * @var DOW $Dow
     * @access public
     */
    public $Dow = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var string $DisplayCurrencyCode
     * @access public
     */
    public $DisplayCurrencyCode = null;

    /**
     *
     * @var string $DiscountCode
     * @access public
     */
    public $DiscountCode = null;

    /**
     *
     * @var string $PromotionCode
     * @access public
     */
    public $PromotionCode = null;

    /**
     *
     * @var AvailabilityType $AvailabilityType
     * @access public
     */
    public $AvailabilityType = null;

    /**
     *
     * @var string $SourceOrganization
     * @access public
     */
    public $SourceOrganization = null;

    /**
     *
     * @var int $MaximumConnectingFlights
     * @access public
     */
    public $MaximumConnectingFlights = null;

    /**
     *
     * @var AvailabilityFilter $AvailabilityFilter
     * @access public
     */
    public $AvailabilityFilter = null;

    /**
     *
     * @var FareClassControl $FareClassControl
     * @access public
     */
    public $FareClassControl = null;

    /**
     *
     * @var float $MinimumFarePrice
     * @access public
     */
    public $MinimumFarePrice = null;

    /**
     *
     * @var float $MaximumFarePrice
     * @access public
     */
    public $MaximumFarePrice = null;

    /**
     *
     * @var string $ProductClassCode
     * @access public
     */
    public $ProductClassCode = null;

    /**
     *
     * @var SSRCollectionsMode $SSRCollectionsMode
     * @access public
     */
    public $SSRCollectionsMode = null;

    /**
     *
     * @var InboundOutbound $InboundOutbound
     * @access public
     */
    public $InboundOutbound = null;

    /**
     *
     * @var int $NightsStay
     * @access public
     */
    public $NightsStay = null;

    /**
     *
     * @var boolean $IncludeAllotments
     * @access public
     */
    public $IncludeAllotments = null;

    /**
     *
     * @var Time $BeginTime
     * @access public
     */
    public $BeginTime = null;

    /**
     *
     * @var Time $EndTime
     * @access public
     */
    public $EndTime = null;

    /**
     *
     * @var string[] $DepartureStations
     * @access public
     */
    public $DepartureStations = null;

    /**
     *
     * @var string[] $ArrivalStations
     * @access public
     */
    public $ArrivalStations = null;

    /**
     *
     * @var string[] $FareTypes
     * @access public
     */
    public $FareTypes = null;

    /**
     *
     * @var string[] $ProductClasses
     * @access public
     */
    public $ProductClasses = null;

    /**
     *
     * @var string[] $FareClasses
     * @access public
     */
    public $FareClasses = null;

    /**
     *
     * @var PaxPriceType[] $PaxPriceTypes
     * @access public
     */
    public $PaxPriceTypes = null;

    /**
     *
     * @var JourneySortKey[] $JourneySortKeys
     * @access public
     */
    public $JourneySortKeys = null;

    /**
     *
     * @var char[] $TravelClassCodes
     * @access public
     */
    public $TravelClassCodes = null;

    /**
     *
     * @var boolean $IncludeTaxesAndFees
     * @access public
     */
    public $IncludeTaxesAndFees = null;

    /**
     *
     * @var FareRuleFilter $FareRuleFilter
     * @access public
     */
    public $FareRuleFilter = null;

    /**
     *
     * @var LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public $LoyaltyFilter = null;

    /**
     *
     * @var string $PaxResidentCountry
     * @access public
     */
    public $PaxResidentCountry = null;

    /**
     *
     * @var string[] $TravelClassCodeList
     * @access public
     */
    public $TravelClassCodeList = null;

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @param dateTime $BeginDate
     * @param dateTime $EndDate
     * @param FlightType $FlightType
     * @param int $PaxCount
     * @param DOW $Dow
     * @param AvailabilityType $AvailabilityType
     * @param int $MaximumConnectingFlights
     * @param AvailabilityFilter $AvailabilityFilter
     * @param FareClassControl $FareClassControl
     * @param float $MinimumFarePrice
     * @param float $MaximumFarePrice
     * @param SSRCollectionsMode $SSRCollectionsMode
     * @param InboundOutbound $InboundOutbound
     * @param int $NightsStay
     * @param boolean $IncludeAllotments
     * @param boolean $IncludeTaxesAndFees
     * @param FareRuleFilter $FareRuleFilter
     * @param LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public function __construct($BeginDate, $EndDate, $FlightType, $PaxCount, $Dow, $AvailabilityType, $MaximumConnectingFlights, $AvailabilityFilter, $FareClassControl, $MinimumFarePrice, $MaximumFarePrice, $SSRCollectionsMode, $InboundOutbound, $NightsStay, $IncludeAllotments, $IncludeTaxesAndFees, $FareRuleFilter, $LoyaltyFilter) {
        $this->BeginDate = $BeginDate;
        $this->EndDate = $EndDate;
        $this->FlightType = $FlightType;
        $this->PaxCount = $PaxCount;
        $this->Dow = $Dow;
        $this->AvailabilityType = $AvailabilityType;
        $this->MaximumConnectingFlights = $MaximumConnectingFlights;
        $this->AvailabilityFilter = $AvailabilityFilter;
        $this->FareClassControl = $FareClassControl;
        $this->MinimumFarePrice = $MinimumFarePrice;
        $this->MaximumFarePrice = $MaximumFarePrice;
        $this->SSRCollectionsMode = $SSRCollectionsMode;
        $this->InboundOutbound = $InboundOutbound;
        $this->NightsStay = $NightsStay;
        $this->IncludeAllotments = $IncludeAllotments;
        $this->IncludeTaxesAndFees = $IncludeTaxesAndFees;
        $this->FareRuleFilter = $FareRuleFilter;
        $this->LoyaltyFilter = $LoyaltyFilter;
    }

}

class Time {

    /**
     *
     * @var int $TotalMinutes
     * @access public
     */
    public $TotalMinutes = null;

}

class PaxPriceType {

    /**
     *
     * @var string $PaxType
     * @access public
     */
    public $PaxType = null;

    /**
     *
     * @var string $PaxDiscountCode
     * @access public
     */
    public $PaxDiscountCode = null;

    public function __construct($PaxType = 'ADT') {
        $this->PaxType = $PaxType;
    }

}

class TripAvailabilityResponse extends ServiceMessage {

    /**
     *
     * @var ArrayOfJourneyDateMarket[] $Schedules
     * @access public
     */
    public $Schedules = null;

}

class JourneyDateMarket {

    /**
     *
     * @var dateTime $DepartureDate
     * @access public
     */
    public $DepartureDate = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var Journey[] $Journeys
     * @access public
     */
    public $Journeys = null;

    /**
     *
     * @var boolean $IncludesTaxesAndFees
     * @access public
     */
    public $IncludesTaxesAndFees = null;

}

class AvailabilityResponse extends ServiceMessage {

    /**
     *
     * @var JourneyDateMarket[] $Schedule
     * @access public
     */
    public $Schedule = null;

}

class LowFareTripAvailabilityRequest {

    /**
     *
     * @var boolean $BypassCache
     * @access public
     */
    public $BypassCache = null;

    /**
     *
     * @var boolean $IncludeTaxesAndFees
     * @access public
     */
    public $IncludeTaxesAndFees = null;

    /**
     *
     * @var boolean $GroupBydate
     * @access public
     */
    public $GroupBydate = null;

    /**
     *
     * @var int $ParameterSetID
     * @access public
     */
    public $ParameterSetID = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var string $SourceOrganizationCode
     * @access public
     */
    public $SourceOrganizationCode = null;

    /**
     *
     * @var string $PaxResidentCountry
     * @access public
     */
    public $PaxResidentCountry = null;

    /**
     *
     * @var string $PromotionCode
     * @access public
     */
    public $PromotionCode = null;

    /**
     *
     * @var LowFareAvailabilityRequest[] $LowFareAvailabilityRequestList
     * @access public
     */
    public $LowFareAvailabilityRequestList = null;

    /**
     *
     * @var string[] $BookingClassList
     * @access public
     */
    public $BookingClassList = null;

    /**
     *
     * @var string[] $ProductClassList
     * @access public
     */
    public $ProductClassList = null;

    /**
     *
     * @var string[] $FareTypeList
     * @access public
     */
    public $FareTypeList = null;

    /**
     *
     * @var LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public $LoyaltyFilter = null;

}

class LowFareAvailabilityRequest {

    /**
     *
     * @var string[] $DepartureStationList
     * @access public
     */
    public $DepartureStationList = null;

    /**
     *
     * @var string[] $ArrivalStationList
     * @access public
     */
    public $ArrivalStationList = null;

    /**
     *
     * @var dateTime $BeginDate
     * @access public
     */
    public $BeginDate = null;

    /**
     *
     * @var dateTime $EndDate
     * @access public
     */
    public $EndDate = null;

    /**
     *
     * @param dateTime $BeginDate
     * @param dateTime $EndDate
     * @access public
     */
    public function __construct($BeginDate, $EndDate) {
        $this->BeginDate = $BeginDate;
        $this->EndDate = $EndDate;
    }

}

class LowFareTripAvailabilityResponse {

    /**
     *
     * @var LowFareAvailabilityResponse[] $LowFareAvailabilityResponseList
     * @access public
     */
    public $LowFareAvailabilityResponseList = null;

}

class LowFareAvailabilityResponse {

    /**
     *
     * @var DateMarketLowFare[] $DateMarketLowFareList
     * @access public
     */
    public $DateMarketLowFareList = null;

}

class DateMarketLowFare {

    /**
     *
     * @var string $DepartureCity
     * @access public
     */
    public $DepartureCity = null;

    /**
     *
     * @var string $ArrivalCity
     * @access public
     */
    public $ArrivalCity = null;

    /**
     *
     * @var float $FareAmount
     * @access public
     */
    public $FareAmount = null;

    /**
     *
     * @var float $TaxesAndFeesAmount
     * @access public
     */
    public $TaxesAndFeesAmount = null;

    /**
     *
     * @var dateTime $DepartureDate
     * @access public
     */
    public $DepartureDate = null;

    /**
     *
     * @var dateTime $ExpireUTC
     * @access public
     */
    public $ExpireUTC = null;

    /**
     *
     * @var boolean $IncludesTaxesAndFees
     * @access public
     */
    public $IncludesTaxesAndFees = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $StatusCode
     * @access public
     */
    public $StatusCode = null;

    /**
     *
     * @var float $FarePointAmount
     * @access public
     */
    public $FarePointAmount = null;

}

class MoveAvailabilityRequest {

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var dateTime $BeginDate
     * @access public
     */
    public $BeginDate = null;

    /**
     *
     * @var dateTime $EndDate
     * @access public
     */
    public $EndDate = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $FlightNumber
     * @access public
     */
    public $FlightNumber = null;

    /**
     *
     * @var FlightType $FlightType
     * @access public
     */
    public $FlightType = null;

    /**
     *
     * @var DOW $Dow
     * @access public
     */
    public $Dow = null;

    /**
     *
     * @var AvailabilityType $AvailabilityType
     * @access public
     */
    public $AvailabilityType = null;

    /**
     *
     * @var int $MaximumConnectingFlights
     * @access public
     */
    public $MaximumConnectingFlights = null;

    /**
     *
     * @var AvailabilityFilter $AvailabilityFilter
     * @access public
     */
    public $AvailabilityFilter = null;

    /**
     *
     * @var SSRCollectionsMode $SSRCollectionsMode
     * @access public
     */
    public $SSRCollectionsMode = null;

    /**
     *
     * @var Time $BeginTime
     * @access public
     */
    public $BeginTime = null;

    /**
     *
     * @var Time $EndTime
     * @access public
     */
    public $EndTime = null;

    /**
     *
     * @var Journey $FromJourney
     * @access public
     */
    public $FromJourney = null;

    /**
     *
     * @var string[] $DepartureStations
     * @access public
     */
    public $DepartureStations = null;

    /**
     *
     * @var string[] $ArrivalStations
     * @access public
     */
    public $ArrivalStations = null;

    /**
     *
     * @var JourneySortKey[] $JourneySortKeys
     * @access public
     */
    public $JourneySortKeys = null;

    /**
     *
     * @var MovePassengerJourneyType $MovePassengerJourneyType
     * @access public
     */
    public $MovePassengerJourneyType = null;

    /**
     *
     * @var short[] $PassengerNumberList
     * @access public
     */
    public $PassengerNumberList = null;

}

class MoveAvailabilityResponse {

    /**
     *
     * @var FlyAheadOfferStatus $FlyAheadOfferStatus
     * @access public
     */
    public $FlyAheadOfferStatus = null;

    /**
     *
     * @var JourneyDateMarket[] $Schedule
     * @access public
     */
    public $Schedule = null;

    /**
     *
     * @var Journey $ScheduledFromJourney
     * @access public
     */
    public $ScheduledFromJourney = null;

    /**
     *
     * @var OtherServiceInformation[] $OtherServiceInformationList
     * @access public
     */
    public $OtherServiceInformationList = null;

}

class MoveFeePriceRequest {

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

    /**
     *
     * @var Journey $FromJourney
     * @access public
     */
    public $FromJourney = null;

}

class MoveFeePriceResponse {

    /**
     *
     * @var MoveFeePriceItem[] $MoveFees
     * @access public
     */
    public $MoveFees = null;

}

class MoveFeePriceItem {

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var PassengerFee $PassengerFee
     * @access public
     */
    public $PassengerFee = null;

}

class SeparateSegmentByEquipmentResponseData {

    /**
     *
     * @var ArrayOfLeg[] $LegList
     * @access public
     */
    public $LegList = null;

}

class SSRAvailabilityRequest {

    /**
     *
     * @var string[] $InventoryLegKeys
     * @access public
     */
    public $InventoryLegKeys = null;

    /**
     *
     * @var SSRCollectionsMode $SSRCollectionsMode
     * @access public
     */
    public $SSRCollectionsMode = null;

}

class SSRAvailabilityResponse extends ServiceMessage {

    /**
     *
     * @var Leg[] $Legs
     * @access public
     */
    public $Legs = null;

    /**
     *
     * @var InventorySegmentSSRNest[] $SegmentSSRs
     * @access public
     */
    public $SegmentSSRs = null;

}

class InventorySegmentSSRNest {

    /**
     *
     * @var string $SSRNestCode
     * @access public
     */
    public $SSRNestCode = null;

    /**
     *
     * @var int $MinLegLid
     * @access public
     */
    public $MinLegLid = null;

    /**
     *
     * @var int $MinLegAvailable
     * @access public
     */
    public $MinLegAvailable = null;

}

class SSRAvailabilityForBookingRequest {

    /**
     *
     * @var LegKey[] $SegmentKeyList
     * @access public
     */
    public $SegmentKeyList = null;

    /**
     *
     * @var short[] $PassengerNumberList
     * @access public
     */
    public $PassengerNumberList = null;

    /**
     *
     * @var boolean $InventoryControlled
     * @access public
     */
    public $InventoryControlled = null;

    /**
     *
     * @var boolean $NonInventoryControlled
     * @access public
     */
    public $NonInventoryControlled = null;

    /**
     *
     * @var boolean $SeatDependent
     * @access public
     */
    public $SeatDependent = null;

    /**
     *
     * @var boolean $NonSeatDependent
     * @access public
     */
    public $NonSeatDependent = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

}

class SSRAvailabilityForBookingResponse extends ServiceMessage {

    /**
     *
     * @var SSRSegment[] $SSRSegmentList
     * @access public
     */
    public $SSRSegmentList = null;

}

class SSRSegment {

    /**
     *
     * @var LegKey $LegKey
     * @access public
     */
    public $LegKey = null;

    /**
     *
     * @var AvailablePaxSSR[] $AvailablePaxSSRList
     * @access public
     */
    public $AvailablePaxSSRList = null;

}

class AvailablePaxSSR {

    /**
     *
     * @var string $SSRCode
     * @access public
     */
    public $SSRCode = null;

    /**
     *
     * @var boolean $InventoryControlled
     * @access public
     */
    public $InventoryControlled = null;

    /**
     *
     * @var boolean $NonInventoryControlled
     * @access public
     */
    public $NonInventoryControlled = null;

    /**
     *
     * @var boolean $SeatDependent
     * @access public
     */
    public $SeatDependent = null;

    /**
     *
     * @var boolean $NonSeatDependent
     * @access public
     */
    public $NonSeatDependent = null;

    /**
     *
     * @var int $Available
     * @access public
     */
    public $Available = null;

    /**
     *
     * @var short[] $PassengerNumberList
     * @access public
     */
    public $PassengerNumberList = null;

    /**
     *
     * @var PaxSSRPrice[] $PaxSSRPriceList
     * @access public
     */
    public $PaxSSRPriceList = null;

    /**
     *
     * @var SSRLeg[] $SSRLegList
     * @access public
     */
    public $SSRLegList = null;

}

class PaxSSRPrice {

    /**
     *
     * @var PassengerFee $PaxFee
     * @access public
     */
    public $PaxFee = null;

    /**
     *
     * @var short[] $PassengerNumberList
     * @access public
     */
    public $PassengerNumberList = null;

}

class SSRLeg {

    /**
     *
     * @var LegKey $LegKey
     * @access public
     */
    public $LegKey = null;

    /**
     *
     * @var int $Available
     * @access public
     */
    public $Available = null;

}

class FindBookingRequestData {

    /**
     *
     * @var FindBookingBy $FindBookingBy
     * @access public
     */
    public $FindBookingBy = null;

    /**
     *
     * @var FindByContact $FindByContact
     * @access public
     */
    public $FindByContact = null;

    /**
     *
     * @var FindByRecordLocator $FindByRecordLocator
     * @access public
     */
    public $FindByRecordLocator = null;

    /**
     *
     * @var FindByThirdPartyRecordLocator $FindByThirdPartyRecordLocator
     * @access public
     */
    public $FindByThirdPartyRecordLocator = null;

    /**
     *
     * @var FindByName $FindByName
     * @access public
     */
    public $FindByName = null;

    /**
     *
     * @var FindByAgentID $FindByAgentID
     * @access public
     */
    public $FindByAgentID = null;

    /**
     *
     * @var FindByAgentName $FindByAgentName
     * @access public
     */
    public $FindByAgentName = null;

    /**
     *
     * @var FindByAgencyNumber $FindByAgencyNumber
     * @access public
     */
    public $FindByAgencyNumber = null;

    /**
     *
     * @var FindByEmailAddress $FindByEmailAddress
     * @access public
     */
    public $FindByEmailAddress = null;

    /**
     *
     * @var FindByPhoneNumber $FindByPhoneNumber
     * @access public
     */
    public $FindByPhoneNumber = null;

    /**
     *
     * @var FindByCreditCardNumber $FindByCreditCardNumber
     * @access public
     */
    public $FindByCreditCardNumber = null;

    /**
     *
     * @var FindByCustomerNumber $FindByCustomerNumber
     * @access public
     */
    public $FindByCustomerNumber = null;

    /**
     *
     * @var FindByContactCustomerNumber $FindByContactCustomerNumber
     * @access public
     */
    public $FindByContactCustomerNumber = null;

    /**
     *
     * @var FindByCustomer $FindByCustomer
     * @access public
     */
    public $FindByCustomer = null;

    /**
     *
     * @var FindByBagTag $FindByBagTag
     * @access public
     */
    public $FindByBagTag = null;

    /**
     *
     * @var FindByTravelDocument $FindByTravelDocument
     * @access public
     */
    public $FindByTravelDocument = null;

    /**
     *
     * @var FindByBookingDate $FindByBookingDate
     * @access public
     */
    public $FindByBookingDate = null;

    /**
     *
     * @var int $LastID
     * @access public
     */
    public $LastID = null;

    /**
     *
     * @var int $PageSize
     * @access public
     */
    public $PageSize = null;

    /**
     *
     * @var boolean $SearchArchive
     * @access public
     */
    public $SearchArchive = null;

}

class FindByContact {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var string $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var string $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var string $PhoneNumber
     * @access public
     */
    public $PhoneNumber = null;

    /**
     *
     * @var string $EmailAddress
     * @access public
     */
    public $EmailAddress = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var string $SourceOrganization
     * @access public
     */
    public $SourceOrganization = null;

    /**
     *
     * @var string $OrganizationGroupCode
     * @access public
     */
    public $OrganizationGroupCode = null;

}

class FindByRecordLocator {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var string $SourceOrganization
     * @access public
     */
    public $SourceOrganization = null;

    /**
     *
     * @var string $OrganizationGroupCode
     * @access public
     */
    public $OrganizationGroupCode = null;

}

class FindByThirdPartyRecordLocator {

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var int $AgentID
     * @access public
     */
    public $AgentID = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var string $SourceOrganization
     * @access public
     */
    public $SourceOrganization = null;

    /**
     *
     * @var string $OrganizationGroupCode
     * @access public
     */
    public $OrganizationGroupCode = null;

}

class FindByName {

    /**
     *
     * @var string $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var string $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var boolean $PhoneticSearch
     * @access public
     */
    public $PhoneticSearch = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class Filter {

    /**
     *
     * @var dateTime $DepartureDate
     * @access public
     */
    public $DepartureDate = null;

    /**
     *
     * @var string $FlightOrigin
     * @access public
     */
    public $FlightOrigin = null;

    /**
     *
     * @var string $FlightDestination
     * @access public
     */
    public $FlightDestination = null;

    /**
     *
     * @var string $FlightNumber
     * @access public
     */
    public $FlightNumber = null;

    /**
     *
     * @var string $SourceOrganization
     * @access public
     */
    public $SourceOrganization = null;

    /**
     *
     * @var string $OrganizationGroupCode
     * @access public
     */
    public $OrganizationGroupCode = null;

}

class FindByAgentID {

    /**
     *
     * @var int $AgentID
     * @access public
     */
    public $AgentID = null;

    /**
     *
     * @var string $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var string $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var boolean $PhoneticSearch
     * @access public
     */
    public $PhoneticSearch = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByAgentName {

    /**
     *
     * @var string $AgentName
     * @access public
     */
    public $AgentName = null;

    /**
     *
     * @var string $DomainCode
     * @access public
     */
    public $DomainCode = null;

    /**
     *
     * @var string $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var string $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var boolean $PhoneticSearch
     * @access public
     */
    public $PhoneticSearch = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByAgencyNumber {

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var string $LastName
     * @access public
     */
    public $LastName = null;

    /**
     *
     * @var string $FirstName
     * @access public
     */
    public $FirstName = null;

    /**
     *
     * @var boolean $PhoneticSearch
     * @access public
     */
    public $PhoneticSearch = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByEmailAddress {

    /**
     *
     * @var string $EmailAddress
     * @access public
     */
    public $EmailAddress = null;

    /**
     *
     * @var int $AgentID
     * @access public
     */
    public $AgentID = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByPhoneNumber {

    /**
     *
     * @var string $PhoneNumber
     * @access public
     */
    public $PhoneNumber = null;

    /**
     *
     * @var int $AgentID
     * @access public
     */
    public $AgentID = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByCreditCardNumber {

    /**
     *
     * @var string $CreditCardNumber
     * @access public
     */
    public $CreditCardNumber = null;

    /**
     *
     * @var int $AgentID
     * @access public
     */
    public $AgentID = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByCustomerNumber {

    /**
     *
     * @var string $CustomerNumber
     * @access public
     */
    public $CustomerNumber = null;

    /**
     *
     * @var int $AgentID
     * @access public
     */
    public $AgentID = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByContactCustomerNumber {

    /**
     *
     * @var string $ContactCustomerNumber
     * @access public
     */
    public $ContactCustomerNumber = null;

    /**
     *
     * @var int $AgentID
     * @access public
     */
    public $AgentID = null;

    /**
     *
     * @var string $OrganizationCode
     * @access public
     */
    public $OrganizationCode = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByCustomer {

    /**
     *
     * @var string $CustomerNumber
     * @access public
     */
    public $CustomerNumber = null;

    /**
     *
     * @var string $ContactCustomerNumber
     * @access public
     */
    public $ContactCustomerNumber = null;

    /**
     *
     * @var string $SourceOrganization
     * @access public
     */
    public $SourceOrganization = null;

    /**
     *
     * @var string $OrganizationGroupCode
     * @access public
     */
    public $OrganizationGroupCode = null;

}

class FindByBagTag {

    /**
     *
     * @var string $OSTag
     * @access public
     */
    public $OSTag = null;

    /**
     *
     * @var dateTime $OSTagStartDate
     * @access public
     */
    public $OSTagStartDate = null;

    /**
     *
     * @var dateTime $OSTagEndDate
     * @access public
     */
    public $OSTagEndDate = null;

}

class FindByTravelDocument {

    /**
     *
     * @var string $DocumentType
     * @access public
     */
    public $DocumentType = null;

    /**
     *
     * @var string $DocumentNumber
     * @access public
     */
    public $DocumentNumber = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindByBookingDate {

    /**
     *
     * @var dateTime $StartBookingUTC
     * @access public
     */
    public $StartBookingUTC = null;

    /**
     *
     * @var dateTime $EndBookingUTC
     * @access public
     */
    public $EndBookingUTC = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

}

class FindBookingResponseData extends ServiceMessage {

    /**
     *
     * @var int $Records
     * @access public
     */
    public $Records = null;

    /**
     *
     * @var int $EndingID
     * @access public
     */
    public $EndingID = null;

    /**
     *
     * @var FindBookingData[] $FindBookingDataList
     * @access public
     */
    public $FindBookingDataList = null;

}

class FindBookingData {

    /**
     *
     * @var dateTime $FlightDate
     * @access public
     */
    public $FlightDate = null;

    /**
     *
     * @var string $FromCity
     * @access public
     */
    public $FromCity = null;

    /**
     *
     * @var string $ToCity
     * @access public
     */
    public $ToCity = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

    /**
     *
     * @var int $PassengerID
     * @access public
     */
    public $PassengerID = null;

    /**
     *
     * @var BookingStatus $BookingStatus
     * @access public
     */
    public $BookingStatus = null;

    /**
     *
     * @var string $FlightNumber
     * @access public
     */
    public $FlightNumber = null;

    /**
     *
     * @var ChannelType $ChannelType
     * @access public
     */
    public $ChannelType = null;

    /**
     *
     * @var string $SourceOrganizationCode
     * @access public
     */
    public $SourceOrganizationCode = null;

    /**
     *
     * @var string $SourceDomainCode
     * @access public
     */
    public $SourceDomainCode = null;

    /**
     *
     * @var string $SourceAgentCode
     * @access public
     */
    public $SourceAgentCode = null;

    /**
     *
     * @var boolean $Editable
     * @access public
     */
    public $Editable = null;

    /**
     *
     * @var BookingName $Name
     * @access public
     */
    public $Name = null;

    /**
     *
     * @var dateTime $ExpiredDate
     * @access public
     */
    public $ExpiredDate = null;

    /**
     *
     * @var boolean $AllowedToModifyGDSBooking
     * @access public
     */
    public $AllowedToModifyGDSBooking = null;

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

}

class GetBookingRequestData {

    /**
     *
     * @var GetBookingBy $GetBookingBy
     * @access public
     */
    public $GetBookingBy = GetBookingBy::RecordLocator;

    /**
     *
     * @var GetByRecordLocator $GetByRecordLocator
     * @access public
     */
    public $GetByRecordLocator = null;

    /**
     *
     * @var GetByThirdPartyRecordLocator $GetByThirdPartyRecordLocator
     * @access public
     */
    public $GetByThirdPartyRecordLocator = null;

    /**
     *
     * @var GetByID $GetByID
     * @access public
     */
    public $GetByID = null;

    public function __construct($param = null) {
        $this->GetByRecordLocator = new GetByRecordLocator($param);
    }

}

class GetByRecordLocator {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    public function __construct($param = null) {
        $this->RecordLocator = $param;
    }

}

class GetByThirdPartyRecordLocator {

    /**
     *
     * @var string $SystemCode
     * @access public
     */
    public $SystemCode = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

}

class GetByID {

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

    /**
     *
     * @var boolean $RetrieveFromArchive
     * @access public
     */
    public $RetrieveFromArchive = null;

}

class GetBookingHistoryRequestData {

    /**
     *
     * @var int $BookingID
     * @access public
     */
    public $BookingID = null;

    /**
     *
     * @var string $HistoryCode
     * @access public
     */
    public $HistoryCode = null;

    /**
     *
     * @var boolean $GetTotalCount
     * @access public
     */
    public $GetTotalCount = null;

    /**
     *
     * @var int $LastID
     * @access public
     */
    public $LastID = null;

    /**
     *
     * @var int $PageSize
     * @access public
     */
    public $PageSize = null;

    /**
     *
     * @var boolean $RetrieveFromArchive
     * @access public
     */
    public $RetrieveFromArchive = null;

}

class GetBookingHistoryResponseData {

    /**
     *
     * @var BookingHistory[] $BookingHistories
     * @access public
     */
    public $BookingHistories = null;

    /**
     *
     * @var int $LastID
     * @access public
     */
    public $LastID = null;

    /**
     *
     * @var int $PageSize
     * @access public
     */
    public $PageSize = null;

    /**
     *
     * @var int $TotalCount
     * @access public
     */
    public $TotalCount = null;

}

class BookingHistory {

    /**
     *
     * @var string $HistoryCode
     * @access public
     */
    public $HistoryCode = null;

    /**
     *
     * @var string $HistoryDetail
     * @access public
     */
    public $HistoryDetail = null;

    /**
     *
     * @var PointOfSale $PointOfSale
     * @access public
     */
    public $PointOfSale = null;

    /**
     *
     * @var PointOfSale $SourcePointOfSale
     * @access public
     */
    public $SourcePointOfSale = null;

    /**
     *
     * @var string $ReceivedBy
     * @access public
     */
    public $ReceivedBy = null;

    /**
     *
     * @var string $ReceivedByReference
     * @access public
     */
    public $ReceivedByReference = null;

    /**
     *
     * @var dateTime $CreatedDate
     * @access public
     */
    public $CreatedDate = null;

}

class GetBookingBaggageRequestData {

    /**
     *
     * @var GetByRecordLocator $GetByRecordLocator
     * @access public
     */
    public $GetByRecordLocator = null;

    /**
     *
     * @var boolean $GetFromCurrentState
     * @access public
     */
    public $GetFromCurrentState = null;

}

class AcceptScheduleChangesRequestData {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var boolean $AcceptAllChanges
     * @access public
     */
    public $AcceptAllChanges = null;

    /**
     *
     * @var Segment[] $Segments
     * @access public
     */
    public $Segments = null;

    /**
     *
     * @var string $CurrentQueueCode
     * @access public
     */
    public $CurrentQueueCode = null;

    /**
     *
     * @var string $ErrorQueueCode
     * @access public
     */
    public $ErrorQueueCode = null;

}

class AddBookingCommentsRequestData {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var BookingComment[] $BookingComments
     * @access public
     */
    public $BookingComments = null;

}

class RecordLocatorListRequest {

    /**
     *
     * @var dateTime $DepartureDate
     * @access public
     */
    public $DepartureDate = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $StartFlightNumber
     * @access public
     */
    public $StartFlightNumber = null;

    /**
     *
     * @var string $EndFlightNumber
     * @access public
     */
    public $EndFlightNumber = null;

}

class CancelRequestData {

    /**
     *
     * @var CancelBy $CancelBy
     * @access public
     */
    public $CancelBy = null;

    /**
     *
     * @var CancelJourney $CancelJourney
     * @access public
     */
    public $CancelJourney = null;

    /**
     *
     * @var CancelFee $CancelFee
     * @access public
     */
    public $CancelFee = null;

    /**
     *
     * @var CancelSSR $CancelSSR
     * @access public
     */
    public $CancelSSR = null;

}

class CancelJourney {

    /**
     *
     * @var CancelJourneyRequest $CancelJourneyRequest
     * @access public
     */
    public $CancelJourneyRequest = null;

}

class CancelJourneyRequest {

    /**
     *
     * @var Journey[] $Journeys
     * @access public
     */
    public $Journeys = null;

    /**
     *
     * @var boolean $WaivePenaltyFee
     * @access public
     */
    public $WaivePenaltyFee = null;

    /**
     *
     * @var boolean $WaiveSpoilageFee
     * @access public
     */
    public $WaiveSpoilageFee = null;

    /**
     *
     * @var boolean $PreventReprice
     * @access public
     */
    public $PreventReprice = null;

}

class CancelFee {

    /**
     *
     * @var FeeRequest $FeeRequest
     * @access public
     */
    public $FeeRequest = null;

}

class CancelSSR {

    /**
     *
     * @var SSRRequest $SSRRequest
     * @access public
     */
    public $SSRRequest = null;

}

class DivideRequestData {

    /**
     *
     * @var DivideAction $DivideAction
     * @access public
     */
    public $DivideAction = null;

    /**
     *
     * @var string $SourceRecordLocator
     * @access public
     */
    public $SourceRecordLocator = null;

    /**
     *
     * @var RecordLocator[] $CrsRecordLocators
     * @access public
     */
    public $CrsRecordLocators = null;

    /**
     *
     * @var short[] $PassengerNumbers
     * @access public
     */
    public $PassengerNumbers = null;

    /**
     *
     * @var boolean $AutoDividePayments
     * @access public
     */
    public $AutoDividePayments = null;

    /**
     *
     * @var BookingPaymentTransfer[] $BookingPaymentTransfers
     * @access public
     */
    public $BookingPaymentTransfers = null;

    /**
     *
     * @var boolean $QueueNegativeBalancePNRs
     * @access public
     */
    public $QueueNegativeBalancePNRs = null;

    /**
     *
     * @var boolean $AddComments
     * @access public
     */
    public $AddComments = null;

    /**
     *
     * @var string $ReceivedBy
     * @access public
     */
    public $ReceivedBy = null;

    /**
     *
     * @var boolean $OverrideRestrictions
     * @access public
     */
    public $OverrideRestrictions = null;

    /**
     *
     * @var boolean $CancelChildPNRJourneys
     * @access public
     */
    public $CancelChildPNRJourneys = null;

    /**
     *
     * @var string $ParentEMail
     * @access public
     */
    public $ParentEMail = null;

    /**
     *
     * @var string $ChildEMail
     * @access public
     */
    public $ChildEMail = null;

}

class BookingPaymentTransfer {

    /**
     *
     * @var int $BookingPaymentID
     * @access public
     */
    public $BookingPaymentID = null;

    /**
     *
     * @var float $TransferAmount
     * @access public
     */
    public $TransferAmount = null;

}

class FareOverrideRequestData {

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var float $Amount
     * @access public
     */
    public $Amount = null;

    /**
     *
     * @var string $RuleTariff
     * @access public
     */
    public $RuleTariff = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $RuleNumber
     * @access public
     */
    public $RuleNumber = null;

    /**
     *
     * @var string $FareBasisCode
     * @access public
     */
    public $FareBasisCode = null;

    /**
     *
     * @var Journey $Journey
     * @access public
     */
    public $Journey = null;

}

class GetBookingPaymentsRequestData {

    /**
     *
     * @var GetByRecordLocator $GetByRecordLocator
     * @access public
     */
    public $GetByRecordLocator = null;

    /**
     *
     * @var boolean $GetCurrentState
     * @access public
     */
    public $GetCurrentState = null;

}

class GetBookingPaymentResponseData {

    /**
     *
     * @var Payment[] $Payments
     * @access public
     */
    public $Payments = null;

}

class AddPaymentToBookingRequestData {

    /**
     *
     * @var MessageState $MessageState
     * @access public
     */
    public $MessageState = null;

    /**
     *
     * @var boolean $WaiveFee
     * @access public
     */
    public $WaiveFee = null;

    /**
     *
     * @var PaymentReferenceType $ReferenceType
     * @access public
     */
    public $ReferenceType = null;

    /**
     *
     * @var RequestPaymentMethodType $PaymentMethodType
     * @access public
     */
    public $PaymentMethodType = null;

    /**
     *
     * @var string $PaymentMethodCode
     * @access public
     */
    public $PaymentMethodCode = null;

    /**
     *
     * @var string $QuotedCurrencyCode
     * @access public
     */
    public $QuotedCurrencyCode = null;

    /**
     *
     * @var float $QuotedAmount
     * @access public
     */
    public $QuotedAmount = null;

    /**
     *
     * @var BookingPaymentStatus $Status
     * @access public
     */
    public $Status = null;

    /**
     *
     * @var int $AccountNumberID
     * @access public
     */
    public $AccountNumberID = null;

    /**
     *
     * @var string $AccountNumber
     * @access public
     */
    public $AccountNumber = null;

    /**
     *
     * @var dateTime $Expiration
     * @access public
     */
    public $Expiration = null;

    /**
     *
     * @var int $ParentPaymentID
     * @access public
     */
    public $ParentPaymentID = null;

    /**
     *
     * @var int $Installments
     * @access public
     */
    public $Installments = null;

    /**
     *
     * @var string $PaymentText
     * @access public
     */
    public $PaymentText = null;

    /**
     *
     * @var boolean $Deposit
     * @access public
     */
    public $Deposit = null;

    /**
     *
     * @var PaymentField[] $PaymentFields
     * @access public
     */
    public $PaymentFields = null;

    /**
     *
     * @var PaymentAddress[] $PaymentAddresses
     * @access public
     */
    public $PaymentAddresses = null;

    /**
     *
     * @var AgencyAccount $AgencyAccount
     * @access public
     */
    public $AgencyAccount = null;

    /**
     *
     * @var CreditShell $CreditShell
     * @access public
     */
    public $CreditShell = null;

    /**
     *
     * @var CreditFile $CreditFile
     * @access public
     */
    public $CreditFile = null;

    /**
     *
     * @var PaymentVoucher $PaymentVoucher
     * @access public
     */
    public $PaymentVoucher = null;

    /**
     *
     * @var ThreeDSecureRequest $ThreeDSecureRequest
     * @access public
     */
    public $ThreeDSecureRequest = null;

    /**
     *
     * @var MCCRequest $MCCRequest
     * @access public
     */
    public $MCCRequest = null;

    /**
     *
     * @var string $AuthorizationCode
     * @access public
     */
    public $AuthorizationCode = null;

}

class AgencyAccount {

    /**
     *
     * @var int $AccountID
     * @access public
     */
    public $AccountID = null;

    /**
     *
     * @var int $AccountTransactionID
     * @access public
     */
    public $AccountTransactionID = null;

    /**
     *
     * @var string $Password
     * @access public
     */
    public $Password = null;

}

class CreditShell extends AgencyAccount {

    /**
     *
     * @var string $AccountTransactionCode
     * @access public
     */
    public $AccountTransactionCode = null;

}

class CreditFile extends AgencyAccount {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

}

class PaymentVoucher {

    /**
     *
     * @var int $VoucherIDField
     * @access public
     */
    public $VoucherIDField = null;

    /**
     *
     * @var int $VoucherTransaction
     * @access public
     */
    public $VoucherTransaction = null;

    /**
     *
     * @var boolean $OverrideVoucherRestrictions
     * @access public
     */
    public $OverrideVoucherRestrictions = null;

    /**
     *
     * @var boolean $OverrideAmount
     * @access public
     */
    public $OverrideAmount = null;

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

}

class ThreeDSecureRequest {

    /**
     *
     * @var string $BrowserUserAgent
     * @access public
     */
    public $BrowserUserAgent = null;

    /**
     *
     * @var string $BrowserAccept
     * @access public
     */
    public $BrowserAccept = null;

    /**
     *
     * @var string $RemoteIpAddress
     * @access public
     */
    public $RemoteIpAddress = null;

    /**
     *
     * @var string $TermUrl
     * @access public
     */
    public $TermUrl = null;

    /**
     *
     * @var string $ProxyVia
     * @access public
     */
    public $ProxyVia = null;

}

class MCCRequest {

    /**
     *
     * @var boolean $MCCInUse
     * @access public
     */
    public $MCCInUse = null;

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

    /**
     *
     * @var float $CollectedAmount
     * @access public
     */
    public $CollectedAmount = null;

}

class AddPaymentToBookingResponseData extends ServiceMessage {

    /**
     *
     * @var ValidationPayment $ValidationPayment
     * @access public
     */
    public $ValidationPayment = null;

}

class ValidationPayment {

    /**
     *
     * @var Payment $Payment
     * @access public
     */
    public $Payment = null;

    /**
     *
     * @var PaymentValidationError[] $PaymentValidationErrors
     * @access public
     */
    public $PaymentValidationErrors = null;

}

class PaymentValidationError {

    /**
     *
     * @var PaymentValidationErrorType $ErrorType
     * @access public
     */
    public $ErrorType = null;

    /**
     *
     * @var string $ErrorDescription
     * @access public
     */
    public $ErrorDescription = null;

    /**
     *
     * @var string $AttributeName
     * @access public
     */
    public $AttributeName = null;

}

class ApplyPromotionRequestData {

    /**
     *
     * @var string $PromotionCode
     * @access public
     */
    public $PromotionCode = null;

    /**
     *
     * @var PointOfSale $SourcePointOfSale
     * @access public
     */
    public $SourcePointOfSale = null;

}

class DCCQueryRequestData {

    /**
     *
     * @var string $AccountNumber
     * @access public
     */
    public $AccountNumber = null;

    /**
     *
     * @var AuthorizationStatus $AuthorizationStatus
     * @access public
     */
    public $AuthorizationStatus = null;

    /**
     *
     * @var ChannelType $ChannelType
     * @access public
     */
    public $ChannelType = null;

    /**
     *
     * @var PaymentMethodType $PaymentMethodType
     * @access public
     */
    public $PaymentMethodType = null;

    /**
     *
     * @var string $PaymentMethodCode
     * @access public
     */
    public $PaymentMethodCode = null;

    /**
     *
     * @var string $QuotedCurrencyCode
     * @access public
     */
    public $QuotedCurrencyCode = null;

    /**
     *
     * @var float $QuotedAmount
     * @access public
     */
    public $QuotedAmount = null;

    /**
     *
     * @var BookingPaymentStatus $Status
     * @access public
     */
    public $Status = null;

}

class PaymentFeePriceRequest {

    /**
     *
     * @var string $FeeCode
     * @access public
     */
    public $FeeCode = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var float $PaymentAmount
     * @access public
     */
    public $PaymentAmount = null;

}

class PaymentFeePriceResponse {

    /**
     *
     * @var boolean $IsFixedAmount
     * @access public
     */
    public $IsFixedAmount = null;

    /**
     *
     * @var PassengerFee[] $PassengerFees
     * @access public
     */
    public $PassengerFees = null;

}

class SeatAvailabilityRequest {

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var boolean $IncludeSeatFees
     * @access public
     */
    public $IncludeSeatFees = null;

    /**
     *
     * @var SeatAssignmentMode $SeatAssignmentMode
     * @access public
     */
    public $SeatAssignmentMode = null;

    /**
     *
     * @var string $FlightNumber
     * @access public
     */
    public $FlightNumber = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $OpSuffix
     * @access public
     */
    public $OpSuffix = null;

    /**
     *
     * @var boolean $CompressProperties
     * @access public
     */
    public $CompressProperties = null;

    /**
     *
     * @var boolean $EnforceSeatGroupRestrictions
     * @access public
     */
    public $EnforceSeatGroupRestrictions = null;

    /**
     *
     * @var long[] $PassengerIDs
     * @access public
     */
    public $PassengerIDs = null;

    /**
     *
     * @var PaxSeatPreference[] $PassengerSeatPreferences
     * @access public
     */
    public $PassengerSeatPreferences = null;

    /**
     *
     * @var int $SeatGroup
     * @access public
     */
    public $SeatGroup = null;

    /**
     *
     * @var short[] $SeatGroupSettings
     * @access public
     */
    public $SeatGroupSettings = null;

    /**
     *
     * @var EquipmentDeviation[] $EquipmentDeviations
     * @access public
     */
    public $EquipmentDeviations = null;

    /**
     *
     * @var boolean $IncludePropertyLookup
     * @access public
     */
    public $IncludePropertyLookup = null;

    /**
     *
     * @var string $OverrideCarrierCode
     * @access public
     */
    public $OverrideCarrierCode = null;

    /**
     *
     * @var string $OverrideFlightNumber
     * @access public
     */
    public $OverrideFlightNumber = null;

    /**
     *
     * @var string $OverrideOpSuffix
     * @access public
     */
    public $OverrideOpSuffix = null;

    /**
     *
     * @var dateTime $OverrideSTD
     * @access public
     */
    public $OverrideSTD = null;

    /**
     *
     * @var string $OverrideDepartureStation
     * @access public
     */
    public $OverrideDepartureStation = null;

    /**
     *
     * @var string $OverrideArrivalStation
     * @access public
     */
    public $OverrideArrivalStation = null;

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

    /**
     *
     * @var boolean $ExcludeEquipmentConfiguration
     * @access public
     */
    public $ExcludeEquipmentConfiguration = null;

}

class EquipmentDeviation {

    /**
     *
     * @var string $EquipmentType
     * @access public
     */
    public $EquipmentType = null;

    /**
     *
     * @var string $EquipmentTypeSuffix
     * @access public
     */
    public $EquipmentTypeSuffix = null;

    /**
     *
     * @var string $MarketingCode
     * @access public
     */
    public $MarketingCode = null;

}

class SeatAvailabilityResponse extends ServiceMessage {

    /**
     *
     * @var EquipmentInfo[] $EquipmentInfos
     * @access public
     */
    public $EquipmentInfos = null;

    /**
     *
     * @var SeatGroupPassengerFee[] $SeatGroupPassengerFees
     * @access public
     */
    public $SeatGroupPassengerFees = null;

    /**
     *
     * @var SeatAvailabilityLeg[] $Legs
     * @access public
     */
    public $Legs = null;

    /**
     *
     * @var EquipmentPropertyTypeCodesLookup $PropertyTypeCodesLookup
     * @access public
     */
    public $PropertyTypeCodesLookup = null;

}

class SeatGroupPassengerFee {

    /**
     *
     * @var int $SeatGroup
     * @access public
     */
    public $SeatGroup = null;

    /**
     *
     * @var PassengerFee $PassengerFee
     * @access public
     */
    public $PassengerFee = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

}

class SeatAvailabilityLeg {

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var dateTime $STA
     * @access public
     */
    public $STA = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var string $AircraftType
     * @access public
     */
    public $AircraftType = null;

    /**
     *
     * @var string $AircraftTypeSuffix
     * @access public
     */
    public $AircraftTypeSuffix = null;

    /**
     *
     * @var int $EquipmentIndex
     * @access public
     */
    public $EquipmentIndex = null;

}

class SeatSellRequest {

    /**
     *
     * @var UnitHoldType $BlockType
     * @access public
     */
    public $BlockType = null;

    /**
     *
     * @var boolean $SameSeatRequiredOnThruLegs
     * @access public
     */
    public $SameSeatRequiredOnThruLegs = null;

    /**
     *
     * @var boolean $AssignNoSeatIfAlreadyTaken
     * @access public
     */
    public $AssignNoSeatIfAlreadyTaken = null;

    /**
     *
     * @var boolean $AllowSeatSwappingInPNR
     * @access public
     */
    public $AllowSeatSwappingInPNR = null;

    /**
     *
     * @var boolean $WaiveFee
     * @access public
     */
    public $WaiveFee = null;

    /**
     *
     * @var boolean $ReplaceSpecificSeatRequest
     * @access public
     */
    public $ReplaceSpecificSeatRequest = null;

    /**
     *
     * @var SeatAssignmentMode $SeatAssignmentMode
     * @access public
     */
    public $SeatAssignmentMode = null;

    /**
     *
     * @var boolean $IgnoreSeatSSRs
     * @access public
     */
    public $IgnoreSeatSSRs = null;

    /**
     *
     * @var SegmentSeatRequest[] $SegmentSeatRequests
     * @access public
     */
    public $SegmentSeatRequests = null;

    /**
     *
     * @var EquipmentDeviation[] $EquipmentDeviations
     * @access public
     */
    public $EquipmentDeviations = null;

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

}

class SegmentSeatRequest {

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var short[] $PassengerNumbers
     * @access public
     */
    public $PassengerNumbers = null;

    /**
     *
     * @var string $UnitDesignator
     * @access public
     */
    public $UnitDesignator = null;

    /**
     *
     * @var string $CompartmentDesignator
     * @access public
     */
    public $CompartmentDesignator = null;

    /**
     *
     * @var PaxSeatPreference[] $PassengerSeatPreferences
     * @access public
     */
    public $PassengerSeatPreferences = null;

    /**
     *
     * @var long[] $PassengerIDs
     * @access public
     */
    public $PassengerIDs = null;

    /**
     *
     * @var string[] $RequestedSSRs
     * @access public
     */
    public $RequestedSSRs = null;

}

class CommitRequestData extends ServiceMessage {

    /**
     *
     * @var Booking $Booking
     * @access public
     */
    public $Booking = null;

    /**
     *
     * @var boolean $RestrictionOverride
     * @access public
     */
    public $RestrictionOverride = null;

    /**
     *
     * @var boolean $ChangeHoldDateTime
     * @access public
     */
    public $ChangeHoldDateTime = null;

    /**
     *
     * @var boolean $WaiveNameChangeFee
     * @access public
     */
    public $WaiveNameChangeFee = null;

    /**
     *
     * @var boolean $WaivePenaltyFee
     * @access public
     */
    public $WaivePenaltyFee = null;

    /**
     *
     * @var boolean $WaiveSpoilageFee
     * @access public
     */
    public $WaiveSpoilageFee = null;

    /**
     *
     * @var boolean $DistributeToContacts
     * @access public
     */
    public $DistributeToContacts = null;

}

class ItineraryPriceRequest {

    /**
     *
     * @var PriceItineraryBy $PriceItineraryBy
     * @access public
     */
    public $PriceItineraryBy = null;

    /**
     *
     * @var TypeOfSale $TypeOfSale
     * @access public
     */
    public $TypeOfSale = null;

    /**
     *
     * @var SSRRequest $SSRRequest
     * @access public
     */
    public $SSRRequest = null;

    /**
     *
     * @var SellJourneyByKeyRequestData $SellByKeyRequest
     * @access public
     */
    public $SellByKeyRequest = null;

    /**
     *
     * @var PriceJourneyRequestData $PriceJourneyWithLegsRequest
     * @access public
     */
    public $PriceJourneyWithLegsRequest = null;

    /**
     *
     * @param PriceItineraryBy $PriceItineraryBy
     * @access public
     */
    public function __construct($PriceItineraryBy) {
        $this->PriceItineraryBy = $PriceItineraryBy;
    }

}

class SellJourneyByKeyRequestData {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var SellKeyList[] $JourneySellKeys
     * @access public
     */
    public $JourneySellKeys = null;

    /**
     *
     * @var PaxPriceType[] $PaxPriceType
     * @access public
     */
    public $PaxPriceType = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var PointOfSale $SourcePOS
     * @access public
     */
    public $SourcePOS = null;

    /**
     *
     * @var int $PaxCount
     * @access public
     */
    public $PaxCount = null;

    /**
     *
     * @var TypeOfSale $TypeOfSale
     * @access public
     */
    public $TypeOfSale = null;

    /**
     *
     * @var LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public $LoyaltyFilter = null;

    /**
     *
     * @var boolean $IsAllotmentMarketFare
     * @access public
     */
    public $IsAllotmentMarketFare = null;

}

class PriceJourneyRequestData {

    /**
     *
     * @var PriceJourney[] $PriceJourneys
     * @access public
     */
    public $PriceJourneys = null;

    /**
     *
     * @var int $PaxCount
     * @access public
     */
    public $PaxCount = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var PointOfSale $SourcePOS
     * @access public
     */
    public $SourcePOS = null;

    /**
     *
     * @var TypeOfSale $TypeOfSale
     * @access public
     */
    public $TypeOfSale = null;

    /**
     *
     * @var Passenger[] $Passengers
     * @access public
     */
    public $Passengers = null;

    /**
     *
     * @var LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public $LoyaltyFilter = null;

    /**
     *
     * @param int $PaxCount
     * @param LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public function __construct($PaxCount, $LoyaltyFilter) {
        $this->PaxCount = $PaxCount;
        $this->LoyaltyFilter = $LoyaltyFilter;
    }

}

class PriceJourney extends StateMessage {

    /**
     *
     * @var PriceSegment[] $Segments
     * @access public
     */
    public $Segments = null;

}

class PriceSegment extends StateMessage {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var dateTime $STA
     * @access public
     */
    public $STA = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var string $CabinOfService
     * @access public
     */
    public $CabinOfService = null;

    /**
     *
     * @var string $ChangeReasonCode
     * @access public
     */
    public $ChangeReasonCode = null;

    /**
     *
     * @var string $PriorityCode
     * @access public
     */
    public $PriorityCode = null;

    /**
     *
     * @var string $SegmentType
     * @access public
     */
    public $SegmentType = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var FlightDesignator $XrefFlightDesignator
     * @access public
     */
    public $XrefFlightDesignator = null;

    /**
     *
     * @var SellFare $Fare
     * @access public
     */
    public $Fare = null;

    /**
     *
     * @var PriceLeg[] $PriceLegs
     * @access public
     */
    public $PriceLegs = null;

}

class SellFare extends StateMessage {

    /**
     *
     * @var string $ClassOfService
     * @access public
     */
    public $ClassOfService = null;

    /**
     *
     * @var string $ClassType
     * @access public
     */
    public $ClassType = null;

    /**
     *
     * @var string $RuleTariff
     * @access public
     */
    public $RuleTariff = null;

    /**
     *
     * @var string $CarrierCode
     * @access public
     */
    public $CarrierCode = null;

    /**
     *
     * @var string $RuleNumber
     * @access public
     */
    public $RuleNumber = null;

    /**
     *
     * @var string $FareBasisCode
     * @access public
     */
    public $FareBasisCode = null;

    /**
     *
     * @var int $FareSequence
     * @access public
     */
    public $FareSequence = null;

    /**
     *
     * @var string $FareClassOfService
     * @access public
     */
    public $FareClassOfService = null;

    /**
     *
     * @var string $XrefClassOfService
     * @access public
     */
    public $XrefClassOfService = null;

    /**
     *
     * @var string $ProductClass
     * @access public
     */
    public $ProductClass = null;

    /**
     *
     * @var boolean $IsAllotmentMarketFare
     * @access public
     */
    public $IsAllotmentMarketFare = null;

    /**
     *
     * @var FareApplicationType $FareApplicationType
     * @access public
     */
    public $FareApplicationType = null;

}

class PriceLeg extends StateMessage {

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var dateTime $STA
     * @access public
     */
    public $STA = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

}

class SellRequestData {

    /**
     *
     * @var SellBy $SellBy
     * @access public
     */
    public $SellBy = null;

    /**
     *
     * @var SellJourneyByKeyRequest $SellJourneyByKeyRequest
     * @access public
     */
    public $SellJourneyByKeyRequest = null;

    /**
     *
     * @var SellJourneyRequest $SellJourneyRequest
     * @access public
     */
    public $SellJourneyRequest = null;

    /**
     *
     * @var SellSSR $SellSSR
     * @access public
     */
    public $SellSSR = null;

    /**
     *
     * @var SellFee $SellFee
     * @access public
     */
    public $SellFee = null;

}

class SellJourneyByKeyRequest {

    /**
     *
     * @var SellJourneyByKeyRequestData $SellJourneyByKeyRequestData
     * @access public
     */
    public $SellJourneyByKeyRequestData = null;

}

class SellJourneyRequest {

    /**
     *
     * @var SellJourneyRequestData $SellJourneyRequestData
     * @access public
     */
    public $SellJourneyRequestData = null;

}

class SellJourneyRequestData {

    /**
     *
     * @var SellJourney[] $Journeys
     * @access public
     */
    public $Journeys = null;

    /**
     *
     * @var int $PaxCount
     * @access public
     */
    public $PaxCount = null;

    /**
     *
     * @var string $CurrencyCode
     * @access public
     */
    public $CurrencyCode = null;

    /**
     *
     * @var PointOfSale $SourcePOS
     * @access public
     */
    public $SourcePOS = null;

    /**
     *
     * @var TypeOfSale $TypeOfSale
     * @access public
     */
    public $TypeOfSale = null;

    /**
     *
     * @var Passenger[] $Passengers
     * @access public
     */
    public $Passengers = null;

    /**
     *
     * @var boolean $SuppressPaxAgeValidation
     * @access public
     */
    public $SuppressPaxAgeValidation = null;

    /**
     *
     * @var LoyaltyFilter $LoyaltyFilter
     * @access public
     */
    public $LoyaltyFilter = null;

}

class SellJourney extends StateMessage {

    /**
     *
     * @var boolean $NotForGeneralUse
     * @access public
     */
    public $NotForGeneralUse = null;

    /**
     *
     * @var SellSegment[] $Segments
     * @access public
     */
    public $Segments = null;

}

class SellSegment extends StateMessage {

    /**
     *
     * @var string $ActionStatusCode
     * @access public
     */
    public $ActionStatusCode = null;

    /**
     *
     * @var string $ArrivalStation
     * @access public
     */
    public $ArrivalStation = null;

    /**
     *
     * @var string $CabinOfService
     * @access public
     */
    public $CabinOfService = null;

    /**
     *
     * @var string $ChangeReasonCode
     * @access public
     */
    public $ChangeReasonCode = null;

    /**
     *
     * @var string $DepartureStation
     * @access public
     */
    public $DepartureStation = null;

    /**
     *
     * @var string $PriorityCode
     * @access public
     */
    public $PriorityCode = null;

    /**
     *
     * @var string $SegmentType
     * @access public
     */
    public $SegmentType = null;

    /**
     *
     * @var dateTime $STA
     * @access public
     */
    public $STA = null;

    /**
     *
     * @var dateTime $STD
     * @access public
     */
    public $STD = null;

    /**
     *
     * @var FlightDesignator $FlightDesignator
     * @access public
     */
    public $FlightDesignator = null;

    /**
     *
     * @var FlightDesignator $XrefFlightDesignator
     * @access public
     */
    public $XrefFlightDesignator = null;

    /**
     *
     * @var SellFare $Fare
     * @access public
     */
    public $Fare = null;

}

class SellSSR {

    /**
     *
     * @var SSRRequest $SSRRequest
     * @access public
     */
    public $SSRRequest = null;

}

class SellFee {

    /**
     *
     * @var SellFeeRequestData $SellFeeRequestData
     * @access public
     */
    public $SellFeeRequestData = null;

}

class SellFeeRequestData {

    /**
     *
     * @var string $FeeCode
     * @access public
     */
    public $FeeCode = null;

    /**
     *
     * @var string $OriginatingStationCode
     * @access public
     */
    public $OriginatingStationCode = null;

    /**
     *
     * @var string $CollectedCurrencyCode
     * @access public
     */
    public $CollectedCurrencyCode = null;

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var string $Note
     * @access public
     */
    public $Note = null;

    /**
     *
     * @var SellFeeType $SellFeeType
     * @access public
     */
    public $SellFeeType = null;

}

class UpdateFeeStatusRequestData {

    /**
     *
     * @var string $RecordLocator
     * @access public
     */
    public $RecordLocator = null;

    /**
     *
     * @var FeeStatusRequest[] $FeeStatusRequests
     * @access public
     */
    public $FeeStatusRequests = null;

}

class FeeStatusRequest {

    /**
     *
     * @var int $PassengerNumber
     * @access public
     */
    public $PassengerNumber = null;

    /**
     *
     * @var int $FeeNumber
     * @access public
     */
    public $FeeNumber = null;

    /**
     *
     * @var string $Notes
     * @access public
     */
    public $Notes = null;

    /**
     *
     * @var MessageState $State
     * @access public
     */
    public $State = null;

}

class ServiceCancelRequest {

    /**
     *
     * @var string[] $ItemIDList
     * @access public
     */
    public $ItemIDList = null;

}

class UpdateTicketsRequest {

    /**
     *
     * @var TicketRequest $TicketRequest
     * @access public
     */
    public $TicketRequest = null;

}

class UpdateTicketsResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class UpgradeRequest {

    /**
     *
     * @var UpgradeRequestData $UpgradeRequestData
     * @access public
     */
    public $UpgradeRequestData = null;

}

class UpgradeResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class DowngradeRequest {

    /**
     *
     * @var DowngradeRequestData $DowngradeRequestData
     * @access public
     */
    public $DowngradeRequestData = null;

}

class DowngradeResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class GetUpgradeAvailabilityRequest {

    /**
     *
     * @var UpgradeAvailabilityRequest $UpgradeAvailabilityRequest
     * @access public
     */
    public $UpgradeAvailabilityRequest = null;

}

class GetUpgradeAvailabilityResponse {

    /**
     *
     * @var UpgradeAvailabilityResponse $UpgradeAvailabilityResponse
     * @access public
     */
    public $UpgradeAvailabilityResponse = null;

}

class ChangeSourcePointOfSaleRequest {

    /**
     *
     * @var UpdateSourcePointOfSaleRequest $UpdateSourcePointOfSaleRequest
     * @access public
     */
    public $UpdateSourcePointOfSaleRequest = null;

}

class ChangeSourcePointOfSaleResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class GetEquipmentPropertiesRequest {

    /**
     *
     * @var EquipmentListRequest $EquipmentListRequest
     * @access public
     */
    public $EquipmentListRequest = null;

}

class GetEquipmentPropertiesResponse {

    /**
     *
     * @var EquipmentListResponse $EquipmentListResponse
     * @access public
     */
    public $EquipmentListResponse = null;

}

class OverrideFeeRequest {

    /**
     *
     * @var FeeRequest $FeeRequest
     * @access public
     */
    public $FeeRequest = null;

}

class OverrideFeeResponse {

    /**
     *
     * @var Booking $Booking
     * @access public
     */
    public $Booking = null;

}

class UpdatePassengersRequest {

    /**
     *
     * @var UpdatePassengersRequestData $updatePassengersRequestData
     * @access public
     */
    public $updatePassengersRequestData = null;

}

class UpdatePassengerResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class UpdateSSRRequest {

    /**
     *
     * @var SSRRequest $SSRRequest
     * @access public
     */
    public $SSRRequest = null;

}

class UpdateSSRResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class UpdatePriceRequest {

    /**
     *
     * @var PriceRequestData $PriceRequestData
     * @access public
     */
    public $PriceRequestData = null;

}

class UpdatePriceResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class CaptureBaggageEventRequest {

    /**
     *
     * @var CaptureBaggageEventRequestData $CaptureBaggageEventRequestData
     * @access public
     */
    public $CaptureBaggageEventRequestData = null;

}

class CaptureBaggageEventResponse {

    /**
     *
     * @var CaptureBaggageEventResponseData $CaptureBaggageEventResponseData
     * @access public
     */
    public $CaptureBaggageEventResponseData = null;

}

class CalculateGuestValuesRequest {

    /**
     *
     * @var GuestValuesRequest $GuestValuesRequest
     * @access public
     */
    public $GuestValuesRequest = null;

}

class CalculateGuestValuesResponse {

    /**
     *
     * @var boolean $Succeeded
     * @access public
     */
    public $Succeeded = null;

}

class ScorePassengersRequest {

    /**
     *
     * @var PassengerScoresRequest $PassengerScoresRequest
     * @access public
     */
    public $PassengerScoresRequest = null;

}

class ScorePassengersResponse {

    /**
     *
     * @var PassengerScoresResponse $GetPassengerScoresResponse
     * @access public
     */
    public $GetPassengerScoresResponse = null;

}

class BookingCommitRequest {

    /**
     *
     * @var BookingCommitRequestData $BookingCommitRequestData
     * @access public
     */
    public $BookingCommitRequestData = null;

}

class BookingCommitResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class ResellSSRRequest {

    /**
     *
     * @var ResellSSR $ResellSSR
     * @access public
     */
    public $ResellSSR = null;

}

class ResellSSRResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class UpdateContactsRequest {

    /**
     *
     * @var UpdateContactsRequestData $updateContactsRequestData
     * @access public
     */
    public $updateContactsRequestData = null;

}

class UpdateContactsResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class UpdateBookingComponentDataRequest {

    /**
     *
     * @var UpdateBookingComponentDataRequestData $UpdateBookingComponentDataRequestData
     * @access public
     */
    public $UpdateBookingComponentDataRequestData = null;

}

class UpdateBookingComponentDataResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class TravelCommerceSellRequest {

    /**
     *
     * @var TravelCommerceSellRequestData $TravelCommerceSellRequestData
     * @access public
     */
    public $TravelCommerceSellRequestData = null;

}

class TravelCommerceSellResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class TravelCommerceCancelServiceRequest {

    /**
     *
     * @var ServiceCancelRequest $ServiceCancelRequest
     * @access public
     */
    public $ServiceCancelRequest = null;

}

class TravelCommerceCancelServiceResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class GetAvailabilityRequest {

    /**
     *
     * @var TripAvailabilityRequest $TripAvailabilityRequest
     * @access public
     */
    public $TripAvailabilityRequest = null;

    /**
     *
     * @param TripAvailabilityRequest $TripAvailabilityRequest
     * @access public
     */
    public function __construct($TripAvailabilityRequest) {
        $this->TripAvailabilityRequest = $TripAvailabilityRequest;
    }

}

class GetAvailabilityByTripResponse {

    /**
     *
     * @var TripAvailabilityResponse $GetTripAvailabilityResponse
     * @access public
     */
    public $GetTripAvailabilityResponse = null;

}

class GetLowFareAvailabilityRequest {

    /**
     *
     * @var AvailabilityRequest $AvailabilityRequest
     * @access public
     */
    public $AvailabilityRequest = null;

}

class GetLowFareAvailabilityResponse {

    /**
     *
     * @var AvailabilityResponse $GetAvailabilityResponse
     * @access public
     */
    public $GetAvailabilityResponse = null;

}

class GetLowFareTripAvailabilityRequest {

    /**
     *
     * @var LowFareTripAvailabilityRequest $LowFareTripAvailabilityRequest
     * @access public
     */
    public $LowFareTripAvailabilityRequest = null;

}

class GetLowFareTripAvailabilityResponse {

    /**
     *
     * @var LowFareTripAvailabilityResponse $LowFareTripAvailabilityResponse
     * @access public
     */
    public $LowFareTripAvailabilityResponse = null;

}

class GetMoveAvailabilityRequest {

    /**
     *
     * @var MoveAvailabilityRequest $MoveAvailabilityRequest
     * @access public
     */
    public $MoveAvailabilityRequest = null;

}

class GetMoveAvailabilityResponse {

    /**
     *
     * @var MoveAvailabilityResponse $MoveAvailabilityResponse
     * @access public
     */
    public $MoveAvailabilityResponse = null;

}

class GetMoveFeePriceRequest {

    /**
     *
     * @var MoveFeePriceRequest $MoveFeePriceRequest
     * @access public
     */
    public $MoveFeePriceRequest = null;

}

class GetMoveFeePriceResponse {

    /**
     *
     * @var MoveFeePriceResponse $MoveFeePriceResponse
     * @access public
     */
    public $MoveFeePriceResponse = null;

}

class GetSSRAvailabilityRequest {

    /**
     *
     * @var SSRAvailabilityRequest $SSRAvailabilityRequest
     * @access public
     */
    public $SSRAvailabilityRequest = null;

}

class GetSSRAvailabilityResponse {

    /**
     *
     * @var SSRAvailabilityResponse $SSRAvailabilityResponse
     * @access public
     */
    public $SSRAvailabilityResponse = null;

}

class GetSSRAvailabilityForBookingRequest {

    /**
     *
     * @var SSRAvailabilityForBookingRequest $SSRAvailabilityForBookingRequest
     * @access public
     */
    public $SSRAvailabilityForBookingRequest = null;

}

class GetSSRAvailabilityForBookingResponse {

    /**
     *
     * @var SSRAvailabilityForBookingResponse $SSRAvailabilityForBookingResponse
     * @access public
     */
    public $SSRAvailabilityForBookingResponse = null;

}

class GetBookingRequest {

    /**
     *
     * @var GetBookingRequestData $GetBookingReqData
     * @access public
     */
    public $GetBookingReqData = null;

    public function __construct($param = null) {
        $this->GetBookingReqData = new GetBookingRequestData($param);
    }

}

class GetBookingResponse {

    /**
     *
     * @var Booking $Booking
     * @access public
     */
    public $Booking = null;

}

class GetBookingFromStateResponse {

    /**
     *
     * @var Booking $BookingData
     * @access public
     */
    public $BookingData = null;

}

class GetBookingHistoryRequest {

    /**
     *
     * @var GetBookingHistoryRequestData $GetBookingHistoryReqData
     * @access public
     */
    public $GetBookingHistoryReqData = null;

}

class GetBookingHistoryResponse {

    /**
     *
     * @var GetBookingHistoryResponseData $GetBookingHistoryResponseData
     * @access public
     */
    public $GetBookingHistoryResponseData = null;

}

class GetBookingBaggageRequest {

    /**
     *
     * @var GetBookingBaggageRequestData $GetBookingBaggageReqData
     * @access public
     */
    public $GetBookingBaggageReqData = null;

}

class GetBookingBaggageResponse {

    /**
     *
     * @var PassengerBag[] $PassengerBags
     * @access public
     */
    public $PassengerBags = null;

}

class AcceptScheduleChangesRequest {

    /**
     *
     * @var AcceptScheduleChangesRequestData $AcceptScheduleChangesRequestData
     * @access public
     */
    public $AcceptScheduleChangesRequestData = null;

}

class AddBookingCommentsRequest {

    /**
     *
     * @var AddBookingCommentsRequestData $AddBookingCommentsReqData
     * @access public
     */
    public $AddBookingCommentsReqData = null;

}

class AddBookingCommentsResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class GetRecordLocatorListRequest {

    /**
     *
     * @var RecordLocatorListRequest $RecordLocatorRequest
     * @access public
     */
    public $RecordLocatorRequest = null;

}

class GetRecordLocatorListResponse {

    /**
     *
     * @var string[] $RecordLocatorList
     * @access public
     */
    public $RecordLocatorList = null;

}

class CancelRequest {

    /**
     *
     * @var CancelRequestData $CancelRequestData
     * @access public
     */
    public $CancelRequestData = null;

}

class CancelResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class DivideRequest {

    /**
     *
     * @var DivideRequestData $DivideReqData
     * @access public
     */
    public $DivideReqData = null;

}

class DivideResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class FareOverrideRequest {

    /**
     *
     * @var FareOverrideRequestData $FareOverrideRequestData
     * @access public
     */
    public $FareOverrideRequestData = null;

}

class FareOverrideResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class GetBookingPaymentsRequest {

    /**
     *
     * @var GetBookingPaymentsRequestData $GetBookingPaymentsReqData
     * @access public
     */
    public $GetBookingPaymentsReqData = null;

}

class GetBookingPaymentsResponse {

    /**
     *
     * @var GetBookingPaymentResponseData $getBookingPaymentRespData
     * @access public
     */
    public $getBookingPaymentRespData = null;

}

class AddPaymentToBookingRequest {

    /**
     *
     * @var AddPaymentToBookingRequestData $addPaymentToBookingReqData
     * @access public
     */
    public $addPaymentToBookingReqData = null;

}

class AddPaymentToBookingResponse {

    /**
     *
     * @var AddPaymentToBookingResponseData $BookingPaymentResponse
     * @access public
     */
    public $BookingPaymentResponse = null;

}

class AddInProcessPaymentToBookingRequest {

    /**
     *
     * @var Payment $Payment
     * @access public
     */
    public $Payment = null;

}

class AddInProcessPaymentToBookingResponse {

    /**
     *
     * @var AddPaymentToBookingResponseData $BookingPaymentResponse
     * @access public
     */
    public $BookingPaymentResponse = null;

}

class ApplyPromotionRequest {

    /**
     *
     * @var ApplyPromotionRequestData $ApplyPromotionReqData
     * @access public
     */
    public $ApplyPromotionReqData = null;

}

class ApplyPromotionResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class DCCQueryRequest {

    /**
     *
     * @var DCCQueryRequestData $DCCQueryRequestData
     * @access public
     */
    public $DCCQueryRequestData = null;

}

class DCCQueryResponse {

    /**
     *
     * @var ValidationPayment $DCCQueryPaymentResponse
     * @access public
     */
    public $DCCQueryPaymentResponse = null;

}

class DCCPaymentResponse {

    /**
     *
     * @var Payment $PaymentResponse
     * @access public
     */
    public $PaymentResponse = null;

}

class GetPaymentFeePriceRequest {

    /**
     *
     * @var PaymentFeePriceRequest $paymentFeePriceReqData
     * @access public
     */
    public $paymentFeePriceReqData = null;

}

class GetPaymentFeePriceResponse {

    /**
     *
     * @var PaymentFeePriceResponse $paymentFeePriceRespData
     * @access public
     */
    public $paymentFeePriceRespData = null;

}

class GetSeatAvailabilityRequest {

    /**
     *
     * @var SeatAvailabilityRequest $SeatAvailabilityRequest
     * @access public
     */
    public $SeatAvailabilityRequest = null;

}

class GetSeatAvailabilityResponse {

    /**
     *
     * @var SeatAvailabilityResponse $SeatAvailabilityResponse
     * @access public
     */
    public $SeatAvailabilityResponse = null;

}

class AssignSeatsRequest {

    /**
     *
     * @var SeatSellRequest $SellSeatRequest
     * @access public
     */
    public $SellSeatRequest = null;

}

class AssignSeatsResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class UnassignSeatsRequest {

    /**
     *
     * @var SeatSellRequest $SellSeatRequest
     * @access public
     */
    public $SellSeatRequest = null;

}

class UnassignSeatsResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class CommitRequest {

    /**
     *
     * @var CommitRequestData $BookingRequest
     * @access public
     */
    public $BookingRequest = null;

}

class CommitResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class PriceItineraryRequest {

    /**
     *
     * @var ItineraryPriceRequest $ItineraryPriceRequest
     * @access public
     */
    public $ItineraryPriceRequest = null;

    /**
     *
     * @param ItineraryPriceRequest $ItineraryPriceRequest
     * @access public
     */
    public function __construct($ItineraryPriceRequest) {
        $this->ItineraryPriceRequest = $ItineraryPriceRequest;
    }

}

class PriceItineraryResponse {

    /**
     *
     * @var Booking $Booking
     * @access public
     */
    public $Booking = null;

}

class SellRequest {

    /**
     *
     * @var SellRequestData $SellRequestData
     * @access public
     */
    public $SellRequestData = null;

}

class SellResponse {

    /**
     *
     * @var BookingUpdateResponseData $BookingUpdateResponseData
     * @access public
     */
    public $BookingUpdateResponseData = null;

}

class UpdateFeeStatusRequest {

    /**
     *
     * @var UpdateFeeStatusRequestData $UpdateFeeStatusReqData
     * @access public
     */
    public $UpdateFeeStatusReqData = null;

}

class GetBookingFromStateRequest {

}
