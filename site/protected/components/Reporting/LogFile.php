<?php

namespace application\components\Reporting;

/**
 * Log files inspection
 *
 * @author Tony
 */
class LogFile {

    const APPLICATION_LOG = 'Application log';
    const BELAIR_LOG = 'Processes and deployments log';
    const SUPPORT_COMMAND_LOG = 'Support commands log';
    const DAILY_LOG = 'Daily tasks log';
    const BALANCE_LOG = 'Balance check log';
    const PROXY_LOG = 'Proxy check log';
    const HTTP_ERRORS = 'Http errors';

    public $files = [];
    static $constants = [
        self::BELAIR_LOG => 'BELAIR_LOG_PATH',
        self::DAILY_LOG => 'DAILY_LOG_PATH',
        self::SUPPORT_COMMAND_LOG => 'SUPPORT_COMMAND_LOG_PATH',
        self::BALANCE_LOG => 'BALANCE_LOG_PATH',
        self::PROXY_LOG => 'PROXY_LOG_PATH',
        self::HTTP_ERRORS=> 'HTTP_ERRORS_PATH',
    ];

    public function __construct() {
        $this->files = [
            self::APPLICATION_LOG => \Yii::app()->runtimePath . '/application.log',
            self::BELAIR_LOG => defined('BELAIR_LOG_PATH') ? BELAIR_LOG_PATH : '/var/log/belair.log',
            self::DAILY_LOG => defined('DAILY_LOG_PATH') ? DAILY_LOG_PATH : '/var/log/belair_daily.log',
            self::SUPPORT_COMMAND_LOG => defined('SUPPORT_COMMAND_LOG_PATH') ? SUPPORT_COMMAND_LOG_PATH : '/var/log/support_command.log',
            self::BALANCE_LOG => defined('BALANCE_LOG_PATH') ? BALANCE_LOG_PATH : '/var/log/llc_sites/balance_check.log',
//            self::PROXY_LOG => defined('PROXY_LOG_PATH') ? PROXY_LOG_PATH : '/var/log/llc_sites/proxy_check.log',
            self::HTTP_ERRORS => defined('HTTP_ERRORS_PATH') ? HTTP_ERRORS_PATH : '/var/log/apache2/error.log',
        ];
    }

}
