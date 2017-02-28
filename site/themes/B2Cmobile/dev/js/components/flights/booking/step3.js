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
                {id: 'AXIB' , text: 'AXIS Bank NetBanking' },
                {id: 'BOIB' , text: 'Bank of India' },
                {id: 'BOMB', text: 'Bank of Maharashtra'},
                {id: 'CBIB', text: 'Central Bank Of India'},
                {id: 'CRPB', text: 'Corporation Bank'},
                {id: 'DCBB', text: 'Development Credit Bank'},
                {id: 'FEDB', text: 'Federal Bank'},
                {id: 'HDFB', text: 'HDFC Bank'},
                //{id: 'ICIB', text: 'ICICI Netbanking'},
                {id: 'IDBB', text: 'Industrial Development Bank of India'},
                {id: 'INDB', text: 'Indian Bank '},
                {id: 'INIB', text: 'IndusInd Bank'},
                {id: 'INOB', text: 'Indian Overseas Bank'},
                {id: 'JAKB', text: 'Jammu and Kashmir Bank'},
                {id: 'KRKB', text: 'Karnataka Bank'},
                {id: 'KRVB', text: 'Karur Vysya '},
                {id: 'SBBJB', text: 'State Bank of Bikaner and Jaipur'},
                {id: 'SBHB', text: 'State Bank of Hyderabad'},
                {id: 'SBIB', text: 'State Bank of India'},
                {id: 'SBMB', text: 'State Bank of Mysore'},
                {id: 'SBTB', text: 'State Bank of Travancore'},
                {id: 'SOIB', text: 'South Indian Bank'},
                {id: 'UBIB', text: 'Union Bank of India'},
                {id: 'UNIB', text: 'United Bank Of India'},
                {id: 'VJYB', text: 'Vijaya Bank'},
                {id: 'YESB', text: 'Yes Bank'},
                {id: 'CUBB', text: 'CityUnion'},
                {id: 'CABB', text: 'Canara Bank'},
                {id: 'SBPB', text: 'State Bank of Patiala'},
                {id: 'CITNB', text: 'Citi Bank NetBanking'},
                {id: 'DSHB', text: 'Deutsche Bank'},
                {id: '162B', text: 'Kotak Bank'}
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