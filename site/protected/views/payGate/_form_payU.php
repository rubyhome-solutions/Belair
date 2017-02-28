<?php
/* @var $this PayGateController */
/* @var $model PayGateLog */
$totalAmount = $model->amount + $model->convince_fee;
$emi3 = new Amort($totalAmount, 12, 0.25);
$emi6 = new Amort($totalAmount, 12, 0.5);
$emi9 = new Amort($totalAmount, 12, 0.75);
$emi12 = new Amort($totalAmount, 12, 1);
$emi24 = new Amort($totalAmount, 12, 2);

$ecc = new ECCValidator2;
?>
<style type="text/css">
    *{padding:0;margin:0;list-style:none;text-decoration:none;color:#3d3d3d;-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;}
    #wrapper{overflow:auto;padding:10px;}
    #TabContainer{width:25%;float:left;}
    #tabs{width:90%;}
    #tabs li{margin:10px 0;position:relative;}
    #tabs li a{padding:15px 0px 15px 15px;text-align:left;width:100%;display:block;border:1px solid #AAA;border-right:none;font-size:16px;background:#e3e3e3;}
    #tabs li a:hover{background:#AAA;}
    #tabs li span.white{background:#FFF;position:absolute;display:none;width:2px;height:49px;position:absolute;top:1px;right:-2px;}
    #tabs li.sel a{background:#FFF;color:#3d3d3d;}
    #tabs li.sel a:hover{background:#FFF;}
    #tabs li.sel .white{display:block;}
    #currencyContainer{float:left;border-left:1px solid #AAA;padding:0px 10px 10px 20px;margin-left:-9px;margin-top:10px;max-width:30%;}
    #CardConatiner{float:left;width:40%;border-left:1px solid #AAA;padding:0px 10px 10px 20px;margin-left:-4px;margin-top:10px;}
    #CardConatiner .page{margin-top:10px;display:none;min-height:315px;}
    #CardConatiner .page .form{padding:10px;overflow:auto;}
    #CardConatiner .page .form .row{width:100%;margin:5px 0 15px 0;overflow:auto;}
    #CardConatiner .page .form .row .one{position:relative;}
    #CardConatiner .page .form .row .textbox{width:96.5%;padding:5px;font-size:14px;border:1px solid #AAA;height:30px;}
    #CardConatiner .page .form .row .textbox:hover, #CardConatiner .page .form .row .textbox:focus{border-color:#3d3d3d;}
    #CardConatiner .page .form .row label{font-size:12px;margin-bottom:5px;display:block;font-weight:bold;}
    #CardConatiner .page .form .row select.textbox option{padding:5px;}
    #CardConatiner .page .form .row .three{float:left;width:33.33%;}
    #CardConatiner .page .form .row .three .textbox{width:89%;}
    #CardConatiner .page .form .row .two{float:left;width:50%}
    #CardConatiner .page .form .row .two .textbox{width:93%;}
    #CardConatiner .page .form .row .two .textbox.captcha{width:40%;float:left;}
    #CardConatiner .page .form .row_new{width:100%;margin:5px 0 15px 0;}
    #CardConatiner .page .form .row_new label{font-size:12px;margin-bottom:5px;display:block;font-weight:bold;}
    .error{border-color:#bf0303 !important;background:#fdc6c6;color:#bf0303;}
    .drop_down{padding:5px;border:1px solid #AAA;font-size:14px;width:96.6%;cursor:pointer;position:relative;}
    .drop_down:hover{border-color:#3d3d3d;}
    .dp_arrow{width: 0px;height: 0px;border-style: solid;border-width: 6px 6px 0 6px;border-color: #3d3d3d transparent transparent transparent;position:absolute;top:11px;right:6px;}
    .dp_content{position:absolute;top:30px;left:0px;width:100%;background:#FFF;border:1px solid #AAA;display:none;max-height:150px;overflow:auto;z-index:9999;}
    .dp_content li{padding:5px;font-size:14px;}
    .dp_content li.sel{background:#e3e3e3;}
    .dp_content li:hover{background:#AAA;}
    .help_link{color:#093a82;font-weight:bold;}
    .card_label{margin-top:10px;}
    .checkbox span{cursor:pointer;font-size:14px;}
    .checkbox .mark{padding:0px 3px;float:left;display:block;border:1px solid #17ae03;color:#FFF;margin-right:5px;font-size:10px;}
    .checkbox.checked .mark{background:#17ae03;}
    .message{border:1px solid #AAA;background:#EEE;padding:10px;color:#3d3d3d;width:96.6%;}
    .button{padding:5px 8px;color:#FFF;background:#17ae03;outline:none;border:1px solid #17ae03;cursor:pointer;font-size:14px;}
    .button:hover{background:#1cca05;}
    .icon{position:absolute;right:5%;top:29px;display:block;width:32px;height:22px;}
    .visa{background:url(<?php echo $ecc->assetsImages . ECCValidator2::$cardSmallImages[ECCValidator2::VISA]; ?>) no-repeat center center;}
    .mastercard{background:url(<?php echo $ecc->assetsImages . ECCValidator2::$cardSmallImages[ECCValidator2::MASTERCARD]; ?>) no-repeat center center;}
    .maestro{background:url(<?php echo $ecc->assetsImages . ECCValidator2::$cardSmallImages[ECCValidator2::MAESTRO]; ?>) no-repeat center center;}
    .amex{background:url(<?php echo $ecc->assetsImages . ECCValidator2::$cardSmallImages[ECCValidator2::AMERICAN_EXPRESS]; ?>) no-repeat center center;}
    .diners{background:url(<?php echo $ecc->assetsImages . ECCValidator2::$cardSmallImages[ECCValidator2::DINERS_CLUB]; ?>) no-repeat center center;}
    .card{background:url(https://static.payu.in/images/mobile_default/icons/card_off.gif) no-repeat center center;}
    .HideCvvExpiry, .ShowCvvExpiry{cursor:pointer;display:none;}
    .HideCvvExpiry:hover, .ShowCvvExpiry:hover{border-color:#3d3d3d;}
    .disable{background:#AAA !important;border-color:#3d3d3d !important;}
    .hidden{display:none;}
    #CaptchaDiv{float:left;margin-left:10px;width:50%;}
    #CaptchaDiv span{float:left;margin-right:10px;width:68%;text-align:center;cursor:default;display:inline-block;padding:5px;border:1px solid #AAA;background:#EEE;color:#3d3d3d;font-size:15px;font-weight:bold;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;}
    #CaptchaDiv a{background:#17ae03;border:1px solid #17ae03;padding:3px 5px;font-size:18px;color:#FFF;float:left;}
    .ErrorMessage{border:1px solid #bf0303 !important;background:#fdc6c6;color:#bf0303;padding:5px;width:96.5%;margin:5px 0 0 0px;display:none;}
    .left{float:left;}
    #PopupBox{display:none;width:550px;height:445px;border:10px solid #AAA;margin:auto;overflow:auto;position:absolute;z-index:99999999;background:#FFF;top:0;right:0;left:0;bottom:0;}
    #LearnMoreList{padding:10px;}
    #LearnMoreList li{float:left;width:45%;overflow:auto;margin:10px 10px;}
    #LearnMoreList li img{margin:10px;}
    #LearnMoreList h6{font-size:14px;margin-bottom:5px;}
    #LearnMoreList p{padding:none;margin:none;}
    #PopupBox h2{background:#f2f2f2 url(https://test.payu.in/images/lock.gif) no-repeat 10px center;padding:20px 0 20px 60px;}
    #PopupBox p{padding:10px;}
    #PopupBox p a{color:#093a82;font-weight:bold;}
    #PopupBox .save_card{padding:10px;}
    #secure_logo{width:100%;text-align:left;}
    #secure_logo li{display:inline-block;background:url(https://static.payu.in/images/mobile_default/all_logo.gif) no-repeat;border:1px solid #e9e9e9;height:33px;background-repeat:no-repeat;}
    #secure_logo li a{display:block;height:33px}
    #secure_logo li.visa{background-position:-86px 0;width:52px}
    #secure_logo li.visa a{width:52px}
    #secure_logo li.master{background-position:-140px 0;width:81px}
    #secure_logo li.master a{width:81px}
    #secure_logo li.verisign{background-position:-224px 0;width:63px}
    #secure_logo li.verisign a{width:63px}
    #secure_logo li.pci{background-position:-287px 0;width:95px}
    #secure_logo li.pci a{width:95px}
    .StoreCardUl{padding:0 0 5px 0;overflow:auto;}
    .StoreCardUl li{clear:both;overflow:auto;padding:10px 0 10px 10px;border-bottom:1px solid #DDD;}
    .StoreCardUl li.store_card_selector{border-bottom:1px solid #DDD;}
    .StoreCardUl li.use_new_card{background:#EEE;}
    .StoreCardUl li.use_new_card .radio{margin:0 10px 0 0;}
    .StoreCardUl li.use_new_card{font-weight:bold;}
    .StoreCardUl .radio{float:left;margin-top:5px;margin-right:10px;}
    .StoreCardUl div{display:inline-block;float:left;}
    .StoreCardUl div.store_card_icon{padding:3px 10px;border:1px solid #AAA;background:#EEE;margin-right:10px;}
    .StoreCardUl div.store_card_icon span{display:block;width:32px;height:22px;}
    .StoreCardUl div.store_card_label{font-size:16px;font-weight:normal;margin-right:10px;}
    .StoreCardUl div.store_card_label span{font-size:12px;display:block;margin-top: 5px;}
    .StoreCardUl div .textbox{padding:8px;border:1px solid #AAA;font-size:14px;width:50px;margin-bottom:auto;}
    .StoreCardUl .remove_store_card{float:right;padding:5px 5px 5px 25px;background:url(https://static.payu.in/images/mobile_default/icons/error_icon.png) no-repeat 4px center;border:1px solid #DDD;background-color: antiquewhite;border-radius:10px;}
    .StoreCardUl .remove_store_card:hover{background-color:pink;}
    .StoreCardUl .cvv_optional{display:none;font-size:10px;margin-left:5px;}
    .StoreCardUl .cvv_div{margin-top: 5px;}
    .new_card_form{display:none;}
</style>
<form id="mainForm" method="POST">
    <input type="hidden" id="Category" name="Category" />
    <input type="hidden" id="IbiboCode" name="IbiboCode" />
    <input type="hidden" id="StoreCard" value="true" name="store_card"/>
    <input type="hidden" id="StoredCard" value="false" />
    <input type="password" style="display:none" />
    <div id="wrapper">
        <div id="TabContainer">
            <ul id="tabs">
                <li class="creditcard" style="display: <?php echo isset($hide['creditcard']) ? 'none' : 'block'; ?>;"><a href="#CreditCard" visible="true" category="creditcard" default-ibibo-code="CC">Credit Card</a><span class="white"></span></li>
                <li class="debitcard" style="display: <?php echo isset($hide['debitcard']) ? 'none' : 'block'; ?>;"><a href="#DebitCard" category="debitcard" default-ibibo-code="VISA">Debit Card</a><span class="white"></li>
                <li class="emi" style="display: <?php echo isset($hide['emi']) ? 'none' : 'block'; ?>;"><a href="#EMI" category="emi" default-ibibo-code="">EMI</a><span class="white"></li>
                <li class="netbanking" style="display: <?php echo isset($hide['netbanking']) ? 'none' : 'block'; ?>;"><a href="#NetBanking" category="netbanking" default-ibibo-code="">Net Banking</a><span class="white"></li>
                <li class="cashcard" style="display: <?php echo isset($hide['cashcard']) ? 'none' : 'block'; ?>;"><a href="#CashCard" category="cashcard" default-ibibo-code="">Cash Card</a><span class="white"></li>
            </ul>
        </div>
        <div id="CardConatiner">
            <p class="we_accept_img"><img src="https://www.goibibo.com/images/v2/payu/cards_2.jpg" alt="Accpeted Payment Methods"/></p>
            <div class="page" id="CreditCard">
                <div class="form" id="CreditCardForm">
                    <div class="row_new" id="StoredCreditCardContainer">
                        <div class="one">
                            <label>Select Stored Card</label>
                            <ul id="StoredCreditCards" class="StoreCardUl">
                                <li class="use_new_card">
                                    <input type="radio" name="store_card_radio" token="0" class="radio store_card_radio" value="1" />
                                    <div>Use New Card</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="new_card_form">
                        <p class="ErrorMessage">This is error message</p>
                        <div class="row">
                            <div class="one">
                                <label>Card Number</label>
                                <input type="text" class="textbox validate" validate="card_number" maxlength="19" name="card_number" placeholder="Card Number" />
                                <span class="icon"></span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="one">
                                <label>Name on Card</label>
                                <input type="text" class="textbox validate"  validate="name_on_card" name="name_on_card" placeholder="Name on Card" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="three">
                                <label>Expiry Month</label>
                                <div class="textbox ExpiryMonthLabel hidden">XX</div>
                                <select class="ExpiryMonth textbox validate" validate="expiry_month" name="expiry_month">
                                    <option value="">Month</option>
                                    <option value="01">Jan (01)</option>
                                    <option value="02">Feb (02)</option>
                                    <option value="03">Mar (03)</option>
                                    <option value="04">Apr (04)</option>
                                    <option value="05">May (05)</option>
                                    <option value="06">Jun (06)</option>
                                    <option value="07">Jul (07)</option>
                                    <option value="08">Aug (08)</option>
                                    <option value="09">Sep (09)</option>
                                    <option value="10">Oct (10)</option>
                                    <option value="11">Nov (11)</option>
                                    <option value="12">Dec (12)</option>
                                </select>
                            </div>
                            <div class="three">
                                <label>Expiry Year</label>
                                <div class="textbox ExpiryYearLabel hidden">XXXX</div>
                                <select class="ExpiryYear textbox validate" validate="expiry_year" name="expiry_year">
                                    <option value="">Year</option>
                                </select>
                            </div>
                            <div class="three">
                                <label>CVV</label>
                                <input type="password" class="textbox validate" validate="cvv" placeholder="CVV" maxlength="3" name="cvv" autocomplete="off" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="one">
                                <p class="HideCvvExpiry message">
                                    <b>Click Here</b> if you don't have CVV and Expiry
                                </p>
                                <p class="ShowCvvExpiry message">
                                    <b>Click Here</b> if you have CVV and Expiry
                                </p>
                            </div>
                        </div>
                        <div class="row StoreCardRow">
                            <div class="one">
                                <div class="checkbox checked" data-callback="toggle_card_label"><span class="mark">✔</span><span>Store this card for future transactions</span> <a href="javascript:void(0);" class="help_link">Learn More</a></div>
                                <!--                                <div class="card_label">
                                                                    <label>Card Label</label>
                                                                    <input type="text" class="textbox validate" name="store_card_label" validate="card_label" placeholder="Card Label" />
                                                                </div>-->
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="one">
                            <input type="submit" value="Make Payment" class="button" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="page" id="DebitCard">
                <div class="form" id="DebitCardForm">
                    <div class="row_new" id="StoredDebitCardContainer">
                        <div class="one">
                            <label>Select Stored Card</label>
                            <ul id="StoredDebitCards" class="StoreCardUl">
                                <li class="use_new_card">
                                    <input type="radio" name="store_card_radio" token="0" class="radio store_card_radio" value="1" />
                                    <div>Use New Card</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="new_card_form">
                        <p class="ErrorMessage">This is error message</p>
                        <div class="row">
                            <div class="one">
                                <label>Card Number</label>
                                <input type="text" class="textbox validate" validate="card_number" maxlength="19" name="card_number" placeholder="Card Number" />
                                <span class="icon"></span>
                            </div>
                        </div>
                        <div class="row">
                            <div class="one">
                                <label>Name on Card</label>
                                <input type="text" class="textbox validate"  validate="name_on_card" name="name_on_card" placeholder="Name on Card" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="three">
                                <label>Expiry Month</label>
                                <div class="textbox ExpiryMonthLabel hidden">XX</div>
                                <select class="ExpiryMonth textbox validate" validate="expiry_month" name="expiry_month">
                                    <option value="">Month</option>
                                    <option value="01">Jan (01)</option>
                                    <option value="02">Feb (02)</option>
                                    <option value="03">Mar (03)</option>
                                    <option value="04">Apr (04)</option>
                                    <option value="05">May (05)</option>
                                    <option value="06">Jun (06)</option>
                                    <option value="07">Jul (07)</option>
                                    <option value="08">Aug (08)</option>
                                    <option value="09">Sep (09)</option>
                                    <option value="10">Oct (10)</option>
                                    <option value="11">Nov (11)</option>
                                    <option value="12">Dec (12)</option>
                                </select>
                            </div>
                            <div class="three">
                                <label>Expiry Year</label>
                                <div class="textbox ExpiryYearLabel hidden">XXXX</div>
                                <select class="ExpiryYear textbox validate" validate="expiry_year" name="expiry_year">
                                    <option value="">Year</option>
                                </select>
                            </div>
                            <div class="three">
                                <label>CVV</label>
                                <input type="password" class="textbox validate" validate="cvv" placeholder="CVV" maxlength="3" name="cvv" autocomplete="off" />
                            </div>
                        </div>
                        <div class="row">
                            <div class="one">
                                <p class="HideCvvExpiry message">
                                    <b>Click Here</b> if you don't have CVV and Expiry
                                </p>
                                <p class="ShowCvvExpiry message">
                                    <b>Click Here</b> if you have CVV and Expiry
                                </p>
                            </div>
                        </div>
                        <div class="row StoreCardRow">
                            <div class="one">
                                <div class="checkbox checked" data-callback="toggle_card_label"><span class="mark">✔</span><span>Store this card for future transactions</span> <a href="javascript:void(0);" class="help_link">Learn More</a></div>
                                <!--                                <div class="card_label">
                                                                    <label>Card Label</label>
                                                                    <input type="text" class="textbox validate" name="store_card_label" validate="card_label" placeholder="Card Label" />
                                                                </div>-->
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="one">
                            <input type="submit" value="Make Payment" class="button" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="page" id="EMI">
                <div class="form" id="EmiForm">
                    <div class="row">
                        <div class="one">
                            <label>Select Your Bank</label>
                            <select name="emi_bank" class="textbox validate" validate="emi_bank" id="EmiBankSelectBox">
                                <option value="CITI" pg_code="20">CITI Bank</option>
                                <option value="HDFC" pg_code="20">HDFC Bank</option>
                                <option value="AXIS" pg_code="20">AXIS Bank</option>
                                <option value="ICICI" pg_code="20">ICICI Bank</option>
                                <option value="KOTAK" pg_code="20">KOTAK Bank</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="one">
                            <label>Select EMI Duration</label>
                            <select name="emi_duration" class="textbox validate" validate="emi_duration" id="EmiDurationSelectBox">
                                <option value="">Select Duration</option>
                                <option value="EMI03">3 months</option>
                                <option value="EMI06">6 months</option>
                                <option value="EMI09">9 months</option>
                                <option value="EMI12">12 months</option>
                                <option value="EMI24">24 months</option>
                            </select>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>EMI Plan</th>
                                        <th>Installment</th>
                                        <th>Interest</th>
                                        <th>EMI amount</th>
                                        <th>Cost</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>3 Mnt</td>
                                        <td><?php echo $emi3->getMonthlyPayment(); ?></td>
                                        <td><?php echo $emi3->getTotalInterest(); ?></td>
                                        <td><?php echo $totalAmount; ?></td>
                                        <td><?php echo $emi3->getTotalPayment(); ?></td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td>6 Mnt</td>
                                        <td><?php echo $emi6->getMonthlyPayment(); ?></td>
                                        <td><?php echo $emi6->getTotalInterest(); ?></td>
                                        <td><?php echo $totalAmount; ?></td>
                                        <td><?php echo $emi6->getTotalPayment(); ?></td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td>9 Mnt</td>
                                        <td><?php echo $emi9->getMonthlyPayment(); ?></td>
                                        <td><?php echo $emi9->getTotalInterest(); ?></td>
                                        <td><?php echo $totalAmount; ?></td>
                                        <td><?php echo $emi9->getTotalPayment(); ?></td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td>12 Mnt</td>
                                        <td><?php echo $emi12->getMonthlyPayment(); ?></td>
                                        <td><?php echo $emi12->getTotalInterest(); ?></td>
                                        <td><?php echo $totalAmount; ?></td>
                                        <td><?php echo $emi12->getTotalPayment(); ?></td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    <tr>
                                        <td>24 Mnt</td>
                                        <td><?php echo $emi24->getMonthlyPayment(); ?></td>
                                        <td><?php echo $emi24->getTotalInterest(); ?></td>
                                        <td><?php echo $totalAmount; ?></td>
                                        <td><?php echo $emi24->getTotalPayment(); ?></td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </div>
                    <!--                    <div id="EmiCardContainer" style="display:none;">
                                            <div class="row_new" id="StoredEmiCardContainer">
                                                <div class="one">
                                                    <label>Select Stored Card</label>
                                                    <ul id="StoredEmiCards" class="StoreCardUl">
                                                        <li class="use_new_card">
                                                            <input type="radio" name="store_card_radio" token="0" class="radio store_card_radio" value="1" />
                                                            <div>Use New Card</div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="new_card_form">
                                                <div class="row">
                                                    <div class="one">
                                                        <label>Card Number</label>
                                                        <input type="text" class="textbox validate" validate="card_number" maxlength="19" name="card_number" placeholder="Card Number" />
                                                        <span class="icon"></span>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="one">
                                                        <label>Name on Card</label>
                                                        <input type="text" class="textbox validate"  validate="name_on_card" name="name_on_card" placeholder="Name on Card" />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="three">
                                                        <label>Expiry Month</label>
                                                        <div class="textbox ExpiryMonthLabel hidden">XX</div>
                                                        <select class="ExpiryMonth textbox validate" validate="expiry_month" name="expiry_month">
                                                            <option value="">Month</option>
                                                            <option value="01">Jan (01)</option>
                                                            <option value="02">Feb (02)</option>
                                                            <option value="03">Mar (03)</option>
                                                            <option value="04">Apr (04)</option>
                                                            <option value="05">May (05)</option>
                                                            <option value="06">Jun (06)</option>
                                                            <option value="07">Jul (07)</option>
                                                            <option value="08">Aug (08)</option>
                                                            <option value="09">Sep (09)</option>
                                                            <option value="10">Oct (10)</option>
                                                            <option value="11">Nov (11)</option>
                                                            <option value="12">Dec (12)</option>
                                                        </select>
                                                    </div>
                                                    <div class="three">
                                                        <label>Expiry Year</label>
                                                        <div class="textbox ExpiryYearLabel hidden">XXXX</div>
                                                        <select class="ExpiryYear textbox validate" validate="expiry_year" name="expiry_year">
                                                            <option value="">Year</option>
                                                        </select>
                                                    </div>
                                                    <div class="three">
                                                        <label>CVV</label>
                                                        <input type="password" class="textbox validate" validate="cvv" placeholder="CVV" maxlength="3" name="cvv" autocomplete="off" />
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="one">
                                                        <p class="HideCvvExpiry message">
                                                            <b>Click Here</b> if you don't have CVV and Expiry
                                                        </p>
                                                        <p class="ShowCvvExpiry message">
                                                            <b>Click Here</b> if you have CVV and Expiry
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>-->
                    <div class="row">
                        <div class="one">
                            <input type="submit" value="Make Payment" class="button" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="page" id="NetBanking">
                <div class="form" id="NetBankingForm">
                    <div class="row">
                        <div class="one">
                            <label>Select Your Bank</label>
                            <select name="net_banking" class="textbox validate" validate="net_banking" id="NetBankingSelectBox">
                                <option value="">Select Your Bank</option>
                                <option value="AXIB">AXIS Bank NetBanking</option>
                                <option value="BOIB">Bank of India</option>
                                <option value="BOMB">Bank of Maharashtra</option>
                                <option value="CBIB">Central Bank Of India</option>
                                <option value="CRPB">Corporation Bank</option>
                                <option value="DCBB">Development Credit Bank</option>
                                <option value="FEDB">Federal Bank</option>
                                <option value="HDFB">HDFC Bank</option>
                                <!--<option value="ICIB">ICICI Netbanking</option>-->
                                <option value="IDBB">Industrial Development Bank of India</option>
                                <option value="INDB">Indian Bank </option>
                                <option value="INIB">IndusInd Bank</option>
                                <option value="INOB">Indian Overseas Bank</option>
                                <option value="JAKB">Jammu and Kashmir Bank</option>
                                <option value="KRKB">Karnataka Bank</option>
                                <option value="KRVB">Karur Vysya </option>
                                <option value="PSBNB">Punjab And Sind Bank</option>
                                <option value="SBBJB">State Bank of Bikaner and Jaipur</option>
                                <option value="SBHB">State Bank of Hyderabad</option>
                                <option value="SBIB">State Bank of India</option>
                                <option value="SBMB">State Bank of Mysore</option>
                                <option value="SBTB">State Bank of Travancore</option>
                                <option value="SOIB">South Indian Bank</option>
                                <option value="UBIB">Union Bank of India</option>
                                <option value="UNIB">United Bank Of India</option>
                                <option value="VJYB">Vijaya Bank</option>
                                <option value="YESB">Yes Bank</option>
                                <option value="CUBB">CityUnion</option>
                                <option value="CABB">Canara Bank</option>
                                <option value="SBPB">State Bank of Patiala</option>
                                <option value="CITNB">Citi Bank NetBanking</option>
                                <option value="DSHB">Deutsche Bank</option>
                                <option value="162B">Kotak Bank</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="one">
                            <input type="submit" value="Make Payment" class="button" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="page" id="CashCard">
                <div class="form" id="CashCardForm">
                    <div class="row">
                        <div class="one">
                            <label>Select Your Cash Card</label>
                            <select name="cash_card" class="textbox validate" validate="cash_card" id="CashCardSelectBox">
                                <option value="">Select Your Cash Card</option>
                                <option value="AMON">Airtel Money</option>
                                <option value="ITZC">ItzCash</option>
                                <option value="YPAY">YPay Cash</option>
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="one">
                            <input type="submit" value="Make Payment" class="button" />
                        </div>
                    </div>
                </div>
            </div>
            <p class="">
            <ul id="secure_logo">
                <li class="visa"><a url="https://usa.visa.com/personal/security/vbv/index.html?ep=v_sym_/verified" href="javascript:void(0);"></a></li>
                <li class="master"><a url="http://www.mastercard.com/us/business/en/corporate/securecode/sc_popup.html?language=en" href="javascript:void(0);"></a></li>
                <li class="verisign"><a url="https://seal.verisign.com/splash?form_file=fdf/splash.fdf&dn=www.payu.in&lang=en" href="javascript:void(0);"></a></li>
                <li class="pci"><a url="http://seal.controlcase.com/index.php?page=showCert&cId=3877025869" href="javascript:void(0);"></a></li>
            </ul>
            </p>
        </div>
        <div id="currencyContainer">
            <?php
            echo TbHtml::activeDropDownList($model, 'currency_id', CHtml::listData(\Currency::model()->findall(['order' => 'id']), 'id', 'codeAndName'), [
//                'disabled' => !in_array($model->pg_id, \PaymentGateway::$zoozIdList),
                'style' => 'width:96%',
                'onchange' => 'js:currencyChange($(this).val())'
            ]);
            ?>
            <p class="message" id="currencyBox">
                Currency: <b><?php echo $model->currency->name; ?></b><br>
                Amount: &nbsp;<b><?php echo "$totalAmount</b>" . ($model->convince_fee ? "&nbsp<br>(<small>A convenience fee of $model->convince_fee is added</small>) " : ''); ?>
            </p>
            <p class="message">
                <b>Note:</b> After clicking the "Make Payment" button you might be taken to your bank's website for 3D secure authentication.
            </p>
        </div>
    </div>
    <!--<div id="CaptchaDiv"><span></span></div>-->
    <div id="PopupBox">
        <h2>It is safe and secure!</h2>
        <ul id="LearnMoreList">
            <li><img class="left" alt="" src="https://static.payu.in/images/protection_icon.gif">
                <h6>Hardware protection. </h6>
                <p>A specialised hardware is used to keep your data safe in a encrypted format. Very few companies do it globally since this hardware is very expensive and we are the first one's in India.</p>
            </li>
            <li><img class="left" alt="" src="https://static.payu.in/images/password_stored.gif">
                <h6>No password stored.</h6>
                <p>There is nothing to worry about. And we only store your card number and expiry date. CVV or your password is not stored. You would need to enter that every time whenever you have to do a transaction.</p>
            </li>
            <li><img class="left" alt="" src="https://static.payu.in/images/secure.gif">
                <h6>Secure</h6>
                <p>We are one of the very few companies who use this level of protection.</p>
            </li>
            <li><img class="left" alt="" src="https://static.payu.in/images/control_icon.gif">
                <h6>You are in control.</h6>
                <p>You can always check, edit or completely remove any information you have given us.</p>
            </li>
        </ul>
        <p>For any further information, we are glad to assist at <a href="mailto:support@belair.in">support@belair.in</a></p>
        <div class="save_card">
            <input type="button" value="Ok" class="button active" id="LearnMoreOkButton" />
        </div>
    </div>
</body>
<script type="text/javascript">
    function defer() {
        if (window.jQuery)
            runWhenReady();
        else
            setTimeout(defer, 50);
    }

    var date = new Date();
    var VaidationRegex = {numbers: /^[0-9]+$/i, address: /^[a-z0-9\.\-\/ ]+$/i, name: /^[a-z ]+$/i, name_on_card: /^[a-z0-9\.\- ]+$/i, card_number: /^\d+$/, cvv: /^(?!000)\d{3}$/, cvv4: /^(?!000)\d{4}$/}; //, card_label: /^[a-z0-9_ ]*$/i};
    var CardTypes = [{name: "amex", pattern: /^(34|37)/, valid_length: [15], ibibocode: "AMEX"}, {name: "diners", pattern: /^(30|36|38)/, valid_length: [14], ibibocode: "DINR"}, {name: "visa", pattern: /^4/, valid_length: [16], ibibocode: "VISA"}, {name: "mastercard", pattern: /^5[1-5]/, valid_length: [16], ibibocode: "MAST"}, {name: "maestro", pattern: /^(50|63|66|5[6-8]|6[8-9]|600[0-9]|6010|601[2-9]|60[2-9]|61|620|621|6220|6221[0-1])/, valid_length: [12, 13, 14, 15, 16, 17, 18, 19], ibibocode: "MAES"}];
<?php
$out = [];
$userInfoId = \Utils::getActiveCompanyId();
if ($userInfoId) {
    $criteria = new CDbCriteria;
    $criteria->order = 't.id DESC';
    $ccs = \Cc::model()->findAll([
        'condition' => 'user_info_id = :user_info_id AND deleted=0',
        'order' => 'id',
        'params' => [':user_info_id' => $userInfoId]
    ]);
    foreach ($ccs as $cc) {
        $out[$cc->id] = [
            'card_mode' => "CC",
            'card_token' => $cc->id,
            'card_brand' => \CcType::$ccTypeIdToPauyName[$cc->type_id],
            'card_name' => "",
            'card_no' => $cc->mask
        ];
    }
}
echo "var StoredCards = " . json_encode($out) . ";";
?>
    var StoredCardCC = 0;
    var StoredCardDC = 0;
    var SbiBinList = ["504435", "504645", "504774", "504775", "504809", "504993", "600206", "603845", "622018"];
    var CurrentCapta = null;
    FormError = false;
    var getCaptcha = function () {
        var chars = "0Aa1Bb2Cc3Dd4Ee5Ff6Gg7Hh8Ii9Jj0Kk1Ll2Mm3Nn4Oo5Pp6Qq7Rr8Ss9Tt0Uu1Vv2Ww3Xx4Yy5Zz";
        var string_length = 5;
        var cstring = '';
        for (var i = 0; i < string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            cstring += chars.substring(rnum, rnum + 1);
        }
        return cstring;
    };

//    $(document).ready(function () {
//    document.addEventListener('DOMContentLoaded', function runWhenReady() {
    function runWhenReady() {
        $(document).on("click", ".store_card_radio", function (e) {
            // $(".store_card_radio").live("click", function (e) {
            var ct = $(this).attr('token');
            var Form = $(this).parents(".form");
            var SelectedCard = $(this).parents('.store_card_selector');
            var Cat = $("#Category").val();
            Form.find(".ShowCvvExpiry, .HideCvvExpiry");
            Form.find('input, select').removeClass("error");
            $("#StoredCard").val(false).removeAttr("token");
            if (ct != '0') {
                var CurrentCard = StoredCards[ct];
                Form.find('input, select').removeClass("validate");
                Form.find('.store_card_cvv').removeAttr('name');
                SelectedCard.find(".store_card_cvv").addClass('validate').attr('name', 's_cvv');
                Form.find(".new_card_form").fadeOut('fast');
                if (CurrentCard.card_brand == "MAESTRO") {
                    SelectedCard.find('.store_card_cvv').removeClass("validate");
                    SelectedCard.find('.cvv_optional').css('display', 'block');
                } else {
                    SelectedCard.find('.store_card_cvv').addClass("validate");
                    SelectedCard.find('.cvv_optional').css('display', 'none');
                }
                $("#StoredCard").val(true).attr("token", CurrentCard.card_token);
                if (Cat != 'emi') {
                    $("#IbiboCode").val(CurrentCard.card_type);
                }
            } else {
                Form.find("input[type='text'], select").not('.store_card_cvv').addClass("validate");
                Form.find(".store_card_cvv").removeClass('validate');
                Form.find(".new_card_form").fadeIn('fast');
            }
        });
        $("#secure_logo a").click(function () {
            top[0].open($(this).attr("url"), "_blank", "toolbar=0,scrollbars=1,resizable=1,width=550,height=500");
            return false;
        });
        CurrentCapta = getCaptcha();
        $("#CaptchaDiv span").text(CurrentCapta);
        $("#StoredCreditCardContainer").hide();
        $("#StoredEmiCardContainer").hide();
        $("#StoredDebitCardContainer").hide();
        $("#CaptchaDiv a").click(function () {
            CurrentCapta = getCaptcha();
            $("#CaptchaDiv span").text(CurrentCapta);
        });
        $("#tabs li a").click(function () {
            ResetAll();
            $('.page').hide();
            $("#tabs li").removeClass('sel');
            $(this).parents('li').addClass('sel');
            $($(this).attr('href')).fadeIn();
            $("#Category").val($(this).attr('category'));
            $("#IbiboCode").val($(this).attr('default-ibibo-code'));
            return false;
        });
        if (StoredCards != null && !$.isEmptyObject(StoredCards)) {
            var ccHTML = "";
            var dcHTML = "";
            var html = $("#StoreCardLiTemplate").html();
            $.each(StoredCards, function (Token, CardObj) {
                var fr = {
                    find: ['{{token}}', '{{brand}}', '{{card_name}}', '{{card_number}}', '{{cvv_max}}', '{{cvv_validate}}'],
                    replace_all: [CardObj.card_token, CardObj.card_brand.toLowerCase(), CardObj.card_name, CardObj.card_no, 3, 'cvv'],
                    replace_amex: [CardObj.card_token, CardObj.card_brand.toLowerCase(), CardObj.card_name, CardObj.card_no, 4, 'cvv4']
                };
                StoredCardCC++;
                StoredCardDC++;
                if (CardObj.card_brand == 'AMEX') {
                    ccHTML += html.replaceArray(fr.find, fr.replace_amex);
                    dcHTML += html.replaceArray(fr.find, fr.replace_amex);
                } else {
                    ccHTML += html.replaceArray(fr.find, fr.replace_all);
                    dcHTML += html.replaceArray(fr.find, fr.replace_all);
                }
            });
        }
        if (StoredCardCC > 0) {
            $("#StoredCreditCards").prepend(ccHTML);
            $("#StoredEmiCards").prepend(ccHTML);
            $("#StoredCreditCardContainer").show();
            $("#StoredEmiCardContainer").show();
        } else {
            $("#CreditCardForm .new_card_form").show();
            $("#EmiForm .new_card_form").show();
        }
        if (StoredCardDC > 0) {
            $("#StoredDebitCards").prepend(dcHTML);
            $("#StoredDebitCardContainer").show();
        } else {
            $("#DebitCardForm .new_card_form").show();
        }
        if (StoredCards === null) {
            $(".StoreCardRow").hide();
            $("#StoredCreditCardContainer").hide();
            $("#StoredEmiCardContainer").hide();
            $("#StoredDebitCardContainer").hide();
            $(".new_card_form").show();
        }

        $(document).on("click", ".remove_store_card", function () {
//        $(".remove_store_card").live("click", function () {
            var con = confirm("Are you sure want to delete this card?");
            if (!con) {
                return false;
            }
            var Form = $(this).parents('.form');
            var token = $(this).attr('token');
            var Cat = $("#Category").val();
            var CurrCard = StoredCards[token];
            if (token != '0') {
                $.post('/cc/delete/' + token, {}, function () {
                    $(document).find("#CreditCardForm li[token='" + token + "']").remove();
                    $(document).find("#DebitCardForm li[token='" + token + "']").remove();
                    if (CurrCard.card_type == 'CC' && Cat == 'creditcard') {
                        $("#EmiForm li[token='" + token + "']").remove();
                    } else if (CurrCard.card_type == 'CC' && Cat == 'emi') {
                        $("#CreditCardForm li[token='" + token + "']").remove();
                    }
                    delete StoredCards[token];
                    if (Form.find(".store_card_selector").length == 0) {
                        $(document).find(".store_card_cvv").removeClass('validate');
                        $(document).find("#StoredCreditCardContainer").hide();
                        $(document).find("#StoredDebitCardContainer").hide();
                        $(document).find(".new_card_form").show();
                        if (CurrCard.card_type == 'CC' && Cat == 'creditcard') {
                            $("#EmiForm #StoredEmiCardContainer").hide();
                            $("#EmiForm .new_card_form").show();
                        } else if (CurrCard.card_type == 'CC' && Cat == 'emi') {
                            $("#CreditCardForm #StoredCreditCardContainer").hide();
                            $("#CreditCardForm .new_card_form").show();
                        }
                        $("#StoredCard").val('false').removeAttr('token');
                        Form.find(".new_card_form input[type='text'], .new_card_form select").addClass('validate');
                    }
                    if (token == $("#StoredCard").attr('token')) {
                        $("#StoredCard").val('false').removeAttr('token');
                    }
                });

            }
        });
//        $.each(PayU.getIbiboCodes(), function (Opt, OptObj) {
//            $("." + Opt).show();
//        });

        for (i = date.getFullYear(); i <= date.getFullYear() + 45; i++) {
            $(".ExpiryYear").append('<option value="' + i + '">' + i + '</option>');
        }

        $("#tabs li:visible a:first").click();
        $(".drop_down").click(function () {
            $(this).find('.dp_content').slideToggle('fast');
        });
        $(".checkbox span").click(function () {
            if ($(this).parents('.checkbox').hasClass('checked')) {
                $(this).parents('.checkbox').removeClass('checked');
//                $(this).parents('.checkbox').next(".card_label").slideToggle();
                $("#StoreCard").val('false');
            } else {
                $(this).parents('.checkbox').addClass('checked');
//                $(this).parents('.checkbox').next(".card_label").slideToggle();
                $("#StoreCard").val('true');
            }
        });
        $('.dp_content li').click(function () {
            $('.dp_content li').removeClass('sel');
            $(this).addClass('sel').parents('.drop_down').find('span').text($(this).text());
        });
        $("#CreditCardForm").validate();
        $("#DebitCardForm").validate();
        $("#NetBankingForm").validate();
        $("#EmiForm").validate();
        $("#CashCardForm").validate();
        $("#CodForm").validate();
        $(".HideCvvExpiry").click(function () {
            $(this).parents('.form').find('.three').parents('.row').find('input, select').attr('disabled', true).removeClass('validate error').addClass("disable").val("");
            $(this).hide().next('.ShowCvvExpiry').fadeIn();
        });
        $(".ShowCvvExpiry").click(function () {
            $(this).parents('.form').find('.three').parents('.row').find('input, select').attr('disabled', false).addClass('validate').removeClass("disable").val("");
            $(this).hide().prev('.HideCvvExpiry').fadeIn();
        });
        $(".ExpiryMonth, .ExpiryYear").change(function () {
            var ExpMonth = $(this).parents('.form').find('.ExpiryMonth');
            var ExpYear = $(this).parents('.form').find('.ExpiryYear');
            if (ExpMonth.val() != '' && ExpYear.val() != '') {
                var CurrentDate = new Date();
                var SelectedDate = new Date();
                SelectedDate.setMonth(ExpMonth.val() - 1);
                SelectedDate.setYear(ExpYear.val());
                if (CurrentDate.getTime() > SelectedDate.getTime()) {
                    ExpMonth.addClass('error');
                    ExpYear.addClass('error');
                } else {
                    ExpMonth.removeClass('error');
                    ExpYear.removeClass('error');
                }
            }
        });
        $("#NetBankingSelectBox").change(function () {
            $("#IbiboCode").val($(this).val());
            if ($(this).val() == 'CITNB') {
                $(this).val('');
                $("#tabs li a[category='debitcard']").click();
            }
        });
        var Top5NBOptions = [];
//        $.each(PayU.getTop5NetbankingCodes(), function (Ind, Obj) {
//            $("#NetBankingSelectBox").append('<option value="' + Ind + '">' + Obj.title + '</option>');
//            Top5NBOptions.push(Ind);
//        });
        $("#NetBankingSelectBox").append('<option value="-----------" disabled>--------------------</option>');
//        $.each(PayU.getIbiboCodes().netbanking, function (Ind, Obj) {
//            if (!Top5NBOptions.inArray(Ind)) {
//                $("#NetBankingSelectBox").append('<option value="' + Ind + '">' + Obj.title + '</option>');
//            }
//        });
        var EmiData = {};
//        $.each(PayU.getIbiboCodes().emi, function (ind, obj) {
//            $(EmiData).prop(obj.bank.BankName(), []);
//        });
//        $.each(PayU.getIbiboCodes().emi, function (ind, obj) {
//            obj.ibibo_code = ind;
//            var BankName = obj.bank.BankName();
//            EmiData[BankName].push(obj);
//        });

        $.each(EmiData, function (BankName, DurationArray) {
            $("#EmiBankSelectBox").append('<option value="' + BankName + '">' + BankName.replace("_", " ") + '</option>');
        });
        $("#EmiBankSelectBox").change(function () {
            $("#EmiCardContainer").slideUp('fast');
            $(".EmiBankChargesMessage").html("").parents(".row").hide();
            $(".EmiBankInterestMessage").html("").parents(".row").hide();
            $(".EmiInterest").parents('.row').hide();
            $(".EmiAmount2").parents('.row').hide();
            $("#EmiDurationSelectBox").html('<option value="">Select Duration</option>');
            if ($(this).val() != "") {
                $.each(EmiData[$(this).val()].sort(sort_by('title', true)), function (ind, obj) {
                    $("#EmiDurationSelectBox").append('<option value="' + obj.ibibo_code + '">' + obj.title + '</option>');
                });
                $("#EmiDurationSelectBox").attr("disabled", false).removeClass("disable");
            } else {
                $("#EmiDurationSelectBox").attr("disabled", true).addClass("disable");
            }
        });
//        $("#EmiDurationSelectBox").change(function () {
//            var EmiCharges = PayU.getEMIBankCharges()[$(this).val()];
//            if ($(this).val() != '') {
//                $("#EmiCardContainer").find('input, select').removeClass("error amex mastercard visa maestro diners");
//                $("#EmiCardContainer").slideDown('fast');
//                if (EmiCharges.bankCharge != "" && EmiCharges.bankCharge > 0 && EmiCharges.bankRate != null) {
//                    $(".EmiBankChargesMessage").html('An additional fee of ' + EmiCharges.bankRate + '% i.e. Rs. ' + EmiCharges.bankCharge + ' (Bank processing charges) will be applicable.').parents(".row").show();
//                } else {
//                    $(".EmiBankChargesMessage").html("").parents(".row").hide();
//                }
//                if (EmiCharges.emiBankInterest != null && parseInt(EmiCharges.emiBankInterest) > 0) {
//                    $(".EmiBankInterestMessage").html('An additional charge at the rate of ' + EmiCharges.emiBankInterest + '% per annum would be charged on your credit card.').parents(".row").show();
//                    $(".EmiAmount").text(EmiCharges.emi_value);
//                    $(".EmiInterest").text(parseFloat(EmiCharges.emi_interest_paid).toFixed(2)).parents('.row').fadeIn('fast');
//                    $(".EmiAmount2").parents(".row").hide();
//                } else {
//                    $(".EmiBankInterestMessage").html("").parents(".row").hide();
//                    $(".EmiAmount").parents(".row").hide();
//                    $(".EmiAmount2").text(EmiCharges.amount);
//                    $(".EmiTitle2").text($(this).find("option:selected").text()).parents('.row').fadeIn('fast');
//                }
//                $("#IbiboCode").val($(this).val());
//            } else {
//                $("#EmiCardContainer").slideUp('fast');
//                $(".EmiBankChargesMessage").html("").parents(".row").hide();
//                $(".EmiBankInterestMessage").html("").parents(".row").hide();
//                $(".EmiAmount").parents('.row').hide();
//                $(".EmiAmount2").parents('.row').hide();
//            }
//        });

//        $.each(PayU.getIbiboCodes().cashcard, function (ind, obj) {
//            $("#CashCardSelectBox").append('<option value="' + ind + '">' + obj.title + '</option>');
//        });

        $("#CashCardSelectBox").change(function () {
            if ($(this).val() != '') {
                $("#IbiboCode").val($(this).val());
            }
        });
        $(".help_link").click(function () {
            $("#PopupBox").hide().fadeIn("fast");
        });
        $("#LearnMoreOkButton").click(function () {
            $("#PopupBox").hide();
        });
    }
    var ResetAll = function () {
        $("#CreditCardForm").resetAll();
        $("#DebitCardForm").resetAll();
        $("#NetBankingForm").resetAll();
        $("#EmiForm").resetAll();
        $("#CashCardForm").resetAll();
        $("#CodForm").resetAll();
        CurrentCapta = getCaptcha();
        $("#CaptchaDiv span").text(CurrentCapta);
        $("#EmiForm").find("#EmiCardContainer").hide();
        $("#EmiForm").find(".EmiAmount").parents(".row").hide();
//        $("#EmiDurationSelectBox").html('<option value="">Select Duration</option>').attr("disabled", true).addClass("disable");
        $(".HideCvvExpiry, .ShowCvvExpiry").hide();
        $(".ErrorMessage").text("").hide();
        $("#StoredCard").val('false').removeAttr('token');
    };

    window.jQuery.prototype.resetAll = function () {
        $(this).find("input, select").not(":submit, :button").val("").removeClass("error").next(".icon").removeClass("visa maestro mastercard amex diners");
        $(this).find(".ExpiryMonthLabel, .ExpiryYearLabel").hide();
        $(this).find(".ExpiryYear, .ExpiryMonth").show();
    };

    Array.prototype.inArray = function (ind) {
        for (i = 0; i < this.length; i++) {
            if (ind == this[i]) {
                return true;
            }
        }
        return false;
    };

    String.prototype.reverse = function () {
        return this.split("").reverse().join("");
    };

    String.prototype.BankName = function () {
        return this.replace(/_?P[GM]/, "") + "_Bank";
    };

    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    };

    var sort_by = function (field, reverse, primer) {
        var key = primer ?
                function (x) {
                    return primer(x[field])
                } :
                function (x) {
                    return x[field]
                };
        reverse = [-1, 1][ +!!reverse];
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        };
    };

    $.fn.validate = function () {
        var Elements = $(this).find('.validate');
        var FormObj = $(this);
        FormObj.find("input[type='submit']").click(function () {
            var Elements = FormObj.find('.validate');
            return validateAll(Elements);
        });
        Elements.keyup(function () {
            $(this).removeClass('error');
            checkElement($(this), $(this).attr('validate'), '');
        }).keypress(function () {
            checkElement($(this), $(this).attr('validate'), '');
        }).keydown(function () {
            checkElement($(this), $(this).attr('validate'), '');
        }).change(function () {
            checkElement($(this), $(this).attr('validate'), '');
        }).blur(function () {
            checkElement($(this), $(this).attr('validate'), 'blur');
        });
        var validateAll = function (eObj) {
            var CanSubmit = true;
            $.each(eObj, function () {
                if ($(this).hasClass('validate') && !checkElement($(this), $(this).attr('validate'), 'submit')) {
                    CanSubmit = false;
                }
            });
            if (CanSubmit) {
                try {
//                    PayU.init($("#Category").val(), $("#IbiboCode").val());
                    var FormData = FormObj.serializeObject();
                    FormData.category = $("#Category").val();
                    FormData.ibibo_code = $("#IbiboCode").val();
                    if (($("#IbiboCode").val() == "MAES" || $("#IbiboCode").val() == "SMAE") && FormData.cvv == "") {
                        FormData.expiry_year = "2049";
                        FormData.expiry_month = "12";
                    }
                    if ($("#StoreCard").val() == 'true') {
//                        PayU.setStoreCard("true", FormData.store_card_label);
                        FormData.store_card = "1";
                    }
                    if ($("#StoredCard").val() == 'true') {
//                        PayU.setCardToken($("#StoredCard").attr("token"));
                        FormData.cvv = FormData.s_cvv;
                        FormData.storedCardId = $("#StoredCard").attr("token");
                    }
//                    PayU.setCardDetails(FormData.card_number, FormData.cvv, FormData.name_on_card, FormData.expiry_month, FormData.expiry_year);
//                        PayU.processForm();
//                    console.log(FormData);
                    $.post('', FormData, function (data) {
                        if (typeof data.error === 'undefined') {
                            mySubmit(data.url, 'POST', data.data);
                        } else {
                            alert(data.error);
                            FormObj.find("input[type='submit']").removeClass('disable').removeAttr("disabled");
                        }
                    });
                    FormObj.find("input[type='submit']").addClass('disable').attr("disabled", true);
                } catch (e) {
                    console.log(e.message);
                }
            }
            return false;
        };
        var checkElement = function (Element, FieldType, Flag) {
            if (!Element.hasClass('validate')) {
                return;
            }
            Element.removeClass('error');
            var ReturnFlag = true;
            if ((Flag == 'submit' || Flag == 'blur') && FieldType != 'card_label' && Element.val() == '' && Flag != '') {
                Element.addClass('error').next('.icon').removeClass('mastercard visa maestro diners amex');
                ReturnFlag = false;
            }

            if (FieldType == "card_number" && Element.val() == "") {
                Element.parents(".form").find(".ErrorMessage").text("").hide();
            }

            if (FieldType == 'card_number' && Element.val() != '') {
                var CardObject = GetCardType(Element.val());
                $("#Category").val($("#tabs li.sel a").attr('category'));
                Element.next('.icon').removeClass('mastercard visa maestro diners amex');
                if (CardObject) {
                    Element.next('.icon').addClass(CardObject.name);
                    if (CardObject.ibibocode == "AMEX" || CardObject.ibibocode == "DINR") {
                        $("#Category").val('creditcard');
                    } else if (CardObject.ibibocode == "MAES") {
                        $("#Category").val('debitcard');
                    }
                    if (CardObject.name == 'maestro' && Flag == '' && ($("#Category").val() == 'creditcard' || $("#Category").val() == 'debitcard')) {
                        if (!Element.parents(".form").find('.ShowCvvExpiry').is(":visible")) {
                            Element.parents(".form").find('.HideCvvExpiry').show();
                        }
                        if ($("#Category").val() == 'creditcard') {
                            $("#Category").val('debitcard');
                        }
                    }
                    if ($("#Category").val() == 'creditcard' && CardObject.ibibocode != "AMEX" && CardObject.ibibocode != "DINR") {
                        $("#IbiboCode").val("CC");
                    } else if ($("#Category").val() == "debitcard" && CardObject.ibibocode != "MAES" && CardObject.ibibocode != "MAST" && CardObject.ibibocode != "SMAE" && CardObject.ibibocode != "AMEX" && CardObject.ibibocode != "DINR") {
                        $("#IbiboCode").val("VISA");
                    } else if ($("#Category").val() != "emi" && $("#Category").val() != "cashcard") {
                        $("#IbiboCode").val(CardObject.ibibocode);
                    }
//                    if (CardObject.ibibocode == 'MAES' && typeof PayU.getIbiboCodes()[$("#Category").val()]['MAES'] == 'undefined' && typeof PayU.getIbiboCodes()[$("#Category").val()]['SMAE'] != 'undefined') {
//                        if (SbiBinList.inArray(Element.val().substr(0, 6))) {
//                            $("#IbiboCode").val('SMAE');
//                            $("#Category").val('debitcard');
//                        }
//                    }

                    if ($.inArray(Element.val().length, CardObject.valid_length) < 0 && (Flag == 'submit' || Flag == 'blur')) {
                        Element.addClass('error');
                        ReturnFlag = false;
                    }

                    if (CardObject.name == 'amex') {
                        Element.parents(".form").find('input[name="cvv"]').attr('maxlength', '4').attr('validate', 'cvv4');
                    } else {
                        Element.parents(".form").find('input[name="cvv"]').attr('maxlength', '3').attr('validate', 'cvv');
                    }

//                    if ($("#Category").val() != "emi" && typeof PayU.getIbiboCodes()['creditcard'][$("#IbiboCode").val()] == "undefined" && typeof PayU.getIbiboCodes()['debitcard'][$("#IbiboCode").val()] == "undefined") {
//                        Element.parents(".form").find(".ErrorMessage").text("This card not supported by merchant").show();
//                        Element.addClass('error');
//                        ReturnFlag = false;
//                    }
                }
                if (Flag == '' && CardObject == null) {
                    Element.parents(".form").find(".three").parents(".row").show().find('input, select').addClass('validate').attr('disabled', false).removeClass("disable");
                    Element.parents(".form").find('.HideCvvExpiry, .ShowCvvExpiry').hide();
                }
                if (!luhnChk(Element.val()) && (Flag == 'submit' || Flag == 'blur')) {
                    Element.addClass('error');
                    ReturnFlag = false;
                }
            }
            if ((FieldType == 'expiry_month' || FieldType == 'expiry_year') && (Flag == 'submit' || Flag == 'blur')) {
                var ExpMonth = Element.parents('.form').find('.ExpiryMonth');
                var ExpYear = Element.parents('.form').find('.ExpiryYear');
                if (ExpMonth.val() != '' && ExpYear.val() != '') {
                    var CurrentDate = new Date();
                    var SelectedDate = new Date();
                    SelectedDate.setMonth(ExpMonth.val() - 1);
                    SelectedDate.setYear(ExpYear.val());
                    if (CurrentDate.getTime() > SelectedDate.getTime()) {
                        ExpMonth.addClass('error');
                        ExpYear.addClass('error');
                        ReturnFlag = false;
                    }
                }
            }
            if (Element.val() != '' && !checkPattern(Element.val(), FieldType) && FieldType != 'captcha' && (Flag == 'submit' || Flag == 'blur')) {
                Element.addClass('error');
                ReturnFlag = false;
            }
            if (FieldType == 'captcha' && Flag != '') {
                if (Element.val() != CurrentCapta) {
                    Element.addClass('error');
                    ReturnFlag = false;
                }
            }
            return ReturnFlag;
        };
        var checkPattern = function (FieldValue, FiledType) {
            return FieldValue.match(VaidationRegex[FiledType]);
        };
    };
    var GetCardType = function (num) {
        for (var i = 0; i < CardTypes.length; i++) {
            if (num.match(CardTypes[i].pattern)) {
                return CardTypes[i];
            }
        }
        return null;
    };
    $.fn.serializeObject = function () {
        var e = {};
        var t = this.find("input, select").not("input:submit");
        $.each(t, function () {
            if (e[this.name] !== undefined) {
                if (!e[this.name].push) {
                    e[this.name] = [e[this.name]];
                }
                e[this.name].push(this.value || "");
            } else {
                e[this.name] = this.value || "";
            }
        });
        return e;
    };
    String.prototype.replaceArray = function (find, replace) {
        var replaceString = this;
        for (var i = 0; i < find.length; i++) {
            var regex = new RegExp(find[i], "g");
            replaceString = replaceString.replace(regex, replace[i]);
        }
        return replaceString;
    };
    function mySubmit(action, method, input) {
        'use strict';
        var form;
        form = $('<form />', {
            id: 'tmpForm',
            action: action,
            method: method,
            style: 'display: none;'
        });
        if (typeof input !== 'undefined' && input !== null) {
            $.each(input, function (name, value) {
                if (value !== null) {
                    $('<input />', {
                        type: 'hidden',
                        name: name,
                        value: value
                    }).appendTo(form);
                }
            });
        }
        form.appendTo('body').submit();
//        form.appendTo('body');
    }

    function luhnChk(luhn) {
        var len = luhn.length,
                mul = 0,
                prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
                sum = 0;
        while (len--) {
            sum += prodArr[mul][parseInt(luhn.charAt(len), 10)];
            mul ^= 1;
        }

        return sum % 10 === 0 && sum > 0;
    }

    function currencyChange(currencyId) {
//        console.log(currencyId);
        $.post('/payGate/changeCurrency/<?php echo $model->id; ?>', {toCurrencyId: currencyId}, function (html) {
            $('#currencyBox').html(html);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        defer();
    }, false);

</script>
<div id="StoreCardLiTemplate" style="display:none;">
    <li class="store_card_selector" token="{{token}}">
        <input type="radio" name="store_card_radio" token="{{token}}" class="radio store_card_radio" value="1"/>
        <div class="store_card_icon"><span class="{{brand}}"></span></div>
        <div class="store_card_label">{{card_name}}<span>{{card_number}}</span></div>
        <div class="cvv_div"><input name="s_cvv" type="password" maxlength="{{cvv_max}}" class="textbox store_card_cvv validate" validate="{{cvv_validate}}" placeholder="CVV" autocomplete="off" >
            <span class="cvv_optional">Optional</span>
        </div>
        <a href="javascript:void(0);" class="remove_store_card" token="{{token}}">Delete Card</a>
    </li>
</div>
</form>