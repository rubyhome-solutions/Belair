<?php
$countryList = CHtml::listData(\Country::model()->cache(3600)->findAll([
                    'order' => 't.name'
                ]), 'code', 'name');
$tzArray = CHtml::listData($model->findAll([
                    'distinct' => true,
                ]), 'timezone', 'timezone');
?>
<div class="form">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'airport-form',
        'layout' => TbHtml::FORM_LAYOUT_INLINE,
        'enableAjaxValidation' => false,
    ));
//    $model->addError('name', 'Just a test error');
    echo $form->errorSummary($model);
    ?>
    <table class="table table-condensed table-bordered" style="max-width: 85%">
        <tr>
            <th>Airport Name</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'airport_name'); ?></td>
        </tr>
        <tr>
            <th>Airport Code</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'airport_code'); ?></td>
        </tr>
        <tr>
            <th>Country Name</th>
            <td class="center"><?php
                echo
                TbHtml::activeDropDownList($model, 'country_code', $countryList, array(
                    'prompt' => 'Select Country',
                    'ajax' => array(
                        'type' => 'POST',
                        'url' => CController::createUrl('xRate/getStates'),
                        'data' => array('country_code' => 'js:this.value'),
                        'update' => '#state_name',
                )));
                ?></td>

        </tr>
        <tr>
            <th>State Name</th>
            <td class="center"><?php
                echo CHtml::dropDownList('state_name', '', array(), array(
                    'prompt' => 'Select State',
                    'ajax' => array(
                        'type' => 'POST',
                        'url' => Yii::app()->createUrl('xRate/getCities'), //  get states list
                        'update' => '#city_name', // add the state dropdown id
                        'data' => array('state_id' => 'js:this.value'),
                )));
                ?></td>
        </tr>

        <tr>
            <th>City Name</th>
            <td class="center"><?php
                echo CHtml::dropDownList('city_name', '', array(), array(
                    'prompt' => 'Select City',
                        )
                );
                ?>

            </td>
        </tr>
        <tr>
            <th>City Code</th>
            <td class="center"><?php echo TbHtml::activeTextField($model, 'city_code'); ?>

            </td>
        </tr>

        <tr>
            <th>Timezone</th>
            <td class="center"><?php
                echo
                TbHtml::activeDropDownList($model, 'timezone', $tzArray, array(
                    'prompt' => 'Select Timezone',
                ));
                ?></td>
        </tr>
        <tr class="center">
            <td></td>
            <td><?php
                echo TbHtml::submitButton('Create New Airport', array(
                    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
                    'size' => TbHtml::BUTTON_SIZE_DEFAULT,
                ));
                ?>
            </td>
        </tr>
    </table>

<?php $this->endWidget(); ?>

</div><!-- form -->



