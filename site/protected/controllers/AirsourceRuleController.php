<?php

class AirsourceRuleController extends Controller {

    const AIR_SOURCE_RULE_ID = 'airSourceRuleId';
    const AIR_SOURCE_RULE_AS_ID = 'airSourceRule_filter_air_source_id';
    const AIR_SOURCE_RULE_FILTER_CONTENT = 'airSourceRule_filter_content';
    const AIR_SOURCE_RULE_ERROR = 'airsourceRuleError';

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
            ['allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => ['update', 'index', 'addRule', 'saveRule', 'delete'],
                'expression' => '\Authorization::getIsTopStaffLogged()'
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
        $criteria = new \CDbCriteria;
        $criteria->addSearchCondition('air_source_ids', Yii::app()->session->get(self::AIR_SOURCE_RULE_AS_ID));
        $criteria->addSearchCondition('filter', Yii::app()->session->get(self::AIR_SOURCE_RULE_FILTER_CONTENT));
        $rulesCount = \AirsourceRule::model()->count($criteria);
        
        $ruleId = \Yii::app()->session->get(self::AIR_SOURCE_RULE_ID);
        if ($ruleId) {
            $criteria->compare('id', $ruleId);
        } else {
            $criteria->order = 't.id DESC';
            $criteria->limit = \AirsourceRule::MAX_ELEMENTS_ON_PAGE;
        }

        $rules = \AirsourceRule::model()->findAll($criteria);

        $this->render('update', [
            'ruleId' => $ruleId,
            'rules' => $rules,
            'rulesCount' => $rulesCount,
            'airSourceList' => CHtml::listData(\AirSource::model()
                            ->findAllBySql("select id, name || case when is_active=0 then ' <b>(disabled)</b>' else '' end as name from air_source order by name"), 'id', 'name'),
            'airSourceListNormal' => CHtml::listData(\AirSource::model()->findAll(['order' => 'name']), 'id', 'name'),
        ]);
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $this->redirect('/airsourceRule/update');
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return AirsourceRule the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = AirsourceRule::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    function actionAddRule() {
        $rule = new \AirsourceRule;
        if (Yii::app()->request->getPost('ruleFilter')) {   // It is a filter request do not create new rule
            Yii::app()->session->add(self::AIR_SOURCE_RULE_AS_ID, \Yii::app()->request->getPost('air_source_id'));
            Yii::app()->session->add(self::AIR_SOURCE_RULE_FILTER_CONTENT, \Yii::app()->request->getPost('filterSearch'));
            Yii::app()->session->remove(self::AIR_SOURCE_RULE_ID);
        } else {    // Create new rule
            if (\Yii::app()->request->getPost('air_source_id')) {
                $filter = new \AirSourceFilter;
                $rule->filter = $filter->getAsString();
                $rule->air_source_ids = \AirsourceRule::AS_IDS_SEPARATOR . (int) \Yii::app()->request->getPost('air_source_id') . \AirsourceRule::AS_IDS_SEPARATOR;
                $rule->insert();
                Yii::app()->session->add(self::AIR_SOURCE_RULE_ID, $rule->id);
            } else {
                Yii::app()->user->setFlash(\AirsourceRuleController::AIR_SOURCE_RULE_AS_ID, 'Select the Air Source for the new rule');
            }
        }
        $this->redirect('/airsourceRule/update');
    }

    function actionSaveRule() {
        $rule = new \AirsourceRule;
        if (isset($_POST['AirsourceRule']) && isset($_POST['AirSourceFilter'])) {
            $rule->attributes = $_POST['AirsourceRule'];
            $rule->isNewRecord = false;
            $filter = new \AirSourceFilter;
            $filter->setAttributes($_POST['AirSourceFilter']);
            $rule->filter = $filter->getAsString();
            if ($rule->validate()) {
                $rule->air_source_ids = \AirsourceRule::groupIds($rule->air_source_ids);
                $rule->save(false);
                if (Yii::app()->request->getPost('copyRule')) {
                    $rule->id = null;
                    $rule->isNewRecord = true;
                    $rule->order_++;
                    $rule->insert();
                    Yii::app()->session->add(self::AIR_SOURCE_RULE_ERROR, [['New rule is created. Please check and confirm the rule priority!']]);
                } else {
                    Yii::app()->session->remove(self::AIR_SOURCE_RULE_ERROR);
                    // Go to test the rule
                    if (Yii::app()->request->getPost('testRule')) {
                        Yii::app()->session->add(self::AIR_SOURCE_RULE_ID, $rule->id);
                        
                        // Prepare the airports and the countries
                        $ports = [];
                        $countries = [];
                        foreach (explode(',', strtoupper($filter->include->origin_airport)) as $textFilterElement) {
                            if (strlen($textFilterElement) === 2) {
                                $countries[] = $textFilterElement;
                            } else {
                                $ports[] = $textFilterElement;                                
                            }
                        }
                        
                        // Redirect with preset filters
                        $this->redirect("/searches/admin?" . http_build_query([
                                    'Searches[origin]' => empty($ports) ? null : implode(',', $ports),
                                    'Searches[originCountryCode]' => empty($countries) ? null : implode(',', $countries),
                                    'Searches[date_depart]' => $filter->include->onward_date ? : null,
                                    'Searches[category]' => $filter->include->cabin_class ? : null,
                                    'Searches[date_return]' => $filter->include->return_dept_date ? : null,
                        ]));
                    }
                }
            } else {
                Yii::app()->session->add(self::AIR_SOURCE_RULE_ERROR, $rule->getErrors());
            }
        }

        Yii::app()->session->add(self::AIR_SOURCE_RULE_ID, $rule->id);
        $this->redirect('/airsourceRule/update');
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        $this->loadModel($id)->delete();
    }

}
