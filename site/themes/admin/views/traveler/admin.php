<?php

/* @var $this TravelerController */
/* @var $model Traveler */


$this->breadcrumbs = array(
    'Travelers' => array('admin'),
    'Manage',
);

$this->renderPartial('_search', array('model' => $model));
echo "<div class='ibox-content'>";
//echo CHtml::link('Register new traveler', '/traveler/create', array('class' => 'btn btn-primary', 'style'=>'margin-left: 2%;'));
$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'traveler-grid',
    'dataProvider' => $model->search(),
    'type' => array(TbHtml::GRID_TYPE_BORDERED),
    'columns' => array(
        array('name' => 'travelerTitle.name', 'header' => 'Title'),
        'first_name',
        'last_name',
        'email',
        'mobile',
        array('name' => 'userInfo.name', 'header' => 'Company'),
        array('name' => 'passportCountry.name', 'header' => 'Country'),
        'passport_expiry',
        /*
          'birthdate',
          'passport_number',
          'passport_issue',
          'passport_place',
          'pincode',
          'address',
          'phone',
          'email2',
          'frequent_flier',
         */
        array(
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{update} {delete}',
        ),
   
    ),
));
 echo "</div>";
?>