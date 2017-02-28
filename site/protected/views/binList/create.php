<?php
/* @var $this BinListController */
/* @var $model BinList */

$this->breadcrumbs = array(
    'Bin Lists' => array('admin'),
    'Add more',
);

if (Yii::app()->user->hasFlash('msg')) {
    echo TbHtml::alert(TbHtml::ALERT_COLOR_INFO, Yii::app()->user->getFlash('msg'), ['style' => 'max-width:800px;']);
}
?>
<div id="divProgress" class="progress progress-striped active progress-success" style="height:44px; display: none; width: 90%">
    <div id="progressBar" class="bar" style="height:44px;width:0%;"></div>
</div>
<textarea id="textArea" cols="6" rows="20" style="float: left;" placeholder="Paste the bins here..."></textarea>
<div class="well span5">
    You can paste the bin numbers using separate row for each bin.<br>Once ready click the button to start the bin acquisition process.<br><br><br>
<button class="btn btn-primary btn-large" style="margin-left: 25%;" onclick="startUploading();"><i class="fa fa-cloud-upload fa-2x"></i>&nbsp;&nbsp;&nbsp;Upload bin(s)</button>
</div>

<script>
    $(function () {
        $('#textArea').focus()
    })

    function updateProgress(percentage) {
        if (percentage > 100)
            percentage = 100;
        $('#progressBar').css('width', percentage + '%');
        $('#progressBar').html(percentage + '%');
    }

    function startUploading() {
        var content = $('#textArea').val().split("\n");
        var bins = content.length;
        var binsDone = 0, added = 0;
        document.body.style.cursor = 'wait';
        $('#divProgress').show();
        for (key in content) {
            $.post('create', {id: content[key]})
                    .done(function (msg) {
                        binsDone++;
                        updateProgress(Math.round((binsDone / bins) * 100));
                        if (msg != 0) {
                            added++;
                        }
                        if (binsDone == bins) {
                            alert("Bins uploaded => " + bins + "\nNew bins added => " + added);
                            $('#divProgress').hide();
                            $('#progressBar').css('width', '0%');
                            document.body.style.cursor = '';
//                            window.location.href = '/binList/admin';
                        }
                    });
        }
    }
</script>