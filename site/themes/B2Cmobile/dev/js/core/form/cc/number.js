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
        }, {init: false});
    },

    onteadown: function() {
        $(this.find('input')).payment('destroy');
    }
});