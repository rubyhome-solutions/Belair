<?php

class SearchesController extends Controller {

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
        );
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return array(
            array('allow', // All
                'actions' => array('refreshProcessInfo'),
                'users' => array('*'),
            ),
            array('allow', // allow admin user to perform actions
                'actions' => array('admin'),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new Searches('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['Searches'])) {
            $model->attributes = $_GET['Searches'];
        }

        if (Yii::app()->request->isAjaxRequest) {
            $this->renderPartial('_grid', ['model' => $model]);
        } else {
            $this->render('admin', ['model' => $model]);
        }
    }

    public function actionRefreshProcessInfo() {
//        \Yii::beginProfile('actionRefreshProcessInfo');
        $model = $this->loadModel(Yii::app()->request->getPost('id'));
        \Utils::jsonHeader();
        $out = [];
        $session = Yii::app()->session->get('sendProcesses');
        foreach ($model->processes as $process) {
            if (!empty($process->note) && !isset($session[$process->id])) {
                $out[$process->id] = substr($process->note, 0, 21);
                $session[$process->id] = 1;
//                if (rand(1, 5) != 1) break;
            }            
        }
        sleep(1);   // Pause the Ajax calls for 1 sec.
        if (!isset($session['cacheResults'])) {
            $session['cacheResults'] = [];
        }
//        \Yii::beginProfile('getCacheResults');
        $out['cacheResults'] = \RoutesCache::getCacheResults($model->id, $session['cacheResults']);        
//        \Yii::endProfile('getCacheResults');
        // Merge the new array into the session with preserving the numeric key
        foreach ($out['cacheResults'] as $key => $value) {
            $session['cacheResults'][$key] = $value;
        }
        Yii::app()->session->add('sendProcesses', $session);
        if (count($session) > count($model->processes)) {
            $out['stop'] = 1;
            $model->deleteOldCacheResults(array_keys($session['cacheResults']));
            \Yii::app()->session->remove('sendProcesses');   // Remove this session variable once done
            // Delete duplicate RCs
            $model->removeDuplicates();
        }
        echo json_encode($out);
//        \Yii::endProfile('actionRefreshProcessInfo');
//        echo json_encode($_SESSION);
    }

    /**
     * Load the model
     * @param int $id Search ID
     * @return \Searches
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = \Searches::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested search does not exist.');
        }
        return $model;
    }

}
