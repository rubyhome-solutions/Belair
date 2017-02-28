<?php

// change the following paths if necessary
// 
$yii = __DIR__ . '/../../yii-1.1.17.467ff50/framework/yii.php';
$config = __DIR__ . '/protected/config/main.php';

if (file_exists('debug.php')) {
    include 'debug.php';
}

require __DIR__ . '/protected/config/defines.php';

defined('YII_DEBUG') or define('YII_DEBUG', false);
defined('PHP_PATH') or define('PHP_PATH', '/usr/bin/php ');

// specify how many levels of call stack should be shown in each log message
defined('YII_TRACE_LEVEL') or define('YII_TRACE_LEVEL', 3);

// Date & time formats
defined('DATE_FORMAT') or define('DATE_FORMAT', 'Y-m-d');
defined('DATETIME_FORMAT') or define('DATETIME_FORMAT', 'Y-m-d H:i:s');
defined('TICKET_DATETIME_FORMAT') or define('TICKET_DATETIME_FORMAT', 'Y-M-d H:i');

require_once($yii);
Yii::createWebApplication($config)->run();
