<?php
$model = new \PaymentConvenienceFee;
$model->unsetAttributes();
if (isset($_GET['PaymentConvenienceFee'])) {
    $model->attributes = $_GET['PaymentConvenienceFee'];
}
$model->commercial_rule_id = $rule->id;
$clientSources = CHtml::listData(\ClientSource::model()->findAll(['order' => 'name']), 'id', 'name');
$s_string = "rule_id=" . $rule->id . "&source_id=" . $rule->client_source_id . "&trip_type=" . $rule->service_type_id;
?>
<a class="btn btn-primary" target="_blank" href="/commission/paymentConvenienceFeeCreate?<?php echo $s_string; ?>"><i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Add New</a>
<a class="btn btn-primary" href="javascript:refresh('payment_convenience_fee_grid<?php echo $rule->id; ?>')"><i class="fa fa-refresh" aria-hidden="true"></i>&nbsp;&nbsp;Refresh</a>
<?php
$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'payment_convenience_fee_grid' . $rule->id,
    'dataProvider' => $model->search('order'),
    'filter' => $model,
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
    'selectableRows' => 1,
    'htmlOptions' => [
//        'class' => 'span7',
        'style' => 'margin-left:0; width: 80%;'
    ],
    'columns' => [
        [
            'name' => 'payment_type',
            'value' => '\PaymentConfiguration::$paymentTypeMap[$data->payment_type]',
            'headerHtmlOptions' => ['style' => 'width: 195px;'],
            'filter' => false,
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
            'filter' => false,
            //'filter' => \PaymentConvenienceFee::$perPassengerMap,
            'value' => '\PaymentConvenienceFee::$perPassengerMap[$data->per_passenger]',
            'headerHtmlOptions' => ['style' => 'width: 150px;'],
        ],
        [
            'class' => 'bootstrap.widgets.TbButtonColumn',
            'template' => '{update}{delete}',
            'buttons' => [
                'delete' => ['url' => '"/commission/paymentConvenienceFeeDelete/".$data->id'],
                'update' => ['url' => '"/commission/paymentConvenienceFeeUpdate/".$data->id', 'options' => ['target' => '_blank']]
            ],
            'header' => 'Actions',
        ],
    ],
]);
?>
<script type="text/javascript">
    function refresh(gridid) {
        $.fn.yiiGridView.update(gridid);
    }
</script>