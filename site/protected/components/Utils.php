<?php

\Yii::setPathOfAlias('libphonenumber', \Yii::getPathOfAlias('application.vendor.libphonenumber'));

class Utils {

    const ACTIVE_COMPANY = 'activeCompany';
    const DOMESTIC_COUNTRY_CODE = 'IN';
    const DOMESTIC_COUNTRY_NAME = 'India';
    const DEFAULT_CITY = 'New Delhi';
    const DEFAULT_CITY_ID = 1000021;
    const DEFAULT_STATE_CODE = 'DE';
    const DEFAULT_STATE_NAME = 'Delhi';
    const SUPPORT_EMAIL = 'support@belair.in';
    const CHEAPTICKET_TICKET_EMAIL = 'ticket@cheapticket.in';
    const CHEAPTICKETS24_TICKET_EMAIL = 'ticket@cheapticket.in';
    const CHEAPTICKET_TICKET_EMAIL_WITH_NAME = 'CheapTicket.in <ticket@cheapticket.in>';
    const CHEAPTICKETS24_TICKET_EMAIL_WITH_NAME = 'CheapTickets24.com <ticket@cheaptickets24.in>';
    const CHEAPTICKET_EMAIL = 'cs@cheapticket.in';
    const AIRTICKETINDIA_EMAIL = 'ticket@airticketsindia.com';
    const CHEAPTICKET_EMAIL_WITH_NAME = 'CheapTicket.in <cs@cheapticket.in>';
    const CHEAPTICKETS24_EMAIL_WITH_NAME = 'CheapTickets24.com <cs@cheaptickets24.in>';
    const AIRTICKETINDIA_EMAIL_WITH_NAME = 'Airticketsindia.com <ticket@airticketsindia.com>';
    const BELAIR_PHONE = '120-4887700';
    const PNR_AP_ELEMENT = 'CheapTicket.in 0120-4887777';
    const SERVICE_TAX = 0.0495;
    const TDS_DEFAULT = 0.1;
    const MESSAGE_URL = '/site/message';

    static $paxTypes = [
        \TravelerType::TRAVELER_ADULT => 'ADT',
//        \TravelerType::TRAVELER_CHILD => 'CH',
        \TravelerType::TRAVELER_CHILD => 'CHD',
        \TravelerType::TRAVELER_INFANT => 'INF',
    ];
    static $paxTypeIds = [
        'ADT' => \TravelerType::TRAVELER_ADULT,
        'CHD' => \TravelerType::TRAVELER_CHILD,
        'CH' => \TravelerType::TRAVELER_CHILD,
        'INF' => \TravelerType::TRAVELER_INFANT
    ];
    static $week_days = [
        1 => 'Monday',
        2 => 'Tuesday',
        3 => 'Wednesday',
        4 => 'Thursday',
        5 => 'Friday',
        6 => 'Saturday',
        7 => 'Sunday'
    ];

    /**
     * Send email
     * @param string $to Recepient email
     * @param string $content Message content
     * @param string $subject Message Subject
     * @param string $from From email, like support2@air.belair.in
     * @param string $fromName From name, like Belair
     * @return bool The result
     */
    static function sendMail($to, $content, $subject, $from = 'support2@air.belair.in', $fromName = 'Belair') {
        $headers = "From: $fromName <{$from}>\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        return mail($to, $subject, $content, $headers, '-f' . $from);
    }

    static function sendMailWithAttachment($file, $filename, $to, $from, $content, $subject, $fromemail = null, $bcc = null) {
        if (empty($file)) {
            return;
        }
        // encode data
        $attachment = chunk_split(base64_encode(file_get_contents($file)));

        // email stuff (change data below)
        $message = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
            "http://www.w3.org/TR/html4/loose.dtd">' . $content;

        // a random hash will be necessary to send mixed content
        $separator = md5(time());

        // carriage return type (we use a PHP end of line constant)
        $eol = PHP_EOL;


        // main header
        $headers = "From: " . $from . $eol;
        $headers .= "MIME-Version: 1.0" . $eol;
        $headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol;

        if (!empty($bcc)) {
            $headers .= "Bcc: " . $bcc . $eol;
        }
        // no more headers after this, we start the body! //

        $body = "--" . $separator . $eol;
        $body .= "Content-Type: text/html; charset=\"iso-8859-1\"" . $eol;
        $body .= "Content-Transfer-Encoding: 7bit" . $eol . $eol;
        $body .= $message . $eol;

        // message
//        $body .= "--".$separator.$eol;
//        $body .= "Content-Type: text/html; charset=\"iso-8859-1\"".$eol;
//        $body .= "Content-Transfer-Encoding: 8bit".$eol.$eol;
//        $body .= $message.$eol.$eol;
        // attachment
        $body .= "--" . $separator . $eol;
        $body .= "Content-Type: application/octet-stream; name=\"" . $filename . "\"" . $eol;
        $body .= "Content-Transfer-Encoding: base64" . $eol;
        $body .= "Content-Disposition: attachment; filename=\"" . $filename . "\"" . $eol . $eol;
        $body .= $attachment . $eol . $eol;
        $body .= "--" . $separator . "--";

        // send message
        mail($to, $subject, $body, $headers, $fromemail);
    }

