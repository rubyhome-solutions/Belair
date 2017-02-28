<?php

/* @var $this AirSourceController */
/* @var $model AirSource */
/* @var $airQueue \AirsourceQueue */
/* @var $queueProvidersList [] */

$this->breadcrumbs = [
    'Air Sources' => ['admin'],
    $model->name => ['view', 'id' => $model->id],
    'Update',
];

echo "<p style='max-width:84%' class='well well-small alert-info'>&nbsp;&nbsp;<i class='fa fa-cog fa-2x fa-spin'></i><span style='vertical-align:super;'>&nbsp;&nbsp;&nbsp;Air Source: <b>{$model->name}</b></span><span style='margin-right: 20px;margin-top: 4px;float: right;'><b>Balance: </b>" . number_format($model->balance) . "</span></p>";
$this->renderPartial('_form', ['model' => $model]);

if ($model->backend->isGds) {
    // Queues
    if (!empty($queueProvidersList)) {
        $this->renderPartial('_queue', [
            'airQueue' => $airQueue,
            'queueProvidersList' => $queueProvidersList
        ]);
    }

    // Tour Codes
    $tourCode = new TourCode('search');
    $tourCode->air_source_id = $model->id;
    \Yii::app()->session->add('filterTourCode', ['air_source_id' => $model->id]);
    $activeClients = CHtml::listData(\UserInfo::model()->findAllBySql(
                            'SELECT t.id, t.name FROM user_info t JOIN tour_code ON t.id = tour_code.user_info_id ORDER BY name'
                    ), 'id', 'name');
    $this->renderPartial('/tourCode/_admin_grid', [
        'model' => $tourCode,
        'activeClients' => $activeClients,
    ]);

    // Private Fares
    $pfCode = new PfCode('search');
    $pfCode->air_source_id = $model->id;
    \Yii::app()->session->add('filterPfCode', ['air_source_id' => $model->id]);
    $activeClients = CHtml::listData(\UserInfo::model()->findAllBySql(
                            'SELECT t.id, t.name FROM user_info t JOIN pf_code ON t.id = pf_code.user_info_id ORDER BY name'
                    ), 'id', 'name');
    $this->renderPartial('/pfCode/_admin_grid', [
        'model' => $pfCode,
        'activeClients' => $activeClients,
    ]);
}
?>
