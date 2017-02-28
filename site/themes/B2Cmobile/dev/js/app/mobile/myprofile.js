'use strict';

var  Myprofile = require('components/myprofile/index');
     
     require('mobile/mytraveller.less');

$(function() {
    (new Myprofile()).render('#app');
});