<?php
/* @var $this AirCartController */
/* @var $model AirCart */

$relatedBookings = $model->getRelatedBookings();
echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Related bookings <span class="badge badge-warning badge-top">' . count($relatedBookings) . '</span>'
        , [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'size' => TbHtml::BUTTON_SIZE_SMALL,
    'onclick' => 'js:$("#divRelatedBookings").toggle(); $(this).blur();',
    'style' => 'margin-bottom: 10px;',
    'class' => 'noprint'
]);
?>
<div id="divRelatedBookings" style="margin-left: 0px; display: none;" class="noprint">
    <table class="table table-condensed table-hover table-bordered">
        <tr>
            <th>Date</th>
            <th>Cart</th>
            <th>Pax Name(s)</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Sector</th>
            <th>Booking Status</th>
            <th>Payment Status</th>
            <th>Source</th>
            <th>Tran.</th>
            <th>Fraud</th>
            <th>CC</th>
            <th>3DS</th>
            <th>Name on CC</th>
            <th>IP</th>
        </tr>
        <?php
        foreach ($relatedBookings as $airCart) {
            $pglCount = count($airCart->payGateLogs) ? : 0;
            ?>
            <tr>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo \Utils::cutSecondsAndMilliseconds($airCart->created); ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo CHtml::link($airCart->id, "/airCart/$airCart->id", ['target' => '_blank']); ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo $airCart->getPaxNames(); ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo $airCart->user->userInfo->email; ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo $airCart->user->userInfo->mobile; ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo $airCart->getSector(); ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo $airCart->bookingStatus->badgeFormat(); ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo $airCart->paymentStatus->name; ?></td>
                <td rowspan="<?php echo $pglCount; ?>"><?php echo $airCart->clientSource->name; ?></td>
                <?php foreach ($airCart->payGateLogs as $k => $pg) {
                    ?>
                    <td><?php echo CHtml::link($pg->id . ' ' . $pg->pg->name, "/payGate/view/$pg->id", ['target' => '_blank']); ?></td>
                    <td><?php echo empty($pg->fraud) ? "<span class=\"badge badge-success\">No</span>" : "<span class=\"badge badge-important\">Yes</span>"; ?></td>
                    <?php if (!empty($pg->cc_id)) { ?>
                        <td>
                            <?php
                            echo TbHtml::popover($pg->cc->mask, 'BinInfo', $pg->cc->bin->printHtml(), ['style' => ($pg->cc->verification_status ? 'font-weight:bold;color:green' : '')]) .
                            "<br>Name: {$pg->cc->name}<br>{$pg->cc->type->name}, {$pg->cc->bin->country_name}, {$pg->cc->bin->bank}";
                            ?>
                        </td>
                        <td><?php echo $pg->format3dStatus(); ?></td>
                        <td><?php echo $pg->cc->name; ?></td>
                    <?php } else { ?>
                        <td></td>
                        <td></td>
                        <td></td>
                    <?php } ?>
                    <td><?php echo TbHtml::popover($pg->user_ip, 'GeoIP', '<pre>' . print_r(json_decode($pg->geoip), true) . '</pre>') . '<br>' . $pg->formatGeoIpInfo(); ?></td>
                    <?php
                    if ($k !== $pglCount - 1) {
                        echo '<tr>';
                    }
                }

                // Fill with empty td elements
                if ($pglCount === 0) {
                    ?>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                <?php } ?>
            </tr>
        <?php } ?>
    </table>
</div>
<style>
    .badge {font-size: inherit}
    .badge.badge-top {top:-10px;left:7px;}
    .table td { vertical-align: middle;}
</style>