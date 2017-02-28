<?php

class UsersController extends Controller {

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
            'postOnly + delete, setCompany', // we only allow deletion via POST request
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return array(
            array('allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('newReg'),
                'users' => array('*'),
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('changePass', 'search', 'manage', 'stopEmulation', 'profile', 'config'),
                'users' => array('@'),
            ),
            array('allow', // allow staff to perform those actions
                'actions' => array('setCompany'),
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

    public function actionStopEmulation() {
        $emulationData = Yii::app()->user->getState('emulation');
        if ($emulationData) {
            $newIdentity = new SwitchIdentity($emulationData['id'], $emulationData['name']);
// Save the old state
            $newIdentity->setState('user_type', $emulationData['user_type']);
            Yii::app()->user->login($newIdentity);
            Yii::app()->user->setState('emulation', null);

// Redirect to the calling page
//            $this->redirect(Yii::app()->request->urlReferrer);
            $this->redirect(!empty($emulationData['returnUrl']) ? $emulationData['returnUrl'] : '/');
        } else {
            Yii::app()->session->add('htmlMessage', 'The emulation is not active.');
            $this->redirect('/site/message');
        }
    }

    /*
     * Manage the users
     */

    public function actionManage($selectedvalue = null, $searchbox = null) {

// POST request
        if (Yii::app()->request->isPostRequest && isset($_POST['action'])) {
            switch ($_POST['action']) {
// Change the user status
                case 'user_status':
                    $res = Authorization::can(Authorization::CHANGE_STATUS, array('user_id' => (int) $_POST['id']));
                    if ($res === true) {
                        if (isset($_POST['id']) && isset($_POST['status'])) {
                            $res = Users::model()->updateByPk((int) $_POST['id'], array('enabled' => (int) $_POST['status']));
                            if ($res === 1) {
                                $out = array('result' => 'success');
                                if ($_POST['status'] == '1')    // write the activation date
                                    $res = Users::model()->updateByPk((int) $_POST['id'], array('activated' => new CDbExpression('CURRENT_TIMESTAMP')));
                                else
                                    $res = Users::model()->updateByPk((int) $_POST['id'], array('deactivated' => new CDbExpression('CURRENT_TIMESTAMP')));
                            } else
                                $out = array('result' => 'error');
                        }
                    } else
                        $out = array('result' => $res);
                    break;
// Register new user
                case 'new_user':
                    if (isset($_POST['Users'])) {
                        $searchbox = null;
                        $newUser = new Users('newReg');
                        $newUser->attributes = $_POST['Users'];
                        $newUser->terms = 1;  // Automatic terms agreement
                        $newUser->password = \Cc::random_string(8);  // Automatic pass assigment
                        $newUser->password2 = $newUser->password;
                        if ($newUser->validate()) {
                            $user = $this->loadModel(Yii::app()->user->id);
                            // New userinfo object in case of staff member
                            if ($user->isStaff) {
                                $userInfo = new UserInfo;
                                $userInfo->name = $newUser->name;
                                $userInfo->mobile = $newUser->mobile;
                                $userInfo->email = $newUser->email;
                                $userInfo->city_id = $user->userInfo->city_id;
                                $userInfo->user_type_id = $newUser->userTypeId ? : UserType::frontlineStaff;
                                $userInfo->insert();
                                $newUser->user_info_id = $userInfo->id;
                                $newUser->city_id = $userInfo->city_id;
//                                $newUser->address = $userInfo->address;
//                                $newUser->pincode = $userInfo->pincode;
                            } else {
                                $newUser->user_info_id = $user->user_info_id;
                                $newUser->city_id = $user->userInfo->city_id;
                                $newUser->address = $user->userInfo->address;
                                $newUser->pincode = $user->userInfo->pincode;
                            }

                            $newUser->pass_reset_code = sha1(microtime(true) . "pakTakaTukaSomethingElse");
                            $newUser->insert();
                            // Send new user pass reset email
                            $newUser->welcomeEmail();

                            $model = $newUser;
                            $newUser = new Users('newReg');
                        } else {    // Use the current user as default
                            $model = $this->loadModel(Yii::app()->user->id);
                        }

                        $this->render('manage', array(
                            'model' => $model,
                            'newUser' => $newUser,
                            'searchbox' => $searchbox,
                        ));
                        Yii::app()->end();
                    }
                    break;

// Emulation check
                case 'emulation':
                    if (isset($_POST['id'])) {
                        $res = Authorization::can('emulate', array('user_id' => (int) $_POST['id']));
                        if ($res === true) {
                            $user = Users::model()->findByPk((int) $_POST['id']);
                            if ($user) {
                                $newIdentity = new SwitchIdentity($user->id, $user->email);
// Save the old state
                                $newIdentity->setState('emulation', array(
                                    'id' => Yii::app()->user->id,
                                    'name' => Yii::app()->user->name,
                                    'user_type' => Yii::app()->user->getState('user_type'),
                                    'returnUrl' => Yii::app()->request->urlReferrer,
                                ));
                                $newIdentity->setState('user_type', $user->userInfo->user_type_id);
                                Yii::app()->user->login($newIdentity);
//                                Yii::log(print_r(Yii::app()->user->getState('emulation'), true));
//                                Yii::log("New type: " . Yii::app()->user->getState('user_type') .
//                                        "\nNew ID: " . Yii::app()->user->id .
//                                        "\nNew name: " . Yii::app()->user->name
//                                );
                                $out = array('result' => 'success');
                            } else
                                $out = array('result' => 'Unknown user to emulate');
                        } else
                            $out = array('result' => $res);
                    }
                    break;

                default:
                    $out = array('result' => 'Unknown action');
                    break;
            }

            Utils::jsonHeader();
            echo json_encode($out);
            Yii::app()->end();
        }

// Go to the logged user if not staff, not searchbox and not same company
        if (!Authorization::getIsStaffLogged() && $searchbox === null &&
                !Authorization::getIsUserFromActiveCompany()) {
            $selectedvalue = Yii::app()->user->id;
        }

        if (!empty($selectedvalue)) { // Choosen specific user
            $model = $this->loadModel((int) $selectedvalue);
// Save the active company data
            Utils::setActiveUserAndCompany($selectedvalue);
        } else {
            $model = new Users('newReg');
        }

        $newUser = new Users('newReg');
        $this->render('manage', array(
            'model' => $model,
            'newUser' => $newUser,
            'searchbox' => $searchbox,
        ));
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionNewReg() {
        $model = new Users('newReg');
        $userInfo = new UserInfo();

// Uncomment the following line if AJAX validation is needed
// $this->performAjaxValidation($model);

        if (isset($_POST['Users']) && isset($_POST['UserInfo'])) {
            $model->attributes = $_POST['Users'];
            $model->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
            $userInfo->attributes = $_POST['UserInfo'];
            $userInfo->validate();
            if ($model->validate() && $userInfo->validate() && $userInfo->save()) {
                $model->user_info_id = $userInfo->id;
                $model->city_id = $userInfo->city_id;
                $model->address = $userInfo->address;
                $model->pincode = $userInfo->pincode;
                $model->save();
// Send welcome email to the new user with link for Password revive
                $model->welcomeEmail();
                Yii::app()->session->add('htmlMessage', 'Your registration was success.<br>You will receive email with further instructions from us how to proceed.<br>Please check your inbox and if no email from us is found, check also your SPAM folder.');
                $this->redirect('/site/message');
            }
        }

        $this->render('newreg', array(
            'model' => $model,
            'userInfo' => $userInfo,
        ));
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
                $loggedUser = $this->loadModel(Yii::app()->user->id);
                $condition = 'company_id=:company_id AND LOWER(search_info) like LOWER(:term)';
                $params = array(':company_id' => $loggedUser->user_info_id, ':term' => "%{$_GET['term']}%");
            }
            $query = Yii::app()->db->createCommand()
                    ->select('id as value, search_info as label, company_id')
                    ->from('v_search_info')
                    ->where($condition, $params)
                    ->limit($returnResults)
                    ->order('id')
                    ->queryAll();

            Utils::jsonHeader();
            echo json_encode($query);
        }
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdateSelf() {
        $model = $this->loadModel(Yii::app()->user->id);

// Uncomment the following line if AJAX validation is needed
// $this->performAjaxValidation($model);

        if (isset($_POST['Users'])) {
            $model->attributes = $_POST['Users'];
            if ($model->save()) {
                $this->redirect(array('view', 'id' => $model->id));
            }
        }

        $this->render('update', array(
            'model' => $model,
        ));
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        if (Yii::app()->request->isPostRequest) {
// we only allow deletion via POST request
            Users::model()->updateByPk($id, array('enabled' => false));

// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
            if (!isset($_GET['ajax'])) {
                $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
            }
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    public function actionSetCompany($id) {
// Save the active user & company data
        if (Utils::setActiveUserAndCompany((int) $id)) {
            echo Utils::widgetActiveUserAndCompany();
        } else {
            echo "Can't find the company of user: $id\nLooks like this is a staff member!";
        }
    }

    public function actionProfile($id) {
        $res = Authorization::can('set_user_profile', ['user_id' => (int) $id]);
        if ($res === true) {
            // Save the active user & company data
            Utils::setActiveUserAndCompany($id);

            $model = $this->loadModel($id);
            if (isset($_POST['Users'])) {
                // Save some values for comparison if they need to be logged
                $oldEmail = $model->email;
                $oldMobile = $model->mobile;
                $model->attributes = $_POST['Users'];
                if ($model->validate()) {
                    $model->save();
                    // Equalize the UserInfo in case of B2C client
                    if ($model->userInfo->user_type_id === \UserType::clientB2C) {
                        $model->setSameUserInfoBasics();
                    }

                    if ($oldEmail != $model->email) {
                        \LogModel::logAction(LogOperation::USER_EMAIL_CHANGE, $model->id, $oldEmail, $model->email);
                    }
                    if ($oldMobile != $model->mobile) {
                        \LogModel::logAction(LogOperation::USER_MOBILE_CHANGE, $model->id, $oldMobile, $model->mobile);
                    }
                }
            }
            if (isset($_POST['pass_reset_email']) || isset($_POST['pass_reset_sms'])) {
                $model->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
                $model->save();
                $model->passResetEmail();
                Yii::app()->user->setFlash('pass_reset', 'The password has beeen reset');
            }
            if (isset($_POST['permissions_save'])) {
//                Yii::log(print_r(array_keys($_POST['Permission']), true));
                // Permissions for changing the permissions are separate
                $res2 = Authorization::can(\Authorization::SET_USER_PERMISSIONS, ['user_id' => (int) $id]);
                if ($res2 === true) {
                    PermissionXUser::model()->deleteAllByAttributes(['user_id' => (int) $id]);
                    foreach ($_POST['Permission'] as $permissionId => $v) {
                        $individualPermission = new PermissionXUser;
                        $individualPermission->user_id = (int) $id;
                        $individualPermission->permission_id = (int) $permissionId;
                        if (!$individualPermission->save()) {
                            \Yii::app()->session->add('htmlMessage', print_r($individualPermission->getErrors(), true));
                            $this->redirect('/site/message');
                        }
                    }
                    \Yii::app()->user->setFlash('permissions_msg', 'Individual permissions are configured and saved');
                } else {
                    \Yii::app()->user->setFlash('permissions_msg', $res2);
                }
            }
            $this->render('profile', ['model' => $model]);
        } else {
            \Yii::app()->session->add('htmlMessage', $res);
            $this->redirect('/site/message');
        }
    }

    public function actionConfig($id) {
        Yii::app()->session->add('htmlMessage', "The config feature is coming soon!");
        $this->redirect('/site/message');
//        $res = Authorization::can('set_user_profile', array('user_id' => (int) $id));
//        if ($res === true) {
//            $model = $this->loadModel($id);
//            if (isset($_POST['Users'])) {
//                $model->attributes = $_POST['Users'];
//                if ($model->validate())
//                    $model->save();
//            }
//            if (isset($_POST['pass_reset_email']) || isset($_POST['pass_reset_sms'])) {
//                $model->pass_reset_code = sha1(microtime(true) . "bezNikakyvTashak");
//                $model->save();
//                $model->passResetEmail();
//                Yii::app()->user->setFlash('pass_reset', 'The password has beeen reset');
//            }
//            $this->render('profile', array('model' => $model));
//        } else {
//            Yii::app()->session->add('htmlMessage', $res);
//            $this->redirect('/site/message');
//        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $dataProvider = new CActiveDataProvider('Users');
        $this->render('index', array(
            'dataProvider' => $dataProvider,
        ));
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new Users('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Users'])) {
            $model->attributes = $_GET['Users'];
        }

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return Users the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = Users::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested User does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param Users $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'users-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    /**
     * Change password
     */
    public function actionChangePass() {
        $model = new ChangePassForm;

        if (isset($_POST['ChangePassForm'])) {
            $model->attributes = $_POST['ChangePassForm'];
            if ($model->validate()) {
                $user = Users::model()->findByPk(Yii::app()->user->id);
                if ($user->password == crypt($model->oldPassword, $user->password)) {
                    $user->password = Utils::passCrypt($model->newPassword);
                    if ($user->save()) {
                        $model->unsetAttributes();
                        Yii::app()->user->setFlash(TbHtml::ALERT_COLOR_SUCCESS, "The password was changed succefully!");
                    }
                } else {
                    $model->addError('oldPassword', 'The password is not valid');
                }
            }
        }

        $this->render('changepass', array('model' => $model));
    }

}
