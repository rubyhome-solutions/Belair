<?php

namespace b2c\controllers;

use b2c\components\ControllerExceptionable;
use b2c\components\ControllerOverridable;


class DealsController extends \Controller {

    use ControllerOverridable;

    protected $_inheritRules = false;

    /**
     * @return array action filters
     */
	 public function actionIndex() {
			$this->layout = '//layouts/mobile';
            $this->render('//common/mobilejs', ['bundle' => 'deals']);
		}
}