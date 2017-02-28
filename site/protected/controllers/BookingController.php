<?php

use application\components\b2c\Journey_Exception;

Yii::import('application.models.forms.*');

class BookingController extends Controller {

    static $scrapperTags = [
        'indigoScrapper',
        'spicejetScrapper',
        'airindiaScrapper',
        'airasiaScrapper',
        'flydubaiScrapper',
    ];

    /**
     * @return array action filters
     */
    public function filters() {
        return array(
            'accessControl', // perform access control for CRUD operations
            'postOnly + book, fakeBook', // we only allow deletion via POST request
        );
    }

    public function accessRules() {
        return array(
            array(
                'allow', // allow staff to perform
                'actions' => ['amadeusCheck', 'amadeusBook', 'book', 'fakeBook', 'fakeBookAjax', 'priceAndAvailabilityCheck'],
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            [
                'allow', // allow all users
                'actions' => ['booking', 'search'],
                'users' => ['*'],
            ],
            ['allow', // allow authenticated user to perform
                'actions' => ['index', 'international', 'multicity', 'searchAirport', 'search', 'booking'],
                'users' => ['@'],
            ],
            array(
                'deny', // deny all users
                'users' => ['*'],
            ),
        );
    }

    public function actionIndex() {
        $model = new BookingSearchForm();
        $model->form_type = BookingSearchForm::TYPE_DOMESTIC;
//        print_r($_POST);exit;
        $post = Yii::app()->request->getPost('BookingSearchForm', false);
        if ($post) {
            $model->attributes = $post;
            if ($model->validate()) {
                // Manual cart creation
                if (Yii::app()->user->returnUrl === '/airCart/create') {
                    Yii::app()->user->setState('BookingSearchForm', $model->attributes);
                    Yii::app()->user->returnUrl = '/';
                    $this->redirect('/airCart/create');
                }

                $api = Yii::app()->request->getPost('api');

                if ($api === 'GoAir') {
                    $this->render('goair', ['model' => $model]);
                    Yii::app()->end();
                }
//                 if ($api === 'Flydubai') {
//                    $this->render('flydubai', ['model' => $model]);
//                    Yii::app()->end();
//                }

                if ($api === 'SpiceJet') {
                    $this->render('spicejet_production', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'SpiceJet_v2') {
                    $this->render('spicejet_production_v2', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'SpiceJetTest') {
                    $this->render('spicejet_test', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'Amadeus') {
                    $this->render('amadeus_test', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'AmadeusV2:test') {
                    $this->render('amadeus_test_v2', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'AmadeusV2:prod') {
                    $this->render('amadeus_prod_v2', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'AmadeusProduction') {
                    $this->render('amadeus_production', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'Indigo') {
                    $this->render('indigo_production_v2', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'IndigoTest') {
                    $this->render('indigo_test_v2', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'galileoProduction') {
                    $this->render('galileo_production', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'galileoTest') {
                    $this->render('galileo_test', ['model' => $model]);
                    Yii::app()->end();
                }

                if ($api === 'airSourceRule') {
                    $this->render('airSourceRule', ['model' => $model]);
                    Yii::app()->end();
                }

                $arrApi = explode(':', $api);
                if (count($arrApi) > 1) {
                    if (in_array($arrApi[0], self::$scrapperTags)) {
                        $this->render('scrappers', [
                            'model' => $model,
                            'scrapperId' => $arrApi[1]
                        ]);
                        Yii::app()->end();
                    }
                    if ($arrApi[0] === 'deeplink') {
                        $this->render('deeplink', [
                            'model' => $model,
                            'clientSourceId' => (int) $arrApi[1]
                        ]);
                        Yii::app()->end();
                    }
                }

                if ($api === 'searchTest') {
                    Yii::app()->session->remove('sendProcesses');
                    $search = \Searches::populate($model);
                    $this->render('search_test', ['model' => $search]);
                    Yii::app()->end();
                }

                // Display all results
                $this->render('summary', ['model' => \Searches::populate($model)]);
                Yii::app()->end();
            }
        } else {
            $model->way = BookingSearchForm::ONE_WAY;
            $model->depart = date('Y-m-d');

            $model->adults = 1;
            $model->children = 0;
            $model->infants = 0;

            $model->source = 1236;
            $model->destination = 946;
        }

        $categories = CabinType::model()->findAll();
        list($list, $cities) = $this->getAirport();

        $this->pageTitle = Yii::app()->name . ' - Domestic Flights';
        $this->render('index', array(
            'form_view' => '_form',
            'model' => $model,
            'airports' => $list,
            'cities' => $cities,
            'categories' => CHtml::listData($categories, 'id', 'name'),
            'airlines' => $this->getAirlines()
        ));
    }

    public function actionSearch() {
        $model = new BookingSearchForm();
        $model->form_type = BookingSearchForm::TYPE_DOMESTIC;
        $post = Yii::app()->request->getPost('BookingSearchForm', false);
        if ($post) {
            $model->attributes = $post;
            Yii::app()->session->remove('sendProcesses');
            $search = \Searches::populate($model);
            $search->type_id = $model->way;
            $this->render('search_test', ['model' => $search]);
            Yii::app()->end();
        } else {
            $model->way = BookingSearchForm::ONE_WAY;
            $model->depart = date('Y-m-d');

            $model->adults = 1;
            $model->children = 0;
            $model->infants = 0;

            $model->source = 1236;
            $model->destination = 946;
        }
        $categories = CabinType::model()->findAll();
        list($list, $cities) = $this->getAirport();

        $this->pageTitle = Yii::app()->name . ' - Domestic Flights';
        $this->render('index', array(
            'form_view' => '_form',
            'model' => $model,
            'airports' => $list,
            'cities' => $cities,
            'categories' => CHtml::listData($categories, 'id', 'name'),
            'airlines' => $this->getAirlines()
        ));
    }

    public function actionAmadeusBook() {
        set_time_limit(90);
//        echo Utils::dbg($_POST);
//        echo Utils::dbg(json_decode($_POST['data'], true)) . "<hr>";
//        echo Utils::dbg($_POST['Traveler']) . "<hr>";
//        exit;

        if (isset($_POST['data']) && isset($_POST['fop']) && isset($_POST['Cc']) &&
                isset($_POST['Traveler']) && isset($_POST['action']) && isset($_POST['airSourceId'])
        ) {
            if ($_POST['action'] === 'book') {
                $fop = null;
            } else {
                $fop = $_POST['fop'];
            }
            $data = json_decode($_POST['data'], true);
            if (is_array($data)) {
                $airSource = \AirSource::model()->with('backend')->findByPk($_POST['airSourceId']);
                if (YII_DEBUG) {
//                    echo \Utils::dbgYiiLog([
//                        'airSourceId' => $_POST['airSourceId'],
//                        'data' => $data,
//                        'Traveler' => $_POST['Traveler'],
//                        'fop' => $fop,
//                        'Cc' => $_POST['Cc']
//                    ]);
//                    exit;
                }
                $book = new $airSource->backend->book($_POST['airSourceId'], $data, $_POST['Traveler'], $fop, $_POST['Cc'], $data['marketingCompany']);
//                echo Utils::dbgYiiLog($book);
//                Yii::app()->end();
//                $result = $book->doBooking();
//                $result = $book->test();
                $result = $book->doBooking();
                if (isset($result['error'])) {
                    Utils::finalMessage($result['error']);
                }
                $airCart = \AirCart::model()->findByPk((int) $result['airCartId']);
                /* @var $airCart \AirCart */
                $airCart->setAirBookingsAndAirRoutesOrder();
                $airCart->applyBothRules();
                $airCart->setBookingStatus();

                $this->redirect('/airCart/view/' . $result['airCartId']);
            }
        }
    }

    public function actionAmadeusCheck() {
        if (isset($_POST['data']) && isset($_POST['Traveler']) && isset($_POST['airSourceId'])
        ) {
            $data = json_decode($_POST['data'], true);
            parse_str($_POST['Traveler']);
            if (is_array($data)) {
//                if (YII_DEBUG) {
//                    echo '<pre>' . print_r([
//                        'airSourceId' => $_POST['airSourceId'],
//                        'inputs' => $data,
//                        'travelers' => $Traveler,
//                            ], true) . '</pre>';
//                }
                $result = \application\components\Amadeus\Utils::checkAvailabilityAndFares($_POST['airSourceId'], $data, $Traveler);
                if ($result === true) {
                    echo "The availability and the Fares are confirmed! Everything is <b>OK</b>!";
                } else {
                    echo 'Error: ' . nl2br(print_r($result, true));
                }
            }
        }
    }

    public function actionPriceAndAvailabilityCheck() {
        if (isset($_POST['data'])) {
            if (!empty($_POST['onward']) && $_POST['onward'] !== 'undefined') {
                $data = $this->mergeJourneys(json_decode($_POST['onward'], true), json_decode($_POST['data'], true));
            } else {
                $data = json_decode($_POST['data'], true);
            }
            // Fix the total correction
            foreach ($data['pax'] as $paxTypeId => $value) {
                if (!isset($data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                    $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
                }
                $data['pax'][$paxTypeId]['totalFare'] = $data['pax'][$paxTypeId]['totalFare'] + $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
            }
            parse_str($_POST['Traveler']);
            if (is_array($data)) {
                if (YII_DEBUG) {
                    echo '<pre>' . print_r([
                        'airSourceId' => $_POST['airSourceId'],
                        'inputs' => $data,
                        'Traveler' => $Traveler,
                            ], true) . '</pre>';
//                    \Yii::app()->end();
                }
                $result = \ApiInterface::checkAvailabilityAndFares($_POST['airSourceId'], $data, $Traveler);
                if ($result === true) {
                    echo "The availability and the Fares are confirmed! Everything is <b>OK</b>!";
                } else {
                    echo 'Error: ' . nl2br(print_r($result, true));
                }
            }
        }
    }

    public function actionBook() {
//        \Utils::dbgYiiLog($_POST);
//        echo Utils::dbg($_POST);
//        echo var_export(json_decode($_POST['data'], true));
//        echo Utils::dbg(json_decode($_POST['onward'], true)) . "<hr>";
//        echo Utils::dbg(json_decode($_POST['data'], true)) . "<hr>";
//        echo Utils::dbg($_POST['Traveler']) . "<hr>";
//        $data = $this->mergeJourneys(json_decode($_POST['onward'], true), json_decode($_POST['data'], true));
//        $data = json_decode($_POST['data'], true);
//        echo Utils::dbg($data);
//        exit;

        if (isset($_POST['data']) && isset($_POST['fop']) && isset($_POST['Cc']) &&
                isset($_POST['Traveler']) && isset($_POST['airSourceId'])
        ) {
            $fop = $_POST['fop'];
            if (isset($_POST['onward'])) {
                $data = $this->mergeJourneys(json_decode($_POST['onward'], true), json_decode($_POST['data'], true));
            } else {
                $data = json_decode($_POST['data'], true);
                // Fix the total correction
                foreach ($data['pax'] as $paxTypeId => $value) {
                    if (!isset($data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                        $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
                    }
                    $data['pax'][$paxTypeId]['totalFare'] = $data['pax'][$paxTypeId]['totalFare'] + $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
                }
            }
            if (is_array($data)) {
                $result = \ApiInterface::book((int) $_POST['airSourceId'], $data, $_POST['Traveler'], $fop, $_POST['Cc']);
                if (!empty($result['error'])) {
                    Utils::finalMessage($result['error']);
                }
                $airCart = \AirCart::model()->findByPk((int) $result['airCartId']);
                /* @var $airCart \AirCart */
                $airCart->setAirBookingsAndAirRoutesOrder();
                $airCart->applyBothRules();
                $airCart->setBookingStatus();

                $this->redirect('/airCart/view/' . $result['airCartId']);
            }
        }
    }

    /**
     * Create fake booking for testing purposes
     */
    public function actionFakeBook() {
        if (isset($_POST['data']) && isset($_POST['Traveler']) && isset($_POST['airSourceId'])
        ) {
            if (isset($_POST['onward'])) {
                $data = $this->mergeJourneys(json_decode($_POST['onward'], true), json_decode($_POST['data'], true));
            } else {
                $data = json_decode($_POST['data'], true);
                // Fix the total correction
                foreach ($data['pax'] as $paxTypeId => $value) {
                    if (!isset($data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                        $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
                    }
                    $data['pax'][$paxTypeId]['totalFare'] = $data['pax'][$paxTypeId]['totalFare'] + $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
                }
            }
            if (is_array($data)) {
                $result = \ApiInterface::fakeBook((int) $_POST['airSourceId'], $data, $_POST['Traveler']);
                if (!empty($result['error'])) {
                    Utils::finalMessage($result['error']);
                }
                $this->redirect('/airCart/view/' . $result['airCartId']);
            }
        }
    }

    /**
     * Create fake booking for testing purposes
     */
    public function actionFakeBookAjax() {
        if (isset($_POST['data']) && isset($_POST['Traveler']) && isset($_POST['airSourceId'])
        ) {
            if (isset($_POST['onward'])) {
                $data = $this->mergeJourneys(json_decode($_POST['onward'], true), json_decode($_POST['data'], true));
            } else {
                $data = json_decode($_POST['data'], true);
                // Fix the total correction
                foreach ($data['pax'] as $paxTypeId => $value) {
                    if (!isset($data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                        $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
                    }
                    $data['pax'][$paxTypeId]['totalFare'] = $data['pax'][$paxTypeId]['totalFare'] + $data['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
                }
            }
            if (is_array($data)) {
                $result = \ApiInterface::fakeBook((int) $_POST['airSourceId'], $data, $_POST['Traveler']);
                if (!empty($result['error'])) {
                    \Utils::jsonResponse($result);
                }
                \Utils::jsonResponse($result['airCartId']);
            } else {
                \Utils::jsonResponse(['error' => '$data is not an array']);
            }
        } else {
            \Utils::jsonResponse(['error' => 'data Traveler or airSourceId are missing']);
        }
    }

    function mergeJourneys($onward, $back) {
        $out = $onward;
        $out['segments'][] = reset($back['segments']);
        if (isset($onward['params']) && isset($back['params'])) {
            unset($out['params']);
            $out['params'][] = $onward['params'];
            $out['params'][] = $back['params'];
        }
        foreach ($onward['pax'] as $paxTypeId => $value) {
            if (!isset($onward['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                $onward['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
            }
            if (!isset($back['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION])) {
                $back['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] = 0;
            }
            $out['pax'][$paxTypeId]['totalFare'] = $onward['pax'][$paxTypeId]['totalFare'] + $onward['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION] + $back['pax'][$paxTypeId]['totalFare'] + $back['pax'][$paxTypeId]['arrTaxes'][\Taxes::TAX_TOTAL_CORRECTION];
            $out['pax'][$paxTypeId]['fareBasis'] = [
                1 => $onward['pax'][$paxTypeId]['fareBasis'],
                2 => $back['pax'][$paxTypeId]['fareBasis']
            ];
            unset($out['pax'][$paxTypeId]['arrTaxes']);
        }
        return $out;
    }

//    public function actionAmadeusBookProduction() {
////        echo Utils::dbg($_POST);
//
//        if (isset($_POST['data']) && isset($_POST['fop']) && isset($_POST['Cc']) &&
//                isset($_POST['Traveler']) && isset($_POST['action'])
//        ) {
//            if ($_POST['action'] === 'book') {
//                $fop = null;
//            } else {
//                $fop = $_POST['fop'];
//            }
//            $data = json_decode($_POST['data'], true);
//            if (is_array($data)) {
////                echo Utils::dbg($data);
//                $book = new \application\components\Amadeus\production\Book($_POST['airSourceId'], $data, $_POST['Traveler'], $fop, $_POST['Cc']);
////                echo Utils::dbg($book);
////                Yii::app()->end();
////                $result = $book->doBooking();
////                $result = $book->test();
//                $result = $book->doBooking();
//                if (isset($result['error'])) {
//                    Utils::finalMessage($result['error']);
//                }
//                $airCart = \AirCart::model()->findByPk((int) $result['airCartId']);
//                /* @var $airCart \AirCart */
//                $airCart->applyCommercialRule();    // Commercial rule application
//                $airCart->applyCommissionRule();    // Calculate the commission
//
//                $this->redirect('/airCart/view/' . $result['airCartId']);
//            }
//        }
//    }

    public function actionInternational() {
        $model = new BookingSearchForm();
        $model->form_type = BookingSearchForm::TYPE_INTERNATIONAL;

        $post = Yii::app()->request->getPost('BookingSearchForm', false);
        if ($post) {
            $model->attributes = $post;
            // Manual cart creation
            if (Yii::app()->user->returnUrl === '/airCart/create') {
                Yii::app()->user->setState('BookingSearchForm', $model->attributes);
                Yii::app()->user->returnUrl = '/';
                $this->redirect('/airCart/create');
            }

            $api = Yii::app()->request->getPost('api');

            if ($api === 'SpiceJet') {
                $this->render('spicejet_production', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'SpiceJetTest') {
                $this->render('spicejet_test', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'Indigo') {
                $this->render('indigo_production_v2', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'IndigoTest') {
                $this->render('indigo_test_v2', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'Amadeus') {
                if (Utils::getActiveUserId() === false) {
                    Yii::app()->user->setFlash('msg', 'Please pick a user or company, before you can use Amadeus test booking!');
                    $this->redirect('/users/manage');
                }
                $this->render('amadeus_test', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'AmadeusV2:test') {
                $this->render('amadeus_test_v2', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'AmadeusV2:prod') {
                $this->render('amadeus_prod_v2', ['model' => $model]);
                Yii::app()->end();
            }



            if ($api === 'AmadeusProduction') {
                $this->render('amadeus_production', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'galileoProduction') {
                $this->render('galileo_production', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'galileoTest') {
                $this->render('galileo_test', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'Flydubai') {
                $this->render('flydubai', ['model' => $model]);
                Yii::app()->end();
            }

            if ($api === 'airSourceRule') {
                $this->render('airSourceRule', ['model' => $model]);
                Yii::app()->end();
            }

            $arrApi = explode(':', $api);
            if (count($arrApi) > 1) {
                if (in_array($arrApi[0], self::$scrapperTags)) {
                    $this->render('scrappers', [
                        'model' => $model,
                        'scrapperId' => $arrApi[1]
                    ]);
                    Yii::app()->end();
                }
                if ($arrApi[0] === 'deeplink') {
                    $this->render('deeplink', [
                        'model' => $model,
                        'clientSourceId' => (int) $arrApi[1]
                    ]);
                    Yii::app()->end();
                }
            }

            if ($api === 'searchTest') {
                Yii::app()->session->remove('sendProcesses');
                $search = \Searches::populate($model);
                $this->render('search_test', ['model' => $search]);
                Yii::app()->end();
            }

            // Display all results
            $this->render('summary', ['model' => \Searches::populate($model)]);
            Yii::app()->end();
        } else {
            $model->way = BookingSearchForm::ONE_WAY;
            $model->depart = date('Y-m-d');

            $model->adults = 1;
            $model->children = 0;
            $model->infants = 0;

            $model->source = 1236;
            $model->destination = 1327;
        }

        $categories = CabinType::model()->findAll();
        $cities = array();

        $initSrc = Airport::model()->findByPk($model->source);
        $country = Country::model()->find('code = ?', array($initSrc->country_code));
        $cities[$initSrc->id] = $initSrc->city_name . ', ' . $country->name . ' (' . $initSrc->airport_code . ')';

        $initDes = Airport::model()->findByPk($model->destination);
        $country = Country::model()->find('code = ?', array($initDes->country_code));
        $cities[$initDes->id] = $initDes->city_name . ', ' . $country->name . ' (' . $initDes->airport_code . ')';


        $this->pageTitle = Yii::app()->name . ' - International Flights';
        $this->render('index', array(
            'form_view' => '_inter_form',
            'model' => $model,
            'airports' => '/booking/searchAirport',
            'cities' => $cities,
            'categories' => CHtml::listData($categories, 'id', 'name'),
            'airlines' => $this->getAirlines(true)
        ));
    }

    public function actionMulticity() {
        $model = new MulticityForm();
        $model->form_type = MulticityForm::TYPE_MULTICITY;

        $post = Yii::app()->request->getPost('MulticityForm', false);

        if ($post) {
            echo Utils::dbg($post);
            die;
        } else {
            $model->way = MulticityForm::MULTICITY;
            $model->depart = date('Y-m-d');

            $model->adults = 1;
            $model->children = 0;
            $model->infants = 0;

            $model->source = 1236;
            $model->destination = 946;
        }

        $categories = CabinType::model()->findAll();
        $cities = array();

        $initSrc = Airport::model()->findByPk($model->source);
        $country = Country::model()->find('code = ?', array($initSrc->country_code));
        $cities[$initSrc->id] = $initSrc->city_name . ', ' . $country->name . ' (' . $initSrc->airport_code . ')';

        $initDes = Airport::model()->findByPk($model->destination);
        $country = Country::model()->find('code = ?', array($initDes->country_code));
        $cities[$initDes->id] = $initDes->city_name . ', ' . $country->name . ' (' . $initDes->airport_code . ')';

        $this->pageTitle = Yii::app()->name . ' - Multi city';
        $this->render('multicity', array(
            'model' => $model,
            'airports' => '/booking/searchAirport',
            'cities' => $cities,
            'categories' => CHtml::listData($categories, 'id', 'name'),
            'airlines' => $this->getAirlines(true)
        ));
    }

    public function actionSearchAirport() {
        $keyword = strtolower(CPropertyValue::ensureString(Yii::app()->request->getParam('term')));

//        $c = new CDbCriteria();
//        $c->select = 't.id, t.city_name, t.city_code, c.name AS country_code, airport_code, airport_name, is_top';
//        $c->join = 'INNER JOIN ' . Country::model()->tableName() . ' AS c ON c.code = t.country_code';
//        $c->select = 't.id, t.city_name, t.city_code, c.name AS country_code, airport_code, airport_name, is_top';
//        $c->addSearchCondition('LOWER(airport_name)', $keyword);
//        $c->addSearchCondition('LOWER(airport_code)', $keyword, 'OR');
//        $c->addSearchCondition('LOWER(city_name)', $keyword, true, 'OR');
//        $c->limit = 30;
//        $c->order = 'is_top DESC, t.city_name ASC';
//        $airports = Airport::model()->cache(120)->findAll($c);
        $airports = \Airport::model()->findAllBySql("SELECT t.id, t.city_name, t.country_code, t.airport_code, t.airport_name, t.is_top "
                . "FROM airport t "
                . "WHERE t.is_top > -1 AND "
                . "( LOWER(t.airport_code) = :keyword OR "
                . "LOWER(t.city_name) LIKE :keywordLike OR "
                . "LOWER(t.airport_name) LIKE :keywordLike ) "
                . "ORDER BY t.is_top DESC, t.city_name ASC "
                . "LIMIT 30;", [
            ":keyword" => $keyword,
            ":keywordLike" => $keyword . "%",
        ]);

        $list = array();
        $marked = false;
        if ($airports && $airports[0]->is_top > 0) {
            $hasSeparator = true;
        } else {
            $hasSeparator = false;
        }
        foreach ($airports as $airport) {
            /* @var $airport \Airport */
//            if (stripos($airport->airport_name, 'All airport')) {
//                $code = $airport->airport_name;
//            } else {
//                $code = $airport->country_code;
//            }
            $lbl = "$airport->city_name, $airport->country_code - $airport->airport_name ($airport->airport_code)";

//            if ($idx !== 0 && $airport->is_top === 0 && !$marked) {
            if ($hasSeparator && $airport->is_top === 0 && !$marked) {
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

    /**
     *
     * @param boolean $is_inter
     * @return array
     */
    protected function getAirlines($is_inter = false) {
        $con = array('order' => 'name');
        if (!$is_inter) {
            $con['condition'] = 'is_domestic=1';
        }
        $airlines = Carrier::model()->findAll($con);
        $listAirlines = CHtml::listData($airlines, 'id', 'name');

        return $listAirlines;
    }

    /**
     * get airport list
     * @return array
     */
    protected function getAirport($country_code = 'IN') {
        $orderBy = 'is_top DESC, airport_code ASC';
        $airports = Airport::model()->findAll([
            'select' => 'id, city_code, city_name, airport_code',
            'condition' => 'country_code=\'' . $country_code . '\'',
            'order' => $orderBy
        ]);

        $list = array();
        $cities = array();

        foreach ($airports as $idx => $item) {
            $lbl = $item->city_name . ' (' . $item->airport_code . ')';
            $list[] = [
                'label' => $lbl,
                'value' => $lbl,
                'id' => $item->id
            ];

            $cities[$item->id] = $lbl;

            if ($idx == 7) {
                $list[] = [
                    'label' => '-----------------',
                    'value' => ''
                ];
            }
        }

        return [$list, $cities];
    }

    public function actionBooking($id) {
        $this->layout = 'nosidebar';
        $this->render('//common/js', ['module' => 'air-journey']);

//        if (!isset(\Yii::app()->session[$id])) {
//            \Utils::finalMessage('Journey is no longer available.');
//        }
//
//        $journey = B2c::journey($id);
//        if (!$journey) {
//            \Utils::finalMessage('Incorrect journey parameters.');
//        }
//
//        if (!$journey->payment) {
//            $auth = new \BookingAuthForm();
//            if (!\Yii::app()->user->isGuest) {
//                $user = \Users::model()->findByPk(\Yii::app()->user->id);
//
//                $auth->user_id = $user->id;
//                $auth->user_info_id = $user->user_info_id;
//                $auth->email = $user->email;
//                $auth->mobile = $user->mobile;
//            }
//
//            $passengers = null;
//            if (null === $journey->travelers) {
//                $passengers = [];
//                for ($i = 1; $i <= $journey->search->adults; $i++) {
//                    $t = new \Traveler();
//                    $t->traveler_type_id = \TravelerType::TRAVELER_ADULT;
//                    $passengers[] = $t;
//                }
//
//                for ($i = 1; $i <= $journey->search->children; $i++) {
//                    $t = new \Traveler();
//                    $t->traveler_type_id = \TravelerType::TRAVELER_CHILD;
//                    $passengers[] = $t;
//                }
//
//                for ($i = 1; $i <= $journey->search->infants; $i++) {
//                    $t = new \Traveler('infant');
//                    $t->traveler_type_id = \TravelerType::TRAVELER_INFANT;
//                    $passengers[] = $t;
//                }
//            } else
//                $passengers = $journey->travelers;
//
//
//            $this->render('book_form', [
//                'journey' => $journey,
//                'auth' => $auth,
//                'passengers' => $passengers,
//                'travelers' => \Yii::app()->user->isGuest ? [] : \Users::model()->findByPk(\Yii::app()->user->id)->userInfo->travelers,
//                'titles' => \TravelerTitle::model()->findAll()
//                    ]
//            );
//        } else {
//            $this->render('booking/book', [
//                'journey' => $journey
//                    ]
//            );
//        }
    }

}
