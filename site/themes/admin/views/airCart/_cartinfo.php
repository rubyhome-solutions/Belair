<?php
/* @var $this AirCartController */
/* @var $model \AirCart */

$isStaffLogged = Authorization::getIsStaffLogged();
?>
<div class="ibox-title text-success">
    <h5> <i class="fa fa-shopping-cart fa-lg"></i> Cart information</h5>
</div>
<div class="ibox-content">    
<table class="table table-condensed table-bordered">
    <tr>
        <th>Generation Time</th>
        <th>Client source</th>
        <th>Booking Status</th>
        <th>Created by</th>
        <th>Payment Status</th>
        <th>Message</th>
        <th>Invoice No.</th>
        
    </tr>
    <tr>
        <td class="center"><?php echo Utils::cutMilliseconds($model->created); ?></td>
        <td class="center"><span class="badge badge-success"><?php echo $model->clientSource->name; ?></span></td>
        <td class="center"><?php echo $model->bookingStatus->name; ?></td>
        <td class="center"><?php echo $model->logedUser->name; ?></td>
       <td class="center">
            <?php
            if (count($payments) > 0) {     // There are payments
                echo TbHtml::link('<b>Payments</b>', '#cartPayments') . '&nbsp;&nbsp;&nbsp;&nbsp;';
            }
            echo $model->paymentStatus->name;
            if ($model->payment_status_id === \PaymentStatus::STATUS_NOT_CHARGED) {
                // Render Pay now button
                echo TbHtml::link('Pay now', '/airCart/registerPayment/' . $model->id, [
                    'class' => 'btn btn-small btn-primary noprint',
                    'style' => 'margin-left: 10%',
                ]);
            }
            ?>
        </td>
        
   <td class="center"><?php echo str_replace('{REFERENCE}', $model->id, $model->bookingStatus->message); ?></td>
   
       <?php
        $url = \Yii::app()->request->url;
        if (strpos($url, 'update') !== false) {
            ?>
            <td class="left" colspan="5">
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
            <td class="center">   
                <?php
                echo $model->invoice_no;
                ?>
            </td>
            
        <?php } ?>
       
  
    </tr>
    <tr class="noprint">
        <td colspan=7 class="center">
            <?php
            echo TbHtml::ajaxButton('Add to fraud', "/airCart/fraud/$model->id", [
                'type' => 'POST',
                'data' => ['flag' => 1],
                'update' => '#divTransactions'
                    ], [
                'color' => TbHtml::BUTTON_COLOR_DANGER,
                'size' => TbHtml::BUTTON_SIZE_SMALL,
                    ]
            ) . '&nbsp;&nbsp;';
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
            ?>&nbsp;
            <a class="btn btn-small btn-warning" onclick="doReSync(<?php echo $model->id; ?>);">ReSync</a>
        </td>
    </tr>
    
</table>
</div>
<?php
if ($isStaffLogged) {
    $this->renderPartial('_notes', ['model' => $model]);
    $this->renderPartial('_transactions', [
        'pgs' => $model->payGateLogs,
        'airCartId' => $model->id,
    ]);
    $this->renderPartial('_releated_bookings', ['model' => $model]);
    $this->renderPartial('_files', ['model' => $model]);
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
            if (typeof data.error !== 'undefined') { // Process the errors 
                $('#ReSyncInfo').html('<b>Error:</b> ' + data.error).addClass('error');
            } else {
                $('#ReSyncInfo').html(data.message).removeClass('error');
                if (data.message != 'Nothing new in this PNR') {
                    $('#ReSyncInfoBtn').text('Reload');
                }
            }

        }, 'json')
                .done(function () {
                    $('#infoModal').modal('show');
                });
    }

    $('#infoModal').on('hidden', function () {
        if (!$('#ReSyncInfo').hasClass('error') && $('#ReSyncInfo').text() != 'Nothing new in this PNR') {
            document.body.style.cursor = 'wait';
            location.reload();
        }
    })

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
    
     

</script>