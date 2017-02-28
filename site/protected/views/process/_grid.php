<?php

/* @var $this ProcessController */
/* @var $model Process */

$servers = ['Master', 'Slave1', 'Slave2', 'Slave3', 'Slave4', 'Slave5', 'Slave6', 'Slave7', 'Slave8'];
$this->widget('bootstrap.widgets.TbGridView', ['id' => 'process-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => [
        [
            'name' => 'server_id',
            'value' => '$data->server_id === 0 ? "Master" : "Slave" . $data->server_id',
            'type' => 'raw',
            'filter' => $servers,
            'htmlOptions' => ['style' => 'width: 80px']
        ],
        [
            'name' => 'air_source_id',
            'value' => 'CHtml::link("<b>" . $data->airSource->name . "</b>", "/airSource/update/" . $data->air_source_id)',
            'type' => 'raw',
            'filter' => CHtml::listData(\AirSource::model()->with('backend')->findAll([
                        'condition' => 'backend.search is not null',
                        'order' => 't.name'
                    ]), 'id', 'name'),
            'htmlOptions' => ['style' => 'width: 180px']
        ],
        [
            'header' => 'Sector',
            'value' => '$data->search->origin . "-" . $data->search->destination . ($data->search->date_return ? "-" . $data->search->origin : "")',
            'filter' => false,
        ],
        [
            'name' => 'search_id',
            'value' => 'CHtml::link("<b>" . $data->search_id . "</b>", "/searches/admin?Searches[id]=" . $data->search_id, ["target" => "_blank"])',
            'type' => 'raw',
            'htmlOptions' => ['style' => 'width: 80px']
        ],
        [
            'name' => 'queued',
            'value' => '\Utils::cutMilliseconds($data->queued)',
            'filter' => false,
        ],
//        [
//            'header' => 'Delayed',
//            'value' => '$data->getDelay()',
//            'filter' => false,
//        ],
//        [
//            'name' => 'queued',
//            'value' => '\Utils::cutMilliseconds($data->queued)',
//            'filter' => false,
//        ],
        [
            'name' => 'started',
            'filter' => false,
        ],
        [
            'name' => 'time_needed',
            'value' => '\Utils::convertSecToMinsSecs($data->time_needed)',
            'filter' => false,
        ],
        [
            'name' => 'memory',
            'value' => 'round($data->memory/1024/1024, 2) . " MB"',
            'filter' => false,
        ],
        [
            'name' => 'note',
            'htmlOptions' => ['style' => 'width: 25%;'],
            'filter' => false,
        ],
        [
            'name' => 'result',
            'value' => '$data->resultTag',
            'type' => 'raw',
            'filter' => \Process::$results,
        ],
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