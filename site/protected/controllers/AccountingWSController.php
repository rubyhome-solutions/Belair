<?php

class AccountingWSController extends CController {

    public function actions() {
        return array(
            'services' => array(
                'class' => 'CWebServiceAction',
            ),
        );
    }

    /**
     * @param string the username
     * @param string the password
     * @return string Return invoice xml for accounting system
     * @soap
     */
    public function getInvoiceXML($username, $password) {
        $model = new LoginForm;
        $model->username = $username;
        $model->password = $password;
        if (!$model->validate() || !$model->login())
            return 'Invalid Credential';
        else {
            $user = Users::model()->findByPk(Yii::app()->user->id);
            if ($user->userInfo->user_type_id == \UserType::busyaccounting || $user->userInfo->user_type_id == \UserType::superAdmin)
                return \AirCart::getInvoiceXML();
            else
                return 'Not Authrozied for this action';
        }
    }

    /**
     * @param string the username
     * @param string the password
     * @return string Return amendment xml for accounting system
     * @soap
     */
    public function getAmendmentXML($username, $password) {

        $model = new LoginForm;
        $model->username = $username;
        $model->password = $password;
        if (!$model->validate() || !$model->login())
            return 'Invalid Credential';
        else {
            $user = Users::model()->findByPk(Yii::app()->user->id);
            if ($user->userInfo->user_type_id == \UserType::busyaccounting || $user->userInfo->user_type_id == \UserType::superAdmin)
                return \Amendment::getAmendmentXML();
            else
                return 'Not Authrozied for this action';
        }
    }

    /**
     * @param string the username
     * @param string the password
     * @return string Return payment xml for accounting system
     * @soap
     */
    public function getPaymentXML($username, $password) {

        $model = new LoginForm;
        $model->username = $username;
        $model->password = $password;
        if (!$model->validate() || !$model->login())
            return 'Invalid Credential';
        else {
            $user = Users::model()->findByPk(Yii::app()->user->id);
            if ($user->userInfo->user_type_id == \UserType::busyaccounting || $user->userInfo->user_type_id == \UserType::superAdmin)
                return \Payment::getPaymentXML();
            else
                return 'Not Authrozied for this action';
        }
    }

