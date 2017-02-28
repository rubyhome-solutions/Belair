<?php
/* @var $this AirCartController */
/* @var $model AirCart */
/* @var $airBookings[] AirBooking */
/* @var $form TbActiveForm */
/* @var $travelers Traveler[] */
/* @var $legs integer */
?>

<div class="form">

    <?php
    $travelersCount = count($travelers);
    if (count($airBookings) != ($legs * $travelersCount)) {  // fail safe
        Yii::log("ERROR: Manual cart creation with legs=>$legs , travelers count=>" . $travelersCount . " and count of airBookings=>" . count($airBookings));
        Yii::app()->end();
    }
    $isStaffLogged = Authorization::getIsStaffLogged();
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'air-cart-form',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
        'enableClientValidation' => true,
    ));
    echo TbHtml::hiddenField('legs', $legs);

//    Utils::dbg($airBookings);            
    if ($airBookings[0]->service_type_id == ServiceType::DOMESTIC_AIR) {
        $airlinesParams = array('order' => 'name', 'condition' => 'is_domestic=1');
        $airportsParams = array('order' => 'city_name', 'condition' => "country_code='IN'");
        $airSourcesParams = ['order' => 'name', 'condition' => 'is_active=1 AND type_id IN (:both, :domestic)', 'params' => [
            ':both' => \AirSource::TYPE_BOTH,
            ':domestic' => \AirSource::TYPE_DOMESTIC,
            ]];
    } else {
        $airlinesParams = array('order' => 'name');
        $airportsParams = array('order' => 'city_name');
        $airSourcesParams = ['order' => 'name', 'condition' => 'is_active=1 AND type_id IN (:both, :international)', 'params' => [
            ':both' => \AirSource::TYPE_BOTH,
            ':international' => \AirSource::TYPE_INTERNATIONAL,
            ]];
    }
    $listAirlines = CHtml::listData(Carrier::model()->findAll($airlinesParams), 'id', 'name');
    $listAirports = CHtml::listData(Airport::model()->findAll($airportsParams), 'id', 'nameCode');
    $listAirSources = CHtml::listData(\AirSource::model()->findAll($airSourcesParams), 'id', 'name');

    // Render the travelers 
    $this->renderPartial('_form_travelers', ['travelers' => $travelers]);

