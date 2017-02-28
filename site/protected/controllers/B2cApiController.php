<?php

class B2cApiController extends Controller {

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
                'actions' => ['index', 'getBalance', 'airSearch', 'airConfirm', 'airBook', 'getAirCart','getUser','forgetPassword','registerNewUser'],
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
    
    function actionGetUser() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
        $getUser = new application\components\B2cApi\GetUser;
        \Utils::setAttributes($getUser, $input);
        $getUser->validate();
        echo $getUser->results();
        \Yii::app()->end();
    }
    
    function actionLogin() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
        $getAuth = new application\components\B2cApi\Auth;
        \Utils::setAttributes($getAuth, $input['credentials']);
        if($getAuth->authenticate()){
            \Utils::jsonResponse(['message' => 'Your Login was success.']);
        }
        \Yii::app()->end();
    }
    
    function actionForgetPassword() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
        $getAuth = new application\components\B2cApi\Auth;
        \Utils::setAttributes($getAuth, $input['credentials']);
        $getAuth->emailAuthentication();
        echo $getAuth->forgetPassword();
        \Yii::app()->end();
    }
    
    function actionRegisterNewUser() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
        $getAuth = new application\components\B2cApi\Auth;
        \Utils::setAttributes($getAuth, $input['credentials']);
        $getAuth->newUserAuthentication();
        echo $getAuth->registerNewUser();
        \Yii::app()->end();
    }

    function actionGetBalance() {
        $input = $this->methodCheck();
        $auth = new application\components\B2cApi\Auth;
        \Utils::setAttributes($auth, $input['credentials']);
        $auth->authenticate();
        echo json_encode($auth->getBalance(), JSON_NUMERIC_CHECK);
    }

    function actionGetAirCart() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
        $getAirCart = new application\components\B2cApi\GetAirCart;
        \Utils::setAttributes($getAirCart, $input);
        $getAirCart->validate();
        
        echo $getAirCart->results();
        \Yii::app()->end();
    }

    function actionAirSearch() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheckForSearch();
        $airSearch = new application\components\B2cApi\AirSearch;
        \Utils::setAttributes($airSearch, $input);
        !$airSearch->validate();
        \Utils::setAttributes($model, $input);
         
        //http_response_code(200);
        echo $airSearch->results();
        \Yii::app()->end();
    }

    function actionAirConfirm() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
