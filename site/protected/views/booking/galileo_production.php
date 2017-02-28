<style>
    pre {font-size: smaller;}
    .table td.center {text-align: center;}
</style>
<div class="form">
    <?php
    /* @var $this BookingController */
    /* @var $model BookingSearchForm */

    set_time_limit(90);
    $start_timer = microtime(true);

    $this->breadcrumbs = array(
        'Search' => array('index'),
        'Galileo production',
    );

    $src = Airport::model()->findByPk($model->source);
    $dst = Airport::model()->findByPk($model->destination);

    $activeCompanyId = Utils::getActiveCompanyId();
    $airSourceId = application\components\Galileo\Utils::DEFAULT_GALILEO_PRODUCTION_ID;
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'amadeus-booking-form',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'enableClientValidation' => true,
    ));
    echo TbHtml::hiddenField('airSourceId', $airSourceId);
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
// Shell we use the cache?
//$_POST['cache'] = true;

    if (!empty($_POST['cache'])) {
        $search = simplexml_load_file('galileo_search_xml_result.xml');
    } else {
        $galileo = new \application\components\Galileo\Galileo($airSourceId);
        $search = $galileo->search($src->airport_code, $dst->airport_code, $model->depart, $model->adults, $model->children, $model->infants, $model->return);
        if (is_string($search)) {   // String here means error message
            die($search);
            \Utils::finalMessage($search);
        }
        $search->saveXML('galileo_search_xml_result.xml');
    }
// Check for errors
    if (isset($search->FareInfo->ErrText->Text)) {
        Utils::finalMessage((string) $search->FareInfo->ErrText->Text);
    }
//echo "AAs: " . count($search->AirAvail) . "<br>";
//echo "AFs in first AA: " . count($search->AirAvail[0]->AvailFlt) . "<br>";
//echo Utils::dbg($search);
// Parse the flights
    $segmentRef = 1;
    foreach ($search->AirAvail as $aa) {
        $flightKey = 1;
        foreach ($aa->AvailFlt as $af) {
            unset($flight);
            $depart = \application\components\Galileo\Utils::formatDate($af->StartDt) . " " . \application\components\Galileo\Utils::formatTime($af->StartTm);
            $arrive = \application\components\Galileo\Utils::formatDate($af->EndDt) . " " . \application\components\Galileo\Utils::formatTime($af->EndTm);
            $flight = [
                'depart' => $depart,
                'arrive' => $arrive,
                'origin' => (string) $af->StartAirp,
                'destination' => (string) $af->EndAirp,
                'flight' => $af->AirV . '-' . $af->FltNum,
                'traveTime' => Utils::convertToHoursMins($af->FltTm),
                'aircraft' => (string) $af->Equip
            ];
            $flights[$segmentRef][$flightKey] = $flight;
//        echo Utils::dbg($flights);
            $flightKey++;
        }
        $segmentRef++;
    }
//echo Utils::dbg($flights);
//Prepare taxes
    foreach ($search->FareInfo as $fi) {
        unset($fares);
        foreach ($fi->GenQuoteDetails as $gqd) {
            unset($fare);
            $fare['total'] = (float) $gqd->TotAmt;
            $fare['base'] = (float) $gqd->BaseFareAmt;
            $fare['taxes'] = $fare['total'] - $fare['base'];
            unset($taxesDetails);
            $tax = new Taxes;
            foreach ($gqd->TaxDataAry->TaxData as $td) {
                $taxesDetails[(string) $td->Country] = (float) $td->Amt;
                if (array_key_exists((string) $td->Country, \application\components\Galileo\Utils::$taxesReformat)) {
                    $tax->arrTaxes[\application\components\Galileo\Utils::$taxesReformat[(string) $td->Country]] += (float) $td->Amt;
                } else {
                    $tax->arrTaxes[Taxes::TAX_OTHER] += (float) $td->Amt;
                }
            }
            $fare['details'] = $taxesDetails;
            $fare['reformatedDetails'] = $tax->arrTaxes;
            $fares[] = $fare;
        }
        $i = 0;
        // Pax types
        foreach ($fi->PsgrTypes as $pt) {
            $fares[$i]['paxType'] = (string) $pt->PICReq;
            $i++;
        }
        // F.Basis
        foreach ($fi->FareBasisCodeSummary->FICAry->FICInfo as $fici) {
            $paxNum = (int) $fici->PsgrDescNum - 1;
            $odNum = (int) $fici->ODNum;
            $fares[$paxNum]['fBasis'][$odNum] = (string) $fici->FIC;
        }

        // Segments & flights
        unset($bics);
        unset($items);
//    foreach ($fi->FlightItemRef as $ficr) {
        foreach ($fi->FlightItemCrossRef as $ficr) {
            $segmentRef = (int) $ficr->ODNum;
            $numLegs = (int) $ficr->ODNumLegs;
            $j = 1;
            $i = 1;
            foreach ($ficr->FltItemAry->FltItem as $fltItem) {
                $items[$segmentRef][$j][$i] = (int) $fltItem->IndexNum;
                $bics[$segmentRef][(int) $fltItem->IndexNum] = (string) $fltItem->BICAry->BICInfo->BIC;
//            $bics[$segmentRef][(int) $fltItem->IndexNum] = (string) $fltItem->BICAry->BICInfo->BIC;
                if ($i === $numLegs) {  // Reset the leg counter
                    $i = 1;
                    $j++;
                } else {    // Next leg
                    $i++;
                }
            }
        }
//    echo Utils::dbg($items);
//    echo Utils::dbg($bics);
        $items2 = \application\components\Galileo\Utils::arrayCombine($items);
        $items3 = \application\components\Galileo\Utils::arrayCombine2($items);
        if ($items2 !== $items3) {
            echo "Error! The arrays are different";
            echo Utils::dbg($items2);
            echo Utils::dbg($items3);
            echo '<hr>';
        }
//    echo Utils::dbg(\application\components\Galileo\Utils::arrayCombine2($items));
        foreach ($items3 as $item) {
//        $segments[] = ['flight' => $item, 'fares' => $fares];
            $bic = [];
            foreach ($item as $segmentRef => $legs) {
                foreach ($legs as $leg) {
                    if (isset($bic[$segmentRef][$leg]))
                        die("Error: $segmentRef - $leg");
                    $bic[$segmentRef][$leg] = $bics[$segmentRef][$leg];
                }
            }
            $segments[] = ['flight' => $item, 'fares' => $fares, 'bics' => $bic];
//        $segments[] = ['flight' => $item, 'fares' => $fares];
        }
//    echo "<br>==============================================<br>";
//    echo Utils::dbg($fares);
    }
