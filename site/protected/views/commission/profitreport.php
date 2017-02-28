<?php
$clientSources = \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name');
$airlines = \CHtml::listData(\Carrier::model()->findAll(['order' => 'code']), 'id', 'code');
?>
<form name="report_criterion" method="post" action="/commission/getProfitReport" style="background-color: lightcyan; width: 70%" id="reportsForm">

    <table class="table table-bordered table-condensed">
        <colgroup><col width="150"><col></colgroup>
        <tbody><tr>
                <th>Date Filter</th>
                <td style="width: 307px;">
                    <?php
                    $this->widget('zii.widgets.jui.CJuiDatePicker', [
                        'name' => "dateFrom",
                        'value' => $datefrom,
                        'options' => array(
                            'dateFormat' => 'yy-mm-dd',
                            'changeMonth' => true,
                            'changeYear' => true,
                        ),
                        'htmlOptions' => [
                            'placeholder' => 'From date',
                            'style' => 'max-width:115px;',
                        ]
                    ]);
                    ?>
                </td>
                <td>
                    <?php
                    $this->widget('zii.widgets.jui.CJuiDatePicker', [
                        'name' => "dateTo",
                        'value' => $dateto,
                        'options' => array(
                            'dateFormat' => 'yy-mm-dd',
                            'changeMonth' => true,
                            'changeYear' => true,
                        ),
                        'htmlOptions' => [
                            'placeholder' => 'To date',
                            'style' => 'max-width:115px;',
                        ]
                    ]);
                    ?>

                </td>
            </tr>
            <tr>
                <th>Client Source</th>
                <td>
                    <?php echo TbHtml::dropDownList('clientSource', $client_source_id, $clientSources, ['prompt' => '-- Select the client source --', 'style' => 'width:70%']) ?>
                </td>
                <th>Dom/Int</th>
                <td><select id="way_type" name="way_type">
                        <option value="" >All</option>
                        <option value="1" <?php
                        if ($way_type == \CommisionClientSource::WAYTYPE_DOMESTIC) {
                            echo 'selected=selected';
                        }
                        ?>>Domestic</option>
                        <option value="2" <?php
                        if ($way_type == \CommisionClientSource::WAYTYPE_INTERNATIONAL) {
                            echo 'selected=selected';
                        }
                        ?>>International</option>
                    </select>
                </td>
            </tr>
            <tr>
                <th>Airline</th>
                <td><?php echo TbHtml::dropDownList('airline', $airline_id, $airlines, ['prompt' => '-- Select the airline --', 'style' => 'width:70%']) ?></td>
                <th>Profit/Loss</th>
                <td><select id="profitloss" name="profitloss">
                        <option value="">All</option>
                        <option value="<?php echo \CommissionRule::PROFIT; ?>" <?php
                        if ($profitloss == \CommissionRule::PROFIT) {
                            echo 'selected=selected';
                        }
                        ?>>Profit</option>
                        <option value="<?php echo \CommissionRule::LOSS; ?>" <?php
                        if ($profitloss == \CommissionRule::LOSS) {
                            echo 'selected=selected';
                        }
                        ?>>Loss</option>
                    </select></td>
            </tr>


        </tbody></table>
    <button class="btn btn-info" id="btnViewReports" name="yt0" type="submit">View Report</button>
    <button class="btn btn-info" id="xlsFile" name="xlsFile" type="submit" value="1">Download</button>
