<?php

/**
 * Sms class.
 * @extends CApplicationComponent
 */
class Sms extends CApplicationComponent {

    private $username = 'belair';
    private $password = 'belair';

    /**
     * SMS send function.
     * 
     * @access public
     * @param string $number Mobile number
     * @param string $text SMS text
     * @param string $sender Possible options are Travel|Belair
     * @return array With status and message attributes
     */
    public function send($number, $text, $sender = 'Travel') {
        $number = preg_replace('/[^0-9.]+/', '', $number);
        // Testing
//        echo \Utils::dbg($text); return;
        $text = urlencode($text);

        $response = $this->request("smsfrom={$sender}&receiver={$number}&content={$text}");
        if ($response[0] == 'ACCEPTED') {
            return ['status' => 1, 'message' => $response[1]];
        } else {
            return ['status' => 0, 'message' => isset($response[1]) ? $response[1] : 'No connection'];
        }
    }
    
    public function status($id) {
        return $this->request("status=getstatus&id=$id");
    }

    /**
     * checkBalance function.
     * 
     * @access public
     * @return void
     */
    public function checkBalance() {
        $response = $this->request("status=getbalance");
        if ($response[0] == 'ACCEPTED') {
            return ['status' => 1, 'balance' => $response[2]];
        } else {
            return ['status' => 0, 'message' => isset($response[1]) ? $response[1] : 'No connection'];
        }
    }

    private function request($params) {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, "http://websms.one97.net/sendsms/sms_request.php?username={$this->username}&password={$this->password}&$params");
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = curl_exec($curl);
        curl_close($curl);
//        \Utils::dbgYiiLog($response);
        return explode(',', $response);
    }

}

?>
