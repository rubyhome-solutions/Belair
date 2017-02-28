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

//\Utils::dbgYiiLog($deviceTypes);
foreach ($deviceTypes as $dt) {
    if(!isset($data['redirect'][$dt]))
        $data['redirect'][$dt]=0;
    if(!isset($data['redirectdom'][$dt]))
        $data['redirectdom'][$dt]=0;
    if(!isset($data['bookingsdom'][$dt]))
        $data['bookingsdom'][$dt]=0;
    if(!isset($data['bookings'][$dt]))
        $data['bookings'][$dt]=0;
    
    $data['redirectint'][$dt]=$data['redirect'][$dt]-$data['redirectdom'][$dt];
    $data['bookingsint'][$dt]=$data['bookings'][$dt]-$data['bookingsdom'][$dt];
}
?>
<form name="report_criterion" method="post" action="/bookingLog/deviceReport" style="background-color: lightcyan; width: 70%" id="reportsForm">
 
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
                    <tr>
                        <th>Client Source</th>
                        <td>
                            <?php echo TbHtml::dropDownList('clientSource', '', $clientSources, ['prompt' => '-- Select the client source --', 'style' => 'width:70%']) ?>
                        </td>
                        <th>Device Type</th>
                        <td>
                            <?php echo TbHtml::dropDownList('deviceType', '',   $deviceTypes, ['prompt' => '-- Select the Device Type --', 'style' => 'width:70%']) ?>
                        </td>
                    </tr>
                    <tr>
                        <th>Browser</th>
                        <td>
                            <?php echo TbHtml::dropDownList('browser', '', $browsers, ['prompt' => '-- Select the browser --', 'style' => 'width:70%']) ?>
                        </td>
                       
                    </tr>
                    <tr>
                        <th>Mobile/Website</th>
                        <td>
                            <?php echo TbHtml::dropDownList('isMobile', '', ['0'=>'No','1'=>'Yes'], ['prompt' => '-- Select is mobile or not --', 'style' => 'width:70%']) ?>
                        </td>
                        <th>Oneway/Return</th>
                        <td>
                            <?php echo TbHtml::dropDownList('waytype', '',['1'=>'Oneway','2'=>'Return'], ['prompt' => '-- Select the Oneway/Return --', 'style' => 'width:70%']) ?>
                        </td>
                       
                    </tr>
<!--                     <tr>
                        <th>Domestic/International</th>
                        <td>
                            <?php// echo TbHtml::dropDownList('isDomestic', '', $serviceTypes, ['prompt' => '-- Select Domestic/International --', 'style' => 'width:70%']) ?>
                        </td>
                         <th>Booking Status</th>
                        <td>
                            <?php// echo TbHtml::dropDownList('bookingStatus', '',['0'=>'Booked','1'=>'Not Booked'], ['prompt' => '-- Select the Booking Status --', 'style' => 'width:70%']) ?>
                        </td>
                        
                    </tr>-->
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
            <?php if(!empty($device)){?>
            <th>Device</th>
            <td><?php echo $device;?></td>
            <?php }
            if(!empty($cls)){?>
            <th>Client Source</th>
            <td><?php 
            $clss=  \ClientSource::model()->findByPk((int)$cls);
            echo $clss->name;?></td>
            <?php } 
            if(!empty($br)){?>
            <th>Browser</th>
            <td><?php echo $br;?></td>
            <?php}
            if(!empty($mobile)|| $mobile=='0'){?>
            <th>Is Mobile</th>
            <td><?php if($mobile==='1'){echo 'Yes';}else{echo 'No';}?></td>
            <?php }?>
            <?php if(!empty($wt)){?>
            <th>WayType</th>
            <td><?php if($wt=='1'){echo 'Oneway';}else{echo 'return';}?></td>
            <?php }?>
        </tr>
    </tbody>
</table>
<table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>            
            <th>Browser</th>
            <th>Version</th>
            <th colspan='3'>Redirects</th>
            <th colspan='3'>Bookings</th>
            <th colspan='3'>R/B Ratio</th>
        </tr>
        <tr>            
            <th></th>
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
        </tr>
