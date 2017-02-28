<div class="row">
    <div class="col-lg-12">
        <div class="ibox float-e-margins">
            <div class="ibox-title text-success">
                 <h5><i class="fa fa-money"></i> Cart Payment Details  </h5>

                </div>
            <div class="ibox-content">
                <a class='btn btn-small btn-info' target="_blank" href="/payment/admin?Payment[activeCompanyId]=<?php echo $payments[0]->user->user_info_id; ?>"><i class='fa fa-search fa-lg'></i> Check all the payments</a>
                <table class="table table-striped table-bordered table-hover dataTables-example" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Payment Time</th>
                            <th>Reason</th>
                            <th>Transaction</th>
                            <th>Operation</th>
                            <th>Amend ID</th>
                            <th>Old Balance</th>
                            <th>Amount</th>
                            <th>New Balance</th>
                            <th>Original Currency</th>
                            <th>xChange Rates</th>
                        </tr>
                    </thead>
                    
                    <?php foreach ($payments as $payment) { ?>
                        <tr class="center">
                            <td style="text-align: center;vertical-align: middle;"><?php echo CHtml::link("<b>$payment->id</b>", "/payment/$payment->id"); ?></td>
                            <td class="center"><?php echo Utils::cutMilliseconds($payment->created); ?></td>
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
                            <td class="center"><?php echo number_format($payment->xchange_rate > 1 ? $payment->xchange_rate : 1 / $payment->xchange_rate, 4); ?></td>
<!--                            <td class="center"><a target="_blank" href="/payment/invoice/<?php echo $payment->id; ?>" class="btn btn-mini btn-info">Invoice</a></td>-->
                        </tr>
                    <?php } ?>

                </table>

            </div>

        </div>


    </div>
</div>