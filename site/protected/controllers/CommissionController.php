<?php

class CommissionController extends Controller {

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
        return array(
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('admin', 'index', 'addRule', 'delete', 'update', 'saveRule',
                    'recalcCommission', 'paymentConvenienceFee', 'paymentConvenienceFeeUpdate',
                    'paymentConvenienceFeeCreate', 'paymentConvenienceFeeDelete', 'getPaymentSubType'
                ),
                'expression' => '\Authorization::getIsTopStaffOrAccountantLogged()'
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('getProfitReport', 'getPromoReport', 'clientSourceCostReport'),
                'expression' => '\Authorization::getIsProfitReportAuthorized()'
            ),
            array('allow', // allow admin user to perform 'admin' and 'delete' actions
                'actions' => array('clientSourceCost', 'clientCostCreate', 'renameCSType', 'clientCostDelete',
                    'pgCost', 'pgCostCreate', 'renamePGType', 'pgCostDelete',
                    'gdsCost', 'gdsCostCreate', 'renameGDSType', 'gdsCostDelete',
                    'getCsCost'),
                'expression' => '\Authorization::getIsSuperAdminLogged()'
            ),
            array('deny', // deny all users
                'users' => array('*'),
            ),
        );
    }

    /**
     * Updates a particular model.
     * If update is successful, the browser will be redirected to the 'view' page.
     * @param integer $id the ID of the model to be updated
     */
    public function actionUpdate() {
        $this->render('update', [
            'ruleId' => Yii::app()->session->get('commissionRuleId')
        ]);
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
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Lists all models.
     */
    public function actionIndex() {
        $this->redirect('/commission/update');
    }

    /**
     * Returns the data model based on the primary key given in the GET variable.
     * If the data model is not found, an HTTP exception will be raised.
     * @param integer $id the ID of the model to be loaded
     * @return CommissionRule the loaded model
     * @throws CHttpException
     */
    public function loadModel($id) {
        $model = CommissionRule::model()->findByPk($id);
        if ($model === null) {
            throw new CHttpException(404, 'The requested page does not exist.');
        }
        return $model;
    }

    function actionAddRule() {
        $rule = new \CommissionRule;
        $rule->air_source_id = Yii::app()->request->getPost('air_source_id');
        $rule->air_source_id = is_numeric($rule->air_source_id) ? $rule->air_source_id : null;
        $rule->service_type_id = Yii::app()->request->getPost('service_type_id');
        $rule->service_type_id = is_numeric($rule->service_type_id) ? $rule->service_type_id : null;
        $rule->carrier_id = Yii::app()->request->getPost('carrier_id');
        $rule->carrier_id = is_numeric($rule->carrier_id) ? $rule->carrier_id : null;
        if (Yii::app()->request->getPost('ruleFilter')) {   // It is a filter request do not create new rule
            Yii::app()->session->add('commission_filter_air_source_id', $rule->air_source_id);
            Yii::app()->session->add('commission_filter_service_type_id', $rule->service_type_id);
            Yii::app()->session->add('commission_filter_carrier_id', $rule->carrier_id);
            Yii::app()->session->remove('commissionRuleId');
        } else {    // Create new rule
            $filter = new \CommercialFilter;
            $rule->filter = $filter->getAsString();
            $rule->insert();
            Yii::app()->session->add('commissionRuleId', $rule->id);
        }
        $this->redirect('/commission/update');
    }

    function actionSaveRule() {
        $rule = new \CommissionRule;
        if (isset($_POST['CommissionRule']) && isset($_POST['CommercialFilter'])) {
            $rule->attributes = $_POST['CommissionRule'];
            $rule->isNewRecord = false;
            $filter = new \CommercialFilter;
            $filter->setAttributes($_POST['CommercialFilter']);
            $rule->filter = $filter->getAsString();
            if ($rule->validate()) {
                $rule->save();
                if (Yii::app()->request->getPost('copyRule')) {
                    $rule->id = null;
                    $rule->isNewRecord = true;
                    $rule->order_++;
                    $rule->insert();
                    Yii::app()->session->add('commissionRuleError', [['New rule is created. Please check and confirm the rule priority!']]);
                } else {
                    Yii::app()->session->remove('commissionRuleError');
                    // Go to test the rule
                    if (Yii::app()->request->getPost('testRule')) {
                        Yii::app()->session->add('commissionRuleId', $rule->id);
                        // Remove old filters
//                        Yii::app()->session->remove('RouteCacheFilter');
                        // Redirect with preset filters
                        $this->redirect("/routesCache/admin?" . http_build_query([
                                'RoutesCache[carrier_id]' => $rule->carrier_id ? $rule->carrier->code : null,
                                'RoutesCache[air_source_id]' => $rule->air_source_id ? : null
                        ]));
                    }
                }
            } else {
                Yii::app()->session->add('commissionRuleError', $rule->getErrors());
            }
        }

        Yii::app()->session->add('commissionRuleId', $rule->id);
        $this->redirect('/commission/update');
    }

    /**
     * Manage ClientSource Cost  Rule
     */
    public function actionClientSourceCost() {
        $model = new \CommisionClientSource('search');
        $model->unsetAttributes();
        if (isset($_GET['CommisionClientSource'])) {
            $model->attributes = $_GET['CommisionClientSource'];
        }
        $this->render('commision_cs_grid', ['model' => $model]);
    }

    /**
     * Rename airline
     */
    public function actionRenameCSType() {
        $id = Yii::app()->request->getPost('id');
        if ($id) {
            $model = \CommisionClientSource::model()->findByPk($id);
            if ($model !== null) {
                $field = Yii::app()->request->getPost('name');
                $model->$field = Yii::app()->request->getPost('value');
                if ($model->validate()) {
                    $model->update([$field]);
                }
            }
        }
    }

    public function actionClientCostCreate() {
        $model = new CommisionClientSource;
        if (isset($_POST['PF'])) {
            $model->attributes = $_POST['PF'];
            if (empty($_POST['PF']['amount'])) {
                $model->amount = 0;
            }
            $model->save();
        }
        \Utils::jsonResponse('');
    }

    public function actionClientCostDelete($id) {
        if (Yii::app()->request->isPostRequest) {
            // we only allow deletion via POST request
            $model = CommisionClientSource::model()->findByPk($id);
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Manage Payment Gateway Cost  Rule
     */
    public function actionPgCost() {
        $model = new \CommisionPg('search');
        $model->unsetAttributes();
        if (isset($_GET['CommisionPg'])) {
            $model->attributes = $_GET['CommisionPg'];
        }
        $this->render('commision_pg_grid', ['model' => $model]);
    }

    public function actionRenamePGType() {
        $id = Yii::app()->request->getPost('id');
        if ($id) {
            $model = \CommisionPg::model()->findByPk($id);
            if ($model !== null) {
                $field = Yii::app()->request->getPost('name');
                $model->$field = Yii::app()->request->getPost('value');
                if ($model->validate()) {
                    $model->update([$field]);
                }
            }
        }
    }

    public function actionPgCostCreate() {
        $model = new CommisionPg;

        if (isset($_POST['PG'])) {
            $model->attributes = $_POST['PG'];
            if (empty($_POST['PG']['amount'])) {
                $model->amount = 0;
            }
            $model->save();
        }
        \Utils::jsonResponse('');
    }

    public function actionPgCostDelete($id) {
        if (Yii::app()->request->isPostRequest) {
            // we only allow deletion via POST request
            $model = CommisionPg::model()->findByPk($id);
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /**
     * Manage GDS/LLC Cost  Rule
     */
    public function actionGdsCost() {
        $model = new \CommisionGdsLcc('search');
        $model->unsetAttributes();
        if (isset($_GET['CommisionGdsLcc'])) {
            $model->attributes = $_GET['CommisionGdsLcc'];
        }
        $this->render('commision_gds_grid', ['model' => $model]);
    }

    public function actionRenameGDSType() {
        $id = Yii::app()->request->getPost('id');
        if ($id) {
            $model = \CommisionGdsLcc::model()->findByPk($id);
            if ($model !== null) {
                $field = Yii::app()->request->getPost('name');
                $model->$field = Yii::app()->request->getPost('value');
                if ($model->validate()) {
                    $model->update([$field]);
                }
            }
        }
    }

    public function actionGdsCostCreate() {
        $model = new CommisionGdsLcc;

        if (isset($_POST['PG'])) {
            $model->attributes = $_POST['PG'];
            if (empty($_POST['PG']['amount'])) {
                $model->amount = 0;
            }
            $model->save();
        }
        \Utils::jsonResponse('');
    }

    public function actionGdsCostDelete($id) {
        if (Yii::app()->request->isPostRequest) {
            // we only allow deletion via POST request
            $model = CommisionGdsLcc::model()->findByPk($id);
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    public function actionGetCsCost() {
        $fromdate = date('Y-m-d', strtotime('-1 days'));
        $todate = date('Y-m-d', strtotime('-1 days'));
        if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
            $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
            $todate = date('Y-m-d', strtotime($_POST['dateTo']));

            $cscosts = \CommisionCsCost::model()->findAll(array(
                'condition' => '(t.cost_date>=\'' . $fromdate . '\' and t.cost_date<=\'' . $todate . '\' )',
                'order' => 't.cost_date',
                'limit' => '10000'
            ));
            $this->render('commision_cs_cost_grid', [
                'data' => $cscosts, 'datefrom' => $fromdate, 'dateto' => $todate,
            ]);
        } else {
            $cscosts = \CommisionCsCost::model()->findAll(array(
                'condition' => '(t.cost_date>=\'' . $fromdate . '\' and t.cost_date<=\'' . $todate . '\' )',
                'order' => 't.cost_date',
                'limit' => '1000'
            ));

            $this->render('commision_cs_cost_grid', [ 'data' => $cscosts, 'datefrom' => $fromdate, 'dateto' => $todate]);
        }
    }

    public function actionGetProfitReport() {
        $fromdate = date('Y-m-d');
        $todate = date('Y-m-d');
        $carts = [];
        $client_source_id = null;
        $airline_id = null;
        $way_type = null;
        $profitloss = null;
        if (isset($_POST) && count($_POST) > 0) {
            if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
                $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
                $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            }
            $condition = ' (t.created>=\'' . $fromdate . ' 00:00:00' . '\' and t.created<=\'' . $todate . ' 23:59:59' . '\' ) ';

            if (!empty($_POST['clientSource'])) {
                $client_source_id = $_POST['clientSource'];
                $condition.=' and t.client_source_id=' . $client_source_id;
            }
            if (!empty($_POST['airline'])) {
                $airline_id = $_POST['airline'];
                $condition.='  and ab.carrier_id=' . $airline_id;
            }
            if (!empty($_POST['profitloss'])) {
                $profitloss = $_POST['profitloss'];
            }

            if (!empty($_POST['way_type'])) {
                $way_type = $_POST['way_type'];
                $condition.='  and ab.service_type_id=' . $way_type;
            }
            $condition.=' and t.booking_status_id in (' . \BookingStatus::STATUS_BOOKED . ',' . \BookingStatus::STATUS_CANCELLED . ',' . \BookingStatus::STATUS_COMPLETE . ',' . \BookingStatus::STATUS_BOOKED_TO_CAPTURE . ',' . \BookingStatus::STATUS_BOOKED_TO_BILL . ',' . \BookingStatus::STATUS_PARTIALLY_BOOKED . ')';

            $carts = \AirCart::model()->with(array('airBookings' => array('with' => array('amendments', 'airRoutes'))))->findAll(array(
                'join' => 'INNER JOIN air_booking  as ab 
                      on ab.air_cart_id = t.id  ',
                'condition' => $condition,
                'order' => 't.id',
                'limit' => '10000'
            ));


//            $carts = \AirCart::model()->with(array('airBookings'))->findAll(array(
//               'join'=>'INNER JOIN air_booking  as ab 
//                      on ab.air_cart_id = t.id  ',
//                'condition' => $condition,
//                'order'=>'t.id',
//                'limit' => '10000'
//            ));
        }
        if (empty($_POST['xlsFile'])) {
            $this->render('profitreport', [
                'data' => $carts, 'datefrom' => $fromdate, 'dateto' => $todate, 'client_source_id' => $client_source_id, 'airline_id' => $airline_id, 'way_type' => $way_type, 'profitloss' => $profitloss
            ]);
        } else {
            $final = $this->renderProfit($carts, $profitloss);
            \Utils::html2xls($final, 'Profit Report' . '_' . date('Ymd_Hi') . '.xls');
        }
    }

    private function renderProfit($data, $profitloss) {

        $final = '';

        if (count($data) > 0) {
            $final .= '<table class="table table-condensed table-bordered table-hover" style="width: 80%;">
        <tr> 
        <th>S.No</th>
        <th>AirCart Id</th>
        <th>Client Source</th>
        <th>Summary</th>
        <th>Cart Amount</th>
        <th>Total Effect</th>
        <th>Total Effect as %</th>
        <th>Commercial</th>
        <th>Commission</th>
        <th>Client Source Cost</th>
        <th>PG Cost</th>
        <th>GDS/LCC Profit</th>
        <th>Amendment Profit</th>
        </tr>';
            $i = 1;
            $total = 0;
            $c1total = 0;
            $c2total = 0;
            $c3total = 0;
            $c4total = 0;
            $c5total = 0;
            $c6total = 0;
            $carttotal = 0;
            $out = [];
            foreach ($data as $cart) {
                $c1 = $cart->getTotalCommercialNetEffect() - $cart->promoDiscount;
                $c2 = $cart->getTotalCommission();
                $c3 = -1 * (double) $cart->getCostOnCS();
                $c4 = -1 * (double) $cart->getCostOnPG() + $cart->convenienceFee;
                $c5 = (double) $cart->getProfitOnGDSLCC();
                $c6 = 0;

                $out = [];
                foreach ($cart->airBookings as $airBooking) {
                    foreach ($airBooking->amendments as $amendment) {
                        if ($amendment->amendment_status_id !== AmendmentStatus::STATUS_CANCELLED) {
                            $c6+=$amendment->reseller_amendment_fee;
                        }
                        if ($airBooking->ab_status_id !== \AbStatus::STATUS_CANCELLED) {
                            $c1 -= $amendment->reseller_amendment_fee;
                        }
                    }
                    if (empty($airBooking->airRoutes)) {
                        continue;
                    }
                    $key = $airBooking->airRoutes[0]->carrier->code . "-" . $airBooking->airRoutes[0]->flight_number . " " .
                        date('d-M', strtotime($airBooking->departure_ts));
                    if (isset($out[$key])) {
                        $out[$key] ++;
                    } else {
                        $out[$key] = 1;
                    }
                }
                if ($cart->booking_status_id == \BookingStatus::STATUS_CANCELLED) {
                    $c1 = 0;
                    $c2 = 0;
                    $c5 = 0;
                }
                $total_row = $c1 + $c2 + $c3 + $c4 + $c5 + $c6;
                if (!empty($profitloss)) {
                    if ($profitloss == 'Profit' && $total_row < 0) {
                        continue;
                    } else if ($profitloss == 'Loss' && $total_row > 0) {
                        continue;
                    }
                }
                $c1total+=$c1;
                $c2total+=$c2;
                $c3total+=$c3;
                $c4total+=$c4;
                $c5total+=$c5;
                $total+=$total_row;
                $c6total+=$c6;

                $totalp = $cart->totalAmount();
                $carttotal+=$totalp;
                if ($totalp == 0) {
                    $totalp = 1;     // Fix case when fares are not attached.
                }
                $tot_effect_perc = round(100 * ($total_row) / $totalp, 2) . "%";
                $final .='<tr><td>' . $i++ . '</td>' .
                    '<td>' . $cart->id . '</td>' .
                    '<td>' . $cart->clientSource->name . '</td>' .
                    '<td>' . str_replace(['=', '&', '+'], [' x', '<br>', ' '], http_build_query($out)) . '</td>' .
                    '<td>' . $totalp . '</td>' .
                    '<td>' . $total_row . '</td>' .
                    '<td>' . $tot_effect_perc . '</td>' .
                    '<td>' . $c1 . '</td>' .
                    '<td>' . $c2 . '</td>' .
                    '<td>' . $c3 . '</td>' .
                    '<td>' . $c4 . '</td>' .
                    '<td>' . $c5 . '</td>' .
                    '<td>' . $c6 . '</td>' . '</tr>';
            }
            $tot = '0%';
            if ($carttotal != 0) {
                $tot = round(100 * ($total) / $carttotal, 2) . "%";     // Fix case when fares are not attached.
            }

            $final .='<tr><td>' . "<b>Total</b>" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . $carttotal . '</td>' .
                '<td>' . $total . '</td>' .
                '<td>' . $tot . '</td>' .
                '<td>' . $c1total . '</td>' .
                '<td>' . $c2total . '</td>' .
                '<td>' . $c3total . '</td>' .
                '<td>' . $c4total . '</td>' .
                '<td>' . $c5total . '</td>' .
                '<td>' . $c6total . '</td>' . '</tr>';
            $final .='</table>';

            return $final;
        }
    }

    public function actionGetPromoReport() {
        $fromdate = date('Y-m-d', strtotime('-1 days'));
        $todate = date('Y-m-d', strtotime('-1 days'));
        $carts = [];
        $way_type = null;
        $promocodes = null;

        if (isset($_POST) && count($_POST) > 0) {
            if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
                $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
                $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            }
            $condition = ' (t.created>=\'' . $fromdate . ' 00:00:00' . '\' and t.created<=\'' . $todate . ' 23:59:59' . '\' ) ';
            if (!empty($_POST['promocodes'])) {
                $promocodes = $_POST['promocodes'];
                $condition.='  and t.promo_codes_id IN(' . $promocodes . ')';
            }
            if (!empty($_POST['way_type'])) {
                $way_type = $_POST['way_type'];
                $condition.='  and ab.service_type_id=' . $way_type;
            }

            if (!empty($_POST['way_type'])) {
                $way_type = $_POST['way_type'];
                $condition.='  and ab.service_type_id=' . $way_type;
            }
            $condition.=' and t.booking_status_id = ' . \BookingStatus::STATUS_BOOKED;

            $condition .= ' AND t.promo_codes_id IS NOT NULL';
            $carts = \AirCart::model()->with(array('airBookings' => array('with' => array('amendments', 'airRoutes'))))->findAll(array(
                'join' => 'INNER JOIN air_booking  as ab 
                      on ab.air_cart_id = t.id  ',
                'condition' => $condition,
                'order' => 't.id',
                'limit' => '10000'
            ));
        }

        $html = $this->renderHtml($carts);

        if (empty($_POST['xlsFile'])) {
            $this->render('promoreport', [
                'datefrom' => $fromdate, 'dateto' => $todate, 'way_type' => $way_type, 'html' => $html
            ]);
        } else {
            \Utils::html2xls($html, 'Promo Sales' . '_' . date('Ymd_Hi') . '.xls');
        }
    }

    private function renderHtml($data) {
        $html = '';
        if (count($data) > 0) {
            $html .='<table class="table table-condensed table-bordered table-hover" style="width: 80%;">
                    <tr> 
                        <th>S.No</th>
                        <th>AirCart Id</th>
                        <th>Booking Date</th>
                        <th>Promo</th>
                        <th>Sector</th>
                        <th>DOM/INT</th>
                    </tr>';

            $i = 1;
            foreach ($data as $cart) {

                $html .='<tr>
                <td>' . $i++ . '</td>';
                if (empty($_POST['xlsFile'])) {
                    $html .='<td><a href="/airCart/view/' . $cart->id . '" target="_blank">' . $cart->id . '</a></td>';
                } else {
                    $html .='<td>' . $cart->id . '</td>';
                }
                $html .='<td>' . \Utils::cutMilliseconds($cart->created) . '</td>' .
                    '<td>' . ((!empty($cart->promo_codes_id)) ? $cart->promoCode->code : '-') . '</td>' .
                    '<td>' . $cart->sector . '</td>' .
                    '<td>' . (($cart->isInternational()) ? 'INT' : 'DOM') . '</td>' .
                    '</tr>';
            }
            $html .='</table>';
        }
        return $html;
    }

    function actionRecalcCommission() {
        $ab = \AirBooking::model()->findByPk(\Yii::app()->request->getPost('ab'));
        if ($ab) {
            $ab->calcCommission(true);
            echo $ab->profit;
        }
    }

    /**
     * Manage Payment Convenience Fee
     */
    public function actionPaymentConvenienceFee() {
        $model = new \PaymentConvenienceFee('search');
        $model->unsetAttributes();
        if (isset($_GET['PaymentConvenienceFee'])) {
            $model->attributes = $_GET['PaymentConvenienceFee'];
        }
        $this->render('pcf_grid', ['model' => $model]);
    }

    public function actionGetPaymentSubType($id) {
        $result = [];
        $sub_type = PaymentConfiguration::$paymentSubTypeMap[$id];
        foreach ($sub_type as $key => $name) {
            $obj = [];
            $obj ['id'] = $key;
            $obj ['name'] = $name;
            $result[] = $obj;
        }
        \Utils::jsonResponse($result);
    }

    public function actionPaymentConvenienceFeeCreate() {
        $model = new PaymentConvenienceFee;

        if (isset($_POST['PaymentConvenienceFee'])) {
            $model->attributes = $_POST['PaymentConvenienceFee'];
            if ($model->save())
                $this->redirect(array('paymentConvenienceFee'));
        }
        // For creation from commercial rule
        if (Yii::app()->request->getQuery('rule_id') !== null) {
            $model->commercial_rule_id = Yii::app()->request->getQuery('rule_id');
        } else {
            $model->commercial_rule_id = \PaymentConvenienceFee::DEFAULT_RULE_ID;
        }
        if (Yii::app()->request->getQuery('source_id') !== null) {
            $model->client_source_id = Yii::app()->request->getQuery('source_id');
        }
        if (Yii::app()->request->getQuery('trip_type') !== null) {
            $model->journey_type = Yii::app()->request->getQuery('trip_type');
        }
        $this->render('pcf_create', array(
            'model' => $model,
        ));
    }

    /**
     * Update Payment Convenience Fee
     */
    public function actionPaymentConvenienceFeeUpdate($id) {
        $model = \PaymentConvenienceFee::model()->findByPk($id);

        if (isset($_POST['PaymentConvenienceFee'])) {
            $model->attributes = $_POST['PaymentConvenienceFee'];
            if ($model->save()) {
                $this->redirect(array('paymentConvenienceFee'));
            }
        }

        $this->render('pcf_update', array(
            'model' => $model,
        ));
    }

    public function actionPaymentConvenienceFeeDelete($id) {
        if (Yii::app()->request->isPostRequest) {
            // we only allow deletion via POST request
            $model = PaymentConvenienceFee::model()->findByPk($id);
            $model->delete();
        } else {
            throw new CHttpException(400, 'Invalid request. Please do not repeat this request again.');
        }
    }

    /** Added by Akshay
     * For Client Source Cost Report
     */
    public function actionClientSourceCostReport() {
        $fromdate = date('Y-m-d');
        $todate = date('Y-m-d');
        $carts = [];
        $client_source_id = null;
        $airline_id = null;
        $way_type = null;
        $profitloss = null;
        if (isset($_POST) && count($_POST) > 0) {
            if (isset($_POST['dateFrom']) && isset($_POST['dateTo']) && !empty($_POST['dateFrom']) && !empty($_POST['dateTo'])) {
                $fromdate = date('Y-m-d', strtotime($_POST['dateFrom']));
                $todate = date('Y-m-d', strtotime($_POST['dateTo']));
            }
            $condition = ' (t.created>=\'' . $fromdate . ' 00:00:00' . '\' and t.created<=\'' . $todate . ' 23:59:59' . '\' ) ';

            if (!empty($_POST['clientSource'])) {
                $client_source_id = $_POST['clientSource'];
                $condition.=' and t.client_source_id=' . $client_source_id;
            }
            if (!empty($_POST['airline'])) {
                $airline_id = $_POST['airline'];
                $condition.='  and ab.carrier_id=' . $airline_id;
            }

            if (!empty($_POST['way_type'])) {
                $way_type = $_POST['way_type'];
                $condition.='  and ab.service_type_id=' . $way_type;
            }
            $condition.=' and t.booking_status_id =' . \BookingStatus::STATUS_BOOKED;

            $carts = \AirCart::model()->with(array('airBookings' => array('with' => array('amendments', 'airRoutes'))))->findAll(array(
                'join' => 'INNER JOIN air_booking  as ab 
                      on ab.air_cart_id = t.id  ',
                'condition' => $condition,
                'order' => 't.id',
                'limit' => '10000'
            ));
        }
        if (empty($_POST['xlsFile'])) {
            $this->render('clientsourcereport', ['data' => $carts, 'datefrom' => $fromdate, 'dateto' => $todate, 'client_source_id' => $client_source_id, 'airline_id' => $airline_id, 'way_type' => $way_type, 'profitloss' => $profitloss]);
        } else {
            $report = $this->renderClientSourceCost($carts);
            \Utils::html2xls($report, 'Client Source Cost Report' . '_' . date('Ymd_Hi') . '.xls');
        }
    }

    /** Added by Akshay
     * For Client Source Cost Report download as xls file
     */
    private function renderClientSourceCost($data) {
        $report = '';
        if (count($data) > 0) {
            $report .= '<table class="table table-condensed table-bordered table-hover" style="width: initial;">
            <tr></tr>
            <tr><th>Client Source Cost Report</th> </tr>
            <tr></tr>
            <tr>
            <th>Id</th>
            <th>Created</th>
            <th>Sector</th>
            <th>Summary</th>
            <th>Client Source</th>
            <th>Client Source Cost</th>
            <th>Dom/Int</th>
            <th>Total Effect</th>
            <th>Cart Amount</th> 
        </tr>';
            $summaryHtml = '';
            $summaryHtml .= '<table class="table table-condensed table-bordered table-hover" style="width: initial;">
            <tr><th>Client Source Cost Summary</th></tr>
            <tr>
            <th>Client Source</th>
            <th>DOM/INT</th>
            <th>Total Value</th>
            <th>CS Cost</th>
            <th>CS Cost %</th>
            </tr>
            ';
            $created = 0;
            $sector = 0;
            $carriertype = 0;
            $cartamount = 0;
            $total = 0;
            $c1total = 0;
            $c2total = 0;
            $c3total = 0;
            $c4total = 0;
            $c5total = 0;
            $c6total = 0;
            $carttotal = 0;
            $data_summary = [];
            foreach ($data as $cart) {
                $created = Utils::cutSecondsAndMilliseconds($cart->created);
                $sector = $cart->getSector();
                $carriertype = $cart->isInternational() ? "INT" : "DOM";
                if (!empty($way_type)) {
                    if (($way_type == \CommisionClientSource::WAYTYPE_DOMESTIC && $carriertype == 'INT') ||
                        ($way_type == \CommisionClientSource::WAYTYPE_INTERNATIONAL && $carriertype == 'DOM')) {
                        continue;
                    }
                }
                $cartamount = $cart->totalAmount();
                $c1 = $cart->getTotalCommercialNetEffect() - $cart->promoDiscount;
                $c2 = $cart->getTotalCommission();
                $c3 = -1 * (double) $cart->getCostOnCS();
                $c4 = -1 * (double) $cart->getCostOnPG() + $cart->convenienceFee;
                $c5 = (double) $cart->getProfitOnGDSLCC();
                $c6 = 0;
                if (empty($data_summary[$cart->clientSource->name][$carriertype]['cart_tot'])) {
                    $data_summary[$cart->clientSource->name][$carriertype]['cart_tot'] = $cartamount;
                } else {
                    $data_summary[$cart->clientSource->name][$carriertype]['cart_tot'] += $cartamount;
                }
                if (empty($data_summary[$cart->clientSource->name][$carriertype]['cs_cost'])) {
                    $data_summary[$cart->clientSource->name][$carriertype]['cs_cost'] = $c3;
                } else {
                    $data_summary[$cart->clientSource->name][$carriertype]['cs_cost'] += $c3;
                }
                if ($cart->booking_status_id == \BookingStatus::STATUS_CANCELLED) {
                    $c1 = 0;
                    $c2 = 0;
                    $c5 = 0;
                }
                if (!empty($profitloss)) {
                    if ($profitloss == 'Profit' && $total_row < 0) {
                        continue;
                    } else if ($profitloss == 'Loss' && $total_row > 0) {
                        continue;
                    }
                }
                $out = [];
                foreach ($cart->airBookings as $airBooking) {
                    foreach ($airBooking->amendments as $amendment) {
                        if ($amendment->amendment_status_id !== AmendmentStatus::STATUS_CANCELLED) {
                            $c6+=$amendment->reseller_amendment_fee;
                        }
                    }
                    if (empty($airBooking->airRoutes)) {
                        continue;
                    }

                    $key = $airBooking->airRoutes[0]->carrier->code . "-" . $airBooking->airRoutes[0]->flight_number . " " .
                        date('d-M', strtotime($airBooking->departure_ts));
                    if (isset($out[$key])) {
                        $out[$key] ++;
                    } else {
                        $out[$key] = 1;
                    }
                }
                $c1 -= $c6;
                $c1total+=$c1;
                $c2total+=$c2;
                $c3total+=$c3;
                $c4total+=$c4;
                $c5total+=$c5;
                $c6total+=$c6;
                $total_row = $c1 + $c2 + $c3 + $c4 + $c5 + $c6;
                $total+=$cartamount;

                $report .='<tr><td>' . $cart->id . '</td>' .
                    '<td>' . $created . '</td>' .
                    '<td>' . $sector . '</td>' .
                    '<td>' . str_replace(['=', '&', '+'], [' x', '<br>', ' '], http_build_query($out)) . '</td>' .
                    '<td>' . $cart->clientSource->name . '</td>' .
                    '<td>' . $c3 . '</td>' .
                    '<td>' . $carriertype . '</td>' .
                    '<td>' . $total_row . '</td>' .
                    '<td>' . $cartamount . '</td>' .
                    '</tr>';
            }
            $report .='<tr><td>' . "<b>Total</b>" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "" . '</td>' .
                '<td>' . "<b> $total </b>" . '</td>' . '</tr>';
        }
        foreach ($data_summary as $cs => $summary) {

            foreach ($summary as $dom_int => $info) {
                $res = 0;
                if (!empty($info['cs_cost'])) {
                    $res = round($info['cart_tot'] / ($info['cs_cost'] * 100), 2);
                }
                $summaryHtml.='<tr><td>' . $cs . '</td>' .
                    '<td>' . $dom_int . ' </td>' .
                    '<td>' . $info['cart_tot'] . ' </td>' .
                    '<td>' . $info['cs_cost'] . '</td>' .
                    '<td>' . $res . '</td>' . '</tr>';
            }
        }
        $summaryHtml.='</table>';
        $report = $summaryHtml . $report;
        $report .= '</table>';
        return $report;
    }

}
