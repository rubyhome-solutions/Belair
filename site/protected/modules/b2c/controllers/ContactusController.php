<?php

namespace b2c\controllers;

use b2c\components\ControllerExceptionable;
use b2c\components\ControllerOverridable;

class ContactusController extends \Controller {

    use ControllerOverridable,
        ControllerExceptionable;

    const CAPCHA_URL = 'https://www.google.com/recaptcha/api/siteverify?secret=6Lc2egcUAAAAANczeo8mTRSyfhwP1xRZH-aYEYJX';

    public function actionIndex() {
        // \Utils::dbgYiiLog(\Yii::app()->theme->name);
        if (!$this->isMobile()) {
            $this->render('//common/js', ['bundle' => 'contactus']);
        } else { // for mobile layout show contact us link
            $this->layout = '//layouts/mobile';
            $this->render('//common/mobilejs', ['bundle' => 'contactus']);
        }
    }

    public function actionFlightBooking() {
        $recaptcha = \Yii::app()->request->getPost('g-recaptcha-response');
        $verifyResponse = file_get_contents(self::CAPCHA_URL . '&response=' . $recaptcha);
        $responseData = json_decode($verifyResponse);
        if (\Yii::app()->request->getPost('flight_booking') == "flight_booking" && $responseData->success) {
            $data = array(
                "type" => "FLIGHT_BOOKING",
                "name" => \Yii::app()->request->getPost('name_fb'),
                "email" => \Yii::app()->request->getPost('email_fb'),
                "country" => \Yii::app()->request->getPost('country_fb'),
                "mobile" => \Yii::app()->request->getPost('mobile_fb'),
                "refno" => \Yii::app()->request->getPost('refno_fb'),
                "pnrno" => \Yii::app()->request->getPost('pnrno_fb'),
                "journeytype" => \Yii::app()->request->getPost('typejourney_fb'),
                "subject" => \Yii::app()->request->getPost('subject_fb'),
                "payment" => \Yii::app()->request->getPost('payment_fb'),
                "services" => \Yii::app()->request->getPost('services_fb'),
                "uploads" => $_FILES
            );
            echo self::sendMail($data);
        } else {
            echo json_encode(["result" => "recaptcha"]);
        }
    }

    public function actionServices() {
        $recaptcha = \Yii::app()->request->getPost('g-recaptcha-response');
        $verifyResponse = file_get_contents(self::CAPCHA_URL . '&response=' . $recaptcha);
        $responseData = json_decode($verifyResponse);
        if (\Yii::app()->request->getPost('services') == "services" && $responseData->success) {
            $data = array(
                "type" => "SERVICES",
                "name" => \Yii::app()->request->getPost('name_ser'),
                "email" => \Yii::app()->request->getPost('email_ser'),
                "country" => \Yii::app()->request->getPost('country_ser'),
                "mobile" => \Yii::app()->request->getPost('mobile_ser'),
                "tnp" => \Yii::app()->request->getPost('tnp_ser'),
                "journeytype" => \Yii::app()->request->getPost('journeytype_ser'),
                "assistance" => \Yii::app()->request->getPost('assist_ser'),
                "traveltype" => \Yii::app()->request->getPost('traveltype_ser'),
                "information" => \Yii::app()->request->getPost('info_ser'),
                "services" => \Yii::app()->request->getPost('service_ser'),
                "uploads" => $_FILES
            );
            echo self::sendMail($data);
        } else {
            echo json_encode(["result" => "recaptcha"]);
        }
    }

    public function actionFeedback() {
        $recaptcha = \Yii::app()->request->getPost('g-recaptcha-response');
        $verifyResponse = file_get_contents(self::CAPCHA_URL . '&response=' . $recaptcha);
        $responseData = json_decode($verifyResponse);
        if (\Yii::app()->request->getPost('feedback') == "feedback" && $responseData->success) {
            $data = array(
                "type" => "FEEDBACK",
                "name" => \Yii::app()->request->getPost('name_feed'),
                "email" => \Yii::app()->request->getPost('email_feed'),
                "country" => \Yii::app()->request->getPost('country_feed'),
                "mobile" => \Yii::app()->request->getPost('mobile_feed'),
                "refno" => \Yii::app()->request->getPost('refno_feed'),
                "pnrno" => \Yii::app()->request->getPost('pnrno_feed'),
                "feedback" => \Yii::app()->request->getPost('select_feedback'),
                "comments" => \Yii::app()->request->getPost('comment_feed'),
                "uploads" => $_FILES
            );
            echo self::sendMail($data);
        } else {
            echo json_encode(["result" => "recaptcha"]);
        }
    }

