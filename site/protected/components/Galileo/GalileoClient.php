<?php

namespace application\components\Galileo;

/**
 * Allows access to XML Select services over SOAP.
 *
 */
class GalileoClient extends \SoapClient {

    public $token = null;

    /**
     * @var array $classmap The defined classes
     * @access private
     */
    private static $classmap = array(
        'SubmitXml' => 'application\components\Galileo\SubmitXml',
        'Request' => 'application\components\Galileo\Request',
        'Filter' => 'application\components\Galileo\Filter',
        'SubmitXmlResponse' => 'application\components\Galileo\SubmitXmlResponse',
        'SubmitXmlResult' => 'application\components\Galileo\SubmitXmlResult',
        'MultiSubmitXml' => 'application\components\Galileo\MultiSubmitXml',
        'Requests' => 'application\components\Galileo\Requests',
        'MultiSubmitXmlResponse' => 'application\components\Galileo\MultiSubmitXmlResponse',
        'Responses' => 'application\components\Galileo\Responses',
        'BeginSession' => 'application\components\Galileo\BeginSession',
        'BeginSessionResponse' => 'application\components\Galileo\BeginSessionResponse',
        'EndSession' => 'application\components\Galileo\EndSession',
        'EndSessionResponse' => 'application\components\Galileo\EndSessionResponse',
        'SubmitXmlOnSession' => 'application\components\Galileo\SubmitXmlOnSession',
        'SubmitXmlOnSessionResponse' => 'application\components\Galileo\SubmitXmlOnSessionResponse',
        'SubmitXmlOnSessionResult' => 'application\components\Galileo\SubmitXmlOnSessionResult',
        'SubmitTerminalTransaction' => 'application\components\Galileo\SubmitTerminalTransaction',
        'SubmitTerminalTransactionResponse' => 'application\components\Galileo\SubmitTerminalTransactionResponse',
        'GetIdentityInfo' => 'application\components\Galileo\GetIdentityInfo',
        'GetIdentityInfoResponse' => 'application\components\Galileo\GetIdentityInfoResponse',
        'GetIdentityInfoResult' => 'application\components\Galileo\GetIdentityInfoResult',
        'SubmitCruiseTransaction' => 'application\components\Galileo\SubmitCruiseTransaction',
        'Transactions' => 'application\components\Galileo\Transactions',
        'SubmitCruiseTransactionResponse' => 'application\components\Galileo\SubmitCruiseTransactionResponse',
        'Response' => 'application\components\Galileo\Response'
    );

    /**
     *
     * @param array $options A array of config values
     * @param string $wsdl The wsdl file to use
     * @access public
     */
    public function __construct(array $options = array(), $wsdl = 'Galileo.wsdl') {
        foreach (self::$classmap as $key => $value) {
            if (!isset($options['classmap'][$key])) {
                $options['classmap'][$key] = $value;
            }
        }

        parent::__construct($wsdl, $options);
    }

    /**
     * Submits an XML request in a sessionless environment.
     *
     * @param SubmitXml $parameters
     * @access public
     * @return SubmitXmlResponse
     */
    public function SubmitXml(SubmitXml $parameters) {
        try {
            $out = $this->__soapCall('SubmitXml', array($parameters));
//            \Utils::soapLogDebug($this);
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
            \Utils::dbgYiiLog($e->getMessage());
            return $e->getMessage();
        }
        if (empty($out) || !isset($out->SubmitXmlResult->any)) {
            \Utils::dbgYiiLog($out);
            return 'Not found';
        }

        return simplexml_load_string($out->SubmitXmlResult->any, null, LIBXML_NOCDATA);
    }

    /**
     * Allows users to send multiple sessionless Structured Data transactions within a single web service call.  The following restrictions apply:<ul><li>It will not respond until all of the transactions respond.  This means the caller must wait for the slowest transaction to return before getting results to any of the transactions.</li><li>It can only be used for unrelated transactions.  All transactions may (or may not) be sent simultaneously, and there is no particular order expressed nor implied.</li><li>Terminal transactions are not supported.</li><li>Sessioned transactions are not supported.</li></ul>
     *
     * @param MultiSubmitXml $parameters
     * @access public
     * @return MultiSubmitXmlResponse
     */
    public function MultiSubmitXml(MultiSubmitXml $parameters) {
        return $this->__soapCall('MultiSubmitXml', array($parameters));
    }

