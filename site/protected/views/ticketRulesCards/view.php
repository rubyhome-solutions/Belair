<?php
/* @var $this TicketRulesCardsController */
/* @var $model TicketRulesCards */

$this->breadcrumbs = array(
    'Ticket Credit Cards Rule' => array('admin'),
    $model->id,
);
?>

<h3>View Ticket Credit Cards Rule#<?php echo $model->id; ?></h3>

<?php
//echo "<pre>";print_r($model->ticketCardsRulesInfos);
$this->widget('zii.widgets.CDetailView', array(
    'data' => $model,
    'attributes' => array(
        'id',
        [
            'name' => 'airline_id',
            'value' => $model->airline->code,
        ],
        [
            'name' => 'journey_type',
            'value' => \TicketRulesCards::$journey[$model->journey_type],
        ]
    ),
));
?>
<h4>Card Details</h4>
<table class="detail-view">

    <tr>
        <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Card no</th>
        <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Card Type</th>
        <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Expiry</th>
        <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Available days</th>
        <th class="heading" style="font-weight: bold;background-color: #D9F5BE;">Remarks</th>
    </tr> 
    <?php
    $carddetails = [];
    $ticketCardsRulesInfo = new \TicketCardsRulesInfo;
    $ticketCardsRulesInfo->unsetAttributes();

    $ticketCardsRulesInfo->ticket_rules_cards_id = $model->id;

    $carddetails = $ticketCardsRulesInfo->search()->getData();
    if (!empty($carddetails)) {
        foreach ($carddetails as $key1 => $cardinfo) {
            $class = (($key1 + 1) % 2 == 0) ? "even" : "odd";
            ?>        
            <tr class="<?php echo $class; ?>">
                <td><?php echo $cardinfo->ticketCardsInfo->card_no; ?></td>
                <td><?php echo $cardinfo->ticketCardsInfo->card_type; ?></td>
                <td><?php echo $cardinfo->ticketCardsInfo->getExpiry(); ?></td>
                <td><?php echo \TicketCardsRulesInfo::getSelectedDays($cardinfo->rule_days); ?></td>
                <td><?php echo $cardinfo->remarks; ?></td>
            </tr>
            <?php
        }
    } else {
        ?>

        <tr><td style="text-align:center">There are no cards .</tr>
<?php } ?>
</table>