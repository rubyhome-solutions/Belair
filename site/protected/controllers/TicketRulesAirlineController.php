<?php

class TicketRulesAirlineController extends Controller {

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
                'actions' => array('index', 'view', 'create', 'update', 'admin', 'delete', 'searchNotes', 'exportRules', 'importRule', 'allrules'),
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
        $notesString = null;
        $str = '';
        $model = $this->loadModel($id);
        if (!empty($model->notes_a)) {
            $arr = explode(',', $model->notes_a);
            foreach ($arr as $value) {
                $notesmodel = \TicketRulesNotes::model()->findByPk((int) $value);
                //$str.=" Note ".$value;
                if ($notesmodel != null)
                    $str .= " " . $notesmodel->note_id;
            }
            $notesString['notes_a'] = $str;
        }
        $str = '';
        if (!empty($model->notes_b)) {
            $arr = explode(',', $model->notes_b);
            foreach ($arr as $value) {
                $notesmodel = \TicketRulesNotes::model()->findByPk((int) $value);
                //$str.=" Note ".$value;
                if ($notesmodel != null)
                    $str .= " " . $notesmodel->note_id;
            }
            $notesString['notes_b'] = $str;
        }
        $str = '';
        if (!empty($model->notes_c)) {
            $arr = explode(',', $model->notes_c);
            foreach ($arr as $value) {
                $notesmodel = \TicketRulesNotes::model()->findByPk((int) $value);
                //$str.=" Note ".$value;
                if ($notesmodel != null)
                    $str .= " " . $notesmodel->note_id;
            }
            $notesString['notes_c'] = $str;
        }

