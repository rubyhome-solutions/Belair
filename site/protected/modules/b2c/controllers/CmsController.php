<?php

namespace b2c\controllers;

use b2c\components\ControllerOverridable;

\Yii::import('application.controllers.CmsController');

class CmsController extends \CmsController {

    use ControllerOverridable;

    protected $_inheritRules = false;

    /**
     * @return array action filters
     */
    public function filters() {
        return [
            'accessControl', // perform access control for CRUD operations
        ];
    }

    /**
     * Specifies the access control rules.
     * This method is used by the 'accessControl' filter.
     * @return array access control rules
     */
    public function accessRules() {
        return [
            ['allow',
                'actions' => ['index', 'getCMSData', 'view', 'aboutUs', 'Termsofservices', 'privacyPolicy', 'contactUs', 'cheapAirlinesTickets', 'Airtravelcompany', 'onlineFlightBooking', 'international', 'domesticFlights', 'visa','iataaccreditedagent','lowcostairlines','team','traveladvisory','payment','bookingguidelines','flightchanges','faq','sitemap','affiliations','disclaimer' ,'ourpartner', 'offers', 'couponduniya', 'couponchaska', 'compareraja', 'freecoupon', 'freekaamaal', 'couponhaat', 'cashkaro', 'pennyful', 'grabon', 'kamaiadda', 'couponguru', 'promotnc', 'couponraja', 'couponzeta', 'mobikwik', 'Payu', 'quikr', 'freeoffer', 'desidime', 'paytm', 'oxigen', 'freecharge', 'jiomoney', 'maddycoupons', 'cuponation', 'mycouponpromotion', 'couponsji', 'exclusive', 'couponclue', 'crexclusive', 'ccexclusive', 'cdexclusive', 'cgexclusive', 'czexclusive','ckexclusive', 'cjexclusive', 'jmexclusive','chexclusive','cpexclusive','cjiexclusive','ccuexclusive','mcexclusive','ptmexclusive', 'greatdeals', 'axis', 'cyexclusive', 'kgexclusive', 'mcpexclusive', 'grexclusive', 'khojguru', 'couponcanny', 'freecouponduniya', 'cashbacksmile', 'paylesser', 'cbsexclusive', 'fcdexclusive', 'esexclusive', 'craniexclusive', 'tcexclusive', 'plexclusive', 'couponrani', 'everysaving', 'taazacoupons', 'couponcenter', 'ccrexclusive', 'pwexclusive', 'kbexclusive', 'ciexclusive', 'csgexclusive', 'hdiexclusive', 'paisawapas', 'karobargain', 'couponsind', 'coupongalery', 'hotdealindia', 'mdexclusive', 'mydala', 'gfrexclusive', 'getfreerecharge', 'freecouponlive', 'fclexclusive', 'ctexclusive', 'couponsurl', 'bcexclusive', 'bachaocash', 'ciiexclusive', 'pcexclusive', 'cmexclusive', 'wyexclusive', 'fkexclusive', 'ecouponsinfo', 'thepricecut', 'comparemunafa', 'whaaky', 'dom', 'farekart', 'hellocoupons', 'hcexclusive', 'tapzo', 'yesbank', 'ceexclusive', 'chbexclusive', 'dbexclusive', 'kdexclusive', 'loexclusive', 'rlexclusive', 'c4c', 'couponshub', 'dealzbasket', 'klippd', 'lovelyoffers', 'rappler', 'activities', 'advexclusive', 'advcoupons', 'spexclusive', 'mdsexclusive', 'sitaphal', 'mahadeals'],
                'users' => ['*'],
            ],
            ['allow',
                'actions' => [ 'index', 'getCMSData', 'view', 'aboutUs', 'Termsofservices', 'privacyPolicy', 'contactUs', 'cheapAirlinesTickets', 'Airtravelcompany', 'onlineFlightBooking', 'international', 'domesticFlights', 'visa','iataaccreditedagent','lowcostairlines','team','traveladvisory','payment','bookingguidelines','flightchanges','faq','sitemap','affiliations','disclaimer' ],
                'users' => ['@'],
            ],
            ['deny', // deny all users
                'users' => ['*'],
            ],
        ];
    }

    public function actionView($id) {
        settype($id, 'integer');
        if (!array_key_exists($id, \Cms::$cmsComponents)) {
            \Utils::finalMessage('Unknown CMS component');
        }

        $this->redirect(\Cms::getB2CView($id));
    }

