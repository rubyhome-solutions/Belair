<style>
    #newspaper-b {
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
    #newspaper-b th {
        background: none repeat scroll 0 0 #EBF4FB;
        border-color: lightgray;
        font-size: 11px;
        font-weight: bold;
        padding: 15px 10px 10px;
    }
    #newspaper-b tbody tr td {
        background: none repeat scroll 0 0 #FFFFFF;
    }
    #newspaper-b td {
        border-top: 1px dashed #FFFFFF;
        color: #000000;
        padding: 10px;
    }
/*    #newspaper-b tbody tr:hover td {
        background: none repeat scroll 0 0 #FFCF8B;
        color: #000000;
    }*/
    #newspaper-b tbody tr.selected td {
        background: none repeat scroll 0 0 #dff0d8;
        color: #000000;
    }
    #newspaper-b tbody tr  {position:relative;}
    #newspaper-b tbody tr i.fa-check {display:none;}
    #newspaper-b tbody tr.selected i.fa-check {
            display:block;
            position:absolute;
            right:10px;
            top:14px;
    }
   td.rBoxCheck  {position:relative;}
    
    
    .amendResmodalDialog {
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
.amendResmodalDialog:target {
    opacity:1;
    pointer-events: auto;
    overflow:auto;
}
.amendResmodalDialog > div {
    width: 400px;
    position: relative;
    margin: 10% auto;
    padding: 5px 20px 13px 20px;
    border-radius: 10px;
    background: #ececec;
   
}
.amendResclose {
    background: #606061;
    color: #FFFFFF;
    line-height: 25px;
    position: absolute;
    right: -12px;
    text-align: center;
    top: -10px;
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
.amendResclose:hover {
    background: #00d9ff;
}
#amendResTable table tr td input{padding:0 5px;}
#amendResTable table tr td {padding:5px 10px 5px 0;}
#amendResTable table  {margin-bottom:10px;}
</style>


<div id="amendResModal" class="amendResmodalDialog">
    <div>	<a href="#close" title="Close" class="amendResclose">X</a>

        	<h4>Reschedule</h4> 

        <table id="newspaper-b" class='amrestable'>
     <tbody>
<?php 
$airlinesParams = array('order' => 'name');
    $airportsParams = array('order' => 'city_name');
$listAirlines = CHtml::listData(Carrier::model()->findAll($airlinesParams), 'id', 'name');
$listAirports = CHtml::listData(Airport::model()->findAll($airportsParams), 'id', 'airport_code');
$airBookings=AirBooking::model()->with([
        'airRoutes' => ['order' => '"airRoutes".departure_ts']
    ])->findAll([
        'order' => 't.departure_ts, traveler_id',
        'condition' => "air_cart_id=$model->id and ab_status_id!=".  \AbStatus::STATUS_CANCELLED." " ]);
$sectors=[];
    $first = true;
    $conv_fee = 0;
    foreach ($airBookings as $booking) {
        if(!$first) {
            $conv_fee = $booking->airCart->convenienceFee;
        }
        if(isset($sectors[$booking->source->airport_code][$booking->destination->airport_code])){
            continue;
        }
        $first = false;
        $sectors[$booking->source->airport_code][$booking->destination->airport_code]='done';
        ?>
       
  
        <tr style="margin-left:20px" class='resam' id='<?php echo $booking->id;?>' value='<?php echo ($booking->getTotalAmountToPay() - $conv_fee);?>' >
            <td class="rBoxCheck"><?php echo $booking->source->airport_code.' - '.$booking->destination->airport_code;?> <i style="color:green" class="fa fa-check fa-lg"></i></td>
        </tr>  
        <input type='hidden' value='<?php echo $booking->carrier->id;?>' id='carrierid_<?php echo $booking->id;?>'/>
       
       <input type='hidden' value='<?php echo $booking->carrier->name;?>' id='carrier_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->source->airport_code;?>' id='source_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->destination->airport_code;?>' id='destination_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->airRoutes[0]->flight_number;?>' id='flightno_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->departure_ts;?>' id='depts_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->arrival_ts;?>' id='arrts_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->airline_pnr;?>' id='airline_pnr_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->crs_pnr;?>' id='crs_pnr_<?php echo $booking->id;?>'/>
       <input type='hidden' value='<?php echo $booking->ticket_number;?>' id='ticket_number_<?php echo $booking->id;?>'/>
      
        <?php 
        }


?>
   </tbody>
</table>

<div id='amendResTable' style="display:none">
     <form method="POST" id='formRes' style="float: left; margin-right:5px;margin-bottom:0px;" action="/airCart/amend">
    <table>
       
        <tbody>
           
            <input name='bookingid' id="bookingid" value='' type='hidden'/>
            <tr>
                <td>AirLine Fee</td>
                <td><input name='resairlinefee' id="resairlinefee" value='0' onkeyup="fixResValues()"/></td>
            </tr>
            <tr>
                <td>Service Fee</td>
                <td><input name='resservicefee' id="resservicefee" value='0' onkeyup="fixResValues()"/></td>
            </tr>
            <tr>
                <td>Total Charge</td>
                <td><input name='resrefund' id="resrefund" value='0' onkeyup="fixResChargeValues()" /></td>
            </tr>
        </tbody>
       
    </table>
    <table class='table table-condensed table-bordered'>
            <tr class='heading'>
                <th>Field</th>
                <th>Original</th>
                <th>New value</th>
            </tr>
            <tr>
                <td>Airline</td>
                <td><div id='div_carrier_name'></div></td>
                <td colspan='2'><?php echo TbHtml::dropDownList( 'carrier_id','', $listAirlines, ['style' => 'max-width: 150px;', 'name' => 'Amendment[carrier_id]']); ?></td>
            </tr>
            <tr>
                <td>From</td>
                <td><div id='div_source_code'></div></td>
                <td colspan='2'><?php echo TbHtml::dropDownList('source_id','', $listAirports, ['style' => 'max-width: 150px;', 'name' => 'Amendment[source_id]']); ?></td>
            </tr>
            <tr>
                <td>To</td>
                <td><div id='div_destination_code'></div></td>
                <td colspan='2'><?php echo TbHtml::dropDownList( 'destination_id','', $listAirports, ['style' => 'max-width: 150px;', 'name' => 'Amendment[destination_id]']); ?></td>
            </tr>
            
            <tr>
                <td>Flight No</td>
                <td><div id='div_flight_number'></div></td>
                <td colspan='2'><?php echo TbHtml::textField( 'flight_number','', ['class' => 'center', 'name' => 'Amendment[flight_number]', 'maxlength' => 13]); ?></td>
            </tr>
            <tr>
                <td>Departure (YYYY-MM-DD hh:mm)</td>
                <td><div id='div_departure_ts'></div>
                </td>
                <td colspan='2'>
                    <?php //echo TbHtml::textField('departure_ts','', ['class' => 'center', 'style' => 'max-width: 150px;', 'name' => 'Amendment[departure_ts]']); ?>
                    <?php $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                                'name' => 'departure_ts',
                                // additional javascript options for the date picker plugin
                                'options' => array(
                                    'showSecond' => 'true',
                                    'timeFormat' => 'hh:mm:ss',
                                    'dateFormat' => 'yy-mm-dd',
                                ),
                                'htmlOptions' => array(
                                    'style' => 'width:160px;', 'id' => 'departure_ts_res', 'value' => date('Y-m-d h:m:s'),)
                            ));
                    ?>
                </td>
            </tr>
            <tr>
                <td>Arrival (YYYY-MM-DD hh:mm)</td>
                <td><div id='div_arrival_ts'></div>
                </td>
                <td colspan='2'>
                    <?php //echo TbHtml::textField('arrival_ts','', ['class' => 'center', 'style' => 'max-width: 150px;', 'name' => 'Amendment[arrival_ts]']); ?>
                    <?php $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                                'name' => 'arrival_ts',
                                // additional javascript options for the date picker plugin
                                'options' => array(
                                    'showSecond' => 'true',
                                    'timeFormat' => 'hh:mm:ss',
                                    'dateFormat' => 'yy-mm-dd',
                                ),
                                'htmlOptions' => array(
                                    'style' => 'width:160px;', 'id' => 'arrival_ts_res', 'value' => date('Y-m-d h:m:s'),)
                            ));
                    ?>
                </td>
            </tr>
            <tr>
                <td>Air PNR</td>
                <td><div id='div_airline_pnr'></div></td>
                <td colspan='2'><?php echo TbHtml::textField('airline_pnr','', ['class' => 'center capitalize', 'name' => 'Amendment[airline_pnr]', 'maxlength' => 6]); ?></td>
            </tr>
            <tr>
                <td>CRS PNR</td>
                <td><div id='div_crs_pnr'></div></td>
                <td colspan='2'><?php echo TbHtml::textField('crs_pnr','', ['class' => 'center capitalize', 'name' => 'Amendment[crs_pnr]', 'maxlength' => 6]); ?></td>
            </tr>
            <tr style="display:none;">
                <td>E-ticket</td>
                <td><div id='div_ticket_number'></div></td>
                <td colspan='2'><?php echo TbHtml::textField('ticket_number','', ['class' => 'center capitalize', 'name' => 'Amendment[ticket_number]', 'maxlength' => 20, 'style' => 'max-width: 120px;']); ?></td>
            </tr>
     </table>
     </form> 
  <button class="btn btn-small btn-primary" type="button" id='resamend' onclick="amendRes(this)">Submit</button>
  
