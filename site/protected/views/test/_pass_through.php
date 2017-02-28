<?php

//$testUserId = 585;
//
//$carrier = \Carrier::model()->findByAttributes(['code' => 'T6']);
//$cc = $carrier->getCcPasstru($testUserId);
//if ($cc) {
//    echo \Utils::dbg($cc->attributes);
//} else {
//    echo \Utils::dbg("No pass through found");
//}

\Process::abandonOldProcesses();

//$airSource = \AirSource::model()->findByPk(application\components\Galileo\Utils::DEFAULT_GALILEO_TEST_ID);
//$rcs = \RoutesCache::model()->findAll(['limit' => 500, 'order' => 'id']);
//foreach ($rcs as $rc) {
//    $res = $airSource->getCc($testUserId, $rc);
//    if ($res !== null && empty($usedCarriers[$rc->carrier_id])) {
//        $usedCarriers[$rc->carrier_id] = true;
//        echo \Utils::dbg([
//            'carrier' => \Carrier::getCodeFromId($rc->carrier_id),
//            'cc' => $res,
//        ]);
//    }
//}


