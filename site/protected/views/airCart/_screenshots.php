<?php
$cnt = count($images);

if ($cnt > 0) {
    echo TbHtml::button('<i class="fa fa-arrow-circle-o-right fa-lg"></i>&nbsp;&nbsp;&nbsp;Screenshots <span class="badge badge-warning badge-top">' . $cnt . '</span>'
        , [
        'color' => TbHtml::BUTTON_COLOR_PRIMARY,
        'size' => TbHtml::BUTTON_SIZE_SMALL,
        'onclick' => 'js:$("#divScreenshots").toggle(); $(this).blur();',
        'style' => 'margin-bottom: 10px;',
        'class' => 'noprint'
    ]);
    ?>
    <div id="divScreenshots" style="margin-left: 0px;max-width: 1100px; display: none;" class="noprint">
        <table class="table table-condensed table-hover table-bordered">
            <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Action</th>
            </tr>
            <?php foreach ($images as $image) { ?>
                <tr>
                    <td><?php echo $image->updated; ?></td>
                    <td>
                        <?php 
                        //echo CHtml::link($image->displayName, "/airCart/screenshot?sname=$image->name", ['target' => '_blank']); 
                        echo CHtml::link($image->displayName, "/screenshot-for-$image->name", ['target' => '_blank']); 
                        ?>
                    </td>
                    <td>
                        <?php 
                        echo CHtml::link("<i class='fa fa-download' aria-hidden='true'></i>","/airCart/downloadScreenshot?filename=".$image->name, ['target' => '_self']); 
                        ?>
                    </td>
                </tr>
                <?php
            }
            ?>
        </table>
    </div>
    <style>
        .badge {font-size: inherit}
        #divScreenshots table td {vertical-align: middle}
    </style>

<?php } ?>