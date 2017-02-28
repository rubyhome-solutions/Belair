
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/new/css/bootstrap.min.css" rel="stylesheet">
            <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/new/font-awesome/css/font-awesome.css" rel="stylesheet">

                <!-- Toastr style -->
                <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/new/css/plugins/toastr/toastr.min.css" rel="stylesheet">
                    <!-- Gritter -->
                    <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/gritter/jquery.gritter.css" rel="stylesheet">
                        <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/new/css/animate.css" rel="stylesheet">
                            <link href="<?php echo \Yii::app()->theme->baseUrl; ?>/new/css/style.css" rel="stylesheet">
                            <script src="/themes/admin/new/js/jquery-2.1.1.js"></script>
                                <title><?php echo CHtml::encode($this->pageTitle); ?></title>
                                <!--Rollbar js Setup-->
                                <?php
                                require_once 'rollbar.php';
                                
                                $config = array(
                                    // required
                                    'access_token' => '8713a6ebd9f44726b75fd1d2e04f3926',
                                    // optional - environment name. any string will do.
                                    'environment' => 'production',
                                    // optional - path to directory your code is in. used for linking stack traces.
                                    
                                );
                                Rollbar::init($config);
                                ?>
    

                                </head>

                                <body>
                                <?php 
                                    // Active user
                    $activeCompanyId = \Utils::getActiveCompanyId();
                    $activeUserId = \Utils::getActiveUserId();
                    // Is the logged user a staff member
                    $isStaffLogged = \Authorization::getIsStaffLogged();
                    $isFrontlineStaff = \Authorization::getIsFrontlineStaffLogged();
                    $isTopStaffLogged = \Authorization::getIsTopStaffLogged();
                    $isTopStaffOrAccountantLogged = \Authorization::getIsTopStaffOrAccountantLogged();
                    $isSuperAdmin = \Yii::app()->user->getState('user_type') === UserType::superAdmin;
                    $canManageTraveller = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_TRAVELLERS);
                    $canManageStaff = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_STAFF);
                    $canManageCompany = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_COMPANY_INFO);
                    $canManageCommercials = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_COMMERCIALS);
                    $canManageAirSources = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_SOURCES_BOOKING_WORK_FLOW);
                    $canViewAccounts= \Authorization::getDoLoggedUserHasPermission(\Permission::VIEW_ACCOUNTS);
                    $canViewAccountingXMLs= \Authorization::getDoLoggedUserHasPermission(\Permission::VIEW_ACCOUNTING_XML);
                                ?>
                                    <div id="wrapper">
                                        <nav class="navbar-default navbar-static-side" role="navigation">
                                            <div class="sidebar-collapse">
                                                <ul class="nav" id="side-menu">
                                                    <div class="logo"><img alt="image" class="img-circle" src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/img/logo.jpg"></div>
                                                    <li class="nav-header">
                                                        <div class="dropdown profile-element"> <span>
                                                                <!--<img alt="image" class="img-circle" src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/img/profile_small.jpg" />-->
                                                            </span>
                                                            
                                                                <span class="clear"> <span class="block m-t-xs"> <strong class="font-bold">
                                                                    <?php
                                                                    $emulationData = \Yii::app()->user->getState('emulation');
                                                                    if ($emulationData) {
                                                                        $userElement = array(
                                                                            'label' => '<i class="icon-off" style="vertical-align: sub;"></i>&nbsp;(' . \Yii::app()->user->name . ')<br><i class="icon-user" style="vertical-align: sub;"></i>&nbsp;(' . $emulationData['name'] . ')',
                                                                            'url' => array('/users/stopEmulation')
                                                                        );
                                                                    } else {
                                                                        $userElement = array(
                                                                            'label' => '<i class="icon-off" style="vertical-align: sub;"></i>&nbsp;(' . \Yii::app()->user->name . ')',
                                                                            'url' => array('/site/logout'),
                                                                            'visible' => !Yii::app()->user->isGuest
                                                                        );
                                                                    }    
                                                                    
                                                                    
                
                                                                        $this->widget('bootstrap.widgets.TbNavbar', array(
                                                                        'brandLabel' => '',
                                                    //                        'htmlOptions' => array('style'=>'ul, ol {padding: 10px;}'),
                                                                        'display' => null, // default is static to top
                                                                        'collapse' => true,
                                                                        'items' => array(
                                                                            ['class' => 'bootstrap.widgets.TbNav',
                                                                                'htmlOptions' => ['class' => 'pull-right text-right'],
                                                                                'encodeLabel' => false,
                                                                                'items' => [
                                                                                    $userElement,
                                                                                    ['label' => \Yii::app()->session->get(\UserInfo::ACTIVE_COMPANY_PHONE, \UserInfo::BELAIR_PHONE_HTML)]
                                                                                ],
                                                                            ],
                                                                        ),
                                                                    ));
                                                                    ?>
                                                                        </strong>
                                                                    </span> </span> 
                                                            
                                                        </div>
                                                        <div class="logo-element">
                                                            IN+
                                                        </div>
                                                    </li>
                                                    
                                                    
                                                        <?php if(!$canViewAccountingXMLs) { ?>
                                                                <li ><a href="#"><i class="fa fa-caret-right"></i>  Carts <span class="fa arrow"></span></a>
                                                                    <ul class="nav nav-third-level">
                                                                        <?php if(!Yii::app()->user->isGuest){ ?>
                                                                            <li><a href="/airCart/admin"><i class="fa fa-caret-right"></i>  Manage Carts</a></li>
                                                                        <?php } if($isStaffLogged) { ?>
                                                                            <li ><a href="/airCart/create"><i class="fa fa-caret-right"></i>  Manage Cart Creation</a></li>
                                                                        <?php } if($isStaffLogged) {?>
                                                                            <li ><a href="/airCart/byPnr"><i class="fa fa-caret-right"></i>  Manual Cart By PNR</a></li>
                                                                        <?php  }?>
                                                                    </ul>
                                                                </li>
                                                            <?php } ?>
                                                        <?php if(!Yii::app()->user->isGuest) {?>
                                                        <li>
                                                            <a href="/booking"><i class="fa fa-plane"></i> <span class="nav-label">Flights</span></a>
                                                        </li>
                                                    <?php } if(!Yii::app()->user->isGuest){ ?>
                                                    
                                                    <li>
                                                        <a href="#"><i class="fa fa-briefcase"></i> <span class="nav-label">My Account</span> <span class="fa arrow"></span></a>
                                                        <ul class="nav nav-second-level">
                                                            <?php if($canManageStaff) { ?>
                                                                <li class="active"><a href="/users/manage"><i class="fa fa-caret-right"></i> Manage User</a></li>
                                                            <?php } if($canManageTraveller && !$isFrontlineStaff) { ?>
                                                                <li ><a href="/traveler/admin"><i class="fa fa-caret-right"></i>  Manage Traveller</a></li>
                                                            <?php } ?>
                                                            <li ><a href="/users/changePass"><i class="fa fa-caret-right"></i>  Password Change</a></li>
                                                            <?php if(!Yii::app()->user->isGuest){ ?>
                                                                <?php if($canManageCompany){ ?>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i>  Site CMS <span class="fa arrow"></span></a>
                                                                <ul class="nav nav-third-level">
                                                             <li ><a href="<?php echo $activeCompanyId ? "/userInfo/update/$activeUserId" : '/users/manage' ?>"><i class="fa fa-caret-right"></i>  Set Company Logo</a></li>
                                                            <li ><a href="<?php echo $activeCompanyId ? "/userInfo/update/$activeUserId" : '/users/manage' ?>"><i class="fa fa-caret-right"></i>  Set Phones</a></li>
                                                                    <li><a href="<?php echo '/cms/update/' . \Cms::CMS_CONTACTS ?>"><i class="fa fa-caret-right"></i>  <?php echo \Cms::$cmsComponents[\Cms::CMS_CONTACTS]['title'] ?></a></li>
                                                            <li ><a href="<?php echo '/cms/update/' . \Cms::CMS_TERMS ?>"><i class="fa fa-caret-right"></i>  <?php echo \Cms::$cmsComponents[\Cms::CMS_TERMS]['title'] ?></a></li>
                                                            <li ><a href="<?php echo '/cms/update/' . \Cms::CMS_FAQ ?>"><i class="fa fa-caret-right"></i>  <?php echo \Cms::$cmsComponents[\Cms::CMS_FAQ]['title'] ?></a></li>
                                                            <li ><a href="<?php echo '/cms/update/' . \Cms::CMS_POLICY ?>"><i class="fa fa-caret-right"></i> <?php echo \Cms::$cmsComponents[\Cms::CMS_POLICY]['title'] ?></a></li>
                                                            <li ><a href="<?php echo '/cms/update/' . \Cms::CMS_ABOUT ?>"><i class="fa fa-caret-right"></i>  <?php echo \Cms::$cmsComponents[\Cms::CMS_ABOUT]['title'] ?></a></li>
                                                            <li ><a href="<?php echo '/cms/update/' . \Cms::CMS_NEWS ?>"><i class="fa fa-caret-right"></i> <?php echo \Cms::$cmsComponents[\Cms::CMS_NEWS]['title'] ?></a></li>
                                                             <li ><a href="<?php echo '/cms/update/' . \Cms::CMS_PAGE_FOOTER ?>"><i class="fa fa-caret-right"></i> <?php echo \Cms::$cmsComponents[\Cms::CMS_PAGE_FOOTER]['title'] ?></a></li>
                                                              <li ><a href="<?php echo '/cms/update/' . \Cms::CMS_EMAIL_FOOTER?>"><i class="fa fa-caret-right"></i> <?php echo \Cms::$cmsComponents[\Cms::CMS_EMAIL_FOOTER]['title'] ?></a></li>
                                                           
                                                            <li ><a href=""><i class="fa fa-caret-right"></i>  Set Contacts</a></li>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i>  Set Terms and Conditions</a></li>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i>  Set Privacy Policy</a></li>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i>  Set About Us</a></li>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i>  Set News</a></li>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i>  Set Page Footer</a></li>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i>  Set Email footer</a></li>
                                                            
                                                        </ul>
                                                            </li>
                                                            <?php } ?>
                                                            <?php } ?>
                                                        </ul>
                                                    </li>
                                                    <?php } if(!Yii::app()->user->isGuest && !$canViewAccountingXMLs){ ?>
                                                    <li >
                                                        <a href="#"><i class="fa fa-money"></i> <span class="nav-label">Payments</span> <span class="fa arrow"></span></a>
                                                        <ul class="nav nav-second-level">
                                                            <?php if(!Yii::app()->user->isGuest){ ?>
                                                                <li class="active"><a href="/payment/admin"><i class="fa fa-caret-right"></i> Payments</a></li>
                                                            <?php } if($isStaffLogged){ ?>
                                                                <li ><a href="/payGate/admin"><i class="fa fa-caret-right"></i> Transactions</a></li>
                                                            <?php } if($isStaffLogged){ ?>
                                                                <li ><a href="/fraud/admin"><i class="fa fa-caret-right"></i> Frauds</a></li>
                                                            <?php } if(!Yii::app()->user->isGuest){ ?>
                                                                <li ><a href="/cc/admin"><i class="fa fa-caret-right"></i> Cards</a></li>
                                                            <?php } if($isTopStaffLogged){ ?>
                                                                <li ><a href="/binList/admin"><i class="fa fa-caret-right"></i> Bin list</a></li>
                                                            <?php } if ($isStaffLogged){ ?>
                                                                <li ><a href="/payGate/manualPaymentRequest"><i class="fa fa-caret-right"></i> Manual Payment Request</a></li>
                                                            <?php } if(!Yii::app()->user->isGuest) { ?>
                                                                <li ><a href="/depositSearch/admin"><i class="fa fa-caret-right"></i> Deposit Search</a></li>
                                                            <?php } if(!Yii::app()->user->isGuest) {?>
                                                                <li ><a href="/creditRequest/admin"><i class="fa fa-caret-right"></i> Credit Request</a></li>
                                                            <?php } ?>
                                                            
                                                        </ul>
                                                    </li>
                                                    <?php } ?>
                                                    <li>
                                                        <a href="#"><i class="fa fa-user"></i> <span class="nav-label">My Admin</span> <span class="fa arrow"></span></a>
                                                        <ul class="nav nav-second-level">
                                                            <?php if(!$canViewAccountingXMLs) { ?>
                                                            <li><a href="#"><i class="fa fa-caret-right"></i> Manage Air <span class="fa arrow"></span></a> 
                                                                <ul class="nav nav-third-level">
                                                            <?php if($canManageAirSources) { ?>
                                                                    <li><a href="/airSource/admin"><i class="fa fa-caret-right"></i> Air Source</a></li>
                                                             <?php } if(!Yii::app()->user->isGuest){ ?>
                                                                    <li ><a href="/tourCode/admin"><i class="fa fa-caret-right"></i> Tour Codes</a></li>
                                                             <?php } if(!Yii::app()->user->isGuest) { ?>
                                                                    <li ><a href="/pfCode/admin"><i class="fa fa-caret-right"></i> Private Fare</a></li>
                                                             <?php } if($canManageAirSources) {?>
                                                                    <li ><a href="/airSource/scrapperCheck"><i class="fa fa-caret-right"></i> Scrappers Checks</a></li>
                                                             <?php } ?>
                                                                </ul>
                                                            </li>
                                                            <?php } if($canManageCommercials) { ?>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i> Commercials</a>
                                                                <ul class="nav nav-third-level">
                                                                    <li><a href="/commercial/admin"><i class="fa fa-caret-right"></i> Reseller</a></li>
                                                                    <li ><a href="/commission/update"><i class="fa fa-caret-right"></i> Commission</a></li>
                                                                </ul>
                                                            </li>
                                                            <?php } if(!Yii::app()->user->isGuest && !$canViewAccountingXMLs){ ?>
                                                            <li ><a href="/report">Reports</a></li>
                                                            <?php } if($isTopStaffLogged || $canViewAccounts){ ?>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i> Admin <span class="fa arrow"></span></a>
                                                                <ul class="nav nav-third-level">
                                                                    <?php if($isTopStaffLogged) { ?>
                                                                        <li><a href="/ccPasstru/root"><i class="fa fa-caret-right"></i> Root Pass-through</a></li>
                                                                    <?php } if($isTopStaffLogged) { ?>
                                                                        <li><a href="/ccPasstru/client"><i class="fa fa-caret-right"></i> Client Pass-through</a></li>
                                                                    <?php } if($isTopStaffOrAccountantLogged) { ?>
                                                                        <li><a href="/xRate"><i class="fa fa-caret-right"></i> xChange Rates</a></li>
                                                                    <?php } if($isTopStaffOrAccountantLogged) { ?>
                                                                        <li ><a href="/xRate/airline"><i class="fa fa-caret-right"></i> Airlines</a></li>
                                                                    <?php } if($isTopStaffOrAccountantLogged) { ?>
                                                                        <li><a href="/xRate/airport"><i class="fa fa-caret-right"></i> Airport</a></li>
                                                                    <?php } if($isTopStaffLogged){ ?>
                                                                        <li ><a href="/searches/admin"><i class="fa fa-caret-right"></i> Searches</a></li>
                                                                    <?php } if($isTopStaffLogged) { ?>
                                                                        <li><a href="/process/admin"><i class="fa fa-caret-right"></i> Processes</a></li>
                                                                    <?php } if($isTopStaffLogged) { ?>
                                                                        <li ><a href="/routesCache/admin"><i class="fa fa-caret-right"></i> Air Cache</a></li>
                                                                    <?php } if($isTopStaffLogged) {?>
                                                                        <li><a href="/api3d/admin"><i class="fa fa-caret-right"></i> API 3d</a></li>
                                                                    <?php } if($isSuperAdmin) { ?>
                                                                        <li ><a href="/roles/index"><i class="fa fa-caret-right"></i> Manage Roles</a></li>
                                                                    <?php } if($isSuperAdmin){ ?>
                                                                        <li><a href="/report/pgStats"><i class="fa fa-caret-right"></i> Audit the Database</a></li>
                                                                    <?php } if($isTopStaffLogged)  { ?>
                                                                        <li ><a href="/log/admin"><i class="fa fa-caret-right"></i> Audit the Logs</a></li>
                                                                    <?php } if($isSuperAdmin) {?>
                                                                        <li><a href="/report/logFile"><i class="fa fa-caret-right"></i> Insspect Log Files</a></li>
                                                                    <?php } if($isTopStaffLogged) { ?>
                                                                        <li ><a href="/users/newReg"><i class="fa fa-caret-right"></i> Resister New Company</a></li>
                                                                    <?php } ?>
                                                                </ul>
                                                            </li>
                                                            <?php } if($isTopStaffLogged || $canViewAccountingXMLs) {?>
                                                            <li ><a href="#"><i class="fa fa-caret-right"></i> Acc XML <span class="fa arrow"></span></a>
                                                                <ul class="nav nav-third-level">
                                                                    <?php if($isTopStaffLogged || $canViewAccountingXMLs){ ?>
                                                                        <li><a href="/accountingWS/paymentXML"><i class="fa fa-caret-right"></i> Payment XML</a></li>
                                                                    <?php } if($isTopStaffLogged || $canViewAccountingXMLs){ ?>
                                                                        <li ><a href="/accountingWS/invoiceXML"><i class="fa fa-caret-right"></i> Invoice XML</a></li>
                                                                    <?php } if($isTopStaffLogged || $canViewAccountingXMLs){?>
                                                                        <li ><a href="/accountingWS/amendmentXML"><i class="fa fa-caret-right"></i> Amendment XML</a></li>
                                                                    <?php } ?>
                                                                </ul>
                                                            </li>
                                                            <?php } ?>
                                                        </ul>
                                                    </li>
                                                    </ul>
                                                   
                                            </div>
                                        </nav>
                                        
                             

                                        <div id="page-wrapper" class="gray-bg dashbard-1">
                                            <div class="row border-bottom">
                                                <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                                                    <div class="navbar-header">
                                                        <a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="#"><i class="fa fa-bars"></i> </a>
                                                        
                                                    </div>
                                                    <?php 
                                                        if (Yii::app()->user->hasState(\Utils::ACTIVE_COMPANY) && Authorization::getIsStaffLogged()) {
            $data = \Yii::app()->user->getState(\Utils::ACTIVE_COMPANY);
            $out = "<a href='/users/manage?selectedvalue={$data['id']}' class='btn btn-info' id='activeCompany' style='max-width: 20%; position:relative; padding: 0; float:right;font-style:italic;' title=''>
                <div class='showClient'><table cellpadding='2' class=''>
                    <tr><th colspan=\"2\">Active Selection:</th></tr>
                    <tr><td>Company&nbsp;&nbsp;</td><td>" . CHtml::encode($data['companyName']) . "</td></tr>
                    <tr><td>Mobile</td><td>{$data['companyMobile']}</td></tr>
                    <tr><td>User</td><td>" . CHtml::encode($data['name']) . "</td></tr>
                    <tr><td>Mobile</td><td>{$data['mobile']}</td></tr>
                </table></div>
                    <table>
                        <tr>
                            <td rowspan='2'><img src='/img/businessman_32.png' /></td>
                            <td>" . CHtml::encode(Utils::truncateStr($data['companyName'], 16)) . "</td>
                        </tr>
                        <tr><td>" . CHtml::encode(Utils::truncateStr($data['name'], 16)) . "</td></tr>
                    </table>
                </a>
                ";
                echo $out;
                }
                                                    ?>

                                                </nav>
                                            </div>
                                            <div class="row wrapper border-bottom blue-bg page-heading">
                                                <div class="col-lg-10">

                                                    
                                                    <div class="inline"><strong><a href="/site/index">Home</a></strong></div>
                                                       
                                                    <?php if (isset($this->breadcrumbs)): ?>
                <?php
                $this->widget('bootstrap.widgets.TbBreadcrumb', array(
                    'links' => $this->breadcrumbs,
                ));
                ?><!-- breadcrumbs -->
            <?php endif ?>
                                                </div>
                                                <div class="col-lg-2">

                                                </div>
                                            </div>
                                         
                                           <?php echo $content; ?>

                                        </div>
                                    </div>

                                    
                                    <script>
                    jQuery(document).ready(function(){
                        $('.showClient').hide();
                        $('a#activeCompany').mouseover(function(){
                            $('.showClient').show();
                        });
                         $('a#activeCompany').mouseout(function(){
                            $('.showClient').hide();
                        });
                    });
                </script>
                <style>
                    .tooltip-inner {max-width: 400px;}
                    .tooltip-inner td {text-align: left;}
                                                        </style>
                                    \<!-- Mainly scripts -->
                                    <!--<script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/jquery-2.1.1.js"></script>-->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/bootstrap.min.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/metisMenu/jquery.metisMenu.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/slimscroll/jquery.slimscroll.min.js"></script>

                                    <!-- Flot -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/flot/jquery.flot.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/flot/jquery.flot.tooltip.min.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/flot/jquery.flot.spline.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/flot/jquery.flot.resize.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/flot/jquery.flot.pie.js"></script>

                                    <!-- Peity -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/peity/jquery.peity.min.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/demo/peity-demo.js"></script>

                                    <!-- Custom and plugin javascript -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/inspinia.js"></script>
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/pace/pace.min.js"></script>

                                    <!-- jQuery UI -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/jquery-ui/jquery-ui.min.js"></script>

                                    <!-- GITTER -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/gritter/jquery.gritter.min.js"></script>

                                    <!-- Sparkline -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/sparkline/jquery.sparkline.min.js"></script>

                                    <!-- Sparkline demo data  -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/demo/sparkline-demo.js"></script>

                                    <!-- ChartJS-->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/chartJs/Chart.min.js"></script>

                                    <!-- Toastr -->
                                    <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/new/js/plugins/toastr/toastr.min.js"></script>

                                   <script src="<?php echo \Yii::app()->theme->baseUrl; ?>/js/jquery.yii.js"></script>
                                   


                                    
                                </body>
                                </html>
<?php require_once 'analysis.php'; ?>