    public function actionManagement() {
        $recaptcha = \Yii::app()->request->getPost('g-recaptcha-response');
        $verifyResponse = file_get_contents(self::CAPCHA_URL . '&response=' . $recaptcha);
        $responseData = json_decode($verifyResponse);
        if (\Yii::app()->request->getPost('management') == "management" && $responseData->success) {
            $data = array(
                "type" => "MANAGEMENT",
                "name" => \Yii::app()->request->getPost('name_manage'),
                "email" => \Yii::app()->request->getPost('email_manage'),
                "country" => \Yii::app()->request->getPost('country_manage'),
                "mobile" => \Yii::app()->request->getPost('mobile_manage'),
                "subject" => \Yii::app()->request->getPost('subject_manage'),
                "feedback" => \Yii::app()->request->getPost('feedback_manage'),
                "phone" => \Yii::app()->request->getPost('phone_manage'),
                "message" => \Yii::app()->request->getPost('write_manage'),
                "uploads" => $_FILES
            );
            echo self::sendMail($data);
        } else {
            echo json_encode(["result" => "recaptcha"]);
        }
    }

    public function actionCareers() {
        $recaptcha = \Yii::app()->request->getPost('g-recaptcha-response');
        $verifyResponse = file_get_contents(self::CAPCHA_URL . '&response=' . $recaptcha);
        $responseData = json_decode($verifyResponse);
        if (\Yii::app()->request->getPost('careers') == "careers" && $responseData->success) {
            $data = array(
                "type" => "CAREERS",
                "name" => \Yii::app()->request->getPost('name_car'),
                "email" => \Yii::app()->request->getPost('email_car'),
                "country" => \Yii::app()->request->getPost('country_car'),
                "mobile" => \Yii::app()->request->getPost('mobile_car'),
                "age" => \Yii::app()->request->getPost('age_car'),
                "address" => \Yii::app()->request->getPost('add_car'),
                "qualification" => \Yii::app()->request->getPost('qualification'),
                "jobapplied" => \Yii::app()->request->getPost('applied_car'),
                "location" => \Yii::app()->request->getPost('location_car'),
                "skills" => \Yii::app()->request->getPost('skills_car'),
                "uploads" => $_FILES
            );
            echo self::sendMail($data);
        } else {
            echo json_encode(["result" => "recaptcha"]);
        }
    }

