'use strict';

var  Mytraveller = require('components/mytraveller/mytraveller');
     
     require('web/modules/mytraveller/mytraveller.less');
//$(function() {
//    console.log('Inside Main mytraveller');
//    var mytraveller = new Mytraveller();
//    var user = new User();    
//
//    mytraveller.render('#content');
//    user.render('#panel');
//});

$(function() {
    (new Mytraveller()).render('#app');
});