<?php

/**
 * Added By Satender
 * Purpose : To keep Payment Configuration at one place for whole Application
 */
class PaymentConfiguration {

    const ALL = -1;
    const CREDIT_CARD = 2;
    const DEBIT_CARD = 3;
    const NET_BANKING = 4;
    const WALLET = 5;
    const EMI = 6;
    const UPI = 7;
    //For Bank
    const AXIS = 1003;
    const BOB_CORP = 1045;
    const BOB_RETL = 1046;
    const BOI = 'BOIB';
    const BOM = 1033;
    const CANARA_NB = 1030;
    const CANARA_DC = 1034;
    const CATHOLIC_SYRIAN = 1031;
    const CBI = 1028;
    const CUB = 1020;
    const CITB_NB = 'CITNB';
    const CRPB = 1004;
    const DBS = 1047;
    const DCB_BUSSINESS = 1042;
    const DCB_PERSONAL = 1027;
    const DSHB = 1024;
    const DHLB = 1038;
    const FEDB = 1019;
    const HDFC = 'HDFB';
    const ICICI_NB = 'ICIB';
    const IDBI = 1007;
    const INDB = 1026;
    const INIB = 1015;
    const INOB = 1029;
    const JAKB = 1001;
    const KRKB = 1008;
    const KRVB = 1018;
    const KMHB = 1013;
    const LXMI_NB = 1009;
    const OBC = 1035;
    const PSBNB = 1055;
    const PNB_RETL = 1049;
    const RBS = 1050;
    const SARASWAT_BANK = 1053;
    const SCB = 1051;
    const SBBJB = 1023;
    const SBHB = 1017;
    const SBIB = 1014;
    const SBMB = 1021;
    const SBPB = 1036;
    const SBTB = 1025;
    const SOIB = 1022;
    const UBIB = 'UBIB';
    const UNIB = 1041;
    const VJYB = 1039;
    const YESB = 1005;
    const TMCB = 1044;
    const UNION_BANK = 1016;
    //CCAvenue
    const CCAVENUE_WALLET = 1100;
    // All Wallets
    const MOBIKWIK = 1001;
    const PAYTM = 1002;
    const IDEA_MONEY = 1003;
    const FREECHARGE = 1004;
    const OXIGEN = 1005;
    const SBI_BUDDY = 1006;
    const THE_MOBILE_WALLET = 1007;
    const JIOMONEY = 1008;
    const JANA_CASH = 1009;
    const ZIGGIT_BY_IDFC_BANK = 1010;
    const ICASH_CARD = 1011;
    //Currency Code
    const INDIANRUPEE = 'INR';

