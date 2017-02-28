<?php

$files = [
    'pnrObject no via.json',
    'pnrObject single via.json',
    'pnrObject double via.json',
];

foreach ($files as $file) {
    $pnrObj = \Utils::fileToObject(\Yii::app()->runtimePath . DIRECTORY_SEPARATOR . $file);
    foreach (\Utils::toArray($pnrObj->originDestinationDetails->itineraryInfo) as $itineraryInfo) {
        $res = \application\components\Amadeus\Utils::parseTechnicalStops($itineraryInfo->legInfo);
        echo \Utils::dbg([$file => $res]);
    }
}



