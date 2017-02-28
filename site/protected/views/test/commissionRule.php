<?php

$airCart = \AirCart::model()->findByPk(Yii::app()->request->getQuery('ac'));
if ($airCart) {
    foreach ($airCart->airBookings as $ab) {
        $ab->commercial_total_efect = null;
        $before = $ab->profit;
        $ab->calcCommission();
        echo \Utils::dbg("Before: $before \t After: $ab->profit");
    }
} else {
    echo 'AirCart not found. Add <b>ac</b> attribute<br><br>';
}