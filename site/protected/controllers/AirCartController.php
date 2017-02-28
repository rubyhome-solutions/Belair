<?php

class AirCartController extends Controller {

    /**
     * @var string the default layout for the views. Defaults to '//layouts/column1', meaning
     * using two-column layout. See 'protected/views/layouts/column1.php'.
     */
    public $layout = '//layouts/column1';
    private $payment_request_reason = [
        1 => 'Fare Difference',
        2 => 'Reschedule',
        3 => 'Other'
    ];

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
        return array(
            ['allow',
                'actions' => ['updateAirbooking', 'updateAirbookingTraveler'],
                'expression' => 'Authorization::getIsSuperAdminLogged()'
            ],
            ['allow',
                'actions' => ['fraud','abortCart'],
                'expression' => 'Authorization::getIsTopStaffLogged()'
            ],
            array('allow',
                'actions' => array('fraud', 'abortCart', 'defineAmendment', 'addNote', 'uploadFile', 'download', 'delFile', 'updateInvoice', 'changeTheme', 'equalize', 'manualBooking', 'claimCart', 'unClaimCart', 'amendCancel', 'amendFareDiff', 'abortFareDiff', 'resendMail', 'amendReschedule', 'amendAddPax', 'amendUpdateTicket', 'senddocEmail', 'sendRefundEmail', 'setCartStatus', 'getCountOfQueues', 'amendModifyRoute', 'amendDeleteRoute', 'sendSmsManual', 'screenshot', 'downloadScreenshot'),
                'expression' => 'Authorization::getIsStaffLogged()'
            ),
            array('allow', // allow authenticated user to perform 'create' and 'update' actions
                'actions' => array('create', 'view', 'update', 'print', 'asPdf', 'sendEmail', 'amend', 'abortAmendment', 'processAmendment', 'defineAmendment', 'invoiceAmendment', 'invoice', 'admin', 'search', 'byPnr', 'reSync', 'registerPayment', 'getCSCost', 'updateWebsite'),
                'users' => array('@'),
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

//    protected function beforeRender($view) {
//       if(isset(Yii::app()->session['theme'])&&Yii::app()->session['theme']=='admin'){
//            Yii::app()->setTheme('admin');
//            if(($theme=\Yii::app()->getTheme())!==null && ($viewFile=$theme->getViewFile($this,$view))!==false){
//
//            }else{
//                Yii::app()->setTheme('');
//            }
//        }else if(\Yii::app()->getTheme()===null){
//            Yii::app()->setTheme('');
//        }
//
//        return true;
//    }

    /**
     * Displays a particular AirCart.
     * @param integer $id the ID of the model to be displayed
     */
    public function actionView($id) {

        $model = $this->loadModel($id);
// Permission check
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
            Utils::finalMessage('You do not have authorization to view this airCart');
        }
        if (empty($model->airBookings)) {
            \Utils::finalMessage('This cart do not have any bookings');
        }
        $payments = Payment::model()->findAllBySql('
          SELECT p1.* FROM payment p1 WHERE p1.air_cart_id = :cartId
          UNION
          SELECT p2.* FROM payment p2
          JOIN amendment on (amendment.payment_id = p2.id)
          JOIN air_booking ab on (ab.id = amendment.air_booking_id)
          WHERE ab.air_cart_id = :cartId
          ORDER BY id;
          ', [':cartId' => $model->id]);


        $this->render('view', [
            'model' => $model,
            'payments' => $payments,
        ]);
    }

    /**
     * Mark all transactions for the card as fraud.
     * @param integer $id the ID of the cart
     */
    public function actionFraud($id) {
        $model = $this->loadModel($id);
        $model->fraud((bool) Yii::app()->request->getPost('flag'));

        $this->redirect('/airCart/view/' . $id);
    }

    /**
     * Send the AirCart as pdf file
     * @param integer $id AirCart ID
     */
    public function actionAsPdf($id) {
        $model = $this->loadModel($id);
        if ($model->user->userInfo->user_type_id === \UserType::clientB2C) {

            Yii::app()->pdf->send(\Controller::B2C_BASE_URL . "/b2c/airCart/mybookings/" . $id . "#print", "E-ticket_$id.pdf");
        } else {
            Yii::app()->pdf->send(Yii::app()->request->hostInfo . "/airCart/view/$id", "E-ticket_$id.pdf");
        }
    }

    /**
     * Send the AirCart as pdf file attached in email
     * @param integer $id AirCart ID
     */
    public function actionSendEmail($id) {
        $model = $this->loadModel($id);
        $usermail = \Yii::app()->request->getPost('email'); //$model->user->email;
        if ($usermail === null) {
            $usermail = $model->user->userInfo->email;
        }
        if ($model->isFraud()) {
            return;
        }
        if ($model->user->userInfo->user_type_id === \UserType::clientB2C) {
            $model->sendBookedEmailforB2C($usermail);
        } else {
            $model->sendBookedEmailforOther($usermail);
        }
    }

//        $file = Yii::app()->pdf->save(Yii::app()->request->hostInfo . "/airCart/view/$id", "E-ticket_$id.pdf");
//
//        $model = $this->loadModel($id);
//        // $usermail=  $model->user->email;
//
//        $bookingdate = date(TICKET_DATETIME_FORMAT, strtotime($model->created));
//        $from = 'BelAir <support2@air.belair.in>';
//        $fromemail='support2@air.belair.in';
//        $email_content = $model->getSummaryWithDetailsforEmail();
//        $statusmsg = "Your ticket has been booked successfully";
//        if ($model->bookingStatus->id == \BookingStatus::STATUS_IN_PROCESS)
//            $statusmsg = "Your Booking is Under Process. Our team is working on confirming your booking and will revert shortly. This process can take anywhere between 30 minutes to upto 2 hours. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
//        else if ($model->bookingStatus->id == \BookingStatus::STATUS_NEW)
//            $statusmsg = "We have not received confirmation against this booking reference №. " . $model->id;
//        else if ($model->bookingStatus->id == \BookingStatus::STATUS_HOLD)
//            $statusmsg = "Your booking reference № " . $model->id . " is On Hold. Airline has authority to cancel booking any time. Our team is working on confirming your booking and will revert shortly. This process can take anywhere between 30 minutes to upto 2 hours. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
//        else if ($model->bookingStatus->id == \BookingStatus::STATUS_ABORTED)
//            $statusmsg = "Your booking reference № " . $model->id . " is aborted due to non availability. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
//        else if ($model->bookingStatus->id == \BookingStatus::STATUS_TO_CANCEL)
//            $statusmsg = "Your cancellation request has been received and it is currently under process. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
//        else if ($model->bookingStatus->id == \BookingStatus::STATUS_CANCELLED)
//            $statusmsg = "Your cancellation request has been complete. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
//        else if ($model->bookingStatus->id == \BookingStatus::STATUS_PARTIALLY_BOOKED)
//            $statusmsg = "Your booking reference № " . $model->id . " is In Process, but one or more item/s is/are still not confirmed. Incase you have any questions please email us on CS@CheapTicket.in or call us on +91-120-4887777 ";
//        else if ($model->bookingStatus->id == \BookingStatus::STATUS_BOOKED)
//            $statusmsg = "Your ticket has been booked successfully";
//        $email_content = '<html>Dear ' . $model->user->name . ',<br><br>
//
//    ' . $statusmsg . '<br><br>
//    <table  width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
//      <tr>
//        <td colspan="2" style="border-bottom:1px solid #0061aa">
//          <table width="100%" border="0" cellspacing="0" cellpadding="0">
//            <tbody>
//              <tr>
//                <td width="61.57%" align="left" valign="top">
//                  <span style="font-family:arial;font-size:26px;color:#000000;font-weight:bold">E-Ticket-' . $model->bookingStatus->name . '</span>
//                  <br />
//                  <span style="font-family:arial;font-size:15px;color:#000000;font-weight:normal">
//                  <span class="il">BelAir</span> Booking ID - ' . $model->id . '
//                  </span>
//                  <br />
//                  <span style="font-family:arial;font-size:12px;color:#000000;font-weight:normal">Booking Date - ' . $bookingdate . '
//                  </span>
//                </td>
//                <td width="38.43%" align="right" valign="top">
//                  <img src="' . Yii::app()->request->hostInfo . '/img/belair_logo_50px.jpg"
//                  width="172" height="68" class="CToWUd" />
//                </td>
//              </tr>
//              <tr>
//                <td colspan="2" height="5"></td>
//              </tr>
//            </tbody>
//          </table>
//        </td>
//      </tr>
//      <tr>
//        <td height="45" colspan="2" style="font-family:arial;font-size:18px;color:#000000;font-weight:bold">Itinerary and
//        Reservation Details</td>
//      </tr>' . $email_content . '
//
//    </table><br>
//    </html>';
//        $subject = 'BelAir E-Ticket Booking Id: ' . $model->id;
//        //\Utils::dbgYiiLog($email_content);
//        \Utils::sendMailWithAttachment($file, "E-ticket_$id.pdf", $usermail, $from, $email_content, $subject,$fromemail);


    public function actionSenddocEmail($id) {
        $model = $this->loadModel((int) $id);
        if ($model->isFraud()) {
            return;
        }
        $usermail = \Yii::app()->request->getPost('email'); //$model->user->email;
        if (!empty($usermail)) {
            $model->senddocEmail($usermail);
            $model->addNote("Email for docs sent to " . $usermail);
            \CartStatusLog::push_cart_status_log($model->id, $model->booking_status_id, \CartStatus::CART_STATUS_ASK_DOCS);
        }
    }

    public function actionSendRefundEmail($id) {
//  \Utils::dbgYiiLog($_POST);
        $model = $this->loadModel((int) $id);
        if ($model->isFraud()) {
            return;
        }
        $usermail = \Yii::app()->request->getPost('email');
        $refund_amount = \Yii::app()->request->getPost('refund_amount');
        $reference_number = \Yii::app()->request->getPost('reference_number');
        if (!empty($usermail) && (!empty($refund_amount)) && (!empty($reference_number))) {
            $model->sendRefundEmail($usermail, $refund_amount, $reference_number);
            $model->addNote("Refund Email sent to " . $usermail);
        }
    }

    public function actionAddNote($id) {
        if (!Authorization::getIsStaffLogged()) {
            Utils::finalMessage('You do not have the requred permission to do this operation. This area is reserverd for Staff members only');
        }
        $model = $this->loadModel($id);
        $note = Yii::app()->request->getPost('noteText');
        if ($note) {
            $model->addNote($note);
        }
        $this->renderPartial('_notes_2', ['model' => $model]);
    }

    /**
     * Manually creates new AirCart by Pnr acquisition
     */
    public function actionByPnr() {
// Only staff members can create manual carts
        if (!Authorization::getIsStaffLogged()) {
            Utils::finalMessage('You do not have the requred permission to do this operation. This area is reserverd for Staff members only');
        }

        $userId = Utils::getActiveUserId();
        if ($userId === false) {
            Yii::app()->user->setFlash('msg', 'Please pick a user or company, before you can manually import PNRs!');
            $this->redirect('/users/manage');
        }
        Yii::import('application.models.forms.PnrForm');
        $model = new PnrForm;

        if (isset($_POST['PnrForm'])) {
            $model->attributes = $_POST['PnrForm'];
            $model->pnr = strtoupper($model->pnr);
            $this->performAjaxValidation($model);
            if ($model->validate()) {
                // Import the PNR
                $airSource = AirSource::model()->with('backend')->findByPk($model->airSourceId);
                $result = call_user_func($airSource->backend->pnr_acquisition, $model->pnr, $model->airSourceId);
                if (!empty($result['message'])) {
                    if (strstr($result['message'], 'INVALID RECORD LOCATOR')) {
                        $result['message'] = 'Invalid PNR';
                    }
                    $model->addError('pnr', $result['message']);
                } else {
                    $airCart = \AirCart::model()->findByPk((int) $result['airCartId']);

                    $airCart->setAirBookingsAndAirRoutesOrder();
                    $airCart->applyBothRules();
                    $airCart->setBookingStatus(true);
                    $airCart->addNote('Manual PNR acquisition via ' . $airSource->name);
                    $airCart->website_id = $model->website_id;
                    $airCart->update(['website_id']);
                    $this->redirect('/airCart/view/' . $result['airCartId']);
                }
            }
        }

        $listAirSources = CHtml::listData(AirSource::model()->findAllBySql(
                    "SELECT air_source.* FROM air_source
            JOIN backend ON (air_source.backend_id=backend.id)
            WHERE backend.pnr_acquisition is NOT NULL AND backend.pnr_acquisition<>''
            ORDER BY air_source.name"), 'id', 'name');
        $this->render('pnr_acquisition', ['model' => $model, 'listAirSources' => $listAirSources]);
    }

    public function actionReSync($id) {
        Utils::jsonHeader();
        $model = AirCart::model()->findByPk($id);
        /* @var $model AirCart */
        if ($model === null) {
            echo json_encode(['error' => 'The requested airCart do not exist']);
            Yii::app()->end();
        }
        if (empty($model->airBookings)) {
            echo json_encode(['error' => 'The requested airCart do not have any bookings']);
            Yii::app()->end();
        }
// Permission check
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
            echo json_encode(['error' => 'You do not have authorization to manipulate this airCart']);
            Yii::app()->end();
        }

        \Yii::import('application.commands.SupportCommand');
        echo json_encode(\SupportCommand::resyncCart($model->id), JSON_NUMERIC_CHECK);
    }

    public function actionRegisterPayment($id) {
        $model = $this->loadModel($id);
// Permission check
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
            \Utils::finalMessage('You do not have authorization to manipulate this airCart');
        }
// Register the payment
        $res = $model->registerPayment();
        if ($res !== true) {
            \Utils::finalMessage($res);
        }
        $this->redirect('/airCart/' . $model->id);
    }

    public function actionUpdateInvoice($id) {
        $model = $this->loadModel($id);
// Permission check
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
//\Utils::finalMessage('You do not have authorization to manipulate this airCart');

            return \Utils::jsonResponse(['error' => 'You do not have authorization to manipulate this airCart']);
        }
//Update Invoice
// \Utils::dbgYiiLog(Yii::app()->request->getPost('invoiceno'));
        $model->invoice_no = Yii::app()->request->getPost('invoiceno');
        $model->save(false);
        return \Utils::jsonResponse(['success' => 'true']);
    }

    public function actionUpdateWebsite($id) {
        $model = $this->loadModel($id);
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
            return \Utils::jsonResponse(['error' => 'You do not have authorization to manipulate this airCart']);
        }
        $model->addNote('Website ' . \AirCart::$websiteMap[$model->website_id] . ' changed to ' . \AirCart::$websiteMap[Yii::app()->request->getPost('website_id')]);
        $model->website_id = Yii::app()->request->getPost('website_id');
        $model->save(false);
        return \Utils::jsonResponse(['success' => 'true']);
    }

