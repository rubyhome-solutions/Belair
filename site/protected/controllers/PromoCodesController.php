<?php

class PromoCodesController extends Controller {

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
                'actions' => ['admin', 'create', 'delete', 'index', 'update', 'view', 'test', 'search', 'searchAirsource', 'searchUserType', 'searchUserInfo', 'searchAirlines', 'searchUsers', 'promoRangeCreate', 'promoRangeUpdate', 'promoRangeDelete', 'copy'],
                'users' => ['@'],
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * get user info list
     * @return array
     */
    protected function getCompanyList() {

        $companies = UserInfo::model()->findAll(array(
            'select' => 'id, name, email',
            'condition' => 'user_type_id=\'' . \UserType::distributor . '\' or user_type_id=\'' . \UserType::agentDirect . '\'',
            'order' => 'name ASC'
        ));

        $list = array();
        $companylist = array();

        foreach ($companies as $idx => $item) {
            $lbl = $item->name;
            $list[] = array(
                'label' => $lbl,
                'value' => $lbl,
                'id' => $item->id
            );

            $companylist[$item->id] = $lbl;
        }

        return array($list, $companylist);
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $model = new PromoCodes('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['PromoCodes'])) {
            $model->attributes = $_GET['PromoCodes'];
        }
        $this->render('index', array(
            'model' => $model,
        ));
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $model = $this->loadModel((int) $id);
        $promoFilter = new \PromoFilter(json_decode($model->filter));

        $promoFilterString = $promoFilter->getStringForElements();
        //  Utils::dbgYiiLog($promoFilterString);
        // Permission check
        if (!Authorization::getIsStaffLogged()) {
            Utils::finalMessage('You do not have authorization to update this Promo Code');
        }

        if (isset($_POST['PromoCodes']) && isset($_POST['PromoFilter'])) {
            $model->attributes = $_POST['PromoCodes'];
            $filter = new \PromoFilter;
            $filter->setAttributes($_POST['PromoFilter']);
            $model->filter = $filter->getAsString();
            if ($model->validate()) {
                $model->save();
                $promoFilternew = new \PromoFilter(json_decode($model->filter));
                $promoFilterString = $promoFilternew->getStringForElements();
            }
        }

        $this->render('update', array(
            'model' => $model,
            'promoFilterString' => $promoFilterString,
        ));
    }

