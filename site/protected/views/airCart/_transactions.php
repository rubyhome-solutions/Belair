<span class="well noprint" style="padding: 10px;">Details for the staff:</span>
<?php
/* @var $this AirCartController */
/* @var $pgs PayGateLog[] */
$monthMap = [
    1 => 'A', 2 => 'B', 3 => 'C', 4 => 'D', 5 => 'E', 6 => 'F', 7 => 'G', 8 => 'H', 9 => 'I', 10 => 'J', 11 => 'K', 12 => 'L',
];
echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Cart Transactions <span class="badge badge-warning badge-top">' . count($pgs) . '</span>'
    , [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'size' => TbHtml::BUTTON_SIZE_SMALL,
    'onclick' => 'js:$("#divTransactions").toggle(); $(this).blur();',
    'style' => 'margin-bottom: 10px;',
    'class' => 'noprint'
]);
?>
<div id="resendPaymentRequestEmailModal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$('#resendEmailBtn').val(0);">&times;</button>
        <h3>Resend Payment Request Email</h3>
    </div>
    <div class="modal-body">
        <input type="text" id="resendemailid" name="resendemailid"  class="span4" required value="<?php echo $model->user->email; ?>"/>
    </div>
    <div class="modal-footer">
        <input type="hidden" id="resend_pay_log_id" name="resend_pay_log_id" value="0"/>
        <button class="btn" data-dismiss="modal" aria-hidden="true" onclick="$('#resendEmailBtn').val(0);">Close</button>
        <button type="button" id="resendEmailBtn" value="0" class="btn btn-primary" onclick="this.value = 1;
                    resendMail();">Send</button>
    </div>
</div>
<!--
<div id="paymentLinkModal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Payment Request URL</h3>
    </div>
    <div class="modal-body">
        <input type="text" id="payment_request_url" name="payment_request_url"  class="span4" required value=""/>
    </div>