    static function passCrypt($str) {
        $salt = '$2y$07$' . strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
        return crypt($str, $salt);
    }

    /**
     * Set HTTP header for json content type
     */
    static function jsonHeader() {
        header("Content-Type: application/json; charset: UTF-8");
    }

    /**
     * Output the $data as JSON and exit the application
     * @param mixed $data The object to be json encoded
     * @param int $code HTML response code
     */
    static function jsonResponse($data, $code = 200) {
        self::jsonHeader();
        http_response_code($code);

        echo json_encode($data);

        foreach (Yii::app()->log->routes as $route) {
            if ($route instanceof CWebLogRoute) {
                $route->enabled = false;
            }
        }

        Yii::app()->end();
    }

    static function finalMessage($msg) {
//        Yii::app()->session->add('htmlMessage', htmlentities($msg, ENT_QUOTES));
        Yii::app()->session->add('htmlMessage', $msg);
        Yii::app()->getRequest()->redirect('/site/message', true, 302);
    }

    /**
     * Return html formated help if the user is new (registered in the last 30 days) or if the $until date is not reached yet
     * @param string $msg The help message
     * @param date $until The date until the message showd be displayed for all users. Display always if null
     */
    static function helpMessage($msg, $until = null) {
        if ($until === null || strtotime($until) < time()) {
            return \TbHtml::alert(\TbHtml::ALERT_COLOR_INFO, "<b>HINT:</b> $msg", ['style' => 'max-width:800px;']);
        }
        return '';
    }

    /**
     * Send file with download headers to the browser
     * @param string $path Path to the localy stored file
     * @param string $filename The name of the file
     */
    static function sendFile($path, $filename) {
        if (file_exists($path)) {
            header('Content-Description: File Transfer');
//            header('Content-Type: application/octet-stream');
            header("Content-type: application/force-download");
            header('Content-Disposition: attachment; filename=' . str_replace(array(' ', "'", '&', '"', ',', '#'), '_', $filename));
            header('Content-Transfer-Encoding: binary');
            header('Expires: 0');
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public');
            header('Content-Length: ' . filesize($path));
            ob_clean();
            flush();
            readfile($path);
            Yii::app()->end();
        } else {
            Yii::log("File do not exsist: $path");
        }
    }

    /**
     * Send file with image headers to the browser
     * @param string $path Path to the localy stored file
     * @param string $filename The name of the file
     */
    static function sendImage($path, $filename) {
        if (file_exists($path)) {
            $file_extension = strtolower(strrchr($filename, "."));
            switch ($file_extension) {
                case ".gif": $ctype = "image/gif";
                    break;
                case ".png": $ctype = "image/png";
                    break;
                default:
                    $ctype = "image/jpg";
            }

            header("Content-type: $ctype");
            header('Content-Length: ' . filesize($path));
            ob_clean();
            flush();
            readfile($path);
            Yii::app()->end();
        } else {
            Yii::log("File do not exsist: $path => $filename");
        }
    }

    static function str2num($str) {
        return str_replace(array(',', '.00'), '', $str);
    }

    static function dmyyyy2yyyymd($str) {
        return preg_replace("!(\d+)/(\d+)/([0-9]{4})!", "$3-$2-$1", $str);
    }

    /**
     * Return the ID of the logged user, no matter if the user is doing emulation
     * @return integer The ID of the logged user
     */
    static function getLoggedUserId() {
        if (!Yii::app()->hasComponent('user')) {
            return false;
        }
        $emulationData = Yii::app()->user->getState('emulation');
        if (!empty($emulationData['id'])) {
            return (int) $emulationData['id'];
        } elseif (Yii::app()->hasProperty('user') && !isset(Yii::app()->user->id) && Yii::app()->user->hasState(self::ACTIVE_COMPANY)) {
            $data = Yii::app()->user->getState(self::ACTIVE_COMPANY);
            return isset($data['id']) ? $data['id'] : false;
        }
        return isset(Yii::app()->user->id) ? Yii::app()->user->id : false;
    }

    /**
     * Save the basic user and company info about the user
     * @param type $userId The ID of the user
     * @return boolean True if the state is set successfully
     */
    static function setActiveUserAndCompany($userId) {
        $model = Users::model()->findByPk((int) $userId);
        /* @var $model Users */
        if ($model && Yii::app()->hasProperty('user') && !$model->isStaff) {
            Yii::app()->user->setState(self::ACTIVE_COMPANY, array(
                'id' => $model->id,
                'name' => $model->name,
                'mobile' => $model->mobile,
                'companyId' => $model->user_info_id,
                'companyMobile' => $model->userInfo->user_type_id === UserType::clientB2C ? "=- B2C -=" : $model->userInfo->mobile,
                'companyName' => $model->userInfo->user_type_id === UserType::clientB2C ? "=- B2C -=" : $model->userInfo->name,
                'user_type_id' => $model->userInfo->user_type_id,
            ));
            $model->userInfo->setSessionLogo();
            $model->userInfo->setSessionPhone();
            $model->userInfo->setSessionFooter();
            return true;
        }

        return false;
    }