    /**
     * Creates new PromoCode record.
     */
    public function actionCreate() {
        $model = new PromoCodes;
        // Permission check
        if (!Authorization::getIsStaffLogged()) {
            Utils::finalMessage('You do not have authorization to create this Promo Code');
        }
        $promoFilterString = [];
        if (isset($_POST['PromoCodes']) && isset($_POST['PromoFilter'])) {
            $model->attributes = $_POST['PromoCodes'];
            $filter = new \PromoFilter;
            $filter->setAttributes($_POST['PromoFilter']);
            $model->filter = $filter->getAsString();
            if (empty($model->code)) {
                echo 'The code filed is empty and the record can not be added!';
            } else {
                $model->code = htmlentities(strtoupper($model->code));
                if ($model->validate()) {
                    $model->save();
                    $this->redirect(array('update', 'id' => $model->id));
                    //$promoFilternew=new \PromoFilter(json_decode($model->filter));
                    //$promoFilterString=$promoFilternew->getStringForElements();
                }
            }
        }
        $this->render('create', array(
            'model' => $model,
            'promoFilterString' => $promoFilterString,
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
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new PromoCodes('search');
        $model->unsetAttributes();  // clear any default values
    }

    /**
     * Displays a particular Promo Code.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id) {
        $model = $this->loadModel($id);
        list($list, $companyList) = $this->getCompanyList();
        // Permission check
        if (!Authorization::getIsStaffLogged()) {
            Utils::finalMessage('You do not have authorization to view this Promo Code');
        }
        if (isset($_POST['PromoCodes'])) {
            $model->attributes = $_POST['PromoCodes'];
            if ($model->validate()) {
                $model->save();
            }
        }
        $this->render('view', [
            'model' => $model,
            'companies' => $companyList,
            'list' => $list,
        ]);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return TourCode the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = PromoCodes::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Ajax Search for the autocomplete forms
     */
    public function actionSearch() {
        static $returnResults = 10;
        Utils::jsonHeader();
        if (isset($_GET['q']) && strlen($_GET['q']) > 2) {
            $condition = "code LIKE(:term) AND enabled=1 AND date_valid_to>='" . date('Y-m-d') . "'";
            $params = array(':term' => strtoupper($_GET['q']) . "%");
            $query = Yii::app()->db->createCommand()
                ->select('id, code as name')
                ->from('promo_codes')
                ->where($condition, $params)
                ->limit($returnResults)
                ->order('id')
                ->queryAll();
            echo json_encode($query);
        }
    }

    public function actionSearchAirsource() { //completion variants
        $result = [];
        $term = strtolower($_GET['q']);
        $term = addcslashes($term, '%_');
        $airsources = \AirSource::model()->findAll(array(
            'select' => 'id, name',
            'condition' => 'lower(name) like :sourcename',
            'order' => 'name ASC',
            'params' => array('sourcename' => "%$term%")
        ));

        foreach ($airsources as $as) {
            $ar = array('id' => $as->id, 'name' => $as->name);
            $result[] = $ar;
        }

        echo json_encode($result);
    }

    public function actionSearchUserType() {
        $result = [];
        $term = strtolower($_GET['q']);
        $term = addcslashes($term, '%_');
        $types = \UserType::model()->findAll(array(
            'select' => 'id, name',
            'condition' => 'lower(name) like :name',
            'order' => 'name ASC',
            'params' => array('name' => "%$term%")
        ));

        foreach ($types as $as) {
            $ar = array('id' => $as->id, 'name' => $as->name);
            $result[] = $ar;
        }

        echo json_encode($result);
    }

    public function actionSearchUserInfo() {
        $result = [];
        $term = strtolower($_GET['q']);
        $term = addcslashes($term, '%_');
        $infos = \UserInfo::model()->findAll(array(
            'select' => 'id, name',
            'condition' => 'lower(name) like :name',
            'order' => 'name ASC',
            'params' => array('name' => "%$term%")
        ));

        foreach ($infos as $as) {
            $ar = array('id' => $as->id, 'name' => $as->name);
            $result[] = $ar;
        }

        echo json_encode($result);
    }

    public function actionSearchAirlines() { //completion variants
        $result = [];
        $term = strtolower($_GET['q']);
        $term = addcslashes($term, '%_');
        $list = \Carrier::model()->findAll(array(
            'select' => 'id, name',
            'condition' => 'lower(name) like :name',
            'order' => 'name ASC',
            'params' => array('name' => "%$term%")
        ));

        foreach ($list as $as) {
            $ar = array('id' => $as->id, 'name' => $as->name);
            $result[] = $ar;
        }

        echo json_encode($result);
    }

    public function actionSearchUsers() { //completion variants
        $result = [];
        $term = strtolower($_GET['q']);
        $term = addcslashes($term, '%_');
        $users = \Users::model()->findAll(array(
            'select' => 'id, name',
            'condition' => 'lower(name) like :name',
            'order' => 'name ASC',
            'params' => array('name' => "%$term%")
        ));

        foreach ($users as $as) {
            $ar = array('id' => $as->id, 'name' => $as->name);
            $result[] = $ar;
        }

        echo json_encode($result);
    }

    public function actionTest() {
        $model = $this->loadModel(10);
        $ac = \AirCart::model()->findByPk(198);
        if ($model->checkPromoFilter($ac))
            \Utils::dbgYiiLog('Passed CheckPromo Filter');
        else
            \Utils::dbgYiiLog('Failed CheckPromo Filter');
    }

    /**
     * Rename airline
     */
    public function actionPromoRangeUpdate() {
        $id = Yii::app()->request->getPost('id');
        if ($id) {
            $model = \PromoRange::model()->findByPk($id);
            if ($model !== null) {
                $field = Yii::app()->request->getPost('name');
                $model->$field = Yii::app()->request->getPost('value');
                if ($model->validate()) {
                    $model->update([$field]);
                }
            }
        }
    }

    public function actionPromoRangeCreate() {
        $model = new PromoRange;
        if (isset($_POST['PR'])) {
            $model->attributes = $_POST['PR'];
            $model->save();
        }
        \Utils::jsonResponse('');
    }

    public function actionPromoRangeDelete($id) {
        if (Yii::app()->request->isPostRequest) {
            // we only allow deletion via POST request
            $model = PromoRange::model()->findByPk($id);
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Copy Promo Rules when creating New Promocodes 
     */
    public function actionCopy($id) {
        if (!Authorization::getIsStaffLogged()) {
            Utils::finalMessage('You do not have authorization to create this Promo Code');
        }
        $model = $this->loadModel($id);
        $model->id = null;
        $model->isNewRecord = true;
        $promoFilterString = [];
        if(!empty($_POST)) {
            $this->forward('create');
        }
        $this->render('create', array(
            'model' => $model,
            'promoFilterString' => $promoFilterString,
        ));
    }

}
