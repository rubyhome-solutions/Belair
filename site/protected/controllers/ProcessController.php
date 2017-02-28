<?php

class ProcessController extends Controller {

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
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return array(
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('admin'),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new Process('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Process'])) {
            $model->attributes = $_GET['Process'];
        }

        if (Yii::app()->request->isAjaxRequest) {
            $this->renderPartial('_grid', ['model' => $model]);
            Yii::app()->end();
        }
        $this->render('admin', ['model' => $model]);
    }

}
