<?php
/* @var $this CcController */
/* @var $model Cc */
?>

<?php
$this->breadcrumbs = array(
    'Ccs' => array('index'),
    $model->name,
);

$this->menu = array(
    array('label' => 'List Cc', 'url' => array('index')),
    array('label' => 'Create Cc', 'url' => array('create')),
    array('label' => 'Update Cc', 'url' => array('update', 'id' => $model->id)),
    array('label' => 'Delete Cc', 'url' => '#', 'linkOptions' => array('submit' => array('delete', 'id' => $model->id), 'confirm' => 'Are you sure you want to delete this item?')),
    array('label' => 'Manage Cc', 'url' => array('admin')),
);
?>

<h1>View Cc #<?php echo $model->id; ?></h1>

<?php
$this->widget('zii.widgets.CDetailView', array(
    'htmlOptions' => array(
        'class' => 'table table-striped table-condensed table-hover',
    ),
    'data' => $model,
    'attributes' => array(
        'id',
        'user_info_id',
        'name',
        'number',
        'code',
        'exp_date',
        'note',
        'status_3d',
        'mask',
        'hash',
        'type_id',
        'bin_id',
    ),
));
?>