<?php
/* @var $this AirCartController */
/* @var $amendments Amendment[] */

$isStaffLogged = Authorization::getIsStaffLogged();
echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Cart Amendments <span class="badge badge-warning badge-top">' . count($amendments) . '</span>'
    , [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'size' => TbHtml::BUTTON_SIZE_SMALL,
    'onclick' => 'js:$("#cartAmendments").toggle(); $(this).blur();',
    'style' => 'margin-bottom: 10px;',
    'class' => 'noprint'
]);
?>
<div id="cartAmendments" style="margin-left: 0px;max-width: 1100px; display: none;" class="noprint">

<p class="well-small alert-info">&nbsp;&nbsp;<i class="fa fa-wrench fa-lg"></i>&nbsp;&nbsp;Cart amendments list</p>
<table class="table table-condensed table-bordered table-hover" style="max-width: 95%;">
    <tr class="heading">
        <th>ID</th>
        <th>Generated</th>
        <th>User</th>
        <th>Type</th>
        <th>Comments</th>
        <th>Booking Type</th>
        <th>Status</th>
        <th>Payment</th>
        <th>Charge</th>
        <th>Invoice</th>
        <th>Process</th>
        <th>Abort</th>
    </tr>
    <?php foreach ($amendments as $amendment) { ?>
        <form class="inline" method="POST" onsubmit="document.body.style.cursor = 'wait';">
            <input type="hidden" name="cart_id" value="<?php echo $amendment->airBooking->air_cart_id; ?>">
            <tr class="center">
                <td><?php echo $amendment->group_id; ?></td>
                <td><?php echo Utils::cutMilliseconds($amendment->created); ?></td>
                <td><?php echo $amendment->logedUser->name; ?></td>
                <td><?php echo $amendment->amendmentType->name; ?></td>
                <td><?php echo $amendment->note; ?></td>
                <td><?php echo $amendment->airBooking->bookingType->name; ?></td>
                <td><span class="label <?php echo ($amendment->amendment_status_id === AmendmentStatus::STATUS_CANCELLED) ? 'label-important' : (($amendment->amendment_status_id === AmendmentStatus::STATUS_SUCCESS) ? 'label-success' : ''); ?>"><?php echo $amendment->amendmentStatus->name; ?></span></td>
                <td><?php echo $amendment->paymentStatus->name; ?></td>
                <td><?php echo $amendment->amount_to_charge; ?></td>
                <td>
                    <?php if ($amendment->amendment_status_id === AmendmentStatus::STATUS_SUCCESS) { ?>
                        <a target="_blank" href="/airCart/invoiceAmendment/<?php echo $amendment->group_id; ?>" class="btn btn-mini btn-info">Invoice</a>
                    <?php } ?>
                </td>
                <td>
                    <?php if ($amendment->amendment_status_id === AmendmentStatus::STATUS_REQUESTED) { ?>
                        <button style="white-space: nowrap;" formaction="/airCart/processAmendment/<?php echo $amendment->group_id; ?>" type="submit" class="btn btn-mini btn-info">Click if amended with supplier</button>
                    <?php } elseif ($amendment->amendment_status_id === AmendmentStatus::STATUS_AMENDED_WITH_SUPPLIER) { ?>
                        <button style="white-space: nowrap;" formaction="/airCart/defineAmendment/<?php echo $amendment->group_id; ?>" type="submit" class="btn btn-mini btn-info">Process</button>
                    <?php } elseif ($amendment->amendment_status_id === AmendmentStatus::STATUS_SUCCESS) { ?>
                        <button onclick="$(this).blur();
                                        $('#amendmentDetails_<?php echo $amendment->group_id; ?>').toggle();
                                        $('#amendmentTrailer_<?php echo $amendment->group_id; ?>').toggle();" style="white-space: nowrap;" type="button" class="btn btn-mini btn-info"><i class="fa fa-eye-slash fa-lg"></i>&nbsp;&nbsp;Show/Hide</button>
                            <?php } ?>
                </td>
                <td>
                    <?php if ($amendment->amendment_status_id === AmendmentStatus::STATUS_REQUESTED) { ?>
                        <button style="white-space: nowrap;" formaction="/airCart/abortAmendment/<?php echo $amendment->group_id; ?>" type="submit" class="btn btn-mini btn-danger">Abort</button>
                    <?php } ?>
                </td>
            </tr>
            <?php if ($amendment->amendment_status_id === AmendmentStatus::STATUS_SUCCESS) { ?>
                <tr id="amendmentDetails_<?php echo $amendment->group_id; ?>" style="display: none">
                    <td></td>
                    <td colspan="9" style="box-shadow: 10px 10px 5px #888888; background-color: aliceblue;">
                        <?php
                        $amendmentsGroup = Amendment::model()->findAllByAttributes(['group_id' => $amendment->group_id]);
                        foreach ($amendmentsGroup as $amd) {
                            echo TbHtml::well("&nbsp;&nbsp;<i class='fa fa-wrench fa-lg'></i>&nbsp;&nbsp;Amendment details for &nbsp;&nbsp;<i class='fa fa-user fa-lg'></i>&nbsp;&nbsp;" . $amd->airBooking->traveler->combinedInfo, ['class' => 'alert-info well-small', 'style' => 'padding: 3px;']);
                            $this->renderPartial('_viewairroutes', ['airRoutes' => [$amd->airRoute]]);
                            ?>
                            <table class="table table-condensed table-bordered" style="max-width: 60%;margin-left: 5%;">
                                <tr class="heading">
                                    <th>Field</th>
                                    <th>Old value</th>
                                    <th>New value</th>
                                </tr>
                                <?php echo $amd->changes; ?>
                                <tr></tr>
                            </table>
                        <?php } ?>
                    </td>
                </tr>
                <tr id="amendmentTrailer_<?php echo $amendment->group_id; ?>" style="display: none"><td></td></tr>
                    <?php } ?>
        </form>
    <?php } ?>
</table>
</div>
<style>
    .badge {font-size: inherit}
    #divTransactions table td {vertical-align: middle}
</style>