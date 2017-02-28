<?php

class CcController extends Controller {

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
            'postOnly + binRefresh delete', // we only allow deletion via POST request
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return [
            ['allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => ['delete', 'admin', 'create'],
                'users' => ['@'],
            ],
            ['allow',
                'actions' => ['binRefresh', 'verificationTrigger'],
                'expression' => 'Authorization::getIsStaffLogged()'
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * Displays a particular model.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id) {
        $this->render('view', array(
            'model' => $this->loadModel($id),
        ));
    }

    public function actionCreate() {
        $model = new \Cc('insert');
        $model->user_info_id = \Utils::getActiveCompanyId();
        if (empty($model->user_info_id)) {
            Yii::app()->user->setFlash('msg', 'You have to select the client before you can add cards');
            $this->redirect('/users/manage');
        }
        $year = Yii::app()->request->getPost('year');
        $month = Yii::app()->request->getPost('month');
        if (Yii::app()->request->getPost('Cc')) {
            // Card owner should not be set via POST attributes
            unset($_POST['Cc']['user_info_id']);
            $model->attributes = $_POST['Cc'];
            if (!$model->ecc->validateNumber($model->number)) {
                $model->addError('number', "Not valid card number");
            }
            if (!$model->ecc->validateDate($month, $year)) {
                $model->addError('exp_date', "Invalid expiry date");
            }
            $model->exp_date = "{$year}-{$month}-01";
            // Validate without clearing the errors
            if ($model->validate(null, false)) {
                $model->insert();
                Yii::app()->user->setFlash('msg', "New CC created succesfully");
                $this->redirect(Yii::app()->createUrl('cc/admin'));
            }
        }

        $this->render('create', [
            'model' => $model,
            'month' => $month,
            'year' => $year,
        ]);
    }

    public function actionDelete($id) {
        $model = $this->loadModel($id);
        if (Authorization::getIsStaffLogged() ||
                $model->user_info_id == \Utils::getActiveCompanyId()) {

            $model->deleted = 1;
            $model->update(['deleted']);
        }
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreateBin() {
        $model = new BinList;
        if (isset($_POST['BinList'])) {
            $model->attributes = $_POST['BinList'];
            if ($model->save()) {
                $this->redirect(['/binlist/view', 'id' => $model->id]);
            }
        }
        $this->render('/binlist/create', ['model' => $model]);
    }

    public function actionBinRefresh() {
        $model = $this->loadModel(Yii::app()->request->getPost('id'));
        Utils::jsonHeader();
        $res = $model->bin->refreshData();
        if ($res === true) {
            $out = ['message' => 'BinList data refresh was successfully accomplished'];
        } else {
            $out = ['error' => $res];
        }
        echo json_encode($out);
    }

    public function actionVerificationTrigger($id) {
        $model = $this->loadModel($id);
        $model->verification_status ^= 1;
        $model->update(['verification_status']);
        if ($model->verification_status) {
            $model->fraudClear();   // Remove all fraud transactions with this card if it is verified
        }
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
//    public function actionUpdate($id) {
//        $model = $this->loadModel($id);
//        if (isset($_POST['Cc'])) {
//            $model->attributes = $_POST['Cc'];
//            if ($model->save()) {
//                $this->redirect(array('view', 'id' => $model->id));
//            }
//        }
//
//        $this->render('update', array(
//            'model' => $model,
//        ));
//    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new Cc('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Cc'])) {
            $model->attributes = $_GET['Cc'];
        }
        $isStaffLogged = Authorization::getIsStaffLogged();
        if (!$isStaffLogged) {
            // Restrict the search to the payments made by the same company
            $model->user_info_id = Utils::getActiveCompanyId();
        }

        $this->render('admin', [
            'model' => $model,
            'isStaffLogged' => $isStaffLogged
        ]);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Cc the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = Cc::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

}
