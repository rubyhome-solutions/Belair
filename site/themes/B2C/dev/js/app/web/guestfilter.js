'use strict';

var  GuestFilter = require('components/guestticket/guestfilter');
// var SearchForm = require('pages/flights/search_custom');
// var SearchForm = require('pages/flights/search');
     
require('web/modules/guestfilter.less');
require('web/modules/flights.less');

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
    // (new SearchForm()).render('#app');
});