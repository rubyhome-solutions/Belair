<?php

use application\components\OneClickBooking;
use application\components\Cluster;

class Api3dController extends Controller {

    private $disabled = false;
    private $disable_one_click = false; // true => disabled on live

    const DISABLED_MESSAGE = 'The API is temporarly disabled. Contact Belair for the details.';

    /**
     * @var string the default layout for the views. Defaults to '//layouts/column1', meaning
     * using two-column layout. See 'protected/views/layouts/column1.php'.
     */
    public $layout = '//layouts/column1';

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
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return [
            ['allow',
                'actions' => ['search', 'searchlink', 'checkAvailability', 'book', 'bookingStatus', 'cancelBooking'],
                'users' => ['*'],
            ],
            ['allow',
                'actions' => ['admin', 'stop', 'start', 'updateClientSource', 'create'],
                'expression' => 'Authorization::getIsTopStaffLogged()'
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    public function actionSearchlink() {
        // Do not proceed if the API is disabled
        if ($this->disabled) {
            \Utils::finalMessage(self::DISABLED_MESSAGE);
        }
        $request = \Yii::app()->request;
        $booking = null;

        $s = $request->getQuery('s');
        //One Click API Support
        $request_type = $request->getQuery('request_type');

        $rcs = json_decode($request->getQuery('rc', "[]"));
        $clientSource = (int) $request->getQuery('cs');
        $currency = $request->getQuery('cur');
        $currencies = ['INR', 'USD', 'EUR', 'GBP', 'AUD', 'JPY', 'CAD', 'RUB', 'AED'];
        if (empty($currency)) {
            $currency = "INR";
        } else {
            if (!in_array($currency, $currencies)) {
                $currency = "INR";
            }
        }

        if (empty($request_type)) {
            if (empty($s)) {
                \Utils::finalMessage('The s element is missing! Operation stopped');
            }

            if (empty($rcs)) {
                \Utils::finalMessage('The rc element is missing! Operation stopped');
            }

            if (empty($clientSource)) {
                \Utils::finalMessage('The cs element is missing! Operation stopped');
            }

            if (!YII_DEBUG) {
                $timeStamp = $request->getQuery('ts', null);
                if ($timeStamp === null) {
                    \Utils::finalMessage('The ts element is missing!  Operation stopped');
                } elseif ((int) $timeStamp < time() - 3600) { // Up to 1H older is OK
                    \Utils::finalMessage('This DeepLink request is too old and is no longer valid!');
                } elseif ((int) $timeStamp > time()) { // TS is in the future
                    \Utils::finalMessage('The ts element is invalid! ' . time());
                }
            }
        }
        if ($request_type === 'one_click') {
            $this->validateOneClick($request, $s, $rcs, $clientSource);
        }
        try {
            if (empty($request_type) || $request_type === 'one_click') {
                $search = \Searches::model()->findByPk($s);
                $routes = [];
                foreach ($rcs as $ids) {
                    $routes[] = \RoutesCache::model()->findAllByPk($ids);
                }

                $flight = \b2c\models\Flight::create($search, $routes, $clientSource);
                $booking = \b2c\models\Booking::create([$flight], null, $currency)->persist();
            }
            $this->layout = '//layouts/plain';
            if ($request_type === 'one_click') {
                $oneClickObj = $this->oneClickBooking($clientSource);
                if ($oneClickObj === null) {
                    \Utils::jsonResponse(['code' => 400, 'msg' => 'Your request is not valid']);
                }
                $this->ocTempBookApi($request, $oneClickObj, $booking);
            } else {
                $this->render('progress', ['booking' => $booking]);
            }
        } catch (Exception $e) {
            if (!empty($request_type)) {
                \Utils::dbgYiiLog($e->getTrace());
                \Utils::jsonResponse(['code' => $e->getCode(), 'msg' => $e->getMessage(), 'details' => $e->getPrevious()]);
            } else {
                \Utils::finalMessage('Your DeepLink request is not valid');
            }
        }
    }

    private function ocTempBookApi($request, $oneClickObj, $booking) {
        // Do not execute on Live Server
        if (!YII_DEBUG) {
            $this->disable_one_click = true;
        }
        if ($this->disable_one_click) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'API is disabled.']);
        }

        //One Click API Support
        $one_click_data = $request->getPost('px_json');

