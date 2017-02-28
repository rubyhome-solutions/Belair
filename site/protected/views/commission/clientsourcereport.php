<?php
$clientSources = \CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name');
$airlines = \CHtml::listData(\Carrier::model()->findAll(['order' => 'code']), 'id', 'code');
?>
<form name="report_criterion" method="post" action="/commission/clientSourceCostReport" style="background-color: lightcyan; width: 70%" id="reportsForm">

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
                <td></td>
            </tr>


        </tbody></table>
    <button class="btn btn-info" id="btnViewReports" name="yt0" type="submit">View Report</button>
    <button class="btn btn-info" id="xlsFile" name="xlsFile" type="submit" value="1">Download</button>
</form>
<?php if (count($data) > 0) { ?>
    <h3>Summary</h3>
    <table class="table table-condensed table-bordered table-hover" style="width: initial;">
        <tbody id="summary_tbody"><tr>
                <th>Client Source
                <th>DOM/INT
                <th>Total Value
                <th>CS Cost
                <th>CS Cost %
            </tr>
        </tbody>
    </table><br>
<!----    <h3>Report</h3>
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
            <th>Id</th>
            <th>Created</th>
            <th>Sector</th>
            <th>Summary</th>
            <th>Client Source</th>
            <th>Client Source Cost</th>
            <th>Dom/Int</th>
            <th>Total Effect</th>
            <th>Cart Amount</th>
        </tr>
        <?php
        $created = 0;
        $sector = 0;
        $carriertype = 0;
        $cartamount = 0;
        $total = 0;
        $c1total = 0;
        $c2total = 0;
        $c3total = 0;
        $c4total = 0;
        $c5total = 0;
        $c6total = 0;
        $carttotal = 0;
        $data_summary = [];
        foreach ($data as $cart) {
            $created = Utils::cutSecondsAndMilliseconds($cart->created);
            $sector = $cart->getSector();
            $carriertype = $cart->isInternational() ? "INT" : "DOM";
            if (!empty($way_type)) {
                if (($way_type == \CommisionClientSource::WAYTYPE_DOMESTIC && $carriertype == 'INT') ||
                    ($way_type == \CommisionClientSource::WAYTYPE_INTERNATIONAL && $carriertype == 'DOM')) {
                    continue;
                }
            }
            $cartamount = $cart->totalAmount();
            $c1 = $cart->getTotalCommercialNetEffect() - $cart->promoDiscount;
            $c2 = $cart->getTotalCommission();
            $c3 = -1 * (double) $cart->getCostOnCS();
            $c4 = -1 * (double) $cart->getCostOnPG() + $cart->convenienceFee;
            $c5 = (double) $cart->getProfitOnGDSLCC();
            $c6 = 0;

            if (empty($data_summary[$cart->clientSource->name][$carriertype]['cart_tot'])) {
                $data_summary[$cart->clientSource->name][$carriertype]['cart_tot'] = $cartamount;
            } else {
                $data_summary[$cart->clientSource->name][$carriertype]['cart_tot'] += $cartamount;
            }

            if (empty($data_summary[$cart->clientSource->name][$carriertype]['cs_cost'])) {
                $data_summary[$cart->clientSource->name][$carriertype]['cs_cost'] = $c3;
            } else {
                $data_summary[$cart->clientSource->name][$carriertype]['cs_cost'] += $c3;
            }

            if ($cart->booking_status_id == \BookingStatus::STATUS_CANCELLED) {
                $c1 = 0;
                $c2 = 0;
                $c5 = 0;
            }

            if (!empty($profitloss)) {
                if ($profitloss == 'Profit' && $total_row < 0) {
                    continue;
                } else if ($profitloss == 'Loss' && $total_row > 0) {
                    continue;
                }
            }

            $out = [];
            foreach ($cart->airBookings as $airBooking) {
                foreach ($airBooking->amendments as $amendment) {
                    if ($amendment->amendment_status_id !== AmendmentStatus::STATUS_CANCELLED) {
                        $c6+=$amendment->reseller_amendment_fee;
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
            $c1 -= $c6;
            $c1total+=$c1;
            $c2total+=$c2;
            $c3total+=$c3;
            $c4total+=$c4;
            $c5total+=$c5;
            $c6total+=$c6;
            $total_row = $c1 + $c2 + $c3 + $c4 + $c5 + $c6;
            $total+=$cartamount;
            ?>
            <tr>
                <td><a href="/airCart/view/<?php echo $cart->id; ?>" target="_blank"><?php echo $cart->id; ?></a></td>
                <td><?php echo $created; ?></td>
                <td><?php echo $sector; ?></td>
                <td><?php echo str_replace(['=', '&', '+'], [' x', '<br>', ' '], http_build_query($out)); ?></td>
                <td><?php echo $cart->clientSource->name; ?></td>
                <td><?php echo $c3; ?></td>
                <td><?php echo $carriertype; ?> </td>
                <td><?php echo $total_row; ?></td>
                <td><?php echo $cartamount; ?></td>
            </tr> 
            <?php
        }
        $html = '';
        foreach ($data_summary as $cs => $summary) {
            foreach ($summary as $dom_int => $info) {
                $res = 0;
                if (!empty($info['cs_cost'])) {
                    $res = round($info['cart_tot'] / ($info['cs_cost'] * 100), 2);
                }
                $html .= '<tr>';
                $html .= '<td>' . $cs . '</td>';
                $html .= '<td>' . $dom_int . '</td>';
                $html .= '<td>' . $info['cart_tot'] . '</td>';
                $html .= '<td>' . $info['cs_cost'] . '</td>';
                $html .= '<td>' . $res . '</td>';
                $html .= '</tr>';
            }
        }
        ?>
        <tr>
            <th><?php echo 'Total'; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo ''; ?></th>
            <th><?php echo $total; ?></th>
    </table> ---->

    <script>
            $(document).ready(function () {
                $('#summary_tbody').append('<?php echo $html; ?>');
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
