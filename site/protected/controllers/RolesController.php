<?php

class RolesController extends Controller {

    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
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
                'actions' => array('index', 'getTypePermissions', 'assignTypePermissions', 'create'),
                'users' => array('@'),
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    public function actionGetTypePermissions($id) {
        if (Yii::app()->user->getState('user_type') != UserType::superAdmin) {
            $out = array('result' => 'error', 'message' => 'Only the Super Admin user can configure role permissions');
        } else {
            $content = array();
            foreach (PermissionXType::model()->findAllByAttributes(array('user_type_id' => (int) $id)) as $model) {
                $content[] = $model->permission_id;
            }
            $out = array('result' => 'success', 'content' => $content);
        }
        Utils::jsonHeader();
        echo json_encode($out);
    }

    public function actionAssignTypePermissions($id) {
        Utils::jsonHeader();
        if (Yii::app()->user->getState('user_type') != UserType::superAdmin) {
            $out = array('result' => 'error', 'message' => 'Only the Super Admin user can configure role permissions');
        } else {
            if (!isset($_POST['permissions'])) {
                $out = array('result' => 'error', 'message' => 'Wrong request: There is no permissions paramter');
            } else {
                PermissionXType::model()->deleteAllByAttributes(array('user_type_id' => (int) $id));
                foreach (json_decode($_POST['permissions'], true) as $permissionId) {
                    $model = new PermissionXType;
                    $model->user_type_id = (int) $id;
                    $model->permission_id = (int) $permissionId;
                    if (!$model->save()) {
                        echo json_encode(array('result' => 'fail', 'message' => print_r($model->getErrors(), true)));
                        Yii::app()->end();
                    }
                }
                $out = array('result' => 'success');
            }
        }
        echo json_encode($out);
    }

    /**
     * Updates a particular model.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $model = $this->loadModel($id);

// Uncomment the following line if AJAX validation is needed
// $this->performAjaxValidation($model);

        if (isset($_POST['Permission'])) {
            $model->attributes = $_POST['Permission'];
            if ($model->save()) {
                $this->redirect(array('view', 'id' => $model->id));
            }
        }

        $this->render('update', array(
            'model' => $model,
        ));
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $model = new UserType('search');
        $this->render('index', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Permission the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = PermissionXType::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested role does not exist.');
        }
        return $model;
    }

    /**
     * Creates a new model.
     */
    public function actionCreate() {
        if (Yii::app()->user->getState('user_type') != UserType::superAdmin) {
            throw new CHttpException(403, 'Only the Super Admin user can configure role permissions');
        } else {
            $model = new UserType;

            if (isset($_POST['UserType'])) {
                $model->attributes = $_POST['UserType'];
                Yii::log(print_r($model, true));
                if ($model->save()) {
                    $this->redirect('index');
                }
            }

            $this->render('create', array(
                'model' => $model,
            ));
        }
    }

}