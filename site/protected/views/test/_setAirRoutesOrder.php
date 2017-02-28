<?php

$airBooking = \AirBooking::model()->with([
            'airRoutes' => ['order' => '"airRoutes".departure_ts']
        ])->findByPk(\Yii::app()->request->getQuery('abId'));
if (!$airBooking) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, 'Air Booking not found, check the parameter <b>abId</b>');
} else {
    echo "<p class='well well-small alert-info'>Before:&nbsp;<i class='fa fa-plane fa-lg'></i> &nbsp;{$airBooking->serviceType->name}:&nbsp; {$airBooking->source->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " <i class='fa fa-long-arrow-right fa-lg'></i> {$airBooking->destination->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . "</p>";
    $airBooking->setAirRoutesOrder();
    $airBooking->refresh();
    echo "<p class='well well-small alert-info'>After:&nbsp;&nbsp;<i class='fa fa-plane fa-lg'></i> &nbsp;{$airBooking->serviceType->name}:&nbsp; {$airBooking->source->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->departure_ts)) . " <i class='fa fa-long-arrow-right fa-lg'></i> {$airBooking->destination->nameCode} " . date(TICKET_DATETIME_FORMAT, strtotime($airBooking->arrival_ts)) . "</p>";
}