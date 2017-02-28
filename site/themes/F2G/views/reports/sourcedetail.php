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
if(\Authorization::getIsSuperAdminorClientSourceLogged()){ ?>
    <div id="wrapper">
    <div id="page-wrapper" class="gray-bg margin-n">
        <div class="row">
        <nav class="navbar navbar-static-top header-top-new" role="navigation" style="margin-bottom: 0">
        <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2" href="#"><img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/logo.png" alt=""/></a></div>
        
        <ul class="nav navbar-top-links navbar-left">
              <?php if(\Authorization::getIsSuperAdminLogged()){?>
                <li><a href="../../b2c/reports/clientSourceReport">Client Source Report</a></li>
                <li><a class="active" href="#">Source Detail</a></li>
                <li><a href="../../b2c/reports/salesReport">Sales Report</a></li>
                <li><a href="../../b2c/reports/airCartDetailReport">AirCart Detail Report</a></li>
                <li><a href="../../b2c/reports/airLineOverviewReport">Airline Overview Report</a></li>
                <li><a href="../../b2c/reports/airLineReport">Airline Report</a></li>
                <?php } else{?>
                 <li><a  href="../../b2c/reports/clientSourceReport">Client Source Report</a></li>
                 <li><a class="active" href="#">Source Detail</a></li>
                 <li><a href="../../b2c/reports/airCartDetailReport">AirCart Detail Report</a></li>
                <?php }?>
            </ul>
        <ul class="nav navbar-top-links navbar-right" style="display:none">
               <li><a href="#"><i class="fa fa-file-pdf-o"></i> Pdf</a></li>
               <li><a href="#"><i class="fa fa-envelope"></i> E-mail</a></li>
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
                        <li>Source Datewise Report</li>
                        <li>
                        
                            <form name="report_client" method="post" action="/b2c/reports/clientDetailReport" style="background-color: lightcyan; width: 100%" id="reportsClient">
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
                    <div class="col-lg-12">                   
                    <table class="table table-condensed table-bordered table-hover" style="width: initial;">
    <tbody><tr>            
            <th>Date From</th>
            <td><?php echo $datefrom;?></td>
            <th>Date To</th>
            <td><?php echo $dateto;?></td>
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
                            <h2>Source Datewise Report</h2>
                            
                            
                            <?php 
                      function getRatio($data, $total) {
        if ($total <= 0 || $data <= 0 ) {
            return 0;
        } else {
            return number_format(abs(100 * ((double) $data) / (double) $total), 2);
        }
    }
                      $date = $dateto;
                        // End date
                        $end_date = $datefrom;
                        $i=0;
						$first=true;
                            while (strtotime($date) >= strtotime($end_date)) {
                      ?>
                      
                      
                            <div class="col-lg-2 center-t block-5">
                            <?php if($first){?>
                            <div class="col-lg-12 s-date">Date</div>
                            <?php }?>
                            <div class="col-lg-12 <?php if($i%2==0){echo 'ret-b';} else{echo 'sou-ret';}?>"><span class="f-mob">Date</span><?php echo $date.'';?></div>
                            </div>
                            
                            <div class="col-lg-3 center-t block-6">
                            
                            <?php if($first){?>
                            <div class="col-lg-12 s-date">Searches</div>
                             <?php }?>
                             
                            <div class="col-lg-12 <?php if($i%2==0){echo 'ret-b';} else{echo 'sou-ret';}?>">
                            <span class="f-mob">Searches</span>
                            <h1>(Int <?php if(isset($data['searchesdom'][$date.''])){echo $data['searches'][$date.'']-$data['searchesdom'][$date.''];}else{echo '0';}?> / Dom <?php if(isset($data['searchesdom'][$date.''])){echo $data['searchesdom'][$date.''];}else{echo '0';}?>) = <span><?php if(isset($data['searches'][$date.''])){echo $data['searches'][$date.''];}else{echo '0';}?></span></h1>
                            </div>
                            </div>
                            
                            
                            <div class="col-lg-3 center-t block-7">
                            <?php if($first){?>
                            <div class="col-lg-12 s-date">Redirect</div>
                             <?php }?>
                            <?php if(!isset($data['redirectmobile'][$date.''])){ $data['redirectmobile'][$date.'']=0;}                       
                            if(!isset($data['redirect'][$date.''])){ $data['redirect'][$date.'']=0;}
                            if(!isset($data['redirectdom'][$date.''])){ $data['redirectdom'][$date.'']=0;}
                            if(!isset($data['redirectmobiledom'][$date.''])){ $data['redirectmobiledom'][$date.'']=0;}
                            $data['redirectint'][$date.'']=$data['redirect'][$date.'']-$data['redirectdom'][$date.''];
                            $data['redirectmobileint'][$date.'']=$data['redirectmobile'][$date.'']-$data['redirectmobiledom'][$date.''];
                      ?>
                            <div class="col-lg-12 <?php if($i%2==0){echo 'ret-b';} else{echo 'sou-ret';}?>">
                            <span class="f-mob">Redirect</span>
                            <div class="col-lg-12">
                            Web <h1>Int <?php echo $data['redirectint'][$date.'']-$data['redirectmobileint'][$date.''];?> / Dom <?php echo $data['redirectdom'][$date.'']-$data['redirectmobiledom'][$date.''];?> = <span><?php echo $data['redirect'][$date.'']-$data['redirectmobile'][$date.''];?></span></h1></div>
                      <div class="col-lg-12">Mob <h1>Int <?php echo $data['redirectmobileint'][$date.''];?> / Dom <?php echo $data['redirectmobiledom'][$date.''];?> = <span><?php echo $data['redirectmobile'][$date.''];?></span></h1></div>
                      <div class="col-lg-12">Total <h1>Int <?php echo $data['redirectint'][$date.''];?> / Dom <?php echo $data['redirectdom'][$date.''];?> = <span><?php echo $data['redirect'][$date.''];?></span></h1></div>
                            </div>
                            </div>
                            
                            
                            <div class="col-lg-1 center-t p-4 block-8">
                              <?php if($first){?>
                            <div class="col-lg-12 s-date">Ratio
                            <div class="arrow-p2"></div>
                            </div>
                             <?php }?>
                            <?php if(!isset($data['bookingsmobile'][$date.''])){ $data['bookingsmobile'][$date.'']=0;}                       
                            if(!isset($data['bookings'][$date.''])){ $data['bookings'][$date.'']=0;}
                            if(!isset($data['bookingsdom'][$date.''])){ $data['bookingsdom'][$date.'']=0;}
                            if(!isset($data['bookingsmobiledom'][$date.''])){ $data['bookingsmobiledom'][$date.'']=0;}
                            $data['bookingsint'][$date.'']=$data['bookings'][$date.'']-$data['bookingsdom'][$date.''];
                            $data['bookingsmobileint'][$date.'']=$data['bookingsmobile'][$date.'']-$data['bookingsmobiledom'][$date.''];
                      ?>
                            <div class="col-lg-12 <?php if($i%2==0){echo 'ret-b';} else{echo 'sou-ret';}?>">
                            <span class="f-mob">Ratio</span>
                            <div class="col-lg-12 p-5">
                            R/B Web<span><?php echo getRatio(($data['bookings'][$date.'']-$data['bookingsmobile'][$date.'']),($data['redirect'][$date.'']-$data['redirectmobile'][$date.'']));?></span></div>
                      <div class="col-lg-12 p-5">R/B Mobile<span><?php echo getRatio($data['bookingsmobile'][$date.''],$data['redirectmobile'][$date.'']);?></span></div>
                      <div class="col-lg-12 p-5">R/B Total<span><?php echo getRatio($data['bookings'][$date.''],$data['redirect'][$date.'']);?></span></div>
                            </div>
                            </div>
                            
                            
                            <div class="col-lg-3 center-t block-9">
                             <?php if($first){?>
                            <div class="col-lg-12 s-date">Booking</div>
                            <?php }?>
                            <div class="col-lg-12 <?php if($i%2==0){echo 'ret-b';} else{echo 'sou-ret';}?>">
                            <div class="col-lg-12">
                            
                            Web <h1>Int <?php echo $data['bookingsint'][$date.'']-$data['bookingsmobileint'][$date.''];?> / Dom <?php echo $data['bookingsdom'][$date.'']-$data['bookingsmobiledom'][$date.''];?> = <span><?php echo $data['bookings'][$date.'']-$data['bookingsmobile'][$date.''];?></span></h1></div>
                      <div class="col-lg-12">Mob <h1>Int <?php echo $data['bookingsmobileint'][$date.''];?> / Dom <?php echo $data['bookingsmobiledom'][$date.''];?> = <span><?php echo $data['bookingsmobile'][$date.''];?></span></h1></div>
                     <div class="col-lg-12">Total <h1>Int <?php echo $data['bookingsint'][$date.''];?> / Dom <?php echo $data['bookingsdom'][$date.''];?> = <span><?php echo $data['bookings'][$date.''];?></span></h1></div>
                            </div>
                            </div>
                            
                       <?php 
                      $date = date ("Y-m-d", strtotime("-1 day", strtotime($date)));
                      $i++;
					  $first=false;
                            }
                      ?>
                     <div style="clear:both"></div>  
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
