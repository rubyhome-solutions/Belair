<?php

/* @var $this AirSourceController */
/* @var $model AirSource */

$this->breadcrumbs = array(
    'Air Sources' => array('index'),
    'Create',
);
echo "<p style='max-width:84%' class='well well-small alert-info'>&nbsp;&nbsp;<i class='fa fa-cog fa-2x fa-spin'></i><span style='vertical-align:super;'>&nbsp;&nbsp;&nbsp;Create new Air Source</span></p>";
$this->renderPartial('_form', array('model' => $model));
?>