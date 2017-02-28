
<?php
/* @var $this AirCartController */
/* @var $model AirCart */
/* @var $payments Payment[] */

$this->breadcrumbs = [
    'Air Carts' => ['admin'],
    "Cart № $model->id",
];
$isStaffLogged = Authorization::getIsStaffLogged();

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
?>
<div class="noprint">
    <div class="alert alert-warning alert-dismissible" role="alert" id="msg" style="display:none">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <div id="mssg">Email Sent</div>
    </div>
    <div id="emailModal" class="modal hide fade">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$('#sendEmailBtn').val(0);">&times;</button>
            <h3>Email Ticket</h3>
        </div>
        <div class="modal-body">
            <input type="text" id="emailid" name="emailid"  class="span4" required value="<?php echo $model->user->email; ?>"/>
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true" onclick="$('#sendEmailBtn').val(0);">Close</button>
            <button type="button" id="sendEmailBtn" value="0" class="btn btn-primary" onclick="this.value = 1;
                    send(this);">Submit</button>
        </div>
    </div>
    <div id="smsModal" class="modal hide fade">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$('#sendSmsBtn').val(0);">&times;</button>
            <h3>Email Ticket</h3>
        </div>
        <div class="modal-body">
            <input type="text" id="phone" name="phone"  class="span4" required value="<?php echo $model->user->mobile; ?>"/>
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true" onclick="$('#sendSmsBtn').val(0);">Close</button>
            <button type="button" id="sendSmsBtn" value="0" class="btn btn-primary" onclick="this.value = 1;
                    sendSms(this);">Submit</button>
        </div>
    </div>
    <div id="emaildocModal" class="modal hide fade">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$('#btndocEmail').val(0);">&times;</button>
            <h3>Email For Doc</h3>
        </div>
        <div class="modal-body">
            <input type="text" id="emailiddoc" name="emailiddoc"  class="span4" required value="<?php echo $model->user->email; ?>"/>
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true" onclick="$('#btndocEmail').val(0);">Close</button>
            <button type="button" id="btndocEmail" value="0" class="btn btn-primary" onclick="this.value = 1;
                    senddoc(this);">Send</button>
        </div>
    </div>

    <div id="emailRefundModal" class="modal hide fade">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="$('#btnRefundEmail').val(0);">&times;</button>
            <h3>Refund Email</h3>
        </div>
        <div class="modal-body">
            <input type="text" id="emailidrefund" name="emailidrefund"  class="span4" required value="<?php echo $model->user->email; ?>"/>
            <input type="text"  name="refund_amount"  id="refund_amount" class="span4" required value="" placeholder="Refund Amount"/>
            <input type="text" id="reference_number" name="reference_number"  class="span4" required value="" placeholder="Reference Number"/>
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true" onclick="$('#btnRefundEmail').val(0);">Close</button>
            <button type="button" id="btnRefundEmail" value="0" class="btn btn-primary" onclick="this.value = 1;
                    sendRefund(this);">Send</button>
        </div>
    </div>

    <form method="POST" style="float: left; margin-right:5px;margin-bottom:0px;" action="<?php
    if ($model->user->userInfo->user_type_id === \UserType::clientB2C) {
       echo \Utils::getPrintUrlByWebsiteId($model->website_id,$model->id,"mybookings","");
        //echo \Controller::B2C_BASE_URL . '/b2c/airCart/mybookings/' . $model->id;
    } else {
        ?><?php ?>/site/print<?php } ?>" target="_blank">
        <input type="hidden" value="/airCart/print/<?php echo $model->id; ?>" name="url">
        <input type="hidden" value="<?php echo "AirCart_{$model->id}.pdf"; ?>" name="filename">
        <button class="btn btn-small btn-primary" type="submit" onclick="$(this).blur();">Cart as E-ticket</button>
    </form>
    <?php if ($model->user->userInfo->user_type_id === \UserType::clientB2C) { ?>
        <a class="btn btn-small btn-primary" target="_blank" 
        href="<?php
    if ($model->user->userInfo->user_type_id === \UserType::clientB2C) 
    {        
        echo \Utils::getPrintUrlByWebsiteId($model->website_id,$model->id,"mybookings","#print");
    } 
    else
     {
        ?>
        <?php ?>/airCart/asPdf/<?php
              echo $model->id;
          }
        ?>">Print</a>
    <?php } else { ?>
        <a class="btn btn-small btn-primary" onclick="window.print();
                    return false;">Print</a>
       <?php } ?>

    <a class="btn btn-small btn-primary" id="btnEmail" onclick="sendEmail();">Email</a>
    <a class="btn btn-small btn-primary" id="btnSms" onclick="sendSmsClick();">SMS</a>
    <a class="btn btn-small btn-primary" id="btndocEmail" onclick="senddocEmail();">Ask For Doc</a>
    <?php if ($model->checkClaimByUserId() !== false) { ?>
        <a class="btn btn-small btn-primary" href="/airCart/update/<?php echo $model->id; ?>">Modify cart</a>
        <a class="btn btn-small btn-primary" onclick="unclaim(<?php echo $model->id; ?>)">UnClaim</a>
        <a class="btn btn-small btn-primary" style='display:none' href="#" onclick="changeTheme()">Change Theme</a>

        <a class="btn btn-small btn-primary" id="btnRefundEmail" onclick="sendRefundEmail();">Refund Email</a>

        <?php if ($model->booking_status_id !== \BookingStatus::STATUS_CANCELLED) { ?>
            <a  class="btn btn-small btn-primary" href="#amendCancelModal">Cancel</a>
            <a  class="btn btn-small btn-primary" href="#amendAddModal">Add Pax</a>
            <a  class="btn btn-small btn-primary" href="#amendPNRModal">Update Ticket</a>
            <?php
        }
        if ($model->booking_status_id === \BookingStatus::STATUS_NEW || $model->booking_status_id === \BookingStatus::STATUS_IN_PROCESS || $model->booking_status_id === \BookingStatus::STATUS_PARTIALLY_BOOKED || $model->booking_status_id === \BookingStatus::STATUS_BOOKED) {
            ?>
            <?php
            $cnt = \PayGateLog::model()->countByAttributes(['air_cart_id' => $model->id, 'status_id' => \TrStatus::STATUS_NEW]);
            if ($cnt == 0) {
                ?>
                <a class="btn btn-small btn-primary" href="#amendFareDiffModal">Payment Request</a>
            <?php } else { ?>
                <a class="btn btn-small btn-primary" rel="tooltip"  title="" data-original-title="Please abort old Payment Request with 'New' status." disabled="disabled" style="cursor: not-allowed;">Payment Request</a>
            <?php } ?>
            <a class="btn btn-small btn-primary" href="#amendRoutesModal">Modify Routes</a>
        <?php } ?>
        <a class="btn btn-small btn-primary" href="#amendResModal">Reschedule</a>
    <?php } else { ?>
        <a class="btn btn-small btn-primary" onclick="getclaim(<?php echo $model->id; ?>)">Claim</a>
    <?php } ?>
    <form method="POST" style="float: left; margin-right:5px;margin-bottom:0px;" action="<?php
    if ($model->user->userInfo->user_type_id === \UserType::clientB2C) 
    {        
        echo \Utils::getPrintUrlByWebsiteId($model->website_id,$model->id,"asPdf","#print");
    } 
    else
     {
        ?>
        <?php ?>/airCart/asPdf/<?php
              echo $model->id;
          }
        ?>" >
        <input type="hidden" value=1 name="pdf">
        <button class="btn btn-small btn-primary" type="submit">Ticket as PDF</button>

    </form>
    <!--    <a class="btn btn-small btn-primary" href="#" onclick="changeTheme()">Change Theme</a>-->
