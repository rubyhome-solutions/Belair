<style>
    pre {font-size: smaller;}
    .table td.center {text-align: center;}
</style>
<div class="form">
    <?php
    /* @var \BookingController $this */
    /* @var \BookingSearchForm $model */
    /* @var int $scrapperId */

    \set_time_limit(90);
    $start_timer = microtime(true);

    $notFound = [
        'Flight Not Foun',
        'No Flight Found',
    ];

    function footer($start_timer) {
        print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
//    Yii::app()->end();
    }

    $origin = Airport::model()->findByPk($model->source);
    $destination = Airport::model()->findByPk($model->destination);
    $activeCompanyId = Utils::getActiveCompanyId();
    $airSourceId = $scrapperId;
    $scrapper = AirSource::model()->with('backend')->findByPk($scrapperId);
    $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $scrapper->backend->search;
    $this->breadcrumbs = array(
        'Search' => array('index'),
        $scrapper->name,
    );

    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'scrapper-booking-form',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'enableClientValidation' => true,
    ));
    echo TbHtml::hiddenField('airSourceId', $airSourceId);

    $params = array(
        'credentials' => array(
            'username' => $scrapper->username,
            'password' => $scrapper->password,
            'timeout' => 85
        ),
        'air_source_id' => $airSourceId,
        'source' => $origin->airport_code,
        'destination' => $destination->airport_code,
        'depart' => $model->depart,
        'return' => $model->return,
        'adults' => $model->adults,
        'children' => $model->children,
        'infants' => $model->infants
    );
//    $params = str_replace('"', '\"', json_encode($params));
//file_put_contents('indigo_signature.txt', $signature);
//$signature = file_get_contents('indigo_signature.txt');
//echo Utils::dbg($script); 
//Utils::dbgYiiLog(substr(trim($output[0]), 1, 15));
//echo Utils::dbg($status);
//file_put_contents('scrapper_output.json', $output[0]);
    $output = scrapperBooking::search($airSourceId, $params);

    if ($activeCompanyId) {
        // Prepare the travelers structure
        for ($i = 0; $i < $model->adults; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_ADULT;
            $travelers[] = $traveler;
        }
        for ($i = 0; $i < $model->children; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_CHILD;
            $travelers[] = $traveler;
        }
        for ($i = 0; $i < $model->infants; $i++) {
            $traveler = new Traveler;
            $traveler->user_info_id = $activeCompanyId;
            $traveler->traveler_type_id = TravelerType::TRAVELER_INFANT;
            $travelers[] = $traveler;
        }
        ?>
        <p class="well well-small alert-info">&nbsp;<i class="fa fa-credit-card fa-lg"></i>&nbsp;&nbsp;Payment details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(initially this and next forms are hidden)</p>
        <?php
        // Render the CC form
        $cc = new Cc;
        $cc->user_info_id = $activeCompanyId;
        $cc->number = '5499830000000015';
        $cc->code = 'CA';
        $cc->name = 'Orson Scott';
        $cc->exp_date = '1218';
        if (YII_DEBUG) {   // fill the treavelers and cc fake test data
            $travelers[0] = \Traveler::model()->findByPk(3);
//            $travelers[1] = \Traveler::model()->findByPk(4);
//            $travelers[2] = \Traveler::model()->findByPk(5);
//            $travelers[3] = \Traveler::model()->findByPk(79);
//            $travelers[3]->birthdate = '2014-01-20';
        }
        $this->renderPartial('/cc/_form', ['model' => $cc, 'form' => $form]);
        // Render the travelers 
        if (!empty($_POST['cache'])) {  // Dummy travelers in case of cache
            $travelers[0] = \Traveler::model()->findByPk(3);
        }
        $this->renderPartial('/airCart/_form_travelers', ['travelers' => $travelers]);
        echo "<p><b>NOTE: </b>Travelers validation is not done yet - mind your inputs!</p>";
    }

    echo '<p class=\'well well-small alert-info\'>&nbsp;<i class=\'fa fa-search fa-lg\'></i>&nbsp;&nbsp;' . $scrapper->name . ' Results</p>';
    //echo "<h3>$scrapper->name results</h3>";
    //  if ($status != 0 || !isset($output[0]) || in_array(substr(trim($output[0]), 1, 15), $notFound)) {
