<?php

/* @var $this AirsourceRuleController */
/* @var $rules AirsourceRule[] */
?>

<?php

$this->breadcrumbs = ['Airsource Rules' => ['update'],
    'Manage',
];

echo \Utils::helpMessage('The disabled AirSources will not be searched even if they are selected in the rule');

$this->renderPartial('_header_add_rule', [
    'airSourceListNormal' => $airSourceListNormal,
]);

$this->renderPartial('_rules', [
    'ruleId' => $ruleId,
    'rules' => $rules,
    'rulesCount' => $rulesCount,
    'airSourceList' => $airSourceList,
]);

