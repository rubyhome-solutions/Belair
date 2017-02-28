<?php

namespace application\components\Amadeus\production_v2;

class Session {

    /**
     * @var string $SessionId
     * @access public
     */
    public $SessionId = null;

    /**
     * @var string $SequenceNumber
     * @access public
     */
    public $SequenceNumber = null;

    /**
     * @var string $SecurityToken
     * @access public
     */
    public $SecurityToken = null;

}

class Fare_CheckRules {

    /**
     * @var msgType $msgType
     * @access public
     */
    public $msgType = null;

    /**
     * @var availcabinStatus $availcabinStatus
     * @access public
     */
    public $availcabinStatus = null;

    /**
     * @var conversionRate $conversionRate
     * @access public
     */
    public $conversionRate = null;

    /**
     * @var pricingTickInfo $pricingTickInfo
     * @access public
     */
    public $pricingTickInfo = null;

    /**
     * @var multiCorporate $multiCorporate
     * @access public
     */
    public $multiCorporate = null;

    /**
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var dateOfFlight $dateOfFlight
     * @access public
     */
    public $dateOfFlight = null;

    /**
     * @var flightQualification $flightQualification
     * @access public
     */
    public $flightQualification = null;

    /**
     * @var transportInformation $transportInformation
     * @access public
     */
    public $transportInformation = null;

    /**
     * @var tripDescription $tripDescription
     * @access public
     */
    public $tripDescription = null;

    /**
     * @var pricingInfo $pricingInfo
     * @access public
     */
    public $pricingInfo = null;

    /**
     * @var fareRule $fareRule
     * @access public
     */
    public $fareRule = null;

}

class msgType {

    /**
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

}

class messageFunctionDetails {

    /**
     * @var businessFunction $businessFunction
     * @access public
     */
    public $businessFunction = null;

    /**
     * @var messageFunction $messageFunction
     * @access public
     */
    public $messageFunction = null;

    /**
     * @var responsibleAgency $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

    /**
     * @var additionalMessageFunction $additionalMessageFunction
     * @access public
     */
    public $additionalMessageFunction = null;

}

class availcabinStatus {

    /**
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class bookingClassDetails {

    /**
     * @var designator $designator
     * @access public
     */
    public $designator = null;

}

class conversionRate {

    /**
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     * @var otherConvRateDetails $otherConvRateDetails
     * @access public
     */
    public $otherConvRateDetails = null;

}

class conversionRateDetails {

    /**
     * @var conversionType $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var rateType $rateType
     * @access public
     */
    public $rateType = null;

    /**
     * @var pricingAmount $pricingAmount
     * @access public
     */
    public $pricingAmount = null;

    /**
     * @var convertedValueAmount $convertedValueAmount
     * @access public
     */
    public $convertedValueAmount = null;

    /**
     * @var dutyTaxFeeType $dutyTaxFeeType
     * @access public
     */
    public $dutyTaxFeeType = null;

    /**
     * @var measurementValue $measurementValue
     * @access public
     */
    public $measurementValue = null;

    /**
     * @var measurementSignificance $measurementSignificance
     * @access public
     */
    public $measurementSignificance = null;

}

class otherConvRateDetails {

    /**
     * @var conversionType $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var rateType $rateType
     * @access public
     */
    public $rateType = null;

    /**
     * @var pricingAmount $pricingAmount
     * @access public
     */
    public $pricingAmount = null;

    /**
     * @var convertedValueAmount $convertedValueAmount
     * @access public
     */
    public $convertedValueAmount = null;

    /**
     * @var dutyTaxFeeType $dutyTaxFeeType
     * @access public
     */
    public $dutyTaxFeeType = null;

    /**
     * @var measurementValue $measurementValue
     * @access public
     */
    public $measurementValue = null;

    /**
     * @var measurementSignificance $measurementSignificance
     * @access public
     */
    public $measurementSignificance = null;

}

class pricingTickInfo {

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class productDateTimeDetails {

    /**
     * @var departureDate $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var departureTime $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var arrivalDate $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var arrivalTime $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

    /**
     * @var dateVariation $dateVariation
     * @access public
     */
    public $dateVariation = null;

}

class locationDetails {

    /**
     * @var city $city
     * @access public
     */
    public $city = null;

    /**
     * @var country $country
     * @access public
     */
    public $country = null;

}

class otherLocationDetails {

    /**
     * @var city $city
     * @access public
     */
    public $city = null;

    /**
     * @var country $country
     * @access public
     */
    public $country = null;

}

class multiCorporate {

    /**
     * @var corporateId $corporateId
     * @access public
     */
    public $corporateId = null;

}

class corporateId {

    /**
     * @var corporateQualifier $corporateQualifier
     * @access public
     */
    public $corporateQualifier = null;

    /**
     * @var identity $identity
     * @access public
     */
    public $identity = null;

}

class itemNumber {

    /**
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class itemNumberDetails {

    /**
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var responsibleAgency $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

}

class dateOfFlight {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class dateAndTimeDetails {

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var date $date
     * @access public
     */
    public $date = null;

}

class flightQualification {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class fareCategories {

    /**
     * @var fareType $fareType
     * @access public
     */
    public $fareType = null;

    /**
     * @var otherFareType $otherFareType
     * @access public
     */
    public $otherFareType = null;

}

class fareDetails {

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var country $country
     * @access public
     */
    public $country = null;

    /**
     * @var fareCategory $fareCategory
     * @access public
     */
    public $fareCategory = null;

}

class additionalFareDetails {

    /**
     * @var rateClass $rateClass
     * @access public
     */
    public $rateClass = null;

    /**
     * @var commodityCategory $commodityCategory
     * @access public
     */
    public $commodityCategory = null;

    /**
     * @var pricingGroup $pricingGroup
     * @access public
     */
    public $pricingGroup = null;

    /**
     * @var secondRateClass $secondRateClass
     * @access public
     */
    public $secondRateClass = null;

}

class discountDetails {

    /**
     * @var fareQualifier $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     * @var rateCategory $rateCategory
     * @access public
     */
    public $rateCategory = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var percentage $percentage
     * @access public
     */
    public $percentage = null;

}

class transportInformation {

    /**
     * @var transportService $transportService
     * @access public
     */
    public $transportService = null;

    /**
     * @var availCabinConf $availCabinConf
     * @access public
     */
    public $availCabinConf = null;

    /**
     * @var routingInfo $routingInfo
     * @access public
     */
    public $routingInfo = null;

    /**
     * @var selectionDetail $selectionDetail
     * @access public
     */
    public $selectionDetail = null;

}

class transportService {

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class companyIdentification {

    /**
     * @var marketingAirlineCode $marketingAirlineCode
     * @access public
     */
    public $marketingAirlineCode = null;

    /**
     * @var operatingAirlineCode $operatingAirlineCode
     * @access public
     */
    public $operatingAirlineCode = null;

}

class productIdentificationDetails {

    /**
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     * @var operationalSuffix $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

}

class availCabinConf {

    /**
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class routingInfo {

    /**
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class routingDetails {

    /**
     * @var station $station
     * @access public
     */
    public $station = null;

    /**
     * @var otherStation $otherStation
     * @access public
     */
    public $otherStation = null;

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

}

class selectionDetail {

    /**
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     * @var selectionDetailsTwo $selectionDetailsTwo
     * @access public
     */
    public $selectionDetailsTwo = null;

}

class selectionDetails {

    /**
     * @var option $option
     * @access public
     */
    public $option = null;

}

class selectionDetailsTwo {

    /**
     * @var option $option
     * @access public
     */
    public $option = null;

    /**
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class tripDescription {

    /**
     * @var origDest $origDest
     * @access public
     */
    public $origDest = null;

    /**
     * @var dateFlightMovement $dateFlightMovement
     * @access public
     */
    public $dateFlightMovement = null;

    /**
     * @var routing $routing
     * @access public
     */
    public $routing = null;

}

class origDest {

    /**
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class dateFlightMovement {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class routing {

    /**
     * @var routingInfo $routingInfo
     * @access public
     */
    public $routingInfo = null;

    /**
     * @var transportService $transportService
     * @access public
     */
    public $transportService = null;

    /**
     * @var segFareDetails $segFareDetails
     * @access public
     */
    public $segFareDetails = null;

    /**
     * @var pertinentQuantity $pertinentQuantity
     * @access public
     */
    public $pertinentQuantity = null;

    /**
     * @var selectionMakingDetails $selectionMakingDetails
     * @access public
     */
    public $selectionMakingDetails = null;

}

class segFareDetails {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class pertinentQuantity {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class quantityDetails {

    /**
     * @var numberOfUnit $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class otherQuantityDetails {

    /**
     * @var numberOfUnit $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class selectionMakingDetails {

    /**
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     * @var selectionDetailsTwo $selectionDetailsTwo
     * @access public
     */
    public $selectionDetailsTwo = null;

}

class pricingInfo {

    /**
     * @var numberOfUnits $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     * @var ticketPricingDate $ticketPricingDate
     * @access public
     */
    public $ticketPricingDate = null;

    /**
     * @var fare $fare
     * @access public
     */
    public $fare = null;

}

class numberOfUnits {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     * @var otherQuantityDetails $otherQuantityDetails
     * @access public
     */
    public $otherQuantityDetails = null;

}

class ticketPricingDate {

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class fare {

    /**
     * @var InteractiveFreeTextType_78559S $pricingMessage
     * @access public
     */
    public $pricingMessage = null;

    /**
     * @var MonetaryInformationType $monetaryInformation
     * @access public
     */
    public $monetaryInformation = null;

}

class detailsOfFare {

    /**
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

}

class fareTypeGrouping {

    /**
     * @var pricingGroup $pricingGroup
     * @access public
     */
    public $pricingGroup = null;

}

class fareQualificationDetails {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class fareRule {

    /**
     * @var tarifFareRule $tarifFareRule
     * @access public
     */
    public $tarifFareRule = null;

    /**
     * @var travellerIdentification $travellerIdentification
     * @access public
     */
    public $travellerIdentification = null;

    /**
     * @var travellerDate $travellerDate
     * @access public
     */
    public $travellerDate = null;

}

class tarifFareRule {

    /**
     * @var tariffClassId $tariffClassId
     * @access public
     */
    public $tariffClassId = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ruleSectionId $ruleSectionId
     * @access public
     */
    public $ruleSectionId = null;

}

class companyDetails {

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var company $company
     * @access public
     */
    public $company = null;

}

class travellerIdentification {

    /**
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class referenceDetails {

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     * @var value $value
     * @access public
     */
    public $value = null;

}

class travellerDate {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class Fare_CheckRulesReply {

    /**
     * @var transactionType $transactionType
     * @access public
     */
    public $transactionType = null;

    /**
     * @var statusInfo $statusInfo
     * @access public
     */
    public $statusInfo = null;

    /**
     * @var fareRouteInfo $fareRouteInfo
     * @access public
     */
    public $fareRouteInfo = null;

    /**
     * @var infoText $infoText
     * @access public
     */
    public $infoText = null;

    /**
     * @var errorInfo $errorInfo
     * @access public
     */
    public $errorInfo = null;

    /**
     * @var tariffInfo $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var flightDetails $flightDetails
     * @access public
     */
    public $flightDetails = null;

}

class transactionType {

    /**
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

}

class statusInfo {

    /**
     * @var statusDetails $statusDetails
     * @access public
     */
    public $statusDetails = null;

    /**
     * @var otherDetails $otherDetails
     * @access public
     */
    public $otherDetails = null;

}

class statusDetails {

    /**
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

}

class otherDetails {

    /**
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

}

class fareRouteInfo {

    /**
     * @var dayOfWeek $dayOfWeek
     * @access public
     */
    public $dayOfWeek = null;

    /**
     * @var fareQualifierDetails $fareQualifierDetails
     * @access public
     */
    public $fareQualifierDetails = null;

    /**
     * @var identificationNumber $identificationNumber
     * @access public
     */
    public $identificationNumber = null;

    /**
     * @var validityPeriod $validityPeriod
     * @access public
     */
    public $validityPeriod = null;

}

class fareQualifierDetails {

    /**
     * @var fareQualifier $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

}

class validityPeriod {

    /**
     * @var firstDate $firstDate
     * @access public
     */
    public $firstDate = null;

    /**
     * @var secondDate $secondDate
     * @access public
     */
    public $secondDate = null;

}

class infoText {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class freeTextQualification {

    /**
     * @var textSubjectQualifier $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var informationType $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var language $language
     * @access public
     */
    public $language = null;

}

class errorInfo {

    /**
     * @var ApplicationErrorInformationType $errorInformation
     * @access public
     */
    public $errorInformation = null;

    /**
     * @var InteractiveFreeTextTypeI_132924S $errorfreeFormText
     * @access public
     */
    public $errorfreeFormText = null;

}

class rejectErrorCode {

    /**
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class errorDetails {

    /**
     * @var errorCode $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     * @var errorCategory $errorCategory
     * @access public
     */
    public $errorCategory = null;

    /**
     * @var errorCodeOwner $errorCodeOwner
     * @access public
     */
    public $errorCodeOwner = null;

}

class errorFreeText {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class tariffInfo {

    /**
     * @var fareRuleInfo $fareRuleInfo
     * @access public
     */
    public $fareRuleInfo = null;

    /**
     * @var fareRuleText $fareRuleText
     * @access public
     */
    public $fareRuleText = null;

}

class fareRuleInfo {

    /**
     * @var ruleSectionLocalId $ruleSectionLocalId
     * @access public
     */
    public $ruleSectionLocalId = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ruleCategoryCode $ruleCategoryCode
     * @access public
     */
    public $ruleCategoryCode = null;

}

class fareRuleText {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class flightDetails {

    /**
     * @var flightType $flightType
     * @access public
     */
    public $flightType = null;

    /**
     * @var otherFlightTypes $otherFlightTypes
     * @access public
     */
    public $otherFlightTypes = null;

}

class nbOfSegments {

    /**
     * @var segmentControlDetails $segmentControlDetails
     * @access public
     */
    public $segmentControlDetails = null;

}

class segmentControlDetails {

    /**
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var numberOfUnits $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     * @var totalNumberOfItems $totalNumberOfItems
     * @access public
     */
    public $totalNumberOfItems = null;

}

class amountConversion {

    /**
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class otherConversionRateDetails {

    /**
     * @var conversionType $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var rateType $rateType
     * @access public
     */
    public $rateType = null;

    /**
     * @var pricingAmount $pricingAmount
     * @access public
     */
    public $pricingAmount = null;

    /**
     * @var measurementValue $measurementValue
     * @access public
     */
    public $measurementValue = null;

    /**
     * @var measurementSignificance $measurementSignificance
     * @access public
     */
    public $measurementSignificance = null;

}

class quantityValue {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class pricingAndDateInfo {

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class qualificationFareDetails {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class flightErrorCode {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class productInfo {

    /**
     * @var product $product
     * @access public
     */
    public $product = null;

}

class productDetails {

    /**
     * @var identification $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var subtype $subtype
     * @access public
     */
    public $subtype = null;

}

class productErrorCode {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class priceInfo {

    /**
     * @var monetaryRates $monetaryRates
     * @access public
     */
    public $monetaryRates = null;

    /**
     * @var taxAmount $taxAmount
     * @access public
     */
    public $taxAmount = null;

    /**
     * @var fareTypeInfo $fareTypeInfo
     * @access public
     */
    public $fareTypeInfo = null;

}

class monetaryRates {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var amountTwo $amountTwo
     * @access public
     */
    public $amountTwo = null;

}

class monetaryDetails {

    /**
     * @var typeQualifier $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class amountTwo {

    /**
     * @var typeQualifier $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class taxAmount {

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class taxDetails {

    /**
     * @var taxQualifier $taxQualifier
     * @access public
     */
    public $taxQualifier = null;

    /**
     * @var taxIdentification $taxIdentification
     * @access public
     */
    public $taxIdentification = null;

    /**
     * @var taxType $taxType
     * @access public
     */
    public $taxType = null;

    /**
     * @var taxNature $taxNature
     * @access public
     */
    public $taxNature = null;

    /**
     * @var taxExempt $taxExempt
     * @access public
     */
    public $taxExempt = null;

}

class fareTypeInfo {

    /**
     * @var fareDetailQualif $fareDetailQualif
     * @access public
     */
    public $fareDetailQualif = null;

    /**
     * @var flightMovementDate $flightMovementDate
     * @access public
     */
    public $flightMovementDate = null;

    /**
     * @var faraRulesInfo $faraRulesInfo
     * @access public
     */
    public $faraRulesInfo = null;

    /**
     * @var selectionMakingDetails $selectionMakingDetails
     * @access public
     */
    public $selectionMakingDetails = null;

    /**
     * @var amountConvDetails $amountConvDetails
     * @access public
     */
    public $amountConvDetails = null;

}

class fareDetailQualif {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class flightMovementDate {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class faraRulesInfo {

    /**
     * @var ruleSectionLocalId $ruleSectionLocalId
     * @access public
     */
    public $ruleSectionLocalId = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ruleCategoryCode $ruleCategoryCode
     * @access public
     */
    public $ruleCategoryCode = null;

}

class amountConvDetails {

    /**
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class fareDetailInfo {

    /**
     * @var nbOfUnits $nbOfUnits
     * @access public
     */
    public $nbOfUnits = null;

    /**
     * @var pricingPlusDateInfo $pricingPlusDateInfo
     * @access public
     */
    public $pricingPlusDateInfo = null;

    /**
     * @var fareDeatilInfo $fareDeatilInfo
     * @access public
     */
    public $fareDeatilInfo = null;

}

class nbOfUnits {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class pricingPlusDateInfo {

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class fareDeatilInfo {

    /**
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

}

class odiGrp {

    /**
     * @var originDestination $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     * @var flightDateAndTime $flightDateAndTime
     * @access public
     */
    public $flightDateAndTime = null;

    /**
     * @var flightErrorText $flightErrorText
     * @access public
     */
    public $flightErrorText = null;

    /**
     * @var monGrp $monGrp
     * @access public
     */
    public $monGrp = null;

    /**
     * @var routingGrp $routingGrp
     * @access public
     */
    public $routingGrp = null;

    /**
     * @var travelProductGrp $travelProductGrp
     * @access public
     */
    public $travelProductGrp = null;

}

class originDestination {

    /**
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

}

class flightDateAndTime {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class flightErrorText {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class monGrp {

    /**
     * @var monetaryValues $monetaryValues
     * @access public
     */
    public $monetaryValues = null;

    /**
     * @var fareDetailGrp $fareDetailGrp
     * @access public
     */
    public $fareDetailGrp = null;

}

class monetaryValues {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var amountTwo $amountTwo
     * @access public
     */
    public $amountTwo = null;

}

class fareDetailGrp {

    /**
     * @var fareQualif $fareQualif
     * @access public
     */
    public $fareQualif = null;

    /**
     * @var amountCvtRate $amountCvtRate
     * @access public
     */
    public $amountCvtRate = null;

}

class fareQualif {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class amountCvtRate {

    /**
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class routingGrp {

    /**
     * @var routingInfo $routingInfo
     * @access public
     */
    public $routingInfo = null;

    /**
     * @var transportServiceChange $transportServiceChange
     * @access public
     */
    public $transportServiceChange = null;

}

class serviceTransport {

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class qualificationOfFare {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class travelProductGrp {

    /**
     * @var travelProductInfo $travelProductInfo
     * @access public
     */
    public $travelProductInfo = null;

    /**
     * @var routingGrp $routingGrp
     * @access public
     */
    public $routingGrp = null;

}

class travelProductInfo {

    /**
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class flightDate {

    /**
     * @var departureDate $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var departureTime $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var arrivalDate $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var arrivalTime $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

    /**
     * @var dateVariation $dateVariation
     * @access public
     */
    public $dateVariation = null;

}

class boardPointDetails {

    /**
     * @var trueLocationId $trueLocationId
     * @access public
     */
    public $trueLocationId = null;

    /**
     * @var trueLocation $trueLocation
     * @access public
     */
    public $trueLocation = null;

}

class offpointDetails {

    /**
     * @var trueLocationId $trueLocationId
     * @access public
     */
    public $trueLocationId = null;

    /**
     * @var trueLocation $trueLocation
     * @access public
     */
    public $trueLocation = null;

}

class flightIdentification {

    /**
     * @var flightNumber $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     * @var bookingClass $bookingClass
     * @access public
     */
    public $bookingClass = null;

    /**
     * @var operationalSuffix $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

    /**
     * @var modifier $modifier
     * @access public
     */
    public $modifier = null;

}

class flightTypeDetails {

    /**
     * @var flightIndicator $flightIndicator
     * @access public
     */
    public $flightIndicator = null;

}

class marriageDetails {

    /**
     * @var relation $relation
     * @access public
     */
    public $relation = null;

    /**
     * @var marriageIdentifier $marriageIdentifier
     * @access public
     */
    public $marriageIdentifier = null;

    /**
     * @var lineNumber $lineNumber
     * @access public
     */
    public $lineNumber = null;

    /**
     * @var otherRelation $otherRelation
     * @access public
     */
    public $otherRelation = null;

    /**
     * @var carrierCode $carrierCode
     * @access public
     */
    public $carrierCode = null;

}

class transportServiceChange {

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class travellerGrp {

    /**
     * @var travellerIdentRef $travellerIdentRef
     * @access public
     */
    public $travellerIdentRef = null;

    /**
     * @var fareRulesDetails $fareRulesDetails
     * @access public
     */
    public $fareRulesDetails = null;

    /**
     * @var flightMovementDateInfo $flightMovementDateInfo
     * @access public
     */
    public $flightMovementDateInfo = null;

}

class travellerIdentRef {

    /**
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class fareRulesDetails {

    /**
     * @var tariffClassId $tariffClassId
     * @access public
     */
    public $tariffClassId = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ruleSectionId $ruleSectionId
     * @access public
     */
    public $ruleSectionId = null;

}

class flightMovementDateInfo {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class fareRouteGrp2 {

    /**
     * @var fareRouteInfo $fareRouteInfo
     * @access public
     */
    public $fareRouteInfo = null;

    /**
     * @var journeyGrp $journeyGrp
     * @access public
     */
    public $journeyGrp = null;

}

class journeyGrp {

    /**
     * @var journeyOriginAndDestination $journeyOriginAndDestination
     * @access public
     */
    public $journeyOriginAndDestination = null;

    /**
     * @var journeyProductGrp $journeyProductGrp
     * @access public
     */
    public $journeyProductGrp = null;

}

class journeyOriginAndDestination {

    /**
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class journeyProductGrp {

    /**
     * @var journeyProductInfo $journeyProductInfo
     * @access public
     */
    public $journeyProductInfo = null;

    /**
     * @var journeyRoutingGrp $journeyRoutingGrp
     * @access public
     */
    public $journeyRoutingGrp = null;

}

class journeyProductInfo {

    /**
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class journeyRoutingGrp {

    /**
     * @var journeyRoutingInfo $journeyRoutingInfo
     * @access public
     */
    public $journeyRoutingInfo = null;

    /**
     * @var journeyTransportService $journeyTransportService
     * @access public
     */
    public $journeyTransportService = null;

}

class journeyRoutingInfo {

    /**
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class journeyTransportService {

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class itemGrp {

    /**
     * @var itemNb $itemNb
     * @access public
     */
    public $itemNb = null;

    /**
     * @var productAvailabilityStatus $productAvailabilityStatus
     * @access public
     */
    public $productAvailabilityStatus = null;

    /**
     * @var quantityItem $quantityItem
     * @access public
     */
    public $quantityItem = null;

    /**
     * @var transportServiceItem $transportServiceItem
     * @access public
     */
    public $transportServiceItem = null;

    /**
     * @var freeTextItem $freeTextItem
     * @access public
     */
    public $freeTextItem = null;

    /**
     * @var fareQualifItem $fareQualifItem
     * @access public
     */
    public $fareQualifItem = null;

    /**
     * @var originDestinationGrp $originDestinationGrp
     * @access public
     */
    public $originDestinationGrp = null;

    /**
     * @var unitGrp $unitGrp
     * @access public
     */
    public $unitGrp = null;

    /**
     * @var monetaryGrp $monetaryGrp
     * @access public
     */
    public $monetaryGrp = null;

    /**
     * @var farerouteGrp $farerouteGrp
     * @access public
     */
    public $farerouteGrp = null;

}

class itemNb {

    /**
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class productAvailabilityStatus {

    /**
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class quantityItem {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class transportServiceItem {

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class freeTextItem {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class fareQualifItem {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class originDestinationGrp {

    /**
     * @var originDestOfJourney $originDestOfJourney
     * @access public
     */
    public $originDestOfJourney = null;

    /**
     * @var dateForMovements $dateForMovements
     * @access public
     */
    public $dateForMovements = null;

    /**
     * @var routingForJourney $routingForJourney
     * @access public
     */
    public $routingForJourney = null;

}

class originDestOfJourney {

    /**
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class dateForMovements {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class routingForJourney {

    /**
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class unitGrp {

    /**
     * @var nbOfUnits $nbOfUnits
     * @access public
     */
    public $nbOfUnits = null;

    /**
     * @var unitPricingAndDateInfo $unitPricingAndDateInfo
     * @access public
     */
    public $unitPricingAndDateInfo = null;

    /**
     * @var unitFareDetails $unitFareDetails
     * @access public
     */
    public $unitFareDetails = null;

}

class unitPricingAndDateInfo {

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class unitFareDetails {

    /**
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

}

class monetaryGrp {

    /**
     * @var monetaryValues $monetaryValues
     * @access public
     */
    public $monetaryValues = null;

    /**
     * @var monetFareRuleValues $monetFareRuleValues
     * @access public
     */
    public $monetFareRuleValues = null;

    /**
     * @var monetTravellerRef $monetTravellerRef
     * @access public
     */
    public $monetTravellerRef = null;

    /**
     * @var monetTicketPriceAndDate $monetTicketPriceAndDate
     * @access public
     */
    public $monetTicketPriceAndDate = null;

    /**
     * @var monetTaxValues $monetTaxValues
     * @access public
     */
    public $monetTaxValues = null;

    /**
     * @var qualifGrp $qualifGrp
     * @access public
     */
    public $qualifGrp = null;

}

class monetFareRuleValues {

    /**
     * @var ruleSectionLocalId $ruleSectionLocalId
     * @access public
     */
    public $ruleSectionLocalId = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ruleCategoryCode $ruleCategoryCode
     * @access public
     */
    public $ruleCategoryCode = null;

}

class monetTravellerRef {

    /**
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class monetTicketPriceAndDate {

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

}

class monetTaxValues {

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class qualifGrp {

    /**
     * @var qualificationFare $qualificationFare
     * @access public
     */
    public $qualificationFare = null;

    /**
     * @var qualifSelection $qualifSelection
     * @access public
     */
    public $qualifSelection = null;

    /**
     * @var qualifDateFlightMovement $qualifDateFlightMovement
     * @access public
     */
    public $qualifDateFlightMovement = null;

    /**
     * @var qualifConversionRate $qualifConversionRate
     * @access public
     */
    public $qualifConversionRate = null;

}

class qualificationFare {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class qualifSelection {

    /**
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

    /**
     * @var selectionDetailsTwo $selectionDetailsTwo
     * @access public
     */
    public $selectionDetailsTwo = null;

}

class qualifDateFlightMovement {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class qualifConversionRate {

    /**
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     * @var otherConversionRateDetails $otherConversionRateDetails
     * @access public
     */
    public $otherConversionRateDetails = null;

}

class farerouteGrp {

    /**
     * @var infoForFareRoute $infoForFareRoute
     * @access public
     */
    public $infoForFareRoute = null;

    /**
     * @var farerouteTransportService $farerouteTransportService
     * @access public
     */
    public $farerouteTransportService = null;

    /**
     * @var finalOdiGrp $finalOdiGrp
     * @access public
     */
    public $finalOdiGrp = null;

}

class infoForFareRoute {

    /**
     * @var dayOfWeek $dayOfWeek
     * @access public
     */
    public $dayOfWeek = null;

    /**
     * @var fareQualifierDetails $fareQualifierDetails
     * @access public
     */
    public $fareQualifierDetails = null;

    /**
     * @var identificationNumber $identificationNumber
     * @access public
     */
    public $identificationNumber = null;

    /**
     * @var validityPeriod $validityPeriod
     * @access public
     */
    public $validityPeriod = null;

}

class farerouteTransportService {

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var productIdentificationDetails $productIdentificationDetails
     * @access public
     */
    public $productIdentificationDetails = null;

}

class finalOdiGrp {

    /**
     * @var finalOriginDestination $finalOriginDestination
     * @access public
     */
    public $finalOriginDestination = null;

    /**
     * @var lastOdiRoutingInfo $lastOdiRoutingInfo
     * @access public
     */
    public $lastOdiRoutingInfo = null;

    /**
     * @var lastOdiDateFlightMovement $lastOdiDateFlightMovement
     * @access public
     */
    public $lastOdiDateFlightMovement = null;

}

class finalOriginDestination {

    /**
     * @var origin $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var destination $destination
     * @access public
     */
    public $destination = null;

}

class lastOdiRoutingInfo {

    /**
     * @var routingDetails $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class lastOdiDateFlightMovement {

    /**
     * @var dateAndTimeDetails $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class Fare_MasterPricerTravelBoardSearch {

    /**
     * @var NumberOfUnitsType $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     * @var AttributeType $globalOptions
     * @access public
     */
    public $globalOptions = null;

    /**
     * @var TravellerReferenceInformationType $paxReference
     * @access public
     */
    public $paxReference = null;

    /**
     * @var ConsumerReferenceInformationType $customerRef
     * @access public
     */
    public $customerRef = null;

    /**
     * @var FOPRepresentationType $formOfPaymentByPassenger
     * @access public
     */
    public $formOfPaymentByPassenger = null;

    /**
     * @var FareInformationType $solutionFamily
     * @access public
     */
    public $solutionFamily = null;

    /**
     * @var GroupPassengerDetailsType $passengerInfoGrp
     * @access public
     */
    public $passengerInfoGrp = null;

    /**
     * @var fareFamilies $fareFamilies
     * @access public
     */
    public $fareFamilies = null;

    /**
     * @var fareOptions $fareOptions
     * @access public
     */
    public $fareOptions = null;

    /**
     * @var MonetaryInformationType $priceToBeat
     * @access public
     */
    public $priceToBeat = null;

    /**
     * @var TaxType2 $taxInfo
     * @access public
     */
    public $taxInfo = null;

    /**
     * @var TravelFlightInformationType_165052S $travelFlightInfo
     * @access public
     */
    public $travelFlightInfo = null;

    /**
     * @var ValueSearchCriteriaType $valueSearch
     * @access public
     */
    public $valueSearch = null;

    /**
     * @var itinerary $itinerary
     * @access public
     */
    public $itinerary = null;

    /**
     * @var ticketChangeInfo $ticketChangeInfo
     * @access public
     */
    public $ticketChangeInfo = null;

    /**
     * @var combinationFareFamilies $combinationFareFamilies
     * @access public
     */
    public $combinationFareFamilies = null;

    /**
     * @var feeOption $feeOption
     * @access public
     */
    public $feeOption = null;

    /**
     * @var officeIdDetails $officeIdDetails
     * @access public
     */
    public $officeIdDetails = null;

}

class fareFamilies {

    /**
     * @var FareFamilyType $familyInformation
     * @access public
     */
    public $familyInformation = null;

    /**
     * @var FareFamilyCriteriaType $familyCriteria
     * @access public
     */
    public $familyCriteria = null;

    /**
     * @var fareFamilySegment $fareFamilySegment
     * @access public
     */
    public $fareFamilySegment = null;

    /**
     * @var otherPossibleCriteria $otherPossibleCriteria
     * @access public
     */
    public $otherPossibleCriteria = null;

}

class fareFamilySegment {

    /**
     * @var ReferenceInfoType $referenceInfo
     * @access public
     */
    public $referenceInfo = null;

    /**
     * @var FareFamilyCriteriaType $familyCriteria
     * @access public
     */
    public $familyCriteria = null;

}

class otherPossibleCriteria {

    /**
     * @var BooleanExpressionRuleType $logicalLink
     * @access public
     */
    public $logicalLink = null;

    /**
     * @var FareFamilyCriteriaType $familyCriteria
     * @access public
     */
    public $familyCriteria = null;

    /**
     * @var fareFamilySegment $fareFamilySegment
     * @access public
     */
    public $fareFamilySegment = null;

}

class fareOptions {

    /**
     * @var PricingTicketingDetailsType $pricingTickInfo
     * @access public
     */
    public $pricingTickInfo = null;

    /**
     * @var CorporateIdentificationType $corporate
     * @access public
     */
    public $corporate = null;

    /**
     * @var TicketingPriceSchemeType $ticketingPriceScheme
     * @access public
     */
    public $ticketingPriceScheme = null;

    /**
     * @var CodedAttributeType $feeIdDescription
     * @access public
     */
    public $feeIdDescription = null;

    /**
     * @var ConversionRateType $conversionRate
     * @access public
     */
    public $conversionRate = null;

    /**
     * @var FormOfPaymentTypeI $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     * @var FrequentTravellerIdentificationCodeType_177150S $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     * @var MonetaryAndCabinInformationType $monetaryCabinInfo
     * @access public
     */
    public $monetaryCabinInfo = null;

}

class itinerary {

    /**
     * @var OriginAndDestinationRequestType $requestedSegmentRef
     * @access public
     */
    public $requestedSegmentRef = null;

    /**
     * @var DepartureLocationType $departureLocalization
     * @access public
     */
    public $departureLocalization = null;

    /**
     * @var ArrivalLocalizationType $arrivalLocalization
     * @access public
     */
    public $arrivalLocalization = null;

    /**
     * @var DateAndTimeInformationType_181295S $timeDetails
     * @access public
     */
    public $timeDetails = null;

    /**
     * @var TravelFlightInformationType_165053S $flightInfo
     * @access public
     */
    public $flightInfo = null;

    /**
     * @var ValueSearchCriteriaType $valueSearch
     * @access public
     */
    public $valueSearch = null;

    /**
     * @var groupOfFlights $groupOfFlights
     * @access public
     */
    public $groupOfFlights = null;

    /**
     * @var flightInfoPNR $flightInfoPNR
     * @access public
     */
    public $flightInfoPNR = null;

    /**
     * @var ActionIdentificationType $requestedSegmentAction
     * @access public
     */
    public $requestedSegmentAction = null;

    /**
     * @var CodedAttributeType_181239S $attributes
     * @access public
     */
    public $attributes = null;

}

class groupOfFlights {

    /**
     * @var ProposedSegmentType $propFlightGrDetail
     * @access public
     */
    public $propFlightGrDetail = null;

    /**
     * @var flightDetails $flightDetails
     * @access public
     */
    public $flightDetails = null;

}

class flightInfoPNR {

    /**
     * @var TravelProductInformationTypeI $travelResponseDetails
     * @access public
     */
    public $travelResponseDetails = null;

    /**
     * @var StructuredPeriodInformationType $timeTableDate
     * @access public
     */
    public $timeTableDate = null;

    /**
     * @var AdditionalProductDetailsTypeI $terminalEquipmentDetails
     * @access public
     */
    public $terminalEquipmentDetails = null;

    /**
     * @var CommercialAgreementsType $codeshareData
     * @access public
     */
    public $codeshareData = null;

    /**
     * @var FreeTextInformationType $disclosure
     * @access public
     */
    public $disclosure = null;

    /**
     * @var RoutingInformationTypeI $stopDetails
     * @access public
     */
    public $stopDetails = null;

    /**
     * @var TrafficRestrictionTypeI $trafficRestrictionData
     * @access public
     */
    public $trafficRestrictionData = null;

    /**
     * @var PassengerItineraryInformationType $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     * @var incidentalStopInfo $incidentalStopInfo
     * @access public
     */
    public $incidentalStopInfo = null;

}

class incidentalStopInfo {

    /**
     * @var DateAndTimeInformationTypeI $dateTimeInfo
     * @access public
     */
    public $dateTimeInfo = null;

}

class ticketChangeInfo {

    /**
     * @var TicketNumberTypeI $ticketNumberDetails
     * @access public
     */
    public $ticketNumberDetails = null;

    /**
     * @var ticketRequestedSegments $ticketRequestedSegments
     * @access public
     */
    public $ticketRequestedSegments = null;

}

class ticketRequestedSegments {

    /**
     * @var ActionIdentificationType $actionIdentification
     * @access public
     */
    public $actionIdentification = null;

    /**
     * @var ConnectionTypeI $connectPointDetails
     * @access public
     */
    public $connectPointDetails = null;

}

class combinationFareFamilies {

    /**
     * @var ItemNumberType $itemFFCNumber
     * @access public
     */
    public $itemFFCNumber = null;

    /**
     * @var NumberOfUnitsType_80154S $nbOfUnits
     * @access public
     */
    public $nbOfUnits = null;

    /**
     * @var ReferenceInfoType $referenceInfo
     * @access public
     */
    public $referenceInfo = null;

}

class feeOption {

    /**
     * @var SelectionDetailsType $feeTypeInfo
     * @access public
     */
    public $feeTypeInfo = null;

    /**
     * @var MonetaryInformationType_80162S $rateTax
     * @access public
     */
    public $rateTax = null;

    /**
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class feeDetails {

    /**
     * @var feeInfo $feeInfo
     * @access public
     */
    public $feeInfo = null;

    /**
     * @var feeDescription $feeDescription
     * @access public
     */
    public $feeDescription = null;

    /**
     * @var feeAmounts $feeAmounts
     * @access public
     */
    public $feeAmounts = null;

    /**
     * @var feeTaxes $feeTaxes
     * @access public
     */
    public $feeTaxes = null;

}

class feeDescriptionGrp {

    /**
     * @var ItemNumberType_80866S $itemNumberInfo
     * @access public
     */
    public $itemNumberInfo = null;

    /**
     * @var AttributeType $serviceAttributesInfo
     * @access public
     */
    public $serviceAttributesInfo = null;

    /**
     * @var SpecialRequirementsDetailsType $serviceDescriptionInfo
     * @access public
     */
    public $serviceDescriptionInfo = null;

    /**
     * @var InteractiveFreeTextType $commercialName
     * @access public
     */
    public $commercialName = null;

}

class officeIdDetails {

    /**
     * @var UserIdentificationType $officeIdInformation
     * @access public
     */
    public $officeIdInformation = null;

    /**
     * @var ItemReferencesAndVersionsType_78536S $officeIdReference
     * @access public
     */
    public $officeIdReference = null;

}

class airlineDistributionDetails {

    /**
     * @var OriginAndDestinationRequestType $requestedSegmentRef
     * @access public
     */
    public $requestedSegmentRef = null;

    /**
     * @var TravelFlightInformationType $flightInfo
     * @access public
     */
    public $flightInfo = null;

}

class ActionIdentificationType {

    /**
     * @var AlphaNumericString_Length1To3 $actionRequestCode
     * @access public
     */
    public $actionRequestCode = null;

    /**
     * @var ProductIdentificationDetailsTypeI_50878C $productDetails
     * @access public
     */
    public $productDetails = null;

}

class AdditionalProductDetailsTypeI {

    /**
     * @var AdditionalProductTypeI $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var StationInformationTypeI $departureInformation
     * @access public
     */
    public $departureInformation = null;

    /**
     * @var StationInformationTypeI_119771C $arrivalStationInfo
     * @access public
     */
    public $arrivalStationInfo = null;

    /**
     * @var MileageTimeDetailsTypeI $mileageTimeDetails
     * @access public
     */
    public $mileageTimeDetails = null;

    /**
     * @var TravellerTimeDetailsTypeI $timeDetail
     * @access public
     */
    public $timeDetail = null;

    /**
     * @var ProductFacilitiesTypeI $facilities
     * @access public
     */
    public $facilities = null;

}

class AdditionalProductDetailsType {

    /**
     * @var AdditionalProductType $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var StationInformationType $departureStationInfo
     * @access public
     */
    public $departureStationInfo = null;

    /**
     * @var StationInformationType $arrivalStationInfo
     * @access public
     */
    public $arrivalStationInfo = null;

    /**
     * @var MileageTimeDetailsType $mileageDetails
     * @access public
     */
    public $mileageDetails = null;

    /**
     * @var TravellerTimeDetailsType $travellerTimeDetails
     * @access public
     */
    public $travellerTimeDetails = null;

    /**
     * @var ProductFacilitiesType $equipmentInformation
     * @access public
     */
    public $equipmentInformation = null;

}

class AdditionalProductTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $equipment
     * @access public
     */
    public $equipment = null;

    /**
     * @var NumericInteger_Length1To2 $numOfStops
     * @access public
     */
    public $numOfStops = null;

    /**
     * @var Time24_HHMM $duration
     * @access public
     */
    public $duration = null;

    /**
     * @var NumericInteger_Length1To1 $weekDay
     * @access public
     */
    public $weekDay = null;

}

class AgentIdentificationType {

    /**
     * @var AlphaNumericString_Length1To12 $arcNumber
     * @access public
     */
    public $arcNumber = null;

    /**
     * @var AlphaNumericString_Length1To12 $erspNumber
     * @access public
     */
    public $erspNumber = null;

    /**
     * @var AlphaNumericString_Length1To12 $iataNumber
     * @access public
     */
    public $iataNumber = null;

}

class ArithmeticEvaluationType {

    /**
     * @var AlphaNumericString_Length1To3 $codeOperator
     * @access public
     */
    public $codeOperator = null;

}

class ArrivalLocalizationType {

    /**
     * @var ArrivalLocationDetailsType $arrivalPointDetails
     * @access public
     */
    public $arrivalPointDetails = null;

    /**
     * @var MultiCityOptionType $arrivalMultiCity
     * @access public
     */
    public $arrivalMultiCity = null;

    /**
     * @var CodedAttributeInformationType_139508C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class ArrivalLocationDetailsType {

    /**
     * @var NumericInteger_Length1To3 $distance
     * @access public
     */
    public $distance = null;

    /**
     * @var AlphaNumericString_Length0To3 $distanceUnit
     * @access public
     */
    public $distanceUnit = null;

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaString_Length1To1 $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     * @var AlphaNumericString_Length6To6 $latitude
     * @access public
     */
    public $latitude = null;

    /**
     * @var AlphaNumericString_Length6To6 $longitude
     * @access public
     */
    public $longitude = null;

}

class ArrivalLocationDetailsType_120834C {

    /**
     * @var NumericInteger_Length1To3 $distance
     * @access public
     */
    public $distance = null;

    /**
     * @var AlphaNumericString_Length1To3 $distanceUnit
     * @access public
     */
    public $distanceUnit = null;

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaString_Length1To1 $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     * @var AlphaNumericString_Length6To6 $latitude
     * @access public
     */
    public $latitude = null;

    /**
     * @var AlphaNumericString_Length6To6 $longitude
     * @access public
     */
    public $longitude = null;

}

class AttributeInformationType {

    /**
     * @var AlphaNumericString_Length3To3 $feeParameterType
     * @access public
     */
    public $feeParameterType = null;

    /**
     * @var AlphaNumericString_Length1To15 $feeParameterDescription
     * @access public
     */
    public $feeParameterDescription = null;

}

class AttributeInformationType_97181C {

    /**
     * @var AlphaNumericString_Length1To25 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class AttributeType {

    /**
     * @var AttributeInformationTypeU $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class AttributeType_61377S {

    /**
     * @var AlphaNumericString_Length1To3 $attributeQualifier
     * @access public
     */
    public $attributeQualifier = null;

    /**
     * @var AttributeInformationType_97181C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class BooleanExpressionRuleType {

    /**
     * @var ArithmeticEvaluationType $booleanExpression
     * @access public
     */
    public $booleanExpression = null;

}

class CabinClassDesignationType {

    /**
     * @var AlphaString_Length1To1 $classDesignator
     * @access public
     */
    public $classDesignator = null;

}

class CabinIdentificationType {

    /**
     * @var AlphaNumericString_Length1To8 $cabinNbr
     * @access public
     */
    public $cabinNbr = null;

}

class CabinIdentificationType_233500C {

    /**
     * @var AlphaNumericString_Length1To2 $cabinQualifier
     * @access public
     */
    public $cabinQualifier = null;

    /**
     * @var AlphaString_Length0To1 $cabin
     * @access public
     */
    public $cabin = null;

}

class CabinProductDetailsType {

    /**
     * @var AlphaString_Length1To1 $rbd
     * @access public
     */
    public $rbd = null;

    /**
     * @var AlphaNumericString_Length0To1 $bookingModifier
     * @access public
     */
    public $bookingModifier = null;

    /**
     * @var AlphaNumericString_Length1To1 $cabin
     * @access public
     */
    public $cabin = null;

    /**
     * @var AlphaNumericString_Length0To3 $avlStatus
     * @access public
     */
    public $avlStatus = null;

}

class CodedAttributeInformationType {

    /**
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CodedAttributeInformationType_120742C {

    /**
     * @var AlphaNumericString_Length1To5 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To20 $value
     * @access public
     */
    public $value = null;

}

class CodedAttributeInformationType_139508C {

    /**
     * @var AlphaNumericString_Length1To5 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To20 $value
     * @access public
     */
    public $value = null;

}

class CodedAttributeInformationType_247828C {

    /**
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To10 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CodedAttributeInformationType_247829C {

    /**
     * @var AlphaNumericString_Length1To5 $feeType
     * @access public
     */
    public $feeType = null;

    /**
     * @var AlphaNumericString_Length1To50 $feeIdNumber
     * @access public
     */
    public $feeIdNumber = null;

}

class CodedAttributeInformationType_254574C {

    /**
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To50 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CodedAttributeType {

    /**
     * @var CodedAttributeInformationType $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_181239S {

    /**
     * @var CodedAttributeInformationType_254574C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_78500S {

    /**
     * @var CodedAttributeInformationType $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CommercialAgreementsType {

    /**
     * @var CompanyRoleIdentificationType $codeshareDetails
     * @access public
     */
    public $codeshareDetails = null;

    /**
     * @var CompanyRoleIdentificationType $otherCodeshareDetails
     * @access public
     */
    public $otherCodeshareDetails = null;

}

class CommercialAgreementsType_78540S {

    /**
     * @var CompanyRoleIdentificationType_120761C $codeshareDetails
     * @access public
     */
    public $codeshareDetails = null;

    /**
     * @var CompanyRoleIdentificationType_120761C $otherCodeshareDetails
     * @access public
     */
    public $otherCodeshareDetails = null;

}

class CompanyIdentificationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

}

class CompanyIdentificationType {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To3 $partnerCode
     * @access public
     */
    public $partnerCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $otherPartnerCode
     * @access public
     */
    public $otherPartnerCode = null;

}

class CompanyIdentificationType_120719C {

    /**
     * @var AlphaNumericString_Length0To1 $carrierQualifier
     * @access public
     */
    public $carrierQualifier = null;

    /**
     * @var AlphaNumericString_Length2To3 $carrierId
     * @access public
     */
    public $carrierId = null;

}

class CompanyIdentificationType_195544C {

    /**
     * @var AlphaNumericString_Length2To3 $marketingCarrier
     * @access public
     */
    public $marketingCarrier = null;

    /**
     * @var AlphaNumericString_Length2To3 $operatingCarrier
     * @access public
     */
    public $operatingCarrier = null;

}

class CompanyIdentificationType_233548C {

    /**
     * @var AlphaNumericString_Length0To1 $carrierQualifier
     * @access public
     */
    public $carrierQualifier = null;

    /**
     * @var AlphaNumericString_Length2To3 $carrierId
     * @access public
     */
    public $carrierId = null;

}

class CompanyRoleIdentificationType {

    /**
     * @var AlphaString_Length1To1 $codeShareType
     * @access public
     */
    public $codeShareType = null;

    /**
     * @var AlphaNumericString_Length2To3 $airlineDesignator
     * @access public
     */
    public $airlineDesignator = null;

    /**
     * @var NumericInteger_Length1To4 $flightNumber
     * @access public
     */
    public $flightNumber = null;

}

class CompanyRoleIdentificationType_120761C {

    /**
     * @var AlphaString_Length1To1 $codeShareType
     * @access public
     */
    public $codeShareType = null;

    /**
     * @var AlphaNumericString_Length2To3 $airlineDesignator
     * @access public
     */
    public $airlineDesignator = null;

    /**
     * @var NumericInteger_Length1To4 $flightNumber
     * @access public
     */
    public $flightNumber = null;

}

class ConnectPointDetailsType {

    /**
     * @var AlphaString_Length0To1 $exclusionIdentifier
     * @access public
     */
    public $exclusionIdentifier = null;

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaString_Length1To1 $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

}

class ConnectPointDetailsType_195492C {

    /**
     * @var AlphaNumericString_Length0To1 $inclusionIdentifier
     * @access public
     */
    public $inclusionIdentifier = null;

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaString_Length1To1 $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

}

class ConnectionDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $location
     * @access public
     */
    public $location = null;

}

class ConnectionTypeI {

    /**
     * @var ConnectionDetailsTypeI $connectionDetails
     * @access public
     */
    public $connectionDetails = null;

}

class ConsumerReferenceIdentificationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

}

class ConsumerReferenceInformationType {

    /**
     * @var ConsumerReferenceIdentificationType $customerReferences
     * @access public
     */
    public $customerReferences = null;

}

class ConversionRateDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     * @var AlphaString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class ConversionRateType {

    /**
     * @var ConversionRateDetailsType $conversionRateDetail
     * @access public
     */
    public $conversionRateDetail = null;

}

class CorporateFareIdentifiersType {

    /**
     * @var AlphaNumericString_Length1To3 $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $identifyNumber
     * @access public
     */
    public $identifyNumber = null;

}

class CorporateFareInformationType {

    /**
     * @var CorporateFareIdentifiersType $corporateFareIdentifiers
     * @access public
     */
    public $corporateFareIdentifiers = null;

}

class CorporateIdentificationType {

    /**
     * @var CorporateIdentityType $corporateId
     * @access public
     */
    public $corporateId = null;

}

class CorporateIdentityType {

    /**
     * @var AlphaNumericString_Length0To3 $corporateQualifier
     * @access public
     */
    public $corporateQualifier = null;

    /**
     * @var AlphaNumericString_Length1To20 $identity
     * @access public
     */
    public $identity = null;

}

class CriteriaiDetaislType {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To18 $value
     * @access public
     */
    public $value = null;

}

class DataInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class DataTypeInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $subType
     * @access public
     */
    public $subType = null;

    /**
     * @var AlphaNumericString_Length1To3 $option
     * @access public
     */
    public $option = null;

}

class DateAndTimeDetailsTypeI {

    /**
     * @var Date_DDMMYY $firstDate
     * @access public
     */
    public $firstDate = null;

    /**
     * @var AlphaNumericString_Length1To3 $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var AlphaNumericString_Length1To3 $locationIdentification
     * @access public
     */
    public $locationIdentification = null;

}

class DateAndTimeDetailsTypeI_120740C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var Time24_HHMM $time
     * @access public
     */
    public $time = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier2
     * @access public
     */
    public $qualifier2 = null;

    /**
     * @var AlphaNumericString_Length1To3 $reserved1
     * @access public
     */
    public $reserved1 = null;

    /**
     * @var AlphaNumericString_Length3To5 $reserved2
     * @access public
     */
    public $reserved2 = null;

}

class DateAndTimeDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $date
     * @access public
     */
    public $date = null;

    /**
     * @var Time24_HHMM $time
     * @access public
     */
    public $time = null;

}

class DateAndTimeDetailsType_120762C {

    /**
     * @var AlphaNumericString_Length1To3 $dateQualifier
     * @access public
     */
    public $dateQualifier = null;

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var Time24_HHMM $firstTime
     * @access public
     */
    public $firstTime = null;

    /**
     * @var AlphaNumericString_Length1To3 $equipementType
     * @access public
     */
    public $equipementType = null;

    /**
     * @var AlphaNumericString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

}

class DateAndTimeDetailsType_254619C {

    /**
     * @var AlphaNumericString_Length1To3 $rangeQualifier
     * @access public
     */
    public $rangeQualifier = null;

    /**
     * @var NumericInteger_Length1To6 $dayInterval
     * @access public
     */
    public $dayInterval = null;

    /**
     * @var Time24_HHMM $timeAtdestination
     * @access public
     */
    public $timeAtdestination = null;

}

class DateAndTimeInformationTypeI {

    /**
     * @var DateAndTimeDetailsTypeI $dateAndTime
     * @access public
     */
    public $dateAndTime = null;

}

class DateAndTimeInformationType {

    /**
     * @var DateAndTimeDetailsType $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class DateAndTimeInformationType_181295S {

    /**
     * @var DateAndTimeDetailsTypeI $firstDateTimeDetail
     * @access public
     */
    public $firstDateTimeDetail = null;

    /**
     * @var DateAndTimeDetailsType_254619C $rangeOfDate
     * @access public
     */
    public $rangeOfDate = null;

    /**
     * @var DateAndTimeDetailsType $tripDetails
     * @access public
     */
    public $tripDetails = null;

}

class DateTimePeriodDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class DepartureLocationType {

    /**
     * @var ArrivalLocationDetailsType_120834C $departurePoint
     * @access public
     */
    public $departurePoint = null;

    /**
     * @var MultiCityOptionType $depMultiCity
     * @access public
     */
    public $depMultiCity = null;

    /**
     * @var PNRSegmentReferenceType $firstPnrSegmentRef
     * @access public
     */
    public $firstPnrSegmentRef = null;

    /**
     * @var CodedAttributeInformationType_139508C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class FOPRepresentationType {

    /**
     * @var TicketingFormOfPaymentType $fopPNRDetails
     * @access public
     */
    public $fopPNRDetails = null;

    /**
     * @var SequenceDetailsTypeU_94494S $fopSequenceNumber
     * @access public
     */
    public $fopSequenceNumber = null;

    /**
     * @var FreeTextInformationType_94495S $fopFreeflow
     * @access public
     */
    public $fopFreeflow = null;

    /**
     * @var PNRSupplementaryDataType $pnrSupplementaryData
     * @access public
     */
    public $pnrSupplementaryData = null;

    /**
     * @var PaymentGroupType $paymentModule
     * @access public
     */
    public $paymentModule = null;

}

class FareDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerTypeQualifier
     * @access public
     */
    public $passengerTypeQualifier = null;

}

class FareFamilyCriteriaType {

    /**
     * @var AlphaNumericString_Length1To3 $carrierId
     * @access public
     */
    public $carrierId = null;

    /**
     * @var AlphaString_Length1To2 $rdb
     * @access public
     */
    public $rdb = null;

    /**
     * @var FareQualifierInformationType $fareFamilyInfo
     * @access public
     */
    public $fareFamilyInfo = null;

    /**
     * @var FareProductDetailsType $fareProductDetail
     * @access public
     */
    public $fareProductDetail = null;

    /**
     * @var MultipleIdentificationNumbersTypeI $corporateInfo
     * @access public
     */
    public $corporateInfo = null;

    /**
     * @var CabinClassDesignationType $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     * @var AlphaNumericString_Length1To3 $cabinProcessingIdentifier
     * @access public
     */
    public $cabinProcessingIdentifier = null;

    /**
     * @var ProductDateTimeTypeI_194583C $dateTimeDetails
     * @access public
     */
    public $dateTimeDetails = null;

    /**
     * @var CodedAttributeInformationType_120742C $otherCriteria
     * @access public
     */
    public $otherCriteria = null;

}

class FareFamilyDetailsType {

    /**
     * @var AlphaNumericString_Length1To10 $commercialFamily
     * @access public
     */
    public $commercialFamily = null;

}

class FareFamilyType {

    /**
     * @var NumericInteger_Length1To3 $refNumber
     * @access public
     */
    public $refNumber = null;

    /**
     * @var AlphaNumericString_Length1To10 $fareFamilyname
     * @access public
     */
    public $fareFamilyname = null;

    /**
     * @var NumericInteger_Length1To4 $hierarchy
     * @access public
     */
    public $hierarchy = null;

    /**
     * @var AlphaString_Length1To1 $cabin
     * @access public
     */
    public $cabin = null;

    /**
     * @var FareFamilyDetailsType $commercialFamilyDetails
     * @access public
     */
    public $commercialFamilyDetails = null;

    /**
     * @var AlphaNumericString_Length1To100 $description
     * @access public
     */
    public $description = null;

    /**
     * @var AlphaNumericString_Length2To3 $carrier
     * @access public
     */
    public $carrier = null;

    /**
     * @var ServicesReferencesType $services
     * @access public
     */
    public $services = null;

}

class FareInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $valueQualifier
     * @access public
     */
    public $valueQualifier = null;

    /**
     * @var NumericInteger_Length1To15 $value
     * @access public
     */
    public $value = null;

}

class FareInformationType {

    /**
     * @var AMA_EDICodesetType_Length1to3 $valueQualifier
     * @access public
     */
    public $valueQualifier = null;

    /**
     * @var NumericInteger_Length1To15 $value
     * @access public
     */
    public $value = null;

    /**
     * @var FareDetailsType_193037C $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $identityNumber
     * @access public
     */
    public $identityNumber = null;

    /**
     * @var FareTypeGroupingInformationType $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

    /**
     * @var AlphaNumericString_Length1To35 $rateCategory
     * @access public
     */
    public $rateCategory = null;

}

class FareProductDetailsType {

    /**
     * @var AlphaNumericString_Length1To18 $fareBasis
     * @access public
     */
    public $fareBasis = null;

}

class FareQualifierInformationType {

    /**
     * @var AlphaNumericString_Length0To3 $fareFamilyQual
     * @access public
     */
    public $fareFamilyQual = null;

}

class FareTypeGroupingInformationType {

    /**
     * @var AlphaNumericString_Length1To35 $pricingGroup
     * @access public
     */
    public $pricingGroup = null;

}

class FlightProductInformationType {

    /**
     * @var CabinProductDetailsType_195516C $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     * @var ProductTypeDetailsType $contextDetails
     * @access public
     */
    public $contextDetails = null;

}

class FormOfPaymentDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var NumericDecimal_Length1To9 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $creditCardCode
     * @access public
     */
    public $creditCardCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $accountNumber
     * @access public
     */
    public $accountNumber = null;

    /**
     * @var Date_MMYY $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     * @var AlphaNumericString_Length1To8 $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     * @var AlphaNumericString_Length1To10 $customerAccountNumber
     * @access public
     */
    public $customerAccountNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $paymentTimeReference
     * @access public
     */
    public $paymentTimeReference = null;

    /**
     * @var AlphaNumericString_Length1To70 $freetext
     * @access public
     */
    public $freetext = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
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

class FormOfPaymentTypeI {

    /**
     * @var FormOfPaymentDetailsTypeI $fop
     * @access public
     */
    public $fop = null;

}

class FreeTextDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextInformationType {

    /**
     * @var FreeTextDetailsType $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To199 $freeText
     * @access public
     */
    public $freeText = null;

}

class FrequencyType {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To6 $value
     * @access public
     */
    public $value = null;

}

class FrequentTravellerIdentificationCodeType {

    /**
     * @var FrequentTravellerIdentificationTypeI $frequentTraveller
     * @access public
     */
    public $frequentTraveller = null;

}

class FrequentTravellerIdentificationCodeType_177150S {

    /**
     * @var FrequentTravellerIdentificationType_249074C $frequentTravellerDetails
     * @access public
     */
    public $frequentTravellerDetails = null;

}

class FrequentTravellerIdentificationType {

    /**
     * @var AlphaNumericString_Length2To3 $company
     * @access public
     */
    public $company = null;

    /**
     * @var AlphaNumericString_Length1To27 $membershipNumber
     * @access public
     */
    public $membershipNumber = null;

    /**
     * @var AlphaNumericString_Length4To4 $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     * @var AlphaNumericString_Length1To1 $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $tierDescription
     * @access public
     */
    public $tierDescription = null;

}

class FrequentTravellerIdentificationType_249074C {

    /**
     * @var AlphaNumericString_Length1To3 $carrier
     * @access public
     */
    public $carrier = null;

    /**
     * @var AlphaNumericString_Length1To25 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To10 $customerReference
     * @access public
     */
    public $customerReference = null;

    /**
     * @var AlphaNumericString_Length1To35 $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     * @var AlphaNumericString_Length1To12 $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $tierDescription
     * @access public
     */
    public $tierDescription = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class GroupPassengerDetailsType {

    /**
     * @var SegmentRepetitionControlTypeI $passengerReference
     * @access public
     */
    public $passengerReference = null;

    /**
     * @var psgDetailsInfo $psgDetailsInfo
     * @access public
     */
    public $psgDetailsInfo = null;

}

class psgDetailsInfo {

    /**
     * @var FareInformationTypeI $discountPtc
     * @access public
     */
    public $discountPtc = null;

    /**
     * @var FrequentTravellerIdentificationCodeType $flequentFlyerDetails
     * @access public
     */
    public $flequentFlyerDetails = null;

}

class HeaderInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var DateTimePeriodDetailsTypeI $dateTimePeriodDetails
     * @access public
     */
    public $dateTimePeriodDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

    /**
     * @var AlphaNumericString_Length1To35 $productIdentification
     * @access public
     */
    public $productIdentification = null;

}

class ItemNumberIdentificationType {

    /**
     * @var AlphaNumericString_Length1To4 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

}

class ItemNumberType {

    /**
     * @var ItemNumberIdentificationType_192331C $itemNumber
     * @access public
     */
    public $itemNumber = null;

}

class ItemNumberType_80866S {

    /**
     * @var ItemNumberIdentificationType $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class ItemReferencesAndVersionsType {

    /**
     * @var AlphaNumericString_Length1To3 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var NumericInteger_Length1To35 $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class ItineraryDetailsType {

    /**
     * @var AlphaString_Length1To1 $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     * @var NumericInteger_Length1To3 $segmentNumber
     * @access public
     */
    public $segmentNumber = null;

}

class LocationDetailsTypeI {

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaNumericString_Length1To3 $country
     * @access public
     */
    public $country = null;

}

class LocationIdentificationDetailsType {

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaString_Length1To1 $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

    /**
     * @var AlphaNumericString_Length1To5 $terminal
     * @access public
     */
    public $terminal = null;

}

class LocationTypeI {

    /**
     * @var AlphaString_Length3To3 $cityCode
     * @access public
     */
    public $cityCode = null;

}

class MileageTimeDetailsTypeI {

    /**
     * @var NumericInteger_Length1To18 $flightLegMileage
     * @access public
     */
    public $flightLegMileage = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class MonetaryAndCabinInformationDetailsType {

    /**
     * @var AlphaNumericString_Length0To3 $amountType
     * @access public
     */
    public $amountType = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaString_Length1To1 $cabinClassDesignator
     * @access public
     */
    public $cabinClassDesignator = null;

}

class MonetaryAndCabinInformationType {

    /**
     * @var MonetaryAndCabinInformationDetailsType $moneyAndCabinInfo
     * @access public
     */
    public $moneyAndCabinInfo = null;

}

class MonetaryInformationDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

}

class MonetaryInformationDetailsTypeI_194597C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaString_Length3To3 $locationId
     * @access public
     */
    public $locationId = null;

}

class MonetaryInformationDetailsTypeI_65140C {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var AlphaNumericString_Length1To12 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class MonetaryInformationDetailsTypeI_65141C {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var AlphaNumericString_Length1To12 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To3 $location
     * @access public
     */
    public $location = null;

}

class MonetaryInformationTypeI {

    /**
     * @var MonetaryInformationDetailsTypeI_17849C $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var MonetaryInformationDetailsTypeI_17849C $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class MonetaryInformationType {

    /**
     * @var MonetaryInformationDetailsType $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class MonetaryInformationType_80162S {

    /**
     * @var MonetaryInformationDetailsTypeI_65140C $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class MultiCityOptionType {

    /**
     * @var AlphaString_Length3To5 $locationId
     * @access public
     */
    public $locationId = null;

    /**
     * @var AlphaString_Length1To1 $airportCityQualifier
     * @access public
     */
    public $airportCityQualifier = null;

}

class MultipleIdentificationNumbersTypeI {

    /**
     * @var AlphaNumericString_Length1To12 $corporateNumberIdentifier
     * @access public
     */
    public $corporateNumberIdentifier = null;

    /**
     * @var AlphaNumericString_Length1To20 $corporateName
     * @access public
     */
    public $corporateName = null;

}

class NumberOfUnitDetailsTypeI {

    /**
     * @var NumericInteger_Length1To2 $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class NumberOfUnitDetailsType {

    /**
     * @var NumericInteger_Length1To15 $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class NumberOfUnitDetailsType_191580C {

    /**
     * @var NumericInteger_Length1To6 $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     * @var AlphaNumericString_Length1To3 $typeOfUnit
     * @access public
     */
    public $typeOfUnit = null;

}

class NumberOfUnitsType {

    /**
     * @var NumberOfUnitDetailsType $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class NumberOfUnitsType_80154S {

    /**
     * @var NumberOfUnitDetailsType $unitNumberDetail
     * @access public
     */
    public $unitNumberDetail = null;

}

class OriginAndDestinationRequestType {

    /**
     * @var NumericInteger_Length1To2 $segRef
     * @access public
     */
    public $segRef = null;

    /**
     * @var ItineraryDetailsType $locationForcing
     * @access public
     */
    public $locationForcing = null;

}

class OriginatorIdentificationDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

}

class PNRSegmentReferenceType {

    /**
     * @var NumericInteger_Length0To35 $pnrSegmentTattoo
     * @access public
     */
    public $pnrSegmentTattoo = null;

    /**
     * @var AlphaString_Length1To1 $pnrSegmentQualifier
     * @access public
     */
    public $pnrSegmentQualifier = null;

}

class PassengerItineraryInformationType {

    /**
     * @var AlphaString_Length1To1 $booking
     * @access public
     */
    public $booking = null;

    /**
     * @var AlphaNumericString_Length1To1 $identifier
     * @access public
     */
    public $identifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var NumericInteger_Length1To3 $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var ProductDateTimeType $dateTimeDetails
     * @access public
     */
    public $dateTimeDetails = null;

    /**
     * @var AlphaString_Length1To1 $designator
     * @access public
     */
    public $designator = null;

    /**
     * @var AlphaNumericString_Length1To3 $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var ProductTypeDetailsType $productTypeDetails
     * @access public
     */
    public $productTypeDetails = null;

}

class PricingTicketingDetailsType {

    /**
     * @var AlphaNumericString_Length1To35 $idNumber
     * @access public
     */
    public $idNumber = null;

}

class PricingTicketingInformationType {

    /**
     * @var AlphaNumericString_Length0To3 $priceType
     * @access public
     */
    public $priceType = null;

}

class ProductDateTimeTypeI {

    /**
     * @var Date_DDMMYY $depDate
     * @access public
     */
    public $depDate = null;

    /**
     * @var Time24_HHMM $depTime
     * @access public
     */
    public $depTime = null;

    /**
     * @var Date_DDMMYY $arrDate
     * @access public
     */
    public $arrDate = null;

}

class ProductDateTimeTypeI_194583C {

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var Date_DDMMYY $otherDate
     * @access public
     */
    public $otherDate = null;

}

class ProductDateTimeTypeI_194598C {

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var Date_DDMMYY $rtcDate
     * @access public
     */
    public $rtcDate = null;

}

class ProductDateTimeType {

    /**
     * @var Date_DDMMYY $dateOfDeparture
     * @access public
     */
    public $dateOfDeparture = null;

    /**
     * @var Time24_HHMM $timeOfDeparture
     * @access public
     */
    public $timeOfDeparture = null;

    /**
     * @var Date_DDMMYY $dateOfArrival
     * @access public
     */
    public $dateOfArrival = null;

    /**
     * @var Time24_HHMM $timeOfArrival
     * @access public
     */
    public $timeOfArrival = null;

    /**
     * @var NumericInteger_Length1To1 $dateVariation
     * @access public
     */
    public $dateVariation = null;

}

class ProductDateTimeType_195546C {

    /**
     * @var Date_DDMMYY $dateOfDeparture
     * @access public
     */
    public $dateOfDeparture = null;

    /**
     * @var Time24_HHMM $timeOfDeparture
     * @access public
     */
    public $timeOfDeparture = null;

    /**
     * @var Date_DDMMYY $dateOfArrival
     * @access public
     */
    public $dateOfArrival = null;

    /**
     * @var Time24_HHMM $timeOfArrival
     * @access public
     */
    public $timeOfArrival = null;

    /**
     * @var NumericInteger_Length1To1 $dateVariation
     * @access public
     */
    public $dateVariation = null;

}

class ProductFacilitiesType {

    /**
     * @var AlphaNumericString_Length1To70 $equipmentDescription
     * @access public
     */
    public $equipmentDescription = null;

}

class ProductIdentificationDetailsTypeI {

    /**
     * @var NumericInteger_Length1To4 $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var AlphaString_Length1To1 $subtype
     * @access public
     */
    public $subtype = null;

}

class ProductIdentificationDetailsTypeI_50878C {

    /**
     * @var AlphaNumericString_Length1To5 $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     * @var AlphaNumericString_Length1To2 $bookingClass
     * @access public
     */
    public $bookingClass = null;

    /**
     * @var AlphaNumericString_Length1To3 $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

    /**
     * @var AlphaNumericString_Length1To7 $modifier
     * @access public
     */
    public $modifier = null;

}

class ProductLocationDetailsTypeI {

    /**
     * @var AlphaString_Length3To3 $station
     * @access public
     */
    public $station = null;

}

class ProductTypeDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To1 $flightIndicator
     * @access public
     */
    public $flightIndicator = null;

}

class ProductTypeDetailsType {

    /**
     * @var AlphaNumericString_Length1To2 $flightIndicator
     * @access public
     */
    public $flightIndicator = null;

}

class ProductTypeDetailsType_120801C {

    /**
     * @var AlphaNumericString_Length1To2 $flightType
     * @access public
     */
    public $flightType = null;

}

class ProductTypeDetailsType_205137C {

    /**
     * @var AlphaNumericString_Length1To6 $avl
     * @access public
     */
    public $avl = null;

}

class ProposedSegmentDetailsType {

    /**
     * @var AlphaNumericString_Length1To6 $ref
     * @access public
     */
    public $ref = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class ProposedSegmentType {

    /**
     * @var ProposedSegmentDetailsType $flightProposal
     * @access public
     */
    public $flightProposal = null;

    /**
     * @var AlphaNumericString_Length0To3 $flightCharacteristic
     * @access public
     */
    public $flightCharacteristic = null;

    /**
     * @var AlphaString_Length1To1 $majCabin
     * @access public
     */
    public $majCabin = null;

}

class ReferenceInfoType {

    /**
     * @var ReferencingDetailsType $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

    /**
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class ReferencingDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class RoutingInformationTypeI {

    /**
     * @var ProductLocationDetailsTypeI $routingDetails
     * @access public
     */
    public $routingDetails = null;

}

class SegmentRepetitionControlDetailsTypeI {

    /**
     * @var NumericInteger_Length1To15 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var NumericInteger_Length1To15 $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

}

class SegmentRepetitionControlTypeI {

    /**
     * @var SegmentRepetitionControlDetailsTypeI $segmentControlDetails
     * @access public
     */
    public $segmentControlDetails = null;

}

class SelectionDetailsInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $option
     * @access public
     */
    public $option = null;

}

class SelectionDetailsInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class SelectionDetailsType {

    /**
     * @var SelectionDetailsInformationTypeU $bookingChannel
     * @access public
     */
    public $bookingChannel = null;

}

class SpecialRequirementsDataDetailsType {

    /**
     * @var AlphaNumericString_Length1To10 $seatNumber
     * @access public
     */
    public $seatNumber = null;

    /**
     * @var AlphaNumericString_Length1To2 $seatCharacteristic
     * @access public
     */
    public $seatCharacteristic = null;

}

class SpecialRequirementsDetailsType {

    /**
     * @var SpecialRequirementsDataDetailsType $seatDetails
     * @access public
     */
    public $seatDetails = null;

}

class SpecialRequirementsTypeDetailsType {

    /**
     * @var AlphaNumericString_Length1To4 $serviceClassification
     * @access public
     */
    public $serviceClassification = null;

    /**
     * @var AlphaNumericString_Length1To3 $serviceStatus
     * @access public
     */
    public $serviceStatus = null;

    /**
     * @var NumericInteger_Length1To15 $serviceNumberOfInstances
     * @access public
     */
    public $serviceNumberOfInstances = null;

    /**
     * @var AlphaNumericString_Length1To3 $serviceMarketingCarrier
     * @access public
     */
    public $serviceMarketingCarrier = null;

    /**
     * @var AlphaNumericString_Length1To3 $serviceGroup
     * @access public
     */
    public $serviceGroup = null;

    /**
     * @var AlphaNumericString_Length1To3 $serviceSubGroup
     * @access public
     */
    public $serviceSubGroup = null;

    /**
     * @var AlphaNumericString_Length1To70 $serviceFreeText
     * @access public
     */
    public $serviceFreeText = null;

}

class SpecificDataInformationType {

    /**
     * @var DataTypeInformationType $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     * @var DataInformationType $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class StationInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To2 $departTerminal
     * @access public
     */
    public $departTerminal = null;

}

class StructuredDateTimeType {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

}

class StructuredPeriodInformationType {

    /**
     * @var StructuredDateTimeType_139827C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_139827C $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class TaxDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To17 $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class TaxType2 {

    /**
     * @var AlphaNumericString_Length1To3 $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     * @var TaxDetailsType $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class TicketNumberDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To10 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To1 $type
     * @access public
     */
    public $type = null;

}

class TicketNumberTypeI {

    /**
     * @var TicketNumberDetailsTypeI_192850C $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class TicketingPriceSchemeType {

    /**
     * @var AlphaNumericString_Length1To35 $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

    /**
     * @var AlphaNumericString_Length1To35 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var AlphaNumericString_Length1To250 $description
     * @access public
     */
    public $description = null;

}

class TrafficRestrictionDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

}

class TrafficRestrictionTypeI {

    /**
     * @var TrafficRestrictionDetailsTypeI $trafficRestrictionDetails
     * @access public
     */
    public $trafficRestrictionDetails = null;

}

class TravelFlightInformationType {

    /**
     * @var CabinIdentificationType $cabinId
     * @access public
     */
    public $cabinId = null;

    /**
     * @var CompanyIdentificationType_120719C $companyIdentity
     * @access public
     */
    public $companyIdentity = null;

    /**
     * @var ProductTypeDetailsType_120801C $flightDetail
     * @access public
     */
    public $flightDetail = null;

    /**
     * @var ConnectPointDetailsType_195492C $inclusionDetail
     * @access public
     */
    public $inclusionDetail = null;

    /**
     * @var ConnectPointDetailsType $exclusionDetail
     * @access public
     */
    public $exclusionDetail = null;

    /**
     * @var NumberOfUnitDetailsTypeI $unitNumberDetail
     * @access public
     */
    public $unitNumberDetail = null;

}

class TravelFlightInformationType_165052S {

    /**
     * @var CabinIdentificationType_233500C $cabinId
     * @access public
     */
    public $cabinId = null;

    /**
     * @var CompanyIdentificationType_233548C $companyIdentity
     * @access public
     */
    public $companyIdentity = null;

    /**
     * @var ProductTypeDetailsType_120801C $flightDetail
     * @access public
     */
    public $flightDetail = null;

    /**
     * @var ConnectPointDetailsType_195492C $inclusionDetail
     * @access public
     */
    public $inclusionDetail = null;

    /**
     * @var ConnectPointDetailsType $exclusionDetail
     * @access public
     */
    public $exclusionDetail = null;

    /**
     * @var NumberOfUnitDetailsTypeI $unitNumberDetail
     * @access public
     */
    public $unitNumberDetail = null;

}

class TravelFlightInformationType_165053S {

    /**
     * @var CabinIdentificationType_233500C $cabinId
     * @access public
     */
    public $cabinId = null;

    /**
     * @var CompanyIdentificationType_120719C $companyIdentity
     * @access public
     */
    public $companyIdentity = null;

    /**
     * @var ProductTypeDetailsType_120801C $flightDetail
     * @access public
     */
    public $flightDetail = null;

    /**
     * @var ConnectPointDetailsType_195492C $inclusionDetail
     * @access public
     */
    public $inclusionDetail = null;

    /**
     * @var ConnectPointDetailsType $exclusionDetail
     * @access public
     */
    public $exclusionDetail = null;

    /**
     * @var NumberOfUnitDetailsTypeI $unitNumberDetail
     * @access public
     */
    public $unitNumberDetail = null;

}

class TravelProductInformationTypeI {
    
}

class TravelProductType {

    /**
     * @var ProductDateTimeType $productDateTime
     * @access public
     */
    public $productDateTime = null;

    /**
     * @var LocationIdentificationDetailsType $location
     * @access public
     */
    public $location = null;

    /**
     * @var CompanyIdentificationType $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To8 $flightOrtrainNumber
     * @access public
     */
    public $flightOrtrainNumber = null;

    /**
     * @var AdditionalProductDetailsType $productDetail
     * @access public
     */
    public $productDetail = null;

    /**
     * @var ProductFacilitiesType $addProductDetail
     * @access public
     */
    public $addProductDetail = null;

    /**
     * @var CodedAttributeInformationType_247827C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class TravellerDetailsType {

    /**
     * @var AlphaNumericString_Length1To70 $givenName
     * @access public
     */
    public $givenName = null;

}

class TravellerReferenceInformationType {

    /**
     * @var AlphaNumericString_Length1To6 $ptc
     * @access public
     */
    public $ptc = null;

    /**
     * @var TravellerDetailsType $traveller
     * @access public
     */
    public $traveller = null;

}

class UniqueIdDescriptionType {

    /**
     * @var NumericInteger_Length1To5 $iDSequenceNumber
     * @access public
     */
    public $iDSequenceNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $iDQualifier
     * @access public
     */
    public $iDQualifier = null;

}

class UserIdentificationType {

    /**
     * @var OriginatorIdentificationDetailsTypeI_170735C $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     * @var AlphaNumericString_Length1To1 $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

}

class ValueSearchCriteriaType {

    /**
     * @var AlphaNumericString_Length1To35 $ref
     * @access public
     */
    public $ref = null;

    /**
     * @var AlphaNumericString_Length1To18 $value
     * @access public
     */
    public $value = null;

    /**
     * @var CriteriaiDetaislType $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class Fare_MasterPricerTravelBoardSearchReply {

    /**
     * @var StatusType $replyStatus
     * @access public
     */
    public $replyStatus = null;

    /**
     * @var errorMessage $errorMessage
     * @access public
     */
    public $errorMessage = null;

    /**
     * @var ConversionRateTypeI $conversionRate
     * @access public
     */
    public $conversionRate = null;

    /**
     * @var FareInformationType $solutionFamily
     * @access public
     */
    public $solutionFamily = null;

    /**
     * @var FareFamilyType $familyInformation
     * @access public
     */
    public $familyInformation = null;

    /**
     * @var amountInfoForAllPax $amountInfoForAllPax
     * @access public
     */
    public $amountInfoForAllPax = null;

    /**
     * @var amountInfoPerPax $amountInfoPerPax
     * @access public
     */
    public $amountInfoPerPax = null;

    /**
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

    /**
     * @var CompanyIdentificationTextType $companyIdText
     * @access public
     */
    public $companyIdText = null;

    /**
     * @var officeIdDetails $officeIdDetails
     * @access public
     */
    public $officeIdDetails = null;

    /**
     * @var flightIndex $flightIndex
     * @access public
     */
    public $flightIndex = null;

    /**
     * @var recommendation $recommendation
     * @access public
     */
    public $recommendation = null;

    /**
     * @var otherSolutions $otherSolutions
     * @access public
     */
    public $otherSolutions = null;

    /**
     * @var warningInfo $warningInfo
     * @access public
     */
    public $warningInfo = null;

    /**
     * @var globalInformation $globalInformation
     * @access public
     */
    public $globalInformation = null;

    /**
     * @var serviceFeesGrp $serviceFeesGrp
     * @access public
     */
    public $serviceFeesGrp = null;

    /**
     * @var ValueSearchCriteriaType $value
     * @access public
     */
    public $value = null;

    /**
     * @var mnrGrp $mnrGrp
     * @access public
     */
    public $mnrGrp = null;

}

class errorMessage {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class amountInfoForAllPax {

    /**
     * @var MonetaryInformationType_137835S $itineraryAmounts
     * @access public
     */
    public $itineraryAmounts = null;

    /**
     * @var amountsPerSgt $amountsPerSgt
     * @access public
     */
    public $amountsPerSgt = null;

}

class amountsPerSgt {

    /**
     * @var ReferenceInfoType_133176S $sgtRef
     * @access public
     */
    public $sgtRef = null;

    /**
     * @var MonetaryInformationType_137835S $amounts
     * @access public
     */
    public $amounts = null;

}

class amountInfoPerPax {

    /**
     * @var SpecificTravellerType $paxRef
     * @access public
     */
    public $paxRef = null;

    /**
     * @var FareInformationType_80868S $paxAttributes
     * @access public
     */
    public $paxAttributes = null;

    /**
     * @var MonetaryInformationType_137835S $itineraryAmounts
     * @access public
     */
    public $itineraryAmounts = null;

    /**
     * @var amountsPerSgt $amountsPerSgt
     * @access public
     */
    public $amountsPerSgt = null;

}

class flightIndex {

    /**
     * @var OriginAndDestinationRequestType $requestedSegmentRef
     * @access public
     */
    public $requestedSegmentRef = null;

    /**
     * @var groupOfFlights $groupOfFlights
     * @access public
     */
    public $groupOfFlights = null;

}

class recommendation {

    /**
     * @var ItemNumberType_161497S $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var InteractiveFreeTextType_78544S $warningMessage
     * @access public
     */
    public $warningMessage = null;

    /**
     * @var ReferenceInfoType_133176S $fareFamilyRef
     * @access public
     */
    public $fareFamilyRef = null;

    /**
     * @var MonetaryInformationType_134806S $recPriceInfo
     * @access public
     */
    public $recPriceInfo = null;

    /**
     * @var MiniRulesType_78547S $miniRule
     * @access public
     */
    public $miniRule = null;

    /**
     * @var ReferenceInfoType $segmentFlightRef
     * @access public
     */
    public $segmentFlightRef = null;

    /**
     * @var recommandationSegmentsFareDetails $recommandationSegmentsFareDetails
     * @access public
     */
    public $recommandationSegmentsFareDetails = null;

    /**
     * @var paxFareProduct $paxFareProduct
     * @access public
     */
    public $paxFareProduct = null;

    /**
     * @var specificRecDetails $specificRecDetails
     * @access public
     */
    public $specificRecDetails = null;

}

class recommandationSegmentsFareDetails {

    /**
     * @var OriginAndDestinationRequestType $recommendationSegRef
     * @access public
     */
    public $recommendationSegRef = null;

    /**
     * @var MonetaryInformationType_137835S $segmentMonetaryInformation
     * @access public
     */
    public $segmentMonetaryInformation = null;

}

class paxFareProduct {

    /**
     * @var PricingTicketingSubsequentType_144401S $paxFareDetail
     * @access public
     */
    public $paxFareDetail = null;

    /**
     * @var ReferenceInfoType_134839S $feeRef
     * @access public
     */
    public $feeRef = null;

    /**
     * @var TravellerReferenceInformationType $paxReference
     * @access public
     */
    public $paxReference = null;

    /**
     * @var TaxType2 $passengerTaxDetails
     * @access public
     */
    public $passengerTaxDetails = null;

    /**
     * @var fare $fare
     * @access public
     */
    public $fare = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

}

class groupOfFares {

    /**
     * @var FlightProductInformationType_176659S $productInformation
     * @access public
     */
    public $productInformation = null;

    /**
     * @var FareCalculationCodeDetailsType $fareCalculationCodeDetails
     * @access public
     */
    public $fareCalculationCodeDetails = null;

    /**
     * @var FareQualifierDetailsType $ticketInfos
     * @access public
     */
    public $ticketInfos = null;

    /**
     * @var ReferenceInfoType_176658S $fareFamiliesRef
     * @access public
     */
    public $fareFamiliesRef = null;

}

class specificRecDetails {

    /**
     * @var ItemReferencesAndVersionsType $specificRecItem
     * @access public
     */
    public $specificRecItem = null;

    /**
     * @var specificProductDetails $specificProductDetails
     * @access public
     */
    public $specificProductDetails = null;

}

class specificProductDetails {

    /**
     * @var PricingTicketingSubsequentType $productReferences
     * @access public
     */
    public $productReferences = null;

    /**
     * @var fareContextDetails $fareContextDetails
     * @access public
     */
    public $fareContextDetails = null;

}

class fareContextDetails {

    /**
     * @var OriginAndDestinationRequestType_134833S $requestedSegmentInfo
     * @access public
     */
    public $requestedSegmentInfo = null;

    /**
     * @var cnxContextDetails $cnxContextDetails
     * @access public
     */
    public $cnxContextDetails = null;

}

class cnxContextDetails {

    /**
     * @var FlightProductInformationType $fareCnxInfo
     * @access public
     */
    public $fareCnxInfo = null;

}

class otherSolutions {

    /**
     * @var SequenceDetailsTypeU $reference
     * @access public
     */
    public $reference = null;

    /**
     * @var amtGroup $amtGroup
     * @access public
     */
    public $amtGroup = null;

    /**
     * @var psgInfo $psgInfo
     * @access public
     */
    public $psgInfo = null;

}

class amtGroup {

    /**
     * @var ReferenceInfoType_165972S $ref
     * @access public
     */
    public $ref = null;

    /**
     * @var MonetaryInformationTypeI $amount
     * @access public
     */
    public $amount = null;

}

class psgInfo {

    /**
     * @var SegmentRepetitionControlTypeI $ref
     * @access public
     */
    public $ref = null;

    /**
     * @var FareInformationTypeI $description
     * @access public
     */
    public $description = null;

    /**
     * @var FrequentTravellerIdentificationCodeType $freqTraveller
     * @access public
     */
    public $freqTraveller = null;

    /**
     * @var MonetaryInformationTypeI $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var FlightProductInformationType_161491S $fare
     * @access public
     */
    public $fare = null;

    /**
     * @var AttributeTypeU $attribute
     * @access public
     */
    public $attribute = null;

}

class warningInfo {

    /**
     * @var DummySegmentTypeI $globalMessageMarker
     * @access public
     */
    public $globalMessageMarker = null;

    /**
     * @var InteractiveFreeTextType_78534S $globalMessage
     * @access public
     */
    public $globalMessage = null;

}

class globalInformation {

    /**
     * @var CodedAttributeType $attributes
     * @access public
     */
    public $attributes = null;

}

class serviceFeesGrp {

    /**
     * @var SelectionDetailsType $serviceTypeInfo
     * @access public
     */
    public $serviceTypeInfo = null;

    /**
     * @var serviceFeeRefGrp $serviceFeeRefGrp
     * @access public
     */
    public $serviceFeeRefGrp = null;

    /**
     * @var serviceCoverageInfoGrp $serviceCoverageInfoGrp
     * @access public
     */
    public $serviceCoverageInfoGrp = null;

    /**
     * @var DummySegmentTypeI $globalMessageMarker
     * @access public
     */
    public $globalMessageMarker = null;

    /**
     * @var serviceFeeInfoGrp $serviceFeeInfoGrp
     * @access public
     */
    public $serviceFeeInfoGrp = null;

    /**
     * @var serviceDetailsGrp $serviceDetailsGrp
     * @access public
     */
    public $serviceDetailsGrp = null;

    /**
     * @var freeBagAllowanceGrp $freeBagAllowanceGrp
     * @access public
     */
    public $freeBagAllowanceGrp = null;

}

class serviceFeeRefGrp {

    /**
     * @var ReferenceInfoType $refInfo
     * @access public
     */
    public $refInfo = null;

}

class serviceCoverageInfoGrp {

    /**
     * @var ItemNumberType $itemNumberInfo
     * @access public
     */
    public $itemNumberInfo = null;

    /**
     * @var serviceCovInfoGrp $serviceCovInfoGrp
     * @access public
     */
    public $serviceCovInfoGrp = null;

}

class serviceCovInfoGrp {

    /**
     * @var SpecificTravellerType $paxRefInfo
     * @access public
     */
    public $paxRefInfo = null;

    /**
     * @var ActionDetailsType $coveragePerFlightsInfo
     * @access public
     */
    public $coveragePerFlightsInfo = null;

    /**
     * @var TransportIdentifierType $carrierInfo
     * @access public
     */
    public $carrierInfo = null;

    /**
     * @var ReferenceInfoType_134840S $refInfo
     * @access public
     */
    public $refInfo = null;

}

class serviceFeeInfoGrp {

    /**
     * @var ItemNumberType $itemNumberInfo
     * @access public
     */
    public $itemNumberInfo = null;

    /**
     * @var serviceDetailsGrp $serviceDetailsGrp
     * @access public
     */
    public $serviceDetailsGrp = null;

}

class serviceDetailsGrp {

    /**
     * @var SpecificDataInformationType $serviceOptionInfo
     * @access public
     */
    public $serviceOptionInfo = null;

    /**
     * @var feeDescriptionGrp $feeDescriptionGrp
     * @access public
     */
    public $feeDescriptionGrp = null;

}

class serviceMatchedInfoGroup {

    /**
     * @var SpecificTravellerType $paxRefInfo
     * @access public
     */
    public $paxRefInfo = null;

    /**
     * @var FareInformationType_80868S $pricingInfo
     * @access public
     */
    public $pricingInfo = null;

    /**
     * @var MonetaryInformationType_134806S $amountInfo
     * @access public
     */
    public $amountInfo = null;

}

class freeBagAllowanceGrp {

    /**
     * @var ExcessBaggageType $freeBagAllownceInfo
     * @access public
     */
    public $freeBagAllownceInfo = null;

    /**
     * @var ItemNumberType_166130S $itemNumberInfo
     * @access public
     */
    public $itemNumberInfo = null;

}

class mnrGrp {

    /**
     * @var MiniRulesType $mnr
     * @access public
     */
    public $mnr = null;

    /**
     * @var mnrDetails $mnrDetails
     * @access public
     */
    public $mnrDetails = null;

}

class mnrDetails {

    /**
     * @var ItemNumberType_176648S $mnrRef
     * @access public
     */
    public $mnrRef = null;

    /**
     * @var DateAndTimeInformationType_182345S $dateInfo
     * @access public
     */
    public $dateInfo = null;

    /**
     * @var catGrp $catGrp
     * @access public
     */
    public $catGrp = null;

}

class catGrp {

    /**
     * @var CategDescrType $catInfo
     * @access public
     */
    public $catInfo = null;

    /**
     * @var MonetaryInformationType_174241S $monInfo
     * @access public
     */
    public $monInfo = null;

    /**
     * @var StatusType_182386S $statusInfo
     * @access public
     */
    public $statusInfo = null;

}

class ActionDetailsType {

    /**
     * @var ProcessingInformationType $numberOfItemsDetails
     * @access public
     */
    public $numberOfItemsDetails = null;

    /**
     * @var ReferenceType $lastItemsDetails
     * @access public
     */
    public $lastItemsDetails = null;

}

class AdditionalFareQualifierDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To35 $rateClass
     * @access public
     */
    public $rateClass = null;

    /**
     * @var AlphaNumericString_Length1To18 $ticketDesignator
     * @access public
     */
    public $ticketDesignator = null;

    /**
     * @var AlphaNumericString_Length1To35 $pricingGroup
     * @access public
     */
    public $pricingGroup = null;

    /**
     * @var AlphaNumericString_Length1To35 $secondRateClass
     * @access public
     */
    public $secondRateClass = null;

}

class ApplicationErrorInformationType {

    /**
     * @var ApplicationErrorDetailType $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class ApplicationErrorInformationType_78543S {

    /**
     * @var ApplicationErrorInformationType $applicationErrorDetail
     * @access public
     */
    public $applicationErrorDetail = null;

}

class AttributeInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To25 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class AttributeTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $attributeFunction
     * @access public
     */
    public $attributeFunction = null;

    /**
     * @var AttributeInformationTypeU_188164C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class AttributeType_78561S {

    /**
     * @var AttributeInformationType $feeParameter
     * @access public
     */
    public $feeParameter = null;

}

class BaggageDetailsType {

    /**
     * @var NumericInteger_Length1To15 $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     * @var NumericDecimal_Length1To18 $measurement
     * @access public
     */
    public $measurement = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class BagtagDetailsType {

    /**
     * @var AlphaNumericString_Length1To35 $identifier
     * @access public
     */
    public $identifier = null;

    /**
     * @var NumericInteger_Length1To15 $number
     * @access public
     */
    public $number = null;

}

class CabinProductDetailsType_195516C {

    /**
     * @var AlphaString_Length1To1 $rbd
     * @access public
     */
    public $rbd = null;

    /**
     * @var AlphaNumericString_Length0To1 $bookingModifier
     * @access public
     */
    public $bookingModifier = null;

    /**
     * @var AlphaNumericString_Length1To1 $cabin
     * @access public
     */
    public $cabin = null;

    /**
     * @var AlphaNumericString_Length0To3 $avlStatus
     * @access public
     */
    public $avlStatus = null;

}

class CabinProductDetailsType_205138C {

    /**
     * @var AlphaString_Length1To1 $rbd
     * @access public
     */
    public $rbd = null;

    /**
     * @var AMA_EDICodesetType_Length1 $bookingModifier
     * @access public
     */
    public $bookingModifier = null;

    /**
     * @var AlphaString_Length1To1 $cabin
     * @access public
     */
    public $cabin = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $avlStatus
     * @access public
     */
    public $avlStatus = null;

}

class CabinProductDetailsType_229142C {

    /**
     * @var AlphaString_Length1To1 $rbd
     * @access public
     */
    public $rbd = null;

    /**
     * @var AlphaString_Length1To1 $cabin
     * @access public
     */
    public $cabin = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $avlStatus
     * @access public
     */
    public $avlStatus = null;

}

class CategDescrType {

    /**
     * @var CategoryDescriptionType $descriptionInfo
     * @access public
     */
    public $descriptionInfo = null;

    /**
     * @var AlphaNumericString_Length1To3 $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class CategoryDescriptionType {

    /**
     * @var NumericInteger_Length1To3 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To16 $name
     * @access public
     */
    public $name = null;

}

class CodedAttributeInformationType_247827C {

    /**
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To10 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CompanyIdentificationTextType {

    /**
     * @var NumericInteger_Length0To4 $textRefNumber
     * @access public
     */
    public $textRefNumber = null;

    /**
     * @var AlphaNumericString_Length0To70 $companyText
     * @access public
     */
    public $companyText = null;

}

class CompanyRoleIdentificationType_120771C {

    /**
     * @var AlphaNumericString_Length1To3 $transportStageQualifier
     * @access public
     */
    public $transportStageQualifier = null;

    /**
     * @var AlphaNumericString_Length2To3 $company
     * @access public
     */
    public $company = null;

}

class ConversionRateDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length0To12 $amount
     * @access public
     */
    public $amount = null;

}

class ConversionRateDetailsTypeI_179848C {

    /**
     * @var AlphaNumericString_Length1To3 $conversionType
     * @access public
     */
    public $conversionType = null;

    /**
     * @var AlphaString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length0To18 $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var AlphaNumericString_Length0To18 $convertedAmountLink
     * @access public
     */
    public $convertedAmountLink = null;

    /**
     * @var AlphaNumericString_Length0To3 $taxQualifier
     * @access public
     */
    public $taxQualifier = null;

}

class ConversionRateTypeI {

    /**
     * @var ConversionRateDetailsTypeI_179848C $conversionRateDetail
     * @access public
     */
    public $conversionRateDetail = null;

}

class ConversionRateTypeI_78562S {

    /**
     * @var ConversionRateDetailsTypeI $conversionRateDetail
     * @access public
     */
    public $conversionRateDetail = null;

}

class DateAndTimeDetailsType_256192C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $date
     * @access public
     */
    public $date = null;

    /**
     * @var Time24_HHMM $time
     * @access public
     */
    public $time = null;

    /**
     * @var AlphaNumericString_Length1To25 $location
     * @access public
     */
    public $location = null;

}

class DateAndTimeInformationType_182345S {

    /**
     * @var DateAndTimeDetailsType_256192C $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

    /**
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class DiscountAndPenaltyInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $feeIdentification
     * @access public
     */
    public $feeIdentification = null;

    /**
     * @var DiscountPenaltyMonetaryInformationType $feeInformation
     * @access public
     */
    public $feeInformation = null;

}

class DiscountPenaltyInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $rateCategory
     * @access public
     */
    public $rateCategory = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var NumericDecimal_Length1To8 $percentage
     * @access public
     */
    public $percentage = null;

}

class DiscountPenaltyMonetaryInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $feeType
     * @access public
     */
    public $feeType = null;

    /**
     * @var AlphaNumericString_Length1To3 $feeAmountType
     * @access public
     */
    public $feeAmountType = null;

    /**
     * @var NumericDecimal_Length1To18 $feeAmount
     * @access public
     */
    public $feeAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $feeCurrency
     * @access public
     */
    public $feeCurrency = null;

}

class DummySegmentTypeI {
    
}

class ExcessBaggageType {

    /**
     * @var BaggageDetailsType $baggageDetails
     * @access public
     */
    public $baggageDetails = null;

    /**
     * @var BagtagDetailsType $bagTagDetails
     * @access public
     */
    public $bagTagDetails = null;

}

class FareCalculationCodeDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericDecimal_Length1To11 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $locationCode
     * @access public
     */
    public $locationCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $otherLocationCode
     * @access public
     */
    public $otherLocationCode = null;

    /**
     * @var NumericDecimal_Length1To8 $rate
     * @access public
     */
    public $rate = null;

}

class FareCategoryCodesTypeI {

    /**
     * @var AlphaNumericString_Length1To6 $fareType
     * @access public
     */
    public $fareType = null;

}

class FareDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericDecimal_Length1To8 $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var AlphaNumericString_Length1To3 $country
     * @access public
     */
    public $country = null;

    /**
     * @var AlphaNumericString_Length1To3 $fareCategory
     * @access public
     */
    public $fareCategory = null;

}

class FareDetailsType_193037C {

    /**
     * @var AMA_EDICodesetType_Length1to3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To8 $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var AlphaNumericString_Length1To3 $country
     * @access public
     */
    public $country = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $fareCategory
     * @access public
     */
    public $fareCategory = null;

}

class FareInformationType_80868S {

    /**
     * @var FareDetailsType $fareDetails
     * @access public
     */
    public $fareDetails = null;

}

class FareProductDetailsType_248552C {

    /**
     * @var AlphaNumericString_Length0To18 $fareBasis
     * @access public
     */
    public $fareBasis = null;

    /**
     * @var AlphaNumericString_Length1To6 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var AlphaNumericString_Length0To3 $fareType
     * @access public
     */
    public $fareType = null;

}

class FareQualifierDetailsType {

    /**
     * @var AdditionalFareQualifierDetailsType $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

}

class FlightProductInformationType_141442S {

    /**
     * @var CabinProductDetailsType_205138C $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     * @var ProductTypeDetailsType_205137C $contextDetails
     * @access public
     */
    public $contextDetails = null;

}

class FlightProductInformationType_161491S {

    /**
     * @var CabinProductDetailsType_229142C $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     * @var FareProductDetailsType $fareProductDetail
     * @access public
     */
    public $fareProductDetail = null;

}

class FlightProductInformationType_176659S {

    /**
     * @var CabinProductDetailsType $cabinProduct
     * @access public
     */
    public $cabinProduct = null;

    /**
     * @var FareProductDetailsType_248552C $fareProductDetail
     * @access public
     */
    public $fareProductDetail = null;

    /**
     * @var AlphaNumericString_Length1To20 $corporateId
     * @access public
     */
    public $corporateId = null;

    /**
     * @var AlphaString_Length1To1 $breakPoint
     * @access public
     */
    public $breakPoint = null;

    /**
     * @var ProductTypeDetailsType $contextDetails
     * @access public
     */
    public $contextDetails = null;

}

class FreeTextQualificationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $subjectQualifier
     * @access public
     */
    public $subjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

}

class FreeTextQualificationType {

    /**
     * @var AlphaNumericString_Length1To3 $subjectQualifier
     * @access public
     */
    public $subjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

}

class FreeTextQualificationType_120769C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

}

class InteractiveFreeTextType {

    /**
     * @var FreeTextQualificationTypeI_254609C $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class InteractiveFreeTextType_78534S {

    /**
     * @var FreeTextQualificationType $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var AlphaNumericString_Length1To70 $description
     * @access public
     */
    public $description = null;

}

class InteractiveFreeTextType_78544S {

    /**
     * @var FreeTextQualificationType_120769C $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var AlphaNumericString_Length1To70 $description
     * @access public
     */
    public $description = null;

}

class InteractiveFreeTextType_78559S {

    /**
     * @var FreeTextQualificationType_120769C $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var AlphaNumericString_Length1To500 $description
     * @access public
     */
    public $description = null;

}

class ItemNumberIdentificationType_191597C {

    /**
     * @var AlphaNumericString_Length1To6 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length0To3 $numberType
     * @access public
     */
    public $numberType = null;

}

class ItemNumberIdentificationType_192331C {

    /**
     * @var AlphaNumericString_Length1To6 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

}

class ItemNumberIdentificationType_234878C {

    /**
     * @var NumericInteger_Length1To6 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class ItemNumberIdentificationType_248537C {

    /**
     * @var AlphaNumericString_Length1To35 $number
     * @access public
     */
    public $number = null;

}

class ItemNumberType_161497S {

    /**
     * @var ItemNumberIdentificationType_191597C $itemNumberId
     * @access public
     */
    public $itemNumberId = null;

    /**
     * @var CompanyRoleIdentificationType_120771C $codeShareDetails
     * @access public
     */
    public $codeShareDetails = null;

    /**
     * @var PricingTicketingInformationType $priceTicketing
     * @access public
     */
    public $priceTicketing = null;

}

class ItemNumberType_166130S {

    /**
     * @var ItemNumberIdentificationType_234878C $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class ItemNumberType_176648S {

    /**
     * @var ItemNumberIdentificationType_248537C $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class ItemReferencesAndVersionsType_78536S {

    /**
     * @var AlphaNumericString_Length1To3 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var NumericInteger_Length1To3 $refNumber
     * @access public
     */
    public $refNumber = null;

}

class ItemReferencesAndVersionsType_78564S {

    /**
     * @var AlphaNumericString_Length1To3 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var NumericInteger_Length1To3 $feeRefNumber
     * @access public
     */
    public $feeRefNumber = null;

}

class MiniRulesDetailsType {

    /**
     * @var AlphaString_Length0To9 $interpretation
     * @access public
     */
    public $interpretation = null;

    /**
     * @var AlphaNumericString_Length0To5 $value
     * @access public
     */
    public $value = null;

}

class MiniRulesIndicatorType {

    /**
     * @var AlphaString_Length1To1 $ruleIndicator
     * @access public
     */
    public $ruleIndicator = null;

}

class MiniRulesType {

    /**
     * @var AlphaString_Length1To3 $category
     * @access public
     */
    public $category = null;

}

class MiniRulesType_78547S {

    /**
     * @var AlphaNumericString_Length0To6 $restrictionType
     * @access public
     */
    public $restrictionType = null;

    /**
     * @var AlphaString_Length0To3 $category
     * @access public
     */
    public $category = null;

    /**
     * @var MiniRulesIndicatorType $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var MiniRulesDetailsType $miniRules
     * @access public
     */
    public $miniRules = null;

}

class MonetaryInformationDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var AlphaNumericString_Length1To12 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class MonetaryInformationDetailsType_245528C {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var NumericDecimal_Length1To35 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To25 $location
     * @access public
     */
    public $location = null;

}

class MonetaryInformationType_134806S {

    /**
     * @var MonetaryInformationDetailsType $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class MonetaryInformationType_137835S {

    /**
     * @var MonetaryInformationDetailsType $monetaryDetail
     * @access public
     */
    public $monetaryDetail = null;

}

class MonetaryInformationType_174241S {

    /**
     * @var MonetaryInformationDetailsType_245528C $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var MonetaryInformationDetailsType_245528C $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class OriginAndDestinationRequestType_134833S {

    /**
     * @var NumericInteger_Length1To2 $segRef
     * @access public
     */
    public $segRef = null;

}

class PricingTicketingSubsequentType {

    /**
     * @var AlphaNumericString_Length1To3 $paxFareNum
     * @access public
     */
    public $paxFareNum = null;

}

class PricingTicketingSubsequentType_144401S {

    /**
     * @var AlphaNumericString_Length1To3 $paxFareNum
     * @access public
     */
    public $paxFareNum = null;

    /**
     * @var NumericDecimal_Length1To18 $totalFareAmount
     * @access public
     */
    public $totalFareAmount = null;

    /**
     * @var NumericDecimal_Length1To18 $totalTaxAmount
     * @access public
     */
    public $totalTaxAmount = null;

    /**
     * @var CompanyRoleIdentificationType_120771C $codeShareDetails
     * @access public
     */
    public $codeShareDetails = null;

    /**
     * @var MonetaryInformationDetailsType $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var PricingTicketingInformationType $pricingTicketing
     * @access public
     */
    public $pricingTicketing = null;

}

class ProcessingInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $actionQualifier
     * @access public
     */
    public $actionQualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     * @var AlphaNumericString_Length1To6 $refNum
     * @access public
     */
    public $refNum = null;

}

class ProductDetailsType {

    /**
     * @var AlphaString_Length1To1 $designator
     * @access public
     */
    public $designator = null;

    /**
     * @var AlphaNumericString_Length1To2 $option
     * @access public
     */
    public $option = null;

}

class ProductInformationType {

    /**
     * @var ProductDetailsType $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class ReferenceInfoType_133176S {

    /**
     * @var ReferencingDetailsType $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class ReferenceInfoType_134839S {

    /**
     * @var ReferencingDetailsType_195561C $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class ReferenceInfoType_134840S {

    /**
     * @var ReferencingDetailsType_195561C $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class ReferenceInfoType_165972S {

    /**
     * @var ReferencingDetailsType_234704C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInfoType_176658S {

    /**
     * @var ReferencingDetailsType $referencingDetail
     * @access public
     */
    public $referencingDetail = null;

}

class ReferenceType {

    /**
     * @var AlphaNumericString_Length1To6 $refOfLeg
     * @access public
     */
    public $refOfLeg = null;

    /**
     * @var NumericInteger_Length1To3 $firstItemIdentifier
     * @access public
     */
    public $firstItemIdentifier = null;

    /**
     * @var NumericInteger_Length1To3 $lastItemIdentifier
     * @access public
     */
    public $lastItemIdentifier = null;

}

class ReferencingDetailsType_191583C {

    /**
     * @var AlphaNumericString_Length1To3 $refQualifier
     * @access public
     */
    public $refQualifier = null;

    /**
     * @var NumericInteger_Length0To6 $refNumber
     * @access public
     */
    public $refNumber = null;

}

class ReferencingDetailsType_195561C {

    /**
     * @var AlphaNumericString_Length1To3 $refQualifier
     * @access public
     */
    public $refQualifier = null;

    /**
     * @var NumericInteger_Length0To3 $refNumber
     * @access public
     */
    public $refNumber = null;

}

class ReferencingDetailsType_234704C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To60 $value
     * @access public
     */
    public $value = null;

}

class SequenceDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $actionRequest
     * @access public
     */
    public $actionRequest = null;

    /**
     * @var SequenceInformationTypeU_24073C $sequenceDetails
     * @access public
     */
    public $sequenceDetails = null;

}

class SequenceInformationTypeU {

    /**
     * @var NumericInteger_Length1To10 $number
     * @access public
     */
    public $number = null;

}

class ServicesReferencesType {

    /**
     * @var AlphaNumericString_Length1To4 $reference
     * @access public
     */
    public $reference = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

}

class SpecificTravellerDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var AlphaString_Length1To60 $travellerSurname
     * @access public
     */
    public $travellerSurname = null;

    /**
     * @var AlphaString_Length1To60 $travellerGivenName
     * @access public
     */
    public $travellerGivenName = null;

    /**
     * @var AlphaNumericString_Length1To10 $travellerReferenceNumber
     * @access public
     */
    public $travellerReferenceNumber = null;

    /**
     * @var AlphaNumericString_Length1To8 $passengerBirthdate
     * @access public
     */
    public $passengerBirthdate = null;

}

class SpecificTravellerType {

    /**
     * @var SpecificTravellerDetailsType $travellerDetails
     * @access public
     */
    public $travellerDetails = null;

}

class StatusDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $action
     * @access public
     */
    public $action = null;

}

class StatusDetailsType_256255C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $action
     * @access public
     */
    public $action = null;

}

class StatusType {

    /**
     * @var StatusDetailsType $statusInformation
     * @access public
     */
    public $statusInformation = null;

}

class StatusType_182386S {

    /**
     * @var StatusDetailsType_256255C $statusInformation
     * @access public
     */
    public $statusInformation = null;

}

class TaxDetailsType {

    /**
     * @var AlphaNumericString_Length1To12 $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class TransportIdentifierType {

    /**
     * @var CompanyIdentificationTypeI_46351C $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

}

class Air_SellFromRecommendation {

    /**
     * @var messageActionDetails $messageActionDetails
     * @access public
     */
    public $messageActionDetails = null;

    /**
     * @var recordLocator $recordLocator
     * @access public
     */
    public $recordLocator = null;

    /**
     * @var itineraryDetails $itineraryDetails
     * @access public
     */
    public $itineraryDetails = null;

}

class messageActionDetails {

    /**
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

}

class recordLocator {

    /**
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class reservation {

    /**
     * @var companyId $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var controlNumber $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class itineraryDetails {

    /**
     * @var originDestination $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     * @var errorItinerarylevel $errorItinerarylevel
     * @access public
     */
    public $errorItinerarylevel = null;

    /**
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

}

class originDestinationDetails {

    /**
     * @var OriginAndDestinationDetailsTypeI $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     * @var itineraryInfo $itineraryInfo
     * @access public
     */
    public $itineraryInfo = null;

}

class message {

    /**
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

    /**
     * @var responseType $responseType
     * @access public
     */
    public $responseType = null;

}

class segmentInformation {

    /**
     * @var connexInformation $connexInformation
     * @access public
     */
    public $connexInformation = null;

    /**
     * @var segDetails $segDetails
     * @access public
     */
    public $segDetails = null;

    /**
     * @var fareQualifier $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     * @var validityInformation $validityInformation
     * @access public
     */
    public $validityInformation = null;

    /**
     * @var bagAllowanceInformation $bagAllowanceInformation
     * @access public
     */
    public $bagAllowanceInformation = null;

    /**
     * @var segmentReference $segmentReference
     * @access public
     */
    public $segmentReference = null;

    /**
     * @var sequenceInformation $sequenceInformation
     * @access public
     */
    public $sequenceInformation = null;

}

class travelProductInformation {

    /**
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class relatedproductInformation {

    /**
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class Air_SellFromRecommendationReply {

    /**
     * @var message $message
     * @access public
     */
    public $message = null;

    /**
     * @var errorAtMessageLevel $errorAtMessageLevel
     * @access public
     */
    public $errorAtMessageLevel = null;

    /**
     * @var itineraryDetails $itineraryDetails
     * @access public
     */
    public $itineraryDetails = null;

}

class errorAtMessageLevel {

    /**
     * @var errorSegment $errorSegment
     * @access public
     */
    public $errorSegment = null;

    /**
     * @var informationText $informationText
     * @access public
     */
    public $informationText = null;

}

class errorSegment {

    /**
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class informationText {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class errorItinerarylevel {

    /**
     * @var errorSegment $errorSegment
     * @access public
     */
    public $errorSegment = null;

    /**
     * @var informationText $informationText
     * @access public
     */
    public $informationText = null;

}

class apdSegment {

    /**
     * @var legDetails $legDetails
     * @access public
     */
    public $legDetails = null;

    /**
     * @var departureStationInfo $departureStationInfo
     * @access public
     */
    public $departureStationInfo = null;

    /**
     * @var arrivalStationInfo $arrivalStationInfo
     * @access public
     */
    public $arrivalStationInfo = null;

    /**
     * @var facilitiesInformation $facilitiesInformation
     * @access public
     */
    public $facilitiesInformation = null;

}

class legDetails {

    /**
     * @var equipment $equipment
     * @access public
     */
    public $equipment = null;

    /**
     * @var numberOfStops $numberOfStops
     * @access public
     */
    public $numberOfStops = null;

    /**
     * @var duration $duration
     * @access public
     */
    public $duration = null;

    /**
     * @var percentage $percentage
     * @access public
     */
    public $percentage = null;

    /**
     * @var daysOfOperation $daysOfOperation
     * @access public
     */
    public $daysOfOperation = null;

    /**
     * @var dateTimePeriod $dateTimePeriod
     * @access public
     */
    public $dateTimePeriod = null;

    /**
     * @var complexingFlightIndicator $complexingFlightIndicator
     * @access public
     */
    public $complexingFlightIndicator = null;

    /**
     * @var locations $locations
     * @access public
     */
    public $locations = null;

}

class departureStationInfo {

    /**
     * @var gateDescription $gateDescription
     * @access public
     */
    public $gateDescription = null;

    /**
     * @var terminal $terminal
     * @access public
     */
    public $terminal = null;

    /**
     * @var concourse $concourse
     * @access public
     */
    public $concourse = null;

}

class arrivalStationInfo {

    /**
     * @var gateDescription $gateDescription
     * @access public
     */
    public $gateDescription = null;

    /**
     * @var terminal $terminal
     * @access public
     */
    public $terminal = null;

    /**
     * @var concourse $concourse
     * @access public
     */
    public $concourse = null;

}

class facilitiesInformation {

    /**
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     * @var description $description
     * @access public
     */
    public $description = null;

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var extensionCode $extensionCode
     * @access public
     */
    public $extensionCode = null;

}

class actionDetails {

    /**
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class errorAtSegmentLevel {

    /**
     * @var errorSegment $errorSegment
     * @access public
     */
    public $errorSegment = null;

    /**
     * @var informationText $informationText
     * @access public
     */
    public $informationText = null;

}

class PNR_Reply {

    /**
     * @var pnrHeader $pnrHeader
     * @access public
     */
    public $pnrHeader = null;

    /**
     * @var ReservationSecurityInformationType_156156S $securityInformation
     * @access public
     */
    public $securityInformation = null;

    /**
     * @var QueueType $queueInformations
     * @access public
     */
    public $queueInformations = null;

    /**
     * @var NumberOfUnitsTypeI $numberOfUnits
     * @access public
     */
    public $numberOfUnits = null;

    /**
     * @var generalErrorInfo $generalErrorInfo
     * @access public
     */
    public $generalErrorInfo = null;

    /**
     * @var CodedAttributeType $pnrType
     * @access public
     */
    public $pnrType = null;

    /**
     * @var LongFreeTextType $freetextData
     * @access public
     */
    public $freetextData = null;

    /**
     * @var StatusType_178422S $pnrHeaderTag
     * @access public
     */
    public $pnrHeaderTag = null;

    /**
     * @var InteractiveFreeTextTypeI_132924S $freeFormText
     * @access public
     */
    public $freeFormText = null;

    /**
     * @var PnrHistoryDataType $historyData
     * @access public
     */
    public $historyData = null;

    /**
     * @var POSGroupType $sbrPOSDetails
     * @access public
     */
    public $sbrPOSDetails = null;

    /**
     * @var POSGroupType $sbrCreationPosDetails
     * @access public
     */
    public $sbrCreationPosDetails = null;

    /**
     * @var POSGroupType $sbrUpdatorPosDetails
     * @access public
     */
    public $sbrUpdatorPosDetails = null;

    /**
     * @var technicalData $technicalData
     * @access public
     */
    public $technicalData = null;

    /**
     * @var travellerInfo $travellerInfo
     * @access public
     */
    public $travellerInfo = null;

    /**
     * @var originDestinationDetails $originDestinationDetails
     * @access public
     */
    public $originDestinationDetails = null;

    /**
     * @var SegmentGroupingInformationType $segmentGroupingInfo
     * @access public
     */
    public $segmentGroupingInfo = null;

    /**
     * @var dataElementsMaster $dataElementsMaster
     * @access public
     */
    public $dataElementsMaster = null;

    /**
     * @var tstData $tstData
     * @access public
     */
    public $tstData = null;

    /**
     * @var pricingRecordGroup $pricingRecordGroup
     * @access public
     */
    public $pricingRecordGroup = null;

    /**
     * @var dcsData $dcsData
     * @access public
     */
    public $dcsData = null;

    /**
     * @var offerGroup $offerGroup
     * @access public
     */
    public $offerGroup = null;

}

class pnrHeader {

    /**
     * @var ReservationControlInformationType_131820S $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     * @var ReferenceInfoType $referenceForRecordLocator
     * @access public
     */
    public $referenceForRecordLocator = null;

}

class generalErrorInfo {

    /**
     * @var ApplicationErrorInformationType $messageErrorInformation
     * @access public
     */
    public $messageErrorInformation = null;

    /**
     * @var InteractiveFreeTextTypeI_132924S $messageErrorText
     * @access public
     */
    public $messageErrorText = null;

}

class technicalData {

    /**
     * @var SequenceDetailsTypeU $enveloppeNumberData
     * @access public
     */
    public $enveloppeNumberData = null;

    /**
     * @var PnrHistoryDataType_27157S $lastTransmittedEnvelopeNumber
     * @access public
     */
    public $lastTransmittedEnvelopeNumber = null;

    /**
     * @var StructuredDateTimeInformationType_27086S $purgeDateData
     * @access public
     */
    public $purgeDateData = null;

    /**
     * @var StatusTypeI_32775S $generalPNRInformation
     * @access public
     */
    public $generalPNRInformation = null;

}

class travellerInfo {

    /**
     * @var ElementManagementSegmentType $elementManagementPassenger
     * @access public
     */
    public $elementManagementPassenger = null;

    /**
     * @var passengerData $passengerData
     * @access public
     */
    public $passengerData = null;

    /**
     * @var enhancedPassengerData $enhancedPassengerData
     * @access public
     */
    public $enhancedPassengerData = null;

}

class passengerData {

    /**
     * @var TravellerInformationTypeI $travellerInformation
     * @access public
     */
    public $travellerInformation = null;

    /**
     * @var DateAndTimeInformationType $dateOfBirth
     * @access public
     */
    public $dateOfBirth = null;

}

class enhancedPassengerData {

    /**
     * @var EnhancedTravellerInformationType $enhancedTravellerInformation
     * @access public
     */
    public $enhancedTravellerInformation = null;

    /**
     * @var DateAndTimeInformationType $dateOfBirthInEnhancedPaxData
     * @access public
     */
    public $dateOfBirthInEnhancedPaxData = null;

}

class nameError {

    /**
     * @var ApplicationErrorInformationType $nameErrorInformation
     * @access public
     */
    public $nameErrorInformation = null;

    /**
     * @var InteractiveFreeTextTypeI_132924S $nameErrorFreeText
     * @access public
     */
    public $nameErrorFreeText = null;

}

class itineraryInfo {

    /**
     * @var ElementManagementSegmentType $elementManagementItinerary
     * @access public
     */
    public $elementManagementItinerary = null;

    /**
     * @var airAuxItinerary $airAuxItinerary
     * @access public
     */
    public $airAuxItinerary = null;

    /**
     * @var ReferenceInfoType $referenceForSegment
     * @access public
     */
    public $referenceForSegment = null;

}

class yieldGroup {

    /**
     * @var ODKeyPerformanceDataType $yieldData
     * @access public
     */
    public $yieldData = null;

    /**
     * @var ONDType $yieldDataGroup
     * @access public
     */
    public $yieldDataGroup = null;

}

class legInfo {

    /**
     * @var FlightSegmentDetailsTypeI $markerLegInfo
     * @access public
     */
    public $markerLegInfo = null;

    /**
     * @var TravelProductInformationTypeI_99362S $legTravelProduct
     * @access public
     */
    public $legTravelProduct = null;

    /**
     * @var InteractiveFreeTextTypeI_99363S $interactiveFreeText
     * @access public
     */
    public $interactiveFreeText = null;

}

class lccTypicalData {

    /**
     * @var TariffInformationTypeI_28460S $lccFareData
     * @access public
     */
    public $lccFareData = null;

    /**
     * @var ItemReferencesAndVersionsType_6550S $lccConnectionData
     * @access public
     */
    public $lccConnectionData = null;

}

class insuranceInformation {

    /**
     * @var InsuranceNameType $insuranceName
     * @access public
     */
    public $insuranceName = null;

    /**
     * @var MonetaryInformationTypeI_133001S $insuranceMonetaryInformation
     * @access public
     */
    public $insuranceMonetaryInformation = null;

    /**
     * @var TravellerInsuranceInformationType $insurancePremiumInfo
     * @access public
     */
    public $insurancePremiumInfo = null;

    /**
     * @var TravellerDocumentInformationTypeU $insuranceDocInfo
     * @access public
     */
    public $insuranceDocInfo = null;

}

class hotelReservationInfo {

    /**
     * @var HotelPropertyType $hotelPropertyInfo
     * @access public
     */
    public $hotelPropertyInfo = null;

    /**
     * @var ProductIdentificationType $pricingIndicator
     * @access public
     */
    public $pricingIndicator = null;

    /**
     * @var CompanyInformationType $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var HotelProductInformationType $amenities
     * @access public
     */
    public $amenities = null;

    /**
     * @var StructuredPeriodInformationType_133006S $requestedDates
     * @access public
     */
    public $requestedDates = null;

    /**
     * @var roomRateDetails $roomRateDetails
     * @access public
     */
    public $roomRateDetails = null;

    /**
     * @var ReservationControlInformationTypeI_132929S $cancelOrConfirmNbr
     * @access public
     */
    public $cancelOrConfirmNbr = null;

    /**
     * @var UserIdentificationType_133009S $bookingSource
     * @access public
     */
    public $bookingSource = null;

    /**
     * @var BillableInformationTypeU $billableInfo
     * @access public
     */
    public $billableInfo = null;

    /**
     * @var ConsumerReferenceInformationTypeI $customerInfo
     * @access public
     */
    public $customerInfo = null;

    /**
     * @var FrequentTravellerIdentificationCodeType_132997S $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     * @var guaranteeOrDeposit $guaranteeOrDeposit
     * @access public
     */
    public $guaranteeOrDeposit = null;

    /**
     * @var FreeTextInformationType_133008S $specialOptions
     * @access public
     */
    public $specialOptions = null;

    /**
     * @var MiscellaneousRemarksType_133000S $textOptions
     * @access public
     */
    public $textOptions = null;

    /**
     * @var AwardsType $hotelRating
     * @access public
     */
    public $hotelRating = null;

    /**
     * @var CommissionInformationType_132992S $commissionInfo
     * @access public
     */
    public $commissionInfo = null;

    /**
     * @var MonetaryInformationTypeI_133001S $savingAmountInfo
     * @access public
     */
    public $savingAmountInfo = null;

    /**
     * @var ContactInformationTypeU $writtenConfirmationContact
     * @access public
     */
    public $writtenConfirmationContact = null;

    /**
     * @var NameAndAddressBatchTypeU $writtenConfirmationInfo
     * @access public
     */
    public $writtenConfirmationInfo = null;

    /**
     * @var arrivalFlightDetails $arrivalFlightDetails
     * @access public
     */
    public $arrivalFlightDetails = null;

    /**
     * @var StatusType_133007S $bookingIndicators
     * @access public
     */
    public $bookingIndicators = null;

}

class roomRateDetails {

    /**
     * @var HotelRoomType_129168S $roomInformation
     * @access public
     */
    public $roomInformation = null;

    /**
     * @var TariffInformationTypeI_129170S $tariffDetails
     * @access public
     */
    public $tariffDetails = null;

    /**
     * @var RuleInformationTypeU $rateCodeIndicator
     * @access public
     */
    public $rateCodeIndicator = null;

}

class guaranteeOrDeposit {

    /**
     * @var PaymentInformationTypeI $paymentInfo
     * @access public
     */
    public $paymentInfo = null;

    /**
     * @var FormOfPaymentTypeI_133015S $creditCardInfo
     * @access public
     */
    public $creditCardInfo = null;

}

class arrivalFlightDetails {

    /**
     * @var TravelProductInformationTypeI_133014S $travelProductInformation
     * @access public
     */
    public $travelProductInformation = null;

    /**
     * @var AdditionalTransportDetailsTypeU $additionalTransportDetails
     * @access public
     */
    public $additionalTransportDetails = null;

}

class typicalCarData {

    /**
     * @var VehicleInformationType_132935S $vehicleInformation
     * @access public
     */
    public $vehicleInformation = null;

    /**
     * @var FreeTextInformationType_132934S $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

    /**
     * @var ReferenceInformationTypeI_132930S $voucherPrintAck
     * @access public
     */
    public $voucherPrintAck = null;

    /**
     * @var CompanyInformationType $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132925S $locationInfo
     * @access public
     */
    public $locationInfo = null;

    /**
     * @var deliveryAndCollection $deliveryAndCollection
     * @access public
     */
    public $deliveryAndCollection = null;

    /**
     * @var StructuredPeriodInformationType_132931S $pickupDropoffTimes
     * @access public
     */
    public $pickupDropoffTimes = null;

    /**
     * @var ReservationControlInformationTypeI_132929S $cancelOrConfirmNbr
     * @access public
     */
    public $cancelOrConfirmNbr = null;

    /**
     * @var rateCodeGroup $rateCodeGroup
     * @access public
     */
    public $rateCodeGroup = null;

    /**
     * @var FrequentTravellerIdentificationCodeType $fFlyerNbr
     * @access public
     */
    public $fFlyerNbr = null;

    /**
     * @var ConsumerReferenceInformationTypeI $customerInfo
     * @access public
     */
    public $customerInfo = null;

    /**
     * @var TariffInformationTypeI_132932S $rateInfo
     * @access public
     */
    public $rateInfo = null;

    /**
     * @var errorWarning $errorWarning
     * @access public
     */
    public $errorWarning = null;

    /**
     * @var rulesPoliciesGroup $rulesPoliciesGroup
     * @access public
     */
    public $rulesPoliciesGroup = null;

    /**
     * @var FormOfPaymentTypeI $payment
     * @access public
     */
    public $payment = null;

    /**
     * @var BillableInformationTypeU $billingData
     * @access public
     */
    public $billingData = null;

    /**
     * @var AdditionalBusinessSourceInformationType $bookingSource
     * @access public
     */
    public $bookingSource = null;

    /**
     * @var TourInformationTypeI $inclusiveTour
     * @access public
     */
    public $inclusiveTour = null;

    /**
     * @var InteractiveFreeTextTypeI_132924S $marketingInfo
     * @access public
     */
    public $marketingInfo = null;

    /**
     * @var MiscellaneousRemarksType_132926S $supleInfo
     * @access public
     */
    public $supleInfo = null;

    /**
     * @var QuantityTypeI $estimatedDistance
     * @access public
     */
    public $estimatedDistance = null;

    /**
     * @var NameTypeU_132927S $agentInformation
     * @access public
     */
    public $agentInformation = null;

    /**
     * @var AgreementIdentificationTypeU $trackingOpt
     * @access public
     */
    public $trackingOpt = null;

    /**
     * @var TicketNumberTypeI $electronicVoucherNumber
     * @access public
     */
    public $electronicVoucherNumber = null;

    /**
     * @var CommunicationContactTypeU $customerEmail
     * @access public
     */
    public $customerEmail = null;

    /**
     * @var AttributeType_132917S $attribute
     * @access public
     */
    public $attribute = null;

}

class deliveryAndCollection {

    /**
     * @var AddressTypeU_132936S $addressDeliveryCollection
     * @access public
     */
    public $addressDeliveryCollection = null;

    /**
     * @var PhoneAndEmailAddressType_132937S $phoneNumber
     * @access public
     */
    public $phoneNumber = null;

}

class rateCodeGroup {

    /**
     * @var FareQualifierDetailsType $rateCodeInfo
     * @access public
     */
    public $rateCodeInfo = null;

    /**
     * @var FreeTextInformationType_128791S $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

}

class errorWarning {

    /**
     * @var ApplicationErrorInformationType_132938S $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     * @var FreeTextInformationType_132934S $errorFreeText
     * @access public
     */
    public $errorFreeText = null;

}

class rulesPoliciesGroup {

    /**
     * @var DummySegmentTypeI $dummy1
     * @access public
     */
    public $dummy1 = null;

    /**
     * @var SelectionDetailsTypeI_132941S $sourceLevel
     * @access public
     */
    public $sourceLevel = null;

    /**
     * @var FreeTextInformationType_132934S $remarks
     * @access public
     */
    public $remarks = null;

    /**
     * @var taxCovSurchargeGroup $taxCovSurchargeGroup
     * @access public
     */
    public $taxCovSurchargeGroup = null;

    /**
     * @var otherRulesGroup $otherRulesGroup
     * @access public
     */
    public $otherRulesGroup = null;

    /**
     * @var pickupDropoffLocation $pickupDropoffLocation
     * @access public
     */
    public $pickupDropoffLocation = null;

    /**
     * @var specialEquipmentDetails $specialEquipmentDetails
     * @access public
     */
    public $specialEquipmentDetails = null;

}

class taxCovSurchargeGroup {

    /**
     * @var TariffInformationTypeI_132942S $taxSurchargeCoverageInfo
     * @access public
     */
    public $taxSurchargeCoverageInfo = null;

    /**
     * @var FreeTextInformationType_132934S $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

    /**
     * @var surchargePeriods $surchargePeriods
     * @access public
     */
    public $surchargePeriods = null;

}

class surchargePeriods {

    /**
     * @var RangeDetailsTypeI $period
     * @access public
     */
    public $period = null;

    /**
     * @var TariffInformationTypeI_132945S $surchargePeriodTariff
     * @access public
     */
    public $surchargePeriodTariff = null;

    /**
     * @var MeasurementsBatchTypeU $maximumUnitQualifier
     * @access public
     */
    public $maximumUnitQualifier = null;

}

class otherRulesGroup {

    /**
     * @var RuleInformationTypeU_132946S $otherRules
     * @access public
     */
    public $otherRules = null;

    /**
     * @var StructuredPeriodInformationType_132931S $dateTimeInfo
     * @access public
     */
    public $dateTimeInfo = null;

}

class pickupDropoffLocation {

    /**
     * @var PlaceLocationIdentificationTypeU_132948S $locationInfo
     * @access public
     */
    public $locationInfo = null;

    /**
     * @var AddressTypeU_132947S $address
     * @access public
     */
    public $address = null;

    /**
     * @var StructuredPeriodInformationType_132950S $openingHours
     * @access public
     */
    public $openingHours = null;

    /**
     * @var PhoneAndEmailAddressType_132949S $phone
     * @access public
     */
    public $phone = null;

}

class specialEquipmentDetails {

    /**
     * @var DummySegmentTypeI $dummy2
     * @access public
     */
    public $dummy2 = null;

    /**
     * @var rangePeriod $rangePeriod
     * @access public
     */
    public $rangePeriod = null;

    /**
     * @var FreeTextInformationType_132951S $additionalInfo
     * @access public
     */
    public $additionalInfo = null;

    /**
     * @var TariffInformationTypeI_132942S $specialEquipmentTariff
     * @access public
     */
    public $specialEquipmentTariff = null;

}

class rangePeriod {

    /**
     * @var RangeDetailsTypeI $agePeriod
     * @access public
     */
    public $agePeriod = null;

    /**
     * @var MeasurementsBatchTypeU $maximumUnitQualifier
     * @access public
     */
    public $maximumUnitQualifier = null;

}

class extendedContentGroup {

    /**
     * @var ExtendedContentType $easyContentIdentification
     * @access public
     */
    public $easyContentIdentification = null;

    /**
     * @var CompanyInformationType_130639S $providerDetails
     * @access public
     */
    public $providerDetails = null;

    /**
     * @var StructuredDateTimeInformationType_128728S $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     * @var ReferenceInformationType_129701S $paxRef
     * @access public
     */
    public $paxRef = null;

    /**
     * @var ReferenceInfoType_129703S $associationReference
     * @access public
     */
    public $associationReference = null;

    /**
     * @var FreeTextInformationType_128778S $productDescription
     * @access public
     */
    public $productDescription = null;

    /**
     * @var RelatedProductInformationType $quantityStatus
     * @access public
     */
    public $quantityStatus = null;

    /**
     * @var ReservationControlInformationType $confirmOrCancelNbr
     * @access public
     */
    public $confirmOrCancelNbr = null;

    /**
     * @var SelectionDetailsType $bookingChannel
     * @access public
     */
    public $bookingChannel = null;

    /**
     * @var airInfos $airInfos
     * @access public
     */
    public $airInfos = null;

    /**
     * @var railInfos $railInfos
     * @access public
     */
    public $railInfos = null;

    /**
     * @var eventInfos $eventInfos
     * @access public
     */
    public $eventInfos = null;

    /**
     * @var hotelInfos $hotelInfos
     * @access public
     */
    public $hotelInfos = null;

    /**
     * @var taxiInfos $taxiInfos
     * @access public
     */
    public $taxiInfos = null;

    /**
     * @var insuranceInfos $insuranceInfos
     * @access public
     */
    public $insuranceInfos = null;

    /**
     * @var ExtendedContentFerryLegDescriptionType $ferryInfos
     * @access public
     */
    public $ferryInfos = null;

    /**
     * @var DummySegmentTypeI $marker
     * @access public
     */
    public $marker = null;

    /**
     * @var carInfos $carInfos
     * @access public
     */
    public $carInfos = null;

    /**
     * @var CruiseExtendedContentType $cruiseInfos
     * @access public
     */
    public $cruiseInfos = null;

    /**
     * @var docsGoodiesMisInfos $docsGoodiesMisInfos
     * @access public
     */
    public $docsGoodiesMisInfos = null;

}

class airInfos {

    /**
     * @var TravelProductInformationType $segmentDetails
     * @access public
     */
    public $segmentDetails = null;

    /**
     * @var AdditionalProductDetailsType $additionalProductDetails
     * @access public
     */
    public $additionalProductDetails = null;

    /**
     * @var TravellerBaggageDetailsType $baggage
     * @access public
     */
    public $baggage = null;

    /**
     * @var TicketNumberType $ticketingNumber
     * @access public
     */
    public $ticketingNumber = null;

    /**
     * @var StructuredDateTimeInformationType_128728S $issuanceDate
     * @access public
     */
    public $issuanceDate = null;

}

class railInfos {

    /**
     * @var TravelItineraryInformationTypeI_129342S $journeyDuration
     * @access public
     */
    public $journeyDuration = null;

    /**
     * @var CodedAttributeType_129339S $keyValueTree
     * @access public
     */
    public $keyValueTree = null;

    /**
     * @var StatusType $updatePermission
     * @access public
     */
    public $updatePermission = null;

    /**
     * @var TrainDataType $tripDetails
     * @access public
     */
    public $tripDetails = null;

    /**
     * @var ItemReferencesAndVersionsType_129358S $providerTattoo
     * @access public
     */
    public $providerTattoo = null;

    /**
     * @var ClassConfigurationDetailsType $classInfo
     * @access public
     */
    public $classInfo = null;

    /**
     * @var StatusTypeS $openSegment
     * @access public
     */
    public $openSegment = null;

    /**
     * @var QuantityAndActionTypeU $reservableStatus
     * @access public
     */
    public $reservableStatus = null;

}

class eventInfos {

    /**
     * @var AddressType_129098S $eventAddress
     * @access public
     */
    public $eventAddress = null;

    /**
     * @var TicketNumberType $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

    /**
     * @var FreeTextInformationType_128778S $eventName
     * @access public
     */
    public $eventName = null;

    /**
     * @var StructuredDateTimeInformationType_128779S $eventDate
     * @access public
     */
    public $eventDate = null;

    /**
     * @var SeatSelectionDetailsTypeI $seatDetails
     * @access public
     */
    public $seatDetails = null;

}

class hotelInfos {

    /**
     * @var HotelPropertyType_129118S $hotelPropertyInfo
     * @access public
     */
    public $hotelPropertyInfo = null;

    /**
     * @var ProductIdentificationType $pricingIndicator
     * @access public
     */
    public $pricingIndicator = null;

    /**
     * @var CompanyInformationType $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var HotelProductInformationType $amenities
     * @access public
     */
    public $amenities = null;

    /**
     * @var StructuredPeriodInformationType_133006S $requestedDates
     * @access public
     */
    public $requestedDates = null;

    /**
     * @var roomRateDetails $roomRateDetails
     * @access public
     */
    public $roomRateDetails = null;

    /**
     * @var ReservationControlInformationTypeI_132929S $cancelOrConfirmNbr
     * @access public
     */
    public $cancelOrConfirmNbr = null;

    /**
     * @var UserIdentificationType_133009S $bookingSource
     * @access public
     */
    public $bookingSource = null;

    /**
     * @var BillableInformationTypeU $billableInfo
     * @access public
     */
    public $billableInfo = null;

    /**
     * @var ConsumerReferenceInformationTypeI $customerInfo
     * @access public
     */
    public $customerInfo = null;

    /**
     * @var FrequentTravellerIdentificationCodeType_132997S $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     * @var guaranteeOrDeposit $guaranteeOrDeposit
     * @access public
     */
    public $guaranteeOrDeposit = null;

    /**
     * @var FreeTextInformationType_133008S $specialOptions
     * @access public
     */
    public $specialOptions = null;

    /**
     * @var MiscellaneousRemarksType_133000S $textOptions
     * @access public
     */
    public $textOptions = null;

    /**
     * @var AwardsType $hotelRating
     * @access public
     */
    public $hotelRating = null;

    /**
     * @var CommissionInformationType_132992S $commissionInfo
     * @access public
     */
    public $commissionInfo = null;

    /**
     * @var MonetaryInformationTypeI_133001S $savingAmountInfo
     * @access public
     */
    public $savingAmountInfo = null;

    /**
     * @var ContactInformationTypeU $writtenConfirmationContact
     * @access public
     */
    public $writtenConfirmationContact = null;

    /**
     * @var AddressType_129172S $hotelAddress
     * @access public
     */
    public $hotelAddress = null;

    /**
     * @var NameAndAddressBatchTypeU $writtenConfirmationInfo
     * @access public
     */
    public $writtenConfirmationInfo = null;

    /**
     * @var arrivalFlightDetails $arrivalFlightDetails
     * @access public
     */
    public $arrivalFlightDetails = null;

    /**
     * @var StatusType_133007S $bookingIndicators
     * @access public
     */
    public $bookingIndicators = null;

}

class taxiInfos {

    /**
     * @var StructuredPeriodInformationType_128780S $pickUpDropOffDateTime
     * @access public
     */
    public $pickUpDropOffDateTime = null;

    /**
     * @var AdditionalProductDetailsType $additionalProductDetails
     * @access public
     */
    public $additionalProductDetails = null;

    /**
     * @var AddressType_129098S $eventAddress
     * @access public
     */
    public $eventAddress = null;

    /**
     * @var TravellerBaggageDetailsType $baggage
     * @access public
     */
    public $baggage = null;

}

class insuranceInfos {

    /**
     * @var InsuranceProductDetailsType_129160S $insuranceProductDetailsType
     * @access public
     */
    public $insuranceProductDetailsType = null;

    /**
     * @var PhoneAndEmailAddressType $providerPhoneContact
     * @access public
     */
    public $providerPhoneContact = null;

    /**
     * @var FreeTextInformationType_128665S $infoLines
     * @access public
     */
    public $infoLines = null;

    /**
     * @var TravellerInformationTypeI $substiteName
     * @access public
     */
    public $substiteName = null;

    /**
     * @var MonetaryInformationTypeI $extraPremium
     * @access public
     */
    public $extraPremium = null;

    /**
     * @var productSection $productSection
     * @access public
     */
    public $productSection = null;

    /**
     * @var TariffInformationTypeI_133025S $planCostInfo
     * @access public
     */
    public $planCostInfo = null;

    /**
     * @var planTypeDetails $planTypeDetails
     * @access public
     */
    public $planTypeDetails = null;

    /**
     * @var contactDetails $contactDetails
     * @access public
     */
    public $contactDetails = null;

    /**
     * @var subscriberAddressSection $subscriberAddressSection
     * @access public
     */
    public $subscriberAddressSection = null;

    /**
     * @var coverageDetails $coverageDetails
     * @access public
     */
    public $coverageDetails = null;

    /**
     * @var CommissionInformationType $comissionAmount
     * @access public
     */
    public $comissionAmount = null;

    /**
     * @var ActionDetailsTypeI $productKnowledge
     * @access public
     */
    public $productKnowledge = null;

    /**
     * @var passengerDetails $passengerDetails
     * @access public
     */
    public $passengerDetails = null;

    /**
     * @var DocumentInformationDetailsTypeI $printInformation
     * @access public
     */
    public $printInformation = null;

    /**
     * @var LongFreeTextType_128687S $longFreeTextType
     * @access public
     */
    public $longFreeTextType = null;

}

class productSection {

    /**
     * @var InsuranceProductDetailsType $productCode
     * @access public
     */
    public $productCode = null;

    /**
     * @var FreeTextInformationType_128667S $informationLines
     * @access public
     */
    public $informationLines = null;

}

class planTypeDetails {

    /**
     * @var InsuranceProviderAndProductsType $planType
     * @access public
     */
    public $planType = null;

    /**
     * @var MonetaryInformationTypeI $travelValue
     * @access public
     */
    public $travelValue = null;

}

class contactDetails {

    /**
     * @var MiscellaneousRemarksType_12240S $miscelaneous
     * @access public
     */
    public $miscelaneous = null;

    /**
     * @var PhoneAndEmailAddressType_133032S $phoneNumber
     * @access public
     */
    public $phoneNumber = null;

    /**
     * @var TravellerInformationTypeI $contactName
     * @access public
     */
    public $contactName = null;

}

class subscriberAddressSection {

    /**
     * @var NameTypeU $nameDetails
     * @access public
     */
    public $nameDetails = null;

    /**
     * @var AddressTypeU $addressInfo
     * @access public
     */
    public $addressInfo = null;

    /**
     * @var PhoneAndEmailAddressType_133032S $phoneNumber
     * @access public
     */
    public $phoneNumber = null;

}

class coverageDetails {

    /**
     * @var InsurancePolicyType $policyDetails
     * @access public
     */
    public $policyDetails = null;

    /**
     * @var coverageInfo $coverageInfo
     * @access public
     */
    public $coverageInfo = null;

    /**
     * @var TravellerInformationTypeI_128676S $coveredPassenger
     * @access public
     */
    public $coveredPassenger = null;

    /**
     * @var StructuredPeriodInformationType $coverageDates
     * @access public
     */
    public $coverageDates = null;

    /**
     * @var StructuredDateTimeInformationType $subscriptionDetails
     * @access public
     */
    public $subscriptionDetails = null;

    /**
     * @var UserIdentificationType_128677S $agentReferenceDetails
     * @access public
     */
    public $agentReferenceDetails = null;

}

class coverageInfo {

    /**
     * @var InsuranceCoverageType_133041S $coverage
     * @access public
     */
    public $coverage = null;

    /**
     * @var MonetaryInformationTypeI $coverageValues
     * @access public
     */
    public $coverageValues = null;

}

class passengerDetails {

    /**
     * @var ReferenceInformationType $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     * @var ActionDetailsTypeI $perPaxProdKnowledge
     * @access public
     */
    public $perPaxProdKnowledge = null;

    /**
     * @var StructuredDateTimeInformationType_128682S $dateOfBirthInfo
     * @access public
     */
    public $dateOfBirthInfo = null;

    /**
     * @var TravellerInformationType $passengerFeatures
     * @access public
     */
    public $passengerFeatures = null;

    /**
     * @var MiscellaneousRemarksType $insureeRemark
     * @access public
     */
    public $insureeRemark = null;

    /**
     * @var PassengerDocumentDetailsType $travelerDocInfo
     * @access public
     */
    public $travelerDocInfo = null;

    /**
     * @var InsurancePolicyType $policyDetails
     * @access public
     */
    public $policyDetails = null;

    /**
     * @var travelerValueDetails $travelerValueDetails
     * @access public
     */
    public $travelerValueDetails = null;

    /**
     * @var premiumPerTariffPerPax $premiumPerTariffPerPax
     * @access public
     */
    public $premiumPerTariffPerPax = null;

    /**
     * @var TariffInformationTypeI_133025S $premiumPerpaxInfo
     * @access public
     */
    public $premiumPerpaxInfo = null;

    /**
     * @var ReservationControlInformationTypeU $voucherNumber
     * @access public
     */
    public $voucherNumber = null;

}

class travelerValueDetails {

    /**
     * @var InsuranceCoverageType_133041S $travelCost
     * @access public
     */
    public $travelCost = null;

    /**
     * @var MonetaryInformationTypeI $travelAmount
     * @access public
     */
    public $travelAmount = null;

}

class premiumPerTariffPerPax {

    /**
     * @var InsuranceProductDetailsType_128684S $tariffCodeInfo
     * @access public
     */
    public $tariffCodeInfo = null;

    /**
     * @var MonetaryInformationTypeI $tariffCodePerPaxAmount
     * @access public
     */
    public $tariffCodePerPaxAmount = null;

}

class carInfos {

    /**
     * @var VehicleInformationType $vehicleInformation
     * @access public
     */
    public $vehicleInformation = null;

    /**
     * @var pickupDropoffLocations $pickupDropoffLocations
     * @access public
     */
    public $pickupDropoffLocations = null;

    /**
     * @var StructuredPeriodInformationType_128769S $pickupDropoffTimes
     * @access public
     */
    public $pickupDropoffTimes = null;

    /**
     * @var rateCodeGroup $rateCodeGroup
     * @access public
     */
    public $rateCodeGroup = null;

    /**
     * @var ConsumerReferenceInformationType $customerInfo
     * @access public
     */
    public $customerInfo = null;

    /**
     * @var TariffInformationTypeI_128793S $rateInfo
     * @access public
     */
    public $rateInfo = null;

    /**
     * @var NumberOfUnitsType $numberOfDrivers
     * @access public
     */
    public $numberOfDrivers = null;

    /**
     * @var rateDetails $rateDetails
     * @access public
     */
    public $rateDetails = null;

    /**
     * @var AttributeType $otherInformation
     * @access public
     */
    public $otherInformation = null;

}

class pickupDropoffLocations {

    /**
     * @var PlaceLocationIdentificationType $locationInfo
     * @access public
     */
    public $locationInfo = null;

    /**
     * @var AddressType $address
     * @access public
     */
    public $address = null;

    /**
     * @var PhoneAndEmailAddressType_128774S $phone
     * @access public
     */
    public $phone = null;

}

class rateDetails {

    /**
     * @var TariffInformationTypeI_128883S $taxSurchargeCoverageInfo
     * @access public
     */
    public $taxSurchargeCoverageInfo = null;

    /**
     * @var RuleInformationTypeU_128789S $otherRules
     * @access public
     */
    public $otherRules = null;

}

class docsGoodiesMisInfos {

    /**
     * @var StructuredPeriodInformationType_128780S $coverageDates
     * @access public
     */
    public $coverageDates = null;

    /**
     * @var FreeTextInformationType_128778S $docTitle
     * @access public
     */
    public $docTitle = null;

    /**
     * @var AddressType_129098S $addressInformation
     * @access public
     */
    public $addressInformation = null;

    /**
     * @var StructuredDateTimeInformationType_128779S $subscriptionDate
     * @access public
     */
    public $subscriptionDate = null;

    /**
     * @var FreeTextInformationType_129102S $visaDetails
     * @access public
     */
    public $visaDetails = null;

}

class dataElementsMaster {

    /**
     * @var DummySegmentTypeI $marker1
     * @access public
     */
    public $marker1 = null;

    /**
     * @var dataElementsIndiv $dataElementsIndiv
     * @access public
     */
    public $dataElementsIndiv = null;

}

class dataElementsIndiv {

    /**
     * @var ElementManagementSegmentType $elementManagementData
     * @access public
     */
    public $elementManagementData = null;

    /**
     * @var IndividualPnrSecurityInformationType $pnrSecurity
     * @access public
     */
    public $pnrSecurity = null;

    /**
     * @var AccountingInformationElementType $accounting
     * @access public
     */
    public $accounting = null;

    /**
     * @var MiscellaneousRemarksType $miscellaneousRemark
     * @access public
     */
    public $miscellaneousRemark = null;

    /**
     * @var ExtendedRemarkType $extendedRemark
     * @access public
     */
    public $extendedRemark = null;

    /**
     * @var SpecialRequirementsDetailsTypeI $serviceRequest
     * @access public
     */
    public $serviceRequest = null;

    /**
     * @var DateAndTimeInformationTypeI $dateAndTimeInformation
     * @access public
     */
    public $dateAndTimeInformation = null;

    /**
     * @var TourCodeType $tourCode
     * @access public
     */
    public $tourCode = null;

    /**
     * @var TicketElementType $ticketElement
     * @access public
     */
    public $ticketElement = null;

    /**
     * @var LongFreeTextType $freetextData
     * @access public
     */
    public $freetextData = null;

    /**
     * @var StructuredAddressType $structuredAddress
     * @access public
     */
    public $structuredAddress = null;

    /**
     * @var OptionElementType $optionElement
     * @access public
     */
    public $optionElement = null;

    /**
     * @var PrinterIdentificationType $printer
     * @access public
     */
    public $printer = null;

    /**
     * @var SeatEntityType $seatGroup
     * @access public
     */
    public $seatGroup = null;

    /**
     * @var FareElementsType $fareElement
     * @access public
     */
    public $fareElement = null;

    /**
     * @var FareDiscountElementType $fareDiscount
     * @access public
     */
    public $fareDiscount = null;

    /**
     * @var ManualDocumentRegistrationType $manualFareDocument
     * @access public
     */
    public $manualFareDocument = null;

    /**
     * @var CommissionElementType $commission
     * @access public
     */
    public $commission = null;

    /**
     * @var OriginalIssueType $originalIssue
     * @access public
     */
    public $originalIssue = null;

    /**
     * @var FormOfPaymentTypeI $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     * @var MarketSpecificDataType $fopExtension
     * @access public
     */
    public $fopExtension = null;

    /**
     * @var StatusTypeI $serviceDetails
     * @access public
     */
    public $serviceDetails = null;

    /**
     * @var FrequentTravellerVerificationType $frequentTravellerVerification
     * @access public
     */
    public $frequentTravellerVerification = null;

    /**
     * @var TicketingCarrierDesignatorType $ticketingCarrier
     * @access public
     */
    public $ticketingCarrier = null;

    /**
     * @var FarePrintOverrideType $farePrintOverride
     * @access public
     */
    public $farePrintOverride = null;

    /**
     * @var FrequentTravellerInformationTypeU $frequentTravellerData
     * @access public
     */
    public $frequentTravellerData = null;

    /**
     * @var ExtendedOwnershipSecurityDetailsType $accessLevel
     * @access public
     */
    public $accessLevel = null;

    /**
     * @var ReferenceInfoType $referenceForDataElement
     * @access public
     */
    public $referenceForDataElement = null;

}

class seatPaxInfo {

    /**
     * @var SeatRequestParametersTypeI_62897S $seatPaxDetails
     * @access public
     */
    public $seatPaxDetails = null;

    /**
     * @var StatusTypeI_132979S $seatPaxIndicator
     * @access public
     */
    public $seatPaxIndicator = null;

    /**
     * @var ReferenceInfoType_6074S $crossRef
     * @access public
     */
    public $crossRef = null;

}

class cityPair2 {

    /**
     * @var PlaceLocationIdentificationTypeU_35293S $depLocation
     * @access public
     */
    public $depLocation = null;

    /**
     * @var PlaceLocationIdentificationTypeU_35293S $arrLocation
     * @access public
     */
    public $arrLocation = null;

}

class railSeatDetails {

    /**
     * @var RailSeatReferenceInformationType $railSeatReferenceInformation
     * @access public
     */
    public $railSeatReferenceInformation = null;

    /**
     * @var FreeTextInformationType_29860S $railSeatDenomination
     * @access public
     */
    public $railSeatDenomination = null;

}

class referencedRecord {

    /**
     * @var ReservationControlInformationTypeI_132902S $referencedReservationInfo
     * @access public
     */
    public $referencedReservationInfo = null;

    /**
     * @var ReservationSecurityInformationType_167774S $securityInformation
     * @access public
     */
    public $securityInformation = null;

}

class elementErrorInformation {

    /**
     * @var ApplicationErrorInformationType $errorInformation
     * @access public
     */
    public $errorInformation = null;

    /**
     * @var InteractiveFreeTextTypeI_132924S $elementErrorText
     * @access public
     */
    public $elementErrorText = null;

}

class mcoRecord {

    /**
     * @var MiscellaneousChargeOrderType $mcoType
     * @access public
     */
    public $mcoType = null;

    /**
     * @var FreeTextInformationType_9865S $mcoInformation
     * @access public
     */
    public $mcoInformation = null;

    /**
     * @var groupOfFareElements $groupOfFareElements
     * @access public
     */
    public $groupOfFareElements = null;

}

class groupOfFareElements {

    /**
     * @var SequenceDetailsTypeU $sequenceNumber
     * @access public
     */
    public $sequenceNumber = null;

    /**
     * @var FreeTextInformationType_9865S $fareElementData
     * @access public
     */
    public $fareElementData = null;

}

class tstData {

    /**
     * @var TstGeneralInformationType $tstGeneralInformation
     * @access public
     */
    public $tstGeneralInformation = null;

    /**
     * @var LongFreeTextType $tstFreetext
     * @access public
     */
    public $tstFreetext = null;

    /**
     * @var FareBasisCodesLineType $fareBasisInfo
     * @access public
     */
    public $fareBasisInfo = null;

    /**
     * @var FareDataType $fareData
     * @access public
     */
    public $fareData = null;

    /**
     * @var SelectionDetailsTypeI $segmentAssociation
     * @access public
     */
    public $segmentAssociation = null;

    /**
     * @var ReferenceInfoType $referenceForTstData
     * @access public
     */
    public $referenceForTstData = null;

}

class pricingRecordGroup {

    /**
     * @var PricingTicketingDetailsType $pricingRecordData
     * @access public
     */
    public $pricingRecordData = null;

    /**
     * @var MonetaryInformationType_133078S $totalPrice
     * @access public
     */
    public $totalPrice = null;

    /**
     * @var PQRdataType $productPricingQuotationRecord
     * @access public
     */
    public $productPricingQuotationRecord = null;

}

class dcsData {

    /**
     * @var PassengerFlightDetailsTypeI $markerPax
     * @access public
     */
    public $markerPax = null;

    /**
     * @var PassengerFlightDetailsTypeI $markerSegment
     * @access public
     */
    public $markerSegment = null;

    /**
     * @var segmentSection $segmentSection
     * @access public
     */
    public $segmentSection = null;

    /**
     * @var PassengerFlightDetailsTypeI $markerLeg
     * @access public
     */
    public $markerLeg = null;

    /**
     * @var legSection $legSection
     * @access public
     */
    public $legSection = null;

}

class segmentSection {

    /**
     * @var ElementManagementSegmentType_127983S $elementManagementStructData
     * @access public
     */
    public $elementManagementStructData = null;

    /**
     * @var ReferenceInfoType $referenceForStructDataElement
     * @access public
     */
    public $referenceForStructDataElement = null;

    /**
     * @var dcsSegmentInfo $dcsSegmentInfo
     * @access public
     */
    public $dcsSegmentInfo = null;

}

class dcsSegmentInfo {

    /**
     * @var TravelProductInformationTypeI $booking
     * @access public
     */
    public $booking = null;

    /**
     * @var ReferenceInformationTypeI $paxType
     * @access public
     */
    public $paxType = null;

    /**
     * @var CodedAttributeType_127282S $typeOfCOP
     * @access public
     */
    public $typeOfCOP = null;

}

class legSection {

    /**
     * @var ElementManagementSegmentType_127983S $elementManagementStructData
     * @access public
     */
    public $elementManagementStructData = null;

    /**
     * @var ReferenceInfoType $referenceForStructDataElement
     * @access public
     */
    public $referenceForStructDataElement = null;

    /**
     * @var dcsLegInfo $dcsLegInfo
     * @access public
     */
    public $dcsLegInfo = null;

}

class dcsLegInfo {

    /**
     * @var TravelItineraryInformationTypeI $legPosition
     * @access public
     */
    public $legPosition = null;

    /**
     * @var OriginAndDestinationDetailsTypeI $leg
     * @access public
     */
    public $leg = null;

    /**
     * @var ReferenceInformationTypeI $paxType
     * @access public
     */
    public $paxType = null;

    /**
     * @var SpecialRequirementsDetailsType $seatDelivery
     * @access public
     */
    public $seatDelivery = null;

    /**
     * @var StatusTypeI_127261S $paxStatus
     * @access public
     */
    public $paxStatus = null;

    /**
     * @var accregReason $accregReason
     * @access public
     */
    public $accregReason = null;

    /**
     * @var SegmentCabinIdentificationType $regradeCabin
     * @access public
     */
    public $regradeCabin = null;

    /**
     * @var acceptanceChannel $acceptanceChannel
     * @access public
     */
    public $acceptanceChannel = null;

    /**
     * @var CompensationType $compensationData
     * @access public
     */
    public $compensationData = null;

}

class accregReason {

    /**
     * @var CodedAttributeType_127279S $reasons
     * @access public
     */
    public $reasons = null;

    /**
     * @var InteractiveFreeTextTypeI $deliveryInformation
     * @access public
     */
    public $deliveryInformation = null;

}

class acceptanceChannel {

    /**
     * @var UserIdentificationType_127265S $acceptanceOrigin
     * @access public
     */
    public $acceptanceOrigin = null;

    /**
     * @var ApplicationType $applicationType
     * @access public
     */
    public $applicationType = null;

}

class offerGroup {

    /**
     * @var OfferPropertiesType $offerCharacteristics
     * @access public
     */
    public $offerCharacteristics = null;

    /**
     * @var ElementManagementSegmentType_132840S $elementManagementOffer
     * @access public
     */
    public $elementManagementOffer = null;

    /**
     * @var sentIndicator $sentIndicator
     * @access public
     */
    public $sentIndicator = null;

    /**
     * @var POSGroupType_150753G $posDetails
     * @access public
     */
    public $posDetails = null;

    /**
     * @var originDestinationDetails $originDestinationDetails
     * @access public
     */
    public $originDestinationDetails = null;

    /**
     * @var SegmentGroupingInformationType $segmentGroupingInfo
     * @access public
     */
    public $segmentGroupingInfo = null;

    /**
     * @var offerElementMaster $offerElementMaster
     * @access public
     */
    public $offerElementMaster = null;

    /**
     * @var pricingRecordGroup $pricingRecordGroup
     * @access public
     */
    public $pricingRecordGroup = null;

}

class sentIndicator {

    /**
     * @var DateAndTimeInformationTypeI_90801S $dateTimeOFN
     * @access public
     */
    public $dateTimeOFN = null;

    /**
     * @var PhoneAndEmailAddressType_132846S $phoneEmailOFNIndic
     * @access public
     */
    public $phoneEmailOFNIndic = null;

    /**
     * @var PhoneAndEmailAddressType_132846S $phoneEmailOFN
     * @access public
     */
    public $phoneEmailOFN = null;

}

class billingSegmentInfo {

    /**
     * @var AdditionalBusinessSourceInformationTypeI $bookingCreatorDetails
     * @access public
     */
    public $bookingCreatorDetails = null;

    /**
     * @var SegmentCabinIdentificationType $cabinInformation
     * @access public
     */
    public $cabinInformation = null;

    /**
     * @var CodedAttributeType_132911S $airSegmentAttributes
     * @access public
     */
    public $airSegmentAttributes = null;

    /**
     * @var TariffInformationTypeI_132913S $monetaryInfo
     * @access public
     */
    public $monetaryInfo = null;

}

class yieldDataGroup {

    /**
     * @var MonetaryInformationType $yieldInformations
     * @access public
     */
    public $yieldInformations = null;

    /**
     * @var ProductInformationTypeI_132967S $classCombinaison
     * @access public
     */
    public $classCombinaison = null;

    /**
     * @var OriginAndDestinationDetailsTypeI_132966S $ondyield
     * @access public
     */
    public $ondyield = null;

    /**
     * @var OriginAndDestinationDetailsTypeI_132966S $tripOnD
     * @access public
     */
    public $tripOnD = null;

}

class codeSharePartnerInfo {

    /**
     * @var TravelProductInformationType_132989S $codeSharePartner
     * @access public
     */
    public $codeSharePartner = null;

    /**
     * @var CodeShareDetailsType $codeShareDetails
     * @access public
     */
    public $codeShareDetails = null;

    /**
     * @var InventoryDataType $codeSharePartnerInventoryData
     * @access public
     */
    public $codeSharePartnerInventoryData = null;

    /**
     * @var codeSharePartnerYieldData $codeSharePartnerYieldData
     * @access public
     */
    public $codeSharePartnerYieldData = null;

    /**
     * @var RevenueManagementDataType $codeSharePartnerOverbookingData
     * @access public
     */
    public $codeSharePartnerOverbookingData = null;

    /**
     * @var StatusType_132908S $codeShareCtdReplacementFlags
     * @access public
     */
    public $codeShareCtdReplacementFlags = null;

}

class codeSharePartnerYieldData {

    /**
     * @var MonetaryInformationType $yieldInformations
     * @access public
     */
    public $yieldInformations = null;

    /**
     * @var ProductInformationTypeI_132967S $classCombinaison
     * @access public
     */
    public $classCombinaison = null;

    /**
     * @var OriginAndDestinationDetailsTypeI_132966S $ondyield
     * @access public
     */
    public $ondyield = null;

    /**
     * @var OriginAndDestinationDetailsTypeI_132966S $tripOnD
     * @access public
     */
    public $tripOnD = null;

}

class insuranceInfo {

    /**
     * @var InsuranceProductDetailsType_133021S $providerProductDetails
     * @access public
     */
    public $providerProductDetails = null;

    /**
     * @var CompanyInformationType_133019S $providerDetails
     * @access public
     */
    public $providerDetails = null;

    /**
     * @var PhoneAndEmailAddressType $providerPhoneContact
     * @access public
     */
    public $providerPhoneContact = null;

    /**
     * @var FreeTextInformationType_128665S $infoLines
     * @access public
     */
    public $infoLines = null;

    /**
     * @var TravellerInformationTypeI_133026S $substiteName
     * @access public
     */
    public $substiteName = null;

    /**
     * @var MonetaryInformationTypeI $extraPremium
     * @access public
     */
    public $extraPremium = null;

    /**
     * @var productSection $productSection
     * @access public
     */
    public $productSection = null;

    /**
     * @var TariffInformationTypeI_133025S $planCostInfo
     * @access public
     */
    public $planCostInfo = null;

    /**
     * @var planTypeDetails $planTypeDetails
     * @access public
     */
    public $planTypeDetails = null;

    /**
     * @var contactDetails $contactDetails
     * @access public
     */
    public $contactDetails = null;

    /**
     * @var subscriberAddressSection $subscriberAddressSection
     * @access public
     */
    public $subscriberAddressSection = null;

    /**
     * @var coverageDetails $coverageDetails
     * @access public
     */
    public $coverageDetails = null;

    /**
     * @var CommissionInformationType $comissionAmount
     * @access public
     */
    public $comissionAmount = null;

    /**
     * @var ReservationControlInformationTypeI $confirmationNumber
     * @access public
     */
    public $confirmationNumber = null;

    /**
     * @var ActionDetailsTypeI $productKnowledge
     * @access public
     */
    public $productKnowledge = null;

    /**
     * @var passengerDetails $passengerDetails
     * @access public
     */
    public $passengerDetails = null;

    /**
     * @var DocumentInformationDetailsTypeI $printInformation
     * @access public
     */
    public $printInformation = null;

}

class extendedContentInfos {

    /**
     * @var ExtendedContentType $easyContentIdentification
     * @access public
     */
    public $easyContentIdentification = null;

    /**
     * @var CompanyInformationType_129761S $providerDetails
     * @access public
     */
    public $providerDetails = null;

    /**
     * @var StructuredDateTimeInformationType_128728S $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     * @var ReferenceInformationType_129701S $paxRef
     * @access public
     */
    public $paxRef = null;

    /**
     * @var ReferenceInfoType_129703S $associationReference
     * @access public
     */
    public $associationReference = null;

    /**
     * @var FreeTextInformationType_128778S $productDescription
     * @access public
     */
    public $productDescription = null;

    /**
     * @var RelatedProductInformationType $quantityStatus
     * @access public
     */
    public $quantityStatus = null;

    /**
     * @var ReservationControlInformationType $confirmOrCancelNbr
     * @access public
     */
    public $confirmOrCancelNbr = null;

    /**
     * @var SelectionDetailsType $bookingChannel
     * @access public
     */
    public $bookingChannel = null;

    /**
     * @var airInfos $airInfos
     * @access public
     */
    public $airInfos = null;

    /**
     * @var railInfos $railInfos
     * @access public
     */
    public $railInfos = null;

    /**
     * @var eventInfos $eventInfos
     * @access public
     */
    public $eventInfos = null;

    /**
     * @var hotelInfos $hotelInfos
     * @access public
     */
    public $hotelInfos = null;

    /**
     * @var taxiInfos $taxiInfos
     * @access public
     */
    public $taxiInfos = null;

    /**
     * @var insuranceInfos $insuranceInfos
     * @access public
     */
    public $insuranceInfos = null;

    /**
     * @var ExtendedContentFerryLegDescriptionType $ferryInfos
     * @access public
     */
    public $ferryInfos = null;

    /**
     * @var DummySegmentTypeI $marker
     * @access public
     */
    public $marker = null;

    /**
     * @var carInfos $carInfos
     * @access public
     */
    public $carInfos = null;

    /**
     * @var CruiseExtendedContentType $cruiseInfos
     * @access public
     */
    public $cruiseInfos = null;

    /**
     * @var docsGoodiesMisInfos $docsGoodiesMisInfos
     * @access public
     */
    public $docsGoodiesMisInfos = null;

}

class offerElementMaster {

    /**
     * @var DummySegmentTypeI $offerMarker1
     * @access public
     */
    public $offerMarker1 = null;

    /**
     * @var offerElementsIndiv $offerElementsIndiv
     * @access public
     */
    public $offerElementsIndiv = null;

    /**
     * @var DummySegmentTypeI $offerMarker2
     * @access public
     */
    public $offerMarker2 = null;

    /**
     * @var offerElementsStruct $offerElementsStruct
     * @access public
     */
    public $offerElementsStruct = null;

}

class offerElementsIndiv {

    /**
     * @var ElementManagementSegmentType_132897S $elementManagementData
     * @access public
     */
    public $elementManagementData = null;

    /**
     * @var ReferenceInfoType $referenceForDataElement
     * @access public
     */
    public $referenceForDataElement = null;

    /**
     * @var SpecialRequirementsDetailsTypeI $serviceRequest
     * @access public
     */
    public $serviceRequest = null;

    /**
     * @var StatusTypeI_133063S $ssrIndicator
     * @access public
     */
    public $ssrIndicator = null;

    /**
     * @var ReservationSecurityInformationType $ssrCreationInfo
     * @access public
     */
    public $ssrCreationInfo = null;

    /**
     * @var LongFreeTextType $otherDataFreetext
     * @access public
     */
    public $otherDataFreetext = null;

}

class offerElementsStruct {

    /**
     * @var ElementManagementSegmentType_132897S $elementManagementData
     * @access public
     */
    public $elementManagementData = null;

    /**
     * @var ReferenceInfoType $referenceForDataElement
     * @access public
     */
    public $referenceForDataElement = null;

    /**
     * @var SeatEntityType $offerSeatData
     * @access public
     */
    public $offerSeatData = null;

}

class ATCdataType {

    /**
     * @var MonetaryInformationTypeI_79012S $atcTotalAdditionalCollection
     * @access public
     */
    public $atcTotalAdditionalCollection = null;

    /**
     * @var MonetaryInformationTypeI_79012S $otherAtcFares
     * @access public
     */
    public $otherAtcFares = null;

}

class AccommodationAllocationInformationDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To4 $referenceId
     * @access public
     */
    public $referenceId = null;

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

}

class AccommodationAllocationInformationTypeU {

    /**
     * @var AccommodationAllocationInformationDetailsTypeU $accommAllocation
     * @access public
     */
    public $accommAllocation = null;

}

class AccountingElementType {

    /**
     * @var AlphaNumericString_Length1To30 $number
     * @access public
     */
    public $number = null;

}

class AccountingInformationElementType {

    /**
     * @var AccountingElementType $account
     * @access public
     */
    public $account = null;

}

class ActionDetailsTypeI {

    /**
     * @var ProcessingInformationTypeI $numberOfItemsDetails
     * @access public
     */
    public $numberOfItemsDetails = null;

}

class AdditionalBusinessSourceInformationTypeI {

    /**
     * @var OriginatorIdentificationDetailsTypeI_192816C $originatorDetails
     * @access public
     */
    public $originatorDetails = null;

}

class AdditionalBusinessSourceInformationType {

    /**
     * @var SourceTypeDetailsTypeI $sourceType
     * @access public
     */
    public $sourceType = null;

    /**
     * @var OriginatorIdentificationDetailsTypeI $originatorDetails
     * @access public
     */
    public $originatorDetails = null;

}

class AdditionalBusinessSourceInformationType_132962S {

    /**
     * @var SourceTypeDetailsTypeI $sourceType
     * @access public
     */
    public $sourceType = null;

    /**
     * @var AlphaNumericString_Length1To2 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var AlphaNumericString_Length1To2 $systemCode
     * @access public
     */
    public $systemCode = null;

}

class AdditionalProductDetailsTypeI_132895S {

    /**
     * @var AdditionalProductTypeI_192793C $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var StationInformationTypeI $departureInformation
     * @access public
     */
    public $departureInformation = null;

    /**
     * @var StationInformationTypeI_192797C $arrivalInformation
     * @access public
     */
    public $arrivalInformation = null;

    /**
     * @var TravellerTimeDetailsTypeI $timeDetail
     * @access public
     */
    public $timeDetail = null;

    /**
     * @var ProductFacilitiesTypeI_192796C $facilities
     * @access public
     */
    public $facilities = null;

}

class AdditionalProductDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $productArea
     * @access public
     */
    public $productArea = null;

    /**
     * @var ProductDataInformationTypeU $productDetails
     * @access public
     */
    public $productDetails = null;

}

class AdditionalProductTypeI_192793C {

    /**
     * @var AlphaNumericString_Length1To4 $equipment
     * @access public
     */
    public $equipment = null;

    /**
     * @var NumericInteger_Length1To2 $numOfStops
     * @access public
     */
    public $numOfStops = null;

    /**
     * @var NumericInteger_Length1To1 $weekDay
     * @access public
     */
    public $weekDay = null;

}

class AdditionalProductType {

    /**
     * @var AlphaNumericString_Length1To8 $equipment
     * @access public
     */
    public $equipment = null;

    /**
     * @var NumericInteger_Length1To3 $numberOfStops
     * @access public
     */
    public $numberOfStops = null;

    /**
     * @var NumericInteger_Length1To1 $weekDay
     * @access public
     */
    public $weekDay = null;

}

class AdditionalTransportDetailsTypeU {

    /**
     * @var TerminalInformationTypeU $terminalInformation
     * @access public
     */
    public $terminalInformation = null;

}

class AddressDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $format
     * @access public
     */
    public $format = null;

    /**
     * @var AlphaNumericString_Length1To70 $line1
     * @access public
     */
    public $line1 = null;

    /**
     * @var AlphaNumericString_Length1To70 $line2
     * @access public
     */
    public $line2 = null;

    /**
     * @var AlphaNumericString_Length1To70 $line3
     * @access public
     */
    public $line3 = null;

    /**
     * @var AlphaNumericString_Length1To70 $line4
     * @access public
     */
    public $line4 = null;

    /**
     * @var AlphaNumericString_Length1To70 $line5
     * @access public
     */
    public $line5 = null;

    /**
     * @var AlphaNumericString_Length1To70 $line6
     * @access public
     */
    public $line6 = null;

}

class AddressDetailsTypeU_17987C {

    /**
     * @var AlphaNumericString_Length1To3 $format
     * @access public
     */
    public $format = null;

    /**
     * @var AlphaNumericString_Length1To50 $line1
     * @access public
     */
    public $line1 = null;

    /**
     * @var AlphaNumericString_Length1To50 $line2
     * @access public
     */
    public $line2 = null;

    /**
     * @var AlphaNumericString_Length1To8 $line4
     * @access public
     */
    public $line4 = null;

}

class AddressDetailsTypeU_187664C {

    /**
     * @var AlphaNumericString_Length1To3 $format
     * @access public
     */
    public $format = null;

    /**
     * @var AlphaNumericString_Length1To70 $line1
     * @access public
     */
    public $line1 = null;

    /**
     * @var AlphaNumericString_Length1To70 $line2
     * @access public
     */
    public $line2 = null;

}

class AddressDetailsTypeU_192854C {

    /**
     * @var AlphaNumericString_Length1To3 $format
     * @access public
     */
    public $format = null;

    /**
     * @var AlphaNumericString_Length1To60 $line1
     * @access public
     */
    public $line1 = null;

}

class AddressTypeU {

    /**
     * @var AddressDetailsTypeU_17987C $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var AlphaNumericString_Length1To30 $city
     * @access public
     */
    public $city = null;

    /**
     * @var AlphaNumericString_Length1To17 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var CountrySubEntityDetailsTypeU $regionDetails
     * @access public
     */
    public $regionDetails = null;

    /**
     * @var LocationIdentificationTypeU $locationDetails
     * @access public
     */
    public $locationDetails = null;

}

class AddressTypeU_132936S {

    /**
     * @var AddressUsageTypeU_192856C $addressUsageDetails
     * @access public
     */
    public $addressUsageDetails = null;

    /**
     * @var AddressDetailsTypeU_192854C $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var AlphaNumericString_Length1To30 $city
     * @access public
     */
    public $city = null;

    /**
     * @var AlphaNumericString_Length1To10 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var AlphaNumericString_Length1To2 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var CountrySubEntityDetailsTypeU_192857C $regionDetails
     * @access public
     */
    public $regionDetails = null;

    /**
     * @var LocationIdentificationTypeU_192855C $locationDetails
     * @access public
     */
    public $locationDetails = null;

}

class AddressTypeU_132947S {

    /**
     * @var AddressDetailsTypeU_187664C $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $city
     * @access public
     */
    public $city = null;

    /**
     * @var AlphaNumericString_Length1To17 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var CountrySubEntityDetailsTypeU_187667C $regionDetails
     * @access public
     */
    public $regionDetails = null;

}

class AddressType {

    /**
     * @var AddressDetailsTypeU_187664C $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $city
     * @access public
     */
    public $city = null;

    /**
     * @var AlphaNumericString_Length1To17 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var CountrySubEntityDetailsTypeU_187667C $regionDetails
     * @access public
     */
    public $regionDetails = null;

}

class AddressType_129098S {

    /**
     * @var AddressUsageTypeU $addressUsageDetails
     * @access public
     */
    public $addressUsageDetails = null;

    /**
     * @var AddressDetailsTypeU $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $city
     * @access public
     */
    public $city = null;

    /**
     * @var AlphaNumericString_Length1To17 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var CountrySubEntityDetailsTypeU_188109C $regionDetails
     * @access public
     */
    public $regionDetails = null;

    /**
     * @var LocationIdentificationTypeU_188107C $locationDetails
     * @access public
     */
    public $locationDetails = null;

}

class AddressType_129172S {

    /**
     * @var AddressDetailsTypeU $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $city
     * @access public
     */
    public $city = null;

    /**
     * @var AlphaNumericString_Length1To17 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var LocationIdentificationTypeU_188218C $locationDetails
     * @access public
     */
    public $locationDetails = null;

}

class AddressType_94501S {

    /**
     * @var AddressDetailsTypeU $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $city
     * @access public
     */
    public $city = null;

    /**
     * @var AlphaNumericString_Length1To17 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

}

class AddressUsageTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $purpose
     * @access public
     */
    public $purpose = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

}

class AddressUsageTypeU_192856C {

    /**
     * @var AlphaNumericString_Length1To3 $purpose
     * @access public
     */
    public $purpose = null;

}

class AgreementIdentificationTypeU {

    /**
     * @var AgreementTypeIdentificationTypeU $agreementDetails
     * @access public
     */
    public $agreementDetails = null;

}

class AgreementTypeIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To25 $description
     * @access public
     */
    public $description = null;

}

class ApplicationErrorDetailTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $errorCategory
     * @access public
     */
    public $errorCategory = null;

    /**
     * @var AlphaNumericString_Length1To3 $errorCodeOwner
     * @access public
     */
    public $errorCodeOwner = null;

}

class ApplicationErrorDetailType {

    /**
     * @var AlphaNumericString_Length1To5 $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $errorCategory
     * @access public
     */
    public $errorCategory = null;

    /**
     * @var AlphaNumericString_Length1To3 $errorCodeOwner
     * @access public
     */
    public $errorCodeOwner = null;

}

class ApplicationErrorDetailType_192859C {

    /**
     * @var AlphaNumericString_Length1To5 $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $errorCategory
     * @access public
     */
    public $errorCategory = null;

    /**
     * @var AlphaNumericString_Length1To3 $errorCodeOwner
     * @access public
     */
    public $errorCodeOwner = null;

}

class ApplicationErrorInformationType_132938S {

    /**
     * @var ApplicationErrorDetailType_192859C $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class ApplicationErrorInformationType_94519S {

    /**
     * @var ApplicationErrorDetailType $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class ApplicationIdentificationType {

    /**
     * @var AlphaNumericString_Length1To35 $internalId
     * @access public
     */
    public $internalId = null;

    /**
     * @var AlphaNumericString_Length1To35 $versionNumber
     * @access public
     */
    public $versionNumber = null;

}

class ApplicationType {

    /**
     * @var ApplicationIdentificationType $applicationDetails
     * @access public
     */
    public $applicationDetails = null;

}

class AssociatedChargesInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericDecimal_Length1To12 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To20 $description
     * @access public
     */
    public $description = null;

    /**
     * @var NumericInteger_Length1To4 $numberInParty
     * @access public
     */
    public $numberInParty = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To70 $comment
     * @access public
     */
    public $comment = null;

}

class AssociatedChargesInformationTypeI_187653C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To35 $description
     * @access public
     */
    public $description = null;

    /**
     * @var NumericInteger_Length1To15 $numberInParty
     * @access public
     */
    public $numberInParty = null;

    /**
     * @var AlphaNumericString_Length1To3 $periodType
     * @access public
     */
    public $periodType = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To70 $comment
     * @access public
     */
    public $comment = null;

}

class AssociatedChargesInformationTypeI_192822C {

    /**
     * @var AlphaString_Length3To3 $type
     * @access public
     */
    public $type = null;

}

class AssociatedChargesInformationTypeI_192849C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To35 $description
     * @access public
     */
    public $description = null;

    /**
     * @var NumericInteger_Length1To15 $numberInParty
     * @access public
     */
    public $numberInParty = null;

    /**
     * @var AlphaNumericString_Length1To3 $periodType
     * @access public
     */
    public $periodType = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To70 $comment
     * @access public
     */
    public $comment = null;

}

class AssociatedChargesInformationTypeI_192867C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To9 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $description
     * @access public
     */
    public $description = null;

    /**
     * @var NumericInteger_Length1To15 $numberInParty
     * @access public
     */
    public $numberInParty = null;

    /**
     * @var AlphaNumericString_Length1To3 $periodType
     * @access public
     */
    public $periodType = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To70 $comment
     * @access public
     */
    public $comment = null;

}

class AssociatedChargesInformationTypeI_193002C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $description
     * @access public
     */
    public $description = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class AssociatedChargesInformationTypeI_198218C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericDecimal_Length1To9 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $description
     * @access public
     */
    public $description = null;

    /**
     * @var NumericInteger_Length1To15 $numberInParty
     * @access public
     */
    public $numberInParty = null;

    /**
     * @var AlphaNumericString_Length1To3 $periodType
     * @access public
     */
    public $periodType = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To70 $comment
     * @access public
     */
    public $comment = null;

}

class AssociatedChargesInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $chargeUnitCode
     * @access public
     */
    public $chargeUnitCode = null;

    /**
     * @var NumericDecimal_Length1To11 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var NumericDecimal_Length1To10 $percentage
     * @access public
     */
    public $percentage = null;

}

class AttributeInformationTypeU_142127C {

    /**
     * @var AlphaNumericString_Length1To25 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class AttributeInformationTypeU_188164C {

    /**
     * @var AlphaNumericString_Length1To3 $attributeType
     * @access public
     */
    public $attributeType = null;

}

class AttributeInformationTypeU_192829C {

    /**
     * @var AlphaNumericString_Length1To3 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To3 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class AttributeInformationTypeU_36633C {

    /**
     * @var AlphaNumericString_Length1To7 $attributeType
     * @access public
     */
    public $attributeType = null;

}

class AttributeTypeU_20529S {

    /**
     * @var AlphaNumericString_Length1To1 $attributeFunction
     * @access public
     */
    public $attributeFunction = null;

    /**
     * @var AttributeInformationTypeU_36633C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class AttributeType_132917S {

    /**
     * @var AlphaNumericString_Length1To3 $criteriaSetType
     * @access public
     */
    public $criteriaSetType = null;

    /**
     * @var AttributeInformationTypeU_192829C $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class AttributeType_79011S {

    /**
     * @var AlphaNumericString_Length1To3 $criteriaSetType
     * @access public
     */
    public $criteriaSetType = null;

    /**
     * @var AttributeInformationTypeU $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class AttributeType_94514S {

    /**
     * @var AMA_EDICodesetType_Length1to3 $criteriaSetType
     * @access public
     */
    public $criteriaSetType = null;

    /**
     * @var AttributeInformationTypeU_142127C $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class AttributeType_94553S {

    /**
     * @var AlphaNumericString_Length1To3 $criteriaSetType
     * @access public
     */
    public $criteriaSetType = null;

    /**
     * @var AttributeInformationTypeU_142127C $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class AttributeType_94576S {

    /**
     * @var AlphaNumericString_Length1To3 $criteriaSetType
     * @access public
     */
    public $criteriaSetType = null;

    /**
     * @var AttributeInformationTypeU_142127C $criteriaDetails
     * @access public
     */
    public $criteriaDetails = null;

}

class AuthenticationDataType {

    /**
     * @var AlphaString_Length1To1 $veres
     * @access public
     */
    public $veres = null;

    /**
     * @var AlphaString_Length1To1 $pares
     * @access public
     */
    public $pares = null;

    /**
     * @var AlphaNumericString_Length4To4 $creditCardCompany
     * @access public
     */
    public $creditCardCompany = null;

    /**
     * @var AlphaNumericString_Length2To2 $authenticationIndicator
     * @access public
     */
    public $authenticationIndicator = null;

    /**
     * @var NumericInteger_Length1To1 $caavAlgorithm
     * @access public
     */
    public $caavAlgorithm = null;

}

class AuthorizationApprovalDataType {

    /**
     * @var AlphaNumericString_Length1To12 $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $sourceOfApproval
     * @access public
     */
    public $sourceOfApproval = null;

}

class AwardType {

    /**
     * @var AlphaNumericString_Length1To35 $provider
     * @access public
     */
    public $provider = null;

    /**
     * @var AlphaNumericString_Length1To35 $rating
     * @access public
     */
    public $rating = null;

}

class AwardsType {

    /**
     * @var AwardType $award
     * @access public
     */
    public $award = null;

}

class BaggageDetailsTypeI {

    /**
     * @var NumericInteger_Length1To15 $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     * @var AlphaNumericString_Length1To3 $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class BillableInformationTypeU {

    /**
     * @var DiagnosisTypeU $billingInfo
     * @access public
     */
    public $billingInfo = null;

}

class BinaryDataType {

    /**
     * @var NumericInteger_Length1To15 $dataLength
     * @access public
     */
    public $dataLength = null;

    /**
     * @var AlphaNumericString_Length1To1 $dataType
     * @access public
     */
    public $dataType = null;

    /**
     * @var AlphaNumericString_Length1To99999 $binaryData
     * @access public
     */
    public $binaryData = null;

}

class BrowserInformationType {

    /**
     * @var NumericInteger_Length1To3 $deviceCategory
     * @access public
     */
    public $deviceCategory = null;

}

class CabinDescriptionDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $positionInShip
     * @access public
     */
    public $positionInShip = null;

    /**
     * @var AlphaNumericString_Length1To3 $cabinSide
     * @access public
     */
    public $cabinSide = null;

    /**
     * @var AlphaNumericString_Length1To1 $categoryLocation
     * @access public
     */
    public $categoryLocation = null;

    /**
     * @var NumericInteger_Length1To2 $maxOccupancy
     * @access public
     */
    public $maxOccupancy = null;

}

class CabinDescriptionType {

    /**
     * @var CabinIdentificationType $cabinDetails
     * @access public
     */
    public $cabinDetails = null;

    /**
     * @var CabinDescriptionDetailsType $cabinDescription
     * @access public
     */
    public $cabinDescription = null;

    /**
     * @var DeckType $deckPlanName
     * @access public
     */
    public $deckPlanName = null;

    /**
     * @var AlphaNumericString_Length1To3 $cabinStatus
     * @access public
     */
    public $cabinStatus = null;

}

class CabinDetailsType {

    /**
     * @var CabinClassDesignationType $cabinDetails
     * @access public
     */
    public $cabinDetails = null;

}

class CardValidityType {

    /**
     * @var AlphaNumericString_Length1To1 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To1 $form
     * @access public
     */
    public $form = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class ChildrenGroupType {

    /**
     * @var QuantityTypeI_65488S $age
     * @access public
     */
    public $age = null;

    /**
     * @var ReferenceInformationType_65487S $referenceForPassenger
     * @access public
     */
    public $referenceForPassenger = null;

}

class ClassConfigurationDetailsType {

    /**
     * @var ClassDetailsType $classDetails
     * @access public
     */
    public $classDetails = null;

}

class ClassConfigurationDetailsType_132973S {

    /**
     * @var ClassDetailsType_192907C $classDetails
     * @access public
     */
    public $classDetails = null;

}

class ClassDetailsType {

    /**
     * @var AlphaNumericString_Length1To1 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length2To2 $bookingClass
     * @access public
     */
    public $bookingClass = null;

}

class ClassDetailsType_192907C {

    /**
     * @var AlphaNumericString_Length1To1 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length2To2 $bookingClass
     * @access public
     */
    public $bookingClass = null;

    /**
     * @var NumericInteger_Length1To3 $numberOfSeats
     * @access public
     */
    public $numberOfSeats = null;

}

class ClassDetailsType_52782C {

    /**
     * @var AlphaNumericString_Length1To1 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length2To2 $bookingClass
     * @access public
     */
    public $bookingClass = null;

}

class CoachProductInformationType {

    /**
     * @var ReferencingDetailsTypeI_36941C $coachDetails
     * @access public
     */
    public $coachDetails = null;

    /**
     * @var AlphaNumericString_Length1To1 $equipmentCode
     * @access public
     */
    public $equipmentCode = null;

}

class CodeShareDetailsType {

    /**
     * @var AlphaNumericString_Length3To3 $codeShareAgreement
     * @access public
     */
    public $codeShareAgreement = null;

}

class CodedAttributeInformationType_122050C {

    /**
     * @var AlphaNumericString_Length1To3 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To20 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CodedAttributeInformationType_142108C {

    /**
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

}

class CodedAttributeInformationType_185753C {

    /**
     * @var AlphaNumericString_Length1To3 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CodedAttributeInformationType_188409C {

    /**
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

    /**
     * @var AlphaNumericString_Length1To8 $encoding
     * @access public
     */
    public $encoding = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

}

class CodedAttributeInformationType_192819C {

    /**
     * @var AlphaNumericString_Length1To5 $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var AlphaNumericString_Length1To256 $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class CodedAttributeType_127279S {

    /**
     * @var CodedAttributeInformationType_185753C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_127282S {

    /**
     * @var CodedAttributeInformationType_142108C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_129339S {

    /**
     * @var AlphaNumericString_Length1To3 $attributeFunction
     * @access public
     */
    public $attributeFunction = null;

    /**
     * @var CodedAttributeInformationType_188409C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_132911S {

    /**
     * @var CodedAttributeInformationType_192819C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_132972S {

    /**
     * @var AlphaNumericString_Length1To3 $attributeFunction
     * @access public
     */
    public $attributeFunction = null;

    /**
     * @var CodedAttributeInformationType_192819C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_79010S {

    /**
     * @var CodedAttributeInformationType $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_79464S {

    /**
     * @var CodedAttributeInformationType_122050C $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodedAttributeType_94497S {

    /**
     * @var AlphaNumericString_Length1To3 $attributeFunction
     * @access public
     */
    public $attributeFunction = null;

    /**
     * @var CodedAttributeInformationType $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class CodeshareFlightDataTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $airline
     * @access public
     */
    public $airline = null;

    /**
     * @var NumericInteger_Length0To4 $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     * @var AlphaNumericString_Length0To3 $inventory
     * @access public
     */
    public $inventory = null;

    /**
     * @var AlphaString_Length1To1 $sellingClass
     * @access public
     */
    public $sellingClass = null;

    /**
     * @var AlphaNumericString_Length1To2 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaString_Length1To1 $suffix
     * @access public
     */
    public $suffix = null;

    /**
     * @var NumericInteger_Length1To1 $cascadingIndicator
     * @access public
     */
    public $cascadingIndicator = null;

}

class CommissionDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericDecimal_Length1To11 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class CommissionDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var NumericInteger_Length1To8 $rate
     * @access public
     */
    public $rate = null;

}

class CommissionDetailsType_187454C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var NumericInteger_Length1To8 $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var NumericInteger_Length1To8 $dealNumber
     * @access public
     */
    public $dealNumber = null;

}

class CommissionInformationTypeI {

    /**
     * @var CommissionDetailsTypeI $commissionDetails
     * @access public
     */
    public $commissionDetails = null;

    /**
     * @var CommissionDetailsTypeI $otherComDetails
     * @access public
     */
    public $otherComDetails = null;

}

class CommissionInformationType {

    /**
     * @var NumericDecimal_Length1To5 $percentage
     * @access public
     */
    public $percentage = null;

    /**
     * @var NumericDecimal_Length1To10 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To2 $vatIndicator
     * @access public
     */
    public $vatIndicator = null;

    /**
     * @var AlphaNumericString_Length1To2 $remitIndicator
     * @access public
     */
    public $remitIndicator = null;

}

class CommissionInformationType_132992S {

    /**
     * @var CommissionDetailsType $commissionDetails
     * @access public
     */
    public $commissionDetails = null;

}

class CommunicationContactDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To70 $email
     * @access public
     */
    public $email = null;

    /**
     * @var AlphaNumericString_Length1To3 $contactQualifier
     * @access public
     */
    public $contactQualifier = null;

}

class CommunicationContactDetailsType {

    /**
     * @var AlphaNumericString_Length1To512 $urlAddress
     * @access public
     */
    public $urlAddress = null;

    /**
     * @var AlphaNumericString_Length1To3 $urlType
     * @access public
     */
    public $urlType = null;

}

class CommunicationContactTypeU {

    /**
     * @var CommunicationContactDetailsTypeU $contact
     * @access public
     */
    public $contact = null;

}

class CommunicationContactType {

    /**
     * @var CommunicationContactDetailsType $communication
     * @access public
     */
    public $communication = null;

}

class CompanyIdentificationTypeI_148289C {

    /**
     * @var AlphaNumericString_Length1To3 $operatingCompany
     * @access public
     */
    public $operatingCompany = null;

}

class CompanyIdentificationTypeI_186905C {

    /**
     * @var AlphaNumericString_Length1To10 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

}

class CompanyIdentificationTypeI_192810C {

    /**
     * @var AlphaNumericString_Length1To3 $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var AlphaNumericString_Length1To4 $secondIdentification
     * @access public
     */
    public $secondIdentification = null;

    /**
     * @var AlphaNumericString_Length1To4 $sourceCode
     * @access public
     */
    public $sourceCode = null;

}

class CompanyIdentificationTypeI_192926C {

    /**
     * @var AlphaNumericString_Length1To3 $carrierCode
     * @access public
     */
    public $carrierCode = null;

}

class CompanyIdentificationTypeI_46335C {

    /**
     * @var AlphaNumericString_Length1To24 $marketingCompany
     * @access public
     */
    public $marketingCompany = null;

}

class CompanyIdentificationTypeI_46351C {

    /**
     * @var AlphaNumericString_Length1To2 $operatingCompany
     * @access public
     */
    public $operatingCompany = null;

}

class CompanyIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length1To20 $providerName
     * @access public
     */
    public $providerName = null;

}

class CompanyInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyCodeContext
     * @access public
     */
    public $companyCodeContext = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

    /**
     * @var AlphaNumericString_Length1To3 $accessLevel
     * @access public
     */
    public $accessLevel = null;

}

class CompanyInformationType_129761S {

    /**
     * @var AlphaNumericString_Length1To35 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyLongName
     * @access public
     */
    public $companyLongName = null;

    /**
     * @var AlphaNumericString_Length1To15 $profileReference
     * @access public
     */
    public $profileReference = null;

}

class CompanyInformationType_130639S {

    /**
     * @var AlphaNumericString_Length1To35 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyLongName
     * @access public
     */
    public $companyLongName = null;

    /**
     * @var AlphaNumericString_Length1To6 $profileReference
     * @access public
     */
    public $profileReference = null;

}

class CompanyInformationType_132953S {

    /**
     * @var AlphaNumericString_Length1To3 $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     * @var AlphaNumericString_Length1To2 $companyCodeContext
     * @access public
     */
    public $companyCodeContext = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

}

class CompanyInformationType_132960S {

    /**
     * @var AlphaNumericString_Length1To3 $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyCodeContext
     * @access public
     */
    public $companyCodeContext = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

}

class CompanyInformationType_132975S {

    /**
     * @var AlphaNumericString_Length2To3 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var NumericInteger_Length2To4 $companyNumericCode
     * @access public
     */
    public $companyNumericCode = null;

}

class CompanyInformationType_133019S {

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

}

class CompanyInformationType_20151S {

    /**
     * @var AlphaNumericString_Length1To3 $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     * @var AlphaNumericString_Length3To3 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyName
     * @access public
     */
    public $companyName = null;

}

class CompanyInformationType_25420S {

    /**
     * @var AlphaNumericString_Length1To3 $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     * @var AlphaNumericString_Length1To4 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To32 $companyName
     * @access public
     */
    public $companyName = null;

}

class CompanyInformationType_79020S {

    /**
     * @var AlphaNumericString_Length1To35 $companyCode
     * @access public
     */
    public $companyCode = null;

}

class CompanyInformationType_83550S {

    /**
     * @var AlphaNumericString_Length3To3 $travelSector
     * @access public
     */
    public $travelSector = null;

    /**
     * @var AlphaNumericString_Length3To3 $companyCode
     * @access public
     */
    public $companyCode = null;

}

class CompanyInformationType_94554S {

    /**
     * @var AlphaNumericString_Length1To35 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To15 $companyNumericCode
     * @access public
     */
    public $companyNumericCode = null;

}

class CompensationType {

    /**
     * @var CardValidityType $compensationDetails
     * @access public
     */
    public $compensationDetails = null;

}

class ConsumerReferenceIdentificationType {

    /**
     * @var AMA_EDICodesetType_Length1to3 $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

}

class ConsumerReferenceInformationTypeI {

    /**
     * @var ConsumerReferenceIdentificationTypeI $customerReferences
     * @access public
     */
    public $customerReferences = null;

}

class ContactInformationDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $partyQualifier
     * @access public
     */
    public $partyQualifier = null;

    /**
     * @var AlphaNumericString_Length1To57 $comAddress
     * @access public
     */
    public $comAddress = null;

    /**
     * @var AlphaNumericString_Length1To3 $comChannelQualifier
     * @access public
     */
    public $comChannelQualifier = null;

}

class ContactInformationTypeU {

    /**
     * @var ContactInformationDetailsTypeU $contactInformation
     * @access public
     */
    public $contactInformation = null;

}

class CountryCodeListType {

    /**
     * @var AlphaNumericString_Length1To2 $destinationCountryCode
     * @access public
     */
    public $destinationCountryCode = null;

}

class CountrySubEntityDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To2 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To25 $name
     * @access public
     */
    public $name = null;

}

class CountrySubEntityDetailsTypeU_187667C {

    /**
     * @var AlphaNumericString_Length1To9 $code
     * @access public
     */
    public $code = null;

}

class CountrySubEntityDetailsTypeU_188109C {

    /**
     * @var AlphaNumericString_Length1To9 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To17 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $agency
     * @access public
     */
    public $agency = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

}

class CountrySubEntityDetailsTypeU_192857C {

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

}

class CountrydescriptionType {

    /**
     * @var AlphaNumericString_Length1To35 $geographicalZone
     * @access public
     */
    public $geographicalZone = null;

    /**
     * @var AlphaNumericString_Length1To2 $countryCode
     * @access public
     */
    public $countryCode = null;

}

class CouponInformationDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To6 $cpnNumber
     * @access public
     */
    public $cpnNumber = null;

}

class CouponInformationTypeI {

    /**
     * @var CouponInformationDetailsTypeI $couponDetails
     * @access public
     */
    public $couponDetails = null;

}

class CreditCardDataGroupType {

    /**
     * @var CreditCardDataType $creditCardDetails
     * @access public
     */
    public $creditCardDetails = null;

    /**
     * @var ReferenceInformationTypeI_79009S $fortknoxIds
     * @access public
     */
    public $fortknoxIds = null;

    /**
     * @var AddressType_94501S $cardHolderAddress
     * @access public
     */
    public $cardHolderAddress = null;

}

class CreditCardDataType {

    /**
     * @var CreditCardInformationType $ccInfo
     * @access public
     */
    public $ccInfo = null;

}

class CreditCardInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To2 $name
     * @access public
     */
    public $name = null;

    /**
     * @var NumericInteger_Length1To20 $cardNumber
     * @access public
     */
    public $cardNumber = null;

    /**
     * @var AlphaNumericString_Length1To6 $expireDate
     * @access public
     */
    public $expireDate = null;

}

class CreditCardInformationType {

    /**
     * @var AlphaNumericString_Length2To2 $vendorCode
     * @access public
     */
    public $vendorCode = null;

    /**
     * @var AlphaNumericString_Length1To25 $vendorCodeSubType
     * @access public
     */
    public $vendorCodeSubType = null;

    /**
     * @var AlphaNumericString_Length1To19 $cardNumber
     * @access public
     */
    public $cardNumber = null;

    /**
     * @var AlphaNumericString_Length1To4 $securityId
     * @access public
     */
    public $securityId = null;

    /**
     * @var Date_MMYY $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     * @var Date_MMYY $startDate
     * @access public
     */
    public $startDate = null;

    /**
     * @var Date_MMYY $endDate
     * @access public
     */
    public $endDate = null;

    /**
     * @var AlphaNumericString_Length1To99 $ccHolderName
     * @access public
     */
    public $ccHolderName = null;

    /**
     * @var AlphaNumericString_Length2To3 $issuingBankName
     * @access public
     */
    public $issuingBankName = null;

    /**
     * @var AlphaNumericString_Length1To3 $cardCountryOfIssuance
     * @access public
     */
    public $cardCountryOfIssuance = null;

    /**
     * @var NumericInteger_Length1To3 $issueNumber
     * @access public
     */
    public $issueNumber = null;

    /**
     * @var AlphaNumericString_Length1To64 $issuingBankLongName
     * @access public
     */
    public $issuingBankLongName = null;

    /**
     * @var AlphaNumericString_Length0To108 $track1
     * @access public
     */
    public $track1 = null;

    /**
     * @var AlphaNumericString_Length0To56 $track2
     * @access public
     */
    public $track2 = null;

    /**
     * @var AlphaNumericString_Length0To144 $track3
     * @access public
     */
    public $track3 = null;

    /**
     * @var AlphaNumericString_Length1To100 $pinCode
     * @access public
     */
    public $pinCode = null;

    /**
     * @var AlphaNumericString_Length1To400 $rawTrackData
     * @access public
     */
    public $rawTrackData = null;

}

class CreditCardSecurityType {

    /**
     * @var AuthenticationDataType $authenticationDataDetails
     * @access public
     */
    public $authenticationDataDetails = null;

}

class CreditCardStatusGroupType {

    /**
     * @var SpecificVisaLinkCreditCardInformationType $authorisationSupplementaryData
     * @access public
     */
    public $authorisationSupplementaryData = null;

    /**
     * @var GenericAuthorisationResultType $approvalDetails
     * @access public
     */
    public $approvalDetails = null;

    /**
     * @var StructuredDateTimeInformationType_94516S $localDateTime
     * @access public
     */
    public $localDateTime = null;

    /**
     * @var TransactionInformationForTicketingType $authorisationInformation
     * @access public
     */
    public $authorisationInformation = null;

    /**
     * @var browserData $browserData
     * @access public
     */
    public $browserData = null;

    /**
     * @var ThreeDomainSecureGroupType $tdsInformation
     * @access public
     */
    public $tdsInformation = null;

    /**
     * @var AttributeType_94514S $cardSupplementaryData
     * @access public
     */
    public $cardSupplementaryData = null;

    /**
     * @var ErrorGroupType $transactionStatus
     * @access public
     */
    public $transactionStatus = null;

}

class browserData {

    /**
     * @var BrowserInformationType $browserProperties
     * @access public
     */
    public $browserProperties = null;

    /**
     * @var FreeTextInformationType_94526S $freeFlowBrowserData
     * @access public
     */
    public $freeFlowBrowserData = null;

}

class CreditCardType {

    /**
     * @var AlphaNumericString_Length1To3 $creditCardCompany
     * @access public
     */
    public $creditCardCompany = null;

    /**
     * @var AlphaNumericString_Length1To20 $creditCardNumber
     * @access public
     */
    public $creditCardNumber = null;

    /**
     * @var Date_MMYY $expirationDate
     * @access public
     */
    public $expirationDate = null;

}

class CruiseBusinessDataType {

    /**
     * @var ShipIdentificationType_132957S $sailingShipInformation
     * @access public
     */
    public $sailingShipInformation = null;

    /**
     * @var CompanyInformationType_132953S $sailingProviderInformation
     * @access public
     */
    public $sailingProviderInformation = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132955S $sailingPortsInformation
     * @access public
     */
    public $sailingPortsInformation = null;

    /**
     * @var StructuredPeriodInformationType_128716S $sailingDateInformation
     * @access public
     */
    public $sailingDateInformation = null;

    /**
     * @var TravellerInformationTypeI_132959S $passengerInfo
     * @access public
     */
    public $passengerInfo = null;

    /**
     * @var bookingDetails $bookingDetails
     * @access public
     */
    public $bookingDetails = null;

    /**
     * @var StructuredDateTimeInformationType_132956S $bookingDate
     * @access public
     */
    public $bookingDate = null;

    /**
     * @var ItemReferencesAndVersionsType_132954S $sailingGroupInformation
     * @access public
     */
    public $sailingGroupInformation = null;

}

class bookingDetails {

    /**
     * @var ReservationControlInformationTypeI_132961S $cruiseBookingReferenceInfo
     * @access public
     */
    public $cruiseBookingReferenceInfo = null;

    /**
     * @var CompanyInformationType_132960S $bookingCompany
     * @access public
     */
    public $bookingCompany = null;

}

class CruiseBusinessDataType_38250G {

    /**
     * @var ShipIdentificationType_132957S $sailingShipInformation
     * @access public
     */
    public $sailingShipInformation = null;

    /**
     * @var CompanyInformationType_132953S $sailingProviderInformation
     * @access public
     */
    public $sailingProviderInformation = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132955S $sailingPortsInformation
     * @access public
     */
    public $sailingPortsInformation = null;

    /**
     * @var StructuredPeriodInformationType_8955S $sailingDateInformation
     * @access public
     */
    public $sailingDateInformation = null;

    /**
     * @var TravellerInformationTypeI_132959S $passengerInfo
     * @access public
     */
    public $passengerInfo = null;

    /**
     * @var bookingDetails $bookingDetails
     * @access public
     */
    public $bookingDetails = null;

    /**
     * @var StructuredDateTimeInformationType_20645S $bookingDate
     * @access public
     */
    public $bookingDate = null;

    /**
     * @var ItemReferencesAndVersionsType_132954S $sailingGroupInformation
     * @access public
     */
    public $sailingGroupInformation = null;

}

class CruiseExtendedContentType {

    /**
     * @var ShipIdentificationType $sailingShipInformation
     * @access public
     */
    public $sailingShipInformation = null;

    /**
     * @var sailingdetails $sailingdetails
     * @access public
     */
    public $sailingdetails = null;

    /**
     * @var PlaceLocationIdentificationType_128824S $sailingPortsInformation
     * @access public
     */
    public $sailingPortsInformation = null;

    /**
     * @var ItemReferencesAndVersionsType $cruiseNumber
     * @access public
     */
    public $cruiseNumber = null;

    /**
     * @var CabinDescriptionType $cabinDescription
     * @access public
     */
    public $cabinDescription = null;

    /**
     * @var StructuredDateTimeInformationType_128714S $bookingDate
     * @access public
     */
    public $bookingDate = null;

    /**
     * @var ticketdetailsgroup $ticketdetailsgroup
     * @access public
     */
    public $ticketdetailsgroup = null;

}

class sailingdetails {

    /**
     * @var StructuredPeriodInformationType_128716S $sailingDateInformation
     * @access public
     */
    public $sailingDateInformation = null;

    /**
     * @var StructuredDateTimeInformationType_128714S $checkintimeInfo
     * @access public
     */
    public $checkintimeInfo = null;

}

class ticketdetailsgroup {

    /**
     * @var TicketNumberType_128754S $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

    /**
     * @var StructuredDateTimeInformationType_128714S $ticketIssuancedate
     * @access public
     */
    public $ticketIssuancedate = null;

}

class CustomerTransactionDataType {

    /**
     * @var PointOfSaleDataTypeI $pos
     * @access public
     */
    public $pos = null;

    /**
     * @var OtherSegmentDataTypeI $flight
     * @access public
     */
    public $flight = null;

    /**
     * @var NumericInteger_Length1To2 $connection
     * @access public
     */
    public $connection = null;

    /**
     * @var CodeshareFlightDataTypeI $codeShare
     * @access public
     */
    public $codeShare = null;

}

class DataInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class DataInformationTypeI_188173C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var NumericInteger_Length1To2 $value
     * @access public
     */
    public $value = null;

}

class DataTypeInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class DateAndTimeDetailsTypeI_137003C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To6 $date
     * @access public
     */
    public $date = null;

    /**
     * @var Time24_HHMM $time
     * @access public
     */
    public $time = null;

}

class DateAndTimeDetailsTypeI_171497C {

    /**
     * @var Date_DDMMYY $firstDate
     * @access public
     */
    public $firstDate = null;

    /**
     * @var AlphaNumericString_Length1To3 $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var AlphaNumericString_Length1To3 $locationIdentification
     * @access public
     */
    public $locationIdentification = null;

}

class DateAndTimeDetailsTypeI_192799C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var Time24_HHMM $time
     * @access public
     */
    public $time = null;

}

class DateAndTimeDetailsTypeI_193059C {

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

}

class DateAndTimeDetailsTypeI_56946C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To8 $date
     * @access public
     */
    public $date = null;

}

class DateAndTimeInformationTypeI_132896S {

    /**
     * @var DateAndTimeDetailsTypeI_192799C $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class DateAndTimeInformationTypeI_133069S {

    /**
     * @var DateAndTimeDetailsTypeI_193059C $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class DateAndTimeInformationTypeI_79021S {

    /**
     * @var DateAndTimeDetailsTypeI $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class DateAndTimeInformationTypeI_90801S {

    /**
     * @var DateAndTimeDetailsTypeI_137003C $dateAndTimeDetails
     * @access public
     */
    public $dateAndTimeDetails = null;

}

class DateRangeType {

    /**
     * @var NumericInteger_Length1To1 $dateRangeNum
     * @access public
     */
    public $dateRangeNum = null;

}

class DeckType {

    /**
     * @var AlphaNumericString_Length1To30 $deckId
     * @access public
     */
    public $deckId = null;

    /**
     * @var AlphaNumericString_Length1To3 $deckCode
     * @access public
     */
    public $deckCode = null;

}

class DetailedPaymentDataType {

    /**
     * @var FormOfPaymentType $fopInformation
     * @access public
     */
    public $fopInformation = null;

    /**
     * @var DummySegmentTypeI $dummy
     * @access public
     */
    public $dummy = null;

    /**
     * @var CreditCardStatusGroupType $creditCardDetailedData
     * @access public
     */
    public $creditCardDetailedData = null;

}

class DeviceControlDetailsType {

    /**
     * @var IdentificationNumberTypeI $deviceIdentification
     * @access public
     */
    public $deviceIdentification = null;

}

class DiagnosisTypeU {

    /**
     * @var AlphaNumericString_Length1To25 $billingDetails
     * @access public
     */
    public $billingDetails = null;

    /**
     * @var AlphaNumericString_Length1To3 $billingQualifier
     * @access public
     */
    public $billingQualifier = null;

}

class DiningIdentificationType {

    /**
     * @var AlphaNumericString_Length1To16 $diningDescription
     * @access public
     */
    public $diningDescription = null;

}

class DiningInformationType {

    /**
     * @var DiningIdentificationType $diningIdentification
     * @access public
     */
    public $diningIdentification = null;

}

class DiscountInformationDetailsType {

    /**
     * @var AlphaNumericString_Length1To6 $discountCode
     * @access public
     */
    public $discountCode = null;

}

class DiscountInformationDetailsType_141679C {

    /**
     * @var AlphaNumericString_Length1To6 $discountCode
     * @access public
     */
    public $discountCode = null;

    /**
     * @var NumericInteger_Length1To8 $percentage
     * @access public
     */
    public $percentage = null;

    /**
     * @var AlphaNumericString_Length1To35 $beneficiary
     * @access public
     */
    public $beneficiary = null;

    /**
     * @var NumericInteger_Length1To15 $unitQuantity
     * @access public
     */
    public $unitQuantity = null;

}

class DiscountInformationType {

    /**
     * @var AlphaNumericString_Length1To6 $adjustmentReason
     * @access public
     */
    public $adjustmentReason = null;

    /**
     * @var NumericInteger_Length2To2 $percentage
     * @access public
     */
    public $percentage = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var AlphaNumericString_Length1To7 $staffNumber
     * @access public
     */
    public $staffNumber = null;

    /**
     * @var AlphaString_Length1To30 $staffName
     * @access public
     */
    public $staffName = null;

}

class DiscountInformationType_94068S {

    /**
     * @var DiscountInformationDetailsType_141679C $discountDetails
     * @access public
     */
    public $discountDetails = null;

    /**
     * @var DiscountInformationDetailsType_141679C $otherDiscountDetails
     * @access public
     */
    public $otherDiscountDetails = null;

}

class DistributionChannelType {

    /**
     * @var NumericInteger_Length1To3 $distributionChannelField
     * @access public
     */
    public $distributionChannelField = null;

    /**
     * @var NumericInteger_Length1To3 $subGroup
     * @access public
     */
    public $subGroup = null;

    /**
     * @var NumericInteger_Length1To3 $accessType
     * @access public
     */
    public $accessType = null;

}

class DocumentDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To35 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var AlphaNumericString_Length1To8 $date
     * @access public
     */
    public $date = null;

}

class DocumentDetailsTypeI_19732C {

    /**
     * @var NumericInteger_Length10To10 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

}

class DocumentDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To20 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryOfIssue
     * @access public
     */
    public $countryOfIssue = null;

    /**
     * @var AlphaNumericString_Length1To8 $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     * @var AlphaNumericString_Length1To8 $issueDate
     * @access public
     */
    public $issueDate = null;

}

class DocumentInformationDetailsTypeI {

    /**
     * @var DocumentDetailsTypeI $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class DocumentInformationDetailsTypeI_9936S {

    /**
     * @var DocumentDetailsTypeI_19732C $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class DocumentInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $typeOfDocument
     * @access public
     */
    public $typeOfDocument = null;

    /**
     * @var AlphaNumericString_Length1To20 $documentNumber
     * @access public
     */
    public $documentNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryOfIssue
     * @access public
     */
    public $countryOfIssue = null;

}

class ElementManagementSegmentType {

    /**
     * @var ReferencingDetailsType_152449C $reference
     * @access public
     */
    public $reference = null;

}

class ElementManagementSegmentType_127983S {

    /**
     * @var ReferencingDetailsType_127526C $elementReference
     * @access public
     */
    public $elementReference = null;

    /**
     * @var AlphaNumericString_Length1To3 $segmentName
     * @access public
     */
    public $segmentName = null;

    /**
     * @var NumericInteger_Length1To3 $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class ElementManagementSegmentType_132840S {

    /**
     * @var ReferencingDetailsType_127526C $reference
     * @access public
     */
    public $reference = null;

}

class ElementManagementSegmentType_132897S {

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var ReferencingDetailsType_127526C $elementReference
     * @access public
     */
    public $elementReference = null;

    /**
     * @var AlphaNumericString_Length1To3 $segmentName
     * @access public
     */
    public $segmentName = null;

    /**
     * @var NumericInteger_Length1To3 $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class EnhancedTravellerInformationType {

    /**
     * @var TravellerNameInfoType $travellerNameInfo
     * @access public
     */
    public $travellerNameInfo = null;

    /**
     * @var TravellerNameDetailsType $otherPaxNamesDetails
     * @access public
     */
    public $otherPaxNamesDetails = null;

}

class EquipmentDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var EquipmentTypeAndSizeTypeU $sizeTypeDetails
     * @access public
     */
    public $sizeTypeDetails = null;

}

class EquipmentTypeAndSizeTypeU {

    /**
     * @var AlphaNumericString_Length1To35 $description
     * @access public
     */
    public $description = null;

}

class ErrorGroupType {

    /**
     * @var ApplicationErrorInformationType $errorOrWarningCodeDetails
     * @access public
     */
    public $errorOrWarningCodeDetails = null;

    /**
     * @var FreeTextInformationType $errorWarningDescription
     * @access public
     */
    public $errorWarningDescription = null;

}

class ExcessBaggageDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

}

class ExcessBaggageTypeI {

    /**
     * @var ExcessBaggageDetailsTypeI $excessBaggageDetails
     * @access public
     */
    public $excessBaggageDetails = null;

    /**
     * @var BaggageDetailsTypeI $baggageDetails
     * @access public
     */
    public $baggageDetails = null;

}

class ExtendedContentFerryLegDescriptionType {

    /**
     * @var CabinDescriptionType $cabinDescription
     * @access public
     */
    public $cabinDescription = null;

    /**
     * @var QuantityType $mileageInfo
     * @access public
     */
    public $mileageInfo = null;

    /**
     * @var ticketInfogroup $ticketInfogroup
     * @access public
     */
    public $ticketInfogroup = null;

    /**
     * @var FerryLegDescriptionType $itineraryInfoGroup
     * @access public
     */
    public $itineraryInfoGroup = null;

    /**
     * @var FerryAccomodationPackageDescriptionType $accomodationPackageInfoGroup
     * @access public
     */
    public $accomodationPackageInfoGroup = null;

}

class ticketInfogroup {

    /**
     * @var TicketNumberType_128754S $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

    /**
     * @var StructuredDateTimeInformationType_128730S $dateInfo
     * @access public
     */
    public $dateInfo = null;

}

class ExtendedContentType {

    /**
     * @var NumericInteger_Length1To3 $ecOrigin
     * @access public
     */
    public $ecOrigin = null;

    /**
     * @var ReferencingDetailsType_188870C $reference
     * @access public
     */
    public $reference = null;

    /**
     * @var AlphaNumericString_Length1To3 $productType
     * @access public
     */
    public $productType = null;

    /**
     * @var NumericInteger_Length1To3 $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class ExtendedOwnershipSecurityDetailsType {

    /**
     * @var ExtendedSecurityDetailsType $securityDetails
     * @access public
     */
    public $securityDetails = null;

}

class ExtendedRemarkType {

    /**
     * @var MiscellaneousRemarkType_210664C $structuredRemark
     * @access public
     */
    public $structuredRemark = null;

}

class ExtendedSecurityDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $typeOfEntity
     * @access public
     */
    public $typeOfEntity = null;

    /**
     * @var AlphaNumericString_Length1To1 $accessMode
     * @access public
     */
    public $accessMode = null;

    /**
     * @var AlphaNumericString_Length1To9 $inhouseIdentification
     * @access public
     */
    public $inhouseIdentification = null;

}

class FLIXType {

    /**
     * @var ItemDescriptionType $flixAndSourceTypes
     * @access public
     */
    public $flixAndSourceTypes = null;

    /**
     * @var FreeTextInformationType_128813S $flixComment
     * @access public
     */
    public $flixComment = null;

    /**
     * @var airportGroup $airportGroup
     * @access public
     */
    public $airportGroup = null;

}

class airportGroup {

    /**
     * @var TerminalTimeInformationTypeS $impactedAirport
     * @access public
     */
    public $impactedAirport = null;

}

class FareBasisCodesLineType {

    /**
     * @var FareElementType $fareElement
     * @access public
     */
    public $fareElement = null;

}

class FareCategoryCodesType {

    /**
     * @var AlphaNumericString_Length1To20 $fareType
     * @access public
     */
    public $fareType = null;

}

class FareDataType {

    /**
     * @var AlphaNumericString_Length1To1 $issueIdentifier
     * @access public
     */
    public $issueIdentifier = null;

    /**
     * @var MonetaryInformationDetailsTypeI_8308C $monetaryInfo
     * @access public
     */
    public $monetaryInfo = null;

    /**
     * @var TaxFieldsType $taxFields
     * @access public
     */
    public $taxFields = null;

}

class FareElementType {

    /**
     * @var AlphaNumericString_Length1To3 $primaryCode
     * @access public
     */
    public $primaryCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $connection
     * @access public
     */
    public $connection = null;

    /**
     * @var AlphaNumericString_Length6To6 $notValidBefore
     * @access public
     */
    public $notValidBefore = null;

    /**
     * @var AlphaNumericString_Length6To6 $notValidAfter
     * @access public
     */
    public $notValidAfter = null;

    /**
     * @var AlphaNumericString_Length2To3 $baggageAllowance
     * @access public
     */
    public $baggageAllowance = null;

    /**
     * @var AlphaNumericString_Length1To6 $fareBasis
     * @access public
     */
    public $fareBasis = null;

    /**
     * @var AlphaNumericString_Length1To6 $ticketDesignator
     * @access public
     */
    public $ticketDesignator = null;

}

class FareQualifierDetailsTypeI {

    /**
     * @var FareCategoryCodesTypeI $fareCategories
     * @access public
     */
    public $fareCategories = null;

}

class FerryAccomodationPackageDescriptionType {

    /**
     * @var ProductInformationTypeI $packageCode
     * @access public
     */
    public $packageCode = null;

    /**
     * @var HotelPropertyType_129121S $hotelInformation
     * @access public
     */
    public $hotelInformation = null;

    /**
     * @var StructuredDateTimeInformationType_128682S $hotelCheckInInformation
     * @access public
     */
    public $hotelCheckInInformation = null;

    /**
     * @var PlaceLocationIdentificationTypeU $areaCodeInfo
     * @access public
     */
    public $areaCodeInfo = null;

    /**
     * @var NumberOfUnitsType_129120S $numberOfNights
     * @access public
     */
    public $numberOfNights = null;

    /**
     * @var TariffInformationTypeU $hotelItemPrice
     * @access public
     */
    public $hotelItemPrice = null;

    /**
     * @var roomInfoGroup $roomInfoGroup
     * @access public
     */
    public $roomInfoGroup = null;

}

class roomInfoGroup {

    /**
     * @var HotelRoomType_129126S $roomDetailsInformation
     * @access public
     */
    public $roomDetailsInformation = null;

    /**
     * @var NumberOfUnitsType_20156S $numberOfRooms
     * @access public
     */
    public $numberOfRooms = null;

}

class FerryAccomodationPackageDescriptionType_39395G {

    /**
     * @var ProductInformationTypeI_20557S $packageCode
     * @access public
     */
    public $packageCode = null;

    /**
     * @var HotelPropertyType_26378S $hotelInformation
     * @access public
     */
    public $hotelInformation = null;

    /**
     * @var StructuredDateTimeInformationType_132956S $hotelCheckInInformation
     * @access public
     */
    public $hotelCheckInInformation = null;

    /**
     * @var PlaceLocationIdentificationTypeU_24573S $areaCodeInfo
     * @access public
     */
    public $areaCodeInfo = null;

    /**
     * @var NumberOfUnitsType_20156S $numberOfNights
     * @access public
     */
    public $numberOfNights = null;

    /**
     * @var TariffInformationTypeU_129133S $hotelItemPrice
     * @access public
     */
    public $hotelItemPrice = null;

    /**
     * @var roomInfoGroup $roomInfoGroup
     * @access public
     */
    public $roomInfoGroup = null;

}

class FerryBookingDescriptionType {

    /**
     * @var CompanyInformationType_20151S $ferryProviderInformation
     * @access public
     */
    public $ferryProviderInformation = null;

    /**
     * @var FerryLegDescriptionType_36378G $itineraryInfoGroup
     * @access public
     */
    public $itineraryInfoGroup = null;

    /**
     * @var FerryAccomodationPackageDescriptionType_39395G $accomodationPackageInfoGroup
     * @access public
     */
    public $accomodationPackageInfoGroup = null;

    /**
     * @var ReservationControlInformationTypeI_20153S $bookingNumberInformation
     * @access public
     */
    public $bookingNumberInformation = null;

}

class FerryLegDescriptionType {

    /**
     * @var TravelProductInformationTypeU $sailingDetails
     * @access public
     */
    public $sailingDetails = null;

    /**
     * @var ShipIdentificationType $shipDescription
     * @access public
     */
    public $shipDescription = null;

    /**
     * @var StructuredDateTimeInformationType_129128S $sailingLegCheckInInformation
     * @access public
     */
    public $sailingLegCheckInInformation = null;

    /**
     * @var ReferenceInformationTypeI_129127S $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     * @var priceInfoGroup $priceInfoGroup
     * @access public
     */
    public $priceInfoGroup = null;

    /**
     * @var vehicleInfoGroup $vehicleInfoGroup
     * @access public
     */
    public $vehicleInfoGroup = null;

    /**
     * @var serviceInfoGroup $serviceInfoGroup
     * @access public
     */
    public $serviceInfoGroup = null;

    /**
     * @var animalInfoGroup $animalInfoGroup
     * @access public
     */
    public $animalInfoGroup = null;

}

class priceInfoGroup {

    /**
     * @var TariffInformationTypeU_129133S $routePriceInformation
     * @access public
     */
    public $routePriceInformation = null;

    /**
     * @var AttributeTypeU $passengerCategoryType
     * @access public
     */
    public $passengerCategoryType = null;

    /**
     * @var NumberOfUnitsType_20156S $numberOfPassengers
     * @access public
     */
    public $numberOfPassengers = null;

}

class vehicleInfoGroup {

    /**
     * @var VehicleTypeU $vehicleInformation
     * @access public
     */
    public $vehicleInformation = null;

    /**
     * @var NumberOfUnitsType_20156S $numberOfBicycles
     * @access public
     */
    public $numberOfBicycles = null;

    /**
     * @var TariffInformationTypeU_129133S $vehicleRoutePrice
     * @access public
     */
    public $vehicleRoutePrice = null;

}

class serviceInfoGroup {

    /**
     * @var AttributeTypeU_20529S $serviceInformation
     * @access public
     */
    public $serviceInformation = null;

    /**
     * @var NumberOfUnitsType_20156S $numberOfServices
     * @access public
     */
    public $numberOfServices = null;

    /**
     * @var TariffInformationTypeU_129133S $serviceRoutePrice
     * @access public
     */
    public $serviceRoutePrice = null;

}

class animalInfoGroup {

    /**
     * @var SpecificDataInformationTypeI $animalInformation
     * @access public
     */
    public $animalInformation = null;

    /**
     * @var TariffInformationTypeU_129133S $animalRoutePrice
     * @access public
     */
    public $animalRoutePrice = null;

}

class FerryLegDescriptionType_36378G {

    /**
     * @var TravelProductInformationTypeU_24954S $sailingDetails
     * @access public
     */
    public $sailingDetails = null;

    /**
     * @var ShipIdentificationType_24553S $shipDescription
     * @access public
     */
    public $shipDescription = null;

    /**
     * @var StructuredDateTimeInformationType_21109S $sailingLegCheckInInformation
     * @access public
     */
    public $sailingLegCheckInInformation = null;

    /**
     * @var ReferenceInformationTypeI_25132S $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     * @var priceInfoGroup $priceInfoGroup
     * @access public
     */
    public $priceInfoGroup = null;

    /**
     * @var vehicleInfoGroup $vehicleInfoGroup
     * @access public
     */
    public $vehicleInfoGroup = null;

    /**
     * @var serviceInfoGroup $serviceInfoGroup
     * @access public
     */
    public $serviceInfoGroup = null;

    /**
     * @var animalInfoGroup $animalInfoGroup
     * @access public
     */
    public $animalInfoGroup = null;

}

class FlightSegmentDetailsTypeI {
    
}

class FormOfPaymentDetailsTypeI_192833C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $vendorCode
     * @access public
     */
    public $vendorCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $creditCardNumber
     * @access public
     */
    public $creditCardNumber = null;

    /**
     * @var AlphaNumericString_Length1To4 $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     * @var AlphaNumericString_Length1To3 $extendedPayment
     * @access public
     */
    public $extendedPayment = null;

    /**
     * @var AlphaNumericString_Length1To70 $fopFreeText
     * @access public
     */
    public $fopFreeText = null;

}

class FormOfPaymentDetailsTypeI_20667C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To35 $vendorCode
     * @access public
     */
    public $vendorCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $creditCardNumber
     * @access public
     */
    public $creditCardNumber = null;

    /**
     * @var AlphaNumericString_Length1To4 $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     * @var AlphaNumericString_Length1To17 $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $sourceOfApproval
     * @access public
     */
    public $sourceOfApproval = null;

    /**
     * @var NumericDecimal_Length1To18 $authorisedAmount
     * @access public
     */
    public $authorisedAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $addressVerification
     * @access public
     */
    public $addressVerification = null;

    /**
     * @var AlphaNumericString_Length1To35 $customerAccount
     * @access public
     */
    public $customerAccount = null;

    /**
     * @var AlphaNumericString_Length1To3 $extendedPayment
     * @access public
     */
    public $extendedPayment = null;

    /**
     * @var AlphaNumericString_Length1To70 $fopFreeText
     * @access public
     */
    public $fopFreeText = null;

    /**
     * @var AlphaNumericString_Length1To3 $membershipStatus
     * @access public
     */
    public $membershipStatus = null;

    /**
     * @var AlphaNumericString_Length1To35 $transactionInfo
     * @access public
     */
    public $transactionInfo = null;

}

class FormOfPaymentDetailsType {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

}

class FormOfPaymentInformationType {

    /**
     * @var AlphaNumericString_Length1To20 $fopCode
     * @access public
     */
    public $fopCode = null;

    /**
     * @var AlphaNumericString_Length1To20 $fopMapTable
     * @access public
     */
    public $fopMapTable = null;

    /**
     * @var AlphaNumericString_Length1To20 $fopBillingCode
     * @access public
     */
    public $fopBillingCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $fopStatus
     * @access public
     */
    public $fopStatus = null;

    /**
     * @var AlphaNumericString_Length1To20 $fopEdiCode
     * @access public
     */
    public $fopEdiCode = null;

    /**
     * @var AlphaNumericString_Length1To20 $fopReportingCode
     * @access public
     */
    public $fopReportingCode = null;

    /**
     * @var AlphaNumericString_Length1To20 $fopPrintedCode
     * @access public
     */
    public $fopPrintedCode = null;

    /**
     * @var AlphaNumericString_Length1To20 $fopElecTicketingCode
     * @access public
     */
    public $fopElecTicketingCode = null;

}

class FormOfPaymentTypeI_133015S {

    /**
     * @var FormOfPaymentDetailsTypeI $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class FormOfPaymentTypeI_16862S {

    /**
     * @var FormOfPaymentDetailsTypeI_20667C $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     * @var FormOfPaymentDetailsTypeI_20667C $otherFormOfPayment
     * @access public
     */
    public $otherFormOfPayment = null;

}

class FormOfPaymentType {

    /**
     * @var FormOfPaymentDetailsType $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class FraudScreeningGroupType {

    /**
     * @var StatusType_94568S $fraudScreening
     * @access public
     */
    public $fraudScreening = null;

    /**
     * @var DeviceControlDetailsType $ipAdress
     * @access public
     */
    public $ipAdress = null;

    /**
     * @var CommunicationContactType $merchantURL
     * @access public
     */
    public $merchantURL = null;

    /**
     * @var PhoneAndEmailAddressType_94565S $payerPhoneOrEmail
     * @access public
     */
    public $payerPhoneOrEmail = null;

    /**
     * @var SystemDetailsInfoType_94569S $shopperSession
     * @access public
     */
    public $shopperSession = null;

    /**
     * @var TravellerInformationType_94570S $payerName
     * @access public
     */
    public $payerName = null;

    /**
     * @var StructuredDateTimeInformationType_94567S $payerDateOfBirth
     * @access public
     */
    public $payerDateOfBirth = null;

    /**
     * @var AddressType_94501S $billingAddress
     * @access public
     */
    public $billingAddress = null;

    /**
     * @var ReferenceInfoType_94566S $formOfIdDetails
     * @access public
     */
    public $formOfIdDetails = null;

}

class FreeTextDetailsType_1309C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextDetailsType_142141C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextDetailsType_187464C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextDetailsType_187592C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextDetailsType_192851C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextDetailsType_192967C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

}

class FreeTextDetailsType_46357C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class FreeTextInformationType_128665S {

    /**
     * @var FreeTextDetailsType_187464C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To64 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_128667S {

    /**
     * @var FreeTextDetailsType_187464C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To64 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_128778S {

    /**
     * @var FreeTextDetailsType_187464C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To199 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_128791S {

    /**
     * @var FreeTextDetailsType_187592C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To320 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_128813S {

    /**
     * @var FreeTextDetailsType_187464C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To320 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_129102S {

    /**
     * @var FreeTextDetailsType_187592C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To199 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_132934S {

    /**
     * @var FreeTextDetailsType_192851C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_132951S {

    /**
     * @var FreeTextDetailsType_192851C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_133008S {

    /**
     * @var FreeTextDetailsType_192967C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To64 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_133072S {

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_20551S {

    /**
     * @var FreeTextDetailsType $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To63 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_25445S {

    /**
     * @var FreeTextDetailsType_46357C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_29860S {

    /**
     * @var FreeTextDetailsType_187464C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To5 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_79018S {

    /**
     * @var FreeTextDetailsType $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To199 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_94495S {

    /**
     * @var FreeTextDetailsType $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To199 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_94526S {

    /**
     * @var FreeTextDetailsType_142141C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To199 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextInformationType_9865S {

    /**
     * @var FreeTextDetailsType_1309C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To500 $freeText
     * @access public
     */
    public $freeText = null;

}

class FreeTextQualificationTypeI_148295C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

}

class FreeTextQualificationTypeI_185754C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To35 $companyId
     * @access public
     */
    public $companyId = null;

}

class FreeTextQualificationTypeI_254609C {

    /**
     * @var AlphaNumericString_Length1To3 $textSubjectQualifier
     * @access public
     */
    public $textSubjectQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

}

class FreeTextQualificationType_187488C {

    /**
     * @var AlphaNumericString_Length1To3 $subjectQualifier
     * @access public
     */
    public $subjectQualifier = null;

}

class FrequencyDetailsTypeU {

    /**
     * @var NumericInteger_Length1To9 $instalmentsNumber
     * @access public
     */
    public $instalmentsNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $instalmentsFrequency
     * @access public
     */
    public $instalmentsFrequency = null;

    /**
     * @var AlphaNumericString_Length1To35 $instalmentsStartDate
     * @access public
     */
    public $instalmentsStartDate = null;

    /**
     * @var AlphaNumericString_Length1To3 $instalmentsDatrDateFormat
     * @access public
     */
    public $instalmentsDatrDateFormat = null;

}

class FrequencyTypeU {

    /**
     * @var FrequencyDetailsTypeU $extendedPaymentDetails
     * @access public
     */
    public $extendedPaymentDetails = null;

}

class FrequencyType_192845C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To1 $value
     * @access public
     */
    public $value = null;

}

class FrequentFlyerInformationGroupType {

    /**
     * @var FrequentTravellerIdentificationCodeType_74327S $frequentTravellerInfo
     * @access public
     */
    public $frequentTravellerInfo = null;

    /**
     * @var DiscountInformationType $discountInformation
     * @access public
     */
    public $discountInformation = null;

    /**
     * @var ProductInformationType $bookingClassInformation
     * @access public
     */
    public $bookingClassInformation = null;

}

class FrequentTravellerIdentificationCodeType_132997S {

    /**
     * @var FrequentTravellerIdentificationType $airlineFrequentTraveler
     * @access public
     */
    public $airlineFrequentTraveler = null;

    /**
     * @var FrequentTravellerIdentificationType_192940C $allianceFrequentTraveler
     * @access public
     */
    public $allianceFrequentTraveler = null;

}

class FrequentTravellerIdentificationCodeType_38226S {

    /**
     * @var FrequentTravellerIdentificationType $airlineFrequentTraveler
     * @access public
     */
    public $airlineFrequentTraveler = null;

    /**
     * @var FrequentTravellerIdentificationType_64816C $allianceFrequentTraveler
     * @access public
     */
    public $allianceFrequentTraveler = null;

}

class FrequentTravellerIdentificationCodeType_74327S {

    /**
     * @var FrequentTravellerIdentificationTypeI $frequentTraveler
     * @access public
     */
    public $frequentTraveler = null;

    /**
     * @var PriorityDetailsType $priorityDetails
     * @access public
     */
    public $priorityDetails = null;

    /**
     * @var ProductAccountDetailsTypeI $redemptionInformation
     * @access public
     */
    public $redemptionInformation = null;

}

class FrequentTravellerIdentificationTypeI {

    /**
     * @var AlphaNumericString_Length2To2 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To27 $membershipNumber
     * @access public
     */
    public $membershipNumber = null;

}

class FrequentTravellerIdentificationType_192834C {

    /**
     * @var AlphaNumericString_Length1To3 $company
     * @access public
     */
    public $company = null;

    /**
     * @var AlphaNumericString_Length1To28 $membershipNumber
     * @access public
     */
    public $membershipNumber = null;

}

class FrequentTravellerIdentificationType_192940C {

    /**
     * @var AlphaNumericString_Length4To4 $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     * @var AlphaNumericString_Length1To1 $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $tierDescription
     * @access public
     */
    public $tierDescription = null;

    /**
     * @var AlphaNumericString_Length2To3 $companyCode
     * @access public
     */
    public $companyCode = null;

}

class FrequentTravellerIdentificationType_64816C {

    /**
     * @var AlphaNumericString_Length1To4 $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     * @var AlphaNumericString_Length1To1 $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $tierDescription
     * @access public
     */
    public $tierDescription = null;

    /**
     * @var AlphaNumericString_Length2To3 $companyCode
     * @access public
     */
    public $companyCode = null;

}

class GategoryType {

    /**
     * @var NumericInteger_Length1To3 $categoryNum1
     * @access public
     */
    public $categoryNum1 = null;

    /**
     * @var AlphaNumericString_Length1To16 $categoryName
     * @access public
     */
    public $categoryName = null;

}

class GeneralOptionInformationType {

    /**
     * @var AlphaNumericString_Length1To4 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaString_Length1To1 $updateIndicator
     * @access public
     */
    public $updateIndicator = null;

    /**
     * @var AlphaNumericString_Length1To255 $freetext
     * @access public
     */
    public $freetext = null;

}

class GeneralOptionType {

    /**
     * @var GeneralOptionInformationType $optionDetail
     * @access public
     */
    public $optionDetail = null;

}

class GenericAuthorisationResultType {

    /**
     * @var AuthorizationApprovalDataType $approvalCodeData
     * @access public
     */
    public $approvalCodeData = null;

}

class GenericDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To2 $seatCharacteristic
     * @access public
     */
    public $seatCharacteristic = null;

}

class HotelFacilityType {

    /**
     * @var AlphaNumericString_Length1To3 $facilityCode
     * @access public
     */
    public $facilityCode = null;

}

class HotelProductInformationType {

    /**
     * @var HotelFacilityType $preferredAmenities
     * @access public
     */
    public $preferredAmenities = null;

}

class HotelProductInformationType_2052S {

    /**
     * @var PropertyHeaderDetailsType $property
     * @access public
     */
    public $property = null;

    /**
     * @var RoomDetailsType $hotelRoom
     * @access public
     */
    public $hotelRoom = null;

    /**
     * @var RateCodeRestrictedType $negotiated
     * @access public
     */
    public $negotiated = null;

    /**
     * @var OtherHotelInformationType $otherHotelInfo
     * @access public
     */
    public $otherHotelInfo = null;

}

class HotelPropertyType {

    /**
     * @var HotelUniqueIdType $hotelReference
     * @access public
     */
    public $hotelReference = null;

    /**
     * @var AlphaNumericString_Length1To40 $hotelName
     * @access public
     */
    public $hotelName = null;

    /**
     * @var AlphaNumericString_Length1To1 $fireSafetyIndicator
     * @access public
     */
    public $fireSafetyIndicator = null;

}

class HotelPropertyType_129118S {

    /**
     * @var HotelUniqueIdType_188138C $hotelReference
     * @access public
     */
    public $hotelReference = null;

    /**
     * @var AlphaNumericString_Length1To99 $hotelName
     * @access public
     */
    public $hotelName = null;

    /**
     * @var AlphaNumericString_Length1To1 $fireSafetyIndicator
     * @access public
     */
    public $fireSafetyIndicator = null;

}

class HotelPropertyType_129121S {

    /**
     * @var HotelUniqueIdType_188143C $hotelReference
     * @access public
     */
    public $hotelReference = null;

}

class HotelPropertyType_26378S {

    /**
     * @var HotelUniqueIdType_47769C $hotelReference
     * @access public
     */
    public $hotelReference = null;

}

class HotelRoomRateInformationType {

    /**
     * @var AlphaNumericString_Length3To3 $roomType
     * @access public
     */
    public $roomType = null;

    /**
     * @var AlphaNumericString_Length3To3 $ratePlanCode
     * @access public
     */
    public $ratePlanCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $rateCategoryCode
     * @access public
     */
    public $rateCategoryCode = null;

    /**
     * @var AlphaNumericString_Length1To1 $rateQualifiedIndic
     * @access public
     */
    public $rateQualifiedIndic = null;

}

class HotelRoomRateInformationType_188211C {

    /**
     * @var AlphaNumericString_Length3To3 $roomType
     * @access public
     */
    public $roomType = null;

    /**
     * @var AlphaNumericString_Length3To3 $ratePlanCode
     * @access public
     */
    public $ratePlanCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $rateCategoryCode
     * @access public
     */
    public $rateCategoryCode = null;

    /**
     * @var AlphaNumericString_Length1To1 $rateQualifiedIndic
     * @access public
     */
    public $rateQualifiedIndic = null;

}

class HotelRoomRateInformationType_46329C {

    /**
     * @var AlphaNumericString_Length1To3 $roomType
     * @access public
     */
    public $roomType = null;

}

class HotelRoomType {

    /**
     * @var HotelRoomRateInformationType $roomRateIdentifier
     * @access public
     */
    public $roomRateIdentifier = null;

    /**
     * @var AlphaNumericString_Length1To10 $bookingCode
     * @access public
     */
    public $bookingCode = null;

    /**
     * @var NumberOfUnitDetailsTypeI_18670C $guestCountDetails
     * @access public
     */
    public $guestCountDetails = null;

    /**
     * @var AlphaNumericString_Length1To8 $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class HotelRoomType_129126S {

    /**
     * @var AlphaNumericString_Length1To10 $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class HotelRoomType_129168S {

    /**
     * @var HotelRoomRateInformationType_188211C $roomRateIdentifier
     * @access public
     */
    public $roomRateIdentifier = null;

    /**
     * @var AlphaNumericString_Length1To10 $bookingCode
     * @access public
     */
    public $bookingCode = null;

    /**
     * @var NumberOfUnitDetailsTypeI_18670C $guestCountDetails
     * @access public
     */
    public $guestCountDetails = null;

    /**
     * @var AlphaNumericString_Length1To8 $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class HotelRoomType_133010S {

    /**
     * @var HotelRoomRateInformationType_188211C $roomRateIdentifier
     * @access public
     */
    public $roomRateIdentifier = null;

    /**
     * @var AlphaNumericString_Length1To10 $bookingCode
     * @access public
     */
    public $bookingCode = null;

    /**
     * @var NumberOfUnitDetailsTypeI_18670C $guestCountDetails
     * @access public
     */
    public $guestCountDetails = null;

    /**
     * @var AlphaNumericString_Length1To8 $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class HotelRoomType_25429S {

    /**
     * @var HotelRoomRateInformationType_46329C $roomRateIdentifier
     * @access public
     */
    public $roomRateIdentifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $bookingCode
     * @access public
     */
    public $bookingCode = null;

    /**
     * @var NumberOfUnitDetailsTypeI_46330C $guestCountDetails
     * @access public
     */
    public $guestCountDetails = null;

    /**
     * @var AlphaNumericString_Length1To16 $roomTypeOverride
     * @access public
     */
    public $roomTypeOverride = null;

}

class HotelUniqueIdType {

    /**
     * @var AlphaNumericString_Length2To3 $chainCode
     * @access public
     */
    public $chainCode = null;

    /**
     * @var AlphaNumericString_Length3To3 $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var AlphaNumericString_Length3To3 $hotelCode
     * @access public
     */
    public $hotelCode = null;

}

class HotelUniqueIdType_188138C {

    /**
     * @var AlphaNumericString_Length2To3 $chainCode
     * @access public
     */
    public $chainCode = null;

    /**
     * @var AlphaNumericString_Length3To3 $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var AlphaNumericString_Length3To3 $hotelCode
     * @access public
     */
    public $hotelCode = null;

}

class HotelUniqueIdType_188143C {

    /**
     * @var AlphaNumericString_Length1To35 $chainCode
     * @access public
     */
    public $chainCode = null;

    /**
     * @var AlphaNumericString_Length1To25 $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var AlphaNumericString_Length1To25 $hotelCode
     * @access public
     */
    public $hotelCode = null;

}

class HotelUniqueIdType_47769C {

    /**
     * @var AlphaNumericString_Length1To10 $hotelCode
     * @access public
     */
    public $hotelCode = null;

}

class IdentificationNumberTypeI {

    /**
     * @var AlphaNumericString_Length1To35 $address
     * @access public
     */
    public $address = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class InConnectionWithType {

    /**
     * @var TransportIdentifierType_79027S $carrier
     * @access public
     */
    public $carrier = null;

    /**
     * @var TicketNumberTypeI_79026S $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var CouponInformationTypeI $couponList
     * @access public
     */
    public $couponList = null;

}

class IndividualPnrSecurityInformationType {

    /**
     * @var IndividualSecurityType $security
     * @access public
     */
    public $security = null;

    /**
     * @var SecurityInformationType $securityInfo
     * @access public
     */
    public $securityInfo = null;

    /**
     * @var AlphaNumericString_Length1To1 $indicator
     * @access public
     */
    public $indicator = null;

}

class IndividualSecurityType {

    /**
     * @var AlphaNumericString_Length1To14 $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var AlphaString_Length1To1 $accessMode
     * @access public
     */
    public $accessMode = null;

}

class IndividualSecurityType_3194C {

    /**
     * @var AlphaNumericString_Length1To14 $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var AlphaString_Length1To1 $accessMode
     * @access public
     */
    public $accessMode = null;

}

class InsuranceBusinessDataType {

    /**
     * @var InsuranceProductDetailsType_133021S $providerProductDetails
     * @access public
     */
    public $providerProductDetails = null;

    /**
     * @var TravellerInformationTypeI $substiteName
     * @access public
     */
    public $substiteName = null;

    /**
     * @var MonetaryInformationTypeI $extraPremium
     * @access public
     */
    public $extraPremium = null;

    /**
     * @var productSection $productSection
     * @access public
     */
    public $productSection = null;

    /**
     * @var TariffInformationTypeI_133025S $planCostInfo
     * @access public
     */
    public $planCostInfo = null;

    /**
     * @var planTypeDetails $planTypeDetails
     * @access public
     */
    public $planTypeDetails = null;

    /**
     * @var contactDetails $contactDetails
     * @access public
     */
    public $contactDetails = null;

    /**
     * @var subscriberAddressSection $subscriberAddressSection
     * @access public
     */
    public $subscriberAddressSection = null;

    /**
     * @var coverageDetails $coverageDetails
     * @access public
     */
    public $coverageDetails = null;

    /**
     * @var CommissionInformationType $comissionAmount
     * @access public
     */
    public $comissionAmount = null;

    /**
     * @var insuranceFopSection $insuranceFopSection
     * @access public
     */
    public $insuranceFopSection = null;

    /**
     * @var ReservationControlInformationTypeI $confirmationNumber
     * @access public
     */
    public $confirmationNumber = null;

    /**
     * @var ActionDetailsTypeI $productKnowledge
     * @access public
     */
    public $productKnowledge = null;

    /**
     * @var passengerDetails $passengerDetails
     * @access public
     */
    public $passengerDetails = null;

    /**
     * @var DocumentInformationDetailsTypeI $printInformation
     * @access public
     */
    public $printInformation = null;

}

class insuranceFopSection {

    /**
     * @var FormOfPaymentTypeI_16862S $formOfPaymentSection
     * @access public
     */
    public $formOfPaymentSection = null;

    /**
     * @var StatusTypeI_13270S $fopExtendedData
     * @access public
     */
    public $fopExtendedData = null;

}

class InsuranceCoverageType {

    /**
     * @var AlphaString_Length1To2 $coverageIndicator
     * @access public
     */
    public $coverageIndicator = null;

}

class InsuranceCoverageType_133041S {

    /**
     * @var AlphaNumericString_Length0To2 $coverageIndicator
     * @access public
     */
    public $coverageIndicator = null;

}

class InsuranceCoverageType_25483S {

    /**
     * @var AlphaNumericString_Length1To2 $coverageIndicator
     * @access public
     */
    public $coverageIndicator = null;

}

class InsuranceNameType {

    /**
     * @var SpecificTravellerDetailsType $insuranceTravelerDetails
     * @access public
     */
    public $insuranceTravelerDetails = null;

    /**
     * @var TravelerPerpaxDetailsType $travelerPerpaxDetails
     * @access public
     */
    public $travelerPerpaxDetails = null;

}

class InsurancePolicyType {

    /**
     * @var AlphaNumericString_Length1To3 $fareDiscount
     * @access public
     */
    public $fareDiscount = null;

}

class InsuranceProductDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To2 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var ProviderInformationType $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var ProviderInformationType $extensionIdentification
     * @access public
     */
    public $extensionIdentification = null;

    /**
     * @var TariffcodeType $tariffCodeDetails
     * @access public
     */
    public $tariffCodeDetails = null;

}

class InsuranceProductDetailsType_128684S {

    /**
     * @var TariffcodeType $tariffCodeDetails
     * @access public
     */
    public $tariffCodeDetails = null;

}

class InsuranceProductDetailsType_129160S {

    /**
     * @var AlphaNumericString_Length1To35 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var ProviderInformationType_188200C $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var ProviderInformationType_188200C $extensionIdentification
     * @access public
     */
    public $extensionIdentification = null;

    /**
     * @var AlphaNumericString_Length1To60 $extraReference
     * @access public
     */
    public $extraReference = null;

    /**
     * @var TariffcodeType $tariffCodeDetails
     * @access public
     */
    public $tariffCodeDetails = null;

}

class InsuranceProductDetailsType_133021S {

    /**
     * @var AlphaNumericString_Length1To3 $companyCode
     * @access public
     */
    public $companyCode = null;

    /**
     * @var AlphaNumericString_Length1To2 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var AlphaNumericString_Length1To60 $extraReference
     * @access public
     */
    public $extraReference = null;

}

class InsuranceProviderAndProductsType {

    /**
     * @var AlphaNumericString_Length1To3 $tripType
     * @access public
     */
    public $tripType = null;

    /**
     * @var AlphaNumericString_Length1To4 $tourOperator
     * @access public
     */
    public $tourOperator = null;

    /**
     * @var CountrydescriptionType $countryInfo
     * @access public
     */
    public $countryInfo = null;

}

class InsuranceProviderAndProductsType_128668S {

    /**
     * @var AlphaNumericString_Length1To3 $tripType
     * @access public
     */
    public $tripType = null;

    /**
     * @var AlphaNumericString_Length1To3 $tourOperator
     * @access public
     */
    public $tourOperator = null;

    /**
     * @var CountrydescriptionType $countryInfo
     * @access public
     */
    public $countryInfo = null;

}

class InteractiveFreeTextTypeI {

    /**
     * @var FreeTextQualificationTypeI_185754C $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class InteractiveFreeTextTypeI_132924S {

    /**
     * @var FreeTextQualificationTypeI $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     * @var AlphaNumericString_Length1To70 $text
     * @access public
     */
    public $text = null;

}

class InteractiveFreeTextTypeI_99363S {

    /**
     * @var FreeTextQualificationTypeI_148295C $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var AlphaNumericString_Length1To70 $freeText
     * @access public
     */
    public $freeText = null;

}

class InternalIDDetailsType {

    /**
     * @var AlphaNumericString_Length1To20 $inhouseId
     * @access public
     */
    public $inhouseId = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $type
     * @access public
     */
    public $type = null;

}

class InventoryDataType {

    /**
     * @var SegmentCabinIdentificationType $cabinInformation
     * @access public
     */
    public $cabinInformation = null;

    /**
     * @var SubclassIdentificationType $subClassInformation
     * @access public
     */
    public $subClassInformation = null;

    /**
     * @var AdditionalBusinessSourceInformationType_132962S $subClassClassification
     * @access public
     */
    public $subClassClassification = null;

}

class ItemDescriptionType {

    /**
     * @var AlphaNumericString_Length1To3 $itemCharacteristic
     * @access public
     */
    public $itemCharacteristic = null;

}

class ItemNumberIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length1To2 $number
     * @access public
     */
    public $number = null;

}

class ItemNumberIdentificationTypeU_46320C {

    /**
     * @var NumericInteger_Length1To2 $itemID
     * @access public
     */
    public $itemID = null;

    /**
     * @var AlphaNumericString_Length1To3 $itemIDQualifier
     * @access public
     */
    public $itemIDQualifier = null;

}

class ItemNumberTypeU {

    /**
     * @var ItemNumberIdentificationTypeU $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class ItemNumberTypeU_25424S {

    /**
     * @var ItemNumberIdentificationTypeU_46320C $itemIdentification
     * @access public
     */
    public $itemIdentification = null;

}

class ItemReferencesAndVersionsType_129358S {

    /**
     * @var AlphaNumericString_Length1To1 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var NumericInteger_Length1To3 $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class ItemReferencesAndVersionsType_132898S {

    /**
     * @var AlphaNumericString_Length1To3 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var AlphaNumericString_Length1To20 $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class ItemReferencesAndVersionsType_132954S {

    /**
     * @var AlphaNumericString_Length1To3 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var AlphaNumericString_Length1To10 $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class ItemReferencesAndVersionsType_20992S {

    /**
     * @var AlphaNumericString_Length1To1 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var AlphaNumericString_Length1To3 $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class ItemReferencesAndVersionsType_6550S {

    /**
     * @var UniqueIdDescriptionType $iDSection
     * @access public
     */
    public $iDSection = null;

}

class ItemReferencesAndVersionsType_94069S {

    /**
     * @var AlphaNumericString_Length1To3 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var AlphaNumericString_Length1To35 $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

    /**
     * @var AlphaNumericString_Length1To3 $actionCategory
     * @access public
     */
    public $actionCategory = null;

    /**
     * @var UniqueIdDescriptionType_141680C $idSection
     * @access public
     */
    public $idSection = null;

}

class ItemReferencesAndVersionsType_94556S {

    /**
     * @var AlphaNumericString_Length1To3 $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var AlphaNumericString_Length1To35 $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class LocationIdentificationBatchTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To60 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationBatchTypeU_192877C {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To11 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationBatchTypeU_192917C {

    /**
     * @var AlphaNumericString_Length1To5 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To2 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To60 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationBatchTypeU_46344C {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationBatchTypeU_60738C {

    /**
     * @var AlphaNumericString_Length1To5 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To2 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class LocationIdentificationBatchType {

    /**
     * @var AlphaNumericString_Length1To35 $code
     * @access public
     */
    public $code = null;

}

class LocationIdentificationBatchType_188360C {

    /**
     * @var AlphaNumericString_Length1To35 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To60 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationTypeS {

    /**
     * @var AlphaNumericString_Length1To25 $cityCode
     * @access public
     */
    public $cityCode = null;

}

class LocationIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To25 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationTypeU_188107C {

    /**
     * @var AlphaNumericString_Length1To3 $iataLocCode
     * @access public
     */
    public $iataLocCode = null;

    /**
     * @var AlphaNumericString_Length1To256 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationTypeU_188218C {

    /**
     * @var AlphaNumericString_Length1To35 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To17 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $agency
     * @access public
     */
    public $agency = null;

    /**
     * @var AlphaNumericString_Length1To256 $name
     * @access public
     */
    public $name = null;

}

class LocationIdentificationTypeU_192855C {

    /**
     * @var AlphaNumericString_Length1To10 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To30 $name
     * @access public
     */
    public $name = null;

}

class LocationTypeI_186910C {

    /**
     * @var AlphaNumericString_Length1To10 $trueLocationId
     * @access public
     */
    public $trueLocationId = null;

    /**
     * @var AlphaNumericString_Length1To17 $trueLocation
     * @access public
     */
    public $trueLocation = null;

}

class LocationTypeI_192814C {

    /**
     * @var AlphaNumericString_Length1To5 $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var AlphaNumericString_Length1To17 $cityName
     * @access public
     */
    public $cityName = null;

}

class LocationTypeI_192931C {

    /**
     * @var AlphaNumericString_Length3To3 $trueLocationId
     * @access public
     */
    public $trueLocationId = null;

}

class LocationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class LocationTypeU_45633C {

    /**
     * @var AlphaNumericString_Length1To5 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class LocationTypeU_46324C {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To2 $country
     * @access public
     */
    public $country = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class LongFreeTextType {

    /**
     * @var FreeTextQualificationType $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     * @var AlphaNumericString_Length1To199 $longFreetext
     * @access public
     */
    public $longFreetext = null;

}

class LongFreeTextType_128687S {

    /**
     * @var FreeTextQualificationType_187488C $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     * @var AlphaNumericString_Length1To199 $longFreetext
     * @access public
     */
    public $longFreetext = null;

}

class MeanOfPaymentDataType {

    /**
     * @var FormOfPaymentType $fopInformation
     * @access public
     */
    public $fopInformation = null;

    /**
     * @var DummySegmentTypeI $dummy
     * @access public
     */
    public $dummy = null;

    /**
     * @var CreditCardDataGroupType $creditCardData
     * @access public
     */
    public $creditCardData = null;

}

class MeasurementsBatchTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $measurementQualifier
     * @access public
     */
    public $measurementQualifier = null;

    /**
     * @var ValueRangeTypeU $valueRange
     * @access public
     */
    public $valueRange = null;

}

class MessageActionDetailsTypeI {

    /**
     * @var MessageFunctionBusinessDetailsTypeI $business
     * @access public
     */
    public $business = null;

}

class MessageActionDetailsType {

    /**
     * @var MessageFunctionBusinessDetailsType $business
     * @access public
     */
    public $business = null;

}

class MessageFunctionBusinessDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $function
     * @access public
     */
    public $function = null;

}

class MessageFunctionBusinessDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $function
     * @access public
     */
    public $function = null;

}

class MessageReferenceType {

    /**
     * @var AlphaNumericString_Length1To12 $retrievalReferenceNumber
     * @access public
     */
    public $retrievalReferenceNumber = null;

    /**
     * @var AlphaString_Length1To1 $authorCharacteristicIndicator
     * @access public
     */
    public $authorCharacteristicIndicator = null;

    /**
     * @var AlphaNumericString_Length2To2 $authorResponseCode
     * @access public
     */
    public $authorResponseCode = null;

    /**
     * @var AlphaNumericString_Length2To2 $cardLevelResult
     * @access public
     */
    public $cardLevelResult = null;

    /**
     * @var AlphaNumericString_Length1To1 $terminalType
     * @access public
     */
    public $terminalType = null;

}

class MileageTimeDetailsType {

    /**
     * @var NumericInteger_Length1To8 $mileage
     * @access public
     */
    public $mileage = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class MiscellaneousChargeOrderType {

    /**
     * @var AlphaNumericString_Length1To2 $type
     * @access public
     */
    public $type = null;

}

class MiscellaneousRemarkType {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To2 $category
     * @access public
     */
    public $category = null;

    /**
     * @var AlphaNumericString_Length1To127 $freetext
     * @access public
     */
    public $freetext = null;

    /**
     * @var AlphaNumericString_Length1To3 $providerType
     * @access public
     */
    public $providerType = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var NumericDecimal_Length1To11 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length9To9 $officeId
     * @access public
     */
    public $officeId = null;

}

class MiscellaneousRemarkType_151C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To2 $category
     * @access public
     */
    public $category = null;

    /**
     * @var AlphaNumericString_Length1To127 $freetext
     * @access public
     */
    public $freetext = null;

    /**
     * @var AlphaNumericString_Length1To3 $providerType
     * @access public
     */
    public $providerType = null;

}

class MiscellaneousRemarkType_18076C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To70 $freetext
     * @access public
     */
    public $freetext = null;

}

class MiscellaneousRemarkType_187480C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To35 $freetext
     * @access public
     */
    public $freetext = null;

}

class MiscellaneousRemarkType_192839C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To90 $freetext
     * @access public
     */
    public $freetext = null;

    /**
     * @var AlphaNumericString_Length1To3 $businessFunction
     * @access public
     */
    public $businessFunction = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

    /**
     * @var AlphaNumericString_Length1To3 $source
     * @access public
     */
    public $source = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class MiscellaneousRemarkType_210666C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To1 $category
     * @access public
     */
    public $category = null;

    /**
     * @var AlphaNumericString_Length1To127 $freetext
     * @access public
     */
    public $freetext = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var AlphaNumericString_Length1To3 $encoding
     * @access public
     */
    public $encoding = null;

}

class MiscellaneousRemarksType {

    /**
     * @var MiscellaneousRemarkType $remarks
     * @access public
     */
    public $remarks = null;

}

class MiscellaneousRemarksType_12240S {

    /**
     * @var MiscellaneousRemarkType_18076C $remarkDetails
     * @access public
     */
    public $remarkDetails = null;

}

class MiscellaneousRemarksType_132926S {

    /**
     * @var MiscellaneousRemarkType_192839C $remarkDetails
     * @access public
     */
    public $remarkDetails = null;

}

class MiscellaneousRemarksType_133000S {

    /**
     * @var MiscellaneousRemarkType $remarkDetails
     * @access public
     */
    public $remarkDetails = null;

}

class MiscellaneousRemarksType_211S {

    /**
     * @var MiscellaneousRemarkType_151C $remarks
     * @access public
     */
    public $remarks = null;

    /**
     * @var IndividualSecurityType $individualSecurity
     * @access public
     */
    public $individualSecurity = null;

}

class MonetaryInformationDetailsTypeI_121351C {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class MonetaryInformationDetailsTypeI_17849C {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var AlphaNumericString_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class MonetaryInformationDetailsTypeI_192954C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

}

class MonetaryInformationDetailsTypeI_193080C {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var NumericDecimal_Length1To35 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class MonetaryInformationDetailsTypeI_8308C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

}

class MonetaryInformationDetailsTypeI_86190C {

    /**
     * @var AlphaNumericString_Length1To3 $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $amount
     * @access public
     */
    public $amount = null;

}

class MonetaryInformationTypeI_133001S {

    /**
     * @var MonetaryInformationDetailsTypeI_192954C $information
     * @access public
     */
    public $information = null;

}

class MonetaryInformationTypeI_53012S {

    /**
     * @var MonetaryInformationDetailsTypeI_86190C $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var MonetaryInformationDetailsTypeI_86190C $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class MonetaryInformationTypeI_79012S {

    /**
     * @var MonetaryInformationDetailsTypeI_121351C $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class MonetaryInformationType_133078S {

    /**
     * @var MonetaryInformationDetailsTypeI_193080C $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var MonetaryInformationDetailsTypeI_193080C $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class MonetaryInformationType_94557S {

    /**
     * @var MonetaryInformationDetailsType $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var MonetaryInformationDetailsType $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class NameAndAddressBatchTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $partyQualifier
     * @access public
     */
    public $partyQualifier = null;

    /**
     * @var NameAndAddressDetailsTypeU $addressDetails
     * @access public
     */
    public $addressDetails = null;

    /**
     * @var PartyNameBatchTypeU $partyNameDetails
     * @access public
     */
    public $partyNameDetails = null;

}

class NameAndAddressDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To25 $line1
     * @access public
     */
    public $line1 = null;

    /**
     * @var AlphaNumericString_Length1To25 $line2
     * @access public
     */
    public $line2 = null;

}

class NameInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To30 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To30 $identifier
     * @access public
     */
    public $identifier = null;

}

class NameInformationTypeU_192840C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To12 $name
     * @access public
     */
    public $name = null;

}

class NameTypeU {

    /**
     * @var NameInformationTypeU $nameInformation
     * @access public
     */
    public $nameInformation = null;

}

class NameTypeU_132927S {

    /**
     * @var NameInformationTypeU_192840C $nameInformation
     * @access public
     */
    public $nameInformation = null;

}

class NegoDataType {

    /**
     * @var PricingTicketingDetailsTypeI_79032S $schemeIndicator
     * @access public
     */
    public $schemeIndicator = null;

    /**
     * @var MonetaryInformationTypeI_79012S $negoSellingFare
     * @access public
     */
    public $negoSellingFare = null;

    /**
     * @var MonetaryInformationTypeI_79012S $negoOtherFares
     * @access public
     */
    public $negoOtherFares = null;

    /**
     * @var CommissionInformationTypeI $commissionInformation
     * @access public
     */
    public $commissionInformation = null;

    /**
     * @var TourInformationTypeI_79029S $tourInformation
     * @access public
     */
    public $tourInformation = null;

    /**
     * @var ReferenceInformationTypeI_79033S $negoReferences
     * @access public
     */
    public $negoReferences = null;

}

class NumberOfUnitDetailsTypeI_18670C {

    /**
     * @var NumericInteger_Length1To1 $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class NumberOfUnitDetailsTypeI_2755C {

    /**
     * @var NumericInteger_Length1To5 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class NumberOfUnitDetailsTypeI_35712C {

    /**
     * @var NumericInteger_Length1To2 $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

}

class NumberOfUnitDetailsTypeI_46330C {

    /**
     * @var NumericInteger_Length1To2 $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

    /**
     * @var AlphaNumericString_Length1To3 $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

}

class NumberOfUnitDetailsType_188142C {

    /**
     * @var NumericInteger_Length1To2 $numberOfUnit
     * @access public
     */
    public $numberOfUnit = null;

}

class NumberOfUnitsTypeI {

    /**
     * @var NumberOfUnitDetailsTypeI_2755C $numberDetail
     * @access public
     */
    public $numberDetail = null;

}

class NumberOfUnitsType_129120S {

    /**
     * @var NumberOfUnitDetailsType_188142C $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class NumberOfUnitsType_20156S {

    /**
     * @var NumberOfUnitDetailsTypeI_35712C $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class NumberOfUnitsType_76106S {

    /**
     * @var NumberOfUnitDetailsTypeI $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class OBfeesGroupType {

    /**
     * @var SpecificDataInformationTypeI_79035S $carrierFee
     * @access public
     */
    public $carrierFee = null;

    /**
     * @var CodedAttributeType_79464S $feeDescription
     * @access public
     */
    public $feeDescription = null;

    /**
     * @var MonetaryInformationTypeI_79012S $feeAmount
     * @access public
     */
    public $feeAmount = null;

    /**
     * @var TaxType2I_79038S $feeTax
     * @access public
     */
    public $feeTax = null;

    /**
     * @var VatPropertiesGroupType $vatPropertiesGroup
     * @access public
     */
    public $vatPropertiesGroup = null;

}

class ODKeyPerformanceDataType {

    /**
     * @var AlphaString_Length1To1 $scheduleChange
     * @access public
     */
    public $scheduleChange = null;

    /**
     * @var OversaleDataType $oversale
     * @access public
     */
    public $oversale = null;

}

class ONDType {

    /**
     * @var MonetaryInformationType $yieldInformations
     * @access public
     */
    public $yieldInformations = null;

    /**
     * @var ProductInformationTypeI_132967S $classCombinaison
     * @access public
     */
    public $classCombinaison = null;

    /**
     * @var OriginAndDestinationDetailsTypeI_132966S $ondyield
     * @access public
     */
    public $ondyield = null;

    /**
     * @var OriginAndDestinationDetailsTypeI_132966S $tripOnD
     * @access public
     */
    public $tripOnD = null;

    /**
     * @var PointOfCommencementTypeI $pointOfCommencement
     * @access public
     */
    public $pointOfCommencement = null;

}

class OfferPropertiesType {

    /**
     * @var AlphaNumericString_Length1To5 $offerStatus
     * @access public
     */
    public $offerStatus = null;

    /**
     * @var StructuredDateTimeType_139827C $offerValidityDate
     * @access public
     */
    public $offerValidityDate = null;

}

class OptionElementInformationType {

    /**
     * @var AlphaNumericString_Length9To9 $officeId
     * @access public
     */
    public $officeId = null;

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var NumericInteger_Length1To3 $queue
     * @access public
     */
    public $queue = null;

    /**
     * @var NumericInteger_Length1To3 $category
     * @access public
     */
    public $category = null;

    /**
     * @var AlphaNumericString_Length1To200 $freetext
     * @access public
     */
    public $freetext = null;

}

class OptionElementType {

    /**
     * @var OptionElementInformationType $optionDetail
     * @access public
     */
    public $optionDetail = null;

}

class OriginAndDestinationDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To25 $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var AlphaNumericString_Length1To25 $destination
     * @access public
     */
    public $destination = null;

}

class OriginAndDestinationDetailsTypeI_132966S {

    /**
     * @var AlphaString_Length1To3 $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var AlphaString_Length1To3 $destination
     * @access public
     */
    public $destination = null;

}

class OriginAndDestinationDetailsTypeI_3061S {

    /**
     * @var AlphaString_Length3To3 $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var AlphaString_Length3To3 $destination
     * @access public
     */
    public $destination = null;

}

class OriginAndDestinationDetailsTypeI_79034S {

    /**
     * @var AlphaNumericString_Length1To3 $origin
     * @access public
     */
    public $origin = null;

    /**
     * @var AlphaNumericString_Length1To3 $destination
     * @access public
     */
    public $destination = null;

}

class OriginatorDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $codedCountry
     * @access public
     */
    public $codedCountry = null;

    /**
     * @var AlphaNumericString_Length1To3 $codedCurrency
     * @access public
     */
    public $codedCurrency = null;

    /**
     * @var AlphaNumericString_Length1To3 $codedLanguage
     * @access public
     */
    public $codedLanguage = null;

}

class OriginatorIdentificationDetailsTypeI_170735C {

    /**
     * @var NumericInteger_Length1To9 $originatorId
     * @access public
     */
    public $originatorId = null;

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

    /**
     * @var NumericInteger_Length1To9 $inHouseIdentification2
     * @access public
     */
    public $inHouseIdentification2 = null;

}

class OriginatorIdentificationDetailsTypeI_192790C {

    /**
     * @var AlphaNumericString_Length1To9 $originatorId
     * @access public
     */
    public $originatorId = null;

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

    /**
     * @var NumericInteger_Length1To9 $inHouseIdentification2
     * @access public
     */
    public $inHouseIdentification2 = null;

}

class OriginatorIdentificationDetailsTypeI_192816C {

    /**
     * @var AlphaNumericString_Length1To9 $originatorId
     * @access public
     */
    public $originatorId = null;

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification2
     * @access public
     */
    public $inHouseIdentification2 = null;

}

class OriginatorIdentificationDetailsTypeI_192823C {

    /**
     * @var AlphaNumericString_Length8To8 $originatorId
     * @access public
     */
    public $originatorId = null;

}

class OriginatorIdentificationDetailsTypeI_192904C {

    /**
     * @var AlphaNumericString_Length1To9 $originatorId
     * @access public
     */
    public $originatorId = null;

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

}

class OriginatorIdentificationDetailsTypeI_192968C {

    /**
     * @var NumericInteger_Length5To8 $originatorId
     * @access public
     */
    public $originatorId = null;

}

class OriginatorIdentificationDetailsTypeI_46358C {

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification2
     * @access public
     */
    public $inHouseIdentification2 = null;

}

class OriginatorIdentificationDetailsType {

    /**
     * @var AlphaNumericString_Length1To9 $originatorId
     * @access public
     */
    public $originatorId = null;

    /**
     * @var AlphaNumericString_Length1To9 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

    /**
     * @var NumericInteger_Length1To9 $inHouseIdentification2
     * @access public
     */
    public $inHouseIdentification2 = null;

}

class OtherHotelInformationType {

    /**
     * @var AlphaString_Length3To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

}

class OtherInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $queueType
     * @access public
     */
    public $queueType = null;

}

class OtherSegmentDataTypeI {

    /**
     * @var AlphaNumericString_Length1To2 $cabin
     * @access public
     */
    public $cabin = null;

    /**
     * @var NumericInteger_Length1To1 $subclass
     * @access public
     */
    public $subclass = null;

    /**
     * @var AlphaNumericString_Length1To2 $flightType
     * @access public
     */
    public $flightType = null;

    /**
     * @var AlphaString_Length2To2 $overbooking
     * @access public
     */
    public $overbooking = null;

}

class OverbookingDetailsType {

    /**
     * @var AlphaString_Length3To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $reason
     * @access public
     */
    public $reason = null;

}

class OversaleDataType {

    /**
     * @var NumericDecimal_Length1To3 $oversaleNumber
     * @access public
     */
    public $oversaleNumber = null;

    /**
     * @var AlphaString_Length1To1 $oversaleIndicator
     * @access public
     */
    public $oversaleIndicator = null;

}

class PNRSupplementaryDataType {

    /**
     * @var AttributeType_94576S $dataAndSwitchMap
     * @access public
     */
    public $dataAndSwitchMap = null;

}

class POSGroupType {

    /**
     * @var UserIdentificationType $sbrUserIdentificationOwn
     * @access public
     */
    public $sbrUserIdentificationOwn = null;

    /**
     * @var SystemDetailsInfoType_132969S $sbrSystemDetails
     * @access public
     */
    public $sbrSystemDetails = null;

    /**
     * @var UserPreferencesType $sbrPreferences
     * @access public
     */
    public $sbrPreferences = null;

}

class POSGroupType_150634G {

    /**
     * @var PointOfSaleInformationType $pointOfSaleInformationType
     * @access public
     */
    public $pointOfSaleInformationType = null;

    /**
     * @var UserIdentificationType_132824S $sbrUserIdentification
     * @access public
     */
    public $sbrUserIdentification = null;

    /**
     * @var SystemDetailsInfoType $sbrSystemDetails
     * @access public
     */
    public $sbrSystemDetails = null;

    /**
     * @var UserPreferencesType $sbrPreferences
     * @access public
     */
    public $sbrPreferences = null;

    /**
     * @var TicketAgentInfoType $agentId
     * @access public
     */
    public $agentId = null;

    /**
     * @var StructuredDateTimeInformationType_132821S $pointOfSaleDate
     * @access public
     */
    public $pointOfSaleDate = null;

}

class POSGroupType_150753G {

    /**
     * @var UserIdentificationType_132892S $sbrUserIdentification
     * @access public
     */
    public $sbrUserIdentification = null;

}

class PQRdataType {

    /**
     * @var ItemReferencesAndVersionsType_94069S $pricingRecordId
     * @access public
     */
    public $pricingRecordId = null;

    /**
     * @var ReferenceInformationType_65487S $passengerTattoos
     * @access public
     */
    public $passengerTattoos = null;

    /**
     * @var DiscountInformationType_94068S $ptcDiscountCode
     * @access public
     */
    public $ptcDiscountCode = null;

    /**
     * @var ReferenceInformationTypeI_79009S $fareIds
     * @access public
     */
    public $fareIds = null;

    /**
     * @var documentDetailsGroup $documentDetailsGroup
     * @access public
     */
    public $documentDetailsGroup = null;

}

class documentDetailsGroup {

    /**
     * @var MonetaryInformationTypeI_79012S $totalFare
     * @access public
     */
    public $totalFare = null;

    /**
     * @var MonetaryInformationTypeI_79012S $otherFares
     * @access public
     */
    public $otherFares = null;

    /**
     * @var TaxType2I_79017S $taxInformation
     * @access public
     */
    public $taxInformation = null;

    /**
     * @var PricingTicketingDetailsTypeI $issueIdentifier
     * @access public
     */
    public $issueIdentifier = null;

    /**
     * @var OriginAndDestinationDetailsTypeI_79034S $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     * @var AttributeType_79011S $rfics
     * @access public
     */
    public $rfics = null;

    /**
     * @var StatusTypeI $manualIndicator
     * @access public
     */
    public $manualIndicator = null;

    /**
     * @var StatusTypeI $flags
     * @access public
     */
    public $flags = null;

    /**
     * @var CodedAttributeType_79010S $generalIndicators
     * @access public
     */
    public $generalIndicators = null;

    /**
     * @var FreeTextInformationType $fareCalcRemarks
     * @access public
     */
    public $fareCalcRemarks = null;

    /**
     * @var UserIdentificationType_79019S $officeInformation
     * @access public
     */
    public $officeInformation = null;

    /**
     * @var NegoDataType $negoDetails
     * @access public
     */
    public $negoDetails = null;

    /**
     * @var StructuredDateTimeInformationType_79014S $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     * @var StructuredDateTimeInformationType_79014S $otherDates
     * @access public
     */
    public $otherDates = null;

    /**
     * @var ATCdataType $atcFares
     * @access public
     */
    public $atcFares = null;

    /**
     * @var OBfeesGroupType $airlineServiceFeeGroup
     * @access public
     */
    public $airlineServiceFeeGroup = null;

    /**
     * @var couponDetailsGroup $couponDetailsGroup
     * @access public
     */
    public $couponDetailsGroup = null;

}

class couponDetailsGroup {

    /**
     * @var ReferenceInformationTypeI_79009S $productId
     * @access public
     */
    public $productId = null;

    /**
     * @var AttributeType_79011S $rfisc
     * @access public
     */
    public $rfisc = null;

    /**
     * @var CompanyInformationType_79020S $feeOwner
     * @access public
     */
    public $feeOwner = null;

    /**
     * @var MonetaryInformationTypeI_79012S $couponValue
     * @access public
     */
    public $couponValue = null;

    /**
     * @var InConnectionWithType $icw
     * @access public
     */
    public $icw = null;

    /**
     * @var StatusTypeI $couponFlags
     * @access public
     */
    public $couponFlags = null;

    /**
     * @var FreeTextInformationType_79018S $presentToAtAndRemarks
     * @access public
     */
    public $presentToAtAndRemarks = null;

    /**
     * @var TravelProductInformationTypeI_79024S $flightConnectionType
     * @access public
     */
    public $flightConnectionType = null;

    /**
     * @var PricingOrTicketingSubsequentType_79023S $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     * @var DateAndTimeInformationTypeI_79021S $validityDates
     * @access public
     */
    public $validityDates = null;

    /**
     * @var ExcessBaggageTypeI $baggageInformation
     * @access public
     */
    public $baggageInformation = null;

}

class PackageDescriptionType {

    /**
     * @var AlphaNumericString_Length1To1 $packageType
     * @access public
     */
    public $packageType = null;

    /**
     * @var PackageIdentificationType $packageDetails
     * @access public
     */
    public $packageDetails = null;

}

class PackageIdentificationType {

    /**
     * @var AlphaNumericString_Length1To40 $packageDesc
     * @access public
     */
    public $packageDesc = null;

}

class PartyIdentifierType {

    /**
     * @var AMA_EDICodesetType_Length1to3 $partyCodeQualifier
     * @access public
     */
    public $partyCodeQualifier = null;

}

class PartyNameBatchTypeU {

    /**
     * @var AlphaNumericString_Length1To35 $name1
     * @access public
     */
    public $name1 = null;

}

class PassengerDocumentDetailsType {

    /**
     * @var AlphaNumericString_Length1To4 $birthDate
     * @access public
     */
    public $birthDate = null;

    /**
     * @var DocumentDetailsType $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class PassengerFlightDetailsTypeI {
    
}

class PaymentDataGroupType {

    /**
     * @var CompanyInformationType_94554S $merchantInformation
     * @access public
     */
    public $merchantInformation = null;

    /**
     * @var MonetaryInformationType_94557S $monetaryInformation
     * @access public
     */
    public $monetaryInformation = null;

    /**
     * @var ItemReferencesAndVersionsType_94556S $paymentId
     * @access public
     */
    public $paymentId = null;

    /**
     * @var FrequencyTypeU $extendedPaymentInfo
     * @access public
     */
    public $extendedPaymentInfo = null;

    /**
     * @var StructuredDateTimeInformationType_94559S $transactionDateTime
     * @access public
     */
    public $transactionDateTime = null;

    /**
     * @var QuantityType_94558S $expirationPeriod
     * @access public
     */
    public $expirationPeriod = null;

    /**
     * @var TerminalIdentificationDescriptionType $distributionChannelInformation
     * @access public
     */
    public $distributionChannelInformation = null;

    /**
     * @var FreeTextInformationType_79018S $purchaseDescription
     * @access public
     */
    public $purchaseDescription = null;

    /**
     * @var FraudScreeningGroupType $fraudScreeningData
     * @access public
     */
    public $fraudScreeningData = null;

    /**
     * @var AttributeType_94553S $paymentDataMap
     * @access public
     */
    public $paymentDataMap = null;

}

class PaymentDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To4 $formOfPaymentCode
     * @access public
     */
    public $formOfPaymentCode = null;

    /**
     * @var AlphaNumericString_Length1To4 $paymentType
     * @access public
     */
    public $paymentType = null;

    /**
     * @var AlphaNumericString_Length1To3 $serviceToPay
     * @access public
     */
    public $serviceToPay = null;

    /**
     * @var AlphaNumericString_Length1To31 $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

}

class PaymentDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To4 $methodCode
     * @access public
     */
    public $methodCode = null;

    /**
     * @var AlphaNumericString_Length1To4 $purposeCode
     * @access public
     */
    public $purposeCode = null;

    /**
     * @var NumericDecimal_Length1To11 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To11 $date
     * @access public
     */
    public $date = null;

}

class PaymentGroupType {

    /**
     * @var CodedAttributeType_127282S $groupUsage
     * @access public
     */
    public $groupUsage = null;

    /**
     * @var PaymentDataGroupType $paymentData
     * @access public
     */
    public $paymentData = null;

    /**
     * @var CodedAttributeType_94497S $paymentSupplementaryData
     * @access public
     */
    public $paymentSupplementaryData = null;

    /**
     * @var MeanOfPaymentDataType $mopInformation
     * @access public
     */
    public $mopInformation = null;

    /**
     * @var DummySegmentTypeI $dummy
     * @access public
     */
    public $dummy = null;

    /**
     * @var DetailedPaymentDataType $mopDetailedData
     * @access public
     */
    public $mopDetailedData = null;

}

class PaymentInformationTypeI {

    /**
     * @var PaymentDetailsTypeI $paymentDetails
     * @access public
     */
    public $paymentDetails = null;

}

class PaymentInformationTypeU {

    /**
     * @var PaymentDetailsTypeU $paymentDetails
     * @access public
     */
    public $paymentDetails = null;

    /**
     * @var CreditCardInformationTypeU $creditCardInformation
     * @access public
     */
    public $creditCardInformation = null;

}

class PhoneAndEmailAddressType {

    /**
     * @var AlphaNumericString_Length1To4 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var StructuredTelephoneNumberType_187460C $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

}

class PhoneAndEmailAddressType_128670S {

    /**
     * @var AlphaNumericString_Length1To4 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var StructuredTelephoneNumberType_187460C $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

    /**
     * @var AlphaNumericString_Length1To70 $emailAddress
     * @access public
     */
    public $emailAddress = null;

}

class PhoneAndEmailAddressType_128774S {

    /**
     * @var AlphaNumericString_Length1To4 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var StructuredTelephoneNumberType_187583C $telephoneNumberDetails
     * @access public
     */
    public $telephoneNumberDetails = null;

}

class PhoneAndEmailAddressType_132846S {

    /**
     * @var AlphaNumericString_Length1To4 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var StructuredTelephoneNumberType_187583C $telephoneNumberDetails
     * @access public
     */
    public $telephoneNumberDetails = null;

    /**
     * @var AlphaNumericString_Length1To70 $emailAddress
     * @access public
     */
    public $emailAddress = null;

}

class PhoneAndEmailAddressType_132937S {

    /**
     * @var AlphaNumericString_Length1To3 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var StructuredTelephoneNumberType_192858C $telephoneNumberDetails
     * @access public
     */
    public $telephoneNumberDetails = null;

}

class PhoneAndEmailAddressType_132949S {

    /**
     * @var AlphaNumericString_Length1To3 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var AlphaNumericString_Length1To70 $emailAddress
     * @access public
     */
    public $emailAddress = null;

}

class PhoneAndEmailAddressType_133032S {

    /**
     * @var AlphaNumericString_Length1To4 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var StructuredTelephoneNumberType_187460C $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

    /**
     * @var AlphaNumericString_Length1To90 $emailAddress
     * @access public
     */
    public $emailAddress = null;

}

class PhoneAndEmailAddressType_94565S {

    /**
     * @var AlphaNumericString_Length1To4 $phoneOrEmailType
     * @access public
     */
    public $phoneOrEmailType = null;

    /**
     * @var StructuredTelephoneNumberType $telephoneNumberDetails
     * @access public
     */
    public $telephoneNumberDetails = null;

    /**
     * @var AlphaNumericString_Length1To70 $emailAddress
     * @access public
     */
    public $emailAddress = null;

}

class PlaceLocationIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var RelatedLocationOneIdentificationTypeU_188145C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class PlaceLocationIdentificationTypeU_132925S {

    /**
     * @var AlphaNumericString_Length1To3 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var LocationIdentificationBatchTypeU $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     * @var RelatedLocationOneIdentificationTypeU_192837C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class PlaceLocationIdentificationTypeU_132948S {

    /**
     * @var AlphaNumericString_Length1To3 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var LocationIdentificationBatchTypeU_192877C $locationDescription
     * @access public
     */
    public $locationDescription = null;

}

class PlaceLocationIdentificationTypeU_132955S {

    /**
     * @var RelatedLocationOneIdentificationTypeU $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

    /**
     * @var RelatedLocationTwoIdentificationTypeU $secondLocationDetails
     * @access public
     */
    public $secondLocationDetails = null;

}

class PlaceLocationIdentificationTypeU_132982S {

    /**
     * @var AlphaNumericString_Length1To2 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var LocationIdentificationBatchTypeU_192917C $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     * @var RelatedLocationOneIdentificationTypeU_192918C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class PlaceLocationIdentificationTypeU_24573S {

    /**
     * @var AlphaNumericString_Length1To3 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var RelatedLocationOneIdentificationTypeU_188145C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class PlaceLocationIdentificationTypeU_25436S {

    /**
     * @var AlphaNumericString_Length1To3 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var LocationIdentificationBatchTypeU_46344C $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     * @var RelatedLocationOneIdentificationTypeU_46345C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class PlaceLocationIdentificationTypeU_35293S {

    /**
     * @var AlphaNumericString_Length1To2 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var LocationIdentificationBatchTypeU_60738C $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     * @var RelatedLocationOneIdentificationTypeU_192918C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class PlaceLocationIdentificationType {

    /**
     * @var AlphaNumericString_Length1To3 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var LocationIdentificationBatchType $locationDescription
     * @access public
     */
    public $locationDescription = null;

}

class PlaceLocationIdentificationType_128824S {

    /**
     * @var AlphaNumericString_Length1To3 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var RelatedLocationOneIdentificationType_187710C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

    /**
     * @var RelatedLocationTwoIdentificationType $secondLocationDetails
     * @access public
     */
    public $secondLocationDetails = null;

}

class PlaceLocationIdentificationType_129295S {

    /**
     * @var AlphaNumericString_Length1To2 $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var LocationIdentificationBatchType_188360C $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     * @var RelatedLocationOneIdentificationType_188361C $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class PnrHistoryDataType {

    /**
     * @var NumericInteger_Length1To3 $previousRecord
     * @access public
     */
    public $previousRecord = null;

    /**
     * @var NumericInteger_Length1To3 $currentRecord
     * @access public
     */
    public $currentRecord = null;

    /**
     * @var AlphaString_Length1To2 $elementType
     * @access public
     */
    public $elementType = null;

    /**
     * @var AlphaNumericString_Length1To255 $elementData
     * @access public
     */
    public $elementData = null;

}

class PnrHistoryDataType_27157S {

    /**
     * @var NumericInteger_Length1To5 $currentRecord
     * @access public
     */
    public $currentRecord = null;

}

class PointOfCommencementTypeI {

    /**
     * @var AlphaNumericString_Length1To2 $location
     * @access public
     */
    public $location = null;

}

class PointOfSaleDataTypeI {

    /**
     * @var AlphaString_Length1To1 $classification
     * @access public
     */
    public $classification = null;

    /**
     * @var AlphaNumericString_Length1To3 $crs
     * @access public
     */
    public $crs = null;

    /**
     * @var AlphaString_Length2To2 $pointOfSaleCountry
     * @access public
     */
    public $pointOfSaleCountry = null;

}

class PointOfSaleDataType {

    /**
     * @var UserIdentificationType_132970S $userIdentification
     * @access public
     */
    public $userIdentification = null;

    /**
     * @var SystemDetailsInfoType_132969S $systemDetails
     * @access public
     */
    public $systemDetails = null;

    /**
     * @var UserPreferencesType $preferences
     * @access public
     */
    public $preferences = null;

}

class PointOfSaleInformationType {

    /**
     * @var PartyIdentifierType $pointOfSale
     * @access public
     */
    public $pointOfSale = null;

}

class PricingOrTicketingSubsequentType {

    /**
     * @var AlphaNumericString_Length1To3 $specialCondition
     * @access public
     */
    public $specialCondition = null;

    /**
     * @var AlphaNumericString_Length1To3 $otherSpecialCondition
     * @access public
     */
    public $otherSpecialCondition = null;

}

class PricingOrTicketingSubsequentType_79023S {

    /**
     * @var RateTariffClassInformationTypeI $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

}

class PricingTicketingDetailsTypeI {

    /**
     * @var PricingTicketingInformationTypeI $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     * @var AlphaNumericString_Length1To3 $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

}

class PricingTicketingDetailsTypeI_79032S {

    /**
     * @var PricingTicketingInformationTypeI $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

}

class PricingTicketingInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $indicators
     * @access public
     */
    public $indicators = null;

}

class PriorityDetailsType {

    /**
     * @var AlphaNumericString_Length1To2 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To1 $priorityCode
     * @access public
     */
    public $priorityCode = null;

    /**
     * @var AlphaNumericString_Length1To4 $tierLevel
     * @access public
     */
    public $tierLevel = null;

    /**
     * @var AlphaNumericString_Length1To70 $tierDescription
     * @access public
     */
    public $tierDescription = null;

}

class ProcessingInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $actionQualifier
     * @access public
     */
    public $actionQualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

}

class ProductAccountDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To6 $category
     * @access public
     */
    public $category = null;

    /**
     * @var AlphaNumericString_Length1To6 $sequenceNumber
     * @access public
     */
    public $sequenceNumber = null;

    /**
     * @var AlphaNumericString_Length1To11 $versionNumber
     * @access public
     */
    public $versionNumber = null;

    /**
     * @var AlphaNumericString_Length1To35 $rateClass
     * @access public
     */
    public $rateClass = null;

    /**
     * @var AlphaNumericString_Length1To14 $approvalCode
     * @access public
     */
    public $approvalCode = null;

}

class ProductDataInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $productCategory
     * @access public
     */
    public $productCategory = null;

    /**
     * @var AlphaNumericString_Length1To14 $productCode
     * @access public
     */
    public $productCode = null;

    /**
     * @var NumericInteger_Length1To1 $addOnIndicator
     * @access public
     */
    public $addOnIndicator = null;

    /**
     * @var AlphaNumericString_Length1To188 $productDescription
     * @access public
     */
    public $productDescription = null;

}

class ProductDateAndTimeTypeU {

    /**
     * @var AlphaNumericString_Length1To8 $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var Time24_HHMM $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var AlphaNumericString_Length1To8 $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var Time24_HHMM $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

}

class ProductDateAndTimeTypeU_45634C {

    /**
     * @var AlphaNumericString_Length1To8 $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var Time24_HHMM $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var AlphaNumericString_Length1To8 $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var Time24_HHMM $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

}

class ProductDateAndTimeTypeU_46325C {

    /**
     * @var AlphaNumericString_Length1To7 $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var Time24_HHMM $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var AlphaNumericString_Length1To7 $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var Time24_HHMM $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

}

class ProductDateTimeTypeI_186908C {

    /**
     * @var AlphaNumericString_Length1To6 $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var Time24_HHMM $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var AlphaNumericString_Length1To6 $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var Time24_HHMM $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

}

class ProductDateTimeTypeI_192813C {

    /**
     * @var NumericInteger_Length6To6 $depDate
     * @access public
     */
    public $depDate = null;

    /**
     * @var Time24_HHMM $depTime
     * @access public
     */
    public $depTime = null;

    /**
     * @var NumericInteger_Length6To6 $arrDate
     * @access public
     */
    public $arrDate = null;

    /**
     * @var Time24_HHMM $arrTime
     * @access public
     */
    public $arrTime = null;

    /**
     * @var NumericInteger_Length1To1 $dayChangeIndicator
     * @access public
     */
    public $dayChangeIndicator = null;

}

class ProductDateTimeTypeI_192929C {

    /**
     * @var Date_DDMMYY $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var Time24_HHMM $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var Date_DDMMYY $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var Time24_HHMM $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

    /**
     * @var NumericInteger_Length1To1 $dateVariation
     * @access public
     */
    public $dateVariation = null;

}

class ProductDateTimeTypeI_192985C {

    /**
     * @var NumericInteger_Length6To6 $depDate
     * @access public
     */
    public $depDate = null;

    /**
     * @var NumericInteger_Length4To4 $depTime
     * @access public
     */
    public $depTime = null;

    /**
     * @var Date_DDMMYY $arrDate
     * @access public
     */
    public $arrDate = null;

    /**
     * @var NumericInteger_Length4To4 $arrTime
     * @access public
     */
    public $arrTime = null;

    /**
     * @var NumericInteger_Length1To1 $dayChangeIndicator
     * @access public
     */
    public $dayChangeIndicator = null;

}

class ProductDateTimeTypeI_260466C {

    /**
     * @var Date_DDMMYY $depDate
     * @access public
     */
    public $depDate = null;

    /**
     * @var Time24_HHMM $depTime
     * @access public
     */
    public $depTime = null;

    /**
     * @var Date_DDMMYY $arrDate
     * @access public
     */
    public $arrDate = null;

    /**
     * @var Duration99_HHMM $arrTime
     * @access public
     */
    public $arrTime = null;

    /**
     * @var NumericInteger_Length1To1 $dayChangeIndicator
     * @access public
     */
    public $dayChangeIndicator = null;

}

class ProductDateTimeTypeI_274226C {

    /**
     * @var Date_DDMMYY $depDate
     * @access public
     */
    public $depDate = null;

    /**
     * @var Time24_HHMM $depTime
     * @access public
     */
    public $depTime = null;

    /**
     * @var Date_DDMMYY $arrDate
     * @access public
     */
    public $arrDate = null;

    /**
     * @var Time24_HHMM $arrTime
     * @access public
     */
    public $arrTime = null;

    /**
     * @var NumericInteger_Length1To1 $dayChangeIndicator
     * @access public
     */
    public $dayChangeIndicator = null;

}

class ProductDateTimeTypeI_46338C {

    /**
     * @var AlphaNumericString_Length1To7 $departureDate
     * @access public
     */
    public $departureDate = null;

    /**
     * @var Time24_HHMM $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var AlphaNumericString_Length1To7 $arrivalDate
     * @access public
     */
    public $arrivalDate = null;

    /**
     * @var Time24_HHMM $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

}

class ProductDetailsTypeI {

    /**
     * @var AlphaString_Length1To1 $designator
     * @access public
     */
    public $designator = null;

    /**
     * @var AlphaNumericString_Length1To3 $availabilityStatus
     * @access public
     */
    public $availabilityStatus = null;

}

class ProductDetailsTypeI_188147C {

    /**
     * @var AlphaNumericString_Length1To17 $designator
     * @access public
     */
    public $designator = null;

}

class ProductDetailsTypeI_36664C {

    /**
     * @var AlphaNumericString_Length1To10 $designator
     * @access public
     */
    public $designator = null;

}

class ProductFacilitiesTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $entertainement
     * @access public
     */
    public $entertainement = null;

    /**
     * @var AlphaNumericString_Length1To2 $entertainementDescription
     * @access public
     */
    public $entertainementDescription = null;

    /**
     * @var AlphaNumericString_Length1To2 $productQualifier
     * @access public
     */
    public $productQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $productExtensionCode
     * @access public
     */
    public $productExtensionCode = null;

}

class ProductFacilitiesTypeI_192796C {

    /**
     * @var AlphaNumericString_Length1To3 $entertainement
     * @access public
     */
    public $entertainement = null;

    /**
     * @var AlphaNumericString_Length1To15 $entertainementDescription
     * @access public
     */
    public $entertainementDescription = null;

    /**
     * @var AlphaNumericString_Length1To2 $productQualifier
     * @access public
     */
    public $productQualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $productExtensionCode
     * @access public
     */
    public $productExtensionCode = null;

}

class ProductIdentificationDetailsTypeI_192811C {

    /**
     * @var AlphaNumericString_Length1To6 $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var AlphaNumericString_Length1To2 $classOfService
     * @access public
     */
    public $classOfService = null;

    /**
     * @var AlphaString_Length1To1 $subtype
     * @access public
     */
    public $subtype = null;

    /**
     * @var AlphaNumericString_Length1To1 $description
     * @access public
     */
    public $description = null;

}

class ProductIdentificationDetailsTypeI_192927C {

    /**
     * @var NumericInteger_Length1To4 $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $bookingClass
     * @access public
     */
    public $bookingClass = null;

    /**
     * @var AlphaString_Length1To1 $operationalSuffix
     * @access public
     */
    public $operationalSuffix = null;

}

class ProductIdentificationDetailsTypeI_46336C {

    /**
     * @var AlphaNumericString_Length1To20 $flightNumber
     * @access public
     */
    public $flightNumber = null;

    /**
     * @var AlphaNumericString_Length1To4 $bookingClass
     * @access public
     */
    public $bookingClass = null;

}

class ProductIdentificationDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To16 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To35 $name
     * @access public
     */
    public $name = null;

}

class ProductIdentificationDetailsTypeU_46327C {

    /**
     * @var AlphaNumericString_Length1To32 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $subType
     * @access public
     */
    public $subType = null;

    /**
     * @var AlphaNumericString_Length1To32 $description
     * @access public
     */
    public $description = null;

}

class ProductIdentificationDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $productIdCharacteristic
     * @access public
     */
    public $productIdCharacteristic = null;

    /**
     * @var AlphaNumericString_Length1To17 $description1
     * @access public
     */
    public $description1 = null;

    /**
     * @var AlphaNumericString_Length1To17 $description2
     * @access public
     */
    public $description2 = null;

    /**
     * @var AlphaNumericString_Length1To35 $name
     * @access public
     */
    public $name = null;

}

class ProductIdentificationDetailsType_186906C {

    /**
     * @var AlphaNumericString_Length1To10 $identificationNbr
     * @access public
     */
    public $identificationNbr = null;

    /**
     * @var AlphaNumericString_Length1To17 $bookingClass
     * @access public
     */
    public $bookingClass = null;

}

class ProductIdentificationTypeU {

    /**
     * @var ProductIdentificationDetailsTypeU $productData
     * @access public
     */
    public $productData = null;

}

class ProductIdentificationType {

    /**
     * @var ProductIdentificationDetailsType $productData
     * @access public
     */
    public $productData = null;

}

class ProductInformationTypeI {

    /**
     * @var ProductDetailsTypeI_188147C $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class ProductInformationTypeI_132967S {

    /**
     * @var ProductDetailsTypeI $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class ProductInformationTypeI_20557S {

    /**
     * @var ProductDetailsTypeI_36664C $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class ProductTypeDetailsTypeI_192812C {

    /**
     * @var AlphaNumericString_Length1To2 $detail
     * @access public
     */
    public $detail = null;

}

class ProductTypeDetailsTypeI_192928C {

    /**
     * @var AlphaString_Length1To1 $flightIndicator
     * @access public
     */
    public $flightIndicator = null;

}

class ProductTypeDetailsTypeI_192984C {

    /**
     * @var AlphaNumericString_Length1To3 $detail
     * @access public
     */
    public $detail = null;

}

class ProductTypeDetailsTypeI_46337C {

    /**
     * @var AlphaNumericString_Length1To6 $flightIndicator
     * @access public
     */
    public $flightIndicator = null;

}

class PropertyHeaderDetailsType {

    /**
     * @var AlphaNumericString_Length1To35 $providerName
     * @access public
     */
    public $providerName = null;

    /**
     * @var AlphaNumericString_Length3To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To40 $name
     * @access public
     */
    public $name = null;

}

class ProviderInformationType {

    /**
     * @var AlphaNumericString_Length1To4 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To50 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To5 $productFamilyCode
     * @access public
     */
    public $productFamilyCode = null;

}

class ProviderInformationType_188200C {

    /**
     * @var AlphaNumericString_Length1To35 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To25 $productFamilyCode
     * @access public
     */
    public $productFamilyCode = null;

    /**
     * @var AlphaNumericString_Length3To3 $producttype
     * @access public
     */
    public $producttype = null;

}

class QuantityAndActionDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $statusCode
     * @access public
     */
    public $statusCode = null;

}

class QuantityAndActionDetailsTypeU_192911C {

    /**
     * @var AlphaNumericString_Length1To3 $statusCode
     * @access public
     */
    public $statusCode = null;

}

class QuantityAndActionDetailsTypeU_46321C {

    /**
     * @var NumericInteger_Length1To2 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaNumericString_Length1To3 $statusCode
     * @access public
     */
    public $statusCode = null;

}

class QuantityAndActionTypeU {

    /**
     * @var QuantityAndActionDetailsTypeU $accoStatus
     * @access public
     */
    public $accoStatus = null;

}

class QuantityAndActionTypeU_132977S {

    /**
     * @var QuantityAndActionDetailsTypeU_192911C $accoStatus
     * @access public
     */
    public $accoStatus = null;

}

class QuantityAndActionTypeU_25425S {

    /**
     * @var QuantityAndActionDetailsTypeU_46321C $quantityActionDetails
     * @access public
     */
    public $quantityActionDetails = null;

}

class QuantityDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To3 $value
     * @access public
     */
    public $value = null;

}

class QuantityDetailsTypeI_142179C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To15 $value
     * @access public
     */
    public $value = null;

    /**
     * @var AlphaNumericString_Length1To3 $unit
     * @access public
     */
    public $unit = null;

}

class QuantityDetailsTypeI_187593C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To15 $value
     * @access public
     */
    public $value = null;

    /**
     * @var AlphaNumericString_Length1To3 $unit
     * @access public
     */
    public $unit = null;

}

class QuantityDetailsTypeI_46334C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To3 $value
     * @access public
     */
    public $value = null;

    /**
     * @var AlphaNumericString_Length1To3 $unit
     * @access public
     */
    public $unit = null;

}

class QuantityDetailsType {

    /**
     * @var AMA_EDICodesetType_Length1to3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To15 $value
     * @access public
     */
    public $value = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $unit
     * @access public
     */
    public $unit = null;

}

class QuantityTypeI {

    /**
     * @var QuantityDetailsTypeI_142179C $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class QuantityTypeI_65488S {

    /**
     * @var QuantityDetailsTypeI $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class QuantityType {

    /**
     * @var QuantityDetailsType $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class QuantityType_25433S {

    /**
     * @var QuantityDetailsTypeI_46334C $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class QuantityType_94558S {

    /**
     * @var QuantityDetailsTypeI_142179C $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

}

class QueueDetailsType {

    /**
     * @var NumericInteger_Length1To3 $queueNum1
     * @access public
     */
    public $queueNum1 = null;

    /**
     * @var AlphaNumericString_Length1To7 $queueName
     * @access public
     */
    public $queueName = null;

}

class QueueType {

    /**
     * @var QueueDetailsType $queueDetail
     * @access public
     */
    public $queueDetail = null;

    /**
     * @var GategoryType $categoryDetail
     * @access public
     */
    public $categoryDetail = null;

    /**
     * @var DateRangeType $dateRange
     * @access public
     */
    public $dateRange = null;

    /**
     * @var OtherInformationType $informations
     * @access public
     */
    public $informations = null;

}

class RailLegDataType {

    /**
     * @var TrainProductInformationType $trainProductInfo
     * @access public
     */
    public $trainProductInfo = null;

    /**
     * @var QuantityAndActionTypeU_132977S $reservableStatus
     * @access public
     */
    public $reservableStatus = null;

    /**
     * @var StructuredDateTimeInformationType_129285S $legDateTime
     * @access public
     */
    public $legDateTime = null;

    /**
     * @var PlaceLocationIdentificationType_129295S $location
     * @access public
     */
    public $location = null;

    /**
     * @var ItemNumberTypeU $legReference
     * @access public
     */
    public $legReference = null;

}

class RailLegDataType_150775G {

    /**
     * @var TrainProductInformationType_132986S $trainProductInfo
     * @access public
     */
    public $trainProductInfo = null;

    /**
     * @var QuantityAndActionTypeU_132977S $reservableStatus
     * @access public
     */
    public $reservableStatus = null;

    /**
     * @var StructuredDateTimeInformationType_129285S $legDateTime
     * @access public
     */
    public $legDateTime = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132982S $depLocation
     * @access public
     */
    public $depLocation = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132982S $arrLocation
     * @access public
     */
    public $arrLocation = null;

    /**
     * @var ItemNumberTypeU $legReference
     * @access public
     */
    public $legReference = null;

}

class RailSeatConfigurationType {

    /**
     * @var AlphaNumericString_Length2To2 $seatSpace
     * @access public
     */
    public $seatSpace = null;

    /**
     * @var AlphaNumericString_Length2To2 $coachType
     * @access public
     */
    public $coachType = null;

    /**
     * @var AlphaNumericString_Length2To2 $seatEquipment
     * @access public
     */
    public $seatEquipment = null;

    /**
     * @var AlphaNumericString_Length1To1 $seatPosition
     * @access public
     */
    public $seatPosition = null;

    /**
     * @var AlphaNumericString_Length1To1 $seatDirection
     * @access public
     */
    public $seatDirection = null;

    /**
     * @var AlphaNumericString_Length1To1 $seatDeck
     * @access public
     */
    public $seatDeck = null;

    /**
     * @var AlphaNumericString_Length1To1 $specialPassengerType
     * @access public
     */
    public $specialPassengerType = null;

}

class RailSeatPreferencesType {

    /**
     * @var AlphaNumericString_Length1To1 $seatRequestFunction
     * @access public
     */
    public $seatRequestFunction = null;

    /**
     * @var AlphaString_Length1To1 $smokingIndicator
     * @access public
     */
    public $smokingIndicator = null;

    /**
     * @var ClassDetailsType $classDetails
     * @access public
     */
    public $classDetails = null;

    /**
     * @var RailSeatConfigurationType $seatConfiguration
     * @access public
     */
    public $seatConfiguration = null;

}

class RailSeatReferenceInformationType {

    /**
     * @var SeatReferenceInformationType $railSeatReferenceDetails
     * @access public
     */
    public $railSeatReferenceDetails = null;

}

class RailSleeperDescriptionType {

    /**
     * @var AlphaNumericString_Length2To2 $berthDeck
     * @access public
     */
    public $berthDeck = null;

    /**
     * @var AlphaNumericString_Length2To2 $cabinPosition
     * @access public
     */
    public $cabinPosition = null;

    /**
     * @var AlphaNumericString_Length2To2 $cabinShareType
     * @access public
     */
    public $cabinShareType = null;

    /**
     * @var AlphaNumericString_Length2To2 $cabinOccupancy
     * @access public
     */
    public $cabinOccupancy = null;

}

class RangeDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $rangeQualifier
     * @access public
     */
    public $rangeQualifier = null;

    /**
     * @var RangeTypeI $rangeDetails
     * @access public
     */
    public $rangeDetails = null;

}

class RangeDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $rangeQualifier
     * @access public
     */
    public $rangeQualifier = null;

    /**
     * @var RangeTypeU $rangeDetails
     * @access public
     */
    public $rangeDetails = null;

}

class RangeOfRowsDetailsTypeI {

    /**
     * @var NumericInteger_Length1To3 $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $seatColumn
     * @access public
     */
    public $seatColumn = null;

}

class RangeTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $dataType
     * @access public
     */
    public $dataType = null;

    /**
     * @var NumericInteger_Length1To3 $min
     * @access public
     */
    public $min = null;

    /**
     * @var NumericInteger_Length1To3 $max
     * @access public
     */
    public $max = null;

}

class RangeTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $dataType
     * @access public
     */
    public $dataType = null;

    /**
     * @var NumericInteger_Length1To2 $minOccupancy
     * @access public
     */
    public $minOccupancy = null;

    /**
     * @var NumericInteger_Length1To2 $maxOccupancy
     * @access public
     */
    public $maxOccupancy = null;

}

class RateCodeRestrictedType {

    /**
     * @var AlphaNumericString_Length1To4 $rateCode
     * @access public
     */
    public $rateCode = null;

}

class RateIndicatorsType {

    /**
     * @var AlphaString_Length1To1 $rateChangeIndicator
     * @access public
     */
    public $rateChangeIndicator = null;

}

class RateInformationDetailsType {

    /**
     * @var AlphaNumericString_Length2To2 $ratePlan
     * @access public
     */
    public $ratePlan = null;

}

class RateInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To9 $category
     * @access public
     */
    public $category = null;

}

class RateInformationTypeI_192821C {

    /**
     * @var AlphaNumericString_Length2To2 $category
     * @access public
     */
    public $category = null;

}

class RateInformationTypeI_192848C {

    /**
     * @var AlphaNumericString_Length1To3 $category
     * @access public
     */
    public $category = null;

}

class RateInformationTypeI_50732C {

    /**
     * @var AlphaNumericString_Length1To9 $fareGroup
     * @access public
     */
    public $fareGroup = null;

}

class RateInformationType {

    /**
     * @var RatePriceType $ratePrice
     * @access public
     */
    public $ratePrice = null;

    /**
     * @var RateInformationDetailsType $rateInfo
     * @access public
     */
    public $rateInfo = null;

    /**
     * @var RateIndicatorsType $rateIndicator
     * @access public
     */
    public $rateIndicator = null;

}

class RatePriceType {

    /**
     * @var NumericDecimal_Length1To11 $rateAmount
     * @access public
     */
    public $rateAmount = null;

}

class RateTariffClassInformationTypeI {

    /**
     * @var AlphaNumericString_Length1To6 $rateTariffClass
     * @access public
     */
    public $rateTariffClass = null;

    /**
     * @var AlphaNumericString_Length1To3 $rateTariffIndicator
     * @access public
     */
    public $rateTariffIndicator = null;

    /**
     * @var AlphaNumericString_Length1To6 $otherRateTariffClass
     * @access public
     */
    public $otherRateTariffClass = null;

    /**
     * @var AlphaNumericString_Length1To6 $otherRateTariffIndicator
     * @access public
     */
    public $otherRateTariffIndicator = null;

}

class RateTypesTypeU {

    /**
     * @var AlphaNumericString_Length1To15 $rateCode
     * @access public
     */
    public $rateCode = null;

}

class ReferenceInfoType_129703S {

    /**
     * @var ReferencingDetailsType_188873C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInfoType_25422S {

    /**
     * @var ReferencingDetailsTypeI_46317C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInfoType_6074S {

    /**
     * @var ReferencingDetailsType $reference
     * @access public
     */
    public $reference = null;

}

class ReferenceInfoType_94524S {

    /**
     * @var ReferencingDetailsType_142140C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInfoType_94566S {

    /**
     * @var ReferencingDetailsType_142187C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationTypeI {

    /**
     * @var ReferencingDetailsTypeI_185716C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationTypeI_129127S {

    /**
     * @var ReferencingDetailsTypeI_188155C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationTypeI_132930S {

    /**
     * @var ReferencingDetailsTypeI_192843C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationTypeI_25132S {

    /**
     * @var ReferencingDetailsTypeI_45901C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationTypeI_79009S {

    /**
     * @var ReferencingDetailsTypeI $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationTypeI_79033S {

    /**
     * @var ReferencingDetailsTypeI_121390C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationTypeI_83551S {

    /**
     * @var ReferencingDetailsTypeI_127514C $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferenceInformationType {

    /**
     * @var ReferencingDetailsType_108978C $passengerReference
     * @access public
     */
    public $passengerReference = null;

}

class ReferenceInformationType_129701S {

    /**
     * @var ReferencingDetailsType_188873C $passengerReference
     * @access public
     */
    public $passengerReference = null;

}

class ReferenceInformationType_65487S {

    /**
     * @var ReferencingDetailsTypeI $passengerReference
     * @access public
     */
    public $passengerReference = null;

}

class ReferencingDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To10 $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $dataValue
     * @access public
     */
    public $dataValue = null;

}

class ReferencingDetailsTypeI_121390C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To15 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsTypeI_127514C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To10 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsTypeI_17164C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To5 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsTypeI_185716C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class ReferencingDetailsTypeI_188155C {

    /**
     * @var AMA_EDICodesetType_Length1to3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsTypeI_192843C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsTypeI_36941C {

    /**
     * @var AlphaNumericString_Length1To5 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsTypeI_45901C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsTypeI_46317C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To2 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsType_111975C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To9 $number
     * @access public
     */
    public $number = null;

}

class ReferencingDetailsType_127526C {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To5 $number
     * @access public
     */
    public $number = null;

}

class ReferencingDetailsType_142140C {

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsType_142187C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsType_188870C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To5 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsType_188873C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To5 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsType_193035C {

    /**
     * @var AlphaNumericString_Length1To3 $marriageQualifier
     * @access public
     */
    public $marriageQualifier = null;

    /**
     * @var AlphaNumericString_Length1To5 $tatooNum
     * @access public
     */
    public $tatooNum = null;

}

class RelatedLocationOneIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

}

class RelatedLocationOneIdentificationTypeU_188145C {

    /**
     * @var AlphaNumericString_Length1To10 $code
     * @access public
     */
    public $code = null;

}

class RelatedLocationOneIdentificationTypeU_192837C {

    /**
     * @var AlphaNumericString_Length1To25 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To17 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $agency
     * @access public
     */
    public $agency = null;

}

class RelatedLocationOneIdentificationTypeU_192918C {

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To2 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class RelatedLocationOneIdentificationTypeU_46345C {

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class RelatedLocationOneIdentificationType {

    /**
     * @var AlphaNumericString_Length1To25 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To17 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To3 $agency
     * @access public
     */
    public $agency = null;

}

class RelatedLocationOneIdentificationType_187710C {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

}

class RelatedLocationOneIdentificationType_188361C {

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To2 $qualifier
     * @access public
     */
    public $qualifier = null;

}

class RelatedLocationTwoIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

}

class RelatedLocationTwoIdentificationType {

    /**
     * @var AlphaNumericString_Length1To3 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To70 $name
     * @access public
     */
    public $name = null;

}

class RelatedProductInformationTypeI {

    /**
     * @var NumericInteger_Length1To2 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaString_Length1To2 $status
     * @access public
     */
    public $status = null;

}

class RelatedProductInformationType {

    /**
     * @var NumericInteger_Length1To3 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AMA_EDICodesetType_Length1to3 $statusCode
     * @access public
     */
    public $statusCode = null;

}

class ReservationControlInformationDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To8 $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class ReservationControlInformationDetailsTypeI_16352C {

    /**
     * @var AlphaNumericString_Length1To19 $controlNumber
     * @access public
     */
    public $controlNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $controlType
     * @access public
     */
    public $controlType = null;

}

class ReservationControlInformationDetailsTypeI_18446C {

    /**
     * @var AlphaNumericString_Length1To20 $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class ReservationControlInformationDetailsTypeI_192806C {

    /**
     * @var AlphaNumericString_Length6To6 $controlNumber
     * @access public
     */
    public $controlNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $controlType
     * @access public
     */
    public $controlType = null;

}

class ReservationControlInformationDetailsTypeI_192842C {

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To19 $controlNumber
     * @access public
     */
    public $controlNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $controlType
     * @access public
     */
    public $controlType = null;

    /**
     * @var NumericInteger_Length6To6 $date
     * @access public
     */
    public $date = null;

    /**
     * @var NumericInteger_Length4To4 $time
     * @access public
     */
    public $time = null;

}

class ReservationControlInformationDetailsTypeI_274231C {

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To19 $controlNumber
     * @access public
     */
    public $controlNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $controlType
     * @access public
     */
    public $controlType = null;

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var NumericInteger_Length4To4 $time
     * @access public
     */
    public $time = null;

}

class ReservationControlInformationDetailsTypeI_35709C {

    /**
     * @var AlphaNumericString_Length1To17 $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class ReservationControlInformationDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To22 $value
     * @access public
     */
    public $value = null;

}

class ReservationControlInformationDetailsTypeU_46323C {

    /**
     * @var AlphaNumericString_Length1To4 $tourOperatorCode
     * @access public
     */
    public $tourOperatorCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $reservationControlNumberQual
     * @access public
     */
    public $reservationControlNumberQual = null;

    /**
     * @var AlphaNumericString_Length1To32 $reservationControlNumber
     * @access public
     */
    public $reservationControlNumber = null;

}

class ReservationControlInformationDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To20 $controlNumber
     * @access public
     */
    public $controlNumber = null;

    /**
     * @var AMA_EDICodesetType_Length1 $controlType
     * @access public
     */
    public $controlType = null;

}

class ReservationControlInformationDetailsType_191415C {

    /**
     * @var AlphaNumericString_Length1To35 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To20 $controlNumber
     * @access public
     */
    public $controlNumber = null;

    /**
     * @var AMA_EDICodesetType_Length1 $controlType
     * @access public
     */
    public $controlType = null;

    /**
     * @var AlphaNumericString_Length1To35 $date
     * @access public
     */
    public $date = null;

    /**
     * @var NumericInteger_Length1To9 $time
     * @access public
     */
    public $time = null;

}

class ReservationControlInformationTypeI {

    /**
     * @var ReservationControlInformationDetailsTypeI $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationTypeI_132902S {

    /**
     * @var ReservationControlInformationDetailsTypeI $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationTypeI_132903S {

    /**
     * @var ReservationControlInformationDetailsTypeI_192806C $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationTypeI_132929S {

    /**
     * @var ReservationControlInformationDetailsTypeI_192842C $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationTypeI_132961S {

    /**
     * @var ReservationControlInformationDetailsTypeI_16352C $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationTypeI_196500S {

    /**
     * @var ReservationControlInformationDetailsTypeI_274231C $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationTypeI_20153S {

    /**
     * @var ReservationControlInformationDetailsTypeI_35709C $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationTypeU {

    /**
     * @var ReservationControlInformationDetailsTypeU $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReservationControlInformationTypeU_25427S {

    /**
     * @var ReservationControlInformationDetailsTypeU_46323C $reservationControlId
     * @access public
     */
    public $reservationControlId = null;

}

class ReservationControlInformationType {

    /**
     * @var ReservationControlInformationDetailsTypeI $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationControlInformationType_131820S {

    /**
     * @var ReservationControlInformationDetailsType_191415C $reservation
     * @access public
     */
    public $reservation = null;

}

class ReservationSecurityInformationType {

    /**
     * @var SecondRpLineInformationType $secondRpInformation
     * @access public
     */
    public $secondRpInformation = null;

}

class ReservationSecurityInformationType_156156S {

    /**
     * @var ResponsibilityInformationType $responsibilityInformation
     * @access public
     */
    public $responsibilityInformation = null;

    /**
     * @var TicketInformationType_5120C $queueingInformation
     * @access public
     */
    public $queueingInformation = null;

    /**
     * @var AlphaString_Length3To3 $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var SecondRpLineInformationType_222592C $secondRpInformation
     * @access public
     */
    public $secondRpInformation = null;

}

class ReservationSecurityInformationType_167774S {

    /**
     * @var ResponsibilityInformationType_6835C $responsibilityInformation
     * @access public
     */
    public $responsibilityInformation = null;

    /**
     * @var TicketInformationType_5120C $queueingInformation
     * @access public
     */
    public $queueingInformation = null;

    /**
     * @var AlphaString_Length3To3 $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var SecondRpLineInformationType_237258C $secondRpInformation
     * @access public
     */
    public $secondRpInformation = null;

}

class ResponseIdentificationType {

    /**
     * @var AlphaNumericString_Length1To15 $transacIdentifier
     * @access public
     */
    public $transacIdentifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $validationCode
     * @access public
     */
    public $validationCode = null;

    /**
     * @var AlphaNumericString_Length6To9 $banknetRefNumber
     * @access public
     */
    public $banknetRefNumber = null;

    /**
     * @var AlphaNumericString_Length4To4 $banknetDate
     * @access public
     */
    public $banknetDate = null;

}

class ResponsibilityInformationType {

    /**
     * @var AlphaNumericString_Length2To2 $typeOfPnrElement
     * @access public
     */
    public $typeOfPnrElement = null;

    /**
     * @var AlphaNumericString_Length4To4 $agentId
     * @access public
     */
    public $agentId = null;

    /**
     * @var AlphaNumericString_Length1To9 $officeId
     * @access public
     */
    public $officeId = null;

    /**
     * @var NumericInteger_Length8To8 $iataCode
     * @access public
     */
    public $iataCode = null;

}

class ResponsibilityInformationType_6835C {

    /**
     * @var AlphaNumericString_Length2To2 $typeOfPnrElement
     * @access public
     */
    public $typeOfPnrElement = null;

    /**
     * @var AlphaNumericString_Length4To4 $agentId
     * @access public
     */
    public $agentId = null;

    /**
     * @var AlphaNumericString_Length1To9 $officeId
     * @access public
     */
    public $officeId = null;

    /**
     * @var NumericInteger_Length1To9 $iataCode
     * @access public
     */
    public $iataCode = null;

}

class RevenueManagementDataType {

    /**
     * @var OverbookingDetailsType $overbooking
     * @access public
     */
    public $overbooking = null;

}

class RoomDetailsType {

    /**
     * @var NumericInteger_Length1To1 $occupancy
     * @access public
     */
    public $occupancy = null;

    /**
     * @var AlphaNumericString_Length1To4 $typeCode
     * @access public
     */
    public $typeCode = null;

}

class RuleDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To1 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaNumericString_Length1To3 $quantityUnit
     * @access public
     */
    public $quantityUnit = null;

}

class RuleDetailsTypeU_187647C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To15 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaNumericString_Length1To3 $quantityUnit
     * @access public
     */
    public $quantityUnit = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To7 $daysOfOperation
     * @access public
     */
    public $daysOfOperation = null;

    /**
     * @var NumericDecimal_Length1To35 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class RuleDetailsTypeU_192871C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To15 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaNumericString_Length1To3 $quantityUnit
     * @access public
     */
    public $quantityUnit = null;

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To7 $daysOfOperation
     * @access public
     */
    public $daysOfOperation = null;

    /**
     * @var NumericInteger_Length1To35 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class RuleInformationTypeU {

    /**
     * @var RuleDetailsTypeU $ruleDetails
     * @access public
     */
    public $ruleDetails = null;

    /**
     * @var RuleStatusTypeU $ruleStatusDetails
     * @access public
     */
    public $ruleStatusDetails = null;

}

class RuleInformationTypeU_128789S {

    /**
     * @var RuleDetailsTypeU_187647C $ruleDetails
     * @access public
     */
    public $ruleDetails = null;

    /**
     * @var RuleTextTypeU $ruleText
     * @access public
     */
    public $ruleText = null;

}

class RuleInformationTypeU_132946S {

    /**
     * @var RuleDetailsTypeU_192871C $ruleDetails
     * @access public
     */
    public $ruleDetails = null;

    /**
     * @var RuleTextTypeU_192872C $ruleText
     * @access public
     */
    public $ruleText = null;

}

class RuleStatusTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $statusType
     * @access public
     */
    public $statusType = null;

    /**
     * @var AlphaNumericString_Length1To3 $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class RuleTextTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $textType
     * @access public
     */
    public $textType = null;

    /**
     * @var AlphaNumericString_Length1To512 $freeText
     * @access public
     */
    public $freeText = null;

}

class RuleTextTypeU_192872C {

    /**
     * @var AlphaNumericString_Length1To3 $textType
     * @access public
     */
    public $textType = null;

    /**
     * @var AlphaNumericString_Length1To55 $freeText
     * @access public
     */
    public $freeText = null;

}

class SeatCharacteristicDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To2 $characteristics
     * @access public
     */
    public $characteristics = null;

}

class SeatCharacteristicDetailsTypeI_193061C {

    /**
     * @var AlphaNumericString_Length1To2 $characteristics
     * @access public
     */
    public $characteristics = null;

}

class SeatEntityType {

    /**
     * @var SeatRequestType $seatRequest
     * @access public
     */
    public $seatRequest = null;

    /**
     * @var RailSeatReferenceInformationType $railSeatReferenceInformation
     * @access public
     */
    public $railSeatReferenceInformation = null;

    /**
     * @var RailSeatPreferencesType $railSeatPreferences
     * @access public
     */
    public $railSeatPreferences = null;

}

class individualSeatGroup {

    /**
     * @var SeatRequestParametersTypeI $seatPassenger
     * @access public
     */
    public $seatPassenger = null;

    /**
     * @var StatusTypeI_133063S $seatIndicator
     * @access public
     */
    public $seatIndicator = null;

}

class SeatRangeDetailsTypeI {

    /**
     * @var NumericInteger_Length1To3 $seatRow
     * @access public
     */
    public $seatRow = null;

    /**
     * @var NumericInteger_Length1To18 $maximumRange
     * @access public
     */
    public $maximumRange = null;

    /**
     * @var AlphaNumericString_Length1To1 $seatColumn
     * @access public
     */
    public $seatColumn = null;

}

class SeatReferenceInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $coachNumber
     * @access public
     */
    public $coachNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $deckNumber
     * @access public
     */
    public $deckNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $seatNumber
     * @access public
     */
    public $seatNumber = null;

}

class SeatRequestParametersTypeI {

    /**
     * @var RangeOfRowsDetailsTypeI $rangeOfRowsDetails
     * @access public
     */
    public $rangeOfRowsDetails = null;

    /**
     * @var AlphaNumericString_Length1To35 $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

    /**
     * @var AlphaNumericString_Length1To70 $description
     * @access public
     */
    public $description = null;

}

class SeatRequestParametersTypeI_62897S {

    /**
     * @var GenericDetailsTypeI $genericDetails
     * @access public
     */
    public $genericDetails = null;

}

class SeatSelectionDetailsTypeI {

    /**
     * @var SpecificSeatDetailsTypeI $specificSeatDetails
     * @access public
     */
    public $specificSeatDetails = null;

    /**
     * @var AlphaString_Length1To1 $noSmokingIndicator
     * @access public
     */
    public $noSmokingIndicator = null;

    /**
     * @var SeatCharacteristicDetailsTypeI $seatCharacteristicDetails
     * @access public
     */
    public $seatCharacteristicDetails = null;

    /**
     * @var SeatRangeDetailsTypeI $seatRangeDetails
     * @access public
     */
    public $seatRangeDetails = null;

    /**
     * @var AlphaString_Length1To1 $classDesignator
     * @access public
     */
    public $classDesignator = null;

    /**
     * @var NumericInteger_Length1To1 $cabinClass
     * @access public
     */
    public $cabinClass = null;

}

class SeatSelectionDetailsTypeI_133070S {

    /**
     * @var SpecificSeatDetailsTypeI_193060C $specificSeatDetails
     * @access public
     */
    public $specificSeatDetails = null;

    /**
     * @var AlphaString_Length1To1 $noSmokingIndicator
     * @access public
     */
    public $noSmokingIndicator = null;

    /**
     * @var SeatCharacteristicDetailsTypeI_193061C $seatCharacteristicDetails
     * @access public
     */
    public $seatCharacteristicDetails = null;

}

class SecondRpLineInformationType {

    /**
     * @var AlphaNumericString_Length1To9 $creationOfficeId
     * @access public
     */
    public $creationOfficeId = null;

    /**
     * @var AlphaNumericString_Length1To9 $agentSignature
     * @access public
     */
    public $agentSignature = null;

    /**
     * @var Date_DDMMYY $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     * @var AlphaNumericString_Length1To9 $creatorIataCode
     * @access public
     */
    public $creatorIataCode = null;

    /**
     * @var Time24_HHMM $creationTime
     * @access public
     */
    public $creationTime = null;

}

class SecondRpLineInformationType_222592C {

    /**
     * @var AlphaNumericString_Length1To9 $creationOfficeId
     * @access public
     */
    public $creationOfficeId = null;

    /**
     * @var AlphaNumericString_Length1To6 $agentSignature
     * @access public
     */
    public $agentSignature = null;

    /**
     * @var Date_DDMMYY $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     * @var NumericInteger_Length8To8 $creatorIataCode
     * @access public
     */
    public $creatorIataCode = null;

    /**
     * @var Time24_HHMM $creationTime
     * @access public
     */
    public $creationTime = null;

}

class SecondRpLineInformationType_237258C {

    /**
     * @var AlphaNumericString_Length1To9 $creationOfficeId
     * @access public
     */
    public $creationOfficeId = null;

    /**
     * @var AlphaNumericString_Length1To6 $agentSignature
     * @access public
     */
    public $agentSignature = null;

    /**
     * @var Date_DDMMYY $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     * @var NumericInteger_Length1To9 $creatorIataCode
     * @access public
     */
    public $creatorIataCode = null;

    /**
     * @var Time24_HHMM $creationTime
     * @access public
     */
    public $creationTime = null;

}

class SecurityInformationType {

    /**
     * @var AlphaNumericString_Length6To6 $creationDate
     * @access public
     */
    public $creationDate = null;

    /**
     * @var AlphaNumericString_Length4To4 $agentCode
     * @access public
     */
    public $agentCode = null;

    /**
     * @var AlphaNumericString_Length9To9 $officeId
     * @access public
     */
    public $officeId = null;

}

class SegmentCabinIdentificationType {

    /**
     * @var AlphaString_Length1To1 $cabinCode
     * @access public
     */
    public $cabinCode = null;

}

class SegmentGroupingInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $groupingCode
     * @access public
     */
    public $groupingCode = null;

    /**
     * @var ReferencingDetailsType_193035C $marriageDetail
     * @access public
     */
    public $marriageDetail = null;

}

class SelectionDetailsInformationTypeI_192864C {

    /**
     * @var AlphaNumericString_Length1To3 $option
     * @access public
     */
    public $option = null;

}

class SelectionDetailsInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $option
     * @access public
     */
    public $option = null;

    /**
     * @var AlphaNumericString_Length1To35 $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class SelectionDetailsTypeI {

    /**
     * @var SelectionDetailsInformationTypeI $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

}

class SelectionDetailsTypeI_132941S {

    /**
     * @var SelectionDetailsInformationTypeI_192864C $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

}

class SequenceDetailsTypeU_94494S {

    /**
     * @var SequenceInformationTypeU $sequenceDetails
     * @access public
     */
    public $sequenceDetails = null;

}

class SequenceInformationTypeU_24073C {

    /**
     * @var AlphaNumericString_Length1To10 $number
     * @access public
     */
    public $number = null;

}

class ShipIdentificationDetailsType {

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To30 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To3 $cruiseLineCode
     * @access public
     */
    public $cruiseLineCode = null;

}

class ShipIdentificationDetailsType_187530C {

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To30 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length1To3 $cruiseLineCode
     * @access public
     */
    public $cruiseLineCode = null;

}

class ShipIdentificationDetailsType_45069C {

    /**
     * @var AlphaNumericString_Length1To10 $name
     * @access public
     */
    public $name = null;

}

class ShipIdentificationType {

    /**
     * @var ShipIdentificationDetailsType_187530C $shipDetails
     * @access public
     */
    public $shipDetails = null;

}

class ShipIdentificationType_132957S {

    /**
     * @var ShipIdentificationDetailsType $shipDetails
     * @access public
     */
    public $shipDetails = null;

}

class ShipIdentificationType_24553S {

    /**
     * @var ShipIdentificationDetailsType_45069C $shipDetails
     * @access public
     */
    public $shipDetails = null;

}

class SourceTypeDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $sourceQualifier1
     * @access public
     */
    public $sourceQualifier1 = null;

}

class SpecialRequirementsDataDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To4 $data
     * @access public
     */
    public $data = null;

    /**
     * @var AlphaNumericString_Length1To2 $seatType
     * @access public
     */
    public $seatType = null;

}

class SpecialRequirementsDataDetailsTypeI_64826C {

    /**
     * @var AlphaNumericString_Length1To4 $data
     * @access public
     */
    public $data = null;

    /**
     * @var AlphaNumericString_Length1To5 $crossRef
     * @access public
     */
    public $crossRef = null;

    /**
     * @var AlphaNumericString_Length1To2 $seatType
     * @access public
     */
    public $seatType = null;

}

class SpecialRequirementsDetailsTypeI {

    /**
     * @var SpecialRequirementsTypeDetailsTypeI $ssr
     * @access public
     */
    public $ssr = null;

    /**
     * @var SpecialRequirementsDataDetailsTypeI $ssrb
     * @access public
     */
    public $ssrb = null;

}

class SpecialRequirementsDetailsTypeI_133071S {

    /**
     * @var SpecialRequirementsTypeDetailsTypeI_193066C $specialRequirementsInfo
     * @access public
     */
    public $specialRequirementsInfo = null;

    /**
     * @var SpecialRequirementsDataDetailsTypeI $seatDetails
     * @access public
     */
    public $seatDetails = null;

}

class SpecialRequirementsDetailsTypeI_38284S {

    /**
     * @var SpecialRequirementsTypeDetailsTypeI $ssr
     * @access public
     */
    public $ssr = null;

    /**
     * @var SpecialRequirementsDataDetailsTypeI_64826C $ssrb
     * @access public
     */
    public $ssrb = null;

}

class SpecialRequirementsTypeDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To4 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var NumericInteger_Length1To3 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaString_Length3To3 $boardpoint
     * @access public
     */
    public $boardpoint = null;

    /**
     * @var AlphaString_Length3To3 $offpoint
     * @access public
     */
    public $offpoint = null;

    /**
     * @var AlphaNumericString_Length1To70 $freetext
     * @access public
     */
    public $freetext = null;

}

class SpecialRequirementsTypeDetailsTypeI_193066C {

    /**
     * @var AlphaNumericString_Length1To4 $ssrCode
     * @access public
     */
    public $ssrCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $actionCode
     * @access public
     */
    public $actionCode = null;

    /**
     * @var NumericInteger_Length1To15 $numberInParty
     * @access public
     */
    public $numberInParty = null;

    /**
     * @var AlphaNumericString_Length1To3 $airlineCode
     * @access public
     */
    public $airlineCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $serviceType
     * @access public
     */
    public $serviceType = null;

    /**
     * @var AlphaNumericString_Length1To3 $otherServiceType
     * @access public
     */
    public $otherServiceType = null;

    /**
     * @var AlphaNumericString_Length1To3 $boardPoint
     * @access public
     */
    public $boardPoint = null;

    /**
     * @var AlphaNumericString_Length1To3 $offPoint
     * @access public
     */
    public $offPoint = null;

    /**
     * @var AlphaNumericString_Length1To70 $serviceFreeText
     * @access public
     */
    public $serviceFreeText = null;

}

class SpecificDataInformationTypeI {

    /**
     * @var DataTypeInformationTypeI $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     * @var DataInformationTypeI_188173C $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class SpecificDataInformationTypeI_79035S {

    /**
     * @var DataTypeInformationTypeI $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     * @var DataInformationTypeI $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class SpecificSeatDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To4 $seat
     * @access public
     */
    public $seat = null;

}

class SpecificSeatDetailsTypeI_193060C {

    /**
     * @var AlphaNumericString_Length1To2 $seat
     * @access public
     */
    public $seat = null;

}

class SpecificVisaLinkCreditCardInformationType {

    /**
     * @var MessageReferenceType $msgRef
     * @access public
     */
    public $msgRef = null;

    /**
     * @var ResponseIdentificationType $respIdentification
     * @access public
     */
    public $respIdentification = null;

}

class StationInformationTypeI_119771C {

    /**
     * @var AlphaNumericString_Length1To2 $terminal
     * @access public
     */
    public $terminal = null;

}

class StationInformationTypeI_192797C {

    /**
     * @var AlphaNumericString_Length1To2 $arrivalTerminal
     * @access public
     */
    public $arrivalTerminal = null;

}

class StationInformationType {

    /**
     * @var AlphaNumericString_Length1To25 $terminal
     * @access public
     */
    public $terminal = null;

}

class StatusDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class StatusDetailsTypeI_148341C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class StatusDetailsTypeI_185722C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class StatusDetailsTypeI_192809C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $action
     * @access public
     */
    public $action = null;

}

class StatusDetailsTypeI_20684C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To70 $description
     * @access public
     */
    public $description = null;

}

class StatusDetailsTypeI_37285C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class StatusDetailsTypeI_57035C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $isPNRModifDuringTrans
     * @access public
     */
    public $isPNRModifDuringTrans = null;

}

class StatusDetailsTypeS {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class StatusDetailsType_142998C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $action
     * @access public
     */
    public $action = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class StatusDetailsType_148479C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class StatusDetailsType_215781C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

}

class StatusDetailsType_250789C {

    /**
     * @var AlphaNumericString_Length1To3 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To70 $description
     * @access public
     */
    public $description = null;

}

class StatusTypeI {

    /**
     * @var StatusDetailsTypeI $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusTypeI_127261S {

    /**
     * @var StatusDetailsTypeI_185722C $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusTypeI_13270S {

    /**
     * @var StatusDetailsTypeI_20684C $statusDetails
     * @access public
     */
    public $statusDetails = null;

    /**
     * @var StatusDetailsTypeI_20684C $otherStatusDetails
     * @access public
     */
    public $otherStatusDetails = null;

}

class StatusTypeI_132979S {

    /**
     * @var StatusDetailsTypeI_148341C $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusTypeI_133063S {

    /**
     * @var StatusDetailsTypeI_192809C $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusTypeI_20923S {

    /**
     * @var StatusDetailsTypeI_37285C $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusTypeI_32775S {

    /**
     * @var StatusDetailsTypeI_57035C $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusTypeS {

    /**
     * @var StatusDetailsTypeS $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusType_132908S {

    /**
     * @var StatusDetailsTypeI_192809C $statusInformation
     * @access public
     */
    public $statusInformation = null;

}

class StatusType_133007S {

    /**
     * @var StatusDetailsType_142998C $statusDetails
     * @access public
     */
    public $statusDetails = null;

}

class StatusType_150135S {

    /**
     * @var StatusDetailsType_215781C $statusInformation
     * @access public
     */
    public $statusInformation = null;

}

class StatusType_178422S {

    /**
     * @var StatusDetailsType_250789C $statusInformation
     * @access public
     */
    public $statusInformation = null;

}

class StatusType_94568S {

    /**
     * @var StatusDetailsType $statusInformation
     * @access public
     */
    public $statusInformation = null;

}

class StatusType_99582S {

    /**
     * @var StatusDetailsType_148479C $statusInformation
     * @access public
     */
    public $statusInformation = null;

}

class StructuredAddressInformationType {

    /**
     * @var AlphaNumericString_Length1To2 $optionA1
     * @access public
     */
    public $optionA1 = null;

    /**
     * @var AlphaNumericString_Length1To50 $optionTextA1
     * @access public
     */
    public $optionTextA1 = null;

}

class StructuredAddressType {

    /**
     * @var AlphaNumericString_Length1To4 $informationType
     * @access public
     */
    public $informationType = null;

    /**
     * @var StructuredAddressInformationType $address
     * @access public
     */
    public $address = null;

    /**
     * @var StructuredAddressInformationType_5063C $optionalData
     * @access public
     */
    public $optionalData = null;

}

class StructuredDateTimeInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_128682S {

    /**
     * @var StructuredDateTimeType_139827C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_128714S {

    /**
     * @var StructuredDateTimeType_187528C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_128728S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType_187544C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_128730S {

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_187547C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_128779S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType_187547C $dateTime
     * @access public
     */
    public $dateTime = null;

    /**
     * @var TimeZoneIinformationType $timeZoneInfo
     * @access public
     */
    public $timeZoneInfo = null;

}

class StructuredDateTimeInformationType_129128S {

    /**
     * @var StructuredDateTimeType_188156C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_129285S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType_188350C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_132821S {

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_187544C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_132956S {

    /**
     * @var StructuredDateTimeType_187528C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_20645S {

    /**
     * @var StructuredDateTimeType_36777C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_21109S {

    /**
     * @var StructuredDateTimeType_35730C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_25444S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType_187528C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_27086S {

    /**
     * @var StructuredDateTimeType_16347C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_79014S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_83553S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType_127515C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_94516S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_142129C $dateTime
     * @access public
     */
    public $dateTime = null;

    /**
     * @var TimeZoneIinformationType $timeZoneInfo
     * @access public
     */
    public $timeZoneInfo = null;

}

class StructuredDateTimeInformationType_94559S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var StructuredDateTimeType_142180C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeInformationType_94567S {

    /**
     * @var StructuredDateTimeType_142188C $dateTime
     * @access public
     */
    public $dateTime = null;

}

class StructuredDateTimeType_127515C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

    /**
     * @var NumericInteger_Length1To2 $seconds
     * @access public
     */
    public $seconds = null;

}

class StructuredDateTimeType_139827C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

}

class StructuredDateTimeType_142129C {

    /**
     * @var NumericInteger_Length4To4 $year
     * @access public
     */
    public $year = null;

    /**
     * @var NumericInteger_Length1To2 $month
     * @access public
     */
    public $month = null;

    /**
     * @var NumericInteger_Length1To2 $day
     * @access public
     */
    public $day = null;

    /**
     * @var NumericInteger_Length1To2 $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var NumericInteger_Length1To2 $minutes
     * @access public
     */
    public $minutes = null;

    /**
     * @var NumericInteger_Length1To2 $seconds
     * @access public
     */
    public $seconds = null;

    /**
     * @var NumericInteger_Length1To3 $milliseconds
     * @access public
     */
    public $milliseconds = null;

}

class StructuredDateTimeType_142180C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

    /**
     * @var NumericInteger_Length1To2 $seconds
     * @access public
     */
    public $seconds = null;

    /**
     * @var NumericInteger_Length1To3 $milliseconds
     * @access public
     */
    public $milliseconds = null;

}

class StructuredDateTimeType_142188C {

    /**
     * @var NumericInteger_Length4To4 $year
     * @access public
     */
    public $year = null;

    /**
     * @var NumericInteger_Length1To2 $month
     * @access public
     */
    public $month = null;

    /**
     * @var NumericInteger_Length1To2 $day
     * @access public
     */
    public $day = null;

}

class StructuredDateTimeType_16347C {

    /**
     * @var NumericInteger_Length1To4 $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

}

class StructuredDateTimeType_18725C {

    /**
     * @var NumericInteger_Length1To6 $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

    /**
     * @var NumericInteger_Length1To6 $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var NumericInteger_Length1To6 $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_187474C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

    /**
     * @var NumericInteger_Length1To2 $seconds
     * @access public
     */
    public $seconds = null;

}

class StructuredDateTimeType_187528C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

}

class StructuredDateTimeType_187544C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_187547C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

    /**
     * @var NumericInteger_Length1To2 $seconds
     * @access public
     */
    public $seconds = null;

    /**
     * @var NumericInteger_Length1To3 $milliseconds
     * @access public
     */
    public $milliseconds = null;

}

class StructuredDateTimeType_188156C {

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_188350C {

    /**
     * @var Year_YYYY $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_192844C {

    /**
     * @var NumericInteger_Length4To4 $year
     * @access public
     */
    public $year = null;

    /**
     * @var NumericInteger_Length1To2 $month
     * @access public
     */
    public $month = null;

    /**
     * @var NumericInteger_Length1To2 $day
     * @access public
     */
    public $day = null;

    /**
     * @var NumericInteger_Length1To2 $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var NumericInteger_Length1To2 $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_192881C {

    /**
     * @var NumericInteger_Length1To2 $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var NumericInteger_Length1To2 $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_192963C {

    /**
     * @var NumericInteger_Length1To6 $year
     * @access public
     */
    public $year = null;

    /**
     * @var NumericInteger_Length1To2 $month
     * @access public
     */
    public $month = null;

    /**
     * @var NumericInteger_Length1To2 $day
     * @access public
     */
    public $day = null;

    /**
     * @var NumericInteger_Length1To6 $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var NumericInteger_Length1To6 $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_35730C {

    /**
     * @var Hour_hH $hour
     * @access public
     */
    public $hour = null;

    /**
     * @var Minute_mM $minutes
     * @access public
     */
    public $minutes = null;

}

class StructuredDateTimeType_36777C {

    /**
     * @var NumericInteger_Length4To4 $year
     * @access public
     */
    public $year = null;

    /**
     * @var Month_mM $month
     * @access public
     */
    public $month = null;

    /**
     * @var Day_nN $day
     * @access public
     */
    public $day = null;

}

class StructuredPeriodInformationType_11026S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_18725C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_18725C $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class StructuredPeriodInformationType_128716S {

    /**
     * @var StructuredDateTimeType_187528C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_187528C $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class StructuredPeriodInformationType_128769S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_187544C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_187544C $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class StructuredPeriodInformationType_128780S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_187547C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_187547C $endDateTime
     * @access public
     */
    public $endDateTime = null;

    /**
     * @var FrequencyType $frequency
     * @access public
     */
    public $frequency = null;

    /**
     * @var TimeZoneIinformationType $timeZoneInfo
     * @access public
     */
    public $timeZoneInfo = null;

}

class StructuredPeriodInformationType_132931S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_192844C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_192844C $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class StructuredPeriodInformationType_132950S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_192881C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_192881C $endDateTime
     * @access public
     */
    public $endDateTime = null;

    /**
     * @var FrequencyType_192845C $frequency
     * @access public
     */
    public $frequency = null;

}

class StructuredPeriodInformationType_133006S {

    /**
     * @var AlphaNumericString_Length1To3 $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var AlphaNumericString_Length1To3 $timeMode
     * @access public
     */
    public $timeMode = null;

    /**
     * @var StructuredDateTimeType_192963C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_192963C $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class StructuredPeriodInformationType_8955S {

    /**
     * @var StructuredDateTimeType_16347C $beginDateTime
     * @access public
     */
    public $beginDateTime = null;

    /**
     * @var StructuredDateTimeType_16347C $endDateTime
     * @access public
     */
    public $endDateTime = null;

}

class StructuredTelephoneNumberType {

    /**
     * @var AlphaNumericString_Length1To32 $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

}

class StructuredTelephoneNumberType_187460C {

    /**
     * @var AlphaNumericString_Length1To10 $internationalDialCode
     * @access public
     */
    public $internationalDialCode = null;

    /**
     * @var AlphaNumericString_Length1To10 $localPrefixCode
     * @access public
     */
    public $localPrefixCode = null;

    /**
     * @var AlphaNumericString_Length1To25 $areaCode
     * @access public
     */
    public $areaCode = null;

    /**
     * @var AlphaNumericString_Length1To25 $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

}

class StructuredTelephoneNumberType_187583C {

    /**
     * @var AlphaNumericString_Length1To32 $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

}

class StructuredTelephoneNumberType_192858C {

    /**
     * @var AlphaNumericString_Length1To20 $telephoneNumber
     * @access public
     */
    public $telephoneNumber = null;

}

class SubclassIdentificationType {

    /**
     * @var NumericInteger_Length1To1 $subclassId
     * @access public
     */
    public $subclassId = null;

}

class SystemDetailsInfoType {

    /**
     * @var AlphaNumericString_Length1To50 $workstationId
     * @access public
     */
    public $workstationId = null;

    /**
     * @var SystemDetailsTypeI_192689C $deliveringSystem
     * @access public
     */
    public $deliveringSystem = null;

}

class SystemDetailsInfoType_132969S {

    /**
     * @var SystemDetailsTypeI_192903C $deliveringSystem
     * @access public
     */
    public $deliveringSystem = null;

}

class SystemDetailsInfoType_25482S {

    /**
     * @var SystemDetailsTypeI_46415C $cascadingSystem
     * @access public
     */
    public $cascadingSystem = null;

}

class SystemDetailsInfoType_94569S {

    /**
     * @var AlphaNumericString_Length1To25 $workstationId
     * @access public
     */
    public $workstationId = null;

    /**
     * @var SystemDetailsTypeI $deliveringSystem
     * @access public
     */
    public $deliveringSystem = null;

}

class SystemDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To35 $companyId
     * @access public
     */
    public $companyId = null;

}

class SystemDetailsTypeI_192689C {

    /**
     * @var AlphaNumericString_Length1To35 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To25 $locationId
     * @access public
     */
    public $locationId = null;

}

class SystemDetailsTypeI_192903C {

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To3 $locationId
     * @access public
     */
    public $locationId = null;

}

class SystemDetailsTypeI_46415C {

    /**
     * @var AlphaNumericString_Length1To12 $companyId
     * @access public
     */
    public $companyId = null;

}

class TariffInformationDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To20 $rateType
     * @access public
     */
    public $rateType = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To3 $ratePlanIndicator
     * @access public
     */
    public $ratePlanIndicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $amountType
     * @access public
     */
    public $amountType = null;

    /**
     * @var AlphaNumericString_Length1To3 $rateChangeIndicator
     * @access public
     */
    public $rateChangeIndicator = null;

}

class TariffInformationDetailsTypeI_187784C {

    /**
     * @var AlphaNumericString_Length1To3 $rateChangeIndicator
     * @access public
     */
    public $rateChangeIndicator = null;

}

class TariffInformationDetailsTypeI_188214C {

    /**
     * @var AlphaNumericString_Length1To20 $rateType
     * @access public
     */
    public $rateType = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To3 $ratePlanIndicator
     * @access public
     */
    public $ratePlanIndicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $amountType
     * @access public
     */
    public $amountType = null;

    /**
     * @var AlphaNumericString_Length1To3 $rateChangeIndicator
     * @access public
     */
    public $rateChangeIndicator = null;

    /**
     * @var AlphaNumericString_Length1To35 $firstDate
     * @access public
     */
    public $firstDate = null;

}

class TariffInformationDetailsTypeI_192820C {

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

}

class TariffInformationDetailsTypeI_192847C {

    /**
     * @var AlphaNumericString_Length1To20 $rateType
     * @access public
     */
    public $rateType = null;

    /**
     * @var NumericInteger_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To3 $ratePlanIndicator
     * @access public
     */
    public $ratePlanIndicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $amountType
     * @access public
     */
    public $amountType = null;

    /**
     * @var AlphaNumericString_Length1To3 $rateChangeIndicator
     * @access public
     */
    public $rateChangeIndicator = null;

}

class TariffInformationDetailsTypeI_192865C {

    /**
     * @var AlphaNumericString_Length1To3 $rateChangeIndicator
     * @access public
     */
    public $rateChangeIndicator = null;

}

class TariffInformationDetailsTypeI_193000C {

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var AlphaNumericString_Length1To3 $amountType
     * @access public
     */
    public $amountType = null;

    /**
     * @var NumericDecimal_Length1To18 $totalAmount
     * @access public
     */
    public $totalAmount = null;

}

class TariffInformationDetailsTypeI_50731C {

    /**
     * @var AlphaNumericString_Length1To8 $fareBasisCode
     * @access public
     */
    public $fareBasisCode = null;

    /**
     * @var NumericDecimal_Length1To18 $fareBaseAmount
     * @access public
     */
    public $fareBaseAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

}

class TariffInformationDetailsTypeU {

    /**
     * @var NumericDecimal_Length1To18 $priceAmount
     * @access public
     */
    public $priceAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $priceQualifier
     * @access public
     */
    public $priceQualifier = null;

}

class TariffInformationDetailsTypeU_127523C {

    /**
     * @var NumericDecimal_Length1To18 $priceAmount
     * @access public
     */
    public $priceAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $priceQualifier
     * @access public
     */
    public $priceQualifier = null;

}

class TariffInformationDetailsTypeU_188150C {

    /**
     * @var NumericDecimal_Length1To18 $priceAmount
     * @access public
     */
    public $priceAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $priceQualifier
     * @access public
     */
    public $priceQualifier = null;

}

class TariffInformationDetailsTypeU_188166C {

    /**
     * @var NumericDecimal_Length1To18 $priceAmount
     * @access public
     */
    public $priceAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $priceQualifier
     * @access public
     */
    public $priceQualifier = null;

}

class TariffInformationDetailsTypeU_46314C {

    /**
     * @var AlphaNumericString_Length1To7 $rateIdentifier
     * @access public
     */
    public $rateIdentifier = null;

    /**
     * @var NumericDecimal_Length1To30 $unitaryAmount
     * @access public
     */
    public $unitaryAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $tariffQualifier
     * @access public
     */
    public $tariffQualifier = null;

    /**
     * @var NumericDecimal_Length1To20 $totalAmount
     * @access public
     */
    public $totalAmount = null;

    /**
     * @var NumericInteger_Length1To3 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaNumericString_Length1To3 $tariffStatus
     * @access public
     */
    public $tariffStatus = null;

}

class TariffInformationTypeI {

    /**
     * @var TariffInformationDetailsTypeI $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     * @var AssociatedChargesInformationTypeI $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_128793S {

    /**
     * @var TariffInformationDetailsTypeI $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     * @var AssociatedChargesInformationTypeI_187653C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_128883S {

    /**
     * @var TariffInformationDetailsTypeI_187784C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var AssociatedChargesInformationTypeI_187653C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_129170S {

    /**
     * @var TariffInformationDetailsTypeI_188214C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     * @var AssociatedChargesInformationTypeI $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_132913S {

    /**
     * @var TariffInformationDetailsTypeI_192820C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI_192821C $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     * @var AssociatedChargesInformationTypeI_192822C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_132932S {

    /**
     * @var TariffInformationDetailsTypeI_192847C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI_192848C $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     * @var AssociatedChargesInformationTypeI_192849C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_132942S {

    /**
     * @var TariffInformationDetailsTypeI_192865C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var AssociatedChargesInformationTypeI_192867C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_132945S {

    /**
     * @var TariffInformationDetailsTypeI_192865C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var AssociatedChargesInformationTypeI_192867C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_133012S {

    /**
     * @var TariffInformationDetailsTypeI_188214C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     * @var AssociatedChargesInformationTypeI $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_133025S {

    /**
     * @var TariffInformationDetailsTypeI_193000C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var AssociatedChargesInformationTypeI_193002C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_136706S {

    /**
     * @var TariffInformationDetailsTypeI $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI_192848C $rateInformation
     * @access public
     */
    public $rateInformation = null;

    /**
     * @var AssociatedChargesInformationTypeI_187653C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_136714S {

    /**
     * @var TariffInformationDetailsTypeI_192865C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var AssociatedChargesInformationTypeI_198218C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_136719S {

    /**
     * @var TariffInformationDetailsTypeI_192865C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var AssociatedChargesInformationTypeI_198218C $chargeDetails
     * @access public
     */
    public $chargeDetails = null;

}

class TariffInformationTypeI_28460S {

    /**
     * @var TariffInformationDetailsTypeI_50731C $tariffInfo
     * @access public
     */
    public $tariffInfo = null;

    /**
     * @var RateInformationTypeI_50732C $rateInformation
     * @access public
     */
    public $rateInformation = null;

}

class TariffInformationTypeU {

    /**
     * @var TariffInformationDetailsTypeU_188150C $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class TariffInformationTypeU_129133S {

    /**
     * @var TariffInformationDetailsTypeU_188166C $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class TariffInformationTypeU_25419S {

    /**
     * @var TariffInformationDetailsTypeU_46314C $tariffInformation
     * @access public
     */
    public $tariffInformation = null;

    /**
     * @var AssociatedChargesInformationTypeU $associatedChargesInformation
     * @access public
     */
    public $associatedChargesInformation = null;

}

class TariffInformationType {

    /**
     * @var TariffInformationDetailsTypeU $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class TariffInformationType_83558S {

    /**
     * @var TariffInformationDetailsTypeU_127523C $priceDetails
     * @access public
     */
    public $priceDetails = null;

}

class TariffcodeType {

    /**
     * @var AlphaNumericString_Length1To35 $tariffCode
     * @access public
     */
    public $tariffCode = null;

    /**
     * @var AlphaNumericString_Length1To35 $tariffCodeType
     * @access public
     */
    public $tariffCodeType = null;

}

class TaxDetailsTypeI_121395C {

    /**
     * @var AlphaNumericString_Length1To17 $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class TaxDetailsTypeI_12177C {

    /**
     * @var AlphaNumericString_Length1To17 $taxRate
     * @access public
     */
    public $taxRate = null;

    /**
     * @var AlphaNumericString_Length1To3 $currCode
     * @access public
     */
    public $currCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $taxType
     * @access public
     */
    public $taxType = null;

}

class TaxDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

}

class TaxFieldsType {

    /**
     * @var AlphaNumericString_Length1To1 $taxIndicator
     * @access public
     */
    public $taxIndicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $taxCurrency
     * @access public
     */
    public $taxCurrency = null;

    /**
     * @var AlphaNumericString_Length1To12 $taxAmount
     * @access public
     */
    public $taxAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $taxCountryCode
     * @access public
     */
    public $taxCountryCode = null;

    /**
     * @var AlphaNumericString_Length1To2 $taxNatureCode
     * @access public
     */
    public $taxNatureCode = null;

}

class TaxType2I {

    /**
     * @var TaxDetailsTypeI_12177C $taxDetails
     * @access public
     */
    public $taxDetails = null;

    /**
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class TaxType2I_79017S {

    /**
     * @var AlphaNumericString_Length1To3 $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     * @var TaxDetailsTypeI $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class TaxType2I_79038S {

    /**
     * @var AlphaNumericString_Length1To3 $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     * @var TaxDetailsTypeI_121395C $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class TaxesType {

    /**
     * @var TaxDetailsTypeU $additionnalCharge
     * @access public
     */
    public $additionnalCharge = null;

}

class TerminalIdentificationDescriptionType {

    /**
     * @var AlphaNumericString_Length8To8 $terminalID
     * @access public
     */
    public $terminalID = null;

    /**
     * @var DistributionChannelType $distributionChannel
     * @access public
     */
    public $distributionChannel = null;

}

class TerminalInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To2 $arrivalTerminal
     * @access public
     */
    public $arrivalTerminal = null;

}

class TerminalTimeInformationTypeS {

    /**
     * @var LocationIdentificationTypeS $locationDetails
     * @access public
     */
    public $locationDetails = null;

}

class ThreeDomainSecureGroupType {

    /**
     * @var CreditCardSecurityType $authenticationData
     * @access public
     */
    public $authenticationData = null;

    /**
     * @var CommunicationContactType $acsURL
     * @access public
     */
    public $acsURL = null;

    /**
     * @var tdsBlobData $tdsBlobData
     * @access public
     */
    public $tdsBlobData = null;

}

class tdsBlobData {

    /**
     * @var ReferenceInfoType_94524S $tdsBlbIdentifier
     * @access public
     */
    public $tdsBlbIdentifier = null;

    /**
     * @var BinaryDataType $tdsBlbData
     * @access public
     */
    public $tdsBlbData = null;

}

class TicketAgentInfoType {

    /**
     * @var AlphaNumericString_Length1To15 $companyIdNumber
     * @access public
     */
    public $companyIdNumber = null;

    /**
     * @var InternalIDDetailsType $internalIdDetails
     * @access public
     */
    public $internalIdDetails = null;

}

class TicketElementType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var TicketInformationType $ticket
     * @access public
     */
    public $ticket = null;

    /**
     * @var AlphaNumericString_Length1To127 $printOptions
     * @access public
     */
    public $printOptions = null;

}

class TicketInformationType {

    /**
     * @var AlphaString_Length2To2 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var Date_DDMMYY $date
     * @access public
     */
    public $date = null;

    /**
     * @var Time24_HHMM $time
     * @access public
     */
    public $time = null;

    /**
     * @var AlphaNumericString_Length1To9 $officeId
     * @access public
     */
    public $officeId = null;

    /**
     * @var AlphaNumericString_Length1To15 $freetext
     * @access public
     */
    public $freetext = null;

    /**
     * @var AlphaNumericString_Length1To3 $airlineCode
     * @access public
     */
    public $airlineCode = null;

    /**
     * @var AlphaNumericString_Length1To3 $queueNumber
     * @access public
     */
    public $queueNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $queueCategory
     * @access public
     */
    public $queueCategory = null;

    /**
     * @var AlphaNumericString_Length7To7 $sitaAddress
     * @access public
     */
    public $sitaAddress = null;

}

class TicketInformationType_5120C {

    /**
     * @var AlphaNumericString_Length1To24 $queueingOfficeId
     * @access public
     */
    public $queueingOfficeId = null;

    /**
     * @var AlphaString_Length3To3 $location
     * @access public
     */
    public $location = null;

}

class TicketNumberDetailsTypeI_192850C {

    /**
     * @var AlphaNumericString_Length1To35 $number
     * @access public
     */
    public $number = null;

}

class TicketNumberDetailsType {

    /**
     * @var NumericInteger_Length1To35 $number
     * @access public
     */
    public $number = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To15 $numberOfBooklets
     * @access public
     */
    public $numberOfBooklets = null;

    /**
     * @var AlphaNumericString_Length1To3 $dataIndicator
     * @access public
     */
    public $dataIndicator = null;

}

class TicketNumberDetailsType_187589C {

    /**
     * @var NumericInteger_Length1To17 $number
     * @access public
     */
    public $number = null;

}

class TicketNumberTypeI_79026S {

    /**
     * @var TicketNumberDetailsTypeI $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class TicketNumberType {

    /**
     * @var NumericInteger_Length3To3 $airline
     * @access public
     */
    public $airline = null;

    /**
     * @var NumericInteger_Length10To10 $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

}

class TicketNumberType_128754S {

    /**
     * @var TicketNumberDetailsType_187589C $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class TicketingFormOfPaymentType {

    /**
     * @var FormOfPaymentInformationType $fopDetails
     * @access public
     */
    public $fopDetails = null;

}

class TimeZoneIinformationType {

    /**
     * @var AlphaNumericString_Length1To3 $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var NumericInteger_Length1To1 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaString_Length1To1 $suffix
     * @access public
     */
    public $suffix = null;

}

class TotalPriceType {

    /**
     * @var CompanyInformationType_83550S $providerCode
     * @access public
     */
    public $providerCode = null;

    /**
     * @var ReferenceInformationTypeI_83551S $externalRef
     * @access public
     */
    public $externalRef = null;

    /**
     * @var methodOfDelivery $methodOfDelivery
     * @access public
     */
    public $methodOfDelivery = null;

    /**
     * @var TariffInformationType $mainPrice
     * @access public
     */
    public $mainPrice = null;

    /**
     * @var TariffInformationType_83558S $otherPrices
     * @access public
     */
    public $otherPrices = null;

    /**
     * @var productDescription $productDescription
     * @access public
     */
    public $productDescription = null;

    /**
     * @var TaxesType $additionnalChargeInformation
     * @access public
     */
    public $additionnalChargeInformation = null;

    /**
     * @var RateTypesTypeU $rateCodeInformation
     * @access public
     */
    public $rateCodeInformation = null;

    /**
     * @var StructuredDateTimeInformationType_83553S $optionalBooking
     * @access public
     */
    public $optionalBooking = null;

}

class methodOfDelivery {

    /**
     * @var ElementManagementSegmentType_132840S $elementManagement
     * @access public
     */
    public $elementManagement = null;

    /**
     * @var PackageDescriptionType $deliveryDetails
     * @access public
     */
    public $deliveryDetails = null;

}

class productDescription {

    /**
     * @var ProductIdentificationTypeU $product
     * @access public
     */
    public $product = null;

    /**
     * @var TrafficRestrictionDetailsType $productRestriction
     * @access public
     */
    public $productRestriction = null;

}

class TourAccountDetailsType {

    /**
     * @var TariffInformationTypeU_25419S $tourTotalPrices
     * @access public
     */
    public $tourTotalPrices = null;

    /**
     * @var remainingAmountsDetails $remainingAmountsDetails
     * @access public
     */
    public $remainingAmountsDetails = null;

    /**
     * @var tourDetailedPriceInfo $tourDetailedPriceInfo
     * @access public
     */
    public $tourDetailedPriceInfo = null;

    /**
     * @var paymentInformation $paymentInformation
     * @access public
     */
    public $paymentInformation = null;

}

class remainingAmountsDetails {

    /**
     * @var CompanyInformationType_25420S $providerCode
     * @access public
     */
    public $providerCode = null;

    /**
     * @var TariffInformationTypeU_25419S $remainingAmount
     * @access public
     */
    public $remainingAmount = null;

}

class tourDetailedPriceInfo {

    /**
     * @var DummySegmentTypeI $markerSpecificRead
     * @access public
     */
    public $markerSpecificRead = null;

    /**
     * @var ReferenceInfoType_25422S $productId
     * @access public
     */
    public $productId = null;

    /**
     * @var TariffInformationTypeU_25419S $productPrice
     * @access public
     */
    public $productPrice = null;

}

class paymentInformation {

    /**
     * @var PaymentInformationTypeU $payment
     * @access public
     */
    public $payment = null;

    /**
     * @var CompanyInformationType_25420S $operatorCode
     * @access public
     */
    public $operatorCode = null;

}

class TourDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To15 $tourCode
     * @access public
     */
    public $tourCode = null;

}

class TourDetailsTypeI_192827C {

    /**
     * @var AlphaNumericString_Length1To20 $tourCode
     * @access public
     */
    public $tourCode = null;

}

class TourInformationTypeI {

    /**
     * @var TourDetailsTypeI_192827C $tourInformationDetails
     * @access public
     */
    public $tourInformationDetails = null;

}

class TourInformationTypeI_79029S {

    /**
     * @var TourDetailsTypeI $tourInformationDetails
     * @access public
     */
    public $tourInformationDetails = null;

}

class TourInformationType {

    /**
     * @var TravelProductInformationTypeU_25428S $bookingSummaryInfo
     * @access public
     */
    public $bookingSummaryInfo = null;

    /**
     * @var QuantityType_25433S $bookingDurationInfo
     * @access public
     */
    public $bookingDurationInfo = null;

    /**
     * @var PlaceLocationIdentificationTypeU_25436S $stayingInfo
     * @access public
     */
    public $stayingInfo = null;

    /**
     * @var AdditionalProductDetailsTypeU $tourDescriptionInfo
     * @access public
     */
    public $tourDescriptionInfo = null;

    /**
     * @var ReservationControlInformationTypeU_25427S $bookingReferenceInfo
     * @access public
     */
    public $bookingReferenceInfo = null;

    /**
     * @var QuantityAndActionTypeU_25425S $statusInfo
     * @access public
     */
    public $statusInfo = null;

    /**
     * @var InsuranceCoverageType_25483S $insuranceIndication
     * @access public
     */
    public $insuranceIndication = null;

    /**
     * @var TravellerInformationType_25441S $passengerInfo
     * @access public
     */
    public $passengerInfo = null;

    /**
     * @var StructuredDateTimeInformationType_25444S $expireInfo
     * @access public
     */
    public $expireInfo = null;

    /**
     * @var FreeTextInformationType_25445S $bookingDescriptionInfo
     * @access public
     */
    public $bookingDescriptionInfo = null;

    /**
     * @var TransportIdentifierType $systemProviderInfo
     * @access public
     */
    public $systemProviderInfo = null;

    /**
     * @var CompanyInformationType_25420S $tourOperatorInfo
     * @access public
     */
    public $tourOperatorInfo = null;

    /**
     * @var UserIdentificationType_25447S $bookingSource
     * @access public
     */
    public $bookingSource = null;

    /**
     * @var ReferenceInfoType_25422S $passengerAssocation
     * @access public
     */
    public $passengerAssocation = null;

    /**
     * @var TourAccountDetailsType $tourAccountDetails
     * @access public
     */
    public $tourAccountDetails = null;

    /**
     * @var TourServiceDetailsType $tourProductDetails
     * @access public
     */
    public $tourProductDetails = null;

}

class TourServiceDetailsType {

    /**
     * @var ItemNumberTypeU_25424S $sequenceNumberInfo
     * @access public
     */
    public $sequenceNumberInfo = null;

    /**
     * @var QuantityAndActionTypeU_25425S $statusQuantityInfo
     * @access public
     */
    public $statusQuantityInfo = null;

    /**
     * @var AdditionalProductDetailsTypeU $productInfo
     * @access public
     */
    public $productInfo = null;

    /**
     * @var ReservationControlInformationTypeU_25427S $confirmationInfo
     * @access public
     */
    public $confirmationInfo = null;

    /**
     * @var ReferenceInfoType_25422S $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     * @var serviceDetails $serviceDetails
     * @access public
     */
    public $serviceDetails = null;

}

class serviceDetails {

    /**
     * @var TravelProductInformationTypeU_25428S $serviceInfo
     * @access public
     */
    public $serviceInfo = null;

    /**
     * @var QuantityType_25433S $serviceDurationInfo
     * @access public
     */
    public $serviceDurationInfo = null;

    /**
     * @var accomodationDetails $accomodationDetails
     * @access public
     */
    public $accomodationDetails = null;

    /**
     * @var vehiculeDetails $vehiculeDetails
     * @access public
     */
    public $vehiculeDetails = null;

    /**
     * @var transportationDetails $transportationDetails
     * @access public
     */
    public $transportationDetails = null;

    /**
     * @var productBCSDetails $productBCSDetails
     * @access public
     */
    public $productBCSDetails = null;

}

class accomodationDetails {

    /**
     * @var HotelRoomType_25429S $roomInfo
     * @access public
     */
    public $roomInfo = null;

    /**
     * @var ReferenceInfoType_25422S $passengerAssociation
     * @access public
     */
    public $passengerAssociation = null;

    /**
     * @var DiningInformationType $roomMealPlanInfo
     * @access public
     */
    public $roomMealPlanInfo = null;

    /**
     * @var RangeDetailsTypeU $occupancynInfo
     * @access public
     */
    public $occupancynInfo = null;

}

class vehiculeDetails {

    /**
     * @var VehicleTypeU_25502S $vehiculeInfo
     * @access public
     */
    public $vehiculeInfo = null;

}

class transportationDetails {

    /**
     * @var PlaceLocationIdentificationTypeU_25436S $departureInfo
     * @access public
     */
    public $departureInfo = null;

    /**
     * @var PlaceLocationIdentificationTypeU_25436S $arrivalInfo
     * @access public
     */
    public $arrivalInfo = null;

    /**
     * @var TravelProductInformationTypeI_25434S $transportationInfo
     * @access public
     */
    public $transportationInfo = null;

    /**
     * @var QuantityType_25433S $transportationDuration
     * @access public
     */
    public $transportationDuration = null;

    /**
     * @var EquipmentDetailsTypeU $equipmentInfo
     * @access public
     */
    public $equipmentInfo = null;

    /**
     * @var DiningInformationType $transportationMealPlanInfo
     * @access public
     */
    public $transportationMealPlanInfo = null;

}

class productBCSDetails {

    /**
     * @var UserIdentificationType_25447S $agentIdentification
     * @access public
     */
    public $agentIdentification = null;

    /**
     * @var SystemDetailsInfoType_25482S $distributionChannelData
     * @access public
     */
    public $distributionChannelData = null;

}

class TrafficRestrictionDetailsTypeU {

    /**
     * @var AlphaNumericString_Length1To5 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To16 $description
     * @access public
     */
    public $description = null;

}

class TrafficRestrictionDetailsType {

    /**
     * @var TrafficRestrictionDetailsTypeU $restrictionDetails
     * @access public
     */
    public $restrictionDetails = null;

}

class TrainDataType {

    /**
     * @var TrainProductInformationType $trainProductInfo
     * @access public
     */
    public $trainProductInfo = null;

    /**
     * @var StructuredDateTimeInformationType_129285S $tripDateTime
     * @access public
     */
    public $tripDateTime = null;

    /**
     * @var PlaceLocationIdentificationType_129295S $location
     * @access public
     */
    public $location = null;

    /**
     * @var RailLegDataType $railLeg
     * @access public
     */
    public $railLeg = null;

}

class TrainDataType_150774G {

    /**
     * @var TrainProductInformationType $trainProductInfo
     * @access public
     */
    public $trainProductInfo = null;

    /**
     * @var StructuredDateTimeInformationType_129285S $tripDateTime
     * @access public
     */
    public $tripDateTime = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132982S $depLocation
     * @access public
     */
    public $depLocation = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132982S $arrLocation
     * @access public
     */
    public $arrLocation = null;

    /**
     * @var RailLegDataType_150775G $railLeg
     * @access public
     */
    public $railLeg = null;

}

class TrainDataType_48813G {

    /**
     * @var TrainProductInformationType $trainProductInfo
     * @access public
     */
    public $trainProductInfo = null;

    /**
     * @var StructuredDateTimeInformationType_129285S $tripDateTime
     * @access public
     */
    public $tripDateTime = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132982S $depLocation
     * @access public
     */
    public $depLocation = null;

    /**
     * @var PlaceLocationIdentificationTypeU_132982S $arrLocation
     * @access public
     */
    public $arrLocation = null;

    /**
     * @var RailLegDataType_150775G $railLeg
     * @access public
     */
    public $railLeg = null;

}

class TrainDetailsType {

    /**
     * @var AlphaNumericString_Length1To2 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To6 $number
     * @access public
     */
    public $number = null;

}

class TrainInformationType {

    /**
     * @var CompanyInformationType_132975S $companyInfo
     * @access public
     */
    public $companyInfo = null;

    /**
     * @var CodedAttributeType_132972S $keyValueTree
     * @access public
     */
    public $keyValueTree = null;

    /**
     * @var TrainDataType_150774G $tripDetails
     * @access public
     */
    public $tripDetails = null;

    /**
     * @var StatusTypeI_132979S $openSegment
     * @access public
     */
    public $openSegment = null;

    /**
     * @var TravelItineraryInformationTypeI_129342S $journeyDirection
     * @access public
     */
    public $journeyDirection = null;

    /**
     * @var ClassConfigurationDetailsType_132973S $classInfo
     * @access public
     */
    public $classInfo = null;

    /**
     * @var QuantityAndActionTypeU_132977S $reservableStatus
     * @access public
     */
    public $reservableStatus = null;

}

class TrainInformationType_48865G {

    /**
     * @var CompanyInformationType_132975S $companyInfo
     * @access public
     */
    public $companyInfo = null;

    /**
     * @var StatusTypeI_20923S $updatePermission
     * @access public
     */
    public $updatePermission = null;

    /**
     * @var TrainDataType_48813G $tripDetails
     * @access public
     */
    public $tripDetails = null;

    /**
     * @var StatusTypeI_132979S $openSegment
     * @access public
     */
    public $openSegment = null;

    /**
     * @var TravelItineraryInformationTypeI_129342S $journeyDirection
     * @access public
     */
    public $journeyDirection = null;

    /**
     * @var ItemReferencesAndVersionsType_20992S $providerTattoo
     * @access public
     */
    public $providerTattoo = null;

    /**
     * @var FreeTextInformationType_20551S $serviceInfo
     * @access public
     */
    public $serviceInfo = null;

    /**
     * @var ClassConfigurationDetailsType_132973S $classInfo
     * @access public
     */
    public $classInfo = null;

    /**
     * @var AccommodationAllocationInformationTypeU $accommodationInfo
     * @access public
     */
    public $accommodationInfo = null;

    /**
     * @var CoachProductInformationType $coachInfo
     * @access public
     */
    public $coachInfo = null;

    /**
     * @var QuantityAndActionTypeU_132977S $reservableStatus
     * @access public
     */
    public $reservableStatus = null;

}

class TrainProductInformationType {

    /**
     * @var TrainDetailsType $trainDetails
     * @access public
     */
    public $trainDetails = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class TrainProductInformationType_132986S {

    /**
     * @var AlphaNumericString_Length1To4 $railCompany
     * @access public
     */
    public $railCompany = null;

    /**
     * @var TrainDetailsType $trainDetails
     * @access public
     */
    public $trainDetails = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class TransactionInformationForTicketingType {

    /**
     * @var TransactionInformationsType $transactionDetails
     * @access public
     */
    public $transactionDetails = null;

}

class TransactionInformationsType {

    /**
     * @var AlphaNumericString_Length1To4 $code
     * @access public
     */
    public $code = null;

    /**
     * @var AlphaNumericString_Length1To4 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To1 $issueIndicator
     * @access public
     */
    public $issueIndicator = null;

    /**
     * @var AlphaNumericString_Length1To25 $transmissionControlNumber
     * @access public
     */
    public $transmissionControlNumber = null;

}

class TransportIdentifierType_79027S {

    /**
     * @var CompanyIdentificationTypeI $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

}

class TravelItineraryInformationTypeI {

    /**
     * @var NumericInteger_Length1To1 $itemNumber
     * @access public
     */
    public $itemNumber = null;

}

class TravelItineraryInformationTypeI_129342S {

    /**
     * @var AlphaNumericString_Length1To3 $movementType
     * @access public
     */
    public $movementType = null;

}

class TravelProductInformationTypeI_133014S {

    /**
     * @var ProductDateTimeTypeI_192985C $product
     * @access public
     */
    public $product = null;

    /**
     * @var LocationTypeI_192814C $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var LocationTypeI_192814C $offpointDetail
     * @access public
     */
    public $offpointDetail = null;

    /**
     * @var CompanyIdentificationTypeI_192810C $companyDetail
     * @access public
     */
    public $companyDetail = null;

    /**
     * @var ProductIdentificationDetailsTypeI_192811C $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var ProductTypeDetailsTypeI_192984C $typeDetail
     * @access public
     */
    public $typeDetail = null;

    /**
     * @var AlphaNumericString_Length1To3 $processingIndicator
     * @access public
     */
    public $processingIndicator = null;

}

class TravelProductInformationTypeI_185722S {

    /**
     * @var ProductDateTimeTypeI_260466C $product
     * @access public
     */
    public $product = null;

    /**
     * @var LocationTypeI_192814C $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var LocationTypeI_192814C $offpointDetail
     * @access public
     */
    public $offpointDetail = null;

    /**
     * @var CompanyIdentificationTypeI_192810C $companyDetail
     * @access public
     */
    public $companyDetail = null;

    /**
     * @var ProductIdentificationDetailsTypeI_192811C $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var ProductTypeDetailsTypeI_192984C $typeDetail
     * @access public
     */
    public $typeDetail = null;

    /**
     * @var AlphaNumericString_Length1To3 $processingIndicator
     * @access public
     */
    public $processingIndicator = null;

}

class TravelProductInformationTypeI_196495S {

    /**
     * @var ProductDateTimeTypeI_274226C $product
     * @access public
     */
    public $product = null;

    /**
     * @var LocationTypeI_192814C $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var LocationTypeI_192814C $offpointDetail
     * @access public
     */
    public $offpointDetail = null;

    /**
     * @var CompanyIdentificationTypeI_192810C $companyDetail
     * @access public
     */
    public $companyDetail = null;

    /**
     * @var ProductIdentificationDetailsTypeI_192811C $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var ProductTypeDetailsTypeI_192984C $typeDetail
     * @access public
     */
    public $typeDetail = null;

    /**
     * @var AlphaNumericString_Length1To3 $processingIndicator
     * @access public
     */
    public $processingIndicator = null;

}

class TravelProductInformationTypeI_25434S {

    /**
     * @var ProductDateTimeTypeI_46338C $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var CompanyIdentificationTypeI_46335C $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ProductIdentificationDetailsTypeI_46336C $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     * @var ProductTypeDetailsTypeI_46337C $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

}

class TravelProductInformationTypeI_79024S {

    /**
     * @var ProductTypeDetailsTypeI $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

}

class TravelProductInformationTypeI_99362S {

    /**
     * @var ProductDateTimeTypeI $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var LocationTypeI $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     * @var LocationTypeI $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     * @var CompanyIdentificationTypeI_148289C $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ProductIdentificationDetailsTypeI $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

}

class TravelProductInformationTypeU {

    /**
     * @var ProductDateAndTimeTypeU $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var LocationTypeU $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     * @var AlphaNumericString_Length1To2 $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class TravelProductInformationTypeU_24954S {

    /**
     * @var ProductDateAndTimeTypeU_45634C $itineraryDateTimeInfo
     * @access public
     */
    public $itineraryDateTimeInfo = null;

    /**
     * @var LocationTypeU_45633C $boardPortDetails
     * @access public
     */
    public $boardPortDetails = null;

    /**
     * @var AlphaNumericString_Length1To2 $lineNumber
     * @access public
     */
    public $lineNumber = null;

}

class TravelProductInformationTypeU_25428S {

    /**
     * @var ProductDateAndTimeTypeU_46325C $dateTimeInformation
     * @access public
     */
    public $dateTimeInformation = null;

    /**
     * @var LocationTypeU_46324C $locationInformation
     * @access public
     */
    public $locationInformation = null;

    /**
     * @var CompanyIdentificationTypeU $companyInformation
     * @access public
     */
    public $companyInformation = null;

    /**
     * @var ProductIdentificationDetailsTypeU_46327C $productDetails
     * @access public
     */
    public $productDetails = null;

}

class TravelProductInformationType {

    /**
     * @var ProductDateTimeTypeI $product
     * @access public
     */
    public $product = null;

    /**
     * @var LocationTypeI $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var LocationTypeI $offpointDetail
     * @access public
     */
    public $offpointDetail = null;

    /**
     * @var CompanyIdentificationTypeI $company
     * @access public
     */
    public $company = null;

    /**
     * @var ProductIdentificationDetailsTypeI $productDetails
     * @access public
     */
    public $productDetails = null;

}

class TravelProductInformationType_132909S {

    /**
     * @var ProductDateTimeTypeI_192813C $product
     * @access public
     */
    public $product = null;

    /**
     * @var LocationTypeI_192814C $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var LocationTypeI_192814C $offpointDetail
     * @access public
     */
    public $offpointDetail = null;

    /**
     * @var CompanyIdentificationTypeI_192810C $companyDetail
     * @access public
     */
    public $companyDetail = null;

    /**
     * @var ProductIdentificationDetailsTypeI_192811C $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var ProductTypeDetailsTypeI_192812C $typeDetail
     * @access public
     */
    public $typeDetail = null;

    /**
     * @var AlphaNumericString_Length1To3 $processingIndicator
     * @access public
     */
    public $processingIndicator = null;

}

class TravelProductInformationType_132989S {

    /**
     * @var ProductDateTimeTypeI_192929C $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var LocationTypeI_192931C $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     * @var LocationTypeI_192931C $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     * @var CompanyIdentificationTypeI_192926C $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ProductIdentificationDetailsTypeI_192927C $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     * @var ProductTypeDetailsTypeI_192928C $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

}

class TravelerPerpaxDetailsType {

    /**
     * @var AlphaNumericString_Length2To2 $perpaxMask
     * @access public
     */
    public $perpaxMask = null;

    /**
     * @var AlphaNumericString_Length1To1 $perpaxMaskIndicator
     * @access public
     */
    public $perpaxMaskIndicator = null;

}

class TravellerBaggageDetailsType {

    /**
     * @var BaggageDetailsType $baggageDetails
     * @access public
     */
    public $baggageDetails = null;

}

class TravellerDetailsTypeI {

    /**
     * @var AlphaString_Length1To56 $firstName
     * @access public
     */
    public $firstName = null;

}

class TravellerDetailsTypeI_16351C {

    /**
     * @var AlphaNumericString_Length1To30 $givenName
     * @access public
     */
    public $givenName = null;

    /**
     * @var AlphaNumericString_Length1To3 $title
     * @access public
     */
    public $title = null;

}

class TravellerDetailsTypeI_18004C {

    /**
     * @var AlphaNumericString_Length1To30 $givenName
     * @access public
     */
    public $givenName = null;

}

class TravellerDetailsTypeI_187478C {

    /**
     * @var AlphaNumericString_Length1To30 $givenName
     * @access public
     */
    public $givenName = null;

    /**
     * @var AlphaNumericString_Length1To70 $title
     * @access public
     */
    public $title = null;

}

class TravellerDetailsTypeI_193004C {

    /**
     * @var AlphaNumericString_Length1To70 $givenName
     * @access public
     */
    public $givenName = null;

}

class TravellerDetailsTypeI_46354C {

    /**
     * @var AlphaNumericString_Length1To40 $givenName
     * @access public
     */
    public $givenName = null;

    /**
     * @var AlphaNumericString_Length1To3 $title
     * @access public
     */
    public $title = null;

}

class TravellerDocumentInformationTypeU {

    /**
     * @var DocumentInformationTypeU $documentInformation
     * @access public
     */
    public $documentInformation = null;

    /**
     * @var ValidityDatesTypeU $datesOfValidity
     * @access public
     */
    public $datesOfValidity = null;

}

class TravellerInformationTypeI {

    /**
     * @var TravellerSurnameInformationTypeI $traveller
     * @access public
     */
    public $traveller = null;

    /**
     * @var TravellerDetailsTypeI $passenger
     * @access public
     */
    public $passenger = null;

}

class TravellerInformationTypeI_128676S {

    /**
     * @var TravellerSurnameInformationTypeI_18003C $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     * @var TravellerDetailsTypeI_187478C $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class TravellerInformationTypeI_132959S {

    /**
     * @var TravellerSurnameInformationTypeI_16350C $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     * @var TravellerDetailsTypeI_16351C $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class TravellerInformationTypeI_133026S {

    /**
     * @var TravellerSurnameInformationTypeI_193003C $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     * @var TravellerDetailsTypeI_193004C $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class TravellerInformationTypeI_6097S {

    /**
     * @var TravellerSurnameInformationTypeI $traveller
     * @access public
     */
    public $traveller = null;

    /**
     * @var TravellerDetailsTypeI $passenger
     * @access public
     */
    public $passenger = null;

}

class TravellerInformationType {

    /**
     * @var TravellerSurnameInformationType $paxDetails
     * @access public
     */
    public $paxDetails = null;

}

class TravellerInformationType_25441S {

    /**
     * @var TravellerSurnameInformationType_46353C $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     * @var TravellerDetailsTypeI_46354C $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class TravellerInformationType_94570S {

    /**
     * @var TravellerSurnameInformationType $paxDetails
     * @access public
     */
    public $paxDetails = null;

    /**
     * @var TravellerDetailsType $otherPaxDetails
     * @access public
     */
    public $otherPaxDetails = null;

}

class TravellerInsuranceInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var NumericDecimal_Length1To18 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To70 $supplementaryInformation
     * @access public
     */
    public $supplementaryInformation = null;

    /**
     * @var AlphaNumericString_Length1To1 $sexCode
     * @access public
     */
    public $sexCode = null;

    /**
     * @var CreditCardType $creditCardDetails
     * @access public
     */
    public $creditCardDetails = null;

    /**
     * @var AlphaNumericString_Length1To3 $totalPremiumCurrency
     * @access public
     */
    public $totalPremiumCurrency = null;

    /**
     * @var NumericDecimal_Length1To18 $totalPremium
     * @access public
     */
    public $totalPremium = null;

    /**
     * @var AlphaNumericString_Length1To3 $futureCurrency
     * @access public
     */
    public $futureCurrency = null;

    /**
     * @var NumericDecimal_Length1To18 $futureAmount
     * @access public
     */
    public $futureAmount = null;

    /**
     * @var AlphaNumericString_Length1To3 $fareType
     * @access public
     */
    public $fareType = null;

    /**
     * @var AlphaNumericString_Length1To70 $travelerName
     * @access public
     */
    public $travelerName = null;

}

class TravellerNameDetailsType {

    /**
     * @var AlphaNumericString_Length1To5 $nameType
     * @access public
     */
    public $nameType = null;

    /**
     * @var AlphaNumericString_Length1To1 $referenceName
     * @access public
     */
    public $referenceName = null;

    /**
     * @var AlphaNumericString_Length1To57 $surname
     * @access public
     */
    public $surname = null;

    /**
     * @var AlphaNumericString_Length1To56 $givenName
     * @access public
     */
    public $givenName = null;

    /**
     * @var AlphaNumericString_Length1To70 $title
     * @access public
     */
    public $title = null;

}

class TravellerNameInfoType {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var NumericInteger_Length1To2 $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $otherType
     * @access public
     */
    public $otherType = null;

    /**
     * @var AlphaNumericString_Length1To1 $infantIndicator
     * @access public
     */
    public $infantIndicator = null;

    /**
     * @var AlphaNumericString_Length1To70 $travellerIdentificationCode
     * @access public
     */
    public $travellerIdentificationCode = null;

}

class TravellerSurnameInformationTypeI {

    /**
     * @var AlphaString_Length1To57 $surname
     * @access public
     */
    public $surname = null;

}

class TravellerSurnameInformationTypeI_16350C {

    /**
     * @var AlphaNumericString_Length1To30 $surname
     * @access public
     */
    public $surname = null;

}

class TravellerSurnameInformationTypeI_18003C {

    /**
     * @var AlphaNumericString_Length1To30 $surname
     * @access public
     */
    public $surname = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class TravellerSurnameInformationTypeI_193003C {

    /**
     * @var AlphaNumericString_Length1To70 $surname
     * @access public
     */
    public $surname = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class TravellerSurnameInformationType {

    /**
     * @var AlphaNumericString_Length1To2 $type
     * @access public
     */
    public $type = null;

}

class TravellerSurnameInformationType_187485C {

    /**
     * @var AlphaNumericString_Length1To30 $surname
     * @access public
     */
    public $surname = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To3 $gender
     * @access public
     */
    public $gender = null;

}

class TravellerSurnameInformationType_46353C {

    /**
     * @var AlphaNumericString_Length1To40 $surname
     * @access public
     */
    public $surname = null;

}

class TravellerTimeDetailsTypeI {

    /**
     * @var Time24_HHMM $checkinTime
     * @access public
     */
    public $checkinTime = null;

}

class TravellerTimeDetailsType {

    /**
     * @var Time24_HHMM $checkInDateTime
     * @access public
     */
    public $checkInDateTime = null;

}

class TstGeneralInformationDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $tstReferenceNumber
     * @access public
     */
    public $tstReferenceNumber = null;

    /**
     * @var AlphaNumericString_Length6To6 $tstCreationDate
     * @access public
     */
    public $tstCreationDate = null;

    /**
     * @var AlphaNumericString_Length1To4 $salesIndicator
     * @access public
     */
    public $salesIndicator = null;

}

class TstGeneralInformationType {

    /**
     * @var TstGeneralInformationDetailsType $generalInformation
     * @access public
     */
    public $generalInformation = null;

}

class UniqueIdDescriptionType_141680C {

    /**
     * @var AlphaNumericString_Length1To35 $systemQualifier
     * @access public
     */
    public $systemQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $versionNumber
     * @access public
     */
    public $versionNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $primeId
     * @access public
     */
    public $primeId = null;

    /**
     * @var AlphaNumericString_Length1To35 $secondaryId
     * @access public
     */
    public $secondaryId = null;

    /**
     * @var AlphaNumericString_Length1To3 $status
     * @access public
     */
    public $status = null;

    /**
     * @var Year_YYYY $creationYear
     * @access public
     */
    public $creationYear = null;

    /**
     * @var Month_MM $creationMonth
     * @access public
     */
    public $creationMonth = null;

    /**
     * @var Day_NN $creationDay
     * @access public
     */
    public $creationDay = null;

    /**
     * @var Hour_HH $creationHour
     * @access public
     */
    public $creationHour = null;

    /**
     * @var Minute_MM $creationMinutes
     * @access public
     */
    public $creationMinutes = null;

    /**
     * @var AlphaNumericString_Length1To70 $description
     * @access public
     */
    public $description = null;

}

class UserIdentificationType_127265S {

    /**
     * @var AlphaNumericString_Length1To1 $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

}

class UserIdentificationType_128677S {

    /**
     * @var AlphaNumericString_Length1To30 $originator
     * @access public
     */
    public $originator = null;

}

class UserIdentificationType_132824S {

    /**
     * @var OriginatorIdentificationDetailsType $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     * @var AlphaNumericString_Length1To1 $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

}

class UserIdentificationType_132892S {

    /**
     * @var OriginatorIdentificationDetailsTypeI_192790C $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     * @var AlphaNumericString_Length1To1 $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

}

class UserIdentificationType_132970S {

    /**
     * @var OriginatorIdentificationDetailsTypeI_192904C $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     * @var AlphaNumericString_Length1To1 $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

}

class UserIdentificationType_133009S {

    /**
     * @var OriginatorIdentificationDetailsTypeI_192968C $originIdentification
     * @access public
     */
    public $originIdentification = null;

}

class UserIdentificationType_25447S {

    /**
     * @var OriginatorIdentificationDetailsTypeI_46358C $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     * @var AlphaNumericString_Length1To11 $originator
     * @access public
     */
    public $originator = null;

}

class UserIdentificationType_79019S {

    /**
     * @var OriginatorIdentificationDetailsTypeI $originIdentification
     * @access public
     */
    public $originIdentification = null;

}

class UserPreferencesType {

    /**
     * @var OriginatorDetailsTypeI $userPreferences
     * @access public
     */
    public $userPreferences = null;

}

class ValidityDatesTypeU {

    /**
     * @var Date_YYYYMMDD $issueDate
     * @access public
     */
    public $issueDate = null;

    /**
     * @var Date_YYYYMMDD $expirationDate
     * @access public
     */
    public $expirationDate = null;

}

class ValueRangeTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $measureUnitQualifier
     * @access public
     */
    public $measureUnitQualifier = null;

}

class VatPropertiesGroupType {

    /**
     * @var MonetaryInformationTypeI_53012S $vatRateAndAmount
     * @access public
     */
    public $vatRateAndAmount = null;

    /**
     * @var SelectionDetailsTypeI_132941S $fareFiling
     * @access public
     */
    public $fareFiling = null;

}

class VehicleInformationTypeU {

    /**
     * @var AlphaNumericString_Length1To17 $makeAndModel
     * @access public
     */
    public $makeAndModel = null;

}

class VehicleInformationTypeU_46439C {

    /**
     * @var NumericInteger_Length1To3 $occupancy
     * @access public
     */
    public $occupancy = null;

}

class VehicleInformationType {

    /**
     * @var VehicleTypeOptionType $vehicleCharacteristic
     * @access public
     */
    public $vehicleCharacteristic = null;

    /**
     * @var AlphaNumericString_Length1To3 $vehSpecialEquipment
     * @access public
     */
    public $vehSpecialEquipment = null;

    /**
     * @var QuantityDetailsTypeI_187593C $vehicleInfo
     * @access public
     */
    public $vehicleInfo = null;

    /**
     * @var FreeTextDetailsType_187592C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To70 $carModel
     * @access public
     */
    public $carModel = null;

}

class VehicleInformationType_132935S {

    /**
     * @var VehicleTypeOptionType_192852C $vehicleCharacteristic
     * @access public
     */
    public $vehicleCharacteristic = null;

    /**
     * @var AlphaNumericString_Length1To3 $vehSpecialEquipment
     * @access public
     */
    public $vehSpecialEquipment = null;

    /**
     * @var QuantityDetailsTypeI_187593C $vehicleInfo
     * @access public
     */
    public $vehicleInfo = null;

    /**
     * @var FreeTextDetailsType_192851C $freeTextDetails
     * @access public
     */
    public $freeTextDetails = null;

    /**
     * @var AlphaNumericString_Length1To55 $carModel
     * @access public
     */
    public $carModel = null;

}

class VehicleTypeOptionType {

    /**
     * @var AlphaNumericString_Length1To3 $vehicleTypeOwner
     * @access public
     */
    public $vehicleTypeOwner = null;

    /**
     * @var AlphaNumericString_Length1To4 $vehicleRentalPrefType
     * @access public
     */
    public $vehicleRentalPrefType = null;

}

class VehicleTypeOptionType_192852C {

    /**
     * @var AlphaNumericString_Length1To3 $vehicleTypeOwner
     * @access public
     */
    public $vehicleTypeOwner = null;

    /**
     * @var AlphaNumericString_Length1To4 $vehicleRentalPrefType
     * @access public
     */
    public $vehicleRentalPrefType = null;

}

class VehicleTypeU {

    /**
     * @var AlphaNumericString_Length1To3 $category
     * @access public
     */
    public $category = null;

    /**
     * @var VehicleInformationTypeU $vehicleDetails
     * @access public
     */
    public $vehicleDetails = null;

}

class VehicleTypeU_25502S {

    /**
     * @var VehicleInformationTypeU_46439C $vehiculeDescription
     * @access public
     */
    public $vehiculeDescription = null;

}

class PNR_AddMultiElements {

    /**
     * @var ReservationControlInformationTypeI $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     * @var OptionalPNRActionsType $pnrActions
     * @access public
     */
    public $pnrActions = null;

    /**
     * @var travellerInfo $travellerInfo
     * @access public
     */
    public $travellerInfo = null;

    /**
     * @var originDestinationDetails $originDestinationDetails
     * @access public
     */
    public $originDestinationDetails = null;

    /**
     * @var dataElementsMaster $dataElementsMaster
     * @access public
     */
    public $dataElementsMaster = null;

}

class airAuxItinerary {

    /**
     * @var TravelProductInformationType $travelProduct
     * @access public
     */
    public $travelProduct = null;

    /**
     * @var MessageActionDetailsTypeI $messageAction
     * @access public
     */
    public $messageAction = null;

    /**
     * @var RelatedProductInformationTypeI $relatedProduct
     * @access public
     */
    public $relatedProduct = null;

    /**
     * @var SelectionDetailsTypeI $selectionDetailsAir
     * @access public
     */
    public $selectionDetailsAir = null;

    /**
     * @var ReservationControlInformationTypeI $reservationInfoSell
     * @access public
     */
    public $reservationInfoSell = null;

    /**
     * @var LongFreeTextType $freetextItinerary
     * @access public
     */
    public $freetextItinerary = null;

}

class CommissionElementType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var AlphaNumericString_Length1To2 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var CommissionInformationType $commissionInfo
     * @access public
     */
    public $commissionInfo = null;

    /**
     * @var CommissionInformationType_6428C $oldCommission
     * @access public
     */
    public $oldCommission = null;

    /**
     * @var NumericDecimal_Length1To10 $manualCapping
     * @access public
     */
    public $manualCapping = null;

}

class CommissionInformationType_6428C {

    /**
     * @var NumericInteger_Length1To5 $percentage
     * @access public
     */
    public $percentage = null;

    /**
     * @var NumericDecimal_Length1To10 $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var AlphaNumericString_Length1To2 $vatIndicator
     * @access public
     */
    public $vatIndicator = null;

    /**
     * @var AlphaNumericString_Length1To2 $remitIndicator
     * @access public
     */
    public $remitIndicator = null;

}

class FareDiscountElementType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var DiscountInformationType $discount
     * @access public
     */
    public $discount = null;

    /**
     * @var AlphaNumericString_Length6To6 $birthDate
     * @access public
     */
    public $birthDate = null;

    /**
     * @var NumberOfUnitDetailsType $numberDetail
     * @access public
     */
    public $numberDetail = null;

    /**
     * @var RpInformationType $rpInformation
     * @access public
     */
    public $rpInformation = null;

    /**
     * @var ItemDetailsType $customer
     * @access public
     */
    public $customer = null;

    /**
     * @var ItemDetailsType_186716C $residentDisc
     * @access public
     */
    public $residentDisc = null;

    /**
     * @var CodedAttributeInformationType $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class FareElementsType {

    /**
     * @var AlphaNumericString_Length1To1 $generalIndicator
     * @access public
     */
    public $generalIndicator = null;

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var AlphaNumericString_Length9To9 $officeId
     * @access public
     */
    public $officeId = null;

    /**
     * @var AlphaNumericString_Length1To150 $freetextLong
     * @access public
     */
    public $freetextLong = null;

}

class FarePrintOverrideDetailsType {

    /**
     * @var AlphaNumericString_Length1To11 $baseFare
     * @access public
     */
    public $baseFare = null;

    /**
     * @var AlphaNumericString_Length1To11 $totalFare
     * @access public
     */
    public $totalFare = null;

    /**
     * @var AlphaNumericString_Length1To11 $equivalentFare
     * @access public
     */
    public $equivalentFare = null;

    /**
     * @var AlphaNumericString_Length1To11 $taxAmount
     * @access public
     */
    public $taxAmount = null;

}

class FarePrintOverrideType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var FarePrintOverrideDetailsType $override
     * @access public
     */
    public $override = null;

}

class FormatedTourCodeType {

    /**
     * @var AlphaNumericString_Length1To2 $productId
     * @access public
     */
    public $productId = null;

    /**
     * @var NumericInteger_Length1To1 $year
     * @access public
     */
    public $year = null;

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To1 $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     * @var AlphaNumericString_Length1To8 $partyId
     * @access public
     */
    public $partyId = null;

}

class FreeFormatTourCodeType {

    /**
     * @var AlphaNumericString_Length1To2 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To14 $freetext
     * @access public
     */
    public $freetext = null;

}

class FrequentTravellerIdentificationTypeU {

    /**
     * @var AlphaNumericString_Length2To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var AlphaNumericString_Length1To25 $membershipNumber
     * @access public
     */
    public $membershipNumber = null;

}

class FrequentTravellerInformationTypeU {

    /**
     * @var FrequentTravellerIdentificationTypeU $frequentTraveller
     * @access public
     */
    public $frequentTraveller = null;

}

class FrequentTravellerVerificationType {

    /**
     * @var AlphaNumericString_Length1To3 $actionRequest
     * @access public
     */
    public $actionRequest = null;

    /**
     * @var CompanyIdentificationType $company
     * @access public
     */
    public $company = null;

    /**
     * @var ProductAccountDetailsType $account
     * @access public
     */
    public $account = null;

}

class IssueInformationType {

    /**
     * @var AlphaNumericString_Length3To3 $airlineCode
     * @access public
     */
    public $airlineCode = null;

    /**
     * @var AlphaNumericString_Length1To10 $documentNumber
     * @access public
     */
    public $documentNumber = null;

    /**
     * @var NumericInteger_Length1To1 $documentCD
     * @access public
     */
    public $documentCD = null;

    /**
     * @var AlphaNumericString_Length1To1 $coupon1
     * @access public
     */
    public $coupon1 = null;

    /**
     * @var AlphaNumericString_Length1To1 $coupon2
     * @access public
     */
    public $coupon2 = null;

    /**
     * @var AlphaNumericString_Length1To1 $coupon3
     * @access public
     */
    public $coupon3 = null;

    /**
     * @var AlphaNumericString_Length1To1 $coupon4
     * @access public
     */
    public $coupon4 = null;

    /**
     * @var NumericInteger_Length2To2 $lastConjunction
     * @access public
     */
    public $lastConjunction = null;

    /**
     * @var NumericInteger_Length1To1 $exchangeDocumentCD
     * @access public
     */
    public $exchangeDocumentCD = null;

    /**
     * @var AlphaNumericString_Length1To1 $lastConjunction1
     * @access public
     */
    public $lastConjunction1 = null;

    /**
     * @var AlphaNumericString_Length1To1 $lastConjunction2
     * @access public
     */
    public $lastConjunction2 = null;

    /**
     * @var AlphaNumericString_Length1To1 $lastConjunction3
     * @access public
     */
    public $lastConjunction3 = null;

    /**
     * @var AlphaNumericString_Length1To1 $lastConjunction4
     * @access public
     */
    public $lastConjunction4 = null;

    /**
     * @var AlphaString_Length3To3 $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var Date_DDMMYY $dateOfIssue
     * @access public
     */
    public $dateOfIssue = null;

    /**
     * @var AlphaNumericString_Length1To9 $iataNumber
     * @access public
     */
    public $iataNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var NumericDecimal_Length1To10 $amount
     * @access public
     */
    public $amount = null;

}

class ItemDetailsType {

    /**
     * @var AlphaString_Length2To2 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var NumericInteger_Length1To1 $cardType
     * @access public
     */
    public $cardType = null;

    /**
     * @var NumericInteger_Length1To13 $cardNumber
     * @access public
     */
    public $cardNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $cardCheck
     * @access public
     */
    public $cardCheck = null;

    /**
     * @var NumericInteger_Length2To2 $owner
     * @access public
     */
    public $owner = null;

    /**
     * @var NumericInteger_Length1To1 $version
     * @access public
     */
    public $version = null;

}

class ItemDetailsType_186716C {

    /**
     * @var AlphaString_Length2To2 $idCardCode
     * @access public
     */
    public $idCardCode = null;

    /**
     * @var AlphaString_Length1To1 $idCardType
     * @access public
     */
    public $idCardType = null;

    /**
     * @var NumericInteger_Length1To13 $cardNumber
     * @access public
     */
    public $cardNumber = null;

    /**
     * @var AlphaNumericString_Length1To1 $alphaCheck
     * @access public
     */
    public $alphaCheck = null;

    /**
     * @var AlphaNumericString_Length1To9 $zipCode
     * @access public
     */
    public $zipCode = null;

    /**
     * @var AlphaNumericString_Length1To20 $certificateNumber
     * @access public
     */
    public $certificateNumber = null;

}

class ManualDocumentRegistrationType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var ManualDocumentType $document
     * @access public
     */
    public $document = null;

    /**
     * @var AlphaNumericString_Length1To49 $freeflow
     * @access public
     */
    public $freeflow = null;

}

class ManualDocumentType {

    /**
     * @var NumericString_Length3To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var NumericString_Length10To10 $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

    /**
     * @var NumericInteger_Length1To1 $ticketNumberCd
     * @access public
     */
    public $ticketNumberCd = null;

    /**
     * @var NumericInteger_Length2To2 $lastConjuction
     * @access public
     */
    public $lastConjuction = null;

    /**
     * @var NumericInteger_Length1To1 $lastConjuctionCD
     * @access public
     */
    public $lastConjuctionCD = null;

}

class MarketSpecificDataDetailsType {

    /**
     * @var AlphaNumericString_Length1To10 $cvData
     * @access public
     */
    public $cvData = null;

    /**
     * @var AlphaNumericString_Length1To70 $printedFreeflow
     * @access public
     */
    public $printedFreeflow = null;

    /**
     * @var AlphaNumericString_Length1To70 $reportedFreeflow
     * @access public
     */
    public $reportedFreeflow = null;

    /**
     * @var AlphaNumericString_Length1To15 $onoData
     * @access public
     */
    public $onoData = null;

    /**
     * @var AlphaNumericString_Length1To15 $gwtData
     * @access public
     */
    public $gwtData = null;

    /**
     * @var AlphaNumericString_Length1To40 $chdData
     * @access public
     */
    public $chdData = null;

    /**
     * @var AlphaNumericString_Length1To3 $delegationCode
     * @access public
     */
    public $delegationCode = null;

    /**
     * @var AlphaNumericString_Length1To13 $mcoDocNumber
     * @access public
     */
    public $mcoDocNumber = null;

    /**
     * @var AlphaNumericString_Length1To4 $mcoCouponNumber
     * @access public
     */
    public $mcoCouponNumber = null;

    /**
     * @var NumericInteger_Length1To9 $mcoIataNumber
     * @access public
     */
    public $mcoIataNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $mcoPlaceOfIssue
     * @access public
     */
    public $mcoPlaceOfIssue = null;

    /**
     * @var AlphaNumericString_Length7To7 $mcoDateOfIssue
     * @access public
     */
    public $mcoDateOfIssue = null;

    /**
     * @var NumericInteger_Length1To9 $iataNumber
     * @access public
     */
    public $iataNumber = null;

}

class MarketSpecificDataType {

    /**
     * @var NumericInteger_Length1To2 $fopSequenceNumber
     * @access public
     */
    public $fopSequenceNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var MarketSpecificDataDetailsType $newFopsDetails
     * @access public
     */
    public $newFopsDetails = null;

    /**
     * @var ReferencingDetailsTypeI $extFOP
     * @access public
     */
    public $extFOP = null;

}

class MiscellaneousRemarkType_210664C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To1 $category
     * @access public
     */
    public $category = null;

    /**
     * @var AlphaNumericString_Length1To127 $freetext
     * @access public
     */
    public $freetext = null;

}

class NetRemitTourCodeType {

    /**
     * @var AlphaNumericString_Length1To2 $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var AlphaNumericString_Length1To14 $freetext
     * @access public
     */
    public $freetext = null;

}

class OptionalPNRActionsType {

    /**
     * @var NumericInteger_Length1To3 $optionCode
     * @access public
     */
    public $optionCode = null;

}

class OriginalIssueType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var AlphaNumericString_Length1To2 $voucherIndicator
     * @access public
     */
    public $voucherIndicator = null;

    /**
     * @var IssueInformationType $issue
     * @access public
     */
    public $issue = null;

    /**
     * @var NumericDecimal_Length1To10 $baseFare
     * @access public
     */
    public $baseFare = null;

    /**
     * @var NumericDecimal_Length1To10 $totalTax
     * @access public
     */
    public $totalTax = null;

    /**
     * @var NumericDecimal_Length1To10 $penalty
     * @access public
     */
    public $penalty = null;

    /**
     * @var AlphaNumericString_Length1To126 $freeflow
     * @access public
     */
    public $freeflow = null;

}

class PrinterIdentificationDetailsType {

    /**
     * @var AlphaNumericString_Length5To6 $name
     * @access public
     */
    public $name = null;

    /**
     * @var AlphaNumericString_Length2To2 $network
     * @access public
     */
    public $network = null;

}

class PrinterIdentificationType {

    /**
     * @var PrinterIdentificationDetailsType $identifierDetail
     * @access public
     */
    public $identifierDetail = null;

    /**
     * @var AlphaNumericString_Length9To9 $office
     * @access public
     */
    public $office = null;

    /**
     * @var AlphaNumericString_Length7To7 $teletypeAddress
     * @access public
     */
    public $teletypeAddress = null;

}

class ProductAccountDetailsType {

    /**
     * @var AlphaNumericString_Length1To3 $numberQualifier
     * @access public
     */
    public $numberQualifier = null;

    /**
     * @var AlphaNumericString_Length1To27 $number
     * @access public
     */
    public $number = null;

}

class RpInformationType {

    /**
     * @var AlphaNumericString_Length1To3 $companyId
     * @access public
     */
    public $companyId = null;

    /**
     * @var NumericInteger_Length1To12 $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

}

class SeatRequestType {

    /**
     * @var SeatRequierementsType $seat
     * @access public
     */
    public $seat = null;

    /**
     * @var SeatRequierementsDataType $special
     * @access public
     */
    public $special = null;

}

class SeatRequierementsDataType {

    /**
     * @var AlphaNumericString_Length1To4 $data
     * @access public
     */
    public $data = null;

    /**
     * @var AlphaNumericString_Length1To2 $seatType
     * @access public
     */
    public $seatType = null;

}

class SeatRequierementsType {

    /**
     * @var AlphaNumericString_Length1To3 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To4 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaString_Length3To3 $boardpoint
     * @access public
     */
    public $boardpoint = null;

    /**
     * @var AlphaString_Length3To3 $offpoint
     * @access public
     */
    public $offpoint = null;

}

class StructuredAddressInformationType_5063C {

    /**
     * @var AlphaNumericString_Length1To2 $option
     * @access public
     */
    public $option = null;

    /**
     * @var AlphaNumericString_Length1To50 $optionText
     * @access public
     */
    public $optionText = null;

}

class TicketingCarrierDesignatorType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var TicketingCarrierType $carrier
     * @access public
     */
    public $carrier = null;

}

class TicketingCarrierType {

    /**
     * @var AlphaNumericString_Length1To3 $airlineCode
     * @access public
     */
    public $airlineCode = null;

    /**
     * @var AlphaNumericString_Length1To4 $optionInfo
     * @access public
     */
    public $optionInfo = null;

    /**
     * @var AlphaNumericString_Length1To8 $printerNumber
     * @access public
     */
    public $printerNumber = null;

    /**
     * @var AlphaNumericString_Length1To3 $language
     * @access public
     */
    public $language = null;

}

class TourCodeType {

    /**
     * @var AlphaNumericString_Length1To3 $passengerType
     * @access public
     */
    public $passengerType = null;

    /**
     * @var FormatedTourCodeType $formatedTour
     * @access public
     */
    public $formatedTour = null;

    /**
     * @var NetRemitTourCodeType $netRemit
     * @access public
     */
    public $netRemit = null;

    /**
     * @var FreeFormatTourCodeType $freeFormatTour
     * @access public
     */
    public $freeFormatTour = null;

}

class PNR_Retrieve {

    /**
     * @var settings $settings
     * @access public
     */
    public $settings = null;

    /**
     * @var retrievalFacts $retrievalFacts
     * @access public
     */
    public $retrievalFacts = null;

}

class settings {

    /**
     * @var OptionalPNRActionsType $options
     * @access public
     */
    public $options = null;

    /**
     * @var PrinterIdentificationType $printer
     * @access public
     */
    public $printer = null;

}

class retrievalFacts {

    /**
     * @var RetrievePNRType $retrieve
     * @access public
     */
    public $retrieve = null;

    /**
     * @var ReservationControlInformationType $reservationOrProfileIdentifier
     * @access public
     */
    public $reservationOrProfileIdentifier = null;

    /**
     * @var personalFacts $personalFacts
     * @access public
     */
    public $personalFacts = null;

    /**
     * @var FrequentTravellerIdentificationCodeType $frequentFlyer
     * @access public
     */
    public $frequentFlyer = null;

    /**
     * @var AccountingInformationElementType $accounting
     * @access public
     */
    public $accounting = null;

}

class personalFacts {

    /**
     * @var TravellerInformationType $travellerInformation
     * @access public
     */
    public $travellerInformation = null;

    /**
     * @var TravelProductInformationType $productInformation
     * @access public
     */
    public $productInformation = null;

    /**
     * @var TicketNumberType $ticket
     * @access public
     */
    public $ticket = null;

}

class RetrievePNRType {

    /**
     * @var NumericInteger_Length1To2 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaString_Length3To3 $service
     * @access public
     */
    public $service = null;

    /**
     * @var AlphaNumericString_Length1To5 $tattoo
     * @access public
     */
    public $tattoo = null;

    /**
     * @var AlphaNumericString_Length9To9 $office
     * @access public
     */
    public $office = null;

    /**
     * @var AlphaNumericString_Length2To2 $targetSystem
     * @access public
     */
    public $targetSystem = null;

    /**
     * @var AlphaString_Length1To1 $option1
     * @access public
     */
    public $option1 = null;

    /**
     * @var AlphaString_Length1To1 $option2
     * @access public
     */
    public $option2 = null;

}

class PNR_Cancel {

    /**
     * @var ReservationControlInformationType $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     * @var OptionalPNRActionsType $pnrActions
     * @access public
     */
    public $pnrActions = null;

    /**
     * @var CancelPNRElementType $cancelElements
     * @access public
     */
    public $cancelElements = null;

}

class CancelPNRElementType {

    /**
     * @var AlphaNumericString_Length1To1 $entryType
     * @access public
     */
    public $entryType = null;

    /**
     * @var ElementIdentificationType $element
     * @access public
     */
    public $element = null;

}

class ElementIdentificationType {

    /**
     * @var AlphaNumericString_Length1To3 $identifier
     * @access public
     */
    public $identifier = null;

    /**
     * @var NumericInteger_Length1To5 $number
     * @access public
     */
    public $number = null;

    /**
     * @var NumericInteger_Length1To5 $subElement
     * @access public
     */
    public $subElement = null;

}

class Queue_PlacePNR {

    /**
     * @var SelectionDetailsTypeI $placementOption
     * @access public
     */
    public $placementOption = null;

    /**
     * @var targetDetails $targetDetails
     * @access public
     */
    public $targetDetails = null;

    /**
     * @var ReservationControlInformationTypeI $recordLocator
     * @access public
     */
    public $recordLocator = null;

}

class targetDetails {

    /**
     * @var AdditionalBusinessSourceInformationType $targetOffice
     * @access public
     */
    public $targetOffice = null;

    /**
     * @var QueueInformationTypeI $queueNumber
     * @access public
     */
    public $queueNumber = null;

    /**
     * @var SubQueueInformationTypeI $categoryDetails
     * @access public
     */
    public $categoryDetails = null;

    /**
     * @var StructuredDateTimeInformationType $placementDate
     * @access public
     */
    public $placementDate = null;

}

class QueueInformationDetailsTypeI {

    /**
     * @var NumericInteger_Length1To2 $number
     * @access public
     */
    public $number = null;

}

class QueueInformationTypeI {

    /**
     * @var QueueInformationDetailsTypeI $queueDetails
     * @access public
     */
    public $queueDetails = null;

}

class SubQueueInformationDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To3 $identificationType
     * @access public
     */
    public $identificationType = null;

    /**
     * @var AlphaNumericString_Length1To3 $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var AlphaNumericString_Length1To35 $itemDescription
     * @access public
     */
    public $itemDescription = null;

}

class SubQueueInformationTypeI {

    /**
     * @var SubQueueInformationDetailsTypeI $subQueueInfoDetails
     * @access public
     */
    public $subQueueInfoDetails = null;

}

class Queue_PlacePNRReply {

    /**
     * @var errorReturn $errorReturn
     * @access public
     */
    public $errorReturn = null;

    /**
     * @var ReservationControlInformationTypeI $recordLocator
     * @access public
     */
    public $recordLocator = null;

}

class errorReturn {

    /**
     * @var ApplicationErrorInformationTypeI $errorDefinition
     * @access public
     */
    public $errorDefinition = null;

    /**
     * @var FreeTextInformationType $errorText
     * @access public
     */
    public $errorText = null;

}

class ApplicationErrorInformationTypeI {

    /**
     * @var ApplicationErrorDetailTypeI $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class Air_RetrieveSeatMap {

    /**
     * @var travelProductIdent $travelProductIdent
     * @access public
     */
    public $travelProductIdent = null;

    /**
     * @var seatRequestParameters $seatRequestParameters
     * @access public
     */
    public $seatRequestParameters = null;

    /**
     * @var seatsInformations $seatsInformations
     * @access public
     */
    public $seatsInformations = null;

    /**
     * @var frequentTravelerSpecif $frequentTravelerSpecif
     * @access public
     */
    public $frequentTravelerSpecif = null;

    /**
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     * @var travelers $travelers
     * @access public
     */
    public $travelers = null;

}

class travelProductIdent {

    /**
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var boardpointDetail $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var offPointDetail2 $offPointDetail2
     * @access public
     */
    public $offPointDetail2 = null;

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

}

class boardpointDetail {

    /**
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

}

class offPointDetail2 {

    /**
     * @var arrivalCityCode $arrivalCityCode
     * @access public
     */
    public $arrivalCityCode = null;

}

class seatRequestParameters {

    /**
     * @var genericDetails $genericDetails
     * @access public
     */
    public $genericDetails = null;

    /**
     * @var rangeOfRowsDetails $rangeOfRowsDetails
     * @access public
     */
    public $rangeOfRowsDetails = null;

    /**
     * @var actionRequired $actionRequired
     * @access public
     */
    public $actionRequired = null;

    /**
     * @var freeSeatingReference $freeSeatingReference
     * @access public
     */
    public $freeSeatingReference = null;

    /**
     * @var infoRelatedToCabinClass $infoRelatedToCabinClass
     * @access public
     */
    public $infoRelatedToCabinClass = null;

}

class genericDetails {

    /**
     * @var cabinClassDesignator $cabinClassDesignator
     * @access public
     */
    public $cabinClassDesignator = null;

    /**
     * @var noSmokingIndicator $noSmokingIndicator
     * @access public
     */
    public $noSmokingIndicator = null;

    /**
     * @var cabinClassOfService $cabinClassOfService
     * @access public
     */
    public $cabinClassOfService = null;

    /**
     * @var cabinCompartment $cabinCompartment
     * @access public
     */
    public $cabinCompartment = null;

    /**
     * @var seatCharacteristic $seatCharacteristic
     * @access public
     */
    public $seatCharacteristic = null;

}

class rangeOfRowsDetails {

    /**
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

    /**
     * @var numberOfRows $numberOfRows
     * @access public
     */
    public $numberOfRows = null;

    /**
     * @var seatColumn $seatColumn
     * @access public
     */
    public $seatColumn = null;

}

class seatsInformations {

    /**
     * @var numberOfSeats $numberOfSeats
     * @access public
     */
    public $numberOfSeats = null;

    /**
     * @var statusCodeRequested $statusCodeRequested
     * @access public
     */
    public $statusCodeRequested = null;

}

class frequentTravelerSpecif {

    /**
     * @var frequentTravelerInfo $frequentTravelerInfo
     * @access public
     */
    public $frequentTravelerInfo = null;

    /**
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class frequentTravelerInfo {

    /**
     * @var frequentTravelerCompany $frequentTravelerCompany
     * @access public
     */
    public $frequentTravelerCompany = null;

    /**
     * @var frequentTravelerIdentCode $frequentTravelerIdentCode
     * @access public
     */
    public $frequentTravelerIdentCode = null;

    /**
     * @var frequentTravelerRefNumber $frequentTravelerRefNumber
     * @access public
     */
    public $frequentTravelerRefNumber = null;

    /**
     * @var membershipLevel $membershipLevel
     * @access public
     */
    public $membershipLevel = null;

}

class reservationInfo {

    /**
     * @var reservation $reservation
     * @access public
     */
    public $reservation = null;

}

class travelers {

    /**
     * @var travelerInformation $travelerInformation
     * @access public
     */
    public $travelerInformation = null;

    /**
     * @var frequentTraveler $frequentTraveler
     * @access public
     */
    public $frequentTraveler = null;

}

class travelerInformation {

    /**
     * @var paxSurnameDetails $paxSurnameDetails
     * @access public
     */
    public $paxSurnameDetails = null;

    /**
     * @var individualPaxDetails $individualPaxDetails
     * @access public
     */
    public $individualPaxDetails = null;

}

class paxSurnameDetails {

    /**
     * @var paxSurname $paxSurname
     * @access public
     */
    public $paxSurname = null;

    /**
     * @var paxType $paxType
     * @access public
     */
    public $paxType = null;

    /**
     * @var paxNumber $paxNumber
     * @access public
     */
    public $paxNumber = null;

    /**
     * @var paxStatus $paxStatus
     * @access public
     */
    public $paxStatus = null;

}

class individualPaxDetails {

    /**
     * @var individualPaxGivenName $individualPaxGivenName
     * @access public
     */
    public $individualPaxGivenName = null;

    /**
     * @var individualPaxType $individualPaxType
     * @access public
     */
    public $individualPaxType = null;

    /**
     * @var paxReferenceNumber $paxReferenceNumber
     * @access public
     */
    public $paxReferenceNumber = null;

    /**
     * @var paxInfantIndicator $paxInfantIndicator
     * @access public
     */
    public $paxInfantIndicator = null;

    /**
     * @var identificationCode $identificationCode
     * @access public
     */
    public $identificationCode = null;

}

class frequentTraveler {

    /**
     * @var frequentTravelerInfo $frequentTravelerInfo
     * @access public
     */
    public $frequentTravelerInfo = null;

    /**
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class Air_RetrieveSeatMapReply {

    /**
     * @var responseAnalysisDetails $responseAnalysisDetails
     * @access public
     */
    public $responseAnalysisDetails = null;

    /**
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

    /**
     * @var warningInformation $warningInformation
     * @access public
     */
    public $warningInformation = null;

    /**
     * @var seatRequestParameters $seatRequestParameters
     * @access public
     */
    public $seatRequestParameters = null;

    /**
     * @var segment $segment
     * @access public
     */
    public $segment = null;

}

class responseAnalysisDetails {

    /**
     * @var responseType $responseType
     * @access public
     */
    public $responseType = null;

    /**
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class errorInformation {

    /**
     * @var errorDetail $errorDetail
     * @access public
     */
    public $errorDetail = null;

}

class warningInformation {

    /**
     * @var warningCode $warningCode
     * @access public
     */
    public $warningCode = null;

    /**
     * @var warningText $warningText
     * @access public
     */
    public $warningText = null;

}

class warningDetails {

    /**
     * @var processingLevel $processingLevel
     * @access public
     */
    public $processingLevel = null;

    /**
     * @var warningNumber $warningNumber
     * @access public
     */
    public $warningNumber = null;

    /**
     * @var warningText $warningText
     * @access public
     */
    public $warningText = null;

}

class segment {

    /**
     * @var flightDateInformation $flightDateInformation
     * @access public
     */
    public $flightDateInformation = null;

    /**
     * @var segmentErrorDetails $segmentErrorDetails
     * @access public
     */
    public $segmentErrorDetails = null;

    /**
     * @var segmentWarningInformation $segmentWarningInformation
     * @access public
     */
    public $segmentWarningInformation = null;

    /**
     * @var additionalProductInfo $additionalProductInfo
     * @access public
     */
    public $additionalProductInfo = null;

    /**
     * @var aircraftEquipementDetails $aircraftEquipementDetails
     * @access public
     */
    public $aircraftEquipementDetails = null;

    /**
     * @var cabin $cabin
     * @access public
     */
    public $cabin = null;

    /**
     * @var row $row
     * @access public
     */
    public $row = null;

}

class flightDateInformation {

    /**
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

    /**
     * @var boardpointDetail $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var offPointDetail2 $offPointDetail2
     * @access public
     */
    public $offPointDetail2 = null;

    /**
     * @var companyIdentification $companyIdentification
     * @access public
     */
    public $companyIdentification = null;

    /**
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

}

class segmentErrorDetails {

    /**
     * @var errorInformation $errorInformation
     * @access public
     */
    public $errorInformation = null;

}

class segmentWarningInformation {

    /**
     * @var warningDetails $warningDetails
     * @access public
     */
    public $warningDetails = null;

}

class additionalProductInfo {

    /**
     * @var additionalProductDetails $additionalProductDetails
     * @access public
     */
    public $additionalProductDetails = null;

    /**
     * @var departureInformation $departureInformation
     * @access public
     */
    public $departureInformation = null;

    /**
     * @var arrivalInformation $arrivalInformation
     * @access public
     */
    public $arrivalInformation = null;

    /**
     * @var travelerTimeDetails $travelerTimeDetails
     * @access public
     */
    public $travelerTimeDetails = null;

    /**
     * @var productFacilities $productFacilities
     * @access public
     */
    public $productFacilities = null;

}

class additionalProductDetails {

    /**
     * @var meansOfTransportType $meansOfTransportType
     * @access public
     */
    public $meansOfTransportType = null;

    /**
     * @var numberOfStops $numberOfStops
     * @access public
     */
    public $numberOfStops = null;

    /**
     * @var legDuration $legDuration
     * @access public
     */
    public $legDuration = null;

    /**
     * @var daysOfOperation $daysOfOperation
     * @access public
     */
    public $daysOfOperation = null;

}

class departureInformation {

    /**
     * @var arrivalGate $arrivalGate
     * @access public
     */
    public $arrivalGate = null;

    /**
     * @var arrivalTerminal $arrivalTerminal
     * @access public
     */
    public $arrivalTerminal = null;

    /**
     * @var arrivalConcourse $arrivalConcourse
     * @access public
     */
    public $arrivalConcourse = null;

}

class arrivalInformation {

    /**
     * @var arrivalGate $arrivalGate
     * @access public
     */
    public $arrivalGate = null;

    /**
     * @var arrivalTerminal $arrivalTerminal
     * @access public
     */
    public $arrivalTerminal = null;

    /**
     * @var arrivalConcourse $arrivalConcourse
     * @access public
     */
    public $arrivalConcourse = null;

}

class travelerTimeDetails {

    /**
     * @var checkInDetails $checkInDetails
     * @access public
     */
    public $checkInDetails = null;

}

class productFacilities {

    /**
     * @var facilityTypeCode $facilityTypeCode
     * @access public
     */
    public $facilityTypeCode = null;

    /**
     * @var facilityDescriptionText $facilityDescriptionText
     * @access public
     */
    public $facilityDescriptionText = null;

}

class aircraftEquipementDetails {

    /**
     * @var fittedConfiguration $fittedConfiguration
     * @access public
     */
    public $fittedConfiguration = null;

    /**
     * @var meansOfTransport $meansOfTransport
     * @access public
     */
    public $meansOfTransport = null;

    /**
     * @var additionalEquipmentInfo $additionalEquipmentInfo
     * @access public
     */
    public $additionalEquipmentInfo = null;

    /**
     * @var equipmentFreeText $equipmentFreeText
     * @access public
     */
    public $equipmentFreeText = null;

}

class fittedConfiguration {

    /**
     * @var cabinClass $cabinClass
     * @access public
     */
    public $cabinClass = null;

    /**
     * @var cabinCapacity $cabinCapacity
     * @access public
     */
    public $cabinCapacity = null;

}

class additionalEquipmentInfo {

    /**
     * @var aircraftVersion $aircraftVersion
     * @access public
     */
    public $aircraftVersion = null;

    /**
     * @var airlineDetails $airlineDetails
     * @access public
     */
    public $airlineDetails = null;

}

class cabin {

    /**
     * @var cabinDetails $cabinDetails
     * @access public
     */
    public $cabinDetails = null;

    /**
     * @var cabinFacilitiesDetail $cabinFacilitiesDetail
     * @access public
     */
    public $cabinFacilitiesDetail = null;

}

class cabinDetails {

    /**
     * @var cabinClassDesignation $cabinClassDesignation
     * @access public
     */
    public $cabinClassDesignation = null;

    /**
     * @var cabinRangeOfRowsDetail $cabinRangeOfRowsDetail
     * @access public
     */
    public $cabinRangeOfRowsDetail = null;

    /**
     * @var cabinLocation $cabinLocation
     * @access public
     */
    public $cabinLocation = null;

    /**
     * @var smokingRowRange $smokingRowRange
     * @access public
     */
    public $smokingRowRange = null;

    /**
     * @var seatOccupationDefault $seatOccupationDefault
     * @access public
     */
    public $seatOccupationDefault = null;

    /**
     * @var overwingRowRange $overwingRowRange
     * @access public
     */
    public $overwingRowRange = null;

    /**
     * @var cabinColumnDetails $cabinColumnDetails
     * @access public
     */
    public $cabinColumnDetails = null;

}

class cabinClassDesignation {

    /**
     * @var cabinClassDesignator $cabinClassDesignator
     * @access public
     */
    public $cabinClassDesignator = null;

    /**
     * @var resBookingDesignator $resBookingDesignator
     * @access public
     */
    public $resBookingDesignator = null;

    /**
     * @var cabinClassOfServiceCode $cabinClassOfServiceCode
     * @access public
     */
    public $cabinClassOfServiceCode = null;

    /**
     * @var compartmentDesignator $compartmentDesignator
     * @access public
     */
    public $compartmentDesignator = null;

}

class cabinRangeOfRowsDetail {

    /**
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

}

class smokingRowRange {

    /**
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

}

class overwingRowRange {

    /**
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

}

class cabinColumnDetails {

    /**
     * @var seatColumn $seatColumn
     * @access public
     */
    public $seatColumn = null;

    /**
     * @var columnCharacteristic $columnCharacteristic
     * @access public
     */
    public $columnCharacteristic = null;

}

class cabinFacilitiesDetail {

    /**
     * @var rowLocation $rowLocation
     * @access public
     */
    public $rowLocation = null;

    /**
     * @var cabinFacilities $cabinFacilities
     * @access public
     */
    public $cabinFacilities = null;

}

class cabinFacilities {

    /**
     * @var typeOfFacilities $typeOfFacilities
     * @access public
     */
    public $typeOfFacilities = null;

    /**
     * @var locationOfTheFacility $locationOfTheFacility
     * @access public
     */
    public $locationOfTheFacility = null;

}

class row {

    /**
     * @var rowDetails $rowDetails
     * @access public
     */
    public $rowDetails = null;

    /**
     * @var rowFacilitiesDetail $rowFacilitiesDetail
     * @access public
     */
    public $rowFacilitiesDetail = null;

}

class rowDetails {

    /**
     * @var seatRowNumber $seatRowNumber
     * @access public
     */
    public $seatRowNumber = null;

    /**
     * @var rowCharacteristicsDetails $rowCharacteristicsDetails
     * @access public
     */
    public $rowCharacteristicsDetails = null;

    /**
     * @var seatOccupationDetails $seatOccupationDetails
     * @access public
     */
    public $seatOccupationDetails = null;

}

class rowCharacteristicsDetails {

    /**
     * @var rowCharacteristic $rowCharacteristic
     * @access public
     */
    public $rowCharacteristic = null;

}

class seatOccupationDetails {

    /**
     * @var seatColumn $seatColumn
     * @access public
     */
    public $seatColumn = null;

    /**
     * @var seatOccupation $seatOccupation
     * @access public
     */
    public $seatOccupation = null;

    /**
     * @var seatCharacteristic $seatCharacteristic
     * @access public
     */
    public $seatCharacteristic = null;

}

class rowFacilitiesDetail {

    /**
     * @var rowLocation $rowLocation
     * @access public
     */
    public $rowLocation = null;

    /**
     * @var cabinFacilities $cabinFacilities
     * @access public
     */
    public $cabinFacilities = null;

}

class Ticket_CreateTSTFromPricing {

    /**
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     * @var psaList $psaList
     * @access public
     */
    public $psaList = null;

}

class pnrLocatorData {

    /**
     * @var reservationInformation $reservationInformation
     * @access public
     */
    public $reservationInformation = null;

}

class reservationInformation {

    /**
     * @var controlNumber $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class psaList {

    /**
     * @var itemReference $itemReference
     * @access public
     */
    public $itemReference = null;

    /**
     * @var paxReference $paxReference
     * @access public
     */
    public $paxReference = null;

}

class itemReference {

    /**
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

}

class paxReference {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class refDetails {

    /**
     * @var refQualifier $refQualifier
     * @access public
     */
    public $refQualifier = null;

    /**
     * @var refNumber $refNumber
     * @access public
     */
    public $refNumber = null;

}

class Ticket_CreateTSTFromPricingReply {

    /**
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     * @var tstList $tstList
     * @access public
     */
    public $tstList = null;

}

class applicationError {

    /**
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class applicationErrorInfo {

    /**
     * @var applicationErrorDetail $applicationErrorDetail
     * @access public
     */
    public $applicationErrorDetail = null;

}

class applicationErrorDetail {

    /**
     * @var applicationErrorCode $applicationErrorCode
     * @access public
     */
    public $applicationErrorCode = null;

    /**
     * @var codeListQualifier $codeListQualifier
     * @access public
     */
    public $codeListQualifier = null;

    /**
     * @var codeListResponsibleAgency $codeListResponsibleAgency
     * @access public
     */
    public $codeListResponsibleAgency = null;

}

class errorText {

    /**
     * @var errorFreeText $errorFreeText
     * @access public
     */
    public $errorFreeText = null;

}

class tstList {

    /**
     * @var tstReference $tstReference
     * @access public
     */
    public $tstReference = null;

    /**
     * @var paxInformation $paxInformation
     * @access public
     */
    public $paxInformation = null;

}

class tstReference {

    /**
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

    /**
     * @var iDDescription $iDDescription
     * @access public
     */
    public $iDDescription = null;

}

class iDDescription {

    /**
     * @var iDSequenceNumber $iDSequenceNumber
     * @access public
     */
    public $iDSequenceNumber = null;

}

class paxInformation {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class Fare_InformativePricingWithoutPNR {

    /**
     * @var messageDetails $messageDetails
     * @access public
     */
    public $messageDetails = null;

    /**
     * @var originatorGroup $originatorGroup
     * @access public
     */
    public $originatorGroup = null;

    /**
     * @var currencyOverride $currencyOverride
     * @access public
     */
    public $currencyOverride = null;

    /**
     * @var carrierFees $carrierFees
     * @access public
     */
    public $carrierFees = null;

    /**
     * @var corporateFares $corporateFares
     * @access public
     */
    public $corporateFares = null;

    /**
     * @var taxExemptGroup $taxExemptGroup
     * @access public
     */
    public $taxExemptGroup = null;

    /**
     * @var generalFormOfPayment $generalFormOfPayment
     * @access public
     */
    public $generalFormOfPayment = null;

    /**
     * @var passengersGroup $passengersGroup
     * @access public
     */
    public $passengersGroup = null;

    /**
     * @var pricingOptionsGroup $pricingOptionsGroup
     * @access public
     */
    public $pricingOptionsGroup = null;

    /**
     * @var tripsGroup $tripsGroup
     * @access public
     */
    public $tripsGroup = null;

    /**
     * @var obFeeRequestGroup $obFeeRequestGroup
     * @access public
     */
    public $obFeeRequestGroup = null;

}

class messageDetails {

    /**
     * @var messageFunctionDetails $messageFunctionDetails
     * @access public
     */
    public $messageFunctionDetails = null;

    /**
     * @var responseType $responseType
     * @access public
     */
    public $responseType = null;

}

class originatorGroup {

    /**
     * @var additionalBusinessInformation $additionalBusinessInformation
     * @access public
     */
    public $additionalBusinessInformation = null;

}

class additionalBusinessInformation {

    /**
     * @var sourceType $sourceType
     * @access public
     */
    public $sourceType = null;

    /**
     * @var originatorDetails $originatorDetails
     * @access public
     */
    public $originatorDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var countryCode $countryCode
     * @access public
     */
    public $countryCode = null;

    /**
     * @var systemCode $systemCode
     * @access public
     */
    public $systemCode = null;

}

class sourceType {

    /**
     * @var sourceQualifier1 $sourceQualifier1
     * @access public
     */
    public $sourceQualifier1 = null;

    /**
     * @var sourceQualifier2 $sourceQualifier2
     * @access public
     */
    public $sourceQualifier2 = null;

}

class originatorDetails {

    /**
     * @var originatorId $originatorId
     * @access public
     */
    public $originatorId = null;

    /**
     * @var inHouseIdentification1 $inHouseIdentification1
     * @access public
     */
    public $inHouseIdentification1 = null;

    /**
     * @var inHouseIdentification2 $inHouseIdentification2
     * @access public
     */
    public $inHouseIdentification2 = null;

    /**
     * @var inHouseIdentification3 $inHouseIdentification3
     * @access public
     */
    public $inHouseIdentification3 = null;

}

class currencyOverride {

    /**
     * @var firstRateDetail $firstRateDetail
     * @access public
     */
    public $firstRateDetail = null;

    /**
     * @var secondRateDetail $secondRateDetail
     * @access public
     */
    public $secondRateDetail = null;

}

class carrierFees {

    /**
     * @var infoQualifier $infoQualifier
     * @access public
     */
    public $infoQualifier = null;

    /**
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class corporateFares {

    /**
     * @var corporateFareIdentifiers $corporateFareIdentifiers
     * @access public
     */
    public $corporateFareIdentifiers = null;

}

class corporateFareIdentifiers {

    /**
     * @var fareQualifier $fareQualifier
     * @access public
     */
    public $fareQualifier = null;

    /**
     * @var corporateID $corporateID
     * @access public
     */
    public $corporateID = null;

}

class taxExemptGroup {

    /**
     * @var taxExempt $taxExempt
     * @access public
     */
    public $taxExempt = null;

}

class taxExempt {

    /**
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class generalFormOfPayment {

    /**
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     * @var otherFormOfPayment $otherFormOfPayment
     * @access public
     */
    public $otherFormOfPayment = null;

}

class formOfPayment {

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     * @var chargedAmount $chargedAmount
     * @access public
     */
    public $chargedAmount = null;

    /**
     * @var creditCardNumber $creditCardNumber
     * @access public
     */
    public $creditCardNumber = null;

}

class otherFormOfPayment {

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var vendorCode $vendorCode
     * @access public
     */
    public $vendorCode = null;

    /**
     * @var creditCardNumber $creditCardNumber
     * @access public
     */
    public $creditCardNumber = null;

    /**
     * @var expiryDate $expiryDate
     * @access public
     */
    public $expiryDate = null;

    /**
     * @var approvalCode $approvalCode
     * @access public
     */
    public $approvalCode = null;

    /**
     * @var sourceOfApproval $sourceOfApproval
     * @access public
     */
    public $sourceOfApproval = null;

    /**
     * @var authorisedAmount $authorisedAmount
     * @access public
     */
    public $authorisedAmount = null;

    /**
     * @var addressVerification $addressVerification
     * @access public
     */
    public $addressVerification = null;

    /**
     * @var customerAccount $customerAccount
     * @access public
     */
    public $customerAccount = null;

    /**
     * @var extendedPayment $extendedPayment
     * @access public
     */
    public $extendedPayment = null;

    /**
     * @var fopFreeText $fopFreeText
     * @access public
     */
    public $fopFreeText = null;

    /**
     * @var membershipStatus $membershipStatus
     * @access public
     */
    public $membershipStatus = null;

    /**
     * @var transactionInfo $transactionInfo
     * @access public
     */
    public $transactionInfo = null;

}

class passengersGroup {

    /**
     * @var segmentRepetitionControl $segmentRepetitionControl
     * @access public
     */
    public $segmentRepetitionControl = null;

    /**
     * @var travellersID $travellersID
     * @access public
     */
    public $travellersID = null;

    /**
     * @var ptcGroup $ptcGroup
     * @access public
     */
    public $ptcGroup = null;

}

class segmentRepetitionControl {

    /**
     * @var segmentControlDetails $segmentControlDetails
     * @access public
     */
    public $segmentControlDetails = null;

}

class travellersID {

    /**
     * @var travellerDetails $travellerDetails
     * @access public
     */
    public $travellerDetails = null;

}

class travellerDetails {

    /**
     * @var referenceNumber $referenceNumber
     * @access public
     */
    public $referenceNumber = null;

    /**
     * @var measurementValue $measurementValue
     * @access public
     */
    public $measurementValue = null;

    /**
     * @var firstDate $firstDate
     * @access public
     */
    public $firstDate = null;

    /**
     * @var surname $surname
     * @access public
     */
    public $surname = null;

    /**
     * @var firstName $firstName
     * @access public
     */
    public $firstName = null;

}

class ptcGroup {

    /**
     * @var discountPtc $discountPtc
     * @access public
     */
    public $discountPtc = null;

    /**
     * @var passengerFormOfPayment $passengerFormOfPayment
     * @access public
     */
    public $passengerFormOfPayment = null;

}

class discountPtc {

    /**
     * @var valueQualifier $valueQualifier
     * @access public
     */
    public $valueQualifier = null;

    /**
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var identityNumber $identityNumber
     * @access public
     */
    public $identityNumber = null;

    /**
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

    /**
     * @var rateCategory $rateCategory
     * @access public
     */
    public $rateCategory = null;

}

class passengerFormOfPayment {

    /**
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

    /**
     * @var otherFormOfPayment $otherFormOfPayment
     * @access public
     */
    public $otherFormOfPayment = null;

}

class pricingOptionsGroup {

    /**
     * @var pricingDetails $pricingDetails
     * @access public
     */
    public $pricingDetails = null;

    /**
     * @var extPricingDetails $extPricingDetails
     * @access public
     */
    public $extPricingDetails = null;

}

class pricingDetails {

    /**
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class priceTicketDetails {

    /**
     * @var indicators $indicators
     * @access public
     */
    public $indicators = null;

}

class companyNumberDetails {

    /**
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

    /**
     * @var otherIdentifier $otherIdentifier
     * @access public
     */
    public $otherIdentifier = null;

}

class extPricingDetails {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class tripsGroup {

    /**
     * @var originDestination $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     * @var segmentGroup $segmentGroup
     * @access public
     */
    public $segmentGroup = null;

}

class segmentGroup {

    /**
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

    /**
     * @var additionnalSegmentDetails $additionnalSegmentDetails
     * @access public
     */
    public $additionnalSegmentDetails = null;

    /**
     * @var segmentPricingOptions $segmentPricingOptions
     * @access public
     */
    public $segmentPricingOptions = null;

    /**
     * @var zapOffDetails $zapOffDetails
     * @access public
     */
    public $zapOffDetails = null;

    /**
     * @var inventoryGroup $inventoryGroup
     * @access public
     */
    public $inventoryGroup = null;

}

class additionnalSegmentDetails {

    /**
     * @var legDetails $legDetails
     * @access public
     */
    public $legDetails = null;

    /**
     * @var departureStationInfo $departureStationInfo
     * @access public
     */
    public $departureStationInfo = null;

    /**
     * @var arrivalStationInfo $arrivalStationInfo
     * @access public
     */
    public $arrivalStationInfo = null;

    /**
     * @var mileageTimeDetails $mileageTimeDetails
     * @access public
     */
    public $mileageTimeDetails = null;

    /**
     * @var travellerTimeDetails $travellerTimeDetails
     * @access public
     */
    public $travellerTimeDetails = null;

    /**
     * @var facilitiesInformation $facilitiesInformation
     * @access public
     */
    public $facilitiesInformation = null;

}

class mileageTimeDetails {

    /**
     * @var totalMileage $totalMileage
     * @access public
     */
    public $totalMileage = null;

}

class travellerTimeDetails {

    /**
     * @var departureTime $departureTime
     * @access public
     */
    public $departureTime = null;

    /**
     * @var arrivalTime $arrivalTime
     * @access public
     */
    public $arrivalTime = null;

    /**
     * @var checkInDateTime $checkInDateTime
     * @access public
     */
    public $checkInDateTime = null;

}

class segmentPricingOptions {

    /**
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class zapOffDetails {

    /**
     * @var zapOffType $zapOffType
     * @access public
     */
    public $zapOffType = null;

    /**
     * @var zapOffAmount $zapOffAmount
     * @access public
     */
    public $zapOffAmount = null;

    /**
     * @var zapOffPercentage $zapOffPercentage
     * @access public
     */
    public $zapOffPercentage = null;

}

class inventoryGroup {

    /**
     * @var inventory $inventory
     * @access public
     */
    public $inventory = null;

}

class inventory {

    /**
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class obFeeRequestGroup {

    /**
     * @var markerFeeOptions $markerFeeOptions
     * @access public
     */
    public $markerFeeOptions = null;

    /**
     * @var feeOptionInfoGroup $feeOptionInfoGroup
     * @access public
     */
    public $feeOptionInfoGroup = null;

}

class markerFeeOptions {
    
}

class feeOptionInfoGroup {

    /**
     * @var feeTypeInfo $feeTypeInfo
     * @access public
     */
    public $feeTypeInfo = null;

    /**
     * @var rateTaxInfo $rateTaxInfo
     * @access public
     */
    public $rateTaxInfo = null;

    /**
     * @var feeDetailsInfoGroup $feeDetailsInfoGroup
     * @access public
     */
    public $feeDetailsInfoGroup = null;

}

class feeTypeInfo {

    /**
     * @var carrierFeeDetails $carrierFeeDetails
     * @access public
     */
    public $carrierFeeDetails = null;

}

class carrierFeeDetails {

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class rateTaxInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class feeDetailsInfoGroup {

    /**
     * @var feeInfo $feeInfo
     * @access public
     */
    public $feeInfo = null;

    /**
     * @var feeProcessingInfo $feeProcessingInfo
     * @access public
     */
    public $feeProcessingInfo = null;

    /**
     * @var associatedAmountsInfo $associatedAmountsInfo
     * @access public
     */
    public $associatedAmountsInfo = null;

}

class feeInfo {

    /**
     * @var dataTypeInformation $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     * @var dataInformation $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class dataTypeInformation {

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

}

class feeProcessingInfo {

    /**
     * @var carrierFeeDetails $carrierFeeDetails
     * @access public
     */
    public $carrierFeeDetails = null;

}

class associatedAmountsInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class Fare_InformativePricingWithoutPNRReply {

    /**
     * @var messageDetails $messageDetails
     * @access public
     */
    public $messageDetails = null;

    /**
     * @var errorGroup $errorGroup
     * @access public
     */
    public $errorGroup = null;

    /**
     * @var mainGroup $mainGroup
     * @access public
     */
    public $mainGroup = null;

}

class errorGroup {

    /**
     * @var errorCode $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     * @var errorMessage $errorMessage
     * @access public
     */
    public $errorMessage = null;

}

class errorCode {

    /**
     * @var errorDetails $errorDetails
     * @access public
     */
    public $errorDetails = null;

}

class mainGroup {

    /**
     * @var dummySegment $dummySegment
     * @access public
     */
    public $dummySegment = null;

    /**
     * @var convertionRate $convertionRate
     * @access public
     */
    public $convertionRate = null;

    /**
     * @var generalIndicatorsGroup $generalIndicatorsGroup
     * @access public
     */
    public $generalIndicatorsGroup = null;

    /**
     * @var pricingGroupLevelGroup $pricingGroupLevelGroup
     * @access public
     */
    public $pricingGroupLevelGroup = null;

}

class dummySegment {
    
}

class convertionRate {

    /**
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     * @var otherConvRateDetails $otherConvRateDetails
     * @access public
     */
    public $otherConvRateDetails = null;

}

class generalIndicatorsGroup {

    /**
     * @var generalIndicators $generalIndicators
     * @access public
     */
    public $generalIndicators = null;

}

class generalIndicators {

    /**
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class pricingGroupLevelGroup {

    /**
     * @var numberOfPax $numberOfPax
     * @access public
     */
    public $numberOfPax = null;

    /**
     * @var passengersID $passengersID
     * @access public
     */
    public $passengersID = null;

    /**
     * @var fareInfoGroup $fareInfoGroup
     * @access public
     */
    public $fareInfoGroup = null;

}

class numberOfPax {

    /**
     * @var segmentControlDetails $segmentControlDetails
     * @access public
     */
    public $segmentControlDetails = null;

}

class passengersID {

    /**
     * @var travellerDetails $travellerDetails
     * @access public
     */
    public $travellerDetails = null;

}

class fareInfoGroup {

    /**
     * @var emptySegment $emptySegment
     * @access public
     */
    public $emptySegment = null;

    /**
     * @var pricingIndicators $pricingIndicators
     * @access public
     */
    public $pricingIndicators = null;

    /**
     * @var fareAmount $fareAmount
     * @access public
     */
    public $fareAmount = null;

    /**
     * @var textData $textData
     * @access public
     */
    public $textData = null;

    /**
     * @var surchargesGroup $surchargesGroup
     * @access public
     */
    public $surchargesGroup = null;

    /**
     * @var corporateGroup $corporateGroup
     * @access public
     */
    public $corporateGroup = null;

    /**
     * @var negoFareGroup $negoFareGroup
     * @access public
     */
    public $negoFareGroup = null;

    /**
     * @var segmentLevelGroup $segmentLevelGroup
     * @access public
     */
    public $segmentLevelGroup = null;

    /**
     * @var structuredFareCalcGroup $structuredFareCalcGroup
     * @access public
     */
    public $structuredFareCalcGroup = null;

    /**
     * @var carrierFeeGroup $carrierFeeGroup
     * @access public
     */
    public $carrierFeeGroup = null;

}

class emptySegment {

    /**
     * @var valueQualifier $valueQualifier
     * @access public
     */
    public $valueQualifier = null;

    /**
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var identityNumber $identityNumber
     * @access public
     */
    public $identityNumber = null;

    /**
     * @var fareTypeGrouping $fareTypeGrouping
     * @access public
     */
    public $fareTypeGrouping = null;

    /**
     * @var rateCategory $rateCategory
     * @access public
     */
    public $rateCategory = null;

}

class pricingIndicators {

    /**
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class fareAmount {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class otherMonetaryDetails {

    /**
     * @var typeQualifier $typeQualifier
     * @access public
     */
    public $typeQualifier = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var location $location
     * @access public
     */
    public $location = null;

}

class textData {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class surchargesGroup {

    /**
     * @var taxesAmount $taxesAmount
     * @access public
     */
    public $taxesAmount = null;

    /**
     * @var penaltiesAmount $penaltiesAmount
     * @access public
     */
    public $penaltiesAmount = null;

    /**
     * @var pfcAmount $pfcAmount
     * @access public
     */
    public $pfcAmount = null;

}

class taxesAmount {

    /**
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class penaltiesAmount {

    /**
     * @var discountPenaltyQualifier $discountPenaltyQualifier
     * @access public
     */
    public $discountPenaltyQualifier = null;

    /**
     * @var discountPenaltyDetails $discountPenaltyDetails
     * @access public
     */
    public $discountPenaltyDetails = null;

}

class discountPenaltyDetails {

    /**
     * @var functionCustom $function
     * @access public
     */
    public $function = null;

    /**
     * @var amountType $amountType
     * @access public
     */
    public $amountType = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

}

class pfcAmount {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class corporateGroup {

    /**
     * @var corporateData $corporateData
     * @access public
     */
    public $corporateData = null;

}

class corporateData {

    /**
     * @var chargeCategory $chargeCategory
     * @access public
     */
    public $chargeCategory = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var locationCode $locationCode
     * @access public
     */
    public $locationCode = null;

    /**
     * @var otherLocationCode $otherLocationCode
     * @access public
     */
    public $otherLocationCode = null;

    /**
     * @var rate $rate
     * @access public
     */
    public $rate = null;

}

class negoFareGroup {

    /**
     * @var negoFareIndicators $negoFareIndicators
     * @access public
     */
    public $negoFareIndicators = null;

    /**
     * @var extNegoFareIndicators $extNegoFareIndicators
     * @access public
     */
    public $extNegoFareIndicators = null;

    /**
     * @var negoFareAmount $negoFareAmount
     * @access public
     */
    public $negoFareAmount = null;

    /**
     * @var negoFareText $negoFareText
     * @access public
     */
    public $negoFareText = null;

}

class negoFareIndicators {

    /**
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

    /**
     * @var fareValue $fareValue
     * @access public
     */
    public $fareValue = null;

    /**
     * @var priceType $priceType
     * @access public
     */
    public $priceType = null;

    /**
     * @var specialCondition $specialCondition
     * @access public
     */
    public $specialCondition = null;

    /**
     * @var otherSpecialCondition $otherSpecialCondition
     * @access public
     */
    public $otherSpecialCondition = null;

    /**
     * @var additionalSpecialCondition $additionalSpecialCondition
     * @access public
     */
    public $additionalSpecialCondition = null;

    /**
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

}

class fareBasisDetails {

    /**
     * @var primaryCode $primaryCode
     * @access public
     */
    public $primaryCode = null;

    /**
     * @var fareBasisCode $fareBasisCode
     * @access public
     */
    public $fareBasisCode = null;

    /**
     * @var ticketDesignator $ticketDesignator
     * @access public
     */
    public $ticketDesignator = null;

    /**
     * @var discTktDesignator $discTktDesignator
     * @access public
     */
    public $discTktDesignator = null;

}

class extNegoFareIndicators {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class negoFareAmount {

    /**
     * @var discountPenaltyQualifier $discountPenaltyQualifier
     * @access public
     */
    public $discountPenaltyQualifier = null;

    /**
     * @var discountPenaltyDetails $discountPenaltyDetails
     * @access public
     */
    public $discountPenaltyDetails = null;

}

class negoFareText {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class segmentLevelGroup {

    /**
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

    /**
     * @var additionalInformation $additionalInformation
     * @access public
     */
    public $additionalInformation = null;

    /**
     * @var fareBasis $fareBasis
     * @access public
     */
    public $fareBasis = null;

    /**
     * @var cabinGroup $cabinGroup
     * @access public
     */
    public $cabinGroup = null;

    /**
     * @var baggageAllowance $baggageAllowance
     * @access public
     */
    public $baggageAllowance = null;

    /**
     * @var ptcSegment $ptcSegment
     * @access public
     */
    public $ptcSegment = null;

    /**
     * @var couponInformation $couponInformation
     * @access public
     */
    public $couponInformation = null;

}

class additionalInformation {

    /**
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class fareBasis {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareCategories $fareCategories
     * @access public
     */
    public $fareCategories = null;

    /**
     * @var fareDetails $fareDetails
     * @access public
     */
    public $fareDetails = null;

    /**
     * @var additionalFareDetails $additionalFareDetails
     * @access public
     */
    public $additionalFareDetails = null;

    /**
     * @var discountDetails $discountDetails
     * @access public
     */
    public $discountDetails = null;

}

class cabinGroup {

    /**
     * @var cabinSegment $cabinSegment
     * @access public
     */
    public $cabinSegment = null;

}

class cabinSegment {

    /**
     * @var productDetailsQualifier $productDetailsQualifier
     * @access public
     */
    public $productDetailsQualifier = null;

    /**
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class baggageAllowance {

    /**
     * @var excessBaggageDetails $excessBaggageDetails
     * @access public
     */
    public $excessBaggageDetails = null;

    /**
     * @var baggageDetails $baggageDetails
     * @access public
     */
    public $baggageDetails = null;

    /**
     * @var otherBaggageDetails $otherBaggageDetails
     * @access public
     */
    public $otherBaggageDetails = null;

    /**
     * @var extraBaggageDetails $extraBaggageDetails
     * @access public
     */
    public $extraBaggageDetails = null;

    /**
     * @var bagTagDetails $bagTagDetails
     * @access public
     */
    public $bagTagDetails = null;

}

class excessBaggageDetails {

    /**
     * @var currency $currency
     * @access public
     */
    public $currency = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class baggageDetails {

    /**
     * @var freeAllowance $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     * @var quantityCode $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class otherBaggageDetails {

    /**
     * @var freeAllowance $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     * @var quantityCode $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class extraBaggageDetails {

    /**
     * @var freeAllowance $freeAllowance
     * @access public
     */
    public $freeAllowance = null;

    /**
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     * @var quantityCode $quantityCode
     * @access public
     */
    public $quantityCode = null;

    /**
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     * @var processIndicator $processIndicator
     * @access public
     */
    public $processIndicator = null;

}

class bagTagDetails {

    /**
     * @var company $company
     * @access public
     */
    public $company = null;

    /**
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

    /**
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     * @var location $location
     * @access public
     */
    public $location = null;

    /**
     * @var companyNumber $companyNumber
     * @access public
     */
    public $companyNumber = null;

    /**
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

    /**
     * @var characteristic $characteristic
     * @access public
     */
    public $characteristic = null;

    /**
     * @var specialRequirement $specialRequirement
     * @access public
     */
    public $specialRequirement = null;

    /**
     * @var measurement $measurement
     * @access public
     */
    public $measurement = null;

    /**
     * @var unitQualifier $unitQualifier
     * @access public
     */
    public $unitQualifier = null;

    /**
     * @var description $description
     * @access public
     */
    public $description = null;

}

class ptcSegment {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     * @var otherQuantityDetails $otherQuantityDetails
     * @access public
     */
    public $otherQuantityDetails = null;

}

class couponInformation {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     * @var otherquantityDetails2 $otherquantityDetails2
     * @access public
     */
    public $otherquantityDetails2 = null;

}

class otherquantityDetails2 {

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var value $value
     * @access public
     */
    public $value = null;

    /**
     * @var unit $unit
     * @access public
     */
    public $unit = null;

}

class structuredFareCalcGroup {

    /**
     * @var structureFareCalcRoot $structureFareCalcRoot
     * @access public
     */
    public $structureFareCalcRoot = null;

    /**
     * @var group27 $group27
     * @access public
     */
    public $group27 = null;

}

class structureFareCalcRoot {

    /**
     * @var fareComponentDetails $fareComponentDetails
     * @access public
     */
    public $fareComponentDetails = null;

    /**
     * @var ticketNumber $ticketNumber
     * @access public
     */
    public $ticketNumber = null;

}

class fareComponentDetails {

    /**
     * @var dataType $dataType
     * @access public
     */
    public $dataType = null;

    /**
     * @var count $count
     * @access public
     */
    public $count = null;

    /**
     * @var pricingDate $pricingDate
     * @access public
     */
    public $pricingDate = null;

    /**
     * @var accountCode $accountCode
     * @access public
     */
    public $accountCode = null;

    /**
     * @var inputDesignator $inputDesignator
     * @access public
     */
    public $inputDesignator = null;

}

class group27 {

    /**
     * @var structuredFareCalcG27EQN $structuredFareCalcG27EQN
     * @access public
     */
    public $structuredFareCalcG27EQN = null;

    /**
     * @var group28 $group28
     * @access public
     */
    public $group28 = null;

    /**
     * @var dummySegmentGroup27 $dummySegmentGroup27
     * @access public
     */
    public $dummySegmentGroup27 = null;

    /**
     * @var structuredFareCalcG27MON $structuredFareCalcG27MON
     * @access public
     */
    public $structuredFareCalcG27MON = null;

    /**
     * @var structuredFareCalcG27TXD $structuredFareCalcG27TXD
     * @access public
     */
    public $structuredFareCalcG27TXD = null;

    /**
     * @var structuredFareCalcG27CVR $structuredFareCalcG27CVR
     * @access public
     */
    public $structuredFareCalcG27CVR = null;

}

class structuredFareCalcG27EQN {

    /**
     * @var quantityDetails $quantityDetails
     * @access public
     */
    public $quantityDetails = null;

    /**
     * @var otherQuantityDetails $otherQuantityDetails
     * @access public
     */
    public $otherQuantityDetails = null;

}

class group28 {

    /**
     * @var structuredFareCalcG28ITM $structuredFareCalcG28ITM
     * @access public
     */
    public $structuredFareCalcG28ITM = null;

    /**
     * @var group29 $group29
     * @access public
     */
    public $group29 = null;

    /**
     * @var structuredFareCalcG28MON $structuredFareCalcG28MON
     * @access public
     */
    public $structuredFareCalcG28MON = null;

    /**
     * @var structuredFareCalcG28PTS $structuredFareCalcG28PTS
     * @access public
     */
    public $structuredFareCalcG28PTS = null;

    /**
     * @var structuredFareCalcG28FCC $structuredFareCalcG28FCC
     * @access public
     */
    public $structuredFareCalcG28FCC = null;

    /**
     * @var structuredFareCalcG28PTK $structuredFareCalcG28PTK
     * @access public
     */
    public $structuredFareCalcG28PTK = null;

    /**
     * @var structuredFareCalcG28FRU $structuredFareCalcG28FRU
     * @access public
     */
    public $structuredFareCalcG28FRU = null;

}

class structuredFareCalcG28ITM {

    /**
     * @var itemNumberDetails $itemNumberDetails
     * @access public
     */
    public $itemNumberDetails = null;

}

class group29 {

    /**
     * @var structuredFareCalcG28ADT $structuredFareCalcG28ADT
     * @access public
     */
    public $structuredFareCalcG28ADT = null;

    /**
     * @var structuredFareCalcG28TVL $structuredFareCalcG28TVL
     * @access public
     */
    public $structuredFareCalcG28TVL = null;

}

class structuredFareCalcG28ADT {

    /**
     * @var numberOfItemsDetails $numberOfItemsDetails
     * @access public
     */
    public $numberOfItemsDetails = null;

    /**
     * @var lastItemsDetails $lastItemsDetails
     * @access public
     */
    public $lastItemsDetails = null;

}

class numberOfItemsDetails {

    /**
     * @var actionQualifier $actionQualifier
     * @access public
     */
    public $actionQualifier = null;

    /**
     * @var referenceQualifier $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     * @var numberOfItems $numberOfItems
     * @access public
     */
    public $numberOfItems = null;

}

class lastItemsDetails {

    /**
     * @var numberOfItems $numberOfItems
     * @access public
     */
    public $numberOfItems = null;

    /**
     * @var lastItemIdentifier $lastItemIdentifier
     * @access public
     */
    public $lastItemIdentifier = null;

}

class structuredFareCalcG28TVL {

    /**
     * @var flightDate $flightDate
     * @access public
     */
    public $flightDate = null;

    /**
     * @var boardPointDetails $boardPointDetails
     * @access public
     */
    public $boardPointDetails = null;

    /**
     * @var offpointDetails $offpointDetails
     * @access public
     */
    public $offpointDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var flightIdentification $flightIdentification
     * @access public
     */
    public $flightIdentification = null;

    /**
     * @var flightTypeDetails $flightTypeDetails
     * @access public
     */
    public $flightTypeDetails = null;

    /**
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var specialSegment $specialSegment
     * @access public
     */
    public $specialSegment = null;

    /**
     * @var marriageDetails $marriageDetails
     * @access public
     */
    public $marriageDetails = null;

}

class structuredFareCalcG28MON {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class structuredFareCalcG28PTS {

    /**
     * @var itemNumber $itemNumber
     * @access public
     */
    public $itemNumber = null;

    /**
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

    /**
     * @var fareValue $fareValue
     * @access public
     */
    public $fareValue = null;

    /**
     * @var priceType $priceType
     * @access public
     */
    public $priceType = null;

    /**
     * @var specialCondition $specialCondition
     * @access public
     */
    public $specialCondition = null;

    /**
     * @var otherSpecialCondition $otherSpecialCondition
     * @access public
     */
    public $otherSpecialCondition = null;

    /**
     * @var additionalSpecialCondition $additionalSpecialCondition
     * @access public
     */
    public $additionalSpecialCondition = null;

    /**
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

}

class structuredFareCalcG28FCC {

    /**
     * @var chargeCategory $chargeCategory
     * @access public
     */
    public $chargeCategory = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

    /**
     * @var locationCode $locationCode
     * @access public
     */
    public $locationCode = null;

    /**
     * @var otherLocationCode $otherLocationCode
     * @access public
     */
    public $otherLocationCode = null;

    /**
     * @var rate $rate
     * @access public
     */
    public $rate = null;

}

class structuredFareCalcG28PTK {

    /**
     * @var priceTicketDetails $priceTicketDetails
     * @access public
     */
    public $priceTicketDetails = null;

    /**
     * @var priceTariffType $priceTariffType
     * @access public
     */
    public $priceTariffType = null;

    /**
     * @var productDateTimeDetails $productDateTimeDetails
     * @access public
     */
    public $productDateTimeDetails = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var companyNumberDetails $companyNumberDetails
     * @access public
     */
    public $companyNumberDetails = null;

    /**
     * @var locationDetails $locationDetails
     * @access public
     */
    public $locationDetails = null;

    /**
     * @var otherLocationDetails $otherLocationDetails
     * @access public
     */
    public $otherLocationDetails = null;

    /**
     * @var idNumber $idNumber
     * @access public
     */
    public $idNumber = null;

    /**
     * @var monetaryAmount $monetaryAmount
     * @access public
     */
    public $monetaryAmount = null;

}

class structuredFareCalcG28FRU {

    /**
     * @var tariffClassId $tariffClassId
     * @access public
     */
    public $tariffClassId = null;

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

    /**
     * @var ruleSectionId $ruleSectionId
     * @access public
     */
    public $ruleSectionId = null;

}

class dummySegmentGroup27 {
    
}

class structuredFareCalcG27MON {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class structuredFareCalcG27TXD {

    /**
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class structuredFareCalcG27CVR {

    /**
     * @var conversionRateDetails $conversionRateDetails
     * @access public
     */
    public $conversionRateDetails = null;

    /**
     * @var otherConvRateDetails $otherConvRateDetails
     * @access public
     */
    public $otherConvRateDetails = null;

}

class carrierFeeGroup {

    /**
     * @var feeType $feeType
     * @access public
     */
    public $feeType = null;

    /**
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class feeType {

    /**
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

}

class otherSelectionDetails {

    /**
     * @var option $option
     * @access public
     */
    public $option = null;

    /**
     * @var optionInformation $optionInformation
     * @access public
     */
    public $optionInformation = null;

}

class dataInformation {

    /**
     * @var indicator $indicator
     * @access public
     */
    public $indicator = null;

}

class feeAmounts {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class feeTaxes {

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

}

class feeDescription {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class MiniRule_GetFromPricing {

    /**
     * @var ItemReferencesAndVersionsType $fareRecommendationId
     * @access public
     */
    public $fareRecommendationId = null;

}

class MiniRule_GetFromPricingReply {

    /**
     * @var ResponseAnalysisDetailsType $responseDetails
     * @access public
     */
    public $responseDetails = null;

    /**
     * @var ErrorGroupType $errorWarningGroup
     * @access public
     */
    public $errorWarningGroup = null;

    /**
     * @var mnrByFareRecommendation $mnrByFareRecommendation
     * @access public
     */
    public $mnrByFareRecommendation = null;

}

class mnrByFareRecommendation {

    /**
     * @var ItemReferencesAndVersionsType $fareRecommendation
     * @access public
     */
    public $fareRecommendation = null;

    /**
     * @var ReferenceInformationType $paxRef
     * @access public
     */
    public $paxRef = null;

    /**
     * @var fareComponentInfo $fareComponentInfo
     * @access public
     */
    public $fareComponentInfo = null;

    /**
     * @var MiniRulesRegulPropertiesType $mnrRulesInfoGrp
     * @access public
     */
    public $mnrRulesInfoGrp = null;

}

class fareComponentInfo {

    /**
     * @var FareQualifierDetailsType $fareQualifierDetails
     * @access public
     */
    public $fareQualifierDetails = null;

    /**
     * @var ReferenceInfoType $fareComponentRef
     * @access public
     */
    public $fareComponentRef = null;

    /**
     * @var OriginAndDestinationDetailsTypeI $originAndDestination
     * @access public
     */
    public $originAndDestination = null;

    /**
     * @var ElementManagementSegmentType $segmentRefernce
     * @access public
     */
    public $segmentRefernce = null;

}

class AdditionalFareQualifierDetailsType {

    /**
     * @var AlphaNumericString_Length1To35 $rateClass
     * @access public
     */
    public $rateClass = null;

}

class MiniRulesRegulPropertiesType {

    /**
     * @var CategDescrType $mnrCatInfo
     * @access public
     */
    public $mnrCatInfo = null;

    /**
     * @var mnrFCInfoGrp $mnrFCInfoGrp
     * @access public
     */
    public $mnrFCInfoGrp = null;

    /**
     * @var mnrDateInfoGrp $mnrDateInfoGrp
     * @access public
     */
    public $mnrDateInfoGrp = null;

    /**
     * @var mnrMonInfoGrp $mnrMonInfoGrp
     * @access public
     */
    public $mnrMonInfoGrp = null;

    /**
     * @var mnrRestriAppInfoGrp $mnrRestriAppInfoGrp
     * @access public
     */
    public $mnrRestriAppInfoGrp = null;

}

class mnrFCInfoGrp {

    /**
     * @var ReferenceInfoType_98124S $refInfo
     * @access public
     */
    public $refInfo = null;

    /**
     * @var PlaceLocationIdentificationType $locationInfo
     * @access public
     */
    public $locationInfo = null;

}

class mnrDateInfoGrp {

    /**
     * @var DateAndTimeInformationType $dateInfo
     * @access public
     */
    public $dateInfo = null;

    /**
     * @var NumberOfUnitsType $valueInfo
     * @access public
     */
    public $valueInfo = null;

}

class mnrMonInfoGrp {

    /**
     * @var MonetaryInformationType $monetaryInfo
     * @access public
     */
    public $monetaryInfo = null;

    /**
     * @var NumberOfUnitsType $valueInfo
     * @access public
     */
    public $valueInfo = null;

}

class mnrRestriAppInfoGrp {

    /**
     * @var StatusType $mnrRestriAppInfo
     * @access public
     */
    public $mnrRestriAppInfo = null;

}

class ReferenceInfoType_98124S {

    /**
     * @var ReferencingDetailsType $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class ReferencingDetailsType_152449C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var NumericInteger_Length1To60 $value
     * @access public
     */
    public $value = null;

}

class ReferencingDetailsType_153016C {

    /**
     * @var AlphaNumericString_Length1To10 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To60 $value
     * @access public
     */
    public $value = null;

}

class ResponseAnalysisDetailsType {

    /**
     * @var AlphaString_Length1To6 $statusCode
     * @access public
     */
    public $statusCode = null;

}

class MiniRule_GetFromPricingRec {

    /**
     * @var ItemReferencesAndVersionsType $recordId
     * @access public
     */
    public $recordId = null;

}

class MiniRule_GetFromPricingRecReply {

    /**
     * @var ResponseAnalysisDetailsType $responseDetails
     * @access public
     */
    public $responseDetails = null;

    /**
     * @var ErrorGroupType $errorWarningGroup
     * @access public
     */
    public $errorWarningGroup = null;

    /**
     * @var mnrByPricingRecord $mnrByPricingRecord
     * @access public
     */
    public $mnrByPricingRecord = null;

}

class mnrByPricingRecord {

    /**
     * @var ItemReferencesAndVersionsType $pricingRecordId
     * @access public
     */
    public $pricingRecordId = null;

    /**
     * @var ElementManagementSegmentType_104354S $offerRef
     * @access public
     */
    public $offerRef = null;

    /**
     * @var ReferenceInformationType $paxRef
     * @access public
     */
    public $paxRef = null;

    /**
     * @var fareComponentInfo $fareComponentInfo
     * @access public
     */
    public $fareComponentInfo = null;

    /**
     * @var MiniRulesRegulPropertiesType $mnrRulesInfoGrp
     * @access public
     */
    public $mnrRulesInfoGrp = null;

}

class ElementManagementSegmentType_104354S {

    /**
     * @var ReferencingDetailsType_153016C $reference
     * @access public
     */
    public $reference = null;

}

class PNR_List {

    /**
     * @var freeFormText $freeFormText
     * @access public
     */
    public $freeFormText = null;

    /**
     * @var citypair $citypair
     * @access public
     */
    public $citypair = null;

    /**
     * @var errorInformation $errorInformation
     * @access public
     */
    public $errorInformation = null;

}

class freeFormText {

    /**
     * @var freetextDetail $freetextDetail
     * @access public
     */
    public $freetextDetail = null;

    /**
     * @var text $text
     * @access public
     */
    public $text = null;

}

class freetextDetail {

    /**
     * @var subjectQualifier $subjectQualifier
     * @access public
     */
    public $subjectQualifier = null;

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

}

class citypair {

    /**
     * @var originDestinationMarker $originDestinationMarker
     * @access public
     */
    public $originDestinationMarker = null;

    /**
     * @var travellerInformationSection $travellerInformationSection
     * @access public
     */
    public $travellerInformationSection = null;

}

class originDestinationMarker {
    
}

class travellerInformationSection {

    /**
     * @var travellerInformation $travellerInformation
     * @access public
     */
    public $travellerInformation = null;

    /**
     * @var relatedProduct $relatedProduct
     * @access public
     */
    public $relatedProduct = null;

    /**
     * @var travelProduct $travelProduct
     * @access public
     */
    public $travelProduct = null;

    /**
     * @var reservationInfo $reservationInfo
     * @access public
     */
    public $reservationInfo = null;

    /**
     * @var productInfo $productInfo
     * @access public
     */
    public $productInfo = null;

    /**
     * @var messageAction $messageAction
     * @access public
     */
    public $messageAction = null;

}

class travellerInformation {

    /**
     * @var traveller $traveller
     * @access public
     */
    public $traveller = null;

    /**
     * @var passenger $passenger
     * @access public
     */
    public $passenger = null;

}

class traveller {

    /**
     * @var surname $surname
     * @access public
     */
    public $surname = null;

}

class passenger {

    /**
     * @var firstName $firstName
     * @access public
     */
    public $firstName = null;

}

class relatedProduct {

    /**
     * @var quantity $quantity
     * @access public
     */
    public $quantity = null;

    /**
     * @var status $status
     * @access public
     */
    public $status = null;

}

class travelProduct {

    /**
     * @var product $product
     * @access public
     */
    public $product = null;

    /**
     * @var boardpointDetail $boardpointDetail
     * @access public
     */
    public $boardpointDetail = null;

    /**
     * @var offpointDetail $offpointDetail
     * @access public
     */
    public $offpointDetail = null;

    /**
     * @var companyDetail $companyDetail
     * @access public
     */
    public $companyDetail = null;

    /**
     * @var productDetails $productDetails
     * @access public
     */
    public $productDetails = null;

}

class product {

    /**
     * @var identification $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var description $description
     * @access public
     */
    public $description = null;

}

class offpointDetail {

    /**
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

}

class companyDetail {

    /**
     * @var identification $identification
     * @access public
     */
    public $identification = null;

}

class messageAction {

    /**
     * @var business $business
     * @access public
     */
    public $business = null;

}

class business {

    /**
     * @var functionCustom $function
     * @access public
     */
    public $function = null;

}

class errorDetail {

    /**
     * @var errorCode $errorCode
     * @access public
     */
    public $errorCode = null;

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var responsibleAgency $responsibleAgency
     * @access public
     */
    public $responsibleAgency = null;

}

class Fare_PricePNRWithBookingClass {

    /**
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     * @var paxSegReference $paxSegReference
     * @access public
     */
    public $paxSegReference = null;

    /**
     * @var overrideInformation $overrideInformation
     * @access public
     */
    public $overrideInformation = null;

    /**
     * @var dateOverride $dateOverride
     * @access public
     */
    public $dateOverride = null;

    /**
     * @var validatingCarrier $validatingCarrier
     * @access public
     */
    public $validatingCarrier = null;

    /**
     * @var cityOverride $cityOverride
     * @access public
     */
    public $cityOverride = null;

    /**
     * @var currencyOverride $currencyOverride
     * @access public
     */
    public $currencyOverride = null;

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

    /**
     * @var discountInformation $discountInformation
     * @access public
     */
    public $discountInformation = null;

    /**
     * @var pricingFareBase $pricingFareBase
     * @access public
     */
    public $pricingFareBase = null;

    /**
     * @var flightInformation $flightInformation
     * @access public
     */
    public $flightInformation = null;

    /**
     * @var openSegmentsInformation $openSegmentsInformation
     * @access public
     */
    public $openSegmentsInformation = null;

    /**
     * @var bookingClassSelection $bookingClassSelection
     * @access public
     */
    public $bookingClassSelection = null;

    /**
     * @var fopInformation $fopInformation
     * @access public
     */
    public $fopInformation = null;

    /**
     * @var carrierAgreements $carrierAgreements
     * @access public
     */
    public $carrierAgreements = null;

}

class paxSegReference {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class overrideInformation {

    /**
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class attributeDetails {

    /**
     * @var attributeType $attributeType
     * @access public
     */
    public $attributeType = null;

    /**
     * @var attributeDescription $attributeDescription
     * @access public
     */
    public $attributeDescription = null;

}

class dateOverride {

    /**
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class dateTimeCustom {

    /**
     * @var year $year
     * @access public
     */
    public $year = null;

    /**
     * @var month $month
     * @access public
     */
    public $month = null;

    /**
     * @var day $day
     * @access public
     */
    public $day = null;

}

class validatingCarrier {

    /**
     * @var carrierInformation $carrierInformation
     * @access public
     */
    public $carrierInformation = null;

}

class carrierInformation {

    /**
     * @var carrierCode $carrierCode
     * @access public
     */
    public $carrierCode = null;

}

class cityOverride {

    /**
     * @var cityDetail $cityDetail
     * @access public
     */
    public $cityDetail = null;

}

class cityDetail {

    /**
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

    /**
     * @var cityQualifier $cityQualifier
     * @access public
     */
    public $cityQualifier = null;

}

class firstRateDetail {

    /**
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

}

class secondRateDetail {

    /**
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var amount $amount
     * @access public
     */
    public $amount = null;

}

class taxIdentification {

    /**
     * @var taxIdentifier $taxIdentifier
     * @access public
     */
    public $taxIdentifier = null;

}

class taxType {

    /**
     * @var isoCountry $isoCountry
     * @access public
     */
    public $isoCountry = null;

}

class taxData {

    /**
     * @var taxRate $taxRate
     * @access public
     */
    public $taxRate = null;

    /**
     * @var taxValueQualifier $taxValueQualifier
     * @access public
     */
    public $taxValueQualifier = null;

}

class discountInformation {

    /**
     * @var penDisInformation $penDisInformation
     * @access public
     */
    public $penDisInformation = null;

    /**
     * @var referenceQualifier $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

}

class penDisInformation {

    /**
     * @var infoQualifier $infoQualifier
     * @access public
     */
    public $infoQualifier = null;

    /**
     * @var penDisData $penDisData
     * @access public
     */
    public $penDisData = null;

}

class penDisData {

    /**
     * @var penaltyQualifier $penaltyQualifier
     * @access public
     */
    public $penaltyQualifier = null;

    /**
     * @var penaltyAmount $penaltyAmount
     * @access public
     */
    public $penaltyAmount = null;

    /**
     * @var penaltyCurrency $penaltyCurrency
     * @access public
     */
    public $penaltyCurrency = null;

}

class referenceQualifier {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class pricingFareBase {

    /**
     * @var fareBasisOptions $fareBasisOptions
     * @access public
     */
    public $fareBasisOptions = null;

    /**
     * @var fareBasisSegReference $fareBasisSegReference
     * @access public
     */
    public $fareBasisSegReference = null;

    /**
     * @var fareBasisDates $fareBasisDates
     * @access public
     */
    public $fareBasisDates = null;

}

class fareBasisOptions {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

}

class fareBasisSegReference {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class fareBasisDates {

    /**
     * @var fareBasisDateQualifier $fareBasisDateQualifier
     * @access public
     */
    public $fareBasisDateQualifier = null;

    /**
     * @var fareBasisDate $fareBasisDate
     * @access public
     */
    public $fareBasisDate = null;

}

class fareBasisDate {

    /**
     * @var year $year
     * @access public
     */
    public $year = null;

    /**
     * @var month $month
     * @access public
     */
    public $month = null;

    /**
     * @var day $day
     * @access public
     */
    public $day = null;

}

class flightInformation {

    /**
     * @var itineraryOptions $itineraryOptions
     * @access public
     */
    public $itineraryOptions = null;

    /**
     * @var itinerarySegReference $itinerarySegReference
     * @access public
     */
    public $itinerarySegReference = null;

}

class itineraryOptions {

    /**
     * @var globalRoute $globalRoute
     * @access public
     */
    public $globalRoute = null;

    /**
     * @var bookingClass $bookingClass
     * @access public
     */
    public $bookingClass = null;

    /**
     * @var flightDetails $flightDetails
     * @access public
     */
    public $flightDetails = null;

}

class itinerarySegReference {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class openSegmentsInformation {

    /**
     * @var extendedItinerary $extendedItinerary
     * @access public
     */
    public $extendedItinerary = null;

    /**
     * @var extendedItinerarySegReference $extendedItinerarySegReference
     * @access public
     */
    public $extendedItinerarySegReference = null;

}

class extendedItinerary {

    /**
     * @var departureCity $departureCity
     * @access public
     */
    public $departureCity = null;

    /**
     * @var arrivalCity $arrivalCity
     * @access public
     */
    public $arrivalCity = null;

    /**
     * @var airlineDetail $airlineDetail
     * @access public
     */
    public $airlineDetail = null;

    /**
     * @var segmentDetail $segmentDetail
     * @access public
     */
    public $segmentDetail = null;

    /**
     * @var ticketingStatus $ticketingStatus
     * @access public
     */
    public $ticketingStatus = null;

}

class departureCity {

    /**
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

}

class arrivalCity {

    /**
     * @var cityCode $cityCode
     * @access public
     */
    public $cityCode = null;

}

class airlineDetail {

    /**
     * @var carrierCode $carrierCode
     * @access public
     */
    public $carrierCode = null;

}

class segmentDetail {

    /**
     * @var identification $identification
     * @access public
     */
    public $identification = null;

    /**
     * @var classOfService $classOfService
     * @access public
     */
    public $classOfService = null;

}

class extendedItinerarySegReference {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class bookingClassSelection {

    /**
     * @var bookingClassList $bookingClassList
     * @access public
     */
    public $bookingClassList = null;

    /**
     * @var bookCodeSegAsso $bookCodeSegAsso
     * @access public
     */
    public $bookCodeSegAsso = null;

}

class bookingClassList {

    /**
     * @var bookingClassDetails $bookingClassDetails
     * @access public
     */
    public $bookingClassDetails = null;

}

class bookCodeSegAsso {

    /**
     * @var referenceDetails $referenceDetails
     * @access public
     */
    public $referenceDetails = null;

}

class fopInformation {

    /**
     * @var fop $fop
     * @access public
     */
    public $fop = null;

}

class fop {

    /**
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class carrierAgreements {

    /**
     * @var companyDetails $companyDetails
     * @access public
     */
    public $companyDetails = null;

}

class Fare_PricePNRWithBookingClassReply {

    /**
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     * @var fareList $fareList
     * @access public
     */
    public $fareList = null;

}

class fareList {

    /**
     * @var pricingInformation $pricingInformation
     * @access public
     */
    public $pricingInformation = null;

    /**
     * @var fareReference $fareReference
     * @access public
     */
    public $fareReference = null;

    /**
     * @var lastTktDate $lastTktDate
     * @access public
     */
    public $lastTktDate = null;

    /**
     * @var validatingCarrier $validatingCarrier
     * @access public
     */
    public $validatingCarrier = null;

    /**
     * @var paxSegReference $paxSegReference
     * @access public
     */
    public $paxSegReference = null;

    /**
     * @var fareDataInformation $fareDataInformation
     * @access public
     */
    public $fareDataInformation = null;

    /**
     * @var taxInformation $taxInformation
     * @access public
     */
    public $taxInformation = null;

    /**
     * @var bankerRates $bankerRates
     * @access public
     */
    public $bankerRates = null;

    /**
     * @var passengerInformation $passengerInformation
     * @access public
     */
    public $passengerInformation = null;

    /**
     * @var originDestination $originDestination
     * @access public
     */
    public $originDestination = null;

    /**
     * @var segmentInformation $segmentInformation
     * @access public
     */
    public $segmentInformation = null;

    /**
     * @var otherPricingInfo $otherPricingInfo
     * @access public
     */
    public $otherPricingInfo = null;

    /**
     * @var statusInformation $statusInformation
     * @access public
     */
    public $statusInformation = null;

    /**
     * @var officeDetails $officeDetails
     * @access public
     */
    public $officeDetails = null;

    /**
     * @var warningInformation $warningInformation
     * @access public
     */
    public $warningInformation = null;

    /**
     * @var automaticReissueInfo $automaticReissueInfo
     * @access public
     */
    public $automaticReissueInfo = null;

    /**
     * @var carrierFeesGroup $carrierFeesGroup
     * @access public
     */
    public $carrierFeesGroup = null;

    /**
     * @var contextualFop $contextualFop
     * @access public
     */
    public $contextualFop = null;

    /**
     * @var contextualPointofSale $contextualPointofSale
     * @access public
     */
    public $contextualPointofSale = null;

    /**
     * @var mileage $mileage
     * @access public
     */
    public $mileage = null;

}

class pricingInformation {

    /**
     * @var tstInformation $tstInformation
     * @access public
     */
    public $tstInformation = null;

    /**
     * @var salesIndicator $salesIndicator
     * @access public
     */
    public $salesIndicator = null;

    /**
     * @var fcmi $fcmi
     * @access public
     */
    public $fcmi = null;

}

class tstInformation {

    /**
     * @var tstIndicator $tstIndicator
     * @access public
     */
    public $tstIndicator = null;

}

class fareReference {

    /**
     * @var referenceType $referenceType
     * @access public
     */
    public $referenceType = null;

    /**
     * @var uniqueReference $uniqueReference
     * @access public
     */
    public $uniqueReference = null;

    /**
     * @var iDDescription $iDDescription
     * @access public
     */
    public $iDDescription = null;

}

class lastTktDate {

    /**
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class fareDataInformation {

    /**
     * @var fareDataMainInformation $fareDataMainInformation
     * @access public
     */
    public $fareDataMainInformation = null;

    /**
     * @var fareDataSupInformation $fareDataSupInformation
     * @access public
     */
    public $fareDataSupInformation = null;

}

class fareDataMainInformation {

    /**
     * @var fareDataQualifier $fareDataQualifier
     * @access public
     */
    public $fareDataQualifier = null;

    /**
     * @var fareAmount $fareAmount
     * @access public
     */
    public $fareAmount = null;

    /**
     * @var fareCurrency $fareCurrency
     * @access public
     */
    public $fareCurrency = null;

    /**
     * @var fareLocation $fareLocation
     * @access public
     */
    public $fareLocation = null;

}

class fareDataSupInformation {

    /**
     * @var fareDataQualifier $fareDataQualifier
     * @access public
     */
    public $fareDataQualifier = null;

    /**
     * @var fareAmount $fareAmount
     * @access public
     */
    public $fareAmount = null;

    /**
     * @var fareCurrency $fareCurrency
     * @access public
     */
    public $fareCurrency = null;

    /**
     * @var fareLocation $fareLocation
     * @access public
     */
    public $fareLocation = null;

}

class taxInformation {

    /**
     * @var taxDetails $taxDetails
     * @access public
     */
    public $taxDetails = null;

    /**
     * @var amountDetails $amountDetails
     * @access public
     */
    public $amountDetails = null;

}

class amountDetails {

    /**
     * @var fareDataMainInformation $fareDataMainInformation
     * @access public
     */
    public $fareDataMainInformation = null;

    /**
     * @var fareDataSupInformation $fareDataSupInformation
     * @access public
     */
    public $fareDataSupInformation = null;

}

class bankerRates {

    /**
     * @var firstRateDetail $firstRateDetail
     * @access public
     */
    public $firstRateDetail = null;

    /**
     * @var secondRateDetail $secondRateDetail
     * @access public
     */
    public $secondRateDetail = null;

}

class passengerInformation {

    /**
     * @var penDisInformation $penDisInformation
     * @access public
     */
    public $penDisInformation = null;

    /**
     * @var passengerReference $passengerReference
     * @access public
     */
    public $passengerReference = null;

}

class passengerReference {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class connexInformation {

    /**
     * @var connecDetails $connecDetails
     * @access public
     */
    public $connecDetails = null;

}

class connecDetails {

    /**
     * @var routingInformation $routingInformation
     * @access public
     */
    public $routingInformation = null;

    /**
     * @var connexType $connexType
     * @access public
     */
    public $connexType = null;

}

class segDetails {

    /**
     * @var departureCity $departureCity
     * @access public
     */
    public $departureCity = null;

    /**
     * @var arrivalCity $arrivalCity
     * @access public
     */
    public $arrivalCity = null;

    /**
     * @var airlineDetail $airlineDetail
     * @access public
     */
    public $airlineDetail = null;

    /**
     * @var segmentDetail $segmentDetail
     * @access public
     */
    public $segmentDetail = null;

    /**
     * @var ticketingStatus $ticketingStatus
     * @access public
     */
    public $ticketingStatus = null;

}

class fareQualifier {

    /**
     * @var movementType $movementType
     * @access public
     */
    public $movementType = null;

    /**
     * @var fareBasisDetails $fareBasisDetails
     * @access public
     */
    public $fareBasisDetails = null;

    /**
     * @var zapOffDetails $zapOffDetails
     * @access public
     */
    public $zapOffDetails = null;

}

class validityInformation {

    /**
     * @var businessSemantic $businessSemantic
     * @access public
     */
    public $businessSemantic = null;

    /**
     * @var dateTime $dateTime
     * @access public
     */
    public $dateTime = null;

}

class bagAllowanceInformation {

    /**
     * @var bagAllowanceDetails $bagAllowanceDetails
     * @access public
     */
    public $bagAllowanceDetails = null;

}

class bagAllowanceDetails {

    /**
     * @var baggageQuantity $baggageQuantity
     * @access public
     */
    public $baggageQuantity = null;

    /**
     * @var baggageWeight $baggageWeight
     * @access public
     */
    public $baggageWeight = null;

    /**
     * @var baggageType $baggageType
     * @access public
     */
    public $baggageType = null;

    /**
     * @var measureUnit $measureUnit
     * @access public
     */
    public $measureUnit = null;

}

class segmentReference {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class sequenceInformation {

    /**
     * @var sequenceSection $sequenceSection
     * @access public
     */
    public $sequenceSection = null;

}

class sequenceSection {

    /**
     * @var sequenceNumber $sequenceNumber
     * @access public
     */
    public $sequenceNumber = null;

}

class otherPricingInfo {

    /**
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

    /**
     * @var anyType $DummyNET
     * @access public
     */
    public $DummyNET = null;

}

class warningCode {

    /**
     * @var applicationErrorDetail $applicationErrorDetail
     * @access public
     */
    public $applicationErrorDetail = null;

}

class warningText {

    /**
     * @var errorFreeText $errorFreeText
     * @access public
     */
    public $errorFreeText = null;

}

class automaticReissueInfo {

    /**
     * @var ticketInfo $ticketInfo
     * @access public
     */
    public $ticketInfo = null;

    /**
     * @var couponInfo $couponInfo
     * @access public
     */
    public $couponInfo = null;

    /**
     * @var paperCouponRange $paperCouponRange
     * @access public
     */
    public $paperCouponRange = null;

    /**
     * @var baseFareInfo $baseFareInfo
     * @access public
     */
    public $baseFareInfo = null;

    /**
     * @var firstDpiGroup $firstDpiGroup
     * @access public
     */
    public $firstDpiGroup = null;

    /**
     * @var secondDpiGroup $secondDpiGroup
     * @access public
     */
    public $secondDpiGroup = null;

}

class ticketInfo {

    /**
     * @var documentDetails $documentDetails
     * @access public
     */
    public $documentDetails = null;

}

class documentDetails {

    /**
     * @var number $number
     * @access public
     */
    public $number = null;

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

}

class couponInfo {

    /**
     * @var couponDetails $couponDetails
     * @access public
     */
    public $couponDetails = null;

    /**
     * @var otherCouponDetails $otherCouponDetails
     * @access public
     */
    public $otherCouponDetails = null;

}

class couponDetails {

    /**
     * @var cpnNumber $cpnNumber
     * @access public
     */
    public $cpnNumber = null;

}

class otherCouponDetails {

    /**
     * @var cpnNumber $cpnNumber
     * @access public
     */
    public $cpnNumber = null;

}

class paperCouponRange {

    /**
     * @var ticketInfo $ticketInfo
     * @access public
     */
    public $ticketInfo = null;

    /**
     * @var couponInfo $couponInfo
     * @access public
     */
    public $couponInfo = null;

}

class baseFareInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class firstDpiGroup {

    /**
     * @var reIssuePenalty $reIssuePenalty
     * @access public
     */
    public $reIssuePenalty = null;

    /**
     * @var reissueInfo $reissueInfo
     * @access public
     */
    public $reissueInfo = null;

    /**
     * @var oldTaxInfo $oldTaxInfo
     * @access public
     */
    public $oldTaxInfo = null;

    /**
     * @var reissueBalanceInfo $reissueBalanceInfo
     * @access public
     */
    public $reissueBalanceInfo = null;

}

class reIssuePenalty {

    /**
     * @var penDisData $penDisData
     * @access public
     */
    public $penDisData = null;

}

class reissueInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class oldTaxInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class reissueBalanceInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class secondDpiGroup {

    /**
     * @var penalty $penalty
     * @access public
     */
    public $penalty = null;

    /**
     * @var residualValueInfo $residualValueInfo
     * @access public
     */
    public $residualValueInfo = null;

    /**
     * @var oldTaxInfo $oldTaxInfo
     * @access public
     */
    public $oldTaxInfo = null;

    /**
     * @var issueBalanceInfo $issueBalanceInfo
     * @access public
     */
    public $issueBalanceInfo = null;

}

class penalty {

    /**
     * @var penDisData $penDisData
     * @access public
     */
    public $penDisData = null;

}

class residualValueInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class issueBalanceInfo {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

    /**
     * @var otherMonetaryDetails $otherMonetaryDetails
     * @access public
     */
    public $otherMonetaryDetails = null;

}

class reissueAttributes {

    /**
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class corporateInfo {

    /**
     * @var corporateFareIdentifiers $corporateFareIdentifiers
     * @access public
     */
    public $corporateFareIdentifiers = null;

}

class feeBreakdown {

    /**
     * @var feeType $feeType
     * @access public
     */
    public $feeType = null;

    /**
     * @var feeDetails $feeDetails
     * @access public
     */
    public $feeDetails = null;

}

class mileage {

    /**
     * @var mileageTimeDetails $mileageTimeDetails
     * @access public
     */
    public $mileageTimeDetails = null;

}

class DocIssuance_IssueTicket {

    /**
     * @var TicketAgentInfoTypeI $agentInfo
     * @access public
     */
    public $agentInfo = null;

    /**
     * @var StructuredDateTimeInformationType $overrideDate
     * @access public
     */
    public $overrideDate = null;

    /**
     * @var ReferenceInfoType $selection
     * @access public
     */
    public $selection = null;

    /**
     * @var ReferenceInformationType $paxSelection
     * @access public
     */
    public $paxSelection = null;

    /**
     * @var StockInformationType $stock
     * @access public
     */
    public $stock = null;

    /**
     * @var optionGroup $optionGroup
     * @access public
     */
    public $optionGroup = null;

    /**
     * @var TravellerInformationType $infantOrAdultAssociation
     * @access public
     */
    public $infantOrAdultAssociation = null;

    /**
     * @var CodedAttributeType $otherCompoundOptions
     * @access public
     */
    public $otherCompoundOptions = null;

}

class optionGroup {

    /**
     * @var StatusTypeI $switches
     * @access public
     */
    public $switches = null;

    /**
     * @var AttributeType $subCompoundOptions
     * @access public
     */
    public $subCompoundOptions = null;

    /**
     * @var StructuredDateTimeInformationType $overrideAlternativeDate
     * @access public
     */
    public $overrideAlternativeDate = null;

}

class InternalIDDetailsTypeI {

    /**
     * @var AlphaNumericString_Length1To9 $inhouseId
     * @access public
     */
    public $inhouseId = null;

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

}

class ReferencingDetailsType_108978C {

    /**
     * @var AlphaNumericString_Length1To3 $type
     * @access public
     */
    public $type = null;

    /**
     * @var AlphaNumericString_Length1To35 $value
     * @access public
     */
    public $value = null;

}

class StockInformationType {

    /**
     * @var StockTicketNumberDetailsType $stockTicketNumberDetails
     * @access public
     */
    public $stockTicketNumberDetails = null;

}

class StockTicketNumberDetailsType {

    /**
     * @var AlphaNumericString_Length1To1 $qualifier
     * @access public
     */
    public $qualifier = null;

    /**
     * @var AlphaNumericString_Length1To35 $controlNumber
     * @access public
     */
    public $controlNumber = null;

}

class TicketAgentInfoTypeI {

    /**
     * @var InternalIDDetailsTypeI $internalIdDetails
     * @access public
     */
    public $internalIdDetails = null;

}

class DocIssuance_IssueTicketReply {

    /**
     * @var ResponseAnalysisDetailsType $processingStatus
     * @access public
     */
    public $processingStatus = null;

    /**
     * @var ErrorGroupType $errorGroup
     * @access public
     */
    public $errorGroup = null;

}

class Ticket_DisplayTST {

    /**
     * @var displayMode $displayMode
     * @access public
     */
    public $displayMode = null;

    /**
     * @var pnrLocatorData $pnrLocatorData
     * @access public
     */
    public $pnrLocatorData = null;

    /**
     * @var scrollingInformation $scrollingInformation
     * @access public
     */
    public $scrollingInformation = null;

    /**
     * @var tstReference $tstReference
     * @access public
     */
    public $tstReference = null;

    /**
     * @var psaInformation $psaInformation
     * @access public
     */
    public $psaInformation = null;

}

class displayMode {

    /**
     * @var attributeDetails $attributeDetails
     * @access public
     */
    public $attributeDetails = null;

}

class scrollingInformation {

    /**
     * @var nextListInformation $nextListInformation
     * @access public
     */
    public $nextListInformation = null;

}

class nextListInformation {

    /**
     * @var remainingInformation $remainingInformation
     * @access public
     */
    public $remainingInformation = null;

    /**
     * @var remainingReference $remainingReference
     * @access public
     */
    public $remainingReference = null;

}

class psaInformation {

    /**
     * @var refDetails $refDetails
     * @access public
     */
    public $refDetails = null;

}

class Ticket_DisplayTSTReply {

    /**
     * @var scrollingInformation $scrollingInformation
     * @access public
     */
    public $scrollingInformation = null;

    /**
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     * @var fareList $fareList
     * @access public
     */
    public $fareList = null;

}

class statusInformation {

    /**
     * @var firstStatusDetails $firstStatusDetails
     * @access public
     */
    public $firstStatusDetails = null;

    /**
     * @var otherStatusDetails $otherStatusDetails
     * @access public
     */
    public $otherStatusDetails = null;

}

class firstStatusDetails {

    /**
     * @var tstFlag $tstFlag
     * @access public
     */
    public $tstFlag = null;

}

class otherStatusDetails {

    /**
     * @var tstFlag $tstFlag
     * @access public
     */
    public $tstFlag = null;

}

class officeDetails {

    /**
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

}

class originIdentification {

    /**
     * @var sourceOffice $sourceOffice
     * @access public
     */
    public $sourceOffice = null;

    function __construct($sourceOffice = null) {
        $this->sourceOffice = $sourceOffice;
    }

}

class carrierFeesGroup {

    /**
     * @var carrierFeeType $carrierFeeType
     * @access public
     */
    public $carrierFeeType = null;

    /**
     * @var carrierFeeInfo $carrierFeeInfo
     * @access public
     */
    public $carrierFeeInfo = null;

}

class carrierFeeType {

    /**
     * @var selectionDetails $selectionDetails
     * @access public
     */
    public $selectionDetails = null;

}

class carrierFeeInfo {

    /**
     * @var carrierFeeSubcode $carrierFeeSubcode
     * @access public
     */
    public $carrierFeeSubcode = null;

    /**
     * @var commercialName $commercialName
     * @access public
     */
    public $commercialName = null;

    /**
     * @var feeAmount $feeAmount
     * @access public
     */
    public $feeAmount = null;

    /**
     * @var feeTax $feeTax
     * @access public
     */
    public $feeTax = null;

}

class carrierFeeSubcode {

    /**
     * @var dataTypeInformation $dataTypeInformation
     * @access public
     */
    public $dataTypeInformation = null;

    /**
     * @var dataInformation $dataInformation
     * @access public
     */
    public $dataInformation = null;

}

class commercialName {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class feeAmount {

    /**
     * @var monetaryDetails $monetaryDetails
     * @access public
     */
    public $monetaryDetails = null;

}

class feeTax {

    /**
     * @var taxCategory $taxCategory
     * @access public
     */
    public $taxCategory = null;

    /**
     * @var feeTaxDetails $feeTaxDetails
     * @access public
     */
    public $feeTaxDetails = null;

}

class feeTaxDetails {

    /**
     * @var rate $rate
     * @access public
     */
    public $rate = null;

    /**
     * @var currencyCode $currencyCode
     * @access public
     */
    public $currencyCode = null;

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

}

class contextualFop {

    /**
     * @var formOfPayment $formOfPayment
     * @access public
     */
    public $formOfPayment = null;

}

class contextualPointofSale {

    /**
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

}

class Security_Authenticate {

    /**
     * @var conversationClt $conversationClt
     * @access public
     */
    public $conversationClt = null;

    /**
     * @var userIdentifier $userIdentifier
     * @access public
     */
    public $userIdentifier = null;

    /**
     * @var dutyCode $dutyCode
     * @access public
     */
    public $dutyCode = null;

    /**
     * @var systemDetails $systemDetails
     * @access public
     */
    public $systemDetails = null;

    /**
     * @var passwordInfo $passwordInfo
     * @access public
     */
    public $passwordInfo = null;

    /**
     * @var fullLocation $fullLocation
     * @access public
     */
    public $fullLocation = null;

    /**
     * @var applicationId $applicationId
     * @access public
     */
    public $applicationId = null;

}

class conversationClt {

    /**
     * @var senderIdentification $senderIdentification
     * @access public
     */
    public $senderIdentification = null;

    /**
     * @var recipientIdentification $recipientIdentification
     * @access public
     */
    public $recipientIdentification = null;

    /**
     * @var senderInterchangeControlReference $senderInterchangeControlReference
     * @access public
     */
    public $senderInterchangeControlReference = null;

    /**
     * @var recipientInterchangeControlReference $recipientInterchangeControlReference
     * @access public
     */
    public $recipientInterchangeControlReference = null;

}

class userIdentifier {

    /**
     * @var originIdentification $originIdentification
     * @access public
     */
    public $originIdentification = null;

    /**
     * @var originatorTypeCode $originatorTypeCode
     * @access public
     */
    public $originatorTypeCode = null;

    /**
     * @var originator $originator
     * @access public
     */
    public $originator = null;

}

class dutyCode {

    /**
     * @var dutyCodeDetails $dutyCodeDetails
     * @access public
     */
    public $dutyCodeDetails = null;

}

class dutyCodeDetails {

    /**
     * @var referenceQualifier $referenceQualifier
     * @access public
     */
    public $referenceQualifier = null;

    /**
     * @var referenceIdentifier $referenceIdentifier
     * @access public
     */
    public $referenceIdentifier = null;

}

class systemDetails {

    /**
     * @var workstationId $workstationId
     * @access public
     */
    public $workstationId = null;

    /**
     * @var organizationDetails $organizationDetails
     * @access public
     */
    public $organizationDetails = null;

    /**
     * @var idQualifier $idQualifier
     * @access public
     */
    public $idQualifier = null;

}

class organizationDetails {

    /**
     * @var label $label
     * @access public
     */
    public $label = null;

}

class passwordInfo {

    /**
     * @var dataLength $dataLength
     * @access public
     */
    public $dataLength = null;

    /**
     * @var dataType $dataType
     * @access public
     */
    public $dataType = null;

    /**
     * @var binaryData $binaryData
     * @access public
     */
    public $binaryData = null;

}

class fullLocation {

    /**
     * @var workstationPos $workstationPos
     * @access public
     */
    public $workstationPos = null;

    /**
     * @var locationInfo $locationInfo
     * @access public
     */
    public $locationInfo = null;

}

class workstationPos {

    /**
     * @var locationType $locationType
     * @access public
     */
    public $locationType = null;

    /**
     * @var locationDescription $locationDescription
     * @access public
     */
    public $locationDescription = null;

    /**
     * @var firstLocationDetails $firstLocationDetails
     * @access public
     */
    public $firstLocationDetails = null;

}

class locationDescription {

    /**
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

}

class firstLocationDetails {

    /**
     * @var code $code
     * @access public
     */
    public $code = null;

    /**
     * @var qualifier $qualifier
     * @access public
     */
    public $qualifier = null;

}

class locationInfo {

    /**
     * @var facilityDetails $facilityDetails
     * @access public
     */
    public $facilityDetails = null;

}

class facilityDetails {

    /**
     * @var type $type
     * @access public
     */
    public $type = null;

    /**
     * @var identifier $identifier
     * @access public
     */
    public $identifier = null;

}

class applicationId {

    /**
     * @var applicationDetails $applicationDetails
     * @access public
     */
    public $applicationDetails = null;

}

class applicationDetails {

    /**
     * @var internalId $internalId
     * @access public
     */
    public $internalId = null;

    /**
     * @var seqNumber $seqNumber
     * @access public
     */
    public $seqNumber = null;

}

class Security_AuthenticateReply {

    /**
     * @var errorSection $errorSection
     * @access public
     */
    public $errorSection = null;

    /**
     * @var processStatus $processStatus
     * @access public
     */
    public $processStatus = null;

    /**
     * @var organizationInfo $organizationInfo
     * @access public
     */
    public $organizationInfo = null;

    /**
     * @var conversationGrp $conversationGrp
     * @access public
     */
    public $conversationGrp = null;

}

class errorSection {

    /**
     * @var applicationError $applicationError
     * @access public
     */
    public $applicationError = null;

    /**
     * @var interactiveFreeText $interactiveFreeText
     * @access public
     */
    public $interactiveFreeText = null;

}

class interactiveFreeText {

    /**
     * @var freeTextQualification $freeTextQualification
     * @access public
     */
    public $freeTextQualification = null;

    /**
     * @var freeText $freeText
     * @access public
     */
    public $freeText = null;

}

class freeTextQualif {

    /**
     * @var subject $subject
     * @access public
     */
    public $subject = null;

    /**
     * @var infoType $infoType
     * @access public
     */
    public $infoType = null;

    /**
     * @var language $language
     * @access public
     */
    public $language = null;

}

class processStatus {

    /**
     * @var statusCode $statusCode
     * @access public
     */
    public $statusCode = null;

}

class organizationInfo {

    /**
     * @var organizationDetails $organizationDetails
     * @access public
     */
    public $organizationDetails = null;

}

class conversationGrp {

    /**
     * @var processIdentifier $processIdentifier
     * @access public
     */
    public $processIdentifier = null;

}

class Security_SignOut {

    /**
     * @var conversationClt $conversationClt
     * @access public
     */
    public $conversationClt = null;

}

class Security_SignOutReply {

    /**
     * @var errorSection $errorSection
     * @access public
     */
    public $errorSection = null;

    /**
     * @var processStatus $processStatus
     * @access public
     */
    public $processStatus = null;

}

class Queue_ListReply {

    /**
     * @var errorReturn $errorReturn
     * @access public
     */
    public $errorReturn = null;

    /**
     * @var queueView $queueView
     * @access public
     */
    public $queueView = null;

}

class queueView {

    /**
     * @var AdditionalBusinessSourceInformationType $agent
     * @access public
     */
    public $agent = null;

    /**
     * @var QueueInformationTypeI $queueNumber
     * @access public
     */
    public $queueNumber = null;

    /**
     * @var SubQueueInformationTypeI $categoryDetails
     * @access public
     */
    public $categoryDetails = null;

    /**
     * @var StructuredDateTimeInformationType $date
     * @access public
     */
    public $date = null;

    /**
     * @var NumberOfUnitsType $pnrCount
     * @access public
     */
    public $pnrCount = null;

    /**
     * @var item $item
     * @access public
     */
    public $item = null;

}

class Queue_List {

    /**
     * @var ActionDetailsTypeI $scroll
     * @access public
     */
    public $scroll = null;

    /**
     * @var AdditionalBusinessSourceInformationTypeI $targetOffice
     * @access public
     */
    public $targetOffice = null;

    /**
     * @var QueueInformationTypeI $queueNumber
     * @access public
     */
    public $queueNumber = null;

    /**
     * @var SubQueueInformationTypeI $categoryDetails
     * @access public
     */
    public $categoryDetails = null;

    /**
     * @var StructuredDateTimeInformationType $date
     * @access public
     */
    public $date = null;

    /**
     * @var RangeDetailsTypeI $scanRange
     * @access public
     */
    public $scanRange = null;

    /**
     * @var searchCriteria $searchCriteria
     * @access public
     */
    public $searchCriteria = null;

    /**
     * @var TravellerInformationTypeI $passengerName
     * @access public
     */
    public $passengerName = null;

    /**
     * @var UserIdentificationType $agentSine
     * @access public
     */
    public $agentSine = null;

    /**
     * @var AccountingInformationElementType $accountNumber
     * @access public
     */
    public $accountNumber = null;

    /**
     * @var flightInformation $flightInformation
     * @access public
     */
    public $flightInformation = null;

    /**
     * @var PointOfSaleInformationType $pos
     * @access public
     */
    public $pos = null;

    /**
     * @var FrequentTravellerIdentificationCodeType $tierLevelAndCustomerValue
     * @access public
     */
    public $tierLevelAndCustomerValue = null;

    /**
     * @var sortCriteria $sortCriteria
     * @access public
     */
    public $sortCriteria = null;

}

class searchCriteria {

    /**
     * @var SelectionDetailsTypeI $searchOption
     * @access public
     */
    public $searchOption = null;

    /**
     * @var StructuredPeriodInformationType $dates
     * @access public
     */
    public $dates = null;

}

class sortCriteria {

    /**
     * @var DummySegmentTypeI $dumbo
     * @access public
     */
    public $dumbo = null;

    /**
     * @var SelectionDetailsTypeI $sortOption
     * @access public
     */
    public $sortOption = null;

}
