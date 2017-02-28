<?php

class CityPairsController extends Controller {

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
            ['allow',
                'actions' => ['index', 'admin', 'delete', 'create'],
                'expression' => '\Authorization::getIsTopStaffOrAccountantLogged()'
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    public function actionIndex() {
        $this->redirect('/cityPairs/admin');
    }

    public function actionAdmin() {
        $model = new CityPairs('search');
        if (isset($_GET['CityPairs'])) {
            $model->attributes = $_GET['CityPairs'];
        }
        $carriers = \Carrier::model()->findAllBySql("SELECT carrier.* FROM carrier WHERE carrier.id in (SELECT DISTINCT backend.carrier_id FROM backend) ORDER BY carrier.name");
        if (Yii::app()->request->isAjaxRequest) {
            $this->renderPartial('_admin_grid', [
                'model' => $model,
                'carriers' => $carriers
            ]);
        } else {
            $this->render('admin', [
                'model' => $model,
                'carriers' => $carriers
            ]);
        }
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param array $ids the ID of the model to be loaded
     * @return CityPairs the loaded model
     * @throws CHttpException
     */
    public function loadModel(array $ids) {
        $model = \CityPairs::model()->findByPk($ids);
        if ($model === null) {
            throw new CHttpException(404, 'The requested object does not exist.');
        }
        return $model;
    }

    /**
     * Deletes a particular model.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete() {
        $this->loadModel([
            'carrier_id' => Yii::app()->request->getQuery('carrier_id'),
            'source_id' => Yii::app()->request->getQuery('source_id'),
            'destination_id' => Yii::app()->request->getQuery('destination_id'),
        ])->delete();
    }

    /**
     * Creates new CcPasstru record.
     */
    public function actionCreate() {
        $model = new CityPairs;
        if (isset($_POST['CP'])) {
            $model->attributes = $_POST['CP'];
            $model->source_id = \Airport::getIdFromCode($model->source_id, false);
            $model->destination_id = \Airport::getIdFromCode($model->destination_id, false);
            if (!$model->validate()) {
                $errors = $model->errors;
                echo print_r(reset($errors)[0], true);
            } elseif (empty($model->source_id)) {
                echo 'Please select origination airport';
            } elseif (empty($model->destination_id)) {
                echo 'Please select destination airport';
            } elseif (empty($model->carrier_id)) {
                echo 'Please select airline';
            } else {
                $model->insert();
            }
        }
    }

}
