<div class="ibox-content m_top1">
<?php
/* @var $this UserInfoController */
/* @var $model UserInfo */
/* @var $user Users */
/* @var $form TbActiveForm */
$this->breadcrumbs = [
    'Users' => ['users/manage?selectedvalue=' . $user->id],
    'Company info',
];
$isStaffLogged = Authorization::getIsStaffLogged();
$canEdit = Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_COMPANY_INFO);
//Yii::log(print_r($user->userInfo->user_type_id, true));
?>
<div class="form span8" style="margin-left: 0px;">
    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'companyInfo-form',
        'enableAjaxValidation' => false,
        'enableClientValidation' => true,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    ));
    echo $form->errorSummary($model, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
    ?>
    <fieldset class="span4" style="margin-left: 0">
        <legend >Company information:</legend>
        <?php
        echo $form->textFieldControlGroup($model, 'name', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'email', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'mobile', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'pan_name', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'pan_number', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'stn_number', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'cc_email_list', array('disabled' => !$canEdit));
        if ($model->user_type_id != UserType::corporateB2E) {
            echo $form->textFieldControlGroup($model, 'from_to_email', array('disabled' => !$canEdit));
        }
        if ($isStaffLogged) {
            echo $form->dropDownListControlGroup($model, 'commercial_plan_id', CHtml::listData(\CommercialPlan::model()->findAll(array('order' => 'name')), 'id', 'name'), array('disabled' => !$canEdit, 'prompt' => 'Select plan ...'));
            echo $form->textFieldControlGroup($model, 'xrate_commission', ['append' => '%', 'style' => 'width: 40px;']);
        }
        echo $form->textFieldControlGroup($model, 'tds', ['disabled' => !$canEdit, 'append' => '%', 'style' => 'width: 40px;']);
        echo $form->textAreaControlGroup($model, 'note', array('rows' => 9, 'disabled' => !$canEdit));
        ?>
    </fieldset>
</div>
    </div>
    <div class="ibox-content m_top1 admindata">
    <fieldset class="span3" style="margin-left: 1%">
        <legend>Admin data:</legend>
        <?php
        echo $form->dropDownListControlGroup($model, 'currency_id', CHtml::listData(Currency::model()->findAll(array('order' => 'id')), 'id', 'name'), array('disabled' => !$isStaffLogged, 'span' => 2));
        echo $form->dropDownListControlGroup($model, 'user_type_id', CHtml::listData(UserType::model()->findAll(array('order' => 'leading_char')), 'id', 'name'), array('disabled' => !$isStaffLogged, 'span' => 2, 'id' => 'companyTypeSelector'));
        echo $form->textFieldControlGroup($model, 'balance', array('disabled' => true, 'span' => 2));
        echo $form->textFieldControlGroup($model, 'credit_limit', array('disabled' => !$isStaffLogged, 'span' => 2));
        echo $form->checkBoxControlGroup($model, 'one_time_limit', array('disabled' => !$isStaffLogged));
        ?>
        <?php if ($isStaffLogged) { ?>
            <div class="control-group">
                <label style="padding-top: 0;" class="control-label col-md-2" for="UserInfo_rating">Company Rating</label>
                <div class="controls col-md-8" style="padding-left: 5px;margin-top: 2px;">
                    <?php
                    $this->widget('CStarRating', array(
                        'name' => 'UserInfo[rating]',
                        'id' => 'UserInfo_rating',
                        'readOnly' => !$isStaffLogged,
                        'resetText' => 'Zero rating',
                        'value' => $model->rating
                    ));
                    ?>
                </div>
            </div>
        <?php } ?>

    </fieldset>
    </div>
    <div class="ibox-content m_top1 companyAddress">
    <fieldset class="span3" style="margin-left: 1%">
        <legend >Company Address:</legend>
        <div class="row-fluid">
            <label style="  margin-right: 5px;">Address</label>
            <?php
            echo TbHtml::activeTextField($model, 'address', array('style' => 'width: 70%; float:right;', 'disabled' => !$canEdit));
            echo TbHtml::error($model, 'address');
            ?>
        </div>
        <div class="clearfix"></div>
        <div class="row-fluid">
            <label style="  margin-right: 5px;">Country</label>
            <?php
            echo TbHtml::dropDownList('country', isset($model->city->state->country_id) ? $model->city->state->country_id : '100100', CHtml::listData(Country::model()->findAll(), 'id', 'name'), array('style' => 'width: 75%; float:right;', 'onchange' => 'getStates(false)', 'disabled' => !$canEdit));
            ?>
        </div>
        <div class="clearfix"></div>
        <div class="row-fluid">
            <label style=" margin-right: 5px;">State</label>
            <?php
            echo TbHtml::dropDownList('state', ' ', CHtml::listData(State::model()->findAll('country_id=100100'), 'id', 'name'), array('style' => 'width: 75%; float:right;', 'empty' => 'Select state', 'onchange' => 'getCities(false)', 'disabled' => !$canEdit));
            ?>
        </div>
        <div class="clearfix"></div>
        <div class="row-fluid">
            <label style=" margin-right: 5px;">City</label>
            <?php
            echo TbHtml::activeDropDownList($model, 'city_id', array(), array('style' => 'width: 75%; float:right;', 'empty' => '...', 'id' => 'city', 'disabled' => !$canEdit));
            echo TbHtml::error($model, 'city_id');
            ?>
        </div>
        <div class="clearfix"></div>
        <div class="row-fluid" style="margin-bottom: 10px;">
            <label style="  margin-right: 5px;">Pincode</label>
            <?php
            echo TbHtml::activeTextField($model, 'pincode', array('style' => 'width: 70%; float:right;', 'disabled' => !$canEdit));
            echo TbHtml::error($model, 'pincode');
            ?>
        </div>
    </fieldset>
    
        
        <div class="form-actions " style="padding-left: 0;">
        <?php
        echo TbHtml::submitButton('Update the company data', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
            'onclick' => ($canEdit ? false : 'alert(\'You do not have the permission to edit the company info.\nPlease ask the supervisor to make the changes!\'); return false;'),
            'encode' => false
        ));
        ?>
        </div>
 </div>
