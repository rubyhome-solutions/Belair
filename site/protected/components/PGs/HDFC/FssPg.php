<?php

namespace application\components\PGs\HDFC;

/**
 * Payment Gateway Services
 * TranPortal 3D Secure (VbV Merchant Hosted)
 *
 * @author Boxx
 */
class FssPg {

    /**
     * Tranportal ID provided by the bank to merchant
     * Also known as terminal ID
     * @var string
     */
    private $id;

    /**
     * Tranportal password provided by the bank to merchant
     * @var string
     */
    private $password;
    private $card;
    private $cvv2;

    /**
     * Customer Card expiry year value in YYYY format
     * @var string
     */
    private $expyear;

    /**
     * Customer Card expiry Month value in MM format
     * @var string
     */
    private $expmonth;

    /**
     * Action Code of the transaction, this refers to type of transaction. Action Code 1 stands of
     * Purchase transaction and Action code 4 stands for Authorization (pre-auth). Merchant should
     * confirm from Bank action code enabled for the merchant by the bank
     * @var int
     */
    private $action = 4;

    const ACTION_PURCHASE = 1;
    const ACTION_REFUND = 2;
    const ACTION_AUTHENTICATE = 4;
    const ACTION_CAPTURE = 5;
    const ACTION_INQUIRE = 8;

    /**
     * The transaction amout with decimals like 325.15
     * @var float
     */
    private $amt;

    /**
     * Currency code of the transaction. By default INR i.e. 356
     * If merchant wishes to do multiple currency code transaction, merchant
     * needs to check with bank team the available currency code
     * @var int
     */
    private $currencycode = 356;
    private $member;
    private $trackid;
//    public $udf1;
    private $verifyEnrolmentUrl;
    private $notEnrolledUrl;
    private $enrolledUrl;

    /**
     * Where to send the response from bank 3D authentication
     * @var string
     */
    private $termURL;
    private $merchantResponseUrl;
    private $merchantErrorUrl;

    /**
     * The transaction that is the base for the payment
     * @var \PayGateLog
     */
    private $pgl;

    /**
     * Create payment via HDFC PG
     * @param \PayGateLog $pgl
     * @param \Cc $cc
     */
    public function __construct(\PayGateLog $pgl, \Cc $cc) {
        $this->pgl = $pgl;
        $this->trackid = $pgl->id;
        $this->termURL = \Yii::app()->request->hostInfo . '/payGate/hdfc/' . $this->trackid;
        $this->merchantResponseUrl = \Yii::app()->request->hostInfo . '/payGate/hdfcRupay/' . $this->trackid;
        $this->merchantErrorUrl = \Yii::app()->request->hostInfo . '/payGate/hdfcRupay/'. $this->trackid;
        $pg = \PaymentGateway::model()->findByPk($pgl->pg_id);
        /* @var $pg \PaymentGateway */
        $this->id = $pg->salt;
        $this->password = $pg->password;
        $this->verifyEnrolmentUrl = $pg->base_url;
        $this->notEnrolledUrl = $pg->api_url;
        $this->enrolledUrl = $pg->access_code;
        $this->amt = $pgl->amount + $pgl->convince_fee;
        $this->card = \Cc::decode($cc->number);
        $this->cvv2 = $cc->code;
        $this->member = $cc->name;
        $this->action = ($cc->type_id == \CcType::TYPE_RUPAY)?1:self::ACTION_AUTHENTICATE;
        $this->expmonth = substr($cc->exp_date, 5, 2);
        $this->expyear = substr($cc->exp_date, 0, 4);
    }

