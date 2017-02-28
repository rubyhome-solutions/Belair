<div class="row">
    <div style="float: left" >
        <?php
        if (function_exists('sys_getloadavg')) {
            $cpuLoad = sys_getloadavg();
            $drv = '/';
        } else {    // Windows
            $cpuLoad[0] = 7;
            $drv = 'D:';
        }
        $serverId = \application\components\Cluster::getServerId();
        $procInfo = Yii::app()->db->createCommand("SELECT COUNT(*) FROM process WHERE result IS NULL AND started IS NOT NULL AND server_id={$serverId};")->queryScalar();
        $pgProc = Yii::app()->db->createCommand('SELECT count(*) FROM pg_stat_activity WHERE datname=\'belair_db\';')->queryScalar();
        $maxRunningProcesses = YII_DEBUG ? \Process::MAX_DEBUG_RUNNING_PROCESSES : \application\components\Cluster::getMaxRunningProcesses();
        $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'Gauge', 'packages' => 'gauge',
            'data' => [
                ['Label', 'Value'],
                ['Memory', \Utils::getServerMemoryUsage()],
                ['CPU', $cpuLoad[0]],
                ['HDD', round(100 * (1 - disk_free_space($drv) / disk_total_space($drv)))],
                ['Processes', round(100 * $procInfo / $maxRunningProcesses)],
                ['PG queries', round($pgProc / 10)], // Tuned for 1000 PG sessions
            ],
            'options' => [
                'width' => 850,
//                'height' => 180,
                'yellowFrom' => 80,
                'yellowTo' => 91,
                'redFrom' => 91,
                'redTo' => 100,
                'minorTicks' => 5
            ]
        ]);
        ?>
    </div>
    <div style="font-size: .9em;">
        <?php
        $data = \Yii::app()->db->createCommand('SELECT user_type.name AS "Client type", to_char(round(sum(balance)),\'999,999,999\') AS "Balance", to_char(round(sum(credit_limit)),\'999,999,999\') AS "Credit" FROM user_info t '
                        . 'JOIN user_type ON t.user_type_id=user_type.id '
                        . "WHERE leading_char not in ('S', 'B') GROUP BY 1;")
                ->queryAll();
        echo "<span class='label'>Platform clients balance &amp; credit totals</span>";
        echo \Utils::arr2table($data);
        ?>
    </div>
    <div class="row">
        <?php
        // Get the stats from the DB1 server
        if (!YII_DEBUG) {
            
        }
        ?>
    </div>

</div>

<div class="row">
    <div class="span9" >
        <?php
//        $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'Map',
//            'packages' => 'map', //default is corechart
//            'loadVersion' => 1, //default is 1.  As for Calendar, you need change to 1.1
//            'data' => array(
//                ['Country', 'Population'],
//                ['China', 'China: 1,363,800,000'],
//                ['India', 'India: 1,242,620,000'],
//                ['US', 'US: 317,842,000'],
//                ['Indonesia', 'Indonesia: 247,424,598'],
//                ['Brazil', 'Brazil: 201,032,714'],
//                ['Pakistan', 'Pakistan: 186,134,000'],
//                ['Nigeria', 'Nigeria: 173,615,000'],
//                ['Bangladesh', 'Bangladesh: 152,518,015'],
//                ['Russia', 'Russia: 146,019,512'],
//                ['Japan', 'Japan: 127,120,000'],
//                ['Bulgaria', 'Bulgaria: 7,120,000']
//            ),
//            'options' => array('title' => 'Population',
//                'showTip' => true,
//        )));
        ?>
    </div>
</div>