<div class="noprint">
    <div  id="divNotes">
        <?php
        /* @var $this AirCartController */
        /* @var $model AirCart */

        $this->renderPartial('_notes_2', ['model' => $model]);
        ?>
    </div>
    <div class="writenote">
        <?php
    echo TbHtml::textArea('note', '', [
        'placeholder' => 'Enter new note...',
        'id' => 'noteText',
        'class'=> 'form-control'
        
    ]);
    echo TbHtml::ajaxButton('Submit', '/airCart/addNote/' . $model->id, [
        'type' => 'POST',
//    'success' => 'js:function(data){ $("#divNotes").replaceWith(data); }',
        'data' => ['noteText' => 'js: $("#noteText").val()'],
        'update' => '#divNotes',
        
    ]);
    ?>
    <div class="btn-group dropup">
                    <button data-toggle="dropdown" class="btn btn-warning  btn-xs dropdown-toggle">Template<span class="caret"></span></button>
                    <ul id="notesTemplate" class="dropdown-menu">
                        <li><a>Mail sent for fraud check documents</a></li>
                        <li><a>Mail sent for passport details</a></li>
                        <li><a>Documents received & attached to cart</a></li>
                        <li><a>Payment Link sent</a></li>
                        <li><a>Payment received – Amount:</a></li>
                        <li><a>Ticket Issued: Source –</a></li>
                        <li><a>Ticket Numbers –</a></li>
                        <li><a>Ticket Reissued – </a></li>
                        <li><a>Reissue Penalty :</a></li>
                        <li><a>Cancelation Penalty:</a></li>
                        <li><a>Invoice Number:</a></li>
                        <li><a>Credit Note Number:</a></li>
                        <li><a>Refund Amount:</a></li>
                        <li><a>New PNR:</a></li>
                        
                    </ul>
                </div>
    </div>
</div>
<div class="clearfix"></div>