//echo Utils::dbg($segments);
//Yii::app()->end();
    ?>
    <p class="well well-small alert-info">&nbsp;<i class="fa fa-search fa-lg"></i>&nbsp;&nbsp;Galileo production search results</p>
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
        $travelerCount = count($segments[0]['fares']);
        $i = 1;
        foreach ($segments as $segment) {
            $firstRound = true;
            $totalFlights = application\components\Galileo\Utils::countSegments($segment['flight']);
            foreach ($segment['flight'] as $segRef => $rounds) {
                $legsCount = count($rounds);
                if ($firstRound) {
                    $bookData = json_encode(getBookData($segment['flight'], $segment['fares'], $segment['bics'], $flights, $model->category), JSON_NUMERIC_CHECK);
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
                                    'params' => ['data' => $bookData]
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
                        $flight = $flights[$segRef][$leg];
                        ?>
                        <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['depart']; ?></td>
                        <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['origin']; ?></td>
                        <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['arrive']; ?></td>
                        <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['destination']; ?></td>
                        <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['flight'] . "<br>Aircraft: {$flight['aircraft']}"; ?></td>
                        <td rowspan="<?php echo $travelerCount; ?>"><?php echo $flight['traveTime']; ?></td>
                        <?php
                        $firstPassenger = true;
                        foreach ($segment['fares'] as $passenger) {
                            if (!$firstPassenger) {
                                echo "<tr>";
                            }
                            if ($firstLeg && $firstRound) {
                                ?>  
                                <td><?php echo $passenger['paxType']; ?></td>
                                <td><?php echo $passenger['fBasis'][$segRef]; ?></td>
                                <td><?php echo $passenger['total']; ?></td>
                                <td><?php echo $passenger['base']; ?></td>
                                <td>
                                    <?php
                                    $str = '';
                                    foreach ($passenger['details'] as $key => $value) {
                                        $str .= "$key: $value<br>";
                                    }
                                    $str .= "----------<br>";
                                    $checkSum = 0;
                                    foreach ($passenger['reformatedDetails'] as $key => $value) {
                                        if ($key !== Taxes::TAX_TOTAL_CORRECTION && $value != 0) {
                                            $str .= "$key: $value<br>";
                                            $checkSum += $value;
                                        }
                                    }
                                    $str .= "Total: " . $passenger['taxes'];
                                    if ($checkSum != $passenger['taxes']) {
                                        $str .= "<br><b>Diff: </b>" . ($checkSum - $passenger['taxes']);
                                    }
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
                                echo "<td>{$passenger['paxType']}</td><td>{$passenger['fBasis'][$segRef]}</td><td colspan='3'></td>";
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
        ?>
    </table>
    <?php
    $this->endWidget();
    print "<pre>\nGalileo production suite results delivered in: " . round((microtime(true) - $start_timer), 2) . " sec. Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . "MB\n</pre>";

    /**
     * Compose the data needed for the booking 
     * @param array $legs
     * @param array $passagers
     * @param array $flights
     * @param int $cabinTypeId
     * @return array
     */
    function getBookData($legs, $passagers, $bics, $flights, $cabinTypeId) {

//    echo Utils::dbg($legs);
//    echo Utils::dbg($passagers);
//    echo Utils::dbg($flights);
//    exit;
        $out = array();
//    unset($legs['total']); // Remove the element with the total
//    foreach ($legs as $legKey => $journey) {
        foreach ($legs as $segRef => $leg) {
            foreach ($leg as $legKey => $flightId) {
                $tmp = explode('-', $flights[$segRef][$flightId]['flight']);
                $tmp2 = explode(' ', $flights[$segRef][$flightId]['depart']);
                $out['segments'][$segRef][] = [
                    'origin' => $flights[$segRef][$flightId]['origin'],
                    'destination' => $flights[$segRef][$flightId]['destination'],
                    'depart' => $tmp2[0],
                    'flightNumber' => $tmp[1],
                    'marketingCompany' => $tmp[0],
                    'bookingClass' => $bics[$segRef][$flightId],
                    'departTs' => $flights[$segRef][$flightId]['depart'],
                    'arriveTs' => $flights[$segRef][$flightId]['arrive'],
                ];
            }
        }
//    }
        foreach ($passagers as $passager) {
            $out['pax'][application\components\Galileo\Utils::$paxTypeIdMap[$passager['paxType']]] = [
                'totalFare' => $passager['total'],
                'type' => $passager['paxType'],
                'arrTaxes' => $passager['reformatedDetails'],
                'fareBasis' => $passager['fBasis'],
            ];
        }
        $out['cabinTypeId'] = $cabinTypeId;

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