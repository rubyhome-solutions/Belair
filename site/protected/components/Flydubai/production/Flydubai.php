<?php

namespace application\components\Flydubai\production;
set_time_limit(100);
//include_once (__DIR__ . "/../Utils.php");
/**
 * Flydubai API
 */
class Flydubai extends \SoapClient{

    const TRAVELER_ADULT = 1;
    const TRAVELER_INFANT = 5;
    const TRAVELER_CHILD = 6;
    const BASE_URL='https://api.flydubai.com/res/v1/';
    
    static $passengerTypes = [
        self::TRAVELER_ADULT => 'Adult',
        self::TRAVELER_INFANT => 'Infant',
        self::TRAVELER_CHILD => 'Child',
    ];
    static $taxesReformat = [
//        362 => 'YQ',
//        1353 => 'YQ',
//        323 => 'YQ',
//        326 => 'YQ',
//        327 => 'YQ',
//        3724 => 'YQ',
//        2542 => 'YQ',
//        1922 => 'JN',
//        2061 => 'JN',
//        2002 => 'JN',
//        2042 => 'JN',
//        2801 => 'UDF',
//        2803 => 'UDF',
//        841 => 'UDF',
//        2806 => 'UDF',
//        1482 => 'UDF',
//        2363 => 'PSF',
//        741 => 'PSF',
//        2821 => 'PSF',
//        1481 => 'PSF',
//        2822 => 'Other',
//        2823 => 'Other',
//        1221 => 'Other',
        
        6208=>'Other',
        7025=>'JN',
        7026=>'PSF',
        7027=>'Other',
        7064=>'Other',
        2193=>'BAGB',
        4884=>'Other',
        7065=>'Other',
        1624=>'PSF',
        4844=>'Other',
    ];
    static $taxCodes = [
//        'FUEL' => 'YQ',
//        'PHF' => 'Other',
//        'ADF' => 'Other',
//        'ST' => 'JN',
//        'PSF' => 'PSF',
//        'UDF' => 'UDF',
//        'ST1' => 'JN',
//        'ST2' => 'JN',
        
        'ZR' => 'Other',
        'JN' => 'JN',
        'WO' => 'PSF',
        'YM' => 'Other',
        'IN' => 'Other',
        'BAGB' => 'BAGB',
        'UR'=>'Other',
        'AE'=>'PSF',
        'TP'=>'Other',
                
    ];
    static $cabinTypes = [
        \CabinType::ECONOMY => 'ECONOMY',
        \CabinType::PREMIUM_ECONOMY => 'ECONOMY',
        \CabinType::BUSINESS => 'BUSINESS',
        \CabinType::FIRST => 'BUSINESS',
    ];
    private $credentials;
    private $_token;
    private $tokenTimestamp;
    private $id;
    public $commisionFee;
    static function curl($url, $extra = '',$soapAction='') {
        // Assigning cURL options to an array
        $options = Array(
            CURLOPT_RETURNTRANSFER => TRUE, // Setting cURL's option to return the webpage data
            CURLOPT_FOLLOWLOCATION => TRUE, // Setting cURL to follow 'location' HTTP headers
            CURLOPT_MAXREDIRS => 10, // stop after 10 redirects 
            CURLOPT_COOKIEFILE => '.cookie.txt',
            CURLOPT_COOKIEJAR => '.cookie.txt',
            CURLOPT_AUTOREFERER => TRUE, // Automatically set the referer where following 'location' HTTP headers
            CURLOPT_CONNECTTIMEOUT => 55, // Setting the amount of time (in seconds) before the request times out
            CURLOPT_TIMEOUT => 55, // Setting the maximum amount of time for cURL to execute queries
            CURLOPT_MAXREDIRS => 10, // Setting the maximum number of redirections to follow
            CURLOPT_USERAGENT => "Googlebot/2.1 (http://www.googlebot.com/bot.html)", // Setting the useragent
            CURLOPT_ENCODING => "gzip", // To hadle zipped streams
            CURLOPT_URL => $url, // Setting cURL's URL option with the $url variable passed into the function
            CURLOPT_SSL_VERIFYPEER => false, // Do not check for SSL certificate
            CURLOPT_SSL_VERIFYHOST => false,
        );
        if ($extra != '') {
            $options[CURLOPT_POSTFIELDS] = $extra;
            $options[CURLOPT_POST] = true;
            $header = array(
                "Content-type: text/xml;charset=\"utf-8\"",
                "Accept: text/xml",
                "Cache-Control: no-cache",
                "Pragma: no-cache",
                "SOAPAction: {$soapAction}",
                "Content-length: " . strlen($extra),
            );
            $options[CURLOPT_HTTPHEADER] = $header;

            //  $options[CURLOPT_HTTPHEADER]=array('Content-Type: text/xml; charset=utf-8', 'Content-Length: '.strlen($extra) ); 
        }
        $ch = curl_init();   // Initialising cURL 
        curl_setopt_array($ch, $options);   // Setting cURL's options using the previously assigned array data in $options
        $data = curl_exec($ch); // Executing the cURL request and assigning the returned data to the $data variable
        $err = curl_error($ch);
        curl_close($ch);     // Closing cURL 
        return ['result' => $data, 'error' => $err];     // Returning the data from the function 
    }

