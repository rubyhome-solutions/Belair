<?php

class BinListController extends Controller {

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
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('view'),
                'users' => array('@'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('admin', 'update', 'create'),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
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
        $this->render('view', array(
            'model' => $this->loadModel($id),
        ));
    }

    public function actionCreate() {
        $bin = Yii::app()->request->getPost('id');
        if (Yii::app()->request->isAjaxRequest) {
            // We have to add the bin
            if (ctype_digit($bin) && strlen($bin) === 6) {
                if (BinList::insertIfMissing($bin)) {
                    echo $bin;                    
                }
            }
            Yii::app()->end();
        }
        $this->render('create');
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $model = $this->loadModel($id);
        if (isset($_POST['fromProvider'])) {
            $res = $model->refreshData();
            if ($res !== true) {
                Yii::app()->user->setFlash('msg', $res);
            } else {
                Yii::app()->user->setFlash('msg', 'BinList data refresh was successfully accomplished');
            }
        } elseif (isset($_POST['BinList'])) {
            $model->attributes = $_POST['BinList'];
            if ($model->save()) {
                $this->redirect('/binList/admin');
            }
        }

        $this->render('update', ['model' => $model]);
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new BinList('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['BinList'])) {
            $model->attributes = $_GET['BinList'];
        }

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return BinList the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = BinList::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

}