    /**
     * Begins an XML Select session.
     * If this method returns a valid (non-empty) session token, the session must be released with EndSession.
     *
     * @param string $hap The Profile string
     * @access public
     * @return BeginSessionResponse
     */
    public function BeginSession($hap) {
        if ($this->token === null) {    // Session is not started
            $parameters = new BeginSession($hap);
            $res = $this->__soapCall('BeginSession', array($parameters));
            if (!empty($res->BeginSessionResult)) {
                $this->token = (string) $res->BeginSessionResult;
                return true;
            } else {
                \Utils::dbgYiiLog($res);
            }
        }
        return false;
    }

    /**
     * Ends an XML Select session.
     *
     * @access public
     * @return EndSessionResponse
     */
    public function EndSession() {
        if ($this->token) {
            $parameters = new EndSession($this->token);
            $this->__soapCall('EndSession', array($parameters));
            $this->token = null;
        }
    }

    /**
     * Submits an XML Request on the specified session.
     *
     * @param string $strRequest
     * @access public
     * @return SubmitXmlOnSessionResponse
     */
    public function SubmitXmlOnSession($strRequest) {
        $parameters = new SubmitXmlOnSession($this->token, $strRequest);
        try {
            $out = $this->__soapCall('SubmitXmlOnSession', array($parameters));
        } catch (\SoapFault $e) {
//            \Utils::soapLogDebugFile($this);
            \Utils::soapLogDebug($this);
//            \Utils::dbgYiiLog($e->getMessage());
            return $e->getMessage();
        }
        if (empty($out) || !isset($out->SubmitXmlOnSessionResult->any)) {
//            file_put_contents('log.txt', print_r($out, true), FILE_APPEND);
            \Utils::dbgYiiLog($out);
            return false;
        }

        return simplexml_load_string($out->SubmitXmlOnSessionResult->any, null, LIBXML_NOCDATA);
    }

    /**
     * Submits a terminal transaction on a session and returns the result.
     *
     * @param SubmitTerminalTransaction $parameters
     * @access public
     * @return SubmitTerminalTransactionResponse
     */
    public function SubmitTerminalTransaction(SubmitTerminalTransaction $parameters) {
        return $this->__soapCall('SubmitTerminalTransaction', array($parameters));
    }

    /**
     * Retrieves the Identity information for the specified profile
     *
     * @param GetIdentityInfo $parameters
     * @access public
     * @return GetIdentityInfoResponse
     */
    public function GetIdentityInfo(GetIdentityInfo $parameters) {
        return $this->__soapCall('GetIdentityInfo', array($parameters));
    }

    /**
     * Allows callers to submit Cruise transactions to the service
     *
     * @param SubmitCruiseTransaction $parameters
     * @access public
     * @return SubmitCruiseTransactionResponse
     */
    public function SubmitCruiseTransaction(SubmitCruiseTransaction $parameters) {
        return $this->__soapCall('SubmitCruiseTransaction', array($parameters));
    }

}

class SubmitXml {

    /**
     *
     * @var string $Profile
     * @access public
     */
    public $Profile = null;

    /**
     *
     * @var Request $Request
     * @access public
     */
    public $Request = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

    /**
     * Construct request structure
     * @param string $hap Profile
     * @param string $strRequest Request body
     * @param string $strFilter Filter body
     */
    public function __construct($hap, $strRequest, $strFilter = '<_ xmlns="" />') {
        $this->Filter = new Filter($strFilter);
        $this->Request = new Request($strRequest);
        $this->Profile = $hap;
    }

}

class Request {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

