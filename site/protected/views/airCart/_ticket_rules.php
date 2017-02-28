<?php
echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Ticket Rules <span class="badge badge-warning badge-top"></span>'
    , [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'size' => TbHtml::BUTTON_SIZE_SMALL,
    'onclick' => 'js:$("#divTicketRules").toggle(); $(this).blur();',
    'style' => 'margin-bottom: 10px;',
    'class' => 'noprint'
]);
?>
<div id="divTicketRules" style="margin-left: 0px; display: none;" class="noprint">


    <?php
    $airlines = [];
    $notes = [];
    foreach ($model->airBookings as $booking) {
        foreach ($booking->airRoutes as $route) {
            if (!isset($airlines[$route->carrier_id])) {
                $airlines[$route->carrier_id] = 'set';
            } else {
                continue;
            }
//                $airline = \TicketRulesAirline::model()->findAllByAttributes(['airline_code' => $route->carrier->code]);
//                if($airline==null)
//                    continue;

            $airlinelist = \TicketRulesAirline::model()->findAllByAttributes(['airline_code' => $route->carrier->code]);
            if (count($airlinelist) < 1)
                continue;

            //$notes[$route->carrier_id];
            ?>
            <table class="table table-condensed table-hover table-bordered">
                <tr>
                    <th class="heading" colspan='11' style="background-color: #FCB941"><?php echo $route->carrier->name; ?></th>

                </tr>
                <tr>
                    <th class="heading" rowspan="2">IATA on Basic</th>
                    <th class="heading"rowspan="2">Airline</th>
                    <th colspan='3' style="font-weight: bold;background-color: #D9F5BE;">1st Source</th>
                    <th colspan='3' style="font-weight: bold;background-color: #fde1f7;">2nd Source</th>
                    <th colspan='3' style="font-weight: bold;background-color: #e1fafc;">3rd Source</th>
                </tr>
                <tr>
                    <th style="font-weight: bold;background-color: #e5f9d2;">Agent</th>
                    <th style="font-weight: bold;background-color: #e5f9d2;">RBD</th>
                    <th style="font-weight: bold;background-color: #e5f9d2;">Remark</th>
                    <th style="font-weight: bold;background-color: #feeafa;">Agent</th>
                    <th style="font-weight: bold;background-color: #feeafa;">RBD</th>
                    <th style="font-weight: bold;background-color: #feeafa;">Remark</th>
                    <th style="font-weight: bold;background-color: #edfeff;">Agent</th>
                    <th style="font-weight: bold;background-color: #edfeff;">RBD</th>
                    <th style="font-weight: bold;background-color: #edfeff;">Remark</th>
                </tr>
                <?php
                //if ($airline != null) { 
                foreach ($airlinelist as $airline) {
                    ?>
                    <tr>
                        <td ><?php echo $airline->iata_on_basic; ?></td>
                        <td><?php echo $airline->airline_name; ?></td>
                        <td style="background-color: #e5f9d2;"><?php if (!empty($airline->source_a_agent_id)) echo $airline->sourceAAgent->agent_name; ?></td>
                        <td style="background-color: #e5f9d2;"><?php echo $airline->source_a_rbd; ?></td>
                        <td style="background-color: #e5f9d2;"><?php echo $airline->getNotesSource(1) . ' ' . $airline->source_a_remark . ' '; ?></td>

                        <td style="background-color: #feeafa;"><?php if (!empty($airline->source_b_agent_id)) echo $airline->sourceBAgent->agent_name; ?></td>
                        <td style="background-color: #feeafa;"><?php echo $airline->source_b_rbd; ?></td>
                        <td style="background-color: #feeafa;"><?php echo $airline->getNotesSource(2) . ' ' . $airline->source_b_remark . ' '; ?></td>

                        <td style="background-color: #edfeff;"><?php if (!empty($airline->source_c_agent_id)) echo $airline->sourceCAgent->agent_name; ?></td>
                        <td style="background-color: #edfeff;"><?php echo $airline->source_c_rbd; ?></td>
                        <td style="background-color: #edfeff;"><?php echo $airline->getNotesSource(3) . ' ' . $airline->source_c_remark . ' '; ?></td>

                    </tr>

                <?php }
                ?></table>     
            <table class="table table-condensed table-hover table-bordered">
                <tr>
                    <th class="heading" colspan='8'>Source Details</th>
                </tr> 
                <tr>
                    <th class="heading" >Agent Name</th>
                    <th class="heading" >Amadeus-1A PCC</th>
                    <th class="heading" >Galileo-1G PCC</th>
                    <th class="heading" >Contact</th>
                    <th class="heading" >Email ID</th>
                    <th class="heading" >Office</th>
                    <th class="heading" >Night CTC</th>
                    <th class="heading" >Mobile No</th>
                </tr> 
                <tr>
                    <?php if (!empty($airline->source_a_agent_id)) { ?>
                        <td ><?php echo $airline->sourceAAgent->agent_name; ?></td>
                        <td><?php echo $airline->sourceAAgent->amadeus_pcc; ?></td>
                        <td ><?php echo $airline->sourceAAgent->gal_pcc; ?></td>
                        <td><?php echo $airline->sourceAAgent->contact; ?></td>
                        <td><?php echo $airline->sourceAAgent->email; ?></td>
                        <td ><?php echo $airline->sourceAAgent->office; ?></td>
                        <td><?php echo $airline->sourceAAgent->night_ctc; ?></td>
                        <td><?php echo $airline->sourceAAgent->mobile_no; ?></td>
                    <?php } ?>
                </tr> 
                <tr>
                    <?php if (!empty($airline->source_b_agent_id)) { ?>
                        <td ><?php echo $airline->sourceBAgent->agent_name; ?></td>
                        <td><?php echo $airline->sourceBAgent->amadeus_pcc; ?></td>
                        <td ><?php echo $airline->sourceBAgent->gal_pcc; ?></td>
                        <td><?php echo $airline->sourceBAgent->contact; ?></td>
                        <td><?php echo $airline->sourceBAgent->email; ?></td>
                        <td ><?php echo $airline->sourceBAgent->office; ?></td>
                        <td><?php echo $airline->sourceBAgent->night_ctc; ?></td>
                        <td><?php echo $airline->sourceBAgent->mobile_no; ?></td>
                    <?php } ?>
                </tr> 
                <tr>
                    <?php if (!empty($airline->source_c_agent_id)) { ?>
                        <td ><?php echo $airline->sourceCAgent->agent_name; ?></td>
                        <td><?php echo $airline->sourceCAgent->amadeus_pcc; ?></td>
                        <td ><?php echo $airline->sourceCAgent->gal_pcc; ?></td>
                        <td><?php echo $airline->sourceCAgent->contact; ?></td>
                        <td><?php echo $airline->sourceCAgent->email; ?></td>
                        <td ><?php echo $airline->sourceCAgent->office; ?></td>
                        <td><?php echo $airline->sourceCAgent->night_ctc; ?></td>
                        <td><?php echo $airline->sourceCAgent->mobile_no; ?></td>
                    <?php } ?>
                </tr> 
            </table>   


            <table class="table table-condensed table-hover table-bordered">
                <?php
                $journey_type = \PaymentConvenienceFee::WAYTYPE_DOMESTIC;
                if ($model->isInternational()) {
                    $journey_type = \PaymentConvenienceFee::WAYTYPE_INTERNATIONAL;
                }
                $carddetails = [];
                $ticketCardsRulesInfo = new \TicketCardsRulesInfo;
                $ticketCardsRulesInfo->unsetAttributes();

                $ticketRuleCards = \TicketRulesCards::model()->findByAttributes(['airline_id' => $route->carrier_id, 'journey_type' => $journey_type]);
                if ($ticketRuleCards !== null) {
                    $ticketCardsRulesInfo->ticket_rules_cards_id = $ticketRuleCards->id;

                    $carddetails = $ticketCardsRulesInfo->search()->getData();
                }
                $day = date('D');
                $currentDaykey = array_search($day, \TicketCardsRulesInfo::$daysArr);
                $i = 1;
                ?>

                <tr>
                    <th class="heading" colspan="6">Card Details</th>
                </tr>
                <tr>
                    <th class="heading">Airline</th>
                    <th style="font-weight: bold;background-color: #D9F5BE;">&nbsp; </th>
                    <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Card Type</th>
                    <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Card No.</th>
                    <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Expiry</th>
                    <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Remarks</th>
                </tr>

                <?php
                $flag = true;
                foreach ($carddetails as $cardinfo) {
                    ?>
                    <tr>
                        <?php if ($flag) { ?>
                            <td rowspan="<?php echo count($carddetails); ?>"><?php echo $ticketRuleCards->airline->name; ?></td>
                            <?php
                            $flag = false;
                        }
                        if (($cardinfo->rule_days & $currentDaykey) || ($cardinfo->rule_days & 256)) {
                            ?>
                            <td>OPTION <?php echo $i; ?></td>
                            <td><?php echo $cardinfo->ticketCardsInfo->card_type; ?></td>
                            <td><?php echo $cardinfo->ticketCardsInfo->card_no; ?></td>
                            <td><?php echo $cardinfo->ticketCardsInfo->getExpiry(); ?></td>
                            <td><?php echo $cardinfo->remarks; ?></td>
                        </tr>
                        <?php
                        $i++;
                    }
                    ?>

                <?php }
                ?>

            </table>
            <table class="table table-condensed table-hover table-bordered">
                <?php
                $notesDetail = $airline->getNotesDetail();
                if (count($notesDetail) > 0) {
                    ?>
                    <tr>
                        <th class="heading" colspan='5'>Notes</th>

                    </tr> 
                    <tr>
                        <th class="heading">Id</th>
                        <th class="heading">AL Code</th>
                        <th class="heading">IATA on Basic %</th>
                        <th class="heading">Airline</th>
                        <th class="heading">Instructions</th>
                    </tr> 
                    <?php
                }
                foreach ($notesDetail as $note) {
                    ?>
                    <tr>
                        <td style="font-weight: bold;"><?php
                            $notesmodel = \TicketRulesNotes::model()->findByPk((int) $note->id);
                            if ($notesmodel != null)
                                echo $notesmodel->note_id . ", ";
                            //echo 'Note ' . $note->id; 
                            ?></td>
                        <td><?php echo $note->airline_code; ?></td>
                        <td><?php echo $note->iata_on_basic; ?></td>
                        <td><?php echo $note->airline_with_remarks; ?></td>
                        <td><?php
                            echo $note->instructions;
                            ;
                            ?></td>

                    </tr>
                <?php } ?>
            </table>
            <?php
        }
    }
    ?>
</div>
<style>
    .badge {font-size: inherit}
    .badge.badge-top {top:-10px;left:7px;}
    .table td { vertical-align: middle;}
</style>