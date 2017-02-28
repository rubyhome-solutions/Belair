<?php
/* @var $this AirCartController */
/* @var $airRoutes AirRoutes[] */
?>

<table class="table airRoutes table-condensed table-hover table-bordered" style="max-width: 95%;">
    <tr  class="heading">
        <th>Airline</th>
        <th>Flight number</th>
        <th>Aircraft</th>
        <th>Airport</th>
        <th>Departure</th>
        <th>Trm.</th>
        <th></th>
        <th>Airport</th>
        <th>Arrival</th>
        <th>Trm.</th>
    </tr>
    <?php foreach ($airRoutes as $airRoute) { ?>
        <tr>
            <td><?php echo $airRoute->carrier->generateImgTag . "&nbsp;&nbsp;" . $airRoute->carrier->name; ?></td>
            <td class="center">
                <?php
                echo "{$airRoute->carrier->code}-{$airRoute->flight_number}";
                if ($airRoute->ts) {
                    echo '<br><p style="font-weight: bold;font-size: .9em;background-color: #F1D9D5;">Via: ' . $airRoute->ts . '</p>';
                }
                ?>
            </td>
            <td class="center"><?php echo $airRoute->aircraft; ?></td>
            <td class="center">
                <?php
                echo $airRoute->source->nameCode;
                ?>
            </td>
            <td class="center"><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->departure_ts)); ?></td>
            <td class="center"><?php echo $airRoute->source_terminal; ?></td>
            <td class="center"><i class='fa fa-long-arrow-right fa-lg'></i></td>
            <td class="center"><?php echo $airRoute->destination->nameCode; ?></td>
            <td class="center"><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->arrival_ts)); ?></td>
            <td class="center"><?php echo $airRoute->destination_terminal; ?></td>
        </tr>
    <?php } ?>
</table>
