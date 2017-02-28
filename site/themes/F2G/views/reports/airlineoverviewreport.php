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
<?php function getPercentage($data, $total) {
        if ($total <= 0) {
            return 0;
        } else {
            return number_format(abs(100 * ((double) $total - (double) $data) / (double) $total), 2);
        }
    }
    ?>
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
               <li><a class="active" href="#" >Airline Overview Report</a></li>
               <li><a href="../../b2c/reports/airLineReport">Airline Report</a></li>
        </ul>
        <ul class="nav navbar-top-links navbar-right" style="display:none">
            <li><a href="#"><i class="fa fa-file-pdf-o"></i> Pdf</a></li>
            <li><a href="#="fa fa-envelope"></i> E-mail</a></li>
        </ul>
        
            
        </nav>
        
        
        
        </div>
            <div class="wrapper wrapper-content animated fadeInRight padd-1">
            <div class="row">
                <div class="col-lg-12">
                <div class="ibox-content strip">
                <div class="row">
                <div class="col-lg-11">
                    
                    <ol class="breadcrumb breadcrumb1">
                        <li>AirLine Report Overview</li>
                        <li>
                       
                         
                            <form name="report_client" method="post" action="/b2c/reports/AirLineOverviewReport" style="background-color: lightcyan; width: 100%" id="reportsClient">
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
                        <li>
                        
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
                            <div class="row">
                            
                            <div class="col-lg-12">
                            <div class="col-lg-12 box_co3 hadding2 block-top-box">
                            <div class="col-lg-2">AirLine</div>
                            <div class="col-lg-2">Sale</div>
                            <div class="col-lg-2">Carts</div>
                            <div class="col-lg-2">Segments</div>
                            <div class="col-lg-2">Passengers</div>
                            <div class="col-lg-2">Avg Ticket</div>
                            </div>
                            
                            
                            <div class="col-lg-12 inner">
                            <?php 
                            
           
        
        
                            ?>
                                                       
                            <?php if(isset($data)){ foreach($data as $key=>$row){
                                
                                 if(!isset($data[$key]['sales']))
        $data[$key]['sales'] = 0;
        if(!isset($prevdata[$key]['sales']))
        $prevdata[$key]['sales'] = 0;
        if(!isset($data[$key]['carts']))
        $data[$key]['carts'] = 0;
        if(!isset($prevdata[$key]['carts']))
        $prevdata[$key]['carts'] = 0;
        if(!isset($data[$key]['segment']))
        $data[$key]['segment'] = 0;
        if(!isset($prevdata[$key]['segment']))
        $prevdata[$key]['segment'] = 0;
         if(!isset($data[$key]['passengers']))
        $data[$key]['passengers'] = 0;
        if(!isset($prevdata[$key]['passengers']))
        $prevdata[$key]['passengers'] = 0;
                                ?>
                                

                             <div class="col-lg-2">
                                
                              <span class="data">Airline</span><img src="/img/air_logos/<?php echo \Carrier::getCodeFromId($key);?>.png"><?php echo \Carrier::getNameFromId($key);?>
                              
                             </div>    
                                                             
                            <div class="col-lg-2">
                                
                                
                            <span class="data">Sales</span><?php if(isset($data[$key]['sales'])){echo '   '.$data[$key]['sales'];}else{ echo '  0';}?><div class="circle2 <?php if ($data[$key]['sales'] >= $prevdata[$key]['sales']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data[$key]['sales'] >= $prevdata[$key]['sales']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div>
                                <span class="green"><?php if(isset($prevdata[$key]['sales'])&&isset($row['sales'])){ echo getPercentage($row['sales'],$prevdata[$key]['sales']);}else{ echo '  0';}?>%</span>
                            
                            </div>
                            <div class="col-lg-2">
                                <span class="data">Carts</span><?php if(isset($data[$key]['carts'])){echo '   '.$data[$key]['carts'];}else{ echo '  0';}?><div class="circle2 <?php if ($data[$key]['carts'] >= $prevdata[$key]['carts']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data[$key]['carts'] >= $prevdata[$key]['carts']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div>
                            <span class="green"><?php if(isset($prevdata[$key]['carts'])&&isset($row['carts'])){ echo getPercentage($row['carts'],$prevdata[$key]['carts']);}else{ echo '  0';}?>%</span>
                           </div>
                            
                            <div class="col-lg-2">
                                 <span class="data">Segment</span><?php if(isset($data[$key]['segment'])){echo '   '.$data[$key]['segment'];}else{ echo '  0';}?><div class="circle2 <?php if ($data[$key]['segment'] >= $prevdata[$key]['segment']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data[$key]['segment'] >= $prevdata[$key]['segment']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div>
                            <span class="green"><?php if(isset($prevdata[$key]['segments'])&&isset($row['segments'])){ echo getPercentage($row['segments'],$prevdata[$key]['segments']);}else{ echo '  0';}?>%</span>
                            </div>
                            <div class="col-lg-2">
                                 
                              <span class="data">Passenger</span><?php if(isset($data[$key]['passengers'])){echo '   '.$data[$key]['passengers'];}else{ echo '  0';}?><div class="circle2 <?php if ($data[$key]['passengers'] >= $prevdata[$key]['passengers']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data[$key]['passengers'] >= $prevdata[$key]['passengers']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div>
                                
                            <span class="green"><?php if(isset($prevdata[$key]['passengers'])&&isset($row['passengers'])){ echo getPercentage($row['passengers'],$prevdata[$key]['passengers']);}else{ echo '  0';}?>%</span>
                            
                            </div>
                            <div class="col-lg-2">
                                 <?php 
                                    //$currentsalesAvg = $data[$key]['sales']/$data[$key]['carts'];
                                    if(isset($prevdata[$key]['sales'])&& $prevdata[$key]['carts'] > 0)
                                    {
                                        $prevSalesAvg = $prevdata[$key]['sales']/$prevdata[$key]['carts'];
                                    }
                                    else
                                    {
                                        $prevSalesAvg = 0;
                                    }
                                    if(isset($data[$key]['sales'])&& $data[$key]['carts'] > 0)
                                    {
                                        $currentsalesAvg = $data[$key]['sales']/$data[$key]['carts'];
                                    }
                                    else
                                    {
                                        $currentsalesAvg = 0;
                                    }
                                    ?>
                                
                            <span class="data">Avg Ticket</span><?php echo $currentsalesAvg; ?><div class="circle2 <?php if ($currentsalesAvg >=$prevSalesAvg) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($currentsalesAvg>= $prevSalesAvg) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div>
                            <span class="green"><?php if(isset($prevSalesAvg)&&isset($currentsalesAvg)){ echo getPercentage($currentsalesAvg,$prevSalesAvg);}else{ echo '  0';}?></span>%</span>
                            </div>
                           
                            <?php }}?>
                            </div>
                           
                                        
                            
                            
                            
                            
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
    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/bootstrap.min.js"></script>
   

   <!-- chart -->
   <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/jsKnob/jquery.knob.js"></script>
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

