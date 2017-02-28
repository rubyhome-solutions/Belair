<?php

class BookingLogController extends Controller
{
	/**
	 * @var string the default layout for the views. Defaults to '//layouts/column2', meaning
	 * using two-column layout. See 'protected/views/layouts/column2.php'.
	 */
	public $layout='//layouts/column1';

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
			
			 array(
                                'allow', // allow staff to perform
                                'actions' => ['admin', 'view','report','clientReport','deviceReport'],
                                'expression' => 'Authorization::getIsTopStaffLogged()'
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
		$model=new BookingLog;

		// Uncomment the following line if AJAX validation is needed
		// $this->performAjaxValidation($model);

		if(isset($_POST['BookingLog']))
		{
			$model->attributes=$_POST['BookingLog'];
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

		if(isset($_POST['BookingLog']))
		{
			$model->attributes=$_POST['BookingLog'];
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
		$dataProvider=new CActiveDataProvider('BookingLog');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new BookingLog('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['BookingLog']))
			$model->attributes=$_GET['BookingLog'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}
        
        /**
	 * Manages all models.
	 */
	public function actionReport()
	{
		$model=new BookingLog();
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['BookingLog']))
			$model->attributes=$_GET['BookingLog'];
                
                $data=$model->searchForReport();
                
		$this->render('report',array(
			'model'=>$model,'data'=>$data
		));
	}
        
        /**
	 * Client Source based S/R/B report.
	 */
	public function actionClientReport()
	{
            
             
            if(isset($_POST['dateFrom'])&&isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])){
                $fromdate=date('Y-m-d', strtotime($_POST['dateFrom'])); 
                $todate=date('Y-m-d', strtotime($_POST['dateTo']));
            }else{
                $fromdate=date('Y-m-d', strtotime('-1 days')); 
                $todate=date('Y-m-d', strtotime('-1 days'));
            }
             
            $data=BookingLog::reportClientSource($fromdate,$todate);
            $this->render('clientreport',array(
			'data'=>$data, 'datefrom'=>$fromdate,'dateto'=>$todate
            ));
		
         
	}
        
        /**
	 * Sales Report 
	 */
	public function actionYatraSalesReport()
	{
            
            if(isset($_POST['dateFrom'])&&isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])){
                $fromdate=date('Y-m-d', strtotime($_POST['dateFrom'])); 
                $todate=date('Y-m-d', strtotime($_POST['dateTo']));
            }else{
                $fromdate=date('Y-m-d', strtotime('-1 days')); 
                $todate=date('Y-m-d', strtotime('-1 days'));
            }
             
            $data=BookingLog::reportClientSource($fromdate,$todate);
            $this->render('clientreport',array(
			'data'=>$data, 'datefrom'=>$fromdate,'dateto'=>$todate
            ));
		
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return BookingLog the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=BookingLog::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param BookingLog $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='booking-log-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
        
        public function actionDeviceReport() {
             if(isset($_POST['dateFrom'])&&isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])){
                $fromdate=date('Y-m-d', strtotime($_POST['dateFrom'])); 
                $todate=date('Y-m-d', strtotime($_POST['dateTo']));
            }else{
                $fromdate=date('Y-m-d', strtotime('-2 days')); 
                $todate=date('Y-m-d', strtotime('-1 days'));
            }
            $device=null;$cls=null;$br=null;$mobile=null;$wt=null;
            if(!empty($_POST['deviceType'])){
                $device=$_POST['deviceType'];
            }
            if(!empty($_POST['clientSource'])){
                $cls=$_POST['clientSource'];
            }
            if(!empty($_POST['browser'])){
                $br=$_POST['browser'];
            }
            if(!empty($_POST['isMobile'])){
                $mobile=$_POST['isMobile'];
            }
            if(!empty($_POST['waytype'])){
                $wt=$_POST['waytype'];
            }
            
            
            $data=\BookingLog::reportDeviceReport($fromdate,$todate,$cls,$device,$br,$mobile,$wt);    
        
        $this->render('devicereport', [
            'data'=>$data,'device'=>$device,'cls'=>$cls,'br'=>$br,'mobile'=>$mobile,'wt'=>$wt,
            'datefrom'=>$fromdate,'dateto'=>$todate,
            'clientSources' => \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
          //  'serviceTypes' => \CHtml::listData(\ServiceType::model()->findAll(['order' => 'id', 'condition' => 'id<3']), 'id', 'name'),
            'deviceTypes' => \CHtml::listData(\BookingLog::model()->findAll(['select'=>'t.platform', 'group'=>'t.platform', 'distinct'=>true,'order' => 'platform', 'limit' => 1000]), 'platform', 'platform'),
            'browsers' => \CHtml::listData(\BookingLog::model()->findAll(['select'=>'t.browser', 'group'=>'t.browser', 'distinct'=>true,'order' => 'browser', 'limit' => 1000]), 'browser', 'browser'),
         //   'carriers' => \CHtml::listData(\Carrier::model()->findAll(['order' => 'name']), 'id', 'name'),
         //   'distributors' => \CHtml::listData(\UserInfo::model()->findAll(['order' => 'name', 'condition' => 'user_type_id=' . \UserType::distributor]), 'id', 'name'),
         //   'clientTypes' => \UserType::$ALL_CLIENT_TYPES,
          //  'airports' => \CHtml::listData(\Airport::model()->findAll(['order' => 'airport_code']), 'airport_code', 'airport_code'),
        ]);
    }
}
