<?php

class RoutesCacheController extends Controller {

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
        $model = new \RoutesCache('search');
        $model->unsetAttributes();  // clear any default values
        $model->attributes = Yii::app()->session->get('RouteCacheFilter', []);
        if (isset($_GET['RoutesCache'])) {
            $model->attributes = $_GET['RoutesCache'];
//            Yii::app()->session->add('RouteCacheFilter', $_GET['RoutesCache']);
            Yii::app()->session->add('RouteCacheFilter', $model->attributes);
        }

//        if (Yii::app()->request->isAjaxRequest) {
//            $this->renderPartial('_grid', ['model' => $model]);
//            Yii::app()->end();
//        }
        $this->render('admin', ['model' => $model]);
    }

}
