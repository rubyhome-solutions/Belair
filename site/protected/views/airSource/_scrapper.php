<pre>
    <?php
    set_time_limit(900);
    $id = Yii::app()->request->getPost('id');
    $origin = Yii::app()->request->getPost('origin');
    $destination = Yii::app()->request->getPost('destination');
//    $id=37;
//    $origin="MAA";
//    $destination="SIN";
//    \Utils::dbgYiiLog($id);
//    \Utils::dbgYiiLog($origin);
//    \Utils::dbgYiiLog($destination);
    

$notFound = ['Flight Not Foun', 'No Flight Found',];
    $adults = 1; //with changes in passengers count , traveler update is also required
    $childs = 0;
    $infants = 0;
    $travelers = [['traveler_type_id' => 1, 'id' => 3, 'user_info_id' => 585, 'birthdate' => '1969-04-05',]];
    $add_days = 20;
    $date = date('Y-m-d');
    $departdate = date('Y-m-d', strtotime($date) + (24 * 3600 * $add_days));
    $returndate = date('Y-m-d', strtotime($date) + (24 * 3600 * ($add_days + 3)));

    //   $value=$searchArray[0];
    //  $id=$value[0];
// echo date("Y-m-d", strtotime($date));
    //   foreach ($searchArray as $value) {
    $params = array(
        'source' => $origin,
        'destination' => $destination,
        'depart' => date("Y-m-d", strtotime($departdate)),
        'return' => '',
        'adults' => $adults,
        'children' => $childs,
        'infants' => $infants
    );
    //$params = $inputs;
    $scrapper = AirSource::model()->with('backend')->findByPk((int) $id);
    $airSourceId = $id;

    echo '<p class=\'well well-small alert-info\'>&nbsp;<i class=\'fa fa-search fa-lg\'></i>&nbsp;&nbsp;' . $scrapper->name . ' Results</p>';
    $output = scrapperBooking::search($id, $params);
