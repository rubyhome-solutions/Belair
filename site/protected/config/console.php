<?php

// This is the configuration for yiic console application.
// Any writable CConsoleApplication properties can be configured here.
return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'BelAir console',
    // preloading 'log' component
    'preload' => array('log'),
    // autoloading model and component classes
    'import' => array(
        'application.models.*',
        'application.components.*',
        'ext.ECCvalidator2.ECCValidator2',
    ),
    // application components
    'components' => array(
        'session' => array(
            'timeout' => 1800,
            'sessionName' => 'BelAirSESSID',
        ),
        'assetManager' => array(
            'class' => 'CAssetManager',
            'basePath' => realpath(__DIR__ . '/../../assets'),
            'baseUrl' => '/assets',
        ),
        'db' => include __DIR__ . '/database.php',
        'cache' => include __DIR__ . '/cache.php',
        'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning, info',
                    'enabled' => true,
                    'maxFileSize' => 10240,  // 10MB
                ),
                // Log the queries
//                [
//                    'class' => 'CFileLogRoute',
//                    'categories' => 'system.db.*',
//                    'logFile' => 'sql.log',
//                ],
            ),
        ),
    ),
);
