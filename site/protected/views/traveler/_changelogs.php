<?php
$flag = (count($notes) > 0)?true:false;
?>
<div style="float: left; margin-left: 10px;" class="noprint">
    <div  id="divNotes" style="max-height: 150px;<?php echo ($flag)?'overflow-y: scroll;':'';?> max-width:538px;">
        <?php
        if ($flag) {
            foreach ($notes as $k => $v) {
                echo TbHtml::labelTb($k, ['color' => TbHtml::LABEL_COLOR_INFO]);
                echo TbHtml::well($v, ['size' => TbHtml::WELL_SIZE_SMALL, 'style' => 'margin-top:0; margin-left:10px;min-width:200px;padding:3px;max-width:505px;width:505px;']);
            }
        } else {
        ?>
        <p style="font-size: 0.8em;">No change logs available</p>

        
        <?php    
        }
        ?>
    </div>
</div>
<div class="clearfix"></div>