<?php

class PaymentController extends Controller {

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
            'postOnly + delete', // we only allow deletion via POST request
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return array(
            ['allow',
                'actions' => ['paymentXML'],
                'expression' => 'Authorization::getIsTopStaffLogged()'
            ],
            ['allow',
                'actions' => ['uploadInvoiceFile'],
                'expression' => 'Authorization::getIsTopStaffOrAccountantLogged()'
            ],
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('index', 'admin', 'invoice', 'refund'),
                'users' => array('@'),
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array(),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('allow', 'actions' => ['view'], 'users' => ['*']),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id) {
        if ((isset(Yii::app()->theme->name) && \Yii::app()->theme->name === \Controller::B2C_THEME) || \Authorization::getIsStaffLogged()) {
            $this->render('view', array(
                'model' => $this->loadModel($id),
            ));
        }
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate() {
        $model = new Payment;

// Uncomment the following line if AJAX validation is needed
// $this->performAjaxValidation($model);

        if (isset($_POST['Payment'])) {
            $model->attributes = $_POST['Payment'];
            if ($model->save()) {
                $this->redirect(array('view', 'id' => $model->id));
            }
        }

        $this->render('create', array(
            'model' => $model,
        ));
    }

    /**
     * Print invoice by payment ID
     * @param integer $id ID of the payment
     */
    public function actionInvoice($id) {
        $model = $this->loadModel($id);
        // Should the invoice be issued
        if (!$model->transferType->isInvoiceEligble()) {
            Utils::finalMessage("This transfer is not invoice eligble");
        }
        // Permissions check
        if (!Authorization::getIsStaffLogged() && Utils::getActiveCompanyId() != $model->user->user_info_id) {
            Utils::finalMessage("You do not have permission to view this invoice");
        }

        Utils::finalMessage("The invoices are coming soon! Stay tight");
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
//    public function actionUpdate($id) {
//        $model = $this->loadModel($id);
//        if (isset($_POST['Payment'])) {
//            $model->attributes = $_POST['Payment'];
//            if ($model->save()) {
//                $this->redirect(array('view', 'id' => $model->id));
//            }
//        }
//        $this->render('update', ['model' => $model]);
//    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $dataProvider = new CActiveDataProvider('Payment');
        $this->render('index', array(
            'dataProvider' => $dataProvider,
        ));
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new Payment('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Payment'])) {
            $model->attributes = $_GET['Payment'];
        }
        if (!Authorization::getIsStaffLogged()) {
            // Restrict the search to the payments made by the same company
            $model->activeCompanyId = Utils::getActiveCompanyId();
        } elseif (!empty($model->user_id)) {
            \Utils::setActiveUserAndCompany($model->user_id);
        }

        if (Yii::app()->request->isAjaxRequest && Yii::app()->request->getQuery('ajax') == 'payment-grid') {
            $this->renderPartial('_admin_grid', ['model' => $model]);
        } else {
            $this->render('admin', ['model' => $model]);
        }
    }

    /**
     * Refund payment
     * @param int $id The payment ID
     */
    public function actionRefund($id) {
        $model = $this->loadModel($id);
        if ($model->user->userInfo->balance < 1) {
            \Utils::finalMessage('The client do not have balance for refunds. Current balance is: ' . $model->user->userInfo->balance);
        } else {
            \Utils::finalMessage('Refund requests processing is coming soon');
        }
        $this->render('refund', ['model' => $model]);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Payment the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = Payment::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param Payment $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'payment-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    /*
     * Update Aircart Invoice Number using Excel File
     */

    public function actionUploadInvoiceFile() {
        include(Yii::getPathOfAlias("application.vendor.PHPexcel.Classes") . '/PHPExcel.php');
        // Add File
        if (isset($_FILES['filename'])) {
            if ($_FILES['filename']['error'] != 0) {
                Yii::app()->user->setFlash('files_msg', "<b>Error: </b>No file is selected");
            } else {
                $path = AircartFile::storageDirectory() . md5(microtime(true));
                // move the new file
                if (move_uploaded_file($_FILES['filename']['tmp_name'], $path)) {
                    $objPHPExcel = PHPExcel_IOFactory::load($path);
                    $sheet = $objPHPExcel->getActiveSheet();
                    $data = $sheet->rangeToArray($sheet->calculateWorksheetDimension());
                   // \Utils::dbgYiiLog(['cnt'=>count($data)]);
                    foreach ($data as $row) {
                        $air_cart_id = $row[0];
                        $invoiceno = $row[25];
                        
                        if (!empty($air_cart_id) && !empty($invoiceno) && is_numeric($air_cart_id)) {
                         //\Utils::dbgYiiLog(['cart' => $air_cart_id, 'invoice' => $invoiceno]);
                            \AirCart::model()->updateByPk((int)$air_cart_id, array('invoice_no'=>$invoiceno));
                        }
                    }
                    unlink($path);
                    $this->render('files', ['msg' => 'success']);
                    \Yii::app()->end();
                } else {
                    Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Can't store the file. Internal error");
                }
            }
        }
        $this->render('files');
    }

}
