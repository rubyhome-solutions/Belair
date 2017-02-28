<?php

use application\components\PGs\Wallet\PayTM;
use application\components\PGs\Wallet\CCAvenue;
use application\components\PGs\EMIs\CCAvenueEMI;
use application\components\PGs\UPI;

\Yii::import('application.vendor.mobiledetect.Mobile_Detect', true);

class PayGateController extends Controller {

    /**
     * @var string the default layout for the views. Defaults to '//layouts/column1', meaning
     * using two-column layout. See 'protected/views/layouts/column1.php'.
     */
    public $layout = '//layouts/column1';

    /**
     * @return array action filters
     */
    public function filters() {
        return array(
            'accessControl', // perform access control for CRUD operations
            'postOnly + payU, delete', // we only allow deletion via POST request
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return array(
            ['allow', // allow all users to perform 'index' and 'view' actions
                'actions' => ['doPay', 'payU', 'payAgain', 'techProc', 'axis', 'amex', 'paymentFail', 'hdfc', 'zooz', 'changeCurrency', 'atom', 'hdfc2', 'payWallet', 'Paytm', 'CCAvenue', 'upi', 'upiView', 'hdfcRupay'],
                'users' => ['*'],
            ],
            array('allow', // allow authenticated user to ask for credit
                'actions' => ['creditRequest', 'manualPaymentRequest', 'refresh', 'capture', 'view'],
                'users' => ['@'],
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => ['admin', 'refund', 'externalRefund', 'sendEmail', 'sendSms'],
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('deny', // deny all users
                'users' => ['*'],
            ),
        );
    }

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id) {
        $this->render('view', ['model' => $this->loadModel($id)]);
    }

    /**
     * Display payment fail page.
     * @param int $id ID of the PayGateLog model
     */
    public function actionPaymentFail($id) {
        //\Utils::dbgYiiLog(['payment fail' => $_REQUEST]);
        $this->render('payment_fail', ['model' => $this->loadModel($id)]);
    }

    /**
     * Recreate the payment request using existing as a model.
     *
     * @param int $id The existing payment request
     */
    public function actionPayAgain($id) {
        $model = $this->loadModel($id);
        $pglts = new DateTime($model->updated);


        if (\Utils::getActiveCompanyId() != $model->user_info_id) {
            \Utils::finalMessage("You do not have permission do issue duplicate payment request. The request is denied!<br><br>If you are Staff member, be sure that you had choosen the correct B2B / B2E company or individual B2C user.");
        }
        if ($model->status_id === TrStatus::STATUS_NEW) {
            \Utils::finalMessage("This is brand new payment request. You can pay it here: " . CHtml::link('<b>link</b>', Yii::app()->createAbsoluteUrl("payGate/doPay", array("id" => $model->id))));
        }
        if ($model->status_id === TrStatus::STATUS_SUCCESS) {
            \Utils::finalMessage("This is succsessful payment request. You can check the payment itself here: " . CHtml::link('<b>link</b>', Yii::app()->createAbsoluteUrl("payment/view", array("id" => $model->payment->id))));
        }
        if ($model->status_id === TrStatus::STATUS_PENDING && ($pglts->diff(new DateTime('NOW'))->i < PayGateLog::MAX_PENDING_TIME && $pglts->diff(new DateTime('NOW'))->h == 0 && $pglts->diff(new DateTime('NOW'))->d == 0)) {
            \Utils::finalMessage("This is pending payment request. Please wait for at least " . PayGateLog::MAX_PENDING_TIME . " minutes before trying again.");
        }
        // Set the parameters for new payment
        $model->id = null;
        $model->isNewRecord = true;
        $model->cc_id = null;
        $model->hash_our = null;
        $model->hash_response = null;
        $model->pg_type = null;
        $model->payment_mode = null;
        $model->error = null;
        $model->bank_ref = null;
        $model->unmapped_status = null;
        $model->raw_response = null;
        $model->user_browser = null;
        $model->user_proxy = null;
        $model->user_ip = null;
        $model->action_id = null;
        $model->status_id = TrStatus::STATUS_NEW;
        $model->updated = date(DATETIME_FORMAT);
        $model->reason = null;    // We cant keep the same reason, since the error is here
        $model->request_id = null;
        $model->geoip = null;

        $model->insert();
        $this->redirect('/payGate/doPay/' . $model->id);
    }

    public function actionTechProc($id) {
        $model = $this->loadModel($id);
        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        $content = Yii::app()->request->getPost('msg');
        if (!$content) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }
        $techProc = new \application\components\TechProcess\TechProcess(null, null, $model->id, $model->pg_id);
        $content = $techProc->decrypt($content);
        if (is_string($content)) {
            throw new CHttpException(403, 'Incorrect hash. This attempt is logged, do not try it again');
        }
        $model->raw_response = json_encode($content);
        $model->updated = date(DATETIME_FORMAT);
        if ($content['txn_status'] === '0300') {
            $model->status_id = TrStatus::STATUS_SUCCESS;
        } else {
            $model->status_id = TrStatus::STATUS_FAILURE;
        }
        $model->bank_ref = \application\components\TechProcess\TechProcess::$bankRefs[$content['tpsl_bank_cd']] ? : $content['tpsl_bank_cd'];
        $model->error = $content['txn_err_msg'];
        $model->hash_response = $content['hash'];
        $model->unmapped_status = $content['txn_msg'];
        $model->request_id = $content['tpsl_txn_id'];
        $model->update();
        //echo \Utils::dbg($model->attributes);

        $transferType = TransferType::NET_BANKING;
        $typeName = "TP Netbanking: $model->bank_ref";
        $this->rendResponseView($id, $transferType, $typeName);
    }

    public function actionAxis($id) {
        $model = $this->loadModel($id);
        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        if (Yii::app()->request->getQuery('vpc_SecureHash') === null) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }
        if (!$model->checkSha256ResponseHash()) {
            throw new CHttpException(403, 'Incorrect hash. This attempt is logged, do not try it again');
        }
        unset($_GET['id']);
        $model->raw_response = json_encode($_GET);
        $model->updated = date(DATETIME_FORMAT);
        $responseCode = (string) Yii::app()->request->getQuery("vpc_TxnResponseCode");
        if ($responseCode !== "0") {
            $model->status_id = TrStatus::STATUS_FAILURE;
            $model->error = Yii::app()->request->getQuery('vpc_Message');
            $model->reason = Yii::app()->request->getQuery('vpc_Message');
            $model->unmapped_status = isset(\PaymentGateway::$axisResponseCode[$responseCode]) ? \PaymentGateway::$axisResponseCode[$responseCode] : "Not Set";
        } else {
            $model->status_id = TrStatus::STATUS_SUCCESS;
            $model->unmapped_status = Yii::app()->request->getQuery('vpc_Message');
            $model->reason = $model->unmapped_status;
        }
        $model->hash_response = Yii::app()->request->getQuery('vpc_SecureHash');
        $model->bank_ref = 'AXIS';
        $model->pg_type = 'AXIS';
        //$model->request_id = Yii::app()->request->getQuery('vpc_TransactionNo');
        $model->request_id = Yii::app()->request->getQuery('vpc_ReceiptNo');

        $model->update();
        // Decide the 3DS status for the used card
        \Yii::import('application.commands.SupportCommand');
        \SupportCommand::set3dStatus($model);
        //echo \Utils::dbg($model->attributes);

        $transferType = TransferType::CC_DEPOSIT;
        $typeName = "CC/DC payment via AXIS";