    /**
     * Authorize a transaction and update the PayGateLog object
     * @return boolean TRUE on success or string with the error
     */
    function authorize() {
        if (!$this->card) {
            return ['error' => 'The CC or the PGL are not defined'];
        }        
        set_time_limit(65);
        //$this->action = self::ACTION_AUTHENTICATE;
        $data = [
            'id' => $this->id,
            'password' => $this->password,
            'card' => $this->card,
            'cvv2' => $this->cvv2,
            'expyear' => $this->expyear,
            'expmonth' => $this->expmonth,
            'action' => $this->action,
            'amt' => $this->amt,
            'currencycode' => $this->currencycode,
            'member' => $this->member,
            'trackid' => $this->trackid,
            'merchantResponseUrl' => $this->merchantResponseUrl,
            'merchantErrorUrl' => $this->merchantErrorUrl
        ];
        $content = self::array2xml($data);
        $res = \Utils::curl($this->verifyEnrolmentUrl, $content);
        if (!empty($res['error'])) {
            $error = $res['error'];
        } elseif (strstr(strtoupper($res['result']), '<TITLE>SERVICE UNAVAILABLE</TITLE>')) {
//            $response = new \stdClass;
//            $response->error_text = 'The Payment Gateway is not available at the moment. Please, try to pay again after 5min!';
            $error = 'The Payment Gateway is not available at the moment. Please, try to pay again after 5min!';
        } else {
            libxml_use_internal_errors(true);
            $response = simplexml_load_string("<body>" . self::clearXml($res['result']) . "</body>");
            if ($response === false) {
                \Utils::dbgYiiLog([
                    'errors' => libxml_get_errors(),
                    'content cleared' => self::clearXml($res['result']),
                    'content' => $res['result']
                ]);
                $response = new \stdClass;
                $response->error_text = 'XML parsing error - check the logs.';
            }
            $fssAuthResponse['verifyEnrolmentUrlResp'] = $response;
            //$this->pgl->addRawResponse('verifyEnrolmentUrl', $response);
            
            // Is there a transaction error
            if (!empty($response->error_text)) {
                $error = (string) $response->error_text;
            }
        }
     
        // We have errors
        if (isset($error)) {
            $fssAuthResponse['ErrorResp'] = $error;
            $this->pgl->setRawResponse($fssAuthResponse);
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->action_id = \TrAction::ACTION_SENT;
            $this->pgl->error = $error;
            $this->pgl->reason = $error;
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->update();
            return ['error' => $error];
        }
         
        // Enrollmet procedure
        if ($response->result == 'ENROLLED') {
            // Return the info, so the client browser can be redirected
            $fssAuthResponse['ENROLLED'] = $response;
            $this->pgl->setRawResponse($fssAuthResponse);
            $this->pgl->update();
            return [
                'url' => (string) $response->url,
                'outParams' => [
                    'PaReq' => (string) $response->PAReq,
                    'MD' => (string) $response->paymentid,
//                    'trackid' => (string) $response->PAReq,
                    'TermUrl' => (string) $this->termURL,
                ]
            ];
        } elseif ($response->result == 'NOT ENROLLED') {
            $content = self::array2xml([
                        'id' => $this->id,
                        'password' => $this->password,
                        'card' => $this->card,
                        'cvv2' => $this->cvv2,
                        'expyear' => $this->expyear,
                        'expmonth' => $this->expmonth,
                        'action' => $this->action,
                        'amt' => $this->amt,
                        'currencycode' => $this->currencycode,
                        'member' => $this->member,
                        'trackid' => $this->trackid,
                        'eci' => empty($response->eci) ? 7 : (string) $response->eci
            ]);
            $res = \Utils::curl($this->notEnrolledUrl, $content);
            unset($error);
            if (!empty($res['error'])) {
                $error = $res['error'];
            } else {
                $response = simplexml_load_string("<body>" . $res['result'] . "</body>");
                $fssAuthResponse['NOT_ENROLLED_RESP'] = $response;
                //$this->pgl->addRawResponse('Not-Enrolled', $response);
                // If there is a transaction error
                if (!empty($response->error_text)) {
                    $error = (string) $response->error_text;
                }
                // If there is a decline error
                if (!empty($response->payid) && $response->payid == '-1') {
                    $error = (string) $response->result;
                }
            }

            // We have errors
            if (isset($error)) {
                $fssAuthResponse['Error'] = $error;
                $this->pgl->setRawResponse($fssAuthResponse);                
                $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
                $this->pgl->action_id = \TrAction::ACTION_SENT;
                $this->pgl->pg_type = 'HDFC';
                $this->pgl->error = $error;
                $this->pgl->reason = $error;
                $this->pgl->updated = date(DATETIME_FORMAT);
                $this->pgl->update();
                return ['error' => $error];
            }

            // Everything is OK - mark the transaction as success
            $this->pgl->setRawResponse($fssAuthResponse);             
            $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
            $this->pgl->pg_type = 'HDFC';
            $this->pgl->reason = (string) $response->result;
            $this->pgl->bank_ref = (string) $response->ref;
            $this->pgl->request_id = (string) $response->tranid;
            $this->pgl->unmapped_status = (string) $response->auth;
            $this->pgl->error = null;
            $this->pgl->update();

            // Forward to the final payment registration page
            return [
                'url' => $this->termURL,
                'outParams' => null
            ];
        } elseif ($response->result == 'INITIALIZED') {
            $this->pgl->setRawResponse($fssAuthResponse); 
            $this->pgl->update();
            return [
                'url' => (string) $response->url,
                'outParams' => [
                    'PaymentID' => (string) $response->paymentid
                ]
            ];          
            
        }else {
            // Neighter ENROLLED, or NOT ENROLLED - This is a error condition and the transaction has to stop here
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->action_id = \TrAction::ACTION_SENT;
            $this->pgl->error = (string) $response->result;
            $this->pgl->reason = (string) $response->result;
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->update();
            return ['error' => (string) $response->result];
        }
    }

