<?php
$cs = Yii::app()->getClientScript();
$baseUrl = Yii::app()->baseUrl;
$cs->registerCssFile($baseUrl . '/css/token-input.css');
$cs->registerCssFile($baseUrl . '/css/token-input-facebook.css');
$cs->registerScriptFile($baseUrl . '/js/jquery.tokeninput.js');
?>
<form name="report_criterion" method="post" action="/commission/getPromoReport" style="background-color: lightcyan; width: 70%" id="reportsForm">

    <table class="table table-bordered table-condensed">
        <colgroup><col width="150"><col></colgroup>
        <tbody><tr>
                <th>Date Filter</th>
                <td style="width: 307px;">
                    <?php
                    $this->widget('zii.widgets.jui.CJuiDatePicker', [
                        'name' => "dateFrom",
                        'value' => $datefrom,
                        'options' => array(
                            'dateFormat' => 'yy-mm-dd',
                            'changeMonth' => true,
                            'changeYear' => true,
                        ),
                        'htmlOptions' => [
                            'placeholder' => 'From date',
                            'style' => 'max-width:115px;',
                        ]
                    ]);
                    ?>
                </td>
                <td>
                    <?php
                    $this->widget('zii.widgets.jui.CJuiDatePicker', [
                        'name' => "dateTo",
                        'value' => $dateto,
                        'options' => array(
                            'dateFormat' => 'yy-mm-dd',
                            'changeMonth' => true,
                            'changeYear' => true,
                        ),
                        'htmlOptions' => [
                            'placeholder' => 'To date',
                            'style' => 'max-width:115px;',
                        ]
                    ]);
                    ?>

                </td>
            </tr>
            <tr>
                <th>Dom/Int</th>
                <td><select id="way_type" name="way_type">
                        <option value="" >All</option>
                        <option value="1" <?php
                        if ($way_type == \CommisionClientSource::WAYTYPE_DOMESTIC) {
                            echo 'selected=selected';
                        }
                        ?>>Domestic</option>
                        <option value="2" <?php
                        if ($way_type == \CommisionClientSource::WAYTYPE_INTERNATIONAL) {
                            echo 'selected=selected';
                        }
                        ?>>International</option>
                    </select>
                </td>
                <td>&nbsp;</td>
            </tr>
            <tr>
                <th>PromoCodes</th>
                <td colspan="2">
                    <input id='promocodes' name='promocodes' type="text" width="100%"/>
                </td>

            </tr>


        </tbody></table>
    <button class="btn btn-info" id="btnViewReports" name="yt0" type="submit">View Report</button>
    <button class="btn btn-info" id="xlsFile" name="xlsFile" type="submit" value="1">Download</button>
</form>
<?php if (!empty($html)) { ?>
    <h3>Promo Sales Report</h3>
    <table class="table table-condensed table-bordered table-hover" style="width: initial;">
        <tbody><tr>            
                <th>Date From</th>
                <td><?php echo $datefrom; ?></td>
                <th>Date To</th>
                <td><?php echo $dateto; ?></td>
                <?php if (!empty($way_type)) { ?>
                    <th>Way Type</th>
                    <td><?php echo \CommisionClientSource::$waytypeMap[$way_type]; ?></td>
                <?php } ?>
            </tr>
        </tbody>
    </table>
    <br>

    <?php
    echo $html;
} else if (!empty($_POST)) {
    ?>
    <h3>No Record Found for the selected search criteria</h3>
<?php } ?>
<style>
    select {
        margin-bottom: auto;
        width: auto;
    }
    input[type="text"] {margin-bottom: auto;}
    th {background-color: lightgoldenrodyellow;}
    .table {margin-bottom: auto;}
    table {border: 1px solid #dddddd;}
    .table td {
        text-align: center;
        vertical-align: middle;
    }
    .table th {
        vertical-align: middle;
        text-align: center;
    }
</style>
<script type="text/javascript">
    $(document).ready(function () {
        $("#promocodes").tokenInput("/promoCodes/search",
                {searchDelay: 200, minChars: 3, preventDuplicates: true, theme: "facebook"}
        );
    });

</script>
