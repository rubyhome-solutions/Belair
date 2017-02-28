<?php
/* @var $this CommissionController */
/* @var $form TbActiveForm */

$errMsg = \Yii::app()->session->remove('commissionRuleError');
$errStr = '';
if (is_array($errMsg)) {
    foreach ($errMsg as $key => $value) {
        $errStr .= implode('<br>', $value) . '<br>';
    }
}
$filterAttributes = [];
if (Yii::app()->session->get('commission_filter_carrier_id')) {
    $filterAttributes['carrier_id'] = \Yii::app()->session->get('commission_filter_carrier_id');
}
if (Yii::app()->session->get('commission_filter_air_source_id')) {
    $filterAttributes['air_source_id'] = \Yii::app()->session->get('commission_filter_air_source_id');
}
if (Yii::app()->session->get('commission_filter_service_type_id')) {
    $filterAttributes['service_type_id'] = \Yii::app()->session->get('commission_filter_service_type_id');
}
$rules = \CommissionRule::model()->findAllByAttributes($filterAttributes, [
    'order' => 't.id',
        ]);

foreach ($rules as $rule) {
    $this->renderPartial('_show_rule', [
        'rule' => $rule,
        'ruleId' => $ruleId,
        'errMsg' => $errMsg,
        'errStr' => $errStr,
        'airlineList' => $airlineList,
        'airSourceList' => $airSourceList,
    ]);
}
?>


<style>
    .table th, .table td {vertical-align: middle;}        
    .table th, td.center, .table td {
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