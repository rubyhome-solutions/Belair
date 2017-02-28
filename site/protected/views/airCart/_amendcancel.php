<style>
    #CancellationTable {
        border-collapse: collapse;
        border-color: #B7DDF2;
        border-style: solid;
        border-width: 1px;
        font-family: Arial,Helvetica,sans-serif;
        font-size: 11px;
        margin: 0 0 20px;
        text-align: left;
        width: 400px;

    }
    #CancellationTable th {
        background: none repeat scroll 0 0 #EBF4FB;
        border-color: lightgray;
        font-size: 11px;
        font-weight: bold;
        padding: 15px 10px 10px;
    }
    #CancellationTable tbody tr td {
        background: none repeat scroll 0 0 #FFFFFF;
    }
    #CancellationTable td {
        border-top: 1px dashed #FFFFFF;
        color: #000000;
        padding: 10px;
    }
    /*    #newspaper-b tbody tr:hover td {
            background: none repeat scroll 0 0 #FFCF8B;
            color: #000000;
        }*/
    #CancellationTable tbody tr.selected td {
        background: none repeat scroll 0 0 #dff0d8;
        color: #000000;
    }
    #CancellationTable tbody tr  {position:relative;}
    #CancellationTable tbody tr i.fa-check {display:none;}
    #CancellationTable tbody tr.selected i.fa-check {
        display:block;
        position:absolute;
        right:10px;
        top:14px;
    }
    td.BoxCheck  {position:relative;}


    .amendCancelmodalDialog {
        position: fixed;
        font-family: Arial, Helvetica, sans-serif;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 99999;
        opacity:0;
        -webkit-transition: opacity 400ms ease-in;
        -moz-transition: opacity 400ms ease-in;
        transition: opacity 400ms ease-in;
        pointer-events: none;
    }
    .amendCancelmodalDialog:target {
        opacity:1;
        pointer-events: auto;
    }
    .amendCancelmodalDialog > div {
        width: 400px;
        position: relative;
        margin: 10% auto;
        padding: 5px 20px 13px 20px;
        border-radius: 10px;
        background: #ececec;

    }
    .amendCancelclose {
        background: #606061;
        color: #FFFFFF;
        line-height: 25px;
        position: absolute;
        right: -17px;
        text-align: center;
        top: -18px;
        width: 24px;
        text-decoration: none;
        font-weight: bold;
        -webkit-border-radius: 12px;
        -moz-border-radius: 12px;
        border-radius: 12px;
        -moz-box-shadow: 1px 1px 3px #000;
        -webkit-box-shadow: 1px 1px 3px #000;
        box-shadow: 1px 1px 3px #000;
    }
    .amendCancelclose:hover {
        background: #00d9ff;
    }
    #amendTable table tr td input{padding:0 5px;}
    #amendTable table tr td {padding:5px 10px 5px 0;}
    #amendTable table  {margin-bottom:10px;}
</style>


