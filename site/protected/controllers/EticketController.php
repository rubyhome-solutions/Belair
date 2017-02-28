<?php

/**
 * EticketController class.
 * 
 * @extends Controller
 */
class EticketController extends Controller {

    /**
     * @return array action filters
     */
    public function filters() {
        return array(
            'accessControl', // perform access control for CRUD operations
            'postOnly + delete', // we only allow deletion via POST request
        );
    }

    /**
     * actionView function.
     * 
     * @param integer $id The AirBooking ID
     */
    public function actionView($id) {
        $this->renderPartial('view', array(
            'id' => $id,
        ));
    }

}