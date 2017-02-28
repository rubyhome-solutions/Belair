<?php

use application\components\Reporting\Statistics;
use application\components\Cluster;

class ReportController extends Controller {

    public $layout = '//layouts/column1';

    /**
     * @return array action filters
     */
    public function filters() {
        return [
            'accessControl', // perform access control for CRUD operations
            'postOnly + getScreenData', // we only allow deletion via POST request
        ];
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return [
            ['allow',
                'actions' => ['opcache', 'opcacheReset', 'clearStats', 'b2Creport', 'appCacheReset', 'executeQuery'],
                'expression' => 'Authorization::getIsSuperAdminLogged()'
            ],
            ['allow',
                'actions' => ['pgStats', 'showPgStat', 'getLogFile', 'logFile'],
                'expression' => 'Authorization::getIsTopStaffLogged()'
            ],
            ['allow',
                'actions' => ['yatraReport', 'yatraNewReport', 'yatraAmadeusReport', 'receiptReport'],
                'expression' => 'Authorization::getIsTopStaffOrAccountantLogged()'
            ],
            ['allow',
                'actions' => ['index', 'getScreenData'],
                'users' => array('@'),
            ],
            ['allow',
                'actions' => ['opcacheLocalReset'],
                'users' => ['*'],
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex() {
        $this->render('index', [
            'serviceTypes' => CHtml::listData(ServiceType::model()->findAll(['order' => 'id', 'condition' => 'id<3']), 'id', 'name'),
            'cabinTypes' => CHtml::listData(CabinType::model()->findAll(['order' => 'id']), 'id', 'name'),
            'carriers' => CHtml::listData(Carrier::model()->findAll(['order' => 'name']), 'id', 'name'),
            'distributors' => CHtml::listData(UserInfo::model()->findAll(['order' => 'name', 'condition' => 'user_type_id=' . UserType::distributor]), 'id', 'name'),
            'clientSources' => CHtml::listData(ClientSource::model()->findAll(['order' => 'name']), 'id', 'name'),
            'clientTypes' => UserType::$ALL_CLIENT_TYPES,
            'airports' => CHtml::listData(Airport::model()->findAll(['order' => 'airport_code']), 'airport_code', 'airport_code'),
        ]);
    }

    public function actionGetScreenData() {
        $reportType = Yii::app()->request->getPost('reportType');
        if ($reportType) {
            $report = new application\components\Reporting\Report;
            // staffLogged attribte should not be manipulated in any way
            unset($_POST['staffLogged']);
            if (!Authorization::getIsStaffLogged()) {
                // Do not allow user_id settings when not staff
                unset($_POST['user_id']);
            }
            \Utils::setAttributes($report, $_POST);
//            echo \Utils::dbg($_POST);
            $report->render($reportType);
        }
    }

    public function actionYatraReport() {
        $reportType = '25';
        $fromdate = date('Y-m-d', strtotime('-1 days'));
        $todate = date('Y-m-d', strtotime('-1 days'));
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));

            $report = new application\components\Reporting\Report;
            $report->dateFrom = $fromdate;
            $report->dateTo = $todate;
            $out = $report->renderYatra($fromdate, $todate);

            if (empty($_POST['xlsFile'])) {    // HTML output
                $this->render('yatrareport', [
                    'data' => $out, 'datefrom' => $fromdate, 'dateto' => $todate,
                ]);
            } else {    // Excel output
//            $out .= "<style>th {background-color:lightgoldenrodyellow;}</style>";
                \Utils::html2xls($out, 'Yatra Sales' . '_' . date('Ymd_Hi') . '.xls');
            }
        } else {
            $this->render('yatrareport', [ 'data' => '', 'datefrom' => '', 'dateto' => '']);
        }
    }

