<?php /* @var $this ProcessController */ ?>
<div class="row">
<div class="col-md-6">
<div class="ibox-title  box_co2">
                        <h5>APIs health in the last 24 hours</h5>
                        
                    </div>
<div class="ibox-content ibox table-full">
    <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT air_source."name" AS "API", CASE process."result" WHEN 0 THEN \'OK\' ELSE \'Fail\' END AS "Result", COUNT(process.id) AS "Count" FROM process '
                    . "JOIN air_source ON air_source.id=process.air_source_id "
                    . "WHERE process.queued + interval '24 hour' > 'now' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
   // echo "<span class='label'>APIs health in the last 24 hours</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['API' => '---', 'Result' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
    </div>

<div class="col-md-6">
    <div class="ibox-title box_co2">
                        <h5>APIs health for today</h5>
                        
                    </div>
<div class="ibox-content ibox table-full">
    <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT air_source."name" AS "API", CASE process."result" WHEN 0 THEN \'OK\' ELSE \'Fail\' END AS "Result", COUNT(process.id) AS "Count" FROM process '
                    . "JOIN air_source ON air_source.id=process.air_source_id "
                    . "WHERE process.queued >= 'today' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
    //echo "<span class='label'>APIs health for today</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['API' => '---', 'Result' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
    </div>
</div>
<div class="row">
<div class="col-md-6">
    <div class="ibox-title box_co2">
                        <h5>APIs health in the last 1 hour</h5>
                        
                    </div>
<div class="ibox-content ibox table-full">
    <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT air_source."name" AS "API", CASE process."result" WHEN 0 THEN \'OK\' ELSE \'Fail\' END AS "Result", COUNT(process.id) AS "Count" FROM process '
                    . "JOIN air_source ON air_source.id=process.air_source_id "
                    . "WHERE process.queued + interval '1 hour' > 'now' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
   // echo "<span class='label'>APIs health in the last 1 hour</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['API' => '---', 'Result' => '---', 'Count' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
    </div>

<div class="col-md-6">
    <div class="ibox-title  box_co2">
                        <h5>APIs health in the last 10 minutes</h5>
                        
                    </div>
<div class="ibox-content ibox table-full">
    <?php
    $countPerTime = \Yii::app()->db->createCommand('SELECT air_source."name" AS "API", CASE process."result" WHEN 0 THEN \'OK\' ELSE \'Fail\' END AS "Result", COUNT(process.id) AS "Count" FROM process '
                    . "JOIN air_source ON air_source.id=process.air_source_id "
                    . "WHERE process.queued + interval '10 minute' > 'now' "
                    . 'GROUP BY 1,2 ORDER BY 1, 3 DESC;')->queryAll();
    //echo "<span class='label'>APIs health in the last 10 minutes</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['API' => '---', 'Result' => '---', 'Count' => 0]];
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