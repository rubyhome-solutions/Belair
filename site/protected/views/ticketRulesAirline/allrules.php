<style>
    .span-19{width:100%;}
</style>

<?php
/* @var $this TicketRulesAirlineController */
/* @var $model TicketRulesAirline */

$this->breadcrumbs = array(
    'Ticket Rules Airlines' => array('admin'),
    'All Rules',
);
?>

<div class="clear"></div>

<?php
$allSources = \TicketRulesSources::model()->findAll();
$allAirlines = \TicketRulesAirline::model()->findAll();
$allNotes = \TicketRulesNotes::model()->findAll();
$allCards = \TicketRulesCards::model()->findAll();
?>


<h1>All Rules and Notes</h1> <button class="positive btn btn-info" onclick="js:$('#airlinesRules').toggle(); $(this).blur();">All Rules</button>
<button class="positive btn btn-info" onclick="js:$('#airlinesNotes').toggle(); $(this).blur();">See Notes</button>
<button class="positive btn btn-info" onclick="js:$('#CardDetails').toggle(); $(this).blur();">Card Details</button>

<div id="CardDetails" style="display:none; padding:15px 10px; margin: 15px 0 0; background: #fef8b8;">
    <table class="table table-condensed table-hover table-bordered">
        <tr>
            <th class="heading" colspan="5">Credit Card Rules</th>
        </tr>
        <tr>
            <th class="heading">Airline</th>
            <th class="heading">Journey Type</th>
            <th class="heading">Card Type</th>
            <th class="heading">Card No.</th>
            <th class="heading">Expiry</th>
            <th class="heading">Remarks</th>
        </tr>

        <?php
        foreach ($allCards as $carddetail) {
            $flag = true;
            foreach ($carddetail->ticketCardsRulesInfos as $key1 => $cardinfo) {
                ?>
                <tr>
                    <?php
                    if ($flag) {
                        $rowspan = count($carddetail->ticketCardsRulesInfos);
                        ?>
                        <td rowspan="<?php echo $rowspan; ?>"><?php echo $carddetail->airline->name; ?></td>
                        <td rowspan="<?php echo $rowspan; ?>"><?php echo \TicketRulesCards::$journey[$carddetail->journey_type]; ?></td>
                        <?php
                        $flag = false;
                    }
                    ?>
                    <td><?php echo $cardinfo->ticketCardsInfo->card_type; ?></td>
                    <td><?php echo $cardinfo->ticketCardsInfo->card_no; ?></td>
                    <td><?php echo $cardinfo->ticketCardsInfo->getExpiry(); ?></td>
                    <td><?php echo $cardinfo->remarks; ?></td>
                </tr>
                <?php
            }
            ?>

        <?php }
        ?>

    </table>
</div>
<div id="airlinesNotes" style="display:none; padding:15px 10px; margin: 15px 0 0; background: #fef8b8;">
    <table class="table table-condensed table-hover table-bordered">
        <tr>
            <th class="heading" colspan="5" align="center"><strong>Notes</strong></th>
        </tr>
        <tr>
            <th width="80" align="center">Note Id</th>
            <th align="center">AL Code</th>
            <th align="center">IATA on Basic %</th>
            <th align="center">Airline</th>
            <th align="center">Instructions</th>

        </tr>
<?php foreach ($allNotes as $notes) { ?>
            <tr>     
                <td><?php echo $notes->note_id ?></td>
                <td><?php echo $notes->airline_code ?></td>
                <td><?php echo $notes->iata_on_basic ?></td>
                <td><?php echo $notes->airline_with_remarks ?></td>
                <td><?php echo $notes->instructions ?></td>
            </tr>
<?php } ?>
    </table>
</div>



<!--Airline Rules table-->
<div id="airlinesRules">
    <h3>TICKETING  SOURCES FOR CHEAPTICKET.IN (ATI)</h3>
    <table class="table table-condensed table-hover table-bordered">
        <tr>
            <th class="heading" colspan="8" align="center"><strong>Source Details</strong></th>
        </tr>
        <tr>
            <th align="center">Agent Name</th>
            <th align="center">Amadeus-1A PCC</th>
            <th align="center">Galileo-1G PCC</th>
            <th align="center">Contact</th>
            <th align="center">Email ID</th>
            <th align="center">Office</th>
            <th align="center">Night CTC</th>
            <th align="center">Mobile No</th>
        </tr>
<?php foreach ($allSources as $source) { ?>

            <tr>
                <td><?php echo $source->agent_name; ?></td>
                <td><?php echo $source->amadeus_pcc; ?></td>
                <td><?php echo $source->gal_pcc; ?></td>
                <td><?php echo $source->contact; ?></td>
                <td><?php echo $source->email; ?></td>
                <td><?php echo $source->office; ?></td>
                <td><?php echo $source->night_ctc; ?></td>
                <td><?php echo $source->mobile_no; ?></td>

            </tr>
<?php } ?>
    </table>
    <br>
    <h2>Airlines Details</h2>
    <table class="table table-condensed table-hover table-bordered">
        <tr>
            <th class="heading" colspan="8" align="center"><strong>Source Details</strong></th>
        </tr>
        <tr>
            <th rowspan="2" align="center">IATA on Basic</th>
            <th rowspan="2" align="center">Airline</th>
            <th colspan="3" align="center">1st Source</th>
            <th colspan="3" align="center">2nd Source</th>
            <th colspan="3" align="center">3rd Source</th>

        </tr>
        <tr>
            <td>Agent</td><td>RBD</td><td>Remark</td>
            <td>Agent</td><td>RBD</td><td>Remark</td>
            <td>Agent</td><td>RBD</td><td>Remark</td>
        </tr>
<?php foreach ($allAirlines as $airlines) { ?>
            <tr>
                <td> <?php echo $airlines->iata_on_basic; ?></td>
                <td> <?php echo $airlines->airline_name; ?></td>
                <td> <?php echo $airlines->source_a_agent_id; ?></td>
                <td> <?php echo $airlines->source_a_rbd; ?></td>
                <td> <?php echo $airlines->source_a_remark; ?></td>

                <td> <?php echo $airlines->source_b_agent_id; ?></td>
                <td> <?php echo $airlines->source_b_rbd; ?></td>
                <td> <?php echo $airlines->source_b_remark; ?></td>

                <td> <?php echo $airlines->source_c_agent_id; ?></td>
                <td> <?php echo $airlines->source_c_rbd; ?></td>
                <td> <?php echo $airlines->source_c_remark; ?></td>
            </tr>
<?php } ?>
    </table>
</div>