    function capture() {
        $content = self::array2xml([
                    'id' => $this->id,
                    'password' => $this->password,
                    'action' => self::ACTION_CAPTURE,
                    'amt' => $this->amt,
                    'currencycode' => $this->currencycode,
                    'trackid' => $this->pgl->hash_our,
                    'transid' => $this->pgl->token,
                    'member' => 'ABCD'
        ]);
        $res = \Utils::curl($this->notEnrolledUrl, $content);
        unset($error);
        if (!empty($res['error'])) {
            $error = $res['error'];
        } elseif (strstr(strtoupper($res['result']), '<TITLE>SERVICE UNAVAILABLE</TITLE>')) {
//            $response = new \stdClass;
//            $response->error_text = 'The Payment Gateway is not available at the moment. Please, try to pay again after 5min!';
            $error = 'The Payment Gateway is not available at the moment. Please, try to pay again after 5min!';
        } else {
            libxml_use_internal_errors(true);
            $response = simplexml_load_string("<body>" . self::clearXml($res['result']) . "</body>");
            if ($response === false) {
                \Utils::dbgYiiLog([
                    'errors' => libxml_get_errors(),
                    'content cleared' => self::clearXml($res['result']),
                    'content' => $res['result']
                ]);
                $response = new \stdClass;
                $response->result = 'XML parsing error - check the logs.';
            }

            $fssAuthResponse['CAPTURE_RESPONSE'] = $response;
            // Is there a transaction error
            if (!empty($response->error_code_tag)) {
                $error = (string) $response->result;
            }
            if ($response->result != 'CAPTURED') {
                $error = (string) $response->result;
            }
        }

        if (isset($error)) {    // error
            $fssAuthResponse['CAPTURE_ERROR'] = $error;
            $this->pgl->setRawResponse($fssAuthResponse);
            $this->pgl->update();               
            return ['error' => $error];
        }
        // Capture successful
        $this->pgl->setRawResponse($fssAuthResponse);
        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->pg_type = 'HDFC';
        $this->pgl->reason = (string) $response->result;
        $this->pgl->bank_ref = (string) $response->ref;
        $this->pgl->request_id = (string) $response->tranid;
        $this->pgl->unmapped_status = (string) $response->auth;
        $this->pgl->error = null;
        $this->pgl->update();
        $this->pgl->addCaptureCartNote();

        return ['message' => 'The transaction is captured successfully'];
//        \Utils::dbgYiiLog($res['result']);
    }

