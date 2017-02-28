<?php

$xRate = new \XRate;
$currencies = \Currency::model()->findAll(['order' => 'id']);
foreach ($currencies as $currency) {
    /* @var $currency \Currency */
    $out[] = [
        'Code' => $currency->code,
        'Rate' => $currency->rate,
        'INR for 100' => number_format($currency->xChange(100, 1), 2),
        'EUR for 100' => number_format($currency->xChange(100, 3), 2),
    ];
}
echo \Utils::arr2table($out);

