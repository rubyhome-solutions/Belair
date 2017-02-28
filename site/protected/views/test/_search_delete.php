<?php

//$log = \Yii::app()->getComponent('log', false);
//echo \Utils::dbg($log);
//Yii::app()->end();
//$log->setRoutes([
//    [
//        'class' => 'ext.yii-debug-toolbar.YiiDebugToolbarRoute',
//        // Access is restricted by default to the localhost
//        'ipFilters' => array('127.0.0.1', '192.168.1.*'),
//    ]
//        ]
//);
//echo \Utils::dbg(\Yii::app()->getComponent('log', false));
//Yii::app()->end();



$search = \Searches::model()->find();
echo \Utils::dbg($search->attributes);
echo \Utils::dbg($search->deleteOld());