        $model->notesString = $str;
        $this->render('view', array(
            'model' => $model,
            'notesString' => $notesString
        ));
    }

    /**
     * Creates a new model.
     * If creation is successful, the browser will be redirected to the 'view' page.
     */
    public function actionCreate() {
        $model = new TicketRulesAirline;

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['TicketRulesAirline'])) {

            $model->attributes = $_POST['TicketRulesAirline'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->id));
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
        $model = $this->loadModel($id);

        // Uncomment the following line if AJAX validation is needed
        // $this->performAjaxValidation($model);

        if (isset($_POST['TicketRulesAirline'])) {
            $model->attributes = $_POST['TicketRulesAirline'];
            if ($model->save())
                $this->redirect(array('view', 'id' => $model->id));
        }

        $notesString = null;
        $str = '';
        if (!empty($model->notes_a)) {
            $str = '[';
            $arr = explode(',', $model->notes_a);
            foreach ($arr as $value) {
                $notesmodel = \TicketRulesNotes::model()->findByPk((int) $value);
                if ($notesmodel != null)
                    $str .= "{'id':'$value','name': '$notesmodel->note_id'},";
            }
            $str .= ']';
            $notesString['notes_a'] = $str;
        }
        $str = '';
        if (!empty($model->notes_b)) {
            $str = '[';
            $arr = explode(',', $model->notes_b);
            foreach ($arr as $value) {
                $notesmodel = \TicketRulesNotes::model()->findByPk((int) $value);
                if ($notesmodel != null)
                    $str .= "{'id':'$value','name': '$notesmodel->note_id'},";
                //$str.="{'id':'$value','name': 'Note $value'},";
            }
            $str .= ']';
            $notesString['notes_b'] = $str;
        }
        $str = '';
        if (!empty($model->notes_c)) {
            $str = '[';
            $arr = explode(',', $model->notes_c);
            foreach ($arr as $value) {
                $notesmodel = \TicketRulesNotes::model()->findByPk((int) $value);
                if ($notesmodel != null)
                    $str .= "{'id':'$value','name': '$notesmodel->note_id'},";
                //$str.="{'id':'$value','name': 'Note $value'},";
            }
            $str .= ']';
            $notesString['notes_c'] = $str;
        }

        $this->render('update', array(
            'model' => $model,
            'notesString' => $notesString
        ));
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        $this->loadModel($id)->delete();

        // if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
        if (!isset($_GET['ajax']))
            $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $dataProvider = new CActiveDataProvider('TicketRulesAirline');
        $this->render('index', array(
            'dataProvider' => $dataProvider,
        ));
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new TicketRulesAirline('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['TicketRulesAirline']))
            $model->attributes = $_GET['TicketRulesAirline'];

        $this->render('admin', array(
            'model' => $model,
        ));
    }

    public function actionAllrules() {
        $this->render('allrules');
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return TicketRulesAirline the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = TicketRulesAirline::model()->findByPk($id);
        if ($model === null)
            throw new CHttpException(404, 'The requested page does not exist.');
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param TicketRulesAirline $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'ticket-rules-airline-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    public function actionSearchNotes() { //completion variants
        $result = [];
        $term = strtolower($_GET['q']);
        //\Utils::dbgYiiLog($term);
        $users = \TicketRulesNotes::model()->findAll(array(
            // 'select' => 'id, note_id as name', //'select' => 'id, \'Note \' || id as name',
            // 'condition' => 'note_id = :term',
            // 'params' => array('term' => (int)$term)
            'select' => 'id, note_id ',
            'condition' => 'lower(note_id) like :name',
            'order' => 'note_id ASC',
            'params' => array('name' => "%$term%")
        ));
        //\Utils::dbgYiiLog($users);
        foreach ($users as $as) {
            $ar = array('id' => $as->id, 'name' => $as->note_id);
            $result[] = $ar;
        }

        echo json_encode($result);
    }

    public function actionExportRules() {

        $ticketAirlines = \TicketRulesAirline::model()->findAll();
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out .= '<tr><th>Id</th>'
                . '<th>Airline Code</th>'
                . '<th>Iata on basic</th>'
                . '<th>Airline Name</th>'
                . '<th>source_a_agent_id</th>'
                . '<th>source_a_rbd</th>'
                . '<th>source_a_remark</th>'
                . '<th>source_b_agent_id</th>'
                . '<th>source_b_rbd</th>'
                . '<th>source_b_remark</th>'
                . '<th>source_c_agent_id</th>'
                . '<th>source_c_rbd</th>'
                . '<th>source_c_remark</th>'
                . '<th>notes_a</th>'
                . '<th>notes_b</th>'
                . '<th>notes_c</th></tr>';

        foreach ($ticketAirlines as $value) {
            $out = $out . '<tr><th>' . $value->id . '</th>'
                    . '<th>' . $value->airline_code . '</th>'
                    . '<th>' . $value->iata_on_basic . '</th>'
                    . '<th>' . utf8_encode($value->airline_name) . '</th>'
                    . '<th>' . $value->source_a_agent_id . '</th>'
                    . '<th>' . utf8_encode($value->source_a_rbd) . '</th>'
                    . '<th>' . utf8_encode($value->source_a_remark) . '</th>'
                    . '<th>' . $value->source_b_agent_id . '</th>'
                    . '<th>' . utf8_encode($value->source_b_rbd) . '</th>'
                    . '<th>' . utf8_encode($value->source_b_remark) . '</th>'
                    . '<th>' . $value->source_c_agent_id . '</th>'
                    . '<th>' . utf8_encode($value->source_c_rbd) . '</th>'
                    . '<th>' . utf8_encode($value->source_c_remark) . '</th>'
                    . '<th>' . $value->notes_a . '</th>'
                    . '<th>' . $value->notes_b . '</th>'
                    . '<th>' . $value->notes_c . '</th>';
            $out = $out . '</tr>';
        }
        $out .= '</table>';
        \Utils::html2xls($out, 'Airline Ticket Rules' . '_' . date('Ymd_Hi') . '.xls');
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
                    \TicketRulesAirline::model()->deleteAll();
                    //\Utils::dbgYiiLog(['cnt'=>count($data)]);
                    foreach ($data as $row) {
                        $id = $row[0];
                        if (!empty($id) && is_numeric($id)) {
                            $model = new TicketRulesAirline;
                            $model->id = (int) $id;
                            $model->airline_code = $row[1];
                            $model->iata_on_basic = $row[2];
                            $model->airline_name = utf8_decode($row[3]);
                            $model->source_a_agent_id = $row[4];
                            $model->source_a_rbd = utf8_decode($row[5]);
                            $model->source_a_remark = utf8_decode($row[6]);
                            $model->source_b_agent_id = $row[7];
                            $model->source_b_rbd = utf8_decode($row[8]);
                            $model->source_b_remark = utf8_decode($row[9]);
                            $model->source_c_agent_id = $row[10];
                            $model->source_c_rbd = utf8_decode($row[11]);
                            $model->source_c_remark = utf8_decode($row[12]);
                            $model->notes_a = $row[13];
                            $model->notes_b = $row[14];
                            $model->notes_c = $row[15];
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

}
