<?php

set_time_limit(180); // run for 3 min max

/**
 * Queue commands
 */
class FillCacheCommand extends CConsoleCommand {

    private $start_timer;
    private $lockFile;
    private $txtHelp = [
        "API search utility usage:",
        "fill              - start search and cache fill",
    ];

    /**
     * Description of the sector that we are searching
     * @var array
     */
    public static $sectors = [
        [
            'source' => 'DEL',
            'destination' => 'BOM',
            'depart' => '2015-02-23',
            'adults' => 1,
            'category' => \CabinType::ECONOMY,
        ],
        [
            'source' => 'DEL',
            'destination' => 'BOM',
            'depart' => '2015-03-02',
            'adults' => 1,
            'category' => \CabinType::ECONOMY,
        ],
    ];

    /**
     * Make sure that no other instance of the same command is started
     */
    function singleInstance() {
        if (file_exists($this->lockFile)) {
            echo __METHOD__ . " The search task is already started. Can not start it again.";
            Yii::app()->end(1);
        }
        touch($this->lockFile);
        register_shutdown_function('unlink', $this->lockFile);
    }

    /**
     * Goair search
     */
    function fill($params) {
        echo "Starting " . __METHOD__ . PHP_EOL;
        $this->singleInstance();

        $airSourceIds = [\application\components\Amadeus\Utils::DEFAULT_AIRSOURCES_PRODUCTION_ID];
        \Yii::import('application.models.forms.BookingSearchForm');
        foreach (self::$sectors as $sector) {
            if (time() > strtotime($sector['depart'])) {
                continue;   // Skip the expired sector searches
            }
            $bsf = new BookingSearchForm;
            $bsf->attributes = $sector;
            $bsf->source = \Airport::getIdFromCode($bsf->source);
            $bsf->destination = \Airport::getIdFromCode($bsf->destination);
            $search = \Searches::populate($bsf, true, $airSourceIds);
            $search->waitVisibleAirSourcesToDeliver(60);
            $arrRcs = $search->getBestPricedMatchesOneWay(1000);
            $created = date('Y-m-d H:i');
            $inserted = 0;
            foreach ($arrRcs as $journeys) {
                foreach ($journeys as $journey) {
                    foreach ($journey as $rc) {
//                    print_r($rc);
                        $sql = "insert into rc_transform_log (rc_id, hash_str, total_fare, created) values (:rc_id, :hash_str, :total_fare, :created)";
                        $parameters = [
                            ":rc_id" => $rc->id,
                            ":hash_str" => $rc->hash_str,
                            ":total_fare" => $rc->total_fare,
                            ':created' => $created
                        ];
                        Yii::app()->db->createCommand($sql)->execute($parameters);
                        $inserted++;
                    }
                }
            }
            echo implode(',', $sector) . "\tInserted: $inserted\n";
        }

//        $parmas = json_decode($params);
//        print_r($parmas, true);
//        sleep(10);
    }

    function run($args) {
        if (empty($args) || !method_exists(__CLASS__, $args[0])) {
            echo "\n" . implode("\n\t", $this->txtHelp) . "\n";
            Yii::app()->end();
        }
        $this->start_timer = microtime(true);
        $this->lockFile = Yii::app()->basePath . DIRECTORY_SEPARATOR . 'runtime' . DIRECTORY_SEPARATOR . 'cache_fill_task.lock';


        $this->{$args[0]}(isset($args[1]) ? $args[1] : null);
        echo $this->footer(implode(' ', $args));
    }

    static function memoryUsage() {
        return round(memory_get_peak_usage(true) / 1048576, 2) . "MB";
    }

    function footer($params = '') {
        return "End: " . __CLASS__ . "::{$params} , Time used: " . round((microtime(true) - $this->start_timer), 2) . " sec. , Memory used: " . self::memoryUsage() . "\n";
    }

}

?>
