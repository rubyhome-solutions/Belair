<h2>Flydubai Test search results</h2>
<?php
/* @var $model BookingSearchForm */
$start_timer = microtime(true);
set_time_limit(100);
function footer($start_timer) {
    print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . (microtime(true) - $start_timer) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";
}

//$content = file_get_contents('e:\sources\My projects\Lancer\Michael - Belair\repo\site\search_xml_result - Copy.xml');
//$arr = json_decode(json_encode(simplexml_load_string($content)), true);
//echo "Count of AirFlt elements: " . count($arr['AirAvail']['AvailFlt']) . "\n";
// Check if the origin and destination are servicable
if (!CityPairs::model()->findByAttributes([
            'source_id' => $model->source,
            'destination_id' => $model->destination,
            'carrier_id'=>application\components\Flydubai\Utils::FLYDUBAI_CARRIER_ID
        ])) {
    Utils::finalMessage("Flydubai do not serve the choosen origin and destination cities");
}

    if(Airport::model()->findByAttributes(['id'=>$model->source,'country_code'=>application\components\Flydubai\Utils::ORIGIN_COUNTRY]))
        $airSourceId = application\components\Flydubai\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID;//DEFAULT_AIRSOURCES_TEST_ID;
    else
        $airSourceId = application\components\Flydubai\Utils::INTERNATIONAL_AIRSOURCES_PRODUCTION_ID;//INTERNATIONAL_AIRSOURCES_PRODUCTION_ID;

$origin = Airport::model()->findByPk($model->source);
$destination = Airport::model()->findByPk($model->destination);
$activeCompanyId = Utils::getActiveCompanyId();
//$airSourceId = application\components\Flydubai\Utils::DEFAULT_AIRSOURCES_TEST_ID;//DEFAULT_AIRSOURCES_TEST_ID;
$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
    'id' => 'Flydubai-booking-form',
    'enableAjaxValidation' => false,
    'layout' => TbHtml::FORM_LAYOUT_INLINE,
    'enableClientValidation' => true,
        ));
echo TbHtml::hiddenField('airSourceId', $airSourceId);
echo TbHtml::hiddenField('fop', 1);
echo TbHtml::hiddenField('Cc', 1);
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
    $this->renderPartial('/airCart/_form_travelers', ['travelers' => $travelers]);
    echo "<p><b>NOTE: </b>Travelers validation is not done yet - mind your inputs!</p>";
}

$travelers = [
    application\components\Flydubai\Utils::TRAVELER_ADULT => $model->adults,
    application\components\Flydubai\Utils::TRAVELER_CHILD => $model->children,
    application\components\Flydubai\Utils::TRAVELER_INFANT => $model->infants,
];

$api = new application\components\Flydubai\production\Flydubai($airSourceId);
//echo Utils::dbg($api);
//$res = $api->getOriginAirports();
//$res = $api->getDestinationAirports('AMD');
//$res = $api->getToken();

//if(!$api->loginTravelAgencyUser()){
//    \Utils::finalMessage('Error with Flydubai. Please check the logs for details!');
//}
//if(!$api->retrieveAgencyCommission()){
//    \Utils::finalMessage('Error with Flydubai. Please check the logs for details!');
//}
//echo "Amount Fee: ".$api->commisionFee;

//$res = $api->search('DEL','DXB','2015-07-28', [application\components\Flydubai\production\Flydubai::TRAVELER_ADULT=>1]);

$test = false;
if ($test) {
    $res = simplexml_load_file('g8_tmp.xml');
} else {
    $res = $api->search($origin->airport_code, $destination->airport_code, $model->depart, $travelers, $model->category, empty($model->return) ? null : $model->return);
    if ($res === false) {   // Error
        Utils::finalMessage('Error with Flydubai. Please check the logs for details!');
    }
 //   $res->asXML(Yii::app()->runtimePath . '/g8_tmp.xml');
    //exit;
//echo Utils::dbgYiiLog($res);
}