<div id="amendCancelModal" class="amendCancelmodalDialog">
    <div>	
        <a href="#close" title="Close" class="amendCancelclose">X</a>
        <div style="max-height:500px; overflow-y: scroll;overflow-x: hidden;width: 105%;">
            <h4>Cancellation </h4> 

            <table id="CancellationTable">
                <tbody>
                    <?php
                    $first = true;
                    $conv_fee = 0;
                    $source = 0;
                    $destination = 0;
                    $airBookings = AirBooking::model()->with([
                            'airRoutes' => ['order' => '"airRoutes".departure_ts']
                        ])->findAll([
                        'order' => 't.departure_ts, traveler_id',
                        'condition' => "air_cart_id=$model->id and ab_status_id!=" . \AbStatus::STATUS_CANCELLED . " "]);
                    foreach ($airBookings as $booking) {
                        if (!$first) {
                            $conv_fee = $booking->airCart->convenienceFee;
                        }
                        $first = false;
                        $airRoute = AirRoutes::model()->find([
                            'condition' => "t.air_booking_id=$booking->id"]);

                        if ($source != $airRoute->source_id && $destination != $airRoute->destination_id) {
                            ?>
                            <tr><td colspan="2">
                                    <table>
                                        <tr  class="heading">
                                            <th>Airline</th>
                                            <th>Flight No.</th>
                                            <th>Airport</th>
                                            <th>Departure</th>
                                            <th></th>
                                            <th>Airport</th>
                                            <th>Arrival</th>
                                        </tr>
                                        <tr>
                                            <td><?php echo $airRoute->carrier->generateImgTag . "&nbsp;&nbsp;" . $airRoute->carrier->name; ?></td>
                                            <td class="center">
                                                <?php
                                                echo "{$airRoute->carrier->code}-{$airRoute->flight_number}";
                                                if ($airRoute->ts) {
                                                    echo '<br><p style="font-weight: bold;font-size: .9em;background-color: #F1D9D5;">Via: ' . $airRoute->ts . '</p>';
                                                }
                                                ?>
                                            </td>
                                            <td class="center">
                                                <?php
                                                echo $airRoute->source->nameCode;
                                                ?>
                                            </td>
                                            <td class="center"><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->departure_ts)); ?></td>
                                            <td class="center"><i class='fa fa-long-arrow-right fa-lg'></i></td>
                                            <td class="center"><?php echo $airRoute->destination->nameCode; ?></td>
                                            <td class="center"><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->arrival_ts)); ?></td>
                                        </tr>
                                    </table>
                                </td> 
                            </tr>

                        <?php
                        }
                        ?>
                        </td>
                        </tr>
                        <tr style="margin-left:20px" class='route' id='<?php echo $booking->id; ?>' value='<?php echo ($booking->getTotalAmountToPay() - $conv_fee); ?>' >

                            <td><?php echo $booking->traveler->first_name . ' ' . $booking->traveler->last_name; ?></td>
                            <td class="BoxCheck"><?php echo $booking->source->airport_code . ' - ' . $booking->destination->airport_code; ?> <i style="color:green" class="fa fa-check fa-lg"></i></td>
                        </tr>    


                        <?php
                        $source = $airRoute->source_id;
                        $destination = $airRoute->destination_id;
                    }
                    ?>
                </tbody>
            </table>
            <button class="btn btn-small btn-success pull-right" type="button" id='cancelAll' onclick="cancelAll()">Select All</button>
            <button class="btn btn-small btn-success pull-right" style="display:none;" type="button" id='resetAll' onclick="resetAll()">Deselect All</button>
            <button class="btn btn-small btn-primary" type="button" id='nextbtn' onclick="nextCancel()">Next</button>
            <div id='amendTable' style="display:none">
                <table  >
                    <form method="POST" style="float: left; margin-right:5px;margin-bottom:0px;" action="/airCart/amend">
                        <tbody>
                            <tr>
                                <td>Refund without Fees</td>
                                <td><input name='refundinitial' id="refundinitial" value='0' onkeyup="fixRefundValues()"/> </td>
                            </tr>
                            <tr>
                                <td>AirLine Fee</td>
                                <td><input name='airlinefee' id="airlinefee" value='0' onkeyup="fixRefundValues()"/></td>
                            </tr>
                            <tr>
                                <td>Service Fee</td>
                                <td><input name='servicefee' id="servicefee" value='0' onkeyup="fixRefundValues()"/></td>
                            </tr>
                            <tr>
                                <td>Actual Refund</td>
                                <td><input name='refund' id="refund" value='0' onkeyup="fixChargeValues()" /></td>
                            </tr>
                            <tr>
                                <td>Send Mail</td>
                                <td><input type="checkbox" name='doescancelsendmail' id="doescancelsendmail" checked='checked' value='yes'/></td>
                            </tr>
                        </tbody>
                    </form> 
                </table>
                <button class="btn btn-small btn-primary" type="button" id='prevbtn' onclick="prevCancel()">Previous</button> 
                <button class="btn btn-small btn-primary" type="button" id='cancelamend' onclick="amendCancel(this)">Submit</button>

            </div>
            <h4 id='canceldone' style="display: none">Successfully Done!!</h4>
        </div>
    </div>
</div>