    /**
     * Get the active company id
     * @return boolean FALSE when the company ID is not available
     */
    static function getActiveCompanyId() {
        if (isset(Yii::app()->user->id)) {
            $model = Users::model()->findByPk(Yii::app()->user->id);
            if ($model->isStaff) {
                if (Yii::app()->user->hasState(self::ACTIVE_COMPANY)) {
                    $data = Yii::app()->user->getState(self::ACTIVE_COMPANY);
                    if (!empty($data['companyId'])) {
                        return $data['companyId'];
                    } else {    // There is no active company
                        return false;
                    }
                }
            } else {
                return $model->user_info_id;
            }
        } elseif (Yii::app()->hasProperty('user') && Yii::app()->user->hasState(self::ACTIVE_COMPANY)) {
            $data = Yii::app()->user->getState(self::ACTIVE_COMPANY);
            return isset($data['companyId']) ? $data['companyId'] : false;
        }

        return false;
    }

    /**
     * Get the active user_type_id
     * @return boolean FALSE when the user_type_id is not available
     */
    static function getActiveUserTypeId() {
        if (isset(Yii::app()->user->id)) {
            $model = Users::model()->findByPk(Yii::app()->user->id);
            if ($model->isStaff) {
                if (Yii::app()->user->hasState(self::ACTIVE_COMPANY)) {
                    $data = Yii::app()->user->getState(self::ACTIVE_COMPANY);
                    if (!empty($data['user_type_id'])) {
                        return $data['user_type_id'];
                    } else {    // There is no active user
                        return false;
                    }
                }
            } else {
                return $model->userInfo->user_type_id;
            }
        }

        return false;
    }

    /**
     * Get the active user id
     * @return boolean FALSE when the user ID is not available
     */
    static function getActiveUserId() {
        if (\Yii::app()->hasProperty('user') && isset(Yii::app()->user->id)) {
            $model = Users::model()->findByPk(Yii::app()->user->id);
            if ($model->isStaff) {
                if (Yii::app()->user->hasState(self::ACTIVE_COMPANY)) {
                    $data = Yii::app()->user->getState(self::ACTIVE_COMPANY);
                    return $data['id'] ? : null;
                }
            } else {    // regular user - not staff
                return $model->id;
            }
        } elseif (Yii::app()->hasProperty('user') && Yii::app()->user->hasState(self::ACTIVE_COMPANY)) {
            $data = Yii::app()->user->getState(self::ACTIVE_COMPANY);
            return isset($data['id']) ? $data['id'] : null;
        }

        return false;
    }

    /**
     * Get the button for the active company
     * @return string The widget content
     */
    static function widgetActiveUserAndCompany() {
        if (Yii::app()->user->hasState(self::ACTIVE_COMPANY) && Authorization::getIsStaffLogged()) {
            $data = Yii::app()->user->getState(self::ACTIVE_COMPANY);
            $out = "<a href='/users/manage?selectedvalue={$data['id']}' class='btn btn-info' id='activeCompany' style='max-width: 20%; overflow: hidden; padding: 0; float:right;font-style:italic;' data-toggle='tooltip' title='
                <table>
                <tr><th colspan=\"2\">Active Selection:</th></tr>
                <tr><td>Company&nbsp;&nbsp;</td><td>" . CHtml::encode($data['companyName']) . "</td></tr>
                <tr><td>Mobile</td><td>{$data['companyMobile']}</td></tr>
                <tr><td>User</td><td>" . CHtml::encode($data['name']) . "</td></tr>
                <tr><td>Mobile</td><td>{$data['mobile']}</td></tr>
                </table>'>
                    <table>
                        <tr>
                            <td rowspan='2'><img src='/img/businessman_32.png' /></td>
                            <td>" . CHtml::encode(Utils::truncateStr($data['companyName'], 16)) . "</td>
                        </tr>
                        <tr><td>" . CHtml::encode(Utils::truncateStr($data['name'], 16)) . "</td></tr>
                    </table>
                </a>
                <script>
                    $(function() {
                        $('#activeCompany').tooltip({html: true, placement: 'left'});
                    });
                </script>
                <style>
                    .tooltip-inner {max-width: 400px;}
                    .tooltip-inner td {text-align: left;}
                </style>";
            return $out;
        }

        // Return empty string if no active company is found
        return '';
    }

    static function truncateStr($str, $charNum = 16) {
        if (strlen($str) > $charNum)
            return substr($str, 0, $charNum - 4) . "...";
        return $str;
    }

    /**
     * Return string with print_r inside PRE tags for the parameter
     * @param mixed $param
     */
    static function dbg($param) {
        if (YII_DEBUG || \Yii::app()->request->userHostAddress === '127.0.0.1') {
            return "<pre>" . htmlentities(print_r($param, true)) . "</pre>";
        }
        return false;   // Do not print debug info in production enviroments
    }

    /**
     * Do a print_r into Yii log for the parameter
     * @param mixed $param
     */
    static function dbgYiiLog($param) {
        \Yii::log(print_r($param, true));
    }

