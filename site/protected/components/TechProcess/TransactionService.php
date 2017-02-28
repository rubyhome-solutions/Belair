<?php

namespace application\components\TechProcess;

class TransactionService extends \SoapClient {

    /**
     * @param string $wsdl The enviroment to use (test|production)
     * @param array $options A array of config values
     * @return \SoapClient The SOAP client to be used
     * @access public
     */
    public function __construct($wsdl = 'test') {
        $wsdlFile = __DIR__ . '/' . $wsdl . '/TransactionDetailsNew.wsdl';
        if (!file_exists($wsdlFile)) {
            \Yii::log("Wrong TechProcess enviroment. WSDL file not found: $wsdlFile \n");
            throw new \CHttpException(404, "Missing TechProcess component - check the logs.");
        }

        // Force the compression option
        $options = [
            'compression' => SOAP_COMPRESSION_ACCEPT | SOAP_COMPRESSION_GZIP,
            'trace' => true,
            'exceptions' => 1,
            'connection_timeout'=> 15
        ];
        parent::__construct($wsdlFile, $options);
    }

    /**
     * @param getTransactionToken $parameters
     * @access public
     * @return getTransactionTokenResponse
     */
    public function getTransactionToken(getTransactionToken $parameters) {
//            return $this->__soapCall('getTransactionToken', array($parameters));
        try {
            return $this->__soapCall('getTransactionToken', array($parameters));
        } catch (\SoapFault $e) {
            \Utils::soapLogDebug($this);
//            \Utils::dbgYiiLog($e->getMessage());
            return $e->getMessage();
        }
    }

}

class getTransactionToken {

    /**
     * @var string $msg
     * @access public
     */
    public $msg = null;

    /**
     * @param string $msg
     * @access public
     */
    public function __construct($msg = null) {
        $this->msg = $msg;
    }

}

class getTransactionTokenResponse {

    /**
     * @var string $getTransactionTokenReturn
     * @access public
     */
    public $getTransactionTokenReturn = null;

    /**
     * @param string $getTransactionTokenReturn
     * @access public
     */
    public function __construct($getTransactionTokenReturn = null) {
        $this->getTransactionTokenReturn = $getTransactionTokenReturn;
    }

}
