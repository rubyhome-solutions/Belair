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
<?php// echo $authMessage; ?>
<body>
    <?php
    $isadmin=false;
 if(\Authorization::getIsSuperAdminorClientSourceLogged()){
    if (!isset($data['searches']))
        $data['searches'] = 0;
    if (!isset($data['searchesdom']))
        $data['searchesdom'] = 0;
    if (!isset($data['redirectdom']))
        $data['redirectdom'] = 0;    
    if (!isset($data['redirect']))
        $data['redirect'] = 0;
    if (!isset($data['redirectmobile']))
        $data['redirectmobile'] = 0;
    if (!isset($data['redirectmobiledom']))
        $data['redirectmobiledom'] = 0;
    if (!isset($data['bookingsdom']))
        $data['bookingsdom'] = 0;
    if (!isset($data['bookings']))
        $data['bookings'] = 0;
    if (!isset($data['bookingsmobile']))
        $data['bookingsmobile'] = 0;
     if (!isset($data['bookingsmobiledom']))
        $data['bookingsmobiledom'] = 0;

    if (!isset($prevdata['searches']))
        $prevdata['searches'] = 0;
    if (!isset($prevdata['searchesdom']))
        $prevdata['searchesdom'] = 0;
    if (!isset($prevdata['redirectdom']))
        $prevdata['redirectdom'] = 0;
    if (!isset($prevdata['redirect']))
        $prevdata['redirect'] = 0;
    if (!isset($data['redirectmobile']))
        $data['redirectmobile'] = 0;
    if (!isset($data['redirectmobiledom']))
        $data['redirectmobiledom'] = 0;
    if (!isset($prevdata['bookingsdom']))
        $prevdata['bookingsdom'] = 0;
    if (!isset($prevdata['bookings']))
        $prevdata['bookings'] = 0;
    if (!isset($prevdata['bookingsmobile']))
        $prevdata['bookingsmobile'] = 0;
    if (!isset($prevdata['bookingsmobiledom']))
        $prevdata['bookingsmobiledom'] = 0;

    $data['searchesint'] =$data['searches']-$data['searchesdom'];
    $data['redirectint'] =$data['redirect']-$data['redirectdom'];
    $data['redirectmobileint']=$data['redirectmobile']-$data['redirectmobiledom'];
    
    $data['bookingsint'] =$data['bookings']-$data['bookingsdom'];
    $data['bookingsmobileint']=$data['bookingsmobile']-$data['bookingsmobiledom'];
    
    $prevdata['searchesint'] =$prevdata['searches']-$prevdata['searchesdom'];
    $prevdata['redirectint'] =$prevdata['redirect']-$prevdata['redirectdom'];
    $prevdata['redirectmobileint']=$prevdata['redirectmobile']-$prevdata['redirectmobiledom'];
    
    $prevdata['bookingsint'] =$prevdata['bookings']-$prevdata['bookingsdom'];
    $prevdata['bookingsmobileint']=$prevdata['bookingsmobile']-$prevdata['bookingsmobiledom'];
    
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
    <div id="reportid">
    <div id="wrapper">
    <div id="page-wrapper" class="gray-bg margin-n">
        <div class="row">
        <nav class="navbar navbar-static-top header-top-new" role="navigation" style="margin-bottom: 0">
        <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2" href="#"><img src="<?php echo $host; ?>/img/logo.png" alt=""/></a></div>
        
        <ul class="nav navbar-top-links navbar-left">
            <?php if(\Authorization::getIsSuperAdminLogged()){
                $isadmin=true;
                ?>
               <li><a class="active" href="#">Client Source Report</a></li>
               <li><a href="../../b2c/reports/clientDetailReport">Source Detail</a></li>
               <li><a href="../../b2c/reports/salesReport">Sales Report</a></li>
               <li><a href="../../b2c/reports/airCartDetailReport">AirCart Detail Report</a></li>
               <li><a href="../../b2c/reports/airLineOverviewReport">Airline Overview Report</a></li>
               <li><a href="../../b2c/reports/airLineReport">Airline Report</a></li>
            <?php } else{?>
               <li><a class="active" href="#">Client Source Report</a></li>
               <li><a href="../../b2c/reports/clientDetailReport">Source Detail</a></li>
               <li><a href="../../b2c/reports/airCartDetailReport">AirCart Detail Report</a></li>
            <?php }?>
            </ul>
        
        <ul class="nav navbar-top-links navbar-right" style="display:none">
                <li><form method="POST"  action="/b2c/reports/asPdf" >
                        <input type="hidden" value=1 name="pdf">
                        <input type="hidden" value='' name="report" id='report'>
                        <button class="fa fa-file-pdf-o" type="submit">PDF</button>
                    </form>
                </li>
               <li><a href="#"><i class="fa fa-envelope"></i> E-mail</a></li>
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
                        
                            <form name="report_client" method="post" action="/b2c/reports/clientSourceReport" style="background-color: lightcyan; width: 100%" id="reportsClient">
                                <div class="form-group date-u" id="data_5">
                                    <div class="input-daterange input-group" id="datepicker">
                                        <input type="text" class="input-sm form-control date-he" name="dateFrom" value="<?php echo date('m/d/Y',strtotime($datefrom));?>"/>
                                        <span class="input-group-addon">to</span>
                                        <input type="text" class="input-sm form-control date-he" name="dateTo" value="<?php echo date('m/d/Y',strtotime($dateto));?>" />
                                    </div>
                                </div>
                                <div class="form-group date-u" id="data_5">
                                    <?php if(\Authorization::getIsSuperAdminLogged()){?>
                                    <table class="table table-bordered table-condensed">
                                        <colgroup><col width="150"><col></colgroup>
                                        <tbody><tr>
                                                <td>
                                                    <?php echo \TbHtml::dropDownList('clientSource', '', $clientSources, ['prompt' => '-- Client Source --', 'style' => 'width:100%']) ?>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                     <?php }?>
                                </div>
                                <button type="submit" onclick="" class="btn2 btn-default date-u"><i class="fa fa-table"></i> Generate</button>
                            </form>
                        </li>
                        
                        
                       </ol>
                       
                </div>
                <div class="col-lg-1 navbar-right check-box always">
                    <?php if(\Authorization::getIsSuperAdminLogged()){?>
                        <label> <input type="checkbox" class="check"> </label>
                    <?php }?>
                        </div>
<div class="col-lg-12" id='tblData'>                   
                    <table  class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>            
            <th>Date From</th>
            <td><?php echo $datefrom;?></td>
            <th>Date To</th>
            <td><?php echo $dateto;?></td>
             <?php if(\Authorization::getIsSuperAdminLogged()){?>
            <th>Previous Date From</th>           
            <td><?php echo $prevdatefrom;?></td>
            <th>Previous Date To</th>
            <td><?php echo $prevdateto;?></td>
            <?php }?>
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
        <div id='tblReportData'>
        <div  class="wrapper wrapper-content animated fadeInRight ">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content">
                            <h2>Source Report</h2>
                            <div class="row prisse-stu">
                            <div class="col-lg-12 Source-f-2">
                           	<div class="col-lg-4 hide1 searches">
                            <div class="col-lg-12 stc">
                            <div class="ibox-title box_co1">
                            <h5>Searches</h5>
                            </div>
                                <div class="col-lg-12 Source">
                                    <div class="col-lg-12">
                                        <span class="font-l"><?php echo $data['searches']; ?> <div class="circle2 <?php if ($data['searches'] >= $prevdata['searches']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data['searches'] >= $prevdata['searches']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div></span> 
                                        <span class="<?php if ($data['searches'] >= $prevdata['searches']) { ?>green<?php } else { ?>red<?php } ?> font-l hide1"><?php echo $prevdata['searches']; ?><sub class="<?php if ($data['searches'] >= $prevdata['searches']) { ?>green<?php } else { ?>red<?php } ?>"><?php echo '(' . getPercentage($prevdata['searches'], $data['searches']) . ')'; ?>% (Pre)</sub></span>
                                    </div>
                                </div>
                           
                            
                                
                                <div class="col-lg-12 Source-f">
                                    <div class="col-lg-6">
                                        <img src="<?php echo $baseurl;?>/themes/B2C/img/plan2.png"/>
                                        <p>Domestic</p>
                                        <h2><?php echo $data['searchesdom']; ?><sub class="hide1" ><br><?php echo $prevdata['searchesdom']; ?>  (Pre)<i class="fa <?php if ($data['searchesdom'] >= $prevdata['searchesdom']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?> size2"></i></sub></h2>
                                    </div>
                                    <div class="col-lg-6">
                                        <i class="fa fa-globe"></i>
                                        <?php
                                        $data['searchesint'] = $data['searches'] - $data['searchesdom'];
                                        $prevdata['searchesint'] = $prevdata['searches'] - $prevdata['searchesdom'];
                                        ?>
                                        <p> International</p>
                                        <h2><?php echo $data['searchesint']; ?> <sub class="hide1" ><br><?php echo $prevdata['searchesint']; ?> (Pre) <i class="fa <?php if ($data['searchesint'] >= $prevdata['searchesint']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?>"></i></sub></h2>
                                    </div>
                                </div>
                            </div>
                            </div>
                            
                             <div class="col-lg-6 remove-data1">
                            <div class="col-lg-8">
                            <div class="ibox-title box_co3">
                            <h5>Redirects</h5>
                            </div>
                            
                            <div class="col-lg-12 Source">
                                <div class="col-lg-12">
                                    <span class="font-l"><?php echo $data['redirect']; ?><div class="circle2 <?php if ($data['redirect'] >= $prevdata['redirect']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data['redirect'] >= $prevdata['redirect']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div></span> 
                                    <span class="<?php if ($data['redirect'] >= $prevdata['redirect']) { ?>green<?php } else { ?>red<?php } ?> font-l hide1"><?php echo $prevdata['redirect']; ?><sub class="<?php if ($data['redirect'] >= $prevdata['redirect']) { ?>green<?php } else { ?>red<?php } ?>"><?php echo '  (' . getPercentage($prevdata['redirect'], $data['redirect']) . ') '; ?>% (Pre) </sub></span>
                                </div>
                            </div>
                           
                            
                                
                            <div class="col-lg-12 Source-f">
                                    <div class="col-lg-6">
                                        <img src="<?php echo $baseurl;?>/themes/B2C/img/plan2.png"/>
                                        <p>Domestic</p>
                                        <h2><?php echo $data['redirectdom']; ?><sub class="hide1" ><?php echo $prevdata['redirectdom']; ?>  (Pre)<i class="fa <?php if ($data['redirectdom'] >= $prevdata['redirectdom']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?> "></i></sub></h2>
                                        <div class="web-c">
                                            <p class="mob">Mobile : <span><?php echo getRatio($data['redirectmobiledom'],$data['redirectdom']);?>%</span></p>
                                            <p class="web-s">Website : <span><?php echo 100-getRatio($data['redirectmobiledom'],$data['redirectdom']);?>%</span></p>
                                        </div>                                    
                                    </div>
                                    <?php
                                    $data['redirectint'] = $data['redirect'] - $data['redirectdom'];
                                    $prevdata['redirectint'] = $prevdata['redirect'] - $prevdata['redirectdom'];
                                    ?>
                                    <div class="col-lg-6">
                                        <i class="fa fa-globe"></i>
                                        <p>International</p>
                                        <h2><?php echo $data['redirectint']; ?><sub class="hide1" ><?php echo $prevdata['redirectint']; ?> (Pre)<i class="fa <?php if ($data['redirectint'] >= $prevdata['redirectint']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?>"></i></sub></h2>
                                        <div class="web-c">
                                            <p class="mob">Mobile : <span><?php echo getRatio($data['redirectmobileint'],$data['redirectint']);?>%</span></p>
                                            <p class="web-s">Website : <span><?php echo 100-getRatio($data['redirectmobileint'],$data['redirectint']);?>%</span></p>
                                        </div>
                                    </div>
                            </div>
                                
                            </div>
                            <div class="col-lg-4 chart-p">
                            
                                <div class="inline">
                                    <input type="text" value="<?php echo getRatio($data['redirectmobile'], $data['redirect']); ?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                                    <p> Mobile : <?php echo getRatio($data['redirectmobile'], $data['redirect']) . '%  (' . $data['redirectmobile'] . ') '; ?></p>
                                    <p>Website : <?php echo 100-getRatio($data['redirectmobile'], $data['redirect']) . '%  (' . ($data['redirect'] - $data['redirectmobile']) . ') '; ?></p>
                                </div>
                            
                            </div>
                            </div>
                              
                              
                              <div class="col-lg-6 remove-data1">
                            <div class="col-lg-8">
                            <div class="ibox-title box_co6">
                            <h5>Books</h5>
                            </div>
                            <div class="col-lg-12 Source">
                                <div class="col-lg-12">
                                    <span class="font-l"><?php echo $data['bookings']; ?><div class="circle2 <?php if ($data['bookings'] >= $prevdata['bookings']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data['bookings'] >= $prevdata['bookings']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div></span> 
                                    <span class="<?php if ($data['bookings'] >= $prevdata['bookings']) { ?>green<?php } else { ?>red<?php } ?> font-l hide1"><?php echo $prevdata['bookings']; ?><sub class="<?php if ($data['bookings'] >= $prevdata['bookings']) { ?>green<?php } else { ?>red<?php } ?>"><?php echo '  (' . getPercentage($prevdata['bookings'], $data['bookings']) . ') '; ?>% (Pre)</sub></span>
                                </div>
                            </div>
                           
                                                            
                                <div class="col-lg-12 Source-f">
                                    <div class="col-lg-6">
                                        <img src="<?php echo $baseurl;?>/themes/B2C/img/plan2.png"/>
                                        <p>Domestic</p>
                                        <h2><?php echo $data['bookingsdom']; ?><sub class="hide1" ><?php echo $prevdata['bookingsdom']; ?> (Pre) <i class="fa <?php if ($data['bookingsdom'] >= $prevdata['bookingsdom']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?> "></i></sub></h2>
                                        <div class="web-c">
                                            <p class="mob">Mobile : <span><?php echo getRatio($data['bookingsmobiledom'],$data['bookingsdom']);?>%</span></p>
                                            <p class="web-s">Website : <span><?php echo 100-getRatio($data['bookingsmobiledom'],$data['bookingsdom']);?>%</span></p>
                                        </div>
                                    </div>
                                    <?php
                                    $data['bookingsint'] = $data['bookings'] - $data['bookingsdom'];
                                    $prevdata['bookingsint'] = $prevdata['bookings'] - $prevdata['bookingsdom'];
                                    ?>
                                    <div class="col-lg-6">
                                        <i class="fa fa-globe"></i>
                                        <p> International</p>
                                        <h2><?php echo $data['bookingsint']; ?><sub class="hide1" ><?php echo $prevdata['bookingsint']; ?>(Pre) <i class="fa <?php if ($data['bookingsint'] >= $prevdata['bookingsint']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?>"></i></sub></h2>
                                        <div class="web-c">
                                            <p class="mob">Mobile : <span><?php echo getRatio($data['bookingsmobileint'],$data['bookingsint']);?>%</span></p>
                                            <p class="web-s">Website : <span><?php echo 100-getRatio($data['bookingsmobileint'],$data['bookingsint']);?>%</span></p>
                                        </div>
                                    </div>
                                </div>   
                                
                            </div>
                            <div class="col-lg-4 chart-p">
                            
                            <div class="inline">
                                <input type="text" value="<?php echo getRatio($data['bookingsmobile'],$data['bookings']); ?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                                <p> Mobile : <?php echo getRatio($data['bookingsmobile'],$data['bookings']).'%  ('.$data['bookingsmobile'].') '; ?></p>
                                <p>Website : <?php echo 100-getRatio($data['bookingsmobile'],$data['bookings']).'%  ('.($data['bookings']-$data['bookingsmobile']).') '; ?></p>
                            </div>
                            
                            </div>
                            </div>
                            </div>
                            
                            <div class="col-lg-12 padd-4"> 
                            
                            
                            
                            
                           
                                <div class="col-lg-3 block-1">
                               <div class="col-lg-12 box_co6">Ratios</div>
                                <div class="col-lg-12 inner hide1">&nbsp;</div>
                                <div class="col-lg-12 inner inner2 hide1">S/R%</div>
                                <div class="col-lg-12 inner inner2">R/B% Total</div>
                                <div class="col-lg-12 inner inner2">R/B% Mobile</div>
                                <div class="col-lg-12 inner inner2">R/B% Web</div>
                                </div>
                                
                                <div class="col-lg-3 block-2">
                                <div class="col-lg-12 box_co6">Domestic</div>
                                <div class="col-lg-12 inner hide1">
                                <div class="col-lg-12 remove-data ">Current</div>
                                <div class="col-lg-4 hide1">Previous</div>
                                <div class="col-lg-4 hide1">Change</div>
                                </div>
                                <div class="col-lg-12 inner inner2 hide1">
                                <div class="col-lg-12 remove-data hide1"><span class="rado-h">S/R</span> <?php echo $td=getRatio($data['redirectdom'],$data['searchesdom']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['redirectdom'],$prevdata['searchesdom']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B</span> <?php echo $td=getRatio($data['bookingsdom'],$data['redirectdom']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['bookingsdom'],$prevdata['redirectdom']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B-Mob</span> <?php echo $td=getRatio($data['bookingsmobiledom'],$data['redirectmobiledom']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['bookingsmobiledom'],$prevdata['redirectmobiledom']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B-Web</span> <?php echo $td=getRatio(($data['bookingsdom']-$data['bookingsmobiledom']),($data['redirectdom']-$data['redirectmobiledom'])); ?>%</div>
                                <div class="col-lg-4 hide1"><?php echo $tp=getRatio(($prevdata['bookingsdom']-$prevdata['bookingsmobiledom']),($prevdata['redirectdom']-$prevdata['redirectmobiledom'])); ?>%</div>
                               <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                </div>
                                
                                <div class="col-lg-3 block-3">
                                <div class="col-lg-12 box_co6">International</div>
                                <div class="col-lg-12 inner hide1">
                                <div class="col-lg-12 remove-data ">Current</div>
                                <div class="col-lg-4 hide1">Previous</div>
                                <div class="col-lg-4 hide1">Change</div>
                                </div>
                                <div class="col-lg-12 inner inner2 hide1">
                                <div class="col-lg-12 remove-data hide1"><span class="rado-h">S/R</span> <?php echo $td=getRatio($data['redirectint'],$data['searchesint']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['redirectint'],$prevdata['searchesint']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B</span><?php echo $td=getRatio($data['bookingsint'],$data['redirectint']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['bookingsint'],$prevdata['redirectint']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B-Mob</span><?php echo $td=getRatio($data['bookingsmobileint'],$data['redirectmobileint']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['bookingsmobileint'],$prevdata['redirectmobileint']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B-Web</span> <?php echo $td=getRatio(($data['bookingsint']-$data['bookingsmobileint']),($data['redirectint']-$data['redirectmobileint'])); ?>%</div>
                                <div class="col-lg-4 hide1"><?php echo $tp=getRatio(($prevdata['bookingsint']-$prevdata['bookingsmobileint']),($prevdata['redirectint']-$prevdata['redirectmobileint'])); ?>%</div>
                                <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                </div>
                                
                                
                                
                                
                                
                                <div class="col-lg-3 block-4">
                                <div class="col-lg-12 box_co6">Total</div>
                                <div class="col-lg-12 inner hide1">
                                <div class="col-lg-4 remove-data ">Current</div>
                                <div class="col-lg-4 hide1">Previous</div>
                                <div class="col-lg-4 hide1">Change</div>
                                </div>
                                <div class="col-lg-12 inner inner2 hide1">
                                <div class="col-lg-12 remove-data hide1"><span class="rado-h">S/R</span><?php echo $td=getRatio($data['redirect'],$data['searches']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['redirect'],$prevdata['searches']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B</span><?php echo $td=getRatio($data['bookings'],$data['redirect']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['bookings'],$prevdata['redirect']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B-Mob</span><?php echo $td=getRatio($data['bookingsmobile'],$data['redirectmobile']); ?>%</div>
                            <div class="col-lg-4 hide1"><?php echo $tp=getRatio($prevdata['bookingsmobile'],$prevdata['redirectmobile']); ?>%</div>
                            <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                <div class="col-lg-12 inner inner2">
                                <div class="col-lg-12 remove-data"><span class="rado-h">R/B-Web</span><?php echo $td=getRatio(($data['bookings']-$data['bookingsmobile']),($data['redirect']-$data['redirectmobile'])); ?>%</div>
                                <div class="col-lg-4 hide1"><?php echo $tp=getRatio(($prevdata['bookings']-$prevdata['bookingsmobile']),($prevdata['redirect']-$prevdata['redirectmobile'])); ?>%</div>
                                <div class="col-lg-4 <?php if($td>=$tp){ echo 'green';}else { echo 'red';} ?> hide1"><?php echo getPercentage($td,$tp); ?>% <i class="fa <?php if($td>=$tp){ echo 'fa-long-arrow-up size2';}else { echo 'fa-long-arrow-down size1'; } ?> "></i></div>
                                 </div>
                                </div>
                                
                            
                            </div>
                            
                            </div>
                            
                            <h2>Top 5 Sectors</h2>
                            <div class="row prisse-stu">
                            
                            <div class="col-lg-12 Source-f-2">
                           	<div class="col-lg-4 hide1">
                            <div class="col-lg-12">
                            <div class="ibox-title box_co4">
                            <h5>Searches</h5>
                            </div>
                            <div class="col-lg-12 top-sec">
                                <?php foreach ($data['searchessector'] as $value) { ?>

                                    <div class="col-lg-12">
                                        <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode(trim($value['source'])); ?></div>
                                        <div class="col-lg-4"><i class="fa fa-long-arrow-right"></i></div>
                                        <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode(trim($value['destination'])); ?></div>
                                    </div>

                                <?php } ?>

                            </div>
                           
                            
                            </div>
                            </div>
                            
                             <div class="col-lg-4 remove-data1">
                            <div class="col-lg-12">
                            <div class="ibox-title box_co5">
                            <h5>Redirects</h5>
                            </div>
                            <div class="col-lg-12 top-sec">
                                <?php foreach ($data['redirectsector'] as $value) { ?>

                                    <div class="col-lg-12">
                                        <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode(trim($value['source'])); ?></div>
                                        <div class="col-lg-4"><i class="fa fa-long-arrow-right"></i></div>
                                        <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode(trim($value['destination'])); ?></div>
                                    </div>

                                <?php } ?>



                            </div>
                           
                            
                            </div>
                            </div>
                              
                              
                            <div class="col-lg-4 remove-data1">
                            <div class="col-lg-12">
                            <div class="ibox-title box_co3">
                            <h5>Books</h5>
                            </div>
                            <div class="col-lg-12 top-sec">
                                <?php foreach ($data['bookingssector'] as $value) { ?>

                                    <div class="col-lg-12">
                                        <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode(trim($value['source'])); ?></div>
                                        <div class="col-lg-4"><i class="fa fa-long-arrow-right"></i></div>
                                        <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode(trim($value['destination'])); ?></div>
                                    </div>

                                <?php } ?>
                            </div>
                           
                            
                            </div>
                            </div>
                            
                            
                            
                            </div>
                            </div>
                            
                            <h2>Top 5 Airline</h2>
                            <div class="row prisse-stu">
                            
                            <div class="col-lg-12 Source-f-2">
                           	
                             <div class="col-lg-6">
                            <div class="col-lg-12">
                            <div class="ibox-title box_co1">
                            <h5>Redirects</h5>
                            </div>
                            <div class="col-lg-12 airline">
                                <?php foreach ($data['redirectairline'] as $value) { ?>
                                    <div class="col-lg-12"><img src="<?php echo $baseurl;?>/img/air_logos/<?php echo $value['code']; ?>.png"> <span><?php echo $value['name']; ?></span></div>

                                <?php } ?>
                            </div>
                           
                            
                            </div>
                            </div>
                              
                              
                            <div class="col-lg-6">
                            <div class="col-lg-12">
                            <div class="ibox-title box_co6">
                            <h5>Books</h5>
                            </div>
                            <div class="col-lg-12 airline">
                                <?php foreach ($data['bookingsairline'] as $value) { ?>
                                    <div class="col-lg-12"><img src="<?php echo $baseurl;?>/img/air_logos/<?php echo $value['code']; ?>.png"> <span><?php echo $value['name']; ?></span></div>

                                <?php } ?>
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
        </div>
        <div class="footer">
            <div>
                <strong>© Airtickets India Pvt. Ltd</strong> - All Rights Reserved
            </div>
        </div>

        </div>
        </div>
</div>
<?php }?>

   <!-- Mainly scripts -->
     <!-- Mainly scripts -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/jquery-2.1.1.js"></script>
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/bootstrap.min.js"></script>


        <!-- chart -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/jsKnob/jquery.knob.js"></script>
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/datapicker/bootstrap-datepicker.js"></script>

        <!-- checkbox -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/iCheck/icheck.min.js"></script>

    
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
                 
                 


$(document).ready(function(){
    var check = "yes";
	$('.searches').hide();
        $(".hide1").hide();
        $(".check").click(function(){
        $(".hide1").toggle();
		$('.font-l').toggleClass('data-man');
		if(check == 'yes')
		{
		$('.remove-data').addClass('col-lg-4').removeClass('col-lg-12');
		$('.remove-data1').addClass('col-lg-4').removeClass('col-lg-6');
		check = "No";
		}
		else
		{
		$('.remove-data').removeClass('col-lg-4').addClass('col-lg-12');
		$('.remove-data1').addClass('col-lg-6').removeClass('col-lg-4');
		check = "yes";
		}
	});
        
    var header=$('head').html();
    var tblheader=$('#tblData').html();
    var report=$('#reportid').html();//tblheader+$('#tblReportData').html();
    $('#report').val(report);
	
});

function toPdf(){
    
    var header=$('head').html();
    var tblheader=$('#tblData').html();
    var report=tblheader+$('#tblReportData').html();
    report=$('#report').val();
    $.post('/b2c/reports/asPdf', {
            report: report
        }).done(function () {
            //$('#mssg').text('Email Sent').fadeIn();
            //$('#msg').fadeIn();
        })
        .fail(function () {
                    //$('#mssg').text('Email Sending Failed!').fadeIn();
                    //$('#msg').fadeIn();
        })
        .always(function () {

                   // $('#btnEmail').attr('disabled', false);
                   // $('#btnEmail').removeClass('disabled');
        });
}
    </script>
   
</body>
 
 <?php 
    if (!isset(\Yii::app()->user->id)){ ?>
    <script>
       //$('#loginModal').modal('show');
       $('#loginModal').modal({backdrop: 'static', show: true});
    </script>
    <?php }?>
</html>
