<style>
    #newspaper-ro {
        border-collapse: collapse;
        border-color: #B7DDF2;
        border-style: solid;
        border-width: 1px;
        font-family: Arial,Helvetica,sans-serif;
        font-size: 11px;
        margin: 0 0 20px;
        text-align: left;
        width: 600px;

    }
    #newspaper-ro th {
        background: none repeat scroll 0 0 #EBF4FB;
        border-color: lightgray;
        font-size: 11px;
        font-weight: bold;
        padding: 15px 10px 10px;
    }
    #newspaper-ro tbody tr td {

    }
    #newspaper-ro td {
        border-top: 1px dashed #FFFFFF;
        color: #000000;
        padding: 10px;
    }
    /*    #newspaper-b tbody tr:hover td {
            background: none repeat scroll 0 0 #FFCF8B;
            color: #000000;
        }*/
    #newspaper-ro tbody tr.selected td {
        background: none repeat scroll 0 0 #dff0d8;
        color: #000000;
    }
    #newspaper-ro tbody tr  {position:relative;}
    #newspaper-ro tbody tr i.fa-check {display:none;}
    #newspaper-ro tbody tr.selected i.fa-check {
        display:block;
        position:absolute;
        right:10px;
        top:14px;
    }
    td.rBoxCheck  {position:relative;}


    .amendRoutesmodalDialog {
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
    .amendRoutesmodalDialog:target {
        opacity:1;
        pointer-events: auto;
        overflow:auto;
    }
    .amendRoutesmodalDialog > div {
        width: 600px;
        position: relative;
        margin: 10% auto;
        padding: 5px 20px 13px 20px;
        border-radius: 10px;
        background: #ececec;

    }
    .amendRoutesclose {
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
    .amendRoutesclose:hover {
        background: #00d9ff;
    }
    #amendRoutesTable table tr td input{padding:0 5px;}
    #amendRoutesTable table tr td {padding:5px 10px 5px 0;}
    #amendRoutesTable table  {margin-bottom:10px;}
</style>


<div id="amendRoutesModal" class="amendRoutesmodalDialog">
    <div>	<a href="#close" title="Close" class="amendRoutesclose">X</a>

        <h4>Modify Routes</h4> 

        <table id="newspaper-ro" class='amroutestable table table-bordered table-condensed'>
            <tbody>
                <?php
                $airlinesParams = array('order' => 'name');
                $airportsParams = array('order' => 'city_name');
                $listAirlines = CHtml::listData(Carrier::model()->findAll($airlinesParams), 'id', 'name');
                $listAirports = CHtml::listData(Airport::model()->findAll($airportsParams), 'id', 'airport_code');
                $airBookings = AirBooking::model()->with([
                        'airRoutes' => ['order' => '"airRoutes".departure_ts']
                    ])->findAll([
                    'order' => 't.departure_ts, traveler_id',
                    'condition' => "air_cart_id=$model->id and ab_status_id!=" . \AbStatus::STATUS_CANCELLED . " "]);
                $sectors = [];
                foreach ($airBookings as $booking) {
                    if (isset($sectors[$booking->source->airport_code][$booking->destination->airport_code])) {
                        continue;
                    }
                    $sectors[$booking->source->airport_code][$booking->destination->airport_code] = 'done';
                    ?>

                    <tr  id='<?php echo $booking->id; ?>' value='' >
                        <td  colspan='2' class="heading"><?php echo $booking->source->airport_code . ' - ' . $booking->destination->airport_code; ?> <span class="btn btn-small btn-primary green " style="float:right"  id='btnaddroute' onclick="addRoute(<?php echo $booking->id; ?>)">Add Route</span></td>
                    </tr> 
                    <?php foreach ($booking->airRoutes as $route) { ?>
                        <tr  class='routesam' id='<?php echo $route->id; ?>' value='<?php echo $route->id; ?>' >
                            <td style="margin-left:20px" class="rBoxCheck"><?php echo $route->source->airport_code . ' - ' . $route->destination->airport_code; ?><i style="color:green;float:right" class="fa fa-check fa-lg"></i>  </td><td><span class=""   id='btndeleteroute' onclick="deleteRoute(<?php echo $route->id; ?>)"><i style="color:red" class="fa fa-remove fa-lg"></i></span></td>
                        </tr>  
                    <input type='hidden' value='<?php echo $route->carrier->id; ?>' id='carrierid_<?php echo $route->id; ?>'/>

                    <input type='hidden' value='<?php echo $route->carrier->name; ?>' id='carrier_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->source->airport_code; ?>' id='source_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->destination->airport_code; ?>' id='destination_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->flight_number; ?>' id='flightno_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->departure_ts; ?>' id='depts_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->arrival_ts; ?>' id='arrts_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->source_terminal; ?>' id='rsource_terminal_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->destination_terminal; ?>' id='rdestination_terminal_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->air_booking_id; ?>' id='rair_booking_id_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->fare_basis; ?>' id='rfare_basis_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->booking_class; ?>' id='rbooking_class_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->aircraft; ?>' id='raircraft_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->meal; ?>' id='rmeal_<?php echo $route->id; ?>'/>
                    <input type='hidden' value='<?php echo $route->seat; ?>' id='rseat_<?php echo $route->id; ?>'/>

                    <?php
                }
            }
            ?>
            </tbody>
        </table>

        <div id='amendRoutesTable' style="display:none">
            <form method="POST" id='formRoutes' style=" margin-right:5px;margin-bottom:0px;" action="/airCart/amend">

                <input name='bookingidd' id="bookingidd" value='' type='hidden'/>
                <input name='routeid' id="routeid" value='' type='hidden'/>
                <input name='air_booking_id' id="air_booking_id" value='' type='hidden'/>
                <table class='table table-condensed table-bordered'>
                    <tr class='heading'>
                        <th>Field</th>
                        <th class='original'>Original</th>
                        <th>New value</th>
                    </tr>
                    <tr>
                        <td>Airline</td>
                        <td class='original'><div id='div_carrier_name'></div></td>
                        <td colspan='2'><?php echo TbHtml::dropDownList('carrier_id', '', $listAirlines, ['style' => 'max-width: 150px;', 'name' => 'Amendment[carrier_id]']); ?></td>
                    </tr>
                    <tr>
                        <td>From</td>
                        <td class='original'><div id='div_source_code'></div></td>
                        <td colspan='2'><?php echo TbHtml::dropDownList('source_id', '', $listAirports, ['style' => 'max-width: 150px;', 'name' => 'Amendment[source_id]']); ?></td>
                    </tr>
                    <tr>
                        <td>To</td>
                        <td class='original'><div id='div_destination_code'></div></td>
                        <td colspan='2'><?php echo TbHtml::dropDownList('destination_id', '', $listAirports, ['style' => 'max-width: 150px;', 'name' => 'Amendment[destination_id]']); ?></td>
                    </tr>

                    <tr>
                        <td>Flight No</td>
                        <td class='original'><div id='div_flight_number'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('flight_number', '', ['class' => 'center', 'name' => 'Amendment[flight_number]', 'maxlength' => 13]); ?></td>
                    </tr>
                    <tr>
                        <td>Departure (YYYY-MM-DD hh:mm)</td>
                        <td class='original'><div id='div_departure_ts'></div>
                        </td>
                        <td colspan='2'>
                            <?php //echo TbHtml::textField('departure_ts', '', ['class' => 'center', 'style' => 'max-width: 150px;', 'name' => 'Amendment[departure_ts]']); ?>
                            <?php
                            $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                                'name' => 'departure_ts',
                                // additional javascript options for the date picker plugin
                                'options' => array(
                                    'showSecond' => 'true',
                                    'timeFormat' => 'hh:mm:ss',
                                    'dateFormat' => 'yy-mm-dd',
                                ),
                                'htmlOptions' => array(
                                    'style' => 'width:160px;', 'value' => date('Y-m-d h:m:s'),)
                            ));
                            ?>
                        </td>
                    </tr>
                    <tr>
                        <td>Arrival (YYYY-MM-DD hh:mm)</td>
                        <td class='original'><div id='div_arrival_ts'></div>
                        </td>
                        <td colspan='2'>
                            <?php //echo TbHtml::textField('arrival_ts', '', ['class' => 'center', 'style' => 'max-width: 150px;', 'name' => 'Amendment[arrival_ts]']); ?>
                            <?php
                            $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                                'name' => 'arrival_ts',
                                // additional javascript options for the date picker plugin
                                'options' => array(
                                    'showSecond' => 'true',
                                    'timeFormat' => 'hh:mm:ss',
                                    'dateFormat' => 'yy-mm-dd',
                                ),
                                'htmlOptions' => array(
                                    'style' => 'width:160px;', 'value' => date('Y-m-d h:m:s'),)
                            ));
                            ?>
                        </td>
                    </tr>
                    <tr>
                        <td>Source Terminal</td>
                        <td class='original'><div id='div_source_terminal'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('source_terminal', '', ['class' => 'center capitalize', 'name' => 'Amendment[source_terminal]']); ?></td>
                    </tr>
                    <tr>
                        <td>Destination Terminal</td>
                        <td class='original'><div id='div_destination_terminal'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('destination_terminal', '', ['class' => 'center capitalize', 'name' => 'Amendment[destination_terminal]']); ?></td>
                    </tr>
                    <tr >
                        <td>Fare Basis</td>
                        <td class='original'><div id='div_fare_basis'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('fare_basis', '', ['class' => 'center capitalize', 'name' => 'Amendment[fare_basis]', 'maxlength' => 20, 'style' => 'max-width: 120px;']); ?></td>
                    </tr>

                    <tr >
                        <td>Booking Class</td>
                        <td class='original'><div id='div_booking_class'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('booking_class', '', ['class' => 'center capitalize', 'name' => 'Amendment[booking_class]', 'maxlength' => 20, 'style' => 'max-width: 120px;']); ?></td>
                    </tr>
                    <tr >
                        <td>Aircraft</td>
                        <td class='original'><div id='div_aircraft'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('aircraft', '', ['class' => 'center capitalize', 'name' => 'Amendment[aircraft]', 'style' => 'max-width: 120px;']); ?></td>
                    </tr>
                    <tr >
                        <td>Meal</td>
                        <td class='original'><div id='div_meal'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('meal', '', ['class' => 'center capitalize', 'name' => 'Amendment[meal]', 'style' => 'max-width: 120px;']); ?></td>
                    </tr>
                    <tr >
                        <td>Seat</td>
                        <td class='original'><div id='div_seat'></div></td>
                        <td colspan='2'><?php echo TbHtml::textField('seat', '', ['class' => 'center capitalize', 'name' => 'Amendment[seat]', 'style' => 'max-width: 120px;']); ?></td>
                    </tr>
                </table>
            </form> 
            <button class="btn btn-small btn-primary" type="button" id='routesamend' onclick="amendRoutes(this)">Submit</button>

        </div>
        <h4 id='routesdone' style="display: none">Successfully Done!!</h4>
    </div>
