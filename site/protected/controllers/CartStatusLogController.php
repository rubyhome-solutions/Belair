<?php

class CartStatusLogController extends Controller
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
                    'actions' => array('admin', 'index', 'view', 'cartLogReport'),
                    'expression' => 'Authorization::getIsTopStaffLogged()'
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
		$dataProvider=new CActiveDataProvider('CartStatusLog');
		$this->render('index',array(
			'dataProvider'=>$dataProvider,
		));
	}

	/**
	 * Manages all models.
	 */
	public function actionAdmin()
	{
		$model=new CartStatusLog('search');
		$model->unsetAttributes();  // clear any default values
		if(isset($_GET['CartStatusLog']))
			$model->attributes=$_GET['CartStatusLog'];

		$this->render('admin',array(
			'model'=>$model,
		));
	}

	/**
	 * Returns the data model based on the primary key given in the GET variable.
	 * If the data model is not found, an HTTP exception will be raised.
	 * @param integer $id the ID of the model to be loaded
	 * @return CartStatusLog the loaded model
	 * @throws CHttpException
	 */
	public function loadModel($id)
	{
		$model=CartStatusLog::model()->findByPk($id);
		if($model===null)
			throw new CHttpException(404,'The requested page does not exist.');
		return $model;
	}

	/**
	 * Performs the AJAX validation.
	 * @param CartStatusLog $model the model to be validated
	 */
	protected function performAjaxValidation($model)
	{
		if(isset($_POST['ajax']) && $_POST['ajax']==='cart-status-log-form')
		{
			echo CActiveForm::validate($model);
			Yii::app()->end();
		}
	}
        
        public function actionCartLogReport() {
            $reportdata = null;
            $cs=null;
                if(isset($_POST['dateFrom'])&&isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])){
                    $fromdate=date('Y-m-d', strtotime($_POST['dateFrom'])); 
                    $todate=date('Y-m-d', strtotime($_POST['dateTo']));
                     $date1 = new \DateTime($fromdate);
                    $date2 = new \DateTime($todate);
                    $diff = $date2->diff($date1)->format("%a");
                    $diff++;

                    $prevfromdate=date('Y-m-d', strtotime($fromdate.'-'.$diff.' days')); 
                    $prevtodate=date('Y-m-d', strtotime($fromdate.' -1 days'));
                    if(isset($_POST['clientSource'])){
                        $cs=(int)$_POST['clientSource'];
                    }
                }else{
                    $fromdate=date('Y-m-d', strtotime('-1 days')); 
                    $todate=date('Y-m-d', strtotime('-1 days'));

                    $date1 = new \DateTime($fromdate);
                    $date2 = new \DateTime($todate);
                    $diff = $date2->diff($date1)->format("%a");
                    $diff++;

                    $prevfromdate=date('Y-m-d', strtotime($fromdate.'-'.$diff.' days')); 
                    $prevtodate=date('Y-m-d', strtotime($fromdate.' -1 days'));
                    if(isset($_POST['clientSource'])){
                        $cs=(int)$_POST['clientSource'];
                    }
                   //\Utils::dbgYiiLog(['fromdate'=>$fromdate,'todate'=>$todate,'prevfromdate'=>$prevfromdate,'prevtodate'=>$prevtodate]);
                }
            
            $data=\CartStatusLog::cartStatusLogReport($fromdate,$todate);
            $prevdata=\CartStatusLog::cartStatusLogReport($prevfromdate,$prevtodate);
            //\Utils::dbgYiiLog(['data'=>$data,'prevdata'=>$prevdata]);
          $this->render('cartstatusaverage',array(
              'data'=>$data,'prevdata'=>$prevdata,'datefrom'=>$fromdate,'dateto'=>$todate,'prevdatefrom'=>$prevfromdate,'prevdateto'=>$prevtodate
            ));
    }
}
