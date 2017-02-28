'use strict';

var $ = require('jquery')
    ;

var Payment = require('components/payment')
    ;

require('web/modules/payment.less');

$(function() {
    var payment = new Payment();
    payment.set('payment', $('[data-payment]').data('payment'));
    //console.log($('[data-payment]').data('payment'));
    //console.log(payment.get('payment'));
    payment.render('#app');
});