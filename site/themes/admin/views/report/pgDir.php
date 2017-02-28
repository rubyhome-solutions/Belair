<?php

/* @var $this \ReportController */
/* @var $reports array */

$this->breadcrumbs = ['Reports' => 'reports',
    'PostgreSQL database statistics'
];

$path = \Yii::app()->basePath . "/../../stats/pg";
$d = dir($path);
while (false !== ($entry = $d->read())) {
    if (!in_array($entry, ['.', '..'])) {
        $files[$entry] = filemtime($path . DIRECTORY_SEPARATOR . $entry);
    }
}
$d->close();
asort($files);
foreach ($files as $key => $value) {
    echo TbHtml::link(date(DATETIME_FORMAT, $value) . "&nbsp;&nbsp;&nbsp;" . substr($key, 0, -5), "/report/showPgStat?file=" . urlencode($key), ['target' => '_blank']) . "<br>";
    
}
