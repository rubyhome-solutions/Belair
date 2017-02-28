<?php

class TicketRulesCardsController extends Controller {

    /**
     * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
     * using two-column layout. See 'protected/views/layouts/column2.php'.
     */
    public $layout = '//layouts/column2';

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
            array('allow', // allow all users to perform 'index' and 'view' actions
                'actions' => array('index', 'view', 'create', 'update', 'admin', 'delete', 'exportRules', 'importRule', 'RuleCreate', 'RenameCSType', 'RuleDelete'),
                'expression' => 'Authorization::getIsSuperAdminorTicketRuleLogged()'
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
        $model = new TicketRulesCards;

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['TicketRulesCards'])) {

            $model->attributes = $_POST['TicketRulesCards'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->id));
        }

        $this->render('create', array(
            'model' => $model,
        ));
    }

    /**
     * Rename airline
     */
    public function actionRenameCSType() {
        $id = Yii::app()->request->getPost('id');
        if ($id) {
            $model = \TicketCardsRulesInfo::model()->findByPk($id);
            if ($model !== null) {
                $field = Yii::app()->request->getPost('name');
                if ($field == 'rule_days') {
                    $dataArr['rule_days'] = Yii::app()->request->getPost('value');
                    $uniformData = $this->actionGetFormattedData($dataArr);
                    $model->$field = $uniformData['rule_days'];
                } else {
                    $model->$field = Yii::app()->request->getPost('value');
                }

                if ($model->validate()) {
                    $model->update([$field]);
                }
            }
        }
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionRuleCreate() {
        $model = new TicketCardsRulesInfo;
        $response = '';
        if (isset($_POST['PF'])) {
            $model->attributes = $this->actionGetFormattedData($_POST['PF']);
            if ($model->validate()) {
                $model->save();
            } else {
                foreach ($model->errors as $error) {
                    foreach ($error as $msg) {
                        $response .= $msg . "\n";
                    }
                }
            }
        }
        \Utils::jsonResponse($response);
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionRuleDelete($id) {
        $model = TicketCardsRulesInfo::model()->findByPk($id);
        if ($model) {
            $model->delete();
        }
        //if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax']))
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $model = $this->loadModel($id);

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['TicketRulesCards'])) {
            $model->attributes = $_POST['TicketRulesCards'];

            if ($model->save())
                $this->redirect(array('view', 'id' => $model->id));
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
        \TicketCardsRulesInfo::model()->deleteAll('ticket_rules_cards_id=:ticketId', [
            ':ticketId' => $id,
        ]);
        $this->loadModel($id)->delete();

        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax']))
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $this->redirect('/ticketRulesCards/admin');
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new \TicketRulesCards('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['TicketRulesCards']))
            $model->attributes = $_GET['TicketRulesCards'];

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return TicketRulesCards the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = TicketRulesCards::model()->findByPk($id);
        if ($model === null)
            throw new CHttpException(404, 'The requested page does not exist.');
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param TicketRulesCards $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'ticket-rules-cards-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    public function actionExportRules() {

        $ticketsources = \TicketRulesCards::model()->findAll();
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out .= '<tr><th>Id</th>'
            . '<th>airline_id</th>'
            . '<th>amex_pax_card</th>'
            . '<th>amex_belair_card</th>'
            . '<th>amex_slip</th>'
            . '<th>master_pax_card</th>'
            . '<th>master_belair_card</th>'
            . '<th>master_slip</th>'
            . '<th>remarks</th></tr>';

        foreach ($ticketsources as $value) {
            $out = $out . '<tr><th>' . $value->id . '</th>'
                . '<th>' . $value->airline_id . '</th>'
                . '<th>' . $value->amex_pax_card . '</th>'
                . '<th>' . $value->amex_belair_card . '</th>'
                . '<th>' . $value->amex_slip . '</th>'
                . '<th>' . $value->master_pax_card . '</th>'
                . '<th>' . $value->master_belair_card . '</th>'
                . '<th>' . $value->master_slip . '</th>'
                . '<th>' . utf8_encode($value->remarks) . '</th>';
            $out = $out . '</tr>';
        }
        $out .= '</table>';
        \Utils::html2xls($out, 'Cards Ticket Rules' . '_' . date('Ymd_Hi') . '.xls');
    }

    /*
     * Delete previouse airline rules and Import new rules using Excel File
     */

    public function actionImportRule() {
        include(Yii::getPathOfAlias("application.vendor.PHPexcel.Classes") . '/PHPExcel.php');
        // Add File
        if (isset($_FILES['filename'])) {
            if ($_FILES['filename']['error'] != 0) {
                Yii::app()->user->setFlash('files_msg', "<b>Error: </b>No file is selected");
            } else {
                $path = AircartFile::storageDirectory() . md5(microtime(true));
                // move the new file
                if (move_uploaded_file($_FILES['filename']['tmp_name'], $path)) {
                    libxml_use_internal_errors(true);
                    $objPHPExcel = \PHPExcel_IOFactory::load($path);
                    $sheet = $objPHPExcel->getActiveSheet();
                    $data = $sheet->rangeToArray($sheet->calculateWorksheetDimension());
                    \TicketRulesCards::model()->deleteAll();
                    //\Utils::dbgYiiLog(['cnt'=>count($data)]);

                    foreach ($data as $row) {
                        $id = $row[0];
                        if (!empty($id) && is_numeric($id)) {
                            $model = new TicketRulesCards;
                            $model->id = (int) $id;
                            $model->airline_id = $row[1];
                            $model->amex_pax_card = $row[2];
                            $model->amex_belair_card = $row[3];
                            $model->amex_slip = $row[4];
                            $model->master_pax_card = $row[5];
                            $model->master_belair_card = $row[6];
                            $model->master_slip = $row[7];
                            $model->save();
                        }
                    }
                    unlink($path);
                    $this->render('files', ['msg' => 'success']);
                    \Yii::app()->end();
                } else {
                    Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Can't store the file. Internal error");
                }
            }
        }
        $this->render('files');
    }

    /*
     * apply OR operation on the selected days
     */

    public function actionGetFormattedData($dataArr) {
        $initVal = 0;
        // $ruleArr = $dataArr['rule_days'];
        if (!empty($dataArr['rule_days'])) {
            foreach ($dataArr['rule_days'] as $key => $value) {
                $initVal = $initVal | $value;
            }
        }

        $dataArr['rule_days'] = $initVal;

        return $dataArr;
    }

}