    public function actionYatraNewReport() {
        $reportType = '25';
        $fromdate = date('Y-m-d', strtotime('-1 days'));
        $todate = date('Y-m-d', strtotime('-1 days'));
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));

            $report = new application\components\Reporting\Report;
            $report->dateFrom = $fromdate;
            $report->dateTo = $todate;
            $xls = false;
            if (isset($_POST['xlsFile'])) {
                $xls = true;
            }
            $out = $report->renderNewYatra($fromdate, $todate, $xls);

            if (empty($_POST['xlsFile'])) {    // HTML output
                $this->render('yatranewreport', [
                    'data' => $out, 'datefrom' => $fromdate, 'dateto' => $todate,
                ]);
            } else {    // Excel output
//            $out .= "<style>th {background-color:lightgoldenrodyellow;}</style>";
                \Utils::html2xls($out, 'Yatra Sales' . '_' . date('Ymd_Hi') . '.xls');
            }
        } else {
            $this->render('yatranewreport', [ 'data' => '', 'datefrom' => '', 'dateto' => '']);
        }
    }

    public function actionYatraAmadeusReport() {
        $reportType = '25';
        $fromdate = date('Y-m-d', strtotime('-1 days'));
        $todate = date('Y-m-d', strtotime('-1 days'));
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));

            $report = new application\components\Reporting\Report;
            $report->dateFrom = $fromdate;
            $report->dateTo = $todate;
            $xls = false;
            if (isset($_POST['xlsFile'])) {
                $xls = true;
            }
            $out = $report->renderYatraAmadeus($fromdate, $todate, $xls);

            if (empty($_POST['xlsFile'])) {    // HTML output
                $this->render('yatraamadeusreport', [
                    'data' => $out, 'datefrom' => $fromdate, 'dateto' => $todate
                ]);
            } else {    // Excel output
//            $out .= "<style>th {background-color:lightgoldenrodyellow;}</style>";
                \Utils::html2xls($out, 'Yatra Amadeus Sales' . '_' . date('Ymd_Hi') . '.xls');
            }
        } else {
            $this->render('yatraamadeusreport', [ 'data' => '', 'datefrom' => '', 'dateto' => '']);
        }
    }

    public function actionPgStats() {
        $this->render('pgDir');
    }

    public function actionShowPgStat() {
        $filename = Yii::app()->basePath . "/../../stats/pg/" . Yii::app()->request->getQuery('file');
        if (is_file($filename)) {
            echo file_get_contents($filename);
        } else {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
    }

    public function actionLogFile() {
        $logs = new \application\components\Reporting\LogFile;
        $this->render('logFile', ['fileList' => array_keys($logs->files)]);
    }

    public function actionGetLogFile() {
        $fileKey = Yii::app()->request->getPost('fileKey');
        $logs = new \application\components\Reporting\LogFile;
        if (array_key_exists($fileKey, $logs->files)) {
            if (is_file($logs->files[$fileKey])) {
                echo htmlentities(substr(file_get_contents($logs->files[$fileKey]), -100000), ENT_SUBSTITUTE );
            } else {
                echo "File not found!\nMaybe you should define the constant <b>" .
                \application\components\Reporting\LogFile::$constants[$fileKey] . "</b> in your local <b>debug.php</b> file";
            }
        } else {
            echo "Unknown log file";
        }
    }

    function actionClearStats($id) {
        application\components\Reporting\Statistics::resetStat($id);
        if ($id == application\components\Reporting\Statistics::CLEAR_DEEPLINK_RESPONSE_TIME_STATS) {
            echo \Utils::arr2table(application\components\Reporting\Statistics::getDeeplinkStats());
        }
    }

    public function actionReceiptReport() {

        $fromdate = date('Y-m-d', strtotime('-200 days'));
        $todate = date('Y-m-d', strtotime('-1 days'));
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));

            $report = new application\components\Reporting\Report;
            $report->dateFrom = $fromdate;
            $report->dateTo = $todate;
            $xls = false;
            if (isset($_POST['xlsFile'])) {
                $xls = true;
            }
            $out = $report->renderReceiptReport($fromdate, $todate, $xls);

            if (empty($_POST['xlsFile'])) {    // HTML output
                $this->render('receiptreport', [
                    'data' => $out, 'datefrom' => $fromdate, 'dateto' => $todate,
                ]);
            } else {    // Excel output
//            $out .= "<style>th {background-color:lightgoldenrodyellow;}</style>";
                \Utils::html2xls($out, 'Receipt Voucher' . '_' . date('Ymd_Hi') . '.xls');
            }
        } else {
            $this->render('receiptreport', [ 'data' => '', 'datefrom' => '', 'dateto' => '']);
        }
    }

    public function actionOpcache() {
        $this->render('opcache');
    }

    public function actionOpcacheReset() {
        opcache_reset();
        $this->redirect('/report/opcache');
    }

    public function actionAppCacheReset() {
        if (YII_DEBUG) {
            \Yii::app()->cache->flush();
            foreach ([Statistics::CLEAR_FARE_CHECK_STATS, Statistics::CLEAR_DEEPLINK_RESPONSE_TIME_STATS] as $key) {
                Statistics::resetStat($key);
            }
            Cluster::decideSlaveOrMaster();
            echo "App cache reset done!\n";
        } else {
            throw new \CHttpException(403, "Reseting the application cache is forbiden on production server(s). Ask the super-admin for assistance if you think this is needed.");
        }
    }

    public function actionOpcacheLocalReset() {
        if (\Yii::app()->request->userHostAddress == '127.0.0.1') {
            opcache_reset();
            echo "Opcache reset done!\n";
            \application\components\Cluster::slavesGitDeploy();
        } else {
            throw new \CHttpException(403, "Forbiden from: " . \Yii::app()->request->userHostAddress . PHP_EOL);
        }
    }

    public function actionB2Creport() {
        \Yii::app()->setTheme(self::B2C_THEME);
        $this->redirect(array('b2c/reports/clientSourceReport'));
    }

    /**
     * Added By Satender
     * Purpose : To execute SELECT statement from UI
     */
    public function actionExecuteQuery() {
        $qry = '';
        $error = null;
        if (isset($_POST) && !empty($_POST['qry']) && count($_POST) > 0) {
            $qry = 'SELECT ' .str_ireplace([';', 'SELECT', 'UPDATE', 'DELETE', 'INSERT', 'CC'], '', $_POST['qry']);
            $limit = stristr($qry, 'limit');
            if ($limit === FALSE) {
                $qry .= ' LIMIT 1000';
            } else {
                $qry = str_replace($limit, '', $qry);
                $limit = str_ireplace([' ', 'limit'], ['', ''], $limit);
                if ($limit > 1000) {
                    $qry .= 'LIMIT 1000';
                } else {
                    $qry .= 'LIMIT ' . $limit;
                }
            }
            $qry .= ';';

                try {
                    $data = Yii::app()->db->createCommand($qry)
                        ->queryAll();
                    \Utils::dbgYiiLog('Final Query executed By User:'.\Yii::app()->user->name);
                    \Utils::dbgYiiLog($qry);
                    
                    $html = $this->renderHtml($data);
                    \Utils::html2xls($html, 'QueryResult' . '_' . date('Ymd_Hi') . '.xls');
                } catch (Exception $e) {
                    \Utils::dbgYiiLog('Wrong query executed By User:'.\Yii::app()->user->name);
                    $error = $e->getMessage();
                }
            }

        $this->render('executequery', [
            'qry' => $qry,
            'error' => $error
        ]);
    }

    private function renderHtml($data) {
        $html = '';
        if (count($data) > 0) {
            $row_header = [];
            foreach ($data[0] as $key => $val) {
                /*
                  $label=ucwords(trim(strtolower(str_replace(array('-','_'),' ',preg_replace('/(?<![A-Z])[A-Z]/', ' \0', $key)))));
                  $label=preg_replace('/\s+/',' ',$label);
                  if(strcasecmp(substr($label,-3),' id')===0)
                  $label=substr($label,0,-3);
                  if($label==='Id')
                  $label='ID';
                  $label=str_replace("'","\\'",$label);
                 * 
                 */
                $row_header [$key] = $key;
            }

            $html .='<table class="table table-condensed table-bordered table-hover" style="width: 80%;"><tr>';
            $html .= '<th>#</th>';
            foreach ($row_header as $colname) {
                $html .= '<th>' . $colname . '</th>';
            }
            $html .='</tr>';

            $i = 1;
            foreach ($data as $row) {
                $html .='<tr>
                <td>' . $i++ . '</td>';
                foreach ($row_header as $col_key => $colname) {
                    $html .= '<td>' . $row[$col_key] . '</td>';
                }
                $html .='</tr>';
            }
            $html .='</table>';
        }
        return $html;
    }

}
