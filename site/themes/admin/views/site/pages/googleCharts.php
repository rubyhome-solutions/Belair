<div class="row">
    <div class="col-lg-12" >
        <div class="ibox float-e-margins">
    <div class="ibox-title box_col">
                        <h5>Platform</h5>
                        
                    </div>
            <?php
        if (function_exists('sys_getloadavg')) {
            $cpuLoad = sys_getloadavg();
            $drv = '/';
        } else {    // Windows
            $cpuLoad[0] = 7;
            $drv = 'E:';
        }
        $procInfo = \Yii::app()->db->createCommand('SELECT COUNT(*) FROM process WHERE result IS NULL AND started IS NOT NULL;')->queryRow(false);
        $pgProc = \Yii::app()->db->createCommand('SELECT count(*) FROM pg_stat_activity WHERE datname=\'belair_db\';')->queryRow(false);
        $this->widget('ext.Hzl.google.HzlVisualizationChart', ['visualization' => 'Gauge', 'packages' => 'gauge',
            'data' => [
                ['Label', 'Value'],
                ['Memory', \Utils::getServerMemoryUsage()],
                ['CPU', $cpuLoad[0]],
                ['HDD', round(100 * (1 - disk_free_space($drv) / disk_total_space($drv)))],
                ['Processes', round(100 * $procInfo[0] / \Process::MAX_RUNNING_PROCESSES)],
                ['PG queries', $pgProc[0]],
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
    </div>
</div>
<div class="row">
<div class="col-lg-6">
     <div class="ibox float-e-margins" id="hide_search">
                    <div class="ibox-title box_co2">
                        <h5>Platform clients balance &amp; credit totals</h5>
                        
                    </div>
                    <div class="ibox-content table-full">
   <?php
        $data = \Yii::app()->db->createCommand('SELECT user_type.name AS "Client type", to_char(round(sum(balance)),\'999,999,999\') AS "Balance", to_char(round(sum(credit_limit)),\'999,999,999\') AS "Credit" FROM user_info t '
                        . 'JOIN user_type ON t.user_type_id=user_type.id '
                        . "WHERE leading_char not in ('S', 'B') GROUP BY 1;")
                ->queryAll();
        //echo "<span class='label'>Platform clients balance &amp; credit totals</span>";
        echo \Utils::arr2table($data);
        ?>
    </div>
         </div>
        </div>
</div>  
        
            <?php
//very useful google chart
//            $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'PieChart',
//                'data' => array(
//                    array('Task', 'Parts'),
//                    array('Domestic', 11),
//                    array('Scrappers', 2),
//                    array('Cache', 2),
//                    array('LLCs', 2),
//                    array('International', 7)
//                ),
//                'options' => array('title' => 'Sales distribution')));
//            
            ?>
       
        
            <?php
//            $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'LineChart',
//                'data' => array(
//                    array('Task', 'Parts'),
//                    array('Domestic', 11),
//                    array('Scrappers', 2),
//                    array('Cache', 2),
//                    array('LLCs', 2),
//                    array('International', 7)
//                ),
//                'options' => array('title' => 'Sales distribution')));
//            
            ?>
        
   



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
   