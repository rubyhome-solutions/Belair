<?php
/* @var $this TravelerController */
/* @var $model Traveler */
/* @var $form TbActiveForm */

$titles_id = \TravelerTitle::$titlesId;
$form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
    'id' => 'traveler-form',
    'enableAjaxValidation' => false,
    'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    'enableClientValidation' => true,
    'action' => $model->isNewRecord ? "/traveler/create" : "/traveler/update/{$model->id}"
        ));
echo $form->errorSummary($model);
?>
<fieldset>
    <legend>Traveler:</legend>
    <div class="control-group">
        <label class="control-label required" for="Traveler_first_name">First Name<span class="required">*</span></label>
        <div class="controls">
            <?php
            echo $form->dropDownList($model, 'traveler_title_id', CHtml::listData(\TravelerTitle::model()->cache(3600)->findAllByAttributes(['id' => $titles_id], ['order' => 'id']), 'id', 'name'), array('style' => 'max-width: 70px;'));
            echo $form->textField($model, 'first_name', array('style' => 'max-width: 150px;'));
            echo $form->error($model, 'first_name');
            ?>
        </div>
    </div>
    <?php
    echo $form->textFieldControlGroup($model, 'last_name');
    $orgFirstName = $model->first_name;
    $orgLastName = $model->last_name;
    $model->namesBeautify();
//    \Utils::dbgYiiLog(['f_name' => $model->first_name, 'l_name' => $model->last_name]);
    echo \TbHtml::textFieldControlGroup('a1_name', '', [
        'disabled' => true,
        'label' => 'Amadeus formated',
        'prepend' => $model->first_name,
        'append' => $model->last_name,
        'style' => 'width: 20px;'
    ]);
    // Restore the original names
    $model->first_name = $orgFirstName;
    $model->last_name = $orgLastName;

    echo $form->textFieldControlGroup($model, 'mobile');
    echo $form->textFieldControlGroup($model, 'email');
//        echo TbHtml::label('Birthdate', 'Traveler_birthdate');
//        echo $form->dateFieldControlGroup($model, 'birthdate');
    ?>
    <div class="control-group">
        <label class="control-label required" for="Traveler_birthdate">Birthdate</label>
        <div class="controls">
            <!--                <div class="input-prepend">
                                <span class="add-on"><i class="icon-calendar lg"></i></span>-->
            <?php
            $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                'name' => 'Traveler[birthdate]',
                'model' => $model,
                'attribute' => 'birthdate',
                'id' => 'Traveler_birthdate',
                // additional javascript options for the date picker plugin
                'options' => array(
                    //                'showAnim' => 'fold',
                    'dateFormat' => 'yy-mm-dd',
                    'changeMonth' => 'true',
                    'changeYear' => 'true',
                    'yearRange' => 'c-30:c',
                    'defaultDate' => '-20Y',
                    'maxDate' => "-10D",
                ),
                'htmlOptions' => array(
                    'style' => 'max-width: 100px;',
                    'size' => 10,
                    'maxlength' => 10,
                    'placeholder' => 'YYYY-MM-DD'
                ),
            ));
            ?>
            <!--</div>-->
            <p id="Traveler_birthdate_em_" style="display:none" class="help-block"></p>
        </div>
    </div>
    <?php
    if (!$model->isNewRecord) {
//            echo $form->radioButtonListControlGroup($model, 'gender_id', array(1 => 'Male', 2 => 'Female'), array('inline' => true, 'value' => 1));
//            echo $form->textFieldControlGroup($model, 'frequent_flier');
        if (!isset($model->passport_country_id))
            $model->passport_country_id = 100100;
        echo $form->dropDownListControlGroup($model, 'passport_country_id', CHtml::listData(Country::model()->findAll(array('order' => 'id')), 'id', 'name'));
        echo $form->textFieldControlGroup($model, 'passport_number');
        ?>
        <div class="control-group">
            <label class="control-label required" for="Traveler_passport_issue">Passport issue date</label>
            <div class="controls">
                <?php
                $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                    'name' => 'Traveler[passport_issue]',
                    'model' => $model,
                    'attribute' => 'passport_issue',
                    'id' => 'Traveler_passport_issue',
                    // additional javascript options for the date picker plugin
                    'options' => array(
                        //                'showAnim' => 'fold',
                        'dateFormat' => 'yy-mm-dd',
                        'changeMonth' => 'true',
                        'changeYear' => 'true',
                        'yearRange' => 'c-10:c',
                        'defaultDate' => '-1Y',
                        'maxDate' => "0D",
                    ),
                    'htmlOptions' => array(
                        'style' => 'max-width: 100px;',
                        'size' => 10,
                        'maxlength' => 10,
                        'placeholder' => 'YYYY-MM-DD'
                    ),
                ));
                ?>
                <p id="Traveler_passport_issue_em_" style="display:none" class="help-block"></p>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label required" for="Traveler_passport_expiry">Passport expiry date</label>
            <div class="controls">
                <?php
                $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                    'name' => 'Traveler[passport_expiry]',
                    'model' => $model,
                    'attribute' => 'passport_expiry',
                    'id' => 'Traveler_passport_expiry',
                    // additional javascript options for the date picker plugin
                    'options' => array(
                        //                'showAnim' => 'fold',
                        'dateFormat' => 'yy-mm-dd',
                        'changeMonth' => 'true',
                        'changeYear' => 'true',
                        'yearRange' => 'c:c+5',
                        'defaultDate' => '+1Y',
                        'maxDate' => "+10Y",
                        'minDate' => "0",
                    ),
                    'htmlOptions' => array(
                        'style' => 'max-width: 100px;',
                        'size' => 10,
                        'maxlength' => 10,
                        'placeholder' => 'YYYY-MM-DD'
                    ),
                ));
                ?>
                <p id="Traveler_passport_expiry_em_" style="display:none" class="help-block"></p>
            </div>
        </div>
        <?php
//            echo $form->textFieldControlGroup($model, 'passport_expiry');
        echo $form->textFieldControlGroup($model, 'passport_place');
//            echo $form->textFieldControlGroup($model, 'phone');
//            echo $form->textFieldControlGroup($model, 'email2');
//            echo $form->textFieldControlGroup($model, 'address');
        ?>
        <!--            <div class="control-group">
                        <label class="control-label">State</label>
                        <div class="controls">
        <?php
//                    echo TbHtml::dropDownList('state', ' ', CHtml::listData(State::model()->findAll("country_id=$model->passport_country_id"), 'id', 'name'), array('empty' => 'Select state', 'onchange' => 'getCities(false)'));
        ?>
                        </div>
                    </div>-->
        <!--            <div class="control-group">
                        <label class="control-label">City</label>
                        <div class="controls">
        <?php
//                    echo TbHtml::activeDropDownList($model, 'city_id', array(), array('empty' => '...', 'id' => 'city'));
//                    echo TbHtml::error($model, 'city_id');
        ?>
                        </div>
                    </div>-->

        <?php
//            echo $form->textFieldControlGroup($model, 'city_id');
//            echo $form->textFieldControlGroup($model, 'pincode');
    }
    ?>

    <div class="form-actions" style="margin-bottom: 0px;">
        <?php
        echo TbHtml::submitButton($model->isNewRecord ? 'Create' : '<i class="fa fa-save fa-lg"></i>&nbsp;&nbsp;Save', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
            'encode' => false,
        ));
        ?>
    </div>
</fieldset>

<?php $this->endWidget(); ?>
<style>
    legend {
        margin-bottom: 0;
        width: initial;
        border-bottom: 0;            
    }
    legend + .control-group {
        margin-top: 0;
    }
</style>
