<?php
/* @var $this BookingLogController */
/* @var $model BookingLog */

$this->breadcrumbs = array(
    'Booking Logs' => array('admin'),
    $model->id,
);

$this->menu = array(
    array('label' => 'List BookingLog', 'url' => array('index')),
    array('label' => 'Create BookingLog', 'url' => array('create')),
    array('label' => 'Update BookingLog', 'url' => array('update', 'id' => $model->id)),
    array('label' => 'Delete BookingLog', 'url' => '#', 'linkOptions' => array('submit' => array('delete', 'id' => $model->id), 'confirm' => 'Are you sure you want to delete this item?')),
    array('label' => 'Manage BookingLog', 'url' => array('admin')),
);
?>

<h3>View BookingLog #<?php echo $model->id; ?></h3>

<?php
$this->widget('zii.widgets.CDetailView', array(
    'data' => $model,
    'attributes' => array(
        'id',
        'booking_id',
        'browser',
        'browser_version',
        'platform',
        'is_mobile',
        'ref_id',
        'callback_url',
        'logs',
        'booking_data',
        'enabled',
        'created',
    ),
));
?>
