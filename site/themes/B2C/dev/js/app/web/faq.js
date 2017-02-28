'use strict';

var  ContactUs = require('components/faq/index');
require('web/modules/faq.css');

require('components/contactus/contactusjs/dropdown.min');
require('components/contactus/contactusjs/jquery.min');
require('components/contactus/contactusjs/tab');
require('components/contactus/contactusjs/popup.min');
require('components/contactus/contactusjs/transition');


$(function() {
    (new ContactUs()).render('#app');
});