    function refresh() {
        $content = self::array2xml([
                    'id' => $this->id,
                    'password' => $this->password,
                    'action' => self::ACTION_INQUIRE,
                    'amt' => number_format((float)$this->amt, 2, '.', ''),
                    'currencycode' => $this->currencycode,
                    'trackid' => $this->trackid,
                    'transid' => $this->pgl->request_id,
                    'udf1'=>'',
                    'udf2'=>'',
                    'udf3'=>'',
                    'udf4'=>'',
                    'udf5'=>'TrackID'
        ]);
        $res = \Utils::curl($this->notEnrolledUrl, $content);
        unset($error);
        if (!empty($res['error'])) {
            $error = $res['error'];
        } else {
            $response = simplexml_load_string("<body>" . $res['result'] . "</body>");
            // Is there a transaction error
            if (!empty($response->error_code_tag)) {
                $error = (string) $response->result;
            }
        }

        if (isset($error)) {    // error
            $fssResponse['REFRESH_ERROR'] = $error;
            $this->pgl->setRawResponse($fssResponse);     
            $this->pgl->update();
            return ['error' => $error];
        }

        //\Utils::dbgYiiLog($res['result']);
        // Stop here for now - HDFC do no need refresh anyway
        return ['message' => 'So far so good, but this should not happen! Check the logs'];

        // Refreshing the PayGateLog data with the new info
        $fssAuthResponse['REFRESH_RESPONSE'] = $response;
        $this->pgl->setRawResponse($fssAuthResponse);
        //$this->pgl->addRawResponse('Refresh', $response);
        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->bank_ref = $res->bank_ref_num;
        $this->pgl->hash_response = isset($res->hash) ? $res->hash : null;
        $this->pgl->unmapped_status = $res->unmappedstatus;
        $oldStatus = $this->pgl->status_id;
        $this->pgl->status_id = $res->status == "success" ? \TrStatus::STATUS_SUCCESS : \TrStatus::STATUS_FAILURE;
        $this->pgl->update();
        if ($oldStatus === \TrStatus::STATUS_PENDING && $this->pgl->status_id === \TrStatus::STATUS_SUCCESS) {
            // Register new payment
            $payment = $this->pgl->registerNewPayment(\TransferType::CC_DEPOSIT, "Bank code: {$this->pgl->pg_type} , Bank reference: {$this->pgl->bank_ref}");
            \Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            return [
                'message' => "Congratulations the payment was successful!",
                'url' => "/payment/view/{$payment->id}"
            ];
        }
        return ['message' => 'Refresh succesful'];
    }

    function refund() {
        $content = self::array2xml([
                    'id' => $this->id,
                    'password' => $this->password,
                    'action' => self::ACTION_REFUND,
                    'amt' => $this->amt,
                    'currencycode' => $this->currencycode,
                    'trackid' => $this->pgl->hash_our,
                    'transid' => $this->pgl->token,
                    'member' => 'ABCD'
        ]);
        $res = \Utils::curl($this->notEnrolledUrl, $content);
        unset($error);
        if (!empty($res['error'])) {
            $error = $res['error'];
        } else {
            $response = simplexml_load_string("<body>" . $res['result'] . "</body>");
            //$this->pgl->addRawResponse('Refund', $response);
            // Is there a transaction error
            if (!empty($response->error_code_tag)) {
                $error = (string) $response->result;
            }
            if ($response->result != 'CAPTURED') {
                $error = (string) $response->result;
            }
        }

        if (isset($error)) {    // error
            $fssResponse['REFUND_ERROR'] = $error;
            $this->pgl->setRawResponse($fssResponse);     
            $this->pgl->update();            
            return $error;
        }
        // Capture successful
        $fssAuthResponse['REFUND_RESPONSE'] = $response;
        $this->pgl->setRawResponse($fssAuthResponse);        
        $this->pgl->updated = date(DATETIME_FORMAT);
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->pg_type = 'HDFC';
        $this->pgl->reason = (string) $response->result;
        $this->pgl->bank_ref = (string) $response->ref;
        $this->pgl->request_id = (string) $response->tranid;
        $this->pgl->unmapped_status = (string) $response->auth;
        $this->pgl->error = null;
        $this->pgl->update();
        $this->pgl->registerNewPayment(\TransferType::FUND_RECALL, "Refund with HDFC, Bank reference: {$this->pgl->bank_ref}");
        return 'Refund was executed successfully';
//        \Utils::dbgYiiLog($res['result']);
    }

    /**
     * Very simple and stupid single dimension array to XML serialization
     * @param array $arr
     * @return string
     */
    static function array2xml($arr) {
        $out = '';
        foreach ($arr as $key => $value) {
            $out .= "<$key>$value</$key>";
        }
        return $out;
    }

