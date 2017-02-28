'use strict';

var _ = require('lodash'),
    $ = require('jquery')
    ;
require('jquery.payment');
var Form = require('core/form'),

    h_money = require('helpers/money'),
    h_duration = require('helpers/duration')(),
    h_date = require('helpers/date')(),
    accounting = require('accounting.js')
    ;


module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/booking/step3.html'),

    components: {
        'ui-cc': require('core/form/cc/number'),
        'ui-cvv': require('core/form/cc/cvv'),
        'ui-expiry': require('core/form/cc/cardexpiry')
    },
    
    data: function() {
        return {
            promocode:null,
            promovalue:null,
            promoerror:null,
            accepted:true,
            money: h_money,
            duration: h_duration,
            date: h_date,
            banks: [
                
                {id: 'AXIB' , text: 'AXIS Bank' , logo: 'axis_bank'},// {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
                {id: '1045' , text: 'Bank of Baroda Corporate' , logo: 'bank_of_baroda'},
                {id: '1046' , text: 'Bank of Baroda Retail' , logo: 'bank_of_baroda'},
                {id: 'BOIB' , text: 'Bank of India' , logo: 'bank_of_india'},//Payu {id: 'BOIB' , text: 'Bank of India' }, Atom {id: '1012' , text: 'Bank of India' },
                {id: 'BOMB', text: 'Bank of Maharashtra' , logo: 'bank_of_maharashtra'},//Payu {id: 'BOMB', text: 'Bank of Maharashtra'},
                {id: '1030', text: 'Canara Bank NetBanking' , logo: 'canara_bank'},//{id: 'CABB', text: 'Canara Bank'},
                {id: '1034', text: 'Canara Bank DebitCard' , logo: 'canara_bank'},
                {id: 'CSBN', text: 'Catholic Syrian Bank' , logo: 'catholic_syrian_bank'},
                {id: 'CBIB', text: 'Central Bank Of India' , logo: 'central_bank_of_india'},//{id: 'CBIB', text: 'Central Bank Of India'},
                {id: '1020', text: 'City Union Bank' , logo: 'city_union_bank'},//{id: 'CUBB', text: 'CityUnion'},
                /*{id: 'CITNB', text: 'Citi Bank NetBanking' , logo: 'citi_bank_netbanking'},*/
                {id: 'CRPB', text: 'Corporation Bank' , logo: 'corporation_bank'},//{id: 'CRPB', text: 'Corporation Bank'},
                {id: '1047', text: 'DBS Bank Ltd' , logo: 'dsb_bank'},
                {id: '1042', text: 'DCB Bank Business' , logo: 'dcb_bank'},//{id: 'DCBB', text: 'Development Credit Bank'},
                {id: '1027', text: 'DCB Bank Personal' , logo: 'dcb_bank'},
                {id: 'DSHB', text: 'Deutsche Bank' , logo: 'deutsche_bank'},//{id: 'DSHB', text: 'Deutsche Bank'},
                {id: 'DLSB', text: 'Dhanlaxmi Bank' , logo: 'dhanlakshmi_bank'},
                {id: 'FEDB', text: 'Federal Bank' , logo: 'federal_bank'},//{id: 'FEDB', text: 'Federal Bank'},
                {id: 'HDFB', text: 'HDFC Bank' , logo: 'hdfc_bank'},
                {id: 'ICIB', text: 'ICICI Netbanking' , logo: 'icici_bank'},
                {id: 'IDBB', text: 'IDBI Bank' , logo: 'idbi_bank'},//{id: 'IDBB', text: 'Industrial Development Bank of India'},
                {id: 'INDB', text: 'Indian Bank ' , logo: 'indian_bank'},//{id: 'INDB', text: 'Indian Bank '},
                {id: 'INIB', text: 'IndusInd Bank' , logo: 'indusind_bank'},//{id: 'INIB', text: 'IndusInd Bank'},
                {id: 'INOB', text: 'Indian Overseas Bank' , logo: 'indian_overseas_bank'},//{id: 'INOB', text: 'Indian Overseas Bank'},
                {id: 'JAKB', text: 'Jammu and Kashmir Bank' , logo: 'j_k_bank'},//{id: 'JAKB', text: 'Jammu and Kashmir Bank'},
                {id: 'KRKB', text: 'Karnataka Bank' , logo: 'karnataka_bank'},//{id: 'KRKB', text: 'Karnataka Bank'},
                {id: '1018', text: 'Karur Vysya ' , logo: 'karur_vysya'},//{id: 'KRVB', text: 'Karur Vysya '},
                {id: '162B', text: 'Kotak Mahindra Bank' , logo: 'kotak_mahindra_bank'},//{id: '162B', text: 'Kotak Bank'}
                {id: '1009', text: 'Lakshmi Vilas Bank NetBanking' , logo: 'lakshmi_vilas'},
                {id: 'OBCB', text: 'Oriental Bank Of Commerce' , logo: 'obc'},
                {id: 'PSBNB', text: 'Punjab And Sind Bank' , logo: 'punjab_sindh_bank'}, //{id: 'PSBNB', text: 'Punjab And Sind Bank'},
                {id: 'PNBB', text: 'Punjab National Bank – Retail' , logo: 'pnb_retail'},
                /*{id: '1050', text: 'Royal Bank Of Scotland' , logo: 'royal_bank_scotland'},*/
                /*{id: '1053', text: 'SaraSwat Bank' , logo: 'saraswat_bank'},*/
                {id: '1051', text: 'Standard Chartered Bank' , logo: 'standard_chartered'},
                {id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur' , logo: 'sbbj'},//{id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
                {id: 'SBHB', text: 'State Bank of Hyderabad' , /*logo: 'sbhb'*/},//{id: 'SBHB', text: 'State Bank of Hyderabad'},
                {id: 'SBIB', text: 'State Bank of India' , logo: 'sbib'},//{id: 'SBIB', text: 'State Bank of India'},
                {id: 'SBMB', text: 'State Bank of Mysore' , /*logo: 'sbmb'*/},//{id: 'SBMB', text: 'State Bank of Mysore'},
                {id: 'SBPB', text: 'State Bank of Patiala' , logo: 'sbpb'},//{id: 'SBPB', text: 'State Bank of Patiala'},
                {id: 'SBTB', text: 'State Bank of Travancore' , /*logo: 'sbtb'*/},//{id: 'SBTB', text: 'State Bank of Travancore'},
                {id: 'SOIB', text: 'South Indian Bank' , logo: 'south_indian_bank'},//{id: 'SOIB', text: 'South Indian Bank'},
                {id: 'UBIB', text: 'Union Bank of India' , logo: 'union_bank_of_india'},
                {id: 'UNIB', text: 'United Bank Of India' , logo: 'united_bank'},//{id: 'UNIB', text: 'United Bank Of India'},
                {id: 'VJYB', text: 'Vijaya Bank' , logo: 'vijya_bank'},//{id: 'VJYB', text: 'Vijaya Bank'},
                {id: 'YESB', text: 'Yes Bank' , logo: 'yes_bank'},//{id: 'YESB', text: 'Yes Bank'},
                {id: 'TMBB', text: 'Tamilnad Mercantile Bank' , logo: 't_m_bank'},
                {id: '1016', text: 'Union Bank' , logo: 'union_bank'},
                //    {id: '2001', text: ' ATOM Test bank'},
 
            ],
            wallets :[
                {id: '1001', text: 'MobiKwik', logo: 'mobikwik_background'},
                {id: '1002', text: 'Paytm', logo: 'paytm_background'},
                {id: '1003', text: 'Idea Money', logo: 'ideamoney_background'},
                {id: '1004', text: 'FreeCharge', logo: 'freecharge_background'},
                {id: '1005', text: 'Oxigen', logo: 'oxigen_background'},
                {id: '1006', text: 'SBI Buddy', logo: 'sbi_buddy_background'},
                {id: '1007', text: 'The Mobile Wallet', logo: 'the_mobile_wallet'},
                {id: '1008', text: 'jioMoney', logo: 'jiomoney_background'},
                {id: '1009', text: 'Jana Cash', logo: 'janacach_background'},
                {id: '1010', text: 'Ziggit by IDFC Bank', logo: 'ziggit_background'},
                {id: '1011', text: 'ICash Card', logo: 'icash_background'}
            ],
            formatYear: function (year) {
                return year.slice(-2);;
            },
            formatPayMoney:function(amount){
                return accounting.formatMoney(amount, '<i class="inr icon currency"></i>', 0);
            }
        }
       
    },

    onconfig: function() {
        var view = this;
 
        
        this.observe('booking.steps.3.active', function(active) {
            if (active) {
                view.CCAvenueEMI();
                view.get('booking').setCurrentStepForMobile(3);
                $.ajax({
                    type: 'GET',
                    url: '/b2c/booking/cards',
                    data: { booking_id: this.get('booking.id') },
                    success: function(data) {
                        if (data.length) {
                            view.set('cards', data);
                            //view.setCard(data[data.length - 1]);
                        } else {
                            view.set('cards', null);
                        }
                    }
                });
                 view.set('promocode',view.get('booking.promo_code'));
                 view.set('promovalue',view.get('booking.promo_value'));
            }
        });

        this.observe('booking.payment.active', function() {
            if (this.get('booking')) {
                //view.clearForm();
                this.get('booking').resetPayment();
                this.set('booking.steps.3.errors', false);
                if(this.get('booking.payment.active') === 6) {
                    this.get('booking').pymtConvFee(7 , -1, null); // for UPI
                }
            }
        }, {init: false});
        
      
    },


    submit: function() { 
        //var booking = this.get('booking');
        //console.log(booking);
        //alert(this.get('booking.payment.netbanking.net_banking'));
        //alert(this.get('booking.payment.netbanking.net_banking'));
        
//        var cardexpiry=$('#cc-exp').val();
//        console.log(cardexpiry);
//        if(cardexpiry !=null && cardexpiry !=''){
//            cardarr=cardexpiry.split('/');
//            booking.set('payment.cc.exp_month',trim(cardarr[0]));
//            booking.set('payment.cc.exp_year',trim(cardarr[1]));
//        }
        if(this.get('booking.convfeeflag') === false) {
            alert('Please wait and click again on Book Flight')
            return;
        }
        this.get('booking').step3();
    },
    setCard: function(cc) {
        var booking = this.get('booking');

        if (booking.get('payment.cc.id') !== cc.id) {
            booking.set('payment.cc', cc);
        } else {
            booking.set('payment.cc', {});
        }

    },

    resetCC: function(event) {
        var booking = this.get('booking'),
            e = event.original,
            el = $(e.srcElement),
            id = booking.get('payment.cc.id'),
            yup = 0 == el.parents('.ui.input.cvv').size() && (('INPUT' == el[0].tagName) || el.hasClass('dropdown') || el.parents('.ui.dropdown').size());

        if (id && yup) {
            booking.set('payment.cc', {});
        }
    },

    back: function() {
        this.get('booking').activate(2);
    },

    applyPromoCode:function(){
         
          var promocode=this.get('promocode');
          this.set('promoerror',null);
         
        var view = this;
                
        var data = {id: this.get('booking.id'),promo:promocode};
        $.ajax({
            timeout: 10000,
            type: 'POST',
            url: '/b2c/booking/checkPromoCode',
            data: data,
            dataType: 'json',
            complete: function () {

            },
            success: function (data) {
                if(data.hasOwnProperty('error')){                    
                    console.log(data.error);
                    view.set('promoerror',data.error);
                }else if(data.hasOwnProperty('value')){
                    view.set('promovalue',data.value);
                    view.set('booking.promo_value',data.value); 
                    view.set('booking.promo_code',data.code); 
                }
            },
            error: function (xhr) {
            }
        });
         
    },
    removePromoCode:function(){
     //   console.log('removePromoCode');
        this.set('promoerror',null);
        this.set('promocode',null);
        this.set('promovalue',null); 
        
        var view = this;      
        var data = {id: this.get('booking.id')};
        $.ajax({
            timeout: 10000,
            type: 'POST',
            url: '/b2c/booking/removePromoCode',
            data: data,
            dataType: 'json',
            complete: function () {

            },
            success: function (data) {
                view.set('booking.promo_value',null); 
                view.set('booking.promo_code',null);               
               
            },
            error: function (xhr) {
            }
        });
    },
    removeErrorMsg:function(){
        this.set('promoerror',null);
    },
    checkExpiry:function(){
         $.fn.toggleInputError = function(erred) {
        this.parent('.form-group').toggleClass('has-error', erred);
        return this;
      };
      $('.cc-exp').val();
      $.payment.validateCardExpiry('05', '20'); //=> true
         $('.cc-exp').toggleInputError(!$.payment.validateCardExpiry($('.cc-exp').payment('cardExpiryVal')));
         $('.validation').removeClass('text-danger text-success');
         $('.validation').addClass($('.has-error').length ? 'text-danger' : 'text-success');
    },
    CCAvenueEMI: function() {
        
        var view = this,
        response,
        jsonData,
        value,
        value1,
        index,
        index1,data1,data2,
        plans_emi
        ;
        response = $.ajax({
            type: 'POST',
            data: { id: view.get('booking.id'), emi_flag: 'payment_emi' },
            url: '/b2c/Booking/CCAvenueEMI',
        });
        response.done(function(data) {
            if ( data != '') {
                try{
                    jsonData = JSON.parse(data);
                } catch (e) {
                    return false;
                }
                view.set('emiOptions', jsonData);
                $.each(jsonData, function(index, value) {
                    if(value.payOpt == 'OPTEMI') {
                        view.set('emiPaymentReady', true);
                        view.set('booking.payment.emi.payment_option', value.payOpt);
                        view.set('emi_banks',JSON.parse(value.EmiBanks));
                        plans_emi = JSON.parse(value.EmiPlans);
                        $.each(plans_emi, function(index1, value1) {
                            value1.emiAmount = value1.emiAmount.toFixed(2);
                            value1.total = value1.total.toFixed(2);
                        });
                        view.set('emi_plans', plans_emi);
                    }
               });
            }
        });
        response.error(function(data) {
            view.set('emi_unavailable', data.responseJSON.message);
        });
    },
    showEmiPlans: function() {
    	var view = this;
    	view.set('selectedPlan', $("#emi_banks").val());
    	view.set('booking.payment.emi.planId', $("#emi_banks").val());
    	view.set('showEmiPlans', true);
    },
    showCardFields: function() {
    	var view = this;
        $.each(view.get('emi_plans'), function(index, value) {
            if(value.planId == view.get('booking.payment.emi.planId')) {
                view.set('booking.payment.emi.emi_tenure_id', value.tenureId);
                view.set('booking.payment.emi.currency', value.currency);
            }
        });
        view.set('readyCardFields', true);
    }
});