    static function numberToWords($number) {

        $hyphen = '-';
        $conjunction = ' and ';
        $separator = ', ';
        $negative = 'negative ';
        $decimal = ' point ';
        $dictionary = array(
            0 => 'zero',
            1 => 'one',
            2 => 'two',
            3 => 'three',
            4 => 'four',
            5 => 'five',
            6 => 'six',
            7 => 'seven',
            8 => 'eight',
            9 => 'nine',
            10 => 'ten',
            11 => 'eleven',
            12 => 'twelve',
            13 => 'thirteen',
            14 => 'fourteen',
            15 => 'fifteen',
            16 => 'sixteen',
            17 => 'seventeen',
            18 => 'eighteen',
            19 => 'nineteen',
            20 => 'twenty',
            30 => 'thirty',
            40 => 'fourty',
            50 => 'fifty',
            60 => 'sixty',
            70 => 'seventy',
            80 => 'eighty',
            90 => 'ninety',
            100 => 'hundred',
            1000 => 'thousand',
            1000000 => 'million',
            1000000000 => 'billion',
            1000000000000 => 'trillion',
            1000000000000000 => 'quadrillion',
            1000000000000000000 => 'quintillion'
        );

        if (!is_numeric($number)) {
            return false;
        }

        if (($number >= 0 && (int) $number < 0) || (int) $number < 0 - PHP_INT_MAX) {
            // overflow
            trigger_error(
                'convert_number_to_words only accepts numbers between -' . PHP_INT_MAX . ' and ' . PHP_INT_MAX, E_USER_WARNING
            );
            return false;
        }

        if ($number < 0) {
            return $negative . self::numberToWords(abs($number));
        }

        $string = $fraction = null;

        if (strpos($number, '.') !== false) {
            list($number, $fraction) = explode('.', $number);
        }

        switch (true) {
            case $number < 21:
                $string = $dictionary[$number];
                break;
            case $number < 100:
                $tens = ((int) ($number / 10)) * 10;
                $units = $number % 10;
                $string = $dictionary[$tens];
                if ($units) {
                    $string .= $hyphen . $dictionary[$units];
                }
                break;
            case $number < 1000:
                $hundreds = $number / 100;
                $remainder = $number % 100;
                $string = $dictionary[$hundreds] . ' ' . $dictionary[100];
                if ($remainder) {
                    $string .= $conjunction . self::numberToWords($remainder);
                }
                break;
            default:
                $baseUnit = pow(1000, floor(log($number, 1000)));
                $numBaseUnits = (int) ($number / $baseUnit);
                $remainder = $number % $baseUnit;
                $string = self::numberToWords($numBaseUnits) . ' ' . $dictionary[$baseUnit];
                if ($remainder) {
                    $string .= $remainder < 100 ? $conjunction : $separator;
                    $string .= self::numberToWords($remainder);
                }
                break;
        }

        if (null !== $fraction && is_numeric($fraction)) {
            $string .= $decimal;
            $words = array();
            foreach (str_split((string) $fraction) as $number) {
                $words[] = $dictionary[$number];
            }
            $string .= implode(' ', $words);
        }

        return $string;
    }

    static function pdfStyle() {
        if (isset($_POST['pdf']))
            echo "div#mainmenu, ul.breadcrumb, a#activeCompany, .noprint {display: none !important;}
                    body {
                        width: 210mm;
                        font-size: 12px;
                    }";
    }

    public static function routesSort($a, $b) {
        return $a->departure_ts < $b->departure_ts ? -1 : 1;
    }

    public static function cutMilliseconds($str) {
        return substr($str, 0, strpos($str, '.') ? : 19);
    }

    public static function cutSecondsAndMilliseconds($str) {
        return substr($str, 0, strrpos($str, ':'));
    }

    /**
     * Cut the seconds from the timestamp string. should be zeroes, like :00
     * @param string $str
     * @return string
     */
    public static function cutSeconds($str) {
        $str = str_replace('T', ' ', $str);
        return substr($str, 0, strrpos($str, ':00'));
    }

    /**
     * Encrypt a string
     * @param string $str The String to be encrypted
     * @return string
     */
    public static function encrypt($str) {
        if (PHP_OS == 'Linux')
            $key = exec('/sbin/blkid');
        else
            $key = file_get_contents('e:\tmp\belair\blkid');

        return base64_encode(mcrypt_cbc(MCRYPT_RIJNDAEL_128, substr($key, 32, 32), $str, MCRYPT_ENCRYPT, substr($key, 51, 16)));
    }

    /**
     * Decrypt a string
     * @param string $str The string to be decrypted
     * @return string
     */
    public static function decrypt($str) {
        if (PHP_OS == 'Linux')
            $key = exec('/sbin/blkid');
        else
            $key = file_get_contents('e:\tmp\belair\blkid');

        return rtrim(mcrypt_cbc(MCRYPT_RIJNDAEL_128, substr($key, 32, 32), base64_decode($str), MCRYPT_DECRYPT, substr($key, 51, 16)), "\0");
    }

    /**
     * Save AirSource credentials
     * @param integer $id AirSource ID
     * @param array $credentials The artay of credentials to be saved
     */
    static function saveCredentials($id, $credentials) {
        $str = self::encrypt(json_encode($credentials, JSON_NUMERIC_CHECK));
        AirSource::model()->updateByPk($id, ['credentials' => $str]);
    }

    /**
     * Decrypt AirSource credentials
     * @param string $str encrypted credentials
     * @return array Credentials
     */
    static function decryptCredentials($str) {
        return json_decode(self::decrypt($str), true);
    }

