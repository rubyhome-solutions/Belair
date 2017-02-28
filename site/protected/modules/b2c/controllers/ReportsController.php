<?php

namespace b2c\controllers;

use b2c\components\ControllerExceptionable;
use b2c\components\ControllerOverridable;

\Yii::import('application.controllers.ReportController');

class ReportsController extends \ReportController {

    use ControllerOverridable,
        ControllerExceptionable;

    protected $_inheritRules = false;

    public function accessRules() {
        return [
            ['allow', 'actions' => ['index', 'clientSourceReport', 'clientDetailReport', 'airCartDetailReport', 'salesReport', 'airLineOverviewReport', 'airLineReport', 'asPdf', 'reportsLogin'], 'users' => ['*']],
        ];
    }

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex() {
        $this->redirect(array('clientSourceReport'));
    }

    /**
     * Displays the contact page
     */
    public function actionClientSourceReport() {
        \Yii::app()->setTheme(self::B2C_THEME);
        $reportdata = null;
        $cs = null;
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['clientSource'])) {
                $cs = (int) $_POST['clientSource'];
            }
        } else {
            $fromdate = date('Y-m-d', strtotime('-1 days'));
            $todate = date('Y-m-d', strtotime('-1 days'));

            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['clientSource'])) {
                $cs = (int) $_POST['clientSource'];
            }

            //\Utils::dbgYiiLog(['fromdate'=>$fromdate,'todate'=>$todate,'prevfromdate'=>$prevfromdate,'prevtodate'=>$prevtodate]);
        }
        if (isset(\Yii::app()->user->id)) {
            $csid = \ClientSource::getCSUsingUserInfoName();
            if ($csid !== false) {
                $cs = $csid;
            }
        }

        if (\Authorization::getIsSuperAdminorClientSourceLogged()) {
            $data = \BookingLog::reportClientSourceReport($fromdate, $todate, $cs);
            $prevdata = \BookingLog::reportClientSourceReport($prevfromdate, $prevtodate, $cs);
        } else {
            $data = [];
            $prevdata = [];
        }

        $authMessage = '';
        if (isset($_GET['authMessage'])) {
            $authMessage = $_GET['authMessage'];
        }
        $this->layout = '//layouts/reports';
        //$this->render('//reports/source');
        $this->render('//reports/source1', array(
            'clientSources' => \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
            'data' => $data, 'prevdata' => $prevdata, 'datefrom' => $fromdate, 'dateto' => $todate, 'prevdatefrom' => $prevfromdate, 'prevdateto' => $prevtodate, 'cs' => $cs, 'authMessage' => $authMessage
        ));
    }

    public function actionClientDetailReport() {
        \Yii::app()->setTheme(self::B2C_THEME);
        $reportdata = null;
        $cs = null;
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['clientSource'])) {
                $cs = (int) $_POST['clientSource'];
            }
        } else {
            $fromdate = date('Y-m-d', strtotime('-6 days'));
            $todate = date('Y-m-d', strtotime('0 days'));

            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['clientSource'])) {
                $cs = (int) $_POST['clientSource'];
            }

            //\Utils::dbgYiiLog(['fromdate'=>$fromdate,'todate'=>$todate,'prevfromdate'=>$prevfromdate,'prevtodate'=>$prevtodate]);
        }

        if (isset(\Yii::app()->user->id)) {
            $csid = \ClientSource::getCSUsingUserInfoName();
            if ($csid !== false) {
                $cs = $csid;
            }
        }
        if (\Authorization::getIsSuperAdminorClientSourceLogged()) {
            $data = \BookingLog::reportClientDetailReport($fromdate, $todate, $cs);
        } else {
            $data = [];
            $prevdata = [];
        }
        // $prevdata=\BookingLog::reportClientDetailReport($prevfromdate,$prevtodate,$cs);
        // \Utils::dbgYiiLog($data);

        $authMessage = '';
        if (isset($_GET['authMessage'])) {
            $authMessage = $_GET['authMessage'];
        }

        $this->layout = '//layouts/reports';
        //$this->render('//reports/source');
        $this->render('//reports/sourcedetail', array(
            'clientSources' => \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
            'data' => $data, 'datefrom' => $fromdate, 'dateto' => $todate, 'prevdatefrom' => $prevfromdate, 'prevdateto' => $prevtodate, 'cs' => $cs, 'authMessage' => $authMessage
        ));
    }

    public function actionSalesReport() {
        \Yii::app()->setTheme(self::B2C_THEME);
        $reportdata = null;
        $cs = null;
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['clientSource'])) {
                $cs = (int) $_POST['clientSource'];
            }
        } else {
            $fromdate = date('Y-m-d', strtotime('0 days'));
            $todate = date('Y-m-d', strtotime('0 days'));

            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['clientSource'])) {
                $cs = (int) $_POST['clientSource'];
            }

            //\Utils::dbgYiiLog(['fromdate'=>$fromdate,'todate'=>$todate,'prevfromdate'=>$prevfromdate,'prevtodate'=>$prevtodate]);
        }
        if (\Authorization::getIsSuperAdminLogged()) {
            $data = \BookingLog::reportSalesReport($fromdate, $todate, $cs);
            $prevdata = \BookingLog::reportSalesReport($prevfromdate, $prevtodate, $cs);
        } else {
            $data = [];
            $prevdata = [];
        }


        $authMessage = '';
        if (isset($_GET['authMessage'])) {
            $authMessage = $_GET['authMessage'];
        }

        $this->layout = '//layouts/reports';
        //$this->render('//reports/source');
        $this->render('//reports/salesreport', array(
            'clientSources' => \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
            'data' => $data, 'prevdata' => $prevdata, 'datefrom' => $fromdate, 'dateto' => $todate, 'prevdatefrom' => $prevfromdate, 'prevdateto' => $prevtodate, 'cs' => $cs, 'authMessage' => $authMessage
        ));
    }

    public function actionAirCartDetailReport() {
        \Yii::app()->setTheme(self::B2C_THEME);
        //$this->render('//reports/airCartDetailReport');

        $reportdata = null;
        $cs = null;
        $csid = null;
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['services'])) {
                $cs = $_POST['services'];
            }
        } else {
            $fromdate = date('Y-m-d', strtotime('-1 days'));
            $todate = date('Y-m-d', strtotime('-1 days'));

            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
            if (isset($_POST['services'])) {
                $cs = $_POST['services'];
            }

            //\Utils::dbgYiiLog(['fromdate'=>$fromdate,'todate'=>$todate,'prevfromdate'=>$prevfromdate,'prevtodate'=>$prevtodate]);
        }
        if (isset(\Yii::app()->user->id)) {
            $csid = \ClientSource::getCSUsingUserInfoName();
        }

        //  $data=\AirCart::reportAirCart($fromdate,$todate,$cs);
        if (\Authorization::getIsSuperAdminorClientSourceLogged()) {
            if ($csid !== false) {
                $data = \AirCart::model()->with(array('airBookings' => array('with' => 'airRoutes', 'order' => 'ab.departure_ts asc', 'alias' => 'ab',), 'clientSource'))->findAll(array(
                    'condition' => 't.created>=:from and t.created<=:to and t.client_source_id=:csid and t.booking_status_id in (' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')',
                    "order" => "t.id DESC",
                    'params' => array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59', ':csid' => $csid)
                    ));
            } else {
                $data = \AirCart::model()->with(array('airBookings' => array('with' => 'airRoutes', 'order' => 'ab.departure_ts asc', 'alias' => 'ab',), 'clientSource'))->findAll(array(
                    'condition' => 't.created>=:from and t.created<=:to and t.booking_status_id in (' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_COMPLETE . ')',
                    "order" => "t.id DESC",
                    'params' => array(':from' => $fromdate . ' 00:00:00', ':to' => $todate . ' 23:59:59')
                    ));
            }
        } else {
            $data = [];
            $prevdata = [];
        }
        // $prevdata=\AirCart::reportAirCart($prevfromdate,$prevtodate,$cs);
        //Utils::dbgYiiLog($data);
        //exit();

        $authMessage = '';
        if (isset($_GET['authMessage'])) {
            $authMessage = $_GET['authMessage'];
        }

        $this->layout = '//layouts/reports';
        //$this->render('//reports/source');
        $this->render('//reports/cartreport', array(
            'services' => \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
            'data' => $data, 'datefrom' => $fromdate, 'dateto' => $todate, 'prevdatefrom' => $prevfromdate, 'prevdateto' => $prevtodate, 'cs' => $cs, 'authMessage' => $authMessage, 'csid' => $csid
        ));
    }

    public function actionAirLineReport() {
        \Yii::app()->setTheme(self::B2C_THEME);
        //$this->render('//reports/airLineReport');
        //$this->render('//reports/airLineReport');
        $reportdata = null;
        // $cs=null;
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
        } else {
            $fromdate = date('Y-m-d', strtotime('-15 days'));
            $todate = date('Y-m-d', strtotime('0 days'));

            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));



            //\Utils::dbgYiiLog(['fromdate'=>$fromdate,'todate'=>$todate,'prevfromdate'=>$prevfromdate,'prevtodate'=>$prevtodate]);
        }
        if (\Authorization::getIsSuperAdminLogged()) {
            $data = \BookingLog::reportAirLineReport($fromdate, $todate);
            $prevdata = \BookingLog::reportAirLineReport($prevfromdate, $prevtodate);
        } else {
            $data = [];
            $prevdata = [];
        }
        //Utils::dbgYiiLog($data);
        //exit();

        $authMessage = '';
        if (isset($_GET['authMessage'])) {
            $authMessage = $_GET['authMessage'];
        }

        $this->layout = '//layouts/reports';
        //$this->render('//reports/source');
        $this->render('//reports/airlinereport', array(
            'clientSources' => \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
            'data' => $data, 'prevdata' => $prevdata, 'datefrom' => $fromdate, 'dateto' => $todate, 'prevdatefrom' => $prevfromdate, 'prevdateto' => $prevtodate, 'authMessage' => $authMessage
        ));
    }

    public function actionAirLineOverviewReport() {
        \Yii::app()->setTheme(self::B2C_THEME);
        //$this->render('//reports/airLineOverviewReport');
        $reportdata = null;
        // $cs=null;
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));
        } else {
            $fromdate = date('Y-m-d', strtotime('-15 days'));
            $todate = date('Y-m-d', strtotime('0 days'));

            $date1 = new \DateTime($fromdate);
            $date2 = new \DateTime($todate);
            $diff = $date2->diff($date1)->format("%a");
            $diff++;

            $prevfromdate = date('Y-m-d', strtotime($fromdate . '-' . $diff . ' days'));
            $prevtodate = date('Y-m-d', strtotime($fromdate . ' -1 days'));



            //\Utils::dbgYiiLog(['fromdate'=>$fromdate,'todate'=>$todate,'prevfromdate'=>$prevfromdate,'prevtodate'=>$prevtodate]);
        }
        if (\Authorization::getIsSuperAdminLogged()) {
            $data = \BookingLog::reportAirLineOverviewReport($fromdate, $todate);
            $prevdata = \BookingLog::reportAirLineOverviewReport($prevfromdate, $prevtodate);
        } else {
            $data = [];
            $prevdata = [];
        }
        //Utils::dbgYiiLog($data);
        //exit();

        $authMessage = '';
        if (isset($_GET['authMessage'])) {
            $authMessage = $_GET['authMessage'];
        }

        $this->layout = '//layouts/reports';
        //$this->render('//reports/source');
        $this->render('//reports/airlineoverviewreport', array(
            'clientSources' => \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
            'data' => $data, 'prevdata' => $prevdata, 'datefrom' => $fromdate, 'dateto' => $todate, 'prevdatefrom' => $prevfromdate, 'prevdateto' => $prevtodate, 'authMessage' => $authMessage
        ));
    }

    /**
     * Send the Report as pdf file
     */
    public function actionAsPdf() {
        if (YII_DEBUG) {
            $host = 'http://' . \Yii::app()->request->serverName . \Yii::app()->theme->baseUrl;
        } else {
            $host = 'https://' . \Yii::app()->request->serverName . \Yii::app()->theme->baseUrl;
        }

        $header = '<head>
	 <title>CheapTicket.in</title>
        <link href="' . $host . '/css/bootstrap.min.css" rel="stylesheet">
        <link href="' . $host . '/css/style.css" rel="stylesheet">
        <link href="' . $host . '/css/animate.css" rel="stylesheet">
        <link href="' . $host . '/css/plugins/iCheck/custom.css" rel="stylesheet">
        <link href="' . $host . '/css/plugins/datapicker/datepicker3.css" rel="stylesheet">
        <link href="' . $host . '/css/responsive-style.css" rel="stylesheet"></head>';
        $reporthtml = '<html>' . $header . \Yii::app()->request->getPost('report') . '</html>';
        //\Utils::dbgYiiLog($reporthtml);
        \Yii::app()->pdf->send($reporthtml, "report.pdf");
    }

    /**
     * Send the Report as pdf file
     */
    public function actionAsEmail() {
        if (YII_DEBUG) {
            $host = 'http://' . \Yii::app()->request->serverName . \Yii::app()->theme->baseUrl;
        } else {
            $host = 'https://' . \Yii::app()->request->serverName . \Yii::app()->theme->baseUrl;
        }

        $header = '<head>
	 <title>CheapTicket.in</title>
        <link href="' . $host . '/css/bootstrap.min.css" rel="stylesheet">
        <link href="' . $host . '/css/style.css" rel="stylesheet">
        <link href="' . $host . '/css/animate.css" rel="stylesheet">
        <link href="' . $host . '/css/plugins/iCheck/custom.css" rel="stylesheet">
        <link href="' . $host . '/css/plugins/datapicker/datepicker3.css" rel="stylesheet">
        <link href="' . $host . '/css/responsive-style.css" rel="stylesheet"></head>';
        $reporthtml = '<html>' . $header . \Yii::app()->request->getPost('report') . '</html>';
        //\Utils::dbgYiiLog($reporthtml);
        $file = \Yii::app()->pdf->save($reporthtml, "report.pdf");

        $model = $this->loadModel($id);
        $usermail = \Yii::app()->request->getPost('email'); //$model->user->email;
        if ($usermail === null) {
            $usermail = $model->user->userInfo->email;
        }

        $model = $this;
        if ($usermail == null || empty($usermail))
            $usermail = $model->user->email;
        $bookingdate = date(TICKET_DATETIME_FORMAT, strtotime($model->created));
        $from = 'CheapTicket.co.in <ticket@cheapticket.in>';
        $fromemail = 'ticket@cheapticket.in';
        if ($model->bookingStatus->id == \BookingStatus::STATUS_BOOKED || $model->bookingStatus->id == \BookingStatus::STATUS_BOOKED_TO_BILL || $model->bookingStatus->id == \BookingStatus::STATUS_BOOKED_TO_CAPTURE || $model->bookingStatus->id == \BookingStatus::STATUS_COMPLETE) {
            $stsmsg = 'E-Ticket-CONFIRMED';
            $subjectmsg = '';
        } else if ($model->bookingStatus->id == \BookingStatus::STATUS_NEW) {
            $stsmsg = 'E-Ticket-<span style="color:red">PENDING</span>';
            $subjectmsg = 'Pending:';
        } else {
            $stsmsg = 'E-Ticket-<span style="color:red">' . $model->bookingStatus->name . '</span>';
            $subjectmsg = 'Pending:';
        }
        $email_content = $model->getSummaryWithDetailsforEmail();

        $email_content = '';
        $subject = $subjectmsg . ' CheapTicket E-Ticket Booking Id: ' . $model->id;
        //\Utils::dbgYiiLog($email_content);
        \Utils::sendMailWithAttachment($file, "E-ticket_$id.pdf", $usermail, $from, $email_content, $subject, $fromemail);
    }

    public function actionReportsLogin() {
        $userName = '';
        $passWord = '';
        $pageUrl = '';
        $authMessage = '';
        // \Utils::dbgYiiLog($_POST);
        $loginForm = new \LoginForm();
        $loginForm->username = \Yii::app()->request->getPost('LoginUname');
        $loginForm->password = \Yii::app()->request->getPost('LoginPword');
        $pageUrl = \Yii::app()->request->getPost('pageUrl');
        if ($loginForm->login()) {
            $userId = \Yii::app()->user->id;
            $user = \Users::model()->findByPk($userId);
            // \Utils::dbgYiiLog($user->userInfo->user_type_id);
            if ($user->userInfo->user_type_id === \UserType::superAdmin || $user->userInfo->user_type_id === \UserType::clientSource) {
                //\Utils::dbgYiiLog($user);
                \Yii::app()->request->redirect($pageUrl);
            }
            //  $authMessage = "You Are Not Authorised To View These Reports";
            $this->redirect(array($pageUrl, 'authMessage' => "You Are Not Authorised To View These Reports"));
        } else {
            $this->redirect(array($pageUrl, 'authMessage' => 'Wrong UserID or Password.<br> Try Again!'));
        }
    }

}
