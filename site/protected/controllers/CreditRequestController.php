<?php

class CreditRequestController extends Controller {

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
            array('allow', // allow authenticated user to perform actions
                'actions' => array('create', 'admin'),
                'users' => array('@'),
            ),
            array('allow', // allow admin user to perform actions
                'actions' => array('approve', 'reject', 'update'),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate() {
        $model = new CreditRequest;
        if (isset($_POST['CreditRequest'])) {
            $model->attributes = $_POST['CreditRequest'];
            $model->creator_id = Utils::getActiveUserId();
            if ($model->save()) {
                $this->redirect('admin');
            }
        }
        $this->render('create', ['model' => $model]);
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new CreditRequest('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['CreditRequest'])) {
            $model->attributes = $_GET['CreditRequest'];
        }
        if (!Authorization::getIsStaffLogged()) {
            $model->creator_id = Yii::app()->user->id;
        }

        $this->render('admin', ['model' => $model]);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return CreditRequest the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = CreditRequest::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Approve the request
     * @param integer $id the ID of the model to be updated
     */
    public function actionApprove($id) {
        $model = $this->loadModel($id);
        \Utils::jsonHeader();
        if ($model->status_id !== CreditRequest::STATUS_NEW) {
            echo json_encode(['error' => 'This request is already decided! Only new requests can be approved.']);
            Yii::app()->end();
        }
        $content = Yii::app()->request->getPost('content');
        if (Yii::app()->request->isAjaxRequest && $content) {
            if (strlen($content) < 5) {
                echo json_encode(['error' => 'Please enter more comments!']);
            } else {    // Approve the request
                $model->status_id = CreditRequest::STATUS_APPROVED;
                $model->approver_id = Yii::app()->user->id;
                $userInfo = $model->creator->userInfo;
                $oldLimit = $userInfo->credit_limit;
                $userInfo->credit_limit += $model->amount;
                if ($model->html === null) {
                    $model->html = '';
                }
                $model->html .= "<b>Approved:</b> " . date(DATE_FORMAT) . "<br><b>Reason:</b> {$content}<br><b>Old limit:</b> {$oldLimit}</b><br><b>New limit:</b> {$userInfo->credit_limit}";
                $userInfo->update(['credit_limit']);
                $model->update(['status_id', 'approver_id', 'html']);
                echo json_encode(['message' => 'The credit request is approved successfully!']);
            }
        }
    }

    /**
     * Reject the request
     * @param integer $id the ID of the model to be updated
     */
    public function actionReject($id) {
        $model = $this->loadModel($id);
        \Utils::jsonHeader();
        if ($model->status_id !== CreditRequest::STATUS_NEW) {
            echo json_encode(['error' => 'This request is already decided! Only new requests can be rejected.']);
            Yii::app()->end();
        }
        $content = Yii::app()->request->getPost('content');
        if (Yii::app()->request->isAjaxRequest && $content) {
            if (strlen($content) < 5) {
                echo json_encode(['error' => 'Please enter more comments!']);
            } else {
                $model->status_id = CreditRequest::STATUS_REJECTED;
                $model->approver_id = Yii::app()->user->id;
                if ($model->html === null) {
                    $model->html = '';
                }
                $model->html .= "<b>Rejected:</b> " . date(DATE_FORMAT) . "<br><b>Reason:</b> $content";
                $model->update(['status_id', 'approver_id', 'html']);
                echo json_encode(['message' => 'The request is rejected']);
            }
        }
    }

    /**
     * Update the request amount
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $model = $this->loadModel($id);
        \Utils::jsonHeader();
        if ($model->status_id !== CreditRequest::STATUS_NEW) {
            echo json_encode(['error' => 'This request is already decided! Only new requests can be rejected.']);
            Yii::app()->end();
        }
        $content = Yii::app()->request->getPost('content');
        if (!is_numeric($content)) {
            echo json_encode(['error' => 'Please use only digits to enter the new amount!']);
            Yii::app()->end();
        }
        if (Yii::app()->request->isAjaxRequest && $content) {
            $model->approver_id = Yii::app()->user->id;
                if ($model->html === null) {
                    $model->html = '';
                }
            $model->html .= "<b>Amount changed from:</b> {$model->amount}<br><b>Amount changed to:</b> {$content}<br><b>Change made by:</b> {$model->approver->name}<br>---== " . date(DATETIME_FORMAT) . " ==---<br>";
            $model->amount = (int) $content;
            $model->update(['approver_id', 'html', 'amount']);
            echo json_encode(['message' => 'The request is updated']);
        }
    }

}
