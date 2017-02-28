<?php

class SiteController extends Controller {

    const ALLOWED_IP = '127.0.0.1';

    /**
     * Declares class-based actions.
     */
    public function actions() {
        return array(
// captcha action renders the CAPTCHA image displayed on the contact page
            'captcha' => array(
                'class' => 'CCaptchaAction',
                'backColor' => 0xFFFFFF,
            ),
            // page action renders "static" pages stored under 'protected/views/site/pages'
// They can be accessed via: index.php?r=site/page&view=FileName
            'page' => array(
                'class' => 'CViewAction',
            ),
        );
    }

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex() {
        $model = new LoginForm;
        // collect user input data
        if (isset($_POST['LoginForm'])) {
            $model->attributes = $_POST['LoginForm'];
            // validate user input and redirect to the previous page if valid
            $model->validate();
            $model->login();
        }

        if (isset(\Yii::app()->theme) && strtoupper(\Yii::app()->theme->name) === Controller::B2C_THEME) {
            $redirect_url = '/b2c/flights';
            if (\Yii::app()->request->getParam('cs') != '') {
                $redirect_url = '/b2c/flights?cs=' . \Yii::app()->request->getParam('cs');
            }
            $this->redirect($redirect_url);
        }
        if (!Yii::app()->user->isGuest) {   // See this page if you are not guest
            if (\Authorization::getIsTopStaffLogged()) {
                $this->redirect('/site/page?view=internal');
            } else {
                $this->redirect('/airCart/admin');
            }
        }
        // All the guests should go to the /site/index page
        $this->render('index', ['model' => $model]);
    }

    /**
     * This is the action to handle external exceptions.
     */
    public function actionError() {
        if ($error = Yii::app()->errorHandler->error) {
            if (Yii::app()->request->isAjaxRequest) {
                echo $error['message'];
            } else {
                $this->render('error', $error);
            }
        }
    }

    /**
     * This is the action to handle external exceptions.
     */
    public function actionMessage() {
        $this->render('message', ['htmlMessage' => Yii::app()->user->getState('htmlMessage')]);
    }

    /**
     * Displays the contact page
     */
    public function actionContact() {
        $model = new ContactForm;
        if (isset($_POST['ContactForm'])) {
            if (\Yii::app()->request->isAjaxRequest) {
                $model->attributes = $_POST['ContactForm'];
                if ($model->validate()) {

                    $name = '=?UTF-8?B?' . base64_encode($model->name) . '?=';
                    $subject = '=?UTF-8?B?' . base64_encode($model->subject) . '?=';
                    $headers = "From: $name <{$model->email}>\r\n" .
                        "Reply-To: {$model->email}\r\n" .
                        "MIME-Version: 1.0\r\n" .
                        "Content-Type: text/html; charset=UTF-8";

                    mail(\Users::B2C_RECEPIENT_EMAIL, $subject, $model->body, $headers);

                    //mail to user
                    $cms = \Cms::model()->findByPk(['type_id' => \Cms::CMS_EMAIL_FOOTER, 'user_info_id' => \UserInfo::B2C_USER_INFO_ID]);
                    $body = '<html>Thank you for contacting us. Our Customer Support will contact you shortly.<br><br>' . $cms->content . '</html>';
                    $headers = "From: " . \Users::B2C_SENDER_NAME . "<" . \Users::B2C_SENDER_EMAIL . ">\r\n" .
                        "Reply-To: " . \Users::B2C_SENDER_EMAIL . "\r\n" .
                        "MIME-Version: 1.0\r\n" .
                        "Content-Type: text/html; charset=UTF-8";

                    mail($model->email, 'Contact', $body, $headers);

                    \Utils::jsonHeader();
                    echo json_encode([
                        'result' => 'success',
                    ]);
                    \Yii::app()->end();
                } else {

                    \Utils::jsonHeader();
                    $msg = '';
                    foreach ($model->errors as $error) {
                        $msg .= implode("\n", $error) . "\n";
                    }

                    echo json_encode([
                        'result' => 'error',
                        'message' => $msg,
                    ]);
                    \Yii::app()->end();
                }
            } else {

                $model->attributes = $_POST['ContactForm'];
                if ($model->validate()) {

                    $name = '=?UTF-8?B?' . base64_encode($model->name) . '?=';
                    $subject = '=?UTF-8?B?' . base64_encode($model->subject) . '?=';
                    $headers = "From: $name <{$model->email}>\r\n" .
                        "Reply-To: {$model->email}\r\n" .
                        "MIME-Version: 1.0\r\n" .
                        "Content-Type: text/plain; charset=UTF-8";

                    mail(Yii::app()->params['adminEmail'], $subject, $model->body, $headers);

                    Yii::app()->user->setFlash('contact', 'Thank you for contacting us. We will respond to you as soon as possible.');
                    $this->refresh();
                }
            }
        }

        $this->render('contact', array('model' => $model));
    }

