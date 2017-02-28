<?php
/* @var $this SearchesController */
/* @var $model Searches */


$this->breadcrumbs = [
    'Searches' => ['admin'],
    'Manage',
];

$this->renderPartial('_graphs');

\Yii::import('application.controllers.AirsourceRuleController');
$ruleId = \Yii::app()->session->get(\AirsourceRuleController::AIR_SOURCE_RULE_ID);

$this->renderPartial('_grid', ['model' => $model]);

// We have AirsouceRule, so lets show it
if ($ruleId) {
    $errMsg = \Yii::app()->session->remove(\AirsourceRuleController::AIR_SOURCE_RULE_ERROR);
    $errStr = '';
    if (is_array($errMsg)) {
        foreach ($errMsg as $key => $value) {
            $errStr .= implode('<br>', $value) . '<br>';
        }
    }

    echo "<legend>Air Sources search selection rule <a href='/airsourceRule/update#Rule{$ruleId}' target='_blank'>Rule № $ruleId</a></legend>";
    $this->renderPartial('/airsourceRule/_show_rule', [
        'rule' => \AirsourceRule::model()->findByPk($ruleId),
        'ruleId' => $ruleId,
        'errMsg' => $errMsg,
        'errStr' => $errStr,
        'airSourceList' => \CHtml::listData(\AirSource::model()
                        ->findAllBySql("select id, name || case when is_active=0 then ' <b>(disabled)</b>' else '' end as name from air_source order by name"), 'id', 'name')
    ]);
}
?>
<style>
    .table th, .table td {vertical-align: middle;}
    .table th, td.center {
        text-align: center;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
    }
    .input-append, .input-prepend { margin-bottom: auto; }
    .table.filter-table td input {width: 95%;margin-bottom: auto;}
    .table.filter-table {margin-bottom: auto;}
    .shadow {
        box-shadow: 10px 10px 5px #888888;
        background-color: aliceblue;
    }
    .sinkavo {background-color: #f5f5ff;}
    .label {font-size: inherit;}
</style>