<?php
/* @var $this AirCartController */
/* @var $model AirCart */
$number = '';
if (isset($model->user->userInfo->mobile)) {
    $number = $model->user->userInfo->mobile;
    $country = \Utils::getCountryUsingNumber($number);
}
$bookingmobiles_arr = explode(',', $model->getBookingMobiles());
$puchasingBalance = (int) ($model->user->userInfo->balance + $model->user->userInfo->credit_limit);
$resultingBalance = (int) round($puchasingBalance - ($model->payment_status_id === \PaymentStatus::STATUS_CHARGED ? 0 : $model->totalAmount()));
// Equalize if needed
if (abs($resultingBalance) <= \b2c\models\Booking::PRICEDIFF_IGNORE_LEVEL &&
    ( ($resultingBalance > 0 && $model->payment_status_id === \PaymentStatus::STATUS_CHARGED) ||
    ($resultingBalance < 0 && $model->payment_status_id !== \PaymentStatus::STATUS_CHARGED)
    )
) {
    $btnEqualizer = \TbHtml::ajaxButton('Equalize', "/airCart/equalize/$model->id", [
            'type' => 'POST',
            'data' => ['amount' => $resultingBalance],
            'success' => 'js:function(error){
                                if (error != "") {
                                    alert(error);
                                    $("#btnEqualize").blur();
                                } else {
                                    window.location.reload();
                                }                                
                            }'
            ], [
            'id' => 'btnEqualize',
            'class' => 'btn-mini btn-primary',
            'style' => 'margin-left: 10px;',
    ]);
} else {
    $btnEqualizer = '';
}

if ($model->payment_status_id === \PaymentStatus::STATUS_CHARGED) {
    $htmlResultingBalance = '&nbsp;&nbsp;<i style="color:green" class="fa fa-check-square-o fa-lg"></i>';
} elseif ($resultingBalance < 0) {
    $htmlResultingBalance = "&nbsp;&nbsp;Short:&nbsp;<span class='badge badge-important'>{$resultingBalance}</span>";
} else {
    $htmlResultingBalance = '&nbsp;&nbsp;<i style="color:green" class="fa fa-check-square-o fa-lg"></i>';
}
?>
<p class="well-small alert-info">&nbsp;&nbsp;<i class="fa fa-user fa-lg"></i>&nbsp;&nbsp;Client information</p>
<table class="table table-condensed table-bordered" style="max-width: 950px;">
    <tr>
        <td class="heading">Client Name</td><td class="center"><?php echo CHtml::link("<b>{$model->user->userInfo->name}</b>", "/users/manage?selectedvalue={$model->user_id}"); ?></td>
        <td class="heading">Billing Entity</td><td class="center"><?php echo empty($model->user->department) ? "Not set" : $model->user->department ?></td>
        <?php if (!$model->isConfirmationEMailSent()) { ?>

        <td class="center error" rowspan="3" style="text-align: center;"> <h4>EMAIL NOT SENT</h4></td>
        <?php } ?>
    </tr>
    <tr>
        <td class="heading">Mobile</td><td class="center"><?php
            if (isset($country->name)) {
                echo $country->name . '  ';
            }
            echo CHtml::link($model->user->userInfo->mobile, "tel:{$model->user->userInfo->mobile}");
            ?></td>
        <td class="heading">Email</td><td class="center"><?php echo CHtml::link($model->user->userInfo->email, "mailto:{$model->user->userInfo->email}", ['target' => '_blank']); ?></td>
    </tr>
    <tr>
        <td class="heading">Booking mobile</td><td class="center"><?php
            $cnt = count($bookingmobiles_arr);
            for ($i = 0; $i < $cnt; $i++) {
                if ($i > 0 && $i !== $cnt) {
                    echo ', ';
                }
                $country = \Utils::getCountryUsingNumber($bookingmobiles_arr[$i]);
                if (isset($country->name)) {
                    echo $country->name . ' ';
                }
                echo CHtml::link($bookingmobiles_arr[$i], "tel:{$bookingmobiles_arr[$i]}");
            }
            ?></td>
        <td class="heading">Balance</td><td class="center"><?php echo number_format($model->user->userInfo->balance) . ' + ' . number_format($model->user->userInfo->credit_limit) . ' = ' . number_format($puchasingBalance) . $htmlResultingBalance . $btnEqualizer; ?></td>
    </tr>
</table>
