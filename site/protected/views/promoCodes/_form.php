<?php
//Yii::import('application.extensions.multicomplete.MultiComplete');
$cs = Yii::app()->getClientScript();
$baseUrl = Yii::app()->baseUrl;
$cs->registerCssFile($baseUrl . '/css/token-input.css');
$cs->registerCssFile($baseUrl . '/css/token-input-facebook.css');
$cs->registerScriptFile($baseUrl . '/js/jquery.tokeninput.js');


$isStaffLogged = Authorization::getIsStaffLogged();
$canEdit = Authorization::getDoLoggedUserHasPermission(Permission::MANAGE_COMPANY_INFO);
?>
<style>
    
     .table th, .table td {vertical-align: middle;}        
    .table th, td.center {
        text-align: center;
    }
    .heading {
        font-weight: bold;
        background-color: #fef8b8;
    }
    .table.filter-table td input {width: 95%; margin-bottom: auto;}
    .table.filter-table {margin-bottom: auto;}
    .shadow {
        box-shadow: 10px 10px 5px #888888; 
        background-color: aliceblue;
    }
    .sinkavo {background-color: #f5f5ff;}
    .label {font-size: inherit;} 
</style>
<div class="form span16" style="margin-left: 0px;">
    <?php
    $form = $this->beginWidget('bootstrap.widgets.TbActiveForm', array(
        'id' => 'companyInfo-form',
        'enableAjaxValidation' => false,
        'enableClientValidation' => true,
        'layout' => TbHtml::FORM_LAYOUT_HORIZONTAL,
    ));
    echo $form->errorSummary($model, '<button type="button" class="close" data-dismiss="alert">&times;</button>', NULL, array('style' => 'max-width: 800px;'));
    ?>
    <fieldset class="span8" style="margin-left: 0">
        <legend >Promo Code Details</legend>
        <?php
        echo $form->textFieldControlGroup($model, 'code', array('disabled' => !$canEdit));
        echo $form->dropDownListControlGroup($model, 'promo_type_id', CHtml::listData(\PromoType::model()->findAll(array('order' => 'name')), 'id', 'name'), array('disabled' => !$canEdit, 'prompt' => 'Select Promo type ...'));
        echo $form->dropDownListControlGroup($model, 'promo_discount_type_id', CHtml::listData(\PromoDiscountType::model()->findAll(array('order' => 'name')), 'id', 'name'), array('disabled' => !$canEdit, 'prompt' => 'Select Promo Discount type ...'));
        echo $form->textFieldControlGroup($model, 'value', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'min_amount', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'max_value', array('disabled' => !$canEdit));
        echo $form->dropDownListControlGroup($model, 'promo_date_type_id', CHtml::listData(\PromoDateType::model()->findAll(array('order' => 'name')), 'id', 'name'), array('disabled' => !$canEdit, 'prompt' => 'Select Valid Date Type ...'));
        ?>
        <div class="control-group">
            <label class="control-label required" >Valid From</label>
            <div class="controls">
                <?php
                $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                    'name' => 'PromoCodes[date_valid_from]',
                    'model' => $model,
                    'attribute' => 'date_valid_from',
                    'id' => 'date_valid_from',
                    // additional javascript options for the date picker plugin
                    'options' => array(
                        //                'showAnim' => 'fold',
                        'dateFormat' => 'yy-mm-dd',
                        'changeMonth' => 'true',
                        'changeYear' => 'true',
                        'maxDate' => "+10Y",
                        'minDate' => "0",
                    ),
                    'htmlOptions' => array(
                        'style' => 'max-width: 100px;',
                        'size' => 10,
                        'maxlength' => 10,
                        'placeholder' => 'YYYY-MM-DD',
                        'disabled' => !$canEdit
                    ),
                ));
                ?>
                <p id="date_valid_from_em_" style="display:none" class="help-block"></p>
            </div>
        </div>
        <div class="control-group">
            <label class="control-label required" >Valid To</label>
            <div class="controls">
                <?php
                $this->widget('zii.widgets.jui.CJuiDatePicker', array(
                    'name' => 'PromoCodes[date_valid_to]',
                    'model' => $model,
                    'attribute' => 'date_valid_to',
                    'id' => 'date_valid_to',
                    // additional javascript options for the date picker plugin
                    'options' => array(
                        //                'showAnim' => 'fold',
                        'dateFormat' => 'yy-mm-dd',
                        'changeMonth' => 'true',
                        'changeYear' => 'true',
                        'maxDate' => "+10Y",
                        'minDate' => "0",
                    ),
                    'htmlOptions' => array(
                        'style' => 'max-width: 100px;',
                        'size' => 10,
                        'maxlength' => 10,
                        'placeholder' => 'YYYY-MM-DD',
                        'disabled' => !$canEdit
                    ),
                ));
                ?>
                <p id="date_valid_to_em_" style="display:none" class="help-block"></p>
            </div>
        </div>
        <?php
        echo $form->textFieldControlGroup($model, 'ref_value', array('disabled' => !$canEdit,'class'=>'ref_class'));
        echo $form->dropDownListControlGroup($model, 'ref_value_type_id', CHtml::listData(\PromoDiscountType::model()->findAll(array('order' => 'name')), 'id', 'name'), array('disabled' => !$canEdit, 'prompt' => 'Select Referred Value type ...','class'=>'ref_class'));
        echo $form->textFieldControlGroup($model, 'ref_max_value', array('disabled' => !$canEdit,'class'=>'ref_class'));
       ?>
        <div class="control-group">
            <label class="control-label" for="PromoCodes_ref_user_info_id">Referred By</label>
            <div class="controls">
                <input id="token_ref_user_info" placeholder="Referred By" type="text" value="" class='ref_class' name="PromoCodes[ref_user_info_id]" >
            </div>
        </div>
        
       <?php
        echo $form->dropDownListControlGroup($model,'way_type', \PromoCodes::$waytypeMap, array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'max_count', array('disabled' => !$canEdit));
        echo $form->checkBoxControlGroup($model, 'per_user', array('disabled' => !$canEdit));
        echo $form->checkBoxControlGroup($model, 'enabled', array('disabled' => !$canEdit));
        echo $form->textFieldControlGroup($model, 'tnc_url', array('disabled' => !$canEdit, 'style'=>'width:80%;'));
        ?>

                
        <table class="table table-condensed filter-table table-bordered shadow">
            <tr class="heading">
                <th>Filter type</th>
                <th>Include</th>
                <th>Exclude</th>
            </tr>
            <tr>
                <th class="heading">Air Sources</th>
                <td><input id="token_airsource_include" placeholder="Airsources seperated by comma" type="text" value="" name="PromoFilter[include][air_sources]" ></td>
                <td><input id="token_airsource_exclude" placeholder="Airsources seperated by comma" type="text" value="" name="PromoFilter[exclude][air_sources]" ></td>
            </tr>
            <tr>
                <th class="heading">User Types</th>
                <td><input id="token_usertype_include" placeholder="User Types seperated by comma" type="text" value="" name="PromoFilter[include][user_types]" ></td>
                <td><input id="token_usertype_exclude" placeholder="User Types seperated by comma" type="text" value="" name="PromoFilter[exclude][user_types]" ></td>
            </tr>
            <tr>
                <th class="heading">User Infos</th>
                <td><input id="token_userinfo_include" placeholder="User Infos seperated by comma" type="text" value="" name="PromoFilter[include][user_infos]" ></td>
                <td><input id="token_userinfo_exclude" placeholder="User Infos seperated by comma" type="text" value="" name="PromoFilter[exclude][user_infos]" ></td>
            </tr>
            <tr>
                <th class="heading">Air Lines</th>
                <td><input id="token_airlines_include" placeholder="Air Lines seperated by comma" type="text" value="" name="PromoFilter[include][airlines]" ></td>
                <td><input id="token_airlines_exclude" placeholder="Air Lines seperated by comma" type="text" value="" name="PromoFilter[exclude][airlines]" ></td>
            </tr>
            <tr>
                <th class="heading">Users</th>
                <td><input id="token_users_include" placeholder="Users seperated by comma" type="text" value="" name="PromoFilter[include][users]" ></td>
                <td><input id="token_users_exclude" placeholder="Users seperated by comma" type="text" value="" name="PromoFilter[exclude][users]" ></td>
            </tr>

        </table>
    </fieldset>
    
    <div class="clearfix"></div>
    <div class="form-actions text-center" style="padding-left: 0;">
        <?php
        echo TbHtml::submitButton($model->isNewRecord ? 'Create New Promo Code' : 'Update Promo Code', array(
            'color' => TbHtml::BUTTON_COLOR_PRIMARY,
            'size' => TbHtml::BUTTON_SIZE_LARGE,
            'onclick' => ($canEdit ? false : 'alert(\'You do not have the permission to edit the company info.\nPlease ask the supervisor to make the changes!\'); return false;'),
        ));
        ?>
    </div>

    <?php $this->endWidget(); ?>
