'use strict';

var  Mybookings = require('components/mybookings/mybookings');
     
require('web/modules/mybookings/mybookings.less');
//$(function() {
//    console.log('Inside Main mybookings');
//    var mybookings = new Mybookings();
//    var user = new User();    
//
//    mybookings.render('#content');
//    user.render('#panel');
//});


$(function() {
    (new Mybookings()).render('#app');
});