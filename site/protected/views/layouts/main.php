<?php \Yii::app()->bootstrap->register(); ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="en" />
        <link rel="stylesheet" type="text/css" href="<?php echo Yii::app()->request->baseUrl; ?>/css/form.css" />
        <link href="//netdna.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.css" rel="stylesheet" />
        <link href='//fonts.googleapis.com/css?family=Open+Sans:400,700' rel='stylesheet' type='text/css' />
        <link rel="stylesheet" type="text/css" href="/css/site.css" />
        <title><?php echo CHtml::encode($this->pageTitle); ?></title>
    </head>

    <body>
        <script>
            $(document).ajaxStart(function () {
                $('body').addClass('wait');
            }).ajaxComplete(function () {
                $('body').removeClass('wait');
            });
            $(function () {
                //setup ajax error handling
                $.ajaxSetup({
                    error: function (jqXHR, status, error) {
                        if (jqXHR.status == 403) {
                            alert("You do not have permissions or your session has expired.\nTry to login again.");
                            window.location.href = "/";
                        } else {
                            alert("An error occurred: " + status + "nError: " + error);
                        }
                    }
                });
            });
        </script>
        <style>
            .dropdown-backdrop{
               position: static;     
            }
            ul.nav {padding-top: 0.4%;}
            ul.nav.pull-right {padding-top: 0.1%;}
            .nav li + .nav-header {margin-top: 1px;}
            body {font-family: "Open Sans", Arial, sans-serif !important;}
            .tooltip.left {margin-left: -12px;}
        </style>

        <div class="container span12" id="page" style="min-height: 600px;">

            <div id="mainmenu">
                <a href="/site/index"><img src="<?php echo \Yii::app()->session->get(\UserInfo::ACTIVE_COMPANY_LOGO, '/img/belair_logo_50px.jpg'); ?>" style="height: 50px; width: 207px; float:left; border-radius: 4px; overflow: hidden;" /></a>
                <?php
                $emulationData = Yii::app()->user->getState('emulation');
                if ($emulationData) {
                    $userElement = array(
                        'label' => '<i class="icon-off" style="vertical-align: sub;"></i>&nbsp;(' . Yii::app()->user->name . ')<br><i class="icon-user" style="vertical-align: sub;"></i>&nbsp;(' . $emulationData['name'] . ')',
                        'url' => array('/users/stopEmulation')
                    );
                } else {
                    $userElement = array(
                        'label' => '<i class="icon-off" style="vertical-align: sub;"></i>&nbsp;(' . Yii::app()->user->name . ')',
                        'url' => array('/site/logout'),
                        'visible' => !Yii::app()->user->isGuest
                    );
                }

                // Active user
                $activeCompanyId = \Utils::getActiveCompanyId();
                $activeUserId = \Utils::getActiveUserId();
                // Is the logged user a staff member
                $isStaffLogged = \Authorization::getIsStaffLogged();
                $isFrontlineStaff = \Authorization::getIsFrontlineStaffLogged();
                $isTopStaffLogged = \Authorization::getIsTopStaffLogged();
                $isTopStaffOrAccountantLogged = \Authorization::getIsTopStaffOrAccountantLogged();
                $isSuperAdminOrTicketRuleLogged = \Authorization::getIsSuperAdminorTicketRuleLogged();
                $isSuperAdmin = Yii::app()->user->getState('user_type') === UserType::superAdmin;
                $canManageTraveller = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_TRAVELLERS);
                $canManageStaff = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_STAFF);
                $canManageCompany = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_COMPANY_INFO);
                $canManageCommercials = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_COMMERCIALS);
                $canManageAirSources = \Authorization::getDoLoggedUserHasPermission(\Permission::MANAGE_SOURCES_BOOKING_WORK_FLOW);
                $canViewAccounts = \Authorization::getDoLoggedUserHasPermission(\Permission::VIEW_ACCOUNTS);
                $canViewAccountingXMLs = \Authorization::getDoLoggedUserHasPermission(\Permission::VIEW_ACCOUNTING_XML);
