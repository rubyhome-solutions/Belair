<?php

/**
 * This is the model class for table "cms".
 *
 * The followings are the available columns in table 'cms':
 * @property integer $type_id
 * @property integer $user_info_id
 * @property string $content
 *
 * The followings are the available model relations:
 * @property UserInfo $userInfo
 */
class Cms extends CActiveRecord {

    const CMS_CONTACTS = 1;
    const CMS_TERMS = 2;
    const CMS_FAQ = 3;
    const CMS_POLICY = 4;
    const CMS_ABOUT = 5;
    const CMS_NEWS = 6;
    const CMS_EMAIL_FOOTER = 7;
    const CMS_PAGE_FOOTER = 8;
    const CMS_PAGE_CHEAPAIRLINESTICKET = 9;
    const CMS_PAGE_AIRTRAVELCOMPANY = 10;
    const CMS_PAGE_ONLINEFLIGHTBOOKING = 11;
    const CMS_PAGE_INTERNATIONAL = 12;
    const CMS_PAGE_DOMESTICFLIGHTS = 13;
    const CMS_PAGE_VISA = 14;
    const CMS_PAGE_IATA_ACCREDITED_AGENT = 15;
    const CMS_PAGE_LOW_COST_AIRLINES = 16;
    const CMS_PAGE_TEAM = 17;
    const CMS_PAGE_TRAVEL_ADVISORY = 18;
    const CMS_PAGE_PAYMENT = 19;
    const CMS_PAGE_BOOKING_GUIDELINES = 20;
    const CMS_PAGE_FLIGHT_CHANGES = 21;
    const CMS_PAGE_SITEMAP = 22;
    const CMS_AFFILIATIONS = 23;
    const CMS_PRIVACY = 24;
    const F2G_CMS_ABOUT = 25;
    const F2G_CMS_TERMS = 26;
    const CMS_PAGE_PARTNERLINK = 27;
    const CMS_PAGE_OFFER = 28;
    const CMS_PAGE_COUPONDUNIYA = 29;
    const CMS_PAGE_COUPONGURU = 30;
    const CMS_PAGE_COMPARERAJA = 31;
    const CMS_PAGE_COUPONCHASKA = 32;
    const CMS_PAGE_FREECOUPON = 33;
    const CMS_PAGE_FREEKAAMAAL = 34;
    const CMS_PAGE_COUPONHAAT = 35;
    const CMS_PAGE_CASHKARO = 36;
    const CMS_PAGE_PENNYFUL = 37;
    const CMS_PAGE_GRABON = 38;
    const CMS_PAGE_KAMAAIADDA = 39;
    const CMS_PAGE_PROMOTNC = 40;
    const CMS_PAGE_COUPONRAJA = 41;
    const CMS_PAGE_COUPONZETA = 42;
    const CMS_PAGE_MOBIKWIK = 43;
    const CMS_PAGE_PAYU = 44;
    const CMS_PAGE_QUIKR = 45;
    const CMS_PAGE_FREEOFFER = 46;
    const CMS_PAGE_DESIDIME = 47;
    const CMS_PAGE_PAYTM = 48;
    const CMS_PAGE_OXIGEN = 49;
    const CMS_PAGE_FREECHARGE = 50;
    const CMS_PAGE_JIOMONEY = 51;
    const CMS_PAGE_MADDYCOUPONS = 52;
    const CMS_PAGE_CUPONATION = 53;
    const CMS_PAGE_MYCOUPONPRICE = 54;
    const CMS_PAGE_COUPONSJI = 55;
    const CMS_PAGE_EXCLUSIVE = 56;
    const CMS_PAGE_COUPONCLUE = 57;
    const CMS_PAGE_CREXCLUSIVE = 58;
    const CMS_PAGE_CCEXCLUSIVE = 59;
    const CMS_PAGE_CDEXCLUSIVE = 60;
    const CMS_PAGE_CGEXCLUSIVE = 61;
    const CMS_PAGE_CZEXCLUSIVE = 62;
    const CMS_PAGE_CKEXCLUSIVE = 63;
    const CMS_PAGE_CJEXCLUSIVE = 64;
    const CMS_PAGE_JMEXCLUSIVE = 65;
    const CMS_PAGE_CHEXCLUSIVE = 66;
    const CMS_PAGE_CPEXCLUSIVE = 67;
    const CMS_PAGE_CJIEXCLUSIVE = 68;
    const CMS_PAGE_CCUEXCLUSIVE = 69;
    const CMS_PAGE_MCEXCLUSIVE = 70;
    const CMS_PAGE_PTMEXCLUSIVE = 71;
    const CMS_PAGE_GREATDEALS = 72;
    const CMS_PAGE_AXIS = 73;
    const CMS_PAGE_CYEXCLUSIVE = 74;
    const CMS_PAGE_KGEXCLUSIVE = 75;
    const CMS_PAGE_MCPEXCLUSIVE = 76;
    const CMS_PAGE_GREXCLUSIVE = 77;
    const CMS_PAGE_KHOJGURU = 78;
    const CMS_PAGE_COUPONCANNY = 79;
    const CMS_PAGE_FREECOUPONDUNIYA = 80;
    const CMS_PAGE_CASHBACKSMILE = 81;
    const CMS_PAGE_PAYLESSER = 82;
    const CMS_PAGE_FCDEXCLUSIVE = 83;
    const CMS_PAGE_CBSEXCLUSIVE = 84;
    const CMS_PAGE_PLEXCLUSIVE = 85;
    const CMS_PAGE_CRANIEXCLUSIVE = 86;
    const CMS_PAGE_ESEXCLUSIVE = 87;
    const CMS_PAGE_TCEXCLUSIVE = 88;
    const CMS_PAGE_COUPONRANI = 89;
    const CMS_PAGE_EVERYSAVING = 90;
    const CMS_PAGE_TAAZACOUPONS = 91;
    const CMS_PAGE_COUPONCENTER = 92;
    const CMS_PAGE_CCREXCLUSIVE = 93;
    const CMS_PAGE_PWEXCLUSIVE = 94;
    const CMS_PAGE_KBEXCLUSIVE = 95;
    const CMS_PAGE_CIEXCLUSIVE = 96;
    const CMS_PAGE_CSGEXCLUSIVE = 97;
    const CMS_PAGE_HDIEXCLUSIVE = 98;
    const CMS_PAGE_PAISAWAPAS = 99;
    const CMS_PAGE_KAROBARGAIN = 100;
    const CMS_PAGE_COUPONSIND = 101;
    const CMS_PAGE_COUPONGALERY = 102;
    const CMS_PAGE_HOTDEALINDIA = 103;
    const CMS_PAGE_MDEXCLUSIVE = 104;
    const CMS_PAGE_MYDALA = 105;
    const CMS_PAGE_GFREXCLUSIVE = 106;
    const CMS_PAGE_GETFREERECHARGE = 107;
    const CMS_PAGE_FREECOUPONLIVE = 108;
    const CMS_PAGE_FCLEXCLUSIVE = 109;
    const CMS_PAGE_CTEXCLUSIVE = 110;
    const CMS_PAGE_COUPONSURL = 111;
    const CMS_PAGE_BCEXCLUSIVE = 112;
    const CMS_PAGE_BACHAOCASH = 113;
    const CMS_PAGE_CIIEXCLUSIVE = 114;
    const CMS_PAGE_PCEXCLUSIVE = 115;
    const CMS_PAGE_CMEXCLUSIVE = 116;
    const CMS_PAGE_WYEXCLUSIVE = 117;
    const CMS_PAGE_FKEXCLUSIVE = 118;
    const CMS_PAGE_HCEXCLUSIVE = 119;
    const CMS_PAGE_ECOUPONSINFO = 120;
    const CMS_PAGE_THEPRICECUT = 121;
    const CMS_PAGE_COMPAREMUNAFA = 122;
    const CMS_PAGE_WHAAKY = 123;
    const CMS_PAGE_DOM = 124;
    const CMS_PAGE_FAREKART = 125;
    const CMS_PAGE_HELLOCOUPONS = 126;
    const CMS_PAGE_TAPZO = 127;
    const CMS_PAGE_YESBANK = 128;
    const CMS_PAGE_CEEXCLUSIVE = 129;
    const CMS_PAGE_CHBEXCLUSIVE = 130;
    const CMS_PAGE_DBEXCLUSIVE = 131;
    const CMS_PAGE_KDEXCLUSIVE = 132;
    const CMS_PAGE_LOEXCLUSIVE = 133;
    const CMS_PAGE_RLEXCLUSIVE = 134;
    const CMS_PAGE_C4C = 135;
    const CMS_PAGE_COUPONSHUB = 136;
    const CMS_PAGE_DEALZBASKET = 137;
    const CMS_PAGE_KLIPPD = 138;
    const CMS_PAGE_LOVELYOFFERS = 139;
    const CMS_PAGE_RAPPLER = 140;
	const CMS_PAGE_ACTIVITIES =141;
	const CMS_PAGE_ADVEXCLUSIVE =142;
	const CMS_PAGE_ADVCOUPONS =143 ;
	const CMS_PAGE_SPEXCLUSIVE=144;
	const CMS_PAGE_MDSEXCLUSIVE=145;
	const CMS_PAGE_SITAPHAL=146;
	const CMS_PAGE_MAHADEALS=147;
	

