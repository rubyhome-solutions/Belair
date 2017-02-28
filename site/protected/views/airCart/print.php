<?php
$model = AirCart::model()->with(array(
            'bookingStatus',
            'user' => array('with' => 'userInfo'),
            'airBookings' => array(
                'with' => array(
                    'airRoutes' => array(
                        'with' => array('source', 'destination'),
                        'order' => '"airRoutes".departure_ts ASC',
                    ),
                    'cabinType',
                    'traveler' => array('with' => 'travelerTitle'),
                    'travelerType',
                    'fareType',
                    'carrier',
                ),
                'order' => '"airBookings".traveler_id ASC, "airBookings".departure_ts ASC',
            ),
        ))->findByPk($id);

if ($model === null)
    throw new CHttpException(404, "E-ticket not found");
?>
<link rel="stylesheet" href="/css/eticket.css">
<div id="print" class="cart">
    <div class="header">
        <div style="float: left;">
            <?php if ($model->user->userInfo->user_type_id == UserType::clientB2C) { ?>
                <?php
                $company = Users::model()->with('userInfo')->findByPk(Users::B2C_USERID);
                echo $company->userInfo->getLogo();
                ?>
            <?php } elseif ($model->user->userInfo->user_type_id == UserType::corporateB2E) { ?>
                <?php
                $logo = $model->user->userInfo->getLogo();
                echo $logo ? $logo : '<b>' . $model->user->userInfo->name . '</b>';
                ?><br>
                <b>Email:</b> <?php echo CHtml::link($model->user->userInfo->email, 'mailto:' . $model->user->userInfo->email); ?>
            <?php } else { ?>
                <b><?php echo $model->user->userInfo->name; ?></b><br>
                <b>Phone:</b> <?php echo $model->user->userInfo->mobile; ?><br>
                <b>Email:</b> <?php echo $model->user->userInfo->email; ?><br>
                <b>Address:</b> <?php echo $model->user->userInfo->address; ?>
            <?php } ?>
        </div>
        <h1>Air Cart</h1>
        <div style="float: right;">
            <?php
            if ($model->user->userInfo->user_type_id == UserType::clientB2C) {
                echo $company->userInfo->getLogo();
            } elseif ($model->user->userInfo->user_type_id == UserType::corporateB2E) {
                echo '<img src="/img/b2e_with_phone.jpg">';
            } else {
                $logo = $model->user->userInfo->getLogo();
                echo $logo ? $logo : '<b>' . $model->user->userInfo->name . '</b>';
            }
            ?>
        </div>
        <div style="clear: both;"></div>
    </div>
    <div class="blue">
        Client Information
    </div>
    <div class="row big">
        <label>Client Name</label>
        <span>:</span>
        <?php echo $model->user->userInfo->name; ?>
    </div>
    <div class="row big">
        <label>Billing Entity</label>
        <span>:</span>
        <?php echo empty($model->user->department) ? "Not set" : $model->user->department ?>
    </div>
    <div class="blue">
        Cart Information
    </div>
    <div class="row big">
        <label>Generation Time</label>
        <span>:</span>
        <?php echo date('j-M-Y, G:i:s', strtotime($model->created)); ?>
    </div>
    <div class="row big">
        <label>Booking Status</label>
        <span>:</span>
        <?php echo $model->bookingStatus->name; ?>			
    </div>
    <div class="row big">
        <label>Created by</label>
        <span>:</span>
        <?php echo $model->logedUser->name; ?>			
    </div>
    <div class="row big">
        <label>Payment Status</label>
        <span>:</span>
        <?php echo $model->paymentStatus->name; ?>			
    </div>
    <?php
    $printed = array();
    $cartFare = 0;
    $cartTaxes = 0;
    $cartServiceTax = 0;
    $cartFees = 0;
    foreach ($model->airBookings as $airBooking) {
        if (!in_array($airBooking->departure_ts, $printed)) {
            $printed[] = $airBooking->departure_ts;
            ?>
            <div class="blue">
                <?php echo "&nbsp;{$airBooking->serviceType->name}:&nbsp; {$airBooking->source->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " <i class='fa fa-long-arrow-right fa-lg'></i> {$airBooking->destination->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)); ?>
            </div>
            <table>
                <tr style="text-align: center;" >
                    <th>Airline</th>
                    <th>Flight number</th>
                    <th>Airport</th>
                    <th>Departure</th>
                    <th>Terminal</th>
                    <th></th>
                    <th>Airport</th>
                    <th>Arrival</th>
                    <th>Terminal</th>
                </tr>
                <?php foreach ($airBooking->airRoutes as $airRoute) { ?>
                    <tr>
                        <td><?php echo $airRoute->carrier->generateImgTag . "&nbsp;&nbsp;" . $airRoute->carrier->name; ?></td>
                        <td class="center"><?php echo $airRoute->flight_number; ?></td>
                        <td class="center"><?php echo $airRoute->source->nameCode; ?></td>
                        <td class="center"><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->departure_ts)); ?></td>
                        <td class="center"><?php echo $airRoute->source_terminal; ?></td>
                        <td class="center"><i class='fa fa-long-arrow-right fa-lg'></i></td>
                        <td class="center"><?php echo $airRoute->destination->nameCode; ?></td>
                        <td class="center"><?php echo date(TICKET_DATETIME_FORMAT, strtotime($airRoute->arrival_ts)); ?></td>
                        <td class="center"><?php echo $airRoute->destination_terminal; ?></td>
                    </tr>
                <?php } ?>
            </table>
            <table style="margin-bottom: 30px;">
                <tr style="text-align: center;" >
                    <th>Passenger</th>
                    <th>CRS PNR</th>
                    <th>Air PNR</th>
                    <th>E-ticket</th>
                    <th>Class</th>
                    <th>Cabin</th>
                    <th>Fare</th>
                    <th>B.Fare</th>
                    <th>Taxes</th>
                    <th>Total</th>
                </tr>
                <?php
                $this->renderPartial('/airCart/_airbookingrow', ['airBooking' => $airBooking, 'print' => true]);
                $cartFare += $airBooking->basic_fare;
                $cartTaxes += $airBooking->taxesOnly;
                $cartServiceTax += $airBooking->service_tax;
                $cartFees += $airBooking->booking_fee;
                $extraAirBookings = AirBooking::model()->findAllByAttributes([
                    'air_cart_id' => $airBooking->air_cart_id,
                    'carrier_id' => $airBooking->carrier_id,
                    'source_id' => $airBooking->source_id,
                    'destination_id' => $airBooking->destination_id,
                    'departure_ts' => $airBooking->departure_ts,
                    'arrival_ts' => $airBooking->arrival_ts,
                        ], 'id<>:id', [':id' => $airBooking->id]);
                foreach ($extraAirBookings as $value) {
                    $this->renderPartial('/airCart/_airbookingrow', ['airBooking' => $value, 'print' => true]);
                    $cartFare += $value->basic_fare;
                    $cartTaxes += $value->taxesOnly;
                    $cartServiceTax += $value->service_tax;
                    $cartFees += $value->booking_fee;
                }
                ?>
            </table>
            <?php
        }
    }
    ?>
    <div class="row">
        <label class="full">Cart Price Calculation</label>
    </div>
    <div class="row big">
        <label>Payment</label>
        <span>:</span>
        <?php echo $model->paymentStatus->name; ?>
    </div>
    <div class="row big">
        <label>Base Price</label>
        <span>:</span>
        <?php echo $cartFare . ' ' . $model->user->userInfo->currency->code; ?>
    </div>
    <div class="row big">
        <label>Airline Taxes and Fees</label>
        <span>: </span>
        <?php echo $cartTaxes . ' ' . $model->user->userInfo->currency->code; ?>
    </div>
    <div class="row big">
        <label>Service Tax</label>
        <span>:</span>
        <?php echo $cartServiceTax . ' ' . $model->user->userInfo->currency->code; ?>
    </div>
    <div class="row big">
        <label>Fee</label>
        <span>:</span>
        <?php echo $cartFees . ' ' . $model->user->userInfo->currency->code; ?>
    </div>
    <div class="row big">
        <label>Total Price</label>
        <span>:</span>
        <?php echo number_format($cartFare + $cartTaxes + $cartServiceTax + $cartFees) . ' ' . $model->user->userInfo->currency->code . ' (' . ucwords(Utils::numberToWords($cartFare + $cartTaxes)) . ')'; ?>
    </div>
    <div class="row">
        <label class="full">Contact Details</label>
    </div>
    <div class="row big block">
        <label style="height: 120px;">Customer Care</label>
        <div style="float: left;">
            <span>:</span>
            <?php if ($model->user->userInfo->user_type_id == UserType::clientB2C): ?>
                <?php $ui = $model->user->userInfo; $traveler = $model->airBookings[0]->traveler; ?>
                <b><?php echo $ui->name; ?></b><br><br>
                <b>Email:</b> <?php echo $traveler->email ? $traveler->email : $ui->email; ?><br>
                <b>Phone:</b> <?php echo $traveler->phone ? $traveler->phone : $ui->mobile; ?><br><br>
                <b>Address:</b>
                <?php echo $ui->address; ?><br>
                <?php echo $ui->city->name, ' &ndash; ', $ui->pincode; ?><br>
                <?php echo $ui->city->state->name, $ui->city->state->country->name; ?><br>
            <?php else: ?>
                <?php echo $model->user->userInfo->getCustomerCareInfo(); ?>
            <?php endif; ?>
        </div>
        <div style="clear: both;"></div>
    </div>
    <?php
    $carriers = Carrier::model()->findAllBySql('
                SELECT DISTINCT carrier.* FROM carrier
                JOIN air_routes ON (air_routes.carrier_id=carrier.id)
                JOIN air_booking ON (air_booking.id = air_routes.air_booking_id)
                JOIN air_cart ON (air_cart.id=air_booking.air_cart_id)
                WHERE air_cart.id = :cartId
                ', ['cartId' => $model->id]);
    foreach ($carriers as $carrier) {
        ?>
        <div class="row big block">
            <label style="height: 40px;">Airline</label>
            <span>:</span>
            <b style="text-decoration: underline;"><?php echo $carrier->name; ?></b><br>
            <br>
            <b>Helpline:</b> <?php echo $carrier->getHelpLine(); ?><br>
            <div style="clear: both;"></div>
        </div>
    <?php } ?>
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
