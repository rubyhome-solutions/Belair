<?php

class B2bApiController extends Controller {

    /**
     * @var string the default layout for the views. Defaults to '//layouts/column1', meaning
     * using two-column layout. See 'protected/views/layouts/column1.php'.
     */
    public $layout = '//layouts/plain';

    /**
     * @return array action filters
     */
    public function filters() {
        return [
            'accessControl', // perform access control for CRUD operations
//            'postOnly + getBalance, airSearch, airConfirm, airBook', // we only allow deletion via POST request
        ];
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return [
            [
                'allow',
                'actions' => ['index', 'getBalance', 'airSearch', 'airConfirm', 'airBook', 'getAirCart'],
                'users' => ['*'],
            ],
        ];
    }

    /**
     * API index
     */
    public function actionIndex() {
        $actions = $this->accessRules();
        $this->render('index', ['actions' => $actions[0]['actions']]);
    }

    function actionGetBalance() {
        $input = $this->methodCheck();
        $auth = new application\components\B2bApi\Auth;
        \Utils::setAttributes($auth, $input['credentials']);
        $auth->authenticate();
        echo json_encode($auth->getBalance(), JSON_NUMERIC_CHECK);
    }

    function actionGetAirCart() {
        $input = $this->methodCheck();
        $getAirCart = new application\components\B2bApi\GetAirCart;
        \Utils::setAttributes($getAirCart, $input);
        $getAirCart->validate();
        
        echo $getAirCart->results();
    }

    function actionAirSearch() {
        $input = $this->methodCheck();
        $airSearch = new application\components\B2bApi\AirSearch;
        \Utils::setAttributes($airSearch, $input);
        !$airSearch->validate();

        echo $airSearch->results();
    }

    function actionAirConfirm() {
        $input = $this->methodCheck();
//        print_r($input);exit;
        $airConfirm = new application\components\B2bApi\AirConfirm;
        \Utils::setAttributes($airConfirm, $input);
        $airConfirm->validate();
        $airConfirm->passengers = isset($input['passengers']) ? $input['passengers'] : null;

        echo $airConfirm->results();
    }

    function actionAirBook() {
        $input = $this->methodCheck();
        $airBook = new application\components\B2bApi\AirBook;
        \Utils::setAttributes($airBook, $input);
        $airBook->validate();
        $airBook->passengers = isset($input['passengers']) ? $input['passengers'] : null;

        echo $airBook->results();
    }

    /**
     * Check if the request method is POST and return array filled with JSON decoded body
     * @return array or Error message
     */
    function methodCheck() {
        \Utils::jsonHeader();
        if (!Yii::app()->request->isPostRequest) {
            throw new application\components\B2bApi\B2bApiException(application\components\B2bApi\B2bApiException::ONLY_POST);
        }
        $input = json_decode(Yii::app()->request->getRawBody(), true);
        if (!is_array($input) || !isset($input['credentials'])) {
            throw new application\components\B2bApi\B2bApiException(application\components\B2bApi\B2bApiException::DATA_VALIDATION_ERROR);
        }
        return $input;
    }

}
