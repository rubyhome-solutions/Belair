<?php

$pgl = PayGateLog::model()->findByPk(139);
$zooz = new application\components\PGs\Zooz\Zooz($pgl, 123);
$res = $zooz->authorize();
//$res = $zooz->getPaymentMethods();
//echo \Utils::dbg($zooz);