//    foreach ($airBookings as $key => $airBooking) {
    for ($key = 0; $key < ($legs * $travelersCount); $key+=$travelersCount) {
        $airBooking = $airBookings[$key];
        echo "<p class='well well-small alert-info'>&nbsp;<i class='fa fa-plane fa-lg'></i> &nbsp;Air cart:&nbsp; {$airBooking->source->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " <i class='fa fa-long-arrow-right fa-lg'></i> {$airBooking->destination->nameCode}  " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . "</p>";
        // Had to multiple this object in the controller
        echo TbHtml::activeDropDownList($airBooking, "[$key]carrier_id", $listAirlines, ['empty' => '-- Leading Airline --', 'style' => 'max-width:160px; margin-right:20px;']);
        echo TbHtml::activeDropDownList($airBooking, "[$key]air_source_id", $listAirSources, ['empty' => '-- Air Source --', 'style' => 'max-width:160px;']);
        ?>
        <table class="table table-bordered table-condensed">
            <tr style="text-align: center;" >
                <th>Traveler</th>
                <th>Booking Class</th>
                <th>Cabin Typ.</th>
                <th>Fare Typ.</th>
                <th>Air PNR</th>
                <th>CRS PNR</th>
                <th>E-ticket number</th>
                <th>Website</th>
            </tr>
            <?php
            for ($i = 0; $i < $travelersCount; $i++) {
//            echo $form->errorSummary($airBookings[$key+$i], '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
                echo TbHtml::activeHiddenField($airBookings[$key + $i], "[" . ($key + $i) . "]booking_type_id", ['value' => $airBookings[$key + $i]->booking_type_id]);
                echo TbHtml::activeHiddenField($airBookings[$key + $i], "[" . ($key + $i) . "]service_type_id", ['value' => $airBookings[$key + $i]->service_type_id]);
                ?>
                <tr>
                    <td><span class="badge badge-info"><?php echo $i + 1; ?></span></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]booking_class", ["maxlength" => 1, 'style' => 'max-width: 14px;text-align: center;', 'class'=>'capitalize']); ?></td>
                    <td><?php echo TbHtml::activeDropDownList($airBookings[$key + $i], "[" . ($key + $i) . "]cabin_type_id", CHtml::listData(CabinType::model()->findAll(), "id", "name")); ?></td>
                    <td><?php echo TbHtml::activeDropDownList($airBookings[$key + $i], "[" . ($key + $i) . "]fare_type_id", CHtml::listData(FareType::model()->findAll(), "id", "name")); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]airline_pnr", array('placeholder' => 'Airline PNR', 'style' => 'max-width:100px;margin-left:0.5%;', 'class'=>'capitalize', 'maxlength'=>6)); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]crs_pnr", array('placeholder' => 'CRS PNR', 'style' => 'max-width:100px;margin-left:0.5%;', 'class'=>'capitalize', 'maxlength'=>6)); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]ticket_number", ['placeholder' => 'E-ticket number', 'style' => 'max-width:130px;margin-left:0.5%;', 'class'=>'capitalize', 'maxlength'=>13]); ?></td>
                    <td><?php echo TbHtml::activeDropDownList($model,'website_id', \Utils::getWebsiteNames()); ?></td>
                </tr>
            <?php } ?>
        </table>
        <table class="table table-bordered table-condensed">
            <tr style="text-align: center;" >
                <th>Traveler</th>
                <th>Base<br>Fare</th>
                <th>YQ<br>Tax</th>
                <th>YR<br>Tax</th>
                <th>IN<br>Tax</th>
                <th>WO<br>Tax</th>
                <th>JN<br>Tax</th>
                <th>OB<br>Tax</th>
                <th>OC<br>Tax</th>
                <th>Seat<br>Chrg</th>
                <th>Meal<br>Chrg</th>
                <th>Baggage<br>Chrg</th>
                <th><i class="fa fa-money fa-3x"></i></th>
            </tr>
            <?php for ($i = 0; $i < $travelersCount; $i++) { ?>
                <tr>
                    <td style="text-align: left;"><span class="badge badge-info"><?php echo $i + 1; ?></span>
                        <?php
                        if ($travelersCount > 1 && $i == 0) { // We have multiple travelers, so lets arrange a copy data feature for the first row only
                            echo "<a class='btn btn-small btn-warning copy'><i class='fa fa-copy'></i>&nbsp;&nbsp;Copy<a>";
                        }
                        ?>
                    </td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]basic_fare", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]fuel_surcharge", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]congestion_charge", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]airport_tax", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]udf_charge", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]jn_tax", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]passtrough_fee", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]oc_charge", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]seat_charge", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]meal_charge", ['class' => 'sum']); ?></td>
                    <td><?php echo TbHtml::activeTextField($airBookings[$key + $i], "[" . ($key + $i) . "]baggage_charge", ['class' => 'sum']); ?></td>
                    <td class="total" style="font-weight: bold; min-width: 55px;"><?php echo number_format($airBookings[$key + $i]->fareAndTaxes); ?></td>
                </tr>
            <?php } ?>
        </table>
        <table id="airRoutesTable_<?php echo $key; ?>" class="table airRoutes table-condensed table-hover">
            <tr>
                <th>Airline</th>
                <th>Flight number</th>
                <th>Airport</th>
                <th>Departure</th>
                <th>Terminal</th>
                <th></th>
                <th>Airport</th>
                <th>Arrival</th>
                <th>Terminal</th>
                <th><button type="button" style="white-space: nowrap;" class="btn btn-small btn-warning" onclick="addSector(<?php echo $key; ?>);
                        $(this).blur();
                        return false;"><i class='fa fa-plus fa-lg'></i>&nbsp;&nbsp;Sector</button></th>
            </tr>
            <?php
            // Had to multiple this object in the controller
            foreach ($airBooking->airRoutes as $key2 => $airRoute) {
                ?>
                <tr <?php echo "AirRoutes=$key2"; ?>>
                    <td><?php echo TbHtml::activeDropDownList($airRoute, "carrier_id", $listAirlines, ['empty' => 'Sector Airline', 'name' => "AirBooking[$key][AirRoutes][$key2][carrier_id]"]); ?></td>
                    <td><?php echo TbHtml::activeTextField($airRoute, 'flight_number', ['placeholder' => 'Flight number', 'name' => "AirBooking[$key][AirRoutes][$key2][flight_number]"]); ?></td>
                    <td><?php echo TbHtml::activeDropDownList($airRoute, 'source_id', $listAirports, ['empty' => 'Select Airport', 'name' => "AirBooking[$key][AirRoutes][$key2][source_id]"]); ?></td>
                    <td><?php
//                        echo TbHtml::activeTextField($airRoute, 'departure_ts', ['placeholder' => 'YYYY-MM-DD HH:m:s', 'name' => "AirBooking[$key][AirRoutes][$key2][departure_ts]"]); 
                        $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                            'model' => $airRoute,
                            'name' => "AirBooking[$key][AirRoutes][$key2][departure_ts]",
                            'attribute' => 'departure_ts',
                            'options' => array(
                                'dateFormat' => 'yy-mm-dd',
                                'hourGrid' => 4,
                                'timeFormat' => 'hh:mm:ss',
                                'changeMonth' => false,
                                'changeYear' => false,
                            ),
                        ));
                        ?></td>
                    <td><?php echo TbHtml::activeTextField($airRoute, 'source_terminal', ['name' => "AirBooking[$key][AirRoutes][$key2][source_terminal]", 'style' => 'max-width:26px;text-align: center;']); ?></td>
                    <td><i class='fa fa-long-arrow-right fa-2x'></i></td>
                    <td><?php echo TbHtml::activeDropDownList($airRoute, 'destination_id', $listAirports, ['empty' => 'Select Airport', 'name' => "AirBooking[$key][AirRoutes][$key2][destination_id]"]); ?></td>
                    <td><?php
