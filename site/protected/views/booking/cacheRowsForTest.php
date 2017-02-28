<table class="table table-condensed table-bordered table-hover">
    <tr>
        <th>#</th>
        <th>Stops</th>
        <th>Departure</th>
        <th>Origin</th>
        <th>Arrival</th>
        <th>Destination</th>
        <th>Flight</th>
        <th>Passenger</th>
        <th>F.Basis</th>
        <th>Fare</th>
        <th>Base fare</th>
        <th>Taxes</th>
    </tr>
    <?php
    /*
     * @var array $rows 
     */
    $i = 1;
    $travelerCount = 1;
    foreach ($rows as $row) {
        $rc = new \RoutesCache;
        $rc->attributes = $row;
        $segments = $rc->extractSegments();
//        echo \Utils::dbg($segments);        Yii::app()->end();
        $totalFlights = array_sum(array_map('count', $segments));
        $firstRound = true;
        ?>
        <tr>
            <?php
            foreach ($segments as $segment) {
                $legsCount = count($segment);
                if ($firstRound) {
                    ?>
                <tr>
                    <td class="center" rowspan="<?php echo ($travelerCount * $totalFlights); ?>">
                        <?php
                        echo $i;
                        if ($activeCompanyId) {
                            $bookData = json_encode(getBookData($rc), JSON_NUMERIC_CHECK);
                            echo "<br>";
                            echo TbHtml::ajaxButton('Check', '/booking/priceAndAvailabilityCheck', [
                                'type' => 'POST',
                                'data' => [
                                    'data' => $bookData,
                                    'airSourceId' => $airSourceId,
                                    'Traveler' => 'js:function(){return $(\'[name^="Traveler["]\').serialize();}',
                                ],
                                'success' => 'js:function(data){
                                        var alert = \'<div class="alert" style="max-width:600px"><button type="button" class="close" data-dismiss="alert">&times;</button>\';
                                        $("#content").prepend(alert + data + "</div>");
                                    }'
                                    ], [
                                'class' => 'btn-info btn-small',
                                'style' => 'margin-bottom: 5px;margin-right: 5px;',
                            ]);
                            echo "<br>";
                            echo TbHtml::button('Book', [
                                'submit' => '/booking/book',
                                'class' => 'btn-warning btn-small',
                                "target" => "_blank",
                                'params' => ['data' => $bookData]
                            ]);
                            echo "<br>";
                            $this->renderPartial('_fakeBookAjax', ['bookData' => $bookData]);
                        }
                        ?>
                    </td>
                    <?php
                }
                ?>
                <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo ($legsCount - 1); ?></td>
                <?php
                $firstLeg = true;
                foreach ($segment as $leg) {
                    ?>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['departTs']; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['origin'] . (!empty($leg['ts']) ? "<br>Via: {$leg['ts']}" : ""); ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['arriveTs']; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['destination']; ?></td>
                    <td rowspan="<?php echo $travelerCount; ?>"><?php echo "{$leg['carrier']}-{$leg['flightNumber']}" . "<br>Aircraft: {$leg['aircraft']}"; ?></td>
                    <?php
//                $firstPassenger = true;
                    if ($firstLeg && $firstRound) {
                        ?>
                        <td><?php echo $rc->travelerType->name; ?></td>
                        <td><?php echo $rc->fare_basis; ?></td>
                        <td><?php echo $rc->total_fare; ?></td>
                        <td><?php echo $rc->base_fare; ?></td>
                        <td>
                            <?php
                            $str = '';
                            foreach (['tax_yq', 'tax_jn', 'tax_udf', 'tax_psf', 'tax_other', 'total_tax_correction'] as $key) {
                                $str .= "$key: {$rc->$key}<br>";
                            }
                            echo "$rc->total_taxes<br>", TbHtml::tooltip('Show taxes', '#', $str, array(
                                'encode' => false,
                                'class' => 'btn btn-mini',
                                'placement' => TbHtml::TOOLTIP_PLACEMENT_LEFT,
                                'data-html' => true
                            ));
                            $firstRound = false;
                            ?>
                        </td>
                        <?php
                    } elseif ($firstLeg) {
                        echo "<td>{$rc->travelerType->name}</td><td>{$rc->fare_basis}</td><td colspan='3'></td>";
                    } else {
                        echo "<td colspan='5'></td>";
                    }
                    ?>
                </tr>
                <?php
//            $firstPassenger = false;
                $firstLeg = false;
            }
        }
        ?>
    </tr>
    <tr><td colspan = '12'></td></tr>
    <?php
    $i++;
}
?>        
</table>
<?php

/**
 * Compose the data needed for the booking
 * @param \RoutesCache $rc
 * @return array
 */
function getBookData(\RoutesCache $rc) {

    $out = [];
    $out['segments'] = $rc->extractSegments();
//        foreach ($rc->extractSegments() as $segRef => $leg) {
//            foreach ($leg as $flight) {
//                $out['segments'][$segRef][] = [
//                    'origin' => $flight['origin'],
//                    'destination' => $flight['destination'],
//                    'depart' => $flight['depart'],
//                    'flightNumber' => $flight['flightNumber'],
//                    'marketingCompany' => $flight['marketingCompany'],
//                    'bookingClass' => $flight['bookingClass'],
//                    'departTs' => $flight['depart'],
//                    'arriveTs' => $flight['arrive'],
//                ];
//            }
//        }

    $taxes = new \Taxes;
    $arrTaxes = $taxes->prepareCacheRowTaxes($rc);
    unset($arrTaxes['total_fare']);
    unset($arrTaxes['total_taxes']);
//        foreach ($passagers as $passager) {
    $out['pax'][$rc->traveler_type_id] = [
        'totalFare' => $rc->total_fare,
        'type' => \application\components\Galileo\Utils::$paxIdToTypeMap[$rc->traveler_type_id],
        'arrTaxes' => $arrTaxes,
        'fareBasis' => $rc->fare_basis,
    ];
//        }
    $out['cabinTypeId'] = $rc->cabin_type_id;

    return $out;
}
?>
<style>
    pre {font-size: smaller;}
    .table td, .table th {
        text-align: center;
        vertical-align: middle;
    }
</style>
