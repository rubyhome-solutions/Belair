<?php

/* @var $this BookingLogController */
/* @var $model BookingLog */

$this->breadcrumbs = array(
    'Booking Logs' => array('admin'),
    'Manage',
);

$this->menu = array(
    array('label' => 'List BookingLog', 'url' => array('index')),
    array('label' => 'Create BookingLog', 'url' => array('create')),
);
$clientSourceList=  \ClientSource::model()->findAll();
foreach ($clientSourceList as $cs) {
    if(!isset($data['searches'][$cs->id]))
        $data['searches'][$cs->id]=0;
    if(!isset($data['searchesdom'][$cs->id]))
        $data['redirectdom'][$cs->id]=0;
    if(!isset($data['redirectdom'][$cs->id]))
        $data['redirectdom'][$cs->id]=0;
    if(!isset($data['redirect'][$cs->id]))
        $data['redirect'][$cs->id]=0;
    if(!isset($data['bookingsdom'][$cs->id]))
        $data['bookingsdom'][$cs->id]=0;
    if(!isset($data['bookings'][$cs->id]))
        $data['bookings'][$cs->id]=0;
}
?>
<form name="report_criterion" method="post" action="/bookingLog/clientReport" style="background-color: lightcyan; width: 70%" id="reportsForm">
 
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
<table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>            
            <th>Client Source</th>
            <th colspan='3'>Searches</th>
            <th colspan='3'>Redirects</th>
            <th colspan='3'>Bookings</th>
            <th colspan='3'>S/R Ratio</th>
            <th colspan='3'>R/B Ratio</th>
        </tr>
        <tr>            
            <th></th>
            <th>DOM</th>
            <th>INT</th>
            <th>Total</th>
            <th>DOM</th>
            <th>INT</th>
            <th>Total</th>
            <th>DOM</th>
            <th>INT</th>
            <th>Total</th>
            <th>DOM</th>
            <th>INT</th>
            <th>Total</th>
            <th>DOM</th>
            <th>INT</th>
            <th>Total</th>
        </tr>

<?php
$i=1;
foreach ($clientSourceList as $cs) {
    ?>
        <tr>
            <td><?php echo $cs->name;?></td>
            <td><?php if(isset($data['searchesdom'][$cs->id])){ echo (int)$data['searchesdom'][$cs->id];} else { echo '0';}?></td>
            <td><?php if(isset($data['searchesdom'][$cs->id])){ echo ((int)$data['searches'][$cs->id]-(int)$data['searchesdom'][$cs->id]);} else echo '0';?></td>
            <td><?php if(isset($data['searchesdom'][$cs->id])){ echo (int)$data['searches'][$cs->id]; }else{ echo '0';}?></td>
            
            <td><?php if(isset($data['redirectdom'][$cs->id])){ echo (int)$data['redirectdom'][$cs->id];} else { echo '0';}?></td>
            <td><?php if(isset($data['redirectdom'][$cs->id])){ echo ((int)$data['redirect'][$cs->id]-(int)$data['redirectdom'][$cs->id]);} else echo '0';?></td>
            <td><?php if(isset($data['redirect'][$cs->id])){ echo (int)$data['redirect'][$cs->id]; }else{ echo '0';}?></td>
            
            <td><?php if(isset($data['bookingsdom'][$cs->id])){ echo (int)$data['bookingsdom'][$cs->id];} else { echo '0';}?></td>
            <td><?php if(isset($data['bookingsdom'][$cs->id])){ echo ((int)$data['bookings'][$cs->id]-(int)$data['bookingsdom'][$cs->id]);} else echo '0';?></td>
            <td><?php if(isset($data['bookings'][$cs->id])){ echo (int)$data['bookings'][$cs->id]; }else{ echo '0';}?></td>
            
            <td><?php if(isset($data['searchesdom'][$cs->id]) && isset($data['redirectdom'][$cs->id]) && $data['searchesdom'][$cs->id]!=0){ echo 100*(int)$data['redirectdom'][$cs->id]/(int)$data['searchesdom'][$cs->id];} else { echo '0';}?></td>
            <td><?php if(isset($data['searchesdom'][$cs->id]) && isset($data['redirectdom'][$cs->id])&& ((int)$data['searches'][$cs->id]-$data['searchesdom'][$cs->id])!=0){ echo 100*((int)$data['redirect'][$cs->id]-(int)$data['redirectdom'][$cs->id])/((int)$data['searches'][$cs->id]-$data['searchesdom'][$cs->id]);} else { echo '0';}?></td>
            <td><?php if(isset($data['searches'][$cs->id]) && isset($data['redirect'][$cs->id]) && $data['searches'][$cs->id]!=0){ echo 100*(int)$data['redirect'][$cs->id]/(int)$data['searches'][$cs->id];} else { echo '0';}?></td>
            
            <td><?php if(isset($data['bookingsdom'][$cs->id]) && isset($data['redirectdom'][$cs->id])&& $data['redirectdom'][$cs->id]!=0){ echo 100*(int)$data['bookingsdom'][$cs->id]/(int)$data['redirectdom'][$cs->id];} else { echo '0';}?></td>
            <td><?php if(isset($data['bookingsdom'][$cs->id]) && isset($data['redirectdom'][$cs->id])&& ((int)$data['redirect'][$cs->id]-$data['redirectdom'][$cs->id])!=0){ echo 100*((int)$data['bookings'][$cs->id]-(int)$data['bookingsdom'][$cs->id])/((int)$data['redirect'][$cs->id]-$data['redirectdom'][$cs->id]);} else { echo '0';}?></td>
            <td><?php if(isset($data['bookings'][$cs->id]) && isset($data['redirect'][$cs->id]) && $data['redirect'][$cs->id]!=0){ echo 100*(int)$data['bookings'][$cs->id]/(int)$data['redirect'][$cs->id];} else { echo '0';}?></td>
            
        </tr>
     <?php
     $i++;
}
?>
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