</form>
<?php if (count($data) > 0) { ?>
    <h3>Report</h3>
    <table class="table table-condensed table-bordered table-hover" style="width: initial;">
        <tbody><tr>
                <th>Summary</th>
                <th>No. of Cart
                <td id="noc"></td></th>                
                <th>No. of Passenger
                <td id="nop"></td></th>
                <th>Total Value
                <td id="tov"></td></th>                
                <th>Total Profit
                <td id="top"></td></th> 
                <th>Total Effect as %
                <td id="toe"></td></th> 
            </tr>
        </tbody>
    </table><br>
    <table class="table table-condensed table-bordered table-hover" style="width: initial;">
        <tbody><tr>            
                <th>Date From</th>
                <td><?php echo $datefrom; ?></td>
                <th>Date To</th>
                <td><?php echo $dateto; ?></td>
                <?php if (!empty($client_source_id)) { ?>
                    <th>Client Source</th>
                    <td><?php echo \ClientSource::model()->findByPk((int) $client_source_id)->name; ?></td>
                <?php } ?>
                <?php if (!empty($way_type)) { ?>
                    <th>Way Type</th>
                    <td><?php echo \CommisionClientSource::$waytypeMap[$way_type]; ?></td>
                <?php } ?>
                <?php if (!empty($airline_id)) { ?>
                    <th>Airline</th>
                    <td><?php echo \Carrier::model()->findByPk((int) $airline_id)->name; ?></td>
                <?php } ?>
                <?php if (!empty($profitloss)) { ?>
                    <th>Profit/Loss</th>
                    <td><?php echo $profitloss; ?></td>
                <?php } ?>

            </tr>
        </tbody>
    </table>
    <br>
    <table class="table table-condensed table-bordered table-hover" style="width: initial;">
        <tr> 
            <th>S.No</th>
            <th>AirCart Id</th>
            <th>Client Source</th>
            <th>Summary</th>
            <th>Cart Amount</th>
            <th>Total Effect</th>
            <th>Total Effect as %</th>
            <th>Commercial</th>
            <th>Commission</th>
            <th>Client Source Cost</th>
            <th>PG Cost</th>
            <th>GDS/LCC Profit</th>
            <th>Amendment Profit</th>
        </tr>
        <?php
        $i = 1;
        $total = 0;
        $c1total = 0;
        $c2total = 0;
        $c3total = 0;
        $c4total = 0;
        $c5total = 0;
        $c6total = 0;
        $carttotal = 0;
        $no_of_passenger = 0;

        foreach ($data as $cart) {
            $c1 = $cart->getTotalCommercialNetEffect() - $cart->promoDiscount;
            $c2 = $cart->getTotalCommission();
            $c3 = -1 * (double) $cart->getCostOnCS();
            $c4 = -1 * (double) $cart->getCostOnPG() + $cart->convenienceFee;
            $c5 = (double) $cart->getProfitOnGDSLCC();
            $c6 = 0;

            $out = [];
            $cart_passenger = 0;
            foreach ($cart->airBookings as $airBooking) {
                $no_of_passenger++;
                $cart_passenger++;
                foreach ($airBooking->amendments as $amendment) {
                    if ($amendment->amendment_status_id !== AmendmentStatus::STATUS_CANCELLED) {
                        $c6+=$amendment->reseller_amendment_fee;
                    }
                    if ($airBooking->ab_status_id !== \AbStatus::STATUS_CANCELLED) {
                        $c1 -= $amendment->reseller_amendment_fee;
                    }
                }
                if (empty($airBooking->airRoutes)) {
                    continue;
                }

                $key = $airBooking->airRoutes[0]->carrier->code . "-" . $airBooking->airRoutes[0]->flight_number . " " .
                    date('d-M', strtotime($airBooking->departure_ts));
                if (isset($out[$key])) {
                    $out[$key] ++;
                } else {
                    $out[$key] = 1;
                }
            }
            if ($cart->booking_status_id == \BookingStatus::STATUS_CANCELLED) {
                $c1 = 0;
                $c2 = 0;
                $c5 = 0;
            }
            $total_row = $c1 + $c2 + $c3 + $c4 + $c5 + $c6;
            if (!empty($profitloss)) {
                if ($profitloss == 'Profit' && $total_row < 0) {
                    $no_of_passenger -= $cart_passenger;
                    continue;
                } else if ($profitloss == 'Loss' && $total_row > 0) {
                    $no_of_passenger -= $cart_passenger;
                    continue;
                }
            }
            $c1total+=$c1;
            $c2total+=$c2;
            $c3total+=$c3;
            $c4total+=$c4;
            $c5total+=$c5;
            $c6total+=$c6;
            $total+=$total_row;
            $totalp = $cart->totalAmount();
            ?>
            <tr>
                <td><?php echo $i++; ?></td>
                <td><a href="/airCart/view/<?php echo $cart->id; ?>" target="_blank"><?php echo $cart->id; ?></a></td>
                <td><?php echo $cart->clientSource->name; ?></td>
                <td><?php echo str_replace(['=', '&', '+'], [' x', '<br>', ' '], http_build_query($out)); ?></td>
                <td><?php echo $totalp; ?></td>
                <td><?php echo $total_row; ?></td>
                <td><?php
                    $carttotal+=$totalp;
                    if ($totalp == 0)
                        $totalp = 1;     // Fix case when fares are not attached.

                    echo round(100 * ($total_row) / $totalp, 2) . "%";
                    ?>
                </td>
                <td><?php echo $c1; ?></td>
                <td><?php echo $c2; ?></td>
                <td><?php echo $c3; ?></td>
                <td><?php echo $c4; ?></td>
                <td><?php echo $c5; ?></td>
                <td><?php echo $c6; ?></td>
            </tr> 
        <?php } ?>
        <tr>
            <th><?php echo 'Total'; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo $carttotal; ?></th>
            <th><?php echo $total; ?></th>
            <th><?php
                $teperc = '0%';
                if ($carttotal != 0) {
                    $teperc = round(100 * ($total) / $carttotal, 2) . "%";
                }
                echo $teperc;
                ?>
            </th>
            <th><?php echo $c1total; ?></th>
            <th><?php echo $c2total; ?></th>
            <th><?php echo $c3total; ?></th>
            <th><?php echo $c4total; ?></th>
            <th><?php echo $c5total; ?></th>
            <th><?php echo $c6total; ?></th>
        </tr> 
    </table>

    <script>
        $(document).ready(function () {
            $('#noc').text('<?php echo ($i - 1); ?>');
            $('#nop').text('<?php echo $no_of_passenger; ?>');
            $('#tov').text('<?php echo $carttotal; ?>');
            $('#top').text('<?php echo $total; ?>');
            $('#toe').text('<?php echo $teperc; ?>');
        });
    </script>

<?php } ?>
<style>
    select {
        margin-bottom: auto;
        width: auto;
    }
    input[type="text"] {margin-bottom: auto;}
    input[type="checkbox"] {margin: 0}
    th {background-color: lightgoldenrodyellow;}
    .table {margin-bottom: auto;}
    table {border: 1px solid #dddddd;}
    .table td {
        text-align: center;
        vertical-align: middle;
    }
    .table th {
        vertical-align: middle;
        text-align: center;
    }
    .chart {
        border: 1pt solid;
        border-radius: 25px;
        padding: 10px;
        display: none;
    }
    /*    .ui-widget {
            font-family: "Open Sans";
            font-size: .9em;
        }*/
</style>
