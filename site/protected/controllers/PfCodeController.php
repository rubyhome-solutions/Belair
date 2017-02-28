<?php

class PfCodeController extends Controller {

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
            ['allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => ['admin', 'create', 'delete', 'index'],
                'users' => ['@'],
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * Creates new PfCode record.
     */
    public function actionCreate() {
        $model = new PfCode;
        if (isset($_POST['PF'])) {
            $model->attributes = $_POST['PF'];
            if (!\Authorization::getIsStaffLogged()) {
                $model->user_info_id = \Utils::getActiveCompanyId();
            }
            if (empty($model->user_info_id) && $model->scope == \TourCode::SCOPE_SINGLE_CLIENT) {
                echo 'Please select the client for the single client scope and try again!';
            } elseif (empty($model->code)) {
                echo 'The code filed is empty and the record can not be added!';
            } else {
                $model->code = htmlentities(strtoupper($model->code));
                $model->save();
            }
        }
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        if (Yii::app()->request->isPostRequest) {
            // we only allow deletion via POST request
            $model = $this->loadModel($id);
            if (!Authorization::getIsStaffLogged() && $model->user_info_id != \Utils::getActiveCompanyId()) {
                throw new CHttpException(400, 'You do not have permission to delete this code. Please do not repeat this request again.');
            }
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Index redirect to admin.
     */
    public function actionIndex() {
        $this->redirect($this->createUrl('admin'));
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new PfCode('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['PfCode'])) {
            Yii::app()->session->add('filterPfCode', $_GET['PfCode']);
        }
        $model->attributes = Yii::app()->session->get('filterPfCode', []);

        if (!\Authorization::getIsStaffLogged()) {
            $model->user_info_id = \Utils::getActiveCompanyId();
            $activeClients = [$model->user_info_id => $model->userInfo->name];
        } else {
            $activeClients = CHtml::listData(\UserInfo::model()->findAllBySql(
                                    'SELECT t.id, t.name FROM user_info t JOIN pf_code ON t.id = pf_code.user_info_id ORDER BY name'
                            ), 'id', 'name');
        }

        if (Yii::app()->request->isAjaxRequest && Yii::app()->request->getQuery('ajax') === 'privateFare-grid') {
            $this->renderPartial('_admin_grid', [
                'model' => $model,
                'activeClients' => $activeClients,
            ]);
        } else {
            $this->render('admin', [
                'model' => $model,
                'activeClients' => $activeClients,
            ]);
        }
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return PfCode the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = PfCode::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }
}
