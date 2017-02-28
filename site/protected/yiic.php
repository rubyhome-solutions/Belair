<?php

// change the following paths if necessary
$yiic = __DIR__ . '/../../../yii-1.1.17.467ff50/framework/yiic.php';
$config = __DIR__ . '/config/console.php';

if (file_exists(__DIR__ . '/../debug.php')) {
    include __DIR__ . '/../debug.php';
}

defined('YII_DEBUG') or define('YII_DEBUG', false);
defined('PHP_PATH') or define('PHP_PATH', '/usr/bin/php ');

// Date & time formats
defined('DATE_FORMAT') or define('DATE_FORMAT', 'Y-m-d');
defined('DATETIME_FORMAT') or define('DATETIME_FORMAT', 'Y-m-d H:i:s');


require_once($yiic);
