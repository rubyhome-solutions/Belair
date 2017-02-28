<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CheapTicket.in</title>
        <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/css/bootstrap.min.css" rel="stylesheet">
        <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/css/font-awesome/css/font-awesome.css" rel="stylesheet">
        <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/css/animate.css" rel="stylesheet">
        <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/css/style.css" rel="stylesheet">
        <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/css/plugins/iCheck/custom.css" rel="stylesheet">
		<link href="<?php echo \Yii::app()->theme->baseUrl; ?>/css/plugins/datapicker/datepicker3.css" rel="stylesheet">
        

    </head>
    <?php
    if (!isset($data['searches']))
        $data['searches'] = 0;
    if (!isset($data['searchesdom']))
        $data['searchesdom'] = 0;
    if (!isset($data['redirectdom']))
        $data['redirectdom'] = 0;
    if (!isset($data['redirect']))
        $data['redirect'] = 0;
    if (!isset($data['bookingsdom']))
        $data['bookingsdom'] = 0;
    if (!isset($data['bookings']))
        $data['bookings'] = 0;
    if (!isset($data['bookingsmobile']))
        $data['bookingsdom'] = 0;

    if (!isset($prevdata['searches']))
        $prevdata['searches'] = 0;
    if (!isset($prevdata['searchesdom']))
        $prevdata['searchesdom'] = 0;
    if (!isset($prevdata['redirectdom']))
        $prevdata['redirectdom'] = 0;
    if (!isset($prevdata['redirect']))
        $prevdata['redirect'] = 0;
    if (!isset($prevdata['bookingsdom']))
        $prevdata['bookingsdom'] = 0;
    if (!isset($prevdata['bookings']))
        $prevdata['bookings'] = 0;
    if (!isset($prevdata['bookingsmobile']))
        $prevdata['bookingsmob'] = 0;

    function getPercentage($data, $total) {
        if ($total <= 0) {
            return 0;
        } else {
            return number_format(abs(100 * ((double) $total - (double) $data) / (double) $total), 2);
        }
    }
    ?>
    <body>
        <div id="wrapper">
            <div id="page-wrapper" class="gray-bg margin-n">
                <div class="row">
                    <nav class="navbar navbar-static-top header-top-new" role="navigation" style="margin-bottom: 0">
                        <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2" href="#"><img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/logo.png" alt=""/></a></div>


                        <ul class="nav navbar-top-links navbar-right">
                            <li><a href="login.html"><i class="fa fa-file-pdf-o"></i> Pdf</a></li>
                            <li><a href="login.html"><i class="fa fa-envelope"></i> E-mail</a></li>
                        </ul>

                    </nav>



                </div>
                <div class="wrapper wrapper-content animated fadeInRight padd-1">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="ibox-content strip">
                                <div class="row">
                                    <div class="col-lg-9">

                                        <ol class="breadcrumb breadcrumb1">
                                            <li>Source Report</li>
                                            <li>
                                                
                                                <form name="report_client" method="post" action="/b2c/reports/clientSourceReport" style="background-color: lightcyan; width: 70%" id="reportsClient">
                                                <div class="form-group date-u" id="data_5">
                                                    <div class="input-daterange input-group" id="datepicker">
                                                        <input type="text" class="input-sm form-control date-he" name="dateFrom" value=""/>
                                                        <span class="input-group-addon">to</span>
                                                        <input type="text" class="input-sm form-control date-he" name="dateTo" value="" />
                                                    </div>
                                                </div>
                                                     <div class="form-group date-u" id="data_5">
                                                    <table class="table table-bordered table-condensed">
                <colgroup><col width="150"><col></colgroup>
                <tbody><tr>
                        <th>Client Source</th>
                        <td>
                            <?php echo \TbHtml::dropDownList('clientSource', '', $clientSources, ['prompt' => '-- Select the client source --', 'style' => 'width:70%']) ?>
                        </td>
                    </tr>
                </tbody></table></div>
                                                <button type="submit" onclick="" class="btn2 btn-default date-u"><i class="fa fa-table"></i> Generate</button>
                                                </form>
                                                </li>


                                        </ol>

                                    </div>
                                    <div class="col-lg-1 navbar-right check-box always">
                                        <label> <input type="checkbox" class="check"> </label>
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
                                    <h2>Source Report</h2>
                                    <div class="row prisse-stu">
                                        <div class="col-lg-12 Source-f-2">
                                            <div class="col-lg-4">
                                                <div class="col-lg-8">
                                                    <div class="ibox-title box_co1">
                                                        <h5>Searches</h5>
                                                    </div>
                                                    <div class="col-lg-12 Source">
                                                        <div class="col-lg-12">
                                                            <span class="font-l"><?php echo $data['searches']; ?> <div class="circle2 <?php if ($data['searches'] >= $prevdata['searches']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data['searches'] >= $prevdata['searches']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div></span> 
                                                            <span class="<?php if ($data['searches'] >= $prevdata['searches']) { ?>green<?php } else { ?>red<?php } ?> font-l hide1"><?php echo $prevdata['searches']; ?><sub class="<?php if ($data['searches'] >= $prevdata['searches']) { ?>green<?php } else { ?>red<?php } ?>"><?php echo '  (' . getPercentage($prevdata['searches'], $data['searches']) . ') '; ?>% </sub></span>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-12 Source-f">
                                                        <div class="col-lg-6">
                                                            <img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/plan2.png"/>
                                                            <p>Domestic</p>
                                                            <h2><?php echo $data['searchesdom']; ?><sub class="hide1" ><?php echo $prevdata['searchesdom']; ?> <i class="fa <?php if ($data['searchesdom'] >= $prevdata['searchesdom']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?> size2"></i></sub></h2>
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <i class="fa fa-globe"></i>
                                            <?php
                                            $data['searchesint'] = $data['searches'] - $data['searchesdom'];
                                            $prevdata['searchesint'] = $prevdata['searches'] - $prevdata['searchesdom'];
                                            ?>
                                                            <p> International</p>
                                                            <h2><?php echo $data['searchesint']; ?> <sub class="hide1" ><?php echo $prevdata['searchesint']; ?> <i class="fa <?php if ($data['searchesint'] >= $prevdata['searchesint']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?>"></i></sub></h2>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="col-lg-4">
                                                <div class="col-lg-8">
                                                    <div class="ibox-title box_co3">
                                                        <h5>Redirects</h5>
                                                    </div>
                                                    <div class="col-lg-12 Source">
                                                        <div class="col-lg-12">
                                                            <span class="font-l"><?php echo $data['redirect']; ?><div class="circle2 <?php if ($data['redirect'] >= $prevdata['redirect']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data['redirect'] >= $prevdata['redirect']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div></span> 
                                                            <span class="<?php if ($data['redirect'] >= $prevdata['redirect']) { ?>green<?php } else { ?>red<?php } ?> font-l hide1"><?php echo $prevdata['redirect']; ?><sub class="<?php if ($data['redirect'] >= $prevdata['redirect']) { ?>green<?php } else { ?>red<?php } ?>"><?php echo '  (' . getPercentage($prevdata['redirect'], $data['redirect']) . ') '; ?>% </sub></span>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-12 Source-f">
                                                        <div class="col-lg-6">
                                                            <img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/plan2.png"/>
                                                            <p>Domestic</p>
                                                            <h2><?php echo $data['redirectdom']; ?><sub class="hide1" ><?php echo $prevdata['redirectdom']; ?> <i class="fa <?php if ($data['redirectdom'] >= $prevdata['redirectdom']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?> "></i></sub></h2>
                                                        </div>
                                                        <?php
                                            $data['redirectint'] = $data['redirect'] - $data['redirectdom'];
                                            $prevdata['redirectint'] = $prevdata['redirect'] - $prevdata['redirectdom'];
                                            ?>
                                                        <div class="col-lg-6">
                                                            <i class="fa fa-globe"></i>
                                                            <p> International</p>
                                                             <h2><?php echo $data['redirectint']; ?><sub class="hide1" ><?php echo $prevdata['redirectint']; ?> <i class="fa <?php if ($data['redirectint'] >= $prevdata['redirectint']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?>"></i></sub></h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 chart-p">

                                                    <div class="m-r-md inline">
                                                        <input type="text" value="<?php echo getPercentage($data['redirectmobile'],$data['redirect']); ?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                                                        <p><?php echo 100-getPercentage($data['redirectmobile'],$data['redirect']).'%  ('.$data['redirectmobile'].') '; ?> Mobile</p>
                                                        <p><?php echo getPercentage($data['redirectmobile'],$data['redirect']).'%  ('.($data['redirect']-$data['redirectmobile']).') '; ?> Website</p>
                                                    </div>

                                                </div>
                                            </div>


                                            <div class="col-lg-4">
                                                <div class="col-lg-8">
                                                    <div class="ibox-title box_co6">
                                                        <h5>Books</h5>
                                                    </div>
                                                    <div class="col-lg-12 Source">
                                                        <div class="col-lg-12">
                                                            <span class="font-l"><?php echo $data['bookings']; ?><div class="circle2 <?php if ($data['bookings'] >= $prevdata['bookings']) { ?>circle2-bg<?php } ?> hide1"><i class="fa <?php if ($data['bookings'] >= $prevdata['bookings']) { ?>fa-long-arrow-up<?php } else { ?>fa-long-arrow-down<?php } ?>"></i></div></span> 
                                                            <span class="<?php if ($data['bookings'] >= $prevdata['bookings']) { ?>green<?php } else { ?>red<?php } ?> font-l hide1"><?php echo $prevdata['bookings']; ?><sub class="<?php if ($data['bookings'] >= $prevdata['bookings']) { ?>green<?php } else { ?>red<?php } ?>"><?php echo '  (' . getPercentage($prevdata['bookings'], $data['bookings']) . ') '; ?>% </sub></span>
                                                        </div>
                                                    </div>

                                                    <div class="col-lg-12 Source-f">
                                                        <div class="col-lg-6">
                                                            <img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/plan2.png"/>
                                                            <p>Domestic</p>
                                                            <h2><?php echo $data['bookingsdom']; ?><sub class="hide1" ><?php echo $prevdata['bookingsdom']; ?> <i class="fa <?php if ($data['bookingsdom'] >= $prevdata['bookingsdom']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?> "></i></sub></h2>
                                                        </div>
                                                        <?php
                                            $data['bookingsint'] = $data['bookings'] - $data['bookingsdom'];
                                            $prevdata['bookingsint'] = $prevdata['bookings'] - $prevdata['bookingsdom'];
                                            ?>
                                                        <div class="col-lg-6">
                                                            <i class="fa fa-globe"></i>
                                                            <p> International</p>
                                                             <h2><?php echo $data['bookingsint']; ?><sub class="hide1" ><?php echo $prevdata['bookingsint']; ?> <i class="fa <?php if ($data['bookingsint'] >= $prevdata['bookingsint']) { ?>fa-long-arrow-up size2<?php } else { ?>fa-long-arrow-down size1<?php } ?>"></i></sub></h2>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-lg-4 chart-p">

                                                    <div class="m-r-md inline">
                                                        <input type="text" value="<?php echo getPercentage($data['bookingsmobile'],$data['bookings']); ?>" class="dial m-r-sm" data-fgColor="#1AB394" data-width="80" data-height="80" />
                                                        <p><?php echo 100-getPercentage($data['bookingsmobile'],$data['bookings']).'%  ('.$data['bookingsmobile'].') '; ?> Mobile</p>
                                                        <p><?php echo getPercentage($data['bookingsmobile'],$data['bookings']).'%  ('.($data['bookings']-$data['bookingsmobile']).') '; ?> Website</p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>




                                        <div class="col-lg-12 padd-3">

                                            <div class="col-lg-12 box_co6 hadding2">
                                                <div class="col-lg-2">Ratio</div>
                                                <div class="col-lg-2"></div>
                                                <div class="col-lg-2">Current Period <br>(<?php echo date("d-M-y", strtotime($datefrom)).' - '.date("d-M-y", strtotime($dateto))?>)</div>
                                                <div class="col-lg-2 hide1">Previous Period <br>(<?php echo date("d-M-y", strtotime($prevdatefrom)).' - '.date("d-M-y", strtotime($prevdateto))?>)</div>
                                                <div class="col-lg-2 hide1">Change</div>
                                            </div>


                                            <div class="col-lg-12 inner padd-2">
                                                <div class="col-lg-12">
                                                    <div class="col-lg-2"><h2>Search to Redirect</h2> </div>
                                                    <div class="col-lg-2"><i class="fa fa-long-arrow-right"></i></div>
                                                    <div class="col-lg-2"><div class=" p-c"><?php echo $srr=getPercentage($data['redirect'],$data['searches']);?>%</div> </div>
                                                    <div class="col-lg-2 hide1"><div class="p-c"><?php echo $srrprev=getPercentage($prevdata['redirect'],$prevdata['searches']);?>%</div></div>
                                                    <div class="col-lg-2 hide1"><div class="<?php if(($srr-$srrprev)>0){echo 'circle1';}else{ echo 'circle'; }?> p-c"><?php if($srrprev!=0){ echo number_format((($srr-$srrprev)*100/$srrprev),2);} else{echo 0;}?>%</div></div>
                                                </div>
                                            </div>

                                             <div class="col-lg-12 inner padd-2">
                                                <div class="col-lg-12">
                                                    <div class="col-lg-2"><h2>Redirect to Booking</h2> </div>
                                                    <div class="col-lg-2"><i class="fa fa-long-arrow-right"></i></div>
                                                    <div class="col-lg-2"><div class=" p-c"><?php echo $srr=getPercentage($data['bookings'],$data['redirect']);?>%</div> </div>
                                                    <div class="col-lg-2 hide1"><div class="p-c"><?php echo $srrprev=getPercentage($prevdata['bookings'],$prevdata['redirect']);?>%</div></div>
                                                    <div class="col-lg-2 hide1"><div class="<?php if(($srr-$srrprev)>0){echo 'circle1';}else{ echo 'circle'; }?> p-c"><?php if($srrprev!=0){ echo number_format((($srr-$srrprev)*100/$srrprev),2);} else{echo 0;}?>%</div></div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    <h2>Top 5 Sectors</h2>
                                    <div class="row prisse-stu">

                                        <div class="col-lg-12 Source-f-2">
                                            <div class="col-lg-4">
                                                <div class="col-lg-12">
                                                    <div class="ibox-title box_co4">
                                                        <h5>Searches</h5>
                                                    </div>
                                                    <div class="col-lg-12 top-sec">
                                                    <?php foreach($data['searchessector'] as $value){?>
                                                    
                                                        <div class="col-lg-12">
                                                            <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['source']);?></div>
                                                            <div class="col-lg-4"><i class="fa fa-long-arrow-right"></i></div>
                                                            <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['destination']);?></div>
                                                        </div>

                                                    <?php } ?>

                                                    </div>


                                                </div>
                                            </div>

                                            <div class="col-lg-4">
                                                <div class="col-lg-12">
                                                    <div class="ibox-title box_co5">
                                                        <h5>Redirects</h5>
                                                    </div>
                                                    <div class="col-lg-12 top-sec">
                                                       <?php foreach($data['redirectsector'] as $value){?>
                                                    
                                                        <div class="col-lg-12">
                                                            <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['source']);?></div>
                                                            <div class="col-lg-4"><i class="fa fa-long-arrow-right"></i></div>
                                                            <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['destination']);?></div>
                                                        </div>

                                                    <?php } ?>

                                                        

                                                    </div>


                                                </div>
                                            </div>


                                            <div class="col-lg-4">
                                                <div class="col-lg-12">
                                                    <div class="ibox-title box_co3">
                                                        <h5>Books</h5>
                                                    </div>
                                                    <div class="col-lg-12 top-sec">
                                                        <?php foreach($data['bookingssector'] as $value){?>
                                                    
                                                        <div class="col-lg-12">
                                                            <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['source']);?></div>
                                                            <div class="col-lg-4"><i class="fa fa-long-arrow-right"></i></div>
                                                            <div class="col-lg-4"><?php echo \Airport::getAirportCodeAndCityNameFromCode($value['destination']);?></div>
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
                                                    <?php foreach($data['redirectairline'] as $value){?>
                                                        <div class="col-lg-12"><img src="/img/air_logos/<?php echo $value['code'];?>.png"> <span><?php echo $value['name'];?></span></div>
                                                        
                                                    <?php }?>
                                                    </div>


                                                </div>
                                            </div>


                                            <div class="col-lg-6">
                                                <div class="col-lg-12">
                                                    <div class="ibox-title box_co6">
                                                        <h5>Books</h5>
                                                    </div>
                                                    <div class="col-lg-12 airline">


                                                        <?php foreach($data['bookingsairline'] as $value){?>
                                                        <div class="col-lg-12"><img src="/img/air_logos/<?php echo $value['code'];?>.png"> <span><?php echo $value['name'];?></span></div>
                                                        
                                                    <?php }?>

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


        <!-- Mainly scripts -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/jquery-2.1.1.js"></script>
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/bootstrap.min.js"></script>


        <!-- chart -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/jsKnob/jquery.knob.js"></script>
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/datapicker/bootstrap-datepicker.js"></script>

        <!-- checkbox -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/iCheck/icheck.min.js"></script>

        <script>
            $(document).ready(function () {
                $('#data_1 .input-group.date').datepicker({
                    todayBtn: "linked",
                    keyboardNavigation: false,
                    forceParse: false,
                    calendarWeeks: true,
                    autoclose: true
                });


                $('#data_5 .input-daterange').datepicker({
                    keyboardNavigation: false,
                    forceParse: false,
                    autoclose: true
                });

                $('.i-checks').iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green',
                });

            });



            $(".dial").knob();
        </script>

        <script>
            $(document).ready(function () {
                $(".check").click(function () {
                    $(".hide1").toggle();
                });
            });
        </script>  


    </body>

</html>
