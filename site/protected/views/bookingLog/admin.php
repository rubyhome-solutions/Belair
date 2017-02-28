<?php
/* @var $this BookingLogController */
/* @var $model BookingLog */

$this->breadcrumbs = array(
    'Booking Logs' => array('admin'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List BookingLog', 'url' => array('index')),
    array('label' => 'Create BookingLog', 'url' => array('create')),
);


?>

<h3>Manage Booking Logs</h3>



</div><!-- search-form -->

<?php
$clientSources = CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name');
$airlineList = CHtml::listData(\Carrier::model()->findAll(['order' => 'code']), 'id', 'code');

$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'booking-log-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED, TbHtml::GRID_TYPE_HOVER],
    'htmlOptions' => ['class' => 'span9', 'style' => 'margin-left:0'],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => array(
        'id',
        'booking_id',
        'user_ip',
        'browser',       
        [
            'name' => 'browser_version',
            'value' => '$data->browser_version',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'type' => 'raw',
            'filter'=>false
        ],
        [
            'name' => 'platform',
            'value' => '$data->platform',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'type' => 'raw',
        ],
       
        [
            'name' => 'is_mobile',
            'value' => 'empty($data->is_mobile) ? "<span class=\"badge badge-success\">No</span>" : "<span class=\"badge badge-success\">Yes</span>"',
            'headerHtmlOptions' => ['style' => 'width: 90px;'],
            'type' => 'raw',
            'filter' => ['No', 'Yes']
        ],
         [
            'name' => 'logs',
            'value' => 'getLogs($data->logs)',
            'headerHtmlOptions' => ['style' => 'width: 200px;'],
            'type' => 'raw',
        ],
        [
            'name' => 'client_source_id',
            'value' => '!empty($data->client_source_id) ? $data->clientSource->name : "Not Available"',
            'headerHtmlOptions' => ['style' => 'width: 120px;'],
            'type' => 'raw',
            'filter' => $clientSources,
        ],
        [
            'name' => 'air_cart_id',
            'value' => '!empty($data->air_cart_id) ? $data->airCart->id : "Not Available"',
            'headerHtmlOptions' => ['style' => 'width: 120px;'],
            'type' => 'raw',
        ],
        [
            'name' => 'source',
            'value' =>'!empty($data->source) ? $data->source : "Not Available"',
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
            'type' => 'raw',
        ],
        [
            'name' => 'destination',
            'value' => '!empty($data->destination) ? $data->destination : "Not Available"',
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
            'type' => 'raw',
        ],
        [
            'name' => 'type_id',
            'value' => '$data->type_id==1? "Oneway":"Return"',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'type' => 'raw',
            'filter' => [1=>"Oneway", 2=>"Return"]
        ],
        [
            'name' => 'is_domestic',
            'value' => '$data->is_domestic==0? "International":"Domestic"',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'type' => 'raw',
            'filter' => [0=>"International", 1=>"Domestic"]
        ],
        [
            'name' => 'carrier_id',
            'value' => '!empty($data->carrier_id) ? $data->carrier->code : "Not Available"',
            'headerHtmlOptions' => ['style' => 'width: 40px;'],
            'type' => 'raw',
            'filter' => $airlineList
        ],
        [
            'name' => 'is_one_click',
            'value' => '$data->is_one_click==1? "Yes":"No"',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'type' => 'raw',
            'filter' => [1=>"Yes", 0=>"No"]
        ],
        [
            'name' => 'ref_id',
            'value' => '$data->ref_id',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'type' => 'raw',
        ],
        [
            'name' => 'created',
            'value' => '$data->created',
            'headerHtmlOptions' => ['style' => 'width: 50px;'],
            'type' => 'raw',
            'filter' => false
          
        ],
        array(
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{view}',
        ),
    ),
));



function getLogs($logs){
    $str='';
    foreach (json_decode($logs) as $key => $value) {
        $str.=$value.' , ';
    }
    return $str;
}
?>

<style>
    #booking-log-grid_c6 {
        width: 150px !important;
    }
    #booking-log-grid select {
        width: inherit;
        margin-bottom: auto;
    }
    #booking-log-grid input {
        width: 70px;
        margin-bottom: auto;
    }
    #booking-log-grid td:nth-child(7) .filter-container input{ width:250px!important;}
    #booking-log-grid table td, #booking-log-grid table th {
        text-align: center;
        vertical-align: middle;
    }
    .badge {font-size: inherit}
</style>