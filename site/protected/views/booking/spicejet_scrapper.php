<h3>Spicejet scrapper results</h3>
<?php
set_time_limit(90);     // This scrapper need much more attention
$start_timer = microtime(true);
$defaultScrapperId = 34;

function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    Yii::app()->end();
}

$origin = Airport::model()->findByPk($model->source);
$destination = Airport::model()->findByPk($model->destination);

$scrapper = AirSource::model()->with('backend')->findByPk($defaultScrapperId);
$script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $scrapper->backend->search;
$params = array(
    'credentials' => array(
        'username' => $scrapper->username,
        'password' => $scrapper->password,
        'timeout' => 85
    ),
    'source' => $origin->airport_code,
    'destination' => $destination->airport_code,
    'depart' => $model->depart,
    'return' => $model->return,
    'adults' => $model->adults,
    'children' => $model->children,
    'infants' => $model->infants
);
$params = str_replace('"', '\"', json_encode($params));

//file_put_contents('indigo_signature.txt', $signature);
//$signature = file_get_contents('indigo_signature.txt');
//echo Utils::dbg($script); 
//echo Utils::dbg($params); 

exec("php \"$script\" " . $params, $output, $status);
//echo Utils::dbg($output);
//echo Utils::dbg($status);
//file_put_contents('spicejet_scrapper_output.json', $output[0]);

if ($status != 0 || !isset($output[0])) {
    Utils::dbgYiiLog($output);
} else {    // Normal execution
    if (substr($output[0], 0, 15) == 'No Flight Found') {
        echo $output[0] . PHP_EOL;
    } else {
        $res = json_decode($output[0], true);
//        echo Utils::dbgYiiLog($res);
        if (isset($res['onward']) && isset($res['return'])) {
            $res = array_merge($res['onward'], $res['return']);
        }
        if (count($res) < 1) {
            echo "No Flights met the search criteria<br><br>";
        } else {
            // Prepare the fares. Get the cheaper between corp_fare & promo_fare when both fares are present
//            foreach ($res as $key => $journey) {
//                if (isset($journey['fares']['promo_fare']) && isset($journey['fares']['corp_fare']) &&
//                        $journey['fares']['promo_fare']['adult']['amount'] < $journey['fares']['corp_fare']['adult']['amount']) {
//                    // Use the promo_fare
//                    $res[$key]['fares']['adult'] = $journey['fares']['promo_fare']['adult'];
//                    if (isset($journey['fares']['promo_fare']['child'])) {
//                        $res[$key]['fares']['child'] = $journey['fares']['promo_fare']['child'];
//                    }
//                    if (isset($journey['fares']['promo_fare']['infant'])) {
//                        $res[$key]['fares']['infant'] = $journey['fares']['promo_fare']['infant'];
//                    }
//                } elseif (isset($journey['fares']['corp_fare'])) {
//                    // Use the corp_fare
//                    $res[$key]['fares']['adult'] = $journey['fares']['corp_fare']['adult'];
//                    if (isset($journey['fares']['corp_fare']['child'])) {
//                        $res[$key]['fares']['child'] = $journey['fares']['corp_fare']['child'];
//                    }
//                    if (isset($journey['fares']['corp_fare']['infant'])) {
//                        $res[$key]['fares']['infant'] = $journey['fares']['corp_fare']['infant'];
//                    }
//                } else {    // Use promo_fare
//                    $res[$key]['fares']['adult'] = $journey['fares']['promo_fare']['adult'];
//                    if (isset($journey['fares']['promo_fare']['child'])) {
//                        $res[$key]['fares']['child'] = $journey['fares']['promo_fare']['child'];
//                    }
//                    if (isset($journey['fares']['promo_fare']['infant'])) {
//                        $res[$key]['fares']['infant'] = $journey['fares']['promo_fare']['infant'];
//                    }
//                }
//            }
//            file_put_contents('spicejet_scrapper_output.txt', print_r($res, true));
            ?>
            <table class="table table-condensed table-bordered table-hover">
                <tr>
                    <th>#</th>
                    <th>Stops</th>
                    <th>Departure</th>
                    <th>Origin</th>
                    <th>Arrival</th>
                    <th>Destination</th>
                    <th>Flight</th>
                    <th>Time</th>
                    <th>Passenger</th>
                    <th>F.Basis</th>
                    <th>Fare</th>
                    <th>Base fare</th>
                    <th>Taxes</th>
                </tr>
                <?php
                $i = 1;
                $travelerCount = $model->adults + $model->children + $model->infants;
                foreach ($res as $jorney) {
                    $legsCount = count($jorney['legs']);
                    ?>
                    <tr>
                        <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo $i;
                $i++; ?></td>
                        <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo ($legsCount - 1); ?></td>
                        <?php
                        $firstLeg = true;
                        foreach ($jorney['legs'] as $leg) {
                            ?>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['depart']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['source']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['arrive']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['destination']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo $leg['flightNumber']; ?></td>
                            <td rowspan="<?php echo $travelerCount; ?>"><?php echo Utils::convertSecToHoursMins(strtotime($leg['arrive']) - strtotime($leg['depart'])); ?></td>
                            <?php
                            $first = true;
                            $passengers = $jorney['fares'];
                            unset($passengers);
                            for ($j = 0; $j < $model->adults; $j++) {
                                $passengers[] = array_merge($jorney['fares']['adult'], ['type' => 'Adult']);
                            }
                            for ($j = 0; $j < $model->children; $j++) {
                                $passengers[] = array_merge($jorney['fares']['child'], ['type' => 'Child']);
                            }
                            for ($j = 0; $j < $model->infants; $j++) {
                                $passengers[] = array_merge($jorney['fares']['infant'], ['type' => 'Infant']);
                            }
                            foreach ($passengers as $passenger) {
                                $passenger['amount'] = (float) str_replace(",", '', $passenger['amount']);
                                if ($passenger['baseFare'] == 0) {
                                    $passenger['baseFare'] = $passenger['amount'];
                                }
                                if (!$first) {
                                    echo "<tr>";
                                }
                                $first = false;
                                if ($firstLeg) {
                                    $taxes = \application\components\Spicejet\Utils::reformatScrapperTaxes($passenger['taxesDetails']);
                                    ?>  
                                    <td><?php echo $passenger['type']; ?></td>
                                    <td><?php echo Taxes::SCRAPPER_FARE_BASE . $defaultScrapperId; ?></td>
                                    <td>
                                        <?php
//                                        echo ($passenger['amount'] - $taxes[Taxes::TAX_TOTAL_CORRECTION]); 
                                        echo $passenger['amount'];
                                        ?>
                                    </td>
                                    <td><?php echo $passenger['baseFare']; ?></td>
                                    <td>
                                        <?php
//                                        echo $passenger['taxesDetails'] . "<br>----------------<br>";
                                        foreach ($taxes as $key => $value) {
                                            if ($key !== Taxes::TAX_TOTAL_CORRECTION && $value != 0) {
                                                echo "$key: $value<br>";
                                            }
                                        }
                                        echo "Total: " . ($passenger['taxesTotal'] - $taxes[Taxes::TAX_TOTAL_CORRECTION]);
                                        ?>
                                    </td>
                                    <?php
                                } else {
                                    echo "<td colspan='5'></td>";
                                }
                                ?>
                            </tr>
                            <?php
                        }
                        $firstLeg = false;
                    }
                    echo "<tr><td colspan='13'></td></tr>";
                }
                ?>
            </table>
            <?php
        }
    }
}

footer($start_timer);
?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
</style>