    /**
     * Coinstruct a request with XSD:ANY
     * @param string $strXml The body of the request in XML format
     */
    public function __construct($strXml) {
        $this->any = new \SoapVar($strXml, XSD_ANYXML);
    }

}

class Filter {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

    /**
     * Coinstruct a filter with XSD:ANY
     * @param string $strXml The body of the filter in XML format
     */
    public function __construct($strXml = '<_ xmlns="" />') {
        $this->any = new \SoapVar($strXml, XSD_ANYXML);
    }

}

class SubmitXmlResponse {

    /**
     *
     * @var SubmitXmlResult $SubmitXmlResult
     * @access public
     */
    public $SubmitXmlResult = null;

}

class SubmitXmlResult {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

}

class MultiSubmitXml {

    /**
     *
     * @var string $Profile
     * @access public
     */
    public $Profile = null;

    /**
     *
     * @var Requests $Requests
     * @access public
     */
    public $Requests = null;

}

class Requests {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

}

class MultiSubmitXmlResponse {

    /**
     *
     * @var Responses $Responses
     * @access public
     */
    public $Responses = null;

}

class Responses {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

}

class BeginSession {

    /**
     *
     * @var string $Profile
     * @access public
     */
    public $Profile;

    public function __construct($hap) {
        $this->Profile = $hap;
    }

}

class BeginSessionResponse {

    /**
     *
     * @var string $BeginSessionResult
     * @access public
     */
    public $BeginSessionResult = null;

}

class EndSession {

    /**
     *
     * @var string $Token
     * @access public
     */
    public $Token;

    public function __construct($token) {
        $this->Token = $token;
    }

}

class EndSessionResponse {
    
}

class SubmitXmlOnSession {

    /**
     *
     * @var string $Token
     * @access public
     */
    public $Token;

    /**
     *
     * @var Request $Request
     * @access public
     */
    public $Request = null;

    /**
     *
     * @var Filter $Filter
     * @access public
     */
    public $Filter = null;

    public function __construct($token, $strRequest, $strFilter = '<_ xmlns="" />') {
        $this->Token = $token;
        $this->Request = new Request($strRequest);
        $this->Filter = new Filter($strFilter);
    }

}

class SubmitXmlOnSessionResponse {

    /**
     *
     * @var SubmitXmlOnSessionResult $SubmitXmlOnSessionResult
     * @access public
     */
    public $SubmitXmlOnSessionResult = null;

}

class SubmitXmlOnSessionResult {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

}

class SubmitTerminalTransaction {

    /**
     *
     * @var string $Token
     * @access public
     */
    public $Token = null;

    /**
     *
     * @var string $Request
     * @access public
     */
    public $Request = null;

    /**
     *
     * @var string $IntermediateResponse
     * @access public
     */
    public $IntermediateResponse = null;

}

class SubmitTerminalTransactionResponse {

    /**
     *
     * @var string $SubmitTerminalTransactionResult
     * @access public
     */
    public $SubmitTerminalTransactionResult = null;

}

class GetIdentityInfo {

    /**
     *
     * @var string $Profile
     * @access public
     */
    public $Profile = null;

}

class GetIdentityInfoResponse {

    /**
     *
     * @var GetIdentityInfoResult $GetIdentityInfoResult
     * @access public
     */
    public $GetIdentityInfoResult = null;

}

class GetIdentityInfoResult {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

}

class SubmitCruiseTransaction {

    /**
     *
     * @var string $Profile
     * @access public
     */
    public $Profile = null;

    /**
     *
     * @var string $CorrelationToken
     * @access public
     */
    public $CorrelationToken = null;

    /**
     *
     * @var Transactions $Transactions
     * @access public
     */
    public $Transactions = null;

}

class Transactions {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

}

class SubmitCruiseTransactionResponse {

    /**
     *
     * @var Response $Response
     * @access public
     */
    public $Response = null;

    /**
     *
     * @var string $CorrelationToken
     * @access public
     */
    public $CorrelationToken = null;

}

class Response {

    /**
     *
     * @var string $any
     * @access public
     */
    public $any = null;

}