        $this->rendResponseView($id, $transferType, $typeName);
    }

    public function actionAxis2($id) {
        $model = $this->loadModel($id);
        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        if (Yii::app()->request->getQuery('vpc_SecureHash') === null) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }
        if (!$model->checkHDFC2Sha256ResponseHash()) {
            throw new CHttpException(403, 'Incorrect hash. This attempt is logged, do not try it again');
        }
        unset($_GET['id']);
        $model->raw_response = json_encode($_GET);
        $model->updated = date(DATETIME_FORMAT);
        $responseCode = (string) Yii::app()->request->getQuery("vpc_TxnResponseCode");
        if ($responseCode !== "0") {
            $model->status_id = TrStatus::STATUS_FAILURE;
            $model->error = Yii::app()->request->getQuery('vpc_Message');
            $model->reason = Yii::app()->request->getQuery('vpc_Message');
            $model->unmapped_status = isset(\PaymentGateway::$axisResponseCode[$responseCode]) ? \PaymentGateway::$axisResponseCode[$responseCode] : "Not Set";
        } else {
            $model->status_id = TrStatus::STATUS_SUCCESS;
            $model->unmapped_status = Yii::app()->request->getQuery('vpc_Message');
            $model->reason = $model->unmapped_status;
        }
        $model->hash_response = Yii::app()->request->getQuery('vpc_SecureHash');
        $model->bank_ref = 'AXIS2';
        $model->pg_type = 'AXIS2';
        $model->request_id = Yii::app()->request->getQuery('vpc_TransactionNo');
        $model->update();

        // Decide the 3DS status for the used card
        \Yii::import('application.commands.SupportCommand');
        \SupportCommand::set3dStatus($model);

        $transferType = TransferType::CC_DEPOSIT;
        $typeName = "CC/DC payment via AXIS2";

        $this->rendResponseView($id, $transferType, $typeName);
    }

    /**
     * Here we meet the result from the 3DS checking from the bank. New payment is generated in case of success.
     * @param int $id the PayGateLog model ID
     * @throws CHttpException
     */
    public function actionHdfc($id) {
        $model = $this->loadModel($id);
        if ($model->status_id !== \TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        $hdfc = new application\components\PGs\HDFC\FssPg($model, new \Cc);
        $res = $hdfc->authorizeSecondPart();
        $model->refresh();
        // Decide the 3DS status for the used card
        \Yii::import('application.commands.SupportCommand');
        \SupportCommand::set3dStatus($model);

        $cb = false;
        if (!empty($model->callback)) {
            $cb = json_decode($model->callback);
            if (!isset($cb[1])) {
                $cb[1] = [];
            }
        }

        // Error condition - rend the _payment_fail view and terminate
        if (isset($res['error']) || $model->status_id !== TrStatus::STATUS_SUCCESS) {
            if ($cb) {
                call_user_func_array($cb[0], $cb[1]);
            } else {
                $this->render('payment_fail', ['model' => $model]);     // Rend the view to try again
            }
            \Yii::app()->end();
        }

        // Everything is OK - register the new payment and show the payment success view
        $payment = $model->registerNewPayment(TransferType::CC_DEPOSIT, "CC/DC payment via HDFC");

        if ($cb) {
            // need to add payment as last parameter, by this function will know payment successful
            $cb[1][] = $payment;
            call_user_func_array($cb[0], $cb[1]);
        } else {
            Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            $this->redirect('/payment/view/' . $payment->id);  // Rend the payment view
//            $this->redirect('/payGate/' . $id);  // Rend the transaction view
        }
    }

    /**
     * For HDFC Rupay card
     * Here we meet the result from the auth checking of the bank in case of Error.
     * @throws CHttpException
     */
    public function actionHdfcRupay($id) {
        $model = $this->loadModel($id);
        $hdfc = new application\components\PGs\HDFC\FssPg($model, new \Cc);
        $response = array();
        unset($_REQUEST['id']);
        $response['POST_RESPONSE'] = $_REQUEST;
        $response['ENQ_RESPONSE'] = $hdfc->getRupayEnquiry($_REQUEST);
        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        if (!empty($_REQUEST['ErrorText'])) {
            $model->setRawResponse($response);
            $model->update();
            throw new CHttpException(403, $_REQUEST['ErrorText']);
        }
        if (empty($_REQUEST['trackid']) || empty($_REQUEST['amt']) || $_REQUEST['trackid'] != $model->id ||
            (double) str_replace(',', '', $_REQUEST['amt']) != (double) ($model->amount + $model->convince_fee)) {
            $model->setRawResponse($response);
            $model->update();
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }

        $model->setRawResponse($response);
        $status = isset($_REQUEST['result']) ? $_REQUEST['result'] : '';
        $model->updated = date(DATETIME_FORMAT);
        if ($status == 'CAPTURED' && $response['ENQ_RESPONSE']['error'] == null && $response['ENQ_RESPONSE']['response']->result == 'CAPTURED') {
            $model->status_id = TrStatus::STATUS_SUCCESS;
            $model->unmapped_status = Yii::app()->request->getQuery('authRespCode');
            $model->reason = $status;
            $model->bank_ref = Yii::app()->request->getQuery('ref');
            $model->request_id = Yii::app()->request->getQuery('tranid');
            $model->token = Yii::app()->request->getQuery('tranid');
        } else {
            $model->status_id = TrStatus::STATUS_FAILURE;
            $model->error = ($status !== '') ? $status : Yii::app()->request->getQuery('ErrorText');
            $model->reason = ($status !== '') ? $status : Yii::app()->request->getQuery('Error');
            $model->bank_ref = (Yii::app()->request->getQuery('ref') !== null) ? Yii::app()->request->getQuery('ref') : '';
            $model->request_id = (Yii::app()->request->getQuery('tranid') !== null) ? Yii::app()->request->getQuery('tranid') : '';
            $model->token = (Yii::app()->request->getQuery('tranid') !== null) ? Yii::app()->request->getQuery('tranid') : '';
            $model->unmapped_status = (Yii::app()->request->getQuery('result') !== null) ? Yii::app()->request->getQuery('authRespCode') : "Not Set";
        }
        $model->hash_response = json_encode($_REQUEST);
        $model->pg_type = 'HDFC Rupay';

        $model->update();
        $transferType = TransferType::CC_DEPOSIT;
        $typeName = "Rupay card  payment via HDFC";

        $this->rendResponseView($id, $transferType, $typeName);
    }

    /**
     * Here we meet the result from the auth checking of the bank. New payment is generated in case of success.
     * @param int $id the PayGateLog model ID
     * @throws CHttpException
     */
    public function actionAtom($id) {
//        \Utils::logRequest('Logging Atom response');
//        return;
        $model = $this->loadModel($id);
        if ($model->status_id !== \TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        $atom = new application\components\PGs\Atom\Paynetz($model);
        $res = $atom->finalResult();
        $model->refresh();

        $cb = false;
        if (!empty($model->callback)) {
            $cb = json_decode($model->callback);
            if (!isset($cb[1])) {
                $cb[1] = [];
            }
        }

        // Error condition - rend the _payment_fail view and terminate
        if (isset($res['error']) || $model->status_id !== TrStatus::STATUS_SUCCESS) {
            if ($cb) {
                call_user_func_array($cb[0], $cb[1]);
            } else {
                $this->render('payment_fail', ['model' => $model]);     // Rend the view to try again
            }
            \Yii::app()->end();
        }

        // Everything is OK - register the new payment and show the payment success view
        $payment = $model->registerNewPayment(TransferType::AC_DEPOSIT, "NetBanking payment via ATOM");

        if ($cb) {
            // need to add payment as last parameter, by this function will know payment successful
            $cb[1][] = $payment;
            call_user_func_array($cb[0], $cb[1]);
        } else {
            Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            $this->redirect('/payment/view/' . $payment->id);  // Rend the payment view
//            $this->redirect('/payGate/' . $id);  // Rend the transaction view
        }
    }

    /**
     * Here we meet the result from the auth checking of the bank. New payment is generated in case of success.
     * @param int $id the PayGateLog model ID
     * @throws CHttpException
     */
    public function actionHdfc2($id) {
//        \Utils::logRequest(__METHOD__);
//        return;
        $model = $this->loadModel($id);
        if ($model->status_id !== \TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        if (Yii::app()->request->getQuery('vpc_SecureHash') === null) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }
        if (!$model->checkHDFC2Sha256ResponseHash()) {
            throw new CHttpException(403, 'Incorrect hash. This attempt is logged, do not try it again');
        }
        $pg = new application\components\PGs\HDFC2\Pg($model);
        $res = $pg->finalResult();
        $model->refresh();

        $cb = false;
        if (!empty($model->callback)) {
            $cb = json_decode($model->callback);
            if (!isset($cb[1])) {
                $cb[1] = [];
            }
        }

        // Error condition - rend the _payment_fail view and terminate
        if (isset($res['error']) || $model->status_id !== TrStatus::STATUS_SUCCESS) {
            if ($cb) {
                call_user_func_array($cb[0], $cb[1]);
            } else {
                $this->render('payment_fail', ['model' => $model]);     // Rend the view to try again
            }
            \Yii::app()->end();
        }

        // Everything is OK - register the new payment and show the payment success view
        $payment = $model->registerNewPayment(TransferType::AC_DEPOSIT, "Payment via HDFC2");

        if ($cb) {
            // need to add payment as last parameter, by this function will know payment successful
            $cb[1][] = $payment;
            call_user_func_array($cb[0], $cb[1]);
        } else {
            Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            $this->redirect('/payment/view/' . $payment->id);  // Rend the payment view
//            $this->redirect('/payGate/' . $id);  // Rend the transaction view
        }
    }

    /**
     * Here we meet the result from the 3DS checking from the bank. New payment is generated in case of success.
     * @param int $id the PayGateLog model ID
     * @throws CHttpException
     */
    public function actionZooz($id) {
        \Utils::logRequest(__METHOD__);
        $model = $this->loadModel($id);
        if ($model->status_id !== \TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        $zooz = new application\components\PGs\Zooz\Zooz($model);
        $res = $zooz->authorizeSecondPart($_POST);
        $model->refresh();


        $cb = false;
        if (!empty($model->callback)) {
            $cb = json_decode($model->callback);
            if (!isset($cb[1])) {
                $cb[1] = [];
            }
        }

        // Error condition - rend the _payment_fail view and terminate
        if (isset($res['error']) || $model->status_id !== TrStatus::STATUS_SUCCESS) {
            if ($cb) {
                call_user_func_array($cb[0], $cb[1]);
            } else {
                $this->render('payment_fail', ['model' => $model]);     // Rend the view to try again
            }
            \Yii::app()->end();
        }

        // Everything is OK - register the new payment and show the payment success view
        $payment = $model->registerNewPayment(TransferType::CC_DEPOSIT, "CC/DC payment via ZooZ");

        if ($cb) {
            // need to add payment as last parameter, by this function will know payment successful
            $cb[1][] = $payment;
            call_user_func_array($cb[0], $cb[1]);
        } else {
            Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
            $this->redirect('/payment/view/' . $payment->id);  // Rend the payment view
        }
    }

    public function actionAmex($id) {
        $model = $this->loadModel($id);
        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        if (Yii::app()->request->getQuery('vpc_SecureHash') === null) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }
        if (!YII_DEBUG) {
            if (!$model->checkMd5ResponseHash()) {
                throw new CHttpException(403, 'Incorrect hash. This attempt is logged, do not try it again');
            }
        }
        unset($_GET['id']);
        $model->raw_response = json_encode($_GET);
        $model->updated = date(DATETIME_FORMAT);
        $responseCode = (string) Yii::app()->request->getQuery("vpc_TxnResponseCode");
        if ($responseCode !== "0") {
            $model->status_id = TrStatus::STATUS_FAILURE;
            $model->error = Yii::app()->request->getQuery('vpc_Message');
            $model->reason = Yii::app()->request->getQuery('vpc_Message');
            $model->unmapped_status = isset(\PaymentGateway::$axisResponseCode[$responseCode]) ? \PaymentGateway::$axisResponseCode[$responseCode] : "Not Set";
        } else {
            $model->status_id = TrStatus::STATUS_SUCCESS;
            $model->unmapped_status = Yii::app()->request->getQuery('vpc_Message');
            $model->reason = $model->unmapped_status;
        }
        $model->hash_response = Yii::app()->request->getQuery('vpc_SecureHash');
        $model->bank_ref = Yii::app()->request->getQuery('vpc_TransactionIdentifier');
        $model->pg_type = 'AMEX';
        $model->request_id = Yii::app()->request->getQuery('vpc_TransactionNo');

        $model->update();
        // Decide the 3DS status for the used card
        \Yii::import('application.commands.SupportCommand');
        \SupportCommand::set3dStatus($model);
//        echo \Utils::dbg($model->attributes);

        $transferType = TransferType::CC_DEPOSIT;
        $typeName = "CC/DC payment via AMEX";
        $this->rendResponseView($id, $transferType, $typeName);
    }

    /**
     * Accept the payment responses from PayU
     * @param int  $id
     * @throws CHttpException
     */
    public function actionPayU($id) {
        $model = $this->loadModel($id);
        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        if (!$model->checkPayuResponseHash()) {
            throw new CHttpException(403, 'Incorrect hash. This attempt is logged, do not try it again');
        }
// Hide the last card numbers
        if (isset($_POST['cardnum'])) {
            $_POST['cardnum'] = Cc::ccMask($_POST['cardnum']);
        }
        $model->raw_response = json_encode($_POST);
        $model->updated = date(DATETIME_FORMAT);
        if (Yii::app()->request->getPost('status') == 'success') {
            $model->status_id = TrStatus::STATUS_SUCCESS;
        } else {
            $model->status_id = TrStatus::STATUS_FAILURE;
        }
// To test the failiure
//        $model->status_id = TrStatus::STATUS_FAILURE;
        $model->bank_ref = Yii::app()->request->getPost('bank_ref_num');
        $model->error = Yii::app()->request->getPost('error_Message');
        $model->hash_response = Yii::app()->request->getPost('hash');
        $model->unmapped_status = Yii::app()->request->getPost('unmappedstatus');
        $model->request_id = Yii::app()->request->getPost('mihpayid');
        $model->pg_type = Yii::app()->request->getPost('PG_TYPE');
        $model->update();
        // Decide the 3DS status for the used card
        \Yii::import('application.commands.SupportCommand');
        \SupportCommand::set3dStatus($model);

        $transferType = '';
        $typeName = '';
        $transferType = TransferType::CC_DEPOSIT;
        $typeName = "CC/DC payment via PayU, Bank code: $model->pg_type , Bank reference: $model->bank_ref";
        $this->rendResponseView($id, $transferType, $typeName);
    }

    public function actionDoPay($id) {
        $model = $this->loadModel($id);
        $pglts = new DateTime($model->updated);
        if ($model->status_id == TrStatus::STATUS_FAILURE || ( $model->status_id === TrStatus::STATUS_PENDING && ($pglts->diff(new DateTime('NOW'))->i > PayGateLog::MAX_PENDING_TIME || $pglts->diff(new DateTime('NOW'))->h > 0 || $pglts->diff(new DateTime('NOW'))->d > 0))) {
            if (isset($_POST['b2cApi'])) {
                \Utils::jsonHeader();
                echo json_encode([
                    'message' => "Payment Failed",
                    'data' => null
                ]);
            }
            $this->redirect('/payGate/payAgain/' . $model->id);
            Yii::app()->end();
        } else if ($model->status_id === TrStatus::STATUS_PENDING) {
            Yii::app()->session->add('htmlMessage', "If your payment was not successful then please wait for at least " . PayGateLog::MAX_PENDING_TIME . " minutes before trying again!");
            if (Yii::app()->request->isAjaxRequest) {
                \Utils::jsonHeader();
                echo json_encode([
                    'url' => Yii::app()->createAbsoluteUrl('site/message'),
                    'data' => null
                ]);
            } else if (isset($_POST['b2cApi'])) {
                \Utils::jsonHeader();
                echo json_encode([
                    'message' => "If your payment was not successful then please wait for at least " . PayGateLog::MAX_PENDING_TIME . " minutes before trying again!",
                    'data' => null
                ]);
            } else {
                $this->redirect('/site/message', true, 302);
            }
            Yii::app()->end();
        } else if ($model->status_id !== TrStatus::STATUS_NEW) {
            Yii::app()->session->add('htmlMessage', "This payment request is already processed. You can not pay for it again!");
            if (Yii::app()->request->isAjaxRequest) {
                \Utils::jsonHeader();
                echo json_encode([
                    'url' => Yii::app()->createAbsoluteUrl('site/message'),
                    'data' => null
                ]);
            } else if (isset($_POST['b2cApi'])) {
                \Utils::jsonHeader();
                echo json_encode([
                    'message' => "If your payment was not successful then please wait for at least " . PayGateLog::MAX_PENDING_TIME . " minutes before trying again!",
                    'data' => null
                ]);
            } else {
                $this->redirect('/site/message', true, 302);
            }
            Yii::app()->end();
        }

        // Set the transaction original currency if missing
        if (empty($model->original_currency_id)) {
            $model->original_currency_id = $model->currency_id;
            $model->original_amount = $model->amount;
            $model->original_convince_fee = $model->convince_fee;
            $model->update(['original_currency_id', 'original_amount', 'original_convince_fee']);
        }

        if ((\Yii::app()->request->isAjaxRequest || isset($_POST['b2cApi'])) && isset($_POST)) {
            //   if (isset($_POST)) {
            // Set the callback
            $cb = false;
            if (!empty($model->callback)) {
                $cb = json_decode($model->callback);
                if (!isset($cb[1])) {
                    $cb[1] = [];
                }
            }

            $indianCcFlag = false;
            if (isset($_POST['card_number']) && isset($_POST['name_on_card']) && isset($_POST['expiry_month']) &&
                isset($_POST['expiry_year']) && isset($_POST['cvv'])) {

                $storedCardId = Yii::app()->request->getPost('storedCardId', false);
                if (empty($_POST['card_number']) && $storedCardId && \Utils::getActiveCompanyId()) {
                    $cc = \Cc::model()->findByPk($storedCardId);
                } else {
                    $cc = \Cc::model()->findByAttributes([
                        'hash' => md5($_POST['card_number']),
                        'user_info_id' => $model->user_info_id
                    ]);

                    if ($cc) {
                        // re-save the card if it is saved on different server
                        if (!$cc->decode($cc->number)) {
                            $cc->number = $_POST['card_number'];

                            $cc->mask = \Cc::ccMask($cc->number);
                            $cc->hash = md5($cc->number);
                            $cc->bin_id = (int) substr($cc->number, 0, 6);
                            // Create new bin
                            \BinList::insertIfMissing($cc->bin_id);
                            // Encrypt the number
                            $cc->number = \Cc::encode($cc->number);
                            $cc->save();

                            $cc->number = $_POST['card_number'];
                        }

                        // update the attributes
                        $changed = [];
                        if ($cc->deleted != Yii::app()->request->getPost('store_card', 0) ^ 1) {
                            $cc->deleted = Yii::app()->request->getPost('store_card', 0) ^ 1;
                            $changed[] = 'deleted';
                        }

                        if ($cc->exp_date !== $_POST['expiry_year'] . "-" . $_POST['expiry_month'] . "-01") {
                            $cc->exp_date = $_POST['expiry_year'] . "-" . $_POST['expiry_month'] . "-01";
                            $changed[] = 'exp_date';
                        }

                        if ($cc->name !== $_POST['name_on_card']) {
                            $cc->name = $_POST['name_on_card'];
                            $changed[] = 'name';
                        }

                        if (count($changed)) {
                            $cc->update($changed);
                        }
                    }
                }
                if ($cc === null) {
                    //  \Yii::import("ext.ECCRupayValidator");
                    $ccType = '';
                    if (!empty($_POST['cc']['type'])) {
                        $ccType = $_POST['cc']['type'];
                    } else if (!empty($_POST['CCAvenueEmi']['type'])) {
                        $ccType = $_POST['CCAvenueEmi']['type'];
                    }
                    $ecc = ($ccType == ECCRupayValidator::RUPAY) ? new ECCRupayValidator : new ECCValidator2;
                    $cc = new Cc;
                    $cc->number = $_POST['card_number'];
                    $cc->type_id = Cc::$ccTypes[$ecc->cardType($cc->number)];
                    $cc->name = $_POST['name_on_card'];
                    $cc->exp_date = $_POST['expiry_year'] . "-" . $_POST['expiry_month'] . "-01";
//                    $cc->note = $_POST['store_card_label']? : null;       // No labels
                    $cc->user_info_id = $model->user_info_id;
                    // Mark the card as deleted if not choosen for storage
                    $cc->deleted = Yii::app()->request->getPost('store_card', 0) ^ 1;
                    $cc->insert();
                }

                if ($cc->bin->country_code == 'IN' && $cc->type_id != CcType::TYPE_AMEX) {
                    $indianCcFlag = true;   // We have Indian card, that is not AMEX
                }
                $cc->code = Yii::app()->request->getPost('cvv');     //Temp code set - this attribute is not stored
                $model->cc_id = $cc->id;
            }

            $outParams = '';
            // Is this INR ?
            $indianCurrency = ($model->currency_id == \Currency::INR_ID);

            // Testing new PG
//            if (YII_DEBUG && $model->pg_id === \PaymentGateway::HDFC2_TEST) {   // New HDFC2 test on dev
//                $pg = new \application\components\PGs\HDFC2\Pg($model, $cc->code);
//                $res = $pg->startNewTransaction();
//                // Error condition - rend the _payment_fail view and terminate
//                if (isset($res['error'])) {
//                    $redirectUrl = "/payGate/paymentFail/$model->id";     // Redirect to the page to try again
//                }
//                if (isset($res['url'])) {
//                    $redirectUrl = $res['url'];
//                    $outParams = $res['outParams'];
//                }
//            }
            // Is this a Indian payment?
            if (Yii::app()->request->getPost('category') == 'EMI') {
                $_POST = array_merge($_POST, ['url' => \Yii::app()->request->hostInfo . '/payGate/ccavenue/' . $model->id]);
                $outParams = CCAvenueEMI\CCAvenueEMI::newTransaction($_POST, $model);
                $redirectUrl = $model->pg->api_url;
                if (!empty($outParams['encRequest']) && !empty($outParams['access_code'])) {
                    $model->hash_our = $outParams['encRequest'];
                    $redirectUrl = $model->pg->base_url . CCAvenue\CCAvenue::NEW_TRANSACTION_URL;
                }
            } elseif ($indianCurrency && $indianCcFlag && empty($outParams)) {     // Use this row after the testing
//            if ($indianCurrency && isset($cc) && $cc->type_id != \CcType::TYPE_AMEX) {     // Use this row to avoid AXIS that has fire issues
//            if (($indianCurrency && $indianCcFlag) || in_array($model->pg_id, \PaymentGateway::$hdfc2IdList)) {   // For testing purposes only!
                
                if(!empty($model->pg_id) && in_array($model->pg_id, \PaymentGateway::$hdfcIdList)){//for Rupay card
                    $fsspg = new \application\components\PGs\HDFC\FssPg($model, $cc);
                    $res = $fsspg->authorize();                   
                } else if (!in_array($model->pg_id, \PaymentGateway::$hdfc2IdList)) {   // Force HDFC2 PG if INR and Indian card
                    $model->pg_id = YII_DEBUG ? \PaymentGateway::HDFC2_TEST : \PaymentGateway::HDFC2_PRODUCTION;
                    $model->update(['pg_id']);
                    $pg = new \application\components\PGs\HDFC2\Pg($model, $cc->code);
                    $res = $pg->startNewTransaction();
                }
                // Error condition - rend the _payment_fail view and terminate
                if (isset($res['error'])) {
                    $redirectUrl = "/payGate/paymentFail/$model->id";     // Redirect to the page to try again
                    $outParams = $res;
                }
                if (isset($res['url'])) {
                    $redirectUrl = $res['url'];
                    $outParams = $res['outParams'];
                }
            } elseif (isset($cc) && empty($outParams)) {  // We have a CC
                if ($indianCurrency && $cc->type_id == \CcType::TYPE_AMEX) {    // AMEX process
                    if (!in_array($model->pg_id, \PaymentGateway::$amexIdList)) {   //Change the PG if it is not one of the AMEX gateways
                        $model->pg_id = YII_DEBUG ? \PaymentGateway::AMEX_TEST : \PaymentGateway::AMEX_PRODUCTION;
                        $model->update(['pg_id']);
                    }
                    // Calculate the initial hash
                    $outParams = $model->createOurAmexHashAndParams();
                } elseif (!$indianCurrency) {   // Non INR currency
                    // Use Zooz
                    if (!in_array($model->pg_id, \PaymentGateway::$zoozIdList)) {   //Change the PG if it is not one of the HDFC
                        /**
                         * @todo Change this to ZOOZ production once the tests are over
                         */
                        $model->pg_id = YII_DEBUG ? \PaymentGateway::ZOOZ_TEST : \PaymentGateway::ZOOZ_PRODUCTION;
                        $model->update(['pg_id']);
                    }
                    $zooz = new \application\components\PGs\Zooz\Zooz($model, $cc->code);
                    $res = $zooz->authorize();
                    // Error condition - rend the _payment_fail view and terminate
                    if (isset($res['error'])) {
                        $redirectUrl = "/payGate/paymentFail/$model->id";     // Redirect to the page to try again
                    }
                    if (isset($res['url'])) {
                        $redirectUrl = $res['url'];
                        $outParams = $res['outParams'];
                    }
                } else {    // Do a HDFC2 payment by default when we have CC object?
                    //Old AXIS code 
//                    if (!in_array($model->pg_id, \PaymentGateway::$axisIdList)) {   //Change the PG if it is not one of the AXIS gateways
//                        $model->pg_id = YII_DEBUG ? \PaymentGateway::AXIS_TEST : \PaymentGateway::AXIS_PRODUCTION;
//                        $model->update(['pg_id']);
//                    }
                    // Calculate the initial hash
//                    $outParams = $model->createOurAxisHashAndParams();
                    // Force HDFC2 payment
                    $model->pg_id = YII_DEBUG ? \PaymentGateway::HDFC2_TEST : \PaymentGateway::HDFC2_PRODUCTION;
                    $model->update(['pg_id']);
                    $pg = new \application\components\PGs\HDFC2\Pg($model, $cc->code);
                    $res = $pg->startNewTransaction();

                    // Error condition - rend the _payment_fail view and terminate
                    if (isset($res['error'])) {
                        $redirectUrl = "/payGate/paymentFail/$model->id";     // Redirect to the page to try again
                    }
                    if (isset($res['url'])) {
                        $redirectUrl = $res['url'];
                        $outParams = $res['outParams'];
                    }
                }
            }

            // Is this a TechProc payment?
            $bank = Yii::app()->request->getPost('tpBank');
            $atomBank = \Yii::app()->request->getPost('atomBank');
            if (in_array($model->pg_id, \PaymentGateway::$techProcIdList) && $bank) {
                if ($model->pg_id === \PaymentGateway::TECH_PROCESS_TEST) {
                    $model->amount = '12';
                }
                $techProc = new application\components\TechProcess\TechProcess('T', $model->amount, $model->id, $model->pg_id, $bank);
                $techProc->createPayload();
                $url = $techProc->sendRequest();
                if (strtolower(substr($url, 0, 4)) !== 'http') {
                    Yii::app()->session->add('htmlMessage', "Tech Process error: <b>$url</b>");
                    $model->pg->base_url = \Utils::MESSAGE_URL;
                } else {
                    $model->pg->base_url = $url;
                }
            } elseif (in_array($model->pg_id, \PaymentGateway::$atomIdList) && $atomBank) {   // ATOM PG
                $model->bank_ref = $atomBank;
                $atom = new application\components\PGs\Atom\Paynetz($model);
                $res = $atom->startNewTransaction();
                $model->refresh();
                // Error condition - rend the _payment_fail view and terminate
                if (isset($res['error'])) {
                    $redirectUrl = "/payGate/paymentFail/$model->id";     // Redirect to the page to try again
                } else {
                    $redirectUrl = $res['url'];
                    $outParams = $res['outParams'];
                }
            } elseif (Yii::app()->request->getPost('category') == 'wallet') {
                if (Yii::app()->request->getPost('type') == \PaymentConfiguration::PAYTM && (in_array($model->pg_id, \PaymentGateway::$paytmIdList) )) {
                    //throw new CHttpException(403, 'PayTM wallet payment option not available.');
                    $_POST = array_merge($_POST, ['url' => \Yii::app()->request->hostInfo . '/payGate/paytm/' . $model->id]);
                    $outParams = PayTM\PayTM::newTransaction($_POST, $model);
                    $redirectUrl = $model->pg->api_url;
                    if (!empty($outParams['CHECKSUMHASH'])) {
                        $model->hash_our = $outParams['CHECKSUMHASH'];
                    }
                } else if (Yii::app()->request->getPost('type') == \PaymentConfiguration::CCAVENUE_WALLET && (in_array($model->pg_id, \PaymentGateway::$ccavenueIdList) )) {
                    $_POST = array_merge($_POST, ['url' => \Yii::app()->request->hostInfo . '/payGate/ccavenue/' . $model->id]);
                    $outParams = CCAvenue\CCAvenue::newTransaction($_POST, $model);
                    if (!empty($outParams['encRequest']) && !empty($outParams['access_code'])) {
                        $model->hash_our = $outParams['encRequest'];
                        $redirectUrl = $model->pg->base_url . CCAvenue\CCAvenue::NEW_TRANSACTION_URL;
                    }
                }
            } elseif (Yii::app()->request->getPost('category') == 'UPI') {
                $outParams = UPI\HDFC\UPI::newTransaction($_POST, $model);
                $redirectUrl = '';
            } elseif (!isset($cc)) {   // Use PayU for net banking only
                //Change the PG if it is not one of the PayU gateways
                $model->pg_id = YII_DEBUG ? \PaymentGateway::PAYU_TEST_ID : \PaymentGateway::PAYU_PRODUCTION_ID;
                $model->update(['pg_id']);
                // Category
                $model->payment_mode = $model->getPayuCategories($_POST['category']);
                // Calculate the initial hash
                $outParams = $model->createOurPayuHashAndParams();
            }

            $this->setBrowserAndGeoIp($model);

            $model->action_id = TrAction::ACTION_SENT;
            // Do not change the status if the payment is marked as failiure
            if ($model->status_id !== TrStatus::STATUS_FAILURE) {
                $model->status_id = TrStatus::STATUS_PENDING;
            }
            $model->updated = date(DATETIME_FORMAT);
            $model->update();
            \Utils::jsonHeader();
            echo json_encode([
                'url' => isset($redirectUrl) ? $redirectUrl : $model->pg->base_url,
                'data' => $outParams
            ]);
            Yii::app()->end();
        }
        if (isset(\Yii::app()->theme) && strtoupper(\Yii::app()->theme->name) === Controller::B2C_THEME) {
            $detect = new \Mobile_Detect;
            if ($detect->isMobile()) {
                //$this->render('doPay', ['model' => $model]);
                $this->layout = '//layouts/mobile';
                $this->render('doPay', ['model' => $model, 'isMobile' => 'Yes']);
            } else {
                $this->render('doPay', ['model' => $model]);
            }
        } else {
            $this->render('doPay', ['model' => $model]);
        }
    }

    /**
     * manualPaymentRequests a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionManualPaymentRequest() {
        $model = new PayGateLog;
        // Set default currencies
//        $model->currency_id = \Currency::INR_ID;
//        $model->original_currency_id = \Currency::INR_ID;
        // Set the PG defaults based on the client type
        $model->pg_id = \PaymentGateway::chooseDefaultPg();

        if (isset($_POST['PayGateLog'])) {
            $model->attributes = $_POST['PayGateLog'];
            if (empty($model->user_info_id)) {
                $model->user_info_id = \Utils::getActiveCompanyId() ? : null;
            }
            $isStaffLogged = Authorization::getIsStaffLogged();
            if (!empty($_POST['autoConvinceFee'])) {   // Let Michael decide the convenience fee
                $model->convince_fee = $model->convenienceFee();
            }
            if (!$isStaffLogged) {
                $model->convince_fee = $model->convenienceFee();
                $model->note = 'Deposit request created by the client';
            }
            if (!empty($model->air_cart_id) && AirCart::model()->findByPk($model->air_cart_id) === null) {
                $model->addError('air_cart_id', 'Invalid Air Cart ID');
            }
            if (empty($_POST['doNotSave']) && $model->validate(null, false)) {
                $model->reason = htmlentities($model->reason);
                $model->note = htmlentities($model->note);
                $model->save();
                if (!$isStaffLogged) {  // Go directly to do the payment
                    $this->redirect("doPay/$model->id");
                }
                if ($model->userInfo->user_type_id === \UserType::clientB2C) {
                    $url = \Controller::B2C_BASE_URL . "/payGate/doPay/$model->id";
                } else {
                    $url = \Yii::app()->createAbsoluteUrl("payGate/doPay/$model->id");
                }
                Yii::app()->user->setFlash('msg', "<b>The new payment request is created and is ready!</b><br><div style='margin-top: 10px;'>" .
                    TbHtml::link('Go to the payment', $url, ['class' => 'btn btn-warning', 'style' => 'margin-right:15px']) .
                    TbHtml::button('Send as SMS', ['class' => 'btn btn-small btn-info', 'style' => 'margin-right:15px', 'onclick' => '$.post("/payGate/sendSms/' . $model->id . '"); alert("SMS sent"); $(this).blur();']) .
                    TbHtml::button('Send as Email', ['class' => 'btn btn-small btn-info', 'onclick' => '$.post("/payGate/sendEmail/' . $model->id . '"); alert("Email sent"); $(this).blur();']) .
                    "</div>"
                );
            }
        }

        $this->render('manualPaymentRequest', ['model' => $model]);
    }

    /**
     * Refresh payment transaction with the payment provider
     */
    public function actionRefresh() {
        // @param int $id The transaction ID
        $id = Yii::app()->request->getPost('id');
        \Utils::jsonHeader();
        $model = $this->loadModel($id);
        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            echo json_encode(['error' => 'This transaction is not pending. The data is final']);
            Yii::app()->end();
        }
        // Permission check
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != \Utils::getActiveCompanyId()) {
            echo json_encode(['error' => 'You do not have authorization to refresh this transaction']);
            Yii::app()->end();
        }
        $result = $model->pg->refreshWithProvider($model->id);
        echo json_encode($result);
    }

    public function actionCapture() {
        // @param int $id The transaction ID
        $id = Yii::app()->request->getPost('id');
        \Utils::jsonHeader();
        $model = $this->loadModel($id);
        if ($model->status_id !== TrStatus::STATUS_SUCCESS) {
            echo json_encode(['error' => 'This transaction is not succesful. Can not perform capture']);
            Yii::app()->end();
        }
        // Permission check
        if (!Authorization::getIsStaffLogged()) {
            echo json_encode(['error' => 'You do not have authorization to perform capture operations']);
            Yii::app()->end();
        }
        $result = $model->pg->captureWithProvider($model->id);
        echo json_encode($result);
    }

    /**
     * Refund payment transaction with the payment provider
     * @param int $id The transaction ID
     */
    public function actionRefund($id) {
        $model = $this->loadModel($id);
        // Permission check
        if (!Authorization::getIsStaffLogged()) {
            \Utils::finalMessage('You do not have authorization to refund this transaction');
        }
        if ($model->status_id !== TrStatus::STATUS_SUCCESS) {
            Yii::app()->user->setFlash('msg', 'This transaction is not successful. Can not be refunded');
            $this->redirect('/payGate/admin');
        }
        $post = Yii::app()->request->getPost('PayGateLog');
        $model2 = new PayGateLog;
        $totalRefunds = $model->refundsSum();
        $model2->amount = $model->amount - $totalRefunds;
        $model2->currency_id = $model->currency_id;
        $model2->original_amount = $model->original_amount;
        $model2->original_currency_id = $model->original_currency_id;
        $model2->original_convince_fee = $model->original_convince_fee;
        $model2->air_cart_id = $model->air_cart_id;
        if ($post !== null && isset($post['amount'])) {
            $model2->amount = (int) $post['amount'];
            $model2->reason = $post['reason'] ? : null;
            $model2->note = $post['note'] ? : null;
            if ($model2->amount > $model->userInfo->balance) {
                $model2->addError('amount', "The client balance is too low <b>{$model->userInfo->balance}</b> That is not enough for the refund!");
            }
            if ($model2->amount < 3) {
                $model2->addError('amount', "The refund amount should be bigger than 2");
            }
            if ($model2->amount > $model->amount) {
                $model2->addError('amount', "The total amount for this transaction is <b>{$model->amount}</b><br>You can not refund more than that!");
            } elseif ($model2->amount > ($model->amount - $totalRefunds)) {
                $model2->addError('amount', "The total refunds for this transaction are <b>{$totalRefunds}</b><br>The current transaction balance is: <b>" . ($model->amount - $totalRefunds) . "</b><br>You can not refund more than the current balance!");
            }
            if (!$model2->hasErrors()) {  // No errors , we can proceed
                $model2->action_id = TrAction::ACTION_REFUND;
                $model2->status_id = TrStatus::STATUS_PENDING;
                $model2->pg_id = $model->pg_id;
                $model2->user_info_id = $model->user_info_id;
                $model2->token = $model->request_id;
                $model2->hash_our = $model->id;
                $model2->setBasics();
                $model2->insert();
                $result = $model->pg->refundWithProvider($model2->id);
                Yii::app()->user->setFlash('msg', $result);
                $this->redirect('/payGate/admin');
            }
        }

        $this->render('refund', ['model' => $model2]);
    }

    /**
     * External refund
     * @param int $id The transaction ID
     */
    public function actionExternalRefund($id) {
        $model = $this->loadModel($id);
        // Permission check
        if (!Authorization::getIsStaffLogged()) {
            \Utils::finalMessage('You do not have authorization to refund this transaction');
        }
        if ($model->status_id !== TrStatus::STATUS_SUCCESS) {
            Yii::app()->user->setFlash('msg', 'This transaction is not successful. Can not be refunded');
            $this->redirect('/payGate/admin');
        }
        $post = Yii::app()->request->getPost('PayGateLog');
        $model2 = new PayGateLog;
        $totalRefunds = $model->refundsSum();
        $model2->amount = $model->amount - $totalRefunds;
        $model2->currency_id = $model->currency_id;
        $model2->original_amount = $model->original_amount;
        $model2->original_currency_id = $model->original_currency_id;
        $model2->original_convince_fee = $model->original_convince_fee;
        $model2->air_cart_id = $model->air_cart_id;
        $model2->note = 'External Refund';
        if ($post !== null && isset($post['amount'])) {
            $model2->amount = (int) $post['amount'];
            $model2->reason = $post['reason'] ? : null;
            $model2->note = $post['note'] ? : 'External Refund';
            if ($model2->amount > $model->userInfo->balance) {
                $model2->addError('amount', "The client balance is too low <b>{$model->userInfo->balance}</b> That is not enough for the refund!");
            }
            if ($model2->amount < 3) {
                $model2->addError('amount', "The refund amount should be bigger than 2");
            }
            if ($model2->amount > $model->amount) {
                $model2->addError('amount', "The total amount for this transaction is <b>{$model->amount}</b><br>You can not refund more than that!");
            } elseif ($model2->amount > ($model->amount - $totalRefunds)) {
                $model2->addError('amount', "The total refunds for this transaction are <b>{$totalRefunds}</b><br>The current transaction balance is: <b>" . ($model->amount - $totalRefunds) . "</b><br>You can not refund more than the current balance!");
            }
            if (!$model2->hasErrors()) {  // No errors , we can proceed
                $model2->action_id = TrAction::ACTION_REFUND;
                $model2->status_id = TrStatus::STATUS_SUCCESS;
                $model2->pg_id = $model->pg_id;
                $model2->user_info_id = $model->user_info_id;
                $model2->token = $model->request_id;
                $model2->hash_our = $model->id;
                $model2->setBasics();
                $model2->insert();
                $model2->registerNewPayment(TransferType::FUND_RECALL, "External Refund");
                Yii::app()->user->setFlash('msg', 'External Refund succesful');
                $this->redirect('/payGate/admin');
            }
        }

        $this->render('external_refund', ['model' => $model2]);
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new PayGateLog('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['PayGateLog'])) {
            $model->attributes = $_GET['PayGateLog'];
        }

        if (Yii::app()->request->isAjaxRequest &&
            Yii::app()->request->getQuery('ajax') == 'pay-gate-grid') {
            $this->renderPartial('_admin_grid', ['model' => $model], false, true);
        } else {
            $this->render('admin', ['model' => $model]);
        }
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return PayGateLog the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = PayGateLog::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param PayGateLog $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'pay-gate-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    /**
     * Set the browse and geoIP data for the transaction
     * @param \PayGateLog $model
     */
    protected function setBrowserAndGeoIp(\PayGateLog $model) {
        $model->user_browser = Yii::app()->request->getUserAgent();
        $realIp = \Utils::getProxyIp();
        if ($realIp !== null) {
            $model->user_proxy = Yii::app()->request->getUserHostAddress();
            $model->user_ip = $realIp;
        } else {
            $model->user_ip = Yii::app()->request->getUserHostAddress();
        }
        // Save the GeoIp info
        $model->geoip = \Utils::getGeoIpJsonString($model->user_ip);
        $model->updated = date(DATETIME_FORMAT);
        $model->update(['updated', 'geoip', 'user_ip', 'user_proxy', 'user_browser']);
    }

    /**
     * Change transaction currency. Save the original currency and amount if not set.
     * @param int $id ID of the transaction
     */
    function actionChangeCurrency($id) {
        if (Yii::app()->request->isAjaxRequest) {
            $model = $this->loadModel($id);
            if (empty($model->original_currency_id)) {
                $model->original_currency_id = $model->currency_id;
                $model->original_amount = $model->amount;
                $model->original_convince_fee = $model->convince_fee;
            }
            $newCurrencyID = Yii::app()->request->getPost('toCurrencyId');
            $newCurrency = \Currency::model()->findByPk($newCurrencyID);
            if ($newCurrency !== null) {
                $model->currency_id = $newCurrencyID;
                $model->amount = $model->originalCurrency->xChange($model->original_amount, $newCurrencyID);
                $model->convince_fee = $model->originalCurrency->xChange($model->original_convince_fee, $newCurrencyID);
                $model->update();
                echo $model->formatCurrencyBox();
            }
        }
    }

    /**
     * Send email for manual payment request
     * @param int $id The ID of the cart
     */
    function actionSendEmail($id) {
        $model = $this->loadModel($id);
        $model->sendPaymentRequestEmail();
    }

    /**
     * Send SMS for manual payment request
     * @param int $id The ID of the cart
     */
    function actionSendSms($id) {
        $model = $this->loadModel($id);
        $model->sendPaymentRequestSms();
    }

    public function actionPaytm($id) {
        $model = $this->loadModel($id);
        $raw_response['PAYTM_POST'] = $_POST;
        $raw_response['PAYTM_STATUS_API'] = PayTM\PayTM::getTxnStatus($model);
        if (!isset($_POST) || empty($_POST)) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }

        $status = Yii::app()->request->getPost('STATUS');
        $responseCode = Yii::app()->request->getPost('RESPCODE');
        $paytmChecksum = Yii::app()->request->getPost('CHECKSUMHASH');
        if ($paytmChecksum === null ||
            $status == 'OPEN' ||
            Yii::app()->request->getPost('ORDERID') != $model->id ||
            Yii::app()->request->getPost('MID') != $model->pg->merchant_id ||
            (double) Yii::app()->request->getPost('TXNAMOUNT') != (double) ($model->amount + $model->convince_fee)) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }

        if (!PayTM\Utils::validateChecksum($_POST, $model->pg->enc_key, $paytmChecksum)) {
            throw new CHttpException('403', '!!! Invalid Transaction !!!');
        }

        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }

        $flag = true;

        if ($raw_response['PAYTM_STATUS_API']['ORDERID'] != $model->id ||
            $raw_response['PAYTM_STATUS_API']['STATUS'] != PayTM\Utils::SUCCESS_STATUS ||
            $raw_response['PAYTM_STATUS_API']['RESPCODE'] != PayTM\Utils::SUCCESS_RESPCODE) {
            $flag = false;
        }


        //$model->raw_response = json_encode($raw_response);
        $model->setRawResponse($raw_response);
        $model->updated = date(DATETIME_FORMAT);
        $model->unmapped_status = isset(\PaymentGateway::$paytmResponseCode[$responseCode]) ? \PaymentGateway::$paytmResponseCode[$responseCode] : "Not Set";
        //updating paytm response message from status api
        //$model->reason = Yii::app()->request->getPost('RESPMSG');
        $model->reason = $raw_response['PAYTM_STATUS_API']['RESPMSG'];
        $model->payment_mode = Yii::app()->request->getPost('PAYMENTMODE');
        $model->action_id = TrAction::ACTION_SENT;
        $model->request_id = Yii::app()->request->getPost('TXNID');
        $model->hash_response = Yii::app()->request->getPost('CHECKSUMHASH');

        if ($status == PayTM\Utils::SUCCESS_STATUS && $responseCode == PayTM\Utils::SUCCESS_RESPCODE && $flag) {
            $model->status_id = TrStatus::STATUS_SUCCESS;
            $model->pg_type = Yii::app()->request->getPost('GATEWAYNAME');
            $model->bank_ref = Yii::app()->request->getPost('BANKTXNID');
        } else {
            $model->status_id = TrStatus::STATUS_FAILURE;
            $model->error = $raw_response['PAYTM_STATUS_API']['RESPMSG'];
        }
        $this->setBrowserAndGeoIp($model);
        $model->update();
        unset($_POST);
        $transferType = TransferType::WALLET;
        $typeName = 'Paytm';
        $this->rendResponseView($id, $transferType, $typeName);
    }

    public function actionCCAvenue($id) {
        $model = $this->loadModel($id);
        if (!isset($_POST) || empty($_POST)) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }
        $encResponse = Yii::app()->request->getPost('encResp');
        $orderNo = Yii::app()->request->getPost('orderNo');
        $flag = false;
        //Decode encResponse
        $response = CCAvenue\CCAvenue::decodeResponse($encResponse, $model->pg->enc_key);
        $paymentResponse = CCAvenue\CCAvenue::formattingResponse($response);

        $raw_response['CCAvenue_POST'] = $paymentResponse;

        $apiResponse = CCAvenue\CCAvenue::getTxnStatus($model, $paymentResponse['tracking_id']);
        if (empty($apiResponse['error'])) {
            $formattedApiResponse = CCAvenue\CCAvenue::formattingResponse($apiResponse['result']);
            if ($formattedApiResponse['status'] == 0) { //0 means api will give encoded response at param 'enc_response' otherwise plain text
                $decodedApiResponse = CCAvenue\CCAvenue::decodeResponse($formattedApiResponse['enc_response'], $model->pg->enc_key);
                $jsonApiResponse = json_decode($decodedApiResponse, true);
                $raw_response['STATUS_API'] = $jsonApiResponse;
            } else { //in case of api call failed
                $raw_response['STATUS_API'] = $formattedApiResponse['enc_response'];
            }
        } else {
            $raw_response['STATUS_API'] = $apiResponse['error'];
        }

        if ($encResponse === NULL ||
            $orderNo === NULL ||
            $paymentResponse['order_id'] != $model->id ||
            (double) $paymentResponse['amount'] != (double) ($model->amount + $model->convince_fee)) {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }

        if ($model->status_id !== TrStatus::STATUS_PENDING) {
            throw new CHttpException(403, 'The payment is already processed');
        }
        $model->unmapped_status = $paymentResponse['status_message'];
        $model->reason = $paymentResponse['order_status'];
        //$model->payment_mode = $finalApiResponse['order_option_type'];
        $model->payment_mode = $paymentResponse['payment_mode'];
        $model->request_id = $paymentResponse['tracking_id'];
        $model->hash_response = $encResponse;
        $model->setRawResponse($raw_response);
        $model->updated = date(DATETIME_FORMAT);
        $model->action_id = TrAction::ACTION_SENT;
        $model->pg_type = 'CCAVENUE';
        //success
        if ($model->id == $orderNo && $model->id == $paymentResponse['order_id'] && $model->status_id == \TrStatus::STATUS_PENDING) {
            if ($paymentResponse['order_status'] == CCAvenue\CCAvenue::SUCCESS_STATUS) {
                $model->status_id = \TrStatus::STATUS_SUCCESS;
                $model->bank_ref = $paymentResponse['bank_ref_no'];
            } elseif ($paymentResponse['order_status'] == CCAvenue\CCAvenue::FAILURE_STATUS || $paymentResponse['order_status'] == CCAvenue\CCAvenue::INVALID_PAYMENT) {
                $model->status_id = \TrStatus::STATUS_FAILURE;
                $model->error = $paymentResponse['order_status'];
            } elseif ($paymentResponse['order_status'] == CCAvenue\CCAvenue::ABORT_STATUS) {
                $model->status_id = \TrStatus::STATUS_ABORTED;
                $model->error = $paymentResponse['order_status'];
            }
        }

        $this->setBrowserAndGeoIp($model);
        $model->update();
        unset($_POST);
        if ($paymentResponse['payment_mode'] == CCAvenue\CCAvenue::EMI_PAYMENT_MODE) {
            $transferType = TransferType::CC_DEPOSIT;
        } else {
            $transferType = TransferType::AC_DEPOSIT;
        }
        $typeName = 'CCAvenue';
        //$transferType = TransferType::CC_DEPOSIT;
        $this->rendResponseView($id, $transferType, $typeName);
    }

    private function rendResponseView($id, $transferType, $typeName) {
        $model = $this->loadModel($id);
        $callback = false;
        if (!empty($model->callback)) {
            $callback = json_decode($model->callback);
            if (!isset($callback[1])) {
                $callback[1] = [];
            }
        }

        if ($model->status_id == TrStatus::STATUS_SUCCESS) {
            $payment = $model->registerNewPayment($transferType, $typeName);
            if ($callback) {
                $callback[1][] = $payment;
                call_user_func_array($callback[0], $callback[1]);
            } else {
                Yii::app()->user->setFlash('msg', "Congratulations the payment was successful!");
                $detect = new \Mobile_Detect;
                if ($detect->isMobile()) {
                    //$this->render('doPay', ['model' => $model]);
                    $this->layout = '//layouts/mobile';
                    $this->render('/payment/view', ['model' => $payment, 'isMobile' => 'Yes']);
                } else {
                    $this->render('/payment/view', ['model' => $payment]);  // Rend the payment view
                }
            }
        } else {
            if ($callback) {
                call_user_func_array($callback[0], $callback[1]);
            } else {
                //$this->render('payment_fail', ['model' => $model]);     // Rend the view to try again
                $detect = new \Mobile_Detect;
                if ($detect->isMobile()) {
                    //$this->render('doPay', ['model' => $model]);
                    $this->layout = '//layouts/mobile';
                    $this->render('payment_fail', ['model' => $model, 'isMobile' => 'Yes']);
                } else {
                    $this->render('payment_fail', ['model' => $model]);  // Rend the payment view
                }
            }
        }
    }

    public function actionUpi() {
        $meRes = \Yii::app()->request->getPost('meRes');
        $resultArr = array();
        if (!empty($meRes)) {
            $response = UPI\HDFC\UPI::processResponse($meRes);
            if ($response['model'] != null) {
                $model = $response['model'];
                $this->setBrowserAndGeoIp($model);
                $model->update();
                $resultArr['message'] = $response['message'];
            } else {
                $resultArr['message'] = $response['message'];
            }
        } else {
            $resultArr['message'] = 'Incorrect content';
        }
        unset($meRes);
        echo json_encode($resultArr);
        Yii::app()->end();
    }

    public function actionUpiView($id) {
        if ($id != null) {
            $transferType = TransferType::HDFCUPI;
            $typeName = 'HDFC UPI';
            $this->rendResponseView($id, $transferType, $typeName);
        } else {
            throw new CHttpException(403, 'Incorrect content. This attempt is logged, do not try it again');
        }
    }

}
