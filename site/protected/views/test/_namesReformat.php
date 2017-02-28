<?php

$models = \Traveler::model()->findAll(['order' => 'id']);
foreach ($models as $model) {
    /* @var $model \Traveler */
    $v1 = [
        'originalFirstName' => $model->first_name,
        'originalLastName' => $model->last_name,
    ];
    $model->namesBeautify();
    $v2 = [
        'newFirstName' => $model->first_name,
        'newLastName' => $model->last_name,
    ];
    $out [] = $v1 + $v2;
}
echo \Utils::arr2table($out);

