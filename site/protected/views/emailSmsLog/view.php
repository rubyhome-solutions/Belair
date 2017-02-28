<?php
/* @var $this EmailSmsLogController */
/* @var $model EmailSmsLog */
?>

<?php
$this->breadcrumbs = array(
    'Email Sms Logs' => array('admin'),
    $model->id,
);

$this->menu = array(
    array('label' => 'List EmailSmsLog', 'url' => array('index')),
    array('label' => 'Create EmailSmsLog', 'url' => array('create')),
    array('label' => 'Update EmailSmsLog', 'url' => array('update', 'id' => $model->id)),
    array('label' => 'Delete EmailSmsLog', 'url' => '#', 'linkOptions' => array('submit' => array('delete', 'id' => $model->id), 'confirm' => 'Are you sure you want to delete this item?')),
    array('label' => 'Manage EmailSmsLog', 'url' => array('admin')),
);
?>

<h1>View EmailSmsLog #<?php echo $model->id; ?></h1>

<?php
$this->widget('zii.widgets.CDetailView', array(
    'htmlOptions' => array(
        'class' => 'table table-striped table-condensed table-hover',
    ),
    'data' => $model,
    'attributes' => array(
        'id',
        [
            'name' => 'contact_type',
            'value' => \EmailSmsLog::$typeMap[$model->contact_type]
        ],
        'sender',
        'receiver',
        'subject',
        'content:html',
        'created',
        'air_cart_id',
        [
            'name' => 'content_type',
            'value' => \EmailSmsLog::$categoryMap[$model->contact_type]
        ],
        'user_id',
        [
            'name' => 'is_opened',
            'value' => \EmailSmsLog::$emailOpenedMap[$model->is_opened],
        ],
        'opened_at',
        'opened_ip',
    ),
));
?>