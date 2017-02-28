<?php

class CcPasstruController extends Controller {

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
                'actions' => ['client', 'root', 'create', 'delete'],
                'expression' => 'Authorization::getIsStaffLogged()'
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * Creates new CcPasstru record.
     */
    public function actionCreate() {
        $model = new CcPasstru;
        if (isset($_POST['ccPt'])) {
            $model->attributes = $_POST['ccPt'];
            if (empty($model->user_info_id) && $model->scope == \TourCode::SCOPE_SINGLE_CLIENT) {
                echo 'Please select the client for the Client Pass-trought and try again!';
            } elseif (empty ($model->cc_id)) {
                echo 'Please select a card';
            } elseif (empty ($model->scope)) {
                echo 'Please select valid scope';
            } elseif (empty ($model->carrier_id)) {
                echo 'Please select airline';
            } else {
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
            $this->loadModel($id)->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Manages Client pass-trough.
     */
    public function actionClient() {
        $activeUserInfoId = (int) \Utils::getActiveCompanyId();
        if (empty($activeUserInfoId)) {
            Yii::app()->user->setFlash('msg', 'You have to select the client before you can manage the Client pass-through');
            $this->redirect('/users/manage');
        }
        $model = new CcPasstru('search');
        $model->scope = \CcPasstru::SCOPE_SINGLE_CLIENT;
        $model->user_info_id = $activeUserInfoId;
        $activeClients = CHtml::listData(\UserInfo::model()->findByPk($activeUserInfoId), 'id', 'name');
        $clientCards = CHtml::listData(\Cc::model()->findAllByAttributes(['user_info_id' => $activeUserInfoId]), 'id', 'mask');
//        \Utils::dbgYiiLog($clientCards);
        
        if (Yii::app()->request->isAjaxRequest && Yii::app()->request->getQuery('ajax') === 'ccClientPasstru-grid') {
            $this->renderPartial('_admin_grid_client', [
                'model' => $model,
                'activeClients' => $activeClients,
                'clientCards' => $clientCards,
            ]);
        } else {
            $this->render('admin_client', [
                'model' => $model,
                'activeClients' => $activeClients,
                'clientCards' => $clientCards,
            ]);
        }
    }

    /**
     * Manages Root pass-trough.
     */
    public function actionRoot() {
        \Utils::setActiveUserAndCompany(\Users::B2E_USERID);
        $activeUserInfoId = (int) \Utils::getActiveCompanyId();
        $model = new CcPasstru('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['CcPasstru'])) {
            Yii::app()->session->add('filterRootCcPasstru', $_GET['CcPasstru']);
        }
        $model->attributes = Yii::app()->session->get('filterRootCcPasstru', []);
        $model->user_info_id = $activeUserInfoId;
        $activeClients = CHtml::listData(\UserInfo::model()->findByPk($activeUserInfoId), 'id', 'name');
        $clientCards = CHtml::listData(\Cc::model()->findAllByAttributes(['user_info_id' => $activeUserInfoId]), 'id', 'mask');

        if (Yii::app()->request->isAjaxRequest && Yii::app()->request->getQuery('ajax') === 'ccRootPasstru-grid') {
            $this->renderPartial('_admin_grid_root', [
                'model' => $model,
                'activeClients' => $activeClients,
                'clientCards' => $clientCards,
            ]);
        } else {
            $this->render('admin_root', [
                'model' => $model,
                'activeClients' => $activeClients,
                'clientCards' => $clientCards,
            ]);
        }
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return CcPasstru the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = CcPasstru::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested object does not exist.');
        }
        return $model;
    }

}
