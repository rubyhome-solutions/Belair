<?php

namespace b2c\controllers;

use b2c\components\ControllerExceptionable;
use b2c\components\ControllerOverridable;
// use b2c\models\Flightbooking;

// \Yii::import('application.controllers.ContactusController');

class FaqController extends \Controller 
{
    use ControllerOverridable,ControllerExceptionable;
    
    public function actionIndex()
    {
        if (\Yii::app()->request->isAjaxRequest) {
         
            if (!empty(\Yii::$app->request->post())) {
                \Utils::jsonResponse(
                    contactusSearchManager::create(\Yii::$app->request->post())->searchJson()
                );
            }

            if (!empty(\Yii::$app->request->get('query'))) {
                $cs = \Yii::$app->request->get('cs') ? (int)\Yii::$app->request->get('cs') : \ClientSource::SOURCE_DIRECT;
                if (!\ClientSource::model()->findByPk($cs)) {
                    $cs = \ClientSource::SOURCE_DIRECT;
                }


                \Utils::jsonResponse(
                    contactusSearchManager::parse(\Yii::$app->request->get('query'), \Yii::$app->request->get('force') ? (bool)\Yii::$app->request->get('force') : false, $cs)->searchJson()
                );
            }

            if (\Yii::$app->request->get('options') && \Yii::$app->request->get('ids') && \Yii::$app->request->get('updated')) {
                \Utils::jsonResponse(
                    contactusSearchManager::factory(\Yii::$app->request->get('options'), \Yii::$app->request->get('ids'))->progressJson(\Yii::$app->request->get('updated'))
                );
                return;
            }

            \Utils::jsonResponse(['message' => 'Incorrect request'], 400);
        }

        if ($this->isMobile()) {
            $this->layout = '//layouts/mobile';
            $this->render('//common/mobilejs', ['bundle' => 'faq']);
        } else {
            $this->render('//common/js', ['bundle' => 'faq']);
        }
    }
    
    
}