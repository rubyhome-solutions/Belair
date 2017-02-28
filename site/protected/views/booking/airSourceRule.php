<?php
/* @var $model \BookingSearchForm */

$start_timer = microtime(true);

$defaultSources = \AirSource::model()->findAllBySql('select name from air_source where is_active=1 and display_in_search=1');
$defaultList = prepareAsList($defaultSources);
$search = \Searches::assignParams($model);
echo \TbHtml::well("Search parameters:<b> $search->origin - $search->destination , $search->date_depart  $search->date_return</b>", ['class' => 'shadow']);
$rule = $search->findMatchingAirSourceRule();
if ($rule) {
    echo \TbHtml::well($search->formatAirSourceRule($rule->id, true), ['class' => 'shadow']);
    $activeSourcesIds = $rule->getActiveAirSourceIds();
    if (!empty($activeSourcesIds)) {
        $activeSources = \AirSource::model()->findAllBySql('select name from air_source where id in (' . implode(',', $activeSourcesIds) . ')');
        $activeList = prepareAsList($activeSources);
        echo \TbHtml::well("<p><b>Active and matching rule № $rule->id air sources used for the search:<b></p>$activeList", [
            'class' => 'shadow'
        ]);
    } else {
        echo \TbHtml::well("<p><b>No active air sources exists for the rule - using the default ones</b><p>$defaultList", [
            'class' => 'shadow'
        ]);
    }

    echo "<hr><legend>Matched air sources <a href='/airsourceRule/update#Rule{$rule->id}' target='_blank'>Rule № $rule->id</a></legend>";
    yii::import('application.controllers.AirsourceRuleController');
    $errMsg = \Yii::app()->session->remove(\AirsourceRuleController::AIR_SOURCE_RULE_ERROR);
    $errStr = '';
    if (is_array($errMsg)) {
        foreach ($errMsg as $key => $value) {
            $errStr .= implode('<br>', $value) . '<br>';
        }
    }

    $this->renderPartial('/airsourceRule/_show_rule', [
        'rule' => $rule,
        'ruleId' => $rule->id,
        'errMsg' => $errMsg,
        'errStr' => $errStr,
        'airSourceList' => \CHtml::listData(\AirSource::model()
                        ->findAllBySql("select id, name || case when is_active=0 then ' <b>(disabled)</b>' else '' end as name from air_source order by name"), 'id', 'name')
    ]);
} else {
    echo \TbHtml::well("<p><b>No matching air source rule is found - using the default air sources</b><p>$defaultList", [
        'class' => 'shadow'
    ]);
}

print "\n\nTimestamp: " . date('Y-m-d H:i:s') . ", Script: " . basename(__FILE__, '.php') . " , Time used: " . round((microtime(true) - $start_timer), 2) . " sec. , Memory used: " . round(memory_get_peak_usage(true) / 1048576, 3) . " MB\n";

function prepareAsList($activeSources) {
    $out = '';
    foreach ($activeSources as $as) {
        $out .= "<li> $as->name </li>";
    }
    return $out;
}
?>
<script>
    $('table').addClass('table');
</script>
<style>
    .shadow {
        box-shadow: 10px 10px 5px #888888;
        /*background-color: aliceblue;*/
        background-color: lightcyan;
        display: table
    }
</style>