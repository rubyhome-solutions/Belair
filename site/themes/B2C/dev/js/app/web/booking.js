'use strict';

var Booking = require('components/flights/booking')
    ;

require('web/modules/booking.less');

$(function() {
    (new Booking()).render('#app');
});