<?php

Yii::setPathOfAlias('b2c', realpath(__DIR__ . '/../modules/b2c'));
// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');
// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'BelAir',
    // path aliases
    'aliases' => array(
        'bootstrap' => realpath(__DIR__ . '/../extensions/bootstrap'), // change this if necessary
    ),
    // preloading 'log' component
    'preload' => array('log'),
    // autoloading model and component classes
    'import' => array(
        'application.models.*',
        'application.components.*',
        'bootstrap.helpers.*',
        'bootstrap.widgets.*',
        'bootstrap.behaviors.*',
        'ext.ECCvalidator2.ECCValidator2',
    ),
//    'theme' => 'b2c',
    'modules' => array(
        // uncomment the following to enable the Gii tool
        'gii' => array(
            'class' => 'system.gii.GiiModule',
            'password' => 'ali',
            // If removed, Gii defaults to localhost only. Edit carefully to taste.
            'ipFilters' => array('127.0.0.1', '::1'),
            'generatorPaths' => array('bootstrap.gii'),
        ),
        'BootstrapTransfer',
        'b2c' => array(
            'class' => '\b2c\B2cModule'
        )
    ),
    // application components
    'components' => array(
        'session' => array(
            'timeout' => 1800,
            'sessionName' => 'BelAirSESSID',
            'cookieParams' => [
                'httponly' => true,
                'secure' => YII_DEBUG ? false : true
            ],
            'autoStart' => false,
        ),
        'user' => array(
            // enable cookie-based authentication
            'allowAutoLogin' => false,
            'loginUrl' => array('site/index'),
            'autoRenewCookie' => true,
        ),
        'bootstrap' => array(
            'class' => 'bootstrap.components.TbApi',
        ),
        // uncomment the following to enable URLs in path-format
        'urlManager' => array(
            'urlFormat' => 'path',
            'rules' => array(
                'flights/booking/<id:\w+>' => 'booking/booking',
                'flights/booking' => 'booking/booking',
                'flights' => 'booking/search',
                'screenshot-for-<sname:\w+>' => 'airCart/screenshot',
                '<controller:\w+>/<id:\d+>' => '<controller>/view',
                '<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
                '<controller:\w+>/<action:\w+>' => '<controller>/<action>',
                '<module:\w+>/<controller:\w+>/<id:\d+>' => '<module>/<controller>/view',
                '<module:\w+>/<controller:\w+>/<action:\w+>/<id:\d+>' => '<module>/<controller>/<action>',
                '<module:\w+>/<controller:\w+>/<action:\w+>' => '<module>/<controller>/<action>',
            ),
            'showScriptName' => false,
        ),
//		'db'=>array(
//			'connectionString' => 'sqlite:'.dirname(__FILE__).'/../data/testdrive.db',
//		),
        'db' => include __DIR__ . '/database.php',
        'cache' => include __DIR__ . '/cache.php',
        'errorHandler' => array(
            // use 'site/error' action to display errors
            'errorAction' => 'site/error',
        ),
        'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
//                [
//                    'class' => 'CProfileLogRoute',
//                    'ignoreAjaxInFireBug' => false,
//                    'showInFireBug' => true,
//                    'levels' => 'error, warning, info, profile',
//                    'levels' => 'error, warning, info, profile, trace',
//                    'report' => 'summary',
//                    'enabled' => YII_DEBUG,
//                ],
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning, info',
//                    'levels' => 'error, warning, info, trace',
                    'enabled' => true,
                    'maxFileSize' => 10240, // 10MB
                    'except' => 'exception.b2c\components\B2cException.*'
                ),
                // Log the queries
//                [
//                    'class' => 'CFileLogRoute',
//                    'categories' => 'system.db.*',
//                    'logFile' => 'sql.log',
//                ],
                // uncomment the following to show log messages on web pages
                array(
                    'class' => 'CWebLogRoute',
                    'levels' => 'error, warning, info',
//                    'levels' => 'error, warning, info, trace',
                    'enabled' => YII_DEBUG,
                ),
//                ['class' => 'ext.yii-debug-toolbar.YiiDebugToolbarRoute',
//                    // Access is restricted by default to the localhost
//                    'ipFilters' => array('127.0.0.1', '192.168.1.*'),
//                    'enabled' => YII_DEBUG,
//                ],
            ),
        ),
        'sms' => array('class' => 'Sms'),
        'pdf' => array('class' => 'Pdf'),
    ),
    // application-level parameters that can be accessed
    // using Yii::app()->params['paramName']
    'params' => array(
        // this is used in contact page
        'supportEmail' => 'support2@air.belair.in',
        'adminEmail' => 'support2@air.belair.in',
        'payment_email_config' => include __DIR__ . '/params.php',
    ),
);
