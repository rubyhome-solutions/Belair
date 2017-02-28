<div class="row"> 
    <div class="span5" >  
        <?php
        if (function_exists('sys_getloadavg')) {
            $cpuLoad = sys_getloadavg();
        } else {
            $cpuLoad[0] = 7;
        }
        $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'Gauge', 'packages' => 'gauge',
            'data' => array(
                array('Label', 'Value'),
                array('Memory', \Utils::getServerMemoryUsage()),
                array('CPU', $cpuLoad[0]),
                array('Network', 18),
            ),
            'options' => array(
                'width' => 400,
                'height' => 120,
                'redFrom' => 90,
                'redTo' => 100,
                'yellowFrom' => 75,
                'yellowTo' => 90,
                'minorTicks' => 5
            )
        ));
        ?>
    </div>
    <div class="span5" >
        <?php
        $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'LineChart',
            'data' => array(
                array('Year', 'Sales', 'Expenses'),
                array('2008', 600, 500),
                array('2009', 750, 400),
                array('2010', 900, 600),
                array('2011', 1050, 550),
                array('2012', 1170, 460),
                array('2013', 660, 1120),
                array('2014', 1330, 540),
            ),
            'options' => array(
                'title' => 'Belair Performance',
                'titleTextStyle' => array('color' => '#FF0000'),
                'vAxis' => array(
                    'title' => 'Rs. lakhs',
                    'gridlines' => array(
                        'color' => 'transparent'  //set grid line transparent
                    )),
                'hAxis' => array(
                    'titleTextStyle' => array('color' => '#FF0000'),
//                    'title' => 'Years',
                    'gridlines' => array(
                        'color' => 'transparent'  //set grid line transparent
                    )
                ),
                'curveType' => 'function', //smooth curve or not
                'legend' => array('position' => 'bottom'),
        )));
        ?>
    </div>  
    <div class="row"> 
        <div class="span5" >  
            <?php
//very useful google chart
            $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'PieChart',
                'data' => array(
                    array('Task', 'Parts'),
                    array('Domestic', 11),
                    array('Scrappers', 2),
                    array('Cache', 2),
                    array('LLCs', 2),
                    array('International', 7)
                ),
                'options' => array('title' => 'Sales distribution')));
            ?>

        </div>  
        <div class="span5" >  
            <?php
            $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'LineChart',
                'data' => array(
                    array('Task', 'Parts'),
                    array('Domestic', 11),
                    array('Scrappers', 2),
                    array('Cache', 2),
                    array('LLCs', 2),
                    array('International', 7)
                ),
                'options' => array('title' => 'Sales distribution')));
            ?>

        </div>
    </div>

</div>

<div class="row"> 
    <div class="span9" >  
        <?php
        $this->widget('ext.Hzl.google.HzlVisualizationChart', array('visualization' => 'Map',
            'packages' => 'map', //default is corechart
            'loadVersion' => 1, //default is 1.  As for Calendar, you need change to 1.1
            'data' => array(
                ['Country', 'Population'],
                ['China', 'China: 1,363,800,000'],
                ['India', 'India: 1,242,620,000'],
                ['US', 'US: 317,842,000'],
                ['Indonesia', 'Indonesia: 247,424,598'],
                ['Brazil', 'Brazil: 201,032,714'],
                ['Pakistan', 'Pakistan: 186,134,000'],
                ['Nigeria', 'Nigeria: 173,615,000'],
                ['Bangladesh', 'Bangladesh: 152,518,015'],
                ['Russia', 'Russia: 146,019,512'],
                ['Japan', 'Japan: 127,120,000'],
                ['Bulgaria', 'Bulgaria: 7,120,000']
            ),
            'options' => array('title' => 'Population',
                'showTip' => true,
        )));
        ?>
    </div>
</div>