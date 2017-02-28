<?php
\Yii::import('application.commands.SupportCommand');
$res = SupportCommand::clearOldBalances();
echo \Utils::arr2table($res);