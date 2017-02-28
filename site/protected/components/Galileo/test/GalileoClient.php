<?php

namespace application\components\Galileo\test;


/**
 * Allows access to XML Select services over SOAP.
 * 
 */
class GalileoClient extends \SoapClient
{

  /**
   * 
   * @var array $classmap The defined classes
   * @access private
   */
  private static $classmap = array(
    'SubmitXml' => 'application\components\Galileo\test\SubmitXml',
    'Filter' => 'application\components\Galileo\test\Filter',
    'SubmitXmlResponse' => 'application\components\Galileo\test\SubmitXmlResponse',
    'SubmitXmlResult' => 'application\components\Galileo\test\SubmitXmlResult',
    'MultiSubmitXml' => 'application\components\Galileo\test\MultiSubmitXml',
    'Requests' => 'application\components\Galileo\test\Requests',
    'MultiSubmitXmlResponse' => 'application\components\Galileo\test\MultiSubmitXmlResponse',
    'Responses' => 'application\components\Galileo\test\Responses',
    'BeginSession' => 'application\components\Galileo\test\BeginSession',
    'BeginSessionResponse' => 'application\components\Galileo\test\BeginSessionResponse',
    'EndSession' => 'application\components\Galileo\test\EndSession',
    'EndSessionResponse' => 'application\components\Galileo\test\EndSessionResponse',
    'SubmitXmlOnSession' => 'application\components\Galileo\test\SubmitXmlOnSession',
    'Request' => 'application\components\Galileo\test\Request',
    'SubmitXmlOnSessionResponse' => 'application\components\Galileo\test\SubmitXmlOnSessionResponse',
    'SubmitXmlOnSessionResult' => 'application\components\Galileo\test\SubmitXmlOnSessionResult',
    'SubmitTerminalTransaction' => 'application\components\Galileo\test\SubmitTerminalTransaction',
    'SubmitTerminalTransactionResponse' => 'application\components\Galileo\test\SubmitTerminalTransactionResponse',
    'GetIdentityInfo' => 'application\components\Galileo\test\GetIdentityInfo',
    'GetIdentityInfoResponse' => 'application\components\Galileo\test\GetIdentityInfoResponse',
    'GetIdentityInfoResult' => 'application\components\Galileo\test\GetIdentityInfoResult',
    'SubmitCruiseTransaction' => 'application\components\Galileo\test\SubmitCruiseTransaction',
    'Transactions' => 'application\components\Galileo\test\Transactions',
    'SubmitCruiseTransactionResponse' => 'application\components\Galileo\test\SubmitCruiseTransactionResponse',
    'Response' => 'application\components\Galileo\test\Response');