    static function soapDebug($client) {
        if (!YII_DEBUG)
            return false;   // Do not print debug info in production enviroments
        $requestHeaders = $client->__getLastRequestHeaders();
        $request = self::formatXmlString($client->__getLastRequest());
        $responseHeaders = $client->__getLastResponseHeaders();
        $response = self::formatXmlString($client->__getLastResponse());

        echo '<code>' . nl2br(htmlspecialchars($requestHeaders, true)) . '</code>';
        echo highlight_string($request, true) . "<br/>\n";

        echo '<code>' . nl2br(htmlspecialchars($responseHeaders, true)) . '</code>' . "<br/>\n";
        echo highlight_string($response, true) . "<br/>\n";
    }

    static function soapLogDebug(SoapClient $client) {
        self::dbgYiiLog($client->__getLastRequestHeaders());
        self::dbgYiiLog($client->__getLastRequest());
        self::dbgYiiLog($client->__getLastResponseHeaders());
        self::dbgYiiLog($client->__getLastResponse());
    }

    static function soapLogDebugFile(SoapClient $client, $fileName = null) {
        if ($fileName === null) {
            $objDateTime = new DateTime();
            $fileName = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . $objDateTime->format('Y-m-d_H-i-s_u') . '_soap.log';
        } else {
            $fileName = \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . $fileName;
        }
        file_put_contents($fileName, "Timestamp: " . date(DATETIME_FORMAT . ' P T') . PHP_EOL);
        file_put_contents($fileName, print_r($client->__getLastRequestHeaders(), true), FILE_APPEND);
        file_put_contents($fileName, print_r($client->__getLastRequest(), true), FILE_APPEND);
        file_put_contents($fileName, print_r($client->__getLastResponseHeaders(), true), FILE_APPEND);
        file_put_contents($fileName, print_r($client->__getLastResponse(), true), FILE_APPEND);
    }

    static function formatXmlString($xml) {

        // add marker linefeeds to aid the pretty-tokeniser (adds a linefeed between all tag-end boundaries)
        $xml = preg_replace('/(>)(<)(\/*)/', "$1\n$2$3", $xml);

        // now indent the tags
        $token = strtok($xml, "\n");
        $result = ''; // holds formatted version as it is built
        $pad = 0; // initial indent
        $matches = array(); // returns from preg_matches()
        // scan each line and adjust indent based on opening/closing tags
        while ($token !== false) :

            // test for the various tag states
            // 1. open and closing tags on same line - no change
            if (preg_match('/.+<\/\w[^>]*>$/', $token, $matches)) :
                $indent = 0;
            // 2. closing tag - outdent now
            elseif (preg_match('/^<\/\w/', $token, $matches)) :
                $pad--;
            // 3. opening tag - don't pad this one, only subsequent tags
            elseif (preg_match('/^<\w[^>]*[^\/]>.*$/', $token, $matches)) :
                $indent = 1;
            // 4. no indentation needed
            else :
                $indent = 0;
            endif;

            // pad the line with the required number of leading spaces
            $line = str_pad($token, strlen($token) + $pad, ' ', STR_PAD_LEFT);
            $result .= $line . "\n"; // add to the cumulative result, with linefeed
            $token = strtok("\n"); // get the next token
            $pad += $indent; // update the pad size for subsequent lines
        endwhile;

        return $result;
    }

    /**
     * Convert array to HTML table using the keys as column names
     * @param array $arr The input array. Array of ActiveRecord elements is also possible
     * @return string The HTML table definition
     */
    static function arr2table(array $arr) {
        if (!isset($arr[0])) {
            return;
        }
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;"><tr><th>#</th>';
        if (is_array($arr[0])) {
            $keys = array_keys($arr[0]);
        } else {
            $keys = array_keys($arr[0]->attributes);
        }
        foreach ($keys as $th) {
            $out .= "<th>{$th}</th>";
        }
        $out .= "</tr>";
        $i = 1;
        foreach ($arr as $row) {
            $out .= "<tr><td>$i</td>";
            $i++;
            if (is_array($row)) {
                $element = $row;
            } else {
                $element = $row->attributes;
            }
            foreach ($element as $td) {
                if (is_array($td)) {
                    if (empty($td)) {
                        $out .= "<td></td>";
                    } else {
                        $out .= "<td>" . json_encode($td) . "</td>";
                    }
                } else {
                    $out .= "<td>$td</td>";
                }
            }
            $out .= "</tr>";
        }
        $out .= '</table>';
        return $out;
    }

    /**
     * Convert array to HTML table using the keys as first row names
     * @param array $arr The input array. Array of ActiveRecord elements is also possible
     * @return string The HTML table definition
     */
    static function arr2tableVertical(array $arr) {
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        if (is_array($arr[0])) {
            $keys = array_keys($arr[0]);
        } else {
            $keys = array_keys($arr[0]->attributes);
        }
        foreach ($keys as $key) {
            $out .= "<tr><th>{$key}</th>";
            foreach ($arr as $row) {
                if (!is_object($row[$key])) {
                    $td = $row[$key];
                } else {
                    $td = $row[$key]->attributes;
                }
                if (is_array($td)) {
                    if (empty($td)) {
                        $out .= "<td></td>";
                    } else {
                        $out .= "<td>" . json_encode($td) . "</td>";
                    }
                } else {
                    $out .= "<td>$td</td>";
                }
            }
            $out .= "</tr>";
        }
        $out .= '</table>';
        return $out;
    }