    function __construct($id) {
        $this->_token = false;
        $this->tokenTimestamp = false;
        $this->id = $id;
        $model = \AirSource::model()->findByPk($id);
        /* @var $model AirSource */
        if (!$model) {
            \Utils::finalMessage("AirSource DB record not found. Wrong ID: {$id}\n");
        }
        $this->credentials['login'] = $model->username;
        $this->credentials['password'] = $model->password;
        if (empty($this->credentials['login']) || empty($this->credentials['password'])) {
            \Utils::finalMessage("API Credentials not found. Check Air Source with ID: {$id}\n");
        }
        $this->credentials['TANumber'] = $model->profile_pcc;
        $this->credentials['tranPassword'] = $model->tran_password;
        $this->credentials['tranUsername'] = $model->tran_username;
        if (empty($this->credentials['TANumber']) ||
                empty($this->credentials['tranPassword']) ||
                empty($this->credentials['tranUsername'])
        ) {
            \Utils::finalMessage("Transactions Credentials not found. Check Air Source with ID: {$id}\n");
        }
    }

    public function getToken() {
//        if ($this->_token !== false && $this->tokenTimestamp > (time() - 28 * 60)) {
//            return $this->_token;    // Do not aquire new token if old one is present
//        }

        $strXml = "<?xml version=\"1.0\"?><soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\" xmlns:rad=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Request\" xmlns:rad1=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Security.Request\">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:RetrieveSecurityToken>
         <tem:RetrieveSecurityTokenRequest>
            <rad:CarrierCodes>
               <rad:CarrierCode>
                  <rad:AccessibleCarrierCode>FZ</rad:AccessibleCarrierCode>
               </rad:CarrierCode>
            </rad:CarrierCodes>
            <rad1:LogonID>{$this->credentials['login']}</rad1:LogonID>
            <rad1:Password>{$this->credentials['password']}</rad1:Password>
         </tem:RetrieveSecurityTokenRequest>
      </tem:RetrieveSecurityToken>
   </soapenv:Body>
</soapenv:Envelope>";
    // \Utils::dbgYiiLog(['RetrieveSecurityToken', $strXml]);
            $soapAction="\"http://tempuri.org/IConnectPoint_Security/RetrieveSecurityToken\"";
        $res = $this->curl(self::BASE_URL.'security', $strXml,$soapAction);

     //\Utils::dbgYiiLog($res);
     //Yii::app()->end();
        if(!empty($res['error'])){
          \Utils::dbgYiiLog(__METHOD__ . " Error: " . $res['error']);    // Log the result as error
            return false;
      }
            $doc = simplexml_load_string($res['result']);
            $doc->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Security.Response');
            $doc->registerXPathNamespace('b', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Exceptions');
            $doc->registerXPathNamespace('s', 'http://schemas.xmlsoap.org/soap/envelope/');
            
        $exceptionCode=1;
        $exceptionDescription=null;
        if(count($doc->xpath('//s:Envelope/s:Body/s:Fault'))>0){
            $exceptionDescription='DeserializationFailed';
            \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
            return false;
        }
        $exceptionCode=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
        $exceptionDescription=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];

        if ((string)$exceptionCode != '0'){
            \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
            return false;
        }   
            
            $nodes = $doc->xpath('//a:SecurityToken');

            $this->_token = (string) $nodes[0];
//            \Utils::dbgYiiLog($this->_token);
            
            $this->tokenTimestamp = time();
            $exceptionCode='1';
            $exceptionDescription=null;
            $exceptionCode=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
            $exceptionDescription=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];
            
