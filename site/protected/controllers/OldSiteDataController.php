<?php

class OldSiteDataController extends Controller
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
	public function accessRules() {
        return array(
            array('allow',
                'actions' => array('index', 'view', 'create', 'update', 'admin', 'delete','uploadOldDataFile'),
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
		$model=new OldSiteData;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['OldSiteData']))
		{
			$model->attributes=$_POST['OldSiteData'];
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

		if(isset($_POST['OldSiteData']))
		{
			$model->attributes=$_POST['OldSiteData'];
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
		$dataProvider=new CActiveDataProvider('OldSiteData');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new OldSiteData('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['OldSiteData']))
			$model->attributes=$_GET['OldSiteData'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return OldSiteData the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=OldSiteData::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param OldSiteData $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='old-site-data-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
        
        /*
     * Update Aold cart data using Excel File
     */

    public function actionUploadOldDataFile() {
        include(Yii::getPathOfAlias("application.vendor.PHPexcel.Classes") . '/PHPExcel.php');
        // Add File
        if (isset($_FILES['filename'])) {
            if ($_FILES['filename']['error'] != 0) {
                Yii::app()->user->setFlash('files_msg', "<b>Error: </b>No file is selected");
            } else {
                $path = AircartFile::storageDirectory() . md5(microtime(true));
                // move the new file
                if (move_uploaded_file($_FILES['filename']['tmp_name'], $path)) {
                    $objPHPExcel = PHPExcel_IOFactory::load($path);
                    $sheet = $objPHPExcel->getActiveSheet();
                    $data = $sheet->rangeToArray($sheet->calculateWorksheetDimension());
                  //  \Utils::dbgYiiLog(['cnt'=>count($data)]);
                    foreach ($data as $row) {
                        $txid = $row[2];
                        if($txid=="Txid"){
                            continue;
                        }
                         $oldsitedata=null;
                        if(empty($txid)){
                            $oldsitedata=null;
                        }else{
                            $oldsitedata=\OldSiteData::model()->findByAttributes(array('txid' => $txid));
                        }
                        
                        if ($oldsitedata!=null) {
                         //\Utils::dbgYiiLog(['cart' => $air_cart_id, 'invoice' => $invoiceno]);
                            $oldsitedata->txdate=$row[1];
                            $oldsitedata->txid=$row[2];
                            $oldsitedata->booking_status=$row[3];
                            $oldsitedata->payment_status=$row[4];
                            $oldsitedata->sector=$row[5];
                            $oldsitedata->dom_int=$row[6];
                            $oldsitedata->pax_name=$row[7];
                            $oldsitedata->amount=$row[8];
                            $oldsitedata->pax_details=$row[9];
                            $oldsitedata->apnr=$row[10];
                            $oldsitedata->carrier=$row[11];
                            $oldsitedata->travel_date=$row[12];
                            $oldsitedata->booking_type=$row[13];
                            $oldsitedata->supplier=$row[14];
                            $oldsitedata->channel=$row[15];
                            $oldsitedata->save(false);
                           
                        }else if(!empty($txid)){
                            $oldsitedata=new \OldSiteData();
                            $oldsitedata->txdate=$row[1];
                            $oldsitedata->txid=$row[2];
                            $oldsitedata->booking_status=$row[3];
                            $oldsitedata->payment_status=$row[4];
                            $oldsitedata->sector=$row[5];
                            $oldsitedata->dom_int=$row[6];
                            $oldsitedata->pax_name=$row[7];
                            $oldsitedata->amount=$row[8];
                            $oldsitedata->pax_details=$row[9];
                            $oldsitedata->apnr=$row[10];
                            $oldsitedata->carrier=$row[11];
                            $oldsitedata->travel_date=$row[12];
                            $oldsitedata->booking_type=$row[13];
                            $oldsitedata->supplier=$row[14];
                            $oldsitedata->channel=$row[15];
                            $oldsitedata->insert();
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
