<?php
/* @var $this UsersController */
/* @var $model Users */
/* @var $newUser Users */
/* @var $form TbActiveForm */
/* @var $searchbox string */

$this->breadcrumbs = array(
    'Users' => '/users/manage',
    'Manage'
);

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
?>
<style>
    .ui-widget {
        font-family: "Open Sans";
        font-size: .8em;
    }
</style>

<form class="form-search" method="GET" action='/users/manage'>
    <div class="input-append">
        <?php
        echo CHtml::hiddenField('selectedvalue', '');

        $this->widget('zii.widgets.jui.CJuiAutoComplete', array(
            'name' => 'searchbox',
            'id' => 'searchbox',
            'value' => '',
            'source' => CController::createUrl('/users/search'),
            'options' => array(
                'showAnim' => 'fold',
                'minLength' => '4',
                'select' => 'js:function( event, ui ) {
                         $("#searchbox").val( ui.item.label );
                        location.href = "/users/manage?selectedvalue=" + ui.item.value;
//                        $("#selectedvalue").val( ui.item.value );
                        return false;
                  }',
            ),
            'htmlOptions' => array(
                'onfocus' => 'js: this.value = null; $("#searchbox").val(null); $("#selectedvalue").val(null);',
                'class' => 'input-xlarge search-query',
                'placeholder' => "Smart users search ...",
            ),
        ));
        ?>
        <button class="btn" type="submit">Submit</button>
    </div>
</form>
<?php
$isStaffLogged = Authorization::getIsStaffLogged();
if ($isStaffLogged)
    $ratingWidget = ' . $this->grid->controller->widget(\'CStarRating\',array(
                        \'name\'=>\'rating-\' . $data->id,
                        \'htmlOptions\'=>array(\'class\'=>\'rating\'),
                        \'value\'=>$data->userInfo->rating,
                        \'readOnly\'=>true,
                    ),true) . "<br>" . ';
else
    $ratingWidget = '.';

if (!empty($searchbox) && strlen($searchbox) <= 2) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_ERROR, 'We need minimum 3 letters for the search', array('style' => "max-width:300px;"));
}
if ((!empty($searchbox) && strlen($searchbox) > 2) || !empty($model->id))
    $this->widget('bootstrap.widgets.TbGridView', array(
        'id' => 'users-grid',
        'type' => TbHtml::GRID_TYPE_STRIPED . ' ' . TbHtml::GRID_TYPE_HOVER,
        'dataProvider' => $model->search2($searchbox),
        'ajaxUpdate' => true,
        'afterAjaxUpdate' => 'function(id, data) {
                $(".rating input").rating();
                $(".rating input").rating("readOnly");
            }',
        'columns' => array(
            array('header' => 'Data', 'value' => '"<b>ID: </b>". $data->id . "<br><b>Type: </b>" . $data->userInfo->userType->name . "<br>"'
                . $ratingWidget .
                '"<b>Balance: </b>" . number_format($data->userInfo->balance) . "<br><b>Limit: </b>" . number_format($data->userInfo->credit_limit) . "<br>"', 'type' => 'raw'),
            array('header' => 'User', 'value' => '"<b>User Info ID: </b>".$data->userInfo->id."<br><b>Name: </b>" . $data->name . "<br><b>Email: </b><a href=\'mailto:" . $data->email . "\'>". $data->email . "</a><br><b>Mobile: </b><a href=\'tel:" . $data->mobile . "\'>" . $data->mobile . "</a><br>"', 'type' => 'raw'),
            array('header' => 'User Status', 'value' => '"<b>Enabled: </b>" . ($data->enabled?"<span>Yes&nbsp;</span><a id=\'state-$data->id\' class=\'btn btn-mini btn-success\' onclick=\'switchState($data->id,0); return false;\'>Disable</a>":"<span>No&nbsp;&nbsp;</span><a id=\'state-$data->id\' class=\'btn btn-mini btn-danger\' onclick=\'switchState($data->id,1); return false;\'>Enable&nbsp;</a>") . "<br><b>Last login: </b>". $data->last_login . "<br><b>Last Transaction: </b>" . $data->last_transaction . "<br>"', 'type' => 'raw'),
            array('header' => 'Company', 'value' => '($data->isStaff || $data->userInfo->user_type_id==UserType::clientB2C) ? "" :
                "<b>Name: </b>" . $data->userInfo->name . "<br><b>Email: </b><a href=\'mailto:" . $data->userInfo->email . "\'>". $data->userInfo->email . "</a><br><b>Phone: </b><a href=\'tel:" . $data->userInfo->mobile . "\'>" . $data->userInfo->mobile . "</a><br>"', 'type' => 'raw'),
            array('header' => 'Actions', 'value' => '($data->userInfo->user_type_id==UserType::clientB2C ? "" : "<a class=\'btn btn-mini btn-primary\' href=\'/userInfo/update/$data->id\'>Config Company</a><br>")
                    . "<a class=\'btn btn-mini btn-primary\' href=\'/users/profile/$data->id\'>User profile</a><br>"' .
                ($isStaffLogged ? '. "<a class=\'btn btn-mini btn-primary\' onclick=\'emulationCheck($data->id); return false;\'>Emulate User</a><br>"' : ''),
                'type' => 'raw'),
        ),
    ));
