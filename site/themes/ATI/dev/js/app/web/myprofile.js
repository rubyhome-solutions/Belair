'use strict';

var  Myprofile = require('components/myprofile/index');
     
     require('web/modules/mytraveller/mytraveller.less');

$(function() {
    (new Myprofile()).render('#app');
});