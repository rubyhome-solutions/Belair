<?php
/* @var $this AirCartController */
/* @var $amendments Amendment[] */
/* @var $cart_id integer */

$this->breadcrumbs = array(
    "Cart № $cart_id" => '/airCart/view/' . $cart_id,
    'Amendments',
);

if ($amendments[0]->airBooking->service_type_id == ServiceType::DOMESTIC_AIR) {
    $airlinesParams = array('order' => 'name', 'condition' => 'is_domestic=1');
    $airportsParams = array('order' => 'city_name', 'condition' => "country_code='IN'");
} else {
    $airlinesParams = array('order' => 'name');
    $airportsParams = array('order' => 'city_name');
}
$listAirlines = CHtml::listData(Carrier::model()->findAll($airlinesParams), 'id', 'name');
$listAirports = CHtml::listData(Airport::model()->findAll($airportsParams), 'id', 'nameCode');
?>
<form onsubmit="serializeForm();
        return false;" method="POST">
          <?php
          echo TbHtml::hiddenField('cart_id', $cart_id);

          foreach ($amendments as $key => $amendment) {
              $airBooking = $amendment->airBooking;
              $airRoute = $amendment->airRoute;
              $isCancel = $amendment->amendment_type_id === \AmendmentType::AMENDMENT_CANCEL;
              $totalDiff = 0;
              echo TbHtml::well("&nbsp;&nbsp;<i class='fa fa-wrench fa-lg'></i>&nbsp;&nbsp;Item № " . ($key + 1) . "<b> {$amendment->amendmentType->name}</b> type of amendment for &nbsp;&nbsp;<i class='fa fa-user fa-lg'></i>&nbsp;&nbsp;" . $airBooking->traveler->combinedInfo, ['class' => 'alert-info well-small']);
              ?>
        <div style="display: none;" id="amendmentError_<?php echo $key; ?>">Dummy</div>
        <table class="table table-condensed table-bordered" style="max-width: 55%">
            <tr class="heading">
                <th>Field</th>
                <th>Original</th>
                <th>New value</th>
                <th>Diff</th>
            </tr>
            <tr>
                <td>Airline</td>
                <td><?php echo $airRoute->carrier->name; ?></td>
                <td colspan="2"><?php echo TbHtml::activeDropDownList($airRoute, "carrier_id", $listAirlines, ['style' => 'max-width: 150px;', 'name' => "Amendment[$amendment->id][AirRoute][carrier_id]", 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>From</td>
                <td><?php echo $airRoute->source->nameCode; ?></td>
                <td colspan="2"><?php echo TbHtml::activeDropDownList($airRoute, "source_id", $listAirports, ['style' => 'max-width: 150px;', 'name' => "Amendment[$amendment->id][AirRoute][source_id]", 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>To</td>
                <td><?php echo $airRoute->destination->nameCode; ?></td>
                <td colspan="2"><?php echo TbHtml::activeDropDownList($airRoute, "destination_id", $listAirports, ['style' => 'max-width: 150px;', 'name' => "Amendment[$amendment->id][AirRoute][destination_id]", 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>Departure terminal</td>
                <td><?php echo $airRoute->source_terminal; ?></td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airRoute, 'source_terminal', ['class' => 'center', 'name' => "Amendment[$amendment->id][AirRoute][source_terminal]", 'maxlength' => 2, 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>Arrival terminal</td>
                <td><?php echo $airRoute->destination_terminal; ?></td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airRoute, 'destination_terminal', ['class' => 'center', 'name' => "Amendment[$amendment->id][AirRoute][destination_terminal]", 'maxlength' => 2, 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>Flight No</td>
                <td><?php echo $airRoute->flight_number; ?></td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airRoute, 'flight_number', ['class' => 'center', 'name' => "Amendment[$amendment->id][AirRoute][flight_number]", 'maxlength' => 13, 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>Departure (YYYY-MM-DD hh:mm)</td>
                <td><?php
                    $airRoute->departure_ts = substr($airRoute->departure_ts, 0, -3);
                    echo $airRoute->departure_ts;
                    ?>
                </td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airRoute, 'departure_ts', ['class' => 'center', 'style' => 'max-width: 150px;', 'name' => "Amendment[$amendment->id][AirRoute][departure_ts]", 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>Arrival (YYYY-MM-DD hh:mm)</td>
                <td><?php
                    $airRoute->arrival_ts = substr($airRoute->arrival_ts, 0, -3);
                    echo $airRoute->arrival_ts;
                    ?>
                </td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airRoute, 'arrival_ts', ['class' => 'center', 'style' => 'max-width: 150px;', 'name' => "Amendment[$amendment->id][AirRoute][arrival_ts]", 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>Air PNR</td>
                <td><?php echo $airBooking->airline_pnr; ?></td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airBooking, 'airline_pnr', ['class' => 'center capitalize', 'name' => "Amendment[$amendment->id][AirBooking][airline_pnr]", 'maxlength' => 6, 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>CRS PNR</td>
                <td><?php echo $airBooking->crs_pnr; ?></td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airBooking, 'crs_pnr', ['class' => 'center capitalize', 'name' => "Amendment[$amendment->id][AirBooking][crs_pnr]", 'maxlength' => 6, 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>E-ticket</td>
                <td><?php echo $airBooking->ticket_number; ?></td>
                <td colspan="2"><?php echo TbHtml::activeTextField($airBooking, 'ticket_number', ['class' => 'center capitalize', 'name' => "Amendment[$amendment->id][AirBooking][ticket_number]", 'maxlength' => 13, 'style' => 'max-width: 120px;', 'disabled' => $isCancel]); ?></td>
            </tr>
            <tr>
                <td>Basic Fare</td>
                <td>
                    <?php
                    echo $airBooking->basic_fare;
                    $diff = 0;
                    if ($isCancel && $airBooking->basic_fare !== 0) {
                        $diff = -$airBooking->basic_fare;
                        $airBooking->basic_fare = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'basic_fare', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][basic_fare]"]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Fuel Surcharge</td>
                <td>
                    <?php
                    echo $airBooking->fuel_surcharge;
                    $diff = 0;
                    if ($isCancel && $airBooking->fuel_surcharge !== 0) {
                        $diff = -$airBooking->fuel_surcharge;
                        $airBooking->fuel_surcharge = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'fuel_surcharge', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][fuel_surcharge]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Congestion Charge</td>
                <td>
                    <?php
                    echo $airBooking->congestion_charge;
                    $diff = 0;
                    if ($isCancel && $airBooking->congestion_charge !== 0) {
                        $diff = -$airBooking->congestion_charge;
                        $airBooking->congestion_charge = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'congestion_charge', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][congestion_charge]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Airport Tax</td>
                <td>
                    <?php
                    echo $airBooking->airport_tax;
                    $diff = 0;
                    if ($isCancel && $airBooking->airport_tax !== 0) {
                        $diff = -$airBooking->airport_tax;
                        $airBooking->airport_tax = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'airport_tax', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][airport_tax]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>UDF Tax</td>
                <td>
                    <?php
                    echo $airBooking->udf_charge;
                    $diff = 0;
                    if ($isCancel && $airBooking->udf_charge !== 0) {
                        $diff = -$airBooking->udf_charge;
                        $airBooking->udf_charge = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'udf_charge', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][udf_charge]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>JN Tax</td>
                <td>
                    <?php
                    echo $airBooking->jn_tax;
                    $diff = 0;
                    if ($isCancel && $airBooking->jn_tax !== 0) {
                        $diff = -$airBooking->jn_tax;
                        $airBooking->jn_tax = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'jn_tax', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][jn_tax]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Meal Extra</td>
                <td>
                    <?php
                    echo $airBooking->meal_charge;
                    $diff = 0;
                    if ($isCancel && $airBooking->meal_charge !== 0) {
                        $diff = -$airBooking->meal_charge;
                        $airBooking->meal_charge = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'meal_charge', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][meal_charge]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Seat Extra</td>
                <td>
                    <?php
                    echo $airBooking->seat_charge;
                    $diff = 0;
                    if ($isCancel && $airBooking->seat_charge !== 0) {
                        $diff = -$airBooking->seat_charge;
                        $airBooking->seat_charge = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'seat_charge', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][seat_charge]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>OB (pass-through fee)</td>
                <td>
                    <?php
                    echo $airBooking->passtrough_fee;
                    $diff = 0;
                    if ($isCancel && $airBooking->passtrough_fee !== 0) {
                        $diff = -$airBooking->passtrough_fee;
                        $airBooking->passtrough_fee = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'passtrough_fee', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][passtrough_fee]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Booking Fee</td>
                <td>
                    <?php
                    echo $airBooking->booking_fee;
                    $diff = 0;
                    if ($isCancel && $airBooking->booking_fee !== 0) {
                        $diff = -$airBooking->booking_fee;
                        $airBooking->booking_fee = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'booking_fee', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][booking_fee]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Service tax</td>
                <td>
                    <?php
                    echo $airBooking->service_tax;
                    $diff = 0;
                    if ($isCancel && $airBooking->service_tax !== 0) {
                        $diff = -$airBooking->service_tax;
                        $airBooking->service_tax = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'service_tax', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][service_tax]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Commision/Dscount(Gross)</td>
                <td>
                    <?php
                    echo -$airBooking->commission_or_discount_gross;
                    $diff = 0;
                    if ($isCancel && $airBooking->commission_or_discount_gross !== 0) {
                        $diff = $airBooking->commission_or_discount_gross;
                        $airBooking->commission_or_discount_gross = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'commission_or_discount_gross', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][commission_or_discount_gross]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Other tax</td>
                <td>
                    <?php
                    echo $airBooking->other_tax;
                    $diff = 0;
                    if ($isCancel && $airBooking->other_tax !== 0) {
                        $diff = -$airBooking->other_tax;
                        $airBooking->other_tax = 0;
                    }
                    $totalDiff += $diff;
                    ?>
                </td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'other_tax', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][other_tax]", 'disabled' => $isCancel]); ?></td>
                <td class='diff'><?php echo $diff; ?></td>
            </tr>
            <tr>
                <td>Total markup</td>
                <td>
                    <?php
                    echo ($airBooking->reseller_markup_base + $airBooking->reseller_markup_fee + $airBooking->reseller_markup_tax);
                    ?>
                </td>
                <td></td>
                <td class='diff'>0</td>
            </tr>
            <tr>
                <td>Supplier Amendment Fee</td>
                <td><?php echo $airBooking->supplier_amendment_fee; ?></td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'supplier_amendment_fee', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][supplier_amendment_fee]"]); ?></td>
                <td class='diff'>0</td>
            </tr>
            <tr>
                <td>Reseller Amendment Fee</td>
                <td><?php echo $airBooking->reseller_amendment_fee; ?></td>
                <td><?php echo TbHtml::activeTextField($airBooking, 'reseller_amendment_fee', ['class' => 'tax', 'name' => "Amendment[$amendment->id][AirBooking][reseller_amendment_fee]"]); ?></td>
                <td class='diff'>0</td>
            </tr>
            <tr>
                <td class="heading" colspan="3" style="text-align: right;vertical-align: middle;">Amount to charge for amendment of item № <?php echo $key + 1; ?>:&nbsp;&nbsp;</td>
                <td style="text-align: right;"><?php echo TbHtml::activeTextField($amendment, 'amount_to_charge', ['class' => 'big', 'readonly' => true, 'name' => "Amendment[$amendment->id][amount_to_charge]", 'value' => $totalDiff]);
                $totalDiff = 0; ?></td>
            </tr>
        </table>
<?php } ?>

    <hr>
    <table class="table table-bordered span6">
        <tr>
            <th colspan="2" class="heading" style="text-align: right;">Total charge for the amendments:&nbsp;&nbsp;</th>
            <td style="width: 120px;"><input type="text" class="input" id="totalCharge" value="0" disabled=true style="max-width: 110px; font-weight: bold; font-size: 1.2em; text-align: right;"></td>
        </tr>
        <tr>
            <th rowspan="2" class="heading">
                <a href="/userInfo/update/<?php echo $amendments[0]->airBooking->airCart->user_id; ?>" class="btn-small btn btn-warning" target="_blank" style="margin-bottom: 5%"><i class="fa fa-plus fa-lg"></i>&nbsp;&nbsp;Add balance</a><br>
                <button onclick="resyncBalance(<?php echo $amendments[0]->airBooking->airCart->user->user_info_id; ?>);
                        $(this).blur();" class="btn-small btn btn-info" type="button"><i class="fa fa-refresh fa-lg"></i>&nbsp;&nbsp;ReSync finances</button>
            </th>
            <th class="heading" style="text-align: right;">Available balance:&nbsp;&nbsp;</th>
            <td style="width: 120px;"><input type="text" class="input" id="availableBalance" value="<?php echo number_format($amendments[0]->airBooking->airCart->user->userInfo->balance); ?>" disabled=true style="font-weight: bold; font-size: 1.2em; text-align: right;max-width: 110px;"></td>
        </tr>
        <tr>
            <th class="heading" style="text-align: right;">Credit Limit:&nbsp;&nbsp;</th>
            <td style="width: 120px;"><input type="text" class="input" id="availableCredit" value="<?php echo number_format($amendments[0]->airBooking->airCart->user->userInfo->credit_limit); ?>" disabled=true style="font-weight: bold; font-size: 1.2em; text-align: right;max-width: 110px;"></td>
        </tr>
        <tr>
            <th colspan="2" class="heading" style="text-align: right;">Net Result:&nbsp;&nbsp;</th>
            <td style="width: 120px;"><input type="text" class="input" id="netResult" value="<?php echo number_format($amendments[0]->airBooking->airCart->user->userInfo->credit_limit + $amendments[0]->airBooking->airCart->user->userInfo->balance); ?>" disabled=true style="font-weight: bold; font-size: 1.2em; text-align: right;max-width: 110px;"></td>
        </tr>
        <tr>
            <td colspan="3" style="text-align: center;">
                <a href="/airCart/view/<?php echo $cart_id; ?>" class="btn btn-large">Cancel</a>
                <button onclick="$(this).blur();
                        return checkNetResult();" style="white-space: nowrap; margin-left: 10%" type="submit" class="btn btn-primary btn-large">Save amendment</button>
            </td>
        </tr>

    </table>
</form>

<style>
    .table th, td.center, tr.center td {
        text-align: center;
        vertical-align: middle;
    }
    td input[type="text"], td select {
        margin-bottom: 0;
        max-width: 80px;
        text-align: right;
    }
    table td input.big {
        font-weight: bold;
        font-size: 1.1em;
        text-align: right;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
        vertical-align: middle;
    }
    .center {
        text-align: center !important;
    }
    table.table tr td input.error {
        border-color: red;
        background-color: #FBC2C4;
    }
    td.diff {
        text-align: right;
    }
</style>

<script>
    $(function () {
        //iterate through each textboxes and add keyup
        $(".tax").each(function () {
            $(this).keyup(function () {
                calculateSum(this);
            });
        });
        

        $('input, select').each(function () {
            $(this).attr('oldvalue', this.value);
        });
        
        // Initial calculation        
        calculateSum(document.getElementsByClassName('tax')[0]);

        // Some inputs shold be capital letters only
        $("input.capitalize").keyup(function () {
            this.value = this.value.toUpperCase();
        });

    });

    function calculateSum(that) {
        var diff = parseInt(that.value, 10) - parseInt(that.parentNode.previousElementSibling.innerHTML, 10);
        str = formatNum(diff);
        that.parentNode.nextElementSibling.innerHTML = str;
        if (str === 'NaN') {
            $(that).addClass('error');
        } else {
            $(that).removeClass('error');
        }
        var sum = 0;
        //iterate through each textboxes and add the values
        $(that).parents('table').find(".diff").each(function () {
            sum += parseInt(this.innerHTML.replace(/,/g, ''), 10);
        });
        $(that).parents('tr').siblings().last().children()[1].firstElementChild.value = formatNum(sum);
        var sum = 0;
        $(document).find(".big").each(function () {
            sum += parseInt(this.value.replace(/,/g, ''), 10);
        });
        $('#totalCharge').val(formatNum(sum));
        $('#netResult').val(formatNum(
                parseInt($('#availableBalance').val().replace(/,/g, ''), 10) +
                parseInt($('#availableCredit').val().replace(/,/g, ''), 10) - sum
                ));
    }

    function formatNum(num) {
        var str = num.toString();
        if (str.length > 3) {
            str = str.replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        return str;
    }

    function serializeForm() {
        var data = "";
        $("input, select").each(function (index, obj) {
            if (($(obj).val() != $(obj).attr("oldvalue") && !$(obj).is(":disabled"))
                    || $(obj).is(":hidden")) {
                data += "&" + $(obj).serialize();
            }
        });
//        return data.substr(1);
//        console.log(data.substr(1));
        if (data.substr(1).search(/&/g) === -1) {
            alert('There are no any changes in this amendment.\nPlease make some changes before saving the amendment!');
        } else {
            $.post(location.href, data.substr(1), function (res) {
                if (typeof res.result !== 'undefined' && res.result === 'success') {
                    //alert('It\'s OK');
                    window.location.href = "/airCart/update/<?php echo $cart_id; ?>";
                } else {    // Process the errors
                    for (key = 0; key < <?php echo count($amendments); ?>; key++) {
                        $('#amendmentError_' + key).hide();
                    }
                    for (key in res.errors) {
                        $('#amendmentError_' + key).html(res.errors[key]).show();
                        location.hash = '#amendmentError_' + key;
                    }
                }
            }, 'json');
        }
    }

    function checkNetResult() {
        if ($('#netResult').val().substr(0, 1) === '-') {
            alert('The net result is negative.\nThe amendment can not be saved like that!\nPlease add balance or credit and try again!');
            return false;
        }
        if ($('#netResult').val().substr(0, 1) === 'N') {
            alert('Only numbers are allowed for the fares and the taxes.\nPlease fix the errors and try again!');
            return false;
        }
        return true;
    }

    function resyncBalance(userInfoId) {
        $.post('/userInfo/getBalance/' + userInfoId, {}, function (data) {
            if (typeof data.balance !== 'undefined' && typeof data.credit !== 'undefined') {
                var availableBalance = parseInt($('#availableBalance').val().replace(/,/g, ''), 10);
                var availableCredit = parseInt($('#availableCredit').val().replace(/,/g, ''), 10);
                if (data.balance == availableBalance && data.credit == availableCredit) {
                    alert('The balance and the credit are the same old.\nNo any changes there!');
                } else {
                    $('#availableBalance').val(formatNum(data.balance));
                    $('#availableCredit').val(formatNum(data.credit));
                    $('#netResult').val(formatNum(data.balance + data.credit -
                            parseInt($('#totalCharge').val().replace(/,/g, ''), 10)
                            ));
                }
            }
        }, 'json');
    }

</script>