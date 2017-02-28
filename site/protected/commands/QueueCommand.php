<?php

use \application\components\Cluster;

set_time_limit(0); // run indefinetely

/**
 * Queue commands
 */
class QueueCommand extends CConsoleCommand {

    private $start_timer;
    private $log;
    private $lockFile;
    private $txtHelp = [
        "Queue utility usage:",
        "broker             - start the queue broker",
        "worker <processId> - start specific process",
        "kill <pid>         - Kill the process with <pid>",
        "stop <pid>         - Ask the the process with <pid> to stop",
    ];

    function worker($processId) {
        $this->log->log("Starting " . __METHOD__ . " for processId ==> $processId");
        $process = Process::model()->findByPk($processId);
        /* @var $process \Process */
        if ($process === null) {
            $this->log->log(__METHOD__ . " Exiting can't find processId ==> $processId", application\components\Log::LEVEL_WARNING);
            return;
        }
        if ($process->ended !== null) {
            $this->log->log(__METHOD__ . " The process has already finished processId ==> $processId", application\components\Log::LEVEL_WARNING);
            return;
        }
        if ($process->pid !== null) {
            $this->log->log(__METHOD__ . " The process has already been sent to the borker. ProcessId ==> $processId", application\components\Log::LEVEL_WARNING);
            return;
        }
        if (!empty($process->start_at) && strtotime($process->start_at) > time()) {
            $this->log->log(__METHOD__ . " The process can not start ahead of the scheduled time! ProcessId ==> $processId", application\components\Log::LEVEL_WARNING);
            return;
        }
        $airSource = \AirSource::model()->cache(60)->findByPk($process->air_source_id);
        if ($airSource === null) {
            $this->log->log(__METHOD__ . " Exiting can't find airSource=>{$process->air_source_id} ProcessId ==> $processId", application\components\Log::LEVEL_WARNING);
            return;
        }
        $process->pid = getmypid();
        $process->update(['pid']);
        $status = 0;
        // Deal with the API timeouts
        register_shutdown_function([$this, 'shutdown'], $process);
        if (strstr($process->command, '::')) { // This is internal call
            try {
                $output[0] = call_user_func($process->command, $airSource->id, json_decode($process->parameters));
            } catch (Exception $e) {
                $output[0] = $e->getMessage();
            }
        } else {
            $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $process->command;
            $params = [
                'credentials' => [
                    'username' => $airSource->username,
                    'password' => $airSource->password,
                    'timeout' => 60
                ],
                'air_source_id' => $process->air_source_id,
            ];
            $params = array_merge($params, json_decode($process->parameters, true));
//            file_put_contents('params_spicejet.txt', json_encode($params));
//        \Utils::dbgYiiLog("Running: $script\nParams: " . print_r($params, true) . "\n\n");
            unset($output);
            exec(PHP_PATH . "\"$script\" " . str_replace('"', '\"', json_encode($params)) . ' 2>&1', $output, $status);
        }

        if ($status == 0 && isset($output[0])) {     // Normal execution
//            \Utils::dbgYiiLog("Output: " . print_r($output, true));
            $res = json_decode($output[0], true);
            if (!is_array($res)) {  // Not array means error
                $process->result = \Process::RESULT_FAIL;
                $process->note = $output[0];
            } else {
//                \Utils::dbgYiiLog("Result: " . print_r($res, true));
                $process->result = \Process::RESULT_OK;
                $process->note = "Flights found => " . count($res);
                $process->search->addResults($res, $process->air_source_id);
            }
        } else {        // Fail execution
            $process->result = \Process::RESULT_FAIL;
            $process->note = "Empty";
            $this->log->log(__METHOD__ . " Bad search result AirSource=>{$process->air_source_id} Output:\n" . print_r($output, true), application\components\Log::LEVEL_WARNING);
        }
        $process->ended = '"now"';
        $process->time_needed = time() - strtotime($process->started);
        $process->memory = memory_get_peak_usage(true);
        $process->update(['ended', 'time_needed', 'memory', 'result', 'note']);
    }