            if ((string)$exceptionCode == '0') {
               // echo $nodes[0];
                return true;
            } else {
              //  \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
                return false;
            }
        
    }

    public function getOriginAirports() {
        $this->getToken();
        $res = \Utils::curl('http://g8.service.radixx.com/RadixxAirports.asmx/GetOriginAirportsXML', http_build_query([
                    'SecurityGUID' => $this->_token,
                    'CarrierCode' => 'G8',
                        ])
        );
        if ($res['result'] === false) {
            \Yii::log($res['error']);    // Log the error
            return false;
        } else {
//            file_put_contents('g8_origin_airports.xml', html_entity_decode($res['result']));
            preg_match_all('#<AirportCode>(...)#', html_entity_decode($res['result']), $matches);
            return array_unique($matches[1]);
        }
    }

    public function getDestinationAirports($srcAirportCode) {
        $this->getToken();
        $res = \Utils::curl('http://g8.service.radixx.com/RadixxAirports.asmx/GetDestinationAirportsXML', http_build_query([
                    'SecurityGUID' => $this->_token,
                    'AirportCode' => $srcAirportCode,
                    'CarrierCode' => 'G8',
                        ])
        );
        if ($res['result'] === false) {
            \Yii::log($res['error']);    // Log the error
            return false;
        } else {
            preg_match_all('#<AirportCode>(...)#', html_entity_decode($res['result']), $matches);
            return array_unique($matches[1]);
        }
    }

    public function loginTravelAgencyUser() {
         if($this->getToken()!=true){
             return false;
         }
       
      //  $airsource = AirSource::model()->findByPk($this->id);

       $strXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\" xmlns:rad=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Request\" xmlns:rad1=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.TravelAgents.Request\">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:LoginTravelAgent>
         <tem:LoginTravelAgentRequest>
            <rad:SecurityGUID>{$this->_token}</rad:SecurityGUID>
            <rad:CarrierCodes>
               <rad:CarrierCode>
                  <rad:AccessibleCarrierCode>FZ</rad:AccessibleCarrierCode>
               </rad:CarrierCode>
            </rad:CarrierCodes>            
            <rad1:IATANumber>{$this->credentials['TANumber']}</rad1:IATANumber>
            <rad1:UserName>{$this->credentials['tranUsername']}</rad1:UserName>
            <rad1:Password>{$this->credentials['tranPassword']}</rad1:Password>
         </tem:LoginTravelAgentRequest>
      </tem:LoginTravelAgent>
   </soapenv:Body>
</soapenv:Envelope>";     
//\Utils::dbgYiiLog(['LoginTravelAgent', $strXml]);
//Yii::app()->end();

        $soapAction="\"http://tempuri.org/IConnectPoint_TravelAgents/LoginTravelAgent\"";       
        $res = $this->curl(self::BASE_URL.'travelagents',$strXml,$soapAction);
        
      //\Utils::dbgYiiLog($res);
      
       
      if(!empty($res['error'])){
          \Utils::dbgYiiLog(__METHOD__ . " Error: " . $res['error']);    // Log the result as error
            return false;
      }
            
            $doc = simplexml_load_string($res['result']);
            $doc->registerXPathNamespace('s', 'http://schemas.xmlsoap.org/soap/envelope/');
            
        $exceptionCode=1;
        $exceptionDescription=null;
        if(count($doc->xpath('//s:Envelope/s:Body/s:Fault'))>0){
            $exceptionDescription='DeserializationFailed';
            \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
            return false;
        }
        $doc->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.TravelAgents.Response');
        $doc->registerXPathNamespace('b', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Exceptions');
           
        $exceptionCode=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
        $exceptionDescription=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];

        if ((string)$exceptionCode != '0'){
            \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
            return false;
        }   
            
            
            $nodes = $doc->xpath('//a:LoggedIn');
            $exceptionCode=1;
            $exceptionDescription=null;
            $exceptionCode=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
            $exceptionDescription=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];
             
            if ((string) $nodes[0] === 'true') {
               // echo $nodes[0];
                return true;
            } else {
                \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
                return false;
            }
        
    }

    public function retrieveAgencyCommission() {
       
        $strXml="<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\" xmlns:rad=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Request\" xmlns:rad1=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.TravelAgents.Request\">
                    <soapenv:Header/>
                    <soapenv:Body>
                       <tem:RetrieveAgencyCommission>
                          <tem:RetrieveAgencyCommissionRequest>
                             <rad:SecurityGUID>{$this->_token}</rad:SecurityGUID>
                             <rad:CarrierCodes>
                                <rad:CarrierCode>
                                   <rad:AccessibleCarrierCode>FZ</rad:AccessibleCarrierCode>
                                </rad:CarrierCode>
                             </rad:CarrierCodes>
                            <rad1:CurrencyCode>INR</rad1:CurrencyCode>
                          </tem:RetrieveAgencyCommissionRequest>
                       </tem:RetrieveAgencyCommission>
                    </soapenv:Body>
                 </soapenv:Envelope>";
//  \Utils::dbgYiiLog(['RetrieveAgencyCommission', $strXml]);
        $soapAction="\"http://tempuri.org/IConnectPoint_TravelAgents/RetrieveAgencyCommission\"";    
        $res = $this->curl(self::BASE_URL.'travelagents', $strXml,$soapAction);
//  \Utils::dbgYiiLog($res);
        if(!empty($res['error'])){
          \Utils::dbgYiiLog(__METHOD__ . " Error: " . $res['error']);    // Log the result as error
            return false;
      }
            $doc = simplexml_load_string($res['result']);
            $doc->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.TravelAgents.Response');
            $doc->registerXPathNamespace('b', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Exceptions');
            //$nodes = $doc->xpath('//a:TravelAgencyCommissions/a:TravelAgencyCommission/a:Amount');
            $doc->registerXPathNamespace('s', 'http://schemas.xmlsoap.org/soap/envelope/');
            
        $exceptionCode=1;
        $exceptionDescription=null;
        if(count($doc->xpath('//s:Envelope/s:Body/s:Fault'))>0){
            $exceptionDescription='DeserializationFailed';
            \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
            return false;
        }
        $exceptionCode=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
        $exceptionDescription=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];

        if ((string)$exceptionCode != '0'){
            \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
            return false;
        }   
            foreach ($doc->xpath('//a:TravelAgencyCommissions/a:TravelAgencyCommission/a:Amount') as $item) {
                $this->commisionFee=$item;                
            }
            $exceptionCode=1;
            $exceptionDescription=null;
            $exceptionCode=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
            $exceptionDescription=(string)$doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];
            
            if ((string)$exceptionCode == '0') {
               // echo $nodes[0];
                return true;
            } else {
                \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
                return false;
            }
        
    }

    /**
     * Get the availability and best fair quotes 
     * @param string $source Origination Airport
     * @param string $destination Destination Airport
     * @param string $departure_date Date of departure
     * @param array $travelers Array with traveler type as key and number of the seats as value
     * @param int $cabin Cabin type ID according to CabinType class
     * @param string $back_date Return date
     * @return mixed false or SimpleXmlObject 
     */
    public function search($source, $destination, $departure_date, $travelers = [self::TRAVELER_ADULT => 1], $cabin = \CabinType::ECONOMY, $back_date = null) {
        
        if ($this->loginTravelAgencyUser() === false) {
            return false;
        }
        if ($this->retrieveAgencyCommission() === false) {
            return false;
        }
        $src=\Airport::model()->findByAttributes(['airport_code'=>$source]);
        if(!isset($src))
            return false;
//        if($src->country_code== \application\components\Flydubai\Utils::ORIGIN_COUNTRY && $this->id != \application\components\Flydubai\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID)
//            return false;
        
        $cabin = self::$cabinTypes[$cabin];
//        $departure_date = str_replace('-', '', $departure_date);
        $fqri = '';
        // Travelers preparation
        foreach ($travelers as $travelerType => $seats) {
            if (!empty($seats)) {

                $fqri .= "<rad1:FareQuoteRequestInfo>
                        <rad1:PassengerTypeID>{$travelerType}</rad1:PassengerTypeID>
                        <rad1:TotalSeatsRequired>{$seats}</rad1:TotalSeatsRequired>
                   </rad1:FareQuoteRequestInfo>";
            }
        }
        $returnTrip = '';
        // Round trip case
        if ($back_date !== null) {

            $returnTrip = "<rad1:FareQuoteDetail>
                  <rad1:Origin>{$destination}</rad1:Origin>
                  <rad1:Destination>{$source}</rad1:Destination>
                  <rad1:UseAirportsNotMetroGroups>false</rad1:UseAirportsNotMetroGroups>                                    
                  <rad1:UseAirportsNotMetroGroupsAsRule>false</rad1:UseAirportsNotMetroGroupsAsRule>                  
                  <rad1:UseAirportsNotMetroGroupsForFrom>false</rad1:UseAirportsNotMetroGroupsForFrom>
                  <rad1:UseAirportsNotMetroGroupsForTo>false</rad1:UseAirportsNotMetroGroupsForTo>   
                  <rad1:DateOfDeparture>{$back_date}</rad1:DateOfDeparture>
                  <rad1:FareTypeCategory>1</rad1:FareTypeCategory>
                  <rad1:FareClass/>
                  <rad1:FareBasisCode/>
                  <rad1:Cabin>$cabin</rad1:Cabin>
                  <rad1:LFID>-214</rad1:LFID>
                  <rad1:OperatingCarrierCode>FZ</rad1:OperatingCarrierCode>
                  <rad1:MarketingCarrierCode>FZ</rad1:MarketingCarrierCode>
                  <rad1:NumberOfDaysBefore>0</rad1:NumberOfDaysBefore>
                  <rad1:NumberOfDaysAfter>0</rad1:NumberOfDaysAfter>
                  <rad1:LanguageCode>en</rad1:LanguageCode>
                  <rad1:TicketPackageID>1</rad1:TicketPackageID>
                  <rad1:FareQuoteRequestInfos>$fqri
                  </rad1:FareQuoteRequestInfos>
               </rad1:FareQuoteDetail>";
        }

        $strXml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\" xmlns:rad=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Request\" xmlns:rad1=\"http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Request.FareQuote\">
   <soapenv:Header/>
   <soapenv:Body>
      <tem:RetrieveFareQuote>
            <tem:RetrieveFareQuoteRequest>
                    <rad:SecurityGUID>{$this->_token}</rad:SecurityGUID>
                    <rad:CarrierCodes>
                       <rad:CarrierCode>
                          <rad:AccessibleCarrierCode>FZ</rad:AccessibleCarrierCode>
                       </rad:CarrierCode>
                    </rad:CarrierCodes>
                    <rad:HistoricUserName>{$this->credentials['tranUsername']}</rad:HistoricUserName>
                    <rad1:CurrencyOfFareQuote>INR</rad1:CurrencyOfFareQuote>
                    <rad1:PromotionalCode/>
                    <rad1:IataNumberOfRequestor>{$this->credentials['TANumber']}</rad1:IataNumberOfRequestor>
                    <rad1:CorporationID>-214</rad1:CorporationID>
                    <rad1:FareFilterMethod>NoCombinabilityRoundtripLowestFarePerFareType</rad1:FareFilterMethod>
                    <rad1:FareGroupMethod>WebFareTypes</rad1:FareGroupMethod>
                    <rad1:InventoryFilterMethod>Available</rad1:InventoryFilterMethod>
                    <rad1:FareQuoteDetails>
                        <rad1:FareQuoteDetail>
                                <rad1:Origin>{$source}</rad1:Origin>
                                <rad1:Destination>{$destination}</rad1:Destination>
                                <rad1:UseAirportsNotMetroGroups>false</rad1:UseAirportsNotMetroGroups>
                                <rad1:UseAirportsNotMetroGroupsAsRule>false</rad1:UseAirportsNotMetroGroupsAsRule>                  
                                <rad1:UseAirportsNotMetroGroupsForFrom>false</rad1:UseAirportsNotMetroGroupsForFrom>
                                <rad1:UseAirportsNotMetroGroupsForTo>false</rad1:UseAirportsNotMetroGroupsForTo>      
                                <rad1:DateOfDeparture>{$departure_date}</rad1:DateOfDeparture>
                                <rad1:FareTypeCategory>1</rad1:FareTypeCategory>
                                <rad1:FareClass/>
                                <rad1:FareBasisCode/>
                                <rad1:Cabin>{$cabin}</rad1:Cabin>
                                <rad1:LFID>-214</rad1:LFID>
                                <rad1:OperatingCarrierCode>FZ</rad1:OperatingCarrierCode>
                                <rad1:MarketingCarrierCode>FZ</rad1:MarketingCarrierCode>
                                <rad1:NumberOfDaysBefore>0</rad1:NumberOfDaysBefore>
                                <rad1:NumberOfDaysAfter>0</rad1:NumberOfDaysAfter>
                                <rad1:LanguageCode>en</rad1:LanguageCode>
                                <rad1:TicketPackageID>1</rad1:TicketPackageID>
                                <rad1:FareQuoteRequestInfos>$fqri</rad1:FareQuoteRequestInfos>
                        </rad1:FareQuoteDetail>$returnTrip
                    </rad1:FareQuoteDetails>
             </tem:RetrieveFareQuoteRequest>
          </tem:RetrieveFareQuote>
   </soapenv:Body>
</soapenv:Envelope>";
     // \Utils::dbgYiiLog(['RetrieveFareQuote', $strXml]);
         $soapAction="\"http://tempuri.org/IConnectPoint_Pricing/RetrieveFareQuote\"";    
         $res = $this->curl(self::BASE_URL.'pricing/flights', $strXml,$soapAction);
         
if(!empty($res['error'])){
          \Utils::dbgYiiLog(__METHOD__ . " Error: " . $res['error']);    // Log the result as error
            return false;
      }
           //\Utils::dbgYiiLog($res['result']);
            //\Yii::app()->end();
            $doc = simplexml_load_string($res['result']);
            $doc->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response');
            $doc->registerXPathNamespace('b', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Exceptions');
            $doc->registerXPathNamespace('s', 'http://schemas.xmlsoap.org/soap/envelope/');
            
        $exceptionCode=1;
        $exceptionDescription=null;
        if(count($doc->xpath('//s:Envelope/s:Body/s:Fault'))>0){
            $exceptionDescription='DeserializationFailed';
            \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
            return false;
        }
        
        if (isset($doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0])) {
            $exceptionCode = (string) $doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
            $exceptionDescription = (string) $doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];

            if ((string) $exceptionCode != '1') {
                \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
                return false;
            }
        }
        //$nodes = $doc->xpath('//a:TravelAgencyCommissions/a:TravelAgencyCommission/a:Amount');
           
            $taxInfo=array();
            //Parse Tax Details            
            $cnt=count($doc->xpath('.//a:TaxDetails/a:TaxDetail'));
            
            $i=0;
            foreach ($doc->xpath('.//a:TaxDetails//a:TaxDetail') as $tax) {
                $tax->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response');
                $taxid=(int)$tax->xpath(".//a:TaxID")[0];
                $taxInfo[$taxid]['TaxCode']=(string)$tax->xpath(".//a:TaxCode")[0];
                $taxInfo[$taxid]['CodeType']=(string)$tax->xpath(".//a:CodeType")[0];
                $taxInfo[$taxid]['TaxCurr']=(string)$tax->xpath(".//a:TaxCurr")[0];
                $taxInfo[$taxid]['TaxDesc']=(string)$tax->xpath(".//a:TaxDesc")[0];
                $taxInfo[$taxid]['TaxType']=(int)$tax->xpath(".//a:TaxType")[0];
                $taxInfo[$taxid]['IsVat']=(string)$tax->xpath(".//a:IsVat")[0];
                $taxInfo[$taxid]['IncludedInFare']=(string)$tax->xpath(".//a:IncludedInFare")[0];
                $taxInfo[$taxid]['OriginalCurrency']=(string)$tax->xpath(".//a:OriginalCurrency")[0];
                $taxInfo[$taxid]['ExchangeRate']=(string)$tax->xpath(".//a:ExchangeRate")[0];
                $taxInfo[$taxid]['ExchangeDate']=(string)$tax->xpath(".//a:ExchangeDate")[0];
                $taxInfo[$taxid]['Commissionable']=(string)$tax->xpath(".//a:Commissionable")[0];
             $i++;                  
            }
           
            //Parse Leg Details Details
            $cnt=count($doc->xpath('.//a:LegDetails/a:LegDetail'));
            $i=0;
            $leg=array();
            foreach ($doc->xpath('.//a:LegDetails//a:LegDetail') as $legdetail) {
                $legdetail->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response');
                $legid=(int)$legdetail->xpath(".//a:PFID")[0];
//                \Utils::dbgYiiLog(['Leg',$legid]);
                $leg[$legid]=array(       
                    'OperatingCarrier'=>(string)$legdetail->xpath(".//a:OperatingCarrier")[0],
                    'Origin'=>(string)$legdetail->xpath(".//a:Origin")[0],
                    'Destination'=>(string)$legdetail->xpath(".//a:Destination")[0],
                    'FlightNum'=>(string)$legdetail->xpath(".//a:FlightNum")[0],
                    'International'=>(string)$legdetail->xpath(".//a:International")[0],
                    'DepartureDate'=>\Utils::cutSeconds((string)$legdetail->xpath(".//a:DepartureDate")[0]),
                    'ArrivalDate'=>\Utils::cutSeconds((string)$legdetail->xpath(".//a:ArrivalDate")[0]),
                    'FlightTime'=>(string)$legdetail->xpath(".//a:FlightTime")[0],                    
                    'FromTerminal'=>(string)$legdetail->xpath(".//a:FromTerminal")[0],
                    'ToTerminal'=>(string)$legdetail->xpath(".//a:ToTerminal")[0]                    
                );
                $i++;
            }
 //           \Utils::dbgYiiLog($leg); 
