<?php
/* @var $this EmailSmsLogController */
/* @var $model EmailSmsLog */


$this->breadcrumbs = array(
    'Email Sms Logs' => array('admin'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List EmailSmsLog', 'url' => array('index')),
    array('label' => 'Create EmailSmsLog', 'url' => array('create')),
);

Yii::app()->clientScript->registerScript('search', "
$('.search-button').click(function(){
$('.search-form').toggle();
return false;
});
$('.search-form form').submit(function(){
$('#email-sms-log-grid').yiiGridView('update', {
data: $(this).serialize()
});
return false;
});
");
?>

<h1>Manage Email Sms Logs</h1>

<p>
    You may optionally enter a comparison operator (<b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>
        &lt;&gt;</b>
    or <b>=</b>) at the beginning of each of your search values to specify how the comparison should be done.
</p>

<?php echo CHtml::link('Advanced Search', '#', array('class' => 'search-button btn')); ?>
<div class="search-form" style="display:none">
    <?php
    $this->renderPartial('_search', array(
        'model' => $model,
    ));
    ?>
</div><!-- search-form -->

<?php
$this->widget('bootstrap.widgets.TbGridView', array(
    'id' => 'email-sms-log-grid',
    'type' => [TbHtml::GRID_TYPE_HOVER],
    'dataProvider' => $model->search(),
    'filter' => $model,
    'columns' => array(
        'id',
        [
            'name' => 'contact_type',
            'value' => '"<span class=\"label label-info\">" . \EmailSmsLog::$typeMap[$data->contact_type] . "</span>"',
            'filter' => \EmailSmsLog::$typeMap,
            'headerHtmlOptions' => ['style' => 'min-width: 100px;'],
            'type' => 'raw'
        ],
        'sender',
        'receiver',
        'subject',
//        'content',
        [
            'name' => 'created',
            'filter' => false,
        ],
        'air_cart_id',
        [
            'name' => 'content_type',
            'value' => '"<span class=\"label label-info\">" . \EmailSmsLog::$categoryMap[$data->content_type] . "</span>"',
            'filter' => \EmailSmsLog::$categoryMap,
            'headerHtmlOptions' => ['style' => 'min-width: 100px;'],
            'type' => 'raw'
        ],
        [
            'name' => 'is_opened',
            'value' => '"<span class=\"label label-info\">" . \EmailSmsLog::$emailOpenedMap[$data->is_opened]. "</span>"',
            'filter' => \EmailSmsLog::$emailOpenedMap,
            'headerHtmlOptions' => ['style' => 'min-width: 100px;'],
            'type' => 'raw'
        ],
        [
            'name' => 'opened_at',
            'filter' => false,
        ],
        [
            'name' => 'opened_ip',
            'filter' => false,
        ],
        'user_id',
        array(
            'class' => 'CButtonColumn',
            'template' => '{view}',
            'buttons' => array(
                'view' => array(
                    'visible' => 'true',
                ),
            ),
        ),
    ),
));
?>
<style>
    .badge, .label {font-family: sans-serif; font-size: inherit;}
</style>
