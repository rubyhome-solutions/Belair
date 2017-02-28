<?php

/* @var $this AirSourceController */
/* @var $model AirSource */

$this->breadcrumbs = array(
    'Airport' => array('airport'),
    'Create',
);
echo "<p style='max-width:84%' class='well well-small alert-info'>&nbsp;&nbsp;<span style='vertical-align:super;'>&nbsp;&nbsp;&nbsp;Create new Airport</span></p>";
$this->renderPartial('_airport_form', array('model' => $model));
?>
