<?php

//session_id('BelAirSESSID');
//session_start();
echo \Utils::dbg(\Yii::app()->user->getState(\Utils::ACTIVE_COMPANY));
echo \Utils::dbg(\Yii::app()->session->sessionID);
echo \Utils::dbg(\Yii::app()->session->sessionName);
echo \Utils::dbg($_SESSION);

?>