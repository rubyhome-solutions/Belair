<?php /* @var $this ProcessController */ ?>
<div class="row">
<div class="col-md-6">
<div class="ibox-title box_co3">
                        <h5>PGs health</h5>
                        
                    </div>
<div class="ibox-content table-full ibox">  
  <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT payment_gateway."name" AS "PG", tr_status."name" AS "Status", COUNT(*) AS "Count" FROM pay_gate_log '
                    . "JOIN payment_gateway ON payment_gateway.id=pay_gate_log.pg_id "
                    . "JOIN tr_status ON tr_status.id=pay_gate_log.status_id "
                    . "WHERE pay_gate_log.updated + interval '24 hour' > 'now' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
    //echo "<span class='label'>PGs health in the last 24 hours</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['PG' => '---', 'Status' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
</div>
<div class="col-md-6">
<div class="ibox-title box_co3">
                        <h5>PGs health for today</h5>
                        
                    </div>
<div class="ibox-content table-full"> 
    <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT payment_gateway."name" AS "PG", tr_status."name" AS "Status", COUNT(*) AS "Count" FROM pay_gate_log '
                    . "JOIN payment_gateway ON payment_gateway.id=pay_gate_log.pg_id "
                    . "JOIN tr_status ON tr_status.id=pay_gate_log.status_id "
                    . "WHERE pay_gate_log.updated >= 'today' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
    //echo "<span class='label'>PGs health for today</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['PG' => '---', 'Status' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
    </div>
</div>

<div class="row">
<div class="col-md-6">
<div class="ibox-title box_co3">
                        <h5>PGs health in the last 1 hour</h5>
                        
                    </div>
<div class="ibox-content table-full">  
   <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT payment_gateway."name" AS "PG", tr_status."name" AS "Status", COUNT(*) AS "Count" FROM pay_gate_log '
                    . "JOIN payment_gateway ON payment_gateway.id=pay_gate_log.pg_id "
                    . "JOIN tr_status ON tr_status.id=pay_gate_log.status_id "
                    . "WHERE pay_gate_log.updated + interval '1 hour' > 'now' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
    //echo "<span class='label'>PGs health in the last 1 hour</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['PG' => '---', 'Status' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
    </div>

<div class="col-md-6">
<div class="ibox-title box_co3">
                        <h5>PGs health in the last 10 minutes</h5>
                        
                    </div>
<div class="ibox-content table-full">
    <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT payment_gateway."name" AS "PG", tr_status."name" AS "Status", COUNT(*) AS "Count" FROM pay_gate_log '
                    . "JOIN payment_gateway ON payment_gateway.id=pay_gate_log.pg_id "
                    . "JOIN tr_status ON tr_status.id=pay_gate_log.status_id "
                    . "WHERE pay_gate_log.updated + interval '10 minutes' > 'now' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
    //echo "<span class='label'>PGs health in the last 10 minutes</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['PG' => '---', 'Status' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
</div>
</div>
<div class="clearfix"></div>
<style>
    span.label {font-size: inherit}
    div.pull-left>table {margin: auto}
</style>