    /**
     * Fetch info via HTTP GET or POST requests
     * @param string $url The URL
     * @param mixed $extra Extra parameters array or url encoded string. When $extra is used the method is POST
     * @return array With 2 elements error & result
     */
    static function curl($url, $extra = '') {
        // Assigning cURL options to an array
        $options = [
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
//            CURLOPT_ENCODING => "gzip|deflate", // To hadle all kind of streams
            CURLOPT_URL => $url, // Setting cURL's URL option with the $url variable passed into the function
            CURLOPT_SSL_VERIFYPEER => false, // Do not check for SSL certificate
            CURLOPT_SSL_VERIFYHOST => YII_DEBUG ? 0 : 2
        ];
        if ($extra == 'CCAvFlag') {
            $options[CURLOPT_SSLVERSION] = 6;
            $options[CURLOPT_REFERER] = Yii::app()->createAbsoluteUrl(' ');
            $options[CURLINFO_CONTENT_TYPE] = "application/json";
            //$options[CURLOPT_RETURNTRANSFER] = true;
        } elseif ($extra != '') {
            $options[CURLOPT_POSTFIELDS] = is_array($extra) ? http_build_query($extra) : $extra;
            $options[CURLOPT_POST] = true;
            $options[CURLOPT_HTTPHEADER] = array('Content-Type: application/x-www-form-urlencoded');
        }
        $ch = curl_init();   // Initialising cURL
        curl_setopt_array($ch, $options);   // Setting cURL's options using the previously assigned array data in $options
        $data = curl_exec($ch); // Executing the cURL request and assigning the returned data to the $data variable
        $err = curl_error($ch);
        curl_close($ch);     // Closing cURL
        return ['result' => $data, 'error' => $err];     // Returning the data from the function
    }

    /**
     * Convert minutes to hh:mm string
     * @param int $minutes The number of minutes to convert
     * @param string $format The usual format is: '%02d:%02d'
     * @return string
     */
    static function convertToHoursMins($minutes, $format = '%02d:%02d') {
        settype($minutes, 'integer');
        return sprintf($format, floor($minutes / 60), ($minutes % 60));
    }

    static function convertSecToMinsSecs($seconds, $format = '%02d:%02d') {
        settype($seconds, 'integer');
        return sprintf($format, floor($seconds / 60), ($seconds % 60));
    }

    static function convertSecToHoursMins($seconds, $format = '%02d:%02d') {
        settype($seconds, 'integer');
        $hours = floor($seconds / 3600);
        return sprintf($format, $hours, floor(($seconds - $hours * 3600) / 60));
    }

    static function convertSecToDaysHours($seconds, $format = '%02dd %02dh') {
        settype($seconds, 'integer');
        $days = floor($seconds / (3600 * 24));
        return sprintf($format, $days, floor(($seconds - $days * 3600 * 24) / 3600));
    }

    /**
     * Convert hours and minutes to minutes, like 02:30 -> 150
     * @param string $str input string
     * @return int Minutes
     */
    static function convertHoursMinsToMins($str) {
        $time = explode(':', $str);
        return ($time[0] * 60) + $time[1];
    }

    static function toArray($var) {
        if (is_array($var)) {
            return $var;
        } else {
            return [$var];
        }
    }

    /**
     * Convert as 2014-11-17 07:45:00 --> 2014-11-17 07:45
     * @param string $strDateTime
     * @return string
     */
    static function shortenDateAndTimeManualBook($strDateTime) {
        return substr($strDateTime, 0, 10) . " " . substr($strDateTime, 11, 5);
    }

    /**
     * Save object as a file
     * @param string $filename
     * @param mixed $object
     * @return int How many bytes are saved or FALSE on error
     */
    static function objectToFile($filename, $object) {
        return file_put_contents($filename, json_encode($object));
    }

    /**
     * Read object from file
     * @param string $filename
     * @return mixed The object
     */
    static function fileToObject($filename, $flag = false) {
        return json_decode(file_get_contents($filename), $flag);
    }

    static function getProxyIp() {
        $headers = [
            'HTTP_X_FORWARDED_FOR',
            'HTTP_CF_CONNECTING_IP',
            'HTTP_X_FORWARDED',
            'HTTP_CLIENT_IP',
            'HTTP_XONNECTION',
            'HTTP_CACHE_INFO',
            'HTTP_XPROXY',
            'HTTP_PROXY',
            'HTTP_PROXY_CONNECTION',
            'HTTP_VIA',
            'HTTP_X_COMING_FROM',
            'HTTP_COMING_FROM',
            'HTTP_FORWARDED_FOR',
            'HTTP_FORWARDED',
        ];
        foreach ($headers as $header) {
            if (isset($_SERVER[$header])) {
                $ip = strstr($_SERVER[$header] . ',', ',', true);
                if (ip2long($ip)) {
                    return $ip;
                }
            }
        }
        return null;
    }

