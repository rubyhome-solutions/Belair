<?php

use \application\components\Amadeus\test_v2\Certification;

class TestController extends Controller {

    const AMADEUS_CERTIFICATION_V2 = '433QOcKD5hRl4Cb';

    static $allowedIP = [
        '127.0.0.1',
//        '103.6.159.163',
//        '::1'
    ];
    public $layout = '//layouts/column1';

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex() {

        if (!in_array(Yii::app()->request->userHostAddress, self::$allowedIP)) {
            Utils::finalMessage("This page is for internal testing use only. You are not welcome here!");
        }
        $this->render('tony_test', ['view' => \Yii::app()->request->getQuery('view')]);
    }

    /**
     * Amadeus certification
     */
    public function actionAmadeus() {

        if (!YII_DEBUG || \Yii::app()->request->getQuery('v') !== self::AMADEUS_CERTIFICATION_V2) {
            echo "<h2>This page is for Amadeus certification purposes use only. You are not welcome here!</h2>";
            \Yii::app()->end();
        }

        $action = \Yii::app()->request->getPost('action');
        switch ($action) {
            case 'miniRule':
                $pnr = \Yii::app()->request->getPost('pnr');
                if (strlen($pnr) !== 6) {
                    echo Certification::formatError('The PNR length should be 6 symbols');
                } else {
                    echo Certification::miniRule($pnr);
                }
                break;

            case 'placePNR':
                $pnr2 = \Yii::app()->request->getPost('pnr2');
                $source = \Yii::app()->request->getPost('source');
                $destination = \Yii::app()->request->getPost('destination');
                $queueNum = \Yii::app()->request->getPost('queueNum');
                if ($source === $destination) {
                    echo Certification::formatError('The source and destination OIDs should be different');
                } elseif (strlen($pnr2) !== 6) {
                    echo Certification::formatError('The PNR length should be 6 symbols');
                } else {
                    echo Certification::queuePnr($pnr2, $source, $destination, $queueNum);
                }
                break;

            case 'queueList':
                $source = \Yii::app()->request->getPost('source2');
                $queueNum = \Yii::app()->request->getPost('queueNum2');
                echo Certification::queueList($source, $queueNum);
                break;

            default:
                $this->render('a1_certification_v2', ['post' => $_POST]);
                break;
        }
    }

  /* public function actionFZTest() {
        $airSource=  \AirSource::model()->findByPk(41);
        try {
            // Acquire the new AirCart
            $acquisitionResponse = call_user_func($airSource->backend->pnr_acquisition, '4KL6IL', 41);
        } catch (\Exception $e) {
            \Utils::dbgYiiLog($e);
           \Utils::dbgYiiLog(['error' => "Aquisition exception for PNR: {$createResponse['pnr']}  Please call the customer service!"]);
        }
        \Utils::dbgYiiLog($acquisitionResponse['airCartId']);
       // $this->render('tony_test', ['view' => \Yii::app()->request->getQuery('view')]);
    }
     public function actionFZLive() {
        $airSource=  \AirSource::model()->findByPk(42);
        try {
            // Acquire the new AirCart
            $acquisitionResponse = call_user_func($airSource->backend->pnr_acquisition, 'EZVA9J', 42);
        } catch (\Exception $e) {
            \Utils::dbgYiiLog($e);
           \Utils::dbgYiiLog(['error' => "Aquisition exception for PNR: {$createResponse['pnr']}  Please call the customer service!"]);
        }
        \Utils::dbgYiiLog($acquisitionResponse['airCartId']);
       // $this->render('tony_test', ['view' => \Yii::app()->request->getQuery('view')]);
    } */
}
