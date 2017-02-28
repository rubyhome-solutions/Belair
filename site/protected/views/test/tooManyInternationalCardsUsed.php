<?php

$pgls = \PayGateLog::model()->findAll([
    'limit' => 100,
    'order' => 'id DESC'
        ]);

foreach ($pgls as $pgl) {
    $out[] = [
        'id' => $pgl->id,
        'cart' => $pgl->air_cart_id,
        'tooManyInternationalCardsUsed' => var_export($pgl->tooManyInternationalCardsUsed(), true),
    ];
}

echo \Utils::arr2table($out);