'use strict';

var  ContactUs = require('components/contactus/index');
require('web/modules/contactus.css');

require('components/contactus/contactusjs/jquery');
require('components/contactus/contactusjs/jquery.min');
require('components/contactus/contactusjs/tab');
require('components/contactus/contactusjs/popup.min');
require('components/contactus/contactusjs/transition');


$(function() {
    (new ContactUs()).render('#app');
});