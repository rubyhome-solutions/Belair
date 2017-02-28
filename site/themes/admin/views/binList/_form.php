<?php
/* @var $this BinListController */
/* @var $model BinList */
/* @var $form TbActiveForm */
?>

<div class="form span6">
    <fieldset>

        <?php
        $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
            'id' => 'bin-list-form',
            'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
            'enableAjaxValidation' => false,
        ));

        echo $form->errorSummary($model);
        echo $form->textFieldControlGroup($model, 'bin', ['disabled' => true]);
        echo $form->dropDownListControlGroup($model, 'type_id', CHtml::listData(CcType::model()->findAll(), 'id', 'name'));
        echo $form->textFieldControlGroup($model, 'bank', ['style' => 'width:90%']);
        echo $form->textFieldControlGroup($model, 'card_type');
        echo $form->textFieldControlGroup($model, 'country_code');
        echo $form->textFieldControlGroup($model, 'country_name');
        echo $form->dropDownListControlGroup($model, 'domestic', ['International', 'Domestic']);
        echo $form->textFieldControlGroup($model, 'card_category');
//        echo $form->textFieldControlGroup($model, 'sub_brand');
//        echo $form->textFieldControlGroup($model, 'latitude');
//        echo $form->textFieldControlGroup($model, 'longitude');
        ?>
        <div class="form-actions" style="padding-left: 12%;">
            <?php
            echo TbHtml::submitButton($model->isNewRecord ? 'Create' : 'Update BinList record', array(
                'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                'size' => TbHtml::BUTTON_SIZE_LARGE,
            ));
            echo TbHtml::submitButton('Load from provider', [
                'class' => 'btn btn-warning btn-large',
                'style' => 'margin-left: 5%',
                'name' => 'fromProvider',
                'value' => 1
            ]);
            ?>
        </div>

<?php $this->endWidget(); ?>

    </fieldset>
</div><!-- form -->