//            exit;
            $out=array();
            //Parse Segments Details            
            $sgcnt=0;
            foreach ($doc->xpath('.//a:SegmentDetails//a:SegmentDetail') as $segmentdetail) {
                $segmentdetail->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response'); 
                $segid=(int)$segmentdetail->xpath(".//a:LFID")[0];
                
                $out[$segid]=array(
                    'Origin'=>(string)$segmentdetail->xpath(".//a:Origin")[0],
                    'Destination'=>(string)$segmentdetail->xpath(".//a:Destination")[0],
                    'CarrierCode'=>(string)$segmentdetail->xpath(".//a:CarrierCode")[0],
                    'ArrivalDate'=>(string)$segmentdetail->xpath(".//a:ArrivalDate")[0],
                    'Stops'=>(string)$segmentdetail->xpath(".//a:Stops")[0],
                    'FlightTime'=>(string)$segmentdetail->xpath(".//a:FlightTime")[0],
                    'AircraftType'=>(string)$segmentdetail->xpath(".//a:AircraftType")[0],
                    'SellingCarrier'=>(string)$segmentdetail->xpath(".//a:SellingCarrier")[0],
                    'FlightNum'=>(int)$segmentdetail->xpath(".//a:FlightNum")[0],
                    'OperatingCarrier'=>(string)$segmentdetail->xpath(".//a:OperatingCarrier")[0],
                    'OperatingFlightNum'=>(int)$segmentdetail->xpath(".//a:OperatingFlightNum")[0],
                    'FlyMonday'=>(string)$segmentdetail->xpath(".//a:FlyMonday")[0],
                    'FlyTuesday'=>(string)$segmentdetail->xpath(".//a:FlyTuesday")[0],
                    'FlyWednesday'=>(string)$segmentdetail->xpath(".//a:FlyWednesday")[0],
                    'FlyThursday'=>(string)$segmentdetail->xpath(".//a:FlyThursday")[0],
                    'FlyFriday'=>(string)$segmentdetail->xpath(".//a:FlyFriday")[0],
                    'FlySaturday'=>(string)$segmentdetail->xpath(".//a:FlySaturday")[0],
                    'FlySunday'=>(string)$segmentdetail->xpath(".//a:FlySunday")[0]
                );
                $sgcnt++;
            }    