    public function actionIndex($id) {
        $this->pageTitle = 'CheapTicket.in';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionAboutUs($id) {
        $this->pageTitle = 'CheapTicket.in';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionTermsofservices($id) {
        $this->pageTitle = 'CheapTicket.in Terms And Conditions';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionprivacypolicy($id) {
        $this->pageTitle = 'CheapTicket.in Privacy Policy';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionCheapAirlinestickets($id) {
        $this->pageTitle = 'CheapTicket.in Cheap Airlines Tickets';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionAirtravelcompany($id) {
        $this->pageTitle = 'CheapTicket.in Air Travel Company';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionContactUs($id) {
        $this->pageTitle = 'CheapTicket.in Privacy Policy';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiononlineFlightBooking($id) {
        $this->pageTitle = 'CheapTicket.in Online Flight Booking';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actioninternational($id) {
        $this->pageTitle = 'CheapTicket.in International';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actiondomesticFlights($id) {
        $this->pageTitle = 'CheapTicket.in Domestic Flights';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionvisa($id) {
        $this->pageTitle = 'CheapTicket.in Domestic Flights';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioniataaccreditedagent($id) {
        $this->pageTitle = 'CheapTicket.in Iata Accredited Agent';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionlowcostairlines($id) {
        $this->pageTitle = 'CheapTicket.in Low Cost Airlines';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionteam($id) {
        $this->pageTitle = 'CheapTicket.in Team';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiontraveladvisory($id) {
        $this->pageTitle = 'CheapTicket.in Travel Tips';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionpayment($id) {
        $this->pageTitle = 'CheapTicket.in Payment';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionbookingguidelines($id) {
        $this->pageTitle = 'CheapTicket.in Booking Guidelines';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionflightchanges($id) {
        $this->pageTitle = 'CheapTicket.in Flight Changes';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionfaq($id) {
        $this->pageTitle = 'CheapTicket.in FAQ';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionsitemap($id) {
        $this->pageTitle = 'CheapTicket.in Sitemap';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionaffiliations($id) {
        $this->pageTitle = 'CheapTicket.in affiliations';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiondisclaimer($id) {
        $this->pageTitle = 'CheapTicket.in disclaimer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actionourpartner($id) {
        $this->pageTitle = 'CheapTicket.in our partner';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actionoffers($id) {
        $this->pageTitle = 'CheapTicket.in Offers-ICICI';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionCouponduniya($id) {
        $this->pageTitle = 'CheapTicket.in Couponduniya-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncouponchaska($id) {
        $this->pageTitle = 'CheapTicket.in couponchaska-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
     public function actioncompareraja($id) {
        $this->pageTitle = 'CheapTicket.in compareraja-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actionfreecoupon($id) {
        $this->pageTitle = 'CheapTicket.in freecoupon-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
       
    public function actionfreekaamaal($id) {
        $this->pageTitle = 'CheapTicket.in freekaamaal-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
     public function actioncouponhaat($id) {
        $this->pageTitle = 'CheapTicket.in couponhaat-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actioncashkaro($id) {
        $this->pageTitle = 'CheapTicket.in cashkaro-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionpennyful($id) {
        $this->pageTitle = 'CheapTicket.in pennyful-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actiongrabon($id) {
        $this->pageTitle = 'CheapTicket.in grabon-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actionkamaiadda($id) {
        $this->pageTitle = 'CheapTicket.in kamaaiadda-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    
    public function actioncouponguru($id) {
        $this->pageTitle = 'CheapTicket.in couponguru-Offer';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionpromotnc($id) {
        $this->pageTitle = 'CheapTicket.in promo-Terms & Condition';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncouponraja($id) {
        $this->pageTitle = 'CheapTicket.in couponraja';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncouponzeta($id) {
        $this->pageTitle = 'CheapTicket.in couponzeta';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionmobikwik($id) {
        $this->pageTitle = 'CheapTicket.in mobikwik';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionPayu($id) {
        $this->pageTitle = 'CheapTicket.in Payu';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionQuikr($id) {
        $this->pageTitle = 'CheapTicket.in quikr';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	
	public function actionfreeoffer($id) {
        $this->pageTitle = 'CheapTicket.in Free Offer Today';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actiondesidime($id) {
        $this->pageTitle = 'CheapTicket.in Desi Dime';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionpaytm($id) {
        $this->pageTitle = 'CheapTicket.in Paytm';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionoxigen($id) {
        $this->pageTitle = 'CheapTicket.in Oxigen';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionfreecharge($id) {
        $this->pageTitle = 'CheapTicket.in Freecharge';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionjiomoney($id) {
        $this->pageTitle = 'CheapTicket.in Jio Money';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionmaddycoupons($id) {
        $this->pageTitle = 'CheapTicket.in Maddy Coupons';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncuponation($id) {
        $this->pageTitle = 'CheapTicket.in Cuponation';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionmycouponpromotion($id) {
	$this->pageTitle = 'CheapTicket.in mycouponpromotion';
	$this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncouponsji($id) {
        $this->pageTitle = 'CheapTicket.in couponsji';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionexclusive($id) {
        $this->pageTitle = 'CheapTicket.in exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncouponclue($id) {
        $this->pageTitle = 'CheapTicket.in Coupon Clue';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncrexclusive($id) {
        $this->pageTitle = 'Compare Raja exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionccexclusive($id) {
        $this->pageTitle = 'Coupon Chaska exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncdexclusive($id) {
        $this->pageTitle = 'Coupon Duniya exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncgexclusive($id) {
        $this->pageTitle = 'Couponz Guru exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionczexclusive($id) {
        $this->pageTitle = 'Couponz Zeta exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionckexclusive($id) {
        $this->pageTitle = 'Cash Karo exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncjexclusive($id) {
        $this->pageTitle = 'Coupon Raja exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionjmexclusive($id) {
        $this->pageTitle = 'JIO Money exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionchexclusive($id) {
        $this->pageTitle = 'Couponhaat exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncpexclusive($id) {
        $this->pageTitle = 'MyCouponPromotion exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncjiexclusive($id) {
        $this->pageTitle = 'CouponJi exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionccuexclusive($id) {
        $this->pageTitle = 'Couponclue exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionmcexclusive($id) {
        $this->pageTitle = 'Maddycoupon exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionptmexclusive($id) {
        $this->pageTitle = 'PayTM exclusive';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actiongreatdeals($id) {
        $this->pageTitle = 'CheapTicket.in Great Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionaxis($id) {
        $this->pageTitle = 'Axis Bank Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncyexclusive($id) {
        $this->pageTitle = 'Coupon Canny Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionkgexclusive($id) {
        $this->pageTitle = 'KhojGuru Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionmcpexclusive($id) {
        $this->pageTitle = 'MyCouponPrice Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actiongrexclusive($id) {
        $this->pageTitle = 'Grabon Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionkhojguru($id) {
        $this->pageTitle = 'KhojGuru Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncouponcanny($id) {
        $this->pageTitle = 'CouponCanny Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionfreecouponduniya($id) {
        $this->pageTitle = 'Free CouponDuniya Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncashbacksmile($id) {
        $this->pageTitle = 'CashBackSmile Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionpaylesser($id) {
        $this->pageTitle = 'paylesser Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionfcdexclusive($id) {
        $this->pageTitle = 'FreeCouponDuniya Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncbsexclusive($id) {
        $this->pageTitle = 'Cash Back Smile Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncraniexclusive($id) {
        $this->pageTitle = 'Coupon Rani Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionplexclusive($id) {
        $this->pageTitle = 'PayLesser Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actiontcexclusive($id) {
        $this->pageTitle = 'TaazaCoupons Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionesexclusive($id) {
        $this->pageTitle = 'Every Saving Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actiontaazacoupons($id) {
        $this->pageTitle = 'TaazaCoupons Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioneverysaving($id) {
        $this->pageTitle = 'everysaving Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncouponrani($id) {
        $this->pageTitle = 'Couponrani Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncouponcenter($id) {
        $this->pageTitle = 'CouponCenter Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionccrexclusive($id) {
        $this->pageTitle = 'CouponCenter Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionpwexclusive($id) {
        $this->pageTitle = 'PaisaWapas Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionkbexclusive($id) {
        $this->pageTitle = 'Karobargain Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionciexclusive($id) {
        $this->pageTitle = 'Couponsind Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncsgexclusive($id) {
        $this->pageTitle = 'CouponGalery Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionhdiexclusive($id) {
        $this->pageTitle = 'HotDealIndia Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionpaisawapas($id) {
        $this->pageTitle = 'PaisaWapas Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actionkarobargain($id) {
        $this->pageTitle = 'karobargain Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncouponsind($id) {
        $this->pageTitle = 'Couponsind Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }

    public function actioncoupongalery($id) {
        $this->pageTitle = 'Coupongalery Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionhotdealindia($id) {
        $this->pageTitle = 'HotDealIndia Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionmdexclusive($id) {
        $this->pageTitle = 'MyDala Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionmydala($id) {
        $this->pageTitle = 'MyDala Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiongfrexclusive($id) {
        $this->pageTitle = 'Get Freerecharge exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiongetfreerecharge($id) {
        $this->pageTitle = 'GetFree Recharge Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionfreecouponlive($id) {
        $this->pageTitle = 'Free Coupon Live Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionfclexclusive($id) {
        $this->pageTitle = 'Free Coupon Live Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionctexclusive($id) {
        $this->pageTitle = 'Couopnsurl Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncouponsurl($id) {
        $this->pageTitle = 'Couopnsurl Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionbcexclusive($id) {
        $this->pageTitle = 'Bachao Cash Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionbachaocash($id) {
        $this->pageTitle = 'Bachao Cash Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionciiexclusive($id) {
        $this->pageTitle = 'ecouponsinfo exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncmexclusive($id) {
        $this->pageTitle = 'Compare Munafa Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionpcexclusive($id) {
        $this->pageTitle = 'The Price Cut Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionwyexclusive($id) {
        $this->pageTitle = 'Whaaky Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionfkexclusive($id) {
        $this->pageTitle = 'Fare Kart Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionhcexclusive($id) {
        $this->pageTitle = 'Hello Coupons Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionecouponsinfo($id) {
        $this->pageTitle = 'E Coupons Info Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionthepricecut($id) {
        $this->pageTitle = 'The Price Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncomparemunafa($id) {
        $this->pageTitle = 'Compare Munafa Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionwhaaky($id) {
        $this->pageTitle = 'Whaaky Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiondom($id) {
        $this->pageTitle = 'Domestic and International Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionfarekart($id) {
        $this->pageTitle = 'Fare Kart Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionhellocoupons($id) {
        $this->pageTitle = 'Hello Coupons Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiontapzo($id) {
        $this->pageTitle = 'Tapzo Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionceexclusive($id) {
        $this->pageTitle = 'Couopons 4 Coupon Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionchbexclusive($id) {
        $this->pageTitle = 'CouponsHub Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiondbexclusive($id) {
        $this->pageTitle = 'Dealz Basket Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionkdexclusive($id) {
        $this->pageTitle = 'Dealz Basket Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionloexclusive($id) {
        $this->pageTitle = 'Lovely Offer Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionrlexclusive($id) {
        $this->pageTitle = 'Rappler Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionc4c($id) {
        $this->pageTitle = 'Coupons 4 Coupon Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actioncouponshub($id) {
        $this->pageTitle = 'Coupons Hub Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actiondealzbasket($id) {
        $this->pageTitle = 'Dealz Basket Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionklippd($id) {
        $this->pageTitle = 'Klippd Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionlovelyoffers($id) {
        $this->pageTitle = 'Lovely Offers Deal';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
    public function actionrappler($id) {
        $this->pageTitle = 'Rappler Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	public function actionactivities($id) {
        $this->pageTitle = 'Cheapticket.in Activities';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	public function actionadvexclusive($id) {
        $this->pageTitle = 'Advcoupons Exclusive Offers';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	public function actionadvcoupons($id) {
        $this->pageTitle = 'Advcoupons Offers';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	public function actionspexclusive($id) {
        $this->pageTitle = 'Sitaphal Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	public function actionmdsexclusive($id) {
        $this->pageTitle = 'Mahadeals Exclusive Deals';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	public function actionsitaphal($id) {
        $this->pageTitle = 'Sitaphal offers';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	public function actionmahadeals($id) {
        $this->pageTitle = 'Mahadeals Offers';
        $this->render('//common/js', ['bundle' => 'cms']);
    }
	
    public function actionGetCMSData($id) {
        settype($id, 'integer');
        if (!array_key_exists($id, \Cms::$cmsComponents)) {
            \Utils::jsonResponse('Not Found Any Information');
        }
		
        $activeCompanyId = \Utils::getActiveCompanyId();
        if (empty($activeCompanyId)) {
//            if ($id === \Cms::CMS_CONTACTS) {
//                $this->redirect('/site/contact');                
//    }          
            \Utils::jsonResponse(\Cms::getContent($id, \UserInfo::B2C_USER_INFO_ID));
        } else {
            \Utils::jsonResponse(\Cms::getContent($id, $activeCompanyId));
        }
    }

}

?>