//                        echo TbHtml::activeTextField($airRoute, 'arrival_ts', ['placeholder' => 'YYYY-MM-DD HH:m:s', 'name' => "AirBooking[$key][AirRoutes][$key2][arrival_ts]"]);
                        $this->widget('application.extensions.timepicker.EJuiDateTimePicker', array(
                            'model' => $airRoute,
                            'name' => "AirBooking[$key][AirRoutes][$key2][arrival_ts]",
                            'attribute' => 'arrival_ts',
                            'options' => array(
                                'dateFormat' => 'yy-mm-dd',
                                'hourGrid' => 4,
                                'timeFormat' => 'hh:mm:ss',
                                'changeMonth' => false,
                                'changeYear' => false,
                            ),
                        ));
                        ?></td>
                    <td><?php echo TbHtml::activeTextField($airRoute, 'destination_terminal', ['name' => "AirBooking[$key][AirRoutes][$key2][destination_terminal]", 'style' => 'max-width:26px;text-align: center;']); ?></td>
                    <td><?php
                        if ($key2 > 0 && $key2 === count($airBooking->airRoutes) - 1)
                            echo '<button type="button" class="btn btn-small btn-danger" onclick="delSector(' . $key . '); return false;"><i class="fa fa-trash-o fa-lg"></i>&nbsp;&nbsp;Del</button>';
                        ?></td>
                </tr>
                <?php
//            Utils::dbg($airRoute);
            }
            ?>
        </table><br><br>
        <?php
    }

    if ($isStaffLogged) {
        echo "<br><br><hr>";
        echo $form->textareaControlGroup($model, 'note', array('rows' => 8, 'span' => 6));
    }
    ?>

    <div class="form-actions">
        <?php
        echo TbHtml::submitButton($model->isNewRecord ? 'Create Manual Cart' : 'Save', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
            'style' => 'margin-left: 20%;',
//            'id' => 'submitButton'
        ));
        ?>
    </div>

    <?php $this->endWidget(); ?>

