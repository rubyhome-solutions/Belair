<?php

class UserInfoController extends Controller {

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
                'actions' => array('downloadLogo'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('getBalance'),
                'users' => array('@'),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('update', 'download'),
                'users' => array('@'),
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Updates the company info
     * @param integer $id the ID of the user that belongs to the company to be updated
     */
    public function actionUpdate($id) {
        $user = new Users;
        $user = $user->findByPk((int) $id);
        if ($user === null) {
            throw new CHttpException(404, 'User not found');
        }
        // Authorization
        if ($user->isStaff) {
            $msg = Authorization::can(Authorization::MANAGE_STAFF, array('user_id' => (int) $id));
        } else {
            $msg = Authorization::can(Authorization::CONFIG_COMPANY, array('user_id' => (int) $id));
        }
        if ($msg !== true)
            Utils::finalMessage($msg);

        // Save the active user & company data
        Utils::setActiveUserAndCompany($id);
        $model = $this->loadModel($user->user_info_id);

        // Can the logged user edit or only view
        $canEdit = Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_COMPANY_INFO);

        if (isset($_POST['UserInfo']) && $canEdit) {
            // Sanitize the input
            unset($_POST['UserInfo']['balance']);
            if (!Authorization::getIsStaffLogged()) {
                unset($_POST['UserInfo']['currency_id']);
                unset($_POST['UserInfo']['user_type_id']);
                unset($_POST['UserInfo']['credit_limit']);
                $_POST['UserInfo']['rating'] = $model->rating;
            }
            $oldEmail = $model->email;
            $oldMobile = $model->mobile;
            $oldCurrency = $model->currency_id;
            $model->attributes = $_POST['UserInfo'];

            // Can we change the currency - forbid in case of existing payments or transactions
            if ($oldCurrency != $model->currency_id && $model->hasTransactionsOrPayments()) {
                $model->addError('currency_id', 'The currency can not be changed, since there are existing transactions or payments');
            }
            // Rating widget zero fix
            if (!isset($_POST['UserInfo']['rating'])) {
                $model->rating = 0;
            }

            // Not Distributor , but has resellers
            if ($model->user_type_id != UserType::distributor && count($model->resellers) > 0) {
                $model->addError('user_type_id', 'This company has resellers, should stay as distributor, until the resellers and not re-configured!');
            }
            // Distributor check
            elseif ($model->user_type_id == UserType::agentUnderDistributor) {
                if (!isset($model->distributor)) {
                    $model->addError('user_type_id', 'The distributor is not set!');
                    Yii::app()->user->setFlash('distributor_msg', 'Please set the distributor!');
                }
            } else {
                // Silently remove eventual distributor leftovers
                SubUsers::model()->deleteAllByAttributes(array('reseller_id' => $model->id));
            }
            if ($model->user_type_id === UserType::clientB2C)
                $model->setScenario('B2C');

            
            if (!$model->hasErrors() && $model->validate()) {
                if (!$model->save()) {
                    Utils::finalMessage('Error: ' . print_r($model->getErrors(), TRUE));
                } else { // Log the actions if needed
                    if ($oldEmail != $model->email) {
                        \LogModel::logAction(LogOperation::COMPANY_EMAIL_CHANGE, $model->id, $oldEmail, $model->email);
                    }
                    if ($oldMobile != $model->mobile) {
                        // Reflect the phone changes in the UI
                        $model->setSessionPhone();
                        \LogModel::logAction(LogOperation::COMPANY_MOBILE_CHANGE, $model->id, $oldMobile, $model->mobile);
                    }
                }
            }
        }

        // Update staff case
        if (isset($_POST['Users']) && isset($_POST['UserInfo'])) {
            $model->attributes = $_POST['UserInfo'];
            $oldEmail = $user->email;
            $oldMobile = $user->mobile;
            $user->attributes = $_POST['Users'];
            // Silently Remove eventual distributor leftovers
            SubUsers::model()->deleteAllByAttributes(array('reseller_id' => $model->id));
            // Rating widget zero fix
            if (!isset($_POST['UserInfo']['rating']))
                $model->rating = 0;
            $model->name = $user->name;
            $model->email = $user->email;
            $model->mobile = $user->mobile;
            $model->setScenario('Staff');
            if ($model->validate() && $user->validate()) {
                $model->save();
                $user->save();
                // Log the actions if needed
                if ($oldEmail != $user->email)
                    \LogModel::logAction(LogOperation::USER_EMAIL_CHANGE, $user->id, $oldEmail, $user->email);
                if ($oldMobile != $user->mobile)
                    \LogModel::logAction(LogOperation::USER_MOBILE_CHANGE, $user->id, $oldMobile, $user->mobile);
            }
        }

        // Set the distributor
        if (!empty($_POST['distributor']) && !$model->hasErrors() && $model->validate()) {
            $model->user_type_id = UserType::agentUnderDistributor;
            SubUsers::model()->deleteAllByAttributes(array('reseller_id' => $model->id));
            $subUser = new SubUsers;
            $subUser->reseller_id = $model->id;
            $subUser->distributor_id = (int) $_POST['distributor'];
            if ($subUser->validate()) {
                $subUser->insert();
                $model->save();
                Yii::app()->user->setFlash('distributor_msg', 'The distributor was set successfully');
            } else
                Yii::app()->user->setFlash('distributor_msg', print_r($subUser->getErrors(), true));
        }

        // Add File
        if (isset($_FILES['filename'])) {
            if ($_FILES['filename']['error'] != 0) {
                Yii::app()->user->setFlash('files_msg', "<b>Error: </b>No file is attached");
            } else {
                if (!in_array(strrchr($_FILES['filename']['name'], '.'), UserFile::$acceptedFileExtensions)) {
                    Yii::app()->user->setFlash('files_msg', "<b>Error: </b>The file extension is not allowed");
                } else {
                    $path = UserFile::storageDirectory() . md5(microtime(true));
                    // move the new file
                    if (move_uploaded_file($_FILES['filename']['tmp_name'], $path)) {
                        $fileModel = new UserFile;
                        $fileModel->user_info_id = $model->id;
                        $fileModel->user_visible = empty($_POST['file_user_visible']) ? 0 : 1;
                        $fileModel->path = $path;
                        $fileModel->name = $_FILES['filename']['name'];
                        $fileModel->doc_type_id = $_POST['file_type'];
                        if ($fileModel->validate()) {
                            $fileModel->insert();
                            // Change the logo url - in case the logo was changed
                            $model->setSessionLogo();
                        } else {
                            Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Validation issue: " . print_r($fileModel->getErrors(), true));
                        }
                    } else {
                        Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Can't store the file. Internal error");
                    }
                }
            }
        }

        //Delete file
        if (!empty($_POST['fileDelete'])) {
            // Same permission fro delete as for the download
            $can = Authorization::can(Authorization::DOWNLOAD_COMPANY_DOCUMENT, array('doc_id' => (int) $_POST['fileDelete']));
            if ($can === true) {
                if (($file = UserFile::model()->findByPk((int) $_POST['fileDelete'])) !== null) {
                    unlink($file->path);
                    $file->delete();
                }
            } else {
                Yii::app()->user->setFlash('files_msg', $can);
            }
        }

        // Separate view for the staff
        if (in_array($model->user_type_id, Authorization::$staffRoles)) {
            $this->render('updatestaff', [
                'model' => $model,
                'user' => $user,
            ]);
        } else {
            $this->render('update', [
                'model' => $model,
                'user' => $user,
            ]);
        }
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return UserInfo the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = UserInfo::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Download UserFile document
     * @param type $id The id of the UserFile to be downloaded
     */
    public function actionDownload($id) {
        $can = Authorization::can(Authorization::DOWNLOAD_COMPANY_DOCUMENT, array('doc_id' => (int) $id));
        if ($can === true) {
            $file = UserFile::model()->findByPk((int) $id);
            Utils::sendFile($file->path, $file->name);
        } else {
            Utils::finalMessage($can);
        }
    }

    /**
     * Download UserFile logo or any image
     * @param type $id The id of the UserFile to be downloaded
     */
    public function actionDownloadLogo($id) {
        $file = UserFile::model()->findByPk((int) $id);
        if ($file !== null && $file->doc_type_id === DocType::LOGO_FILE_TYPE) {
            Utils::sendImage($file->path, $file->name);
        }
    }

    public function actionGetBalance($id) {
        $model = $this->loadModel($id);
        Utils::jsonHeader();
        echo json_encode(['balance' => $model->balance, 'credit' => $model->credit_limit], JSON_NUMERIC_CHECK);
    }

}
