<div style="float: left; margin-left: 10px;max-width: 410px; width: 410px;" class="noprint">
    <div  id="divNotes" style="max-height: 150px;overflow-y: scroll; border: 1px solid;">
        <?php
        /* @var $this AirCartController */
        /* @var $model AirCart */

        $this->renderPartial('_notes_2', ['model' => $model]);
        ?>
    </div>
    <?php
    echo TbHtml::textArea('note', null, [
        'placeholder' => 'Enter new note...',
        'id' => 'noteText',
        'style' => 'margin-top:10px; width: 75%;'
    ]);
    echo TbHtml::ajaxButton('Submit', '/airCart/addNote/' . $model->id, [
        'type' => 'POST',
        'success' => 'js:function(data){
                            $("#divNotes").html(data);
                            $("#btnNoteSubmit").blur();
                            $("#noteText").val("");
                        }',
        'data' => ['noteText' => 'js: $("#noteText").val()'],
            ], [
        'id' => 'btnNoteSubmit',
        'style' => 'margin-top:20px; float:right;'
    ]);
    ?>
</div>
<div class="clearfix"></div>