//                Yii::log($isStaffLogged);

                $this->widget('bootstrap.widgets.TbNavbar', array(
                    'brandLabel' => '',
//                        'htmlOptions' => array('style'=>'ul, ol {padding: 10px;}'),
                    'display' => null, // default is static to top
                    'collapse' => true,
                    'items' => array(
                        array(
                            'class' => 'bootstrap.widgets.TbNav',
                            'items' => array(
                                ['label' => 'Flight', 'url' => ['/booking'], 'visible' => !Yii::app()->user->isGuest],
                                ['label' => 'Site', 'items' => [
                                        ['label' => 'Contact', 'url' => ['/cms/' . \Cms::CMS_CONTACTS]],
                                        ['label' => 'Terms & conditions', 'url' => ['/cms/' . \Cms::CMS_TERMS]],
                                        ['label' => 'FAQ', 'url' => ['/cms/' . \Cms::CMS_FAQ]],
                                        ['label' => 'Privacy Policy', 'url' => ['/cms/' . \Cms::CMS_POLICY]],
                                        ['label' => 'About us', 'url' => ['/cms/' . \Cms::CMS_ABOUT]],
                                        ['label' => 'News', 'url' => ['/cms/' . \Cms::CMS_NEWS]],
                                    ]
                                ],
                                array('label' => 'Payments', 'visible' => !Yii::app()->user->isGuest && !$canViewAccountingXMLs, 'items' => array(
                                        array('label' => 'Payments', 'url' => array('/payment/admin'), 'visible' => !Yii::app()->user->isGuest),
                                        array('label' => 'Transactions', 'url' => array('/payGate/admin'), 'visible' => $isStaffLogged),
                                        ['label' => 'Frauds', 'url' => ['/fraud/admin'], 'visible' => $isStaffLogged],
                                        array('label' => 'Cards', 'url' => array('/cc/admin'), 'visible' => !Yii::app()->user->isGuest),
                                        array('label' => 'Bin list', 'url' => array('/binList/admin'), 'visible' => $isTopStaffLogged),
                                        array('label' => 'Manual payment request', 'url' => array('/payGate/manualPaymentRequest'), 'visible' => $isStaffLogged),
                                        array('label' => 'Deposit search', 'url' => array('/depositSearch/admin'), 'visible' => !Yii::app()->user->isGuest),
                                        array('label' => 'Credit requests', 'url' => array('/creditRequest/admin'), 'visible' => !Yii::app()->user->isGuest),
                                    )),
                                array('label' => 'My Account', 'visible' => !Yii::app()->user->isGuest, 'items' => array(
                                        ['label' => 'Manage Users', 'url' => ['/users/manage'], 'visible' => $canManageStaff],
                                        array('label' => 'Manage Travelers', 'url' => ['/traveler/admin'], 'visible' => $canManageTraveller && !$isFrontlineStaff),
                                        array('label' => 'Carts', 'visible' => !$canViewAccountingXMLs, 'items' => array(
                                                array('label' => 'Manage carts', 'url' => array('/airCart/admin'), 'visible' => !Yii::app()->user->isGuest),
                                                array('label' => 'Manual cart creation', 'url' => array('/airCart/create'), 'visible' => $isStaffLogged),
                                                array('label' => 'Manual cart by PNR', 'url' => array('/airCart/byPnr'), 'visible' => $isStaffLogged),
                                                array('label' => 'Old System Cart', 'url' => array('/oldSiteData/admin'), 'visible' => $isStaffLogged),
                                            )),
                                        ['label' => 'Manage Air', 'visible' => !$canViewAccountingXMLs, 'items' => [
                                                ['label' => 'Air Sources', 'url' => ['/airSource/admin'], 'visible' => $canManageAirSources],
                                                ['label' => 'AirSource rules', 'url' => ['/airsourceRule/update'], 'visible' => $canManageAirSources],
                                                ['label' => 'Tour codes', 'url' => ['/tourCode/admin'], 'visible' => !Yii::app()->user->isGuest],
                                                ['label' => 'Private fares', 'url' => ['/pfCode/admin'], 'visible' => !Yii::app()->user->isGuest],
                                                ['label' => 'Scrappers Check', 'url' => ['/airSource/scrapperCheck'], 'visible' => $canManageAirSources],
//                                                array('label' => 'GoAir test', 'url' => array('/booking/goAir'), 'visible' => $isStaffLogged),
                                            ]],
                                        ['label' => 'Commercials', 'visible' => $canManageCommercials, 'items' => [
                                                ['label' => 'Resseller', 'url' => ['/commercial/admin']],
                                                ['label' => 'Commission', 'url' => ['/commission/update']],
                                                ['label' => 'Client Source Commission', 'url' => ['/commission/clientSourceCost'], 'visible' => $isSuperAdmin],
                                                ['label' => 'Payment Convenience Fee', 'url' => ['/commission/paymentConvenienceFee'], 'visible' => $isTopStaffOrAccountantLogged],
                                                ['label' => 'PG Commission', 'url' => ['/commission/pgCost'], 'visible' => $isSuperAdmin],
                                                ['label' => 'GDS/LCC Commission', 'url' => ['/commission/gdsCost'], 'visible' => $isSuperAdmin],
                                            ]],
                                        ['label' => 'Password change', 'url' => ['/users/changePass']],
                                        ['label' => 'Reports', 'url' => ['/report'], 'visible' => !Yii::app()->user->isGuest && !$canViewAccountingXMLs],
                                        ['label' => 'Account Reports', 'visible' => $isTopStaffLogged || $canViewAccounts, 'items' => [
                                                ['label' => 'Yatra Report', 'url' => ['/report/yatraReport'], 'visible' => $canViewAccounts],
                                                ['label' => 'Yatra New Report', 'url' => ['/report/yatraNewReport'], 'visible' => $canViewAccounts],
                                                ['label' => 'Amadeus Report', 'url' => ['/report/yatraAmadeusReport'], 'visible' => $canViewAccounts],
                                                ['label' => 'Upload Invoice No', 'url' => ['/payment/uploadInvoiceFile'], 'visible' => $canViewAccounts],
                                                ['label' => 'Receipt Voucher Report', 'url' => ['/report/receiptReport'], 'visible' => $canViewAccounts],
                                            ]
                                        ],
                                        ['label' => 'Ticket Rules', 'visible' => $isSuperAdminOrTicketRuleLogged, 'items' => [
                                                ['label' => 'Source List', 'url' => ['/ticketRulesSources/admin'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                ['label' => 'Airline List', 'url' => ['/ticketRulesAirline/admin'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                ['label' => 'Notes List', 'url' => ['/ticketRulesNotes/admin'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                ['label' => 'Credit Cards Rules', 'url' => ['/ticketRulesCards/admin'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                ['label' => 'Credit Cards List', 'url' => ['/ticketCardsInfo/admin'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                ['label' => 'All Rules', 'url' => ['/ticketRulesAirline/allrules'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                ['label' => 'Export Data', 'items' => [
                                                        ['label' => 'Export Sources', 'url' => ['/ticketRulesSources/exportRules'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                        ['label' => 'Export Notes', 'url' => ['/ticketRulesNotes/exportRules'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                        ['label' => 'Export Airline', 'url' => ['/ticketRulesAirline/exportRules'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                        ['label' => 'Export Cards', 'url' => ['/ticketRulesCards/exportRules'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                    ]],
                                                ['label' => 'Import Data', 'items' => [
                                                        ['label' => 'Import Sources', 'url' => ['/ticketRulesSources/importRule'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                        ['label' => 'Import Notes', 'url' => ['/ticketRulesNotes/importRule'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                        ['label' => 'Import Airline', 'url' => ['/ticketRulesAirline/importRule'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                        ['label' => 'Import Cards', 'url' => ['/ticketRulesCards/importRule'], 'visible' => $isSuperAdminOrTicketRuleLogged],
                                                    ]
                                                ],
                                            ]
                                        ],
                                        ['label' => 'Analytics Reports', 'visible' => $isTopStaffOrAccountantLogged, 'items' => [
                                                ['label' => 'Client Source Report', 'url' => ['/bookingLog/clientReport'], 'visible' => $isTopStaffLogged],
                                                ['label' => 'Device Report', 'url' => ['/bookingLog/deviceReport'], 'visible' => $isTopStaffLogged],
                                                ['label' => 'Email/Sms Report', 'url' => ['/emailSmsLog/admin'], 'visible' => $isTopStaffOrAccountantLogged],
                                                ['label' => 'Cart Status Log', 'url' => ['/cartStatusLog/admin'], 'visible' => $isTopStaffLogged],
                                                ['label' => 'Status Avg. Report', 'url' => ['/cartStatusLog/cartLogReport'], 'visible' => $isTopStaffLogged],
												['label' => 'Client Source Cost Report', 'url' => ['/commission/clientSourceCostReport'], 'visible' => $isTopStaffOrAccountantLogged],
                                                ['label' => 'Profitability Report', 'url' => ['/commission/getProfitReport'], 'visible' => $isTopStaffOrAccountantLogged],
                                                ['label' => 'Promo Sales Report', 'url' => ['/commission/getPromoReport'], 'visible' => $isTopStaffOrAccountantLogged],
                                                ['label' => 'B2C Source Report', 'url' => ['/b2c/reports/clientSourceReport'], 'visible' => $isSuperAdmin, 'linkOptions' => array('target' => '_blank')],
                                                ['label' => 'B2C Client Detail Report', 'url' => ['/b2c/reports/clientDetailReport'], 'visible' => $isSuperAdmin, 'linkOptions' => array('target' => '_blank')],
                                                ['label' => 'B2C Sales Report', 'url' => ['/b2c/reports/salesReport'], 'visible' => $isSuperAdmin, 'linkOptions' => array('target' => '_blank')],
                                                ['label' => 'B2C AirCart Report', 'url' => ['/b2c/reports/airCartDetailReport'], 'visible' => $isSuperAdmin, 'linkOptions' => array('target' => '_blank')],
                                                ['label' => 'B2C Airline Overview Report', 'url' => ['/b2c/reports/airLineOverviewReport'], 'visible' => $isSuperAdmin, 'linkOptions' => array('target' => '_blank')],
                                                ['label' => 'B2C Airline Report', 'url' => ['/b2c/reports/airLineReport'], 'visible' => $isSuperAdmin, 'linkOptions' => array('target' => '_blank')],
                                            ]
                                        ],
                                        ['label' => 'Account XMLs', 'visible' => $isTopStaffLogged || $canViewAccountingXMLs, 'items' => [
                                                ['label' => 'Payment XML', 'url' => ['/accountingWS/paymentXML'], 'visible' => $isTopStaffLogged || $canViewAccountingXMLs],
                                                ['label' => 'Invoice XML', 'url' => ['/accountingWS/invoiceXML'], 'visible' => $isTopStaffLogged || $canViewAccountingXMLs],
                                                ['label' => 'Amendment XML', 'url' => ['/accountingWS/amendmentXML'], 'visible' => $isTopStaffLogged || $canViewAccountingXMLs],
                                            ]
                                        ],
                                        ['label' => 'Site CMS', 'visible' => !Yii::app()->user->isGuest, 'visible' => $canManageCompany, 'items' => [
                                                ['label' => 'Set Company Logo', 'url' => $activeCompanyId ? ["userInfo/update/$activeUserId"] : ['/users/manage']],
                                                ['label' => 'Set Phones', 'url' => $activeCompanyId ? ["userInfo/update/$activeUserId"] : ['/users/manage']],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_CONTACTS]['title'], 'url' => ['cms/update/' . \Cms::CMS_CONTACTS]],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_TERMS]['title'], 'url' => ['cms/update/' . \Cms::CMS_TERMS]],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_FAQ]['title'], 'url' => ['cms/update/' . \Cms::CMS_FAQ]],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_POLICY]['title'], 'url' => ['cms/update/' . \Cms::CMS_POLICY]],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_ABOUT]['title'], 'url' => ['cms/update/' . \Cms::CMS_ABOUT]],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_NEWS]['title'], 'url' => ['cms/update/' . \Cms::CMS_NEWS]],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_PAGE_FOOTER]['title'], 'url' => ['cms/update/' . \Cms::CMS_PAGE_FOOTER]],
                                                ['label' => 'Set ' . \Cms::$cmsComponents[\Cms::CMS_EMAIL_FOOTER]['title'], 'url' => ['cms/update/' . \Cms::CMS_EMAIL_FOOTER]],
                                            ]
                                        ],
                                    )
                                ),
                                ['label' => 'Admin', 'visible' => $isTopStaffLogged || $canViewAccounts, 'items' => [
                                        ['label' => 'Root pass-through', 'url' => ['/ccPasstru/root'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'Client pass-through', 'url' => ['/ccPasstru/client'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'xChange Rates', 'url' => ['/xRate'], 'visible' => $isTopStaffOrAccountantLogged],
                                        ['label' => 'Airlines', 'url' => ['/xRate/airline'], 'visible' => $isTopStaffOrAccountantLogged],
                                        ['label' => 'Airports', 'url' => ['/xRate/airport'], 'visible' => $isTopStaffOrAccountantLogged],
                                        ['label' => 'City Pairs', 'url' => ['/cityPairs/admin'], 'visible' => $isTopStaffOrAccountantLogged],
                                        ['label' => 'Searches', 'url' => ['/searches/admin'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'Processes', 'url' => ['/process/admin'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'Air cache', 'url' => ['/routesCache/admin'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'API 3d', 'url' => ['/api3d/admin'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'Manage Roles', 'url' => ['/roles/index'], 'visible' => $isSuperAdmin],
                                        ['label' => 'Audit the database', 'url' => ['/report/pgStats'], 'visible' => $isSuperAdmin],
                                        ['label' => 'Audit the logs', 'url' => ['/log/admin'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'Execute DB Query', 'url' => ['/report/executeQuery'], 'visible' => $isSuperAdmin],
                                        ['label' => 'Inspect logs files', 'url' => ['/report/logFile'], 'visible' => $isSuperAdmin],
                                        ['label' => 'Register new company', 'url' => ['/users/newReg'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'Promo Codes', 'url' => ['/promoCodes/'], 'visible' => $isTopStaffOrAccountantLogged],
                                        ['label' => 'Booking Log', 'url' => ['/bookingLog/admin'], 'visible' => $isTopStaffLogged],
                                        ['label' => 'App params', 'url' => ['/params/admin'], 'visible' => $isSuperAdmin],
                                        ['label' => 'OpCache', 'url' => ['/report/opcache'], 'visible' => $isSuperAdmin],
                                    ]
                                ],
                            ),
                        ),
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
            </div><!-- mainmenu -->
                <?php if (isset($this->breadcrumbs)): ?>
                    <?php
                    $this->widget('bootstrap.widgets.TbBreadcrumb', array(
                        'links' => $this->breadcrumbs,
                    ));
                    ?><!-- breadcrumbs -->
            <?php endif ?>
            <?php echo $content; ?>
        </div>
        <div class="clearfix print"></div>
        <div class="footer text-center print" style="margin-top: 2%; width: 100%">
            <img src="/img/footer_logos.jpg" />
<?php echo \Yii::app()->session->get(\UserInfo::ACTIVE_COMPANY_FOOTER, \UserInfo::BELAIR_FOOTER_HTML); ?>
        </div>

    </body>
</html>