    static function inlineSendMail($subject, $message, $headers, $recipientmails, $boundary, $x, $key, $type, $refId, $time, $replyto, $sender) {
        //plain text/html

        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($message));
        if ($x['uploads'][$key]['error'] == 0) {
            $file_name = $x['uploads'][$key]['name'];
            $ext = pathinfo($file_name, PATHINFO_EXTENSION);

            //get file details we need
            if ($ext == "jpg" || $ext == "png" || $ext = "doc" || $ext = "docx" || $ext = "pdf") {
                $file_tmp_name = $x['uploads'][$key]['tmp_name'];
                $file_size = $x['uploads'][$key]['size'];
                $file_type = $x['uploads'][$key]['type'];
                //read from the uploaded file & base64_encode content for the mail
                $handle = fopen($file_tmp_name, "r");
                $content = fread($handle, $file_size);
                fclose($handle);
                $encoded_content = chunk_split(base64_encode($content));

                //text mail
                //attachment
                $body .= "--$boundary\r\n";
                $body .="Content-Type: $file_type; name=\"$file_name\"\r\n";
                $body .="Content-Disposition: attachment; filename=\"$file_name\"\r\n";
                $body .="Content-Transfer-Encoding: base64\r\n";
                $body .="X-Attachment-Id: " . rand(1000, 99999) . "\r\n\r\n";
                $body .= $encoded_content;
            } else {
                return(json_encode(["result" => "fileError"]));
            }
        }
        $sentMail = true;
        $popup_html=self::popUpHtml($type);
        foreach ($recipientmails as $email) {
            $sentMail = mail($email, $subject, $body, $headers);
        }
        if ($sentMail) { //output success or failure messages
            $replyToCustomer = self::replyToCustomerForFlightBooking($type, $refId, $time, $replyto, $sender);
            if ($replyToCustomer) {
                return(json_encode(["result" => "success", "refno" => $refId, "popup_html" => $popup_html]));
            }
        } else {
            return(json_encode(["result" => "mailSendingFailed"]));
        }
    }

    static function sendMail($x) {
        $type = $x["type"];
        $mobileNo = $x['mobile'];
        $refId = self::getRefNo($type, $mobileNo);
        $replyto = $x['email'];
        $recipientmails = self::recipientMail($type);
        $time = date("l jS \of F Y h:i:s A");
        $from_email = $x['email'];
        $sender = $recipientmails[0];
        $subject = $type;
        $message = '<html><body style="font-family:Tahoma,sans-serif;">';
        $message.= '<p>To,</p>';

        $sub_text = ucwords(strtolower(str_replace('_', ' ', $type)));

        if (strstr(\Yii::app()->request->serverName, 'cheaptickets24')) { // F2G cases
            $message.='<p>Customer Support cheaptickets24.com</p>';
            $message.='<p>Sub: ' . $sub_text . ' cheaptickets24 Ref. ID: ' . $refId . ', Date ' . $time . '</p><br/><br/>';
        } else if (strstr(\Yii::app()->request->serverName, 'cheapticket')) { // B2C cases
            $message.='<p>Customer Support cheapticket.in</p>';
            $message.='<p>Sub: ' . $sub_text . ' cheapticket Ref. ID: ' . $refId . ', Date ' . $time . '</p><br/><br/>';
        } else if (strstr(\Yii::app()->request->serverName, 'airticketsindia')) { // ATI cases
            $message.='<p>Customer Support airticketsindia.com</p>';
            $message.='<p>Sub: ' . $sub_text . ' airticketsindia Ref. ID: ' . $refId . ', Date ' . $time . '</p><br/><br/>';
        }
        $message.='<table border="1" cellspacing="0" cellpadding="5">';
        $message.='<tr><th style="text-align: right;">Name: </th><th style="text-align: left;">' . $x['name'] . '</th></tr>';
        $message.='<tr><th style="text-align: right;">E-mail ID: </th><th style="text-align: left;">' . $x['email'] . '</th></tr>';
        $message.='<tr><th style="text-align: right;">Country: </th><th style="text-align: left;">' . $x['country'] . '</th></tr>';
        $message.='<tr><th style="text-align: right;">Mob. No: </th><th style="text-align: left;">' . $x['mobile'] . '</th></tr>';

        $boundary = md5("sanwebe");
        //header
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From:" . $from_email . "\r\n";
        $headers .= "Reply-To: " . $from_email . "" . "\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";

        switch ($type) {
            case "FLIGHT_BOOKING":
                $message.='<tr><th style="text-align: right;">Ref. No.: </th><th style="text-align: left;">' . $x['refno'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">PNR NO. </th><th style="text-align: left;">' . $x['pnrno'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Journey Type: </th><th style="text-align: left;">' . $x['journeytype'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Subject: </th><th style="text-align: left;">' . $x['subject'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Payment: </th><th style="text-align: left;">' . $x['payment'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Services Required: </th><th style="text-align: left;">' . $x['services'] . '</th></tr>';
                $message.='</table>';
                $message.='<p><br/>Awaiting your response.<br/><br/>Thanking you!!!<br/>Customer Name: ' . $x['name'] . '<br/>Mobile No.: ' . $x['mobile'] . '<br/>E-mail ID: ' . $x['email'] . "</p>";
                $message .= '</body></html>';
                echo self::inlineSendMail($subject, $message, $headers, $recipientmails, $boundary, $x, 'uploads_fb', $type, $refId, $time, $replyto, $sender);
                break;

            case 'SERVICES':
                $message.='<tr><th style="text-align: right;">Ref. No.: </th><th style="text-align: left;">' . $x['tnp'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Journey Type: </th><th style="text-align: left;">' . $x['journeytype'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Assistance: </th><th style="text-align: left;">' . $x['assistance'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Travel Type: </th><th style="text-align: left;">' . $x['traveltype'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Information: </th><th style="text-align: left;">' . $x['information'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Services Required: </th><th style="text-align: left;">' . $x['services'] . '</th></tr>';
                $message.='</table>';
                $message.='<br/><p>Awaiting your response.<br/><br/>Thanking you!!!<br/><br/>Customer Name: ' . $x['name'] . '<br/>Mobile No.: ' . $x['mobile'] . '<br/>E-mail ID: ' . $x['email'] . "</p>";
                $message .= '</body></html>';
                echo self::inlineSendMail($subject, $message, $headers, $recipientmails, $boundary, $x, 'uploads_ser', $type, $refId, $time, $replyto, $sender);
                break;
            case 'FEEDBACK':
                $message.='<tr><th style="text-align: right;">Feedback Type:</th><th style="text-align: left;">' . $x['feedback'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Comments:</th><th style="text-align: left;">' . $x['comments'] . '</th></tr>';
                $message.='</table>';
                $message.="<br/><p>Awaiting your response.<br/>Thanking you!!!</p>";
                $message.='<p>Customer Name:' . $x['name'] . '</p>';
                $message.='<p>Mob. No:' . $x['mobile'] . '</p>';
                $message.='<p>E-mail ID:' . $x['email'] . '</p>';
                $message.="</body></html>";
                //plain text/html
                echo self::inlineSendMail($subject, $message, $headers, $recipientmails, $boundary, $x, 'uploads_feed', $type, $refId, $time, $replyto, $sender);
                break;

            case 'MANAGEMENT':
                $message.='<tr><th style="text-align: right;">Subject:</th><th style="text-align: left;">' . $x['subject'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Feedback Type:</th><th style="text-align: left;">' . $x['feedback'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Phone No.:</th><th style="text-align: left;">' . $x['phone'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Write to us:</th><th style="text-align: left;">' . $x['message'] . '</th></tr>';
                $message.='</table>';
                $message.="<br/><p>Awaiting your response.<br/>Thanking you!!!</p>";
                $message.='<p>Customer Name:' . $x['name'] . '</p>';
                $message.='<p>Mob. No:' . $x['mobile'] . '</p>';
                $message.='<p>E-mail ID:' . $x['email'] . '</p>';
                $message.="</body></html>";
                //plain text/html
                echo self::inlineSendMail($subject, $message, $headers, $recipientmails, $boundary, $x, 'uploads_manage', $type, $refId, $time, $replyto, $sender);
                break;

            case 'CAREERS':
                $message.='<tr><th style="text-align: right;">Age:</th><th style="text-align: left;">' . $x['age'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Address:</th><th style="text-align: left;">' . $x['address'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Qualification:</th><th style="text-align: left;">' . $x['qualification'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Job Applied:</th><th style="text-align: left;">' . $x['jobapplied'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Location:</th><th style="text-align: left;">' . $x['location'] . '</th></tr>';
                $message.='<tr><th style="text-align: right;">Your Best Skills:</th><th style="text-align: left;">' . $x['skills'] . '</th></tr>';
                $message.='</table>';
                $message.="<br/><p>Awaiting your response.<br/>Thanking you!!!</p>";
                $message.='<p>Customer Name:' . $x['name'] . '<br/>';
                $message.='Mob. No:' . $x['mobile'] . '<br/>';
                $message.='Email ID:' . $x['email'] . '</p>';
                $message.="</body></html>";
                //plain text/html
                echo self::inlineSendMail($subject, $message, $headers, $recipientmails, $boundary, $x, 'uploads_car', $type, $refId, $time, $replyto, $sender);
                break;

            default:
                break;
        }
    }

    static function replyToCustomerForFlightBooking($type, $refId, $time, $sendto, $sender) {
        if (strstr(\Yii::app()->request->serverName, 'cheaptickets24')) {
            $email_server = "cheaptickets24.com";
        }
        else if (strstr(\Yii::app()->request->serverName, 'airticketsindia')) {
            $email_server = "airticketsindia.com";
        }
        else
        {
            $email_server = "cheapticket.in";
        }
        $sub_text = ucwords(strtolower(str_replace('_', ' ', $type)));

        switch ($type) {
            case "FLIGHT_BOOKING":
                $from_email = $sender; //sender email
                $recipient_email = $sendto; //recipient email
                $subject = 'Greetings from ' . $sender; //subject of email
                $message = "<html><body style='font-family:Tahoma,sans-serif;'>";
                $message.="<p>SUB:" . $sub_text . ", " . $email_server . " Ref. ID:" . $refId . ", Dt:" . $time . "</p>";
                $message.="<p>Dear Customer,</p>";
                $message.="<p>Greetings from " . $email_server . ", the fastest growing Online Travel Company.<br/>";
                $message.="Our executive will revert to you at the earliest on your Service Request.<br/>";
                $message.="In case of urgent request within 24 hours, kindly Call Customer Care+91-120-4887777.</p>";
                $message.="<p><b style='color:red;'>Note*</b>";
                $message.="<ul style='list-style:none;'>";
                $message.="<li>1.   Re-bookings, Changes or Cancellation possible only 24 hours before departure time.</li>";
                $message.="<li>2.   For Services within 24 hours of departure, send e-mail & follow-up with our Call Center 24X7.</li>";
                $message.="<li>3.   Any requests by SMS, WhatsApp or any other media are not accepted.</li>";
                $message.="<li>4.   Airline Fees, & Service charges apply.</li>";
                $message.="</ul></p>";
                $message.="<p>For any further assistance feel free to contact us.</p>";
                break;

            case "SERVICES":
                $from_email = $sender; //sender email
                $recipient_email = $sendto; //recipient email
                $subject = 'Greetings from ' . $sender; //subject of email
                $message = "<html><body style='font-family:Tahoma,sans-serif;'>";
                $message.="<p>SUB:" . $sub_text . ", " . $email_server . " Ref. ID:" . $refId . ", Dt:" . $time . "</p>";
                $message.="<p>Dear Customer,</p>";
                $message.="<p>Greetings from " . $email_server . ", the fastest growing Online Travel Company.<br/>";
                $message.="Our executive will revert to you at the earliest on your Service Request.<br/>";
                $message.="In case of urgent request within 24 hours, kindly Call Customer Care+91-120-4887777.</p>";
                $message.="<p><b style='color:red;'>Note*</b>";
                $message.="<ul style='list-style:none;'>";
                $message.="<li>1.   Re-bookings, Changes or Cancellation possible only 24 hours before departure time.</li>";
                $message.="<li>2.   For Services within 24 hours of departure, send e-mail & follow-up with our Call Center 24X7.</li>";
                $message.="<li>3.   Any requests by SMS, WhatsApp or any other media are not accepted.</li>";
                $message.="<li>4.   Airline Fees, & Service charges apply.</li>";
                $message.="</ul></p>";
                $message.="<p>For any further assistance feel free to contact us.<br/>";
                break;
            case "FEEDBACK";
                $from_email = $sender; //sender email
                $recipient_email = $sendto; //recipient email
                $subject = 'Greetings from ' . $sender; //subject of email
                $message = "<html><body>";
                $message.="<p>SUB:" . $sub_text . ", " . $email_server . " Ref. ID:" . $refId . ", Dt:" . $time . "</p>";
                $message.="<p>Dear Customer,</p>";
                $message.="<p>Greetings from " . $email_server . ", the fastest growing Online Travel Company.<br/>";
                $message.="We thank you & welcome your Feedback, which are important for us, to improve our services. <br/>";
                $message.="Please do not hesitate to contact us, if we can be of any further assistance to you.<br/>";
                $message.="Thank you for choosing " . $email_server . "!</p>";
                break;

            case "MANAGEMENT":
                $from_email = $sender; //sender email
                $recipient_email = $sendto; //recipient email
                $subject = 'Greetings from ' . $sender; //subject of email
                $message = "<html><body>";
                $message.="<p>SUB:" . $sub_text . ", " . $email_server . " Ref. ID:" . $refId . ", Dt:" . $time . "</p>";
                $message.="<p>Dear Sir/Madam,</p>";
                $message.="<p>Greetings from " . $email_server . ", the fastest growing Online Travel Company.<br/>";
                $message.="We thank you for your valuable inputs and shall revert to you at the earliest.<br/>";
                $message.="Please, do not hesitate to call us, if you have further questions, we will be glad to assist you.<br/>";
                $message.="<p>Sincerely,</p>";
                break;

            case "CAREERS":
                $from_email = $sender; //sender email /dev@belair/
                $recipient_email = $sendto; //recipient email
                $subject = 'Greetings from ' . $sender; //subject of email
                $message = "<html><body style='font-family:Tahoma,sans-serif;'>";
                $message.="<p>SUB:" . $sub_text . ", " . $email_server . " Ref. ID:" . $refId . ", Dt:" . $time . "</p>";
                $message.="<p>Dear Sir/Madam,</p>";
                $message.="<p>Greetings from " . $email_server . ", the fastest growing Online Travel Company.<br/>";
                $message.="We thank you for your interest for an opportunities at our Organization, which will considered, and shall revert to you at the earliest, if eligible.<br/>";
                $message.="Phone enquiries shall not be entertained.</p>";
                $message.="<p>Sincerely,</p>";
                break;
            default:
                break;
        }
        $message.="<p>Best Regards</p><br/>";
        $message.="<p>" . $email_server . "<br/>Customer Support<br/>C-101, 2nd Floor<br/>Sector-2, Noida - 201301.<br/>";
        $message.="T: +91-120-4887777<br/>M: +91-9313223646<br/>E-Mail : cs@cheapticket.in<br/>URL : www." . $email_server . "</p>";
        $user_email = filter_var($sendto, FILTER_SANITIZE_EMAIL);
        $boundary = md5("sanwebe");
        //header
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "From:" . $from_email . "\r\n";
        $headers .= "Reply-To: " . $user_email . "" . "\r\n";
        $headers .= "Content-Type: multipart/mixed; boundary = $boundary\r\n\r\n";
        //plain text 
        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($message));
        $sentMail = mail($recipient_email, $subject, $body, $headers);
        if ($sentMail) {
            return(true);
        } else {
            return (false);
        }
    }

    public function actionMeta() {
        $meta = new \stdClass;

        $meta->countries = self::getCountries();
        if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);

            $meta->user = ['email' => $user->email, 'mobile' => $user->mobile, 'name' => $user->name];
        }
        \Utils::jsonResponse($meta);
    }

    private function getCountries() {
        $data = \Yii::app()->db->createCommand()->select("name,code,phonecode")->from("country")->queryAll();
        $countries = "<option value=''>Select Country</option>";
        foreach ($data as $country) {
            if ($country['phonecode'] != '') {
                $countries .= "<option  data-phonecode='" . $country['phonecode'] . "'  value='" . $country['code'] . "'>" . $country['name'] . "</option>";
            }
        }
        return $countries;
    }

    static function popUpHtml($popup_type) {
        $popup_html = '';
        $theme_logo='';
        if (\Yii::app()->theme->name == 'B2C') {
        $theme_logo='/themes/B2C/dev/img/logo.png';    
        }else if(\Yii::app()->theme->name == 'F2G'){
           $theme_logo='/themes/F2G/dev/img/logo.png'; 
        }else if(\Yii::app()->theme->name == 'ATI'){
            $theme_logo='/themes/ATI/dev/img/logo.png';
        }
        if ($popup_type == 'FLIGHT_BOOKING' || $popup_type == 'SERVICES') {
            $popup_html .='<div class="ui container">';
            $popup_html .='<div class = "pop_up">';
            $popup_html .='<img src = "'.$theme_logo.'"><br>';
            $popup_html .='<h2>Thank you for Contacting Us</h2>';
            $popup_html .='<span>';
            $popup_html .='<div id = "reference"></div><br>';
            $popup_html .='For any Services 24 hours before flight departure & for prompt response<br>CALL <b>+91-120-4887777</b>';
            $popup_html .='</span>';
            $popup_html .='<div class = "ui one column grid p_redu">';
            $popup_html .='<div class = "column"><div class = "ui form">';
            $popup_html .='<div class = "inline field">';
            $popup_html .='<div class = "field services_req">';
            $popup_html .='<span>Note*</span>';
            $popup_html .='<ol>';
            $popup_html .='<li>Re-bookings, Changes or Cancellation possible only 24 hours before departure time.</li>';
            $popup_html .='<li>For Services within 24 hours of departure, send e-mail & follow-up with our Call Center 24X7.</li>';
            $popup_html .='<li>Airline Fees, & Service charges apply. </li>';
            $popup_html .='</ol>';
            $popup_html .='</div>';
            $popup_html .='</div>';
            $popup_html .='</div>';
            $popup_html .='</div>';
            $popup_html .='</div>';
            $popup_html .='</div>';
        } else if ($popup_type == 'FEEDBACK') {
            $popup_html .='<div class = "ui container">';
            $popup_html .='<div class = "pop_up">';
            $popup_html .='<img src = "'.$theme_logo.'"><br>';
            $popup_html .='<h2>Thank you for Contacting Us</h2>';
            $popup_html .='<span>';
            $popup_html .='<div id = "reference"></div><br>';
            $popup_html .='For any Services 24 hours before flight departure & for prompt response<br>CALL <b>+91-120-4887777</b>';
            $popup_html .='</span>';
            $popup_html .='</div>';
            $popup_html .='</div>';
        } else if ($popup_type == 'MANAGEMENT') {
            $popup_html .='<div class = "ui container">';
            $popup_html .='<div class = "pop_up">';
            $popup_html .='<img src = "'.$theme_logo.'"><br>';
            $popup_html .='<h2>Thank you for Contacting Us</h2>';
            $popup_html .='<span>';
            $popup_html .='<div id = "reference"></div><br>';
            $popup_html .='Management will revert to you shortly<br>';
            $popup_html .='CALL <b>+91-120-4887777</b>';
            $popup_html .='</span>';
            $popup_html .='</div>';
            $popup_html .='</div>';
        } else if ($popup_type == 'CAREERS') {
            $popup_html .='<div class = "ui container">';
            $popup_html .='<div class = "pop_up">';
            $popup_html .='<img src = "'.$theme_logo.'"><br>';
            $popup_html .='<h2>Thank you for Contacting Us</h2>';
            $popup_html .='<span>';
            $popup_html .='<div id = "reference"></div><br>';
            $popup_html .='For any Services 24 hours before flight departure & for prompt response<br>CALL <b>+91-120-4887777</b>';
            $popup_html .='</span>';
            $popup_html .='</div>';
            $popup_html .='</div>';
        }
        return  $popup_html;
    }

    static function recipientMail($x) {
        $type = $x;
        switch ($type) {
            case "FLIGHT_BOOKING":
                return(array("cs@cheapticket.in", "support@cheapticket.in"));
                break;
            case "SERVICES":
                return(array("cs@cheapticket.in", "support@cheapticket.in"));
                break;
            case "FEEDBACK":
                return(array("support@cheapticket.in", "mj@belair.in", "cs@cheapticket.in"));
                break;
            case "MANAGEMENT":
                return(array("psjain@belair.in", "mj@belair.in "));
                break;
            case "CAREERS":
                return(array("hr@belair.in", "sk.gupta@belair.in"));
                break;
            default:
                break;
        }
    }

    static function getRefNo($type, $mobile) {
        $text = $type . "-" . $mobile;
        $data = \Yii::app()->db->createCommand()->insert('contact_us', array('notes' => $text));
        $data1 = \Yii::app()->db->createCommand()->select("id")->from("contact_us")->order("id DESC")->limit(1)->queryRow();
        switch ($type) {
            case "FLIGHT_BOOKING":
                $concate = "F";
                break;
            case "SERVICES":
                $concate = "S";
                break;
            case "FEEDBACK":
                $concate = "O";
                break;
            case "MANAGEMENT":
                $concate = "M";
                break;
            case "CAREERS":
                $concate = "C";
                break;
            default:
                $concate = "UD";
                break;
        }
        $x = $concate . "-" . $data1['id'];
        return($x);
    }

}
