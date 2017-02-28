<?php

class TravelerController extends Controller {

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
                'actions' => array('create', 'update', 'admin', 'delete', 'addVisa', 'delVisa', 'uploadFile', 'delFile', 'download', 'preferences', 'ffAdd', 'ffDel', 'search', 'getTravelerData', 'getMyTravelersList'),
                'users' => array('@'),
//                'expression' => '!empty(Yii::app()->user->id)'
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate() {
        $companyId = Utils::getActiveCompanyId();
        if ($companyId === false) {
//            Utils::finalMessage('Please pick a company, before you can create new traveler! <b><a href="' . Yii::app()->request->hostInfo . '/users/manage">Click here</a></b> to continue. ');
            Yii::app()->user->setFlash('msg', 'Please pickup a user or company, before you can register new traveler!');
            $this->redirect('/users/manage');
        }
//        Yii::log($companyId);
        $model = new Traveler;
        $model->user_info_id = $companyId;

        if (isset($_POST['Traveler'])) {
            $model->attributes = $_POST['Traveler'];
            if ($model->validate() && $model->save()) {
                if (Yii::app()->request->isAjaxRequest) {
                    Utils::jsonHeader();
                    echo json_encode([
                        'result' => 'success',
                        'traveler_id' => $model->id,
                        'title' => $model->travelerTitle->name,
                    ]);
                    Yii::app()->end();
                } else {
                    $this->redirect(array('update', 'id' => $model->id));
                }
            }
        }

        if (Yii::app()->request->isAjaxRequest) {
            Utils::jsonHeader();
            $msg = '';
            foreach ($model->errors as $error) {
                $msg .= implode("\n", $error) . "\n";
            }
//            Yii::log(print_r($model->errors,true));
            echo json_encode([
                'result' => 'error',
                'message' => $msg,
            ]);
        } else {
            $this->render('create', array(
                'model' => $model,
            ));
        }
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $msg = \Authorization::can(Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true) {
            Utils::finalMessage($msg);
        }

        $model = $this->loadModel($id);
        $old_traveler_data = $this->loadModel($id);

        if (isset($_POST['Traveler'])) {
            $model->attributes = $_POST['Traveler'];
            if ($model->validate()) {
                $model->save();
                $differences = $old_traveler_data->compare($model, $model->getRelationalColumns());
                if ($differences !== '') {
                    $model->addNote($differences);
                    $model->addNoteTravelerCart();
                }
            }
        }

        $this->render('update', array(
            'model' => $model,
        ));
    }

    /**
     * Added By Satender
     * Purpose : For configuration which will be used by TraceChange Behaviour
     * @return type list of the relational columns and their respective model
     */
    private function getRelationalColumns() {
        return [
            'traveler_title_id' => [
                'model' => 'TravelerTitle', 'field_name' => 'name'
            ],
            'passport_country_id' => [
                'model' => 'Country', 'field_name' => 'name'
            ],
        ];
    }

    public function actionPreferences($id) {
        $msg = Authorization::can(Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true) {
            Utils::finalMessage($msg);
        }


        if (isset($_POST['Preferences'])) {
            $preferences = new Preferences;
            $preferences->attributes = $_POST['Preferences'];
            $preferences->traveler_id = (int) $id;
            if ($preferences->validate()) {
                $preferences->deleteAllByAttributes(['traveler_id' => $id]);
                $preferences->save();
            }
        }

        $this->redirect(array(
            'update',
            'id' => $id,
        ));
    }

    public function actionFfAdd($id) {
        $msg = Authorization::can(Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true) {
            Utils::finalMessage($msg);
        }

        if (isset($_POST['FfSettings'])) {
            $ffSettings = new FfSettings;
            $ffSettings->attributes = $_POST['FfSettings'];
            $ffSettings->traveler_id = (int) $id;
            if ($ffSettings->validate()) {
                $ffSettings->deleteAllByAttributes(['traveler_id' => $id, 'ff_carriers_id' => $ffSettings->ff_carriers_id]);
                $ffSettings->save();
            }
        }

        $this->redirect(array(
            '/traveler/update',
            'id' => $id,
        ));
    }

    public function actionFfDel($id) {
        $msg = Authorization::can(Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true) {
            Utils::finalMessage($msg);
        }

        if (isset($_GET['FfSettings']['ff_carriers_id'])) {
            FfSettings::model()->deleteAllByAttributes(array('traveler_id' => $id, 'ff_carriers_id' => $_GET['FfSettings']['ff_carriers_id']));
        }

        $model = $this->loadModel($id);
        $this->render('update', array(
            'model' => $model,
        ));
    }

