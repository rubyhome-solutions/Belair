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
                
                {id: '1003' , text: 'AXIS Bank' },// {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
                {id: '1045' , text: 'Bank of Baroda Corporate' },
                {id: '1046' , text: 'Bank of Baroda Retail' },
                {id: 'BOIB' , text: 'Bank of India' },//Payu {id: 'BOIB' , text: 'Bank of India' }, Atom {id: '1012' , text: 'Bank of India' },
                {id: '1033', text: 'Bank of Maharashtra'},//Payu {id: 'BOMB', text: 'Bank of Maharashtra'},
                {id: '1030', text: 'Canara Bank NetBanking'},//{id: 'CABB', text: 'Canara Bank'},
                {id: '1034', text: 'Canara Bank DebitCard'},
                {id: '1031', text: 'Catholic Syrian Bank'},
                {id: '1028', text: 'Central Bank Of India'},//{id: 'CBIB', text: 'Central Bank Of India'},
                {id: '1020', text: 'City Union Bank'},//{id: 'CUBB', text: 'CityUnion'},
                {id: 'CITNB', text: 'Citi Bank NetBanking'},
                {id: '1004', text: 'Corporation Bank'},//{id: 'CRPB', text: 'Corporation Bank'},
                {id: '1047', text: 'DBS Bank Ltd'},
                {id: '1042', text: 'DCB BANK Business'},//{id: 'DCBB', text: 'Development Credit Bank'},
                {id: '1027', text: 'DCB BANK Personal'},
                {id: '1024', text: 'Deutsche Bank'},//{id: 'DSHB', text: 'Deutsche Bank'},
                {id: '1038', text: 'Dhanlaxmi Bank'},
                {id: '1019', text: 'Federal Bank'},//{id: 'FEDB', text: 'Federal Bank'},
                {id: 'HDFB', text: 'HDFC Bank'},
                {id: 'ICIB', text: 'ICICI Netbanking'},
                {id: '1007', text: 'IDBI Bank'},//{id: 'IDBB', text: 'Industrial Development Bank of India'},
                {id: '1026', text: 'Indian Bank '},//{id: 'INDB', text: 'Indian Bank '},
                {id: '1015', text: 'IndusInd Bank'},//{id: 'INIB', text: 'IndusInd Bank'},
                {id: '1029', text: 'Indian Overseas Bank'},//{id: 'INOB', text: 'Indian Overseas Bank'},
                {id: '1001', text: 'Jammu and Kashmir Bank'},//{id: 'JAKB', text: 'Jammu and Kashmir Bank'},
                {id: '1008', text: 'Karnataka Bank'},//{id: 'KRKB', text: 'Karnataka Bank'},
                {id: '1018', text: 'Karur Vysya '},//{id: 'KRVB', text: 'Karur Vysya '},
                {id: '1013', text: 'Kotak Mahindra Bank'},//{id: '162B', text: 'Kotak Bank'}
                {id: '1009', text: 'Lakshmi Vilas Bank NetBanking'},
                {id: '1035', text: 'ORIENTAL BANK OF COMMERCE'},
                {id: '1055', text: 'Punjab And Sind Bank'}, //{id: 'PSBNB', text: 'Punjab And Sind Bank'},
                {id: '1049', text: 'Punjab National Bank – Retail'},
                {id: '1050', text: 'Royal Bank Of Scotland'},
                {id: '1053', text: 'SaraSwat Bank'},
                {id: '1051', text: 'Standard Chartered Bank'},
                {id: '1023', text: 'State Bank of Bikaner and Jaipur'},//{id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
                {id: '1017', text: 'State Bank of Hyderabad'},//{id: 'SBHB', text: 'State Bank of Hyderabad'},
                {id: '1014', text: 'State Bank of India'},//{id: 'SBIB', text: 'State Bank of India'},
                {id: '1021', text: 'State Bank of Mysore'},//{id: 'SBMB', text: 'State Bank of Mysore'},
                {id: '1036', text: 'State Bank of Patiala'},//{id: 'SBPB', text: 'State Bank of Patiala'},
                {id: '1025', text: 'State Bank of Travancore'},//{id: 'SBTB', text: 'State Bank of Travancore'},
                {id: '1022', text: 'South Indian Bank'},//{id: 'SOIB', text: 'South Indian Bank'},
                {id: 'UBIB', text: 'Union Bank of India'},
                {id: '1041', text: 'United Bank Of India'},//{id: 'UNIB', text: 'United Bank Of India'},
                {id: '1039', text: 'Vijaya Bank'},//{id: 'VJYB', text: 'Vijaya Bank'},
                {id: '1005', text: 'Yes Bank'},//{id: 'YESB', text: 'Yes Bank'},
                {id: '1044', text: 'Tamilnad Mercantile Bank'},
                {id: '1016', text: 'Union Bank'},
             //    {id: '2001', text: ' ATOM Test bank'},
                
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
                $.ajax({
                    type: 'GET',
                    url: '/b2c/booking/cards',
                    data: { booking_id: this.get('booking.id') },
                    success: function(data) {
                        if (data.length) {
                            view.set('cards', data);
                            view.setCard(data[data.length - 1]);
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
            if (this.get('booking'))
                this.set('booking.steps.3.errors', false);
        }, {init: false});
        
       
    },


    submit: function() { 
        var booking = this.get('booking');
        console.log(booking);
        //alert(this.get('booking.payment.netbanking.net_banking'));
        //alert(this.get('booking.payment.netbanking.net_banking'));
        
//        var cardexpiry=$('#cc-exp').val();
//        console.log(cardexpiry);
//        if(cardexpiry !=null && cardexpiry !=''){
//            cardarr=cardexpiry.split('/');
//            booking.set('payment.cc.exp_month',trim(cardarr[0]));
//            booking.set('payment.cc.exp_year',trim(cardarr[1]));
//        }
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
                console.log(data);
                console.log(view.get('promovalue'));
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
    }


});