<?php

class FraudController extends Controller {

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
            ['allow',
                'actions' => ['delete', 'freeIP', 'freeEmail', 'freePhone'],
                'users' => ['@'],
                'expression' => 'Authorization::getIsTopStaffLogged()'
            ],
            ['allow',
                'actions' => ['admin', 'view'],
                'users' => ['@'],
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
        $this->render('view', ['model' => $this->loadModel($id)]);
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        $this->loadModel($id)->delete();
        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax'])) {
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
        }
    }

    public function actionFreeIP($id) {
        $model = $this->loadModel($id);
        \Fraud::model()->updateAll(['ip' => null], 'ip = :param', [':param' => $model->ip]);
        $this->redirect('/fraud/admin');
    }

    public function actionFreeEmail($id) {
        $model = $this->loadModel($id);
        \Fraud::model()->updateAll(['email' => null], 'email = :param', [':param' => $model->email]);
        $this->redirect('/fraud/admin');
    }

    public function actionFreePhone($id) {
        $model = $this->loadModel($id);
        \Fraud::model()->updateAll(['phone' => null], 'phone = :param', [':param' => $model->phone]);
        $this->redirect('/fraud/admin');
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new Fraud('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Fraud'])) {
            $model->attributes = $_GET['Fraud'];
        }

        $this->render('admin', ['model' => $model]);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Fraud the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = Fraud::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

}
