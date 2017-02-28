<h3>DeepLink test page</h3>
<script>
    function output(inp) {
//        document.body.appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(JSON.stringify(inp, undefined, 4));
        return '<pre style="display:none">' + syntaxHighlight(JSON.stringify(inp, undefined, 4)) + '</pre>';
    }
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
</script>
<?php
/* @var \BookingController $this */
/* @var \BookingSearchForm $model */
/* @var integer $clientSourceId  */
defined('DEEPLINK_API_URL') or define('DEEPLINK_API_URL', 'https://cheapticket.in');

$execTime = ini_get('max_execution_time');
if ($execTime <= 50) {    // Increase the execution time to min 50 sec.
    set_time_limit(50);
}
$start_timer = microtime(true);

//echo \Utils::dbg($model->attributes);
$request = new \application\components\client_sources\DeepLink\FlightSearchRequest;
$clientSource = \ClientSource::model()->findByPk($clientSourceId);
$request->credentials->officeid = $clientSource->officeid;
$request->credentials->username = $clientSource->username;
$request->credentials->password = $clientSource->password;
$request->origin = \Airport::getAirportCodeFromId($model->source);
$request->destination = \Airport::getAirportCodeFromId($model->destination);
$request->onwarddate = $model->depart;
$request->returndate = $model->return;
$request->numadults = (int) $model->adults;
$request->numchildren = (int) $model->children;
$request->numinfants = (int) $model->infants;
$request->prefclass = \application\components\client_sources\DeepLink\FlightSearchRequest::$categoryIdToCode[$model->category];
$request->prefcarrier = $model->preferred_airline ? : 'All';
$request->numresults = 100;
unset($request->validationErrors);
//echo \Utils::dbg($request);

if (YII_DEBUG) {
    $endPoint = defined('DEEPLINK_LOCAL_URL') ? DEEPLINK_LOCAL_URL : \Yii::app()->request->hostInfo;
} else {
    $endPoint = DEEPLINK_API_URL;
}
$endPoint .= '/api3d/search';
$jRequest = json_encode($request);
?>
<button onclick="$(this.nextElementSibling.nextElementSibling).toggle();
        $(this).blur();" style="margin-bottom: 10px;" class="btn btn-info" type="button"><i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;&nbsp;Body of the request</button>
<script>document.write(output(<?php echo str_replace($request->credentials->password, '************', $jRequest); ?>));</script>
<br>
<?php
session_write_close();
$timer2 = microtime(true);
$result = \Utils::curl($endPoint, $jRequest);
?>
<script>
    console.log("API response time: <?php echo round(microtime(true) - $timer2, 3); ?> sec.");
</script>
<?php
if (!empty($result['error'])) {
    \Utils::finalMessage($result['error']);
}
$result['result'] = str_replace($request->credentials->password, '************', $result['result']);
?>
<button onclick="$(this.nextElementSibling.nextElementSibling).toggle();
        $(this).blur();" style="margin-bottom: 10px;" class="btn btn-info" type="button"><i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;&nbsp;Response JSON</button>
<script>document.write(output(<?php echo $result['result']; ?>));</script>
<br>
<?php
$response = json_decode($result['result']);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo \Utils::dbg(json_last_error_msg());
    echo \Utils::dbg($result['result']);
    \Yii::app()->end();
}
/* @var $response  \application\components\client_sources\DeepLink\FlightSearchResponse */
if (isset($response->error)) {
    echo \Utils::dbg($response->error);
    Yii::app()->end();
}
if (empty($response->flightjourneys)) {
    echo \Utils::dbg($response);
//    Yii::app()->end();
}
?>
<table class="table table-condensed table-bordered table-hover">
    <tr>
        <th>#</th>
        <th>Origin</th>
        <th>Departure</th>
        <th>Destination</th>
        <th>Arrival</th>
        <th>Flight</th>
        <th>Paxes & fares matrix</th>
    </tr>
    <?php
    $i = 1;
    foreach ($response->flightjourneys as $journey) {
        ?>
        <tr>
            <td rowspan="<?php
            $segCount = 0;
            foreach ($journey->flightlegs as $trip) {
                $segCount += count($trip);
            }
            echo $segCount;
            ?>">
                    <?php
                    echo $i;
                    $i++;
                    $showPax = true;
                    ?>
                <br><a href="<?php echo $journey->flightdeeplinkurl; ?>" class="btn btn-primary btn-small" target="_blank">DeepLink</a>
            </td>
            <?php
            foreach ($journey->flightlegs as $trip) {
                foreach ($trip as $segment) {
                    /* @var $segment application\components\client_sources\DeepLink\FlightLeg */
                    ?>
                    <td><?php echo $segment->origin; ?></td>
                    <td><?php echo $segment->depdate . ' ' . $segment->deptime; ?></td>
                    <td><?php echo $segment->destination; ?></td>
                    <td><?php echo $segment->arrdate . ' ' . $segment->arrtime; ?></td>
                    <td><?php echo $segment->carrier . '-' . $segment->flightnumber; ?></td>
                    <?php if ($showPax) { ?>
                        <td rowspan = "<?php echo $segCount; ?>">
                            <table class="table table-condensed table-bordered" style="background-color: aliceblue;">
                                <tr>
                                    <th>Type</th>
                                    <th>Base</th>
                                    <th>Taxes</th>
                                    <th>Total</th>
                                </tr>
                                <tr>
                                    <td>Adult</td>
                                    <td><?php echo $journey->flightfare->adultbasefare; ?></td>
                                    <td><?php echo $journey->flightfare->adulttax; ?></td>
                                    <td><?php echo $journey->flightfare->adultbasefare + $journey->flightfare->adulttax; ?></td>
                                </tr>
                                <tr>
                                    <td>Child</td>
                                    <td><?php echo $journey->flightfare->childbasefare; ?></td>
                                    <td><?php echo $journey->flightfare->childtax; ?></td>
                                    <td><?php echo $journey->flightfare->childbasefare + $journey->flightfare->childtax; ?></td>
                                </tr>
                                <tr>
                                    <td>Infant</td>
                                    <td><?php echo $journey->flightfare->infantbasefare; ?></td>
                                    <td><?php echo $journey->flightfare->infanttax; ?></td>
                                    <td><?php echo $journey->flightfare->infantbasefare + $journey->flightfare->infanttax; ?></td>
                                </tr>
                                <tr>
                                    <th>Sum</th>
                                    <th colspan="3" style="text-align: right"><?php echo $journey->flightfare->totalnet; ?></th>
                                </tr>
                            </table>
                            <?php $showPax = false; ?>
                        </td>
                    <?php } ?>
                </tr>
                <?php
            }
        }
        ?>
    </tr>

    <?php
}
?>
</table>
<?php
echo "<hr>Timestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . ", Time used: " . round(microtime(true) - $start_timer, 3) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB<hr>";
?>
<style>
    .table th, .table td {
        text-align: center;
        vertical-align: middle;
    }
    pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; font-weight: bold;}
    .string { color: green; }
    .number { color: blue; }
    .boolean { color: darkorange; }
    .null { color: red; }
    .key { color: black; }
</style>