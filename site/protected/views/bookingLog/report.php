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


?>

<h3>Report</h3>
<table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>
            <th>#</th>
            <th>Client Source</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Type</th>
            <th>DOM/INT</th>
            <th>Carrier</th>
            <th>Searches</th>
            <th>Redirect</th>
            <th>Booking</th>
        </tr>

<?php

$i=1;
foreach ($data->rawData as $value) {
    ?>
        <tr>
            <td><?php echo $i;?></td>
            <td><?php echo $value['cname'];?></td>
            <td><?php echo $value['source'];?></td>
            <td><?php echo $value['destination'];?></td>
            <td><?php if($value['type_id']==1){ echo 'Oneway'; }else{ echo 'Return';}?></td>
            <td><?php if($value['is_domestic']==1){ echo 'International';}else{echo'Domestic';}?></td>
            <td><?php echo $value['crname'];?></td>          
            <td><?php echo $value['searches'];?></td>
            <td><?php echo $value['total'];?></td>
            <td><?php echo $value['bookings'];?></td>
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
