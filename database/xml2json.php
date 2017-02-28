<?php

$test = null;

$test .= "Something\n";
echo $test;

exit;
$array1 = array (1,2,3);
// $array2 = array (1,2,4,5);
$array2 = [];
 
$Result = array_diff( $array1, $array2);
 
print_r($Result);
 



exit;
$str = '<flightsearchrequest>
            <credentials>
                <username>skyscannerlive</username>
                <password>skylive1111</password>
                <officeid>SKYLIVE</officeid>
            </credentials>
            <origin>DEL</origin>
            <destination>BOM</destination>
            <onwarddate>2015-06-18</onwarddate>
            
            <numadults>1</numadults>
            <numchildren>0</numchildren>
            <numinfants>0</numinfants>
            <journeytype>OneWay</journeytype>
            <prefclass>E</prefclass>
            <requestformat>XML</requestformat>
            <resultformat>XML</resultformat>
            <searchtype>Normal</searchtype>
            <sortkey>default</sortkey>
            <numresults>25</numresults>
            <actionname>FLIGHTSEARCH</actionname>
            <preddeptimewindow/>
            <prefarrtimewindow/>
            <prefcarrier>All</prefcarrier>
            <excludecarriers/>
        </flightsearchrequest>';

$xml = simplexml_load_string($str);
$json = json_encode($xml);
echo $json . "\n";
		
?>