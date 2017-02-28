<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */

$this->breadcrumbs = ['Pay Gate' => ['admin'],
    'Manual Payment Request',
];

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
    $model->unsetAttributes();
    $model->pg_id = \PaymentGateway::chooseDefaultPg();
    $model->currency_id = \Currency::INR_ID;
    $model->original_currency_id = \Currency::INR_ID;
}
$isStaffLogged = Authorization::getIsStaffLogged();
if ($isStaffLogged) {
    $this->renderPartial('/users/_user_search');
}
?>
<hr>
<?php
$this->renderPartial('_formMpr', [
    'model' => $model,
    'isStaffLogged' => $isStaffLogged,
]);
