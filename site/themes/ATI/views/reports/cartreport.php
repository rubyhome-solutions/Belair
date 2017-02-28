<!DOCTYPE html>
<?php
if (YII_DEBUG) {
    $host = 'http://' . \Yii::app()->request->serverName . \Yii::app()->theme->baseUrl;
    $baseurl = 'http://' . \Yii::app()->request->serverName;
} else {
    $host = 'https://' . \Yii::app()->request->serverName . \Yii::app()->theme->baseUrl;
    $baseurl = 'http://' . \Yii::app()->request->serverName;
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
    <?php $this->renderPartial('//reports/_loginForm', array('authMessage' => $authMessage)); ?>
    <body>
        <?php if (\Authorization::getIsSuperAdminorClientSourceLogged()) { ?>
            <div id="wrapper">
                <div id="page-wrapper" class="gray-bg margin-n">
                    <div class="row">
                        <nav class="navbar navbar-static-top header-top-new" role="navigation" style="margin-bottom: 0">
                            <div class="navbar-header"><a class="navbar-minimalize minimalize-styl-2" href="#"><img src="<?php echo \Yii::app()->theme->baseUrl; ?>/img/logo.png" alt=""/></a></div>
                            <ul class="nav navbar-top-links navbar-left">

                                <?php if (\Authorization::getIsSuperAdminLogged()) { ?>
                                    <li><a href="../../b2c/reports/clientSourceReport">Client Source Report</a></li>
                                    <li><a href="../../b2c/reports/clientDetailReport">Source Detail</a></li>
                                    <li><a href="../../b2c/reports/salesReport">Sales Report</a></li>
                                    <li><a class="active" href="#">AirCart Detail Report</a></li>
                                    <li><a href="../../b2c/reports/airLineOverviewReport">Airline Overview Report</a></li>
                                    <li><a href="../../b2c/reports/airLineReport">Airline Report</a></li>
                                <?php } else { ?>
                                    <li><a href="../../b2c/reports/clientSourceReport">Client Source Report</a></li>
                                    <li><a href="../../b2c/reports/clientDetailReport">Source Detail</a></li>
                                    <li><a class="active" href="#">AirCart Detail Report</a></li>
                                <?php } ?>
                            </ul>

                            <ul class="nav navbar-top-links navbar-right" style="display:none">
                                <li><a href="#"><i class="fa fa-file-pdf-o"></i> Pdf</a></li>
                                <li><a href="#"><i class="fa fa-envelope"></i> E-mail</a></li>
                            </ul>

                        </nav>



                    </div>


                    <div class="wrapper wrapper-content animated fadeInRight ">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="ibox float-e-margins">
                                    <div class="ibox-content">
                                        <h2>Detail Report</h2>

                                        <div class="row">

                                            <div class="col-lg-11">

                                                <ol class="breadcrumb breadcrumb1">
                                                    <button type="button" style='display: none' class="btn btn-success f-l"></button>

                                                    <li>

                                                        <form name="report_client" method="post" action="/b2c/reports/airCartDetailReport" style="background-color: lightcyan; width: 100%" id="reportsClient">
                                                            <div class="form-group date-u" id="data_5">
                                                                <div class="input-daterange input-group" id="datepicker">
                                                                    <input type="text" class="input-sm form-control date-he" name="dateFrom" value="<?php echo date('m/d/Y', strtotime($datefrom)); ?>"/>
                                                                    <span class="input-group-addon">to</span>
                                                                    <input type="text" class="input-sm form-control date-he" name="dateTo" value="<?php echo date('m/d/Y', strtotime($dateto)); ?>" />
                                                                </div>
                                                            </div>
                                                            <div class="form-group date-u" id="data_5" >

                                                                <select name="services"  id="clientSource" class="form-control int-drp f-l"  style="width:80%">
                                                                    <option>Flights</option>
                                                                    <option name="Domestic"  id="Domestic" value="Domestic">Domestic</option>
                                                                    <option name="International" id="International" value="International">International</option>
                                                                </select> 



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
                                                            <td><?php echo $datefrom; ?></td>
                                                            <th>Date To</th>
                                                            <td><?php echo $dateto; ?></td>
                                                            <?php if (!empty($cs)) { ?>
                                                                <th>Domestic/International</th>
                                                                <td><?php echo $cs; ?></td>
                                                            <?php } ?>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>



                                            <div class="col-lg-12">
                                                <div class="col-lg-12 box_co2 hadding2">
                                                    <div class="col-lg-2">

                                                        <div class="col-lg-6">Date</div>
                                                        <div class="col-lg-6">Transaction id</div>
                                                    </div>
                                                    <div class="col-lg-2">Pax Name</div>
                                                    <div class="col-lg-2">PNR</div>
                                                    <div class="col-lg-2">Airline</div>
                                                    <div class="col-lg-2">Sector</div>
                                                    <div class="col-lg-2">Int/Dom</div>
                                                </div>
                                                <?php
                                                foreach ($data as $aircart) {
                                                    if (!empty($cs)) {
                                                        if ($cs == 'Domestic' && $aircart->isInternational()) {
                                                            continue;
                                                        }
                                                        if ($cs == 'International' && !$aircart->isInternational()) {
                                                            continue;
                                                        }
                                                    }
                                                    ?>

                                                    <div class="col-lg-12 inner-2 strip2">

                                                        <div class="col-lg-12">
                                                            <div class="col-lg-2">


                                                                <div class="col-lg-6"><div class="col-lg-6 res">Date</div><?php echo date('d-m-Y', strtotime($aircart->created)); ?></div>
                                                                <div class="col-lg-6"><div class="col-lg-6 res"></div><?php echo $aircart->id; ?></div>
                                                            </div>
                                                            <div class="col-lg-2"><div class="col-lg-2 res">Pax Name</div><?php echo $aircart->getPaxNames(); ?></div>
                                                            <div class="col-lg-2"><div class="col-lg-2 res">PNR</div><?php echo $aircart->airBookings[0]->airline_pnr; ?></div>


                                                            <?php
                                                            $str = '';
                                                            $aircode = [];
                                                            foreach ($aircart->airBookings as $ab) {
                                                                if (!isset($aircode[$ab->carrier_id])) {
                                                                    $aircode[$ab->carrier_id] = $ab->carrier_id;
                                                                    $str.='<img src="/img/air_logos/' . $ab->carrier->code . '.png">' . $ab->carrier->name . '<br>';
                                                                }
                                                            }
                                                            ?>




                                                            <div class="col-lg-2"><div class="col-lg-2 res">Airline</div><?php echo $str; ?></div>




                                                            <div class="col-lg-2"> <div class="col-lg-2 res">Sector</div><?php echo $aircart->getSector(); ?></div>
                                                            <div class="col-lg-2"><div class="col-lg-2 res">Int/Dom</div><?php
                                                    if ($aircart->isInternational()) {
                                                        echo 'International';
                                                    } else {
                                                        echo 'Domestic';
                                                    }
                                                            ?></div>

                                                        </div>
                                                    </div>


    <?php } ?>


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
<?php } ?>

        <!-- Mainly scripts -->
        <!-- Mainly scripts -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/jquery-2.1.1.js"></script>
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/bootstrap.min.js"></script>


        <!-- chart -->
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/jsKnob/jquery.knob.js"></script>
        <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/plugins/datapicker/bootstrap-datepicker.js"></script>

        <script>
            $(document).ready(function () {
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


<?php if (!isset(\Yii::app()->user->id)) { ?>
            <script>
                //$('#loginModal').modal('show');
                $('#loginModal').modal({backdrop: 'static', show: true});
            </script>
        <?php } ?>

    </body>

</html>