</div>
<style>
    .well-small {
        padding: 3px;
        margin-bottom: 5px;
        margin-top: 15px;
    }
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
    .airRoutes td input {
        max-width: 135px;
        text-align: left;
    }
    .airRoutes td select {max-width: 135px;}
    td input {
        max-width: 50px;
        text-align: right;
    }
    td select {max-width: 150px;}
    .row-fluid input, .row-fluid select {
        max-width: 135px;
        margin-left: 5px;
    }
</style>
<script>
                function addSector(tableId) {
                    //        preventDefault();
                    $("#airRoutesTable_" + tableId + " tr:last td:last").html('');
                    newRow = $("#airRoutesTable_" + tableId + " tr:last").clone();
                    newIndex = parseInt($(newRow).attr('AirRoutes'), 10) + 1;
                    $(newRow).attr('AirRoutes', newIndex);
                    $(newRow).find("input,select").each(function() {
                        $(this).attr({
                            'id': function(_, id) {
                                //                    console.log(id);
                                return id.replace(/AirRoutes_\d+/, "AirRoutes_" + newIndex);
                            },
                            'name': function(_, name) {
                                return name.replace(/\[AirRoutes\]\[\d+/, "[AirRoutes][" + newIndex);
                            },
                            'value': null
                        });
                    }).end().appendTo("#airRoutesTable_" + tableId);
                    $("#airRoutesTable_" + tableId + " tr:last td:last").html('<button type="button" class="btn btn-small btn-danger" onclick="delSector(' + tableId + '); return false;"><i class="fa fa-trash-o fa-lg"></i>&nbsp;&nbsp;Del</button>');
                }

                function delSector(tableId) {
                    if ($("#airRoutesTable_" + tableId + " tr:last").index() > 1) {
                        $("#airRoutesTable_" + tableId + " tr:last").remove();
                    }
                    if ($("#airRoutesTable_" + tableId + " tr:last").index() > 1) {
                        $("#airRoutesTable_" + tableId + " tr:last td:last").html('<button type="button" class="btn btn-small btn-danger" onclick="delSector(' + tableId + '); return false;"><i class="fa fa-trash-o fa-lg"></i>&nbsp;&nbsp;Del</button>');
                    }
//                    console.log($("#airRoutesTable_" + tableId + " tr:last").index());
                }

                $(document).ready(function() {
                    //iterate through each textboxes and add keyup
                    $(".sum").each(function() {
                        $(this).keyup(function() {
                            calculateSum(this);
                        });
                    });

                    // Some inputs shold be capital letters only
                    $("input.capitalize").keyup(function() {
                        this.value = this.value.toUpperCase();
                    });

                    $(".copy").click(function() {
                        ourRow = $(this).parents('tr');
                        $(ourRow).children().find('.sum').each(function() {
                            index = $(this).parent().index();
                            value = this.value;
                            $(ourRow).siblings().children().find('.sum').each(function() {
                                if (index === $(this).parent().index()) {
                                    $(this).val(value);
                                }
                            });
                        });
                        // Fix the summaries as well
                        $(ourRow).siblings().children('td.total').each(function() {
                            $(this).text($(ourRow).children('td.total').text());
                        });
                    });
                });


                function calculateSum(that) {
                    var sum = parseInt(that.value, 10);
                    //iterate through each textboxes and add the values
                    $(that.parentNode).siblings().find("input.sum").each(function() {
                        sum += parseInt(this.value, 10);
                    });
                    str = formatNum(sum)
                    that.parentNode.parentNode.lastChild.previousSibling.innerHTML = str;
                    if (str === 'NaN') {
                        $(that).addClass('error');
                    } else {
                        $(that).removeClass('error');
                    }
                }

                function formatNum(num) {
                    var str = num.toString();
                    if (str.length > 3) {
                        str = str.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
                    }
                    return str;
                }
</script>