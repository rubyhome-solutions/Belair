<?php

class XRateController extends Controller {

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
                'actions' => ['index', 'geoIpV2'],
                'users' => ['@'],
            ],
            ['allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => ['update', 'rename', 'airline', 'renameAirline', 'airport', 'createAirport', 'renameAirport', 'getStates','getCities', 'airlineFlip'],
                'expression' => '\Authorization::getDoLoggedUserHasPermission(\Permission::VIEW_ACCOUNTS)'
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate() {
        $model = new XRate;
        $model->refreshData();
        $this->renderPartial('_admin_grid', ['xrate' => \XRate::model()->find()]);
    }

    /**
     * Manage Airlines
     */
    public function actionAirline() {
        $model = new \Carrier('search');
        $model->unsetAttributes();
        if (isset($_GET['Carrier'])) {
            $model->attributes = $_GET['Carrier'];
        }
        $this->render('_carrier_grid', ['model' => $model]);
    }

    /**
     * Manage Airports
     */
    public function actionAirport() {
        $model = new \Airport('search');
        $model->unsetAttributes();
        if (isset($_GET['Airport'])) {
            $model->attributes = $_GET['Airport'];
        }
        $this->render('_airport_grid', ['model' => $model]);
    }

    /**
     * Create Airport 
     */
    public function actionCreateAirport() {
        if (!Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_SOURCES_BOOKING_WORK_FLOW)) {
            Utils::finalMessage('You do not have permission to manage the Air Sources!');
        }
        $model = new \Airport();
        if (isset($_POST['Airport'])) {
            $_POST['Airport']['city_name']=$_POST['city_name'];
            $model->attributes = $_POST['Airport'];
            if ($model->save()) {
                $this->redirect(array('Airport', 'id' => $model->id));
            }
        }
        $this->render('create_airport', array(
            'model' => $model,
        ));
    }

    public function actiongetStates() {
        $statesList = \Country::model()->findByAttributes(array('code' => $_POST['country_code']));
        $statesListDropdown = CHtml::listData($statesList->states, 'id', 'name');
        echo CHtml::tag('option', array('value' => ''), CHtml::encode('Select States'), true);
        foreach ($statesListDropdown as $value => $name) {
            echo CHtml::tag('option', array('value' => $value), CHtml::encode($name), true);
        }

        //\Utils::dbgYiiLog($statesList->states);
    }
    public function actiongetCities() {
        $citiesList = \State::model()->findByAttributes(array('id' => $_POST['state_id']));
        $citiesListDropdown = CHtml::listData($citiesList->cities, 'id', 'name');
         echo CHtml::tag('option', array('value' => ''), CHtml::encode('Select City'), true);
        foreach ($citiesListDropdown as $value => $name) {
            echo CHtml::tag('option', array('value' => $name), CHtml::encode($name), true);
        }
    }

    /**
     * Rename currency
     */
    public function actionRename() {
        $id = Yii::app()->request->getPost('id');
        if ($id > 8) {
            $model = \Currency::model()->findByPk($id);
            if ($model !== null) {
                $model->name = Yii::app()->request->getPost('value');
                $model->update(['name']);
            }
        }
    }

    /**
     * Rename airline
     */
    public function actionRenameAirline() {
        $id = Yii::app()->request->getPost('id');
        if ($id) {
            $model = \Carrier::model()->findByPk($id);
            if ($model !== null) {
                $model->name = Yii::app()->request->getPost('value');
                $model->update(['name']);
            }
        }
    }

    /**
     * Toggle Airline state ON / OFF
     */
    public function actionAirlineFlip($id) {
        $model = \Carrier::model()->findByPk($id);
        if ($model !== null) {
            $model->disabled = 1 - $model->disabled;
            $model->update(['disabled']);
        }
    }

    /**
     * Rename airline
     */
    public function actionRenameAirport() {
        $id = Yii::app()->request->getPost('id');
        if ($id) {
            $model = \Airport::model()->findByPk($id);
            if ($model !== null) {
                $field = Yii::app()->request->getPost('name');
                $model->$field = Yii::app()->request->getPost('value');
                if ($model->validate()) {
                    $model->update([$field]);
                }
            }
        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $model = \XRate::model()->find();
        if (Yii::app()->request->isAjaxRequest) {
            $this->renderPartial('_admin_grid', ['xrate' => $model]);
        } else {
            $this->render('index', ['xrate' => $model]);
        }
    }

    public function actionGeoIpV2($id) {
        $pg = \PayGateLog::model()->findByPk($id);
        if ($pg === null) {
            \Utils::jsonResponse(['error' => 'Transaction not found'], 404);
        }
        /* @var $pg \PayGateLog */
        $geoip = json_decode($pg->geoip);
        if (!isset($geoip->more)) {
            $geoip->more = \Utils::getGeoIpJsonStringV2(\Yii::app()->request->getPost('ip'));
            $pg->geoip = json_encode($geoip);
            $pg->update(['geoip']);
        }
        \Utils::jsonResponse($geoip->more);
    }

}
