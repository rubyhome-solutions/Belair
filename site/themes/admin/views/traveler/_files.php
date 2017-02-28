<?php
/* @var $model Traveler */

$isStaffLogged = Authorization::getIsStaffLogged();
if ($isStaffLogged) {
    $rels = new CArrayDataProvider($model->travelerFiles);
} else {
    $arrayFiles = $model->travelerFiles;
    foreach ($arrayFiles as $key => $value) {
        if ($value->user_visible == 0)
            unset($arrayFiles[$key]);
    }
    $rels = new CArrayDataProvider($arrayFiles);
}

$buttonPlus = TbHtml::ajaxButton('<i class="icon-upload icon-white"></i> Upload', $this->createUrl('addFile'), array(
            'type' => 'POST',
            'success' => 'function(html){  $.fn.yiiGridView.update("grid-files"); }',
            'data' => array(
                'ajax' => true,
                'id' => $model->id,
                'File[issuing_country_id]' => 'js:$("#issuing_country_id").val()',
                'File[number]' => 'js:$("#File_number").val()',
                'File[type]' => 'js:$("#File_type").val()',
                'File[issue_date]' => 'js:$("#File_issue_date").val()',
                'File[expire_date]' => 'js:$("#File_expire_date").val()',
            ),
                ), array(
            'class' => 'btn-warning',
            'style' => 'margin-top: -12px;white-space:nowrap;',
            'encode' => false,
                )
);


$this->widget('bootstrap.widgets.TbGridView', array(
    'dataProvider' => $rels,
    'id' => 'grid-files',
    'type' => array(TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_CONDENSED),
    'columns' => array(
        array(
            'value' => '$data->docType->name',
            'header' => 'File type',
        ),
        array(
            'header' => 'File name',
            'value' => '"<a href=\'/traveler/download/" . $data->id . "\'>" . $data->name . "</a>"',
            'type' => 'raw',
        ),
        array(
            'class' => 'ext.bootstrap.widgets.TbButtonColumn',
            'template' => '{delete}',
            'buttons' => array('delete' => array('url' => '$this->grid->Controller->createUrl("delFile",array("File[id]"=>$data->id, "id"=>$data->traveler_id))')),
        ),
    ),
));

if (Yii::app()->user->hasFlash('files_msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('files_msg'));
}
?>
<div class="row-fluid" >
    <div class="fileUpload btn btn-primary">
        <span><i class="fa fa-folder-open-o fa-lg"></i> Choose file</span>
        <input  id="uploadBtn" name="filename" type="file" class="upload" accept="image/*|application/pdf"/>
    </div>
    <input id="uploadFile" placeholder="No file chosen" disabled="disabled" />         
</div>
<div class="row-fluid" style="margin-left: 1% ; margin-top: 10px;">
    <label class="pull-left"><b>File Type&nbsp;&nbsp;</b></label>
    <?php
    $data = TbHtml::listData(DocType::model()->findAll(['order' => 'id DESC', 'condition' => 'id>3']), 'id', 'name');
    echo TbHtml::dropDownList('doc_type_id', DocType::OTHER_FILE_TYPE, $data, array('style' => 'margin-left:11%;max-width: 210px;'));
    ?>
</div>
    <label class="checkbox" style="float: left;margin-right: 10px; display: <?php echo (Authorization::getIsStaffLogged()) ? 'block' : 'none'; ?>" >
        <input type="checkbox" checked value="1" name="file_user_visible" id="file_user_visible"> Visible by the user
    </label>
    <?php
    echo TbHtml::submitButton('<i class="fa fa-cloud-upload fa-lg fa-white"></i>&nbsp;&nbsp;Upload file', array(
        'color' => TbHtml::BUTTON_COLOR_WARNING,
        'style' => 'margin-top: 10px;',
        'encode' => false,
    ));
    ?>
<style>
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

</style>
<script>
    document.getElementById("uploadBtn").onchange = function() {
        document.getElementById("uploadFile").value = this.value.replace(/C:\\fakepath\\/i, '');
    };
</script>