    public function actionUploadFile($id) {
        $msg = Authorization::can(Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true) {
            Utils::finalMessage($msg);
        }
        // Add File
        if (isset($_FILES['filename'])) {
            if ($_FILES['filename']['error'] != 0) {
                Yii::app()->user->setFlash('files_msg', "<b>Error: </b>No file is selected");
            } else {
                if (!in_array(strrchr($_FILES['filename']['name'], '.'), TravelerFile::$acceptedFileExtensions)) {
                    Yii::app()->user->setFlash('files_msg', "<b>Error: </b>The file extension is not allowed");
                } else {
                    $path = TravelerFile::storageDirectory() . md5(microtime(true));
                    // move the new file
                    if (move_uploaded_file($_FILES['filename']['tmp_name'], $path)) {
                        $fileModel = new TravelerFile;
                        $fileModel->traveler_id = $id;
                        $fileModel->path = $path;
                        $fileModel->name = $_FILES['filename']['name'];
                        $fileModel->doc_type_id = $_POST['doc_type_id'];
                        $fileModel->user_visible = empty($_POST['file_user_visible']) ? 0 : 1;
                        if ($fileModel->validate()) {
                            $fileModel->insert();
                        } else {
                            Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Validation issue: " . print_r($fileModel->getErrors(), true));
                        }
                    } else {
                        Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Can't store the file. Internal error");
                    }
                }
            }
        }
        $this->redirect("/traveler/update/$id");
    }

    public function actionAddVisa() {
        $visa = new Visa;

        // Visa object management
        if (isset($_POST['Visa']) && !empty($_POST['id'])) {
            $msg = Authorization::can(Authorization::MANAGE_TRAVELER, array('traveler_id' => $_POST['id']));
            if ($msg !== true) {
                Utils::finalMessage($msg);
            }
            $visa->attributes = $_POST['Visa'];
            $visa->traveler_id = (int) $_POST['id'];
            if ($visa->validate()) {
                $visa->save();
            } else {
                $this->performAjaxValidation($visa);
            }
        }
    }

    public function actionDelVisa() {
        if (Yii::app()->request->isPostRequest && !empty($_GET['Visa']['id']) && !empty($_GET['Traveler']['id'])) {
            $msg = Authorization::can(Authorization::MANAGE_TRAVELER, array('traveler_id' => $_GET['Traveler']['id']));
            if ($msg !== true) {
                Utils::finalMessage($msg);
            }
            Visa::model()->deleteByPk((int) $_GET['Visa']['id']);
        } else {
            throw new CHttpException(400, 'Invalid request. You can not delete this VISA.');
        }
    }

    public function actionDelFile($id) {
        $msg = Authorization::can(Authorization::MANAGE_TRAVELER, array('traveler_id' => (int) $id));
        if ($msg !== true) {
            Utils::finalMessage($msg);
        }
        if (Yii::app()->request->isPostRequest && !empty($_GET['File']['id'])) {
            $model = TravelerFile::model()->findByPk((int) $_GET['File']['id']);
            unlink($model->path);
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. You can not delete this VISA.');
        }
        $this->redirect("/traveler/update/$id");
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        $msg = Authorization::can(Authorization::MANAGE_TRAVELER, ['traveler_id' => $id]);
        if ($msg !== true) {
            Utils::finalMessage($msg);
        }
        $model = $this->loadModel($id);
        // Do we have bookings for this traveler
        if (count($model->airBookings)) {
            \Utils::jsonResponse(['Error' => 'The traveler has bookings. Can not be deleted']);
        }
        $model->delete();
        // Delete the files if exisits
        // Del VISAs
        // Del preferences
        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax'])) {
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : ['admin']);
        }
    }

    /**
     * Default action.
     */
    public function actionIndex() {
        $this->redirect('/traveler/admin');
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        if (!\Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_TRAVELLERS) || \Authorization::getIsFrontlineStaffLogged()) {
            \Utils::finalMessage('You do not have permission to manage the travelers');
        }
        $model = new Traveler('search');
        $model->unsetAttributes();  // clear any default values
        if (!empty($_GET['Traveler']['term'])) {
            $model->term = $_GET['Traveler']['term'];
        }
        if (!empty($_GET['selectedvalue'])) {
            $model->id = $_GET['selectedvalue'];
        }

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Traveler the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = Traveler::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param Traveler $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax'])) {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    /**
     * Download TravelerFile document
     * @param type $id The id of the TravelerFile to be downloaded
     */
    public function actionDownload($id) {
        $file = TravelerFile::model()->findByPk((int) $id);
        $can = Authorization::can(Authorization::MANAGE_TRAVELER, array('traveler_id' => $file->traveler_id));
        if ($can === true) {
            Utils::sendFile($file->path, $file->name);
        } else {
            Utils::finalMessage($can);
        }
    }

    /**
     * Ajax Search for the autocomplete forms
     */
    public function actionSearch() {
        static $returnResults = 10;
        if (isset($_GET['term']) && strlen($_GET['term']) > 2) {
            if (Authorization::getIsStaffLogged()) {
                $condition = 'LOWER(search_info) like LOWER(:term)';
                $params = array(':term' => "%{$_GET['term']}%");
            } else {
                $loggedUser = Users::model()->findByPk(Yii::app()->user->id);
                $condition = 'company_id=:company_id AND LOWER(search_info) like LOWER(:term)';
                $params = array(':company_id' => $loggedUser->user_info_id, ':term' => "%{$_GET['term']}%");
            }
            $query = Yii::app()->db->createCommand()
                ->select('id as value, search_info as label, birthdate')
                ->from('v_traveler_search_info')
                ->where($condition, $params)
                ->limit($returnResults)
                ->order('id')
                ->queryAll();

            Utils::jsonHeader();
            echo json_encode($query);
        }
    }

    public function actionGetTravelerData() {
        $id = Yii::app()->request->getPost('id');
        $this->renderPartial('/traveler/_view', ['id' => $id]);
    }

}
