<?php
/* @var $this AirsourceRuleController */
/* @var $form TbActiveForm */
/* @var $rules AirsourceRule[] */

$errMsg = Yii::app()->session->remove(AirsourceRuleController::AIR_SOURCE_RULE_ERROR);
$errStr = '';
if (is_array($errMsg)) {
    foreach ($errMsg as $key => $value) {
        $errStr .= implode('<br>', $value) . '<br>';
    }
}

foreach ($rules as $rule) {
    $this->renderPartial('_show_rule', [
        'rule' => $rule,
        'ruleId' => $ruleId,
        'errMsg' => $errMsg,
        'errStr' => $errStr,
        'airSourceList' => $airSourceList,
    ]);
}
echo TbHtml::well("Showing <b>" . count($rules) . "</b> out of <b>$rulesCount</b> rules.", ['class' => 'well-small', 'style' => 'max-width:600px']);
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