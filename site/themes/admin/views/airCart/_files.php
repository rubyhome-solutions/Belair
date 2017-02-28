<?php
echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;&nbsp;Cart Files'
        , [
    'color' => TbHtml::BUTTON_COLOR_PRIMARY,
    'size' => TbHtml::BUTTON_SIZE_SMALL,
    'onclick' => 'js:$("#fileForm").toggle(); $(this).blur();',
    'style' => 'margin-bottom: 10px;',
    'class' => 'noprint'
]);
?>
<form class="form span6 noprint" method="POST" enctype="multipart/form-data" action="/airCart/uploadFile/<?php echo $model->id; ?>" style="float:none; display:none;" id="fileForm">
    <fieldset>
        <legend>Files</legend>
        <?php
        /* @var $model AirCart */

        $this->widget('bootstrap.widgets.TbGridView', [
            'dataProvider' => new CArrayDataProvider($model->files),
            'id' => 'grid-files',
            'type' => array(TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_CONDENSED),
            'columns' => [
                [
                    'header' => 'Note',
                    'value' => '$data->note',
                ],
                [
                    'header' => 'File name',
                    'value' => '"<a href=\'/airCart/download/" . $data->id . "\'>" . $data->name . "</a>"',
                    'type' => 'raw',
                ],
                [
                    'class' => 'ext.bootstrap.widgets.TbButtonColumn',
                    'template' => '{delete}',
                    'buttons' => ['delete' => ['url' => '$this->grid->Controller->createUrl("delFile",array("File[id]"=>$data->id, "id"=>$data->aircart_id))']],
                ],
            ],
        ]);

        if (Yii::app()->user->hasFlash('files_msg')) {
            echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, \Yii::app()->user->getFlash('files_msg'));
        }
        ?>
        <div class="row" >
            <div class="col-md-4">
            <div class="fileUpload btn-xs btn btn-primary">
                <span><i class="fa fa-folder-open-o fa-lg"></i> Choose file</span>
                <input  id="uploadBtn" name="filename" type="file" class="upload" />
                
            </div>
            </div>
        <div class="col-md-8">               
        <input id="uploadFile" class="form-control" placeholder="No file chosen" disabled="disabled" />        
        </div>
        </div>
            
        <div class="row" style="margin-top: 10px; clear:both;">
            <label class="col-lg-4 control-label"><b>Note: </b>
                
            </label>
            <div class="col-lg-8"><input class="form-control" type="text" name="fileNote" placeholder="File remarks"></div>
            
        </div>
        <div class="row" style="margin-top:10px;">
            <div class="col-md-4">
                &nbsp;
            </div>
                <div class="col-md-8">
                <?php
            echo TbHtml::submitButton('<i class="fa fa-cloud-upload fa-lg fa-white"></i>&nbsp;&nbsp;Upload file', [
                'color' => TbHtml::BUTTON_COLOR_WARNING,
                'style' => 'margin-left: 5%;',
                'encode' => false,
                'id' => 'sbmtButton',
                'disabled' => "disabled"
            ]);
            ?>
            </div>
        </div>
    </fieldset>
</form>

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
    legend {
        margin-bottom: 0;
        width: initial;
        border-bottom: 0;            
    }
</style>

    
<script>
    document.getElementById("uploadBtn").onchange = function () {
        document.getElementById("uploadFile").value = this.value.replace(/C:\\fakepath\\/i, '');
        $('#sbmtButton').removeAttr('disabled');
        $('#sbmtButton').removeClass('disabled');
    };
</script>