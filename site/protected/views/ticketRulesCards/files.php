
<?php
    if(isset($msg) && $msg=='success'){
        echo "<h3>Files Executed Successfully !!</h3>";
    }
?>
<form class="form span6 noprint" method="POST" enctype="multipart/form-data" action="/ticketRulesCards/importRule"  id="fileForm">
    <fieldset>
        <legend>Import Card Data</legend>
        <?php
        if (Yii::app()->user->hasFlash('files_msg')) {
            echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('files_msg'));
        }
        ?>
        <div class="row-fluid" style="margin-left: 5%">
            <div class="fileUpload btn btn-primary">
                <span><i class="fa fa-folder-open-o fa-lg"></i> Choose file</span>
                <input  id="uploadBtn" name="filename" type="file" class="upload" />
            </div>
            <input id="uploadFile" placeholder="No file chosen" disabled="disabled" />
        </div>
        <div class="row-fluid" style="margin-left: 6%; margin-top: 10px;">
           
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