<?php
$model = AirBooking::model()->with(array(
            'airCart' => array('with' =>
                'bookingStatus',
                'user' => array('with' => 'userInfo'),
                'airBookings' => array(
                    'with' => array(
                        'airRoutes' => array(
                            'with' => array('source', 'destination', 'carrier'),
                            'order' => '"airRoutes".departure_ts ASC',
                        ),
                        'traveler' => array('with' => 'travelerTitle'),
                        'cabinType',
                        'travelerType',
                    ),
                    'order' => '"airBookings".departure_ts ASC',
                ),
            ),
            'fareType',
            'carrier',
        ))->findByPk($id);

/* @var $model AirBooking  */
if ($model === null)
    throw new CHttpException(404, "E-ticket not found");

//$bookings = array();
//foreach ($model->airCart->airBookings as $booking) {
//    if ($booking->traveler_id == $model->traveler_id)
//        $bookings[] = $booking;
//}
$bookings = AirBooking::model()->findAll([
    'condition' => "air_cart_id=$model->air_cart_id AND traveler_id=$model->traveler_id",
    'order' => 'departure_ts'
        ]);
/* @var $bookings AirBooking[]  */
?>
<link rel="stylesheet" href="/css/eticket.css">
<div id="print">
    <div class="header">
        <div style="float: left;">
            <?php if ($model->airCart->user->userInfo->user_type_id == UserType::clientB2C) { ?>
                <?php
                $company = Users::model()->with('userInfo')->findByPk(Users::B2C_USERID);
                echo $company->userInfo->getLogo();
                ?>
            <?php } elseif ($model->airCart->user->userInfo->user_type_id == UserType::corporateB2E) { ?>
                <?php
                $logo = $model->airCart->user->userInfo->getLogo();
                echo $logo ? $logo : '<b>' . $model->airCart->user->userInfo->name . '</b>';
                ?><br>
                <b>Email:</b> <?php echo CHtml::link($model->airCart->user->userInfo->email, 'mailto:' . $model->airCart->user->userInfo->email); ?>
            <?php } else { ?>
                <b><?php echo $model->airCart->user->userInfo->name; ?></b><br>
                <b>Phone:</b> <?php echo $model->airCart->user->userInfo->mobile; ?><br>
                <b>Email:</b> <?php echo $model->airCart->user->userInfo->email; ?><br>
                <b>Address:</b> <?php echo $model->airCart->user->userInfo->address; ?>
            <?php } ?>
        </div>
        <h1>E-TICKET</h1>
        <div style="float: right;">
            <?php
            if ($model->airCart->user->userInfo->user_type_id == UserType::clientB2C) {
                echo $model->carrier->getGenerateImgTag();
                ?>
            <?php } elseif ($model->airCart->user->userInfo->user_type_id == UserType::corporateB2E) { ?>
                <img src="/img/b2e_with_phone.jpg">
            <?php } else { ?>
                <?php
                $logo = $model->airCart->user->userInfo->getLogo();
                echo $logo ? $logo : '<b>' . $model->airCart->user->userInfo->name . '</b>';
                ?>
            <?php } ?>
        </div>
        <div style="clear: both;"></div>
    </div>
    <div class="blue">
        Booking Details
    </div>
    <div class="row big">
        <label>Reference Number</label>
        <span>:</span>
        <?php echo $model->airCart->id; ?>
    </div>
    <div class="row big">
        <label>Generation Time</label>
        <span>:</span>
        <?php echo date('j-M-Y, G:i:s', strtotime($model->airCart->created)); ?>
    </div>
    <div class="row big">
        <label>Booking Status</label>
        <span>:</span>
        <?php 
        if(strcasecmp(echo $model->airCart->bookingStatus->name, 'fraud'))
        {
            echo 'PENDING';
        } 
        else
        {
            echo $model->airCart->bookingStatus->name;
        }
        ?>
    </div>
    <?php
    $cartFare = 0;
    $cartTaxes = 0;
    $cartFees = 0;
    foreach ($bookings as $booking) {
        $cartFare += $booking->basic_fare;
        $cartTaxes += $booking->taxesOnly + $booking->service_tax + $booking->jn_tax - $booking->commission_or_discount_gross;
        $cartFees += $booking->booking_fee;

        foreach ($booking->airRoutes as $r) {
            ?>
            <div class="route">
                <div class="blue">
                    <?php echo date('j/m/Y', strtotime($r->departure_ts)) . ' - ' . $r->source->city_name . ' to ' . $r->destination->city_name . ' - by ' . $r->carrier->name; ?>
                </div>
                <div class="row">
                    <label>Flight</label>
                    <span>:</span>
                    <?php echo $r->carrier->name . ', ' . $r->flight_number; ?>
                </div>
                <div class="row">
                    <label>Departure</label>
                    <span>:</span>
                    <?php echo date('G:i, D j-M', strtotime($r->departure_ts)); ?>
                    <span>:</span>
                    <?php echo $r->source->city_name . ', ' . $r->source->country_code . ' (' . $r->source->airport_name . ' - ' . $r->source->airport_code . ')'; ?>
                    <?php if ($r->source_terminal) echo '<span>:</span> Terminal ' . $r->source_terminal; ?>
                </div>
                <div class="row">
                    <label>Arrival</label>
                    <span>:</span>
                    <?php echo date('G:i, D j-M', strtotime($r->arrival_ts)); ?>
                    <span>:</span>
                    <?php echo $r->destination->city_name . ', ' . $r->destination->country_code . ' (' . $r->destination->airport_name . ' - ' . $r->destination->airport_code . ')'; ?>
                    <?php if ($r->destination_terminal) echo '<span>:</span> Terminal ' . $r->destination_terminal; ?>
                </div>
                <div class="row">
                    <label>Class</label>
                    <span>:</span>
                    <?php echo $booking->cabin_type_id ? $booking->cabinType->name : ''; ?>
                </div>
                <table>
                    <tr>
                        <th>Name</th>
                        <th class="center">Status</th>
                        <th class="center">Airline PNR</th>
                        <th class="center">CRS PNR</th>
                        <th class="center">Ticket No</th>
                    </tr>
                    <tr>
                        <td><?php echo $booking->traveler->travelerTitle->name . ' ' . $booking->traveler->first_name . ' ' . $booking->traveler->last_name . ' (' . $booking->travelerType->name . ')'; ?></td>
                        <td class="center <?php if ($booking->ab_status_id == AbStatus::STATUS_OK) echo 'green'; ?>"><?php echo $booking->abStatus->name; ?></td>
                        <td class="center <?php echo $booking->airline_pnr ? 'big' : 'red'; ?>"><?php echo $booking->airline_pnr ? $booking->airline_pnr : 'Pending'; ?></td>
                        <td class="center <?php if (!$booking->crs_pnr) echo 'red'; ?>"><?php echo $booking->crs_pnr ? $booking->crs_pnr : 'Pending'; ?></td>
                        <td class="center <?php if (!$booking->ticket_number) echo 'red'; ?>"><?php echo $booking->ticket_number ? $booking->ticket_number : 'Pending'; ?></td>
                    </tr>
                </table>
            </div>
        <?php } ?>
    <?php } ?>
    <div class="row">
        <label class="full">Price Calculation</label>
    </div>
    <div class="row big">
        <label>Form of Payment</label>
        <span>:</span>
        <?php echo $model->airCart->paymentStatus->name; ?>
    </div>
    <div class="row big">
        <label>Base Price</label>
        <span>:</span>
        <?php echo $cartFare . ' ' . $model->airCart->user->userInfo->currency->code; ?>
    </div>
    <div class="row big">
        <label>Airline Taxes and Fees</label>
        <span>: </span>
        <?php echo $cartTaxes . ' ' . $model->airCart->user->userInfo->currency->code; ?>
    </div>
    <div class="row big">
        <label>Fee</label>
        <span>:</span>
        <?php echo $cartFees; ?>
    </div>
    <div class="row big">
        <label>Total Price</label>
        <span>:</span>
        <?php echo number_format($cartFare + $cartTaxes + $cartFees) . ' ' . $model->airCart->user->userInfo->currency->code . ' (' . ucwords(Utils::numberToWords($cartFare + $cartTaxes + $cartFees)).')'; ?>
    </div>
    <?php if ($model->airCart->user->userInfo->user_type_id != UserType::clientB2C) { ?>
        <div class="row">
            <label class="full">Contact Details</label>
        </div>
        <div class="row big block">
            <label style="height: 120px;">Customer Care</label>
            <div style="float: left;">
                <span>:</span>
                <?php echo $model->airCart->user->userInfo->getCustomerCareInfo(); ?>
            </div>
            <div style="clear: both;"></div>
        </div>
    <?php } else { ?>
        <div style="height: 20px;"></div>
    <?php } ?>
    <div class="row big block">
        <label style="height: 80px;">Airline</label>
        <span>:</span>
        <b style="text-decoration: underline;"><?php echo $model->carrier->name; ?></b><br>
        <br>
        <b>Helpline:</b> <?php echo $model->carrier->getHelpLine(); ?><br>
        <div style="clear: both;"></div>
    </div>
    <div class="row">
        <label class="full">Terms and Conditions</label>
    </div>
    <div style="clear: both;"></div>
        <ul style="float: left;">
        <li>All flight timings shown are local times.</li>
        <li>Use <b>Ref No.</b> for communication with us.</li>
        <li>Use <b>Airline PNR</b> for contacting the Airlines.</li>
        <li>Carry a print-out of e-ticket for check-in.</li>
        <li>In case of no-show, tickets are non-refundable.</li>
        <li>Ensure your passport is valid for more than 6 months.</li>
        <li>Please check Transit & Destination Visa Requirement.</li>
        <li>For cancellation, airline charges & ser. fee apply.</li>
    </ul>
    <ul style="float: left;">
        <li>Carry a photo ID/ Passport for check-in.</li>
        <li>Meals, Seat & Special Requests are not guaranteed.</li>
        <li>Present Frequent Flier Card at check-in.</li>
        <li>Carriage is subject to Airlines Terms & Conditions.</li>
        <li>Ensure passenger names are correct, name change is not permitted.</li>
        <li>For any change Airline charges, difference of fare & ser. fee apply.</li>
        <li>You might be asked to provide card copy & ID proof of card holder.</li>
    </ul>
    <div style="clear: both;"></div>
    <div class="footer">
        Disclaimer: <span style="color: red;">Agent Name</span> is not liable for any deficiency in service by Airline or Service providers.
    </div>
</div>
