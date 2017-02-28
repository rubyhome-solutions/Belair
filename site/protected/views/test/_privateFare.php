<?php

$airSources = AirSource::model()->with('tourCodes')->together()->findAll();
foreach ($airSources as $airSource) {
    /* @var $airSource AirSource */
//    $tc = $airSource->getTourCode('CL');
    $tc = $airSource->getPrivateFare('T6');
    if (!empty($tc)) {
        echo \Utils::dbg($airSource->name);
        echo \Utils::dbg($airSource->tourCodes);
        echo \Utils::dbg($tc);
    }
}


