<?php

/* @var $this ProcessController */
/* @var $model Process */

$this->widget('bootstrap.widgets.TbGridView', ['id' => 'process-grid',
    'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_BORDERED],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => [
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
            'name' => 'search_id',
            'value' => '$data->search->origin . "-" . $data->search->destination . ($data->search->date_return ? "-" . $data->search->origin : "")',
            'filter' => false,
        ],
//        ['name' => 'queued', 'value' => '\Utils::cutMilliseconds($data->queued)'],
        [
            'header' => 'Delayed',
            'value' => '$data->getDelay()',
            'filter' => false,
        ],
        [
            'name' => 'started',
            'filter' => false,
        ],
        [
            'name' => 'ended',
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