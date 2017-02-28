<?php

use \application\components\Cluster;

echo Cluster::test();
echo "Load distribution from 900 calls:<br><pre>" . print_r(showLoad(900), true) . "</pre>";

//echo "Adding 2 slaves 1.2.3.4 and 127.0.0.1<br>";
//echo '<pre>' . Cluster::addSlave('1.2.3.4') . '</pre>';
//echo '<pre>' . Cluster::addSlave() . '</pre>';
//echo Cluster::test();
//echo "Load distribution from 900 calls:<br><pre>" . print_r(showLoad(900), true) . "</pre>";
//
//echo "Deactivation the slave 1.2.3.4<br>";
//echo Cluster::deactivateSlave('1.2.3.4');
//echo Cluster::deactivateSlave('127.0.0.1');
//echo Cluster::test();
//echo "Load distribution from 900 calls:<br><pre>" . print_r(showLoad(900), true) . "</pre>";

function showLoad($count = 1000) {
    $loadDistribution = [];
    for ($i = 0; $i < $count; $i++) {
        $ip = Cluster::distributeLoad() ? : 'Master';
        if (!isset($loadDistribution[$ip])) {
            $loadDistribution[$ip] = 1;
        } else {
            $loadDistribution[$ip] ++;
        }
    }
    return $loadDistribution;
}
?>
<style>
    .table td {text-align: left !important}
</style>