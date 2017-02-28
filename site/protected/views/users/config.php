<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $form TbActiveForm */

$this->breadcrumbs = array(
    'Users' => '/users/manage',
    'Profile'
);
?>
<div class="form span9" style="margin-left: 0px;">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'users-newreg-form',
        'enableAjaxValidation' => false,
        'enableClientValidation' => true,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    ));
    echo $form->errorSummary($model, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
    ?>

    <style>
        legend {
            margin-bottom: 0;
            width: initial;
            border-bottom: 0;            
        }
        legend + .control-group {
            margin-top: 0;
        }
        .form-horizontal .control-label {
            width: 116px;
        }
        .form-horizontal .controls {
            margin-left: 120px;
        }
    </style>

    <fieldset class="span4" style="margin-left: 0">
        <legend >User information:</legend>
        <?php
        echo $form->textFieldControlGroup($model, 'name');
        echo $form->textFieldControlGroup($model, 'email');
        echo $form->textFieldControlGroup($model, 'mobile');
        echo $form->textFieldControlGroup($model, 'emp_code');
        echo $form->textFieldControlGroup($model, 'department');
        echo $form->textFieldControlGroup($model, 'location');
        echo $form->textFieldControlGroup($model, 'supervisor');
        echo $form->textFieldControlGroup($model, 'sales_rep');
        ?>
    </fieldset>
    <fieldset class="span4" style="margin-left: 1%">
        <legend >Address:</legend>
        <div class="row-fluid">
            <label style="float: left; padding-top: 3%; margin-right: 5px;">Address</label>
            <?php
            echo TbHtml::activeTextField($model, 'address', array('style' => 'width: 70%; float:right;'));
            echo TbHtml::error($model, 'address');
            ?>
        </div>
        <div class="row-fluid">
            <label style="float: left; padding-top: 3%; margin-right: 5px;">Country</label>
            <?php
            echo TbHtml::dropDownList('country', isset($model->city->state->country_id) ? $model->city->state->country_id : '100100', CHtml::listData(Country::model()->findAll(), 'id', 'name'), array('style' => 'width: 75%; float:right;', 'onchange' => 'getStates(false)'));
            ?>
        </div>
        <div class="row-fluid">
            <label style="float: left; padding-top: 3%; margin-right: 5px;">State</label>
            <?php
            echo TbHtml::dropDownList('state', ' ', CHtml::listData(State::model()->findAll('country_id=100100'), 'id', 'name'), array('style' => 'width: 75%; float:right;', 'empty' => 'Select state', 'onchange' => 'getCities(false)'));
            ?>
        </div>
        <div class="row-fluid">
            <label style="float: left; padding-top: 3%; margin-right: 5px;">City</label>
            <?php
            echo TbHtml::activeDropDownList($model, 'city_id', array(), array('style' => 'width: 75%; float:right;', 'empty' => '...', 'id' => 'city'));
            echo TbHtml::error($model, 'city_id');
            ?>
        </div>
        <div class="row-fluid" style="margin-bottom: 10px;">
            <label style="float: left; padding-top: 3%; margin-right: 5px;">Pincode</label>
            <?php 
            echo TbHtml::activeTextField($model, 'pincode', array('style' => 'width: 70%; float:right;'));
            echo TbHtml::error($model, 'pincode');
            ?>
            <label style="float: left; padding-top: 3%; margin-right: 5px; margin-top: 30px;">User Note</label>
            <?php echo TbHtml::activeTextArea($model, 'note', array('style' => 'width: 70%; float:right; margin-top: 30px;', 'rows' => 8)); ?>
        </div>
    </fieldset>
    <div class="clearfix"></div>
    <div class="form-actions" style="max-width: 600px;">
        <?php
        echo TbHtml::submitButton('Update Profile', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
            'style' => 'margin-left: 30%;'
        ));
        ?>
    </div>
    <?php $this->endWidget(); ?>
</div><!-- form -->

<form class="span3 form" method="POST" style="margin-left: 0">
    <?php 
  if (Yii::app()->user->hasFlash('pass_reset')) {
        echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('pass_reset'));
    }
    ?>
    <fieldset>
        <legend class="text-left">Reset the password and</legend>
        <?php
        echo TbHtml::checkBox('pass_reset_email', true, array('style' => 'float:left'));
        echo TbHtml::label('&nbsp;&nbsp;Send email to the user', null);
        echo TbHtml::checkBox('pass_reset_sms', false, array('style' => 'float:left'));
        echo TbHtml::label('&nbsp;&nbsp;Send SMS to the user', null);
        echo TbHtml::submitButton('Reset the password', array(
            'color' => TbHtml::BUTTON_COLOR_WARNING,
            'style' => 'margin-left: 25%;',
            'submit' => array(),
            'confirm' => 'Are you sure?'
        ));
        ?>
    </fieldset>
</form>


<script>
<?php
if (!empty($model->city_id)) {
    echo "var city = {$model->city_id};\n";
    echo "var state = {$model->city->state_id};\n";
    echo "var country = {$model->city->state->country_id};\n";
}
?>
    function getStates(initial) {
        var obj_id = $('#country').val();
        $.post('/site/getLocation', {object: 'country', id: obj_id}, function(data) {
            content = '<option value="">Select State</option>';
            for (key in data) {
                content += '<option value="' + data[key]['id'] + '">' + htmlEncode(data[key]['name']) + '</option>';
            }
            $('#state').html(content);
            if (initial && typeof state !== 'undefined') {
                document.getElementById('state').value = state;
                getCities(true);
            }
            if (!initial) {
                $('#city').html('<option value="">...</option>');
            }
        }, "json");
    }

    function getCities(initial) {
        var obj_id = $('#state').val();
        $.post('/site/getLocation', {object: 'state', id: obj_id}, function(data) {
            content = '<option value="">Select City</option>';
            for (key in data) {
                content += '<option value="' + data[key]['id'] + '">' + htmlEncode(data[key]['name']) + '</option>';
            }
            $('#city').html(content);
            if (initial && typeof city !== 'undefined') {
                document.getElementById('city').value = city;
            }
        }, "json");
    }

    function htmlEncode(value) {
        //create a in-memory div, set it's inner text(which jQuery automatically encodes)
        //then grab the encoded contents back out.  The div never exists on the page.
        return $('<div/>').text(value).html();
    }

    $(function() {
//        document.getElementById('country').value=country;
//        console.log(document.getElementsByName("country"));
<?php
if (!empty($model->city->state->country_id)) {
    echo "getStates(true);";
}
?>
    });
</script>