<div class="clearfix"></div>   
<div class="ibox-content m_top1">   
    <?php $this->endWidget(); ?>


<form class="form span4" style="margin-left: 0px;" method="POST" enctype="multipart/form-data">
    <fieldset>
        <legend >Files:</legend>
        <table class="table table-bordered table-hover table-condensed"><thead><th>File</th><th>Type</th></thead>
            <?php
            foreach ($model->userFiles as $file) {
                if (Authorization::can(Authorization::DOWNLOAD_COMPANY_DOCUMENT, array('doc_id' => $file->id)) === true) {
                    ?>
                    <tr><td><a href='/userInfo/download/<?php echo $file->id; ?>' ><?php echo $file->name; ?></a></td><td><?php echo $file->docType->name; ?></td>
                        <td><button name="fileDelete" value="<?php echo $file->id; ?>" type="submit" class="btn btn-mini btn-danger" formenctype="application/x-www-form-urlencoded">Delete</button></td></tr>
                    <?php
                }
            }
            ?>
        </table>
        <hr>
        <?php
        if (Yii::app()->user->hasFlash('files_msg')) {
            echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('files_msg'));
        }
        ?>

        <!--<div class="clearfix"></div>-->

        <div class="row-fluid">
            <div class="fileUpload btn btn-primary">
                <span>Choose file</span>
                <input  id="uploadBtn" name="filename" type="file" class="upload" accept="image/*|application/pdf"/>
            </div>
            <input id="uploadFile" placeholder="No file chosen" disabled="disabled" />
        </div>
        <label style="float: left; padding-top: 1%; "><b>File Type&nbsp;&nbsp;</b></label>
        <?php
        echo TbHtml::dropDownList('file_type', DocType::OTHER_FILE_TYPE, CHtml::listData(DocType::model()->findAll(array(
                            'order' => 'id',
                            'condition' => $model->getLogo() ? "id>" . DocType::LOGO_FILE_TYPE : "",
                        )), 'id', 'name'), array('style' => 'margin-left: 8%; width:61%;'));
        ?>
        <div class="clearfix"></div>
        <label class="checkbox" style="float: left; margin-left: 5%; display: <?php echo (Authorization::getIsStaffLogged()) ? 'block' : 'none'; ?>" >
            <input type="checkbox" checked value="1" name="file_user_visible" id="file_user_visible"> Visible by the user
        </label>
        <div class="clearfix"></div>
            <?php
        echo TbHtml::submitButton('Add new file', array(
            'color' => TbHtml::BUTTON_COLOR_WARNING,
            'style' => 'margin-left: 3%;',
        ));
        ?>
    </fieldset>
