<!DOCTYPE html>
<?php
if(YII_DEBUG){
    $host='http://'.\Yii::app()->request->serverName.\Yii::app()->theme->baseUrl;
    $baseurl='http://'.\Yii::app()->request->serverName;
}else{
    $host='https://'.\Yii::app()->request->serverName.\Yii::app()->theme->baseUrl;
     $baseurl='http://'.\Yii::app()->request->serverName;
}
?>
<html>
<head >
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	 <title>CheapTicket.in</title>
        <link href="<?php echo $host; ?>/css/bootstrap.min.css" rel="stylesheet">
        <link href="<?php echo $host; ?>/css/font-awesome/css/font-awesome.css" rel="stylesheet">
        <link href="<?php echo $host; ?>/css/animate.css" rel="stylesheet">
        <link href="<?php echo $host; ?>/css/style.css" rel="stylesheet">
        <link href="<?php echo $host; ?>/css/plugins/iCheck/custom.css" rel="stylesheet">
        <link href="<?php echo $host; ?>/css/plugins/datapicker/datepicker3.css" rel="stylesheet">
        <link href="<?php echo $host; ?>/css/responsive-style.css" rel="stylesheet">



</head>
<?php $this->renderPartial('//reports/_loginForm',array('authMessage'=>$authMessage)); ?>
<body>
    <?php   if(\Authorization::getIsSuperAdminLogged()){ ?>
    <div id="wrapper">
    <div id="page-wrapper" class="gray-bg margin-n">
        <div class="row">
        <nav class="navbar navbar-static-top header-top-new" role="navigation" style="margin-bottom: 0">
       
              <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2" href="#"><img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/logo.png" alt=""/></a></div>
        <ul class="nav navbar-top-links navbar-left">
               <li><a href="../../b2c/reports/clientSourceReport">Client Source Report</a></li>
               <li><a href="../../b2c/reports/clientDetailReport">Source Detail</a></li>
               <li><a href="../../b2c/reports/salesReport">Sales Report</a></li>
               <li><a href="../../b2c/reports/airCartDetailReport">AirCart Detail Report</a></li>
               <li><a href="../../b2c/reports/airLineOverviewReport">Airline Overview Report</a></li>
               <li><a class="active" href="#" >Airline Report</a></li>
        </ul>
        <ul class="nav navbar-top-links navbar-right" style="">
            <li><a href="<?php echo $baseurl; ?>/site/logout"><i class="fa fa-sign-out"></i> Logout</a></li>
<!--               <li><a href="#"><i class="fa fa-file-pdf-o"></i> Pdf</a></li>
               <li><a href="#"><i class="fa fa-envelope"></i> E-mail</a></li>-->
            </ul>
            
        </nav>
        
        
        
        </div>
         <?php
      if (!isset($data['sales']))
        $data['sales'] = 0;
    if (!isset($prevdata['sales']))
        $prevdata['sales'] = 0;
     if (!isset($data['carts']))
        $data['carts'] = 0;
    if (!isset($data['carts']))
        $prevdata['carts'] = 0;    
   
    if (!isset($data['segment']))
        $data['segment'] = 0;
     if (!isset($prevdata['segment']))
        $prevdata['segment'] = 0;
     if (!isset($data['searches']))
        $data['searches'] = 0;
     if (!isset($prevdata['searches']))
        $prevdata['searches'] = 0;
     if (!isset($data['bookings']))
        $data['bookings'] = 0;
     if (!isset($prevdata['bookings']))
        $prevdata['bookings'] = 0;
     if (!isset($data['avg']))
        $data['avg'] = 0;
      if (!isset($data['prevavg']))
        $data['prevavg'] = 0;
     if (!isset($data['avgint']))
        $data['avgint'] = 0;
     if (!isset($data['avgdom']))
        $data['avgdom'] = 0;
   if (!isset($data['basic_fare']))
        $data['basic_fare'] = 0;
   if (!isset($prevdata['basic_fare']))
        $prevdata['basic_fare'] = 0;
   if (!isset($data['other_tax']))
        $data['other_tax'] = 0;
   if (!isset($prevdata['other_tax']))
        $prevdata['other_tax'] = 0;
   if (!isset($data['yq']))
        $data['yq'] = 0;
   if (!isset($prevdata['yq']))
        $prevdata['yq'] = 0;
    
  
    
    
    function getPercentage($data, $total) {
        if ($total <= 0 || $data <= 0) {
            return 0;
        } else {
            return number_format(abs(100 * ((double) $total - (double) $data) / (double) $total), 2);
        }
    }
    function getRatio($data, $total) {
        if ($total <= 0 || $data <= 0 ) {
            return 0;
        } else {
            return number_format(abs(100 * ((double) $data) / (double) $total), 2);
        }
    }
    
    ?>
            <div class="wrapper wrapper-content animated fadeInRight padd-1">
            <div class="row">
                <div class="col-lg-12">
                <div class="ibox-content strip">
                <div class="row">
          
                     <div class="col-lg-11">
                    
                    <ol class="breadcrumb breadcrumb1">
                        <li>Air Line Report</li>
                        <li>
                        
                            <form name="report_client" method="post" action="/b2c/reports/airLineReport" style="background-color: lightcyan; width: 100%" id="reportsClient">
                                <div class="form-group date-u" id="data_5">
                                    <div class="input-daterange input-group" id="datepicker">
                                        <input type="text" class="input-sm form-control date-he" name="dateFrom" value="<?php echo date('m/d/Y',strtotime($datefrom));?>"/>
                                        <span class="input-group-addon">to</span>
                                        <input type="text" class="input-sm form-control date-he" name="dateTo" value="<?php echo date('m/d/Y',strtotime($dateto));?>" />
                                    </div>
                                </div>
                               
                                
                                <button type="submit" onclick="" class="btn2 btn-default date-u"><i class="fa fa-table"></i> Generate</button>
                            </form>
                        </li>
                        
                        
                       </ol>
                </div>
                                              <div class="col-lg-12">                   
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
      </div>
            </div>
            </div>
             </div>
             </div>
             </div>
        <div class="wrapper wrapper-content animated fadeInRight ">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content">
                            <h2>AirLine Report Overview</h2>
                            <div class="row prisse-stu">
                            <div class="col-lg-12">
                            <div class="col-lg-3">
                            <div class="col-lg-12 prist-tab">
                            <h1>Total Sale</h1>
                            <div class="col-lg-6"><h3 class="green"><?php echo $data['sales'];?></h3><h2><?php  echo $prevdata['sales']?></h2></div>
                           <div class="col-lg-5"><i class="fa <?php if($data['sales']>=$prevdata['sales']){echo 'fa-long-arrow-up f-1';}else { echo 'fa-long-arrow-down f-1 down-p';}?>"></i><div class="<?php if($data['sales']>=$prevdata['sales']){echo 'circle1';}else { echo 'circle';}?>"><span><?php echo getPercentage($data['sales'],$prevdata['sales']);?>%</span></div></div>

                            </div>
                            <div class="col-lg-12 prist-tab">
                            <div class="col-lg-6">
                            <ul>
                           <li>Basic:</li>
                            <li>YQ:</li>
                            <li>Other Taxes:</li>
                            </ul>
                            </div>
                            <div class="col-lg-5">
                             <ul>
                             <li><?php echo $data ['basic_fare']; ?></li>
                            <li><?php echo $data['yq'];?></li>
                            <li><?php echo $data['other_tax']; ?></li>
                            </ul>
                            </div>
                            </div>
                            </div>
                            
                            
                            <div class="col-lg-3">
                            <div class="col-lg-12 prist-tab">
                            <h1>Total Carts</h1>
                            <div class="col-lg-6"><h3 class="red"><?php echo $data['carts'];?></h3> <h2><?php echo $prevdata['carts'];?></h2></div>
                              <div class="col-lg-5"><i class="fa <?php if($data['carts']>=$prevdata['carts']){echo 'fa-long-arrow-up f-1';}else { echo 'fa-long-arrow-down f-1 down-p';}?>"></i><div class="<?php if($data['carts']>=$prevdata['carts']){echo 'circle1';}else { echo 'circle';}?>"><span><?php echo getPercentage($data['carts'],$prevdata['carts']);?>%</span></div></div>

                             
                             
                            </div>
                            <div class="col-lg-12 prist-tab">
                            <div class="col-lg-6">
                            <ul>
                            <li>Domestic : </li>
                            <li>international : </li>
                           </ul>
                            </div>
                            <div class="col-lg-5">
                             <ul>
                          <li><?php echo $data['cartsdom']; ?></li>
                            <li><?php echo ($data['carts']-$data['cartsdom']);?></li>
                            </ul>
                            </div>
                            </div>
                            </div>
                            
                            
                            <div class="col-lg-3">
                            <div class="col-lg-12 prist-tab">
                            <h1>Total Segments</h1>
                             <div class="col-lg-6"><h3 class="red"><?php echo $data['segments'];?></h3> <h2><?php echo $prevdata['segments'];?></h2></div>
                              <div class="col-lg-5"><i class="fa <?php if($data['segments']>=$prevdata['segments']){echo 'fa-long-arrow-up f-1';}else { echo 'fa-long-arrow-down f-1 down-p';}?>"></i><div class="<?php if($data['segments']>=$prevdata['segments']){echo 'circle1';}else { echo 'circle';}?>"><span><?php echo getPercentage($data['segments'],$prevdata['segments']);?>%</span></div></div>

                            </div>
                            <div class="col-lg-12 prist-tab">
                            <div class="col-lg-6">
                            <ul>
                            <li>S/R : </li>
                            <li>R/S : </li>
                            </ul>
                            </div>
                            <div class="col-lg-5">
                             <ul>
                             <li><?php echo $td=getRatio($data['redirect'],$data['searches']); ?></li> 
                            <li><?php  echo $td=getRatio($data['bookings'],$data['redirect']); ?></li>
                          
                            </ul>
                            </div>
                            </div>
                            </div>
                            
                            
                            <div class="col-lg-3">
                            <div class="col-lg-12 prist-tab">
                            <h1>Avg Ticket</h1>
                             <?php  
                               
                                 if(isset($prevdata['sales'])&& $prevdata['carts'] > 0)
                                    {
                                        $prevSalesAvg = $prevdata['sales']/$prevdata['carts'];
                                    }
                                    else
                                    {
                                        $prevSalesAvg = 0;
                                    }
                                    if(isset($data['sales'])&& $data['carts'] > 0)
                                    {
                                        $currentsalesAvg = $data['sales']/$data['carts'];
                                    }
                                    else
                                    {
                                        $currentsalesAvg = 0;
                                    }
                             ?>
                               
                            <div class="col-lg-6"><h3 class="green"><?php echo $currentsalesAvg;?></h3> <h2><?php echo $prevSalesAvg;?></h2></div>
                             <div class="col-lg-5"><i class="fa <?php if($currentsalesAvg>=$prevSalesAvg){echo 'fa-long-arrow-up f-1';}else { echo 'fa-long-arrow-down f-1 down-p';}?>"></i><div class="<?php if($currentsalesAvg>=$prevSalesAvg){echo 'circle1';}else { echo 'circle';}?>"><span><?php echo getPercentage($currentsalesAvg,$prevSalesAvg);?>%</span></div></div>

                          
                             
                            </div>
                            <div class="col-lg-12 prist-tab">
                            <div class="col-lg-6">
                            <ul>
                            <li>Domestic : </li>
                            <li>international  : </li>
                            </ul>
                            </div>
                            <div class="col-lg-5">
                             <ul>
                          <li><?php echo $data['avgdom']; ?></li>
                            <li><?php echo $data['avgint']; ?></li>
                           
                            </ul>
                            </div>
                            </div>
                            </div>
                            
                            </div>
                           </div>
                      
                      
                       <h2 class="box_co6 hadding-t">Top Sectors</h2>
                      <div class="row prisse-stu2">
                      <div class="col-lg-12">
                      <?php foreach($data['bookingssector'] as $value){?>
                      <div class="col-lg-12 remove-p">
                      <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['source']);?></div>
                      <div class="col-lg-4"><i class="fa fa-long-arrow-right"></i></div>
                      <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['destination']);?></div>
                      </div>
                     <?php }?>
                      </div>
                      </div>
                  
                       
                    </div>
                    </div>
                </div>
        </div>
        
        
        
        </div>
        <div class="footer">
            <div>
                <strong>© Airtickets India Pvt. Ltd</strong> - All Rights Reserved
            </div>
        </div>

        </div>
        </div>
  <?php }?>

   <!-- Mainly scripts -->
  
   <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/jquery-2.1.1.js"></script>
    <script src="<?php echo Yii::app()->theme->baseUrl; ?>/js/bootstrap.min.js"></script>
   

   <!-- chart -->
   <script src="<?php  echo \Yii::app()->theme->baseUrl;?>/js/plugins/jsKnob/jquery.knob.js"></script>
   <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/datapicker/bootstrap-datepicker.js"></script>
    
    <script>
		$(document).ready(function(){
			$('#data_1 .input-group.date').datepicker({
				todayBtn: "linked",
					keyboardNavigation: false,
						forceParse: false,
					calendarWeeks: true,
				autoclose: true,
                                 startDate: '-2m',
                                endDate: '+0d'
			});
			
			
			$('#data_5 .input-daterange').datepicker({
                keyboardNavigation: false,
                forceParse: false,
                autoclose: true,
                 startDate: '-2m',
                                endDate: '+0d'
            }).on('changeDate', function (selected) {
                            var minDate = new Date(selected.date.valueOf());
                            $('#data_1 .input-group.date').datepicker('setStartDate', minDate);
                        });

			
			$('.i-checks').iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                });
			
		});
		
		 $(".dial").knob();
    </script>
    
   <?php 
    if (!isset(\Yii::app()->user->id)){ ?>
    <script>
       //$('#loginModal').modal('show');
       $('#loginModal').modal({backdrop: 'static', show: true});
    </script>
    <?php }?>

</body>

</html>
