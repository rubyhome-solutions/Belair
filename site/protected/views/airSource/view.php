<?php
/* @var $this AirSourceController */
/* @var $model AirSource */

$this->breadcrumbs = array(
    'Air Sources' => array('index'),
    $model->name,
);
?>

<h3><small>Air Source: </small><?php echo $model->name; ?></h3>

<?php
$this->widget('zii.widgets.CDetailView', array(
    'htmlOptions' => array(
        'class' => 'table table-striped table-condensed table-hover span6',
    ),
    'data' => $model,
    'attributes' => array(
        'id',
        'name',
        ['name' => 'is_active', 'value' => $model->is_active ? 'Yes' : 'No'],
        ['name' => 'type_id', 'value' => \AirSource::$type[$model->type_id?:1] ],
        ['label' => 'Currency', 'value' => "({$model->currency->code}) {$model->currency->name}"],
        ['label' => 'Balance', 'value' => number_format($model->balance)],
        ['label' => 'Backend', 'value' => $model->backend->name],
        ['label' => 'Balance link', 'value' => $model->balance_link ? $model->balanceLink->name : 'Not Set'],
        'username',
        'password',
        'tran_username',
        'tran_password',
        'iata_number',
        'profile_pcc',
        'spare1',
        'spare2',
        'spare3',
        'exclude_carriers',
        'include_pass_carriers',
//        ['name' => 'air_way_id', 'value' => $model->air_way_id ? 'Yes' : 'No'],
        ['name' => 'display_in_search', 'value' => $model->display_in_search ? 'Yes' : 'No'],
        ['name' => 'international_auto_ticket', 'value' => $model->international_auto_ticket ? 'Yes' : 'No'],
        ['name' => 'domestic_auto_ticket', 'value' => $model->domestic_auto_ticket ? 'Yes' : 'No'],
    ),
));
?>