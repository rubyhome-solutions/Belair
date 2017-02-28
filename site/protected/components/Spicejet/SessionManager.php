<?php

namespace application\components\Spicejet;

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
        'LogonRequestData' => 'application\components\Spicejet\LogonRequestData',
        'TokenRequest' => 'application\components\Spicejet\TokenRequest',
        'TransferSessionResponseData' => 'application\components\Spicejet\TransferSessionResponseData',
        'ChangePasswordRequest' => 'application\components\Spicejet\ChangePasswordRequest',
        'LogonRequest' => 'application\components\Spicejet\LogonRequest',
        'LogoutRequest' => 'application\components\Spicejet\LogoutRequest',
        'TransferSessionRequest' => 'application\components\Spicejet\TransferSessionRequest',
        'TransferSessionResponse' => 'application\components\Spicejet\TransferSessionResponse',
        'LogonResponse' => 'application\components\Spicejet\LogonResponse');

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

        // Local options - valid for SG SOAP
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
     * @param int $id Spicejet production is 32
     * @access public
     * @return LogonResponse
     */
    public function Logon($id) {
        $lrd = new LogonRequestData($id);
        $this->accountNumber = $lrd->accountNumber;

        $parameters = new LogonRequest($lrd);
//        \Utils::dbgYiiLog($parameters);
        try {
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
        if ($this->signature !== null) {
            $headers[] = new \SoapHeader('http://schemas.navitaire.com/WebServices', 'ContractVersion', 0);
            $headers[] = new \SoapHeader('http://schemas.navitaire.com/WebServices', 'Signature', $this->signature);
            $this->__setSoapHeaders($headers);
            $lr = new LogoutRequest($this->signature);
            return $this->__soapCall('Logout', array($lr));
        }
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
            \Utils::finalMessage("AirSource Indigo DB record not found. Wrong ID: {$id}\n");
        } else {
            $this->DomainCode = $model->spare1;
            $this->Password = $model->tran_password;
            $this->AgentName = $model->tran_username;
            $this->accountNumber = $model->profile_pcc;
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
