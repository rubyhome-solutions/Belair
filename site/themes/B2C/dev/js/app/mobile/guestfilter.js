'use strict';

var  GuestFilter = require('components/guestticket/guestfilter');
require('mobile/guestfilter.less');

$(function() {
    (new GuestFilter()).render('#app');
});