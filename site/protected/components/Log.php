<?php

namespace application\components;

/**
 * Logger class to log msgs into log file
 *
 * @author Boxx
 */
class Log {

    public $logFile;

    const LEVEL_INFO = 1;
    const LEVEL_WARNING = 2;

    function __construct() {
        if (PHP_OS == 'Linux') {
            $this->logFile = '/var/log/belair.log';
        } else {
            $this->logFile = \Yii::app()->runtimePath . '\\belair.log';
        }
        if (!file_exists($this->logFile)) {
            if (!touch($this->logFile)) {
                throw new Exception("Can't create the log file. Check the permissions.");
            }
        }
    }

    function log($msg, $level = self::LEVEL_INFO) {
        if (YII_DEBUG) {     // Log all in debug mode
            file_put_contents($this->logFile, date(DATETIME_FORMAT) . ":  $msg \n", FILE_APPEND);
        } elseif ($level <> self::LEVEL_INFO) {     // Do not log the info msgs 
            file_put_contents($this->logFile, date(DATETIME_FORMAT) . ":  $msg \n", FILE_APPEND);
        }
    }

}
