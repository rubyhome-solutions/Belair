<div id="currency-div">
    <?php
    /* @var $this \XRateController */
    /* @var $model \XRate */

    $data = json_decode($model->content);
//\Utils::dbgYiiLog($data);
    ?>
    <p class='well well-small alert-info m_top1'>Last updated:<b> <?php echo date('Y.M.d H:i:s', isset($data->timestamp) ? $data->timestamp : 0); ?></b> , xChange based on: <b>USD</b></p>

    <?php
    $model = new \Currency;
    \Yii::import('ext.ajax-input-column.AjaxInputColumn');
    $this->widget('bootstrap.widgets.TbGridView', [
        'id' => 'currency-grid',
        'dataProvider' => $model->search(),
//    'filter' => $model,
        'type' => [TbHtml::GRID_TYPE_CONDENSED, TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_STRIPED, TbHtml::GRID_TYPE_BORDERED],
        'selectableRows' => 1,
//    'selectionChanged' => 'function(id){ location.href = "' . $this->createUrl('update') . '/"+$.fn.yiiGridView.getSelection(id);}',
        'htmlOptions' => ['class' => 'span6', 'style' => 'margin-left:0'],
        'columns' => [
            'id',
            'code',
            [
                'name' => 'name',
                'class' => 'AjaxInputColumn',
                'url' => $this->createUrl("rename"),
                'placeholder' => '-- Please set the name --',
                'value' => 'empty($data->name) ? "" : $data->name',
            ],
            [
                'name' => 'sign',
                'type' => 'raw',
                'htmlOptions' => ['style' => 'text-align:center;'],
            ],
            'rate',
        ],
    ]);
    ?>
</div>