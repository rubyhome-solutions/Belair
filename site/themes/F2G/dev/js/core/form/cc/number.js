'use strict';

require('jquery.payment');

var Input = require('../input'),
    $ = require('jquery');

module.exports = Input.extend({
    template: require('templates/components/form/cc.html'),

    oncomplete: function() {
        this._super();

        $(this.find('input')).payment('formatCardNumber');

      this.observe('value', function(value) {
            this.set('cctype', $.payment.cardType(value));
            var booking = this.parent.get('booking');
            if(booking && typeof value !== 'undefined'){
                var bin_digits = value.replace(' ','').slice(0,6);
                if(value == '' || bin_digits.length < 6){
                    booking.set('convenienceFee', 0);
                    window.prevCCType = undefined;
                    window.prevCardType = undefined;
                } else if((this.get('cctype') != window.prevCCType || 
                        this.get('cardType') != window.prevCardType) && 
                        bin_digits.length >= 6) {
                    var card_type = parseInt(this.get('cardType')) + 1;
                        
                        
                    booking.pymtConvFee(card_type ,this.get('cctype'), bin_digits);

                    window.prevCCType = this.get('cctype');
                    window.prevCardType = this.get('cardType');
                }
            }
        }, {init: false});
    },

    onteadown: function() {
        $(this.find('input')).payment('destroy');
    }
});