
<form name="report_criterion" method="post" action="/cartStatusLog/cartLogReport" style="background-color: lightcyan; width: 70%" id="reportsForm">
 
 <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Date Filter</th>
                        <td style="width: 307px;">
                            <?php
                            $this->widget('zii.widgets.jui.CJuiDatePicker', [
                                'name' => "dateFrom",
                                'value'=>date('Y-m-d',strtotime($datefrom)),
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
                                'value'=>date('Y-m-d',strtotime($dateto)),
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
</form>
<h3>Report</h3>
<table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>            
            <th>Date From</th>
            <td><?php echo $datefrom;?></td>
            <th>Date To</th>
            <td><?php echo $dateto;?></td>
            <th>Previous Date From</th>
            <td><?php echo $prevdatefrom;?></td>
            <th>Previous Date To</th>
            <td><?php echo $prevdateto;?></td>
        </tr>
    </tbody>
</table>
<table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody>
        
        <tr> <th></th>           
            <th colspan='10' align="center" style="text-align: center">Average Time of Cart Status</th>
           
        </tr>
        <tr>
            <th colspan='1'></th>
        <?php
        foreach (CartStatus::$cartStatusMap as $key=>$value) {
            ?>
            <th colspan='1'><?php echo $value;?></th>
            <?php
        }
        ?>
         </tr>
          <tr>
           <th colspan='1'>Current Average <br>(<?php echo $datefrom.' - '.$dateto;?>)</th>
        <?php
        foreach (CartStatus::$cartStatusMap as $key=>$value) {
            $str='';
            if($data[$key]/60 >1){
                $str.=floor($data[$key]/60).'h ';
                $str.=floor($data[$key]%60).'m ';
            }else{
                 $str.=$data[$key].'m ';
            }
            ?>
            <td colspan='1'><?php echo $str;?></td>
            <?php
        }
        ?>
         </tr>
         <tr>
           <th colspan='1'>Previous Average<br> (<?php echo $prevdatefrom.' - '.$prevdateto;?>)</th>
        <?php
        foreach (CartStatus::$cartStatusMap as $key=>$value) {
              $str='';
            if($prevdata[$key]/60 >1){
                $str.=floor($prevdata[$key]/60).'h ';
                $str.=floor($prevdata[$key]%60).'m ';
            }else{
                 $str.=$prevdata[$key].'m ';
            }
            ?>
            <td colspan='1'><?php echo $str;?></td>
            <?php
        }
        ?>
         </tr>
          
        

    </tbody></table>

<style>
    #booking-log-grid_c6 {
        width: 150px !important;
    }
    #booking-log-grid select {
        width: inherit;
        margin-bottom: auto;
    }
    #booking-log-grid input {
        width: 70px;
        margin-bottom: auto;
    }
   
    #booking-log-grid table td, #booking-log-grid table th {
        text-align: center;
        vertical-align: middle;
    }
    th {
    background-color: lightgoldenrodyellow;
}
    .badge {font-size: inherit}
</style>
