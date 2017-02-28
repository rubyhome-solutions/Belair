<?php

namespace application\components\Scoot;

/**
 *
 */
class SessionManager extends \SoapClient {

    private $signature = null;
    public $accountNumber = null;

    /**
     *
     * @var array $classmap The defined classes
     * @access private
     */
    private static $classmap = array(
        'LogonRequestData' => 'application\components\Scoot\LogonRequestData',
        'TokenRequest' => 'application\components\Scoot\TokenRequest',
        'TransferSessionResponseData' => 'application\components\Scoot\TransferSessionResponseData',
        'ChangePasswordRequest' => 'application\components\Scoot\ChangePasswordRequest',
        'LogonRequest' => 'application\components\Scoot\LogonRequest',
        'LogoutRequest' => 'application\components\Scoot\LogoutRequest',
        'TransferSessionRequest' => 'application\components\Scoot\TransferSessionRequest',
        'TransferSessionResponse' => 'application\components\Scoot\TransferSessionResponse',
        'LogonResponse' => 'application\components\Scoot\LogonResponse');

    /**
     *
     * @param array $options A array of config values
     * @param string $wsdl The wsdl file to use
     * @access public
     */
    public function __construct(array $options = [], $wsdl = 'production') {
        $wsdl = __DIR__ . DIRECTORY_SEPARATOR . $wsdl . DIRECTORY_SEPARATOR . 'SessionManager.wsdl';
        foreach (self::$classmap as $key => $value) {
            if (!isset($options['classmap'][$key])) {
                $options['classmap'][$key] = $value;
            }
        }
     //   ini_set( "soap.wsdl_cache_enabled", "0" );
        // Local options - valid for TG SOAP
        $options['soap_version'] = SOAP_1_1;
        $options['compression'] = SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP;
        $options['trace'] = true;
        $options['exceptions'] = 1;
        $options['connection_timeout'] = 30;
     //   $options['encoding']="ISO-8859-1";

        // Use proxy if not on the server
        if (YII_DEBUG) {
            $options['proxy_host'] = '128.199.218.209';     // air.belair.in
            $options['proxy_port'] = 3128;
            $options['stream_context'] = stream_context_create(
                    ['ssl' => [
                            'verify_peer' => false,
                            'verify_peer_name' => false,
                           // 'ciphers'=>'RC4-SHA'
                         'allow_self_signed' => true
                        ]
                    ]
            );
        }

        parent::__construct($wsdl, $options);
    }

    /**
     *
     * @param ChangePasswordRequest $parameters
     * @access public
     * @return void
     */
    public function ChangePassword(ChangePasswordRequest $parameters) {
        return $this->__soapCall('ChangePassword', array($parameters));
    }

    /**
     * Logon
     * @param int $id Scoot production is 32
     * @access public
     * @return LogonResponse
     */
    public function Logon($id) {
        $lrd = new LogonRequestData($id);
        $this->accountNumber = $lrd->accountNumber;

        $parameters = new LogonRequest($lrd);
//        \Utils::dbgYiiLog($parameters);
        try {
            $headers[] = new \SoapHeader('http://schemas.navitaire.com/WebServices', 'ContractVersion', 340);
            $this->__setSoapHeaders($headers);
            $res = $this->__soapCall('Logon', array($parameters));
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
//            echo $e->getMessage();
            return false;
        }
        $this->signature = $res->Signature;
        return $res->Signature;
    }

    /**
     *
     * @access public
     * @return void
     */
    public function Logout() {
//        \Utils::dbgYiiLog(['signature'=>$this->signature]);
        if (!empty($this->signature)) {
            $signature=$this->signature;
            $this->signature=null;
            $headers[] = new \SoapHeader('http://schemas.navitaire.com/WebServices', 'ContractVersion', 340);
            $headers[] = new \SoapHeader('http://schemas.navitaire.com/WebServices', 'Signature', $signature);
            $this->__setSoapHeaders($headers);
            $lr = new LogoutRequest($signature);
           try{
                $res= $this->__soapCall('Logout', array($lr));
           }catch(\SoapFault $e){
               return true;
           }
           return $res;
//            $this->__soapCall('Logout', array($lr));
//            \Utils::soapLogDebug($this);
//            \Utils::dbgYiiLog($this->__getLastRequest());
        }
        return true;
    }

