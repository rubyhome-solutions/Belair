<?php
$provider = $model->files;
if ($model->relatedFiles !== null) {
    $provider = array_merge($provider, $model->relatedFiles);
}
/* @var $model AirCart */
echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Cart Files <span class="badge badge-warning badge-top">' . count($provider) . '</span>'
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
        defined('CURRENT_CART_ID') or define('CURRENT_CART_ID', $model->id);

        $this->widget('bootstrap.widgets.TbGridView', [
            'dataProvider' => new CArrayDataProvider($provider),
            'id' => 'grid-files',
            'type' => array(TbHtml::GRID_TYPE_HOVER, TbHtml::GRID_TYPE_CONDENSED),
            'columns' => [
                [
                    'header' => 'Cart',
                    'value' =>  '($data->aircart_id!=CURRENT_CART_ID)?"<a href=\'/airCart/view/" . $data->aircart_id . "\' target=\'_blank\'>" . $data->aircart_id . "</a>":""',
                    'type' => 'raw',
                ],
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
            <label class="pull-left"><b>Note&nbsp;&nbsp;</b>
                <input type="text" name="fileNote" placeholder="File remarks">
            </label>
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