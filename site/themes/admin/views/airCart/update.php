<?php
/* @var $this AirCartController */
/* @var $model AirCart */
/* @var $payments Payment[] */

$isStaffLogged = \Authorization::getIsStaffLogged();

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
$puchasingBalance = $model->user->userInfo->balance + $model->user->userInfo->credit_limit;
$resultingBalance = $puchasingBalance - $model->totalAmount();
if ($model->payment_status_id === \PaymentStatus::STATUS_CHARGED) {
    $htmlResultingBalance = '&nbsp;&nbsp;<i style="color:green" class="fa fa-check-square-o fa-lg"></i>';
} elseif ($resultingBalance < 0) {
    $htmlResultingBalance = "&nbsp;&nbsp;Short:&nbsp;<span class='badge badge-important'>" . round($resultingBalance) . "</span>";
} else {
    $htmlResultingBalance = '&nbsp;&nbsp;<i style="color:green" class="fa fa-check-square-o fa-lg"></i>';
}
?>
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
                    send();">Submit</button>
        </div>
    </div>
<div class="row wrapper wrapper-content fadeInRight">
    <div class="col-lg-12 cartinfo">
        <div class="ibox float-e-margins">
            <div class="ibox-title text-success">
                
                <h5><i class="fa fa-shopping-cart"></i> Cart ID:<?php echo $model->id; ?></h5> <div class=" m-l btn-group">
                    <button data-toggle="dropdown" class=" btn btn-default btn-sm dropdown-toggle" aria-expanded="false">Action <span class="caret"></span></button>
                    <a  class=" btn btn-default btn-sm dropdown-toggle" href="#" onclick="changeTheme()">Change Theme</a>
                </div>
                <div class="ibox-tools inlinebtn">
                    <a class="btn btn-danger btn-sm" type="button" href="/airCart/update/<?php echo $model->id; ?>"><i class="fa fa-cogs"></i> Modify cart</a>

                    <form method="POST"  action="<?php
                    if ($model->user->userInfo->user_type_id === \UserType::clientB2C) {
                        echo \Controller::B2C_BASE_URL . '/b2c/airCart/mybookings/' . $model->id;
                    } else {
                        ?><?php ?>/site/print<?php } ?>" target="_blank">
                        <input type="hidden" value="/airCart/print/<?php echo $model->id; ?>" name="url">
                        <input type="hidden" value="<?php echo "AirCart_{$model->id}.pdf"; ?>" name="filename">
                        <button class="btn btn-danger  btn-outline btn-sm" type="submit" onclick="$(this).blur();"><i class="fa fa-ticket"></i> E-Ticket
                        </button> 
                    </form>

                    <form method="POST"  action="<?php
                    if ($model->user->userInfo->user_type_id === \UserType::clientB2C) {
                        echo \Controller::B2C_BASE_URL . '/b2c/airCart/asPdf/' . $model->id . '#print';
                    } else {
                        ?><?php ?>/airCart/asPdf/<?php
                              echo $model->id;
                          }
                          ?>" >
                        <input type="hidden" value=1 name="pdf">
                        <button class="btn btn-danger  btn-outline btn-sm" type="submit"><i class="fa fa-file-pdf-o"></i> Ticket as PDF</button>
                    </form>

                    <?php if ($model->user->userInfo->user_type_id === \UserType::clientB2C) { ?>
                        <a class="btn btn-danger  btn-outline btn-sm" type="button" target="_blank" href="<?php echo \Controller::B2C_BASE_URL . '/b2c/airCart/mybookings/' . $model->id . '#print'; ?>"><i class="fa fa-print"></i>Print</a>
                       <?php } else { ?>
                        <a class="btn btn-danger  btn-outline btn-sm" type="button" onclick="window.print();
                    return false;"><i class="fa fa-print"></i> Print</a>
<?php } ?>
                    <a class="btn btn-danger  btn-outline btn-sm" type="button" id="btnEmail" onclick="sendEmail();"><i class="fa fa-envelope"></i> Email</a>

                    <button class="btn btn-danger  btn-outline btn-sm" type="button"><i class="fa fa-mobile"></i> SMS
                    </button>



                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="ibox-content">
                <div class="row">
                    <div class="col-lg-4">
                        <p class="single">Invoice No:
                        
                        <?php
        $url = Yii::app()->request->url;
        if (strpos($url, 'update') !== false) {
            ?>
                            <span>
                <?php echo TbHtml::activeTextField($model, 'invoice_no', ['class' => 'inline capitalize center', 'style' => 'max-width: 130px;', 'disabled' => !$isStaffLogged, 'maxlength' => '25']); ?>
                <a class="btn btn-xs btn-warning" style="position:relative; top:-3px;" id="btnInvoiceUpdate" onclick="updateInvoice(<?php echo $model->id; ?>);">Update</a>
                <div id="invoiceupdated"  class="alert alert-warning alert-dismissible" role="alert" style="display: none">
                    <button type="button" class="close" aria-label="Close" onclick="$('#invoiceupdated').hide();
                                return false;"><span aria-hidden="true">&times;</span></button>
                    <div id="invoicemsg">Invoice Updated</div></div>
                </span>
            <?php
        } else {
            ?>
             <span>
                <?php
                echo $model->invoice_no;
                ?>
               </span>        
        <?php } ?>
                        </p>

                        <p class="single">Promo Code:
                            <?php
            $promolog = \PromoLog::model()->findByAttributes(array('air_cart_id' => $model->id));
            if (isset($promolog->promo_code)) {
                echo $promolog->promo_code;
            }
            ?>
                        </p>
                    </div>
                    <?php 
                         $t_count = 0;
                        foreach($model->getRelatedBookings() as $acs)
                        {
                            foreach ($acs->payGateLogs as $pg) {
                                if (empty($pg->cc_id)) {
                                    continue;
                                    
                                }$t_count++;
                            }
                             
                            
                        }
                        
                    ?>
                    <div class="col-md-2"><p class="single"><strong>Fraud</strong> 
                    <?php 
                    echo !$model->isFraud() ? "<span class=\"label label-primary \">No</span>" : "<span class=\"label label-danger blink\">Yes</span>";
                    ?>
                            </p>  <button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModal4">Related Bookings (<?php echo $t_count; ?>) </button>
                    </div>
                    <div class="modal inmodal" id="myModal4" tabindex="-1" role="dialog"  aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content modal-lg animated fadeIn modal-flow">
                                <div class="modal-header">
                                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                                    <h4 class="modal-title">Related Bookings 
                                        <?php
                                            echo TbHtml::ajaxButton('Add to fraud', "/airCart/fraud/$model->id", [
                                            'type' => 'POST',
                                            'data' => ['flag' => 1],
                                            'update' => '#divTransactions'
                                                ], [
                                            'color' => TbHtml::BUTTON_COLOR_DANGER,
                                            'size' => TbHtml::BUTTON_SIZE_SMALL,
                                                ]
                                        ) 
                                        ?>
                                        <button type="button" class="btn btn-danger btn-sm">Add All to Fraud</button></h4>

                                </div>
                                <div class="modal-body">
                                    <?php
                                    $this->renderPartial('_relatedbookings', ['model' => $model]);
                                    ?>  
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-white" data-dismiss="modal">Close</button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3"><p class="single m-b"><strong>Payment Status:</strong> <span class="label label-primary"><?php echo $model->paymentStatus->name;?></span></p>
                        <span><strong>Booking Status: </strong><span class="label label-success"><?php echo $model->bookingStatus->name; ?></span></span>
                    </div>
                    <div class="col-lg-3 spaceup text-right">
                        
                        <?php if ($model->payment_status_id === \PaymentStatus::STATUS_NOT_CHARGED) {?>
                        
                        <a type="button" class=" m-l btn btn-success paynow noprint" href="/airCart/registerPayment/<?php echo $model->id;?>">Pay Now</a>
                        <?php }?>
                        <div class="clearfix"></div>
                        <span class="font-bold"><?php echo number_format($model->user->userInfo->balance) . ' + ' . number_format($model->user->userInfo->credit_limit) . ' = ' . number_format($puchasingBalance) . $htmlResultingBalance; ?></span>
                    </div>
                </div>

            </div>
            <div class=" col-lg-12 bluebg">
                <span class="col-md-3">Created by: <?php echo CHtml::link("<b>{$model->user->userInfo->name}</b>", "/users/manage?selectedvalue={$model->user_id}"); ?></span>
                <span class="col-md-2">Client Source: <?php echo $model->clientSource->name; ?></span>
                <span class="col-md-4">Generation Time: <?php echo Utils::cutMilliseconds($model->created); ?></span>
                <span class="col-md-3">Visited: Safari / Mobile/ IOS</span>
            </div>
            <div class=" pull-left m-t">
            <?php    echo TbHtml::button('Auto Pay request', [
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
<!--                <button type="button" class="btn btn-primary">Auto Pay Request </button>

                <button type="button" class="btn btn-primary">Payment Request </button>-->

                <button type="button" class="btn btn-warning" onclick="doReSync(<?php echo $model->id; ?>);">ReSync</button>

            </div>
            
            <div class=" m-t pull-right custom-tabs">
             <?php
                $trans_count = count( $model->payGateLogs);
                $note_count = count($model->getNotes());
                $file_count = count($model->files);
             ?>
                <button id="one" type="button" class="tabcustom btn btn-primary btn-xs">Transactions (<?php echo $trans_count; ?>)</button>
                <button id="two" type="button" class="tabcustom btn btn-primary btn-xs">Notes (<?php echo $note_count; ?>)</button>
                <button id="three" type="button" class="tabcustom btn btn-primary btn-xs">Files (<?php echo $file_count; ?>)</button>
                <div class="btn-group">
                    <button data-toggle="dropdown" class="btn btn-warning btn-xs dropdown-toggle">More <span class="caret"></span></button>
                    <ul class="dropdown-menu">
                        <li><a href="#">Supervisor Check</a></li>
                        <li><a href="#">Accounting</a></li>
                        <li><a href="#">Ticketing Instructions</a></li>
                        <li><a href="#">Baggage Rules</a></li>
                        <li><a href="#">Visa Rules</a></li>
                        <li><a href="#">Penalties</a></li>
                        <li><a href="#">Insurance</a></li>
                    </ul>
                </div>

            </div>
        </div>
    </div>
</div>

<div class="wrapper wrapper-content animated fadeInRight">

    <div class="row">
        
        <div class="col-lg-8">
            <?php
            $this->renderPartial('_clientinfo', ['model' => $model]);
            ?>    

            <?php
                       
            $model->setAirBookingsAndAirRoutesOrder();
$this->renderPartial('_cartprice', ['model' => $model,'airBookings' => AirBooking::model()->with([
        'airRoutes' => ['order' => '"airRoutes".departure_ts']
    ])->findAll([
        'order' => 't.departure_ts, traveler_id',
        'condition' => "air_cart_id=$model->id"])
]);
            ?>
        </div>
		
		<div class="col-lg-4">
			<div class="ibox-content infodiv">
                            <div class="tab-body one show">
                            <?php 
                                $this->renderPartial('_transactions', [
            'pgs' => $model->payGateLogs,
            'airCartId' => $model->id,
        ]);
                            ?>
                            </div>
                            <div class="tab-body notesContainer  two"><?php 
                                $this->renderPartial('_notes',['model' => $model]); ?></div>
                            <div class="tab-body three"><?php 
                                $this->renderPartial('_files',['model' => $model]); ?></div>
                        </div>
        </div>
    </div>

</div>



<div class="wrapper wrapper-content animated fadeInLeft">
    <?php
    $this->renderPartial('_viewairbooking', ['airBookings' => AirBooking::model()->with([
        'airRoutes' => ['order' => '"airRoutes".departure_ts']
    ])->findAll([
        'order' => 't.departure_ts, traveler_id',
        'condition' => "air_cart_id=$model->id"])
]);
    ?>

</div>
<div class="wrapper wrapper-content animated fadeInLeft">
    <?php
        $amendments = Amendment::model()->findAllBySql('
    Select sum(amount_to_charge) as amount_to_charge, min(amendment.id) as id, amendment.group_id, min(air_booking_id) as air_booking_id , min(amendment.created) as created, amendment_type_id, min(amendment.note) as note , amendment_status_id, min (amendment.payment_status_id) as payment_status_id
    From amendment
    JOIN air_booking on (air_booking.id = amendment.air_booking_id)
    WHERE air_booking.air_cart_id = :cartId
    Group By amendment.group_id, amendment_status_id, amendment_type_id
    ORDER BY id
    ', ['cartId' => $model->id]);
//Utils::dbgYiiLog($amendments);
if (count($amendments) > 0) {     // There is amendments
    $this->renderPartial('_cartamendments', ['amendments' => $amendments]);
}
$this->renderPartial('_modifyairbooking', ['model' => $model, 'errors' => $errors]);

if (count($payments) > 0) {     // There are payments
    //$this->renderPartial('_cartpayments', ['payments' => $payments]);
}
    ?>
</div>
    <div class="wrapper wrapper-content animated fadeInLeft">
    <?php
    if (count($payments) > 0) {  
    $this->renderPartial('_cartpayments', ['payments' => $payments]);
    }
    ?>

</div>

<script>
    function sendEmail() {

        $('#emailModal').modal('show');

    }

    function send() {
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
                    $('#msg').fadeIn();
                })
                .always(function () {

                    $('#btnEmail').attr('disabled', false);
                    $('#btnEmail').removeClass('disabled');
                });
    }
    
    function changeTheme(){
        
        $.post('/airCart/changeTheme', { }).always(function () {
                window.location.reload();
                });
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
    
    $(function() {
        $('.checkbox').change(function() {
            tbody = $(this).parents('tbody');
            if ($(this).is(":checked")) {
                $(tbody).addClass('selected');
            } else {
                $(tbody).removeClass('selected');
            }
        });

        // Some inputs shold be capital letters only
        $("input.capitalize").keyup(function() {
            this.value = this.value.toUpperCase();
        });
    });
    
    function amendItems() {
        amendmentType = $('#amendment_type').val();
        if (amendmentType == '') {
            alert('Please choose the amendment type!');
            $('#amendment_type').focus();
        }
        else {
            var arrayOfIds = $.map($(".selected"), function(n, i) {
                return {ar: n.getAttribute('ar'), ab: n.getAttribute('ab')};
            });
            if (arrayOfIds.length == 0) {
                alert('Please select the element(s) that need to be amended!');
            }
            else {
                $('#myModal').modal('show');
                $("#myModal").unbind("hidden");
                $('#myModal').on('hidden', function() {
                    if ($('#amendReasonBtn').val() == '1') { // The submit button is pressed
                        if ($('#amendReason').val().length < 5) { // The reason is too short
                            alert('The amendment reason is too short.\nPlease enter valid and detailed amendment reason!');
                        } else {
                            $.post('/airCart/amend/' + amendmentType, {
                                items: arrayOfIds,
                                reason: $('#amendReason').val()
                            }, function(data) {
                                if (data.result === 'success') {
//                                    location.href = location.href.split('#')[0] + '#cartAmendments';
                                    document.body.style.cursor = 'wait';
                                    location.reload();
                                    location.hash = '#cartAmendments';
                                } else {
                                    alert(data.message);
                                }
                            }, 'json');
                        }
                    }
                });
            }
        }
    }
</script>


<script>
 //tabbing script
    function show()
    {
        this.show();
    }
     var getid = "";
    $('.tabcustom').click(function(){
        var getid = this.id;
        //alert(getid);
       
       if($('.tab-body').hasClass(getid))
       {
            $('.tab-body').removeClass('show');
            
            $('.tab-body.'+getid ).addClass('show');
       }
     });
</script>