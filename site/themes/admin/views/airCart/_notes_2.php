<?php

/* @var $this AirCartController */
/* @var $model AirCart */

foreach (array_reverse($model->getNotes()) as $k => $v) {
  //  echo TbHtml::labelTb($k, ['color' => TbHtml::LABEL_COLOR_INFO]);
  //  echo TbHtml::well($v, ['size' => TbHtml::WELL_SIZE_SMALL, 'style' => 'margin-top:0; padding:3px;']);
     echo "<p class='commentline'> <span class='commenttext'>' ".$v." ' : </span><span class='commentby'>". $k . "</span><p>";
    
}