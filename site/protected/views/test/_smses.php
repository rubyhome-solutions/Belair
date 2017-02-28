<?php
$email = 'michaeljain1@gmail.com';

//\Yii::app()->sms->send('8197030472', 'ehoooooo');
//$response = \Yii::app()->sms->send('8197030472', 'CheapTickets.co.in: Click the link to make payment of INR 5020 ');
//echo \Utils::dbg($response);
//Yii::app()->end();

$user = \Users::model()->findByAttributes(['email' => $email]);
/* @var $user Users */
if ($user) {

    // Transactions emails
    $pgl = \PayGateLog::model()->findByAttributes(['user_info_id' => $user->user_info_id]);
    /* @var $pgl PayGateLog */
    if ($pgl) {
        $pgl->sendPaymentRequestSMS();
    } else {
        echo \Utils::dbg("There is no transactions for the client with email: $email");
    }

    // Aircart cancellation
    if (!empty($user->airCarts)) {
        $user->airCarts[0]->sendConfirmationSMS();
        $user->airCarts[0]->sendRescheduleSMS();
        $user->airCarts[0]->sendCancellationSMS();
    } else {
        echo \Utils::dbg("There is no any air carts for the client with email: $email");
    }
} else {
    echo \Utils::dbg("There is no user with email: $email");
}