        if (empty($one_click_data)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The px_json element is missing! Operation stopped']);
        }
        try {
            if ($oneClickObj !== null) {
                $oneClickObj->completeStep1AndStep2($one_click_data, $booking);
            }
        } catch (Exception $e) {
            if (!empty($one_click_data) && $oneClickObj !== null) {
                \Utils::dbgYiiLog($e->getTrace());
                \Utils::jsonResponse(['code' => $e->getCode(), 'msg' => $e->getMessage(), 'details' => $e->getPrevious()]);
            } else {
                \Utils::jsonResponse(['code' => 400, 'msg' => 'Your DeepLink request is not valid']);
            }
        }
    }

    /**
     * Added By Satender
     * Purpose: To decide either one click or deeplink
     * @param type $clientSource
     * @return boolean
     */
    private function oneClickBooking($clientSource) {
        if ($clientSource === \ClientSource::SOURCE_IXIGO) {
            return new OneClickBooking\Ixigo();
        }
        return null;
    }

    private function validateOneClick($request, $s, $rcs, $clientSource) {
        if (!Yii::app()->request->isPostRequest) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The request method should be POST only']);
        } else if (empty($s)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The s element is missing! Operation stopped']);
        } else if (empty($rcs)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The rc element is missing! Operation stopped']);
        } else if (empty($clientSource)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The cs element is missing! Operation stopped']);
        }

        if (!YII_DEBUG) {
            $timeStamp = $request->getQuery('ts', null);
            if ($timeStamp === null) {
                \Utils::jsonResponse(['code' => 400, 'msg' => 'The ts element is missing! Operation stopped']);
            } elseif ((int) $timeStamp < time() - 3600) { // Up to 1H older is OK
                \Utils::jsonResponse(['code' => 400, 'msg' => 'This DeepLink request is too old and is no longer valid!']);
            } elseif ((int) $timeStamp > time()) { // TS is in the future
                \Utils::jsonResponse(['code' => 400, 'msg' => 'The ts element is invalid! ' . time()]);
            }
        }
    }

    private function _validateRequest() {
        // Do not execute on Live Server
        if (!YII_DEBUG) {
            $this->disable_one_click = true;
        }
        if ($this->disable_one_click) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'API is disabled.']);
        }
        if (!Yii::app()->request->isPostRequest) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The request method should be POST only']);
        }
    }

    private function _getBooking() {
        $this->_validateRequest();
        $request = \Yii::app()->request;
        $booking_id = $request->getPost('book_id');
        if (empty($booking_id)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The book_id element is missing! Operation stopped']);
        }
        $booking = \Yii::app()->cache->get($booking_id);
        if ($booking === false) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'Your booking is no longer valid!']);
        }
        return $booking;
    }

    public function actionBook() {
        $booking = $this->_getBooking();

        $url = \Yii::app()->request->hostInfo . \Yii::app()->createUrl('/b2c/booking', array('id' => $booking->id));
        \Utils::jsonResponse(['code' => 200, 'message' => 'Success', 'payment_url' => $url]);
    }

    public function actionCheckAvailability() {
        $request = \Yii::app()->request;
        $callback_url = $request->getPost('callback_url');
        $ref_id = $request->getPost('ref_id');

        if (empty($callback_url)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The callback_url element is missing! Operation stopped']);
        } else if (empty($ref_id)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The ref_id element is missing! Operation stopped']);
        }
        $booking = $this->_getBooking();
        $booking->callback_url = $callback_url;
        $booking->ref_id = $ref_id;
        $booking->persist();

        $booking_log = \BookingLog::model()->findByAttributes(['ref_id' => $booking->ref_id]);
        if ($booking_log !== null && $booking_log->booking_id !== $booking->id) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'ReferenceID already exist for another booking! Operation stopped']);
        }

        $booking_log = \BookingLog::model()->findByAttributes(['booking_id' => $booking->id]);
        if ($booking_log === null) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'Invalid OneClick Booking ID! Operation stopped']);
        }

        $booking_log->ref_id = $booking->ref_id;
        $booking_log->callback_url = $booking->callback_url;
        $booking_log->update(['ref_id', 'callback_url']);

        \Yii::app()->cache->set($booking->id, $booking, 1200);
        try {
            if (!\b2c\components\FlightsBooking::checkAvailabilityAndFares($booking)) {
                \Utils::jsonResponse(['code' => 400, 'msg' => 'Sorry! The booking you have chosen is no longer available with the airline. Please select another flight ']);
            }

            \Utils::jsonResponse(['code' => 200, 'msg' => 'You can proceed further']);
        } catch (Exception $e) {
            \Utils::dbgYiiLog($e->getTrace());
            \Utils::jsonResponse(['code' => 400, 'msg' => $e->getMessage(), 'details' => $e->getErrors()]);
        }
    }

    private function _getCart() {
        $this->_validateRequest();

        $request = \Yii::app()->request;
        $booking_id = $request->getPost('book_id');
        if (empty($booking_id)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'The book_id element is missing! Operation stopped']);
        }

        $booking_log = \BookingLog::model()->findByAttributes(['booking_id' => $booking_id]);
        if ($booking_log === null) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'Invalid OneClick Booking ID! Operation stopped']);
        } else if (empty($booking_log->air_cart_id)) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'Booking is not performed by user! Operation stopped']);
        } else if ($booking_log->is_one_click === 0) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'Invalid OneClick BookingID! Operation stopped']);
        }
        $cart = \AirCart::model()->findByPk($booking_log->air_cart_id);
        if ($cart === null) {
            \Utils::jsonResponse(['code' => 400, 'msg' => 'Invalid OneClick Booking! Operation stopped']);
        }

        return $cart;
    }

    public function actionBookingStatus() {
        $cart = $this->_getCart();

        $response = [
            'code' => 200,
            'booking' => [
                'status' => $cart->bookingStatus->name,
                'msg' => str_replace('{REFERENCE}', '', $cart->bookingStatus->message)
            ],
            'payment' => [
                'status' => !empty($cart->payments) ? 'Success' : 'Failed'
            ]
        ];

        \Utils::jsonResponse($response);
    }

    public function actionCancelBooking() {
        $cart = $this->_getCart();

        \CartStatusLog::push_cart_status_log($cart->id, $cart->booking_status_id, \CartStatus::CART_STATUS_TO_CANCEL);
        $cart->addNote("Cart status set to " . \CartStatus::$cartStatusMap[\CartStatus::CART_STATUS_TO_CANCEL]);

        \Utils::jsonResponse(['code' => 200, 'msg' => 'Booking sent for cancellation. CC Executive will contact to Customer.']);
    }

    /**
     * SkySkanner Deeplink API
     */
    public function actionSearch($id = null) {
        // Do not proceed if the API is disabled
        if ($this->disabled) {
            \Utils::jsonResponse(['error' => self::DISABLED_MESSAGE]);
        }

        if ($id !== null) {
            $search = \Searches::model()->findByPk($id);
            if ($search === null) {
                echo "Wrong input data!";
            } else {
                $search->client_source_id = (int) \Yii::app()->request->getQuery('cs', \ClientSource::SOURCE_DIRECT);

                $url = strtr(
                    '/b2c/flights/search/:domestic/:category/:adults,:children,:infants;:origin-:destination/:dates?cs=:cs', [
                    ':cs' => $search->client_source_id,
                    ':domestic' => $search->is_domestic ? 'd' : 'i',
                    ':category' => $search->category,
                    ':adults' => $search->adults,
                    ':children' => $search->children,
                    ':infants' => $search->infants,
                    ':origin' => $search->origin,
                    ':destination' => $search->destination,
                    ':dates' => $search->date_return ? ($search->date_depart . '/' . $search->date_return) : $search->date_depart
                    ]
                );


                $this->redirect($url);
            }
            Yii::app()->end();
        }
        \Yii::app()->session->close();
        \Utils::jsonHeader();
        // Parse and validate the input
        $input = json_decode(\Yii::app()->request->getRawBody(), true);
        if (!is_array($input)) {
            echo '{"error": "Wrong input data"}';
            \Yii::app()->end();
        }

        $ip = Cluster::distributeLoad();
        if ($ip !== false) {
            // Slave labor
            $input['hostInfo'] = \Yii::app()->request->hostInfo;
            echo Cluster::slaveLabor($ip, $input);
        } else {
            // Use the main node services
            $fsr = new application\components\client_sources\DeepLink\FlightSearchRequest;
            \Utils::setAttributes($fsr, $input);
            if (!$fsr->validate()) {
                echo '{"error": "' . $fsr->validationErrors . '"}';
                \Yii::app()->end();
            }
            echo $fsr->results();
            flush();
            ob_flush();
            \Yii::app()->end();
        }
    }

    /**
     * Manages all models.
     */
    public function actionAdmin() {
        $model = new ClientSource('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['ClientSource'])) {
            $model->attributes = $_GET['ClientSource'];
        }

        $this->render('admin', ['model' => $model]);
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return ClientSource the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = ClientSource::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    /**
     * Disable client source
     * @param int $id The id of the ClientSource
     */
    public function actionStop($id) {
        $model = $this->loadModel($id);
        $model->is_active = 0;
        $model->update(['is_active']);
        $this->redirect('/api3d/admin');
    }

    /**
     * Disable client source
     * @param int $id The id of the ClientSource
     */
    public function actionStart($id) {
        $model = $this->loadModel($id);
        $model->is_active = 1;
        $model->update(['is_active']);
        $this->redirect('/api3d/admin');
    }

    public function actionUpdateClientSource() {
        $id = Yii::app()->request->getPost('id');
        $name = Yii::app()->request->getPost('name');
        $value = Yii::app()->request->getPost('value');

        $model = $this->loadModel($id);
        if ($model) {
            $p = new CHtmlPurifier();
            $model->{$name} = $p->purify($value);
            $model->update([$name]);
        }
    }

    /**
     * Creates new ClientSource record.
     */
    public function actionCreate() {
        if (isset($_POST['NEW'])) {
            $model = new \ClientSource;
            $model->attributes = $_POST['NEW'];
            $model->is_active = 0;
            $model->component = 'DeepLink';
            if (!$model->validate()) {
                $errors = $model->errors;
                echo print_r(reset($errors)[0], true);
            } else {
                $model->insert();
            }
        }
    }

}