//           \Utils::dbgYiiLog($out); 
//            exit;           
            
            
            //Parse Flight Segments
            $sgcnt=0;
            foreach ($doc->xpath('.//a:FlightSegments//a:FlightSegment') as $item) {
            $item->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response'); 
            $lfid = (int)$item->xpath(".//a:LFID")[0];
 //          \Utils::dbgYiiLog(['Flight Segment',$lfid,$sgcnt]);
            $out[$lfid]['DepartureDate']=(string)$item->xpath(".//a:DepartureDate")[0];
            $out[$lfid]['ArrivalDate']=(string)$item->xpath(".//a:ArrivalDate")[0];
            $out[$lfid]['LegCount']=(int)$item->xpath(".//a:LegCount")[0];
            $out[$lfid]['International']=(string)$item->xpath(".//a:International")[0];
            
            $faretypecnt=0;
            $firRound=true;
            foreach ($item->xpath('.//a:FareTypes//a:FareType') as $faretype) {
                
                $faretype->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response'); 
                $fareTypeID =(int) $faretype->xpath(".//a:FareTypeID")[0];
                $fareTypeName =(string) $faretype->xpath(".//a:FareTypeName")[0];
                $fareRemove= (string)$faretype->xpath(".//a:FilterRemove")[0];
//                \Utils::dbgYiiLog(['FareType',$lfid,$fareTypeID]);
                $fareinfocnt=0;
                if(($cabin=='ECONOMY' && $fareTypeID != 3) || ($cabin=='BUSINESS' && $fareTypeID !=4)){
                    continue;
                }
                foreach ($faretype->xpath('.//a:FareInfos//a:FareInfo') as $fareinfo) {
                    $fareinfo->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response');
                    $ptcid = (int)$fareinfo->xpath(".//a:PTCID")[0];
                    if (!$firRound) {
                        if ($out[$lfid]['passengers'][$ptcid]['taxSummary']['BaseFareAmtInclTax'] < (double) $fareinfo->xpath(".//a:BaseFareAmtInclTax")[0]) {
                            break;
                        }
                    }
                    
//                    \Utils::dbgYiiLog(['FareInfos',$lfid,$ptcid]);
                    $out[$lfid]['passengers'][$ptcid]['taxSummary']=array(
                        'FareID'=>(int)$fareinfo->xpath(".//a:FareID")[0],
                        'FCCode'=>(string)$fareinfo->xpath(".//a:FCCode")[0],
                        'FBCode'=>(string)$fareinfo->xpath(".//a:FBCode")[0],
                        'BaseFareAmtNoTaxes'=>(double)$fareinfo->xpath(".//a:BaseFareAmtNoTaxes")[0],
                        'BaseFareAmt'=>(double)$fareinfo->xpath(".//a:BaseFareAmt")[0],
                        'FareAmtNoTaxes'=>(double)$fareinfo->xpath(".//a:FareAmtNoTaxes")[0],
                        'FareAmt'=>(double)$fareinfo->xpath(".//a:FareAmt")[0],
                        'BaseFareAmtInclTax'=>(double)$fareinfo->xpath(".//a:BaseFareAmtInclTax")[0],
                        'FareAmtInclTax'=>(double)$fareinfo->xpath(".//a:FareAmtInclTax")[0],
                        'PvtFare'=>(string)$fareinfo->xpath(".//a:PvtFare")[0],
                        'Cabin'=>(string)$fareinfo->xpath(".//a:Cabin")[0],
                        'SeatsAvailable'=>(string)$fareinfo->xpath(".//a:SeatsAvailable")[0],
                        'InfantSeatsAvailable'=>(string)$fareinfo->xpath(".//a:InfantSeatsAvailable")[0],
                        'FareScheduleID'=>(string)$fareinfo->xpath(".//a:FareScheduleID")[0],
                        'PromotionID'=>(string)$fareinfo->xpath(".//a:PromotionID")[0],
                        'RoundTrip'=>(string)$fareinfo->xpath(".//a:RoundTrip")[0],
                        'DisplayFareAmt'=>(double)$fareinfo->xpath(".//a:DisplayFareAmt")[0],
                        'DisplayTaxSum'=>(double)$fareinfo->xpath(".//a:DisplayTaxSum")[0],
                        'SpecialMarketed'=>(string)$fareinfo->xpath(".//a:SpecialMarketed")[0],
              //          'WaitList'=>(string)$fareinfo->xpath(".//a:WaitList")[0],
              //          'SpaceAvailable'=>(string)$fareinfo->xpath(".//a:SpaceAvailable")[0],
              //          'PositiveSpace'=>(string)$fareinfo->xpath(".//a:PositiveSpace")[0],
              //          'PromotionCatID'=>(string)$fareinfo->xpath(".//a:PromotionCatID")[0],
             //           'CommissionAmount'=>(double)$fareinfo->xpath(".//a:CommissionAmount")[0],
              //          'PromotionAmount'=>(double)$fareinfo->xpath(".//a:PromotionAmount")[0]                        
                    );
                    
                    $taxdetailcnt=0;
                    unset($out[$lfid]['passengers'][$ptcid]['taxes']);
                      foreach ($fareinfo->xpath('.//a:ApplicableTaxDetails//a:ApplicableTaxDetail') as $taxdetail) {
                         $taxdetail->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response'); 
                         if (isset(self::$taxesReformat[(int) $taxdetail->xpath(".//a:TaxID")[0]])) {
                            $reformat = self::$taxesReformat[(int) $taxdetail->xpath(".//a:TaxID")[0]];
                        } else {
                            //echo $taxdetail['TaxID']."  ".$taxInfo[(int)$taxdetail->xpath("//a:TaxID")[$taxdetailcnt]]['TaxCode'];
                            if(isset(self::$taxCodes[$taxInfo[(int) $taxdetail->xpath(".//a:TaxID")[0]]['TaxCode']]))
                                $reformat = self::$taxCodes[$taxInfo[(int) $taxdetail->xpath(".//a:TaxID")[0]]['TaxCode']];
                            else
                                $reformat='Other';
                        }
                        if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                            $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (double) $taxdetail->xpath(".//a:Amt")[0];
                        } else {
                            $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (double) $taxdetail->xpath(".//a:Amt")[0];
                        }
                        $taxdetailcnt++;
                    }
                    $fareinfocnt++;
                }
                $firRound=false;
                $faretypecnt++; 
            }
            $flightlegcnt=0;
            
            foreach ($item->xpath('.//a:FlightLegDetails//a:FlightLegDetail') as $flightleg) {
                $flightleg->registerXPathNamespace('a', 'http://schemas.datacontract.org/2004/07/Radixx.ConnectPoint.Pricing.Response'); 
                $flegid = (int)$flightleg->xpath(".//a:PFID")[0];
                 $out[$lfid]['legs'][]=$flegid;
//                 \Utils::dbgYiiLog(['FlightLegDetails',$lfid,$flegid]);
                 $flightlegcnt++;
            }
            $sgcnt++;
        }
            
