<?php
/* @var $this AirCartController */
/* @var $model \AirCart */

$isStaffLogged = Authorization::getIsStaffLogged();
$isFrontLineStaffLogged = Authorization::getIsFrontlineStaffLogged();
?>
<p class="well-small alert-info">&nbsp;&nbsp;<i class="fa fa-shopping-cart fa-lg"></i>&nbsp;&nbsp;Cart information</p>
<table class="table table-condensed table-bordered" style="max-width: 750px; float: left;">
    <tr>
        <td class="heading">Generation Time</td><td class="center"><?php echo Utils::cutMilliseconds($model->created); ?></td>
        <td class="heading">Client source</td><td class="center">
            <span class="badge badge-success">
                <?php
                if ($isFrontLineStaffLogged) {
                    if ($model->client_source_id === \ClientSource::SOURCE_DIRECT) {
                        echo 'Direct';
                    } else {
                        echo 'Source';
                    }
                } else {
                    echo $model->clientSource->name;
                }
                ?>

            </span></td>
        <td class="heading">Booking Status</td><td class="center"><?php echo $model->bookingStatus->badgeFormat(); ?></td>
    </tr>
    <tr>
        <td class="heading">Created by</td><td class="center"><?php echo $model->logedUser->name; ?></td>
        <td class="heading">Payment Status</td><td class="center" colspan="3">
            <?php
            if (count($payments) > 0) {     // There are payments
                echo TbHtml::link('Payments<span class="badge badge-warning badge-top">' . count($payments) . '</span>', '#cartPayments', [
                    'class' => 'btn btn-small btn-primary noprint',
                    'style' => 'margin-right: 4%;'
                ]);
            }
            echo $model->paymentStatus->name;
            if ($model->payment_status_id === \PaymentStatus::STATUS_NOT_CHARGED) {
                // Render Pay now button
                echo TbHtml::link('Pay now', '/airCart/registerPayment/' . $model->id, [
                    'class' => 'btn btn-small btn-primary noprint',
                    'style' => 'margin-left: 5%',
                ]);
            }
            ?>
        </td>
    </tr>
    <tr>
        <td class="heading">Message</td><td colspan=5 class="center"><?php echo str_replace('{REFERENCE}', $model->id, $model->bookingStatus->message); ?></td>
    </tr>
    <tr class="noprint">
        <td class="heading">Actions</td><td colspan=5 class="center">
            <?php
            echo TbHtml::button($model->booking_status_id != \BookingStatus::STATUS_FRAUD ? 'Add to fraud' : 'Remove fraud', [
                'submit' => "/airCart/fraud/$model->id",
                'type' => 'POST',
                'params' => ['flag' => (int) ($model->booking_status_id != \BookingStatus::STATUS_FRAUD)],
                'color' => $model->booking_status_id != \BookingStatus::STATUS_FRAUD ? TbHtml::BUTTON_COLOR_DANGER : TbHtml::BUTTON_COLOR_SUCCESS,
                'size' => TbHtml::BUTTON_SIZE_SMALL,
                ]
            ) . '&nbsp;&nbsp;';
            if ($model->booking_status_id === \BookingStatus::STATUS_IN_PROCESS || $model->booking_status_id === \BookingStatus::STATUS_NEW) {
                echo TbHtml::button('Abort', [
                    'submit' => "/airCart/abortCart/$model->id",
                    'type' => 'POST',
                    'color' => TbHtml::BUTTON_COLOR_DANGER,
                    'size' => TbHtml::BUTTON_SIZE_SMALL,
                    'confirm' => 'Are you sure you want to abort this cart ?'
                    ]
                ) . '&nbsp;&nbsp;';
            }
            $userid = \Utils::getLoggedUserId();
            if ($model->checkClaimByUserId()) {
                /*
                  echo TbHtml::button('Auto Pay request', [
                  'submit' => '/payGate/manualPaymentRequest',
                  'type' => 'POST',
                  'params' => [
                  'autoConvinceFee' => 1,
                  'PayGateLog[air_cart_id]' => $model->id,
                  'PayGateLog[amount]' => $model->totalAmount(),
                  'PayGateLog[reason]' => $model->getSummaryWithDetails(),
                  'PayGateLog[user_info_id]' => $model->user->user_info_id,
                  'PayGateLog[pg_id]' => \PaymentGateway::chooseDefaultPg($model->user->userInfo->user_type_id),
                  'PayGateLog[currency_id]' => $model->airBookings[0]->airSource->currency_id,
                  'PayGateLog[original_currency_id]' => $model->airBookings[0]->airSource->currency_id,
                  ],
                  'color' => TbHtml::BUTTON_COLOR_WARNING,
                  'size' => TbHtml::BUTTON_SIZE_SMALL,
                  ]) . '&nbsp;&nbsp;';
                  echo TbHtml::button('Payment request', [
                  'submit' => '/payGate/manualPaymentRequest',
                  'type' => 'POST',
                  'params' => [
                  'autoConvinceFee' => 1,
                  'doNotSave' => 1,
                  'PayGateLog[air_cart_id]' => $model->id,
                  'PayGateLog[amount]' => $model->totalAmount(),
                  'PayGateLog[reason]' => $model->getSummaryWithDetails(),
                  'PayGateLog[user_info_id]' => $model->user->user_info_id,
                  'PayGateLog[pg_id]' => \PaymentGateway::chooseDefaultPg($model->user->userInfo->user_type_id),
                  'PayGateLog[currency_id]' => $model->airBookings[0]->airSource->currency_id,
                  'PayGateLog[original_currency_id]' => $model->airBookings[0]->airSource->currency_id,
                  ],
                  'color' => TbHtml::BUTTON_COLOR_WARNING,
                  'size' => TbHtml::BUTTON_SIZE_SMALL,
                  ]);
                 * 
                 */
                ?>&nbsp;
                <a class="btn btn-small btn-warning" onclick="doReSync(<?php echo $model->id; ?>);">ReSync</a>
                <?php if (($model->booking_status_id === \BookingStatus::STATUS_IN_PROCESS || $model->booking_status_id === \BookingStatus::STATUS_NEW) && count($payments) > 0 && !$model->airBookings[0]->airSource->backend->isGds) { ?>
                    <a class="btn btn-small btn-warning" id='manualBook' onclick="doManualBooking(<?php echo $model->id; ?>);">Manual Book</a>
                <?php } ?>
            <?php } ?>
        </td>

    </tr>
    <tr class="noprint">
        <td class="heading">Invoice No</td>


        <?php
        $url = Yii::app()->request->url;
        if (strpos($url, 'update') !== false || \Authorization::getIsAccountantLogged()) {
            ?>
            <td class="left" colspan="1">
                <?php echo TbHtml::activeTextField($model, 'invoice_no', ['class' => 'inline capitalize center', 'style' => 'max-width: 300px;', 'disabled' => !$isStaffLogged, 'maxlength' => '25']); ?>
                <a class="btn btn-small btn-warning" id="btnInvoiceUpdate" onclick="updateInvoice(<?php echo $model->id; ?>);">Update</a>
                <div id="invoiceupdated"  class="alert alert-warning alert-dismissible" role="alert" style="display: none">
                    <button type="button" class="close" aria-label="Close" onclick="$('#invoiceupdated').hide();
                            return false;"><span aria-hidden="true">&times;</span></button>
                    <div id="invoicemsg">Invoice Updated</div></div>
            </td>
            <?php
        } else {
            ?>
            <td class="center" colspan="1">
                <?php
                echo $model->invoice_no;
                ?>
            </td>
        <?php } ?>
        <td class="heading">Promo Code</td>
        <td colspan="1" ><?php
            $promolog = \PromoLog::model()->findByAttributes(array('air_cart_id' => $model->id));
            if (isset($promolog->promo_code)) {
                echo $promolog->promo_code;
            }
            ?></td>
        <td class="heading">Score</td>
        <td colspan="1" ><?php
            $fraudrules = new \FraudRules();
            $fraudrules->aircart = $model;
            $title = "";
            /*  $title = " countryRule= {$fraudrules->countryRule()} <br>"
              . "trans3DSRule= {$fraudrules->trans3DSRule()} <br>"
              . "airSourceRule= {$fraudrules->airSourceRule()} <br>"
              . "nameRule= {$fraudrules->nameRule()} <br>"
              . "emailRule= {$fraudrules->emailRule()} <br>"
              . "previousTransactionRule= {$fraudrules->previousTransactionRule()} <br>"
              . "cartFileRule= {$fraudrules->cartFileRule()} <br>"; */
            ?><a href="#" id="score" title="<?php echo $title; ?>"><?php
            //echo $fraudrules->applyFraudRules();
            ?></a></td>

        </td>
    </tr>
    <tr class="noprint">
        <td class="heading">Device</td>
        <td colspan='1'><?php
            $bookinglog = \BookingLog::model()->findByAttributes(['air_cart_id' => (int) $model->id]);
            //   \Utils::dbgYiiLog($bookinglog);
            if (isset($bookinglog)) {
                if ($bookinglog->is_mobile) {
                    echo 'Mobile (' . $bookinglog->platform . ' , Browser: ' . $bookinglog->browser . ')';
                } else {
                    echo 'Desktop (' . $bookinglog->platform . ' , Browser:' . $bookinglog->browser . ')';
                }
            }
            ?></td>
        <td class="heading">Cart Status</td>
        <td class="center"><span class="badge badge-success"><?php echo $model->getCartStatus(); ?></span></td>
        <td colspan='2'> <?php if ($model->checkClaimByUserId() !== false) { ?><?php echo CHtml::dropDownList('cartStatus', $model->cart_status_id, \CartStatus::$cartStatusMap, array('style' => 'width:120px')); ?> <div class="btn btn-small" onclick="setCartStatus(<?php echo $model->id; ?>,<?php echo $model->booking_status_id; ?>)">OK</div><?php } ?></td>
    </tr>
    <tr class="noprint">
        <td class="heading">Website</td>
        <td colspan='2'>
            <style>
                select{
                    margin-top:10px;
                }
            </style>
            <?php
           
            $url = Yii::app()->request->url;
            if ($model->checkClaimByUserId() !== false) {
                echo TbHtml::activeDropDownList($model, 'website_id', \Utils::getWebsiteNames());
                ?>
                <a class="btn btn-small btn-warning" id="btnWebsiteUpdate" onclick="updateWebsite(<?php echo $model->id; ?>);">Update</a>
                <div id="websiteupdated"  class="alert alert-warning alert-dismissible" role="alert" style="display: none">
                    <button type="button" class="close" aria-label="Close" onclick="$('#websiteupdated').hide();
                            return false;"><span aria-hidden="true">&times;</span></button>
                    <div id="websitemsg">Website Updated</div></div>

    <?php
} else {
    if (isset($model->website_id)) {
        echo \AirCart::$websiteMap[$model->website_id];
    }
}
?></td>
        <td colspan='3'>
        </td>
    </tr>
