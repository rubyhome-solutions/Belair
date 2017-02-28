'use strict';

var _ = require('lodash')
    ;

var Form = require('core/form'),

    h_money = require('helpers/money')(),
    h_duration = require('helpers/duration')(),
    h_date = require('helpers/date')()
    ;


module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/booking/step4.html'),
    back: function() {
        this.get('booking').activate(3);
    },
        
   });