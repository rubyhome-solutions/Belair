<?php
/* @var $this \BookingController */
/* @var $search \Searches */

$rows = \RoutesCache::model()->with(['airSource', 'carrier'])->findAllByAttributes([
    'origin_id' => \Airport::getIdFromCode($search->origin),
    'destination_id' => \Airport::getIdFromCode($search->destination),
    'departure_date' => $search->date_depart,
    'return_date' => $search->date_return,
    'cabin_type_id' => $search->category,
        ], [
    'order' => 't.total_fare',
    'condition' => '(departure_date >\'today\' OR (departure_date=\'today\' AND departure_time>now()::time + interval \'45 minutes\')) AND traveler_type_id in ' . $search->buildTravelersInString()
        ]);
/* @var $rows \RoutesCache[] */
$i = 1;
// <a href="javascript:void(0);" rel="tooltip" data-toggle="tooltip" data-placement="top" title="" data-original-title="Old cache value">
?>
<legend style="text-align: center">Here comes the dynamic cache content</legend>

<table id="cacheTableNew" class="table table-hover table-condensed" style="max-width: 95%;display: none;">
    <tr><th colspan="10">Newly arrived results</th></tr>    
    <tr class="up-to-date">
        <th>№</th>
        <th>Air Source</th>
        <th>Airline</th>
        <th>Ports</th>
        <th>Dates</th>
        <th>Price</th>
        <th>Stops</th>
        <th>Details</th>
        <th>PAX</th>
        <th>Status</th>
    </tr>
</table>

<table id="cacheTable" class="table table-hover table-condensed" style="max-width: 95%">
    <tr class="up-to-date"><th colspan="10">Existing cache data</th></tr>    
    <tr class="up-to-date">
        <th>№</th>
        <th>Air Source</th>
        <th>Airline</th>
        <th>Ports</th>
        <th>Dates</th>
        <th>Price</th>
        <th>Stops</th>
        <th>Details</th>
        <th>PAX</th>
        <th>Status</th>
    </tr>
    <?php foreach ($rows as $row) { ?>
        <tr id="RC<?php echo $row->id; ?>" class="as<?php echo $row->air_source_id; ?>">
            <td><?php
                echo $i;
                $i++;
                ?></td>
            <td><?php echo $row->airSource->name; ?></td>
            <td><?php echo $row->carrier->generateImgTag . '&nbsp;' . $row->carrier->name; ?></td>
            <td>
                <?php
                echo "{$row->origin->airport_code}→{$row->destination->airport_code}";
                $tses = $row->extractJsonLegElement('ts');
                if (!empty($tses)) {
                    echo "<br>(via " . implode(', ', $tses) . ")";
                }
                ?>
            </td>
            <td><?php echo "D: $row->departure_date " . \Utils::cutSeconds($row->departure_time) . "<br>A: {$row->arrival_date} " . \Utils::cutSeconds($row->arrival_time); ?></td>
            <td><?php echo TbHtml::tooltip($row->total_fare, "javascript:void(0);", $row->printPriceTable(), ["data-html" => "true", "encode" => false, "data-placement" => "top"]); ?></td>
            <td><?php echo $row->stops; ?></td>
            <td><?php echo TbHtml::tooltip("Details", "javascript:void(0);", $row->printJsonHtml(), ["data-html" => "true", "encode" => false, "data-placement" => "left"]); ?></td>
            <td><?php echo \TravelerType::$typeToStr[$row->traveler_type_id]; ?></td>
            <td class="image"><img src="/img/icon-32-newspaper.png"></td>
        </tr>
<?php } ?>
</table>

