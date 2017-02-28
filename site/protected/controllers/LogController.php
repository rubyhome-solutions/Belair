<?php

class LogController extends Controller {

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
                'actions' => array('admin', 'undo'),
//                'users' => array('@'),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Undo operation
     * @param integer $id the ID of the model to be updated
     */
    public function actionUndo($id) {
        Utils::jsonHeader();
        $msg = Authorization::can(Authorization::UNDO_LOG_ACTION);
        if ($msg !== true) {
            echo json_encode($msg);
            Yii::app()->end();
        }
        
        $model = $this->loadModel($id);
        if ($model->operation->is_reversible) {
//            $query = "UPDATE {$model->operation->table_name} SET {$model->operation->value_field_name}=:old_value
//            WHERE {$model->operation->id_filed_name}={$model->id_value} ;";
            $sqlCmd = Yii::app()->db->createCommand()
                ->update(
                    $model->operation->table_name, 
                    array($model->operation->value_field_name => $model->old_value), 
                    "{$model->operation->id_filed_name}=:id",
                    array(':id' => $model->id_value)
                );

            $out = "<b>Success:</b> The operation <code>{$model->operation->name}</code> is reversed. The old value of <code>{$model->old_value}</code> is restored!";
        } else {
            $out = "<b>WARNING:<b> This operation is not reversible - can't undo it!";
        }

        echo json_encode($out);
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        
        $model = new \LogModel('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['LogModel'])) {
            $model->attributes = $_GET['LogModel'];
        }

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return LogModel the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        
        $model = \LogModel::model()->findByPk((int) $id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested log record does not exist.');
        }
        return $model;
    }

}