<?php

class TicketRulesNotesController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/column2';

	/**
	 * @return array action filters
	 */
	public function filters()
	{
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
	public function accessRules()
	{
		return array(
			array('allow',  // allow all users to perform 'index' and 'view' actions
                                'actions'=>array('index','view','create','update','admin','delete','exportRules','importRule'),
				'expression' => 'Authorization::getIsSuperAdminorTicketRuleLogged()'
			),
			
			array('deny',  // deny all users
				'users'=>array('*'),
			),
		);
	}

	/**
	 * Displays a particular model.
	 * @param integer $id the ID of the model to be displayed
	 */
	public function actionView($id)
	{
		$this->render('view',array(
			'model'=>$this->loadModel($id),
		));
	}

	/**
	 * Creates a new model.
	 * If creation is successful, the browser will be redirected to the 'view' page.
	 */
	public function actionCreate()
	{
		$model=new TicketRulesNotes;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['TicketRulesNotes']))
		{
			$model->attributes=$_POST['TicketRulesNotes'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('create',array(
			'model'=>$model,
		));
	}

	/**
	 * Updates a particular model.
	 * If update is successful, the browser will be redirected to the 'view' page.
	 * @param integer $id the ID of the model to be updated
	 */
	public function actionUpdate($id)
	{
		$model=$this->loadModel($id);
               // Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['TicketRulesNotes']))
		{
			$model->attributes=$_POST['TicketRulesNotes'];
			if($model->save())
				$this->redirect(array('view','id'=>$model->id));
		}

		$this->render('update',array(
			'model'=>$model,
		));
	}

	/**
	 * Deletes a particular model.
	 * If deletion is successful, the browser will be redirected to the 'admin' page.
	 * @param integer $id the ID of the model to be deleted
	 */
	public function actionDelete($id)
	{
		$this->loadModel($id)->delete();

		// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
		if(!isset($_GET['ajax']))
			$this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
	}

	/**
	 * Lists all models.
	 */
	public function actionIndex()
	{
		$dataProvider=new CActiveDataProvider('TicketRulesNotes');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new TicketRulesNotes('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['TicketRulesNotes']))
			$model->attributes=$_GET['TicketRulesNotes'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return TicketRulesNotes the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=TicketRulesNotes::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param TicketRulesNotes $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='ticket-rules-notes-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
        
        public function actionExportRules(){
         
        $ticketsources=  \TicketRulesNotes::model()->findAll();
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out.='<tr><th>Id</th>'
                . '<th>airline_code</th>'
                . '<th>iata_on_basic</th>'
                . '<th>instructions</th>'
                . '<th>airline_with_remarks</th>'
                . '<th>note_id</th></tr>';
       
        foreach ($ticketsources as $value) {
           $out=$out.'<tr><th>'.$value->id.'</th>'
                    . '<th>'.$value->airline_code.'</th>'
                    . '<th>'.$value->iata_on_basic.'</th>'
                    . '<th>'.utf8_encode($value->instructions).'</th>'
                    . '<th>'.utf8_encode($value->airline_with_remarks).'</th>'
                    . '<th>'.$value->note_id.'</th>'; 
            $out=$out. '</tr>';
        }
        $out .= '</table>';
        \Utils::html2xls($out, 'Notes Ticket Rules' . '_' . date('Ymd_Hi') . '.xls');
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
                    \TicketRulesNotes::model()->deleteAll();
                    //\Utils::dbgYiiLog(['cnt'=>count($data)]);
                   
                    foreach ($data as $row) {
                        $id = $row[0];
                        if (!empty($id)  && is_numeric($id)) {
                         $model=new TicketRulesNotes;
                         $model->id=(int)$id;
                         $model->airline_code=$row[1];
                         $model->iata_on_basic=$row[2];
                         $model->instructions=utf8_decode($row[3]);
                         $model->airline_with_remarks=utf8_decode($row[4]);
                         $model->note_id=$row[5];
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
