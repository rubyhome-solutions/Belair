'use strict';

var  Mybookings = require('components/mybookings/mybookings');
require('mobile/mybookings.less');

$(function() {
    (new Mybookings()).render('#app');
});