
<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $userInfo userInfo */
/* @var $form TbActiveForm */
?>
<div class="ibox-title">Register new user</div>
<div class="ibox-content">
<div class="form span12">

    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'users-newreg-form',
        // Please note: When you enable ajax validation, make sure the corresponding
        // controller action is handling ajax validation correctly.
        // See class documentation of CActiveForm for details on this,
        // you need to use the performAjaxValidation()-method described there.
        'enableAjaxValidation' => false,
        'enableClientValidation' => true,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    ));
    echo $form->errorSummary(array($model, $userInfo), '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
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

    <fieldset class="span3">
        <legend >Company info:</legend>
        <?php
        echo $form->textFieldControlGroup($userInfo, 'name');
        echo $form->textFieldControlGroup($userInfo, 'email');
        echo $form->textFieldControlGroup($userInfo, 'mobile');
        echo $form->textFieldControlGroup($userInfo, 'pan_number');
        echo $form->textFieldControlGroup($userInfo, 'pan_name');
        echo $form->radioButtonListControlGroup($userInfo, 'user_type_id', array(
            3 => 'Agent',
            6 => 'Corporate'
        ));
        ?>
    </fieldset>
    <fieldset class="span4" style="margin-left: 1%">
        <legend >Person In-Charge info:</legend>
        <?php
        echo $form->textFieldControlGroup($model, 'name');
        echo $form->textFieldControlGroup($model, 'email');
        echo $form->textFieldControlGroup($model, 'mobile');
        ?>
    </fieldset>
    <fieldset class="span3" style="margin-left: 1%">
        <legend >Address:</legend>
        <div class="control-group">
            <label class="control-label" >Address
                <span class="required">*</span>
            </label>
            <?php
//            echo $form->textFieldControlGroup($model, 'address');
            echo TbHtml::activeTextField($model, 'address', array());
            echo TbHtml::error($userInfo, 'address');
            ?>
        </div>
        <div class="control-group">
            <label class="control-label">Country</label>
            <?php
            echo TbHtml::dropDownList('country', isset($_POST['country']) ? $_POST['country'] : '100100', CHtml::listData(Country::model()->findAll(), 'id', 'name'), array('onchange' => 'getStates(false)'));
            ?>
        </div>
        <div class="control-group">
            <label class="control-label" >State</label>
            <?php
            echo TbHtml::dropDownList('state', ' ', CHtml::listData(State::model()->findAll('country_id=100100'), 'id', 'name'), array('empty' => 'Select state', 'onchange' => 'getCities(false)'));
            ?>
        </div>
        <div class="control-group">
            <label class="control-label">City
                <span class="required">*</span>
            </label>
            <?php
            echo TbHtml::activeDropDownList($userInfo, 'city_id', array(), array('empty' => '...', 'id' => 'city'));
            echo TbHtml::error($userInfo, 'city_id');
            ?>
        </div>
        <div class="control-group" style="margin-bottom: 10px;">
            <label class="control-label">Pincode
                <span class="required">*</span>
            </label>
            <?php
//            echo $form->textFieldControlGroup($model, 'pincode');
            echo TbHtml::activeTextField($userInfo, 'pincode', array());
            echo TbHtml::error($userInfo, 'pincode');
            ?>
        </div>
    </fieldset>
    <div class="clearfix"></div>
    <?php
//    echo $form->textAreaControlGroup($model, 'note', array('span' => 4, 'rows' => 5));
    ?>

    <div class="form-actions" style="max-width: 700px;">
        <?php
        echo $form->checkBoxControlGroup($model, 'terms', array('label' => "I agree with the <a href='/site/page?view=terms' target='_blank'>terms & conditions</a>"));
        echo TbHtml::submitButton('Register', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
            'style' => 'margin-left: 30%;'
        ));
        ?>
    </div>

    <?php $this->endWidget(); ?>

</div><!-- form -->

<script>
<?php
if (!empty($_POST['state']))
    echo "var state = {$_POST['state']};";
if (!empty($_POST['Users']['city_id']))
    echo "var city = {$_POST['Users']['city_id']};";
?>
    function getStates(initial) {
        var obj_id = $('#country').val();
        $.post('/site/getLocation', {object: 'country', id: obj_id}, function(data) {
            content = '<option value="">Select State</option>';
            for (key in data) {
                content += '<option value="' + data[key]['id'] + '">' + htmlEncode(data[key]['name']) + '</option>';
            }
            $('#state').html(content);
            if (initial && typeof state != 'undefined') {
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
            if (initial && typeof city != 'undefined') {
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
if (!empty($_POST['country'])) {
    echo "getStates(true);";
}
?>
    });
</script>
</div>