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
<?php
if(\Authorization::getIsSuperAdminLogged()){
        if(!isset($data['sales']))
        $data['sales'] = 0;
        if(!isset($data['salesdom']))
        $data['salesdom'] = 0;
        if(!isset($data['salesmobile']))
        $data['salesmobile'] = 0;
        if(!isset($data['salesdommobile']))
        $data['salesdommobile'] = 0;
        if(!isset($data['carts']))
        $data['carts'] = 0;
        if(!isset($data['cartsdom']))
        $data['cartsdom'] = 0;
        if(!isset($data['cartsmobile']))
        $data['cartsmobile'] = 0;
        if(!isset($data['cartsdommobile']))
        $data['cartsdommobile'] = 0;
        if(!isset($data['segments']))
        $data['segments'] = 0;
        if(!isset($data['segmentsdom']))
        $data['segmentsdom'] = 0;
        if(!isset($data['segmentslcc']))
        $data['segmentslcc'] = 0;
        if(!isset($data['segmentsdomlcc']))
        $data['segmentsdomlcc'] = 0;
        if(!isset($data['cartsdommobile']))
        $data['cartsdommobile'] = 0;
        if(!isset($data['passengers']))
        $data['passengers'] = 0;
        if(!isset($data['passengersdom']))
        $data['passengersdom'] = 0;
        if(!isset($data['passengersmobile']))
        $data['passengersmobile'] = 0;
        if(!isset($data['passengersmobiledom']))
        $data['passengersmobiledom'] = 0;
        if(!isset($data['cancel']))
        $data['cancel'] = 0;
        if(!isset($data['canceldom']))
        $data['canceldom'] = 0;
        if(!isset($data['res']))
        $data['res'] = 0;
        if(!isset($data['resdom']))
        $data['resdom'] = 0;
        
        if(!isset($prevdata['sales']))
        $prevdata['sales'] = 0;
        if(!isset($prevdata['salesdom']))
        $prevdata['salesdom'] = 0;
        if(!isset($prevdata['salesmobile']))
        $prevdata['salesmobile'] = 0;
        if(!isset($prevdata['salesdommobile']))
        $prevdata['salesdommobile'] = 0;
        if(!isset($prevdata['carts']))
        $prevdata['carts'] = 0;
        if(!isset($prevdata['cartsdom']))
        $prevdata['cartsdom'] = 0;
        if(!isset($prevdata['cartsmobile']))
        $prevdata['cartsmobile'] = 0;
        if(!isset($prevdata['cartsdommobile']))
        $prevdata['cartsdommobile'] = 0;
        if(!isset($prevdata['segments']))
        $prevdata['segments'] = 0;
        if(!isset($prevdata['segmentsdom']))
        $prevdata['segmentsdom'] = 0;
        if(!isset($prevdata['segmentslcc']))
        $prevdata['segmentslcc'] = 0;
        if(!isset($prevdata['segmentsdomlcc']))
        $prevdata['segmentsdomlcc'] = 0;
        if(!isset($prevdata['cartsdommobile']))
        $prevdata['cartsdommobile'] = 0;
        if(!isset($prevdata['passengers']))
        $prevdata['passengers'] = 0;
        if(!isset($prevdata['passengersdom']))
        $prevdata['passengersdom'] = 0;
        if(!isset($prevdata['passengersmobile']))
        $prevdata['passengersmobile'] = 0;
        if(!isset($prevdata['passengersmobiledom']))
        $prevdata['passengersmobiledom'] = 0;
        if(!isset($prevdata['cancel']))
        $prevdata['cancel'] = 0;
        if(!isset($prevdata['canceldom']))
        $prevdata['canceldom'] = 0;
        if(!isset($prevdata['res']))
        $prevdata['res'] = 0;
        if(!isset($prevdata['resdom']))
        $prevdata['resdom'] = 0;
?>

    <div id="wrapper">
    <div id="page-wrapper" class="gray-bg margin-n">
        <div class="row">
        <nav class="navbar navbar-static-top header-top-new" role="navigation" style="margin-bottom: 0">
        <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2" href="#"><img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/logo.png" alt=""/></a></div>
        
        <ul class="nav navbar-top-links navbar-left">
               <li><a href="../../b2c/reports/clientSourceReport">Client Source Report</a></li>
               <li><a href="../../b2c/reports/clientDetailReport">Source Detail</a></li>
               <li><a class="active" href="#">Sales Report</a></li>
               <li><a href="../../b2c/reports/airCartDetailReport">AirCart Detail Report</a></li>
               <li><a href="../../b2c/reports/airLineOverviewReport">Airline Overview Report</a></li>
               <li><a href="../../b2c/reports/airLineReport">Airline Report</a></li>
            </ul>
        
        <ul class="nav navbar-top-links navbar-right" style="">
            <li><a href="<?php echo $baseurl; ?>/site/logout"><i class="fa fa-sign-out"></i> Logout</a></li>
<!--               <li><a href="#"><i class="fa fa-file-pdf-o"></i> Pdf</a></li>
               <li><a href="#"><i class="fa fa-envelope"></i> E-mail</a></li>-->
            </ul>
            
        </nav>
        
        
        
        </div>
            <div class="wrapper wrapper-content animated fadeInRight padd-1">
            <div class="row">
                <div class="col-lg-12">
                <div class="ibox-content strip">
                <div class="row">
                <div class="col-lg-10">
                    
                    <ol class="breadcrumb breadcrumb1">
                        <li>Source Report</li>
                        <li>
                        
                            <form name="report_client" method="post" action="/b2c/reports/salesReport" style="background-color: lightcyan; width: 100%" id="reportsClient">
                                <div class="form-group date-u" id="data_5">
                                    <div class="input-daterange input-group" id="datepicker">
                                        <input type="text" class="input-sm form-control date-he" name="dateFrom" value="<?php echo date('m/d/Y',strtotime($datefrom));?>"/>
                                        <span class="input-group-addon">to</span>
                                        <input type="text" class="input-sm form-control date-he" name="dateTo" value="<?php echo date('m/d/Y',strtotime($dateto));?>" />
                                    </div>
                                </div>
                                <div class="form-group date-u" id="data_5">
                                    <table class="table table-bordered table-condensed">
                                        <colgroup><col width="150"><col></colgroup>
                                        <tbody><tr>
                                                <td>
                                                    <?php echo \TbHtml::dropDownList('clientSource', '', $clientSources, ['prompt' => '-- Client Source --', 'style' => 'width:100%']) ?>
                                                </td>
                                            </tr>
                                        </tbody></table></div>
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
            <th>Client Source</th>
            <td><?php if(!empty($cs)){ $ccs=\ClientSource::model()->findByPk((int)$cs); echo $ccs->name;}else echo 'All';?></td>
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
                            <h2>Sales Report Overview</h2>
                            
                            <?php
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
                            
                            <div class="row">
                <div class="col-lg-4">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title box_co1">
                            <h5>Total Sale</h5>
                            
                        </div>
                        <div class="ibox-content text-center h-200 ibox-b">
                           
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>Domestic</small><?php echo $data['salesdom'];?></div> 
                          <div class="col-lg-4">
                          <div class="col-lg-12 value"><i class="fa fa-long-arrow-up"></i> <small><?php echo getPercentage($data['sales'],$prevdata['sales']);?>% <br><?php echo $prevdata['sales'];?></small></div>
                          <div class="col-lg-12 prize"><?php echo $data['sales'];?></div>
                          <div class="col-lg-12">
                          <div class="col-lg-6 up">
                          <i class="fa fa-long-arrow-up"></i>
                          <div class="clearfix"></div>
                          <span class="block"> <?php echo $prevdata['salesdom'];?></span>
                          <div class="clearfix"></div>
                          <div class="circle1"><span><?php echo getPercentage($data['salesdom'],$prevdata['salesdom']);?></span>%</div>
                          </div>
                          <div class="col-lg-6 down">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block"> <?php echo ($prevdata['sales']-$prevdata['salesdom']);?></span>
                          <div class="circle"><span><?php echo getPercentage(($data['sales']-$data['salesdom']),($prevdata['sales']-$prevdata['salesdom']));?></span>%</div>
                          </div>
                          </div>
                          </div> 
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>International</small> <?php echo ($data['sales']-$data['salesdom']);?></div> 
                           
                        </div>
                        <div class="ibox-content text-center ibox-b-2">
                        
                        <div class="text-center">
                            <br/>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['salesdommobile'],$data['salesdom']);?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                            <h2>
                            Domestic
                            <span><?php echo getRatio($data['salesdommobile'],$data['salesdom']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['salesdommobile'],$data['salesdom']);?>% Website</span>
                            </h2>
                            </div>
                            <?php
                            $data['salesint']=$data['sales']-$data['salesdom'];
                            $data['salesintmobile']=$data['salesmobile']-$data['salesdommobile'];
                            ?>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['salesintmobile'],$data['salesint']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>International
                             <span><?php echo getRatio($data['salesintmobile'],$data['salesint']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['salesintmobile'],$data['salesint']);?>% Website</span>
                           
                            </h2>
                            </div>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['salesmobile'],$data['sales']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>Total
                              <span><?php echo getRatio($data['salesmobile'],$data['sales']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['salesmobile'],$data['sales']);?>% Website</span>
                           
                            </h2>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                
                
                <div class="col-lg-4">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title box_co2">
                            <h5>Total Carts</h5>
                            
                        </div>
                        <div class="ibox-content text-center h-200 ibox-b">
                           
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>Domestic</small><?php echo $data['cartsdom'];?></div> 
                          <div class="col-lg-4 ">
                          <div class="col-lg-12 value"><i class="fa <?php if($data['carts']>=$prevdata['carts']){echo 'fa-long-arrow-up';}else { echo 'fa-long-arrow-down';}?>"></i> <small><?php echo getPercentage($data['carts'],$prevdata['carts']);?>% <br><?php echo $prevdata['carts'];?></small></div>
                          <div class="col-lg-12 prize"><?php echo $data['carts'];?></div>
                          <div class="col-lg-12">
                          <div class="col-lg-6 <?php if($data['cartsdom']>=$prevdata['cartsdom']){echo 'up';}else { echo 'down';}?>">
                          <i class="fa <?php if($data['cartsdom']>=$prevdata['cartsdom']){echo 'fa-long-arrow-up';}else { echo 'fa-long-arrow-down';}?>"></i>
                            <span class="block"><?php echo $prevdata['cartsdom'];?></span>
                          <div class="circle1"><span><?php echo getPercentage($data['cartsdom'],$prevdata['cartsdom']);?></span>%</div>
                          </div>
                          <div class="col-lg-6 <?php if(($data['carts']-$data['cartsdom'])>=($prevdata['carts']-$prevdata['cartsdom'])){echo 'up';}else { echo 'down';}?>">
                          <i class="fa <?php if(($data['carts']-$data['cartsdom'])>=($prevdata['carts']-$prevdata['cartsdom'])){echo 'fa-long-arrow-up';}else { echo 'fa-long-arrow-down';}?>"></i>
                          <span class="block"> <?php echo ($prevdata['carts']-$prevdata['cartsdom']);?></span>
                          <div class="circle"><span><?php echo getPercentage(($data['carts']-$data['cartsdom']),($prevdata['carts']-$prevdata['cartsdom']));?></span>%</div>
                          </div>
                          </div>
                          </div> 
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>International</small> <?php echo ($data['carts']-$data['cartsdom']);?></div> 
                           
                        </div>
                        <div class="ibox-content text-center ibox-b-2">
                        
                        <div class="text-center">
                            <br/>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['cartsdommobile'],$data['cartsdom']);?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                            <h2>
                            Domestic
                            <span><?php echo getRatio($data['cartsdommobile'],$data['cartsdom']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['cartsdommobile'],$data['cartsdom']);?>% Website</span>
                            </h2>
                            </div>
                            <?php
                            $data['cartsint']=$data['carts']-$data['cartsdom'];
                            $data['cartsintmobile']=$data['cartsmobile']-$data['cartsdommobile'];
                            ?>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['cartsintmobile'],$data['cartsint']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>International
                             <span><?php echo getRatio($data['cartsintmobile'],$data['cartsint']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['cartsintmobile'],$data['cartsint']);?>% Website</span>
                           
                            </h2>
                            </div>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['cartsmobile'],$data['carts']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>Total
                              <span><?php echo getRatio($data['cartsmobile'],$data['carts']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['cartsmobile'],$data['carts']);?>% Website</span>
                           
                            </h2>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                
                
                <div class="col-lg-4">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title box_co3">
                            <h5>Total Segments</h5>
                            
                        </div>
                        <div class="ibox-content text-center h-200 ibox-b">
                           
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>Domestic</small><?php echo $data['segmentsdom'];?></div> 
                          <div class="col-lg-4">
                          <div class="col-lg-12 value"><i class="fa fa-long-arrow-up"></i> <small><?php echo getPercentage($data['segments'],$prevdata['segments']);?>% <br><?php echo $prevdata['segments'];?></small></div>
                          <div class="col-lg-12 prize"><?php echo $data['segments'];?></div>
                          <div class="col-lg-12">
                          <div class="col-lg-6 up">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block">  <?php echo $prevdata['segmentsdom'];?></span>
                          <div class="circle1"><span><?php echo getPercentage($data['segmentsdom'],$prevdata['segmentsdom']);?></span>%</div>
                          </div>
                          <div class="col-lg-6 down">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block"><?php echo ($prevdata['segments']-$prevdata['segmentsdom']);?></span>
                          <div class="circle"><span><?php echo getPercentage(($data['segments']-$data['segmentsdom']),($prevdata['segments']-$prevdata['segmentsdom']));?></span>%</div>
                          </div>
                          </div>
                          </div> 
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>International</small> <?php echo ($data['segments']-$data['segmentsdom']);?></div> 
                           
                        </div>
                        <div class="ibox-content text-center ibox-b-2">
                        
                        <div class="text-center">
                            <br/>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['segmentsdomlcc'],$data['segmentsdom']);?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                            <h2>
                            Domestic
                            <span><?php echo getRatio($data['segmentsdomlcc'],$data['segmentsdom']);?>% LCC</span>
                            <span><?php echo 100-getRatio($data['segmentsdomlcc'],$data['segmentsdom']);?>% GDS</span>
                            </h2>
                            </div>
                            <?php
                            $data['segmentsint']=$data['segments']-$data['segmentsdom'];
                            $data['segmentsintlcc']=$data['segmentslcc']-$data['segmentsdomlcc'];
                            ?>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['segmentsintlcc'],$data['segmentsint']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>International
                             <span><?php echo getRatio($data['segmentsintlcc'],$data['segmentsint']);?>% LCC</span>
                            <span><?php echo 100-getRatio($data['segmentsintlcc'],$data['segmentsint']);?>% GDS</span>
                           
                            </h2>
                            </div>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['segmentslcc'],$data['segments']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>Total
                              <span><?php echo getRatio($data['segmentslcc'],$data['segments']);?>% LCC</span>
                            <span><?php echo 100-getRatio($data['segmentslcc'],$data['segments']);?>% GDS</span>
                           
                            </h2>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                
                

            </div>
                            <div class="row">
                <div class="col-lg-4">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title box_co4">
                            <h5>Total Passengers</h5>
                            
                        </div>
                        <div class="ibox-content text-center h-200 ibox-b">
                           
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>Domestic</small><?php echo $data['passengersdom'];?></div> 
                          <div class="col-lg-4">
                          <div class="col-lg-12 value"><i class="fa fa-long-arrow-up"></i> <small><?php echo getPercentage($data['passengers'],$prevdata['passengers']);?>% <br><?php echo $prevdata['passengers'];?></small></div>
                          <div class="col-lg-12 prize"><?php echo $data['passengers'];?></div>
                          <div class="col-lg-12">
                          <div class="col-lg-6 up">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block">  <?php echo $prevdata['passengersdom'];?></span>
                          <div class="circle1"><span><?php echo getPercentage($data['passengersdom'],$prevdata['passengersdom']);?></span>%</div>
                          </div>
                          <div class="col-lg-6 down">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block"><?php echo ($prevdata['passengers']-$prevdata['passengersdom']);?></span>
                          <div class="circle"><span><?php echo getPercentage(($data['passengers']-$data['passengersdom']),($prevdata['passengers']-$prevdata['passengersdom']));?></span>%</div>
                          </div>
                          </div>
                          </div> 
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>International</small> <?php echo ($data['passengers']-$data['passengersdom']);?></div> 
                           
                        </div>
                        <div class="ibox-content text-center ibox-b-2">
                        
                        <div class="text-center">
                            <br/>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['passengersdommobile'],$data['passengersdom']);?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                            <h2>
                            Domestic
                            <span><?php echo getRatio($data['passengersdommobile'],$data['passengersdom']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['passengersdommobile'],$data['passengersdom']);?>% Website</span>
                            </h2>
                            </div>
                            <?php
                            $data['passengersint']=$data['passengers']-$data['passengersdom'];
                            $data['passengersintmobile']=$data['passengersmobile']-$data['passengersdommobile'];
                            ?>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['passengersintmobile'],$data['passengersint']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>International
                             <span><?php echo getRatio($data['passengersintmobile'],$data['passengersint']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['passengersintmobile'],$data['passengersint']);?>% Website</span>
                           
                            </h2>
                            </div>
                            <div class="m-r-md inline">
                            <input type="text" value="<?php echo getRatio($data['passengersmobile'],$data['passengers']);?>" class="dial m-r" data-fgColor="#1AB394" data-width="80" data-height="80"/>
                            <h2>Total
                              <span><?php echo getRatio($data['passengersmobile'],$data['passengers']);?>% Mobile</span>
                            <span><?php echo 100-getRatio($data['passengersmobile'],$data['passengers']);?>% Website</span>
                           
                            </h2>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                
                
                <div class="col-lg-4">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title box_co5">
                            <h5>Total Cancellation</h5>
                            
                        </div>
                        <div class="ibox-content text-center h-200 ibox-b">
                           
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>Domestic</small><?php echo $data['canceldom'];?></div> 
                          <div class="col-lg-4">
                          <div class="col-lg-12 value"><i class="fa fa-long-arrow-up"></i> <small><?php echo getPercentage($data['cancel'],$prevdata['cancel']);?>% <br><?php echo $prevdata['cancel'];?></small></div>
                          <div class="col-lg-12 prize"><?php echo $data['cancel'];?></div>
                          <div class="col-lg-12">
                          <div class="col-lg-6 up">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block"> <?php echo $prevdata['canceldom'];?></span>
                          <div class="circle1"><span><?php echo getPercentage($data['canceldom'],$prevdata['canceldom']);?></span>%</div>
                          </div>
                          <div class="col-lg-6 down">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block"><?php echo ($prevdata['cancel']-$prevdata['canceldom']);?></span>
                          <div class="circle"><span><?php echo getPercentage(($data['cancel']-$data['canceldom']),($prevdata['cancel']-$prevdata['canceldom']));?></span>%</div>
                          </div>
                          </div>
                          </div> 
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>International</small> <?php echo ($data['cancel']-$data['canceldom']);?></div> 
                           
                        </div>
                        
                    </div>
                    
                    
                    
                    <div class="col-lg-13">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title box_co6">
                            <h5>Total Reschedule</h5>
                            
                        </div>
                        <div class="ibox-content text-center h-200 ibox-b">
                           
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>Domestic</small><?php echo $data['resdom'];?></div> 
                          <div class="col-lg-4">
                          <div class="col-lg-12 value"><i class="fa fa-long-arrow-up"></i> <small><?php echo getPercentage($data['res'],$prevdata['res']);?>% <br><?php echo $prevdata['res'];?></small></div>
                          <div class="col-lg-12 prize"><?php echo $data['res'];?></div>
                          <div class="col-lg-12">
                          <div class="col-lg-6 up">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block">  <?php echo $prevdata['resdom'];?></span>
                          <div class="circle1"><span><?php echo getPercentage($data['resdom'],$prevdata['resdom']);?></span>%</div>
                          </div>
                          <div class="col-lg-6 down">
                          <i class="fa fa-long-arrow-up"></i>
                          <span class="block"><?php echo ($prevdata['res']-$prevdata['resdom']);?></span>
                          <div class="circle"><span><?php echo getPercentage(($data['res']-$data['resdom']),($prevdata['res']-$prevdata['resdom']));?></span>%</div>
                          </div>
                          </div>
                          </div> 
                          <div class="col-lg-4 plan"><i class="fa fa-plane"></i><small>International</small> <?php echo ($data['res']-$data['resdom']);?></div> 
                           
                        </div>
                        
                    </div>
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
