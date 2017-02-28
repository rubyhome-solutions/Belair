<?php
/* @var $this AirCartController */
/* @var $payments Payment[] */

//echo Utils::dbg($payments);
?>
<div class="clearfix"></div>
<div class="noprint" id="cartPayments">
    <p class='well well-small alert-info'>
        &nbsp;&nbsp;<i class='fa fa-money fa-lg'></i>&nbsp;&nbsp; Cart Payment Details
        <a class='btn btn-small btn-info' style="margin-left: 10%" target="_blank" href="/payment/admin?Payment[activeCompanyId]=<?php echo $payments[0]->user->user_info_id; ?>"><i class='fa fa-search fa-lg'></i>&nbsp;&nbsp;Check all the payments</a>
    </p>
    <table class="table table-bordered table-condensed" style="max-width: 95%">
        <tr class="heading">
            <th>Id</th>
            <th style="min-width:85px;">Payment Time</th>
            <th>Reason</th>
            <th>Transaction</th>
            <th>Operation</th>
            <th>Amend Id</th>
            <th>Old Balance</th>
            <th>Amount</th>
            <th>New Balance</th>
            <th>Original Currency</th>
            <th>xChanhe Rate</th>
            <th>Invoice</th>
        </tr>
        <?php foreach ($payments as $payment) { ?>
            <tr class="center">
                <td style="text-align: center;vertical-align: middle;"><?php echo CHtml::link("<b>$payment->id</b>", "/payment/$payment->id"); ?></td>
                <td class="center"><?php echo \TbHtml::labelTb($payment->logedUser->name) . '<br>' . Utils::cutMilliseconds($payment->created); ?></td>
                <td><?php echo $payment->note; ?></td>
                <td class="center"><?php echo $payment->pay_gate_log_id ? CHtml::link("<b>$payment->pay_gate_log_id</b>", "/payGate/$payment->pay_gate_log_id") : 'Not set'; ?></td>
                <td class="center"><?php echo $payment->transferType->name; ?></td>
                <td class="center">
                    <?php
                    $out = '';
                    foreach ($payment->amendments as $amd) {
                        $out .= "$amd->id , ";
                    }
                    echo substr($out, 0, -3);
                    ?>
                </td>
                <td class="right"><?php echo number_format($payment->old_balance); ?></td>
                <td class="right"><?php echo number_format($payment->amount); ?></td>
                <td class="right"><?php echo number_format($payment->new_balance); ?></td>
                <td class="center"><?php echo $payment->currency->code; ?></td>
                <td class="center"><?php echo number_format(($payment->xchange_rate > 1 ? $payment->xchange_rate : 1) / ($payment->xchange_rate != 0 ? $payment->xchange_rate : 1), 4); ?></td>
                <td class="center"><a target="_blank" href="/payment/invoice/<?php echo $payment->id; ?>" class="btn btn-mini btn-info">Invoice</a></td>
            </tr>
        <?php } ?>
    </table>
</div>
<style>
    td.right {text-align:right; vertical-align: middle;}
</style>