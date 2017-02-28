<?php
/* @var $this RoutesCacheController */
/* @var $model RoutesCache */
/* @var $rule \CommercialRule  */


$this->breadcrumbs = [
    'Routes Cache' => ['admin'],
    'Manage',
];
$canManageCommercials = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_COMMERCIALS);

$ruleId = Yii::app()->session->get('ruleId', 0);
if ($ruleId && $canManageCommercials) {
    $rule = \CommercialRule::model()->findByPk($ruleId);
    $planId = $rule->commercialPlans[0]->id;
} else {
    $rule = null;
}

$commissionRuleId = Yii::app()->session->get('commissionRuleId');
if ($commissionRuleId && $canManageCommercials) {
    $commissionRule = \CommissionRule::model()->findByPk($commissionRuleId);
} else {
    $commissionRule = null;
}
//$this->renderPartial('_graph');
//$this->renderPartial('_summary', ['model' => $model]);
$this->renderPartial('_grid', [
    'model' => $model,
    'ruleId' => $ruleId,
    'commissionRuleId' => $commissionRuleId,
]);

$airSourceList = CHtml::listData(\AirSource::model()->findAll(['order' => 'name']), 'id', 'name');
$airlineList = CHtml::listData(\Carrier::model()->findAll(['order' => 'code']), 'id', 'codeAndName');
$clientSourceList = CHtml::listData(\ClientSource::model()->findAll(['order' => 'id']), 'id', 'name');

if ($ruleId && $canManageCommercials) {
    echo "<legend>Markups and discounts calculated using <a href='/commercial/update/{$planId}#Rule{$ruleId}'>Rule № $ruleId</a>, from plan: <a href='/commercial/admin'>{$rule->commercialPlans[0]->name}</a></legend>";
    $this->renderPartial('/commercial/_show_rule', [
        'rule' => $rule,
        'ruleId' => $ruleId,
        'planId' => $planId,
        'errMsg' => null,
        'errStr' => null,
        'airlineList' => $airlineList,
        'airSourceList' => $airSourceList,
        'clientSourceList' => $clientSourceList,
    ]);
}

if ($commissionRuleId && $canManageCommercials) {
    echo "<legend>Commission calculated using <a href='/commission/update#Rule{$commissionRuleId}'>Rule № $commissionRuleId</a></legend>";
    $this->renderPartial('/commission/_show_rule', [
        'rule' => $commissionRule,
        'ruleId' => $commissionRuleId,
        'errMsg' => null,
        'errStr' => null,
        'airlineList' => $airlineList,
        'airSourceList' => $airSourceList,
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
