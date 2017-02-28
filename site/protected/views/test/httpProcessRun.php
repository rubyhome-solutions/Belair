<?php

\Yii::import('application.commands.QueueCommand');
//$content = \QueueCommand::httpNonBlockingProcessRun(2765);
//echo \Utils::dbg($content);
for ($i = 0; $i < 100; $i++) {
    \QueueCommand::httpNonBlockingProcessRun(2765);
}
echo \Utils::dbg("Queue command httpNonBlockingProcessRun finished executing $i times");