    /**
     *
     * @param TransferSessionRequest $parameters
     * @access public
     * @return TransferSessionResponse
     */
    public function TransferSession(TransferSessionRequest $parameters) {
        return $this->__soapCall('TransferSession', array($parameters));
    }

}

class ChannelType2 {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const Direct = 'Direct';
    const Web = 'Web';
    const GDS = 'GDS';
    const API = 'API';
    const Unmapped = 'Unmapped';

}

class SystemType {

    const __default = 'aDefault';
    const aDefault = 'Default';
    const WinRez = 'WinRez';
    const FareManager = 'FareManager';
    const ScheduleManager = 'ScheduleManager';
    const WinManager = 'WinManager';
    const ConsoleRez = 'ConsoleRez';
    const WebRez = 'WebRez';
    const WebServicesAPI = 'WebServicesAPI';
    const WebServicesESC = 'WebServicesESC';
    const InternalService = 'InternalService';
    const WebReporting = 'WebReporting';
    const TaxAndFeeManager = 'TaxAndFeeManager';
    const DCS = 'DCS';
    const Unmapped = 'Unmapped';

}

class LogonRequestData {

    /**
     *
     * @var string $DomainCode
     * @access public
     */
    public $DomainCode = null;

    /**
     *
     * @var string $AgentName
     * @access public
     */
    public $AgentName = null;

    /**
     *
     * @var string $Password
     * @access public
     */
    public $Password = null;

    /**
     *
     * @var string $LocationCode
     * @access public
     */
    public $LocationCode = null;

    /**
     *
     * @var string $RoleCode
     * @access public
     */
    public $RoleCode = null;

    /**
     *
     * @var string $TerminalInfo
     * @access public
     */
    public $TerminalInfo = null;
    public $accountNumber = null;

    /**
     * @param int $id ID of the Indigo Db record - default is 28 - testing Indigo
     * @access public
     */
    public function __construct($id) {
        $model = \AirSource::model()->findByPk($id);
        /* @var $model AirSource */
        if (!$model) {
            \Utils::finalMessage("AirSource Scoot DB record not found. Wrong ID: {$id}\n");
        } else {
            $this->DomainCode = $model->spare1;
            $this->Password = $model->tran_password;
            $this->AgentName = $model->tran_username;
            $this->accountNumber = $model->profile_pcc;
            $this->LocationCode = $model->spare2;
        }
    }

}

class TokenRequest {

    /**
     *
     * @var string $Token
     * @access public
     */
    public $Token = null;

    /**
     *
     * @var string $TerminalInfo
     * @access public
     */
    public $TerminalInfo = null;

    /**
     *
     * @var ChannelType $ChannelType
     * @access public
     */
    public $ChannelType = null;

    /**
     *
     * @var SystemType $SystemType
     * @access public
     */
    public $SystemType = null;

}

class TransferSessionResponseData {

    /**
     *
     * @var string $Signature
     * @access public
     */
    public $Signature = null;

}

class ChangePasswordRequest {

    /**
     *
     * @var LogonRequestData $logonRequestData
     * @access public
     */
    public $logonRequestData = null;

    /**
     *
     * @var string $newPassword
     * @access public
     */
    public $newPassword = null;

}

class LogonRequest {

    /**
     *
     * @var LogonRequestData $logonRequestData
     * @access public
     */
    public $logonRequestData = null;

    /**
     *
     * @param LogonRequestData $logonRequestData
     * @access public
     */
    public function __construct($logonRequestData) {
        $this->logonRequestData = $logonRequestData;
    }

}

class LogoutRequest {

    public $Signature = null;

    public function __construct($param) {
        $this->Signature = $param;
    }

}

class TransferSessionRequest {

    /**
     *
     * @var TokenRequest $tokenRequest
     * @access public
     */
    public $tokenRequest = null;

}

class TransferSessionResponse {

    /**
     *
     * @var TransferSessionResponseData $TransferSessionResponseData
     * @access public
     */
    public $TransferSessionResponseData = null;

}

class LogonResponse {

    /**
     *
     * @var string $Signature
     * @access public
     */
    public $Signature = null;

}
