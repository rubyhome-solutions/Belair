<tr>
    <!--<td><?php // echo $airBooking->carrier->generateImgTag."&nbsp;&nbsp;".$airBooking->carrier->name;         ?></td>-->
    <td>
        <?php
        echo "{$airBooking->travelerType->name} {$airBooking->traveler->shortCombinedInfo}";
        if (!isset($print)) {
            ?>
        <a href="/traveler/update/<?php echo $airBooking->traveler_id;?>" target="_blank" class="btn btn-mini" style="float:right">Info</a>
<!--            <form class="noprint" method="POST" style="float: right; margin-right:5px;margin-bottom:0px;" action="/site/print" target="_blank">
                <input type="hidden" value="/eticket/view/<?php // echo $airBooking->id; ?>" name="url">
                <input type="hidden" value="<?php // echo "eTicket_{$airBooking->id}.pdf"; ?>" name="filename">
                <button class="btn btn-mini" type="submit" onclick="$(this).blur();">eTicket</button>
            </form>-->
        <?php } ?>
    </td>
    <td class="center <?php echo empty($airBooking->crs_pnr) ? 'red' : 'pnr'; ?>"><?php echo!empty($airBooking->crs_pnr) ? strtoupper($airBooking->crs_pnr) : 'PENDING'; ?></td>
    <td class="center <?php echo empty($airBooking->airline_pnr) ? 'red' : 'pnr'; ?>"><?php echo!empty($airBooking->airline_pnr) ? strtoupper($airBooking->airline_pnr) : 'PENDING'; ?></td>
    <td class="center <?php echo empty($airBooking->ticket_number) || $airBooking->ticket_number==='N/A' ? 'red' : 'pnr'; ?>"><?php echo!empty($airBooking->ticket_number) ? strtoupper($airBooking->ticket_number) : 'PENDING'; ?></td>
    <td class="center"><?php echo $airBooking->booking_class; ?></td>
    <td class="center"><?php echo $airBooking->cabin_type_id ? $airBooking->cabinType->name : 'Unset'; ?></td>
    <td class="center"><?php echo $airBooking->fareType->name; ?></td>
    <td class="center"><?php echo $airBooking->basic_fare + $airBooking->reseller_markup_base; ?></td>
    <td class="center"><?php echo ($airBooking->taxesOnly + $airBooking->service_tax + $airBooking->jn_tax + $airBooking->reseller_markup_tax + $airBooking->reseller_markup_fee + $airBooking->booking_fee - $airBooking->commission_or_discount_gross); ?></td>
    <td style="font-weight: bold; text-align: center;"><?php
        echo number_format($airBooking->fareAndTaxes + $airBooking->getMarkup() + $airBooking->booking_fee - $airBooking->commission_or_discount_gross);
        ?></td>
</tr>