</div>


<script type="text/javascript">
    $(document).ready(function () {
        $("#token_airsource_include").tokenInput("/promoCodes/searchAirsource", 
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['airsource_include'])) echo 'prePopulate:'.$promoFilterString['airsource_include'] ;  ?>});
        $("#token_airsource_exclude").tokenInput("/promoCodes/searchAirsource",
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['airsource_exclude'])) echo 'prePopulate:'.$promoFilterString['airsource_exclude'] ;  ?>});
        $("#token_usertype_include").tokenInput("/promoCodes/searchUserType", 
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['user_types_include'])) echo 'prePopulate:'.$promoFilterString['user_types_include'] ;  ?>});
        $("#token_usertype_exclude").tokenInput("/promoCodes/searchUserType", 
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['user_types_exclude'])) echo 'prePopulate:'.$promoFilterString['user_types_exclude'] ;  ?>});
        $("#token_userinfo_include").tokenInput("/promoCodes/searchUserInfo",
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['user_infos_include'])) echo 'prePopulate:'.$promoFilterString['user_infos_include'] ;  ?>});
        $("#token_userinfo_exclude").tokenInput("/promoCodes/searchUserInfo",
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['user_infos_exclude'])) echo 'prePopulate:'.$promoFilterString['user_infos_exclude'] ;  ?>});
        $("#token_airlines_include").tokenInput("/promoCodes/searchAirlines",
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['airlines_include'])) echo 'prePopulate:'.$promoFilterString['airlines_include'] ;  ?>});
        $("#token_airlines_exclude").tokenInput("/promoCodes/searchAirlines",
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['airlines_exclude'])) echo 'prePopulate:'.$promoFilterString['airlines_exclude'] ;  ?>});
        $("#token_users_include").tokenInput("/promoCodes/searchUsers",
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['users_include'])) echo 'prePopulate:'.$promoFilterString['users_include'] ;  ?>});
        $("#token_users_exclude").tokenInput("/promoCodes/searchUsers", 
        {searchDelay: 200, minChars: 2, preventDuplicates: true, theme: "facebook",
            <?php if(isset($promoFilterString['users_exclude'])) echo 'prePopulate:'.$promoFilterString['users_exclude'] ;  ?>});

         $("#token_ref_user_info").tokenInput("/promoCodes/searchUserInfo", 
        {searchDelay: 200, minChars: 2, preventDuplicates: true,  tokenLimit: 1,
            <?php if(!$model->isNewRecord && !empty($model->ref_user_info_id)){ echo 'prePopulate:[{\'id\':\''.$model->ref_user_info_id.'\',\'name\':\''.$model->refUserInfo->name.'\'}]';  }?>});



        $('#PromoCodes_promo_type_id').on('change',function(){           
            if($(this).val()=='<?php echo \PromoType::REFERAL_TYPE ?>'){
                $('.ref_class').parent().parent().show();
            }else{
                $('.ref_class').parent().parent().hide();
            }    
        })  ;
        <?php          
        if(isset($model->promo_type_id)&& $model->promo_type_id===\PromoType::REFERAL_TYPE){
            
        }else{
            ?>
        $('.ref_class').parent().parent().hide();
        <?php } ?>
            if($('#PromoCodes_promo_type_id').val()=='<?php echo \PromoType::REFERAL_TYPE ?>'){
                $('.ref_class').parent().parent().show();
            }
    });
</script>
<div class="clearfix"></div>
    <?php
    // for promo range grid
        if(!$model->isNewRecord) {
            $model_range = new \PromoRange();
            $model_range->unsetAttributes();
            if(isset($_GET['PromoRange'])){
                $model_range->attributes = $_GET['PromoRange'];
            } else {
                $model_range->promo_code_id = $model->id;
            }
            $this->renderPartial('promo_ranges_grid', array('promoCode'=>$model,'model' => $model_range));
        }

    ?>