//$arr = json_decode(json_encode($res), true);
//echo Utils::dbgYiiLog($arr);
$legs = $res[1];//application\components\Flydubai\production\Flydubai::parseLegs($arr);
//echo Utils::dbgYiiLog($legs);
$segments = $res[0];//application\components\Flydubai\production\Flydubai::parseSegments($arr);
//echo Utils::dbg($segments);
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
        <th>Cabin</th>
        <th>Fare</th>
        <th>Base fare</th>
        <th>Taxes</th>
        <th>Taxes split</th>
    </tr>
    <?php
    $i = 0;
    $checkOnward = true;
    foreach ($segments as $segment) {
 //       Utils::dbgYiiLog($segment);
        // Skip the record if it is not full
        if (!isset($segment['passengers'])) {
            continue;
        }
        $travelerCount = count($segment['passengers']);
        $legsCount = count($segment['legs']);
        $i++;
        $bookData = json_encode(getBookData($segment['legs'], $legs, $segment['passengers'], $model->category));
//        \Utils::dbgYiiLog(json_decode($bookData),true); 
        ?>
        <tr>
            <td rowspan="<?php echo ($travelerCount * $legsCount); ?>">
                <?php
                echo $i;
                if ($activeCompanyId) {
                    echo "<br>";
                  
                    if (($model->way==BookingSearchForm::ONE_WAY) || (strcmp( trim($origin->airport_code), trim($legs[$segment['legs'][0]]['Origin']) )!=0)) {
                        echo TbHtml::button('Book', [
                            'submit' => '/booking/book',
                            'class' => 'btn-warning',
                            "target" => "_blank",
                            'params' => ['data' => $bookData]
                        ]);
                    } else {
                        echo TbHtml::radioButton('onward', ($i === 1), [
                            'id' => "onward_$i",
                            'label' => 'Onward',
                            'value' => $bookData,
                        ]);
                        $checkOnward = false;
                    }
                }
                ?>
            </td>
            <td rowspan="<?php echo ($travelerCount * $legsCount); ?>"><?php echo $segment['Stops']; ?></td>
            <?php
            $firstLeg = true;
            foreach ($segment['legs'] as $legId) {
                ?>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $legs[$legId]['DepartureDate']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $legs[$legId]['Origin']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $legs[$legId]['ArrivalDate']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo $legs[$legId]['Destination']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo trim($legs[$legId]['OperatingCarrier']) . '-' . $legs[$legId]['FlightNum']; ?></td>
                <td rowspan="<?php echo $travelerCount; ?>"><?php echo Utils::convertToHoursMins($legs[$legId]['FlightTime']); ?></td>
                <?php
                $firstPassenger = true;
                foreach ($segment['passengers'] as $pType => $passenger) {
                    if (!$firstPassenger) {
                        echo "<tr>";
                    }
                    $firstPassenger = false;
                    if ($firstLeg) {
                        ?>  
                        <td><?php echo application\components\Flydubai\Utils::$passengerTypes[$pType]; ?></td>
                        <td><?php echo $passenger['taxSummary']['FBCode']; ?></td>
                        <td><?php echo $passenger['taxSummary']['Cabin']; ?></td>
                        <td><?php echo $passenger['taxSummary']['BaseFareAmtInclTax']; ?></td>
                        <td><?php echo $passenger['taxSummary']['BaseFareAmtNoTaxes']; ?></td>
                        <td><?php echo ($passenger['taxSummary']['BaseFareAmtInclTax'] - $passenger['taxSummary']['BaseFareAmtNoTaxes']); ?></td>
                        <td style="text-align: right"><?php
                        if(isset($passenger['taxes'])){
                            foreach ($passenger['taxes'] as $key => $value) {
                                echo "{$key}: {$value}<br>";
                        }}
                            ?></td>
                        <?php
                    } else {
                        echo "<td colspan='7'></td>";
                    }
                    ?>
                </tr>
                <?php
            }
            $firstLeg = false;
        }
        echo "<tr><td colspan='15'></td></tr>";
    }
    ?>
</table>
<?php
$this->endWidget();
footer($start_timer);

function getBookData($segments, $flights, $passengers, $cabinTypeId) {

//    echo Utils::dbg($segments);
 Utils::dbgYiiLog($passengers);
//    echo Utils::dbg($flights);
//    exit;
    $out = [];
//    if (!isset($segments['Segments']['Segment'][0])) {
//        $segments['Segments']['Segment'] = [$segments['Segments']['Segment']];
//    }
    $passager = reset($passengers);
//    \Utils::dbgYiiLog($segments);
    
    foreach ($segments as $segmentId) {
        $out['segments'][1][] = [
            'origin' => $flights[$segmentId]['Origin'],
            'destination' => $flights[$segmentId]['Destination'],
            'depart' => strstr($flights[$segmentId]['DepartureDate'], ' ', true),
            'flightNumber' => trim($flights[$segmentId]['FlightNum']),
            'marketingCompany' => $flights[$segmentId]['OperatingCarrier'],
            'bookingClass' => $passager['taxSummary']['FCCode'],
            'departTs' => $flights[$segmentId]['DepartureDate'],
            'arriveTs' => $flights[$segmentId]['ArrivalDate'],
        ];
        
    }
    foreach ($passengers as $pType => $passager) {
        $taxes=null;
        if(isset($passager['taxes']))
         $taxes=$passager['taxes'];
        
        $out['pax'][application\components\Flydubai\Utils::$passengerG8TypeIdToId[$pType]] = [
            'totalFare' => $passager['taxSummary']['BaseFareAmtInclTax'],
            'type' => application\components\Flydubai\Utils::$passengerG8TypeIdToId[$pType],
            'arrTaxes' => $taxes,
            'fareBasis' => $passager['taxSummary']['FBCode'],
            'bookingClass' => $passager['taxSummary']['FCCode'],
        ];
       
    }
    $out['cabinTypeId'] = $cabinTypeId;

//    echo Utils::dbg($out); exit;
//    echo Utils::dbg($flights);
    return $out;
}

/**
 * To monitor SOAP calls in and out of a unix server: 
 * sudo tcpdump -nn -vv -A -s 0 -i eth0 dst or src host xxx.xxx.xxx.xxx and port 80
 */
?>
<style>
    .table td, .table th {
        text-align: center;
        vertical-align: middle;
    }
    fieldset legend {
        margin-bottom: 0;
        width: initial;
        border-bottom: 0;            
        margin-top: 0;
        text-align: center;
    }

</style>