</div>
 <h4 id='resdone' style="display: none">Successfully Done!!</h4>
    </div>
</div>


<script>
       var url=window.location.href;
    var resarray=[];
    var resvalue=0;
    var bookingsarray=[];
    $('#newspaper-b .resam').on('click', function(e) {
//        console.log('inside resam');
//        console.log(this.id);
//        console.log($(this).attr('id'));
         $('#newspaper-b .resam').each(function(){$(this).removeClass( "selected" );})
         $(this).toggleClass("selected"); 
//      console.log(amendvalue); 
      var bid=parseInt($(this).attr('id'));
       // console.log(bid);
      //  console.log($('#carrier_'+bid).val());
      
        $('#div_carrier_name').text($('#carrier_'+bid).val());
        $('#div_source_code').text($('#source_'+bid).val());
        $('#div_destination_code').text($('#destination_'+bid).val());
        $('#div_flight_number').text($('#flightno_'+bid).val());
      
        $('#div_departure_ts').text($('#depts_'+bid).val());
        $('#div_arrival_ts').text($('#arrts_'+bid).val());
        $('#div_airline_pnr').text($('#airline_pnr_'+bid).val());
        $('#div_crs_pnr').text($('#crs_pnr_'+bid).val());
        $('#div_ticket_number').text($('#ticket_number'+bid).val());
        
        $('#resservicefee').val(parseFloat($(this).attr('value')));
        $('#resrefund').val(parseFloat($(this).attr('value')));
        
         $("#bookingid").val(bid);
        $('.amrestable').hide();
        
        $('#amendResTable').show();
        $('#newspaper-b').hide();
        $("#flight_number").val($('#flightno_'+bid).val());
        $("#departure_ts_res").val($('#depts_'+bid).val());
        $("#arrival_ts_res").val($('#arrts_'+bid).val());
        $("#airline_pnr").val($('#airline_pnr_'+bid).val());
        $("#crs_pnr").val($('#crs_pnr_'+bid).val());
        $("#ticket_number").val($('#ticket_number'+bid).val());
        
        $("#carrier_id option").filter(function() { return $(this).text() ===(''+$('#carrier_'+bid).val()) ; }).prop('selected', true);
        $("#source_id option").filter(function() { return $(this).text() ===(''+$('#source_'+bid).val()) ; }).prop('selected', true);
        $("#destination_id option").filter(function() { return $(this).text() ===(''+$('#destination_'+bid).val()) ; }).prop('selected', true);
        e.preventDefault();
      
    });
    
    
    function fixResValues(){
       // var refundinitial=parseFloat($('#resrefundinitial').val());
        var refund=parseFloat($('#resrefund').val());
        var servicefee=parseFloat($('#resservicefee').val());
        var airlinefee=parseFloat($('#resairlinefee').val());
        //console.log('refundinitial '+refundinitial+'  refund: '+refund+'  servicefee:'+servicefee+ '  airlinefee:'+airlinefee);;
        var res=parseFloat(servicefee+airlinefee);
        $('#resrefund').val(res);
        
    }
    
    function fixResChargeValues(){
        //var refundinitial=parseFloat($('#resrefundinitial').val());
        var refund=parseFloat($('#resrefund').val());
        var servicefee=parseFloat($('#resservicefee').val());
        var airlinefee=parseFloat($('#resairlinefee').val());
        //console.log('refundinitial '+refundinitial+'  refund: '+refund+'  servicefee:'+servicefee+ '  airlinefee:'+airlinefee);;
        
        var res=parseFloat(refund-airlinefee);
        //console.log('res: '+res);
        $('#resservicefee').val(parseFloat(res));
        
    }
    
    function amendRes(element){
         $(element).prop('disabled', true);
         $.post('/airCart/amendReschedule/', $('#formRes').serialize(), function (data) {
            if (typeof data.result !== 'undefined') {
            //alert(data.error+' refresing page');
            $('#amendResTable').hide();
            $('#resdone').show();
            //window.location.href = url;
            window.location.reload();
        }
        else{
            alert('Some Error Occured');
            $(element).prop('disabled', false);
            //window.location.reload(); //relative to domain
        }
        
        
        }, 'json')
                .done(function () {
                    
        });
    }

</script>
