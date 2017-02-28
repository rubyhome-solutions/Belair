<style>
    #newspaperu-b {
        border-collapse: collapse;
        border-color: #B7DDF2;
        border-style: solid;
        border-width: 1px;
        font-family: Arial,Helvetica,sans-serif;
        font-size: 11px;
        margin: 0 0 20px;
        text-align: left;
        width: 800px;
       
    }
    #newspaperu-b th {
        background: none repeat scroll 0 0 #EBF4FB;
        border-color: lightgray;
        font-size: 11px;
        font-weight: bold;
        padding: 15px 10px 10px;
    }
    #newspaperu-b tbody tr td {
    }
    #newspaperu-b td {
        border-top: 1px dashed #FFFFFF;
        color: #000000;
        padding: 10px;
    }
/*    #newspaper-b tbody tr:hover td {
        background: none repeat scroll 0 0 #FFCF8B;
        color: #000000;
    }*/
    #newspaperu-b tbody tr.selected td {
        background: none repeat scroll 0 0 #dff0d8;
        color: #000000;
    }
    #newspaperu-b tbody tr  {position:relative;}
    #newspaperu-b tbody tr i.fa-check {display:none;}
    #newspaperu-b tbody tr.selected i.fa-check {
            display:block;
            position:absolute;
            right:10px;
            top:14px;
    }
   td.rBoxCheck  {position:relative;}
    
    
    .amendPNRmodalDialog {
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
.amendPNRmodalDialog:target {
    opacity:1;
    pointer-events: auto;
    overflow:auto;
}
.amendPNRmodalDialog > div {
    width: 800px;
    position: relative;
    margin: 10% auto;
    padding: 5px 20px 13px 20px;
    border-radius: 10px;
    background: #ececec;
   
}
.amendPNRclose {
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
.amendPNRclose:hover {
    background: #00d9ff;
}
#amendPNRTable table tr td input{padding:0 5px;}
#amendPNRTable table tr td {padding:5px 10px 5px 0;}
#amendPNRTable table  {margin-bottom:10px;}
</style>


<div id="amendPNRModal" class="amendPNRmodalDialog">
    <div>	<a href="#close" title="Close" class="amendPNRclose">X</a>

        	<h4>Update Ticket Details</h4> 
  <form method="POST" id='formPNR' style="" action="/airCart/amend">
   
        <table id="newspaperu-b" class="ampnrtable table table-bordered table-condensed">
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
$first=true;
    foreach ($airBookings as $booking) {
        if($first){
            ?><input type='hidden' name='ticketcartid' id='ticketcartid' value='<?php echo $booking->air_cart_id;?>' />
        <?php
        $first=false;
        }
        if(!isset($sectors[$booking->source->airport_code][$booking->destination->airport_code])){
           $sectors[$booking->source->airport_code][$booking->destination->airport_code]='set';
        ?>
         <tr style="margin-left:20px;" id='<?php echo $booking->id;?>' value='' >
            <td colspan='4' class="heading"><?php echo $booking->source->airport_code.' - '.$booking->destination->airport_code;?> <i style="color:green" class="fa fa-check fa-lg"></i></td>
        </tr> 
        <tr>
            <td>Name</td>
            <td>CRS PNR</td>
            <td>AIRLINE PNR</td>
            <td>TICKET NO</td>
        </tr>
            <?php
        }
       
        ?>
       
            <tr>
                <td><?php echo $booking->traveler->first_name.' '.$booking->traveler->last_name;?></td>
                <td><input name='ticket_<?php echo $booking->id.'_crs_pnr';?>' id='ticket_<?php echo $booking->id.'_crs_pnr'?>' value='<?php echo $booking->crs_pnr;?>' /></td>
                <td><input name='ticket_<?php echo $booking->id.'_airline_pnr';?>' id='ticket_<?php echo $booking->id.'_airline_pnr'?>' value='<?php echo $booking->airline_pnr;?>' /></td>
                <td><input name='ticket_<?php echo $booking->id.'_ticket_no';?>' id='ticket_<?php echo $booking->id.'_ticket_no'?>' value='<?php echo $booking->ticket_number;?>' /></td>
            </tr>
          
        <?php 
    }


?>
   </tbody>
</table>
      <button class="btn btn-small btn-primary" type="button" id='amendbtnpnr' onclick="amendPNR(this)">Submit</button> 
 </form> 

               
 <h4 id='pnrdone' style="display: none">Successfully Done!!</h4>
    </div>
</div>


<script>
       var url=window.location.href;
   
    
    function amendPNR(element){
        $(element).prop('disabled', true);
         $.post('/airCart/amendUpdateTicket/', $('#formPNR').serialize(), function (data) {
            if (typeof data.result !== 'undefined') {
            //alert(data.error+' refresing page');
            $('.ampnrtable').hide();
            $('#amendbtnpnr').hide();
            $('#pnrdone').show();
            window.location.href = url;
            //window.location.reload();
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
