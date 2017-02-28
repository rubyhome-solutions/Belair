<?php

/* @var $this UsersController */
/* @var $dataProvider CActiveDataProvider */

$this->breadcrumbs = array(
    'Users',
);

$this->widget('bootstrap.widgets.TbListView', array(
//$this->widget('zii.widgets.CListView', array(
    'dataProvider' => $dataProvider,
//    'itemsTagName' => 'table',
    'itemView' => '_view',
    'emptyText' => '-',
));
?>