</form>
        </div>
<form id="formSelectDistributor" class="form span4" style="margin-left: 0px; display: <?php echo ($model->user_type_id == UserType::agentUnderDistributor) ? 'block' : 'none'; ?>" method="POST">
    <?php
    if (Yii::app()->user->hasFlash('distributor_msg')) {
        echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('distributor_msg'));
    }
    ?>
    <fieldset>
        <legend >Distributor:</legend>
        <div class="row-fluid">
            <label style="float: left; padding-top: 1%;"><b>Under Distributor</b></label>
            <?php
//            echo CHtml::hiddenField('set_distributor', '1');
            echo TbHtml::dropDownList('distributor', isset($model->distributor->distributor_id) ? $model->distributor->distributor_id : ' ', CHtml::listData(UserInfo::model()->findAllBySql(
                                    'SELECT * FROM user_info
                                WHERE user_type_id = :distributorTypeId AND id<>:modelId
                                ORDER BY name;', array(':modelId' => $model->id, ':distributorTypeId' => UserType::distributor)), 'id', 'name'), array('style' => 'float:right;', 'empty' => 'Select distributor', 'disabled' => !$canEdit));
            ?>
        </div>
        <?php
        echo TbHtml::submitButton('Save distributor', array(
            'color' => TbHtml::BUTTON_COLOR_WARNING,
            'style' => 'margin-left: 25%;',
        ));
        ?>
    </fieldset>
</form>
</div>
<style>
    .table th {text-align: center;}
    .table td {vertical-align: middle;}
    .fileUpload {
        position: relative;
        overflow: hidden;
        margin: 5px;
    }
    .fileUpload input.upload {
        position: absolute;
        top: 0;
        right: 0;
        margin: 0;
        padding: 0;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        filter: alpha(opacity=0);
    }

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

<script>
    document.getElementById("uploadBtn").onchange = function () {
        document.getElementById("uploadFile").value = this.value.replace(/C:\\fakepath\\/i, '');
    };

<?php
if (!empty($model->city_id)) {
    echo "var city = {$model->city_id};\n";
    echo "var state = {$model->city->state_id};\n";
    echo "var country = {$model->city->state->country_id};\n";
}
?>
    function getStates(initial) {
        var obj_id = $('#country').val();
        $.post('/site/getLocation', {object: 'country', id: obj_id}, function (data) {
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
        $.post('/site/getLocation', {object: 'state', id: obj_id}, function (data) {
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

    $(function () {
<?php
if (!empty($model->city->state->country_id)) {
    echo "getStates(true);\n";
}
?>
        $('#companyTypeSelector').change(function () {
            var companyTypeId = $(this).val();
            if (companyTypeId === '<?php echo UserType::agentUnderDistributor; ?>') {
                $('#formSelectDistributor').show();
            } else {
                $('#formSelectDistributor').hide();
            }
        }
        )

    });
</script>