//        print_r($input);exit;
        $airConfirm = new application\components\B2cApi\AirConfirm;
        \Utils::setAttributes($airConfirm, $input);
        $airConfirm->validate();
        $airConfirm->passengers = isset($input['passengers']) ? $input['passengers'] : null;
        echo $airConfirm->results();
        \Yii::app()->end();
    }

    function actionAirBook() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
        $airBook = new application\components\B2cApi\AirBook;
        \Utils::setAttributes($airBook, $input);
        $airBook->validate();
        $airBook->passengers = isset($input['passengers']) ? $input['passengers'] : null;
       
        echo $airBook->results();
        \Yii::app()->end();
    }
    
    function actionAirBookFinal() {
        $input = $this->methodCheck();
        if(!empty($input['cart_id']) && isset($_SESSION[$input['cart_id']])){
            $airBook = new application\components\B2cApi\AirBook;
            $airBook->cart_id=$input['cart_id'];
            $initialinput=$input;
            \Utils::setAttributes($airBook, $input);
            unset($input);
            $input=$_SESSION[$input['cart_id']];
            \Utils::setAttributes($airBook, $input);
            $airBook->validate();

            $airBook->passengers = isset($input['passengers']) ? $input['passengers'] : null;
            
            echo $airBook->resultsFinal($initialinput);
        }else{
            throw new application\components\B2cApi\B2cApiException(application\components\B2cApi\B2cApiException::MISSING_CART_ID);
        }
    }
    
    function actionMakePayment() {
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Methods:POST'); 
        $input = $this->methodCheck();
//        print_r($input);exit;
        $makePayment = new application\components\B2cApi\MakePayment;
        \Utils::setAttributes($makePayment, $input);
        $makePayment->validate();
        $makePayment->results($this);
        \Yii::app()->end();
    }

    /**
     * Check if the request method is POST and return array filled with JSON decoded body
     * @return array or Error message
     */
    function methodCheck() {
        \Utils::jsonHeader();
        if (!Yii::app()->request->isPostRequest) {
            throw new application\components\B2cApi\B2cApiException(application\components\B2cApi\B2cApiException::ONLY_POST);
        }
        
        $input = json_decode(Yii::app()->request->getRawBody(), true);
        if (!is_array($input) || !isset($input['credentials'])) {
            throw new application\components\B2cApi\B2cApiException(application\components\B2cApi\B2cApiException::DATA_VALIDATION_ERROR);
        }
        return $input;
    }
    
    function methodCheckForSearch() {
        \Utils::jsonHeader();
        if (!Yii::app()->request->isPostRequest) {
            throw new application\components\B2cApi\B2cApiException(application\components\B2cApi\B2cApiException::ONLY_POST);
        }
        
        $input = json_decode(Yii::app()->request->getRawBody(), true);
        if (!is_array($input) ) {
            throw new application\components\B2cApi\B2cApiException(application\components\B2cApi\B2cApiException::DATA_VALIDATION_ERROR);
        }
        return $input;
    }

    public function actionMeta() {
        header("Access-Control-Allow-Origin: *");
        $meta = new \stdClass;

        $meta->titles = [];
        foreach (\TravelerTitle::model()->findAll() as $i) {
            $meta->titles[] = $i->attributes;
        }

        $meta->cabinTypes = [];
        foreach (\CabinType::model()->findAll() as $i) {
            $meta->cabinTypes[] = $i->attributes;
        }

        $meta->countries = [];
        foreach (\Country::model()->findAll() as $i) {
            $meta->countries[] = $i->attributes;
        }

        $meta->travelerTypes = \TravelerType::$typeToStr;

        if (!\Yii::app()->user->isGuest) {
            $user = \Users::model()->findByPk(\Yii::app()->user->id);

            $meta->user = ['email' => $user->email, 'mobile' => $user->mobile, 'name'=>$user->name];
        }


        $inr = \Currency::model()->findByPk(\Currency::INR_ID);
        $meta->xChange = [];
        $meta->display_currency = 'INR';
        foreach (\Currency::model()->findAll(['order' => 'id']) as $currency) {
            $meta->xChange[$currency->code] = $inr->xChange(1000, $currency->id)/1000;
        }

        

        \Utils::jsonResponse($meta);
    }

    public function actionAirport($id) {
        header("Access-Control-Allow-Origin: *");
        $airport = \Airport::model()->findByPk($id);

        \Utils::jsonResponse([
            'id' => $airport->id,
            'text' => $airport->city_name . ', ' . $airport->country_code . ' (' . $airport->airport_code . ')',
            'code' => $airport->airport_code,
            'city' => $airport->city_name . ', ' . $airport->country_code
        ]);
    }

    public function actionGetDomesticAirports($country_code = 'IN') {
        header("Access-Control-Allow-Origin: *");
        $orderBy = '
	    	case when airport_code = \'DEL\' 	then 0	end ASC,
	    	case when airport_code = \'BOM\' 	then 1	end ASC,
	    	case when airport_code = \'BLR\' 	then 2	end ASC,
	    	case when airport_code = \'GOI\' 	then 3	end ASC,
	    	case when airport_code = \'MAA\' 	then 4	end ASC,
	    	case when airport_code = \'HYD\' 	then 5	end ASC,
	    	case when airport_code = \'CCU\' 	then 6	end ASC,
	    	case when airport_code = \'PNQ\' 	then 7	end ASC,
	    	airport_code ASC
    	';

        $airports = \Airport::model()->findAll(array(
            'select' => 'id, city_code, city_name, airport_code',
            'condition' => 'country_code=\'' . $country_code . '\'',
            'order' => $orderBy
        ));

        $out = [];
        foreach ($airports as $i) {
            $out[] = $i->attributes;
        }

        \Utils::jsonResponse($out);
    }
    
    public function actionSearchAirport() {
        $keyword = strtolower(CPropertyValue::ensureString(Yii::app()->request->getParam('term')));

        $orderBy = 'is_top DESC, t.city_name ASC';

        $c = new CDbCriteria();
        $c->select = 't.id, t.city_name, t.city_code, c.name AS airport_name, airport_code, is_top';
        $c->join = 'INNER JOIN ' . Country::model()->tableName() . ' AS c ON c.code = t.country_code';
//        $c->addSearchCondition('LOWER(airport_name)', $keyword);
        $c->addSearchCondition('LOWER(airport_code)', $keyword, 'OR');
        $c->addSearchCondition('LOWER(city_name)', $keyword, true, 'OR');
        $c->limit = 30;
        $c->order = $orderBy;

        $airports = Airport::model()->findAll($c);

        $list = array();
        $marked = false;
        foreach ($airports as $idx => $airport) {
            $lbl = $airport->city_name . ', ' . $airport->airport_name . ' (' . $airport->airport_code . ')';

            if ($idx != 0 && $airport->is_top === 0 && !$marked) {
                $list[] = [
                    'label' => '-----------------',
                    'value' => ''
                ];
                $marked = true;
            }
            $list[] = [
                'label' => $lbl,
                'value' => $lbl,
                'id' => $airport->id
            ];
        }

        \Utils::jsonResponse($list);
    }

}
