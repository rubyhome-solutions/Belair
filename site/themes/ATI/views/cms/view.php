<?php
if (\Yii::app()->user->hasFlash('msg')) {
    echo \TbHtml::alert(\TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}

echo $content;