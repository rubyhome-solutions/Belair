<?php

class ParamsController extends Controller {

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
        return [
            ['allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => ['create', 'update', 'admin', 'index'],
                'expression' => 'Authorization::getIsSuperAdminLogged()',
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'admin' page.
     */
    public function actionCreate() {
        $model = new Params;
        if (isset($_POST['Params'])) {
            $model->attributes = $_POST['Params'];
            if ($model->save()) {
                $this->redirect(['admin', 'id' => $model->id]);
            }
        }

        $this->render('create', ['model' => $model]);
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'admin' page.
     */
    public function actionUpdate() {
        $model = $this->loadModel(\Yii::app()->request->getQuery('id'));
        if (isset($_POST['Params'])) {
            $model->attributes = $_POST['Params'];
            if ($model->save()) {
                $this->redirect(['admin', 'id' => $model->id]);
            }
        }

        $this->render('update', ['model' => $model]);
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        if (Yii::app()->request->isPostRequest) {
            // we only allow deletion via POST request
            $this->loadModel($id)->delete();

            // if AJAX request (triggered by deletion via admin grid admin), we should not redirect the browser
            if (!isset($_GET['ajax'])) {
                $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
            }
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Admin view
     */
    public function actionIndex() {
        $this->redirect('/params/admin');
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new Params('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Params'])) {
            $model->attributes = $_GET['Params'];
        }

        $this->render('admin', ['model' => $model]);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Params the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = Params::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param Params $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'params-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

}