//            exit;
            $exceptionCode=1;
            $exceptionDescription=null;
            if (isset($doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0])) {
            $exceptionCode = (string) $doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionCode')[0];
            $exceptionDescription = (string) $doc->xpath('//a:Exceptions/b:ExceptionInformation.Exception/b:ExceptionDescription')[0];
        }
        if ((string)$exceptionCode == '1') {
               // echo $nodes[0];
                //return $res;
                return [$out,$leg];
            } else {
                \Utils::dbgYiiLog(__METHOD__ . " Error: " . $exceptionDescription);    // Log the result as error
                return false;
            }
    }

    static function xml2phpArray($xml,$arr){ 
    $iter = 0; 
        foreach($xml->children() as $b){ 
                $a = $b->getName(); 
                if(!$b->children()){ 
                        $arr[$a] = trim($b[0]); 
                } 
                else{ 
                        $arr[$a][$iter] = array(); 
                        $arr[$a][$iter] = xml2phpArray($b,$arr[$a][$iter]); 
                } 
        $iter++; 
        } 
        return $arr; 
} 

    /**
     * Construc array with taxID as key and tax description as value
     * @param array $arr The returned data as array from GetFareQuote API call
     * @return array Parsed taxes
     */
    static function parseTaxes($arr) {
        $out = array();
        if (isset($arr['TaxDetails']['Tax'])) {
            foreach ($arr['TaxDetails']['Tax'] as $fare) {
                $out[$fare['@attributes']['TaxID']] = $fare['@attributes'];
            }
        }
        return $out;
    }

    static function parseLegs($arr) {
        $out = array();
        if (isset($arr['LegDetails']['Leg'])) {
            foreach ($arr['LegDetails']['Leg'] as $leg) {
                $out[$leg['@attributes']['PFID']] = $leg['@attributes'];
                // Remove the duplicating PFID info
                unset($out[$leg['@attributes']['PFID']]['PFID']);
                // Reformat the timestamps
                $out[$leg['@attributes']['PFID']]['DepartureDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['DepartureDate']));
                $out[$leg['@attributes']['PFID']]['ArrivalDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['ArrivalDate']));
            }
        } else if (isset($arr['LegDetails'][0])) {

            $leg = $arr['LegDetails'][0];
            $out[$leg['@attributes']['PFID']] = $leg['@attributes'];
            // Remove the duplicating PFID info
            unset($out[$leg['@attributes']['PFID']]['PFID']);
            // Reformat the timestamps
            $out[$leg['@attributes']['PFID']]['DepartureDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['DepartureDate']));
            $out[$leg['@attributes']['PFID']]['ArrivalDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$leg['@attributes']['PFID']]['ArrivalDate']));
        }

        return $out;
    }

    static function parseSegments($arr) {
        $taxInfo = self::parseTaxes($arr);
        $out = array();
        // Stop the parsing and return empty array if there are no segments
        if (!isset($arr['SegmentDetails'])) {
            return $out;
        }
        if (isset($arr['SegmentDetails']['Segment'])) {
            $segments = $arr['SegmentDetails']['Segment'];
        } else {
            $segments = $arr['SegmentDetails'];
        }
        foreach ($segments as $segment) {
            $out[$segment['@attributes']['LFID']] = $segment['@attributes'];
            // Remove the duplicating LFID info
            unset($out[$segment['@attributes']['LFID']]['LFID']);
            // Reformat the timestamps
            $out[$segment['@attributes']['LFID']]['DepartureDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$segment['@attributes']['LFID']]['DepartureDate']));
            $out[$segment['@attributes']['LFID']]['ArrivalDate'] = \Utils::cutSeconds(str_replace('T', ' ', $out[$segment['@attributes']['LFID']]['ArrivalDate']));
        }

        if (isset($arr['FlightSegmentDetails']['FlightSegment'][0])) {
            $segments = $arr['FlightSegmentDetails']['FlightSegment'];
        } else {
            $segments = $arr['FlightSegmentDetails'];
        }

        // Assign Legs to segments
        foreach ($segments as $segment) {
            $lfid = $segment['@attributes']['LFID'];
            // Pare Legs
            foreach ($segment['FlightLegDetails'] as $fligth) {
                if (isset($fligth['@attributes'])) {
                    $out[$lfid]['legs'][] = $fligth['@attributes']['PFID'];
                } else {
                    foreach ($fligth as $fligthLeg) {
                        $out[$lfid]['legs'][] = $fligthLeg['@attributes']['PFID'];
                    }
                }
            }
            // Parse fare taxes
//\Utils::dbgYiiLog($segment);

            if (isset($segment['FareTypes']['FareType'][0]['FareInfos'])) { //if more than one fare type (select the cheapest one)
                $lastTotal = 0.0;
                $currentTotal = 0.0;
                $tempout = null;
                $firstRound = true;
                unset($tempout);
                foreach ($segment['FareTypes']['FareType'] as $faretypes) {
                    $fareinfos = $faretypes['FareInfos']['FareInfo'];

                    if (isset($fareinfos[0])) { //more than one fare info
                        foreach ($fareinfos as $fares) {
//                    \Utils::dbgYiiLog($fares);
                            $ptcid = $fares['@attributes']['PTCID'];
                            if (!$firstRound) {
                                if ($out[$lfid]['passengers'][$ptcid]['taxSummary']['BaseFareAmtInclTax'] < $fares['@attributes']['BaseFareAmtInclTax']) {
                                    break;
                                }
                            }

                            $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                            $lastTotal+=$out[$lfid]['passengers'][$ptcid]['taxSummary']['BaseFareAmtInclTax'];
                            if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                                foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                                    if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                        $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                                    } else {                                        
                                        if(isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                            $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                        else
                                            $reformat='Other';
                                    }
                                    if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                        $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                                    } else {
                                        $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                                    }
                                }
                            } else {//only one tax
                                if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                                    $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                                } else {
                                    if(isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                            $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                                    else
                                            $reformat='Other';
                                }
                                if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                                } else {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                                }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            }
                        }
                        $firstRound = false;
                    } else { //only one fare info
                        $fares = $fareinfos;
//                    \Utils::dbgYiiLog($fares);
                        $ptcid = $fares['@attributes']['PTCID'];
                        if (!$firstRound) {
                            if ((float) $out[$lfid]['passengers'][$ptcid]['taxSummary']['BaseFareAmtInclTax'] < (float) $fares['@attributes']['BaseFareAmtInclTax']) {
                                break;
                            }
                        }
                        $firstRound = false;
                        $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                        $lastTotal+=$out[$lfid]['passengers'][$ptcid]['taxSummary']['BaseFareAmtInclTax'];
                        if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                            foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                                if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                    $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                                } else {
                                    if(isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                            $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                    else
                                            $reformat='Other';
                                }
                                if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                                } else {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                                }
                            }
                        } else {//only one tax
                            if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                                $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                            } else {
                                if(isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                    $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                                else
                                    $reformat='Other';
                            }
                            if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            } else {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        }
                    }
                }
            } else { //only one fare type
                $fareinfos = $segment['FareTypes']['FareType']['FareInfos']['FareInfo'];

                if (isset($fareinfos[0])) { //more than one fare info
                    foreach ($fareinfos as $fares) {
//                    \Utils::dbgYiiLog($fares);
                        $ptcid = $fares['@attributes']['PTCID'];
                        $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                        if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                            foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                                if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                    $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                                } else {
                                    if(isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                        $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                    else
                                        $reformat='Other';
                                }
                                if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                                } else {
                                    $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                                }
                            }
                        } else {//only one tax
                            if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                                $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                            } else {
                                if(isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                    $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                                else
                                    $reformat='Other';
                            }
                            if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            } else {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                            }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        }
                    }
                } else { //only one fare info
                    $fares = $fareinfos;
//                    \Utils::dbgYiiLog($fares);
                    $ptcid = $fares['@attributes']['PTCID'];
                    $out[$lfid]['passengers'][$ptcid]['taxSummary'] = $fares['@attributes'];
                    if (isset($fares['ApplicableTaxDetails']['ApplicableTax'][0]['@attributes'])) { //more than one taxes
                        foreach ($fares['ApplicableTaxDetails']['ApplicableTax'] as $tax) {
                            if (isset(self::$taxesReformat[$tax['@attributes']['TaxID']])) {
                                $reformat = self::$taxesReformat[$tax['@attributes']['TaxID']];
                            } else {
                                if(isset(self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']]))
                                    $reformat = self::$taxCodes[$taxInfo[$tax['@attributes']['TaxID']]['TaxCode']];
                                else
                                    $reformat='Other';
                            }
                            if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $tax['@attributes']['Amt'];
                            } else {
                                $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $tax['@attributes']['Amt'];
                            }
                        }
                    } else {//only one tax
                        if (isset(self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']])) {
                            $reformat = self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']];
                        } else {
                            if(isset(self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']]))
                                $reformat = self::$taxCodes[$taxInfo[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]['TaxCode']];
                            else
                                $reformat='Other';
                        }
                        if (isset($out[$lfid]['passengers'][$ptcid]['taxes'][$reformat])) {
                            $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] += (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        } else {
                            $out[$lfid]['passengers'][$ptcid]['taxes'][$reformat] = (float) $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                        }
//                        $out[$lfid]['passengers'][$ptcid]['taxes'][self::$taxesReformat[$fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['TaxID']]] = $fares['ApplicableTaxDetails']['ApplicableTax']['@attributes']['Amt'];
                    }
                }
            }
        }
        return $out;
    }

}
class LoginTravelAgent{
 public   $SecurityGUID=null;
 public   $IATANumber=null;
 public   $UserName=null;
 public   $Password=null;
}
?>