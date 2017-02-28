<?php

class CommercialController extends Controller {

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
            'postOnly + delete, massAssign', // we only allow deletion via POST request
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
                'actions' => array('admin', 'index', 'create', 'delete', 'update', 'addRule', 'saveRule', 'deleteRule', 'rename', 'disable', 'massAssign'),
                'expression' => '\Authorization::getIsTopStaffOrAccountantLogged()'
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
        if (Yii::app()->request->isAjaxRequest && isset($_POST['CommercialPlan'])) {
            $model = new CommercialPlan;
            $model->attributes = $_POST['CommercialPlan'];
            $model->save();
            $originalPlanId = Yii::app()->request->getPost('copyPlan');
            if ($originalPlanId) {  // Copy all the rules from this plan to the new one
                $original = $this->loadModel($originalPlanId);
                foreach ($original->commercialRules as $rule) {
                    $rule->id = null;
                    $rule->isNewRecord = true;
                    $rule->insert();
                    Yii::app()->db->createCommand()->insert('commercial_x_rule', [
                        'plan_id' => $model->id,
                        'rule_id' => $rule->id
                    ]);
                }
            }
        }
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $model = $this->loadModel($id);
        if (isset($_POST['CommercialPlan'])) {
            $model->attributes = $_POST['CommercialPlan'];
            $model->save();
        }

