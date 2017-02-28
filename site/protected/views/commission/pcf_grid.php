<style>

    tfoot tr {background-color: beige;}
</style>
<?php
$clientSources = CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name');

?>
<a class="btn btn-primary" href="/commission/paymentConvenienceFeeCreate"><i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Add New</a>
<?php
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'payment_convenience_fee_grid',
    'dataProvider' => $model->search(),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'htmlOptions' => [
//        'class' => 'span7',
        'style' => 'margin-left:0; width: 70%;'
    ],
    'columns' => [
        [
            'name' => 'client_source_id',
            'value' => '$data->clientSource->name',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
            'filter' => $clientSources,
        ],
        [
            'name' => 'journey_type',
            'value' => '\PaymentConvenienceFee::$waytypeMap[$data->journey_type]',
            'headerHtmlOptions' => ['style' => 'width: 160px;'],
            'filter' => \PaymentConvenienceFee::$waytypeMap,
        ],
        [
            'name' => 'payment_type',
            'value' => '\PaymentConfiguration::$paymentTypeMap[$data->payment_type]',
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => \PaymentConfiguration::$paymentTypeMap,
        ],
        [
            'name' => 'payment_sub_type',
            'value' => '($data->payment_sub_type == \PaymentConfiguration::ALL)?\PaymentConfiguration::$paymentTypeMap[$data->payment_sub_type]:\PaymentConfiguration::$paymentSubTypeMap[$data->payment_type][$data->payment_sub_type]',
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => false,
        ],
        [
            'name' => 'fixed',
            'filter' => false,
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
        [
            'name' => 'perc',
            'filter' => false,
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
        [
            'name' => 'per_passenger',
            'filter' => \PaymentConvenienceFee::$perPassengerMap,
            'value' => '\PaymentConvenienceFee::$perPassengerMap[$data->per_passenger]',
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{update}{delete}',
            'buttons' => [
                'delete' => ['url' => '"/commission/paymentConvenienceFeeDelete/".$data->id',],
                'update' => ['url' => '"/commission/paymentConvenienceFeeUpdate/".$data->id',]
            ],
            'header' => 'Actions',
        ],
    ],
]);
?>
<style>
    .table th {text-align: center}
    input.ajax-input-column {margin-bottom: auto;}
    select.ajax-select-column {margin-bottom: auto;}
    .filters input {margin-bottom: 10px !important; width: 80%}
    input {width: inherit;}
    select {width: 97%;}
</style>