//    \Utils::dbgYiiLog($output);
    
    //   sleep(10);
    if( empty($output[0]) || $output[0] === null){
        echo "Error: ";
        echo "<input id='search_".$id."' value='0' type='hidden'>";
        echo "";
    } 
    else if(!json_decode($output[0])){
        echo "Error: ".$output[0];
        echo "<input id='search_".$id."' value='0' type='hidden'>";
    }else if(in_array(substr(trim($output[0]), 1, 15), $notFound)){
        echo "<h3>No flights are found</h3>";
        echo "<input id='search_".$id."' value='1' type='hidden'>";
    }else if(is_string(json_decode($output[0]))){
        echo "Error: ".json_decode($output[0]);
        echo "<input id='search_".$id."' value='0' type='hidden'>";
    } else if(is_array($error=\scrapperBooking::isCorrectFormat($output[0]))){
        echo "Error: ".$error['error'];
        echo "<input id='search_".$id."' value='0' type='hidden'>";
    } 
    else if (!isset($output[0])) {
        echo "<h3>No flights are found</h3>";
        echo "<input id='search_".$id."' value='1' type='hidden'>";
    } else { // Normal execution
        //        \Utils::dbgYiiLog($output[0]);
        echo "<input id='search_".$id."' value='2' type='hidden'>";
        unset($res);
        unset($flightList);
        unset($segment);
        $res = json_decode($output[0], true);



        $flightList = array();
        if (isset($res['onward']) && !isset($res['return'])) {
            $res = $res['onward'];
        } else
        if (!isset($res['onward']) && isset($res['return'])) {
            $res = $res['return'];
        }

        if (isset($res['onward']) && isset($res['return'])) {
            $onward = $res['onward'];
            $return = $res['return'];

            //  $returnlegs=$return['legs'];
            //  $returnfares=$return['fares'];

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
                            'flightNumber' => $tmp[1],
                            'marketingCompany' => $tmp[0],
                            'bookingClass' => 'S',
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
                            'flightNumber' => $tmp[1],
                            'marketingCompany' => $tmp[0],
                            'bookingClass' => 'S',
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
                    unset($out);
                    $out = null;
                    if (strtotime($oarrival) < strtotime($rdeparture)) {
                        $out['segments'] = $segment;

                        //                    $segments[] = $segment;

                        $passengers = $onwardfares;
                        unset($passengers);
                        unset($passengersforprint);
                        for ($j = 0; $j < $adults; $j++) {
                            $passengersforprint[] = array_merge(scrapperBooking::merge_fares($onwardfares['adult'], $returnfares['adult']), ['type' => TravelerType::TRAVELER_ADULT]);
                            $passengers[] = array_merge($returnfares['adult'], ['type' => TravelerType::TRAVELER_ADULT]);
                        }

                        for ($j = 0; $j < $childs; $j++) {
                            $passengersforprint[] = array_merge(scrapperBooking::merge_fares($onwardfares['child'], $returnfares['child']), ['type' => TravelerType::TRAVELER_CHILD]);
                            $passengers[] = array_merge($returnfares['child'], ['type' => TravelerType::TRAVELER_CHILD]);
                        }

                        for ($j = 0; $j < $infants; $j++) {
                            $passengersforprint[] = array_merge(scrapperBooking::merge_fares($onwardfares['infant'], $returnfares['infant']), ['type' => TravelerType::TRAVELER_INFANT]);
                            $passengers[] = array_merge($returnfares['infant'], ['type' => TravelerType::TRAVELER_INFANT]);
                        }

                        foreach ($passengersforprint as $passager) {
                            $out['pax'][$passager['type']] = ['totalFare' => $passager['amount'], 'type' => Utils::$paxTypes[$passager['type']], 'arrTaxes' => Taxes::reformatScrapperTaxes($passager['taxesDetails']), 'fareBasis' => Taxes::SCRAPPER_FARE_BASE . $airSourceId, 'taxesTotal' => $passager['taxesTotal'], 'baseFare' => $passager['baseFare'],];
                        }

                        $out['cabinTypeId'] = 1;
                        $flightList[] = $out;
                    }
                }
            }
        } else {
            unset($osegment);
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
                        'flightNumber' => $tmp[1],
                        'marketingCompany' => $tmp[0],
                        'bookingClass' => 'S',
                        'departTs' => $legdata['depart'],
                        'arriveTs' => $legdata['arrive'],
                    );
                }

                $segment[1] = $osegment;
                $passengers = $fares;
                unset($passengers);
                unset($passengersforprint);
                for ($j = 0; $j < $adults; $j++) {
                    $passengers[] = array_merge($fares['adult'], ['type' => TravelerType::TRAVELER_ADULT]);
                    $passengersforprint[] = array_merge($fares['adult'], ['type' => TravelerType::TRAVELER_ADULT]);
                }

                for ($j = 0; $j < $childs; $j++) {
                    $passengers[] = array_merge($fares['child'], ['type' => TravelerType::TRAVELER_CHILD]);
                    $passengersforprint[] = array_merge($fares['child'], ['type' => TravelerType::TRAVELER_CHILD]);
                }

                for ($j = 0; $j < $infants; $j++) {
                    $passengers[] = array_merge($fares['infant'], ['type' => TravelerType::TRAVELER_INFANT]);
                    $passengersforprint[] = array_merge($fares['infant'], ['type' => TravelerType::TRAVELER_INFANT]);
                }

                unset($out);
                $out = null;

                //     $segment['fares']=$fares;

                $out['segments'] = $segment;
                foreach ($passengers as $passager) {
                    $out['pax'][$passager['type']] = ['totalFare' => $passager['amount'], 'type' => Utils::$paxTypes[$passager['type']], 'arrTaxes' => Taxes::reformatScrapperTaxes($passager['taxesDetails']), 'fareBasis' => Taxes::SCRAPPER_FARE_BASE . $airSourceId, 'taxesTotal' => $passager['taxesTotal'], 'baseFare' => $passager['baseFare'],];
                }

                $out['cabinTypeId'] = 1;
                $flightList[] = $out;
            }

            //           Utils::dbgYiiLog($flightList);
            //   exit;
        }

        if (count($res) < 1) {
            echo "No Flights met the search criteria<br /><br />";
        } else { // We are good to go
            //            file_put_contents('scrapper_output.txt', print_r($res, true));
            ?>
                                            <table class="table table-condensed table-bordered table-hover">
                                                <tr>
                                                    <th style="width:10%">#</th>
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
                                                    <th style="width:10%">Taxes</th>
                                                </tr>
                    <?php
                $i = 1;
                $checkFlag = true;
                $travelerCount = $adults + $childs + $infants;
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
                                foreach ($segment['pax'] as $paxTypeId => $value) {
                                    if (!isset($segment['pax'][$paxTypeId]['arrTaxes'][Taxes::TAX_TOTAL_CORRECTION])) {
                                        $segment['pax'][$paxTypeId]['arrTaxes'][Taxes::TAX_TOTAL_CORRECTION] = 0;
                                    }

                                    $segment['pax'][$paxTypeId]['totalFare'] = $segment['pax'][$paxTypeId]['totalFare'] + $segment['pax'][$paxTypeId]['arrTaxes'][Taxes::TAX_TOTAL_CORRECTION];
                                }

                                $scraperBook = new scrapperBooking();
                                $scraperBook->airSourceId = $airSourceId;
                                $scraperBook->data = $segment;
                                $scraperBook->travellers = $travelers;

                                if ($checkFlag) {
                                    $checkFlag = false;
                                    if ($scraperBook->checkAvailabilityAndFares()) {
                                        echo "<br /><div style='color:green'>Available</div>";
                                        echo "<input id='avail_".$id."' value='1' type='hidden'>";
                                    } else{
                                        echo "<br /><div style='color:red'>Not Available</div>";
                                        echo "<input id='avail_".$id."' value='0' type='hidden'>";
                                    }
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

                                //                    Utils::dbgYiiLog($passengersforprint);

                                foreach ($passengersforprint as $passenger) {
                                    if (!$firstPassenger) {
                                        echo "<tr>";
                                    }

                                    if ($firstLeg && $firstRound) {
                                        ?>
                                                                                                         <td><?php echo Utils::$paxTypes[$passenger['type']]; ?></td>
                                                                                                          <td><?php echo Taxes::SCRAPPER_FARE_BASE . $airSourceId ?></td>
                                                                                                         <td><?php echo $passenger['amount']; ?></td>
                                                                                                         <td><?php echo $passenger['baseFare']; ?></td>
                                                                                                         <td>
                                        <?php
                                        $taxes = Taxes::reformatScrapperTaxes($passenger['taxesDetails']);
                                        $str = '';
                                        foreach ($taxes as $key => $value) {
                                            if ($key !== Taxes::TAX_TOTAL_CORRECTION && $value != 0) {
                                                $str.= "$key: $value<br />";
                                            }
                                        }

                                        $str.= "Total: " . ($passenger['taxesTotal'] - $taxes[Taxes::TAX_TOTAL_CORRECTION]);
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
                                            echo "<td>" . Utils::$paxTypes[$passenger['type']] . "</td><td>" . Taxes::SCRAPPER_FARE_BASE . $airSourceId . "</td><td colspan='3'></td>";
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
//            }
        ?>
</pre>