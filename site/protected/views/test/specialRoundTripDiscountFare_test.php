<?php
$rcs = \RoutesCache::model()->findAllByAttributes(['air_source_id' => [8,35,29,30,31,28,33,24,32,34]]);
/* @var $rcs \RoutesCache[] */
$i=1;
foreach ($rcs as $rc) {
    if ($rc->specialRoundTripDiscountFare()) {
        echo "<p>$i.\t{$rc->airSource->name},\t$rc->fare_basis</p>";
        $i++;
    }
}