    /**
     * @param string the username
     * @param string the password
     * @param string receipt string eg:  { "receipts": [{"payment_id": "TXNC123","receipt_no": "123234"},{"payment_id": "TXNB24","receipt_no": "23434"}]}
     * @soap
     */
    public function getReceipts($username, $password, $receipt) {

        $model = new LoginForm;
        $model->username = $username;
        $model->password = $password;
        if ($model->validate() && $model->login())
        {
            $user = Users::model()->findByPk(Yii::app()->user->id);
            if ($user->userInfo->user_type_id == \UserType::busyaccounting || $user->userInfo->user_type_id == \UserType::superAdmin) {
                //Execute operation based on string
                $receipts = json_decode($receipt, true);
                foreach ($receipts as $value) {
                    foreach ($value as $v) {
                        if (isset($v['payment_id'])) {
                            $id = $v['payment_id'];
                            $id = substr($id, 4);
                            if ($id) {
                                $payment = \Payment::model()->findByPk((int) $id);
                                if ($payment && !empty($v['receipt_no'])) {
                                    $payment->receipt_no = $v['receipt_no'];
                                    $payment->update(['receipt_no']);
                                }
                                unset($payment);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param string the username
     * @param string the password
     * @param string invoicestring eg:  { "invoices": [{"cart_id": "INVC123","invoice_no": "123234"},{"cart_id": "INVB24","invoice_no": "23434"}]}
     * @soap
     */
    public function getInvoices($username, $password, $invoicestring) {

        $model = new LoginForm;
        $model->username = $username;
        $model->password = $password;
        if ($model->validate() && $model->login()) {
            $user = Users::model()->findByPk(Yii::app()->user->id);
            if ($user->userInfo->user_type_id == \UserType::busyaccounting || $user->userInfo->user_type_id == \UserType::superAdmin) {
                //Execute operation based on invoice string
                $invoices = json_decode($invoicestring, true);
                foreach ($invoices as $value) {
                    foreach ($value as $v) {
                        if (isset($v['cart_id'])) {
                            $id = $v['cart_id'];
                            $id = substr($id, 4);
                            if ($id) {
                                $aircart = \AirCart::model()->findByPk((int) $id);
                                if ($aircart && !empty($v['invoice_no'])) {
                                    $aircart->invoice_no = $v['invoice_no'];
                                    $aircart->update(['invoice_no']);
                                }
                                unset($aircart);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * @param string the username
     * @param string the password
     * @param string note string eg:  { "creditnotes": [{"amend_id": "AMDC123","note_no": "123234","type":"credit"},{"amend_id": "AMDB24","note_no": "23434","type":"debit"}]}
     * @soap
     */
    public function getCreditAndDebitNotes($username, $password, $note) {

        $model = new LoginForm;
        $model->username = $username;
        $model->password = $password;
        if ($model->validate() && $model->login())
        {
            $user = Users::model()->findByPk(Yii::app()->user->id);
            if ($user->userInfo->user_type_id == \UserType::busyaccounting || $user->userInfo->user_type_id == \UserType::superAdmin) {
                //Execute operation based on note string
                $notes = json_decode($note, true);
                foreach ($notes as $value) {
                    foreach ($value as $v) {
                        if (isset($v['amend_id'])) {
                            $id = $v['amend_id'];
                            $id = substr($id, 4);
                            if ($id) {
                                $amend = \Amendment::model()->findByPk((int) $id);
                                if ($amend && !empty($v['note_no'])) {
                                    $amend->credit_debit_note_no = $v['note_no'];
                                    $amend->update(['credit_debit_note_no']);
                                }
                                unset($amend);
                            }
                        }
                    }
                }
            }
        }
    }

    public function actionInvoiceXMLWS() {

        $client = new \SoapClient('http://localhost/accountingWS/services');
        //echo $client->getInvoiceXML('prashant@belair.in','ismdhanbad');
        $arr = array("invoices" => array(["cart_id" => "INVC196", "invoice_no" => "pv123234"], ["cart_id" => "INVB197", "invoice_no" => "px23434"]));
        //$str='{ "invoices": [{"cart_id": "INVC196","invoice_no": "x123234"},{"cart_id": "INVB197","invoice_no": "y23434"}]}';
        $str = json_encode($arr);
        $client->getInvoices('prashant@belair.in', 'ismdhanbad', $str);
    }

    public function actionAmendmentXMLWS() {
        $client = new \SoapClient('http://localhost/accountingWS/services');
        echo $client->getAmendmentXML('prashant@belair.in', 'ismdhanbad');
    }

    public function actionPaymentXMLWS() {
        $client = new \SoapClient('http://localhost/accountingWS/services');
        echo $client->getPaymentXML('prashant@belair.in', 'ismdhanbad');
    }

    /**
     * Print XML based on booked and payment successful for receiving invoice no
     */
    public function actionInvoiceXML() {
        if (Authorization::getIsTopStaffLogged() || Authorization::getIsAccountingXMLUser()) {
            $xml = '<?xml version="1.0" encoding="UTF-8" ?>';
            $xml.=AirCart::getInvoiceXML();
            header('Content-Type: text/xml');
            print $xml;
        } else {
            \Utils::finalMessage('You are not allowed to access this page');
        }
    }

    /**
     * Print XML based on Amendment for receiving credit/debit note
     */
    public function actionAmendmentXML() {
        if (Authorization::getIsTopStaffLogged() || Authorization::getIsAccountingXMLUser()) {
            $xml = '<?xml version="1.0" encoding="UTF-8" ?>';
            $xml.=Amendment::getAmendmentXML();
            header('Content-Type: text/xml');
            print $xml;
        } else {
            \Utils::finalMessage('You are not allowed to access this page');
        }
    }

    /**
     * Print XML based on transfer type for receiving receipt no 
     */
    public function actionPaymentXML() {
        if (Authorization::getIsTopStaffLogged() || Authorization::getIsAccountingXMLUser()) {
            $payments = Payment::getPendingPaymentsForReceipts();
            $xml = '<?xml version="1.0" encoding="UTF-8" ?>';
            $xml.=\Payment::getPaymentXML();
            header('Content-Type: text/xml');
            print $xml;
        } else {
            \Utils::finalMessage('You are not allowed to access this page');
        }
    }

}

?>