    /**
     * Main Queue broker
     */
    function broker($param = null) {
        // Check if the lock exists
        if (file_exists($this->lockFile)) {
//            $this->log->log(__METHOD__ . " The queue broker is already started. Can not start it again.", application\components\Log::LEVEL_WARNING);
            Yii::app()->end();
        }
        
        // Decide slave or master
        if (Cluster::decideSlaveOrMaster() !== true) {            
            $this->log->log("The " . __METHOD__ . ' can not start - Slave or master is not definitive. Exiting!');
            Yii::app()->end();
        }
        
        touch($this->lockFile);
        // Delete the lock file when the queue broker process exit
        register_shutdown_function('unlink', $this->lockFile);
        $this->log->log("Starting " . __METHOD__);

        // Server ID
        $serverId = Cluster::getServerId();
        
        $maxRunningProcesses = YII_DEBUG ? \Process::MAX_DEBUG_RUNNING_PROCESSES : Cluster::getMaxRunningProcesses();
        
        do {
            // Abandon the old processes
            \Process::abandonOldProcesses($serverId);
            $processes = \Process::model()->findAll([
                'condition' => "result IS NULL AND started IS NULL AND (start_at IS NULL OR start_at<='now') AND server_id={$serverId}",
                'limit' => $maxRunningProcesses,
                'order' => 'id DESC'
            ]);
            $this->log->log("Processes to run ==> " . count($processes));
            foreach ($processes as $process) {
                do {    // Check how many processes are running. Wait for some to finish if we have more than the allowed number
                    $runningProcesses = \Process::model()
                            ->countBySql("SELECT COUNT(*) FROM process WHERE result IS NULL AND ended IS NULL AND started IS NOT NULL AND server_id={$serverId}");
                    if ($runningProcesses >= $maxRunningProcesses) {
                        sleep(1);   // Wait 1 sec
                    }
                } while ($runningProcesses >= $maxRunningProcesses );
                /* @var $process \Process */
                $script = Yii::app()->basePath . DIRECTORY_SEPARATOR . $process->command;
                $this->log->log("Running: $script\nParams: " . $process->parameters . "\n");
                $process->started = "'now'";
                $process->update(['started']);
                // Start the worker
//                $cmd = 'php "' . Yii::app()->basePath . DIRECTORY_SEPARATOR . 'yiic.php" queue worker ' . $process->id;
//                \Process::backgroundRun($cmd);
                self::httpNonBlockingProcessRun($process->id);
            }
            sleep(1);
        } while (!YII_DEBUG);       // Run continously on the production server
    }

    function run($args) {
        if (empty($args) || !method_exists(__CLASS__, $args[0])) {
            echo "\n" . implode("\n\t", $this->txtHelp) . "\n";
            Yii::app()->end();
        }

        $this->lockFile = self::queueBrokerLockFile();
        $this->start_timer = microtime(true);
        $this->log = new application\components\Log;

        $this->{$args[0]}(isset($args[1]) ? $args[1] : null);
        $this->log->log($this->footer(implode(' ', $args)));
    }

    static function memoryUsage() {
        return round(memory_get_peak_usage(true) / 1048576, 2) . "MB";
    }

    public static function queueBrokerLockFile() {
        return \Yii::app()->runtimePath . DIRECTORY_SEPARATOR . 'queue_broker.lock';
    }

    function footer($params = '') {
        return "End: " . __CLASS__ . "::{$params} , Time used: " . round((microtime(true) - $this->start_timer), 2) . " sec. , Memory used: " . self::memoryUsage() . "\n";
    }

    function shutdown(\Process $process) {
        $err = error_get_last();
        if ($err !== null) {
            $process->ended = '"now"';
            $process->time_needed = time() - strtotime($process->started);
            $process->memory = memory_get_peak_usage(true);
            $process->result = \Process::RESULT_FAIL;
            $process->note = $err['message'];
            $process->update(['ended', 'time_needed', 'memory', 'result', 'note']);
        }
    }

    /**
     * Open the controller to start the worker in non blocking mode. Do not wait for the response
     * @param string $processId 
     */
    static function httpNonBlockingProcessRun($processId) {
        $fp = @stream_socket_client("tcp://127.0.0.1:80", $errno, $errstr, 5, 
                STREAM_CLIENT_CONNECT 
                | STREAM_CLIENT_PERSISTENT
            );
        if (!$fp) {
            throw new CHttpException(500, "$errstr ($errno)");
        } else {
            stream_set_blocking($fp, false);
//            fwrite($fp, "GET / HTTP/1.0\r\nHost: 127.0.0.1\r\nAccept: */*\r\n\r\n");
            fwrite($fp, "GET /site/worker/$processId \r\n\r\n");
//            $content = stream_get_contents($fp);
            fclose($fp);
//            return $content;
        }
    }

}

?>
