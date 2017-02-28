<?php

namespace b2c\components;

\Yii::import('application.vendor.mobiledetect.Mobile_Detect', true);

trait ControllerExceptionable {
    public function isMobile() {
//        if (!YII_DEBUG) {
//            return false;            
//        }
        $detect = new \Mobile_Detect;
        return $detect->isMobile();
    }

    public function init()
    {
        parent::init();

        //\Yii::app()->attachEventHandler('onError',array($this,'_handleError'));
        \Yii::app()->attachEventHandler('onException',array($this,'_handleException'));
    }

    protected function _handleException(\CExceptionEvent $event) {
        if ($event->exception instanceof JsonException) {
            $event->handled = true;

            \Utils::jsonResponse($event->exception->toArray(), $event->exception->statusCode);

            // this will not be called, but still, we have good intentions

        }
    }

    protected function _handleError(\CErrorEvent $event) {
        \Utils::jsonResponse(['code' => -1, 'message' => 'Unknown PHP Error. Check the logs']);

        // this will not be called, but still, we have good intentions
        $event->handled = true;
    }


}