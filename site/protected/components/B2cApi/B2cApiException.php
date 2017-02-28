<?php

namespace application\components\B2cApi;

/**
 * Description of Exception
 *
 * @author Boxx
 */
class B2cApiException {

    // Errors from ApiIntefaces
    const FLIGHT_UNAVAILABLE = 1;
    const FARE_INCREASED = 2;
    const FARE_DECREASED = 3;
    const INVALID_AIRSOURCE = 4;
    const INVALID_TRAVELER = 5;
    const OTHER_ERROR = 6;
    // Local errors
    const DATA_VALIDATION_ERROR = 100;
    const INVALID_RC = 101;
    const REQUEST_OUT_OF_DATE = 102;
    const MISSING_BOOKING_KEY = 103;
    const WRONG_PASSWORD = 104;
    const WRONG_EMAIL_OR_API_ACCESS = 105;
    const USER_NOT_FOUND = 106;
    CONST INVALID_PASSENGERS_ELEMENTS = 107;
    CONST TRAVELER_FORMAT_ERROR = 108;
    CONST MISSING_RC = 109;
    CONST RC_NOT_FOUND = 110;
    CONST SEARCH_FIELDS_MALFORMED = 111;
    CONST ONWARD_DATE_IN_PAST = 112;
    CONST WRONG_RETURN_DATE = 113;
    CONST INFANT_WITHOUT_ADULT = 114;
    CONST ONLY_POST = 115;
    CONST MISSING_TS = 116;
    CONST MISSING_CART_ID = 117;
    CONST CART_NOT_FOUND = 118;
    CONST CART_NOT_OWNED = 119;
    CONST INSUFFICIENT_BALANCE = 120;
    CONST OTHER_BOOKING_ERROR = 121;
    CONST USER_IS_STAFF = 122;
    CONST UNABLE_TO_CREATE_USER = 123;
    CONST EMAIL_ALREADY_EXISTS = 124;
    CONST WEAK_PASSWORD = 125;
    CONST INCORRECT_MOBILE_NUMBER = 126;
    CONST FRAUD_PAYMENT = 127;
    CONST FAILED_PAYMENT = 128;

    static $errorMessages = [
        // ApiInterfaces messages
        self::FLIGHT_UNAVAILABLE => 'There are no available seats for the flight',
        self::FARE_INCREASED => 'The fare has increased',
        self::FARE_DECREASED => 'The fare has decreased',
        self::INVALID_AIRSOURCE => 'This provider do not have the capability to check the seat availability and the fares',
        self::INVALID_TRAVELER => 'Traveler not found',
        self::OTHER_ERROR => 'Availability and fare check error',
        // Local messages
        self::DATA_VALIDATION_ERROR => 'Wrong input format. We are expecting JSON with valid credentials.',
        self::INVALID_RC => 'Invalid RC is used. Please do the airSearch again!',
        self::REQUEST_OUT_OF_DATE => 'This booking key used is no longer valid. Please do the airSearch again!',
        self::MISSING_BOOKING_KEY => 'Wrong input. There is no valid booking key(s)',
        self::WRONG_PASSWORD => 'Wrong password',
        self::WRONG_EMAIL_OR_API_ACCESS => 'Wrong email or the API access is not allowed',
        self::USER_NOT_FOUND => 'User not found',
        self::INVALID_PASSENGERS_ELEMENTS => 'Invalid passengers element',
        self::TRAVELER_FORMAT_ERROR => 'Traveler format error',
        self::MISSING_RC => 'Missing RC element(s)',
        self::RC_NOT_FOUND => 'RC element not found',
        self::SEARCH_FIELDS_MALFORMED => 'Wrong input. Major data fields are malformed',
        self::ONWARD_DATE_IN_PAST => 'Onward date is in the past',
        self::WRONG_RETURN_DATE => 'Return date is before the onward date',
        self::INFANT_WITHOUT_ADULT => 'Infant can not travel without adult',
        self::ONLY_POST => 'Only POST HTTP method is accepted',
        self::MISSING_TS => 'TS element not found',
        self::MISSING_CART_ID => 'cartID element is missing',
        self::CART_NOT_FOUND => 'Air cart not found',
        self::CART_NOT_OWNED => 'This air cart is not yours. Access denied!',
        self::INSUFFICIENT_BALANCE => 'Your balance plus your credit limit in not enough to make the booking',
        self::OTHER_BOOKING_ERROR => 'Other booking error',
        self::USER_IS_STAFF => 'User is not allowed to Book',
        self::UNABLE_TO_CREATE_USER=>'Unable to create user. Please try again later',
        self::EMAIL_ALREADY_EXISTS=>'User with this email already exists',
        self::WEAK_PASSWORD=>'Provide a strong password',
        self::INCORRECT_MOBILE_NUMBER=>'Provide a valid Mobile Number',
        self::FRAUD_PAYMENT=>'You have been blocked by the Admin to make this transaction! Please contact our customer support.',
        self::FAILED_PAYMENT=>'Payment failed !!',
    ];

    /**
     * Throw B2cApi exception
     * @param int $errorCode Internal error code
     * @param string $message Error message
     * @param int $httpCode The http code to be used
     * @param string $details Additional details for the error, like the price difference
     */
    public function __construct($errorCode, $message = null, $httpCode = 200, $details = '') {
        \Utils::jsonResponse([
            'errorCode' => $errorCode,
            'errorMessage' => $message ? : self::$errorMessages[$errorCode],
            'details' => $details,
                ], $httpCode);
    }

}
//print_r(B2cApiException::$errorMessages);