</div>
<div class="clearfix"></div>
<?php
$this->renderPartial('_clientinfo', ['model' => $model]);
$this->renderPartial('_cartinfo', [
    'model' => $model,
    'payments' => $payments,
    'section' => 'view',
]);
// This can be removed once all existing carts are converted
//$model->setAirBookingsAndAirRoutesOrder();
$this->renderPartial('_viewairbooking', ['airBookings' => AirBooking::model()->with([
        'airRoutes' => ['order' => '"airRoutes".departure_ts']
    ])->findAll([
        'order' => 't.departure_ts, traveler_id',
        'condition' => "air_cart_id=$model->id"])
, 'model'=>$model]);

if (count($payments) > 0) {     // There are payments
    $this->renderPartial('_cartpayments', ['payments' => $payments]);
}
?>
<p class="well well-small alert-info">&nbsp;&nbsp;<i class="fa fa-phone-square fa-lg"></i>&nbsp;&nbsp;Contact details</p>
<table class="table table-condensed table-bordered" style="max-width: 800px;">
    <tr>
        <td class="heading">Customer care</td><td><?php echo $model->user->userInfo->customerCareInfo; ?></td>
        <td class="heading">Airline</td><td>
            <?php
            $carriers = Carrier::model()->findAllBySql('
                SELECT DISTINCT carrier.* FROM carrier
                JOIN air_routes ON (air_routes.carrier_id=carrier.id)
                JOIN air_booking ON (air_booking.id = air_routes.air_booking_id)
                JOIN air_cart ON (air_cart.id=air_booking.air_cart_id)
                WHERE air_cart.id = :cartId
                ', ['cartId' => $model->id]);
            foreach ($carriers as $carrier) {
                echo "<u>$carrier->name</u>:<br>$carrier->helpLine <br><br>";
            }
            ?></td>
    </tr>
</table>
<?php
if ($model->booking_status_id !== \BookingStatus::STATUS_CANCELLED) {
    $this->renderPartial('_amendcancel', ['model' => $model]);
}

$this->renderPartial('_amendaddsegments', ['model' => $model]);
$this->renderPartial('_update_ticket', ['model' => $model]);
?>

<?php
if ($model->booking_status_id === \BookingStatus::STATUS_NEW || $model->booking_status_id === \BookingStatus::STATUS_IN_PROCESS || $model->booking_status_id === \BookingStatus::STATUS_PARTIALLY_BOOKED || $model->booking_status_id === \BookingStatus::STATUS_BOOKED) {
    $this->renderPartial('_amendfarediff', ['model' => $model]);
}
$this->renderPartial('_amendroutes', ['model' => $model]);
?>
<?php
if ($model->booking_status_id !== \BookingStatus::STATUS_CANCELLED && $model->booking_status_id !== \BookingStatus::STATUS_ABORTED) {
    $this->renderPartial('_reschedule', ['model' => $model]);
}
?>
<p class="well-small alert-info">&nbsp;&nbsp;<i class="fa fa-pencil-square fa-lg"></i>&nbsp;&nbsp;Terms &amp; conditions</p>
<?php include __DIR__ . '/terms_and_conditions.html'; ?>
<style>
    .well-small {
        padding: 3px;
        margin-bottom: 5px;
        margin-top: 15px;
        font-weight: bold;
    }
    .table .left td {
        text-align: left;
    }
    .table th, td.center {
        text-align: center;
        vertical-align: middle;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
    }
    .red {
        background-color: lightcoral;
        font-weight: bold;
        font-size: 1.1em;
    }
    .pnr {
        font-weight: bold;
        font-size: 1.2em;
        color: darkblue;
    }

    <?php Utils::pdfStyle(); ?>
</style>
<div id="commanModal" class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
</div>
<script>
    function sendEmail() {

        $('#emailModal').modal('show');

    }

    function sendSmsClick() {

        $('#smsModal').modal('show');

    }
    //gitayadav
    function senddocEmail() {

        $('#emaildocModal').modal('show');

    }
    //end
    //gitayadav
    function sendRefundEmail() {

        $('#emailRefundModal').modal('show');

    }
    //end
    function send(element) {
        $(element).prop('disabled', true);
        $('#btnEmail').attr('disabled', true);
        $('#btnEmail').addClass('disabled');
        $('#mssg').text('Sending Email!!').fadeIn();
        $('#msg').fadeIn();
        $('#emailModal').modal('hide');
        $.post('/airCart/sendEmail/<?php echo $model->id; ?>', {
            pdf: 1, email: $('#emailid').val()
        }).done(function () {
            $('#mssg').text('Email Sent').fadeIn();
            $('#msg').fadeIn();
        })
                .fail(function () {
                    $('#mssg').text('Email Sending Failed!').fadeIn();
                    $(element).prop('disabled', false);
                    $('#msg').fadeIn();
                })
                .always(function () {

                    $('#btnEmail').attr('disabled', false);
                    $('#btnEmail').removeClass('disabled');
                });
    }
    function sendSms(element) {
        $(element).prop('disabled', true);
        $('#btnSms').attr('disabled', true);
        $('#btnSms').addClass('disabled');
        $('#mssg').text('Sending Sms!!').fadeIn();
        $('#msg').fadeIn();
        $('#smsModal').modal('hide');
        $.post('/airCart/sendSmsManual/<?php echo $model->id; ?>', {
            phone: $('#phone').val()
        }).done(function (smsStatusMsg) {
            $('#mssg').text(smsStatusMsg).fadeIn();
            $('#msg').fadeIn();
        })
                .fail(function () {
                    $('#mssg').text('Sms Sending Failed!').fadeIn();
                    $(element).prop('disabled', false);
                    $('#msg').fadeIn();
                })
                .always(function () {

                    $('#btnSms').attr('disabled', false);
                    $('#btnSms').removeClass('disabled');
                });
    }

    function senddoc(element) {
        $(element).prop('disabled', true);
        $('#btndocEmail').attr('disabled', true);
        $('#btndocEmail').addClass('disabled');
        $('#mssg').text('Sending Email!!').fadeIn();
        $('#msg').fadeIn();
        $('#emaildocModal').modal('hide');
        $.post('/airCart/senddocEmail/<?php echo $model->id; ?>', {
            email: $('#emailiddoc').val()
        }).done(function () {
            $('#mssg').text('Email Sent').fadeIn();
            $('#msg').fadeIn();
        })
                .fail(function () {
                    $('#mssg').text('Email Sending Failed!').fadeIn();
                    $(element).prop('disabled', false);
                    $('#msg').fadeIn();
                })
                .always(function () {

                    $('#btndocEmail').attr('disabled', false);
                    $('#btndocEmail').removeClass('disabled');
                });
    }

    function sendRefund(element) {
        $(element).prop('disabled', true);
        $('#btnRefundEmail').attr('disabled', true);
        $('#btnRefundEmail').addClass('disabled');
        $('#mssg').text('Sending Email!!').fadeIn();
        $('#msg').fadeIn();
        $('#emailRefundModal').modal('hide');
        $.post('/airCart/sendRefundEmail/<?php echo $model->id; ?>', {
            email: $('#emailidrefund').val(), refund_amount: $('#refund_amount').val(), reference_number: $('#reference_number').val()
        }).done(function () {
            $('#mssg').text('Email Sent').fadeIn();
            $('#msg').fadeIn();
        })
                .fail(function () {
                    $('#mssg').text('Email Sending Failed!').fadeIn();
                     $(element).prop('disabled', false);
                    $('#msg').fadeIn();
                })
                .always(function () {

                    $('#btnRefundEmail').attr('disabled', false);
                    $('#btnRefundEmail').removeClass('disabled');
                });
    }
    //gitayadav
    function changeTheme() {

        $.post('/airCart/changeTheme', {}).always(function () {
            window.location.reload();
        });
    }

    function getclaim(cartId) {
        $.post('/airCart/claimCart/' + cartId, {}, function (data) {
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

    function unclaim(cartId) {
        $.post('/airCart/unClaimCart/' + cartId, {}, function (data) {
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

    function abortFareDiff(pay_log_id) {
        var reason = '';
        while (reason !== null && reason.trim() === '') {
            reason = prompt('Are you sure you want to abort this transaction ? Please enter reason.')
        }
        if (reason === null) {
            return;
        }
        $('#commanModal').modal({backdrop: 'static', keyboard: false});
        $.post('/airCart/abortFareDiff/' + pay_log_id, {'reason': reason}, function (data) {
            if (typeof data.result !== 'undefined') {
                alert(data.msg + '....refresing page');
            }
        }, 'json')
                .done(function () {
                    window.location.reload();
                });
    }

    function resendMail() {
        var pay_log_id = $('#resend_pay_log_id').val();
        if (confirm('Are you sure you want to send the payment request again ?')) {
            //$('#commanModal').modal({backdrop: 'static', keyboard: false});
            $.post('/airCart/resendMail/' + pay_log_id, {'cartid': '<?php echo $model->id ?>', 'emailid': $('#resendemailid').val()}, function (data) {
                if (typeof data.result !== 'undefined') {
                    alert(data.msg);
                }
            }, 'json')
                    .done(function () {
                        $('#resendPaymentRequestEmailModal').modal('hide');
                        //$('#commanModal').modal('hide');
                    });
        }
    }

    function resendMailPopup(pay_log_id) {
        $('#resendPaymentRequestEmailModal').modal('show');
        $('#resend_pay_log_id').val(pay_log_id);
    }
    // Function to copy text to clipboard
    function copyLinkPopup(link) {
        var temp = $("<input>");
        $("body").append(temp);
        temp.val(link).select();
        document.execCommand("copy");
        temp.remove();
        alert('Copied...');
        /*
         $('#payment_request_url').val(link);
         $('#paymentLinkModal').modal('show');
         */
    }
    
    function updateAirbooking(air_booking_id) {
        var reason = '';
        while (reason !== null && reason.trim() === '') {
            reason = prompt('Are you sure you want to delete this airbooking ? Please enter reason.')
        }
        if (reason === null) {
            return;
        }
        $('#commanModal').modal({backdrop: 'static', keyboard: false});
        $.post('/airCart/updateAirbooking/' + air_booking_id, {'reason': reason}, function (data) {
            if (typeof data.result !== 'undefined') {
                alert(data.msg + '....refresing page');
            }
        },'json')
                .done(function () {
                    //console.log(data);
                    window.location.reload();
                });
    }
    
    $('.edit_travelers').click(function(){
        $(this).next('.traveler_lists').fadeIn('slow');
        $(this).fadeOut('slow');
    });
    
    $('.traveler_lists').change(function(){
       var air_booking_id = $(this).data('air_booking_id'),
           traveler_id = $(this).val();
           $('#commanModal').modal({backdrop: 'static', keyboard: false});
       $.ajax({
           type:'post',
           url : '/airCart/updateAirbookingTraveler/',
           dataType:'json',
           data : {traveler_id : traveler_id, air_booking_id :air_booking_id },
           success: function(data){
               if (typeof data.result !== 'undefined') {
                alert(data.msg + '....refresing page');
                window.location.reload();
            }
           }
        });
    })
        
    
</script>
