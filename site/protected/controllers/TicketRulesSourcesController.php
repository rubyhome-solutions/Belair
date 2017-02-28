<?php

class TicketRulesSourcesController extends Controller
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
		$model=new TicketRulesSources;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['TicketRulesSources']))
		{
			$model->attributes=$_POST['TicketRulesSources'];
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

		if(isset($_POST['TicketRulesSources']))
		{
			$model->attributes=$_POST['TicketRulesSources'];
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
		$dataProvider=new CActiveDataProvider('TicketRulesSources');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new TicketRulesSources('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['TicketRulesSources']))
			$model->attributes=$_GET['TicketRulesSources'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return TicketRulesSources the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=TicketRulesSources::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param TicketRulesSources $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='ticket-rules-sources-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
        
        public function actionExportRules(){
         
        $ticketsources=  \TicketRulesSources::model()->findAll();
        $out = '<table class="table table-condensed table-bordered table-hover" style="width: initial;">';
        $out.='<tr><th>Id</th>'
                . '<th>agent_name</th>'
                . '<th>amadeus_pcc</th>'
                . '<th>gal_pcc</th>'
                . '<th>contact</th>'
                . '<th>email</th>'
                . '<th>office</th>'
                . '<th>night_ctc</th>'
                . '<th>mobile_no</th></tr>';
       
        foreach ($ticketsources as $value) {
           $out=$out.'<tr><th>'.$value->id.'</th>'
                    . '<th>'.$value->agent_name.'</th>'
                    . '<th>'.utf8_encode($value->amadeus_pcc).'</th>'
                    . '<th>'.utf8_encode($value->gal_pcc).'</th>'
                    . '<th>'.utf8_encode($value->contact).'</th>'
                    . '<th>'.utf8_encode($value->email).'</th>'
                    . '<th>'.utf8_encode($value->office).'</th>'
                    . '<th>'.utf8_encode($value->night_ctc).'</th>'
                    . '<th>'.utf8_encode($value->mobile_no).'</th>'; 
            $out=$out. '</tr>';
        }
        $out .= '</table>';
        \Utils::html2xls($out, 'Source Ticket Rules' . '_' . date('Ymd_Hi') . '.xls');
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
                    \TicketRulesSources::model()->deleteAll();
                    //\Utils::dbgYiiLog(['cnt'=>count($data)]);
                   
                    foreach ($data as $row) {
                        $id = $row[0];
                        if (!empty($id)  && is_numeric($id)) {
                         $model=new TicketRulesSources;
                         $model->id=(int)$id;
                         $model->agent_name=$row[1];
                         $model->amadeus_pcc=utf8_decode($row[2]);
                         $model->gal_pcc=utf8_decode($row[3]);
                         $model->contact=utf8_decode($row[4]);
                         $model->email=utf8_decode($row[5]);
                         $model->office=utf8_decode($row[6]);
                         $model->night_ctc=utf8_decode($row[7]);
                         $model->mobile_no=utf8_decode($row[8]);
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