    /**
     * Displays the login page
     *
     * public function actionLogin() {
     * $model = new LoginForm;
     *
     * // if it is ajax validation request
     * if (isset($_POST['ajax']) && $_POST['ajax'] === 'login-form') {
     * echo CActiveForm::validate($model);
     * Yii::app()->end();
     * }
     * // display the login form
     * $this->render('login2', array('model' => $model));
     * }
     */

    /**
     * Revive forgotten password
     */
    public function actionRevivepass($code = null) {
        Yii::app()->user->logout();
        $user = Users::model()->findByAttributes(array('pass_reset_code' => $code));
        if (!$user) { // No such user
            $error['message'] = 'The password revive code is invalid!';
            $error['msg'] = 'This link has expired.';
            $error['m'] = 'Please click on reset password to recieve new link.';
            $this->render('expire', $error);
        } else {    // The user is found
            if (isset($_POST['Users'])) {
                $user->attributes = $_POST['Users'];
                if ($user->validate('password, password2')) {
                    $user->password = Utils::passCrypt($_POST['Users']['password']);
                    $user->password2 = $user->password;
// For debug only
                    $user->pass_reset_code = null;
                    $user->last_login = date(DATETIME_FORMAT);
                    if ($user->save()) {
// Login the user
                        $model = new LoginForm;
                        $model->username = $user->email;
                        $model->password = $_POST['Users']['password'];
                        if ($model->validate() && $model->login()) {
                            $this->redirect('/site/index');
                        } else {
                            Yii::app()->session->open();
                            $errs = $model->getErrors();
//                            Yii::log($errs);
                            if (isset($errs['username'][0])) {
                                Yii::app()->session->add('htmlMessage', "The following errors were encountered: <b>" . $errs['username'][0] . '</b><br><br>If this is new registration please allow us 24 hours to setup the booking platform for you!<br>Feel free to call us with any questions that you may have.');
                            } else {
                                Yii::app()->session->add('htmlMessage', "The following errors were encountered:<br>" . print_r($errs, true));
                            }

                            $this->redirect('/site/message');
                        }
                    }
                }
            }

            $user->setScenario('passRevive');
//            $user->unsetAttributes(array('password', 'password2'));
            $this->render('revivepass', array('model' => $user));
        }
    }

    /**
     * Displays the forgotten Password page
     */
    public function actionForgotenpass() {
        $model = new Users('fogottenpass');

        if (isset($_POST['Users']['email'])) {
            $model = Users::model()->findByAttributes(array('email' => $_POST['Users']['email']));
            if (!$model) { // No such user
                $model = new Users('fogottenpass');
                $model->adderror('email', 'Client not found. Please check the email again!');
            } else {
                $model->verifyCode = isset($_POST['Users']['verifyCode']) ? \Yii::app()->request->getPost('Users')['verifyCode'] : null;
                if ($model->validate(['verifyCode'])) {
                    $model->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
                    if ($model->update(['pass_reset_code'])) {
                        $model->passResetEmail();
                        Yii::app()->user->setFlash(TbHtml::ALERT_COLOR_SUCCESS, "Instructions how to revive your password has been sent to your email.<br>Please check your email!");
                    }
                }
            }
        }

// display the login form
        $this->render('forgotenpass', ['model' => $model]);
    }
    /**
     * Logs out the current user and redirect to homepage.
     */
    public function actionLogout() {
        Yii::app()->user->logout();
        $url = Yii::app()->homeUrl;
        if (Yii::app()->request->urlReferrer !== null) {
              $url = Yii::app()->request->urlReferrer;
        }
        $this->redirect($url);
    }

