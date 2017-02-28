<?php

$allChecks = application\components\Reporting\Statistics::getAvailabilityAndFareCheckCount();
$nonAvailable = application\components\Reporting\Statistics::getAvailabilityAndFareCheckUnavailableCount();
$fareDiff = application\components\Reporting\Statistics::getAvailabilityAndFareCheckFareChangedCount();
$this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
    'data' => [
        ['Type', 'Count'],
        ['Success hit', $allChecks - $nonAvailable - $fareDiff],
        ['Non available', $nonAvailable],
        ['Fare changed', $fareDiff],
    ],
    'options' => ['title' => 'Booking time checks', 'is3D' => true]]);