        if (Yii::app()->request->getQuery('ruleId')) {
            Yii::app()->session->add('ruleId', (int) Yii::app()->request->getQuery('ruleId'));
        }
        if (Yii::app()->request->getQuery('ajax') !== null && 
            strstr(Yii::app()->request->getQuery('ajax'), 'payment_convenience_fee_grid', true) === 'payment_convenience_fee_grid'){
            $rule_id = str_replace('payment_convenience_fee_grid','',Yii::app()->request->getQuery('ajax'));
            $rule = \CommercialRule::model()->findByPk($rule_id);
            $this->renderPartial('/commercial/_pymt_conv_fee_grid', ['rule' => $rule]);
            Yii::app()->end();
        }
        $this->render('update', [
            'model' => $model,
            'ruleId' => Yii::app()->session->get('ruleId')
        ]);
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        $model = $this->loadModel($id);
        // we only allow deletion via POST request
        if (Yii::app()->request->isAjaxRequest && count($model->userInfos) === 0) {
            // Delete the rules for this plan
            foreach ($model->commercialRules as $rule) {
                $rule->delete();
            }
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    public function actionIndex() {
        $this->redirect('/commercial/admin');
    }

    /**
     * Rename commercial plan
     */
    public function actionRename() {
        $model = $this->loadModel(Yii::app()->request->getPost('id'));
        if ($model->name != \CommercialPlan::PLAN_B2C) {
            $model->name = Yii::app()->request->getPost('value');
            $model->update(['name']);
        }
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new CommercialPlan('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['CommercialPlan'])) {
            $model->attributes = $_GET['CommercialPlan'];
        }

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return CommercialPlan the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = CommercialPlan::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    function actionAddRule($id) {
        $model = $this->loadModel($id);
        $rule = new \CommercialRule;
        $rule->air_source_id = Yii::app()->request->getPost('air_source_id');
        $rule->air_source_id = is_numeric($rule->air_source_id) ? $rule->air_source_id : null;
        $rule->service_type_id = Yii::app()->request->getPost('service_type_id');
        $rule->service_type_id = is_numeric($rule->service_type_id) ? $rule->service_type_id : null;
        $rule->client_source_id = Yii::app()->request->getPost('client_source_id');
        $rule->client_source_id = is_numeric($rule->client_source_id) ? $rule->client_source_id : null;
        $rule->carrier_id = Yii::app()->request->getPost('carrier_id');
        $rule->carrier_id = is_numeric($rule->carrier_id) ? $rule->carrier_id : null;
        if (Yii::app()->request->getPost('ruleFilter')) {   // It is a filter request do not create new rule
            Yii::app()->session->add('rule_filter_air_source_id', $rule->air_source_id);
            Yii::app()->session->add('rule_filter_service_type_id', $rule->service_type_id);
            Yii::app()->session->add('rule_filter_client_source_id', $rule->client_source_id);
            Yii::app()->session->add('rule_filter_carrier_id', $rule->carrier_id);
            Yii::app()->session->remove('ruleId');
        } else {    // Create new rule
            $filter = new \CommercialFilter;
            $rule->filter = $filter->getAsString();
            $rule->insert();
            // Connect the new rule to the commercial plan
            Yii::app()->db->createCommand("INSERT INTO commercial_x_rule (plan_id, rule_id) VALUES($model->id, $rule->id)")
                    ->execute();
            Yii::app()->session->add('ruleId', $rule->id);
        }
        $this->redirect('/commercial/update/' . $model->id);
    }

    function actionMassAssign() {
        \UserInfo::model()->updateAll([
            'commercial_plan_id' => Yii::app()->request->getPost('planId')
                ], 'commercial_plan_id IS NULL AND user_type_id=:userTypeId', [
            ':userTypeId' => Yii::app()->request->getPost('userTypeId'),
                ]
        );

//        echo json_encode($_POST);
    }

    function actionDisable($id) {
        \UserInfo::model()->updateAll(['commercial_plan_id' => null], 'commercial_plan_id=:plan', [':plan' => $id]);
    }

    function actionDeleteRule() {
        $ruleId = Yii::app()->request->getPost('ruleId');
        \PaymentConvenienceFee::model()->deleteAll('commercial_rule_id='.$ruleId);
        \CommercialRule::model()->deleteByPk($ruleId);
        Yii::app()->session->remove('ruleId');
    }
    /**
     * Added by Satender
     * Purpose : To update the convenience fee for the rule
     * @param type $old_rule
     * @param type $new_rule
     * @return type
     */
    private function _updatePaymentConvFee($old_rule,$new_rule){
        if($old_rule === null) 
            return;
        $payment_conf_fee = new \PaymentConvenienceFee;
        if($old_rule->client_source_id !== $new_rule->client_source_id) {
            $payment_conf_fee->updateAll(['client_source_id' => $new_rule->client_source_id], 'commercial_rule_id='.$new_rule->id);
        }
        if($old_rule->service_type_id !== $new_rule->service_type_id) {
            $payment_conf_fee->updateAll(['journey_type' => $new_rule->service_type_id], 'commercial_rule_id='.$new_rule->id);
        }
    }
    
    function actionSaveRule($id) {
        $model = $this->loadModel($id);
        $rule = new \CommercialRule;
        if (isset($_POST['CommercialRule']) && isset($_POST['CommercialFilter'])) {
            $rule->attributes = $_POST['CommercialRule'];
            $rule->isNewRecord = false;
            $filter = new \CommercialFilter;
            $filter->setAttributes($_POST['CommercialFilter']);
            $rule->filter = $filter->getAsString();
            if ($rule->validate()) {
                if(!empty($rule->id)) {
                    $old_rule = \CommercialRule::model()->findByPk($rule->id);
                }
                $rule->save();
                $this->_updatePaymentConvFee($old_rule, $rule);
                if (Yii::app()->request->getPost('copyRule')) {
                    $rule->id = null;
                    $rule->isNewRecord = true;
                    $rule->order_++;
                    $rule->insert();
                    Yii::app()->db->createCommand()->insert('commercial_x_rule', [
                        'plan_id' => $id,
                        'rule_id' => $rule->id
                    ]);
                    Yii::app()->session->add('ruleError', [['New rule is created. Please check and confirm the rule priority!']]);
                } else {
                    Yii::app()->session->remove('ruleError');
                    // Go to test the rule
                    if (Yii::app()->request->getPost('testRule')) {
                        Yii::app()->session->add('ruleId', $rule->id);
                        // Remove old filters
//                        Yii::app()->session->remove('RouteCacheFilter');
                        // Redirect with preset filters
                        $this->redirect("/routesCache/admin?" . http_build_query([
                                    'RoutesCache[carrier_id]' => $rule->carrier_id ? $rule->carrier->code : null,
                                    'RoutesCache[air_source_id]' => $rule->air_source_id ? : null
                        ]));
                    }
                }
            } else {
                Yii::app()->session->add('ruleError', $rule->getErrors());
            }
        }

        Yii::app()->session->add('ruleId', $rule->id);
        $this->redirect('/commercial/update/' . $model->id);
    }

}