    public function actionGetLocation() {
// we only allow deletion via POST request
        if (Yii::app()->request->isPostRequest && isset($_POST['object']) && isset($_POST['id'])) {
            $data = array();
            switch ($_POST['object']) {

                case 'country':
                    $data = Yii::app()->db->createCommand()
                        ->select('id, name')
                        ->from('state')
                        ->where('country_id = :country_id', array(':country_id' => (int) $_POST['id']))
                        ->order('name')
                        ->queryAll();
                    break;

                case 'state':
                    $data = Yii::app()->db->createCommand()
                        ->select('id, name')
                        ->from('city')
                        ->where('state_id = :state_id', array(':state_id' => (int) $_POST['id']))
                        ->order('name')
                        ->queryAll();
                    break;

                default:
                    $data = array('error' => 'Wrong parameter');
                    break;
            }
//            Yii::log(print_r($data, true));
            header("Content-Type: application/json; charset: UTF-8");
            echo json_encode($data, JSON_NUMERIC_CHECK);
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    public function actionPrint() {
        if (!Yii::app()->user->isGuest) {
            if (empty($_POST['url'])) {
                Utils::finalMessage('The content URL is not defined.');
            }
            if (empty($_POST['filename'])) {
                Utils::finalMessage('The PDF filename is not defined.');
            }
            $this->layout = '//layouts/print';
            if (empty($_POST['pdf'])) {
//                Utils::dbgYiiLog($this->getViewFile("/airCart/print"));
                $url = substr($_POST['url'], 0, strrpos($_POST['url'], '/'));
//                Utils::dbgYiiLog($url);
                $id = substr($_POST['url'], strrpos($_POST['url'], '/') + 1);
//                Utils::dbgYiiLog($id);
                $this->render($url, ['id' => $id]);
            } else {
                Yii::app()->pdf->send(Yii::app()->request->hostInfo . $_POST['url'], $_POST['filename']);
            }
        } else {
            Utils::finalMessage('Please login in the Belair travel platform, so you can enjoy the benefits of working with it.');
        }
    }

    public function actionRegister() {
        $model = new Users('siteReg');
        if (isset($_POST['Users'])) {
            $model->attributes = $_POST['Users'];
            $model->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
            if ($model->validate()) {
                $model->email = strtolower($model->email);
                $userInfoModel = new UserInfo('AutoReg');
                $userInfoModel->email = $model->email;
                $userInfoModel->city_id = 1;
                if ($userInfoModel->validate() && $userInfoModel->save()) {
                    $model->user_info_id = $userInfoModel->id;
                    $model->city_id = $userInfoModel->city_id;
                    $model->password = Utils::passCrypt($model->password);
                    $model->password2 = $model->password;
                    $model->save();
                    $model->welcomeEmail();
                    Yii::app()->session->add('htmlMessage', 'Your registration was success.<br>You will receive email with further instructions from us how to proceed.<br>Please check your inbox and if no email from us is found, check also your SPAM folder.');
                    $this->redirect('/site/message');
                }
            } else {
                print_r($model->errors);
                exit;
            }
        }
        $this->redirect(Yii::app()->user->returnUrl);
    }

    public function actionLogin() {
        $model = new LoginForm;
        // collect user input data
        if (isset($_POST['LoginForm'])) {
            $model->attributes = $_POST['LoginForm'];
            // validate user input and redirect to the previous page if valid
            $model->validate();
            $model->login();
        }
        if (!Yii::app()->user->isGuest) {   // See this page if you are not guest
            if (\Authorization::getIsTopStaffLogged()) {
                $this->redirect('/site/page?view=internal');
            } else {
                $this->redirect('/airCart/admin');
            }
        }
        $this->redirect(Yii::app()->user->returnUrl);
    }

    public function actionWorker($id) {
        if (\Yii::app()->request->userHostAddress !== self::ALLOWED_IP) {
            \Utils::finalMessage("This page is for internal use only. You are not welcome here!");
        }
        \Yii::import('application.commands.QueueCommand');
        $command = new QueueCommand("queue", "queue");
        $command->run(["worker", $id]);
//        echo \Utils::dbg($_SESSION);        
    }
    
    /**
     * Added By Satender
     * Purpose : For curreny converter to be used in scrapper
     * 
     */
    public function actionConvertCurrency() {
        if (\Yii::app()->request->userHostAddress !== self::ALLOWED_IP) {
            echo "This page is for internal use only. You are not welcome here!";
        }
        if (!empty($_GET['currency']) && !empty($_GET['amount'])) {
            $currency = $_GET['currency'];
            $amount = $_GET['amount'];
            $currency_to = \Currency::model()->cache(3600)->findByAttributes(['code' => "INR"]);
            $currency_from = \Currency::model()->cache(3600)->findByAttributes(['code' => $currency]);
            echo $currency_from->xChangeWithoutCommision((float) $amount, $currency_to->id);
        } else {
            echo 0;
        }
        \Yii::app()->end();
    }

}
