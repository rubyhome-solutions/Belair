<?php
/* @var $this AirCartController */
/* @var $model AirCart */

echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Fare rules'
        , [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'size' => TbHtml::BUTTON_SIZE_SMALL,
    'onclick' => 'js:$("#divFareRules").toggle(); $(this).blur();',
    'style' => 'margin-bottom: 10px;',
    'class' => 'noprint'
]);
?>
<div id="divFareRules" style="margin-left: 0px; display: none;" class="noprint">
    <?php echo \application\components\Amadeus\MiniRules::formatRules($model->rules); ?>
</div>