?>

<div class="form span6">

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
        a.btn-primary {margin-bottom: 5%;}
        /*        .form-horizontal .control-label {
                    width: 116px;
                }
                .form-horizontal .controls {
                    margin-left: 120px;
                }*/
    </style>

    <div class="clearfix">
        <button class="pull-left btn btn-small" onclick="$(this.parentElement.nextElementSibling).toggle();
                this.blur();
                return false;"><i class="icon-eye-close"></i>&nbsp;&nbsp;<span class="label">New user</span></button>
    </div>
    <fieldset class="span3" style='display: <?php echo empty($newUser->errors) ? 'none' : 'block';?>'>
        <legend>Add new user:</legend>
        <?php
        echo $form->errorSummary($newUser);
        echo TbHtml::hiddenField('action', 'new_user');
        echo $form->textFieldControlGroup($newUser, 'name');
        echo $form->textFieldControlGroup($newUser, 'email');
        echo $form->textFieldControlGroup($newUser, 'mobile');
        echo \TbHtml::dropDownListControlGroup('Users[userTypeId]', null, [
            \UserType::frontlineStaff => 'FrontLine staff',
            \UserType::clientB2C => 'B2C client',
        ], ['label' => 'User Type']);
        echo TbHtml::submitButton('Add user', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
            'style' => 'margin-left: 30%; margin-top: 40px;'
        ));
        ?>
    </fieldset>

    <?php $this->endWidget(); ?>

</div>
<script>
    $(function () {
        $('#searchbox').focus();
    });

    function switchState(userId, status) {
        $.post('/users/manage', {action: 'user_status', id: userId, status: status}, function (data) {
            if (typeof data.result === 'undefined' || data.result != 'success') {
                alert(data.result);
            } else {
                if (status === 0) {
                    $('#state-' + userId).removeClass('btn-success').addClass('btn-danger').html('Enable&nbsp;').attr("onclick", 'switchState(' + userId + ',1)').prev().html('No&nbsp;&nbsp;');
                } else {
                    $('#state-' + userId).removeClass('btn-danger').addClass('btn-success').html('Disable').attr("onclick", 'switchState(' + userId + ',0)').prev().html('Yes&nbsp;');
                }
            }
        }, "json");
    }
    function emulationCheck(userId) {
        $.post('/users/manage', {action: 'emulation', id: userId}, function (data) {
            if (typeof data.result === 'undefined' || data.result !== 'success') {
                alert(data.result);
            } else {
                location.href = '/';
            }
        }, "json");
    }
</script>