'use strict';

var  CMS = require('components/cms/index');
     
require('web/modules/mybookings/mybookings.less');

$(function() {
    (new CMS()).render('#app');
});