<?php
$i=1;
if(isset($data['browser'])){
foreach ($data['browser'] as $key=>$value) {
    $k=explode('_',$key);
    $browser=$k[0];
    $browser_version=$k[1];
    ?>
        <tr>
            <td><?php echo $browser;?></td>
             <td><?php echo $browser_version;?></td>
            <td><?php if(isset($value['redirectdom'])){ echo (int)$value['redirectdom'];} else { echo '0';}?></td>
            <td><?php if(isset($value['redirectdom'])){ echo ((int)$value['redirect']-(int)$value['redirectdom']);} else echo '0';?></td>
            <td><?php if(isset($value['redirect'])){ echo (int)$value['redirect']; }else{ echo '0';}?></td>
            
            <td><?php if(isset($value['bookingsdom'])){ echo (int)$value['bookingsdom'];} else { echo '0';}?></td>
            <td><?php if(isset($value['bookingsdom'])){ echo ((int)$value['bookings']-(int)$value['bookingsdom']);} else{ echo '0';}?></td>
            <td><?php if(isset($value['bookings'])){ echo (int)$value['bookings']; }else{ echo '0';}?></td>
            
           
            <td><?php if(isset($value['bookingsdom']) && isset($value['redirectdom'])&& $value['redirectdom']!=0){ echo 100*(int)$value['bookingsdom']/(int)$value['redirectdom'];} else { echo '0';}?></td>
            <td><?php if(isset($value['bookingsdom']) && isset($value['redirectdom'])&& ((int)$value['redirect']-$value['redirectdom'])!=0){ echo 100*((int)$value['bookings']-(int)$value['bookingsdom'])/((int)$value['redirect']-$value['redirectdom']);} else { echo '0';}?></td>
            <td><?php if(isset($value['bookings']) && isset($value['redirect']) && $value['redirect']!=0){ echo 100*(int)$value['bookings']/(int)$value['redirect'];} else { echo '0';}?></td>
            
        </tr>
<?php
     $i++;
}
}
?>
        
        
    </tbody></table>

<table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>            
            <th>Platform</th>
            <th colspan='3'>Redirects</th>
            <th colspan='3'>Bookings</th>
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
        </tr>
<?php
$i=1;
foreach ($deviceTypes as $dt) {
    ?>
        <tr>
            <td><?php echo $dt;?></td>
            
            <td><?php if(isset($data['redirectdom'][$dt])){ echo (int)$data['redirectdom'][$dt];} else { echo '0';}?></td>
            <td><?php if(isset($data['redirectdom'][$dt])){ echo ((int)$data['redirect'][$dt]-(int)$data['redirectdom'][$dt]);} else echo '0';?></td>
            <td><?php if(isset($data['redirect'][$dt])){ echo (int)$data['redirect'][$dt]; }else{ echo '0';}?></td>
            
            <td><?php if(isset($data['bookingsdom'][$dt])){ echo (int)$data['bookingsdom'][$dt];} else { echo '0';}?></td>
            <td><?php if(isset($data['bookingsdom'][$dt])){ echo ((int)$data['bookings'][$dt] - (int)$data['bookingsdom'][$dt]);} else echo '0';?></td>
            <td><?php if(isset($data['bookings'][$dt])){ echo (int)$data['bookings'][$dt]; }else{ echo '0';}?></td>
            
           
            <td><?php if(isset($data['bookingsdom'][$dt]) && isset($data['redirectdom'][$dt])&& $data['redirectdom'][$dt]!=0){ echo 100*(int)$data['bookingsdom'][$dt]/(int)$data['redirectdom'][$dt];} else { echo '0';}?></td>
            <td><?php if(isset($data['bookingsdom'][$dt]) && isset($data['redirectdom'][$dt])&& ((int)$data['redirect'][$dt]-$data['redirectdom'][$dt])!=0){ echo 100*((int)$data['bookings'][$dt]-(int)$data['bookingsdom'][$dt])/((int)$data['redirect'][$dt]-$data['redirectdom'][$dt]);} else { echo '0';}?></td>
            <td><?php if(isset($data['bookings'][$dt]) && isset($data['redirect'][$dt]) && $data['redirect'][$dt]!=0){ echo 100*(int)$data['bookings'][$dt]/(int)$data['redirect'][$dt];} else { echo '0';}?></td>
            
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