<script>
    var url = window.location.href;
    var amendarray = [];
    var amendvalue = 0;
    var bookingsarray = [];
    $('#CancellationTable .route').on('click', function (e) {
//      console.log('before');
//      console.log(amendarray);
//      console.log(amendvalue);
        $(this).toggleClass("selected");

        if ($(this).hasClass("selected")) {
            amendarray.push(this.id);
            amendvalue = amendvalue + parseFloat($(this).attr('value'));

        } else {
            if ($.inArray(this.id, amendarray) !== -1) {
                amendvalue = amendvalue - parseFloat($(this).attr('value'));
            }
            amendarray.splice($.inArray(this.id, amendarray), 1);

        }
        e.preventDefault();
//      console.log('after');
        //  console.log(amendarray);
        //  console.log(amendvalue);
    });
    function cancelAll()
    {
        //$('#newspaper-b .route').toggleClass("selected");
        $('#CancellationTable .route').each(function () {
            if (!$(this).hasClass("selected"))
            {
                $(this).addClass("selected");
                amendarray.push(this.id);
                amendvalue = amendvalue + parseFloat($(this).attr('value'));
                $('#cancelAll').hide();
                $('#resetAll').show();
            }
        })
        //$('#newspaper-b .route').each(function(){
        //  if ( $( this ).hasClass( "selected" ) ){
        //amendarray.push(this.id);          
        //amendvalue=amendvalue+parseFloat($(this).attr('value'));

        // }else{
        //       if($.inArray(this.id, amendarray)!==-1){
        //       amendvalue=amendvalue-parseFloat($(this).attr('value'));}
        //       amendarray.splice( $.inArray(this.id, amendarray), 1 );

        //  }    
        //e.preventDefault();
        //   console.log(amendarray);
        //   console.log(amendvalue);
        //});
    }
    function resetAll()
    {
        $('#CancellationTable .route').each(function () {
            $(this).removeClass("selected");
            $('#cancelAll').show();
            $('#resetAll').hide();
            if ($.inArray(this.id, amendarray) !== -1) {
                amendvalue = amendvalue - parseFloat($(this).attr('value'));
            }
            amendarray.splice($.inArray(this.id, amendarray), 1);

            //  console.log(amendarray);
            //  console.log(amendvalue);
        })

    }
    function prevCancel() {
        $('#amendTable').hide();
        $('#CancellationTable').show();
        $('#nextbtn').show();
        $('#cancelAll').show();
    }

    function nextCancel() {
        $('#refundinitial').val(amendvalue);
        $('#refund').val(amendvalue);
        $('#CancellationTable').hide();
        $('#amendTable').show();
        $('#nextbtn').hide();
        $('#resetAll').hide();
        $('#cancelAll').hide();
    }



    function fixRefundValues() {
        var refundinitial = parseFloat($('#refundinitial').val());
        var refund = parseFloat($('#refund').val());
        var servicefee = parseFloat($('#servicefee').val());
        var airlinefee = parseFloat($('#airlinefee').val());
        //console.log('refundinitial '+refundinitial+'  refund: '+refund+'  servicefee:'+servicefee+ '  airlinefee:'+airlinefee);;
        var res = parseFloat(refundinitial - (servicefee + airlinefee));
        $('#refund').val(res);

    }

    function fixChargeValues() {
        var refundinitial = parseFloat($('#refundinitial').val());
        var refund = parseFloat($('#refund').val());
        var servicefee = parseFloat($('#servicefee').val());
        var airlinefee = parseFloat($('#airlinefee').val());
        //console.log('refundinitial '+refundinitial+'  refund: '+refund+'  servicefee:'+servicefee+ '  airlinefee:'+airlinefee);;

        var res = parseFloat((refundinitial - (airlinefee)) - refund);
        //console.log('res: '+res);
        $('#servicefee').val(parseFloat(res));

    }

    function amendCancel(element) {
        $(element).prop('disabled', true);
        $.post('/airCart/amendCancel/', {amendarray: amendarray, refund: $('#refund').val(), servicefee: $('#servicefee').val(), airlinefee: $('#airlinefee').val(), doescancelsendmail: $('#doescancelsendmail').val()}, function (data) {
            if (typeof data.result !== 'undefined') {
                //alert(data.error+' refresing page');
                $('#amendTable').hide();
                $('#canceldone').show();
                window.location.href = url;
                //window.location.reload();
            } else {
                alert('Some Error Occured');
                $(element).prop('disabled', false);
                //window.location.reload(); //relative to domain
            }


        }, 'json')
                .done(function () {

                });
    }

    $("#doescancelsendmail").change(function () {
        //alert("checked");
        if ($(this).is(":checked")) {
            $(this).val("yes");
            //alert($(this).val());
        } else {
            $(this).val("no");
            ;
        }
    });

</script>
