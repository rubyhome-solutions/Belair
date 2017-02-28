<?php
/* @var $this CommercialController */
/* @var $plan CommercialPlan */
/* @var $form TbActiveForm */

$errMsg = Yii::app()->session->remove('ruleError');
$errStr = '';
if (is_array($errMsg)) {
    foreach ($errMsg as $key => $value) {
        $errStr .= implode('<br>', $value) . '<br>';
    }
}
$filterAttributes = [];
if ($ruleId) {
    $filterAttributes['id'] = $ruleId;
    // Clear the filters
    \Yii::app()->session->remove('ruleId');
    \Yii::app()->session->remove('rule_filter_carrier_id');
    \Yii::app()->session->remove('rule_filter_air_source_id');
    \Yii::app()->session->remove('rule_filter_service_type_id');
    \Yii::app()->session->remove('rule_filter_client_source_id');
}
if (Yii::app()->session->get('rule_filter_carrier_id')) {
    $filterAttributes['carrier_id'] = Yii::app()->session->get('rule_filter_carrier_id');
}
if (Yii::app()->session->get('rule_filter_air_source_id')) {
    $filterAttributes['air_source_id'] = Yii::app()->session->get('rule_filter_air_source_id');
}
if (Yii::app()->session->get('rule_filter_service_type_id')) {
    $filterAttributes['service_type_id'] = Yii::app()->session->get('rule_filter_service_type_id');
}
if (Yii::app()->session->get('rule_filter_client_source_id')) {
    $filterAttributes['client_source_id'] = Yii::app()->session->get('rule_filter_client_source_id');
}
$rules = \CommercialRule::model()->findAllByAttributes($filterAttributes, [
    'condition' => 'id IN ( SELECT rule_id FROM commercial_x_rule WHERE plan_id=:planId )',
    'order' => 't.id',
    'params' => [':planId' => $plan->id]
        ]);

$i = 0;
foreach ($rules as $rule) {
    $this->renderPartial('_show_rule', [
        'rule' => $rule,
        'ruleId' => $ruleId,
        'planId' => $plan->id,
        'errMsg' => $errMsg,
        'errStr' => $errStr,
        'airlineList' => $airlineList,
        'airSourceList' => $airSourceList,
        'clientSourceList' => $clientSourceList,
    ]);
    $i++;
    if ($i >= \CommissionRule::MAX_ELEMENTS_ON_PAGE) {
        break;
    }
}
echo TbHtml::well("Showing <b>$i</b> out of <b>" . count($rules) . "</b> rules.", ['class' => 'well-small', 'style' => 'max-width:600px']);
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
    .table.filter-table td input {width: 95%; margin-bottom: auto;}
    .table.filter-table {margin-bottom: auto;}
    .shadow {
        box-shadow: 10px 10px 5px #888888;
        background-color: aliceblue;
    }
    .sinkavo {background-color: #f5f5ff;}
    .label {font-size: inherit;}
</style>
<script>
    $(function () {
        if (!window.location.hash) {
            window.location.hash = '#Rule<?php echo $ruleId; ?>';
        }
    });
</script>