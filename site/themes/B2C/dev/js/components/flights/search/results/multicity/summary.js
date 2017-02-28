'use strict';

var Form = require('core/form'),
    _ = require('lodash'),
    moment = require('moment')
    ;

module.exports = Form.extend({
    isolated: true,
    template: require('templates/flights/search/results/multicity/summary.html'),

    components: {
        flights: require('../flights')
    },

    data: function() {
        return {
            percent: function(array) { return 100/array.length; }
        };
    }
});