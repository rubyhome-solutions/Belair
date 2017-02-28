'use strict';

var accounting = require('accounting.js')
    ;

var Meta = require('stores/flight/meta')
    ;

module.exports = function(amount) {
    if (Meta.object) {
        return accounting.formatMoney(
            amount * Meta.object.get('xChange')[Meta.object.get('display_currency')],
            '<i class="' + Meta.object.get('display_currency').toLowerCase()  + ' icon currency"></i>',
            0
        );
    }

    return accounting.formatMoney(amount, '<i class="inr icon currency"></i>', 0);
};