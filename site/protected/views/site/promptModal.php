<?php
/* @var $modalHeader string */
/* @var $gridName string */
?>

<div id="infoModal" class="modal hide fade">
    <div class="modal-header">
        <h3 id="modalHeader"><?php echo $modalHeader; ?></h3>
    </div>
    <form onsubmit="return false;">
        <div class="modal-body form">
            <input id="textContent" type="text" placeholder="Type here" style="width:90%;height:30px;">
        </div>
        <div class="modal-footer">
            <button type="submit" id="textInfoBtn" data-dismiss="modal" aria-hidden="true" class="btn btn-primary">Submit</button>
        </div>
    </form>
</div>

<script>
    function doAjax(url) {
        $('#infoModal').attr('url', url);
        $('#textContent').val('');
        $('#infoModal').modal('show');
    }

    $('#infoModal').on('shown', function () {
        $('#textContent').focus();
    });

    $('#infoModal').on('hidden', function () {
        url = $('#infoModal').attr('url');
        content = $('#textContent').val();
        if (content.length > 2) {
            $.post(url, {content: content}, function (data) {
                if (typeof data.error !== 'undefined') { // Process the errors
                    alert(data.error);
                } else {
                    $.fn.yiiGridView.update('<?php echo $gridName; ?>');
//                    if (typeof data.message !== 'undefined') { // Process the message
//                        alert(data.message);
//                    }
                }
            }, 'json');
        } else {
            alert('The input text is too short!');
        }
    });
</script>
<style>
    p.error {
        padding: 5px;
        border-style:solid;
        border-color: red;
        background-color: #FFF6BF;
    }
</style>