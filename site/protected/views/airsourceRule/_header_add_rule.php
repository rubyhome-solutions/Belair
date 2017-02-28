<?php
/* @var $this AirsourceRuleController */
/* @var $form TbActiveForm */
?>

<table class="table table-bordered table-condensed sinkavo shadow" style="max-width: 90%;">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
        'id' => 'add-airsource_rule',
        'enableAjaxValidation' => false,
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'action' => $this->createUrl('addRule'),
        'htmlOptions' => ['style' => 'margin:0px;']
    ]);
    ?>
    <tr>
        <th>AirSource</th>
        <th>Filter content (any part)</th>
        <th>Actions</th>
    </tr>
    <tr>
        <td>
            <?php
            if (Yii::app()->user->hasFlash(\AirsourceRuleController::AIR_SOURCE_RULE_AS_ID)) {
                echo TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, Yii::app()->user->getFlash(\AirsourceRuleController::AIR_SOURCE_RULE_AS_ID));                
            }
            echo TbHtml::dropDownList('air_source_id', Yii::app()->session->get(\AirsourceRuleController::AIR_SOURCE_RULE_AS_ID), $airSourceListNormal, [
                'prompt' => '--- ALL Air Sources ---',
                'class' => 'input-xlarge',
                'style' => 'margin-bottom:0;',
            ]);
            ?>
        </td>
        <td>
            <?php echo TbHtml::textField('filterSearch', Yii::app()->session->get(\AirsourceRuleController::AIR_SOURCE_RULE_FILTER_CONTENT)); ?>
        </td>
        <td>
            <?php
            echo TbHtml::submitButton('<i class="fa fa-filter fa-lg"></i>&nbsp&nbspFilter', [
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'style' => 'margin-left: 8%;',
                'name' => 'ruleFilter',
                'value' => 1
            ]);
            echo TbHtml::submitButton('<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp&nbspAdd rule', [
                'color' => TbHtml::BUTTON_COLOR_WARNING,
                'style' => 'margin-left: 8%;'
            ]);
            $this->endWidget();
            ?>
        </td>
    </tr>

</table><!-- form -->
<style>
</style>
