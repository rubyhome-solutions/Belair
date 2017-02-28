<?php

/* @var $this BinListController */
/* @var $model BinList */

$this->breadcrumbs = array(
    'Bin Lists' => array('admin'),
    " $model->bin" => array('/binList/view/' . $model->bin),
    'Update',
);

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}

$this->renderPartial('_form', array('model' => $model));
?>