    /**
     * Manually creates new AirCart
     */
    public function actionCreate() {
// Only staff members can create manual carts
        if (!Authorization::getIsStaffLogged()) {
            Utils::finalMessage('You do not have the requred permission to do this operation. This area is reserverd for Staff members only');
        }

        $userId = Utils::getActiveUserId();
        if ($userId === false) {
            Yii::app()->user->setFlash('msg', 'Please pick a user or company, before you can manually create new cart!');
            $this->redirect('/users/manage');
        }

        $model = new AirCart('manual');
        $model->user_id = $userId;
        $model->loged_user_id = Utils::getLoggedUserId();

        $airBookings = array();
        $travelers = array();
// We have data submitted - process it
        if (isset($_POST['AirBooking']) && isset($_POST['Traveler'])) {
            $isValid = true;
// Travelers processing
            foreach ($_POST['Traveler'] as $postTraveler) {
                $traveler = new Traveler;
                if (!empty($postTraveler['id'])) {
                    $traveler = $traveler->findByPk((int) $postTraveler['id']);
                }
                $traveler->attributes = $postTraveler;
                if ($traveler->traveler_type_id == TravelerType::TRAVELER_INFANT) {
                    $traveler->setScenario('infant');
                }
                if ($traveler->validate()) {
                    $traveler->save();
                } else {
                    $isValid = false;
                }
                $travelers[] = $traveler;
            }
            $travelersCount = count($travelers);
// How many legs we are preparing
            $legs = $_POST['legs'];
            $travelerKey = 0;
            foreach ($_POST['AirBooking'] as $key => $booking) {
//                Yii::log(print_r($booking, true));
                if (isset($booking['AirRoutes'])) {
                    $airRoutes = array();
                    foreach ($booking['AirRoutes'] as $key2 => $airRoutePost) {
                        $airRoute = new AirRoutes;
                        $airRoute->attributes = $airRoutePost;
                        $airRoute->order_ = $key2 + 1;
                        $airRoute->setScenario('preInsert');
                        $isValid &= $airRoute->validate();
//                    Yii::log(print_r($airRoute, true));
                        $airRoutes[$key2] = $airRoute;
                    }
                } else { // Copy the first AirRoute for the leg
                }
                unset($booking['AirRoutes']);
                $airBooking = new AirBooking;
                $airBooking->attributes = $booking;
// Dublicate the carrier_id atribute where missing
                if (isset($booking['carrier_id'])) {
                    $carrier_id = (int) $booking['carrier_id'];
                } else {
                    $airBooking->carrier_id = $carrier_id;
                }
                $airBooking->traveler_id = isset($travelers[$travelerKey]->id) ? $travelers[$travelerKey]->id : null;
                $airBooking->traveler_type_id = $travelers[$travelerKey]->traveler_type_id;
// reset the Travelers index
                $travelerKey++;
                if ($travelerKey == $travelersCount) {
                    $travelerKey = 0;
                }
                $maxAirRoutes = count($airRoutes) - 1;
                if (!empty($airRoutes[0]->source_id) && !empty($airRoutes[$maxAirRoutes]->destination_id) &&
                    !empty($airRoutes[0]->departure_ts) && !empty($airRoutes[$maxAirRoutes]->arrival_ts)) {
                    $airBooking->source_id = $airRoutes[0]->source_id;
                    $airBooking->departure_ts = $airRoutes[0]->departure_ts;
                    $airBooking->destination_id = $airRoutes[$maxAirRoutes]->destination_id;
                    $airBooking->arrival_ts = $airRoutes[$maxAirRoutes]->arrival_ts;
                } else {
                    $airBooking->source_id = Airport::AIRPORT_DELHI;
                    $airBooking->destination_id = Airport::AIRPORT_MUMBAI;
                    $airBooking->departure_ts = null;
                    $airBooking->arrival_ts = null;
                }
                $airBooking->setScenario('preInsert');
                $isValid &= $airBooking->validate();
                $airBooking->airRoutes = $airRoutes;
                $airBookings[$key] = $airBooking;
            }
        } else { // Data from the flight search form
            $bookingSearchForm = Yii::app()->user->getState('BookingSearchForm');
            if ($bookingSearchForm === null) {
                Yii::app()->user->returnUrl = '/airCart/create';
                $this->redirect('/booking');
            } else { // Clear the form from the session
                Yii::app()->user->setState('BookingSearchForm', null);
                Yii::app()->user->returnUrl = '/';
            }
            Yii::import('application.models.forms.BookingSearchForm');
            if ($bookingSearchForm['form_type'] == BookingSearchForm::TYPE_DOMESTIC) {
                $bookingType = ServiceType::DOMESTIC_AIR;
            } else {
                $bookingType = ServiceType::INTERNATIONAL_AIR;
            }
// Initialize the number of the legs
            $legs = $bookingSearchForm['way'];
// Generate our travelers
            $adults = 0;
            $children = 0;
            $infants = 0;
            $travelersCount = (int) $bookingSearchForm['adults'] + (int) $bookingSearchForm['children'] + (int) $bookingSearchForm['infants'];
            for ($i = 0; $i < $travelersCount; $i++) {
                $traveler = new Traveler;
                $traveler->user_info_id = $model->user->user_info_id;
                if ((int) $bookingSearchForm['adults'] > $adults) {
                    $traveler->traveler_type_id = TravelerType::TRAVELER_ADULT;
                    $adults++;
                } elseif ((int) $bookingSearchForm['children'] > $children) {
                    $traveler->traveler_type_id = TravelerType::TRAVELER_CHILD;
                    $children++;
                } elseif ((int) $bookingSearchForm['infants'] > $infants) {
                    $traveler->traveler_type_id = TravelerType::TRAVELER_INFANT;
                    $infants++;
                }
                $travelers[] = $traveler;
            }
// Generate our legs
            for ($legKey = 0; $legKey < $legs; $legKey++) {
                for ($i = 0; $i < $travelersCount; $i++) {
                    $airBooking = new AirBooking;
                    $airBooking->traveler_type_id = $travelers[$i]->traveler_type_id;
                    $airBooking->cabin_type_id = $bookingSearchForm['category'];
                    $airBooking->booking_type_id = BookingType::MANUAL_BOOKING;
                    $airBooking->service_type_id = $bookingType;
//                Yii::log($airBooking->traveler_type_id);
                    $airBooking->source_id = $bookingSearchForm['source'];
                    $airBooking->destination_id = $bookingSearchForm['destination'];
                    $airBooking->departure_ts = $bookingSearchForm['depart'] . " 10:00:00";
                    $airBooking->arrival_ts = $bookingSearchForm['depart'] . " 14:00:00";
// Change the source and destination if return trip
                    if ($legs == 2 && $legKey == 1) {
                        $airBooking->source_id = $bookingSearchForm['destination'];
                        $airBooking->destination_id = $bookingSearchForm['source'];
                        $airBooking->departure_ts = $bookingSearchForm['return'] . " 10:00:00";
                        $airBooking->arrival_ts = $bookingSearchForm['return'] . " 14:00:00";
                    }
                    $airRoute[0] = new AirRoutes;
                    $airRoute[0]->departure_ts = $airBooking->departure_ts;
                    $airRoute[0]->arrival_ts = $airBooking->arrival_ts;
                    $airRoute[0]->source_id = $airBooking->source_id;
                    $airRoute[0]->destination_id = $airBooking->destination_id;
                    $airBooking->airRoutes = $airRoute;
                    $airBookings[] = $airBooking;
                }
            }
        }

        if (isset($_POST['AirCart'])) {
            $model->attributes = $_POST['AirCart'];
            if ($model->validate() && $isValid) {
// Everything is validated - we can save the structures
// Save the Cart
                $model->insert();
// Save the AirBookings
                foreach ($airBookings as $airBooking) {
                    $airBooking->air_cart_id = $model->id;
                    $airBooking->insert();
// Save the AirRoutess
                    foreach ($airBooking->airRoutes as $airRoute) {
                        $airRoute->air_booking_id = $airBooking->id;
                        $airRoute->isNewRecord = true;
                        $airRoute->id = null;
                        $airRoute->insert();
                    }
                }
                $model->refresh();
                $res = $model->registerPayment();  // Try to pay the cart
                if ($res !== true) {
                    Yii::app()->user->setFlash('msg', $res);
                }
                $this->redirect(array('view', 'id' => $model->id));
            }
        }

//        Yii::log(print_r($airBookings,true));
        $this->render('create', array(
            'model' => $model,
            'airBookings' => $airBookings,
            'legs' => $legs,
            'travelers' => $travelers,
        ));
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate($id) {
        $model = $this->loadModel($id);
// Permission check
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
            Utils::finalMessage('You do not have authorization to manipulate this airCart');
        }
        if ($model->checkClaim() === false) {
            $model->addNote('Claim check failed.');
        }
        $errors = array();

//        Yii::log(print_r($_POST, true));
        if (isset($_POST['AirRoutes']['id']) && isset($_POST['AirBooking']) && $model->checkClaim() !== false) {
            $airRoute = new AirRoutes;
            $airRoute = $airRoute->findByPk($_POST['AirRoutes']['id']);
            $airBooking = $airRoute->airBooking;
            $oldAirBookingId = $airBooking->id;
            $newRecord = empty($_POST['AirBooking']['id']);
            unset($_POST['AirBooking']['id']);
            $airBooking->attributes = $_POST['AirBooking'];
            if ($airBooking->validate()) {
                if ($newRecord) {    // Save create new AirBooking and assign the AirRoute to it.
// The new booking should be without taxes
                    $airBooking->clearFareAndTaxes();
                    $airBooking->attributes = $_POST['AirBooking'];     // Except taxes assigned with the update call
                    $airBooking->isNewRecord = true;
                    $airBooking->id = null;
// Assign the common info to be equal
                    $airBooking->source_id = $airRoute->source_id;
                    $airBooking->destination_id = $airRoute->destination_id;
                    $airBooking->departure_ts = $airRoute->departure_ts;
                    $airBooking->arrival_ts = $airRoute->arrival_ts;
                    $airBooking->carrier_id = $airRoute->carrier_id;
                    $airBooking->insert();
// Create new AirRoute from the old one
//                    $airRoute->isNewRecord = true;
//                    $airRoute->id = null;
                    $airRoute->air_booking_id = $airBooking->id; // This AirRoute has new AirBooking
                    $airRoute->order_ = 1;  // The new AirBooking has single AirRoute object
                    $airRoute->save(false);
                } else {    // Modify old AirBooking
                    $airBooking->save();
                }
// Set the airCart booking status
                $model->applyBothRules();
                $model->setBookingStatus();
// Set the airBooking depart and arrive times
                $oldAirBooking = AirBooking::model()->findByPk($oldAirBookingId);
                $oldAirBooking->setDepartAndArriveTimes();
            } else {    // Validation errors place them in the errors array with ID of the AirRoute
                $errors[$airRoute->id] = TbHtml::errorSummary($airBooking, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
            }
        }
        $payments = Payment::model()->findAllBySql('
          SELECT p1.* FROM payment p1 WHERE p1.air_cart_id = :cartId
          UNION
          SELECT p2.* FROM payment p2
          JOIN amendment on (amendment.payment_id = p2.id)
          JOIN air_booking on (air_booking.id = amendment.air_booking_id)
          WHERE p2.air_cart_id = :cartId
          ORDER BY id;
          ', ['cartId' => $model->id]);

        $this->render('update', array(
            'model' => $model,
            'errors' => $errors,
            'payments' => $payments,
        ));
    }

    /**
     * Deletes a particular model.
     * If deletion is successful, the browser will be redirected to the 'admin' page.
     * @param integer $id the ID of the model to be deleted
     */
    public function actionDelete($id) {
        if (Yii::app()->request->isPostRequest) {
// we only allow deletion via POST request
            $this->loadModel($id)->delete();

// if AJAX request (triggered by deletion via admin grid view), we should not redirect the browser
            if (!isset($_GET['ajax'])) {
                $this->redirect(isset($_POST['returnUrl']) ? $_POST['returnUrl'] : array('admin'));
            }
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $dataProvider = new CActiveDataProvider('AirCart');
        $this->render('index', array(
            'dataProvider' => $dataProvider,
        ));
    }

    /**
     * Manages air carts.
     */
    public function actionAdmin() {
        $model = new AirCart('search');
        $model->unsetAttributes();  // clear any default values
        if (isset($_GET['AirCart'])) {
            $model->attributes = $_GET['AirCart'];
        } else {
            $model->queue_type = 'pending';
        }
        $this->render('admin', array(
            'model' => $model,
        ));
    }

    /**
     * actionPrint function.
     *
     * @access public
     * @param mixed $id
     * @return void
     */
    public function actionPrint($id) {

        $this->renderPartial('print', array(
            'id' => $id,
        ));
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return AirCart the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = AirCart::model()->with('user.userInfo')->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested airCart does not exist.');
        }
        return $model;
    }

    /**
     * Performs the AJAX validation.
     * @param AirCart $model the model to be validated
     */
    protected function performAjaxValidation($model) {
        if (isset($_POST['ajax']) && $_POST['ajax'] === 'air-cart-form') {
            echo CActiveForm::validate($model);
            Yii::app()->end();
        }
    }

    /**
     * Mark amendment as aborted
     * @param integer $id Amendmend group_id
     */
    public function actionAbortAmendment($id) {
        Amendment::model()->updateAll([
            'amendment_status_id' => AmendmentStatus::STATUS_CANCELLED
            ], 'group_id=:group_id', ['group_id' => $id]);

        Yii::app()->db
            ->createCommand("UPDATE air_booking SET ab_status_id = prev_ab_status_id
            FROM amendment
            WHERE amendment.group_id = :group_id AND
            amendment.air_booking_id=air_booking.id")
            ->bindValues(array(':group_id' => (int) $id))
            ->execute();

        $this->redirect('/airCart/update/' . $_POST['cart_id']);
    }

    /**
     * Mark amendment as processed with supplier
     * @param integer $id Amendmend group_id
     */
    public function actionProcessAmendment($id) {
        Amendment::model()->updateAll([
            'amendment_status_id' => AmendmentStatus::STATUS_AMENDED_WITH_SUPPLIER
            ], 'group_id=:group_id', ['group_id' => $id]);

        $this->redirect('/airCart/update/' . $_POST['cart_id']);
    }

    /**
     * Define the changes in the booking in the amendment group
     * @param integer $id Amendmend group_id
     */
    public function actionDefineAmendment($id) {

        if (Yii::app()->request->isAjaxRequest) {
            if (isset($_POST['Amendment'])) {
                $changes = '';
                $errors = array();
                $i = 0;
                foreach ($_POST['Amendment'] as $amdId => $amendment) {
// Exclude the commas from the amount
                    if (isset($amendment['amount_to_charge'])) {
                        $amendment['amount_to_charge'] = str_replace(',', '', $amendment['amount_to_charge']);
                    }
                    /* @var Amendment $oldAmendment */
                    $oldAmendment = Amendment::model()->findByPk($amdId);
                    if ($oldAmendment) {
                        $oldAirBooking = $oldAmendment->airBooking;
                        $oldAirRoute = $oldAmendment->airRoute;
                        if (isset($amendment['AirRoute'])) {
                            $oldAirRoute->cutSeconds();
                            $oldAmendment->getAmendedInfo($amendment['AirRoute'], $oldAirRoute->attributes);
                            $oldAirRoute->attributes = $amendment['AirRoute'];
                            $oldAirRoute->addSeconds();
                            unset($amendment['AirRoute']);
                            if (!$oldAirRoute->validate()) {
                                $errors[$i] = TbHtml::errorSummary($oldAirRoute, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
                            }
                            $oldAirBooking->obtainRouteInfo($oldAirRoute);
                        }
                        if (isset($amendment['AirBooking'])) {
                            $oldAmendment->getAmendedInfo($amendment['AirBooking'], $oldAirBooking->attributes);
                            $oldAirBooking->attributes = $amendment['AirBooking'];
                            unset($amendment['AirBooking']);
                            if (!$oldAirBooking->validate()) {
                                $errors[$i] = TbHtml::errorSummary([$oldAirRoute, $oldAirBooking], '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
                            }
                        }
                        $oldAmendment->getAmendedInfo($amendment, $oldAmendment->attributes);
                        $oldAmendment->attributes = $amendment;
                        if (!$oldAmendment->validate()) {
                            $errors[$i] = TbHtml::errorSummary([$oldAirRoute, $oldAirBooking, $oldAmendment], '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
                        }
                        if (empty($errors)) {   // No errors here - keep the stuff for saving
//                            if (isset($oldAirRoute))
                            $oldAmendment->airRoute = $oldAirRoute;
//                            if (isset($oldAirBooking))
                            $oldAmendment->airBooking = $oldAirBooking;
                            $tmpAmendments[] = $oldAmendment;
                        }
//                        $errors[$i] = "<table> $oldAmendment->changes </table>";
                    } else {
                        $errors[$i] = TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, "Wrong Amendment key provided");
                    }
                    $i++;
                    unset($oldAirRoute);
                    unset($oldAirBooking);
                }
            } else {
                $errors[0] = TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, "Wrong request. Amendment object is missing");
            }

            if (empty($errors)) {
// Save the stuff
//                Utils::dbgYiiLog($tmpAmendments);
                $amount = 0;
                $tds = 0;
                $sTax = 0;
                $amendmentIds = [];
                foreach ($tmpAmendments as $amendment) {
                    /* @var $amendment \Amendment */
                    $amendment->airRoute->save(false);
// Decide the AirBooking status
                    if ($amendment->amendment_type_id == AmendmentType::AMENDMENT_CANCEL) {
                        $amendment->airBooking->ab_status_id = AbStatus::STATUS_CANCELLED;
                    } else {
                        $amendment->airBooking->ab_status_id = AbStatus::STATUS_OK;
                    }
                    $amendment->airBooking->save(false);
                    $amendment->airBooking->airCart->decideBookingStatus();
                    $amendment->amendment_status_id = AmendmentStatus::STATUS_SUCCESS;
                    $amendment->payment_status_id = PaymentStatus::STATUS_CHARGED;
                    $amendment->save(false);
                    $amendmentIds[] = $amendment->id;
                    $amount += $amendment->amount_to_charge;
                    $tds += $amendment->tds;
                    $sTax += $amendment->service_tax;
                }

// Set the new order
                $amendment->airBooking->airCart->setAirBookingsAndAirRoutesOrder();

// Is this reschedule amendment
                if ($amendment->amendment_type_id === \AmendmentType::AMENDMENT_RESCHEDULE) {
// Send email for the amendment to the client
                    $amendment->airBooking->airCart->sendRescheduleEmail();
// Send SMS for the amendment to the client
                    $amendment->airBooking->airCart->sendRescheduleSMS();
                }

// Is this cancel amendment
                if ($amendment->amendment_type_id === \AmendmentType::AMENDMENT_CANCEL) {
                    $amendment->airBooking->airCart->sendCancellationEmail(-$amount);
                }

// Create Payment for the amount
                /* @var $userInfo \UserInfo */
                $userInfo = \UserInfo::model()->findByPk($amendment->airBooking->airCart->user->user_info_id);
                $payment = new Payment;
                $payment->amount = $amount;
                $payment->tds = $tds;
                $payment->service_tax = $sTax;
                $payment->old_balance = $userInfo->balance;
                $payment->new_balance = $payment->old_balance - $amount;
                $userInfo->balance = $payment->new_balance;
                if ($userInfo->one_time_limit == 1 && $userInfo->balance < 0 && $amount > 0) { // Fix the credit limit in case of one time
                    $userInfo->credit_limit = $userInfo->credit_limit + $userInfo->balance;
                    if ($userInfo->credit_limit < 0) {
                        $userInfo->credit_limit = 0;
                    }
                }
                $userInfo->save(false);
                $payment->user_id = $amendment->airBooking->airCart->user_id;
                $payment->loged_user_id = Utils::getLoggedUserId();
                $payment->transfer_type_id = TransferType::AMENDED;
                $payment->note = "Amendment group № $id <br>Amendment type: " . $amendment->amendmentType->name;
                $payment->air_cart_id = $amendment->airBooking->air_cart_id;
                $payment->insert();
                Amendment::model()->updateAll(['payment_id' => $payment->id], 'id in (' . implode(',', $amendmentIds) . ')');
                $out = ['result' => 'success'];
            } else {
                $out = ['errors' => $errors];
            }
            Utils::jsonHeader();
            echo json_encode($out);
            Yii::app()->end();
        }

        $amendments = Amendment::model()->findAllByAttributes([
            'group_id' => $id,
            'amendment_status_id' => AmendmentStatus::STATUS_AMENDED_WITH_SUPPLIER,
        ]);
        if (empty($amendments)) {
            Utils::finalMessage("Not even one amendmed is found from this group!");
        }

        $this->render('define', [
            'amendments' => $amendments,
            'cart_id' => $amendments[0]->airBooking->air_cart_id
        ]);
    }

    /**
     * Print invoice based on the amendments group_id
     * @param integer $id Group ID of the amendment group
     */
    public function actionInvoiceAmendment($id) {
        Utils::finalMessage('The invoices are comign soon, stay tight ...');
    }

    /**
     * Amend request
     * @param integer $id The amendment type to be applyed
     */
    public function actionAmend($id) {
//Utils::dbgYiiLog($_POST);
        Utils::jsonHeader();
        $loggedUserId = Utils::getLoggedUserId();
        if (isset($_POST['items'])) {
            $amendmentGroup = Amendment::getNextGroupId();
            foreach ($_POST['items'] as $item) {
                if (isset($item['ar']) && isset($item['ab'])) {
                    $amendment = new Amendment;
                    $amendment->amendment_status_id = AmendmentStatus::STATUS_REQUESTED;
                    $amendment->amendment_type_id = (int) $id;
// Mark the amendments created with single call to be in one group
                    $amendment->group_id = $amendmentGroup;
                    $amendment->loged_user_id = $loggedUserId;
                    if (isset($_POST['reason']))
                        $amendment->note = $_POST['reason'];
                    $airRoute = new AirRoutes;
                    $airRoute = $airRoute->findByPk($item['ar']);
                    $amendment->air_route_id = $airRoute->id;
                    $airBooking = $airRoute->airBooking;
                    $oldAirBookingId = $airBooking->id;
                    $logusers = \Users::model()->findByPk((int) $loggedUserId);
                    $cartuser = $airBooking->airCart->user;
                    if (in_array($logusers->userInfo->user_type_id, \Authorization::$staffRoles) || $logusers->id === $cartuser->id) {
// \Utils::dbgYiiLog($cartuser);
                    } else {
                        \Utils::dbgYiiLog('amend cancellation failed');
                        echo json_encode(['result' => 'failed']);
                        \Yii::app()->end();
                    }
                    if (empty($item['ab'])) {    // Create new AirBooking
                        $airBooking->clearFareAndTaxes();
                        $airBooking->isNewRecord = true;
                        $airBooking->id = null;
// Assign the common info to be equal
                        $airBooking->source_id = $airRoute->source_id;
                        $airBooking->destination_id = $airRoute->destination_id;
                        $airBooking->departure_ts = $airRoute->departure_ts;
                        $airBooking->arrival_ts = $airRoute->arrival_ts;
                        $airBooking->carrier_id = $airRoute->carrier_id;
                        $airBooking->insert();
// Move the AirRoute from the old airBooking
                        $airRoute->air_booking_id = $airBooking->id; // This AirRoute has new AirBooking
                        $airRoute->order_ = 1;  // The new AirBooking has single AirRoute object
                        $airRoute->save(false);
                    }
                    $amendment->air_booking_id = $airBooking->id;
// Keep the old AB status, so we can reverse it in case of aborted amendment
                    $amendment->prev_ab_status_id = $airBooking->ab_status_id;
                    $amendment->insert();
// Update the AB status
                    if ($amendment->amendment_type_id === AmendmentType::AMENDMENT_CANCEL) {
                        $airBooking->ab_status_id = AbStatus::STATUS_TO_CANCELL;
                    } else {
                        $airBooking->ab_status_id = AbStatus::STATUS_TO_AMEND;
                    }
                    $airBooking->save(false); // || Utils::dbgYiiLog($airBooking->getErrors());
                    $oldAirBooking = AirBooking::model()->findByPk($oldAirBookingId);
                    $oldAirBooking->setDepartAndArriveTimes();
//                    Utils::dbgYiiLog($airBooking->attributes);
                }
            }
// Change the AC status to In Progress
            if (isset($airBooking->airCart)) {
                $airCart = $airBooking->airCart;
                if ($id == \AmendmentType::AMENDMENT_CANCEL) {
                    $airCart->sendCancellationRequestEmail();
                }
                if ($airCart->areAllAirBookingsToBeCancelled()) {
                    $airCart->booking_status_id = BookingStatus::STATUS_TO_CANCEL;
                    $airCart->cancelAtTheAirSource();
                    \CartStatusLog::push_cart_status_log($airCart->id, $airCart->booking_status_id, \CartStatus::CART_STATUS_TO_CANCEL);

//                    $airCart->sendCancellationEmail();
//                    $airCart->sendCancellationSMS();
                } else {
                    $airCart->booking_status_id = BookingStatus::STATUS_IN_PROCESS;
                    \CartStatusLog::push_cart_status_log($airCart->id, $airCart->booking_status_id, \CartStatus::CART_STATUS_TO_AMEND);
                }
                $airCart->sendAmendmentEmailToCustomerCare($amendmentGroup);
                $airCart->save(false, ['booking_status_id']);
            }
            echo json_encode(['result' => 'success']);
        }
    }

    /**
     * Ajax Search for the autocomplete forms
     */
    public function actionSearch() {
        static $returnResults = 10;
        if (isset($_GET['term']) && strlen($_GET['term']) > 3) {
            $condition = 'LOWER(search_info) like LOWER(:term)';
            $params = array(':term' => "%{$_GET['term']}%");
            $query = Yii::app()->db->createCommand()
                ->select('id as value, search_info as label')
                ->from('v_pnrs_tickets_search_info')
                ->where($condition, $params)
                ->limit($returnResults)
                ->order('id')
                ->queryAll();

            Utils::jsonHeader();
            echo json_encode($query);
        }
    }

    public function actionUploadFile($id) {
// Add File
        if (isset($_FILES['filename'])) {
            if ($_FILES['filename']['error'] != 0) {
                Yii::app()->user->setFlash('files_msg', "<b>Error: </b>No file is selected");
            } else {
                $path = AircartFile::storageDirectory() . md5(microtime(true));
// move the new file
                if (move_uploaded_file($_FILES['filename']['tmp_name'], $path)) {
                    $fileModel = new AircartFile;
                    $fileModel->aircart_id = $id;
                    $fileModel->path = $path;
                    $fileModel->name = $_FILES['filename']['name'];
                    $fileModel->note = $_POST['fileNote'];
                    if ($fileModel->validate()) {
                        $fileModel->insert();
                    } else {
                        Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Validation issue: " . print_r($fileModel->getErrors(), true));
                        unlink($path);
                    }
                } else {
                    Yii::app()->user->setFlash('files_msg', "<b>Error: </b>Can't store the file. Internal error");
                }
            }
        }
        $this->redirect("/airCart/view/{$id}#fileForm");
    }

    public function actionDelFile($id) {
        if (Yii::app()->request->isPostRequest && !empty($_GET['File']['id'])) {
            $model = AircartFile::model()->findByPk((int) $_GET['File']['id']);
            if ($model) {
                unlink($model->path);
                $model->delete();
            } else {
                Yii::app()->user->setFlash('files_msg', "File not found");
            }
        } else {
            Yii::app()->user->setFlash('files_msg', "Invalid request");
        }
        $this->redirect("/airCart/view/{$id}#fileForm");
    }

    /**
     * Download file
     * @param type $id The id of the TravelerFile to be downloaded
     */
    public function actionDownload($id) {
        $file = AircartFile::model()->findByPk((int) $id);
        if ($file) {
            Utils::sendFile($file->path, $file->name);
        }
    }

    /**
     * Toggle theme between default and admin
     */
    public function actionChangeTheme() {
        if (isset(Yii::app()->session['theme']) && Yii::app()->session['theme'] != 'admin') {
            Yii::app()->session['theme'] = 'admin';
        } else if (!isset(Yii::app()->session['theme'])) {
            Yii::app()->session['theme'] = 'admin';
        } else {
            Yii::app()->session['theme'] = '';
        }
    }

    public function actionEqualize($id) {
        $model = $this->loadModel($id);
        if (empty($model->airBookings)) {
            \Utils::jsonResponse("This cart has no bookings");
        }
        if (strstr($model->note, ' equalized')) {
            \Utils::jsonResponse("This cart has been equalized once.\nYou can't do this multiple times!");
        }
        $airBooking = $model->airBookings[0];
        $puchasingBalance = $model->user->userInfo->balance + $model->user->userInfo->credit_limit;
        $resultingBalance = (int) round($puchasingBalance - ($model->payment_status_id === \PaymentStatus::STATUS_CHARGED ? 0 : $model->totalAmount()));
        $postAmount = (int) Yii::app()->request->getPost('amount');
        if ($resultingBalance === $postAmount && abs($resultingBalance) < \b2c\models\Booking::PRICEDIFF_IGNORE_LEVEL) {
            if ($resultingBalance < 0) {
// Negative balance - increasing the booking discount
                $airBooking->commission_or_discount_gross -= $resultingBalance;
                $airBooking->update(['commission_or_discount_gross']);
                $model->addNote("Missing $resultingBalance equalized!");
            } else {
// Positive balance correct the payment
                $payment = \Payment::model()->findByAttributes([
                    'air_cart_id' => $model->id,
                    'transfer_type_id' => \TransferType::BOOKING
                    ], ['order' => 'id DESC']);
                if ($payment === null) {
                    \Utils::jsonResponse("This cart is not charged yet");
                }
                $payment->amount += $resultingBalance;
                $payment->new_balance -= $resultingBalance;
                $payment->update(['amount', 'new_balance']);

// Correct the client balance
                $userInfo = $model->user->userInfo;
                $userInfo->balance -= $resultingBalance;
                $userInfo->update(['balance']);

// Increase the booking fee and add cart notes
                $airBooking->booking_fee += $resultingBalance;
                $airBooking->update(['booking_fee']);
                $model->addNote("Excess $resultingBalance equalized!");
            }
        } else {
            \Utils::jsonResponse("Resulting balance: $resultingBalance , postAmount: $postAmount");
        }
    }

    public function actionManualBooking($id) {
        \Utils::jsonHeader();
        $model = AirCart::model()->findByPk($id);
        /* @var $model AirCart */
        if ($model === null) {
            echo json_encode(['error' => 'The requested airCart do not exist']);
            Yii::app()->end();
        }
        if (empty($model->airBookings)) {
            echo json_encode(['error' => 'The requested airCart do not have any bookings']);
            Yii::app()->end();
        }
// Permission check
        if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
            echo json_encode(['error' => 'You do not have authorization to manipulate this airCart']);
            Yii::app()->end();
        }
        $res = \ApiInterface::manualBook($id);
        echo json_encode($res);
    }

    public function actionClaimCart($id) {
        $model = $this->loadModel($id);
        \Utils::jsonHeader();
        /* @var $model AirCart */
        if ($model->getClaim() === false) {
            echo json_encode(['error' => 'The requested airCart already Claimed']);
            Yii::app()->end();
        }

        echo json_encode(['success' => 'Cart Claimed']);
    }

    public function actionUnClaimCart($id) {
        \Utils::jsonHeader();
        $model = AirCart::model()->findByPk($id);
        /* @var $model AirCart */
        if ($model->unClaim() === false) {
            echo json_encode(['error' => 'You cannot uncliam this cart']);
            Yii::app()->end();
        }

        echo json_encode(['success' => 'Cart UnClaimed']);
    }

    public function actionAmendCancel() {
//     \Utils::dbgYiiLog($_POST);
        Utils::jsonHeader();
        $first = true;
        $firstBooking = null;
        $loggedUserId = Utils::getLoggedUserId();
        $amendmentIds = [];
        if (isset($_POST['amendarray'])) {
            $amendmentGroup = Amendment::getNextGroupId();
            foreach ($_POST['amendarray'] as $item) {

                $bookingId = (int) $item;
                $booking = AirBooking::model()->findByPk($bookingId);
                foreach ($booking->airRoutes as $airRoute) {


                    $amendment = new Amendment;
                    $amendment->amendment_status_id = AmendmentStatus::STATUS_CANCELLED;
                    $amendment->amendment_type_id = \AmendmentType::AMENDMENT_CANCEL;
// Mark the amendments created with single call to be in one group
                    $amendment->group_id = $amendmentGroup;
                    $amendment->loged_user_id = $loggedUserId;
                    $amendment->air_route_id = $airRoute->id;
                    $amendment->air_booking_id = $bookingId;
// Keep the old AB status, so we can reverse it in case of aborted amendment
                    $amendment->prev_ab_status_id = $booking->ab_status_id;
                    $amendment->amendment_status_id = AmendmentStatus::STATUS_SUCCESS;
                    $amendment->payment_status_id = PaymentStatus::STATUS_CHARGED;
                    if ($first) {
                        $amendment->amount_to_charge = -(int) $_POST['refund'];
                        $amendment->reseller_amendment_fee = $_POST['servicefee'];
                        $amendment->supplier_amendment_fee = $_POST['airlinefee'];
                        $firstBooking = $booking;
                        $first = false;
                    } else {
                        $amendment->amount_to_charge = 0;
                        $amendment->reseller_amendment_fee = 0;
                        $amendment->supplier_amendment_fee = 0;
                    }
                    $amendment->insert();
                    $amendmentIds[] = $amendment->id;
// Update the AB status
                    $amendment->airBooking->ab_status_id = AbStatus::STATUS_CANCELLED;
                    $amendment->airBooking->save(false);
                    $amendment->airBooking->airCart->decideBookingStatus();
                }
            }

            if (isset($firstBooking->airCart)) {
                $firstBooking->airCart->decideBookingStatus();
            }
            if (@$_POST['doescancelsendmail'] === 'yes') {
                $firstBooking->airCart->sendCancellationEmailNew((int) $_POST['refund']);
            }


            $userInfo = \UserInfo::model()->findByPk($firstBooking->airCart->user->user_info_id);
            $payment = new Payment;
            $amount = -(int) $_POST['refund'];
            $payment->amount = $amount;
            $payment->tds = 0;
            $payment->service_tax = 0;
            $payment->old_balance = $userInfo->balance;
            $payment->new_balance = $payment->old_balance - $amount;
            $userInfo->balance = $payment->new_balance;
            if ($userInfo->one_time_limit == 1 && $userInfo->balance < 0 && $amount > 0) { // Fix the credit limit in case of one time
                $userInfo->credit_limit = $userInfo->credit_limit + $userInfo->balance;
                if ($userInfo->credit_limit < 0) {
                    $userInfo->credit_limit = 0;
                }
            }
            $userInfo->save(false);
            $payment->user_id = $amendment->airBooking->airCart->user_id;
            $payment->loged_user_id = Utils::getLoggedUserId();
            $payment->transfer_type_id = TransferType::AMENDED;
            $payment->note = "Amendment group № $amendment->group_id <br>Amendment type: " . $amendment->amendmentType->name;
            $payment->air_cart_id = $amendment->airBooking->air_cart_id;
            $payment->insert();
            Amendment::model()->updateAll(['payment_id' => $payment->id], 'id in (' . implode(',', $amendmentIds) . ')');
            $out = ['result' => 'success'];
            echo json_encode(['result' => 'success']);
            \Yii::app()->end();
        }
        echo json_encode(['result' => 'false']);
    }

    public function actionAmendFareDiff() {
//    \Utils::dbgYiiLog($_POST);
        Utils::jsonHeader();
        $first = true;
        $firstBooking = null;
        $loggedUserId = Utils::getLoggedUserId();
        $amendmentIds = [];
        if (isset($_POST['farediff']) && isset($_POST['cartid'])) {
            $amendmentGroup = Amendment::getNextGroupId();
            $item = (int) $_POST['cartid'];
            $cart = AirCart::model()->findByPk((int) $item);
            if ($cart !== null && count($cart->airBookings) > 0) {
                $reason = $this->payment_request_reason[\Yii::app()->request->getPost('reasonfarediff')];
                if (\Yii::app()->request->getPost('reasonfarediff') == 3) {
                    $reason = \Yii::app()->request->getPost('otherreasonfarediff');
                }

                $booking = $cart->airBookings[0];

                $amendment = new Amendment;
                $amendment->amendment_status_id = AmendmentStatus::STATUS_SUCCESS;
                $amendment->amendment_type_id = \AmendmentType::AMENDMENT_MISCELLANEOUS;
// Mark the amendments created with single call to be in one group
                $amendment->group_id = $amendmentGroup;
                $amendment->loged_user_id = $loggedUserId;
                $amendment->air_route_id = $booking->airRoutes[0]->id;
                $amendment->air_booking_id = $booking->id;
// Keep the old AB status, so we can reverse it in case of aborted amendment
                $amendment->prev_ab_status_id = $booking->ab_status_id;
                $amendment->payment_status_id = PaymentStatus::STATUS_NOT_CHARGED;
                $amendment->note = $reason;
                $amendment->reseller_amendment_fee = (double) \Yii::app()->request->getPost('fddservicefee');
                $amendment->supplier_amendment_fee = (double) \Yii::app()->request->getPost('farediff');
                $amendment->amount_to_charge = $amendment->reseller_amendment_fee + $amendment->supplier_amendment_fee; //0;
                $amendment->insert();
                if (\Yii::app()->request->getPost('addfee') == 'yes') {
                    $amendment->airBooking->basic_fare += (double) $_POST['farediff'] + (double) \Yii::app()->request->getPost('fddservicefee');
                    $amendment->airBooking->commercial_total_efect += (double) \Yii::app()->request->getPost('fddservicefee');
                    $amendment->airBooking->save(false);
                }
                $amendment->airBooking->airCart->decideBookingStatus();

                if ($amendment->id) {
                    $model = new PayGateLog;
                    $model->currency_id = \Currency::INR_ID;
                    $model->original_currency_id = \Currency::INR_ID;
// Set the PG defaults based on the client type
                    $model->pg_id = \PaymentGateway::chooseDefaultPg();
                    $model->user_info_id = $cart->user->user_info_id;
                    $model->convince_fee = $model->convenienceFee();
                    $model->air_cart_id = $item;
                    $model->amount = (double) $_POST['farediff'] + (double) $_POST['fddservicefee'];
                    $model->reason = htmlentities($reason);
                    $model->note = htmlentities("Amendment group Id $amendmentGroup for price Difference");

                    $model->save();
                    if (\Yii::app()->request->getPost('addfee') == 'yes') {
                        $cart->addNote("Amendment group id $amendmentGroup for Price Diff " . $model->amount . ". Price diff added to fee");
                    }
                    if ($_POST['doessendmail'] === 'yes') {
                        $model->sendPaymentRequestEmail(\Yii::app()->request->getPost('pay_req_emailid'));
                    }

                    $cart->addNote("PGL ID: " . $model->id);
                    \CartStatusLog::push_cart_status_log($cart->id, $cart->booking_status_id, \CartStatus::CART_STATUS_FARE_DIFF_SENT);
                    echo json_encode(['result' => 'success']);
                }
            }
        }
    }

    /**
     * Added By Satender
     * Purpose : To abort the fare difference transaction(s)
     * @param type $id => id of PayGateLog model
     */
    public function actionAbortFareDiff($id) {
        Utils::jsonHeader();
        $reason = Yii::app()->request->getPost('reason');
        if (empty(trim($reason)) || empty($id)) {
            echo json_encode(['result' => 'error', 'msg' => 'Please provide proper information']);
            Yii::app()->end();
        }
        $pay_gate_log = PayGateLog::model()->findByPk($id);
        if ($pay_gate_log->getAmemdmentGroupID() === 0) {
            echo json_encode(['result' => 'error', 'msg' => 'Can not abort manual payment request?']);
            Yii::app()->end();
        }
        if ($pay_gate_log->status_id === \TrStatus::STATUS_ABORTED) {
            echo json_encode(['result' => 'error', 'msg' => 'Already aborted.']);
            Yii::app()->end();
        }
        if ($pay_gate_log->status_id === \TrStatus::STATUS_NEW) {
            $transaction = Yii::app()->db->beginTransaction();
            try {
                $pay_gate_log->status_id = \TrStatus::STATUS_ABORTED;
                $user = \Users::model()->findByPk(Utils::getLoggedUserId());
                $userName = empty($user) ? 'Admin' : $user->name;
                $pay_gate_log->reason = $userName . '::' . date(DATETIME_FORMAT) . '::' . $reason; // Need to Username Also
                $pay_gate_log->save(false);

                $amendment = Amendment::model()->findByAttributes(['group_id' => $pay_gate_log->getAmemdmentGroupID()]);
                $amendment->amendment_status_id = \AmendmentStatus::STATUS_CANCELLED;
                $amendment->save(false);

                $amendment->airBooking->basic_fare -= $amendment->amount_to_charge;
                $amendment->airBooking->commercial_total_efect -= $amendment->reseller_amendment_fee;
                if ($amendment->airBooking->basic_fare < 0) {
                    $amendment->airBooking->basic_fare = 0;
                }
                $amendment->airBooking->save(false);

                $air_cart = $this->loadModel($pay_gate_log->air_cart_id);
                $air_cart->addNote('PGL ID:' . $id . ' Aborted with reason :' . $reason);
                $transaction->commit();
                echo json_encode(['result' => 'success', 'msg' => 'Aborted successfully.']);
            } catch (\Exception $e) {
                $transaction->rollback();
                Yii::log('Unable to save : ' . $e->getMessage(), \CLogger::LEVEL_ERROR, 'application.controller.AirCartController');
                echo json_encode(['result' => 'error', 'msg' => 'Due to some error it has not been aborted.']);
            }
        } else {
            echo json_encode(['result' => 'error', 'msg' => 'You can not abort this transaction due to status']);
        }
    }

    /**
     * Added By Satender
     * Purpose : To send the payment request mail again 
     *           so that user do not need to create fare differences again and again
     * @param type $id
     */
    public function actionResendMail($id) {
        Utils::jsonHeader();
        if (empty($id)) {
            echo json_encode(['result' => 'error', 'msg' => 'Please provide proper information']);
        }
        $pay_gate_log = PayGateLog::model()->findByPk($id);

        if ($pay_gate_log->status_id === \TrStatus::STATUS_ABORTED) {
            echo json_encode(['result' => 'success', 'msg' => 'Already aborted.']);
        }
        if ($pay_gate_log->status_id === \TrStatus::STATUS_NEW) {
            $pay_gate_log->sendPaymentRequestEmail(\Yii::app()->request->getPost('emailid'));
            echo json_encode(['result' => 'success', 'msg' => 'Email sent successfully.']);
        } else {
            echo json_encode(['result' => 'error', 'msg' => 'You can not send email again due to status']);
        }
    }

    public function actionAmendReschedule() {
//  \Utils::dbgYiiLog($_POST);

        Utils::jsonHeader();
        $first = true;
        $firstBooking = null;
        $loggedUserId = Utils::getLoggedUserId();
        $amendmentIds = [];
        if (isset($_POST['bookingid'])) {
            $amendmentGroup = Amendment::getNextGroupId();

            $item = $_POST['bookingid'];
            $abookingId = (int) $item;
            $abooking = AirBooking::model()->findByPk($abookingId);
            $amendorigin = $abooking->source_id;
            $amenddestination = $abooking->destination_id;
            $amendcartid = $abooking->air_cart_id;
            $aircart = \AirCart::model()->findByPk((int) $amendcartid);

            foreach ($aircart->airBookings as $booking) {

                if ($booking->source_id !== $amendorigin || $booking->destination_id !== $amenddestination || $booking->ab_status_id === AbStatus::STATUS_CANCELLED) {
                    continue;
                }
                $flightno = $booking->airRoutes[0]->flight_number;
                if (count($booking->airRoutes) > 1) {
                    $rid = $booking->airRoutes[0]->id;
                    \AirRoutes::model()->deleteAll('air_booking_id=:airBookingId and id!=:rid', [':airBookingId' => $booking->id, ':rid' => $rid]);
                }
                $airRoute = $booking->airRoutes[0];
                $airRoute->air_booking_id = $booking->id;
                $airRoute->source_id = $_POST['source_id'];
                $airRoute->destination_id = $_POST['destination_id'];
                $airRoute->departure_ts = $_POST['departure_ts'];
                $airRoute->arrival_ts = $_POST['arrival_ts'];
                $airRoute->carrier_id = $_POST['carrier_id'];
                $airRoute->flight_number = $_POST['flight_number'];
                $airRoute->booking_class = $booking->booking_class;
                $airRoute->fare_basis = $booking->fare_basis;
                $airRoute->order_ = 1;
                $airRoute->save(false);

                $amendment = new Amendment;
                $amendment->amendment_status_id = AmendmentStatus::STATUS_SUCCESS;
                $amendment->amendment_type_id = \AmendmentType::AMENDMENT_RESCHEDULE;
// Mark the amendments created with single call to be in one group
                $amendment->group_id = $amendmentGroup;
                $amendment->loged_user_id = $loggedUserId;
                $amendment->air_route_id = $airRoute->id;
                $amendment->air_booking_id = $booking->id;
// Keep the old AB status, so we can reverse it in case of aborted amendment
                $amendment->prev_ab_status_id = $booking->ab_status_id;
                $amendment->amendment_status_id = AmendmentStatus::STATUS_SUCCESS;
                $amendment->payment_status_id = PaymentStatus::STATUS_CHARGED;

                $labels = $amendment->attributeLabels();

                if ($booking->source_id !== (int) $_POST['source_id']) {
                    $amendment->changes .= "<tr><td>{$labels['source_id']}</td><td>{$booking->source_id}</td><td>{$_POST['source_id']}</td></tr>";
                    $booking->source_id = $_POST['source_id'];
                }
                if ($booking->destination_id !== (int) $_POST['destination_id']) {
                    $amendment->changes .= "<tr><td>{$labels['destination_id']}</td><td>{$booking->destination_id}</td><td>{$_POST['destination_id']}</td></tr>";
                    $booking->destination_id = $_POST['destination_id'];
                }
                if ($booking->departure_ts !== $_POST['departure_ts']) {
                    $amendment->changes .= "<tr><td>{$labels['departure_ts']}</td><td>{$booking->departure_ts}</td><td>{$_POST['departure_ts']}</td></tr>";
                    $booking->departure_ts = $_POST['departure_ts'];
                }
                if ($booking->arrival_ts !== $_POST['arrival_ts']) {
                    $amendment->changes .= "<tr><td>{$labels['arrival_ts']}</td><td>{$booking->arrival_ts}</td><td>{$_POST['arrival_ts']}</td></tr>";
                    $booking->arrival_ts = $_POST['arrival_ts'];
                }
                if ($booking->carrier_id !== $_POST['carrier_id']) {
                    $amendment->changes .= "<tr><td>{$labels['carrier_id']}</td><td>{$booking->carrier_id}</td><td>{$_POST['carrier_id']}</td></tr>";
                    $booking->carrier_id = $_POST['carrier_id'];
                }
                if ($flightno !== $_POST['flight_number']) {
                    $amendment->changes .= "<tr><td>{$labels['carrier_id']}</td><td>{$flightno}</td><td>{$_POST['flight_number']}</td></tr>";
                }
                if ($booking->airline_pnr !== $_POST['airline_pnr']) {
                    $amendment->changes .= "<tr><td>{$labels['airline_pnr']}</td><td>{$booking->airline_pnr}</td><td>{$_POST['airline_pnr']}</td></tr>";
                    $booking->airline_pnr = $_POST['airline_pnr'];
                }
                if ($booking->crs_pnr !== $_POST['crs_pnr']) {
                    $amendment->changes .= "<tr><td>{$labels['crs_pnr']}</td><td>{$booking->crs_pnr}</td><td>{$_POST['crs_pnr']}</td></tr>";
                    $booking->crs_pnr = $_POST['crs_pnr'];
                }
                if ($booking->ticket_number !== $_POST['ticket_number']) {
                    $amendment->changes .= "<tr><td>{$labels['ticket_number']}</td><td>{$booking->ticket_number}</td><td>{$_POST['ticket_number']}</td></tr>";
                    $booking->ticket_number = $_POST['ticket_number'];
                }

                $booking->save(false);

                if ($first) {
                    $amendment->amount_to_charge = $_POST['resrefund'];
                    $amendment->reseller_amendment_fee = $_POST['resservicefee'];
                    $amendment->supplier_amendment_fee = $_POST['resairlinefee'];
                    $firstBooking = $booking;
                    $first = false;
                } else {
                    $amendment->amount_to_charge = 0;
                    $amendment->reseller_amendment_fee = 0;
                    $amendment->supplier_amendment_fee = 0;
                }
                $amendment->insert();
                $amendmentIds[] = $amendment->id;
// Update the AB status
                $amendment->airBooking->ab_status_id = AbStatus::STATUS_OK;
                $amendment->airBooking->save(false);
                $amendment->airBooking->airCart->decideBookingStatus();
            }

            $aircart->addNote('Reschedule Done');

            if (isset($firstBooking->airCart)) {
                $firstBooking->airCart->decideBookingStatus();
            }

//$firstBooking->airCart->sendCancellationEmail((int) $_POST['refund']);

            $userInfo = \UserInfo::model()->findByPk($firstBooking->airCart->user->user_info_id);
            $payment = new Payment;
            $amount = (int) $_POST['resrefund'];
            $payment->amount = $amount;
            $payment->tds = 0;
            $payment->service_tax = 0;
            $payment->old_balance = $userInfo->balance;
            $payment->new_balance = $payment->old_balance - $amount;
            $userInfo->balance = $payment->new_balance;
            if ($userInfo->one_time_limit == 1 && $userInfo->balance < 0 && $amount > 0) { // Fix the credit limit in case of one time
                $userInfo->credit_limit = $userInfo->credit_limit + $userInfo->balance;
                if ($userInfo->credit_limit < 0) {
                    $userInfo->credit_limit = 0;
                }
            }
            $userInfo->save(false);
            $payment->user_id = $amendment->airBooking->airCart->user_id;
            $payment->loged_user_id = Utils::getLoggedUserId();
            $payment->transfer_type_id = TransferType::AMENDED;
            $payment->note = "Amendment group № $amendment->group_id <br>Amendment type: " . $amendment->amendmentType->name;
            $payment->air_cart_id = $amendment->airBooking->air_cart_id;
            $payment->insert();
            Amendment::model()->updateAll(['payment_id' => $payment->id], 'id in (' . implode(',', $amendmentIds) . ')');
            $out = ['result' => 'success'];
            echo json_encode(['result' => 'success']);
        }
    }

    public function actionAmendAddPax() {
// \Utils::dbgYiiLog($_POST);
// exit();
        Utils::jsonHeader();
        $first = true;
        $firstBooking = null;
        $loggedUserId = Utils::getLoggedUserId();

        $amendmentIds = [];
        if (isset($_POST['first_name']) && isset($_POST['last_name']) && isset($_POST['cartid'])) {
            $cartid = (int) $_POST['cartid'];
            $cart = \AirCart::model()->findByPk($cartid);
            $isreturn = false;
            $multicity = false;

            $traveller = [];
            $first = true;
            $traveler = new \Traveler;
            foreach ($cart->airBookings as $ab) {
                if ($first) {
                    $traveller[$ab->traveler_id] = $ab->traveler_id;
                    $traveler->user_info_id = $ab->traveler->user_info_id;
                    $traveler->first_name = \Yii::app()->request->getPost('first_name');
                    $traveler->last_name = \Yii::app()->request->getPost('last_name');
                    $traveler->traveler_title_id = empty(\Yii::app()->request->getPost('traveler_title_id')) ? \TravelerTitle::DEFAULT_TITLE : \Yii::app()->request->getPost('traveler_title_id');
                    $traveler->birthdate = empty(\Yii::app()->request->getPost('birthdate')) ? null : \Yii::app()->request->getPost('birthdate');
                    $traveler->id = $traveler->insertIfMissing();
                }
                if (isset($traveller[$ab->traveler_id])) {
                    $airBooking = new \AirBooking;
                    $airBooking->airline_pnr = $ab->airline_pnr;    // AirPnr of the first segment in the journey
                    $airBooking->crs_pnr = $ab->crs_pnr;
                    $airBooking->booking_type_id = $ab->booking_type_id;
                    $airBooking->air_source_id = $ab->air_source_id;
                    $airBooking->traveler_type_id = \Yii::app()->request->getPost('traveler_type_id');
                    $airBooking->traveler_id = $traveler->id;
                    $airBooking->source_id = $ab->source_id;
                    $airBooking->destination_id = $ab->destination_id;    // Destination of the last segment in the journey
                    $airBooking->carrier_id = $ab->carrier_id;
                    $airBooking->departure_ts = $ab->departure_ts;
                    $airBooking->arrival_ts = $ab->arrival_ts;
                    $airBooking->service_type_id = $ab->service_type_id;
                    $airBooking->fare_basis = $ab->fare_basis;
                    $airBooking->booking_class = $ab->booking_class;
                    $airBooking->fare_type_id = $ab->fare_type_id;
                    $airBooking->frequent_flyer = '';
                    $airBooking->tour_code = $ab->tour_code;
                    $airBooking->private_fare = '';
                    $airBooking->endorsment = $ab->endorsment;
                    $airBooking->air_cart_id = $ab->air_cart_id;
                    $airBooking->cabin_type_id = $ab->cabin_type_id;
                    if ($first) {
                        $airBooking->basic_fare = \Yii::app()->request->getPost('fare');
                    } else {
                        $airBooking->basic_fare = 0;
                    }
                    $airBooking->insert();

                    foreach ($ab->airRoutes as $ar) {

// Add this AirRoute
                        $airRoute = new \AirRoutes;
                        $airRoute->air_booking_id = $airBooking->id;
                        $airRoute->airPnr = $ab->airline_pnr;
                        $airRoute->aircraft = $ar->aircraft;
                        $airRoute->arrival_ts = $ar->arrival_ts;
                        $airRoute->booking_class = $ar->booking_class;
                        $airRoute->carrier_id = $ar->carrier_id;
                        $airRoute->departure_ts = $ar->departure_ts;
                        $airRoute->destination_id = $ar->destination_id;
                        $airRoute->destination_terminal = $ar->destination_terminal;
                        $airRoute->fare_basis = $ar->fare_basis;
                        $airRoute->flight_number = $ar->flight_number;
                        $airRoute->source_id = $ar->source_id;
                        $airRoute->source_terminal = $ar->source_terminal;
                        $airRoute->seat = $ar->seat;
                        $airRoute->meal = $ar->meal;
                        $airRoute->insert();
                    }
                    $airBooking->setAirRoutesOrder();
                }
                $first = false;
            }
            $cart->addNote('New Passenger ' . $traveler->first_name . ' ' . $traveler->last_name . ' Added');
            echo json_encode(['result' => 'success']);
            \Yii::app()->end();
        }
        echo json_encode(['result' => 'false']);
    }

    public function actionAmendUpdateTicket() {
//  \Utils::dbgYiiLog($_POST);
// exit();
        Utils::jsonHeader();
        $first = true;
        $firstBooking = null;
        $loggedUserId = Utils::getLoggedUserId();
        if (isset($_POST['ticketcartid'])) {
            $cartid = (int) $_POST['ticketcartid'];
            $cart = \AirCart::model()->findByPk($cartid);
            if ($cart !== null) {
                foreach ($cart->airBookings as $ab) {
                    $ab->crs_pnr = \Yii::app()->request->getPost('ticket_' . $ab->id . '_crs_pnr');
                    $ab->airline_pnr = \Yii::app()->request->getPost('ticket_' . $ab->id . '_airline_pnr');
                    $ab->ticket_number = \Yii::app()->request->getPost('ticket_' . $ab->id . '_ticket_no');
                    $ab->save(false);
                }
                $cart->addNote('Ticket Details Updated');
                $cart->setBookingStatus();
                // $cart->decideBookingStatus();

                echo json_encode(['result' => 'success']);
            } else {
                \Utils::dbgYiiLog(__METHOD__ . ':::CartID:::' . $cartid . '::: NOT FOUND');
                echo json_encode(['result' => 'false']);
            }
            \Yii::app()->end();
        }
        echo json_encode(['result' => 'false']);
    }

    public function actionSetCartStatus($id) {
        Utils::jsonHeader();
        $model = $this->loadModel($id);
        if (isset($_POST['cartStatusId'])) {
            \CartStatusLog::push_cart_status_log($id, $model->booking_status_id, \Yii::app()->request->getPost('cartStatusId'));
            $model->addNote("Cart status set to " . \CartStatus::$cartStatusMap[(int) \Yii::app()->request->getPost('cartStatusId')]);
            echo json_encode(['result' => 'success']);
            \Yii::app()->end();
        }
        echo json_encode(['error' => 'true']);
    }

    public function actionGetCountOfQueues() {
        Utils::jsonHeader();
        $count = array();
        $count['docsent'] = \AirCart::getCountDocSentQueue();
        $count['docrecvd'] = \AirCart::getCountDocRecvdQueue();
        $count['farediffsent'] = \AirCart::getCountFareDiffSentQueue();
        $count['farediffrecvd'] = \AirCart::getCountFareDiffRecvdQueue();
        $count['toamend'] = \AirCart::getCountToAmendQueue();
        $count['tocancel'] = \AirCart::getCountToCancelQueue();
        $count['emailnotsent'] = \AirCart::getcountToEmailNotSentQueue();
//\Utils::dbgYiiLog($count);
        echo json_encode($count);
    }

    public function actionAmendModifyRoute() {
//  \Utils::dbgYiiLog($_POST);
// exit();
        Utils::jsonHeader();
        if (isset($_POST['bookingidd'])) {
            $routeid = (int) $_POST['bookingidd'];
            if ($routeid == 0) {
                $route = new \AirRoutes();
                $initialAB = \AirBooking::model()->findByPk((int) \Yii::app()->request->getPost('air_booking_id'));
            } else {
                $route = \AirRoutes::model()->findByPk($routeid);
                $initialRoute = \AirRoutes::model()->findByPk($routeid);
                $initialAB = $initialRoute->airBooking;
            }
            $route->source_id = \Yii::app()->request->getPost('source_id');
            $route->destination_id = \Yii::app()->request->getPost('destination_id');
            $route->departure_ts = \Yii::app()->request->getPost('departure_ts');
            $route->arrival_ts = \Yii::app()->request->getPost('arrival_ts');
            $route->carrier_id = \Yii::app()->request->getPost('carrier_id');
            $route->air_booking_id = \Yii::app()->request->getPost('air_booking_id');
            $route->flight_number = \Yii::app()->request->getPost('flight_number');
            $route->destination_terminal = \Yii::app()->request->getPost('destination_terminal');
            $route->source_terminal = \Yii::app()->request->getPost('source_terminal');
            $route->fare_basis = \Yii::app()->request->getPost('fare_basis');
            $route->booking_class = \Yii::app()->request->getPost('booking_class');
            $route->aircraft = \Yii::app()->request->getPost('aircraft');
            $route->meal = \Yii::app()->request->getPost('meal');
            $route->seat = \Yii::app()->request->getPost('seat');
            $route->save(false);

            if (!empty($route->id)) {
                if ($routeid == 0) {
                    $route->airBooking->airCart->addNote('Amend: Route Added : ' . $route->source->airport_code . ' - ' . $route->destination->airport_code . ' dep: ' . $route->departure_ts);
                    $cart = \AirCart::model()->findByPk($route->airBooking->air_cart_id);
                    foreach ($cart->airBookings as $booking) {
                        if ($booking->source_id == $initialAB->source_id && $booking->destination_id == $initialAB->destination_id && substr($booking->departure_ts, 0, 16) == substr($initialAB->departure_ts, 0, 16)) {
                            if ($booking->id != $route->air_booking_id) {
                                $routenew = new \AirRoutes();
                                $routenew->source_id = $route->source_id;
                                $routenew->destination_id = $route->destination_id;
                                $routenew->departure_ts = $route->departure_ts;
                                $routenew->arrival_ts = $route->arrival_ts;
                                $routenew->carrier_id = $route->carrier_id;
                                $routenew->air_booking_id = $booking->id;
                                $routenew->flight_number = $route->flight_number;
                                $routenew->destination_terminal = $route->destination_terminal;
                                $routenew->source_terminal = $route->source_terminal;
                                $routenew->fare_basis = $route->fare_basis;
                                $routenew->booking_class = $route->booking_class;
                                $routenew->aircraft = $route->aircraft;
                                $routenew->meal = $route->meal;
                                $routenew->seat = $route->seat;
                                $routenew->insert();
                            }
                        }
                    }
                } else {
                    $route->airBooking->airCart->addNote('Amend: Route Modified : ' . $route->source->airport_code . ' - ' . $route->destination->airport_code . ' dep: ' . $route->departure_ts);

                    $cart = \AirCart::model()->findByPk($route->airBooking->air_cart_id);
                    foreach ($cart->airBookings as $booking) {
                        if ($booking->source_id == $initialAB->source_id && $booking->destination_id == $initialAB->destination_id && substr($booking->departure_ts, 0, 16) == substr($initialAB->departure_ts, 0, 16)) {
                            if ($booking->id != $route->air_booking_id) {
                                foreach ($booking->airRoutes as $rt) {
                                    if ($rt->source_id == $initialRoute->source_id && $rt->destination_id == $initialRoute->destination_id && substr($rt->departure_ts, 0, 16) == substr($initialRoute->departure_ts, 0, 16)) {
                                        
                                    }
                                    $rt->source_id = $route->source_id;
                                    $rt->destination_id = $route->destination_id;
                                    $rt->departure_ts = $route->departure_ts;
                                    $rt->arrival_ts = $route->arrival_ts;
                                    $rt->carrier_id = $route->carrier_id;
                                    $rt->air_booking_id = $booking->id;
                                    $rt->flight_number = $route->flight_number;
                                    $rt->destination_terminal = $route->destination_terminal;
                                    $rt->source_terminal = $route->source_terminal;
                                    $rt->fare_basis = $route->fare_basis;
                                    $rt->booking_class = $route->booking_class;
                                    $rt->aircraft = $route->aircraft;
                                    $rt->meal = $route->meal;
                                    $rt->seat = $route->seat;
                                    $rt->save(false);
                                }
                            }
                        }
                    }
                }
                foreach ($cart->airBookings as $booking) {
                    $booking->setAirRoutesOrder();
                }

                echo json_encode(['result' => 'success']);
                \Yii::app()->end();
            }
        }
        echo json_encode(['error' => 'true']);
    }

    function actionAmendDeleteRoute() {
        Utils::jsonHeader();
        if (isset($_POST['routeid'])) {
            $routeid = (int) $_POST['routeid'];
            $route = \AirRoutes::model()->findByPk($routeid);
            $initialRoute = $route;
            $sourceAP = $route->source->airport_code;
            $destinatioAP = $route->destination->airport_code;
            $dep = $route->departure_ts;
            $initialAB = $initialRoute->airBooking;
            if (count($initialRoute->airBooking->airRoutes) < 2) {
                $route->airBooking->airCart->addNote('only one route in booking. Cant be deleted');
                echo json_encode(['error' => 'only one route in booking. Cant be deleted']);
                \Yii::app()->end();
            }
            if (!empty($route->id)) {
                $cart = \AirCart::model()->findByPk($route->airBooking->air_cart_id);
                foreach ($cart->airBookings as $booking) {
                    if ($booking->source_id == $initialAB->source_id && $booking->destination_id == $initialAB->destination_id && substr($booking->departure_ts, 0, 16) == substr($initialAB->departure_ts, 0, 16)) {
                        foreach ($booking->airRoutes as $rt) {
                            if ($rt->source_id == $initialRoute->source_id && $rt->destination_id == $initialRoute->destination_id && substr($rt->departure_ts, 0, 16) == substr($initialRoute->departure_ts, 0, 16)) {
                                $rt->delete();
                                break;
                            }
                        }
                    }
                }

                foreach ($cart->airBookings as $booking) {
                    $booking->setAirRoutesOrder();
                }
                $route->airBooking->airCart->addNote('Amend: Route deleted : ' . $sourceAP . ' - ' . $destinatioAP . ' dep: ' . $dep);

                echo json_encode(['result' => 'success']);
                \Yii::app()->end();
            }
        }
        echo json_encode(['error' => 'error']);
    }

    public function actionSendSmsManual($id) {
        $model = $this->loadModel($id);
        $phone = \Yii::app()->request->getPost('phone'); //$model->user->email;
        if ($phone === null) {
            $phone = $model->user->userInfo->mobile;
        }
        if (strlen($phone) <= 10) {
            $model->sendCurrentStatusSMS('+91' . $phone);
        } elseif (strlen($phone) > 10) {
            $model->sendCurrentStatusSMS($phone);
        }
    }

    public function actionGetCSCost() {
        \AirCart::getBookingCostOfCS();
    }

    /**
     * Purpose: To display or download screenshot
     * @param type $is => screenshot_name 
     */
    public function actionScreenshot($sname) {
        if (!empty($sname)) {
            Screenshot::getFile($sname);
        }
    }

    public function actionDownloadScreenshot($filename) {
        if (!empty($filename)) {
            Screenshot::getFile($filename, true);
        }
    }

    public function actionUpdateAirbooking($id) {
        try {
            $reason = Yii::app()->request->getPost('reason');
            $transaction = Yii::app()->db->beginTransaction();
            $model = \AirBooking::model()->findByPk($id)->with('amendments,airRoutes');

            if (!empty($model->amendments)) {
                echo json_encode(['result' => 'error', 'msg' => 'Can not delete airbooking with amendments']);
                \Yii::app()->end();
            }
            if (!empty($model->airRoutes)) {
                \AirRoutes::model()->deleteAll('air_booking_id=:airBookingId', [':airBookingId' => $model->id]);
            }
            $air_cart = $this->loadModel($model->air_cart_id);
            $air_cart->addNote('Airbooking Deleted Airbooking Id:' . $id . ' Reason :' . $reason);
            $model->delete();
            $transaction->commit();
            echo json_encode(['result' => 'success', 'msg' => 'Deleted successfully.']);
        } catch (exception $e) {
            echo json_encode(['result' => 'error', 'msg' => 'There is some problem for deleting this airbooking']);
        }
        \Yii::app()->end();
    }

    public function actionUpdateAirbookingTraveler() {
        $air_booking_id = \Yii::app()->request->getPost('air_booking_id');
        $traveler_id = \Yii::app()->request->getPost('traveler_id');
        if ($air_booking_id !== null && $traveler_id !== null) {
            $air_booking_model = \AirBooking::model()->findByPk($air_booking_id);

            $old_traveler_id = $air_booking_model->traveler_id;
            $air_booking_model->traveler_id = $traveler_id;
            if ($air_booking_model->save()) {
                $air_cart = $this->loadModel($air_booking_model->air_cart_id);
                $air_cart->addNote('Update Traveler Id : ' . $traveler_id . ' To Traveler Id ' . $old_traveler_id . ' Airbooking Id : ' . $air_booking_id);
                echo json_encode(['result' => 'success', 'msg' => 'Traveler updated successfully']);
                \Yii::app()->end();
            } else {
                echo json_encode(['result' => 'error', 'msg' => 'There is some problem for Updating this Traveler']);
                \Yii::app()->end();
            }
        } else {
            echo json_encode(['result' => 'error', 'msg' => 'Empty Traveler or airbooking id']);
            \Yii::app()->end();
        }
    }

    /**
     * Added By Satender
     * Purpose : To set the Cart Status as aborted
     * @param type $id
     */
    public function actionAbortCart($id) {
        $model = $this->loadModel($id);

        if ($model->booking_status_id === \BookingStatus::STATUS_IN_PROCESS || $model->booking_status_id === \BookingStatus::STATUS_NEW) {
            $model->booking_status_id = \BookingStatus::STATUS_ABORTED;
            $model->update(['booking_status_id']);
            $model->addNote('Cart Aborted');
        }

        $this->redirect('/airCart/view/' . $id);
    }

}
