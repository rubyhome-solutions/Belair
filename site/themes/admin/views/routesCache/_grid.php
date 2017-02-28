<?php
/* @var $this RoutesCacheController */
/* @var $model RoutesCache */
/* @var $ruleId integer */

$this->widget('bootstrap.widgets.TbGridView', [
    'id' => 'RoutesCache-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED], 
    'dataProvider' => $model->search(),
    'selectableRows' => 0,
    'pager' => [
        'class' => 'bootstrap.widgets.TbPager',
        'maxButtonCount' => 10,
    ],
    'filter' => $model,
    'afterAjaxUpdate' => 'function(id, data) { $("#departure_date").datepicker({dateFormat:"yy-mm-dd"}); }',
    'columns' => [
        'id',
        [
            'name' => 'air_source_id',
            'value' => 'CHtml::link("<b>" . $data->airSource->name . "</b>", "/airSource/update/" . $data->air_source_id)',
            'type' => 'raw',
            'filter' => CHtml::listData(\AirSource::model()->with('backend')->findAll([
                        'condition' => 'backend.search is not null',
                        'order' => 't.name'
                    ]), 'id', 'name'),
            'htmlOptions' => ['style' => 'min-width: 100px']
        ],
        [
            'name' => 'origin_id',
            'value' => '$data->origin->airport_code',
            'htmlOptions' => ['style' => 'width: 60px']
        ],
        [
            'header' => 'Dest.',
            'name' => 'destination_id',
            'value' => '$data->destination->airport_code',
            'htmlOptions' => ['style' => 'width: 60px'],
//            'headerHtmlOptions' => ['style' => 'width: 60px'],
        ],
        [
            'name' => 'carrier_id',
            'value' => '$data->carrier->code',
            'htmlOptions' => ['style' => 'width: 60px']
        ],
        [
            'header' => 'Comm',
            'value' => "\$data->calcAndFormatCommissionRule($commissionRuleId, $ruleId)",
            'type' => 'raw',
            'htmlOptions' => ['style' => 'width: 90px'],
            'filter' => false,
            'visible' => !empty($commissionRuleId)
        ],
        [
            'header' => 'Total',
            'name' => 'total_fare',
            'value' => 'TbHtml::tooltip($data->total_fare, "javascript:void(0);", $data->printPriceTable(), ["data-html" => "true", "encode" => false, "data-placement" => "top"])',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'width: 90px']
        ],
        [
            'header' => 'Rule №' . $ruleId,
            'value' => '$data->calcAndFormatRule(' . $ruleId . ')',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'width: 90px'],
            'filter' => false,
            'visible' => !empty($ruleId)
        ],
        [
            'name' => 'fare_basis',
            'htmlOptions' => ['style' => 'width: 90px']
        ],
        [
            'header' => 'Departure',
            'name' => 'departure_date',
            'value' => '$data->departure_date . " " . substr($data->departure_time, 0, -3)',
            'filter' => $this->widget('zii.widgets.jui.CJuiDatePicker', [
                'name' => 'departure_date',
                'model' => $model,
                'attribute' => 'departure_date',
                'options' => ['dateFormat' => 'yy-mm-dd']
                    ], true)
            ,
            'htmlOptions' => ['style' => 'width: 110px'],
            'headerHtmlOptions' => ['style' => 'min-width: 90px'],
        ],
        [
            'header' => 'F.Flight',
            'name' => 'flight_number',
            'htmlOptions' => ['style' => 'width: 80px']
        ],
        [
            'header' => 'Order',
            'name' => 'order_',
            'value' => '\RoutesCache::$orderName[$data->order_]',
            'filter' => \RoutesCache::$orderName,
            'htmlOptions' => ['style' => 'width: 90px'],
            'headerHtmlOptions' => ['style' => 'min-width: 90px'],
        ],
        [
            'name' => 'hits',
            'filter' => false,
            'htmlOptions' => ['style' => 'width: 60px']
        ],
        [
            'name' => 'traveler_type_id',
            'header' => 'Pax',
            'value' => '$data->travelerType->name',
            'filter' => CHtml::listData(\TravelerType::model()->findAll(['order' => 'name']), 'id', 'name'),
            'htmlOptions' => ['style' => 'width: 90px'],
            'headerHtmlOptions' => ['style' => 'min-width: 90px'],
        ],
        [
            'name' => 'grouping',
            'header' => 'Group',
            'htmlOptions' => ['style' => 'width: 60px']
        ],
        'stops',
        [
            'name' => 'legs_json',
            'header' => 'Details',
            'value' => 'TbHtml::tooltip("Details", "javascript:void(0);", $data->printJsonHtml(), ["data-html" => "true", "encode"=>false, "data-placement" => "left"])',
            'htmlOptions' => ['style' => 'width: 70px'],
            'type' => 'raw'
        ],
//        'started',
//        'ended',
//        ['name' => 'time_needed', 'value' => '\Utils::convertSecToMinsSecs($data->time_needed)'],
//        ['name' => 'memory', 'value' => 'round($data->memory/1024/1024, 2) . " MB"'],
//        ['name' => 'note', 'htmlOptions' => ['style' => 'width: 25%;']],
//        ['name' => 'result', 'value' => '$data->resultTag', 'type' => 'raw'],
    /*
      'result',
      'parameters',
      'pid',
      'start_at',
      'command',
     */
//        array(
//            'class' => 'bootstrap.widgets.TbButtonColumn',
//        ),
    ],
]);
?>
<style>
    .tooltip-inner {max-width: 800px;}
    .label {font-size: inherit}
    /*div.tooltip-inner table td, div.tooltip-inner table th {padding-left: 5px; text-align: center;}*/
</style>