    /**
     * GeoIp info
     * @param string $ip If empty return the info about the current caller
     * @return string Json encoded GeoIp info
     */
    static function getGeoIpJsonString($ip = null) {
        // Add the GeoIP info
        Yii::import('application.extensions.geoip.CGeoIP');
        $geoIp = new CGeoIP;
        $location = $geoIp->lookupLocation($ip);
        if ($location === null) {
            return json_encode([ 'result' => 'Undefined']);
        } else {
            return json_encode($location->getData());
        }
    }

    /**
     * GeoIp info online version with dynamic requests
     * @param string $ip If empty return the info about the current caller
     * @return string Json encoded GeoIp info
     */
    static function getGeoIpJsonStringV2($ip = null) {
        if ($ip === null) {
            $ip = \Yii::app()->request->getUserHostAddress();
        }
        //return json_decode(file_get_contents("http://ip-api.com/json/$ip"));
        return json_decode(file_get_contents("https://ipapi.co/$ip/json"));
    }

    public static function pkcs5Pad($text, $blocksize) {
        $pad = $blocksize - (strlen($text) % $blocksize);
        return $text . str_repeat(chr($pad), $pad);
    }

    public static function pkcs5Unpad($text) {
        $pad = ord($text{strlen($text) - 1});
        if ($pad > strlen($text))
            return $text;
        if (strspn($text, chr($pad), strlen($text) - $pad) != $pad)
            return $text;
        return substr($text, 0, -1 * $pad);
    }

    /**
     * Is Windows
     *
     * Tells if we are running on Windows Platform
     */
    static function isWindows() {
        if (PHP_OS == 'WINNT' || PHP_OS == 'WIN32') {
            return true;
        }
        return false;
    }

    static function getServerMemoryUsage() {

        if (self::isWindows())
            return 74;
        $free = shell_exec('free');
        $free = (string) trim($free);
        $free_arr = explode("\n", $free);
        $mem = explode(" ", $free_arr[1]);
        $mem = array_filter($mem);
        $mem = array_merge($mem);
        return round($mem[2] / $mem[1] * 100);
    }

    /**
     * Set the matching attribues in the $object from the given array
     * @param mixed $object The object
     * @param array $values The values
     */
    static function setAttributes(&$object, array $values) {
        foreach ($values as $name => $value) {
            if (!empty($object) && property_exists($object, $name)) {
                if (is_array($value)) {
                    self::setAttributes($object->$name, $value);
                } else {
                    $object->$name = $value;
                }
            }
        }
    }

    /**
     * Helping function to get data for days in month dropdown
     * @return array in key=>value format days from 1 to 31
     */
    public static function getDayArray() {
        $dayArray = array();
        for ($i = 1; $i <= 31; $i++) {
            $dayArray[$i] = $i;
        }
        return $dayArray;
    }

    /**
     * Helping function to get data of month names
     * @return array in key=>value format
     */
    public static function getMonthArray() {
        $monthArray = array(
            1 => 'January',
            2 => 'February',
            3 => 'March',
            4 => 'April',
            5 => 'May',
            6 => 'June',
            7 => 'July',
            8 => 'August',
            9 => 'September',
            10 => 'October',
            11 => 'November',
            12 => 'December',
        );
        return $monthArray;
    }

    /**
     * Helping function to get data for years dropdown
     * @return array in key=>value format years from current to 1900
     */
    public static function getYearArray() {
        $yearArray = array();
        for ($i = Yii::app()->dateFormatter->format('yyyy', time()); $i >= 1900; $i--) {
            $yearArray[$i] = $i;
        }
        return $yearArray;
    }

    /**
     * Helping function to get data for years dropdown
     * @return array in key=>value format years from current +10 to current
     */
    public static function getCardYearArray() {
        $yearArray = array();
        $year = Yii::app()->dateFormatter->format('yyyy', time());
        for ($i = $year + 10; $i >= $year - 2; $i--) {
            $yearArray[$i] = $i;
        }
        return $yearArray;
    }

    /**
     * Save html content as XML file
     * @param string $content The HTML content
     * @param string $filename The filename
     */
    static function html2xls($content, $filename = 'output.xls') {
        $prefix = "<html><meta http-equiv='Content-Type' content='text/html; charset=Windows-1252'><body>";
        $sufix = "</body></html>";
        header("Content-type: application/vnd.ms-excel");
        header('Content-Length: ' . (strlen($content) + strlen($sufix) + strlen($prefix)));
        header("Content-Disposition: attachment;Filename=" . str_replace(' ', '_', $filename));
        echo $prefix . $content . $sufix;
    }

    static function dobToAge($dob) {
        $from = new DateTime($dob);
        $to = new DateTime(date('Y-m-d'));
        return $from->diff($to)->y;
    }

    /**
     * Log all of the HTTP request
     * @param string $action Who called the logging
     */
    static function logRequest($action = null) {
        // Log the request
        \Utils::dbgYiiLog([
            'Action' => $action,
            'GET' => $_GET,
            'POST' => $_POST,
            'BODY' => \Yii::app()->request->getRawBody(),
        ]);
    }

    /**
     * Generate random UUID version 4, variant DCE1.1
     * @return string the UUID
     */
    static function generateUuid() {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            // 32 bits for "time_low"
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            // 16 bits for "time_mid"
            mt_rand(0, 0xffff),
            // 16 bits for "time_hi_and_version",
            // four most significant bits holds version number 4
            mt_rand(0, 0x0fff) | 0x4000,
            // 16 bits, 8 bits for "clk_seq_hi_res",
            // 8 bits for "clk_seq_low",
            // two most significant bits holds zero and one for variant DCE1.1
            mt_rand(0, 0x3fff) | 0x8000,
            // 48 bits for "node"
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }

    /**
     * adds file mtime to url if can find a file
     */
    static function mtimeify($url) {
        $file = dirname(Yii::app()->request->scriptFile) . $url;

        if (file_exists($file)) {
            return $url . '?' . filemtime($file);
        }

        return $url;
    }

    /**
     * Fast , but approximate count of all records in PostgreSql table
     * @param string $tableName The name of the table
     * @return integer
     */
    static function fastCountAll($tableName) {
        return \Yii::app()->db->createCommand("select reltuples FROM pg_class WHERE oid='public.$tableName'::regclass;")->queryScalar();
    }

    /**
     * Added By Satender K
     * Purpose : To get the site url for B2C users from the backend 
     * @param type $host => Yii::app()->hostInfo
     * @return type => return string 
     */
    static function getSiteUrl($host) {
        $search = '';
        $replace = '';
        if (strstr($host, ADMIN_CHEAPTICKET_SITE_LOCAL)) {
            $search = ADMIN_CHEAPTICKET_SITE_LOCAL;
            $replace = B2C_CHEAPTICKET_SITE_LOCAL;
        } else if (strstr($host, ADMIN_CHEAPTICKET_SITE_DEV)) {
            $search = ADMIN_CHEAPTICKET_SITE_DEV;
            $replace = B2C_CHEAPTICKET_SITE_DEV;
        } else if (strstr($host, ADMIN_CHEAPTICKET_SITE_LIVE)) {
            $search = ADMIN_CHEAPTICKET_SITE_LIVE;
            $replace = B2C_CHEAPTICKET_SITE_LIVE;
        }
        return str_replace($search, $replace, $host);
    }

    static function getPrintUrlByWebsiteId($websiteId, $modelId, $action, $printStatus) {
        if (isset(\AirCart::$websiteURLMap[$websiteId])) {
            return \AirCart::$websiteURLMap[$websiteId] . '/b2c/airCart/' . $action . '/' . $modelId . $printStatus;
        } else {
            return \AirCart::$websiteURLMap[\AirCart::WEBSITE_CHEAPTICKET] . '/b2c/airCart/' . $action . '/' . $modelId . $printStatus;
        }
    }

    static function getCountryUsingNumber($number) {
        if (isset($number) && !empty($number)) {
            try {
                $util = \libphonenumber\PhoneNumberUtil::getInstance();
                $phone = $util->parse($number, 'IN');
                $rc = $util->getRegionCodeForNumber($phone);
                return \Country::model()->findByAttributes(array('code' => $rc));
            } catch (Exception $e) {
                \Utils::dbgYiiLog('Caught phone exception: ' . $e->getMessage());
            }
        }
    }

    static function getWebsiteNames() {
        if (stristr(str_replace('www.', '', \Yii::app()->request->serverName), "air.belair")) {
            return [
                \AirCart::WEBSITE_CHEAPTICKET => 'Cheapticket',
                \AirCart::WEBSITE_CHEAPTICKETS24_LIVE => 'CheapTickets24',
                \AirCart::WEBSITE_AIRTICKETSINDIA => 'AirTicketsIndia',
            ];
        } elseif (stristr(str_replace('www.', '', \Yii::app()->request->serverName), "dev.belair")) {
            return [
                \AirCart::WEBSITE_CHEAPTICKET_DEV => 'Dev Cheapticket',
                \AirCart::WEBSITE_CHEAPTICKETS24_DEV => 'Dev CheapTickets24',
                \AirCart::WEBSITE_AIRTICKETS_DEV => 'Dev AirTicketsIndia',
            ];
        } elseif (stristr(str_replace('www.', '', \Yii::app()->request->serverName), "local")) {
            return [
                \AirCart::WEBSITE_CHEAPTICKET_LOCAL => 'Local Cheapticket',
                \AirCart::WEBSITE_CHEAPTICKETS24_LOCAL => 'Local CheapTickets24',
                \AirCart::WEBSITE_AIRTICKETS_LOCAL => 'Local AirTicketsIndia',
            ];
        }
    }

    /**
     * Added By Satender
     * Purpose: To check whether the journey is Domestic or International
     * @param type $airports => array should be minimum 2 with airport code
     * returns [1 => Domestic, 2 => International, 0 => Wrong Data Provided
     */
    static function getJourneyType($airports = []) {
        if (count($airports) < 2) {
            return 0;
        }
        $countries = [];
        foreach ($airports as $code) {
            $airport = \Airport::model()->cache(3600)->findByAttributes(['airport_code' => $code]);
            if ($airport !== null) {
                $countries [$airport->country_code] = $airport->country_code;
            }
        }
        return count($countries);
    }

    static public function getAirportIDs($airport_codes) {
        return \Yii::app()->db->createCommand()
                ->setFetchMode(\PDO::FETCH_COLUMN, 0)
                ->select("id")
                ->from(\Airport::model()->tableSchema->name)
                ->where('airport_code IN (\'' . implode("','", $airport_codes) . '\')')
                ->queryAll();
    }

}
