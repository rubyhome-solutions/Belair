
<form name="report_criterion" method="post" action="/report/yatraAmadeusReport" style="background-color: lightcyan; width: 70%" id="reportsForm">
 
 <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Date Filter</th>
                        <td style="width: 307px;">
                            <?php
                            $this->widget('zii.widgets.jui.CJuiDatePicker', [
                                'name' => "dateFrom",
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
                   
                </tbody></table>
<button class="btn btn-info" id="btnViewReports" name="yt0" type="submit">View Report</button>
<button type="submit" class="btn btn-info" name="xlsFile" value="on">Download Excel</button>
</form>
<h3>Report</h3>
<table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>            
            <th>Date From</th>
            <td><?php echo $datefrom;?></td>
            <th>Date To</th>
            <td><?php echo $dateto;?></td>
        </tr>
    </tbody>
</table>
<?php echo $data;?>

<style>
    select {
        margin-bottom: auto;
        width: auto;
    }
    input[type="text"] {margin-bottom: auto;}
    input[type="checkbox"] {margin: 0}
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
    .chart {
        border: 1pt solid;
        border-radius: 25px;
        padding: 10px;
        display: none;
    }
    /*    .ui-widget {
            font-family: "Open Sans";
            font-size: .9em;
        }*/
</style>