</div>


<script>
    var url = window.location.href;
    var resarray = [];
    var resvalue = 0;
    var bookingsarray = [];
    $('#newspaper-ro .routesam').on('click', function (e) {
//        console.log('inside resam');
//        console.log(this.id);
//        console.log($(this).attr('id'));
        $('#newspaper-ro .routesam').each(function () {
            $(this).removeClass("selected");
        })
        $(this).toggleClass("selected");
//      console.log(amendvalue); 
        var bid = parseInt($(this).attr('id'));
        // console.log(bid);
        //  console.log($('#carrier_'+bid).val());

        $('#div_carrier_name').text($('#carrier_' + bid).val());
        $('#div_source_code').text($('#source_' + bid).val());
        $('#div_destination_code').text($('#destination_' + bid).val());
        $('#div_flight_number').text($('#flightno_' + bid).val());
        $('#div_departure_ts').text($('#depts_' + bid).val());
        $('#div_arrival_ts').text($('#arrts_' + bid).val());
        $('#div_source_terminal').text($('#rsource_terminal_' + bid).val());
        $('#div_destination_terminal').text($('#rdestination_terminal_' + bid).val());
        $('#div_fare_basis').text($('#rfare_basis_' + bid).val());
        $('#div_booking_class').text($('#rbooking_class_' + bid).val());
        $('#div_aircraft').text($('#raircraft_' + bid).val());
        $('#div_meal').text($('#rmeal_' + bid).val());
        $('#div_seat').text($('#rseat_' + bid).val());


        $("#bookingidd").val(bid);
        $("#routeid").val(bid);
        // $('.amrestable').hide();
        $('.original').show();
        $('#amendRoutesTable').show();
        //$('#newspaper-ro').hide();
        $("#flight_number").val($('#flightno_' + bid).val());
        $("#departure_ts").val($('#depts_' + bid).val());
        $("#arrival_ts").val($('#arrts_' + bid).val());
        $("#source_terminal").val($('#rsource_terminal_' + bid).val());
        $("#destination_terminal").val($('#rdestination_terminal_' + bid).val());
        $("#fare_basis").val($('#rfare_basis_' + bid).val());
        $("#booking_class").val($('#rbooking_class_' + bid).val());
        $("#air_booking_id").val($('#rair_booking_id_' + bid).val());
        $("#aircraft").val($('#raircraft_' + bid).val());
        $("#meal").val($('#rmeal_' + bid).val());
        $("#seat").val($('#rseat_' + bid).val());

        $("#carrier_id option").filter(function () {
            return $(this).text() === ('' + $('#carrier_' + bid).val());
        }).prop('selected', true);
        $("#source_id option").filter(function () {
            return $(this).text() === ('' + $('#source_' + bid).val());
        }).prop('selected', true);
        $("#destination_id option").filter(function () {
            return $(this).text() === ('' + $('#destination_' + bid).val());
        }).prop('selected', true);
        e.preventDefault();

    });

    function addRoute(bookingid) {


        $("#bookingidd").val("0");
        $("#routeid").val("0");

        $("#flight_number").val('');
        $("#departure_ts").val('');
        $("#arrival_ts").val('');
        $("#source_terminal").val('');
        $("#destination_terminal").val('');
        $("#fare_basis").val('');
        $("#booking_class").val('');
        $("#aircraft").val('');
        $("#meal").val('');
        $("#seat").val('');
        $('.original').hide();
        $("#air_booking_id").val(bookingid);
        $('#amendRoutesTable').show();

        //e.preventDefault();
    }

    function deleteRoute(routeid) {
        var r = confirm("Are you sure? This will delete the route!");
        if (r == true) {
            $.post('/airCart/amendDeleteRoute/', {'routeid': routeid}, function (data) {
                if (typeof data.result !== 'undefined') {
                    //alert(data.error+' refresing page');
                    $('#amendRoutesTable').hide();
                    $('#routesdone').show();
                    //window.location.href = url;
                    window.location.reload();
                } else {
                    alert('Error Occured: ' + data.error);
                    //window.location.reload(); //relative to domain
                }


            }, 'json')
                    .done(function () {

                    });
        }
        e.preventDefault();
    }

    function amendRoutes(element) {
        $(element).prop('disabled', true);
        $.post('/airCart/amendModifyRoute/', $('#formRoutes').serialize(), function (data) {
            if (typeof data.result !== 'undefined') {
                //alert(data.result+' refresing page');
                $('#amendRoutesTable').hide();
                $('#routesdone').show();
                //window.location.href = url;
                window.location.reload();
            } else {
                alert('Some Error Occured');
                $(element).prop('disabled', false);
                //window.location.reload(); //relative to domain
            }


        }, 'json')
                .done(function () {

                });
    }

</script>
