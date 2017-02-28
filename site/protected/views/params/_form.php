<?php
/* @var $this ParamsController */
/* @var $model Params */
/* @var $form TbActiveForm */
?>

<div class="form span5">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', [
        'id' => 'params-form',
        'enableAjaxValidation' => false,
    ]);

    echo $form->errorSummary($model);
    echo $form->textFieldControlGroup($model, 'id', ['span' => 3, 'disabled' => !$model->isNewRecord]);
    echo $form->textAreaControlGroup($model, 'info', ['span' => 5]);
    ?>

    <div class="form-actions">
        <?php
        echo TbHtml::submitButton($model->isNewRecord ? '<i class="fa fa-pencil-square-o fa-lg"></i>&nbsp;&nbsp;Create New' : '<i class="fa fa-save fa-white"></i>&nbsp;&nbsp;Save', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
        ));
        ?>
    </div>

    <?php $this->endWidget(); ?>

</div>