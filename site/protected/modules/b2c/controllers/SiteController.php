<?php

namespace b2c\controllers;
use b2c\components\ControllerOverridable;

\Yii::import('application.controllers.SiteController');
class SiteController extends \SiteController {

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex() {
        $this->render('//index');
    }
    /**
     * Displays the contact page
     */
    public function actionContact() {
       
        $model = new \ContactForm;
        if (isset($_POST['ContactForm'])) {
            $model->attributes = $_POST['ContactForm'];
            if ($model->validate()) {
                $name = '=?UTF-8?B?' . base64_encode($model->name) . '?=';
                $subject = '=?UTF-8?B?' . base64_encode($model->subject) . '?=';
                $headers = "From: $name <{$model->email}>\r\n" .
                        "Reply-To: {$model->email}\r\n" .
                        "MIME-Version: 1.0\r\n" .
                        "Content-Type: text/plain; charset=UTF-8";

                mail(\Yii::app()->params['adminEmail'], $subject, $model->body, $headers);
                \Yii::app()->user->setFlash('contact', 'Thank you for contacting us. We will respond to you as soon as possible.');
                $this->refresh();
            }
        }
        $this->render('//contact', array('model' => $model));
    }

   

}
