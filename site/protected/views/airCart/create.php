<?php

/* @var $this AirCartController */
/* @var $model AirCart */
/* @var $airBookings[] AirBooking */

$this->breadcrumbs = array(
    'Air Carts' => array('admin'),
    'Manual cart',
);

$this->renderPartial('_formmanual', array(
    'model' => $model,
    'airBookings' => $airBookings,
    'legs' => $legs,
    'travelers' => $travelers,
));
?>