    static $ccavenueWalletList = [
    	self::MOBIKWIK => 'Mobikwik',
        self::IDEA_MONEY => 'Idea Money',
        self::FREECHARGE => 'FreeCharge',
        self::OXIGEN => 'oxigen',
        self::SBI_BUDDY => 'SBI Buddy',
        self::THE_MOBILE_WALLET => 'The Mobile Wallet',
        self::JIOMONEY => 'jioMoney',
        self::JANA_CASH => 'Jana Cash',
        self::ZIGGIT_BY_IDFC_BANK => 'Ziggit by IDFC Bank',
        self::ICASH_CARD => 'ICash Card'
    ];
    static $paymentTypeMap = [
        self::ALL => 'All',
        self::CREDIT_CARD => 'Credit Card',
        self::DEBIT_CARD => 'Debit Card',
        self::NET_BANKING => 'Net Banking',
        self::WALLET => 'Wallet',
        self::EMI => 'EMI',
        self::UPI => 'UPI',
    ];
    static $paymentSubTypeMap = [
        self::CREDIT_CARD => [
            self::ALL => 'All',
            CcType::TYPE_VISA => 'Visa',
            CcType::TYPE_MASTERCARD => 'Master',
            CcType::TYPE_AMEX => 'American Express',
            CcType::TYPE_DINERS_CLUB => 'Dinners Club',
        ],
        self::DEBIT_CARD => [
            self::ALL => 'All',
            CcType::TYPE_VISA => 'Visa',
            CcType::TYPE_MASTERCARD => 'Master',
            CcType::TYPE_RUPAY => 'RuPay',
        ],
        self::NET_BANKING => [
            self::ALL => 'All',
            self::AXIS => 'AXIS Bank',
            self::BOB_CORP => 'Bank of Baroda Corporate',
            self::BOB_RETL => 'Bank of Baroda Retail',
            self::BOI => 'Bank of India',
            self::BOM => 'Bank of Maharashtra',
            self::CANARA_NB => 'Canara Bank NetBanking',
            self::CANARA_DC => 'Canara Bank DebitCard',
            self::CATHOLIC_SYRIAN => 'Catholic Syrian Bank',
            self::CBI => 'Central Bank Of India',
            self::CUB => 'City Union Bank',
            self::CITB_NB => 'Citi Bank NetBanking',
            self::CRPB => 'Corporation Bank',
            self::DBS => 'DBS Bank Ltd',
            self::DCB_BUSSINESS => 'DCB BANK Business',
            self::DCB_PERSONAL => 'DCB BANK Personal',
            self::DSHB => 'Deutsche Bank',
            self::DHLB => 'Dhanlaxmi Bank',
            self::FEDB => 'Federal Bank',
            self::HDFC => 'HDFC Bank',
            self::ICICI_NB => 'ICICI Netbanking',
            self::IDBI => 'IDBI Bank',
            self::INDB => 'Indian Bank',
            self::INIB => 'IndusInd Bank',
            self::INOB => 'Indian Overseas Bank',
            self::JAKB => 'Jammu and Kashmir Bank',
            self::KRKB => 'Karnataka Bank',
            self::KRVB => 'Karur Vysya',
            self::KMHB => 'Kotak Mahindra Bank',
            self::LXMI_NB => 'Lakshmi Vilas Bank NetBanking',
            self::OBC => 'Oriental Bank Of Commerce',
            self::PSBNB => 'Punjab And Sind Bank',
            self::PNB_RETL => 'Punjab National Bank – Retail',
            self::RBS => 'Royal Bank Of Scotland',
            self::SARASWAT_BANK => 'SaraSwat Bank',
            self::SCB => 'Standard Chartered Bank',
            self::SBBJB => 'State Bank of Bikaner and Jaipur',
            self::SBHB => 'State Bank of Hyderabad',
            self::SBIB => 'State Bank of India',
            self::SBMB => 'State Bank of Mysore',
            self::SBPB => 'State Bank of Patiala',
            self::SBTB => 'State Bank of Travancore',
            self::SOIB => 'South Indian Bank',
            self::UBIB => 'Union Bank of India',
            self::UNIB => 'United Bank Of India',
            self::VJYB => 'Vijaya Bank',
            self::YESB => 'Yes Bank',
            self::TMCB => 'Tamilnad Mercantile Bank',
            self::UNION_BANK => 'Union Bank',
        ],
        self::WALLET => [
            self::ALL => 'All',
            self::MOBIKWIK => 'MobiKwik',
            self::PAYTM => 'PayTM',
            self::IDEA_MONEY => 'Idea Money',
            self::FREECHARGE => 'FreeCharge',
            self::OXIGEN => 'oxigen',
            self::SBI_BUDDY => 'SBI Buddy',
            self::THE_MOBILE_WALLET => 'The Mobile Wallet',
            self::JIOMONEY => 'jioMoney',
            self::JANA_CASH => 'Jana Cash',
            self::ZIGGIT_BY_IDFC_BANK => 'Ziggit by IDFC Bank',
            self::ICASH_CARD => 'ICash Card'
        ],
        self::EMI => [
            self::ALL => 'All',
            CcType::TYPE_VISA => 'Visa',
            CcType::TYPE_MASTERCARD => 'Master',
            CcType::TYPE_AMEX => 'American Express',
            CcType::TYPE_DINERS_CLUB => 'Dinners Club',
        ],
        self::UPI => [
            self::ALL => 'All',
        ],
    ];
    static $paymentTypeMapUI = [
        'amex' => CcType::TYPE_AMEX,
        'visa' => CcType::TYPE_VISA,
        'mastercard' => CcType::TYPE_MASTERCARD,
        'dinersclub' => CcType::TYPE_DINERS_CLUB,
        'rupay' => CcType::TYPE_RUPAY,
    ];

}
