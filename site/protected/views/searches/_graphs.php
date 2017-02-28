<?php /* @var $this SearchesController */ ?>
<div class="pull-left text-center" style="margin-right: 10px; font-size: .9em;">
    <?php
    $countPerTime = Yii::app()->db->createCommand("SELECT client_source.\"name\" AS \"Client source\", COUNT(*) AS \"Count\", SUM(hits) AS \"Hits\" FROM searches "
                    . "JOIN client_source ON client_source.id=searches.client_source_id "
                    . "WHERE created + interval '24 hour' > 'now' "
                    . "GROUP BY 1 ORDER BY 2 DESC;")->queryAll();
    echo "<span class='label'>Searches in the last 24 hours</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['Client source' => '---', 'Count' => 0, 'Hits' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
<div class="pull-left text-center" style="margin-right: 10px; font-size: .9em;">
    <?php
    $countPerTime = Yii::app()->db->createCommand("SELECT client_source.\"name\" AS \"Client source\", COUNT(*) AS \"Count\", SUM(hits) AS \"Hits\"  FROM searches "
                    . "JOIN client_source ON client_source.id=searches.client_source_id "
                    . "WHERE created >= 'today' "
                    . "GROUP BY 1 ORDER BY 2 DESC;")->queryAll();
    echo "<span class='label'>Searches today</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['Client source' => '---', 'Count' => 0, 'Hits' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
<div class="pull-left text-center" style="margin-right: 10px; font-size: .9em;">
    <?php
    $countPerTime = Yii::app()->db->createCommand("SELECT client_source.\"name\" AS \"Client source\", COUNT(*) AS \"Count\", SUM(hits) AS \"Hits\"  FROM searches "
                    . "JOIN client_source ON client_source.id=searches.client_source_id "
                    . "WHERE created + interval '1 hour' > 'now' "
                    . "GROUP BY 1 ORDER BY 2 DESC;")->queryAll();
    echo "<span class='label'>Searches in the last hour</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['Client source' => '---', 'Count' => 0, 'Hits' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
<div class="pull-left text-center" style="margin-right: 10px; font-size: .9em;">
    <?php
    $countPerTime = Yii::app()->db->createCommand("SELECT client_source.\"name\" AS \"Client source\", COUNT(*) AS \"Count\", SUM(hits) AS \"Hits\"  FROM searches "
                    . "JOIN client_source ON client_source.id=searches.client_source_id "
                    . "WHERE created + interval '10 minute' > 'now' "
                    . "GROUP BY 1 ORDER BY 2 DESC;")->queryAll();
    echo "<span class='label'>Searches in the last 10 minutes</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['Client source' => '---', 'Count' => 0, 'Hits' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
<div class="pull-left text-center" style="font-size: .9em;">
    <?php
    $countPerTime = Yii::app()->db->createCommand("SELECT client_source.\"name\" AS \"Client source\", COUNT(*) AS \"Count\", SUM(hits) AS \"Hits\"  FROM searches "
                    . "JOIN client_source ON client_source.id=searches.client_source_id "
                    . "WHERE created + interval '1 minute' > 'now' "
                    . "GROUP BY 1 ORDER BY 2 DESC;")->queryAll();
    echo "<span class='label'>Searches in the last minute</span>";
    if (empty($countPerTime)) {
        $countPerTime = [['Client source' => '---', 'Count' => 0, 'Hits' => 0]];
    }
    echo \Utils::arr2table($countPerTime);
    ?>
</div>
<div class="clearfix"></div>
<!--<div style="float: left">-->
<?php
//    $countPerType = Yii::app()->db->createCommand('SELECT origin || \'-\' || destination, COUNT(*) AS count_ FROM searches '
//                    . 'GROUP BY 1 ORDER BY 2 DESC LIMIT 12')
//            ->queryAll(false);
//    foreach ($countPerType as &$value) {
//        $value[1] = round($value[1]);
//    }
//    $data = array_merge([['Pair', 'Count']], $countPerType);
//    $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
//        'data' => $data,
//        'options' => array('title' => 'Top 12 searches grouped per origin-destination')]);
?>
<!--</div>-->
<div style="float:left;width:33%">
    <?php
    $countPerDaysInAdvance = Yii::app()->db->createCommand('SELECT (date_depart::date - created::date) || \' days\', COUNT(*) AS count_ FROM searches '
                    . 'GROUP BY 1 ORDER BY 2 DESC LIMIT 12')
            ->queryAll(false);
    foreach ($countPerDaysInAdvance as &$value) {
        $value[1] = (int) $value[1];
        if ($value[0][0] === "0") {
            $value[0] = 'Same day';
        }
        if (substr($value[0], 0, 2) === "1 ") {
            $value[0] = 'Next day';
        }
    }
    $countPerDaysInAdvance = array_merge([['Days', 'Count']], $countPerDaysInAdvance);
    //echo \Utils::dbg($countPerDaysInAdvance);
    $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
        'data' => $countPerDaysInAdvance,
        'options' => ['title' => 'Searches per days in advance', 'is3D' => true],
//        'htmlOptions' => ['style' => 'width:30%']
    ]);
    ?>
</div>
<div style="float:left;width:33%">
    <?php
    $countPerType = Yii::app()->db->createCommand('SELECT is_domestic, COUNT(*)::int AS count_ FROM searches '
                    . 'GROUP BY 1 ORDER BY 2 DESC')
            ->queryAll(false);
    foreach ($countPerType as &$value) {
//        $value[1] = round($value[1]);
        $value[0] = \Searches::$isDomestic[$value[0]];
    }
    $countPerType = array_merge([['Type', 'Count']], $countPerType);
    $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
        'data' => $countPerType,
        'options' => ['title' => 'Searches distribution by type', 'is3D' => true],
//        'htmlOptions' => ['style' => 'width:30%']
    ]);
    ?>
</div>
<div style="float:left;width:33%">
    <?php
    $result = Yii::app()->db->createCommand('SELECT sum(hits) as hits, COUNT(*) AS all FROM searches')
            ->queryRow();
    $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'PieChart',
        'data' => [
            ['Type', 'Count'],
            ['All', (int) $result['all']],
            ['Hits', (int) $result['hits']],
        ],
        'options' => ['title' => 'Searches hits', 'is3D' => true],
//        'htmlOptions' => ['style' => 'width:30%']
    ]);
    ?>
</div>
<style>
    span.label {font-size: inherit}
    div.pull-left>table {margin: auto}
</style>