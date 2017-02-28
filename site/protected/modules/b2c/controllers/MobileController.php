<?php

namespace b2c\controllers;

class MobileController extends \Controller {
    public function actionIndex() {
        $this->layout = '//layouts/mobile';
        $this->render('//common/mobilejs', ['bundle' => 'flights']);
    }
    public function actionMybookings() {
        $this->layout = '//layouts/mobile';      
         if (isset(\Yii::app()->user->id))
            $this->render('//common/mobilejs', ['bundle' => 'mybookings']);
        else
            $this->render('//common/mobilejs', ['bundle' => 'guestfilter']);
    }
    public function actionGuestbooking() {
        $this->layout = '//layouts/mobile';        
         if (isset(\Yii::app()->user->id))
            $this->render('//common/mobilejs', ['bundle' => 'mybookings']);
        else
            $this->render('//common/mobilejs', ['bundle' => 'guestfilter']);
    }
	public function actionMyprofile() {
        $this->layout = '//layouts/mobile';       
         if (isset(\Yii::app()->user->id))
            $this->render('//common/mobilejs', ['bundle' => 'myprofile']);
        else
            $this->render('//common/mobilejs', ['bundle' => 'guestfilter']);
    }
	public function actionMytraveller() {
        $this->layout = '//layouts/mobile';             
         if (isset(\Yii::app()->user->id))
            $this->render('//common/mobilejs', ['bundle' => 'mytraveller']);
        else
            $this->render('//common/mobilejs', ['bundle' => 'guestfilter']);
    }
}