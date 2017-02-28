<?php
/* @var $this AirCartController */
/* @var $airBooking AirBooking */
$isTopStaffOrAccountantLogged = Authorization::getIsTopStaffOrAccountantLogged();
$isSuperAdminLoggedIn = Authorization::getIsSuperAdminLogged();


?>
<tr>
    <td>
        <?php
        echo "{$airBooking->travelerType->name} {$airBooking->traveler->shortCombinedInfo}";
       
        if (!isset($print)) {
            ?>
            <a href="/traveler/update/<?php echo $airBooking->traveler_id; ?>" target="_blank" class="btn btn-mini" style="float:right">Info</a>
            <!--            <form class="noprint" method="POST" style="float: right; margin-right:5px;margin-bottom:0px;" action="/site/print" target="_blank">
                            <input type="hidden" value="/eticket/view/<?php // echo $airBooking->id;  ?>" name="url">
                            <input type="hidden" value="<?php // echo "eTicket_{$airBooking->id}.pdf";  ?>" name="filename">
                            <button class="btn btn-mini" type="submit" onclick="$(this).blur();">eTicket</button>
                        </form>-->
            <?php
            }
            if ($isSuperAdminLoggedIn) {
                if (!empty($allTravelers)) {
                    ?>
                                <a class="label label-primary edit_travelers" style="background-color:green" href ="javascript:void(0)"><i class="ffa fa-pencil-square-o"></i>&nbsp;&nbsp;Edit</a>
                    <?php
                    $dropdown = '';
                    $dropdown .='<select style="display:none" class="traveler_lists dropdown" data-air_booking_id="' . $airBooking->id . '" >';
                    $dropdown .= '<option>--Select Traveler--</option>';
                    foreach ($allTravelers as $traveler) {

                        $dropdown .= "<option value='{$traveler['id']}'>{$traveler['title']} {$traveler['first_name']} {$traveler['last_name']}</option>";
                    }
                    $dropdown .='</select>';
                    echo $dropdown;
                }
            }
            ?>    
            
    </td>
    <td class="center <?php echo empty($airBooking->crs_pnr) ? 'red' : 'pnr'; ?>"><?php echo!empty($airBooking->crs_pnr) ? strtoupper($airBooking->crs_pnr) : 'PENDING'; ?></td>
    <td class="center <?php echo empty($airBooking->airline_pnr) ? 'red' : 'pnr'; ?>"><?php echo!empty($airBooking->airline_pnr) ? strtoupper($airBooking->airline_pnr) : 'PENDING'; ?></td>
    <td class="center <?php echo empty($airBooking->ticket_number) || $airBooking->ticket_number === 'N/A' ? 'red' : 'pnr'; ?>"><?php echo!empty($airBooking->ticket_number) ? strtoupper($airBooking->ticket_number) : 'PENDING'; ?></td>
    <td class="center"><?php echo $airBooking->booking_class; ?></td>
    <td class="center"><?php echo $airBooking->cabin_type_id ? $airBooking->cabinType->name : 'Unset'; ?></td>
    <td class="center"><?php echo $airBooking->fareType->name; ?></td>
    <td class="center"><?php echo $airBooking->basic_fare + $airBooking->reseller_markup_base; ?></td>
    <td class="center"><?php echo ($airBooking->taxesOnly + $airBooking->service_tax + $airBooking->jn_tax + $airBooking->reseller_markup_tax + $airBooking->reseller_markup_fee + $airBooking->booking_fee - $airBooking->commission_or_discount_gross); ?></td>
    <td style="font-weight: bold; text-align: center;"><?php echo number_format($airBooking->fareAndTaxes + $airBooking->getMarkup() + $airBooking->booking_fee - $airBooking->commission_or_discount_gross); ?></td>
    <td class="center"><?php echo $airBooking->abStatus->name; ?></td>
    <td class="center"><?php echo $airBooking->airSource->name; ?></td>
    <?php if($isTopStaffOrAccountantLogged) { ?>
    <td class="center">
            <?php
            if ($airBooking->commercial_rule_id) {
                $plan = Yii::app()->db->createCommand("SELECT plan_id FROM commercial_x_rule WHERE rule_id={$airBooking->commercial_rule_id}")->queryRow();
                echo "<a class='btn btn-small btn-info' href='/commercial/update/{$plan['plan_id']}?ruleId={$airBooking->commercial_rule_id}' target='_blank'><i class='fa fa-cog'></i>&nbsp;&nbsp;C.N.E. &#8377 $airBooking->commercial_total_efect</a>";
            }
            ?>
        </td>
        <?php
        }
        if ($isSuperAdminLoggedIn) {
            ?>
            <td>
                <a class="label label-danger" style="background-color:red" href ="javascript:updateAirbooking('<?php echo $airBooking->id; ?>')"><i class="fa fa-trash-o fa-lg"></i>&nbsp;&nbsp;Delete</a>
            <?php } ?> 
        
</tr>