    static $cmsComponents = [
        self::CMS_CONTACTS => [
            'title' => 'Contacts',
            'default' => 'site/pages/contact.html',
            'belair' => '//site/contact',
            'b2c' => '/b2c/site/pages/contact.html',
        ],
        self::CMS_TERMS => [
            'title' => 'Terms & Conditions',
            'default' => 'site/pages/terms.html',
            'belair' => '//site/pages/terms',
            'b2c' => '/site/page?view=terms',
        ],
        self::CMS_FAQ => [
            'title' => 'FAQ',
            'default' => 'site/pages/faq.html',
            'belair' => '//site/pages/faq',
            'b2c' => '/site/page?view=faq',
        ],
        self::CMS_POLICY => [
            'title' => 'Privacy policy',
            'default' => 'site/pages/policy.html',
            'belair' => '//site/pages/terms',
            'b2c' => '/site/page?view=policy',
        ],
        self::CMS_ABOUT => [
            'title' => 'About us',
            'default' => 'site/pages/about.html',
            'belair' => '//site/pages/about',
            'b2c' => '/site/page?view=about',
        ],
        self::CMS_NEWS => [
            'title' => 'News',
            'default' => 'site/pages/news.html',
            'belair' => '//site/pages/news',
            'b2c' => '/site/page?view=news',
        ],
        self::CMS_EMAIL_FOOTER => [
            'title' => 'Email footer',
            'default' => 'site/pages/email_footer.html',
            'belair' => '//site/pages/email_footer',
            'b2c' => '/site/page?view=email_footer',
        ],
        self::CMS_PAGE_FOOTER => [
            'title' => 'Page footer',
            'default' => 'site/pages/footer.html',
            'belair' => '//site/pages/footer',
        ],
        self::CMS_PAGE_CHEAPAIRLINESTICKET => [
            'title' => 'Cheap Airline Ticket',
            'default' => 'site/pages/cheapairlinestickets.html',
            'belair' => '//site/pages/cheapairlinestickets',
        ],
        self::CMS_PAGE_AIRTRAVELCOMPANY => [
            'title' => 'Air Travel Company',
            'default' => 'site/pages/airtravelcompany.html',
            'belair' => '//site/pages/airtravelcompany',
        ],
        self::CMS_PAGE_ONLINEFLIGHTBOOKING => [
            'title' => 'Online Flight Booking',
            'default' => 'site/pages/onlineflightbooking.html',
            'belair' => '//site/pages/onlineflightbooking',
        ],
        self::CMS_PAGE_INTERNATIONAL => [
            'title' => 'International',
            'default' => 'site/pages/international.html',
            'belair' => '//site/pages/international',
        ],
        self::CMS_PAGE_DOMESTICFLIGHTS => [
            'title' => 'Domestic Flights',
            'default' => 'site/pages/domesticflights.html',
            'belair' => '//site/pages/domesticflights',
        ],
        self::CMS_PAGE_VISA => [
            'title' => 'Visa',
            'default' => 'site/pages/visa.html',
            'belair' => '//site/pages/visa',
        ],
        self::CMS_PAGE_IATA_ACCREDITED_AGENT => [
            'title' => 'Iata Accredited Agent',
            'default' => 'site/pages/iataaccreditedagent.html',
            'belair' => '//site/pages/iataaccreditedagent',
        ],
        self::CMS_PAGE_LOW_COST_AIRLINES => [
            'title' => 'Low Cost Airlines',
            'default' => 'site/pages/lowcostairlines.html',
            'belair' => '//site/pages/lowcostairlines',
        ],
        self::CMS_PAGE_TEAM => [
            'title' => 'Team',
            'default' => 'site/pages/team.html',
            'belair' => '//site/pages/team',
        ],
        self::CMS_PAGE_TRAVEL_ADVISORY => [
            'title' => 'Travel Advisory',
            'default' => 'site/pages/traveladvisory.html',
            'belair' => '//site/pages/traveladvisory',
        ],
        self::CMS_PAGE_PAYMENT => [
            'title' => 'Payment',
            'default' => 'site/pages/payment.html',
            'belair' => '//site/pages/payment',
        ],
        self::CMS_PAGE_BOOKING_GUIDELINES => [
            'title' => 'Payment',
            'default' => 'site/pages/bookingguidelines.html',
            'belair' => '//site/pages/bookingguidelines',
        ],
        self::CMS_PAGE_FLIGHT_CHANGES => [
            'title' => 'Payment',
            'default' => 'site/pages/flightchanges.html',
            'belair' => '//site/pages/flightchanges',
        ],
        self::CMS_PAGE_SITEMAP => [
            'title' => 'Sitemap',
            'default' => 'site/pages/sitemap.html',
            'belair' => '//site/pages/sitemap',
        ],
        self::CMS_AFFILIATIONS => [
            'title' => 'Affiliations',
            'default' => 'site/pages/affiliations.html',
            'belair' => '//site/pages/affiliations',
        ],
        self::CMS_PRIVACY => [
            'title' => 'PRIVACY',
            'default' => 'site/pages/disclaimer.html',
            'belair' => '//site/pages/disclaimer',
        ],
        self::F2G_CMS_ABOUT => [
            'title' => 'About Us',
            'default' => 'site/pages/about.html',
            'belair' => '//site/pages/about',
        ],
        self::F2G_CMS_TERMS => [
            'title' => 'Terms Of Services',
            'default' => 'site/pages/terms.html',
            'belair' => '//site/pages/terms',
        ],
        self::CMS_PAGE_PARTNERLINK => [
            'title' => 'Our Online Partners',
            'default' => 'site/pages/ourpartner.html',
            'belair' => '//site/pages/ourpartner',
        ],
        self::CMS_PAGE_OFFER => [
            'title' => 'Offers-ICICI',
            'default' => 'site/pages/offers.html',
            'belair' => '//site/pages/offers',
        ],
        self::CMS_PAGE_COUPONDUNIYA => [
            'title' => 'couponduniya',
            'default' => 'site/pages/couponduniya.html',
            'belair' => '//site/pages/couponduniya',
        ],
        self::CMS_PAGE_COUPONCHASKA => [
            'title' => 'couponchaska',
            'default' => 'site/pages/couponchaska.html',
            'belair' => '//site/pages/couponchaska',
        ],
        self::CMS_PAGE_COMPARERAJA => [
            'title' => 'compareraja',
            'default' => 'site/pages/compareraja.html',
            'belair' => '//site/pages/compareraja',
        ],
        self::CMS_PAGE_FREECOUPON => [
            'title' => 'freecoupon',
            'default' => 'site/pages/freecoupon.html',
            'belair' => '//site/pages/freecoupon',
        ],
        self::CMS_PAGE_FREEKAAMAAL => [
            'title' => 'freekaamaal',
            'default' => 'site/pages/freekaamaal.html',
            'belair' => '//site/pages/freekaamaal',
        ],
        self::CMS_PAGE_COUPONHAAT => [
            'title' => 'couponhaat',
            'default' => 'site/pages/couponhaat.html',
            'belair' => '//site/pages/couponhaat',
        ],
        self::CMS_PAGE_CASHKARO => [
            'title' => 'cashkaro',
            'default' => 'site/pages/cashkaro.html',
            'belair' => '//site/pages/cashkaro',
        ],
        self::CMS_PAGE_PENNYFUL => [
            'title' => 'pennyful',
            'default' => 'site/pages/pennyful.html',
            'belair' => '//site/pages/pennyful',
        ],
        self::CMS_PAGE_GRABON => [
            'title' => 'grabon',
            'default' => 'site/pages/grabon.html',
            'belair' => '//site/pages/grabon',
        ],
        self::CMS_PAGE_KAMAAIADDA => [
            'title' => 'couponguru',
            'default' => 'site/pages/kamaiadda.html',
            'belair' => '//site/pages/kamaaiadda',
        ],
        self::CMS_PAGE_COUPONGURU => [
            'title' => 'couponguru',
            'default' => 'site/pages/couponguru.html',
            'belair' => '//site/pages/couponguru',
        ],
        self::CMS_PAGE_PROMOTNC => [
            'title' => 'promot&c',
            'default' => 'site/pages/promotnc.html',
            'belair' => '//site/pages/promotnc',
        ],
        self::CMS_PAGE_COUPONRAJA => [
            'title' => 'couponraja',
            'default' => 'site/pages/couponraja.html',
            'belair' => '//site/pages/couponraja',
        ],
        self::CMS_PAGE_COUPONZETA => [
            'title' => 'couponzeta',
            'default' => 'site/pages/couponzeta.html',
            'belair' => '//site/pages/couponzeta',
        ],
        self::CMS_PAGE_MOBIKWIK => [
            'title' => 'mobikwik',
            'default' => 'site/pages/mobikwik.html',
            'belair' => '//site/pages/mobikwik',
        ],
        self::CMS_PAGE_PAYU => [
            'title' => 'PayU ',
            'default' => 'site/pages/payu.html',
            'belair' => '//site/pages/payu',
        ],
        self::CMS_PAGE_QUIKR => [
            'title' => 'Quikr',
            'default' => 'site/pages/Quikr.html',
            'belair' => '//site/pages/Quikr',
        ],
        self::CMS_PAGE_FREEOFFER => [
            'title' => 'Free Offer',
            'default' => 'site/pages/freeoffertoday.html',
            'belair' => '//site/pages/freeoffertoday',
        ],
        self::CMS_PAGE_DESIDIME => [
            'title' => 'Desi Dime',
            'default' => 'site/pages/desidime.html',
            'belair' => '//site/pages/desidime',
        ],
        self::CMS_PAGE_PAYTM => [
            'title' => 'Paytm',
            'default' => 'site/pages/paytm.html',
            'belair' => '//site/pages/paytm',
        ],
        self::CMS_PAGE_OXIGEN => [
            'title' => 'Oxigen',
            'default' => 'site/pages/oxigen.html',
            'belair' => '//site/pages/oxigen',
        ],
        self::CMS_PAGE_FREECHARGE => [
            'title' => 'Freecharge',
            'default' => 'site/pages/freecharge.html',
            'belair' => '//site/pages/freecharge',
        ],
        self::CMS_PAGE_JIOMONEY => [
            'title' => 'Jio Money',
            'default' => 'site/pages/jiomoney.html',
            'belair' => '//site/pages/jiomoney',
        ],
        self::CMS_PAGE_MADDYCOUPONS => [
            'title' => 'MADDY COUPONS',
            'default' => 'site/pages/maddycoupons.html',
            'belair' => '//site/pages/maddycoupons',
        ],
        self::CMS_PAGE_CUPONATION => [
            'title' => 'CUPONATION',
            'default' => 'site/pages/cuponation.html',
            'belair' => '//site/pages/cuponation',
        ],
        self::CMS_PAGE_MYCOUPONPRICE => [
            'title' => 'My Coupon Price',
            'default' => 'site/pages/mycouponprice.html',
            'belair' => '//site/pages/mycouponprice',
        ],
        self::CMS_PAGE_COUPONSJI => [
            'title' => 'My Coupons Ji',
            'default' => 'site/pages/couponsji.html',
            'belair' => '//site/pages/couponsji',
        ],
        self::CMS_PAGE_EXCLUSIVE => [
            'title' => 'Exclusive',
            'default' => 'site/pages/exclusive.html',
            'belair' => '//site/pages/exclusive',
        ],
        self::CMS_PAGE_COUPONCLUE => [
            'title' => 'Coupon Clue',
            'default' => 'site/pages/couponclue.html',
            'belair' => '//site/pages/couponclue',
        ],
        self::CMS_PAGE_CREXCLUSIVE => [
            'title' => 'Coupon Raja Exclusive',
            'default' => 'site/pages/crexclusive.html',
            'belair' => '//site/pages/crexclusive',
        ],
        self::CMS_PAGE_CCEXCLUSIVE => [
            'title' => 'Coupon Chaska Exclusive',
            'default' => 'site/pages/ccexclusive.html',
            'belair' => '//site/pages/ccexclusive',
        ],
        self::CMS_PAGE_CDEXCLUSIVE => [
            'title' => 'Coupon Duniya Exclusive',
            'default' => 'site/pages/cdexclusive.html',
            'belair' => '//site/pages/cdexclusive',
        ],
        self::CMS_PAGE_CGEXCLUSIVE => [
            'title' => 'Couponz Guru Exclusive',
            'default' => 'site/pages/cgexclusive.html',
            'belair' => '//site/pages/cgexclusive',
        ],
        self::CMS_PAGE_CZEXCLUSIVE => [
            'title' => 'Couponz ZETA Exclusive',
            'default' => 'site/pages/czexclusive.html',
            'belair' => '//site/pages/czexclusive',
        ],
        self::CMS_PAGE_CKEXCLUSIVE => [
            'title' => 'CASH KARO Exclusive',
            'default' => 'site/pages/ckexclusive.html',
            'belair' => '//site/pages/ckexclusive',
        ],
        self::CMS_PAGE_CJEXCLUSIVE => [
            'title' => 'Compare Raja Exclusive',
            'default' => 'site/pages/cjexclusive.html',
            'belair' => '//site/pages/cjexclusive',
        ],
        self::CMS_PAGE_JMEXCLUSIVE => [
            'title' => 'Jio Money Exclusive',
            'default' => 'site/pages/jmexclusive.html',
            'belair' => '//site/pages/jmexclusive',
        ],
        self::CMS_PAGE_CHEXCLUSIVE => [
            'title' => 'Coupon Haat Exclusive',
            'default' => 'site/pages/chexclusive.html',
            'belair' => '//site/pages/chexclusive',
        ],
        self::CMS_PAGE_CPEXCLUSIVE => [
            'title' => 'MyCouponPromotion Exclusive',
            'default' => 'site/pages/cpexclusive.html',
            'belair' => '//site/pages/cpexclusive',
        ],
        self::CMS_PAGE_CJIEXCLUSIVE => [
            'title' => 'CouponJi Exclusive',
            'default' => 'site/pages/cjiexclusive.html',
            'belair' => '//site/pages/cjiexclusive',
        ],
        self::CMS_PAGE_CCUEXCLUSIVE => [
            'title' => 'Couponclue Exclusive',
            'default' => 'site/pages/ccuexclusive.html',
            'belair' => '//site/pages/ccuexclusive',
        ],
        self::CMS_PAGE_MCEXCLUSIVE => [
            'title' => 'Maddycoupon Exclusive',
            'default' => 'site/pages/mcexclusive.html',
            'belair' => '//site/pages/mcexclusive',
        ],
        self::CMS_PAGE_PTMEXCLUSIVE => [
            'title' => 'PayTM Exclusive',
            'default' => 'site/pages/ptmexclusive.html',
            'belair' => '//site/pages/ptmexclusive',
        ],
        self::CMS_PAGE_GREATDEALS => [
            'title' => 'CheapTicket.in Great Deals',
            'default' => 'site/pages/greatdeals.html',
            'belair' => '//site/pages/greatdeals',
        ],
        self::CMS_PAGE_AXIS => [
            'title' => 'Axis Bank Deals',
            'default' => 'site/pages/axis.html',
            'belair' => '//site/pages/axis',
        ],
        self::CMS_PAGE_CYEXCLUSIVE => [
            'title' => 'Coupon Canny Deals',
            'default' => 'site/pages/cyexclusive.html',
            'belair' => '//site/pages/cyexclusive',
        ],
        self::CMS_PAGE_KGEXCLUSIVE => [
            'title' => 'KhojGuru Deals',
            'default' => 'site/pages/kgexclusive.html',
            'belair' => '//site/pages/kgexclusive',
        ],
        self::CMS_PAGE_MCPEXCLUSIVE => [
            'title' => 'Axis Bank Deals',
            'default' => 'site/pages/mcpexclusive.html',
            'belair' => '//site/pages/mcpexclusive',
        ],
        self::CMS_PAGE_GREXCLUSIVE => [
            'title' => 'Grabon Deals',
            'default' => 'site/pages/grexclusive.html',
            'belair' => '//site/pages/grexclusive',
        ],
        self::CMS_PAGE_KHOJGURU => [
            'title' => 'KhojGuru Deals',
            'default' => 'site/pages/khojguru.html',
            'belair' => '//site/pages/khojguru',
        ],
        self::CMS_PAGE_COUPONCANNY => [
            'title' => 'Coupon Canny Deals',
            'default' => 'site/pages/couponcanny.html',
            'belair' => '//site/pages/couponcanny',
        ],
        self::CMS_PAGE_COUPONCANNY => [
            'title' => 'Coupon Canny Deals',
            'default' => 'site/pages/couponcanny.html',
            'belair' => '//site/pages/couponcanny',
        ],
        self::CMS_PAGE_FREECOUPONDUNIYA => [
            'title' => 'Free Couopon Duniya Deals',
            'default' => 'site/pages/freecouponduniya.html',
            'belair' => '//site/pages/freecouponduniya',
        ],
        self::CMS_PAGE_CASHBACKSMILE => [
            'title' => 'Cash Back Smile Deals',
            'default' => 'site/pages/cashbacksmile.html',
            'belair' => '//site/pages/cashbacksmile',
        ],
        self::CMS_PAGE_PAYLESSER => [
            'title' => 'Paylesser Deals',
            'default' => 'site/pages/paylesser.html',
            'belair' => '//site/pages/paylesser',
        ],
        self::CMS_PAGE_FCDEXCLUSIVE => [
            'title' => 'Free Couopon Duniya Exclusive DEAL',
            'default' => 'site/pages/fcdexclusive.html',
            'belair' => '//site/pages/fcdexclusive',
        ],
        self::CMS_PAGE_CBSEXCLUSIVE => [
            'title' => 'Cash Back Smile exclusive Deals',
            'default' => 'site/pages/cbsexclusive.html',
            'belair' => '//site/pages/cbsexclusive',
        ],
        self::CMS_PAGE_CRANIEXCLUSIVE => [
            'title' => 'Coupon Rani Exclusive Deals',
            'default' => 'site/pages/craniexclusive.html',
            'belair' => '//site/pages/craniexclusive',
        ],
        self::CMS_PAGE_PLEXCLUSIVE => [
            'title' => 'PayLesser Exclusive Deals',
            'default' => 'site/pages/plexclusive.html',
            'belair' => '//site/pages/plexclusive',
        ],
        self::CMS_PAGE_ESEXCLUSIVE => [
            'title' => 'Every Sharing Exclusive Deals',
            'default' => 'site/pages/esexclusive.html',
            'belair' => '//site/pages/esexclusive',
        ],
        self::CMS_PAGE_TCEXCLUSIVE => [
            'title' => 'Taaza Coupon Exclusive Deals',
            'default' => 'site/pages/tcexclusive.html',
            'belair' => '//site/pages/tcexclusive',
        ],
        self::CMS_PAGE_COUPONRANI => [
            'title' => 'Coupon Rani Deals',
            'default' => 'site/pages/couponrani.html',
            'belair' => '//site/pages/couponrani',
        ],
        self::CMS_PAGE_EVERYSAVING => [
            'title' => 'EverySaving Deals',
            'default' => 'site/pages/everysaving.html',
            'belair' => '//site/pages/everysaving',
        ],
        self::CMS_PAGE_TAAZACOUPONS => [
            'title' => 'TAAZA COUPONS Deals',
            'default' => 'site/pages/taazacoupons.html',
            'belair' => '//site/pages/taazacoupons',
        ],
        self::CMS_PAGE_COUPONCENTER => [
            'title' => 'Coupon Center Deals',
            'default' => 'site/pages/couponcenter.html',
            'belair' => '//site/pages/couponcenter',
        ],
        self::CMS_PAGE_CCREXCLUSIVE => [
            'title' => 'Coupon Center Exclusive Deals',
            'default' => 'site/pages/ccrexclusive.html',
            'belair' => '//site/pages/ccrexclusive',
        ],
        self::CMS_PAGE_PWEXCLUSIVE => [
            'title' => 'Paisa Wapas Exclusive Deals',
            'default' => 'site/pages/pwexclusive.html',
            'belair' => '//site/pages/pwexclusive',
        ],
        self::CMS_PAGE_KBEXCLUSIVE => [
            'title' => 'Karo Bargain Exclusive Deals',
            'default' => 'site/pages/kbexclusive.html',
            'belair' => '//site/pages/kbexclusive',
        ],
        self::CMS_PAGE_CIEXCLUSIVE => [
            'title' => 'Couponsind Exclusive Deals',
            'default' => 'site/pages/ciexclusive.html',
            'belair' => '//site/pages/ciexclusive',
        ],
        self::CMS_PAGE_CSGEXCLUSIVE => [
            'title' => 'CouponGalery Exclusive Deals',
            'default' => 'site/pages/csgexclusive.html',
            'belair' => '//site/pages/csgexclusive',
        ],
        self::CMS_PAGE_HDIEXCLUSIVE => [
            'title' => 'HotDeal India Exclusive Deals',
            'default' => 'site/pages/hdiexclusive.html',
            'belair' => '//site/pages/hdiexclusive',
        ],
        self::CMS_PAGE_PAISAWAPAS => [
            'title' => 'PaisaWapas Deals',
            'default' => 'site/pages/paisawapas.html',
            'belair' => '//site/pages/paisawapas',
        ],
        self::CMS_PAGE_KAROBARGAIN => [
            'title' => 'Karobargain Deals',
            'default' => 'site/pages/karobargain.html',
            'belair' => '//site/pages/hdiexclusive',
        ],
        self::CMS_PAGE_COUPONSIND => [
            'title' => 'CouponsInd Deals',
            'default' => 'site/pages/couponsind.html',
            'belair' => '//site/pages/couponsind',
        ],
        self::CMS_PAGE_COUPONGALERY => [
            'title' => 'CouponGalery Deals',
            'default' => 'site/pages/coupongallery.html',
            'belair' => '//site/pages/coupongalery',
        ],
        self::CMS_PAGE_HOTDEALINDIA => [
            'title' => 'HOTDEALINDIA Deals',
            'default' => 'site/pages/hotdealindia.html',
            'belair' => '//site/pages/coupongalery',
        ],
        self::CMS_PAGE_MDEXCLUSIVE => [
            'title' => 'My Dala Exclusive Deals',
            'default' => 'site/pages/mdexclusive.html',
            'belair' => '//site/pages/mdexclusive',
        ],
        self::CMS_PAGE_MYDALA => [
            'title' => 'MyDala Deals',
            'default' => 'site/pages/mydala.html',
            'belair' => '//site/pages/mydala',
        ],
        self::CMS_PAGE_GFREXCLUSIVE => [
            'title' => 'Get Free Recharge Exclusive Deals',
            'default' => 'site/pages/gfrexclusive.html',
            'belair' => '//site/pages/gfrexclusive',
        ],
        self::CMS_PAGE_GETFREERECHARGE => [
            'title' => 'Get Free Recharge Deals',
            'default' => 'site/pages/getfreerecharge.html',
            'belair' => '//site/pages/getfreerecharge',
        ],
        self::CMS_PAGE_FREECOUPONLIVE => [
            'title' => 'Free Coupon Live Deals',
            'default' => 'site/pages/freecouponlive.html',
            'belair' => '//site/pages/freecouponlive',
        ],
        self::CMS_PAGE_FCLEXCLUSIVE => [
            'title' => 'Free Coupon Live Exclusive Deals',
            'default' => 'site/pages/fclexclusive.html',
            'belair' => '//site/pages/fclexclusive',
        ],
        self::CMS_PAGE_CTEXCLUSIVE => [
            'title' => 'Couponsurl Exclusive Deals',
            'default' => 'site/pages/ctexclusive.html',
            'belair' => '//site/pages/ctexclusive',
        ],
        self::CMS_PAGE_COUPONSURL => [
            'title' => 'Couponsurl Deals',
            'default' => 'site/pages/couponsurl.html',
            'belair' => '//site/pages/couponslive',
        ],
        self::CMS_PAGE_BCEXCLUSIVE => [
            'title' => 'Bachao Cash Exclusive Deals',
            'default' => 'site/pages/bcexclusive.html',
            'belair' => '//site/pages/bcexclusive',
        ],
        self::CMS_PAGE_BACHAOCASH => [
            'title' => 'Bachao Cash Deals',
            'default' => 'site/pages/bachaocash.html',
            'belair' => '//site/pages/bachaocash',
        ],
        self::CMS_PAGE_CIIEXCLUSIVE => [
            'title' => 'ecouponsinfo Exclusive Deals',
            'default' => 'site/pages/ciiexclusive.html',
            'belair' => '//site/pages/ciiexclusive',
        ],
        self::CMS_PAGE_PCEXCLUSIVE => [
            'title' => 'Price Cut Exclusive Deals',
            'default' => 'site/pages/pcexclusive.html',
            'belair' => '//site/pages/pcexclusive',
        ],
        self::CMS_PAGE_CMEXCLUSIVE => [
            'title' => 'Compare Munafa Exclusive Deals',
            'default' => 'site/pages/cmexclusive.html',
            'belair' => '//site/pages/cmexclusive',
        ],
        self::CMS_PAGE_WYEXCLUSIVE => [
            'title' => 'Whaaky Exclusive Deals',
            'default' => 'site/pages/wyexclusive.html',
            'belair' => '//site/pages/wyexclusive',
        ],
        self::CMS_PAGE_FKEXCLUSIVE => [
            'title' => 'Fare Kart Exclusive Deals',
            'default' => 'site/pages/fkexclusive.html',
            'belair' => '//site/pages/fkexclusive',
        ],
        self::CMS_PAGE_HCEXCLUSIVE => [
            'title' => 'Hello Coupons Exclusive Deals',
            'default' => 'site/pages/hcexclusive.html',
            'belair' => '//site/pages/hcexclusive',
        ],
        self::CMS_PAGE_ECOUPONSINFO => [
            'title' => 'ECOUPONSINFO Deals',
            'default' => 'site/pages/ecouponsinfo.html',
            'belair' => '//site/pages/ecouponsinfo',
        ],
        self::CMS_PAGE_THEPRICECUT => [
            'title' => 'The Price Cut Deals',
            'default' => 'site/pages/thepricecut.html',
            'belair' => '//site/pages/thepricecut',
        ],
        self::CMS_PAGE_COMPAREMUNAFA => [
            'title' => 'Compare Munafa Deals',
            'default' => 'site/pages/comparemunfa.html',
            'belair' => '//site/pages/comparemunfa',
        ],
        self::CMS_PAGE_WHAAKY => [
            'title' => 'Compare Munafa Deals',
            'default' => 'site/pages/whaaky.html',
            'belair' => '//site/pages/whaaky',
        ],
        self::CMS_PAGE_DOM => [
            'title' => 'Domestic and International Deals',
            'default' => 'site/pages/dom.html',
            'belair' => '//site/pages/dom',
        ],
        self::CMS_PAGE_FAREKART => [
            'title' => 'Fare Kart Deals',
            'default' => 'site/pages/farekart.html',
            'belair' => '//site/pages/farekart',
        ],
        self::CMS_PAGE_HELLOCOUPONS => [
            'title' => 'Hello Coupons Deals',
            'default' => 'site/pages/hellocoupons.html',
            'belair' => '//site/pages/hellocoupons',
        ],
        self::CMS_PAGE_TAPZO => [
            'title' => 'TAPZO Coupons Deals',
            'default' => 'site/pages/tapzo.html',
            'belair' => '//site/pages/tapzo',
        ],
        self::CMS_PAGE_YESBANK => [
            'title' => 'Yes Bank Coupons Deals',
            'default' => 'site/pages/yes.html',
            'belair' => '//site/pages/yes',
        ],
        self::CMS_PAGE_CEEXCLUSIVE =>[
            'title' => 'Coupon4Coupon Deals',
            'default' => 'site/pages/ceexclusive.html',
            'belair' => '//site/pages/ceexclusive',
        ],
        self::CMS_PAGE_CHBEXCLUSIVE =>[
            'title' => 'Coupons Hub Deals',
            'default' => 'site/pages/chbexclusive.html',
            'belair' => '//site/pages/chbexclusive',
        ],
        self::CMS_PAGE_DBEXCLUSIVE =>[
            'title' => 'Dealz Basket Deals',
            'default' => 'site/pages/dbexclusive.html',
            'belair' => '//site/pages/dbexclusive',
        ],
        self::CMS_PAGE_KDEXCLUSIVE =>[
            'title' => 'Klippd Deals',
            'default' => 'site/pages/kdexclusive.html',
            'belair' => '//site/pages/kdexclusive',
        ],
        self::CMS_PAGE_LOEXCLUSIVE =>[
            'title' => 'Lovely Offers Deals',
            'default' => 'site/pages/loexclusive.html',
            'belair' => '//site/pages/loexclusive',
        ],
        self::CMS_PAGE_RLEXCLUSIVE =>[
            'title' => 'Lovely Offers Deals',
            'default' => 'site/pages/rlexclusive.html',
            'belair' => '//site/pages/rlexclusive',
        ],
        self::CMS_PAGE_C4C =>[
            'title' => 'Coupon4Coupon Offers Deals',
            'default' => 'site/pages/c4c.html',
            'belair' => '//site/pages/c4c',
        ], 
        self::CMS_PAGE_COUPONSHUB =>[
            'title' => 'Coupons Hub Offers Deals',
            'default' => 'site/pages/couponshub.html',
            'belair' => '//site/pages/couponshub',
        ], 
        self::CMS_PAGE_DEALZBASKET =>[
            'title' => 'Coupons Hub Offers Deals',
            'default' => 'site/pages/dealzbasket.html',
            'belair' => '//site/pages/dealzbasket',
        ], 
        self::CMS_PAGE_KLIPPD =>[
            'title' => 'Klippd Offers Deals',
            'default' => 'site/pages/klippd.html',
            'belair' => '//site/pages/klippd',
        ], 
        self::CMS_PAGE_LOVELYOFFERS =>[
            'title' => 'Lovely Offers Deals',
            'default' => 'site/pages/lovelyoffers.html',
            'belair' => '//site/pages/lovelyoffers',
        ], 
        self::CMS_PAGE_RAPPLER =>[
            'title' => 'Rappler Offers Deals',
            'default' => 'site/pages/rappler.html',
            'belair' => '//site/pages/rappler',
        ], 
		self::CMS_PAGE_ACTIVITIES =>[
            'title' => 'Cheapticket.in Activities',
            'default' => 'site/pages/activities.html',
            'belair' => '//site/pages/activities',
        ], 
		self::CMS_PAGE_ADVEXCLUSIVE =>[
            'title' => 'ADVCoupons Exclusive Offers Deals',
            'default' => 'site/pages/advexclusive.html',
            'belair' => '//site/pages/advexclusive',
        ],
		self::CMS_PAGE_ADVCOUPONS =>[
            'title' => 'ADVCoupons Offers Deals',
            'default' => 'site/pages/advcoupons.html',
            'belair' => '//site/pages/advcoupons',
        ],
		self::CMS_PAGE_SPEXCLUSIVE =>[
            'title' => 'Sitaphal Exclusive Offers Deals',
            'default' => 'site/pages/spexclusive.html',
            'belair' => '//site/pages/spexclusive',
        ],
		self::CMS_PAGE_MDSEXCLUSIVE =>[
            'title' => 'Mahadeals Exclusive Offers Deals',
            'default' => 'site/pages/mdsexclusive.html',
            'belair' => '//site/pages/mdsexclusive',
        ],
		self::CMS_PAGE_SITAPHAL =>[
            'title' => 'Sitaphal Offers Deals',
            'default' => 'site/pages/sitaphal.html',
            'belair' => '//site/pages/sitaphal',
        ],
		self::CMS_PAGE_MAHADEALS =>[
            'title' => 'Mahadeals Offers Deals',
            'default' => 'site/pages/mahadeals.html',
            'belair' => '//site/pages/mahadeals',
        ],
    ];

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'cms';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return [
            ['user_info_id, content', 'required'],
            ['type_id, user_info_id', 'numerical', 'integerOnly' => true],
            ['content', 'safe'],
            ['type_id, user_info_id, content', 'safe', 'on' => 'search'],
        ];
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return [
            'userInfo' => [self::BELONGS_TO, 'UserInfo', 'user_info_id'],
        ];
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'type_id' => 'Type',
            'user_info_id' => 'User Info',
            'content' => 'Content',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search() {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('type_id', $this->type_id);
        $criteria->compare('user_info_id', $this->user_info_id);

        return new CActiveDataProvider($this, ['criteria' => $criteria]);
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Cms the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function primaryKey() {
        return ['type_id', 'user_info_id'];
    }

    /**
     * Get the CMS content for the client or the default one if there is none defined
     * @param int $contentTypeId Content type ID
     * @param int $userInfoId UserInfo ID
     * @return string|bool The content or false if such a content type do not exists
     */
    static function getContent($contentTypeId, $userInfoId) {
        if (!array_key_exists($contentTypeId, self::$cmsComponents)) {
            return false;
        }
        $model = self::model()->findByPk(['type_id' => $contentTypeId, 'user_info_id' => $userInfoId]);
        if ($model) {
            return $model->content;
        }

        $view_path = \Yii::app()->viewPath . DIRECTORY_SEPARATOR;
        $file = self::$cmsComponents[$contentTypeId]['default'];
        if (isset(\Yii::app()->theme)) {
            $theme = \Yii::app()->theme->viewPath . DIRECTORY_SEPARATOR;
            if (file_exists($theme . $file)) {
                return file_get_contents($theme . $file);
            }
        }
        return file_get_contents($view_path . $file);
    }

    /**
     * Remove the eventual php code from the content
     */
    function sanitizePhpTags() {
        $this->content = preg_replace('#<\?php(.*)(\?>)?#si', '', $this->content);
    }

    /**
     * Sanitize the content for PHP tags before saving
     */
    function beforeSave() {
        $this->sanitizePhpTags();
        return parent::beforeSave();
    }

    /**
     * Return the belair view to be rendered as default content
     * @param int $contentTypeId
     * @return string|bool The content
     */
    static function getBelairView($contentTypeId) {
        if (!array_key_exists($contentTypeId, self::$cmsComponents)) {
            return false;
        }
        // Return the view file
        return self::$cmsComponents[$contentTypeId]['belair'];
    }

    /**
     * Return the b2c view to be rendered as default content
     * @param int $contentTypeId
     * @return string|bool The content
     */
    static function getB2CView($contentTypeId) {
        if (!array_key_exists($contentTypeId, self::$cmsComponents)) {
            return false;
        }
        // Return the view file
        return self::$cmsComponents[$contentTypeId]['b2c'];
    }

    static function getMeta() {
        $metadata = [];
        $metadata['title'] = 'Cheap Airline Tickets worldwide – Book Lowest fares www.cheapticket.in';
        $metadata['desc'] = 'www.cheapticket.in ( Cheap Air Tickets Provider In India ) : Get cheapest available airline tickets.Book Online Cheap Tickets In India.Get Cheap Flights Tickets';
        $metadata['keyword'] = 'Cheap Air Tickets In India, Get Cheap Tickets In India, Cheapest Available Airline Tickets';

        if (strstr(Yii::app()->request->getUrl(), 'aboutUs')) {
            $metadata['title'] = 'Cheap Airline Tickets worldwide – Book Lowest fares www.cheapticket.in';
            $metadata['desc'] = 'Cheapticket.in ( Leading Travel company ) : Provides Cheap Airline Tickets In India.Get best Deals on Flights.Book online to Get Cheap Flights Tickets In India.';
            $metadata['keyword'] = 'Cheap Airline Tickets In India, Cheap Flights Tickets India, Get best Deals on Flights.';
        } else if (strstr(Yii::app()->request->getUrl(), 'contactUs')) {
            $metadata['title'] = 'Purchase Online Air tickets | Best Availability Air Tickets';
            $metadata['desc'] = 'www.cheapticket.in : Provides best offers for Purchase Online Air tickets.Get Availability Air Tickets for best deals,Lowest airfares,discount airline tickets';
            $metadata['keyword'] = 'Purchase Online Air tickets, Best Availability Air Tickets, Discount Airline Tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'privacyPolicy')) {
            $metadata['title'] = 'Cheap Flight Tickets | Best Deals On Airfare | Cheapticket';
            $metadata['desc'] = 'www.cheapticket.in (Online Flight Booking with Best Deals On Airfare In India) : Provides best offer for Cheap Flight Tickets In India.Book cheap flight tickets';
            $metadata['keyword'] = 'Cheap Flight Tickets, Best Deals On Airfare, Online Flight Booking';
        } else if (strstr(Yii::app()->request->getUrl(), 'mybookings')) {
            $metadata['title'] = 'Best Deals On Flights | Book Online Cheap Air Tickets India';
            $metadata['desc'] = 'Looking for Best Deals On Flights?, Cheapticket can help you by offering the cheapest fares for flights. Book Online Cheap Air Tickets India through cheapticket';
            $metadata['keyword'] = 'Best Deals On Flights, Book Online Cheap Air Tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'domesticflights')) {
            $metadata['title'] = 'Domestic Airlines India | Cheap Domestic Air Tickets India';
            $metadata['desc'] = 'Book Online to get Cheap Domestic Air Tickets India from www.cheapticket.in.Get best deals on Domestic Airlines In India & lowest airlines ticket with discounts';
            $metadata['keyword'] = 'Cheap Domestic Air Tickets India, Domestic Airlines In India, Lowest Airlines Ticket';
        } else if (strstr(Yii::app()->request->getUrl(), 'international')) {
            $metadata['title'] = 'Cheap International Flight Tickets | Air Tickets Booking';
            $metadata['desc'] = 'Want Cheap International Flight Tickets in India?Then contact cheapticket.in & get online International Air Tickets Booking facilities.Get cheap airline tickets';
            $metadata['keyword'] = 'Cheap International Flight Tickets, Air Tickets Booking, cheap airline tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'onlineflightbooking')) {
            $metadata['title'] = 'Buy Cheap Air Tickets Online | Book Flight Tickets in India ';
            $metadata['desc'] = 'Want to Buy Cheap Air Tickets Online in India? Then visit cheapticket.in & Book Flight Tickets in India. Get discounted domestic & international airline tickets';
            $metadata['keyword'] = 'Buy Cheap Air Tickets Online, Book Flight Tickets, domestic & international airline tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'cheapairlinestickets')) {
            $metadata['title'] = 'Cheap Air Tickets | Lowest Air Tickets | Best Air Tickets India';
            $metadata['desc'] = 'Looking for Lowest Air Tickets?Want to get Best Air Tickets? Then contact cheapticket.in & get Cheap Air Tickets in India.Book now to get Cheap Airlines Tickets';
            $metadata['keyword'] = 'Cheap Air Tickets, Lowest Air Tickets, Best Air Tickets, Cheap Airlines Tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'iataaccreditedagent')) {
            $metadata['title'] = 'Book Tickets From India | Cheap International Air Tickets';
            $metadata['desc'] = 'Get Cheap International Air Tickets in India through cheapticket.in, which is the best IATA accredited travel company in India. Book Tickets From India Online.';
            $metadata['keyword'] = 'Book Tickets From India, Cheap International Air Tickets, IATA accredited travel company';
        } else if (strstr(Yii::app()->request->getUrl(), 'team')) {
            $metadata['title'] = 'Airplane Tickets India | Air tickets Lowest Price in India';
            $metadata['desc'] = 'Want to get Air tickets for Lowest Price in India?Looking for cheap Airplane Tickets in India?Then contact cheapticket.in,which offers lowest air fares in India';
            $metadata['keyword'] = 'Airplane Tickets India, Air tickets Lowest Price in India, lowest air fares in India';
        } else if (strstr(Yii::app()->request->getUrl(), 'payment')) {
            $metadata['title'] = 'Lowest International Airfares | Cheap International AirFares';
            $metadata['desc'] = 'Visit www.cheapticket.in for flight tickets at Lowest International Airfares. Get international & domestic airlines tickets at Cheap International Air Fares.';
            $metadata['keyword'] = 'Lowest International Airfares, Cheap International Air Fares, international & domestic airlines tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'bookingguidelines')) {
            $metadata['title'] = 'Online Flight Booking | Air Tickets Fares | Cheapticket.in';
            $metadata['desc'] = 'Online Flight Booking for international & domestic airlines are now easy with Cheapticket.in. Get best deals on Air Tickets Fares. Online payment is possible.';
            $metadata['keyword'] = 'Online Flight Booking, Air Tickets Fares, international & domestic airlines';
        } else if (strstr(Yii::app()->request->getUrl(), 'visa')) {
            $metadata['title'] = 'Best Visa Services in India | Top B2C Online Travel Portal';
            $metadata['desc'] = 'Looking for Best Visa Services in India? Then contact cheapticket.in, which is the Top B2C Online Travel Portal. Get visa & cheapest international air tickets.';
            $metadata['keyword'] = 'Best Visa Services in India, Top B2C Online Travel Portal, cheapest international air tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'termsofservices')) {
            $metadata['title'] = 'Low Cost Airline Tickets | Best Online Travel Portal India';
            $metadata['desc'] = 'Low Cost Airline Tickets booking is now easy with Cheapticket.in, the Best Online Travel Portal in India.  Re-booking & refunds are based on terms & conditions.';
            $metadata['keyword'] = 'Best Online Travel Portal in India, Low Cost Airline Tickets, Low Cost Airline Tickets booking';
        } else if (strstr(Yii::app()->request->getUrl(), 'traveladvisory')) {
            $metadata['title'] = 'Air Travel Tips in India | Online Flight Bookings Advisory';
            $metadata['desc'] = 'Air Travel Tips in India & Online Flight Bookings Advisory given by cheapticket.in will be helpful to you before making international & domestic flight bookings';
            $metadata['keyword'] = 'Air Travel Tips in India, Online Flight Bookings Advisory, international & domestic flight bookings';
        } else if (strstr(Yii::app()->request->getUrl(), 'offers')) {
            $metadata['title'] = 'CheapTicket.in Great Deals for ICICI Bank customers, Discount on ICICI Credit Card, ICICI Great Deal for Domestic Flight Tickets';
            $metadata['desc'] = 'Use ICICI Credit – Debit Cards & Get upto 12 % discount on Domestic and International on all Airlines';
            $metadata['keyword'] = 'Great Deals on Cheapticket.in, Great Airline deals by ICICI Bank, Discount Coupons on ICICI Credit Card, Airticket Coupon Code for ICICI Cards, Low Airfare Promo code to ICICI bank Customers, Discount Promo Codes on Airline tickets, LiveWithoutcashmoment offers on Airline Tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'mobikwik')) {
            $metadata['title'] = ' Airline tickets on Mobikwik, Mobikwik Promo Codes for Airlines CheapTickets, Coupon Code for Discounts on Domestic Air Ticket';
            $metadata['desc'] = 'Use Mobikwik & Get discount on domestic/International Flights';
            $metadata['keyword'] = 'Airticket Promo Offer on Mobikwik, Airline Promo code on Mobikwik, Cheap airtickets offer by Mobikwik, Discount airfare on Mobikwik';
        } else if (strstr(Yii::app()->request->getUrl(), 'axis')) {
            $metadata['title'] = 'CheapTicket.in Great Deals for AXIS Bank customers, Discount on AXIS Credit Card, AXIS  Great Deal for Domestic Flight Tickets';
            $metadata['desc'] = 'Use AXIS Credit – Debit Cards & Get upto 7.5% discount on Domestic and International on all Airlines.';
            $metadata['keyword'] = 'Great Airline Deals by AXIS, Discount on airlines with AXIS Credit Card, Discount Coupon on Airlines by AXIS Bank, Low Airfare Promo code to AXIS bank Customers, Discount Promo Codes on Airline tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'jiomoney')) {
            $metadata['title'] = 'Jio Promo Codes for Airline Ticket';
            $metadata['desc'] = 'Use JIO Money & Get discount on Flights';
            $metadata['keyword'] = 'Discount Airline tickets on JIO, JIO Promo Codes for Cheap AirTickets, Discount Coupons for Cheap Domestic Airline Ticket, Flight tickets with Great Deals, Online Great Deals on Domestic Tickets + Airlines';
        } else if (strstr(Yii::app()->request->getUrl(), 'paytm')) {
            $metadata['title'] = 'Airticket Promo Offer on Paytm, Airline Promo code on Paytm, Cheap airtickets offer by Paytm, Discount airfare on Paytm';
            $metadata['desc'] = 'Paytm coupon code for air Tickets. Get Upto RS. 1000/- off.';
            $metadata['keyword'] = 'Airline tickets on Paytm, Paytm Promo Codes for Airlines CheapTickets, Coupon Code for Discounts on Domestic Air Ticket, Best Great Deals Air Tickets, Great Deals with Lowest airfares,';
        } else if (strstr(Yii::app()->request->getUrl(), 'payu')) {
            $metadata['title'] = 'Airticket Promo Offer on PayU, Airline Promo code on PayU, Cheap airtickets offer by PayU, Discount airfare on PayU';
            $metadata['desc'] = 'PayU coupon code for air Tickets. Get Upto RS. 1000/- off Guaranteed';
            $metadata['keyword'] = 'Airline tickets on PayU, PayU Promo Codes for Airlines CheapTickets, Coupon Code for Discounts on Domestic Air Ticket, Great Deals on AirTickets, Great Deals on Flights Tickets';
        } else if (strstr(Yii::app()->request->getUrl(), 'greatdeals')) {
            $metadata['title'] = 'Great Deals on Domestic/International Flights, Cheap Airticket Coupon codes for All';
            $metadata['desc'] = 'Great Deals For Paytm Users, Mobikwik Users, Payu Users, JioMoney Users, Axis Bank Users and ICICI Bank Users by Using CheapTicket.in Coupon Code';
            $metadata['keword'] = 'best deals on airfare, purchase Airtickets online';
        }
        return $metadata;
    }

}
