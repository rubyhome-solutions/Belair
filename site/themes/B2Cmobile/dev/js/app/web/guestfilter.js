'use strict';

var  GuestFilter = require('components/guestticket/guestfilter');
     
require('web/modules/guestfilter.less');

//$(function() {
//    console.log('Inside Main mybookings');
//    var mybookings = new Mybookings();
//    var user = new User();    
//
//    mybookings.render('#content');
//    user.render('#panel');
//});


$(function() {
    (new GuestFilter()).render('#app');
});