    function authorizeSecondPart() {
        // Do nothing for transactions that are succesful  - this is the NOT ENROLLED case
        if ($this->pgl->reason === 'APPROVED') {
            $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
            $this->pgl->update(['status_id']);
            return;
        }
        set_time_limit(65);
        $fssResponse['AUTH_SECOND_POST_DATA'] = $_POST; 
        //$this->pgl->addRawResponse('PaRes Received', $_POST);
        $this->pgl->updated = date(DATETIME_FORMAT);
        $content = self::array2xml([
                    'PARes' => \Yii::app()->request->getPost('PaRes'),
                    'paymentid' => \Yii::app()->request->getPost('MD'),
                    'id' => $this->id,
                    'password' => $this->password
        ]);

        $res = \Utils::curl($this->enrolledUrl, $content);

        if (!empty($res['error'])) {
            $error = $res['error'];
            $fssResponse['AUTH_SECOND_RESPONSE_ERR'] = $error;
                      
        } else {
            libxml_use_internal_errors(true);
            $response = simplexml_load_string("<body>" . self::clearXml($res['result']) . "</body>");
            if ($response === false) {
                \Utils::dbgYiiLog([
                    'errors' => libxml_get_errors(),
                    'content cleared' => self::clearXml($res['result']),
                    'content' => $res['result']
                ]);
                $response = new \stdClass;
                $response->error_text = 'XML parsing error - check the logs.';
            }
            $fssResponse['FINAL_ENROLLED_RESPONSE'] = $response;         
           // $this->pgl->addRawResponse('Final ENROLLED response', $response);
            // Is there a transaction error
            if (!empty($response->error_text)) {
                $error = (string) $response->error_text;
            }
        }

        // The transaction was not approved
        if (isset($response->result) && $response->result != 'APPROVED') {
            $error = (string) $response->result;
        }
        
        // No result attribute case. Execute only when the error is not set in advance
        if (!isset($error) && !isset($response->result)) {
            $error = 'EMPTY';
        }

        // We have errors - mark the PayGateLog object and stop here
        if (isset($error)) {
            $fssResponse['AUTH_SECOND_RESPONSE_ERR_TEXT'] = $error;
            $this->pgl->setRawResponse($fssResponse); 
            $this->pgl->status_id = \TrStatus::STATUS_FAILURE;
            $this->pgl->action_id = \TrAction::ACTION_SENT;
            $this->pgl->error = $error;
            $this->pgl->reason = $error;
            $this->pgl->updated = date(DATETIME_FORMAT);
            $this->pgl->update();
            return ['error' => $error];
        }

        // Everything is OK - mark the transaction as success
        $this->pgl->setRawResponse($fssResponse); 
        $this->pgl->status_id = \TrStatus::STATUS_SUCCESS;
        $this->pgl->pg_type = 'HDFC';
        $this->pgl->reason = (string) $response->result;
        $this->pgl->bank_ref = (string) $response->ref;
        $this->pgl->request_id = (string) $response->tranid;
        $this->pgl->unmapped_status = (string) $response->auth;
        $this->pgl->error = null;
        $this->pgl->update();

//            \Utils::dbgYiiLog(['PAReq' => (string) $response->PAReq]);
    }

    static function clearXml($str) {
        return str_replace([
            '<?xml version="1.0" encoding="UTF-8"?>',
            '&',
                ], [
            '',
            '&amp;'
                ], $str);
    }

    function getRupayEnquiry($data) {
        $content = self::array2xml([
                    'id' => $this->id,
                    'password' => $this->password,
                    'action' => self::ACTION_INQUIRE,
                    'amt' => number_format((float)$this->amt, 2, '.', ''),
                    'currencycode' => $this->currencycode,
                    'trackid' => $this->trackid,
                    'transid' => isset($data['tranid'])?$data['tranid']:'',
                    'member'=>$this->member,
                    'udf1'=>'',
                    'udf2'=>'',
                    'udf3'=>'',
                    'udf4'=>'',
                    'udf5'=>'TrackID'
        ]);
        $res = \Utils::curl($this->notEnrolledUrl, $content);
        $response = array();
        if (!empty($res['error'])) {
            $error = $res['error'];
            $EnqRupayResponse['ENQ_ERROR'] = $res;   
        } else {
            $response = simplexml_load_string("<body>" . $res['result'] . "</body>");
            $EnqRupayResponse['ENQ_RESPONSE'] = $response;
            // Is there a transaction error
            if (!empty($response->error_code_tag)) {
                $error = (string) $response->result;
            }
        }

        if (isset($error)) {    // error
            $EnqRupayResponse['ENQ_RESPONSE_ERROR'] = $error;
            $this->pgl->setRawResponse($EnqRupayResponse);
            $this->pgl->update();
            return ['error' => $error,'response'=>''];
        }
        $this->pgl->setRawResponse($EnqRupayResponse);  
        $this->pgl->update();
        return ['response'=>$response,'error'=>null] ;
    }    
}
