<?php

class AirSourceController extends Controller {

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
                'actions' => array('create', 'update', 'admin', 'delete', 'index', 'view', 'createQueue', 'updateQueue', 'delQueue', 'scrapperCheck', 'getScrapperData', 'scrapperTest'),
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

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate() {
        if (!Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_SOURCES_BOOKING_WORK_FLOW)) {
            Utils::finalMessage('You do not have permission to manage the Air Sources!');
        }

        $model = new AirSource;

// Uncomment the following line if AJAX validation is needed
// $this->performAjaxValidation($model);

        if (isset($_POST['AirSource'])) {
            $model->attributes = $_POST['AirSource'];
            if ($model->save()) {
                $this->redirect(array('view', 'id' => $model->id));
            }
        }

        $this->render('create', array(
            'model' => $model,
        ));
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        if (!Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_SOURCES_BOOKING_WORK_FLOW)) {
            Utils::finalMessage('You do not have permission to manage the Air Sources!');
        }

        $model = $this->loadModel($id);
        $oldBalanceLink = $model->balance_link;
        if (isset($_POST['AirSource'])) {
            $model->attributes = $_POST['AirSource'];
            // Update the balance if needed
            if (!empty($model->balance_link)) {
                $balanceSource = $this->loadModel($model->balance_link);
                $model->balance = $balanceSource->balance;
            } elseif (!empty($oldBalanceLink)) {
                $model->balance = 0;
            }
            if ($model->validate() && $model->save()) {
                $this->redirect(['view', 'id' => $model->id]);
            }
        }
        $airQueue = new \AirsourceQueue('search');
        $airQueue->air_source_id = (int) $id;
        $airQueue->carriers = '';

        $queueProvidersList = CHtml::listData(\AirSource::model()->findAll([
                            'condition' => "backend_id=$model->backend_id AND id<>:id",
                            'order' => 't.name',
                            'params' => [':id' => $model->id]
                        ]), 'id', 'name');


        if (Yii::app()->request->isAjaxRequest) {
            if (Yii::app()->request->getQuery('ajax') === 'airSourceQueue-grid') {
                $this->renderPartial('_queue', [
                    'airQueue' => $airQueue,
                    'queueProvidersList' => $queueProvidersList,
                ]);
                Yii::app()->end();
            }
            if (Yii::app()->request->getQuery('ajax') === 'airSourceCards-grid') {
                $this->renderPartial('_cards', [
                    'airQueue' => $airQueue,
                    'queueProvidersList' => $queueProvidersList,
                ]);
                Yii::app()->end();
            }
        } else {
            $this->render('update', [
                'model' => $model,
                'airQueue' => $airQueue,
                'queueProvidersList' => $queueProvidersList,
            ]);
        }
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        if (!Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_SOURCES_BOOKING_WORK_FLOW)) {
            Utils::finalMessage('You do not have permission to manage the Air Sources!');
        }

        if (Yii::app()->request->isPostRequest) {
// we only allow deletion via POST request
            $this->loadModel($id)->delete();

// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
            if (!isset($_GET['ajax'])) {
                $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
            }
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $this->redirect('/airSource/admin');
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new AirSource('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['AirSource'])) {
            $model->attributes = $_GET['AirSource'];
        }

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return AirSource the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = AirSource::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param AirSource $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'air-source-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    function actionCreateQueue() {
        if (Yii::app()->request->isPostRequest && isset($_POST['AirsourceQueue'])) {
            $airQueue = new \AirsourceQueue;
            $airQueue->attributes = $_POST['AirsourceQueue'];
            $airQueue->carriers = strtoupper($airQueue->carriers);
            if ($airQueue->validate()) {
                $airQueue->insert();
            }
        }
    }

    public function actionUpdateQueue() {
        $id = Yii::app()->request->getPost('id');
        $name = Yii::app()->request->getPost('name');
        $value = strtoupper(Yii::app()->request->getPost('value'));

        $model = \AirsourceQueue::model()->findByPk($id);
        if ($model) {
            $p = new CHtmlPurifier();
            $model->{$name} = $p->purify($value);
            $model->update([$name]);
        }
    }

    public function actionDelQueue($id) {
        \AirsourceQueue::model()->deleteByPk($id);
    }

    public function actionScrapperTest() {
        $this->render('scrapper_test');
    }

    public function actionScrapperCheck() {
        $this->render('scrapper_check');
    }

    public function actionGetScrapperData() {
        set_time_limit(900);
        session_write_close();  // This is how you can make asynchronous requests.
        $this->renderPartial('_scrapper');
    }

}
