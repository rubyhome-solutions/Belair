<?php

$airCartId = 474;
$model = AirCart::model()->cache(120)->findByPk($airCartId);
/* @var $model AirCart */
if ($model === null) {
    echo json_encode(['error' => 'The requested airCart do not exist']);
    Yii::app()->end();
}
if (empty($model->airBookings)) {
    echo json_encode(['error' => 'The requested airCart do not have any bookings']);
    Yii::app()->end();
}
// Permission check
if (!Authorization::getIsStaffLogged() && $model->user->user_info_id != Utils::getActiveCompanyId()) {
    echo json_encode(['error' => 'You do not have authorization to manipulate this airCart']);
    Yii::app()->end();
}
$airBookings = AirBooking::model()->findAllBySql('select distinct air_source_id, crs_pnr from air_booking '
        . 'where air_cart_id = :airCartId', [':airCartId' => $airCartId]);
foreach ($airBookings as $airBooking) {
    /* @var $airBooking \AirBooking */
    echo Utils::dbg([
        'air_source_id' => $airBooking->air_source_id,
        'crs_pnr' => $airBooking->crs_pnr,
    ]);
    if (empty($airBooking->airSource->backend->pnr_resync)) {
        echo "<pre>" . json_encode(['error' => $airBooking->airSource->backend->name . ' do not have resync capability']) . "</pre>";
    } else {
        $result = call_user_func($airBooking->airSource->backend->pnr_resync, $airCartId, $airBooking->air_source_id, $airBooking->crs_pnr);
        echo "<pre>" . json_encode($result, JSON_NUMERIC_CHECK) . "</pre>";
    }
}
//        Utils::dbgYiiLog(var_export($airSource, true));
//}