  /**
   * 
   * @param array $options A array of config values
   * @param string $wsdl The wsdl file to use
   * @access public
   */
  public function __construct(array $options = array(), $wsdl = 'Galileo.wsdl')
  {
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
  public function SubmitXml(SubmitXml $parameters)
  {
    return $this->__soapCall('SubmitXml', array($parameters));
  }

  /**
   * Allows users to send multiple sessionless Structured Data transactions within a single web service call.  The following restrictions apply:<ul><li>It will not respond until all of the transactions respond.  This means the caller must wait for the slowest transaction to return before getting results to any of the transactions.</li><li>It can only be used for unrelated transactions.  All transactions may (or may not) be sent simultaneously, and there is no particular order expressed nor implied.</li><li>Terminal transactions are not supported.</li><li>Sessioned transactions are not supported.</li></ul>
   * 
   * @param MultiSubmitXml $parameters
   * @access public
   * @return MultiSubmitXmlResponse
   */
  public function MultiSubmitXml(MultiSubmitXml $parameters)
  {
    return $this->__soapCall('MultiSubmitXml', array($parameters));
  }

  /**
   * Begins an XML Select session.
   * If this method returns a valid (non-empty) session token, the session must be released with EndSession.
   * 
   * @param BeginSession $parameters
   * @access public
   * @return BeginSessionResponse
   */
  public function BeginSession(BeginSession $parameters)
  {
    return $this->__soapCall('BeginSession', array($parameters));
  }

  /**
   * Ends an XML Select session.
   * 
   * @param EndSession $parameters
   * @access public
   * @return EndSessionResponse
   */
  public function EndSession(EndSession $parameters)
  {
    return $this->__soapCall('EndSession', array($parameters));
  }

  /**
   * Submits an XML Request on the specified session.
   * 
   * @param SubmitXmlOnSession $parameters
   * @access public
   * @return SubmitXmlOnSessionResponse
   */
  public function SubmitXmlOnSession(SubmitXmlOnSession $parameters)
  {
    return $this->__soapCall('SubmitXmlOnSession', array($parameters));
  }

  /**
   * Submits a terminal transaction on a session and returns the result.
   * 
   * @param SubmitTerminalTransaction $parameters
   * @access public
   * @return SubmitTerminalTransactionResponse
   */
  public function SubmitTerminalTransaction(SubmitTerminalTransaction $parameters)
  {
    return $this->__soapCall('SubmitTerminalTransaction', array($parameters));
  }

  /**
   * Retrieves the Identity information for the specified profile
   * 
   * @param GetIdentityInfo $parameters
   * @access public
   * @return GetIdentityInfoResponse
   */
  public function GetIdentityInfo(GetIdentityInfo $parameters)
  {
    return $this->__soapCall('GetIdentityInfo', array($parameters));
  }

  /**
   * Allows callers to submit Cruise transactions to the service
   * 
   * @param SubmitCruiseTransaction $parameters
   * @access public
   * @return SubmitCruiseTransactionResponse
   */
  public function SubmitCruiseTransaction(SubmitCruiseTransaction $parameters)
  {
    return $this->__soapCall('SubmitCruiseTransaction', array($parameters));
  }

}
class SubmitXml
{

  /**
   * 
   * @var string $Profile
   * @access public
   */
  public $Profile = null;

  /**
   * 
   * @var anyType $Request
   * @access public
   */
  public $Request = null;

  /**
   * 
   * @var Filter $Filter
   * @access public
   */
  public $Filter = null;

}
class Filter
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class SubmitXmlResponse
{

  /**
   * 
   * @var SubmitXmlResult $SubmitXmlResult
   * @access public
   */
  public $SubmitXmlResult = null;

}
class SubmitXmlResult
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class MultiSubmitXml
{

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
class Requests
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class MultiSubmitXmlResponse
{

  /**
   * 
   * @var Responses $Responses
   * @access public
   */
  public $Responses = null;

}
class Responses
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class BeginSession
{

  /**
   * 
   * @var string $Profile
   * @access public
   */
  public $Profile = null;

}
class BeginSessionResponse
{

  /**
   * 
   * @var string $BeginSessionResult
   * @access public
   */
  public $BeginSessionResult = null;

}
class EndSession
{

  /**
   * 
   * @var string $Token
   * @access public
   */
  public $Token = null;

}
class EndSessionResponse
{

}
class SubmitXmlOnSession
{

  /**
   * 
   * @var string $Token
   * @access public
   */
  public $Token = null;

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

}
class Request
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class SubmitXmlOnSessionResponse
{

  /**
   * 
   * @var SubmitXmlOnSessionResult $SubmitXmlOnSessionResult
   * @access public
   */
  public $SubmitXmlOnSessionResult = null;

}
class SubmitXmlOnSessionResult
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class SubmitTerminalTransaction
{

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
class SubmitTerminalTransactionResponse
{

  /**
   * 
   * @var string $SubmitTerminalTransactionResult
   * @access public
   */
  public $SubmitTerminalTransactionResult = null;

}
class GetIdentityInfo
{

  /**
   * 
   * @var string $Profile
   * @access public
   */
  public $Profile = null;

}
class GetIdentityInfoResponse
{

  /**
   * 
   * @var GetIdentityInfoResult $GetIdentityInfoResult
   * @access public
   */
  public $GetIdentityInfoResult = null;

}
class GetIdentityInfoResult
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class SubmitCruiseTransaction
{

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
class Transactions
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
class SubmitCruiseTransactionResponse
{

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
class Response
{

  /**
   * 
   * @var string $any
   * @access public
   */
  public $any = null;

}