</table>
<?php
if ($isStaffLogged) {
    $this->renderPartial('_notes', ['model' => $model]);
    $pgs = \PayGateLog::model()->findAllByAttributes(['air_cart_id' => $model->id], ['order' => 'id DESC']);
    if (count($pgs) > 0) {
        $this->renderPartial('_transactions', [
            'pgs' => $pgs,
            'model' => $model,
        ]);
    }
    $amendments = Amendment::model()->findAllBySql('
    Select
        sum(amount_to_charge) as amount_to_charge,
        min(amendment.id) as id,
        min(amendment.loged_user_id) as loged_user_id,
        amendment.group_id,
        min(air_booking_id) as air_booking_id ,
        min(amendment.created) as created,
        amendment_type_id,
        min(amendment.note) as note ,
        amendment_status_id,
        min(amendment.payment_status_id) as payment_status_id
    From amendment
    JOIN air_booking on (air_booking.id = amendment.air_booking_id)
    WHERE air_booking.air_cart_id = :cartId
    Group By amendment.group_id, amendment_status_id, amendment_type_id
    ORDER BY id DESC
    ', ['cartId' => $model->id]);
//Utils::dbgYiiLog($amendments);

    $this->renderPartial('_releated_bookings', ['model' => $model]);
    $this->renderPartial('_email_sms_log', ['model' => $model]);
    $this->renderPartial('_files', ['model' => $model]);
    $this->renderPartial('_screenshots', ['images' => $model->screenShots]);

    if (count($amendments) > 0) {     // There is amendments
        $this->renderPartial('_cartamendments', ['amendments' => $amendments]);
    }
    $this->renderPartial('_ticket_rules', ['model' => $model]);
    $this->renderPartial('_fare_rules', ['model' => $model]);
}
?>
<hr>
<div id="infoModal" class="modal hide fade">
    <div class="modal-header">
        <h3>PNR reSync feedback:</h3>
    </div>
    <div class="modal-body form">
        <p id="ReSyncInfo" class="span4"></p>
    </div>
    <div class="modal-footer">
        <button type="button" id="ReSyncInfoBtn" data-dismiss="modal" aria-hidden="true" class="btn btn-primary">ОК</button>
    </div>
</div>

<script>
    function doReSync(cartId) {
        $.post('/airCart/reSync/' + cartId, {}, function (data) {
            var content = '';
            for (var key in data) {
                if (typeof data[key].error !== 'undefined') { // Process the errors
                    $('#ReSyncInfo').addClass('error');
                    content += '<b>Error:</b> ' + data[key].error + '<br>';
                } else {
//                    $('#ReSyncInfo').removeClass('error');
                    content += data[key].message + '<br>';
                    if (data[key].message.indexOf('Nothing new') === -1) {
                        $('#ReSyncInfoBtn').text('Reload');
                    }
                }
            }
            $('#ReSyncInfo').html(content);

        }, 'json')
                .done(function () {
                    $('#infoModal').modal('show');
                });
    }

    function doManualBooking(cartId) {
        $('#manualBook').hide();
        $.post('/airCart/manualBooking/' + cartId, {}, function (data) {

        }, 'json')
                .done(function () {

                    //$('#manualBook').show();
                    window.location.reload();
                });
    }

    $('#infoModal').on('hidden', function () {
        if ($('#ReSyncInfoBtn').text() === 'Reload') {
            document.body.style.cursor = 'wait';
            location.reload();
        }
    });

    function updateWebsite(cartId)
    {
        $('#btnWebsiteUpdate').attr('disabled', true);
        $('#btnWebsiteUpdate').addClass('disabled');
        $.post('/airCart/updateWebsite/' + cartId, {'website_id': $('#AirCart_website_id').val()}, function (data) {
            if (typeof data.error !== 'undefined') { // Process the errors
                $('#websitemsg').text(data.error).addClass('error');
            } else {
                $('#websitemsg').text('Updated !!').fadeIn();
                $('#websiteupdated').show();
            }
        }, 'json').fail(function () {
            $('#websitemsg').text('Updation Failed!').fadeIn();
            $('#websiteeupdated').fadeIn();
        }).always(function () {

            $('#btnWebsiteUpdate').attr('disabled', false);
            $('#btnWebsiteeUpdate').removeClass('disabled');
        });
        ;
    }
    function updateInvoice(cartId) {
        $('#btnInvoiceUpdate').attr('disabled', true);
        $('#btnInvoiceUpdate').addClass('disabled');
        $.post('/airCart/updateInvoice/' + cartId, {'invoiceno': $('#AirCart_invoice_no').val()}, function (data) {
            if (typeof data.error !== 'undefined') { // Process the errors
                $('#invoicemsg').text(data.error).addClass('error');
            } else {
                $('#invoicemsg').text('Updated !!').fadeIn();
                $('#invoiceupdated').show();
            }
        }, 'json').fail(function () {
            $('#invoicemsg').text('Updation Failed!').fadeIn();
            $('#invoiceupdated').fadeIn();
        }).always(function () {

            $('#btnInvoiceUpdate').attr('disabled', false);
            $('#btnInvoiceUpdate').removeClass('disabled');
        });
        ;
    }

    $(function () {
        $('#score').tooltip({html: true, placement: 'right'});
    });

    function getGeoIpV2(that) {
        if ($(that).attr('data-content') !== '') {
            return;
        }
        var ip = $(that).attr('ip');
        var pg = $(that).attr('pg');
        $.post('/xRate/geoIpV2/' + pg, {'ip': ip}, function (data) {
            var table_body = "<table>";
//            $(that).popover('hide');
//            $(that).popover({'html':'true'});
            $.each(data, function (k, v) {
                table_body += "<tr><td>" + k + "</td><td><b>" + v + "</b></td></tr>";
            });
            $(that).attr('data-content', table_body + "</table>");
            $(that).popover('show');
        });
    }

    function setCartStatus(cartid, bsid) {
        var cartStatusId = $('#cartStatus').val();
        $.post('/airCart/setCartStatus/' + cartid, {'cartStatusId': cartStatusId, 'bsid': bsid}, function (data) {
            if (typeof data.error !== 'undefined') {
                //alert(data.error+' refresing page');
                window.location.reload();
            } else {
                //alert(data.success+'. Refresing page');
                window.location.reload(); //relative to domain
            }


        }, 'json')
                .done(function () {

                });
    }

</script>
<style>
    .popover {max-width: 600px}
    .error {
        background: #FFC1C1;
        border-color: #C00;
    }

</style>