<?php

/* @var $this AirCartController */
/* @var $model AirCart */

foreach (array_reverse($model->getNotes()) as $k => $v) {
    echo TbHtml::labelTb($k, ['color' => TbHtml::LABEL_COLOR_INFO]);
    echo TbHtml::well($v, ['size' => TbHtml::WELL_SIZE_SMALL, 'style' => 'margin-top:0; margin-left:10px;min-width:200px;padding:3px;']);
}