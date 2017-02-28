<?php

$airCart = \AirCart::model()->findByPk(Yii::app()->request->getQuery('ac'));
if ($airCart) {
    $commercialPlan = \CommercialPlan::findB2cPlan();
    foreach ($airCart->airBookings as $ab) {
        $ab->commercial_rule_id = null;
        $ab->commercial_total_efect = 0;
        echo \Utils::dbg(['Before' => $ab->attributes]);
        $commercialPlan->applyPlan($ab, $airCart->client_source_id);
        echo \Utils::dbg(['After' => $ab->attributes]);
    }
} else {
    echo 'AirCart not found<br><br>';
}