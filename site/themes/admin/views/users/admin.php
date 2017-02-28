<?php

/* @var $this UsersController */
/* @var $model Users */


$this->breadcrumbs = array(
    'Users' => array('index')
);

$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'users-grid',
    'type' => TbHtml::GRID_TYPE_STRIPED . ' ' . TbHtml::GRID_TYPE_HOVER,
    'dataProvider' => $model->search(),
//	'filter'=>$model,
    'columns' => array(
//        'id',
        'name',
        'email',
        'mobile',
        array('header' => 'Type', 'value' => '$data->userInfo->userType->name'),
        'enabled',
        'activated',
        'last_login',
        'last_transaction',
        'created',
        'user_info_id',
        'city_id',
    /*
      'deactivated',
      'pincode',
      'address',
      'note',
     */
//		array('class'=>'bootstrap.widgets.TbButtonColumn'),
    ),
));
?>