<?php
$email = 'michaeljain1@gmail.com';
//$email = 'tony@x3me.net';
$user = \Users::model()->findByAttributes(['email' => $email]);
/* @var $user Users */
if ($user) {
    $user->welcomeEmail();
    $user->passResetEmail();

    // Transactions emails
    $pgl = \PayGateLog::model()->findByAttributes(['user_info_id' => $user->user_info_id]);
    /* @var $pgl PayGateLog */
    if ($pgl) {
        $pgl->sendPaymentRequestEmail();
        $pgl->sendPaymentReceivedEmail();
    } else {
        echo \Utils::dbg("There is no transactions for the client with email: $email");
    }

    // Aircart cancellation
    if (!empty($user->airCarts)) {
        $user->airCarts[0]->sendBookedEmail();
        $user->airCarts[0]->sendCancellationRequestEmail();
        $user->airCarts[0]->sendCancellationEmail($user->airCarts[0]->totalAmount());
        $user->airCarts[0]->sendRescheduleEmail();
        \Yii::app()->setTheme(null);
        ?>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                $.ajax({url: '/airCart/sendEmail/<?php echo $user->airCarts[0]->id; ?>'});
            }, false);
        </script>
        <?php
    } else {
        echo \Utils::dbg("There is no any air carts for the client with email: $email");
    }
} else {
    echo \Utils::dbg("There is no user with email: $email");
}