//    Utils::dbgYiiLog(substr(trim($output[0]), 1, 15));
//        Utils::dbgYiiLog($output[0]);
    if (empty($output[0]) || $output[0] === null) {
        echo "Error: ";
        //  echo "<input id='search_".$id."' value='0' type='hidden'>";
    } else if (!json_decode($output[0])) {
        echo "Error: " . $output[0];
        //  echo "<input id='search_".$id."' value='0' type='hidden'>";
    } else if (in_array(substr(trim($output[0]), 1, 15), $notFound)) {
        echo "<h3>No flights are found</h3>";
        //   echo "<input id='search_".$id."' value='1' type='hidden'>";
    } else if (is_string(json_decode($output[0]))) {
        echo "Error: " . json_decode($output[0]);
        //   echo "<input id='search_".$id."' value='0' type='hidden'>";
    } else if (is_array($error = scrapperBooking::isCorrectFormat($output[0]))) {
        echo "Error: " . $error['error'];
        // echo "<input id='search_".$id."' value='0' type='hidden'>";
    } else if (!isset($output[0])) {
        echo "<h3>No flights are found</h3>";
        //  echo "<input id='search_".$id."' value='1' type='hidden'>";
    } else {    // Normal execution
//        \Utils::dbgYiiLog($output[0]);
        $res = json_decode($output[0], true);
//        \Utils::dbgYiiLog($res);
        $flightList = array();
        if (!empty($res['onward']) && empty($res['return'])) {
            $res = $res['onward'];
        } else if (empty($res['onward']) && !empty($res['return'])) {
            $res = $res['return'];
        }

        #changed condition isset into empty
        if (!empty($res['onward']) && !empty($res['return'])) {

            $onward = $res['onward'];
            $return = $res['return'];
            
            foreach ($onward as $oid => $odata) {
                foreach ($return as $rid => $rdata) {
                    $onwardlegs = $odata['legs'];
                    $onwardfares = $odata['fares'];
                    $returnlegs = $rdata['legs'];
                    $returnfares = $rdata['fares'];
                    $osegment = null;
                    $rsegment = null;
                    $oarrival = null;
                    $rdeparture = null;
                    foreach ($onwardlegs as $olegid => $olegdata) {
                        $tmp = explode('-', $olegdata['flightNumber']);
                        $tmp2 = explode(' ', $olegdata['depart']);
                        $osegment[$olegid] = array(
                            'origin' => $olegdata['source'],
                            'destination' => $olegdata['destination'],
                            'depart' => $tmp2[0],
                            'flightNumber' => $olegdata['flightNumber'],
                            'marketingCompany' => $tmp[0],
                            'bookingClass' => $model->category,
                            'departTs' => $olegdata['depart'],
                            'arriveTs' => $olegdata['arrive'],
                        );
                        $oarrival = $olegdata['arrive'];
                    }

                    $firsttime = true;
                    foreach ($returnlegs as $legid => $legdata) {
                        $tmp = explode('-', $legdata['flightNumber']);
                        $tmp2 = explode(' ', $legdata['depart']);
                        $rsegment[$legid] = array(
                            'origin' => $legdata['source'],
                            'destination' => $legdata['destination'],
                            'depart' => $tmp2[0],
                            'flightNumber' => $legdata['flightNumber'],
                            'marketingCompany' => $tmp[0],
                            'bookingClass' => $model->category,
                            'departTs' => $legdata['depart'],
                            'arriveTs' => $legdata['arrive'],
                        );

                        if ($firsttime == true) {
                            $rdeparture = $legdata['depart'];
                        }
                        $firsttime = false;
                    }
                    //   $osegment['fares']=$onwardfares;
                    //   $rsegment['fares']=$returnfares;
                    $segment[1] = $osegment;
                    $segment[2] = $rsegment;
                    $out = null;


                    if (strtotime($oarrival) < strtotime($rdeparture)) {
                        $out['segments'] = $segment;
//                    $segments[] = $segment;
                        $passengers = $onwardfares;

                        unset($passengers);
                        unset($passengersforprint);
                        for ($j = 0; $j < $model->adults; $j++) {
                            $passengersforprint[] = array_merge(\scrapperBooking::merge_fares($onwardfares['adult'], $returnfares['adult']), ['type' => \TravelerType::TRAVELER_ADULT]);
                            $passengers[] = array_merge($returnfares['adult'], ['type' => \TravelerType::TRAVELER_ADULT]);
                        }
                        for ($j = 0; $j < $model->children; $j++) {
                            $passengersforprint[] = array_merge(\scrapperBooking::merge_fares($onwardfares['child'], $returnfares['child']), ['type' => \TravelerType::TRAVELER_CHILD]);
                            $passengers[] = array_merge($returnfares['child'], ['type' => \TravelerType::TRAVELER_CHILD]);
                        }
                        for ($j = 0; $j < $model->infants; $j++) {
                            $passengersforprint[] = array_merge(\scrapperBooking::merge_fares($onwardfares['infant'], $returnfares['infant']), ['type' => \TravelerType::TRAVELER_INFANT]);
                            $passengers[] = array_merge($returnfares['infant'], ['type' => \TravelerType::TRAVELER_INFANT]);
                        }

                        foreach ($passengersforprint as $passager) {

                            $out['pax'][$passager['type']] = [
                                'totalFare' => $passager['amount'],
                                'type' => \Utils::$paxTypes[$passager['type']],
                                'arrTaxes' => \Taxes::reformatScrapperTaxes($passager['taxesDetails']),
                                'fareBasis' => \Taxes::SCRAPPER_FARE_BASE . $airSourceId,
                                'taxesTotal' => $passager['taxesTotal'],
                                'baseFare' => $passager['baseFare'],
                            ];
                        }
                        $out['cabinTypeId'] = $model->category;
                        $flightList[] = $out;
                    }
                }
            }
        } else {            
            foreach ($res as $oid => $odata) {
                $legs = $odata['legs'];
                $fares = $odata['fares'];

                foreach ($legs as $legid => $legdata) {
                    $tmp = explode('-', $legdata['flightNumber']);
                    $tmp2 = explode(' ', $legdata['depart']);
                    $osegment[$legid] = array(
                        'origin' => $legdata['source'],
                        'destination' => $legdata['destination'],
                        'depart' => $tmp2[0],
                        'flightNumber' => $legdata['flightNumber'],
                        'marketingCompany' => $tmp[0],
                        'bookingClass' => $model->category,
                        'departTs' => $legdata['depart'],
                        'arriveTs' => $legdata['arrive'],
                    );
                }
                $segment[1] = $osegment;
                $passengers = $fares;
                unset($passengers);
                unset($passengersforprint);
                for ($j = 0; $j < $model->adults; $j++) {
                    $passengers[] = array_merge($fares['adult'], ['type' => \TravelerType::TRAVELER_ADULT]);
                    $passengersforprint[] = array_merge($fares['adult'], ['type' => \TravelerType::TRAVELER_ADULT]);
                }
                for ($j = 0; $j < $model->children; $j++) {
                    $passengers[] = array_merge($fares['child'], ['type' => \TravelerType::TRAVELER_CHILD]);
                    $passengersforprint[] = array_merge($fares['child'], ['type' => \TravelerType::TRAVELER_CHILD]);
                }
                for ($j = 0; $j < $model->infants; $j++) {
                    $passengers[] = array_merge($fares['infant'], ['type' => \TravelerType::TRAVELER_INFANT]);
                    $passengersforprint[] = array_merge($fares['infant'], ['type' => \TravelerType::TRAVELER_INFANT]);
                }

                $out = null;
                //     $segment['fares']=$fares;
                $out['segments'] = $segment;
                foreach ($passengers as $passager) {

                    $out['pax'][$passager['type']] = [
                        'totalFare' => $passager['amount'],
                        'type' => \Utils::$paxTypes[$passager['type']],
                        'arrTaxes' => \Taxes::reformatScrapperTaxes($passager['taxesDetails']),
                        'fareBasis' => \Taxes::SCRAPPER_FARE_BASE . $airSourceId,
                        'taxesTotal' => $passager['taxesTotal'],
                        'baseFare' => $passager['baseFare'],
                    ];
                }

                $out['cabinTypeId'] = $model->category;
                $flightList[] = $out;
            } 
        }
        //\Utils::dbgYiiLog($flightList);
        if (count($res) < 1) {
            echo "No Flights met the search criteria<br><br>";
        } else {    // We are good to go
//            file_put_contents('scrapper_output.txt', print_r($res, true));
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

                foreach ($flightList as $segment) {
                    $firstRound = true;
                    $totalFlights = 0;
                    foreach ($segment['segments'] as $segRef => $rounds) {
                        $totalFlights = (int) $totalFlights + count($rounds);
                    }

                    foreach ($segment['segments'] as $segRef => $rounds) {
                        $legsCount = count($rounds);

                        if ($firstRound) {
                            //   $bookData = json_encode(getBookData($segment['flight'], $segment['fares'], $segment['bics'], $flights, $model->category), JSON_NUMERIC_CHECK);
                            ?>
                            <tr>
                                <td class="center" rowspan="<?php echo ($travelerCount * $totalFlights); ?>">
                                    <?php
                                    echo $i;
                                    if ($activeCompanyId) {
                                        echo "<br>";
                                        echo TbHtml::button('Book', [
                                            'submit' => '/booking/book',
                                            'class' => 'btn-warning',
                                            "target" => "_blank",
                                            'params' => ['data' => json_encode($segment)]
                                        ]);
//                            echo "<br><br>";
//                            echo TbHtml::button('Book&pay', [
//                                'submit' => '/booking/amadeusBookProduction',
//                                'class' => 'btn-warning',
//                                "target"=>"_blank",
//                                'params' => ['data' => $bookData, 'action' => 'bookAndPay']]);
                                    }
                                    ?>
                                </td>
                                <?php
                            }
                            ?>
                            <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo ($legsCount - 1); ?></td>
                            <?php
                            $firstLeg = true;
                            foreach ($rounds as $leg) {
                                $flight = $leg;
                                ?>
                                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['departTs']; ?></td>
                                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['origin']; ?></td>
                                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['arriveTs']; ?></td>
                                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['destination']; ?></td>
                                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['flightNumber']; ?></td>
                                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['depart']; ?></td>
                                <?php
                                $firstPassenger = true;
                                // \Utils::dbgYiiLog($passengersforprint);
                                foreach ($passengersforprint as $passenger) {
                                    if (!$firstPassenger) {
                                        echo "<tr>";
                                    }
                                    if ($firstLeg && $firstRound) {
                                        ?>
                                        <td><?php echo \Utils::$paxTypes[$passenger['type']]; ?></td>
                                        <td><?php echo \Taxes::SCRAPPER_FARE_BASE . $scrapperId ?></td>
                                        <td><?php echo $passenger['amount']; ?></td>
                                        <td><?php echo $passenger['baseFare']; ?></td>
                                        <td>
                                            <?php
                                            $taxes = \Taxes::reformatScrapperTaxes($passenger['taxesDetails']);
                                            $str = '';
                                            foreach ($taxes as $key => $value) {
                                                if ($key !== Taxes::TAX_TOTAL_CORRECTION && $value != 0) {
                                                    $str .= "$key: $value<br>";
                                                }
                                            }
                                            $str .= "Total: " . ($passenger['taxesTotal'] - $taxes[Taxes::TAX_TOTAL_CORRECTION]);

                                            echo TbHtml::tooltip('Show taxes', '#', $str, array(
                                                'encode' => false,
                                                'class' => 'btn btn-mini',
                                                'placement' => TbHtml::TOOLTIP_PLACEMENT_LEFT,
                                                'data-html' => true
                                            ));
                                            ?>
                                        </td>
                                        <?php
                                    } elseif ($firstLeg) {
                                        echo "<td>" . \Utils::$paxTypes[$passenger['type']] . "</td><td>" . Taxes::SCRAPPER_FARE_BASE . $airSourceId . "</td><td>".$passenger['amount']."</td><td>".$passenger['baseFare']."</td>";
                                        echo "<td>";
                                            $taxes = \Taxes::reformatScrapperTaxes($passenger['taxesDetails']);
                                            $str = '';
                                            foreach ($taxes as $key => $value) {
                                                if ($key !== Taxes::TAX_TOTAL_CORRECTION && $value != 0) {
                                                    $str .= "$key: $value<br>";
                                                }
                                            }
                                            $str .= "Total: " . ($passenger['taxesTotal'] - $taxes[Taxes::TAX_TOTAL_CORRECTION]);

                                            echo TbHtml::tooltip('Show taxes', '#', $str, array(
                                                'encode' => false,
                                                'class' => 'btn btn-mini',
                                                'placement' => TbHtml::TOOLTIP_PLACEMENT_LEFT,
                                                'data-html' => true
                                            ));
                                        echo "</td>";
                                    } else {
                                        echo "<td colspan='5'></td>";
                                    }
                                    ?>
                                </tr>

                                <?php
                                $firstPassenger = false;
                            }
                            $firstLeg = false;
                        }
                        $firstRound = false;
                    }
                    $i++;
                    ?>
                    </tr>
                    <tr><td colspan='13'></td></tr>
                    <?php
                }
            }
            ?>
        </table>
        <?php
    }
    $this->endWidget();
    footer($start_timer);

    /**
     * Compose the data needed for the booking 
     * @param array $legs
     * @param array $passagers
     * @param array $flights
     * @param int $cabinTypeId
     * @return array
     */
    function getBookData($legs, $passagers, $id, $cabinTypeId) {

//    echo Utils::dbg($legs);
//    echo Utils::dbg($passagers);
//    echo Utils::dbg($flights);
//    exit;
        $out = array();
//    unset($legs['total']); // Remove the element with the total
        $i = 1;
        foreach ($legs as $legKey => $journey) {

            foreach ($legs as $segRef => $leg) {

                $tmp = explode('-', $leg['flightNumber']);
                $tmp2 = explode(' ', $leg['depart']);
                $out['segments'][$i][] = [
                    'origin' => $leg['source'],
                    'destination' => $leg['destination'],
                    'depart' => $tmp2[0],
                    'flightNumber' => $leg['flightNumber'],
                    'marketingCompany' => $tmp[0],
                    'bookingClass' => $cabinTypeId,
                    'departTs' => $leg['depart'],
                    'arriveTs' => $leg['arrive'],
                ];
                $i++;
            }
        }
        $i = 1;
        foreach ($passagers as $passager) {
            $out['pax'][$passager['type']] = [
                'totalFare' => $passager['amount'],
                'type' => \Utils::$paxTypes[$passager['type']],
                'arrTaxes' => \Taxes::reformatScrapperTaxes($passager['taxesDetails']),
                'fareBasis' => \Taxes::SCRAPPER_FARE_BASE . $id,
            ];
        }
        $out['cabinTypeId'] = $cabinTypeId;
//        echo Utils::dbgYiiLog($out);
//    echo Utils::dbg($out);
//    echo Utils::dbg($flights);
        return $out;
    }
    ?>
</div>
<form method="POST">
    <button name="cache" value="1" class="btn btn-primary">Test timings for the same search using the cache</button>
    <input type="hidden" name="BookingSearchForm[source]" value="<?php echo $model['source']; ?>">
    <input type="hidden" name="BookingSearchForm[destination]" value="<?php echo $model['destination']; ?>">
    <input type="hidden" name="BookingSearchForm[depart]" value="<?php echo $model['depart']; ?>">
    <input type="hidden" name="BookingSearchForm[category]" value="<?php echo $model['category']; ?>">
</form>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }   
</style>