</div>
-->
<div id="divTransactions" style="margin-left: 0px;max-width: 1100px; display: none;" class="noprint">
    <?php
    echo TbHtml::well(CHtml::link('&nbsp;&nbsp;Jump to view the transactions for the cart', "/payGate/admin?PayGateLog[air_cart_id]=$model->id", ['target' => '_blank'])
        , ['size' => TbHtml::WELL_SIZE_SMALL]);
    $statuses = CHtml::listData(TrStatus::model()->findall(), 'id', 'name');
    $actions = CHtml::listData(TrAction::model()->findall(), 'id', 'name');
    ?>
    <table class="table table-condensed table-hover table-bordered">
        <tr>
            <th>Date</th>
            <th>Tran.</th>
            <th>Payment Mode</th>
            <th>Amount</th>
            <th>Status</th>
            <th>3DS</th>
            <th>Action</th>
            <th>Fraud</th>
            <th>GeoIP</th>
            <th>CC</th>
            <th>Voucher No</th>
            <th>Reason</th>
            <th></th>
        </tr>
        <?php foreach ($pgs as $pg) { ?>
            <tr>
                <td><?php echo $pg->updated; ?></td>
                <td><?php echo CHtml::link($pg->id . ' ' . $pg->pg->name, "/payGate/view/$pg->id", ['target' => '_blank']); ?></td>
                <td><?php echo $pg->payment_mode; ?></td>
                <td style="text-align: right;"><?php echo number_format($pg->amount + $pg->convince_fee); ?></td>
                <td><?php echo $statuses[$pg->status_id]; ?></td>
                <td><?php echo $pg->format3dStatus(); ?></td>
                <td><?php echo empty($pg->action_id) ? '' : $actions[$pg->action_id]; ?></td>
                <td><?php echo empty($pg->fraud) ? "<span class=\"badge badge-success\">No</span>" : "<span class=\"badge badge-important\">Yes</span>"; ?></td>
                <td>
                    <?php
                    if (!empty($pg->geoip)) {
                        $geoip = json_decode($pg->geoip);
                        if (!isset($geoip->more)) {
                            $more = \TbHtml::popover(' more', "IP: $pg->user_ip", '', [
                                    'pg' => "$pg->id",
                                    'ip' => "$pg->user_ip",
                                    'class' => "ip-popover",
                                    'onclick' => "getGeoIpV2(this);",
                            ]);
                        } else {
                            $more = '';
                        }
                        echo \TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . "</pre>") . "<br>" . $pg->formatGeoIpInfo() . $more;
                    }
                    ?>
                </td>
                <td>
                    <?php
                    echo $pg->cc_id ? (!$pg->cc->bin->domestic ? "<span class='badge badge-warning'>International</span>" : '') .
                        \TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml(), ['style' => ($pg->cc->verification_status ? 'font-weight:bold;color:green' : '')]) .
                        "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}" : "";
                    ?>
                </td>
                <td><?php
                    //'condition' => 't.status_id='.\TrStatus::STATUS_SUCCESS.' and ((t.action_id='.\TrAction::ACTION_CAPTURE.' and t.pg_id in ('.\PaymentGateway::AMEX_PRODUCTION.','.\PaymentGateway::AXIS_PRODUCTION.','.\PaymentGateway::HDFC_PRODUCTION.')) or ( t.action_id='.\TrAction::ACTION_SENT.' and t.pg_id in ('.\PaymentGateway::PAYU_PRODUCTION_ID.','.\PaymentGateway::ATOM_PRODUCTION.'))) and t.updated>=\''.$fromdate.'\' and t.updated<=\''.$todate.'\'',
                    if ($pg->status_id == \TrStatus::STATUS_SUCCESS &&
                        (
                        (in_array($pg->pg_id, \PaymentGateway::$manualCapturePG) && $pg->action_id == \TrAction::ACTION_CAPTURE) || (in_array($pg->pg_id, \PaymentGateway::$autoCapturePG) && $pg->action_id == \TrAction::ACTION_SENT)
                        )) {
                        $vcnotext = $monthMap[(int) date("m", strtotime($pg->updated))] . date("d", strtotime($pg->updated)) . date("y", strtotime($pg->updated));
                        $vcno = \PaymentGateway::$vcnodeMap[$pg->pg_id] . $vcnotext;
                        echo $vcno;
                    }
                    ?></td>
                <td><?php echo in_array($pg->status_id, [\TrStatus::STATUS_NEW, \TrStatus::STATUS_PENDING]) ? '' : nl2br($pg->reason); ?></td>
                <td>
                    <?php
                    if ($pg->status_id === \TrStatus::STATUS_NEW) {
                        ?>
                        <span style="white-space: nowrap">
                            <?php
                            if($pg->getAmemdmentGroupID() !== 0) {
                            ?>
                            <a class="reject" rel="tooltip" style="color: red;" title="" data-original-title="Abort this transaction" href="javascript:abortFareDiff('<?php echo $pg->id; ?>')"><i class="fa fa-times-circle fa-2x"></i></a>
                            <?php
                            }
                            ?>
                            <a class="reject" rel="tooltip"  title="" data-original-title="Resend payment request mail" href="javascript:resendMailPopup('<?php echo $pg->id; ?>')"><i class="fa fa-envelope-o fa-2x"></i></a>
                            <a class="reject" rel="tooltip" style="color: green;" title="" data-original-title="Link for Payment Request" href="javascript:copyLinkPopup('<?php echo \Controller::B2C_BASE_URL . "/payGate/doPay/$pg->id"; ?>')"><i class="fa fa-files-o fa-2x" ></i></a>
                        </span> <?php
                    }
                    ?>

                </td>
            </tr>
            <?php
        }
        ?>
    </table>
</div>
<style>
    .badge {font-size: inherit}
    #divTransactions table td {vertical-align: middle}
</style>