'use strict';

var Form = require('core/form'),
        _ = require('lodash'),
        moment = require('moment'),
        contactUs = require('stores/contactus/contactus'),
        validate = require('validate')
        ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/contactus/form.html'),
    components: {
       
    },
    data: function () {
        
    },
    onconfig: function (options) {
        

    },
    oninit: function (options) {
      
        
    },
    oncomplete: function () {
		
        
    }
});