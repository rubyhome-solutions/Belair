'use strict';

require('jquery.payment');

var Input = require('../input'),
         _ = require('lodash'),
    $ = require('jquery');

module.exports = Input.extend({
    data: function() {
        return {
             type: 'tel'
           // type: 'password'
        };
    },

    oncomplete: function() {
        this._super();
        var view=this;
        $(this.find('input')).payment('formatCardExpiry');
        $(this.find('input')).keyup(function() {
            var booking = view.get('booking');
        
        var cardexpiry=$(view.find('input')).val();
     //   console.log(cardexpiry);
        if(cardexpiry !=null && cardexpiry !=''){
            cardexpiry.replace(/ /g,'');
            var cardarr=cardexpiry.split('/');
            if(cardarr[0]!= null){
            booking.set('payment.cc.exp_month',_.parseInt(cardarr[0]));}
        if(cardarr[1]!= null){
            var len=cardarr[1].length;
            var cardyear=_.parseInt(cardarr[1]);
            if(cardyear<100){
                cardyear=2000+cardyear;
            }else if(cardyear<1000){
                cardyear=2000+cardyear;
            }
        //    console.log(cardyear);
            booking.set('payment.cc.exp_year',cardyear);}
        }
          });
    },

    onteadown: function() {
        $(this.find('input')).payment('destroy');
    }
});