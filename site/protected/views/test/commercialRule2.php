<?php

$airCart = \AirCart::model()->findByPk(Yii::app()->request->getQuery('ac'));
if ($airCart) {
    $commercialPlan = \CommercialPlan::findB2cPlan();
    foreach ($airCart->airBookings as $ab) {
//        $ab->commercial_rule_id = null;
//        $ab->commercial_total_efect = 0;
        $rules = \Yii::app()->db->createCommand()->select('id')->from('commercial_rule')
                        ->join('commercial_x_rule', 'commercial_x_rule.rule_id = commercial_rule.id')
                        ->where('commercial_x_rule.plan_id=:planID AND '
                                . '(commercial_rule.air_source_id=:airSourceID OR commercial_rule.air_source_id IS NULL) AND '
                                . '(commercial_rule.carrier_id=:carrierID OR commercial_rule.carrier_id IS NULL) AND '
                                . '(commercial_rule.service_type_id=:serviceTypeID OR commercial_rule.service_type_id IS NULL) AND '
                                . '(commercial_rule.client_source_id=:clientSourceID OR commercial_rule.client_source_id IS NULL)', [
                            ':planID' => $commercialPlan->id,
                            ':airSourceID' => $ab->air_source_id,
                            ':carrierID' => $ab->carrier_id,
                            ':serviceTypeID' => $ab->service_type_id,
                            ':clientSourceID' => $airCart->client_source_id,
                        ])->order('carrier_id, client_source_id, service_type_id, air_source_id, order_')->queryAll();

        echo \Utils::dbg(['Rules' => $rules]);
        foreach ($rules as $row) {
            $rule = \CommercialRule::model()->findByPk($row['id']);
            /* @var $rule \CommercialRule */
            $filter = new \CommercialFilter($rule->filter);
            if ($filter->matchAirBooking($ab)) {
                echo \Utils::dbg(['Matching rule' => $row]);
                // Exit once the rule is applyed
                return;
            }
        }
    }
} else {
    echo 'AirCart not found<br><br>';
}
