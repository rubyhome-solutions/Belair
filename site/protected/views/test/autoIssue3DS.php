<?php

\Utils::setActiveUserAndCompany(3);
echo \Utils::dbg('ActiveCompanyId: ' . \Utils::getActiveCompanyId());
echo \Utils::dbg('AutoIssue: ' . var_export(\PayGateLog::autoIssueFlag(), true));
$key = \PayGateLog::STOP_THE_AUTO_TICKET . ':' . \Utils::getActiveCompanyId();
echo \Utils::dbg('cacheKey value: ' . var_export(\Yii::app()->cache->get($key), true));
echo \Utils::dbg('Logged user ID: ' . var_export(\Utils::getLoggedUserId(), true));
//\Yii::app()->cache->add($key, \PayGateLog::NO3DS);
//echo \Utils::dbg('AutoIssue: ' . var_export(\PayGateLog::autoIssueFlag(), true));
//\Yii::app()->cache->delete($key);
//echo \Utils::dbg(\Yii::app()->cache->get($key));